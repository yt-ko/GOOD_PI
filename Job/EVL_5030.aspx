<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="EVL_5030.aspx.cs" Inherits="JOB_EVL_5030" %>

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
    <script src="js/EVL_5030.js?ver=190729" type="text/javascript"></script>
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
    <div id="lyrChart_1">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="490px" Width="1166px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Office 2013" AutoLayout="True" CrosshairEnabled="True">
            <DiagramSerializable>
                <cc1:XYDiagram PaneLayoutDirection="Horizontal">
                    <AxisX VisibleInPanesSerializable="-1">
                    </AxisX>
                    <AxisY VisibleInPanesSerializable="-1" interlaced="True" title-text="" title-visibility="Default">
                        <visualrange auto="False" autosidemargins="False" maxvalueserializable="100" minvalueserializable="0" sidemarginsvalue="0" />
                        <wholerange auto="False" autosidemargins="False" maxvalueserializable="100" minvalueserializable="0" sidemarginsvalue="0" />
                    </AxisY>
                </cc1:XYDiagram>
            </DiagramSerializable>

            <legend alignmenthorizontal="Right" alignmentvertical="TopOutside" direction="LeftToRight" visibility="True"></legend>

            <seriestemplate ArgumentDataMember="category" ValueDataMembersSerializable="value" ShowInLegend="True" labelsvisibility="True" legendtextpattern="{S}"> </seriestemplate>
        </dxchartsui:WebChartControl>
    </div>
    <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
</asp:Content>
