<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_10.master" AutoEventWireup="true"
    CodeFile="w_sys2032.aspx.cs" Inherits="Job_w_sys2032" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SYS_NoticeEdit.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption_1" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu_1" runat="Server">
    <div id="lyrMenu_Top">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentOption_2" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentMenu_2" runat="Server">
    <div id="lyrMenu_FileA">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_1" runat="Server">
    <form id="frmData_MainA" action=""></form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_FileA"></div>
    <div id="lyrDown"></div>
    <form id="frmData_Memo" action=""></form>
    <form id="frmServer" runat="server"></form>
</asp:Content>
