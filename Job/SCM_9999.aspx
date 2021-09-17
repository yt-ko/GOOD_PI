<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"%>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />

    <script src="js/SCM_9999.js" type="text/javascript"></script>

    <script type="text/javascript">

        $(function() {

            gw_job_process.ready();

        });
        
    </script>

</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu"></div>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentToggle" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <div style="padding-top:250px">
        <table style="width: 100%; height: 100%; border-collapse: collapse;" cellspacing="0" cellpadding="3">
            <tbody>
                <tr>
                    <td>
                        <p align="center">
                            <span style="color: #808080;">
                                <strong>
                                    <span style="font-size: 10pt;">표시할 데이터가 없습니다.</span>
                                </strong>
                            </span>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table><br />
    </div>
</asp:Content>