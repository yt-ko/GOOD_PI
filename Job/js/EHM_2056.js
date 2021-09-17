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
                    data: [ { title: "TWIN", value: "TWIN" }, { title: "SINGLE", value: "SINGLE" }  ]
                },
				{ type: "PAGE", name: "보고서", query: "DDDW_CM_REPORT", param: [{ argument: "arg_rpt_id", value: "RPT_30%" }] },
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				}
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
                    { name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" },
				{ name: "메일", value: "메일전송", icon: "추가" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd", validate: true },
            content: { row: [
                    { element: [
				            { name: "ymd", label: { title: "기준일자 :" }, mask: "date-ymd",
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
                                    data: { memory: "제품군", unshift: [{ title: "전체", value: "%"}] }
                                }
                            },
				            { name: "prod_subtp", label: { title: "CH유형 :" },
				                editable: { type: "select",
				                    data: { memory: "챔버구성", value: "TWIN" }
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
                                    data: { memory: "고객사", unshift: [{ title: "전체", value: "%"}] },
                                    change: [
					                    { name: "cust_dept1", memory: "LINE", key: ["cust_cd"] },
                                        { name: "cust_dept2", memory: "LINE", key: ["cust_cd"] },
                                        { name: "cust_dept3", memory: "LINE", key: ["cust_cd"] },
                                        { name: "cust_dept4", memory: "LINE", key: ["cust_cd"] },
                                        { name: "cust_dept5", memory: "LINE", key: ["cust_cd"] },
                                        { name: "cust_dept6", memory: "LINE", key: ["cust_cd"] }
				                    ]
                                }
                            },
                            { name: "cust_dept1", label: { title: "LINE :" }, style: { colfloat: "floating" },
                                editable: { type: "select",
                                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%"}], key: ["cust_cd"] }
                                }
                            },
				            { name: "cust_dept2",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%"}], key: ["cust_cd"] }
				                }
				            },
				            { name: "cust_dept3",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%"}], key: ["cust_cd"] }
				                }
				            },
				            { name: "cust_dept4",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%"}], key: ["cust_cd"] }
				                }
				            },
				            { name: "cust_dept5",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%"}], key: ["cust_cd"] }
				                }
				            },
				            { name: "cust_dept6",
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%"}], key: ["cust_cd"] }
				                }
				            }
                        ]
                    },
                    { align: "right", element: [
                            { name: "rpt_id", label: { title: "메일수신 :" }, align: "left",
                                editable: { type: "select", data: { memory: "보고서", unshift: [{ title: "-", value: ""}]} }
                            },
                            { name: "실행", value: "실행", act: true, format: { type: "button"} },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기"} }
				        ]
                    }
			    ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //grdData_현황
        var args = { targetid: "grdData_현황", query: "EHM_2056_M_2", title: "Daily Reprot",
            height: 442, show: true, selectable: true, key: true, dynamic: true, numbser: true,
            color: { row: true },
            element: [
                { header: "일자", name: "dt", width: 80, align: "center", hidden: true },
				{ header: "고객사", name: "cust_nm", width: 50, align: "center" },
				{ header: "LINE", name: "cust_dept", width: 80, align: "center" },
				{ header: "설비명", name: "cust_prod_nm", width: 120, align: "center" },
				{ header: "제품유형", name: "prod_type1", width: 100, align: "center" },
				{ header: "Process", name: "cust_proc", width: 80, align: "center" },
				{ header: "Warranty", name: "wrnt_io", width: 60, align: "center" },
				{ header: "PM A", name: "statusA", width: 55, align: "center" },
				{ header: "PM B", name: "statusB", width: 55, align: "center" },
				{ header: "PM C", name: "statusC", width: 55, align: "center" },
				{ header: "기타", name: "statusO", width: 55, align: "center" },
				{ header: "PM 1", name: "status1", width: 55, align: "center" },
				{ header: "PM 2", name: "status2", width: 55, align: "center" },
				{ header: "PM 3", name: "status3", width: 55, align: "center" },
				{ header: "PM 4", name: "status4", width: 55, align: "center" },
				{ header: "PM 5", name: "status5", width: 55, align: "center" },
				{ header: "PM 6", name: "status6", width: 55, align: "center" },
				{ header: "기타", name: "status7", width: 55, align: "center" },
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
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "메일", event: "click", handler: click_lyrMenu_메일 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {
            var args = { target: [{ id: "frmOption", focus: true}] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_닫기(ui) {
            processClose({});
        }
        //----------
        function click_lyrMenu_메일(ui) {
            if (gw_com_api.getValue("frmOption", 1, "rpt_id") == "") {
                gw_com_api.messageBox([
                    { text: "메일 수신자가 지정되지 않았습니다." }
                ]);
                return false;
            }
            
            gw_com_api.messageBox([
                { text: "Daily Report 이메일을 발송합니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { plan: true });
        }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
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
                var args = {
                    type: "PAGE", page: "DLG_ISSUE", title: "문제 상세 정보"
                		, width: 1100, height: 540, scroll: true, open: true, control: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "DLG_ISSUE",
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
        gw_com_api.setValue("frmOption", 1, "ymd", gw_com_api.getDate("", { day: -1 }));
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
				{ name: "ymd", argument: "arg_ymd" },
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
//	            { element: [{ name: "ymd"}] },
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
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function processInform(param) {
    var args = {
        url: (param.plan) ? "COM" : gw_com_module.v_Current.window + ".aspx/" + "Mail",
        procedure: "PROC_MAIL_EHM_DOWMTIME", nomessage: true,
        argument: [
            { name: "ymd", value: gw_com_api.getValue("frmOption", 1, "ymd") }
        ],
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" },
            { name: "ymd", value: gw_com_api.getValue("frmOption", 1, "ymd"), type: "varchar" },
            { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area"), type: "varchar" },
            { name: "prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group"), type: "varchar" },
            { name: "prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1"), type: "varchar" },
            { name: "prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2"), type: "varchar" },
            { name: "prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3"), type: "varchar" },
            { name: "prod_type4", value: gw_com_api.getValue("frmOption", 1, "prod_type4"), type: "varchar" },
            { name: "prod_type5", value: gw_com_api.getValue("frmOption", 1, "prod_type5"), type: "varchar" },
            { name: "prod_subtp", value: gw_com_api.getValue("frmOption", 1, "prod_subtp"), type: "varchar" },
            { name: "cust_cd", value: gw_com_api.getValue("frmOption", 1, "cust_cd"), type: "varchar" },
            { name: "cust_dept1", value: gw_com_api.getValue("frmOption", 1, "cust_dept1"), type: "varchar" },
            { name: "cust_dept2", value: gw_com_api.getValue("frmOption", 1, "cust_dept2"), type: "varchar" },
            { name: "cust_dept3", value: gw_com_api.getValue("frmOption", 1, "cust_dept3"), type: "varchar" },
            { name: "cust_dept4", value: gw_com_api.getValue("frmOption", 1, "cust_dept4"), type: "varchar" },
            { name: "cust_dept5", value: gw_com_api.getValue("frmOption", 1, "cust_dept5"), type: "varchar" },
            { name: "cust_dept6", value: gw_com_api.getValue("frmOption", 1, "cust_dept6"), type: "varchar" },
            { name: "cust_prod_nm", value: gw_com_api.getValue("frmOption", 1, "cust_prod_nm"), type: "varchar" },
            { name: "run_yn", value: gw_com_api.getValue("frmOption", 1, "run_yn"), type: "varchar" },
            { name: "type", value: gw_com_api.getValue("frmOption", 1, "rpt_id"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: { success: successInform }
    };
    gw_com_module.callProcedure(args);
}
//----------
function successInform(response) {

    gw_com_api.messageBox([{ text: response.VALUE[1]}], 350);

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
                if (param.data.page != gw_com_api.getPageID()) {
                    //param.to = { type: "POPUP", page: param.data.page };
                    //gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmBatch:
                        { if (param.data.result == "YES") processInform(param.data.arg); }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); }
                        break;
                }
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