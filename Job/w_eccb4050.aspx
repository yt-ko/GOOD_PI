<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_14.master" AutoEventWireup="true"
    CodeFile="w_eccb4050.aspx.cs" Inherits="Job_w_eccb4050" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_eccb4050.js" type="text/javascript"></script>
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
    <div id="lyrMenu_PJT" align="right">
    </div>
    <div id="grdData_PJT">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentHTML" runat="Server">
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0; padding: 0">
        <tr>
            <td style="width: 50%">
                <form id="frmData_메모A" action="">
                </form>
            </td>
            <td style="width: 50%">
                <form id="frmData_메모B" action="">
                </form>
            </td>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData_2" runat="Server">
    <div id="lyrMenu_도면" align="right">
    </div>
    <div id="grdData_도면">
    </div>
    <div id="lyrMenu_evl" align="right">
    </div>
    <div id="grdData_평가">
    </div>
    <div id="lyrMenu_FILE" align="right">
    </div>
    <div id="grdData_첨부">
    </div>
<div id="lyrTab">
    <div id="lyrECO">
        <form id="frmData_내역_2" action="">
        </form>
        <div id="grdData_모델_2">
        </div>
        <div id="lyrDown">
        </div>
    </div>
</div>
    
</asp:Content>
