
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            type: "PAGE", page: "w_edit_memo_eccb", title: "사유", width: 700, height: 300
        };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = {
            type: "PAGE", page: "w_eccb1052", title: "담당자 지정", width: 700, height: 500
        };
        gw_com_module.dialoguePrepare(args);

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
                },
                {
                    type: "PAGE", name: "분류1", query: "dddw_zcode",
                    param: [
                    { argument: "arg_hcode", value: "ECCB05" }
                    ]
                },
                {
                    type: "PAGE", name: "분류2", query: "dddw_zcode",
                    param: [
                    { argument: "arg_hcode", value: "ECCB06" }
                    ]
                },
                {
                    type: "PAGE", name: "분류3", query: "dddw_zcode",
                    param: [
                    { argument: "arg_hcode", value: "ECCB07" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                {
                    type: "PAGE", name: "부서", query: "dddw_dept"
                },
                {
                    type: "PAGE", name: "CRM부서", query: "dddw_crm_dept"
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

            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA);

            if (!(gw_com_module.v_Session.ROLE_ID == "429" || gw_com_module.v_Session.USER_TP == "SYS"))
                gw_com_api.setValue("frmOption", 1, "act_emp", gw_com_module.v_Session.EMP_NO);
            //----------
            gw_com_module.startPage();

            processRetrieve({});

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
                { name: "상세", value: "상세정보", icon: "기타" },
                //{ name: "반려", value: "반려", icon: "아니오" },
                //{ name: "기각", value: "기각", icon: "아니오" },
                //{ name: "접수", value: "접수", icon: "예" },
                { name: "CRM", value: "CRM 등록", icon: "추가" },
                { name: "변경", value: "CRM부서변경", icon: "실행" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "기간 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "act_emp", label: { title: "담당자 :" }, hidden: true,
                                editable: { type: "text", size: 7, maxlength: 20 }
                            },
                            {
                                name: "crm_no", label: { title: "CRM No. :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "ecr_no", label: { title: "ECR No. :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "ecr_title", label: { title: "개선제안명 :" },
                                  editable: { type: "text", size: 27, maxlength: 50 }
                              },
                              {
                                  name: "ecr_desc", label: { title: "제안개요 :" },
                                  editable: { type: "text", size: 27, maxlength: 50 }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "prod_type", label: { title: "제품유형 :" },
                                  editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "act_region", label: { title: "분류 :" }, style: { colfloat: "floating" },
                                  editable: { type: "select", data: { memory: "분류1", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "act_module",
                                  editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "mp_class",
                                  editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "전체", value: "%" }] } }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "dept_area", label: { title: "장비군 :" },
                                  editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                              },
                              {
                                  name: "ecr_dept", label: { title: "작성부서 :" },
                                  editable: { type: "select", data: { memory: "부서", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "ecr_emp", label: { title: "작성자 :" }, style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              {
                                  name: "rqst_dept", label: { title: "CRM부서 :" },
                                  editable: { type: "select", data: { memory: "CRM부서", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              { name: "act_time", hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                              { name: "실행", value: "실행", act: true, format: { type: "button" } },
                              { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_현황", query: "w_eccb1055_M_1", title: "CRM 현황",
            height: 442, show: true, selectable: true, key: true, dynamic: true,
            element: [
                { header: "CRM No.", name: "crm_no", width: 90, align: "center" },
                { header: "개선제안명", name: "ecr_title", width: 340, align: "left" },
                { header: "ECR No.", name: "ecr_no", width: 90, align: "center" },
                { header: "구분", name: "ecr_tp_nm", width: 60, align: "center" },
                { header: "진행상태", name: "pstat_nm", width: 90, align: "center" },
                { header: "관련근거", name: "issue_no", width: 90, align: "center" },
                { header: "회사명", name: "comp_nm", width: 120, hidden: true },
                { header: "조치요구시점", name: "act_time_text", width: 100, align: "center" },
                { header: "CRM부서", name: "rqst_dept_nm", width: 80, align: "center" },
                { header: "제품유형", name: "prod_type", width: 100, align: "center" },
                { header: "적용영역", name: "act_region", width: 100, align: "center" },
                { header: "적용모듈", name: "act_module", width: 150, align: "center" },
                { header: "MP분류", name: "mp_class", width: 150, align: "center" },
                { header: "작성일자", name: "ecr_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "작성부서", name: "ecr_dept_nm", width: 70, align: "center" },
                { header: "작성자", name: "ecr_emp_nm", width: 70, align: "center" },
                { header: "담당자1", name: "act_emp1_nm", width: 70, align: "center" },
                { header: "담당자2", name: "act_emp2_nm", width: 70, align: "center" },
                //{ header: "승인상태", name: "gw_astat_nm", width: 80, align: "center" },
                //{ header: "승인자", name: "gw_aemp", width: 70, align: "center" },
                //{ header: "승인일시", name: "gw_adate", width: 160, align: "center" },
                //{ header: "접수일자", name: "rcvd_dt", width: 80, align: "center", mask: "date-ymd" },
                //{ header: "접수부서", name: "rcvd_dept_nm", width: 80, align: "center" },
                //{ header: "접수자", name: "rcvd_emp_nm", width: 70, align: "center" },
                //{ header: "사유", name: "rmk", width: 200 },
                { name: "dept_area", hidden: true },
                { name: "ins_usr", hidden: true },
                { name: "crm_no", hidden: true },
                { name: "act1_emp", hidden: true },
                { name: "act2_emp", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================
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

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "반려", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "기각", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "변경", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "접수", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "CRM", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);

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
                var args = { target: [{ id: "frmOption", focus: true }] };
                gw_com_module.objToggle(args);
            }
            break;
        case "상세":
            {
                if (gw_com_api.getSelectedRow("grdData_현황") > 0) {
                    var args = {
                        ID: gw_com_api.v_Stream.msg_linkPage,
                        to: {
                            type: "MAIN"
                        },
                        data: {
                            page: "w_eccb1014", title: "ECR 정보",
                            param: [
                                { name: "AUTH", value: "R" },
                                { name: "ecr_no", value: gw_com_api.getValue("grdData_현황", "selected", "ecr_no", true) }
                            ]
                        }
                    };
                    gw_com_module.streamInterface(args);
                }
            }
            break;
        case "반려":
        case "기각":
        case "변경":
        case "접수":
            {
                if (gw_com_api.getSelectedRow("grdData_현황") > 0) {
                    v_global.event.type = param.type;
                    v_global.event.object = param.object;
                    v_global.event.row = param.row;
                    v_global.event.element = param.element;
                    v_global.event.data = {
                        key: gw_com_api.getValue("grdData_현황", "selected", "crm_no", true),
                        ecr_no: gw_com_api.getValue("grdData_현황", "selected", "ecr_no", true),
                        dept_area: gw_com_api.getValue("grdData_현황", "selected", "dept_area", true)
                    }

                    var args;
                    if (param.element == "접수") {
                        args = {
                            page: "w_eccb1052",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                    } else {
                        v_global.event.data.edit = true;
                        v_global.event.data.title = param.element + " 사유";
                        v_global.event.data.astat = param.element == "반려" ? "70" : param.element == "기각" ? "80" : "01";    // 담당자변경 = CRM접수대기
                        if (param.element == "변경")
                            v_global.event.data.element = "CRM_DEPT";

                        args = {
                            page: "w_edit_memo_eccb",
                            param: {
                                ID: gw_com_api.v_Stream.msg_edit_Memo,
                                data: v_global.event.data
                            }
                        };
                    }
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "CRM":
            {
                if (gw_com_api.getSelectedRow("grdData_현황") > 0) {
                    var args = {
                        ID: gw_com_api.v_Stream.msg_linkPage,
                        to: {
                            type: "MAIN"
                        },
                        data: {
                            page: "w_eccb1051",
                            title: "CRM 등록",
                            param: [
                                { name: "crm_no", value: gw_com_api.getValue("grdData_현황", "selected", "crm_no", true) },
                                { name: "ecr_no", value: gw_com_api.getValue("grdData_현황", "selected", "ecr_no", true) },
                                { name: "issue_no", value: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true) }
                            ]
                        }
                    };
                    gw_com_module.streamInterface(args);
                }
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
                closeOption({});
            }
            break;
    }
}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "crm_no", argument: "arg_crm_no" },
                { name: "ecr_no", argument: "arg_ecr_no" },
                { name: "ecr_title", argument: "arg_ecr_title" },
                { name: "ecr_desc", argument: "arg_ecr_desc" },
                { name: "ecr_dept", argument: "arg_ecr_dept" },
                { name: "ecr_emp", argument: "arg_ecr_emp" },
                { name: "act_time", argument: "arg_act_time" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "act_region", argument: "arg_act_region" },
                { name: "act_module", argument: "arg_act_module" },
                { name: "mp_class", argument: "arg_mp_class" },
                //{ name: "pstat", argument: "arg_pstat" },
                { name: "astat", argument: "arg_astat" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "rqst_dept", argument: "arg_rqst_dept" },
                { name: "act_emp", argument: "arg_act_emp" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "ecr_title" }] },
                { element: [{ name: "prod_type" }] },
                { element: [{ name: "act_region" }] },
                { element: [{ name: "act_module" }] },
                { element: [{ name: "mp_class" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "ecr_dept" }] },
                { element: [{ name: "ecr_emp" }] },
                { element: [{ name: "rqst_dept" }] },
                { element: [{ name: "act_time" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_현황", select: true, focus: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

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
function successSave(response, param) {

    if (param.element == "CRM_DEPT") {
        processBatch({ key: param.key });
    } else {
        processRetrieve({});
    }

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "PROC_MAIL_ECCB",
        nomessage: true,
        input: [
            { name: "stat", value: "CRM", type: "varchar" },
            { name: "key", value: param.key, type: "varchar" }
        ],
        handler: {
            success: successBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    processRetrieve({});
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
                                processSave(param.data.arg);
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP",  page: param.from.page  }
                };
                switch (param.from.page) {
                    case "w_eccb1052":
                        {
                            args.data = v_global.event.data;
                        }
                        break;
                    case "w_edit_memo_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_Memo;
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_eccb1052":
                        if (param.data != undefined) {
                            processRetrieve({});
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                var update = [
                    {
                        query: "w_eccb1051_M_2",
                        row: [
                            {
                                crud: "U",
                                column: [
                                    { name: "crm_no", value: param.data.key },
                                    { name: "rmk", value: param.data.text },
                                    { name: "astat", value: param.data.astat },
                                    { name: "adate", value: "SYSDT" },
                                    { name: "aemp", value: gw_com_module.v_Session.EMP_NO }
                                ]
                            }
                        ]
                    }
                ];

                // CRM 부서 변경
                if (param.data.element == "CRM_DEPT")
                    update[update.length] = {
                        query: "w_eccb1051_M_1",
                        row: [
                            {
                                crud: "U",
                                column: [
                                    { name: "ecr_no", value: param.data.ecr_no },
                                    { name: "rqst_dept", value: param.data.crm_dept }
                                ]
                            }
                        ]
                    };
                    
                var args = {
                    url: "COM",
                    user: gw_com_module.v_Session.USR_ID,
                    //nomessage: true,
                    param: update,
                    handler: {
                        success: successSave,
                        param: param.data
                    }
                };
                gw_com_module.objSave(args);
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//