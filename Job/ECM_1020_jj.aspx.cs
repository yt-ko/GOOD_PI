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
//using Word = Microsoft.Office.Interop.Word;
using System.IO;

public partial class Job_ECM_1020_jj : System.Web.UI.Page
{

    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;

    protected void Page_Load(object sender, EventArgs e)
    {
    }

    #region Print() : DB의 Data를 통해 출력물 Create.

    /// <summary>
    /// Print() : DB의 Data를 통해 출력물 Create.
    ///     : input
    ///         - DATA : Query and Argument / Option
    ///     : output 
    ///         - success : 출력물 파일 정보
    ///         - else : entityProcessed (string)
    /// </summary>
    [WebMethod]
    public static string Print(cRetrieveData DATA)
    {

        string strReturn = string.Empty;
        try
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

            #region prepare Office object.

            string strPrint = DATA.getOption("PRINT");
            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");
            string strDocID = DATA.getOption("DOC_ID");
            string strDocNo = DATA.getOption("DOC_NO");

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strOrgFile = getTemplate(strDocID);  // 편집 가능의 경우는 계약파일, 불가의 경우 표준파일
            string strSource = strRoot + "Report\\" + strPage + "\\" + strDocNo + Path.GetExtension(strOrgFile);
            bool bEdit = getEditYn(strDocID);
            if (bEdit) strSource = strOrgFile;  //주계약서이고 계약파일이 존재할 경우
            //string strTargetExt = bEdit ? Path.GetExtension(strSource) : ".pdf";
            string strTargetExt = Path.GetExtension(strSource);
            string strTarget = Path.ChangeExtension(strSource, strTargetExt);
            string sFileNmTrg = strDocNo + strTargetExt;
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

                // 부계약서이거나 계약파일이 없을 경우 표준파일에서 복사 생성
                if (!bEdit) File.Copy(strOrgFile, strSource, true);

                // change Merge Field to Data Value - by JJJ
                wDoc.beginUpdate();
                foreach (string fieldNm in wDoc.getMergeFiledCode()) // Loop Field Codes of Document 
                {
                    // 서명 필드 제외 -> 승인 시점에 도장 이미지 삽입
                    if (getSysField(strDocID, fieldNm).IndexOf("SIGN_") > -1) continue;

                    string dataValue = getDataValueByFieldNm(dt, fieldNm);    // find Data Value
                    wDoc.setFieldValue(fieldNm, dataValue);       // change Field Code To Data Value
                }
                wDoc.endUpdate();

                //_WordDoc = _WordApp.Documents.Open(strSource);
                //foreach (Word.Field f in _WordDoc.Fields)
                //{
                //    Word.Range r = f.Code;
                //    if (r.Text.StartsWith(" MERGEFIELD"))
                //    {
                //        int pos = (" MERGEFIELD").Length;
                //        string field = r.Text.Trim().Substring(pos, r.Text.Trim().Length - pos).Trim();
                //        field = field.Split(' ')[0];
                //        if (getSysField(strDocID, field).IndexOf("SIGN_") < 0)
                //        {
                //            string val = getDataValueByFieldNm(dt, field);
                //            f.Select();
                //            if (string.IsNullOrEmpty(val))
                //                _WordApp.Selection.TypeBackspace();
                //            else
                //                _WordApp.Selection.TypeText(val);
                //        }
                //    }
                //}

                // Word Content To DB
                cProcedure objProcedure = new cProcedure();
                objProcedure.initialize();
                try
                {
                    objProcedure.objCmd.CommandText = "sp_updateECMDocContent";
                    objProcedure.objCmd.Parameters.AddWithValue("@doc_id", strDocID);
                    //objProcedure.objCmd.Parameters.AddWithValue("@doc_content", _WordDoc.Content.Text);
                    objProcedure.objCmd.Parameters.AddWithValue("@doc_content", wDoc.getTextFromDoc("Content.Text"));   // by JJJ
                    objProcedure.objCmd.Parameters.AddWithValue("@usr_id", strUser);
                    objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                    objProcedure.objCmd.ExecuteNonQuery();
                    objProcedure.processTran(doTransaction.COMMIT);
                }
                catch (Exception)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);

                    //throw new Exception(
                    //        new JavaScriptSerializer().Serialize(
                    //            new entityProcessed<string>(
                    //                    codeProcessed.ERR_PROCESS,
                    //                    "계약 내용 저장 오류.\n- " + ex.Message)
                    //        )
                    //    );
                }
            }
            catch (Exception ex)
            {
                wDoc.closeWord();   // by JJJ
                //if (_WordDoc != null) _WordDoc.Close(false);
                //if (_WordApp != null) _WordApp.Quit();
                //if (_WordDoc != null) System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordDoc);
                //if (_WordApp != null) System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordApp);

                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "계약서 생성 중 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            #endregion

            #region save to File.

            try
            {
                wDoc.saveDocument();
                //_WordDoc.Save();
                
                //if (!bEdit)
                //{
                //    string paramExportFilePath = Path.ChangeExtension(strSource, strTargetExt);
                //    Word.WdExportFormat paramExportFormat = Word.WdExportFormat.wdExportFormatPDF;
                //    bool paramOpenAfterExport = false;
                //    Word.WdExportOptimizeFor paramExportOptimizeFor =
                //        Word.WdExportOptimizeFor.wdExportOptimizeForPrint;
                //    Word.WdExportRange paramExportRange = Word.WdExportRange.wdExportAllDocument;
                //    int paramStartPage = 0;
                //    int paramEndPage = 0;
                //    Word.WdExportItem paramExportItem = Word.WdExportItem.wdExportDocumentContent;
                //    bool paramIncludeDocProps = true;
                //    bool paramKeepIRM = true;
                //    Word.WdExportCreateBookmarks paramCreateBookmarks =
                //        Word.WdExportCreateBookmarks.wdExportCreateWordBookmarks;
                //    bool paramDocStructureTags = true;
                //    bool paramBitmapMissingFonts = true;
                //    bool paramUseISO19005_1 = false;

                //    _WordDoc.ExportAsFixedFormat(
                //        paramExportFilePath,
                //        paramExportFormat, paramOpenAfterExport,
                //        paramExportOptimizeFor, paramExportRange, paramStartPage,
                //        paramEndPage, paramExportItem, paramIncludeDocProps,
                //        paramKeepIRM, paramCreateBookmarks, paramDocStructureTags,
                //        paramBitmapMissingFonts, paramUseISO19005_1,
                //        objMissing);

                //    // ZFILE COPY
                //    try
                //    {
                //        string strDocNm = Path.GetFileName(strTarget);
                //        string strDocPath = Path.GetDirectoryName(strTarget) + "\\";
                //        string strDocExt = strTargetExt.Substring(1);
                //        string strQuery = string.Format("UPDATE B SET FILE_NM = '{1}', FILE_EXT = '{2}', FILE_PATH = '{3}' FROM ECM_DOCUMENT_FILE A INNER JOIN ZFILE B ON A.FILE_ID = B.FILE_ID AND A.DOC_TP = '1' WHERE A.DOC_ID = {0}", strDocID, strDocNm, strDocExt, strDocPath);
                //        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                //        using (SqlCommand objCmd = new SqlCommand(strQuery, objCon))
                //        {
                //            objCon.Open();
                //            objCmd.CommandText = strQuery;
                //            objCmd.ExecuteNonQuery();
                //            objCon.Close();
                //        }
                //    }
                //    catch (Exception ex)
                //    {
                //        throw new Exception(
                //            new JavaScriptSerializer().Serialize(
                //                new entityProcessed<string>(
                //                    codeProcessed.ERR_PROCESS,
                //                    "계약서 양실 파일 정보 업데이트 오류.\n- " + ex.Message)
                //                )
                //            );
                //    }

                //}

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
                            );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Print 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            finally
            {
                wDoc.closeWord();   // by JJJ
                //_WordDoc.Close();
                //_WordApp.Quit();

                //if (_WordDoc != null)
                //    System.Runtime.InteropServices.Marshal.ReleaseComObject(_WordDoc);

                //if (_WordApp != null)
                //    System.Runtime.InteropServices.Marshal.ReleaseComObject(_WordApp);
            }

            #endregion

        }
        catch (Exception ex)
        {
            #region abnormal Closing.

            // abnormal Closing.
            //
            strReturn = ex.Message;

            #endregion
        }
        finally
        {
            #region release.

            // release.
            //
            if (objDr != null) objDr.Close();
            if (objCon != null) objCon.Close();

            #endregion
        }

        return strReturn;
    }
    #endregion

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
            //entityNameValue objArg = new entityNameValue(true);
            //objArg.Add("arg_doc_id", doc_id);
            //objCmd.CommandText = getQuery("ECM_1020_9", objArg);
            string strQuery = string.Format("SELECT FILE_PATH + FILE_ID + '.' + FILE_EXT AS DOC_FILE FROM ZFILE A WHERE A.FILE_ID = (SELECT MAX(CASE WHEN EDIT_YN = '1' THEN FILE_ID ELSE FILE_PID END) FROM ECM_DOCUMENT_FILE WHERE DOC_ID = {0} AND DOC_TP = '1')", doc_id);
            objCmd.CommandText = strQuery;

            using(objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) file = objDr[0].ToString();
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

    protected static string getTemplate2(string doc_id)
    {
        string file = string.Empty;

        try
        {
            //entityNameValue objArg = new entityNameValue(true);
            //objArg.Add("arg_doc_id", doc_id);
            //objCmd.CommandText = getQuery("ECM_1020_9", objArg);
            string strQuery = string.Format("SELECT FILE_PATH + FILE_ID + '.' + FILE_EXT AS DOC_FILE FROM ZFILE A WHERE A.FILE_ID = (SELECT TOP 1 FILE_ID FROM ECM_DOCUMENT_FILE WHERE DOC_ID = {0} AND DOC_TP = '1')", doc_id);
            objCmd.CommandText = strQuery;

            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) file = objDr[0].ToString();
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

    protected static bool getEditYn(string doc_id)
    {
        bool edit_yn = false;

        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT TOP 1 EDIT_YN FROM ECM_DOCUMENT_FILE A WHERE A.DOC_TP = '1' AND A.DOC_ID = {0}", doc_id);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) edit_yn = objDr[0].ToString().Equals("1");
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

        return edit_yn;
    }

    protected static string getPstat(string doc_id)
    {
        string pstat = string.Empty;
        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT PSTAT FROM ECM_DOCUMENT A WHERE A.DOC_ID = {0}", doc_id);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) pstat = objDr[0].ToString();
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
        return pstat;
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

    protected static string getDataValueByFieldNm(DataTable _dt, string _field)
    {
        DataRow[] dr = _dt.Select(string.Format("field_nm='{0}'", _field));

        string rtn = string.Empty;

        if (!(dr == null || dr.Length == 0))
            rtn = dr[0]["value"].ToString();

        return string.IsNullOrEmpty(rtn) ? "" : rtn;

    }

}
