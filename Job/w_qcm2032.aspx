<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_qcm2032.aspx.cs" Inherits="Job_w_qcm2032" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_qcm2032.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_발생정보">
    </div>
    <form id="frmData_AS발생정보" action="">
    </form>
    <form id="frmData_제조발생정보" action="">
    </form>
    <div id="grdData_AS발생내역">
    </div>
    <div id="grdData_제조발생내역">
    </div>
    <form id="frmData_발생현상상세" action="">
    </form>
    <div id="grdData_AS조치내역">
    </div>
    <div id="grdData_제조조치내역">
    </div>
    <form id="frmData_조치내역상세" action="">
    </form>
    <div id="grdData_AS교체PART">
    </div>
    <div id="grdData_제조교체PART">
    </div>
    <form id="frmData_교체내역상세" action="">
    </form>
    <form id="frmData_처리결과" action="" style="margin-top: 4px;">
    </form>
    <div id="grdData_첨부파일">
    </div>
    <div id="lyrDown">
    </div>
    <form id="frmData_상세메모" action="" style="margin-top: 4px">
    </form>
</asp:Content>
