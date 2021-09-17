using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using Word = Microsoft.Office.Interop.Word;

public partial class Job_TDR_1010 : System.Web.UI.Page
{
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
            #region prepare Office object.

            string strType = DATA.getOption("TYPE");
            string strFileName = (strType == "rpt1" ? "표준 기술자료 제공 동의서.docx" : "기술자료제공 요청서.docx");
            string strQuery = (strType == "rpt1" ? "TDR_1010_P" : "TDR_1010_P2");
            string strExt = DATA.getOption("PRINT");
            string strPage = DATA.getOption("PAGE");
            string strUserId = DATA.getOption("USR_ID");
            string strTdrId = DATA.getOption("TDR_ID");
            string strTdrNo = DATA.getOption("TDR_NO");
            string strSuppId = DATA.getOption("SUPP_ID");
            string strThirdId = DATA.getOption("THIRD_ID");
            string strRoot = HttpContext.Current.Server.MapPath("~/");
            string strSource = Path.Combine(strRoot, "Report", strPage, strFileName);
            string strToday = DateTime.Now.ToString("yyyyMMdd");
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage, strToday))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage, strToday));
            string strTarget = string.Format(@"{0}\{1}_{2}{3}", Path.Combine(strRoot, "Report", strPage, strToday), strTdrNo, strUserId, Path.GetExtension(strSource));
            string sFileNmTrg = string.Format("{0}/{1}_{2}.{3}", strToday, strTdrNo, strUserId, strExt);
            object objMissing = Type.Missing;

            #endregion

            try
            {
                File.Copy(strSource, strTarget, true);
            }
            catch
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "파일 생성 중 오류가 발생하였습니다.(1)")
                        )
                    );
            }

            Word.Application _WordApp = new Word.Application();
            _WordApp.Visible = false;
            Word.Document _WordDoc = null;
            _WordDoc = _WordApp.Documents.Open(strTarget);

            #region process Query & set to Print.
            try
            {

                DataTable dt = getData(strQuery, strTdrId, strSuppId, strThirdId);
                if (dt.Rows.Count < 1)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "사용자 정보가 존재하지 않습니다.(2)")
                            )
                        );
                }

                string[] strFileds = dt.Columns.Cast<DataColumn>().Select(x => x.ColumnName).ToArray();
                foreach (string f1 in strFileds)
                {
                    foreach (Word.Field f2 in _WordDoc.Fields)
                    {
                        Word.Range r = f2.Code;
                        if (r.Text.StartsWith(" MERGEFIELD"))
                        {
                            int pos = (" MERGEFIELD").Length;
                            string field = r.Text.Trim().Substring(pos, r.Text.Trim().Length - pos).Trim();
                            field = field.Split('\\')[0].Trim().Replace("\"", "");

                            if (f1.Equals(field))
                            {
                                f2.Select();
                                string val = getValue(dt, f1);
                                if (string.IsNullOrEmpty(val))
                                    _WordApp.Selection.TypeBackspace();
                                else
                                    _WordApp.Selection.TypeText(val);
                            }
                        }
                    }
                }
                _WordDoc.Save();
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
                            "파일 생성 중 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            #endregion

            #region save to File.

            try
            {
                if (strExt.ToUpper().Equals("PDF"))
                {
                    string paramExportFilePath = Path.ChangeExtension(strTarget, strExt);
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
                }

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
                _WordDoc.Close();
                _WordApp.Quit();

                if (_WordDoc != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(_WordDoc);

                if (_WordApp != null)
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(_WordApp);
            }
            strReturn = new JavaScriptSerializer().Serialize(
                new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
            );

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
            #endregion
        }

        return strReturn;
    }
    #endregion

    protected static DataTable getData(string qry_id, string tdr_id, string supp_id, string third_id)
    {
        DataTable dt = new DataTable();
        try
        {
            entityNameValue objArg = new entityNameValue(true);
            objArg.Add("arg_tdr_id", tdr_id);
            objArg.Add("arg_supp_id", supp_id);
            objArg.Add("arg_third_id", third_id);
            string strSQL = getQuery(qry_id, objArg);

            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
            {
                objCon.Open();
                using (SqlDataReader objDr = objCmd.ExecuteReader())
                {
                    dt.Load(objDr);
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
        return dt;
    }

    protected static string getValue(DataTable dt, string field)
    {
        //DataRow[] dr = dt.Select(string.Format("field_nm='{0}'", field));
        //string rtn = string.Empty;
        //if (!(dr == null || dr.Length == 0))
        //    rtn = dr[0]["value"].ToString();
        string rtn = dt.Rows[0][field].ToString();
        return string.IsNullOrEmpty(rtn) ? "" : rtn;
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
                    if (objArg == null) continue;
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

}


