using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Web.Script.Serialization;

public partial class JOB_QDM_5524 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }

    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(e.Parameter.ToString(), this.ctlDB_1, this.ctlChart_1);

        ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
        //ctlChart_1.Titles[0].Text = "VOC 접수 현황";
        if (ctlChart_1.SeriesTemplate.View.ToString() == "Bar"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Line"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Spine"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Point"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Area"
            || ctlChart_1.SeriesTemplate.View.ToString() == "Bar Stacked")
            ((SeriesViewColorEachSupportBase)ctlChart_1.SeriesTemplate.View).ColorEach = false;
    }

}


