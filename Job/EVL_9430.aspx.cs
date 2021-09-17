using DevExpress.XtraCharts;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;

public partial class JOB_EVL_9430 : System.Web.UI.Page
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

        try
        {
            NameValueCollection lstParam = objChart.parseData(e.Parameter.ToString());
            List<EvlGroup> EvlGroup = getEvlGroup(HttpUtility.UrlDecode(lstParam["arg_evl_no"]), HttpUtility.UrlDecode(lstParam["arg_dept_area"]));
            XYDiagram d = (XYDiagram)this.ctlChart_1.Diagram;
            d.AxisY.ConstantLines.Clear();
            d.Panes.Clear();
            d.SecondaryAxesX.Clear();
            d.SecondaryAxesY.Clear();
            d.AxisX.Label.Angle = 90;
            //d.DefaultPane.EnableAxisXScrolling = DevExpress.Utils.DefaultBoolean.True;

            foreach (Series s in this.ctlChart_1.Series)
            {
                int evl_group_idx = 0;
                for (int i = 0; i < EvlGroup.Count; i++)
                {
                    if (EvlGroup[i].evl_group_nm.Equals(s.Name))
                    {
                        evl_group_idx = i;
                        break;
                    }
                }

                s.Label.TextPattern = "{V:#,#}";
                s.DataFilters.Clear();
                s.DataFilters.Add(new DataFilter("str01", "System.String", DataFilterCondition.Equal, EvlGroup[evl_group_idx].evl_group));
                s.Label.ResolveOverlappingMode = ResolveOverlappingMode.Default;

                BarSeriesView v = (BarSeriesView)s.View;
                v.Transparency = objChart.transparancy;
                if (evl_group_idx > 0)
                {
                    XYDiagramPane p = d.Panes[d.Panes.Add(new XYDiagramPane())];
                    //p.EnableAxisXScrolling = d.DefaultPane.EnableAxisXScrolling;
                    v.Pane = p;

                    SecondaryAxisX x = d.SecondaryAxesX[d.SecondaryAxesX.Add(new SecondaryAxisX())];
                    v.AxisX = x;
                    x.Alignment = d.AxisX.Alignment;
                    x.Label.Angle = d.AxisX.Label.Angle;

                    SecondaryAxisY y = d.SecondaryAxesY[d.SecondaryAxesY.Add(new SecondaryAxisY())];
                    v.AxisY = y;
                    y.Alignment = AxisAlignment.Near;
                    y.WholeRange.Auto = d.AxisY.WholeRange.Auto;
                    y.WholeRange.MaxValue = d.AxisY.WholeRange.MaxValue;
                    y.WholeRange.MinValue = d.AxisY.WholeRange.MinValue;
                    y.WholeRange.SideMarginsValue = d.AxisY.WholeRange.SideMarginsValue;
                    y.VisualRange.Auto = d.AxisY.VisualRange.Auto;
                    y.VisualRange.MaxValue = d.AxisY.VisualRange.MaxValue;
                    y.VisualRange.MinValue = d.AxisY.VisualRange.MinValue;
                    y.VisualRange.SideMarginsValue = d.AxisY.VisualRange.SideMarginsValue;
                    y.Interlaced = d.AxisY.Interlaced;

                    y.ConstantLines.Add(cl(EvlGroup[evl_group_idx].avg_point));
                }
                else
                {
                    d.AxisY.ConstantLines.Add(cl(EvlGroup[evl_group_idx].avg_point));
                }
            }
        }
        catch
        {
            return;
        }
    }

    protected ConstantLine cl(decimal val)
    {
        ConstantLine cl = new ConstantLine();
        cl.AxisValue = val;
        cl.Color = System.Drawing.Color.Red;
        cl.LineStyle.DashStyle = DashStyle.Dash;
        cl.ShowBehind = false;
        cl.ShowInLegend = false;
        cl.Title.Alignment = ConstantLineTitleAlignment.Far;
        if (val > 92)
            cl.Title.ShowBelowLine = true;
        else
            cl.Title.ShowBelowLine = false;
        cl.Title.Text = string.Format("평균: {0:F0}", val);
        cl.Title.TextColor = System.Drawing.Color.Red;
        return cl;
    }

    protected List<EvlGroup> getEvlGroup(string evl_no, string dept_area)
    {
        List<EvlGroup> row = new List<EvlGroup>();
        using (SqlConnection objCon = new SqlConnection(ConfigurationManager.ConnectionStrings["PLMDB"].ConnectionString))
        {
            objCon.Open();
            string sSQL = string.Format("SELECT str01                                AS  evl_group\n" +
                                        "     , MAX(series)                          AS  evl_group_nm\n" +
                                        "     , ROW_NUMBER() OVER(ORDER BY MIN(seq)) AS  seq\n" +
                                        "     , AVG(value)                           AS  avg_point\n" +
                                        "  FROM dbo.fn_getChartQMS_EVL('EVL_GROUP', '{0}', DEFAULT, DEFAULT, DEFAULT, DEFAULT, '{1}')\n" +
                                        " WHERE value IS NOT NULL\n" +
                                        "GROUP BY str01", evl_no, dept_area);
            using (SqlDataReader objDr = (new cDBQuery(ruleQuery.INLINE, sSQL)).retrieveQuery(objCon))
            {
                while (objDr.Read())
                {
                    row.Add(new EvlGroup
                    {
                        evl_group = objDr["evl_group"].ToString(),
                        evl_group_nm = objDr["evl_group_nm"].ToString(),
                        seq = Convert.ToInt16(objDr["seq"]),
                        avg_point = Convert.ToDecimal(objDr["avg_point"])
                    });
                }
            }
            objCon.Close();
        }
        return row;
    }

    protected class EvlGroup
    {
        public string evl_group { get; set; }
        public string evl_group_nm { get; set; }
        public int seq { get; set; }
        public decimal avg_point { get; set; }
    }

}
