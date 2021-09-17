<%@ Page Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="w_edit_html_eccb.aspx.cs" Inherits="Job_w_edit_html_eccb" Title="" %>

<%@ Register Assembly="DevExpress.Web.ASPxHtmlEditor.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxHtmlEditor" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.ASPxSpellChecker.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxSpellChecker" TagPrefix="dx" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/w.edit.html.js" type="text/javascript"></script>
    <%--<script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>--%>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentOption" runat="Server">
    <div id="lyrNotice">
    </div>
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
            ClientVisible="False" Height="470px" EnableTheming="True" Font-Names="굴림체" 
            Font-Size="9pt">
            <SettingsHtmlEditing AllowScripts="True" EnterMode="BR"></SettingsHtmlEditing>
            <SettingsSpellChecker Culture="Korean (Korea)"></SettingsSpellChecker>
            <SettingsValidation ErrorText="HTML 내용이 유효하지 않습니다.">
                <RequiredField ErrorText="내용은 반드시 입력하셔야 합니다."></RequiredField>
            </SettingsValidation>
            <SettingsDialogs>
                <InsertImageDialog>
                    <SettingsImageUpload UploadFolder="~/Files/ECCB/Image" UploadFolderUrlPath="~/Files/ECCB/Image">
                        <ValidationSettings InvalidUrlErrorText="URL 혹은 파일이 유효하지 않습니다." GeneralErrorText="네트웍 에러가 발생하여 전송할 수 없습니다."
                            NotAllowedFileExtensionErrorText="해당하는 파일의 확장자는 허용되지 않습니다."
                            MaxFileSizeErrorText="파일 사이즈가 최대 사이즈를 초과하였습니다." MultiSelectionErrorText="업로드할 파일을 찾을 수 없습니다."></ValidationSettings>
                    </SettingsImageUpload>
                </InsertImageDialog>
            </SettingsDialogs>
            <ClientSideEvents HtmlChanged="gw_com_DX.event_htmlchanged" Init="function(s, e) { gw_job_process.ready(); }"></ClientSideEvents>
            <Toolbars>
                <dx:HtmlEditorToolbar>
                    <Items>
                        <dx:ToolbarCustomDialogButton>
                        </dx:ToolbarCustomDialogButton>
                        <dx:ToolbarUndoButton>
                        </dx:ToolbarUndoButton>
                        <dx:ToolbarRedoButton>
                        </dx:ToolbarRedoButton>
                        <dx:ToolbarFontNameEdit>
                            <Items>
                                <dx:ToolbarListEditItem Text="Times New Roman" Value="Times New Roman" />
                                <dx:ToolbarListEditItem Text="Tahoma" Value="Tahoma" />
                                <dx:ToolbarListEditItem Text="Verdana" Value="Verdana" />
                                <dx:ToolbarListEditItem Text="Arial" Value="Arial" />
                                <dx:ToolbarListEditItem Text="MS Sans Serif" Value="MS Sans Serif" />
                                <dx:ToolbarListEditItem Text="Courier" Value="Courier" />
                            </Items>
                        </dx:ToolbarFontNameEdit>
                        <dx:ToolbarFontSizeEdit>
                            <Items>
                                <dx:ToolbarListEditItem Text="1 (8pt)" Value="1" />
                                <dx:ToolbarListEditItem Text="2 (10pt)" Value="2" />
                                <dx:ToolbarListEditItem Text="3 (12pt)" Value="3" />
                                <dx:ToolbarListEditItem Text="4 (14pt)" Value="4" />
                                <dx:ToolbarListEditItem Text="5 (18pt)" Value="5" />
                                <dx:ToolbarListEditItem Text="6 (24pt)" Value="6" />
                                <dx:ToolbarListEditItem Text="7 (36pt)" Value="7" />
                            </Items>
                        </dx:ToolbarFontSizeEdit>
                        <dx:ToolbarBoldButton>
                        </dx:ToolbarBoldButton>
                        <dx:ToolbarItalicButton>
                        </dx:ToolbarItalicButton>
                        <dx:ToolbarFontColorButton>
                        </dx:ToolbarFontColorButton>
                        <dx:ToolbarBackColorButton>
                        </dx:ToolbarBackColorButton>
                        <dx:ToolbarJustifyLeftButton>
                        </dx:ToolbarJustifyLeftButton>
                        <dx:ToolbarJustifyCenterButton>
                        </dx:ToolbarJustifyCenterButton>
                        <dx:ToolbarJustifyRightButton>
                        </dx:ToolbarJustifyRightButton>
                        <dx:ToolbarTableOperationsDropDownButton>
                            <Items>
                                <dx:ToolbarInsertTableDialogButton BeginGroup="True">
                                </dx:ToolbarInsertTableDialogButton>
                                <dx:ToolbarTablePropertiesDialogButton BeginGroup="True">
                                </dx:ToolbarTablePropertiesDialogButton>
                                <dx:ToolbarTableRowPropertiesDialogButton>
                                </dx:ToolbarTableRowPropertiesDialogButton>
                                <dx:ToolbarTableColumnPropertiesDialogButton>
                                </dx:ToolbarTableColumnPropertiesDialogButton>
                                <dx:ToolbarTableCellPropertiesDialogButton>
                                </dx:ToolbarTableCellPropertiesDialogButton>
                                <dx:ToolbarInsertTableRowAboveButton BeginGroup="True">
                                </dx:ToolbarInsertTableRowAboveButton>
                                <dx:ToolbarInsertTableRowBelowButton>
                                </dx:ToolbarInsertTableRowBelowButton>
                                <dx:ToolbarInsertTableColumnToLeftButton>
                                </dx:ToolbarInsertTableColumnToLeftButton>
                                <dx:ToolbarInsertTableColumnToRightButton>
                                </dx:ToolbarInsertTableColumnToRightButton>
                                <dx:ToolbarSplitTableCellHorizontallyButton BeginGroup="True">
                                </dx:ToolbarSplitTableCellHorizontallyButton>
                                <dx:ToolbarSplitTableCellVerticallyButton>
                                </dx:ToolbarSplitTableCellVerticallyButton>
                                <dx:ToolbarMergeTableCellRightButton>
                                </dx:ToolbarMergeTableCellRightButton>
                                <dx:ToolbarMergeTableCellDownButton>
                                </dx:ToolbarMergeTableCellDownButton>
                                <dx:ToolbarDeleteTableButton BeginGroup="True">
                                </dx:ToolbarDeleteTableButton>
                                <dx:ToolbarDeleteTableRowButton>
                                </dx:ToolbarDeleteTableRowButton>
                                <dx:ToolbarDeleteTableColumnButton>
                                </dx:ToolbarDeleteTableColumnButton>
                            </Items>
                        </dx:ToolbarTableOperationsDropDownButton>
                        <dx:ToolbarInsertImageDialogButton>
                        </dx:ToolbarInsertImageDialogButton>
                        <dx:ToolbarInsertLinkDialogButton>
                        </dx:ToolbarInsertLinkDialogButton>
                    </Items>
                </dx:HtmlEditorToolbar>
            </Toolbars>

        </dx:ASPxHtmlEditor>
    </div>
    </form>
</asp:Content>
