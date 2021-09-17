//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    object: {
        type: null,
        id: null
    },
    row: null,
    element: null,
    entry: null
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
        var l_param = gw_com_module.initPage();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
				    type: "PAGE", name: "AS내역_제품군", query: "dddw_prodgroup"
				},
				{
				    type: "PAGE", name: "AS내역_고객사", query: "dddw_cust"
				},
				{
				    type: "PAGE", name: "AS내역_LINE", query: "dddw_custline"
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회"
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
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption",
            type: "FREE",
            trans: true,
            show: true,
            border: true,
            editable: {
                focus: "ymd_fr",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr",
				                value: gw_com_api.getDate("", {month:-6}),
				                label: {
				                    title: "발생일자 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    remark: {
				                        title: "발생일자 :"
				                    }
				                }
				            },
				            {
				                name: "ymd_to",
				                value: gw_com_api.getDate(""),
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    remark: {
				                        title: "~"
				                    }
				                }
				            },
				            {
				                name: "cust_cd",
				                label: {
				                    title: "고객사 :"
				                },
				                editable: {
				                    type: "select",
				                    size: 1,
				                    data: {
				                        memory: "AS내역_고객사"
				                    },
				                    remark: {
				                        title: "고객사"
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
				                    size: 1,
				                    data: {
				                        memory: "AS내역_LINE"
				                    },
				                    remark: {
				                        title: "LINE :"
				                    }
				                }
				            },
				            {
				                name: "prod_group",
				                label: {
				                    title: "제품군 :"
				                },
				                editable: {
				                    type: "select",
				                    size: 1,
				                    data: {
				                        memory: "AS내역_제품군"
				                    },
				                    remark: {
				                        title: "제품군 :"
				                    }
				                }
				            },
				            {
				                name: "실행",
				                value: "실행",
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
            targetid: "grdData_발생정보",
            query: "w_ehm2010_M_1",
            title: "AS발생정보",
            caption: "[ 발생정보 ]",
            height: "120",
            show: true,
            remarkable: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "issue_no",
                validate: true
            },
            element: [
				{
				    header: "관리번호",
				    name: "issue_no",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "관리번호"
				        }
				    }
				},
				{
				    header: "발생일자",
				    name: "issue_dt",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "발생일자"
				        }
				    }
				},
				{
				    header: "발생구분",
				    name: "issue_tp",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "발생구분"
				        }
				    }
				},
				{
				    header: "고객사",
				    name: "cust_cd",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "고객사"
				        }
				    }
				},
				{
				    header: "LINE",
				    name: "cust_dept",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "LINE"
				        }
				    }
				},
				{
				    header: "제품",
				    name: "prod_key",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "제품"
				        }
				    }
				},
				{
				    header: "Warranty",
				    name: "wrnt_io",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "Warranty"
				        }
				    }
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "상태"
				        }
				    }
				},
				{
				    header: "상태변경일",
				    name: "pdate",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "상태변경일"
				        }
				    }
				},
				{
				    header: "발생비고",
				    name: "rmk",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "발생비고"
				        }
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록자"
				        }
				    }
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록일시"
				        }
				    }
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정자"
				        }
				    }
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정일시"
				        }
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
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
				    name: "삭제",
				    value: "삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_발생내역",
            query: "w_ehm2010_S_1",
            title: "발생내역",
            caption: "[ 발생내역 ]",
            height: "100%",
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                //focus: "issue_no",
                validate: true
            },
            element: [
				{
				    header: "순번",
				    name: "issue_no",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "순번"
				        }
				    }
				},
				{
				    header: "현상분류",
				    name: "issue_dt",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "현상분류"
				        }
				    }
				},
				{
				    header: "발생현상구분",
				    name: "issue_tp",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "발생현상구분"
				        }
				    }
				},
				{
				    header: "부위분류",
				    name: "cust_cd",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "부위분류"
				        }
				    }
				},
				{
				    header: "발생부위구분",
				    name: "cust_dept",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "발생부위구분"
				        }
				    }
				},
				{
				    header: "원인분류",
				    name: "prod_key",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "원인분류"
				        }
				    }
				},
				{
				    header: "발생원인구분",
				    name: "wrnt_io",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "발생원인구분"
				        }
				    }
				},
				{
				    header: "귀책사유분류",
				    name: "pstat",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "귀책사유분류"
				        }
				    }
				},
				{
				    header: "귀책사유구분",
				    name: "pdate",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "귀책사유구분"
				        }
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록자"
				        }
				    }
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록일시"
				        }
				    }
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정자"
				        }
				    }
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정일시"
				        }
				    }
				},
                {
                    name: "issue_no",
                    value: "",
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
            targetid: "frmData_발생현상상세",
            query: "w_ehm2010_S_2",
            type: "TABLE",
            title: "발생현상-상세",
            //caption: "[발생현상-상세]",
            width: "100%",
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "rmk_text",
                validate: true
            },
            content: {
                height: "25px",
                row: [
                    {
                        width: {
                            label: "110px",
                            filed: "300px"
                        },
                        element: [
                            {
                                header: true,
                                value: "발생현상",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rmk_text",
                                format: {
                                    type: "textarea",
                                    rows: 4,
                                    cols: 150
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    cols: 150
                                }
                            },
                            {
                                name: "issue_no",
                                value: "",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "rmk_cd",
                                value: "",
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
            targetid: "grdData_조치내역",
            query: "w_ehm2010_S_3",
            title: "조치내역",
            caption: "[ 조치내역 ]",
            height: "100%",
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                //focus: "issue_no",
                validate: true
            },
            element: [
				{
				    header: "순번",
				    name: "work_seq",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "순번"
				        }
				    }
				},
				{
				    header: "조치일자",
				    name: "work_dt",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "조치일자"
				        }
				    }
				},
				{
				    header: "조치분류",
				    name: "work_tp1",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "조치분류"
				        }
				    }
				},
				{
				    header: "조치구분",
				    name: "work_tp2",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "조치구분"
				        }
				    }
				},
				{
				    header: "작업시간",
				    name: "work_time",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "작업시간"
				        }
				    }
				},
				{
				    header: "작업자1",
				    name: "work_man1",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "작업자1"
				        }
				    }
				},
				{
				    header: "작업자2",
				    name: "work_man2",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "작업자2"
				        }
				    }
				},
				{
				    header: "작업자3",
				    name: "work_man3",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "작업자3"
				        }
				    }
				},
				{
				    header: "작업자4",
				    name: "work_man4",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "작업자4"
				        }
				    }
				},
				{
				    header: "작업자5",
				    name: "work_man5",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "작업자5"
				        }
				    }
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "상태"
				        }
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록자"
				        }
				    }
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록일시"
				        }
				    }
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정자"
				        }
				    }
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정일시"
				        }
				    }
				},
                {
                    name: "issue_no",
                    value: "",
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
            targetid: "frmData_조치내역상세",
            query: "w_ehm2010_S_4",
            type: "TABLE",
            title: "조치내역-상세",
            //caption: "[ 조치내역-상세 ]",
            width: "100%",
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "rmk_text",
                validate: true
            },
            content: {
                height: "25px",
                row: [
                    {
                        width: {
                            label: "110px",
                            filed: "300px"
                        },
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
                                    rows: 4,
                                    cols: 150
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    cols: 150
                                }
                            },
                            {
                                name: "issue_no",
                                value: "",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "rmk_cd",
                                value: "",
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
            targetid: "lyrMenu_4",
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
            targetid: "grdData_교체PART",
            query: "w_ehm2010_S_5",
            title: "교체 PART",
            caption: "[교체 PART]",
            height: "100%",
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                //focus: "issue_no",
                validate: true
            },
            element: [
				{
				    header: "순번",
				    name: "part_seq",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "순번"
				        }
				    }
				},
				{
				    header: "교체구분",
				    name: "change_tp",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "교체구분"
				        }
				    }
				},
				{
				    header: "교체일자",
				    name: "change_dt",
				    width: 150,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "교체일자"
				        }
				    }
				},
				{
				    header: "수급시간",
				    name: "change_time",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수급시간"
				        }
				    }
				},
				{
				    header: "수량",
				    name: "change_qty",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    }
				},
				{
				    header: "원인부품",
				    name: "apart_cd",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "원인부품"
				        }
				    }
				},
				{
				    header: "원인부품명",
				    name: "apart_nm",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "원인부품명"
				        }
				    }
				},
				{
				    header: "원인부품SNO",
				    name: "apart_sno",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "원인부품SNO"
				        }
				    }
				},
				{
				    header: "교체부품",
				    name: "bpart_cd",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "교체부품"
				        }
				    }
				},
				{
				    header: "교체부품명",
				    name: "bpart_nm",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "교체부품명"
				        }
				    }
				},
				{
				    header: "교체부품SNO",
				    name: "bpart_sno",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "교체부품SNO"
				        }
				    }
				},
				{
				    header: "유상(CS)",
				    name: "charge_cs",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "유상(CS)"
				        }
				    }
				},
				{
				    header: "유상(영업)",
				    name: "charge_yn",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "유상(영업)"
				        }
				    }
				},
				{
				    header: "상태",
				    name: "pstat",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "상태"
				        }
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록자"
				        }
				    }
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "등록일시"
				        }
				    }
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정자"
				        }
				    }
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수정일시"
				        }
				    }
				},
                {
                    name: "issue_no",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "apart_key",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "bpart_key",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "apart_bom",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "bpart_bom",
                    value: "",
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
            targetid: "frmData_교체내역상세",
            query: "w_ehm2010_S_6",
            type: "TABLE",
            title: "교체내역-상세",
            //caption: "[ 교체내역-상세 ]",
            width: "100%",
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "rmk_text",
                validate: true
            },
            content: {
                height: "25px",
                row: [
                    {
                        width: {
                            label: "110px",
                            filed: "300px"
                        },
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
                                    rows: 2,
                                    cols: 150
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 2,
                                    cols: 150
                                }
                            },
                            {
                                name: "issue_no",
                                value: "",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "rmk_cd",
                                value: "",
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
            targetid: "lyrMenu_5",
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
            targetid: "grdData_첨부파일",
            query: "w_ehm2010_S_7",
            title: "첨부파일",
            caption: "[ 첨부파일 ]",
            height: "100%",
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                //focus: "issue_no",
                validate: true
            },
            element: [
				{
				    header: "파일명",
				    name: "file_nm",
				    width: 200,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "파일명"
				        }
				    }
				},
				{
				    header: "파일설명",
				    name: "file_desc",
				    width: 600,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "파일설명"
				        }
				    }
				},
                {
                    name: "file_ext",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "file_path",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "file_id",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "network_cd",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "data_tp",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "data_key",
                    value: "",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "data_seq",
                    value: "",
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
        /*
        var args = {
            targetid: "frmData_상세메모",
            query: "w_ehm2010_S_8",
            type: "CONTROL",
            title: "상세메모",
            caption: "[ 상세메모 ]",
            width: "100%",
            show: true,
            selectable: true
        };
        //----------
        gw_com_module.formCreate(args);
        */
        var args = {
            targetid: "frmData_상세메모",
            query: "w_ehm2010_S_8",
            type: "TABLE",
            title: "상세메모",
            caption: "[ 상세메모 ]",
            width: "100%",
            scroll: false,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "memo_text",
                validate: true
            },
            content: {
                row: [
                    {
                        control: true,
                        element: [
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                },
            				    control: {
            				        by: "DX",
            				        type: "htmleditor",
            				        id: ctrl_memo
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
            target: [
                /*
				{
				    type: "GRID",
				    id: "grdData_발생정보",
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
				    type: "GRID",
				    id: "grdData_첨부파일",
				    offset: 8
				},
				*/
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
    procedure: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        
        //----------
        gw_com_module.startPage();

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
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
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
            targetid: "lyrMenu_4",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_4_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_4",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_4_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_5",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_5_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_5",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_5_삭제
        };
        gw_com_module.eventBind(args);
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회() {

            var args = {
                target: [
					{
					    id: "frmOption"
					}
				]
            };
            gw_com_module.objToggle(args);


        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            if (!checkUpdatable())
                return false;

            var args = {
                targetid: "grdData_발생정보",
                select: true,
                edit: true
            };
            gw_com_module.gridInsert(args);
        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkUpdatable())
                return false;
                
        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave();

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            if (!checkUpdatable())
                return false;

            var args = {
                ID: gw_com_api.v_Stream.msg_closePage
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve();

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            var args = {
                targetid: "grdData_발생내역",
                select: true,
                edit: true
            };
            gw_com_module.gridInsert(args);
            var args = {
                targetid: "frmData_발생현상상세"
            };
            gw_com_module.formInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            var args = {
                targetid: "grdData_발생내역",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            var args = {
                targetid: "grdData_조치내역",
                select: true,
                edit: true
            };
            gw_com_module.gridInsert(args);
            var args = {
                targetid: "frmData_조치내역상세"
            };
            gw_com_module.formInsert(args);

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            var args = {
                targetid: "grdData_조치내역",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_4_추가(ui) {

            var args = {
                targetid: "grdData_교체PART",
                select: true,
                edit: true
            };
            gw_com_module.gridInsert(args);
            var args = {
                targetid: "frmData_교체내역상세"
            };
            gw_com_module.formInsert(args);

        }
        //----------
        function click_lyrMenu_4_삭제(ui) {

            var args = {
                targetid: "grdData_교체PART",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_5_추가(ui) {

            var args = {
                targetid: "grdData_첨부파일",
                select: true,
                edit: true
            };
            gw_com_module.gridInsert(args);
        }
        //----------
        function click_lyrMenu_5_삭제(ui) {

            var args = {
                targetid: "grdData_첨부파일",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
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
        function rowselecting_grdData_발생정보(ui) {

            return checkUpdatable();

        }
        //----------
        function rowselected_grdData_발생정보(ui) {

            processLink();

        };

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

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false)
        return false;

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            toggle: true,
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
				    name: "prod_group",
				    argument: "arg_prod_group"
				}
			]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_발생정보"
			}
		],
		clear: [
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
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_상세메모"
			}
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink() {

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
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_상세메모"
			}
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function checkUpdatable() {

    var args = {
        target: [
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
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_상세메모"
			}
		]
    };
    var updatable = gw_com_module.objUpdatable(args);
    if (updatable == "SAVE") {
        processSave();
        return false;
    }
    else
        return (updatable == "SKIP") ? true : false;

}
//----------
function processSave() {

    var args = {
        target: [
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
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_상세메모"
			}
		]
    };
    //if (gw_com_module.objValidate(args) == false) {
    //    return false;
    //}

    var args = {
        target: [
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
			    type: "GRID",
			    id: "grdData_첨부파일"
			},
			{
			    type: "FORM",
			    id: "frmData_상세메모"
			}
		],
        handler_success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response) {

    //if (v_global.process.entry == "추가") {
    //    processRetrieve();
    //}
    //else {
        processLink();
    //}

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//