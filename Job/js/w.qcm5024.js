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
				    type: "PAGE", name: "제품유형", query: "dddw_prodtype"
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
				    type: "PAGE", name: "Module", query: "dddw_mpart_tp1"
				},
				{
				    type: "PAGE", name: "발생부위", query: "dddw_mpart_tp2"
				},
				{
				    type: "PAGE", name: "발생원인", query: "dddw_mreason_tp"
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
                                name: "supp_nm",
                                label: {
                                    title: "협력사 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 13,
                                    maxlength: 20
                                }
                            }
                        ]
                    },
                    {
                        element: [
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
                        element: [
				            {
				                name: "part_tp1",
				                label: {
				                    title: "Module :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "Module",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    },
				                    change: [
					                    {
					                        name: "part_tp2",
					                        memory: "발생부위",
					                        key: [
							                    "part_tp1"
						                    ]
					                    }
				                    ]
				                }
				            },
				            {
				                name: "part_tp2",
				                label: {
				                    title: "발생부위 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "발생부위",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ],
				                        key: [
							                "part_tp1"
						                ]
				                    }
				                }
				            },
				            {
				                name: "reason_tp2",
				                label: {
				                    title: "발생원인 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "발생원인",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
                            {
                                name: "reason_tp1",
                                hidden: true
                            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "astat",
				                label: {
				                    title: "확인상태 :"
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
            query: "w_qcm5024_M_1",
            title: "문제 발생 현황",
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
				    header: "고객사",
				    name: "cust_nm",
				    width: 70,
				    align: "center"
				},
				{
				    header: "LINE",
				    name: "cust_dept",
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
				    header: "설비명",
				    name: "cust_prod_nm",
				    width: 180,
				    align: "left"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				}/*,
				{
				    header: "Module",
				    name: "prod_sub",
				    width: 60,
				    align: "center"
				},
				{
				    header: "발생구분",
				    name: "issue_tp",
				    width: 100,
				    align: "center"
				}*/,
				{
				    header: "상태",
				    name: "pstat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "Module",
				    name: "part_tp1",
				    width: 130,
				    align: "center"
				},
				{
				    header: "발생부위",
				    name: "part_tp2",
				    width: 150,
				    align: "center"
				},
				{
				    header: "발생원인",
				    name: "reason_tp2",
				    width: 200,
				    align: "center"
				},
				{
				    header: "교체부품명",
				    name: "part_nm",
				    width: 200,
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
				    header: "협력업체",
				    name: "supp_nm",
				    width: 180,
				    align: "left"
				},
				{
				    header: "확인",
				    name: "astat",
				    width: 60,
				    align: "center"
				},
				{
				    header: "품질확인",
				    name: "qstat",
				    width: 60,
				    align: "center"
				},
				{
				    header: "품질처리",
				    name: "complete_yn",
				    width: 60,
				    align: "center"
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
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            event: "itemdblclick",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            event: "itemkeyenter",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
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
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "supp_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_supplier",
                            title: "협력사 검색",
                            width: 600,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_supplier",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectSupplier,
                                    data: {
                                        supp_nm: gw_com_api.getValue(ui.object, ui.row, ui.element)
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
        function rowdblclick_grdData_현황(ui) {

            var args = {
                type: "PAGE",
                page: "w_find_faulty",
                title: "문제발생 내역",
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
            gw_com_api.setValue("frmOption", 1, "prod_type", gw_com_api.getPageParameter("prod_type"));
            gw_com_api.setValue("frmOption", 1, "cust_cd", gw_com_api.getPageParameter("cust_cd"));
            gw_com_api.setValue("frmOption", 1, "cust_dept", gw_com_api.getPageParameter("cust_dept"));
            gw_com_api.setValue("frmOption", 1, "proj_no", gw_com_api.getPageParameter("proj_no"));
            gw_com_api.setValue("frmOption", 1, "astat", gw_com_api.getPageParameter("astat"));
            gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_api.getPageParameter("supp_nm"));
            gw_com_api.setValue("frmOption", 1, "part_tp1", gw_com_api.getPageParameter("part_tp1"));
            gw_com_api.setValue("frmOption", 1, "part_tp2", gw_com_api.getPageParameter("part_tp2"));
            gw_com_api.setValue("frmOption", 1, "reason_tp1", gw_com_api.getPageParameter("reason_tp1"));
            gw_com_api.setValue("frmOption", 1, "reason_tp2", gw_com_api.getPageParameter("reason_tp2"));
        }
        else {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        }
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "")
            processRetrieve({});

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
				    name: "proj_no",
				    argument: "arg_proj_no"
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
				    name: "part_tp1",
				    argument: "arg_part_tp1"
				},
				{
				    name: "part_tp2",
				    argument: "arg_part_tp2"
				},
				{
				    name: "reason_tp1",
				    argument: "arg_reason_tp1"
				},
				{
				    name: "reason_tp2",
				    argument: "arg_reason_tp2"
				},
				{
				    name: "supp_nm",
				    argument: "arg_supp_nm"
				},
				{
				    name: "astat",
				    argument: "arg_astat"
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
		            element: [{ name: "cust_cd" }]
		        },
		        {
		            element: [{ name: "cust_dept" }]
		        },
		        {
		            element: [{ name: "cust_prod_nm" }]
		        },
		        {
		            element: [{ name: "part_tp1"}]
		        },
		        {
		            element: [{ name: "part_tp2"}]
		        },
		        {
		            element: [{ name: "reason_tp2"}]
		        },
		        {
		            element: [{ name: "supp_nm"}]
		        },
		        {
		            element: [{ name: "astat"}]
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
                /*
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_cd",
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                                    */
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
                    case "w_find_supplier":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = {
                                supp_nm: gw_com_api.getValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            v_global.event.element,
			                                (v_global.event.type == "GRID") ? true : false)
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