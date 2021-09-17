﻿//------------------------------------------
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
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
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
        var args = {
            request: [
                {
                    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM25" }
                    ]
                },
				{
				    type: "PAGE", name: "부품군", query: "DDDW_CM_CODEF",
				    param: [
                        { argument: "arg_hcode", value: "IEHM29" }
                    ]
				}
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
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
				},
				{
				    name: "저장",
				    value: "저장"
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
        var args = {
            targetid: "frmOption",
            type: "FREE",
            trans: true,
            show: true,
            border: true,
            margin: 0,
            editable: {
                bind: "open",
                focus: "prod_type",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
				                name: "prod_type",
				                label: {
				                    title: "제품유형 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "제품유형"
				                    },
				                    change: [
					                    {
					                        name: "part_tp",
					                        memory: "부품군",
					                        unshift: [
				                                { title: "전체", value: "" }
				                            ],
					                        key: [
							                    "prod_type"
						                    ]
					                    }
				                    ]
				                }
				            },
				            {
				                name: "part_tp",
				                label: {
				                    title: "부품군 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "부품군",
				                        unshift: [
				                            { title: "전체", value: "" }
				                        ],
				                        key: [
							                "prod_type"
						                ]
				                    }
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
        var args = {
            targetid: "grdData_품목",
            query: "EHM_1040_M_1",
            title: "주요 부품",
            height: 442,
            show: true,
            selectable: true,
            key: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "part_cd",
                validate: true
            },
            element: [
                {
                    header: "제품유형",
                    name: "prod_type",
                    width: 100,
                    align: "center",
                    format: {
                        type: "select",
                        data: {
                            memory: "제품유형"
                        }
                    },
                    editable: {
                        bind: "create",
                        type: "select",
                        data: {
                            memory: "제품유형"
                        },
				        change: [
					        {
					            name: "part_tp",
					            memory: "부품군",
					            unshift: [
				                    { title: "-", value: "" }
				                ],
					            key: [
							        "prod_type"
						        ]
					        }
                        ],
					    validate: {
					        rule: "required"
					    }
                    }
                },
                {
                    header: "부품군",
                    name: "part_tp",
                    width: 120,
                    align: "center",
                    format: {
                        type: "select",
                        data: {
                            memory: "부품군"
                        }
                    },
                    editable: {
                        bind: "create",
                        type: "select",
                        data: {
                            memory: "부품군",
                            unshift: [
				                { title: "-", value: "" }
				            ],
                            by: [
                                {
                                    source: {
                                        id: "grdData_품목", row: "selected", key: "prod_type", grid: true
                                    }
                                }
                            ]
                        },
                        validate: {
                            rule: "required"
                        }
                    }
                },
				{
				    header: "품목코드",
				    name: "part_cd",
				    width: 115,
				    align: "center",
				    mask: "search",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "품목명",
				    name: "part_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "협력사",
				    name: "supp_nm",
				    width: 180,
				    align: "left",
				    mask: "search",
				    display: true,
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "모델",
				    name: "part_model",
				    width: 150,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "규격(REV)",
				    name: "part_rev",
				    width: 150,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "사용GAS",
				    name: "part_gas",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "사용유량",
				    name: "part_flux",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "비고(REV)",
				    name: "rmk",
				    width: 400,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    name: "supp_cd",
				    hidden: true,
				    editable: { type: "hidden" }
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
				    id: "grdData_품목",
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
            element: "추가",
            event: "click",
            handler: click_lyrMenu_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_저장
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
            targetid: "grdData_품목",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_품목
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_품목",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_품목
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
        function click_lyrMenu_추가(ui) {

            closeOption({});

            processInsert({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            closeOption({});

            processDelete({});

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

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
function itemdblclick_grdData_품목(ui) {

    switch (ui.element) {
        case "part_cd":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_PART_PLM",
                    title: "부품 선택",
                    width: 900,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_PART_PLM",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectPart
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "supp_nm":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_SUPPLIER",
                    title: "협력사 선택",
                    width: 600,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_SUPPLIER",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectSupplier
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
			{
			    type: "GRID",
			    id: "grdData_품목"
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
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({});
        return false;
    }

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "part_tp",
				    argument: "arg_part_tp"
				}
			],
			remark: [
                {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "part_tp"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_품목",
			    select: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_품목",
        edit: true,
        data: [
            { name: "prod_type", rule: "COPY", row: "prev", value: gw_com_api.getValue("frmOption", 1, "prod_type") },
            { name: "part_tp", rule: "COPY", row: "prev", value: gw_com_api.getValue("frmOption", 1, "part_tp") }
        ]
    };
    var row = gw_com_module.gridInsert(args);
    itemdblclick_grdData_품목({
        type: "GRID",
        object: "grdData_품목",
        row: row,
        element: "part_cd"
    });

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_품목",
        row: "selected"
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_품목"
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
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_품목"
            }
        ]
    };
    gw_com_module.objClear(args);

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

    processRetrieve({ key: response });

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
        case gw_com_api.v_Stream.msg_selectedPart:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "part_cd",
			                        param.data.part_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "part_nm",
			                        param.data.part_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_cd",
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_nm",
			                        param.data.supp_nm,
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
                    case "DLG_PART_PLM":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart;
                        }
                        break;
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
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
