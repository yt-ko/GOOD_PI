//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : ECA 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 주요 수정 부문 :DataBox = grdData_첨부, Customfunction file

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
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = { type: "PAGE", page: "w_eccb4055", title: "ECA 적용 Project 합의 요청/취소", width: 1000, height: 450, locate: ["center", 250] };
        gw_com_module.dialoguePrepare(args);
        //----
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인", width: 430, height: 90, locate: ["center", 200] };
        gw_com_module.dialoguePrepare(args);
        // set list data.
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "ECCB35", query: "dddw_zcode",
                //    param: [
                //        { argument: "arg_hcode", value: "ECCB35" }
                //    ]
                //},
                {
                    type: "PAGE", name: "승인구분", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB44" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //----------
        function start() {

            gw_job_process.uiButton();
            gw_job_process.uiData();
            gw_job_process.uiEvent();
            //----------
            gw_com_module.startPage();
            //----------

            if (v_global.process.param != "") {
                v_global.logic.key = gw_com_api.getPageParameter("eca_no");
                v_global.logic.key2 = gw_com_api.getPageParameter("eco_no");
                v_global.logic.key3 = gw_com_api.getPageParameter("ecr_no");
                processRetrieve({ param: v_global.logic });
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
        //---------- Create Buttons : lyrMenu : 추가, 삭제, 저장, 닫기
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);

        //------ Create Buttons : lyrMenu_모델 : 추가, 삭제, 통보
        var args = {
            targetid: "lyrMenu_모델", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                //{ name: "복사", value: "복사", icon: "추가", updatable: true },
                //{ name: "수정", value: "수정", icon: "추가", updatable: true },
                { name: "삭제", value: "삭제" },
                { name: "통보", value: "통보", icon: "기타" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //------ Create Buttons : lyrMenu_PJT : 합의요청, 요청취소, 추가, 삭제
        var args = {
            targetid: "lyrMenu_PJT", type: "FREE",
            element: [
                { name: "합의요청", value: "합의요청", icon: "예" },
                { name: "요청취소", value: "요청취소", icon: "아니오" },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //------ Create Buttons : lyrMenu_FILE : 추가, 삭제
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
    },
    // create UI - Data
    uiData: function () {
        //--------- Data Box : frmData_내역 : ECA 내역
        var args = {
            targetid: "frmData_내역", query: "w_eccb4050_M_1", type: "TABLE", title: "ECA 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "eco_title", validate: true },
            content: {
                width: { label: 100, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "ECA No.", format: { type: "label" } },
                            { name: "eca_no", editable: { type: "hidden" } },
                            { name: "dept_area", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "ECO No.", format: { type: "label" } },
                            { name: "eco_no", editable: { type: "hidden" } },
                            { header: true, value: "ECR No.", format: { type: "label" } },
                            { name: "ecr_no", editable: { type: "hidden" } },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "issue_no", editable: { type: "hidden" }, display: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                style: { colspan: 7 }, name: "eca_title",
                                format: { width: 1032 },
                                editable: { type: "text", width: 1030, maxlength: 100 }
                            },
                            { name: "eca_dt", editable: { type: "hidden" }, hidden: true },
                            { name: "eca_emp", editable: { type: "hidden" }, hidden: true },
                            { name: "eca_dept", editable: { type: "hidden" }, hidden: true }
                            //{ header: true, value: "작성일자", format: { type: "label" } },
                            //{ name: "eca_dt", mask: "date-ymd", editable: { type: "text" } },
                            //{ header: true, value: "작성자", format: { type: "label" } },
                            //{ name: "eca_emp_nm", editable: { type: "hidden" }, display: true },
                            //{ name: "eca_emp", editable: { type: "hidden" }, hidden: true },
                            //{ name: "eca_dept", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                style: { colspan: 7 }, name: "rmk",
                                format: { type: "textarea", rows: 5, width: 1032 },
                                editable: { type: "textarea", rows: 5, width: 1030 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록자", format: { type: "label" } },
                            { name: "ins_usr_nm", editable: { type: "hidden" }, display: true },
                            { header: true, value: "등록일시", format: { type: "label" } },
                            { name: "ins_dt", editable: { type: "hidden" }, display: true },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr_nm", editable: { type: "hidden" }, display: true },
                            { header: true, value: "수정일시", format: { type: "label" } },
                            { name: "upd_dt", editable: { type: "hidden" }, display: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        $("#" + args.targetid + "_eco_no_view").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        $("#" + args.targetid + "_eco_no").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        $("#" + args.targetid + "_ecr_no_view").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        $("#" + args.targetid + "_ecr_no").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        //--------- Data Box : grdData_모델 : 적용 모델
        var args = {
            targetid: "grdData_모델", query: "w_eccb4050_S_1", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 120 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "제품코드", name: "prod_cd", width: 100, hidden: true },
                { header: "제품명", name: "prod_nm", width: 300, hidden: true },
                { header: "적용 Project No.", name: "proj_key", width: 150, hidden: true },
                {
                    header: "호기", name: "prod_no", width: 70,
                    editable: { type: "text" }, hidden: true
                },
                { header: "승인일자", name: "eca_date", width: 100, align: "center", mask: "date-ymd" },
                {
                    header: "승인구분", name: "eca_tp", width: 100, align: "center",
                    format: { type: "select", data: { memory: "승인구분", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "고객적용", name: "pm_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                { name: "prod_type", hidden: true, editable: { type: "hidden" } },
                { name: "cust_cd", hidden: true, editable: { type: "hidden" } },
                { name: "cust_dept", hidden: true, editable: { type: "hidden" } },
                { name: "cust_proc", hidden: true, editable: { type: "hidden" } },
                { name: "prod_key", hidden: true, editable: { type: "hidden" } },
                { name: "model_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //--------- Data Box : grdData_PJT : 적용 Project
        var args = {
            targetid: "grdData_PJT", query: "w_eccb4050_S_6", title: "적용 Project",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "Project No.", name: "proj_key", width: 100,
                    editable: { type: "hidden" }
                },
                { header: "프로젝트명", name: "proj_nm", width: 250 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 120 },
                {
                    header: "승인일자", name: "eca_date", width: 100, align: "center",
                    editable: { type: "text" }, mask: "date-ymd"
                },
                {
                    header: "고객담당자", name: "cust_emp", width: 100, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "승인", name: "eca_yn", width: 50, align: "center", hidden: true,
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "승인구분", name: "eca_tp", width: 100, align: "center",
                    format: { type: "select", data: { memory: "승인구분", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "승인구분", unshift: [{ title: "-", value: "" }] } },
                },
                {
                    header: "제조적용", name: "apply_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "고객적용", name: "pm_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "PM외주진행", name: "pmout_yn_view", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { name: "pmout_yn", hidden: true, editable: { type: "hidden" } },
                {
                    header: "PM진행율", name: "pm_rate", width: 70, align: "right", mask: "numeric-float",
                    editable: { type: "hidden" }
                },
                { header: "PM진행율(현재)", name: "cur_pm_rate", width: 70, align: "right", mask: "numeric-float" },
                {
                    header: "제조합의요청", name: "pmagr_yn_view", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { name: "pmagr_yn", hidden: true, editable: { type: "hidden" } },
                {
                    header: "제조승인", name: "pmcfm_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "제조진행상태", name: "apply_stat", width: 80, align: "center" },
                { header: "제조적용완료일", name: "apply_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "미적용 사유", name: "apply_rmk", width: 200 },
                { name: "prod_type", hidden: true, editable: { type: "hidden" } },
                { name: "cust_cd", hidden: true, editable: { type: "hidden" } },
                { name: "cust_dept", hidden: true, editable: { type: "hidden" } },
                { name: "cust_proc", hidden: true, editable: { type: "hidden" } },
                { name: "prod_key", hidden: true, editable: { type: "hidden" } },
                { name: "model_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } },
                { name: "proj_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //---------- Data Box : grdData_첨부 : 첨부 문서
        var args = {
            targetid: "grdData_첨부", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                //{
                //    header: "문서구분", name: "eccb_file_tp", width: 80,
                //    format: { type: "select", data: { memory: "ECCB35", unshift: [{ title: "-", value: "" }] }, width: 138 },
                //    editable: { type: "select", data: { memory: "ECCB35", unshift: [{ title: "-", value: "" }] }, width: 138 }
                //},
                //{ header: "파일명", name: "file_nm", width: 400 },
                //{ header: "다운로드", name: "download", width: 100, align: "center", format: { type: "link", value: "다운로드" } },
                //{ header: "파일설명", name: "file_desc", width: 600, editable: { type: "text" } },
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
                //{ header: "등록자", name: "ins_usr_nm", width: 80, align: "center" },
                //{ header: "등록일시", name: "ins_dt", width: 160, align: "center" },
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
        //---------- Data Box : frmData_내역_2 : ECO 내역
        var args = {
            targetid: "frmData_내역_2", query: "w_link_eccb_item_M_3", type: "TABLE", title: "ECO 내역",
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
                    },
                    {
                        element: [
                            { header: true, value: "승인상태", format: { type: "label" } },
                            { name: "gw_astat_nm" },
                            { header: true, value: "승인자", format: { type: "label" } },
                            { name: "gw_aemp" },
                            { header: true, value: "승인일시", format: { type: "label" } },
                            { name: "gw_adate" }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        $("#" + args.targetid + "_eco_no_view").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        $("#" + args.targetid + "_eco_no").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        $("#" + args.targetid + "_ecr_no_view").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        $("#" + args.targetid + "_ecr_no").css({ "color": "blue", "text-decoration": "underline", "cursor": "hand" });
        //---------- Data Box : grdData_모델_2 : 적용 모델
        var args = {
            targetid: "grdData_모델_2", query: "w_link_eccb_item_S_3", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 70 },
                { header: "Line", name: "cust_dept_nm", width: 90 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "제품명", name: "prod_nm", width: 300 }
            ]
        };
        gw_com_module.gridCreate(args);
        //---------- pageCreate
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //---------- convert tab
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrECO", title: "ECO 내역" }
            ]
        };
        gw_com_module.convertTab(args);
        //=====================================================================================
        // Resize Objects
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 },
                { type: "FORM", id: "frmData_내역", offset: 8 },
                { type: "GRID", id: "grdData_모델", offset: 8 },
                { type: "GRID", id: "grdData_PJT", offset: 8 },
                { type: "FORM", id: "frmData_내역_2", offset: 8 },
                { type: "GRID", id: "grdData_모델_2", offset: 8 },
                { type: "GRID", id: "grdData_첨부", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },
    // create UI - Event
    uiEvent: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processADD };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDEL };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_모델", element: "추가", event: "click", handler: processADD };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu_모델", element: "복사", event: "click", handler: processCOPY };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_모델", element: "수정", event: "click", handler: processModify };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "lyrMenu_모델", element: "삭제", event: "click", handler: processDEL };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_모델", element: "통보", event: "click", handler: processMail };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_PJT", element: "합의요청", event: "click", handler: processCancel };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PJT", element: "요청취소", event: "click", handler: processCancel };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PJT", element: "추가", event: "click", handler: processADD };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PJT", element: "삭제", event: "click", handler: processDEL };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processADD };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processDEL };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_내역", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmData_내역", event: "itemdblclick", handler: itemdblclick_frmData_내역 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", element: "eco_no", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", element: "eco_no_view", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", element: "ecr_no", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역", element: "ecr_no_view", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_모델", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_모델", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_모델", grid: true, event: "itemkeyup", handler: processKeyup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_모델", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_모델", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_첨부", grid: true, element: "download", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_내역_2", element: "eco_no", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역_2", element: "eco_no_view", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역_2", element: "ecr_no", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_내역_2", element: "ecr_no_view", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //=====================================================================================


    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// before event handler.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// before processbutton 2021-05-24 by KYT
/*function processButton(param) {

   switch (param.element) {
       case "추가":
           {
               if (param.object == "lyrMenu") {
                   v_global.process.handler = processInsert;
                   if (!checkUpdatable({})) return;
                   processInsert({});
               } else if (param.object == "lyrMenu_모델") {
                   if (!checkManipulate({})) return;
                   if (!checkUpdatable({ pjt: true, check: true })) return false;
                   processModel({});
               } else if (param.object == "lyrMenu_PJT") {
                   if (!checkManipulate({})) return;
                   var row = gw_com_api.getSelectedRow("grdData_모델");
                   if (row == null) {
                       gw_com_api.messageBox([{ text: "NOMASTER" }]);
                       return;
                   }
                   processProject({});

               } else if (param.object == "lyrMenu_FILE") {
                   //2021-05-24 by KYT
                   processFileUpload(param)

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
                   //var args = { targetid: "grdData_모델", row: "selected", select: true }
                   //gw_com_module.gridDelete(args);
                   var status = gw_com_api.getCRUD("grdData_모델", "selected", true);
                   if (status == "initialize" || status == "create") {
                       gw_com_module.objClear({ target: [{ type: "GRID", id: "grdData_PJT" }] });
                       var args = { targetid: "grdData_모델", row: "selected", remove: true, select: true };
                       gw_com_module.gridDelete(args);
                   } else {
                       var p = {
                           handler: function () {
                               var args = {
                                   url: "COM",
                                   target: [
                                       { type: "GRID", id: "grdData_모델", key: [{ row: "selected", element: [{ name: "root_no" }, { name: "root_seq" }, { name: "model_seq" }] }]}
                                   ],
                                   handler: {
                                       success: function () {
                                           gw_com_module.objClear({ target: [{ type: "GRID", id: "grdData_PJT" }] });
                                           gw_com_module.gridDelete({ targetid: "grdData_모델", row: "selected", remove: true, select: true });
                                       }
                                   }
                               };
                               gw_com_module.objRemove(args);
                           }
                       };
                       gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);
                   }
               } else if (param.object == "lyrMenu_PJT") {
                   if (!checkManipulate({})) return;
                   var args = { targetid: "grdData_PJT", row: "selected", select: true }
                   gw_com_module.gridDelete(args);
               } else if (param.object == "lyrMenu_FILE") {
                   if (!checkManipulate({})) return;
                   var args = { targetid: "grdData_첨부", row: "selected" }
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
       case "복사":
           {
               if (!checkManipulate({})) return;
               var row = gw_com_api.getSelectedRow("grdData_모델");
               if (row == null) {
                   gw_com_api.messageBox([{ text: "NODATA" }]);
                   return false;
               }
               var args = {
                   targetid: "grdData_모델", edit: true, updatable: true,
                   data: [
                       { name: "root_no", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "root_no", true) },
                       { name: "root_seq", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "root_seq", true) },
                       { name: "cust_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_nm", true) },
                       { name: "cust_dept_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_dept_nm", true) },
                       { name: "prod_type_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_type_nm", true) },
                       { name: "cust_proc_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_proc_nm", true) },
                       { name: "prod_cd", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true) },
                       { name: "prod_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true) },
                       { name: "prod_no", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_no", true) },
                       { name: "eca_date", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "eca_date", true) },
                       { name: "cust_emp", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_emp", true) },
                       { name: "eca_yn", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "eca_yn", true) },
                       { name: "eca_tp", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "eca_tp", true) },
                       { name: "pm_yn", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "pm_yn", true) },
                       { name: "prod_type", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true) },
                       { name: "cust_cd", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true) },
                       { name: "cust_dept", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true) },
                       { name: "cust_proc", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true) },
                       { name: "prod_key", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true) },
                       { name: "model_seq", rule: "INCREMENT", value: 1 }
                   ]
               };
               var row = gw_com_module.gridInsert(args);
               var args = { object: "grdData_모델", row: row, element: "proj_key", type: "GRID" };
               processItemdblclick(args);
           }
           break;
       case "수정":
           {
               if (!checkManipulate({})) return;
               if (gw_com_api.getSelectedRow("grdData_모델") == null) {
                   gw_com_api.messageBox([{ text: "NODATA" }]);
                   return false;
               }
               processModel({ modify: true });
           }
           break;
       case "통보":
           {
               if (!checkManipulate({})) return;
               if (!checkUpdatable({ check: true })) return false;
               var row = gw_com_api.getSelectedRow("grdData_모델");
               if (row == null) {
                   gw_com_api.messageBox([{ text: "NODATA" }]);
                   return;
               //} else if (gw_com_api.getValue("grdData_모델", "selected", "eca_yn", true) != "1") {
               //    gw_com_api.messageBox([{ text: "승인되지 않은 내역입니다." }]);
               //    return;
               } else if (gw_com_api.getValue("grdData_모델", "selected", "eca_tp", true) == "") {
                   gw_com_api.messageBox([{ text: "승인구분이 입력되지 않았습니다." }]);
                   return;
               }
               var args = {
                   eca_no: gw_com_api.getValue("grdData_모델", row, "root_no", true),
                   root_seq: gw_com_api.getValue("grdData_모델", row, "root_seq", true),
                   model_seq: gw_com_api.getValue("grdData_모델", row, "model_seq", true)
               };
               sendMail(args);
           }
           break;
       case "합의요청":
       case "요청취소":
           {
               if (!checkManipulate({})) return;
               if (!checkUpdatable({ check: true })) return false;
               if (gw_com_api.getRowCount("grdData_PJT") == 0) {
                   gw_com_api.messageBox([{ text: "적용 프로젝트가 없습니다." }]);
                   return;
               }
              
               ////var ids = gw_com_api.getRowIDs("grdData_PJT");
               ////var validate = false;
               ////$.each(ids, function () {
               ////    if (gw_com_api.getValue("grdData_PJT", this, "pmout_yn", true) == "1"
               ////        && gw_com_api.getValue("grdData_PJT", this, "apply_yn", true) == "0") {
               ////        validate = true;
               ////        return false;
               ////    }
               ////});

               ////if (!validate) {
               ////    gw_com_api.messageBox([{ text: "합의요청 대상이 없습니다." }]);
               ////    return;
               ////}

               //var p = {
               //    handler: requestAgreement,
               //    param: {
               //        root_no: gw_com_api.getValue("grdData_모델", "selected", "root_no", true),
               //        root_seq: gw_com_api.getValue("grdData_모델", "selected", "root_seq", true),
               //        model_seq: gw_com_api.getValue("grdData_모델", "selected", "model_seq", true),
               //        req_yn: (param.element == "합의요청" ? "1" : "0")
               //    }
               //};
               //gw_com_api.messageBox([{ text: param.element + " 하시겠습니까?" }], undefined, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);


               v_global.event.data = {
                   eca_no: gw_com_api.getValue("frmData_내역", 1, "eca_no"),
                   req_yn: (param.element == "합의요청" ? "1" : 0)
               };
               var args = {
                   page: "w_eccb4055",
                   param: {
                       ID: gw_com_api.v_Stream.msg_openedDialogue,
                       data: v_global.event.data
                   }
               };
               gw_com_module.dialogueOpen(args);

           }
           break;
   }

}*/
// before processEvent 2021-05-24 by KYT
/* function processItemchanged(param) {

     if (param.object == "grdData_모델") {
         //if (param.element == "eca_yn") {
         //    if (param.value.current == "0") {
         //        gw_com_api.setValue(param.object, param.row, "eca_date", "", (param.type == "GRID"));
         //        gw_com_api.setValue(param.object, param.row, "eca_tp", "", (param.type == "GRID"));
         //    } else {
         //        if (gw_com_api.getValue(param.object, param.row, "eca_date", (param.type == "GRID")) == "") {
         //            gw_com_api.setValue(param.object, param.row, "eca_date", gw_com_api.getDate(), (param.type == "GRID"));
         //        }
         //    }
         //}
         if (param.element == "eca_tp") {
             if (param.value.current == "") {
                 gw_com_api.setValue(param.object, param.row, "eca_yn", "0", (param.type == "GRID"), false, false);
                 gw_com_api.setValue(param.object, param.row, "eca_date", "", (param.type == "GRID"), false, false);
             } else {
                 gw_com_api.setValue(param.object, param.row, "eca_yn", "1", (param.type == "GRID"), false, false);
                 if (gw_com_api.getValue(param.object, param.row, "eca_date", (param.type == "GRID")) == "")
                     gw_com_api.setValue(param.object, param.row, "eca_date", gw_com_api.getDate(), (param.type == "GRID"), false, false);
             }
         } else if (param.element == "eca_date") {
             if (param.value.current == "") {
                 gw_com_api.setValue(param.object, param.row, "eca_yn", "0", (param.type == "GRID"), false, false);
                 gw_com_api.setValue(param.object, param.row, "eca_tp", "", (param.type == "GRID"), false, false);
             } else {
                 gw_com_api.setValue(param.object, param.row, "eca_yn", "1", (param.type == "GRID"), false, false);
             }
         }
     }

 };*/
/*function processItemclick(param) {

    switch (param.element) {
        case "ecr_no":
        case "eco_no":
        case "ecr_no_view":
        case "eco_no_view":
            {
                var ecr_no = gw_com_api.getValue(param.object, param.row, "ecr_no", false, !gw_com_module.v_Object[param.object].option["ecr_no"].edit);
                var eco_no = gw_com_api.getValue(param.object, param.row, "eco_no", false, !gw_com_module.v_Object[param.object].option["eco_no"].edit);
                var tab = (param.element == "eco_no" || param.element == "eco_no_view" ? "ECO" : "ECR");
                var args = {
                    to: "INFO_ECCB",
                    ecr_no: ecr_no,
                    eco_no: eco_no,
                    tab: tab
                };
                gw_com_site.linkPage(args);
            }
            break;
        case "download":
            {
                var args = {
                    source: {
                        id: param.object, row: param.row
                    },
                    targetid: "lyrDown"
                };
                gw_com_module.downloadFile(args);
            }
            break;
        default:
            {
                return false;
            }
            break;
    }

};*/
/*function processItemdblclick(param) {

    if (param.object == "grdData_모델") {
        if (param.element == "proj_key") {
            v_global.event.type = param.type;
            v_global.event.object = param.object;
            v_global.event.row = param.row;
            v_global.event.element = param.element;
            var args = {
                type: "PAGE", page: "w_find_proj_mrp", title: "Project 검색",
                width: 1000, height: 460, open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_proj_mrp",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selectProject_MRP
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
    }

}*/
/*function processKeyup(param) {

    if (param.object == "grdData_모델") {
        if (param.element == "proj_key") {
            if (event.keyCode == 46) {
                gw_com_api.setValue(param.object, param.row, param.element, "", (param.type == "GRID"));
            }
        }

    }
}*/
/*function processRowselecting(param) {

    v_global.process.current.row = param.row;
    v_global.process.handler = function () {
        gw_com_api.selectRow(param.object, v_global.process.current.row, true, false);
    };
    var args = {
        target: [
            { type: "GRID", id: "grdData_PJT" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}*/
/*        function processRowselected(param) {

            processRetrieve(param);

        }*/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Edit
//------ 2021-05-24 by KYT
function processADD(param) {

    if (param.object == "lyrMenu") {
        v_global.process.handler = processInsert;
        if (!checkUpdatable({})) return;
        processInsert({});
    } else if (param.object == "lyrMenu_모델") {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ pjt: true, check: true })) return false;
        processModel({});
    } else if (param.object == "lyrMenu_PJT") {
        if (!checkManipulate({})) return;
        var row = gw_com_api.getSelectedRow("grdData_모델");
        if (row == null) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }
        processProject({});

    } else if (param.object == "lyrMenu_FILE") {
        //2021-05-24 by KYT
        processFileUpload(param)

    }
}
//------
function processInsert(param) {

    if (param.sub) {
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_root_no", value: param.key },
                    { name: "arg_eco_no", value: param.key },
                    { name: "arg_ecr_no", value: param.ecr_no }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_모델", query: "w_eccb4050_I_1", crud: "insert" },
                { type: "FORM", id: "frmData_내역_2" },
                { type: "GRID", id: "grdData_모델_2" }
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
                { name: "dept_area", value: param.data.dept_area },
                { name: "ecr_no", value: param.data.ecr_no },
                { name: "eco_no", value: param.data.eco_no },
                { name: "issue_no", value: param.data.issue_no },
                { name: "eca_title", value: param.data.ecr_title },
                { name: "eca_dt", value: gw_com_api.getDate("") },
                { name: "eca_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "eca_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "eca_emp_nm", value: gw_com_module.v_Session.USR_NM }
            ],
            clear: [
                { type: "GRID", id: "grdData_모델" },
                { type: "GRID", id: "grdData_PJT" },
                { type: "GRID", id: "grdData_첨부" },
                { type: "FORM", id: "frmData_내역_2" },
                { type: "GRID", id: "grdData_모델_2" }
            ]
        };
        gw_com_module.formInsert(args);

        processInsert({ sub: true, key: param.data.eco_no, ecr_no: param.data.ecr_no });
    }
    else {
        var args = {
            type: "PAGE", page: "w_find_eca_item", title: "ECA 대상 선택",
            width: 1000, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_eca_item",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectECOItem
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "GRID", id: "grdData_PJT" },
            { type: "GRID", id: "grdData_첨부" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//------
function successSave(response, param) {

    var stop = false;
    $.each(response, function () {
        var query = this.QUERY;
        $.each(this.KEY, function () {
            if (this.NAME == "eca_no"
                || (this.NAME == "root_no"
                    && (query == "w_eccb4050_S_1" || query == "w_eccb4050_S_2_1" || query == "w_eccb4050_S_2_2"))) {
                v_global.logic.key = this.VALUE;
                stop = true;
                return false;
            }
        });
        if (stop) return false;
    });
    var k = getECKey({ eca_no: v_global.logic.key });
    v_global.logic.key2 = k.eco_no;
    v_global.logic.key3 = k.ecr_no;

    //// 신규 등록 시 알람메일 발송
    //if (checkCRUD({}) == "create")
    //    sendMail({ eca_no: v_global.logic.key });

    processRetrieve({ param: v_global.logic });

}
//------ 2021-05-24 by KYT
function processDEL(param) {

    if (param.object == "lyrMenu") {
        if (!checkManipulate({})) return;
        v_global.process.handler = processRemove;
        checkRemovable({});
    } else if (param.object == "lyrMenu_모델") {
        if (!checkManipulate({})) return;
        //var args = { targetid: "grdData_모델", row: "selected", select: true }
        //gw_com_module.gridDelete(args);
        var status = gw_com_api.getCRUD("grdData_모델", "selected", true);
        if (status == "initialize" || status == "create") {
            gw_com_module.objClear({ target: [{ type: "GRID", id: "grdData_PJT" }] });
            var args = { targetid: "grdData_모델", row: "selected", remove: true, select: true };
            gw_com_module.gridDelete(args);
        } else {
            var p = {
                handler: function () {
                    var args = {
                        url: "COM",
                        target: [
                            { type: "GRID", id: "grdData_모델", key: [{ row: "selected", element: [{ name: "root_no" }, { name: "root_seq" }, { name: "model_seq" }] }] }
                        ],
                        handler: {
                            success: function () {
                                gw_com_module.objClear({ target: [{ type: "GRID", id: "grdData_PJT" }] });
                                gw_com_module.gridDelete({ targetid: "grdData_모델", row: "selected", remove: true, select: true });
                            }
                        }
                    };
                    gw_com_module.objRemove(args);
                }
            };
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);
        }
    } else if (param.object == "lyrMenu_PJT") {
        if (!checkManipulate({})) return;
        var args = { targetid: "grdData_PJT", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    } else if (param.object == "lyrMenu_FILE") {
        if (!checkManipulate({})) return;
        var args = { targetid: "grdData_첨부", row: "selected" }
        gw_com_module.gridDelete(args);
    }
}
//------
function processRemove(param) {

    var args = {
        target: [
            {
                type: "FORM", id: "frmData_내역",
                key: { element: [{ name: "eca_no" }] }
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//------
function processDelete(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "GRID", id: "grdData_PJT" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "FORM", id: "frmData_내역_2" },
            { type: "GRID", id: "grdData_모델_2" }
        ]
    };
    gw_com_module.objClear(args);

}
//------ 2021-05-24 by KYT
function processCOPY(param) {

    if (!checkManipulate({})) return;
    var row = gw_com_api.getSelectedRow("grdData_모델");
    if (row == null) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return false;
    }
    var args = {
        targetid: "grdData_모델", edit: true, updatable: true,
        data: [
            { name: "root_no", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "root_no", true) },
            { name: "root_seq", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "root_seq", true) },
            { name: "cust_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_nm", true) },
            { name: "cust_dept_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_dept_nm", true) },
            { name: "prod_type_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_type_nm", true) },
            { name: "cust_proc_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_proc_nm", true) },
            { name: "prod_cd", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true) },
            { name: "prod_nm", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true) },
            { name: "prod_no", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_no", true) },
            { name: "eca_date", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "eca_date", true) },
            { name: "cust_emp", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_emp", true) },
            { name: "eca_yn", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "eca_yn", true) },
            { name: "eca_tp", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "eca_tp", true) },
            { name: "pm_yn", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "pm_yn", true) },
            { name: "prod_type", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true) },
            { name: "cust_cd", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true) },
            { name: "cust_dept", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true) },
            { name: "cust_proc", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true) },
            { name: "prod_key", rule: "COPY", row: row, value: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true) },
            { name: "model_seq", rule: "INCREMENT", value: 1 }
        ]
    };
    var row = gw_com_module.gridInsert(args);
    var args = { object: "grdData_모델", row: row, element: "proj_key", type: "GRID" };
    processItemdblclick(args);

}
//------ 2021-05-24 by KYT
function processClose(param) {


    if (!checkUpdatable({})) return;
    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);


}
//------ 2021-05-24 by KYT
function processModify() {

    if (!checkManipulate({})) return;
    if (gw_com_api.getSelectedRow("grdData_모델") == null) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return false;
    }
    processModel({ modify: true });

}
//------ 2021-05-24 by KYT
function processMail(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    var row = gw_com_api.getSelectedRow("grdData_모델");
    if (row == null) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
        //} else if (gw_com_api.getValue("grdData_모델", "selected", "eca_yn", true) != "1") {
        //    gw_com_api.messageBox([{ text: "승인되지 않은 내역입니다." }]);
        //    return;
    } else if (gw_com_api.getValue("grdData_모델", "selected", "eca_tp", true) == "") {
        gw_com_api.messageBox([{ text: "승인구분이 입력되지 않았습니다." }]);
        return;
    }
    var args = {
        eca_no: gw_com_api.getValue("grdData_모델", row, "root_no", true),
        root_seq: gw_com_api.getValue("grdData_모델", row, "root_seq", true),
        model_seq: gw_com_api.getValue("grdData_모델", row, "model_seq", true)
    };
    sendMail(args);
}
//------
function sendMail(param) {

    var args = {
        request: "DATA",
        name: "w_eccb4050_mail",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=w_eccb4050_mail" +
            "&QRY_COLS=subject,body" +
            "&CRUD=R" +
            "&arg_eca_no=" + param.eca_no + "&arg_root_seq=" + param.root_seq + "&arg_model_seq=" + param.model_seq,
        async: false,
        param: param,
        handler_success: function (type, name, data) {

            var param = {
                eca_no: this.param.eca_no,
                subject: data.DATA[0],
                body: data.DATA[1]
            }
            var args = {
                request: "DATA",
                name: "w_eccb4050_mail_recipients",
                url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=w_eccb4050_mail_recipients" +
                    "&QRY_COLS=name,value" +
                    "&CRUD=R" +
                    "&arg_eca_no=" + param.eca_no,
                async: false,
                param: param,
                handler_success: function (type, name, data) {

                    var to = new Array();
                    $.each(data, function () {
                        if (this.DATA[1] == "") return false;
                        to.push({
                            name: this.DATA[0],
                            value: this.DATA[1]
                        })
                    });
                    var args = {
                        url: "COM",
                        subject: this.param.subject,
                        body: this.param.body,
                        to: to,
                        html: true,
                        edit: true
                    };
                    gw_com_module.sendMail(args);

                }
            };
            gw_com_module.callRequest(args);

        }
    };
    gw_com_module.callRequest(args);


}
//------ 2021-05-24 by KYT
function processCancel(param) {
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    if (gw_com_api.getRowCount("grdData_PJT") == 0) {
        gw_com_api.messageBox([{ text: "적용 프로젝트가 없습니다." }]);
        return;
    }

    ////var ids = gw_com_api.getRowIDs("grdData_PJT");
    ////var validate = false;
    ////$.each(ids, function () {
    ////    if (gw_com_api.getValue("grdData_PJT", this, "pmout_yn", true) == "1"
    ////        && gw_com_api.getValue("grdData_PJT", this, "apply_yn", true) == "0") {
    ////        validate = true;
    ////        return false;
    ////    }
    ////});

    ////if (!validate) {
    ////    gw_com_api.messageBox([{ text: "합의요청 대상이 없습니다." }]);
    ////    return;
    ////}

    //var p = {
    //    handler: requestAgreement,
    //    param: {
    //        root_no: gw_com_api.getValue("grdData_모델", "selected", "root_no", true),
    //        root_seq: gw_com_api.getValue("grdData_모델", "selected", "root_seq", true),
    //        model_seq: gw_com_api.getValue("grdData_모델", "selected", "model_seq", true),
    //        req_yn: (param.element == "합의요청" ? "1" : "0")
    //    }
    //};
    //gw_com_api.messageBox([{ text: param.element + " 하시겠습니까?" }], undefined, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);


    v_global.event.data = {
        eca_no: gw_com_api.getValue("frmData_내역", 1, "eca_no"),
        req_yn: (param.element == "합의요청" ? "1" : 0)
    };
    var args = {
        page: "w_eccb4055",
        param: {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: v_global.event.data
        }
    };
    gw_com_module.dialogueOpen(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Event
//------
function processItemchanged(param) {

    if (param.object == "grdData_모델") {
        //if (param.element == "eca_yn") {
        //    if (param.value.current == "0") {
        //        gw_com_api.setValue(param.object, param.row, "eca_date", "", (param.type == "GRID"));
        //        gw_com_api.setValue(param.object, param.row, "eca_tp", "", (param.type == "GRID"));
        //    } else {
        //        if (gw_com_api.getValue(param.object, param.row, "eca_date", (param.type == "GRID")) == "") {
        //            gw_com_api.setValue(param.object, param.row, "eca_date", gw_com_api.getDate(), (param.type == "GRID"));
        //        }
        //    }
        //}
        if (param.element == "eca_tp") {
            if (param.value.current == "") {
                gw_com_api.setValue(param.object, param.row, "eca_yn", "0", (param.type == "GRID"), false, false);
                gw_com_api.setValue(param.object, param.row, "eca_date", "", (param.type == "GRID"), false, false);
            } else {
                gw_com_api.setValue(param.object, param.row, "eca_yn", "1", (param.type == "GRID"), false, false);
                if (gw_com_api.getValue(param.object, param.row, "eca_date", (param.type == "GRID")) == "")
                    gw_com_api.setValue(param.object, param.row, "eca_date", gw_com_api.getDate(), (param.type == "GRID"), false, false);
            }
        } else if (param.element == "eca_date") {
            if (param.value.current == "") {
                gw_com_api.setValue(param.object, param.row, "eca_yn", "0", (param.type == "GRID"), false, false);
                gw_com_api.setValue(param.object, param.row, "eca_tp", "", (param.type == "GRID"), false, false);
            } else {
                gw_com_api.setValue(param.object, param.row, "eca_yn", "1", (param.type == "GRID"), false, false);
            }
        }
    }

};
//------
function processItemclick(param) {

    switch (param.element) {
        case "ecr_no":
        case "eco_no":
        case "ecr_no_view":
        case "eco_no_view":
            {
                var ecr_no = gw_com_api.getValue(param.object, param.row, "ecr_no", false, !gw_com_module.v_Object[param.object].option["ecr_no"].edit);
                var eco_no = gw_com_api.getValue(param.object, param.row, "eco_no", false, !gw_com_module.v_Object[param.object].option["eco_no"].edit);
                var tab = (param.element == "eco_no" || param.element == "eco_no_view" ? "ECO" : "ECR");
                var args = {
                    to: "INFO_ECCB",
                    ecr_no: ecr_no,
                    eco_no: eco_no,
                    tab: tab
                };
                gw_com_site.linkPage(args);
            }
            break;
        case "download":
            {
                var args = {
                    source: {
                        id: param.object, row: param.row
                    },
                    targetid: "lyrDown"
                };
                gw_com_module.downloadFile(args);
            }
            break;
        default:
            {
                return false;
            }
            break;
    }

};
//------
function processItemdblclick(param) {

    if (param.object == "grdData_모델") {
        if (param.element == "proj_key") {
            v_global.event.type = param.type;
            v_global.event.object = param.object;
            v_global.event.row = param.row;
            v_global.event.element = param.element;
            var args = {
                type: "PAGE", page: "w_find_proj_mrp", title: "Project 검색",
                width: 1000, height: 460, open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_proj_mrp",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selectProject_MRP
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
    }

}
//------
function processRowselected(param) {

    processRetrieve(param);

}
//------
function processRowselecting(param) {

    v_global.process.current.row = param.row;
    v_global.process.handler = function () {
        gw_com_api.selectRow(param.object, v_global.process.current.row, true, false);
    };
    var args = {
        target: [
            { type: "GRID", id: "grdData_PJT" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//------
function processKeyup(param) {

    if (param.object == "grdData_모델") {
        if (param.element == "proj_key") {
            if (event.keyCode == 46) {
                gw_com_api.setValue(param.object, param.row, param.element, "", (param.type == "GRID"));
            }
        }

    }
}
//------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_내역" },
            { type: "GRID", id: "grdData_모델" },
            { type: "GRID", id: "grdData_PJT" },
            { type: "GRID", id: "grdData_첨부" },
            { type: "FORM", id: "frmData_내역_2" },
            { type: "GRID", id: "grdData_모델_2" }
        ]
    };
    gw_com_module.objClear(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : File
// ref : grdData_첨부, row click event, processRetrieve, msg_openedDialogue, msg_closeDialogue
//------
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ECCB" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_첨부" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: param.data_key == undefined ? "%" : param.data_key },
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
//------
function processFileUpload(param) {
    // 2021-05-18 by KYT
    //if (!checkManipulate({})) return;
    //if (!checkUpdatable({ check: true })) return false;
    //var args = {
    //    type: "PAGE", page: "w_upload_eccb", title: "파일 업로드",
    //    width: 650, height: 200, open: true, //locate: ["center", 600]
    //};
    //if (gw_com_module.dialoguePrepare(args) == false) {
    //    var args = {
    //        page: "w_upload_eccb",
    //        param: {
    //            ID: gw_com_api.v_Stream.msg_upload_ECCB,
    //            data: {
    //                user: gw_com_module.v_Session.USR_ID,
    //                key: gw_com_api.getValue("frmData_내역", 1, "eca_no"),
    //                seq: 1
    //            }
    //        }
    //    };
    //    gw_com_module.dialogueOpen(args);
    //}

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // set data for "File Upload"
    var dataType = "ECCB";    // Set File Data Type
    var dataKey = v_global.logic.key;   // Main Key value for Search
    var dataSeq = 1;   // Main Seq value for Search

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Retrieve
//------
function processRetrieve(param) {

    var args;
    if (param.object == "grdData_모델") {

        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "root_no", argument: "arg_root_no" },
                    { name: "root_seq", argument: "arg_root_seq" },
                    { name: "model_seq", argument: "arg_model_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_PJT", select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };

    } else {

        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_eca_no", value: v_global.logic.key },
                    { name: "arg_eco_no", value: param.param.key2 },
                    { name: "arg_ecr_no", value: param.param.key3 }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_내역" },
                { type: "GRID", id: "grdData_모델", select: true },
                /*{ type: "GRID", id: "grdData_첨부" },*/
                { type: "FORM", id: "frmData_내역_2" },
                { type: "GRID", id: "grdData_모델_2" }
            ],
            clear: [
                { type: "GRID", id: "grdData_PJT" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };

    }
    gw_com_module.objRetrieve(args);
    processFileList({ data_key: v_global.logic.key });

}
//------
function processRetrieveEnd(param) {


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

    var args;
    if (param.pjt) {
        args = {
            check: param.check,
            target: [
                { type: "GRID", id: "grdData_PJT" }
            ],
            param: param
        };
    } else {
        args = {
            check: param.check,
            target: [
                { type: "FORM", id: "frmData_내역" },
                { type: "GRID", id: "grdData_모델" },
                { type: "GRID", id: "grdData_PJT" },
                { type: "GRID", id: "grdData_첨부" }
            ],
            param: param
        };
    }
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Page
//------
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
//------
function processModel(param) {

    v_global.logic.modeling = param.modify;

    var args = {
        type: "PAGE",
        page: "w_find_prod_eccb_eca",
        title: "제품 모델 선택",
        width: 900,
        height: 440,
        open: true
    };

    v_global.event.model = {
        prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
        prod_type_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_type_nm", true),
        cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
        cust_dept: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true),
        cust_proc: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true),
        prod_cd: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true),
        prod_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true),
        prod_key: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true),
        dept_area: gw_com_api.getValue("frmData_내역", 1, "dept_area"),
        root_no: gw_com_api.getValue("frmData_내역", 1, "eco_no")
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_prod_eccb_eca",
            param: {
                ID: gw_com_api.v_Stream.msg_selectProduct_ECCB
            }
        };
        args.param.data = v_global.event.model;
        gw_com_module.dialogueOpen(args);
    }

}
//------
function processProject(param) {

    v_global.event.type = "GRID";
    v_global.event.object = "grdData_PJT";

    v_global.event.data = {
        cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
        prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
        multi: true
    };

    var args = {
        type: "PAGE", page: "w_find_proj_mrp", title: "Project 검색",
        width: 1000, height: 460, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_proj_mrp",
            param: {
                ID: gw_com_api.v_Stream.msg_selectProject_MRP,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }


}
//------
function requestAgreement(param) {

    var args = {
        url: "COM",
        procedure: "sp_EDM_ECAReqAgree",
        nomessage: true,
        input: [
            { name: "root_no", value: param.root_no, type: "varchar" },
            { name: "root_seq", value: param.root_seq, type: "varchar" },
            { name: "model_seq", value: param.model_seq, type: "varchar" },
            { name: "req_yn", value: param.req_yn, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successApproval,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//------
function successApproval(response, param) {

    if (response.VALUE[0] > 0) {
        var p = {
            handler: processRetrieve,
            param: {
                object: "grdData_모델",
                row: "selected",
                type: "GRID"
            }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], undefined, undefined, undefined, p);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[1] }], 500);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Other
//------
function getECKey(param) {

    var rtn = {
        eca_no: "",
        eco_no: "",
        ecr_no: ""
    }
    var args = {
        request: "DATA",
        name: "w_eccb4050_M_1",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=w_eccb4050_M_1" +
            "&QRY_COLS=eca_no,eco_no,ecr_no" +
            "&CRUD=R" +
            "&arg_eca_no=" + param.eca_no,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        rtn.eca_no = data.DATA[0];
        rtn.eco_no = data.DATA[1];
        rtn.ecr_no = data.DATA[2];

    }
    return rtn;

}
//------
function getPMInfo(proj_no) {

    var rtn = {
        pm_yn: "0",
        pm_rate: "0"
    };

    var args = {
        request: "DATA",
        name: "w_eccb4050_chk_pm",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=w_eccb4050_chk_pm" +
            "&QRY_COLS=pm_yn,pm_rate" +
            "&CRUD=R" +
            "&arg_proj_no=" + proj_no,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        rtn = {
            pm_yn: data.DATA[0],
            pm_rate: data.DATA[1]
        };

    }
    return rtn;

}

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
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                } else
                                    processRemove(param.data.arg);
                            }
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
                                } else
                                    processBatch(param.data.arg);
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
        case gw_com_api.v_Stream.msg_selectedECOItem:
            {
                processInsert({ master: true, data: param.data });
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_ECCB:
            {
                if (v_global.logic.modeling) {
                    gw_com_api.setValue("grdData_모델", "selected", "prod_type", (param.data.prod_type != "%") ? param.data.prod_type : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_type_nm", (param.data.prod_type != "%") ? param.data.prod_type_nm : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_cd", (param.data.cust_cd != "%") ? param.data.cust_cd : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_nm", (param.data.cust_cd != "%") ? param.data.cust_nm : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_dept", (param.data.cust_dept != "%") ? param.data.cust_dept : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_proc", (param.data.cust_proc != "%") ? param.data.cust_proc : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_key", (param.data.prod_cd != "") ? param.data.prod_key : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_cd", (param.data.prod_cd != "") ? param.data.prod_cd : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_nm", (param.data.prod_cd != "") ? param.data.prod_nm : " ", true);
                    if (gw_com_api.getCRUD("grdData_모델", "selected", true) == "retrieve")
                        gw_com_api.setUpdatable("grdData_모델", gw_com_api.getSelectedRow("grdData_모델"), true);
                }
                else {
                    var args = {
                        targetid: "grdData_모델",
                        edit: true,
                        updatable: true,
                        data: [
                            {
                                name: "root_no",
                                value: v_global.logic.key
                            },
                            { name: "root_seq", value: 1 }
                        ]
                    };
                    if (param.data.prod_type != "%") {
                        args.data.push({ name: "prod_type", value: param.data.prod_type });
                        args.data.push({ name: "prod_type_nm", value: param.data.prod_type_nm });
                    }
                    if (param.data.cust_cd != "%") {
                        args.data.push({ name: "cust_cd", value: param.data.cust_cd });
                        args.data.push({ name: "cust_nm", value: param.data.cust_nm });
                    }
                    if (param.data.cust_dept != "%") {
                        args.data.push({ name: "cust_dept", value: param.data.cust_dept });
                        args.data.push({ name: "cust_dept_nm", value: param.data.cust_dept });
                    }
                    if (param.data.cust_proc != "%") {
                        args.data.push({ name: "cust_proc", value: param.data.cust_proc });
                        args.data.push({ name: "cust_proc_nm", value: param.data.cust_proc });
                    }
                    if (param.data.prod_key != "") {
                        args.data.push({ name: "prod_key", value: param.data.prod_key });
                        args.data.push({ name: "prod_cd", value: param.data.prod_cd });
                        args.data.push({ name: "prod_nm", value: param.data.prod_nm });
                    }
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
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_eca_no", value: gw_com_api.getValue("frmData_내역", 1, "eca_no") }
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

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = {
                    url: "COM",
                    procedure: "PROC_APPROVAL_ECA",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" }/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "eca_no", value: v_global.logic.key, type: "varchar" },
                        { name: "gw_key", value: gw_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: {
                        success: successApproval
                    }
                };
                gw_com_module.callProcedure(args);
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
                    case "w_find_eca_item":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectECOItem;
                        }
                        break;
                    case "w_find_prod_eccb_eca":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_ECCB;
                            args.data = v_global.event.model;
                        }
                        break;
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "w_find_proj_mrp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_MRP;
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
                    case "w_eccb4055":
                        {
                            if (param.data != undefined)
                                processRetrieve({ object: "grdData_모델", row: "selected", type: "GRID" });
                        }
                        break;
                    case "SYS_FileUpload":
                        {
                            processFileList({
                                data_key: v_global.logic.key
                            });
                        }
                }
                closeDialogue({ page: param.from.page });

            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_MRP:
            {
                if (v_global.event.object == "grdData_모델") {
                    gw_com_api.setValue(v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        param.data.proj_no,
                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
                        v_global.event.row,
                        "proj_nm",
                        param.data.proj_nm,
                        (v_global.event.type == "GRID") ? true : false);
                } else {

                    var data = new Array();
                    $.each(param.data, function () {
                        if (gw_com_api.getFindRow(v_global.event.object, "proj_key", this.proj_no) == -1) {
                            var pm_inf = getPMInfo(this.proj_no);
                            this.root_no = gw_com_api.getValue("grdData_모델", "selected", "root_no", true);
                            this.root_seq = gw_com_api.getValue("grdData_모델", "selected", "root_seq", true);
                            this.model_seq = gw_com_api.getValue("grdData_모델", "selected", "model_seq", true);
                            this.proj_key = this.proj_no;
                            this.apply_yn = (pm_inf.pm_yn == "1") ? "0" : "1";
                            //this.apply_yn_view = this.apply_yn;
                            this.pmout_yn = pm_inf.pm_yn;
                            this.pmout_yn_view = this.pmout_yn;
                            this.pm_rate = pm_inf.pm_rate;
                            this.cur_pm_rate = pm_inf.pm_rate;
                            this.pmagr_yn = "0";
                            this.pmagr_yn_view = "0";
                            data.push(this);
                        }
                    });
                    if (data.length > 0) {
                        var args = { targetid: v_global.event.object, edit: true, updatable: true, data: data };
                        gw_com_module.gridInserts(args);
                    }

                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}
