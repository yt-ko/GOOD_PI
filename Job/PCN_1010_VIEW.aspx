<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="PCN_1010_VIEW.aspx.cs" Inherits="Job_PCN_1010_VIEW" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/PCN_1010_VIEW.js?ver=18073001" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="40%">
                <div id="lyrRemark2"></div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu"></div>
            </td>
        </tr>
    </table>
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
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
        <tr>
            <td style="width: 50%">
                <form id="frmData_MEMO1" action=""></form>
            </td>
            <td style="width: 50%">
                <form id="frmData_MEMO2" action=""></form>
            </td>
        </tr>
    </table>
    <form id="frmData_MEMO3" action=""></form>
    <form id="frmData_SUB" action=""></form>
    <div id="grdData_FILE"></div>
    <div id="lyrDown"></div>
</asp:Content>
