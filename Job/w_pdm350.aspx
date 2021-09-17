<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_2.master" AutoEventWireup="true" CodeFile="w_pdm350.aspx.cs" Inherits="Job_w_pdm350" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" Runat="Server">
    <script src="js/w_pdm350.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" Runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" Runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData_1" Runat="Server">
    <div id="grdData_장비List">
    </div>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentData_2" Runat="Server">
    <div id="grdData_EBOMList">
    </div>
</asp:Content>