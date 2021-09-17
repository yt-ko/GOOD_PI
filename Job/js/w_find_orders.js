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
                    type: "INLINE", name: "기간구분",
                    data: [
			            { title: "납기예정일", value: "DUE" },
			            { title: "제품출하일", value: "DLV" }
		            ]
                },
                {
                    type: "PAGE", name: "영업구분", query: "dddw_ordclass"
                },
                {
                    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM24" }
                    ]
                },
                {
                    type: "PAGE", name: "고객사", query: "dddw_cust"
                },
				{
				    type: "PAGE", name: "LINE", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
                {
                    type: "PAGE", name: "PROCESS", query: "dddw_custproc"
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
                },
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
                focus: "ymd_fr",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_tp",
                                value: "DUE",
                                label: {
                                    title: "기간구분 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "기간구분"
                                    }
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "ymd_fr",
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
				            }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "ord_class",
                                label: {
                                    title: "영업구분 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "영업구분",
                                        unshift: [
			                                { title: "전체", value: "" }
			                            ]
                                    },
                                    remark: {
                                        title: "영업구분 :"
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
                                        memory: "장비군"
                                    },
                                    remark: {
                                        title: "장비군 :"
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
			                                { title: "전체", value: "" }
			                            ]
                                    },
                                    remark: {
                                        title: "제품유형 :"
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
				                            { title: "전체", value: "" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "cust_dept",
				                label: {
				                    title: "LINE :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "cust_proc",
				                label: {
				                    title: "PROCESS :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "PROCESS",
				                        unshift: [
				                            { title: "전체", value: "" }
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
            targetid: "grdData_현황_1",
            query: "w_find_orders_M_1",
            title: "생산 의뢰 현황",
            height: 134,
            //caption: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 150,
				    align: "left"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 240,
				    align: "left"
				},
				{
				    header: "영업구분",
				    name: "ord_class",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "납기예정일",
				    name: "due_ymd",
				    width: 90,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "상태",
				    name: "sale_stat",
				    width: 60,
				    align: "center"
				},
                {
                    name: "ord_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_현황_2",
            query: "w_find_orders_M_2",
            title: "생산 의뢰 현황",
            height: 134,
            //caption: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 150,
				    align: "left"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 240,
				    align: "left"
				},
				{
				    header: "영업구분",
				    name: "ord_class",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품출하일",
				    name: "dlv_ymd",
				    width: 90,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "상태",
				    name: "sale_stat",
				    width: 60,
				    align: "center"
				},
                {
                    name: "ord_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_상세",
            query: "w_find_orders_S_1",
            type: "TABLE",
            title: "생산 의뢰 정보",
            caption: true,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 80,
                    field: 190
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                type: "label",
                                value: "영업구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ord_class"
                            },
                            {
                                header: true,
                                value: "Project No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "proj_no"
                            },
                            {
                                header: true,
                                value: "생산확정일",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rqst_ymd",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "진행상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat"
                            },
                            {
                                header: true,
                                value: "생산의뢰 No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rqst_no"
                            },
                            {
                                header: true,
                                value: "PO일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ord_ymd",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                type: "label",
                                value: "장비군",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_group"
                            },
                            {
                                header: true,
                                type: "label",
                                value: "제품유형",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_type"
                            },
                            {
                                header: true,
                                value: "요청납기일",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "due_ymd",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "제품코드",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_cd"
                            },
                            {
                                header: true,
                                value: "제품명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_nm"
                            },
                            {
                                header: true,
                                value: "출하일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "dlv_ymd",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "Chamber",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_desc1"
                            },
                            {
                                header: true,
                                value: "Serial No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_sno"
                            },
                            {
                                header: true,
                                type: "label",
                                value: "고객사",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_cd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                type: "label",
                                value: "Line",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_line"
                            },
                            {
                                header: true,
                                type: "label",
                                value: "Process",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_proc"
                            },
                            {
                                header: true,
                                value: "고객사담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_man_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                type: "label",
                                value: "작성자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "reg_emp"
                            },
                            {
                                header: true,
                                type: "label",
                                value: "작성부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "reg_dept"
                            },
                            {
                                header: true,
                                value: "작성일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_dt",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                type: "label",
                                value: "변경내용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "rev_rmk",
                                format: {
                                    type: "text",
                                    width: 477
                                }
                            },
                            {
                                header: true,
                                value: "변경일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rev_dt"
                            },
                            {
                                name: "ord_no",
                                hidden: true
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
            targetid: "grdData_계획",
            query: "w_find_orders_D_1",
            title: "일정 계획",
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "부서",
				    name: "job_dept",
				    width: 100,
				    align: "center"
				},
				{
				    header: "부문",
				    name: "job_area",
				    width: 100,
				    align: "center"
				},
				{
				    header: "내역",
				    name: "job_fld",
				    width: 100,
				    align: "center"
				},
				{
				    header: "담당자",
				    name: "job_emp",
				    width: 70,
				    align: "center"
				},
				{
				    header: "시작일",
				    name: "fr_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "종료일",
				    name: "to_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
                {
                    name: "ord_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_테스트",
            query: "w_find_orders_D_2",
            title: "신뢰성 테스트",
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "테스트 항목",
				    name: "test_nm",
				    width: 200,
				    align: "center"
				},
		        {
		            header: "여부",
		            name: "test_yn",
		            width: 60,
		            align: "center",
		            format: {
		                type: "checkbox",
		                title: "",
		                value: "1",
		                offval: "0"
		            }
		        },
				{
				    header: "표시순번",
				    name: "data_sort",
				    width: 60,
				    align: "center"
				},
                {
                    name: "ord_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            collapsible: true,
            target: [
				{
				    type: "GRID",
				    id: "grdData_계획",
				    title: "일정 계획"
				},
				{
				    type: "GRID",
				    id: "grdData_테스트",
				    title: "신뢰성 테스트"
				}
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황_1",
				    offset: 8
				},
                {
                    type: "GRID",
                    id: "grdData_현황_2",
                    offset: 8
                },
				{
				    type: "FORM",
				    id: "frmData_상세",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_계획",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_테스트",
				    offset: 8
				},
				{
				    type: "TAB",
				    id: "lyrTab",
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
            targetid: "grdData_현황_1",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황_2",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
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
        function rowselected_grdData_현황(ui) {

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        if (v_global.process.param != "") {
        }
        else {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -6 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        }
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
function getObject(param) {

    var type = gw_com_api.getValue("frmOption", 1, "ymd_tp");
    switch (param.name) {
        case "현황":
            return ((type == "DUE") ? "grdData_현황_1" : "grdData_현황_2");
    }
    return "";

}
//----------
function toggleObject(param) {

    var type = gw_com_api.getValue("frmOption", 1, "ymd_tp");
    if (type == "DUE") {
        gw_com_api.hide("grdData_현황_2");
        gw_com_api.show("grdData_현황_1");
    }
    else {
        gw_com_api.hide("grdData_현황_1");
        gw_com_api.show("grdData_현황_2");
    }
}
//----------
function processRetrieve(param) {

    closeOption({});

    toggleObject({});

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
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
                    name: "ord_class",
                    argument: "arg_ord_class"
                },
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "cust_dept",
				    argument: "arg_cust_dept"
				},
				{
				    name: "cust_proc",
				    argument: "arg_cust_proc"
				},
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				}
			],
            remark: [
                {
                    element: [{ name: "ymd_tp"}]
                },
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
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "cust_dept"}]
		        },
		        {
		            element: [{ name: "cust_proc"}]
		        },
		        {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "ord_class"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: getObject({ name: "현황" }),
			    select: true
			}
		],
        clear: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
			{
			    type: "GRID",
			    id: "grdData_계획"
			},
			{
			    type: "GRID",
			    id: "grdData_테스트"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    closeOption({});

    var args = {
        source: {
            type: "GRID",
            id: getObject({ name: "현황" }),
            row: "selected",
            block: true,
            element: [
				{
				    name: "ord_no",
				    argument: "arg_ord_no"
				}
			]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            },
			{
			    type: "GRID",
			    id: "grdData_계획"
			},
			{
			    type: "GRID",
			    id: "grdData_테스트"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_infoOrders:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.ymd_tp
                        != gw_com_api.getValue("frmOption", 1, "ymd_tp")) {
                        gw_com_api.setValue("frmOption", 1, "ymd_tp", param.data.ymd_tp);
                        retrieve = true;
                    }
                    if (param.data.ymd_fr
                        != gw_com_api.getValue("frmOption", 1, "ymd_fr")) {
                        gw_com_api.setValue("frmOption", 1, "ymd_fr", param.data.ymd_fr);
                        retrieve = true;
                    }
                    if (param.data.ymd_to
                        != gw_com_api.getValue("frmOption", 1, "ymd_to")) {
                        gw_com_api.setValue("frmOption", 1, "ymd_to", param.data.ymd_to);
                        retrieve = true;
                    }
                    if (param.data.ord_class
                        != gw_com_api.getValue("frmOption", 1, "ord_class")) {
                        gw_com_api.setValue("frmOption", 1, "ord_class", param.data.ord_class);
                        retrieve = true;
                    }
                    if (param.data.prod_group
                        != gw_com_api.getValue("frmOption", 1, "prod_group")) {
                        gw_com_api.setValue("frmOption", 1, "prod_group", param.data.prod_group);
                        retrieve = true;
                    }
                    if (param.data.cust_cd
                        != gw_com_api.getValue("frmOption", 1, "cust_cd")) {
                        gw_com_api.setValue("frmOption", 1, "cust_cd", param.data.cust_cd);
                        retrieve = true;
                    }
                    if (param.data.cust_dept
                        != gw_com_api.getValue("frmOption", 1, "cust_dept")) {
                        gw_com_api.setValue("frmOption", 1, "cust_dept", param.data.cust_dept);
                        retrieve = true;
                    }
                    if (param.data.cust_proc
                        != gw_com_api.getValue("frmOption", 1, "cust_proc")) {
                        gw_com_api.setValue("frmOption", 1, "cust_proc", param.data.cust_proc);
                        retrieve = true;
                    }
                    if (param.data.prod_type
                        != gw_com_api.getValue("frmOption", 1, "prod_type")) {
                        gw_com_api.setValue("frmOption", 1, "prod_type", param.data.prod_type);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "ymd_fr");

            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//