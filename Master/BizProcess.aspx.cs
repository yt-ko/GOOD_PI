using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Master_BizProcess : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        // Application Category        
        string app = Request.Url.Host.Split('.')[0];
        //if (app == "stims")
        //    Page.Title = "[ IPS Technical Document Center ]";
        //else
        //    Page.Title = "[ IPS PLM ]";
        
    }


}
