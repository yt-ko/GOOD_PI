using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Collections;
using System.Text;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Collections.Specialized;
using System.Web.Script.Serialization;

public partial class JOB_QDM_5513 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }
    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData( e.Parameter.ToString(), this.ctlDB_1, this.ctlChart_1);
        ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;

        if (ctlChart_1.Series.Count == 1)
        {
            // view.
            ctlChart_1.Series[0].ChangeView(ViewType.Line);
            ctlChart_1.Series[0].LegendTextPattern = "{V}";
            ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.False;
            ((SeriesViewColorEachSupportBase)ctlChart_1.Series[0].View).ColorEach = true;
            ((DevExpress.XtraCharts.XYDiagram)ctlChart_1.Diagram).AxisY.Interlaced = true;
        }
        else
        {
            ctlChart_1.Legend.Visibility = DevExpress.Utils.DefaultBoolean.True;
            ctlChart_1.SeriesTemplate.LegendTextPattern = "{S}";
            ((SeriesViewColorEachSupportBase)ctlChart_1.SeriesTemplate.View).ColorEach = false;
        }
    }
}


