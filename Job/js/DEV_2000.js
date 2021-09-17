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
				{ type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: "ALL"}] },
				{ type: "PAGE", name: "DEPT_AUTH_IN", query: "dddw_deptarea_auth" },
                { type: "PAGE", name: "권한", query: "dddw_role" },
                { type: "PAGE", name: "부서", query: "dddw_dept" }
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
				}/*,
				{
				    name: "삭제",
				    value: "삭제"
				}*/,
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
        var args = { targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "prod_type", validate: true },
            content: { row: [
                    { element: [
                        { name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select", size: 7, maxlength: 20 , 
                            	data: { memory: "DEPT_AREA_IN", unshift: [ { title: "전체", value: "%" } ] } }
                        },
                            {
                                name: "role_id",
                                label: {
                                    title: "권한 :"
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "권한",
                                        unshift: [ { title: "전체", value: "%" } ]
                                    }
                                }
                            },
				            {
				                name: "dept_cd",
				                label: {
				                    title: "부서 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "부서",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
                            {
                                name: "user_nm",
                                label: {
                                    title: "사용자 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 20
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
        var args = { targetid: "grdData_목록", query: "SYS_2010_M_2", title: "PLM 사용자",
            height: 442, show: true, selectable: true, dynamic: true, key: true,
            editable: { multi: true, bind: "select", focus: "role_id", validate: true },
            element: [
                { header: "사용자명", name: "user_nm", width: 70, align: "center" },
                { header: "ID", name: "user_id", width: 100, align: "center", editable: { type: "hidden" } },
                { header: "사번", name: "emp_no", width: 70, align: "center" },
                { header: "부서", name: "dept_nm", width: 100, align: "center" },
                { header: "직함", name: "pos_nm", width: 60, align: "center" },
				{ header: "시스템 권한", name: "role_id", width: 120, align: "center",
				    format: { type: "select",
				        data: { memory: "권한", unshift: [ { title: "-", value: "" } ] }
				    },
				    editable: { type: "select",
				        data: { memory: "권한", unshift: [ { title: "-", value: "" } ] }
				    }
				},
				{ header: "장비군", name: "node_code", width: 80, align: "center",
				    format: { type: "select",
				        data: { memory: "DEPT_AREA_IN", unshift: [ { title: "-", value: "" } ] }
				    },
				    editable: { type: "select",
				        data: { memory: "DEPT_AREA_IN", unshift: [ { title: "-", value: "" } ] }
				    }
				},
				{ header: "장비군 권한", name: "node_share", width: 100, align: "center",
				    format: { type: "select",
				        data: { memory: "DEPT_AUTH_IN", unshift: [ { title: "-", value: "" } ] }
				    },
				    editable: { type: "select",
				        data: { memory: "DEPT_AUTH_IN", unshift: [ { title: "-", value: "" } ] }
				    }
				},
                { header: "최종접속일", name: "on_date", width: 160, align: "center" }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [ { type: "GRID", id: "grdData_목록", offset: 8 } ]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

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
        //gw_com_module.eventBind(args);
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
        function click_lyrMenu_추가(ui) {

            closeOption({});

            processInsert({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            closeOption({});

            processDelete({});

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
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
			{
			    type: "GRID",
			    id: "grdData_목록"
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
    if (gw_com_module.objValidate(args) == false) {
        processClear({});
        return false;
    }

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "role_id", argument: "arg_role_id" },
                { name: "dept_cd", argument: "arg_dept_cd" },				
				{ name: "user_nm", argument: "arg_user_nm" }
			],
			remark: [
                { element: [{ name: "role_id"}] },
                { element: [{ name: "dept_cd"}] },		        
		        { element: [{ name: "user_nm"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_목록", select: true }
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    var args = {
        type: "PAGE", page: "w_find_emp_gw", title: "사용자 찾기",
        width: 600, height: 400, scroll: true, open: true, control: true, locate: ["center", "top"]
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_emp_gw"
        }
        gw_com_module.dialogueOpen(args);
    }

    //var args = {
    //    targetid: "grdData_목록",
    //    edit: true
    //};
    //if (gw_com_api.getRowCount("grdData_목록") > 1)
    //    args.data = [
    //        { name: "prod_type", rule: "COPY", row: "prev" },
    //        { name: "prod_type_nm", rule: "COPY", row: "prev" },
    //        { name: "cust_cd", rule: "COPY", row: "prev" },
    //        { name: "cust_nm", rule: "COPY", row: "prev" },
    //        { name: "cust_proc", rule: "COPY", row: "prev" },
    //        { name: "cust_proc_nm", rule: "COPY", row: "prev" },
    //        { name: "part_cd", rule: "COPY", row: "prev" },
    //        { name: "supp_cd", rule: "COPY", row: "prev" },
    //        { name: "supp_nm", rule: "COPY", row: "prev" }
    //    ];
    //else
    //    args.data = [
    //        { name: "prod_type", value: gw_com_api.getValue("frmOption", 1, "prod_type") },
    //        { name: "prod_type_nm", value: gw_com_api.getText("frmOption", 1, "prod_type") },
    //        { name: "cust_cd", value: gw_com_api.getValue("frmOption", 1, "cust_cd") },
    //        { name: "cust_nm", value: gw_com_api.getText("frmOption", 1, "cust_cd") },
    //        { name: "cust_proc", value: gw_com_api.getValue("frmOption", 1, "cust_proc") },
    //        { name: "cust_proc_nm", value: gw_com_api.getText("frmOption", 1, "cust_proc") }
    //    ];
    //var row = gw_com_module.gridInsert(args);
    //itemdblclick_grdData_목록({
    //    type: "GRID",
    //    object: "grdData_목록",
    //    row: row,
    //    element: "part_cd"
    //});

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_목록",
        row: "selected"
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_목록"
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
                id: "grdData_목록"
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
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
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
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                //파라미터
                if (param.retrieve != undefined) {
                    if (param.retrieve) processRetrieve();
                }
            }
            break;
        case gw_com_api.v_Stream.msg_retrieve:
            {

            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
