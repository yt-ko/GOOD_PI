<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_10.master" AutoEventWireup="true"
    CodeFile="EHM_3210.aspx.cs" Inherits="Job_EHM_3210" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM_3210.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption_1" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu_1" runat="Server">
    <table width="100%" cellpadding="0" cellspacing>
        <tr>
            <td width="30%">
                <div id="lyrMenu_1" align="left">
                </div>
            </td>
            <td width="">
                <div id="lyrMenu_2" align="right">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentOption_2" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentMenu_2" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="grdData_SETUP">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData_2" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td width="60%">
                <div id="lyrMenu_SETUP_D" align="right">
                </div>
            </td>
            <td width="">
                <div id="lyrMenu_SETUP_PROC" align="right">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="grdData_SETUP_D">
                </div>
            </td>
            <td>
                <div id="grdData_SETUP_PROC">
                </div>
            </td>
        </tr>
    </table>
    <div id="grdData_FILE">
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
