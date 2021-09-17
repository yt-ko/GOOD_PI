
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
				{ type: "PAGE", name: "제품유형", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ] },
                { type: "INLINE", name: "챔버구성",
                    data: [ { title: "SINGLE", value: "SINGLE" }, { title: "TWIN", value: "TWIN" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { gw_job_process.UI(); }

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
				            { name: "ymd_fr", label: { title: "대상기간 :" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
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
        var args = { targetid: "grdData_현황", query: "QDM_5510_M_1", title: "품질 지수",
            height: 350, show: true, selectable: true, dynamic: true, number: true,
            element: [
				{ header: "점검항목", name: "qi_nm", width: 120, align: "left" },
				{ header: "지수", name: "qi_result", width: 60, align: "center" },
				{ header: "단위", name: "qi_unit", width: 40, align: "center" },
				{ header: "분자", name: "qi_val01", width: 60, align: "center" },
				{ header: "분모", name: "qi_val02", width: 60, align: "center" },
				{ header: "산식 설명", name: "qi_desc", width: 300, align: "left" },
				{ name: "qi_cd", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Chart : Main ====
		var args = { targetid: "lyrChart_현황", query: "QDM_5510_S_1", title: "연간 월별 추이",
            caption: true, show: false,
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

        gw_job_process.procedure();

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
        	return; // by JJJ
        	// get Source Grid Data
        	var QiType = gw_com_api.getValue(ui.object, ui.row, "qi_cd", true);
        	var QiName = gw_com_api.getValue(ui.object, ui.row, "qi_nm", true);
        	
        	// get Form Options Data
        	var YmdFr = gw_com_api.getValue("frmOption", 1, "ymd_fr");
        	var YmdTo = gw_com_api.getValue("frmOption", 1, "ymd_to");
        	var ProdGroup = gw_com_api.getValue("frmOption", 1, "prod_group");
        	var ProdType1 = gw_com_api.getValue("frmOption", 1, "prod_type1");
        	var ProdType2 = gw_com_api.getValue("frmOption", 1, "prod_type1");
        	var ProdType3 = gw_com_api.getValue("frmOption", 1, "prod_type1");
        	var CustCode = gw_com_api.getValue("frmOption", 1, "cust_cd");
        	var CustDetp1 = gw_com_api.getValue("frmOption", 1, "cust_dept1");
        	var CustDetp2 = gw_com_api.getValue("frmOption", 1, "cust_dept1");
        	var CustDetp3 = gw_com_api.getValue("frmOption", 1, "cust_dept1");
        	var PartType = "";

			// seperate Page by QI Type
        	var LinkPage = "";
        	var LinkTitle = "";
        	if (QiType == "QICD1") {
        		LinkPage = "QDM_5511" ; LinkTitle = "VOC 상세";
        	}
        	else if (QiType == "QICD2" || QiType == "QICD3" || QiType == "QICD4" || QiType == "QICD5" ) {
        		LinkPage = "QDM_5512" ; LinkTitle = "부품불량 상세";
        	}
        	else if (QiType == "QICD6") {
        		LinkPage = "QDM_5512" ; LinkTitle = "부품군별 불량 상세"; PartType = "10";
        	}
        	else if (QiType == "QICD7") {
        		LinkPage = "QDM_5512" ; LinkTitle = "부품군별 불량 상세"; PartType = "20";
        	}
        	else if (QiType == "QICD8") {
        		LinkPage = "QDM_5512" ; LinkTitle = "부품군별 불량 상세"; PartType = "30";
        	}
        	else if (QiType == "QICD9") {
        		LinkPage = "QDM_5514" ; LinkTitle = "Wafer Loss 상세";
        	}
        	else if (QiType == "QICD10" || QiType == "QICD11" || QiType == "QICD12" || QiType == "QICD13" || QiType == "QICD14") {
        		LinkPage = "QDM_5513" ; LinkTitle = "설비다운 상세";
        	}
        	else return;
        	
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: { page: LinkPage, title: LinkTitle,
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("frmOption", 1, "ymd_fr") },
                        { name: "ymd_to", value: gw_com_api.getValue("frmOption", 1, "ymd_to") },
                        { name: "prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                        { name: "prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                        { name: "prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                        { name: "prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") },
                        { name: "cust_cd", value: gw_com_api.getValue("frmOption", 1, "cust_cd") },
                        { name: "cust_dept1", value: gw_com_api.getValue("frmOption", 1, "cust_dept1") },
                        { name: "cust_dept2", value: gw_com_api.getValue("frmOption", 1, "cust_dept2") },
                        { name: "cust_dept3", value: gw_com_api.getValue("frmOption", 1, "cust_dept3") },
                        { name: "call_page", value: "QDM_5510" },
                        { name: "part_tp", value: PartType },
                        { name: "call_code", value: QiType },
                        { name: "call_name", value: QiName }
                    ]
                }
            };
            gw_com_module.streamInterface(args);
        }

        // Set Initial Values
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        
        // Start Page
        gw_com_module.startPage();
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
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept1", argument: "arg_cust_dept1" },
				{ name: "cust_dept2", argument: "arg_cust_dept2" },
				{ name: "cust_dept3", argument: "arg_cust_dept3" }
			],
            remark: [
                {
                    infix: "~",
                    element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
                },
		        {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "cust_dept1"}]
		        },
		        {
		            element: [{ name: "prod_group"}]
		        },
		        {
		            element: [{ name: "prod_type1"}]
		        }
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