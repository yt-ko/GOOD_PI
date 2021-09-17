<%@ Page Title="" Language="C#" MasterPageFile="~/Master/Biz.master" AutoEventWireup="true"
    CodeFile="BizProcess.aspx.cs" Inherits="Master_BizProcess" %>

<asp:Content ID="Content1" ContentPlaceHolderID="objMasterHead" runat="Server">
    <link id="style_theme" href="../Style/theme-smoothness/jquery-ui-1.8.9.custom.css" rel="stylesheet" type="text/css" />
    <link href="../Style/dropdown_menu.css" rel="stylesheet" type="text/css" />
    <script src="js/master.biz.js?190627" type="text/javascript"></script>
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
                <!-- top-1 영역 -->
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
			                <button id="btnInfo" style="border: 0; margin: 0; padding: 0; background-color: Transparent; cursor: pointer;">
			                    <img src="../style/images/master/main_mem_edit.png" border="0" alt="정보변경"/>
			                </button>
			            </td>
                    </tr>
                </table>
                <!-- top-2 영역 끝 -->
                <!-- top-2 영역 : Menu Bar -->
                <table border="0" width="100%" cellspacing="0" cellpadding="0" style="padding: 0; margin: 0; white-space: nowrap;">
                    <tr>
                        <td align="left" style="padding-left: 0px;"><img src="../style/images/master/main_log.png" border="0" alt="Main"/></td>
                        <td width="100%" align="right" valign="bottom" >
                            <div style="position:relative;">
                                <div id='cssmenu'  >
                                <ul id="topMenu1"> 
                                </ul>
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
                <!-- top-2 영역 끝 -->
                <div style="width:1200px; position: absolute; top: 100px;">
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
                                                <div id="lyrNotice" style="width: 400px; float:left; overflow: hidden; margin-top: 300px; margin-left: 0px;">
                                                    <table border="0" width="100%" cellpadding="2" cellspacing="0">
                                                        <tr>
                                                            <td colspan="3" align="left">
                                                                <img id="imgNotice" align="left" src="../style/images/master/main_notice_list.png" alt="공지사항" style="cursor: pointer; "   />                                                            
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
                                                <!-- Order Start -->
                                               <div id="lyrOrder" style="width: 470px; float:left; overflow: hidden; margin-top:300px; margin-left:5px;">
                                                    <table border="0" width="100%" cellpadding="2" cellspacing="0">
                                                        <tr>
                                                            <td colspan="3" align="left">
                                                                <img id="imgOrder" src="../style/images/master/main_order_list.png" alt="발주서현황" style="cursor: pointer;" />
                                                            
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <table id="tblOrder" border="0" cellpadding="2" cellspacing="2" style="margin: 0; padding: 0;">
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div> 
                                                <!-- Order End -->
                                                <!-- 메인 이미지 전화 및 Q&A게시판 시작-->
                                                <div id="right_image_area" style="width: 300px; float:right; overflow: hidden; margin-top:300px;">
                                                    <table border="0" width="100%" cellpadding="2" cellspacing="0">
                                                        <tr>
                                                            <td  align="right">
                                                                <img src="../style/images/master/main_supp_title.png" alt="srm_title"  />                                                             
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td  align="right">
                                                                <img id="img4" src="../style/images/master/main_srm_02.png" alt="매뉴얼" style="cursor: pointer;" onclick="window.open('/Files/Manual/협력사 매뉴얼(SRM).pdf');" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div> 
                                                <!-- 메인 이미지 전화 및 Q&A 게시판 끝 -->
                                            </div>
                                        </div>
                                        <%--<div class="main_footer"><br /><br />                                            
                                경기도 화성시 동탄면 동부대로 830-46<br />
                                Copyright(c)2013 AP Systems. All Right Reserved. 
                                        </div>--%>
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