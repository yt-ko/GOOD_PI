<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="EVL_9420.aspx.cs" Inherits="JOB_EVL_9420" %>

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
    <script src="js/EVL_9420.js" type="text/javascript"></script>
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
            <td width="400px">
                <div id="grdList_1">
                </div>
            </td>
            <td width="">
    <div id="lyrChart_통계">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="494px" Width="770px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Office 2013" AutoLayout="True" CrosshairEnabled="True">
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
                <labelserializable>
                    <cc1:SideBySideBarSeriesLabel TextPattern="{V:f1}" ResolveOverlappingMode="Default">
                    </cc1:SideBySideBarSeriesLabel>
                </labelserializable>
            </seriestemplate>
            <titles>
                <cc1:ChartTitle Text="장비군별 평가 비교" />
            </titles>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
            </td>
        </tr>
    </table>
</asp:Content>
