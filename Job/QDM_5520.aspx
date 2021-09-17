<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="QDM_5520.aspx.cs" Inherits="JOB_QDM_5520" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/QDM_5520.js" type="text/javascript"></script>
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
    <form id="frmServer" runat="server">
        <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0; margin-top: 2px; padding: 0; white-space: nowrap;">
            <tr>
                <td valign="middle" style="padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_1">
                        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="270px" Width="550px"
                            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
                            <SeriesTemplate ArgumentDataMember="category" ValueDataMembersSerializable="value">
                            </SeriesTemplate>
                            <Titles>
                                <cc1:ChartTitle Font="Tahoma, 12pt" Text="VOC 접수 현황 (건)" />
                            </Titles>
                        </dxchartsui:WebChartControl>
                        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>"></asp:SqlDataSource>
                    </div>
                </td>
                <td valign="middle" style="padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_2">
                        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="270px" Width="550px"
                            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
                            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
                            <SeriesTemplate ArgumentDataMember="category" ValueDataMembersSerializable="value">
                            </SeriesTemplate>
                            <Titles>
                                <cc1:ChartTitle Font="Tahoma, 12pt" Text="Top3 불량 현황 (건)" />
                            </Titles>
                        </dxchartsui:WebChartControl>
                        <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>"></asp:SqlDataSource>
                    </div>
                </td>
            </tr>
            <tr>
                <td valign="middle" style="padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_3">
                        <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="270px" Width="550px"
                            ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_3" OnCustomCallback="ctlChart_3_CustomCallback"
                            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
                            <DiagramSerializable>
                                <cc1:XYDiagram>
                                    <SecondaryAxesY>
                                        <cc1:SecondaryAxisY AxisID="0" Name="Secondary AxisY" VisibleInPanesSerializable="-1">
                                            <VisualRange AutoSideMargins="True" />
                                        </cc1:SecondaryAxisY>
                                    </SecondaryAxesY>
                                </cc1:XYDiagram>
                            </DiagramSerializable>
                            <SeriesTemplate ArgumentDataMember="category" ValueDataMembersSerializable="value"></SeriesTemplate>
                            <Titles>
                                <cc1:ChartTitle Font="Tahoma, 12pt" Text="설비 불량 지수 (%)" />
                            </Titles>
                        </dxchartsui:WebChartControl>
                        <asp:SqlDataSource ID="ctlDB_3" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>"></asp:SqlDataSource>
                    </div>
                </td>
                <td valign="middle" style="padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_4">
                        <dxchartsui:WebChartControl ID="ctlChart_4" runat="server" Height="270px" Width="550px"
                            ClientInstanceName="ctlChart_4" DataSourceID="ctlDB_4" OnCustomCallback="ctlChart_4_CustomCallback"
                            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
                            <SeriesTemplate ArgumentDataMember="category" ValueDataMembersSerializable="value"></SeriesTemplate>
                            <Titles>
                                <cc1:ChartTitle Font="Tahoma, 12pt" Text="설비 다운 지수 (%)" />
                            </Titles>
                        </dxchartsui:WebChartControl>
                        <asp:SqlDataSource ID="ctlDB_4" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>"></asp:SqlDataSource>
                    </div>
                </td>
            </tr>
            <tr>
                <td width="50%" valign="top" style="padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_2">
                    </div>
                </td>
                <td width="50%" valign="top" style="padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_1">
                    </div>
                </td>
            </tr>
            <tr>
                <td width="50%" valign="top" style="padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_3">
                    </div>
                </td>
                <td width="50%" valign="top" style="padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_4">
                    </div>
                </td>
            </tr>

        </table>
    </form>

</asp:Content>


