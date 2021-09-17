using System;
using System.Collections.Generic;
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

public partial class Job_DLG_ExcelImport : System.Web.UI.Page
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
        string strReturn = string.Empty;

        #region 1. Mapping Argument.
        TimeSpan ts = new TimeSpan(0, 5, 0);
        this.AsyncTimeout = ts;

        // 1. Mapping Argument.
        //
        string strName = e.UploadedFile.FileName;
        string [] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;
        #endregion

        #region Open Excel & Get Environment.

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


            OleDbConnection oleCon = null;
            OleDbDataReader oleDr = null;
            DataTable objSheet = new DataTable();
            cUpdate objUpdate = new cUpdate();
            Boolean bHeader = true;
            string strProvider = string.Empty;
            try
            {
                #region Connect to OLE & Get Names of Sheets.

                //"Provider=Microsoft.ACE.OLEDB.12.0; Data Source=" + strSave + "; Extended Properties=Excel 12.0";
                if (bHeader)
                    strProvider = //String.Format(@"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=""Excel 12.0;HDR=YES;IMEX=1;""", strSave);
                        "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + strSave + "; Extended Properties=\"Excel 8.0;IMEX=1;HDR=No;\"";
                else
                    strProvider = //String.Format(@"Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=""Excel 12.0;IMEX=1;""", strSave);
                        "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + strSave + "; Extended Properties=\"Excel 8.0;IMEX=1;\"";


                oleCon = new OleDbConnection(strProvider);
                oleCon.Open();

                // Get Names of Sheets.
                //
                objSheet = oleCon.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                if (objSheet == null)
                    throw new Exception("Sheet 정보를 확인할 수 없습니다.");

                #endregion

                #region Connect to DB & Open Transaction.

                // Connect to DB & Open Transaction.
                //
                objUpdate.initialize(false);
                objUpdate.beginTran();

                #endregion

                #region Read Data from Excel & Save to Temporary DB.

                string strTable = objSheet.Rows[0]["TABLE_NAME"].ToString().Trim('\'');
                strSQL = "SELECT * FROM [" + strTable + "]";

                OleDbCommand oleCmd = new OleDbCommand(strSQL, oleCon);
                oleDr = oleCmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (!oleDr.HasRows)
                {
                    throw new Exception("Sheet에 읽을 데이터가 없습니다.");
                }

                strSQL = string.Format(@" DELETE FROM ZEXCEL WHERE FILE_ID = '{0}'", strID);
                new cDBQuery(ruleQuery.INLINE, strSQL).executeQuery(objUpdate.objCmd, true);

                string strCols = "FILE_ID, SEQ, COL01, COL02, COL03, COL04, COL05, COL06, COL07, COL08, COL09, COL10, COL11, COL12, COL13, COL14, COL15, COL16, COL17, COL18, COL19, COL20";
                string strVals = string.Empty;
                int iColCnt = 20;
                int iSeq = bHeader?0:1;

                while (oleDr.Read())
                {
                    strSQL = @"INSERT INTO ZEXCEL({0}) VALUES ({1})";
                    strVals = "'" + strID + "', " + iSeq.ToString();

                    for (int i = 0; i < iColCnt; i++)
                    {
                        if (i < oleDr.FieldCount)
                            strVals += ", '" + oleDr[i].ToString().Trim().Replace("'", "''") + "'";
                        else
                            strVals += ", NULL";
                    }

                    strSQL = string.Format(strSQL, strCols, strVals);
                    new cDBQuery(ruleQuery.INLINE, strSQL).executeQuery(objUpdate.objCmd, false);

                    iSeq++;
                    if (iSeq > 1000) break;
                }

                objUpdate.close(doTransaction.COMMIT);
                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(codeProcessed.SUCCESS, "success")
                            );

                #endregion
            }
            catch (SqlException ex)
            {
                // abnormal Closing.
                //
                objUpdate.close(doTransaction.ROLLBACK);

                throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(codeProcessed.ERR_SQL,
                                "데이터 저장에 실패하였습니다." + ex.Message)
                            )
                        );
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                // release.
                //
                objSheet.Dispose();
                if (oleDr != null) { oleDr.Close(); oleDr.Dispose(); }
                if (oleCon != null) oleCon.Close();
                objUpdate.release();

            }
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

        #endregion
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

    #endregion
}
