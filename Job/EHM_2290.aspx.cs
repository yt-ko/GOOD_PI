using System;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class JOB_EHM_2290 : System.Web.UI.Page
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
            string strReport = strPage;
            string sToday = DateTime.Now.ToString("yyyyMMdd");

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage));
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage, strPrint))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage, strPrint));
            string sFileNmTrg = string.Format("{0}.{1}", strUser, strPrint.ToLower());
            string strTarget = Path.Combine(strRoot, "Report", strPage, strPrint.ToUpper(), sFileNmTrg);

            DevExpress.XtraReports.UI.XtraReport r = new DevExpress.XtraReports.UI.XtraReport();
            r.LoadLayout(Path.Combine(strRoot, "Report", strPage, string.Format("{0}.repx", strReport)));

            r.Parameters["rqst_no"].Value = strKey;

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


}
