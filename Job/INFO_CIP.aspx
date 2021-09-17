<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="INFO_CIP.aspx.cs" Inherits="JOB_INFO_CIP" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/INFO_CIP.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrTab">
        <div id="lyrData_시행">
            <form id="frmData_내역_1" action="">
            </form>
            <div id="grdData_모델_1">
            </div>
            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
                <tr>
                    <td style="width: 50%">
                        <form id="frmData_메모A_1" action="">
                        </form>
                    </td>
                    <td style="width: 50%">
                        <form id="frmData_메모B_1" action="">
                        </form>
                    </td>
                </tr>
            </table>
            <div id="grdData_첨부_1">
            </div>
        </div>
        <div id="lyrData_완료">
            <form id="frmData_내역_2" action="">
            </form>
            <div id="grdData_모델_2">
            </div>
            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
                <tr>
                    <td style="width: 50%">
                        <form id="frmData_메모A_2" action="">
                        </form>
                    </td>
                    <td style="width: 50%">
                        <form id="frmData_메모B_2" action="">
                        </form>
                    </td>
                </tr>
            </table>
            <div id="grdData_첨부_2">
            </div>
        </div>
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
