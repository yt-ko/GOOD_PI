//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계측기 대장
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "상태구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI11"}]
                },
                { type: "PAGE", name: "용도별분류", query: "DDDW_QMI_TP1" },
                { type: "PAGE", name: "부서", query: "DDDW_DEPT" },
                {
                    type: "PAGE", name: "장비군", query: "DDDW_DEPTAREA",
                    param: [{ argument: "arg_type", value: "ALL" }]
                },
                //{
                //    type: "INLINE", name: "교정주기",
                //    data: [{ title: "1년", value: "12" }, { title: "2년", value: "24" }, { title: "3년", value: "36" }, { title: "4년", value: "48" }, { title: "5년", value: "60" }]
                //},
                {
                    type: "PAGE", name: "교정주기", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI51" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        // Main Menu : 조회, 추가, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "상세", value: "상세보기", icon: "조회" },
                { name: "추가", value: "추가" },
                { name: "수정", value: "수정", icon: "추가" },
                //{ name: "출력", value: "이력카드", icon: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        // Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "astat", validate: true },
            content: {
                row: [
                    {
                        element: [
                            { name: "mng_dept", label: { title: "관리부서 :" },
                                editable: { type: "select", size: 1,
                                    data: { memory: "부서", unshift: [{ title: "전체", value: "" }] }
                                }
                            },
                            {
                                name: "use_dept", label: { title: "사용부서 :" },
                                editable: {
                                    type: "select", size: 7, maxlength: 20,
                                    data: { memory: "부서", unshift: [{ title: "전체", value: "" }] }
                                }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: {
                                    type: "select", size: 7, maxlength: 20,
                                    data: { memory: "장비군", unshift: [{ title: "전체", value: "" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "ymd_fr", label: { title: "구매일자 :" }, mask: "date-ymd",
                                style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            { name: "ymd_use", editable: { type: "checkbox", value: "1", offval: "0" } },
                            {
                                name: "pstat", label: { title: "상태구분 :" },
                                editable: {
                                    type: "select", size: 7, maxlength: 20,
                                    data: { memory: "상태구분", unshift: [{ title: "전체", value: "" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "qmi_no", label: { title: "관리번호 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            { name: "asset_no", hidden : true, label: { title: "자산번호 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            { name: "qmi_nm", label: { title: "기기명 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "class1_cd", label: { title: "용도별분류 : " },
                                editable: {
                                    type: "select",
                                    data: { memory: "용도별분류", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "class2_cd", hidden : true, label: { title: "분류2 : " },
                                editable: {
                                    type: "select",
                                    data: { memory: "분류2", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "ser_no", label: { title: "Serial No. :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button"} },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기"} }
                        ], align: "right"
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        // Main Grid : 발생 내역
        var args = {
            targetid: "grdData_현황", query: "QMI_1001_1", title: "계측기 일람",
            caption: true, height: 175, show: true, selectable: true, number: true,// color: { row: true },
            element: [
                { header: "장비군", name: "dept_area_nm", width: 80 },
                { header: "용도별분류", name: "class1_nm", width: 100 },
                { header: "관리번호", name: "qmi_no", width: 80, align: "center" },
                { header: "기기명", name: "qmi_nm", width: 150 },
                //{ header: "형식", name: "spec", width: 100 },
                //{ header: "용도", name: "usage", width: 100 },
                { header: "제조사", name: "maker_nm", width: 100 },
                { header: "Model No.", name: "model_no", width: 100 },
                { header: "Serial No.", name: "ser_no", width: 100 },
                { header: "구매/생산일자", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "구매가격", name: "pur_price", width: 80, align: "right", mask: "currency-int", sorttype: "int" },
                //{ header: "구입처", name: "vendor_nm", width: 100 },
                //{ header: "자산번호", name: "asset_no", width: 80 },
                //{ header: "정밀도", name: "accuracy", width: 60, align: "center" },
                //{ header: "허용오차", name: "max_margin", width: 60, align: "center" },
                {
                    header: "교정", name: "calibrate_yn", width: 60, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                //{ header: "교정주기", name: "calibrate_term", width: 60, align: "center" },
                {
                    header: "교정주기", name: "calibrate_term", width: 60, align: "center",
                    format: { type: "select", data: { memory: "교정주기" } }
                },
                { header: "비교정사유", name: "calibrate_reason", width: 120, align: "center" },
                { header: "차기교정일", name: "next_calibrate_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "담당자", name: "mng_emp_nm", width: 60, align: "center" },
                { header: "관리부서", name: "mng_dept_nm", width: 80 },
                //{ header: "보관부서", name: "keep_dept_nm", width: 80 },
                { header: "계측기상태", name: "pstat_nm", width: 80, align: "center" },
                { header: "비고", name: "mng_rmk", width: 120 },
                { name: "qmi_key", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        // Sub Grid : 진행 이력
        var args = {
            targetid: "grdData_이력", query: "QMI_1001_2", title: "이력사항(교정검사, 수리내역, 기타사항)",
            caption: true, height: 195, pager: false, show: true, selectable: true, number: true,
            element: [
                //{ header: "관리번호", name: "qmi_no", width: 80, align: "center" },
                //{ header: "계측기명", name: "qmi_nm", width: 150 },
                { header: "변동구분", name: "chg_tp_nm", width: 80, align: "center" },
                { header: "변동일자", name: "chg_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "교정비용", name: "chg_amt", width: 100, align: "right", mask: "numeric-int" },
                { header: "업체", name: "vendor_nm", width: 200 },
                { header: "내용", name: "chg_rmk", width: 380 },
                { header: "유효기간", name: "valid_date", width: 80, align: "center", mask: "date-ymd", hidden: true },
                { header: "교정담당자", name: "chk_emp_nm", width: 100, align: "center" },
                { header: "확인일자", name: "chk_date", width: 80, align: "center", mask: "date-ymd", hidden: true },
                { header: "차기교정일", name: "next_calibrate_date", width: 90, align: "center", mask: "date-ymd" },
                { name: "qmi_key", hidden: true },
                { name: "qmi_seq", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        // Sub Grid2 : 예약 현황
        var args = {
            targetid: "grdData_예약", query: "QMI_1001_3", title: "대여 이력",
            caption: true, height: 150, show: true, selectable: true, number: true,
            element: [
                { header: "대여일자", name: "lend_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "대여부서", name: "use_dept_nm", width: 60, align: "center" },
                { header: "대여자", name: "use_emp_nm", width: 50, align: "center" },
                { header: "반납예정일", name: "to_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "관리자 비고", name: "lend_rmk", width: 200 },
                { header: "불출부서", name: "lend_dept_nm", width: 60, align: "center" },
                { header: "불출자", name: "lend_emp_nm", width: 50, align: "center" },
                { header: "반납일자", name: "return_dt", width: 80, align: "center", mask: "date-ymd" },
                //{ header: "예약일시", name: "booking_dt", width: 150, align: "center" },
                //{ header: "계측기상태", name: "pstat_nm", width: 50, align: "center" },
                ///{ header: "예약자 비고", name: "booking_rmk", width: 200 },
                //{ header: "사용기간(Fr)", name: "fr_dt", width: 130, align: "center" },
                //{ header: "사용기간(To)", name: "to_dt", width: 130, align: "center" },
                //{ header: "사용기간(Fr)", name: "fr_date", width: 80, align: "center", mask: "date-ymd" },
                { name: "qmi_key", hidden: true },
                { name: "qmi_seq", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        // resize objects
        var args = {
            target: [
                { type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "GRID", id: "grdData_이력", offset: 8 },
                { type: "GRID", id: "grdData_예약", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processExport };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------

        //==== Grid Events : Main
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------

        // startup process.
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setAttribute("frmOption", 1, "ymd_fr", "disabled", true);
        gw_com_api.setAttribute("frmOption", 1, "ymd_to", "disabled", true);
        //----------
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//----------
function processItemchanged(param) {
    switch (param.object) {
        case "frmOption":
            if (param.element == "ymd_use") {
                if (param.value.current == "1") {
                    gw_com_api.setAttribute("frmOption", 1, "ymd_fr", "disabled", false);
                    gw_com_api.setAttribute("frmOption", 1, "ymd_to", "disabled", false);
                } else {
                    gw_com_api.setAttribute("frmOption", 1, "ymd_fr", "disabled", true);
                    gw_com_api.setAttribute("frmOption", 1, "ymd_to", "disabled", true);
                }
            }
            break;
    }
}
//----------
function processInsert(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage, to: { type: "MAIN" },
        data: { page: "QMI_1002", title: "계측기 등록" }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processEdit(param) {

    if (gw_com_api.getSelectedRow("grdData_현황") != null) {
        var args = {
            ID: gw_com_api.v_Stream.msg_linkPage, to: { type: "MAIN" },
            data: {
                page: "QMI_1002", title: "계측기 등록",
                param: [
                    { name: "qmi_key", value: gw_com_api.getValue("grdData_현황", "selected", "qmi_key", true) }
                ]
            }
        };
        gw_com_module.streamInterface(args);
    }

}
//----------
function processRetrieve(param) {

    var args = new Object();
    if (param.object == "grdData_현황") {
        if (gw_com_api.getSelectedRow("grdData_현황", false) < 1) return;
        args = {
            source: {
                type: "GRID", id: "grdData_현황", row: "selected",
                element: [
                    { name: "qmi_key", argument: "arg_qmi_key" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_이력", select: true },
                { type: "GRID", id: "grdData_예약", select: true }
            ]
        };

    } else {
        // Validate Inupt Options
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        // Retrieve
        args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "pstat", argument: "arg_pstat" },
                    //{ name: "ymd_fr", argument: "arg_ymd_fr" },
                    //{ name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "mng_dept", argument: "arg_mng_dept" },
                    { name: "use_dept", argument: "arg_use_dept" },
                    { name: "dept_area", argument: "arg_dept_area" }, //장비군 추가 by 고윤수(181218)
                    { name: "qmi_no", argument: "arg_qmi_no" },
                    { name: "asset_no", argument: "arg_asset_no" },
                    { name: "qmi_nm", argument: "arg_qmi_nm" },
                    { name: "class1_cd", argument: "arg_class1_cd" },
                    { name: "class2_cd", argument: "arg_class2_cd" },
                    { name: "ser_no", argument: "arg_ser_no" }
                ],
                argument: [
                    { name: "arg_ymd_fr", value: (gw_com_api.getValue("frmOption", 1, "ymd_use") == "1" ? gw_com_api.getValue("frmOption", 1, "ymd_fr") : "0") },
                    { name: "arg_ymd_to", value: (gw_com_api.getValue("frmOption", 1, "ymd_use") == "1" ? gw_com_api.getValue("frmOption", 1, "ymd_to") : "9") }
                ],
                remark: [
                    { element: [{ name: "pstat" }] },
                    { element: [{ name: "mng_dept" }] },
                    { element: [{ name: "use_dept" }] },
                    { element: [{ name: "qmi_no" }] },
                    { element: [{ name: "qmi_nm" }] },
                    //{ element: [{ name: "asset_no" }] },
                    { element: [{ name: "class1_cd" }] },
                    { element: [{ name: "ser_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_현황", focus: true, select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_이력" },
                { type: "GRID", id: "grdData_예약" }
            ]
        };

        if (gw_com_api.getValue("frmOption", 1, "ymd_use") == "1") {
            args.source.remark.unshift({ infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] });
        }

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processExport(param) {

    var ids = gw_com_api.getSelectedRow("grdData_현황", false);
    if (ids == null) {//if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        return;
    }

    //var qmi_key = "";
    //$.each(ids, function () {
    //    if (qmi_key.length > 0)
    //        qmi_key += ",";

    //    qmi_key += gw_com_api.getCellValue("GRID", "grdData_현황", this, "qmi_key");
    //});
    var qmi_key = gw_com_api.getValue("grdData_현황", "selected", "qmi_key", true);

    var args = {
        //source: {
        //    type: "INLINE", json: true,
        //    argument: [
        //        { name: "arg_ann_key", value: ann_key },
        //        { name: "arg_app_key", value: app_key } //app_key.replace(/,/gi, "','") }
        //    ]
        //},
        option: [
            { name: "PRINT", value: "xls" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "QMI_KEY", value: qmi_key }
        ],
        target: { type: "FILE", id: "lyrDown", name: "검사설비 이력카드" }
    };
    gw_com_module.objExport(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                            if (param.data.result == "YES") processSave(param.data.arg);
                            else { var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processDelete({});
                                else if (status == "update") processRestore({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//