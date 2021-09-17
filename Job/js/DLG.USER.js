//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

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
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_EMP", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "user_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "dept_nm", label: { title: "부서명 :" },
				                editable: { type: "text", size: 10, maxlength: 10 }
				            },
				            {
				                name: "user_nm", label: { title: "성명 :" },
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "실행", act: true, show: false, format: { type: "button" } }
				        ]
                    }
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_SUPP", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "user_nm", label: { title: "협력사명 :" },
				                editable: { type: "text", size: 15, maxlength: 50 }
				            },
				            { name: "실행", show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EMP", query: "DLG_USER", title: "사원 정보",
            height: "200", show: true, key: true, number: true, caption: false,
            element: [
				{ header: "성명", name: "user_nm", width: 60, align: "center" },
				{ header: "사번", name: "emp_no", width: 70, align: "center" },
				{ header: "부서명", name: "dept_nm", width: 100, align: "center" },
				{ header: "직급", name: "pos_nm", width: 80, align: "center" },
				{ name: "user_id", hidden: true },
				{ name: "dept_cd", hidden: true },
				{ name: "rgst_no", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUPP", query: "DLG_USER", title: "협력사 정보",
            height: "200", show: true, key: true, number: true, caption: false,
            element: [
				{ header: "협력사명", name: "user_nm", width: 200, align: "left" },
				{ header: "거래처코드", name: "user_id", width: 70, align: "center" },
				{ header: "사업자번호", name: "rgst_no", width: 80, align: "center", mask: "biz-no" },
				{ name: "emp_no", hidden: true },
				{ name: "dept_cd", hidden: true },
				{ name: "dept_nm", hidden: true },
				{ name: "pos_nm", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_EMP", offset: 8 },
                { type: "GRID", id: "grdList_SUPP", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
				{ type: "LAYER", id: "lyrTab_01", title: "사원" },
				{ type: "LAYER", id: "lyrTab_02", title: "협력사" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();
    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_EMP", event: "itemkeyenter", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_SUPP", event: "itemkeyenter", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_EMP", grid: true, event: "rowdblclick", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_SUPP", grid: true, event: "rowdblclick", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_EMP", grid: true, event: "rowkeyenter", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_SUPP", grid: true, event: "rowkeyenter", handler: informResult };
        gw_com_module.eventBind(args);
        //----------

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
processRetrieve = function(param) {

    var tab_idx = $("#lyrTab").tabs("option", "selected");
    v_global.logic.search_obj = "frmOption";
    v_global.logic.target_obj = "grdList";
    v_global.logic.user_tp = "";
    var args;
    switch (tab_idx) {
        case 0:
            v_global.logic.user_tp = "EMP";
            args = {
                source: {
                    element: [
				        { name: "dept_nm", argument: "arg_dept_nm" },
				        { name: "user_nm", argument: "arg_user_nm" }
                    ],
                    argument: [
                        { name: "arg_use_yn", value: "1" },
                        { name: "arg_user_tp", value: v_global.logic.user_tp }
                    ]
                }
            };
            break;
        case 1:
            v_global.logic.user_tp = "SUPP";
            args = {
                source: {
                    element: [
        				{ name: "user_nm", argument: "arg_user_nm" }
                    ],
                    argument: [
                        { name: "arg_use_yn", value: "1" },
                        { name: "arg_user_tp", value: v_global.logic.user_tp },
                        { name: "arg_dept_nm", value: "%" }
                    ]
                }
            };
            break;
        default:
            return;
            break;
    }
    v_global.logic.search_obj += "_" + v_global.logic.user_tp;
    v_global.logic.target_obj += "_" + v_global.logic.user_tp;
    args.source.type = "FORM";
    args.source.id = v_global.logic.search_obj;
    args.target = [{ type: "GRID", id: v_global.logic.target_obj, focus: true, select: true }];

    gw_com_module.objRetrieve(args);

};
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informResult(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: {
            user_tp: v_global.logic.user_tp,
            user_id: gw_com_api.getValue(v_global.logic.target_obj, "selected", "user_id", true),
            user_nm: gw_com_api.getValue(v_global.logic.target_obj, "selected", "user_nm", true),
            dept_cd: gw_com_api.getValue(v_global.logic.target_obj, "selected", "dept_cd", true),
            dept_nm: gw_com_api.getValue(v_global.logic.target_obj, "selected", "dept_nm", true),
            pos_nm: gw_com_api.getValue(v_global.logic.target_obj, "selected", "pos_nm", true),
            biz_no: gw_com_api.getValue(v_global.logic.target_obj, "selected", "rgst_no", true)
        }
    }
    gw_com_module.streamInterface(args);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    switch (param.data.user_tp) {
                        case "EMP":
                            gw_com_api.selectTab("lyrTab", 1);
                            v_global.logic.search_obj = "frmOption_" + param.data.user_tp;
                            break;
                        case "SUPP":
                            gw_com_api.selectTab("lyrTab", 2);
                            v_global.logic.search_obj = "frmOption_" + param.data.user_tp;
                            break;
                    }
                }
                if (retrieve)
                    processRetrieve({});
                else
                    gw_com_api.setFocus(v_global.logic.search_obj, 1, "user_nm");
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//