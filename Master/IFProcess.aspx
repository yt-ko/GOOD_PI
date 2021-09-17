<%@ Page Language="C#" MasterPageFile="~/Master/IF.master" AutoEventWireup="true"
    CodeFile="IFProcess.aspx.cs" Inherits="Master_IFProcess" Title="제목 없음" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <script src="js/master.if.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentPage" runat="Server">
    <form id="frmAuth" action="">
    </form>
</asp:Content>
