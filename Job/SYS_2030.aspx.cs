using System;
//using System.Web;
//using System.Web.Services;
//using System.Web.Script.Serialization;
//using System.Data.SqlClient;
//using System.Configuration;
//using Excel = Microsoft.Office.Interop.Excel;
public partial class JOB_SYS_2030 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    //[WebMethod]
    //public static string Print(cExcelData DATA)
    //{
    //    string sReturn = string.Empty;


    //    #region prepare Office object.

    //    string strPage = DATA.getOption("PAGE");
    //    string strRoot = HttpContext.Current.Server.MapPath("~/") + "Report/" + strPage + "/";
    //    string strSource = "TableLayoutTemplate.xls";
    //    string strTarget = Guid.NewGuid().ToString() + ".xls";

    //    Excel._Workbook objWorkBook;
    //    Excel._Worksheet objWorkSheet, copyWorkSheet;
    //    Excel.Application objExcel = null;
    //    Excel.XlFileFormat enSource = Excel.XlFileFormat.xlExcel8;
    //    object varMissing = System.Reflection.Missing.Value;

    //    try
    //    {
    //        System.IO.File.Copy(System.IO.Path.Combine(strRoot, strSource), System.IO.Path.Combine(strRoot, strTarget));
    //        objExcel = new Excel.Application();
    //        objExcel.DisplayAlerts = false;
    //        objExcel.Visible = false;
    //        objExcel.DisplayAlerts = false;
    //        objWorkBook = objExcel.Workbooks.Open(
    //                        System.IO.Path.Combine(strRoot, strTarget),
    //                        false,
    //                        false,
    //                        varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing
    //                        , varMissing, varMissing, varMissing);
    //        objWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[1];
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception(
    //            new JavaScriptSerializer().Serialize(
    //                new entityProcessed<string>(
    //                    codeProcessed.ERR_PROCESS,
    //                    "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
    //                )
    //            );
    //    }

    //    #endregion

    //    SqlDataReader drTable;
    //    SqlDataReader drColumn;

    //    // Get Table List
    //    using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
    //    using (SqlCommand objCmd = new SqlCommand("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_NAME LIKE 'KPI%' ORDER BY 1, 2, 3", objCon))
    //    {
    //        try
    //        {
    //            objCon.Open();
    //            drTable = objCmd.ExecuteReader();

    //            // Get Column List By Table Name
    //            while (drTable.Read())
    //            {
    //                string sCatalog = drTable["table_catalog"].ToString();
    //                string sSchema = drTable["table_schema"].ToString();
    //                string sTableName = drTable["table_name"].ToString();
    //                string sQuery = string.Format("SELECT A.*, dbo.fn_getColInfo(A.TABLE_CATALOG, A.TABLE_SCHEMA, A.TABLE_NAME, A.COLUMN_NAME, 'KEY') AS key_yn"
    //                                            + ", dbo.fn_getColInfo(A.TABLE_CATALOG, A.TABLE_SCHEMA, A.TABLE_NAME, A.COLUMN_NAME, 'COMMENT') AS comment"
    //                                            + ", dbo.fn_getColInfo(A.TABLE_CATALOG, A.TABLE_SCHEMA, A.TABLE_NAME, A.COLUMN_NAME, 'SIZE') AS size"
    //                                            + " FROM INFORMATION_SCHEMA.COLUMNS A WHERE A.TABLE_CATALOG = '{0}' AND A.TABLE_SCHEMA = '{1}' AND A.TABLE_NAME = '{2}' ORDER BY A.ORDINAL_POSITION"
    //                                            , sCatalog
    //                                            , sSchema
    //                                            , sTableName);

    //                using (SqlConnection objCon2 = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
    //                using (SqlCommand objCmd2 = new SqlCommand(sQuery, objCon2))
    //                {
    //                    try
    //                    {

    //                        // New Worksheet
    //                        copyWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[objWorkBook.Sheets.Count];
    //                        objWorkSheet.Copy(Type.Missing, copyWorkSheet);
    //                        copyWorkSheet = (Excel.Worksheet)objWorkBook.Sheets[objWorkBook.Sheets.Count];
    //                        //copyWorkSheet.Name = string.Format("{0}_{1}_{2}", sCatalog, sSchema, sTableName);
    //                        copyWorkSheet.Name = sTableName;

    //                        objCon2.Open();
    //                        bool bFirst = true;
    //                        int iRow = 5, iCnt = 0;
    //                        //Excel.Range objRow = objWorkSheet.get_Range("A" + iRow.ToString(), "G" + iRow.ToString());  // Column Row Template
    //                        drColumn = objCmd2.ExecuteReader();
    //                        while (drColumn.Read())
    //                        {
    //                            if (bFirst)
    //                            {
    //                                bFirst = false;

    //                                // Set Table Info.
    //                                copyWorkSheet.Cells[1, "C"] = sTableName;

    //                            }
    //                            else
    //                            {
    //                                iRow++;
    //                                Excel.Range objRow = copyWorkSheet.get_Range("A" + iRow.ToString(), "G" + iRow.ToString());
    //                                objRow.EntireRow.Insert(Excel.XlInsertShiftDirection.xlShiftDown, Type.Missing);
    //                                cExcel.drawLine(objRow, 1);
    //                            }

    //                            // Set Column Info.
    //                            copyWorkSheet.Cells[iRow, "A"] = drColumn["ordinal_position"].ToString();
    //                            copyWorkSheet.Cells[iRow, "B"] = drColumn["column_name"].ToString();
    //                            copyWorkSheet.Cells[iRow, "C"] = drColumn["comment"].ToString();
    //                            copyWorkSheet.Cells[iRow, "D"] = drColumn["data_type"].ToString() + drColumn["size"].ToString();
    //                            copyWorkSheet.Cells[iRow, "E"] = (drColumn["is_nullable"].ToString() == "NO" ? "N" : "");
    //                            copyWorkSheet.Cells[iRow, "F"] = (drColumn["key_yn"].ToString() == "Y" ? "Y" : "");
    //                        }
    //                        objCon2.Close();
    //                        cExcel.drawLine(copyWorkSheet.get_Range("A5", "G" + iRow.ToString()), 1);
    //                    }
    //                    catch (SqlException ex)
    //                    {
    //                        throw new Exception(
    //                            new JavaScriptSerializer().Serialize(
    //                                new entityProcessed<string>(
    //                                    codeProcessed.ERR_SQL,
    //                                    "Query 조회에 실패하였습니다.\n- " + ex.Message)
    //                                )
    //                            );
    //                    }
    //                    catch (Exception ex)
    //                    {
    //                        throw new Exception(
    //                            new JavaScriptSerializer().Serialize(
    //                                new entityProcessed<string>(
    //                                    codeProcessed.ERR_PROCESS,
    //                                    "Query 조회에 실패하였습니다.\n- " + ex.Message)
    //                                )
    //                            );
    //                    }
    //                }

    //            }
    //            objCon.Close();
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
    //    }

    //    objWorkSheet.Delete();
    //    //objCopySheet.SaveAs(strRoot + strTarget, enSource, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing, varMissing);
    //    objWorkBook.Save();
    //    objExcel.Workbooks.Close();
    //    objExcel.Quit();

    //    sReturn = new JavaScriptSerializer().Serialize(
    //                        new entityProcessed<string>(codeProcessed.SUCCESS, strTarget)
    //                    );

    //    return sReturn;
    //}

}
