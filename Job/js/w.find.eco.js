//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        init: false,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
    data: null,
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { request: [
				{ type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }] },
                { type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [ { argument: "arg_hcode", value: "ECCB42" } ]
                },
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
                { type: "PAGE", name: "부서", query: "dddw_dept"
                }/*,
                { type: "PAGE", name: "사원", query: "dddw_emp"
                }*/
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = { targetid: "lyrMenu",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmOption_1", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                { element: [
                        { name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select" , data: { memory: "DEPT_AREA_FIND" } }
                        },
                        { name: "ymd_fr", label: { title: "진행기간 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 10 }
                        },
			            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
                        { name: "ecr_no", label: { title: "ECR No. :" },
                            editable: { type: "text", size: 15, maxlength: 20 }
                        }
			        ]
                },
                { element: [
                        { name: "eco_title", label: { title: "제목 :" },
                            editable: { type: "text", size: 20, maxlength: 50 }
                        },
                        { name: "prod_type", label: { title: "제품유형 :" },
                            editable: { type: "select", data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] } }
                        },
			            { name: "pstat", label: { title: "진행상태 :" }, style: { colfloat: "floating" },
			                editable: { type: "select" , data: { memory: "진행상태", unshift: [ { title: "전체", value: "%" } ] } }
			            }
			        ]
                },
                { element: [
                        { name: "ecr_dept", label: { title: "작성부서 :" },
                            editable: { type: "select", data: { memory: "부서", unshift: [ { title: "전체", value: "%" } ] } }
                        },
                        { name: "ecr_emp", label: { title: "작성자 :" }, style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 20 }
                        },
			            { name: "act_emp", label: { title: "담당자 :" },
			                editable: { type: "text", size: 7, maxlength: 20 }
			            },
			            { name: "complete_yn",  hidden: true },
			            { name: "ecr_title",  hidden: true }
			        ]
                },
                { align: "right",
                  element: [
                        { name: "실행", value: "실행", act: true, format: { type: "button" } },
                        { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
			        ]
	            }
		    ] }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "frmOption_2", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: false,
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                { element: [
                        { name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select" , data: { memory: "DEPT_AREA_FIND" } }
                        },
                        { name: "ymd_fr", label: { title: "진행기간 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 10 }
                        },
			            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
                        { name: "ecr_no", label: { title: "ECR No. :" },
                            editable: { type: "text", size: 15, maxlength: 20 }
                        }
			        ]
                },
                { element: [
                        { name: "eco_title", label: { title: "제목 :" },
                            editable: { type: "text", size: 20, maxlength: 50 }
                        },
                        { name: "prod_type", label: { title: "제품유형 :" },
                            editable: { type: "select", data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] } }
                        },
			            { name: "pstat",  hidden: true }
			        ]
                },
                { element: [
                        { name: "ecr_dept", label: { title: "작성부서 :" },
                            editable: { type: "select", data: { memory: "부서", unshift: [ { title: "전체", value: "%" } ] } }
                        },
                        { name: "ecr_emp", label: { title: "작성자 :" }, style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 20 }
                        },
			            { name: "act_emp", label: { title: "담당자 :" },
			                editable: { type: "text", size: 7, maxlength: 20 }
			            },
			            { name: "complete_yn",  hidden: true },
			            { name: "ecr_title",  hidden: true }
			        ]
                },
                { align: "right",
                  element: [
                        { name: "실행", value: "실행", act: true, format: { type: "button" } },
                        { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
			        ]
	            }
		    ] }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_현황", query: "w_find_eco_M_1", title: "ECO 현황",
            height: 300,
            show: true,
            key: true,
            element: [
				{
				    header: "ECO No.",
				    name: "eco_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "제목",
				    name: "eco_title",
				    width: 300,
				    align: "left"
				},
                {
                    header: "관련근거",
                    name: "ecr_no",
                    width: 90,
                    align: "center"
                },
				{
				    header: "개선제안명",
				    name: "ecr_title",
				    width: 300,
				    align: "left"
				}/*,
				{
				    header: "진행상태",
				    name: "pstat_text",
				    width: 80,
				    align: "center"
				}*/,
				{
				    header: "적용시점",
				    name: "act_time_text",
				    width: 100,
				    align: "center"
				},
				{
				    header: "적용영역",
				    name: "act_region",
				    width: 150,
				    align: "center"
				},
				{
				    header: "적용모듈",
				    name: "act_module",
				    width: 150,
				    align: "center"
				},
				{
				    header: "MP분류",
				    name: "mp_class",
				    width: 150,
				    align: "center"
				},
				{
				    header: "도면조치",
				    name: "dwg_proc_text",
				    width: 150,
				    align: "center"
				},
				{
				    header: "시작일",
				    name: "str_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "완료일",
				    name: "end_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "기안일",
				    name: "eco_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "기안부서",
				    name: "eco_dept_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "기안자",
				    name: "eco_emp_nm",
				    width: 70,
				    align: "center"
				}/*,
				{
				    header: "완료보고일",
				    name: "rpt_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "보고부서",
				    name: "rpt_dept_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "보고자",
				    name: "rpt_emp_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "승인상태",
				    name: "gw_astat_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "승인자",
				    name: "gw_aemp",
				    width: 70,
				    align: "center"
				},
				{
				    header: "승인일시",
				    name: "gw_adate",
				    width: 160,
				    align: "center"
				}*/,
				{
				    name: "act_amt_note",
				    hidden: true
				},
				{
				    name: "act_amt",
				    hidden: true
				},
				{
				    name: "pstat_text",
				    hidden: true
				},
				{
				    name: "ecr_dept_nm",
				    hidden: true
				},
				{
				    name: "cip_no",
				    hidden: true
				},
				{
				    name: "root_no",
				    hidden: true
				}
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
        //=====================================================================================
        //----------
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
            targetid: "frmOption_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
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
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
                    {
                        id: getOption({}),
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

            informResult({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption_2", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption_2", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function getOption(param) {

    switch (v_global.data.type) {
        case "close":
        case "complete":
            return "frmOption_2";
        default:
            return "frmOption_1";
    }

}
//----------
function setOption(param) {

    switch (v_global.data.type) {
        case "close":
            {
                gw_com_api.hide("frmOption_1");
                gw_com_api.show("frmOption_2");
                gw_com_api.setValue("frmOption_2", 1, "pstat", "완료");
                return false;
            }
            break;
        case "complete":
            {
                gw_com_api.hide("frmOption_1");
                gw_com_api.show("frmOption_2");
                gw_com_api.setValue("frmOption_2", 1, "pstat", "완료");
                gw_com_api.setValue("frmOption_2", 1, "complete_yn", "#");
                return false;
            }
            break;
        default:
            {
                gw_com_api.hide("frmOption_2");
                gw_com_api.show("frmOption_1");
            }
            break;
    }
    return false;

}
//----------
function processRetrieve(param) {

    var args = {
        target: [ { type: "FORM", id: getOption({}) } ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "FORM", id: getOption({}), hide: true,
            element: [
				{ name: "dept_area", argument: "arg_dept_area" },
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "ecr_no", argument: "arg_ecr_no" },
				{ name: "ecr_title", argument: "arg_ecr_title" },
				{ name: "eco_title", argument: "arg_eco_title" },
				{ name: "ecr_dept", argument: "arg_ecr_dept" },
				{ name: "ecr_emp", argument: "arg_ecr_emp" },
				{ name: "act_emp", argument: "arg_act_emp" },
				{ name: "prod_type", argument: "arg_prod_type" },
				{ name: "complete_yn", argument: "arg_complete_yn" },
				{ name: "pstat", argument: "arg_pstat" }
			],
            remark: [
		        { element: [{ name: "dept_area"}] },
	            { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "eco_title"}] },
		        { element: [{ name: "ecr_title"}] },
		        { element: [{ name: "ecr_no"}] },
		        { element: [{ name: "ecr_dept"}] },
		        { element: [{ name: "ecr_emp"}] },
		        { element: [{ name: "act_emp" }] },
		        { element: [{ name: "prod_type"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true, focus: true }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption_1");
    gw_com_api.hide("frmOption_2");

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
//----------
function informResult(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedECO,
        data: {
            eco_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "eco_no"),
            root_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "root_no"),
            ecr_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_no"),
            cip_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "cip_no"),
            eco_title: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "eco_title"),
            ecr_title: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_title"),
            ecr_dept_nm: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_dept_nm")
        }
    };
    gw_com_module.streamInterface(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectECO:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    v_global.data = param.data;
                    retrieve = setOption({});
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                else
                    gw_com_api.setFocus(getOption({}), 1, "ymd_fr");
            }
            break;
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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//