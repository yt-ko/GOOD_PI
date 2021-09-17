<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Login.master" AutoEventWireup="true"
    CodeFile="LoginProcess.aspx.cs" Inherits="Master_LoginProcess" %>

<asp:Content ID="objContentHead" ContentPlaceHolderID="objContentHead" runat="Server">
    <script src="js/master.login.js" type="text/javascript"></script>
    <script type="text/javascript">
        $("document").ready(function () {

            gw_intro_process.ready();
            document.getElementById("frmAuth_login_id").focus();

        });

    </script>
    <style type="text/css">
        .input_login {
            width: 120px;
            height: 17px;
            line-height: 14px;
            border: 1px solid #dddddd;
            background: #fff;
            font-family: Dotum;
            font-size: 12px;
            color: #323335;
            vertical-align: middle;
            margin: 0;
            padding: 0;
        }
    </style>
</asp:Content>
<asp:Content ID="objManagerContent" ContentPlaceHolderID="objMasterContent" runat="Server">
    <div id="lyrMaster" style="display: none; height: 100%; vertical-align: middle;">
        <form id="frmAuth" action="">
            <div class="rowElem">
                <table style="height: 100%;" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tr>
                        <td height="70" align="center" style="vertical-align: middle;">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="145">
                                        <img src="../style/images/master/main_login_logo.gif" alt="Members Login" /></td>
                                    <td width="35">
                                        <img src="../style/images/master/login_line.gif" alt="line" /></td>
                                    <td width="306">
                                        <table width="281" border="0" cellspacing="0" cellpadding="0">
                                            <!-- 로그인 입력 시작 -->
                                            <tr>
                                                <td width="32">
                                                    <img src="../style/images/master/login_id.gif" alt="id" /></td>
                                                <td width="129" align="left">
                                                    <input type="text" id="frmAuth_login_id" name="login_id" size="13" maxlength="50" class="input_login" title="아이디" value="" tabindex="1" />
                                                </td>
                                                <td width="120" align="left" valign="top">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td width="20%" align="left"></td>
                                                            <td width="80%" align="left" style="float: left; padding-top: 3px;" valign="middle">
                                                                <input type="checkbox" name="chkSave" id="chkSave" tabindex="3" checked="checked" /><label for="chkSave" style="margin-left: 5px;">아이디 저장</label>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" height="3"></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <img src="../style/images/master/login_pw.gif" alt="pass" /></td>
                                                <td align="left">
                                                    <input type="password" id="frmAuth_login_pw" name="login_pw" size="13" maxlength="50" class="input_login" title="비밀번호" value="" tabindex="2" />
                                                </td>
                                                <td align="right">
                                                    <button id="btnAuth" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;" tabindex="4">
                                                        <img src="../style/images/master/login_btn.gif" alt="로그인" />
                                                    </button>
                                                </td>
                                                <td>&nbsp;
                                                </td>
                                            </tr>
                                            <!-- 로그인 입력 끝 -->
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </form>
    </div>
</asp:Content>
