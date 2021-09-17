<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="VOC_1020.aspx.cs" Inherits="JOB_VOC_1020" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/VOC_1020.js?ver=18101202" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
    
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="40%">
                <div id="lyrMenu_1">
                </div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">   
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_VOC" action="">
    </form>
    <form id="frmData_VOC_RMK" action="">
    </form>
    <div id="lyrMenu_PROD" align="right">
    </div>
    <div id="grdData_PROD">
    </div>
    <div id="lyrMenu_CHARGE" align="right">
    </div>
    <div id="grdData_CHARGE">
    </div>
    <div id="lyrMenu_FILE" align="right">
    </div>
    <div id="grdData_FileA">
    </div>
    <div id="lyrDown">
    </div>
</asp:Content>
