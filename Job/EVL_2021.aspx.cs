using DevExpress.Spreadsheet;
using DevExpress.XtraSpreadsheet;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web.Script.Serialization;

public partial class Job_EVL_2021 : System.Web.UI.Page
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

                if (string.IsNullOrEmpty(ctlParam["evl_no"].ToString()) || string.IsNullOrEmpty(ctlParam["evl_seq"].ToString()) || string.IsNullOrEmpty(ctlParam["user_id"].ToString()))
                    throw new Exception("매개변수가 설정되지 않았습니다.");

                Worksheet objWorksheet = objWorkbook.Document.Worksheets[0];
                Range objRange = objWorksheet.GetDataRange();

                string job_id = Guid.NewGuid().ToString("N");
                string evl_no = ctlParam["evl_no"].ToString();
                int evl_seq = Convert.ToInt16(ctlParam["evl_seq"]);
                string user_id = ctlParam["user_id"].ToString();
                List<Data> row = new List<Data>();
                for (int i = 1; i < objRange.RowCount; i++)   // i = 0; header
                {
                    int c = 0;
                    Data d = new Data
                    {
                        evl_no = evl_no,
                        evl_seq = evl_seq,
                        user_id = user_id,
                        item_seq = objWorksheet.Cells[i, c++].Value.NumericValue,                   // 평가요소순번
                        item_cat1 = objWorksheet.Cells[i, c++].Value.ToString(),                        // 대분류
                        item_cat2 = objWorksheet.Cells[i, c++].Value.ToString(),                        // 중분류
                        item_cat3 = objWorksheet.Cells[i, c++].Value.ToString(),                        // 소분류
                        item_nm = objWorksheet.Cells[i, c++].Value.ToString(),                          // 평가문항
                        item_desc = objWorksheet.Cells[i, c++].Value.ToString(),                        // 설명
                        evl_item_point = ToDouble(objWorksheet.Cells[i, c++].Value.ToString()),         // 배점
                        item_point = ToDouble(objWorksheet.Cells[i, c++].Value.ToString()),             // 평가점수
                        rmk = objWorksheet.Cells[i, c++].Value.ToString()                               // 평가내용
                    };
                    row.Add(d);

                    using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                    {
                        try
                        {
                            objCon.Open();
                            string qry = @"INSERT INTO ZEXCEL
                                                    ( FILE_ID, SEQ, COL01, COL02, COL03, COL04, COL05, COL06, COL07, COL08, COL09, COL10, COL11 )
                                                    VALUES (@file_id, @seq, @col01, @col02, @col03, @col04, @col05, @col06, @col07, @col08, @col09, @col10, @col11)";
                            //job_id, d.item_seq, d.evl_no, d.evl_seq, d.user_id, d.item_cat1, d.item_cat2, d.item_cat3, d.item_nm, d.item_desc, d.evl_item_point, d.item_point, d.rmk);
                            //List<cDBParameter> p = new List<cDBParameter>();
                            //p.Add(new cDBParameter("@file_id", SqlDbType.VarChar, 50, job_id));
                            //p.Add(new cDBParameter("@seq", SqlDbType.Int, 3, d.item_seq.ToString()));
                            //p.Add(new cDBParameter("@col01", SqlDbType.VarChar, 1000, d.evl_no));
                            //p.Add(new cDBParameter("@col02", SqlDbType.VarChar, 1000, d.evl_seq.ToString()));
                            //p.Add(new cDBParameter("@col03", SqlDbType.VarChar, 1000, d.user_id));
                            //p.Add(new cDBParameter("@col04", SqlDbType.VarChar, 1000, d.item_cat1));
                            //p.Add(new cDBParameter("@col05", SqlDbType.VarChar, 1000, d.item_cat2));
                            //p.Add(new cDBParameter("@col06", SqlDbType.VarChar, 1000, d.item_cat3));
                            //p.Add(new cDBParameter("@col07", SqlDbType.VarChar, 1000, d.item_nm));
                            //p.Add(new cDBParameter("@col08", SqlDbType.VarChar, 1000, d.item_desc));
                            //p.Add(new cDBParameter("@col09", SqlDbType.VarChar, 1000, d.evl_item_point.ToString()));
                            //p.Add(new cDBParameter("@col10", SqlDbType.VarChar, 1000, d.item_point.ToString()));
                            //p.Add(new cDBParameter("@col11", SqlDbType.VarChar, 1000, d.rmk));
                            //cDBQuery objQuery = new cDBQuery(ruleQuery.INLINE, qry, p);

                            cDBQuery objQuery = new cDBQuery(ruleQuery.INLINE, qry);
                            //objQuery.executeQuery(objCon);

                            SqlCommand objCmd = new SqlCommand(qry, objCon);
                            objCmd.Parameters.AddWithValue("@file_id", job_id);
                            objCmd.Parameters.AddWithValue("@seq", d.item_seq);
                            objCmd.Parameters.AddWithValue("@col01", d.evl_no);
                            objCmd.Parameters.AddWithValue("@col02", d.evl_seq);
                            objCmd.Parameters.AddWithValue("@col03", d.user_id);
                            objCmd.Parameters.AddWithValue("@col04", d.item_cat1);
                            objCmd.Parameters.AddWithValue("@col05", d.item_cat2);
                            objCmd.Parameters.AddWithValue("@col06", d.item_cat3);
                            objCmd.Parameters.AddWithValue("@col07", d.item_nm);
                            objCmd.Parameters.AddWithValue("@col08", d.item_desc);
                            objCmd.Parameters.AddWithValue("@col09", d.evl_item_point);
                            objCmd.Parameters.AddWithValue("@col10", d.item_point);
                            objCmd.Parameters.AddWithValue("@col11", d.rmk);
                            objQuery.executeQuery(objCmd);

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
                objProcedure.initialize();
                try
                {
                    string strSQL = "sp_QMS_updateEVL_Result_From_Excel";
                    objProcedure.objCmd.CommandText = strSQL;
                    objProcedure.objCmd.Parameters.AddWithValue("@file_id", job_id);
                    objProcedure.objCmd.Parameters.AddWithValue("@usr_id", user_id);
                    objProcedure.objCmd.Parameters.Add("@rtn_no", SqlDbType.Int).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.Parameters.Add("@rtn_msg", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;
                    objProcedure.objCmd.CommandType = CommandType.StoredProcedure;
                    objProcedure.objCmd.ExecuteNonQuery();
                    objProcedure.processTran(doTransaction.COMMIT);
                }
                catch (SqlException ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);
                    throw new Exception(ex.Message);
                }
                catch (Exception ex)
                {
                    objProcedure.processTran(doTransaction.ROLLBACK);
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
        public int evl_seq { get; set; }
        public string user_id { get; set; }
        public double item_seq { get; set; }
        public string evl_group { get; set; }
        public string item_cat1 { get; set; }
        public string item_cat2 { get; set; }
        public string item_cat3 { get; set; }
        public string item_nm { get; set; }
        public string item_desc { get; set; }
        public double evl_item_point { get; set; }
        public double item_point { get; set; }
        public string rmk { get; set; }
    }

    public double ToDouble(string s)
    {
        double d = 0;
        double.TryParse(s, out d);
        return d;
    }

}
