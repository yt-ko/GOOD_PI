<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EHM_1020.aspx.cs" Inherits="JOB_EHM_1020" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM_1020.js" type="text/javascript"></script>
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
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="20%">
                <div id="lyrMenu_CODE1" align="right"></div>
                <div id="grdData_CODE1"></div>
            </td>
            <td width="27%">
                <div id="lyrMenu_CODE2" align="right"></div>
                <div id="grdData_CODE2"></div>
            </td>
            <td width="33%">
                <div id="lyrMenu_CODE3" align="right"></div>
                <div id="grdData_CODE3"></div>
            </td>
            <td width="20%">
                <div id="lyrMenu_CODE4" align="right"></div>
                <div id="grdData_CODE4"></div>
            </td>
        </tr>
    </table>
</asp:Content>
