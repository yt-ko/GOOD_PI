using System;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Data.SqlClient;
using System.Configuration;
//using Excel = Microsoft.Office.Interop.Excel;

public partial class JOB_EHM_2054 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    //#region Print() : DB의 Data를 통해 출력물 Create.

    ///// <summary>
    ///// Print() : DB의 Data를 통해 출력물 Create.
    /////     : input
    /////         - DATA : Query and Argument / Option
    /////     : output 
    /////         - success : 출력물 파일 정보
    /////         - else : entityProcessed (string)
    ///// </summary>
    //[WebMethod]
    //public static string Print(cExcelData DATA)
    //{
    //    #region check Argument.

    //    // check Argument.
    //    //
    //    if (string.IsNullOrEmpty(DATA.getUser()))
    //    {
    //        return new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(codeProcessed.ERR_PARAM, "잘못된 호출입니다.")
    //                );
    //    }

    //    #endregion

    //    #region  get Options & Arguments
    //    string strType = DATA.getOption("PRINT");   //Print Option
    //    string strPage = DATA.getOption("PAGE");    //Report Folder
    //    string arg_ymd_fr = DATA.getArgument("arg_ymd_fr");
    //    string arg_ymd_to = DATA.getArgument("arg_ymd_to");
    //    string arg_dept_area = DATA.getArgument("arg_dept_area");
    //    string arg_prod_group = DATA.getArgument("arg_prod_group").Replace("%25", "%");
    //    string arg_prod_type1 = DATA.getArgument("arg_prod_type1").Replace("%25", "%");
    //    string arg_prod_type2 = DATA.getArgument("arg_prod_type2").Replace("%25", "%");
    //    string arg_prod_type3 = DATA.getArgument("arg_prod_type3").Replace("%25", "%");
    //    string arg_prod_type4 = DATA.getArgument("arg_prod_type4").Replace("%25", "%");
    //    string arg_prod_type5 = DATA.getArgument("arg_prod_type5").Replace("%25", "%");
    //    string arg_prod_subtp = DATA.getArgument("arg_prod_subtp").Replace("%25", "%");
    //    string arg_cust_cd = DATA.getArgument("arg_cust_cd").Replace("%25", "%");
    //    string arg_cust_dept1 = DATA.getArgument("arg_cust_dept1").Replace("%25", "%").Replace("%20", " ");
    //    string arg_cust_dept2 = DATA.getArgument("arg_cust_dept2").Replace("%25", "%").Replace("%20", " ");
    //    string arg_cust_dept3 = DATA.getArgument("arg_cust_dept3").Replace("%25", "%").Replace("%20", " ");
    //    string arg_cust_dept4 = DATA.getArgument("arg_cust_dept4").Replace("%25", "%").Replace("%20", " ");
    //    string arg_cust_dept5 = DATA.getArgument("arg_cust_dept5").Replace("%25", "%").Replace("%20", " ");
    //    string arg_cust_dept6 = DATA.getArgument("arg_cust_dept6").Replace("%25", "%").Replace("%20", " ");
    //    string arg_cust_prod_nm = DATA.getArgument("arg_cust_prod_nm").Replace("%25", "%");
    //    string arg_run_yn = DATA.getArgument("arg_run_yn");
    //    #endregion

    //    string strReturn = string.Empty;

    //    SqlConnection objCon = null;
    //    SqlDataReader objDr = null;
    //    Microsoft.Office.Interop.Excel.Application objExcel = null;
    //    try
    //    {
    //        #region connect to DB.

    //        try
    //        {
    //            objCon = new SqlConnection(
    //                                ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
    //            objCon.Open();
    //        }
    //        catch (SqlException ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>( codeProcessed.ERR_SQL,
    //                        "Database에 연결할 수 없습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>( codeProcessed.ERR_PROCESS,
    //                        "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion

    //        #region prepare Office object.

    //        // 소스파일 및 생성파일명 설정
    //        string strIndex = DateTime.Today.ToString("yyyyMMdd");

    //        string strRoot = HttpContext.Current.Server.MapPath("~/");
    //        string strSrcFileNm = (arg_prod_subtp == "TWIN") ? "Down지표(Twin)" : "Down지표(Single)";
    //        string strSource = strRoot + "Report/" + strPage + "/" + strSrcFileNm + ".xls";
    //        string strTarget = strRoot + "Report/" + strPage + "/" + strSrcFileNm + "_" + strIndex;
    //        string strPrint = strSrcFileNm + "_" + strIndex + "." + strType;

    //        object varMissing = System.Reflection.Missing.Value;
    //        Excel._Workbook objWorkBook;
    //        Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;

    //        try
    //        {
    //            objExcel = new Excel.Application();
    //            objExcel.DisplayAlerts = false;
    //            objExcel.Visible = false;
    //            objWorkBook = objExcel.Workbooks.Open(strSource, false, true,
    //                            varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(codeProcessed.ERR_PROCESS,
    //                        "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion

    //        #region process Query & set to Print. 

    //        Excel._Worksheet objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
    //        Excel._Worksheet objBaseSheet = (Excel.Worksheet)objWorkBook.Sheets[2];
    //        Excel.Range objWorkRange, objBaseRange;

    //        try
    //        {
    //            #region Set Excel Sheet Data
    //            arg_run_yn = "0";   //모든 일자가 포함되도록 하기 위함. by JJJ. 인수를 인정할 경우 출력로직 변경 요함.
    //            string strQuery = string.Format(@"
    //                SELECT dt, cust_cd + cust_dept + cust_prod_nm AS group_cd
	   //                 ,cust_cd ,cust_nm ,cust_dept ,cust_prod_nm
	   //                 ,status1 ,status2 ,status3 ,status4 ,status5 ,status6 ,status7
    //                FROM [dbo].[fn_EHM_DownTime]('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}'
    //                                            , '{8}', '{9}', '{10}', '{11}', '{12}', '{13}', '{14}', '{15}', '{16}', '{17}', '{18}')
    //                WHERE dt <> '합계'
    //                ORDER BY group_cd, dt
    //                ",
    //                arg_ymd_fr, arg_ymd_to, arg_dept_area, arg_cust_cd, arg_cust_dept1, arg_cust_dept2
    //                , arg_cust_dept3, arg_cust_dept4, arg_cust_dept5, arg_cust_dept6
    //                , arg_cust_prod_nm, arg_prod_group, arg_prod_type1, arg_run_yn
    //                , arg_prod_type2, arg_prod_type3, arg_prod_type4, arg_prod_type5, arg_prod_subtp
    //            );
    //            objDr = (new cDBQuery(ruleQuery.INLINE, strQuery)).retrieveQuery(objCon);
    //            int nDataRow = 0; 
    //            int nStartRow = 4; int nStartCol = 3;
    //            int nOutRow = nStartRow - 1; int nOutCol = nStartCol - 1;
    //            string sGroupCode = "";

    //            while (objDr.Read())
    //            {
    //                // 설비별 Coloumn Head 작성
    //                if (sGroupCode != objDr["group_cd"].ToString()){
    //                    //Group 초기값 설정
    //                    nOutRow = 3; ++nOutCol;
    //                    sGroupCode = objDr["group_cd"].ToString();
    //                    //서식 복사
    //                    objBaseRange = objBaseSheet.get_Range("C1", "C3");
    //                    objWorkRange = (Excel.Range)objWorkSheet.Cells[1, nOutCol];
    //                    objBaseRange.Copy(objWorkRange); //objWorkRange.Interior.Color = System.Drawing.Color.AliceBlue.ToArgb();
    //                    //값 넣기
                        
    //                    objWorkSheet.Cells[1, nOutCol] = objDr["cust_nm"].ToString();
    //                    objWorkSheet.Cells[2, nOutCol] = objDr["cust_dept"].ToString();
    //                    objWorkSheet.Cells[3, nOutCol] = objDr["cust_prod_nm"].ToString();
    //                }

    //                // Date Column & 모듈구분 컬럼 작성
    //                if (nOutCol == nStartCol)
    //                {
    //                    objBaseRange = objBaseSheet.get_Range("A4", (arg_prod_subtp == "TWIN") ? "B7" : "B10");
    //                    objWorkRange = (Excel.Range)objWorkSheet.Cells[nOutRow + 1, 1];
    //                    objBaseRange.Copy(objWorkRange);
    //                    objWorkSheet.Cells[nOutRow + 1, 1] = objDr["dt"].ToString();
    //                }

    //                // Data Row 작성
    //                objBaseRange = objBaseSheet.get_Range("C4", (arg_prod_subtp == "TWIN") ? "C7" : "C10");
    //                objWorkRange = (Excel.Range)objWorkSheet.Cells[nOutRow + 1, nOutCol];
    //                objBaseRange.Copy(objWorkRange);
    //                objWorkSheet.Cells[++nOutRow, nOutCol] = objDr["status1"].ToString();
    //                objWorkSheet.Cells[++nOutRow, nOutCol] = objDr["status2"].ToString();
    //                objWorkSheet.Cells[++nOutRow, nOutCol] = objDr["status3"].ToString();
    //                objWorkSheet.Cells[++nOutRow, nOutCol] = objDr["status4"].ToString();

    //                if (arg_prod_subtp != "TWIN")
    //                {
    //                    objWorkSheet.Cells[++nOutRow, nOutCol] = objDr["status5"].ToString();
    //                    objWorkSheet.Cells[++nOutRow, nOutCol] = objDr["status6"].ToString();
    //                    objWorkSheet.Cells[++nOutRow, nOutCol] = objDr["status7"].ToString();
    //                }

    //                // Sample Script
    //                //objWorkSheet.Cells[7, 2] = objDr["est_amt"];
    //                //objWorkSheet.Cells[2, 7] = Convert.ToDecimal(objDr["model_qty"]);
    //                //strRemark = objDr["rmk"].ToString().Replace("\r\n", "\n");
    //                //금액Cell = "￦ " + string.Format("{0:N0}", objDr["nego_amt"]);

    //                nDataRow++;
    //            }
    //            if (nDataRow == 0)
    //                throw new Exception("출력 대상 데이터를 찾을 수 없습니다.");

    //            objDr.Close();

    //            // Summary 작성
    //            objBaseRange = objBaseSheet.get_Range("G1", "G3");
    //            objWorkRange = (Excel.Range)objWorkSheet.Cells[1, nOutCol + 1];
    //            objBaseRange.Copy(objWorkRange);

    //            if (arg_prod_subtp == "TWIN")
    //            {
    //                for (int i = 0; i < (nOutRow - 3) / 4; i++)
    //                {
    //                    objBaseRange = objBaseSheet.get_Range("G4", "G7");
    //                    objWorkRange = (Excel.Range)objWorkSheet.Cells[i * 4 + 4, nOutCol + 1];
    //                    objBaseRange.Copy(objWorkRange);
    //                }
    //            }
    //            else
    //            {
    //                for (int i = 0; i < (nOutRow - 3) / 7; i++)
    //                {
    //                    objBaseRange = objBaseSheet.get_Range("G4", "G10");
    //                    objWorkRange = (Excel.Range)objWorkSheet.Cells[i * 7 + 4, nOutCol + 1];
    //                    objBaseRange.Copy(objWorkRange);
    //                }
    //            }

    //            #endregion

    //        }
    //        #region Exception02
    //        catch (SqlException ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(codeProcessed.ERR_SQL,
    //                        "데이터 조회에 실패하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(codeProcessed.ERR_PROCESS,
    //                        "출력물 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }
    //        #endregion
    //        #endregion


    //        #region save to File.

    //        objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
    //        try
    //        {
    //            if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);

    //            objWorkSheet.SaveAs( strTarget, enSource,
    //                            varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);

    //            strReturn = new JavaScriptSerializer().Serialize(
    //                            new entityProcessed<string>( codeProcessed.SUCCESS, strPrint)
    //                        );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>( codeProcessed.ERR_PROCESS,
    //                        "파일 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion
    //    }
    //    catch (Exception ex)
    //    {
    //        #region abnormal Closing.

    //        strReturn = ex.Message;

    //        #endregion
    //    }
    //    finally
    //    {
    //        #region release.

    //        // release.
    //        //
    //        if (objDr != null) objDr.Close();
    //        if (objCon != null) objCon.Close();
    //        if (objExcel != null)
    //        {
    //            objExcel.Workbooks.Close();
    //            objExcel.Quit();
    //            {
    //                System.Diagnostics.Process[] pProcess;
    //                pProcess = System.Diagnostics.Process.GetProcessesByName("Excel");
    //                pProcess[0].Kill();
    //            }
    //        }

    //        #endregion
    //    }

    //    return strReturn;
    //}

    //#endregion

    // 엑셀 함수 활용
    //Microsoft.Office.Interop.Excel.WorksheetFunction ExcelFunc;
    //double 누적밀도 = ExcelFunc.NormDist(val, mean, stdev, true);
    //double 누적밀도역함수 = ExcelFunc.NormSinv(누적밀도);

    // Excel Sheet Copy
    //copyWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[iSheet];
    //objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[iSheet];
    //copyWorkSheet.Copy(Type.Missing, objWorkSheet);
    //objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[iSheet];
    //objWorkSheet.Name = "내역-" + (iAry + 1);
    //copyWorkSheet.Visible = Excel.XlSheetVisibility.xlSheetVeryHidden;

    // Excel Range Copy
    // copyRange = objWorkSheet.get_Range("AA10", "AJ10");
    // objRange = objWorkSheet.get_Range("AA10", "AJ10");
    // copyRange.Copy(objRange);
    // objRange.RowHeight = 20;

    // Cell Merge
    //objRange = objWorkSheet.get_Range("A" + iRow.ToString(), cCol.ToString() + iRow.ToString());
    //objRange.MergeCells = true;
    //objRange.HorizontalAlignment = Excel.XlHAlign.xlHAlignLeft;

    // List 사용법
    //List<int[]> aryWidth = new List<int[]>();
    //aryWidth.Add(new int[] { 30, 5, 15, 15, 15, 15, 10, 20 });



}


