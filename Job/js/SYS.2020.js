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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                { type: "PAGE", name: "권한", query: "dddw_role" }
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
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            processRetrieve({});

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
                { name: "복사", value: "복사", icon: "기타" },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, margin: 240,
            editable: { focus: "role_nm", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "role_nm", label: { title: "권한명 :" },
                                editable: { type: "text", size: 15, maxlength: 50 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmRoleID", type: "FREE", title: "조회 조건",
            trans: true, show: false, border: true, margin: 480, margin_top: 70,
            editable: { focus: "role_id", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "role_id", label: { title: "권한코드 :" },
                                editable: { type: "text", size: 15, maxlength: 10, validate: { rule: "required" }}
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "role_nm", label: { title: "권한명 :" },
                                editable: { type: "text", size: 15, maxlength: 50, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        align: "center",
                        element: [
                            { name: "실행", value: "복사", format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_권한", query: "SYS_2020_M_2", title: "권한 목록",
            width: 432, height: 400, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "use_yn", validate: true },
            element: [
                {
                    header: "코드", name: "role_id", width: 60, align: "center",
                    editable: { bind: "create", type: "text", validate: { rule: "required", message: "코드" } }
                },
                {
                    header: "권한명칭", name: "role_nm", width: 180, align: "left",
                    editable: { type: "text", validate: { rule: "required", message: "권한명칭" } }
                },
                { header: "인원", name: "user_cnt", width: 50, align: "center" },
                {
                    header: "순번", name: "sort_seq", width: 50, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "사용", name: "use_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_메뉴", query: "SYS_2020_S_1", title: "메뉴별 권한",
            height: 400, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "ret_yn", validate: true },
            element: [
                { header: "메뉴명", name: "menu_name", width: 200, align: "left" },
                {
                    header: "허용", name: "ret_yn", width: 60, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                //{
                //    header: "수정", name: "upd_yn", width: 60, align: "center",
                //    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                //    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                //},
                { name: "role_id", hidden: true, editable: { type: "hidden" } },
                { name: "menu_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_사용자", query: "SYS_2020_S_3", title: "사용자 정보",
            height: 400, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "role_id", validate: true },
            element: [
                { header: "사용자명", name: "user_nm", width: 70, align: "center" },
                { header: "사번", name: "emp_no", width: 70, align: "center" },
                { header: "부서", name: "dept_nm", width: 80, align: "center" },
                { header: "호칭", name: "pos_nm", width: 60, align: "center" },
                {
                    header: "권한", name: "role_id", width: 140, align: "center",
                    format: { type: "select", data: { memory: "권한" } },
                    editable: { type: "select", data: { memory: "권한" } }
                },
                { name: "user_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_1",
            target: [
                { type: "GRID", id: "grdData_권한", title: "권한 목록" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_2",
            target: [
                { type: "GRID", id: "grdData_메뉴", title: "메뉴별 권한" },
                { type: "GRID", id: "grdData_사용자", title: "사용자 정보" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_메뉴", offset: 8 },
                { type: "GRID", id: "grdData_사용자", offset: 8 },
                { type: "TAB", id: "lyrTab_2", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmRoleID", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmRoleID", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_권한", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_권한", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function processClick(param) {

            switch (param.element) {
                case "조회":
                    {
                        gw_com_api.hide("frmRoleID");
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "복사":
                    {
                        closeOption({});
                        if (!checkUpdatable({ check: true })) return;
                        if (gw_com_api.getSelectedRow("grdData_권한") == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        gw_com_api.show("frmRoleID");
                    }
                    break;
                case "추가":
                    {
                        v_global.process.handler = processInsert;
                        if (!checkUpdatable({})) return;
                        processInsert({});
                    }
                    break;
                case "삭제":
                    {
                        v_global.process.handler = processRemove;
                        if (!checkManipulate({})) return;
                        checkRemovable({});
                    }
                    break;
                case "저장":
                    {
                        closeOption({});
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        checkClosable({});
                    }
                    break;
                case "실행":
                    {
                        if (param.object == "frmOption") {
                            v_global.process.handler = processRetrieve;
                            if (!checkUpdatable({})) return;
                            processRetrieve({});
                        } else {
                            var args = {
                                target: [
                                    { type: "FORM", id: "frmRoleID" }
                                ]
                            };
                            if (gw_com_module.objValidate(args) == false) return false;
                            if (gw_com_api.getSelectedRow("grdData_권한") == null) {
                                gw_com_api.messageBox([{ text: "NODATA" }]);
                                return;
                            }
                            processBatch({});
                        }
                    }
                    break;
                default:
                    {
                        closeOption({});
                    }
                    break;
            }

        }
        //----------
        function processRowselecting(param) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = param.row;
            return checkUpdatable({});

        }
        //----------
        function processRowselected(param) {

            v_global.process.prev.master = param.row;
            processLink({});

        };
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_권한", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_권한" },
            { type: "GRID", id: "grdData_메뉴" },
            { type: "GRID", id: "grdData_사용자" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "role_nm", argument: "arg_role_nm" }
            ],
            remark: [
                { element: [{ name: "role_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_권한", select: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_메뉴" },
            { type: "GRID", id: "grdData_사용자" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_권한", row: "selected", block: true,
            element: [
                { name: "role_id", argument: "arg_role_id" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_메뉴", select: true },
            { type: "GRID", id: "grdData_사용자" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_권한", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_권한", edit: true, updatable: true,
        data: [
            { name: "use_yn", value: "1" },
            { name: "sort_seq", rule: "INCREMENT", value: 1 }
        ],
        clear: [
            { type: "GRID", id: "grdData_메뉴" },
            { type: "GRID", id: "grdData_사용자" }
        ]
    };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_권한", row: "selected", remove: true,
        clear: [
            { type: "GRID", id: "grdData_메뉴" },
            { type: "GRID", id: "grdData_사용자" }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_권한" },
            { type: "GRID", id: "grdData_메뉴" },
            { type: "GRID", id: "grdData_사용자" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_권한",
                key: [{ row: "selected", element: [{ name: "role_id" }] }]
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
        targetid: "grdData_권한",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_메뉴" },
            { type: "GRID", id: "grdData_사용자" }
        ]
    };
    if (param.master) {
        args.target.unshift({ type: "GRID", id: "grdData_권한" });
    }
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
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmRoleID");

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
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "sp_SYS_copyRole",
        nomessage: true,
        tran: true,
        input: [
            { name: "role_id", value: gw_com_api.getValue("grdData_권한", "selected", "role_id", true), type: "varchar" },
            { name: "new_id", value: gw_com_api.getValue("frmRoleID", 1, "role_id"), type: "varchar" },
            { name: "new_nm", value: gw_com_api.getValue("frmRoleID", 1, "role_nm"), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
function successBatch(response, param) {

    if (response.VALUE[0] <= 0) {

        gw_com_api.messageBox([{ text: response.VALUE[1] }]);

    } else {

        var p = {
            handler: processRetrieve,
            param: {
                key: [
                    {
                        QUERY: $("#grdData_권한_data").attr("query"),
                        KEY: [{ NAME: "role_id", VALUE: gw_com_api.getValue("frmRoleID", 1, "role_id") }]
                    }
                ]
            }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], 420, gw_com_api.v_Message.msg_informBatched, undefined, p);
        var args = { target: [{ type: "FORM", id: "frmRoleID" }] };
        gw_com_module.objClear(args);

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
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            if (param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//