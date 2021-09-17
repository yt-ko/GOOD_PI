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

        // set data.
        start();

        // Start Process : Create UI & Event
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

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
                            },
                            {
                                name: "app_user", label: { title: "기안자 : " },
                                editable: { type: "text", size: 10 }
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
            targetid: "frmData_Main", query: "", type: "TABLE", title: "담당자",
            show: true, selectable: true,
            editable: { bind: "open", focus: "qc_emp_nm", validate: true },
            content: {
                width: { label: 100, field: 100 },
                height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "담당자", format: { type: "label" } },
                            {
                                name: "qc_emp_nm",
                                editable: { type: "text", validate: { rule: "required", message: "담당자" } }
                            },
                            { name: "qc_emp", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "QDM_8111_1", title: "",
            height: 350, show: true, selectable: true, number: true, checkrow: true, multi: true,
            element: [
                {
                    header: "구매의뢰번호", name: "px_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                { header: "제목", name: "app_title", width: 300 },
                { header: "기안부서", name: "app_deptnm", width: 80 },
                { header: "기안일", name: "app_dt", width: 80, align: "center" },
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
                { name: "pr_no", hidden: true }
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
        var args = { targetid: "frmData_Main", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
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
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "px_no", argument: "arg_px_no" },
                { name: "app_user", argument: "arg_app_user" },
                { name: "as_no", argument: "arg_as_no" }
            ]//,
            //remark: [
            //    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
            //    { element: [{ name: "app_user" }] },
            //    { element: [{ name: "px_no" }] },
            //    { element: [{ name: "app_user" }] }
            //]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = { target: [{ type: "FORM", id: "frmData_Main" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var ids = gw_com_api.getSelectedRow("grdData_Main", true);
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }
    var pr_no = "";
    $.each(ids, function () {
        pr_no += (pr_no == "" ? "" : ",") + gw_com_api.getValue("grdData_Main", this, "pr_no", true);
    });
    var args = {
        url: "COM",
        nomessage: true,
        tran: true,
        procedure: "GoodPLM_IF_IPS.dbo.SP_IF_R_ERP_QDM_EXT_INF",
        input: [
            { name: "pr_no", value: pr_no, type: "varchar" },
            { name: "qc_emp", value: gw_com_api.getValue("frmData_Main", 1, "qc_emp"), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "varchar" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successSave(response, param) {

    if (response.VALUE[0] > 0) {
        var missing = undefined;
        var p = {
            handler: processClose,
            param: {
                data: param
            }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, (response.VALUE[0] == 0 ? 420 : 600));
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Main" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param.data != undefined)
        args.data = param.data;
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
            //gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, data[0].DATA[2], (v_global.event.type == "GRID"));
        } else {
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
            //gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, "", (v_global.event.type == "GRID"));
        }

    }

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openDialogue:
            {
                var args = {
                    targetid: "frmData_Main", edit: true, updatable: true
                };
                gw_com_module.formInsert(args);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_EMPLOYEE":
                        {
                            args.ID = param.ID;
                        }
                        break;
                    default:
                        {
                            v_global.data = param.data;
                            return;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
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
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                closeDialogue({ page: param.from.page, focus: true });
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_id, param.data.user_id, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_nm, param.data.user_nm, (v_global.event.type == "GRID"), false, false);
                //gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, param.data.dept_cd, (v_global.event.type == "GRID"));
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//