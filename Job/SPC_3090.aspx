<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SPC_3090.aspx.cs" Inherits="JOB_SPC_3090" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SPC_3090.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData" runat="Server">
    
    <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
        margin-top: 2px; padding: 0; white-space: nowrap;">
        <tr>
            <td valign="top" style="padding-left: 5px; padding-right: 2px;">
                <div id="grdData_대분류"></div>
            </td>
            <td valign="top" style="padding-left: 5px; padding-right: 2px;">
                <div id="lyrMenu_2" align="right"></div>
                <div id="grdData_중분류"></div>
            </td>
        </tr>
    </table>
    <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
        margin-top: 2px; padding: 0; white-space: nowrap;">
        <tr>
            <td valign="top" style="padding-left: 5px; padding-right: 2px;">
                <div id="lyrMenu_3" align="right"></div>
                <div id="grdData_소분류"></div>
            </td>
        </tr>
    </table>
</asp:Content>
