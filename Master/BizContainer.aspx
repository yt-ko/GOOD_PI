<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Biz.master" AutoEventWireup="true"
    CodeFile="BizContainer.aspx.cs" Inherits="Master_BizContainer" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objMasterHead" runat="Server">
    <link id="style_theme" href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css"
        rel="stylesheet" type="text/css" />
    
    
    <script src="js/master.bizcontainer.js" type="text/javascript"></script>
    <script src="../Lib/js/lib.encrypt_1.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(document).ready(function ($) {

            gw_job_process.before();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objMasterContent" runat="Server">
    <table id="lyrMaster" border="0" width="1200px" cellspacing="0" cellpadding="0" style="padding: 0;
        margin: 0; display: none;"> 
        <tr>
            <td width="100%" valign="bottom">
                <div style="width:1200px; position: absolute; z-index: 1000; top: 100px;">
                    <table width="100%" border="0" cellpadding="1" cellspacing="0" style="margin: 0;
                        margin-top: 1px; padding: 0; white-space: nowrap;">
                        <tr>
                            <td align="right" valign="top">
                                <form id="frmOption" action="">
                                </form>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
<!--
        <tr>
            <td align="left" valign="top">
            </td>
        </tr>
-->
        <tr>
            <td>
                <table border="0" width="100%" cellspacing="0" style="padding: 0;
                    margin: 0; white-space: nowrap;">
                    <tr>
                        <td width="100%" valign="top">
                            <table border="0" width="100%" cellspacing="0" style="padding: 0; margin: 0; white-space: nowrap;">
                                <tr>
                                    <td valign="top">
                                        <div class="workarea_bg">
                                            <div id="tabs">
                                                <ul style="display:none">
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</asp:Content>
