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


    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 관리자 여부
        v_global.logic.sys_yn = gw_com_module.v_Session.USR_ID == "GOODTEST" ? true : false;

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "진행상태",
                    data: [
                        { title: "구매접수", value: "구매접수" },
                        { title: "검토요청", value: "검토요청" },
                        { title: "검토접수", value: "검토접수" },
                        { title: "검토승인", value: "검토승인" },
                        { title: "검토반려", value: "검토반려" },
                        { title: "ECR", value: "ECR" },
                        { title: "ECO", value: "ECO" },
                        { title: "보류", value: "보류" },
                        { title: "승인", value: "승인" },
                        { title: "반려", value: "반려" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
            gw_com_api.setValue("frmOption", 1, "user_id", gw_com_module.v_Session.USR_ID);
            gw_com_api.setValue("frmOption", 1, "user_nm", gw_com_module.v_Session.USR_NM);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
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
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "실행", value: "새로고침", icon: "Act" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, margin_top: 70,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
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
                                name: "supp_nm", label: { title: "업체명 :" }, mask: "search",
                                editable: { type: "text", size: 18, maxlength: 50 }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "user_nm", label: { title: "담당자 :" }, mask: "search",
                                editable: { type: "text", size: 10, maxlength: 50 }
                            },
                            { name: "user_id", hidden: true, editable: { type: "hidden" } },
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
            targetid: "grdData_MAIN", query: "PCN_1090_1", title: "변경점 검토 요청 현황",
            caption: false, height: 420, pager: false, show: true, selectable: true, number: true,
            editable: { bind: "select", focus: "astat", validate: true },
            element: [
                { header: "관리번호", name: "issue_no", width: 80, align: "center", editable: { type: "hidden" } },
                { header: "장비군", name: "dept_area_nm", width: 60 },
                { header: "협력사명", name: "comp_nm", width: 100 },
                { header: "작성일", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
                {
                    header: "진행상태", name: "astat", width: 70, align: "center",
                    editable: { type: "select", data: { memory: "진행상태" }, validate: { rule: "required" } }
                },
                { header: "요청자", name: "rqst_user_nm", width: 60, align: "center" },
                { header: "E-Mail", name: "rqst_user_email", width: 100 },
                { header: "제목", name: "issue_title", width: 250 },
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 170 },
                { header: "담당부서", name: "prc_dept_nm", width: 100 },
                { header: "담당자", name: "prc_user_nm", width: 60, align: "center" },
                //{ header: "협력사", name: "prc_supp_nm", width: 150 },
                { header: "완료예정일", name: "plan_dt", width: 80, align: "center", mask: "date-ymd" },
                { name: "pstat", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "PCN_1010_2", type: "TABLE", title: "변경점 승인 요청",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 40, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm", format: { type: "text", width: 166 } },
                            { header: true, value: "협력사명", format: { type: "label" } },
                            { name: "comp_nm", format: { type: "text", width: 500 }, style: { colspan: 3 }, width: 150 },
                            { name: "comp_cd", format: { type: "text" }, hidden: true },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "issue_dt", format: { type: "text", width: 166 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용예정일", format: { type: "label" } },
                            { name: "plan_date", format: { type: "text", width: 100 }, mask: "date-ymd" },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "rqst_user_nm", format: { type: "text", width: 128 } },
                            { header: true, value: "직급", format: { type: "label" } },
                            { name: "rqst_user_pos", format: { type: "text", width: 128 } },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            { name: "rqst_user_email", format: { type: "text", width: 166 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "품번", format: { type: "label" } },
                            { name: "item_cd", format: { type: "text", width: 166 } },
                            { header: true, value: "품명", format: { type: "label" } },
                            { name: "item_nm", format: { type: "text", width: 414 }, style: { colspan: 3 } },
                            { header: true, value: "연락처", format: { type: "label" } },
                            { name: "rqst_user_tel", format: { type: "text", width: 166 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "변경구분", format: { type: "label" } },
                            { name: "chg_tp", format: { type: "text", width: 166 } },
                            { header: true, value: "상세구분", format: { type: "label" } },
                            { name: "chg_dtl_tp", format: { type: "text", width: 414 }, style: { colspan: 3 } },
                            { header: true, value: "요청구분", format: { type: "label" } },
                            { name: "issue_tp" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "issue_title", style: { colspan: 5 },
                                format: { type: "text", width: 1002 }, display: true
                            },
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "astat", format: { type: "text", width: 166 } },
                            { name: "pstat", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "변경사유", format: { type: "label" } },
                            {
                                name: "chg_reason", style: { colspan: 7 },
                                format: { type: "textarea", rows: 4, width: 1000 }
                            },
                            { name: "chg_memo1", hidden: true },
                            { name: "chg_memo2", hidden: true },
                            { name: "chg_memo3", hidden: true },
                            { name: "chg_memo4", hidden: true },
                            { name: "issue_no", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO1", query: "PCN_1010_2", type: "TABLE", title: "내용(변경 전)",
            caption: true, show: true, fixed: true, selectable: true,
            content: {
                width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                            { name: "chg_memo1", format: { type: "html", height: 370, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO2", query: "PCN_1010_2", type: "TABLE", title: "내용(변경 후)",
            caption: true, show: true, fixed: true, selectable: true,
            content: {
                width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                            { name: "chg_memo2", format: { type: "html", height: 370, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO3", query: "PCN_1010_2", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 10, field: 90 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "품질검증내용", format: { type: "label" } },
                            {
                                name: "chg_memo3",
                                format: { type: "textarea", rows: 4, width: 1000 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "4M", format: { type: "label" } },
                            {
                                header: false, name: "chg_memo4", format: { type: "label" },
                                value: "① MAN(작업자) : 주요공정 및 보안 공정의 작업자 변경&nbsp;&nbsp;&nbsp;&nbsp;② MACHINE(설비) : 설비,금형 및 2차업체 변경<br/>③ MATERIAL(재료) : 재질변경 및 국산화품 적용&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;④ METHOD(작업방법) : 제조공법변경,생산공장이전 등<br/>&nbsp;&nbsp;※기 타 : 1년이상 방치된 금형 설비 사용 또는 납품 중단 후 재개 등"
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "PCN_1021_1", title: "담당자 변경이력",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "담당부서", name: "dept_nm", width: 100, align: "center" },
                { header: "담당자", name: "user_nm", width: 60, align: "center" },
                //{ header: "협력사", name: "supp_nm", width: 150 },
                { header: "담당지정일시", name: "ins_dt", width: 150, align: "center" },
                { header: "판정", name: "exam_result", width: 60, align: "center" },
                { header: "판정일", name: "exam_dt", width: 80, align: "center", mask: "date-ymd" },
                { name: "issue_no", hidden: true },
                { name: "act_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUB", query: "PCN_1090_7", type: "TABLE", title: "Wonik IPS 검토결과",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 44, field: 56 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "접수일", format: { type: "label" } },
                            { name: "act_dt", mask: "date-ymd", format: { type: "text", width: 300 } },
                            { header: true, value: "접수자", format: { type: "label" } },
                            { name: "act_user_nm", format: { type: "text", width: 200 } },
                            { name: "act_user", hidden: true },
                            { header: true, value: "완료예정일", format: { type: "label" } },
                            { name: "plan_dt", format: { type: "text", width: 200 }, mask: "date-ymd" },
                            { header: true, value: "승인자", format: { type: "label" } },
                            { name: "appr_user_nm", format: { type: "text", width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "검토일", format: { type: "label" } },
                            { name: "exam_dt", mask: "date-ymd", format: { type: "text", width: 300 } },
                            { header: true, value: "검토자", format: { type: "label" } },
                            { name: "exam_user_nm", format: { type: "text", width: 200 } },
                            { name: "exam_user", hidden: true },
                            { header: true, value: "판정", format: { type: "label" } },
                            { name: "exam_result", format: { type: "text", width: 200 } },
                            { header: true, value: "승인일", format: { type: "label" } },
                            { name: "appr_date", format: { type: "text", width: 300 }, mask: "date-ymd", display: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "검토결과", format: { type: "label" } },
                            {
                                name: "exam_rmk", style: { colspan: 7 },
                                format: { type: "textarea", rows: 4, width: 996 }
                            },
                            { name: "issue_no", hidden: true },
                            { name: "act_seq", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "DLG_FILE_ZFILE_V", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 250, align: "left" },
                { header: "등록부서", name: "upd_dept", width: 100, align: "center" },
                { header: "등록자", name: "upd_usr", width: 60, align: "center" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 380, align: "left",
                    format: { type: "text" }
                },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
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
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_SUB", offset: 8 },
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "FORM", id: "frmData_MEMO2", offset: 8 },
                { type: "FORM", id: "frmData_MEMO3", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "요청현황" },
                { type: "LAYER", id: "lyrTab_2", title: "검토결과" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_SUB", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            processRetrieve(param);
            break;
        case "닫기":
            processClose({});
            break;
    }

}
//----------
function processTabChange(param) {

    closeOption({});

}
//----------
function processEdit(param) {

    processRetrieve(param);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "user_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "user_id", "");
        } else if (param.element == "supp_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "supp_cd", "");
        }
    } else if (param.object == "grdData_MAIN") {
        if (param.element == "astat") {
            var pstat = "";
            switch (param.value.current) {
                case "구매접수":
                case "검토요청":
                    pstat = "접수";
                    break;
                case "검토접수":
                case "검토승인":
                    pstat = "검토";
                    break;
                case "ECR":
                case "ECO":
                case "보류":
                    pstat = "진행";
                    break;
                case "검토반려":
                case "반려":
                    pstat = "반려";
                    break;
                case "승인":
                    pstat = "완료";
                    break;
                default:
                    return true;
                    break;
            }
            gw_com_api.setValue(param.object, param.row, "pstat", pstat, true, true, true);
        }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "dept_nm":
            var args = {
                type: "PAGE", page: "DLG_TEAM", title: "부서 선택",
                width: 500, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_TEAM",
                    param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "user_nm":
            var args = {
                type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택",
                width: 700, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_EMPLOYEE",
                    param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "supp_nm":
            var args = {
                type: "PAGE", page: "w_find_supplier", title: "협력사 선택",
                width: 500, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_supplier",
                    param: { ID: gw_com_api.v_Stream.msg_selectedSupplier }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        default: return;
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "frmOption") {
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (!gw_com_module.objValidate(args)) return;
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "supp_cd", argument: "arg_comp_cd" },
                    { name: "user_id", argument: "arg_user_id" }
                ],
                //remark: [
                //    { element: [{ name: "work_ym" }] },
                //    //{ element: [{ name: "emp_no" }] },
                //    { element: [{ name: "emp_nm" }] }
                //]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" },
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            key: param.key
        };
    } else if (param.object == "grdList_SUB") {
        args = {
            source: {
                type: "GRID", id: "grdList_SUB", row: "selected",
                element: [
                    { name: "issue_no", argument: "arg_issue_no" },
                    { name: "act_seq", argument: "arg_act_seq" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_SUB" },
            ]
        };
    } else {
        args = {
            source: {
                type: "GRID", id: "grdData_MAIN", row: (param.row == undefined ? "selected" : param.row),
                element: [
                    { name: "issue_no", argument: "arg_issue_no" },
                    { name: "issue_no", argument: "arg_data_key" }
                ],
                argument: [
                    { name: "arg_data_seq", value: -1 }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_SUB", select: true },
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
        gw_com_api.selectTab("lyrTab", 2);

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);


}
//----------
function successSave(response, param) {

    processRetrieve({ object: "frmOption", key: response });

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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "w_upload_pcn":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_MAIN", 1, "issue_no"),
                                seq: 0
                            };
                        }
                        break;
                    case "DLG_SUPPLIER":
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        break;

                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        param.data.html);
                    gw_com_api.setValue("frmData_MAIN",
                        1,
                        v_global.event.element,
                        param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "":
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "FORM", id: "frmData_MAIN",
                        element: [
                            { name: "issue_no", argument: "arg_data_key" }
                        ],
                        argument: [
                            { name: "arg_data_seq", value: -1 }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_FILE", select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
                    v_global.event.row,
                    "supp_cd",
                    param.data.supp_cd,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                    v_global.event.row,
                    "supp_nm",
                    param.data.supp_nm,
                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier: {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedTeam: {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//