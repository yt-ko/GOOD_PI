<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SRM_1060.aspx.cs" Inherits="Job_SRM_1060" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SRM_1060.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
    <style type="text/css" media="screen">
        th.ui-th-column div{
            height:auto !important;
        }
        #cont_title_group { background:url(/Style/images/others/bullet_cont_title_01.gif) no-repeat left center; font-weight:bold; color:#0063a4; padding-left:4px; }
        .cont_title_group { background:url(/Style/images/others/bullet_cont_title_01.gif) no-repeat left center; font-weight:bold; color:#0063a4; padding-left:4px; }
    </style>
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
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td colspan="2">
                <div id="lyrLabel1" class="cont_title_group"></div>
            </td>
        </tr>
        <tr>
            <td colspan="2"><span style="line-height: 50%">&nbsp;</span></td>
        </tr>
        <tr>
            <td width="60%">
                <div id="lyrLabel_MAIN" class="cont_title_group"></div>
            </td>
            <td width="" align="right">
                <div id="lyrLabel2"></div>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <div id="grdList_MAIN"></div>
            </td>
        </tr>
        <tr>
            <td colspan="2">&nbsp;</td>
        </tr>
        <tr>
            <td colspan="2">
                <div id="lyrLabel_SUB" class="cont_title_group"></div>
                <div id="grdList_SUB"></div>
            </td>
        </tr>
        <tr>
            <td colspan="2">&nbsp;</td>
        </tr>
        <tr>
            <td valign="top">
                <div id="lyrLabel_FILE1" class="cont_title_group"></div>
                <div id="grdList_FILE1"></div>
            </td>
            <td valign="top">
                <div id="lyrLabel_FILE2" class="cont_title_group"></div>
                <div id="grdList_FILE2"></div>
            </td>
        </tr>
    </table>
    <div id="lyrDown"></div>
</asp:Content>
