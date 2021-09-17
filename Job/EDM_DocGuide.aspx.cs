using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Web.Services;
// For Excel Print
using System.IO;
using System.Web;
using System.Collections;
using System.Configuration;
using DevExpress.Spreadsheet;
using DevExpress.XtraSpreadsheet;
using DevExpress.Web.ASPxSpreadsheet;
// ???
//using System.Web.UI;
//using System.Web.UI.WebControls;
//using System.Text;
//using System.Collections.Specialized;

public partial class Job_EDM_DocGuide : System.Web.UI.Page
{
    protected static SqlConnection objCon = null;
    protected static SqlCommand objCmd = null;
    protected static SqlDataReader objDr = null;
    protected static string mUserId = string.Empty;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["AUTH"] == null)
        {
            string url = "~/Master/IntroProcess.aspx?REDIRECT=" + System.Web.HttpUtility.UrlEncode(Request.Url.PathAndQuery);
            Response.Redirect(url);
        }

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
            // 신규 추가의 경우 : Key No. 생성
            if (DATA.getFirst().getQuery() == "EDM_DocGuide_M" && DATA.getFirst().getFirst().getType() == typeQuery.INSERT)
            {
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize();
                try
                {
                    string strSQL = "SP_KEYGEN_PLM";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@KeyType", "EDM_DocGuide");
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
                DATA.setValues("doc_no", strKey);
                for (int iAry = 0; iAry < DATA.getSize(); iAry++)
                {
                    switch (DATA.getObject(iAry).getQuery())
                    {
                        case "EDM_DocGuide_M":
                            DATA.getObject(iAry).setValues("doc_no", strKey);
                            break;
                        default:
                            DATA.getObject(iAry).setValues("doc_no", strKey);
                            break;
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

    [WebMethod]
    public static string Print(cRetrieveData DATA)
    {

        string strReturn = string.Empty;
        try
        {
            #region connect to DB.
            try
            {
                objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
                objCon.Open();
                objCmd = new SqlCommand("", objCon);
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
            #endregion

            // Set Source File Format
            string sSrcExt = ".xls";
            DocumentFormat nSrcFormat = DevExpress.Spreadsheet.DocumentFormat.Xls;

            //Get Parameter : Data
            string sArgQry = DATA.getOption("qry");
            string sArgYmdFr = DATA.getOption("ymd_fr");
            string sArgYmdTo = DATA.getOption("ymd_to");
            string sArgBizDept = DATA.getOption("biz_dept");

            //Get Parameter : Directory & File
            string sRootDir = HttpContext.Current.Server.MapPath("~/");
            
            string sRptDir = DATA.getOption("dir");    //Report Folder
            string sRptId = DATA.getOption("rpt"); //Report ID = File Name
            string sTrgExt = "." + DATA.getOption("ext").ToLower();  //pdf, xls
            string sOption = DATA.getOption("opt");

            string sSubDir = DateTime.Now.ToString("yyyy");
            string sFileNm = sRptId + "_" + DateTime.Now.ToString("ddHHmmss");
            string strRoot = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Report"), sRptDir);

            string sFileSrc = System.IO.Path.Combine(strRoot, sRptId + sSrcExt);
            string sFileTrg = System.IO.Path.Combine(strRoot, sSubDir);
            if (!System.IO.Directory.Exists(sFileTrg))
                System.IO.Directory.CreateDirectory(sFileTrg);
            sFileTrg = System.IO.Path.Combine(sFileTrg, sFileNm);

            #region prepare Office object.
            DevExpress.Web.ASPxSpreadsheet.ASPxSpreadsheet aaa = new ASPxSpreadsheet();
            DevExpress.Spreadsheet.IWorkbook objWorkBook = aaa.Document;
            DevExpress.Spreadsheet.Worksheet objWorkSheet;
            try
            {
                System.IO.File.Copy(sFileSrc, sFileTrg + sSrcExt, true);
                objWorkBook.LoadDocument(sFileTrg + sSrcExt, nSrcFormat);   //, DevExpress.Spreadsheet.DocumentFormat.Xlsx
                objWorkSheet = objWorkBook.Worksheets[0];
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                            "Office 설정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        )
                    );
            }
            #endregion

            #region process Query & set to Print.

            try
            {
                entityNameValue objArg = new entityNameValue(true);

                //Set Header
                //objWorkSheet.Cells["A1"].Value = "Test OK";
                //objWorkSheet.Cells[2, 2].Value = "Cell22";

                #region Set Data Row

                // get DB Data Rows
                objArg.Add("arg_ymd_fr", sArgYmdFr);
                objArg.Add("arg_ymd_to", sArgYmdTo);
                objArg.Add("arg_biz_dept", sArgBizDept);
                objCmd.CommandText = getQuery(sArgQry, objArg);
                objDr = objCmd.ExecuteReader();
                // Loop DataRows
                int iStart = 3, iRow = iStart;
                while (objDr.Read())
                {
                    objWorkSheet.Rows[iRow].Select();
                    objWorkSheet.Rows[iRow+1].CopyFrom(objWorkSheet.Selection, PasteSpecial.All);
                    // Set Excel values
                    //--관리번호,고객사,Site,설비군,중요도,ImageA,Issue, ImageB,IPS 기준,분류,REVISION,	Key Word,비고,설계,제조,품질,C/S
                    for (int j = 0; j < objDr.FieldCount; j++)
                    {
                        objWorkSheet.Cells[iRow, j+2].SetValue("'" + objDr[j]);
                    }
                    iRow++;
                    //objWorkSheet.Rows[iRow].Insert();
                }
                objDr.Close();

                DevExpress.Spreadsheet.Range myRange;
                string sPicCell = "", sFile = "", sPicNm = "gpic_";

                // 기존 이미지 삭제
                foreach (Picture item in objWorkSheet.Pictures)
                {
                    if (item.Name.IndexOf(sPicNm) == 0) { item.Delete(); break; }
                }

                // 이미지 파일 삽입 처리
                for (int i = iStart; i < objWorkSheet.Rows.LastUsedIndex; i++)
                {
                    // 변경전 대표 이미지
                    sPicCell = "H" + (i + 1).ToString();
                    if (!checkEmpty(objWorkSheet.Cells[sPicCell].Value)) 
                    {
                        sFile = HttpContext.Current.Server.MapPath(objWorkSheet.Cells[sPicCell].Value.ToString());
                        if (File.Exists(sFile))
                        {
                            objWorkSheet.Cells[sPicCell].SetValue("");
                            myRange = (DevExpress.Spreadsheet.Range)objWorkSheet.Range[sPicCell];
                            Picture myPicture = objWorkSheet.Pictures.AddPicture(sFile, myRange, true);
                            myPicture.Name = sPicNm + "A";
                            //myPicture.Width = (float)objWorkSheet.Range[sPicCell].ColumnWidth;
                            //myPicture.Height = (float)objWorkSheet.Range[sPicCell].RowHeight;
                        }
                    }
                    // 변경후 대표 이미지
                    sPicCell = "J" + (i + 1).ToString();
                    if (!checkEmpty(objWorkSheet.Cells[sPicCell].Value))
                    {
                        sFile = HttpContext.Current.Server.MapPath(objWorkSheet.Cells[sPicCell].Value.ToString());
                        if (File.Exists(sFile))
                        {
                            objWorkSheet.Cells[sPicCell].SetValue("");
                            myRange = (DevExpress.Spreadsheet.Range)objWorkSheet.Range[sPicCell];
                            Picture myPicture = objWorkSheet.Pictures.AddPicture(sFile, myRange, true);
                            myPicture.Name = sPicNm + "A";
                            //myPicture.Width = (float)objWorkSheet.Range[sPicCell].ColumnWidth;
                            //myPicture.Height = (float)objWorkSheet.Range[sPicCell].RowHeight;
                        }
                    }

                }

                #endregion

                //Set Footer

                #region Sample Excel API
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
                #endregion

            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_SQL,
                            "Data 조회에 실패하였습니다.\n- " + ex.Message)
                    ));
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                            "Data 조회 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    ));
            }
            #endregion

            #region save to File.

            try
            {
                objWorkBook.SaveDocument(sFileTrg + sSrcExt, nSrcFormat);    //, DevExpress.Spreadsheet.DocumentFormat.Xls
                
                if (sTrgExt == ".pdf")
                {
                    //string r = objWorkSheet.GetUsedRange().GetReferenceA1();
                    //objWorkSheet.DefinedNames.Add("_xlnm.Print_Area", "Sheet1!" + r);
                    //objWorkSheet.PrintOptions.FitToPage = true;
                    //objWorkSheet.PrintOptions.FitToWidth = 1;
                    //objWorkSheet.PrintOptions.FitToHeight = 0;
                    using (System.IO.FileStream outFile = new System.IO.FileStream(sFileTrg + sTrgExt, System.IO.FileMode.Create))
                    {
                        objWorkBook.ExportToPdf(outFile);
                    }
                }
                else sTrgExt = sSrcExt;

                strReturn = new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(codeProcessed.SUCCESS, sSubDir + "/" + sFileNm + sTrgExt)
                            );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                            "File 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    ));
            }
            finally
            {
                if (objWorkBook != null) objWorkBook.Dispose();
                if (aaa != null) aaa.Dispose();
            }

            #endregion
        }
        catch (Exception ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                        "출력처리 중에 중에 오류가 발생하였습니다.\n- " + ex.Message)
                ));
        }
        finally
        {
            if (objDr != null) objDr.Close();
            if (objCon != null) objCon.Close();
        }

        return strReturn;
    }

    protected static string getQuery(string strQueryID, entityNameValue objArgs)
    {
        string strZQuery = "SELECT qry_sel AS QUERY_SELECT FROM ZQUERY WHERE qry_id = '{0}'";
        string strSQL = string.Format(@strZQuery, strQueryID);
        string strBody = string.Empty;

        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
        using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
        {
            objCon.Open();
            try
            {
                using (SqlDataReader dr = objCmd.ExecuteReader())
                {
                    if (dr.Read()) strBody = dr["QUERY_SELECT"].ToString();
                    else throw new Exception("관련 Query를 찾을 수 없습니다.");
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_SQL,
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
                    ));
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                            "Query 조회에 실패하였습니다.\n- " + ex.Message)
                    ));
            }
            objCon.Close();
        }

        // bind Argument to Query.
        bindArg(strQueryID, ref strBody, objArgs);

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
                            tblSelect.Add( dr["ARG_ID"].ToString(),
                                new cDBArgument( dr["ARG_TYPE"].ToString(), dr["ARG_QUERY"].ToString()) );
                        }
                    }
                }
                catch (SqlException ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize( new entityProcessed<string>( codeProcessed.ERR_SQL,
                                "Query Argument 조회에 실패하였습니다.\n- " + ex.Message)
                            )
                        );
                }
                catch (Exception ex)
                {
                    throw new Exception(
                        new JavaScriptSerializer().Serialize( new entityProcessed<string>( codeProcessed.ERR_PROCESS,
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
                        throw new Exception( strArg + " - 관련 Argument를 찾을 수 없습니다.");
                    }
                    strBody = objArg.convertWhere( strBody, strQueryID, strArg, HttpUtility.UrlDecode(objArgs.getValue(strArg)) );
                }
            }
            catch (Exception ex)
            {
                throw new Exception(
                    new JavaScriptSerializer().Serialize( new entityProcessed<string>( codeProcessed.ERR_PROCESS,
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

    protected static void connectDB()
    {
        try
        {
            objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
            objCon.Open();
            objCmd = new SqlCommand("", objCon);
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

    [WebMethod]
    public static string importExcelData(string _file, string _key, string _type)
    {
        //if (HttpContext.Current != null)
        //{
        //    _file = "Finished job";
        //}
        string sFileSrc = _file;

        connectDB();
        objCmd.CommandText = "sp_SRM_PoPlan_Excel";
        objCmd.Parameters.Clear();
        objCmd.Parameters.AddWithValue("@JobCd", "InsertMemo");
        objCmd.Parameters.AddWithValue("@UserId", mUserId);
        objCmd.Parameters.AddWithValue("@WeekCd", _key);
        objCmd.Parameters.Add("@RowSeq", SqlDbType.Int);
        objCmd.Parameters.Add("@RowData", SqlDbType.NVarChar);
        objCmd.Parameters.Add("@RtnMsg", SqlDbType.NVarChar, 255).Direction = ParameterDirection.Output;
        objCmd.CommandType = CommandType.StoredProcedure;

        #region prepare Office object.
        DevExpress.Web.ASPxSpreadsheet.ASPxSpreadsheet aaa = new ASPxSpreadsheet();
        DevExpress.Spreadsheet.IWorkbook objWorkBook = aaa.Document;
        DevExpress.Spreadsheet.Worksheet objWorkSheet;
        string sRowData = ""; string sFlag = ";"; string sRtn = "";
        Boolean isCheckOK = false; int nOkRows = 0;
        // Set additional data rows by Data Type
        int nDataRow = (_type == "RTF") ? 1 : 0;
        try
        {
            objWorkBook.LoadDocument(sFileSrc); //, DevExpress.Spreadsheet.DocumentFormat.Xls
            objWorkSheet = objWorkBook.Worksheets[0];

            for (int i = 3; i < objWorkSheet.Rows.LastUsedIndex; i++)
            {
                if (i % 3 == 0)
                {
                    // Check Essential Field
                    if (checkEmpty(objWorkSheet.Rows[i]["C"].Value)) isCheckOK = false;
                    else if (checkEmpty(objWorkSheet.Rows[i]["G"].Value)) isCheckOK = false;
                    else isCheckOK = true;
                    if (isCheckOK == false) continue;
                    // Common Data
                    sRowData = objWorkSheet.Rows[i][0].Value.ToString().Trim();
                    for (int c = 1; c < 10; c++)
                    {
                        // Set Row Data with delimiter
                        sRowData += sFlag + objWorkSheet.Rows[i][c].Value.ToString().Trim().Replace(";", " ");
                    }
                    // Daily Value with type
                    for (int c = 10; c < 73; c++)
                    {
                        // Set Row Data with delimiter
                        sRowData += sFlag + objWorkSheet.Rows[i + nDataRow][c].Value.ToString().Trim().Replace(";", " ");
                    }
                    objCmd.Parameters["@RowSeq"].Value = i;
                    objCmd.Parameters["@RowData"].Value = sRowData;

                    objCmd.ExecuteNonQuery();
                    sRtn = objCmd.Parameters["@RtnMsg"].Value.ToString();
                    if (sRtn == "OK") nOkRows++;
                    //else
                    //{
                    //    System.Windows.Forms.MessageBox.Show(sRtn);
                    //    break;
                    //}
                }
            }

        }
        catch (Exception ex)
        {
            throw new Exception(
                new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_PROCESS,
                        "Error : Reading excel data.\n- " + ex.Message)
                    )
                );
        }
        finally
        {
            if (objWorkBook != null) objWorkBook.Dispose();
            if (aaa != null) aaa.Dispose();
            if (objDr != null) objDr.Close();
            if (objCon != null) objCon.Close();
            if (nOkRows > 0) System.Windows.Forms.MessageBox.Show("Successed to import data : " + nOkRows.ToString() + " rows ");
        }
        #endregion

        return nOkRows.ToString();
    }

    protected static Boolean checkEmpty(object _val)
    {
        if (_val == null || _val.ToString().TrimEnd().Length < 1) return true;
        return false;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

