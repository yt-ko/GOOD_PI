using System;

public partial class Job_w_link_eccb_item : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (Session["AUTH"] == null)
        {
            string url = "~/Master/IntroProcess.aspx?REDIRECT=" + System.Web.HttpUtility.UrlEncode(Request.Url.PathAndQuery);
            Response.Redirect(url);
        }
    }
}
