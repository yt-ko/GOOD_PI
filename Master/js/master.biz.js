//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};
v_global.logic.noticeType = "관리자";
//----------
var v_Session = gw_com_module.v_Session; // gw_com_module.v_Session 을 사용하기 위한 page 변수
//----------
var v_Current = {};
var v_Job = {};
var v_Tabs = { obj: null, id: null };
var v_Tab = { index: null, title: null, content: null, args: null };
var v_Option = { width: "1", theme_1: "1", theme_2: "1"};
//---------- get Page Parameter : Application ID - pi, srm, stims, offer
v_global.logic.appID = gw_com_api.getPageParameter("app");
if (v_global.logic.appID == "") v_global.logic.appID = "pi";
//---------- get Page Parameter : open menu
var v_openMenu = { menu_id: gw_com_api.getPageParameter("menu") };
if (v_openMenu.menu_id == "") v_openMenu.menu_id = gw_com_api.getPageParameter("menu_id") ;
if (v_openMenu.menu_id == "") v_openMenu.menu_id = gw_com_api.getPageParameter("MENU_ID");
if (v_openMenu.menu_id == "") v_openMenu = undefined;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    before: function () {
        $.blockUI();
        gw_com_module.v_Current.window = "BizProcess";
        gw_com_module.v_Current.launch = "MAIN";

        //---------- prepare Dialog Page : Message Box
        var args = {
            type: "PAGE", page: "MsgProcess", path: "../Master/", title: "PLM Message",
            width: 420, height: 130
        };
        gw_com_module.dialoguePrepare(args);
        //---------- prepare Dialog Page : Login Box
        var args = {
            type: "PAGE", page: "LoginProcess", path: "../Master/", title: "로그인",
            width: 500, height: 140, locate: ["center", "center"]
        };
        gw_com_module.dialoguePrepare(args);

        // set selectable data list.
        var args = {
            request: [
                {
                    type: "INLINE", name: "page_width",
                    data: [ { title: "고정", value: "1" }, { title: "자동 늘임", value: "2" } ]
                },
                {
                    type: "INLINE", name: "master_style",
                    data: [ { title: "Basic", value: "1" }, { title: "Blue", value: "2" }, { title: "Orange", value: "3" } ]
                },
                {
                    type: "INLINE", name: "sub_style",
                    data: [ { title: "Basic", value: "1" }, { title: "Blue", value: "2" }, { title: "Orange", value: "3" } ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.ready();

        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // process.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // 1. Session
        //----------------------------------------
        var args = {
            request: "PAGE",
            url: "../Service/svc_Session.aspx",
            handler_success: successSession,
            handler_invalid: invalidSession
        };
        gw_com_module.callRequest(args);
        //---------- save Session Info & get data for Menu, Notice, PO(only SRM)
        function successSession(data) {
            var redir = gw_com_api.getPageParameter("REDIRECT");
            if (redir != "") {
                redir = decodeURIComponent(redir);
                location.href(redir);
                return;
            }

            // save Session Info
            v_Session.USR_ID = data.USR_ID;
            v_Session.GW_ID = data.GW_ID;
            v_Session.USR_NM = data.USR_NM;
            v_Session.EMP_NO = data.EMP_NO;
            v_Session.DEPT_CD = data.DEPT_CD;
            v_Session.DEPT_NM = data.DEPT_NM;
            v_Session.POS_CD = data.POS_CD;
            v_Session.POS_NM = data.POS_NM;
            v_Session.DEPT_AREA = data.DEPT_AREA;
            v_Session.DEPT_AUTH = data.DEPT_AUTH;
            v_Session.USER_TP = data.USER_TP;

            // set login user info
            var content =
                "<img src=\"/Style/images/common/icon/logon_1_16.png\" align=\"middle\" />" + "&nbsp;" +
                "<span style='font-family: Verdana; font-weight: bold; border-bottom: 1px solid #777777; color: #777777; vertical-align: middle; '>" +
                //"◈ " +
                v_Session.USR_NM + (v_Session.USER_TP == "EMP" ? " " + v_Session.POS_NM + "님 [ " + v_Session.DEPT_NM + " ] " : "님") +
                //"님이 로그인 중입니다." +
                "</span>";
            $("#lyrInfo").html(content);

            // for SRM
            if (v_Session.USER_TP != "SUPP") {
                gw_com_api.hide("btnInfo");
                gw_com_api.hide("lyrOrder");
                gw_com_api.hide("right_image_area");
            }

            // 2. Menu
            //----------------------------------------
            var qry_id = "PLM_MENU";
            var args = {
                request: "PAGE",
                url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                        "?QRY_ID=" + qry_id +
                        "&QRY_COLS=menu_id,menu_nm,obj_id,obj_type,exe_yn,level_no,menu_args,child_cnt,menu_pid" +
                        "&CRUD=R" +
                        "&arg_user_id=" + v_Session.USR_ID,
                handler_success: successMenu
            };
            gw_com_module.callRequest(args);

            // 3. Notice
            //----------------------------------------
            var args = {
                request: "PAGE",
                url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                        "?QRY_ID=w_plm_notice" +
                        "&QRY_COLS=nt_title,fr_date" +
                        "&CRUD=R" +
                        "&arg_nt_tp=" + encodeURIComponent(v_global.logic.noticeType) +
                        "&arg_user_id=" + v_Session.USR_ID,
                handler_success: successNotice
            };
            gw_com_module.callRequest(args);

            // 4. PO : for SRM
            //----------------------------------------
            if (v_Session.USER_TP == "SUPP") {
                var args = {
                    request: "PAGE",
                    url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                            "?QRY_ID=PLM_PO_LIST" +
                            "&QRY_COLS=seq,pur_no,pur_date,item_qty,req_date" +
                            "&CRUD=R" + 
                            "&arg_supp_cd=" + v_Session.USR_ID,
                    handler_success: successPO
                };
                gw_com_module.callRequest(args);
            }

        }   // ready

        //----------
        function invalidSession(data) {
            var param = location.href.indexOf("?") >= 0 ? location.href.slice(location.href.indexOf("?") + 1, location.href.length) : "";
            location.replace("../Master/IntroProcess.aspx" + (param == "" ? "" : "?" + param));
        }
        //---------- create Menu List
        function successMenu(data) {

            if (data == undefined || data.length < 1) {
                alert("사용 권한이 없습니다.");
                window.opener = 'nothing';
                window.open('', '_parent', '');
                self.close();
                return;
            }
            // column seq IN data
            var column = { menu_id: 0, menu_nm: 1, obj_id: 2, obj_type: 3, exe_yn: 4, level_no: 5, menu_args: 6, child_cnt: 7, menu_pid: 8 };
            var current = { id: "", title: [], url: [] };

            // create Menu List
            var contents = "";
            $.each(data, function (i) {
                // Level 1 Menu
                if (this.DATA[column.level_no] == 1) {
                    contents =
                        "<li><a href='#'><span>" + this.DATA[column.menu_nm] + "</span></a>" +
                            "<ul id='subMenu_" + this.DATA[column.menu_id] + "' style='left''>" +
                            "</ul>" +
                        "</li>";
                    $("#topMenu1").append(contents);
                    current.id = this.DATA[column.menu_id];
                }
                else {
                    // Level 2, 3 Menu
                    var menu_id = this.DATA[column.menu_id];
                    var menu_nm = this.DATA[column.menu_nm];
                    var object = this.DATA[column.obj_id];
                    var obj_type = this.DATA[column.obj_type];
                    var title = this.DATA[column.menu_nm];
                    var url = "../job/" + this.DATA[column.obj_id] + ".aspx";
                    var menu_args = this.DATA[column.menu_args];

                    var IsWinPage = this.DATA[column.child_cnt] == "0" ? true : false; 
                    contents =
                        "<li class='" + (IsWinPage ? "" : "has-sub") + "' style='text-align:left;'>" +
                            "<a href='#' class='" + (IsWinPage ? "subMenu_launchable" : "") + "'" +
                                " id='menu_" + menu_id + "'" +
                                " title='" + title + "'" +
                                " object='" + object + "'" +
                                " url='" + url + "'" +
                                " args='" + menu_args + "'>" +
                                //"&nbsp;" +
                                //"<img src='../style/images/menu/imgbullet.png' width=8 height=8 alt='' border=0 />" +
                                //"&nbsp;" +
                                menu_nm +
                            "</a>" +
                            "<ul id='subMenu_" + menu_id + "' style='left'>" +
                            "</ul>" +
                        "</li>";
                    $("#subMenu_" + this.DATA[column.menu_pid]).append(contents);

                    // declare Click Event for Menu Items
                    if (IsWinPage) {
                        $("#menu_" + menu_id).click(function () {
                            gw_com_api.launchMenu({
                                menu_id: menu_id,
                                menu_nm: menu_nm,
                                obj_id: object,
                                obj_type: obj_type,
                                menu_args: menu_args,
                                frame: true
                            });
                        });

                        // when First Page
                        if (v_openMenu != undefined && v_openMenu.menu_id == menu_id) {
                            v_openMenu.menu_nm = menu_nm;
                            v_openMenu.obj_id = object;
                            v_openMenu.obj_type = obj_type;
                            var param = location.href.slice(location.href.indexOf("?") + 1, location.href.length);
                            v_openMenu.menu_args = (param == "" ? "" : "&" + param);
                            v_openMenu.frame = true;
                        }
                    } // IsWinPage
                }   // else 
            }); // each(data,
            // create Tabs
            gw_job_process.buildTab("#tabs");

            //======= Style Thema 변경 기능 : 미사용 show: false 
            var args = {
                targetid: "frmOption", type: "FREE", trans: true,
                show: false, border: true,
                editable: { focus: "page_width" },
                content: {
                    row: [
                        {
                            element: [
                                {
                                    name: "master_style", label: { title: "메인 테마 :" },
                                    editable: { type: "select", data: { memory: "master_style" } }
                                },
                                {
                                    name: "sub_style", label: { title: "페이지 테마 :" },
                                    editable: { type: "select", data: { memory: "sub_style" } }
                                }
                            ]
                        },
                        {
                            align: "right",
                            element: [
                                { name: "적용", value: "적용", act: true, format: { type: "button", icon: "실행" } },
                                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ]
                        }
                    ]
                }
            };
            gw_com_api.show("lyrMaster");
            gw_com_module.formCreate(args);
            //----------
            var args = { targetid: "frmOption", element: "적용", event: "click", handler: click_frmOption_적용 };
            gw_com_module.eventBind(args);
            //----------
            var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
            gw_com_module.eventBind(args);
            //----------
            $.unblockUI();
            //---------- Open Initial Page
            if (v_openMenu != undefined) {
                if (v_openMenu.obj_id == undefined || v_openMenu.obj_id == "")
                    gw_com_api.showMessage("권한이 없습니다.");
                else {
                    var param = location.href.slice(location.href.indexOf("?") + 1, location.href.length);
                    gw_com_api.launchMenu(v_openMenu);
                }
            }

        }
        //---------- create Notice List
        function successNotice(data) {

            var column = { nt_title: 0, fr_date: 1 };
            var content = "";
            $.each(data, function (i) {
                content = content +
                    "<tr>" +
                    "<td width='275px' align='left'>" +
                    this.DATA[column.nt_title] +
                    "</td>" +
                    "<td width='100px' align='right'>" +
                    this.DATA[column.fr_date] +
                    "</td>" +
                    "</tr>";
            });
            $("#tblNotice").html(content);

        }
        //---------- create PO List : only SRM
        function successPO(data) {

            var column = {
                seq: 0,
                pur_no: 1,
                pur_date: 2,
                item_qty: 3,
                req_date: 4
            };
            var content = "";
            $.each(data, function (i) {
                content = content +
                    "<tr>" +
                    //"<td width='20px' align='center'>" +
                    //this.DATA[column.seq] +
                    //"</td>" +
                    "<td width='400px'>" +
                    "발주번호: " + this.DATA[column.pur_no] + ", 발주일: " + this.DATA[column.pur_date] + ", 납기요구일: " + this.DATA[column.req_date] +
                    "</td>" +
                    "</tr>";
            });
            $("#tblOrder").html(content);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // process event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { targetid: "btnLeave", event: "click", handler: click_btnLeave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnInfo", event: "click", handler: click_btnInfo };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "imgNotice", event: "click", handler: click_imgNotice };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "imgOrder", event: "click", handler: click_imgOrder };
        gw_com_module.eventBind(args);
        //----------
        function click_btnInfo() {
            var args = {
                type: "PAGE", page: "w_srm9010", title: "협력사 정보", width: 700, height: 466, open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_srm9010",
                    param: {
                        ID: gw_com_api.v_Stream.msg_myInformation,
                        data: { key: v_Session.USR_ID }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }
        //----------
        function click_btnLeave() {
            var args = {
                request: "PAGE",
                url: "../Service/svc_Session.aspx?SESSION=OUT",
                block: true,
                handler_success: successLeave
            };
            gw_com_module.callRequest(args);

        }
        //----------
        function successLeave(data) {
            alert("정상적으로 로그아웃 되었습니다.\n로그인 페이지로 이동합니다.");
            location.replace("../Master/IntroProcess.aspx");
        }
        //----------
        function click_imgNotice() {
            // 공지사항 조회 page : SYS_Notice_View, w_srm9020(SRM)
            var args = {
                menu_id: (v_Session.USER_TP == "SUPP" ? "w_srm9020" : "SYS_4210"),
                frame: true,
                add_args: "nt_tp=" + v_global.logic.noticeType 
            };
            gw_com_api.launchMenu(args);

        }
        //----------
        function click_imgOrder() {

            gw_job_process.processTab( "w_srm1030", "발주서 조회", "../job/w_srm1030.aspx", "", "");

        }
        //----------
        function click_frmOption_적용(ui) {

            v_Option.theme_1 = gw_com_api.getValue("frmOption", 1, "master_style");
            gw_com_api.changeTheme("style_theme", v_Option.theme_1);
            v_Option.theme_2 = gw_com_api.getValue("frmOption", 1, "sub_style");
            gw_com_api.hide("frmOption");

        }
        //----------
        function click_frmOption_취소(ui) {

            gw_com_api.hide("frmOption");
        }
        //---------- delete function by JJJ
        function delScriptByJJJ() {
            //----------
            //var args = { targetid: "btnHome", event: "click", handler: click_btnHome };
            //gw_com_module.eventBind(args);
            //----------
            //var args = { targetid: "btnOption", event: "click", handler: click_btnOption };
            //gw_com_module.eventBind(args);
            //----------
            //var args = { targetid: "btnHelp", event: "click", handler: click_btnHelp };
            //gw_com_module.eventBind(args);

            ////----------
            //function click_btnHome() {
            //    if (v_Tabs.obj.tabs("length") > 0) {
            //        if (!confirm("모든 페이지를 닫고 메인 페이지로 이동합니다.\n계속 하시겠습니까?"))
            //            return false;
            //    }
            //    var count = v_Tabs.obj.tabs("length");
            //    for (var i = count - 1; i >= 0; i--)
            //        v_Tabs.obj.tabs("remove", i);
            //    gw_com_api.show("lyrNotice");
            //}
            ////----------
            //function click_btnOption() {
            //    var args = {
            //        target: [
            //            {
            //                id: "frmOption",
            //                focus: true
            //            }
            //        ]
            //    };
            //    gw_com_module.objToggle(args);
            //}
            ////----------
            //function click_btnHelp() {
            //    //window.open('http://gw.ips.co.kr/WA/board/WAD011001.aspx?itemID=5300&cmpID=1&listtype=A&isExtend=001&authFlag=A&path=1', '_blank');
            //}
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // common module. (process menu)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //----------
    buildTab: function (argTab) {

        v_Tabs.id = argTab;
        v_Tabs.obj
            = $(argTab).tabs({
                tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
                remote: true, cache: true, ajaxOptions: { async: true }, collapsible: false,
                // create iFrame for page : called by this.processTab
                add: function (event, ui) {
                    gw_com_api.hide("lyrAdd");
                    var page = "page_" + v_Tab.index;
                    var pageArgs = ""; // set Page Arguments
                    if (v_Tab.args != null && v_Tab.args != "") {
                        pageArgs = (v_Tab.args.indexOf("=") < 1 ? "&MENU_ARGS=" : "&PARAM=true") + v_Tab.args;
                    }
                    var content =
                        "<iframe" +
                            " id='" + page + "'" + " name='" + page + "'" +    // for get frame name by JJJ at 2021.03.28
                            " src='" + v_Tab.content + "?NAME=" + v_Tab.index +
                                "&LAUNCH=CHILD&TYPE=MAIN&PAGE=BizProcess" +
                                "&STYLE=" + v_Option.theme_2 + pageArgs + "'" +
                            " width='100%' height='550px' frameborder='yes' scrolling='no' marginheight=0 marginwidth=0" +
                        "></iframe>";
                    $(ui.panel).append(content);
                }
            });

        $(argTab + " span.ui-icon-close").live("click", function () {
            var index = $("li", v_Tabs.obj).index($(this).parent());
            v_Tabs.obj.tabs("remove", index);
            if (v_Tabs.obj.tabs("length") == 0) gw_com_api.show("lyrAdd");
        });

    },
    //---------- create TabPage <- gw_com_api.launchMenu() <- Menu Click
    processTab: function (index, title, content, args, menu_id) {

        v_Tab.index = index;
        v_Tab.title = title;
        v_Tab.content = content;
        v_Tab.args = args;

        var tab_index = v_Tabs.id + "-" + index;
        if ($(tab_index).html() == null)
            v_Tabs.obj.tabs("add", tab_index, title);   // -> buildTab.add
        v_Tabs.obj.tabs('select', tab_index);

    },
    //---------- link TabPage <- msg_linkPage
    linkTab: function (index, title, content, args) {

        v_Tab.index = index;
        v_Tab.title = title;
        v_Tab.content = content;
        v_Tab.args = args;

        var tab_index = v_Tabs.id + "-" + index;
        if ($(tab_index).html() != null) {
            this.closeTab(index);
        }
        v_Tabs.obj.tabs("add", tab_index, title);
        v_Tabs.obj.tabs('select', tab_index);

    },
    //---------- refresh TabPage <- msg_refreshPage
    refreshTab: function (index, title, content, args) {

        v_Tab.index = index;
        v_Tab.title = title;
        v_Tab.content = content;
        v_Tab.args = args;

        var tab_index = v_Tabs.id + "-" + index;
        if ($(tab_index).html() != null) {
            //v_Tabs.obj.tabs('select', tab_index);
            var args = {
                ID: gw_com_api.v_Stream.msg_refreshPage,
                to: { type: "PAGE", page: index }
            };
            gw_com_module.streamInterface(args);
        }

    },
    //---------- close TabPage <- msg_closePage
    closeTab: function (index) {
        var tab_index = v_Tabs.id + "-" + index;
        v_Tabs.obj.tabs("remove", tab_index);
        if (v_Tabs.obj.tabs("length") == 0) gw_com_api.show("lyrAdd");
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process stream.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
getSession = function () {

    return v_Session;

};
//----------
resizeFrame = function (args) {

    if (args.id == "MsgProcess" && args.height > 0) {
        var param = {
            page: "MsgProcess",
            name: "height",
            value: args.height + 40
        };
        gw_com_module.dialogueSet(param);
        var args = {
            page: "MsgProcess",
            name: "position",
            value: ["center"]
        };
        gw_com_module.dialogueSet(args);
    }
    else {
        //alert(args.height);
        if (args.height < 545) args.height = 545;
        $("#page_" + args.id).attr("height", args.height + 5);
    }

};
//----------
function closeDialogue(page) {

    var args = {
        page: page
    };
    gw_com_module.dialogueClose(args);

}
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showLogin:
            {
                var args = { page: "LoginProcess", param: { ID: null, data: null } };
                gw_com_module.dialogueOpen(args);
            } break;
        case gw_com_api.v_Stream.msg_linkPage:
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () {
                        arg = arg + "&" + this.name + "=" + this.value; });
                }
                gw_job_process.linkTab(param.data.page, param.data.title, "../job/" + param.data.page + ".aspx", arg);
            } break;
        case gw_com_api.v_Stream.msg_refreshPage:
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () { arg = arg + "&" + this.name + "=" + this.value; });
                }
                gw_job_process.refreshTab( param.data.page, param.data.title, "../job/" + param.data.page + ".aspx", arg);
            } break;
        case gw_com_api.v_Stream.msg_closePage:
            {
                gw_job_process.closeTab(param.from.page);
            } break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                var args = { page: "MsgProcess", name: "width", value: (param.data.width != undefined) ? param.data.width : 420 };
                gw_com_module.dialogueSet(args);
                var args = {
                    page: "MsgProcess",
                    param: { ID: param.data.ID,
                        data: { from: param.from.page, page: param.data.page, type: param.data.type, message: param.data.message, arg: param.data.arg }
                    }
                };
                gw_com_module.dialogueOpen(args);
            } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                closeDialogue(param.from.page);
                var args = {
                    ID: param.ID,
                    to: { page: param.data.to },
                    data: { ID: param.data.ID, page: param.data.page, arg: param.data.arg, result: param.data.result }
                };
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
                switch (param.from.page) {
                    case "w_srm9010": //협력사 정보
                        {
                            args.ID = gw_com_api.v_Stream.msg_myInformation;
                            args.data = {
                                key: v_Session.USR_ID
                            };
                        }
                        break;
                    case "w_srm9020": // 협력사 공지 조회
                        {
                            args.ID = gw_com_api.v_Stream.msg_myNotice;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "LoginProcess":
                        {
                        }
                        break;
                }
                closeDialogue(param.from.page);
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//