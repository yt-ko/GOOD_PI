using DevExpress.Spreadsheet;
using System;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Web.Services;
using DevExpress.XtraSpreadsheet;

public partial class Job_w_upload_per_excel : System.Web.UI.Page
{
    string strData = "PER_XLS";
    static string strUserId = string.Empty;
    static string strActId = string.Empty;
    static string strPerNo = string.Empty;
    static string strSuppSeq = string.Empty;
    protected Worksheet objWorksheet;
    protected Range objRange;
    protected string regex = @"[^0-9]";    // 숫자만 가져오기

    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        {
            return;
        }
        strData = lstParam["DATA_TYPE"].ToString();
        strUserId = Session["USR_ID"].ToString();
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {

        SpreadsheetControl objWorkbook = new SpreadsheetControl();
        try
        {
            MemoryStream ms = new MemoryStream();
            ms.Read(e.UploadedFile.FileBytes, 0, e.UploadedFile.FileBytes.Length);

            if (!objWorkbook.LoadDocument(e.UploadedFile.FileBytes, DevExpress.Spreadsheet.DocumentFormat.Xls))
                throw new Exception("엑셀파일을 여는 중 오류가 발생하였습니다.");
            
            objWorksheet = objWorkbook.Document.Worksheets[0];
            objRange = objWorksheet.GetDataRange();

            switch (strActId)
            {
                case "1011":
                    e.CallbackData = act_1011();
                    break;
                case "1012":
                    e.CallbackData = act_1012();
                    break;
                case "1022":
                    e.CallbackData = act_1022();
                    break;
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            objWorkbook.Dispose();
        }
    }
    protected string act_1011()
    {
        // 양식 점검
        if (!objWorksheet.Cells["J1"].Value.ToString().Equals("PR_NO") ||
            !objWorksheet.Cells["K1"].Value.ToString().Equals("PR_SEQ"))
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "잘못된 양식을 업로드 하였습니다.")
                    )
                );
        }

        string param = string.Empty;
        for (int i = 1; i < objRange.RowCount; i++)   // i = 0; header
        {
            string cell1 = "J" + (i + 1).ToString();    // pr_no
            string cell2 = "K" + (i + 1).ToString();    // pr_seq
            string cell3 = "G" + (i + 1).ToString();    // dlvr_date
            param += (string.IsNullOrEmpty(param) ? "" : "^")
                + objWorksheet.Cells[cell1].Value + ","
                + Regex.Replace(objWorksheet.Cells[cell2].Value.ToString(), regex, "") + ","
                + Regex.Replace(objWorksheet.Cells[cell3].Value.ToString(), regex, "");
        }

        cProcedure objProcedure = new cProcedure();
        objProcedure.initialize();
        try
        {
            string strSQL = "sp_createPER";
            objProcedure.objCmd.CommandText = strSQL;
            objProcedure.objCmd.Parameters.AddWithValue("@pr_no", param);
            objProcedure.objCmd.Parameters.AddWithValue("@user_id", strUserId);
            objProcedure.objCmd.Parameters.Add("@per_no", SqlDbType.VarChar, 50).Direction = ParameterDirection.Output;
            objProcedure.objCmd.Parameters.Add("@err_msg", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
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
                                "견적의뢰서를 생성할 수 없습니다.\n- " + ex.Message)
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
                                "견적의뢰서 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }
        string per_no = objProcedure.objCmd.Parameters["@per_no"].Value.ToString();
        string err_msg = objProcedure.objCmd.Parameters["@err_msg"].Value.ToString();

        if (string.IsNullOrEmpty(per_no))
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "견적의뢰 생성 중에 오류가 발생하였습니다.\n- " + err_msg)
                    )
                );
        }
        return per_no;
    }
    protected string act_1012()
    {
        // 양식 점검
        if (!objWorksheet.Cells["J1"].Value.ToString().Equals("ITEM_SEQ"))
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "잘못된 양식을 업로드 하였습니다.")
                    )
                );
        }

        string param = string.Empty;
        for (int i = 1; i < objRange.RowCount; i++)   // i = 0; header
        {
            string cell1 = "J" + (i + 1).ToString();    // item_seq
            string cell2 = "H" + (i + 1).ToString();    // dlvr_date
            //string cell3 = "J" + (i + 1).ToString();    // est_price
            string cell4 = "I" + (i + 1).ToString();    // item_rmk
            param += (string.IsNullOrEmpty(param) ? "" : "^")
                + Regex.Replace(objWorksheet.Cells[cell1].Value.ToString(), regex, "") + ","
                + Regex.Replace(objWorksheet.Cells[cell2].Value.ToString(), regex, "") + ","
                + "0,"//+ Regex.Replace(objWorksheet.Cells[cell3].Value.ToString(), regex, "") + ","
                + objWorksheet.Cells[cell4].Value.ToString();
        }

        cProcedure objProcedure = new cProcedure();
        objProcedure.initialize();
        try
        {
            objProcedure.objCmd.CommandText = "sp_updatePER_ITEM";
            objProcedure.objCmd.Parameters.AddWithValue("@per_no", strPerNo);
            objProcedure.objCmd.Parameters.AddWithValue("@data", param);
            objProcedure.objCmd.Parameters.AddWithValue("@user_id", strUserId);
            objProcedure.objCmd.Parameters.Add("@err_msg", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
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
                                "견적내역 수정 중에 오류가 발생하였습니다.\n- " + ex.Message)
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
                                "견적내역 수정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }
        string err_msg = objProcedure.objCmd.Parameters["@err_msg"].Value.ToString();

        if (!string.IsNullOrEmpty(err_msg))
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "견적내역 수정 중에 오류가 발생하였습니다.\n- " + err_msg)
                    )
                );
        }
        return strPerNo;
    }
    protected string act_1022()
    {
        // 양식 점검
        if (!objWorksheet.Cells["M1"].Value.ToString().Equals("ITEM_SEQ"))
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_SQL,
                                "잘못된 양식을 업로드 하였습니다.")
                    )
                );
        }

        string param = string.Empty;
        for (int i = 1; i < objRange.RowCount; i++)   // i = 0; header
        {
            string cell1 = "M" + (i + 1).ToString();    // item_seq
            string cell2 = "I" + (i + 1).ToString();    // dlva_date
            string cell3 = "J" + (i + 1).ToString();    // rpt_price
            string cell4 = "K" + (i + 1).ToString();    // rpt_rmk
            param += (string.IsNullOrEmpty(param) ? "" : "^")
                + Regex.Replace(objWorksheet.Cells[cell1].Value.ToString(), regex, "") + ","
                + Regex.Replace(objWorksheet.Cells[cell2].Value.ToString(), regex, "") + ","
                + Regex.Replace(objWorksheet.Cells[cell3].Value.ToString(), regex, "") + ","
                + objWorksheet.Cells[cell4].Value.ToString();
        }

        cProcedure objProcedure = new cProcedure();
        objProcedure.initialize();
        try
        {
            objProcedure.objCmd.CommandText = "sp_updatePER_SUPP_D";
            objProcedure.objCmd.Parameters.AddWithValue("@per_no", strPerNo);
            objProcedure.objCmd.Parameters.AddWithValue("@supp_seq", strSuppSeq);
            objProcedure.objCmd.Parameters.AddWithValue("@data", param);
            objProcedure.objCmd.Parameters.AddWithValue("@user_id", strUserId);
            objProcedure.objCmd.Parameters.Add("@err_msg", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
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
                                "견적내역 수정 중에 오류가 발생하였습니다.\n- " + ex.Message)
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
                                "견적내역 수정 중에 오류가 발생하였습니다.\n- " + ex.Message)
                    )
                );
        }
        string err_msg = objProcedure.objCmd.Parameters["@err_msg"].Value.ToString();

        if (!string.IsNullOrEmpty(err_msg))
        {
            throw new Exception(
                    new JavaScriptSerializer().Serialize(
                        new entityProcessed<string>(
                                codeProcessed.ERR_PROCESS,
                                "견적내역 수정 중에 오류가 발생하였습니다.\n- " + err_msg)
                    )
                );
        }
        return strPerNo;
    }

    [WebMethod]
    public static void Set_Var(cRetrieveData DATA)
    {
        strUserId = DATA.getOption("user_id");
        strActId = DATA.getOption("act_id");
        try
        {
            strPerNo = DATA.getOption("per_no");
        }
        catch
        {
            strPerNo = string.Empty;
        }
        try
        {
            strSuppSeq = DATA.getOption("supp_seq");
        }
        catch
        {
            strSuppSeq = string.Empty;
        }
    }
}
