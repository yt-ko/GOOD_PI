<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SYS_2032.aspx.cs" Inherits="JOB_SYS_2032" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />

    <script src="js/SYS_2032.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>

</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="170" align="left">
                <form id="frmData_Option">
                </form>
            </td>
            <td align="left">
                <div id="btnTbl">
                </div>
            </td>
            <td align="right">
                <div id="lyrMenu">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_Main">
    </div>
    <div id="grdData_ds">
    </div>
</asp:Content>