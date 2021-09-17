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
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "issue_no",
				                label: {
				                    title: "관리번호 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 10,
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
            targetid: "frmData_발생정보",
            query: "w_find_faulty_M_2",
            type: "TABLE",
            title: "발생 정보",
            caption: true,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 70,
                    field: 200
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
                                value: "Project No",
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
                                name: "cust_cd",
                                hidden: true
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
            query: "w_find_faulty_S_1",
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
				    width: 100,
				    align: "center"
				},
				{
				    header: "Module",
				    name: "part_tp1",
				    width: 100,
				    align: "center"
				},
				{
				    header: "발생부위",
				    name: "part_tp2",
				    width: 200,
				    align: "center"
				},
				{
				    header: "발생원인",
				    name: "reason_tp2",
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
        var args = {
            targetid: "frmData_발생현상상세",
            query: "w_find_faulty_S_2",
            type: "TABLE",
            title: "발생 내용",
            width: "100%",
            show: true,
            selectable: true,
            content: {
                height: 25,
                width: {
                    label: 80,
                    field: 650
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
            query: "w_find_faulty_S_3",
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
            query: "w_find_faulty_S_4",
            type: "TABLE",
            title: "조치 내용",
            width: "100%",
            show: true,
            selectable: true,
            content: {
                height: 25,
                width: {
                    label: 80,
                    field: 650
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
            query: "w_find_faulty_S_5",
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
				    width: 92,
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
				    header: "원인Part Ser.No.",
				    name: "apart_sno",
				    width: 150,
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
            query: "w_find_faulty_S_6",
            type: "TABLE",
            title: "교체 내용",
            width: "100%",
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 80,
                    field: 650
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
            query: "w_find_faulty_S_0",
            type: "TABLE",
            title: "처리결과",
            caption: true,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 70,
                    field: 200
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
            query: "w_find_faulty_S_7",
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
            targetid: "frmData_상세메모",
            query: "w_find_faulty_S_8",
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
        function rowselected_grdData_발생내역(ui) {

            processLink({});

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
				    name: "issue_no",
				    argument: "arg_issue_no"
				}
			],
            remark: [
			    {
			        element: [{ name: "issue_no"}]
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
			    id: "frmData_처리결과",
			    offset: 8
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
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
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
        page: "w_find_memo",
        title: "상세 내용",
        width: 790,
        height: 380,
        open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_memo",
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
        case gw_com_api.v_Stream.msg_infoFaulty:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.issue_no
                        != gw_com_api.getValue("frmOption", 1, "issue_no")) {
                        gw_com_api.setValue("frmOption", 1, "issue_no", param.data.issue_no);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "issue_no");

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_memo":
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

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//