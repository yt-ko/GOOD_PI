//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.05)
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
                { type: "PAGE", name: "사업부", query: "DDDW_BIZ_GROUP" },
                {
                    type: "PAGE", name: "YYYY", query: "dddw_forecasting_yyyy",
                    param: [{ argument: "arg_supp_cd", value: gw_com_module.v_Session.USR_ID }]
                },
                {
                    type: "PAGE", name: "REV", query: "dddw_forecasting_rev",
                    param: [{ argument: "arg_supp_cd", value: gw_com_module.v_Session.USR_ID }]
                },
                {
                    type: "INLINE", name: "작성여부",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "작성", value: "1" },
                        { title: "미작성", value: "0" }
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
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_api.getValue("frmOption", 1, "dept_area")); // for select filter
            //----------
            gw_com_module.startPage();

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
                { name: "생성", value: "선택품목 일괄생성", icon: "기타" },
                { name: "생성2", value: "전품목 일괄생성", icon: "기타" },
                { name: "출력", value: "전체보기", icon: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true,
            editable: { focus: "dept_area", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "사업부 :" },
                                editable: {
                                    type: "select", data: { memory: "사업부" },
                                    change: [
                                        { name: "yyyy", memory: "YYYY", key: ["dept_area"] },
                                        { name: "rev", memory: "REV", key: ["dept_area", "yyyy"] }
                                    ],
                                    validate: { rule: "required" }
                                }
                            },
                            {
                                name: "yyyy", label: { title: "기준연도 :" },
                                editable: {
                                    type: "select", data: { memory: "YYYY", key: ["dept_area"] },
                                    change: [{ name: "rev", memory: "REV", key: ["dept_area", "yyyy"] }],
                                    validate: { rule: "required" }
                                }
                            },
                            {
                                name: "rev", label: { title: "차수 :" },
                                editable: {
                                    type: "select", data: { memory: "REV", key: ["dept_area", "yyyy"] },
                                    validate: { rule: "required" }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "input_yn", label: { title: "작성여부 :" },
                                editable: { type: "select", data: { memory: "작성여부" } }
                            },
                            {
                                name: "item_no", label: { title: "품번" },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            },
                            {
                                name: "item_nm", label: { title: "품명" },
                                editable: { type: "text", size: 15, maxlength: 200 }
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
            targetid: "grdData_MAIN", query: "SRM_2510_SUPP_1", title: "FORECASTING",
            caption: false, height: 442, show: true, selectable: true, number: true,
            element: [
                { header: "품번", name: "item_no", width: 80 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "spec", width: 150 },
                { header: "작성율", name: "fore_proc", width: 70, align: "center" },
                { name: "seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "SRM_2510_SUPP_2", title: "FORECASTING",
            caption: false, height: 442, show: true, selectable: true,
            editable: { master: true, bind: "edit_yn", focus: "plan_qty", validate: true },
            element: [
                {
                    header: "필요연월", name: "req_date", width: 80, align: "center", mask: "date-ym",
                    editable: { type: "hidden" }
                },
                {
                    header: "필요수량", name: "req_qty", width: 80, align: "right", mask: "numeric-int",
                    editable: { type: "hidden" }
                },
                {
                    header: "가능수량", name: "plan_qty", width: 80, align: "right", mask: "numeric-int",
                    editable: { type: "text", maxlength: 8 }
                },
                { header: "수정일시", name: "upd_dt", width: 110, align: "center" },
                { name: "seq", hidden: true, editable: { type: "hidden" } },
                { name: "edit_yn", hidden: true }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "생성", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "생성2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, event: "itemkeyenter", handler: processKeyenter };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "저장":
                    {
                        closeOption({});
                        processSave({});
                    }
                    break;
                case "생성":
                    {
                        closeOption({});
                        if (!checkUpdatable({ check: true })) return;
                        var row = gw_com_api.getSelectedRow("grdData_MAIN");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        var args = {
                            seq: gw_com_api.getValue("grdData_MAIN", row, "seq", true)
                        };
                        if (checkModified(args)) {
                            gw_com_api.messageBox([
                                { text: "작성된 내역을 필요수량으로 덮어쓰시겠습니까?", align: "left" },
                                { text: "[예]     : 전체 내역 일괄생성", align: "left" },
                                { text: "[아니오] : 미작성 내역만 일괄생성", align: "left" },
                                { text: "[취소]   : 중단", align: "left" }
                            ], 450, gw_com_api.v_Message.msg_confirmBatch, "YESNOCANCEL", { handler: processBatch, param: args });
                        } else {
                            processBatch(args);
                        }
                    }
                    break;
                case "생성2":
                    {
                        closeOption({});
                        if (!checkUpdatable({ check: true })) return;
                        var args = {
                            dept_area: gw_com_api.getValue("frmOption", 1, "dept_area"),
                            yyyy: gw_com_api.getValue("frmOption", 1, "yyyy"),
                            rev: gw_com_api.getValue("frmOption", 1, "rev")
                        };
                        if (checkModified(args)) {
                            gw_com_api.messageBox([
                                { text: "작성된 내역을 필요수량으로 덮어쓰시겠습니까?", align: "left" },
                                { text: "[예]     : 전체 내역 일괄생성", align: "left" },
                                { text: "[아니오] : 미작성 내역만 일괄생성", align: "left" },
                                { text: "[취소]   : 중단", align: "left" }
                            ], 450, gw_com_api.v_Message.msg_confirmBatch, "YESNOCANCEL", { handler: processBatch, param: args });
                        } else {
                            processBatch(args);
                        }
                    }
                    break;
                case "출력":
                    {
                        closeOption({});
                        var args = {
                            page: "SRM_2510_SUPP_P.aspx",
                            param: [
                                { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") },
                                { name: "yyyy", value: gw_com_api.getValue("frmOption", 1, "yyyy") },
                                { name: "rev", value: gw_com_api.getValue("frmOption", 1, "rev") },
                                { name: "item_no", value: gw_com_api.getValue("frmOption", 1, "item_no") },
                                { name: "item_nm", value: gw_com_api.getValue("frmOption", 1, "item_nm") }
                            ],
                            target: { type: "PAGE" }
                        };
                        //gw_com_module.pageOpen(args);
                        var url = args.page + gw_com_module.toParam(args.param);
                        window.open(url);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "실행":
                    {
                        v_global.process.handler = processRetrieve;
                        if (!checkUpdatable({})) return false;
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
        function processRowselecting(param) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = param.row;

            return checkUpdatable({});

        }
        //----------
        function processRowselected(param) {

            processRetrieve(param);

        }
        //----------
        function processKeyenter(param) {

            gw_com_module.gridEdit({
                targetid: param.object,
                row: Number(param.row) + 1,
                edit: true
            });

        }
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
function processSelect(param) {

    gw_com_api.selectRow("grdData_MAIN", v_global.process.current.master, true, false);

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    if (param.object == "grdData_MAIN") {

        var args = {
            source: {
                type: "GRID", id: param.object, row: (param.row == undefined ? "selected" : param.row),
                element: [
                    { name: "seq", argument: "arg_seq" }
                ],
                argument: [
                    { name: "arg_input_yn", value: gw_com_api.getValue("frmOption", 1, "input_yn") }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = {
            target: [
                { type: "FORM", id: "frmOption" }
            ]
        };
        if (gw_com_module.objValidate(args) == false)  return false;

        var args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "yyyy", argument: "arg_yyyy" },
                    { name: "rev", argument: "arg_rev" },
                    { name: "item_no", argument: "arg_item_no" },
                    { name: "item_nm", argument: "arg_item_nm" },
                    { name: "input_yn", argument: "arg_input_yn" }
                ],
                argument: [
                    { name: "arg_supp_cd", value: gw_com_module.v_Session.USR_ID }
                ],
                remark: [
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "yyyy" }] },
                    { element: [{ name: "rev" }] },
                    { element: [{ name: "input_yn" }] },
                    { element: [{ name: "item_no" }] },
                    { element: [{ name: "item_nm" }] }
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

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ object: "grdData_MAIN" });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" },
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
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function checkModified(param) {

    var rtn = false;
    //----------
    var args = {
        name: "SRM_2510_SUPP_CHK_MODIFIED",
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SRM_2510_SUPP_CHK_MODIFIED" +
                "&QRY_COLS=modified" +
                "&CRUD=R" +
                "&arg_dept_area=" + (param.dept_area == undefined ? "" : param.dept_area) +
                "&arg_yyyy=" + (param.yyyy == undefined ? "" : param.yyyy) +
                "&arg_rev=" + (param.rev == undefined ? "0" : param.rev) +
                "&arg_seq=" + (param.seq == undefined ? "0" : param.seq),
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        rtn = (data.DATA[0] == "1");

    }
    //----------
    return rtn;
}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "sp_SRM_setForecasting",
        nomessage: true,
        input: [
            { name: "dept_area", value: (param.dept_area == undefined ? "" : param.dept_area), type: "varchar" },
            { name: "yyyy", value: (param.yyyy == undefined ? "" : param.yyyy), type: "varchar" },
            { name: "rev", value: (param.rev == undefined ? "0" : param.rev), type: "int" },
            { name: "seq", value: (param.seq == undefined ? "0" : param.seq), type: "int" },
            { name: "run_tp", value: (param.run_tp == undefined ? "0" : param.run_tp), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID }
        ],
        handler: {
            success: successBatch,
            param: param
        },
        output: [
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ]
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    var args = {
        handler: processRetrieve,
        param: param
    };
    gw_com_api.messageBox([{ text: response.VALUE[1] }], undefined, undefined, undefined, args);

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
                    case gw_com_api.v_Message.msg_alert:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else if (param.data.result == "NO") {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else {
                                    var args = param.data.arg.param;
                                    args.run_tp = (param.data.result == "YES" ? "1" : "0");
                                    param.data.arg.handler(args);
                                }
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
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