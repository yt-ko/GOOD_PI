﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="EVL_1012.aspx.cs" Inherits="Job_EVL_1012" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/EVL_1012.js?ver=190729" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td width="30%">
                <div id="grdList_EMP">
                </div>
            </td>
            <td width="">
                <div id="grdList_SUPP">
                </div>
            </td>
        </tr>
    </table>
</asp:Content>
