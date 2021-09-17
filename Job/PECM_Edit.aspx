<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="PECM_Edit.aspx.cs" Inherits="Job_PECM_Edit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/PECM_Edit.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_MAIN" action=""></form>
    <div id="lyrMenu_SUB" align="right"></div>
    <div id="grdData_SUB"></div>
    <form id="frmData_MAIN2" action=""></form>
    <div id="lyrMenu_ALARM" align="right"></div>
    <div id="grdData_ALARM"></div>
    <div id="lyrMenu_DOC" align="right"></div>
    <div id="grdData_DOC"></div>
    <div id="lyrDown"></div>
</asp:Content>
