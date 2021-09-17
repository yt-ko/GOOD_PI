<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_13.master" AutoEventWireup="true"
    CodeFile="QDM_5523.aspx.cs" Inherits="JOB_QDM_5523" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<%@ Register assembly="DevExpress.XtraCharts.v17.1" namespace="DevExpress.XtraCharts" tagprefix="cc2" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/QDM_5523.js" type="text/javascript"></script>
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
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_Main">
    </div>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_Sub">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentControl_1" runat="Server">
    <div id="lyrChart_Main">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="232px" Width="836px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False" SeriesDataMember="series" PaletteName="Mixed">
            <DiagramSerializable>
                <cc2:XYDiagram>
                    <secondaryaxesy>
                        <cc2:SecondaryAxisY AxisID="0" Name="Secondary AxisY" VisibleInPanesSerializable="-1">
                        </cc2:SecondaryAxisY>
                    </secondaryaxesy>
                </cc2:XYDiagram>
            </DiagramSerializable>
            <seriestemplate argumentdatamember="category" valuedatamembersserializable="value"></seriestemplate>
            <%--<titles><cc1:ChartTitle Font="Tahoma, 12pt" Text="설비 불량 지수" /></titles>--%>
        </dxchartsui:WebChartControl>
        <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
        </asp:SqlDataSource>
    </div>
</asp:Content>
