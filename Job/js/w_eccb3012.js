
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
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                //{
                //    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB41" }
                //    ]
                //},
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
                { name: "추가", value: "추가" },
                { name: "수정", value: "수정", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_1", type: "FREE", title: "조회 조건", remark: "lyrRemark",
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
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, data: { memory: "DEPT_AREA_FIND" } }
                            },
                            {
                                name: "cip_no", label: { title: "CIP No. :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "ecr_no", label: { title: "ECR No. :" },
                                editable: { type: "text", size: 12 }
                            },
                            { name: "pstat", hidden: true }
                            //{
                            //    name: "pstat", label: { title: "진행상태 :" }, style: { colfloat: "floating" },
                            //    editable: { type: "select", data: { memory: "진행상태", unshift: [{ title: "전체", value: "%" }] } }
                            //}
                        ]
                    },
                    {
                        element: [
                            {
                                name: "ecr_title", label: { title: "개선제안명 :" },
                                editable: { type: "text", size: 27 }
                            },
                            {
                                name: "cip_title", label: { title: "CIP 제목 :" },
                                editable: { type: "text", size: 27 }
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
                                name: "rpt_dept", label: { title: "작성부서 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "rpt_emp", label: { title: "작성자 :" },
                                editable: { type: "text", size: 7 }
                            },
                            {
                                name: "act_emp", label: { title: "담당자 :" },
                                editable: { type: "text", size: 7 }, hidden: true
                            },
                            { name: "act_time", hidden: true },
                            { name: "astat", hidden: true }
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
            targetid: "frmOption_2", type: "FREE",
            trans: true, border: true, show: false, margin: 185,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
                            { name: "시행", value: "시행정보", format: { type: "button", icon: "기타" } },
                            { name: "완료", value: "완료정보", format: { type: "button", icon: "기타" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_3", type: "FREE",
            trans: true, border: true, show: false, margin: 95,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
                            { name: "시행", value: "시행품의", format: { type: "button", icon: "기타" } },
                            { name: "완료", value: "완료보고", format: { type: "button", icon: "기타" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_4",
            type: "FREE", trans: true, border: true, show: false, margin: 10,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
                            { name: "시행", value: "시행품의", format: { type: "button", icon: "기타" } },
                            { name: "완료", value: "완료보고", format: { type: "button", icon: "기타" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_현황", query: "w_eccb3012_M_2", title: "CIP 현황",
            height: 442, show: true, selectable: true, key: true, dynamic: true,
            element: [
                { header: "CIP No.", name: "cip_no", width: 90, align: "center" },
                { header: "제목", name: "cip_title", width: 300, align: "left" },
                { header: "관련근거", name: "ecr_no", width: 90, align: "center" },
                { header: "개선제안명", name: "ecr_title", width: 300, align: "left" },
                //{ header: "진행상태", name: "pstat_text", width: 80, align: "center", hidden: true },
                //{ header: "TEST장비", name: "test_model", width: 200, align: "left", hidden: true },
                { header: "제품유형", name: "prod_type", width: 100, align: "center" },
                { header: "적용영역", name: "act_region", width: 150, align: "center" },
                { header: "적용모듈", name: "act_module", width: 150, align: "center" },
                { header: "MP분류", name: "mp_class", width: 150, align: "center" },
                //{ header: "시작예정일", name: "plan_str_dt", width: 80, align: "center", mask: "date-ymd", hidden: true },
                //{ header: "완료예정일", name: "plan_end_dt", width: 80, align: "center", mask: "date-ymd", hidden: true },
                //{ header: "시작일", name: "str_dt", width: 80, align: "center", mask: "date-ymd", hidden: true },
                //{ header: "완료일", name: "end_dt", width: 80, align: "center", mask: "date-ymd", hidden: true },
                //{ header: "대표실행자", name: "act_emp_nm", width: 70, align: "center", hidden: true },
                //{ header: "공동실행자", name: "sub_emp_nm", width: 70, align: "center", hidden: true },
                { header: "작성일자", name: "rpt_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "작성부서", name: "rpt_dept_nm", width: 70, align: "center" },
                { header: "작성자", name: "rpt_emp_nm", width: 70, align: "center" },
                { name: "rpt_astat_nm", hidden: true },
                { name: "rpt_usr", hidden: true },
                { name: "approval", hidden: true }
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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

        //====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: click_lyrMenu_상세 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: click_lyrMenu_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption_1", element: "실행", event: "click", handler: click_frmOption_1_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_1", element: "취소", event: "click", handler: click_frmOption_1_취소 };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption_2", element: "시행", event: "click", handler: click_frmOption_2_시행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_2", element: "완료", event: "click", handler: click_frmOption_2_완료 };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption_3", element: "시행", event: "click", handler: click_frmOption_3_시행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_3", element: "완료", event: "click", handler: click_frmOption_3_완료 };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption_4", element: "시행", event: "click", handler: click_frmOption_4_시행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_4", element: "완료", event: "click", handler: click_frmOption_4_완료 };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: click_lyrMenu_상세 };
        gw_com_module.eventBind(args);
        //====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

            closeOption({ target: ["frmOption_2"] });
            closeOption({ target: ["frmOption_3"] });
            closeOption({ target: ["frmOption_4"] });

            var args = { target: [{ id: "frmOption_1", focus: true }] };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_상세(ui) {

            closeOption({ target: ["frmOption_1"] });
            closeOption({ target: ["frmOption_3"] });
            closeOption({ target: ["frmOption_4"] });

            //var args = {
            //    target: [
            //      {
            //          id: "frmOption_2",
            //          focus: true
            //      }
            //  ]
            //};
            //gw_com_module.objToggle(args);

            // 시행품의 사용안함
            click_frmOption_2_완료(ui);
        }
        //----------
        function click_lyrMenu_추가(ui) {

            closeOption({ target: ["frmOption_1"] });
            closeOption({ target: ["frmOption_2"] });
            closeOption({ target: ["frmOption_4"] });

            //var args = {
            //    target: [
            //      {
            //          id: "frmOption_3",
            //          focus: true
            //      }
            //  ]
            //};
            //gw_com_module.objToggle(args);

            // 시행품의 사용안함
            click_frmOption_3_완료(ui);


        }
        //----------
        function click_lyrMenu_수정(ui) {

            closeOption({ target: ["frmOption_1"] });
            closeOption({ target: ["frmOption_2"] });
            closeOption({ target: ["frmOption_3"] });

            //var args = {
            //    target: [
            //      {
            //          id: "frmOption_4",
            //          focus: true
            //      }
            //  ]
            //};
            //gw_com_module.objToggle(args);

            // 시행품의 사용안함
            click_frmOption_4_완료(ui);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_1_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_1_취소(ui) {

            closeOption({});

        }
        //----------
        function click_frmOption_2_시행(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb3010",
                    title: "CIP 시행 정보",
                    param: [
                        { name: "AUTH", value: "R" },
                        { name: "cip_no", value: gw_com_api.getValue("grdData_현황", "selected", "cip_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_2_완료(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb3020",
                    title: "CIP 정보",
                    param: [
                        { name: "AUTH", value: "R" },
                        { name: "cip_no", value: gw_com_api.getValue("grdData_현황", "selected", "cip_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_3_시행(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb3010",
                    title: "CIP 시행 품의"
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_3_완료(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb3020",
                    title: "CIP 완료 보고"
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_4_시행(ui) {

            var user = gw_com_api.getValue("grdData_현황", "selected", "draft_usr", true);
            var status = gw_com_api.getValue("grdData_현황", "selected", "draft_astat_nm", true);
            var approval = gw_com_api.getValue("grdData_현황", "selected", "approval", true);
            if (gw_com_module.v_Session.USER_TP != "SYS") {
                if (user != gw_com_module.v_Session.USR_ID) {
                    gw_com_api.messageBox([
                        { text: "수정 권한이 없습니다." }
                    ], 300);
                    return false;
                } else if (approval != "1") {
                    gw_com_api.messageBox([
                        { text: "결재 " + status + " 자료이므로 수정할 수 없습니다." }
                    ], 420);
                    return false;
                }
            }

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb3010",
                    title: "CIP 시행 품의",
                    param: [
                        { name: "cip_no", value: gw_com_api.getValue("grdData_현황", "selected", "cip_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_4_완료(ui) {

            var user = gw_com_api.getValue("grdData_현황", "selected", "rpt_usr", true);
            var approval = gw_com_api.getValue("grdData_현황", "selected", "approval", true);
            var status = gw_com_api.getValue("grdData_현황", "selected", "rpt_astat_nm", true);
            var approval = gw_com_api.getValue("grdData_현황", "selected", "approval", true);

            if (gw_com_module.v_Session.USER_TP != "SYS") {
                /*if (user != gw_com_module.v_Session.USR_ID) {
                    gw_com_api.messageBox([
                        { text: "수정 권한이 없습니다." }
                    ], 300);
                    return false;
                } else */if (approval != "1") {
                    gw_com_api.messageBox([
                        { text: "결재 " + status + " 자료이므로 수정할 수 없습니다." }
                    ], 420);
                    return false;
                }
            }

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb3020",
                    title: "CIP 완료 보고",
                    param: [
                        { name: "cip_no", value: gw_com_api.getValue("grdData_현황", "selected", "cip_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA);
        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmOption_1" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption_1", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "cip_no", argument: "arg_cip_no" },
                { name: "ecr_no", argument: "arg_ecr_no" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "act_region", argument: "arg_act_region" },
                { name: "act_module", argument: "arg_act_module" },
                { name: "mp_class", argument: "arg_mp_class" },
                { name: "cip_title", argument: "arg_cip_title" },
                { name: "ecr_title", argument: "arg_ecr_title" },
                { name: "rpt_dept", argument: "arg_rpt_dept" },
                { name: "rpt_emp", argument: "arg_rpt_emp" },
                { name: "act_emp", argument: "arg_act_emp" },
                { name: "pstat", argument: "arg_pstat" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "cip_no" }] },
                { element: [{ name: "ecr_no" }] },
                //{ element: [{ name: "cip_title" }] },
                //{ element: [{ name: "ecr_title" }] },
                { element: [{ name: "prod_type" }] },
                { element: [{ name: "act_region" }] },
                { element: [{ name: "act_module" }] },
                { element: [{ name: "mp_class" }] },
                { element: [{ name: "rpt_dept" }] },
                { element: [{ name: "rpt_emp" }] },
                { element: [{ name: "act_emp" }] },
                { element: [{ name: "pstat" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_현황", select: true, focus: true }
        ],
        key: param.key
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

    if (param.target != undefined) {
        $.each(param.target, function () {
            gw_com_api.hide(this);
        });
    }
    else {
        gw_com_api.hide("frmOption_1");
        gw_com_api.hide("frmOption_2");
        gw_com_api.hide("frmOption_3");
        gw_com_api.hide("frmOption_4");
    }

    gw_com_api.hide("frmOption_1");

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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
            /*
            case gw_com_api.v_Stream.msg_openedDialogue:
            {
            var args = {
            to: {
            type: "POPUP",
            page: param.from.page
            }
            };
            switch (param.from.page) {
            case "w_find_as":
            {
            args.ID = gw_com_api.v_Stream.msg_infoAS;
            args.data = {
            issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
            };
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
            */
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//