<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="QMI_1003.aspx.cs" Inherits="JOB_QMI_1003" %>

<%@ Register Assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/QMI_1003.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content8" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content7" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_Main">
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
    <form id="frmData_HTML" action=""></form>
    <form id="frmServer" runat="server">
        <div id="lyrServer" class="form_2" style="width: 100%;">
            <dx:ASPxUploadControl ID="ctlUpload" runat="server" ClientInstanceName="ctlUpload" ShowProgressPanel="True"
                            NullText="Click here to browse files..." width="100%" OnFileUploadComplete="ctlUpload_FileUploadComplete" ToolTip="PLM">
                            <ClientSideEvents
                                FileUploadComplete="function(s, e) { e.handler_success = successUpload; gw_com_DX.event_fileuploadcomplete(e); }"
                                TextChanged="function(s, e) { processUpload(s, e); }">
                            </ClientSideEvents>
                            <ValidationSettings
                                GeneralErrorText="파일 업로드 중에 에러가 발생하였습니다."
                                MaxFileSize="4194304"
                                MaxFileSizeErrorText="파일 크기는 4MB를 넘을 수 없습니다."
                                AllowedFileExtensions=".bmp,.gif,.jpg,.jpeg,.jpe,.png,"
                                NotAllowedFileExtensionErrorText="첨부하신 파일의 확장자는 허용되지 않습니다.">
                            </ValidationSettings>
                            <CancelButton Text="취소">
                            </CancelButton>
                        </dx:ASPxUploadControl>
        </div>
    </form>
    <form id="frmData_Main" action=""></form>
</asp:Content>
