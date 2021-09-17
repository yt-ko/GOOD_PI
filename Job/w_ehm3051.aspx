<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_9.master" AutoEventWireup="true"
    CodeFile="w_ehm3051.aspx.cs" Inherits="Job_w_ehm3051" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_ehm3051.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" runat="Server">
    <div id="lyrTab_1">
        <div id="grdData_루트">
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="lyrTab_2">
        <div id="lyrData_내용">
            <div id="lyrMenu_2" align="right">
            </div>
            <div id="grdData_폴더">
            </div>
            <div id="lyrMenu_3" align="right">
            </div>
            <div style="position: absolute; z-index: 10; width: 100%; top: 100;">
                <form id="frmOption_3" action="">
                </form>
            </div>
            <div id="grdData_문서">
            </div>
            <div id="lyrMenu_4" align="right">
            </div>
            <div id="grdData_이력">
            </div>
            <div id="lyrDown">
            </div>
        </div>
    </div>
</asp:Content>
