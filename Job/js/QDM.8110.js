//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택", width: 700, height: 450 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "QDM_8111", title: "담당자 지정", width: 1150, height: 520 };
        gw_com_module.dialoguePrepare(args);

        // set data.
        var args = {
            request: [
                {
                    type: "INLINE", name: "유무상",
                    data: [
                        { title: "유상", value: "1" },
                        { title: "무상", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "YN",
                    data: [
                        { title: "Y", value: "1" },
                        { title: "N", value: "0" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process : Create UI & Event
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

            if (gw_com_module.v_Session.USER_TP != "SYS") {
                gw_com_api.setValue("frmOption", 1, "qc_emp", gw_com_module.v_Session.USR_NM);
                processRetrieve({});
            }
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제(취소)" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "기안일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
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
                                name: "app_user", label: { title: "기안자 : " },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "qc_emp", label: { title: "품질담당자 : " },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "pay_yn", label: { title: "유상/무상 : " },
                                editable: {
                                    type: "select", data: { memory: "유무상", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "del_yn", label: { title: "삭제여부 : " }, value: "0",
                                editable: {
                                    type: "select", data: { memory: "YN", unshift: [{ title: "전체", value: "%" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "px_no", label: { title: "구매의뢰번호 : " },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "as_no", label: { title: "A/S 번호 : " },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "QDM_8110_1", title: "",
            height: 442, show: true, selectable: true, number: true,
            editable: { master: true, multi: true, bind: "edit_yn", validate: true },
            color: { row: true },
            element: [
                {
                    header: "구매의뢰번호", name: "px_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                { header: "제목", name: "app_title", width: 300 },
                { header: "기안부서", name: "app_deptnm", width: 80 },
                { header: "기안일", name: "app_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "기안자", name: "app_user", width: 60, align: "center" },
                {
                    header: "A/S번호", name: "as_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                //{ header: "Line", name: "", width: 60 },
                //{ header: "Process", name: "", width: 60 },
                //{ header: "설비명", name: "", width: 60 },
                { header: "품번", name: "item_cd", width: 100 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "spec", width: 150 },
                { header: "공급사", name: "bp_nm", width: 100 },
                { header: "수량", name: "qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "Tracking No.", name: "tracking_no", width: 80 },
                { header: "용도", name: "rq_kind", width: 100 },
                {
                    header: "품질담당자", name: "qc_emp_nm", width: 80, //mask: "search",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "공급사 유상/무상 판정", name: "pay_yn", width: 100, align: "center",
                    format: { type: "select", data: { memory: "유무상", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "유무상", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "비고", name: "rmk", width: 150,
                    editable: { type: "text" }
                },
                { name: "pr_no", hidden: true, editable: { type: "hidden" } },
                { name: "qc_dept", hidden: true, editable: { type: "hidden" } },
                { name: "qc_emp", hidden: true, editable: { type: "hidden" } },
                { name: "del_yn", hidden: true, editable: { type: "hidden" } },
                { name: "crud", hidden: true },
                { name: "color", hidden: true },
                { name: "edit_yn", hidden: true },
                { name: "old_qc_emp", hidden: true, editable: { type: "hidden" } }  // 담당자 지정(변경) 체크용
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdData_Main", grid: true, event: "itemdblclick", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, element: "px_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, element: "as_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "조회":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "추가":
                    {
                        var args = {
                            page: "QDM_8111",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openDialogue
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "삭제":
                    {
                        if (!checkUpdatable({ check: true })) return false;
                        processDelete({});
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
                case "실행":
                    {
                        processRetrieve({});
                    }
                    break;
                case "취소":
                    {
                        gw_com_api.hide("frmOption");
                    }
                    break;
                case "px_no":
                    {
                        //var url = "http://gw.ips.co.kr/WA/eapp/eapp_veiw_temp/content.asp?doc_id=" + gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID"));
                        var url = "http://10.10.10.9/ko293_Default/groupWare/eapp_veiw_temp/content.asp?doc_id=" + gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID"));
                        window.open(url, "_blank");
                    }
                    break;
                case "as_no":
                case "ncr_no":
                    {
                        var key = gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID"));

                        var args = {};
                        switch (key.substring(0, 3)) {
                            case "ECR":
                                {
                                    args.to = "INFO_ECCB";
                                    args.ecr_no = key;
                                }
                                break;
                            case "ECO":
                                {
                                    args.to = "INFO_ECCB";
                                    args.ecp_no = key;
                                }
                                break;
                            case "CIP":
                                {
                                    args.to = "INFO_ECCB";
                                    args.cip_no = key;
                                }
                                break;
                            case "NCR":
                                {
                                    args.to = "NCR";
                                    args.rqst_no = key;
                                }
                                break;
                            default:
                                {
                                    args.to = "INFO_ISSUE";
                                    args.issue_no = key;
                                }
                                break;
                        }
                        gw_com_site.linkPage(args);
                    }
                    break;
            }
        }
        //----------
        function processItemdblclick(param) {

            switch (param.element) {
                case "qc_emp_nm":
                    {
                        v_global.event.object = param.object;
                        v_global.event.row = param.row;
                        v_global.event.element = param.element;
                        v_global.event.type = param.type;
                        v_global.event.user_nm = param.element;
                        v_global.event.user_id = "qc_emp";
                        v_global.event.dept_cd = "qc_dept";
                        var args = {
                            page: "DLG_EMPLOYEE",
                            param: {
                                ID: gw_com_api.v_Stream.msg_selectEmployee,
                                data: {
                                    emp_nm: param.value.current
                                }
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            if (param.element == "qc_emp_nm") {
                if (param.value.current == "") {
                    gw_com_api.setValue(param.object, param.row, "qc_emp", "", (param.type == "GRID"));
                    gw_com_api.setValue(param.object, param.row, "qc_dept", "", (param.type == "GRID"));
                } else {
                    v_global.event = param;
                    v_global.event.user_nm = param.element;
                    v_global.event.user_id = "qc_emp";
                    v_global.event.dept_cd = "qc_dept";
                    setEmpInfo({ emp_nm: param.value.current });
                }
            }
        }
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption" ,// hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "px_no", argument: "arg_px_no" },
                { name: "app_user", argument: "arg_app_user" },
                { name: "as_no", argument: "arg_as_no" },
                { name: "qc_emp", argument: "arg_qc_emp" },
                { name: "pay_yn", argument: "arg_pay_yn" },
                { name: "del_yn", argument: "arg_del_yn" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "app_user" }] },
                { element: [{ name: "qc_emp" }] },
                { element: [{ name: "pay_yn" }] },
                { element: [{ name: "del_yn" }] },
                { element: [{ name: "px_no" }] },
                { element: [{ name: "app_user" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", select: true, focus: true }  //
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_Main" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSave(param) {

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

    // 메일발송대상자
    var args = { target: [{ type: "GRID", id: "grdData_Main" }] };
    var data = gw_com_module.updatabletoARG(args);
    var rows = JSON.parse(data).DATA.OBJECTS[0].ROWS;
    var pr_no = "";
    $.each(rows, function () {
        var col0 = $.inArray("pr_no", this.COLUMN);
        var col1 = $.inArray("qc_emp", this.COLUMN);
        var col2 = $.inArray("old_qc_emp", this.COLUMN);
        if (this.VALUE[col1] != this.VALUE[col2])
            pr_no += (pr_no == "" ? "" : ",") + this.VALUE[col0];
    });
    if (pr_no != "")
        processSendmail({ pr_no: pr_no });

    processRetrieve({ key: response });

}
//----------
function processDelete(param) {

    var row = gw_com_api.getSelectedRow("grdData_Main");
    if (row == null) {
        gw_com_api.messageBox([
            { text: "삭제(취소) 할 데이터가 선택되지 않았습니다." }
        ]);
        return;
    }
    var del_yn = gw_com_api.getValue("grdData_Main", row, "del_yn", true);
    del_yn = (del_yn == "1" ? "0" : "1");

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: $("#grdData_Main_data").attr("query"),
                row: [{
                    crud: "U",
                    column: [
                        { name: "pr_no", value: gw_com_api.getValue("grdData_Main", row, "pr_no", true) },
                        { name: "del_yn", value: del_yn }
                    ]
                }]
            }
        ],
        handler: { success: processRetrieve, param: {} }
    };
    gw_com_module.objSave(args);

    //gw_com_api.setValue("grdData_Main", row, "del_yn", del_yn, true);
    //gw_com_api.setCRUD("grdData_Main", row, "modify", true);
    //var args = { targetid: "grdData_Main", row: "selected", remove: true }
    //gw_com_module.gridDelete(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

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
function setEmpInfo(param) {

    var args = {
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=w_find_emp_M_1" +
            "&QRY_COLS=emp_no,emp_nm,dept_cd,dept_nm,user_id" +
            "&CRUD=R" +
            "&arg_emp_nm=" + encodeURIComponent(param.emp_nm) + "&arg_dept_nm=",
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        if (data.length == 1) {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_nm, data[0].DATA[1], (v_global.event.type == "GRID"), false, false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_id, data[0].DATA[4], (v_global.event.type == "GRID"));
            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, data[0].DATA[2], (v_global.event.type == "GRID"));
        } else {
            //v_global.event = param;
            var args = {
                page: "DLG_EMPLOYEE",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectEmployee,
                    data: {
                        emp_nm: param.emp_nm
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_nm, "", (v_global.event.type == "GRID"), false, false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_id, "", (v_global.event.type == "GRID"));
            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, "", (v_global.event.type == "GRID"));
        }

    }

}
//----------
function processSendmail(param) {

    var args = {
        url: "COM",
        nomessage: true,
        tran: true,
        procedure: "sp_QDM_sendMail_8110",
        input: [
            { name: "pr_no", value: param.pr_no, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "varchar" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successSendmail,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successSendmail(response, param) {


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
                    case gw_com_api.v_Message.msg_confirmBatch:
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
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else if (param.data.arg.response != undefined)
                                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else if (param.data.arg.response != undefined)
                                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
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
                    case "QDM_8111":
                        {
                            if (param.data != undefined) {
                                processRetrieve({});
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "QDM_8111":
                        {
                            args.ID = param.ID;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                closeDialogue({ page: param.from.page, focus: false });
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_id, param.data.user_id, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, param.data.dept_cd, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_nm, param.data.user_nm, (v_global.event.type == "GRID"), false, false);
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//