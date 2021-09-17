<%@ Page Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_edit_asissue.aspx.cs" Inherits="Job_w_edit_asissue" Title="" %>

<%@ Register Assembly="DevExpress.Web.ASPxHtmlEditor.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxHtmlEditor" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.ASPxSpellChecker.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxSpellChecker" TagPrefix="dx" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w_edit_asissue.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
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
    <form id="frmHTML" action="">
    </form>
    <form id="frmServer" runat="server">
    <div id="lyrControl">
        <dx:ASPxHtmlEditor ID="ASPxctlHTML" runat="server" Width="100%" ClientInstanceName="ctlHTML"
            ClientVisible="False" Height="500px">
            <SettingsHtmlEditing AllowScripts="True" EnterMode="BR" />
            <SettingsSpellChecker Culture="Korean (Korea)">
            </SettingsSpellChecker>
            <ClientSideEvents HtmlChanged="gw_com_DX.event_htmlchanged" />
            <SettingsValidation ErrorText="HTML 내용이 유효하지 않습니다.">
                <RequiredField ErrorText="내용은 반드시 입력하셔야 합니다." />
            </SettingsValidation>
            <SettingsDialogs>
                <InsertImageDialog>
                    <SettingsImageUpload UploadFolder="~/EDIT_FILES/images/" UploadFolderUrlPath="~/EDIT_FILES/images/">
                        <ValidationSettings GeneralErrorText="네트웍 에러가 발생하여 전송할 수 없습니다." InvalidUrlErrorText="URL 혹은 파일이 유효하지 않습니다."
                             MaxFileSizeErrorText="파일 사이즈가 최대 사이즈를 초과하였습니다." MultiSelectionErrorText="업로드할 파일을 찾을 수 없습니다."
                             NotAllowedFileExtensionErrorText="해당하는 파일의 확장자는 허용되지 않습니다.">
                        </ValidationSettings>
                    </SettingsImageUpload>
                </InsertImageDialog>
            </SettingsDialogs>
        </dx:ASPxHtmlEditor>
    </div>
    </form>
</asp:Content>
