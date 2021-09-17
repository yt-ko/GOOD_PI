<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SRM_4221.aspx.cs" Inherits="Job_SRM_4221" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SRM_4221.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="left">
                <form id="frmOption" action=""></form>
            </td>
            <td align="right">
                <div id="lyrMenu_1"></div>
            </td>
        </tr>
    </table>
    <div id="grdData_Find">
    </div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="200"><div id="grdData_Cust"></div></td>
            <td width=""><div id="grdData_List"></div></td>
        </tr>
    </table>
</asp:Content>
