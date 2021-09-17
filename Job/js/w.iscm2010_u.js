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
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				},
				{
				    type: "PAGE", name: "고객사", query: "dddw_cust"
				},
                {
                    type: "PAGE", name: "현황_장비군", query: "dddw_prodgroup"
                },
                {
                    type: "INLINE", name: "차트",
                    data: [
						{ title: "Bar", value: "1" },
						{ title: "Bar Stacked", value: "2" },
						{ title: "Bar Stacked 100%", value: "3" },
						{ title: "Line", value: "4" },
						{ title: "Step Line", value: "5" },
						{ title: "Spline", value: "6" },
						{ title: "Area", value: "7" },
						{ title: "Area Stacked", value: "8" },
						{ title: "Pie", value: "9" },
						{ title: "Doughnut", value: "10" }
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
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmView",
            type: "FREE",
            trans: true,
            show: true,
            border: false,
            align: "left",
            editable: {
                bind: "open",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "type",
				                label: {
				                    title: "차트유형 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "차트"
				                    }
				                }
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
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: true,
            border: true,
            editable: {
                focus: "fr_ym",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "fr_ym",
				                mask: "date-ym",
				                label: {
				                    title: "기준년월 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 6,
				                    maxlength: 7,
				                    validate: {
				                        rule: "required",
				                        message: "기준년월"
				                    }
				                }
				            },
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
				                    },
				                    remark: {
				                        title: "고객사 :"
				                    }
				                }
				            },
				            {
				                name: "prod_group",
				                label: {
				                    title: "장비군 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "장비군",
				                        unshift: [
				                            { title: "전체", value: "%" }
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
            targetid: "grdData_현황",
            query: "w_iscm2010_M_1",
            title: "영업 진행 현황",
            height: 205,
            pager: false,
            show: true,
            treegrid: {
                element: "div_nm"
            },
            element: [
				{
				    header: "구분",
				    name: "div_nm",
				    width: 200,
				    align: "left",
				    format: {
				        type: "label"
				    }
				},
				{
				    header: "합계",
				    name: "total",
				    width: 60,
				    align: "center"
				},
				{
				    header: "1월",
				    name: "val01",
				    width: 50,
				    align: "center"
				},
				{
				    header: "2월",
				    name: "val02",
				    width: 50,
				    align: "center"
				},
				{
				    header: "3월",
				    name: "val03",
				    width: 50,
				    align: "center"
				},
				{
				    header: "4월",
				    name: "val04",
				    width: 50,
				    align: "center"
				},
				{
				    header: "5월",
				    name: "val05",
				    width: 50,
				    align: "center"
				},
				{
				    header: "6월",
				    name: "val06",
				    width: 50,
				    align: "center"
				},
				{
				    header: "7월",
				    name: "val07",
				    width: 50,
				    align: "center"
				},
				{
				    header: "8월",
				    name: "val08",
				    width: 50,
				    align: "center"
				},
				{
				    header: "9월",
				    name: "val09",
				    width: 50,
				    align: "center"
				},
				{
				    header: "10월",
				    name: "val10",
				    width: 50,
				    align: "center"
				},
				{
				    header: "11월",
				    name: "val11",
				    width: 50,
				    align: "center"
				},
				{
				    header: "12월",
				    name: "val12",
				    width: 50,
				    align: "center"
				},
				{
				    name: "type",
				    hidden: true
				},
				{
				    name: "fr_ym",
				    hidden: true
				},
				{
				    name: "prod_group",
				    hidden: true
				},
				{
				    name: "ord_class",
				    hidden: true
				},
				{
				    name: "ymd_tp",
				    hidden: true
				},
				{
				    name: "cust_cd",
				    hidden: true
				},
				{
				    name: "cust_dept",
				    hidden: true
				},
				{
				    name: "cust_proc",
				    hidden: true
				},
				{
				    name: "prod_type",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_현황",
            query: "w_iscm2010_S_1",
            show: true,
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

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = ui.element;
            if (v_global.event.element == "total" || v_global.event.element.substr(0, 3) == "val") {
                var args = {
                    type: "PAGE",
                    page: "w_find_orders",
                    title: "생산 의뢰 현황",
                    width: 900,
                    height: 480,
                    scroll: true,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var ymd_fr = "", ymd_to = "";
                    if (v_global.event.element == "total") {
                        var yy = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(0, 4);
                        var mm = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(4, 2) * 1;
                        ymd_fr = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true) + "01";
                        ymd_to = ((mm + 11 > 12) ? (yy * 1) + 1 : yy) +
                                            gw_com_api.prefixNumber(((mm + 11 > 12) ? mm + 11 - 12 : mm + 11), 2) +
                                            "31";
                    }
                    else {
                        var yy = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(0, 4);
                        var mm = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(4, 2) * 1;
                        var index = (v_global.event.element.substr(3, 2) * 1) - 1;
                        var ym = ((mm + index > 12) ? (yy * 1) + 1 : yy) +
                                            gw_com_api.prefixNumber(((mm + index > 12) ? mm + index - 12 : mm + index), 2);
                        ymd_fr = ym + "01";
                        ymd_to = ym + "31";
                    }
                    var args = {
                        page: "w_find_orders",
                        param: {
                            ID: gw_com_api.v_Stream.msg_infoOrders,
                            data: {
                                prod_group: gw_com_api.getValue("grdData_현황", v_global.event.row, "prod_group", true),
                                ord_class: gw_com_api.getValue("grdData_현황", v_global.event.row, "ord_class", true),
                                ymd_tp: gw_com_api.getValue("grdData_현황", v_global.event.row, "ymd_tp", true),
                                ymd_fr: ymd_fr,
                                ymd_to: ymd_to,
                                cust_cd: gw_com_api.getValue("grdData_현황", v_global.event.row, "cust_cd", true),
                                cust_dept: gw_com_api.getValue("grdData_현황", v_global.event.row, "cust_dept", true),
                                cust_proc: gw_com_api.getValue("grdData_현황", v_global.event.row, "cust_proc", true),
                                prod_type: gw_com_api.getValue("grdData_현황", v_global.event.row, "prod_type", true)
                            }
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "fr_ym", gw_com_api.getYM());
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
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "fr_ym",
				    argument: "arg_fr_ym"
				}
			],
            remark: [
		        {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "prod_group"}]
		        },
                {
                    element: [{ name: "fr_ym"}]
                }
		    ]
        },
        target: [
            {
                type: "CHART",
                id: "lyrChart_현황"
            }
		],
        key: param.key
    };
    target = {
        type: "GRID",
        id: "grdData_현황",
        option: "TREE",
        header: [],
        handler: {
            success: successRetrieve
        }
    };
    var mm = (gw_com_api.getValue("frmOption", 1, "fr_ym")).substr(4, 2) * 1;
    for (var i = 0; i < 12; i++) {
        target.header.push({
            name: "val" + gw_com_api.prefixNumber(i + 1, 2),
            label: ((mm + i > 12) ? mm + i - 12 : mm + i) + "월"
        });
    }
    args.target.unshift(target);
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
//----------
function successRetrieve(response, param) {

    var ids = gw_com_api.getRowIDs("grdData_현황");
    $.each(ids, function (row_i) {
        if (gw_com_api.getValue("grdData_현황", this, "type", true) == "1") {
            var row = this;
            var data = gw_com_api.getRowData("grdData_현황", this);
            $.each(data, function (col_i) {
                $("#grdData_현황" + "_data").jqGrid('setCell', row, col_i, '', { 'font-size': '10pt', 'font-weight': 'bold', 'color': '#000090' });
            });
        }
    });

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
                    case "w_find_orders":
                        {
                            var ymd_fr = "", ymd_to = "";
                            if (v_global.event.element == "total") {
                                var yy = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(0, 4);
                                var mm = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(4, 2) * 1;
                                ymd_fr = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true) + "01";
                                ymd_to = ((mm + 11 > 12) ? (yy * 1) + 1 : yy) +
                                            gw_com_api.prefixNumber(((mm + 11 > 12) ? mm + 11 - 12 : mm + 11), 2) +
                                            "31";
                            }
                            else {
                                var yy = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(0, 4);
                                var mm = gw_com_api.getValue("grdData_현황", v_global.event.row, "fr_ym", true).substr(4, 2) * 1;
                                var index = (v_global.event.element.substr(3, 2) * 1) - 1;
                                var ym = ((mm + index > 12) ? (yy * 1) + 1 : yy) +
                                            gw_com_api.prefixNumber(((mm + index > 12) ? mm + index - 12 : mm + index), 2);
                                ymd_fr = ym + "01";
                                ymd_to = ym + "31";
                            }
                            args.ID = gw_com_api.v_Stream.msg_infoOrders;
                            args.data = {
                                prod_group: gw_com_api.getValue("grdData_현황", v_global.event.row, "prod_group", true),
                                ord_class: gw_com_api.getValue("grdData_현황", v_global.event.row, "ord_class", true),
                                ymd_tp: gw_com_api.getValue("grdData_현황", v_global.event.row, "ymd_tp", true),
                                ymd_fr: ymd_fr,
                                ymd_to: ymd_to,
                                cust_cd: gw_com_api.getValue("grdData_현황", v_global.event.row, "cust_cd", true),
                                cust_dept: gw_com_api.getValue("grdData_현황", v_global.event.row, "cust_dept", true),
                                cust_proc: gw_com_api.getValue("grdData_현황", v_global.event.row, "cust_proc", true),
                                prod_type: gw_com_api.getValue("grdData_현황", v_global.event.row, "prod_type", true)
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