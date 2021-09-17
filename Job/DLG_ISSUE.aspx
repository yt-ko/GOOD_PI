<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_ISSUE.aspx.cs" Inherits="JOB_DLG_ISSUE" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG_ISSUE.js?190911" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_AS_발생정보" action="">
    </form>
    <form id="frmData_PO_발생정보" action="">
    </form>
    <form id="frmData_QD_발생정보" action="">
    </form>
    <div id="grdData_AS_발생내역">
    </div>
    <div id="grdData_PO_발생내역">
    </div>
    <div id="grdData_QD_발생내역">
    </div>
    <form id="frmData_AS_발생내용" action="">
    </form>
    <form id="frmData_PO_발생내용" action="">
    </form>
    <form id="frmData_QD_발생내용" action="">
    </form>
    <div id="grdData_AS_점검결과">
    </div>
    <div id="grdData_PO_점검결과">
    </div>
    <div id="grdData_QD_점검결과">
    </div>
    <div id="grdData_AS_조치내역">
    </div>
    <div id="grdData_PO_조치내역">
    </div>
    <div id="grdData_QD_조치내역">
    </div>
    <form id="frmData_조치내용" action="">
    </form>
    <div id="grdData_AS_교체내역">
    </div>
    <div id="grdData_PO_교체내역">
    </div>
    <div id="grdData_QD_교체내역">
    </div>
    <form id="frmData_교체내용" action="">
    </form>
    <form id="frmData_처리결과" action="">
    </form>
    <div id="grdData_첨부파일">
    </div>
    <div id="lyrDown">
    </div>
    <form id="frmData_상세메모" action="">
    </form>
</asp:Content>
