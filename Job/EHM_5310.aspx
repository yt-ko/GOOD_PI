<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EHM_5310.aspx.cs" Inherits="JOB_EHM_5310" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM_5310.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmView" action=""></form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark"></div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmServer" runat="server">
        <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
            margin-top: 2px; padding: 0; white-space: nowrap;">
            <tr>
                <td width="50%" valign="top" style="padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_분류1"></div>
                </td>
                <td valign="middle" style="padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_분류1">
                        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="250px" Width="340px"
                            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                            ClientVisible="False">
                            <seriesserializable>
                                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                                </cc1:Series>
                            </seriesserializable>
                            <legend Visibility="False"></legend>
                        </dxchartsui:WebChartControl>
                        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                        </asp:SqlDataSource>
                    </div>
                </td>
                <td width="50%" valign="top" style="padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_분류2"></div>
                </td>
                <td valign="middle" style="padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_분류2">
                        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="250px" Width="340px"
                            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
                            ClientVisible="False">
                            <seriesserializable>
                                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                                </cc1:Series>
                            </seriesserializable>
                            <legend Visibility="False"></legend>
                        </dxchartsui:WebChartControl>        
                        <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                        </asp:SqlDataSource>
                    </div>
                </td>
            </tr>
            <tr>
                <td width="50%" valign="top" style="padding-top: 8px; padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_분류3"></div>
                </td>
                <td valign="middle" style="padding-top: 8px; padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_분류3">
                        <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="350px" Width="340px"
                            ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_3" OnCustomCallback="ctlChart_3_CustomCallback"
                            ClientVisible="False">
                            <seriesserializable>
                                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                                </cc1:Series>
                            </seriesserializable>
                            <legend Visibility="False"></legend>
                        </dxchartsui:WebChartControl>        
                        <asp:SqlDataSource ID="ctlDB_3" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                        </asp:SqlDataSource>
                    </div>
                </td>
                <td width="50%" valign="top" style="padding-top: 8px; padding-left: 5px; padding-right: 2px;">
                    <div id="grdData_분류4"></div>
                </td>
                <td valign="middle" style="padding-top: 8px; padding-left: 2px; padding-right: 5px;">
                    <div id="lyrChart_분류4">
                        <dxchartsui:WebChartControl ID="ctlChart_4" runat="server" Height="350px" Width="340px"
                            ClientInstanceName="ctlChart_4" DataSourceID="ctlDB_4" OnCustomCallback="ctlChart_4_CustomCallback"
                            ClientVisible="False">
                            <seriesserializable>
                                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                                </cc1:Series>
                            </seriesserializable>
                            <legend Visibility="False"></legend>
                        <ClientSideEvents ObjectSelected="function(s, e) { processClientObjectSelected(s, e); }"></ClientSideEvents>
                        </dxchartsui:WebChartControl>        
                        <asp:SqlDataSource ID="ctlDB_4" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                        </asp:SqlDataSource>
                    </div>
                </td>
            </tr>
        </table>
        </form>
</asp:Content>
