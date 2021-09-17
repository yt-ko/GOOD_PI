<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SYS_2030.aspx.cs" Inherits="JOB_SYS_2030" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">

    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/SYS_2030.js" type="text/javascript"></script>
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
            <td width="50%">
                <div id="lyrMenu_2">
                </div>
            </td>
            <td width="" align="right">
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
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="300">
                <div id="grdData_Main">
                </div>
            </td>
            <td width="" rowspan="2">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td>
                            <form id="frmData_Detail">
                            </form>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <form id="frmData_Detail2">
                            </form>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <div id="grdData_Sub">
                </div>
            </td>
        </tr>
    </table>
    <div id="lyrDown"></div>
</asp:Content>