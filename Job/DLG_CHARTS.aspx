<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_CHARTS.aspx.cs" Inherits="JOB_DLG_CHARTS" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG_CHARTS.js" type="text/javascript"></script>
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
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0; margin-top: 2px; padding: 0; table-layout: fixed; white-space: nowrap;">
        <tr>
            <td valign="top" style="padding-left: 5px; padding-right: 2px;">
                <form id="frmServer" runat="server">
                    <div id="lyrChart" align="center">
                        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="660px" Width="1230px"
                            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
                            <SeriesTemplate ArgumentDataMember="category" ValueDataMembersSerializable="value">
                            </SeriesTemplate>
                            <Titles>
                                <cc1:ChartTitle Font="Tahoma, 14pt" Text=" " />
                            </Titles>
                        </dxchartsui:WebChartControl>
                        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>"></asp:SqlDataSource>
                    </div>
                </form>
            </td>
        </tr>
    </table>




</asp:Content>
