
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

        // prepare dialogue.
        var args = {
            type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //----------
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                //    param: [{ argument: "arg_hcode", value: "ECCB41" }]
                //},
                {
                    type: "PAGE", name: "분류1", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB05" }]
                },
                //{
                //    type: "PAGE", name: "분류2", query: "dddw_zcode",
                //    param: [{ argument: "arg_hcode", value: "ECCB06" }]
                //},
                { type: "PAGE", name: "분류2", query: "dddw_ecr_module" },
                {
                    type: "PAGE", name: "분류3", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB07" }]
                },
                //{ type: "PAGE", name: "부서", query: "dddw_dept" },
                //{ type: "PAGE", name: "사원", query: "dddw_emp" }
                {
                    type: "PAGE", name: "ECCB13", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB13" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.UI();

        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        // define UI.
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "상신", value: "결재상신", icon: "기타" },
                { name: "추가", value: "추가"/*, act: true*/ },
                { name: "저장", value: "저장" },
                { name: "삭제", value: "삭제" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_모델", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_첨부", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내역", query: "w_eccb3020_M_2", type: "TABLE", title: "CIP 완료 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "cip_title", validate: true },
            content: {
                width: { label: 100, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "CIP No.", format: { type: "label" } },
                            { name: "cip_no", editable: { type: "hidden" } },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "ecr_no", editable: { type: "hidden" } },
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm", editable: { type: "hidden" }, display: true },
                            { name: "dept_area", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "cip_title", style: { colspan: 3 },
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
                                name: "cip_desc", style: { colspan: 3 },
                                format: { width: 628 },
                                editable: { type: "text", width: 626 }
                            },
                            { header: true, value: "Level", format: { type: "label" } },
                            {
                                name: "crm_tp", style: { colfloat: "float" },
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "ECCB13" }, validate: { rule: "required", message: "Level" } }
                            },
                            { name: "crm_tp_nm", style: { colfloat: "floating" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용요구시점", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "act_time_text",
                                editable: { type: "hidden" }, display: true
                            },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            {
                                style: { colfloat: "float" }, name: "rpt_emp_nm",
                                format: { width: 60 },
                                editable: { type: "hidden", width: 60 }, display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "rpt_dept_nm",
                                editable: { type: "hidden" }, display: true
                            },
                            { name: "rpt_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "rpt_dept", editable: { type: "hidden" }, hidden: true }
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
                            { name: "rpt_dt", mask: "date-ymd", editable: { type: "text" } }
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
                            { name: "act_region1_text", style: { colfloat: "floating" }, format: { width: 200 } },
                            { name: "act_module1_text", style: { colfloat: "floating" }, format: { width: 300 } },
                            {
                                name: "act_module1_sel", style: { colfloat: "floating" }, format: { width: 0 }, display: true,
                                editable: { type: "select", width: 155, data: { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region1"] } }
                            },
                            {
                                name: "act_module1_etc", style: { colfloat: "floating" }, format: { width: 0 }, display: true,
                                editable: { type: "text", width: 155 }
                            },
                            { name: "act_module1", hidden: true, editable: { type: "hidden" } },
                            { name: "mp_class1_text", style: { colfloat: "floating" }, format: { width: 200 } },
                            {
                                name: "mp_class1_sel", style: { colfloat: "floating" }, format: { width: 0 },
                                editable: { type: "select", width: 155, display: true, data: { memory: "분류3", unshift: [{ title: "-", value: "" }] } }
                            },
                            {
                                name: "mp_class1_etc", format: { width: 0 }, style: { colfloat: "floated" }, display: true,
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
                            {
                                name: "act_region2_text", format: { width: 200 },
                                style: { colfloat: "floating" }
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module2_text",
                                format: { width: 300 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module2_sel", format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region2"] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module2_etc", format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "act_module2", hidden: true, editable: { type: "hidden" } },
                            { name: "mp_class2_text", style: { colfloat: "floating" }, format: { width: 200 } },
                            {
                                name: "mp_class2_sel", style: { colfloat: "floating" }, format: { width: 0 }, display: true,
                                editable: { type: "select", width: 155, data: { memory: "분류3", unshift: [{ title: "-", value: "" }] } }
                            },
                            {
                                name: "mp_class2_etc", style: { colfloat: "floated" }, format: { width: 0 },
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
                            {
                                style: { colfloat: "floating" }, name: "act_region3_text",
                                format: { width: 200 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module3_text",
                                format: { width: 300 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module3_sel",
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, key: ["dept_area", "act_region3"], width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floating" }, name: "act_module3_etc",
                                format: { width: 0 },
                                editable: { type: "text", width: 155 },
                                display: true
                            },
                            { name: "act_module3", hidden: true, editable: { type: "hidden" } },
                            {
                                style: { colfloat: "floating" }, name: "mp_class3_text",
                                format: { width: 200 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "mp_class3_sel",
                                format: { width: 0 },
                                editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 },
                                display: true
                            },
                            {
                                style: { colfloat: "floated" }, name: "mp_class3_etc", format: { width: 0 },
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
                            { name: "root_no", editable: { type: "hidden" }, hidden: true },
                            { name: "root_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "gw_adate" },
                            { name: "gw_astat", hidden: true },
                            { name: "gw_key", hidden: true },
                            { name: "gw_seq", hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "astat", editable: { type: "hidden" }, hidden: true },
                            { name: "approval", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_모델", query: "w_eccb3010_S_1", title: "적용 모델",
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
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_메모F", query: "w_eccb3010_S_2_3", type: "TABLE", title: "개선 사항",
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
        //=====================================================================================
        var args = {
            targetid: "grdData_ACT", query: "w_eccb3010_S_4", title: "Action Item",
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
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        // 2021-05-18 by KYT
        var args = {
            targetid: "grdData_첨부", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                //{ header: "파일명", name: "file_nm", width: 300, align: "left" },
                //{
                //    header: "다운로드", name: "download", width: 60, align: "center",
                //    format: { type: "link", value: "다운로드" }
                //},
                //{
                //    header: "파일설명", name: "file_desc", width: 300, align: "left",
                //    editable: { type: "text" }
                //},
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
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_내역", offset: 8 },
                { type: "GRID", id: "grdData_모델", offset: 8 },
                { type: "GRID", id: "grdData_ACT", offset: 8 },
                { type: "GRID", id: "grdData_첨부", offset: 8 }
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

        gw_job_process.procedure();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //----------
        var args = { targetid: "lyrMenu", element: "상신", event: "click", handler: click_lyrMenu_상신 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_모델", element: "추가", event: "click", handler: click_lyrMenu_모델_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_모델", element: "삭제", event: "click", handler: click_lyrMenu_모델_삭제 };
        gw_com_module.eventBind(args);
        //----------
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
        //----------
        var args = { targetid: "frmData_내역", event: "itemkeyenter", handler: itemdblclick_frmData_내역 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "frmData_메모A", event: "itemdblclick", handler: itemdblclick_frmData_메모A };
        //gw_com_module.eventBind(args);
        ////=====================================================================================
        //var args = { targetid: "frmData_메모B", event: "itemdblclick", handler: itemdblclick_frmData_메모B };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_메모F", event: "itemdblclick", handler: itemdblclick_frmData_메모F };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_첨부", grid: true, element: "download", event: "click", handler: click_grdData_첨부_download };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_상신() {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            processApprove({});

        }
        //----------
        function click_lyrMenu_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert_ecr({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_모델_추가(ui) {

            if (!checkManipulate({})) return;
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
                gw_com_module.dialogueOpen(args);
            }
            //var args = {
            //    type: "PAGE", page: "w_find_prod_eccb", title: "제품 모델 선택",
            //    width: 900, height: 440, open: true
            //};
            //if (gw_com_module.dialoguePrepare(args) == false) {
            //    var args = {
            //        page: "w_find_prod_eccb",
            //        param: { ID: gw_com_api.v_Stream.msg_selectProduct_ECCB }
            //    };
            //    gw_com_module.dialogueOpen(args);
            //}

        }
        //----------
        function click_lyrMenu_모델_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_모델", row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        //2021-05-18 by KYT
        function click_lyrMenu_첨부_추가(ui) {

            //if (!checkManipulate({})) return;
            //if (!checkUpdatable({ check: true })) return false;

            //var args = {
            //    type: "PAGE", page: "w_upload_eccb", title: "파일 업로드",
            //    width: 650, height: 200, open: true
            //    //locate: ["center", 600],
            //};
            //if (gw_com_module.dialoguePrepare(args) == false) {
            //    var args = {
            //        page: "w_upload_eccb",
            //        param: {
            //            ID: gw_com_api.v_Stream.msg_upload_ECCB,
            //            data: {
            //                user: gw_com_module.v_Session.USR_ID,
            //                key: gw_com_api.getValue("frmData_내역", 1, "cip_no"),
            //                seq: 2
            //            }
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
            var dataType = "CIP";    // Set File Data Type
            var dataKey = gw_com_api.getValue("frmData_내역", "selected", "cip_no", true);   // Main Key value for Search
            var dataSeq = gw_com_api.getValue("frmData_내역", "selected", "2");   // Main Seq value for Search

            // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
            v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq, user: gw_com_module.v_Session.USR_ID }; // additional data = { data_subkey: "", data_subseq:-1 }

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
        }
        //----------
        function click_lyrMenu_첨부_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_첨부", row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function itemchanged_frmData_내역(ui) {

            switch (ui.element) {
                case "act_region1":
                case "act_region2":
                case "act_region3":
                    {
                        var em = "act_module" + ui.element.substr(ui.element.length - 1, 1);
                        gw_com_api.setValue(ui.object, ui.row, em, "");
                        gw_com_api.setValue(ui.object, ui.row, em + '_etc', "");
                    }
                    break;
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
                case "act_module1_etc":
                case "act_module2_etc":
                case "act_module3_etc":
                case "mp_class1_etc":
                case "mp_class2_etc":
                case "mp_class3_etc":
                    {
                        var em = ui.element.substr(0, ui.element.length - 4);
                        if (gw_com_api.getValue(ui.object, ui.row, em + "_sel") == 1000)
                            gw_com_api.setValue(ui.object,
                                                ui.row,
                                                em,
                                                ui.value.current);
                    }
                    break;
            }

        };
        //----------
        function itemdblclick_frmData_내역(ui) {

            if (gw_com_module.v_Object[ui.object].option[ui.element].edit == false) return;
            switch (ui.element) {
                case "act_emp_nm":
                case "sub_emp1_nm":
                case "sub_emp2_nm":
                case "sub_emp3_nm":
                    {
                        var em = ui.element.substr(0, ui.element.length - 3);
                        gw_com_api.setValue(ui.object, ui.row, em, "", true);

                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_emp",
                            title: "사원 검색",
                            width: 600,
                            height: 450,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_emp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEmployee
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function itemdblclick_frmData_메모A(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;
            ui.element = "memo_html";
            v_global.logic.memo = "TEST 내용";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------
        function itemdblclick_frmData_메모B(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "TEST 결과";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------
        function itemdblclick_frmData_메모F(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "개선 사항";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------
        function click_grdData_첨부_download(ui) {

            var args = { targetid: "lyrDown", source: { id: "grdData_첨부", row: ui.row } };
            gw_com_module.downloadFile(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            v_global.logic.key = gw_com_api.getPageParameter("cip_no");
            if (v_global.logic.key == "")
                processInsert_ecr({});
            else
                processRetrieve({ key: v_global.logic.key });
        }
        else
            processInsert_ecr({});

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//2021-05-18 by KYT
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "CIP" : param.data_tp; // Set File Data Type
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
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}

//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_내역");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
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
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_첨부" }
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
                { name: "arg_cip_no", value: param.key },
                { name: "arg_seq", value: 2 }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_ACT" },
            /*{ type: "GRID", id: "grdData_첨부" }*/
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);
    //2021-05-18 by KYT
    processFileList({
        data_key: gw_com_api.getValue("frmData_내역", 1, "cip_no")
    });
}
//----------
function processRetrieveEnd(param) {

    var act_module1_etc = gw_com_api.getValue("frmData_내역", 1, "act_module1_etc");
    var act_module2_etc = gw_com_api.getValue("frmData_내역", 1, "act_module2_etc");
    var act_module3_etc = gw_com_api.getValue("frmData_내역", 1, "act_module3_etc");
    gw_com_api.filterSelect("frmData_내역", 1, "act_module1_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region1"] });
    gw_com_api.filterSelect("frmData_내역", 1, "act_module2_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region2"] });
    gw_com_api.filterSelect("frmData_내역", 1, "act_module3_sel", { memory: "분류2", unshift: [{ title: "-", value: "" }], key: ["dept_area", "act_region3"] });
    gw_com_api.setValue("frmData_내역", 1, "act_module1_etc", act_module1_etc);
    gw_com_api.setValue("frmData_내역", 1, "act_module2_etc", act_module2_etc);
    gw_com_api.setValue("frmData_내역", 1, "act_module3_etc", act_module3_etc);
    gw_com_api.setCRUD("frmData_내역", 1, "retrieve");

    // LCCB의 경우 CRM 부서 숨기기
    var eccb_no = gw_com_api.getValue("frmData_내역", 1, "root_no");
    if (eccb_no != undefined && eccb_no != "")
        processEccbTypeChanged({ eccb_tp: eccb_no.substr(0, 1) });


}
//----------
function processEccbTypeChanged(param) {
    var sType = param.eccb_tp;
    // LCCB의 경우 CRM 부서 숨기기
    if (sType == "L") {
        gw_com_api.hide("frmData_내역", "rqst_dept_nm");
        gw_com_api.hide("frmData_내역", "label_rqst_dept_nm");
    }
    else {
        gw_com_api.show("frmData_내역", "rqst_dept_nm");
        gw_com_api.show("frmData_내역", "label_rqst_dept_nm");
    }
}
//----------
function processInsert(param) {

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
                //{ type: "GRID", id: "grdData_모델", query: "w_eccb3010_I_1", crud: "insert" },
                { type: "GRID", id: "grdData_ACT", query: "w_eccb3010_I_4", crud: "insert" }
            ]
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.master) {
        var args = {
            targetid: "frmData_내역", edit: true, updatable: true,
            data: [
                { name: "cip_no", value: param.data.cip_no },
                { name: "ecr_no", value: param.data.ecr_no, hide: true },
                { name: "cip_title", value: param.data.cip_title },
                { name: "draft_emp", value: param.data.draft_emp, hide: true },
                { name: "rpt_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "rpt_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "rpt_dt", value: gw_com_api.getDate("") },
                { name: "test_model", value: param.data.test_model, hide: true },
                { name: "plan_str_dt", value: param.data.plan_str_dt, hide: true },
                { name: "plan_end_dt", value: param.data.plan_end_dt, hide: true },
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
                { name: "act_emp", value: param.data.act_emp },
                { name: "sub_emp1", value: param.data.sub_emp1 },
                { name: "sub_emp2", value: param.data.sub_emp2 },
                { name: "sub_emp3", value: param.data.sub_emp3 },
                { name: "plan_cost_note", value: param.data.plan_cost_note, hide: true },
                { name: "plan_cost", value: param.data.plan_cost, hide: true },
                { name: "pstat_text", value: param.data.pstat_text, hide: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_모델" },
                { type: "FORM", id: "frmData_메모F" },
                { type: "GRID", id: "grdData_ACT" },
                { type: "GRID", id: "grdData_첨부" }
            ]
        };
        gw_com_module.formInsert(args);

        // LCCB의 경우 CRM 부서 숨기기
        if (param.data.root_no != undefined && param.data.root_no != "")
            processEccbTypeChanged({ eccb_tp: param.data.root_no.substr(0, 1) });

        var args = {
            targetid: "frmData_메모F", edit: true, updatable: true,
            data: [
                { name: "root_no", value: param.data.cip_no },
                { name: "root_seq", value: "2" },
                { name: "memo_cd", value: "F" }/*,
                { name: "memo_html", value: "<table style='width: 825px; height: 195px; table-layout:fixed; font-family:굴림체; font-size:9pt;' border='1' cellspacing='0' cellpadding='3'><tr valign='top'><td style='word-break: break-all;'></td></tr></table>" }*/
            ]
        };
        gw_com_module.formInsert(args);
        processInsert({ sub: true, key: param.data.cip_no, seq: 1 });
    }
    else {

        var args = {
            type: "PAGE", page: "w_find_ecr", title: "CIP 대상 선택",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_ecr",
                param: { ID: gw_com_api.v_Stream.msg_selectECR, data: { type: "cip" } }
            };
            gw_com_module.dialogueOpen(args);
        }

    }

}
//----------
function processInsert_ecr(param) {

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
                { type: "GRID", id: "grdData_모델", query: "w_eccb3020_I_1", crud: "insert" },
                //{ type: "GRID", id: "grdData_ACT", query: "w_eccb3020_I_4", crud: "insert" },
                { type: "FORM", id: "frmData_메모F", query: "w_eccb3020_I_2_3", crud: "insert" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.master) {
        var args = {
            targetid: "frmData_내역",
            edit: true, updatable: true,
            data: [
                { name: "ecr_no", value: param.data.ecr_no },
                { name: "cip_title", value: param.data.ecr_title },
                { name: "cip_desc", value: param.data.ecr_desc },
                { name: "dept_area", value: param.data.dept_area },
                { name: "dept_area_nm", value: param.data.dept_area_nm },
                { name: "draft_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "draft_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "draft_dt", value: gw_com_api.getDate("") },
                { name: "rpt_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "rpt_emp_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "rpt_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "rpt_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                { name: "rpt_dt", value: gw_com_api.getDate("") },
                { name: "act_time_text", value: param.data.act_time_text },
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
                { name: "aemp", value: gw_com_module.v_Session.EMP_NO },
                { name: "root_no", value: param.data.root_no },
                { name: "root_seq", value: param.data.root_seq }
            ],
            clear: [
                { type: "GRID", id: "grdData_모델" },
                { type: "FORM", id: "frmData_메모F" },
                { type: "GRID", id: "grdData_ACT" },
                { type: "GRID", id: "grdData_첨부" }
            ]
        };
        gw_com_module.formInsert(args);
        // LCCB의 경우 CRM 부서 숨기기
        if (param.data.root_no != undefined && param.data.root_no != "")
            processEccbTypeChanged({ eccb_tp: param.data.root_no.substr(0, 1) });

        processInsert_ecr({ sub: true, key: param.data.ecr_no, seq: 1 });
        processInsert({ sub: true, key: param.data.root_no, seq: param.data.root_seq });
    }
    else {
        var args = {
            type: "PAGE", page: "w_find_ecr", title: "CIP 대상 선택",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_ecr",
                param: { ID: gw_com_api.v_Stream.msg_selectECR, data: { type: "cip" } }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_첨부" }
        ]
    };
    gw_com_module.objClear(args);

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

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_첨부" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // ECR Level 수정
    if (gw_com_api.getUpdatable("frmData_내역")) {
        if (gw_com_api.getValue("frmData_내역", 1, "crm_tp_nm", false, true) != gw_com_api.getText("frmData_내역", 1, "crm_tp")) {
            if (args.param == undefined)
                args.param = new Array();

            args.param.push({
                query: "w_eccb1010_M_1",
                row: [{
                    crud: "U",
                    column: [
                        { name: "ecr_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no") },
                        { name: "crm_tp", value: gw_com_api.getValue("frmData_내역", 1, "crm_tp") }
                    ]
                }]
            });
        }
    }

    // 담당자 변경
    if (gw_com_module.v_Session.EMP_NO != gw_com_api.getValue("frmData_내역", 1, "rpt_emp")) {
        gw_com_api.setValue("frmData_내역", 1, "rpt_emp", gw_com_module.v_Session.EMP_NO);
        gw_com_api.setValue("frmData_내역", 1, "rpt_dept", gw_com_module.v_Session.DEPT_CD);
    }

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
            {
                type: "FORM", id: "frmData_내역",
                key: { element: [{ name: "cip_no" }] }
            }
        ],
        handler: { success: successRemove }
    };
    gw_com_module.objRemove(args);

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
        var title = gw_com_api.getValue("frmData_내역", 1, "cip_title") + "(" + v_global.logic.key + ")";
        var args = {
            cip_no: v_global.logic.key,
            gw_key: gw_key,
            gw_seq: gw_seq,
            title: title
        };
        gw_com_site.gw_appr_cip_end(args);
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "FORM", id: "frmData_메모F" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_첨부" }
        ]
    };
    gw_com_module.objClear(args);

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
        gw_com_api.setFocus(v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        var query = this.QUERY;
        $.each(this.KEY, function () {
            if (this.NAME == "cip_no"
                || (this.NAME == "root_no"
                    && (query == "w_eccb3010_S_1" || query == "w_eccb3010_S_2_1" || query == "w_eccb3010_S_2_2" || query == "w_eccb3010_S_2_3"))) {
                v_global.logic.key = this.VALUE;
                //processRetrieve({ key: v_global.logic.key });
            }
        });
    });
    processRetrieve({ key: v_global.logic.key });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function chkAct(cip_no) {

    var rtn = false;
    var args = {
        request: "PAGE",
        name: "ACT_CHK",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=w_eccb3010_CHK_ACT" +
            "&QRY_COLS=act_yn" +
            "&CRUD=R" +
            "&arg_root_no=" + cip_no +
            "&arg_root_seq=2",
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
        case gw_com_api.v_Stream.msg_selectedECR:
            {
                processInsert_ecr({ master: true, data: param.data });
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedCIP:
            {
                processInsert({ master: true, data: param.data });
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
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
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_ECCB:
            {
                if (param.multi) {
                    var args = {
                        targetid: "grdData_모델", edit: true, updatable: true,
                        data: [
                            { name: "root_no", value: gw_com_api.getValue("frmData_내역", 1, "cip_no") },
                            { name: "root_seq", value: 2 }
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
                            args.data.push({ name: "proj_no", value: this.prod_nm });
                        }
                        if (this != window)
                            gw_com_module.gridInsert(args);
                    });

                }
                else {
                    var args = {
                        targetid: "grdData_모델", edit: true, updatable: true,
                        data: [
                            { name: "root_no", value: gw_com_api.getValue("frmData_내역", 1, "cip_no") },
                            { name: "root_seq", value: 2 }
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
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "memo_text", param.data.html);
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
                            { name: "arg_cip_no", value: gw_com_api.getValue("frmData_내역", 1, "cip_no") },
                            { name: "arg_seq", value: 2 }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_첨부", select: true }
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
                var args = {
                    cip_no: v_global.logic.key,
                    dept_area: detp_area,
                    gw_user: param.data.name,
                    gw_pass: param.data.password,
                    gw_key: gw_key,
                    gw_seq: gw_seq
                };
                gw_com_site.gw_appr_cip_end(args);
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
                            args.data = { type: "cip" };
                        }
                        break;
                    case "w_find_cip":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectCIP;
                            args.data = { type: "complete" };
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
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
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_내역", 1, "cip_no"),
                                seq: 2
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                //2021-05-18 by KYT
                switch (param.from.page) {
                    case "SYS_FileUpload": {
                        {
                            processFileList({
                                data_key: gw_com_api.getValue("frmData_내역", 1, "cip_no")
                            });
                        }
                        break;
                    }

                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//