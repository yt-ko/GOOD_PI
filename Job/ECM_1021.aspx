<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="ECM_1021.aspx.cs" Inherits="Job_ECM_1021" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="#" rel="stylesheet" type="text/css" />
    <script src="js/ECM_1021.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenuStep1">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <form id="frmOption1" action=""></form>
                </td>
                <td align="right">
                    <div id="lyrMenu1"></div>
                </td>
            </tr>
        </table>
    </div>
    <div id="lyrMenuStep2">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <form id="frmOption2" action=""></form>
                </td>
                <td align="right">
                    <div id="lyrMenu2"></div>
                </td>
            </tr>
        </table>
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
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrContentStep1">
        <div id="grdList_STDDOC"></div>
        <div id="grdList_STDDOC_D"></div>
    </div>
    <div id="lyrContentStep2">
        <div id="grdList_SUPP"></div>
    </div>
</asp:Content>
