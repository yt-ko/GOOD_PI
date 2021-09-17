<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EOM_5180.aspx.cs" Inherits="JOB_EOM_5180" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EOM_5180.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark"></div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
 <form id="frmServer" runat="server">
   <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
        margin-top: 2px; padding: 0; white-space: nowrap;">
    <tr>
   <td width="300" valign="top" style="padding-left: 5px; padding-right: 5px;">
  <div id="grdData_Main"></div>
    </div>
  </td>
 <td valign="top" style="padding-left: 5px; padding-right: 5px;">
   <div id="lyrChart_Main">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="250px" Width="825px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
</td>
  </tr>
<tr>
   <td width="300" valign="top" style="padding-left: 5px; padding-right: 5px;">
      <div id="grdData_Sub"></div>
   </td>
    <td valign="top" style="padding-left: 5px; padding-right: 5px;">
         <div id="lyrChart_Sub">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="250px" Width="825px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
    </td>
</tr>
<tr>
     <td width="300" valign="top" style="padding-left: 5px; padding-right: 5px;">
         <div id="grdData_3"></div>
     </td>
     <td valign="top" style="padding-left: 5px; padding-right: 5px;">
          <div id="lyrChart_3">
        <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="250px" Width="825px"
            ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_3" OnCustomCallback="ctlChart_3_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_3" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
     </td>
</tr>
<tr>
  <td width="300" valign="top" style="padding-left: 5px; padding-right: 5px;">
   <div id="grdData_4"></div>
  </td>
   <td valign="top" style="padding-left: 5px; padding-right: 5px;">
   <div id="lyrChart_4">
        <dxchartsui:WebChartControl ID="ctlChart_4" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_4" DataSourceID="ctlDB_4" OnCustomCallback="ctlChart_4_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_4" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
   </td>
</tr>
<tr>
     <td width="300" valign="top" style="padding-left: 5px; padding-right: 5px;">
          <div id="grdData_5"></div>
    </td>
    <td valign="top" style="padding-left: 5px; padding-right: 5px;">
           <div id="lyrChart_5">
        <dxchartsui:WebChartControl ID="ctlChart_5" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_5" DataSourceID="ctlDB_5" OnCustomCallback="ctlChart_5_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_5" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
    </td>
</tr>
<tr>
    <td width="300" valign="top" style="padding-left: 5px; padding-right: 5px;">
         <div id="grdData_6"></div>
    </td>
    <td valign="top" style="padding-left: 5px; padding-right: 5px;">
        <div id="lyrChart_6">
        <dxchartsui:WebChartControl ID="ctlChart_6" runat="server" Height="200px" Width="825px"
            ClientInstanceName="ctlChart_6" DataSourceID="ctlDB_6" OnCustomCallback="ctlChart_6_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"> </seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_6" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
    </td>
</tr>
       </table>
    </form>
</asp:Content>

