
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
        if (gw_com_module.v_Current.menu_args=="")
        	v_global.logic.issue_part = "AS" ;
        else
        	v_global.logic.issue_part = gw_com_module.v_Current.menu_args ;
        	
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM11" } ]  },
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM06" } ] },
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "ISCM25" } ] },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline"},
				{ type: "PAGE", name: "PROCESS", query: "dddw_custproc" },
                { type: "INLINE", name: "Warranty", data: [{ title: "IN", value: "IN" }, { title: "OUT", value: "OUT" }] },
				{ type: "PAGE", name: "모듈", query: "DDDW_CM_CODED_A", param: [ { argument: "arg_hcode", value: "IEHM05" } ] },
				{ type: "PAGE", name: "진행상태", query: "DDDW_ISSUE_STAT" },
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
                    { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "발생일자 :" }, style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "issue_type", label: { title: "발생구분 :" },
                                editable: { type: "select",  data: { memory: "발생구분", unshift: [ { title: "전체", value: "" } ] }  }
                            },
                            {
                                name: "wrnt_io", label: { title: "Warranty :" },
                                editable: { type: "select", data: { memory: "Warranty", unshift: [{ title: "전체", value: "%"}] } }
                            },
                            {
                                name: "issue_stat", label: { title: "진행상태 :" },
                                editable: { type: "select", data: { memory: "진행상태", unshift: [ { title: "전체", value: "%" } ] } }
                            }
				        ]
				    },
                    {
                        element: [
                            {
                                name: "prod_group", label: { title: "제품군 :" },
                                editable: { type: "select", data: { memory: "제품군", unshift: [ { title: "전체", value: "%" } ] } }
                            },
				            {
				                name: "prod_type1", label: { title: "제품유형 :" },
				                editable: { type: "select", data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] } }
				            },
				            {
				                name: "prod_type2",
				                editable: { type: "select", data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] } }
				            },
				            {
				                name: "prod_type3",
				                editable: { type: "select", data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] } }
				            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "cust_cd", label: { title: "고객사 :" },
				                editable: {
				                    type: "select",
				                    data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
				                    change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
				                }
				            },
				            {
				                name: "cust_dept", label: { title: "LINE :" },
				                editable: {
				                    type: "select",
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }
				                }
				            },
                            {
                                name: "cust_proc", label: { title: "Process :" },
                                editable: { type: "select", data: { memory: "PROCESS", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cust_prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            },
                            {
                                name: "prod_sub", label: { title: "MODULE :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "모듈", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            { name: "proj_no", label: { title: "Project No. :" }, hidden: true },
                            { name: "status_tp1", hidden: true },
                            { name: "status_tp2", hidden: true },
                            { name: "part_tp1", hidden: true },
                            { name: "part_tp2", hidden: true },
                            { name: "reason_tp1", hidden: true },
                            { name: "reason_tp2", hidden: true },
                            { name: "status_nm1", label: { title: "현상분류 :" }, hidden: true },
                            { name: "status_nm2", label: { title: "현상구분 :" }, hidden: true },
                            { name: "part_nm1", label: { title: "부위분류 :" }, hidden: true },
                            { name: "part_nm2", label: { title: "부위구분 :" }, hidden: true },
                            { name: "reason_nm1", label: { title: "원인분류 :" }, hidden: true },
                            { name: "reason_nm2", label: { title: "원인구분 :" }, hidden: true },
                            { name: "part_model", label: { title: "부품군 :" }, hidden: true },
                            { name: "part_rev", label: { title: "Part Rev. :" }, hidden: true },
                            { name: "pstat", label: { title: "진행 상태 :" }, hidden: true },
                            { name: "reason_yn", label: { title: "참원인구분 :" }, hidden: true }
                        ]
                    },
                    { align: "right", element: [
                            { name: "issue_no", label: { title: "발생번호 :" },
                                editable: { type: "text", size: 12, maxlength: 20 }
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
        //=====================================================================================
        var args = { targetid: "grdData_현황", query: "EHM_2030_M_4", title: "문제 발생 현황",
            height: 442, show: true, selectable: true, key: true, dynamic: true, number: true,
            element: [
				{ header: "관리번호", name: "issue_no", width: 90, align: "center" },
				{ header: "발생일자", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
				{ header: "고객사", name: "cust_nm", width: 80, align: "center" },
				{ header: "Line", name: "cust_dept", width: 80, align: "center" },
				{ header: "Process", name: "cust_proc", width: 80, align: "center" },
				{ header: "고객설비명", name: "cust_prod_nm", width: 120, align: "center" },
				{ header: "제품군", name: "prod_group", width: 60, align: "center" },
				{ header: "제품유형", name: "prod_type1", width: 100, align: "center" },
				{ header: "발생구분", name: "issue_type", width: 100, align: "center" },
				{ header: "진행상태", name: "issue_stat", width: 70, align: "center" },
				{ header: "발생Module", name: "prod_sub", width: 60, align: "center" },
				{ header: "Warranty", name: "wrnt_io", width: 60, align: "center"
				}/*,
				{ header: "상태", name: "pstat", width: 50, align: "center" },
				{ header: "조치", name: "wstat", width: 50, align: "center"
				}*/,
				{ header: "발생부위", name: "part_tp1", width: 130, align: "center" },
				{ header: "발생부위상세", name: "part_tp2", width: 130, align: "center" },
				{ header: "부품 발생현상", name: "part_status1", width: 130, align: "center" },
				{ header: "발생현상", name: "status_tp1", width: 130, align: "center" },
				{ header: "발생현상상세", name: "status_tp2", width: 130, align: "center" },
				{ header: "발생원인", name: "reason_tp1", width: 130, align: "center" },
				{ header: "발생원인상세", name: "reason_tp2", width: 130, align: "center" },
				{ header: "교체부품명", name: "part_nm", width: 200, align: "left" },
				{ header: "교체건수", name: "part_cnt", width: 60, align: "center" },
				{ header: "교체수량", name: "part_qty", width: 60, align: "center"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [ { type: "GRID", id: "grdData_현황", offset: 8 } ]
        };
        gw_com_module.objResize(args);

        gw_com_module.informSize();
        gw_job_process.procedure();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //----------
        var args = { targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

            if (v_global.process.param != "")
                processRetrieve({});
            else {
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
        //----------
        function rowdblclick_grdData_현황(ui) {

            var args = {
                type: "PAGE", page: "DLG_ISSUE", title: "문제 상세 정보",
                width: 1100, height: 500, scroll: true, open: true, control: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "DLG_ISSUE",
                    param: { ID: gw_com_api.v_Stream.msg_infoAS,
                        data: {
                            issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        if (v_global.process.param != "") {
            closeOption({});
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
            gw_com_api.setValue("frmOption", 1, "issue_stat", gw_com_api.getPageParameter("issue_stat"));
            gw_com_api.setValue("frmOption", 1, "issue_type", gw_com_api.getPageParameter("issue_stat"));
            gw_com_api.setValue("frmOption", 1, "prod_group", gw_com_api.getPageParameter("prod_group"));
            gw_com_api.setValue("frmOption", 1, "prod_type1", gw_com_api.getPageParameter("prod_type1"));
            gw_com_api.setValue("frmOption", 1, "prod_type2", gw_com_api.getPageParameter("prod_type2"));
            gw_com_api.setValue("frmOption", 1, "prod_type3", gw_com_api.getPageParameter("prod_type3"));
            gw_com_api.setValue("frmOption", 1, "wrnt_io", gw_com_api.getPageParameter("wrnt_io"));
            gw_com_api.setValue("frmOption", 1, "cust_cd", gw_com_api.getPageParameter("cust_cd"));
            gw_com_api.setValue("frmOption", 1, "cust_dept", gw_com_api.getPageParameter("cust_dept"));
            gw_com_api.setValue("frmOption", 1, "cust_proc", gw_com_api.getPageParameter("cust_proc"));
            gw_com_api.setValue("frmOption", 1, "cust_prod_nm", gw_com_api.getPageParameter("cust_prod_nm"));
            gw_com_api.setValue("frmOption", 1, "proj_no", gw_com_api.getPageParameter("proj_no"));
            gw_com_api.setValue("frmOption", 1, "prod_sub", gw_com_api.getPageParameter("prod_sub"));
            gw_com_api.setValue("frmOption", 1, "status_tp1", gw_com_api.getPageParameter("status_tp1"));
            gw_com_api.setValue("frmOption", 1, "status_tp2", gw_com_api.getPageParameter("status_tp2"));
            gw_com_api.setValue("frmOption", 1, "part_tp1", gw_com_api.getPageParameter("part_tp1"));
            gw_com_api.setValue("frmOption", 1, "part_tp2", gw_com_api.getPageParameter("part_tp2"));
            gw_com_api.setValue("frmOption", 1, "reason_tp1", gw_com_api.getPageParameter("reason_tp1"));
            gw_com_api.setValue("frmOption", 1, "reason_tp2", gw_com_api.getPageParameter("reason_tp2"));
            gw_com_api.setValue("frmOption", 1, "status_nm1", gw_com_api.getPageParameter("status_nm1"));
            gw_com_api.setValue("frmOption", 1, "status_nm2", gw_com_api.getPageParameter("status_nm2"));
            gw_com_api.setValue("frmOption", 1, "pstat", gw_com_api.getPageParameter("pstat"));
            gw_com_api.setValue("frmOption", 1, "part_nm1", gw_com_api.getPageParameter("part_nm1"));
            gw_com_api.setValue("frmOption", 1, "part_nm2", gw_com_api.getPageParameter("part_nm2"));
            gw_com_api.setValue("frmOption", 1, "reason_nm1", gw_com_api.getPageParameter("reason_nm1"));
            gw_com_api.setValue("frmOption", 1, "reason_nm2", gw_com_api.getPageParameter("reason_nm2"));
            gw_com_api.setValue("frmOption", 1, "reason_yn", gw_com_api.getPageParameter("reason_yn"));
            gw_com_api.setValue("frmOption", 1, "part_model", gw_com_api.getPageParameter("part_model"));
            gw_com_api.setValue("frmOption", 1, "part_rev", gw_com_api.getPageParameter("part_rev"));
            gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_api.getPageParameter("dept_area"));
        }
        else {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        }
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "")
            processRetrieve({});

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

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "issue_no", argument: "arg_issue_no" },
				{ name: "issue_stat", argument: "arg_issue_stat" },
				{ name: "issue_type", argument: "arg_issue_type" },
				{ name: "wrnt_io", argument: "arg_wrnt_io" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_proc", argument: "arg_cust_proc" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "proj_no", argument: "arg_proj_no" },
				{ name: "prod_sub", argument: "arg_prod_sub" },
				{ name: "status_tp1", argument: "arg_status_tp1" },
				{ name: "status_tp2", argument: "arg_status_tp2" },
				{ name: "part_tp1", argument: "arg_part_tp1" },
				{ name: "part_tp2", argument: "arg_part_tp2" },
				{ name: "reason_tp1", argument: "arg_reason_tp1" },
				{ name: "reason_tp2", argument: "arg_reason_tp2" },
				{ name: "part_model", argument: "arg_part_model" },
				{ name: "part_rev", argument: "arg_part_rev" },
				{ name: "reason_yn", argument: "arg_reason_yn" },
                { name: "pstat", argument: "arg_pstat" },
                { name: "dept_area", argument: "arg_dept_area" }
			],
			argument: [
                { name: "arg_issue_part", value: v_global.logic.issue_part }
			]
			/*,
            remark: [
	            {
	                infix: "~",
	                element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
	            },
		        { element: [{ name: "prod_group"}] },
		        { element: [{ name: "prod_type1"}] },
		        { element: [{ name: "cust_cd" }] },
		        { element: [{ name: "cust_dept" }] },
		        { element: [{ name: "cust_proc"}] },
		        { element: [{ name: "cust_prod_nm" }] },
		        { element: [{ name: "proj_no"}] },
		        { element: [{ name: "prod_sub"}] },
		        { element: [{ name: "status_nm1"}] },
		        { element: [{ name: "status_nm2"}] },
		        { element: [{ name: "part_nm1"}] },
		        { element: [{ name: "part_nm2"}] },
		        { element: [{ name: "reason_nm1"}] },
		        { element: [{ name: "reason_nm2"}] },
		        { element: [{ name: "issue_stat"}]
		        }
		    ]*/
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true, focus: true,
                query: (v_global.process.param != "") ? "EHM_2030_M_4" : "EHM_2030_M_4"
            }
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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
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