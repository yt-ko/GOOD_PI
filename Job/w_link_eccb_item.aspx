<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_link_eccb_item.aspx.cs" Inherits="Job_w_link_eccb_item" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_link_eccb_item.js?ver=190207" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <form id="frmOption_ECR_NO" action=""></form>
            </td>
            <td>
                <form id="frmOption_CIP_NO" action=""></form>
            </td>
            <td>
                <form id="frmOption_ECO_NO" action=""></form>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrTab">
        <div id="lyrData_ECR">
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
                <tr>
                    <td style="width: 100%">
                        <form id="frmData_메모F_1" action="">
                        </form>
                    </td>
                </tr>
            </table>
            <div id="grdData_첨부_1">
            </div>
        </div>
        <div id="lyrData_CIP">
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
                <tr>
                    <td style="width: 100%">
                        <form id="frmData_메모F_2" action="">
                        </form>
                    </td>
                </tr>
            </table>
            <div id="grdData_첨부_2">
            </div>
        </div>
        <div id="lyrData_ECO">
            <form id="frmData_내역_3" action="">
            </form>
            <div id="grdData_모델_3">
            </div>
            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
                <tr>
                    <td style="width: 50%">
                        <form id="frmData_메모A_3" action="">
                        </form>
                    </td>
                    <td style="width: 50%">
                        <form id="frmData_메모B_3" action="">
                        </form>
                    </td>
                </tr>
                <tr>
                    <td style="width: 100%">
                        <form id="frmData_메모F_3" action="">
                        </form>
                    </td>
                </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td width="50%">
                        <div id="grdData_APART">
                        </div>
                    </td>
                    <td width="50%">
                        <div id="grdData_BPART">
                        </div>
                    </td>
                </tr>
            </table>
            <div id="grdData_문서">
            </div>
            <div id="grdData_첨부_3">
            </div>
        </div>
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
