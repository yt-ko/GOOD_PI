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
        var args = {
            request: [
                {
                    type: "PAGE", name: "화폐", query: "dddw_mat_monetary_unit"
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
                    name: "복사",
                    value: "복사",
                    icon: "기타"
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
            title: "조회 조건",
            width: "240px",
            trans: true,
            show: true,
            border: false,
            align: "left",
            editable: {
                focus: "est_nm",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "est_nm",
				                label: {
				                    title: "견적명 :"
				                },
				                mask: "search",
				                editable: {
				                    type: "text",
				                    size: 20,
				                    readonly: true,
				                    validate: {
				                        rule: "required",
				                        message: "견적명"
				                    }
				                }
				            },
                            {
                                name: "est_key",
                                hidden: true
                            },
                            {
                                name: "revision",
                                hidden: true
                            },
				            {
				                name: "실행",
				                act: true,
				                show: false,
				                format: {
				                    type: "button"
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
            targetid: "frmData_정보",
            query: "w_find_est_detail_M_0",
            type: "TABLE",
            title: "갑지 정보",
            caption: true,
            show: true,
            selectable: true,
            content: {
                width: { label: 80, field: 150 },
                row: [
                    { element: [
                        {
                            header: true, value: "견적명",
                            format: { type: "label" }
                        },
                        {
                            name: "est_nm"
                        },
                        {
                            header: true, value: "고객사",
                            format: { type: "label" }
                        },
                        {
                            name: "cust_nm"
                        },
                        {
                            header: true, value: "제출일자",
                            format: { type: "label" }
                        },
                        {
                            name: "submit_dt", mask: "date-ymd"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적금액(￦)",
                            format: { type: "label" }
                        },
                        {
                            name: "est_amt", mask: "currency-int"
                        },
                        {
                            header: true, value: "NEGO금액(￦)",
                            format: { type: "label" }
                        },
                        {
                            name: "nego_amt", mask: "currency-int"
                        },
                        {
                            header: true, value: "최종금액(￦)",
                            format: { type: "label" }
                        },
                        {
                            name: "final_amt", mask: "currency-int"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "지불조건",
                            format: { type: "label" }
                        },
                        {
                            name: "pay_cond"
                        },
                        {
                            header: true, value: "부가세",
                            format: { type: "label" }
                        },
                        {
                            name: "vat_div",
                            format: { type: "checkbox", title: "별도", value: "1", offval: "0" }
                        },
                        {
                            header: true, value: "납기",
                            format: { type: "label" }
                        },
                        {
                            name: "delivery"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "견적유효기간",
                            format: { type: "label" }
                        },
                        {
                            name: "est_expired"
                        },
                        {
                            header: true, value: "배송수단",
                            format: { type: "label" }
                        },
                        {
                            name: "shipment"
                        },
                        {
                            header: true, value: "집계기준",
                            format: { type: "label" }
                        },
                        {
                            name: "sheet_summary"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "담당자",
                            format: { type: "label" }
                        },
                        {
                            name: "submit_empno_nm"
                        },
                        {
                            header: true, value: "등록자",
                            format: { type: "label" }
                        },
                        {
                            name: "upd_usr"
                        },
                        {
                            header: true, value: "등록일시",
                            format: { type: "label" }
                        },
                        {
                            name: "upd_dt"
                        }
                    ]
                    },
                    { element: [
                        {
                            header: true, value: "특기사항",
                            format: { type: "label" }
                        },
                        {
                            style: { colspan: 5 },
                            name: "rmk",
                            format: { type: "textarea", rows: 5, width: 796 }
                        },
                        {
                            name: "use_div", hidden: true, refer: true
                        },
                        {
                            name: "exchange_dt", hidden: true, refer: true
                        },
                        {
                            name: "exchange_1", hidden: true, refer: true
                        },
                        {
                            name: "exchange_2", hidden: true, refer: true
                        },
                        {
                            name: "distribution_rate", hidden: true, refer: true
                        },
                        {
                            name: "duty_rate", hidden: true, refer: true
                        },
                        {
                            name: "profit_rate", hidden: true, refer: true
                        },
                        {
                            name: "est_key", hidden: true
                        },
                        {
                            name: "revision", hidden: true
                        }
                    ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_목록",
            query: "w_find_est_detail_M_1",
            title: "을지 목록",
            caption: true,
            height: 118,
            pager: false,
            show: true,
            element: [
				{
				    header: "제품분류",
				    name: "model_nm",
				    width: 270,
				    align: "left",
				    mask: "search"
				},
				{
				    header: "수량",
				    name: "model_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "견적금액(￦)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "견적합계(￦)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "NEGO율(%)",
				    name: "nego_rate",
				    width: 60,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "NEGO금액(￦)",
				    name: "nego_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "NEGO합계(￦)",
				    name: "nego_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "자재금액(￦)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "자재합계(￦)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "추가분류(1)",
				    name: "index_div1",
				    width: 150,
				    align: "left"
				},
				{
				    header: "추가분류(2)",
				    name: "index_div2",
				    width: 150,
				    align: "left"
				},
				{
				    header: "추가분류(3)",
				    name: "index_div3",
				    width: 150,
				    align: "left"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left"
				},
				{
				    name: "model_class1",
				    hidden: true
				},
				{
				    name: "model_class2",
				    hidden: true
				},
				{
				    name: "model_class3",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				},
				{
				    name: "revision",
				    hidden: true
				},
				{
				    name: "model_seq",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_내역",
            query: "w_find_est_detail_M_2",
            title: "세부 내역",
            caption: true,
            height: 475,
            //pager: false,
            show: true,
            multi: true,
            key: true,
            group: [
                { element: "title_div2", show: false, summary: true }
            ],
            element: [
                {
                    header: "분류",
                    name: "title_div2",
                    width: 150,
                    align: "left"
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left",
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 200,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    summary: { type: "sum" }
				},
				{
				    header: "견적단가(￦)",
				    name: "est_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "견적금액(￦)",
				    name: "est_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "자재화폐",
				    name: "monetary_nm",
				    width: 60,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "화폐"
				        }
				    }
				},
				{
				    header: "자재원가",
				    name: "mat_price",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재금액",
				    name: "mat_uamt",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "자재단가(￦)",
				    name: "mat_cost",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "자재금액(￦)",
				    name: "mat_amt",
				    width: 100,
				    align: "right",
				    mask: "currency-int",
				    summary: { type: "sum" }
				},
				{
				    header: "자재표시명",
				    name: "mat_tnm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "자재그룹",
				    name: "mat_group",
				    width: 150,
				    align: "center"
				},
				{
				    header: "자재번호",
				    name: "mat_sno",
				    width: 100,
				    align: "center"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left"
				},
				{
				    name: "title_div1",
				    hidden: true
				},
				{
				    name: "sort_num",
				    hidden: true
				},
				{
				    name: "mat_cd",
				    hidden: true
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "monetary_unit",
				    hidden: true
				},
				{
				    name: "est_key",
				    hidden: true
				},
				{
				    name: "revision",
				    hidden: true
				},
                {
                    name: "model_seq",
                    hidden: true
                },
				{
				    name: "item_seq",
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
                    type: "FORM",
                    id: "frmData_정보",
                    offset: 8
                },
                {
                    type: "GRID",
                    id: "grdData_목록",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_내역",
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
            element: "복사",
            event: "click",
            handler: click_lyrMenu_복사
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
            targetid: "grdData_목록",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_목록
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
        function click_lyrMenu_복사(ui) {

            processCopy({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //---------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }        
        //----------
        function rowselected_grdData_목록(ui) {

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
function itemdblclick_frmOption(ui) {

    switch (ui.element) {
        case "est_nm":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "w_find_est_info",
                    title: "견적정보 검색",
                    width: 790,
                    height: 470,
                    locate: ["center", "top"],
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_find_est_info",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectEstimate/*,
                                    data: {
                                        est_nm: gw_com_api.getValue(ui.object, ui.row, ui.element)
                                    }*/
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

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
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            element: [
				{
				    name: "est_key",
				    argument: "arg_est_key"
				},
                {
                    name: "revision",
                    argument: "arg_revision"
                }
			]
        },
        target: [
            { type: "FORM", id: "frmData_정보" },
            { type: "GRID", id: "grdData_목록", select: true }
        ],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		],
        key: param.key

    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID",
            id: "grdData_목록",
            row: "selected",
            block: true,
            element: [
				{
				    name: "est_key",
				    argument: "arg_est_key"
				},
				{
				    name: "revision",
				    argument: "arg_revision"
				},
				{
				    name: "model_seq",
				    argument: "arg_model_seq"
				}
			]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processCopy(param) {

    var args = {
        url: "COM",
        procedure: "PROC_COPY_EST",
        nomessage: true,
        input: [
            { name: "user", value: v_global.data.user, type: "varchar" },
            { name: "est_key", value: v_global.data.est_key, type: "varchar" },
            { name: "revision", value: v_global.data.revision, type: "varchar" },
            { name: "pre_est_key", value: gw_com_api.getValue("frmData_정보", 1, "est_key"), type: "varchar" },
            { name: "pre_revision", value: gw_com_api.getValue("frmData_정보", 1, "revision"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeCopy
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

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
        ID: gw_com_api.v_Stream.msg_copiedPreEstimate,
        data: {
            est_key: v_global.data.est_key,
            revision: v_global.data.revision
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function completeCopy(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successCopy, response: response });

}
//----------
function successCopy(response, param) {

    if (response.VALUE[0] != -1) {
        informResult({});
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
        case gw_com_api.v_Stream.msg_copyPreEstimate:
            {
                v_global.data = param.data;

                var retrieve = false;
                if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve) {
                    //processRetrieve({});
                    itemdblclick_frmOption({
                        type: "FORM",
                        object: "frmOption",
                        row: 1,
                        element: "est_nm"
                    });
                }
                else
                    gw_com_api.setFocus("frmOption", 1, "est_nm");
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEstimate:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "est_key",
			                        param.data.est_key,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "revision",
			                        param.data.revision,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "est_nm",
			                        param.data.est_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
                processRetrieve({});
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
                    case "w_find_est_info":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEstimate;
                            /*
                            args.data = {
                            est_nm: gw_com_api.getValue(
                            v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false)
                            };
                            */
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

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//