<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EHM_2230.aspx.cs" Inherits="JOB_EHM_2230" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EHM_2230.js" type="text/javascript"></script>
    <style type="text/css" media="screen">
        th.ui-th-column div{
            height:auto !important;
        }
    </style>
    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>

</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_MAIN">
    </div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="40%">
                <div id="lyrMenu_SUB" align="right">
                </div>
            </td>
            <td width="60%">
                <div id="lyrMenu_SUB2" align="right">
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <form id="frmData_SUB" action="">
                </form>
            </td>
            <td>
                <div id="grdData_SUB2">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>