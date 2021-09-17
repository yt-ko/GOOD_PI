using DevExpress.Spreadsheet;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;
using DevExpress.XtraSpreadsheet;

public partial class Job_SRM_1060 : System.Web.UI.Page
{
    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;
    protected static string strUser = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["AUTH"] == null)
        {
            string url = "~/Master/IntroProcess.aspx?REDIRECT=" + System.Web.HttpUtility.UrlEncode(Request.Url.PathAndQuery);
            Response.Redirect(url);
        }
        strUser = Session["USR_ID"].ToString();
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

        if (string.IsNullOrEmpty(strUser))
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "장시간 미입력 등으로 정보가 유효하지 않습니다.\n다시 로그인 후 사용해 주세요.")
                        )
                    );
        }

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
            string strPurNo = DATA.getOption("PUR_NO");
            string strToday = DateTime.Now.ToString("yyMM");

            string sFileIdSrc = strPage;
            string sFileIdTrg = sFileIdSrc + "_" + strUser;
            string sFileNmTrg = strToday + "/" + sFileIdTrg + "." + (strPrint.ToUpper().Equals("PDF") ? "pdf" : "xlsx");
            string strRoot = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Report"), strPage);

            string strSource = System.IO.Path.Combine(strRoot, sFileIdSrc + ".xlsx");
            string strTarget = System.IO.Path.Combine(strRoot, strToday);
            if (!System.IO.Directory.Exists(strTarget))
                System.IO.Directory.CreateDirectory(strTarget);
            strTarget = System.IO.Path.Combine(strTarget, sFileIdTrg);

            SpreadsheetControl objWorkBook;
            Worksheet objWorkSheet;
            try
            {
                System.IO.File.Copy(strSource, strTarget + ".xlsx", true);
                objWorkBook = new SpreadsheetControl();
                objWorkBook.LoadDocument(strTarget + ".xlsx", DevExpress.Spreadsheet.DocumentFormat.Xlsx);
                objWorkSheet = objWorkBook.Document.Worksheets[0];
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            #endregion

            #region process Query & set to Print.

            try
            {
                objWorkSheet = objWorkBook.Document.Worksheets[0];
                entityNameValue objArg = new entityNameValue(true);
                string[] strSupp = new string[6];


                #region 견적 접수결과SUMMARY

                objArg.Add("arg_pur_no", strPurNo);
                objCmd.CommandText = getQuery("SRM_1060_1", objArg);
                objDr = objCmd.ExecuteReader();
                if (objDr.Read())
                {
                    strSupp[0] = objDr["final_supp_nm"].ToString();
                    strSupp[1] = objDr["supp_nm1"].ToString();
                    strSupp[2] = objDr["supp_nm2"].ToString();
                    strSupp[3] = objDr["supp_nm3"].ToString();
                    strSupp[4] = objDr["supp_nm4"].ToString();
                    strSupp[5] = objDr["supp_nm5"].ToString();

                    objWorkSheet.Cells["A2"].Value = string.Format(objWorkSheet.Cells["A2"].Value.ToString(), strSupp[0], string.Format("{0:#,##0}", Convert.ToInt64(objDr["final_amt"])));

                    objWorkSheet.Cells["K5"].Value = objWorkSheet.Cells["K5"].Value.ToString().Replace("SUPP", strSupp[0]);
                    objWorkSheet.Cells["N5"].Value = objWorkSheet.Cells["N5"].Value.ToString().Replace("SUPP", strSupp[1]);

                    int iCell = 26;
                    for (int i = strSupp.Length - 1; i >= 2; i--)
                    {
                        if (!string.IsNullOrEmpty(strSupp[i]))
                        {
                            string cell = GetExcelColumnName(iCell);
                            objWorkSheet.Cells[cell + "5"].Value = strSupp[i] + "\n" + (i == 5 ? "⑤" : i == 4 ? "④" : i == 3 ? "③" : "②");
                            objWorkSheet.Cells[cell + "6"].SetValue(string.IsNullOrEmpty(strSupp[i]) ? 0 : objDr["amt" + i.ToString()] == DBNull.Value ? 0 : objDr["amt" + i.ToString()]);
                            objWorkSheet.Cells[cell + "6"].NumberFormat = "#,##0_ ";
                            iCell -= 3;
                        }
                    }
                    //objWorkSheet.Cells["Q5"].Value = objWorkSheet.Cells["Q5"].Value.ToString().Replace("SUPP", strSupp[2]);
                    //objWorkSheet.Cells["T5"].Value = objWorkSheet.Cells["T5"].Value.ToString().Replace("SUPP", strSupp[3]);
                    //objWorkSheet.Cells["W5"].Value = objWorkSheet.Cells["W5"].Value.ToString().Replace("SUPP", strSupp[4]);
                    //objWorkSheet.Cells["Z5"].Value = objWorkSheet.Cells["Z5"].Value.ToString().Replace("SUPP", strSupp[5]);

                    objWorkSheet.Cells["A6"].Value = objDr["item_nm"].ToString();
                    objWorkSheet.Cells["K6"].SetValue(objDr["final_amt"] == DBNull.Value ? 0 : objDr["final_amt"]);
                    objWorkSheet.Cells["K6"].NumberFormat = "#,##0_ ";
                    objWorkSheet.Cells["N6"].SetValue(string.IsNullOrEmpty(strSupp[1]) ? 0 : objDr["amt1"] == DBNull.Value ? 0 : objDr["amt1"]);
                    objWorkSheet.Cells["N6"].NumberFormat = "#,##0_ ";
                    //objWorkSheet.Cells["Q6"].SetValue(string.IsNullOrEmpty(strSupp[2]) ? 0 : objDr["amt2"] == DBNull.Value ? 0 : objDr["amt2"]);
                    //objWorkSheet.Cells["Q6"].NumberFormat = "#,##0_ ";
                    //objWorkSheet.Cells["T6"].SetValue(string.IsNullOrEmpty(strSupp[3]) ? 0 : objDr["amt3"] == DBNull.Value ? 0 : objDr["amt3"]);
                    //objWorkSheet.Cells["T6"].NumberFormat = "#,##0_ ";
                    //objWorkSheet.Cells["W6"].SetValue(string.IsNullOrEmpty(strSupp[4]) ? 0 : objDr["amt4"] == DBNull.Value ? 0 : objDr["amt4"]);
                    //objWorkSheet.Cells["W6"].NumberFormat = "#,##0_ ";
                    //objWorkSheet.Cells["Z6"].SetValue(string.IsNullOrEmpty(strSupp[5]) ? 0 : objDr["amt5"] == DBNull.Value ? 0 : objDr["amt5"]);
                    //objWorkSheet.Cells["Z6"].NumberFormat = "#,##0_ ";

                    objWorkSheet.Cells["AC6"].SetValue(objDr["r1"] == DBNull.Value ? 0 : objDr["r1"]);
                    objWorkSheet.Cells["AC6"].NumberFormat = "#,##0.0_ ";
                    objWorkSheet.Cells["AF6"].SetValue(objDr["r2"] == DBNull.Value ? 0 : objDr["r2"]);
                    objWorkSheet.Cells["AF6"].NumberFormat = "#,##0.0_ ";
                }
                objDr.Close();

                #endregion

                #region 견적 접수결과 세부내역

                // Header
                int iCell2 = 35;
                string strAmtNum = string.Empty;
                for (int i = strSupp.Length - 1; i >= 0; i--)
                {
                    if (!string.IsNullOrEmpty(strSupp[i]))
                    {
                        iCell2 -= 3;
                        strAmtNum += (string.IsNullOrEmpty(strAmtNum) ? "" : ",") + (i == 0 ? "final_price" : "price" + i.ToString());
                        string cell = GetExcelColumnName(iCell2);
                        objWorkSheet.Cells[cell + "9"].Value = strSupp[i] + "\n단가";
                        if (i == 0) objWorkSheet.Cells[cell + "9"].Font.Bold = true;
                    }
                }
                for (int i = 17; i < iCell2; i++)
                {
                    objWorkSheet.Columns[GetExcelColumnName(i)].Visible = false;
                }

                objCmd.CommandText = getQuery("SRM_1060_2", objArg);
                objDr = objCmd.ExecuteReader();
                int iStart = 10, iRow = iStart;
                while (objDr.Read())
                {
                    objWorkSheet.Cells["A" + iRow.ToString()].Value = iRow - 9;                                 // No.
                    objWorkSheet.Cells["A" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;

                    objWorkSheet.Cells["B" + iRow.ToString()].Value = objDr["item_cd"].ToString();              // 품번
                    objWorkSheet.Range["B" + iRow.ToString() + ":D" + iRow.ToString()].Merge();

                    objWorkSheet.Cells["E" + iRow.ToString()].Value = objDr["item_nm"].ToString();              // 품명
                    objWorkSheet.Range["E" + iRow.ToString() + ":H" + iRow.ToString()].Merge();

                    objWorkSheet.Cells["I" + iRow.ToString()].Value = objDr["item_spec"].ToString();            // 규격
                    objWorkSheet.Range["I" + iRow.ToString() + ":L" + iRow.ToString()].Merge();

                    objWorkSheet.Cells["M" + iRow.ToString()].Value = objDr["uom"].ToString();                  // 단위
                    objWorkSheet.Range["M" + iRow.ToString() + ":N" + iRow.ToString()].Merge();
                    objWorkSheet.Range["M" + iRow.ToString() + ":N" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;

                    objWorkSheet.Cells["O" + iRow.ToString()].SetValue(objDr["qty"]);                           // 수량
                    objWorkSheet.Range["O" + iRow.ToString() + ":P" + iRow.ToString()].Merge();
                    objWorkSheet.Range["O" + iRow.ToString() + ":P" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                    objWorkSheet.Range["O" + iRow.ToString() + ":P" + iRow.ToString()].NumberFormat = "#,##0_ ";

                    // 업체별 금액
                    iCell2 = 35;
                    for (int i = 0; i < strAmtNum.Split(',').Length; i++)
                    {
                        if (!string.IsNullOrEmpty((strAmtNum.Split(',')[i])))
                        {
                            iCell2 -= 3;
                            string cell1 = GetExcelColumnName(iCell2) + iRow.ToString();
                            string cell2 = GetExcelColumnName(iCell2 + 2) + iRow.ToString();

                            objWorkSheet.Cells[cell1].SetValue(objDr[strAmtNum.Split(',')[i]]);
                            objWorkSheet.Range[cell1 + ":" + cell2].Merge();
                            objWorkSheet.Range[cell1 + ":" + cell2].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                            objWorkSheet.Range[cell1 + ":" + cell2].NumberFormat = "#,##0_ ";
                        }
                    }
                    iRow++;
                }
                // Summary
                objWorkSheet.Cells["A" + iRow.ToString()].Value = "합         계";
                objWorkSheet.Range["A" + iRow.ToString() + ":P" + iRow.ToString()].Merge();
                objWorkSheet.Range["A" + iRow.ToString() + ":P" + iRow.ToString()].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;
                // 업체별 Summary
                iCell2 = 35;
                for (int i = 0; i < strAmtNum.Split(',').Length; i++)
                {
                    if (!string.IsNullOrEmpty((strAmtNum.Split(',')[i])))
                    {
                        iCell2 -= 3;
                        string cell1 = GetExcelColumnName(iCell2) + iRow.ToString();
                        string cell2 = GetExcelColumnName(iCell2 + 2) + iRow.ToString();

                        objWorkSheet.Cells[cell1].Formula = string.Format("SUMPRODUCT(O{1}:O{2}, {0}{1}:{0}{2})", GetExcelColumnName(iCell2), iStart, iRow - 1);
                        objWorkSheet.Range[cell1 + ":" + cell2].Merge();
                        objWorkSheet.Range[cell1 + ":" + cell2].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Right;
                        objWorkSheet.Range[cell1 + ":" + cell2].NumberFormat = "#,##0_ ";
                    }
                }
                objWorkSheet.Range["A" + iStart.ToString() + ":AH" + iRow.ToString()].Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);
                objWorkSheet.Range["A" + iRow.ToString() + ":AH" + iRow.ToString()].FillColor = objWorkSheet.Cells["A5"].FillColor;
                objWorkSheet.Range["A" + iRow.ToString() + ":AH" + iRow.ToString()].Font.Bold = true;
                #endregion

            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_SQL,
                            "Data 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "Data 조회 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region save to File.

            try
            {
                objWorkBook.SaveDocument(strTarget + ".xlsx", DevExpress.Spreadsheet.DocumentFormat.Xlsx);
                if (strPrint.ToUpper() == "PDF")
                {
                    //string r = objWorkSheet.GetUsedRange().GetReferenceA1();
                    //objWorkSheet.DefinedNames.Add("_xlnm.Print_Area", "Sheet1!" + r);
                    //objWorkSheet.PrintOptions.FitToPage = true;
                    //objWorkSheet.PrintOptions.FitToWidth = 1;
                    //objWorkSheet.PrintOptions.FitToHeight = 0;
                    using (System.IO.FileStream pdf = new System.IO.FileStream(strTarget + ".pdf", System.IO.FileMode.Create))
                    {
                        objWorkBook.ExportToPdf(pdf);
                    }
                }
                objWorkBook.Dispose();
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

    protected static void setSheetName(ref Worksheet _objSheet, string _name)
    {
        int iName = 0;
        string strNewName = _name;

        while (true)
        {
            try
            {
                _objSheet.Name = strNewName;
                break;
            }
            catch (Exception ex)
            {
                strNewName = string.Format("{0} ({1})", _name, ++iName);
                throw new Exception(
                    new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                            "Error : excel sheet name : " + strNewName + "\n - " + ex.Message)
                        )
                    );
            }
        }
    }

    private static string GetExcelColumnName(int columnNumber)
    {
        int dividend = columnNumber;
        string columnName = String.Empty;
        int modulo;

        while (dividend > 0)
        {
            modulo = (dividend - 1) % 26;
            columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
            dividend = (int)((dividend - modulo) / 26);
        }
        return columnName;
    }

    #endregion

}
