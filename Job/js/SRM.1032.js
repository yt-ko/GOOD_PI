//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 견적확정
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
                },
                {
                    type: "PAGE", name: "구매그룹", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM11" }]
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
                processRetrieve({});
            } else {
                gw_com_api.messageBox([{ text: "잘못된 접근입니다." }]);
                processClose({});
            }

            gw_com_api.setValue("frmOption2", 1, "cfm_date", gw_com_api.getDate());

        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", act: true },
                { name: "단가", value: "단가적용", icon: "예" },
                //{ name: "취소", value: "의뢰취소", icon: "아니오", updatable: true },
                { name: "유찰", value: "유찰", icon: "아니오", updatable: true },
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
            targetid: "lyrMenu_PER_SUPP", type: "FREE",
            element: [
                //{ name: "접수", value: "접수", icon: "예", updatable: true },
                //{ name: "접수취소", value: "접수취소", icon: "아니오", updatable: true },
                { name: "통보", value: "업체선정 통보", icon: "기타", updatable: true },
                { name: "재견적", value: "접수취소", icon: "추가", updatable: true },
                { name: "확정", value: "업체선정", icon: "예", updatable: true },
                { name: "확정취소", value: "선정취소", icon: "아니오", updatable: true },
                //{ name: "수정", value: "수정요청", icon: "추가", updatable: true },
                { name: "의뢰취소", value: "의뢰취소", icon: "아니오", updatable: true }
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
            targetid: "frmOption", type: "FREE", title: "취소사유",
            trans: true, border: true, show: false,
            editable: { focus: "cnl_rmk", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cnl_rmk", label: { title: "취소사유 :" },
                                editable: { type: "texts", size: 50, maxlength: 150 } //, validate: { rule: "required" } } //취소사유 필수입력 제거, 170627, by K.W.Y, 성병래B 요청
                            },
                            { name: "cnl_mode", hidden: true },
                            { name: "pstat", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { name: "취소확인", value: "확인", act: true, format: { type: "button", icon: "실행" } },
                            { name: "취소취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE", title: "단가적용",
            trans: true, border: true, show: false,
            editable: { focus: "cfm_date", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cfm_date", label: { title: "단가적용일자 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, validate: { rule: "required" } }
                            },
                            {
                                name: "pur_grp", label: { title: "구매그룹 :" },
                                editable: { type: "select", data: { memory: "구매그룹", unshift: [{ title: "선택", value: "" }] } }
                            },
                            {
                                name: "supp_yn", label: { title: "주거래처 적용 :" },
                                editable: { type: "checkbox", value: "1", offval: "0" }, value: "1"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cfm_rmk", label: { title: "비고 :" },
                                editable: { type: "texts", size: 50, maxlength: 150 }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "단가적용", value: "단가적용", act: true, format: { type: "button", icon: "실행" } },
                            { name: "단가취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption3", type: "FREE", title: "유찰사유",
            trans: true, border: true, show: false,
            editable: { focus: "fal_rmk", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "fal_rmk", label: { title: "유찰사유 :" },
                                editable: { type: "texts", size: 50, maxlength: 150, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "유찰확인", value: "확인", act: true, format: { type: "button", icon: "실행" } },
                            { name: "유찰취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_PER", query: "SRM_1012_1", type: "TABLE", title: "입찰/견적 의뢰서",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 90, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "의뢰번호", format: { type: "label" } },
                            { name: "per_no" },
                            { header: true, value: "접수시작", format: { type: "label" } },
                            {
                                name: "open_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 64 }
                            },
                            {
                                name: "open_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { type: "text", width: 30 }
                            },
                            { header: true, value: "접수마감", format: { type: "label" } },
                            {
                                name: "close_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 64 }
                            },
                            {
                                name: "close_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { type: "text", width: 30 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목(입찰명)", format: { type: "label" } },
                            {
                                name: "per_title", style: { colspan: 3 },
                                format: { type: "text", width: 628 }
                            },
                            { header: true, value: "의뢰일자", format: { type: "label" } },
                            { name: "per_date", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "의뢰구분", format: { type: "label" } },
                            { name: "per_type_nm" },
                            { name: "per_type", hidden: true },
                            { header: true, value: "입찰방법", format: { type: "label" } },
                            { name: "bid_type_nm" },
                            { header: true, value: "구매담당", format: { type: "label" } },
                            { name: "per_man" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "의뢰상태", format: { type: "label" } },
                            { name: "pstat_nm" },
                            { name: "pstat", hidden: true },
                            { header: true, value: "사업기간", format: { type: "label" } },
                            {
                                name: "fr_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 62 }
                            },
                            { value: "~", format: { type: "label" }, style: { colfloat: "floating" } },
                            {
                                name: "to_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 62 }
                            },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            { name: "per_email", format: { type: "text", width: 240 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상태변경일", format: { type: "label" } },
                            { name: "pdate", format: { type: "text", width: 240 } },
                            { header: true, value: "낙찰자선정방식", format: { type: "label" } },
                            { name: "bid_choice", format: { type: "text", width: 240 } },
                            { header: true, value: "TEL", format: { type: "label" } },
                            { name: "per_telno", format: { type: "text", width: 240 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "인도조건", format: { type: "label" } },
                            { name: "dlv_rmk", format: { type: "text", width: 240 } },
                            { header: true, value: "결제방법", format: { type: "label" } },
                            { name: "settle_rmk_nm", format: { type: "text", width: 240 } },
                            { header: true, value: "사업예산", format: { type: "label" } },
                            { name: "bid_budget", format: { type: "text", width: 240 }, mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "per_rmk",
                                format: { type: "textarea", rows: 2, width: 1012, maxlength: 150 }
                            },
                            { name: "per_doc", hidden: true },
                            { name: "per_comp", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PER_ITEM", query: "SRM_1012_2", title: "의뢰 품목",
            caption: true, height: 150, pager: false, show: false, selectable: true, number: true,
            element: [
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "품목사양", name: "item_spec", width: 150 },
                { header: "도면", name: "item_url", width: 60, align: "center", format: { type: "link" }, hidden: true },
                { header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "단위", name: "uom", width: 40, align: "center" },
                { header: "통화", name: "curr_cd", width: 40, align: "center" },
                { header: "납기일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "청구자", name: "pr_man", width: 60, align: "center", hidden: true },
                { header: "Project", name: "proj_no", width: 80, hidden: true },
                { header: "공정코드", name: "prc_cd", width: 60, hidden: true },
                { header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { header: "예상단가", name: "est_price", width: 80, align: "right", mask: "currency-int" },
                { header: "품목비고", name: "item_rmk", width: 250 },
                { name: "per_no", hidden: true },
                { name: "item_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PER_SUPP", query: "SRM_1032_3", title: "의뢰서",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            color: { row: true },
            element: [
                { header: "협력사", name: "supp_nm", width: 100 },
                { header: "진행상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "제출일시", name: "rpt_dt", width: 150, align: "center" },
                { header: "상태변경일", name: "pdate", width: 150, align: "center", hidden: true },
                { header: "평균단가", name: "avg_rpt_price", width: 80, align: "right", mask: "currency-int", hidden: true },
                { header: "총금액", name: "total_rpt_amt", width: 80, align: "right", mask: "currency-int" },
                {
                    header: "전송방법", name: "send_tp", width: 60, align: "center", hidden: true,
                    format: { type: "select", data: { memory: "전송방법" }, width: 76 }
                },
                { header: "수신인", name: "supp_man", width: 80, align: "center" },
                { header: "E-Mail 1", name: "supp_email1", width: 100 },
                { header: "TEL", name: "supp_telno", width: 90 },
                { header: "FAX", name: "supp_faxno", width: 60, hidden: true },
                { header: "협력사비고", name: "rpt_rmk", width: 200 },
                { header: "취소사유", name: "cnl_rmk", width: 200 },
                { name: "per_no", editable: { type: "hidden" }, hidden: true },
                { name: "supp_seq", editable: { type: "hidden" }, hidden: true },
                { name: "rpt_seq", editable: { type: "hidden" }, hidden: true },
                { name: "supp_cd", editable: { type: "hidden" }, hidden: true },
                { name: "pstat", editable: { type: "hidden" }, hidden: true },
                { name: "supp_email2", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PER_SUPP_D", query: "SRM_1032_4", title: "의뢰서 내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "협력사", name: "supp_nm", width: 100 },
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 110 },
                { header: "품목사양", name: "item_spec", width: 150 },
                { header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "단위", name: "uom", width: 50, align: "center" },
                { header: "통화", name: "curr_cd", width: 50, align: "center" },
                { header: "납기일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "납품가능일", name: "dlva_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "표준단가", name: "std_price", width: 80, align: "right", mask: "numeric-int", hidden: true },
                { header: "예상단가", name: "est_price", width: 80, align: "right", mask: "numeric-int", hidden: true },
                { header: "견적단가", name: "rpt_price", width: 80, align: "right", mask: "numeric-int" },
                { header: "견적금액", name: "rpt_amt", width: 80, align: "right", mask: "numeric-int" },
                { header: "제출차수", name: "rpt_seq", width: 60, align: "center", hidden: true },
                { header: "비고", name: "rpt_rmk", width: 150 },
                { header: "청구자", name: "pr_man", width: 60, align: "center", hidden: true },
                { header: "Project", name: "proj_no", width: 80, hidden: true },
                { header: "공정코드", name: "prc_cd", width: 60, hidden: true },
                { header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { name: "per_no", hidden: true },
                { name: "supp_seq", hidden: true },
                { name: "item_seq", hidden: true },
                { name: "rpt_seq", hidden: true },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdData_PER_SUPP_D_data").parents('div.ui-jqgrid-bdiv').css("max-height", "300px");
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "SRM_1032_5", title: "첨부파일",
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
                { type: "GRID", id: "grdData_PER_ITEM", offset: 8 },
                { type: "GRID", id: "grdData_PER_SUPP", offset: 8 },
                { type: "GRID", id: "grdData_PER_SUPP_D", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "단가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "유찰", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_BID", element: "공고문", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_PER_SUPP", element: "통보", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "접수", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "접수취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "재견적", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "확정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "확정취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "의뢰취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "취소확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", element: "단가적용", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "단가취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption3", element: "유찰확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption3", element: "유찰취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_PER_SUPP", grid: true, event: "rowselected", handler: processRetrieve };
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
        case "단가":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (!$("#" + param.object + "_" + param.element).is(":visible")) return;
                var find = Number(gw_com_api.getFindRow("grdData_PER_SUPP", "pstat", "CFM"));
                find += Number(gw_com_api.getFindRow("grdData_PER_SUPP", "pstat", "CFM-R"));
                if (find < 0) {
                    gw_com_api.messageBox([{ text: "선정된 협력사가 없습니다." }]);
                    return;
                }
                gw_com_api.show("frmOption2");
                //processSave({});
            }
            break;
        case "취소":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.getRowCount("grdData_PER_SUPP") < 1) return;
                gw_com_api.setValue("frmOption", 1, "pstat", "CNL");
                gw_com_api.setValue("frmOption", 1, "cnl_rmk", "");
                gw_com_api.setValue("frmOption", 1, "cnl_mode", "ALL");
                gw_com_api.show("frmOption");
                gw_com_api.setFocus("frmOption", 1, "cnl_rmk");
            }
            break;
        case "유찰":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.getRowCount("grdData_PER_SUPP") < 1) return;
                gw_com_api.setValue("frmOption3", 1, "fal_rmk", "");
                gw_com_api.show("frmOption3");
                gw_com_api.setFocus("frmOption3", 1, "fal_rmk");
            }
            break;
        case "유찰확인":
            {
                var args = { target: [{ type: "FORM", id: "frmOption3" }] };
                if (gw_com_module.objValidate(args) == false) return false;
                var fal_rmk = gw_com_api.getValue("frmOption3", 1, "fal_rmk");
                // 유찰메일 발송용
                var body = "다음과 같은 사유로 본 의뢰가 유찰처리 되오니 업무에 참고하시기 바랍니다.<br><br>" +
                    "의뢰번호 : " + v_global.logic.per_no + "<br>" +
                    "유찰일자 : " + gw_com_api.Mask(gw_com_api.getDate(), "date-ymd") + "<br>" +
                    "사&nbsp;&nbsp;&nbsp;&nbsp;유 : " + fal_rmk;

                var row = [{
                    column: [
                        { name: "per_no", value: v_global.logic.per_no },
                        { name: "pstat", value: "FAL" },
                        { name: "fal_rmk", value: fal_rmk }
                    ]
                }];
                var mail = { to: [] };
                var ids = gw_com_api.getRowIDs("grdData_PER_SUPP");
                if (ids.length > 0) {
                    $.each(ids, function () {
                        mail.to.push({
                            name: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_man", true),
                            value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email1", true)
                        });
                        if (gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email2", true) != "") {
                            mail.to.push({
                                name: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_nm", true),
                                value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email2", true)
                            });
                        }
                    });

                    mail.subject = "유찰안내 - 의뢰번호:" + v_global.logic.per_no;
                    mail.body = body;
                }
                processSave1({ query: "SRM_1012_1", row: row, mail: mail });
            }
            break;
        case "유찰취소":
            {

            }
            break;
        case "닫기":
            {
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
            }
        case "접수":
        case "접수취소":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                var per_no = gw_com_api.getValue("grdData_PER_SUPP", "selected", "per_no", true);
                var supp_seq = gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_seq", true);
                var stat = Query.getPSTAT2({ per_no: per_no, supp_seq: supp_seq });
                if (stat.dt_yn != "1") {
                    gw_com_api.messageBox([{ text: "변경할 수 없습니다." }]);
                    return;
                }
                var row = [];
                // 선택된 ROW만 적용
                if (gw_com_api.getSelectedRow("grdData_PER_SUPP") > 0) {
                    row.push({
                        column: [
                            { name: "per_no", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "per_no", true) },
                            { name: "supp_seq", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_seq", true) },
                            { name: "pstat", value: (param.element == "접수" ? "CHK" : "RCV") }
                        ]
                    });
                }
                if (row.length == 0) {
                    gw_com_api.messageBox([{ text: param.element + " 대상 자료가 없습니다." }]);
                    return;
                }
                processSave1({ row: row });
            }
            break;
        case "재견적":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                var per_no = gw_com_api.getValue("grdData_PER_SUPP", "selected", "per_no", true);
                var supp_seq = gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_seq", true);
                var stat = Query.getPSTAT2({ per_no: per_no, supp_seq: supp_seq });
                if (!($.inArray(stat.pstat, ["RCV", "PRS", "CHK"]) >= 0 && stat.per_pstat == "PRS")) {
                    gw_com_api.messageBox([{ text: "변경할 수 없습니다." }]);
                    return;
                }
                gw_com_api.setValue("frmOption", 1, "pstat", "RCV-R");
                gw_com_api.setValue("frmOption", 1, "cnl_rmk", "");
                gw_com_api.setValue("frmOption", 1, "cnl_mode", "");
                gw_com_api.show("frmOption");
                gw_com_api.setFocus("frmOption", 1, "cnl_rmk");
            }
            break;
        case "확정":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.getSelectedRow("grdData_PER_SUPP", false) == null) {
                    gw_com_api.messageBox([{ text: "선택된 내역이 없습니다." }]);
                    return;
                }
                if ($.inArray(gw_com_api.getValue("grdData_PER_SUPP", "selected", "pstat", true), ["CHK", "PRS"]) < 0) {
                    gw_com_api.messageBox([{ text: "선정 대상이 아닙니다." }]);
                    return;
                }
                var selrow = gw_com_api.getSelectedRow("grdData_PER_SUPP", false);
                var row = [];
                var ids = gw_com_api.getRowIDs("grdData_PER_SUPP");
                if (ids.length < 1) return;
                $.each(ids, function () {
                    var pstat = gw_com_api.getValue("grdData_PER_SUPP", this, "pstat", true);
                    if ($.inArray(pstat, ["RCV", "RCV-R", "PRS", "CHK"]) >= 0) {
                        row.push({
                            column: [
                                { name: "per_no", value: gw_com_api.getValue("grdData_PER_SUPP", this, "per_no", true) },
                                { name: "supp_seq", value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_seq", true) },
                                { name: "pstat", value: (selrow == this) ? "CFM" : "CLO" }    // 선택된 업체=선정, 그외=마감
                            ]
                        });
                    }
                });
                if (row.length == 0) {
                    gw_com_api.messageBox([{ text: "선정 대상 자료가 없습니다." }]);
                    return;
                }

                // 확정메일 수신자
                var to = [{ name: gw_com_api.getValue("grdData_PER_SUPP", selrow, "supp_man", true), value: gw_com_api.getValue("grdData_PER_SUPP", selrow, "supp_email1", true) }];

                // 저장
                processSave1({ row: row, param: param, to: to });
            }
            break;
        case "확정취소":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.getSelectedRow("grdData_PER_SUPP") < 1) return;
                if (gw_com_api.getValue("grdData_PER_SUPP", "selected", "pstat", true) != "CFM") {
                    gw_com_api.messageBox([{ text: "선정 취소 대상이 아닙니다." }]);
                    return;
                }
                var ids = gw_com_api.getRowIDs("grdData_PER_SUPP");
                var per_no = gw_com_api.getValue("grdData_PER_SUPP", "selected", "per_no", true);
                var row = [];
                $.each(ids, function () {
                    var pstat = gw_com_api.getValue("grdData_PER_SUPP", this, "pstat", true);
                    if ($.inArray(pstat, ["CLO", "CFM"]) >= 0) {
                        row.push({
                            column: [
                                { name: "per_no", value: per_no },
                                { name: "supp_seq", value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_seq", true) },
                                { name: "pstat", value: "PRS" }
                            ]
                        });
                        // 확정알림메일
                        //mail.to.push({
                        //    name: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_man", true),
                        //    value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email1", true)
                        //});
                        //if (gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email2", true) != "") {
                        //    mail.to.push({
                        //        name: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_nm", true),
                        //        value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email2", true)
                        //    });
                        //}
                    }
                });
                processSave1({ row: row });
                //var column = [
                //    { name: "supp_seq", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_seq", true) },
                //    { name: "pstat", value: "PRS"/*"CHK"*/ }
                //];
                //processSave2({ column: column });
            }
            break;
        case "수정":
            {
                alert('test');
            }
            break;
        case "의뢰취소":
            {
                if (gw_com_api.getSelectedRow("grdData_PER_SUPP") == null) return;
                if (gw_com_api.getValue("grdData_PER_SUPP", "selected", "pstat", true) == "CNL") {
                    gw_com_api.messageBox([{ text: "이미 취소된 내역입니다." }]);
                    return;
                }
                gw_com_api.setValue("frmOption", 1, "pstat", "CNL");
                gw_com_api.setValue("frmOption", 1, "cnl_rmk", "");
                gw_com_api.setValue("frmOption", 1, "cnl_mode", "");
                gw_com_api.show("frmOption");
                gw_com_api.setFocus("frmOption", 1, "cnl_rmk");
            }
            break;
        case "취소확인":
            {
                var args = { target: [{ type: "FORM", id: "frmOption" }] };
                if (gw_com_module.objValidate(args) == false) return false;
                var cnl_rmk = gw_com_api.getValue("frmOption", 1, "cnl_rmk");
                switch (gw_com_api.getValue("frmOption", 1, "pstat")) {
                    case "CNL": // 의뢰취소
                        {
                            // 취소메일 발송용
                            var body = "다음과 같은 사유로 본 입찰/견적의뢰를 취소 하오니 업무에 참고하시기 바랍니다.<br><br>" +
                                "의뢰번호 : " + v_global.logic.per_no + "<br>" +
                                "취소일자 : " + gw_com_api.Mask(gw_com_api.getDate(), "date-ymd") + "<br>" +
                                "사&nbsp;&nbsp;&nbsp;&nbsp;유 : " + cnl_rmk;

                            if (gw_com_api.getValue("frmOption", 1, "cnl_mode") == "ALL") {
                                var row = [];
                                var mail = { to: [] };
                                var ids = gw_com_api.getRowIDs("grdData_PER_SUPP");
                                if (ids.length < 1) return;
                                $.each(ids, function () {
                                    if (gw_com_api.getValue("grdData_PER_SUPP", this, "pstat", true) != "CNL") {
                                        row.push({
                                            column: [
                                                { name: "per_no", value: gw_com_api.getValue("grdData_PER_SUPP", this, "per_no", true) },
                                                { name: "supp_seq", value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_seq", true) },
                                                { name: "pstat", value: "CNL" },
                                                { name: "cnl_rmk", value: cnl_rmk }
                                            ]
                                        });

                                        mail.to.push({
                                            name: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_man", true),
                                            value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email1", true)
                                        });
                                        if (gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email2", true) != "") {
                                            mail.to.push({
                                                name: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_nm", true),
                                                value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email2", true)
                                            });
                                        }
                                    }
                                });
                                if (row.length == 0) {
                                    gw_com_api.messageBox([{ text: "취소 대상 자료가 없습니다." }]);
                                    return;
                                }

                                mail.subject = "견적의뢰 취소안내 - 의뢰번호:" + v_global.logic.per_no;
                                mail.body = body;

                                processSave1({ row: row, mail: mail });
                            } else {
                                var column = [
                                    { name: "supp_seq", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_seq", true) },
                                    { name: "pstat", value: "CNL" },
                                    { name: "cnl_rmk", value: cnl_rmk }
                                ];
                                // 취소메일 발송용
                                var mail = {
                                    to: [{
                                        name: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_man", true),
                                        value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_email1", true)
                                    }],
                                    subject: "견적의뢰 취소안내 - 의뢰번호:" + v_global.logic.per_no,
                                    body: body
                                };
                                if (gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_email2", true) != "") {
                                    mail.to.push({
                                        name: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_nm", true),
                                        value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_email2", true)
                                    });
                                }
                                processSave2({ column: column, mail: mail });
                            }
                        }
                        break;
                    case "RCV-R":   // 재견적
                        {
                            var per_no = gw_com_api.getValue("grdData_PER_SUPP", "selected", "per_no", true);
                            var supp_seq = gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_seq", true);
                            var stat = Query.getPSTAT2({ per_no: per_no, supp_seq: supp_seq });
                            if (!($.inArray(stat.pstat, ["RCV", "PRS", "CHK"]) >= 0 && stat.per_pstat == "PRS")) {
                                gw_com_api.messageBox([{ text: "변경할 수 없습니다." }]);
                                return;
                            }
                            var row = [];
                            if (gw_com_api.getSelectedRow("grdData_PER_SUPP") > 0) {
                                row.push({
                                    column: [
                                        { name: "per_no", value: per_no },
                                        { name: "supp_seq", value: supp_seq },
                                        { name: "pstat", value: "RCV-R" },
                                        { name: "cnl_rmk", value: cnl_rmk }
                                    ]
                                });
                            }
                            if (row.length == 0) {
                                gw_com_api.messageBox([{ text: param.element + " 대상 자료가 없습니다." }]);
                                return;
                            }
                            processSave1({ row: row });
                        }
                        break;
                }
                gw_com_api.setValue("frmOption", 1, "pstat", "");
                gw_com_api.setValue("frmOption", 1, "cnl_mode", "");
                gw_com_api.setValue("frmOption", 1, "cnl_rmk", "");
            }
            break;
        case "취소취소":
            {
                gw_com_api.setValue("frmOption", 1, "pstat", "");
                gw_com_api.setValue("frmOption", 1, "cnl_mode", "");
                gw_com_api.setValue("frmOption", 1, "cnl_rmk", "");
            }
            break;
        case "추가":
            {
                var obj = param.object.replace("lyrMenu_", "");
                processInsert({ object: obj });
            }
            break;
        case "삭제":
            {
                var obj = param.object.replace("lyrMenu_", "");
                processDelete({ object: obj });
            }
            break;
        case "단가적용":
            {
                var args = { target: [{ type: param.type, id: param.object }] };
                if (gw_com_module.objValidate(args) == false) {
                    gw_com_api.show(param.object);
                    return false;
                }
                if (gw_com_api.getValue(param.object, param.row, "pur_grp") == "") {
                    gw_com_api.setError(true, param.object, param.row, "pur_grp");
                    gw_com_api.show(param.object);
                    gw_com_api.messageBox([{ text: "구매그룹을 선택하세요." }]);
                    return false;
                }
                gw_com_api.setError(false, param.object, param.row, "pur_grp");
                processBatch({});
                gw_com_api.hide(param.object);
            }
            break;
        case "단가취소":
            {
                gw_com_api.hide(param.object);
                gw_com_api.setValue(param.object, param.row, "cfm_rmk", "");
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
        case "통보":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                var mail = Query.getCFMMailInfo({ per_no: v_global.logic.per_no });
                if (mail == null) {
                    gw_com_api.messageBox([{ text: "통보 대상이 없습니다." }]);
                    return;
                } else if (Number(mail.rpt_amt) >= 30000000) {
                    gw_com_api.messageBox([{ text: "제출 금액이 3천만원 이상인 건은 통보처리 할 수 없습니다." }], 500);
                    return;
                }
                var args = {
                    url: "COM",
                    subject: mail.subject,
                    body: mail.body,
                    to: [{ name: mail.recipients, value: mail.email }],
                    edit: true
                };
                gw_com_module.sendMail(args);
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
        }
    }
}
//----------
function processInsert(param) {

    var args;
    var isGrid = true;

    if (param.object == "PER") {
        args = {
            targetid: "frmData_PER", edit: true, updatable: true,
            data: [
                { name: "per_comp", value: "(주)원익IPS" },
                { name: "per_man", value: gw_com_module.v_Session.USR_NM },
                { name: "per_date", value: gw_com_api.getDate() },
                { name: "close_date", value: gw_com_api.getDate("", { day: 20 }) },
                { name: "per_email", value: "test@goodware.co.kr" },
                { name: "pstat_nm", value: "작성" },
                { name: "pstat", value: "REG" }
            ]
        };
        isGrid = false;
    } else if (param.object == "PER_ITEM") {
        if (!checkManipulate({})) return;
        args = {
            targetid: "grdData_PER_ITEM", edit: true, updatable: true,
            data: [
                { name: "per_no", value: v_global.logic.per_no },
                { name: "pr_man", value: gw_com_module.v_Session.USR_NM }
            ]
        };
    } else if (param.object == "PER_SUPP") {
        if (!checkManipulate({})) return;
        args = {
            targetid: "grdData_PER_SUPP", edit: true, updatable: true,
            data: [
                { name: "per_no", value: v_global.logic.per_no },
                { name: "send_tp", value: "E-Mail" }
            ]
        };
    } else if (param.object == "FILE") {
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
                        type: "PER",
                        key: v_global.logic.per_no,
                        seq: null
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

    if (param.object == "PER") {
        args = {
            targetid: "frmData_PER", edit: true, updatable: true,
            data: [
                { name: "per_comp", value: "AP시스템(주)" },
                { name: "per_man", value: gw_com_module.v_Session.USR_NM },
                { name: "per_date", value: gw_com_api.getDate() },
                { name: "close_date", value: gw_com_api.getDate("", { day: 20 }) },
                { name: "per_email", value: "test@goodware.co.kr" },
                { name: "pstat", value: "REG" }
            ]
        };
        isGrid = false;
    } else {
        if (param.object == "FILE") {
            if (gw_com_api.getValue("grdData_" + param.object, "selected", "_edit_yn", true) == "0") return;
        }
        args = { targetid: "grdData_" + param.object, row: "selected", select: true };
    }

    if (isGrid)
        gw_com_module.gridDelete(args);
    else
        gw_com_module.formInsert(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_PER" },
            { type: "GRID", id: "grdData_PER_ITEM" },
            { type: "GRID", id: "grdData_PER_SUPP" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };

}
//----------
function successSave(response, param) {

    $.ajaxSetup({ async: false });
    closeOption({});
    processRetrieve(param);

    // 메일발송
    if (param.mail != undefined) {
        var args = {
            url: "COM",
            to: param.mail.to,
            subject: param.mail.subject,
            body: param.mail.body,
            temp_id: param.mail.temp_id,
            html: true,
            edit: true //(param.mail.temp_id == undefined ? false : true)
        };
        gw_com_module.sendMail(args);
    }
    $.ajaxSetup({ async: true });

    // 메일,단가
    if (param.param != undefined && param.param.element == "확정") {
        //// 확정메일   // 업체선정 통보 버튼으로 이관, 성병래B 요청, 180724 by KWY
        //var args = {
        //    url: "COM",
        //    to: param.to,
        //    subject: Query.getHTML({ type: "SRM_PER06", field: "SUBJECT", per_no: v_global.logic.per_no }),
        //    body: Query.getHTML({ type: "SRM_PER06", field: "BODY", per_no: v_global.logic.per_no }),
        //    html: true,
        //    edit: false,
        //    nomessage: true
        //};
        //gw_com_module.sendMail(args);

        //// SMS    // 업체선정 통보 버튼으로 이관, 성병래B 요청, 180724 by KWY
        //var args = {
        //    url: "COM",
        //    procedure: "sp_SMS_PER",
        //    nomessage: true,
        //    input: [
        //        { name: "type", value: "PER_CFM" },
        //        { name: "key_no", value: v_global.logic.per_no, type: "varchar" },
        //        { name: "key_seq", value: "0", type: "varchar" },
        //        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        //    ]
        //};
        //gw_com_module.callProcedure(args);

        processButton({ object: "lyrMenu", element: "단가" });
    }

}
//----------
function processRetrieve(param) {

    if (!param.stat) {
        // 자동 접수처리
        param.batch_tp = "PER_STAT";
        var args = {
            url: "COM",
            procedure: "sp_updatePER_STAT",
            nomessage: true,
            input: [
                { name: "per_no", value: v_global.logic.per_no, type: "varchar" },
                { name: "supp_seq", value: 0, type: "smallint" },
                { name: "act_id", value: "SRM_1032", type: "varchar" },
                { name: "stat", value: "CHK", type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: param
            }
        };
        gw_com_module.callProcedure(args);
    } else {
        var args;
        if (param.object == "grdData_PER_SUPP") {
            args = {
                key: param.key,
                source: {
                    type: "GRID", id: param.object, row: "selected",
                    element: [
                        { name: "per_no", argument: "arg_per_no" },
                        { name: "supp_seq", argument: "arg_supp_seq" }
                    ],
                },
                target: [
                    { type: "GRID", id: "grdData_PER_SUPP_D", select: true }//,
                    //{ type: "GRID", id: "grdData_FILE" }
                ]
            };
        } else {
            args = {
                key: param.key,
                source: {
                    type: "INLINE",
                    argument: [
                        { name: "arg_per_no", value: v_global.logic.per_no }
                    ],
                },
                target: [
                    { type: "FORM", id: "frmData_PER" },
                    { type: "GRID", id: "grdData_PER_ITEM", select: true },
                    { type: "GRID", id: "grdData_PER_SUPP", select: true },
                    { type: "GRID", id: "grdData_FILE", select: true }
                ],
                clear: [
                    { type: "GRID", id: "grdData_PER_SUPP_D" }//,
                    //{ type: "GRID", id: "grdData_FILE" }
                ],
                handler: {
                    complete: processRetrieveEnd,
                    param: param
                }
            };
        }
        gw_com_module.objRetrieve(args);
    }

}
//----------
function processRetrieveEnd(param) {

    if (gw_com_api.getValue("frmData_PER", 1, "per_type") == "BID") {
        gw_com_api.show("lyrMenu_BID");
        //gw_com_api.hide("lyrMenu", "단가");
    } else {
        gw_com_api.hide("lyrMenu_BID");
        //gw_com_api.show("lyrMenu", "단가");
    }

}
//----------
function processFile(param) {

    if (v_global.logic.per_no == undefined || v_global.logic.per_no == "") return;
    var args = {
        type: gw_com_api.getValue(param.object, param.row, "data_tp", true) == "PER" ? "FILEDOWN1" : "FILEDOWN2",
        per_no: v_global.logic.per_no
    };
    if (checkDownload(args)) {
        var args = {
            source: { id: param.object, row: param.row },
            targetid: "lyrDown"
        };
        gw_com_module.downloadFile(args);
    } else {
        gw_com_api.messageBox([{ text: "접수기간 중에는 파일을 다운로드할 수 없습니다." }]);
    }

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
            { type: "FORM", id: "frmData_PER" },
            { type: "GRID", id: "grdData_PER_ITEM" },
            { type: "GRID", id: "grdData_PER_SUPP" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSave1(param) {

    if (param.row == undefined) return;
    $.each(param.row, function () {
        if (this.crud == undefined) this.crud = "U";
    });

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [{
            query: param.query ? param.query : "SRM_1012_3",
            row: param.row
        }],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);
}
//----------
function processSave2(param) {
    var qryZfile = {
        query: "SRM_1012_3",
        row: [{
            crud: "U",
            column: [
                { name: "per_no", value: v_global.logic.per_no }
            ]
        }]
    };

    $.each(param.column, function () {
        qryZfile.row[0].column.push(this);
    });

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [qryZfile],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);
}
//----------
function processBatch(param) {

    // ERP I/F
    var args = {
        url: "COM",
        procedure: "dbo.SP_IF_ReturnPER",
        input: [
            { name: "per_no", value: v_global.logic.per_no, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "act_tp", value: "CONFIRMEDRFQ", type: "varchar" },
            { name: "cfm_date", value: gw_com_api.getValue("frmOption2", 1, "cfm_date") },
            { name: "cfm_rmk", value: gw_com_api.getValue("frmOption2", 1, "cfm_rmk") },
            { name: "pur_grp", value: gw_com_api.getValue("frmOption2", 1, "pur_grp") },
            { name: "supp_yn", value: gw_com_api.getValue("frmOption2", 1, "supp_yn") }
        ],
        handler: {
            success: successBatch,
            param: { batch_tp: "ReturnPER" }
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (param.batch_tp == "ReturnPER") {
        gw_com_api.setValue("frmOption2", 1, "cfm_rmk", "");
        processRetrieve({});
    } else if (param.batch_tp == "PER_STAT") {
        param.stat = true;
        processRetrieve(param);
    }

}
//----------
function checkDownload(param) {

    var rtn = false;
    $.ajax({
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=SRM_1032_8" +
            "&QRY_COLS=file_auth" +
            "&CRUD=R" +
            "&arg_type=" + param.type +
            "&arg_per_no=" + param.per_no +
            "&arg_seq=0",
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
var Query = {
    getHTML: function (param) {
        var rtn = "";
        var args = {
            request: "DATA",
            name: "SRM_1012_7",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SRM_1012_7" +
                "&QRY_COLS=html" +
                "&CRUD=R" +
                "&arg_type=" + param.type + "&arg_field=" + param.field + "&arg_per_no=" + param.per_no,
            async: false,
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(type, name, data) {

            rtn = data.DATA[0];

        }
        //----------
        return rtn
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
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(type, name, data) {

            rtn = {
                pstat: data.DATA[0],
                pstat_nm: data.DATA[1],
                sysdate: data.DATA[2],
                dt_yn: data.DATA[3],
                per_pstat: data.DATA[4],
                per_pstat_nm: data.DATA[5]
            };

        }
        //----------
        return rtn
    },
    getCFMMailInfo: function (param) {

        var rtn = null;
        var args = {
            request: "DATA",
            name: "SRM_1032_MAIL",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SRM_1032_MAIL" +
                "&QRY_COLS=rpt_amt,subject,body,recipients,email" +
                "&CRUD=R" +
                "&arg_per_no=" + param.per_no,
            async: false,
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(type, name, data) {

            if (data.DATA.length > 0) {
                rtn = {
                    rpt_amt: data.DATA[0],
                    subject: data.DATA[1],
                    body: data.DATA[2],
                    recipients: data.DATA[3],
                    email: data.DATA[4]
                };
            }

        }
        //----------
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
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
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
                            type: "PER",
                            key: v_global.logic.per_no,
                            seq: null
                        };
                        break;

                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_upload_per":
                        {
                            if (param.data != undefined)
                                processRetrieve({});
                        }
                        break;
                    case "DLG_EMAIL":
                        {
                            if (param.data != undefined) {
                                var args = {
                                    url: "COM",
                                    procedure: "sp_SMS_PER",
                                    nomessage: true,
                                    input: [
                                        { name: "type", value: "PER_CFM" },
                                        { name: "key_no", value: v_global.logic.per_no, type: "varchar" },
                                        { name: "key_seq", value: "0", type: "varchar" },
                                        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                                    ]
                                };
                                gw_com_module.callProcedure(args);
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//