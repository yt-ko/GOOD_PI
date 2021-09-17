﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using DevExpress.XtraCharts;
using System.Web.Script.Serialization;

public partial class JOB_QDM_5523 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }

    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        objChart.bindData(e.Parameter.ToString(), this.ctlDB_1, this.ctlChart_1);

        //if (ctlChart_1.Series["불량지수"].Name == "불량지수")
        //{
        //    ((SeriesViewColorEachSupportBase)ctlChart_1.Series["불량지수"].View).ColorEach = false;
        //    ctlChart_1.Series["불량지수"].ChangeView(ViewType.Line);
        //    ((LineSeriesView)ctlChart_1.Series["불량지수"].View).AxisY = ((XYDiagram)ctlChart_1.Diagram).SecondaryAxesY[0];
        //    ((LineSeriesView)ctlChart_1.Series["불량지수"].View).AxisY.Interlaced = true;
        //    //((DevExpress.XtraCharts.XYDiagram)ctlChart_1.Diagram).AxisY = 100;
        //}

        for (int i = 0; i < ctlChart_1.Series.Count; i++)
        {
            if (ctlChart_1.Series[i].Name.IndexOf("지수") > 0)
            {
                ctlChart_1.Series[i].ChangeView(ViewType.Line);
                ((LineSeriesView)ctlChart_1.Series[i].View).AxisY = ((XYDiagram)ctlChart_1.Diagram).SecondaryAxesY[0];
            }
        }

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


