using System;
//using System.Collections.Generic;
//using System.Web;
//using System.Web.UI;
//using System.Web.UI.WebControls;
//using System.Web.Services;
//using System.Web.Script.Services;
//using System.Web.Script.Serialization;
//using System.Data;
//using System.Data.SqlClient;
//using System.Web.Configuration;
//using System.Text;
//using System.Collections;
//using System.Collections.Specialized;
//using System.Configuration;
//using Microsoft.Office.Core;
//using Excel = Microsoft.Office.Interop.Excel;
//using System.Reflection;

public partial class Job_SRM_4940 : System.Web.UI.Page
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
    //public static string Print(cRetrieveData DATA)
    //{
    //    #region check Argument.

    //    // check Argument.
    //    //
    //    if (string.IsNullOrEmpty(DATA.getQuery()))
    //    {
    //        return new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                            codeProcessed.ERR_PARAM,
    //                            "잘못된 호출입니다.")
    //                );
    //    }

    //    #endregion

    //    string strReturn = string.Empty;

    //    SqlConnection objCon = null;
    //    SqlCommand objCmd = null;
    //    SqlDataReader objDr = null;
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

    //        #region get Query from DB.

    //        string strSQL = string.Empty;
    //        string strBody = string.Empty;

    //        try
    //        {
    //            strSQL = string.Format(@"
    //                        SELECT qry_sel AS QUERY_SELECT
    //                        FROM ZQUERY
    //                        WHERE qry_id = '{0}'",
    //                        DATA.getQuery());
    //            objCmd = new SqlCommand(strSQL, objCon);
    //            objDr = objCmd.ExecuteReader();

    //            if (objDr.Read())
    //            {
    //                strBody = objDr["QUERY_SELECT"].ToString();
    //                objDr.Close();
    //            }
    //            else
    //            {
    //                throw new Exception(
    //                    "관련 Query를 찾을 수 없습니다.");
    //            }
    //        }
    //        catch (SqlException ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_SQL,
    //                        "Query 조회에 실패하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new Exception(
    //                new JavaScriptSerializer().Serialize(
    //                    new entityProcessed<string>(
    //                        codeProcessed.ERR_PROCESS,
    //                        "Query 조회에 실패하였습니다.\n- " + ex.Message)
    //                    )
    //                );
    //        }

    //        #endregion

    //        #region create Query.

    //        if (DATA.getArgument().getSize() > 0)
    //        {
    //            #region get Argument from DB.

    //            Hashtable tblSelect = new Hashtable();
    //            try
    //            {
    //                strSQL = string.Format(@"
    //                            SELECT
    //                                arg_id AS ARG_ID,
    //                                arg_tp AS ARG_TYPE,
    //                                arg_qry AS ARG_QUERY
    //                            FROM ZQUERY_ARG
    //                            WHERE qry_id = '{0}'",
    //                            DATA.getQuery()
    //                            );
    //                objCmd.CommandText = strSQL;
    //                objDr = objCmd.ExecuteReader();

    //                while (objDr.Read())
    //                {
    //                    tblSelect.Add(
    //                        objDr["ARG_ID"].ToString(),
    //                        new cDBArgument(
    //                            objDr["ARG_TYPE"].ToString(),
    //                            objDr["ARG_QUERY"].ToString())
    //                        );
    //                }
    //                objDr.Close();
    //            }
    //            catch (SqlException ex)
    //            {
    //                throw new Exception(
    //                    new JavaScriptSerializer().Serialize(
    //                        new entityProcessed<string>(
    //                            codeProcessed.ERR_SQL,
    //                            "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
    //                        )
    //                    );
    //            }
    //            catch (Exception ex)
    //            {
    //                throw new Exception(
    //                    new JavaScriptSerializer().Serialize(
    //                        new entityProcessed<string>(
    //                            codeProcessed.ERR_PROCESS,
    //                            "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
    //                        )
    //                    );
    //            }

    //            #endregion

    //            #region bind Argument to Query.

    //            try
    //            {
    //                for (int iAry = 0; iAry < DATA.getArgument().getSize(); iAry++)
    //                {
    //                    string strArg = DATA.ARGUMENT.NAME[iAry];
    //                    cDBArgument objArg = (cDBArgument)tblSelect[strArg];
    //                    if (objArg == null)
    //                    {
    //                        throw new Exception(
    //                            strArg + " - 관련 Argument를 찾을 수 없습니다.");
    //                    }
    //                    strBody = objArg.convertWhere(
    //                                        strBody,
    //                                        DATA.getQuery(),
    //                                        strArg,
    //                                        HttpUtility.UrlDecode(DATA.ARGUMENT.VALUE[iAry])
    //                                    );
    //                }
    //            }
    //            catch (Exception ex)
    //            {
    //                throw new Exception(
    //                    new JavaScriptSerializer().Serialize(
    //                        new entityProcessed<string>(
    //                                codeProcessed.ERR_PROCESS,
    //                                "Query 생성에 실패하였습니다.\n- " + ex.Message)
    //                        )
    //                    );
    //            }

    //            #endregion
    //        }

    //        #endregion

    //        #region prepare Office object.

    //        string strPrint = DATA.getOption("PRINT");
    //        string strPage = DATA.getOption("PAGE");
    //        string strUser = DATA.getOption("USER");
    //        string strTitle = DATA.getOption("TITLE");
    //        string strRows = DATA.getOption("BARCODE");

    //        string sFileIdSrc = "ItemLabelA";
    //        string sFileIdTrg = sFileIdSrc + "_" + strUser;
    //        string sFileNmTrg = sFileIdTrg + "." + strPrint;
    //        string strRoot = HttpContext.Current.Server.MapPath("~/");
    //        string strSource = strRoot + "Report/" + strPage + "/" + sFileIdSrc + ".xls";
    //        string strTarget = strRoot + "Report/" + strPage + "/" + sFileIdTrg;
    //        object objMissing = Type.Missing;
    //        object varMissing = System.Reflection.Missing.Value;

    //        Excel._Workbook objWorkBook;
    //        Excel._Worksheet objWorkSheet, objWorkSheet2;
    //        Excel.Range objRange;
    //        Excel.XlFixedFormatType enTarget = Excel.XlFixedFormatType.xlTypePDF;
    //        Excel.XlFixedFormatQuality enQuality = Excel.XlFixedFormatQuality.xlQualityStandard;
    //        Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;

    //        try
    //        {
    //            objExcel = new Excel.Application();
    //            objExcel.DisplayAlerts = false;
    //            objExcel.Visible = false;
    //            objExcel.DisplayAlerts = false;
    //            objExcel.Visible = false;
    //            objWorkBook = objExcel.Workbooks.Open(
    //                            strSource,
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
    //            objCmd.CommandText = strBody;
    //            objDr = objCmd.ExecuteReader();

    //            if (strTitle == "물품라벨")
    //            {
    //                int iRow = 1;
    //                int iCell = 3;
    //                int iCount = 0;
    //                objWorkSheet2 = (Excel.Worksheet)objWorkBook.Sheets[2];     //Barcode Template Sheet
    //                objWorkSheet.VPageBreaks.Add(objWorkSheet.get_Range("J1", "J1"));

    //                while (objDr.Read())
    //                {
    //                    if (iCount % 3 == 0)
    //                    {
    //                        objWorkSheet2.get_Range("A2", "A8").EntireRow.Copy(objWorkSheet.get_Range(objWorkSheet.Cells[iRow, 1], objWorkSheet.Cells[iRow + 6, 1]).EntireRow);
    //                        iCell = 3;
    //                    }

    //                    objWorkSheet.Cells[iRow, iCell] = objDr["item_cd"].ToString();                      //품번
    //                    objWorkSheet.Cells[iRow + 1, iCell] = objDr["item_nm"].ToString();                  //품목명
    //                    objWorkSheet.Cells[iRow + 2, iCell] = objDr["item_spec"].ToString();                //규격
    //                    objWorkSheet.Cells[iRow + 3, iCell] = objDr["track_no"].ToString();                 //Tracking
    //                    objWorkSheet.Cells[iRow + 4, iCell] = objDr["qty"].ToString();                      //수량
    //                    objWorkSheet.Cells[iRow + 5, iCell - 1] = "*" + objDr["barcode"].ToString() + "*";  //바코드
    //                    objWorkSheet.Cells[iRow + 6, iCell - 1] = objDr["barcode"].ToString();              //바코드번호;

    //                    iCell += 3;
    //                    iCount++;

    //                    if (iCount % 3 == 0)
    //                    {
    //                        if (iCount % 24 == 0)
    //                        {
    //                            iRow += 7;
    //                            objRange = objWorkSheet.get_Range(objWorkSheet.Cells[iRow, 1], objWorkSheet.Cells[iRow, 1]);
    //                            objWorkSheet.HPageBreaks.Add(objRange);
    //                        }
    //                        else
    //                        {
    //                            iRow += 8;
    //                        }
    //                    }
    //                }

    //            }
    //            objDr.Close();
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
    //            if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
    //            objWorkSheet.SaveAs(strTarget, enSource, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
    //            if (System.IO.File.Exists(strTarget)) System.IO.File.Delete(strTarget);
    //            if (System.IO.File.Exists(strTarget + "." + strPrint)) System.IO.File.Delete(strTarget + "." + strPrint);
    //            objWorkSheet.ExportAsFixedFormat(enTarget, strTarget, enQuality, true, true, 1, 5, false, varMissing);

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

    //#endregion

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

