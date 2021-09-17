<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="SCM_8910.aspx.cs" Inherits="Job_SCM_8910" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SCM_8910.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_현황" style="width:100px">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentControl" runat="Server">
    <table>
        <tr>
            <td>
                <div id="lyrChart_현황" align="center" >
                    <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="350px" Width="1161px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                        ClientVisible="False" CrosshairEnabled="True" SeriesDataMember="series">
                        <SeriesSerializable>
                            <cc1:Series Name="자재납기Issue(건)" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value" CrosshairLabelPattern="{S} : {V}" LegendTextPattern="{G}:{A}">
                                <viewserializable>
                                    <cc1:StackedBarSeriesView>
                                    </cc1:StackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series Name="문제발생Issue(건)" SynchronizePointOptions="False" ArgumentDataMember="category" ValueDataMembersSerializable="value" CrosshairLabelPattern="{S} : {V}" LegendTextPattern="{G}:{A}">
                                <viewserializable>
                                    <cc1:StackedBarSeriesView>
                                    </cc1:StackedBarSeriesView>
                                </viewserializable>
                                <labelserializable>
                                    <cc1:StackedBarSeriesLabel Position="Auto" TextOrientation="TopToBottom">
                                    </cc1:StackedBarSeriesLabel>
                                </labelserializable>
                            </cc1:Series>
                            <cc1:Series ArgumentDataMember="category" Name="지연발생(시간)"
                                ValueDataMembersSerializable="value" SynchronizePointOptions="True" LabelsVisibility="True">
                                <viewserializable>
                                    <cc1:LineSeriesView ColorEach="False"></cc1:LineSeriesView>
                                </viewserializable>
                            </cc1:Series>
                        </SeriesSerializable>
                        <DiagramSerializable>
                            <cc1:XYDiagram>
                                <AxisX VisibleInPanesSerializable="-1" logarithmic="True" visibility="True">
                                    <label angle="45" font="맑은 고딕, 8pt">
                                    </label>
                                    <gridlines minorvisible="False" visible="True">
                                    </gridlines>
                                </AxisX>
                                <AxisY VisibleInPanesSerializable="-1" visibility="True">
                                    <label font="굴림체, 8pt"></label>
                                    <VisualRange AutoSideMargins="False"></VisualRange>
                                    <WholeRange AutoSideMargins="True"></WholeRange>                    <%-- Y축 최대값에 맞춰 세로 넓이 여유조정--%>
                                    <numericscaleoptions autogrid="true" gridspacing="30" />            <%-- Y축 value값 visible --%>
                                </AxisY>
                            </cc1:XYDiagram>
                        </DiagramSerializable>
                        <seriestemplate argumentdatamember="category">
                            <labelserializable>
                                <cc1:SideBySideBarSeriesLabel Font="굴림체, 8pt">
                                </cc1:SideBySideBarSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Font="굴림체, 14pt, style=Bold" Text="" Visibility="True" WordWrap="True" />
                        </titles>
                        <legend visibility="True" AlignmentHorizontal="Right" AlignmentVertical="Top"></legend>
                    </dxchartsui:WebChartControl>
                    <%--<dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="260px" Width="1173px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series">
                        <seriestemplate argumentdatamember="category" valuedatamembersserializable="value">
                        </seriestemplate>
                    </dxchartsui:WebChartControl>--%>
                </div>
                <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                </asp:SqlDataSource>
           </td>
        </tr>
        <tr>
            <td>
                <div id="grdData_Sub1" style="width:1175px">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="grdData_Sub2" style="width:1175px">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
