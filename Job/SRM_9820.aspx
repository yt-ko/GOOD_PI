<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SRM_9820.aspx.cs" Inherits="JOB_SRM_9820" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SRM_9820.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <div id="lyrRemark2"></div>
            </td>
            <td>
                <div id="lyrMenu_MASTER" align="right"></div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">    
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdList_MASTER"></div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="800">
                <div id="grdList_SUB"></div>
            </td>
            <td width="">
                <div id="grdList_DETAIL"></div>
            </td>
        </tr>
    </table>
</asp:Content>
