//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 시정조치 요구서 발행
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "발생근거", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM030" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }

    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "상세", value: "발생정보", icon: "실행" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "DLG_NCR_1", type: "TABLE", title: "NCR",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 100, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "발행번호", format: { type: "label" } },
                            { name: "rqst_no" },
                            { header: true, value: "발행자", format: { type: "label" } },
                            { name: "rqst_user_nm", mask: "search", display: true },
                            { header: true, value: "발행일자", format: { type: "label" } },
                            { name: "rqst_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발생구분", format: { type: "label" } },
                            { name: "issue_tp" },
                            { header: true, value: "발생부서", format: { type: "label" } },
                            { name: "issue_dept_nm" },
                            { header: true, value: "발생일자", format: { type: "label" } },
                            { name: "issue_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발행구분", format: { type: "label" } },
                            { name: "astat" },
                            { header: true, value: "발생근거", format: { type: "label" } },
                            { name: "rqst_tp_nm", },
                            { header: true, value: "처리요구일", format: { type: "label" } },
                            { name: "actrqst_dt", mask: "date-ymd" },
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
            targetid: "grdData_Sub", query: "DLG_NCR_2", title: "담당 부서",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "담당부서", name: "dept_nm", width: 120 },
                { header: "담당자", name: "user_nm", width: 60 },
                { header: "협력사", name: "supp_nm", width: 120 },
                { header: "처리상태", name: "astat_nm", width: 70, align: "center" },
                { header: "처리방안", name: "plan_cd", width: 80, align: "center" },
                { header: "계획자", name: "plan_user_nm", width: 60, align: "center" },
                { header: "계획일자", name: "plan_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "처리자", name: "act_user_nm", width: 60, align: "center" },
                { header: "처리일자", name: "act_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "확인결과", name: "check_cd", width: 60, align: "center" },
                { header: "확인자", name: "check_user", width: 60, align: "center" },
                { name: "rqst_no", hidden: true },
                { name: "act_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_D1", query: "DLG_NCR_3", type: "TABLE", title: "처리계획 및 결과",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 90, field: 180 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "처리상태", format: { type: "label" } },
                            { name: "astat_nm" },
                            { name: "astat", hidden: true },
                            { header: true, value: "협력사 귀책", format: { type: "label" } },
                            { name: "duty_supp", format: { type: "checkbox", value: "1", offval: "0", title: "" } },
                            { header: true, value: "계획자", format: { type: "label" } },
                            { name: "plan_user_nm" },
                            { header: true, value: "계획일자", format: { type: "label" } },
                            { name: "plan_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리방안", format: { type: "label" } },
                            { name: "plan_cd" },
                            { header: true, value: "원인유형", format: { type: "label" } },
                            { name: "reason_nm" },
                            { header: true, value: "현상유형", format: { type: "label" } },
                            { name: "status_tp_nm" },
                            { header: true, value: "처리자", format: { type: "label" } },
                            { name: "act_user_nm", style: { colfloat: "float" }, format: { width: 80 } },
                            { name: "act_dt", mask: "date-ymd", style: { colfloat: "floated" } },
                            { name: "rqst_no", hidden: true },
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
            targetid: "frmData_D1_2", query: "DLG_NCR_3", type: "TABLE", title: "처리계획 및 결과",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 100, field: 100 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "원인분석", format: { type: "label" }, style: { colspan: 10 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "현상원인", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "memo01", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8, width: 210 }
                            },
                            {
                                name: "memo02", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8, width: 210 }
                            },
                            {
                                name: "memo03", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8, width: 210 }
                            },
                            {
                                name: "memo04", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8, width: 210 }
                            },
                            {
                                name: "memo05", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8, width: 210 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "재발방지 대책", format: { type: "label" }, style: { colspan: 10 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "관리적 대책", format: { type: "label" }, style: { colspan: 5 } },
                            { header: true, value: "기술적 대책", format: { type: "label" }, style: { colspan: 5 } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "memo11", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8, width: 550 }
                            },
                            {
                                name: "memo12", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8, width: 550 }
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
            targetid: "frmData_D1_3", query: "DLG_NCR_3", type: "TABLE", title: "처리계획 및 결과",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 100, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "대책확인결과", format: { type: "label" } },
                            { name: "gw_stat" },
                            { header: true, value: "확인자", format: { type: "label" } },
                            { name: "gw_stat_emp" },
                            { header: true, value: "확인일자", format: { type: "label" } },
                            { name: "gw_stat_dt" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "QA", format: { type: "label" } },
                            {
                                name: "qa_rmk", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8, width: 990 }
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
            targetid: "frmData_D2", query: "DLG_NCR_4", type: "TABLE", title: "실시결과 확인",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                height: 25, width: { label: 100, field: 120 },
                row: [
                    {
                        element: [
                            { header: true, value: "계획일자", format: { type: "label" } },
                            { name: "plan_date", mask: "date-ymd" },
                            { header: true, value: "실시결과", format: { type: "label" } },
                            { name: "astat" },
                            { header: true, value: "확인자", format: { type: "label" } },
                            { name: "astat_user_nm" },
                            { header: true, value: "확인일자", format: { type: "label" } },
                            { name: "astat_dt", format: { type: "text", width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용결과", format: { type: "label" } },
                            {
                                name: "check_rmk", style: { colspan: 7 },
                                format: { type: "textarea", rows: 8, width: 990 }
                            },
                            { name: "rqst_no", hidden: true },
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
            targetid: "frmData_D2", query: "DLG_NCR_4", type: "TABLE", title: "실시결과 확인",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                height: 25, width: { label: 100, field: 120 },
                row: [
                    {
                        element: [
                            { header: true, value: "계획일자", format: { type: "label" } },
                            { name: "plan_date", mask: "date-ymd" },
                            { header: true, value: "실시결과", format: { type: "label" } },
                            { name: "astat" },
                            { header: true, value: "확인자", format: { type: "label" } },
                            { name: "astat_user_nm" },
                            { header: true, value: "확인일자", format: { type: "label" } },
                            { name: "astat_dt", format: { type: "text", width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용결과", format: { type: "label" } },
                            {
                                name: "check_rmk", style: { colspan: 7 },
                                format: { type: "textarea", rows: 8, width: 990 }
                            },
                            { name: "rqst_no", hidden: true },
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
            targetid: "grdData_File1", query: "DLG_FILE_ZFILE_V", title: "첨부 문서(분석관련 보고서 및 변경점 / 개선사항 자료 첨부)",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 250, align: "left" },
                { header: "등록부서", name: "upd_dept", width: 100, align: "center" },
                { header: "등록자", name: "upd_usr", width: 60, align: "center" },
                { header: "장비군", name: "file_group1", width: 80, align: "center", hidden: true },
                { header: "업무구분", name: "file_group2", width: 80, align: "center" },
                { header: "문서분류", name: "file_group3", width: 80, align: "center" },
                { header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
                { header: "Category", name: "file_group5", width: 80, align: "center", hidden: true },
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
                { name: "file_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        //----------
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "FORM", id: "frmData_D1", offset: 8 },
                { type: "FORM", id: "frmData_D1_2", offset: 8 },
                { type: "FORM", id: "frmData_D1_3", offset: 8 },
                { type: "FORM", id: "frmData_D2", offset: 8 },
                { type: "GRID", id: "grdData_File1", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_Main", element: "상세", event: "click", handler: click_lyrMenu_Main_상세 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_상세(ui) { popupDetail(ui); }
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_닫기(ui) { processClose({}); }
        //=====================================================================================
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: rowselected_grdData_Sub };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Sub(ui) { if (ui.status) processLink(ui); }
        //----------
        var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: click_File_DownLoad };
        gw_com_module.eventBind(args);
        function click_File_DownLoad(ui) {
            gw_com_module.downloadFile({ source: { id: ui.object, row: ui.row }, targetid: "lyrDown" });
        }
        //=====================================================================================

        // startup process.
        gw_com_module.startPage();

        v_global.logic.key = gw_com_api.getPageParameter("rqst_no");
        if (v_global.logic.key != "")
            processRetrieve({ key: v_global.logic.key }); //수정 및 조회

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- Popup Detail Windows
function popupDetail(ui) {

    v_global.event.object = "frmData_Main";
    v_global.event.row = 1;

    var issue_no = gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false);
    if (issue_no == "") return;
    var args = {
        to: "INFO_ISSUE",
        issue_no: issue_no
    }
    gw_com_site.linkPage(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_rqst_no", value: param.key },
                { name: "arg_data_key", value: param.key },     // 첨부파일용
                { name: "arg_data_seq", value: -1 }             // 첨부파일용
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub", select: true },  //checkEditable({}) ? false : 
            { type: "GRID", id: "grdData_File1" }
        ],
        clear: [
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D1_2" },
            { type: "FORM", id: "frmData_D1_3" },
            { type: "FORM", id: "frmData_D2" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.object == "grdData_Sub") {
        args = {
            key: param.key,
            source: {
                type: "GRID", id: "grdData_Sub", row: "selected", block: true,
                element: [
                    { name: "rqst_no", argument: "arg_rqst_no" },
                    { name: "act_seq", argument: "arg_act_seq" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_D1" },
                { type: "FORM", id: "frmData_D1_2" },
                { type: "FORM", id: "frmData_D1_3" },
                { type: "FORM", id: "frmData_D2" }
            ]
        };
    }
    else if (param.object == "grdData_File1") {
        args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmData_Main",
                element: [{ name: "rqst_no", argument: "arg_data_key" }],
                argument: [{ name: "arg_data_seq", value: -1 }]
            },
            target: [{ type: "GRID", id: "grdData_File1", select: true }]
        };
    }
    else return;
    gw_com_module.objRetrieve(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D1_2" },
            { type: "FORM", id: "frmData_D1_3" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    if (gw_com_api.getPageParameter("LAUNCH") == "POPUP" ||
        gw_com_api.getPageParameter("LAUNCH") == "CHILD") {
        v_global.process.handler = processClose;
        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);
    } else {
        window.opener = 'nothing';
        window.open('', '_parent', '');
        self.close();
    }

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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            // PageId가 다를 때 Skip 
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            // 확인 메시지별 처리    
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmSave: {
                    if (param.data.result == "YES") processSave(param.data.arg);
                    else {
                        processClear({});
                        if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    }
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: {
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_confirmBatch: {
                    if (param.data.result == "YES") processBatch(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informSaved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informRemoved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) {
                case "INFO_VOC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = {
                        voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    };
                } break;
                case "INFO_SPC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = {
                        issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    };
                } break;
            }
            gw_com_module.streamInterface(args);
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
    }

}