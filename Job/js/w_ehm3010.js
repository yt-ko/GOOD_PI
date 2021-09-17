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
				    type: "PAGE", name: "Part구분", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM26" }
                    ]
				},
                {
                    type: "PAGE", name: "현상분류", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "IEHM21" }
                    ]
                },
				{
				    type: "PAGE", name: "발생현상구분", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM31" }
                    ]
				},
				{
				    type: "PAGE", name: "원인부위분류", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM22" }
                    ]
				},
                {
                    type: "PAGE", name: "발생부위구분", query: "dddw_zcoded",
                    param: [
                        { argument: "arg_hcode", value: "IEHM32" }
                    ]
                },
				{
				    type: "PAGE", name: "원인분류", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM23" }
                    ]
				},
				{
				    type: "PAGE", name: "발생원인구분", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM33" }
                    ]
				},
				{
				    type: "PAGE", name: "조치분류", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM24" }
                    ]
				},
				{
				    type: "PAGE", name: "조치구분", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM34" }
                    ]
				},
				{
				    type: "PAGE", name: "발생Module", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM05" }
                    ]
				},
				{
				    type: "PAGE", name: "상태", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM13" }
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
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            border: true,
            show: true,
            editable: {
                focus: "year",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "year",
                                value: gw_com_api.getYear(),
                                label: {
                                    title: "작업년도 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 3,
                                    maxlength: 4,
                                    validate: {
                                        rule: "required",
                                        message: "작업년도"
                                    }
                                }
                            },
				            {
				                name: "cust",
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
            targetid: "grdData_현황",
            query: "w_ehm3010_M_1",
            title: "개선 작업 현황",
            //caption: true,
            height: 77,
            dynamic: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "관리번호",
				    name: "modify_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "시작일자",
				    name: "str_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "종료일자",
				    name: "end_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "Part구분",
				    name: "part_group",
				    width: 80,
				    align: "center"
				},
				{
				    header: "Part명",
				    name: "apart_nm",
				    width: 250,
				    align: "center"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_현황",
            query: "w_ehm3010_M_2",
            type: "TABLE",
            title: "개선 작업 내역",
            //caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "cust_cd",
                validate: true
            },
            content: {
                width: {
                    label: 80,
                    field: 220
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
                                name: "modify_no",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "고객사",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "cust_cd",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "고객사"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "Part 구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_group",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "Part구분"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "원인Part",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "apart_cd",
                                mask: "search",
                                editable: {
                                    type: "text",
                                    readonly: false
                                }
                            },
                            {
                                header: true,
                                value: "원인Part명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "apart_nm",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "시작일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "str_date",
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
                                value: "교체Part",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "bpart_cd",
                                mask: "search",
                                editable: {
                                    type: "text",
                                    readonly: false
                                }
                            },
                            {
                                header: true,
                                value: "교체Part명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "bpart_nm",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "종료일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "end_date",
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
                                value: "발생분류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "status_tp1",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "현상분류"
                                    },
                                    change: [
						                {
						                    name: "status_tp2",
						                    memory: "발생현상구분",
						                    key: [
								                "status_tp1"
							                ]
						                }
					                ]
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
                                name: "status_tp2",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "발생현상구분",
                                        key: [
								            "status_tp1"
							            ]
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "등록자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_usr"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "원인부위분류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_tp1",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "원인부위분류"
                                    },
                                    change: [
						                {
						                    name: "part_tp2",
						                    memory: "발생부위구분",
						                    key: [
								                "part_tp1"
							                ]
						                }
					                ]
                                }
                            },
                            {
                                header: true,
                                value: "원인부위구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_tp2",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "발생부위구분",
                                        key: [
								            "part_tp1"
							            ]
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "등록일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ins_dt"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "원인분류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "reason_tp1",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "원인분류"
                                    },
                                    change: [
						                {
						                    name: "reason_tp2",
						                    memory: "발생원인구분",
						                    key: [
								                "reason_tp1"
							                ]
						                }
					                ]
                                }
                            },
                            {
                                header: true,
                                value: "원인구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "reason_tp2",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "발생원인구분",
                                        key: [
								            "reason_tp1"
							            ]
                                    }
                                }
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
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "조치분류",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "work_tp1",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "조치분류"
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
                                header: true,
                                value: "조치구분",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "work_tp2",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "조치구분",
                                        key: [
								            "work_tp1"
							            ]
                                    }
                                }
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
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "ECO No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "eco_key",
                                mask: "search",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "ECO 제목",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3
                                },
                                name: "eco_title",
                                format: {
                                    width: 500
                                }
                            },
                            {
                                name: "eco_no",
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
                                value: "작업내역",
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
                                    rows: 4,
                                    width: 734
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 734
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
            targetid: "grdData_내역",
            query: "w_ehm3010_S_1",
            title: "작업 상세 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "cust_dept",
                validate: true
            },
            element: [
                {
                    header: "No.",
                    name: "modify_seq",
                    width: 35,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
				{
				    header: "고객사Line",
				    name: "cust_dept",
				    width: 110,
				    align: "center",
				    mask: "search",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "설비명",
				    name: "cust_prod_nm",
				    width: 150,
				    align: "center",
				    display: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "발생Module",
				    name: "prod_sub",
				    width: 100,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "발생Module"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "발생Module"
				        }
				    }
				},
				{
				    header: "작업일자",
				    name: "work_dt",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "작업상태",
				    name: "pstat",
				    width: 80,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "상태"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "상태"
				        }
				    }
				},
				{
				    header: "OUT Ser. No(기장착부품)",
				    name: "apart_sno",
				    width: 190,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "IN Ser. No(교체부품)",
				    name: "bpart_sno",
				    width: 190,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "교체내역",
				    name: "rmk",
				    width: 600,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    name: "cust_proc",
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
				    name: "work_man1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "work_man2",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "work_man3",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
                {
                    name: "modify_no",
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
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_현황",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_내역",
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
            targetid: "grdData_현황",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_현황",
            event: "itemdblclick",
            handler: itemdblclick_frmData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_현황",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_내역",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_내역",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_내역
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

            closeOption({});
            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_내역",
                edit: true,
                data: [
                    { name: "modify_seq", rule: "INCREMENT", value: 1 }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_내역",
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
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemdblclick_frmData_현황(ui) {

            switch (ui.element) {
                case "apart_cd":
                case "bpart_cd":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_part_ehm",
                            title: "부품 검색",
                            width: 800,
                            height: 500,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_part_ehm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectPart_EHM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "eco_key":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_eco",
                            title: "ECO 선택",
                            width: 850,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_eco",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectECO,
                                    data: {
                                        type: "close"
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }
        //----------
        function itemdblclick_grdData_내역(ui) {

            switch (ui.element) {
                case "cust_dept":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_prod_ehm",
                            title: "장비 검색",
                            width: 800,
                            height: 460,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_prod_ehm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProduct_EHM
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

    return gw_com_api.getCRUD("frmData_현황");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
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
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
			{
			    type: "GRID",
			    id: "grdData_내역"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

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

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "w_ehm3010_M_2")
                this.QUERY = "w_ehm3010_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "year",
				    argument: "arg_year"
				},
				{
				    name: "cust",
				    argument: "arg_cust"
				}
			],
            remark: [
		        {
		            element: [{ name: "year"}]
		        },
		        {
		            element: [{ name: "cust"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true
			}
		],
        clear: [
		    {
		        type: "FORM",
		        id: "frmData_현황"
		    },
		    {
		        type: "GRID",
		        id: "grdData_내역"
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
            id: "grdData_현황",
            row: "selected",
            block: true,
            element: [
				{
				    name: "modify_no",
				    argument: "arg_modify_no"
				}
			]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
            {
                type: "GRID",
                id: "grdData_내역"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_현황", "reset");
    var args = {
        targetid: "frmData_현황",
        edit: true,
        updatable: true,
        /*
        data: [
        { name: "issud_dt", value: gw_com_api.getDate() }
        ],
        */
        clear: [
		    {
		        type: "GRID",
		        id: "grdData_내역"
		    }
	    ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_현황",
        row: "selected",
        clear: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
            {
                type: "GRID",
                id: "grdData_내역"
            }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
			{
			    type: "GRID",
			    id: "grdData_내역"
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
		        type: "GRID",
		        id: "grdData_현황",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "modify_no" }
		                ]
		            }
		        ]
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_현황"
            },
            {
                type: "GRID",
                id: "grdData_내역"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
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

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

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
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_EHM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_dept",
			                        param.data.cust_dept,
			                        (v_global.event.type == "GRID") ? true : false,
			                        true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_proc",
			                        param.data.cust_proc,
			                        (v_global.event.type == "GRID") ? true : false,
			                        true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_prod_nm",
			                        param.data.cust_prod_nm,
			                        (v_global.event.type == "GRID") ? true : false,
			                        true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "prod_key",
			                        param.data.prod_key,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_EHM:
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
			                            (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedECO:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "eco_no",
			                        param.data.eco_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "eco_key",
			                        param.data.eco_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "eco_title",
			                        param.data.eco_title,
			                        (v_global.event.type == "GRID") ? true : false,
                                    true);
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
                    case "w_find_prod_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_EHM;
                        }
                        break;
                    case "w_find_part_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_EHM;
                        }
                        break;
                    case "w_find_eco":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectECO;
                            args.data = {
                                type: "close"
                            }
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