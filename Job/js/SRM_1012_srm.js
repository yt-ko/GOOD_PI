//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입찰견적의뢰
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
				    type: "PAGE", name: "PER_stat", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SRM101" }]
				},
				{
				    type: "PAGE", name: "SUPP_stat", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SRM102" }]
				},
				{
				    type: "PAGE", name: "SRM103", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SRM103" }]
				},
				{
				    type: "PAGE", name: "SRM104", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SRM104" }]
				},
				{
				    type: "PAGE", name: "SRM105", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SRM105" }]
				},
                {
                    type: "INLINE", name: "전송방법",
                    data: [
                        { title: "SRM", value: "SRM" },
                        { title: "E-Mail", value: "E-Mail" },
                        { title: "Paper", value: "Paper" }
                    ]
                },
				{
				    type: "PAGE", name: "SYS010", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SYS010" }]
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


            if (gw_com_api.getPageParameter("selectkey") != "") {
                v_global.logic.insert = true;
                processNewFromPR({ pr_key: gw_com_api.getPageParameter("selectkey") });
            } else if (gw_com_api.getPageParameter("per_no") != "") {
                v_global.logic.per_no = gw_com_api.getPageParameter("per_no");
                processRetrieve({ updatable: gw_com_api.getPageParameter("updatable") });
            }
            else
                processInsert({ object: "PER" });

        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "새로고침", act: true },
                { name: "저장", value: "저장" },
                { name: "복사", value: "복사추가", icon: "추가", updatable: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_BID", type: "FREE", show: false,
            element: [
				{ name: "편집", value: "입찰공고문", icon: "기타" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_CURR", type: "FREE",
            trans: false, border: true, show: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R" ? false : true), align: "left",
            editable: { focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "curr_cd", label: { title: "통화 :" }, value: "KRW",
                                editable: { type: "select", data: { memory: "SYS010" } }
                            },
			                { name: "실행", value: "적용", act: true, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_PER_ITEM", type: "FREE",
            element: [
			    { name: "엑셀1", value: "엑셀로 저장", icon: "엑셀", updatable: true },
			    { name: "엑셀2", value: "엑셀 불러오기", icon: "엑셀", updatable: true },
				{ name: "추가", value: "품목추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_PER_SUPP", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "전체의뢰", value: "전체의뢰", icon: "예", updatable: true },
                { name: "전체취소", value: "전체취소", icon: "아니오", updatable: true },
                { name: "의뢰", value: "선택의뢰", icon: "예", updatable: true },
                { name: "취소", value: "선택취소", icon: "아니오", updatable: true },
                { name: "출력", value: "출력" }
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
            targetid: "frmData_PER", query: "SRM_1012_1", type: "TABLE", title: "입찰/견적 의뢰서",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "dlv_rmk", validate: true },
            content: {
                width: { label: 80, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "의뢰번호", format: { type: "label" } },
                            { name: "per_no", editable: { type: "hidden" }, align: "center" },
                            { header: true, value: "<font color='red' style='font-weight:bold'>접수시작</font>", format: { type: "label" } },
                            {
                                name: "open_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 64 },
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "접수시작일" } }
                            },
                            {
                                name: "open_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { type: "text", width: 30 },
                                editable: { type: "text", width: 40, validate: { rule: "required", message: "접수시작시간" } }
                            },
                            { header: true, value: "<font color='red' style='font-weight:bold'>접수마감</font>", format: { type: "label" } },
                            {
                                name: "close_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 64 },
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "접수마감일" } }
                            },
                            {
                                name: "close_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { type: "text", width: 30 },
                                editable: { type: "text", width: 40, validate: { rule: "required", message: "접수마감시간" } }
                            },
                            { name: "per_term", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목(입찰명)", format: { type: "label" } },
                            {
                                name: "per_title", style: { colspan: 3 },
                                format: { type: "text", width: 628 },
                                editable: { type: "text", width: 628 }
                            },
                            { header: true, value: "<font color='red' style='font-weight:bold'>의뢰일자</font>", format: { type: "label" } },
                            {
                                name: "per_date", mask: "date-ymd",
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "의뢰일자" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<font color='red' style='font-weight:bold'>의뢰구분</font>", format: { type: "label" } },
                            {
                                name: "per_type", editable: { type: "select", data: { memory: "SRM103" }, validate: { rule: "required", message: "의뢰구분" } },
                                hidden: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? true : false
                            },
                            { name: "per_type_nm", hidden: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true },
                            { header: true, value: "입찰방법", format: { type: "label" } },
                            {
                                name: "bid_type", editable: { type: "select", data: { memory: "SRM104", unshift: [{ title: "-", value: "" }] } },
                                hidden: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? true : false
                            },
                            { name: "bid_type_nm", hidden: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true },
                            { header: true, value: "<font color='red' style='font-weight:bold'>구매담당</font>", format: { type: "label" } },
                            {
                                name: "per_man",
                                editable: { type: "text", width: 240, maxlength: 30, validate: { rule: "required", message: "구매담당" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "의뢰상태", format: { type: "label" } },
                            { name: "pstat_nm" },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "사업기간", format: { type: "label" } },
                            {
                                name: "fr_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 62 },
                                editable: { type: "text", width: 100, validate: { rule: "dateISO", message: "사업기간" } }
                            },
                            { value: "~", format: { type: "label" }, style: { colfloat: "floating" } },
                            {
                                name: "to_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 62 },
                                editable: { type: "text", width: 100, validate: { rule: "dateISO", message: "사업기간" } }
                            },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            { name: "per_email", editable: { type: "text", width: 240, maxlength: 60 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상태변경일", format: { type: "label" } },
                            { name: "pdate", format: { type: "text", width: 240 }, display: true },
                            { header: true, value: "낙찰자선정방식", format: { type: "label" } },
                            { name: "bid_choice", editable: { type: "text", width: 240, maxlength: 50 } },
                            { header: true, value: "TEL", format: { type: "label" } },
                            { name: "per_telno", editable: { type: "text", width: 240, maxlength: 20 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "인도조건", format: { type: "label" } },
                            { name: "dlv_rmk", editable: { type: "text", width: 240, maxlength: 50 } },
                            { header: true, value: "결제방법", format: { type: "label" } },
                            {
                                name: "settle_rmk", editable: { type: "select", data: { memory: "SRM105" } },
                                hidden: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? true : false
                            },
                            { name: "settle_rmk_nm", hidden: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true },
                            { header: true, value: "사업예산", format: { type: "label" } },
                            { name: "bid_budget", editable: { type: "text", width: 240, maxlength: 50 }, mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "per_rmk",
                                format: { type: "textarea", rows: 2, width: 1012, maxlength: 150 },
                                editable: { type: "textarea", rows: 2, width: 1012, maxlength: 150 }
                            },
                            { name: "per_doc", editable: { type: "hidden" }, hidden: true },
                            { name: "per_comp", editable: { type: "hidden" }, hidden: true },
                            { name: "per_faxno", editable: { type: "hidden" }, hidden: true }
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
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true, key: true,
            editable: { bind: "select", focus: "item_rmk", validate: true },
            element: [
				{ header: "품번", name: "item_cd", editable: { type: "hidden" }, width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 150 },
				{ header: "품목사양", name: "item_spec", width: 150 },
                { header: "도면", name: "item_url", width: 60, align: "center", format: { type: "link" }, hidden: true },
				{
				    header: "수량", name: "qty", width: 50, align: "right",
				    editable: { type: "hidden", width: 58, maxlength: 10 }, mask: "numeric-int"
				},
				{ header: "단위", name: "uom", width: 40, editable: { type: "hidden" }, align: "center" },
				{ header: "통화", name: "curr_cd", width: 40, editable: { type: "hidden" }, align: "center" },
                { header: "납기일", name: "dlvr_date", width: 80, editable: { type: "hidden" }, align: "center", mask: "date-ymd" },
				{ header: "청구자", name: "pr_man", width: 60, editable: { type: "hidden" }, align: "center", hidden: true },
				{ header: "Project", name: "proj_no", width: 80, editable: { type: "hidden" }, hidden: true },
				{ header: "공정코드", name: "prc_cd", width: 80, editable: { type: "hidden" }, hidden: true },
				{ header: "청구번호", name: "pr_no", width: 100, editable: { type: "hidden" }, align: "center", hidden: true },
                //{
                //    header: "표준단가", name: "std_price", width: 80, align: "right",
                //    editable: { type: "hidden", width: 94, maxlength: 10 }, mask: "currency-int",
                //    summary: { type: "sum" }, hidden: true
                //},
				//{
				//    header: "예상단가", name: "est_price", width: 80, align: "right",
				//    editable: { type: "text", width: 94, maxlength: 10 }, mask: "currency-int",
				//    summary: { type: "sum" }, hidden: true
				//},
				{
				    header: "품목비고", name: "item_rmk", width: 250,
				    editable: { type: "text", width: 328, maxlength: 100 }
				},
                { name: "per_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                { name: "pr_seq", editable: { type: "hidden" }, hidden: true },
                { name: "sel_key", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdData_PER_ITEM_data").parents('div.ui-jqgrid-bdiv').css("max-height", "300px");
        //=====================================================================================
        var args = {
            targetid: "grdData_PER_ITEM_XLS", query: "SRM_1012_2", title: "의뢰 품목",
            show: false,
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
				{ header: "공정코드", name: "prc_cd", width: 80, hidden: true },
				{ header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { header: "표준단가", name: "std_price", width: 80, align: "right", mask: "currency-int", summary: { type: "sum" }, hidden: true },
				{ header: "예상단가", name: "est_price", width: 80, align: "right", mask: "currency-int", summary: { type: "sum" }, hidden: true },
				{ header: "품목비고", name: "item_rmk", width: 250, },
                { header: "ITEM_SEQ", name: "item_seq" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PER_SUPP", query: "SRM_1012_3", title: "의뢰 협력사",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { bind: "_edit_yn", focus: "supp_man", validate: true },
            element: [
				{
				    header: "협력사", name: "supp_nm", width: 100,
				    editable: { type: "text", width: 134, maxlength: 60 }
				},
				{
				    header: "수신인", name: "supp_man", width: 70,
				    editable: { type: "text", width: 96, maxlength: 40 }
				},
                {
                    header: "E-Mail 1", name: "supp_email1", width: 150,
                    editable: { type: "text", width: 196, maxlength: 60 }
                },
                {
                    header: "TEL", name: "supp_telno", width: 90,
                    editable: { type: "text", width: 122, maxlength: 20 }
                },
                {
                    header: "FAX", name: "supp_faxno", width: 60,
                    editable: { type: "text", width: 68, maxlength: 20 }, hidden: true
                },
                {
                    header: "전송방법", name: "send_tp", width: 60, align: "center",
                    editable: { type: "select", data: { memory: "전송방법" }, width: 80 }
                },
                { header: "진행상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "상태변경일", name: "pdate", width: 150, align: "center", hidden: true },
                {
                    header: "E-Mail 2", name: "supp_email2", width: 150,
                    editable: { type: "text", width: 196, maxlength: 60 }
                },
                {
                    header: "전송비고", name: "send_rmk", width: 180,
                    editable: { type: "text", width: 236, maxlength: 150 }
                },
                { name: "per_no", editable: { type: "hidden" }, hidden: true },
                { name: "supp_seq", editable: { type: "hidden" }, hidden: true },
                { name: "rpt_seq", editable: { type: "hidden" }, hidden: true },
                { name: "supp_cd", editable: { type: "hidden" }, hidden: true },
                { name: "pstat", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "SRM_1012_4", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn", focus: "file_desc", validate: true },
            element: [
                { header: "구분", name: "data_tp_nm", width: 150 },
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text", width: 438, maxlength: 100 } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_BID", element: "편집", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //=====================================================================================
        var args = { targetid: "frmOption_CURR", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_ITEM", element: "엑셀1", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_ITEM", element: "엑셀2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_ITEM", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_ITEM", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "전체의뢰", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "전체취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "의뢰", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PER_SUPP", element: "출력", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
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
        var args = { targetid: "frmData_PER", event: "itemchanged", handler: processItemchanged };
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
function processButton(param) {

    switch (param.element) {
        case "편집":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.getValue("frmData_PER", 1, "per_type") != "BID") {
                    gw_com_api.messageBox([{ text: "의뢰구분이 입찰일 경우에만 입찰공고문을 작성/확인할 수 있습니다." }], 500);
                    return;
                }
                //if (!checkEditable({ check: true })) return;

                var auth = checkEditable({}) ? "U" : "R";
                var html = gw_com_api.getValue("frmData_PER", 1, "per_doc");
                if (html == "" && auth == "U")
                    html = Query.getHTML({ type: "SRM_PER03", field: "BODY", per_no: gw_com_api.getValue("frmData_PER", 1, "per_no") });

                var args = {
                    page: "DLG_EDIT_HTML",
                    option: "width=710,height=750,left=150,resizable=yes",
                    data: {
                        title: gw_com_api.getValue("frmData_PER", 1, "per_title", false, true),
                        html: html,
                        auth: auth
                    }
                };
                gw_com_api.openWindow(args);
            }
            break;
        case "조회":
            {
                v_global.process.handler = processRetrieve;
                if (!checkUpdatable({})) return;
                processRetrieve({});
            }
            break;
        case "저장":
            {
                if (!checkEditable({ check: true })) return;
                processSave({});
            }
            break;
        case "복사":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                processCopy({});
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
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
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
        case "전체의뢰":
        case "전체취소":
        case "의뢰":
        case "취소":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                var stat = param.element.indexOf("의뢰") == -1 ? "" : "PUB";
                var chk_stat = param.element.indexOf("의뢰") == -1 ? ["PUB", "RCV", ""] : [""];    // 의뢰,취소 체크용
                var ids = param.element.indexOf("전체") == -1 ? [gw_com_api.getSelectedRow("grdData_PER_SUPP", false)] : gw_com_api.getRowIDs("grdData_PER_SUPP");
                if (ids == null || ids.length == 0) {
                    gw_com_api.messageBox([{ text: "선택된 내역이 없습니다." }]);
                    return;
                }

                // 입찰공고문 체크
                if (param.element.indexOf("의뢰") >= 0 && gw_com_api.getValue("frmData_PER", 1, "per_type") == "BID" && gw_com_api.getValue("frmData_PER", 1, "per_doc") == "") {
                    gw_com_api.showMessage("입찰공고문을 작성하세요.");
                    processButton({ element: "편집" });
                    return;
                }

                var cnt = 0;
                var to = [];
                var row = [];
                var supp_seq = [];

                $.each(ids, function () {
                    if ($.inArray(gw_com_api.getValue("grdData_PER_SUPP", this, "pstat", true), chk_stat) != -1) {
                        //gw_com_api.setValue("grdData_PER_SUPP", this, "pstat", stat, true);
                        //gw_com_api.setCRUD("grdData_PER_SUPP", this, "modify", true);
                        cnt++;

                        row.push({
                            crud: "U",
                            column: [
                                { name: "per_no", value: gw_com_api.getValue("grdData_PER_SUPP", this, "per_no", true) },
                                { name: "supp_seq", value: gw_com_api.getValue("grdData_PER_SUPP", this, "supp_seq", true) },
                                { name: "pstat", value: stat }
                            ]
                        });

                        // 메일 발송용 정보
                        if ($.inArray(gw_com_api.getValue("grdData_PER_SUPP", this, "send_tp", true), ["E-Mail", "SRM"]) >= 0) {
                            var name1 = gw_com_api.getValue("grdData_PER_SUPP", this, "supp_man", true) == "" ? gw_com_api.getValue("grdData_PER_SUPP", this, "supp_nm", true) : gw_com_api.getValue("grdData_PER_SUPP", this, "supp_man", true);
                            var value1 = gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email1", true);
                            var name2 = gw_com_api.getValue("grdData_PER_SUPP", this, "supp_nm", true);
                            var value2 = gw_com_api.getValue("grdData_PER_SUPP", this, "supp_email2", true);

                            if (value1 != "")
                                to.push({ name: name1, value: value1 });
                            if (value2 != "")
                                to.push({ name: name2, value: value2 });
                        }

                        // SMS
                        supp_seq.push(gw_com_api.getValue("grdData_PER_SUPP", this, "supp_seq", true));
                    }
                });

                if (cnt > 0) {
                    //processSave({ type: "PUB", to: to });
                    var args = {
                        url: "COM",
                        user: gw_com_module.v_Session.USR_ID,
                        param: [{
                            query: "SRM_1012_3",
                            row: row
                        }],
                        handler: {
                            success: successSave,
                            param: { type: "PUB", to: to, temp_id: (stat == "PUB" ? "SRM_PER01" : "SRM_PER02"), supp_seq: supp_seq, stat: stat }
                        }
                    };
                    gw_com_module.objSave(args);
                }
                else {
                    gw_com_api.messageBox([{ text: (stat == "" ? "취소" : "의뢰") + "처리 가능한 대상이 없습니다." }]);
                }
            }
            break;
        case "실행":
            {
                if (!checkEditable({ check: true })) return;
                // 통화적용
                var curr_cd = gw_com_api.getValue(param.object, param.row, "curr_cd");
                var row = gw_com_api.getSelectedRow("grdData_PER_ITEM");
                var ids = gw_com_api.getRowIDs("grdData_PER_ITEM");
                gw_com_api.block("grdData_PER_ITEM");
                $.each(ids, function (i) {
                    gw_com_api.selectRow("grdData_PER_ITEM", this, true);
                    gw_com_api.setValue("grdData_PER_ITEM", this, "curr_cd", curr_cd, true, true, true);
                    if (gw_com_api.getCRUD("grdData_PER_ITEM", this, true) == "none" || gw_com_api.getCRUD("grdData_PER_ITEM", this, true) == "retrieve")
                        gw_com_api.setCRUD("grdData_PER_ITEM", this, "modify", true);
                });
                gw_com_api.unblock("grdData_PER_ITEM");
                if (row > 0)
                    gw_com_api.selectRow("grdData_PER_ITEM", row, true);
            }
            break;
        case "엑셀1":
            {
                if (!checkUpdatable({ check: true })) return;
                gw_com_module.gridDownload({ targetid: "grdData_PER_ITEM_XLS" });
            }
            break;
        case "엑셀2":
            {
                if (!checkUpdatable({ check: true })) return;
                if (!checkEditable({ check: true })) return;
                v_global.logic.popup_data = {
                    user: gw_com_module.v_Session.USR_ID,
                    act_id: "1012",
                    per_no: v_global.logic.per_no
                }
                var args = {
                    type: "PAGE", page: "w_upload_per_excel", title: "의뢰 품목",
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
    }

}
//----------
function processKeypress(param) {

    if (param.object == undefined) return true;
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
    return true;

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_PER") {
        switch (param.element) {
            case "per_type":
                {
                    if (param.value.current == "EST") {
                        gw_com_api.setValue(param.object, param.row, "bid_type", "");
                    }
                    processPerType({ per_type: param.value.current });
                }
                break;
            case "bid_type":
                {
                    if (param.value.current != "") {
                        gw_com_api.setValue(param.object, param.row, "per_type", "BID");
                    }
                }
                break;
            case "per_man":
                {
                    var rtn = Query.getEmpInfo({ emp_nm: param.value.current });
                    gw_com_api.setValue(param.object, param.row, "per_email", rtn.email);
                    gw_com_api.setValue(param.object, param.row, "per_telno", rtn.tel_no);
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
        if (!checkEditable({ check: true })) return;
        var args = {
            type: "PAGE", page: "SRM_1015", title: "의뢰품목 추가",
            width: 1100, height: 550, open: true,
            locate: ["center", "top"],
            id: gw_com_api.v_Stream.msg_openedDialogue
        };
        v_global.logic.search = {
            per_no: v_global.logic.per_no
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
            gw_com_module.dialogueOpen(args);
        }
        return;
    } else if (param.object == "PER_SUPP") {
        if (!checkManipulate({})) return;
        if (!checkEditable({ check: true })) return;
        var args = {
            type: "PAGE", page: "SRM_1013", title: "협력사",
            width: 1000, height: 480, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue
                }
            };
            gw_com_module.dialogueOpen(args);
        }
        return;
    } else if (param.object == "FILE") {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return;
        if (!checkEditable({ check: true })) return;
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
                        key: gw_com_api.getValue("frmData_PER", 1, "per_no"),
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
                { name: "per_comp", value: "(주)원익IPS" },
                { name: "per_man", value: gw_com_module.v_Session.USR_NM },
                { name: "per_date", value: gw_com_api.getDate() },
                { name: "close_date", value: gw_com_api.getDate("", { day: 20 }) },
                { name: "per_email", value: "test@goodware.co.kr" },
                { name: "pstat", value: "REG" }
            ]
        };
        isGrid = false;
    } else {
        if (!checkEditable({ check: true })) return;
        if ($.inArray(param.object, ["PER_SUPP", "FILE"]) != -1) {
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
function processCopy(param) {

    var pstat = gw_com_api.getValue("frmData_PER", 1, "pstat");
    //    if (pstat == "REG" || pstat == "마감" || pstat == "완료") {

    var per_no = gw_com_api.getValue("frmData_PER", 1, "per_no");
    var args = {
        url: "COM",
        procedure: "sp_copyPER",
        nomessage: true,
        input: [
            { name: "old_no", value: per_no, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "new_no", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: { batch_tp: "CopyPER" }
        }
    };
    gw_com_module.callProcedure(args);

    //} else {
    //    gw_com_api.messageBox([{ text: "의뢰상태가 <b>[진행, 마감, 완료]</b>일 경우에만 복사할 수 있습니다." }], 500);
    //}

}
//----------
function successBatch(response, param) {

    if (param.batch_tp == "CopyPER") {
        var idx = $.inArray("new_no", response.NAME);
        if (response.VALUE[idx] == "") {
            gw_com_api.messageBox([{ text: "복사 중 오류가 발생했습니다." }]);
        } else {
            gw_com_api.messageBox([{ text: "정상 처리되었습니다." }]);
            v_global.logic.per_no = response.VALUE[idx];
            processRetrieve({});
        }
    }

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

    // 의뢰구분(per_type)이 입찰(BID)일 경우 필수입력 체크
    if (gw_com_api.getValue("frmData_PER", 1, "per_type") == "BID") {
        // 제목(입찰명)(per_title) 필수
        if (gw_com_api.getValue("frmData_PER", 1, "per_title") == "") {
            gw_com_api.setFocus("frmData_PER");
            gw_com_api.setError(true, "frmData_PER", 1, "per_title");
            gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
            return false;
        }

        // 입찰방법(bid_type) 필수
        if (gw_com_api.getValue("frmData_PER", 1, "bid_type") == "") {
            gw_com_api.setFocus("frmData_PER");
            gw_com_api.setError(true, "frmData_PER", 1, "bid_type");
            gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
            return false;
        }
    }
    gw_com_api.setError(false, "frmData_PER", 1, "per_title");
    gw_com_api.setError(false, "frmData_PER", 1, "bid_type");

    // 품목 체크
    if (gw_com_api.getRowCount("grdData_PER_ITEM") < 1) {
        gw_com_api.messageBox([{ text: "의뢰 품목은 한 개 이상 등록해야 합니다." }]);
        return;
    }

    // 협력사 체크
    if (gw_com_api.getRowCount("grdData_PER_SUPP") < 1) {
        gw_com_api.showMessage("의뢰 협력사는 한 개 이상 등록해야 합니다.");
        processInsert({ object: "PER_SUPP" });
        return;
    }

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    for (var i = 0; i < response.length; i++) {
        if (response[i].QUERY == "SRM_1012_1") {
            v_global.logic.per_no = response[i].KEY[0].VALUE;
            break;
        }
    }
    processRetrieve({});

    // relation 생성(SM_PER_SUPP_D)
    var args = {
        url: "COM",
        procedure: "sp_createPER_SUPP_D",
        nomessage: true,
        input: [
            { name: "per_no", value: v_global.logic.per_no, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: { batch_tp: "CreatePER_SUPP_D" }
        }
    };
    gw_com_module.callProcedure(args);

    if (param != undefined && param.type != undefined) {
        // 메일
        if (param.type == "PUB" && param.to != undefined && param.to.length > 0) {
            var args = {
                url: "COM",
                to: param.to,
                subject: Query.getHTML({ type: param.temp_id, field: "SUBJECT", per_no: v_global.logic.per_no }),
                body: Query.getHTML({ type: param.temp_id, field: "BODY", per_no: v_global.logic.per_no }),
                //temp_id: param.temp_id,
                //html: true,
                edit: true
            };
            gw_com_module.sendMail(args);
        }

        // SMS
        if (param.type == "PUB" && param.supp_seq != undefined && param.supp_seq.length > 0) {
            var args = {
                url: "COM",
                procedure: "sp_SMS_PER",
                nomessage: true,
                input: [
                    { name: "type", value: param.stat == "PUB" ? "PER_PUB" : "PER_PUB_CNL" },
                    { name: "key_no", value: v_global.logic.per_no, type: "varchar" },
                    { name: "key_seq", value: param.supp_seq.join(), type: "varchar" },
                    { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                ],
                handler: {
                    success: successBatch,
                    param: { batch_tp: "SMS_PER" }
                }
            };
            gw_com_module.callProcedure(args);
        }
    }

    // ERP I/F
    if (v_global.logic.insert) {
        //var args = {
        //    url: "COM",
        //    procedure: "dbo.SP_IF_ReturnPER",
        //    nomessage: true,
        //    input: [
        //        { name: "per_no", value: v_global.logic.per_no, type: "varchar" },
        //        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
        //        { name: "act_tp", value: "QUOTATION", type: "varchar" }
        //    ],
        //    handler: {
        //        success: successBatch,
        //        param: { batch_tp: "ReturnPER" }
        //    }
        //};
        //gw_com_module.callProcedure(args);

        v_global.logic.insert = false;
    }
}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "frmData_PER") {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_per_no", value: v_global.logic.per_no }
                ],
            },
            target: [
                { type: "GRID", id: "grdData_PER_ITEM" }, //, select: true },
                { type: "GRID", id: "grdData_PER_ITEM_XLS" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_per_no", value: v_global.logic.per_no }
                ],
            },
            target: [
                { type: "FORM", id: "frmData_PER", edit: param.updatable, updatable: param.updatable },
                { type: "GRID", id: "grdData_PER_ITEM" }, //, select: true },
                { type: "GRID", id: "grdData_PER_ITEM_XLS" },
                { type: "GRID", id: "grdData_PER_SUPP" }, //, select: true },
                { type: "GRID", id: "grdData_FILE" } //, select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    gw_com_api.setFocus("frmData_PER");
    processPerType({});

}
//----------
function processExport(param) {

    if (!checkManipulate({})) return;
    if (gw_com_api.getSelectedRow("grdData_PER_SUPP", false) == null) {
        gw_com_api.messageBox([{ text: "협력사를 선택하세요." }]);
        return;
    }
    if (gw_com_api.getRowCount("grdData_PER_ITEM") < 1) {
        gw_com_api.messageBox([{ text: "의뢰 품목이 없습니다." }]);
        return;
    }

    var rmk1 = "** 참고사항 :  의뢰 접수 후 단가 및 납기 협의, 납품가능일 표기 바람.\n" +
        "** 결제방법 :  매월 마감 후 익익월 말일 현금 결제\n" +
        "** 납품장소 :  본사";
    var rmk2 = "비고 : " + gw_com_api.getValue("frmData_PER", 1, "per_rmk");

    var args = {
        //source: {
        //    type: "INLINE", json: true,
        //    argument: [
        //        { name: "arg_ann_key", value: ann_key },
        //        { name: "arg_app_key", value: app_key } //app_key.replace(/,/gi, "','") }
        //    ]
        //},
        option: [
            { name: "PRINT", value: "xlsx" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "FORM", value: "SRM_EstimateRqst" },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "PER_NO", value: gw_com_api.getValue("frmData_PER", 1, "per_no") },
            { name: "ITEM_CNT", value: gw_com_api.getRowCount("grdData_PER_ITEM") },
            { name: "PER_DATE", value: gw_com_api.Mask(gw_com_api.getValue("frmData_PER", 1, "per_date"), "date-ymd") },
            { name: "PER_COMP", value: gw_com_api.getValue("frmData_PER", 1, "per_comp") },
            { name: "PER_MAN", value: gw_com_api.getValue("frmData_PER", 1, "per_man") },
            { name: "PER_TEL", value: gw_com_api.getValue("frmData_PER", 1, "per_telno") },
            { name: "PER_FAX", value: gw_com_api.getValue("frmData_PER", 1, "per_faxno") },
            { name: "PER_EMAIL", value: gw_com_api.getValue("frmData_PER", 1, "per_email") },
            { name: "SUPP_NM", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_nm", true) },
            { name: "SUPP_MAN", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_man", true) },
            { name: "SUPP_TEL", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_telno", true) },
            { name: "SUPP_FAX", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_faxno", true) },
            { name: "SUPP_EMAIL", value: gw_com_api.getValue("grdData_PER_SUPP", "selected", "supp_email1", true) },
            { name: "CLOSE_DATE", value: gw_com_api.getValue("frmData_PER", 1, "per_term") },
            //{ name: "CLOSE_DATE", value: gw_com_api.Mask(gw_com_api.getValue("frmData_PER", 1, "close_date"), "date-ymd") },
            { name: "RMK1", value: rmk1 },
            { name: "RMK2", value: rmk2 }
        ],
        target: { type: "FILE", id: "lyrDown", name: gw_com_api.getValue("frmData_PER", 1, "per_type_nm", false, true) + "의뢰서" }
    };
    gw_com_module.objExport(args);

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
function checkEditable(param) {

    var editable = false;
    var pstat = gw_com_api.getValue("frmData_PER", 1, "pstat");
    var pstat_nm = gw_com_api.getValue("frmData_PER", 1, "pstat_nm", false, true);
    if ($.inArray(pstat, ["", "REG", "PUB", "PRS"]) >= 0)
        editable = true;

    if (param.check && !editable) {
        gw_com_api.messageBox([{ text: "의뢰 내용을 수정할 수 없습니다." }, { text: "의뢰상태 [" + pstat_nm + "]" }]);
    }

    return editable;

}
//----------
function processNewFromPR(param) {

    setQuery(true);
    processRetrieve2(param);

}
//----------
function setQuery(erp_yn) {

    if (erp_yn) {
        $("#frmData_PER").attr("query", "SRM_1012_8");
        $("#grdData_PER_ITEM_data").attr("query", "SRM_1012_9");
    } else {
        $("#frmData_PER").attr("query", "SRM_1012_1");
        $("#grdData_PER_ITEM_data").attr("query", "SRM_1012_2");
    }

}
//----------
function processRetrieve2(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_pr_key", value: param.pr_key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ],
        },
        target: [
            { type: "FORM", id: "frmData_PER", edit: true },
            { type: "GRID", id: "grdData_PER_ITEM", crud: "insert" },
            { type: "GRID", id: "grdData_PER_ITEM_XLS" }
        ],
        handler: {
            complete: processRetrieveEnd2,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd2(param) {

    setQuery(false);
    gw_com_api.setCRUD("frmData_PER", 1, "create");

}
//----------
function processPerType(param) {

    var per_type = param && param.per_type ? param.per_type : gw_com_api.getValue("frmData_PER", 1, "per_type");
    if (per_type == "BID") {
        gw_com_api.show("lyrMenu_BID");
        gw_com_api.hide("grdData_PER_ITEM", "std_price", true);
        gw_com_api.hide("grdData_PER_ITEM", "est_price", true);
    } else {
        gw_com_api.hide("lyrMenu_BID");
        gw_com_api.show("grdData_PER_ITEM", "std_price", true);
        gw_com_api.show("grdData_PER_ITEM", "est_price", true);
    }

}
//----------
var Query = {
    getHTML: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=SRM_1012_7" +
                    "&QRY_COLS=html" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type + "&arg_field=" + param.field + "&arg_per_no=" + param.per_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    },
    getEmpInfo: function (param) {
        var rtn = {};
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=SRM_1012_Z" +
                    "&QRY_COLS=email,tel_no" +
                    "&CRUD=R" +
                    "&arg_emp_nm=" + encodeURIComponent(param.emp_nm),
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = {
                email: data[0].DATA[0],
                tel_no: data[0].DATA[1]
            };
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
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
                            key: gw_com_api.getValue("frmData_PER", 1, "per_no"),
                            seq: null
                        };
                        break;
                    case "SRM_1013":
                        break;
                    case "SRM_1015":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.logic.search;
                        break;
                    case "w_upload_per_excel":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openDialogue;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_upload_per":
                        if (param.data != undefined)
                            processRetrieve({});
                        break;
                    case "SRM_1013":
                        if (param.data != undefined) {
                            // default
                            var row = new Array();
                            $.each(param.data, function () {
                                var supp_cd = this.supp_cd;
                                this.per_no = v_global.logic.per_no;
                                this.send_tp = "SRM";   //"E-Mail";
                                if (gw_com_api.getFindRow("grdData_PER_SUPP", "supp_cd", supp_cd) < 1) {
                                    var push = true;
                                    $.each(row, function () {
                                        if (this.supp_cd == supp_cd) push = false;
                                    });
                                    if (push) row.push(this);
                                }
                            });

                            if (row.length > 0) {
                                var args = {
                                    targetid: "grdData_PER_SUPP", edit: true, updatable: true,
                                    data: row
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                    case "SRM_1015":
                        if (param.data != undefined) {
                            processRetrieve({ object: "frmData_PER" });
                        }
                        break;
                    case "w_upload_per_excel":
                        if (param.data != undefined) {
                            processRetrieve({ object: "frmData_PER" });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_processedDialogue:
            {
                switch (param.from.page) {
                    case "SRM_1013":
                        if (param.data != undefined) {
                            // default
                            var row = new Array();
                            $.each(param.data, function () {
                                var supp_cd = this.supp_cd;
                                this.per_no = v_global.logic.per_no;
                                this.send_tp = "SRM";   //"E-Mail";
                                if (gw_com_api.getFindRow("grdData_PER_SUPP", "supp_cd", supp_cd) < 1) {
                                    var push = true;
                                    $.each(row, function () {
                                        if (this.supp_cd == supp_cd) push = false;
                                    });
                                    if (push) row.push(this);
                                }
                            });

                            if (row.length > 0) {
                                var args = {
                                    targetid: "grdData_PER_SUPP", edit: true, updatable: true,
                                    data: row
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    // 자동 저장
                    var args = {
                        url: "COM",
                        user: gw_com_module.v_Session.USR_ID,
                        param: [{
                            query: "SRM_1012_1",
                            row: [{
                                crud: "U",
                                column: [
                                    { name: "per_no", value: v_global.logic.per_no },
                                    { name: "per_doc", value: param.data.html }
                                ]
                            }]
                        }],
                        handler: {
                            success: successSave,
                            param: param
                        }
                    };
                    gw_com_module.objSave(args);

                    //gw_com_api.setValue("frmData_PER", 1, "per_doc", param.data.html);
                    //if (gw_com_api.getCRUD("frmData_PER") == "retrieve")
                    //    gw_com_api.setUpdatable("frmData_PER");
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//