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
                {
                    type: "PAGE", name: "부서", query: "dddw_dept"
                }/*,
                {
                    type: "PAGE", name: "사원", query: "dddw_emp"
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
        var args = {
            targetid: "lyrMenu",
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
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true,
            border: true,
            show: true,
            editable: {
                focus: "ymd_fr",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                        { name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select" , data: { memory: "DEPT_AREA_FIND" } }
                        },
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "제안일자 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
				            {
				                name: "ymd_to",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
                            {
				                name: "ecr_title",
				                label: {
				                    title: "제안명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 17,
				                    maxlength: 50
				                }
				            },
				            {
				                name: "ecr_emp",
				                label: {
				                    title: "제안자 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 20
				                }
				            }
				        ]
                    },
                    {
                        align: "right",
                        element: [
                            {
                                name: "실행",
                                value: "실행",
                                act: true,
                                format: {
                                    type: "button"
                                }
                            },
				            {
				                name: "취소",
				                value: "취소",
				                format: {
				                    type: "button",
				                    icon: "닫기"
				                }
				            }
				        ]
                    }
			    ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_현황", query: "w_find_ecrcip_M_1", title: "ECR(CIP) 현황",
            height: 300,
            show: true,
            key: true,
            element: [
                {
                    header: "ECR No.",
                    name: "ecr_no",
                    width: 90,
                    align: "center"
                },
				{
				    header: "개선제안명",
				    name: "ecr_title",
				    width: 300,
				    align: "left"
				},
				{
				    header: "조치요구시점",
				    name: "act_time_text",
				    width: 100,
				    align: "center"
				},
				{
				    header: "CRM부서",
				    name: "rqst_dept_nm",
				    width: 80,
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
				    header: "진행상태",
				    name: "pstat_text",
				    width: 60,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "제안일자",
				    name: "ecr_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "제안부서",
				    name: "ecr_dept_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "제안자",
				    name: "ecr_emp_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "접수일자",
				    name: "rcvd_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "접수부서",
				    name: "rcvd_dept_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "접수자",
				    name: "rcvd_emp_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "CIP시행",
				    name: "cip_yn",
				    width: 50,
				    align: "center"
				},
				{
				    header: "CIP No.",
				    name: "cip_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "CIP시작일",
				    name: "str_dt",
				    width: 80,
				    align: "center",
                    mask: "date-ymd"
				},
				{
				    header: "CIP완료일",
				    name: "end_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    name: "act_region1",
				    hidden: true
				},
				{
				    name: "act_region2",
				    hidden: true
				},
				{
				    name: "act_region3",
				    hidden: true
				},
				{
				    name: "act_module1",
				    hidden: true
				},
				{
				    name: "act_module2",
				    hidden: true
				},
				{
				    name: "act_module3",
				    hidden: true
				},
				{
				    name: "act_module1_sel",
				    hidden: true
				},
				{
				    name: "act_module2_sel",
				    hidden: true
				},
				{
				    name: "act_module3_sel",
				    hidden: true
				},
				{
				    name: "act_module1_etc",
				    hidden: true
				},
				{
				    name: "act_module2_etc",
				    hidden: true
				},
				{
				    name: "act_module3_etc",
				    hidden: true
				},
				{
				    name: "mp_class1",
				    hidden: true
				},
				{
				    name: "mp_class2",
				    hidden: true
				},
				{
				    name: "mp_class3",
				    hidden: true
				},
				{
				    name: "mp_class1_sel",
				    hidden: true
				},
				{
				    name: "mp_class2_sel",
				    hidden: true
				},
				{
				    name: "mp_class3_sel",
				    hidden: true
				},
				{
				    name: "mp_class1_etc",
				    hidden: true
				},
				{
				    name: "mp_class2_etc",
				    hidden: true
				},
				{
				    name: "mp_class3_etc",
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
        //----------
        function rowdblclick_grdData_현황(ui) {

            informResult({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
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
processRetrieve = function (param) {

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
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "dept_area", argument: "arg_dept_area" },
				{
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				},
				{
				    name: "ecr_title",
				    argument: "arg_ecr_title"
				},
				{
				    name: "ecr_emp",
				    argument: "arg_ecr_emp"
				}
			],
            remark: [
		        { element: [{ name: "dept_area"}] },
		        {
		            infix: "~",
		            element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
		        },
		        {
		            element: [{ name: "ecr_title"}]
		        },
		        {
		            element: [{ name: "ecr_emp"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true,
			    focus: true
			}
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
//----------
function informResult(param) {

    if (v_global.logic.eccb) {
        var args = {
            ID: gw_com_api.v_Stream.msg_selectedforECCB,
            data: {
                root_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_no"),
                root_title: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_title"),
                root_dt: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_dt"),
                root_dept: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_dept_nm"),
                root_emp: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_emp_nm"),
                cip_yn: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "cip_yn"),
                pstat: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "pstat_text")
            }
        };
        gw_com_module.streamInterface(args);
    }
    else if (v_global.logic.eco) {
        var args = {
            ID: gw_com_api.v_Stream.msg_selectedforECO,
            data: {
                ecr_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_no"),
                ecr_title: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_title"),
                act_region1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region1"),
                act_region2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region2"),
                act_region3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region3"),
                act_module1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1"),
                act_module2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2"),
                act_module3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3"),
                act_module1_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1_sel"),
                act_module2_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2_sel"),
                act_module3_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3_sel"),
                act_module2_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2_etc"),
                act_module1_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1_etc"),
                act_module3_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3_etc"),
                mp_class1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1"),
                mp_class2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2"),
                mp_class3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3"),
                mp_class1_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1_sel"),
                mp_class2_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2_sel"),
                mp_class3_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3_sel"),
                mp_class2_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2_etc"),
                mp_class1_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1_etc"),
                mp_class3_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3_etc")
            }
        };
        gw_com_module.streamInterface(args);
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
        case gw_com_api.v_Stream.msg_selectforECCB:
        case gw_com_api.v_Stream.msg_selectforECO:
            {
                if (param.ID == gw_com_api.v_Stream.msg_selectforECCB)
                    v_global.logic.eccb = true;
                else if (param.ID == gw_com_api.v_Stream.msg_selectforECO)
                    v_global.logic.eco = true;
                var retrieve = false;
                if (param.data != undefined) {
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "ymd_fr");
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