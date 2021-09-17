using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
//using Microsoft.Office.Core;
//using Excel = Microsoft.Office.Interop.Excel;
using System.Reflection;
using DevExpress.Spreadsheet;
//using DevExpress.XtraSpreadsheet;
using DevExpress.Web.ASPxSpreadsheet;

public partial class JOB_EHM_2010 : System.Web.UI.Page
{
    protected static SqlConnection dbCon = null;
    protected static SqlCommand dbCmd = null;
    protected static SqlDataReader dbDr = null;
    protected static string mUserId = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        mUserId = Session["USR_ID"].ToString();
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
            #region initialize to Save.

            // initialize to Update.
            //
            objUpdate.initialize(false);

            #endregion

            #region Customize.

            //---------------------------------------------------------------------------
            if (DATA.getFirst().getQuery() == "EHM_2010_M_2"
                && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "AS");
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
                string strKey = objProcedure.objCmd.Parameters["@NewKey"].Value.ToString();
                DATA.setValues("issue_no", strKey);
            }
            //---------------------------------------------------------------------------
            for (int iAry = 0; iAry < DATA.getSize(); iAry++)
            {
                string strID = string.Empty;
                string strKey = string.Empty;
                switch (DATA.getObject(iAry).getQuery())
                {
                    case "EHM_2010_S_1_1":
                        {
                            strID = "AS_ISSUE_D";
                            strKey = "issue_seq";
                        }
                        break;
                    case "EHM_2010_S_3_1":
                        {
                            strID = "AS_ISSUE_W";
                            strKey = "work_seq";
                        }
                        break;
                    case "EHM_2010_S_5_1":
                        {
                            strID = "AS_ISSUE_P";
                            strKey = "part_seq";
                        }
                        break;
                    case "EHM_2010_S_9":
                        {
                            strID = "AS_ISSUE_C";
                            strKey = "chk_seq";
                        }
                        break;
                    default:
                        continue;
                }
                int iKey = 0;
                for (int iRow = 0; iRow < DATA.getObject(iAry).getSize(); iRow++)
                {
                    if (DATA.getObject(iAry).getRow(iRow).getType() == typeQuery.INSERT)
                    {
                        if (iKey == 0)
                        {
                            try
                            {
                                objUpdate.objDr = (new cDBQuery(
                                                        ruleQuery.INLINE,
                                                        "SELECT dbo.FN_CREATEKEY('" + strID + "','" +
                                                            DATA.getValue(iAry, iRow, "issue_no") + "')"
                                                    )).retrieveQuery(objUpdate.objCon);
                                if (objUpdate.objDr.Read())
                                {
                                    iKey = Convert.ToInt32(objUpdate.objDr[0]);
                                }
                                objUpdate.objDr.Close();
                            }
                            catch (SqlException ex)
                            {
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
                                throw new Exception(
                                        new JavaScriptSerializer().Serialize(
                                            new entityProcessed<string>(
                                                    codeProcessed.ERR_PROCESS,
                                                    "Key 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                                        )
                                    );
                            }
                        }
                        DATA.setValue(iAry, iRow, strKey, Convert.ToString(iKey++));
                    }
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

    #endregion

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
    public static string Print(cExcelData DATA)
    {
        #region check Argument.

        // check Argument.
        if (string.IsNullOrEmpty(DATA.getUser()))
        {
            return new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>( codeProcessed.ERR_PARAM, "잘못된 호출입니다.") );
        }

        // 일괄등록 양식 출력
        if (DATA.getOption("PRINT").Equals("DownFormA")) return PrintUploadForm(DATA);

        string strReturn = string.Empty;

        string argKeyNo = DATA.getArgument("arg_key_no");
        string sOutExt = DATA.getOption("PRINT");
        string strPage = DATA.getOption("PAGE");
        string sFormId = DATA.getOption("FORM");

        // Set Form ID & In/Out File Name
        string sFormExt = ".xls";    // xlsx 의 경우 Download 시 Excel 오류 발생
        string sRoot = HttpContext.Current.Server.MapPath("~/") + @"Report\";
        string sOutFile = argKeyNo + "_" + mUserId;
        string sOutPath = sRoot + strPage + @"\";
        string sSource = sRoot + @"Forms\" + sFormId + sFormExt;
        string sTarget = sOutPath + sOutFile + sFormExt;
        sOutFile += "." + sOutExt;

        // Declare SpreadSheet Objects
        DevExpress.Web.ASPxSpreadsheet.ASPxSpreadsheet xls = new ASPxSpreadsheet();
        DevExpress.Spreadsheet.IWorkbook wBook = xls.Document;
        DevExpress.Spreadsheet.Worksheet wSheet;

        #endregion

        try
        {
            //  connect to DB.
            connectDB();

            #region prepare Office object.

            //object objMissing = Type.Missing;
            //object varMissing = System.Reflection.Missing.Value;
            //Excel.XlFixedFormatType enTarget = Excel.XlFixedFormatType.xlTypePDF;
            //Excel.XlFixedFormatQuality enQuality = Excel.XlFixedFormatQuality.xlQualityStandard;
            //Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;

            // create Oupput File from Form File &load to SpreadSheet
            try
            {
                System.IO.File.Copy(sSource, sTarget, true);
                wBook.LoadDocument(sTarget);
                wSheet = wBook.Worksheets[0];
                wBook.BeginUpdate();
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_PROCESS, "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region process Query & set to Print.

            string sIssueClass = "EHM";
            try
            {
                // 발생정보
                string strQuery = string.Format(@"
                    SELECT 
                          A.issue_no
                        , A.ins_dt
                        , B.prod_cd
                        , B.prod_nm
                        , B.prod_sno
                        , A.prod_sub
                        , dbo.to_format(A.issue_dt,'CTOD') AS issue_dt
                        , dbo.fn_getName('USER_NAME','',A.ins_usr) AS ins_usr
                        , dbo.fn_getName('사원명','',A.aemp) AS aemp
                        , case D.rcode when 'PM' then 'POP' when 'QC' then 'QDM' else 'EHM' end as issue_class
                    FROM AS_ISSUE A
                        INNER JOIN V_PROD_AS B ON B.prod_key = A.prod_key
                        Inner Join ZCODED D On D.hcode = 'IEHM11' and D.dcode = A.issue_tp
                    WHERE A.issue_no = '{0}'
                    ",
                    argKeyNo
                );
                dbDr = (new cDBQuery(ruleQuery.INLINE, strQuery)).retrieveQuery(dbCon);
                if (dbDr.Read())
                {
                    wSheet.Cells[7, 3].Value = dbDr["issue_no"].ToString();         // [8, 4].V
                    wSheet.Cells[7, 10].Value = dbDr["ins_dt"].ToString();          // [8, 11].
                    wSheet.Cells[9, 3].Value = dbDr["prod_cd"].ToString();         // [10, 4].
                    wSheet.Cells[9, 7].Value = dbDr["prod_nm"].ToString();         // [10, 8].
                    wSheet.Cells[9, 11].Value = dbDr["prod_sno"].ToString();       // [10, 12]
                    wSheet.Cells[10, 3].Value = dbDr["issue_dt"].ToString();        // [11, 4].
                    wSheet.Cells[10, 7].Value = dbDr["ins_usr"].ToString();         // [11, 8].
                    wSheet.Cells[10, 11].Value = dbDr["aemp"].ToString();           // [11, 12]
                    wSheet.Cells[10, 14].Value = dbDr["prod_sub"].ToString();       // [11, 15]
                    sIssueClass = dbDr["issue_class"].ToString();
                }
                else throw new Exception("해당 데이터를 찾을 수 없습니다.");
                dbDr.Close();

                // 발생구분 : 현상/부위/원인/귀책사유
                strQuery = string.Format(@"
                    SELECT 
                         dbo.fn_getName('ZCODE','I{1}21',A.status_tp1) + ' : ' + dbo.fn_getName('ZCODE','I{1}31',A.status_tp2)  AS status_tp
                        , dbo.fn_getName('ZCODE','I{1}22',A.part_tp1) + ' : '  + dbo.fn_getName('ZCODE','I{1}32',A.part_tp2) AS part_tp
                        , dbo.fn_getName('ZCODE','I{1}23',A.reason_tp1) + ' : '  + dbo.fn_getName('ZCODE','I{1}33',A.reason_tp2) AS reason_tp
                        , dbo.fn_getName('ZCODE','I{1}25',A.duty_tp1) + ' : '  + dbo.fn_getName('ZCODE','I{1}35',A.duty_tp2) AS duty_tp
                    FROM AS_ISSUE_D A
                        Inner Join AS_ISSUE B On B.issue_no = A.issue_no
                    WHERE A.issue_no = '{0}'
                    AND A.issue_seq = 1
                    ", argKeyNo, sIssueClass
                );

                dbDr = (new cDBQuery( ruleQuery.INLINE, strQuery )).retrieveQuery(dbCon);
                if (dbDr.Read())
                {
                    wSheet.Cells[11, 4].Value = (dbDr["status_tp"].ToString() == " : ") ? "" : dbDr["status_tp"].ToString();        // 12, 5].
                    wSheet.Cells[11, 11].Value = (dbDr["duty_tp"].ToString() == " : ") ? "" : dbDr["duty_tp"].ToString();           // 12, 12]
                    wSheet.Cells[12, 4].Value = (dbDr["part_tp"].ToString() == " : ") ? "" : dbDr["part_tp"].ToString();            // 13, 5].
                    wSheet.Cells[12, 11].Value = (dbDr["reason_tp"].ToString() == " : ") ? "" : dbDr["reason_tp"].ToString();       // 13, 12]
                }
                else throw new Exception("해당 데이터를 찾을 수 없습니다.");
                dbDr.Close();

                // 제조의 경우 발생현상, 귀책사유 미사용 (12Row)
                //if (sIssueClass == "POP") objWorkSheet.Rows[0].Height = 0

                // 믄제Part
                strQuery = string.Format(@"
                    SELECT 
                          A.apart_cd + ' : ' + A.apart_nm + ' : ' + A.apart_sno AS part
                    FROM AS_ISSUE_P A
                    WHERE A.issue_no = '{0}'
                    AND A.apart_nm > ' '
                    ORDER BY A.change_dt
                    ",
                    argKeyNo
                );
                string strText = string.Empty;
                dbDr = (new cDBQuery(ruleQuery.INLINE, strQuery)).retrieveQuery(dbCon);
                int iRow = 0;
                while (dbDr.Read())
                {
                    strText += ((iRow > 0) ? "\n" : "");
                    strText += dbDr["part"].ToString();
                    iRow++;
                }
                dbDr.Close();

                wSheet.Cells[13, 3].Value = strText;        // [14, 4]

                // 발생현상, 조치내용
                strQuery = string.Format(@"
                    SELECT case rmk_cd when 'STATUS' then rmk_text else '' end as rmk_status,
                          case rmk_cd when 'WORK' then rmk_text else '' end as rmk_work
                    FROM AS_ISSUE_RMK A
                    WHERE A.issue_no = '{0}'
                    AND A.rmk_cd IN('STATUS', 'WORK')
                    ",
                    argKeyNo
                );
                dbDr = (new cDBQuery(ruleQuery.INLINE, strQuery)).retrieveQuery(dbCon);
                if (dbDr.Read())
                {
                    wSheet.Cells[16, 2].Value = dbDr["rmk_status"].ToString().Replace("\r\n", "\n");      // [17, 3]
                    wSheet.Cells[24, 2].Value = dbDr["rmk_work"].ToString().Replace("\r\n", "\n");        // [25, 3]
                }
                dbDr.Close();

                // 조치내역
                strQuery = string.Format(@"
                    SELECT 
                          '<' + dbo.to_format(work_dt,'CTOD')
                          + '> ' + dbo.fn_getName('ZCODE','I{1}24',work_tp1)
                          + ' : ' + dbo.fn_getName('ZCODE','I{1}34',work_tp2)
                          + case when work_man1 > ' ' then '  (작업자 : ' + work_man1 + ')' else '' end AS work
                    FROM AS_ISSUE_W A
                    WHERE A.issue_no = '{0}'
                    ORDER BY A.work_dt
                    ", argKeyNo, sIssueClass
                );
                strText = string.Empty;
                dbDr = (new cDBQuery( ruleQuery.INLINE, strQuery )).retrieveQuery(dbCon);
                iRow = 0;
                while (dbDr.Read())
                {
                    strText += ((iRow > 0) ? "\n" : "");
                    strText += dbDr["work"].ToString();
                    iRow++;
                }
                dbDr.Close();
                wSheet.Cells[33, 3].Value = strText;    // [34, 4]
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>( codeProcessed.ERR_SQL, "데이터 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>( codeProcessed.ERR_PROCESS, "출력물 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion

            #region save to File.

            try
            {
                wBook.EndUpdate();
                wBook.SaveDocument(sTarget);
                wBook.ExportToPdf(sOutPath + sOutFile);

                strReturn = new JavaScriptSerializer().Serialize( new entityProcessed<string>( codeProcessed.SUCCESS, sOutFile) );
                

            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                            codeProcessed.ERR_PROCESS,
                            "파일 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            #endregion
        }
        catch (Exception ex)
        {
            strReturn = ex.Message;
        }
        finally
        {
            // release.
            if (dbDr != null) dbDr.Close();
            if (dbCon != null) dbCon.Close();
            if (wBook != null) wBook.Dispose();
            if (xls != null) xls.Dispose();
            //if (System.IO.File.Exists(sTarget)) System.IO.File.Delete(sTarget); // xls 파일 삭제
        }

        return strReturn;
    }

    #endregion

    [WebMethod]
    public static string PrintUploadForm(cExcelData DATA)
    {
        string strReturn = string.Empty;

        // get Argument & Option
        string strPage = DATA.getOption("PAGE");
        string sFormId = DATA.getOption("FORM");

        // Set Form ID & In/Out File Name
        string sFormExt = ".xls";    // xlsx 의 경우 Download 시 Excel 오류 발생
        string sRoot = HttpContext.Current.Server.MapPath("~/");
        string sSource = sRoot + @"Report\Forms\" + sFormId + sFormExt;

        string sOutFile = sFormId + "_" + mUserId + sFormExt;
        string sOutPath = sRoot + @"Report\" + strPage + @"\";
        string sTarget = sOutPath + sOutFile;

        // Declare SpreadSheet Objects
        DevExpress.Web.ASPxSpreadsheet.ASPxSpreadsheet xls = new ASPxSpreadsheet();
        DevExpress.Spreadsheet.IWorkbook wBook = xls.Document;
        DevExpress.Spreadsheet.Worksheet wSheet;
        DevExpress.Spreadsheet.Range wRange;

        try
        {
            connectDB();

            #region create Oupput File from Form File & load to SpreadSheet

            try
            {
                System.IO.File.Copy(sSource, sTarget, true);
                wBook.LoadDocument(sTarget);
                wSheet = wBook.Worksheets[1];
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>( codeProcessed.ERR_PROCESS, "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            #endregion

            // process Query & set to Print.
            try
            {
                wBook.BeginUpdate();
                string strBody = string.Format("SELECT F.dcode, dbo.fn_getName('ZCODE', F.hcode, F.dcode) AS dname\n"
                                             + "  FROM ZCODEF F INNER JOIN ZCODED D\n"
                                             + "                        ON D.hcode = F.hcode\n"
                                             + "                       AND D.dcode = F.dcode\n"
                                             + "                       AND D.use_yn = '1'\n"
                                             + " WHERE F.hcode = 'IEHM29'\n"
                                             + "   AND F.use_yn = '1'\n"
                                             + "   AND F.fcode = '{0}'\n"
                                             + "ORDER BY F.sort_seq, F.dcode", HttpUtility.UrlDecode(DATA.getArgument("prod_type")));
                dbCmd = new SqlCommand(strBody, dbCon);
                dbDr = dbCmd.ExecuteReader();

                int iStart = 8;
                int iRow = iStart; // refer to Proto file.
                while (dbDr.Read())
                {
                    wSheet.Cells["A" + iRow.ToString()].Value = dbDr["dcode"].ToString();
                    wSheet.Cells["B" + iRow.ToString()].Value = dbDr["dname"].ToString();
                    iRow++;
                }
                // 기타
                wSheet.Cells["A" + iRow.ToString()].Value = "기타";
                wSheet.Cells["B" + iRow.ToString()].Value = "기타";

                wRange = wSheet.Range["A" + iStart.ToString() + ":B" + iRow.ToString()];
                wRange.Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);

                wRange = wSheet.Range["A1:B" + iRow.ToString()];
                wRange.AutoFitColumns();

                dbDr.Close();
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_SQL, "Data 조회에 실패하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(codeProcessed.ERR_PROCESS, "출력물 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }

            // save to File.
            try
            {
                wBook.EndUpdate();
                wBook.Worksheets.ActiveWorksheet = wBook.Worksheets[0];
                wBook.SaveDocument(sTarget);

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(codeProcessed.SUCCESS, sOutFile)
                            );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>( codeProcessed.ERR_PROCESS, "Print 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
        }
        catch (Exception ex)
        {
            strReturn = ex.Message;
        }
        finally
        {
            if (dbDr != null) dbDr.Close();
            if (dbCon != null) dbCon.Close();
            if (wBook != null) wBook.Dispose();
            if (xls != null) xls.Dispose();
        }

        return strReturn;
    }

    protected static void connectDB()
    {
        try
        {
            dbCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            dbCon.Open();
            dbCmd = new SqlCommand("", dbCon);
        }
        catch (SqlException ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_SQL,
                        "Database에 연결할 수 없습니다.\n- " + ex.Message)
                    )
                );
        }
        catch (Exception ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                        "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }
    }

    protected static Boolean checkEmpty(object _val)
    {
        if (_val == null || _val.ToString().TrimEnd().Length < 1) return true;
        return false;
    }

    /* SpreadSheet Reference
        //Sample Setting of Cell
        //objWorkSheet.Cells["K6"].NumberFormat = "#,##0_ ";
        //objWorkSheet.Cells["A2"].Value = string.Format("{0:#,##0}", Convert.ToInt64(objDr["aa"]) );
        //objWorkSheet.Columns[GetExcelColumnName(i)].Visible = false;  //Hide Coloumn
        //objWorkSheet.Cells["A1"].Alignment.Horizontal = SpreadsheetHorizontalAlignment.Center;   //Set Alignment
        //objWorkSheet.Range["O1:P4"].Merge();   //Merge Range
        //objWorkSheet.Cells["A1"].Formula = string.Format("SUMPRODUCT(O{1}:O{2}, {0}{1}:{0}{2})", GetExcelColumnName(iCell2), iStart, iRow - 1);  //Set Formula
        //objWorkSheet.Range["A1:H9"].Borders.SetAllBorders(System.Drawing.Color.Black, BorderLineStyle.Thin);  //Set Borders
        //objWorkSheet.Range["A1:H9"].FillColor = objWorkSheet.Cells["A5"].FillColor;   //Set FillColor
        //objWorkSheet.Range["A1:H9"].Font.Bold = true; //Set Font

        // Print Option
        //string r = objWorkSheet.GetUsedRange().GetReferenceA1();
        //objWorkSheet.DefinedNames.Add("_xlnm.Print_Area", "Sheet1!" + r);
        //objWorkSheet.PrintOptions.FitToPage = true;
        //objWorkSheet.PrintOptions.FitToWidth = 1;
        //objWorkSheet.PrintOptions.FitToHeight = 0;

        // ExprtToPdf
        using (System.IO.FileStream outFile = new System.IO.FileStream(sFileTrg, System.IO.FileMode.Create))
        {
            //aaa.Document.ExportToPdf(outFile);
            objWorkBook.ExportToPdf(outFile);
        }

     */
}
