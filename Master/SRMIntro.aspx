<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Intro.master" AutoEventWireup="true"
    CodeFile="SRMIntro.aspx.cs" Inherits="Master_SRMIntro" %>

<asp:Content ID="objManagerHead" ContentPlaceHolderID="objMasterHead" runat="Server">
    <script src="js/intro.srm.js?ver=190604" type="text/javascript"></script>
    <script type="text/javascript">
        $("document").ready(function () {

            gw_intro_process.ready();
            document.getElementById("frmAuth_login_id").focus();

        });

    </script>
</asp:Content>
<asp:Content ID="objManagerContent" ContentPlaceHolderID="objMasterContent" runat="Server">
    <div id="lyrMaster" style="display: none;">
        <div style="background: #ffffff url(../style/images/master/intro_srm.jpg) no-repeat;
            overflow: hidden; height: 600px; margin: 0;">
            <form id="frmAuth" action="" style="background-color: #ECEEF4; border: 4px solid #6D84B4;
            padding: 15px; width: 460px; margin-top: 314px; margin-left: 622px;">
            <div class="rowElem">
                <table border="0" width="100%" style="margin: 0;">
                    <tr>
                        <td width="50px" style="padding-left: 10px;">
                            <img src="../style/images/master/txtLogin.png" alt="아이디" />
                        </td>
                        <td width="170px">
                            <input type="text" id="frmAuth_login_id" name="login_id" size="15" maxlength="30"
                                class="{validate: { required } }" title="아이디" value="" />
                        </td>
                        <td width="50px">
                            <img src="../style/images/master/txtPassword.png" alt="패스워드" />
                        </td>
                        <td width="150px">
                            <input type="password" id="frmAuth_login_pw" name="login_pw" size="15" maxlength="30"
                                title="패스워드" value="" />
                        </td>
                    </tr>
                    <tr style="height: 45px;">
                        <td colspan="3" width="100%" align="center" valign="middle" style="padding-top: 4px;
                            font-family: 맑은 고딕;">
                            <table width="100%">
                                <tr>
                                    <td style="padding-top: 4px; font-family: verdana; font-weight: bold;">
                                        <a href="http://www.IPS.co.kr/">HOME <span style="font-style: italic;">(www.IPS.co.kr)</span></a>
                                    </td>
                                    <td>
                                        <input type="checkbox" name="chkSave" id="chkSave" value="" /><label for="saveid"
                                            style="margin-left: 5px;">아이디 저장</label>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td width="150px" align="center" valign="bottom">
                            <button id="btnAuth" style="border: 0; margin: 0; padding: 0; background-color: Transparent;
                                cursor: pointer;">
                                <img src="../style/images/master/btnLogin.png" alt="로그인" /></button>
                        </td>
                    </tr>
                </table>
            </div>
            </form>
            <div id="lyrAlert" align="left" style="margin-top: 25px; margin-left: 640px; color: #aa0000;
                font-family: 맑은 고딕; font-size: 10pt; display: none;">
                ** 이 사이트는 Internet Explorer 8.0 이상부터 최적화되어 있습니다.<br />
                &nbsp;&nbsp;&nbsp;하위 버전에서 실행할 경우 일부 UI가 보이지 않거나 오동작이 발생할 수 있으므로<br />
                &nbsp;&nbsp;&nbsp;반드시 업그레이드한 후에 사용해 주시기 바랍니다.<br />
                <br />
                &nbsp;&nbsp;&nbsp;<a href="http://windows.microsoft.com/ko-KR/internet-explorer/downloads/ie-8"
                    style="font-weight: bold;">==> Internet Explorer 8.0 다운로드 페이지 바로가기</a>
            </div>
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
