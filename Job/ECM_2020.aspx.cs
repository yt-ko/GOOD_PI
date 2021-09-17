using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using Word = Microsoft.Office.Interop.Word;

public partial class Job_ECM_2020 : System.Web.UI.Page
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
            string strSource = getTemplate2(strDocID);
            string strPstat = getPstat(strDocID);
            string strTargetExt = ".pdf";
            string strTarget = Path.Combine(strRoot, "Report", strPage, Path.GetFileName(Path.ChangeExtension(strSource, strTargetExt)));
            string sFileNmTrg = strDocNo + strTargetExt;
            object objMissing = Type.Missing;

            #endregion


            if (Path.GetExtension(strSource).Equals(".doc") || Path.GetExtension(strSource).Equals(".docx"))
            {
                #region process Query & set to Print.

                Word.Application _WordApp = new Word.Application();
                _WordApp.Visible = false;
                Word.Document _WordDoc = null;
                Boolean bConfirm = false;   // true;

                try
                {
                    _WordDoc = _WordApp.Documents.Open(strSource);
                    //DataTable dt = getData(strDocID);
                    // 서명
                    if (strPstat.Equals("CFM"))
                    {
                        foreach (Word.Section wordSection in _WordDoc.Sections)
                        {
                            Word.Range footerRange = wordSection.Footers[Word.WdHeaderFooterIndex.wdHeaderFooterPrimary].Range;
                            footerRange.Font.ColorIndex = Word.WdColorIndex.wdDarkBlue;
                            footerRange.Font.Size = 10;
                            //footerRange.Text = string.IsNullOrEmpty(footerRange.Text) ? "" : footerRange.Text + "\n" + "본 계약서는 전자서명법에 따라 (주)원익아이피에스와 상기 업체 간에 공인인증을 득하여 체결한 전자계약서로써 제반 법령에 따라 법적 효력을 충족한 것임을 확인합니다.";
                            footerRange.Text = "본 계약서는 전자서명법에 따라 (주)원익아이피에스와 상기 업체 간에 공인인증을 득하여 체결한 전자계약서로써 제반 법령에 따라 법적 효력을 충족한 것임을 확인합니다.";
                        }

                        foreach (Word.Field f in _WordDoc.Fields)
                        {
                            Word.Range r = f.Code;

                            if (r.Text.StartsWith(" MERGEFIELD"))
                            {
                                int pos = (" MERGEFIELD").Length;
                                string field = r.Text.Trim().Substring(pos, r.Text.Trim().Length - pos).Trim();
                                field = field.Split('\\')[0].Trim().Replace("\"", "");
                                field = getSysField(strDocID, field);
                                if (field.IndexOf("SIGN_") >= 0)
                                {
                                    f.Select();
                                    _WordApp.Selection.TypeBackspace();
                                    //string sign_image = strRoot + @"\Files\ECM_FILES\SIGN_FILES\" + (field.IndexOf("_A") >= 0 ? "0000000000.png" : strUser + ".png");
                                    string sign_image = strRoot + @"\Files\ECM_FILES\SIGN_FILES\" + getSignImage(strDocID, field) + ".png";
                                    if (File.Exists(sign_image))
                                    {
                                        float top = (float)_WordApp.Selection.Information[Word.WdInformation.wdVerticalPositionRelativeToTextBoundary] - 8;
                                        //float top = (float)_WordApp.Selection.Information[Word.WdInformation.wdVerticalPositionRelativeToPage];
                                        Word.InlineShape inline_shape = _WordDoc.InlineShapes.AddPicture(sign_image, false, true, _WordApp.Selection.Range);
                                        Word.Shape shape = inline_shape.ConvertToShape();
                                        shape.WrapFormat.Type = Word.WdWrapType.wdWrapFront;
                                        //shape.TopRelative = top;
                                        shape.Top = top;
                                    }
                                    else
                                        bConfirm = false;
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    if (_WordDoc != null)
                        _WordDoc.Close(false);
                    if (_WordApp != null)
                        _WordApp.Quit();

                    if (_WordDoc != null)
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordDoc);

                    if (_WordApp != null)
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordApp);

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
                    //_WordDoc.Save();
                    string paramExportFilePath = strTarget; // Path.ChangeExtension(strSource, strTargetExt);
                    Word.WdExportFormat paramExportFormat = Word.WdExportFormat.wdExportFormatPDF;
                    bool paramOpenAfterExport = false;
                    Word.WdExportOptimizeFor paramExportOptimizeFor =
                        Word.WdExportOptimizeFor.wdExportOptimizeForPrint;
                    Word.WdExportRange paramExportRange = Word.WdExportRange.wdExportAllDocument;
                    int paramStartPage = 0;
                    int paramEndPage = 0;
                    Word.WdExportItem paramExportItem = Word.WdExportItem.wdExportDocumentContent;
                    bool paramIncludeDocProps = true;
                    bool paramKeepIRM = true;
                    Word.WdExportCreateBookmarks paramCreateBookmarks =
                        Word.WdExportCreateBookmarks.wdExportCreateWordBookmarks;
                    bool paramDocStructureTags = true;
                    bool paramBitmapMissingFonts = true;
                    bool paramUseISO19005_1 = false;

                    _WordDoc.ExportAsFixedFormat(
                        paramExportFilePath,
                        paramExportFormat, paramOpenAfterExport,
                        paramExportOptimizeFor, paramExportRange, paramStartPage,
                        paramEndPage, paramExportItem, paramIncludeDocProps,
                        paramKeepIRM, paramCreateBookmarks, paramDocStructureTags,
                        paramBitmapMissingFonts, paramUseISO19005_1,
                        objMissing);

                    // 계약서 파일 정보 변경
                    if (bConfirm)
                        setConfirmDoc(strDocID, strTarget);

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
                    _WordDoc.Close(false);
                    _WordApp.Quit();

                    if (_WordDoc != null)
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordDoc);
                    //System.Runtime.InteropServices.Marshal.ReleaseComObject(_WordDoc);

                    if (_WordApp != null)
                        System.Runtime.InteropServices.Marshal.FinalReleaseComObject(_WordApp);
                    //System.Runtime.InteropServices.Marshal.ReleaseComObject(_WordApp);
                }

                #endregion
            }
            else
            {
                // Report 경로에 파일 복사
                strTarget = Path.Combine(strRoot, "Report", strPage, strDocNo + Path.GetExtension(strSource));
                if (!strSource.Equals(strTarget))
                    File.Copy(strSource, strTarget, true);
                sFileNmTrg = strDocNo + Path.GetExtension(strTarget);
                strReturn = new JavaScriptSerializer().Serialize(
                                    new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
                                );
            }

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

    protected static string getSignImage(string doc_id, string sys_field)
    {
        string sign_image = string.Empty;
        try
        {
            entityNameValue objArg = new entityNameValue(true);
            string qry = string.Format("SELECT TOP 1 CASE WHEN '{1}' = 'SIGN_A' THEN '0000000000' ELSE REPLACE(RGST_NO, '-', '') END AS IMG FROM ECM_DOCUMENT_SUPP WHERE DOC_ID = {0} AND ('{1}' = 'SIGN_A' OR SUPP_TP = CASE '{1}' WHEN 'SIGN_B' THEN '2' WHEN 'SIGN_C' THEN '3' END) ", doc_id, sys_field);
            objCmd.CommandText = qry;
            using (objDr = objCmd.ExecuteReader())
            {
                if (objDr.Read()) sign_image = objDr[0].ToString();
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
        return sign_image;
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

    protected static string findValue(DataTable dt, string field)
    {
        DataRow[] dr = dt.Select(string.Format("field_nm='{0}'", field));

        string rtn = string.Empty;

        if (!(dr == null || dr.Length == 0))
            rtn = dr[0]["value"].ToString();

        return string.IsNullOrEmpty(rtn) ? "" : rtn;

    }

    protected static void setConfirmDoc(string doc_id, string file_path)
    {
        try
        {
            string strDocNm = Path.GetFileName(file_path);
            string strDocPath = Path.GetDirectoryName(file_path) + "\\";
            string strDocExt = Path.GetExtension(file_path).Substring(1);
            string strQuery = string.Format("UPDATE C" +
                                            "   SET FILE_NM = '{1}', FILE_EXT = '{2}', FILE_PATH = '{3}'" +
                                            "  FROM ECM_DOCUMENT A INNER JOIN ECM_DOCUMENT_FILE B ON A.DOC_ID = B.DOC_ID" +
                                            "                      INNER JOIN ZFILE C ON B.FILE_ID = C.FILE_ID AND B.DOC_TP = '1'" +
                                            " WHERE A.PSTAT = 'CFM'" +
                                            "   AND A.DOC_ID = {0}", doc_id, strDocNm, strDocExt, strDocPath);
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
            throw new Exception("계약서 양식 파일 정보 업데이트 오류.\n- " + ex.Message);
        }

    }

}
