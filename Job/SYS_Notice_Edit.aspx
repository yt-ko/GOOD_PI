﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true" 
    CodeFile="SYS_Notice_Edit.aspx.cs" Inherits="Job_SYS_Notice_Edit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SYS_Notice_Edit.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () {
            gw_job_process.ready();
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="40%"><div id="lyrRemark_Top"></div></td>
            <td width="" align="right"><div id="lyrMenu_Top"></div></td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark_Opt">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_ListA"></div>
    <form id="frmData_MainA" action=""></form>
    <div id="lyrMenu_FileA" align="right"></div>
    <div id="grdData_FileA"></div>
    <form id="frmData_MemoA" action=""></form>
<%--    <div id="lyrDataSub">
            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
                <tr>
                    <td style="width: 50%"><form id="frmData_MemoA1" action=""></form></td>
                    <td style="width: 50%"><form id="frmData_TextA1" action=""></form></td>
                </tr>
            </table>
    </div>--%>
    <div id="lyrDown"></div>
    <form id="frmServer" runat="server"></form>
</asp:Content>
