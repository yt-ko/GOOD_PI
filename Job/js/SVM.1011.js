//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.12)
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
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        //var args = { type: "PAGE", page: "RNS_2010_DEPT", title: "배포부서", width: 500, height: 400 };
        //gw_com_module.dialoguePrepare(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "INLINE", name: "YESNO",
                    data: [
                        { title: "YES", value: "YES" },
                        { title: "NO", value: "NO" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

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
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
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
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB1", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB2", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "SVM_1011_1", type: "TABLE", title: "S/W 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "dept_area", validate: true },
            content: {
                width: { label: 150, field: 310 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            {
                                name: "dept_area",
                                format: { type: "select", data: { memory: "장비군", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" }, message: "장비군" }
                            },
                            { header: true, value: "S/W Ver.", format: { type: "label" } },
                            {
                                name: "ver_no",
                                editable: { type: "text", maxlength: 20, validate: { rule: "required", message: "S/W Ver." } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "rmk", style: { colspan: 3 },
                                format: { width: 780 },
                                editable: { type: "text", width: 780, maxlength: 200 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록자", format: { type: "label" } },
                            { name: "upd_usr_nm" },
                            { header: true, value: "등록일시", format: { type: "label" } },
                            { name: "upd_dt" },
                            { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                            { name: "astat", editable: { type: "hidden" }, hidden: true },
                            { name: "astat_usr", editable: { type: "hidden" }, hidden: true },
                            { name: "astat_dt", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB1", query: "SVM_1011_2", title: "ECO",
            caption: true, height: 100, pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "_edit_yn", focus: "item_tp", validate: true },
            element: [
                {
                    header: "ECO No.", name: "eco_no", width: 100, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "CIP No.", name: "cip_no", width: 100, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "ECR No.", name: "ecr_no", width: 100, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "분류", name: "item_tp", width: 150,
                    editable: { type: "text", maxlength: 20, validate: { rule: "required", message: "분류" } }
                },
                {
                    header: "비고", name: "rmk", width: 440,
                    editable: { type: "text", maxlength: 200 }
                },
                //{ header: "등록자", name: "upd_usr_nm", width: 100 },
                //{ header: "등록일시", name: "upd_dt", width: 150, align: "center" },
                { name: "item_id", hidden: true, editable: { type: "hidden" } },
                { name: "doc_id", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB2", query: "SVM_1011_3", title: "적용모델",
            caption: true, height: 100, pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "_edit_yn", focus: "ext1_cd", validate: true },
            element: [
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 100 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                {
                    header: "고객설비명", name: "cust_prod_nm", width: 150,
                    editable: { type: "hidden" }
                },
                {
                    header: "Project No.", name: "proj_no", width: 100,
                    editable: { type: "hidden" }
                },
                {
                    header: "제품명", name: "prod_nm", width: 200,
                    editable: { type: "hidden" }
                },
                {
                    header: "PM수", name: "prod_subqty", width: 60, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "납품일자", name: "dlv_ymd", width: 80, align: "center", mask: "date-ymd",
                    editable: { type: "hidden" }
                },
                {
                    header: "Safety PLC", name: "ext1_cd", width: 80, align: "center",
                    editable: { type: "select", data: { memory: "YESNO", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "EDA", name: "ext2_cd", width: 80, align: "center",
                    editable: { type: "select", data: { memory: "YESNO", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "PLC Ver.", name: "ext3_cd", width: 80, align: "center",
                    editable: { type: "text", maxlength: 20 }
                },
                //{ header: "등록자", name: "upd_usr_nm", width: 100 },
                //{ header: "등록일시", name: "upd_dt", width: 150, align: "center" },
                { name: "model_id", hidden: true, editable: { type: "hidden" } },
                { name: "doc_id", hidden: true, editable: { type: "hidden" } },
                { name: "prod_key", hidden: true, editable: { type: "hidden" } },
                { name: "prod_type", hidden: true, editable: { type: "hidden" } },
                { name: "cust_cd", hidden: true, editable: { type: "hidden" } },
                { name: "cust_dept", hidden: true, editable: { type: "hidden" } },
                { name: "cust_proc", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB1", offset: 8 },
                { type: "GRID", id: "grdData_SUB2", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB1", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB1", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB2", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB2", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //----------
        function processClick(param) {

            switch (param.element) {
                case "추가":
                    {
                        processInsert(param);
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
                        processClose({});
                    }
                    break;
            }

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
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_doc_id", value: v_global.logic.doc_id }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB1" },
            { type: "GRID", id: "grdData_SUB2" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_SUB1") {

        var args = {
            type: "PAGE", page: "SVM_1011_1", title: "ECO",
            width: 900, height: 450, open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "SVM_1011_1",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }

    } else if (param.object == "lyrMenu_SUB2") {

        var args = {
            type: "PAGE", page: "SVM_1011_2", title: "제품 모델 선택",
            width: 950, height: 460, open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "SVM_1011_2",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectProduct_ECCB
                }
            };
            args.param.data = {
                cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                my_dept_area: gw_com_module.v_Session.DEPT_AREA
            };
            gw_com_module.dialogueOpen(args);
        }

    } else {

        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "doc_id", value: 0 },
                { name: "astat", value: "00" },
                { name: "astat_usr", value: gw_com_module.v_Session.USR_ID },
                { name: "astat_dt", value: "SYSDT" }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB1" },
                { type: "GRID", id: "grdData_SUB2" }
            ]
        };
        gw_com_module.formInsert(args);

    }

}
//----------
function processDelete(param) {

    if (param.object == "lyrMenu") {

        if (!checkManipulate({})) return;
        var status = checkCRUD(param);
        if (status == "initialize" || status == "create") {

            processInsert({});

        } else {

            var p = {
                handler: processRemove,
                param: {
                    doc_id: gw_com_api.getValue("frmData_MAIN", 1, "doc_id")
                }
            };
            gw_com_api.messageBox([{ text: "REMOVE" }], undefined, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);

        }

    } else {

        var args = { targetid: "grdData_" + param.object.split("_")[1], row: "selected", select: true };
        gw_com_module.gridDelete(args);

    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB1" },
            { type: "GRID", id: "grdData_SUB2" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB1" },
            { type: "GRID", id: "grdData_SUB2" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    if (checkCRUD({}) == "create")
        v_global.logic.doc_id = response[0].KEY[0].VALUE;
    else
        v_global.logic.doc_id = gw_com_api.getValue("frmData_MAIN", 1, "doc_id");

    processClose({ data: { doc_id: v_global.logic.doc_id } });

    //var p = {
    //    handler: processClose,
    //    param: {
    //        data: { doc_id: v_global.logic.doc_id }
    //    }
    //};
    //gw_com_api.messageBox([{ text: "저장되었습니다." }], undefined, undefined, undefined, p);

}
//----------
function processRemove(param) {

    if (gw_com_api.getCRUD("frmData_MAIN") == "create") {

        processInsert({});

    } else {

        if (param == undefined || param.doc_id == undefined) {

            var p = {
                handler: processRemove,
                param: {
                    rns_id: gw_com_api.getValue("frmData_MAIN", 1, "doc_id")
                }
            };
            gw_com_api.messageBox([{ text: "REMOVE" }], undefined, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);

        } else {

            var qry = {
                query: $("#frmData_MAIN").attr("query"),
                row: [{
                    crud: "U",
                    column: [
                        { name: "doc_id", value: param.doc_id },
                        { name: "astat", value: "DEL" },
                        { name: "astat_usr", value: gw_com_module.v_Session.USR_ID },
                        { name: "astat_dt", value: "SYSDT" }
                    ]
                }]
            };
            var args = {
                url: "COM",
                user: gw_com_module.v_Session.USR_ID,
                param: [qry],
                nomessage: true,
                handler: {
                    success: successRemove
                }
            };
            gw_com_module.objSave(args);

        }

    }

}
//----------
function successRemove(response, param) {

    var p = {
        handler: processClose,
        param: { data: response }
    };
    gw_com_api.messageBox([{ text: "SUCCESS" }], undefined, undefined, undefined, p);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB1" },
            { type: "GRID", id: "grdData_SUB2" }
        ]
    };
    gw_com_module.objClear(args);

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "SVM_1011_1":
                    case "SVM_1011_2":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                    default:
                        {
                            v_global.logic = param.data;
                            if (param.data == undefined) {
                                return;
                            } else if (param.data.doc_id == undefined || param.data.doc_id == "") {
                                processInsert({});
                            } else {
                                processRetrieve({});
                            }
                            return;
                        }
                        break;
                }
                gw_com_module.streamInterface(args); 
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
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
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
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                switch (param.from.page) {
                    case "SVM_1011_1":
                        {
                            if (param.data != undefined) {
                                var data = new Array();
                                $.each(param.data, function () {
                                    if (gw_com_api.getFindRow("grdData_SUB1", "eco_no", this.eco_no) < 1) {
                                        this.doc_id = gw_com_api.getValue("frmData_MAIN", 1, "doc_id");
                                        this._edit_yn = "1";
                                        data.push(this);
                                    }
                                })
                                if (data.length == 0) return;
                                var args = {
                                    targetid: "grdData_SUB1", edit: true, updatable: true,
                                    data: data
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                    case "SVM_1011_2":
                        {
                            if (param.data != undefined) {
                                var data = new Array();
                                $.each(param.data, function () {
                                    if (gw_com_api.getFindRow("grdData_SUB2", "prod_key", this.prod_key) < 1) {
                                        this.doc_id = gw_com_api.getValue("frmData_MAIN", 1, "doc_id");
                                        this._edit_yn = "1";
                                        data.push(this);
                                    }
                                })
                                if (data.length == 0) return;
                                var args = {
                                    targetid: "grdData_SUB2", edit: true, updatable: true,
                                    data: data
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//