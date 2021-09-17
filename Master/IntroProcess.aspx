<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Intro.master" AutoEventWireup="true"
    CodeFile="IntroProcess.aspx.cs" Inherits="Master_IntroProcess" %>

<asp:Content ID="objManagerHead" ContentPlaceHolderID="objMasterHead" runat="Server">
    <script src="js/intro.biz.js?ver=190122" type="text/javascript"></script>
    <script type="text/javascript">
        $("document").ready(function () {

            gw_intro_process.ready();
            document.getElementById("frmAuth_login_id").focus();

        });

    </script>
</asp:Content>
<asp:Content ID="objManagerContent" ContentPlaceHolderID="objMasterContent" runat="Server">
    <div id="lyrMaster" style="display: none;">
        <div style="background: #ffffff url(../style/images/master/intro_plm.jpg) no-repeat;
            overflow: hidden; height: 600px; margin: 0;">
            <form id="frmAuth" action="" style="background-color: #ECEEF4; border: 4px solid #6D84B4;
            padding: 15px; width: 460px; margin-top: 314px; margin-left: 622px;">
            <div class="rowElem">
                <table border="0" width="100%" style="margin: 0;">
                    <tr>
                        <td width="50px">
                            <img src="../style/images/master/txtLogin.png" alt="아이디" />
                        </td>
                        <td width="170px">
                            <input type="text" id="frmAuth_login_id" name="login_id" size="13" maxlength="50" class="{validate: { required } }" title="아이디" value="" />
                        </td>
                        <td width="50px">
                            <img src="../style/images/master/txtPassword.png" alt="패스워드" />
                        </td>
                        <td width="150px">
                            <input type="password" id="frmAuth_login_pw" name="login_pw" size="13" maxlength="50" title="패스워드" value="" />
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
                                        <input type="checkbox" name="chkSave" id="chkSave" value="" /><label for="saveid" style="margin-left: 5px;">아이디 저장</label>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td width="150px" align="center" valign="bottom">
                            <button id="btnAuth" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
                                <img src="../style/images/master/btnLogin.png" alt="로그인" />
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            </form>
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
