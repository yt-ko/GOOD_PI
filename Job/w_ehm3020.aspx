<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_10.master" AutoEventWireup="true"
    CodeFile="w_ehm3020.aspx.cs" Inherits="Job_w_ehm3020" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_ehm3020.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption_1" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu_1" runat="Server">
    <div id="lyrMenu_1">
    </div>
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
    <div id="grdData_현황">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData_2" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td width="55%">
                <div id="lyrMenu_2" align="right">
                </div>
            </td>
            <td width="">
                &nbsp;
            </td>
        </tr>
        <tr>
            <td>
                <div id="grdData_보고서">
                </div>
            </td>
            <td>
                <div id="grdData_공정">
                </div>
            </td>
        </tr>
    </table>
    <form id="frmData_보고서" action="">
    </form>
    <div id="lyrMenu_3" align="right">
    </div>
    <div id="grdData_FileA">
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
