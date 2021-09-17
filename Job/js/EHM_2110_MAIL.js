//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        //[1] initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
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
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //create UI objects & define events & start logic
        function start() {
            //[3.1] UI & Events
            gw_job_process.UI();
            gw_job_process.procedure();
            //[3.2] Notice Opened Event to Master Page
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "통보", value: "통보", icon: "기타" },
                { name: "닫기", value: "취소", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
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
                                }//,
                                //{
                                //    name: "pstat", label: { title: "미처리 :" },
                                //    editable: { type: "checkbox", value: "3", offval: "%" }
                                //}
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
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "qc_dept", label: { title: "분석담당부서 :" },
                                    editable: { type: "text", size: 12 }
                                },
                                {
                                    name: "qc_usr", label: { title: "분석담당자 :" },
                                    editable: { type: "text", size: 12 }
                                },
                                { name: "stock_tp", hidden: true },
                                { name: "invoice_no", hidden: true },
                                { name: "stock_status", hidden: true },
                                { name: "import_yn", hidden: true }
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
            targetid: "grdList_MAIN", query: "EHM_2110_1", title: "자재반입요청목록",
            caption: true, height: 390, pager: false, show: true, selectable: true, number: true, multi: true, checkrow: true,
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
                { header: "A/S 번호", name: "issue_no", width: 70, align: "center" },
                { header: "NCR 번호", name: "ncr_no", width: 75, align: "center" },
                { header: "수리구매요청서번호", name: "rqst_no", width: 120 },
                //{
                //    header: "국내반입", name: "import_yn", width: 50, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" }, hidden: true
                //},
                //{
                //    header: "재수출", name: "export_yn", width: 50, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" }
                //},
                { header: "반입목적", name: "rqst_tp_nm", width: 90, align: "center" },
                //{ header: "수입신고일", name: "imp_inf02", width: 100, align: "center", mask: "date-ymd" },
                //{ header: "수입면장번호", name: "imp_inf03", width: 100, editable: { type: "text" } },
                //{ header: "수입B/L번호", name: "imp_inf04", width: 100, editable: { type: "text" } },
                //{ header: "수입Invoice No.", name: "imp_inf05", width: 100, editable: { type: "text" } },
                //{ header: "재수출이행일", name: "exp_inf01", width: 100, align: "center", mask: "date-ymd" },
                //{ header: "수출신고일", name: "exp_inf02", width: 100, align: "center", mask: "date-ymd" },
                //{ header: "수출면장번호", name: "exp_inf03", width: 100, editable: { type: "text" } },
                //{ header: "수출Invoice No.", name: "exp_inf05", width: 100, editable: { type: "text" } },
                //{ header: "재수출비고", name: "reexp_rmk", width: 300 },
                //{ header: "현지입고<br/>등록일", name: "local_stock_dt", width: 70, align: "center", mask: "date-ymd" },
                //{ header: "현지입고<br/>등록자", name: "local_stock_usr_nm", width: 60, align: "center" },
                //{ header: "현지입고<br/>비고", name: "local_stock_rmk", width: 300 },
                //{ header: "Site국내<br/>배송일", name: "invoice_dt", width: 70, align: "center", mask: "date-ymd" },
                //{ header: "Site국내<br/>배송자", name: "invoice_usr_nm", width: 60, align: "center" },
                //{ header: "Invoice No.", name: "invoice_no", width: 100 },
                //{ header: "배송비고", name: "invoice_rmk", width: 300 },
                { header: "요청일", name: "rqst_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "요청자", name: "rqst_usr_nm", width: 60, align: "center" },
                { header: "요청비고", name: "rqst_rmk", width: 300 },
                { header: "반입일", name: "stock_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반입<br/>수령자", name: "stock_usr_nm", width: 60, align: "center" },
                { header: "반입비고", name: "stock_rmk", width: 300, },
                //{ header: "반출일", name: "carry_dt", width: 70, align: "center", mask: "date-ymd" },
                //{ header: "반출<br/>수령자", name: "carry_usr_nm", width: 60, align: "center" },
                //{ header: "반출비고", name: "carry_rmk", width: 300 },
                { header: "분석담당부서", name: "qc_dept_nm", width: 100, align: "center" },
                { header: "분석담당자", name: "qc_usr_nm", width: 100, align: "center" },
                { header: "분석시작일", name: "qc_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "분석완료일", name: "qce_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "처리구분", name: "qc_tp_nm", width: 60, align: "center" },
                { header: "귀책구분", name: "duty_tp_nm", width: 60, align: "center" },
                { header: "분석결과", name: "qc_rmk", width: 300 },
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
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 15 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "통보", event: "click", handler: processSendmail };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================

        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

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
                { name: "stock_tp", argument: "arg_stock_tp" },
                { name: "invoice_no", argument: "arg_invoice_no" },
                //{ name: "pstat", argument: "arg_pstat" },
                { name: "qc_dept", argument: "arg_qc_dept" },
                { name: "qc_usr", argument: "arg_qc_usr" },
                { name: "stock_status", argument: "arg_stock_status" },
                { name: "import_yn", argument: "arg_import_yn" },
                { name: "rqst_no", argument: "arg_rqst_no" }
            ],
            argument: [
                { name: "arg_pstat", value: "%" }
                //{ name: "arg_stock_status", value: v_global.logic.stock_status },
                //{ name: "arg_import_yn", value: v_global.logic.import_yn }
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
                { element: [{ name: "qc_dept" }] },
                { element: [{ name: "qc_usr" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function processSendmail(param) {

    var ids = gw_com_api.getSelectedRow("grdList_MAIN", true);
    if (ids.length < 1 || ids == undefined) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var key = "";
    $.each(ids, function () {
        var stock_no = gw_com_api.getValue("grdList_MAIN", this, "stock_no", true);
        key += (key == "" ? stock_no : "^" + stock_no);
    });

    var args = {
        url: "COM",
        subject: MailInfo.getSubject({ type: v_global.logic.mail_type, stock_no: key }),
        body: MailInfo.getBody({ type: v_global.logic.mail_type, stock_no: key }),
        to: MailInfo.getTo({ type: v_global.logic.mail_type, stock_no: key }),
        edit: true
    };
    gw_com_module.sendMail(args);
    processClose({});

}
//----------
var MailInfo = {
    getSubject: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=EHM_2100_MAIL" +
                    "&QRY_COLS=value" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type + "&arg_field=subject&arg_stock_no=" + param.stock_no,
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
    },
    getBody: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=EHM_2100_MAIL" +
                    "&QRY_COLS=value" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type + "&arg_field=body&arg_stock_no=" + param.stock_no,
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
    },
    getTo: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=EHM_2100_MAIL" +
                    "&QRY_COLS=name,value" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type + "&arg_field=receiver&arg_stock_no=" + param.stock_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            $.each(data, function () {
                rtn.push({
                    name: this.DATA[0],
                    value: this.DATA[1]
                });
            });
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = {
                to: { type: "POPUP", page: param.from.page },
                ID: param.ID
            };
            switch (param.from.page) {
                case "w_find_emp":
                    {
                        args.ID = gw_com_api.v_Stream.msg_selectEmployee;
                        args.data = v_global.logic.search;
                    }
                    break;
                case "w_find_dept":
                    {
                        args.ID = gw_com_api.v_Stream.msg_selectDepartment;
                        args.data = v_global.logic.search;
                    }
                    break;
                case "w_find_proj_scm":
                    {
                        args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
                        args.data = v_global.logic.search;
                    }
                    break;
                default:
                    if (param.data != undefined) {
                        v_global.logic = param.data;
                        $.each(v_global.logic, function (name, value) {
                            gw_com_api.setValue("frmOption", 1, name, value);
                        });
                        processRetrieve({});
                    }
                    return;
                    break;
            }
            gw_com_module.streamInterface(args);

        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM: {
            gw_com_api.setValue(v_global.event.object,
                                v_global.event.row,
                                v_global.event.cd,
                                param.data.proj_no,
                                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object,
                                v_global.event.row,
                                v_global.event.nm,
                                param.data.proj_nm,
                                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
            if (param.data != undefined) {
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.nm,
                                    param.data.emp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.cd,
                                    param.data.emp_no,
                                    (v_global.event.type == "GRID") ? true : false);
                if (v_global.event.cd == "qc_emp") {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        "qc_dept_nm",
                                        param.data.dept_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        "qc_dept",
                                        param.data.dept_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                }
            }
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedDepartment: {
            gw_com_api.setValue(
                                v_global.event.object,
                                v_global.event.row,
                                v_global.event.nm,
                                param.data.dept_nm,
                                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(
                                v_global.event.object,
                                v_global.event.row,
                                v_global.event.cd,
                                param.data.dept_cd,
                                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });

        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//