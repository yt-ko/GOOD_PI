<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Intro.master" AutoEventWireup="true"
    CodeFile="TDCIntro.aspx.cs" Inherits="Master_TDCIntro" %>

<asp:Content ID="objManagerHead" ContentPlaceHolderID="objMasterHead" runat="Server">
    <script src="js/intro.tdc.js" type="text/javascript"></script>
    <script type="text/javascript">
        $("document").ready(function () {

            gw_intro_process.ready();
            document.getElementById("frmAuth_login_id").focus();

        });

    </script>
</asp:Content>
<asp:Content ID="objManagerContent" ContentPlaceHolderID="objMasterContent" runat="Server">
    <div id="lyrMaster" <%--style="display: none;"--%>>
        <div style="background: #ffffff url(../style/images/master/intro_tdc.jpg) no-repeat; overflow: hidden; height: 600px; margin: 0;">
        </div>
        <div id="lyrLogin" class="rowElem">
            <form id="frmAuth" action="">
                <div class="divTable">
	                <div class="divTableBody">
		                <div class="divTableRow" style="height: 20px;" >
                            <div class="divTableCell">
                                <div class="divTable">
                                    <div class="divTableBody">
                                        <div class="divTableRow">
			                                <div class="divTableCell"><img src="../style/images/master/txtLogin.png" alt="아이디" /></div>
			                                <div class="divTableCell"><input id="frmAuth_login_id" class="{ validate: { required } }" title="아이디" maxlength="50" name="login_id" size="13" type="text" value="" /></div>
			                                <div class="divTableCell"><img src="../style/images/master/txtPassword.png" alt="패스워드" /></div>
			                                <div class="divTableCell"><input id="frmAuth_login_pw" title="패스워드" maxlength="50" name="login_pw" size="13" type="password" value="" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
		                </div>
		                <div class="divTableRow" style="height: 20px;">
                            <div class="divTableCell">
                                <div class="divTable">
                                    <div class="divTableBody">
                                        <div class="divTableRow">
						                    <div class="divTableCell" style="width: 60px;"><a style="text-decoration: none;" href="#" target="_blank"><span style="font-family: Verdana; font-size: 14px; font-weight: bold;">HOME</span></a></div>
						                    <div class="divTableCell"><input id="chkSave" name="chkSave" type="checkbox" value="" /><label style="margin-left: 5px;" for="chkSave">아이디 저장</label></div>
			                                <div class="divTableCell"><button id="btnAuth" style="border: 0; margin: 0; padding: 0; background-color: transparent; cursor: pointer;"> <img src="../style/images/master/btnTdrLogin.png" alt="로그인" /> </button></div>
			                                <div class="divTableCell"><button id="btnNew" style="border: 0; margin: 0; padding: 0; background-color: transparent; cursor: pointer;"> <img src="../style/images/master/btnTdrNew.png" alt="신규가입" /> </button></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
		                </div>
	                </div>
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
