<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Biz.master" AutoEventWireup="true"
    CodeFile="TDCProcess.aspx.cs" Inherits="Master_TDCProcess" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objMasterHead" runat="Server">
    <link id="style_theme" href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css" rel="stylesheet" type="text/css" />
    <link href="../Style/dropdown_menu_tdc.css" rel="stylesheet" type="text/css" />
    <script src="js/master.tdc.js" type="text/javascript"></script>
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
                <!-- top 영역 -->
                <!--table border="0" width="100%" cellspacing="0" style="padding: 0; margin: 0; white-space: nowrap;">
                    <tr>
                        <td align="left" style="padding-left: 25px;">&nbsp;</td>
                        <td width="100%" align="right" valign="middle" style="padding-right: 50px;">
                            &nbsp;
                        </td>
                        <td  align="right" >
                            <img src="../style/images/master/main_home.png" border="0" alt="Home"/>
                            <img src="../style/images/master/main_notice.png" border="0" alt="공지사항"/>
                            <img src="../style/images/master/main_apsystems_homepage.png" border="0" alt="Home page"/>
                        </td>
                    </tr>
                <!--table -->
                <!--top 영역 끝 -->
                <!-- top-2 영역 -->
                <table border="0" width="100%" cellspacing="0" cellpadding="0" style="padding: 0; margin: 0; white-space: nowrap;">
                    <tr>
                        <td align="left" style="padding-left: 0px;">&nbsp;</td>
                        <td width="100%" align="right" valign="middle" style="padding-right: 10px;">
                            <div id="lyrInfo">
                            </div>
                        </td>
                        <td width="100%" align="right" style="padding-right: 2px;">
                            <button id="btnLeave" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
			                    <img src="../style/images/master/main_logout.png" border="0" alt="로그아웃"/>
                            </button>
                            <img id="imgManual" src="../style/images/master/main_top_manual.png" alt="STIMS 매뉴얼" style="cursor: pointer;" onclick="window.open('/Files/Manual/GW_Masual_기술자료제공(협력사용).pdf');" />
			                <button id="btnInfo" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
			                    <img src="../style/images/master/main_mem_edit.png" border="0" alt="정보변경"/>
			                </button>
			            </td>
                    </tr>
                </table>
                <!-- top-2 영역 끝 -->
                <!-- top-3 영역 -->
                <table border="0" width="100%" cellspacing="0" cellpadding="0" style="padding: 0; margin: 0; white-space: nowrap;">
                    <tr>
                        <td align="left" style="padding-left: 0px;"><img src="../style/images/master/main_log.png" border="0" alt="Main"/></td>
                         
                        <td width="100%" align="right" valign="bottom" >
                            <div style="position:relative;">
                                <!-- -->
                                <div id='cssmenu'  >
                                <ul id="topMenu1"> 
                                     <!--li><a href='#'><span>Home</span></a></li-->
                                </ul>
                                </div>
                                <!-- -->
                            </div>
                        </td>
                    </tr>
                </table>
                <!-- top-3 영역 끝 -->

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
                <!---->
            </td>
        </tr>
        <tr>
            <td align="left" valign="top">
            </td>
        </tr>
        <tr>
            <td>
                <table border="0" width="100%" cellspacing="0" style="padding: 0; margin: 0; white-space: nowrap;">
                    <tr>
                        <td width="100%" valign="top">
                            <table border="0" width="100%" cellspacing="0" style="padding: 0; margin: 0; white-space: nowrap;">
                                <tr>
                                    <td valign="top">
                                        <div class="workarea_bg">
                                            <div id="tabs">
                                                <ul>
                                                </ul>
                                            </div>
                                            <div id="lyrAdd">
                                                <!-- Notice Start -->
                                                <div id="lyrWelcome" style="width: 600px; float: left; overflow: hidden; margin-top: 240px; margin-left: 400px; font-family: Verdana; font-size: 14px;">
                                                
                                                </div>
                                                <div id="lyrNotice" style="width: 500px; float: left; overflow: hidden; margin-top: 200px; margin-left: 4px;">
                                                    <table border="0" width="100%" cellpadding="2" cellspacing="0">
                                                        <tr>
                                                            <td colspan="3" align="left">
                                                                <img id="imgNotice" align="left" src="../style/images/master/main_notice_list2.png" alt="공지사항" style="cursor: pointer;" />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <table id="tblNotice" border="0" cellpadding="2" cellspacing="2" style="margin: 0; padding: 0;">
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!-- Notice End -->
                                                <!-- 매뉴얼 시작-->
                                                <div id="right_image_area" style="width: 500px; float: right; overflow: hidden; margin-top: 200px; margin-right: 4px;">
                                                    <table border="0" width="100%" cellpadding="2" cellspacing="0">
                                                        <tr>
                                                            <td align="left">
                                                                <button id="btnTdrSend" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
			                                                        <img src="../style/images/master/main_stims_send.png" border="0" alt="기술자료 제공현황"/>
                                                                </button>
                                                            </td>
                                                            <td align="right">
                                                                <img id="img4" src="../style/images/master/main_stims_manual.png" alt="STIMS 매뉴얼" style="cursor: pointer;" onclick="window.open('/Files/Manual/GW_Masual_기술자료제공(협력사용).pdf');" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <!-- 매뉴얼 끝 -->
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
