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

public partial class Job_w_ehm2060 : System.Web.UI.Page
{
    cChart objChart;

    protected void Page_Load(object sender, EventArgs e)
    {
        objChart = new cChart();
    }
    protected void ctlChart_1_CustomCallback(object sender, DevExpress.XtraCharts.Web.CustomCallbackEventArgs e)
    {
        string view = e.Parameter.ToString().Substring(0, 1);
        string appearance = e.Parameter.ToString().Substring(1, 1);
        string palette = e.Parameter.ToString().Substring(2, 1);
        switch (view)
        {
            case "0":
                ctlChart_1.Series[0].ChangeView(ViewType.Bar);
                //foreach (Series series in ctlChart_1.Series)
                //    series.ChangeView(viewType);
                break;
            case "1":
                ctlChart_1.Series[0].ChangeView(ViewType.Point);
                break;
            case "2":
                ctlChart_1.Series[0].ChangeView(ViewType.Line);
                break;
            case "3":
                ctlChart_1.Series[0].ChangeView(ViewType.Area);
                break;
            case "4":
                ctlChart_1.Series[0].ChangeView(ViewType.Pie);                
                break;
            case "5":
                ctlChart_1.Series[0].ChangeView(ViewType.Bubble);
                break;
            case "6":
                ctlChart_1.Series[0].ChangeView(ViewType.Spline);
                break;
            case "7":
                ctlChart_1.Series[0].ChangeView(ViewType.Doughnut);
                break;
        }
        switch (appearance)
        {
            case "0":
                ctlChart_1.AppearanceName = "Nature Colors";
                break;
            case "1":
                ctlChart_1.AppearanceName = "Chameleon";
                break;
            case "2":
                ctlChart_1.AppearanceName = "Dark";
                break;
            case "3":
                ctlChart_1.AppearanceName = "Dark Flat";
                break;
            case "4":
                ctlChart_1.AppearanceName = "Gray";
                break;
            case "5":
                ctlChart_1.AppearanceName = "In A Fog";
                break;
            case "6":
                ctlChart_1.AppearanceName = "The Trees";
                break;
            case "7":
                ctlChart_1.AppearanceName = "Northern Lights";
                break;
            case "8":
                ctlChart_1.AppearanceName = "Pastel Kit";
                break;
            case "9":
                ctlChart_1.AppearanceName = "Terracotta Pie";
                break;
        }
        //ctlChart_1.PaletteName = "Nature Colors";
        objChart.bindData(
            e.Parameter.ToString().Substring(3),
            this.ctlDB_1,
            this.ctlChart_1);        
    }

}


