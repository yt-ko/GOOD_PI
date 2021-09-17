
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: true, entry: null, act: null, handler: null, current: {}, prev: {} },
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
        v_global.process.param = gw_com_module.initPage({  message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //----------
        var args = {
            request: [
                { type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [ { argument: "arg_hcode", value: "ECCB41" } ]
                },
				{ type: "PAGE", name: "분류1", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "ECCB05" } ]
				},
				{ type: "PAGE", name: "분류2", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "ECCB06" } ]
				},
				{ type: "PAGE", name: "분류3", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "ECCB07" } ]
				},
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            v_global.logic.cip_no = gw_com_api.getPageParameter("data_key");
           // checkEditable({}) = false;
            
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
        var args = { targetid: "lyrMenu_1", type: "FREE",
            element: [
                 {
                     name: "미리보기",
                     value: "미리보기",
                     icon: "출력"
                 },
                {
                    name: "상신",
                    value: "결재상신",
                    icon: "기타"
                },
				{
				    name: "추가",
				    value: "추가"
				},
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
      //  gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", type: "FREE",
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
       // gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_3", type: "FREE",
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
       // gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmData_내역", query: "w_eccb3010_M_1", type: "TABLE", title: "CIP 시행 정보",
            caption: true,
            show: true,
            selectable: true,
            format:false,
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
                                value: "CIP No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cip_no",
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
                                name: "ecr_no",
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
                                name: "pstat_text"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "최종승인상태",
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
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "제목",
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
                                },
                                editable: {
                                    type: "text",
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
                            { name: "draft_emp",
                                format: { type: "select", data: { memory: "사원" } },
                                editable: { type: "select", data: { memory: "사원" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "TEST장비",
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
                                },
                                editable: {
                                    type: "text",
                                    width: 500
                                }
                            },
                            {
                                header: true,
                                value: "기안부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "draft_dept",
                                format: { type: "select", data: { memory: "부서" } },
                                editable: { type: "select", data: { memory: "부서" } }
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
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
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
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "기안일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "draft_dt",
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
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
				                            { title: "-", value: "" }
				                        ]
                                    },
                                    width: 155
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
				                            { title: "-", value: "" }
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
                            { name: "dept_area", hidden: true, editable: { type: "hidden" } },
                            { name: "act_module1", hidden: true, editable: { type: "hidden" } },
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
				                            { title: "-", value: "" }
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
				                            { title: "-", value: "" }
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
				                            { title: "-", value: "" }
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
				                            { title: "-", value: "" }
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
				                            { title: "-", value: "" }
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
				                            { title: "-", value: "" }
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
				                            { title: "-", value: "" }
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
                                value: "대표실행자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp_nm",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text"
                                }
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
                                mask: "search",
                                display: true,
                                format: {
                                    width: 70
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "sub_emp2_nm",
                                mask: "search",
                                display: true,
                                format: {
                                    width: 70
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "sub_emp3_nm",
                                mask: "search",
                                display: true,
                                format: {
                                    width: 70
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                name: "act_emp",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "sub_emp1",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "sub_emp2",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "sub_emp3",
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
                                value: "예상경비내역",
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
                                },
                                editable: {
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
                                mask: "currency-ko",
                                editable: {
                                    type: "text"
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
                                },
                                editable: {
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
        var args = { targetid: "grdData_모델", query: "w_eccb3010_S_1", title: "적용 모델",
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
                    header: "Process",
                    name: "cust_proc",
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
        var args = { targetid: "frmData_메모A", query: "w_eccb3010_S_2_1", type: "TABLE", title: "CIP 필요성 및 문제점",
            caption: true,
            show: true,
            fixed: true,
            selectable: false,
            editable: false,
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
        var args = { targetid: "frmData_메모B", query: "w_eccb3010_S_2_2", type: "TABLE", title: "문제 해결 방안",
            caption: true,
            show: true,
            selectable: true,
            fixed: true,
            //editable: {
            //    bind: "select",
            //    validate: true
            //},
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
        var args = { targetid: "grdData_첨부", query: "w_eccb3010_S_3", title: "첨부 문서",
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
            element: "미리보기",
            event: "click",
            handler: click_lyrMenu_1_미리보기
        };
        gw_com_module.eventBind(args);

        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "상신",
            event: "click",
            handler: click_lyrMenu_1_상신
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_1_추가
        };
        gw_com_module.eventBind(args);
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
            targetid: "frmData_내역",
            event: "itemdblclick",
            handler: itemdblclick_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_내역",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모A",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모A
        };
       // gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모B",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모B
        };
       // gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_첨부",
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
        function click_lyrMenu_1_미리보기() {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            alert('미리보기');
            //processApprove({});

        }


        //----------
        function click_lyrMenu_1_상신() {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            processApprove({});

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
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

            var args = { type: "PAGE", page: "w_find_prod_eccb", title: "제품 모델 선택",
                width: 900, height: 440, locate: ["center", 400], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "w_find_prod_eccb",
                    param: { ID: gw_com_api.v_Stream.msg_selectProduct_ECCB
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_모델", row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = { type: "PAGE", page: "w_upload_eccb", title: "파일 업로드",
                width: 650, height: 200,
                //locate: ["center", 600],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "w_upload_eccb",
                    param: { ID: gw_com_api.v_Stream.msg_upload_ECCB,
                        data: { user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("frmData_내역", 1, "cip_no"),
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

            var args = { targetid: "grdData_첨부", row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function itemchanged_frmData_내역(ui) {

            switch (ui.element) {
                case "act_module1_sel":
                case "act_module2_sel":
                case "act_module3_sel":
                case "mp_class1_sel":
                case "mp_class2_sel":
                case "mp_class3_sel":
                    {
                        var em = ui.element.substr(0, ui.element.length - 4);
                        gw_com_api.setValue(ui.object, ui.row, em + '_etc', "");
                        gw_com_api.setValue(ui.object, ui.row, em,
                                            (ui.value.current == "1000") ? "" : ui.value.current);
                    }
                    break;
                case "act_module1_etc":
                case "act_module2_etc":
                case "act_module3_etc":
                case "mp_class1_etc":
                case "mp_class2_etc":
                case "mp_class3_etc":
                    {
                        var em = ui.element.substr(0, ui.element.length - 4);
                        if (gw_com_api.getValue(ui.object, ui.row, em + "_sel") == 1000)
                            gw_com_api.setValue(ui.object, ui.row, em, ui.value.current);
                    }
                    break;
            }

        };
        //----------
        function itemdblclick_frmData_내역(ui) {

            switch (ui.element) {
                case "act_emp_nm":
                case "sub_emp1_nm":
                case "sub_emp2_nm":
                case "sub_emp3_nm":
                    {
                        var em = ui.element.substr(0, ui.element.length - 3);
                        gw_com_api.setValue(ui.object, ui.row, em, "", true);

                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = { type: "PAGE", page: "w_find_emp", title: "사원 검색",
                            width: 600, height: 450, locate: ["center", "top"], open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = { page: "w_find_emp",
                                param: { ID: gw_com_api.v_Stream.msg_selectEmployee
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function itemdblclick_frmData_메모A(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "CIP 필요성 및 문제점";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------
        function itemdblclick_frmData_메모B(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "문제 해결 방안";
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        //if (v_global.process.param != "") {
        //    v_global.logic.key = gw_com_api.getPageParameter("cip_no");
        //    processRetrieve({ key: v_global.logic.key });
        //}
        //else
        //    processInsert({});

        gw_com_api.setValue("frmOption", 1, "cip_no", gw_com_api.getPageParameter("cip_no"));
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
                { name: "arg_cip_no", value: v_global.logic.cip_no },
                { name: "arg_seq", value: 1 }
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
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    if (param.sub) {
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_root_no", value: param.key },
                    { name: "arg_root_seq", value: param.seq }
                ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_모델",
                    query: "w_eccb3010_I_1",
                    crud: "insert"
                }
		    ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.master) {
        var args = { targetid: "frmData_내역",
            edit: true, updatable: true,
            data: [
                { name: "ecr_no", value: param.data.ecr_no },
                { name: "cip_title", value: param.data.ecr_title },
                { name: "dept_area", value: param.data.dept_area },
                { name: "draft_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "draft_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "draft_dt", value: gw_com_api.getDate("") },
                { name: "act_region1", value: param.data.act_region1 },
                { name: "act_region2", value: param.data.act_region2 },
                { name: "act_region3", value: param.data.act_region3 },
                { name: "act_module1", value: param.data.act_module1 },
                { name: "act_module2", value: param.data.act_module2 },
                { name: "act_module3", value: param.data.act_module3 },
                { name: "act_module1_sel", value: param.data.act_module1_sel },
                { name: "act_module2_sel", value: param.data.act_module2_sel },
                { name: "act_module3_sel", value: param.data.act_module3_sel },
                { name: "act_module1_etc", value: param.data.act_module1_etc },
                { name: "act_module2_etc", value: param.data.act_module2_etc },
                { name: "act_module3_etc", value: param.data.act_module3_etc },
                { name: "mp_class1", value: param.data.mp_class1 },
                { name: "mp_class2", value: param.data.mp_class2 },
                { name: "mp_class3", value: param.data.mp_class3 },
                { name: "mp_class1_sel", value: param.data.mp_class1_sel },
                { name: "mp_class2_sel", value: param.data.mp_class2_sel },
                { name: "mp_class3_sel", value: param.data.mp_class3_sel },
                { name: "mp_class1_etc", value: param.data.mp_class1_etc },
                { name: "mp_class2_etc", value: param.data.mp_class2_etc },
                { name: "mp_class3_etc", value: param.data.mp_class3_etc }
            ],
            clear: [
                { type: "GRID", id: "grdData_모델" },
                { type: "FORM", id: "frmData_메모A" },
                { type: "FORM", id: "frmData_메모B" },
                { type: "GRID", id: "grdData_첨부" }
            ]
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_메모A",
            edit: true,
            updatable: true,
            data: [
                { name: "root_seq", value: "1" },
                { name: "memo_cd", value: "A"}/*,
                { name: "memo_html", value: "<table style='width: 825px; height: 195px; table-layout:fixed; font-family:굴림체; font-size:9pt;' border='1' cellspacing='0' cellpadding='3'><tr valign='top'><td style='word-break: break-all;'></td></tr></table>" }*/

            ]
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_메모B",
            edit: true,
            updatable: true,
            data: [
                { name: "root_seq", value: "1" },
                { name: "memo_cd", value: "B"}/*,
                { name: "memo_html", value: "<table style='width: 825px; height: 195px; table-layout:fixed; font-family:굴림체; font-size:9pt;' border='1' cellspacing='0' cellpadding='3'><tr valign='top'><td style='word-break: break-all;'></td></tr></table>" }*/
            ]
        };
        gw_com_module.formInsert(args);
        processInsert({ sub: true, key: param.data.ecr_no, seq: 1 });
    }
    else {
        var args = {
            type: "PAGE", page: "w_find_ecr", title: "CIP 대상 선택",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = { page: "w_find_ecr",
                param: { ID: gw_com_api.v_Stream.msg_selectECR, data: { type: "cip" } }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

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
            }
        ]
    };
    gw_com_module.objClear(args);

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
            width: 508,
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
            }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

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
		                { name: "cip_no" }
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
    if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
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

    $.each(response, function () {
        var query = this.QUERY;
        $.each(this.KEY, function () {
            if (this.NAME == "cip_no"
                || (this.NAME == "root_no"
                    && (query == "w_eccb3010_S_1" || query == "w_eccb3010_S_2_1" || query == "w_eccb3010_S_2_2"))) {
                v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key });
            }
        });
    });

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
    
    var DeptArea = gw_com_api.getValue("frmData_내역", 1, "dept_area");
    var FormId = 210;
    if (DeptArea == "DP") FormId = 235;
    else if (DeptArea == "SOLAR") FormId = 237;
    else FormId = 210;

    var url = "http://gw.ips.co.kr/common/main/sso_erp.aspx";
    var params = [
        { name: "form_id", value: FormId },
        { name: "cmpid", value: 1 },
        { name: "inter_id", value: "I" },
        { name: "sysid", value: "ECCB" },
        { name: "sys_key", value: data.r_key },
        { name: "seq", value: data.r_seq },
        { name: "user_id", value: v_global.logic.name },
        { name: "passwd", value: v_global.logic.password }
    ];
    var args = "";
    $.each(params, function (args_i) {
        args = args +
            ((args_i == 0) ? "?" : "&") + this.name + "=" + this.value;
    });
    window.open(url + args, "", "");

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
        //        }
        //        //switch (param.data.ID) {
        //        //    case gw_com_api.v_Message.msg_confirmSave:
        //        //        {
        //        //            if (param.data.result == "YES")
        //        //                processSave(param.data.arg);
        //        //            else {
        //        //                processDelete({});
        //        //                if (v_global.process.handler != null)
        //        //                    v_global.process.handler(param.data.arg);
        //        //            }
        //        //        }
        //        //        break;
        //        //    case gw_com_api.v_Message.msg_confirmRemove:
        //        //        {
        //        //            if (param.data.result == "YES")
        //        //                processRemove({});
        //        //        }
        //        //        break;
        //        //    case gw_com_api.v_Message.msg_informSaved:
        //        //        {
        //        //            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
        //        //        }
        //        //        break;
        //        //    case gw_com_api.v_Message.msg_informRemoved:
        //        //        {
        //        //            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
        //        //        }
        //        //        break;
        //        //    case gw_com_api.v_Message.msg_informBatched:
        //        //        {
        //        //            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
        //        //        }
        //        //        break;
        //        //}
        //    }
        //    break;
        ////case gw_com_api.v_Stream.msg_selectedECR:
        ////    {
        ////        processInsert({ master: true, data: param.data });
        ////        closeDialogue({ page: param.from.page });
        ////    }
        ////    break;
        ////case gw_com_api.v_Stream.msg_selectedEmployee:
        ////    {
        ////        gw_com_api.setValue(
        ////                            v_global.event.object,
		////	                        v_global.event.row,
		////	                        v_global.event.element,
		////	                        param.data.emp_nm,
		////	                        (v_global.event.type == "GRID") ? true : false);
        ////        gw_com_api.setValue(
        ////                            v_global.event.object,
		////	                        v_global.event.row,
		////	                        v_global.event.element.substr(0, v_global.event.element.length - 3),
		////	                        param.data.emp_no,
		////	                        (v_global.event.type == "GRID") ? true : false);
        ////        closeDialogue({ page: param.from.page, focus: true });
        ////    }
        ////    break;
        ////case gw_com_api.v_Stream.msg_selectedProduct_ECCB:
        ////    {
        ////        var args = {
        ////            targetid: "grdData_모델",
        ////            edit: true,
        ////            updatable: true,
        ////            data: [
        ////                {
        ////                    name: "root_no",
        ////                    value: gw_com_api.getValue("frmData_내역", 1, "cip_no")
        ////                },
        ////                { name: "root_seq", value: 1 }
        ////            ]
        ////        };
        ////        if (param.data.prod_type != "%")
        ////            args.data.push({ name: "prod_type", value: param.data.prod_type });
        ////        if (param.data.cust_cd != "%") {
        ////            args.data.push({ name: "cust_cd", value: param.data.cust_cd });
        ////            args.data.push({ name: "cust_nm", value: param.data.cust_nm });
        ////        }
        ////        if (param.data.cust_dept != "%")
        ////            args.data.push({ name: "cust_dept", value: param.data.cust_dept });
        ////        if (param.data.cust_proc != "%")
        ////            args.data.push({ name: "cust_proc", value: param.data.cust_proc });
        ////        if (param.data.prod_key != undefined) {
        ////            args.data.push({ name: "prod_key", value: param.data.prod_key });
        ////            args.data.push({ name: "prod_cd", value: param.data.prod_cd });
        ////            args.data.push({ name: "prod_nm", value: param.data.prod_nm });
        ////        }
        ////        gw_com_module.gridInsert(args);
        ////        closeDialogue({ page: param.from.page });
        ////   }
        //    break;
        //case gw_com_api.v_Stream.msg_edited_HTML:
        //    {
        //        if (param.data.update) {
        //            gw_com_api.setValue(v_global.event.object,
        //                                v_global.event.row,
        //                                v_global.event.element,
		//	                            param.data.html);
        //            gw_com_api.setValue(v_global.event.object,
        //                                v_global.event.row,
        //                                "memo_text",
		//	                            param.data.html);
        //            gw_com_api.setUpdatable(v_global.event.object);
        //        }
        //        closeDialogue({ page: param.from.page });
        //    }
        //    break;
        //case gw_com_api.v_Stream.msg_uploaded_ECCB:
        //    {
        //        var args = {
        //            source: {
        //                type: "INLINE",
        //                argument: [
        //                    { name: "arg_cip_no", value: gw_com_api.getValue("frmData_내역", 1, "cip_no") },
        //                    { name: "arg_seq", value: 1 }
        //                ]
        //            },
        //            target: [
		//	            {
		//	                type: "GRID",
		//	                id: "grdData_첨부",
		//	                select: true
		//	            }
		//            ],
        //            key: param.key
        //        };
        //        gw_com_module.objRetrieve(args);
        //    }
        //    break;
        //case gw_com_api.v_Stream.msg_authedSystem:
        //    {
        //        closeDialogue({ page: param.from.page });

        //        v_global.logic.name = param.data.name;
        //        v_global.logic.password = param.data.password;
        //        var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
        //        var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
        //        gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
        //        var args = { url: "COM", procedure: "PROC_APPROVAL_CIP",
        //            input: [
        //                { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
        //                { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar" },
        //                { name: "cip_no", value: gw_com_api.getValue("frmData_내역", 1, "cip_no"), type: "varchar" },
        //                { name: "gw_key", value: gw_key, type: "varchar" },
        //                { name: "gw_seq", value: gw_seq, type: "int" }
        //            ],
        //            output: [
        //                { name: "r_key", type: "varchar" },
        //                { name: "r_seq", type: "int" },
        //                { name: "r_value", type: "int" },
        //                { name: "message", type: "varchar" }
        //            ],
        //            handler: {
        //                success: successApproval
        //            }
        //        };
        //        gw_com_module.callProcedure(args);
        //    }
        //    break;
        //case gw_com_api.v_Stream.msg_openedDialogue:
        //    {
        //        var args = {
        //            to: {
        //                type: "POPUP",
        //                page: param.from.page
        //            }
        //        };
        //        switch (param.from.page) {
        //            case "w_find_ecr":
        //                {
        //                    args.ID = gw_com_api.v_Stream.msg_selectECR;
        //                    args.data = {
        //                        type: "cip"
        //                    };
        //                }
        //                break;
        //            case "w_find_emp":
        //                {
        //                    args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
        //                }
        //                break;
        //            case "w_find_prod_eccb":
        //                {
        //                    args.ID = gw_com_api.v_Stream.msg_selectProduct_ECCB;
        //                }
        //                break;
        //            case "w_edit_html_eccb":
        //                {
        //                    args.ID = gw_com_api.v_Stream.msg_edit_HTML;
        //                    args.data = {
        //                        edit: true,
        //                        title: v_global.logic.memo,
        //                        html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
        //                    };
        //                }
        //                break;
        //            case "w_upload_eccb":
        //                {
        //                    args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
        //                    args.data = {
        //                        user: gw_com_module.v_Session.USR_ID,
        //                        key: gw_com_api.getValue("frmData_내역", 1, "cip_no"),
        //                        seq: 1
        //                    };
        //                }
        //                break;
                 }
        //        gw_com_module.streamInterface(args);
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