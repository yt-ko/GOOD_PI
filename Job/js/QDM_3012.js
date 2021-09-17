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
        var args = { request: [
				{ type: "PAGE", name: "발생부문", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "IQCM05" } ]
				},
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "IEHM11" } ] 
                },
				{ type: "PAGE", name: "고객사", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "ISCM29" } ]
				},
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED", 
					param: [ { argument: "arg_hcode", value: "IEHM02" } ]
				},
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "IEHM06" } ]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE", 
					param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
                { type: "INLINE", name: "Warranty",
                    data: [ { title: "전체", value: "%" }, { title: "IN", value: "IN" }, { title: "OUT", value: "OUT" } ]
                },
                { type: "INLINE", name: "진행상태",
                    data: [
						{ title: "전체", value: "%" },
						{ title: "처리중", value: "0" },
						{ title: "처리완료", value: "1" },
						{ title: "미확인", value: "2" }
					]
                },
                { type: "INLINE", name: "부품교체",
                    data: [
						{ title: "교체", value: "1" },
						{ title: "미교체", value: "0" }
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
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
                {
                    name: "조회",
                    value: "조회",
                    act: true
                },
                {
                    name: "처리",
                    value: "처리결과 등록",
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
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            remark: "lyrRemark",
            content: { row: [
                    { element: [
                        { name: "issue_part", label: { title: "발생부문 :" }, value: "AS",
                        	editable: { type: "select", data: { memory: "발생부문", unshift: [ { title: "전체", value: "" } ]                 }             }         }, { style: { colfloat: "floating"             }, name: "ymd_fr", label: { title: "발생일자 :"             }, mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10             }         }, { name: "ymd_to", label: { title: "~"             }, mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10             }         },
                        { name: "prod_group", label: { title: "제품군 :" }, value: "",
                            editable: { type: "select",
                                data: { memory: "제품군", unshift: [ { title: "전체", value: "" } ] }
                            }
                        }, 
                        { name: "prod_type", label: { title: "제품유형 :" },
                            editable: { type: "select", 
                            	data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
                            }         
                        }     
                        ]
                    },
                    { element: [
                    	{ name: "cust_cd", label: { title: "고객사 :" }, 
                    		editable: { type: "select", data: { memory: "고객사", unshift: [ { title: "전체", value: "" } ] }, 
                    		change: [ { name: "cust_dept", memory: "LINE", key: [ "cust_cd" ] }                 
					                ]             
					                }         
					                }, 
					    { name: "cust_dept", label: { title: "LINE :"             }, editable: { type: "select", data: { memory: "LINE", unshift: [ { title: "전체", value: "" }                     ], key: [
							                "cust_cd"
						                ]                 }             }         }, 
						{ name: "cust_prod_nm", label: { title: "설비명 :" }, editable: { type: "text", size: 12, maxlength: 20 } },
                        { name: "proj_no",
                                label: {
                                    title: "Project No. :"
                                },
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 20
                                }
                            }     ]
                    },
                    { element: [        
                    	{ name: "endstat", value: "%", label: { title: "진행상태 :" }, 
                    		editable: { type: "select", data: { memory: "진행상태" } }         
                    	},
                        { name: "part_change", value: "", label: { title: "부품교체 :" },
                          editable: { type: "select",
                                data: { memory: "부품교체", unshift: [ { title: "전체", value: "" } ] }
                            }
                        },
                        { name: "wrnt_io", label: { title: "Warranty :" },
                            editable: { type: "select", data: { memory: "Warranty" } }
                        },
                        { name: "issue_type", label: { title: "발생구분 :" }, value: "",
                            editable: { type: "select", 
                            	data: { memory: "발생구분", unshift: [ { title: "전체", value: "" } ] } }
                        }     
                        ]
                    },
                    { element: [
						{ name: "issue_no", label: { title: "관리번호 :" }, editable: { type: "text", size: 12, maxlength: 20 } },
						{ name: "rmk", label: { title: "발생현상 :" }, editable: { type: "text", size: 20, maxlength: 50 } },
						{ name: "work_rmk", label: { title: "조치내용 :" }, editable: { type: "text", size: 20, maxlength: 50 } }
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
                            }, { name: "취소", value: "취소", format: { type: "button", icon: "닫기"             }         }     ]
                    }
			    ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_현황", query: "QDM_3010_M_1", title: "문제 보고 내역",
            height: 442, show: true, selectable: true, dynamic: true, number: true,
            element: [
                { name: "edit_yn", hidden: true },
                { header: "관리번호", name: "issue_no", width: 80, align: "center",
                    editable: { type: "hidden" }
                },
				{ header: "발생일자", name: "issue_dt", width: 80, align: "center", mask: "date-ymd"
				},
				{ header: "발생구분", name: "issue_tp", width: 90, align: "center"
				},
				{ header: "고객사", name: "cust_nm", width: 80, align: "center"
				},
				{ header: "Line", name: "cust_dept", width: 80, align: "center"
				},
				{ header: "Process", name: "cust_proc", width: 100, align: "center"
				},
				{ header: "고객설비명", name: "cust_prod_nm", width: 150, align: "center"
				},
                { header: "Project No.", name: "proj_no", width: 80, align: "center" },
                { header: "제품유형", name: "prod_type", width: 80, align: "center" },
				{ header: "제품", name: "prod_nm", width: 200, align: "left" },
				{ header: "Module", name: "prod_sub", width: 100, align: "center" },
				{ header: "Warranty", name: "wrnt_io", width: 60, align: "center" },
				{ header: "중요도", name: "important_level", width: 60, align: "center" },
				{ header: "발생현상", name: "rmk", width: 250, align: "left" },
				//{ header: "조치내용", name: "work_rmk", width: 400, align: "left" },
				{ header: "교체부품명", name: "part_nm", width: 200, align: "left" },
				{ header: "교체건수", name: "part_cnt", width: 60, align: "center"
				},
				{ header: "교체수량", name: "part_sum", width: 60, align: "center"
				},
				{ header: "진행상태", name: "istat", width: 80, align: "center"
				},
				{ header: "등록자", name: "ins_usr", width: 70, align: "center"
				},
				{ header: "등록일시", name: "ins_dt", width: 160, align: "center"
				},
				{ header: "수정자", name: "upd_usr", width: 70, align: "center"
				},
				{ header: "수정일시", name: "upd_dt", width: 160, align: "center"
				},
				{ header: "품질확인자", name: "qemp", width: 70, align: "center"
				},
				{ header: "품질확인일시", name: "qdate", width: 160, align: "center"
				},
				{ name: "issue_part", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8
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
        /*
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_저장
        };
        gw_com_module.eventBind(args);
        */
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
                    page: "QDM_3010",
                    title: "문제 처리 등록",
                    param: [
                        { name: "issue_no", value: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true) },
                        { name: "cust_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_nm", true) },
                        { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                        { name: "wrnt_io", value: gw_com_api.getValue("grdData_현황", "selected", "wrnt_io", true) },
                        { name: "issue_part", value: gw_com_api.getValue("grdData_현황", "selected", "issue_part", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_조회() {

            var args = {
                target: [ { id: "frmOption", focus: true } ]
            };
            gw_com_module.objToggle(args);

        }
        /*
        //----------
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

        }
        */
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
        function rowdblclick_grdData_현황(ui) {

            var args = {
                type: "PAGE",
                page: "DLG_ISSUE",
                title: "문제 상세 정보",
                width: 1100,
                height: 500,
                scroll: true,
                open: true, control: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_ISSUE",
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
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [ { name: "issue_part", argument: "arg_issue_part" }
            	, { name: "ymd_fr", argument: "arg_ymd_fr" }
            	, { name: "ymd_to", argument: "arg_ymd_to" }
            	, { name: "prod_group", argument: "arg_prod_group" }
            	, { name: "prod_type", argument: "arg_prod_type" }
            	, { name: "cust_cd", argument: "arg_cust_cd" }
            	, { name: "cust_dept", argument: "arg_cust_dept" }
            	, { name: "cust_prod_nm", argument: "arg_cust_prod_nm" }
            	, { name: "proj_no", argument: "arg_proj_no" }
            	, { name: "part_change", argument: "arg_part_change" }
            	, { name: "wrnt_io", argument: "arg_wrnt_io" }
            	, { name: "endstat", argument: "arg_endstat" }
            	, { name: "issue_type", argument: "arg_issue_type" }
            	, { name: "issue_no", argument: "arg_issue_no" }
            	, { name: "rmk", argument: "arg_rmk" }
            	, { name: "work_rmk", argument: "arg_work_rmk" }
			],
            remark: [
	            { element: [{ name: "issue_part"}] },
	            { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "prod_group"}] },
		        { element: [{ name: "prod_type"}] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept"}] },
		        { element: [{ name: "cust_prod_nm"}] },
		        { element: [{ name: "proj_no"}] },
		        { element: [{ name: "part_change"}] },
		        { element: [{ name: "wrnt_io"}] },
		        { element: [{ name: "endstat"}] },
		        { element: [{ name: "issue_type"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true, focus: true }
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
function processRestore(param) {

    var args = {
        targetid: "grdData_현황",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
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
                switch (param.from.page) {
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
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