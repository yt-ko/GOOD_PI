<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Job_1.master" AutoEventWireup="true"
    CodeFile="w_iehm210.aspx.cs" Inherits="Job_w_iehm210" %>

<%@ Register Assembly="DevExpress.Web.ASPxHtmlEditor.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxHtmlEditor" TagPrefix="dx" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">

    <script src="../Lib/js/gw.com.DX.js" type="text/javascript"></script>
    <script src="js/w_iehm210.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_발생정보">
    </div>
    <div id="lyrMenu_2" align="right">
    </div>
    <div id="grdData_발생내역">
    </div>
    <form id="frmData_발생현상상세" action="">
    </form>
    <div id="lyrMenu_3" align="right">
    </div>
    <div id="grdData_조치내역">
    </div>
    <form id="frmData_조치내역상세" action="">
    </form>
    <div id="lyrMenu_4" align="right">
    </div>
    <div id="grdData_교체PART">
    </div>
    <form id="frmData_교체내역상세" action="">
    </form>
    <div id="lyrMenu_5" align="right">
    </div>
    <div id="grdData_첨부파일">
    </div>
    <form id="frmData_상세메모" action="">
    </form>
    <form id="frmControl" runat="server">
    <div id="ctlData_상세메모">
        <dx:ASPxHtmlEditor ID="ASPxHtmlEditor1" runat="server" Width="100%" ClientInstanceName="ctrl_memo">
            <ClientSideEvents HtmlChanged="gw_com_DX.event_htmlchanged" />
        </dx:ASPxHtmlEditor>
    </div>
    </form>
</asp:Content>
