<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DEV_1017.aspx.cs" Inherits="JOB_DEV_1017" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />

    <script src="js/DEV_1017.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>

</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing ="0">
        <tr>
            <td>
                <div id="lyrMenu">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu2">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu3">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu4">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu5">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu6">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu7">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu8">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu9">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div id="lyrMenu10">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
    <form id="frmData_발생정보" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_목록">
    </div>
</asp:Content>