<%@ Page Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_FileUpload_Modify.aspx.cs" Inherits="Job_DLG_FileUpload_Modify" Title="" %>

<%@ Register Assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css"
        rel="stylesheet" type="text/css" />
    <script src="js/DLG_FileUpload_Modify.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
    <form id="frmData_설명" action="">
    </form>
    <form id="frmServer" runat="server">
    <div id="lyrServer" class="form_3">
        <dx:ASPxUploadControl ID="ctlUpload" runat="server" ClientInstanceName="ctlUpload"
            OnFileUploadComplete="ctlUpload_FileUploadComplete" Width="100%" CancelButtonSpacing="2px"
            ShowProgressPanel="True" FileInputCount="1" ToolTip="EDM">
            <ValidationSettings MultiSelectionErrorText="파일이 존재하지 않습니다." GeneralErrorText="파일 업로드 중에 에러가 발생하였습니다."
                MaxFileSize="419430400" MaxFileSizeErrorText="파일 크기는 400M Byte를 넘을 수 없습니다." 
                NotAllowedFileExtensionErrorText="첨부하신 파일의 확장자는 허용되지 않습니다.">
                <ErrorStyle Wrap="False" />
            </ValidationSettings>
            <CancelButton Text="취소">
            </CancelButton>
            <ClientSideEvents FileUploadComplete="function(s, e) { e.handler_success = successUpload; gw_com_DX.event_fileuploadcomplete(e); }" />
        </dx:ASPxUploadControl>
    </div>
    </form>
    <div style="margin-top: 10px; margin-left: 10px;">
        * 파일 크기는 400M Byte를 넘을 수 없습니다.<br />
        &nbsp;&nbsp;(50M Byte를 넘을 경우 장시간 로딩 후 에러가 발생할 수 있으니 꼭 확인하시기 바랍니다.)
    </div>
</asp:Content>
