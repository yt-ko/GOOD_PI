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
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_part",
                    param: [{ argument: "arg_type", value: "RNS" }]
                },
                {
                    type: "INLINE", name: "분류",
                    data: [
                        { title: "Rule", value: "RULE" },
                        { title: "SOP", value: "SOP" }
                    ]
                },
                {
                    type: "INLINE", name: "사용여부",
                    data: [
                        { title: "전체", value: "" },
                        { title: "사용", value: "1" },
                        { title: "미사용", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "년", value: "Y" },
                        { title: "개월", value: "M" },
                        { title: "일", value: "D" }
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
                { name: "조회", value: "조회" },
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
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "rcode", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "fcode2", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "rcode", label: { title: "대분류 :" },
                                editable: { type: "select", data: { memory: "분류", unshift: [{ title: "전체", value: "" }] } }
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
            targetid: "grdData_MAIN", query: "RNS_1010_1", title: "코드 분류",
            caption: false, height: 450, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "rcode", validate: true },
            element: [
                {
                    header: "장비군", name: "fcode2", width: 100,
                    format: { type: "select", data: { memory: "장비군" } },
                    editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required", message: "장비군" } }
                },
                {
                    header: "대분류", name: "rcode", width: 100,
                    format: { type: "select", data: { memory: "분류" } },
                    editable: { type: "select", data: { memory: "분류", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required", message: "대분류" } }
                },
                {
                    header: "분류코드", name: "dcode", width: 80,
                    editable: { bind: "create", type: "text", maxlength: 20, validate: { rule: "required", message: "분류코드" } }
                },
                {
                    header: "분류명", name: "dname", width: 280,
                    editable: { type: "text", maxlength: 50, validate: { rule: "required", message: "분류명" } }
                },
                {
                    header: "사용", name: "use_yn", width: 60, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "순번", name: "sort_seq", width: 60, align: "center", mask: "numeric-int",
                    editable: { type: "text" }
                },
                {
                    header: "갱신주기", name: "dvalue1", width: 80, align: "right", mask: "numeric-int",
                    editable: { type: "text" }
                },
                {
                    header: "갱신구분", name: "fcode1", width: 80, align: "center",
                    format: { type: "select", data: { memory: "구분" } },
                    editable: { type: "select", data: { memory: "구분", validate: { rule: "required", message: "갱신구분" } } }
                },
                { header: "수정자", name: "upd_usr_nm", width: 80 },
                { header: "수정일시", name: "upd_dt", width: 150, align: "center" },
                { name: "hcode", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 }
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
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function processClick(param) {

            if (param.object != "frmOption")
                closeOption({});

            switch (param.element) {
                case "조회":
                    {
                        var args = {
                            target: [{ id: "frmOption", focus: true }]
                        };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "추가":
                    {
                        //v_global.process.handler = processInsert;
                        //if (!checkUpdatable({})) return;
                        processInsert({});
                    }
                    break;
                case "삭제":
                    {
                        processDelete(param);
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
                case "실행":
                    {
                        v_global.process.handler = processRetrieve;
                        if (!checkUpdatable({})) return;
                        processRetrieve({});
                    }
                    break;
                case "취소":
                    {
                        closeOption({});
                    }
                    break;
            }

        }
        //----------

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

    return gw_com_api.getCRUD("grdData_MAIN", "selected", true);

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "rcode", argument: "arg_rcode" },
                { name: "fcode2", argument: "arg_fcode2" }
            ],
            remark: [
                { element: [{ name: "fcode2" }] },
                { element: [{ name: "rcode" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------

function processInsert(param) {

    var args = {
        targetid: "grdData_MAIN", edit: true, updatable: true,
        data: [
            { name: "hcode", rule: "COPY", row: "prev" },
            { name: "rcode", rule: "COPY", row: "prev" },
            { name: "use_yn", value: "1" },
            { name: "sort_seq", rule: "INCREMENT", value: 1 },
            { name: "dvalue1", value: "1" }
        ]
    };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_MAIN", row: "selected"
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_MAIN" }
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
        targetid: "grdData_MAIN",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" }
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

    processRetrieve({ key: response });

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