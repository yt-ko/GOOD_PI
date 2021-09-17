<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_srm1030.aspx.cs" Inherits="Job_w_srm1030" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_srm1030.js?ver=190702" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_현황">
    </div>
    <div id="lyrLegned" align="right">
        <asp:Table ID="Table1" runat="server">
            <asp:TableRow runat="server">
                <asp:TableCell runat="server" BackColor="#909090" Width="5px"></asp:TableCell>
                <asp:TableCell runat="server">중단</asp:TableCell>
                <asp:TableCell runat="server" BackColor="Red" Width="5px"></asp:TableCell>
                <asp:TableCell runat="server">변경</asp:TableCell>
                <asp:TableCell runat="server" ForeColor="Gray" ToolTip="목록을 더블클릭하면 변경이력을 조회할 수 있습니다.">※ 목록을 더블클릭하면 변경이력을 조회할 수 있습니다.</asp:TableCell>
            </asp:TableRow>
        </asp:Table>
    </div>
    <div id="grdData_품목">
    </div>
    <div id="grdList_EXCEL"></div>
    <div id="lyrDown"></div>
</asp:Content>
