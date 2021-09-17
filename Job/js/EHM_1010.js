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
            targetid: "lyrMenu_4",
            type: "FREE",
            show: true,
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
            targetid: "grdData_항목",
            query: "EHM_1010_M_1",
            title: "분류 항목",
            caption: true,
            width: 452,
            height: 138,
            show: true,
            selectable: true,
            element: [
				{
				    header: "코드",
				    name: "hcode",
				    width: 120,
				    align: "center"
				},
				{
				    header: "항목",
				    name: "hname",
				    width: 305,
				    align: "left"
				},
				{
				    name: "rcode2",
				    hidden: true
				},
				{
				    name: "rcode3",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_대분류",
            query: "EHM_1010_S_1",
            title: "대분류",
            caption: true,
            width: 452,
            height: 259,
            show: true,
            selectable: true,
            editable: {
                master: true,
                bind: "select",
                focus: "dcode",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "dcode",
				    width: 60,
				    align: "center",
				    editable: {
				        bind: "create",
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "대분류",
				    name: "dname",
				    width: 160,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
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
		            header: "순번",
		            name: "sort_seq",
		            width: 40,
		            align: "center",
		            editable: {
		                type: "text"
		            }
		        },
		        {
		            header: "그룹", name: "fcode1", width: 80, align: "center",
		            editable: { type: "text" }
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
            targetid: "grdData_중분류",
            query: "EHM_1010_S_2",
            title: "중분류",
            caption: true,
            height: 184,//476,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "dcode",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "dcode",
				    width: 80,
				    align: "center",
				    editable: {
				        bind: "create",
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "중분류",
				    name: "dname",
				    width: 220,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 250,
				    align: "left",
				    editable: {
				        type: "text"
				    }
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
		            header: "순번",
		            name: "sort_seq",
		            width: 40,
		            align: "center",
		            editable: {
		                type: "text"
		            }
		        },
				{
				    name: "rcode",
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
            query: "EHM_1010_S_3",
            title: "소분류",
            caption: true,
            height: 184,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "dcode",
                validate: true
            },
            element: [
				{
				    header: "코드",
				    name: "dcode",
				    width: 80,
				    align: "center",
				    editable: {
				        bind: "create",
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "소분류",
				    name: "dname",
				    width: 220,
				    align: "left",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required"
				        }
				    }
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 250,
				    align: "left",
				    editable: {
				        type: "text"
				    }
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
		            header: "순번",
		            name: "sort_seq",
		            width: 40,
		            align: "center",
		            editable: {
		                type: "text"
		            }
		        },
				{
				    name: "fcode1",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "rcode",
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
                    id: "grdData_항목",
                    offset: 8
                },
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
            targetid: "grdData_항목",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_항목
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_항목",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_항목
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
            targetid: "grdData_대분류",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_대분류
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
        //----------
        var args = {
            targetid: "grdData_중분류",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_중분류
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ detail: true })) return;

            processInsert({ sub: true });

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({ sub: true });

        }
        //----------
        function click_lyrMenu_4_추가(ui) {

            if (!checkManipulate({ detail: true })) return;

            processInsert({ detail: true });

        }
        //----------
        function click_lyrMenu_4_삭제(ui) {

            if (!checkManipulate({ detail: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({ detail: true });

        }
        //----------
        function rowselecting_grdData_항목(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_항목(ui) {

            v_global.process.prev.master = ui.row;

            //toggleObject({ show: (gw_com_api.getValue(ui.object, ui.row, "rcode3", true) != "") ? true : false });
            processLink({});

        };
        //----------
        function rowselecting_grdData_대분류(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_대분류(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------
        function itemchanged_grdData_대분류(ui) {

            switch (ui.element) {
                case "dcode":
                    {
                        var ids = gw_com_api.getRowIDs("grdData_중분류");
                        $.each(ids, function () {
                            if (ui.value.prev == gw_com_api.getValue("grdData_중분류", this, "rcode", true))
                                gw_com_api.setValue("grdData_중분류", this, "rcode", ui.value.current, true);
                        });
                        var ids = gw_com_api.getRowIDs("grdData_소분류");
                        $.each(ids, function () {
                            if (ui.value.prev == gw_com_api.getValue("grdData_소분류", this, "rcode", true))
                                gw_com_api.setValue("grdData_소분류", this, "rcode", ui.value.current, true);
                        });
                    }
                    break;
            }
            return true;

        }
        //----------
        function rowselecting_grdData_중분류(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.detail = ui.row;

            return checkUpdatable({ detail: true });

        }
        //----------
        function rowselected_grdData_중분류(ui) {

            v_global.process.prev.detail = ui.row;

            processLink({ detail: true });

        };
        //----------
        function itemchanged_grdData_중분류(ui) {

            switch (ui.element) {
                case "dcode":
                    {
                        var ids = gw_com_api.getRowIDs("grdData_소분류");
                        $.each(ids, function () {
                            if (ui.value.prev == gw_com_api.getValue("grdData_소분류", this, "fcode1", true))
                                gw_com_api.setValue("grdData_소분류", this, "fcode1", ui.value.current, true);
                        });
                    }
                    break;
            }
            return true;

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
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
function toggleObject(param) {

    if (param.show) {
        gw_com_api.setHeight("grdData_중분류", 184, true);
        gw_com_api.show("lyrMenu_4");
        gw_com_api.show("grdData_소분류");
    }
    else {
        gw_com_api.setHeight("grdData_중분류", 478, true);
        gw_com_api.hide("lyrMenu_4");
        gw_com_api.hide("grdData_소분류");
    }
}
//----------
function checkCRUD(param) {

    if (param.detail)
        return gw_com_api.getCRUD("grdData_중분류", "selected", true);
    else if (param.sub)
        return gw_com_api.getCRUD("grdData_대분류", "selected", true);
    else
        return ((gw_com_api.getSelectedRow("grdData_항목") == null) ? "none" : "");

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
        target: [
            {
                type: "GRID",
                id: "grdData_대분류",
                refer: (param.sub || param.detail) ? true : false
            },
            {
                type: "GRID",
                id: "grdData_중분류",
                refer: (param.detail) ? true : false
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
function checkRemovable(param) {

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create")
        processDelete(param);
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
                {
                    name: "arg_part",
                    value: "CS"
                }
			]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_항목",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_대분류"
			},
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
    if (param.detail) {
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
		            },
                    {
                        name: "rcode",
                        argument: "arg_rcode"
                    }
	            ],
                argument: [
                    { name: "arg_hcode", value: gw_com_api.getValue("grdData_항목", "selected", "rcode3", true) }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_소분류",
	                select: true
	            }
            ],
            key: param.key
        };
    }
    else if (param.sub) {
        args = {
            source: {
                type: "GRID",
                id: "grdData_대분류",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "dcode",
		                argument: "arg_dcode"
		            }
	            ],
                argument: [
                    { name: "arg_rcode2", value: gw_com_api.getValue("grdData_항목", "selected", "rcode2", true) }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_중분류",
	                select: true
	            }
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
    else {
        args = {
            source: {
                type: "GRID",
                id: "grdData_항목",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "hcode",
		                argument: "arg_hcode"
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
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.detail)
        gw_com_api.selectRow("grdData_중분류", v_global.process.current.detail, true, false);
    else if (param.sub)
        gw_com_api.selectRow("grdData_대분류", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_항목", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {};
    if (param.detail)
        args = {
            targetid: "grdData_소분류",
            edit: true,
            data: [
                { name: "hcode", value: gw_com_api.getValue("grdData_항목", "selected", "rcode3", true) },
                { name: "rcode", value: gw_com_api.getValue("grdData_대분류", "selected", "dcode", true) },
                { name: "fcode1", value: gw_com_api.getValue("grdData_중분류", "selected", "dcode", true) }
            ]
        };
    else if (param.sub)
        args = {
            targetid: "grdData_중분류",
            updatable: true,
            edit: true,
            data: [
                { name: "hcode", value: gw_com_api.getValue("grdData_항목", "selected", "rcode2", true) },
                { name: "rcode", value: gw_com_api.getValue("grdData_대분류", "selected", "dcode", true) }
            ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_소분류"
                }
	        ]
        };
    else
        args = {
            targetid: "grdData_대분류",
            updatable: true,
            edit: true,
            data: [
                { name: "hcode", value: gw_com_api.getValue("grdData_항목", "selected", "hcode", true) }
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
	        ]
        };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        row: "selected",
        remove: true
    };
    if (param.detail) {
        args.targetid = "grdData_소분류";
    }
    else if (param.sub) {
        args.targetid = "grdData_중분류";
        args.clear = [
            {
                type: "GRID",
                id: "grdData_소분류"
            }
        ];
    }
    else {
        args.targetid = "grdData_대분류";
        args.clear = [
            {
                type: "GRID",
                id: "grdData_중분류"
            },
            {
                type: "GRID",
                id: "grdData_소분류"
            }
        ];
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_대분류"
            },
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
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var obj = (param.detail) ? "grdData_소분류" : ((param.sub) ? "grdData_중분류" : "grdData_대분류");
    var args = {
        url: "COM",
        procedure: "PROC_DELETE_ISSUE_DIV",
        nomessage: true,
        input: [
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "type", value: "AS", type: "varchar" },
            { name: "hcode", value: gw_com_api.getValue(obj, "selected", "hcode", true), type: "varchar" },
            { name: "dcode", value: gw_com_api.getValue(obj, "selected", "dcode", true), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: {
            success: completeRemove,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processRestore(param) {

    var args = {};
    if (param.detail) {
        args = {
            targetid: "grdData_중분류",
            row: v_global.process.prev.detail
        };
        gw_com_module.gridRestore(args);
    }
    else if (param.sub) {
        args = {
            targetid: "grdData_대분류",
            row: v_global.process.prev.sub
        };
        gw_com_module.gridRestore(args);
    }

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
function completeRemove(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response, param: param });

}
//----------
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processLink({ key: response });
    else {
        status = checkCRUD({ sub: true });
        if (status == "create" || status == "update")
            processLink({ sub: true, key: response });
        else
            processLink({ detail: true, key: response });
    }

}
//----------
function successRemove(response, param) {

    if (response.VALUE[0] != -1)
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
                                var status = checkCRUD(param.data.arg);
                                if (status == "initialize" || status == "create")
                                    processDelete(param.data.arg);
                                else if (status == "update")
                                    processRestore(param.data.arg);
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
                    case gw_com_api.v_Message.msg_informBatched:
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