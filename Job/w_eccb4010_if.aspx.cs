using System;

public partial class Job_w_eccb4010_if : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string user = Request["User"];
        string key = Request["Key"];
        string url = "~/Master/BizContainer.aspx?menu_id=eccb4010&user_id=" + user + "&if_key=" + key;
        Response.Redirect(url);
    }

}
