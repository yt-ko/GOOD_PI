//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 품질지수 : VOC 상세 정보
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    ready: function () {

        // initialize page.
        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        v_global.logic.chart_subtype = "DetailTrend";
        var args = { request: [
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "IEHM06" } ]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
				{ type: "INLINE", name: "통계유형",
				    data: [
						{ title: "상세월별추이", value: v_global.logic.chart_subtype }
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

	        //== Set initial values
			// 직전월까지의 1년 기간 구하기
            var EndDate = gw_com_api.getDate( "" );
            EndDate = EndDate.substr( 0, 6 ) + "01";
            EndDate = gw_com_api.addDate( "d", -1, EndDate, "" );
			var StartDate = gw_com_api.addDate( "m", -12, EndDate, "" );
			StartDate = gw_com_api.addDate( "d", 1, StartDate, "" );
			if (StartDate.substr(4,2) == EndDate.substr(4,2))
				StartDate = gw_com_api.addDate( "d", 1, StartDate, "" );

			gw_com_api.setValue("frmOption", 1, "ymd_fr", StartDate);
			gw_com_api.setValue("frmOption", 1, "ymd_to", EndDate);
			gw_com_module.startPage();

			if (v_global.process.param != "") {	// Page Parameter 변수 저장
				v_global.logic.call_page = gw_com_api.getPageParameter("call_page");

				if (v_global.logic.call_page == "QDM_5520") {
					gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr") );
					gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to") );

	        		processRetrieve({ });
				}
			}

        }

    },   // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
				            { name: "ymd_fr", label: { title: "대상기간:" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "chart", label: { title: "통계유형 :" }, hidden: true,
				                editable: { type: "select", data: { memory: "통계유형" } }
				            }
				        ]
                    },
				    { align: "right", element: [
				            { name: "실행", value: "실행", act: true, format: { type: "button" } },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ]
				    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Grid : VOC 분류별현황 ====
        var args = {
            targetid: "grdData_Main", query: "QDM_5521_M_1", title: "VOC 분류별 현황",
            caption: true, width: 200, height: 180, pager: false, show: true,
            element: [
				{ name: "category", header: "분류", width: 80, align: "center" },
				{ name: "value", header: "접수건수", width: 50, align: "center" },
				{ name: "rate", header: "처리건수", width: 50, align: "center" },
				{ name: "rcode1", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Main Chart : VOC 분류별현황 ====
        var args = {
            targetid: "lyrChart_Main", query: "QDM_5521_C_1", title: "VOC 분류별 현황", show: true,
            format: { view: "1", rotate: "0", reverse: "1", series: true },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //==== Sub Grid : 상세현황 ====
        var args = {
            targetid: "grdData_Sub", query: "QDM_5521_S_1", title: "상세 내역", 
            caption: true, show: true, height: 240, pager: true,
            element: [
				{ header: "관리번호", name: "voc_no", width: 80, align: "center" },
				{ header: "발생일자", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
				{ header: "등록분류", name: "issue_tp", width: 90, align: "center" },
				{ header: "고객사", name: "cust_nm", width: 70, align: "center" },
				{ header: "Line", name: "cust_dept", width: 80, align: "center" },
				{ header: "처리상태", name: "pstat", width: 80, align: "center" },
				{ header: "담당부서", name: "dept_nm", width: 120, align: "center" },
				{ header: "담당자", name: "emp_nm", width: 80, align: "center" },
				{ header: "처리결과", name: "result_cd", width: 60, align: "center" },
				{ header: "결과사유", name: "result_rmk", width: 100, align: "center" },
				{ header: "처리일시", name: "upd_dt", width: 80, align: "center", mask: "date-ymd" }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 5, min: false },
				{ type: "LAYER", id: "lyrChart_Main", offset: 5 },
				{ type: "GRID", id: "grdData_Sub", offset: 5 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },   // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process : Define Events & Method
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //==== Grid Events
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "rowdblclick", handler: processLinkPage };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "rowkeyenter", handler: processLinkPage };
        gw_com_module.eventBind(args);

    }   // End of gw_job_process.procedure

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

     var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "chart", argument: "arg_chart" }
            ],
            remark: [
		        { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", select: false },
			{ type: "CHART", id: "lyrChart_Main" }
        ],
        clear: [
			{ type: "GRID", id: "grdData_Sub" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "rcode1", argument: "arg_rcode1" }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Sub" }
		],
        key: param.key
    };
	gw_com_module.objRetrieve(args);
}
//----------
function processLinkPage(ui) {
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    if (ui.object = "grdData_Sub") {
        var LinkPage = "INFO_VOC";
        var LinkID = gw_com_api.v_Stream.msg_infoECR;

        // Popup Type
        var args = {
            type: "PAGE", page: LinkPage, title: "VOC 내역",
            width: 1120, height: 540, scroll: true, open: true, control: true, locate: ["center", "top"]
        };

        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = { page: LinkPage,
                param: { ID: LinkID,
                    data: {
                        voc_no: gw_com_api.getValue(ui.object, ui.row, "voc_no", true)
                    }
                }
            }
            gw_com_module.dialogueOpen(args);
        }

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            { gw_com_module.streamInterface(param); } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            { if (param.data.page != gw_com_api.getPageID()) break; } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {   var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "INFO_VOC":
                        { args.ID = gw_com_api.v_Stream.msg_infoECR;
                            args.data = {
                                voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "voc_no", true)
                            };
                        } break;
                } gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            { closeDialogue({ page: param.from.page }); } break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//