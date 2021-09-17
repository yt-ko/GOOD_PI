<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Intro.master" AutoEventWireup="true"
    CodeFile="OpenSrcIntro.aspx.cs" Inherits="Master_OpenSrcIntro" %>

<asp:Content ID="objManagerHead" ContentPlaceHolderID="objMasterHead" runat="Server">
    <script src="js/intro.OpenSrc.js" type="text/javascript"></script>
    <script type="text/javascript">
        $("document").ready(function () {

            gw_intro_process.ready();
            document.getElementById("frmAuth_login_id").focus();

        });

    </script>
</asp:Content>
<asp:Content ID="objManagerContent" ContentPlaceHolderID="objMasterContent" runat="Server">
    <div id="lyrMaster" <%--style="display: none;"--%>>
        <div style="background: #ffffff url(../style/images/master/intro_osm.jpg) no-repeat; overflow: hidden; height: 600px; margin: 0;">
        </div>
        <div id="lyrLogin" class="rowElem">
            <form id="frmAuth" action="">
                <div class="divTable">
	                <div class="divTableBody">
		                <div class="divTableRow">
                            <div class="divTableCell">
                                <div class="divTable">
                                    <div class="divTableBody">
                                        <div class="divTableRow">
			                                <div class="divTableCell" style="width: 60px;"><label style="margin-left: 1px;" for="chkLoginID">E-Mail</label></div>
			                                <div class="divTableCell"><input id="frmAuth_login_id" class="{ validate: { required } }" title="E-Mail" maxlength="40" name="login_id" size="14" type="text" value="" /></div>
			                                <div class="divTableCell" style="width: 60px;"><label style="margin-left: 5px;" for="chkLoginPW">Password</label></div>
			                                <div class="divTableCell"><input id="frmAuth_login_pw" title="Password" maxlength="20" name="login_pw" size="12" type="password" value="" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
		                </div>
		                <div class="divTableRow">
                            <div class="divTableCell">
                                <div class="divTable">
                                    <div class="divTableBody">
                                        <div class="divTableRow">
							                <%--<div class="divTableCell" style="width: 60px;"><a style="text-decoration: none;" href="#" target="_blank"><span style="font-family: Verdana; font-size: 14px; font-weight: bold;">HOME</span></a></div>--%>
							                <%--<div class="divTableCell"><input id="chkSave" name="chkSave" type="checkbox" value="" /><label style="margin-left: 5px;" for="chkSave">이전 등록 기록 보기</label></div>--%>
							                <%--<div class="divTableCell"><label style="text-align: right; margin-left: 5px;" for="chkSave">수정 제안의</label></div>--%>
							                <div class="divTableCell"><label style="text-align: left; margin-left: 1px;" for="chkSave">Password는 사업자번호를 입력하세요</label></div>
			                                <%--<div class="divTableCell"><button id="btnAuth1" style="border: 0; margin: 0; padding: 0; background-color: transparent; cursor: pointer;"> <img src="../style/images/master/btnLogin.png" alt="신규 제안" /> </button></div>--%>
			                                <div class="divTableCell"><button id="btnAuth" style="border: 0; margin: 0; padding: 0; background-color: transparent; cursor: pointer;"> <img src="../style/images/master/btnLogin.png" alt="제안서 작성" /> </button></div>
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
