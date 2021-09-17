<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_14.master" AutoEventWireup="true"
    CodeFile="w_eccb1010.aspx.cs" Inherits="Job_w_eccb1010" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_eccb1010.js?ver=190207" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">    
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" runat="Server">
    <form id="frmData_내역" action="">
    </form>
    <div id="lyrMenu_모델" align="right">
    </div>
    <div id="grdData_모델">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentHTML" runat="Server">
    <form id="frmData_메모A" action="">
    </form>
    <form id="frmData_메모B" action="">
    </form>
    <form id="frmData_메모F" action="">
    </form>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="grdData_문서">
    </div>
    <div id="lyrMenu_첨부" align="right">
    </div>
    <div id="grdData_첨부">
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
