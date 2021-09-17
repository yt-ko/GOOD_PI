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

public partial class Job_SCM_8910 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }
    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        this.ctlChart_1.Series[0].DataFilters.Clear();
        this.ctlChart_1.Series[1].DataFilters.Clear();
        this.ctlChart_1.Series[2].DataFilters.Clear();
        this.ctlChart_1.Series[0].DataFilters.Add(new DataFilter("series", "System.Int32", DataFilterCondition.Equal, "자재납기Issue(건)"));
        this.ctlChart_1.Series[1].DataFilters.Add(new DataFilter("series", "System.Int32", DataFilterCondition.Equal, "문제발생Issue(건)"));
        this.ctlChart_1.Series[2].DataFilters.Add(new DataFilter("series", "System.Int32", DataFilterCondition.Equal, "지연발생(시간)"));

        objChart.bindData(
            e.Parameter.ToString(),
            this.ctlDB_1,
            this.ctlChart_1);
    }
}


