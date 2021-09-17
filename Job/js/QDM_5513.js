
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables. : DOWN율 현황
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
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline"},
				{ type: "PAGE", name: "제품군", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "IEHM06" } ] },
				{ type: "PAGE", name: "공정", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "IEHM03" } ] },
				{ type: "PAGE", name: "제품유형", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ] },
                { type: "INLINE", name: "챔버구성",
                    data: [ { title: "SINGLE", value: "SINGLE" }, { title: "TWIN", value: "TWIN" } ]
                },
                { type: "INLINE", name: "Warranty",
                    data: [{ title: "IN", value: "IN" }, { title: "OUT", value: "OUT" }]
                },
                { type: "INLINE", name: "Chart구분",
                    data: [ { title: "주간", value: "W" }, { title: "일간", value: "D" }, { title: "월간", value: "M" } ]
                },
                { type: "INLINE", name: "ChartGroup",
                    data: [ { title: "LINE", value: "LINE" }, { title: "공정", value: "PROC" }, { title: "제품유형", value: "PRODTYPE" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() {
            gw_job_process.UI();
			gw_job_process.procedure();

			// startup process.
			gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
			gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
			gw_com_module.startPage();

			if (v_global.process.param != "") {	// Page Parameter 변수 저장
				v_global.logic.call_page = gw_com_api.getPageParameter("call_page");
				v_global.logic.call_code = gw_com_api.getPageParameter("call_code");
				v_global.logic.call_name = gw_com_api.getPageParameter("call_name");

				if (v_global.logic.call_page == "QDM_5510") {
					gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr") );
					gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to") );
					gw_com_api.setValue("frmOption", 1, "prod_group", gw_com_api.getPageParameter("prod_group") );
					gw_com_api.setValue("frmOption", 1, "prod_type1", gw_com_api.getPageParameter("prod_type1") );
					gw_com_api.setValue("frmOption", 1, "prod_type2", gw_com_api.getPageParameter("prod_type2") );
					gw_com_api.setValue("frmOption", 1, "prod_type3", gw_com_api.getPageParameter("prod_type3") );
					gw_com_api.setValue("frmOption", 1, "cust_cd", gw_com_api.getPageParameter("cust_cd") );
					gw_com_api.setValue("frmOption", 1, "cust_dept1", gw_com_api.getPageParameter("cust_dept1") );
					gw_com_api.setValue("frmOption", 1, "cust_dept2", gw_com_api.getPageParameter("cust_dept2") );
					gw_com_api.setValue("frmOption", 1, "cust_dept3", gw_com_api.getPageParameter("cust_dept3") );

	        		processRetrieve({ });
				}
			}
        
        }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
            trans: true, show: true, border: true, remark: "lyrRemark", number: true,
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
				            { name: "ymd_fr", label: { title: "발생일자 :" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "prod_subtp", label: { title: "CH유형 :" },
				                editable: { type: "select",
				                    data: { memory: "챔버구성", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "chart_view", label: { title: "Chart구분 :" },
				                editable: { type: "select",
				                    data: { memory: "Chart구분" }
				                }
				            },
                            { name: "wrnt_io", label: { title: "Warranty :" },
                                editable: { type: "select",
                                    data: { memory: "Warranty", unshift: [{ title: "전체", value: ""}] }
                                }
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
                    { element: [
                            { name: "cust_cd", label: { title: "고객사 :" },
                                editable: { type: "select",
                                    data: { memory: "고객사", unshift: [{ title: "전체", value: ""}] },
                                    change: [
					                    { name: "cust_dept1", memory: "LINE", key: ["cust_cd"] },
                                        { name: "cust_dept2", memory: "LINE", key: ["cust_cd"] },
                                        { name: "cust_dept3", memory: "LINE", key: ["cust_cd"] }
				                    ]
                                }
                            },
                            { name: "cust_dept1", label: { title: "LINE :" }, style: { colfloat: "floating" },
                                editable: { type: "select",
                                    data: { memory: "LINE", unshift: [{ title: "전체", value: ""}], key: ["cust_cd"] }
                                }
                            },
				            { name: "cust_dept2",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: ""}], key: ["cust_cd"] }
				                }
				            },
				            { name: "cust_dept3",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: ""}], key: ["cust_cd"] }
				                }
				            },
                            { name: "cust_prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            }
                        ]
                    },
                    { element: [
                            { name: "chart_group", label: { title: "Chart Group :" },
                                editable: { type: "select",
                                    data: { memory: "ChartGroup", value: "LINE" }
                                }
                            },
                            { name: "cust_proc1", label: { title: "공정 :" }, style: { colfloat: "floating" },
                                editable: { type: "select",
                                    data: { memory: "공정", unshift: [{ title: "전체", value: ""}] }
                                }
                            },
				            { name: "cust_proc2",
				                editable: { type: "select",
				                    data: { memory: "공정", unshift: [{ title: "전체", value: ""}] }
				                }
				            },
				            { name: "cust_proc3",
				                editable: { type: "select",
				                    data: { memory: "공정", unshift: [{ title: "전체", value: ""}] }
				                }
				            }
                        ]
                    },
                    { align: "right", element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button"} },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기"} }
                        ]
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Main ====
        var args = { targetid: "grdData_현황", query: "EHM_5225_M_1", title: "DOWN율 현황",
            height: 442, show: true, selectable: true, dynamic: true,
            element: [
				{ header: "고객사", name: "cust_nm", width: 70, align: "center" },
				{ header: "LINE", name: "cust_dept_nm", width: 80, align: "center" },
				{ header: "Process", name: "cust_proc_nm", width: 100, align: "center" },
				{ header: "고객설비명", name: "cust_prod_nm", width: 120, align: "center" },
				{ header: "제품명", name: "prod_nm", width: 180, align: "center" },
				{ header: "DOWN율", name: "down_rate", width: 100, align: "center" },
				{ header: "DOWN시간", name: "down_hours", width: 100, align: "center" },
				{ name: "cust_cd", hidden: true },
				{ name: "cust_dept", hidden: true },
				{ name: "cust_proc", hidden: true },
				{ name: "prod_group", hidden: true },
				{ name: "prod_type", hidden: true },
				{ name: "prod_key", hidden: true },
				{ name: "wrnt_io", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Chart : Main ====
		var args = { targetid: "lyrChart_현황", query: "EHM_5225_S_1", title: "DOWN율 통계",
            caption: true, show: true,
            format: { view: "3", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //==== objResize ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_현황", offset: 8 }
               ,{ type: "LAYER", id: "lyrChart_현황", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        // Declare Button Events
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        
        // Declare Grid Events
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);


        // Event Handler Functions : Button
        function click_lyrMenu_조회(ui) {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }

        function click_lyrMenu_닫기(ui) { processClose({}); }

        function click_frmOption_실행(ui) { processRetrieve({}); }

        function click_frmOption_취소(ui) { closeOption({}); }

        // Event Handler Functions : Grid
        function rowdblclick_grdData_현황(ui) {
            var args = { ID: gw_com_api.v_Stream.msg_linkPage, to: { type: "MAIN" },
                data: { page: "EHM_5210", title: "장비 DOWN 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue(ui.object, ui.row, "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue(ui.object, ui.row, "ymd_to", true) },
                        { name: "cust_cd", value: gw_com_api.getValue(ui.object, ui.row, "cust_cd", true) },
                        { name: "cust_dept", value: gw_com_api.getValue(ui.object, ui.row, "cust_dept", true) },
                        { name: "cust_proc", value: gw_com_api.getValue(ui.object, ui.row, "cust_proc", true) },
                        { name: "cust_prod_nm", value: gw_com_api.getValue(ui.object, ui.row, "cust_prod_nm", true) },
                        { name: "prod_group", value: gw_com_api.getValue(ui.object, ui.row, "prod_group", true) },
                        { name: "prod_type", value: gw_com_api.getValue(ui.object, ui.row, "prod_type", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);
        }
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "wrnt_io", argument: "arg_wrnt_io" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "prod_subtp", argument: "arg_prod_subtp" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept1", argument: "arg_cust_dept1" },
				{ name: "cust_dept2", argument: "arg_cust_dept2" },
				{ name: "cust_dept3", argument: "arg_cust_dept3" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "chart_view", argument: "arg_chart_view" },
				{ name: "chart_group", argument: "arg_chart_group" },
				{ name: "cust_proc1", argument: "arg_cust_proc1" },
				{ name: "cust_proc2", argument: "arg_cust_proc2" },
				{ name: "cust_proc3", argument: "arg_cust_proc3" }
			],
            remark: [
                { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept1"}] },
		        { element: [{ name: "cust_prod_nm"}] },
		        { element: [{ name: "prod_group"}] },
		        { element: [{ name: "prod_type1"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", focus: true, select: true },
			{ type: "CHART", id: "lyrChart_현황" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}

function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
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
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                            args.data = {
                                issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//