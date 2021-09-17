<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_NCR.aspx.cs" Inherits="JOB_DLG_NCR" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG_NCR.js" type="text/javascript"></script>
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
    <div id="lyrMenu_Main">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action=""></form>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">    
</asp:Content>
<asp:Content ID="Content9" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_Main" action=""></form>
    <div id="lyrMenu_File1" align="right"></div>
    <div id="grdData_File1"></div>
    <div id="lyrMenu_Sub" align="right"></div>
    <div id="grdData_Sub"></div>
    <form id="frmData_D1" action=""></form>
    <form id="frmData_D1_2" action=""></form>
    <form id="frmData_D1_3" action=""></form>
    <form id="frmData_D2" action=""></form>
    <div id="lyrMenu_D3" align="right"></div>
    <div id="grdData_D3"></div>
    <div id="lyrDown"></div>
</asp:Content>
