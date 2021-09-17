using DevExpress.XtraCharts;
using System;
using System.Collections.Specialized;

public partial class JOB_EVL_5050 : System.Web.UI.Page
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
        ((SeriesViewColorEachSupportBase)ctlChart_1.SeriesTemplate.View).ColorEach = true;
    }

    protected void ctlChart_2_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        NameValueCollection lstParam = objChart.parseData(e.Parameter.ToString());
        this.ctlDB_1.SelectCommand = objChart.setQuery(lstParam);
        this.ctlChart_2.DataBind();
        ((RadarDiagram)this.ctlChart_2.Diagram).AxisY.Label.Visible = false;
    }

    protected void ctlChart_3_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        NameValueCollection lstParam = objChart.parseData(e.Parameter.ToString());
        this.ctlDB_1.SelectCommand = objChart.setQuery(lstParam);
        this.ctlChart_3.DataBind();
        ((RadarDiagram)this.ctlChart_3.Diagram).AxisY.Label.Visible = false;
    }

    protected void ctlChart_4_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_1,
            this.ctlChart_4);
        this.ctlChart_4.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;

        foreach (Series s in this.ctlChart_4.Series)
        {
            s.Label.TextPattern = "{V:0%}";
        }
    }

}


