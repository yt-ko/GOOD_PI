//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입찰견적관리
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

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "per_man", gw_com_module.v_Session.USER_TP == "SYS" ? "" : gw_com_module.v_Session.USR_NM);
            gw_com_api.setValue("frmOption3", 1, "cfm_date", gw_com_api.getDate());
            //----------
            gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회2", value: "새로고침", icon: "조회" },
				{ name: "조회", value: "조회", act: true },
                { name: "추가", value: "등록", icon: "추가" },
                { name: "수정", value: "수정", icon: "추가" },
                { name: "복사", value: "재진행", icon: "추가" },
                { name: "확정", value: "업체선정", icon: "예" },
                { name: "확정2", value: "최저가업체선정", icon: "예" },
                //{ name: "출력", value: "출력" },
                { name: "로그", value: "기록보기", icon: "조회" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "supp_nm", label: { title: "협력사 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "ymd_fr", label: { title: "의뢰일자 :" }, mask: "date-ymd",
                                style: { colfloat: "floating" },
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
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "item_cd", label: { title: "품번 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "pr_no", label: { title: "구매요청번호 :" },
                                editable: { type: "text", size: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "per_man", label: { title: "구매담당 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "per_no", label: { title: "의뢰번호 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            }
				        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button"} },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기"} }
				        ], align: "right"
                    }
			    ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE",
            trans: true, border: true, show: false, margin: 260,
            content: {
                row: [
                    {
                        element: [
			                { name: "등록1", value: "품목선택", act: true, format: { type: "button", icon: "추가" } },
			                { name: "등록2", value: "엑셀등록", format: { type: "button", icon: "엑셀" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption3", type: "FREE", title: "단가적용",
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
                            },
                            { name: "per_no", hidden: true }
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
            targetid: "grdList_1_1", query: "SRM_1011_1", title: "의뢰 현황 (협력사)",
            caption: false, height: "100%", show: true, selectable: true, number: true, key: true, dynamic: true,
            element: [
				{ header: "의뢰번호", name: "per_no", width: 70, align: "center" },
				{ header: "의뢰일자", name: "per_date", width: 60, align: "center", mask: "date-ymd" },
				{ header: "구매담당", name: "per_man", width: 100, align: "center" },
                { header: "구분", name: "per_type_nm2", width: 50, align: "center" },
                { header: "구분", name: "per_type_nm", width: 50, align: "center", hidden: true },
                { header: "입찰방법", name: "bid_type_nm", width: 50, align: "center", hidden: true },
				{ header: "접수마감일", name: "close_date", width: 60, align: "center", mask: "date-ymd", hidden: true },
				{ header: "접수기간", name: "per_term", width: 160, align: "center" },
				{ header: "의뢰상태", name: "pstat_nm", width: 40, align: "center" },
				{ header: "협력사", name: "supp_nm", width: 100 },
				{ header: "수신인", name: "supp_man", width: 60, align: "center" },
				{ header: "진행상태", name: "supp_pstat_nm", width: 40, align: "center" },
				{ header: "상태변경일", name: "supp_pdate", width: 110, align: "center", hidden: true },
				{ header: "전송방법", name: "send_tp", width: 50, align: "center", hidden: true },
				//{ header: "회신기한일", name: "limit_date", width: 50, align: "center", mask: "date-ymd" },
				{ header: "총금액", name: "est_amt", width: 60, align: "right", mask: "currency-int" }, //견적단가 * 수량
                { name: "supp_seq", hidden: true },
                { name: "supp_cd", hidden: true },
                { name: "per_type", hidden: true },
                { name: "bid_type", hidden: true },
                { name: "pstat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_1_1_data").parents('div.ui-jqgrid-bdiv').css("min-height", "150px");
        $("#grdList_1_1_data").parents('div.ui-jqgrid-bdiv').css("max-height", "200px");
        //=====================================================================================
        var args = {
            targetid: "grdList_1_2", query: "SRM_1011_2", title: "의뢰 품목",
            caption: false, height: "100%", show: true, selectable: true, number: true, key: true, dynamic: true,
            element: [
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 150 },
                { header: "품목사양", name: "item_spec", width: 150 },
                { header: "수량", name: "qty", width: 40, align: "right", mask: "numeric-int" },
                { header: "단위", name: "uom", width: 40, align: "center" },
                { header: "통화", name: "curr_cd", width: 40, align: "center" },
                { header: "납기일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "배포번호", name: "dwg_dist_no", width: 70, align: "center", format: { type: "link" } },
                { header: "청구자", name: "pr_man", width: 60, align: "center", hidden: true },
                { header: "Project No.", name: "proj_no", width: 80, hidden: true },
                { header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { header: "예상단가", name: "est_price", width: 80, align: "right", mask: "currency-int", hidden: true },
                { header: "견적단가", name: "rpt_price", width: 80, align: "right", mask: "currency-int" },
                { header: "최저단가", name: "min_rpt_price", width: 80, align: "right", mask: "currency-int" },
                { header: "최고단가", name: "max_rpt_price", width: 80, align: "right", mask: "currency-int" },
                { name: "per_no", hidden: true },
                { name: "supp_seq", hidden: true },
                { name: "item_seq", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_1_2_data").parents('div.ui-jqgrid-bdiv').css("min-height", "200px");
        $("#grdList_1_2_data").parents('div.ui-jqgrid-bdiv').css("max-height", "300px");
        //=====================================================================================
        var args = {
            targetid: "grdList_1_3", query: "SRM_1011_3", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: false, number: true, selectable: true, key: true,
            element: [
                { header: "구분", name: "data_tp_nm", width: 150 },
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300, editable: { type: "text" } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_1_3_data").parents('div.ui-jqgrid-bdiv').css("max-height", "100px");
        //=====================================================================================
        var args = {
            targetid: "grdList_2_1", query: "SRM_1011_4", title: "의뢰 품목현황",
            caption: true, height: "100%", show: true, number: true, selectable: true, key: true, dynamic: true,
            element: [
				{ header: "의뢰번호", name: "per_no", width: 80, align: "center" },
				{ header: "의뢰일자", name: "per_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 100 },
                { header: "품목사양", name: "item_spec", width: 100 },
                { header: "수량", name: "qty", width: 40, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "uom", width: 40, align: "center" },
				{ header: "통화", name: "curr_cd", width: 40, align: "center" },
				{ header: "납기일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "배포번호", name: "dwg_dist_no", width: 70, align: "center", format: { type: "link" } },
				{ header: "청구자", name: "pr_man", width: 50, align: "center", hidden: true },
				{ header: "Project No.", name: "proj_no", width: 80, hidden: true },
				{ header: "공정코드", name: "prc_cd", width: 80, hidden: true },
				{ header: "청구번호", name: "pr_no", width: 100, hidden: true },
				{ header: "의뢰상태", name: "pstat_nm", width: 40, align: "center" },
				{ header: "예상단가", name: "est_price", width: 80, align: "right", mask: "currency-int", hidden: true },
				{ header: "평균단가", name: "avg_rpt_price", width: 80, align: "right", mask: "currency-int", hidden: true },
				{ header: "확정단가", name: "final_rpt_price", width: 80, align: "right", mask: "currency-int" },
				{ header: "확정협력사", name: "final_rpt_supp_nm", width: 100 },
				{ header: "최저단가", name: "min_rpt_price", width: 80, align: "right", mask: "currency-int" },
				{ header: "최저협력사", name: "min_rpt_supp_nm", width: 100 },
				{ header: "최고단가", name: "max_rpt_price", width: 80, align: "right", mask: "currency-int" },
				{ header: "최고협력사", name: "max_rpt_supp_nm", width: 100 },
                { name: "item_seq", hidden: true },
                { name: "pstat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_2_1_data").parents('div.ui-jqgrid-bdiv').css("max-height", "350px");
        //=====================================================================================
        var args = {
            targetid: "grdList_2_2", query: "SRM_1011_5", title: "입찰/견적 제출 내역",
            caption: true, height: "100%", show: true, number: true, selectable: true, key: true, dynamic: true,
            element: [
				{ header: "협력사", name: "supp_nm", width: 150 },
				{ header: "진행상태", name: "pstat_nm", width: 60, align: "center" },
                { header: "품명", name: "item_nm", width: 100, hidden: true },
                { header: "수량", name: "qty", width: 80, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "uom", width: 50, align: "center" },
				{ header: "납품가능일", name: "dlva_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "표준단가", name: "std_price", width: 80, align: "right", mask: "currency-int", hidden: true },
				{ header: "통화", name: "curr_cd", width: 50, align: "center" },
				{ header: "견적단가", name: "rpt_price", width: 80, align: "right", mask: "currency-int" },
				{ header: "견적금액", name: "rpt_amt", width: 80, align: "right", mask: "currency-int" },
				{ header: "품목비고", name: "rpt_rmk", width: 200 },
                { name: "per_no", hidden: true },
                { name: "supp_seq", hidden: true },
                { name: "pstat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_2_2_data").parents('div.ui-jqgrid-bdiv').css("max-height", "150px");
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_1_1", offset: 8 },
				{ type: "GRID", id: "grdList_1_2", offset: 8 },
				{ type: "GRID", id: "grdList_1_3", offset: 8 },
				{ type: "GRID", id: "grdList_2_1", offset: 8 },
                { type: "GRID", id: "grdList_2_2", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "협력사별" },
                { type: "LAYER", id: "lyrTab_2", title: "품목별" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [{ type: "TAB", id: "lyrTab", offset: 8 }]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확정2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "로그", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", element: "등록1", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "등록2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption3", element: "단가적용", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption3", element: "단가취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_1_1", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_2_1", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_1_3", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdList_1_2", grid: true, element: "dwg_dist_no", event: "click", handler: processDwgDist };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "lyrTab", event: "tabsselect", handler: processTabChange };
        //gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    closeOption(param);
    switch (param.element) {
        case "조회2":
            {
                var obj = ($("#lyrTab").tabs("option", "selected") == 0 ? "grdList_1_1" : "grdList_2_1");
                var query = $("#" + obj + "_data").attr("query");
                var keys = [
                     { NAME: "per_no", VALUE: gw_com_api.getValue(obj, "selected", "per_no", true) },
                     { NAME: obj == "grdList_1_1" ? "supp_cd" : "item_seq", VALUE: gw_com_api.getValue(obj, "selected", (obj == "grdList_1_1" ? "supp_cd" : "item_seq"), true) }
                ];

                var val = gw_com_api.getValue(obj, "selected", "per_no", true);
                var key = [{
                    QUERY: query,
                    KEY: keys
                }];
                processRetrieve({ key: key });
            }
            break;
        case "등록1":
            {
                var args = {
                    type: "PAGE", page: "SRM_1015", title: "입찰/견적의뢰 등록",
                    width: 1100, height: 550, open: true,
                    locate: ["center", "top"],
                    id: gw_com_api.v_Stream.msg_openedDialogue
                };
                v_global.logic.search = {
                    ymd_fr: gw_com_api.getValue("frmOption", 1, "ymd_fr"),
                    ymd_to: gw_com_api.getValue("frmOption", 1, "ymd_to")
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "등록2":
            {
                v_global.logic.popup_data = {
                    user: gw_com_module.v_Session.USR_ID,
                    act_id: "1011"
                }
                var args = {
                    type: "PAGE", page: "w_upload_per_excel", title: "입찰/견적의뢰 등록(엑셀)",
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
        case "복사":
            {
                var obj_nm = ($("#lyrTab").tabs("option", "selected") == 0 ? "grdList_1_1" : "grdList_2_1");
                var row = gw_com_api.getSelectedRow(obj_nm, false);
                if (row > 0) {
                    var per_no = gw_com_api.getValue(obj_nm, row, "per_no", true);
                    var pstat = Query.getPSTAT({ per_no: per_no }).pstat;
                    if ($.inArray(pstat, ["CFM", "CFM-R"]) >= 0) {
                        gw_com_api.messageBox([{ text: "선정, 낙찰된 내역은 취소 후 다시 진행할 수 없습니다." }]);
                        return;
                    }
                    var args = { batch: "COPY", per_no: per_no };
                    gw_com_api.messageBox([{ text: "기존 의뢰 내역은 취소처리 됩니다." }, { text: "새로운 의뢰번호로 다시 진행하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
                } else {
                    gw_com_api.messageBox([{ text: "NOMASTER" }]);
                }
            }
            break;
        case "수정":
        case "확정":
        case "로그":
            {
                processDetailView(param);
                //var obj_nm = ($("#lyrTab").tabs("option", "selected") == 0 ? "grdList_1_1" : "grdList_2_1");
                //if (gw_com_api.getSelectedRow(obj_nm, false) == null) {
                //    gw_com_api.messageBox([{ text: "NOMASTER" }]);
                //    return;
                //}
                //var per_no = gw_com_api.getValue(obj_nm, "selected", "per_no", true);
                //var pstat = Query.getPSTAT({ per_no: per_no }).pstat;
                //var page = param.element == "수정" ? "SRM_1012" : param.element == "확정" ? "SRM_1032" : "SRM_1090";
                //var title = param.element == "수정" ? "입찰/견적의뢰" : param.element == "확정" ? "입찰/견적선정" : "입찰/견적기록";
                //var auth = param.element == "수정" ? ($.inArray(pstat, ["", "REG", "PUB", "PRS"]) >= 0 ? "U" : "R") : ($.inArray(pstat, ["", "PUB", "PRS", "CFM"]) >= 0 ? "U" : "R");
                //var args = {
                //    ID: gw_com_api.v_Stream.msg_linkPage,
                //    to: {
                //        type: "MAIN"
                //    },
                //    data: {
                //        page: page,
                //        title: title,
                //        param: [
                //            { name: "AUTH", value: auth },
                //            { name: "per_no", value: per_no }
                //        ]
                //    }
                //};
                //gw_com_module.streamInterface(args);
            }
            break;
        case "확정2":
            {
                var obj_nm = ($("#lyrTab").tabs("option", "selected") == 0 ? "grdList_1_1" : "grdList_2_1");
                var row = gw_com_api.getSelectedRow(obj_nm, false);
                if (row > 0) {
                    var per_no = gw_com_api.getValue(obj_nm, row, "per_no", true);
                    var pstat = Query.getPSTAT({ per_no: per_no }).pstat;
                    if ($.inArray(pstat, ["CFM", "CFM-R"]) >= 0) {
                        gw_com_api.messageBox([{ text: "이미 선정, 낙찰된 내역입니다." }]);
                        return;
                    }
                    if ($.inArray(pstat, ["PRS"]) == -1) {
                        gw_com_api.messageBox([{ text: "업체선정 불가능한 상태입니다." }]);
                        return;
                    }
                    var args = { batch: "CFM", per_no: per_no };
                    gw_com_api.messageBox([{ text: "최저가 제출 업체가 선정처리 됩니다." }, { text: "계속하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
                } else {
                    gw_com_api.messageBox([{ text: "NOMASTER" }]);
                }
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
                processBatch({ batch: "ReturnPER" });
                gw_com_api.hide(param.object);
            }
            break;
        case "단가취소":
            {
                gw_com_api.hide(param.object);
                gw_com_api.setValue(param.object, param.row, "cfm_rmk", "");
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
    }

}
//----------
function processTabChange(param) {
    

}
//----------
function viewOption(param) {
    var args = {
        target: [{ id: param.element == "조회" ? "frmOption" : "frmOption2", focus: true }]
    };
    gw_com_module.objToggle(args);
    gw_com_api.hide(param.element == "조회" ? "frmOption2" : "frmOption");
    gw_com_api.hide("frmOption3");
}
//----------
function processItemchanged(param) {
    switch (param.object) {
        case "frmOption":
            if (param.element == "ymd_use") {
                if (param.value.current == "1") {
                    gw_com_api.setAttribute("frmOption", 1, "ymd_fr", "disabled", false);
                    gw_com_api.setAttribute("frmOption", 1, "ymd_to", "disabled", false);
                } else {
                    gw_com_api.setAttribute("frmOption", 1, "ymd_fr", "disabled", true);
                    gw_com_api.setAttribute("frmOption", 1, "ymd_to", "disabled", true);
                }
            }
            break;
    }
}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_1_1") {
        processPerType({});
        args = {
            source: {
                type: "GRID", id: "grdList_1_1", row: "selected",
                element: [
                    { name: "per_no", argument: "arg_per_no" },
                    { name: "supp_seq", argument: "arg_supp_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_1_2", select: true },
                { type: "GRID", id: "grdList_1_3", select: true }
            ]
        };

    } else if (param.object == "grdList_2_1") {
        args = {
            source: {
                type: "GRID", id: "grdList_2_1", row: "selected",
                element: [
                    { name: "per_no", argument: "arg_per_no" },
                    { name: "item_seq", argument: "arg_item_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_2_2", select: true }
            ]
        };

    } else {
        // Validate Inupt Options
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        // Retrieve
        args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "per_no", argument: "arg_per_no" },
                    { name: "supp_nm", argument: "arg_supp_nm" },
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "pr_no", argument: "arg_pr_no" },
                    { name: "per_man", argument: "arg_per_man" }
                ],
                remark: [
                    { element: [{ name: "supp_nm" }] },
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "proj_no" }] },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "pr_no" }] },
                    { element: [{ name: "per_man" }] },
                    { element: [{ name: "per_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_1_1", select: true },
                { type: "GRID", id: "grdList_2_1", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_1_2" },
                { type: "GRID", id: "grdList_1_3" },
                { type: "GRID", id: "grdList_2_2" }
            ]
        };

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processDetailView(param) {

    var per_no = param && param.per_no ? param.per_no : "";
    if (per_no == "") {
        var obj_nm = ($("#lyrTab").tabs("option", "selected") == 0 ? "grdList_1_1" : "grdList_2_1");
        if (gw_com_api.getSelectedRow(obj_nm, false) == null) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }
        per_no = gw_com_api.getValue(obj_nm, "selected", "per_no", true);
    }
    var pstat = Query.getPSTAT({ per_no: per_no }).pstat;
    var page = param.element == "수정" ? "SRM_1012" : param.element == "확정" ? "SRM_1032" : "SRM_1090";
    var title = param.element == "수정" ? "입찰/견적의뢰" : param.element == "확정" ? "입찰/견적선정" : "입찰/견적기록";
    var auth = param.element == "수정" ? ($.inArray(pstat, ["", "REG", "PUB", "PRS"]) >= 0 ? "U" : "R") : ($.inArray(pstat, ["", "PUB", "PRS", "CFM"]) >= 0 ? "U" : "R");
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
            type: "MAIN"
        },
        data: {
            page: page,
            title: title,
            param: [
                { name: "AUTH", value: auth },
                { name: "per_no", value: per_no }
            ]
        }
    };
    gw_com_module.streamInterface(args);

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
function processDwgDist(param) {

    v_global.logic.search = {
        dist_no: gw_com_api.getValue(param.object, param.row, param.element, true), mode: "view"
    };
    var args = {
        type: "PAGE", page: "SRM_BID_DwgDist_View", title: "도면배포 정보",
        width: 1100, height: 550, open: true,
        locate: ["center", "top"],
        id: gw_com_api.v_Stream.msg_openedDialogue,
        param: { ID: gw_com_api.v_Stream.msg_openedDialogue, data: v_global.logic.search }
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption2");
    if (param.object != "frmOption3")
        gw_com_api.hide("frmOption3");

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
function processPerType(param) {

    var per_type = param && param.per_type ? param.per_type : gw_com_api.getValue("grdList_1_1", "selected", "per_type", true);
    //if (per_type == "BID") {
    //    gw_com_api.hide("grdList_1_2", "std_price", true);
    //    gw_com_api.hide("grdList_1_2", "est_price", true);
    //} else {
    //    gw_com_api.show("grdList_1_2", "std_price", true);
    //    gw_com_api.show("grdList_1_2", "est_price", true);
    //}

}
//----------
function processBatch(param) {

    if (param.batch == "COPY")
        processCopy(param);
    else if (param.batch == "CFM") {
        var args = {
            url: "COM",
            procedure: "sp_updatePER_STAT",
            input: [
                { name: "per_no", value: param.per_no, type: "varchar" },
                { name: "supp_seq", value: 0, type: "smallint" },
                { name: "act_id", value: "SRM_1011", type: "varchar" },
                { name: "stat", value: "CFM", type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: param
            }
        };
        gw_com_module.callProcedure(args);
    } else if (param.batch == "ReturnPER") {
        // ERP I/F
        var args = {
            url: "COM",
            procedure: "dbo.SP_IF_ReturnPER",
            input: [
                { name: "per_no", value: gw_com_api.getValue("frmOption3", 1, "per_no"), type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                { name: "act_tp", value: "CONFIRMEDRFQ", type: "varchar" },
                { name: "cfm_date", value: gw_com_api.getValue("frmOption3", 1, "cfm_date") },
                { name: "cfm_rmk", value: gw_com_api.getValue("frmOption3", 1, "cfm_rmk") },
                { name: "pur_grp", value: gw_com_api.getValue("frmOption3", 1, "pur_grp") },
                { name: "supp_yn", value: gw_com_api.getValue("frmOption3", 1, "supp_yn") }
            ],
            handler: {
                success: successBatch,
                param: param
            }
        };
        gw_com_module.callProcedure(args);
    }

}
//----------
function successBatch(response, param) {

    if (param.batch == "CFM") {
        var obj = ($("#lyrTab").tabs("option", "selected") == 0 ? "grdList_1_1" : "grdList_2_1")
        var key = [{
            QUERY: $("#" + obj + "_data").attr("query"),
            KEY: [{ NAME: "per_no", VALUE: param.per_no }]
        }];
        processRetrieve({ key: key });

        // 단가
        gw_com_api.setValue("frmOption3", 1, "per_no", param.per_no);
        gw_com_api.show("frmOption3");
    } else if (param.batch == "ReturnPER") {
        gw_com_api.setValue("frmOption3", 1, "per_no", "");
        gw_com_api.setValue("frmOption3", 1, "cfm_rmk", "");
    }

}
//----------
function processCopy(param) {

    var args = {
        url: "COM",
        procedure: "sp_copyPER",
        nomessage: true,
        input: [
            { name: "old_no", value: param.per_no, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "new_no", type: "varchar" }
        ],
        handler: {
            success: successCopy,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

    //} else {
    //    gw_com_api.messageBox([{ text: "의뢰상태가 <b>[진행, 마감, 완료]</b>일 경우에만 복사할 수 있습니다." }], 500);
    //}

}
//----------
function successCopy(response, param) {

    var idx = $.inArray("new_no", response.NAME);
    if (response.VALUE[idx] == "") {
        gw_com_api.messageBox([{ text: "복사 중 오류가 발생했습니다." }]);
    } else {
        gw_com_api.showMessage("", "success");
        var per_no = response.VALUE[idx];
        processDetailView({ per_no: per_no, element: "수정" });
        processRetrieve({});
    }
}
//----------
var Query = {
    getPSTAT: function (param) {
        var rtn = {};
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=SRM_1012_1" +
                    "&QRY_COLS=pstat" +
                    "&CRUD=R" +
                    "&arg_per_no=" + param.per_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = {
                pstat: data[0].DATA[0]
            };
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
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
                            if (param.data.result == "YES") processSave(param.data.arg);
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processDelete({});
                                else if (status == "update") processRestore({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") processBatch(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove(param.data.arg);
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "SRM_1015", "SRM_BID_DwgDist_View":
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
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "SRM_1015":
                    case "w_upload_per_excel":
                        if (param.data != undefined) {
                            var per_no = param.data.per_no;
                            gw_com_api.setValue("frmOption", 1, "per_no", per_no);
                            processRetrieve({});
                            gw_com_api.selectTab("lyrTab", 2);
                            var args = {
                                ID: gw_com_api.v_Stream.msg_linkPage,
                                to: {
                                    type: "MAIN"
                                },
                                data: {
                                    page: "SRM_1012",
                                    title: "견적의뢰",
                                    param: [
                                        { name: "per_no", value: per_no },
                                        { name: "updatable", value: true }
                                    ]
                                }
                            };
                            gw_com_module.streamInterface(args);
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//