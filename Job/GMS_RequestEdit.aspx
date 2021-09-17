<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="GMS_RequestEdit.aspx.cs" Inherits="Job_GMS_RequestEdit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <style type="text/css" media="screen">
        /*th.ui-th-column div{ height:auto !important; font-size: 12pt !important; font-weight: bold !important;}*/
        /*tr.jqgrow td{ height:auto !important; font-size: 12pt !important; font-weight: bold !important;}*/
        .ui-jqgrid-title{ height:auto !important; font-family: "Malgun Gothic" !important; font-size: 11pt !important; font-weight: bold !important; color: #243873 !important;}
    </style>
    <script src="js/GMS_RequestEdit.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrRemark" style="margin-top: 10px;">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_MainA" action=""></form>
    <div id="lyrMenu_FileA" align="right" style="margin-top: 6px;"></div>
    <div id="grdData_FileA"> </div>
    <form id="frmData_MemoA" action=""></form>
    <form id="frmData_MemoB" action=""></form>
    <div id="lyrMenu_WORK" align="right" style="margin-top: 6px;"></div>
    <div id="grdData_WORK"></div>
    <div id="lyrMenu_ACT" align="right" style="margin-top: 6px;"></div>
    <div id="grdData_ACT"></div>
<%--    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 6px;">
        <tr>
            <td width="40%">
                <div id="lyrMenu_DETAIL2" align="right"></div>
            </td>
            <td width="60%">
                <div id="lyrMenu_THIRD" align="right"></div>
            </td>
        </tr>
    </table>--%>
    <div id="lyrDown"></div>
</asp:Content>
