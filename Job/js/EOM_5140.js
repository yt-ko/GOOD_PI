
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM11" } ] },
				{  type: "INLINE", name: "통계유형",
				    data: [
						{ title: "설비별", value: "EQ" },
						{ title: "설비별", value: "MAKER" }
					]
				},
                { type: "PAGE", name: "담당부서", query: "dddw_eq_dept" },
                {
                    type: "PAGE", name: "연구설비", query: "DDDW_EOM_EQ",
                    param: [{ argument: "arg_hcode", value: "ALL" }]
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
				            { name: "ymd_fr", label: { title: "운영일자 :" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            }
				        ]
                    },
				    { align: "right", element: [
				            { name: "eq_cd", label: { title: "연구설비 :" },
				            editable: { type: "select", data: { memory: "연구설비", unshift: [{ title: "전체", value: "%" }] } }
				            },
				            { name: "실행", value: "실행", act: true, format: { type: "button" } },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ]
				    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Grid
        var args = { targetid: "grdData_Main", query: "EOM_5140_M_1", title: "설비별",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{ header: "분류", name: "category", width: 165, align: "center" },
				{ header: "사용량", name: "value", width: 60, align: "right", mask: "numeric-int"},
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Main Chart
        var args = { targetid: "lyrChart_Main", query: "EOM_5140_M_1", title: "설비별", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //==== Sub Grid
        var args = { targetid: "grdData_Sub", query: "EOM_5140_S_1", title: "모듈별",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{ header: "분류", name: "category", width: 165, align: "center" },
				{ header: "사용량", name: "value", width: 60, align: "right", mask: "numeric-int" },
				{ name: "rgroup", hidden: true },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Chart
        var args = { targetid: "lyrChart_Sub", query: "EOM_5140_S_1", title: "모듈별", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_2 }
        };
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 15, min: true },
				{ type: "GRID", id: "grdData_Sub", offset: 15, min: true },
				{ type: "LAYER", id: "lyrChart_Main", offset: 15, min: true },
				{ type: "LAYER", id: "lyrChart_Sub", offset: 15, min: true }
			]
        };
        gw_com_module.objResize(args);

        //----------
        gw_com_module.informSize();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processLinkPage };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowkeyenter", handler: processLinkPage };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "rowdblclick", handler: processLinkPage };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "rowkeyenter", handler: processLinkPage };
        gw_com_module.eventBind(args);

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();

    }
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
function processLinkPage(ui) {
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    if (ui.object = "grdData_Main") {
        var LinkPage = "EOM_5190";
        var LinkID = gw_com_api.v_Stream.msg_linkPage;

        // Link Page Type
        var args = { ID: LinkID,
            to: { type: "MAIN" },
            data: { page: LinkPage, title: "운영 내역",
                param: [
                    { name: "ymd_fr", value: gw_com_api.getValue("grdData_Main", "selected", "ymd_fr", true) },
                    { name: "ymd_to", value: gw_com_api.getValue("grdData_Main", "selected", "ymd_to", true) },
                    { name: "eq_no", value: gw_com_api.getValue("grdData_Main", "selected", "rcode", true) }
                ]
            }
        };
        //var chart = gw_com_api.getValue("grdData_Main", "selected", "chart", true);
        //switch (chart) {
        //    case "EQ-RUN": {
        //            args.data.param.push(
        //                { name: "prod_group", value: gw_com_api.getValue("grdData_Main", "selected", "prod_group", true) },
        //                { name: "status_nm2", value: gw_com_api.getValue("grdData_상세현황", "selected", "category", true) }
        //            );
        //        } break;
        //    case "EQ-PLAN": {
        //            args.data.param.push(
        //                { name: "cust_cd", value: gw_com_api.getValue("grdData_Main", "selected", "cust_cd", true) },
        //                { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) }
        //            );
        //        } break;
        //}
        gw_com_module.streamInterface(args);
        
        // Popup Type
        //var args = {
        //    type: "PAGE", page: LinkPage, title: "문제발생 상세 정보",
        //    width: 1100, height: 600, scroll: true, open: true, control: true, locate: ["center", "top"]
        //};

        //if (gw_com_module.dialoguePrepare(args) == false) {
        //    var args = { page: LinkPage,
        //        param: { ID: LinkID,
        //            data: {
        //                issue_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true),
        //                voc_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true)
        //            }
        //        }
        //    }
        //    gw_com_module.dialogueOpen(args);
        //}
    }
}
//----------
function processRetrieve(param) {
    
    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

	// Change Caption
	var sChart = gw_com_api.getValue("frmOption", 1, "chart", false );
	var sTitle1 = "설비별";
	if (sChart == "EQ") { sTitle1 = "설비별"; }
	gw_com_api.setCaption("grdData_Main", sTitle1, true);
	
	// Retrieve Data
     var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
                { name: "chart", argument: "arg_chart" },
                { name: "eq_cd", argument: "arg_eq_cd" }
            ],
            remark: [
		        { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "eq_cd" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main" }
            , { type: "CHART", id: "lyrChart_Main" }
        ],
        clear: [
			{ type: "GRID", id: "grdData_Sub" }
            , { type: "CHART", id: "lyrChart_Sub" }
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
				{ name: "chart", argument: "arg_chart" },
                { name: "rcode", argument: "arg_rcode" }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Sub" }
            , { type: "CHART", id: "lyrChart_Sub" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------
function closeOption(param) { gw_com_api.hide("frmOption"); }

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID())
                break;
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//