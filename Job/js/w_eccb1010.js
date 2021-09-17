//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : ECR 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 주요 수정 부문 :

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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        v_global.logic.pcn_yn = gw_com_api.getPageParameter("issue_no").substr(0, 3) == "PCN" ? true : false;

        // prepare dialogue.
        var args = {
            type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        // set data.
        var args = {
            request: [
                {
                    type: "PAGE", name: "ECCB02", query: "dddw_zcode",
                    param: [
                            { argument: "arg_hcode", value: "ECCB02" }
                    ]
                },
                {
                    type: "PAGE", name: "ECCB13", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB13" }
                    ]
                },
                //{
                //    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB03" }
                //    ]
                //},
                {
                    type: "PAGE", name: "조치시점", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB10" }
                    ]
                },
                {
                    type: "PAGE", name: "분류1", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB05" }
                    ]
                },
                { type: "PAGE", name: "분류2", query: "dddw_ecr_module" },
                {
                    type: "PAGE", name: "분류3", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB07" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                { type: "PAGE", name: "CRM부서", query: "dddw_crm_dept" },
                {
                    type: "INLINE", name: "ECCB_TP",
                    data: [
                        { title: "ECCB", value: "E" },
                        { title: "DCCB", value: "D" },
                        { title: "SCCB", value: "S" },
                        { title: "LCCB", value: "L" }
                    ]
                },
                {
                    type: "INLINE", name: "설비유형",
                    data: [
                        { title: "사내설비", value: "사내설비" },
                        { title: "양산설비", value: "양산설비" }
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

            gw_job_process.uiButton();
            gw_job_process.uiData();
            gw_job_process.uiEvent();

            //add by kyt 2021-05-26
            gw_com_module.startPage();
            v_global.logic.issue_no = gw_com_api.getPageParameter("issue_no");
            if (gw_com_api.getPageParameter("_copy") == "Y") {
                v_global.logic.key = gw_com_api.getPageParameter("ecr_no");
                processRetrieve({ key: v_global.logic.key, copy: true });
            }
            else if (v_global.process.param != "" && gw_com_api.getPageParameter("ecr_no") != "") {
                v_global.logic.key = gw_com_api.getPageParameter("ecr_no");
                processRetrieve({ key: v_global.logic.key });
            }
            else
                processInsert({});
        }

    },
    
    // create UI - Button
    uiButton: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //------ Create Buttons : lyrMenu : 결재상신, 추가, 저장, 삭제, 닫기
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                //{ name: "미리보기", value: "미리보기", icon: "출력" },
                { name: "상신", value: "결재상신", icon: "기타" },
                //{ name: "회수", value: "상신취소", icon: "기타" },
                { name: "추가", value: "추가" },
                //{ name: "복사", value: "복사", icon: "실행", updatable: true },
                { name: "저장", value: "저장" },
                { name: "삭제", value: "삭제" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //------ Create Buttons : lyrMenu_모델 : 추가, 수정, 삭제
        var args = {
            targetid: "lyrMenu_모델", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "수정", value: "수정", icon: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //------ Create Buttons : lyrMenu_첨부 : 추가, 삭제
        var args = {
            targetid: "lyrMenu_첨부", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
    },
    // create UI - Data
    uiData: function () {
        //--------- Data Box : frmData_내역 : 제안 내역
        var args = {
            targetid: "frmData_내역", query: "w_eccb1010_M_1", type: "TABLE", title: "제안 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "ecr_title", validate: true },
            content: {
                width: { label: 100, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                              { header: true, value: "ECR No.", format: { type: "label" } },
                              { name: "ecr_no", editable: { type: "hidden" } },
                              { header: true, value: "관련근거", format: { type: "label" } },
                              { name: "issue_no", editable: { type: "hidden" } },
                              { header: true, value: "장비군", format: { type: "label" } },
                              {
                                  name: "dept_area", style: { colfloat: "float" },
                                  format: { width: 0 },
                                  editable: {
                                      type: "select", data: { memory: "DEPT_AREA_IN" }, validate: { rule: "required" },
                                      change: [
                                          { name: "rqst_dept", memory: "CRM부서", unshift: [{ title: "", value: "" }], key: ["dept_area"] },
                                          { name: "act_module1_sel", memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region1"] },
                                          { name: "act_module2_sel", memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region2"] },
                                          { name: "act_module3_sel", memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region3"] }
                                      ]
                                  }
                            },
                            { name: "dept_area_nm", style: { colfloat: "floating" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개선제안명", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "ecr_title", format: { width: 636 },
                                editable: { type: "text", width: 634, maxlength: 100, validate: { rule: "required", message: "개선제안명" } }
                            },
                            { header: true, value: "구분", format: { type: "label" } },
                            {
                                name: "ecr_tp", style: { colfloat: "float" },
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "ECCB02" }, validate: { rule: "required", message: "ECR구분" } }
                            },
                            { name: "ecr_tp_nm", style: { colfloat: "floating" } }
                            //{
                            //    name: "ecr_tp_nm", mask: "search", display: true,
                            //    editable: { type: "text", validate: { rule: "required", message: "구분" } }
                            //},
                            //{ name: "ecr_tp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제안개요", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "ecr_desc",
                                format: { width: 636 },
                                editable: { type: "text", width: 634, maxlength: 125 }
                            },
                            { header: true, value: "Level", format: { type: "label" } },
                            {
                                name: "crm_tp", style: { colfloat: "float" },
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "ECCB13" }, validate: { rule: "required", message: "Level" } }
                            },
                            { name: "crm_tp_nm", style: { colfloat: "floating" } }
                            //{
                            //    name: "crm_tp_nm", mask: "search", display: true,
                            //    editable: { type: "text", validate: { rule: "required", message: "Level" } }
                            //},
                            //{ name: "crm_tp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용요구시점", format: { type: "label" } },
                            {
                                name: "act_time", style: { colfloat: "float" },
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "조치시점" }, validate: { rule: "required", message: "적용요구시점" } }
                            },
                            { name: "act_time_text", style: { colfloat: "floating" } },
                            //{
                            //    name: "act_time_text", mask: "search", display: true, style: { colspan: 3, colfloat: "float" },
                            //    format: { width: 636 },
                            //    editable: { type: "text", width: 634, validate: { rule: "required", message: "적용요구시점" } }
                            //},
                            //{ name: "act_time", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "E/D/S/LCCB", format: { type: "label" } },
                            {
                                name: "eccb_tp",
                                editable: {
                                    type: "select", data: { memory: "ECCB_TP", unshift: [{ title: "-", value: "" }] },
                                    validate: { rule: "required", message: "E/D/S/LCCB" }
                                }
                            },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            {
                                name: "ecr_emp_nm", style: { colfloat: "float" }, display: true,
                                format: { width: 50 },
                                editable: { type: "hidden", width: 50 }
                            },
                            {
                                name: "ecr_dept_nm", style: { colfloat: "floated" }, display: true,
                                format: { width: 120 },
                                editable: { type: "hidden", width: 120 }
                            },
                            { name: "ecr_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "ecr_dept", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "label_rqst_dept", value: "CRM부서", format: { type: "label" } },
                            {
                                name: "rqst_dept",
                                editable: {
                                    type: "select", data: { memory: "CRM부서", unshift: [{ title: "", value: "" }], key: ["dept_area"] },
                                    validate: { rule: "required", message: "CRM부서" }
                                }
                            },
                            { header: true, value: "설비유형", format: { type: "label" } },
                            {
                                name: "prod_tp", style: { colfloat: "float" },
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "설비유형", unshift: [{ title: "", value: "" }] } }
                            },
                            { name: "prod_tp_text", style: { colfloat: "floating" } },
                            { header: true, value: "작성일자", format: { type: "label" } },
                            { name: "ecr_dt", mask: "date-ymd", editable: { type: "text", validate: { rule: "required", message: "작성일자" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "분류", format: { type: "label" }, style: { rowspan: 3 } },
                            {
                                name: "act_region1", format: { width: 0 },
                                style: { colspan: 5, colfloat: "float" },
                                editable: {
                                    type: "select", width: 155, validate: { rule: "required" },
                                    data: { memory: "분류1", unshift: [{ title: "", value: "" }] },
                                    change: [{ name: "act_module1_sel", memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region1"] }]
                                }
                            },
                            { name: "act_region1_text", format: { width: 200 }, style: { colfloat: "floating" } },
                            { name: "act_module1_text", format: { width: 300 }, style: { colfloat: "floating" } },
                            {
                                name: "act_module1_sel", format: { width: 0 },
                                style: { colfloat: "floating" }, display: true,
                                editable: {
                                    type: "select", width: 155,
                                    data: { memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region1"] },
                                    validate: { rule: "required" }
                                }
                            },
                            {
                                name: "act_module1_etc", format: { width: 0 },
                                style: { colfloat: "floating" }, display: true,
                                editable: { type: "text", width: 155 }
                            },
                            { name: "act_module1", hidden: true, editable: { type: "hidden" } },
                            { name: "mp_class1_text", format: { width: 200 }, style: { colfloat: "floating" } },
                            {
                                name: "mp_class1_sel", format: { width: 0 },
                                style: { colfloat: "floating" }, display: true,
                                editable: {
                                    type: "select", width: 155, //validate: { rule: "required" },
                                    data: { memory: "분류3", unshift: [{ title: "", value: "" }] }
                                }
                            },
                            {
                                name: "mp_class1_etc", format: { width: 0 },
                                style: { colfloat: "floated" }, display: true,
                                editable: { type: "text", width: 155 }
                            },
                            { name: "mp_class1", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            {
                                style: { colspan: 5, colfloat: "float" },
                                name: "act_region2", format: { width: 0 },
                                editable: {
                                    type: "select", width: 155,
                                    data: { memory: "분류1", unshift: [{ title: "", value: "" }] },
                                    change: [{ name: "act_module2_sel", memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region2"] }]
                                }
                            },
                            { style: { colfloat: "floating" }, name: "act_region2_text", format: { width: 200 } },
                            { style: { colfloat: "floating" }, name: "act_module2_text", format: { width: 300 } },
                            {
                                name: "act_module2_sel", format: { width: 0 },
                                style: { colfloat: "floating" }, display: true,
                                editable: {
                                    type: "select", width: 155,
                                    data: { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region2"] }
                                }
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module2_etc",
                                format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "act_module2", hidden: true, editable: { type: "hidden" } },
                            { style: { colfloat: "floating" }, name: "mp_class2_text", format: { width: 200 } },
                            {
                                style: { colfloat: "floating" }, name: "mp_class2_sel",
                                format: { width: 0 },
                                editable: {
                                    type: "select", width: 155,
                                    data: { memory: "분류3", unshift: [{ title: "", value: "" }] }
                                },
                                display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class2_etc",
                                format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "mp_class2", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            {
                                style: { colspan: 5, colfloat: "float" },
                                name: "act_region3", format: { width: 0 },
                                editable: {
                                    type: "select", width: 155,
                                    data: { memory: "분류1", unshift: [{ title: "", value: "" }] },
                                    change: [{ name: "act_module3_sel", memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region3"] }]
                                }
                            },
                            { style: { colfloat: "floating" }, name: "act_region3_text", format: { width: 200 } },
                            { style: { colfloat: "floating" }, name: "act_module3_text", format: { width: 300 } },
                            {
                                name: "act_module3_sel", format: { width: 0 },
                                style: { colfloat: "floating" }, display: true,
                                editable: {
                                    type: "select", width: 155,
                                    data: { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region3"] }
                                }
                            },
                            {
                                name: "act_module3_etc", style: { colfloat: "floating" },
                                format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "act_module3", hidden: true, editable: { type: "hidden" } },
                            { style: { colfloat: "floating" }, name: "mp_class3_text", format: { width: 200 } },
                            {
                                name: "mp_class3_sel", style: { colfloat: "floating" },
                                format: { width: 0 },
                                editable: {
                                    type: "select", width: 155,
                                    data: { memory: "분류3", unshift: [{ title: "", value: "" }] },
                                },
                                display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class3_etc",
                                format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "mp_class3", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "승인상태", format: { type: "label" } },
                            { name: "gw_astat_nm" },
                            { header: true, value: "승인자", format: { type: "label" } },
                            { name: "gw_aemp" },
                            { header: true, value: "승인일시", format: { type: "label" } },
                            { name: "gw_adate" },
                            { name: "gw_astat", hidden: true },
                            { name: "gw_key", hidden: true },
                            { name: "gw_seq", hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "astat", editable: { type: "hidden" }, hidden: true },
                            { name: "approval", hidden: true },
                            { name: "crm_no", hidden: true }
                        ]
                    }
                ]
            }
        };
        // row_push
        if (v_global.logic.pcn_yn) {
            args.content.row.push({
                element: [
                    { header: true, value: "회사명", format: { type: "label" } },
                    { name: "comp_nm", format: { type: "text", width: 150 }, style: { colspan: 5 }, display: true }
                ]
            });
        }
        gw_com_module.formCreate(args);

        //--------- Data Box : grdData_모델 : 적용 모델
        var args = {
            targetid: "grdData_모델", query: "w_eccb1010_S_1", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 120 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "제품명", name: "prod_nm", width: 300 },
                { name: "prod_type", hidden: true, editable: { type: "hidden" } },
                { name: "cust_cd", hidden: true, editable: { type: "hidden" } },
                { name: "prod_key", hidden: true, editable: { type: "hidden" } },
                { name: "model_seq", hidden: true, editable: { type: "hidden" } },
                { name: "cust_dept", hidden: true, editable: { type: "hidden" } },
                { name: "cust_proc", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //=====================================================================================
        //var args = { targetid: "frmData_메모A", query: "w_eccb1010_S_2_1", type: "TABLE", title: "개선 전 (현상 및 문제점)",
        //    caption: true, show: true, fixed: true, selectable: true,
        //    editable: { bind: "select", validate: true },
        //    content: {
        //        width: { field: "100%" }, height: 370,
        //        row: [
        //            { element: [
        //                    { name: "memo_html", format: { type: "html", height: 370, top: 5 } },
        //                    { name: "memo_text", hidden: true, editable: { type: "hidden" } },
        //                    { name: "memo_cd", hidden: true, editable: { type: "hidden" } },
        //                    { name: "root_seq", hidden: true, editable: { type: "hidden" } },
        //                    { name: "root_no", hidden: true, editable: { type: "hidden" } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        ////=====================================================================================
        //var args = {
        //    targetid: "frmData_메모B", query: "w_eccb1010_S_2_2", type: "TABLE", title: "개선 후 (안)",
        //    caption: true, show: true, fixed: true, selectable: true,
        //    editable: { bind: "select", validate: true },
        //    content: {
        //        width: { field: "100%" },
        //        height: 370,
        //        row: [
        //            {
        //                element: [
        //                    { name: "memo_html", format: { type: "html", height: 370, top: 5 } },
        //                    { name: "memo_text", hidden: true, editable: { type: "hidden" } },
        //                    { name: "memo_cd", hidden: true, editable: { type: "hidden" } },
        //                    { name: "root_seq", hidden: true, editable: { type: "hidden" } },
        //                    { name: "root_no", hidden: true, editable: { type: "hidden" } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        //=====================================================================================

        //--------- Data Box : frmData_메모F : 개선 사항
        var args = {
            targetid: "frmData_메모F", query: "w_eccb1010_S_2_3", type: "TABLE", title: "개선 사항",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 500,
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 500, top: 5 } },
                            { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                            { name: "root_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //--------- Data Box : grdData_문서 : 필수 문서
        var args = {
            targetid: "grdData_문서", query: "w_eccb1010_S_6", title: "필수 문서",
            caption: true, height: "100%", pager: false, show: false, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "Item", name: "file_grp_nm", width: 250 },
                { header: "세부내용", name: "file_tp_nm", width: 300 },
                { header: "담당부서", name: "file_tp_dept", width: 100, align: "center" },
                //{ header: "파일", name: "file_upload", width: 50, align: "center", format: { type: "link" } },
                { header: "파일", name: "file_download", width: 50, align: "center", format: { type: "link" } },
                //{ header: "파일", name: "file_delete", width: 50, align: "center", format: { type: "link" } },
                { name: "ecr_no", hidden: true },
                { name: "file_id", hidden: true },
                { name: "fid", hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_nm", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //--------- Data Box : grdData_첨부 : 첨부 문서
        var args = {
            targetid: "grdData_첨부", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
            //    { header: "파일명", name: "file_nm", width: 300 },
            //    {
            //        header: "다운로드", name: "download", width: 60, align: "center",
            //        format: { type: "link", value: "다운로드" }
            //    },
            //    { header: "파일설명", name: "file_desc", width: 300, editable: { type: "text" } },
            //    { name: "file_ext", hidden: true },
            //    { name: "file_path", hidden: true },
            //    { name: "network_cd", hidden: true },
            //    { name: "data_tp", hidden: true },
            //    { name: "data_key", hidden: true },
            //    { name: "data_seq", hidden: true },
            //    { name: "file_id", hidden: true, editable: { type: "hidden" } }

           { header: "파일명", name: "file_nm", width: 300, align: "left" },
           { header: "다운로드", name: "_download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
           { header: "파일설명", name: "file_desc", width: 450, align: "left", editable: { type: "text" } },
           { header: "등록자", name: "ins_usr_nm", width: 80, align: "center" },
           { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
           { name: "file_ext", hidden: true },
           { name: "file_path", hidden: true },
           { name: "network_cd", hidden: true },
           { name: "data_tp", hidden: true },
           { name: "data_key", hidden: true },
           { name: "data_seq", hidden: true, editable: { type: "hidden" } },
         //{ name: "data_subkey", hidden: true },
         //{ name: "data_subseq", hidden: true },
           { name: "file_id", hidden: true, editable: { type: "hidden" } },
           { name: "ver_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //---------- pageCreate
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //=====================================================================================
        // Resize Objects
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_내역", offset: 8 },
                { type: "GRID", id: "grdData_모델", offset: 8 },
                { type: "GRID", id: "grdData_첨부", offset: 8 },
                { type: "GRID", id: "grdData_문서", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //del by kyt 2021-05-26
        /*gw_job_process.uiEvent();*/

    },
    // create UI - Event
    uiEvent: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "미리보기", event: "click", handler: click_lyrMenu_미리보기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상신", event: "click", handler: processApprove };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: click_lyrMenu_복사 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_모델", element: "추가", event: "click", handler: click_lyrMenu_모델_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_모델", element: "수정", event: "click", handler: click_lyrMenu_모델_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_모델", element: "삭제", event: "click", handler: click_lyrMenu_모델_삭제 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_첨부", element: "추가", event: "click", handler: click_lyrMenu_첨부_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_첨부", element: "삭제", event: "click", handler: click_lyrMenu_첨부_삭제 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_내역", event: "itemchanged", handler: itemchanged_frmData_내역 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", event: "itemdblclick", handler: itemdblclick_frmData_내역 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_메모F", event: "itemdblclick", handler: itemdblclick_frmData_메모F };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_문서", grid: true, element: "file_download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_첨부", grid: true, element: "_download", event: "click", handler: click_grdData_첨부_download };
        gw_com_module.eventBind(args);
        //=====================================================================================      
        //del by kyt 2021-05-26
        //gw_com_module.startPage();
        //v_global.logic.issue_no = gw_com_api.getPageParameter("issue_no");
        //if (gw_com_api.getPageParameter("_copy") == "Y") {
        //    v_global.logic.key = gw_com_api.getPageParameter("ecr_no");
        //    processRetrieve({ key: v_global.logic.key, copy: true });
        //}
        //else if (v_global.process.param != "" && gw_com_api.getPageParameter("ecr_no") != "") {
        //    v_global.logic.key = gw_com_api.getPageParameter("ecr_no");
        //    processRetrieve({ key: v_global.logic.key });
        //}
        //else
        //    processInsert({});

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Event
//------
function click_lyrMenu_미리보기() {
    //alert(gw_com_api.getPageID());
    //processPrint({});
    //if (!checkManipulate({})) return;
    //if (!checkUpdatable({ check: true })) return false;

    //processApprove({});  -- 현재의 ecr_no 를 받아와야한다.
    var status = checkCRUD({});
    //alert(status);
    if (status == "retrieve") {
        processPrint({});
    }
    else {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return false;
    }
}
//------ del by kyt 2021-05-26
/*function click_lyrMenu_상신() {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    processApprove({});
}*/
//------
function click_lyrMenu_추가(ui) {

    v_global.process.handler = processInsert;

    if (!checkUpdatable({})) return;

    processInsert({});

}
//------
function click_lyrMenu_복사(ui) {

    v_global.process.handler = processCopy;

    if (!checkUpdatable({})) return;

    processCopy({});

}
//------
function click_lyrMenu_삭제(ui) {

    if (!checkManipulate({})) return;

    v_global.process.handler = processRemove;

    checkRemovable({});

}
//------ del by kyt 2021-05-26
/*function click_lyrMenu_저장(ui) {

    processSave({});

}*/
//------
function click_lyrMenu_닫기(ui) {

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//------
function click_lyrMenu_모델_추가(ui) {

    if (!checkManipulate({})) return;

    processModel({});

}
//------
function click_lyrMenu_모델_수정(ui) {

    if (!checkManipulate({})) return;
    if (gw_com_api.getSelectedRow("grdData_모델") == null) {
        gw_com_api.messageBox([
            { text: "선택된 대상이 없습니다." }
        ], 300);
        return false;
    }

    processModel({ modify: true });

}
//------
function click_lyrMenu_모델_삭제(ui) {

    if (!checkManipulate({})) return;

    var args = { targetid: "grdData_모델", row: "selected" }
    gw_com_module.gridDelete(args);

}
//------
function itemchanged_frmData_내역(ui) {

    switch (ui.element) {
        case "act_region1":
        case "act_region2":
        case "act_region3":
            {
                var em = "act_module" + ui.element.substr(ui.element.length - 1, 1);
                gw_com_api.setValue(ui.object, ui.row, em, "");
                gw_com_api.setValue(ui.object, ui.row, em + '_etc', "");
                chkECCB_TP({ col: "region" });
            }
            break;
        case "act_time_sel":
        case "act_module1_sel":
        case "act_module2_sel":
        case "act_module3_sel":
        case "mp_class1_sel":
        case "mp_class2_sel":
        case "mp_class3_sel":
            {
                var em = ui.element.substr(0, ui.element.length - 4);
                gw_com_api.setValue(ui.object, ui.row, em + '_etc', "");
                gw_com_api.setValue(ui.object, ui.row, em, (ui.value.current == "1000") ? "" : ui.value.current);
            }
            break;
        case "act_time_etc":
        case "act_module1_etc":
        case "act_module2_etc":
        case "act_module3_etc":
        case "mp_class1_etc":
        case "mp_class2_etc":
        case "mp_class3_etc":
            {
                var em = ui.element.substr(0, ui.element.length - 4);
                if (gw_com_api.getValue(ui.object, ui.row, em + "_sel") == 1000)
                    gw_com_api.setValue(ui.object, ui.row, em, ui.value.current);
            }
            break;
        case "eccb_tp":
            {
                chkECCB_TP({ col: "eccb_tp" });
            }
            break;
    }

};
//------
function itemdblclick_frmData_내역(ui) {

    if (gw_com_module.v_Object[ui.object].option[ui.element].edit == false) return;
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    var args;
    var page = "DLG_CODE";
    var title = "코드선택";
    var width = 500;
    var height = 300;
    var id = gw_com_api.v_Stream.msg_openedDialogue;

    switch (ui.element) {
        case "ecr_tp_nm":
            {
                v_global.logic.popup_data = {
                    hcode: "ECCB02",
                    multi: false
                };
                v_global.event.value = "ecr_tp";
            }
            break;
        case "crm_tp_nm":
            {
                v_global.logic.popup_data = {
                    hcode: "ECCB13",
                    multi: false
                };
                v_global.event.value = "crm_tp";
            }
            break;
        case "act_time_text":
            {
                v_global.logic.popup_data = {
                    hcode: "ECCB10",
                    multi: false
                };
                v_global.event.value = "act_time";
            }
            break;
        default:
            {
                return;
            }
            break;
    }

    args = {
        type: "PAGE", page: page, title: title,
        width: width, height: height, scroll: true, open: true, control: true, locate: ["center", "center"]
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: id,
            data: v_global.logic.popup_data
        }
        gw_com_module.dialogueOpen(args);
    }

}
//------
function itemdblclick_frmData_메모F(ui) {

    if (!checkEditable({})) return;
    if (!checkManipulate({})) return;

    v_global.logic.memo = "개선 사항";
    processMemo({ type: ui.type, object: ui.object, row: ui.row, element: "memo_html", html: true });
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : check
//------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_내역");

}
//------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_첨부" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkCRMDept(arg_crm_dept, arg_dept_cd) {

    var rtn = false;
    $.ajax({
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=w_eccb1010_crm_dept_chk" +
            "&QRY_COLS=crm_dept_yn" +
            "&CRUD=R" +
            "&arg_crm_dept=" + arg_crm_dept +
            "&arg_dept_cd=" + arg_dept_cd,
        type: 'post',
        cache: false,
        async: false,
        data: "{}",
        success: function (data, status) {
            var response = JSON.parse(data);
            if (response.iCode == 0)
                rtn = response.tData[0].DATA[0] == "1" ? true : false;
        }
    });
    return rtn;

}
//----------
function chkECCB_TP(param) {

    var act_region1 = gw_com_api.getValue("frmData_내역", 1, "act_region1");
    var eccb_tp = gw_com_api.getValue("frmData_내역", 1, "eccb_tp");

    // LCCB 분류1 고정 : Logic
    if (param.col == "eccb_tp") {
        if (eccb_tp == "L" && act_region1 != "60")
            gw_com_api.setValue("frmData_내역", 1, "act_region1", "60");
        else if (eccb_tp != "L" && act_region1 == "60")
            gw_com_api.setValue("frmData_내역", 1, "act_region1", "");

    }
    else if (param.col == "region") {
        if (eccb_tp != "L" && act_region1 == "60")
            gw_com_api.setValue("frmData_내역", 1, "eccb_tp", "L");
        else if (eccb_tp == "L" && act_region1 != "60")
            gw_com_api.setValue("frmData_내역", 1, "eccb_tp", "");
    }

    // SCCB 분류1 고정 : S/W
    if ((act_region1 == "20" || act_region1 == "T20") && eccb_tp != "S")
        gw_com_api.setValue("frmData_내역", 1, "eccb_tp", "S");
    else if (!(act_region1 == "20" || act_region1 == "T20") && eccb_tp == "S")
        gw_com_api.setValue("frmData_내역", 1, "eccb_tp", "");

    // LCCB의 경우 CRM 제외
    if (gw_com_api.getValue("frmData_내역", 1, "eccb_tp") == "L") {
        gw_com_api.setValue("frmData_내역", 1, "rqst_dept", "-");
        gw_com_api.hide("frmData_내역", "label_rqst_dept");
        gw_com_api.hide("frmData_내역", "rqst_dept");
        gw_com_api.hide("frmData_내역", "mp_class1_sel");
        gw_com_api.hide("frmData_내역", "mp_class1_etc");
        gw_com_api.hide("frmData_내역", "mp_class2_sel");
        gw_com_api.hide("frmData_내역", "mp_class2_etc");
        gw_com_api.hide("frmData_내역", "mp_class3_sel");
        gw_com_api.hide("frmData_내역", "mp_class3_etc");
    }
    else {
        gw_com_api.show("frmData_내역", "label_rqst_dept");
        gw_com_api.show("frmData_내역", "rqst_dept");
        gw_com_api.show("frmData_내역", "mp_class2_sel");
        gw_com_api.show("frmData_내역", "mp_class2_etc");
        gw_com_api.show("frmData_내역", "mp_class3_sel");
        gw_com_api.show("frmData_내역", "mp_class3_etc");
    }
}
//------
function NullToEmpty(org) {

    return org == null ? "" : org;

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : file
// 2021-05-17 by KYT
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ECR" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_첨부" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? "%" : param.data_key) },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? -1 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? -1 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.data_key
    };
    gw_com_module.objRetrieve(args);

}
//2021-05-17 by KYT
function click_lyrMenu_첨부_추가(ui) {

    //if (!checkManipulate({})) return;
    //if (!checkUpdatable({ check: true })) return false;

    //var args = {
    //    type: "PAGE", page: "w_upload_eccb", title: "파일 업로드",
    //    width: 650, height: 200, open: true  //,locate: ["center", 600]

    //};
    //if (gw_com_module.dialoguePrepare(args) == false) {
    //    var args = {
    //        page: "w_upload_eccb",
    //        param: {
    //            ID: gw_com_api.v_Stream.msg_upload_ECCB,
    //            data: {
    //                user: gw_com_module.v_Session.USR_ID,
    //                key: gw_com_api.getValue("frmData_내역", 1, "ecr_no"),
    //                seq: 1
    //            }
    //        }
    //    };
    //        gw_com_module.dialogueOpen(args);
    //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
    //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

    // Check Updatable
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;


    // set data for "File Upload"
    // set data for "File Upload"
    var dataType = "ECR";    // Set File Data Type
    var dataKey = v_global.logic.key;   // Main Key value for Search
    var dataSeq = 1;   // Main Seq value for Search

    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq, user: gw_com_module.v_Session.USR_ID }; // additional data = { data_subkey: "", data_subseq:-1 }

    // set Argument for Dialogue
    var pageArgs = dataType + ":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 660, height: 350, scroll: true,  // multi( h:350, scroll) / single(h:300)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);
}
//------
function click_lyrMenu_첨부_삭제(ui) {

    if (!checkManipulate({})) return;

    var args = { targetid: "grdData_첨부", row: "selected" }
    gw_com_module.gridDelete(args);

}
//----------
function click_grdData_첨부_download(ui) {

    var args = {
        source: {
            id: "grdData_첨부",
            row: ui.row
        },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//------
function processFile(param) {

    var args = { source: { id: param.object, row: param.row }, targetid: "lyrDown" };
    gw_com_module.downloadFile(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : retrieve
//------
function processRetrieve(param) {
    //find
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_ecr_no", value: param.key }
            ]
        },
        key: param.key
    };
    if (param.copy == true) {
        args.updatable = true;
        args.target = [
            { type: "FORM", id: "frmData_내역", query: "w_eccb1010_M_1_copy", crud: "insert", edit: true },
            { type: "GRID", id: "grdData_모델", query: "w_eccb1010_S_1_copy", crud: "insert", edit: true },
            { type: "FORM", id: "frmData_메모F", query: "w_eccb1010_S_2_3_copy", crud: "insert" }
        ];
        args.handler = {
            complete: successCopy
        };
    }
    else {
        args.target = [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            /*{ type: "GRID", id: "grdData_첨부" },*/
            { type: "GRID", id: "grdData_문서" }
        ];
        args.handler = {
            complete: processRetrieveEnd, param: { key: param.key }
        };
    }
    gw_com_module.objRetrieve(args);
    processFileList({ data_key: param.key });

}
//----------
function processRetrieveEnd(param) {

    //var act_module1_etc = gw_com_api.getValue("frmData_내역", 1, "act_module1_etc");
    //var act_module2_etc = gw_com_api.getValue("frmData_내역", 1, "act_module2_etc");
    //var act_module3_etc = gw_com_api.getValue("frmData_내역", 1, "act_module3_etc");
    //gw_com_api.filterSelect("frmData_내역", 1, "act_module1_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region1"] });
    //gw_com_api.filterSelect("frmData_내역", 1, "act_module2_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region2"] });
    //gw_com_api.filterSelect("frmData_내역", 1, "act_module3_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region3"] });
    //gw_com_api.setValue("frmData_내역", 1, "act_module1_etc", act_module1_etc);
    //gw_com_api.setValue("frmData_내역", 1, "act_module2_etc", act_module2_etc);
    //gw_com_api.setValue("frmData_내역", 1, "act_module3_etc", act_module3_etc);
    //gw_com_api.setCRUD("frmData_내역", 1, "retrieve");
    
}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "GRID", id: "grdData_문서" }
        ]
    };
    gw_com_module.objClear(args);

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
// Custom Function : Edit
//------
function processCopy(param) {

    if (param.sub) {
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_root_no", value: param.key },
                    { name: "arg_root_seq", value: param.seq }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_모델", query: "w_eccb1010_I_1", crud: "insert" },
                { type: "FORM", id: "frmData_메모F", query: "w_eccb1010_I_2_3", crud: "insert" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.master) {
        var args = {
            targetid: "frmData_내역",
            edit: true,
            updatable: true,
            data: [
                { name: "ecr_title", value: param.data.ecr_title },
                { name: "ecr_desc", value: param.data.ecr_desc },
                { name: "ecr_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "ecr_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "ecr_dt", value: gw_com_api.getDate("") },
                { name: "rqst_dept", value: param.data.rqst_dept },
                { name: "act_time", value: param.data.act_time },
                { name: "act_time_sel", value: param.data.act_time_sel },
                { name: "act_time_etc", value: param.data.act_time_etc },
                { name: "act_region1", value: param.data.act_region1 },
                { name: "act_region2", value: param.data.act_region2 },
                { name: "act_region3", value: param.data.act_region3 },
                { name: "act_module1", value: param.data.act_module1 },
                { name: "act_module2", value: param.data.act_module2 },
                { name: "act_module3", value: param.data.act_module3 },
                { name: "act_module1_sel", value: param.data.act_module1_sel },
                { name: "act_module2_sel", value: param.data.act_module2_sel },
                { name: "act_module3_sel", value: param.data.act_module3_sel },
                { name: "act_module1_etc", value: param.data.act_module1_etc },
                { name: "act_module2_etc", value: param.data.act_module2_etc },
                { name: "act_module3_etc", value: param.data.act_module3_etc },
                { name: "mp_class1", value: param.data.mp_class1 },
                { name: "mp_class2", value: param.data.mp_class2 },
                { name: "mp_class3", value: param.data.mp_class3 },
                { name: "mp_class1_sel", value: param.data.mp_class1_sel },
                { name: "mp_class2_sel", value: param.data.mp_class2_sel },
                { name: "mp_class3_sel", value: param.data.mp_class3_sel },
                { name: "mp_class1_etc", value: param.data.mp_class1_etc },
                { name: "mp_class2_etc", value: param.data.mp_class2_etc },
                { name: "mp_class3_etc", value: param.data.mp_class3_etc },
                { name: "act_effect", value: param.data.act_effect }
            ],
            clear: [
                { type: "GRID", id: "grdData_첨부" }
            ]
        };
        gw_com_module.formInsert(args);
        processCopy({ sub: true, key: param.data.ecr_no, seq: 1 });
    }
    else {
        var args = {
            type: "PAGE", page: "w_find_ecr", title: "ECR 복사",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_ecr",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectECR,
                    data: {
                        type: "copy",
                        cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                        my_dept_area: gw_com_module.v_Session.DEPT_AREA
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//------
function successCopy(response, param) {

    gw_com_api.setValue("frmData_내역", 1, "ecr_emp", gw_com_module.v_Session.EMP_NO);
    gw_com_api.setValue("frmData_내역", 1, "ecr_emp_nm", gw_com_module.v_Session.USR_NM);
    gw_com_api.setValue("frmData_내역", 1, "ecr_dept", gw_com_module.v_Session.DEPT_CD);
    gw_com_api.setValue("frmData_내역", 1, "ecr_dept_nm", gw_com_module.v_Session.DEPT_NM);
    gw_com_api.setValue("frmData_내역", 1, "ecr_dt", gw_com_api.getDate(""));
    gw_com_api.setValue("frmData_내역", 1, "pstat", "ECR");
    gw_com_api.setValue("frmData_내역", 1, "astat", 10);

    //var act_module1_etc = gw_com_api.getValue("frmData_내역", 1, "act_module1_etc");
    //var act_module2_etc = gw_com_api.getValue("frmData_내역", 1, "act_module2_etc");
    //var act_module3_etc = gw_com_api.getValue("frmData_내역", 1, "act_module3_etc");
    //gw_com_api.filterSelect("frmData_내역", 1, "act_module1_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region1"] });
    //gw_com_api.filterSelect("frmData_내역", 1, "act_module2_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region2"] });
    //gw_com_api.filterSelect("frmData_내역", 1, "act_module3_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region3"] });
    //gw_com_api.setValue("frmData_내역", 1, "act_module1_etc", act_module1_etc);
    //gw_com_api.setValue("frmData_내역", 1, "act_module2_etc", act_module2_etc);
    //gw_com_api.setValue("frmData_내역", 1, "act_module3_etc", act_module3_etc);

}
//------
function processInsert(param) {

    var args = {
        targetid: "frmData_내역", edit: true, updatable: true,
        data: [
            { name: "ecr_emp", value: gw_com_module.v_Session.EMP_NO },
            { name: "ecr_dept", value: gw_com_module.v_Session.DEPT_CD },
            { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
            { name: "ecr_dt", value: gw_com_api.getDate("") },
            { name: "issue_no", value: v_global.logic.issue_no },
            { name: "rqst_dept", value: "-" },
            { name: "mp_class1_sel", value: "-" },
            { name: "pstat", value: "ECR" },
            { name: "astat", value: "10" },
            { name: "ecr_title", value: "예시) 어떤 Parts에 무엇을 개선" },
            { name: "ecr_desc", value: "예시) 어떤 설비에 무엇이 문제가 되어 이렇게 개선하고자 함" }
        ],
        clear: [
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "GRID", id: "grdData_문서" }
        ]
    };
    gw_com_module.formInsert(args);
    var args = {
        target: [
            { type: "FORM", id: "frmData_메모F", query: "w_eccb1010_I_2_3_D", crud: "insert" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//------
function processDelete(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "GRID", id: "grdData_문서" }
        ]
    };
    gw_com_module.objClear(args);

}
//------
function processModel(param) {

    v_global.logic.modeling = param.modify;
    if (param.modify) {
        var args = {
            type: "PAGE", page: "w_find_prod_eccb", title: "제품 모델 선택",
            width: 950, height: 460, open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_prod_eccb",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectProduct_ECCB
                }
            };
            args.param.data = {
                dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
                prod_type_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_type_nm", true),
                cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
                cust_dept: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true),
                cust_proc: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true),
                cust_dept_nm: gw_com_api.getValue("grdData_모델", "selected", "cust_dept_nm", true),
                cust_proc_nm: gw_com_api.getValue("grdData_모델", "selected", "cust_proc_nm", true),
                //prod_cd: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true),
                prod_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true),
                prod_key: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true),
                proj_no: gw_com_api.getValue("grdData_모델", "selected", "proj_no", true),
                cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                my_dept_area: gw_com_module.v_Session.DEPT_AREA
            }
            gw_com_module.dialogueOpen(args);
        }
    }    
    else{
        var args = {
            type: "PAGE", page: "w_find_prod_eccb_multi", title: "제품 모델 선택",
            width: 950, height: 460, open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_prod_eccb_multi",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectProduct_ECCB
                }
            };
            args.param.data = {
                cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                my_dept_area: gw_com_module.v_Session.DEPT_AREA
            };
            gw_com_module.dialogueOpen(args);
        }
    }
    
}
//------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            page: "DLG_EDIT_HTML",
            option: "width=900,height=600,left=300,resizable=1",
            data: {
                title: v_global.logic.memo,
                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
            }
        };
        gw_com_api.openWindow(args);
    }

}
//----------
function processSave(param) {

    var err = false;
    gw_com_api.setError(false, "frmData_내역", 1, "act_time_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "act_module1_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "act_module2_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "act_module3_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "mp_class1_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "mp_class2_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "mp_class3_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "prod_tp");

    var act_region1 = NullToEmpty(gw_com_api.getValue("frmData_내역", 1, "act_region1"));
    var act_region2 = NullToEmpty(gw_com_api.getValue("frmData_내역", 1, "act_region2"));
    var act_region3 = NullToEmpty(gw_com_api.getValue("frmData_내역", 1, "act_region3"));

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_첨부" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (act_region1 == "20" || act_region2 == "20" || act_region3 == "20") {
        if ((act_region1 != "20" && act_region1 != "") || (act_region2 != "20" && act_region2 != "") || (act_region3 != "20" && act_region3 != "")) {
            gw_com_api.messageBox([
                { text: "S/W와 비S/W는 함께 등록할 수 없습니다." }
            ]);
            return false;
        }
    }

    var sEccbTp = gw_com_api.getValue("frmData_내역", 1, "eccb_tp");
    // SCCB일경우 설비유형 필수입력
    if (sEccbTp == "S" && gw_com_api.getValue("frmData_내역", 1, "prod_tp") == "") {
        gw_com_api.setError(true, "frmData_내역", 1, "prod_tp");
        return false;
    }
    // CRM 부서 선택 : LCCB는 제외
    if (sEccbTp != "L" && gw_com_api.getValue("frmData_내역", 1, "rqst_dept") == "-") {
        gw_com_api.setError(true, "frmData_내역", 1, "rqst_dept");
        gw_com_api.messageBox([{ text: "CRM 부서를 선택해 주십시오." }]);
        return false;
    }


    if (gw_com_api.getValue("frmData_내역", 1, "act_module1_sel") == "00") {
        gw_com_api.setError(true, "frmData_내역", 1, "act_module1_sel");
        gw_com_api.messageBox([ { text: "[분류2]가 입력되지 않았습니다." } ]);
        return false;
    }

    if (gw_com_api.getValue("frmData_내역", 1, "act_time_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_time_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_time_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "act_module1_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_module1_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_module1_etc");
    }
    if (sEccbTp != "L") {
        if (gw_com_api.getValue("frmData_내역", 1, "act_module2_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_module2_etc") == "") {
            err = true;
            gw_com_api.setError(true, "frmData_내역", 1, "act_module2_etc");
        }
        if (gw_com_api.getValue("frmData_내역", 1, "act_module3_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_module3_etc") == "") {
            err = true;
            gw_com_api.setError(true, "frmData_내역", 1, "act_module3_etc");
        }
        if (gw_com_api.getValue("frmData_내역", 1, "mp_class1_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "mp_class1_etc") == "") {
            err = true;
            gw_com_api.setError(true, "frmData_내역", 1, "mp_class1_etc");
        }
        if (gw_com_api.getValue("frmData_내역", 1, "mp_class2_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "mp_class2_etc") == "") {
            err = true;
            gw_com_api.setError(true, "frmData_내역", 1, "mp_class2_etc");
        }
        if (gw_com_api.getValue("frmData_내역", 1, "mp_class3_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "mp_class3_etc") == "") {
            err = true;
            gw_com_api.setError(true, "frmData_내역", 1, "mp_class3_etc");
        }
    }
    if (err) {
        gw_com_api.messageBox([
                { text: "[기타]에 대한 내용이 입력되지 않았습니다." }
        ]);
        return false;
    }

    if (gw_com_api.getValue("frmData_내역", 1, "astat") == "00")
        gw_com_api.setValue("frmData_내역", 1, "astat", "10");

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역", key: { element: [{ name: "ecr_no" }] } }
        ],
        handler: { success: successRemove }
    };
    gw_com_module.objRemove(args);

}
//----------
function processApprove(param) {

    //add by kyt 2021-05-26
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    var err = false;

    // 제품모델 입력 확인
    var RowCnt = gw_com_api.getRowCount("grdData_모델");
    if (RowCnt < 1) err = true;
    else {
        var strTemp = gw_com_api.getValue("grdData_모델", 1, "prod_type", true);
        if (strTemp == "undefined" || strTemp == "") err = true;
    }
    if (err) {
        gw_com_api.messageBox([{ text: "적용 제품모델 선택 후 상신바랍니다." }]);
        return false;
    }

    // 내역 필수입력 확인
    var args = { target: [{ type: "FORM", id: "frmData_내역", check: true }] };
    if (gw_com_module.objValidate(args) == false) {
        var args = { targetid: "frmData_내역", edit: true };
        gw_com_module.formEdit(args);
        return false;
    }

    // CRM부서는 결재 X : LCCB는 CRM 제외
    if (gw_com_api.getValue("frmData_내역", 1, "eccb_tp") != "L" &&
        checkCRMDept(gw_com_api.getValue("frmData_내역", 1, "rqst_dept"), gw_com_module.v_Session.DEPT_CD) )
    {

        gw_com_api.showMessage("CRM 작성 후 해당 화면에서 상신하시기 바랍니다.\n\n확인 버튼을 누르면 CRM 작성 화면으로 이동합니다.");
        var args = {
            ID: gw_com_api.v_Stream.msg_linkPage,
            to: {
                type: "MAIN"
            },
            data: {
                page: "w_eccb1051",
                title: "CRM 등록",
                param: [
                    { name: "crm_no", value: gw_com_api.getValue("frmData_내역", 1, "crm_no") },
                    { name: "ecr_no", value: v_global.logic.key },
                    { name: "issue_no", value: gw_com_api.getValue("frmData_내역", 1, "issue_no") }
                ]
            }
        };
        gw_com_module.streamInterface(args);

        var args = {
            url: "COM",
            procedure: "PROC_ECR_STAT",
            nomessage: true,
            input: [
                { name: "ecr_no", value: v_global.logic.key, type: "varchar" },
                { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" },
                { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ]
        };
        gw_com_module.callProcedure(args);
        processClose({});

    } else {

        var status = gw_com_api.getValue("frmData_내역", 1, "gw_astat_nm", false, true);
        //if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
        var approval = gw_com_api.getValue("frmData_내역", 1, "approval");
        if (approval != "1") {
            gw_com_api.messageBox([
                { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
            ], 420);
            return false;
        }

        if (gw_com_site.v_gw_auth) {
            var args = {
                page: "IFProcess",
                param: {
                    ID: gw_com_api.v_Stream.msg_authSystem,
                    data: {
                        system: "GROUPWARE",
                        name: gw_com_module.v_Session.GW_ID,
                        encrypt: { password: true },
                        param: param
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        } else {
            var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
            var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
            gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
            var title = gw_com_api.getValue("frmData_내역", 1, "ecr_title") + "(" + v_global.logic.key + ")";
            var args = {
                ecr_no: v_global.logic.key,
                gw_key: gw_key,
                gw_seq: gw_seq,
                title: title
            };
            gw_com_site.gw_appr_ecr(args);
        }

    }

}
//----------
function processPrint(param) {

    window.open("/Job/w_link_eccb_print.aspx?data_key=" + v_global.logic.key, "", "");

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function successSave(response, param) {

    v_global.logic.issue_no = "";
    var IsEnd = false;
    $.each(response, function () {
        var query = this.QUERY;
        $.each(this.KEY, function () {
            if (IsEnd) return;
            if (this.NAME == "ecr_no"
                || (this.NAME == "root_no"
                    && (query == "w_eccb1010_S_1" || query == "w_eccb1010_S_2_1" || query == "w_eccb1010_S_2_2" || query == "w_eccb1010_S_2_3"))) {
                v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key });
                IsEnd = true;
            }
        });
    });

}
//----------
function successRemove(response, param) {

    processDelete({});

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
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
        case gw_com_api.v_Stream.msg_selectedECR:
            {
                processCopy({ master: true, data: param.data });
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_ECCB:
            {
                if (v_global.logic.modeling) {
                    gw_com_api.setValue("grdData_모델", "selected", "prod_type_nm", (param.data.prod_type != "%") ? param.data.prod_type_nm : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_type", (param.data.prod_type != "%") ? param.data.prod_type : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_cd", (param.data.cust_cd != "%") ? param.data.cust_cd : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_nm", (param.data.cust_cd != "%") ? param.data.cust_nm : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_dept", (param.data.cust_dept != "%") ? param.data.cust_dept : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_proc", (param.data.cust_proc != "%") ? param.data.cust_proc : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_dept_nm", (param.data.cust_dept != "%") ? param.data.cust_dept_nm : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_proc_nm", (param.data.cust_proc != "%") ? param.data.cust_proc_nm : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_key", (param.data.prod_cd != "") ? param.data.prod_key : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_cd", (param.data.prod_cd != "") ? param.data.prod_cd : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_nm", (param.data.prod_cd != "") ? param.data.prod_nm : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "proj_no", (param.data.proj_no != "") ? param.data.proj_no : " ", true);
                    if (gw_com_api.getCRUD("grdData_모델", "selected", true) == "retrieve")
                        gw_com_api.setUpdatable("grdData_모델", gw_com_api.getSelectedRow("grdData_모델"), true);
                }
                else if (param.multi) {
                    var args = {
                        targetid: "grdData_모델", edit: true, updatable: true,
                        data: [
                            { name: "root_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no") },
                            { name: "root_seq", value: 1 }
                        ]
                    };
                    $.each(param.data, function () {
                        if (this.prod_type != "%" && this.prod_type != undefined) {
                            args.data.push({ name: "prod_type", value: this.prod_type });
                            args.data.push({ name: "prod_type_nm", value: this.prod_type_nm });
                        }
                        if (this.cust_cd != "%" && this.cust_cd != undefined) {
                            args.data.push({ name: "cust_cd", value: this.cust_cd });
                            args.data.push({ name: "cust_nm", value: this.cust_nm });
                        }
                        if (this.cust_dept != "%" && this.cust_dept != undefined) {
                            args.data.push({ name: "cust_dept", value: this.cust_dept });
                            args.data.push({ name: "cust_dept_nm", value: this.cust_dept_nm });
                        }
                        if (this.cust_proc != "%" && this.cust_proc != undefined) {
                            args.data.push({ name: "cust_proc", value: this.cust_proc });
                            args.data.push({ name: "cust_proc_nm", value: this.cust_proc_nm });
                        }
                        if (this.prod_key != undefined && this.prod_key != "") {
                            args.data.push({ name: "prod_key", value: this.prod_key });
                            args.data.push({ name: "prod_cd", value: this.prod_cd });
                            args.data.push({ name: "prod_nm", value: this.prod_nm });
                            args.data.push({ name: "proj_no", value: this.proj_no });
                        }
                        if(this != window)
                            gw_com_module.gridInsert(args);
                    });
                    
                }
                else {
                    var args = {
                        targetid: "grdData_모델", edit: true, updatable: true,
                        data: [
                            { name: "root_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no") },
                            { name: "root_seq", value: 1 }
                        ]
                    };
                    if (param.data.prod_type != "%" && param.data.prod_type != undefined) {
                        args.data.push({ name: "prod_type", value: param.data.prod_type });
                        args.data.push({ name: "prod_type_nm", value: param.data.prod_type_nm });
                    }
                    if (param.data.cust_cd != "%" && param.data.cust_cd != undefined) {
                        args.data.push({ name: "cust_cd", value: param.data.cust_cd });
                        args.data.push({ name: "cust_nm", value: param.data.cust_nm });
                    }
                    if (param.data.cust_dept != "%" && param.data.cust_dept != undefined) {
                        args.data.push({ name: "cust_dept", value: param.data.cust_dept });
                        args.data.push({ name: "cust_dept_nm", value: param.data.cust_dept_nm });
                    }
                    if (param.data.cust_proc != "%" && param.data.cust_proc != undefined) {
                        args.data.push({ name: "cust_proc", value: param.data.cust_proc });
                        args.data.push({ name: "cust_proc_nm", value: param.data.cust_proc_nm });
                    }
                    if (param.data.prod_key != undefined && param.data.prod_key != "") {
                        args.data.push({ name: "prod_key", value: param.data.prod_key });
                        args.data.push({ name: "prod_cd", value: param.data.prod_cd });
                        args.data.push({ name: "prod_nm", value: param.data.prod_nm });
                        args.data.push({ name: "proj_no", value: param.data.prod_nm });
                    }
                    if (param.data != window)
                        gw_com_module.gridInsert(args);
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
                                        param.data.html);
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "memo_text",
                                        param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_ecr_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no") },
                            { name: "arg_seq", value: 1 }
                        ]
                    },
                    target: [
                        {
                            type: "GRID",
                            id: "grdData_첨부",
                            select: true
                        }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var detp_area = gw_com_api.getValue("frmData_내역", 1, "dept_area");
                var ecr_tp = gw_com_api.getValue("frmData_내역", 1, "ecr_tp");
                var args = {
                    ecr_no: v_global.logic.key,
                    ecr_tp: ecr_tp,
                    dept_area: detp_area,
                    gw_user: param.data.name,
                    gw_pass: param.data.password,
                    gw_key: gw_key,
                    gw_seq: gw_seq
                };
                gw_com_site.gw_appr_ecr(args);
                processRetrieve({ key: v_global.logic.key });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "w_find_ecr":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectECR;
                            args.data = {
                                type: "copy",
                                cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                                my_dept_area: gw_com_module.v_Session.DEPT_AREA
                            };
                        } break;
                    case "w_find_prod_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_ECCB;
                            if (v_global.logic.modeling)
                                args.data = {
                                    prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
                                    prod_type_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_type_nm", true),
                                    cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
                                    cust_dept: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true),
                                    cust_proc: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true),
                                    //prod_cd: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true),
                                    prod_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true),
                                    prod_key: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true),
                                    proj_no: gw_com_api.getValue("grdData_모델", "selected", "proj_no", true),
                                    cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                                    my_dept_area: gw_com_module.v_Session.DEPT_AREA
                                };
                            else
                                args.data = {
                                    cur_dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area", false),
                                    my_dept_area: gw_com_module.v_Session.DEPT_AREA
                                };
                        }
                        break;
                    case "w_edit_html_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_HTML;
                            args.data = {
                                edit: true,
                                title: v_global.logic.memo,
                                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                            };
                        }
                        break;

                    //2021-05-18 by KYT
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "DLG_CODE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_CODE":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.dname, v_global.event.type == "GRID" ? true : false);
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.value, param.data.dcode, v_global.event.type == "GRID" ? true : false);
                            }
                        }
                        break;

                    //2021-05-17 by KYT
                    case "SYS_FileUpload":
                        {
                            processFileList({ data_key: v_global.logic.key });
                        }
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
    }

}
