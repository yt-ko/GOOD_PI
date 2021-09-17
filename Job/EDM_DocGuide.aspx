<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EDM_DocGuide.aspx.cs" Inherits="Job_EDM_DocGuide" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EDM_DocGuide.js?ver=18073001" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
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
    <div id="lyrTab">
        <div id="lyrTab_1">
            <div id="lyrMenu_List" align="right"></div>
            <div id="grdList_MAIN"></div>
        </div>
        <div id="lyrTab_2">
            <div id="lyrMenu_Edit" align="right"></div>
            <form id="frmData_MAIN" action=""></form>
            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
                <tr>
                    <td style="width: 50%" colspan="2">
                        <form id="frmData_TitleA" action=""></form>
                    </td>
                    <td style="width: 50%" colspan="2">
                        <form id="frmData_TitleB" action=""></form>
                    </td>
                </tr>
                <tr>
                    <td style="width: 25%">
                        <form id="frmData_MemoA1" action=""></form>
                    </td>
                    <td style="width: 25%">
                        <form id="frmData_TextA1" action=""></form>
                    </td>
                    <td style="width: 25%">
                        <form id="frmData_MemoB1" action=""></form>
                    </td>
                    <td style="width: 25%">
                        <form id="frmData_TextB1" action=""></form>
                    </td>
                </tr>
                <tr>
                    <td style="width: 25%">
                        <form id="frmData_MemoA2" action=""></form>
                    </td>
                    <td style="width: 25%">
                        <form id="frmData_TextA2" action=""></form>
                    </td>
                    <td style="width: 25%">
                        <form id="frmData_MemoB2" action=""></form>
                    </td>
                    <td style="width: 25%">
                        <form id="frmData_TextB2" action=""></form>
                    </td>
                </tr>
            </table>
            <div id="lyrMenu_File" align="right"></div>
            <div id="grdData_FILE"></div>
        </div>
    </div>
    <div id="lyrDown"></div>
</asp:Content>
