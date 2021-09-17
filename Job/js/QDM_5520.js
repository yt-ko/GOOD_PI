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

        // set data for DDDW List
        v_global.logic.chart_subtype = "MainTrend";
        var args = { request: [
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "IEHM06" } ]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
				{ type: "INLINE", name: "통계유형",
				    data: [
						{ title: "월별추이", value: v_global.logic.chart_subtype }
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
			var StartDate = gw_com_api.addDate( "m", -6, EndDate, "" );
			StartDate = gw_com_api.addDate( "d", 1, StartDate, "" );
			if (StartDate.substr(4,2) == EndDate.substr(4,2))
				StartDate = gw_com_api.addDate( "d", 1, StartDate, "" );

			gw_com_api.setValue("frmOption", 1, "ymd_fr", StartDate);
			gw_com_api.setValue("frmOption", 1, "ymd_to", EndDate);
			gw_com_api.setValue("frmOption", 1, "chart", v_global.logic.chart_subtype);
			//----------
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
				            { name: "ymd_fr", label: { title: "조회기간 :" },
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
                    { element: [
                            { name: "prod_group", label: { title: "제품군 :" },
                                editable: { type: "select",
                                    data: { memory: "제품군", unshift: [ { title: "전체", value: "" } ] }
                                }
                            },
				            { name: "prod_type1", label: { title: "제품유형 :" },
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_type2",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_type3",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
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

        //grdData_1
        var args = { targetid: "grdData_1", query: "EOM_5150_M1", title: "VOC 접수현황",
            caption: true, width: 200, height: 230, pager: false, show: false, hidden: true,
            element: [
				{ header: "호기", name: "eq_no", width: 80, align: "center" },
				{ header: "설비명", name: "eq_nm", width: 80, align: "center" },
				{ name: "eq_cd", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);

        //grdData_2
        var args = { targetid: "grdData_2", query: "EOM_5150_S1", title: "상세내역", hidden: true,
            caption: true, width: 200, height: 230, pager: false, show: false,
            element: [
				{ header: "호기", name: "eq_no", width: 80, align: "center" },
				{ header: "설비", name: "eq_nm", width: 80, align: "center" },
				{ header: "모듈", name: "eq_module", width: 80, align: "center" },
				{ header: "01 월", name: "val01", width: 66, align: "center" },
				{ header: "02 월", name: "val02", width: 66, align: "center" },
				{ header: "03 월", name: "val03", width: 66, align: "center" },
				{ header: "04 월", name: "val04", width: 66, align: "center" },
				{ header: "05 월", name: "val05", width: 66, align: "center" },
				{ header: "06 월", name: "val06", width: 66, align: "center" },
				{ header: "07 월", name: "val07", width: 66, align: "center" },
				{ header: "08 월", name: "val08", width: 66, align: "center" },
				{ header: "09 월", name: "val09", width: 66, align: "center" },
				{ header: "10 월", name: "val10", width: 66, align: "center" },
				{ header: "11 월", name: "val11", width: 66, align: "center" },
				{ header: "12 월", name: "val12", width: 66, align: "center" },
				{ header: "코드", name: "eq_cd", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Chart
        var args = { targetid: "lyrChart_1", query: "QDM_5520_C_1", title: "VOC 접수 현황", show: true,
            format: { view: "1", rotate: "0", reverse: "1", series: false },
            control: { by: "DX", id: ctlChart_1 },
			handler: { event: "dblclick", action: processLinkPage }
        };
        gw_com_module.chartCreate(args);

        //==== Chart
        var args = { targetid: "lyrChart_2", query: "QDM_5520_C_2", title: "Top3 불량현황", show: true,
            format: { view: "1", rotate: "0", reverse: "1", series: true },
            control: { by: "DX", id: ctlChart_2 },
			handler: { event: "dblclick", action: processLinkPage }
        };
        gw_com_module.chartCreate(args);

        //==== Chart
        var args = { targetid: "lyrChart_3", query: "QDM_5520_C_3", title: "설비 불량 지수", show: true,
            format: { view: "1", rotate: "0", reverse: "1", series: false },
            control: { by: "DX", id: ctlChart_3 },
			handler: { event: "dblclick", action: processLinkPage }
        };
        gw_com_module.chartCreate(args);

        //==== Chart
        var args = { targetid: "lyrChart_4", query: "QDM_5520_C_4", title: "설비 다운 지수", show: true,
            format: { view: "1", rotate: "0", reverse: "1", series: false },
            control: { by: "DX", id: ctlChart_4 },
			handler: { event: "dblclick", action: processLinkPage }
        };
        gw_com_module.chartCreate(args);


        //$(targetobj).jqGrid('setLabel', this.name, this.label);
        //this.v_Object[args.targetid].header
        //setAttribute: function (id, row, element, name, value, isgrid)
        //=====================================================================================
        var args = {
            target: [
				//{ type: "GRID", id: "grdData_1", offset: 15 },
				//{ type: "GRID", id: "grdData_2", offset: 15 },
				{ type: "LAYER", id: "lyrChart_1", offset: 15 },
				{ type: "LAYER", id: "lyrChart_2", offset: 15 },
				{ type: "LAYER", id: "lyrChart_3", offset: 15 },
				{ type: "LAYER", id: "lyrChart_4", offset: 15 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },   // End of gw_job_process.UI


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
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

	if (ui.type == "CHART") {
        var LinkPage, PageTitle;
        var LinkID = gw_com_api.v_Stream.msg_linkTabPage;

        if ( ui.object == "lyrChart_1" ) {
        	LinkPage = "QDM_5521"; PageTitle = "VOC 상세 정보"
        }
        else if ( ui.object == "lyrChart_2" ) {
        	LinkPage = "QDM_5522"; PageTitle = "Top3 불량 현황"
        }
        else if ( ui.object == "lyrChart_3" ) {
        	LinkPage = "QDM_5523"; PageTitle = "설비 불량 지수"
        }
        else if ( ui.object == "lyrChart_4" ) {
        	LinkPage = "QDM_5524"; PageTitle = "설비 다운 지수"
        }
        else return;

        // Link Page Type
        var args = { ID: LinkID,
            to: { type: "MAIN" },
            data: { page: LinkPage, title: PageTitle,
                param: [
                    { name: "call_page", value: gw_com_api.getPageID() },
                    { name: "ymd_fr", value: gw_com_api.getValue("frmOption", 1, "ymd_fr", false) },
                    { name: "ymd_to", value: gw_com_api.getValue("frmOption", 1, "ymd_to", false) },
                    { name: "prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group", false) },
                    { name: "prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1", false) },
                    { name: "prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2", false) },
                    { name: "prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3", false) }
                ]
            }
        };
        gw_com_module.streamInterface(args);
	}

    //args.data.param.push( { name: "cust_cd", value: "" } );
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
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
                { name: "chart", argument: "arg_chart" }
            ],
            remark: [
		        { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "prod_group" }] },
		        { infix: " / ", element: [{ name: "prod_type1" }, { name: "prod_type2" }, { name: "prod_type3" }] }
            ]
        },
        target: [
			{ type: "CHART", id: "lyrChart_1" },
			{ type: "CHART", id: "lyrChart_2" },
			{ type: "CHART", id: "lyrChart_3" },
			{ type: "CHART", id: "lyrChart_4" }
        ],
        //clear: [
		//	{ type: "GRID", id: "grdData_2" }
        //],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    //var args = {
    //    source: { type: "GRID", id: "grdData_1", row: "selected", block: true,
    //        element: [
	//			{ name: "ymd_fr", argument: "arg_ymd_fr" },
	//			{ name: "ymd_to", argument: "arg_ymd_to" },
	//			{ name: "chart", argument: "arg_chart" },
    //            { name: "eq_cd", argument: "arg_rcode" }
    //        ]
    //    },
    //    target: [
	//		{ type: "GRID", id: "grdData_2" }
    //        , { type: "CHART", id: "lyrChart_1" }
	//	],
    //    key: param.key
    //};
    //gw_com_module.objRetrieve(args);

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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
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
                                voc_no: gw_com_api.getValue("grdData_2", "selected", "voc_no", true)
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