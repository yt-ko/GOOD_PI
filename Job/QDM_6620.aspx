<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="QDM_6620.aspx.cs" Inherits="JOB_QDM_6620" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <style type="text/css" media="screen">
        th.ui-th-column div{
            height:auto !important;
        }
    </style>
    <script src="js/QDM_6620.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrRemark" style="margin-top: 10px;">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_ACDT" action="">
    </form>
    <div id="lyrMenu_ACDT_D" align="right">
    </div>
    <div id="grdData_ACDT_D">
    </div>
    <div id="lyrLegned" align="right">
        <asp:Table ID="Table1" runat="server">
            <asp:TableRow runat="server">
                <asp:TableCell runat="server" BackColor="#00B050" Width="6px"></asp:TableCell>
                <asp:TableCell runat="server">완료</asp:TableCell>
                <asp:TableCell runat="server" BackColor="#FFC000" Width="6px"></asp:TableCell>
                <asp:TableCell runat="server">진행중</asp:TableCell>
                <asp:TableCell runat="server" BackColor="#C00000" Width="6px"></asp:TableCell>
                <asp:TableCell runat="server">지연</asp:TableCell>
            </asp:TableRow>
        </asp:Table>
    </div>
    <form id="frmData_ACDT_D" action="">
    </form>
    <form id="frmData_MEMO" action="">
    </form>
    <div id="lyrMenu_FILE" align="right">
    </div>
    <div id="grdData_FILE">
    </div>
    <div id="lyrMenu_MEET" align="right">
    </div>
    <div id="grdData_MEET">
    </div>
    <form id="frmData_MEET" action="">
    </form>
    <div id="lyrMenu_MEET_FILE" align="right">
    </div>
    <div id="grdData_MEET_FILE">
    </div>
    <div id="lyrMenu_REF_MODIFY" align="right">
    </div>
    <div id="grdData_REF_MODIFY">
    </div>
    <form id="frmData_REF_MODIFY" action="">
    </form>
    <div id="lyrMenu_REF_NCR" align="right">
    </div>
    <div id="grdData_REF_NCR">
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
