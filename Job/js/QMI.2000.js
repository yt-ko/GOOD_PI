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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [
                        { argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }
                    ]
                },
                {
				    type: "PAGE", name: "계측기상태", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "QMI41" }]
				},
                {
                    type: "INLINE", name: "시간",
                    data: [
                        { title: "-", value: "" },
						{ title: "07", value: "07" },
						{ title: "08", value: "08" },
						{ title: "09", value: "09" },
						{ title: "10", value: "10" },
						{ title: "11", value: "11" },
						{ title: "12", value: "12" },
						{ title: "13", value: "13" },
						{ title: "14", value: "14" },
						{ title: "15", value: "15" },
						{ title: "16", value: "16" },
						{ title: "17", value: "17" },
						{ title: "18", value: "18" },
						{ title: "19", value: "19" },
						{ title: "20", value: "20" },
						{ title: "21", value: "21" },
						{ title: "22", value: "22" }
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
            targetid: "lyrMenu_1_1", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "추가", value: "예약등록", icon: "추가" },
                { name: "수정", value: "예약수정", icon: "추가" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2_1",
            type: "FREE",
            element: [
				{ name: "조회", value: "새로고침", act: true },
                { name: "상세", value: "계측기상세", icon: "실행" },
                { name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2_2",
            type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, //margin: 220,
            editable: { focus: "dept_area", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            //{
                            //    name: "dept_area", label: { title: "장비군 :" },
                            //    editable: { type: "select", data: { memory: "DEPT_AREA_FIND", unshift: [{ title: "전체", value: "%" }] } }
                            //},
                            { name: "qmi_nm", label: { title: "기기명 :" }, editable: { type: "text", size: 20, maxlength: 50 } }
                        ]
                    },
                    {
                        element: [
				            {
				                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "사용일자 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 } }
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
            targetid: "grdList_Main", query: "QMI_2000_1", title: "계측기 일람",
            caption: true, height: 150, show: true, selectable: true, number: true,
            element: [
				{ header: "관리번호", name: "qmi_no", width: 80, align: "center" },
                { header: "기기명", name: "qmi_nm", width: 150 },
                { header: "형식", name: "spec", wdith: 150 },
                { header: "용도", name: "usage", width: 100 },
                { header: "Model No.", name: "model_no", width: 80 },
                { header: "Serial No.", name: "ser_no", width: 60 },
                { header: "보관부서", name: "keep_dept", width: 60 },
                { header: "보관위치", name: "keep_spot", width: 80 },
                { header: "계측기상태", name: "pstat", width: 60, align: "center" },
				{ name: "qmi_key", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_Sub", query: "QMI_2000_2", title: "사용 예약 현황",
            caption: true, height: 150, show: true, selectable: true, number: true,
            element: [
                //{ header: "사용기간(Fr)", name: "fr_dt", width: 130, align: "center" },
                //{ header: "사용기간(To)", name: "to_dt", width: 130, align: "center" },
                { header: "사용기간(Fr)", name: "fr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "사용기간(To)", name: "to_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "사용부서", name: "use_dept_nm", width: 60, align: "center" },
                { header: "사용자", name: "use_emp_nm", width: 50, align: "center" },
                { header: "예약일시", name: "booking_dt", width: 150, align: "center" },
                { header: "계측기상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "대여일시", name: "lend_dt", width: 150, align: "center" },
                { header: "반납일시", name: "return_dt", width: 150, align: "center" },
                { header: "예약자 비고", name: "booking_rmk", width: 200 },
                { header: "관리자 비고", name: "lend_rmk", width: 200 },
				{ name: "qmi_key", hidden: true },
                { name: "qmi_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "QMI_1002_1", type: "TABLE", title: "계측기 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "qmi_no", validate: true },
            content: {
                width: { label: 90, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "qmi_no", align: "center", editable: { type: "hidden" } },
                            { header: true, value: "기기명", format: { type: "label" } },
                            { name: "qmi_nm", editable: { type: "hidden" } },
                            { header: true, value: "형식", format: { type: "label" } },
                            { name: "spec" },
                            { header: true, value: "계측기상태", format: { type: "label" } },
                            { name: "pstat_nm" },
                            { name: "qmi_key", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "용도", format: { type: "label" } },
                            { name: "usage" },
                            { header: true, value: "구매/생산일자", format: { type: "label" } },
                            { name: "pur_date", mask: "date-ymd" },
                            { header: true, value: "Model No.", format: { type: "label" } },
                            { name: "model_no" },
                            { header: true, value: "제조사", format: { type: "label" } },
                            { name: "maker_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Serial No.", format: { type: "label" } },
                            { name: "ser_no" },
                            { header: true, value: "구입처", format: { type: "label" } },
                            { name: "vendor_nm" },
                            { header: true, value: "관리부서", format: { type: "label" } },
                            { name: "mng_dept_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "mng_emp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교정여부", format: { type: "label" } },
                            { name: "calibrate_yn", format: { type: "checkbox", title: "", value: "1", offval: "0" } },
                            { header: true, value: "교정주기", format: { type: "label" } },
                            { name: "calibrate_term" },
                            { header: true, value: "차기교정일", format: { type: "label" } },
                            { name: "next_calibrate_date", mask: "date-ymd" },
                            { header: true, value: "비교정사유", format: { type: "label" } },
                            { name: "calibrate_reason" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "보관위치", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "keep_spot" },
                            { header: true, value: "비고", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "mng_rmk" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "QMI_2000_2", title: "사용 예약",
            caption: true, height: 195, show: true, selectable: true, number: true,
            editable: { master: true, multi: true, bind: "select", focus: "fr_date", validate: true },
            element: [
                {
                    header: "사용(예정)일", name: "fr_date", width: 90, align: "center",
                    editable: { type: "text", size: 7, maxlength: 10, bind: "create" }, mask: "date-ymd"
                },
                //{
                //    header: "사용(예정)시각", name: "fr_time_v", width: 50, align: "center",
                //    editable: { type: "select", data: { memory: "시간" } }
                //},
                {
                    header: "반납(예정)일", name: "to_date", width: 90, align: "center",
                    editable: { type: "text", size: 7, maxlength: 10, bind: "create" }, mask: "date-ymd"
                },
                //{
                //    header: "반납(예정)시각", name: "to_time_v", width: 50, align: "center",
                //    editable: { type: "select", data: { memory: "시간" } }
                //},
                {
                    header: "사용자", name: "use_emp_nm", width: 60, align: "center",
                    editable: { type: "text" }, mask: "search"
                },
                { header: "사용부서", name: "use_dept_nm", width: 60, align: "center" },
                { header: "예약일시", name: "booking_dt", width: 130, align: "center" },
                { header: "접수자", name: "accept_emp_nm", width: 50, align: "center" },
                { header: "접수일시", name: "accept_dt", width: 130, align: "center" },
                {
                    header: "계측기상태", name: "pstat", width: 50, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "예약자 비고", name: "booking_rmk", width: 220,
                    editable: { type: "text" }
                },
                { header: "관리자 비고", name: "lend_rmk", width: 220 },
				{ name: "qmi_key", editable: { type: "hidden" }, hidden: true },
                { name: "qmi_seq", editable: { type: "hidden" }, hidden: true },
                { name: "fr_time", editable: { type: "hidden" }, hidden: true },
                { name: "to_time", editable: { type: "hidden" }, hidden: true },
                { name: "use_emp", editable: { type: "hidden" }, hidden: true },
                { name: "use_dept", editable: { type: "hidden" }, hidden: true },
                { name: "accept_emp", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_Main", offset: 8 },
				{ type: "GRID", id: "grdList_Sub", offset: 8 },
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "사용 현황" },
				{ type: "LAYER", id: "lyrTab_2", title: "사용 예약" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 }
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
        var args = { targetid: "lyrMenu_1_1", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2_1", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2_1", element: "상세", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2_1", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdList_Main", grid: true, event: "rowselecting", handler: processRowSelecting };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_Main", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_Main", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------

        gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA);
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    if (param.object == undefined) return false;
    if (param.element == undefined) return false;

    if (param.element == "닫기") {
        processClose({});
        return true;
    }

    if (param.object == "lyrMenu_1_1") {
        if (param.element == "조회") {
            viewOption({});
        } else if (param.element == "추가") {
            processInsert(param);
        } else if (param.element == "수정") {
            processEdit({});
        }
    } else if (param.object == "lyrMenu_2_1") {
        if (param.element == "조회") {
            processRetrieve({});
        } else if (param.element == "상세") {
            processQMIView(param);
        } else if (param.element == "저장") {
            processSave({});
        }
    } else if (param.object == "lyrMenu_2_2") {
        if (param.element == "추가") {
            processInsert(param);
        } else if (param.element == "삭제") {
            processDelete(param);
        }
    }

}
//----------
function processQMIView(param) {

    var qmi_key = gw_com_api.getValue("frmData_Main", 1, "qmi_key");
    if (qmi_key == "") return;
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
function processItemchanged(param) {

    if (param.object == "grdData_Sub") {
        if (param.element == "fr_time_v" || param.element == "to_time_v") {
            gw_com_api.setValue(param.object, param.row, param.element.substring(0, 7), param.value.current + "00", true);
        }
    }

}
//----------
function processItemdblclick(param) {


    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "use_emp_nm":  //사용자
            //v_global.event.type = param.type;
            //v_global.event.object = param.object;
            //v_global.event.row = param.row;
            //v_global.event.element = param.element;
            //var args = {
            //    type: "PAGE", page: "w_find_emp", title: "사원 검색",
            //    width: 600, height: 450, locate: ["center", "top"], open: true
            //};
            //if (gw_com_module.dialoguePrepare(args) == false) {
            //    var args = {
            //        page: "w_find_emp",
            //        param: {
            //            ID: gw_com_api.v_Stream.msg_openedDialogue
            //        }
            //    };
            //    gw_com_module.dialogueOpen(args);
            //}
            //break;

            //수정 by 고윤수(181218)
            if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectEmployee
            };
            //
            
            break;

    }



    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: args.data } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "frmOption" || param.master) {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "qmi_nm", argument: "arg_qmi_nm" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" }
                ],
                remark: [
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "qmi_nm" }] },
                    { element: [{ infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_Main", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_Sub" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else if (param.object == "grdList_Main" || param.sub) {
        args = {
            source: {
                type: "GRID", id: "grdList_Main", row: "selected",
                element: [
                    { name: "qmi_key", argument: "arg_qmi_key" }
                ],
                argument: [
                    { name: "arg_ymd_fr", value: gw_com_api.getValue("frmOption", 1, "ymd_fr") },
                    { name: "arg_ymd_to", value: gw_com_api.getValue("frmOption", 1, "ymd_to") },
                    { name: "arg_use_emp", value: "%" },
                    { name: "arg_pstat", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_Sub", select: true }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else {
        if (v_global.logic.qmi_key == undefined) return false;
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_qmi_key", value: v_global.logic.qmi_key },
                    { name: "arg_ymd_fr", value: gw_com_api.getValue("frmOption", 1, "ymd_fr") },
                    { name: "arg_ymd_to", value: gw_com_api.getValue("frmOption", 1, "ymd_to") },
                    { name: "arg_use_emp", value: gw_com_module.v_Session.EMP_NO },
                    { name: "arg_pstat", value: "%" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_Main" },
                { type: "GRID", id: "grdData_Sub", select: true }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (param == undefined) return false;
    
    if (param.insert) {
        processInsert({ object: "lyrMenu_2_2" });
    }

}
//----------
function processEdit(param) {

    if (gw_com_api.getSelectedRow("grdList_Main") > 0)
        gw_com_api.selectTab("lyrTab", 2);

    v_global.logic.qmi_key = gw_com_api.getValue("grdList_Main", "selected", "qmi_key", true);
    processRetrieve({});

}
//----------
function processInsert(param) {

    var qmi_key = gw_com_api.getValue("grdList_Main", "selected", "qmi_key", true);
    var pstat = gw_com_api.getValue("grdList_Main", "selected", "pstat", true);
    if (qmi_key == "") {
        gw_com_api.messageBox([{ text: "계측기를 선택 후 예약할 수 있습니다." }]);
        return;
    } else if (!(pstat == "보유" || pstat == "대여")) {
        gw_com_api.messageBox([{ text: "본 계측기는 사용예약을 할 수 없습니다." }]);
        return;
    }
    
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_qmi_key", value: qmi_key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main" }
        ],
        clear: [
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objRetrieve(args);
    gw_com_api.selectTab("lyrTab", 2);

    var args = {
        targetid: "grdData_Sub", edit: true, updatable: true,
        data: [
            { name: "qmi_key", value: qmi_key },
            { name: "fr_date", value: gw_com_api.getDate("", { day: 1 }) },
            { name: "fr_time", value: "0000" },
            { name: "fr_time_v", value: "00" },
            { name: "to_date", value: gw_com_api.getDate("", { day: 1 }) },
            { name: "to_time", value: "2359" },
            { name: "to_time_v", value: "23" },
            { name: "use_emp", value: gw_com_module.v_Session.EMP_NO },
            { name: "use_emp_nm", value: gw_com_module.v_Session.USR_NM },
            { name: "use_dept", value: gw_com_module.v_Session.DEPT_CD },
            { name: "use_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
            { name: "pstat", value: "예약" }
        ]
    };
    gw_com_module.gridInsert(args);


    //if (param.object == "lyrMenu_1_1") {
    //    var args = {
    //        type: "PAGE", page: "QMI_2001", title: "계측기 일람",
    //        width: 900, height: 370, scroll: true, open: true, control: true, locate: ["center", "top"]
    //    };

    //    if (gw_com_module.dialoguePrepare(args) == false) {
    //        args.param = {
    //            ID: gw_com_api.v_Stream.msg_openedDialogue,
    //            data: {
    //                qmi_no: gw_com_api.getValue("grdList_Main", "selected", "qmi_no", true),
    //                qmi_nm: gw_com_api.getValue("grdList_Main", "selected", "qmi_nm", true)
    //            }
    //        };
    //        gw_com_module.dialogueOpen(args);
    //    }
    //} else {
    //    if (param.key != undefined) {
    //        $.ajaxSetup({ async: false });
    //        var args = {
    //            source: {
    //                type: "INLINE",
    //                argument: [
    //                    { name: "arg_qmi_key", value: param.key }
    //                ]
    //            },
    //            target: [
    //                { type: "FORM", id: "frmData_Main" }
    //            ],
    //            clear: [
    //                { type: "GRID", id: "grdData_Sub" }
    //            ]
    //        };
    //        gw_com_module.objRetrieve(args);
    //        gw_com_api.selectTab("lyrTab", 2);
    //    }
    //    $.ajaxSetup({ async: true });

    //    var qmi_key = gw_com_api.getValue("frmData_Main", 1, "qmi_key");
    //    if (qmi_key == "") return;
    //    var args = {
    //        targetid: "grdData_Sub", edit: true, updatable: true,
    //        data: [
    //            { name: "qmi_key", value: qmi_key },
    //            { name: "fr_date", value: gw_com_api.getDate("", { day: 1 }) },
    //            { name: "fr_time", value: "0000" },
    //            { name: "fr_time_v", value: "00" },
    //            { name: "to_date", value: gw_com_api.getDate("", { day: 1 }) },
    //            { name: "to_time", value: "2359" },
    //            { name: "to_time_v", value: "23" },
    //            { name: "use_emp", value: gw_com_module.v_Session.EMP_NO },
    //            { name: "use_emp_nm", value: gw_com_module.v_Session.USR_NM },
    //            { name: "use_dept", value: gw_com_module.v_Session.DEPT_CD },
    //            { name: "use_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
    //            //{ name: "booking_dt", value: gw_com_api.getTime() },
    //            { name: "pstat", value: "예약" }
    //        ]
    //    };
    //    gw_com_module.gridInsert(args);
    //}

}
//----------
function processDelete(param) {

    var args = { targetid: "grdData_Sub", row: "selected", select: true };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    // 저장
    var args = {
        target: [
			{ type: "GRID", id: "grdData_Sub" }
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;

    // 날짜 체크
    if (gw_com_api.getValue("grdData_Sub", "selected", "fr_date", true) < gw_com_api.getDate() ||
        gw_com_api.getValue("grdData_Sub", "selected", "to_date", true) < gw_com_api.getDate()) {
        gw_com_api.messageBox([{ text: "예약일은 " + gw_com_api.Mask(gw_com_api.getDate(), "date-ymd") + " 이전으로 입력할 수 없습니다." }]);
        return;
    }
    if (gw_com_api.getValue("grdData_Sub", "selected", "fr_date", true) > gw_com_api.getValue("grdData_Sub", "selected", "to_date", true)) {
        gw_com_api.messageBox([{ text: "날짜가 잘못 입력되었습니다." }]);
        return;
    }

    //메일 발송용
    var ids = gw_com_api.getRowIDs("grdData_Sub");
    var saved = new Array();
    $.each(ids, function () {
        var status = gw_com_api.getCRUD("grdData_Sub", this, true);
        if (status == "create") {
            saved.push({
                qmi_nm: gw_com_api.getValue("frmData_Main", 1, "qmi_nm"),
                qmi_no: gw_com_api.getValue("frmData_Main", 1, "qmi_no"),
                fr_date: gw_com_api.getValue("grdData_Sub", this, "fr_date", true),
                to_date: gw_com_api.getValue("grdData_Sub", this, "to_date", true),
                use_emp_nm: gw_com_api.getValue("grdData_Sub", this, "use_emp_nm", true),
                use_dept_nm: gw_com_api.getValue("grdData_Sub", this, "use_dept_nm", true),
                rmk: gw_com_api.getValue("grdData_Sub", this, "booking_rmk", true)
            });
        }
    });

    //args.url = "COM";
    args.handler = { success: successSave };
    args.handler.param = saved;

    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    //var key = [{
    //    KEY: [{ NAME: "qmi_key", VALUE: v_global.logic.qmi_key }],
    //    QUERY: "QMI_2000_1"
    //}];
    //processRetrieve({ master: true, key: key });
    //processRetrieve({ key: response });

    processRetrieve({ sub: true, key: response });
    gw_com_api.selectTab("lyrTab", 1);
    processClear({});

    $.each(param, function () {
        var _subject = "계측기 사용 예약 등록 - " + this.qmi_nm + " [" + this.qmi_no + "]";
        var _body = "<p>계측기 사용 예약 정보가 등록되었습니다.</p>"
                    + "<table>"
                    + "<tr><td align=\"right\" width=\"80\">계측기 :</td><td><b>" + this.qmi_nm + " [" + this.qmi_no + "]" + "</b></td></tr>"
                    + "<tr><td align=\"right\">사용기간 :</td><td><b>" + gw_com_api.Mask(this.fr_date, "date-ymd") + " ~ " + gw_com_api.Mask(this.to_date, "date-ymd") + "</b></td></tr>"
                    + "<tr><td align=\"right\">사용자 :</td><td><b>" + this.use_emp_nm + "(" + this.use_dept_nm + ")" + "</b></td></tr>"
                    + "<tr><td align=\"right\">비고 :</td><td><b>" + this.rmk + "</b></td></tr>"
                    + "</table>"
                    + "<br><br><a href=\"http://gw.apsystems.co.kr\">PI 바로가기</a>";
        var args = {
            url: "COM",
            mailing: "QMI01",   //계측기 예약 알림 수신자
            subject: _subject,
            body: _body,
            html: true
        };
        gw_com_module.sendMail(args);
    });
}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
function processTabChange(param) {

    closeOption();

}
//----------
function processClear(param) {

    var args;
    if (param.all) {
        args = {
            target: [
                { type: "GRID", id: "grdList_Main" },
                { type: "GRID", id: "grdList_Sub" },
                { type: "FORM", id: "frmData_Main" },
                { type: "GRID", id: "grdData_Sub" }
            ]
        };
    } else {
        args = {
            target: [
                { type: "FORM", id: "frmData_Main" },
                { type: "GRID", id: "grdData_Sub" }
            ]
        };
    }
    gw_com_module.objClear(args);

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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "QMI_1002_VIEW":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                qmi_key: gw_com_api.getValue("frmData_Main", 1, "qmi_key")
                            };
                        }
                        break;
                    case "QMI_2001":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                qmi_no: gw_com_api.getValue("grdList_Main", "selected", "qmi_no", true),
                                qmi_nm: gw_com_api.getValue("grdList_Main", "selected", "qmi_nm", true)
                            };
                        }
                        break;
                    case "w_find_emp":
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "QMI_2001":
                        if (param.data != undefined) {
                            v_global.logic.qmi_key = param.data.qmi_key;
                            processInsert({ key: param.data.qmi_key });
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
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "use_dept_nm",
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "use_dept",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;

        //추가 by 고윤수(181218)
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
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
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        //
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//