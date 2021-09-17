<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Control_7.master" AutoEventWireup="true"
    CodeFile="SPC_3010_TEST.aspx.cs" Inherits="JOB_SPC_3010_TEST" %>

<%@ Register Assembly="DevExpress.XtraCharts.v17.1.Web, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts.Web" TagPrefix="dxchartsui" %>
<%@ Register Assembly="DevExpress.XtraCharts.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.XtraCharts" TagPrefix="cc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SPC_3010_TEST.js" type="text/javascript"></script>
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
<asp:Content ID="Content6" ContentPlaceHolderID="objContentControl" runat="Server">
    <table>
        <tr>
            <td>
                <div id="grdData_현황" style="height: 250px; width: 100%">
                </div>
            </td>
            <td>
                <div id="lyrChart_통계">
                    <dxchartsui:WebChartControl ID="ctlChart_1" runat="server" Height="250px" Width="800px"
                        ClientInstanceName="ctlChart_1" DataSourceID="ctlDB_1" 
                        OnCustomCallback="ctlChart_1_CustomCallback" SeriesDataMember="series" 
                        PaletteName="Palette 1" ClientVisible="False" CrosshairEnabled="True">
                        <DiagramSerializable>
                            <cc1:XYDiagram PaneDistance="2">
                                <axisx visibleinpanesserializable="-1">
                                    <tickmarks minorvisible="False" />
                                    <WholeRange auto="False" maxvalueserializable="25" minvalueserializable="1" />
                                    <VisualRange Auto="False" MinValueSerializable="1" MaxValueSerializable="25" />
                                </axisx>
                                <axisy visibleinpanesserializable="-1">
                                    <constantlines>
                                        <cc1:ConstantLine AxisValueSerializable="1.2" Color="DarkGreen" LegendText="CL" 
                                            Name="Constant Line UCL" ShowBehind="True" Title-Text="UCL" 
                                            Title-Alignment="Far">
                                        </cc1:ConstantLine>
                                        <cc1:ConstantLine AxisValueSerializable="1" Color="Blue" LegendText="CL" 
                                            Name="Constant Line CL" Title-Text="CL">
                                            <linestyle dashstyle="Dash" thickness="2" />
            <LineStyle Thickness="2" DashStyle="Dash"></LineStyle>
                                        </cc1:ConstantLine>
                                        <cc1:ConstantLine AxisValueSerializable="0.8" Color="DarkGreen" LegendText="LCL" 
                                            Name="Constant Line LCL" Title-Text="LCL" Title-Alignment="Far">
                                        </cc1:ConstantLine>
                                        <cc1:ConstantLine AxisValueSerializable="1.4" Name="Constant Line USL" 
                                            Title-Text="USL" Color="Red">
                                            <linestyle dashstyle="Solid" thickness="2" />
            <LineStyle Thickness="2" DashStyle="Solid"></LineStyle>
                                        </cc1:ConstantLine>
                                        <cc1:ConstantLine AxisValueSerializable="0.6" Name="Constant Line LSL" 
                                            Title-Text="LSL" Color="Red">
                                            <LineStyle Thickness="2" DashStyle="Solid"></LineStyle>
                                        </cc1:ConstantLine>
                                    </constantlines>
                                    <WholeRange auto="False" maxvalueserializable="2" minvalueserializable="0"  />
                                    <VisualRange Auto="False" MinValueSerializable="0" MaxValueSerializable="2" />
                                </axisy>
                            </cc1:XYDiagram>
            </DiagramSerializable>

            <FillStyle><OptionsSerializable>
            <cc1:SolidFillOptions></cc1:SolidFillOptions>
            </OptionsSerializable>
            </FillStyle>

                        <legend Visibility="False"></legend>

                        <seriestemplate argumentdatamember="category" valuedatamembersserializable="value" LabelsVisibility="False">
                            <ViewSerializable>

            <cc1:LineSeriesView><linemarkeroptions color="DarkRed" size="12"></linemarkeroptions></cc1:LineSeriesView></ViewSerializable>
                            <labelserializable>
                                <cc1:PointSeriesLabel LineVisibility="True">
                                    <fillstyle>
                                        <optionsserializable>
                                            <cc1:SolidFillOptions />
                                        </optionsserializable>
                                    </fillstyle>
                                </cc1:PointSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Text="Xbar Chart" />
                        </titles>
                        <palettewrappers>
                            <dxchartsui:PaletteWrapper Name="Palette 1" ScaleMode="Repeat">
                                <palette>
                                    <cc1:PaletteEntry Color="255, 128, 0" Color2="255, 128, 0" />
                                </palette>
                            </dxchartsui:PaletteWrapper>
                        </palettewrappers>
            <ClientSideEvents ObjectSelected="function Chart1Selected(s, e) {
	            processClientObjectSelected(s, e);
            }
            ">
            </ClientSideEvents>
                    </dxchartsui:WebChartControl>
                    <asp:SqlDataSource ID="ctlDB_1" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                    </asp:SqlDataSource>
                </div>
            </td>
        </tr>
        <tr>
            <td rowspan="2">
                <div id="grdData_상세현황" style="height: 550px; width: 100%">
                </div>
            </td>
            <td>
                <div id="lyrChart_통계2">
                    <dxchartsui:WebChartControl ID="ctlChart_2" runat="server" Height="265px" Width="800px"
                        ClientInstanceName="ctlChart_2" DataSourceID="ctlDB_2" OnCustomCallback="ctlChart_2_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series" PaletteName="Palette 1" CrosshairEnabled="True">
                        <DiagramSerializable>
            <cc1:XYDiagram>
            <AxisX VisibleInPanesSerializable="-1">
                <Tickmarks MinorVisible="False"></Tickmarks>
                <WholeRange auto="False" maxvalueserializable="25" minvalueserializable="1" />
            </AxisX>
            <AxisY VisibleInPanesSerializable="-1">
                <constantlines>
                    <cc1:ConstantLine AxisValueSerializable="0.16" Color="DarkGreen" LegendText="UCL" 
                        Name="Constant Line UCL" Title-Text="UCL">
                        <LineStyle Thickness="2"></LineStyle>
                    </cc1:ConstantLine>
                    <cc1:ConstantLine AxisValueSerializable="0.08" Color="Blue" LegendText="CL" 
                        Name="Constant Line CL" Title-Text="CL">
                        <LineStyle DashStyle="Dash" Thickness="2"></LineStyle>
                    </cc1:ConstantLine>
                </constantlines>
                <WholeRange auto="False" maxvalueserializable="0.18" minvalueserializable="0" />
            </AxisY>
            </cc1:XYDiagram>
            </DiagramSerializable>
            <FillStyle><OptionsSerializable>
            <cc1:SolidFillOptions></cc1:SolidFillOptions>
            </OptionsSerializable>
            </FillStyle>
                        <legend Visibility="False"></legend>
                        <seriestemplate argumentdatamember="category" valuedatamembersserializable="value" LabelsVisibility="False">
                            <ViewSerializable>
                                <cc1:LineSeriesView>
                                    <linemarkeroptions color="Red" kind="Pentagon" size="12">
                                    </linemarkeroptions>
                                </cc1:LineSeriesView>
            </ViewSerializable>
            <LabelSerializable>
                <cc1:PointSeriesLabel LineVisibility="True">
                    <fillstyle>
                        <optionsserializable>
                            <cc1:SolidFillOptions />
                        </optionsserializable>
                    </fillstyle>
                </cc1:PointSeriesLabel>
            </LabelSerializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Text="R Chart" />
                            <cc1:ChartTitle Alignment="Far" Font="Tahoma, 9.75pt" Text="최대값-최소값 (R)범위" />
                        </titles>
                        <palettewrappers>
                            <dxchartsui:PaletteWrapper Name="Palette 1" ScaleMode="Repeat">
                                <palette>
                                    <cc1:PaletteEntry Color="Olive" Color2="Olive" />
                                </palette>
                            </dxchartsui:PaletteWrapper>
                        </palettewrappers>
                        <clientsideevents objectselected="function(s, e) {
	            processClientObjectSelected(s, e);
            }" />

            <ClientSideEvents ObjectSelected="function(s, e) {
	            processClientObjectSelected(s, e);
            }"></ClientSideEvents>
                    </dxchartsui:WebChartControl>
                    <asp:SqlDataSource ID="ctlDB_2" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                    </asp:SqlDataSource>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrChart_통계3">
                    <dxchartsui:WebChartControl ID="ctlChart_3" runat="server" Height="250px" Width="800px"
                        ClientInstanceName="ctlChart_3" DataSourceID="ctlDB_3" OnCustomCallback="ctlChart_3_CustomCallback"
                        ClientVisible="False" SeriesDataMember="series" PaletteName="Office" CrosshairEnabled="True">
                        <DiagramSerializable>
                            <cc1:XYDiagram PaneDistance="2">
                                <axisx visibleinpanesserializable="-1">
                                    <Tickmarks MinorVisible="False"></Tickmarks>
                                    <constantlines>
                                        <cc1:ConstantLine AxisValueSerializable="A" Color="Red" LegendText="USL" 
                                            Name="Constant Line USL" Title-Text="LSL">
                                            <LineStyle DashStyle="Solid"></LineStyle>
                                        </cc1:ConstantLine>
                                        <cc1:ConstantLine AxisValueSerializable="C" Color="Blue" 
                                            Name="Constant Line SL" Title-Text="Norminal" Title-Visible="False">
                                            <LineStyle DashStyle="Dash"></LineStyle>
                                        </cc1:ConstantLine>
                                        <cc1:ConstantLine AxisValueSerializable="E" Color="Red" 
                                            Name="Constant Line LSL" Title-Text="USL">
                                            <LineStyle DashStyle="Solid"></LineStyle>
                                        </cc1:ConstantLine>
                                    </constantlines>
                                    <Label Angle="270"></Label>
                                    <VisualRange Auto="False" MinValueSerializable="1" MaxValueSerializable="25"></VisualRange>
                                    <WholeRange Auto="False" MinValueSerializable="1" MaxValueSerializable="25"></WholeRange>
                                </axisx>
                                <axisy visibleinpanesserializable="-1">
                                    <VisualRange Auto="False" MinValueSerializable="0" MaxValueSerializable="2"></VisualRange>
                                    <WholeRange Auto="False" MinValueSerializable="0" MaxValueSerializable="2"></WholeRange>
                                </axisy>
                            </cc1:XYDiagram>
            </DiagramSerializable>

            <FillStyle><OptionsSerializable>
            <cc1:SolidFillOptions></cc1:SolidFillOptions>
            </OptionsSerializable>
            </FillStyle>

                        <legend Visibility="False"></legend>

                        <seriestemplate argumentdatamember="category" valuedatamembersserializable="value" argumentscaletype="Numerical" LabelsVisibility="False">
                            <ViewSerializable>

                                <cc1:SplineSeriesView>
                                    <linemarkeroptions color="DarkRed" size="4" />
                                </cc1:SplineSeriesView>
                            </ViewSerializable>
                            <labelserializable>
                                <cc1:PointSeriesLabel LineVisibility="True">
                                    <fillstyle>
                                        <optionsserializable>
                                            <cc1:SolidFillOptions />
                                        </optionsserializable>
                                    </fillstyle>
                                </cc1:PointSeriesLabel>
                            </labelserializable>
                        </seriestemplate>
                        <titles>
                            <cc1:ChartTitle Text="정규분포도" />
                        </titles>
                    </dxchartsui:WebChartControl>
                    <asp:SqlDataSource ID="ctlDB_3" runat="server" ConnectionString="<%$ ConnectionStrings:PLMDB %>">
                    </asp:SqlDataSource>
                </div>
            </td>
        </tr>
    </table>
    
</asp:Content>

