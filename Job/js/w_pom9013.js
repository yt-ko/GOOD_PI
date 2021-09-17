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
        var args = {
            request: [
				{
				    type: "PAGE", name: "제품유형", query: "dddw_prodtype"
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
				    name: "전송",
				    value: "전송",
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
            show: true,
            trans: true,
            border: true,
            editable: {
                bind: "open",
                focus: "diff_item",
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
                                        memory: "제품유형",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
				            {
				                name: "supp_cd",
				                label: {
				                    title: "거래처코드 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 20
				                }
				            },
                            {
                                name: "supp_nm",
                                label: {
                                    title: "협력사 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 18,
                                    maxlength: 30
                                }
                            },
                            {
                                name: "diff_item",
                                title: "재고부족",
                                label: {
                                    title: "재고부족 :"
                                },
                                editable: {
                                    type: "checkbox",
                                    value: 1,
                                    offval: 0
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
            targetid: "grdData_현황",
            query: "w_pom9013_M_1",
            title: "안전재고 전송 현황",
            //caption: true,
            height: 428,
            show: true,
            selectable: true,
            multi: true,
            checkrow: true,
            editable: {
                multi: true,
                bind: "open",
                focus: "send_yn",
                validate: true
            },
            element: [
				{
				header: "협력사명",
				name: "supp_nm",
				width: 200,
				align: "left"
},
				{
				    lead: "품목수",
				    header: "품목수",
				    name: "tot_item",
				    width: 100,
				    align: "center",
				    mask: "numeric-int"
				}/*,
				{
				    lead: "요청품목",
				    header: "요청<br /><div style='margin-top:4px;'>(품목)</div>",
				    name: "req_item",
				    width: 100,
				    align: "center",
				    mask: "numeric-int"
				}*/,
				{
				    lead: "재고부족(품목)",
				    header: "재고부족<br /><div style='margin-top:4px;'>(품목)</div>",
				    name: "diff_item",
				    width: 100,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "요청변경일시",
				    name: "req_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "최종전송일시",
				    name: "inform_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "send_yn",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "message",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "cust_cd",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "prod_type",
				    hidden: true
				},
				{
				    name: "diff_div",
				    hidden: true
				}
			],
            subgrid: {
                query: "w_pom9013_D_1",
                height: "100%",
                argument: [
                    { name: "prod_type", argument: "arg_prod_type" },
			        { name: "cust_cd", argument: "arg_supp_cd" },
                    { name: "diff_div", argument: "arg_diff_item" }
			    ],
                element: [
				    {
				        header: "제품유형",
				        name: "prod_type_nm",
				        width: 80,
				        align: "center"
				    },
				    {
				        header: "자재코드",
				        name: "part_cd",
				        width: 90,
				        align: "center"
				    },
				    {
				        header: "자재명",
				        name: "part_nm",
				        width: 210,
				        align: "left"
				    },
				    {
				        header: "규격",
				        name: "part_spec",
				        width: 210,
				        align: "left"
				    },
				    {
				        lead: "요청수량",
				        header: "요청수량",
				        name: "req_qty",
				        width: 65,
				        align: "center",
				        mask: "numeric-int",
				        style: { bgcolor: "#FAE7E7" }
				    },
				    {
				        lead: "보유수량(협력사)",
				        header: "보유수량<br /><div style='margin-top:4px;'>(협력사)</div>",
				        name: "supp_qty",
				        width: 65,
				        align: "center",
				        mask: "numeric-int",
				        style: { bgcolor: "#E7FAE7" }
				    },
				    {
				        lead: "보유수량(최종변경일시)",
				        header: "보유수량<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				        name: "hold_upd_dt",
				        width: 160,
				        align: "center",
				        style: { bgcolor: "#E7FAE7" }
				    },
				    {
				        lead: "1차계획(수량)",
				        header: "1차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				        name: "plan_1_qty",
				        width: 75,
				        align: "center",
				        mask: "numeric-int",
				        style: { bgcolor: "#FAFACA" }
				    },
				    {
				        lead: "1차계획(입고일정)",
				        header: "1차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				        name: "plan_1_date",
				        width: 80,
				        align: "center",
				        mask: "date-ymd",
				        style: { bgcolor: "#FAFACA" }
				    },
				    {
				        lead: "1차계획(최종변경일시)",
				        header: "1차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				        name: "plan_1_upd_dt",
				        width: 160,
				        align: "center",
				        style: { bgcolor: "#FAFACA" }
				    },
				    {
				        lead: "2차계획(수량)",
				        header: "2차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				        name: "plan_2_qty",
				        width: 75,
				        align: "center",
				        mask: "numeric-int",
				        style: { bgcolor: "#FAFACA" }
				    },
				    {
				        lead: "2차계획(입고일정)",
				        header: "2차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				        name: "plan_2_date",
				        width: 80,
				        align: "center",
				        mask: "date-ymd",
				        style: { bgcolor: "#FAFACA" }
				    },
				    {
				        lead: "2차계획(최종변경일시)",
				        header: "2차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				        name: "plan_2_upd_dt",
				        width: 160,
				        align: "center",
				        style: { bgcolor: "#FAFACA" }
				    },
				    {
				        header: "비고",
				        name: "rmk",
				        width: 600,
				        align: "left"
				    }
			    ]
            }
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

        //----------
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
            element: "전송",
            event: "click",
            handler: click_lyrMenu_전송
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
        function click_lyrMenu_전송(ui) {

            if (!checkSendable({})) {
                gw_com_api.messageBox([
                    { text: "선택된 대상이 없습니다." }
                ], 300);
                return false;
            }

            processSend({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            gw_com_api.setValue("grdData_현황", 2, "send_yn", "1", true);
            //checkClosable({});

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
                            page: "w_find_supplier",
                            title: "협력사 검색",
                            width: 600,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_supplier",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectSupplier,
                                    data: {
                                        system: "PLM",
                                        supp_nm: gw_com_api.getValue(ui.object, ui.row, ui.element)
                                    }
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
			    id: "grdData_현황"
			}
		]
    };
    //return gw_com_module.objUpdatable(args);
    return true;

}
//----------
function checkSendable(param) {

    closeOption({});

    var rows = gw_com_api.getSelectedRow("grdData_현황", true);
    return ((rows.length <= 0) ? false : true);

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
                    name: "supp_cd",
                    argument: "arg_supp_cd"
                },
                {
                    name: "supp_nm",
                    argument: "arg_supp_nm"
                },
				{
				    name: "diff_item",
				    argument: "arg_diff_item"
				}
			],
			remark: [
                {
                    element: [{ name: "prod_type"}]
                },
                {
                    element: [{ name: "supp_cd"}]
                },
			    {
			        element: [{ name: "supp_nm"}]
			    },
		        {
		            element: [{ name: "diff_item"}]
		        }
		    ]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_현황"
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
			    id: "grdData_현황"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.message = "전송";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processSend(param) {

    var args = {
        type: "PAGE",
        page: "w_edit_sms",
        title: "문자 메시지",
        width: 500,
        height: 130,
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_edit_sms",
            param: {
                ID: gw_com_api.v_Stream.msg_edit_SMS,
                data: {
                    sms_msg: "안전재고 현황을 확인 바랍니다."
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_현황"
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
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
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
        case gw_com_api.v_Stream.msg_edited_SMS:
            {
                var rows = gw_com_api.getSelectedRow("grdData_현황", true);
                $.each(rows, function () {
                    gw_com_api.setValue("grdData_현황", this, "send_yn", "1", true);
                    gw_com_api.setValue("grdData_현황", this, "message", param.data.text, true);
                    gw_com_api.setUpdatable("grdData_현황", this, true);
                });
                closeDialogue({ page: param.from.page, focus: true });
                processSave({});
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
                    case "w_find_supplier":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = {
                                system: "PLM",
                                supp_nm: gw_com_api.getValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            v_global.event.element,
			                                (v_global.event.type == "GRID") ? true : false)
                            };
                        }
                        break;
                    case "w_edit_sms":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_SMS;
                            args.data = {
                                sms_msg: "안전재고 현황을 확인 바랍니다."
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