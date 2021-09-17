
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인", width: 430, height: 90, locate: ["center", 100] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "w_edit_memo", title: "중단사유", width: 790, height: 585, locate: ["center", 100] };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB42" }
                //    ]
                //},
                {
                    type: "PAGE", name: "분류1", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB05" }
                    ]
                },
                //{
                //    type: "PAGE", name: "분류2", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB06" }
                //    ]
                //},
                { type: "PAGE", name: "분류2", query: "dddw_ecr_module" },
                {
                    type: "PAGE", name: "분류3", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB07" }
                    ]
                },
                //{
                //    type: "PAGE", name: "도면조치", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB38" }
                //    ]
                //},
                {
                    type: "PAGE", name: "조치시점", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB10" }
                    ]
                },
                //{ type: "PAGE", name: "부서", query: "dddw_dept" },
                //{ type: "PAGE", name: "사원", query: "dddw_emp" },
                {
                    type: "INLINE", name: "도면구분",
                    data: [
                        { title: "Part", value: "PART" },
                        { title: "Ass'y", value: "ASSY" }
                    ]
                },
                {
                    type: "PAGE", name: "ECCB35", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB35" }
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
                //{ name: "미리보기", value: "미리보기", icon: "출력" },
                //{ name: "통보", value: "업체통보", icon: "기타" },
                { name: "상신", value: "결재상신", icon: "기타" },
                { name: "중단", value: "중단", icon: "기타" },
                { name: "취소", value: "중단취소", icon: "기타" },
                { name: "추가", value: "추가" },
                { name: "저장", value: "저장" },
                { name: "삭제", value: "삭제" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        // 적용 모델
        var args = {
            targetid: "lyrMenu_모델", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "수정", value: "수정", icon: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        // 설변 도면
        var args = {
            targetid: "lyrMenu_도면", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        // 적용 PJT
        var args = {
            targetid: "lyrMenu_PJT", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        // 첨부 문서
        var args = {
            targetid: "lyrMenu_첨부", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmMenu_APART", type: "FREE",
            trans: false, border: true, show: true, align: "left",
            content: {
                row: [
                    { element: [
                        { name: "chk_apart", label: { title: "품목등록 :" }, value: "1",
                          editable: { type: "checkbox", value: "1", offval: "0" } }
                    ] }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        // 단종 Part
        var args = {
            targetid: "lyrMenu_APART", type: "FREE",
            element: [
                //{ name: "조회", value: "ERP재고현황 보기" },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        // 교체 Part
        var args = {
            targetid: "lyrMenu_BPART", type: "FREE",
            element: [
                { name: "조회", value: "ERP재고현황 보기" },
                { name: "추가2", value: "임의추가", icon: "추가", updatable: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrFileNotice",
            row: [
                { name: "알림", color: "red" }
            ]
        };
        gw_com_module.labelCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "lyrMenu_evl",
        //    type: "FREE",
        //    element: [
        //      { name: "평가", value: "제안평가", icon: "추가", updatable: true }
        //    ]
        //};
        //gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내역", query: "w_eccb4010_M_2", type: "TABLE", title: "ECO 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "eco_title", validate: true },
            content: {
                width: { label: 100, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "ECO No.", format: { type: "label" } },
                            { name: "eco_no", editable: { type: "hidden" } },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "ecr_no", editable: { type: "hidden" } },
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm", editable: { type: "hidden" }, display: true },
                            { name: "dept_area", hidden: true, editable: { type: "hidden" } },
                            { name: "cip_no", hidden: true, editable: { type: "hidden" } },
                            { name: "root_no", hidden: true, editable: { type: "hidden" } },
                            { name: "root_seq", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "eco_title",
                                format: { width: 628 },
                                editable: { type: "text", width: 626 }
                            },
                            { header: true, value: "구분", format: { type: "label" } },
                            { name: "ecr_tp_nm", editable: { type: "hidden" }, display: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개요", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "eco_desc",
                                format: { width: 628 },
                                editable: { type: "text", width: 626 }
                            },
                            { header: true, value: "Level", format: { type: "label" } },
                            { name: "crm_tp_nm", editable: { type: "hidden" }, display: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용시점", format: { type: "label" } },
                            {
                                name: "act_time", style: { colspan: 3, colfloat: "float" },
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "조치시점" }, validate: { rule: "required", message: "적용요구시점" } }
                            },
                            { name: "act_time_text", style: { colfloat: "floating" }, format: { width: 300 } },
                            //{
                            //    name: "act_time_text", mask: "search", display: true, style: { colspan: 3, colfloat: "float" },
                            //    format: { width: 636 },
                            //    editable: { type: "text", width: 634, validate: { rule: "required", message: "적용요구시점" } }
                            //},
                            //{ name: "act_time", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            {
                                style: { colfloat: "float" }, name: "eco_emp_nm",
                                format: { width: 60 },
                                editable: { type: "hidden", width: 60 }, display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "eco_dept_nm",
                                editable: { type: "hidden" }, display: true
                            },
                            { name: "eco_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "eco_dept", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "label_rqst_dept_nm", value: "CRM부서", format: { type: "label" } },
                            {
                                name: "rqst_dept_nm", style: { colspan: 3 },
                                editable: { type: "hidden" }, display: true
                            },
                            { header: true, value: "작성일자", format: { type: "label" } },
                            { name: "eco_dt", mask: "date-ymd", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { style: { rowspan: 3 }, header: true, value: "분류", format: { type: "label" } },
                            {
                                name: "act_region1", format: { width: 0 },
                                style: { colspan: 5, colfloat: "float" },
                                editable: {
                                    type: "select", width: 155, validate: { rule: "required" },
                                    data: { memory: "분류1", unshift: [{ title: "", value: "" }] },
                                    change: [{ name: "act_module1_sel", memory: "분류2", unshift: [{ title: "", value: "" }], key: ["dept_area", "act_region1"] }]
                                }
                            },
                            { style: { colfloat: "floating" }, name: "act_region1_text", format: { width: 200 } },
                            { style: { colfloat: "floating" }, name: "act_module1_text", format: { width: 300 } },
                            {
                                style: { colfloat: "floating" }, display: true,
                                name: "act_module1_sel", format: { width: 0 },
                                editable: {
                                    type: "select",
                                    data: { memory: "분류2", unshift: [{ title: "-", value: "" }] },
                                    key: ["dept_area", "act_region1"], width: 155
                                }
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module1_etc",
                                format: { width: 0 }, display: true,
                                editable: { type: "text", width: 155 }
                            },
                            { name: "act_module1", hidden: true, editable: { type: "hidden" } },
                            { style: { colfloat: "floating" }, name: "mp_class1_text", format: { width: 200 } },
                            {
                                style: { colfloat: "floating" }, display: true,
                                name: "mp_class1_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 }
                            },
                            {
                                style: { colfloat: "floated" },
                                name: "mp_class1_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 }, display: true
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
                                style: { colfloat: "floating" }, name: "act_module2_sel", format: { width: 0 }, display: true,
                                editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, key: ["dept_area", "act_region2"], width: 155 },
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module2_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 }, display: true
                            },
                            { name: "act_module2", hidden: true, editable: { type: "hidden" } },
                            { style: { colfloat: "floating" }, name: "mp_class2_text", format: { width: 200 } },
                            {
                                style: { colfloat: "floating" }, name: "mp_class2_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 }, display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class2_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 }, display: true
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
                                style: { colfloat: "floating" }, name: "act_module3_sel", format: { width: 0 }, display: true,
                                editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, key: ["dept_area", "act_region3"], width: 155 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module3_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 }, display: true
                            },
                            { name: "act_module3", hidden: true, editable: { type: "hidden" } },
                            { style: { colfloat: "floating" }, name: "mp_class3_text", format: { width: 200 } },
                            {
                                style: { colfloat: "floating" }, name: "mp_class3_sel", format: { width: 0 }, display: true,
                                editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 }
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class3_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 }, display: true
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
                            { name: "astat", editable: { type: "hidden" }, hidden: true },
                            { name: "aemp", editable: { type: "hidden" }, hidden: true },
                            { name: "approval", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_모델", query: "w_eccb4010_S_1", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
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
        var args = {
            targetid: "frmData_메모F", query: "w_eccb4010_S_2_3", type: "TABLE", title: "개선 사항",
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
        //----------
        gw_com_module.formCreate(args);
        //==설변도면
        var args = {
            targetid: "grdData_도면", query: "w_eccb4010_S_3", title: "설변 도면",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
                {
                    header: "구분", name: "item_type1", width: 70, align: "center",
                    format: { type: "select", data: { memory: "도면구분", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "도면구분", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "DWG No.", name: "dwg_no1", width: 100, align: "center",
                    editable: { type: "text" }
                },
                { header: "도면보기", name: "link1", width: 60, align: "center", format: { type: "link" } },
                {
                    header: "Part Name", name: "part_nm1", width: 200, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "Rev.", name: "rev_no1", width: 40, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "구분", name: "item_type2", width: 70, align: "center",
                    format: { type: "select", data: { memory: "도면구분", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "도면구분", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "DWG No.", name: "dwg_no2", width: 100, align: "center",
                    editable: { type: "text" }
                },
                { header: "도면보기", name: "link2", width: 60, align: "center", format: { type: "link" } },
                {
                    header: "Part Name", name: "part_nm2", width: 200, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "Rev.", name: "rev_no2", width: 40, align: "center",
                    editable: { type: "text" }
                },
                { name: "dwg_seq", hidden: true, editable: { type: "hidden" } },
                { name: "eco_no", hidden: true, editable: { type: "hidden" } },
                { name: "if_key", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //==적용PJT
        var args = {
            targetid: "grdData_PJT", query: "w_eccb4010_PJT", title: "적용 PJT",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "proj_no", validate: true },
            element: [
                { header: "프로젝트", name: "proj_no", width: 200, editable: { type: "hidden" } },
                { header: "프로젝트명", name: "proj_nm", width: 300 },
                { header: "고객사", name: "cust_nm", width: 200 },
                { name: "eco_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "grdData_평가", query: "w_eccb4010_S_5", title: "제안평가",
        //    caption: true, height: "100%", show: true, number: true, selectable: true,
        //    //editable: { multi: true, bind: "select", focus: "evl1_point", validate: true },
        //    element: [
        //      { header: "평가항목", name: "evl_item", width: 120, align: "center" },
        //      { header: "최고점수", name: "max_point", width: 60, align: "right", mask: "numeric-int" },
        //      { header: "최하등급", name: "min_grade", width: 60, align: "right", mask: "numeric-int" },
        //      {
        //          header: "1차점수", name: "evl1_point", width: 60, align: "right", mask: "numeric-int",
        //          editable: { type: "text", width: 100 }
        //      },
        //      { header: "1차등급", name: "evl1_grade", width: 60, align: "right", mask: "numeric-int" },
        //      { header: "2차점수", name: "evl2_point", width: 60, align: "right", mask: "numeric-int" },
        //      { header: "2차등급", name: "evl2_grade", width: 60, align: "right", mask: "numeric-int" },
        //        { header: "비고", name: "evl_rmk", width: 200, editable: { type: "text", width: 317 } },
        //        { name: "evl_no", editable: { type: "hidden" }, hidden: true },
        //        { name: "item_no", editable: { type: "hidden" }, hidden: true },
        //        { name: "min_point", hidden: true },
        //        { name: "max_grade", hidden: true },
        //        { name: "item_seq", hidden: true }
        //    ]
        //};
        //gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_문서", query: "w_eccb4010_S_6", title: "필수 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "Item", name: "file_grp_nm", width: 200 },
                { header: "세부내용", name: "file_tp_nm", width: 250 },
                { header: "담당부서", name: "file_tp_dept", width: 100, align: "center" },
                { header: "파일", name: "file_upload", width: 50, align: "center", format: { type: "link" } },
                { header: "파일", name: "file_download", width: 50, align: "center", format: { type: "link" } },
                { header: "파일", name: "file_delete", width: 50, align: "center", format: { type: "link" } },
                { name: "ecr_no", editable: { type: "hidden" }, hidden: true },
                { name: "eco_no", editable: { type: "hidden" }, hidden: true },
                { name: "file_tp", editable: { type: "hidden" }, hidden: true },
                { name: "file_id", editable: { type: "hidden" }, hidden: true },
                { name: "fid", editable: { type: "hidden" }, hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_nm", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_APART", query: "w_eccb4010_S_7", title: "변경 전 PART",
            caption: true, width: 550, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "part_cd", validate: true },
            element: [
                {
                    header: "단종", name: "discon_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                },
                {
                    header: "품번", name: "part_cd", width: 80, mask: "search",
                    editable: { type: "text", maxlength: 50, validate: { rule: "required" }, readonly: false }
                },
                {
                    header: "품명", name: "part_nm", width: 150,
                    editable: { type: "hidden" }
                },
                {
                    header: "규격", name: "spec", width: 150,
                    editable: { type: "hidden" }
                },
                {
                    header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text" }
                },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 100 },
                { name: "eco_no", hidden: true, editable: { type: "hidden" } },
                { name: "part_seq", hidden: true, editable: { type: "hidden" } },
                { name: "part_tp", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        $("#grdData_APART_data").parents('div.ui-jqgrid-bdiv').css("max-height", "110px");
        //=====================================================================================
        var args = {
            targetid: "grdData_BPART", query: "w_eccb4010_S_8", title: "변경 후 PART",
            caption: true, width: 550, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "part_cd", validate: true },
            element: [
                {
                    header: "품번", name: "part_cd", width: 80, mask: "search",
                    editable: { type: "text", maxlength: 50, validate: { rule: "required" }, readonly: false }
                },
                {
                    header: "품명", name: "part_nm", width: 150,
                    editable: { type: "text", maxlength: 200 }
                },
                {
                    header: "규격", name: "spec", width: 150,
                    editable: { type: "text", maxlength: 200 }
                },
                {
                    header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int",
                    editable: { type: "text" }
                },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 100 },
                { name: "eco_no", hidden: true, editable: { type: "hidden" } },
                { name: "part_seq", hidden: true, editable: { type: "hidden" } },
                { name: "part_tp", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        $("#grdData_BPART_data").parents('div.ui-jqgrid-bdiv').css("max-height", "110px");
        //=====================================================================================
        var args = {
            targetid: "grdData_ACT", query: "w_eccb4010_S_9", title: "Action Item",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "Item", name: "act_item", width: 1000,
                    editable: { type: "hidden" }
                },
                {
                    header: "실행", name: "act_yn", width: 100, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                },
                { name: "act_id", editable: { type: "hidden" }, hidden: true },
                { name: "root_no", editable: { type: "hidden" }, hidden: true },
                { name: "root_seq", editable: { type: "hidden" }, hidden: true },
                { name: "ecr_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //2021-05-18 by KYT
        var args = {
            targetid: "grdData_첨부", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                //{
                //    header: "문서구분", name: "eccb_file_tp", width: 80,
                //    format: { type: "select", data: { memory: "ECCB35", unshift: [{ title: "-", value: "" }] }, width: 138 },
                //    editable: { type: "select", data: { memory: "ECCB35", unshift: [{ title: "-", value: "" }] }, width: 138 }
                //},
                //{ header: "파일명", name: "file_nm", width: 300 },
                //{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                //{ header: "파일설명", name: "file_desc", width: 200, editable: { type: "text", width: 340 } },
                //{ name: "file_ext", hidden: true },
                //{ name: "file_path", hidden: true },
                //{ name: "network_cd", hidden: true },
                //{ name: "data_tp", hidden: true },
                //{ name: "data_key", hidden: true },
                //{ name: "data_seq", hidden: true },
                //{ name: "file_id", hidden: true, editable: { type: "hidden" } }

                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 450, align: "left", editable: { type: "text" } },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                //{ name: "data_subkey", hidden: true },
                //{ name: "data_subseq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_내역", offset: 8 },
                { type: "GRID", id: "grdData_모델", offset: 8 },
                { type: "GRID", id: "grdData_도면", offset: 8 },
                { type: "GRID", id: "grdData_PJT", offset: 8 },
                //{ type: "GRID", id: "grdData_평가", offset: 8 },
                { type: "GRID", id: "grdData_첨부", offset: 8 },
                { type: "GRID", id: "grdData_문서", offset: 8 },
                { type: "GRID", id: "grdData_APART", offset: 8 },
                { type: "GRID", id: "grdData_BPART", offset: 8 },
                { type: "GRID", id: "grdData_ACT", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================

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
        //----------
        var args = { targetid: "lyrMenu", element: "미리보기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "통보", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상신", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "중단", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processClick };
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
        var args = { targetid: "lyrMenu_모델", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_모델", element: "수정", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_모델", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_도면", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_도면", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_도면", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_PJT", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_PJT", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_첨부", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_첨부", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_첨부", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "lyrMenu_evl", element: "평가", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_내역", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmData_내역", event: "itemdblclick", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "frmData_메모F", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_도면", grid: true, element: "link1", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_도면", grid: true, element: "link2", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_첨부", grid: true, element: "download", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_문서", grid: true, element: "file_upload", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_문서", grid: true, element: "file_download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_문서", grid: true, element: "file_delete", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_APART", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_APART", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_APART", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_BPART", element: "추가2", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_BPART", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_BPART", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_BPART", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_APART", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_APART", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //var args = { targetid: "grdData_APART", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        var args = { targetid: "grdData_BPART", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_BPART", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //var args = { targetid: "grdData_BPART", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function processClick(param) {
            switch (param.element) {
                case "조회":
                    {
                        if (param.object == "lyrMenu_APART" || param.object == "lyrMenu_BPART") {
                            if (!checkManipulate({})) return;
                            if (!checkUpdatable({ check: true })) return false;
                            var obj = "grdData_" + param.object.split("_")[1];
                            if (gw_com_api.getRowCount(obj) < 1) return;
                            var args = {
                                type: "PAGE", page: "w_eccb4010_popup", title: "ERP 재고 현황",
                                width: 1000, height: 590,
                                locate: ["center", "bottom"],
                                open: true
                            };
                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "w_eccb4010_popup",
                                    param: {
                                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                                        data: {
                                            key: v_global.logic.key
                                        }
                                    }
                                };
                                gw_com_module.dialogueOpen(args);
                            }
                        }
                    }
                    break;
                case "미리보기":
                    {
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;

                        processPrint({});
                    }
                    break;
                case "통보":
                    {
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;

                        processSendmail({});
                    }
                    break;
                case "상신":
                    {
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;

                        processApprove({});
                    }
                    break;
                case "추가":
                case "추가2":
                    {
                        if (param.object == "lyrMenu") {
                            v_global.process.handler = processInsert;
                            if (!checkUpdatable({})) return;
                            processInsert({});
                        } else if (param.object == "lyrMenu_모델") {
                            if (!checkManipulate({})) return;
                            processModel({});
                        } else if (param.object == "lyrMenu_도면") {
                            if (!checkManipulate({})) return;
                            var args = {
                                targetid: "grdData_도면",
                                edit: true,
                                data: [
                                    { name: "eco_no", value: gw_com_api.getValue("frmData_내역", 1, "eco_no") }
                                ]
                            };
                            gw_com_module.gridInsert(args);
                        } else if (param.object == "lyrMenu_PJT") {
                            if (!checkManipulate({})) return;
                            var args = {
                                type: "PAGE", page: "w_find_proj_scm_multi", title: "프로젝트 검색",
                                width: 650, height: 460, open: true,
                                locate: ["center", "bottom"],
                                id: gw_com_api.v_Stream.msg_selectProject_SCM
                            };

                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "w_find_proj_scm_multi",
                                    param: {
                                        ID: gw_com_api.v_Stream.msg_selectProject_SCM
                                    }
                                };
                                gw_com_module.dialogueOpen(args);
                            }
                        } else if (param.object == "lyrMenu_첨부") {
                            //2021-05-18 by KYT
                            //if (!checkManipulate({})) return;
                            //if (!checkUpdatable({ check: true })) return false;

                            //v_global.event.file = {
                            //    user: gw_com_module.v_Session.USR_ID,
                            //    key: gw_com_api.getValue("frmData_내역", 1, "eco_no"),
                            //    seq: 1
                            //};
                            //var args = {
                            //    type: "PAGE", page: "w_upload_eccb", title: "파일 업로드",
                            //    width: 650, height: 200, locate: ["center", "bottom"], open: true
                            //};
                            //if (gw_com_module.dialoguePrepare(args) == false) {
                            //    var args = {
                            //        page: "w_upload_eccb",
                            //        param: {
                            //            ID: gw_com_api.v_Stream.msg_upload_ECCB,
                            //            data: v_global.event.file
                            //        }
                            //    };
                            //    gw_com_module.dialogueOpen(args);
                            //}
                            //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
                            //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

                            // Check Updatable
                            if (!checkManipulate({})) return;
                            if (!checkUpdatable({ check: true })) return false;

                            // set data for "File Upload"
                            var dataType = "ECO";    // Set File Data Type
                            var dataKey = gw_com_api.getValue("frmData_내역", 1, "eco_no");   // Main Key value for Search
                            var dataSeq = gw_com_api.getValue("frmData_내역", "1", "nt_seq");   // Main Seq value for Search

                            // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
                            v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq }; // additional data = { data_subkey: "", data_subseq:-1 }

                            // set Argument for Dialogue
                            var pageArgs = dataType + ":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
                            var args = {
                                type: "PAGE", open: true, locate: ["center", 100],
                                width: 650, height: 200, scroll: true,  // multi( h:350, scroll) / single(h:300)
                                page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
                                data: v_global.event.data  // reOpen 을 위한 Parameter
                            };

                            // Open dialogue
                            gw_com_module.dialogueOpenJJ(args);

                        } else if (param.object == "lyrMenu_APART" || param.object == "lyrMenu_BPART") {
                            //if (!checkManipulate({})) return;
                            //var args = {
                            //    check: true,
                            //    target: [
                            //        { type: "GRID", id: "grdData_모델" }
                            //    ],
                            //    param: param
                            //};
                            //if (!gw_com_module.objUpdatable(args)) return;
                            //if (gw_com_api.getSelectedRow("grdData_모델") == null) {
                            //    gw_com_api.messageBox([{ text: "선택된 모델이 없습니다." }]);
                            //    return;
                            //}
                            //var model = gw_com_api.getRowData("grdData_모델", "selected");
                            //var obj = "grdData_" + param.object.split("_")[1];
                            //var args = {
                            //    targetid: obj, edit: true,
                            //    data: [
                            //        { name: "eco_no", value: gw_com_api.getValue("frmData_내역", 1, "eco_no") },
                            //        { name: "part_seq", rule: "INCREMENT", value: 1 },
                            //        { name: "part_tp", value: (obj == "grdData_APART" ? "A" : "B") },
                            //        { name: "cust_nm", value: gw_com_api.getValue("grdData_모델", "selected", "cust_nm", true) },
                            //        { name: "prod_type_nm", value: gw_com_api.getValue("grdData_모델", "selected", "prod_type_nm", true) },
                            //        { name: "cust_dept_nm", value: gw_com_api.getValue("grdData_모델", "selected", "cust_dept_nm", true) },
                            //        { name: "cust_proc_nm", value: gw_com_api.getValue("grdData_모델", "selected", "cust_proc_nm", true) },
                            //        { name: "root_no", value: gw_com_api.getValue("grdData_모델", "selected", "root_seq", true) },
                            //        { name: "root_seq", value: gw_com_api.getValue("grdData_모델", "selected", "model_seq", true) }
                            //    ]
                            //};
                            //gw_com_module.gridInsert(args);

                            if (!checkManipulate({})) return;
                            // 모델이 수정되었을 경우 저장 후 처리 가능
                            var args = {
                                check: true,
                                target: [
                                    { type: "GRID", id: "grdData_모델" }
                                ],
                                param: param
                            };
                            if (!gw_com_module.objUpdatable(args)) return;

                            var obj = "grdData_" + param.object.split("_")[1];
                            var args = { object: obj, row: null, element: "part_cd", type: "GRID", edit: (param.element == "추가2") }
                            processPopup(args);
                        }
                    }
                    break;
                case "삭제":
                    {
                        if (param.object == "lyrMenu") {
                            if (!checkManipulate({})) return;
                            v_global.process.handler = processRemove;
                            checkRemovable({});
                        } else if (param.object == "lyrMenu_모델") {
                            if (!checkManipulate({})) return;
                            chkModelDeletable({});
                            //var args = { targetid: "grdData_모델", row: "selected" }
                            //gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_도면") {
                            if (!checkManipulate({})) return;
                            var args = { targetid: "grdData_도면", row: "selected" }
                            gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_PJT") {
                            if (!checkManipulate({})) return;
                            var args = { targetid: "grdData_PJT", row: "selected" }
                            gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_첨부") {
                            if (!checkManipulate({})) return;
                            var args = { targetid: "grdData_첨부", row: "selected" }
                            gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_APART" || param.object == "lyrMenu_BPART") {
                            if (!checkManipulate({})) return;
                            var obj = "grdData_" + param.object.split("_")[1];
                            var args = { targetid: obj, row: "selected", select: true }
                            gw_com_module.gridDelete(args);
                        }
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        v_global.process.handler = processClose;
                        if (!checkUpdatable({})) return;
                        processClose({});
                    }
                    break;
                case "수정":
                    {
                        if (!checkManipulate({})) return;
                        if (gw_com_api.getSelectedRow("grdData_모델") == null) {
                            gw_com_api.messageBox([
                                { text: "선택된 대상이 없습니다." }
                            ], 300);
                            return false;
                        }
                        processModel({ modify: true });
                    }
                    break;
                case "평가":
                    {
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;
                        var args = {
                            type: "PAGE", page: "w_edit_evl_1", title: "1차평가",
                            width: 1000, height: 300,
                            locate: ["center", 1100],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_edit_evl_1",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: {
                                        evl_no: v_global.logic.key
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "중단":
                    {
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;
                        var args = {
                            page: "w_edit_memo",
                            param: {
                                ID: gw_com_api.v_Stream.msg_edit_Memo,
                                data: { edit: true, title: "중단사유", text: "" }
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "취소":
                    {
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;
                        if (gw_com_api.getValue("frmData_내역", 1, "astat") != "99") {
                            gw_com_api.messageBox([{ text: "중단취소 처리할 내역이 없습니다." }]);
                            return;
                        }
                        var p = {
                            handler: setAstat,
                            param: {
                                act: "취소"
                            }
                        };
                        gw_com_api.messageBox([{ text: "중단 처리를 취소하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            if (param.object == "frmData_내역") {

                switch (param.element) {
                    case "act_region1":
                    case "act_region2":
                    case "act_region3":
                        {
                            var em = "act_module" + param.element.substr(param.element.length - 1, 1);
                            gw_com_api.setValue(param.object, param.row, em, "");
                            gw_com_api.setValue(param.object, param.row, em + '_etc', "");
                        }
                        break;
                    case "act_time_sel":
                    case "dwg_proc_sel":
                    case "act_module1_sel":
                    case "act_module2_sel":
                    case "act_module3_sel":
                    case "mp_class1_sel":
                    case "mp_class2_sel":
                    case "mp_class3_sel":
                        {
                            var em = param.element.substr(0, param.element.length - 4);
                            gw_com_api.setValue(param.object, param.row, em + '_etc', "");
                            gw_com_api.setValue(param.object, param.row, em, (param.value.current == "1000") ? "" : param.value.current);
                        }
                        break;
                    case "act_time_etc":
                    case "dwg_proc_etc":
                    case "act_module1_etc":
                    case "act_module2_etc":
                    case "act_module3_etc":
                    case "mp_class1_etc":
                    case "mp_class2_etc":
                    case "mp_class3_etc":
                        {
                            var em = param.element.substr(0, param.element.length - 4);
                            if (gw_com_api.getValue(param.object, param.row, em + "_sel") == 1000)
                                gw_com_api.setValue(param.object, param.row, em, param.value.current);
                        }
                        break;
                }

            } else if (param.object == "grdData_APART" || param.object == "grdData_BPART") {

                if (param.element == "part_cd") {
                    var args = param;
                    args.dept_area = gw_com_api.getValue("frmData_내역", 1, "dept_area");
                    args.part_cd = param.value.current;
                    Query.setItemInfo(args);
                }

            }

        }
        //----------
        function processItemdblclick(param) {

            if (param.object == "frmData_내역") {

                if (gw_com_module.v_Object[param.object].option[param.element].edit == false) return;
                v_global.event.type = param.type;
                v_global.event.object = param.object;
                v_global.event.row = param.row;
                v_global.event.element = param.element;

                var args;
                var page = "DLG_CODE";
                var title = "코드선택";
                var width = 500;
                var height = 300;
                var id = gw_com_api.v_Stream.msg_openedDialogue;

                switch (param.element) {
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

            } else if (param.object == "frmData_메모F") {

                if (!checkEditable({})) return;
                if (!checkManipulate({})) return;

                param.element = "memo_html";
                v_global.logic.memo = "개선 사항";
                processMemo({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });

            } else if (param.object == "grdData_APART" || param.object == "grdData_BPART") {

                processPopup(param);

            }

        }
        //----------
        function processItemclick(param) {

            if (param.object == "grdData_도면") {
                var dwg_no = gw_com_api.getValue(param.object, param.row, (param.element == "link1" ? "dwg_no1" : "dwg_no2"), true);
                var rev_no = gw_com_api.getValue(param.object, param.row, (param.element == "link1" ? "rev_no1" : "rev_no2"), true);
                gw_com_site.open_eco_dwg({ dwg_no: dwg_no, rev_no: rev_no });
            } else if (param.object == "grdData_첨부") {
                var args = { source: { id: "grdData_첨부", row: param.row }, targetid: "lyrDown" };
                gw_com_module.downloadFile(args);
            }

        }
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        v_global.logic.if_key = gw_com_api.getPageParameter("if_key");
        if (v_global.process.param != "") {
            v_global.logic.key = gw_com_api.getPageParameter("eco_no");
            if (v_global.logic.if_key > "")
                processInsert({});
            else
                processRetrieve({ key: v_global.logic.key });
        }
        else
            processInsert({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_내역");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_도면" },
            { type: "GRID", id: "grdData_APART" },
            { type: "GRID", id: "grdData_BPART" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "GRID", id: "grdData_ACT" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
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
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_eco_no", value: param.key },
                { name: "arg_seq", value: 1 }
            ]
        },
        target: [],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    if (param.target == undefined || param.target == "%") {
        args.target[args.target.length] = { type: "FORM", id: "frmData_내역" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_모델" };
        args.target[args.target.length] = { type: "FORM", id: "frmData_메모F" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_도면" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_PJT" };
        //args.target[args.target.length] = { type: "GRID", id: "grdData_평가" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_첨부" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_APART" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_BPART" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_문서" };
        args.target[args.target.length] = { type: "GRID", id: "grdData_ACT" };
    } else {
        args.target[args.target.length] = param.target;
    }
    gw_com_module.objRetrieve(args);

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

    // LCCB의 경우 CRM 부서 숨기기
    var eccb_no = gw_com_api.getValue("frmData_내역", 1, "root_no");
    if (eccb_no != undefined && eccb_no != "")
        processEccbTypeChanged({ eccb_tp: eccb_no.substr(0, 1) });

    //필수첨부문서
    setReqDoc({ eco_no: param.key });

}
//----------
function processInsert(param) {

    if (param.sub) {
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_root_no", value: param.key },
                    { name: "arg_root_seq", value: param.seq },
                    { name: "arg_eccb_no", value: param.eccb_no },
                    { name: "arg_item_seq", value: param.item_seq },
                    { name: "arg_if_key", value: v_global.logic.if_key }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_모델", query: "w_eccb4010_I_1", crud: "insert" },
                { type: "FORM", id: "frmData_메모F", query: "w_eccb4010_I_2_3", crud: "insert" },
                { type: "GRID", id: "grdData_도면", query: "w_eccb4010_I_3", crud: "insert" },
                { type: "GRID", id: "grdData_PJT", query: "w_eccb4010_I_8", crud: "insert" },
                { type: "GRID", id: "grdData_ACT", query: "w_eccb4010_I_9", crud: "insert" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.master) {
        var args = {
            targetid: "frmData_내역", edit: true, updatable: true,
            data: [
                { name: "root_no", value: param.data.eccb_no },
                { name: "root_seq", value: param.data.item_seq },
                { name: "dept_area", value: param.data.dept_area },
                { name: "dept_area_nm", value: param.data.dept_area_nm },
                { name: "ecr_no", value: param.data.ecr_no },
                { name: "cip_no", value: param.data.cip_no },
                { name: "eco_title", value: param.data.ecr_title },
                { name: "eco_desc", value: param.data.ecr_desc },
                { name: "eco_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "eco_emp_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "eco_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "eco_dept_nm", value: gw_com_module.v_Session.DEPT_Nm },
                { name: "eco_dt", value: gw_com_api.getDate("") },
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
                { name: "ecr_tp_nm", value: param.data.ecr_tp_nm },
                { name: "crm_tp_nm", value: param.data.crm_tp_nm },
                { name: "rqst_dept_nm", value: param.data.rqst_dept_nm },
                { name: "astat", value: "10" },
                { name: "aemp", value: gw_com_module.v_Session.EMP_NO }
            ],
            clear: [
                { type: "GRID", id: "grdData_모델" },
                { type: "FORM", id: "frmData_메모F" },
                { type: "GRID", id: "grdData_도면" },
                { type: "GRID", id: "grdData_PJT" },
                //{ type: "GRID", id: "grdData_평가" },
                { type: "GRID", id: "grdData_APART" },
                { type: "GRID", id: "grdData_BPART" },
                { type: "GRID", id: "grdData_첨부" },
                { type: "GRID", id: "grdData_문서" },
                { type: "GRID", id: "grdData_ACT" }
            ]
        };
        gw_com_module.formInsert(args);

        // LCCB의 경우 CRM 부서 숨기기
        if (param.data.eccb_no != undefined && param.data.eccb_no != "")
            processEccbTypeChanged({ eccb_tp: param.data.eccb_no.substr(0, 1) });

        //필수첨부문서
        setReqDoc({ ecr_no: param.data.ecr_no });

        var args = {
            sub: true,
            key: param.data.root_no,
            seq: param.data.root_seq,
            eccb_no: param.data.eccb_no,
            item_seq: param.data.item_seq
        };
        processInsert(args);
    }
    else {
        var args = {
            type: "PAGE", page: "w_find_eco_item", title: "ECO 대상 선택",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_eco_item",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectECOItem
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processEccbTypeChanged(param) {
    var sType = param.eccb_tp;
    // LCCB의 경우 CRM 부서 숨기기
    if (sType == "L") {
        gw_com_api.hide("frmData_내역", "rqst_dept_nm");
        gw_com_api.hide("frmData_내역", "label_rqst_dept_nm");
        gw_com_api.hide("lyrMenu_PJT");
        gw_com_api.hide("lyrMenu_APART");
        gw_com_api.hide("lyrMenu_BPART");
        gw_com_api.hide("frmMenu_APART");
        gw_com_api.hide("grdData_APART");
        gw_com_api.hide("grdData_BPART");
        gw_com_api.setValue("chk_apart", 1, "0", false);
        gw_com_api.setCaption("grdData_도면", " ◈ 변경 Logic", true);
    }
    else {
        gw_com_api.show("frmData_내역", "rqst_dept_nm");
        gw_com_api.show("frmData_내역", "label_rqst_dept_nm");
        gw_com_api.show("lyrMenu_PJT");
        gw_com_api.show("lyrMenu_APART");
        gw_com_api.show("lyrMenu_BPART");
        gw_com_api.show("frmMenu_APART");
        gw_com_api.show("grdData_APART");
        gw_com_api.show("grdData_BPART");
        gw_com_api.setValue("chk_apart", 1, "1", false);
        gw_com_api.setCaption("grdData_도면", " ◈ 설변 도면", true);
    }
}
//----------
function processDelete(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_도면" },
            { type: "GRID", id: "grdData_PJT" },
            { type: "GRID", id: "grdData_APART" },
            { type: "GRID", id: "grdData_BPART" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "GRID", id: "grdData_문서" },
            { type: "GRID", id: "grdData_ACT" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
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
    else {
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
//----------
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
    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_도면" },
            { type: "GRID", id: "grdData_PJT" },
            { type: "GRID", id: "grdData_APART" },
            { type: "GRID", id: "grdData_BPART" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "GRID", id: "grdData_ACT" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // Check Input Error
    if (gw_com_api.getValue("frmData_내역", 1, "act_time_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_time_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_time_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "act_module1_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_module1_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_module1_etc");
    }
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
    if (err) {
        gw_com_api.messageBox([
                { text: "[기타]에 대한 내용이 입력되지 않았습니다." }
        ]);
        return false;
    }

    // 변경전/후PART 등록 체크
    //if (gw_com_api.getValue("frmMenu_APART", 1, "chk_apart") == "1" && gw_com_api.getRowCount("grdData_APART") == 0 && gw_com_api.getRowCount("grdData_BPART") == 0) {
    //    gw_com_api.messageBox([{ text: "변경 전/후 PART를 등록하세요." }]);
    //    return false;
    //}

    // 담당자 변경
    if (gw_com_module.v_Session.EMP_NO != gw_com_api.getValue("frmData_내역", 1, "emp_no")) {
        gw_com_api.setValue("frmData_내역", 1, "eco_emp", gw_com_module.v_Session.EMP_NO);
        gw_com_api.setValue("frmData_내역", 1, "dept_cd", gw_com_module.v_Session.DEPT_CD);
    }

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        var query = this.QUERY;
        $.each(this.KEY, function () {
            if (this.NAME == "eco_no"
                || (this.NAME == "root_no"
                    && (query == "w_eccb4010_S_1" || query == "w_eccb4010_S_2_1" || query == "w_eccb4010_S_2_2"))) {
                v_global.logic.key = this.VALUE;
            }
        });
    });
    if (param == undefined || param.target == undefined)
        processRetrieve({ key: v_global.logic.key });
    else
        processRetrieve({ target: param.target, key: v_global.logic.key });

    // PLM I/F
    if (v_global.logic.if_key) {
        var args = {
            eco_no: v_global.logic.key,
            if_key: v_global.logic.if_key,
            crud: "C"
        };
        gw_com_site.eco_plm_if(args);
        v_global.logic.if_key = "";
    }

}
//----------
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역", key: { element: [{ name: "eco_no" }] } }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processPrint(param) {

    window.open("/Job/w_link_eco_print.aspx?data_key=" + v_global.logic.key, "", "");

}
//----------
function processApprove(param) {

    var approval = gw_com_api.getValue("frmData_내역", 1, "approval");
    var status = gw_com_api.getValue("frmData_내역", 1, "gw_astat_nm", false, true);
    //if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
    if (approval != "1") {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }

    //// 평가 체크
    //var evl_row = gw_com_api.getFindRow("grdData_평가", "item_seq", "99");
    //if (gw_com_api.getValue("grdData_평가", evl_row, "evl1_point", true) == "" ||
    //    gw_com_api.getValue("grdData_평가", evl_row, "evl1_point", true) == "false") {
    //    gw_com_api.messageBox([
    //        { text: "제안평가 입력 후 상신할 수 있습니다." }
    //    ], 420);
    //    return false;
    //}

    // 필수 문서 체크
    var row = gw_com_api.getFindRow("grdData_문서", "file_id", "");
    if (row > 0) {
        gw_com_api.messageBox([{ text: "필수 문서를 첨부하세요." }]);
        return false;
    }

    // 필수첨부파일 체크
    var chk = true;
    var file_tp = v_global.logic.req_doc.code.split('^');
    $.each(file_tp, function (i) {
        if (!chk) return false;
        if (file_tp[i] != "") {
            chk = (gw_com_api.getFindRow("grdData_첨부", "eccb_file_tp", file_tp[i]) > 0);
        }
    });
    if (!chk) {
        gw_com_api.messageBox([{ text: "필수 첨부문서를 확인하세요." }]);
        return false;
    }

    if (!chkAct(v_global.logic.key)) {
        gw_com_api.messageBox([{ text: "Action Item이 모두 실행되어야 상신 가능합니다." }]);
        return;
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
        var title = gw_com_api.getValue("frmData_내역", 1, "eco_title") + "(" + v_global.logic.key + ")";
        var args = {
            eco_no: v_global.logic.key,
            gw_key: gw_key,
            gw_seq: gw_seq,
            title: title
        };
        gw_com_site.gw_appr_eco(args);
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_도면" },
            { type: "GRID", id: "grdData_PJT" },
            { type: "GRID", id: "grdData_APART" },
            { type: "GRID", id: "grdData_BPART" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "GRID", id: "grdData_ACT" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

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
function successRemove(response, param) {

    processDelete({});

    // PLM I/F
    if (v_global.logic.if_key) {
        var args = {
            eco_no: v_global.logic.key,
            if_key: v_global.logic.if_key,
            crud: "D"
        };
        gw_com_site.eco_plm_if(args);
        v_global.logic.if_key = "";
    }

}
//----------
function processSendmail(param) {

    var args = {
        type: "ECO01",
        key_no: v_global.logic.key
    };

    // Log용 Key 연결
    var key = [
        { name: "data_tp", value: "ECO01" },
        { name: "data_key", value: v_global.logic.key }
    ];

    var args = {
        url: "COM",
        subject: Query.getSubject(args),
        body: Query.getBody(args),
        to: Query.getTo(args),
        key: key,
        edit: true
    };
    gw_com_module.sendMail(args);

}
//----------
function processFile(param) {

    if (param.element == "file_upload") {

        var fid = gw_com_api.getValue(param.object, param.row, "fid", true);
        var key = gw_com_api.getValue(param.object, param.row, "ecr_no", true) + "-" + fid;
        v_global.event.file = {
            user: gw_com_module.v_Session.USR_ID,
            key: key,
            seq: 1,
            req_doc: {
                fid: fid
            }
        };

        var args = {
            type: "PAGE", page: "w_upload_eccb", title: "파일 업로드",
            width: 650, height: 200,
            locate: ["center", "bottom"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_upload_eccb",
                param: {
                    ID: gw_com_api.v_Stream.msg_upload_ECCB,
                    data: v_global.event.file
                }
            };
            gw_com_module.dialogueOpen(args);
        }

    } else if (param.element == "file_download") {

        var args = { source: { id: param.object, row: param.row }, targetid: "lyrDown" };
        gw_com_module.downloadFile(args);

    } else if (param.element == "file_delete") {

        var args = {
            url: "COM",
            user: gw_com_module.v_Session.USR_ID,
            param: [
                {
                    query: "w_eccb1051_S_5",
                    row: [
                        {
                            crud: "U",
                            column: [
                                { name: "fid", value: gw_com_api.getValue(param.object, param.row, "fid", true) },
                                { name: "file_id", value: "" }
                            ]
                        }
                    ]
                }
            ],
            handler: {
                success: successSave,
                param: { target: { type: "GRID", id: "grdData_문서" } }
            }
        };
        gw_com_module.objSave(args);

    }

}
//----------
function processPopup(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "part_cd":
            {
                var page = "w_eccb4010_popup2";
                if (param.row == undefined) page = "w_eccb4010_popup3";

                v_global.event.data = {
                    part_tp: (param.object.split("_")[1] == "APART" ? "A" : "B"),
                    eco_no: v_global.logic.key,
                    dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area"),
                    part_cd: gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID")),
                    edit: (param.edit == true)
                };
                var args = {
                    type: "PAGE", page: page, title: "부품 선택",
                    width: 1100, height: 500, open: true,
                    locate: ["center", "bottom"]
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: page,
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//----------
var Query = {
    getSubject: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=DLG_EMAIL_INF" +
                    "&QRY_COLS=val" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type + "&arg_field=subject&arg_ref_key1=" + param.key_no + "&arg_ref_key2=&arg_ref_key3=&arg_ref_key4=&arg_ref_key5=",
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        return rtn
    },
    getBody: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=DLG_EMAIL_INF" +
                    "&QRY_COLS=val" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type + "&arg_field=body&arg_ref_key1=" + param.key_no + "&arg_ref_key2=&arg_ref_key3=&arg_ref_key4=&arg_ref_key5=",
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        return rtn
    },
    getTo: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=DLG_EMAIL_INF2" +
                    "&QRY_COLS=name,value,user_id" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type + "&arg_ref_key1=" + param.key_no + "&arg_ref_key2=&arg_ref_key3=&arg_ref_key4=&arg_ref_key5=",
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            $.each(data, function () {
                rtn.push({
                    name: this.DATA[0],
                    value: this.DATA[1],
                    user_id: this.DATA[2]
                });
            });
        }
        //----------
        return rtn
    },
    setItemInfo: function (param) {
        var args = {
            request: "PAGE",
            name: "w_eccb4010_popup2_2",
            async: false,
            param: param,
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=w_eccb4010_popup2_2" +
                    "&QRY_COLS=part_cd,part_nm,part_spec" +
                    "&CRUD=R" +
                    "&arg_dept_area=" + param.dept_area + "&arg_part_cd=" + param.part_cd + "&arg_part_nm=&arg_part_spec=",
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {

            if (data.length == 1) {
                gw_com_api.setValue(param.object, param.row, "part_nm", data[0].DATA[1], (param.type == "GRID"), true);
                gw_com_api.setValue(param.object, param.row, "spec", data[0].DATA[2], (param.type == "GRID"), true);
            } else {
                if (data.length == 0 && param.object == "grdData_BPART") return;
                gw_com_api.setValue(param.object, param.row, "part_nm", "", (param.type == "GRID"), true);
                gw_com_api.setValue(param.object, param.row, "spec", "", (param.type == "GRID"), true);
                processPopup(param);
            }
        }
    }
}
//----------
function setReqDoc(param) {

    v_global.logic.req_doc = {
        code: "",
        name: ""
    };

    $.ajax({
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=w_eccb4010_S_4_CHK" +
                "&QRY_COLS=dcode,dname" +
                "&CRUD=R" +
                "&arg_eco_no=" + (param.eco_no == undefined ? "" : param.eco_no) + "&arg_ecr_no=" + (param.ecr_no == undefined ? "" : param.ecr_no),
        type: 'post',
        cache: false,
        async: false,
        data: "{}",
        success: function (data, status) {
            var response = JSON.parse(data);
            if (response.iCode == 0) {
                v_global.logic.req_doc.code = response.tData[0].DATA[0];
                v_global.logic.req_doc.name = response.tData[0].DATA[1];
            }
        }
    });

    var args = {
        targetid: "lyrFileNotice",
        row: [
            { name: "알림", value: (v_global.logic.req_doc.name == "" ? "" : "필수첨부문서 : " + v_global.logic.req_doc.name) }
        ]
    };
    gw_com_module.labelAssign(args);

}
//----------
function chkAct(cip_no) {

    var rtn = false;
    var args = {
        request: "PAGE",
        name: "ACT_CHK",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=w_eccb4010_CHK_ACT" +
            "&QRY_COLS=act_yn" +
            "&CRUD=R" +
            "&arg_root_no=" + cip_no +
            "&arg_root_seq=1",
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(data) {

        if (data.DATA != undefined && data.DATA.length > 0) {
            rtn = (data.DATA[0] == "1");
        }

    }
    return rtn;

}
//----------
function setAstat(param) {

    var astat = "";
    if (param.act == "중단")
        astat = "99";
    else if (param.act == "취소")
        astat = getLastAstat({});
    else
        return;

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: "w_eccb4010_M_2",
                row: [
                    {
                        crud: "U",
                        column: [
                            { name: "eco_no", value: v_global.logic.key },
                            { name: "astat", value: astat },
                            { name: "aemp", value: gw_com_module.v_Session.EMP_NO },
                            { name: "adate", value: "SYSDT" },
                            { name: "cancel_rmk", value: (param.rmk == undefined ? "" : param.rmk.substr(0, 200)) }
                        ]
                    }
                ]
            }
        ],
        handler: {
            success: successSave
        }
    };
    gw_com_module.objSave(args);

}
//----------
function getLastAstat(param) {

    var rtn = "";
    var args = {
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=w_eccb4010_LAST_ASTAT" +
            "&QRY_COLS=astat" +
            "&CRUD=R" +
            "&arg_eco_no=" + v_global.logic.key,
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {
        rtn = data.DATA[0];
    }
    //----------
    return rtn

}
//----------
function chkModelDeletable(param) {

    var row = gw_com_api.getSelectedRow("grdData_모델");
    if (row == null) {
        gw_com_api.messageBox([{ text: "삭제할 데이터가 선택되지 않았습니다." }]);
        return;
    }
    var deletable = true;
    var root_no = gw_com_api.getValue("grdData_모델", row, "root_seq", true);
    var root_seq = gw_com_api.getValue("grdData_모델", row, "model_seq", true);
    var ids = gw_com_api.getRowIDs("grdData_APART");
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_APART", this, "root_no", true) == root_no && gw_com_api.getValue("grdData_APART", this, "root_seq", true) == root_seq) {
            deletable = false;
            return false;
        }
    });
    if (deletable) {
        ids = gw_com_api.getRowIDs("grdData_BPART");
        $.each(ids, function () {
            if (gw_com_api.getValue("grdData_BPART", this, "root_no", true) == root_no && gw_com_api.getValue("grdData_BPART", this, "root_seq", true) == root_seq) {
                deletable = false;
                return false;
            }
        });
    }
    if (!deletable) {
        var p = {
            handler: function (param) {
                var args = { targetid: "grdData_모델", row: "selected" }
                gw_com_module.gridDelete(args);
                // 변경 전/후 PART 삭제
                var ids = gw_com_api.getRowIDs("grdData_APART");
                $.each(ids, function () {
                    if (gw_com_api.getValue("grdData_APART", this, "root_no", true) == root_no && gw_com_api.getValue("grdData_APART", this, "root_seq", true) == root_seq) {
                        var args = { targetid: "grdData_APART", row: this }
                        gw_com_module.gridDelete(args);
                    }
                });
                ids = gw_com_api.getRowIDs("grdData_BPART");
                $.each(ids, function () {
                    if (gw_com_api.getValue("grdData_BPART", this, "root_no", true) == root_no && gw_com_api.getValue("grdData_BPART", this, "root_seq", true) == root_seq) {
                        var args = { targetid: "grdData_BPART", row: this }
                        gw_com_module.gridDelete(args);
                    }
                });
            },
            param: { root_no: root_no, root_seq: root_seq }
        };
        gw_com_api.messageBox([
            { text: "변경 전/후 PART가 함께 삭제됩니다." },
            { text: "계속 하시겠습니까?" }], 420, undefined, "YESNO", p);
        return;
    }
    var args = { targetid: "grdData_모델", row: "selected" }
    gw_com_module.gridDelete(args);

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
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.result == "YES" || param.data.result == undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedECOItem:
            {
                processInsert({ master: true, data: param.data });
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
                            { name: "root_no", value: gw_com_api.getValue("frmData_내역", 1, "eco_no") },
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
                        if (this != window)
                            gw_com_module.gridInsert(args);
                    });

                }
                else {
                    var args = {
                        targetid: "grdData_모델", edit: true, updatable: true,
                        data: [
                            { name: "root_no", value: gw_com_api.getValue("frmData_내역", 1, "eco_no") },
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
                        args.data.push({ name: "proj_no", value: param.data.proj_no });
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
                if (v_global.event.file.req_doc)
                    processRetrieve({ target: { type: "GRID", id: "grdData_문서" }, key: v_global.logic.key });
                else
                    processRetrieve({ target: { type: "GRID", id: "grdData_첨부" }, key: v_global.logic.key });

                if (v_global.event.file.req_doc) closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var detp_area = gw_com_api.getValue("frmData_내역", 1, "dept_area");
                var args = {
                    eco_no: v_global.logic.key,
                    dept_area: detp_area,
                    gw_user: param.data.name,
                    gw_pass: param.data.password,
                    gw_key: gw_key,
                    gw_seq: gw_seq
                };
                gw_com_site.gw_appr_eco(args);
                processRetrieve({ key: v_global.logic.key });

            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_EHM:
            {
                if (v_global.event.row == undefined || v_global.event.row == null) {
                    var args = {
                        targetid: v_global.event.object, edit: true,
                        data: [
                            { name: "eco_no", value: gw_com_api.getValue("frmData_내역", 1, "eco_no") },
                            { name: "part_seq", rule: "INCREMENT", value: 1 },
                            { name: "part_tp", value: (v_global.event.object == "grdData_APART" ? "A" : "B") }
                        ]
                    };
                    v_global.event.row = gw_com_module.gridInsert(args);
                }
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.part_cd, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, param.data.part_nm, (v_global.event.type == "GRID") ? true : false, true);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "spec", param.data.part_spec, (v_global.event.type == "GRID") ? true : false, true);

                //if (v_global.event.element == "apart_cd" && gw_com_api.getValue(v_global.event.object, v_global.event.row, "bpart_cd", (v_global.event.type == "GRID") ? true : false) == "") {
                //    //gw_com_api.showMessage("교체 Part를 선택하세요.");
                //    v_global.event.element = "bpart_cd";
                //    v_global.event.name = "bpart_nm";
                //    processPopup(v_global.event);
                //} else
                    closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_eco_item":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectECOItem;
                        }
                        break;
                    case "w_find_prod_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_ECCB;
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
                    case "w_upload_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = v_global.event.file;
                            //args.data = {
                            //    user: gw_com_module.v_Session.USR_ID,
                            //    key: gw_com_api.getValue("frmData_내역", 1, "eco_no"),
                            //    seq: 1
                            //};
                        }
                        break;
                    case "w_edit_evl_1":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            evl_no: v_global.logic.key
                        };
                        break;
                    case "DLG_CODE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                    case "w_find_part_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_EHM;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "w_eccb4010_popup":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                key: v_global.logic.key
                            };
                        }
                        break;
                    case "w_eccb4010_popup2":
                    case "w_eccb4010_popup3":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
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
                    case "w_edit_evl_1":
                        {
                            var args = {
                                source: {
                                    type: "INLINE",
                                    argument: [
                                        { name: "arg_eco_no", value: v_global.logic.key }
                                    ]
                                },
                                target: [
                                    { type: "GRID", id: "grdData_평가" }
                                ]
                            };
                            gw_com_module.objRetrieve(args);
                        }
                        break;
                    case "DLG_CODE":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.dname, v_global.event.type == "GRID" ? true : false);
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.value, param.data.dcode, v_global.event.type == "GRID" ? true : false);
                            }
                        }
                        break;
                    case "w_eccb4010_popup2":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.part_cd, (v_global.event.type == "GRID"), false, false);
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_nm", param.data.part_nm, (v_global.event.type == "GRID"), true);
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, "spec", param.data.spec, (v_global.event.type == "GRID"), true);
                            //} else {
                            //    if (gw_com_api.getValue(v_global.event.object, v_global.event.row, "part_nm", (v_global.event.type == "GRID")) == "") {
                            //        var args = { targetid: v_global.event.object, row: v_global.event.row }
                            //        gw_com_module.gridDelete(args);
                            //    }
                            }
                        }
                        break;
                    case "w_eccb4010_popup3":
                        {
                            if (param.data != undefined) {
                                var args = {
                                    targetid: v_global.event.object,
                                    edit: true,
                                    updatable: true,
                                    data: param.data
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
                if (param.data != undefined) {
                    var eco_no = gw_com_api.getValue("frmData_내역", 1, "eco_no");
                    var data = new Array();
                    $.each(param.data, function () {
                        if (gw_com_api.getFindRow("grdData_PJT", "proj_no", this.proj_no) < 1) {
                            gw_com_module.gridInsert({
                                targetid: "grdData_PJT", edit: true, updatable: true,
                                data: [
                                    { name: "eco_no", value: eco_no },
                                    { name: "proj_no", value: this.proj_no },
                                    { name: "proj_nm", value: this.proj_nm },
                                    { name: "cust_cd", value: this.cust_cd },
                                    { name: "cust_nm", value: this.cust_nm }
                                ]
                            })
                        }
                    });
                }
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                if (param.data.update) {
                    if (param.data.text == "") {

                        gw_com_api.messageBox([{ text: "중단사유를 입력하지 않아 처리를 취소합니다." }]);

                    } else {

                        setAstat({ act: "중단", rmk: param.data.text });

                    }
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//