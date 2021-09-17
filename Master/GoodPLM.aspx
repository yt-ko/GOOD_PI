<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Intro.master" AutoEventWireup="true"
    CodeFile="GoodPLM.aspx.cs" Inherits="Master_GoodPLM" %>

<asp:Content ID="objManagerHead" ContentPlaceHolderID="objMasterHead" runat="Server">
    <script src="js/launch.biz.js" type="text/javascript"></script>
    <script type="text/javascript">
        $("document").ready(function () {

            gw_launch_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="objManagerContent" ContentPlaceHolderID="objMasterContent" runat="Server">
    <div id="lyrMaster" style="display: none;">
        <div style="background: #ffffff url(../style/images/master/intro_plm.jpg) no-repeat;
            overflow: hidden; height: 600px; margin: 0;">
        </div>
        <table width="100%" cellspacing="0" style="border-top: #D6D9DE solid 1px; padding: 0;
            margin: 0; white-space: nowrap;">
            <tr>
                <td align="right">
                    <img alt="ATTO" src="../style/images/master/biz_bottom.gif" />
                </td>
            </tr>
        </table>
    </div>
</asp:Content>
