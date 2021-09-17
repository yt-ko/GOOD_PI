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
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				},
				{
				    type: "PAGE", name: "Line", query: "dddw_custline"
				},
				{
				    type: "PAGE", name: "Process", query: "dddw_custproc"
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
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
            show: true,
            border: true,
            margin: 70,
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
				                        memory: "제품유형",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    },
				                    remark: {
				                        title: "제품유형 :"
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
				                    data: {
				                        memory: "고객사",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    },
				                    remark: {
				                        title: "고객사 :"
				                    }
				                }
				            },
				            {
				                name: "prod_group",
				                label: {
				                    title: "장비군 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "장비군",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "year",
				                value: gw_com_api.getYear(),
				                label: {
				                    title: "사업년도 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 3,
				                    maxlength: 4
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
            targetid: "grdData_집계_1",
            query: "w_iscm1050_M_1",
            title: "제품 유형 및 고객사별 집계",
            caption: true,
            width: 507,
            height: 128,
            show: true,
            selectable: true,
            element: [
				{
				    header: "제품유형",
				    name: "prod_type_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 80,
				    align: "center"
				},
				{
				    header: "계획수량",
				    name: "plan_qty",
				    width: 70,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "계획금액",
				    name: "plan_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "실적수량",
				    name: "rslt_qty",
				    width: 70,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "실적금액",
				    name: "rslt_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int"
				},
                {
                    name: "prod_type",
                    hidden: true
                },
                {
                    name: "cust_cd",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_집계_2",
            query: "w_iscm1050_M_2",
            title: "고객사 Line 및 공정별 집계",
            caption: true,
            width: 507,
            height: 210,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "cust_line",
                validate: true
            },
            element: [
				{
				    header: "고객Line",
				    name: "cust_line",
				    width: 80,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "Line"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "Line"
				        }
				    }
				},
				{
				    header: "Process",
				    name: "cust_proc",
				    width: 80,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "Process"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "Process"
				        }
				    }
				},
				{
				    header: "계획수량",
				    name: "plan_qty",
				    width: 70,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "계획금액",
				    name: "plan_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int"
				},
				{
				    header: "실적수량",
				    name: "rslt_qty",
				    width: 70,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "실적금액",
				    name: "rslt_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int"
				},
                {
                    name: "plan_key",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "plan_year",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "prod_type",
                    hidden: true,
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    name: "cust_cd",
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
            targetid: "grdData_상세",
            query: "w_iscm1050_S_1",
            title: "월별 계획 및 실적 (금액:천원 단위)",
            caption: true,
            height: 440,
            pager: false,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "plan_qty",
                validate: true
            },
            element: [
				{
				    header: "월",
				    name: "plan_mm",
				    width: 40,
				    align: "center",
				    editable: {
				        type: "hidden",
				        validate: {
				            rule: "required",
				            message: "월"
				        }
				    }
				},
				{
				    header: "계획수량",
				    name: "plan_qty",
				    width: 70,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "계획금액",
				    name: "plan_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "실적수량",
				    name: "rslt_qty",
				    width: 70,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "실적금액",
				    name: "rslt_amt",
				    width: 80,
				    align: "right",
				    mask: "currency-int",
				    editable: {
				        type: "text"
				    }
				},
                {
                    name: "plan_key",
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
				    id: "grdData_상세",
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
            element: "추가",
            event: "click",
            handler: click_lyrMenu_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_삭제
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
            targetid: "grdData_집계_1",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_집계_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_집계_1",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_집계_1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_집계_2",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_집계_2
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_집계_2",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_집계_2
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
        function click_lyrMenu_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

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

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_집계_1(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_집계_1(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function rowselecting_grdData_집계_2(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_집계_2(ui) {

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

    return gw_com_api.getCRUD("grdData_집계_2", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if ((param.sub != true && gw_com_api.getSelectedRow("grdData_집계_1") == null)
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
                id: "grdData_집계_2"
            },
            {
                type: "GRID",
                id: "grdData_상세"
            }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
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

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "year",
				    argument: "arg_year"
				}
			],
            remark: [
		        {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            element: [{ name: "prod_group"}]
		        },
		        {
		            element: [{ name: "year"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_집계_1",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_집계_2"
			},
			{
			    type: "GRID",
			    id: "grdData_상세"
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
                id: "grdData_집계_2",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "plan_key",
		                argument: "arg_plan_key"
		            }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_상세"
	            }
            ],
            key: param.key
        };
    }
    else {
        var key = {
            KEY: [],
            QUERY: "w_iscm1050_M_2"
        };
        if (param.key != undefined) {
            $.each(param.key, function () {
                for (var key_i = 0; key_i < this.KEY.length; key_i++) {
                    if (this.KEY[key_i].NAME == "plan_key") {
                        key.KEY.push({ NAME: this.KEY[key_i].NAME, VALUE: this.KEY[key_i].VALUE });
                        break;
                    }
                }
            });
            param.key.unshift(key);
        }
        args = {
            source: {
                type: "GRID",
                id: "grdData_집계_1",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "prod_type",
		                argument: "arg_prod_type"
		            },
                    {
                        name: "cust_cd",
                        argument: "arg_cust_cd"
                    }
	            ],
                argument: [
                    { name: "arg_year", value: gw_com_api.getValue("frmOption", 1, "year") }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_집계_2",
	                select: true
	            }
            ],
            clear: [
	            {
	                type: "GRID",
	                id: "grdData_상세"
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
        gw_com_api.selectRow("grdData_집계_2", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_집계_1", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_집계_2",
        edit: true,
        updatable: true,
        data: [
		    { name: "plan_year", rule: "COPY", row: "prev", value: gw_com_api.getValue("frmOption", 1, "year") },
		    { name: "plan_qty", value: "0" },
		    { name: "plan_amt", value: "0" },
		    { name: "rslt_qty", value: "0" },
		    { name: "rslt_amt", value: "0" }
		],
        clear: [
		    {
		        type: "GRID",
		        id: "grdData_상세"
		    }
	    ]
    };
    gw_com_module.gridInsert(args);
    for (var i = 0; i < 12; i++) {
        var args = {
            targetid: "grdData_상세",
            edit: true,
            updatable: true,
            data: [
		        { name: "plan_mm", value: gw_com_api.prefixNumber(i + 1, 2) },
		        { name: "plan_qty", value: "0" },
		        { name: "plan_amt", value: "0" },
		        { name: "rslt_qty", value: "0" },
		        { name: "rslt_amt", value: "0" }
		    ]
        };
        gw_com_module.gridInsert(args);
    }

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_집계_2",
        row: "selected",
        remove: true,
        clear: [
            {
                type: "GRID",
                id: "grdData_상세"
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
                type: "GRID",
                id: "grdData_집계_2"
            },
			{
			    type: "GRID",
			    id: "grdData_상세"
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
        url: "COM",
        target: [
		    {
		        type: "GRID",
		        id: "grdData_집계_2",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "plan_key" }
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
function processRestore(param) {

    var args = {
        targetid: "grdData_집계_2",
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
                id: "grdData_상세"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_집계_2"
        });
        args.target.unshift({
            type: "GRID",
            id: "grdData_집계_1"
        });
    }
    else if (param.sub)
        args.target.unshift({
            type: "GRID",
            id: "grdData_집계_2"
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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//