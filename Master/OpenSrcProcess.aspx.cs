using System;
using System.Collections.Specialized;

public partial class Master_OpenSrcProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection lstParam = Request.QueryString;
        if (lstParam["menu"] == "New")
        {
            Session["AUTH"] = true;
            Session["USR_ID"] = "New";
            Session["GW_ID"] = "0";
            Session["USR_NM"] = "신규 제안 업체";
            Session["EMP_NO"] = "";
            Session["DEPT_CD"] = "";
            Session["DEPT_NM"] = "";
            Session["POS_CD"] = "";
            Session["POS_NM"] = "";
            Session["DEPT_AREA"] = "";
            Session["DEPT_AUTH"] = "";
            Session["USER_TP"] = "NEW";
            try
            {
                cGetClientIP req = new cGetClientIP();
                Session["PUB_IP"] = req.GetClientIP();
            }
            catch
            {
                Session["PUB_IP"] = string.Empty;
            }
        }
    }

    protected override void OnLoad(EventArgs e)
    {
        Page.Title = "[ IPS Open Sourcing ]";
        base.OnLoad(e);
    }

}
