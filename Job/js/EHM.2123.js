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
                }//,
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
            gw_com_api.setValue("frmOption", 1, "stock_tp", "B");   // A:국내, B:해외
            gw_com_api.setValue("frmOption", 1, "pstat", "1");
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
                                },
                                {
                                    name: "pstat", label: { title: "미처리 :" },
                                    editable: { type: "checkbox", value: "1", offval: "%" }
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
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                },
                                {
                                    name: "ser_no", label: { title: "Ser. No. :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                },
                                { name: "stock_tp", hidden: true },
                                { name: "qc_dept", hidden: true },
                                { name: "qc_usr", hidden: true }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "invoice_no", label: { title: "Invoice No. :" },
                                    editable: { type: "text", size: 12 }
                                },
                                {
                                    name: "rqst_no", label: { title: "수리구매서요청번호 :" },
                                    editable: { type: "text", size: 12 }
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
            editable: { master: true, bind: "select", focus: "local_stock_dt", validate: true },
            element: [
                { header: "장비군", name: "dept_area_nm", width: 70 },
                //{ header: "고객사", name: "cust_nm", width: 80, hidden: true },
                { header: "LINE", name: "cust_dept_nm", width: 70 },
                { header: "Process", name: "cust_proc_nm", width: 70 },
                { header: "설비명", name: "cust_prod_nm", width: 120 },
                //{ header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                { header: "품목코드", name: "part_cd", width: 80, align: "center" },
                { header: "품목명", name: "part_nm", width: 160 },
                { header: "Ser. No.", name: "ser_no", width: 120 },
                { header: "수량", name: "rqst_qty", width: 50, align: "right", mask: "numeric-int" },
                {
                    header: "A/S 번호", name: "issue_no", width: 70, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "NCR 번호", name: "ncr_no", width: 75, align: "center" },
                { header: "수리구매요청서번호", name: "rqst_no", width: 120 },
                //{
                //    header: "고분보", name: "issue_tar_yn", width: 50, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" }
                //},
                //{
                //    header: "국내반입", name: "import_yn", width: 50, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" }, hidden: true
                //},
                //{
                //    header: "재수출", name: "export_yn", width: 50, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" }, hidden: true
                //},
                { header: "반입목적", name: "rqst_tp_nm", width: 90, align: "center" },
                //{
                //    header: "현지입고<br/>등록일", name: "local_stock_dt", width: 100, align: "center",
                //    editable: { type: "text" }, mask: "date-ymd", hidden: true
                //},
                //{
                //    header: "현지입고<br/>등록자", name: "local_stock_usr_nm", width: 60, align: "center",
                //    editable: { type: "text", width: 66 }, mask: "search", hidden: true
                //},
                //{
                //    header: "현지입고<br/>비고", name: "local_stock_rmk", width: 300,
                //    editable: { type: "text", maxlength: 200, width: 306 }, hidden: true
                //},
                //{
                //    header: "Site국내<br/>배송일", name: "invoice_dt", width: 100, align: "center",
                //    editable: { type: "text" }, mask: "date-ymd", hidden: true
                //},
                //{
                //    header: "Site국내<br/>배송자", name: "invoice_usr_nm", width: 60, align: "center",
                //    editable: { type: "text", width: 66 }, mask: "search", hidden: true
                //},
                {
                    header: "Invoice No.", name: "invoice_no", width: 100,
                    editable: { type: "text", maxlength: 50, width: 106 }
                },
                //{
                //    header: "배송비고", name: "invoice_rmk", width: 300, hidden: true,
                //    editable: { type: "text", maxlength: 200, width: 306 }
                //},
                { header: "요청일", name: "rqst_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "요청자", name: "rqst_usr_nm", width: 60, align: "center" },
                { header: "요청비고", name: "rqst_rmk", width: 300 },
                { header: "반입일", name: "stock_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반입<br/>수령자", name: "stock_usr_nm", width: 60, align: "center" },
                { header: "반입비고", name: "stock_rmk", width: 300, },
                { header: "반출일", name: "carry_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반출<br/>수령자", name: "carry_usr_nm", width: 60, align: "center" },
                { header: "반출비고", name: "carry_rmk", width: 300 },
                //{ header: "최종상태", name: "stock_status_nm", width: 60, align: "center" },
                { header: "최종상태", name: "pstat_nm", width: 80, align: "center" },
                { name: "stock_no", editable: { type: "hidden" }, hidden: true },
                { name: "cust_prod", hidden: true },
                { name: "stock_status", editable: { type: "hidden" }, hidden: true },
                { name: "issue_seq", editable: { type: "hidden" }, hidden: true },
                { name: "part_seq", editable: { type: "hidden" }, hidden: true },
                { name: "local_stock_usr", editable: { type: "hidden" }, hidden: true },
                { name: "invoice_usr", editable: { type: "hidden" }, hidden: true }
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
        ////----------
        //var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        //gw_com_module.eventBind(args);
        ////----------
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
        var args = { targetid: "grdData_Main", grid: true, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "itemkeyup", handler: processKeyup };
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
                { name: "pstat", argument: "arg_pstat" },
                { name: "rqst_no", argument: "arg_rqst_no" }
            ],
            argument: [
                { name: "arg_stock_status", value: "020" },
                { name: "arg_import_yn", value: "%" }
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
                { element: [{ name: "ser_no" }] },
                { element: [{ name: "invoice_no" }] }
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
function processItemChanged(param) {

    if (param == undefined || param.object == undefined) return;

    switch (param.object) {
        case "grdData_Main":
            switch (param.element) {
                case "local_stock_usr":
                case "local_stock_dt":
                    //gw_com_api.setValue(param.object, param.row, "stock_status_nm", "030", (param.type == "GRID" ? true : false));
                    //gw_com_api.setValue(param.object, param.row, "stock_status", "030", (param.type == "GRID" ? true : false));
                    if (param.element == "local_stock_usr" && param.value.current > "" && gw_com_api.getValue(param.object, param.row, "local_stock_dt", (param.type == "GRID" ? true : false)) == "") {
                        gw_com_api.setValue(param.object, param.row, "local_stock_dt", gw_com_api.getDate(""), (param.type == "GRID" ? true : false));
                    } else if (param.element == "local_stock_dt" && param.value.current > "" && gw_com_api.getValue(param.object, param.row, "local_stock_usr", (param.type == "GRID" ? true : false)) == "") {
                        gw_com_api.setValue(param.object, param.row, "local_stock_usr", gw_com_module.v_Session.USR_ID, (param.type == "GRID" ? true : false));
                        gw_com_api.setValue(param.object, param.row, "local_stock_usr_nm", gw_com_module.v_Session.USR_NM, (param.type == "GRID" ? true : false));
                    }
                    break;
                case "invoice_dt":
                case "invoice_usr":
                case "invoice_usr_nm":
                case "invoice_no":
                case "invoice_rmk":
                    if (gw_com_api.getValue(param.object, param.row, "import_yn", true) != "1") {
                        gw_com_api.setValue(param.object, param.row, "invoice_dt", "", true, false, false);
                        gw_com_api.setValue(param.object, param.row, "invoice_usr", "", true, false, false);
                        gw_com_api.setValue(param.object, param.row, "invoice_usr_nm", "", true, false, false);
                        gw_com_api.setValue(param.object, param.row, "invoice_no", "", true, false, false);
                        gw_com_api.setValue(param.object, param.row, "invoice_rmk", "", true, false, false);
                        gw_com_api.messageBox([{ text: "국내 반입 품목에만 정보를 입력할 수 있습니다." }]);
                        return false;
                    } else {
                        if (param.element == "invoice_usr" && param.value.current > "" && gw_com_api.getValue(param.object, param.row, "invoice_dt", (param.type == "GRID" ? true : false)) == "") {
                            gw_com_api.setValue(param.object, param.row, "invoice_dt", gw_com_api.getDate(""), (param.type == "GRID" ? true : false));
                        } else if (param.element == "invoice_dt" && param.value.current > "" && gw_com_api.getValue(param.object, param.row, "invoice_usr", (param.type == "GRID" ? true : false)) == "") {
                            gw_com_api.setValue(param.object, param.row, "invoice_usr", gw_com_module.v_Session.USR_ID, (param.type == "GRID" ? true : false));
                            gw_com_api.setValue(param.object, param.row, "invoice_usr_nm", gw_com_module.v_Session.USR_NM, (param.type == "GRID" ? true : false));
                        }
                        //if (param.current.value > "") {
                        //    var invoice_dt = gw_com_api.getValue(param.object, param.row, "invoice_dt", true);
                        //    var invoice_usr = gw_com_api.getValue(param.object, param.row, "invoice_usr", true);
                        //    var invoice_usr_nm = gw_com_api.getValue(param.object, param.row, "invoice_usr_nm", true);
                        //    gw_com_api.setValue(param.object, param.row, "invoice_dt", (invoice_dt == "" ? gw_com_api.getDate() : invoice_dt), true, false, false);
                        //    gw_com_api.setValue(param.object, param.row, "invoice_usr", (invoice_usr == "" ? gw_com_module.v_Session.USR_ID : invoice_usr), true, false, false);
                        //    gw_com_api.setValue(param.object, param.row, "invoice_usr_nm", (invoice_usr == "" ? gw_com_module.v_Session.USR_ID : invoice_usr_nm), true, false, false);
                        //    return false;
                        //}
                    }
                    break;
            }
            break;
    }
}
//----------
function processKeyup(param) {

    if (param.object == "grdData_Main") {
        if (param.element == "local_stock_usr_nm" || param.element == "invoice_usr_nm") {
            if (event.keyCode == 46) {
                gw_com_api.setValue(param.object, param.row, param.element, "", true);
                gw_com_api.setValue(param.object, param.row, param.element.substring(0, param.element.length - 3), "", true, true, true);
            }
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

    args.url = "COM";
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
                    if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
                    if (param.element == "invoice_usr_nm" && gw_com_api.getValue(param.object, param.row, "import_yn", true) != "1") return;
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
                } else {
                    return;
                }
            }
            break;
        case "lyrMenu":
            {
                page = "EHM_2113";
                title = "반입목록";
                width = 950;
                height = 430;
                id = gw_com_api.v_Stream.msg_openedDialogue;
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
                    case "EHM_2111":
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
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "EHM_2111": {
                        if (param.data != undefined && param.data.rows != undefined) {
                            var args = { targetid: "grdData_Main", edit: true, updatable: true };
                            args.data = param.data.rows;
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
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
