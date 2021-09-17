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
        act: null,
        entry: null,
        object: null
    }
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
    ready: function() {


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "조회유형", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM52" }
                    ]
                },
                {
				    type: "INLINE", name: "구분",
				    data: [
						{ title: "수요예측", value: "1" },
						{ title: "실오더", value: "4" }
					]
				},
                {
                    type: "PAGE", name: "고객사", query: "dddw_cust"
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
    UI: function() {

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
            targetid: "frmOption_1",
            type: "FREE",
            show: true,
            trans: true,
            border: false,
            align: "left",
            editable: {
                bind: "open"
            },
            content: {
                row: [
                    {
                        element: [
                            {
				                name: "review",
				                label: {
				                    title: "유형 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "조회유형",
                                        validate: {
                                            rule: "required",
                                            message: "조회유형"
                                        }
				                    }
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
            targetid: "frmOption_2",
            type: "FREE",
            trans: true,
            border: true,
            editable: {
                bind: "open",
                focus: "cust_cd",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
				                name: "due_ymd_fr",
				                value: gw_com_api.getDate("", {month:-1}),
				                label: {
				                    title: "납기예정일 : "
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    validate: {
				                        rule: "required",
				                        message: "납기예정일 (FROM)"
				                    }
				                }
				            },
				            {
				                name: "due_ymd_to",
				                value: gw_com_api.getDate(""),
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    validate: {
				                        rule: "required",
				                        message: "납기예정일 (TO)"
				                    }
				                }
				            }
                            ,
				            {
				                name: "cust_cd",
				                label: {
				                    title: "고객사 : "
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
				            }
                        ]
                    },
                    {
                        element: [
                            {
				                name: "ord_class",
				                label: {
				                    title: "구분 : "
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "구분",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
                                        validate: {
                                            rule: "required",
                                            message: "구분"
                                        }
				                    }
				                }
				            }
                            ,
                            {
                                name: "proj_no",
				                label: {
				                    title: "Project No. : "
				                },
                                editable: {
                                    type: "text",
                                    size: 12,
				                    maxlength: 20
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
            targetid: "grdData_프로젝트별납품계획",
            query: "w_pom4030_R001",
            title: "Project별 납품 계획 현황",
            caption: true,
            height: "397",
            dynamic: true,
            show: true,
            selectable: true,
            element: [
                {
				    header: "구분",
				    name: "ord_class_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_cd_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Line",
				    name: "cust_line",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Process",
				    name: "cust_proc",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Project No",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "center"
				},
				{
				    header: "납기예정일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "협력사",
				    name: "bp_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "품목코드",
				    name: "item_cd",
				    width: 80,
				    align: "center"
				},
				{
				    header: "품목명",
				    name: "item_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "구매요청No",
				    name: "pur_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "입고요청일",
				    name: "req_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "요청수량",
				    name: "pur_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "예정일",
				    name: "plan_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "가능수량",
				    name: "plan_qty",
				    width: 70,
				    align: "center"
				}
			]/*,
			subgrid: {
			    query: "w_pom4030_D_1",
			    height: "100%",
			    argument: [
			        { name: "pur_no", argument: "arg_pur_no" }
			    ],
			    element: [
				    {
				        header: "상태",
				        name: "state",
				        width: 60,
				        align: "center"
				    },
				    {
				        header: "납품가능일",
				        name: "plan_date",
				        width: 80,
				        align: "center",
				        mask: "date-ymd"
				    },
				    {
				        header: "수량",
				        name: "plan_qty",
				        width: 60,
				        align: "center"
				    },
				    {
				        header: "등록일",
				        name: "reg_date",
				        width: 160,
				        align: "center"
				    },
				    {
				        header: "비고",
				        name: "rmk",
				        width: 300,
				        align: "left"
				    }
			    ]
			}*/
		};
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_프로젝트별납품실적",
            query: "w_pom4030_R022",
            title: "Project별 납품 실적 현황",
            caption: true,
            height: "397",
            dynamic: true,
            show: false,
            selectable: true,
            element: [
                {
				    header: "Process",
				    name: "cust_proc",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Project No",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "center"
				},
				{
				    header: "납기예정일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "협력사",
				    name: "bp_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "품목코드",
				    name: "item_cd",
				    width: 80,
				    align: "center"
				},
				{
				    header: "품목명",
				    name: "item_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "구매요청No",
				    name: "pur_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "입고요청일",
				    name: "req_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "요청수량",
				    name: "pur_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "납품일자",
				    name: "dlv_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "납품수량",
				    name: "dlv_qty",
				    width: 70,
				    align: "center"
				}
			]
		};
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_프로젝트별협력사요청",
            query: "w_pom4030_R042",
            title: "Project별 협력사 구매 요청 현황",
            caption: true,
            height: "397",
            dynamic: true,
            show: false,
            selectable: true,
            element: [
                {
				    header: "구분",
				    name: "ord_class_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_cd_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Line",
				    name: "cust_line",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Process",
				    name: "cust_proc",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Project No",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "center"
				},
				{
				    header: "납기예정일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "협력사",
				    name: "bp_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "구매요청품목수",
				    name: "pur_item",
				    width: 90,
				    align: "center"
				},
				{
				    header: "미입고품목수",
				    name: "delay_item",
				    width: 80,
				    align: "center"
				}
			]
		};
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_협력사별재고",
            query: "w_pom4030_R031",
            title: "협력사별 재고 현황",
            caption: true,
            height: "397",
            dynamic: true,
            show: false,
            selectable: true,
            element: [
				{
				    header: "품목코드",
				    name: "item_cd",
				    width: 80,
				    align: "center"
				},
				{
				    header: "품목명",
				    name: "item_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "basic_unit",
				    width: 70,
				    align: "center"
				},
				{
				    header: "재고수량",
				    name: "item_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Lead Time",
				    name: "lead_time",
				    width: 80,
				    align: "center"
				},
				{
				    header: "등록일",
				    name: "stock_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				}
			]
		};
        //----------
        gw_com_module.gridCreate(args);        
        //=====================================================================================
        var args = {
            targetid: "grdData_자재별납품계획",
            query: "w_pom4030_R021",
            title: "자재별 납품 계획 현황",
            caption: true,
            height: "397",
            dynamic: true,
            show: false,
            selectable: true,
            element: [
				{
				    header: "품목코드",
				    name: "item_cd",
				    width: 80,
				    align: "center"
				},
				{
				    header: "품목명",
				    name: "item_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "구분",
				    name: "ord_class_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_cd_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Line",
				    name: "cust_line",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Process",
				    name: "cust_proc",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Project No",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "center"
				},
				{
				    header: "납기예정일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "협력사",
				    name: "bp_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "구매요청No",
				    name: "pur_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "입고요청일",
				    name: "req_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "요청수량",
				    name: "pur_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "예정일",
				    name: "plan_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "가능수량",
				    name: "plan_qty",
				    width: 70,
				    align: "center"
				}
			]
		};
        //----------
        gw_com_module.gridCreate(args); 
        //=====================================================================================
        var args = {
            targetid: "grdData_자재별납품실적",
            query: "w_pom4030_R022",
            title: "자재별 납품 실적 현황",
            caption: true,
            height: "397",
            dynamic: true,
            show: false,
            selectable: true,
            element: [
				{
				    header: "품목코드",
				    name: "item_cd",
				    width: 80,
				    align: "center"
				},
				{
				    header: "품목명",
				    name: "item_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "구분",
				    name: "ord_class_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_cd_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Line",
				    name: "cust_line",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Process",
				    name: "cust_proc",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Project No",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "center"
				},
				{
				    header: "납기예정일",
				    name: "due_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "협력사",
				    name: "bp_nm",
				    width: 200,
				    align: "center"
				},
				{
				    header: "구매요청No",
				    name: "pur_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "입고요청일",
				    name: "req_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "요청수량",
				    name: "pur_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "납품일자",
				    name: "dlv_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "납품수량",
				    name: "dlv_qty",
				    width: 70,
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
				    id: "grdData_프로젝트별납품계획",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_프로젝트별납품실적",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_프로젝트별협력사요청",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_협력사별재고",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_자재별납품계획",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_자재별납품실적",
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
    procedure: function() {

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
            targetid: "frmOption_1",
            event: "itemchanged",
            handler: itemchanged_frmOption_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_2_실행
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
					    id: "frmOption_2",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }

        //----------
        function click_lyrMenu_닫기(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_closePage
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function itemchanged_frmOption_1(ui) {

            gw_com_api.hide(v_global.process.object);
            switch (ui.value.current) {
                case "R001":
                    v_global.process.object = "grdData_프로젝트별납품계획";
                    break;
                case "R002":
                    v_global.process.object = "grdData_프로젝트별납품실적";
                    break;
                case "R042":
                    v_global.process.object = "grdData_프로젝트별협력사요청";
                    break;
                case "R031":
                    v_global.process.object = "grdData_협력사별재고";
                    break;
                case "R021":
                    v_global.process.object = "grdData_자재별납품계획";
                    break;
                case "R022":
                    v_global.process.object = "grdData_자재별납품실적";
                    break;
            }
            gw_com_api.show(v_global.process.object);
            var param = {
                target: [ { type: "GRID", id: v_global.process.object, offset: 8 } ]
            };
            gw_com_module.objResize(param);

        }
        //----------
        function click_frmOption_2_실행(ui) {

            processRetrieve();

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        v_global.process.object = "grdData_프로젝트별납품계획";

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve() {

    var review = gw_com_api.getValue("frmOption_1", 1, "review");
    switch (review) {
        case "R031":
            {
                var args = { source: { type: "FORM", id: "frmOption_2", hide: true, 
                                       element: [ { name: "cust_cd", argument: "argCust_cd" } ],
			                 remark: [ { element: [ { name: "cust_cd"}] } ]
                    },
                    target: [
                        {
                            type: "GRID",
                            id: v_global.process.object,
		                    select: 1
	                    }
	                ]
                };
            }
            break;
        default:
                var args = { source: { type: "FORM", id: "frmOption_2", hide: true, 
                                       element: [ { name: "due_ymd_fr", argument: "argDue_ymd_fr" },
				                                  { name: "due_ymd_to", argument: "argDue_ymd_to" },
				                                  { name: "cust_cd", argument: "argDlv_co_cd" } ],
			                 remark: [ { infix: "~", element: [ { name: "due_ymd_fr" }, { name: "due_ymd_to" } ] },
		                               { element: [ { name: "cust_cd"}] } ]
                    },
                    target: [
                        {
                            type: "GRID",
                            id: v_global.process.object,
		                    select: 1
	                    }
	                ]
                };
    }
    gw_com_module.objRetrieve(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//