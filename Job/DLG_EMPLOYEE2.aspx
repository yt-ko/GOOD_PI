<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_EMPLOYEE2.aspx.cs" Inherits="JOB_DLG_EMPLOYEE2" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG_EMPLOYEE2.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="60%">
                <div id="grdList_USER"></div>
            </td>
            <td width="" align="center">
                <div id="btnArrow" style="display: none">
                    <p><button id="btnRightAll">>></button></p>
                    <p><button id="btnRight">></button></p>
                    <p><button id="btnLeft"><</button></p>
                    <p><button id="btnLeftAll"><<</button></p>
                </div>
            </td>
            <td width="35%">
                <div id="grdList_RESULT"></div>
            </td>
        </tr>
    </table>
</asp:Content>
