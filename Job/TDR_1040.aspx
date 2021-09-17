<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="TDR_1040.aspx.cs" Inherits="Job_TDR_1040" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <style type="text/css" media="screen">
        /*th.ui-th-column div{ height:auto !important; font-size: 12pt !important; font-weight: bold !important;}*/
        /*tr.jqgrow td{ height:auto !important; font-size: 12pt !important; font-weight: bold !important;}*/
        .ui-jqgrid-title{ height:auto !important; font-family: "Malgun Gothic" !important; font-size: 11pt !important; font-weight: bold !important; color: #243873 !important;}
    </style>
    <script src="js/TDR_1040.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">    
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_MAIN" action="">
    </form>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="100%">
                <form id="frmData_MEMO1" action="">
                </form>
            </td>
        </tr>
    </table>
    <div style="display: none;">
        <form id="frmData_MEMO2" action="">
        </form>
    </div>
    <div id="lyrMenu_SUB" align="right">
    </div>
    <div id="grdData_SUB">
    </div>
    <div id="lyrMenu_FILE" align="right"></div>
    <div id="grdData_FILE"></div>
    <div id="grdData_THIRD"></div>
    <form id="frmData_INFORM" action=""></form>
    <div id="lyrDown"></div>
</asp:Content>
