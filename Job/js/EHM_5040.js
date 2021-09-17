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
        gw_com_DX.register();
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
                    type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "IEHM06" }
                    ]
                },
				{
				    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [
                        { argument: "arg_hcode", value: "ISCM25" }
                    ]
				},
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "IEHM11" } ] 
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
                {
                    type: "INLINE", name: "Warranty",
                    data: [
						{ title: "IN", value: "IN" },
						{ title: "OUT", value: "OUT" }
					]
                },
				{
				    type: "PAGE", name: "부품군", query: "DDDW_CM_CODE",
				    param: [
                        { argument: "arg_hcode", value: "IEHM29" }
                    ]
				},
				{
				    type: "INLINE", name: "기준",
				    data: [
						{ title: "원인부품", value: "1" },
						{ title: "교체부품", value: "2" }
					]
				},
				{
				    type: "PAGE", name: "진행상태", query: "DDDW_ISSUE_STAT"
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
            show: true,
            border: true,
            editable: {
                focus: "ymd_fr",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "발생일자 :"
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
                            { name: "issue_type", label: { title: "발생구분 :" },
                                editable: { type: "select", 
                                	data: { memory: "발생구분", unshift: [ { title: "전체", value: "" } ] } 
                                }
                            },
                            {
                                name: "issue_stat",
                                label: {
                                    title: "진행상태 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            }
				        ]
                    },
				    {
				        element: [
                            {
                                name: "prod_group",
                                label: {
                                    title: "제품군 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "제품군",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
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
                                name: "wrnt_io",
                                label: {
                                    title: "WARRANTY :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "Warranty",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            }
				        ]
				    },
				    {
				        element: [
                            {
                                name: "cust_cd",
                                label: {
                                    title: "고객사 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "고객사",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
                            {
                                name: "apart_tp",
                                label: {
                                    title: "원인부품군 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "부품군",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
                            { name: "chart", label: { title: "차트 :" },
                              editable: { type: "select", data: { memory: "기준" } }
                            }
				        ]
				    },
                    {
                        element: [
				            {
				                name: "apart_nm",
				                label: {
				                    title: "원인부품명 :"
				                },
				                editable: {
				                    type: "texts",
				                    size: 40,
				                    maxlength: 100,
				                    keyword: true
				                },
				                tip: {
				                    text: " (키워드 간에 + 입력은 AND 조건 / , 입력은 OR 조건 검색)",
				                    color: "#505050"
				                }
				            },
                            {
                                name: "bpart_tp",
                                hidden: true
                            }
				        ]
                    }/*,
                    {
                        element: [
				            {
				                name: "bpart_nm",
				                label: {
				                    title: "교체부품명 :"
				                },
				                editable: {
				                    type: "texts",
				                    size: 40,
				                    maxlength: 100,
				                    keyword: true
				                },
				                tip: {
				                    text: " (키워드 간에 + 입력은 AND 조건 / , 입력은 OR 조건 검색)",
				                    color: "#505050"
				                }
				            },
                            {
                                name: "bpart_tp",
                                hidden: true
                            }
				        ]
                    }*/,
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
            query: "EHM_5040_M_1",
            title: "부품 교체 현황",
            height: 201,
            show: true,
            dynamic: true,
            key: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Line",
				    name: "cust_dept",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 180,
				    align: "center"
				},
				{
				    header: "발생Module",
				    name: "prod_sub",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Warranty",
				    name: "wrnt_io",
				    width: 60,
				    align: "center"
				},
				{
				    header: "원인부품",
				    name: "apart",
				    width: 200,
				    align: "left"
				},
				{
				    header: "교체부품",
				    name: "bpart",
				    width: 200,
				    align: "left"
				},
				{
				    header: "수량",
				    name: "change_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "수급시간",
				    name: "change_time",
				    width: 60,
				    align: "center"
				},
				{
				    header: "교체일자",
				    name: "change_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "발생일자",
				    name: "issue_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    name: "issue_no",
				    hidden: true
				},
				{
				    name: "issue_type",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_현황",
            query: "EHM_5040_S_1",
            show: true,
            format: {
                view: "1", rotate: "0", reverse: "1"
            },
            control: {
                by: "DX",
                id: ctlChart_1
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				},
                {
                    type: "LAYER",
                    id: "lyrChart_현황",
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

            var args = {
                type: "PAGE",
                page: "DLG_ISSUE",
                title: "문제 상세 정보",
                width: 1100,
                height: 700,
                scroll: true,
                locate: ["center", "top"],
                open: true, control: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_ISSUE",
                    param: {
                        ID: gw_com_api.v_Stream.msg_infoAS,
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
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
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				},
				{
				    name: "issue_stat",
				    argument: "arg_issue_stat"
				},
				{
				    name: "issue_type",
				    argument: "arg_issue_type"
				},
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "wrnt_io",
				    argument: "arg_wrnt_io"
				},
				{
				    name: "apart_tp",
				    argument: "arg_apart_tp"
				},
				{
				    name: "bpart_tp",
				    argument: "arg_bpart_tp"
				},
				{
				    name: "apart_nm",
				    argument: "arg_apart_nm"
				}/*,
				{
				    name: "bpart_nm",
				    argument: "arg_bpart_nm"
				}*/,
				{
				    name: "chart",
				    argument: "arg_chart"
				}
			],
            argument: [
                { name: "arg_issue_part", value: "AS" }
                , { name: "arg_duty_cd", value: "%" }
			],
            remark: [
                {
                    infix: "~",
                    element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
                },
		        {
		            element: [{ name: "prod_group"}]
		        },
		        {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "wrnt_io"}]
		        },
		        {
		            element: [{ name: "apart_tp"}]
		        },
		        {
		            element: [{ name: "bpart_tp"}]
		        },
		        {
		            element: [{ name: "apart_nm"}]
		        }/*,
		        {
		            element: [{ name: "bpart_nm"}]
		        }*/,
		        {
		            element: [{ name: "issue_stat"}]
		        },
		        {
		            element: [{ name: "chart"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true,
			    focus: true
			},
			{
			    type: "CHART",
			    id: "lyrChart_현황"
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