<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_10.master" AutoEventWireup="true" CodeFile="SCM_8010.aspx.cs" Inherits="SCM_8010" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" Runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/SCM_8010.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {
1
            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption_1" Runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu_1" Runat="Server">
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentOption_2" Runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" Runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentRemark" Runat="Server">
    <div id="lyrRemark" style="margin-top:4px;">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" Runat="Server">
    <form id="frmData_정보" action=""></form>
    <div id="grdData_자재"></div>
    <div id="lyrMenu_미진행" align="right"></div>
    <div id="grdData_미진행"></div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData_2" Runat="Server">
    <div id="lyrTab">
        <div id="grdData_계획">
        </div>
        <div id="grdData_테스트">
        </div>
    </div>
    <div id="lyrDown"></div>
</asp:Content>
