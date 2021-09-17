<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true" CodeFile="w_iscm1010.aspx.cs" Inherits="Job_w_iscm1010" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" Runat="Server">
    <script src="js/w_pom4030.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentOption" Runat="Server">
    <form id="frmOption_1" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMenu" Runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentToggle" Runat="Server">
    <form id="frmOption_2" action="">
    </form>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentData" Runat="Server">
    <div id="grdData_프로젝트별납품계획">
    </div>
    <div id="grdData_프로젝트별납품실적">
    </div>
    <div id="grdData_프로젝트별협력사요청">
    </div>
    <div id="grdData_협력사별재고">
    </div>
    <div id="grdData_자재별납품계획">
    </div>
    <div id="grdData_자재별납품실적">
    </div>
</asp:Content>

