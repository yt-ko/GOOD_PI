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
				    type: "PAGE", name: "제품유형", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "ISCM25" }
                    ]
				},
                {
                    type: "INLINE", name: "발생",
                    data: [
						{ title: "A/S", value: "AS" },
						{ title: "제조", value: "POP" },
						{ title: "품질", value: "QDM" }
					]
                },
                {
                    type: "INLINE", name: "교체",
                    data: [
						{ title: "미교체", value: "0" },
						{ title: "교체", value: "1" }
					]
                },
                {
                    type: "INLINE", name: "확인",
                    data: [
						{ title: "미확인", value: "0" },
						{ title: "확인", value: "1" },
						{ title: "반려", value: "2" }
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
                {
                    name: "처리",
                    value: "처리결과 등록",
                    icon: "추가"
                },
                {
                    name: "조회",
                    value: "조회",
                    act: true
                },
                {
                    name: "저장",
                    value: "저장",
                    icon: "추가"
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
                                name: "proj_no",
                                label: {
                                    title: "Project No :"
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
				                    }/*,
				                    change: [
					                    {
					                        name: "cust_dept",
					                        memory: "LINE",
					                        key: [
							                    "cust_cd"
						                    ]
					                    }
				                    ]*/
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
				                        ]/*,
				                        key: [
							                "cust_cd"
						                ]*/
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
				                    size: 18,
				                    maxlength: 30
				                }
				            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "issue_tp",
				                label: {
				                    title: "분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "발생",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "change_qty",
				                label: {
				                    title: "PART 교체 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "교체",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "qstat",
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
				            },
				            {
				                name: "mstat",
				                label: {
				                    title: "팀장확인 :"
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
            query: "w_qcm2034_M_1",
            title: "문제 발생 보고 내역",
            height: 442,
            show: true,
            selectable: true,
            dynamic: true,
            editable: {
                multi: true,
                bind: "edit_yn",
                focus: "qstat",
                validate: true
            },
            element: [
                {
                    name: "edit_yn",
                    hidden: true
                },
				{
				    header: "품질확인",
				    name: "qstat",
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
                    header: "확인메모/반려사유",
                    name: "qnote",
                    width: 200,
                    align: "left",
                    editable: {
                        type: "text"
                    }
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
				    width: 150,
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
				    width: 200,
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
				    header: "상태",
				    name: "pstat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "상태변경일시",
				    name: "pdate",
				    width: 160,
				    align: "center",
				    mask: "date-ymd"
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
				    width: 250,
				    align: "left"
				},
				{
				    header: "부품건수",
				    name: "part_cnt",
				    width: 60,
				    align: "center"
				},
				{
				    header: "부품수량",
				    name: "part_sum",
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
				    header: "처리완료",
				    name: "complete_yn",
				    width: 60,
				    align: "center"
				},
				{
				    header: "품질팀장확인",
				    name: "mstat",
				    width: 80,
				    align: "center"
				}/*,
				{
				    header: "확인메모/반려사유",
				    name: "mnote",
				    width: 200,
				    align: "left"
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
				    name: "rcode",
				    hidden: true
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
            element: "처리",
            event: "click",
            handler: click_lyrMenu_처리
        };
        gw_com_module.eventBind(args);
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
            element: "저장",
            event: "click",
            handler: click_lyrMenu_저장
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
            event: "itemchanged",
            handler: itemchanged_grdData_현황
        };
        //gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_처리(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "w_qcm2030",
                    title: "문제발생처리 등록",
                    param: [
                        { name: "issue_tp", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                        { name: "issue_no", value: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_조회() {

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
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

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
        function itemchanged_grdData_현황(ui) {

            switch (ui.element) {
                case "qstat":
                    {
                        gw_com_api.setValue(ui.object,
                                            ui.row,
                                            "qemp_nm",
                                            (ui.value.current == "0") ? " " : gw_com_module.v_Session.USR_NM,
                                            true);
                    }
                    break;
            }

        };
        //----------
        function rowdblclick_grdData_현황(ui) {

            var type = gw_com_api.getValue("grdData_현황", "selected", "rcode", true);
            switch (type) {
                case "AS":
                    {
                        var args = {
                            type: "PAGE",
                            page: "w_find_as",
                            title: "문제 상세 정보",
                            width: 900,
                            height: 500,
                            scroll: true,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_as",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_infoAS,
                                    data: {
                                        issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "PM":
                    {
                        var args = {
                            type: "PAGE",
                            page: "w_find_faulty",
                            title: "문제 상세 정보",
                            width: 900,
                            height: 500,
                            scroll: true,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_faulty",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_infoFaulty,
                                    data: {
                                        issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
                                    }
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
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

    return gw_com_api.getCRUD("grdData_현황", "selected", true);

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
        target: [
            {
                type: "GRID",
                id: "grdData_현황"
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
    if (gw_com_module.objValidate(args) == false) return false;

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
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "proj_no",
				    argument: "arg_proj_no"
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
				    name: "issue_tp",
				    argument: "arg_issue_tp"
				},
				{
				    name: "change_qty",
				    argument: "arg_change_qty"
				},
				{
				    name: "qstat",
				    argument: "arg_qstat"
				},
				{
				    name: "mstat",
				    argument: "arg_mstat"
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
		            element: [{ name: "prod_type"}]
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
		            element: [{ name: "issue_tp"}]
		        },
		        {
		            element: [{ name: "change_qty"}]
		        },
		        {
		            element: [{ name: "qstat"}]
		        },
		        {
		            element: [{ name: "mstat"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
                select: true,
                focus: true
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_현황"
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
                type: "GRID",
                id: "grdData_현황"
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
                                processRetrieve({});
                                /*
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                                    */
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
                    case "w_find_as":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                            args.data = {
                                issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
                            };
                        }
                        break;
                    case "w_find_faulty":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoFaulty;
                            args.data = {
                                issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
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