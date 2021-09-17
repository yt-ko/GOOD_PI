//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.12)
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
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { type: "PAGE", page: "RNS_2012", title: "Rule 상세보기", width: 1000, height: 630 };
        gw_com_module.dialoguePrepare(args);
        //----------

        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_part",
                    param: [{ argument: "arg_type", value: "RNS" }]
                },
                {
                    type: "PAGE", name: "상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "RNS00" }]
                },
                { type: "PAGE", name: "분류", query: "DDDW_RNS_TP" },
                //{
                //    type: "PAGE", name: "분류", query: "DDDW_CM_CODED",
                //    param: [{ argument: "arg_hcode", value: "RNS01" }]
                //},
                {
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "Rule", value: "RULE" },
                        { title: "SOP", value: "SOP" }
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
                { name: "조회", value: "조회" },
                { name: "상세", value: "상세보기", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: {
                                    type: "select", data: { memory: "장비군", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "rns_tp", memory: "분류", unshift: [{ title: "전체", value: "" }], key: ["dept_area", "rns_fg"] }]
                                }
                            },
                            {
                                name: "rns_fg", label: { title: "구분 :" },
                                editable: {
                                    type: "select", data: { memory: "구분", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "rns_tp", memory: "분류", unshift: [{ title: "전체", value: "" }], key: ["dept_area", "rns_fg"] }]
                                }
                            },
                            {
                                name: "rns_tp", label: { title: "분류 :" },
                                editable: { type: "select", data: { memory: "분류", unshift: [{ title: "전체", value: "" }], key: ["dept_area", "rns_fg"] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rns_no", label: { title: "문서번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "rns_nm", label: { title: "문서명 :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_nm", label: { title: "담당부서 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "user_nm", label: { title: "담당자 :" },
                                editable: { type: "text", size: 8 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "astat", hidden: true },
                            { name: "rns_id", hidden: true, value: 0 },
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
            targetid: "grdData_MAIN", query: "RNS_2050_1", title: "Rule & SOP",
            caption: true, height: 230, show: true, selectable: true, number: true, pager: { viewrecords: true, pgbuttons: true, pginput: true, rownum: 10 },
            element: [
                { header: "장비군", name: "dept_area_nm", width: 50 },
                { header: "구분", name: "rns_fg_nm", width: 40, align: "center" },
                { header: "분류", name: "rns_tp_nm", width: 180 },
                { header: "문서번호", name: "rns_no", width: 120 },
                { header: "문서명", name: "rns_nm", width: 250 },
                { header: "개정일자", name: "rev_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "개정번호", name: "rev_no", width: 60, align: "center" },
                { header: "진행상태", name: "astat_nm", width: 80, hidden: true },
                { header: "담당부서", name: "dept_nm", width: 100 },
                { header: "담당자", name: "user_nm", width: 60 },
                { name: "rns_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "RNS_2050_2", title: "열람권한",
            caption: true, height: 250, show: true, selectable: true, number: true,
            element: [
                { header: "부서", name: "auth_nm", width: 200 },
                { header: "열람현황", name: "auth_cnt", width: 100, align: "center" },
                { name: "rns_id", hidden: true },
                { name: "rev_no", hidden: true },
                { name: "auth_tp", hidden: true },
                { name: "auth_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_DET", query: "RNS_2050_3", title: "열람현황",
            caption: true, height: 250, show: true, selectable: true, number: true,
            element: [
                { header: "부서", name: "dept_nm", width: 100 },
                { header: "이름", name: "user_nm", width: 200 },
                { header: "조회일시", name: "read_dt", width: 150, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_DET", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);


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
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processClick };
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
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, event: "rowselected", handler: processRowselected };
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
                case "상세":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_MAIN");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        processLink({ row: row, view: true });
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "실행":
                    {
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
        function processRowselected(param) {

            processRetrieve(param);

        }
        //----------
        function processRowdblclick(param) {

            if (param.object == "grdData_MAIN")
                processLink({ row: param.row, view: true });
            else if (param.object == "grdData_SUB")
                processLink({ row: param.row, rev: true });

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
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    if (param.object == "grdData_SUB") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "rns_id", argument: "arg_rns_id" },
                    { name: "rev_no", argument: "arg_rev_no" },
                    { name: "auth_id", argument: "arg_auth_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_DET", select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    } else if (param.object == "grdData_MAIN") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "rns_id", argument: "arg_rns_id" },
                    { name: "rev_no", argument: "arg_rev_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_DET" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        var args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "rns_fg", argument: "arg_rns_fg" },
                    { name: "rns_tp", argument: "arg_rns_tp" },
                    { name: "rns_no", argument: "arg_rns_no" },
                    { name: "rns_nm", argument: "arg_rns_nm" },
                    { name: "dept_nm", argument: "arg_dept_nm" },
                    { name: "user_nm", argument: "arg_user_nm" },
                    { name: "astat", argument: "arg_astat" }
                ],
                remark: [
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "rns_fg" }] },
                    { element: [{ name: "rns_tp" }] },
                    { element: [{ name: "rns_no" }] },
                    { element: [{ name: "rns_nm" }] },
                    { element: [{ name: "dept_nm" }] },
                    { element: [{ name: "user_nm" }] },
                    { element: [{ name: "astat" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_DET" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DET" }
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
function processLink(param) {

    v_global.event.data = {
        rns_fg: gw_com_api.getValue("frmOption", 1, "rns_fg")
    };
    var page = "RNS_2012";
    if (param.rev) {
        v_global.event.data.rns_id = gw_com_api.getValue("grdData_SUB", param.row, "rns_id", true);
        v_global.event.data.rev_no = gw_com_api.getValue("grdData_SUB", param.row, "rev_no", true);
    } else {
        if (param.row != undefined) {
            v_global.event.data.rns_id = gw_com_api.getValue("grdData_MAIN", param.row, "rns_id", true);
        }
    }
    var args = {
        page: page,
        param: {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: v_global.event.data
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
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
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "RNS_2012":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
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