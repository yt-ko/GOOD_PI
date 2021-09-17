//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : ECCB 심의 관리
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
// Define gw_job_process class : 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue. ---그룹웨어 로그인
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        var args = {
            request: [
                { type: "PAGE", name: "심의결과", query: "dddw_result_cd" },
                {
                    type: "PAGE", name: "우선순위", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB22" }]
                },
                {
                    type: "PAGE", name: "분류1", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB05" }]
                },
                {
                    type: "PAGE", name: "분류2", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB06" }]
                },
                {
                    type: "PAGE", name: "분류3", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB07" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" },
                {
                    type: "PAGE", name: "ECR구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB02" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // go next.
        //------
        function start() {
            v_global.logic.eccb_tp = gw_com_api.getPageParameter("ECCB_TP");
            gw_job_process.uiButton();
            gw_job_process.uiData();
            gw_job_process.uiEvent();

            //add by kyt 2021-05-26
            gw_com_module.startPage();
            if (v_global.process.param != "") {
                v_global.logic.key = gw_com_api.getPageParameter("eccb_no");
                if (v_global.logic.key == "")
                    processInsert({});
                else
                    processRetrieve({ key: v_global.logic.key });
            } else
                processInsert({});
        }

    },
    // create UI - Button
    uiButton: function () {

        //---------- Create Buttons : lyrMenu_Main : 새로고침, 결재상신, 회의 추가, 회의 삭제, 저장, 닫기
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", icon: "조회" },
                //{ name: "평가", value: "제안평가", icon: "실행" },
                { name: "상신", value: "결재상신", icon: "기타" },
                { name: "추가", value: "회의 추가" },
                { name: "삭제", value: "회의 삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //---------- Create Buttons : lyrMenu_Sub : 상세정보, 안건 추가, 안건 수정, 안건 삭제
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE",
            element: [
                { name: "상세", value: "상세정보", icon: "조회" },
                { name: "추가", value: "안건 추가" },
                { name: "수정", value: "안건 수정", icon: "기타" },
                { name: "삭제", value: "안건 삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //---------- Create Buttons : lyrMenu_Sub2 : ECR상세정보, ECO상세정보, 평가안건 추가, 평가안건 삭제, 평가
        var args = {
            targetid: "lyrMenu_Sub2", type: "FREE",
            element: [
                { name: "ECR", value: "ECR상세정보", icon: "조회" },
                { name: "ECO", value: "ECO상세정보", icon: "조회" },
                { name: "추가", value: "평가안건 추가" },
                { name: "삭제", value: "평가안건 삭제" },
                { name: "수정", value: "평가", icon: "기타" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //---------- Create Buttons : lyrMenu_D3 : 예정통보, 결과통보, 참석자 추가, 참석자 삭제
        var args = {
            targetid: "lyrMenu_D3", type: "FREE",
            element: [
                { name: "예정", value: "예정통보", icon: "실행", updatable: true },
                { name: "결과", value: "결과통보", icon: "실행" },
                { name: "추가", value: "참석자 추가" },
                { name: "삭제", value: "참석자 삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //---------- Create Buttons : lyrMenu_D6 : 필수문서 추가, 필수문서 삭제
        var args = {
            targetid: "lyrMenu_D6", type: "FREE",
            element: [
                { name: "추가", value: "필수문서 추가" },
                { name: "삭제", value: "필수문서 삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //---------- Create Buttons : lyrMenu_D7 : ActionItem 추가, ActionItem 삭제
        var args = {
            targetid: "lyrMenu_D7", type: "FREE",
            element: [
                { name: "추가", value: "ActionItem 추가" },
                { name: "삭제", value: "ActionItem 삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //---------- Create Buttons : lyrMenu_File1 : 첨부 추가, 첨부 삭제
        var args = {
            targetid: "lyrMenu_File1", type: "FREE",
            element: [
                { name: "추가", value: "첨부 추가" },
                { name: "삭제", value: "첨부 삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
    },
    // create UI - Data
    uiData: function () {
        //--------- Data Box : frmData_Main : 회의 정보
        var args = {
            targetid: "frmData_Main", query: "w_eccb2020_M_1", type: "TABLE", title: "회의 정보",
            //caption: true,
            show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: {
                width: { label: 100, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "심의번호", format: { type: "label" } },
                            { name: "eccb_no", editable: { type: "hidden" } },
                            { header: true, value: "주관부서", format: { type: "label" } },
                            { name: "mng_dept_nm", editable: { type: "text" }, mask: "search" },
                            { name: "mng_dept", editable: { type: "hidden" }, hidden: true },
                            //{
                            //    name: "mng_dept",
                            //    editable: { type: "select", data: { memory: "부서" } }
                            //},
                            { header: true, value: "시작시각", format: { type: "label" } },
                            { name: "str_time", mask: "time-hm", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "회의장소", format: { type: "label" } },
                            { name: "meet_place", editable: { type: "text" } },
                            { header: true, value: "회의일자", format: { type: "label" } },
                            {
                                name: "meet_dt", mask: "date-ymd",
                                editable: { type: "text" }
                            },
                            {
                                header: true, value: "종료시각",
                                format: { type: "label" }
                            },
                            {
                                name: "end_time", mask: "time-hm",
                                editable: { type: "text" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "meet_title", style: { colspan: 3 },
                                format: { width: 622 },
                                editable: { type: "text", width: 620 }
                            },
                            { header: true, value: "장비군", format: { type: "label" } },
                            {
                                name: "dept_area",
                                editable: { type: "select", data: { memory: "DEPT_AREA_IN" }, validate: { rule: "required" } }
                            }
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
                            { name: "adate", editable: { type: "hidden" }, hidden: true },
                            { name: "eccb_tp", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //--------- Data Box : grdData_Sub : 협의 안건
        var args = {
            targetid: "grdData_Sub", query: "w_eccb2020_S_1", title: "협의 안건",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
                { header: "구분", name: "root_type", width: 50, align: "center", editable: { type: "hidden" } },
                { header: "등록번호", name: "root_no", width: 100, align: "center", editable: { type: "hidden" } },
                { header: "개선제안명", name: "root_title", width: 350, align: "left" },
                { header: "ECR구분", name: "ecr_tp_nm", width: 70, align: "center" },
                { header: "Level", name: "crm_tp_nm", width: 70, align: "center" },
                { header: "제안자", name: "root_emp", width: 70, align: "center" },
                { header: "작성일자", name: "root_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "완료요구일", name: "act_rqst_date", width: 70, align: "center", mask: "date-ymd", editable: { type: "hidden" } },
                { header: "심의결과", name: "result_nm", width: 60, align: "center" },
                { name: "result_cd", hidden: true, editable: { type: "hidden" } },
                { name: "priority_cd", hidden: true, editable: { type: "hidden" } },
                { name: "act_dept1", hidden: true, editable: { type: "hidden" } },
                { name: "act_dept2", hidden: true, editable: { type: "hidden" } },
                { name: "act_dept1_nm", hidden: true },
                { name: "act_dept2_nm", hidden: true },
                { name: "act_emp1", hidden: true, editable: { type: "hidden" } },
                { name: "act_emp1_nm", hidden: true },
                { name: "act_emp2", hidden: true, editable: { type: "hidden" } },
                { name: "act_emp2_nm", hidden: true },
                { name: "item_note", hidden: true, editable: { type: "hidden" } },
                { name: "ecr_no", hidden: true, editable: { type: "hidden" } },
                { name: "cip_no", hidden: true, editable: { type: "hidden" } },
                { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                { name: "eccb_no", hidden: true, editable: { type: "hidden" } },
                { name: "ecr_tp", hidden: true, editable: { type: "hidden" } },
                { name: "req_doc", hidden: true, editable: { type: "hidden" } },
                { name: "req_doc_nm", hidden: true },
                { name: "agreement_emp", hidden: true, editable: { type: "hidden" } },
                { name: "agreement_emp_nm", hidden: true },
                { name: "eca_yn", hidden: true, editable: { type: "hidden" } },
                { name: "astat", hidden: true, editable: { type: "hidden" } },
                { name: "aemp", hidden: true, editable: { type: "hidden" } }//,
                //{ name: "adate", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //--------- Data Box : frmData_D1 : 협의 안건
        var args = {
            targetid: "frmData_D1", query: "w_eccb2020_S_2", type: "TABLE", title: "협의 안건",
            show: true, selectable: true,
            editable: { bind: "select", focus: "result_cd", validate: true },
            content: {
                width: { label: 120, field: 230 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "등록번호", format: { type: "label" } },
                            { name: "root_no", editable: { type: "hidden" } },
                            { header: true, value: "실행부서", format: { type: "label" } },
                            { name: "act_dept1_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "act_emp1_nm", mask: "search", display: true, editable: { type: "text" } },
                            { name: "act_dept1", hidden: true, editable: { type: "hidden" } },
                            { name: "act_emp1", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "심의결과", format: { type: "label" } },
                            {
                                name: "result_cd",
                                format: { type: "select", data: { memory: "심의결과" } },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "심의결과"//,
                                        //by: [{ source: { id: "grdData_Sub", row: "selected", key: "root_type", grid: true } }]
                                    }
                                }
                            },
                            { header: true, value: "실행부서", format: { type: "label" } },
                            { name: "act_dept2_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "act_emp2_nm", mask: "search", display: true, editable: { type: "text" } },
                            { name: "act_dept2", hidden: true, editable: { type: "hidden" } },
                            { name: "act_emp2", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "우선순위", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "priority_cd",
                                format: { type: "select", data: { memory: "우선순위" }, width: 622 },
                                editable: { type: "select", data: { memory: "우선순위" }, width: 620 }
                            },
                            { header: true, value: "완료요구일", format: { type: "label" } },
                            { name: "act_rqst_date", editable: { type: "text" }, mask: "date-ymd", display: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "ECR구분", format: { type: "label" } },
                            {
                                name: "ecr_tp",
                                format: { type: "select", data: { memory: "ECR구분" } },
                                editable: { type: "select", data: { memory: "ECR구분" } }
                            },
                            { header: true, value: "", format: { type: "label" } },
                            { name: "" },
                            { header: true, value: "ECA 적용", format: { type: "label" } },
                            {
                                name: "eca_yn",
                                format: { type: "checkbox", title: "", value: 1, offval: 0 },
                                editable: { type: "checkbox", title: "", value: 1, offval: 0 }
                            }
                            //{ header: true, value: "필수첨부문서", format: { type: "label" } },
                            //{ name: "req_doc_nm", editable: { type: "text" }, mask: "search" },
                            //{ name: "req_doc", editable: { type: "hidden" }, hidden: true },
                            //{ header: true, value: "합의자", format: { type: "label" } },
                            //{ name: "agreement_emp_nm", editable: { type: "text" }, mask: "search" },
                            //{ name: "agreement_emp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "협의내용", format: { type: "label" } },
                            {
                                style: { colspan: 5 },
                                name: "item_note", format: { type: "textarea", rows: 4, width: 988 },
                                editable: { type: "textarea", rows: 4, width: 988 }
                            },
                            { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                            { name: "eccb_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //=====================================================================================
        //var args = {
        //    targetid: "frmData_D4", query: "w_eccb1020_M_1", type: "TABLE", title: "MP 분류",
        //    caption: true, show: true, selectable: true,
        //    editable: { bind: "select", focus: "pstat", validate: true },
        //    content: {
        //        width: { label: 100, field: 780 }, height: 25,
        //        row: [
        //            {
        //                element: [
        //                    { style: { rowspan: 3 }, header: true, value: "분류", format: { type: "label" } },
        //                    {
        //                        style: { colspan: 5, colfloat: "float" }, name: "act_region1", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류1", unshift: [{ title: "-", value: "" }] }, width: 155 }
        //                    },
        //                    { style: { colfloat: "floating" }, name: "act_region1_text", format: { width: 200 } },
        //                    { style: { colfloat: "floating" }, name: "act_module1_text", format: { width: 300 } },
        //                    {
        //                        style: { colfloat: "floating" }, name: "act_module1_sel", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, width: 155 },
        //                        display: true
        //                    },
        //                    {
        //                        style: { colfloat: "floating" }, name: "act_module1_etc", format: { width: 0 },
        //                        editable: { type: "text", width: 155 },
        //                        display: true
        //                    },
        //                    { name: "act_module1", hidden: true, editable: { type: "hidden" } },
        //                    {
        //                        style: { colfloat: "floating" },
        //                        name: "mp_class1_text", format: { width: 200 }
        //                    },
        //                    {
        //                        style: { colfloat: "floating" }, name: "mp_class1_sel", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 },
        //                        display: true
        //                    },
        //                    {
        //                        style: { colfloat: "floated" }, name: "mp_class1_etc", format: { width: 0 },
        //                        editable: { type: "text", width: 155 },
        //                        display: true
        //                    },
        //                    { name: "mp_class1", hidden: true, editable: { type: "hidden" } }
        //                ]
        //            },
        //            {
        //                element: [
        //                    {
        //                        style: { colspan: 5, colfloat: "float" }, name: "act_region2", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류1", unshift: [{ title: "-", value: "" }] }, width: 155 }
        //                    },
        //                    { style: { colfloat: "floating" }, name: "act_region2_text", format: { width: 200 } },
        //                    { style: { colfloat: "floating" }, name: "act_module2_text", format: { width: 300 } },
        //                    {
        //                        style: { colfloat: "floating" }, name: "act_module2_sel", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, width: 155 },
        //                        display: true
        //                    },
        //                    {
        //                        style: { colfloat: "floating" }, name: "act_module2_etc", format: { width: 0 },
        //                        editable: { type: "text", width: 155 },
        //                        display: true
        //                    },
        //                    { name: "act_module2", hidden: true, editable: { type: "hidden" } },
        //                    { style: { colfloat: "floating" }, name: "mp_class2_text", format: { width: 200 } },
        //                    {
        //                        style: { colfloat: "floating" }, name: "mp_class2_sel", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 },
        //                        display: true
        //                    },
        //                    {
        //                        style: { colfloat: "floated" }, name: "mp_class2_etc", format: { width: 0 },
        //                        editable: { type: "text", width: 155 },
        //                        display: true
        //                    },
        //                    { name: "mp_class2", hidden: true, editable: { type: "hidden" } }
        //                ]
        //            },
        //            {
        //                element: [
        //                    {
        //                        style: { colspan: 5, colfloat: "float" }, name: "act_region3", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류1", unshift: [{ title: "-", value: "" }] }, width: 155 }
        //                    },
        //                    { style: { colfloat: "floating" }, name: "act_region3_text", format: { width: 200 } },
        //                    { style: { colfloat: "floating" }, name: "act_module3_text", format: { width: 300 } },
        //                    {
        //                        style: { colfloat: "floating" }, name: "act_module3_sel", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류2", unshift: [{ title: "-", value: "" }] }, width: 155 },
        //                        display: true
        //                    },
        //                    {
        //                        style: { colfloat: "floating" }, name: "act_module3_etc", format: { width: 0 },
        //                        editable: { type: "text", width: 155 },
        //                        display: true
        //                    },
        //                    { name: "act_module3", hidden: true, editable: { type: "hidden" } },
        //                    { style: { colfloat: "floating" }, name: "mp_class3_text", format: { width: 200 } },
        //                    {
        //                        style: { colfloat: "floating" }, name: "mp_class3_sel", format: { width: 0 },
        //                        editable: { type: "select", data: { memory: "분류3", unshift: [{ title: "-", value: "" }] }, width: 155 },
        //                        display: true
        //                    },
        //                    {
        //                        style: { colfloat: "floated" }, name: "mp_class3_etc", format: { width: 0 },
        //                        editable: { type: "text", width: 155 },
        //                        display: true
        //                    },
        //                    { name: "mp_class3", hidden: true, editable: { type: "hidden" } },
        //                    { name: "ecr_no", hidden: true, editable: { type: "hidden" } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        //=====================================================================================

        //--------- Data Box : frmData_D2 : 회의 비고
        var args = {
            targetid: "frmData_D2", query: "w_eccb2020_M_2", type: "TABLE", title: "회의 비고",
            caption: true, width: "100%", show: true, selectable: true,
            editable: { bind: "select", /*focus: "meet_note",*/ validate: true },
            content: { height: 25, width: { label: 100, field: 770 },
                row: [
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "meet_note", format: { type: "textarea", rows: 5, width: 900 },
                                editable: { type: "textarea", rows: 5, width: 900 }
                            },
                            { name: "eccb_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //--------- Data Box : grdData_Sub2 : 평가 안건
        var args = {
            targetid: "grdData_Sub2", query: "w_eccb2020_S_5", title: "평가 안건", caption: true,
            height: "100%", pager: false, show: true, //selectable: true,
            editable: { master: true, multi: true, bind: "select", validate: true },
            element: [
                { header: "ECR No.", name: "ecr_no", width: 100, align: "center" },
                { header: "개선제안명", name: "ecr_title", width: 350 },
                { header: "제안자", name: "ecr_emp", width: 70, align: "center" },
                { header: "제안일자", name: "ecr_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "ECO No.", name: "eco_no", width: 100, align: "center" },
                { header: "ECO작성자", name: "eco_emp", width: 70, align: "center" },
                { header: "1차평가점수", name: "evl1_point", width: 60, align: "center", hidden: true },
                { header: "1차평가등급", name: "evl1_grade", width: 60, align: "center" },
                { header: "2차평가점수", name: "evl2_point", width: 60, align: "center", hidden: true },
                { header: "2차평가등급", name: "evl2_grade", width: 60, align: "center" },
                { name: "eccb_no", hidden: true, editable: { type: "hidden" } },
                { name: "evl_no", hidden: true, editable: { type: "hidden" } },
                { name: "evl_rmk", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //--------- Data Box : grdData_D3 : 참석자
        var args = {
            targetid: "grdData_D3", query: "w_eccb2020_S_3", title: "참석자",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
                { header: "부서", name: "attend_dept1_nm", width: 120, align: "center" },
                {
                    header: "성명", name: "attend_emp1_nm", width: 100, align: "center", mask: "search",
                    editable: { type: "text" }, display: true
                },
                {
                    header: "참석", name: "attend_yn1", width: 30, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { header: "부서", name: "attend_dept2_nm", width: 120, align: "center" },
                {
                    header: "성명", name: "attend_emp2_nm", width: 100, align: "center", width: 100, align: "center", mask: "search",
                    editable: { type: "text" }, display: true
                },
                {
                    header: "참석", name: "attend_yn2", width: 30, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { header: "부서", name: "attend_dept3_nm", width: 120, align: "center" },
                {
                    header: "성명", name: "attend_emp3_nm", width: 100, align: "center", width: 100, align: "center", mask: "search",
                    editable: { type: "text" }, display: true
                },
                {
                    header: "참석", name: "attend_yn3", width: 30, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { name: "attend_dept1", hidden: true, editable: { type: "hidden" } },
                { name: "attend_emp1", hidden: true, editable: { type: "hidden" } },
                { name: "attend_dept2", hidden: true, editable: { type: "hidden" } },
                { name: "attend_emp2", hidden: true, editable: { type: "hidden" } },
                { name: "attend_dept3", hidden: true, editable: { type: "hidden" } },
                { name: "attend_emp3", hidden: true, editable: { type: "hidden" } },
                { name: "attend_seq", hidden: true, editable: { type: "hidden" } },
                { name: "eccb_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //--------- Data Box : grdData_File1 : 첨부 문서
        var args = {
            targetid: "grdData_File1", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                //del by kyt 2021-05-26
                //{ header: "파일명", name: "file_nm", width: 350, align: "left" },
                //{
                //    header: "다운로드", name: "download", width: 60, align: "center",
                //    format: { type: "link", value: "다운로드" }
                //},
                //{
                //    header: "파일설명", name: "file_desc", width: 600, align: "left",
                //    editable: { type: "text" }
                //},
                //{ name: "file_ext", hidden: true },
                //{ name: "file_path", hidden: true },
                //{ name: "network_cd", hidden: true },
                //{ name: "data_tp", hidden: true },
                //{ name: "data_key", hidden: true },
                //{ name: "data_seq", hidden: true },
                //{ name: "file_id", hidden: true, editable: { type: "hidden" } }

                //add by kyt 2021-05-26
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

        //--------- Data Box : grdData_D6 : 필수 문서
        var args = {
            targetid: "grdData_D6", query: "w_eccb2020_S_6", title: "필수 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "Item", name: "file_grp_nm", width: 200 },
                {
                    header: "세부내용", name: "file_tp_nm", width: 250,
                    editable: { type: "hidden", width: 498 }
                },
                {
                    header: "담당부서", name: "file_tp_dept", width: 100, align: "center",
                    editable: { type: "hidden", width: 198 }
                },
                { header: "파일", name: "file_upload", width: 50, align: "center", format: { type: "link" } },
                { header: "파일", name: "file_download", width: 50, align: "center", format: { type: "link" } },
                { header: "파일", name: "file_delete", width: 50, align: "center", format: { type: "link" } },
                { name: "ecr_no", editable: { type: "hidden" }, hidden: true },
                { name: "file_tp", editable: { type: "hidden" }, hidden: true },
                { name: "file_id", editable: { type: "hidden" }, hidden: true },
                { name: "fid", editable: { type: "hidden" }, hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_nm", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //--------- Data Box : grdData_D7 : Action Item
        var args = {
            targetid: "grdData_D7", query: "w_eccb2020_S_7", title: "Action Item",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "Item", name: "act_item", width: 1100,
                    editable: { type: "text", maxlength: 200, validate: { rule: "required" } }
                },
                { name: "act_id", editable: { type: "hidden" }, hidden: true },
                { name: "root_no", editable: { type: "hidden" }, hidden: true },
                { name: "root_seq", editable: { type: "hidden" }, hidden: true },
                { name: "ecr_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //--------- create page
        var args = {
            targetid: "lyrDown", width: 0, height: 0, show: false
        };
        gw_com_module.pageCreate(args);

        //=====================================================================================
        // Resize Objects
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "FORM", id: "frmData_D1", offset: 8 },
                //{ type: "FORM", id: "frmData_D4", offset: 8 },
                { type: "FORM", id: "frmData_D2", offset: 8 },
                { type: "GRID", id: "grdData_Sub2", offset: 8 },
                { type: "GRID", id: "grdData_D3", offset: 8 },
                { type: "GRID", id: "grdData_File1", offset: 8 },
                { type: "GRID", id: "grdData_D6", offset: 8 },
                { type: "GRID", id: "grdData_D7", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //del by kyt 2021-05-21
        /*gw_job_process.procedure();*/

    },
    // create UI - Event
    uiEvent: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_Main", element: "상신", event: "click", handler: processApprove };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "조회", event: "click", handler: click_lyrMenu_Main_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "추가", event: "click", handler: click_lyrMenu_Main_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: click_lyrMenu_Main_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "평가", event: "click", handler: click_lyrMenu_Main_평가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_Sub", element: "상세", event: "click", handler: click_lyrMenu_Sub_상세 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "수정", event: "click", handler: click_lyrMenu_Sub_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: click_lyrMenu_Sub_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: click_lyrMenu_Sub_삭제 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_Sub2", element: "ECR", event: "click", handler: click_lyrMenu_Sub2_상세 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub2", element: "ECO", event: "click", handler: click_lyrMenu_Sub2_상세 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub2", element: "추가", event: "click", handler: click_lyrMenu_Sub2_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub2", element: "삭제", event: "click", handler: click_lyrMenu_Sub2_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub2", element: "수정", event: "click", handler: click_lyrMenu_Sub2_수정 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_D3", element: "추가", event: "click", handler: click_lyrMenu_D3_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D3", element: "삭제", event: "click", handler: click_lyrMenu_D3_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D3", element: "예정", event: "click", handler: click_lyrMenu_D3_예정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D3", element: "결과", event: "click", handler: click_lyrMenu_D3_결과 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_D6", element: "추가", event: "click", handler: click_lyrMenu_D6_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D6", element: "삭제", event: "click", handler: click_lyrMenu_D6_삭제 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_D7", element: "추가", event: "click", handler: click_lyrMenu_D7_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_D7", element: "삭제", event: "click", handler: click_lyrMenu_D7_삭제 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_File1", element: "추가", event: "click", handler: click_lyrMenu_File1_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_File1", element: "삭제", event: "click", handler: click_lyrMenu_File1_삭제 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_Main", event: "itemchanged", handler: itemchanged_frmData_Main };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_Main", event: "itemdblclick", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: rowselected_grdData_Sub };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Sub2", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Sub2 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_D1", event: "itemchanged", handler: itemchanged_frmData_D1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1", event: "itemdblclick", handler: itemdblclick_frmData_D1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1", event: "itemkeyenter", handler: itemdblclick_frmData_D1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1", event: "keydown", element: "act_emp1_nm", handler: keypress_frmData_D1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1", event: "keydown", element: "act_emp2_nm", handler: keypress_frmData_D1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1", event: "keydown", element: "req_doc_nm", handler: keypress_frmData_D1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_D1", event: "keydown", element: "agreement_emp_nm", handler: keypress_frmData_D1 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_D3", grid: true, event: "itemdblclick", handler: itemdblclick_grdData_D3 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_D3", grid: true, event: "itemkeyenter", handler: itemdblclick_grdData_D3 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "frmData_D4", event: "itemchanged", handler: itemchanged_frmData_D4 };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_D6", grid: true, element: "file_upload", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_D6", grid: true, element: "file_download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_D6", grid: true, element: "file_delete", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: click_grdData_File1_download };
        gw_com_module.eventBind(args);
        //=====================================================================================



        //----------
        //function itemchanged_frmData_D4(ui) {

        //    switch (ui.element) {
        //        case "act_time_sel":
        //        case "act_module1_sel":
        //        case "act_module2_sel":
        //        case "act_module3_sel":
        //        case "mp_class1_sel":
        //        case "mp_class2_sel":
        //        case "mp_class3_sel":
        //            {
        //                var em = ui.element.substr(0, ui.element.length - 4);
        //                gw_com_api.setValue(ui.object, ui.row, em + '_etc', "");
        //                gw_com_api.setValue(ui.object, ui.row, em, (ui.value.current == "1000") ? "" : ui.value.current);
        //            }
        //            break;
        //        case "act_time_etc":
        //        case "act_module1_etc":
        //        case "act_module2_etc":
        //        case "act_module3_etc":
        //        case "mp_class1_etc":
        //        case "mp_class2_etc":
        //        case "mp_class3_etc":
        //            {
        //                var em = ui.element.substr(0, ui.element.length - 4);
        //                if (gw_com_api.getValue(ui.object, ui.row, em + "_sel") == 1000)
        //                    gw_com_api.setValue(ui.object, ui.row, em, ui.value.current);
        //            }
        //            break;
        //    }

        //};
        //----------

        //del by kyt 2021-05-26
        //gw_com_module.startPage();
        /*if (v_global.process.param != "") {
            v_global.logic.key = gw_com_api.getPageParameter("eccb_no");
            if (v_global.logic.key == "")
                processInsert({});
            else
                processRetrieve({ key: v_global.logic.key });
        } else
            processInsert({});*/

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Event
//------ 
function click_lyrMenu_Main_조회() {
    processRetrieve({ key: v_global.logic.key });
}
//------ del by kyt 2021-05-27
/*function click_lyrMenu_Main_상신() {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    processApprove({});
}*/
//------ 
function click_lyrMenu_Main_추가(ui) {

    v_global.process.handler = processInsert;
    if (!checkUpdatable({})) return;
    processInsert({});

}
//------ 
function click_lyrMenu_Main_삭제(ui) {

    if (!checkManipulate({})) return;

    v_global.process.handler = processRemove;

    checkRemovable({});

}
//------ del by kyt 2021-05-27
/*function click_lyrMenu_Main_저장(ui) {

    processSave({});

}*/
//------ 
function click_lyrMenu_Main_평가(ui) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" }
    };
    if (checkEditable({}))
        args.data = {
            page: "w_eccb5020",
            title: "평가 등록",
            param: [
                { name: "eccb_no", value: (v_global.process.param != "" ? v_global.logic.key : gw_com_api.getValue("frmData_Main", 1, "eccb_no")) }
            ]
        };
    else
        args.data = {
            page: "w_eccb5020",
            title: "평가 정보",
            param: [
                { name: "AUTH", value: "R" },
                { name: "eccb_no", value: (v_global.process.param != "" ? v_global.logic.key : gw_com_api.getValue("frmData_Main", 1, "eccb_no")) }
            ]
        };
    gw_com_module.streamInterface(args);

}
//------ 
function click_lyrMenu_Main_닫기(ui) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    processClose({});

}
//------ 
function click_lyrMenu_Sub_상세(ui) {

    if (!checkManipulate({ sub: true })) return;

    var root_type = gw_com_api.getValue("grdData_Sub", "selected", "root_type", true);
    var ecr_no = gw_com_api.getValue("grdData_Sub", "selected", "ecr_no", true);
    var url = "w_link_eccb_item.aspx?ecr_no=" + ecr_no;

    if (root_type == "CIP")
        url += "&cip_no=" + gw_com_api.getValue("grdData_Sub", "selected", "root_no", true) + "&tab=CIP";
    else if (root_type == "ECO")
        url += "&eco_no=" + gw_com_api.getValue("grdData_Sub", "selected", "root_no", true) + "&tab=ECO";

    window.open(url, "", "");

}
//------ 
function click_lyrMenu_Sub_수정(ui) {

    if (!checkManipulate({ sub: true })) return;

    var root_type = gw_com_api.getValue("grdData_Sub", "selected", "root_type", true);
    //var ecr_no = gw_com_api.getValue("grdData_Sub", "selected", "ecr_no", true);
    //var url = "w_link_eccb_item.aspx?ecr_no=" + ecr_no;
    var root_no = gw_com_api.getValue("grdData_Sub", "selected", "root_no", true);
    var url = "/Master/BizContainer.aspx?menu_id=";
    var param = "USR_ID=" + gw_com_module.v_Session.USR_ID + "&USR_NM=" + gw_com_module.v_Session.USR_NM + "&EMP_NO=" + gw_com_module.v_Session.EMP_NO;
    switch (root_type) {
        case "ECR":
            {
                //url += "eccb1010&ecr_no=" + root_no;
                url += "eccb1051&ecr_no=" + root_no;
            }
            break;
        case "CIP":
            {
                url += "eccb3020&cip_no=" + root_no;
            }
            break;
        case "ECO":
            {
                url += "eccb4010&eco_no=" + root_no;
            }
            break;
        default:
            {
                return;
            }
            break;
    }
    window.open(url, "", "");

}
//------ 
function click_lyrMenu_Sub_추가(ui) {

    if (!checkManipulate({})) return;

    processInsert({ item: true });

}
//------ 
function click_lyrMenu_Sub_삭제(ui) {

    if (!checkManipulate({})) return;

    var args = {
        targetid: "grdData_Sub",
        row: "selected"
    }
    gw_com_module.gridDelete(args);

}
//------ 
function click_lyrMenu_Sub2_상세(ui) {

    var obj = "grdData_Sub2";
    var row = gw_com_api.getSelectedRow(obj);
    if (row < 1) return false;
    var elem = ui.element == "ECR" ? "ecr_no" : "eco_no";
    rowdblclick_grdData_Sub2({ object: obj, element: elem, row: row });

}
//------ 
function click_lyrMenu_Sub2_추가(ui) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    var args = {
        type: "PAGE", page: "w_edit_evl_3", title: "평가대상",
        width: 900, height: 300,
        locate: ["center", "bottom"],
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_edit_evl_3",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    eccb_no: v_global.logic.key,
                    eccb_tp: v_global.logic.eccb_tp
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//------ 
function click_lyrMenu_Sub2_삭제(ui) {

    if (!checkManipulate({})) return;

    var args = {
        targetid: "grdData_Sub2",
        row: "selected",
        select: true
    }
    gw_com_module.gridDelete(args);

}
//------ 
function click_lyrMenu_Sub2_수정(ui) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    if (gw_com_api.getSelectedRow("grdData_Sub2") < 1) {
        gw_com_api.messageBox([{ text: "평가 대상을 선택하세요." }], 300);
        return;
    }
    v_global.logic.evl_no = gw_com_api.getValue("grdData_Sub2", "selected", "eco_no", true);

    var args = {
        type: "PAGE", page: "w_edit_evl_2", title: "2차평가",
        width: 1000, height: 320,
        locate: ["center", "bottom"],
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_edit_evl_2",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    eccb_no: v_global.logic.key,
                    evl_no: v_global.logic.evl_no
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//------ 
function click_lyrMenu_D3_추가(ui) {

    if (!checkManipulate({})) return;

    var args = {
        targetid: "grdData_D3",
        edit: true,
        data: [
            { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no") }
        ]
    };
    gw_com_module.gridInsert(args);

}
//------ 
function click_lyrMenu_D3_삭제(ui) {

    if (!checkManipulate({})) return;

    var args = {
        targetid: "grdData_D3",
        row: "selected"
    }
    gw_com_module.gridDelete(args);

}
//------ 
function click_lyrMenu_D3_예정(ui) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    gw_com_api.messageBox([
        { text: "회의 예정 사항에 대한 이메일을 발송합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { plan: true });

}
//------ 
function click_lyrMenu_D3_결과(ui) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    gw_com_api.messageBox([
        { text: "회의 결과에 대한 이메일을 발송합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { result: true });

}
//------ 
function click_lyrMenu_D6_추가(ui) {

    if (!checkManipulate({})) return;
    if (gw_com_api.getSelectedRow("grdData_Sub") > 0) {
        //if (gw_com_api.getValue("grdData_Sub", "selected", "root_type", true) == "ECR") {
        var args = {
            type: "PAGE", page: "w_find_eccb21", title: "필수 문서",
            width: 650, height: 440,
            locate: ["center", "center"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_eccb21",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue
                }
            };
            gw_com_module.dialogueOpen(args);
        }
        //}
    } else {
        gw_com_api.messageBox([{ text: "선택된 협의안건이 없습니다." }]);
    }

}
//------ 
function click_lyrMenu_D6_삭제(ui) {

    if (!checkManipulate({})) return;

    var args = {
        targetid: "grdData_D6",
        row: "selected",
        select: true
    }
    gw_com_module.gridDelete(args);

}
//------ 
function click_lyrMenu_D7_추가(ui) {

    if (!checkManipulate({})) return;
    if (gw_com_api.getSelectedRow("grdData_Sub") > 0) {

        var item_seq = gw_com_api.getValue("grdData_Sub", "selected", "item_seq", true);
        if (item_seq > 0) {

            var args = {
                targetid: "grdData_D7", edit: true,
                data: [
                    { name: "act_id", value: "0" },
                    { name: "root_no", value: gw_com_api.getValue("grdData_Sub", "selected", "eccb_no", true) },
                    { name: "root_seq", value: gw_com_api.getValue("grdData_Sub", "selected", "item_seq", true) },
                    { name: "ecr_no", value: gw_com_api.getValue("grdData_Sub", "selected", "ecr_no", true) }
                ]
            };
            gw_com_module.gridInsert(args);

        } else {

            gw_com_api.messageBox([
                { text: "데이터가 먼저 저장되어야 합니다." },
                { text: "저장하신 후에 실행해 주세요." }
            ]);

        }

    } else {

        gw_com_api.messageBox([{ text: "선택된 협의안건이 없습니다." }]);

    }

}
//------ 
function click_lyrMenu_D7_삭제(ui) {

    if (!checkManipulate({})) return;
    var args = { targetid: "grdData_D7", row: "selected", select: true }
    gw_com_module.gridDelete(args);

}
//------ 
function itemchanged_frmData_Main(ui) {
    // 참석자 재생성
    var crud = gw_com_api.getCRUD(ui.object);
    if (crud == "create" && ui.element == "dept_area" && ui.value.current != "") {
        //if (gw_com_api.showMessage("참석자 명단을 다시 생성하시겠습니까?", "yesno")) {
        var args = {
            target: [
                { type: "GRID", id: "grdData_D3" }
            ]
        };
        gw_com_module.objClear(args);
        processInsert({ member: true });
        //}
    }
}
//------ 
function itemdblclick_frmData_Main(ui) {

    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    switch (ui.element) {
        case "mng_dept_nm":
            {
                v_global.event.dept_cd = "mng_dept";
                v_global.event.dept_nm = "mng_dept_nm";
                var args = { type: "PAGE", page: "DLG_TEAM", title: "부서 선택", width: 500, height: 450, open: true };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_TEAM",
                        param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//------ 
function rowselected_grdData_Sub(ui) {

    if (checkEditable({})) {
        var args = {
            targetid: "frmData_D1",
            data: [
                { name: "root_no", value: gw_com_api.getValue(ui.object, ui.row, "root_no", true), change: false },
                { name: "result_cd", value: gw_com_api.getValue(ui.object, ui.row, "result_cd", true), change: false },
                { name: "priority_cd", value: gw_com_api.getValue(ui.object, ui.row, "priority_cd", true), change: false },
                { name: "act_dept1", value: gw_com_api.getValue(ui.object, ui.row, "act_dept1", true), change: false },
                { name: "act_dept2", value: gw_com_api.getValue(ui.object, ui.row, "act_dept2", true), change: false },
                { name: "act_dept1_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_dept1_nm", true), hide: true, change: false },
                { name: "act_dept2_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_dept2_nm", true), hide: true, change: false },
                { name: "act_emp1", value: gw_com_api.getValue(ui.object, ui.row, "act_emp1", true), change: false },
                { name: "act_emp2", value: gw_com_api.getValue(ui.object, ui.row, "act_emp2", true), change: false },
                { name: "act_emp1_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_emp1_nm", true), change: false },
                { name: "act_emp2_nm", value: gw_com_api.getValue(ui.object, ui.row, "act_emp2_nm", true), change: false },
                { name: "item_note", value: gw_com_api.getValue(ui.object, ui.row, "item_note", true).replace(/CRLF/g, "\r\n"), change: false },
                { name: "act_rqst_date", value: gw_com_api.getValue(ui.object, ui.row, "act_rqst_date", true), change: false },
                { name: "ecr_tp", value: gw_com_api.getValue(ui.object, ui.row, "ecr_tp", true), change: false },
                { name: "req_doc", value: gw_com_api.getValue(ui.object, ui.row, "req_doc", true), change: false },
                { name: "req_doc_nm", value: gw_com_api.getValue(ui.object, ui.row, "req_doc_nm", true), change: false },
                { name: "agreement_emp", value: gw_com_api.getValue(ui.object, ui.row, "agreement_emp", true), change: false },
                { name: "agreement_emp_nm", value: gw_com_api.getValue(ui.object, ui.row, "agreement_emp_nm", true), change: false },
                { name: "eca_yn", value: gw_com_api.getValue(ui.object, ui.row, "eca_yn", true), change: false }
            ]
        };
        gw_com_module.formInsert(args);

        gw_com_api.filterSelect("frmData_D1", 1, "result_cd", { memory: "심의결과", unshift: [{ text: "-", value: "" }], by: [{ source: { id: ui.object, row: ui.row, key: "root_type", grid: true } }] }, false);
        gw_com_api.setCRUD("frmData_D1", 1, "retrieve");

        if (gw_com_api.getSelectedRow("grdData_Sub") > 0)
            processLink({
                target: [
                    //{ type: "FORM", id: "frmData_D4" },
                    { type: "GRID", id: "grdData_D6" },
                    { type: "GRID", id: "grdData_D7" }
                ]
            });
    }
    else { processLink({}); }

};
//------ 
function rowdblclick_grdData_Sub2(ui) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" }
    };

    if (ui.element == "ecr_no") {
        args.data = {
            page: "w_eccb1014",
            title: "ECR 정보",
            param: [
                { name: "AUTH", value: "R" },
                { name: "ecr_no", value: gw_com_api.getValue(ui.object, ui.row, "ecr_no", true) }
            ]
        };
    } else if (ui.element == "eco_no") {
        args.data = {
            page: "w_eccb4010",
            title: "ECO 정보",
            param: [
                { name: "AUTH", value: "R" },
                { name: "eco_no", value: gw_com_api.getValue(ui.object, ui.row, "eco_no", true) }
            ]
        };
    } else {
        return false;
    }
    gw_com_module.streamInterface(args);

};
//------ 
function itemchanged_frmData_D1(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;
    if (ui.element == "item_note")
        vl = vl.replace(/\r\n/g, "CRLF");
    else if (ui.element == "act_rqst_date")
        vl = gw_com_api.unMask(vl, "date-ymd");
    else if (ui.element == "eca_yn")
        gw_com_api.setValue("grdData_Sub", "selected", "eca_yn", gw_com_api.getValue(ui.object, ui.row, ui.element), true);
    else if (ui.element == "ecr_tp")
        gw_com_api.setValue("grdData_Sub", "selected", "ecr_tp_nm", gw_com_api.getText(ui.object, ui.row, ui.element), true);

    gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true, true);
    if (ui.element == "act_emp1_nm" || ui.element == "act_emp2_nm") {
        gw_com_api.setValue("grdData_Sub",
            "selected",
            ui.element.substr(0, ui.element.length - 3),
            gw_com_api.getValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3)),
            true);
        gw_com_api.setValue("grdData_Sub",
            "selected",
            ui.element.replace("emp", "dept"),
            gw_com_api.getValue(ui.object, ui.row, ui.element.replace("emp", "dept"), false, true),
            true);
        gw_com_api.setValue("grdData_Sub",
            "selected",
            ui.element.substr(0, ui.element.length - 3).replace("emp", "dept"),
            gw_com_api.getValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3).replace("emp", "dept")),
            true);
    }
    else if (ui.element == "result_cd") {
        gw_com_api.setValue("grdData_Sub", "selected", "result_nm", gw_com_api.getText(ui.object, ui.row, ui.element), true);
        if (ui.value.current != "ECO") {
            gw_com_api.setValue(ui.object, ui.row, "req_doc", "");
            gw_com_api.setValue(ui.object, ui.row, "req_doc_nm", "");
            gw_com_api.setValue(ui.object, ui.row, "agreeement_emp", "");
            gw_com_api.setValue(ui.object, ui.row, "agreeement_emp_nm", "");
        }
    }
    else if (ui.element == "req_doc_nm" || ui.element == "agreement_emp_nm")
        gw_com_api.setValue("grdData_Sub",
            "selected",
            ui.element.substr(0, ui.element.length - 3),
            gw_com_api.getValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3)),
            true);

    if (gw_com_api.getCRUD("grdData_Sub", "selected", true) == "retrieve")
        gw_com_api.setUpdatable("grdData_Sub", gw_com_api.getSelectedRow("grdData_Sub"), true);

};
//------ 
function itemdblclick_frmData_D1(ui) {

    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    switch (ui.element) {
        case "act_emp1_nm":
        case "act_emp2_nm":
            {
                gw_com_api.setValue(ui.object, ui.row, ui.element, "");
                gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3), "");
                gw_com_api.setValue(ui.object, ui.row, ui.element.replace("emp", "dept"), "", false, true);
                gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3).replace("emp", "dept"), "");

                var args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true
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
        case "req_doc":
        case "req_doc_nm":
            if (gw_com_api.getValue(ui.object, ui.row, "result_cd") == "ECO") {
                v_global.event.element_code = "req_doc";
                v_global.event.element_name = "req_doc_nm";
                v_global.logic.param = {
                    hcode: "ECCB35",
                    multi: true
                };
                var args = {
                    type: "PAGE", page: "DLG_CODE", title: "필수첨부문서",
                    width: 500, height: 300, locate: ["center", 150], open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_CODE",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.logic.param
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } else {
                gw_com_api.messageBox([{ text: "심의결과가 \"ECO\"일 경우에만 입력할 수 있습니다." }]);
            }
            break;
        case "agreement_emp":
        case "agreement_emp_nm":
            if (gw_com_api.getValue(ui.object, ui.row, "result_cd") == "ECO") {
                v_global.event.element_code = "agreement_emp";
                v_global.event.element_name = "agreement_emp_nm";
                v_global.logic.param = {
                    dp_nm: gw_com_api.getValue(ui.object, ui.row, "agreement_emp_nm"),
                    emp_no: gw_com_api.getValue(ui.object, ui.row, "agreement_emp")
                };
                var args = {
                    type: "PAGE", page: "DLG_EMPLOYEE2", title: "합의자 선택",
                    width: 700, height: 400, locate: ["center", 150], open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_EMPLOYEE2",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.logic.param
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } else {
                gw_com_api.messageBox([{ text: "심의결과가 \"ECO\"일 경우에만 입력할 수 있습니다." }]);
            }
            break;
    }

}
//------ 
function keypress_frmData_D1(ui) {

    if (event.keyCode == 46) {
        var code = ui.element.substr(0, ui.element.length - 3);
        if (ui.element == "act_emp1_nm" || ui.element == "act_emp2_nm") {
            var dept = code.replace("emp", "dept");
            gw_com_api.setValue(ui.object, ui.row, dept, "");
            gw_com_api.setValue(ui.object, ui.row, dept + "_nm", "");
        }
        gw_com_api.setValue(ui.object, ui.row, code, "");
        gw_com_api.setValue(ui.object, ui.row, ui.element, "");
    }

}
//------ 
function itemdblclick_grdData_D3(ui) {

    switch (ui.element) {
        case "attend_emp1_nm":
        case "attend_emp2_nm":
        case "attend_emp3_nm":
            {
                gw_com_api.setValue(ui.object, ui.row, ui.element, "", true);
                gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3), "", true);
                gw_com_api.setValue(ui.object, ui.row, ui.element.replace("emp", "dept"), " ", true);
                gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3).replace("emp", "dept"), "", true);

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
//------
function click_grdData_File1_download(ui) {

    var args = {
        source: {
            id: "grdData_File1",
            row: ui.row
        },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Check
//------
function checkCRUD(param) {

    if (param.sub) {
        if (checkEditable({}))
            return gw_com_api.getCRUD("grdData_Sub", "selected", true);
        else
            return ((gw_com_api.getSelectedRow("grdData_Sub") == null) ? false : true);
    }
    else return gw_com_api.getCRUD("frmData_Main");

}
//------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: (param.sub) ? "선택된 내역이 없습니다." : "NOMASTER" }
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
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_Sub2" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            //{ type: "FORM", id: "frmData_D4" },
            { type: "GRID", id: "grdData_File1" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//------
function checkRemovable(param) {

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create") {
        (param.sub) ? processDelete(param) : processClear({});
    }
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//------
function checkDupECCBItem(param) {

    var row = 0;
    //var data = $("#grdData_Sub_data").jqGrid("getGridParam", "data");
    //$.each(data, function (i) {
    //    if (this.root_type == param.root_type && this.root_no == param.root_no) {
    //        row = i + 1;
    //        return false;
    //    }
    //});
    //return row;

    return gw_com_api.getFindRow("grdData_Sub", "root_no", param.root_no);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : File
// ref : lyrMenu_File1, row click event, processRetrieve, msg_openedDialogue, msg_closeDialogue
//------
function processFileList(param){
 //add by kyt 2021-05-26
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ECCB" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_File1" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? "%" : param.data_key) },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? 0 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? 0 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.data_key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processFile(param) {

    if (param.element == "file_upload") {

        if (!checkEditable({})) return;
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
            //locate: ["center", 600],
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

        if (!checkEditable({})) return;
        var args = {
            url: "COM",
            user: gw_com_module.v_Session.USR_ID,
            param: [
                {
                    query: "w_eccb2020_S_6",
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
                param: { target: [{ type: "GRID", id: "grdData_D6" }] }
            }
        };
        gw_com_module.objSave(args);

    }

}
//------ 
function click_lyrMenu_File1_추가(ui) {

    //del by kyt 2021-05-26
    //if (!checkManipulate({})) return;
    //if (!checkUpdatable({ check: true })) return false;

    //v_global.event.file = {
    //    user: gw_com_module.v_Session.USR_ID,
    //    key: gw_com_api.getValue("frmData_Main", 1, "eccb_no"),
    //    seq: 0
    //};
    //var args = {
    //    type: "PAGE", page: "w_upload_eccb", title: "파일 업로드",
    //    width: 650, height: 200,
    //    open: true
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

    //add by kyt 2021-05-26
    //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
    //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

    // Check Updatable
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // set data for "File Upload"
    var dataType = "ECCB";    // Set File Data Type
    var dataKey = gw_com_api.getValue("frmData_Main", 1, "eccb_no");   // Main Key value for Search
    var dataSeq = 0;   // Main Seq value for Search

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
function click_lyrMenu_File1_삭제(ui) {

    if (!checkManipulate({})) return;

    var args = {
        targetid: "grdData_File1",
        row: "selected"
    }
    gw_com_module.gridDelete(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Edit
//------ 
function processInsert(param) {

    if (param.member) {
        var args = {
            source: {
                argument: [
                    { name: "arg_dept_area", value: gw_com_api.getValue("frmData_Main", 1, "dept_area", false) },
                    { name: "arg_eccb_tp", value: v_global.logic.eccb_tp }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_D3", query: "w_eccb2020_I_3", crud: "insert" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.item) {
        var args = {
            type: "PAGE", page: "w_find_eccb_item", title: "심의대상 선택",
            width: 1000, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_eccb_item",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectECCBItem,
                    data: {
                        type: "new",
                        eccb_no: gw_com_api.getValue("frmData_Main", 1, "eccb_no", false),
                        cur_dept_area: gw_com_api.getValue("frmData_Main", 1, "dept_area", false),
                        my_dept_area: gw_com_module.v_Session.DEPT_AREA,
                        eccb_tp: v_global.logic.eccb_tp 
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }
    else {
        var args = {
            targetid: "frmData_Main", edit: true, updatable: true,
            data: [
                { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
                { name: "mng_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                { name: "mng_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "meet_dt", value: gw_com_api.getDate("") },
                { name: "astat", value: "10" },
                { name: "aemp", value: gw_com_module.v_Session.EMP_NO },
                { name: "adate", value: "SYSDT" },
                { name: "eccb_tp", value: v_global.logic.eccb_tp }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" },
                { type: "FORM", id: "frmData_D1" },
                { type: "FORM", id: "frmData_D2" },
                { type: "GRID", id: "grdData_D3" },
                { type: "GRID", id: "grdData_File1" }
            ]
        };
        gw_com_module.formInsert(args);
        args = { targetid: "frmData_D2", edit: true };
        gw_com_module.formInsert(args);
        gw_com_api.setCRUD("frmData_D2", 1, "modify");
        processInsert({ member: true });
    }

}
//----------
function processDelete(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            { type: "GRID", id: "grdData_D6" },
            { type: "GRID", id: "grdData_D7" },
            { type: "GRID", id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processSave(param) {
    //var eccb_tp = (v_global.logic.eccb_tp == "SCCB") ? "SCCB" : "ECCB";
    //if (v_global.logic.eccb_tp == "SCCB") {
    //    gw_com_api.setValue("frmData_Main", 1, "eccb_tp", "SCCB");
    //}
    
    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_Sub2" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            //{ type: "FORM", id: "frmData_D4" },
            { type: "GRID", id: "grdData_File1" },
            { type: "GRID", id: "grdData_D6" },
            { type: "GRID", id: "grdData_D7" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

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
                type: "FORM", id: "frmData_Main",
                key: { element: [{ name: "eccb_no" }] }
            }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//----------
function processInform(param) {

    var args = {
        url: (param.plan) ? "COM" : gw_com_module.v_Current.window + ".aspx/" + "Mail",
        procedure: "PROC_MAIL_ECCB_MEET", nomessage: true,
        argument: [
            { name: "eccb_no", value: v_global.logic.key }
        ],
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" },
            { name: "eccb_no", value: v_global.logic.key, type: "varchar" },
            { name: "type", value: (param.plan) ? "PLAN" : "RESULT", type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: { success: successInform }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processApprove(param) {

    //add by kyt 2021-05-27
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    var status = gw_com_api.getValue("frmData_Main", 1, "gw_astat_nm", false, true);
    if (status != '없음' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }
    var row = gw_com_api.getFindRow("grdData_Sub", "result_cd", "");
    if (row > 0) {
        gw_com_api.showMessage("심의결과를 입력하세요.");
        gw_com_api.selectRow("grdData_Sub", row, true);
        return false;
    }
    //gw_com_site.v_gw_auth = false;
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
        var gw_key = gw_com_api.getValue("frmData_Main", 1, "gw_key");
        var gw_seq = gw_com_api.getValue("frmData_Main", 1, "gw_seq");
        gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
        var title = gw_com_api.getValue("frmData_Main", 1, "meet_title") + "(" + gw_com_api.getValue("frmData_Main", 1, "meet_dt", false, true) + ")";
        var args = {
            eccb_no: v_global.logic.key,
            //gw_user: param.data.name,
            //gw_pass: param.data.password,
            gw_key: gw_key,
            gw_seq: gw_seq,
            title: title
        };
        gw_com_site.gw_appr_eccb(args);


    }

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

    var retrieve = false;
    $.each(response, function () {
        $.each(this.KEY, function () {
            if (this.NAME == "eccb_no") {
                v_global.logic.key = this.VALUE;
                //processRetrieve({ key: v_global.logic.key });
                //retrieve = true;
            }
        });
    });

    //if (!retrieve) {
    //    processLink({ target: [{ type: "FORM", id: "frmData_D4" }] });
    //}

    if (param == undefined || param.target == undefined)
        processRetrieve({ key: v_global.logic.key });
    else
        processLink(param);

}
//----------
function successRemove(response, param) {

    processDelete(param);

}
//----------
function successInform(response) {

    gw_com_api.messageBox([ { text: response.VALUE[1] } ], 350);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Retrieve
//------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_eccb_no", value: param.key },
                { name: "arg_eccb_tp", value: v_global.logic.eccb_tp },
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub", select: checkEditable({}) ? false : true },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            { type: "GRID", id: "grdData_Sub2" },
            /*{ type: "GRID", id: "grdData_File1" }*/
        ],
        clear: [
            { type: "FORM", id: "frmData_D1" },
            //{ type: "FORM", id: "frmData_D4" },
            /*{ type: "GRID", id: "grdData_File1" },*/
            { type: "GRID", id: "grdData_D6" },
            { type: "GRID", id: "grdData_D7" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);
    processFileList({ data_key: param.key });
}
//------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_Sub", row: "selected", block: true,
            element: [
                { name: "item_seq", argument: "arg_item_seq" },
                { name: "ecr_no", argument: "arg_ecr_no" }
            ],
            argument: [
                { name: "arg_eccb_no", value: v_global.logic.key }
            ]
        },
        target: [],
        key: param.key
    };

    if (param.target == undefined) {
        args.target = [
            { type: "FORM", id: "frmData_D1" },
            //{ type: "FORM", id: "frmData_D4" },
            { type: "GRID", id: "grdData_D6" },
            { type: "GRID", id: "grdData_D7" }
        ];
    } else {
        args.target = param.target;
    }
    if (args.target.length < 1) return;
    gw_com_module.objRetrieve(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_D3" },
            { type: "GRID", id: "grdData_File1" },
            { type: "GRID", id: "grdData_D6" },
            { type: "GRID", id: "grdData_D7" }
        ]
    };
    gw_com_module.objClear(args);

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
                                processRemove(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processInform(param.data.arg);
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
        case gw_com_api.v_Stream.msg_selectedECCBItem:
            {
                var args = { targetid: "grdData_Sub", edit: true, updatable: true };
                var row = 1;
                $.each(param.data.rows, function () {
                    if (checkDupECCBItem({ root_type: this.root_type, root_no: this.root_no }) < 1) {
                        args.data = [
                            { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no") },
                            { name: "item_seq", value: 0 },
                            { name: "root_type", value: this.root_type },
                            { name: "root_no", value: this.root_no },
                            { name: "ecr_no", value: this.ecr_no },
                            { name: "cip_no", value: this.root_type == "CIP" ? this.root_no : "" },
                            { name: "root_title", value: this.title },
                            { name: "root_dt", value: this.ecr_dt },
                            { name: "root_emp", value: this.ecr_emp_nm },
                            { name: "ecr_tp", value: this.ecr_tp },
                            { name: "ecr_tp_nm", value: this.ecr_tp_nm },
                            { name: "crm_tp", value: this.crm_tp },
                            { name: "crm_tp_nm", value: this.crm_tp_nm },
                            { name: "astat", value: "10" },
                            { name: "aemp", value: gw_com_module.v_Session.EMP_NO },
                            { name: "adate", value: "SYSDT" },
                            { name: "act_emp1", value: this.act_emp1 },
                            { name: "act_emp1_nm", value: this.act_emp1_nm },
                            { name: "act_dept1", value: this.act_dept1 },
                            { name: "act_dept1_nm", value: this.act_dept1_nm },
                            { name: "eca_yn", value: "1" }
                        ];
                        row = gw_com_module.gridInsert(args);
                    }
                });
                gw_com_api.selectRow("grdData_Sub", row);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                gw_com_api.setValue(v_global.event.object,
                                      v_global.event.row,
                                      v_global.event.element.substr(0, v_global.event.element.length - 3),
                                      param.data.emp_no,
                                      (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.replace("emp", "dept"),
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false,
                                    (v_global.event.type == "FORM") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.substr(0, v_global.event.element.length - 3).replace("emp", "dept"),
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element,
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                if (v_global.event.file.req_doc == undefined)
                    processLink({ target: [{ type: "GRID", id: "grdData_File1" }] });
                else
                    processLink({ target: [{ type: "GRID", id: "grdData_D6" }] });

                if (v_global.event.file.req_doc != undefined)
                    closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                var gw_key = gw_com_api.getValue("frmData_Main", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_Main", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = {
                    eccb_no: v_global.logic.key,
                    gw_user: param.data.name,
                    gw_pass: param.data.password,
                    gw_key: gw_key,
                    gw_seq: gw_seq
                };
                gw_com_site.gw_appr_eccb(args);
                processRetrieve({ key: v_global.logic.key });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "w_find_eccb_item":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectECCBItem;
                            args.data = {
                                type: "new",
                                eccb_no: gw_com_api.getValue("frmData_Main", 1, "eccb_no", false),
                                cur_dept_area: gw_com_api.getValue("frmData_Main", 1, "dept_area", false),
                                my_dept_area: gw_com_module.v_Session.DEPT_AREA,
                                eccb_tp: v_global.logic.eccb_tp
                            };
                        }
                        break;
                    case "w_info_eccb_item":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECCBItem;
                            args.data = {
                                type: gw_com_api.getValue("grdData_Sub", "selected", "root_type", true),
                                ecr_no: gw_com_api.getValue("grdData_Sub", "selected", "ecr_no", true)
                            };
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
                        }
                        break;
                    case "w_upload_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = v_global.event.file;
                        }
                        break;
                    case "w_edit_evl_2":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                eccb_no: v_global.logic.key,
                                evl_no: v_global.logic.evl_no
                            };
                        }
                        break;
                    case "w_edit_evl_3":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                eccb_no: v_global.logic.key,
                                eccb_tp: v_global.logic.eccb_tp
                            };
                        }
                        break;
                    case "DLG_CODE":
                    case "DLG_EMPLOYEE2":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.logic.param;
                        }
                        break;
                    case "w_find_eccb21":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        }
                        break;
                    //2021-05-19 by KYT
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                    //2021-06-10 by kyt 필수문서
                    case "w_upload_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = v_global.event.file;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_edit_evl_2":
                        var args = {
                            source: {
                                type: "INLINE",
                                argument: [
                                    { name: "arg_eccb_no", value: v_global.logic.key }
                                ]
                            },
                            target: [
                                { type: "GRID", id: "grdData_Sub2" }
                            ]
                        };
                        gw_com_module.objRetrieve(args);
                        break;
                    case "w_edit_evl_3":
                        //if (param.data != undefined) {
                        //    v_global.logic.evl_no = param.data.evl_no;
                        //    var args = {
                        //        type: "PAGE", page: "w_edit_evl_2", title: "2차평가",
                        //        width: 1000, height: 300,
                        //        locate: ["center", "bottom"],
                        //        open: true
                        //    };
                        //    if (gw_com_module.dialoguePrepare(args) == false) {
                        //        var args = {
                        //            page: "w_edit_evl_2",
                        //            param: {
                        //                ID: gw_com_api.v_Stream.msg_openedDialogue,
                        //                data: {
                        //                    eccb_no: v_global.logic.key,
                        //                    evl_no: v_global.logic.evl_no
                        //                }
                        //            }
                        //        };
                        //        gw_com_module.dialogueOpen(args);
                        //    }
                        //}
                        var args = {
                            source: {
                                type: "INLINE",
                                argument: [
                                    { name: "arg_eccb_no", value: v_global.logic.key }
                                ]
                            },
                            target: [
                                { type: "GRID", id: "grdData_Sub2" }
                            ]
                        };
                        gw_com_module.objRetrieve(args);
                        break;
                    case "DLG_CODE":
                        if (param.data != undefined) {
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element_code, param.data.dcode);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element_name, param.data.dname);
                        }
                        break;
                    case "DLG_EMPLOYEE2":
                        if (param.data != undefined) {
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element_code, param.data.emp_no);
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element_name, param.data.dp_nm);
                        }
                        break;
                    case "w_find_eccb21":
                        {
                            if (param.data != undefined) {
                                var ecr_no = gw_com_api.getValue("grdData_Sub", "selected", "ecr_no", true);
                                var data = [];
                                $.each(param.data, function () {
                                    if (gw_com_api.getFindRow("grdData_D6", "file_tp", this.dcode) < 1) {
                                        data[data.length] = {
                                            ecr_no: ecr_no,
                                            file_tp: this.dcode,
                                            file_tp_nm: this.dname,
                                            file_tp_dept: this.rmk,
                                            file_grp_nm: this.pname
                                        };
                                    }
                                });
                                if (data.length > 0) {
                                    var args = {
                                        targetid: "grdData_D6", edit: true, updatable: true,
                                        data: data
                                    };
                                    gw_com_module.gridInserts(args);
                                }
                            }
                        }
                        break;
                    // 2021-05-19 by KYT
                    case "SYS_FileUpload":
                        {
                            processFileList({ data_key: gw_com_api.getValue("frmData_Main", 1, "eccb_no") });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedTeam:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, param.data.dept_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_nm, param.data.dept_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

