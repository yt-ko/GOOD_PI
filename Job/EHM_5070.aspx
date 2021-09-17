<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EHM_5070.aspx.cs" Inherits="JOB_EHM_5070" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM_5070.js" type="text/javascript"></script>
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
                <td width="100%" valign="top" style="padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_현황">
                    </div>
                </td>
                <td valign="middle" style="padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_통계">
                        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="487px" Width="880px"
                            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                            ClientVisible="False">
                            <SeriesSerializable>
                                <cc1:Series ArgumentDataMember="category" Name="Series 1"
                                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                                </cc1:Series>
                            </SeriesSerializable>
                            <Legend Visibility="False"></Legend>
                        </dxchartsui:WebChartControl>
                        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>"></asp:SqlDataSource>
                    </div>
                </td>
            </tr>
        </table>
    </form>
</asp:Content>
