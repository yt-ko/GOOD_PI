using DevExpress.Spreadsheet;
using DevExpress.XtraSpreadsheet;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web.Script.Serialization;

public partial class Job_EVL_1021 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }

    protected void ctlUpload_FileUploadComplete(object sender, DevExpress.Web.FileUploadCompleteEventArgs e)
    {

        string rtn = string.Empty;
        try
        {
            string file_name = e.UploadedFile.FileName;
            string ext = Path.GetExtension(file_name).ToLower();
            if(!(ext.Equals(".xls") || ext.Equals(".xlsx")))
            {
                e.CallbackData = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "지원되지 않는 파일 확장자입니다.")
                        );
                return;
            }
            using (SpreadsheetControl objWorkbook = new SpreadsheetControl())
            using (MemoryStream ms = new MemoryStream())
            {
                ms.Read(e.UploadedFile.FileBytes, 0, e.UploadedFile.FileBytes.Length);
                DevExpress.Spreadsheet.DocumentFormat f = (ext == ".xls" ? DevExpress.Spreadsheet.DocumentFormat.Xls : DevExpress.Spreadsheet.DocumentFormat.Xlsx);
                if (!objWorkbook.LoadDocument(e.UploadedFile.FileBytes, f))
                    throw new Exception("엑셀파일을 여는 중 오류가 발생하였습니다.");

                Worksheet objWorksheet = objWorkbook.Document.Worksheets[0];
                Range objRange = objWorksheet.GetDataRange();

                string job_id = Guid.NewGuid().ToString("N");
                string evl_no = ctlParam["evl_no"].ToString();
                string user_id = ctlParam["user_id"].ToString();
                List<Data> row = new List<Data>();
                for (int i = 1; i < objRange.RowCount; i++)   // i = 0; header
                {
                    int c = 0;
                    Data d = new Data
                    {
                        evl_no = evl_no,
                        item_seq = i,
                        evl_group = objWorksheet.Cells[i, c++].Value.ToString(),                        // 평가그룹
                        item_cat1 = objWorksheet.Cells[i, c++].Value.ToString(),                        // 대분류
                        item_cat2 = objWorksheet.Cells[i, c++].Value.ToString(),                        // 중분류
                        item_cat3 = objWorksheet.Cells[i, c++].Value.ToString(),                        // 소분류
                        item_nm = objWorksheet.Cells[i, c++].Value.ToString(),                          // 평가문항
                        item_desc = objWorksheet.Cells[i, c++].Value.ToString(),                        // 설명
                        item_point = ToDouble(objWorksheet.Cells[i, c++].Value.ToString()),             // 배점
                        add_point = ToDouble(objWorksheet.Cells[i, c++].Value.ToString())               // 가중치
                    };
                    row.Add(d);

                    using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                    {
                        try
                        {
                            objCon.Open();
                            if (i > 1 && string.IsNullOrEmpty(d.evl_group))
                                d.evl_group = row[i - 2].evl_group;

                            if (i > 1 && string.IsNullOrEmpty(d.item_cat1))
                                d.item_cat1 = row[i - 2].item_cat1;

                            if (i > 1 && string.IsNullOrEmpty(d.item_cat2))
                                d.item_cat2 = row[i - 2].item_cat2;

                            if (i > 1 && string.IsNullOrEmpty(d.item_cat3))
                                d.item_cat3 = row[i - 2].item_cat3;

                            string qry = string.Format(@"INSERT INTO ZEXCEL
                                                    ( FILE_ID, SEQ, COL01, COL02, COL03, COL04, COL05, COL06, COL07, COL08, COL09 )
                                                    VALUES ('{0}', {1}, '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', '{8}', '{9}', '{10}')",
                                                        job_id, d.item_seq, d.evl_no, d.evl_group, d.item_cat1, d.item_cat2, d.item_cat3, d.item_nm, d.item_desc, d.item_point, d.add_point);
                            cDBQuery objQuery = new cDBQuery(ruleQuery.INLINE, qry);
                            objQuery.executeQuery(objCon);
                            objCon.Close();
                        }
                        catch (SqlException ex)
                        {
                            throw new Exception(ex.Message);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception(ex.Message);
                        }
                    }
                }

                // 
                cProcedure objProcedure = new cProcedure();
                // initialize to Call.
                //
                objProcedure.initialize(false);
                try
                {
                    string strSQL = "sp_QMS_createEVL_Item_From_Excel";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@file_id", job_id);
                    objProcedure.objCmd.Parameters.AddWithValue("@usr_id", user_id);
                    objProcedure.objCmd.Parameters.Add("@rtn_no", SqlDbType.Int).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.Parameters.Add("@rtn_msg", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                    objProcedure.objCmd.ExecuteNonQuery();
                    //objProcedure.processTran(doTransaction.COMMIT);
                }
                catch (SqlException ex)
                {
                    //objProcedure.processTran(doTransaction.ROLLBACK);
                    throw new Exception(ex.Message);
                }
                catch (Exception ex)
                {
                    //objProcedure.processTran(doTransaction.ROLLBACK);
                    throw new Exception(ex.Message);
                }
                string rtn_msg = objProcedure.objCmd.Parameters["@rtn_msg"].Value.ToString();
                if (Convert.ToInt32(objProcedure.objCmd.Parameters["@rtn_no"].Value) > 0)
                    e.CallbackData = new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.SUCCESS, rtn_msg));
                else
                    e.CallbackData = new JavaScriptSerializer().Serialize(new entityProcessed<string>(codeProcessed.ERR_SQL, rtn_msg));
            }

        }
        catch (Exception ex)
        {
            e.CallbackData = new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "평가요소 생성 중에 오류가 발생하였습니다.\n- " + ex.Message)
                        );
        }
    }

    public class Data
    {
        public string evl_no { get; set; }
        public int item_seq { get; set; }
        public string evl_group { get; set; }
        public string item_cat1 { get; set; }
        public string item_cat2 { get; set; }
        public string item_cat3 { get; set; }
        public string item_nm { get; set; }
        public string item_desc { get; set; }
        public double item_point { get; set; }
        public double add_point { get; set; }
    }

    public double ToDouble(string s)
    {
        double d = 0;
        double.TryParse(s, out d);
        return d;
    }

}
