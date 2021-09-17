<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_qcm5010.aspx.cs" Inherits="Job_w_qcm5010" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css"
        rel="stylesheet" type="text/css" />

    <script src="../Lib/js/gw.com.DX.js" type="text/javascript"></script>

    <script src="js/w.qcm5010.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmServer" runat="server">
    <table border="0" width="100%" style="margin:0; padding:0;">
        <tr>
            <td>
                <div id="lyrChart_불량통계_1">
                    <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="240px" Width="600px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series" CrosshairEnabled="True">
                        <diagramserializable>
                <cc1:XYDiagram>
                    <axisx visibleinpanesserializable="-1">
                    </axisx>
                    <axisy visibleinpanesserializable="-1">
                    </axisy>
                </cc1:XYDiagram>
            </diagramserializable>
                        <seriestemplate argumentdatamember="category" synchronizepointoptions="False" valuedatamembersserializable="value" LegendTextPattern="{S}:{V}">
                <ViewSerializable>
                    
                <cc1:SideBySideBarSeriesView>
                </cc1:SideBySideBarSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    
                <cc1:SideBySideBarSeriesLabel LineVisibility="True" Font="Tahoma, 8.25pt" TextPattern="{S}:{V}"><fillstyle><optionsserializable><cc1:SolidFillOptions />
                    </optionsserializable>
                    </fillstyle>
                </cc1:SideBySideBarSeriesLabel>
                </LabelSerializable>
            </seriestemplate>
                        <legend font="Tahoma, 8.25pt"></legend>
                        <fillstyle>
                <OptionsSerializable>
                    <cc1:SolidFillOptions></cc1:SolidFillOptions>
                </OptionsSerializable>
            </fillstyle>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
            <td>
                <div id="lyrChart_불량통계_2">
                    <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="240px" Width="300px"
                        ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
                        ClientVisible="False">
                        <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                    <viewserializable>
                        <cc1:Pie3DSeriesView>
                        </cc1:Pie3DSeriesView>
                    </viewserializable>
                    <labelserializable>
                        <cc1:Pie3DSeriesLabel Font="Tahoma, 8.25pt" LineVisibility="True">
                            <fillstyle>
                                <optionsserializable>
                                    <cc1:SolidFillOptions />
                                </optionsserializable>
                            </fillstyle>
                        </cc1:Pie3DSeriesLabel>
                    </labelserializable>
                </cc1:Series>
            </seriesserializable>
                        <diagramserializable>
                <cc1:SimpleDiagram3D RotationMatrixSerializable="1;0;0;0;0;0.5;-0.866025403784439;0;0;0.866025403784439;0.5;0;0;0;0;1" 
                                ZoomPercent="120">
                </cc1:SimpleDiagram3D>
            </diagramserializable>
                        <seriestemplate LegendTextPattern="{A}:{V}">
                <ViewSerializable>
                    <cc1:SideBySideBarSeriesView></cc1:SideBySideBarSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    <cc1:SideBySideBarSeriesLabel LineVisibility="True" TextPattern="{A}:{V}">
                        <FillStyle>
                            <OptionsSerializable>
                                <cc1:SolidFillOptions></cc1:SolidFillOptions>
                            </OptionsSerializable>
                        </FillStyle>
                    </cc1:SideBySideBarSeriesLabel>
                </LabelSerializable>
            </seriestemplate>
                        <legend Visibility="False"></legend>
                        <fillstyle>
                <OptionsSerializable>
                    <cc1:SolidFillOptions></cc1:SolidFillOptions>
                </OptionsSerializable>
            </fillstyle>
                    </dxchartsui:WebChartControl>
                </div>
            </td>
        </tr>
    </table>
    <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
    </form>
    <div id="grdData_불량현황">
    </div>
</asp:Content>
