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
                { type: "PAGE", name: "부서", query: "dddw_dept" },
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
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));

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
				{ name: "조회", value: "조회", act: true },
                { name: "상세", value: "계측기상세", icon: "실행" },
                { name: "접수", value: "접수", icon: "Dialogue" },
                { name: "반려", value: "반려", icon: "Dialogue" },
                { name: "대여", value: "대여", icon: "Dialogue" },
                { name: "반납", value: "반납", icon: "Dialogue" },
                { name: "독촉", value: "반납독촉", icon: "Dialogue" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, //margin: 220,
            editable: { focus: "dept_area", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "사용일자 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 } }//,
                            //{
                            //    name: "dept_area", label: { title: "장비군 :" },
                            //    editable: { type: "select", data: { memory: "DEPT_AREA_FIND", unshift: [{ title: "전체", value: "%" }] } }
                            //}
                        ]
                    },
                    {
                        element: [
                            {
                                name: "use_dept_nm", label: { title: "사용부서 :" },
                                editable: { type: "text", size: 10, maxlength: 15 }, mask: "search"
                            },
                            {
                                name: "use_emp_nm", label: { title: "사용자 :" },
                                editable: { type: "text", size: 7, maxlength: 10 }, mask: "search"
                            },
                            { name: "use_dept", hidden: true },
                            { name: "use_emp", hidden: true }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pstat", label: { title: "예약상태 :" },
                                editable: { type: "select", data: { memory: "계측기상태", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            { name: "qmi_no", label: { title: "계측기번호 :" }, editable: { type: "text", size: 10, maxlength: 20 } }
                        ]
                    },
                    {
                        element: [
                            { name: "qmi_nm", label: { title: "기기명 :" }, editable: { type: "text", size: 20, maxlength: 50 } }
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
            targetid: "grdList_Main", query: "QMI_3000_1", title: "예약 및 대여 현황",
            caption: true, height: 420, show: true, selectable: true, number: true, color: { row: true },
            element: [
                { header: "관리번호", name: "qmi_no", width: 100, align: "center" },
                { header: "기기명", name: "qmi_nm", width: 150 },
                { header: "사용기간(Fr)", name: "fr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "사용기간(To)", name: "to_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "미반납", name: "return_flg", width: 50, align: "center", format: { type: "checkbox", value: "1", offval: "0:" } },
                { header: "사용부서", name: "use_dept_nm", width: 60, align: "center" },
                { header: "사용자", name: "use_emp_nm", width: 50, align: "center" },
                { header: "예약일시", name: "booking_dt", width: 150, align: "center" },
                { header: "계측기상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "접수일시", name: "accept_dt", width: 150, align: "center" },
                { header: "대여일시", name: "lend_dt", width: 150, align: "center" },
                { header: "반납일시", name: "return_dt", width: 150, align: "center" },
                { header: "예약자 비고", name: "booking_rmk", width: 200 },
                { header: "관리자 비고", name: "lend_rmk", width: 200 },
				{ name: "qmi_key", hidden: true },
                { name: "qmi_seq", hidden: true },
                { name: "color", hidden: true },
                { name: "pstat", hidden: true },
                { name: "use_emp_email", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_Main", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "접수", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "반려", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "대여", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "반납", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "독촉", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
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

    if (param.object == undefined) return false;
    if (param.element == undefined) return false;

    if (param.element == "닫기") {
        processClose();
        return true;
    }

    if (param.object == "lyrMenu") {
        switch(param.element){
            case "조회":
                viewOption();
                break;
            case "상세":
                processQMIView(param);
                break;
            case "접수":
            case "반려":
                closeOption();
                if (gw_com_api.getSelectedRow("grdList_Main") < 1) return false;
                //if ($.inArray(gw_com_api.getValue("grdList_Main", "selected", "pstat", true), ["예약", "접수", "반려"]) == -1) {
                //    gw_com_api.messageBox([{ text: param.element + " 처리할 수 없습니다." },
                //        { text: "상태 : " + gw_com_api.getValue("grdList_Main", "selected", "pstat", true) }]);
                //    return;
                //}
                var args = {
                    object: "grdList_Main",
                    type: "GRID",
                    element: param.element,
                    row: gw_com_api.getSelectedRow("grdList_Main")
                };
                processPopup(args);
                break;
            case "대여":
                closeOption();
                if (gw_com_api.getSelectedRow("grdList_Main") < 1) return false;
                //if (gw_com_api.getValue("grdList_Main", "selected", "pstat", true) != "접수") {
                //    gw_com_api.messageBox([{ text: param.element + " 처리할 수 없습니다." },
                //        { text: "상태 : " + gw_com_api.getValue("grdList_Main", "selected", "pstat", true) }]);
                //    return;
                //}
                var args = {
                    object: "grdList_Main",
                    type: "GRID",
                    element: param.element,
                    row: gw_com_api.getSelectedRow("grdList_Main")
                };
                processPopup(args);
                break;
            case "반납":
                closeOption();
                if (gw_com_api.getSelectedRow("grdList_Main") < 1) return false;
                //if (gw_com_api.getValue("grdList_Main", "selected", "pstat", true) != "대여") {
                //    gw_com_api.messageBox([{ text: param.element + " 처리할 수 없습니다." },
                //        { text: "상태 : " + gw_com_api.getValue("grdList_Main", "selected", "pstat", true) }]);
                //    return;
                //}
                var args = {
                    object: "grdList_Main",
                    type: "GRID",
                    element: param.element,
                    row: gw_com_api.getSelectedRow("grdList_Main")
                };
                processPopup(args);
                break;
            case "독촉":
                closeOption();
                if (gw_com_api.getSelectedRow("grdList_Main") < 1) return false;
                processSendMail();
                break;
        }
    }

}
//----------
function processItemdblclick(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "use_emp_nm":  //사용자
            case "use_dept_nm":  //사용부서
                processPopup(param);
                break;
            default:
                processRetrieve();
                break;
        }
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "use_dept_nm" || param.element == "use_emp_nm") {
            if (param.value.current == "") {
                gw_com_api.setValue(param.object, param.row, param.element.substr(0, param.element.length - 3), "");
            }
        }
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "use_dept", argument: "arg_use_dept" },
                { name: "use_emp", argument: "arg_use_emp" },
                { name: "pstat", argument: "arg_pstat" },
                { name: "qmi_no", argument: "arg_qmi_no" },
                { name: "qmi_nm", argument: "arg_qmi_nm" }
            ],
            argument: [
                { name: "arg_qmi_key", value: 0 },
                { name: "arg_qmi_seq", value: 0 }
            ],
            remark: [
                { element: [{ infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] }] }//,
                //{ element: [{ name: "dept_area" }] },
                //{ element: [{ name: "use_dept_nm" }] },
                //{ element: [{ name: "use_emp_nm" }] },
                //{ element: [{ name: "pstat" }] },
                //{ element: [{ name: "qmi_no" }] },
                //{ element: [{ name: "qmi_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_Main", select: true }
        ],
        handler: { complete: processRetrieveEnd, param: param }
    };

    if (param != undefined && param.key != undefined) {
        args.key = param.key;
    }

    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
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
function processPopup(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    switch (param.element) {
        case "use_emp_nm":  //사용자
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectEmployee,
                data: {
                    dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "use_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                    emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
        case "use_dept_nm":  //사용부서
            args = {
                type: "PAGE", page: "w_find_dept", title: "부서 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectDepartment,
                data: {
                    dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
        case "접수":
        case "반려":
        case "대여":
        case "반납":
            v_global.logic.pstat = param.element;
            args = {
                type: "PAGE", page: "QMI_3001", title: "상태 변경",
                width: 1050, height: 380, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    qmi_key: gw_com_api.getValue("grdList_Main", "selected", "qmi_key", true),
                    qmi_seq: gw_com_api.getValue("grdList_Main", "selected", "qmi_seq", true),
                    pstat: v_global.logic.pstat
                }
            };
            break;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: args.data } };
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function processQMIView(param) {

    var qmi_key = gw_com_api.getValue("grdList_Main", "selected", "qmi_key", true);
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
function processSendMail(param) {

    if (gw_com_api.getSelectedRow("grdList_Main", false) == null) return;
    var emp_name = gw_com_api.getValue("grdList_Main", "selected", "use_emp_nm", true);
    var emp_email = gw_com_api.getValue("grdList_Main", "selected", "use_emp_email", true);
    if (emp_email == "") {
        gw_com_api.messageBox([{text: "사용자 E-Mail 정보가 없습니다."}]);
        return;
    }

    var args = {
        url: "COM",
        to: [{ name: emp_name, value: emp_email }],
        subject: "계측기 반납 요청",
        body: "<b>" + gw_com_api.getValue("grdList_Main", "selected", "qmi_nm", true) +
            " [" + gw_com_api.getValue("grdList_Main", "selected", "qmi_no", true) + "]</b> 계측기의 대여 기간(" +
            gw_com_api.Mask(gw_com_api.getValue("grdList_Main", "selected", "fr_date", true), "date-ymd") + " ~ " +
            gw_com_api.Mask(gw_com_api.getValue("grdList_Main", "selected", "to_date", true), "date-ymd") +
            ")이 초과하였습니다.<br>계측기를 속히 반납해 주시기 바랍니다.",
        html: true,
        edit: true
    };

    //================================== TEST =================================
    gw_com_module.sendMail(args);

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
                                qmi_key: gw_com_api.getValue("grdList_Main", "selected", "qmi_key", true)
                            };
                        }
                        break;
                    case "QMI_3001":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                qmi_key: gw_com_api.getValue("grdList_Main", "selected", "qmi_key", true),
                                qmi_seq: gw_com_api.getValue("grdList_Main", "selected", "qmi_seq", true),
                                pstat: v_global.logic.pstat
                            };
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEmployee;
                            args.data = {
                                dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "use_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                                emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                            }

                        }
                        break;
                    case "w_find_dept":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectDepartment;
                            args.data = {
                                dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                            }
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "QMI_3001":
                        if (param.data != undefined && param.data.saved) {
                            processRetrieve({ key: param.data.key });
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
                                                v_global.event.element.split("_")[0] + "_dept_nm",
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.split("_")[0] + "_dept",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                    case "w_find_dept":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.substr(0, v_global.event.element.length - 3),
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//