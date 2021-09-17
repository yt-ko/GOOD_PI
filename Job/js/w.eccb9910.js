
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //----------
        var args = { request: [
                { type: "INLINE", name: "진행상태",
                    data: [
						{ title: "CIP", value: "CIP" },
						{ title: "ECO", value: "ECO" },
						{ title: "기각", value: "기각" }
					]
                },
				{ type: "PAGE", name: "조치시점", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "ECCB10" }
                    ]
				},
				{ type: "PAGE", name: "분류1", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "ECCB05" }
                    ]
				},
				{ type: "PAGE", name: "분류2", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "ECCB06" }
                    ]
				},
				{ type: "PAGE", name: "분류3", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "ECCB07" }
                    ]
				},
                { type: "PAGE", name: "부서", query: "dddw_dept"
                },
                { type: "PAGE", name: "사원", query: "dddw_emp"
                },
                { type: "PAGE", name: "심의결과", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB30" }
                    ]
                },
                { type: "PAGE", name: "우선순위", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB22" }
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
				    name: "추가",
				    value: "추가"
				},
                {
                    name: "수정",
                    value: "수정",
                    icon: "추가"
                },
				{
				    name: "삭제",
				    value: "삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내역",
            query: "w_eccb1010_M_1",
            type: "TABLE",
            title: "제안 내역",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "ecr_title",
                validate: true
            },
            content: {
                width: {
                    label: 100,
                    field: 200
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "ECR No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ecr_no",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "관련근거",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_no",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "진행상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "전자결재",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "astat",
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "개선제안명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "ecr_title",
                                format: {
                                    width: 500
                                },
                                editable: {
                                    type: "text",
                                    width: 500,
                                    validate: {
                                        rule: "required"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "작성자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ecr_emp",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "사원"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "제안개요",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "ecr_desc",
                                format: {
                                    width: 500
                                },
                                editable: {
                                    type: "text",
                                    width: 500
                                }
                            },
                            {
                                header: true,
                                value: "작성부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ecr_dept",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "부서"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "조치요구시점",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3,
                                    colfloat: "float"
                                },
                                name: "act_time_sel",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "조치시점"
                                    },
                                    width: 155
                                },
                                display: true
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_time_text",
                                format: {
                                    width: 300
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "act_time_etc",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "text",
                                    width: 337
                                },
                                display: true
                            },
                            {
                                name: "act_time",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "작성일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ecr_dt",
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "CRM부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rqst_dept",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "부서"
                                    },
                                    validate: {
                                        rule: "required"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "접수부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rcvd_dept_nm"
                            }/*,
                            {
                                header: true,
                                value: "접수자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rcvd_emp_nm"
                            }*/,
                            {
                                header: true,
                                value: "접수일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rcvd_dt",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "분류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5,
                                    colfloat: "float"
                                },
                                name: "act_region1",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류1",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155,
                                    validate: {
                                        rule: "required"
                                    }
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_region1_text",
                                format: {
                                    width: 200
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module1_text",
                                format: {
                                    width: 300
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module1_sel",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류2",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155,
                                    validate: {
                                        rule: "required"
                                    }
                                },
                                display: true
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module1_etc",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                },
                                display: true
                            },
                            {
                                name: "act_module1",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "mp_class1_text",
                                format: {
                                    width: 200
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "mp_class1_sel",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류3",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155,
                                    validate: {
                                        rule: "required"
                                    }
                                },
                                display: true
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "mp_class1_etc",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                },
                                display: true
                            },
                            {
                                name: "mp_class1",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5,
                                    colfloat: "float"
                                },
                                name: "act_region2",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류1",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_region2_text",
                                format: {
                                    width: 200
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module2_text",
                                format: {
                                    width: 300
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module2_sel",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류2",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155
                                },
                                display: true
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module2_etc",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                },
                                display: true
                            },
                            {
                                name: "act_module2",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "mp_class2_text",
                                format: {
                                    width: 200
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "mp_class2_sel",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류3",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155
                                },
                                display: true
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "mp_class2_etc",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                },
                                display: true
                            },
                            {
                                name: "mp_class2",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5,
                                    colfloat: "float"
                                },
                                name: "act_region3",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류1",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_region3_text",
                                format: {
                                    width: 200
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module3_text",
                                format: {
                                    width: 300
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module3_sel",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류2",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155
                                },
                                display: true
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "act_module3_etc",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                },
                                display: true
                            },
                            {
                                name: "act_module3",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "mp_class3_text",
                                format: {
                                    width: 200
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "mp_class3_sel",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "분류3",
                                        unshift: [
				                            { title: "", value: "" }
				                        ]
                                    },
                                    width: 155
                                },
                                display: true
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "mp_class3_etc",
                                format: {
                                    width: 0
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                },
                                display: true
                            },
                            {
                                name: "mp_class3",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "개선예상효과",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "act_effect",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 800
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 800
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "승인상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "gw_astat_nm"
                            },
                            {
                                header: true,
                                value: "승인자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "gw_aemp"
                            },
                            {
                                header: true,
                                value: "승인일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "gw_adate"
                            },
                            {
                                name: "gw_astat",
                                hidden: true
                            },
                            {
                                name: "gw_key",
                                hidden: true
                            },
                            {
                                name: "gw_seq",
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
            targetid: "grdData_모델",
            query: "w_eccb1010_S_1",
            title: "적용 모델",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "prod_type",
                validate: true
            },
            element: [
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
                {
                    header: "Process",
                    name: "cust_proc",
                    width: 120,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    header: "고객사",
                    name: "cust_nm",
                    width: 100,
                    align: "center"
                },
                {
                    header: "Line",
                    name: "cust_dept",
                    width: 120,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    header: "제품코드",
                    name: "prod_cd",
                    width: 100,
                    align: "center"
                },
                {
                    header: "제품명",
                    name: "prod_nm",
                    width: 300,
                    align: "left"
                },
                {
                    name: "cust_cd",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "prod_key",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "model_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "root_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "root_no",
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
            targetid: "frmData_메모A",
            query: "w_eccb1010_S_2_1",
            type: "TABLE",
            title: "개선 전 (현상 및 문제점)",
            caption: true,
            show: true,
            fixed: true,
            selectable: true,
            editable: {
                bind: "select",
                validate: true
            },
            content: {
                width: {
                    field: "100%"
                },
                height: 370,
                row: [
                    {
                        element: [
                            {
                                name: "memo_html",
                                format: {
                                    type: "html",
                                    height: 370,
                                    top: 5
                                }
                            },
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "memo_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "frmData_메모B",
            query: "w_eccb1010_S_2_2",
            type: "TABLE",
            title: "개선 후 (안)",
            caption: true,
            show: true,
            fixed: true,
            selectable: true,
            editable: {
                bind: "select",
                validate: true
            },
            content: {
                width: {
                    field: "100%"
                },
                height: 370,
                row: [
                    {
                        element: [
                            {
                                name: "memo_html",
                                format: {
                                    type: "html",
                                    height: 370,
                                    top: 5
                                }
                            },
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "memo_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "grdData_첨부",
            query: "w_eccb1010_S_3",
            title: "첨부 문서",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "file_desc",
                validate: true
            },
            element: [
				{
				    header: "파일명",
				    name: "file_nm",
				    width: 300,
				    align: "left"
				},
				{
				    header: "다운로드",
				    name: "download",
				    width: 60,
				    align: "center",
				    format: {
				        type: "link",
				        value: "다운로드"
				    }
				},
				{
				    header: "파일설명",
				    name: "file_desc",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
                {
                    name: "file_ext",
                    hidden: true
                },
                {
                    name: "file_path",
                    hidden: true
                },
                {
                    name: "network_cd",
                    hidden: true
                },
                {
                    name: "data_tp",
                    hidden: true
                },
                {
                    name: "data_key",
                    hidden: true
                },
                {
                    name: "data_seq",
                    hidden: true
                },
                {
                    name: "file_id",
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
            targetid: "frmData_심의",
            query: "w_eccb9910_S_4",
            type: "TABLE",
            title: "심의 결과",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "result_cd",
                validate: true
            },
            content: {
                width: {
                    label: 100,
                    field: 190
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "등록번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "root_no"
                            },
                            {
                                header: true,
                                value: "실행부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_dept1_nm"
                            },
                            {
                                header: true,
                                value: "담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp1_nm",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                name: "act_dept1",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "act_emp1",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "심의결과",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "result_cd",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "심의결과"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "실행부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_dept2_nm"
                            },
                            {
                                header: true,
                                value: "담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp2_nm",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                name: "act_dept2",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "act_emp2",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "우선순위",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "priority_cd",
                                format: {
                                    width: 600
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "우선순위"
                                    },
                                    width: 600
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "협의내용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "item_note",
                                format: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 800
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 800
                                }
                            },
                            {
                                name: "item_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "eccb_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "lyrDown",
            width: 0,
            height: 0,
            show: false
        };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "FORM",
				    id: "frmData_내역",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_모델",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_첨부",
				    offset: 8
				},
                {
                    type: "FORM",
                    id: "frmData_심의",
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
            targetid: "lyrMenu_1",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_1_삭제
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
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "수정",
            event: "click",
            handler: click_lyrMenu_2_수정
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_2_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_3_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_3_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_내역",
            event: "itemchanged",
            handler: itemchanged_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모A",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모A
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모B",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모B
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_첨부",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_첨부_download
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_심의",
            event: "itemdblclick",
            handler: itemdblclick_frmData_심의
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_심의",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_심의
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

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
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            processModel({});

        }
        //----------
        function click_lyrMenu_2_수정(ui) {

            if (!checkManipulate({})) return;
            if (gw_com_api.getSelectedRow("grdData_모델") == null) {
                gw_com_api.messageBox([
                    { text: "선택된 대상이 없습니다." }
                ], 300);
                return false;
            }

            processModel({ modify: true });

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_모델",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_upload_eccb",
                title: "파일 업로드",
                width: 650,
                height: 200,
                //locate: ["center", 600],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_eccb",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_ECCB,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("frmData_내역", 1, "ecr_no"),
                            seq: 1
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_첨부",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function itemchanged_frmData_내역(ui) {

            switch (ui.element) {
                case "act_time_sel":
                case "act_module1_sel":
                case "act_module2_sel":
                case "act_module3_sel":
                case "mp_class1_sel":
                case "mp_class2_sel":
                case "mp_class3_sel":
                    {
                        var em = ui.element.substr(0, ui.element.length - 4);
                        gw_com_api.setValue(ui.object,
                                            ui.row,
                                            em + '_etc',
                                            "");
                        gw_com_api.setValue(ui.object,
                                            ui.row,
                                            em,
                                            (ui.value.current == "1000") ? "" : ui.value.current);
                    }
                    break;
                case "act_time_etc":
                case "act_module1_etc":
                case "act_module2_etc":
                case "act_module3_etc":
                case "mp_class1_etc":
                case "mp_class2_etc":
                case "mp_class3_etc":
                    {
                        var em = ui.element.substr(0, ui.element.length - 4);
                        if (gw_com_api.getValue(ui.object, ui.row, em + "_sel") == 1000)
                            gw_com_api.setValue(ui.object,
                                                ui.row,
                                                em,
                                                ui.value.current);
                    }
                    break;
            }

        };
        //----------
        function itemdblclick_frmData_메모A(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "개선 전 (현상 및 문제점)";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------
        function itemdblclick_frmData_메모B(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "개선 후 (안)";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------        
        function click_grdData_첨부_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }
        //----------
        function itemdblclick_frmData_심의(ui) {

            switch (ui.element) {
                case "act_emp1_nm":
                case "act_emp2_nm":
                    {
                        gw_com_api.setValue(ui.object, ui.row, ui.element, "");
                        gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3), "");
                        gw_com_api.setValue(ui.object, ui.row, ui.element.replace("emp", "dept"), "", false, true);
                        gw_com_api.setValue(ui.object, ui.row, ui.element.substr(0, ui.element.length - 3).replace("emp", "dept"), "");

                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_emp",
                            title: "사원 검색",
                            width: 600,
                            height: 450,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_emp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEmployee
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != ""
            && gw_com_api.getPageParameter("ecr_no") != "") {
            v_global.logic.key = gw_com_api.getPageParameter("ecr_no");
            processRetrieve({ key: v_global.logic.key });
        }
        else
            processInsert({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_내역");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
			{
			    type: "GRID",
			    id: "grdData_모델"
			},
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
			{
			    type: "GRID",
			    id: "grdData_첨부"
			},
            {
                type: "FORM",
                id: "frmData_심의"
            }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_ecr_no", value: param.key }
            ]
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_내역"
			},
            {
                type: "GRID",
                id: "grdData_모델"
            },
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            },
            {
                type: "FORM",
                id: "frmData_심의"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processDelete(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_모델"
            },
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            },
            {
                type: "FORM",
                id: "frmData_심의"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processModel(param) {

    v_global.logic.modeling = param.modify;

    var args = {
        type: "PAGE",
        page: "w_find_prod_eccb",
        title: "제품 모델 선택",
        width: 900,
        height: 440,
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_prod_eccb",
            param: {
                ID: gw_com_api.v_Stream.msg_selectProduct_ECCB
            }
        };
        if (param.modify)
            args.param.data = {
                prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
                cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
                cust_dept: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true),
                cust_proc: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true),
                prod_cd: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true),
                prod_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true),
                prod_key: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true)
            };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            type: "PAGE",
            page: "w_edit_html_eccb",
            title: "상세 내용",
            width: 800,
            height: 570,
            locate: ["center", "bottom"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_edit_html_eccb",
                param: {
                    ID: gw_com_api.v_Stream.msg_edit_HTML,
                    data: {
                        edit: true,
                        title: v_global.logic.memo,
                        html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processSave(param) {

    var err = false;
    gw_com_api.setError(false, "frmData_내역", 1, "act_time_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "act_module1_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "act_module2_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "act_module3_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "mp_class1_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "mp_class2_etc");
    gw_com_api.setError(false, "frmData_내역", 1, "mp_class3_etc");
    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_내역"
			},
            {
                type: "GRID",
                id: "grdData_모델"
            },
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            },
            {
                type: "FORM",
                id: "frmData_심의"
            }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (gw_com_api.getValue("frmData_내역", 1, "act_time_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_time_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_time_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "act_module1_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_module1_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_module1_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "act_module2_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_module2_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_module2_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "act_module3_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "act_module3_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "act_module3_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "mp_class1_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "mp_class1_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "mp_class1_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "mp_class2_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "mp_class2_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "mp_class2_etc");
    }
    if (gw_com_api.getValue("frmData_내역", 1, "mp_class3_sel") == "1000" && gw_com_api.getValue("frmData_내역", 1, "mp_class3_etc") == "") {
        err = true;
        gw_com_api.setError(true, "frmData_내역", 1, "mp_class3_etc");
    }
    if (err) {
        gw_com_api.messageBox([
                { text: "[기타]에 대한 내용이 입력되지 않았습니다." }
            ]);
        return false;
    }

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
		    {
		        type: "FORM",
		        id: "frmData_내역",
		        key: {
		            element: [
		                { name: "ecr_no" }
		            ]
		        }
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processApprove(param) {

    var status = gw_com_api.getValue("frmData_내역", 1, "gw_astat_nm", false, true);
    if (status != '없음' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }

    var args = {
        page: "IFProcess",
        param: {
            ID: gw_com_api.v_Stream.msg_authSystem,
            data: {
                system: "GROUPWARE",
                name: gw_com_module.v_Session.GW_ID,
                encrypt: { password: true },
                param: param
            }
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            },
            {
                type: "GRID",
                id: "grdData_모델"
            },
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            },
            {
                type: "FORM",
                id: "frmData_심의"
            }
        ]
    };
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
function successSave(response, param) {

    processRetrieve({ key: v_global.logic.key });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function successApproval(response, param) {

    processRetrieve({ key: v_global.logic.key });

    gw_com_api.showMessage("그룹웨어 페이지로 이동합니다.");
    var data = {};
    $.each(response.NAME, function (approval_i) {
        data[response.NAME[approval_i]] = response.VALUE[approval_i];
    });
    if (data.r_value < 0) {
        gw_com_api.showMessage(data.message);
        return;
    }
    var params = [
        { name: "sysid", value: "ECCB" },
        { name: "sys_key", value: data.r_key },
        { name: "seq", value: data.r_seq }
    ];
    gw_com_site.gw_appr(params);

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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
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
        case gw_com_api.v_Stream.msg_selectedECR:
            {
                processCopy({ master: true, data: param.data });
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_ECCB:
            {
                if (v_global.logic.modeling) {
                    gw_com_api.setValue("grdData_모델", "selected", "prod_type", (param.data.prod_type != "%") ? param.data.prod_type : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_cd", (param.data.cust_cd != "%") ? param.data.cust_cd : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_nm", (param.data.cust_cd != "%") ? param.data.cust_nm : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_dept", (param.data.cust_dept != "%") ? param.data.cust_dept : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "cust_proc", (param.data.cust_proc != "%") ? param.data.cust_proc : "", true, true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_key", (param.data.prod_cd != "") ? param.data.prod_key : "", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_cd", (param.data.prod_cd != "") ? param.data.prod_cd : " ", true);
                    gw_com_api.setValue("grdData_모델", "selected", "prod_nm", (param.data.prod_cd != "") ? param.data.prod_nm : " ", true);
                    if (gw_com_api.getCRUD("grdData_모델", "selected", true) == "retrieve")
                        gw_com_api.setUpdatable("grdData_모델", gw_com_api.getSelectedRow("grdData_모델"), true);
                }
                else {
                    var args = {
                        targetid: "grdData_모델",
                        edit: true,
                        updatable: true,
                        data: [
                            {
                                name: "root_no",
                                value: gw_com_api.getValue("frmData_내역", 1, "ecr_no")
                            },
                            { name: "root_seq", value: 1 }
                        ]
                    };
                    if (param.data.prod_type != "%")
                        args.data.push({ name: "prod_type", value: param.data.prod_type });
                    if (param.data.cust_cd != "%") {
                        args.data.push({ name: "cust_cd", value: param.data.cust_cd });
                        args.data.push({ name: "cust_nm", value: param.data.cust_nm });
                    }
                    if (param.data.cust_dept != "%")
                        args.data.push({ name: "cust_dept", value: param.data.cust_dept });
                    if (param.data.cust_proc != "%")
                        args.data.push({ name: "cust_proc", value: param.data.cust_proc });
                    if (param.data.prod_key != "") {
                        args.data.push({ name: "prod_key", value: param.data.prod_key });
                        args.data.push({ name: "prod_cd", value: param.data.prod_cd });
                        args.data.push({ name: "prod_nm", value: param.data.prod_nm });
                    }
                    gw_com_module.gridInsert(args);
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
			                            param.data.html);
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "memo_text",
			                            param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_ecr_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no") },
                            { name: "arg_seq", value: 1 }
                        ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_첨부",
			                select: true
			            }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.substr(0, v_global.event.element.length - 3),
			                        param.data.emp_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.replace("emp", "dept"),
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false,
                                    (v_global.event.type == "FORM") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.substr(0, v_global.event.element.length - 3).replace("emp", "dept"),
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element,
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = {
                    url: "COM",
                    procedure: "PROC_APPROVAL_ECR",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar"}/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "ecr_no", value: gw_com_api.getValue("frmData_내역", 1, "ecr_no"), type: "varchar" },
                        { name: "gw_key", value: gw_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: {
                        success: successApproval
                    }
                };
                gw_com_module.callProcedure(args);
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
                    case "w_find_ecr":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectECR;
                            args.data = {
                                type: "copy"
                            };
                        }
                        break;
                    case "w_find_prod_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_ECCB;
                            if (v_global.logic.modeling)
                                args.data = {
                                    prod_type: gw_com_api.getValue("grdData_모델", "selected", "prod_type", true),
                                    cust_cd: gw_com_api.getValue("grdData_모델", "selected", "cust_cd", true),
                                    cust_dept: gw_com_api.getValue("grdData_모델", "selected", "cust_dept", true),
                                    cust_proc: gw_com_api.getValue("grdData_모델", "selected", "cust_proc", true),
                                    prod_cd: gw_com_api.getValue("grdData_모델", "selected", "prod_cd", true),
                                    prod_nm: gw_com_api.getValue("grdData_모델", "selected", "prod_nm", true),
                                    prod_key: gw_com_api.getValue("grdData_모델", "selected", "prod_key", true)
                                };
                        }
                        break;
                    case "w_edit_html_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_HTML;
                            args.data = {
                                edit: true,
                                title: v_global.logic.memo,
                                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                            };
                        }
                        break;
                    case "w_upload_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_내역", 1, "ecr_no"),
                                seq: 1
                            };
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
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