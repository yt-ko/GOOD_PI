using System;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

public partial class JOB_EVL_9120 : System.Web.UI.Page
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

            string strPrint = DATA.getOption("PRINT").ToLower();
            string strPage = DATA.getOption("PAGE");
            string strUser = DATA.getOption("USER");
            string evl_no = DATA.getOption("EVL_NO");
            string evl_seq = DATA.getOption("EVL_SEQ");
            string user_id = DATA.getOption("USER_ID");
            string sToday = DateTime.Now.ToString("yyyyMMdd");

            string strRoot = HttpContext.Current.Server.MapPath("~/");
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage));
            if (!Directory.Exists(Path.Combine(strRoot, "Report", strPage, sToday))) Directory.CreateDirectory(Path.Combine(strRoot, "Report", strPage, sToday));
            string sFileNmTrg = string.Format("{0}_{1}.{2}", evl_no, strUser, strPrint);
            string strTarget = Path.Combine(strRoot, "Report", strPage, sToday, sFileNmTrg);

            DevExpress.XtraReports.UI.XtraReport r = new DevExpress.XtraReports.UI.XtraReport();
            r.LoadLayout(Path.Combine(strRoot, "Report", strPage, "QMS_EVL_RESULT_Template.repx"));
            r.Parameters["evl_no"].Value = evl_no;
            r.Parameters["evl_seq"].Value = evl_seq;
            r.Parameters["user_id"].Value = user_id;

            switch (strPrint)
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
            return new JavaScriptSerializer().Serialize(
                            new entityProcessed<string>(codeProcessed.SUCCESS, sToday + "/" + sFileNmTrg)
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
