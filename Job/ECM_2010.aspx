<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="ECM_2010.aspx.cs" Inherits="Job_ECM_2010" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <!-- 전자인증 모듈 설정 //-->
	<link rel="stylesheet" type="text/css" href="../CC_WSTD_home/unisignweb/rsrc/css/certcommon.css?v=1" />
	<script type="text/javascript" src="../CC_WSTD_home/unisignweb/js/unisignwebclient.js?v=1"></script>
	<script type="text/javascript" src="../ccc-sample-wstd/UniSignWeb_Multi_Init_Nim_IPS.js?v=1"></script>
	<!-- 전자인증 모듈 설정 //-->
    <script src="js/ECM_2010.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
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
    <div id="grdList_MAIN"></div>
    <div id="lyrDown"></div>
</asp:Content>
