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
            border: false,
            align: "left",
            editable: {
                validate: true
            }/*,
            remark: "lyrRemark"*/,
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ecr_no",
				                label: {
				                    title: "ECR No. :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
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
            targetid: "frmData_내역_1",
            query: "w_eccb1010_M_1",
            type: "TABLE",
            title: "제안 내역",
            caption: false,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 95,
                    field: 191
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
                                name: "ecr_no"
                            },
                            {
                                header: true,
                                value: "관련근거",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_no"
                            },
                            {
                                header: true,
                                value: "진행상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat_nm"
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
                                name: "ecr_emp_nm"
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
                                name: "ecr_dept_nm"
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
                                    colspan: 3
                                },
                                name: "act_time"
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
                                mask: "date-ymd"
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
                                name: "rqst_dept_nm"
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
                                name: "act_region1_text"
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
                                    colfloat: "floated"
                                },
                                name: "mp_class1_text",
                                format: {
                                    width: 200
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
                                name: "act_region2_text"
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
                                    colfloat: "floated"
                                },
                                name: "mp_class2_text",
                                format: {
                                    width: 200
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
                                name: "act_region3_text"
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
                                    colfloat: "floated"
                                },
                                name: "mp_class3_text",
                                format: {
                                    width: 200
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
            targetid: "frmData_내역_2",
            query: "w_info_eccb_item_M_1",
            type: "TABLE",
            title: "CIP 내역",
            caption: false,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 95,
                    field: 191
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "CIP No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cip_no"
                            },
                            {
                                header: true,
                                value: "관련근거",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ecr_no"
                            },
                            {
                                header: true,
                                value: "진행상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat_text"
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
                                name: "astat"
                            },
                            {
                                header: true,
                                value: "승인자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "aemp"
                            },
                            {
                                header: true,
                                value: "승인일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "adate"
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
                                name: "cip_title",
                                format: {
                                    width: 500
                                }
                            },
                            {
                                header: true,
                                value: "기안자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "draft_emp_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "TEST 장비",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "test_model",
                                format: {
                                    width: 500
                                }
                            },
                            {
                                header: true,
                                value: "보고자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rpt_emp_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "시작예정일",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "plan_str_dt",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "완료예정일",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "plan_end_dt",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "보고부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rpt_dept_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "시작일",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "str_dt",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "완료일",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "end_dt",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "보고일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rpt_dt",
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
                                name: "act_region1_text"
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
                                    colfloat: "floated"
                                },
                                name: "mp_class1_text",
                                format: {
                                    width: 200
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
                                name: "act_region2_text"
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
                                    colfloat: "floated"
                                },
                                name: "mp_class2_text",
                                format: {
                                    width: 200
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
                                name: "act_region3_text"
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
                                    colfloat: "floated"
                                },
                                name: "mp_class3_text",
                                format: {
                                    width: 200
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "대표실행자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp_nm"
                            },
                            {
                                header: true,
                                value: "공동실행자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3,
                                    colfloat: "float"
                                },
                                name: "sub_emp1_nm",
                                format: {
                                    width: 70
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "sub_emp2_nm",
                                format: {
                                    width: 70
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "sub_emp3_nm",
                                format: {
                                    width: 70
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "예상소요경비",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "plan_cost_note",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 500
                                }
                            },
                            {
                                header: true,
                                value: "총금액",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "plan_cost",
                                mask: "currency-ko"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "실제소요경비",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "act_cost_note",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 500
                                }
                            },
                            {
                                header: true,
                                value: "총금액",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_cost",
                                mask: "currency-ko"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "횡 전개시<br>총 예상 비용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "act_amt_note",
                                format: {
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
                                value: "비고",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "rmk",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 800
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
            targetid: "grdData_모델_1",
            query: "w_eccb1010_S_1",
            title: "적용 모델",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
            element: [
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center"
				},
                {
                    header: "고객사",
                    name: "cust_nm",
                    width: 70,
                    align: "center"
                },
                {
                    header: "Line",
                    name: "cust_dept",
                    width: 90,
                    align: "center"
                },
                {
                    header: "Process",
                    name: "cust_proc",
                    width: 100,
                    align: "center"
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
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_모델_2",
            query: "w_info_eccb_item_S_1",
            title: "적용 모델",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
            element: [
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center"
				},
                {
                    header: "고객사",
                    name: "cust_nm",
                    width: 70,
                    align: "center"
                },
                {
                    header: "Line",
                    name: "cust_dept",
                    width: 90,
                    align: "center"
                },
                {
                    header: "Process",
                    name: "cust_proc",
                    width: 100,
                    align: "center"
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
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_메모A_1",
            query: "w_eccb1010_S_2_1",
            type: "TABLE",
            title: "개선 전 (현상 및 문제점)",
            caption: true,
            show: true,
            wrap: true,
            selectable: true,
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
            targetid: "frmData_메모B_1",
            query: "w_eccb1010_S_2_2",
            type: "TABLE",
            title: "개선 후 (안)",
            caption: true,
            show: true,
            selectable: true,
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
            targetid: "frmData_메모A_2",
            query: "w_info_eccb_item_S_2_1",
            type: "TABLE",
            title: "TEST 내용",
            caption: true,
            show: true,
            wrap: true,
            selectable: true,
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
            targetid: "frmData_메모B_2",
            query: "w_info_eccb_item_S_2_2",
            type: "TABLE",
            title: "TEST 결과",
            caption: true,
            show: true,
            selectable: true,
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
            targetid: "grdData_첨부_1",
            query: "w_eccb1010_S_3",
            title: "첨부 문서",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
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
				    align: "left"
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
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부_2",
            query: "w_info_eccb_item_S_3",
            title: "첨부 문서",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
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
				    align: "left"
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
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
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
				/*{
				    type: "FORM",
				    id: "frmData_내역_1",
				    offset: 8
				},
                {
                    type: "FORM",
                    id: "frmData_내역_2",
                    offset: 8
                },*/
				{
				    type: "GRID",
				    id: "grdData_모델_1",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_모델_2",
				    offset: 8
				},
                {
                    type: "FORM",
                    id: "frmData_상세",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_첨부_1",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_첨부_2",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
				{
				    type: "LAYER",
				    id: "lyrData_ECR",
				    title: "ECR 내역"
				},
                {
                    type: "LAYER",
                    id: "lyrData_CIP",
                    title: "CIP 내역"
                }
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
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
            targetid: "grdData_첨부_1",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_첨부_download
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_첨부_2",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_첨부_download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

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
        function click_grdData_첨부_download(ui) {

            var args = {
                source: {
                    id: ui.object,
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }

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
        source: {
            type: "FORM",
            id: "frmOption",
            element: [
				{
				    name: "ecr_no",
				    argument: "arg_ecr_no"
				}
			]
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_내역_1"
			},
            {
                type: "FORM",
                id: "frmData_내역_2"
            },
            {
                type: "GRID",
                id: "grdData_모델_1"
            },
            {
                type: "GRID",
                id: "grdData_모델_2"
            },
            {
                type: "FORM",
                id: "frmData_메모A_1"
            },
            {
                type: "FORM",
                id: "frmData_메모B_1"
            },
            {
                type: "FORM",
                id: "frmData_메모A_2"
            },
            {
                type: "FORM",
                id: "frmData_메모B_2"
            },
            {
                type: "GRID",
                id: "grdData_첨부_1"
            },
            {
                type: "GRID",
                id: "grdData_첨부_2"
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
        case gw_com_api.v_Stream.msg_infoECCBItem:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.ecr_no
                        != gw_com_api.getValue("frmOption", 1, "ecr_no")) {
                        gw_com_api.setValue("frmOption", 1, "ecr_no", param.data.ecr_no);
                        retrieve = true;
                    }
                    if (param.data.type == "CIP")
                        gw_com_api.enableTab("lyrTab", 2);
                    else
                        gw_com_api.disableTab("lyrTab", 2);
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "ecr_no");

            }
            break;
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//