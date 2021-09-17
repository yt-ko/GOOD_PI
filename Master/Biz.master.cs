using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Master_Biz : System.Web.UI.MasterPage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // No Cache -> Prevent Back button in Browser..
        //Response.Cache.SetAllowResponseInBrowserHistory(false);
        //Response.Cache.SetCacheability(HttpCacheability.NoCache);
        //Response.Cache.SetNoStore();
        //Response.Expires = 0;
    }
}
