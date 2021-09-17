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
                    name: "반영",
                    value: "표준품목 반영",
                    icon: "기타"
                },
				{
				    name: "추가",
				    value: "추가"
				}/*,
				{
				    name: "복사",
				    value: "복사",
                    icon: "기타"
                }*/,
				{
				    name: "삭제",
				    value: "삭제"
				},
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "확정",
				    value: "확정",
				    icon: "실행"
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
                                name: "supp_nm",
                                label: {
                                    title: "협력사 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 18,
                                    maxlength: 30,
                                    readonly: true
                                }
                            },
				            {
				                name: "part_cd",
				                label: {
				                    title: "품목코드 : "
				                },
				                mask: "search",
				                editable: {
				                    type: "text",
				                    size: 10,
				                    maxlength: 30,
                                    readonly: true
				                }
				            },
				            {
				                name: "ord_no",
				                hidden: true
				            },
				            {
				                name: "proj_no",
				                label: {
				                    title: "Project No. : "
				                },
				                hidden: true
				            },
				            {
				                name: "prod_type",
				                hidden: true
				            },
				            {
				                name: "cust_cd",
				                hidden: true
				            },
				            {
				                name: "cust_proc",
				                hidden: true
				            },
				            {
				                name: "supp_cd",
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
            targetid: "grdData_품목",
            query: "SRM_2520_M_1",
            title: "FORECASTING 품목",
            height: 442,
            show: true,
            selectable: true,
            dynamic: true,
            key: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "prod_type",
                validate: true
            },
            element: [
                {
                    header: "협력사",
                    name: "supp_nm",
                    width: 200,
                    align: "left",
                    mask: "search",
                    display: true,
                    editable: {
                        type: "text",
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
				    header: "규격",
				    name: "part_spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "필요일",
				    name: "part_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "요청수량",
				    name: "req_qty",
				    width: 60,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "납기요청일",
				    name: "req_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "공정순번",
				    name: "mprc_seq",
				    width: 60,
				    align: "center",
				    mask: "search",
				    display: true,
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "공정명",
				    name: "mprc_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "특이사항",
				    name: "req_note",
				    width: 400,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    name: "mprc_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "supp_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "part_seq",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "ord_no",
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
            element: "반영",
            event: "click",
            handler: click_lyrMenu_반영
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
            element: "복사",
            event: "click",
            handler: click_lyrMenu_복사
        };
        //gw_com_module.eventBind(args);
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
        function click_lyrMenu_반영(ui) {

            if (!checkUpdatable({})) return false;

            checkAppliable({});

        }
        //----------
        function click_lyrMenu_추가(ui) {

            closeOption({});

            processInsert({});

        }
        //----------
        function click_lyrMenu_복사(ui) {

            if (!checkUpdatable({ check: true })) return false;

            // 먼저 특정 조건으로 조회가 되어야 함. 안될 경우 조건을 입력할 수 있도록 해야 함.
            // 복사창의 상단에 복사할 대상을 입력할 수 있도록 하고 해당 복사 대상으로 조회된 건들을 복사를 누르면 해당 내용을 프로시져로 보냄.

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
        function click_lyrMenu_확정(ui) {

            //v_global.process.handler = processConfirm;

            if (!checkUpdatable({})) return false;

            //processConfirm({});

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
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "ord_no", gw_com_api.getPageParameter("ord_no"));
            gw_com_api.setValue("frmOption", 1, "proj_no", gw_com_api.getPageParameter("proj_no"));
            gw_com_api.setValue("frmOption", 1, "prod_type", gw_com_api.getPageParameter("prod_type"));
            gw_com_api.setValue("frmOption", 1, "cust_cd", gw_com_api.getPageParameter("cust_cd"));
            gw_com_api.setValue("frmOption", 1, "cust_proc", gw_com_api.getPageParameter("cust_proc"));
        }
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            processRetrieve({});
            //processRetrieve({ init: true });
            //gw_com_api.show("frmOption");
        }

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function itemdblclick_frmOption(ui) {

    switch (ui.element) {
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
        case "part_cd":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_PART",
                    title: "품목 선택",
                    width: 900,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_PART",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectPart
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
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
                    page: "DLG_PART",
                    title: "품목 선택",
                    width: 900,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_PART",
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
        case "mprc_no":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_MPROC",
                    title: "공정 선택",
                    width: 600,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_MPROC",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectProcess,
                            data: {
                                prod_type: gw_com_api.getValue("frmOption", 1, "prod_type")
                            }
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
function checkAppliable(param) {

    gw_com_api.messageBox([
        { text: "기존 품목이 삭제되고 표준 품목이 반영됩니다." },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { apply: true });

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
        init: param.init,
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "ord_no",
                    argument: "arg_ord_no"
                },
				{
				    name: "supp_cd",
				    argument: "arg_supp_cd"
				},
				{
				    name: "part_cd",
				    argument: "arg_part_cd"
				}
			],
            remark: [
                {
                    element: [{ name: "proj_no"}]
                },
                {
                    element: [{ name: "supp_nm"}]
                },
                {
                    element: [{ name: "part_cd"}]
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
        edit: true
    };
    if (gw_com_api.getRowCount("grdData_품목") > 1)
        args.data = [
            { name: "ord_no", rule: "COPY", row: "prev" },
            { name: "supp_cd", rule: "COPY", row: "prev" },
            { name: "supp_nm", rule: "COPY", row: "prev" }
        ];
    else
        args.data = [
            { name: "ord_no", value: gw_com_api.getValue("frmOption", 1, "ord_no") }
        ];
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

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processApply(param) {

    var args = {
        url: "COM",
        procedure: "PROC_INSERT_SM_FORECAST_PART",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "ord_no", value: gw_com_api.getValue("frmOption", 1, "ord_no"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeApply
        }
    };
    gw_com_module.callProcedure(args);

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
//----------
function completeApply(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successApply, response: response });

}
//----------
function successApply(response) {

    if (response.VALUE[0] != -1)
        processRetrieve({});

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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.apply)
                                    processApply({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
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
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "part_spec",
			                        param.data.part_spec,
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
        case gw_com_api.v_Stream.msg_selectedProcess:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "mprc_cd",
			                        param.data.mprc_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "mprc_no",
			                        param.data.mprc_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "mprc_nm",
			                        param.data.mprc_nm,
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
                    case "DLG_PART":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart;
                        }
                        break;
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        }
                        break;
                    case "DLG_MPROC":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProcess;
                            args.data = {
                                prod_type: gw_com_api.getValue("frmOption", 1, "prod_type")
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
