<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DLG_ECMDOCViewer.aspx.cs" Inherits="Job_DLG_ECMDOCViewer" %>

<%@ Register assembly="DevExpress.Web.ASPxRichEdit.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a" namespace="DevExpress.Web.ASPxRichEdit" tagprefix="dx" %>

<%@ Register assembly="DevExpress.Web.v17.1, Version=17.1.6.0, Culture=neutral, PublicKeyToken=b88d1754d700e49a" namespace="DevExpress.Web" tagprefix="dx" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script type="text/javascript">

        function Resize() {
            var height = document.getElementById("Workspace").clientHeight;
            document.getElementById("ASPxRichEdit1").SetHeight(height);
            //editorClientId.SetHeight(height);
        }
    </script>
</head>
<body onresize="Resize()">
    <form id="form1" runat="server">
    <div id="Workspace" style="width: auto; height: auto">
    
    <dx:ASPxRichEdit ID="ASPxRichEdit1" runat="server" WorkDirectory="~\Report\ECM_1020" Width="100%" Height="600px" ReadOnly="True" ShowStatusBar="False" Theme="Aqua">
        <RibbonTabs>
            <dx:RERFileTab>
                <Groups>
                    <dx:RERFileCommonGroup>
                        <Items>
                            <dx:RERNewCommand Size="Large">
                            </dx:RERNewCommand>
                            <dx:REROpenCommand Size="Large">
                            </dx:REROpenCommand>
                            <dx:RERSaveCommand Size="Large">
                            </dx:RERSaveCommand>
                            <dx:RERSaveAsCommand Size="Large">
                            </dx:RERSaveAsCommand>
                            <dx:RERPrintCommand Size="Large">
                            </dx:RERPrintCommand>
                        </Items>
                    </dx:RERFileCommonGroup>
                </Groups>
            </dx:RERFileTab>
            <dx:RERHomeTab Visible="False">
                <Groups>
                    <dx:RERUndoGroup>
                        <Items>
                            <dx:RERUndoCommand>
                            </dx:RERUndoCommand>
                            <dx:RERRedoCommand>
                            </dx:RERRedoCommand>
                        </Items>
                    </dx:RERUndoGroup>
                    <dx:RERClipboardGroup>
                        <Items>
                            <dx:RERPasteCommand Size="Large">
                            </dx:RERPasteCommand>
                            <dx:RERCutCommand>
                            </dx:RERCutCommand>
                            <dx:RERCopyCommand>
                            </dx:RERCopyCommand>
                        </Items>
                    </dx:RERClipboardGroup>
                    <dx:RERFontGroup>
                        <Items>
                            <dx:RERFontNameCommand>
                                <PropertiesComboBox ValueType="System.Int32" Width="150px">
                                </PropertiesComboBox>
                            </dx:RERFontNameCommand>
                            <dx:RERFontSizeCommand>
                                <PropertiesComboBox ValueType="System.Int32" Width="60px">
                                </PropertiesComboBox>
                            </dx:RERFontSizeCommand>
                            <dx:RERIncreaseFontSizeCommand>
                            </dx:RERIncreaseFontSizeCommand>
                            <dx:RERDecreaseFontSizeCommand>
                            </dx:RERDecreaseFontSizeCommand>
                            <dx:RERChangeCaseCommand DropDownMode="False">
                            </dx:RERChangeCaseCommand>
                            <dx:RERFontBoldCommand>
                            </dx:RERFontBoldCommand>
                            <dx:RERFontItalicCommand>
                            </dx:RERFontItalicCommand>
                            <dx:RERFontUnderlineCommand>
                            </dx:RERFontUnderlineCommand>
                            <dx:RERFontStrikeoutCommand>
                            </dx:RERFontStrikeoutCommand>
                            <dx:RERFontSuperscriptCommand>
                            </dx:RERFontSuperscriptCommand>
                            <dx:RERFontSubscriptCommand>
                            </dx:RERFontSubscriptCommand>
                            <dx:RERFontColorCommand>
                            </dx:RERFontColorCommand>
                            <dx:RERFontBackColorCommand>
                            </dx:RERFontBackColorCommand>
                            <dx:RERClearFormattingCommand>
                            </dx:RERClearFormattingCommand>
                        </Items>
                    </dx:RERFontGroup>
                    <dx:RERParagraphGroup>
                        <Items>
                            <dx:RERBulletedListCommand>
                            </dx:RERBulletedListCommand>
                            <dx:RERNumberingListCommand>
                            </dx:RERNumberingListCommand>
                            <dx:RERMultilevelListCommand>
                            </dx:RERMultilevelListCommand>
                            <dx:RERDecreaseIndentCommand>
                            </dx:RERDecreaseIndentCommand>
                            <dx:RERIncreaseIndentCommand>
                            </dx:RERIncreaseIndentCommand>
                            <dx:RERShowWhitespaceCommand>
                            </dx:RERShowWhitespaceCommand>
                            <dx:RERAlignLeftCommand>
                            </dx:RERAlignLeftCommand>
                            <dx:RERAlignCenterCommand>
                            </dx:RERAlignCenterCommand>
                            <dx:RERAlignRightCommand>
                            </dx:RERAlignRightCommand>
                            <dx:RERAlignJustifyCommand>
                            </dx:RERAlignJustifyCommand>
                            <dx:RERParagraphLineSpacingCommand DropDownMode="False">
                            </dx:RERParagraphLineSpacingCommand>
                            <dx:RERParagraphBackColorCommand>
                            </dx:RERParagraphBackColorCommand>
                        </Items>
                    </dx:RERParagraphGroup>
                    <dx:RERStylesGroup>
                        <Items>
                            <dx:RERChangeStyleCommand MaxColumnCount="10" MaxTextWidth="65px" MinColumnCount="2">
                                <PropertiesDropDownGallery RowCount="3" />
                            </dx:RERChangeStyleCommand>
                        </Items>
                    </dx:RERStylesGroup>
                    <dx:REREditingGroup>
                        <Items>
                            <dx:RERSelectAllCommand>
                            </dx:RERSelectAllCommand>
                        </Items>
                    </dx:REREditingGroup>
                </Groups>
            </dx:RERHomeTab>
            <dx:RERInsertTab Visible="False">
                <Groups>
                    <dx:RERPagesGroup>
                        <Items>
                            <dx:RERInsertPageBreakCommand Size="Large">
                            </dx:RERInsertPageBreakCommand>
                        </Items>
                    </dx:RERPagesGroup>
                    <dx:RERIllustrationsGroup>
                        <Items>
                            <dx:RERInsertPictureCommand Size="Large">
                            </dx:RERInsertPictureCommand>
                        </Items>
                    </dx:RERIllustrationsGroup>
                    <dx:RERLinksGroup>
                        <Items>
                            <dx:RERShowHyperlinkFormCommand Size="Large">
                            </dx:RERShowHyperlinkFormCommand>
                        </Items>
                    </dx:RERLinksGroup>
                    <dx:RERSymbolsGroup>
                        <Items>
                            <dx:RERShowSymbolFormCommand Size="Large">
                            </dx:RERShowSymbolFormCommand>
                        </Items>
                    </dx:RERSymbolsGroup>
                </Groups>
            </dx:RERInsertTab>
            <dx:RERPageLayoutTab Visible="False">
                <Groups>
                    <dx:RERPageSetupGroup>
                        <Items>
                            <dx:RERPageMarginsCommand DropDownMode="False" Size="Large">
                            </dx:RERPageMarginsCommand>
                            <dx:RERChangeSectionPageOrientationCommand DropDownMode="False" Size="Large">
                            </dx:RERChangeSectionPageOrientationCommand>
                            <dx:RERChangeSectionPaperKindCommand DropDownMode="False" Size="Large">
                            </dx:RERChangeSectionPaperKindCommand>
                            <dx:RERSetSectionColumnsCommand DropDownMode="False" Size="Large">
                            </dx:RERSetSectionColumnsCommand>
                            <dx:RERInsertBreakCommand DropDownMode="False" Size="Large">
                            </dx:RERInsertBreakCommand>
                        </Items>
                    </dx:RERPageSetupGroup>
                </Groups>
            </dx:RERPageLayoutTab>
            <dx:RERViewTab Visible="False">
                <Groups>
                    <dx:RERShowGroup>
                        <Items>
                            <dx:RERToggleShowHorizontalRulerCommand Size="Large">
                            </dx:RERToggleShowHorizontalRulerCommand>
                        </Items>
                    </dx:RERShowGroup>
                    <dx:RERViewGroup>
                        <Items>
                            <dx:RERToggleFullScreenCommand Size="Large">
                            </dx:RERToggleFullScreenCommand>
                        </Items>
                    </dx:RERViewGroup>
                </Groups>
            </dx:RERViewTab>
        </RibbonTabs>
        <SettingsDocumentSelector>
            <FileListSettings View="Details">
                <DetailsViewSettings AllowColumnResize="True" ShowHeaderFilterButton="True">
                </DetailsViewSettings>
            </FileListSettings>
        </SettingsDocumentSelector>
        <ClientSideEvents Init="function(s, e) {
	s.toggleFullScreenMode();
}" />
        <Settings Unit="Centimeter">
        </Settings>
    </dx:ASPxRichEdit>
    
    </div>
    </form>
</body>
</html>
