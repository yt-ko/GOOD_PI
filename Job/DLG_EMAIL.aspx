<%@ Page Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="DLG_EMAIL.aspx.cs" Inherits="Job_DLG_EMAIL" Title="" ValidateRequest="false" %>

<%@ Register Assembly="DevExpress.Web.ASPxHtmlEditor.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxHtmlEditor" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web" TagPrefix="dx" %>
<%@ Register Assembly="DevExpress.Web.ASPxSpellChecker.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a"
    Namespace="DevExpress.Web.ASPxSpellChecker" TagPrefix="dx" %>

<%@ Register assembly="DevExpress.Web.ASPxSpellChecker.v17.1" namespace="DevExpress.Web.ASPxSpellChecker" tagprefix="dx" %>
<%@ Register assembly="DevExpress.Web.ASPxHtmlEditor.v17.1" namespace="DevExpress.Web.ASPxHtmlEditor" tagprefix="dx" %>
<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <script src="js/DLG_EMAIL.js?ver=18072501" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            var _param = { args: { id: "_args" } };
            $(function () {
                gw_job_process.ready(_param);

            });

        });
        $(window).resize(function () {
            ctlHTML.SetHeight(window.innerHeight - 140);
        });

    </script>
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
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <form id="frmOption" action=""></form>
            </td>
            <td align="right">
                <div id="lyrMenu2"></div>
            </td>
        </tr>
    </table>
    <asp:TextBox runat="server" id="_args" ClientInstanceName="_args" ClientIDMode="Static" style="display:none" />
    <form id="frmInput" action=""></form>
    <form id="frmSubject" action=""></form>
    <div id="lyrHTML_temp" style="display:none"></div>
    <form id="frmHTML" action="">
    </form>
    <form id="frmServer" runat="server">
        <div id="lyrControl">
            <table style="width: 100%; height: 100%;">
                <tr>
                    <td>
                        <dx:ASPxHtmlEditor ID="ASPxctlHTML" runat="server" Width="100%" ClientInstanceName="ctlHTML"
                            ClientVisible="False" Height="520px" EnableTheming="True" Theme="Default" OnHtmlCorrecting="ASPxHtmlEditor1_HtmlCorrecting">
                            <StylesDocument Font-Names="굴림체" />
                            <ClientSideEvents HtmlChanged="gw_com_DX.event_htmlchanged" Init="function(s, e) {
	processInit({});
}" />
                            <Toolbars>
                                <dx:HtmlEditorToolbar>
                                    <Items>
                                        <dx:ToolbarUndoButton>
                                        </dx:ToolbarUndoButton>
                                        <dx:ToolbarRedoButton>
                                        </dx:ToolbarRedoButton>
                                        <dx:ToolbarFontNameEdit>
                                            <Items>
                                                <dx:ToolbarListEditItem Text="굴림" Value="굴림" />
                                                <dx:ToolbarListEditItem Selected="True" Text="굴림체" Value="굴림체" />
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
                            <SettingsHtmlEditing EnterMode="Default">
                            </SettingsHtmlEditing>
                            <SettingsDialogs>
                                <InsertImageDialog ShowMoreOptionsButton="False">
                                    <SettingsImageUpload UploadFolder="~/Files/EMAIL/images/" UploadFolderUrlPath="~/Files/EMAIL/images/">
                                    </SettingsImageUpload>
                                    <SettingsImageSelector>
                                        <EditingSettings TemporaryFolder="~/Files/EDIT_FILES/temp" />
                                    </SettingsImageSelector>
                                </InsertImageDialog>
                            </SettingsDialogs>
                        </dx:ASPxHtmlEditor>
                    </td>
                </tr>
            </table>
        </div>
    </form>
    <div id="lyrHTML_temp" style="display:none"></div>
</asp:Content>
