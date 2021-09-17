using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;

public partial class Job_DLG_FileUpload : System.Web.UI.Page
{
    string strDataType = "ZF"; // File ID의 Prefix로만 사용함 by JJJ
    string strNetwork = "HTTP";

    protected void Page_Load(object sender, EventArgs e)
    {
        TimeSpan ts = new TimeSpan(0, 5, 0);
        this.AsyncTimeout = ts;

        //NameValueCollection lstParam = Request.QueryString;
        //if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        //    strData = "KMF";
        //else
        //    strData = lstParam["DATA_TYPE"].ToString();
       
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        #region 1. Mapping Argument.
        TimeSpan ts = new TimeSpan(0, 5, 0);
        this.AsyncTimeout = ts;

        // 1. Mapping Argument.
        //
        string strName = e.UploadedFile.FileName;
        string [] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;
        
        
        #endregion
        
        SqlConnection objCon = null;
        SqlTransaction objTran = null;
        SqlCommand objCmd = null;
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();
            objTran = objCon.BeginTransaction();

            string strSQL = "sp_getNewFileID";
            objCmd = new SqlCommand(strSQL, objCon, objTran);
            objCmd.CommandText = strSQL;
            objCmd.Parameters.AddWithValue("@FileName", strName);
            objCmd.Parameters.AddWithValue("@DataType", strDataType);
            objCmd.Parameters.AddWithValue("@NetworkCode", strNetwork);
            objCmd.Parameters.Add("@FileID", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
            objCmd.Parameters.Add("@FilePath", SqlDbType.VarChar, 255).Direction = ParameterDirection.Output;
            objCmd.CommandType = CommandType.StoredProcedure;
            
            objCmd.ExecuteNonQuery();
            objTran.Commit();

            // 4. Get Result.
            string strID = objCmd.Parameters["@FileID"].Value.ToString();
            string strPath = objCmd.Parameters["@FilePath"].Value.ToString();
            if (string.IsNullOrEmpty(strID) || string.IsNullOrEmpty(strPath))
            {
                throw new Exception ("저장할 파일 ID와 경로를 가져올 수 없습니다.");
            }

            if (!Directory.Exists(strPath)) Directory.CreateDirectory(strPath);
            string strSave = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);
            e.UploadedFile.SaveAs(strSave);
            e.CallbackData = strID + "@" + strName + "@" + strType + "@" + strPath; //id, file, ext, path, option
        }
        catch (Exception ex)
        {
            if (objTran != null) objTran.Rollback();
            throw ex;
        }
        finally
        {
            if (objCon != null) objCon.Close();
        }
    }

    #region Update() : Update Process

    /// <summary>
    /// Update() : Update Process
    ///     : Insert/Update/Delete Process to DB.
    ///     input : 
    ///         - DATA - Client Data (cSaveData)
    ///     output:
    ///         - success : Key List (cSavedData)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Update(cSaveData DATA)
    {
        #region check Argument.

        // check Argument.
        //
        if (DATA.getSize() <= 0)
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion
        
        string strReturn = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();
        try
        {
            objUpdate.initialize(false);

            #region Customize.

            //---------------------------------------------------------------------------
            string strKey = string.Empty;
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                if (DATA.getObject(iAry).getQuery() == "EDM_2010_S_1"
                    && DATA.getObject(iAry).getFirst().getType() == typeQuery.INSERT)
                {
                    strKey = getNewSeq(objUpdate, "EDM_FOLDER_D", DATA.getObject(iAry).getFirst().getValue("folder_id"));
                    DATA.getObject(iAry).getFirst().setValue("file_seq", strKey);
                }
            }
            //---------------------------------------------------------------------------

            #endregion

            #region process Saving.

            // process Saving.
            //
            objUpdate.beginTran();
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                lstSaved.Add(
                    objUpdate.process(DATA.getObject(iAry), DATA.getUser())
                );

                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    // 사양서 추가 처리
                    if (DATA.getObject(iAry).getQuery() == "DLG_FILE_ZFILE" &&
                        HttpUtility.UrlDecode(DATA.getValue(iAry, iRow, "file_group2")) == "영업" &&
                        DATA.getValue(iAry, iRow, "file_group3") == "60")
                    {
                        string file_id = DATA.getValue(iAry, iRow, "file_id");
                        string ord_no = DATA.getValue(iAry, iRow, "data_key");
                        string file_ext = DATA.getValue(iAry, iRow, "file_ext");
                        string file_nm = HttpUtility.UrlDecode(DATA.getValue(iAry, iRow, "file_path")) + file_id + (string.IsNullOrEmpty(file_ext) ? "" : "." + file_ext);
                        string msg = Import(file_id, ord_no, file_nm, DATA.getUser());
                        if (!string.IsNullOrEmpty(msg))
                        {
                            throw new Exception(
                                    new JavaScriptSerializer().Serialize(
                                        new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                                                "사양서 저장 중 오류가 발생하였습니다.\n사양서 첨부파일 형식을 확인하시기 바랍니다.\n- " + msg))
                                );
                        }
                    }
                }
            }

            #endregion

            #region normal Closing.

            // normal Closing.
            //
            objUpdate.close(doTransaction.COMMIT);
            strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<List<cSavedData>>(
                                    codeProcessed.SUCCESS,
                                    lstSaved)
                            );

            #endregion
        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            objUpdate.close(doTransaction.ROLLBACK);
            strReturn = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    ex.Message)
                            );

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            objUpdate.release();

            #endregion
        }

        return strReturn;
    }

    #endregion

    private static string getNewSeq(cUpdate objUpdate, string _KeyType, string _KeyValue)
    {
        string sSeq = string.Empty;
        try
        {
            string sQry = "SELECT dbo.FN_CREATEKEY('" + _KeyType + "','" + _KeyValue + "')";
            objUpdate.objDr = (new cDBQuery(ruleQuery.INLINE, sQry)).retrieveQuery(objUpdate.objCon);
            if (objUpdate.objDr.Read()) sSeq = objUpdate.objDr[0].ToString();
            objUpdate.objDr.Close();
        }
        catch (SqlException ex)
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_SQL,
                                "Sequance No.를 생성할 수 없습니다.\n- " + ex.Message))
                );
        }
        catch (Exception ex)
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                                "Sequance No.생성 중에 오류가 발생하였습니다.\n- " + ex.Message))
                );
        }
        return sSeq;
    }

    private static string Import(string file_id, string ord_no, string file_nm, string user_id)
    {

        string strReturn = string.Empty;

        #region Read Data from Excel & Save to Temporary DB.

        // Read Data from Excel
        //  & Save to Temporary DB.
        //
        try
        {
            OleDbConnection oleCon = null;
            OleDbDataReader oleDr = null;
            cUpdate objUpdate = new cUpdate();
            int iRow = 0;
            try
            {
                #region Connect to OLE & Get Names of Sheets.

                // Connect to OLE.
                //
                string strProvider =
                    "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + file_nm + "; Extended Properties=\"Excel 8.0; IMEX=1;\"";
                //String.Format(@"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=""Excel 12.0;IMEX=1;""", file_nm);
                oleCon = new OleDbConnection(strProvider);
                oleCon.Open();

                #endregion

                #region Connect to DB & Open Transaction.

                // Connect to DB & Open Transaction.
                //
                objUpdate.initialize(false);
                objUpdate.beginTran();

                #endregion

                #region Read Data from Excel & Save.

                // Read Data from Excel & Save.
                //
                // select data from excel.
                string strSQL = "SELECT * FROM [" + "설비사양정보" + "$]";
                OleDbCommand oleCmd = new OleDbCommand(strSQL, oleCon);
                oleDr = oleCmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (!oleDr.HasRows)
                {
                    throw new Exception("Sheet에 읽을 데이터가 없습니다.");
                }

                // delete existed data.
                string strQuery = string.Format(@" DELETE FROM SM_ORDER_SPEC WHERE FILE_ID = '{0}'", file_id);
                new cDBQuery(ruleQuery.INLINE, strQuery).executeQuery(objUpdate.objCmd, true);

                // read and update data.
                string cols = "file_id, seq, no, division, components, item, contents1, contents2, contents3, contents4, contents5, ord_no, ins_usr, ins_dt";

                int seq = 0;
                while (oleDr.Read())
                {
                    #region Save to Temporary DB.

                    iRow++;
                    if (string.IsNullOrEmpty(getDbString(oleDr[0]))) continue;

                    string values = "'" + file_id + "', " + (++seq).ToString() + ", '" + getDbString(oleDr[0]) + "', '" + getDbString(oleDr[1]) + "', '" + getDbString(oleDr[2]) + "', '" + getDbString(oleDr[3]) +
                        "', {0}, '" + ord_no + "', '" + user_id + "', GETDATE()";

                    int i = 0;
                    string sub_val = string.Empty;
                    string[] vals = new string[5];
                    int val_idx = 0;
                    while (i++ < 5)
                    {
                        int idx = (i * 2) + 2;
                        if (!string.IsNullOrEmpty(getDbString(oleDr[idx])))
                        {
                            vals[val_idx++] = getDbString(oleDr[idx + 1]);
                        }
                    }
                    foreach (string val in vals)
                    {
                        sub_val += (string.IsNullOrEmpty(sub_val) ? "" : ", ") + (string.IsNullOrEmpty(val) ? "''" : "'" + val + "'");
                    }
                    values = string.Format(values, sub_val);

                    strQuery = string.Format("INSERT INTO SM_ORDER_SPEC ({0}) VALUES ({1})", cols, values);
                    new cDBQuery(ruleQuery.INLINE, strQuery).executeQuery(objUpdate.objCmd, false);

                    #endregion
                }

                objUpdate.close(doTransaction.COMMIT);
                //strReturn = new JavaScriptSerializer().Serialize(
                //                new entityProcessed<string>(codeProcessed.SUCCESS, "success")
                //            );

                #endregion
            }
            catch (SqlException ex)
            {
                // abnormal Closing.
                //
                strReturn = ex.Message;
                objUpdate.close(doTransaction.ROLLBACK);

                //throw new Exception(
                //        new JavaScriptSerializer().Serialize(
                //            new entityProcessed<string>(codeProcessed.ERR_SQL,
                //                "데이터 저장에 실패하였습니다. (" + iRow + 2 + "행)\n- " + ex.Message)
                //            )
                //        );
            }
            catch (Exception ex)
            {
                // abnormal Closing.
                //
                strReturn = ex.Message;
                objUpdate.close(doTransaction.ROLLBACK);

                //throw new Exception(
                //        new JavaScriptSerializer().Serialize(
                //            new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                //                "데이터 저장 중에 오류가 발생하였습니다.\n- " + ex.Message)
                //            )
                //        );
            }
            finally
            {
                // release.
                //
                if (oleDr != null) { oleDr.Close(); oleDr.Dispose(); }
                if (oleCon != null) oleCon.Close();
                objUpdate.release();
            }
        }
        catch (Exception ex)
        { strReturn = ex.Message; }
        finally
        { }

        #endregion

        return strReturn;
    }

    private static string getDbString(object oleDrCol)
    {
        return oleDrCol.ToString().Trim().Replace("'", "''");
    }

}
