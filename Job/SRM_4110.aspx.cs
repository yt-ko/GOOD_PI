using DevExpress.Spreadsheet;
using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_SRM_4110 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
    }
    
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
    public static string Print(cRetrieveData DATA)
    {
        try
        {
            //바코드 생성
            createBarcode(DATA);

            string strPrint = DATA.getOption("PRINT").ToUpper();
            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");
            string strKey = DATA.getOption("KEY");
            string strRows = DATA.getOption("ROWS");
            string strReport = DATA.getOption("RPT");
            string strSortCol = string.IsNullOrEmpty(DATA.getOption("SORT_COLUMNS")) ? "dlv_seq" : DATA.getOption("SORT_COLUMNS");
            string strSortOrd = string.IsNullOrEmpty(DATA.getOption("SORT_ORDER")) ? "asc" : DATA.getOption("SORT_ORDER");
            string sToday = DateTime.Now.ToString("yyyyMMdd");

            string sJobCd = "Supp";
            if (strReport.IndexOf(":") > 0)
            {
                sJobCd = strReport.Split(':')[1];
                strReport = strReport.Split(':')[0];
            }

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage));
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage, strPrint))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage, strPrint));
            string sFileNmTrg = string.Format("{0}.{1}", strKey, strPrint.ToLower());
            string strTarget = Path.Combine(strRoot, "Report", strPage, strPrint.ToUpper(), sFileNmTrg);

            DevExpress.XtraReports.UI.XtraReport r = new DevExpress.XtraReports.UI.XtraReport();
            r.LoadLayout(Path.Combine(strRoot, "Report", strPage, string.Format("{0}.repx", strReport)));

            #region set Sort

            if (strReport.Equals("label1") || strReport.Equals("label2") || strReport.Equals("label2_xls") || strReport.Equals("label3") || strReport.Equals("label3_xls"))
            {

                //string[] sort_cols = { "item_no", "item_nm", "spec", "pur_no", "proj_no", "dlv_no", "barcode" };
                switch (strSortCol)
                {
                    case "item_cd":
                        strSortCol = "item_no";
                        break;
                    case "item_spec":
                        strSortCol = "spec";
                        break;
                    case "track_no":
                        strSortCol = "proj_no";
                        break;
                }

                //if (Array.IndexOf(sort_cols, strSortCol) >= 0)
                //{
                    r.ScriptsSource += "private void dlvReport_BeforePrint(object sender, " +
                                        "System.Drawing.Printing.PrintEventArgs e) {\r\n  " +
                                        "Detail.SortFields.Add(new GroupField(\"" + strSortCol + "\", XRColumnSortOrder." + (strSortOrd.Equals("asc") ? "Ascending" : "Descending") + "));\r\n" +
                                        "}";

                    r.Scripts.OnBeforePrint = "dlvReport_BeforePrint";
                //}

            }
            #endregion end Sort

            r.Parameters["dlv_no"].Value = strKey;
            if (strReport.Equals("rpt1"))
                r.Parameters["job_cd"].Value = sJobCd;
            else
                r.Parameters["dlv_seq"].Value = strRows;

            switch (strPrint.ToLower())
            {
                case "pdf":
                    {
                        r.ExportToPdf(strTarget);
                    }
                    break;
                case "xls":
                    {
                        r.ExportToXls(strTarget);
                    }
                    break;
                case "xlsx":
                    {
                        r.ExportToXlsx(strTarget);
                    }
                    break;
            }

            r.Dispose();

            return new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(codeProcessed.SUCCESS, strPrint + "/" + sFileNmTrg)
                        );

        }
        catch (Exception ex)
        {
            return new JavaScriptSerializer().Serialize(
                                    new entityProcessed<string>(codeProcessed.ERR_PROCESS, "레포트 생성 실패\n" + ex.Message)
                                );
        }

    }

    #endregion

    public static void createBarcode(cRetrieveData DATA)
    {

        try
        {
            string strQuery = "sp_SRM_DLVBarcode";
            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            using (SqlCommand objCmd = new SqlCommand(strQuery, objCon))
            {
                objCmd.Parameters.AddWithValue("@dlv_no", DATA.getOption("KEY"));
                objCmd.Parameters.AddWithValue("@usr_id", DATA.getUser());
                objCmd.Parameters.Add("@rtn_no", SqlDbType.Int).Direction = ParameterDirection.Output;
                objCmd.Parameters.Add("@rtn_msg", SqlDbType.NVarChar, 20).Direction = ParameterDirection.Output;
                objCmd.CommandType = CommandType.StoredProcedure;
                objCmd.CommandTimeout = 60;
                objCon.Open();
                objCmd.ExecuteNonQuery();
                objCon.Close();
                if ((int)objCmd.Parameters["@rtn_no"].Value < 0)
                {
                    string rtn_msg = objCmd.Parameters["@rtn_msg"].Value.ToString();
                    throw new Exception(rtn_msg);
                }
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }

    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

