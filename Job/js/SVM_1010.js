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
        var args = { type: "PAGE", page: "SVM_1011", title: "계획등록", width: 1000, height: 570 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "SVM_1012", title: "결과등록", width: 1000, height: 570 };
        gw_com_module.dialoguePrepare(args);
        //----------

        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
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
            //----------

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
                { name: "추가", value: "계획등록" },
                { name: "수정", value: "계획수정", icon: "기타" },
                { name: "출력", value: "현황" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB2", type: "FREE",
            element: [
                { name: "결과", value: "결과등록", icon: "기타" }
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
                                editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "ver_no", label: { title: "S/W Ver. :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    //{
                    //    element: [
                    //        {
                    //            name: "dept_nm", label: { title: "등록부서 :" },
                    //            editable: { type: "text", size: 12 }
                    //        },
                    //        {
                    //            name: "user_nm", label: { title: "등록자 :" },
                    //            editable: { type: "text", size: 8 }
                    //        }
                    //    ]
                    //},
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
            targetid: "grdData_MAIN", query: "SVM_1010_1", title: "S/W 정보",
            caption: true, height: 150, show: true, selectable: true, number: true,
            element: [
                { header: "장비군", name: "dept_area_nm", width: 150 },
                { header: "Ver.", name: "ver_no", width: 150 },
                { header: "비고", name: "rmk", width: 500 },
                { header: "등록자", name: "upd_usr_nm", width: 100 },
                { header: "등록일시", name: "upd_dt", width: 150, align: "center" },
                { name: "doc_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB1", query: "SVM_1010_2", title: "ECO",
            caption: true, height: 150, show: true, selectable: true, number: true,
            element: [
                {
                    header: "ECO No.", name: "eco_no", width: 100, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "CIP No.", name: "cip_no", width: 100, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "ECR No.", name: "ecr_no", width: 100, align: "center",
                    format: { type: "link" }
                },
                { header: "S/W 분류", name: "item_tp", width: 150 },
                { header: "비고", name: "rmk", width: 400 },
                { header: "등록자", name: "upd_usr_nm", width: 80 },
                { header: "등록일시", name: "upd_dt", width: 120, align: "center" },
                { name: "item_id", hidden: true },
                { name: "doc_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB2", query: "SVM_1010_3", title: "적용모델",
            caption: true, height: 150, show: true, selectable: true, number: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 100 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "고객설비명", name: "cust_prod_nm", width: 150 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "제품명", name: "prod_nm", width: 200 },
                { header: "PM수", name: "prod_subqty", width: 60, align: "center" },
                { header: "납품일자", name: "dlv_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "Safety PLC", name: "ext1_cd", width: 80, align: "center" },
                { header: "EDA", name: "ext2_cd", width: 80, align: "center" },
                { header: "PLC Ver.", name: "ext3_cd", width: 80, align: "center" },
                { header: "등록자", name: "upd_usr_nm", width: 80 },
                { header: "등록일시", name: "upd_dt", width: 120, align: "center" },
                { name: "model_id", hidden: true },
                { name: "doc_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB1", offset: 8 },
                { type: "GRID", id: "grdData_SUB2", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB2", element: "결과", event: "click", handler: processClick };
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
        var args = { targetid: "grdData_SUB1", element: "eco_no", grid: true, event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB1", element: "cip_no", grid: true, event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB1", element: "ecr_no", grid: true, event: "click", handler: processClick };
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
                case "수정":
                case "결과":
                    {
                        processLink(param);
                    }
                    break;
                case "출력":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_MAIN");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        var args = {
                            page: "SVM_1051.aspx",
                            param: [
                                { name: "doc_id", value: gw_com_api.getValue("grdData_MAIN", row, "doc_id", true) }
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
                        processRetrieve({});
                    }
                    break;
                case "취소":
                    {
                        closeOption({});
                    }
                    break;
                case "eco_no":
                case "cip_no":
                case "ecr_no":
                    {
                        var args = {
                            to: "INFO_ECCB",
                            ecr_no: gw_com_api.getValue(param.object, param.row, "ecr_no", true),
                            cip_no: gw_com_api.getValue(param.object, param.row, "cip_no", true),
                            eco_no: gw_com_api.getValue(param.object, param.row, "eco_no", true),
                            tab: (param.element == "eco_no" ? "ECO" : (param.element == "cip_no" ? "CIP" : "ECR"))
                        }
                        gw_com_site.linkPage(args);
                    }
                    break;
            }

        }
        //----------
        function processRowselected(param) {

            processRetrieve(param);

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

    if (param.object == "grdData_MAIN") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "doc_id", argument: "arg_doc_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB1", select: true },
                { type: "GRID", id: "grdData_SUB2", select: true }
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
                    { name: "ver_no", argument: "arg_ver_no" }
                ],
                remark: [
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "ver_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB1" },
                { type: "GRID", id: "grdData_SUB2" }
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
            { type: "GRID", id: "grdData_SUB1" },
            { type: "GRID", id: "grdData_SUB1" }
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

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

}
//----------
function processLink(param) {

    v_global.event.data = {};
    var page = "SVM_1011";
    if (param.element == "결과")
        page = "SVM_1012";

    if (param.element == "수정") {

        var row = gw_com_api.getSelectedRow("grdData_MAIN");
        if (row == null) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }
        v_global.event.data.doc_id = gw_com_api.getValue("grdData_MAIN", row, "doc_id", true);

    } else if (param.element == "결과") {

        var row = gw_com_api.getSelectedRow("grdData_MAIN");
        if (row == null) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }
        row = gw_com_api.getSelectedRow("grdData_SUB2");
        if (row == null) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }
        v_global.event.data = {
            doc_id: gw_com_api.getValue("grdData_MAIN", "selected", "doc_id", true),
            model_id: gw_com_api.getValue("grdData_SUB2", "selected", "model_id", true),
        };

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
                    case "SVM_1011":
                    case "SVM_1012":
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
                switch (param.from.page) {
                    case "SVM_1011":
                        {
                            if (param.data != undefined) {
                                var key = [{
                                    QUERY: $("#grdData_MAIN" + "_data").attr("query"),
                                    KEY: [
                                        { NAME: "doc_id", VALUE: param.data.doc_id }
                                    ]
                                }];
                                processRetrieve({ key: key });
                            }
                        }
                        break;
                    case "SVM_1012":
                        {
                            if (param.data != undefined) {
                                var key = [{
                                    QUERY: $("#grdData_SUB2" + "_data").attr("query"),
                                    KEY: [
                                        { NAME: "doc_id", VALUE: gw_com_api.getValue("grdData_SUB2", "selected", "doc_id", true) },
                                        { NAME: "model_id", VALUE: gw_com_api.getValue("grdData_SUB2", "selected", "model_id", true) }
                                    ]
                                }];
                                processRetrieve({ object: "grdData_MAIN", row: "selected", type: "GRID", key: key });
                            }
                        }
                        break;
                }
            }
            break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//