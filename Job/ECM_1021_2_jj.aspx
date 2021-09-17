<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="ECM_1021_2_jj.aspx.cs" Inherits="Job_ECM_1021_2_jj" %>

<%@ Register assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a" namespace="DevExpress.Web" tagprefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/ECM.1021.2.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(function () { gw_job_process.ready(); });
    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenuStep1">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <form id="frmOption1" action=""></form>
                </td>
                <td align="right">
                    <div id="lyrMenu1"></div>
                </td>
            </tr>
        </table>
    </div>
    <div id="lyrMenuStep2">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <form id="frmOption2" action=""></form>
                </td>
                <td align="right">
                    <div id="lyrMenu2"></div>
                </td>
            </tr>
        </table>
    </div>
    <div id="lyrMenuStep3">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td>
                    <form id="frmOption3" action=""></form>
                </td>
                <td align="right">
                    <div id="lyrMenu3"></div>
                </td>
            </tr>
        </table>
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
    <div id="lyrContentStep1">
        <div id="grdList_STDDOC"></div>
        <div id="grdList_STDDOC_D"></div>
        <div id="grdList_STDDOC_EXT"></div>
    </div>
    <div id="lyrContentStep2">
        <form id="frmData_DOC" action=""></form>
        <form id="frmData_DOC_EXT" action=""></form>
        <div id="grdData_DOC_EXT"></div>
        <div id="grdData_DOC_SUPP"></div>
    </div>
    <div id="lyrContentStep3" style="display: none;">
        <form id="frmData_SUPP" action=""></form>
        <form id="frmServer" runat="server">
            <div id="comment">
                <dx:ASPxImage ID="imgComment" runat="server" ShowLoadingImage="true" ImageUrl="~/Files/ECM_FILES/TMP_FILES/ECM.1021.2.PNG" ClientInstanceName="imgComment"
                    Caption="※ 아래 이미지와 같은 형식의 엑셀 파일을 업로드 합니다.">
                    <CaptionSettings Position="Top" />
                    <CaptionStyle Font-Names="굴림,맑은 고딕">
                    </CaptionStyle>
                </dx:ASPxImage>
            </div>
            <div id="lyrServer" class="form_3" style="margin-top: 50px;">
                <dx:ASPxUploadControl ID="ctlUpload" runat="server" ClientInstanceName="ctlUpload"
                    OnFileUploadComplete="ctlUpload_FileUploadComplete" Width="100%" CancelButtonSpacing="2px"
                    ShowProgressPanel="True">
                    <ValidationSettings MultiSelectionErrorText="파일이 존재하지 않습니다." GeneralErrorText="파일 업로드 중에 에러가 발생하였습니다."
                        MaxFileSize="15360000" MaxFileSizeErrorText="파일 크기는 15M Byte를 넘을 수 없습니다."
                        NotAllowedFileExtensionErrorText="첨부하신 파일의 확장자는 허용되지 않습니다."
                        AllowedFileExtensions=".xls, .xlsx">
                        <ErrorStyle Wrap="False" />
                    </ValidationSettings>
                    <CancelButton Text="취소">
                    </CancelButton>
                    <ClientSideEvents FileUploadComplete="function(s, e) { e.handler_success = successUpload; gw_com_DX.event_fileuploadcomplete(e); }" />
                </dx:ASPxUploadControl>   
            </div>
        </form>
    </div>
</asp:Content>
