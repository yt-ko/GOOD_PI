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
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using System.Data.OleDb;

public partial class Job_w_import_em_model : System.Web.UI.Page
{
    string strData = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        #region 1. Mapping Argument.

        // 1. Mapping Argument.
        //
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        {
            throw new Exception("처리할 데이터 종류를 확인할 수 없습니다.");
        }
        strData = lstParam["DATA_TYPE"].ToString();
        string strName = e.UploadedFile.FileName;
        string[] strFile = strName.Split('.');
        string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;
        string strID = strData +
                        "-" + String.Format("{0:yyyyMMdd-HHmmss}", DateTime.Now);
        string strPath = Server.MapPath("~/Import/") + strID + "." + strType;

        #endregion

        #region 2. Save File.

        // 2. Save File.
        //
        try
        {
            e.UploadedFile.SaveAs(strPath);

            OleDbConnection oleCon = null;

            #region Open Excel & Get Environment.

            DataTable objSheet = new DataTable();
            // Open Excel & Get Environment.
            //
            try
            {
                #region Connect to OLE & Get Names of Sheets.

                // Connect to OLE.
                //
                string strProvider =
                    "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + strPath + "; Extended Properties=\"Excel 8.0; IMEX=1;\"";
                //"Provider=Microsoft.ACE.OLEDB.12.0; Data Source=" + strSave + "; Extended Properties=Excel 12.0";
                oleCon = new OleDbConnection(strProvider);
                oleCon.Open();

                // Get Names of Sheets.
                //
                objSheet = oleCon.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                if (objSheet == null)
                    throw new Exception("Sheet 정보를 확인할 수 없습니다.");
                string strSheet = string.Empty;
                string strTable = string.Empty;
                for (int iAry = 0; iAry < objSheet.Rows.Count; iAry++)
                {
                    strTable = objSheet.Rows[iAry]["TABLE_NAME"].ToString().Trim('\'').Replace("$", "");
                    if (!strTable.Contains("Print") && !strTable.EndsWith("_"))
                        strSheet += (((iAry == 0) ? "" : ",") + strTable);
                }

                #endregion

                e.CallbackData = strID + "@" + strName + "@" + strType + "@" + strPath + "@" + strSheet;
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
                if (oleCon != null) oleCon.Close();
            }

            #endregion
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
        }

        #endregion
    }

    #region Import() : Import Excel Data

    /// <summary>
    /// Import() : Import Excel Data
    ///     : Get Excel Data and Save to Temporary DB
    ///     input : 
    ///         - DATA - Client Data (cSaveData)
    ///     output:
    ///         - success : Key List (cSavedData)
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Import(cImportData DATA)
    {
        #region check Argument.

        // check Argument.
        //
        if (!DATA.validData())
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PARAM,
                                "잘못된 호출입니다.")
                    );
        }

        #endregion

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
                    "Provider=Microsoft.Jet.OLEDB.4.0; Data Source=" + DATA.getPath() + "; Extended Properties=\"Excel 8.0; IMEX=1;\"";
                //"Provider=Microsoft.ACE.OLEDB.12.0; Data Source=" + strSave + "; Extended Properties=Excel 12.0";
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
                string strSQL = "SELECT * FROM [" + DATA.getSheet() + "$]";
                OleDbCommand oleCmd = new OleDbCommand(strSQL, oleCon);
                oleDr = oleCmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (!oleDr.HasRows)
                {
                    throw new Exception("Sheet에 읽을 데이터가 없습니다.");
                }

                    // delete existed data.
                string strQuery = string.Format(@"
                    DELETE FROM EXCEL_EM_MODEL
                    WHERE FILE_ID = '{0}' AND SHEET_NM = '{1}'",
                    DATA.getKey(),
                    DATA.getSheet());
                new cDBQuery(ruleQuery.INLINE, strQuery)
                    .executeQuery(objUpdate.objCmd, true);
                strQuery = string.Format(@"
                    DELETE FROM EXCEL_EM_MODEL_ITEM
                    WHERE FILE_ID = '{0}' AND SHEET_NM = '{1}'",
                    DATA.getKey(),
                    DATA.getSheet());
                new cDBQuery(ruleQuery.INLINE, strQuery)
                    .executeQuery(objUpdate.objCmd, true);

                    // read and update data.
                string strQuery_1 =
                        "FILE_ID, SHEET_NM, RMK, PROJ_NO, CUST_CD, CUST_NM, MODEL_CLASS1, MODEL_CLASS2, MODEL_CLASS3, MODEL_CLASS_NM1, MODEL_CLASS_NM2, MODEL_CLASS_NM3, REVISION, INS_USR, INS_DT";
                string strQuery_2 = 
                        "'" + DATA.getKey() + "'" +
                        ",'" + DATA.getSheet() + "'";
                string strUser = string.Empty;
                string strDate = string.Empty;
                string strDiv_1 = string.Empty;
                string strDiv_2 = string.Empty;
                string strMerge = string.Empty;
                while (oleDr.Read())
                {
                    #region Save to Temporary DB.

                    // Save to Temporary DB.
                    //                    
                    if (iRow < DATA.getRow())
                    {
                        switch (iRow)
                        {
                            case 2:
                                {
                                    strQuery_2 = strQuery_2 +
                                        ",'" + oleDr[14].ToString().Trim().Replace("'", "''") + "'";
                                }
                                break;
                            case 3:
                                {
                                    strUser = oleDr[8].ToString().Trim().Replace("'", "''");
                                    strDate = oleDr[9].ToString().Trim().Replace("'", "''");
                                    string strName = oleDr[3].ToString().Trim().Replace("'", "''");
                                    string strName_1 = oleDr[4].ToString().Trim().Replace("'", "''");
                                    string strName_2 = oleDr[5].ToString().Trim().Replace("'", "''");
                                    string strName_3 = oleDr[6].ToString().Trim().Replace("'", "''");
                                        // get code data.
                                    string strCode = string.Empty;
                                    string strCode_1 = string.Empty;
                                    string strCode_2 = string.Empty;
                                    string strCode_3 = string.Empty;
                                    strQuery = string.Format(@"
                                        SELECT CUST_CD
                                        FROM EM_CUST_INFO
                                        WHERE UPPER(REPLACE(CUST_NAME, ' ', '')) = UPPER(REPLACE('{0}', ' ', ''))",
                                        strName);
                                    objUpdate.objDr = (new cDBQuery(
                                        ruleQuery.INLINE, strQuery))
                                        .retrieveQuery(objUpdate.objCmd);
                                    if (objUpdate.objDr.Read())
                                    {
                                        strCode = objUpdate.objDr[0].ToString();
                                    }
                                    objUpdate.objDr.Close();
                                    strQuery = string.Format(@"
                                        SELECT MODEL_CLASS_CD1 
                                        FROM EM_MODEL_CLASS 
                                        WHERE UPPER(REPLACE(MODEL_TYPE_NM, ' ', '')) = UPPER(REPLACE('{0}', ' ', ''))
                                        AND MODEL_CLASS_CD2 = '00'
                                        AND MODEL_CLASS_CD3 = '00'",
                                        strName_1);
                                    objUpdate.objDr = (new cDBQuery(
                                        ruleQuery.INLINE, strQuery))
                                        .retrieveQuery(objUpdate.objCmd);
                                    if (objUpdate.objDr.Read())
                                    {
                                        strCode_1 = objUpdate.objDr[0].ToString();
                                    }
                                    objUpdate.objDr.Close();
                                    strQuery = string.Format(@"
                                        SELECT MODEL_CLASS_CD2 
                                        FROM EM_MODEL_CLASS 
                                        WHERE UPPER(REPLACE(MODEL_TYPE_NM, ' ', '')) = UPPER(REPLACE('{0}', ' ', ''))
                                        AND MODEL_CLASS_CD1 = '{1}'
                                        AND MODEL_CLASS_CD3 = '00'",
                                        strName_2, strCode_1);
                                    objUpdate.objDr = (new cDBQuery(
                                        ruleQuery.INLINE, strQuery))
                                        .retrieveQuery(objUpdate.objCmd);
                                    if (objUpdate.objDr.Read())
                                    {
                                        strCode_2 = objUpdate.objDr[0].ToString();
                                    }
                                    objUpdate.objDr.Close();
                                    strQuery = string.Format(@"
                                        SELECT MODEL_CLASS_CD3 
                                        FROM EM_MODEL_CLASS 
                                        WHERE UPPER(REPLACE(MODEL_TYPE_NM, ' ', '')) = UPPER(REPLACE('{0}', ' ', ''))
                                        AND MODEL_CLASS_CD1 = '{1}'
                                        AND MODEL_CLASS_CD2 = '{2}'",
                                        strName_3, strCode_1, strCode_2);
                                    objUpdate.objDr = (new cDBQuery(
                                        ruleQuery.INLINE, strQuery))
                                        .retrieveQuery(objUpdate.objCmd);
                                    if (objUpdate.objDr.Read())
                                    {
                                        strCode_3 = objUpdate.objDr[0].ToString();
                                    }
                                    objUpdate.objDr.Close();
                                        // create query & update.
                                    strQuery_2 = strQuery_2 +
                                        ",'" + oleDr[0].ToString().Trim().Replace("'", "''") + "'" +
                                        ",'" + strCode + "'" +
                                        ",'" + strName + "'" +
                                        ",'" + strCode_1 + "'" +
                                        ",'" + strCode_2 + "'" +
                                        ",'" + strCode_3 + "'" +
                                        ",'" + strName_1 + "'" +
                                        ",'" + strName_2 + "'" +
                                        ",'" + strName_3 + "'" +
                                        "," + Convert.ToInt16(string.IsNullOrEmpty(oleDr[7].ToString()) ? 0 : oleDr[5]) +
                                        ",'" + strUser + "'" +
                                        ",'" + strDate + "'";
                                    strQuery = string.Format(
                                        "INSERT INTO dbo.EXCEL_EM_MODEL ({0}) VALUES ({1})", strQuery_1, strQuery_2);
                                    new cDBQuery(ruleQuery.INLINE, strQuery)
                                        .executeQuery(objUpdate.objCmd, false);
                                }
                                break;
                        }                        
                    }
                    else if (!string.IsNullOrEmpty(oleDr[4].ToString().Trim()))
                    {
                        strDiv_1 = (!string.IsNullOrEmpty(oleDr[0].ToString().Trim())) ? oleDr[0].ToString().Trim().Replace("'", "''") : strDiv_1;
                        strDiv_2 = (!string.IsNullOrEmpty(oleDr[1].ToString().Trim())) ? oleDr[1].ToString().Trim().Replace("'", "''") : strDiv_2;
                        string strDiv = oleDr[3].ToString().Trim().Replace("'", "''");
                        strQuery_1 = 
                            "FILE_ID, SHEET_NM, SEQ, TYPE, TITLE_DIV1, TITLE_DIV2, MAT_CD, MAT_NM, MAT_SPEC, DRW_NO, MAT_QUALITY, MAT_MAKER, ITEM_QTY, MAT_UCOST, RMK, MAT_MERGE, INS_USR, INS_DT";
                            // save for temporary.
                        strQuery_2 =
                            "'" + DATA.getKey() + "'" +
                            ",'" + DATA.getSheet() + "'" +
                            "," + Convert.ToInt16(oleDr[2]) +
                            ",'T'" +
                            ",'" + strDiv_1 + "'" +
                            ",'" + strDiv_2 + "'" +
                            ",'" + oleDr[8].ToString().Trim().Replace("'", "''") + "'" +
                            ",'" + oleDr[4].ToString().Trim().Replace("'", "''") + "'" +
                            ",'" + oleDr[6].ToString().Trim().Replace("'", "''") + "'" +
                            ",'" + oleDr[5].ToString().Trim().Replace("'", "''") + "'" +
                            ",'" + oleDr[7].ToString().Trim().Replace("'", "''") + "'" +
                            ",'" + oleDr[9].ToString().Trim().Replace("'", "''") + "'" +
                            "," + Convert.ToDecimal(oleDr[10]) +
                            "," + Convert.ToDecimal(string.IsNullOrEmpty(oleDr[12].ToString()) ? 0 : oleDr[12]) +
                            ",'" + oleDr[14].ToString().Trim().Replace("'", "''") + "'" +
                            ",'" + strDiv + "'" +
                            ",'" + strUser + "'" +
                            ",'" + strDate + "'";
                        strQuery = string.Format(
                                        "INSERT INTO dbo.EXCEL_EM_MODEL_ITEM ({0}) VALUES ({1})", strQuery_1, strQuery_2);
                        new cDBQuery(ruleQuery.INLINE, strQuery)
                            .executeQuery(objUpdate.objCmd, false);
                            // save for live.
                        if (string.IsNullOrEmpty(strDiv))
                        {
                            strQuery_2 =
                                "'" + DATA.getKey() + "'" +
                                ",'" + DATA.getSheet() + "'" +
                                "," + Convert.ToInt16(oleDr[2]) +
                                ",'L'" +
                                ",'" + strDiv_1 + "'" +
                                ",'" + strDiv_2 + "'" +
                                ",'" + oleDr[8].ToString().Trim().Replace("'", "''") + "'" +
                                ",'" + oleDr[4].ToString().Trim().Replace("'", "''") + "'" +
                                ",'" + oleDr[6].ToString().Trim().Replace("'", "''") + "'" +
                                ",'" + oleDr[5].ToString().Trim().Replace("'", "''") + "'" +
                                ",'" + oleDr[7].ToString().Trim().Replace("'", "''") + "'" +
                                ",'" + oleDr[9].ToString().Trim().Replace("'", "''") + "'" +
                                "," + Convert.ToDecimal(oleDr[10]) +
                                "," + Convert.ToDecimal(string.IsNullOrEmpty(oleDr[12].ToString()) ? 0 : oleDr[12]) +
                                ",'" + oleDr[14].ToString().Trim().Replace("'", "''") + "'" +
                                ",'" + oleDr[8].ToString().Trim().Replace("'", "''") + "'" +
                                ",'" + strUser + "'" +
                                ",'" + strDate + "'";
                            strQuery = string.Format(
                                        "INSERT INTO dbo.EXCEL_EM_MODEL_ITEM ({0}) VALUES ({1})", strQuery_1, strQuery_2);
                            strMerge = strDiv;
                            new cDBQuery(ruleQuery.INLINE, strQuery)
                                .executeQuery(objUpdate.objCmd, false);
                        }
                        else if (strDiv != strMerge)
                        {
                            strQuery_2 =
                                "'" + DATA.getKey() + "'" +
                                ",'" + DATA.getSheet() + "'" +
                                "," + Convert.ToInt16(oleDr[2]) +
                                ",'L'" +
                                ",'" + strDiv_1 + "'" +
                                ",'" + strDiv_2 + "'" +
                                ",'" + "" + "'" +
                                ",'" + strDiv + "'" +
                                ",'" + "" + "'" +
                                ",'" + "" + "'" +
                                ",'" + "" + "'" +
                                ",'" + "" + "'" +
                                "," + 1 +
                                "," + 0 +
                                ",'" + "" + "'" +
                                ",'" + strDiv + "'" +
                                ",'" + strUser + "'" +
                                ",'" + strDate + "'";
                            strQuery = string.Format(
                                        "INSERT INTO dbo.EXCEL_EM_MODEL_ITEM ({0}) VALUES ({1})", strQuery_1, strQuery_2);
                            strMerge = strDiv;
                            new cDBQuery(ruleQuery.INLINE, strQuery)
                                .executeQuery(objUpdate.objCmd, false);
                        }
                    }
                    iRow++;

                    #endregion
                }
                objUpdate.close(doTransaction.COMMIT);

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.SUCCESS,
                                    "success")
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
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "데이터 저장에 실패하였습니다. (" + iRow + 2 + "행)\n- " + ex.Message)
                            )
                        );
            }
            catch (Exception ex)
            {
                // abnormal Closing.
                //
                objUpdate.close(doTransaction.ROLLBACK);

                throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "데이터 저장 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
            }
            finally
            {
                // release.
                //
                if (oleDr != null)
                { oleDr.Close(); oleDr.Dispose(); }
                if (oleCon != null) oleCon.Close();
                objUpdate.release();
            }
        }
        catch (Exception ex)
        {
            strReturn = ex.Message;
        }
        finally
        {
        }

        #endregion

        return strReturn;
    }

    #endregion
}
