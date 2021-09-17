using DevExpress.Spreadsheet;
using DevExpress.XtraSpreadsheet;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
//using Word = Microsoft.Office.Interop.Word;

public partial class Job_ECM_1021_2_jj : System.Web.UI.Page
{
    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;

    protected void Page_Load(object sender, EventArgs e)
    {
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
        string strKey = string.Empty;
        List<cSavedData> lstSaved = new List<cSavedData>();
        cUpdate objUpdate = new cUpdate();
        try
        {
            #region initialize to Save.

            objUpdate.initialize(false);

            #endregion

            #region Customize.

            //---------------------------------------------------------------------------
            if (DATA.getFirst().getQuery() == "ECM_1021_2_1" && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "CR_DOC_TEMP");
                    objProcedure.objCmd.Parameters.Add("@NewKey", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                    objProcedure.objCmd.ExecuteNonQuery();
                    objProcedure.processTran(doTransaction.COMMIT);
                }
                catch (SqlException ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);

                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_SQL,
                                        "Key를 생성할 수 없습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);

                    throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                        codeProcessed.ERR_PROCESS,
                                        "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                DATA.setValues("doc_no", strKey);
            }
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

            // Add doc_no
            lstSaved[0].addKey("doc_no", strKey);

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

        #region CreateDoc
        // 계약서 생성

        // Customize - Run Procedure.
        //
        if (!string.IsNullOrEmpty(strKey))
        {
            #region  CopyEcmDocFromTemp
            // 계약서 데이터 생성

            string strDocId = string.Empty;
            string strDocNo = string.Empty;
            string strErrMsg = string.Empty;
            cProcedure objProcedure = new cProcedure();
            objProcedure.initialize();
            try
            {
                string strSQL = "sp_copyECMDocFromTemp";
                objProcedure.objCmd.CommandText = strSQL;
                objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                objProcedure.objCmd.Parameters.AddWithValue("@tmp_no", strKey);
                objProcedure.objCmd.Parameters.AddWithValue("@user_id", HttpUtility.UrlDecode(DATA.getUser()));
                objProcedure.objCmd.Parameters.Add("@doc_id", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                objProcedure.objCmd.Parameters.Add("@doc_no", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                objProcedure.objCmd.Parameters.Add("@err_msg", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                objProcedure.objCmd.ExecuteNonQuery();

                strDocId = objProcedure.objCmd.Parameters["@doc_id"].Value.ToString();
                strDocNo = objProcedure.objCmd.Parameters["@doc_no"].Value.ToString();
                strErrMsg = objProcedure.objCmd.Parameters["@err_msg"].Value.ToString();
                objProcedure.objCmd.Parameters.Clear();
                objProcedure.processTran(doTransaction.COMMIT);

                //if (!string.IsNullOrEmpty(strErrMsg))
                //    throw new Exception(
                //        new JavaScriptSerializer().Serialize(
                //            new entityProcessed<string>(
                //                codeProcessed.ERR_PROCESS,
                //                strErrMsg)
                //        )
                //    );
            }
            catch (SqlException ex)
            {
                objProcedure.processTran(doTransaction.ROLLBACK);
                //
                return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            ex.Message)
                    );
                //
            }
            catch (Exception ex)
            {
                objProcedure.processTran(doTransaction.ROLLBACK);
                return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            ex.Message)
                    );
            }
            #endregion

            #region CreateEcmDocFile
            // 계약서 파일 생성
            if (!string.IsNullOrEmpty(strDocId))
            {
                cRetrieveData Doc = new cRetrieveData();
                Doc.OPTION = new entityNameValue(true);
                Doc.USER = DATA.getUser();
                Doc.OPTION.Add("PAGE", "ECM_1020");
                Doc.OPTION.Add("USER", DATA.getUser());
                Doc.OPTION.Add("DOC_ID", strDocId);
                Doc.OPTION.Add("DOC_NO", strDocNo);
                Doc.OPTION.Add("SRC", "");              // 원본파일

                CreateDoc(Doc);

                lstSaved[0].KEY[0].VALUE = strDocId;    // doc_id
                lstSaved[0].KEY[1].VALUE = strDocNo;    // doc_no
            }
            #endregion

        }
        #endregion

        return strReturn;
    }
    #endregion

    public static void CreateDoc(cRetrieveData DATA)
    {
        #region connect to DB.

        //  connect to DB.
        //
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();
            objCmd = new SqlCommand("", objCon);
        }
        catch (SqlException ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                        codeProcessed.ERR_SQL,
                        "Database에 연결할 수 없습니다.\n- " + ex.Message)
                    )
                );
        }
        catch (Exception ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(
                    new entityProcessed<string>(
                        codeProcessed.ERR_PROCESS,
                        "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }

        #endregion

        string strRoot = HttpContext.Current.Server.MapPath("~/");
        string strPage = DATA.getOption("PAGE");
        string strDocIDs = DATA.getOption("DOC_ID");
        string strDocNos = DATA.getOption("DOC_NO");

        try
        {
            for (int i = 0; i < strDocIDs.Split(',').Length; i++)
            {
                string strDocID = strDocIDs.Split(',')[i];
                string strDocNo = strDocNos.Split(',')[i];
                string strSource = getTemplate(strDocID);
                if (string.IsNullOrEmpty(strSource))
                    continue;

                string strTarget = strRoot + "Report\\ECM_1020\\" + strDocNo + Path.GetExtension(strSource);
                try
                {
                    File.Copy(strSource, strTarget, true);
                    DATA.setOption("DOC_ID", strDocID);
                    DATA.setOption("DOC_NO", strDocNo);
                    DATA.setOption("SRC", strTarget);
                    Print(DATA);
                }
                catch (Exception ex)
                {
                    throw new Exception("계약서 양식 파일 생성 오류.\n- " + ex.Message);
                }

                try
                {
                    string strDocNm = Path.GetFileName(strTarget);
                    string strDocPath = Path.GetDirectoryName(strTarget) + "\\";
                    string strDocExt = Path.GetExtension(strTarget).Substring(1);
                    string strQuery = string.Format("UPDATE B SET FILE_NM = '{1}', FILE_EXT = '{2}', FILE_PATH = '{3}' FROM ECM_DOCUMENT_FILE A INNER JOIN ZFILE B ON A.FILE_ID = B.FILE_ID AND A.DOC_TP = '1' WHERE A.DOC_ID = {0}", strDocID, strDocNm, strDocExt, strDocPath);
                    using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                    using (SqlCommand objCmd = new SqlCommand(strQuery, objCon))
                    {
                        objCon.Open();
                        objCmd.CommandText = strQuery;
                        objCmd.ExecuteNonQuery();
                        objCon.Close();
                    }
                }
                catch (Exception ex)
                {
                    throw new Exception("계약서 양실 파일 정보 업데이트 오류.\n- " + ex.Message);
                }
            }
        }
        catch(Exception ex)
        {
            throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                ex.Message)
                            )
                        );
        }
        finally
        {
            if (objDr != null) objDr.Close();
            if (objCon != null) objCon.Close();
        }
    }

    public static void Print(cRetrieveData DATA)
    {

        try
        {
            #region prepare Office object.

            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");
            string strDocID = DATA.getOption("DOC_ID");
            string strDocNo = DATA.getOption("DOC_NO");
            string strSource = DATA.getOption("SRC");
            string strTargetExt = Path.GetExtension(strSource);
            string strTarget = Path.ChangeExtension(strSource, strTargetExt);
            object objMissing = Type.Missing;

            #endregion

            #region process Query & set to Print.

            //Word.Application _WordApp = new Word.Application();
            //_WordApp.Visible = false;
            //Word.Document _WordDoc = null;
            cDxWord wDoc = new cDxWord(strSource);  // by JJJ

            try
            {
                // Field 용 Data Colummn & Value 가져오기
                DataTable dt = getData(strDocID);

                // change Merge Field to Data Value - by JJJ
                wDoc.beginUpdate();
                foreach (string fieldNm in wDoc.getMergeFiledCode()) // Loop Field Codes of Document 
                {
                    // 서명 필드 제외 -> 승인 시점에 도장 이미지 삽입
                    if (getSysField(strDocID, fieldNm).IndexOf("SIGN_") < 0) continue;    

                    string dataValue = getDataValueByFieldNm(dt, fieldNm);    // find Data Value
                    wDoc.setFieldValue(fieldNm, dataValue);       // change Field Code To Data Value
                }
                wDoc.endUpdate();
                wDoc.saveDocument();

                ////_WordDoc = _WordApp.Documents.Open(strSource);
                //foreach (Word.Field f in _WordDoc.Fields)
                //{
                //    Word.Range r = f.Code;

                //    if (r.Text.StartsWith(" MERGEFIELD"))
                //    {
                //        int pos = (" MERGEFIELD").Length;
                //        string field = r.Text.Trim().Substring(pos, r.Text.Trim().Length - pos).Trim();
                //        field = field.Split('\\')[0].Trim().Replace("\"", "");

                //        if (getSysField(strDocID, field).IndexOf("SIGN_") < 0)
                //        {
                //            string val = findValue(dt, field);

                //            f.Select();
                //            if (string.IsNullOrEmpty(val))
                //                _WordApp.Selection.TypeBackspace();
                //            else
                //                _WordApp.Selection.TypeText(val);
                //        }
                //    }
                //}
                //_WordDoc.Save();
            }
            catch (Exception ex)
            {
                throw new Exception("계약서 파일 생성 중에 오류가 발생하였습니다.\n- " + ex.Message);
            }
            finally
            {
                wDoc.closeWord();   // by JJJ
                //_WordDoc.Close();
                //_WordApp.Quit();

                //if (_WordDoc != null)
                //    System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordDoc);
                //if (_WordApp != null)
                //    System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordApp);

            }
            #endregion

        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        finally
        {
        }
    }

    protected static string getQuery(string strQueryID, entityNameValue objArgs)
    {
        #region get Query from DB.

        string strSQL = string.Empty;
        string strBody = string.Empty;
        string strZQuery = "SELECT qry_sel AS QUERY_SELECT FROM ZQUERY WHERE qry_id = '{0}'";

        strSQL = string.Format(@strZQuery, strQueryID);

        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
        using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
        {
            objCon.Open();

            try
            {
                using (SqlDataReader dr = objCmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        strBody = dr["QUERY_SELECT"].ToString();
                    }
                    else
                    {
                        throw new Exception(
                            "관련 Query를 찾을 수 없습니다.");
                    }
                }

            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            objCon.Close();
        }

        #endregion

        #region bind Argument to Query.

        bindArg(strQueryID, ref strBody, objArgs);

        #endregion

        return strBody;

    }

    protected static void bindArg(string strQueryID, ref string strBody, entityNameValue objArgs)
    {

        #region create Query.

        string strSQL = string.Empty;
        string strZArg = "SELECT arg_id AS ARG_ID, arg_tp AS ARG_TYPE, arg_qry AS ARG_QUERY FROM ZQUERY_ARG WHERE qry_id = '{0}'";
        Hashtable tblSelect = new Hashtable();

        if (objArgs.getSize() > 0)
        {
            #region get Argument from DB.

            strSQL = string.Format(@strZArg, strQueryID);
            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
            {
                objCon.Open();

                try
                {

                    using (SqlDataReader dr = objCmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            tblSelect.Add(
                                dr["ARG_ID"].ToString(),
                                new cDBArgument(
                                    dr["ARG_TYPE"].ToString(),
                                    dr["ARG_QUERY"].ToString())
                                );
                        }

                    }

                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }


                objCon.Close();
            }


            #endregion

            #region bind Argument to Query.

            try
            {
                for (int iAry = 0; iAry < objArgs.getSize(); iAry++)
                {
                    string strArg = objArgs.NAME[iAry];
                    cDBArgument objArg = (cDBArgument)tblSelect[strArg];
                    if (objArg == null)
                    {
                        throw new Exception(
                            strArg + " - 관련 Argument를 찾을 수 없습니다.");
                    }
                    strBody = objArg.convertWhere(
                                        strBody,
                                        strQueryID,
                                        strArg,
                                        HttpUtility.UrlDecode(objArgs.getValue(strArg))
                                    );
                }
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "Query 생성에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion
        }

        #endregion

    }

    protected static string getTemplate(string doc_id)
    {
        string file = string.Empty;

        try
        {
            entityNameValue objArg = new entityNameValue(true);
            objArg.Add("arg_doc_id", doc_id);
            string strSQL = getQuery("ECM_1020_9", objArg);

            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
            {
                objCon.Open();
                try
                {
                    using (SqlDataReader dr = objCmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            file = dr[0].ToString();
                        }
                        else
                        {
                            //throw new Exception(
                            //    "양식파일 경로를 가져올 수 없습니다.");
                        }
                    }

                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "양식파일 경로 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "양식파일 경로 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                objCon.Close();
            }

        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return file;
    }

    protected static string getSysField(string doc_id, string field_nm)
    {
        string sys_field = string.Empty;
        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT dbo.fn_getECMSysField2({0}, '{1}')", doc_id, field_nm);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) sys_field = objDr[0].ToString();
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }
        return sys_field;
    }

    protected static string getDataValueByFieldNm(DataTable _dt, string _field)
    {
        DataRow[] dr = _dt.Select(string.Format("field_nm='{0}'", _field));

        string rtn = string.Empty;

        if (!(dr == null || dr.Length == 0))
            rtn = dr[0]["value"].ToString();

        return string.IsNullOrEmpty(rtn) ? "" : rtn;

    }

    protected static DataTable getData(string doc_id)
    {
        DataTable dt = new DataTable();

        try
        {
            entityNameValue objArg = new entityNameValue(true);
            objArg.Add("arg_doc_id", doc_id);
            objCmd.CommandText = getQuery("ECM_1020_8", objArg);
            using (objDr = objCmd.ExecuteReader())
            {
                dt.Load(objDr);
            }
        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return dt;
    }

    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {
        // 
        SpreadsheetControl objWorkBook = new SpreadsheetControl();
        Worksheet objWorkSheet;

        try
        {
            DocumentFormat df = Path.GetExtension(e.UploadedFile.FileName).ToUpper().Equals("XLS") ? DocumentFormat.Xls : DocumentFormat.Xlsx;
            objWorkBook.LoadDocument(e.UploadedFile.FileBytes, df);
            objWorkSheet = objWorkBook.Document.Worksheets.ActiveWorksheet;
            Range objRange = objWorkSheet.GetDataRange();

            List<Data> row = new List<Data>();
            for (int i = 1; i < objRange.RowCount; i++)   // i = 0; header
            {
                if (string.IsNullOrEmpty(objWorkSheet.Cells[i, 0].Value.ToString()))
                    continue;
                row.Add(new Data
                {
                    supp_tp = "2",                                              // 구분
                    supp_cd = objWorkSheet.Cells[i, 0].Value.ToString(),        // 거래처코드
                    supp_nm = objWorkSheet.Cells[i, 0].Value.ToString(),        // 거래처명
                    supp_man = objWorkSheet.Cells[i, 2].Value.ToString(),       // 담당자
                    supp_telno = objWorkSheet.Cells[i, 3].Value.ToString(),     // 연락처
                    supp_email = objWorkSheet.Cells[i, 4].Value.ToString()      // E-Mail
                });
            }
            e.CallbackData = new JavaScriptSerializer().Serialize(new { data = row });

            new JavaScriptSerializer().Serialize(
                new entityProcessed<string>(codeProcessed.SUCCESS, "success")
            );

        }
        catch (Exception ex)
        {
            throw new Exception("엑셀 파일을 읽는 중 오류가 발생하였습니다.\r\n" + ex.Message);
        }
        finally
        {
            objWorkBook.Dispose();
        }
        
    }

    public class Data
    {
        public string supp_tp { get; set; }
        public string supp_cd { get; set; }
        public string supp_nm { get; set; }
        public string supp_man { get; set; }
        public string supp_telno { get; set; }
        public string supp_email { get; set; }
    }

}
