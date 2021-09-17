//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 연구소 설비운영현황 월별추이
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
        var args = {
            request: [
                {
                    type: "PAGE", name: "현상분류", query: "dddw_zcodedt",
                    param: [{ argument: "arg_hcode", value: "EOM110-30" }, { argument: "arg_level", value: 1 }]
                },
                {
                    type: "PAGE", name: "연구설비", query: "DDDW_EOM_EQ",
                    param: [{ argument: "arg_hcode", value: "ALL"}] 
                },
                {
                    type: "PAGE", name: "설비모듈", query: "DDDW_EOM_EQMODULE2",
                    param: [{ argument: "arg_hcode", value: "" }]
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
	        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
	        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
	        
	        //== Start Page
	        gw_com_module.startPage();
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
				            {
				                name: "ymd_fr", label: { title: "운영일자 :" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            {
				                name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            }
				        ]
                    },
				    { element: [
	                        {
	                            name: "eq_cd", label: { title: "연구설비 :" },
	                            editable: {
	                                type: "select", change: [{ name: "eq_module", memory: "설비모듈", key: ["eq_cd"] }],
	                                data: { memory: "연구설비", unshift: [{ title: "전체", value: "%" }] }
	                            }
	                        },
                            {
                                name: "eq_module", label: { title: "설비모듈 :" },
                                editable: { type: "select", data: { memory: "설비모듈", key: ["eq_cd"] } }
                            }
				        ]
				    },
				    {
				        element: [
				            {
				                name: "status_tp1", label: { title: "현상분류 :" }, width: 150,
				                editable: { type: "select", data: { memory: "현상분류", unshift: [{ title: "전체", value: "%" }] } }
				            }
				        ]
				    },
                    {
                        align: "right", element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ]
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //grdData_Main
        var args = { targetid: "grdData_Main", query: "EOM_5150_M1", title: "운영 설비",
            caption: true, width: 200, height: 350, pager: false, show: true,
            element: [
				{ header: "호기", name: "eq_cd", width: 80, align: "center" },
				{ header: "모듈", name: "eq_module", width: 50, align: "center" },
                { name: "status_tp", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);

        //==== Main Chart
        var args = { targetid: "lyrChart_Main", query: "EOM_5150_M_C", title: "월별 추이", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //grdData_Sub
        var args = { targetid: "grdData_Sub", query: "EOM_5150_S1", title: "상세내역",
            caption: true, width: 1100, height: 22, pager: false, show: true,
            element: [
				{ header: "호기", name: "eq_no", width: 80, align: "center" },
				{ header: "모듈", name: "eq_module", width: 80, align: "center" },
				{ header: "01 월", name: "val01", width: 66, align: "right" },
				{ header: "02 월", name: "val02", width: 66, align: "right" },
				{ header: "03 월", name: "val03", width: 66, align: "right" },
				{ header: "04 월", name: "val04", width: 66, align: "right" },
				{ header: "05 월", name: "val05", width: 66, align: "right" },
				{ header: "06 월", name: "val06", width: 66, align: "right" },
				{ header: "07 월", name: "val07", width: 66, align: "right" },
				{ header: "08 월", name: "val08", width: 66, align: "right" },
				{ header: "09 월", name: "val09", width: 66, align: "right" },
				{ header: "10 월", name: "val10", width: 66, align: "right" },
				{ header: "11 월", name: "val11", width: 66, align: "right" },
				{ header: "12 월", name: "val12", width: 66, align: "right" },
				{ header: "코드", name: "eq_cd", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //$(targetobj).jqGrid('setLabel', this.name, this.label);
        //this.v_Object[args.targetid].header
        //setAttribute: function (id, row, element, name, value, isgrid)
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 15 },
				{ type: "GRID", id: "grdData_Sub", offset: 15 },
				{ type: "LAYER", id: "lyrChart_Main", offset: 15 }
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

        //== Button Events
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //== Grid Events
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
function processLinkPage(ui) {
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    if (ui.object = "grdData_Main") {
        var LinkPage = "EOM_5190";
        var LinkID = gw_com_api.v_Stream.msg_infoECR;

        // Link Page Type
        var args = { ID: LinkID,
            to: { type: "MAIN" },
            data: { page: LinkPage, title: "운영 내역",
                param: [
                    { name: "ymd_fr", value: gw_com_api.getValue("grdData_Main", "selected", "ymd_fr", true) },
                    { name: "ymd_to", value: gw_com_api.getValue("grdData_Main", "selected", "ymd_to", true) },
                    { name: "eq_no", value: gw_com_api.getValue("grdData_Main", "selected", "eq_cd", true) }
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
        //                { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_상세현황", "selected", "eq_cd", true) }
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

     var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
                { name: "status_tp1", argument: "arg_status_tp" },
				{ name: "eq_cd", argument: "arg_eq_cd" },
                { name: "eq_module", argument: "arg_eq_module" }
            ],
            remark: [
		        { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "eq_cd" }] }, { element: [{ name: "eq_module" }] },
                { element: [{ name: "status_tp1" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", select: true }
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
                { name: "eq_cd", argument: "arg_eq_cd" },
				{ name: "eq_module", argument: "arg_eq_module" },
                { name: "status_tp", argument: "arg_status_tp" }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Sub" }
            , { type: "CHART", id: "lyrChart_Main" }
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
                                voc_no: gw_com_api.getValue("grdData_Sub", "selected", "voc_no", true)
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            { closeDialogue({ page: param.from.page }); } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//