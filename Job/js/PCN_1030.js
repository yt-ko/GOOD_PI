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
                    type: "INLINE", name: "판정",
                    data: [
                        { title: "접수승인", value: "접수승인" },
                        { title: "부적합", value: "부적합" },
                        { title: "담당자변경", value: "담당자변경" }
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
                { name: "검토", value: "검토", icon: "기타" },
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
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_4", type: "FREE",
            element: [
                //{ name: "접수", value: "접수", icon: "기타" },
                //{ name: "승인", value: "접수승인", icon: "예" },
                //{ name: "반려", value: "부적합", icon: "아니오" },
                //{ name: "담당", value: "담당자변경", icon: "아니오" },
                { name: "저장", value: "저장" }//,
                //{ name: "진행", value: "ECR등록", icon: "Act" }
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
                                name: "user_nm", label: { title: "담당자 :" }, mask: "search",
                                editable: { type: "text", size: 10, maxlength: 50 }, hidden: !v_global.logic.sys_yn
                            },
                            { name: "user_id", hidden: true, editable: { type: "hidden" } },
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
            targetid: "frmOption2", type: "FREE", title: "완료예정일 변경",
            trans: true, border: true, show: false, margin: 150, margin_top: 800,
            editable: { focus: "plan_dt", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "plan_dt", label: { title: "완료예정일 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "required", message: "완료예정일" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rmk", label: { title: "변경사유 :" },
                                editable: { type: "text", size: 30, maxlength: 50, validate: { rule: "required", message: "변경사유" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "변경", value: "확인", format: { type: "button", icon: "실행" } },
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
            targetid: "grdList_MAIN", query: "PCN_1030_1", title: "변경점 검토 요청 현황",
            caption: false, height: 420, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "관리번호", name: "issue_no", width: 80, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 60 },
                { header: "협력사명", name: "comp_nm", width: 100 },
                { header: "작성일", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "진행상태", name: "astat", width: 60, align: "center" },
                { header: "요청자", name: "rqst_user_nm", width: 60, align: "center" },
                { header: "E-Mail", name: "rqst_user_email", width: 100 },
                { header: "제목", name: "issue_title", width: 250 },
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 170 },
                { header: "담당부서", name: "prc_dept_nm", width: 100 },
                { header: "담당자", name: "prc_user_nm", width: 60, align: "center" },
                //{ header: "협력사", name: "prc_supp_nm", width: 150 },
                { header: "완료예정일", name: "plan_dt", width: 80, align: "center", mask: "date-ymd" },
                { name: "pstat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "PCN_1010_2", type: "TABLE", title: "변경점 승인 요청",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "rqst_user_nm", validate: true },
            content: {
                width: { label: 40, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm", editable: { type: "hidden", width: 166 } },
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
                            { name: "issue_tp", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "issue_title", style: { colspan: 5 },
                                editable: { type: "hidden", width: 1002 }, display: true
                            },
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "astat", format: { type: "text", width: 166 }, editable: { type: "hidden", width: 166 } },
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
                            { name: "chg_memo1", editable: { type: "textarea" }, hidden: true },
                            { name: "chg_memo2", editable: { type: "textarea" }, hidden: true },
                            { name: "chg_memo3", editable: { type: "textarea" }, hidden: true },
                            { name: "chg_memo4", editable: { type: "textarea" }, hidden: true },
                            { name: "issue_no", editable: { type: "hidden" }, hidden: true }
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
            editable: { bind: "select", validate: true },
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
            editable: { bind: "select", validate: true },
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
            editable: { bind: "select", focus: "chg_memo3", validate: true },
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
        createDW({});
        //=====================================================================================
        //var args = {
        //    targetid: "grdData_FileA", query: "DLG_FILE_ZFILE_V", title: "첨부 문서",
        //    caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
        //    editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
        //    element: [
        //        { header: "파일명", name: "file_nm", width: 250, align: "left" },
        //        { header: "등록부서", name: "upd_dept", width: 100, align: "center" },
        //        { header: "등록자", name: "upd_usr", width: 60, align: "center" },
        //        {
        //            header: "다운로드", name: "download", width: 60, align: "center",
        //            format: { type: "link", value: "다운로드" }
        //        },
        //        {
        //            header: "파일설명", name: "file_desc", width: 380, align: "left",
        //            editable: { type: "text" }
        //        },
        //        { name: "file_ext", hidden: true },
        //        { name: "file_path", hidden: true },
        //        { name: "network_cd", hidden: true },
        //        { name: "data_tp", hidden: true },
        //        { name: "data_key", hidden: true },
        //        { name: "data_seq", hidden: true },
        //        { name: "file_id", hidden: true, editable: { type: "hidden" } }
        //    ]
        //};
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 250, align: "left" },
                { header: "등록자", name: "ins_usr_nm", width: 60, align: "center" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 380, align: "left",
                    editable: { type: "text" }
                },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
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
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "FORM", id: "frmData_MEMO2", offset: 8 },
                { type: "FORM", id: "frmData_MEMO3", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "요청현황" },
                { type: "LAYER", id: "lyrTab_2", title: "결과등록" }
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
        var args = { targetid: "lyrMenu_1", element: "검토", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "요청", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "lyrMenu_4", element: "저장", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_4", element: "접수", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_4", element: "승인", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_4", element: "반려", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_4", element: "담당", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_4", element: "진행", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
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
        var args = { targetid: "frmOption2", element: "변경", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO1", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO1", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO2", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO3", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FileA", grid: true, element: "download", event: "click", handler: processFile };
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
    gw_com_api.hide("frmOption2");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            {
                v_global.process.handler = processRetrieve;
                if (!checkUpdatable({})) return;
                processRetrieve(param);
            }
            break;
        case "추가":
            {
                processFileUpload(param);
            }
            break;
        case "검토":
            {
                processEdit(param);
            }
            break;
        case "삭제":
            {
                processDelete(param);
            }
            break;
        case "저장":
            {
                processSave({});
            }
            break;
        case "접수":
        case "검토승인":
        case "검토반려":
        case "담당":
        case "진행":
        case "공유완료":
            {
                processStat(param);
            }
            break;
        case "닫기":
            {
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
            }
            break;
        case "변경":
            {
                if (param.object == "frmOption2") {

                    var args = { target: [{ type: "FORM", id: "frmOption2" }] };
                    if (!gw_com_module.objValidate(args)) return;
                    var old_plan_dt = gw_com_api.getValue("frmData_SUB", 1, "plan_dt");
                    var new_plan_dt = gw_com_api.getValue("frmOption2", 1, "plan_dt");
                    var rmk = $.trim(gw_com_api.getValue("frmOption2", 1, "rmk"));
                    if (old_plan_dt == new_plan_dt) {
                        gw_com_api.setError(true, "frmOption2", 1, "plan_dt", false, true);
                        gw_com_api.messageBox([{ text: "기존 입력된 값과 동일합니다." }]);
                        return;
                    } else if (rmk == "") {
                        gw_com_api.setError(true, "frmOption2", 1, "rmk", false, true);
                        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
                        return;
                    }
                    gw_com_api.setError(false, "frmOption2", 1, "plan_dt", false, true);
                    gw_com_api.setError(false, "frmOption2", 1, "rmk", false, true);

                    var issue_no = gw_com_api.getValue("frmData_SUB", 1, "issue_no");
                    var act_seq = gw_com_api.getValue("frmData_SUB", 1, "act_seq")

                    var args = {
                        url: "COM",
                        user: gw_com_module.v_Session.USR_ID,
                        param: [
                            {
                                query: "PCN_1030_2",
                                row: [{
                                    crud: "U",
                                    column: [
                                        { name: "issue_no", value: issue_no },
                                        { name: "act_seq", value: act_seq },
                                        { name: "plan_dt", value: new_plan_dt }
                                    ]
                                }]
                            },
                            {
                                query: "PCN_1010_9",
                                row: [{
                                    crud: "C",
                                    column: [
                                        { name: "chg_idx", value: "" },
                                        { name: "chg_tp", value: "plan_dt" },
                                        { name: "old_val", value: old_plan_dt },
                                        { name: "new_val", value: new_plan_dt },
                                        { name: "rmk", value: rmk },
                                        { name: "issue_no", value: issue_no },
                                        { name: "act_seq", value: act_seq }
                                    ]
                                }]
                            }
                        ],
                        handler: {
                            success: successSave,
                            param: {}
                        }
                    };
                    gw_com_module.objSave(args);

                } else {

                    var args = {
                        target: [{ id: "frmOption2", focus: true }]
                    };
                    gw_com_module.objToggle(args);

                }
            }
            break;
    }

}
//----------
function processTabChange(param) {

    closeOption({});

}
//----------
function processEdit(param) {

    v_global.process.handler = processRetrieve;
    if (!checkUpdatable({})) return;
    processRetrieve(param);

}
//----------
function processStat(param) {

    
    //if (!checkUpdatable({ check: true })) return false;
    gw_com_api.setError(false, "frmData_SUB", 1, "plan_dt", false);
    gw_com_api.setError(false, "frmData_SUB", 1, "exam_rmk", false);

    switch (param.element) {
        case "접수":
            {
                gw_com_api.setValue("frmData_MAIN", 1, "astat", "검토접수");
                gw_com_api.setValue("frmData_MAIN", 1, "pstat", "검토");
                gw_com_api.setValue("frmData_SUB", 1, "act_dt", gw_com_api.getDate());
                gw_com_api.setValue("frmData_SUB", 1, "act_user", gw_com_module.v_Session.USR_ID);
                gw_com_api.setValue("frmData_SUB", 1, "act_user_nm", gw_com_module.v_Session.USR_NM);
                gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
                gw_com_api.setCRUD("frmData_SUB", 1, "modify");
                processSave({});
            }
            break;
        case "검토승인":
        case "검토반려":
        case "공유완료":
            {
                //if (gw_com_api.getValue("frmData_SUB", 1, "exam_rmk") == "") {
                //    gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
                //    return;
                //}
                var astat = param.element;
                var pstat = param.element == "검토승인" ? "검토" : param.element == "검토반려" ? "반려" : "완료";
                var result = param.element == "검토승인" ? "접수승인" : param.element == "검토반려" ? "부적합" : "공유";
                gw_com_api.setValue("frmData_MAIN", 1, "astat", astat);
                gw_com_api.setValue("frmData_MAIN", 1, "pstat", pstat);
                gw_com_api.setValue("frmData_SUB", 1, "exam_dt", gw_com_api.getDate());
                gw_com_api.setValue("frmData_SUB", 1, "exam_user", gw_com_module.v_Session.USR_ID);
                gw_com_api.setValue("frmData_SUB", 1, "exam_user_nm", gw_com_module.v_Session.USR_NM);
                gw_com_api.setValue("frmData_SUB", 1, "exam_result", result);
                gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
                gw_com_api.setCRUD("frmData_SUB", 1, "modify");
                if (param.element == "검토승인") {
                    if (gw_com_api.getValue("frmData_SUB", 1, "plan_dt") == "") {
                        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
                        gw_com_api.setError(true, "frmData_SUB", 1, "plan_dt", false);
                        return;
                    }
                } else if (param.element == "검토반려") {
                    param.batch = {
                        type: "PCN-MAIL",
                        data: {
                            type: "PCN-RQST-REJECT",
                            key_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no")
                        }
                    };
                }
                gw_com_api.setError(false, "frmData_SUB", 1, "plan_dt", false);
                processSave(param);
            }
            break;
        case "담당":
            {
                v_global.event.data = {
                    issue_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no")
                };
                var args = {
                    type: "PAGE", page: "PCN_1021", title: "담당 지정",
                    width: 800, height: 500, locate: ["center", "bottom"], open: true,
                    id: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args = { page: args.page, param: { ID: args.id, data: v_global.event.data } };
                    gw_com_module.dialogueOpen(args);
                }
                //gw_com_api.setValue("frmData_MAIN", 1, "astat", "담당자변경");
                //gw_com_api.setValue("frmData_MAIN", 1, "pstat", "검토");
                //gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
                //gw_com_api.setValue("frmData_SUB", 1, "act_dt", gw_com_api.getDate());
                //gw_com_api.setValue("frmData_SUB", 1, "act_user", gw_com_module.v_Session.USR_ID);
                //gw_com_api.setValue("frmData_SUB", 1, "act_user_nm", gw_com_module.v_Session.USR_NM);
                //gw_com_api.setValue("frmData_SUB", 1, "exam_dt", gw_com_api.getDate());
                //gw_com_api.setValue("frmData_SUB", 1, "exam_user", gw_com_module.v_Session.USR_ID);
                //gw_com_api.setValue("frmData_SUB", 1, "exam_user_nm", gw_com_module.v_Session.USR_NM);
                //gw_com_api.setValue("frmData_SUB", 1, "exam_result", "담당자변경");
                //gw_com_api.setCRUD("frmData_SUB", 1, "modify");
                //processSave({});
            }
            break;
        case "진행":
            {
                param.batch = {
                    type: "ECR",
                    data: {
                        issue_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no"),
                        emp_no: gw_com_module.v_Session.EMP_NO,
                        dept_cd: gw_com_module.v_Session.DEPT_CD,
                        user_id: gw_com_module.v_Session.USR_ID
                    }
                };
                processBatch(param);
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MEMO3") {
        gw_com_api.setValue("frmData_MEMO1", param.row, param.element, param.value.current);
    } else if (param.object == "frmOption") {
        if (param.element == "user_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "user_id", "");
        }
    } else if (param.object == "frmData_SUB") {
        //if (param.element == "exam_result") {
        //    var astat = param.value.current == "승인" ? "검토승인" : "검토반려";
        //    var pstat = param.value.current == "승인" ? "검토" : "반려";
        //    gw_com_api.setValue("frmData_MAIN", 1, "astat", astat);
        //    gw_com_api.setValue("frmData_MAIN", 1, "pstat", pstat);
        //    gw_com_api.setValue("frmData_SUB", 1, "exam_dt", gw_com_api.getDate());
        //    gw_com_api.setValue("frmData_SUB", 1, "exam_user", gw_com_module.v_Session.USR_ID);
        //    gw_com_api.setValue("frmData_SUB", 1, "exam_user_nm", gw_com_module.v_Session.USR_NM);
        //    gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
        //    gw_com_api.setCRUD("frmData_SUB", 1, "modify");
        //}
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        //case "chg_memo1":
        //case "chg_memo2":
        //    if (!checkEditable({})) return;
        //    if (!checkManipulate({})) return;
        //    if (param.element == "chg_memo1") {
        //        v_global.logic.memo = "내용(변경 전)";
        //    } else {
        //        v_global.logic.memo = "내용(변경 후)";
        //    }
        //    processMemo({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });
        //    break;
        case "dept_nm":
            {
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
            }
            break;
        case "user_nm":
            {
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
            }
            break;
        case "supp_nm":
            {
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
            }
            break;
        default:
            return;
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "frmOption") {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "user_id", argument: "arg_user_id" }
                ],
                //remark: [
                //    { element: [{ name: "work_ym" }] },
                //    //{ element: [{ name: "emp_no" }] },
                //    { element: [{ name: "emp_nm" }] }
                //]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" },
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_FileA" }
            ],
            key: param.key
        };
    } else if (param.object == "frmData_SUB") {
        args = {
            source: {
                type: "FORM", id: "frmData_MAIN",
                element: [
                    { name: "issue_no", argument: "arg_issue_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_SUB", edit: true },
            ]
        };
    } else {
        args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "issue_no", argument: "arg_issue_no" },
                    { name: "issue_no", argument: "arg_data_key" }
                ],
                argument: [
                    { name: "arg_data_seq", value: -1 }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN", edit: true },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" }
                //{ type: "FORM", id: "frmData_SUB", edit: true },
                /*{ type: "GRID", id: "grdData_FileA" }*/
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
        gw_com_api.selectTab("lyrTab", 2);
        processFileList({});
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    createDW({ astat: gw_com_api.getValue("frmData_MAIN", 1, "astat") });
    
}
//2021-06-08 KYT
function processFileList(param) {
    // called by processRetrieveComplete
    if (!checkManipulate({})) return;

    var dataType = (param.data_tp == undefined) ? "PCN" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type
    var dataKey = gw_com_api.getValue("frmData_MAIN", 1, "issue_no");


    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: param.data_key == undefined ? dataKey : param.data_key },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? 0 : param.data_seq) },
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
function processFileUpload(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    //var args = {
    //    type: "PAGE", page: "w_upload_pcn", title: "파일 업로드",
    //    width: 650, height: 200,
    //    //locate: ["center", 600],
    //    open: true
    //};
    //if (gw_com_module.dialoguePrepare(args) == false) {
    //    var args = {
    //        page: "w_upload_pcn",
    //        param: {
    //            ID: gw_com_api.v_Stream.msg_upload_ECCB,
    //            data: {
    //                user: gw_com_module.v_Session.USR_ID,
    //                key: gw_com_api.getValue("frmData_MAIN", 1, "issue_no"),
    //                seq: 1
    //            }
    //        }
    //    };
    //    gw_com_module.dialogueOpen(args);
    //}
    // set data for "File Upload"
    var dataType = "PCN";    // Set File Data Type

    // add by kyt 2021-06-03
    var dataKey = gw_com_api.getValue("frmData_MAIN", 1, "issue_no");
    var dataSeq = 1;
    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq}; // additional 
    // set Argument for Dialogue
    var pageArgs = dataType + ":multi" + ":Simple"; // 1.DataType, 2.파일선택 방식(multi/single), 3.UI Type(Simple/GroupA/ECM)
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 660, height: 500, scroll: true,  // multi( h:350, scroll) / single(h:300) / GroupA(h:500)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_3") {
        //if ($.inArray(gw_com_api.getValue("grdList_MAIN", "selected", "appr_yn2", true), ["", "9"]) == -1) {
        //    gw_com_api.messageBox([{ text: "결재중이거나 완료된 내역은 삭제할 수 없습니다." }]);
        //    return;
        //}
        args = { targetid: "grdData_FileA", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    }

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_SUB" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var key = [{
        KEY: [{
            NAME: "issue_no",
            VALUE: response[0].KEY[0].VALUE
        }],
        QUERY: "PCN_1030_1"
    }];
    if (param.batch == undefined) {
        $.ajaxSetup({ async: false });
        processRetrieve({ object: "frmOption", key: key });
        $.ajaxSetup({ async: true });
        processRetrieve({});
    } else {
        param.key = key;
        processBatch(param);
    }

}
//----------
function processBatch(param) {

    var args;
    switch (param.batch.type) {
        case "PCN-MAIL":
            {
                args = {
                    url: "COM",
                    procedure: "dbo.PROC_MAIL_ECCB_PCN",
                    nomessage: true,
                    input: [
                        { name: "type", value: param.batch.data.type, type: "varchar" },
                        { name: "key_no", value: param.batch.data.key_no, type: "varchar" },
                        { name: "key_seq", value: "0", type: "varchar" },
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }

                    ],
                    handler: {
                        success: successBatch,
                        param: param
                    }
                };
            }
            break;
        case "ECR":
            {
                args = {
                    url: "COM",
                    procedure: "dbo.PROC_PCN_TO_ECR",
                    input: [
                        { name: "issue_no", value: param.batch.data.issue_no, type: "varchar" },
                        { name: "emp_no", value: param.batch.data.emp_no, type: "varchar" },
                        { name: "dept_cd", value: param.batch.data.dept_cd, type: "varchar" },
                        { name: "user_id", value: param.batch.data.user_id, type: "varchar" }
                    ],
                    output: [
                        { name: "ecr_no", type: "varchar" }
                    ],
                    handler: {
                        success: successBatch,
                        param: param
                    }
                };
            }
            break;
        default:
            return;
            break;
    }
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (param.batch.type == "ECR") {
        var args = {
            ID: gw_com_api.v_Stream.msg_linkPage,
            to: {
                type: "MAIN"
            },
            data: {
                page: "w_eccb1010",
                title: "ECR 등록",
                param: [
                    { name: "AUTH", value: "C" },
                    { name: "ecr_no", value: response.VALUE[0] },
                    { name: "issue_no", value: param.batch.data.issue_no }
                ]
            }
        };
        gw_com_module.streamInterface(args);
    }
    $.ajaxSetup({ async: false });
    processRetrieve({ object: "frmOption", key: param.key });
    $.ajaxSetup({ async: true });
    processRetrieve({});

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
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            type: "PAGE", page: "w_edit_html_eccb", title: "상세 내용",
            width: 800,
            height: 570,
            locate: ["center", "center"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_edit_html_eccb",
                param: {
                    ID: gw_com_api.v_Stream.msg_edit_HTML,
                    data: {
                        edit: true,
                        title: v_global.logic.memo,
                        html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

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
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "FORM", id: "frmData_MEMO3" },
            { type: "GRID", id: "grdData_FileA" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function createDW(param) {

    //=====================================================================================
    var args = {
        targetid: "frmData_SUB", query: "PCN_1030_2", type: "TABLE", title: "Wonik IPS 검토결과",
        caption: true, show: true, selectable: true,
        editable: { bind: "select", focus: "", validate: true },
        content: {
            width: { label: 44, field: 56 }, height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "접수일", format: { type: "label" } },
                        { name: "act_dt", mask: "date-ymd", editable: { type: "hidden", width: 300 } },
                        { header: true, value: "접수자", format: { type: "label" } },
                        { name: "act_user_nm", editable: { type: "hidden", width: 200 } },
                        { name: "act_user", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "완료예정일", format: { type: "label" } },
                        { name: "plan_dt", editable: { type: "hidden", width: 200, validate: { rule: "dateISO" } }, mask: "date-ymd" },
                        { header: true, value: "승인자", format: { type: "label" } },
                        { name: "appr_user_nm", editable: { type: "hidden", width: 200 }, display: true }
                    ]
                },
                {
                    element: [
                        { header: true, value: "검토일", format: { type: "label" } },
                        { name: "exam_dt", mask: "date-ymd", editable: { type: "hidden", width: 300 } },
                        { header: true, value: "검토자", format: { type: "label" } },
                        { name: "exam_user_nm", editable: { type: "hidden", width: 200 } },
                        { name: "exam_user", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "판정", format: { type: "label" } },
                        { name: "exam_result", editable: { type: "hidden", width: 200 } },
                        { header: true, value: "승인일", format: { type: "label" } },
                        { name: "appr_date", editable: { type: "hidden", width: 300 }, mask: "date-ymd", display: true }
                    ]
                },
                {
                    element: [
                        { header: true, value: "검토결과", format: { type: "label" } },
                        {
                            name: "exam_rmk", style: { colspan: 7 },
                            format: { type: "textarea", rows: 4, width: 996 }
                        },
                        { name: "issue_no", editable: { type: "hidden" }, hidden: true },
                        { name: "act_seq", editable: { type: "hidden" }, hidden: true }
                    ]
                }
            ]
        }
    };
    //----------
    var issue_tp = gw_com_api.getValue("frmData_MAIN", 1, "issue_tp");
    switch (param.astat) {
        case "검토접수":
            {
                args.content.row[0].element[6].editable = { type: "text", width: 100 };
                args.content.row[2].element[1].editable = { type: "textarea", rows: 4, width: 996, validate: { rule: "required", message: "검토결과" } };
            }
            break;
        case "검토승인":
            //case "검토반려":
            {
                args.content.row[0].element[6].editable = { type: "text", width: 100 };
            }
            break;
        //default:
        //    {
        //        args.content.row[0].element[6].editable = { type: "text", width: 100 };
        //    }
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_SUB", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    processSetButton(param);
    //=====================================================================================
    var args = { targetid: "frmData_SUB", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================
    if (checkCRUD({}) == "none") return;
    processRetrieve({ object: "frmData_SUB" });
    //=====================================================================================

}
//----------
function processSetButton(param) {

    var issue_tp = gw_com_api.getValue("frmData_MAIN", 1, "issue_tp");
    //-----------------------
    var args = {
        targetid: "lyrMenu_4", type: "FREE",
        element: []
    };
    //-----------------------
    var ele = [];
    switch (param.astat) {
        case "검토요청":
            {
                ele[ele.length] = { name: "접수", value: "접수", icon: "기타" };
            }
            break;
        case "검토접수":
            {
                if (issue_tp == "변경검증") {
                    ele[ele.length] = { name: "검토승인", value: "접수승인", icon: "예" };
                    ele[ele.length] = { name: "검토반려", value: "부적합", icon: "아니오" };
                } else {
                    ele[ele.length] = { name: "공유완료", value: "검토완료", icon: "예" };
                    ele[ele.length] = { name: "검토반려", value: "검토반려", icon: "아니오" };
                }
                ele[ele.length] = { name: "담당", value: "담당자변경", icon: "실행" };
            }
            break;
        case "검토승인":
            {
                ele[ele.length] = { name: "저장", value: "저장" };
                ele[ele.length] = { name: "진행", value: "ECR등록", icon: "실행" };
            }
            break;
        //case "검토반려":
        //    {
        //        ele[ele.length] = { name: "저장", value: "저장" };
        //    }
        //    break;
        case "ECR":
        case "CIP":
        case "ECO":
        case "보류":
            {
                ele[ele.length] = { name: "변경", value: "완료예정일 변경", icon: "실행" };
            }
            break;
        default:
            {
                gw_com_api.hide("lyrMenu_4");
                return;
            }
    }

    if (ele.length > 0)
        args.element = ele.concat(args.element);
    //-----------------------
    gw_com_module.buttonMenu(args);
    gw_com_api.show("lyrMenu_4");
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================

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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRetrieve({});

                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
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
                    //changed by kyt 2021-06-07
                    case "SYS_FileUpload": {
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.event.data;
                    } break;
                    case "DLG_SUPPLIER":
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        break;
                    case "PCN_1021":
                        {
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
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
                    case "PCN_1021":
                        if (param.data != undefined) {
                            //var key = [{
                            //    QUERY: "PCN_1030_1",
                            //    KEY: [
                            //        { NAME: "issue_no", VALUE: param.data.issue_no }
                            //    ]
                            //}];
                            //processRetrieve({ key: key });
                            processRetrieve({});
                        }
                        break;
                    // Add by kyt 21.06.07
                    case "SYS_FileUpload": {
                        processFileList({});
                    } break;
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
                        { type: "GRID", id: "grdData_FileA", select: true }
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
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedTeam:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//