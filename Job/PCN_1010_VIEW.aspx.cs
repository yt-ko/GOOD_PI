﻿using System;

public partial class Job_PCN_1010_VIEW : System.Web.UI.Page
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