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

        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data.

        //----------
        // set data for DDDW List
        var args = { request: [
                { type: "PAGE", name: "발생구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM010"}] 
                },
                { type: "PAGE", name: "접수구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM020"}]
                },
                { type: "INLINE", name: "통계기준",
                    data: [ { title: "발생일자", value: "ISSD" }
                    	, { title: "접수일자", value: "RCPT" }
                    	, { title: "발행일자", value: "RQST" } ]
                },
                { type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "ISCM29" } ]
                },
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [ { argument: "arg_hcode", value: "IEHM02" } ]
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

    },   // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Main Menu : 조회, 접수, 반려, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
			            { name: "ymd_fr", label: { title: "발생일자 :" }, mask: "date-ymd",
			                style: { colfloat: "floating" },
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
			            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
                        { name: "issue_tp", label: { title: "발생구분 :" },
                            editable: { type: "select", size: 7, maxlength: 20 , 
                            	data: { memory: "발생구분", unshift: [{ title: "전체", value: ""}] } }
                        }
                    	]
                    },
                    { element: [
			            { name: "cust_cd", label: { title: "고객사 :" },
			                editable: { type: "select", size: 1,
			                    data: { memory: "고객사", unshift: [ { title: "전체", value: "" } ] },
			                    change: [ { name: "cust_dept", memory: "LINE", key: [ "cust_cd" ] } ]
			                }
			            },
			            { name: "cust_dept",
			                label: { title: "LINE :" },
			                editable: { type: "select", size: 1,
			                    data: { memory: "LINE", unshift: [ { title: "전체", value: "" } ], key: [ "cust_cd" ] }
			                }
			            },
                        { name: "chart_sub", label: { title: "통계기준 :" }, value: "RCPT",
                            editable: { type: "select", size: 7, maxlength: 20,
                                data: { memory: "통계기준" } 
                                }
                        }
				        ]
                    },
                    { element: [
			            { name: "실행", value: "실행", act: true, format: { type: "button" } },
			            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ], align: "right"
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //grdData_현황
        var args = { targetid: "grdData_현황", query: "QDM_6510_M_1", title: "NCR 진행현황",
            caption: true, width: 200, height: 150, pager: false, show: true,
            element: [
				{ header: "진행상태", name: "category", width: 70, align: "center" },
				{ header: "건수", name: "value", width: 40, align: "center" },
				{ header: "비율(%)", name: "rate", width: 40, align: "center" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "issue_tp", hidden: true },
				{ name: "cust_cd", hidden: true },
				{ name: "cust_dept", hidden: true },
				{ name: "issue_tp", hidden: true },
				{ name: "chart_sub", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);

        //grdData_상세
        var args = { targetid: "grdData_상세", query: "QDM_6510_S_1", title: "상세 현황",
            caption: true, height: 216, pager: true, show: true, dynamic: true, number: true,
            element: [
				{ header: "발생일자", name: "issue_dt", width: 70, align: "center", mask: "date-ymd" },
				{ header: "발생구분", name: "issue_tp", width: 50, align: "center" },
				{ header: "발생부서", name: "dept_nm", width: 80, align: "center" },
				{ header: "관리번호", name: "issue_no", width: 70, align: "center" },
				{ header: "발행번호", name: "rqst_no", width: 70, align: "center" },
				{ header: "고객사", name: "cust_nm", width: 60, align: "center" },
				{ header: "Line", name: "cust_dept", width: 60, align: "center" },
				{ header: "Process", name: "cust_proc", width: 60, align: "center" },
				{ header: "설비명", name: "prod_nm", width: 150, align: "center" },
				{ header: "진행상태", name: "pstat", width: 60, align: "center", editable: { type: "hidden" } },
				{ header: "발행여부", name: "astat", width: 60, align: "center" },
				//{ header: "발행비고", name: "astat_rmk", width: 200, align: "center" },
				{ header: "발행자", name: "astat_user_nm", width: 60, align: "center" },
				{ header: "발행일시", name: "astat_dt", width: 100, align: "center" },
                { name: "prod_key", hidden: true },
                { name: "dept_cd", hidden: true },
                { name: "cust_cd", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //lyrChart_통계
        var args = { targetid: "lyrChart_통계", query: "QDM_6510_M_2", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_1 }
        };
        //----------
        gw_com_module.chartCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "GRID", id: "grdData_상세", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },   // End of gw_job_process.UI


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);

        //==== Grid Events : Main
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);

        //==== Grid Events : Sub
        var args = { targetid: "grdData_상세", grid: true, event: "rowdblclick", handler: eventItemDblClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_상세", grid: true, event: "rowkeyenter", handler: eventItemDblClick };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_module.startPage();

    }   // End of gw_job_process.procedure

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//====  Event Process : ItemDoubleClick
function eventItemDblClick(ui){
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;
    
	//---------- Popup Find Window for select items
    switch (ui.object) { 
        case "grdData_상세": {
		    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
		        to: { type: "MAIN" },
		        data: { page: "QDM_6590", title: "NCR 내역서",
		            param: [
		                { name: "AUTH", value: "R" },
		                { name: "rqst_no", value: gw_com_api.getValue("grdData_상세", "selected", "rqst_no", true) }
		            ]
		        }
		    };
		    gw_com_module.streamInterface(args);
        } break;
        default: return;
    }
}

//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "issue_tp", argument: "arg_issue_tp" },
				{ name: "chart_sub", argument: "arg_chart_sub" }
			],
            remark: [
			    { infix: "~",
			      element: [ { name: "ymd_fr" }, { name: "ymd_to" } ]
			    },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept"}] },
		        { element: [{ name: "issue_tp"}] },
		        {
		            element: [{ name: "chart_sub"}]
		        }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황" }
		],
        clear: [
			{ type: "GRID", id: "grdData_상세" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: { type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
                { name: "chart_sub", argument: "arg_chart_sub" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "issue_tp", argument: "arg_issue_tp" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "rcode", argument: "arg_stat" }
			]
        },
        target: [
            { type: "GRID", id: "grdData_상세" },
			{ type: "CHART", id: "lyrChart_통계" }
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
                                voc_no: gw_com_api.getValue("grdData_상세", "selected", "voc_no", true)
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