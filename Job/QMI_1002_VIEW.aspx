<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="QMI_1002_VIEW.aspx.cs" Inherits="JOB_QMI_1002_VIEW" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/QMI_1002_VIEW.js" type="text/javascript"></script>
    
    <script type="text/javascript">



        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1"></div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_MASTER" action=""></form>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="700" valign="top">
                <div id="lyrMenu_MEMO" align="right"></div>
                <form id="frmData_MEMO" action=""></form>
            </td>
            <td width="" valign="top">
                <div id="lyrMenu_PART" align="right"></div>
                <div id="grdData_PART"></div>
            </td>
        </tr>
    </table>
    <div id="lyrMenu_CHANGE" align="right"></div>
    <div id="grdData_CHANGE"></div>            
    <div id="lyrMenu_FILE" align="right"></div>
    <div id="grdData_FILE"></div>
    <div id="lyrDown"></div>
</asp:Content>
