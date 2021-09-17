//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
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
                    type: "PAGE", name: "발생구분", query: "dddw_issuetp",
                    param: [
                        { argument: "arg_rcode", value: "PM" }
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
                    type: "INLINE", name: "중요도",
                    data: [
						{ title: "상", value: "상" },
						{ title: "중", value: "중" },
						{ title: "하", value: "하" }
					]
                },
				{
				    type: "PAGE", name: "Module", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM05" }
                    ]
				},
				{
				    type: "PAGE", name: "상태", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM13" }
                    ]
				},
				{
				    type: "PAGE", name: "발생Module", query: "dddw_zcoder",
				    param: [
                        { argument: "arg_hcode", value: "IPOP22" }
                    ]
				},
                {
                    type: "PAGE", name: "발생부위", query: "dddw_zcoder",
                    param: [
                        { argument: "arg_hcode", value: "IPOP32" }
                    ]
                },
				{
				    type: "PAGE", name: "발생원인", query: "dddw_zcoder",
				    param: [
                        { argument: "arg_hcode", value: "IPOP33" }
                    ]
				},
				{
				    type: "PAGE", name: "조치분류", query: "dddw_zcodef",
				    param: [
                        { argument: "arg_hcode", value: "IPOP24" }
                    ]
				},
				{
				    type: "PAGE", name: "조치구분", query: "dddw_zcodef",
				    param: [
                        { argument: "arg_hcode", value: "IPOP34" }
                    ]
				},
				{
				    type: "PAGE", name: "조치상태", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM13" }
                    ]
				},
				{
				    type: "PAGE", name: "교체분류", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IPOP12" }
                    ]
				},
				{
				    type: "PAGE", name: "교체구분", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM12" }
                    ]
				},
				{
				    type: "PAGE", name: "1차원인", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM73" }]
				},
                {
                    type: "INLINE", name: "유/무",
                    data: [{ title: "유", value: "1" }, { title: "무", value: "0" }]
                },
                {
                    type: "INLINE", name: "준수여부",
                    data: [{ title: "준수", value: "1" }, { title: "미준수", value: "0" }]
                },
				{
				    type: "PAGE", name: "PartFail", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM74" }]
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

            v_global.logic.proj_no = gw_com_api.getPageParameter("proj_no");
            gw_com_api.setValue("frmOption", 1, "proj_no", v_global.logic.proj_no);
            gw_com_api.setValue("frmOption", 1, "mact_id", gw_com_api.getPageParameter("mact_id"));
            gw_com_api.setValue("frmOption", 1, "issue_tp", gw_com_api.getPageParameter("issue_tp"));
            //gw_com_api.setValue("frmOption", 1, "proj_no", "SE16PE013");

            processRetrieve({});

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
            targetid: "lyrMenu_1_1", type: "FREE",
            element: [
                //{ name: "조회", value: "조회", act: true },
                //{ name: "추가", value: "추가" },
                //{ name: "저장", value: "저장" },
                //{ name: "삭제", value: "삭제" },
                //{ name: "출력", value: "출력", icon: "출력" },
                //{ name: "NCR", value: "NCR 접수", icon: "실행" },
                //{ name: "ECR", value: "개선제안", icon: "실행" },
                { name: "닫기", value: "닫기" }
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
                                name: "mact_id",
                                label: {
                                    title: "mact_id :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 10
                                }
                            },
                            {
                                name: "issue_tp",
                                label: {
                                    title: "issue_tp :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
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
            query: "SCM_8020_M_1",
            title: "발생 정보",
            caption: true,
            height: 90,
            show: true,
            selectable: true,
            element: [
				{
				    header: "관리번호",
				    name: "issue_no",
				    width: 80,
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
				    header: "발생현상",
				    name: "rmk",
				    width: 300,
				    align: "left"
				},
				{ header: "NCR 상태", name: "ncr_stat", width: 70, align: "center" },
                {
				    header: "확인",
				    name: "astat",
				    width: 60,
				    align: "center"
				},
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
				    name: "prod_key",
				    hidden: true,
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_발생정보",
            query: "w_qcm2020_M_2",
            type: "TABLE",
            title: "발생 정보",
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
                                name: "cust_nm",
                                mask: "search"
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
                                name: "cust_prod_nm",
                                display: true
                            },
                            {
                                header: true,
                                value: "제품명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "prod_nm",
                                display: true
                            },
                            {
                                header: true,
                                value: "Project No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "proj_no",
                                display: true
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
                                    colspan: 3
                                },
                                name: "rmk",
                                format: {
                                    type: "text",
                                    width: 630
                                },
                                editable: {
                                    type: "text",
                                    width: 630,
                                    validate: {
                                        rule: "required",
                                        message: "발생현상"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "지연시간",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "delay_hour", mask: "numeric-int",
                                editable: { type: "text" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록자", format: { type: "label" } },
                            { name: "ins_usr" },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr" },
                            { header: true, value: "확인자/확인일시", format: { type: "label" } },
                            { name: "aemp", format: { type: "text", width: 50 }, style: { colfloat: "float" } },
                            { name: "adate", style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록일시", format: { type: "label" } },
                            { name: "ins_dt" },
                            { header: true, value: "수정일시", format: { type: "label" } },
                            { name: "upd_dt" },
                            { header: true, value: "부품 Fail", format: { type: "label" } },
                            { name: "part_fail" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "CS표준유무", format: { type: "label" } },
                            {
                                name: "standard_yn"
                            },
                            { header: true, value: "CS표준준수여부", format: { type: "label" } },
                            {
                                name: "follow_yn"
                            },
                            { header: true, value: "표준번호", format: { type: "label" } },
                            { name: "standard_no" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제조Test유무", format: { type: "label" } },
                            {
                                name: "ptest_yn"
                            },
                            { header: true, value: "1차원인선택", format: { type: "label" } },
                            {
                                name: "factor_tp"
                            },
                            { header: true, value: "1차원인근거", format: { type: "label" } },
                            { name: "basis_rmk" },
                            { name: "cust_cd", hidden: true },
                            { name: "prod_key", hidden: true },
                            { name: "prod_type", hidden: true },
                            { name: "pdate", hidden: true }
                        ]
                    }
                    //{
                    //    element: [
                    //        {
                    //            header: true,
                    //            value: "품질확인",
                    //            format: {
                    //                type: "label"
                    //            }
                    //        },
                    //        {
                    //            name: "qstat"
                    //        },
                    //        {
                    //            header: true,
                    //            value: "품질확인자",
                    //            format: {
                    //                type: "label"
                    //            }
                    //        },
                    //        {
                    //            name: "qemp"
                    //        },
                    //        {
                    //            header: true,
                    //            value: "품질확인일시",
                    //            format: {
                    //                type: "label"
                    //            }
                    //        },
                    //        {
                    //            name: "qdate"
                    //        }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_발생내역",
            query: "w_qcm2020_S_1",
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
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "제품유형"
				        }
				    }
				},
				{
				    header: "Module",
				    name: "part_tp1",
				    width: 200,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "발생Module"
				        }
				    }
				},
				{
				    header: "발생부위",
				    name: "part_tp2",
				    width: 262,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "발생부위"
				        }
				    }
				},
				{
				    header: "발생원인",
				    name: "reason_tp2",
				    width: 262,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "발생원인"
				        }
				    }
				},
                {
                    name: "duty_tp1",
                    hidden: true
                },
                {
                    name: "duty_tp2",
                    hidden: true
                },
                {
                    name: "reason_tp1",
                    hidden: true
                },
                {
                    name: "status_tp1",
                    hidden: true
                },
                {
                    name: "status_tp2",
                    hidden: true
                },
                {
                    name: "prod_sub",
                    hidden: true
                },
                {
                    name: "issue_tp",
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
            targetid: "frmData_발생현상상세",
            query: "w_qcm2020_S_2",
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
                                    width: 1030
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
            query: "w_qcm2020_S_3",
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
				    width: 92,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "조치분류",
				    name: "work_tp1",
				    width: 200,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "조치분류"
				        }
				    }
				},
				{
				    header: "조치구분",
				    name: "work_tp2",
				    width: 70,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "조치구분"
				        }
				    }
				},
				{
				    header: "작업시간",
				    name: "work_time",
				    width: 70,
				    align: "center",
				    mask: "numeric-float"
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
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "조치상태"
				        }
				    }
				},
                {
                    name: "prod_type",
                    hidden: true
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
            query: "w_qcm2020_S_4",
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
                                    width: 1030
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
            query: "w_qcm2020_S_5",
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
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "교체분류"
				        }
				    }
				},
				{
				    header: "교체구분",
				    name: "change_tp",
				    width: 80,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "교체구분"
				        }
				    }
				},
				{
				    header: "교체일자",
				    name: "change_dt",
				    width: 92,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "수급시간",
				    name: "change_time",
				    width: 70,
				    align: "center",
				    mask: "numeric-float"
				},
				{
				    header: "수량",
				    name: "change_qty",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{ header: "원인부품", name: "apart_cd", width: 120, align: "center", mask: "search"
				},
				{
				    header: "원인부품명",
				    name: "apart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "원인Part Ser.No.",
				    name: "apart_sno",
				    width: 150,
				    align: "center"
				},
				{
				    header: "교체부품",
				    name: "bpart_cd",
				    width: 120,
				    align: "center",
				    mask: "search"
				},
				{
				    header: "교체부품명",
				    name: "bpart_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "교체Part Ser.No.",
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
				}/*,
                {
                    name: "apart_key",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "bpart_key",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "apart_bom",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "bpart_bom",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                }*/,
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
            query: "w_qcm2020_S_6",
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
                                    width: 1030
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
            query: "w_qcm2020_S_0",
            type: "TABLE",
            title: "처리 결과",
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
                                value: "발생구분",
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
                                value: "귀책구분",
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
                                value: "작성일시",
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
            				    value: "",
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
            query: "w_qcm2020_S_7",
            title: "첨부 파일",
            caption: true,
            height: "100%",
            pager: false,
            show: false,
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
                },
				{
				    name: "_edit_yn",
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
        
        //----------
        var args = {
            targetid: "lyrMenu_1_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
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
        //----------
        var args = {
            targetid: "grdData_발생내역",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발생내역
        };
        gw_com_module.eventBind(args);
        ////----------
        //var args = {
        //    targetid: "grdData_첨부파일",
        //    grid: true,
        //    element: "download",
        //    event: "click",
        //    handler: click_grdData_첨부파일_download
        //};
        //gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_1_조회(ui) {

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
        function successRun(response, param) {

            //if (response.VALUE[0] != -1) {
            //    processPop({ object: "lyrMenu" });
            //    processRetrieve({});
            //}

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {
            top.window.close();
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

            v_global.process.prev.master = ui.row;

            processLink({ master: true });

        };
        //----------
        function itemdblclick_frmData_발생정보(ui) {

            switch (ui.element) {
                case "cust_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_prod_qcm",
                            title: "장비 검색",
                            width: 800,
                            height: 480,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_prod_qcm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProduct_QCM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }
        //----------
        function itemchanged_frmData_발생정보(ui) {

            switch (ui.element) {
                case "issue_tp":
                case "prod_sub":
                    {
                        var ids = gw_com_api.getRowIDs("grdData_발생내역");
                        $.each(ids, function () {
                            gw_com_api.setValue("grdData_발생내역",
			                            this,
			                            ui.element,
			                            ui.value.current,
			                            true);
                        });
                    }
                    break;
            }
            return true;

        };
        //----------
        function rowselected_grdData_발생내역(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------
        function itemdblclick_grdData_교체PART(ui) {

            switch (ui.element) {
                case "apart_cd":
                case "bpart_cd":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = { type: "PAGE", page: "w_find_part_qcm",
                            title: "부품 검색", width: 800, height: 460, open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = { page: "w_find_part_qcm",
                                param: { ID: gw_com_api.v_Stream.msg_selectPart_QCM }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }
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
        function click_frmData_조치내역상세(ui) {

            if (gw_com_api.getCRUD("frmData_조치내역상세") == "none") {
                gw_com_api.messageBox([
                    { text: "조치 내용은 조치 내역을 먼저 추가한 후에" },
                    { text: "입력할 수 있습니다." }
                ]);
            }

            return true;

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
        function click_frmData_교체내역상세(ui) {

            if (gw_com_api.getCRUD("frmData_교체내역상세") == "none") {
                gw_com_api.messageBox([
                    { text: "교체 내용은 교체 PART를 먼저 추가한 후에" },
                    { text: "입력할 수 있습니다." }
                ]);
            }

            return true;

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
//----------
function processRetrieve(param) {
    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };

    var issue_tp = "Set-Up";
    var mact_id = gw_com_api.getValue("frmOption", 1, "mact_id");
    var proj_no = "";

    if (mact_id != "" && mact_id != undefined) {
        issue_tp = "제조";
        proj_no = "%";
    }
    else {
        issue_tp = "Set-Up";
        mact_id = 0;
        proj_no = v_global.logic.proj_no;
    }
    //if (gw_com_module.objValidate(args) == false) {
    //    processClear({ master: true });
    //    return false;
    //}

    //if (param.key != undefined) {
    //    $.each(param.key, function () {
    //        if (this.QUERY == "w_qcm2020_M_2")
    //            this.QUERY = "w_qcm2020_M_1";
    //    });
    //}
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_issue_tp", value: issue_tp },
                { name: "arg_mact_id", value: mact_id },
                { name: "arg_proj_no", value: proj_no }
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
    else if (param.master) {
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
                }
		    ],
            key: param.key,
            handler: {
                complete: processLink,
                param: {}
            }
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
			        id: "frmData_조치내역상세",
			        clear: true,
			        edit: true
			    },
			    {
			        type: "FORM",
			        id: "frmData_교체내역상세",
			        clear: true,
			        edit: true
			    },
                {
                    type: "FORM",
                    id: "frmData_처리결과"
                },
			    {
			        type: "GRID",
			        id: "grdData_첨부파일"
			    }
		    ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    (param.sub)
        ? gw_com_api.selectRow("grdData_발생내역", v_global.process.current.sub, true, false)
        : gw_com_api.selectRow("grdData_발생정보", v_global.process.current.master, true, false);

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
//function closeDialogue(param) {

//    var args = {
//        page: param.page
//    };
//    gw_com_module.dialogueClose(args);
//    if (param.focus) {
//        gw_com_api.setFocus(v_global.event.object,
//	                        v_global.event.row,
//	                        v_global.event.element,
//	                        (v_global.event.type == "GRID") ? true : false);
//    }

//}
//----------

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
                                if (param.data.arg.sub) {
                                    var status = checkCRUD({});
                                    if (status == "initialize" || status == "create")
                                        processClear({});
                                    else if (status == "update"
                                        || gw_com_api.getUpdatable("frmData_발생현상상세")
                                        || gw_com_api.getUpdatable("frmData_조치내역상세")
                                        || gw_com_api.getUpdatable("frmData_교체내역상세")
                                        || gw_com_api.getUpdatable("grdData_첨부파일", true))
                                        processLink({ master: true });
                                    else {
                                        var status = checkCRUD(param.data.arg);
                                        if (status == "initialize" || status == "create")
                                            processDelete(param.data.arg);
                                        else if (status == "update")
                                            processRestore(param.data.arg);
                                        if (v_global.process.handler != null)
                                            v_global.process.handler(param.data.arg);
                                    }
                                }
                                else
                                    if (v_global.process.handler != null)
                                        v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove(param.data.arg);
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
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            //if (param.data.result == "YES") {
                            //    if (param.data.arg.apply)
                            //        processRun({});
                            //} else {
                            //    processPop({ object: "lyrMenu" });
                            //}
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_QCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_nm",
			                        param.data.cust_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_dept",
			                        param.data.cust_dept,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_proc",
			                        param.data.cust_proc,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_prod_nm",
			                        param.data.cust_prod_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_no",
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "prod_key",
			                        param.data.prod_key,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "prod_type",
			                        param.data.prod_type,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "prod_nm",
			                        param.data.prod_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
                var ids = gw_com_api.getRowIDs("grdData_발생내역");
                $.each(ids, function () {
                    gw_com_api.setValue("grdData_발생내역",
			                            this,
			                            "prod_type",
			                            param.data.prod_type,
			                            true);
                    gw_com_api.filterSelect("grdData_발생내역", this, "part_tp1",
                                            { memory: "발생Module", by: [
                                                { source:
                                                    { id: "frmData_발생정보", row: 1, key: "prod_type" }
                                                }]
                                            },
                                            true);
                    gw_com_api.filterSelect("grdData_발생내역", this, "reason_tp2",
                                            { memory: "발생원인", by: [
                                                { source:
                                                    { id: "frmData_발생정보", row: 1, key: "prod_type" }
                                                }]
                                            },
                                            true);
                });
                var ids = gw_com_api.getRowIDs("grdData_조치내역");
                $.each(ids, function () {
                    gw_com_api.filterSelect("grdData_조치내역", this, "work_tp1",
                                            { memory: "조치분류", by: [
                                                { source:
                                                    { id: "frmData_발생정보", row: 1, key: "prod_type" }
                                                }]
                                            },
                                            true);
                });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_QCM:
            {
                if (v_global.event.element == "apart_cd") {
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "apart_cd",
			                            param.data.part_cd,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "apart_nm",
			                            param.data.part_nm,
			                            (v_global.event.type == "GRID") ? true : false);
                    if (gw_com_api.getValue(v_global.event.object,
			                                v_global.event.row,
			                                "bpart_cd",
			                                (v_global.event.type == "GRID") ? true : false) == "") {
                        gw_com_api.setValue(v_global.event.object,
			                                v_global.event.row,
			                                "bpart_cd",
			                                param.data.part_cd,
			                                (v_global.event.type == "GRID") ? true : false);
                        gw_com_api.setValue(v_global.event.object,
			                                v_global.event.row,
			                                "bpart_nm",
			                                param.data.part_nm,
			                                (v_global.event.type == "GRID") ? true : false);
                    }
                }
                else if (v_global.event.element == "bpart_cd") {
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "bpart_cd",
			                            param.data.part_cd,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "bpart_nm",
			                            param.data.part_nm,
			                            (v_global.event.type == "GRID") ? true : false,
			                            true);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                if (param.data.update)
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
			                            param.data.text);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_ASISSUE:
            {
                
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASISSUE:
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
			                id: "grdData_첨부파일",
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
                    case "w_find_prod_qcm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_QCM;
                        }
                        break;
                    case "w_find_part_qcm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_QCM;
                        }
                        break;
                    case "w_edit_memo":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_Memo;
                            args.data = {
                                edit: true,
                                title: v_global.logic.memo,
                                text: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                            };
                        }
                        break;
                    case "w_upload_asissue":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASISSUE;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true),
                                seq: 0
                            };
                        }
                        break;
                    case "w_edit_asissue":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_ASISSUE;
                            args.data = {
                                issue_no: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true)
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