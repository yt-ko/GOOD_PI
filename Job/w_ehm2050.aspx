<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_8.master" AutoEventWireup="true"
    CodeFile="w_ehm2050.aspx.cs" Inherits="Job_w_ehm2050" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_ehm2050.js" type="text/javascript"></script>
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
    <div id="grdData_발생현황">
    </div>
    <div id="grdData_발생현황상세" style="padding-top: 10px;">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData_2" runat="Server">
    <form id="frmServer" runat="server">
    <div id="lyrChart_발생통계">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="210px" Width="670px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False" CrosshairEnabled="True">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" ValueDataMembersSerializable="value">
                    <viewserializable>
                        <cc1:PieSeriesView RuntimeExploding="False">
                        </cc1:PieSeriesView>
                    </viewserializable>
                    <labelserializable>
                        <cc1:PieSeriesLabel Font="맑은 고딕, 8pt" LineVisibility="True" Position="Inside" TextPattern="{A}: {V}">
                            <fillstyle>
                                <optionsserializable>
                                    <cc1:SolidFillOptions />
                                </optionsserializable>
                            </fillstyle>
                        </cc1:PieSeriesLabel>
                    </labelserializable>
                </cc1:Series>
            </seriesserializable>
            <diagramserializable>
                <cc1:SimpleDiagram>
                </cc1:SimpleDiagram>
            </diagramserializable>
            <seriestemplate>
                <ViewSerializable>
                    <cc1:PieSeriesView RuntimeExploding="False">
                    </cc1:PieSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    <cc1:PieSeriesLabel LineVisibility="True" TextPattern="{A} : {V}">
                        <fillstyle>
                            <optionsserializable>
                                <cc1:SolidFillOptions />
                            </optionsserializable>
                        </fillstyle>
                    </cc1:PieSeriesLabel>
                </LabelSerializable>
            </seriestemplate>
            <legend alignmenthorizontal="Right" font="맑은 고딕, 9pt"></legend>
            <fillstyle>
                <OptionsSerializable>
                    <cc1:SolidFillOptions></cc1:SolidFillOptions>
                </OptionsSerializable>
            </fillstyle>
        </dxchartsui:WebChartControl>
    </div>
    <div id="lyrChart_발생통계상세">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="255px" Width="670px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False" CrosshairEnabled="True">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" ValueDataMembersSerializable="value">
                    <viewserializable>
                        <cc1:SideBySideBarSeriesView ColorEach="True">
                        </cc1:SideBySideBarSeriesView>
                    </viewserializable>
                    <labelserializable>
                        <cc1:SideBySideBarSeriesLabel Font="맑은 고딕, 8.25pt" LineVisibility="True">
                            <fillstyle>
                                <optionsserializable>
                                    <cc1:SolidFillOptions />
                                </optionsserializable>
                            </fillstyle>
                        </cc1:SideBySideBarSeriesLabel>
                    </labelserializable>
                </cc1:Series>
            </seriesserializable>
            <diagramserializable>
                <cc1:XYDiagram>
                    <axisx title-alignment="Near" title-font="맑은 고딕, 9pt" title-text="" Title-Visibility="True" visibleinpanesserializable="-1">
                        <label angle="90" font="맑은 고딕, 8.25pt" />
                    </axisx>
                    <axisy title-alignment="Far" title-font="맑은 고딕, 9pt" title-text="" Title-Visibility="True" visibleinpanesserializable="-1">
                        <label font="맑은 고딕, 8.25pt" />
                    </axisy>
                </cc1:XYDiagram>
            </diagramserializable>
            <seriestemplate>
                <ViewSerializable>
                    <cc1:SideBySideBarSeriesView></cc1:SideBySideBarSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    <cc1:SideBySideBarSeriesLabel LineVisibility="True" TextPattern="{A}: {V}">
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
    <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
    <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
    </asp:SqlDataSource>
    </form>
</asp:Content>
