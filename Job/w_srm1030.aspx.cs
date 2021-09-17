using System;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class Job_w_srm1030 : System.Web.UI.Page
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

            string strPrint = DATA.getOption("PRINT").ToUpper();
            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");
            string strKey = DATA.getOption("KEY");
            string strReport = getRptType(strKey);  //.Equals("S") ? "rpt2" : "rpt1";   //DATA.getOption("REPORT");
            string sToday = DateTime.Now.ToString("yyyyMMdd");

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage));
            //if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage, sToday))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage, sToday));
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage, strPrint))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage, strPrint));
            string sFileNmTrg = string.Format("{0}.{1}", strKey, strPrint.ToLower());
            //string strTarget = Path.Combine(strRoot, "Report", strPage, sToday, sFileNmTrg);
            string strTarget = Path.Combine(strRoot, "Report", strPage, strPrint.ToUpper(), sFileNmTrg);

            DevExpress.XtraReports.UI.XtraReport r = new DevExpress.XtraReports.UI.XtraReport();
            r.LoadLayout(Path.Combine(strRoot, "Report", strPage, string.Format("{0}.repx", strReport)));
            r.Parameters["pur_no"].Value = strKey;

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

            #region update Status.

            string strSave = string.Empty;
            try
            {
                strSave = DATA.getOption("SAVE");
                if (strSave.Equals("1"))
                {
                    try
                    {
                        string strQuery = @"
                        UPDATE SM_PUR 
                        SET    cust_dt = CASE WHEN ISNULL(cust_dt, '') = '' THEN GETDATE() ELSE cust_dt END,
                               checked_dt = CASE WHEN ISNULL(checked_dt, '') < GETDATE() THEN GETDATE() ELSE checked_dt END,
                               print_dt = CASE WHEN ISNULL(print_dt, '') = '' THEN GETDATE() ELSE print_dt END,
                               printed_dt = CASE WHEN ISNULL(printed_dt, '') < GETDATE() THEN GETDATE() ELSE printed_dt END
                        WHERE  pur_no = @pur_no";

                        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
                        using (SqlCommand objCmd = new SqlCommand(strQuery, objCon))
                        {
                            objCmd.Parameters.AddWithValue("@pur_no", strKey);
                            objCon.Open();
                            objCmd.ExecuteNonQuery();
                            objCon.Close();
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new Exception(
                            new JavaScriptSerializer().Serialize(
                                new entityProcessed<string>(
                                    codeProcessed.ERR_PROCESS,
                                    "출력 정보 저장 중에 오류가 발생하였습니다.\n- " + ex.Message)
                            )
                        );
                    }
                }
            }
            catch
            {

            }

            #endregion

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

    protected static string getRptType(string pur_no)
    {
        string pur_type = string.Empty;

        try
        {
            string strSQL = string.Format("SELECT CASE WHEN PUR_TYPE = '외자' THEN 'rpt3' ELSE CASE WHEN ROOT_TYPE = 'S' THEN 'rpt2' ELSE 'rpt1' END END FROM SM_PUR WHERE PUR_NO = '{0}'", pur_no);
            using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
            using (SqlCommand objCmd = new SqlCommand(strSQL, objCon))
            {
                try
                {
                    objCon.Open();
                    using (SqlDataReader dr = objCmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            pur_type = dr[0].ToString();
                        }
                    }

                }
                catch (Exception ex)
                {
                    throw new Exception("발주타입 정보 오류.\n- " + ex.Message);
                }
                finally
                {
                    objCon.Close();
                }
            }

        }
        catch (SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return pur_type;
    }


}
