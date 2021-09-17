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
                    type: "PAGE", name: "발생부문", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "IQCM05" }
                    ]
                },
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "IEHM11" } ] 
                },
				{
				    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
				    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
				},
				{
				    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
				{
				    type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [
                        { argument: "arg_hcode", value: "IEHM06" }
                    ]
				},
				{
				    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [
                        { argument: "arg_hcode", value: "ISCM25" }
                    ]
				},
				{
				    type: "PAGE", name: "AS-모듈", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IEHM05" }
                    ]
				},
				{
				    type: "PAGE", name: "AS-조치분류", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IEHM24" }
                    ]
				},
				{
				    type: "PAGE", name: "AS-조치구분", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IEHM34" }
                    ]
				},
				{
				    type: "PAGE", name: "PM-모듈", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IPOP22" }
                    ]
				},
				{
				    type: "PAGE", name: "PM-조치분류", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IPOP24" }
                    ]
				},
				{
				    type: "PAGE", name: "PM-조치구분", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IPOP34" }
                    ]
				},
				{
				    type: "PAGE", name: "QC-모듈", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IEHM05" }
                    ]
				},
				{
				    type: "PAGE", name: "QC-조치분류", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IEHM24" }
                    ]
				},
				{
				    type: "PAGE", name: "QC-조치구분", query: "DDDW_CM_CODED_A",
				    param: [
                        { argument: "arg_hcode", value: "IEHM34" }
                    ]
				},
				{
				    type: "PAGE", name: "진행상태", query: "DDDW_ISSUE_STAT"
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
                            { name: "issue_part", label: { title: "발생부문 :" },
                                editable: { type: "select",
                                    data: { memory: "발생부문" }
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
            targetid: "frmOption_AS",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            border: true,
            show: false,
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
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "발생일자 :"
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
				            }
                        ]
                    },
                    {
                        element: [
				            {
				                name: "prod_group",
				                label: {
				                    title: "제품군 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "제품군",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
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
                                    },
                                    change: [
					                    {
					                        name: "cust_dept1",
					                        memory: "LINE",
					                        key: [
							                    "cust_cd"
						                    ]
					                    },
                                        {
                                            name: "cust_dept2",
                                            memory: "LINE",
                                            key: [
							                    "cust_cd"
						                    ]
                                        },
                                        {
                                            name: "cust_dept3",
                                            memory: "LINE",
                                            key: [
							                    "cust_cd"
						                    ]
                                        }
				                    ]
                                }
                            },
                            {
                                name: "cust_prod_nm",
                                label: {
                                    title: "설비명 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 12,
                                    maxlength: 50
                                }
                            }
                        ]
                    },
                    {
                        element: [
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "cust_dept1",
				                label: {
				                    title: "LINE :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            },
				            {
				                name: "cust_dept2",
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            },
				            {
				                name: "cust_dept3",
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "work_tp1",
                                label: {
                                    title: "조치분류 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "조치분류",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    },
                                    change: [
					                    {
					                        name: "work_tp2",
					                        memory: "조치구분",
					                        key: [
							                    "work_tp1"
						                    ]
					                    }
				                    ]
                                }
                            },
				            {
				                name: "work_tp2",
				                label: {
				                    title: "조치구분 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "조치구분",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "work_tp1"
						                ]
				                    }
				                }
				            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "prod_sub",
				                label: {
				                    title: "MODULE :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "모듈",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
                            {
                                name: "issue_stat",
                                label: {
                                    title: "진행상태 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태",
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
				                name: "rmk_text",
				                label: {
				                    title: "조치내용 :"
				                },
				                editable: {
				                    type: "texts",
				                    size: 35,
				                    maxlength: 100,
				                    keyword: true
				                },
				                tip: {
				                    text: " (키워드 간에 + 입력은 AND 조건 / , 입력은 OR 조건 검색)",
				                    color: "#505050"
				                }
				            },
                            {
                                name: "proj_no",
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
        var args = {
            targetid: "frmOption_PM",
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
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "발생일자 :"
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
                                    },
                                    change: [
					                    {
					                        name: "cust_dept1",
					                        memory: "LINE",
					                        key: [
							                    "cust_cd"
						                    ]
					                    },
                                        {
                                            name: "cust_dept2",
                                            memory: "LINE",
                                            key: [
							                    "cust_cd"
						                    ]
                                        },
                                        {
                                            name: "cust_dept3",
                                            memory: "LINE",
                                            key: [
							                    "cust_cd"
						                    ]
                                        }
				                    ]
                                }
                            },
                            {
                                name: "proj_no",
                                label: {
                                    title: "Project No. :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 50
                                }
                            }
                        ]
                    },
                    {
                        element: [
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "cust_dept1",
				                label: {
				                    title: "LINE :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            },
				            {
				                name: "cust_dept2",
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            },
				            {
				                name: "cust_dept3",
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            }
				        ]
                    },
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
				                name: "prod_sub",
				                label: {
				                    title: "MODULE :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "모듈",
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
                                name: "work_tp1",
                                label: {
                                    title: "조치분류 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "조치분류",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    },
                                    change: [
					                    {
					                        name: "work_tp2",
					                        memory: "조치구분",
					                        key: [
							                    "work_tp1"
						                    ]
					                    }
				                    ]
                                }
                            },
				            {
				                name: "work_tp2",
				                label: {
				                    title: "조치구분 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "조치구분",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "work_tp1"
						                ]
				                    }
				                }
				            }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "issue_stat",
                                label: {
                                    title: "진행상태 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태",
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
				                name: "rmk_text",
				                label: {
				                    title: "조치내용 :"
				                },
				                editable: {
				                    type: "texts",
				                    size: 35,
				                    maxlength: 100,
				                    keyword: true
				                },
				                tip: {
				                    text: " (키워드 간에 + 입력은 AND 조건 / , 입력은 OR 조건 검색)",
				                    color: "#505050"
				                }
				            },
                            {
                                name: "prod_group",
                                hidden: true
                            },
                            {
                                name: "cust_prod_nm",
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
        var args = {
            targetid: "frmOption_QC",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            border: true,
            show: false,
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
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "발생일자 :"
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
				            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "prod_group",
                                label: {
                                    title: "제품군 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "제품군",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
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
                                    },
                                    change: [
					                    {
					                        name: "cust_dept1",
					                        memory: "LINE",
					                        key: [
							                    "cust_cd"
						                    ]
					                    },
                                        {
                                            name: "cust_dept2",
                                            memory: "LINE",
                                            key: [
							                    "cust_cd"
						                    ]
                                        },
                                        {
                                            name: "cust_dept3",
                                            memory: "LINE",
                                            key: [
							                    "cust_cd"
						                    ]
                                        }
				                    ]
                                }
                            },
                            {
                                name: "proj_no",
                                label: {
                                    title: "Project No. :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 50
                                }
                            }
                        ]
                    },
                    {
                        element: [
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "cust_dept1",
				                label: {
				                    title: "LINE :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            },
				            {
				                name: "cust_dept2",
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            },
				            {
				                name: "cust_dept3",
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "LINE",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
				                }
				            }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "work_tp1",
                                label: {
                                    title: "조치분류 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "조치분류",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    },
                                    change: [
					                    {
					                        name: "work_tp2",
					                        memory: "조치구분",
					                        key: [
							                    "work_tp1"
						                    ]
					                    }
				                    ]
                                }
                            },
				            {
				                name: "work_tp2",
				                label: {
				                    title: "조치구분 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "조치구분",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "work_tp1"
						                ]
				                    }
				                }
				            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "prod_sub",
				                label: {
				                    title: "MODULE :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "모듈",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
                            {
                                name: "issue_stat",
                                label: {
                                    title: "진행상태 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "진행상태",
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
				                name: "rmk_text",
				                label: {
				                    title: "조치내용 :"
				                },
				                editable: {
				                    type: "texts",
				                    size: 35,
				                    maxlength: 100,
				                    keyword: true
				                },
				                tip: {
				                    text: " (키워드 간에 + 입력은 AND 조건 / , 입력은 OR 조건 검색)",
				                    color: "#505050"
				                }
				            },
                            {
                                name: "cust_prod_nm",
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
        var args = {
            targetid: "grdData_AS_현황",
            query: "EHM_2034_M_2",
            title: "문제 발생 내역",
            height: 442,
            show: false,
            selectable: true,
            key: true,
            dynamic: true,
            element: [
				{
				    header: "관리번호",
				    name: "issue_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "발생일자",
				    name: "issue_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
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
				    width: 80,
				    align: "center"
				},
				{
				    header: "고객설비명",
				    name: "cust_prod_nm",
				    width: 120,
				    align: "center"
				},
				{
				    header: "제품군",
				    name: "prod_group",
				    width: 60,
				    align: "center"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center"
				},
				{
				    header: "발생구분",
				    name: "issue_tp",
				    width: 100,
				    align: "center"
				},
				{
				    header: "Module",
				    name: "prod_sub",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Warranty",
				    name: "wrnt_io",
				    width: 60,
				    align: "center"
				},
				{
				    header: "순번",
				    name: "seq",
				    width: 40,
				    align: "center"
				},
				{
				    header: "조치일자",
				    name: "work_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "조치분류",
				    name: "work_tp1",
				    width: 130,
				    align: "center"
				},
				{
				    header: "조치구분",
				    name: "work_tp2",
				    width: 130,
				    align: "center"
				},
				{
				    header: "작업자",
				    name: "work_man",
				    width: 70,
				    align: "center"
				},
				{
				    header: "조치내용",
				    name: "rmk",
				    width: 700,
				    align: "left"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PM_현황",
            query: "EHM_2034_M_2",
            title: "문제 발생 내역",
            height: 442,
            show: true,
            selectable: true,
            key: true,
            dynamic: true,
            element: [
				{
				    header: "관리번호",
				    name: "issue_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "발생일자",
				    name: "issue_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Line",
				    name: "cust_dept",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "center"
				}/*,
				{
				    header: "발생구분",
				    name: "issue_tp",
				    width: 60,
				    align: "center"
				}*/,
				{
				    header: "Module",
				    name: "prod_sub",
				    width: 100,
				    align: "center"
				},
				{
				    header: "순번",
				    name: "seq",
				    width: 40,
				    align: "center"
				},
				{
				    header: "조치일자",
				    name: "work_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "조치분류",
				    name: "work_tp1",
				    width: 190,
				    align: "center"
				},
				{
				    header: "조치구분",
				    name: "work_tp2",
				    width: 70,
				    align: "center"
				},
				{
				    header: "작업자",
				    name: "work_man",
				    width: 70,
				    align: "center"
				},
				{
				    header: "조치내용",
				    name: "rmk",
				    width: 700,
				    align: "left"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_QC_현황",
            query: "EHM_2034_M_2",
            title: "문제 발생 내역",
            height: 442,
            show: false,
            selectable: true,
            key: true,
            dynamic: true,
            element: [
				{
				    header: "관리번호",
				    name: "issue_no",
				    width: 90,
				    align: "center"
				},
				{
				    header: "발생일자",
				    name: "issue_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Line",
				    name: "cust_dept",
				    width: 80,
				    align: "center"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 100,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "center"
				},
				{
				    header: "Module",
				    name: "prod_sub",
				    width: 100,
				    align: "center"
				},
				{
				    header: "발생구분",
				    name: "issue_tp",
				    width: 60,
				    align: "center"
				},
				{
				    header: "순번",
				    name: "seq",
				    width: 40,
				    align: "center"
				},
				{
				    header: "조치일자",
				    name: "work_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "조치분류",
				    name: "work_tp1",
				    width: 190,
				    align: "center"
				},
				{
				    header: "조치구분",
				    name: "work_tp2",
				    width: 70,
				    align: "center"
				},
				{
				    header: "작업자",
				    name: "work_man",
				    width: 70,
				    align: "center"
				},
				{
				    header: "조치내용",
				    name: "rmk",
				    width: 700,
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
				    id: "grdData_PM_현황",
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
            targetid: "frmOption",
            event: "itemchanged",
            handler: itemchanged_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_AS",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_AS",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_PM",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_PM",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_QC",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_QC",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_AS_현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_AS_현황",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_PM_현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_PM_현황",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_QC_현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_QC_현황",
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

            gw_com_module.objToggle({
                target: [
			        { id: "frmOption_" + gw_com_api.getValue("frmOption", 1, "issue_part"), focus: true }
		        ]
            });

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            closeOption({});

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemchanged_frmOption(ui) {

            toggleObject({ type: ui.value.current });

        }
        //----------
        function rowdblclick_grdData_현황(ui) {

            var args = {
                type: "PAGE",
                page: "DLG_ISSUE",
                title: "문제 상세 정보",
                width: 1100,
                height: 500,
                scroll: true,
                open: true, control: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_ISSUE",
                    param: {
                        ID: gw_com_api.v_Stream.msg_infoAS,
                        data: {
                            issue_no: gw_com_api.getValue(
                                                      getObject({ obj: "현황", type: gw_com_api.getValue("frmOption", 1, "issue_part") })
                                                    , "selected"
                                                    , "issue_no"
                                                    , true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_AS", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_AS", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption_PM", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_PM", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption_QC", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_QC", 1, "ymd_to", gw_com_api.getDate(""));
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
function toggleObject(param) {

    closeOption({});

    switch (param.type) {
        case "AS":
            {
                gw_com_api.hide("grdData_PM_현황");
                gw_com_api.hide("grdData_QC_현황");
            }
            break;
        case "PM":
            {
                gw_com_api.hide("grdData_AS_현황");
                gw_com_api.hide("grdData_QC_현황");
            }
            break;
        case "QC":
            {
                gw_com_api.hide("grdData_AS_현황");
                gw_com_api.hide("grdData_PM_현황");
            }
            break;
    }
    gw_com_api.show("grdData_" + param.type + "_현황");
    gw_com_module.objResize({
        target: [
			{ type: "GRID", id: "grdData_" + param.type + "_현황", offset: 8 }
		]
    });
    gw_com_api.show("frmOption_" + param.type);

}
//----------
function getObject(param) {

    switch (param.obj) {
        case "조회":
            return "frmOption_" + param.type;
        case "현황":
            return "grdData_" + param.type + "_현황";
    }
    return "";

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: getObject({ obj: "조회", type: gw_com_api.getValue("frmOption", 1, "issue_part") })
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM",
            id: getObject({ obj: "조회", type: gw_com_api.getValue("frmOption", 1, "issue_part") }),
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
				    name: "prod_group",
				    argument: "arg_prod_group"
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
				    name: "cust_dept1",
				    argument: "arg_cust_dept1"
				},
				{
				    name: "cust_dept2",
				    argument: "arg_cust_dept2"
				},
				{
				    name: "cust_dept3",
				    argument: "arg_cust_dept3"
				},
				{
				    name: "cust_prod_nm",
				    argument: "arg_cust_prod_nm"
				},
				{
				    name: "proj_no",
				    argument: "arg_proj_no"
				},
				{
				    name: "prod_sub",
				    argument: "arg_prod_sub"
				},
				{
				    name: "work_tp1",
				    argument: "arg_work_tp1"
				},
				{
				    name: "work_tp2",
				    argument: "arg_work_tp2"
				},
				{
				    name: "rmk_text",
				    argument: "arg_rmk_text"
				},
				{
				    name: "issue_stat",
				    argument: "arg_issue_stat"
				}
			],
            argument: [
                {
                    name: "arg_issue_part",
                    value: "AS"
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
		            element: [{ name: "prod_group"}]
		        },
		        {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "cust_cd"}]
		        },
                {
                    infix: ",",
                    element: [
	                    { name: "cust_dept1" },
		                { name: "cust_dept2" },
                        { name: "cust_dept3" }
		            ]
                },
		        {
		            element: [{ name: "cust_prod_nm"}]
		        },
		        {
		            element: [{ name: "proj_no"}]
		        },
		        {
		            element: [{ name: "prod_sub"}]
		        },
		        {
		            element: [{ name: "work_tp1"}]
		        },
		        {
		            element: [{ name: "work_tp2"}]
		        },
		        {
		            element: [{ name: "issue_stat"}]
		        },
		        {
		            element: [{ name: "rmk_text"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: getObject({ obj: "현황", type: gw_com_api.getValue("frmOption", 1, "issue_part") }),
			    select: true,
			    focus: true
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

    gw_com_api.hide("frmOption_AS");
    gw_com_api.hide("frmOption_PM");
    gw_com_api.hide("frmOption_QC");

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
                if (param.data.page != gw_com_api.getPageID())
                    break;
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
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                            args.data = {
                                issue_no: gw_com_api.getValue(
                                                      getObject({ obj: "현황", type: gw_com_api.getValue("frmOption", 1, "issue_part") })
                                                    , "selected"
                                                    , "issue_no"
                                                    , true)
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