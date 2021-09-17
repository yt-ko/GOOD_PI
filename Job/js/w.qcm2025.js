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
				    type: "PAGE", name: "LINE", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
				{
				    type: "PAGE", name: "확인", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM18" }
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
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "저장",
				    value: "저장"
				},
                {
                    name: "출력",
                    value: "출력",
                    icon: "출력"
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
            show: false,
            element: [
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
                            {
                                name: "proj_no",
                                label: {
                                    title: "Project No :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 10
                                }
                            },
				            {
				                name: "astat_yn",
				                value: "0",
				                label: {
				                    title: "확인 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "확인",
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
				                    size: 1,
				                    data: {
				                        memory: "고객사",
				                        unshift: [
				                            { title: "전체", value: "%" }
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
				                    size: 1,
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
				                name: "cust_prod_nm",
				                label: {
				                    title: "고객설비명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 15,
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
            targetid: "grdData_발생정보",
            query: "w_qcm2025_M_1",
            title: "발생 정보",
            caption: true,
            height: 130,
            dynamic: true,
            show: true,
            selectable: true,
            color: {
                element: ["astat"]
            },
            editable: {
                multi: true,
                bind: "edit_yn",
                focus: "astat",
                validate: true
            },
            element: [
                {
                    name: "edit_yn",
                    hidden: true
                },
                {
                    name: "color",
                    hidden: true
                },
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
				    name: "issue_tp",
				    width: 90,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_cd",
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
				    width: 170,
				    align: "left"
				},
				{
				    header: "확인",
				    name: "astat",
				    width: 80,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "확인"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "확인"
				        }
				    }
				},
				{
				    header: "확인자",
				    name: "aemp_nm",
				    width: 70,
				    align: "center"
				}/*,
				{
				    header: "확인일자",
				    name: "adate",
				    width: 80,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "hidden"
				    }
				}*/,
                {
                    header: "Project No.",
                    name: "proj_no",
                    width: 80,
                    align: "center"
                },
                {
                    header: "제품유형",
                    name: "prod_type",
                    width: 80,
                    align: "center"
                },
				{
				    header: "제품",
				    name: "prod_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "Module",
				    name: "prod_sub",
				    width: 60,
				    align: "center"
				},
				{
				    header: "중요도",
				    name: "important_level",
				    width: 60,
				    align: "center"
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "상태변경일",
				    name: "pdate",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "품질확인",
				    name: "qstat",
				    width: 60,
				    align: "center"
				},
				{
				    header: "품질확인일시",
				    name: "qdate",
				    width: 160,
				    align: "center"
				},
				{
				    header: "발생현상",
				    name: "rmk",
				    width: 300,
				    align: "left"
				},
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
				    name: "aemp",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "prod_key",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_발생정보",
            query: "w_qcm2025_M_2",
            type: "TABLE",
            title: "발생정보",
            //caption: true,
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
                                name: "issue_tp"
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
                                name: "cust_cd"
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
                                value: "확인자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "aemp"
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
                                value: "확인일시",
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
                                value: "품질확인",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "qstat"
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
                            },
                            {
                                name: "prod_key",
                                hidden: true
                            },
                            {
                                name: "pdate",
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
            targetid: "grdData_발생내역",
            query: "w_qcm2025_S_1",
            title: "발생 내역",
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
        var args = {
            targetid: "frmData_발생현상상세",
            query: "w_qcm2025_S_2",
            type: "TABLE",
            title: "발생 내용",
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
                                    rows: 5,
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
        var args = {
            targetid: "grdData_조치내역",
            query: "w_qcm2025_S_3",
            title: "조치 내역",
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
        var args = {
            targetid: "frmData_조치내역상세",
            query: "w_qcm2025_S_4",
            type: "TABLE",
            title: "조치 내용",
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
                                    rows: 5,
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
        var args = {
            targetid: "grdData_교체PART",
            query: "w_qcm2025_S_5",
            title: "교체 PART",
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
				    header: "원인부품",
				    name: "apart_cd",
				    width: 120,
				    align: "center"
				},
				{
				    header: "원인부품명",
				    name: "apart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "원인부품SNO",
				    name: "apart_sno",
				    width: 90,
				    align: "center"
				},
				{
				    header: "교체부품",
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
				    header: "교체부품SNO",
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
        var args = {
            targetid: "frmData_교체내역상세",
            query: "w_qcm2025_S_6",
            type: "TABLE",
            title: "교체 내용",
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
                                    rows: 3,
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
        var args = {
            targetid: "frmData_처리결과",
            query: "w_qcm2025_S_0",
            type: "TABLE",
            title: "처리결과",
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
                                value: "처리일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rslt_date",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "문제유형",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "issue_cd"
                            },
                            {
                                header: true,
                                value: "중점관리대상",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mng_yn",
                                format: {
                                    type: "checkbox",
                                    title: "",
                                    value: "1",
                                    offval: "0"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "처리결과",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rslt_tp"
                            },
                            {
                                header: true,
                                value: "원인구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "reason_cd"
                            },
                            {
                                header: true,
                                value: "관리구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mng_cd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "해당업체",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "supp_nm"
                            },
                            {
                                header: true,
                                value: "귀책사유",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "duty_cd"
                            },
                            {
                                header: true,
                                value: "반출일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mout_date",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "처리자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rslt_emp"
                            },
                            {
                                header: true,
                                value: "작성일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_dt"
                            },
                            {
                                header: true,
                                value: "처리완료",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "complete_yn",
                                format: {
                                    type: "checkbox",
                                    title: "완료",
                                    value: "1"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "개선대책<br>및<br>처리내역",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "rslt_rmk1",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 734
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "특이사항",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "rslt_rmk2",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 734
                                }
                            },
            				{
            				    name: "issue_no",
            				    hidden: true
            				},
				            {
				                name: "ins_usr",
				                hidden: true
				            },
				            {
				                name: "upd_usr",
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
            targetid: "grdData_첨부파일",
            query: "w_qcm2025_S_7",
            title: "첨부 파일",
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
				    width: 270,
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
                    header: "등록자",
                    name: "upd_usr",
                    width: 70,
                    align: "center"
                },
                {
                    header: "부서",
                    name: "upd_dept",
                    width: 80,
                    align: "center"
                },
				{
				    header: "설명",
				    name: "file_desc",
				    width: 330,
				    align: "left"
				},
                {
                    name: "file_path",
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
            targetid: "frmData_상세메모",
            query: "w_qcm2025_S_8",
            type: "TABLE",
            title: "상세 메모",
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
				    type: "GRID",
				    id: "grdData_발생정보",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_발생정보",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_발생내역",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_발생현상상세",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_조치내역",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_조치내역상세",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_교체PART",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_교체내역상세",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_처리결과",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_첨부파일",
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
        var args = {
            tabid: "lyrTab",
            target: [
				{
				    type: "LAYER",
				    id: "lyrData_등록",
				    title: "발생 등록"
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
            element: "출력",
            event: "click",
            handler: click_lyrMenu_1_출력
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
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
            targetid: "grdData_발생정보",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발생정보
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_발생정보",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_발생정보
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_발생내역",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발생내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_발생현상상세",
            event: "itemdblclick",
            handler: itemdblclick_frmData_발생현상상세
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_조치내역상세",
            event: "itemdblclick",
            handler: itemdblclick_frmData_조치내역상세
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_교체내역상세",
            event: "itemdblclick",
            handler: itemdblclick_frmData_교체내역상세
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_첨부파일",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_첨부파일_download
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
        function click_lyrMenu_1_출력(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;
            if (!checkExportable({})) return;

            processExport();

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

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
        function rowselected_grdData_발생정보(ui) {

            processLink({});

        };
        //----------
        function itemchanged_grdData_발생정보(ui) {

            switch (ui.element) {
                case "astat":
                    {
                        if (ui.value.current == "1" || ui.value.current == "2") {
                            gw_com_api.setValue(ui.object, ui.row, "aemp", gw_com_module.v_Session.EMP_NO, true);
                            gw_com_api.setValue(ui.object, ui.row, "aemp_nm", gw_com_module.v_Session.USR_NM, true);
                        }
                        else {
                            gw_com_api.setValue(ui.object, ui.row, "aemp", "", true, true);
                            gw_com_api.setValue(ui.object, ui.row, "aemp_nm", " ", true, true);
                        }
                    }
                    break;
            }

        };
        //----------
        function rowselected_grdData_발생내역(ui) {

            processLink({ sub: true });

        };
        //----------
        function itemdblclick_frmData_발생현상상세(ui) {

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
        function itemdblclick_frmData_조치내역상세(ui) {

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
        function itemdblclick_frmData_교체내역상세(ui) {

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
        function click_grdData_첨부파일_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부파일",
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

    return gw_com_api.getCRUD("grdData_발생정보", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
			{
			    type: "GRID",
			    id: "grdData_발생정보"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkExportable(param) {

    closeOption({});

    return true;

}
//----------
function checkClosable(param) {

    closeOption({});
    gw_com_api.selectTab("lyrTab", 1)

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
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
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
				{
				    name: "astat_yn",
				    argument: "arg_astat_yn"
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
		            element: [{ name: "proj_no"}]
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
                    element: [{ name: "astat_yn"}]
                }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_발생정보",
			    select: true
			}
		],
        clear: [
		    {
		        type: "FORM",
		        id: "frmData_발생정보"
		    },
		    {
		        type: "GRID",
		        id: "grdData_발생내역"
		    },
			{
			    type: "FORM",
			    id: "frmData_발생현상상세"
			},
			{
			    type: "GRID",
			    id: "grdData_조치내역"
			},
			{
			    type: "FORM",
			    id: "frmData_조치내역상세"
			},
			{
			    type: "GRID",
			    id: "grdData_교체PART"
			},
			{
			    type: "FORM",
			    id: "frmData_교체내역상세"
			},
			{
			    type: "FORM",
			    id: "frmData_처리결과"
			},
			{
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_상세메모"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
            source: {
                type: "GRID",
                id: "grdData_발생내역",
                row: "selected",
                block: true,
                element: [
				    {
				        name: "issue_no",
				        argument: "arg_issue_no"
				    },
                    {
                        name: "issue_seq",
                        argument: "arg_issue_seq"
                    }
			    ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_조치내역"
                },
			    {
			        type: "GRID",
			        id: "grdData_교체PART"
			    }
		    ],
            key: param.key
        };
    }
    else {
        args = {
            source: {
                type: "GRID",
                id: "grdData_발생정보",
                row: "selected",
                block: true,
                element: [
				    {
				        name: "issue_no",
				        argument: "arg_issue_no"
				    }
			    ]
            },
            target: [
                {
                    type: "FORM",
                    id: "frmData_발생정보"
                },
                {
                    type: "GRID",
                    id: "grdData_발생내역",
                    select: true
                },
			    {
			        type: "FORM",
			        id: "frmData_발생현상상세"
			    },
			    {
			        type: "FORM",
			        id: "frmData_조치내역상세"
			    },
			    {
			        type: "FORM",
			        id: "frmData_교체내역상세"
			    },
			    {
			        type: "FORM",
			        id: "frmData_처리결과"
			    },
			    {
			        type: "GRID",
			        id: "grdData_첨부파일"
			    },
			    {
			        type: "FORM",
			        id: "frmData_상세메모"
			    }
		    ],
            clear: [
			    {
			        type: "GRID",
			        id: "grdData_조치내역"
			    },
			    {
			        type: "GRID",
			        id: "grdData_교체PART"
			    }
		    ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

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
        height: 585,
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

    var args = {
        url: "COM",
        target: [
			{
			    type: "GRID",
			    id: "grdData_발생정보"
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
function processExport() {

    var args = {
        page: "w_qcm2020",
        source: {
            type: "GRID",
            id: "grdData_발생정보",
            row: "selected",
            json: true,
            element: [
                { name: "issue_no", argument: "arg_issue_no" }
            ]
        },
        option: [
            { name: "PRINT", value: "PDF" },
            { name: "PAGE", value: "w_qcm2020" }
        ],
        target: {
            type: "TAB",
            id: "lyrTab",
            name: "보고서",
            index: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true),
            height: 1310
        },
        handler: {
            success: successExport
        }
    };
    gw_com_module.objExport(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_발생정보"
            },
            {
                type: "GRID",
                id: "grdData_발생내역"
            },
			{
			    type: "FORM",
			    id: "frmData_발생현상상세"
			},
			{
			    type: "GRID",
			    id: "grdData_조치내역"
			},
			{
			    type: "FORM",
			    id: "frmData_조치내역상세"
			},
			{
			    type: "GRID",
			    id: "grdData_교체PART"
			},
			{
			    type: "FORM",
			    id: "frmData_교체내역상세"
			},
			{
			    type: "FORM",
			    id: "frmData_처리결과"
			},
			{
			    type: "GRID",
			    id: "grdData_첨부파일"
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

    processRetrieve({ key: response });

}
//----------
function successExport(response, param) {

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