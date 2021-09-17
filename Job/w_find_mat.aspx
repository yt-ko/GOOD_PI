<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_find_mat.aspx.cs" Inherits="Job_w_find_mat" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link id="style_theme_tab" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_find_mat.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrRemark_1">
    </div>
    <div id="lyrRemark_2" style="display: none;">
    </div>
    <div id="lyrRemark_3" style="display: none;">
    </div>
    <div id="lyrRemark_4" style="display: none;">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1_1">
    </div>
    <div id="lyrMenu_1_2">
    </div>
    <div id="lyrMenu_1_3">
    </div>
    <div id="lyrMenu_1_4">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption_1" action="">
    </form>
    <form id="frmOption_2" action="">
    </form>
    <form id="frmOption_3" action="">
    </form>
    <form id="frmOption_4" action="">
    </form>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="lyrTab">
        <div id="lyrData_1">
            <div id="grdData_자재">
            </div>
            <div id="lyrMenu_2_1" align="right" style="margin-top: 2px; margin-bottom: 2px;">
            </div>
            <div id="grdData_자재선택">
            </div>
        </div>
        <div id="lyrData_2">
            <div id="grdData_인건비">
            </div>
            <div id="lyrMenu_2_2" align="right" style="margin-top: 2px; margin-bottom: 2px;">
            </div>
            <div id="grdData_인건비선택">
            </div>
        </div>
        <div id="lyrData_3">
            <div id="grdData_관리비">
            </div>
            <div id="lyrMenu_2_3" align="right" style="margin-top: 2px; margin-bottom: 2px;">
            </div>
            <div id="grdData_관리비선택">
            </div>
        </div>
        <div id="lyrData_4">
            <div id="grdData_임시">
            </div>
            <div id="lyrMenu_2_4" align="right" style="margin-top: 2px; margin-bottom: 2px;">
            </div>
            <div id="grdData_임시선택">
            </div>
        </div>
    </div>
</asp:Content>
