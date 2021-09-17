using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Web.Script.Serialization;

public partial class JOB_QDM_5520 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }

    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData( e.Parameter.ToString(), this.ctlDB_1, this.ctlChart_1);
        
        ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.False;
        //ctlChart_1.Titles[0].Text = "VOC 접수 현황";
        if (ctlChart_1.SeriesTemplate.View.ToString() == "Bar"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Line"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Spine"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Point"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Area"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Bar Stacked")
            ((SeriesViewColorEachSupportBase)ctlChart_1.SeriesTemplate.View).ColorEach = false;
    }
    protected void ctlChart_2_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(e.Parameter.ToString(), this.ctlDB_2, this.ctlChart_2);

        ctlChart_2.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
        if (ctlChart_2.SeriesTemplate.View.ToString() == "Bar"
            || ctlChart_2.SeriesTemplate.View.ToString() == "Line"
            || ctlChart_2.SeriesTemplate.View.ToString() == "Spine"
            || ctlChart_2.SeriesTemplate.View.ToString() == "Point"
            || ctlChart_2.SeriesTemplate.View.ToString() == "Area"
            || ctlChart_2.SeriesTemplate.View.ToString() == "Bar Stacked")
            ((SeriesViewColorEachSupportBase)ctlChart_2.SeriesTemplate.View).ColorEach = false;
    }
    protected void ctlChart_3_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(e.Parameter.ToString(), this.ctlDB_3, this.ctlChart_3);

        for (int i = 0; i < ctlChart_3.Series.Count; i++)
        {
            if (ctlChart_3.Series[i].Name.IndexOf("지수") >= 0)
            {
                ctlChart_3.Series[i].ChangeView(ViewType.Line);
                ((LineSeriesView)ctlChart_3.Series[i].View).AxisY = ((XYDiagram)ctlChart_3.Diagram).SecondaryAxesY[0];
            }
        }

        ctlChart_3.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
        if (ctlChart_3.SeriesTemplate.View.ToString() == "Bar"
            || ctlChart_3.SeriesTemplate.View.ToString() == "Line"
            || ctlChart_3.SeriesTemplate.View.ToString() == "Spine"
            || ctlChart_3.SeriesTemplate.View.ToString() == "Point"
            || ctlChart_3.SeriesTemplate.View.ToString() == "Area"
            || ctlChart_3.SeriesTemplate.View.ToString() == "Bar Stacked")
            ((SeriesViewColorEachSupportBase)ctlChart_3.SeriesTemplate.View).ColorEach = false;
    }
    protected void ctlChart_4_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(e.Parameter.ToString(), this.ctlDB_4, this.ctlChart_4);

        ctlChart_4.Legend.Visibility = DevExpress.Utils.DefaultBoolean.False;
        if (ctlChart_4.SeriesTemplate.View.ToString() == "Bar"
            || ctlChart_4.SeriesTemplate.View.ToString() == "Line"
            || ctlChart_4.SeriesTemplate.View.ToString() == "Spine"
            || ctlChart_4.SeriesTemplate.View.ToString() == "Point"
            || ctlChart_4.SeriesTemplate.View.ToString() == "Area"
            || ctlChart_4.SeriesTemplate.View.ToString() == "Bar Stacked")
            ((SeriesViewColorEachSupportBase)ctlChart_4.SeriesTemplate.View).ColorEach = false;
    }
}


