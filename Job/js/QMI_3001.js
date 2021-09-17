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
				    type: "PAGE", name: "계측기상태", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "QMI41" }]
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

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

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
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        //var args = {
        //    targetid: "frmData_Sub", query: "QMI_3000_1", type: "TABLE", title: "대여/반납 정보",
        //    caption: true, show: true, selectable: true,
        //    editable: { bind: "select", focus: "lend_emp_nm", validate: true },
        //    content: {
        //        width: { label: 90, field: 150 }, height: 25,
        //        row: [
        //            {
        //                element: [
        //                    { header: true, value: "사용자", format: { type: "label" } },
        //                    {
        //                        name: "use_dept_nm", align: "center", style: { colfloat: "float" },
        //                        editable: { type: "hidden" }, display: true,
        //                    },
        //                    {
        //                        name: "use_emp_nm", align: "center", style: { colfloat: "floated" },
        //                        editable: { type: "hidden" }, display: true,
        //                    },
        //                    { header: true, value: "사용(예정)일자", format: { type: "label" } },
        //                    { name: "fr_date", mask: "date-ymd", editable: { type: "text" } },
        //                    { header: true, value: "반납(예정)일자", format: { type: "label" } },
        //                    { name: "to_date", mask: "date-ymd", editable: { type: "text" } }
        //                    //{ header: true, value: "사용(예정)일시", format: { type: "label" } },
        //                    //{ name: "fr_dt", editable: { type: "hidden" }, display: true },
        //                    //{ header: true, value: "반납(예정)일시", format: { type: "label" } },
        //                    //{ name: "to_dt", editable: { type: "hidden" }, display: true }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "접수/반려자", format: { type: "label" } },
        //                    { name: "accept_emp_nm", editable: { type: "text" }, mask: "search", display: true, },
        //                    { name: "accept_emp", editable: { type: "hidden" }, hidden: true, display: true },
        //                    { header: true, value: "대여자", format: { type: "label" } },
        //                    { name: "lend_emp_nm", editable: { type: "text" }, mask: "search", display: true, },
        //                    { name: "lend_emp", editable: { type: "hidden" }, hidden: true, display: true },
        //                    { header: true, value: "반납자", format: { type: "label" } },
        //                    { name: "return_emp_nm", editable: { type: "text" }, mask: "search", display: true, },
        //                    { name: "return_emp", editable: { type: "hidden" }, hidden: true, display: true }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "접수/반려일시", format: { type: "label" } },
        //                    { name: "accept_dt", editable: { type: "hidden" }, display: true },
        //                    { header: true, value: "대여일시", format: { type: "label" } },
        //                    { name: "lend_dt", editable: { type: "hidden" }, display: true },
        //                    { header: true, value: "반납일시", format: { type: "label" } },
        //                    { name: "return_dt", editable: { type: "hidden" }, display: true }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "예약자 비고", format: { type: "label" } },
        //                    { name: "booking_rmk", editable: { type: "hidden", width: 870 }, style: { colspan: 5 } }
        //                ]
        //            },
        //            {
        //                element: [
        //                    { header: true, value: "관리자 비고", format: { type: "label" } },
        //                    { name: "lend_rmk", editable: { type: "text", width: 870 }, style: { colspan: 5 } },
        //                    { name: "pstat", editable: { type: "hidden" }, hidden: true },
        //                    { name: "qmi_key", editable: { type: "hidden" }, hidden: true },
        //                    { name: "qmi_seq", editable: { type: "hidden" }, hidden: true }
        //                ]
        //            }
        //        ]
        //    }
        //};
        var args = {
            targetid: "frmData_Sub", query: "QMI_3001_1", type: "TABLE", title: "대여/반납 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "lend_emp_nm", validate: true },
            content: {
                width: { label: 50, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "사용자", format: { type: "label" } },
                            {
                                name: "use_dept_nm", align: "center", style: { colfloat: "float" },
                                editable: { type: "hidden", width: 150 }, display: true,
                            },
                            {
                                name: "use_emp_nm", align: "center", style: { colfloat: "floated" },
                                editable: { type: "hidden" }, display: true,
                            },
                            { header: true, value: "사용기간", format: { type: "label" } },
                            { name: "fr_date", mask: "date-ymd", editable: { type: "text", width: 90 }, style: { colfloat: "float" } },
                            { name: "to_date", mask: "date-ymd", editable: { type: "text", width: 90 }, style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리자", format: { type: "label" } },
                            { name: "prc_emp_nm", editable: { type: "text", validate: { rule: "required" } }, mask: "search", display: true, },
                            { name: "accept_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "lend_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "return_emp", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "처리일시", format: { type: "label" } },
                            { name: "prc_dt", editable: { type: "hidden", width: 150 }, display: true },
                            { name: "accept_dt", editable: { type: "hidden" }, hidden: true },
                            { name: "lend_dt", editable: { type: "hidden" }, hidden: true },
                            { name: "return_dt", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "예약자 비고", format: { type: "label" } },
                            { name: "booking_rmk", editable: { type: "hidden", width: 870 }, style: { colspan: 3 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "관리자 비고", format: { type: "label" } },
                            { name: "lend_rmk", editable: { type: "text", width: 870 }, style: { colspan: 3 } },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "qmi_key", editable: { type: "hidden" }, hidden: true },
                            { name: "qmi_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "use_emp_email", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "QMI_1002_1", type: "TABLE", title: "계측기 정보",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 90, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "qmi_no", align: "center" },
                            { header: true, value: "기기명", format: { type: "label" } },
                            { name: "qmi_nm" },
                            { header: true, value: "형식", format: { type: "label" } },
                            { name: "spec" },
                            { header: true, value: "상태구분", format: { type: "label" } },
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
                            { header: true, value: "Ser. No.", format: { type: "label" } },
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
                            { header: true, value: "교정주기(월)", format: { type: "label" } },
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
                            { style: { colspan: 3 }, name: "mng_rmk" },
                            { name: "calibrate_over", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CHK", query: "QMI_3001_9", show: false,
            element: [
                { name: "cnt", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "FORM", id: "frmData_Sub", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_Sub", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_Sub", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_Sub", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
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
function processButton(param) {

    if (param.object == "lyrMenu") {
        switch (param.element) {
            case "저장":
                if(v_global.logic.pstat == "대여")
                    processRetrieve({ chk: true });
                else
                    processSave({});
                break;
            case "닫기":
                processClose();
                break;
        }
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_Sub") {
        switch (param.element) {
            case "accept_emp_nm":
            case "lend_emp_nm":
            case "return_emp_nm":
                if (param.value.current == "") {
                    gw_com_api.setValue(param.object, param.row, param.element.substr(0, param.element.length - 3), "", false, true);
                }
                break;
        }
    }

}
//----------
function processItemdblclick(param) {

    switch (param.element) {
        case "prc_emp_nm":
            v_global.event.type = param.type;
            v_global.event.object = param.object;
            v_global.event.row = param.row;
            v_global.event.element = param.element;
            var args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 350, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_emp",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            emp_nm: gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID" ? true : false)),
                            height: 200
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

            break;
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.chk) {
        // 필수입력 체크
        args = { target: [{ type: "FORM", id: "frmData_Sub" }] };
        if (gw_com_module.objValidate(args) == false) return false;
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_qmi_key", value: v_global.logic.qmi_key },
                    { name: "arg_qmi_seq", value: v_global.logic.qmi_seq },
                    { name: "arg_fr_date", value: gw_com_api.getValue("frmData_Sub", 1, "fr_date") },
                    { name: "arg_to_date", value: gw_com_api.getValue("frmData_Sub", 1, "to_date") }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_CHK" }
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_qmi_key", value: v_global.logic.qmi_key },
                    { name: "arg_qmi_seq", value: v_global.logic.qmi_seq },
                    { name: "arg_stat", value: v_global.logic.pstat }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_Main", clear: true },
                { type: "FORM", id: "frmData_Sub", edit: true }
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (param.chk) {
        if (gw_com_api.getValue("grdList_CHK", 1, "cnt", true) > 0) {
            gw_com_api.messageBox([{ text: "대여기간이 중복되었습니다." }]);
            return;
        }
        processSave({});
    } else {
        var dt = gw_com_api.getTime();
        dt = gw_com_api.Mask(dt.substr(0, 8), "date-ymd") + " " + gw_com_api.Mask(dt.substr(8, 4), "time-hm");
        if (gw_com_api.getValue("frmData_Sub", 1, "pstat") != v_global.logic.pstat) {
            gw_com_api.setValue("frmData_Sub", 1, "pstat", v_global.logic.pstat, false, true);
            gw_com_api.setCRUD("frmData_Sub", 1, "modify");
        }
        if (gw_com_api.getValue("frmData_Sub", 1, "prc_emp_nm") == "") {
            gw_com_api.setValue("frmData_Sub", 1, "prc_emp_nm", gw_com_module.v_Session.USR_NM, false, true);
            gw_com_api.setValue("frmData_Sub", 1, getFld(v_global.logic.pstat, "emp"), gw_com_module.v_Session.EMP_NO, false, true);
            gw_com_api.setValue("frmData_Sub", 1, getFld(v_global.logic.pstat, "dt"), dt, false, true);
        }
    }

}
//----------
function processSave(param) {

    // 저장
    var args = {
        target: [
			{ type: "FORM", id: "frmData_Sub" }
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;

    // 중복 대여 방지
    if (v_global.logic.pstat == "대여") {

    }

    // 처리시간
    switch (v_global.logic.pstat) {
        case "접수":
        case "반려":
            $("#frmData_Sub_accept_dt").removeAttr("display");
            $("#frmData_Sub_lend_dt").attr("display", true);
            $("#frmData_Sub_return_dt").attr("display", true);
            break;
        case "대여":
            $("#frmData_Sub_accept_dt").attr("display", true);
            $("#frmData_Sub_lend_dt").removeAttr("display");
            $("#frmData_Sub_return_dt").attr("display", true);
            break;
        case "반납":
            $("#frmData_Sub_accept_dt").attr("display", true);
            $("#frmData_Sub_lend_dt").attr("display", true);
            $("#frmData_Sub_return_dt").removeAttr("display");
            break;
    }
    args.url = "COM";
    args.handler = { success: successSave };
    args.handler.param = param;

    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    // Feedback
    if ($.inArray(v_global.logic.pstat, ["대여", "반려"]) != -1 && gw_com_api.getValue("frmData_Sub", 1, "use_emp_email") != "") {
        var qmi_no = gw_com_api.getValue("frmData_Main", 1, "qmi_no", false, true);
        var qmi_nm = gw_com_api.getValue("frmData_Main", 1, "qmi_nm", false, true);
        var fr_date = gw_com_api.Mask(gw_com_api.getValue("frmData_Sub", 1, "fr_date"), "date-ymd");
        var to_date = gw_com_api.Mask(gw_com_api.getValue("frmData_Sub", 1, "to_date"), "date-ymd");
        var use_emp_email = gw_com_api.getValue("frmData_Sub", 1, "use_emp_email");
        var use_emp_nm = gw_com_api.getValue("frmData_Sub", 1, "use_emp_nm");
        var use_dept_nm = gw_com_api.getValue("frmData_Sub", 1, "use_dept_nm");
        var prc_emp_nm = gw_com_api.getValue("frmData_Sub", 1, "prc_emp_nm");
        var lend_rmk = gw_com_api.getValue("frmData_Sub", 1, "lend_rmk");
        var _subject = "계측기 사용 예약 " + v_global.logic.pstat + " - " + qmi_nm + " [" + qmi_no + "]";
        var _body = "<p>계측기 사용 예약이 <font style=\"color:red;font-weight:bold;\">" +  v_global.logic.pstat + "</font> 처리 되었습니다.</p>"
                    + "<table>"
                    + "<tr><td align=\"right\" width=\"80\">계측기 :</td><td><b>" + qmi_nm + " [" + qmi_no + "]" + "</b></td></tr>"
                    + "<tr><td align=\"right\">사용기간 :</td><td><b>" + fr_date + " ~ " + to_date + "</b></td></tr>"
                    + "<tr><td align=\"right\">사용자 :</td><td><b>" + use_emp_nm + "(" + use_dept_nm + ")" + "</b></td></tr>"
                    + "<tr><td align=\"right\">처리자 :</td><td><b>" + prc_emp_nm + "</b></td></tr>"
                    + "<tr><td align=\"right\">비고 :</td><td><b>" + lend_rmk + "</b></td></tr>"
                    + "</table>"
                    + "<br><br><a href=\"" + location.protocol + "//" + location.host + "\">PI 바로가기</a>";
        var args = {
            url: "COM",
            to: [{ name: use_emp_nm, value: use_emp_email }],
            subject: _subject,
            body: _body,
            html: true,
            edit: true
        };
        gw_com_module.sendMail(args);
    }

    var args = { data: { saved: true, key: response } };
    processClose(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
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
function getFld(stat, type) {

    var rtn = "";
    switch(stat)
    {
        case "접수":
        case "반려":
            if (type == "emp") {
                rtn = "accept_emp";
            } else if (type == "dt") {
                rtn = "accept_dt";
            }
            break;
        case "대여":
            if (type == "emp") {
                rtn = "lend_emp";
            } else if (type == "dt") {
                rtn = "lend_dt";
            }
            break;
        case "반납":
            if (type == "emp") {
                rtn = "return_emp";
            } else if (type == "dt") {
                rtn = "return_dt";
            }
            break;
    }
    return rtn;

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "QMI_3000":
                        v_global.logic.qmi_key = param.data.qmi_key;
                        v_global.logic.qmi_seq = param.data.qmi_seq;
                        v_global.logic.pstat = param.data.pstat;
                        processRetrieve({});
                        break;
                    case "w_find_emp":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            emp_nm: gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID" ? true : false)),
                            height: 200
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
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
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false, true);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                getFld(v_global.logic.pstat, "emp"),
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false, true);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;

    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//