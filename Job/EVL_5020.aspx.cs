using DevExpress.XtraCharts;
using System;

public partial class JOB_EVL_5020 : System.Web.UI.Page
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
        this.ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;

        foreach (Series s in this.ctlChart_1.Series)
        {
            s.Label.TextPattern = "{V:#,#}";
        }

    }
}


