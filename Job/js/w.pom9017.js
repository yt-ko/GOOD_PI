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
				    type: "PAGE", name: "제품유형", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "ISCM25" }
                    ]
				},
                {
                    type: "INLINE", name: "보기",
                    data: [
						{ title: "축약", value: "S" },
						{ title: "확장", value: "L" }
					]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);
        
        // 조회 대상 월 설정 : 전전월 부터 당월 까지
        var sTempDate = gw_com_api.getDate("", { month: 0 });
        v_global.logic.mon_1 = sTempDate.substr(4, 2);	//전월
        sTempDate = gw_com_api.addDate("m", 1, sTempDate, "");
        v_global.logic.mon_2 = sTempDate.substr(4, 2);	//당월
        sTempDate = gw_com_api.addDate("m", 1, sTempDate, "");
        v_global.logic.mon_3 = sTempDate.substr(4, 2);	//익월

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
				                    title: "보기 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "보기"
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
            border: true,
            margin: 15,
            show: true,
            editable: {
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
				                        memory: "제품유형",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "suffix",
				                value: "억",
				                label: {
				                    title: "금액단위 :"
				                },
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
        var args = { targetid: "grdData_현황", query: "w_pom9017_M_1", title: "안전재고 현황",
            height: 414, show: true, selectable: true, key: true,
            element: [
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 90,
				    align: "center"
				},
				{
				    lead: "필요재고(장납기-수량)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(장납기-수량)</div>",
				    name: "need_cnt_term",
				    width: 85,
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "품목", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
				    excel: true
				},
				{
				    lead: "필요재고(장납기-금액)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(장납기-금액)</div>",
				    name: "need_amt_term",
				    width: 85,
				    align: "right",
				    fix: {
				        mask: "numeric-float", suffix: "억", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
				    excel: true
				},
				{
				    lead: "필요재고(CS-수량)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(CS-수량)</div>",
				    name: "need_cnt_cs",
				    width: 85,
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "품목", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
				    excel: true
				},
				{
				    lead: "필요재고(CS-금액)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(CS-금액)</div>",
				    name: "need_amt_cs",
				    width: 85,
				    align: "center",
				    align: "right",
				    fix: {
				        mask: "numeric-float", suffix: "억", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
				    excel: true
				},
				{
				    lead: "필요재고(판매-수량)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(판매-수량)</div>",
				    name: "need_cnt_cost",
				    width: 85,
				    align: "center",
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "품목", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
				    excel: true
				},
				{
				    lead: "필요재고(판매-금액)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(판매-금액)</div>",
				    name: "need_amt_cost",
				    width: 85,
				    align: "center",
				    align: "right",
				    fix: {
				        mask: "numeric-float", suffix: "억", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
				    excel: true
				},
				{
				    lead: "필요재고(수량-계)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(수량-계)</div>",
				    name: "need_cnt",
				    width: 85,
				    align: "center",
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "품목", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" }
				},
				{
				    lead: "필요재고(금액-계)",
				    header: "필요재고<br /><div style='margin-top:4px;'>(금액-계)</div>",
				    name: "need_amt",
				    width: 85,
				    align: "center",
				    align: "right",
				    fix: {
				        mask: "numeric-float", suffix: "억", margin: 3
				    },
				    style: { bgcolor: "#EFEFFA" }
				},
				{
				    lead: "재고보유율(현재)",
				    header: "재고보유율<br /><div style='margin-top:4px;'>(현재)</div>",
				    name: "hold_rate",
				    width: 70,
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "%", margin: 3
				    },
				    style: { bgcolor: "#E7FAE7" }
				},
				{
				    lead: "재고보유율(" + v_global.logic.mon_1 + "월)",
				    header: "재고보유율<br /><div style='margin-top:4px;'>(" + v_global.logic.mon_1 + "월)</div>",
				    name: "hold_rate_1",
				    width: 70,
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "%", margin: 3
				    },
				    style: { bgcolor: "#E7FAE7" }
				},
				{
				    lead: "재고보유율(" + v_global.logic.mon_2 + "월)",
				    header: "재고보유율<br /><div style='margin-top:4px;'>(" + v_global.logic.mon_2 + "월)</div>",
				    name: "hold_rate_2",
				    width: 70,
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "%", margin: 3
				    },
				    style: { bgcolor: "#E7FAE7" }
				},
				{
				    lead: "재고보유율(" + v_global.logic.mon_3 + "월)",
				    header: "재고보유율<br /><div style='margin-top:4px;'>(" + v_global.logic.mon_3 + "월)</div>",
				    name: "hold_rate_3",
				    width: 70,
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "%", margin: 3
				    },
				    style: { bgcolor: "#E7FAE7" }
				},
				{
				    lead: "당사보유필요(수량)",
				    header: "당사보유필요<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_cnt",
				    width: 85,
				    align: "center",
				    align: "right",
				    fix: {
				        mask: "numeric-int", suffix: "품목", margin: 3
				    },
				    style: { bgcolor: "#FAFACA" }
				},
				{
				    lead: "당사보유필요(금액)",
				    header: "당사보유필요<br /><div style='margin-top:4px;'>(금액)</div>",
				    name: "plan_amt",
				    width: 85,
				    align: "center",
				    align: "right",
				    fix: {
				        mask: "numeric-float", suffix: "억", margin: 3
				    },
				    style: { bgcolor: "#FAFACA" }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 500,
				    align: "left"
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
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmView",
            event: "itemchanged",
            handler: itemchanged_frmView
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
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function itemchanged_frmView(ui) {

            switch (ui.element) {
                case "type":
                    {
                        if (ui.value.current == "S")
                            gw_com_api.hideCols("grdData_현황", [
                                "need_cnt_term", "need_amt_term",
                                "need_cnt_cs", "need_amt_cs",
                                "need_cnt_cost", "need_amt_cost"
                            ]);
                        else
                            gw_com_api.showCols("grdData_현황", [
                                "need_cnt_term", "need_amt_term",
                                "need_cnt_cs", "need_amt_cs",
                                "need_cnt_cost", "need_amt_cost"
                            ]);
                        gw_com_module.objResize({
                            target: [{
                                type: "GRID", id: "grdData_현황", offset: 8
                            }]
                        });
                    }
                    break;
            }

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
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "w_pom9015",
                    title: "안전재고 내역",
                    param: [
                        { name: "prod_type", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

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
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "prod_type", argument: "arg_prod_type" }
			],
            remark: [
		        { element: [{ name: "prod_type"}] },
		        { element: [{ name: "suffix"}] }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    handler: {
			        success: successRetrieve
			    }
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
//----------
function successRetrieve(response, param) {

    var ids = gw_com_api.getRowIDs("grdData_현황");
    var cnt = 0;
    var sum = {
        need_cnt_term: 0,
        need_amt_term: 0,
        need_cnt_cs: 0,
        need_amt_cs: 0,
        need_cnt_cost: 0,
        need_amt_cost: 0,
        need_cnt: 0,
        need_amt: 0,
        hold_rate: 0,
        hold_rate_1: 0,
        hold_rate_2: 0,
        hold_rate_3: 0,
        plan_cnt: 0,
        plan_amt: 0
    };
    $.each(ids, function () {
        cnt = cnt + 1;
        sum.need_cnt_term = sum.need_cnt_term + parseInt(gw_com_api.getValue("grdData_현황", this, "need_cnt_term", true));
        sum.need_amt_term = sum.need_amt_term + parseFloat(gw_com_api.getValue("grdData_현황", this, "need_amt_term", true));
        sum.need_cnt_cs = sum.need_cnt_cs + parseInt(gw_com_api.getValue("grdData_현황", this, "need_cnt_cs", true));
        sum.need_amt_cs = sum.need_amt_cs + parseFloat(gw_com_api.getValue("grdData_현황", this, "need_amt_cs", true));
        sum.need_cnt_cost = sum.need_cnt_cost + parseInt(gw_com_api.getValue("grdData_현황", this, "need_cnt_cost", true));
        sum.need_amt_cost = sum.need_amt_cost + parseFloat(gw_com_api.getValue("grdData_현황", this, "need_amt_cost", true));
        sum.need_cnt = sum.need_cnt + parseInt(gw_com_api.getValue("grdData_현황", this, "need_cnt", true));
        sum.need_amt = sum.need_amt + parseFloat(gw_com_api.getValue("grdData_현황", this, "need_amt", true));
        sum.hold_rate = sum.hold_rate + parseFloat(gw_com_api.getValue("grdData_현황", this, "hold_rate", true));
        sum.hold_rate_1 = sum.hold_rate_1 + parseFloat(gw_com_api.getValue("grdData_현황", this, "hold_rate_1", true));
        sum.hold_rate_2 = sum.hold_rate_2 + parseFloat(gw_com_api.getValue("grdData_현황", this, "hold_rate_2", true));
        sum.hold_rate_3 = sum.hold_rate_3 + parseFloat(gw_com_api.getValue("grdData_현황", this, "hold_rate_3", true));
        sum.plan_cnt = sum.plan_cnt + parseInt(gw_com_api.getValue("grdData_현황", this, "plan_cnt", true));
        sum.plan_amt = sum.plan_amt + parseFloat(gw_com_api.getValue("grdData_현황", this, "plan_amt", true));
    });
    var args = {
        targetid: "grdData_현황",
        data: [
                    { name: "prod_type", value: "재고 합계" },
                    { name: "need_cnt_term", value: "" + sum.need_cnt_term },
                    { name: "need_amt_term", value: "" + sum.need_amt_term },
                    { name: "need_cnt_cs", value: "" + sum.need_cnt_cs },
                    { name: "need_amt_cs", value: "" + sum.need_amt_cs },
                    { name: "need_cnt_cost", value: "" + sum.need_cnt_cost },
                    { name: "need_amt_cost", value: "" + sum.need_amt_cost },
                    { name: "need_cnt", value: "" + sum.need_cnt },
                    { name: "need_amt", value: "" + sum.need_amt },
                    { name: "hold_rate", value: "" + (sum.hold_rate / cnt) },
                    { name: "hold_rate_1", value: "" + (sum.hold_rate_1 / cnt) },
                    { name: "hold_rate_2", value: "" + (sum.hold_rate_2 / cnt) },
                    { name: "hold_rate_3", value: "" + (sum.hold_rate_3 / cnt) },
                    { name: "plan_cnt", value: "" + sum.plan_cnt },
                    { name: "plan_amt", value: "" + sum.plan_amt }
                ]
    };
    var row = gw_com_module.gridInsert(args);
    var data = gw_com_api.getRowData("grdData_현황", row);
    $.each(data, function (col_i) {
        $("#grdData_현황" + "_data").jqGrid('setCell', row, col_i, '', { 'color': '#0000C0' });
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
                    case "w_find_as":
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