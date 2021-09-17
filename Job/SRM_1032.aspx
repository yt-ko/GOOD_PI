
<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SRM_1032.aspx.cs" Inherits="Job_SRM_1032" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SRM_1032.js?ver=18072501" type="text/javascript"></script>
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
            <td width="200">
                <div id="lyrMenu_BID">
                </div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
    <form id="frmOption2" action="">
    </form>
    <form id="frmOption3" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_PER" action=""></form>
    <div id="lyrMenu_PER_ITEM" align="right"></div>
    <div id="grdData_PER_ITEM"></div>
    <div id="lyrMenu_PER_SUPP" align="right"></div>
    <div id="grdData_PER_SUPP"></div>
    <div id="grdData_PER_SUPP_D"></div>
    <div id="lyrMenu_FILE" align="right"></div>
    <div id="grdData_FILE"></div>
    <div id="lyrDown"></div>
</asp:Content>
