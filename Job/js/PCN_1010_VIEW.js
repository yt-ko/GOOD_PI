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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "변경구분",
                    data: [
                        { title: "작업자", value: "작업자" },
                        { title: "설비", value: "설비" },
                        { title: "재료", value: "재료" },
                        { title: "작업방법", value: "작업방법" },
                        { title: "기타", value: "기타" }
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

            if (gw_com_api.getPageParameter("issue_no") != "") {
                v_global.logic.issue_no = gw_com_api.getPageParameter("issue_no");
                processRetrieve({});
            }
        }
    },

    // manage UI. (design section)
    UI: function () {

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
                            { name: "dept_area_nm", format: { type: "text", width: 200 } },
                            { header: true, value: "회사명", format: { type: "label" } },
                            { name: "comp_nm", format: { type: "text", width: 500 }, style: { colspan: 3 }, width: 150 },
                            { name: "comp_cd", format: { type: "text" }, hidden: true },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "issue_dt", format: { type: "text", width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용예정일", format: { type: "label" } },
                            { name: "plan_date", format: { type: "text", width: 200 }, mask: "date-ymd" },
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
                            { name: "item_cd", format: { type: "text", width: 166 }, mask: "search" },
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
                            { name: "issue_title", format: { type: "text", width: 1002 }, style: { colspan: 5 } },
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "astat", format: { type: "text", width: 166 } },
                            { name: "pstat", format: { type: "text" }, hidden: true }
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
                            //{ name: "chg_memo4", format: { type: "textarea", rows: 4, width: 1000 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUB", query: "PCN_1030_2", type: "TABLE", title: "Wonik IPS 검토결과",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 44, field: 56 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "접수일", format: { type: "label" } },
                            { name: "act_dt", mask: "date-ymd", format: { type: "text", width: 200 } },
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
                            { name: "exam_dt", mask: "date-ymd", format: { type: "text", width: 200 } },
                            { header: true, value: "검토자", format: { type: "label" } },
                            { name: "exam_user_nm", format: { type: "text", width: 200 } },
                            { name: "exam_user", hidden: true },
                            { header: true, value: "판정", format: { type: "label" } },
                            { name: "exam_result", format: { type: "text", width: 200 } },
                            { header: true, value: "승인일", format: { type: "label" } },
                            { name: "appr_date", format: { type: "text", width: 200 }, mask: "date-ymd" }
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
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "FORM", id: "frmData_MEMO2", offset: 8 },
                { type: "FORM", id: "frmData_MEMO3", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "요청현황" },
                { type: "LAYER", id: "lyrTab_2", title: "요청등록" }
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
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_issue_no", value: v_global.logic.issue_no },
                { name: "arg_data_key", value: v_global.logic.issue_no },
                { name: "arg_data_seq", value: -1 }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "FORM", id: "frmData_MEMO3" },
            { type: "FORM", id: "frmData_SUB" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});

                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        } break;
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
                    case "":
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "":
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//