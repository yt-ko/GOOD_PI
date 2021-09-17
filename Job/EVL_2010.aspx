<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EVL_2010.aspx.cs" Inherits="JOB_EVL_2010" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EVL_2010.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div>
        <div style="width:300px; float:left; text-align: left;">
            <div id="lyrMenu_2">
            </div>
        </div>
        <div style="float:right;">
            <div id="lyrMenu">
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_EVL_RESULT">
    </div>
    <form id="frmData_EVL_RESULT_SUM" action="">
    </form>
    <form id="frmData_EVL_RESULT" action="">
    </form>
    <div id="lyrMenu_EVL_RESULT" align="center">
    </div>
    <div id="lyrDown"></div>
</asp:Content>
