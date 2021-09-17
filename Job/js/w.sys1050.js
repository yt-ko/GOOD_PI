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

        var args = {
            request: [
                {
                    type: "INLINE", name: "사용여부",
                    data: [
                        { title: "전체", value: "" },
                        { title: "사용", value: "1" },
                        { title: "미사용", value: "0" }
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
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
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
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "mod_id", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "mod_id", label: { title: "Module :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "hcode", label: { title: "분류코드 :" },
                                editable: { type: "text", size: 15 }
                            },
                            {
                                name: "hname", label: { title: "분류명 :" },
                                editable: { type: "text", size: 15 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "use_yn", label: { title: "사용여부 :" },
                                editable: { type: "select", data: { memory: "사용여부" } }
                            },
                            {
                                name: "role_id", label: { title: "관리자 :" },
                                editable: { type: "text", size: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "tname", label: { title: "테이블 :" },
                                editable: { type: "text", size: 15 }
                            },
                            {
                                name: "cname", label: { title: "컬럼 :" },
                                editable: { type: "text", size: 15 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rmk", label: { title: "설명 :" },
                                editable: { type: "text", size: 15 }
                            },
                            {
                                name: "dname", label: { title: "상세코드 명칭 :" },
                                editable: { type: "text", size: 15 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", format: { type: "button" }, act: true },
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
            targetid: "grdData_분류", query: "w_sys1050_M_1", title: "코드 분류",
            caption: true, height: 165, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "mod_id", validate: true },
            element: [
                {
                    header: "Module", name: "mod_id", width: 60,
                    editable: { type: "text", validate: { rule: "required", message: "Module" } }
                },
                {
                    header: "분류코드", name: "hcode", width: 70,
                    editable: { bind: "create", type: "text", validate: { rule: "required", message: "분류코드" } }
                },
                {
                    header: "분류명", name: "hname", width: 180,
                    editable: { type: "text", validate: { rule: "required", message: "분류명" } }
                },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "고정", name: "sys_yn", width: 40, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "관리자", name: "role_id", width: 70,
                    editable: { type: "text" }
                },
                {
                    header: "테이블", name: "tname", width: 150,
                    editable: { type: "text" }
                },
                {
                    header: "컬럼", name: "cname", width: 150,
                    editable: { type: "text" }
                },
                {
                    header: "설명", name: "rmk", width: 300,
                    editable: { type: "text" }
                },
                { header: "수정자", name: "upd_usr_nm", width: 80, align: "center" },
                { header: "수정일시", name: "upd_dt", width: 150, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_코드", query: "w_sys1050_S_1", title: "코드 내역",
            caption: true, height: 154, show: true, selectable: true, key: true,
            editable: { multi: true, bind: "select", focus: "dname", validate: true },
            element: [
                {
                    header: "분류코드", name: "hcode", width: 60,
                    editable: { type: "hidden" }
                },
                {
                    header: "코드", name: "dcode", width: 100,
                    editable: { bind: "create", type: "text", validate: { rule: "required", message: "코드" } }
                },
                {
                    header: "명칭", name: "dname", width: 300,
                    editable: { type: "text", validate: { rule: "required", message: "명칭" } }
                },
                {
                    header: "사용", name: "use_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "순번", name: "sort_seq", width: 50, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "관련코드", name: "rcode", width: 60,
                    editable: { type: "text" }
                },
                {
                    header: "문자열1", name: "fcode1", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "문자열2", name: "fcode2", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "문자열3", name: "fcode3", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "문자열4", name: "fcode4", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "문자열5", name: "fcode5", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "숫자값1", name: "dvalue1", width: 70, align: "right",
                    editable: { type: "text" }
                },
                {
                    header: "숫자값2", name: "dvalue2", width: 70, align: "right",
                    editable: { type: "text" }
                },
                {
                    header: "숫자값3", name: "dvalue3", width: 70, align: "right",
                    editable: { type: "text" }
                },
                {
                    header: "비고", name: "rmk", width: 300,
                    editable: { type: "text" }
                },
                { header: "수정자", name: "upd_usr_nm", width: 80, align: "center" },
                { header: "수정일시", name: "upd_dt", width: 150, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_분류", offset: 8 },
                { type: "GRID", id: "grdData_코드", offset: 8 }
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

        //----------
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: click_lyrMenu_1_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: click_lyrMenu_1_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: click_lyrMenu_1_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: click_lyrMenu_1_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: click_lyrMenu_2_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: click_lyrMenu_2_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류", grid: true, event: "rowselecting", handler: rowselecting_grdData_분류 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류", grid: true, event: "rowselected", handler: rowselected_grdData_분류 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류", grid: true, event: "itemchanged", handler: itemchanged_grdData_분류 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

            //v_global.process.handler = processRetrieve;

            //if (!checkUpdatable({})) return;

            //processRetrieve({});

            var args = {
                target: [{ id: "frmOption", focus: true }]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            v_global.process.handler = processRemove;

            if (!checkManipulate({})) return;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_코드",
                edit: true,
                data: [
                    { name: "hcode", value: gw_com_api.getValue("grdData_분류", "selected", "hcode", true) },
                    { name: "use_yn", value: "1" },
                    { name: "sort_seq", rule: "INCREMENT", value: 1 }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_코드",
                row: "selected"
            };
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_분류(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_분류(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemchanged_grdData_분류(ui) {

            switch (ui.element) {
                case "hcode":
                    {
                        ids = gw_com_api.getRowIDs("grdData_코드");
                        $.each(ids, function () {
                            if (ui.value.prev
                                == gw_com_api.getValue("grdData_코드", this, "hcode", true))
                                gw_com_api.setValue("grdData_코드", this, "hcode", ui.value.current, true, true);
                        });
                    }
                    break;
            }
            return true;

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
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
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_분류", "selected", true);

}
//----------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_분류" },
            { type: "GRID", id: "grdData_코드" }
        ]
    };
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
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "mod_id", argument: "arg_mod_id" },
                { name: "hcode", argument: "arg_hcode" },
                { name: "hname", argument: "arg_hname" },
                { name: "use_yn", argument: "arg_use_yn" },
                { name: "role_id", argument: "arg_role_id" },
                { name: "tname", argument: "arg_tname" },
                { name: "cname", argument: "arg_cname" },
                { name: "rmk", argument: "arg_rmk" },
                { name: "dname", argument: "arg_dname" }
            ],
            remark: [
                { element: [{ name: "mod_id" }] },
                { element: [{ name: "hcode" }] },
                { element: [{ name: "hname" }] },
                { element: [{ name: "use_yn" }] },
                { element: [{ name: "role_id" }] },
                { element: [{ name: "tname" }] },
                { element: [{ name: "cname" }] },
                { element: [{ name: "rmk" }] },
                { element: [{ name: "dname" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_분류", select: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_코드" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_분류", row: "selected", block: true,
            element: [
                { name: "hcode", argument: "arg_hcode" }
            ],
            argument: [
                { name: "arg_dname", value: gw_com_api.getValue("frmOption", 1, "dname") }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_코드" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_분류", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_분류", edit: true, updatable: true,
        clear: [
            { type: "GRID", id: "grdData_코드" }
        ]
    };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_분류", row: "selected", remove: true,
        clear: [
            { type: "GRID", id: "grdData_코드" }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_분류" },
            { type: "GRID", id: "grdData_코드" }
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
                type: "GRID", id: "grdData_분류",
                key: [{ row: "selected", element: [{ name: "hcode" }] }]
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
        targetid: "grdData_분류",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_코드" }
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
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//