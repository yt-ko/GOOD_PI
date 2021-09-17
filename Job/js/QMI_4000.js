//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계측기 교정일 관리
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
                //{
                //    type: "PAGE", name: "구매처", query: "dddw_zcode",
                //    param: [{ argument: "arg_hcode", value: "QMI12" }]
                //},
                { type: "PAGE", name: "용도별분류", query: "DDDW_QMI_TP1" },
                //{ type: "PAGE", name: "분류2", query: "DDDW_QMI_TP2" },
                {
                    type: "PAGE", name: "변동구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI31" }]
                },
                {
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "차기", value: "차기" },
                        { title: "최종", value: "최종" },
                        { title: "교정일 없음", value: "%" }
                    ]
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
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

        // Main Menu : 조회, 저장, 추가, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
                { name: "추가", value: "일괄등록", icon: "추가" },
                { name: "상세", value: "계측기상세", icon: "실행" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        // Sub Menu : 추가, 삭제
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
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
                            { name: "date_gb", editable: { type: "select", data: { memory: "구분" } } },
                            {
                                name: "ymd_fr", label: { title: "교정일 :" }, mask: "date-ymd",
                                style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 : " },
                                editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "vendor", hidden : true, label: { title: "구입처 : " },
                                editable: { type: "select", data: { memory: "구매처", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "qmi_nm", label: { title: "기기명 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "class1_cd", label: { title: "용도별분류: " },
                                editable: {
                                    type: "select",
                                    data: { memory: "용도별분류", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "class2_cd", hidden : true, label: { title: "분류2: " },
                                editable: {
                                    type: "select",
                                    data: { memory: "분류2", unshift: [{ title: "전체", value: "%" }] }
                                }
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
            targetid: "grdData_현황", query: "QMI_4000_1", title: "계측기 일람",
            caption: true, height: 175, show: true, selectable: true, number: true, checkrow: true, multi: true,// color: { row: true },
            element: [
				{ header: "장비군", name: "dept_area_nm", width: 50 },
				{ header: "용도별분류", name: "class1_nm", width: 70 },
				{ header: "관리번호", name: "qmi_no", width: 80, align: "center" },
				{ header: "기기명", name: "qmi_nm", width: 150 },
				//{ header: "형식", name: "spec", width: 100 },
				//{ header: "용도", name: "usage", width: 100 },
                { header: "상태구분", name: "pstat_nm", width: 60, align: "center" },
                //{ header: "교정", name: "calibrate_yn", width: 60, align: "center", format: { type: "checkbox", value: "1", offval: "0" } },
                //{ header: "교정주기", name: "calibrate_term", width: 60, align: "center", data: { memory: "교정주기"}, bind: "create" },
                {
                    header: "교정주기", name: "calibrate_term", width: 60, align: "center", format: { type: "select", data: { memory: "교정주기" } }
                },
                //{ header: "비교정사유", name: "calibrate_reason", width: 120, align: "center" },
                { header: "차기교정일", name: "next_calibrate_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "최종교정일", name: "last_calibrate_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "제조사", name: "maker_nm", width: 100 },
				{ header: "모델명", name: "model_no", width: 100 },
				{ header: "Serial No.", name: "ser_no", width: 100 },
				{ header: "구매/생산일자", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "구매가격", name: "pur_price", width: 80, align: "right", mask: "currency-int" },
				//{ header: "구입처", name: "vendor_nm", width: 100 },
				//{ header: "정밀도", name: "accuracy", width: 60, align: "center" },
				//{ header: "허용오차", name: "max_margin", width: 60, align: "center" },
                { header: "담당자", name: "mng_emp_nm", width: 60, align: "center" },
                { header: "관리부서", name: "mng_dept_nm", width: 80 },
                //{ header: "장비군", name: "keep_area_nm", width: 80 },
                //{ header: "보관부서", name: "keep_dept_nm", width: 80 },
                { header: "비고", name: "mng_rmk", width: 120 },
                { name: "qmi_key", hidden: true },
                { name: "color", hidden: true },
                { name: "calibrate_yn2", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        // Sub Grid : 진행 이력
        var args = {
            targetid: "grdData_이력", query: "QMI_4000_2", title: "이력사항(교정검사, 수리내역, 기타사항)",
            caption: true, height: 160, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "chg_tp" },
            element: [
				{
				    header: "변동구분", name: "chg_tp", width: 40, align: "center",
				    format: { type: "select", data: { memory: "변동구분" }, width: 70 },
				    editable: { bind: "create", type: "select", data: { memory: "변동구분" }, width: 70, validate: { rule: "required" } }
				},
				{
				    header: "교정일자", name: "chg_date", width: 60, align: "center", mask: "date-ymd",
				    editable: { type: "text", validate: { rule: "required" }, width: 100 }
				},
				{ header: "교정비용", name: "chg_amt", width: 60, mask: "numeric-int", editable: { type: "text", width: 105 } },
				{ header: "업체", name: "vendor_nm", width: 80, editable: { type: "text", width: 140 } },
				{ header: "내용", name: "chg_rmk", width: 150, editable: { type: "text", width: 260 } },
                {
                    header: "교정담당자", name: "chk_emp_nm", width: 60, align: "center", mask: "search",
                    editable: { type: "text", width: 100 }, display: true
                },
                {
                    header: "차기교정예정일", name: "valid_date", width: 60, align: "center", mask: "date-ymd",
                    editable: { type: "hidden", width: 100 }
                },
                //{
                //    header: "확인일자", name: "chk_date", width: 60, align: "center",
                //    mask: "date-ymd", editable: { type: "text", width: 100 }
                //}, 
                { name: "qmi_key", hidden: true, editable: { type: "hidden" } },
                { name: "qmi_seq", hidden: true, editable: { type: "hidden" } },
                { name: "chk_emp", hidden: true, editable: { type: "hidden" } },
                { name: "calibrate_yn", hidden: true },
                { name: "calibrate_term", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        // resize objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "GRID", id: "grdData_이력", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------


        //==== Button Click : Sub ====
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------


        //==== Button Click : Search Option ====
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

        //==== Grid Events : Sub
        var args = { targetid: "grdData_이력", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_이력", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------

        // startup process.
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));
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
function processButton(param) {

    switch (param.element) {
        case "추가":
            if (param.object == "lyrMenu") {
                var qmi_key = getQmiKeys();
                if (qmi_key.split(",").length > 20) {
                    gw_com_api.messageBox([{text: "20개 이하로 선택하세요."}]);
                    return;
                }
                if (qmi_key == "") return;

                var args = {
                    type: "PAGE", page: "QMI_4001", title: "일괄등록",
                    width: 1150, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_openDialogue,
                    data: {
                        qmi_key: qmi_key
                    }
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args = {
                        page: args.page,
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: args.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } else {
                if (gw_com_api.getSelectedRow("grdData_현황", false) < 1) return;
                var valid_date = getNextCaliDate(
                    gw_com_api.getValue("grdData_현황", "selected", "calibrate_yn2", true),
                    gw_com_api.getValue("grdData_현황", "selected", "calibrate_term", true),
                    gw_com_api.getDate()
                );
                var args = {
                    targetid: "grdData_이력",
                    edit: true,
                    data: [
                        { name: "qmi_key", value: gw_com_api.getValue("grdData_현황", "selected", "qmi_key", true) },
                        { name: "qmi_seq", rule: "INCREMENT", value: 1 },
                        { name: "chg_tp", value: "교정" },
                        { name: "chg_date", value: gw_com_api.getDate() },
                        { name: "valid_date", value: valid_date },
                        { name: "chk_emp_nm", value: gw_com_module.v_Session.USR_NM },
                        { name: "chk_emp", value: gw_com_module.v_Session.EMP_NO },
                        { name: "chk_date", value: gw_com_api.getDate() },
                        { name: "calibrate_yn", value: gw_com_api.getValue("grdData_현황", "selected", "calibrate_yn2", true) },
                        { name: "calibrate_term", value: gw_com_api.getValue("grdData_현황", "selected", "calibrate_term", true) }
                    ]
                };
                gw_com_module.gridInsert(args);

            }
            break;
        case "삭제":
            var args = { targetid: "grdData_이력", row: "selected", select: true };
            gw_com_module.gridDelete(args);
            break;
        case "저장":
            processSave({});
            break;
        case "상세":
            processQMIView(param);
            break;
    }

}
//----------
function processItemchanged(param) {

    switch (param.object) {
        case "grdData_이력":
            //차기 교정일
            if (param.element == "chg_tp") {
                var valid_date = "";
                if (param.value.current == "교정") {
                    valid_date = getNextCaliDate(
                        gw_com_api.getValue(param.object, param.row, "calibrate_yn", true),
                        gw_com_api.getValue(param.object, param.row, "calibrate_term", true),
                        gw_com_api.getValue(param.object, param.row, "chg_date", true)
                    );
                }
                gw_com_api.setValue(param.object, param.row, "valid_date", valid_date, true, true);
                gw_com_api.setValue("grdData_현황", "selected", "next_calibrate_date", valid_date, true, true);

            } else if (param.element == "chg_date") {
                var valid_date = "";
                if (gw_com_api.getValue(param.object, param.row, "chg_tp", true) == "교정") {
                    valid_date = getNextCaliDate(
                        gw_com_api.getValue(param.object, param.row, "calibrate_yn", true),
                        gw_com_api.getValue(param.object, param.row, "calibrate_term", true),
                        param.value.current
                    );
                }
                gw_com_api.setValue(param.object, param.row, "valid_date", valid_date, true, true);
                gw_com_api.setValue("grdData_현황", "selected", "next_calibrate_date", valid_date, true, true);
            }
            break;
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    switch (param.element) {
        case "chk_emp_nm":  //교정담당자
            {
                v_global.event.emp_no = "chk_emp";
                v_global.event.emp_nm = param.element;
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectEmployee,
                    data: {
                        emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                    }
                };
            }
            break;
    }

    if (args != null) {
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: args.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
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
                { type: "GRID", id: "grdData_이력", select: true }
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
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "qmi_nm", argument: "arg_qmi_nm" },
                    { name: "vendor", argument: "arg_vendor" },
                    { name: "class1_cd", argument: "arg_class1_cd" },
                    { name: "class2_cd", argument: "arg_class2_cd" },
                    { name: "date_gb", argument: "arg_date_gb" },
                    { name: "dept_area", argument: "arg_dept_area" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getValue("frmOption", 1, "date_gb") + "교정일 :" },
                    { element: [{ name: "qmi_nm" }] },
                    //{ element: [{ name: "vendor" }] },
                    { element: [{ name: "class1_cd" }] },
                    { element: [{ name: "dept_area" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_현황", focus: true, select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_이력" }
            ]
        };

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        //url: "COM",
        target: [
            { type: "GRID", id: "grdData_이력" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(param) {

    processRetrieve({ object: "grdData_현황" });

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
//----------
function getNextCaliDate(arg1, arg2, arg3) {

    var rtn = "";
    if (arg1 == "1" && arg3 != "") {
        rtn = gw_com_api.addDate("m", arg2, gw_com_api.unMask(arg3, "date-ymd"), "");
    }

    return rtn;

}
//----------
function getQmiKeys() {

    var ids = gw_com_api.getSelectedRow("grdData_현황", true);
    var qmi_key = "";
    if (ids.length > 0) {;
        $.each(ids, function () {
            qmi_key += (qmi_key == "" ? "" : ",") + gw_com_api.getValue("grdData_현황", this, "qmi_key", true);
        });
    }
    return qmi_key;

}
//----------
function processQMIView(param) {

    var qmi_key = gw_com_api.getValue("grdData_현황", "selected", "qmi_key", true);
    if (qmi_key == "" || qmi_key == undefined || qmi_key == "undefined") return;
    var args = {
        type: "PAGE", page: "QMI_1002_VIEW", title: "계측기 정보",
        width: 1150, height: 530, locate: ["center", "top"], scroll: true, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "QMI_1002_VIEW",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: { qmi_key: qmi_key }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
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
                switch (param.from.page) {
                    case "QMI_4001":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                qmi_key: getQmiKeys()
                            };
                        }
                        break;
                    case "QMI_1002_VIEW":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                qmi_key: gw_com_api.getValue("grdData_현황", "selected", "qmi_key", true)
                            };
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.data = {
                                dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "use_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                                emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                            }

                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "QMI_4001":
                        if (param.data != undefined && param.data.saved) {
                            processRetrieve({ object: "grdData_현황" });
                        }
                        break;
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.substr(0, v_global.event.element.length - 3),
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.emp_nm,
                                        param.data.emp_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.emp_no,
                                        param.data.emp_no,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.dept_nm,
                                        param.data.dept_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.dept_cd,
                                        param.data.dept_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//