<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EHM_3220.aspx.cs" Inherits="JOB_EHM_3220" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM_3220.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div>
        <div style="width:30%; float:left; text-align: left;">
            <div id="lyrMenu_2">
            </div>
        </div>
        <div style="width:70%; float:right;">
            <div id="lyrMenu">
            </div>
        </div>
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
    <form id="frmData_INFO" action="">
    </form>
    <form id="frmData_SETUP_D" action="">
    </form>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="60%">
                &nbsp;
            </td>
            <td>
                <div id="lyrMenu_SETUP_ISSUE" align="right">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="grdData_SETUP_ISSUE">
                </div>
            </td>
            <td width="">
                <form id="frmData_SETUP_ISSUE_RMK" action="">
                </form>
            </td>
        </tr>
    </table>
    <div id="lyrMenu_FILE" align="right">
    </div>
    <div id="grdData_FileA">
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
