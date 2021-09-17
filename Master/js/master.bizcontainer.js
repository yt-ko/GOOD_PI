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
    USER_TP: null
};
//----------
var v_Current = {
};
//----------
var v_Job = {
};
//----------
var v_Tabs = { obj: null, id: null };
var v_Tab = { index: null, title: null, content: null, args: null };
//----------
var v_Option = {
    width: "1",
    theme_1: "1",
    theme_2: "1"
};
//----------

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

        /*
        if ($.browser.msie 
        && $.browser.version.slice(0,1) >= 8) {}
        else {
        if (!gw_com_api.showMessage(
        "이 사이트는 IE 8.0 이상부터 최적화되어 있습니다.\n하위 버전에서 실행할 경우 일부 UI가 제대로 보이지 않거나 오동작이 발생할 수도 있습니다.\n계속 하시겠습니까?",
        "yesno"
        ))
        return;
        }
        */
        //----------
        $.blockUI();
        //----------
        gw_com_module.v_Current.window = "BizContainer";
        gw_com_module.v_Current.launch = "MAIN";
        //----------
        var args = {
            type: "PAGE",
            page: "MsgProcess",
            path: "../Master/",
            title: "PLM Message",
            width: 420,
            height: 130
        };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // start.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_job_process.ready();

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

        var user_id = gw_com_api.getPageParameter("user_id");
        if (user_id == "")
            user_id = gw_com_api.getPageParameter("USER_ID");

        if (user_id == "") {
            var args = {
                request: "PAGE",
                url: "../Service/svc_Session.aspx",
                handler_success: successSession,
                handler_invalid: invalidSession
            };
            gw_com_module.callRequest(args);
        } else {
            var args = {
                request: "PAGE",
                url: "../Service/svc_Auth.aspx" +
                        "?QUERY=PLM_AUTH_ID" +
                        "&arg_login_id=" + user_id,
                block: true,
                handler_success: successAuth,
                handler_invalid: invalidSession
            };
            gw_com_module.callRequest(args);
        }
        //----------
        function successAuth(data) {

            var args = {
                request: "PAGE",
                url: "../Service/svc_Session.aspx",
                handler_success: successSession,
                handler_invalid: invalidSession
            };
            gw_com_module.callRequest(args);

        }
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

            var menu_id = gw_com_api.getPageParameter("menu");
            if (menu_id == "")
                menu_id = gw_com_api.getPageParameter("menu_id");
            if (menu_id == "")
                menu_id = gw_com_api.getPageParameter("MENU_ID");
            //----------
            var args = {
                request: "PAGE",
                url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                        "?QRY_ID=PLM_MENU_4_CONTAINER" +
                        "&QRY_COLS=menu_id,menu_nm,obj_id,exe_yn,level_no,menu_args,child_cnt,menu_pid" +
                        "&CRUD=R" +
                        "&arg_menu_id=" + menu_id,
                handler_success: successMenu
            };
            gw_com_module.callRequest(args);

        }
        //----------
        function invalidSession(data) {

            var param = location.href.indexOf("?") >= 0 ? location.href.slice(location.href.indexOf("?") + 1, location.href.length) : "";
            location.replace("../Master/IntroProcess.aspx" + (param == "" ? "" : "?" + param));

        }
        //----------
        function successMenu(data) {

            if (data.length != 1) {
                gw_com_api.showMessage("Invalid Menu Id!");
                self.close();
                return;
            }

            var column = {
                menu_id: 0,
                menu_nm: 1,
                obj_id: 2,
                exe_yn: 3,
                level_no: 4,
                menu_args: 5,
                child_cnt: 6,
                menu_pid: 7
            };
            var current = {
                id: "",
                title: [],
                url: []
            };

            gw_job_process.buildTab("#tabs");
            gw_com_api.show("lyrMaster");

            // Parameter
            var ex_args = location.search.substring(1).split("&");
            var new_args = "";
            $.each(ex_args, function () {
                if ($.inArray(this.split("=")[0], ["user_id", "passwd", "menu"]) == -1)
                    new_args += "&" + decodeURIComponent(this);
            })

            var object = data[0].DATA[column.obj_id];
            var menu_nm = data[0].DATA[column.menu_nm];
            var url = "../job/" + data[0].DATA[column.obj_id] + ".aspx";
            var args = data[0].DATA[column.menu_args] + new_args;
            gw_job_process.processTab(object, menu_nm, url, args);

            //----------
            $.unblockUI();

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
		            var page = "page_" + v_Tab.index;
		            var key = "";
		            if (v_Job.HCEM != undefined) {
		                $.each(v_Job.HCEM, function (i) {
		                    key = key +
		                        "&" + this.name + "=" + this.value
		                });
		            }
		            var content =
					    "<iframe" +
						    " id='" + page + "'" +
						    " src='" + v_Tab.content +
						        "?USR_ID=" + v_Session.USR_ID +
	                            "&USR_NM=" + v_Session.USR_NM +
	                            "&EMP_NO=" + v_Session.EMP_NO +
	                            "&DEPT_CD=" + v_Session.DEPT_CD +
	                            "&DEPT_NM=" + v_Session.DEPT_NM +
	                            "&POS_CD=" + v_Session.POS_CD +
	                            "&POS_NM=" + v_Session.POS_NM +
	                            "&DEPT_AREA=" + v_Session.DEPT_AREA +
	                            "&DEPT_AUTH=" + v_Session.DEPT_AUTH +
	                            "&GW_ID=" + v_Session.GW_ID +
	                            "&USER_TP=" + v_Session.USER_TP +
							    "&NAME=" + v_Tab.index +
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
            if (v_Tabs.obj.tabs("length") == 0) {
                self.close();
                return;
            }
        });

    },
    //----------
    processTab: function (index, title, content, args) {

        switch (index) {
            case "SRM_2400":
                {
                    window.open("http://118.34.222.13/pur/pi_login.asp?txtUserID=" + v_Session.GW_ID/*"jhkwon"*/, "popup", "width=1200, height=600, left=0, top=0, toolbar=no, location=no, directories=no, status=no, menubar=no, resizable=yes, scrollbars=yes, copyhistory=no");
                    return;
                }
            case "w_qcm5050":
            case "w_qcm5060":
                {
                    alert("현재 개발 기능 보완 및 테스트 중입니다. 잠시 기다려 주십시오.");
                    return;
                }
        }
        v_Tab.index = index;
        v_Tab.title = title;
        v_Tab.content = content;
        v_Tab.args = args;

        var tab_index = v_Tabs.id + "-" + index;
        if ($(tab_index).html() != null) {
            v_Tabs.obj.tabs('select', tab_index);
        }
        else {
            v_Tabs.obj.tabs("add", tab_index, title);
            v_Tabs.obj.tabs('select', tab_index);
        }

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
    //----------
    closeTab: function (index) {
        var tab_index = v_Tabs.id + "-" + index;
        v_Tabs.obj.tabs("remove", tab_index);
        if (v_Tabs.obj.tabs("length") == 0) {
            self.close();
            return;
        }

    }
    // #endregion

};

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
        case gw_com_api.v_Stream.msg_linkPage:
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () {
                        arg = arg +
                            "&" + this.name + "=" + this.value;
                    });
                }
                gw_job_process.linkTab(
				            param.data.page,
				            param.data.title,
				            "../job/" + param.data.page + ".aspx",
				            arg);
            }
            break;
        case gw_com_api.v_Stream.msg_closePage:
            {
                gw_job_process.closeTab(param.from.page);
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                var args = {
                    page: "MsgProcess",
                    name: "width",
                    value: (param.data.width != undefined) ? param.data.width : 420
                };
                gw_com_module.dialogueSet(args);
                var args = {
                    page: "MsgProcess",
                    param: {
                        ID: param.data.ID,
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
                var args = {
                    to: {
                        page: param.data.to
                    },
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
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue(param.from.page);
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//