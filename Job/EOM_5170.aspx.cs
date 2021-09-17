﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Web.Script.Serialization;

public partial class JOB_EOM_5170 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }
    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_1,
            this.ctlChart_1);
        ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
    }
    protected void ctlChart_2_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_2,
            this.ctlChart_2);
        ctlChart_2.Legend.Visibility = DevExpress.Utils.DefaultBoolean.False;
    }
    protected void ctlChart_3_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_3,
            this.ctlChart_3);
        ctlChart_3.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
    }
    protected void ctlChart_4_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_4,
            this.ctlChart_4);
        ctlChart_4.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
    }
    protected void ctlChart_5_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_5,
            this.ctlChart_5);
        ctlChart_5.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
    }
    protected void ctlChart_6_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_6,
            this.ctlChart_6);
        ctlChart_6.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
    }
}


