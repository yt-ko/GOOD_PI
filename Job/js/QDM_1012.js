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
                    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM25" }
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
				    name: "저장",
				    value: "저장"
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
                focus: "prod_type",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "prod_type",
				                label: {
				                    title: "제품유형 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "제품유형"
				                    },
				                    remark: {
				                        title: "제품유형 :"
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
            targetid: "grdData_대분류",
            query: "EHM_1012_M_1",
            title: "대분류",
            caption: true,
            width: 472,
            height: 150,
            show: true,
            selectable: true,
            element: [
				{
				    header: "코드",
				    name: "hcode",
				    width: 140,
				    align: "center"
				},
				{
				    header: "대분류",
				    name: "hname",
				    width: 305,
				    align: "left"
				},
				{
				    name: "rcode2",
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
            targetid: "grdData_중분류",
            query: "EHM_1012_S_1",
            title: "중분류",
            caption: true,
            width: 472,
            height: 188,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "use_yn",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "dcode",
				    width: 140,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "중분류",
				    name: "dname",
				    width: 260,
				    align: "left"
				},
		        {
		            header: "사용",
		            name: "use_yn",
		            width: 40,
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
				    name: "fcode",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "hcode",
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
            targetid: "grdData_소분류",
            query: "EHM_1012_S_2",
            title: "소분류",
            caption: true,
            height: 417,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "open",
                focus: "use_yn",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "dcode",
				    width: 140,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "소분류",
				    name: "dname",
				    width: 260,
				    align: "left"
				},
		        {
		            header: "사용",
		            name: "use_yn",
		            width: 40,
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
				    name: "fcode",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "hcode",
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
                    id: "grdData_대분류",
                    offset: 8
                },
                {
                    type: "GRID",
                    id: "grdData_중분류",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_소분류",
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
            targetid: "grdData_대분류",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_대분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_대분류",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_대분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_중분류",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_중분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_중분류",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_중분류
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

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
        function rowselecting_grdData_대분류(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_대분류(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function rowselecting_grdData_중분류(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_중분류(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };

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

    return gw_com_api.getCRUD("grdData_중분류", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if ((param.sub != true && gw_com_api.getSelectedRow("grdData_대분류") == null)
        || (param.sub && checkCRUD({}) == "none")) {
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
                id: "grdData_중분류"
            },
            {
                type: "GRID",
                id: "grdData_소분류"
            }
		],
        param: param
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
				    name: "prod_type",
				    argument: "arg_prod_type"
				}
			],
            argument: [
                {
                    name: "arg_part",
                    value: "QS"
                }
			],
            remark: [
		        {
		            element: [{ name: "prod_type"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_대분류",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_중분류"
			},
			{
			    type: "GRID",
			    id: "grdData_소분류"
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
                id: "grdData_중분류",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "dcode",
		                argument: "arg_dcode"
		            }
	            ],
                argument: [
                    { name: "arg_fcode", value: gw_com_api.getValue("frmOption", 1, "prod_type") },
                    { name: "arg_rcode2", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode2", true) }
	            ]
            },
            target: [
	            { type: "GRID", id: "grdData_소분류", select: false }
            ],
            key: param.key
        };
    }
    else {
        args = {
            source: { type: "GRID", id: "grdData_대분류",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "hcode",
		                argument: "arg_hcode"
		            }
	            ],
                argument: [
                    { name: "arg_fcode", value: gw_com_api.getValue("frmOption", 1, "prod_type") }
	            ]
            },
            target: [
	            { type: "GRID", id: "grdData_중분류", select: true }
            ],
            clear: [
	            {
	                type: "GRID",
	                id: "grdData_소분류"
	            }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_중분류", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_대분류", v_global.process.current.master, true, false);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_중분류"
            },
			{
			    type: "GRID",
			    id: "grdData_소분류"
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
function processRestore(param) {

    var args = {
        targetid: "grdData_중분류",
        row: v_global.process.prev.sub
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_소분류"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_중분류"
        });
        args.target.unshift({
            type: "GRID",
            id: "grdData_대분류"
        });
    }
    else if (param.sub)
        args.target.unshift({
            type: "GRID",
            id: "grdData_중분류"
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
        processLink({ key: response });
    else
        processLink({ sub: true, key: response });

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
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//