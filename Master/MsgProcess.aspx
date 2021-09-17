<%@ Page Language="C#" MasterPageFile="~/Master/Msg.master" AutoEventWireup="true"
    CodeFile="MsgProcess.aspx.cs" Inherits="Master_MsgProcess" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <script src="js/master.msg.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });
        
    </script>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentIcon" runat="Server">
    <img id="imgIcon_1" src="../style/images/master/msgInfo.png" alt="!" style="display: none;" />
    <img id="imgIcon_2" src="../style/images/master/msgConfirm.png" alt="?" style="display: none;" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentMessage" runat="Server">
    <div id="lyrMsg" style="margin-top: 10px; margin-bottom: 10px;">
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu_1">
    </div>
    <div id="lyrMenu_2">
    </div>
    <div id="lyrMenu_3">
    </div>
</asp:Content>
