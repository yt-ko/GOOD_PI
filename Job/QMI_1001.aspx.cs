using System;
//using System.Collections;
//using System.Configuration;
using System.Data.SqlClient;
//using System.Web;
//using System.Web.Script.Serialization;
//using System.Web.Services;
//using Excel = Microsoft.Office.Interop.Excel;
//using Microsoft.Office.Core;
//using System.Runtime.InteropServices;

public partial class Job_QMI_1001 : System.Web.UI.Page
{

    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;

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
    //public static string Print(cRetrieveData DATA)
    //{
    //    string strReturn = string.Empty;

    //    Excel.Application objExcel = null;
    //    try
    //    {
    //        #region connect to DB.

    //        //  connect to DB.
    //        //
    //        try
    //        {
    //            objCon = new SqlConnection(
    //                                ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
    //            objCon.Open();
    //            objCmd = new SqlCommand("", objCon);
    //        }
    //        catch (SqlException ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_SQL,
    //                        "Database에 연결할 수 없습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_PROCESS,
    //                        "Database 연결 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion

    //        #region prepare Office object.

    //        string strPrint = DATA.getOption("PRINT");
    //        string strPage = DATA.getOption("PAGE");
    //        string strUser = DATA.getOption("USER");

    //        string sFileIdSrc = strPage;
    //        string sFileIdTrg = sFileIdSrc + "_" + strUser;
    //        string sFileNmTrg = sFileIdTrg + "." + strPrint;
    //        string strRoot = HttpContext.Current.Server.MapPath("~/");
    //        string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xls";
    //        string strTarget = strRoot + "Report/" + strPage + "/" + sFileIdTrg;
    //        object objMissing = Type.Missing;
    //        object varMissing = System.Reflection.Missing.Value;

    //        Excel._Workbook objWorkBook;
    //        Excel._Worksheet objWorkSheet, copyWorkSheet;
    //        Excel.Range objRange;
    //        Excel.XlFixedFormatType enTarget = Excel.XlFixedFormatType.xlTypePDF;
    //        Excel.XlFixedFormatQuality enQuality = Excel.XlFixedFormatQuality.xlQualityStandard;
    //        Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;

    //        try
    //        {
    //            objExcel = new Excel.Application();
    //            objExcel.DisplayAlerts = false;
    //            objExcel.Visible = false;
    //            objWorkBook = objExcel.Workbooks.Open(
    //                            @strSource,
    //                            false,
    //                            true,
    //                            varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing
    //                            , true, varMissing, varMissing);
    //            objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_PROCESS,
    //                        "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion

    //        #region process Query & set to Print.

    //        try
    //        {
    //            entityNameValue objArg = new entityNameValue(true);
    //            objArg.Add("arg_qmi_key", "");
    //            foreach (string strQmiKey in DATA.getOption("QMI_KEY").Split(','))
    //            {
    //                objArg.setValue("arg_qmi_key", strQmiKey);

    //                copyWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
    //                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[objWorkBook.Sheets.Count];
    //                copyWorkSheet.Copy(Type.Missing, objWorkSheet);
    //                objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[objWorkBook.Sheets.Count];

    //                #region 계측기

    //                objCmd.CommandText = getQuery("QMI_1002_1", objArg);
    //                objDr = objCmd.ExecuteReader();

    //                while (objDr.Read())
    //                {
    //                    string _sheetName = objDr["qmi_no"].ToString();
    //                    setSheetName(ref objWorkSheet, _sheetName);

    //                    // 계측기 마스터
    //                    objWorkSheet.Cells[1, 16] = objDr["qmi_no"].ToString();                                                                     // 관리번호
    //                    objWorkSheet.Cells[2, 16] = objDr["use_dept_nm"].ToString();                                                                // 사용부서
    //                    objWorkSheet.Cells[3, 4] = objDr["qmi_nm"].ToString();                                                                      // 장비명
    //                    objWorkSheet.Cells[4, 4] = objDr["spec"].ToString() + " / " + objDr["usage"].ToString();                                    // 규격/용도
    //                    objWorkSheet.Cells[5, 4] = objDr["accuracy"].ToString();                                                                    // Accuracy
    //                    objWorkSheet.Cells[5, 10] = objDr["maker_nm"].ToString();                                                                   // 제조회사
    //                    objWorkSheet.Cells[5, 16] = objDr["model_no"].ToString();                                                                   // Model No.
    //                    objWorkSheet.Cells[6, 4] = objDr["ser_no"].ToString();                                                                      // Ser.No.
    //                    objWorkSheet.Cells[6, 10] = objDr["pur_date"].ToString();                                                                   // 구입일자
    //                    objWorkSheet.Cells[6, 16] = objDr["pur_price"].ToString();                                                                  // 구입가격
    //                    objWorkSheet.Cells[7, 4] = objDr["max_margin"].ToString();                                                                  // 허용오차
    //                    objWorkSheet.Cells[7, 10] = (objDr["calibrate_yn"].ToString() == "1" ? objDr["calibrate_term"].ToString() + "개월" : "-");  // 교정주기
    //                    objWorkSheet.Cells[7, 16] = objDr["vendor"].ToString();                                                                     // 구입처

    //                }
    //                objDr.Close();

    //                #endregion

    //                #region 사진,구조 및 사용설명

    //                objCmd.CommandText = getQuery("QMI_1002_2", objArg);
    //                objDr = objCmd.ExecuteReader();

    //                while (objDr.Read())
    //                {
    //                    int _row = 9;

    //                    // 사진
    //                    if (objDr["img_src"].ToString() != "")
    //                    {
    //                        string imgPath = System.IO.Path.Combine(strRoot, "Files\\QMI\\" + objDr["img_src"]);
    //                        if (System.IO.File.Exists(imgPath))
    //                        {

    //                            objWorkSheet.Shapes.AddPicture(@imgPath,
    //                                Microsoft.Office.Core.MsoTriState.msoFalse,
    //                                Microsoft.Office.Core.MsoTriState.msoCTrue,
    //                                10, 180, 400, 260);

    //                            //objWorkSheet.Shapes.AddPicture(@imgPath, MsoTriState.msoFalse, MsoTriState.msoCTrue, 10, 180, 400, 260);

    //                            //Excel.Pictures p = objWorkSheet.Pictures(System.Type.Missing) as Excel.Pictures;
    //                            //Excel.Picture pic = null;

    //                            //pic = p.Insert(@imgPath, System.Type.Missing);

    //                            //pic.ShapeRange.LockAspectRatio = Microsoft.Office.Core.MsoTriState.msoCTrue;
    //                            //pic.ShapeRange.Width = 170;
    //                            //pic.ShapeRange.Height = 170;

    //                            _row = 24;
    //                        }
    //                    }

    //                    objWorkSheet.Cells[_row, 1] = objDr["memo_text2"].ToString();    // 사용설명
                        
    //                }
    //                objDr.Close();

    //                #endregion

    //                #region 부속품

    //                objCmd.CommandText = getQuery("QMI_1002_3", objArg);
    //                objDr = objCmd.ExecuteReader();

    //                int iRow = 9;
    //                int iCnt = 0;
    //                while (objDr.Read())
    //                {
    //                    objWorkSheet.Cells[iRow, 14] = objDr["part_nm"].ToString();     // 부속품명
    //                    objWorkSheet.Cells[iRow++, 17] = objDr["part_qty"].ToString();  // 수량
    //                    if (iCnt++ > 18) break;
    //                }
    //                objDr.Close();

    //                #endregion

    //                #region 이력사항

    //                objCmd.CommandText = getQuery("QMI_1001_2", objArg);
    //                objDr = objCmd.ExecuteReader();

    //                iRow = 29;
    //                iCnt = 0;
    //                while (objDr.Read())
    //                {
    //                    objWorkSheet.Cells[iRow, 2] = objDr["chg_date"].ToString();         // 일자
    //                    objWorkSheet.Cells[iRow, 4] = "[" + objDr["chg_tp_nm"].ToString() + "]" + objDr["chg_rmk"].ToString();  // 내용
    //                    objWorkSheet.Cells[iRow, 12] = objDr["vendor_nm"].ToString();       // 업체
    //                    objWorkSheet.Cells[iRow, 15] = objDr["valid_date"].ToString();        // 유효기간
    //                    objWorkSheet.Cells[iRow++, 17] = objDr["chk_emp_nm"].ToString();    // 확인
    //                    if (iCnt++ > 10) break;
    //                }
    //                objDr.Close();

    //                #endregion

    //            }

    //            #region Delete Template

    //            objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
    //            objWorkSheet.Visible = Excel.XlSheetVisibility.xlSheetVeryHidden;

    //            #endregion

    //        }
    //        catch (SqlException ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_SQL,
    //                        "Data 조회에 실패하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_PROCESS,
    //                        "Data 조회 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion

    //        #region save to File.

    //        try
    //        {
    //            //if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
    //            //objWorkSheet.SaveAs(strTarget, enSource, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
    //            //if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
    //            //if (System.IO.File.Exists(strTarget + "." + strPrint)) System.IO.File.Delete(strTarget + "." + strPrint);
    //            //objWorkSheet.ExportAsFixedFormat(enTarget, strTarget, enQuality, true, true, 1, 5, false, varMissing);

    //            if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
    //            objWorkBook.SaveAs(strTarget, enSource, varMissing, varMissing, varMissing, varMissing, Excel.XlSaveAsAccessMode.xlNoChange, varMissing, varMissing, varMissing, varMissing, varMissing);
    //            //if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
    //            //if (System.IO.File.Exists(strTarget + "." + strPrint)) System.IO.File.Delete(strTarget + "." + strPrint);
    //            //objWorkBook.ExportAsFixedFormat(enTarget, strTarget, enQuality, true, true, varMissing, varMissing, false, varMissing);

    //            strReturn = new JavaScriptSerializer().Serialize(
    //                            new entityProcessed<string>(codeProcessed.SUCCESS, sFileNmTrg)
    //                        );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_PROCESS,
    //                        "Print 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion
    //    }
    //    catch (Exception ex)
    //    {
    //        #region abnormal Closing.

    //        // abnormal Closing.
    //        //
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
    //            if (objExcel != null)
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

    //protected static string getQuery(string strQueryID, entityNameValue objArgs)
    //{
    //    #region get Query from DB.

    //    string strSQL = string.Empty;
    //    string strBody = string.Empty;
    //    string strZQuery = "SELECT qry_sel AS QUERY_SELECT FROM ZQUERY WHERE qry_id = '{0}'";

    //    try
    //    {
    //        strSQL = string.Format(@strZQuery, strQueryID);
    //        objCmd.CommandText = strSQL;
    //        objDr = objCmd.ExecuteReader();

    //        if (objDr.Read())
    //        {
    //            strBody = objDr["QUERY_SELECT"].ToString();
    //            objDr.Close();
    //        }
    //        else
    //        {
    //            throw new Exception(
    //                "관련 Query를 찾을 수 없습니다.");
    //        }
    //    }
    //    catch (SqlException ex)
    //    {
    //        throw new Exception(
    //            new JavaScriptSerializer().Serialize(
    //                new entityProcessed<string>(
    //                    codeProcessed.ERR_SQL,
    //                    "Query 조회에 실패하였습니다.\n- " + ex.Message)
    //                )
    //            );
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception(
    //            new JavaScriptSerializer().Serialize(
    //                new entityProcessed<string>(
    //                    codeProcessed.ERR_PROCESS,
    //                    "Query 조회에 실패하였습니다.\n- " + ex.Message)
    //                )
    //            );
    //    }

    //    #endregion

    //    #region bind Argument to Query.

    //    bindArg(strQueryID, ref strBody, objArgs);

    //    #endregion

    //    return strBody;

    //}

    //protected static void bindArg(string strQueryID, ref string strBody, entityNameValue objArgs)
    //{

    //    #region create Query.

    //    string strSQL = string.Empty;
    //    string strZArg = "SELECT arg_id AS ARG_ID, arg_tp AS ARG_TYPE, arg_qry AS ARG_QUERY FROM ZQUERY_ARG WHERE qry_id = '{0}'";

    //    if (objArgs.getSize() > 0)
    //    {
    //        #region get Argument from DB.

    //        Hashtable tblSelect = new Hashtable();
    //        try
    //        {
    //            strSQL = string.Format(@strZArg, strQueryID);
    //            objCmd.CommandText = strSQL;
    //            objDr = objCmd.ExecuteReader();

    //            while (objDr.Read())
    //            {
    //                tblSelect.Add(
    //                    objDr["ARG_ID"].ToString(),
    //                    new cDBArgument(
    //                        objDr["ARG_TYPE"].ToString(),
    //                        objDr["ARG_QUERY"].ToString())
    //                    );
    //            }
    //            objDr.Close();
    //        }
    //        catch (SqlException ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_SQL,
    //                        "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_PROCESS,
    //                        "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion

    //        #region bind Argument to Query.

    //        try
    //        {
    //            for (int iAry = 0; iAry < objArgs.getSize(); iAry++)
    //            {
    //                string strArg = objArgs.NAME[iAry];
    //                cDBArgument objArg = (cDBArgument)tblSelect[strArg];
    //                if (objArg == null)
    //                {
    //                    throw new Exception(
    //                        strArg + " - 관련 Argument를 찾을 수 없습니다.");
    //                }
    //                strBody = objArg.convertWhere(
    //                                    strBody,
    //                                    strQueryID,
    //                                    strArg,
    //                                    HttpUtility.UrlDecode(objArgs.getValue(strArg))
    //                                );
    //            }
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                            codeProcessed.ERR_PROCESS,
    //                            "Query 생성에 실패하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion
    //    }

    //    #endregion

    //}

    //protected static void setSheetName(ref Excel._Worksheet _objSheet, string _name)
    //{
    //    int iName = 0;
    //    string strNewName = _name;

    //    while (true)
    //    {
    //        try
    //        {
    //            _objSheet.Name = strNewName;
    //            break;
    //        }
    //        catch (Exception e)
    //        {
    //            strNewName = string.Format("{0} ({1})", _name, ++iName);
    //        }
    //    }
    //}

    //#endregion

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

