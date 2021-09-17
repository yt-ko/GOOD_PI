<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="EVL_5050.aspx.cs" Inherits="JOB_EVL_5050" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <style type="text/css" media="screen">
        th.ui-th-column div{
            height:auto !important;
        }
    </style>
    <script src="js/EVL_5050.js" type="text/javascript"></script>
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
<asp:Content ID="Content4" ContentPlaceHolderID="objContentControl" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="50%">
                <div id="lyrChart_1">
                    <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="280px" Width="580px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series" PaletteName="Office 2013" AutoLayout="True" CrosshairEnabled="False">
                        <DiagramSerializable>
                            <cc1:XYDiagram>
                                <AxisX VisibleInPanesSerializable="-1"></AxisX>
                                <AxisY VisibleInPanesSerializable="-1" interlaced="True" title-text="" title-visibility="Default">
                                    <visualrange auto="False" autosidemargins="False" maxvalueserializable="100" minvalueserializable="0" sidemarginsvalue="0" />
                                    <wholerange auto="False" autosidemargins="False" maxvalueserializable="100" minvalueserializable="0" sidemarginsvalue="0" />
                                </AxisY>
                            </cc1:XYDiagram>
                        </DiagramSerializable>

                        <legend alignmenthorizontal="Right" alignmentvertical="TopOutside" direction="LeftToRight" visibility="True"></legend>

                        <seriestemplate ArgumentDataMember="category" ValueDataMembersSerializable="value" ShowInLegend="True" SummaryFunction="AVERAGE([value])" labelsvisibility="True" legendtextpattern="{S}"> 
                            <viewserializable>
                                <cc1:SideBySideBarSeriesView ColorEach="True">
                                </cc1:SideBySideBarSeriesView>
                            </viewserializable>
                            <labelserializable>
                                <cc1:SideBySideBarSeriesLabel TextPattern="{V:f1}" ResolveOverlappingMode="Default">
                                </cc1:SideBySideBarSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Text="평점" />
                        </titles>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td width:50%>
                <div id="grdList_1">
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                &nbsp;
            </td>
        </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="50%">
                <div id="lyrChart_2">
                    <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="400px" Width="580px"
                        ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_2_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series" PaletteName="Office 2013" AutoLayout="True" CrosshairEnabled="True">
                        <diagramserializable>
                            <cc1:RadarDiagram DrawingStyle="Polygon">
                                <axisy>
                                    <label visible="False">
                                    </label>
                                    <visualrange auto="False" maxvalueserializable="1" minvalueserializable="0" />
                                    <wholerange auto="False" maxvalueserializable="1" minvalueserializable="0" />
                                </axisy>
                            </cc1:RadarDiagram>
                        </diagramserializable>
                        <legend alignmenthorizontal="Right" alignmentvertical="TopOutside" direction="LeftToRight" visibility="True"></legend>
                        <seriestemplate ArgumentDataMember="category" ValueDataMembersSerializable="value" SummaryFunction="AVERAGE([value])" labelsvisibility="True" legendtextpattern="{S}" tooltippointpattern="{S} : {A} : {V:0%}"> 
                            <viewserializable>
                                <cc1:RadarLineSeriesView>
                                    <linemarkeroptions size="8">
                                    </linemarkeroptions>
                                </cc1:RadarLineSeriesView>
                            </viewserializable>
                            <labelserializable>
                                <cc1:RadarPointSeriesLabel TextPattern="{V:0%}" ResolveOverlappingMode="Default">
                                </cc1:RadarPointSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Text="대분류 비교" />
                        </titles>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td width="50%">
                <div id="lyrChart_3">
                    <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="400px" Width="580px"
                        ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_3_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series" PaletteName="Office 2013" AutoLayout="True" CrosshairEnabled="True">
                        <diagramserializable>
                            <cc1:RadarDiagram DrawingStyle="Polygon">
                                <axisy>
                                    <label visible="False">
                                    </label>
                                    <visualrange auto="False" maxvalueserializable="1" minvalueserializable="0" />
                                    <wholerange auto="False" maxvalueserializable="1" minvalueserializable="0" />
                                </axisy>
                            </cc1:RadarDiagram>
                        </diagramserializable>
                        <legend alignmenthorizontal="Right" alignmentvertical="TopOutside" direction="LeftToRight" visibility="True"></legend>
                        <seriestemplate ArgumentDataMember="category" ValueDataMembersSerializable="value" SummaryFunction="AVERAGE([value])" labelsvisibility="True" legendtextpattern="{S}" tooltippointpattern="{S} : {A} : {V:0%}"> 
                            <viewserializable>
                                <cc1:RadarLineSeriesView>
                                    <linemarkeroptions size="8">
                                    </linemarkeroptions>
                                </cc1:RadarLineSeriesView>
                            </viewserializable>
                            <labelserializable>
                                <cc1:RadarPointSeriesLabel TextPattern="{V:0%}" ResolveOverlappingMode="Default">
                                </cc1:RadarPointSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Text="소분류 비교" />
                        </titles>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                &nbsp;
            </td>
        </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="884px">
                <div id="lyrChart_4">
                    <dxchartsui:WebChartControl ID="ctlChart_4" runat="server" Height="400px" Width="880px"
                        ClientInstanceName="ctlChart_4" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_4_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series" PaletteName="Office 2013" AutoLayout="True" CrosshairEnabled="False">
                        <DiagramSerializable>
                            <cc1:XYDiagram>
                                <AxisX VisibleInPanesSerializable="-1">
                                    <label angle="90">
                                    </label>
                                </AxisX>
                                <AxisY VisibleInPanesSerializable="-1" interlaced="True" title-text="" title-visibility="Default">
                                    <label textpattern="{V:0%}" visible="False">
                                    </label>
                                    <visualrange auto="False" autosidemargins="False" maxvalueserializable="1" minvalueserializable="0" sidemarginsvalue="0" />
                                    <wholerange auto="False" autosidemargins="False" maxvalueserializable="1" minvalueserializable="0" sidemarginsvalue="0" />
                                </AxisY>
                            </cc1:XYDiagram>
                        </DiagramSerializable>

                        <legend alignmenthorizontal="Right" alignmentvertical="TopOutside" direction="LeftToRight" visibility="True"></legend>

                        <seriestemplate ArgumentDataMember="category" ValueDataMembersSerializable="value" ShowInLegend="True" SummaryFunction="AVERAGE([value])" labelsvisibility="True" legendtextpattern="{S}" tooltipenabled="True" tooltippointpattern="{S} : {A} : {V:0%}"> 
                            <labelserializable>
                                <cc1:SideBySideBarSeriesLabel TextPattern="{V:0%}" ResolveOverlappingMode="Default">
                                </cc1:SideBySideBarSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Text="중분류" />
                        </titles>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td width="">
                <div id="grdList_2">
                </div>
            </td>
        </tr>
    </table>
    <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
</asp:Content>
