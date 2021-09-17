//------------------------------------------
// Process about Biz Manager.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
var v_Session = {
    USR_ID: null,
    GW_ID: null,
    USR_NM: null,
    EMP_NO: null,
    DEPT_CD: null,
    DEPT_NM: null,
    POS_CD: null,
    POS_NM: null,
    DEPT_AREA: null,
    DEPT_AUTH: null,
    USER_TP: null,
    CUR_DB: "PLM",
    CUR_LANG: "en"
};
//----------
var v_Current = {};
var v_Job = {};
var v_Tabs = { obj: null, id: null };
var v_Tab = { index: null, title: null, content: null, args: null };
//----------
var v_Option = {
    width: "1",
    theme_1: "1",
    theme_2: "1"
};
//----------
var v_openMenu = { menu_id: gw_com_api.getPageParameter("menu") };
if (v_openMenu.menu_id == "")
    v_openMenu = { menu_id: gw_com_api.getPageParameter("menu_id") };
if (v_openMenu.menu_id == "")
    v_openMenu = { menu_id: gw_com_api.getPageParameter("MENU_ID") };
//if (v_openMenu.menu_id == "")
//    v_openMenu = { menu_id: "TDR_1030" };

//----------
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};
//----------
v_global.logic.nt_tp = "STIMS";
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    before: function () {
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        $.blockUI();
        //----------
        gw_com_module.v_Current.window = "BizProcess";
        gw_com_module.v_Current.launch = "MAIN";
        // prepare dialogue.
        //----------
        var args = { type: "PAGE", page: "MsgProcess", path: "../Master/", title: "TDC Message", width: 420, height: 130 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "LoginProcess", path: "../Master/", title: "로그인", width: 500, height: 140 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "DLG_NOTICE", title: "공지사항", width: 900, height: 750 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "TDR_1021", title: "제공업체", width: 1000, height: 460 };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var args = {
            request: [
                {
                    type: "INLINE", name: "page_width",
                    data: [
                        { title: "고정", value: "1" },
                        { title: "자동 늘임", value: "2" }
                    ]
                },
                {
                    type: "INLINE", name: "master_style",
                    data: [
                        { title: "Basic", value: "1" },
                        { title: "Blue", value: "2" },
                        { title: "Orange", value: "3" }
                    ]
                },
                {
                    type: "INLINE", name: "sub_style",
                    data: [
                        { title: "Basic", value: "1" },
                        { title: "Blue", value: "2" },
                        { title: "Orange", value: "3" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.ready();

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ready all for document.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //0. Main Image
        $(".workarea_bg").css("background-image", "url(/style/images/master/main_tdc.jpg)");

        //----------
        //1. Session
        //----------
        var args = {
            request: "PAGE",
            url: "../Service/svc_Session.aspx",
            handler_success: successSession,
            handler_invalid: invalidSession
        };
        gw_com_module.callRequest(args);
        //----------
        function successSession(data) {

            var redir = gw_com_api.getPageParameter("REDIRECT");
            if (redir != "") {
                redir = decodeURIComponent(redir);
                location.href(redir);
                return;
            }

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
            gw_com_module.v_Session = v_Session;

            var content =
                "<img src=\"/Style/images/common/icon/logon_1_16.png\" align=\"middle\" />" + "&nbsp;" +
                "<span style='font-family: Verdana; font-weight: bold; border-bottom: 1px solid #777777; color: #777777; vertical-align: middle; '>" +
                //"◈ " +
                v_Session.USR_NM + (v_Session.USER_TP == "EMP" ? " " + v_Session.POS_NM + "님 [ " + v_Session.DEPT_NM + " ] " : "님") +
                //"님이 로그인 중입니다." +
                "</span>";
            $("#lyrInfo").html(content);

            var welcome =
                "<span style='font-family: Verdana; font-weight: bold; border-bottom: 1px solid #777777; color: #777777; vertical-align: middle; '>" +
                "원익IPS 협력사 기술자료제공 관리시스템 방문을 환영합니다." +
                "</span>";
            $("#lyrWelcome").html(welcome);

            if (v_Session.USER_TP == "SUPP") {
            } else {
                gw_com_api.hide("btnInfo");
            }

            //----------
            //2. Menu
            //----------
            v_Job.openNotice = false;
            // 신규 가입자
            if (v_Session.USR_ID == "1234567890") {
                processSuppAdd({});
            }
            // 협력사
            else if (v_Session.USER_TP == "SUPP") {
                //if (v_openMenu.menu_id == "") {
                //    v_Job.openNotice = true;
                //}
                var args = [
                    { DATA: ["TDR_1030", "기술자료 제공현황", "TDR_1030", "WIN", "1", "1", "", 0, ""] }
                    //,{ DATA: ["TDR_1040", "기술자료 제공등록", "TDR_1040", "WIN", "1", "1", "", 0, ""] }
                ];
                successMenu(args);
            }
            else {
                var args = [
                    { DATA: ["TDR_1010", "기술자료 요청현황", "TDR_1010", "WIN", "1", "1", "", 0, ""] },
                    { DATA: ["TDR_1040", "기술자료 요청등록", "TDR_1020", "WIN", "1", "1", "", 0, ""] }
                ];
                successMenu(args);
            }

            //3. Notice
            if (v_Job.openNotice) {
                var args = {
                    request: "PAGE",
                    url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                        "?QRY_ID=w_plm_notice" +
                        "&QRY_COLS=nt_title,fr_date,nt_seq" +
                        "&CRUD=R" +
                        "&arg_nt_tp=" + encodeURIComponent(v_global.logic.nt_tp) +
                        "&arg_user_id=" + v_Session.USR_ID,
                    handler_success: successNotice
                }; gw_com_module.callRequest(args);
            }

        }
        //----------
        function invalidSession(data) {

            var param = location.href.indexOf("?") >= 0 ? location.href.slice(location.href.indexOf("?") + 1, location.href.length) : "";
            location.replace("../Master/TDCIntro.aspx" + (param == "" ? "" : "?" + param));

        }
        //----------
        function successMenu(data) {

            if (data == undefined || data.length < 1) {
                alert("사용 권한이 없습니다.");
                window.opener = 'nothing';
                window.open('', '_parent', '');
                self.close();
                return;
            }

            var column = {
                menu_id: 0,
                menu_nm: 1,
                obj_id: 2,
                obj_type: 3,
                exe_yn: 4,
                level_no: 5,
                menu_args: 6,
                child_cnt: 7,
                menu_pid: 8
            };
            var current = {
                id: "",
                title: [],
                url: []
            };

            var contents = "";
            $.each(data, function (i) {
                var menu_id = this.DATA[column.menu_id];
                var menu_nm = this.DATA[column.menu_nm];
                var object = this.DATA[column.obj_id];
                var obj_type = this.DATA[column.obj_type];
                var title = this.DATA[column.menu_nm];
                var url = "../job/" + this.DATA[column.obj_id] + ".aspx";
                var menu_args = this.DATA[column.menu_args];

                if (this.DATA[column.level_no] == 1) {
                    contents =
                        "<li>" +
                        "<a href='#' class='subMenu_launchable'" +
                            " id='menu_" + menu_id + "'" +
                            " title='" + title + "'" +
                            " object='" + object + "'" +
                            " url='" + url + "'" +
                            " args='" + menu_args + "'>" +
                            //"&nbsp;" +
                            //"<img src='../style/images/menu/imgbullet.png' width=8 height=8 alt='' border=0 />" +
                            //"&nbsp;" +
                            menu_nm +
                        "</a > " +
                            "<ul id='subMenu_" + this.DATA[column.menu_id] + "' style='left''>" +
                            "</ul>" +
                        "</li>";
                    $("#topMenu1").append(contents);
                    current.id = this.DATA[column.menu_id];
                }
                else {
                    contents =
                        "<li class='" + (this.DATA[column.child_cnt] == "0" ? "" : "has-sub") + "' style='text-align:left;'>" +
                            "<a href='#' class='" + (this.DATA[column.child_cnt] == "0" ? "subMenu_launchable" : "") + "'" +
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

                }
                if (this.DATA[column.child_cnt] == "0") {

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

                    // 자동실행
                    if (v_openMenu != undefined && v_openMenu.menu_id == menu_id) {
                        v_openMenu.menu_nm = menu_nm;
                        v_openMenu.obj_id = object;
                        v_openMenu.obj_type = obj_type;
                        var param = location.href.slice(location.href.indexOf("?") + 1, location.href.length);
                        v_openMenu.menu_args = (param == "" ? "" : "&" + param);
                        v_openMenu.frame = true;
                    }

                }
            });
            gw_job_process.buildTab("#tabs");

            /**/
            //=====================================================================================
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
            /**/
            //----------
            gw_com_api.show("lyrMaster");
            /**/
            //----------
            gw_com_module.formCreate(args);
            //----------
            var args = { targetid: "frmOption", element: "적용", event: "click", handler: click_frmOption_적용 };
            gw_com_module.eventBind(args);
            //----------
            var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
            gw_com_module.eventBind(args);
            /**/
            //----------
            $.unblockUI();

            if (v_openMenu != undefined && v_openMenu.menu_id != "") {
                if (v_openMenu.obj_id == undefined || v_openMenu.obj_id == "")
                    gw_com_api.showMessage("권한이 없습니다.");
                else {
                    var param = location.href.slice(location.href.indexOf("?") + 1, location.href.length);
                    gw_com_api.launchMenu(v_openMenu);
                }
            }

        }
        //----------
        function successNotice(data) {

            var column = {
                nt_title: 0,
                fr_date: 1,
                nt_seq: 2
            };
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

            if (v_Session.USER_TP == "SUPP" && data.length > 0) {
                v_global.event.data = { nt_seq: data[0].DATA[column.nt_seq] };
                if (cookieGet("DLG_NOTICE_" + v_global.event.data.nt_seq) != "1") {
                    var args = {
                        page: "DLG_NOTICE",
                        param: {
                            ID: gw_com_api.v_Stream.msg_myNotice,
                            data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }

        }
        //----------
        function processSuppAdd(param) {
            var args = {
                type: "PAGE", page: "DLG_SUPPLIER_ADD", title: "업체 등록",
                width: 1000, height: 470, locate: ["center", "center"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_SUPPLIER_ADD",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue
                    }
                }; gw_com_module.dialogueOpen(args);
            }
        }


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // process event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            targetid: "imgMenu",
            event: "click",
            handler: click_imgMenu
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "imgNotice",
            event: "click",
            handler: click_imgNotice
        }; gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnTdrSend", event: "click", handler: click_btnTdrSend };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnHome",
            event: "click",
            handler: click_btnHome
        };
        gw_com_module.eventBind(args);
        /**/
        //----------
        var args = {
            targetid: "btnOption",
            event: "click",
            handler: click_btnOption
        };
        gw_com_module.eventBind(args);
        /**/
        //----------
        var args = {
            targetid: "btnInfo",
            event: "click",
            handler: click_btnInfo
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnHelp",
            event: "click",
            handler: click_btnHelp
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnLeave",
            event: "click",
            handler: click_btnLeave
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "btnNotice",
            event: "click",
            handler: click_imgNotice
        };
        gw_com_module.eventBind(args);

        //----------
        function click_imgMenu() {

            var args = {
                target: [
                    {
                        id: "navMenu"
                    }
                ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_btnHome() {

            if (v_Tabs.obj.tabs("length") > 0) {
                if (!confirm("모든 페이지를 닫고 메인 페이지로 이동합니다.\n계속 하시겠습니까?"))
                    return false;
            }
            var count = v_Tabs.obj.tabs("length");
            for (var i = count - 1; i >= 0; i--)
                v_Tabs.obj.tabs("remove", i);
            gw_com_api.show("lyrNotice");

        }
        //----------
        function click_btnOption() {

            var args = {
                target: [
                    {
                        id: "frmOption",
                        focus: true
                    }
                ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_btnInfo() {

            //----------
            var args = {
                type: "PAGE",
                page: "w_srm9010",
                title: "협력사 정보",
                width: 1100,
                height: 480,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_srm9010",
                    param: {
                        ID: gw_com_api.v_Stream.msg_myInformation,
                        data: {
                            key: v_Session.USR_ID, module: "TDR"
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_btnHelp() {

            //window.open('http://gw.ips.co.kr/WA/board/WAD011001.aspx?itemID=5300&cmpID=1&listtype=A&isExtend=001&authFlag=A&path=1', '_blank');

        }
        //----------
        function click_btnLeave() {

            //----------
            var args = {
                request: "PAGE",
                url: "../Service/svc_Session.aspx?SESSION=OUT",
                block: true,
                handler_success: successLeave
            };
            gw_com_module.callRequest(args);

        }
        //----------
        function click_imgNotice() {

            var args = {
                menu_id: (v_Session.USER_TP == "SUPP" ? "w_srm9020" : "SYS_4210"),
                frame: true,
                add_args: "nt_tp=" + v_global.logic.nt_tp
            };
            gw_com_api.launchMenu(args);

        }
        //----------
        function click_btnTdrSend() {
            var args = { menu_id: "TDR_1030", frame: true,
                add_args: "nt_tp=" + v_global.logic.nt_tp
            }; gw_com_api.launchMenu(args);

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
        //----------
        function successLeave(data) {

            alert("정상적으로 로그아웃 되었습니다.\n로그인 페이지로 이동합니다.");
            location.replace("../Master/TDCIntro.aspx");

        }
    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // common module. (process menu)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // build tab.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    //----------
    buildTab: function (argTab) {

        v_Tabs.id = argTab;
        v_Tabs.obj
            = $(argTab).tabs({
                tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
                add: function (event, ui) { 
                    gw_com_api.hide("lyrAdd");
                    var page = "page_" + v_Tab.index;
                    var key = "";
                    var content =
                        "<iframe" +
                            " id='" + page + "'" +
                            " src='" + v_Tab.content +
                                "?NAME=" + v_Tab.index +
                                "&LAUNCH=CHILD" +
                                "&TYPE=MAIN" +
                                "&PAGE=BizProcess" +
                                "&STYLE=" + v_Option.theme_2 +
                                key +
                                ((v_Tab.args != null && v_Tab.args != "" && v_Tab.args.indexOf("=") < 1) ? "&MENU_ARGS=" + v_Tab.args : "") +
                                ((v_Tab.args != null && v_Tab.args != "" && v_Tab.args.indexOf("=") > 0) ? "&PARAM=true" + v_Tab.args : "") +
                            "'" +
                            " width='100%'" +
                            " height='550px'" +
                            " frameborder='yes' scrolling='no' marginheight=0 marginwidth=0" +
                        ">" +
                        "</iframe>";
                    $(ui.panel).append(content);
                },
                remote: true,
                cache: true,
                ajaxOptions: { async: true },
                collapsible: false
            });

        $(argTab + " span.ui-icon-close").live("click", function () {
            var index = $("li", v_Tabs.obj).index($(this).parent());
            v_Tabs.obj.tabs("remove", index);
            if (v_Tabs.obj.tabs("length") == 0) gw_com_api.show("lyrAdd");
        });

    },
    //----------
    processTab: function (index, title, content, args, menu_id) {

        switch (index) {
            case "SRM_2400":
                {
                    window.open("http://118.34.222.13/pur/pi_login.asp?txtUserID=" + v_Session.GW_ID/*"jhkwon"*/, "popup", "width=1200, height=600, left=0, top=0, toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, scrollbars=yes, copyhistory=no");
                    return;
                }
        }
        v_Tab.index = index;
        v_Tab.title = title;
        v_Tab.content = content;
        v_Tab.args = args;

        var tab_index = v_Tabs.id + "-" + index;
        if ($(tab_index).html() == null)
            v_Tabs.obj.tabs("add", tab_index, title);
        v_Tabs.obj.tabs('select', tab_index);

        // MENU LAUNCH LOG
        var args = {
            url: "COM",
            nomessage: true,
            procedure: "sp_zmenu_log",
            input: [
                { name: "menu_id", value: menu_id, type: "varchar" },
                { name: "user_id", value: v_Session.USR_ID, type: "varchar" }
            ]
        };
        gw_com_module.callProcedure(args);

    },
    //----------
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
    //-- by jj (19.12)
    //----------
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
                to: {
                    type: "PAGE",
                    page: index
                }/*,
            data: {
                param: [
                    { name: "", value: "" }
                ]
            }*/
            };
            gw_com_module.streamInterface(args);
        }
        /*
        else {
            v_Tab.args = "&refresh=1";
            v_Tabs.obj.tabs("add", tab_index, title);
            v_Tabs.obj.tabs('select', tab_index);
        }
        */

    },
    //--
    //----------
    //----------
    closeTab: function (index) {
        var tab_index = v_Tabs.id + "-" + index;
        v_Tabs.obj.tabs("remove", tab_index);
        if (v_Tabs.obj.tabs("length") == 0) gw_com_api.show("lyrAdd");
    }
    // #endregion

};
//----------
function cookieGet(key) {
    var cook = document.cookie + ";";
    var idx = cook.indexOf(key, 0);
    var val = "";
    if (idx != -1) {
        cook = cook.substring(idx, cook.length);
        begin = cook.indexOf("=", 0) + 1;
        end = cook.indexOf(";", begin);
        val = unescape(cook.substring(begin, end));
    }
    return val;
}
//----------
function getManual(param) {

    if (v_Session.USER_TP == "SUPP")
        alert(v_Session.USER_TP);
    else
        alert(v_Session.USER_TP);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process stream.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                var args = {
                    page: "LoginProcess",
                    param: { ID: null, data: null }
                }; gw_com_module.dialogueOpen(args);
            }
            break;
        case gw_com_api.v_Stream.msg_linkPage:
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () {
                        arg = arg + "&" + this.name + "=" + this.value;
                    });
                }
                gw_job_process.linkTab( param.data.page, param.data.title, "../job/" + param.data.page + ".aspx", arg);
            }
            break;
        case gw_com_api.v_Stream.msg_refreshPage:
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () {
                        arg = arg + "&" + this.name + "=" + this.value;
                    });
                }
                gw_job_process.refreshTab(
                    param.data.page, param.data.title, "../job/" + param.data.page + ".aspx", arg);
            }
            break;
        case gw_com_api.v_Stream.msg_closePage:
            {
                gw_job_process.closeTab(param.from.page);
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                var args = { page: "MsgProcess", name: "width",
                    value: (param.data.width != undefined) ? param.data.width : 420
                };
                gw_com_module.dialogueSet(args);
                var args = { page: "MsgProcess",
                    param: { ID: param.data.ID,
                        data: {
                            from: param.from.page,
                            page: param.data.page,
                            type: param.data.type,
                            message: param.data.message,
                            arg: param.data.arg
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                closeDialogue(param.from.page);
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                var args = {
                    to: { page: param.data.to },
                    ID: param.ID,
                    data: {
                        ID: param.data.ID,
                        page: param.data.page,
                        arg: param.data.arg,
                        result: param.data.result
                    }
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_SUPPLIER_ADD":
                    case "w_srm9010": {
                            args.ID = gw_com_api.v_Stream.msg_myInformation;
                            args.data = { key: v_Session.USR_ID, module: "TDR" };
                        } break;
                    case "w_srm9020":   // Iamge Notice
                    case "DLG_NOTICE": {
                            args.ID = gw_com_api.v_Stream.msg_myNotice;
                            args.data = v_global.event.data;
                        } break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "LoginProcess": 
                        break;
                    case "DLG_SUPPLIER_ADD":

                        if (param.data != undefined) {
                            alert("신규 가입에 성공하였습니다. 로그인 페이지로 이동합니다.");
                            location.replace("../Master/TDCIntro.aspx");
                        }
                        else {
                            location.replace("../Master/TDCIntro.aspx");
                        }
                        break;
                }
                closeDialogue(param.from.page);
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//