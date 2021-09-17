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
                    type: "PAGE", name: "대분류", query: "dddw_model_class_1"
                },
                {
                    type: "PAGE", name: "중분류", query: "dddw_model_class_2"
                },
                {
                    type: "PAGE", name: "소분류", query: "dddw_model_class_3"
                },
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
            trans: true,
            border: true,
            show: true,
            editable: {
                bind: "open",
                focus: "cust_name",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cust_name",
                                label: {
                                    title: "고객사 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 16,
                                    maxlength: 50
                                }
                            },
				            {
				                name: "model_class1",
				                value: "%",
				                label: {
				                    title: "대분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "대분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    },
				                    change: [
					                    {
					                        name: "model_class2",
					                        memory: "중분류",
					                        key: [
							                    "model_class1"
						                    ]
					                    },
                                        {
                                            name: "model_class3",
                                            memory: "소분류",
                                            key: [
							                    "model_class1",
                                                "model_class2"
						                    ]
                                        }
				                    ]
				                }
				            },
				            {
				                name: "model_class2",
				                value: "%",
				                label: {
				                    title: "중분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "중분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "model_class1"
						                ]
				                    },
				                    change: [
					                    {
					                        name: "model_class3",
					                        memory: "소분류",
					                        key: [
							                    "model_class1",
                                                "model_class2"
						                    ]
					                    }
				                    ]
				                }
				            },
				            {
				                name: "model_class3",
				                value: "%",
				                label: {
				                    title: "소분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "소분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "model_class1",
                                            "model_class2"
						                ]
				                    }
				                }
				            },
                            {
                                name: "cust_cd",
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
            targetid: "grdData_정보",
            query: "w_find_model_detail_M_1",
            title: "모델 정보",
            caption: true,
            height: 138,
            //pager: false,
            show: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_name",
				    width: 200,
				    align: "left"
				},
				{
				    header: "모델명",
				    name: "model_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "순번",
				    name: "model_seq",
				    width: 40,
				    align: "left"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 300,
				    align: "left"
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "cust_cd",
				    hidden: true
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
            query: "w_find_model_detail_M_2",
            title: "세부 내역",
            caption: true,
            height: 545,
            //pager: false,
            show: true,
            multi: true,
            key: true,
            group: [
                { element: "title_div2", show: true, summary: true }
            ],
            element: [
                {
                    header: "분류",
                    name: "title_div2",
                    width: 150,
                    align: "left"
                },
				{
				    header: "품목코드",
				    name: "mat_cd",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "hidden"
				    },
				    summary: { title: "  ▶ 소계" }
				},
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left"
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
				    header: "거래처",
				    name: "mat_maker",
				    width: 100,
				    align: "center"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 300,
				    align: "left"
				},
                {
                    name: "title_div1",
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
                    name: "monetary_unit",
                    hidden: true
                },
				{
				    name: "mat_price",
				    hidden: true
				},
				{
				    name: "sort_num",
				    hidden: true
				},
				{
				    name: "cust_cd",
				    hidden: true
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
                    type: "GRID",
                    id: "grdData_정보",
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
            targetid: "grdData_정보",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_정보
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
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "cust_name":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_cust_info",
                            title: "고객사 검색",
                            width: 700,
                            height: 420,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_cust_info",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectCusromer
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function rowselected_grdData_정보(ui) {

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
            hide: true,
            element: [
				{
				    name: "cust_name",
				    argument: "arg_cust_name"
				},
				{
				    name: "model_class1",
				    argument: "arg_model_class1"
				},
				{
				    name: "model_class2",
				    argument: "arg_model_class2"
				},
				{
				    name: "model_class3",
				    argument: "arg_model_class3"
				}
			],
			remark: [
		        {
		            element: [{ name: "cust_name"}]
		        },
		        {
		            element: [{ name: "model_class1"}]
		        },
		        {
		            element: [{ name: "model_class2"}]
		        },
		        {
		            element: [{ name: "model_class3"}]
		        }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_정보", select: true }
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
            id: "grdData_정보",
            row: "selected",
            block: true,
            element: [
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "model_class1",
				    argument: "arg_model_class1"
				},
				{
				    name: "model_class2",
				    argument: "arg_model_class2"
				},
				{
				    name: "model_class3",
				    argument: "arg_model_class3"
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
        procedure: "PROC_COPY_EM_MODEL",
        nomessage: true,
        input: [
            { name: "user", value: v_global.data.user, type: "varchar" },
            { name: "est_key", value: v_global.data.est_key, type: "varchar" },
            { name: "revision", value: v_global.data.revision, type: "varchar" },
            { name: "pre_cust_cd", value: gw_com_api.getValue("grdData_정보", "selected", "cust_cd", true), type: "varchar" },
            { name: "pre_model_class1", value: gw_com_api.getValue("grdData_정보", "selected", "model_class1", true), type: "varchar" },
            { name: "pre_model_class2", value: gw_com_api.getValue("grdData_정보", "selected", "model_class2", true), type: "varchar" },
            { name: "pre_model_class3", value: gw_com_api.getValue("grdData_정보", "selected", "model_class3", true), type: "varchar" },
            { name: "pre_model_seq", value: gw_com_api.getValue("grdData_정보", "selected", "model_seq", true), type: "int" }
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

    var args = {
        ID: gw_com_api.v_Stream.msg_copiedPreModel,
        data: {
            est_key: v_global.data.est_key,
            revision: v_global.data.revision,
            model_seq: "1"
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
        case gw_com_api.v_Stream.msg_copyPreModel:
            {
                v_global.data = param.data;

                var retrieve = false;
                if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "cust_name");
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
        case gw_com_api.v_Stream.msg_selectedCustomer:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_name",
			                        param.data.cust_name,
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
                    case "w_find_cust_info":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectCusromer;
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