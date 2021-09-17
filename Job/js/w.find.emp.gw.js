//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
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
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "FIND" }]
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

            gw_job_process.UI();

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
				{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "dept_nm", validate: true },
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
            targetid: "grdData_목록", query: "w_find_emp_gw", title: "사원 검색",
            height: "250", show: true, key: true, multi: true, checkrow: true,
            element: [
                { header: "부서명", name: "dept_nm", width: 80, align: "left" },
                { header: "성명", name: "user_nm", width: 60, align: "center" },
                { header: "사번", name: "emp_no", width: 40, align: "center" },
                { header: "ID", name: "user_id", width: 50, align: "left" },
                { name: "user_tp", hidden: true },
                { name: "user_pw", hidden: true },
                { name: "login_id", hidden: true },
                { name: "use_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_저장", query: "w_find_emp_gw", title: "사원 검색",
            height: "200", show: false,
            editable: { bind: "select", validate: true },
            element: [
				{ header: "부서명", name: "dept_nm", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "성명", name: "user_nm", width: 60, align: "center", editable: { type: "hidden" } },
				{ header: "사번", name: "emp_no", width: 40, align: "center", editable: { type: "hidden" } },
				{ header: "ID", name: "user_id", width: 50, align: "center", editable: { type: "hidden" } },
                { name: "user_tp", hidden: true, editable: { type: "hidden" } },
                { name: "user_pw", hidden: true, editable: { type: "hidden" } },
                { name: "login_id", hidden: true, editable: { type: "hidden" } },
                { name: "use_yn", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_목록", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

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

    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "dept_nm", argument: "arg_dept_nm" },
                { name: "user_nm", argument: "arg_user_nm" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_목록" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_저장" }
        ]
    };
    gw_com_module.objClear(args);

    var data = new Array();
    var ids = gw_com_api.getSelectedRow("grdData_목록", true);
    $.each(ids, function () {
        data.push({
            user_id: gw_com_api.getCellValue("GRID", "grdData_목록", this, "user_id"),
            user_nm: gw_com_api.getCellValue("GRID", "grdData_목록", this, "user_nm"),
            user_tp: gw_com_api.getCellValue("GRID", "grdData_목록", this, "user_tp"),
            dept_nm: gw_com_api.getCellValue("GRID", "grdData_목록", this, "dept_nm"),
            user_pw: gw_com_api.getCellValue("GRID", "grdData_목록", this, "user_pw"),
            login_id: gw_com_api.getCellValue("GRID", "grdData_목록", this, "login_id"),
            emp_no: gw_com_api.getCellValue("GRID", "grdData_목록", this, "emp_no"),
            use_yn: gw_com_api.getCellValue("GRID", "grdData_목록", this, "use_yn")
        });
    });

    var args = {
        targetid: "grdData_저장", edit: true, updatable: true,
        data: data
    };
    gw_com_module.gridInserts(args);

    // 미사용 사용자 => 사용 처리
    ids = gw_com_api.getRowIDs("grdData_저장");
    $.each(ids, function () {

        if (gw_com_api.getValue("grdData_저장", this, "use_yn", true) == "0") {
            gw_com_api.setValue("grdData_저장", this, "use_yn", "1", true);
            gw_com_api.setCRUD("grdData_저장", this, "modify", true);
            gw_com_api.setUpdatable("grdData_저장", this, true);
        }

    })

    var args = {
        target: [
			{ type: "GRID", id: "grdData_저장" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//
function successSave(response, param) {

    processClear();
    processClose({ retrieve: true });

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
    };

    if (param.retrieve != undefined) {
        args.retrieve = param.retrieve;
    }
    gw_com_module.streamInterface(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_목록" },
            { type: "GRID", id: "grdData_저장" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function(param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectEmployee:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.dept_cd
                        != gw_com_api.getValue("frmOption", 1, "dept_nm")) {
                        gw_com_api.setValue("frmOption", 1, "dept_nm", param.data.dept_nm);
                        retrieve = true;
                    }
                    if (param.data.emp_nm
                        != gw_com_api.getValue("frmOption", 1, "emp_nm")) {
                        gw_com_api.setValue("frmOption", 1, "emp_nm", param.data.emp_nm);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve();
                gw_com_api.setFocus("frmOption", 1, "dept_nm");
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave: {
                        if (param.data.result == "YES") processEdit(param.data.arg);
                        else if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    } break;
                    case gw_com_api.v_Message.msg_informSaved: {
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
                    case gw_com_api.v_Message.msg_confirmRemove: {
                        if (param.data.result == "YES") processRemove(param.data.arg);
                    } break;
                    case gw_com_api.v_Message.msg_informRemoved: {
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
                    case gw_com_api.v_Message.msg_informBatched: {
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
                }
            }
            break;
    }


};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//