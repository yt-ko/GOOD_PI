<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Page_7.master" AutoEventWireup="true"
    CodeFile="SRM_999.aspx.cs" Inherits="JOB_SRM_999" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objContentHead" runat="Server">
    <link id="style_theme" href="" rel="stylesheet" type="text/css" />
    <link  href="../Style/radio_kyt.css" rel="stylesheet" type="text/css" />
    <script src="js/SRM_999.js" type="text/javascript"></script>
    <script type="text/javascript">

        $(function () {

            gw_job_process.ready();

        });

    </script>
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="objContentOption" runat="Server">
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="objContentMenu" runat="Server">
    <div id="lyrMenu">
    </div>
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="objContentToggle" runat="Server">
    <form id="frmOption" action="">
    </form>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="objContentRemark" runat="Server">
    <div id="lyrRemark">
    </div>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="objContentData" runat="Server">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <form id="frmData_MemoA" action=""></form>
            </td>
            
        </tr>
        <tr>
            <td>
                <div id="grdData_List"></div>
            </td>
        </tr>
    </table>
     <div id="radio1" class="radiodiv">
            <br />
                    발주 담당자와 취소 내용은 사전 협의가 되었나요? 
                    <input type="radio" name="radioA"  value="yes"/>있었음
                    <input type="radio" name="radioA" value="no"  />없었음
                    <br />
                    <br />
                    본 발주 취소 후 추가 발주서 발행여부 협의 되었나요?
                    <input type="radio" name="radioB"  value="yes" />예
                    <input type="radio" name="radioB" value="no"  />아니오               
                   <br />
                </div>
                    <div id="radio2" class="radiodiv">
                    <br />
                    상기 품목의 발주 취소에 동의 하십니까?
                    <br />
                    <br />
                    <div class="select">
                    <input type="radio" name="checkqq" value="a" id="select" onclick="radiodisabledB()"/><label for="select">동의</label>
                    </div>
                    <div>
                    <p></p><input type="radio" id="radioC1" name="radioC" value="1" onclick="textShow()" disabled="disabled"/>금전 배상  [손실추정액<input type="text" name="radioC1" disabled="disabled" />원 사유 <input type="text" name="radioC1" disabled="disabled" />]
                     <br />
                    <p></p> <input type="radio" id="radioC2" name="radioC" value="2" onclick="textShow()" disabled="disabled"/>비금전 배상
                     <br />
                    <p></p><input type="radio" id="radioC3" name="radioC" value="3" onclick="textShow()"disabled="disabled"/>손해 없음
                     <br />
                    <p></p> <input type="radio" id="radioC4" name="radioC" value="4" onclick="textShow()"disabled="disabled"/>기타 (20자 내외 보상 의견 기술)<br />
                   <input type="text" maxlength="20" name="radioC4" disabled="disabled"/>
                    </div>
                    <div class="select">
                    <input type="radio"  name="checkqq" value="b" id="select2" onclick="radiodisabledB()"/><label for="select2">비동의</label>
                    </div>
                </div>                
    <div id="lyrHTML_temp" style="display:none"></div>
</asp:Content>

