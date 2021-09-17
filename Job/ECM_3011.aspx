<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="ECM_3011.aspx.cs" Inherits="Job_ECM_3011" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/ECM_3011.js" type="text/javascript"></script>
    <style type="text/css" media="screen">
        th.ui-th-column div{
            height:auto !important;
        }
    </style>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
    <form id="frmOption1" action="">
    </form>
    <form id="frmOption2" action="">
    </form>
    <form id="frmOption4" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrContent">
        <div id="lyrContent_1">
            <div id="lyrMenu1" align="right"></div>
            <div id="grdList_PER"></div>
        </div>
        <div id="lyrContent_2">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="100">
                        <form id="frmOption3" action=""></form>
                    </td>
                    <td width="">
                        <div id="lyrMenu2" align="right"></div>
                    </td>
                </tr>
            </table>
            <div id="grdList_ECM"></div>
            <form id="frmData_FILE" action=""></form>
        </div>
    </div>
</asp:Content>
