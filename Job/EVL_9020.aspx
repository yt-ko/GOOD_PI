<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EVL_9020.aspx.cs" Inherits="JOB_EVL_9020" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EVL_9020.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div>
        <div style="width:50%; float:left; text-align: left;">
            <div id="lyrMenu_2">
            </div>
        </div>
        <div style="width:50%; float:right;">
            <div id="lyrMenu">
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <div id="grdData_EVL">
    </div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="20%">
                <div id="frmOption2" action="">
                </div>
            </td>
            <td width="" align="right">
                <div id="lyrMenu_EVL_ITEM" align="right">
                </div>
            </td>
        </tr>
    </table>
    <div id="grdData_EVL_ITEM">
    </div>
    <div id="lyrDown"></div>
</asp:Content>
