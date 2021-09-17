
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM11" } ] },
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "IEHM06" } ] },
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE", param: [ { argument: "arg_hcode", value: "ISCM25" } ] },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline"},
				{ type: "PAGE", name: "공정", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "IEHM03" } ] },
				{ type: "PAGE", name: "모듈", query: "DDDW_CM_CODED_A"
					, param: [ { argument: "arg_hcode", value: "IEHM05" } ] },
                { type: "INLINE", name: "Warranty",
                    data: [{ title: "IN", value: "IN" }, { title: "OUT", value: "OUT" }]
                },
                { type: "INLINE", name: "챔버구성",
                    data: [ { title: "SINGLE", value: "SINGLE" }, { title: "TWIN", value: "TWIN" } ]
                },
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
                    { element: [
				            { name: "ymd_fr", label: { title: "가동일자 :" },
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
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "issue_tp", label: { title: "DOWN 구분 :" },
                                editable: { type: "select", 
                                	data: { memory: "발생구분", unshift: [ { title: "전체", value: "" } ] } 
                                }
                            },
				            { name: "prod_subtp", label: { title: "CH유형 :" },
				                editable: { type: "select",
				                    data: { memory: "챔버구성", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
                            { name: "wrnt_io", label: { title: "Warranty :" },
                                editable: { type: "select",
                                    data: { memory: "Warranty", unshift: [{ title: "전체", value: ""}] }
                                }
                            }
				        ]
                    },
                    {
                        element: [
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
				            },
                            { name: "prod_sub", label: { title: "MODULE :" },
                                editable: { type: "select",
                                    data: { memory: "모듈", unshift: [{ title: "전체", value: ""}] }
                                }
                            }
				        ]
                    },
                     {
                         element: [
				            { name: "cust_cd", label: { title: "고객사 :" },
				                editable: { type: "select",
				                    data: { memory: "고객사", unshift: [ { title: "전체", value: "" } ] },
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
                    {
                        element: [
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
                    {
                        align: "right",
                        element: [
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
        var args = { targetid: "grdData_현황", query: "EHM_5210_M_1", title: "DOWN 내역",
            //caption: true,
            height: 417,
            show: true,
            selectable: true,
            dynamic: true,
            element: [
				{ header: "고객사", name: "cust_nm", width: 70, align: "center" },
				{ header: "LINE", name: "cust_dept_nm", width: 80, align: "center" },
				{ header: "Process", name: "cust_proc_nm", width: 100, align: "center" },
				{ header: "고객설비명", name: "cust_prod_nm", width: 120, align: "center" },
				{ header: "제품명", name: "prod_nm", width: 180, align: "center" },
				{ header: "DOWN일자", name: "issue_date", width: 100, align: "center", mask: "date-ymd" },
				{ header: "DOWN시간", name: "down_hours", width: 100, align: "center" },
				{ header: "DOWN구분", name: "issue_tp_nm", width: 100, align: "center" },
				{ header: "DOWN모듈", name: "prod_sub", width: 80, align: "center" },
				{ header: "DOWN사유", name: "rmk", width: 300, align: "center" },
				{ name: "issue_no", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				}
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
        var args = {
            targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
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
        //----------
        function rowdblclick_grdData_현황(ui) {

            var args = {
                type: "PAGE",
                page: "w_find_as",
                title: "A/S 상세 정보",
                width: 1100,
                height: 500,
                scroll: true,
                open: true, control: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_as",
                    param: {
                        ID: gw_com_api.v_Stream.msg_infoAS,
                        data: {
                            issue_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true)
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
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
            gw_com_api.setValue("frmOption", 1, "prod_group", gw_com_api.getPageParameter("prod_group"));
            gw_com_api.setValue("frmOption", 1, "prod_type1", gw_com_api.getPageParameter("prod_type"));
            gw_com_api.setValue("frmOption", 1, "cust_cd", gw_com_api.getPageParameter("cust_cd"));
            gw_com_api.setValue("frmOption", 1, "cust_dept1", gw_com_api.getPageParameter("cust_dept"));
            gw_com_api.setValue("frmOption", 1, "cust_proc1", gw_com_api.getPageParameter("cust_proc"));
            gw_com_api.setValue("frmOption", 1, "cust_prod_nm", gw_com_api.getPageParameter("cust_prod_nm"));
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
				{ name: "dept_area", argument: "arg_dept_area" },
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
				{ name: "cust_proc1", argument: "arg_cust_proc1" },
				{ name: "cust_proc2", argument: "arg_cust_proc2" },
				{ name: "cust_proc3", argument: "arg_cust_proc3" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "issue_tp", argument: "arg_issue_tp" },
				{ name: "prod_sub", argument: "arg_prod_sub" }
			],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "cust_cd" }] },
		        { element: [{ name: "cust_dept1" }] },
		        { element: [{ name: "cust_prod_nm" }] },
		        { element: [{ name: "prod_group" }] },
		        { element: [{ name: "prod_type1" }] },
		        { element: [{ name: "issue_tp" }] },
		        { element: [{ name: "prod_sub" }] }
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
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_as":
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