
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "심의결과", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB30" }
                    ]
                },
                {
                    type: "PAGE", name: "우선순위", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ECCB22" }
                    ]
                },
                {
                    type: "PAGE", name: "부서", query: "dddw_dept"
                },
                {
                    type: "PAGE", name: "사원", query: "dddw_emp"
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
                    name: "상신",
                    value: "결재상신",
                    icon: "기타"
                },
                {
                    name: "회수",
                    value: "상신취소",
                    icon: "기타"
                },
				{
				    name: "추가",
				    value: "추가"/*,
                    act: true*/
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
                    name: "상세",
                    value: "상세정보",
                    icon: "기타"
                },
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
            targetid: "lyrMenu_3",
            type: "FREE",
            element: [
                {
                    name: "예정",
                    value: "예정통보",
                    icon: "실행"
                },
                {
                    name: "결과",
                    value: "결과통보",
                    icon: "실행"
                },
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
            targetid: "frmData_정보",
            query: "w_eccb2010_M_1",
            type: "TABLE",
            title: "회의 정보",
            //caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "mng_dept",
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
                                value: "심의번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "eccb_no",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "주관부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mng_dept",
                                editable: {
                                    type: "text"/*,
                                    type: "select",
                                    data: {
                                        memory: "부서"
                                    }*/
                                }
                            },
                            {
                                header: true,
                                value: "시작시각",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "str_time",
                                mask: "time-hm",
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
                                value: "회의장소",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "meet_place",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "회의일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "meet_dt",
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "종료시각",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "end_time",
                                mask: "time-hm",
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
                                value: "제목",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "meet_title",
                                format: {
                                    width: 800
                                },
                                editable: {
                                    type: "text",
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
            targetid: "grdData_안건",
            query: "w_eccb2010_S_1",
            title: "협의 안건",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            editable: {
                //multi: true,
                bind: "select",
                validate: true
            },
            element: [
				{
				    header: "등록번호",
				    name: "root_no",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "개선제안명",
				    name: "root_title",
				    width: 350,
				    align: "left"
				},
				{
				    header: "CIP시행",
				    name: "cip_yn",
				    width: 50,
				    align: "center"
				},
				{
				    header: "작성자",
				    name: "root_emp",
				    width: 70,
				    align: "center"
				},
				{
				    header: "작성일자",
				    name: "root_dt",
				    width: 70,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "진행상태",
				    name: "pstat",
				    width: 80,
				    align: "center"
				},
				{
				    name: "item_seq",
				    hidden: true
				},
				{
				    name: "eccb_no",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내용",
            query: "w_eccb2010_S_2",
            type: "TABLE",
            title: "협의 안건",
            //caption: true,
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
                                name: "act_dept1",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "부서"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp1",
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
                                value: "우선순위",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "priority_cd",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "우선순위"
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
                                name: "act_dept2",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "부서"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp2",
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
                                name: "root_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "frmData_비고",
            query: "w_eccb2010_M_2",
            type: "TABLE",
            title: "회의 비고",
            caption: true,
            width: "100%",
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                //focus: "meet_note",
                validate: true
            },
            content: {
                height: 25,
                width: {
                    label: 100,
                    field: 770
                },
                row: [
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
                                name: "meet_note",
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
            targetid: "grdData_참석자",
            query: "w_eccb2010_S_3",
            title: "참석자",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                validate: true
            },
            element: [
				{
				    header: "부서",
				    name: "attend_dept1",
				    width: 120,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "부서",
				            unshift: [
				                { title: "-", value: "" }
				            ]
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "부서",
				            unshift: [
				                { title: "-", value: "" }
				            ]
				        }
				    }
				},
				{
				    header: "성명",
				    name: "attend_emp1",
				    width: 100,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "사원",
				            unshift: [
				                { title: "-", value: "" }
				            ]
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "사원",
				            unshift: [
				                { title: "-", value: "" }
				            ]
				        }
				    }
				},
                {
                    header: "참석",
                    name: "attend_yn1",
                    width: 30,
                    align: "center",
                    format: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    },
                    editable: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    }
                },
                {
                    header: "부서",
                    name: "attend_dept2",
                    width: 120,
                    align: "center",
                    format: {
                        type: "select",
                        data: {
                            memory: "부서",
                            unshift: [
				                { title: "-", value: "" }
				            ]
                        }
                    },
                    editable: {
                        type: "select",
                        data: {
                            memory: "부서",
                            unshift: [
				                { title: "-", value: "" }
				            ]
                        }
                    }
                },
				{
				    header: "성명",
				    name: "attend_emp2",
				    width: 100,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "사원",
				            unshift: [
				                { title: "-", value: "" }
				            ]
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "사원",
				            unshift: [
				                { title: "-", value: "" }
				            ]
				        }
				    }
				},
                {
                    header: "참석",
                    name: "attend_yn2",
                    width: 30,
                    align: "center",
                    format: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    },
                    editable: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    }
                },
                {
                    header: "부서",
                    name: "attend_dept3",
                    width: 120,
                    align: "center",
                    format: {
                        type: "select",
                        data: {
                            memory: "부서",
                            unshift: [
				                { title: "-", value: "" }
				            ]
                        }
                    },
                    editable: {
                        type: "select",
                        data: {
                            memory: "부서",
                            unshift: [
				                { title: "-", value: "" }
				            ]
                        }
                    }
                },
				{
				    header: "성명",
				    name: "attend_emp3",
				    width: 100,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "사원",
				            unshift: [
				                { title: "-", value: "" }
				            ]
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "사원",
				            unshift: [
				                { title: "", value: "" }
				            ]
				        }
				    }
				},
                {
                    header: "참석",
                    name: "attend_yn3",
                    width: 30,
                    align: "center",
                    format: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    },
                    editable: {
                        type: "checkbox",
                        title: "",
                        value: "1",
                        offval: "0"
                    }
                },
				{
				    name: "attend_seq",
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
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부",
            query: "w_eccb2010_S_4",
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
				    id: "frmData_정보",
				    offset: 8
				},
                {
                    type: "GRID",
                    id: "grdData_안건",
                    offset: 8
                },
                {
                    type: "FORM",
                    id: "frmData_내용",
                    offset: 8
                },
                {
                    type: "FORM",
                    id: "frmData_비고",
                    offset: 8
                },
                {
                    type: "GRID",
                    id: "grdData_참석자",
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
            element: "상세",
            event: "click",
            handler: click_lyrMenu_2_상세
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
            targetid: "grdData_안건",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_안건
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_안건",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_안건
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
        function click_lyrMenu_2_상세(ui) {

            if (!checkManipulate({})) return;

            var args = {
                type: "PAGE",
                page: "w_find_ecrcip_detail",
                title: "ECR 상세 정보",
                width: 900,
                height: 500,
                scroll: true,
                locate: ["center", "top"],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_ecrcip_detail",
                    param: {
                        ID: gw_com_api.v_Stream.msg_infoECRCIP,
                        data: {
                            ecr_no: gw_com_api.getValue("grdData_안건", "selected", "root_no", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({ sub: true });

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({ sub: true });

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_참석자",
                edit: true,
                data: [
                    { name: "eccb_no", value: gw_com_api.getValue("frmData_정보", 1, "eccb_no") }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_참석자",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_4_추가(ui) {

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
                            key: gw_com_api.getValue("frmData_정보", 1, "eccb_no"),
                            seq: 0
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_4_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_첨부",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function rowselecting_grdData_안건(ui) {

            if (gw_com_api.getSelectedRow(ui.object) == ui.row)
                return false;

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_안건(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
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
        if (v_global.process.param != "") {
            processRetrieve({ key: gw_com_api.getPageParameter("eccb_no") });
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

    return (param.sub)
            ? gw_com_api.getCRUD("grdData_안건", "selected", true)
            : gw_com_api.getCRUD("frmData_정보");

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
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_정보",
                refer: (param.sub) ? true : false
            },
            {
                type: "FORM",
                id: "frmData_내용"
            },
            {
                type: "FORM",
                id: "frmData_비고",
                refer: (param.sub) ? true : false
            },
            {
                type: "GRID",
                id: "grdData_참석자",
                refer: (param.sub) ? true : false
            },
			{
			    type: "GRID",
			    id: "grdData_첨부",
			    refer: (param.sub) ? true : false
			}
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create") {
        (param.sub) ? processDelete(param) : processClear({});
    }
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_eccb_no", value: param.key },
            ]
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_정보"
			},
			{
			    type: "GRID",
			    id: "grdData_안건",
                select: true
			},
            {
                type: "FORM",
                id: "frmData_비고"
            },
            {
                type: "GRID",
                id: "grdData_참석자"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            }
		],
        clear: [
            {
			    type: "FORM",
			    id: "frmData_내용"
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
function processLink(param) {

    var args = {
        key: param.key
    };
    if (param.sub) {
        args.source = {
            type: "GRID",
            id: "grdData_안건",
            row: "selected",
            block: true,
            element: [
				{
				    name: "eccb_no",
				    argument: "arg_eccb_no"
				},
                {
                    name: "item_seq",
                    argument: "arg_item_seq"
                }
			]
        };
        args.target = [
			{
			    type: "FORM",
			    id: "frmData_내용"
			}
		];
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_안건", v_global.process.current.sub, true, false);

}
//----------
function processInsert(param) {

    if (param.sub) {
        var args = {
            type: "PAGE",
            page: "w_find_ecrcip",
            title: "심의대상 선택",
            width: 750,
            height: 450,
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_ecrcip",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectforECCB
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }
    else {
        var args = {
            targetid: "frmData_정보",
            edit: true,
            updatable: true,
            clear: [
                {
                    type: "GRID",
                    id: "grdData_안건"
                },
                {
                    type: "FORM",
                    id: "frmData_내용"
                },
                {
                    type: "FORM",
                    id: "frmData_비고"
                },
                {
                    type: "GRID",
                    id: "grdData_참석자"
                },
                {
                    type: "GRID",
                    id: "grdData_첨부"
                }
            ]
        };
        gw_com_module.formInsert(args);
        args = {
            targetid: "frmData_비고",
            edit: true
        };
        gw_com_module.formInsert(args);
        gw_com_api.setCRUD("frmData_비고", 1, "modify");
    }

}
//----------
function processDelete(param) {

    if (param.sub) {
        var args = {
            targetid: "grdData_안건",
            row: "selected",
            remove: true,
            clear: [
                {
                    type: "FORM",
                    id: "frmData_내용"
                }
            ]
        };
        gw_com_module.gridDelete(args);
    }
    else {
        var args = {
            target: [
                {
                    type: "FORM",
                    id: "frmData_정보"
                },
                {
                    type: "GRID",
                    id: "grdData_안건"
                },
                {
                    type: "FORM",
                    id: "frmData_내용"
                },
                {
                    type: "FORM",
                    id: "frmData_비고"
                },
                {
                    type: "GRID",
                    id: "grdData_참석자"
                },
                {
                    type: "GRID",
                    id: "grdData_첨부"
                }
            ]
        };
        gw_com_module.objClear(args);
    }

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_정보"
			},
            {
                type: "FORM",
                id: "frmData_내용"
            },
            {
                type: "FORM",
                id: "frmData_비고"
            },
            {
                type: "GRID",
                id: "grdData_참석자"
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
        handler: {
            success: successRemove,
            param: param
        }
    };
    if (param.sub) {
        args.target = [
		    {
		        type: "GRID",
		        id: "grdData_안건",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "eccb_no" },
                            { name: "item_seq" }
		                ]
		            }
		        ]
		    }
	    ];
    }
    else {
        args.target = [
		    {
		        type: "FORM",
		        id: "frmData_정보",
		        key: {
		            element: [
		                { name: "eccb_no" }
		            ]
		        }
		    }
	    ];
    };
    gw_com_module.objRemove(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_안건",
        row: v_global.process.prev.sub
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_정보"
            },
            {
                type: "GRID",
                id: "grdData_안건"
            },
            {
                type: "FORM",
                id: "frmData_내용"
            },
            {
                type: "FORM",
                id: "frmData_비고"
            },
            {
                type: "GRID",
                id: "grdData_참석자"
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
        $.each(this.KEY, function () {
            if (this.NAME == "eccb_no")
                processRetrieve({ key: this.VALUE });
        });
    });

}
//----------
function successRemove(response, param) {

    processDelete(param);

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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedforECCB:
            {
                var args = {
                    targetid: "grdData_안건",
                    edit: true,
                    updatable: true,
                    data: [
                        { name: "root_div", value: param.data.root_div },
                        { name: "root_no", value: param.data.root_no },
                        { name: "root_title", value: param.data.root_title },
                        { name: "root_dt", value: param.data.root_dt },
                        { name: "root_emp", value: param.data.root_emp },
                        { name: "cip_yn", value: param.data.cip_yn },
                        { name: "pstat", value: param.data.pstat }
                    ]
                };
                var row = gw_com_module.gridInsert(args);
                gw_com_api.selectRow("grdData_안건", row, false, false);
                args = {
                    targetid: "frmData_내용",
                    edit: true,
                    updatable: true,
                    data: [
                        { name: "eccb_no", value: gw_com_api.getValue("frmData_정보", 1, "eccb_no") },
                        { name: "root_div", value: param.data.root_div },
                        { name: "root_no", value: param.data.root_no }
                    ]
                };
                gw_com_module.formInsert(args);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "FORM",
                        id: "frmData_정보",
                        element: [
				            {
				                name: "eccb_no",
				                argument: "arg_eccb_no"
				            }
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_ecrcip":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectforECCB;
                        }
                        break;
                    case "w_find_ecrcip_detail":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECRCIP;
                            args.data = {
                                ecr_no: gw_com_api.getValue("grdData_안건", "selected", "root_no", true)
                            };
                        }
                        break;
                    case "w_upload_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_정보", 1, "eccb_no"),
                                seq: 0
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