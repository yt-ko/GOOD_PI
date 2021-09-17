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
            show: true,
            trans: true,
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
		                        name: "part_cd",
		                        label: {
		                            title: "자재코드 : "
		                        },
		                        editable: {
		                            type: "text",
		                            size: 10,
		                            maxlength: 20
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
                                    maxlength: 20
                                }
                            },                            
		     	            {
		     	                name: "hold_diff",
		     	                title: "보유부족",
		     	                label: {
		     	                    title: "보유부족 :"
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
            targetid: "grdData_재고",
            query: "w_pom9015_M_1",
            title: "안전재고 내역",
            //caption: true,
            height: 265,
            show: true,
            selectable: true,
            group: [
                { element: "prod_type_nm", show: false }
            ],
            element: [
                {
                    header: "제품유형",
                    name: "prod_type_nm",
                    width: 80,
                    align: "center"
                },
				{
                    lead: "품번",
				    header: "자재코드",
				    name: "part_cd",
				    width: 90,
				    align: "center"
				},
				{
                    lead: "품명",
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
                    lead: "장비별소요량",
				    header: "장비별<br /><div style='margin-top:4px;'>소요량</div>",
				    name: "take_qty",
				    width: 64,
				    align: "center",
				    mask: "numeric-int"
				},
				{
                    lead: "필요수량(장납기)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(장납기)</div>",
				    name: "need_qty_term",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "필요수량(CS)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(CS)</div>",
				    name: "need_qty_cs",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "필요수량(유상판매)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(유상판매)</div>",
				    name: "need_qty_cost",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "필요수량(소계)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(소계)</div>",
				    name: "need_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" },
				},
				{
                    lead: "요청수량",
				    header: "요청수량",
				    name: "req_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#FAE7E7" },
				},
				{
                    lead: "보유수량(당사)",
				    header: "보유수량<br /><div style='margin-top:4px;'>(당사)</div>",
				    name: "head_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#E7FAE7" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "보유수량(협력사)",
				    header: "보유수량<br /><div style='margin-top:4px;'>(협력사)</div>",
				    name: "supp_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#E7FAE7" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "보유수량(변경일시)",
				    header: "보유수량<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "hold_upd_dt",
				    width: 160,
				    align: "center",
				    style: { bgcolor: "#E7FAE7" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "보유수량(소계)",
				    header: "보유수량<br /><div style='margin-top:4px;'>(소계)</div>",
				    name: "hold_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#E7FAE7" },
				},
				{
                    lead: "보유수량(과부족)",
				    header: "보유수량<br /><div style='margin-top:4px;'>(과부족)</div>",
				    name: "hold_diff",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#E7FAE7" },
				},
				{
                    lead: "1차계획(수량)",
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_1_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#FAFACA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "1차계획(입고일정)",
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_1_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd",
				    style: { bgcolor: "#FAFACA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "1차계획(변경일시)",
				    header: "1차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_1_upd_dt",
				    width: 160,
				    align: "center",
				    style: { bgcolor: "#FAFACA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "2차계획(수량)",
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_2_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#FAFACA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "2차계획(입고일정)",
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_2_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd",
				    style: { bgcolor: "#FAFACA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "2차계획(변경일시)",
				    header: "2차확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_2_upd_dt",
				    width: 160,
				    align: "center",
				    style: { bgcolor: "#FAFACA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "당사계획(수량)",
				    header: "당사확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#FAFABA" },
				},
				{
                    lead: "당사계획(입고일정)",
				    header: "당사확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd",
				    style: { bgcolor: "#FAFABA" },
				    hidden: true,
                    excel: true
				},
				{
                    lead: "당사계획(변경일시)",
				    header: "당사확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_upd_dt",
				    width: 160,
				    align: "center",
				    style: { bgcolor: "#FAFABA" },
				    hidden: true,
                    excel: true
				},
				{
				    header: "담당자",
				    name: "emp_no",
				    width: 70,
				    align: "center"
				},
                {
                    lead: "협력사",
                    header: "협력사명",
                    name: "supp_nm",
                    width: 180,
                    align: "left"
                },
				{
				    header: "비고",
				    name: "rmk",
				    width: 600,
				    align: "left",
				    hidden: true,
                    excel: true
				},
				{
				    name: "prod_type",
				    hidden: true
				},
				{
				    name: "bgcolor",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_비고",
            query: "w_pom9012_S_1",
            title: "특이 사항",
            caption: true,
            height: 79,
            pager: false,
            show: true,
            selectable: true,
            key: false,
            editable: {
                multi: true,
                bind: "select",
                focus: "rmk",
                validate: true
            },
            element: [
                {
                    header: "제품유형",
                    name: "prod_type",
                    width: 90,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    header: "등록일자",
                    name: "reg_date",
                    width: 80,
                    align: "center",
                    mask: "date-ymd",
                    editable: {
                        type: "hidden"
                    }
                },
				{
				    header: "비고",
				    name: "rmk",
				    width: 660,
				    align: "left",
                    multiline: true,
				    editable: {
				        type: "textarea",
                        rows: 5,
				        validate: {
				            rule: "required",
				            message: "비고"
				        }
				    }
				},
		        {
		            header: "등록자",
		            name: "upd_usr",
		            width: 70,
		            align: "center"
		        },
		        {
		            name: "seq",
		            hidden: true,
		            editable: {
		                type: "hidden"
		            }
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
				    id: "grdData_재고",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_비고",
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
            targetid: "grdData_재고",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_재고
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

            $("#grdData_재고_data").jqGrid('groupingGroupBy', "prod_type_nm");
            //checkClosable({});

        }
        //----------
        function itemchanged_frmView(ui) {

            switch (ui.element) {
                case "type":
                    {
                        if (ui.value.current == "S")
                            gw_com_api.hideCols("grdData_재고", [
                                "need_qty_term", "need_qty_cs", "need_qty_cost",
                                "head_qty", "supp_qty", "hold_upd_dt",
                                "plan_1_qty", "plan_1_date", "plan_1_upd_dt",
                                "plan_2_qty", "plan_2_date", "plan_2_upd_dt",
                                "plan_date", "plan_upd_dt",
                                "rmk"
                            ]);
                        else
                            gw_com_api.showCols("grdData_재고", [
                                "need_qty_term", "need_qty_cs", "need_qty_cost",
                                "head_qty", "supp_qty", "hold_upd_dt",
                                "plan_1_qty", "plan_1_date", "plan_1_upd_dt",
                                "plan_2_qty", "plan_2_date", "plan_2_upd_dt",
                                "plan_date", "plan_upd_dt",
                                "rmk"
                            ]);
                        gw_com_module.objResize({
                            target: [{
                                type: "GRID", id: "grdData_재고", offset: 8
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
        //----------
        function rowselected_grdData_재고(ui) {

            if (v_global.logic.key 
                != gw_com_api.getCellValue(ui.type, ui.object, ui.row, "prod_type")) {
                processLink({});
                v_global.logic.key = gw_com_api.getCellValue(ui.type, ui.object, ui.row, "prod_type");
            }

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "prod_type", gw_com_api.getPageParameter("prod_type"));
        }
        //----------
        gw_com_module.startPage();
        //----------
        v_global.logic.key = null;
        if (v_global.process.param != "")
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
function checkClosable(param) {

    closeOption({});

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
    if (gw_com_module.objValidate(args) == false)
        return false;

    v_global.logic.key = null;
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "supp_cd",
                    argument: "arg_supp_cd"
                },
                {
                    name: "supp_nm",
                    argument: "arg_supp_nm"
                },
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "part_cd",
				    argument: "arg_part_cd"
				},
				{
				    name: "hold_diff",
				    argument: "arg_hold_diff"
				}
			],
            remark: [
                {
                    element: [{ name: "supp_cd"}]
                },
			    {
			        element: [{ name: "supp_nm"}]
			    },
		        {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "part_cd"}]
		        },
		        {
		            element: [{ name: "hold_diff"}]
		        }
		    ]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_재고",
                select: true
            }
        ],
        clear: [
            {
                type: "GRID",
                id: "grdData_비고"
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
            id: "grdData_재고",
            row: "selected",
            block: true,
            element: [
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				}
			]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_비고"
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
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
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