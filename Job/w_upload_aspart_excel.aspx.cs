using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Data;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Text;
using System.Collections;
using System.Collections.Specialized;
using System.Configuration;
using System.IO;
using DevExpress.Spreadsheet;
using DevExpress.XtraSpreadsheet;
using System.Text.RegularExpressions;

public partial class Job_w_upload_aspart_excel : System.Web.UI.Page
{
    string strData = "ASPART";

    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (string.IsNullOrEmpty(lstParam["DATA_TYPE"]))
        {
            return;
        }
        strData = lstParam["DATA_TYPE"].ToString();
    }
    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {

        try
        {
            SpreadsheetControl objWorkbook = new SpreadsheetControl();

            MemoryStream ms = new MemoryStream();
            ms.Read(e.UploadedFile.FileBytes, 0, e.UploadedFile.FileBytes.Length);

            if(!objWorkbook.LoadDocument(e.UploadedFile.FileBytes, DevExpress.Spreadsheet.DocumentFormat.OpenXml))
                throw new Exception("엑셀파일을 여는 중 오류가 발생하였습니다.");

            Worksheet objWorksheet = objWorkbook.Document.Worksheets[0];
            Range objRange = objWorksheet.GetDataRange();

            string regex = @"[^0-9]";    // 숫자만 가져오기
            List<Data> row = new List<Data>();
            for (int i = 1; i< objRange.RowCount; i++)   // i = 0; header
            {
                int c = 0;
                row.Add(new Data {
                    change_dt = Regex.Replace(objWorksheet.Cells[i, c++].Value.ToString(), regex, ""),      // 교체일자
                    change_time = objWorksheet.Cells[i, c++].Value.ToString(),                              // 수급시간
                    change_qty = Convert.ToInt32(objWorksheet.Cells[i, c++].Value.ToString()),              // 수량
                    reason_yn = getYesNo(objWorksheet.Cells[i, c++].Value.ToString()),                      // 참원인부품
                    reinput_yn = getYesNo(objWorksheet.Cells[i, c++].Value.ToString()),                     // 반출
                    reinput_dt = Regex.Replace(objWorksheet.Cells[i, c++].Value.ToString(), regex, ""),     // 반출예정일(OUT)
                    part_stat = objWorksheet.Cells[i, c++].Value.ToString(),                                // 부품상태
                    apart_tp = objWorksheet.Cells[i, c++].Value.ToString(),                                 // 기장착부품군(OUT)
                    apart_cd = objWorksheet.Cells[i, c++].Value.ToString(),                                 // 기장착부품코드(OUT)
                    apart_nm = objWorksheet.Cells[i, c++].Value.ToString(),                                 // 기장착부품명(OUT)
                    apart_sno = objWorksheet.Cells[i, c++].Value.ToString(),                                // OUT Ser. No(기장착부품)
                    bpart_tp = objWorksheet.Cells[i, c++].Value.ToString(),                                 // 교체부품군(IN)
                    bpart_cd = objWorksheet.Cells[i, c++].Value.ToString(),                                 // 교체부품코드(IN)
                    bpart_nm = objWorksheet.Cells[i, c++].Value.ToString(),                                 // 교체부품명(IN)
                    bpart_sno = objWorksheet.Cells[i, c++].Value.ToString(),                                // IN Ser. No(교체부품)
                    charge_cs = getYesNo(objWorksheet.Cells[i, c++].Value.ToString())                       // 구매요청
                });
            }
            e.CallbackData = new JavaScriptSerializer().Serialize(new { data = row });

            //e.CallbackData = "TEST" + "@" + e.UploadedFile.FileName + "@" + "xls" + "@" + @"D:\PLM_FILES";
        }
        catch (Exception ex)
        {
            throw ex;
        }


        //#region 1. Mapping Argument.

        //// 1. Mapping Argument.
        ////
        //string strName = e.UploadedFile.FileName;
        //string [] strFile = strName.Split('.');
        //string strType = (strFile.Length > 1) ? strFile[strFile.Length - 1] : string.Empty;

        //#endregion

        //SqlConnection objCon = null;
        //SqlTransaction objTran = null;
        //SqlCommand objCmd = null;
        //try
        //{
        //    #region 2. DB Connection Open.

        //    objCon = new SqlConnection(
        //                        ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString);
        //    objCon.Open();

        //    #endregion

        //    #region 3. Run Procedure.

        //    objTran = objCon.BeginTransaction();

        //    string strSQL = "sp_getNewFileID";
        //    objCmd = new SqlCommand(strSQL, objCon, objTran);
        //    objCmd.CommandText = strSQL;
        //    objCmd.Parameters.AddWithValue("@FileName", strName);
        //    objCmd.Parameters.AddWithValue("@DataType", strData);
        //    objCmd.Parameters.AddWithValue("@NetworkCode", strNetwork);
        //    objCmd.Parameters.Add("@FileID", SqlDbType.VarChar, 20).Direction = ParameterDirection.Output;
        //    objCmd.Parameters.Add("@FilePath", SqlDbType.VarChar, 255).Direction = ParameterDirection.Output;
        //    objCmd.CommandType = CommandType.StoredProcedure;
            
        //    objCmd.ExecuteNonQuery();

        //    objTran.Commit();

        //    #endregion

        //    #region 4. Get Result.

        //    // 4. Get Result.
        //    //
        //    string strID = objCmd.Parameters["@FileID"].Value.ToString();
        //    string strPath = objCmd.Parameters["@FilePath"].Value.ToString();
        //    if (string.IsNullOrEmpty(strID) || string.IsNullOrEmpty(strPath))
        //    {
        //        throw new Exception
        //            ("저장할 파일 ID와 경로를 가져올 수 없습니다.");
        //    }
        //    if (!Directory.Exists(strPath))
        //        Directory.CreateDirectory(strPath);
        //    string strSave = strPath + strID + (string.IsNullOrEmpty(strType) ? "" : "." + strType);
        //    e.UploadedFile.SaveAs(strSave);
        //    e.CallbackData = strID + "@" + strName + "@" + strType + "@" + strPath;

        //    #endregion
        //}
        //catch (Exception ex)
        //{
        //    #region 5. Exception.

        //    // 5. Exception.
        //    //
        //    if (objTran != null)
        //        objTran.Rollback();

        //    throw ex;

        //    #endregion
        //}
        //finally
        //{
        //    #region 6. Release Object.

        //    // 6. Release Object.
        //    //
        //    if (objCon != null)
        //        objCon.Close();

        //    #endregion
        //}
    }

    public class Data
    {
        public string change_dt { get; set; }
        public string change_time { get; set; }
        public int change_qty { get; set; }
        public string reason_yn { get; set; }
        public string reinput_yn { get; set; }
        public string reinput_dt { get; set; }
        public string part_stat { get; set; }
        public string apart_tp { get; set; }
        public string apart_cd { get; set; }
        public string apart_nm { get; set; }
        public string apart_sno { get; set; }
        public string bpart_tp { get; set; }
        public string bpart_cd { get; set; }
        public string bpart_nm { get; set; }
        public string bpart_sno { get; set; }
        public string charge_cs { get; set; }
    }

    public string getYesNo(string value)
    {
        return string.IsNullOrEmpty(value.Trim()) || value.Trim().Equals("0") ? "0" : "1";
    }
}
