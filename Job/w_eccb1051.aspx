<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_14.master" AutoEventWireup="true"
    CodeFile="w_eccb1051.aspx.cs" Inherits="Job_w_eccb1051" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_eccb1051.js" type="text/javascript"></script>
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
    <div id="lyrMenu_1">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">    
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" runat="Server">
    <form id="frmData_내역" action="">
    </form>
    <div id="lyrMenu_2" align="right">
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
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <form id="frmOptionECOFile" action="">
                </form>
            </td>
            <td align="right">
                <div id="lyrMenu_4" align="right">
                </div>
            </td>
        </tr>
    </table>
    <div id="grdData_문서"></div>
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="50%">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="50%"> <form id="frmMenu_APART" action=""></form></td>
                        <td width="50%"> <div id="lyrMenu_APART" align="right"> </div></td>
                    </tr>
                </table>
            </td>
            <td width="50%"><div id="lyrMenu_BPART" align="right"></div></td>
        </tr>
        <tr>
            <td valign="top"><div id="grdData_APART"></div></td>
            <td valign="top"><div id="grdData_BPART"></div></td>
        </tr>
    </table>
    <div id="lyrMenu_3" align="right"></div>
    <div id="grdData_첨부"></div>
    <div id="lyrDown"></div>
</asp:Content>
