//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 견적제출
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
                    type: "INLINE", name: "전송방법",
                    data: [
                        { title: "SRM", value: "SRM" },
                        { title: "E-Mail", value: "E-Mail" },
                        { title: "Paper", value: "Paper" }
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

            if (v_global.process.param != "" && gw_com_api.getPageParameter("per_no") != "") {
                v_global.logic.per_no = gw_com_api.getPageParameter("per_no");
                v_global.logic.supp_seq = gw_com_api.getPageParameter("supp_seq");
                gw_com_api.setCaption("frmData_PER", "◈ 의뢰서 (" + v_global.logic.per_no + ")");
                $.ajaxSetup({ async: false });
                processRetrieve({});
                $.ajaxSetup({ async: true });
                if (gw_com_api.getValue("frmData_PER", 1, "per_type") == "BID" && $.inArray(gw_com_api.getValue("frmData_PER", 1, "pstat"), ["PUB", "RCV"]) >= 0)
                    processButton({ element: "공고문" });
            } else {
                gw_com_api.messageBox([{text: "잘못된 접근입니다."}]);
                processClose({});
            }

        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", act: true },
                { name: "접수", value: "수신", icon: "기타", updatable: true },
                { name: "저장", value: "저장" },
                { name: "제출", value: "제출", icon: "예", updatable: true },
                { name: "취소", value: "제출취소", icon: "아니오", updatable: true },
                { name: "포기", value: "포기", icon: "예", updatable: true },
                { name: "출력", value: "의뢰서 출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_BID", type: "FREE", show: false,
            element: [
                { name: "공고문", value: "입찰공고문", icon: "기타" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "접수자",
            trans: true, border: true, show: false,
            editable: { focus: "rcvd_man", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "rcvd_man", label: { title: "접수자명 :" },
                                editable: { type: "text", size: 10, maxlength: 20, validate: { rule: "required", message: "접수자명" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "접수확인", value: "확인", act: true, format: { type: "button", icon: "실행" } },
                            { name: "접수취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE", title: "제출자",
            trans: true, border: true, show: false,
            editable: { focus: "rpt_man", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "rpt_man", label: { title: "제출자 :" },
                                editable: { type: "text", size: 10, maxlength: 20, validate: { rule: "required", message: "제출자" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rpt_rmk", label: { title: "제출비고 :" },
                                editable: { type: "texts", size: 50, maxlength: 150 }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "제출확인", value: "확인", act: true, format: { type: "button", icon: "실행" } },
                            { name: "제출취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption3", type: "FREE", title: "포기사유",
            trans: true, border: true, show: false,
            editable: { focus: "gvp_man", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "gvp_man", label: { title: "제출자 :" },
                                editable: { type: "text", size: 10, maxlength: 20, validate: { rule: "required", message: "제출자" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "gvp_rmk", label: { title: "사유 :" },
                                editable: { type: "texts", size: 50, maxlength: 150, validate: { rule: "required", message: "포기사유" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "포기확인", value: "확인", act: true, format: { type: "button", icon: "실행" } },
                            { name: "포기취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption4", type: "FREE",
            trans: true, border: false, show: false,
            editable: { focus: "dlva_date", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dlva_date", label: { title: "납품가능일 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, validate: { rule: "required" } }
                            },
                            { name: "납기", value: "고객요청일로 일괄 변경", format: { type: "button", icon: "기타" } },
                            { name: "엑셀1", value: "엑셀로 저장", format: { type: "button", icon: "엑셀" } },
                            { name: "엑셀2", value: "엑셀 불러오기", format: { type: "button", icon: "엑셀" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_PER", query: "SRM_1022_1", type: "TABLE", title: "의뢰서",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 90, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "의뢰일자", format: { type: "label" } },
                            { name: "per_date", mask: "date-ymd" },
                            { header: true, value: "<font style='font-weight:bold'>접수기간</font>", format: { type: "label" } },
                            { name: "per_term", format: { type: "text", width: 300 } },
                            { name: "per_type_nm2", hidden: true },
                            { name: "per_type", hidden: true },
                            { header: true, value: "구매담당", format: { type: "label" } },
                            { name: "per_man" },
                            { name: "per_comp", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목(입찰명)", format: { type: "label" } },
                            { name: "per_title", format: { type: "text", width: 628 }, style: { colspan: 3, colfloat: "float" } },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            { name: "per_email" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "인도조건", format: { type: "label" } },
                            { name: "dlv_rmk" },
                            { header: true, value: "결제방법", format: { type: "label" } },
                            { name: "settle_rmk_nm" },
                            { header: true, value: "TEL", format: { type: "label" } },
                            { name: "per_telno" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "의뢰비고", format: { type: "label" } },
                            {
                                style: { colspan: 5, colfloat: "float" }, name: "per_rmk",
                                format: { type: "textarea", rows: 3, width: 1002 }
                            },
                            {
                                style: { colfloat: "floated" }, name: "send_rmk",
                                format: { type: "textarea", rows: 3, width: 1002 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "참조", format: { type: "label" } },
                            { name: "supp_man" },
                            { header: true, value: "접수자", format: { type: "label" } },
                            { name: "rcvd_man" },
                            { header: true, value: "", format: { type: "label" } },
                            { name: "" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "pstat_nm" },
                            { name: "pstat", hidden: true },
                            { name: "per_pstat_nm", hidden: true },
                            { header: true, value: "제출자", format: { type: "label" } },
                            { name: "rpt_man" },
                            { header: true, value: "제출일시", format: { type: "label" } },
                            { name: "rpt_dt" },
                            { name: "rpt_seq", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제출비고", format: { type: "label" } },
                            { style: { colspan: 5 }, name: "rpt_rmk", format: { type: "textarea", rows: 4, width: 1002 } },
                            { name: "per_no", hidden: true },
                            { name: "supp_seq", hidden: true },
                            { name: "_edit_yn", hidden: true },
                            { name: "supp_nm", hidden: true },
                            { name: "supp_telno", hidden: true },
                            { name: "supp_faxno", hidden: true },
                            { name: "supp_email1", hidden: true },
                            { name: "per_doc", hidden: true },
                            { name: "pdate", format: { type: "text", width: 150 }, hidden: true },
                            { name: "per_pdate", format: { type: "text", width: 150 }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PER", query: "SRM_1022_1", show: false,
            element: [
                { name: "per_no" },
                { name: "per_date" },
                { name: "per_comp" },
                { name: "per_man" },
                { name: "per_telno" },
                { name: "per_faxno" },
                { name: "per_email" },
                { name: "dlv_rmk" },
                { name: "settle_rmk" },
                { name: "close_date" },
                { name: "close_time" },
                { name: "per_term" },
                { name: "per_pstat" },
                { name: "per_rmk" },
                { name: "limit_date" },
                { name: "pstat" },
                { name: "rpt_seq" },
                { name: "supp_man" },
                { name: "rpt_man" },
                { name: "rcvd_man" },
                { name: "rpt_rmk" },
                { name: "supp_nm" },
                { name: "supp_telno" },
                { name: "supp_faxno" },
                { name: "supp_email1" },
                { name: "supp_seq" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PER_SUPP_D", query: "SRM_1022_3", title: "내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,// key: true,
            editable: { bind: "_edit_yn", focus: "qty", validate: true },
            element: [
                { header: "품번", name: "item_cd", width: 100, align: "center" },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "품목사양", name: "item_spec", width: 150 },
                { header: "수량", name: "qty", align: "right", width: 50, align: "right", mask: "numeric-int" },
                { header: "단위", name: "uom", width: 40, align: "center" },
                { header: "통화", name: "curr_cd", width: 40, align: "center" },
                { header: "고객요청일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                {
                    header: "납품가능일", name: "dlva_date", width: 100, align: "center",
                    editable: { type: "text", maxlength: 10, validate: { rule: "required" } }, mask: "date-ymd"
                },
                {
                    header: "견적단가", name: "rpt_price", width: 80, align: "right",
                    editable: { type: "text", width: 88, validate: { rule: "required" } }, mask: "currency-int"
                },
                { header: "견적금액", name: "rpt_amt", width: 80, align: "right", mask: "currency-int" },
                { header: "품목비고", name: "item_rmk", width: 250 },
                {
                    header: "비고", name: "rpt_rmk", width: 250,
                    editable: { type: "text", width: 258, maxlength: 100 }
                },
                { header: "청구자", name: "pr_man", width: 60, align: "center", hidden: true },
                { header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                { header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { name: "per_no", editable: { type: "hidden" }, hidden: true },
                { name: "supp_seq", editable: { type: "hidden" }, hidden: true },
                { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdData_PER_SUPP_D_data").parents('div.ui-jqgrid-bdiv').css("max-height", "300px");
        //=====================================================================================
        var args = {
            targetid: "grdData_PER_SUPP_D_XLS", query: "SRM_1022_3", title: "견적 내역",
            show: false,
            element: [
                { header: "품번", name: "item_cd", width: 100, align: "center" },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "품목사양", name: "item_spec", width: 150 },
                { header: "수량", name: "qty", align: "right", width: 50, align: "right", mask: "numeric-int" },
                { header: "단위", name: "uom", width: 40, align: "center" },
                { header: "통화", name: "curr_cd", width: 40, align: "center" },
                { header: "고객요청일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "납품가능일", name: "dlva_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "견적단가", name: "rpt_price", width: 80, align: "right", mask: "currency-int" },
                { header: "견적금액", name: "rpt_amt", width: 80, align: "right", mask: "currency-int", hidden: true },
                { header: "비고", name: "rpt_rmk", width: 250 },
                { header: "청구자", name: "pr_man", width: 60, align: "center", hidden: true },
                { header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                { header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { header: "품목비고", name: "item_rmk", width: 250 },
                { header: "ITEM_SEQ", name: "item_seq" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "SRM_1022_4", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn", focus: "file_desc", validate: true },
            element: [
                { header: "구분", name: "data_tp_nm", width: 150 },
                { header: "파일명", name: "file_nm", width: 250 },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "설명", name: "file_desc", width: 300, editable: { type: "text", width: 438, maxlength: 100 } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "data_tp", hidden: true },
                { name: "_edit_yn", hidden: true }
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
                { type: "FORM", id: "frmData_PER", offset: 8 },
                { type: "GRID", id: "grdData_PER_SUPP_D", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

        //gw_com_api.hide("lyrMenu");

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "접수", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "제출", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "포기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_BID", element: "공고문", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "접수확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "접수취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "제출확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "제출취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption3", element: "포기확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption3", element: "포기취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption4", element: "납기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption4", element: "엑셀1", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption4", element: "엑셀2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption4", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_PER", event: "keypress", element: "per_telno", handler: processKeypress };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_PER", event: "keypress", element: "per_faxno", handler: processKeypress };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_PER_SUPP_D", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption2");
    gw_com_api.hide("frmOption3");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "조회":
            {
                v_global.process.handler = processRetrieve;
                if (!checkUpdatable({})) return;
                processRetrieve({});
            }
            break;
        case "접수":
            {
                if (!checkStat({ check: true })) return;
                gw_com_api.setValue("frmOption", 1, "rcvd_man", gw_com_api.getValue("grdList_PER", 1, "supp_man", true));
                gw_com_api.show("frmOption");
                gw_com_api.setFocus("frmOption", 1, "rcvd_man");
            }
            break;
        case "접수확인":
            {
                var args = { target: [{ type: "FORM", id: "frmOption" }] };
                if (gw_com_module.objValidate(args) == false) return false;
                if (!checkStat({ check: true })) return;
                var column = [
                    { name: "pstat", value: "RCV" },
                    { name: "rcvd_man", value: gw_com_api.getValue("frmOption", 1, "rcvd_man") }
                ];
                processSave2({ column: column });
            }
            break;
        case "접수취소":
            {
                //closeOption({});
            }
            break;
        case "제출":
            {
                if (!checkUpdatable({ check: true })) return;
                if (!checkStat({ check: true })) return;
                if (gw_com_api.getFindRow("grdData_FILE", "data_tp", "PER_SUPP") == -1) {
                    gw_com_api.showMessage("견적서 첨부 후 제출하시기 바랍니다.");
                    processInsert({ object: "FILE" });
                    return;
                };
                var row = gw_com_api.getFindRow("grdData_PER_SUPP_D", "rpt_amt", "0");
                if (row > 0) {
                    gw_com_api.showMessage("견적(단가)금액을 입력 후 제출하시기 바랍니다.");
                    gw_com_api.selectRow("grdData_PER_SUPP_D", row, true);
                    return;
                };
                gw_com_api.setValue("frmOption2", 1, "rpt_man", gw_com_api.getValue("grdList_PER", 1, "rcvd_man", true));
                gw_com_api.setValue("frmOption2", 1, "rpt_rmk", "");
                gw_com_api.show("frmOption2");
                gw_com_api.setFocus("frmOption2", 1, "rpt_man");
                //if (gw_com_api.getValue("frmData_PER", 1, "rpt_seq") != 0) {
                //    if (!param.confirm) {
                //        gw_com_api.messageBox([{ text: "이미 제출한 견적서입니다." }, { text: "견적서를 다시 제출하시겠습니까?" }],
                //            420, gw_com_api.v_Message.msg_confirmSave, "YESNO", param);
                //    } else {
                //        gw_com_api.show("frmOption2");
                //        gw_com_api.setFocus("frmOption2", 1, "rpt_man");
                //    }
                //}
                //param.confirm = false;
            }
            break;
        case "제출확인":
            {
                var args = { target: [{ type: "FORM", id: "frmOption2" }] };
                if (gw_com_module.objValidate(args) == false) return false;
                if (!checkStat({ check: true })) return;

                if (param.confirm) {
                    var rpt_seq = Number(gw_com_api.getValue("grdList_PER", 1, "rpt_seq", true)) + 1;
                    var column = [
                        { name: "pstat", value: "PRS" },
                        { name: "rpt_seq", value: rpt_seq },
                        { name: "rpt_man", value: gw_com_api.getValue("frmOption2", 1, "rpt_man") },
                        { name: "rpt_rmk", value: gw_com_api.getValue("frmOption2", 1, "rpt_rmk") }//,
                        //{ name: "rpt_dt", value: rpt_seq == 1 ? "SYSDATE" : "" }
                    ];
                    processSave2({ column: column, pstat: "PRS" });
                } else {
                    gw_com_api.messageBox([{ text: "제출한 내역은 더이상 수정할 수 없습니다." }, { text: "제출하시겠습니까?" }],
                        420, gw_com_api.v_Message.msg_confirmSave, "YESNO", param);
                }
            }
            break;
        case "제출취소":
            {
                //closeOption({});
            }
            break;
        case "취소":
            {
                if (!checkUpdatable({ check: true })) return;
                //if ($.inArray(gw_com_api.getValue("grdList_PER", 1, "pstat", true), ["PRS", "CHK"]) == -1) {
                var pstat = Query.getPSTAT({ per_no: v_global.logic.per_no, supp_seq: v_global.logic.supp_seq });
                if ($.inArray(pstat, ["PRS"]) == -1) {
                    gw_com_api.messageBox([{ text: "제출 취소 처리를 할 수 없습니다." }]);
                    return;
                }
                var column = [{ name: "pstat", value: "RCV" }];
                processSave2({ column: column });
            }
            break;
        case "포기":
            {
                if (!checkUpdatable({ check: true })) return;
                gw_com_api.setValue("frmOption3", 1, "gvp_man", gw_com_api.getValue("grdList_PER", 1, "rcvd_man", true));
                gw_com_api.setValue("frmOption3", 1, "gvp_rmk", "");
                gw_com_api.show("frmOption3");
                gw_com_api.setFocus("frmOption3", 1, "gvp_man");
            }
            break;
        case "포기확인":
            {
                var args = { target: [{ type: "FORM", id: "frmOption3" }] };
                if (gw_com_module.objValidate(args) == false) return false;
                if (!checkStat({ check: true })) return;

                if (param.confirm) {
                    var rpt_seq = Number(gw_com_api.getValue("grdList_PER", 1, "rpt_seq", true)) + 1;
                    var column = [
                        { name: "pstat", value: "GVP" },
                        { name: "gvp_rmk", value: gw_com_api.getValue("frmOption3", 1, "gvp_rmk") }
                    ];
                    processSave2({ column: column });
                } else {
                    gw_com_api.messageBox([{ text: "포기한 내역은 더이상 수정할 수 없습니다." }, { text: "포기하시겠습니까?" }],
                        420, gw_com_api.v_Message.msg_confirmSave, "YESNO", param);
                }
            }
            break;
        case "포기취소":
            {

            }
            break;
        case "저장":
            {
                processSave({});
            }
            break;
        case "출력":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                processExport({});
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
        case "추가":
            {
                if (!checkStat({ check: true })) return;
                var obj = param.object.replace("lyrMenu_", "");
                processInsert({ object: obj });
            }
            break;
        case "삭제":
            {
                if (!checkStat({ check: true })) return;
                var obj = param.object.replace("lyrMenu_", "");
                processDelete({ object: obj });
            }
            break;
        case "납기":
            {
                if (checkStat({ check: true })) {
                    for (var i = 1 ; i <= gw_com_api.getRowCount("grdData_PER_SUPP_D") ; i++) {
                        gw_com_api.selectRow("grdData_PER_SUPP_D", i, true);
                        gw_com_api.setValue("grdData_PER_SUPP_D", i, "dlva_date", gw_com_api.getValue("grdData_PER_SUPP_D", i, "dlvr_date", true), true);
                    }
                }
            }
            break;
        case "엑셀1":
            {
                gw_com_module.gridDownload({ targetid: "grdData_PER_SUPP_D_XLS" });
            }
            break;
        case "엑셀2":
            {
                if (!checkStat({ check: true })) return;
                v_global.logic.popup_data = {
                    user: gw_com_module.v_Session.USR_ID,
                    act_id: "1022",
                    per_no: v_global.logic.per_no,
                    supp_seq: v_global.logic.supp_seq
                }
                var args = {
                    type: "PAGE", page: "w_upload_per_excel", title: "입찰/견적내역 등록",
                    width: 650, height: 200, locate: ["center", 30], open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_upload_per_excel",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openDialogue,
                            data: v_global.logic.popup_data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "공고문":
            {
                if (!checkManipulate({})) return;
                var args = {
                    page: "DLG_EDIT_HTML",
                    option: "width=710,height=750,left=150,resizable=yes",
                    data: {
                        title: gw_com_api.getValue("frmData_PER", 1, "per_title", false, true),
                        html: gw_com_api.getValue("frmData_PER", 1, "per_doc"),
                        auth: "R"
                    }
                };
                gw_com_api.openWindow(args);
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    switch (param.object) {
        case "grdData_PER_SUPP_D":
            if (param.element == "qty") {
                var value = param.value.current.replace(/,/gi, "") * gw_com_api.getValue(param.object, param.row, "rpt_price", true).replace(/,/gi, "");
                gw_com_api.setValue(param.object, param.row, "rpt_amt", value, true, true);
            } else if (param.element == "rpt_price") {
                var value = param.value.current.replace(/,/gi, "") * gw_com_api.getValue(param.object, param.row, "qty", true).replace(/,/gi, "");
                gw_com_api.setValue(param.object, param.row, "rpt_amt", value, true, true);
            }
            break;
        case "frmOption4":
            if (checkStat() && param.value.current != "") {
                for (var i = 1 ; i <= gw_com_api.getRowCount("grdData_PER_SUPP_D") ; i++) {
                    gw_com_api.selectRow("grdData_PER_SUPP_D", i, true);
                    gw_com_api.setValue("grdData_PER_SUPP_D", i, "dlva_date", param.value.current, true);
                }
            }
            break;
    }

}
//----------
function processKeypress(param) {

    if (param.object == undefined) return;
    
    if (param.element == undefined) {
    } else {
        switch (param.object) {
            case "frmData_PER":
                {
                    switch (param.element) {
                        case "per_telno":
                        case "per_faxno":
                            {
                                if (param.key == 48 || param.key == 49 || param.key == 50 || param.key == 51 || param.key == 52 ||
                                    param.key == 53 || param.key == 54 || param.key == 55 || param.key == 56 || param.key == 57) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                            break;
                    }
                }
                break;
                break;
        }
    }
}
//----------
function processInsert(param) {

    var args;
    var isGrid = true;

    if (param.object == "FILE") {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return;
        var args = {
            type: "PAGE", page: "w_upload_per", title: "파일 업로드",
            width: 650, height: 300, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        type: "PER_SUPP",
                        key: v_global.logic.per_no,
                        seq: v_global.logic.supp_seq,
                        data_subseq: gw_com_api.getValue("grdList_PER", 1, "rpt_seq", true)
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
        return;
    } else {
        return;
    }

    if (isGrid)
        gw_com_module.gridInsert(args);
    else
        gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args;
    var isGrid = true;

    if (param.object == "FILE") {
        if (gw_com_api.getValue("grdData_" + param.object, "selected", "_edit_yn", true) == "0") return;
        args = { targetid: "grdData_" + param.object, row: "selected", select: true };
    } else {
        return;
    }

    if (isGrid)
        gw_com_module.gridDelete(args);
    else
        gw_com_module.formInsert(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_PER_SUPP_D" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        nomessage: param.nomessage
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (!checkStat({ check: true })) return;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption2");
    gw_com_api.hide("frmOption3");

    if (param.message != undefined) {
        gw_com_api.messageBox(param.message);
    }

    if (param != undefined && param.pstat != undefined) {
        var args = {
            url: "COM",
            procedure: "sp_historyPER_SUPP",
            nomessage: true,
            input: [
                { name: "per_no", value: v_global.logic.per_no, type: "varchar" },
                { name: "supp_seq", value: v_global.logic.supp_seq, type: "int" },
                { name: "pstat", value: param.pstat, type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ]
        };
        gw_com_module.callProcedure(args);
    }

    processRetrieve({});

}
//----------
function processRetrieve(param) {

    var args = {
        key: param.key,
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_per_no", value: v_global.logic.per_no },
                { name: "arg_supp_seq", value: v_global.logic.supp_seq }
            ],
        },
        target: [
            { type: "FORM", id: "frmData_PER" },
            { type: "GRID", id: "grdList_PER" },
            { type: "GRID", id: "grdData_PER_SUPP_D" },
            { type: "GRID", id: "grdData_PER_SUPP_D_XLS" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
    /*
    =========== 버튼 표시 상태 ===========
    의뢰(PUB) : 접수
    수신(RCV) : 저장, 제출
    재견적(RCV-R) : 저장, 제출
    제출(PRS) : 취소
    접수(CHK) : N/A
    ======================================
    */
    if (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") {
        //gw_com_api.hide("lyrMenu");
        gw_com_api.hide("frmOption4");
    } else {
        gw_com_api.show("lyrMenu");
        switch (gw_com_api.getValue("grdList_PER", 1, "pstat", true)) {
            case "PUB":     // 의뢰
                {
                    gw_com_api.show("lyrMenu", "접수");
                    gw_com_api.hide("lyrMenu", "저장");
                    gw_com_api.hide("lyrMenu", "제출");
                    gw_com_api.hide("lyrMenu", "취소");
                    gw_com_api.hide("lyrMenu", "포기");
                    gw_com_api.hide("lyrMenu", "취소");
                    gw_com_api.hide("lyrMenu_FILE");
                    gw_com_api.hide("frmOption4");
                }
                break;
            case "RCV":     // 수신
            case "RCV-R":   // 재견적
                {
                    gw_com_api.hide("lyrMenu", "접수");
                    gw_com_api.show("lyrMenu", "저장");
                    gw_com_api.show("lyrMenu", "제출");
                    gw_com_api.hide("lyrMenu", "취소");
                    gw_com_api.show("lyrMenu", "포기");
                    gw_com_api.show("lyrMenu_FILE");
                    gw_com_api.show("frmOption4");
                }
                break;
            case "PRS":     // 제출
            //case "CHK":     // 접수(고객사)
                {
                    gw_com_api.hide("lyrMenu", "접수");
                    gw_com_api.hide("lyrMenu", "저장");
                    gw_com_api.hide("lyrMenu", "제출");
                    gw_com_api.show("lyrMenu", "취소");
                    gw_com_api.hide("lyrMenu", "포기");
                    gw_com_api.hide("lyrMenu_FILE");
                    gw_com_api.hide("frmOption4");
                }
                break;
            default:
                {
                    gw_com_api.hide("lyrMenu", "접수");
                    gw_com_api.hide("lyrMenu", "저장");
                    gw_com_api.hide("lyrMenu", "제출");
                    gw_com_api.hide("lyrMenu", "취소");
                    gw_com_api.hide("lyrMenu", "포기");
                    gw_com_api.hide("lyrMenu_FILE");
                    gw_com_api.hide("frmOption4");
                }
                break;
        }
    }

    if (gw_com_api.getValue("frmData_PER", 1, "per_type") == "BID") {
        gw_com_api.show("lyrMenu_BID");
    } else {
        gw_com_api.hide("lyrMenu_BID");
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
function processExport(param) {

    var rmk1 = "** 참고사항 :  견적 접수 후 단가 및 납기 협의, 납품가능일 표기 바람.\n" +
        "** 결제방법 :  매월 마감 후 익익월 말일 현금 결제\n" +
        "** 납품장소 :  본사";
    var rmk2 = "비고 : " + gw_com_api.getValue("grdList_PER", 1, "per_rmk", true);

    var args = {
        page: "SRM_1012",
        //source: {
        //    type: "INLINE", json: true,
        //    argument: [
        //        { name: "arg_ann_key", value: ann_key },
        //        { name: "arg_app_key", value: app_key } //app_key.replace(/,/gi, "','") }
        //    ]
        //},
        option: [
            { name: "PRINT", value: "xlsx" },
            { name: "PAGE", value: "SRM_1012" },    //
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "FORM", value: "SRM_EstimateRqst" },
            { name: "PER_NO", value: gw_com_api.getValue("grdList_PER", 1, "per_no", true) },
            { name: "ITEM_CNT", value: gw_com_api.getRowCount("grdData_PER_SUPP_D") },
            { name: "PER_DATE", value: gw_com_api.Mask(gw_com_api.getValue("grdList_PER", 1, "per_date", true), "date-ymd") },
            { name: "PER_COMP", value: gw_com_api.getValue("grdList_PER", 1, "per_comp", true) },
            { name: "PER_MAN", value: gw_com_api.getValue("grdList_PER", 1, "per_man", true) },
            { name: "PER_TEL", value: gw_com_api.getValue("grdList_PER", 1, "per_telno", true) },
            { name: "PER_FAX", value: gw_com_api.getValue("grdList_PER", 1, "per_faxno", true) },
            { name: "PER_EMAIL", value: gw_com_api.getValue("grdList_PER", 1, "per_email", true) },
            { name: "SUPP_NM", value: gw_com_api.getValue("grdList_PER", 1, "supp_nm", true) },
            { name: "SUPP_MAN", value: gw_com_api.getValue("grdList_PER", 1, "supp_man", true) },
            { name: "SUPP_TEL", value: gw_com_api.getValue("grdList_PER", 1, "supp_telno", true) },
            { name: "SUPP_FAX", value: gw_com_api.getValue("grdList_PER", 1, "supp_faxno", true) },
            { name: "SUPP_EMAIL", value: gw_com_api.getValue("grdList_PER", 1, "supp_email1", true) },
            { name: "CLOSE_DATE", value: gw_com_api.getValue("grdList_PER", 1, "per_term", true) },
            { name: "RMK1", value: rmk1 },
            { name: "RMK2", value: rmk2 }
        ],
        target: { type: "FILE", id: "lyrDown", name: "견적의뢰서" }
    };
    gw_com_module.objExport(args);

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
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_PER");

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_PER_SUPP_D" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkStat(param) {

    var per_no = gw_com_api.getValue("grdList_PER", 1, "per_no", true);
    var supp_seq = gw_com_api.getValue("grdList_PER", 1, "supp_seq", true);
    var stat = Query.getPSTAT2({ per_no: per_no, supp_seq: supp_seq });

    var rtn = ($.inArray(stat.pstat, ["RCV", "RCV-R"]) == -1 || $.inArray(stat.per_pstat, ["PUB", "PRS"]) == -1 ? false : true);
    if (rtn && stat.pstat == "RCV")
        rtn = stat.dt_yn == "1" ? true : false;

    if (!rtn && param && param.check) {
        var msg = [{ text: "내용을 수정할 수 없습니다." }];
        msg.push({ text: "의뢰상태 [" + stat.per_pstat_nm + "]" + (stat.pstat_nm == "" ? "" : ", 진행상태 [" + stat.pstat_nm + "]") });
        if (stat.dt_yn != "1")
            msg.push({ text: "접수기간 지남." });
        gw_com_api.messageBox(msg);
    }
    return rtn;

}
//----------
function processSave2(param) {

    if (param.column == undefined || param.column.length < 1) return;
    var update = {
        query: param.query == undefined ? "SRM_1012_3" : param.query,
        row: [{
            crud: "U",
            column: [
                { name: "per_no", value: v_global.logic.per_no },
                { name: "supp_seq", value: v_global.logic.supp_seq }
            ]
        }]
    };

    $.each(param.column, function () {
        update.row[0].column.push(this);
    });

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [update],
        nomessage: (param.message != undefined ? true : param.message),
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);
}
//----------
var Query = {
    getPSTAT: function (param) {

        var rtn = "";
        var args = {
            request: "DATA",
            name: "SRM_1022_1",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SRM_1022_1" +
                "&QRY_COLS=pstat" +
                "&CRUD=R" +
                "&arg_per_no=" + param.per_no + "&arg_supp_seq=" + param.supp_seq,
            async: false,
            handler_success: function (type, name, data) {

                rtn = data.DATA[0];

            }
        };
        gw_com_module.callRequest(args);
        return rtn;

    },
    getPSTAT2: function (param) {

        var rtn = {};
        var args = {
            request: "DATA",
            name: "SRM_1021_9",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SRM_1021_9" +
                "&QRY_COLS=pstat,pstat_nm,sysdate,dt_yn,per_pstat,per_pstat_nm" +
                "&CRUD=R" +
                "&arg_per_no=" + param.per_no + "&arg_supp_seq=" + param.supp_seq,
            async: false,
            handler_success: function (type, name, data) {

                rtn = {
                    pstat: data.DATA[0],
                    pstat_nm: data.DATA[1],
                    sysdate: data.DATA[2],
                    dt_yn: data.DATA[3],
                    per_pstat: data.DATA[4],
                    per_pstat_nm: data.DATA[5]
                };

            }
        };
        gw_com_module.callRequest(args);
        return rtn

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
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined) {
                                    param.data.arg.confirm = true;
                                    processButton(param.data.arg);
                                } else
                                    processSave(param.data.arg);
                            } else {
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
                    case "w_upload_per":
                        args.data = {
                            type: "PER_SUPP",
                            key: v_global.logic.per_no,
                            seq: v_global.logic.supp_seq,
                            data_subseq: gw_com_api.getValue("grdList_PER", 1, "rpt_seq", true)
                        };
                        break;
                    case "w_upload_per_excel":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openDialogue;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_upload_per":
                        if (param.data != undefined)
                            processRetrieve({});
                        break;
                    case "w_upload_per_excel":
                        if (param.data != undefined) {
                            processRetrieve({});
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//