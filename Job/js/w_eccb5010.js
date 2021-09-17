
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
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
        start();

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
				    name: "선정",
				    value: "대상 선정",
				    icon: "추가"
				},
				{
				    name: "해제",
				    value: "대상 취소",
				    icon: "삭제"
				}/*,
				{
				    name: "저장",
				    value: "저장"
				}*/,
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption",
            type: "FREE",
            title: "평가 정보",
            trans: true,
            border: true,
            //margin: 100,
            editable: {
                focus: "emp_no",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "evl_emp_nm",
                                label: {
                                    title: "평가자 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10,
                                    readonly: true,
                                    validate: {
                                        rule: "required",
                                        message: "평가자"
                                    }
                                }
                            },
                            {
                                name: "evl_str_dt",
                                label: {
                                    title: "시작일 :"
                                },
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10
                                }
                            },
                            {
                                name: "evl_end_dt",
                                label: {
                                    title: "완료일 :"
                                },
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10
                                }
                            },
                            {
                                name: "evl_emp",
                                hidden: true
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
        var args = {
            targetid: "grdData_평가",
            query: "w_eccb5010_M_1",
            title: "평가 대상 현황",
            height: 442,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "evl_yn",
                validate: true
            },
            element: [
                {
                    header: "선택",
                    name: "check",
                    width: 40,
                    align: "center",
                    display: true,
                    format: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    },
                    editable: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    }
                },
				{
				    header: "ECO No.",
				    name: "eco_no",
				    width: 90,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
                {
                    header: "관련근거",
                    name: "ecr_no",
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
				    header: "완료보고일",
				    name: "rpt_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				}/*,
				{
				    header: "보고일자",
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
				}*/,
				{
				    header: "평가자",
				    name: "evl_emp_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "평가시작일",
				    name: "evl_str_dt",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "평가완료일",
				    name: "evl_end_dt",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "evl_yn",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "evl_emp",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
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
				    id: "grdData_평가",
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
            element: "선정",
            event: "click",
            handler: click_lyrMenu_선정
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "해제",
            event: "click",
            handler: click_lyrMenu_해제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_저장
        };
        //gw_com_module.eventBind(args);
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
            targetid: "frmOption",
            event: "itemdblclick",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            event: "itemkeyenter",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_평가",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_평가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_평가",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_평가
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_선정(ui) {

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
        function click_lyrMenu_해제(ui) {

            closeOption({});

            var select = false;
            var ids = gw_com_api.getRowIDs("grdData_평가");
            $.each(ids, function () {
                if (gw_com_api.getValue("grdData_평가", this, "check", true) == "1") {
                    select = true;
                    gw_com_api.setValue("grdData_평가", this, "evl_yn", "0", true);
                    gw_com_api.setValue("grdData_평가", this, "evl_emp", "", true);
                    //gw_com_api.setValue("grdData_평가", this, "evl_emp_nm", "", true);
                    gw_com_api.setValue("grdData_평가", this, "evl_str_dt", "", true);
                    gw_com_api.setValue("grdData_평가", this, "evl_end_dt", "", true);
                }
            });
            if (select)
                processSave({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_frmOption_실행(ui) {

            closeOption({});

            var evl_emp = gw_com_api.getValue("frmOption", 1, "evl_emp");
            var evl_emp_nm = gw_com_api.getValue("frmOption", 1, "evl_emp_nm");
            var evl_str_dt = gw_com_api.getValue("frmOption", 1, "evl_str_dt");
            var evl_end_dt = gw_com_api.getValue("frmOption", 1, "evl_end_dt");
            var select = false;
            var ids = gw_com_api.getRowIDs("grdData_평가");
            $.each(ids, function () {
                if (gw_com_api.getValue("grdData_평가", this, "check", true) == "1") {
                    select = true;
                    gw_com_api.setValue("grdData_평가", this, "evl_yn", "1", true);
                    gw_com_api.setValue("grdData_평가", this, "evl_emp", evl_emp, true);
                    //gw_com_api.setValue("grdData_평가", this, "evl_emp_nm", evl_emp_nm, true);
                    gw_com_api.setValue("grdData_평가", this, "evl_str_dt", evl_str_dt, true);
                    gw_com_api.setValue("grdData_평가", this, "evl_end_dt", evl_end_dt, true);
                }
            });
            if (select)
                processSave({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "evl_emp_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_emp_scm",
                            title: "사원 검색",
                            width: 600,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_emp_scm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEmployee_SCM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function itemdblclick_grdData_평가(ui) {

            switch (ui.element) {
                case "evl_emp_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_emp_scm",
                            title: "사원 검색",
                            width: 600,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_emp_scm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEmployee_SCM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
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
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_평가"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_평가",
			    select: true,
			    focus: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_평가"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

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
//----------
function successSave(response, param) {

    processRetrieve({});
    //processRetrieve({ key: response });

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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "evl_emp",
			                        param.data.emp_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "evl_emp_nm",
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
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
                    case "w_find_emp_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee_SCM;
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