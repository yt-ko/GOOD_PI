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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
                {
                    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
                },
                {
                    type: "PAGE", name: "발생구분", query: "DDDW_ISSUE_TP",
                    param: [
                        { argument: "arg_rcode", value: "AS" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }
                //{
                //    type: "PAGE", name: "상태구분", query: "DDDW_CM_CODED",
                //    param: [
                //        { argument: "arg_hcode", value: "IEHM70" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "처리구분", query: "DDDW_CM_CODED",
                //    param: [
                //        { argument: "arg_hcode", value: "IEHM71" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "처분구분", query: "DDDW_CM_CODED",
                //    param: [
                //        { argument: "arg_hcode", value: "IEHM72" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "귀책구분", query: "DDDW_CM_CODED",
                //    param: [
                //        { argument: "arg_hcode", value: "IEHM25" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "처리유형", query: "DDDW_CM_CODED",
                //    param: [
                //        { argument: "arg_hcode", value: "IEHM76" }
                //    ]
                //}
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

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // startup process.
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "stock_tp", "A");   // A:국내, B:해외
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                //{ name: "추가", value: "추가" },
                //{ name: "추가2", value: "A/S 추가", icon: "추가" },
                //{ name: "삭제", value: "삭제" },
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
            editable: { bind: "open", focus: "cust_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "ymd_fr", label: { title: "요청일 :" },
                                    mask: "date-ymd", style: { colfloat: "floating" },
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "dept_area", label: { title: "장비군 :" },
                                    editable: { type: "select", data: { memory: "DEPT_AREA" } }
                                },
                                {
                                    name: "issue_tp", label: { title: "발생구분 :" },
                                    editable: {
                                        type: "select", data: { memory: "발생구분", unshift: [{ title: "전체", value: "%" }] }
                                    }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "rqst_usr", label: { title: "요청자 :" },
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "apart_cd", label: { title: "품목코드 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                },
                                {
                                    name: "apart_nm", label: { title: "품목명 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                },
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "cust_cd", label: { title: "고객사 :" },
                                    editable: {
                                        type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
                                        change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
                                    }
                                },
                                {
                                    name: "cust_dept", label: { title: "LINE :" },
                                    editable: {
                                        type: "select",
                                        data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }
                                    }
                                },
                                {
                                    name: "cust_prod_nm", label: { title: "설비명 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "issue_no", label: { title: "A/S 번호 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                },
                                {
                                    name: "proj_no", label: { title: "Prject No. :" },
                                    editable: { type: "text", size: 12, maxlength: 50 }
                                },
                                {
                                    name: "ser_no", label: { title: "Ser. No. :" },
                                    editable: { type: "text", size: 12, maxlength: 50 }
                                },
                                { name: "stock_tp", hidden: true },
                                { name: "invoice_no", hidden: true },
                                { name: "qc_dept", hidden: true },
                                { name: "qc_usr", hidden: true }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "rqst_no", label: { title: "수리구매요청서번호 :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
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
            targetid: "grdData_Main", query: "EHM_2110_1", title: "자재반입요청목록",
            height: 450, show: true, selectable: true, number: true, //dynamic: true,
            editable: { master: true, bind: "select", focus: "rqst_qty", validate: true },
            element: [
                { header: "장비군", name: "dept_area_nm", width: 70 },
                //{
                //    header: "고객사", name: "cust_nm", width: 80, display: true, hidden: true,
                //    editable: { bind: "create", type: "text", validate: { rule: "required", message: "고객사" } }, mask: "search"
                //},
                {
                    header: "LINE", name: "cust_dept_nm", width: 70, display: true,
                    editable: { bind: "create", type: "text", validate: { rule: "required", message: "LINE" } }, mask: "search"
                },
                { header: "Process", name: "cust_proc_nm", width: 70 },
                { header: "설비명", name: "cust_prod_nm", width: 120 },
                //{ header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                {
                    header: "품목코드", name: "part_cd", width: 80, align: "center",
                    editable: { bind: "create", type: "text", validate: { rule: "required" } }, mask: "search"
                },
                { header: "품목명", name: "part_nm", width: 160 },
                {
                    header: "Ser. No.", name: "ser_no", width: 120,
                    editable: { type: "text", maxlength: 50, width: 126, validate: { rule: "required" } }
                },
                {
                    header: "수량", name: "rqst_qty", width: 50, align: "right",
                    editable: { type: "text", width: 56, validate: { rule: "required" } }, mask: "numeric-int"
                },
                {
                    header: "A/S 번호", name: "issue_no", width: 70, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "NCR 번호", name: "ncr_no", width: 75, align: "center" },
                //{
                //    header: "고분보", name: "issue_tar_yn", width: 50, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" }
                //},
                {
                    header: "수리구매요청서번호", name: "rqst_no", width: 120,
                    editable: { type: "text", maxlength: 20, width: 126 }
                },
                {
                    header: "반입목적", name: "rqst_tp_nm", width: 120/*, mask: "search",
                    editable: { type: "text", width: 126, validate: { rule: "required", message: "반입목적" } }, display: true*/
                },
                {
                    header: "반입목적", name: "rqst_tp", width: 120,
                    editable: { type: "hidden" }, hidden: true
                    //format: { type: "select", data: { memory: "처리유형" } },
                    //editable: {
                    //    bind: "create",
                    //    type: "select", validate: { rule: "required", message: "반입목적" },
                    //    data: { memory: "처리유형", unshift: [{ title: "-", value: "" }] }
                    //}
                },
                {
                    header: "요청일", name: "rqst_dt", width: 100, align: "center",
                    editable: { bind: "create", type: "text", validate: { rule: "required" } }, mask: "date-ymd"
                },
                {
                    header: "요청자", name: "rqst_usr_nm", width: 60, align: "center", mask: "search",
                    editable: { bind: "create", type: "text", validate: { rule: "required" }, width: 66 }, display: true
                },
                {
                    header: "요청비고", name: "rqst_rmk", width: 300,
                    editable: { type: "text", maxlength: 200, width: 306 }
                },
                { header: "반입일", name: "stock_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반입</br>수령자", name: "stock_usr_nm", width: 60, align: "center" },
                { header: "반입비고", name: "stock_rmk", width: 300 },
                //{ header: "최종상태", name: "stock_status_nm", width: 60, align: "center" },
                { header: "최종상태", name: "pstat_nm", width: 80, align: "center" },
                { name: "stock_no", editable: { type: "hidden" }, hidden: true },
                { name: "cust_cd", editable: { type: "hidden" }, hidden: true },
                { name: "cust_dept", editable: { type: "hidden" }, hidden: true },
                { name: "cust_proc", editable: { type: "hidden" }, hidden: true },
                { name: "prod_key", editable: { type: "hidden" }, hidden: true },
                { name: "stock_status", editable: { type: "hidden" }, hidden: true },
                { name: "issue_seq", editable: { type: "hidden" }, hidden: true },
                { name: "part_seq", editable: { type: "hidden" }, hidden: true },
                { name: "stock_tp", editable: { type: "hidden" }, hidden: true },
                { name: "import_yn", editable: { type: "hidden" }, hidden: true },
                { name: "rqst_usr", editable: { type: "hidden" }, hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가2", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //==== DW Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "grdData_Main", grid: true, event: "rowkeyenter", handler: processPopup };
        //gw_com_module.eventBind(args);
        ////----------

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    closeOption();

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "rqst_usr", argument: "arg_rqst_usr" },
                { name: "apart_cd", argument: "arg_apart_cd" },
                { name: "apart_nm", argument: "arg_apart_nm" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "issue_no", argument: "arg_issue_no" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "ser_no", argument: "arg_ser_no" },
                { name: "qc_dept", argument: "arg_qc_dept" },
                { name: "qc_usr", argument: "arg_qc_usr" },
                { name: "stock_tp", argument: "arg_stock_tp" },
                { name: "invoice_no", argument: "arg_invoice_no" },
                { name: "rqst_no", argument: "arg_rqst_no" }
            ],
            argument: [
                { name: "arg_stock_status", value: "0" },
                { name: "arg_import_yn", value: "%" },
                { name: "arg_pstat", value: "%" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "issue_tp" }] },
                { element: [{ name: "rqst_usr" }] },
                { element: [{ name: "apart_cd" }] },
                { element: [{ name: "apart_nm" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_prod_nm" }] },
                { element: [{ name: "issue_no" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "ser_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processItemchanged(param) {

    if (param.object == "grdData_Main") {
        switch (param.element) {
            case "rqst_tp":
                {
                    var ncr_chk = Query.getFCODE({ code: param.value.current });
                    if (ncr_chk == "1" && gw_com_api.getValue(param.object, param.row, "ncr_no", true) == "") {
                        gw_com_api.setValue(param.object, param.row, param.element, "", true, false, false);
                        gw_com_api.messageBox([{ text: "선택된 코드는 NCR 발행된 품목에만 적용할 수 있습니다." }]);
                        return false;
                    }
                }
                break;
        }
    }

}
//----------
function processInsert(param) {

    closeOption();

    processPopup(param);
}
//----------
function processDelete(param) {

    closeOption();

    var args = { targetid: "grdData_Main", row: "selected", focus: true, select: true }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    closeOption();

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processClear(param) {

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
function processPopup(param) {

    if (param.object == undefined) return;
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args, page, title, width, height, id, data;
    switch (param.object) {
        case "grdData_Main":
            {
                if (param.element.substring(param.element.length, param.element.length - 6) == "usr_nm") {
                    //if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
                    if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) != "C") return;
                    page = "DLG_USER";
                    title = "사용자 조회";
                    width = 600;
                    height = 430;
                    id = gw_com_api.v_Stream.msg_openedDialogue;
                    v_global.logic.popup_data = { user_tp: "EMP" };
                    data = v_global.logic.popup_data;
                } else if (param.element == "issue_no") {
                    if ($.inArray(gw_com_api.getValue(param.object, param.row, param.element, true), ["", "undefined", undefined]) >= 0) return;
                    page = "DLG_ISSUE";
                    title = "문제 상세 정보";
                    width = 1100;
                    height = 500;
                    id = gw_com_api.v_Stream.msg_infoAS;
                    v_global.logic.popup_data = { issue_no: gw_com_api.getValue(param.object, param.row, param.element, true) };
                    data = v_global.logic.popup_data;
                } else if (param.element == "cust_nm" || param.element == "cust_dept_nm") {
                    //if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
                    if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) != "C") return;
                    page = "w_find_prod_ehm";
                    title = "장비 검색";
                    width = 1100;
                    height = 450;
                    id = gw_com_api.v_Stream.msg_selectProduct_EHM;
                    data = v_global.logic.popup_data;
                } else if (param.element == "part_cd") {
                    //if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
                    if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) != "C") return;
                    page = "w_find_part_erp";
                    title = "부품 검색";
                    width = 900;
                    height = 450;
                    id = gw_com_api.v_Stream.msg_selectPart_SCM;
                    data = v_global.logic.popup_data;
                } else if (param.element == "rqst_tp_nm") {
                    if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
                    page = "DLG_CODE";
                    title = "코드선택";
                    width = 500;
                    height = 300;
                    id = gw_com_api.v_Stream.msg_openedDialogue;
                    v_global.logic.popup_data = {
                        hcode: "IEHM76",
                        multi: false
                    };
                    data = v_global.logic.popup_data;
                } else {
                    return;
                }
            }
            break;
        case "lyrMenu":
            {
                if (param.element == "추가") {
                    var args = {
                        targetid: "grdData_Main", edit: true, updatable: true,
                        data: [
                            { name: "stock_status", value: "020" },
                            { name: "rqst_dt", value: gw_com_api.getDate() },
                            { name: "rqst_usr", value: gw_com_module.v_Session.USR_ID },
                            { name: "rqst_usr_nm", value: gw_com_module.v_Session.USR_NM },
                            { name: "rqst_qty", value: 1 },
                            { name: "stock_tp", value: gw_com_api.getValue("frmOption", 1, "stock_tp") },
                            { name: "import_yn", value: "1" }
                        ]
                    };
                    var row = gw_com_module.gridInsert(args);
                    processPopup({ type: "GRID", object: "grdData_Main", row: row, element: "cust_nm" });
                    return;
                } else if (param.element == "추가2") {
                    page = "EHM_2113";
                    title = "반입목록";
                    width = 1100;
                    height = 430;
                    id = gw_com_api.v_Stream.msg_openedDialogue;
                } else {
                    return;
                }
            }
            break;
        default:
            return;
            break;

    }

    args = {
        type: "PAGE", page: page, title: title,
        width: width, height: height, scroll: true, open: true, control: true, locate: ["center", "center"]
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: id,
            data: data
        }
        gw_com_module.dialogueOpen(args);
    }

}
//----------
var Query = {
    getFCODE: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=EHM_2110_9" +
                    "&QRY_COLS=fcode2" +
                    "&CRUD=R" +
                    "&arg_dcode=" + param.code,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            //if (param.data.result == "YES")
                            //processSave({});
                            //else {
                            //var status = checkCRUD({});
                            //if (status == "initialize" || status == "create")
                            //    processClear({});
                            //if (v_global.process.handler != null)
                            //    v_global.process.handler({});
                            //}
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
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "EHM_2113":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        }
                        break;
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                    case "DLG_USER":
                        args.ID = param.ID;
                        args.data = v_global.logic.popup_data;
                        break;
                    case "w_find_prod_ehm":
                        args.ID = gw_com_api.v_Stream.msg_selectProduct_EHM;
                        args.data = v_global.logic.popup_data;
                        break;
                    case "DLG_CODE":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.logic.popup_data;
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "EHM_2113": {
                        if (param.data != undefined && param.data.rows != undefined) {
                            var args = { targetid: "grdData_Main", edit: true, updatable: true };
                            args.data = param.data.rows;

                            $.each(args.data, function (i) {
                                this.rqst_qty = 1;
                                this.stock_tp = gw_com_api.getValue("frmOption", 1, "stock_tp");
                                this.import_yn = "1";   // 국내반입여부
                                this.rqst_usr = gw_com_module.v_Session.USR_ID;
                                this.rqst_usr_nm = gw_com_module.v_Session.USR_NM;
                            });

                            gw_com_module.gridInserts(args);
                        }
                    } break;
                    case "DLG_USER":
                        if (param.data != undefined) {
                            var ele = v_global.event.element.substring(0, v_global.event.element.length - 3);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.user_nm, true);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, ele, param.data.user_id, true);
                        }
                        break;
                    case "DLG_CODE":
                        {
                            if (param.data != undefined) {
                                var ele = v_global.event.element.substring(0, v_global.event.element.length - 3);
                                var ncr_chk = Query.getFCODE({ code: param.data.dcode });
                                if (ncr_chk == "1" && gw_com_api.getValue(v_global.event.object, v_global.event.row, "ncr_no", true) == "") {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, "", true);
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, ele, "", true);
                                    gw_com_api.messageBox([{ text: "선택된 코드는 NCR 발행된 품목에만 적용할 수 있습니다." }]);
                                } else {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.dname, true);
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, ele, param.data.dcode, true);
                                }
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_EHM:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_nm", param.data.cust_nm, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_cd", param.data.cust_cd, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_dept", param.data.cust_dept, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_dept_nm", param.data.cust_dept, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_proc", param.data.cust_proc, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_proc_nm", param.data.cust_proc, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_prod_nm", param.data.cust_prod_nm, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "prod_key", param.data.prod_key, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "proj_no", param.data.proj_no, (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
                if (gw_com_api.getValue(v_global.event.object, v_global.event.row, "part_cd", (v_global.event.type == "GRID") ? true : false) == "") {
                    processPopup({ type: v_global.event.type, object: v_global.event.object, row: v_global.event.row, element: "part_cd" });
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_SCM:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_cd", param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_nm", param.data.part_nm, (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
