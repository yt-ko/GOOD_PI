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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "이력조회",
				    value: "이력조회",
				    icon: "조회"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_현황",
            query: "w_srm1011_M_1",
            title: "재고 현황",
            caption: true,
            height: 230,
            show: true,
            dynamic: true,
            selectable: true,
            color: {
                rule: [
                    {
                        bgcolor: "#FAE7E7",
                        element: ["req_qty", "req_date"]
                    },
                    {
                        bgcolor: "#E7FAE7",
                        element: ["hold_qty", "hold_upd_dt"]
                    },
                    {
                        bgcolor: "#FAFACA",
                        element: ["plan_1_qty", "plan_1_date", "plan_1_upd_dt"]
                    },
                    {
                        bgcolor: "#FAFACA",
                        element: ["plan_2_qty", "plan_2_date", "plan_2_upd_dt"]
                    }
                ]
            },
            editable: {
                bind: "select",
                focus: "hold_qty",
                multi: true,
                validate: true
            },
            element: [
				{
				    header: "품번",
				    name: "item_cd",
				    width: 90,
				    align: "center",
				    editable: { type: "hidden" }
				},
				{
				    header: "품명",
				    name: "item_nm",
				    width: 225,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "item_spec",
				    width: 225,
				    align: "left"
				}/*,
				{
				    header: "단위",
				    name: "item_unit",
				    width: 40,
				    align: "center"
				}*/,
				{
				    header: "요청수량",
				    name: "req_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "요청일자",
				    name: "req_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "보유<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "hold_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    editable: { type: "text" }
				},
				{
				    header: "보유<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "hold_upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_1_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int",
				    editable: { type: "text" }
				},
				{
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_1_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: { type: "text" }
				},
				{
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_1_upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_2_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int",
				    editable: { type: "text" }
				},
				{
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_2_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: { type: "text" }
				},
				{
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_2_upd_dt",
				    width: 160,
				    align: "center"
				},
                {
                    header: "비고",
                    name: "rmk",
                    width: 600,
                    align: "left",
                    editable: {
                        type: "text"
                    }
                },
				{
				    name: "cust_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "prod_type",
				    hidden: true,
				    editable: { type: "hidden" }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_이력",
            query: "w_srm1011_D_1",
            title: "재고 이력",
            caption: true,
            height: 84,
            pager: false,
            number: true,
            show: true,
            dynamic: true,
            selectable: true,
            key: true,
            color: {
                rule: [
                    {
                        bgcolor: "#FAE7E7",
                        element: ["req_qty", "req_date"]
                    },
                    {
                        bgcolor: "#E7FAE7",
                        element: ["hold_qty", "hold_upd_dt"]
                    },
                    {
                        bgcolor: "#FAFACA",
                        element: ["plan_1_qty", "plan_1_date", "plan_1_upd_dt"]
                    },
                    {
                        bgcolor: "#FAFACA",
                        element: ["plan_2_qty", "plan_2_date", "plan_2_upd_dt"]
                    }
                ]
            },
            element: [
				{
				    header: "등록일자",
				    name: "stock_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "요청수량",
				    name: "req_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "요청일자",
				    name: "req_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "보유<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "hold_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "보유<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "hold_upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_1_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_1_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_1_upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_2_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_2_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_2_upd_dt",
				    width: 160,
				    align: "center"
				},
                {
                    header: "비고",
                    name: "rmk",
                    width: 600,
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
				},
				{
				    type: "GRID",
				    id: "grdData_이력",
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
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_1_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "이력조회",
            event: "click",
            handler: click_lyrMenu_2_이력조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_현황
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회() {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_이력조회() {

            if (!checkManipulate()) return false;

            processLink({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            processClear({});

        }
        //----------
        function itemchanged_grdData_현황(ui) {

            switch (ui.element) {
                case "hold_qty":
                case "plan_1_qty":
                case "plan_2_qty":
                    {
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "req_qty"));
                        var sum = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "hold_qty"))
                                    + parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "plan_1_qty"))
                                    + parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "plan_2_qty"));
                        if (sum > qty) {
                            gw_com_api.messageBox([
                                { text: "보유 수량과 계획 수량의 합은" },
                                { text: "요청 수량보다 작거나 같아야만 합니다." }
                            ]);
                            gw_com_api.setCellValue(ui.type, ui.object, ui.row, ui.element, ui.value.current - (sum - qty));
                        }
                    }
                    break;
            }
            return true;

        };

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
function checkManipulate(param) {

    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_supp_cd", value: gw_com_module.v_Session.EMP_NO },
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_이력"
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
            id: "grdData_현황",
            row: "selected",
            element: [
                {
                    name: "prod_type",
                    argument: "arg_prod_type"
                },
                {
                    name: "item_cd",
                    argument: "arg_item_cd"
                }
			],
            argument: [
                { name: "arg_supp_cd", value: gw_com_module.v_Session.EMP_NO },
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_이력",
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
			    id: "grdData_현황"
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
                id: "grdData_이력"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
        });
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
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//