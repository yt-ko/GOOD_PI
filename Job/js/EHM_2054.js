//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables. : Down 지표
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            request: [
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM11" } ] },
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM06" } ] },
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "ISCM25" } ] },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline"},
                { type: "INLINE", name: "챔버구성",
                    data: [ { title: "TWIN", value: "TWIN" },{ title: "SINGLE", value: "SINGLE" }  ]
                },
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
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
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
				            { name: "ymd_fr", label: { title: "기준일자 :" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            },
                            { name: "run_yn", label: { title: "가동장비 포함 :" },
                                title: "가동장비 포함", value: 0,
                                editable: { type: "checkbox", value: 0, offval: 1 }
                            },
                            { name: "cust_prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            }
                        ]
                    },
                    { element: [
                            { name: "prod_group", label: { title: "제품군 :" },
                                editable: { type: "select",
                                    data: { memory: "제품군", unshift: [ { title: "전체", value: "%" } ] }
                                }
                            },
				            { name: "prod_subtp", label: { title: "CH유형 :" },
				                editable: { type: "select",
				                    data: { memory: "챔버구성" }
				                }
				            }
				        ]
                    },
                    {
                        element: [
                              {
                                  name: "prod_type1", label: { title: "제품유형 :" },
                                  editable: {
                                      type: "select",
                                      data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                  }
                              },
                              {
                                  name: "prod_type2",
                                  editable: {
                                      type: "select",
                                      data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                  }
                              },
                              {
                                  name: "prod_type3",
                                  editable: {
                                      type: "select",
                                      data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                  }
                              },
                              {
                                  name: "prod_type4",
                                  editable: {
                                      type: "select",
                                      data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                  }
                              },
                              {
                                  name: "prod_type5",
                                  editable: {
                                      type: "select",
                                      data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                  }
                              }
                        ]
                    },
                    {
                        element: [
                            { name: "cust_cd", label: { title: "고객사 :" },
                                editable: { type: "select",
                                    data: { memory: "고객사", unshift: [ { title: "전체", value: "%" } ] },
                                    change: [
					                    { name: "cust_dept1", memory: "LINE", key: [ "cust_cd" ] },
					                    { name: "cust_dept2", memory: "LINE", key: [ "cust_cd" ] },
					                    { name: "cust_dept3", memory: "LINE", key: [ "cust_cd" ] },
					                    { name: "cust_dept4", memory: "LINE", key: [ "cust_cd" ] },
					                    { name: "cust_dept5", memory: "LINE", key: [ "cust_cd" ] },
					                    { name: "cust_dept6", memory: "LINE", key: [ "cust_cd" ] } ]
                                }
                            },
				            { name: "cust_dept1", label: { title: "LINE :" },
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [ { title: "전체", value: "%" } ], key: [ "cust_cd" ] }
				                }
				            },
				            { name: "cust_dept2",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [ { title: "전체", value: "%" } ], key: [ "cust_cd" ] }
				                }
				            },
				            { name: "cust_dept3",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [ { title: "전체", value: "%" } ], key: [ "cust_cd" ] }
				                }
				            },
				            { name: "cust_dept4",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [ { title: "전체", value: "%" } ], key: [ "cust_cd" ] }
				                }
				            },
				            { name: "cust_dept5",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [ { title: "전체", value: "%" } ], key: [ "cust_cd" ] }
				                }
				            },
				            { name: "cust_dept6",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [ { title: "전체", value: "%" } ], key: [ "cust_cd" ] }
				                }
				            }
                        ]
                    },
                    { align: "right", element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
							//{ name: "출력", value: "엑셀 받기", format: { type: "button", icon: "출력" } },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ]
                    }
			    ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //grdData_현황
        var args = { targetid: "grdData_현황", query: "EHM_2054_M_1", title: "DOWNTIME 지표",
            height: 442, show: true, selectable: true, key: true, dynamic: true,
            color: { row: true },
            element: [
                { header: "일자", name: "dt", width: 80, align: "center" },
				{ header: "고객사", name: "cust_nm", width: 50, align: "center" },
				{ header: "LINE", name: "cust_dept", width: 80, align: "center" },
				{ header: "설비명", name: "cust_prod_nm", width: 120, align: "center" },
				{ header: "제품유형", name: "prod_type1", width: 100, align: "center" },
				{ header: "Warranty", name: "wrnt_io", width: 60, align: "center" },
				{ header: "PM A", name: "statusA", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM B", name: "statusB", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM C", name: "statusC", width: 55, align: "center", mask: "numeric-int" },
				{ header: "기타", name: "statusO", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM 1", name: "status1", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM 2", name: "status2", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM 3", name: "status3", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM 4", name: "status4", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM 5", name: "status5", width: 55, align: "center", mask: "numeric-int" },
				{ header: "PM 6", name: "status6", width: 55, align: "center", mask: "numeric-int" },
				{ header: "기타", name: "status7", width: 55, align: "center", mask: "numeric-int" },
				{ header: "DOWN사유", name: "rmk", width: 400, align: "left" },
				{ name: "issue_noA", hidden: true },
				{ name: "issue_noB", hidden: true },
				{ name: "issue_noC", hidden: true },
				{ name: "issue_noO", hidden: true },
				{ name: "issue_no1", hidden: true },
				{ name: "issue_no2", hidden: true },
				{ name: "issue_no3", hidden: true },
				{ name: "issue_no4", hidden: true },
				{ name: "issue_no5", hidden: true },
				{ name: "issue_no6", hidden: true },
				{ name: "issue_no7", hidden: true },
				{ name: "issue_no", hidden: true },
                { name: "color", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //----------
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = { target: [ { type: "GRID", id: "grdData_현황", offset: 8 } ] };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================
        gw_com_module.informSize();

        gw_job_process.procedure();

    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
        //var args = { targetid: "frmOption", element: "출력", event: "click", handler: click_frmOption_출력 };
        //gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        
        //==== Grid Events : Main
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Event Handler.
        function click_lyrMenu_조회() {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_출력() { processExport(); }
        //----------
        function click_frmOption_취소(ui) { closeOption({}); }
        //----------
        function rowdblclick_grdData_현황(ui) {

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = ui.element;
            
            if (v_global.event.element == "statusA" && gw_com_api.getValue("grdData_현황", "selected", "issue_noA", true) > " ") {
                var SelectedIssueNo = "issue_noA";
            }
            else if (v_global.event.element == "statusB" && gw_com_api.getValue("grdData_현황", "selected", "issue_noB", true) > " ") {
                var SelectedIssueNo = "issue_noB";
            }
            else if (v_global.event.element == "statusC" && gw_com_api.getValue("grdData_현황", "selected", "issue_noC", true) > " ") {
                var SelectedIssueNo = "issue_noC";
            }
            else if (v_global.event.element == "statusO" && gw_com_api.getValue("grdData_현황", "selected", "issue_noO", true) > " ") {
                var SelectedIssueNo = "issue_noO";
            }
            else if (v_global.event.element == "status1" && gw_com_api.getValue("grdData_현황", "selected", "issue_no1", true) > " ") {
                var SelectedIssueNo = "issue_no1";
            }
            else if (v_global.event.element == "status2" && gw_com_api.getValue("grdData_현황", "selected", "issue_no2", true) > " ") {
                var SelectedIssueNo = "issue_no2";
            }
            else if (v_global.event.element == "status3" && gw_com_api.getValue("grdData_현황", "selected", "issue_no3", true) > " ") {
                var SelectedIssueNo = "issue_no3";
            }
            else if (v_global.event.element == "status4" && gw_com_api.getValue("grdData_현황", "selected", "issue_no4", true) > " ") {
                var SelectedIssueNo = "issue_no4";
            }
            else if (v_global.event.element == "status5" && gw_com_api.getValue("grdData_현황", "selected", "issue_no5", true) > " ") {
                var SelectedIssueNo = "issue_no5";
            }
            else if (v_global.event.element == "status6" && gw_com_api.getValue("grdData_현황", "selected", "issue_no6", true) > " ") {
                var SelectedIssueNo = "issue_no6";
            }
            else if (v_global.event.element == "status7" && gw_com_api.getValue("grdData_현황", "selected", "issue_no7", true) > " ") {
                var SelectedIssueNo = "issue_no7";
            }
            else {
                var SelectedIssueNo = "issue_no";
            }

            if (gw_com_api.getValue("grdData_현황", "selected", SelectedIssueNo, true) > " ") {
                var args = { type: "PAGE", page: "DLG_ISSUE", title: "문제 상세 정보"
                	, width: 1100, height: 540, scroll: true, open: true, control: true };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_ISSUE",
                        param: { ID: gw_com_api.v_Stream.msg_infoAS,
                            data: {
                                issue_no: gw_com_api.getValue("grdData_현황", "selected", SelectedIssueNo, true)
                            }
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
        }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "prod_subtp", "TWIN");
        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

	// Chamber 구분에 따라 표시 컬럼 변경 : 군별측정 Data
    if (gw_com_api.getValue("frmOption", 1, "prod_subtp") == "TWIN"){
        gw_com_api.hideCols("grdData_현황", [ "status1", "status2", "status3", "status4", "status5", "status6", "status7" ]);
        gw_com_api.showCols("grdData_현황", [ "statusA", "statusB", "statusC", "statusO" ]);
    }
    else{
        gw_com_api.showCols("grdData_현황", [ "status1", "status2", "status3", "status4", "status5", "status6", "status7" ]);
        gw_com_api.hideCols("grdData_현황", [ "statusA", "statusB", "statusC", "statusO" ]);
    }
    gw_com_module.objResize({ target: [{ type: "GRID", id: "grdData_현황", offset: 8 }] });

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "prod_type4", argument: "arg_prod_type4" },
				{ name: "prod_type5", argument: "arg_prod_type5" },
				{ name: "prod_subtp", argument: "arg_prod_subtp" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept1", argument: "arg_cust_dept1" },
				{ name: "cust_dept2", argument: "arg_cust_dept2" },
				{ name: "cust_dept3", argument: "arg_cust_dept3" },
				{ name: "cust_dept4", argument: "arg_cust_dept4" },
				{ name: "cust_dept5", argument: "arg_cust_dept5" },
				{ name: "cust_dept6", argument: "arg_cust_dept6" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "run_yn", argument: "arg_run_yn" }
			],
            remark: [
//	            { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
//		        { element: [{ name: "prod_group"}] },
//		        { element: [{ name: "prod_type1"}] },
//		        { element: [{ name: "cust_cd"}] },
//                { infix: ",",
//                    element: [
//	                    { name: "cust_dept1" }, { name: "cust_dept2" }, { name: "cust_dept3" },
//                        { name: "cust_dept4" }, { name: "cust_dept5" }, { name: "cust_dept6" }
//		            ]
//                },
//		        { element: [{ name: "cust_prod_nm"}] },
		        { element: [{ name: "prod_subtp"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true, focus: true }
		],
        key: param.key
    };

    gw_com_module.objRetrieve(args);

}

//----------
function processExport() {

    //gw_com_api.messageBox([ { text: "개발 테스트 중 입니다." } ]);
    //return false;
    
    var args = {
    	//url: "xx.aspx/Print",	//실행 ASPX Procedure
    	//page: "xx" //".aspx/Print" 가 있는 Page
        source: { type: "FORM", id: "frmOption", hide: true, json: true,
            element: [	//cs : DATA.getArgument("arg_est_key") 
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "prod_type4", argument: "arg_prod_type4" },
				{ name: "prod_type5", argument: "arg_prod_type5" },
				{ name: "prod_subtp", argument: "arg_prod_subtp" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept1", argument: "arg_cust_dept1" },
				{ name: "cust_dept2", argument: "arg_cust_dept2" },
				{ name: "cust_dept3", argument: "arg_cust_dept3" },
				{ name: "cust_dept4", argument: "arg_cust_dept4" },
				{ name: "cust_dept5", argument: "arg_cust_dept5" },
				{ name: "cust_dept6", argument: "arg_cust_dept6" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "run_yn", argument: "arg_run_yn" }
            ]
        },
        option: [	//cs : DATA.getOption("PRINT")
            { name: "PRINT", value: "XLS" },	//확장자
            { name: "PAGE", value: gw_com_module.v_Current.window }	//Report 폴더
        ],
        target: { type: "FILE", id: "lyrDown" },
        handler: { success: successExport }
    };
    gw_com_module.objExport(args);

}

function successExport(response, param) {

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
//----------
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
                var args = { to: { type: "POPUP", page: param.from.page } };
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