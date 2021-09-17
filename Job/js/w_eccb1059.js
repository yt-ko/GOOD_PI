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
    logic: {}
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

        // set data.
        var args = {
            request: [
                    {
                        type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                        param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                    }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // 관리자
        v_global.logic.mng_yn = (gw_com_module.v_Session.USER_TP == "SYS" || gw_com_module.v_Session.USR_ID == "bhpark2");
        //console.log(v_global.logic.mng_yn);

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
                { name: "조회", value: "새로고침", act: true },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_2", type: "FREE",
            show: true, border: true, align: "left",
            editable: { bind: "open", focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 : " },
                                editable: { type: "select", validate: { rule: "required" }, data: { memory: "DEPT_AREA_IN" } }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmOption1_data").css("padding-left", "5px");
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "w_eccb1059_1", title: "CRM 부서",
            caption: true, width: 400, height: 440, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "dept_nm", validate: true },
            element: [
                {
                    header: "부서코드", name: "dept_cd", width: 100, align: "center",
                    editable: { bind: "create", type: (v_global.logic.mng_yn ? "text" : "hidden"), maxlength: 20 }
                },
                {
                    header: "부서명", name: "dept_nm", width: 180, mask: "search",
                    editable: { bind: "create", type: "text", validate: { rule: "required", message: "부서명" } }
                },
                {
                    header: "사용", name: "use_yn", width: 60, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { name: "idx", editable: { type: "hidden" }, hidden: true },
                { name: "dept_area", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "w_eccb1059_2", title: "접수담당자",
            caption: true, width: 700, height: 440, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "emp_nm", validate: true },
            element: [
                {
                    header: "사원번호", name: "emp_no", width: 100, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "사원명", name: "emp_nm", width: 100, align: "center",// mask: "search",
                    //editable: { bind: "create", type: "text", validate: { rule: "required", message: "사원명" } }
                    editable: { type: "hidden" }
                },
                { header: "직함", name: "pos_nm", width: 100, align: "center" },
                {
                    header: "사용", name: "use_yn", width: 60, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { header: "부서", name: "dept_nm", width: 250 },
                { name: "idx", editable: { type: "hidden" }, hidden: true },
                { name: "pid", editable: { type: "hidden" }, hidden: true },
                { name: "dept_cd", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselecting", handler: rowselecting_grdData_MAIN };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: rowselected_grdData_MAIN };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function rowselecting_grdData_MAIN(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_MAIN(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        gw_com_api.setValue("frmOption_2", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA);
        //----------
        processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            {
                v_global.process.handler = processRetrieve;
                if (!checkUpdatable({})) return;
                processRetrieve({});
            }
            break;
        case "추가":
            {
                if (param.object == "lyrMenu_1") {
                    v_global.process.handler = processInsert;
                    if (!checkUpdatable({})) return;
                    var args = { target: [{ type: "FORM", id: "frmOption_2" }] };
                    if (gw_com_module.objValidate(args) == false) return false;
                    processItemdblclick({ object: "grdData_MAIN", row: "new", element: "dept_nm", type: "GRID" });
                } else {
                    if (!checkManipulate({})) return;
                    if (!checkUpdatable({ check: true, master: true })) return false;
                    processItemdblclick({ object: "grdData_SUB", row: "new", element: "emp_nm", type: "GRID" });
                }
            }
            break;
        case "삭제":
            {
                if (param.object == "lyrMenu_1") {
                    v_global.process.handler = processRemove;
                    if (!checkManipulate({})) return;
                    checkRemovable({});
                } else {
                    if (!checkManipulate({})) return;
                    var args = { targetid: "grdData_SUB", row: "selected", select: true };
                    gw_com_module.gridDelete(args);
                }
            }
            break;
        case "저장":
            {
                processSave({});
            }
            break;
        case "닫기":
            {
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    switch (param.element) {
        case "dept_area":
            {
                processRetrieve({});
            }
            break;
        case "dept_cd":
            {
                ids = gw_com_api.getRowIDs("grdData_SUB");
                $.each(ids, function () {
                    if (param.value.prev
                        == gw_com_api.getValue("grdData_SUB", this, "dept_cd", true))
                        gw_com_api.setValue("grdData_SUB", this, "dept_cd", param.value.current, true, true);
                });
            }
            break;
    }
    return true;

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_MAIN", "selected", true);

}
//----------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            {
                type: "GRID", id: "grdData_MAIN",
                refer: param.master ? false : true
            },
            {
                type: "GRID", id: "grdData_SUB",
                refer: param.sub ? false : true
            }
        ]
    };
    //var args = {
    //    check: param.check,
    //    target: []
    //};
    //if (param.master)
    //    args.target[args.target.length] = { type: "GRID", id: "grdData_MAIN" };
    //else if (param.sub)
    //    args.target[args.target.length] = { type: "GRID", id: "grdData_SUB" };
    //else
    //    args.target = [
    //        { type: "GRID", id: "grdData_MAIN" },
    //        { type: "GRID", id: "grdData_SUB" }
    //    ];

    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmOption_2" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args = {
        source: {
            type: "FORM", id: "frmOption_2",
            element: [
                { name: "dept_area", argument: "arg_dept_area" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_SUB" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_MAIN", row: "selected", block: true,
            element: [
                { name: "idx", argument: "arg_pid" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_SUB" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_MAIN", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    if (param.master) {
        var row = gw_com_api.getFindRow("grdData_MAIN", "dept_cd", param.data.dept_cd);
        if (row > 0) return;
        var args = {
            targetid: "grdData_MAIN", edit: true, updatable: true,
            data: [
                { name: "dept_cd", value: param.data.dept_cd },
                { name: "dept_nm", value: param.data.dept_nm },
                { name: "use_yn", value: "1" },
                { name: "dept_area", value: gw_com_api.getValue("frmOption_2", 1, "dept_area") }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ]
        };
        gw_com_module.gridInsert(args);

    } else if (param.sub) {
        // 중복 제거
        var data = new Array();
        var pid = gw_com_api.getValue("grdData_MAIN", "selected", "idx", true);

        // w_find_emp 사용시
        if (param.data.emp_no.length > 1 &&
            gw_com_api.getFindRow("grdData_SUB", "emp_no", param.data.emp_no) < 1) {
            data[0] = {
                emp_no: param.data.emp_no, emp_nm: param.data.emp_nm,
                dept_cd: param.data.dept_cd, dept_nm: param.data.dept_nm, pos_nm: param.data.pos_nm,
                use_yn: "1", pid: pid
            };
        }
        //// DLG_EMPLOYEE2 사용시
        //$.each(param.data, function () {
        //    if (gw_com_api.getFindRow("grdData_SUB", "emp_no", this.emp_no) < 1) {
        //        this.pid = pid; this.use_yn = "1"; data[data.length] = this;
        //    }
        //});

        if (data.length > 0) {
            var args = {
                targetid: "grdData_SUB", edit: true, updatable: true,
                data: data
            };
            gw_com_module.gridInserts(args);
        }
    }

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_MAIN", row: "selected", remove: true,
        clear: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_MAIN",
                key: [
                    { row: "selected", element: [{ name: "idx" }] }
                ]
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_MAIN",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.event.data;

    var args;
    switch (param.element) {
        case "emp_nm":
            {
                v_global.event.value = "emp_no";
                v_global.event.data = {
                    dept_cd: gw_com_api.getValue("grdData_MAIN", "selected", "dept_cd", true),
                    dept_nm: gw_com_api.getValue("grdData_MAIN", "selected", "dept_nm", true),
                    emp_nm: v_global.event.row == "new" ? "" : gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                };
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectEmployee,
                    data: v_global.event.data
                };
                //args = {
                //    type: "PAGE", page: "DLG_EMPLOYEE2", title: "사원 검색",
                //    width: 700, height: 400, locate: ["center", "center"], open: true,
                //    id: gw_com_api.v_Stream.msg_openedDialogue,
                //    data: v_global.event.data
                //};
            }
            break;
        case "dept_nm":
            {
                v_global.event.value = "dept_cd";
                v_global.event.data = {
                    dept_nm: v_global.event.row == "new" ? "" : gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                };
                args = {
                    type: "PAGE", page: "w_find_dept", title: "부서 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectDepartment,
                    data: v_global.event.data
                };
            }
            break;
        default:
            {
                return false;
            }
            break;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: args.data } };
        gw_com_module.dialogueOpen(args);
    }


}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "DLG_EMPLOYEE2", "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_EMPLOYEE2":
                        {
                            if (param.data != undefined) {
                                processInsert({ sub: true, data: param.data });
                            }
                        }
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedDepartment:
            {
                if (param.data != undefined) {
                    if (v_global.event.row == "new") {
                        processInsert({ master: true, data: param.data });
                    } else {
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            v_global.event.element,
                                            param.data.dept_nm,
                                            (v_global.event.type == "GRID") ? true : false);
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            v_global.event.value,
                                            param.data.dept_cd,
                                            (v_global.event.type == "GRID") ? true : false);
                    }
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {
                    processInsert({ sub: true, data: param.data });
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//