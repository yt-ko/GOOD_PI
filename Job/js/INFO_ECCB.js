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
				                name: "eccb_no",
				                label: {
				                    title: "심의번호 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 10,
				                    maxlength: 20
				                }
				            },
                            {
                                name: "item_seq",
                                hidden: true
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
            targetid: "frmData_정보",
            query: "w_eccb2010_M_1",
            type: "TABLE",
            title: "회의 정보",
            //caption: true,
            show: true,
            selectable: true,
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
                                name: "eccb_no"
                            },
                            {
                                header: true,
                                value: "주관부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mng_dept"
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
                                mask: "time-hm"
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
                                name: "meet_place"
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
                                mask: "date-ymd"
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
                                mask: "time-hm"
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
                            },
                            {
                                name: "gw_adate"
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
            query: "w_eccb2010_S_1_2",
            title: "협의 안건",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
                {
                    header: "구분",
                    name: "root_type",
                    width: 50,
                    align: "center"
                },
				{
				    header: "등록번호",
				    name: "root_no",
				    width: 100,
				    align: "center"
				},
				{
				    header: "개선제안명",
				    name: "root_title",
				    width: 350,
				    align: "left"
				},
				{
				    header: "제안자",
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
				    header: "심의결과",
				    name: "result_nm",
				    width: 60,
				    align: "center"
				},
				{
				    name: "ecr_no",
				    hidden: true
				},
				{
				    name: "cip_no",
				    hidden: true
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
                                value: "등록번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "root_no"
                            },
                            {
                                header: true,
                                value: "실행부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_dept1_nm"
                            },
                            {
                                header: true,
                                value: "담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp1_nm"
                            }
                        ]
                    },
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
                                name: "result_cd"
                            },
                            {
                                header: true,
                                value: "실행부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_dept2_nm"
                            },
                            {
                                header: true,
                                value: "담당자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp2_nm"
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
                                style: {
                                    colspan: 5
                                },
                                name: "priority_cd",
                                format: {
                                    width: 600
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
                                }
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
                                }
                            },
                            {
                                name: "eccb_no",
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
            targetid: "grdData_참석자",
            query: "w_eccb2010_S_3",
            title: "참석자",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "부서",
				    name: "attend_dept1_nm",
				    width: 120,
				    align: "center"
				},
				{
				    header: "성명",
				    name: "attend_emp1_nm",
				    width: 100,
				    align: "center"
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
                    }
                },
                {
                    header: "부서",
                    name: "attend_dept2_nm",
                    width: 120,
                    align: "center"
                },
				{
				    header: "성명",
				    name: "attend_emp2_nm",
				    width: 100,
				    align: "center",
				    width: 100,
				    align: "center"
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
                    }
                },
                {
                    header: "부서",
                    name: "attend_dept3_nm",
                    width: 120,
                    align: "center"
                },
				{
				    header: "성명",
				    name: "attend_emp3_nm",
				    width: 100,
				    align: "center",
				    width: 100,
				    align: "center"
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
                    }
                },
				{
				    name: "attend_seq",
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
            targetid: "grdData_첨부",
            query: "w_eccb2010_S_4",
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
        function rowselected_grdData_안건(ui) {

            processLink({});

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
				    name: "eccb_no",
				    argument: "arg_eccb_no"
				},
                {
                    name: "item_seq",
                    argument: "arg_item_seq"
                }
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
        source: {
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
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_내용"
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
        case gw_com_api.v_Stream.msg_infoECCB:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.eccb_no
                        != gw_com_api.getValue("frmOption", 1, "eccb_no")) {
                        gw_com_api.setValue("frmOption", 1, "eccb_no", param.data.eccb_no);
                        retrieve = true;
                    }
                    if (param.data.item_seq
                        != gw_com_api.getValue("frmOption", 1, "item_seq")) {
                        gw_com_api.setValue("frmOption", 1, "item_seq", param.data.item_seq);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "eccb_no");
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