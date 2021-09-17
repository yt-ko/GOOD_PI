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
				    type: "PAGE", name: "고객사", query: "dddw_cust"
				},
                {
                    type: "PAGE", name: "제품유형", query: "dddw_prodtype"
                },
                {
                    type: "PAGE", name: "Process", query: "dddw_custproc"
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
            title: "조회 조건",
            trans: true,
            border: true,
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
                                style: {
                                    colfloat: "floating"
                                },
                                name: "ymd_fr",
                                label: {
                                    title: "납기일자 :"
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
                                name: "cust_proc",
                                label: {
                                    title: "Process : "
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "Process",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
				            {
				                name: "delay_yn",
				                title: "납기지연",
				                label: {
				                    title: "납기지연 :"
				                },
				                editable: {
				                    type: "checkbox",
				                    value: "1",
				                    offval: "%"
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
            query: "w_pom8025_M_1",
            title: "프로젝트 현황",
            height: "100%",
            show: false,
            selectable: true,
            key: true,
            element: [
				{
				    name: "ord_no",
                    hidden: true
				},
                {
                    name: "proj_desc",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_내역",
            query: "w_pom8025_S_1",
            title: "프로젝트 납기표",
            caption: true,
            height: 412,
            show: true,
            selectable: true,
            dynamic: true,
            key: true,
            element: [
				{
				    header: "협력사명",
				    name: "supp_nm",
				    width: 150,
				    align: "left"
				},
                {
                    header: "품목명",
                    name: "part_nm",
                    width: 200,
                    align: "left"
                },
                {
                    header: "생산요청",
                    name: "req_date",
                    width: 60,
                    align: "center"
                },
                {
                    header: "납기예정",
                    name: "plan_date",
                    width: 60,
                    align: "center"
                },
                {
                    header: "차이",
                    name: "date_diff",
                    width: 40,
                    mask: "numeric-int",
                    align: "center"
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
				    id: "grdData_내역",
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

            gw_com_api.messageBox([
                { text: "프로젝트 납기표를 이메일로 발송합니다." + "<br>" },
                { text: "계속 하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { result: true });

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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: +6 }));
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
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "cust_proc",
				    argument: "arg_cust_proc"
				}
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
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "cust_proc"}]
		        }		        
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
function processLink(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_ord_no", value: param.key },
                { name: "arg_delay", value: gw_com_api.getValue("frmOption", 1, "delay_yn") },
                { name: "arg_rcvd", value: "0" }
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: param.target
			}
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInform(param) {

    var args = {
        url: gw_com_module.v_Current.window + ".aspx/" + "Mail",
        procedure: "PROC_MAIL_SRM_PRJPUR",
        nomessage: true/*,
        argument: [
            { name: "eccb_no", value: gw_com_api.getValue("frmData_정보", 1, "eccb_no") }
        ]*/,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: successInform
        }
    };
    gw_com_module.callProcedure(args);

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
    if (ids.length > 0) {
        var contents = "<tr>";
        $.each(ids, function (cnt) {
            contents = contents +
                "<td>" +
                    "<div id='grdData_내역_" + cnt + "'></div>" +
                "</td>"
        });
        contents = contents + "</tr>";
        $("#grdData_내역").html("");
        $("#lyrData_내역").html(contents);

        var args = {
            query: "w_pom8025_S_1",
            title: "프로젝트 납기표",
            caption: false,
            width: 552,
            height: 393,
            show: true,
            dynamic: true,
            key: true,
            color: {
                row: true
            },
            element: [
			    {
			        header: "협력사명",
			        name: "supp_nm",
			        width: 150,
			        align: "left"
			    },
                {
                    header: "품목명",
                    name: "part_nm",
                    width: 200,
                    align: "left"
                },
                {
                    header: "생산요청",
                    name: "req_date",
                    width: 60,
                    align: "center"
                },
                {
                    header: "납기예정",
                    name: "plan_date",
                    width: 60,
                    align: "center"
                },
                {
                    header: "차이",
                    name: "date_diff",
                    width: 40,
                    mask: "numeric-int",
                    align: "center"
                },
                {
                    name: "color",
                    hidden: true
                }
		    ]
        };
        $.each(ids, function (cnt) {
            args.targetid = "grdData_내역_" + cnt;
            gw_com_module.gridCreate(args);
        });

        $.each(ids, function (cnt) {
            processLink({
                key: gw_com_api.getValue("grdData_현황", this, "ord_no", true),
                target: "grdData_내역_" + cnt
            });
            gw_com_api.setCaption("grdData_내역_" + cnt, "◈ " + gw_com_api.getValue("grdData_현황", this, "proj_desc", true), true);
        });
    }


    /*
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
    */

}
//----------
function successInform(response) {

    /*
    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350);
    */

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
                                processSave(param.data.arg);
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processInform(param.data.arg);
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