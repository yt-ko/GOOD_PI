//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
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
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //----------
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
            //----------
            processRetrieve({});
            //----------

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
                { name: "확인", value: "확인", icon: "예" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "조회", value: "새로고침" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA"/*, unshift: [{ title: "전체", value: "%" }]*/ } }
                            },
                            {
                                name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
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
                                name: "eca_no", label: { title: "ECA No. :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "eco_no", label: { title: "ECO No. :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "ecr_title", label: { title: "개선제안명 :" },
                                editable: { type: "text", size: 27 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "eco_title", label: { title: "ECO 제목 :" },
                                editable: { type: "text", size: 27 }
                            }
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
            targetid: "grdList_ECO", query: "EHM_3111_1", title: "ECO",
            height: 114, show: true, caption: false, pager: false, selectable: true, number: true,
            element: [
                { header: "ECA No.", name: "eca_no", width: 90, align: "center" },
                { header: "ECO No.", name: "eco_no", width: 90, align: "center" },
                { header: "개선제안명", name: "ecr_title", width: 300 },
                { header: "제목", name: "eco_title", width: 300 },
                { header: "관련근거", name: "ecr_no", width: 90, align: "center" },
                { header: "구분", name: "ecr_tp_nm", width: 70, align: "center" },
                { header: "Level", name: "crm_tp_nm", width: 70, align: "center" },
                { header: "적용시점", name: "act_time_text", width: 100 },
                //{ header: "작성일", name: "eco_dt", width: 80, align: "center", mask: "date-ymd" },
                //{ header: "작성부서", name: "eco_dept_nm", width: 80 },
                //{ header: "작성자", name: "eco_emp_nm", width: 70 },
                { name: "ecr_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_ECO", query: "EHM_3111_2", type: "TABLE", title: "ECO 내역",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 90, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "ECO No.", format: { type: "label" } },
                            { name: "eco_no" },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "ecr_no" },
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "eco_title", format: { width: 800 } },
                            { header: true, value: "구분", format: { type: "label" } },
                            { name: "ecr_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개요", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "eco_desc", format: { width: 800 } },
                            { header: true, value: "Level", format: { type: "label" } },
                            { name: "crm_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용요구시점", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "act_time_text", format: { width: 800 } },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            { style: { colfloat: "float" }, name: "eco_emp_nm", format: { type: "text", width: 60 } },
                            { style: { colfloat: "floated" }, name: "eco_dept_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "CRM부서", format: { type: "label" } },
                            { name: "rqst_dept_nm", width: 200, style: { colspan: 3 } },
                            { header: true, value: "작성일자", format: { type: "label" } },
                            { name: "eco_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { style: { rowspan: 3 }, header: true, value: "분류", format: { type: "label" } },
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region1_text" },
                            { style: { colfloat: "floating" }, name: "act_module1_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class1_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region2_text" },
                            { style: { colfloat: "floating" }, name: "act_module2_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class2_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region3_text" },
                            { style: { colfloat: "floating" }, name: "act_module3_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class3_text", format: { width: 200 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_ECO_MODEL", query: "EHM_3111_3", title: "적용 모델",
            height: 69, pager: false, show: true, caption: true, number: true, selectable: true,
            element: [
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 120 },
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "LINE", name: "cust_dept_nm", width: 120 },
                { header: "Project No.", name: "proj_key", width: 100 },
                { header: "호기", name: "prod_no", width: 50, align: "center" },
                { header: "고객담당자", name: "cust_emp", width: 100, align: "center" },
                {
                    header: "승인", name: "eca_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "승인일자", name: "eca_date", width: 80, align: "center", mask: "date-ymd" },
                {
                    header: "횡전개", name: "pm_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { name: "model_seq", hidden: true },
                { name: "root_seq", hidden: true },
                { name: "root_no", hidden: true }
            ]
        };

        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_ECO", offset: 8 },
                { type: "FORM", id: "frmData_ECO", offset: 8 },
                { type: "GRID", id: "grdList_ECO_MODEL", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_ECO", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_ECO", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================

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

    switch (param.element) {
        case "조회":
            {
                if (param.object == "lyrMenu") {
                    var args = { target: [{ id: "frmOption", focus: true }] };
                    gw_com_module.objToggle(args);
                } else {
                    processRetrieve({});
                }
            }
            break;
        case "확인":
            {
                closeOption({});
                var row = gw_com_api.getSelectedRow("grdList_ECO");
                if (row > 0) {
                    var eco_no = gw_com_api.getValue("grdList_ECO", row, "eco_no", true);
                    if (chkECO(eco_no) == "1") {
                        var args = {
                            ID: gw_com_api.v_Stream.msg_closeDialogue,
                            data: {
                                eco_no: eco_no
                            }
                        };
                        gw_com_module.streamInterface(args);
                    } else {
                        gw_com_api.messageBox([{ text: "이미 횡전개 등록된 ECO 입니다." }]);
                    }
                } else
                    gw_com_api.messageBox([{ text: "NODATA" }]);
            }
            break;
        case "닫기":
            {
                closeOption({});
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
                closeOption({});
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "eca_no", argument: "arg_eca_no" },
                { name: "eco_no", argument: "arg_eco_no" },
                { name: "ecr_title", argument: "arg_ecr_title" },
                { name: "eco_title", argument: "arg_eco_title" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_ECO", select: true }
        ],
        clear: [
            { type: "FORM", id: "frmData_ECO" },
            { type: "GRID", id: "grdList_ECO_MODEL" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processRowselected(param) {

    var args = {
        source: {
            type: "GRID", id: param.object, row: param.row,
            element: [
                { name: "eca_no", argument: "arg_eca_no" },
                { name: "eco_no", argument: "arg_eco_no" }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_ECO" },
            { type: "GRID", id: "grdList_ECO_MODEL", select: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRowdblclick(param) {

    processButton({ object: "lyrMenu", element: "확인", row: 1 });

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function chkECO(eco_no) {

    var rtn = false;
    var args = {
        request: "DATA",
        name: "EHM_3111_1_CHK_ECO",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3111_1_CHK_ECO" +
            "&QRY_COLS=chk" +
            "&CRUD=R" +
            "&arg_eco_no=" + eco_no,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        if (data.DATA[0] == "1")
            rtn = true;

    }
    return rtn;

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                gw_com_api.setValue("frmOption", 1, "dept_area", param.data.dept_area);
                processRetrieve({});
            }
            break;
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
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//