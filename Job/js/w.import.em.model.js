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

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "대분류", query: "dddw_model_class_1"
                },
                {
                    type: "PAGE", name: "중분류", query: "dddw_model_class_2"
                },
                {
                    type: "PAGE", name: "소분류", query: "dddw_model_class_3"
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
				    name: "업로드",
				    value: "업로드",
				    icon: "실행",
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "시트 읽기",
				    icon: "조회"
				},
                {
                    name: "저장",
                    value: "저장"
                }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_정보",
            query: "w_import_em_model_1",
            type: "TABLE",
            title: "모델 정보",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select"/*,
                focus: "sheet_nm"*/,
                validate: true
            },
            content: {
                width: { label: 80, field: 220 },
                row: [
                    {
                        element: [
                            { header: true, value: "시트명", format: { type: "label"} },
                            { name: "sheet_nm", editable: { type: "text"} },
                            { header: true, value: "고객사", format: { type: "label"} },
                            {
                                name: "cust_nm",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "요청회사"
                                    }
                                }
                            },
                            { header: true, value: "생산의뢰번호", format: { type: "label"} },
                            { name: "proj_no", editable: { type: "text"} }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대분류", format: { type: "label"} },
                            {
                                name: "model_class1",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "대분류"
                                    },
                                    change: [
					                    {
					                        name: "model_class2",
					                        memory: "중분류",
					                        key: [
							                    "model_class1"
						                    ]
					                    },
                                        {
                                            name: "model_class3",
                                            memory: "소분류",
                                            key: [
							                    "model_class1",
                                                "model_class2"
						                    ]
                                        }
				                    ]
                                }
                            },
                            { header: true, value: "중분류", format: { type: "label"} },
                            {
                                name: "model_class2",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "중분류",
                                        key: [
							                "model_class1"
						                ]
                                    },
                                    change: [
					                    {
					                        name: "model_class3",
					                        memory: "소분류",
					                        key: [
							                    "model_class1",
                                                "model_class2"
						                    ]
					                    }
				                    ]
                                }
                            },
                            { header: true, value: "소분류", format: { type: "label"} },
                            {
                                name: "model_class3",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "소분류",
                                        key: [
							                "model_class1",
                                            "model_class2"
						                ]
                                    }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "특기사항", format: { type: "label"} },
                            { style: { colspan: 5 }, name: "rmk",
                                format: { type: "textarea", rows: 3, width: 796 },
                                editable: { type: "textarea", rows: 3, width: 796 }
                            },
                            { name: "cust_cd", hidden: true, editable: { type: "hidden"} },
                            { name: "revision", hidden: true, editable: { type: "hidden"} },
                            { name: "ins_usr", hidden: true, editable: { type: "hidden"} },
                            { name: "ins_dt", hidden: true, editable: { type: "hidden"} },
                            { name: "file_id", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_적용",
            query: "w_import_em_model_2",
            title: "적용 내역",
            //caption: true,
            height: 550,
            show: true,
            selectable: true, /*
            group: [
                { element: "div_2", show: true, summary: true } ]*/
            //nogroup: true,
            editable: {
                bind: "select",
                focus: "seq",
                validate: true
            },
            element: [
                {
                    header: "No.",
                    name: "seq",
                    width: 35,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
                {
                    header: "대분류",
                    name: "title_div1",
                    width: 80,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
                {
                    header: "중분류",
                    name: "title_div2",
                    width: 100,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
                {
                    header: "품목코드",
                    name: "mat_cd",
                    width: 100,
                    align: "center",
                    editable: {
                        type: "text"
                    },
                    summary: { title: "  ▶ 소계" }
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 250,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    editable: {
				        type: "text"
				    },
				    summary: { type: "sum" }
				},
				{
				    header: "거래처",
				    name: "mat_maker",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "품목병합",
				    name: "mat_merge",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "도면번호",
				    name: "drw_no",
				    width: 100,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "재질",
				    name: "mat_quality",
				    width: 100,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    name: "file_id",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "sheet_nm",
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
            targetid: "grdData_엑셀",
            query: "w_import_em_model_3",
            title: "엑셀 내역",
            //caption: true,
            height: 550,
            show: true,
            selectable: true, /*
            group: [
                { element: "div_2", show: true, summary: true } ]*/
            //nogroup: true,
            element: [
                {
                    header: "No.",
                    name: "seq",
                    width: 35,
                    align: "center"
                },
                {
                    header: "대분류",
                    name: "title_div1",
                    width: 80,
                    align: "center"
                },
                {
                    header: "중분류",
                    name: "title_div2",
                    width: 100,
                    align: "center"
                },
                {
                    header: "품목코드",
                    name: "mat_cd",
                    width: 100,
                    align: "center",
                    summary: { title: "  ▶ 소계" }
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "수량",
				    name: "item_qty",
				    width: 60,
				    align: "right",
				    mask: "numeric-float",
				    summary: { type: "sum" }
				},
				{
				    header: "거래처",
				    name: "mat_maker",
				    width: 100,
				    align: "center"
				},
				{
				    header: "품목병합",
				    name: "mat_merge",
				    width: 200,
				    align: "left"
				},
				{
				    header: "도면번호",
				    name: "drw_no",
				    width: 100,
				    align: "center"
				},
				{
				    header: "재질",
				    name: "mat_quality",
				    width: 100,
				    align: "left"
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 200,
				    align: "left"
				},
				{
				    name: "file_id",
				    hidden: true
				},
				{
				    name: "sheet_nm",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrRemark",
            row: [
 				{
 				    name: "작업"
 				}
			]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                {
                    type: "GRID",
                    id: "grdData_적용",
                    title: "적용 내역"
                },
                {
                    type: "GRID",
                    id: "grdData_엑셀",
                    title: "엑셀 내역"
                }
			]
        };
        //----------
        gw_com_module.convertTab(args);
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
                    id: "grdData_적용",
                    offset: 8
                },
                {
                    type: "GRID",
                    id: "grdData_엑셀",
                    offset: 8
                },
				{
				    type: "TAB",
				    id: "lyrTab",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);

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
            element: "업로드",
            event: "click",
            handler: click_lyrMenu_1_업로드
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
            element: "조회",
            event: "click",
            handler: click_lyrMenu_2_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_2_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_정보",
            event: "itemdblclick",
            handler: itemdblclick_frmData_정보
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_정보",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_정보
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_업로드(ui) {

            var args = {
                targetid: "lyrServer",
                control: {
                    by: "DX",
                    id: ctlUpload
                }
            };
            gw_com_module.uploadFile(args);

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            processClose({});

        }
        //----------
        function click_lyrMenu_2_조회(ui) {

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
        function click_lyrMenu_2_저장(ui) {

            closeOption({});

            processSave({});
        }
        //----------
        function itemdblclick_frmData_정보(ui) {

            switch (ui.element) {
                case "cust_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_cust_info",
                            title: "고객사 검색",
                            width: 700,
                            height: 420,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_cust_info",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectCusromer
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

//---------
function click_frmOption_실행(ui) {

    v_global.process.handler = processImport;

    //if (!checkUpdatable({})) return false;

    processImport({});

}
//----------
function click_frmOption_취소(ui) {

    closeOption({});

}
//----------
function processOption(param) {

    gw_com_api.show("frmOption");

    //----------
    var args = {
        targetid: "frmOption",
        type: "FREE",
        title: "조회 조건",
        trans: true,
        border: true,
        margin: 82,
        show: true,
        editable: {
            focus: "sheet",
            validate: true
        },
        content: {
            row: [
                {
                    element: [
				        {
				            name: "sheet_nm",
				            label: {
				                title: "시트명 :"
				            },
				            editable: {
				                type: "select",
				                data: {
				                    memory: "SHEET"
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
    gw_com_module.formCreate(args);
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

}
//----------
function processRetrieve(param) {

    closeOption({});

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_file_id", value: v_global.logic.id },
                { name: "arg_sheet_nm", value: gw_com_api.getValue("frmOption", 1, "sheet_nm") }
            ]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_정보",
                edit: param.edit
            },
            {
                type: "GRID",
                id: "grdData_적용"
            },
            {
                type: "GRID",
                id: "grdData_엑셀"
            }
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processImport(param) {

    var args = {
        user: gw_com_module.v_Session.USR_ID,
        key: v_global.logic.id,
        path: v_global.logic.path,
        sheet: gw_com_api.getValue("frmOption", 1, "sheet_nm"),
        row: 8,
        column: 1,
        fields: 14,
        handler: {
            success: successImport
        }
    };
    gw_com_module.objImport(args);

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
			    type: "GRID",
			    id: "grdData_적용"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.nomessage = true;
    args.handler = {
        success: successSave
    };
    if (gw_com_module.objSave(args) == false)
        processApply({});

}
//----------
function processApply(param) {

    var args = {
        url: "COM",
        procedure: "PROC_EXCEL_EM_MODEL",
        input: [
            { name: "file_id", value: gw_com_api.getValue("frmData_정보", 1, "file_id") },
            { name: "sheet_nm", value: gw_com_api.getValue("frmData_정보", 1, "sheet_nm") },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: successApply
        }
    };
    gw_com_module.callProcedure(args);

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
                id: "grdData_적용"
            },
            {
                type: "GRID",
                id: "grdData_엑셀"
            }
		]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);
    processClear({});

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
function successUpload(response) {

    v_global.logic.id = response.id;
    v_global.logic.path = response.path;

    var data = [];
    $.each(response.option.split(","), function () {
        data.push({ title: this, value: this });
    });
    var args = {
        request: [
            {
                type: "INLINE", name: "SHEET",
                data: data
            }
		],
        starter: processOption
    };
    gw_com_module.selectSet(args);
    //----------
    var args = {
        targetid: "lyrRemark",
        row: [
		    {
		        name: "작업",
		        value: "[ 파일 : " + response.file + " ]"
		    }
	    ]
    };
    gw_com_module.labelAssign(args);


}
//----------
function successImport(response) {

    processRetrieve({ edit: true });

}
//----------
function successSave(response, param) {

    processApply({});

}
//----------
function successApply(response) {

    processRetrieve({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_upload_ESTREQ:
            {
                v_global.data = param.data;
                v_global.process.init = true;
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedCustomer:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_nm",
			                        param.data.cust_name,
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
                    case "w_find_cust_info":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectCusromer;
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