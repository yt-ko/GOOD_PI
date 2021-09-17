//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    root: {}, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
        var args = { request: [
				{ type: "PAGE", name: "발생부문", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "IQCM05" } ]
				},
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "IEHM11" } ] 
                },
				{ type: "PAGE", name: "고객사", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "ISCM29" } ]
				},
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED", 
					param: [ { argument: "arg_hcode", value: "IEHM02" } ]
				},
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "IEHM06" } ]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
                {
                    type: "INLINE", name: "부품교체",
                    data: [ { title: "미교체", value: "0" }, { title: "교체", value: "1" } ]
                },
                {
                    type: "INLINE", name: "수리여부",
                    data: [{ title: "", value: "" }, { title: "No", value: "0" }, { title: "Yes", value: "1"}]
                },
                {
                    type: "INLINE", name: "진행상태",
                    data: [
						{ title: "처리중", value: "0" },
						{ title: "처리완료", value: "1" },
						{ title: "미확인", value: "2" }
					]
                },
                {
                    type: "PAGE", name: "처리결과", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "QCM2011" }
                    ]
                },
                {
                    type: "PAGE", name: "유형분류", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "QCM2012" }
                    ]
                },
                {
                    type: "PAGE", name: "유형구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "QCM3012" }
                    ]
                },
                {
                    type: "PAGE", name: "시점구분", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "QCM2013" }
                    ]
                },
                {
                    type: "PAGE", name: "원인분류", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "QCM2016" }
                    ]
                },
                { type: "PAGE", name: "원인구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "QCM3016" }
                    ]
                },
                { type: "INLINE", name: "Warranty",
                    data: [ { title: "IN", value: "IN" }, { title: "OUT", value: "OUT" }, { title: "전체", value: "%" } ]
                },
                { type: "PAGE", name: "귀책구분", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "QCM2015" }
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
        var args = { targetid: "lyrMenu_1", type: "FREE",
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
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
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
                    { element: [
				            {
				                name: "issue_part",
				                label: {
				                    title: "발생부문 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "발생부문",
				                        unshift: [
				                            { title: "전체", value: "" }
				                        ]
				                    }
				                }
				            },
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
				            },
                            { name: "issue_type", label: { title: "발생구분 :" },
                                editable: { type: "select", 
                                	data: { memory: "발생구분", unshift: [ { title: "전체", value: "" } ] } }
                            }
				        ]
                    },
                    { element: [
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
				                    },
				                    change: [
					                    {
					                        name: "cust_dept",
					                        memory: "LINE",
					                        key: [
							                    "cust_cd"
						                    ]
					                    }
				                    ]
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
				                        ],
				                        key: [
							                "cust_cd"
						                ]
				                    }
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
				                    maxlength: 20
				                }
				            }
				        ]
                    },
                    { element: [
                            { name: "prod_group",
                                label: {
                                    title: "제품군 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "제품군",
                                        unshift: [
				                            { title: "전체", value: "" }
				                        ]
                                    }
                                }
                            },
				            { name: "prod_type",
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
				                    }
				                }
				            },
				            { name: "part_change", value: "1",
				                label: { title: "부품교체 :" },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "부품교체",
				                        unshift: [ { title: "전체", value: "" } ]
				                    }
				                }
				            },
                            { name: "wrnt_io", label: { title: "Warranty :" },
                                editable: { type: "select", data: { memory: "Warranty" } }
                            },
                            { name: "proj_no", label: { title: "Project No. :" }, hidden: true }
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
        var args = { targetid: "grdData_발생정보", query: "QDM_3010_M_1", title: "발생 정보",
            //caption: true,
            height: 130,
            dynamic: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "관리번호",
				    name: "issue_no",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "발생일자",
				    name: "issue_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "발생구분",
				    name: "issue_tp_nm",
				    width: 90,
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
				    header: "Process",
				    name: "cust_proc",
				    width: 100,
				    align: "center"
				},
				{
				    header: "고객설비명",
				    name: "cust_prod_nm",
				    width: 150,
				    align: "center"
				},
                {
                    header: "Project No.",
                    name: "proj_no",
                    width: 80,
                    align: "center"
                },
				{
				    header: "제품군",
				    name: "prod_group_nm",
				    width: 60,
				    align: "center"
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
				    width: 250,
				    align: "left"
				},
				{
				    header: "Module",
				    name: "prod_sub",
				    width: 100,
				    align: "center"
				}/*,
				{
				    header: "Warranty",
				    name: "wrnt_io",
				    width: 60,
				    align: "center"
				}*/,
				{
				    header: "중요도",
				    name: "important_level",
				    width: 60,
				    align: "center"
				},
				{
				    header: "발생현상",
				    name: "rmk",
				    width: 300,
				    align: "left"
				},
				{
				    header: "교체부품명",
				    name: "part_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "교체건수",
				    name: "part_cnt",
				    width: 60,
				    align: "center"
				},
				{
				    header: "교체수량",
				    name: "part_sum",
				    width: 60,
				    align: "center"
				},
				{
				    header: "진행상태",
				    name: "istat",
				    width: 80,
				    align: "center"
				}/*,
				{
				    header: "확인자",
				    name: "aemp",
				    width: 70,
				    align: "center"
				},
				{
				    header: "확인일시",
				    name: "adate",
				    width: 160,
				    align: "center"
				},
                {
                header: "품질팀장확인",
                name: "mstat",
                width: 80,
                align: "center"
                }*/,
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "품질확인자",
				    name: "qemp",
				    width: 70,
				    align: "center"
				},
				{
				    header: "품질확인일시",
				    name: "qdate",
				    width: 160,
				    align: "center"
				},
				{
				    name: "issue_part",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_AS발생정보", query: "EHM_2010_M_2",
            type: "TABLE",
            title: "발생 정보",
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
                                value: "관리번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_no"
                            },
                            {
                                header: true,
                                value: "발생일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colfloat: "float"
                                },
                                name: "issue_dt",
                                mask: "date-ymd",
                                format: {
                                    type: "text",
                                    width: 62
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "issue_time",
                                mask: "time-hh",
                                format: {
                                    type: "text",
                                    width: 30
                                }
                            },
                            {
                                header: true,
                                value: "발생구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_tp_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "고객사",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_nm"
                            },
                            {
                                header: true,
                                value: "Line",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_dept"
                            },
                            {
                                header: true,
                                value: "Process",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_proc"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "설비명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_prod_nm"
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
                                value: "Module",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_sub"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "Warranty",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "wrnt_io"
                            },
                            {
                                header: true,
                                value: "중요도",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "important_level"
                            },
                            {
                                header: true,
                                value: "상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "발생현상",
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
                                    type: "text",
                                    width: 734
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "등록자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_usr"
                            },
                            {
                                header: true,
                                value: "수정자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_usr"
                            },
                            {
                                header: true,
                                value: "품질확인자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "qemp"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "등록일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_dt"
                            },
                            {
                                header: true,
                                value: "수정일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_dt"
                            },
                            {
                                header: true,
                                value: "품질확인일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "qdate"
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_제조발생정보", query: "EHM_2010_M_2", type: "TABLE",
            title: "발생 정보",
            caption: true,
            show: false,
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
                                value: "관리번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_no"
                            },
                            {
                                header: true,
                                value: "발생일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_dt",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "발생구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_tp_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "고객사",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_nm"
                            },
                            {
                                header: true,
                                value: "Line",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_dept"
                            },
                            {
                                header: true,
                                value: "Process",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_proc"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "제품명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "prod_nm",
                                format: {
                                    type: "text",
                                    width: 458
                                }
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
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "Module",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_sub"
                            },
                            {
                                header: true,
                                value: "중요도",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "important_level"
                            },
                            {
                                header: true,
                                value: "상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "발생현상",
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
                                    type: "text",
                                    width: 734
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "등록자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_usr"
                            },
                            {
                                header: true,
                                value: "수정자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_usr"
                            },
                            {
                                header: true,
                                value: "품질확인자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "qemp"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "등록일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_dt"
                            },
                            {
                                header: true,
                                value: "수정일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_dt"
                            },
                            {
                                header: true,
                                value: "품질확인일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "qdate"
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_품질발생정보", query: "EHM_2010_M_2", type: "TABLE", title: "발생 정보",
            caption: true,
            show: false,
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
                                value: "관리번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_no"
                            },
                            {
                                header: true,
                                value: "발생일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_dt",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "발생구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_tp_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "고객사",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_nm"
                            },
                            {
                                header: true,
                                value: "Line",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_dept"
                            },
                            {
                                header: true,
                                value: "Process",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_proc"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "제품명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "prod_nm",
                                format: {
                                    type: "text",
                                    width: 458
                                }
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
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "Module",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_sub"
                            },
                            {
                                header: true,
                                value: "중요도",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "important_level"
                            },
                            {
                                header: true,
                                value: "상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "발생현상",
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
                                    type: "text",
                                    width: 734
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "등록자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_usr"
                            },
                            {
                                header: true,
                                value: "수정자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_usr"
                            },
                            {
                                header: true,
                                value: "수정일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_dt"
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_AS발생내역", query: "EHM_2010_S_1_2", title: "발생 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
                {
                    header: "순번",
                    name: "issue_seq",
                    width: 35,
                    align: "center"
                },
				{
				    header: "발생구분",
				    name: "issue_tp",
				    width: 90,
				    align: "center"
				},
				{
				    header: "Module",
				    name: "prod_sub",
				    width: 80,
				    align: "center"
				},
				{
				    header: "현상분류",
				    name: "status_tp1",
				    width: 130,
				    align: "center"
				},
				{
				    header: "현상구분",
				    name: "status_tp2",
				    width: 130,
				    align: "center"
				},
				{
				    header: "부위분류",
				    name: "part_tp1",
				    width: 90,
				    align: "center"
				},
				{
				    header: "부위구분",
				    name: "part_tp2",
				    width: 130,
				    align: "center"
				},
				{
				    header: "원인분류",
				    name: "reason_tp1",
				    width: 90,
				    align: "center"
				},
				{
				    header: "원인구분",
				    name: "reason_tp2",
				    width: 130,
				    align: "center"
				},
				{
				    header: "귀책분류",
				    name: "duty_tp1",
				    width: 90,
				    align: "center"
				},
				{
				    header: "귀책구분",
				    name: "duty_tp2",
				    width: 130,
				    align: "center"
				},
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_제조발생내역", query: "EHM_2010_S_1_2", title: "발생 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            element: [
                {
                    header: "순번",
                    name: "issue_seq",
                    width: 35,
                    align: "center"
                },
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 150,
				    align: "center"
				},
				{
				    header: "Module",
				    name: "part_tp1",
				    width: 200,
				    align: "center"
				},
				{
				    header: "발생부위",
				    name: "part_tp2",
				    width: 262,
				    align: "center"
				},
				{
				    header: "발생원인",
				    name: "reason_tp2",
				    width: 262,
				    align: "center"
				},
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_품질발생내역", query: "EHM_2010_S_1_2", title: "발생 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            element: [
                {
                    header: "순번",
                    name: "issue_seq",
                    width: 35,
                    align: "center"
                },
				{
				    header: "Module",
				    name: "part_tp1",
				    width: 200,
				    align: "center"
				},
				{
				    header: "현상분류",
				    name: "status_tp1",
				    width: 150,
				    align: "center"
				},
				{
				    header: "현상구분",
				    name: "status_tp2",
				    width: 200,
				    align: "center"
				},
				{
				    header: "부위분류",
				    name: "part_tp1",
				    width: 150,
				    align: "center"
				},
				{
				    header: "부위구분",
				    name: "part_tp2",
				    width: 200,
				    align: "center"
				},
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_발생내용", query: "EHM_2010_S_2", type: "TABLE", title: "발생 내용",
            width: "100%",
            show: true,
            selectable: true,
            content: {
                height: 25,
                width: {
                    label: 80,
                    field: 720
                },
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "발생내용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rmk_text",
                                format: {
                                    type: "textarea",
                                    rows: 7,
                                    width: 734
                                }
                            },
                            {
                                name: "rmk_cd",
                                hidden: true
                            },
                            {
                                name: "issue_no",
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
        var args = { targetid: "grdData_AS조치내역", query: "EHM_2010_S_3_2", title: "조치 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "순번",
				    name: "issue_seq",
				    width: 35,
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
				    header: "조치분류",
				    name: "work_tp1",
				    width: 115,
				    align: "center"
				},
				{
				    header: "조치구분",
				    name: "work_tp2",
				    width: 120,
				    align: "center"
				},
				{
				    header: "작업시간",
				    name: "work_time",
				    width: 70,
				    align: "center"
				},
				{
				    header: "작업자1",
				    name: "work_man1",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자2",
				    name: "work_man2",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자3",
				    name: "work_man3",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자4",
				    name: "work_man4",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자5",
				    name: "work_man5",
				    width: 80,
				    align: "center"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 70,
				    align: "center"
				},
				{
				    header: "완료일자",
				    name: "end_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "완료시각",
				    name: "end_time",
				    width: 60,
				    align: "center",
				    mask: "time-hh"
				},
                {
                    name: "work_seq",
                    hidden: true
                },
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_제조조치내역", query: "EHM_2010_S_3_2", title: "조치 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            element: [
				{
				    header: "순번",
				    name: "issue_seq",
				    width: 35,
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
				    header: "작업시간",
				    name: "work_time",
				    width: 70,
				    align: "center"
				},
				{
				    header: "작업자1",
				    name: "work_man1",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자2",
				    name: "work_man2",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자3",
				    name: "work_man3",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자4",
				    name: "work_man4",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자5",
				    name: "work_man5",
				    width: 80,
				    align: "center"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 70,
				    align: "center"
				},
                {
                    name: "work_seq",
                    hidden: true
                },
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_품질조치내역", query: "EHM_2010_S_3_2", title: "조치 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            element: [
				{
				    header: "순번",
				    name: "issue_seq",
				    width: 35,
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
				    header: "작업시간",
				    name: "work_time",
				    width: 70,
				    align: "center"
				},
				{
				    header: "작업자1",
				    name: "work_man1",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자2",
				    name: "work_man2",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자3",
				    name: "work_man3",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자4",
				    name: "work_man4",
				    width: 80,
				    align: "center"
				},
				{
				    header: "작업자5",
				    name: "work_man5",
				    width: 80,
				    align: "center"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 70,
				    align: "center"
				},
                {
                    name: "work_seq",
                    hidden: true
                },
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_조치내용", query: "EHM_2010_S_4", type: "TABLE", title: "조치 내용",
            width: "100%",
            show: true,
            selectable: true,
            content: {
                height: 25,
                width: {
                    label: 80,
                    field: 720
                },
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "조치내용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rmk_text",
                                format: {
                                    type: "textarea",
                                    rows: 10,
                                    width: 734
                                }
                            },
                            {
                                name: "rmk_cd",
                                hidden: true
                            },
                            {
                                name: "issue_no",
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
        var args = { targetid: "grdData_AS교체PART", query: "QDM_3010_S_5_1", title: "교체 PART",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "open",
                focus: "reason_yn",
                validate: true
            },
            element: [
				{
				    header: "순번",
				    name: "issue_seq",
				    width: 35,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				}/*,
				{
				    header: "교체구분",
				    name: "change_tp",
				    width: 80,
				    align: "center"
				}*/,
				{
				    header: "교체일자",
				    name: "change_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "수급시간",
				    name: "change_time",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수량",
				    name: "change_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "원인부품", name: "reason_yn", width: 60, align: "center",
				    format: { type: "checkbox", title: "", value: 1, offval: 0 },
				    editable: { type: "checkbox", title: "", value: 1, offval: 0 }
				},
				{
				    header: "반입", name: "reinput_yn", width: 40, align: "center",
				    format: { type: "checkbox", title: "", value: 1, offval: 0 },
				    editable: { type: "checkbox", title: "", value: 1, offval: 0 }
				},
				{
				    header: "Repair", name: "repair_yn", width: 60, align: "center",
                    editable: { type: "select", data: { memory: "수리여부" } }
				},
				{
				    header: "부품상태",
				    name: "part_stat",
				    width: 80,
				    align: "center"
				},
				{
				    header: "기장착부품군",
				    name: "apart_tp",
				    width: 120,
				    align: "center"
				},
				{
				    header: "기장착부품코드",
				    name: "apart_cd",
				    width: 120,
				    align: "center"
				},
				{
				    header: "기장착부품명",
				    name: "apart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "제조사",
				    name: "apart_supp",
				    width: 150,
				    align: "left"
				},
				{
				    header: "모델",
				    name: "apart_model",
				    width: 150,
				    align: "center"
				},
				{
				    header: "규격(REV)",
				    name: "apart_rev",
				    width: 150,
				    align: "center"
				},
				{
				    header: "비고(REV)",
				    name: "apart_rmk",
				    width: 300,
				    align: "left"
				},
				{
				    header: "발생현상",
				    name: "status_tp1",
				    width: 150,
				    align: "center"
				},
				{
				    header: "세부현상",
				    name: "status_tp2",
				    width: 150,
				    align: "center"
				},
				{
				    header: "현상비고",
				    name: "status_rmk",
				    width: 300,
				    align: "left"
				},
				{
				    header: "기장착부품 Ser.No.",
				    name: "apart_sno",
				    width: 150,
				    align: "center"
				},
				{
				    header: "교체부품군",
				    name: "bpart_tp",
				    width: 120,
				    align: "center"
				},
				{
				    header: "교체부품코드",
				    name: "bpart_cd",
				    width: 120,
				    align: "center"
				},
				{
				    header: "교체부품명",
				    name: "bpart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "제조사",
				    name: "bpart_supp",
				    width: 150,
				    align: "left"
				},
				{
				    header: "모델",
				    name: "bpart_model",
				    width: 150,
				    align: "center"
				},
				{
				    header: "규격(REV)",
				    name: "bpart_rev",
				    width: 150,
				    align: "center"
				},
				{
				    header: "비고(REV)",
				    name: "bpart_rmk",
				    width: 300,
				    align: "left"
				},
				{
				    header: "교체부품 Ser.No.",
				    name: "bpart_sno",
				    width: 150,
				    align: "center"
				},
				{
				    header: "유상(CS)",
				    name: "charge_cs",
				    width: 70,
				    align: "center"
				},
				{
				    header: "유상(영업)",
				    name: "charge_yn",
				    width: 70,
				    align: "center"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 70,
				    align: "center"
				},
                {
                    name: "part_seq",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "issue_no",
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
        var args = { targetid: "grdData_제조교체PART", query: "QDM_3010_S_5_1", title: "교체 PART",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            element: [
				{
				    header: "순번",
				    name: "issue_seq",
				    width: 35,
				    align: "center"
				},
				{
				    header: "교체분류",
				    name: "change_div",
				    width: 80,
				    align: "center"
				},
				{
				    header: "교체구분",
				    name: "change_tp",
				    width: 80,
				    align: "center"
				},
				{
				    header: "교체일자",
				    name: "change_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "수급시간",
				    name: "change_time",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수량",
				    name: "change_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "기장착부품코드",
				    name: "apart_cd",
				    width: 120,
				    align: "center"
				},
				{
				    header: "기장착부품명",
				    name: "apart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "기장책부품 Ser.No.",
				    name: "apart_sno",
				    width: 90,
				    align: "center"
				},
				{
				    header: "교체부품코드",
				    name: "bpart_cd",
				    width: 120,
				    align: "center"
				},
				{
				    header: "교체부품명",
				    name: "bpart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "교체부품 Ser.No.",
				    name: "bpart_sno",
				    width: 90,
				    align: "center"
				},
				{
				    header: "유상(CS)",
				    name: "charge_cs",
				    width: 70,
				    align: "center"
				},
				{
				    header: "유상(영업)",
				    name: "charge_yn",
				    width: 70,
				    align: "center"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 70,
				    align: "center"
				},
                {
                    name: "part_seq",
                    hidden: true
                },
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_품질교체PART", query: "QDM_3010_S_5_1", title: "교체 PART",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
            selectable: true,
            element: [
				{
				    header: "순번",
				    name: "issue_seq",
				    width: 35,
				    align: "center"
				},
				{
				    header: "교체분류",
				    name: "change_div",
				    width: 80,
				    align: "center"
				},
				{
				    header: "교체구분",
				    name: "change_tp",
				    width: 80,
				    align: "center"
				},
				{
				    header: "교체일자",
				    name: "change_dt",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "수급시간",
				    name: "change_time",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수량",
				    name: "change_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "기장착부품코드",
				    name: "apart_cd",
				    width: 120,
				    align: "center"
				},
				{
				    header: "기장착부품명",
				    name: "apart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "기장책부품 Ser.No.",
				    name: "apart_sno",
				    width: 90,
				    align: "center"
				},
				{
				    header: "교체부품코드",
				    name: "bpart_cd",
				    width: 120,
				    align: "center"
				},
				{
				    header: "교체부품명",
				    name: "bpart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "교체부품 Ser.No.",
				    name: "bpart_sno",
				    width: 90,
				    align: "center"
				},
				{
				    header: "유상(CS)",
				    name: "charge_cs",
				    width: 70,
				    align: "center"
				},
				{
				    header: "유상(영업)",
				    name: "charge_yn",
				    width: 70,
				    align: "center"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 70,
				    align: "center"
				},
                {
                    name: "part_seq",
                    hidden: true
                },
                {
                    name: "issue_no",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_교체내용", query: "EHM_2010_S_6", type: "TABLE", title: "교체 내용",
            width: "100%",
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 80,
                    field: 720
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "교체내용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rmk_text",
                                format: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 734
                                }
                            },
                            {
                                name: "rmk_cd",
                                hidden: true
                            },
                            {
                                name: "issue_no",
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
        var args = { targetid: "frmData_처리결과", query: "EHM_2010_S_0_1",
            type: "TABLE", title: "처리 결과", caption: true, show: true, selectable: true,
            editable: { bind: "select", validate: true, focus: "rslt_date" },
            content: { width: { label: 80, field: 190 }, height: 25,
                row: [
                    { element: [ { name: "issue_no", value: "", hidden: true },
                            { header: true, value: "고객사", format: { type: "label" } },
                            { name: "cust_nm", editable: { type: "text", readonly: true} },
                            { header: true, value: "LINE", format: { type: "label" } },
                            { name: "cust_dept", editable: { type: "text", readonly: true} },
                            { header: true, value: "Warranty", format: { type: "label" } },
                            { name: "wrnt_io", editable: { type: "text", readonly: true} }
                        ]
                    },
                    { element: [
                            { header: true, value: "처리일자", format: { type: "label" } },
                            { name: "rslt_date", mask: "date-ymd", editable: { type: "text" } },
                            { header: true, value: "처리자", format: { type: "label" } },
                            { name: "rslt_emp", editable: { type: "text", display: true } },
                            { header: true, value: "처리완료", format: { type: "label" } },
                            { name: "complete_yn", format: { type: "checkbox", title: "완료", value: "1" },
                              editable: { type: "checkbox", title: "완료", value: "1", offval: "0" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리결과", format: { type: "label" } },
                            { name: "rslt_tp", editable: { type: "select", data: { memory: "처리결과" } } },
                            { header: true, value: "유형분류", format: { type: "label" } },
                            { name: "issue_cd",
                                editable: { type: "select", data: { memory: "유형분류" },
                                    change: [ { name: "issue_tp", memory: "유형구분", key: [ "issue_cd" ] } ]
                                }
                            },
                            { header: true, value: "유형구분", format: { type: "label" } },
                            { name: "issue_tp",
                                editable: { type: "select", data: { memory: "유형구분", key: [ "issue_cd" ] } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "시점구분", format: { type: "label" } },
                            { name: "reason_cd", editable: { type: "select", data: { memory: "시점구분" } } },
                            { header: true, value: "원인분류", format: { type: "label" } },
                            { name: "cause_cd",
                                editable: { type: "select", data: { memory: "원인분류" },
                                    change: [  { name: "cause_tp", memory: "원인구분", key: [ "cause_cd" ] } ]
                                }
                            },
                            { header: true, value: "원인구분", format: { type: "label" } },
                            { name: "cause_tp",
                                editable: { type: "select", data: { memory: "원인구분", key: [ "cause_cd" ] } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "해당업체", format: { type: "label"} },
                            { name: "supp_nm", mask: "search", display: true, editable: { type: "text" } },
                            { header: true, value: "귀책구분", format: { type: "label"} },
                            { name: "duty_cd", editable: { type: "select", data: { memory: "귀책구분"}} },
                            { header: true, value: "반출일자", format: { type: "label" } },
                            { name: "mout_date", mask: "date-ymd", editable: { type: "text" } },
            				{ name: "supp_cd", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록자", format: { type: "label" } },
                            { name: "ins_usr" },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr" },
                            { header: true, value: "수정일시", format: { type: "label" } },
                            { name: "upd_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개선대책<br>및<br>처리내역", format: { type: "label" } },
                            { name: "rslt_rmk1", style: { colspan: 5 },
                              format: { type: "textarea", rows: 5, width: 734 },
                              editable: { type: "textarea", rows: 5, width: 734 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "특이사항", format: { type: "label" } },
                            { name: "rslt_rmk2", style: { colspan: 5 },
                              format: { type: "textarea", rows: 5, width: 734 },
                              editable: { type: "textarea", rows: 5, width: 734 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //2021-05-11 KYT
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일", 
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [

                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "_download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 450, align: "left", editable: { type: "text" } },
                { header: "등록자", name: "ins_usr_nm", width: 80, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true, editable: { type: "hidden" } },
                //{ name: "data_subkey", hidden: true },
                //{ name: "data_subseq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "ver_no", hidden: true, editable: { type: "hidden" } }




				//{ header: "파일명", name: "file_nm", width: 270, align: "left" },
				//{ header: "다운로드", name: "download", width: 60, align: "center",
				//  format: { type: "link", value: "다운로드" } },
    //            { header: "등록자", name: "upd_usr", width: 70, align: "center" },
    //            { header: "부서", name: "upd_dept", width: 80, align: "center" },
				//{ header: "파일설명", name: "file_desc", width: 330, align: "left",
				//  editable: { type: "text" } },
    //            { name: "file_ext", hidden: true },
    //            { name: "file_path", hidden: true },
    //            { name: "network_cd", hidden: true },
    //            { name: "data_tp", hidden: true },
    //            { name: "data_key", hidden: true },
    //            { name: "data_seq", hidden: true },
    //            { name: "file_id", hidden: true, editable: { type: "hidden" } },
				//{ name: "_edit_yn", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_상세메모", query: "EHM_2010_S_8", type: "TABLE", title: "상세 메모",
            caption: true,
            width: "100%",
            show: true,
            selectable: true,
            content: {
                width: {
                    field: "100%"
                },
                height: 200,
                row: [
                    {
                        element: [
                            {
                                name: "memo_text",
                                format: {
                                    type: "html",
                                    height: 200
                                }
                            },
                            {
                                name: "issue_no",
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
        var args = { targetid: "lyrDown",
            width: 0,
            height: 0,
            show: false
        };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_발생정보",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_AS발생정보",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_제조발생정보",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_품질발생정보",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_AS발생내역",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_제조발생내역",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_품질발생내역",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_발생내용",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_AS조치내역",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_제조조치내역",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_품질조치내역",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_조치내용",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_AS교체PART",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_제조교체PART",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_품질교체PART",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_교체내용",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_처리결과",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_FileA",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_상세메모",
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
            targetid: "grdData_발생정보",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_발생정보
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_발생정보",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발생정보
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_AS발생내역",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발생내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_제조발생내역",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발생내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_품질발생내역",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발생내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_발생내용",
            event: "itemdblclick",
            handler: itemdblclick_frmData_발생내용
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_조치내용",
            event: "itemdblclick",
            handler: itemdblclick_frmData_조치내용
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_교체내용",
            event: "itemdblclick",
            handler: itemdblclick_frmData_교체내용
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_처리결과",
            event: "itemdblclick",
            handler: itemdblclick_frmData_처리결과
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_처리결과",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_처리결과
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_FileA",
            grid: true,
            element: "_download",
            event: "click",
            handler: click_grdData_FileA_download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

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
        //2021-05-11 KYT
        function click_lyrMenu_2_추가(ui) {

            //if (!checkUpdatable({ check: true })) return false;

            //var args = { type: "PAGE", page: "w_upload_qmproc", title: "파일 업로드", width: 650, height: 200, locate: ["center", 910], open: true };
            //if (gw_com_module.dialoguePrepare(args) == false) {
            //    var args = { page: "w_upload_qmproc",
            //        param: { ID: gw_com_api.v_Stream.msg_upload_QMPROC,
            //            data: { user: gw_com_module.v_Session.USR_ID,
            //                key: v_global.root.key,
            //                seq: 1
            //            }
            //        }
            //    };
            //    gw_com_module.dialogueOpen(args);
            //}

            //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
            //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

            // Check Updatable
            //if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            // set data for "File Upload"
            var dataType = "ASISSUE";    // Set File Data Type
            var dataKey = v_global.root.key; // Main Key value for Search
            var dataSeq = gw_com_api.getValue("grdData_발생정보", "selected", "1");   // Main Seq value for Search

            // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
            v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq, user: gw_com_module.v_Session.USR_ID }; // additional data = { data_subkey: "", data_subseq:-1 }

            // set Argument for Dialogue
            var pageArgs = dataType + ":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
            var args = {
                type: "PAGE", open: true, locate: ["center", 100],
                width: 660, height: 350, scroll: true,  // multi( h:350, scroll) / single(h:300)
                page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
                data: v_global.event.data  // reOpen 을 위한 Parameter
            };

            // Open dialogue
            gw_com_module.dialogueOpenJJ(args);

        }
        //----------
        // 2021-05-12 KYT
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({ afile: true })) return;

            var args = {
                targetid: "grdData_FileA",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_발생정보(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_발생정보(ui) {

            setObject({ type: gw_com_api.getValue("grdData_발생정보", "selected", "issue_part", true) });
            processLink({});

        };
        //----------
        function rowselected_grdData_발생내역(ui) {

            processLink({ sub: true });

        };
        //----------
        function itemdblclick_frmData_발생내용(ui) {

            switch (ui.element) {
                case "rmk_text":
                    {
                        v_global.logic.memo = "발생 내용";
                        processMemo({
                            type: ui.type,
                            object: ui.object,
                            row: ui.row,
                            element: ui.element
                        });
                    }
                    break;
            }

        }
        //----------
        function itemdblclick_frmData_조치내용(ui) {

            switch (ui.element) {
                case "rmk_text":
                    {
                        v_global.logic.memo = "조치 내용";
                        processMemo({
                            type: ui.type,
                            object: ui.object,
                            row: ui.row,
                            element: ui.element
                        });
                    }
                    break;
            }

        }
        //----------
        function itemdblclick_frmData_교체내용(ui) {

            switch (ui.element) {
                case "rmk_text":
                    {
                        v_global.logic.memo = "교체 내용";
                        processMemo({
                            type: ui.type,
                            object: ui.object,
                            row: ui.row,
                            element: ui.element
                        });
                    }
                    break;
            }

        }
        //----------
        function itemdblclick_frmData_처리결과(ui) {

            switch (ui.element) {
                case "supp_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "DLG_SUPPLIER",
                            title: "해당업체 선택",
                            width: 600,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "DLG_SUPPLIER",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectSupplier
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
            }
        }
        //----------
        function click_grdData_FileA_download(ui) {

            var args = {
                source: {
                    id: "grdData_FileA",
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -10 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            setObject({ call: true, type: gw_com_api.getPageParameter("issue_part") });
            processLink({
                by: {
                    issue_no: gw_com_api.getPageParameter("issue_no")
                }
            });
        }

    }
    //#endregion

};

// 2021-05-12 KYT
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ASISSUE" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: param.data_key == undefined ? "%" : param.data_key },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? -1 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? -1 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function getObject(param) {

    switch (param.type) {
        case "AS":
            return "AS";
        case "PM":
            return "제조";
        case "QC":
            return "품질";
    }

}
//----------
function setObject(param) {

    v_global.root.type = param.type;

    if (param.call) {
        closeOption({});
        gw_com_api.hide("lyrMenu_1", "조회");
        gw_com_api.remove("frmOption");
        gw_com_api.remove("lyrRemark");
        gw_com_api.remove("grdData_발생정보");
    }
    var target = "";
    switch (param.type) {
        case "AS":
            target = "AS";
            break;
        case "PM":
            target = "제조";
            break;
        case "QC":
            target = "품질";
            break;
        default:
            return;
    }
    switch (target) {
        case "AS":
            {
                gw_com_api.show("frmData_AS발생정보");
                gw_com_api.show("grdData_AS발생내역");
                gw_com_api.show("grdData_AS조치내역");
                gw_com_api.show("grdData_AS교체PART");
                gw_com_api.hide("frmData_제조발생정보");
                gw_com_api.hide("grdData_제조발생내역");
                gw_com_api.hide("grdData_제조조치내역");
                gw_com_api.hide("grdData_제조교체PART");
                gw_com_api.hide("frmData_품질발생정보");
                gw_com_api.hide("grdData_품질발생내역");
                gw_com_api.hide("grdData_품질조치내역");
                gw_com_api.hide("grdData_품질교체PART");
            }
            break;
        case "제조":
            {
                gw_com_api.show("frmData_제조발생정보");
                gw_com_api.show("grdData_제조발생내역");
                gw_com_api.show("grdData_제조조치내역");
                gw_com_api.show("grdData_제조교체PART");
                gw_com_api.hide("frmData_AS발생정보");
                gw_com_api.hide("grdData_AS발생내역");
                gw_com_api.hide("grdData_AS조치내역");
                gw_com_api.hide("grdData_AS교체PART");
                gw_com_api.hide("frmData_품질발생정보");
                gw_com_api.hide("grdData_품질발생내역");
                gw_com_api.hide("grdData_품질조치내역");
                gw_com_api.hide("grdData_품질교체PART");
            }
            break;
        case "품질":
            {
                gw_com_api.show("frmData_품질발생정보");
                gw_com_api.show("grdData_품질발생내역");
                gw_com_api.show("grdData_품질조치내역");
                gw_com_api.show("grdData_품질교체PART");
                gw_com_api.hide("frmData_AS발생정보");
                gw_com_api.hide("grdData_AS발생내역");
                gw_com_api.hide("grdData_AS조치내역");
                gw_com_api.hide("grdData_AS교체PART");
                gw_com_api.hide("frmData_제조발생정보");
                gw_com_api.hide("grdData_제조발생내역");
                gw_com_api.hide("grdData_제조조치내역");
                gw_com_api.hide("grdData_제조교체PART");
            }
            break;
    }

}
//----------
function checkManipulate(param) {

    closeOption({});

	if (param.afile){
	    if (gw_com_api.getSelectedRow("grdData_FileA") == null) {
	        gw_com_api.messageBox([
	            { text: "NOMASTER" }
	        ]);
	        return false;
	    }
	}
	else{
	    if (gw_com_api.getSelectedRow("grdData_발생정보") == null) {
	        gw_com_api.messageBox([
	            { text: "NOMASTER" }
	        ]);
	        return false;
	    }
	}
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var target = getObject({ type: v_global.root.type });
    var args = {
        check: param.check,
        target: [
            {
                type: "GRID",
                id: "grdData_" + target + "교체PART"
            },
			{
			    type: "FORM",
			    id: "frmData_처리결과"
			},
			{
			    type: "GRID",
			    id: "grdData_FileA"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

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
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "issue_part",
                    argument: "arg_issue_part"
                },
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
				    name: "cust_dept",
				    argument: "arg_cust_dept"
				},
				{
				    name: "cust_prod_nm",
				    argument: "arg_cust_prod_nm"
				},
				{
				    name: "proj_no",
				    argument: "arg_proj_no"
				},
				{ name: "wrnt_io", argument: "arg_wrnt_io" },
				{
				    name: "part_change",
				    argument: "arg_part_change"
				}
				, { name: "issue_type", argument: "arg_issue_type" }
			],
            remark: [
	            {
	                element: [{ name: "issue_part"}]
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
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "cust_dept"}]
		        },
		        {
		            element: [{ name: "cust_prod_nm"}]
		        },
		        {
		            element: [{ name: "proj_no"}]
		        },
		        { element: [{ name: "wrnt_io"}] },
		        {
		            element: [{ name: "part_change"}]
		        },
		        { element: [{ name: "issue_type"}] }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_발생정보",
			    select: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var target = getObject({ type: v_global.root.type });

    var args = {};
    if (param.sub) {
        args = {
            source: {
                type: "GRID",
                id: "grdData_" + target + "발생내역",
                row: "selected",
                block: true,
                element: [
				    { name: "issue_no", argument: "arg_issue_no" },
                    { name: "issue_seq", argument: "arg_issue_seq" }
			    ]
            },
            target: [
                { type: "GRID", id: "grdData_" + target + "조치내역" },
			    { type: "GRID", id: "grdData_" + target + "교체PART" }
		    ],
            key: param.key
        };
    }
    else {
        if (param.by != undefined)
            v_global.root.key = param.by.issue_no;
        else
            v_global.root.key = gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true);

        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "issue_no", argument: "arg_issue_no", value: v_global.root.key }
                ]
            },
            target: [
                {
                    type: "FORM",
                    id: "frmData_" + target + "발생정보"
                },
                {
                    type: "GRID",
                    id: "grdData_" + target + "발생내역",
                    select: true
                },
			    {
			        type: "FORM",
			        id: "frmData_발생내용"
			    },
			    {
			        type: "FORM",
			        id: "frmData_조치내용"
			    },
			    {
			        type: "FORM",
			        id: "frmData_교체내용"
			    },
                {
                    type: "FORM",
                    id: "frmData_처리결과",
                    creatable: {
                        data: [
                            { name: "cust_nm", value: gw_com_api.getPageParameter("cust_nm"), change: false },
                            { name: "cust_dept", value: gw_com_api.getPageParameter("cust_dept"), change: false },
                            { name: "wrnt_io", value: gw_com_api.getPageParameter("wrnt_io"), change: false },
                            { name: "rslt_tp", value: "10", change: false },
                            { name: "rslt_emp", value: gw_com_module.v_Session.USR_NM, change: false }
                        ]
                    }
                },
			    //{
			    //    type: "GRID",
			    //    id: "grdData_FileA"
			    //},
			    {
			        type: "FORM",
			        id: "frmData_상세메모"
			    }
		    ],
            clear: [
			    {
			        type: "GRID",
			        id: "grdData_AS조치내역"
			    },
                {
                    type: "GRID",
                    id: "grdData_제조조치내역"
                },
                {
                    type: "GRID",
                    id: "grdData_품질조치내역"
                },
			    {
			        type: "GRID",
			        id: "grdData_AS교체PART"
			    },
			    {
			        type: "GRID",
			        id: "grdData_제조교체PART"
			    },
			    {
			        type: "GRID",
			        id: "grdData_품질교체PART"
			    }
		    ],
            key: param.key
        };

    }
    gw_com_module.objRetrieve(args);
    //2021-05-11 KYT file list
    processFileList({
        data_key: v_global.root.key
    });
}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_발생정보", v_global.process.current.master, true, false);

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args = {
        type: "PAGE",
        page: "w_edit_memo",
        title: "상세 내용",
        width: 790,
        height: 572,
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_edit_memo",
            param: {
                ID: gw_com_api.v_Stream.msg_edit_Memo,
                data: {
                    title: v_global.logic.memo,
                    text: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element, false, true)
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processSave(param) {

    var target = getObject({ type: v_global.root.type });
    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_" + target + "교체PART"
            },
			{
			    type: "FORM",
			    id: "frmData_처리결과"
			},
			{
			    type: "GRID",
			    id: "grdData_FileA"
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
                type: "FORM",
                id: "frmData_AS발생정보"
            },
            {
                type: "FORM",
                id: "frmData_제조발생정보"
            },
            {
                type: "FORM",
                id: "frmData_품질발생정보"
            },
            {
                type: "GRID",
                id: "grdData_AS발생내역"
            },
            {
                type: "GRID",
                id: "grdData_제조발생내역"
            },
            {
                type: "GRID",
                id: "grdData_품질발생내역"
            },
			{
			    type: "FORM",
			    id: "frmData_발생내용"
			},
			{
			    type: "GRID",
			    id: "grdData_AS조치내역"
			},
			{
			    type: "GRID",
			    id: "grdData_제조조치내역"
			},
			{
			    type: "GRID",
			    id: "grdData_품질조치내역"
			},
			{
			    type: "FORM",
			    id: "frmData_조치내용"
			},
			{
			    type: "GRID",
			    id: "grdData_AS교체PART"
			},
			{
			    type: "GRID",
			    id: "grdData_제조교체PART"
			},
			{
			    type: "GRID",
			    id: "grdData_품질교체PART"
			},
			{
			    type: "FORM",
			    id: "frmData_교체내용"
			},
            {
                type: "FORM",
                id: "frmData_처리결과"
            },
			{
			    type: "GRID",
			    id: "grdData_FileA"
			},
			{
			    type: "FORM",
			    id: "frmData_상세메모"
			}
		]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_발생정보"
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
function successSave(response, param) {

    processLink({
        key: response,
        by: {
            issue_no: v_global.root.key
        }
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
                                processSave({});
                            else {
                                processLink({});
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
        case gw_com_api.v_Stream.msg_uploaded_QMPROC:
            {
                var args = {
                    source: {
                        type: "GRID",
                        id: "grdData_발생정보",
                        row: "selected",
                        element: [
				            {
				                name: "issue_no",
				                argument: "arg_issue_no"
				            }
			            ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_FileA",
			                select: true
			            }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
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
                    case "w_edit_memo":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_Memo;
                            args.data = {
                                title: v_global.logic.memo,
                                text: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element, false, true)
                            };
                        }
                        break;
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        }
                        break;
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    // 2021-05-11 KYT
                    case "SYS_FileUpload":
                        {
                            processFileList({
                                data_key: v_global.root.key
                            });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//