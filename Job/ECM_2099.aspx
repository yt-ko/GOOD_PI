<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="ECM_2099.aspx.cs" Inherits="JOB_ECM_2099" %>

<%@ Register Assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/ECM_2099.js" type="text/javascript"></script>
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
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentRemark" runat="Server">    
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <form id="frmServer" runat="server">
                    <dx:ASPxUploadControl ID="ctlUpload" runat="server" ClientInstanceName="ctlUpload"
                        OnFileUploadComplete="ctlUpload_FileUploadComplete" Width="100%" CancelButtonSpacing="2px"
                        ShowProgressPanel="True" FileInputCount="1" ToolTip="EDM">
                        <ValidationSettings MultiSelectionErrorText="파일이 존재하지 않습니다." GeneralErrorText="파일 업로드 중에 에러가 발생하였습니다."
                            MaxFileSize="419430400" MaxFileSizeErrorText="파일 크기는 400M Byte를 넘을 수 없습니다." 
                            NotAllowedFileExtensionErrorText="첨부하신 파일의 확장자는 허용되지 않습니다." AllowedFileExtensions=".png,.bmp,.jpg,.gif">
                            <ErrorStyle Wrap="False" />
                        </ValidationSettings>
                        <CancelButton Text="취소">
                        </CancelButton>
                        <ClientSideEvents FileUploadComplete="function(s, e) { e.handler_success = successUpload; gw_com_DX.event_fileuploadcomplete(e); }" />
                    </dx:ASPxUploadControl>
                </form>
            </td>
        </tr>
        <tr>
            <td>
                <form id="frmImage" action="">
                </form>
            </td>
        </tr>
    </table>
</asp:Content>
