<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_8.master" AutoEventWireup="true"
    CodeFile="w_qcm5032.aspx.cs" Inherits="Job_w_qcm5032" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1" Namespace="DevExpress.XtraCharts"
    TagPrefix="cc2" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.qcm5032.js" type="text/javascript"></script>
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
    <div id="lyrChart_발생통계" align="center">
        <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="470px" Width="660px"
            ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" OnCustomCallback="ctlChart_1_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" 
                    ValueDataMembersSerializable="value" SynchronizePointOptions="False">
                    <viewserializable>
                        <cc1:SideBySideBarSeriesView ColorEach="True">
                        </cc1:SideBySideBarSeriesView>
                    </viewserializable>
                    <labelserializable>
                        <cc1:SideBySideBarSeriesLabel Font="굴림, 8.25pt" LineVisibility="True">
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
                <cc1:XYDiagram Rotated="True">
                    <axisx visibleinpanesserializable="-1">
<Label Font="굴림, 8.25pt"></Label>

                    </axisx>
                    <axisy visibleinpanesserializable="-1">
<Label Font="굴림, 8.25pt"></Label>

                    </axisy>
                </cc1:XYDiagram>
            </diagramserializable>
            <seriestemplate>
                <ViewSerializable>
                    <cc1:PieSeriesView RuntimeExploding="False">
                    </cc1:PieSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    <cc1:PieSeriesLabel LineVisibility="True">
                        <fillstyle>
                            <optionsserializable>
                                <cc1:SolidFillOptions />
                            </optionsserializable>
                        </fillstyle>
                    </cc1:PieSeriesLabel>
                </LabelSerializable>
            </seriestemplate>
            <legend alignmenthorizontal="Right" font="Tahoma, 8.25pt" Visibility="False"></legend>
            <fillstyle>
                <OptionsSerializable>
                    <cc1:SolidFillOptions></cc1:SolidFillOptions>
                </OptionsSerializable>
            </fillstyle>
        </dxchartsui:WebChartControl>
    </div>
    <div id="lyrChart_발생통계상세">
        <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="200px" Width="670px"
            ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
            ClientVisible="False">
            <seriesserializable>
                <cc1:Series ArgumentDataMember="category" Name="Series 1" ValueDataMembersSerializable="value">
                    <viewserializable>
                        <cc1:SideBySideBarSeriesView ColorEach="True">
                        </cc1:SideBySideBarSeriesView>
                    </viewserializable>
                    <labelserializable>
                        <cc1:SideBySideBarSeriesLabel Font="굴림, 8.25pt" LineVisibility="True">
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
                    <axisx title-alignment="Near" title-font="굴림, 8.25pt" title-text="" Title-Visibility="True" visibleinpanesserializable="-1">
                        <Label Font="굴림, 8.25pt"></Label>
                    </axisx>
                    <axisy title-alignment="Far" title-font="굴림, 8.25pt" title-text="" Title-Visibility="True" visibleinpanesserializable="-1">
                        <Label Font="굴림, 8.25pt"></Label>
                    </axisy>
                </cc1:XYDiagram>
            </diagramserializable>
            <seriestemplate>
                <ViewSerializable>
                    <cc1:SideBySideBarSeriesView></cc1:SideBySideBarSeriesView>
                </ViewSerializable>
                <LabelSerializable>
                    <cc1:SideBySideBarSeriesLabel LineVisibility="True">
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
