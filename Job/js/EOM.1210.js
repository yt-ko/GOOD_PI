//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 관리
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

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = { request: [
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 추가, 삭제, 저장, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가", icon: "추가" },
				{ name: "삭제", value: "삭제", icon: "삭제" },
				{ name: "저장", value: "저장", icon: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        //==== Main Menu : 추가, 삭제
        var args = { targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가", icon: "추가" },
				{ name: "삭제", value: "삭제", icon: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        //==== Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "astat", validate: true },
            content: { row: [
                    { element: [
                        { name: "eq_no", label: { title: "호기 :" },
                            editable: { type: "text", size: 12, maxlength: 50 }
                        },
                        { name: "eq_nm", label: { title: "설비명 :" },
                            editable: { type: "text", size: 12, maxlength: 60 }
                        }
				        ]
                    },
                    { element: [
			            { name: "실행", value: "실행", act: true, format: { type: "button" } },
			            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ], align: "right"
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Grid : 연구소 설비
        var args = { targetid: "grdData_Main", query: "EOM_1210_M_1", title: "연구소 설비",
            show: true, height: 500, width: 340, caption: true, pager: true, dynamic: true,
            selectable: true, multi: false, key: false, number: true, checkrow: false,
            editable: { master: true, multi: false, bind: "select", focus: "eq_no", validate: true },
            element: [
				{ header: "설비코드", name: "eq_cd", width: 80, align: "center", editable: { bind: "create", type: "text" } },
				{ header: "호기", name: "eq_no", width: 100, align: "center", editable: { type: "text" } },
				{ header: "설비명", name: "eq_nm", width: 100, align: "center", editable: { type: "text" } },
				{ header: "사용", name: "use_yn", width: 40, align: "center"
                    , format: { type: "checkbox", value: 1, offval: 0 }
                    , editable: { type: "checkbox", value: 1, offval: 0 }
				}
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Sub Grid : 진행 이력
        var args = { targetid: "grdData_Sub", query: "EOM_1210_S_1", title: "설비 모듈",
            show: true, height: 460, width: 570, caption: true, pager: true, dynamic: true,
            selectable: true, multi: false, key: false, number: true, checkrow: false,
            editable: { multi: false, bind: "select", focus: "eq_module", validate: true },
            element: [
				{ header: "Module", name: "eq_module", width: 60, align: "center", editable: { bind: "create", type: "text" } },
				{ header: "Project", name: "proj_no", width: 80, align: "center", editable: { type: "text" } },
				{ header: "담당부서", name: "eq_dept_nm", width: 100, align: "left", mask: "search", display: true,
				    editable: { type: "text" }
				},
				{ header: "담당자", name: "eq_user_nm", width: 80, align: "left", mask: "search", display: true,
				    editable: { type: "text" }
				},
				{ header: "사용", name: "use_yn", width: 40, align: "center"
                    , format: { type: "checkbox", value: 1, offval: 0 }
                    , editable: { type: "checkbox", value: 1, offval: 0 }
				},
				{ header: "비고", name: "module_desc", width: 200, align: "left", editable: { type: "text" } },
				{ name: "eq_dept", hidden: true, editable: { type: "hidden" } },
				{ name: "eq_user", hidden: true, editable: { type: "hidden" } },
				{ name: "eq_cd", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 }
               ,{ type: "GRID", id: "grdData_Sub", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 삭제, 저장, 닫기
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //==== Button Click : Sub 추가, 삭제
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        
        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "itemdblclick", handler: popupFindItem };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "itemkeyenter", handler: popupFindItem };
        gw_com_module.eventBind(args);

        //----------
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- Popup Find Window for select items
function popupFindItem(ui){
	
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;
    
    switch (ui.element) { 
        case "eq_dept_nm": {
                var args = { type: "PAGE", page: "DLG_TEAM", title: "부서 선택", width: 500, height: 450, open: true };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "DLG_TEAM",
                        param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } break;
        case "user_nm": 
        case "eq_user_nm": {
                var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택"
                	, width: 700, height: 450, locate: ["center", "top"], open: true 
            	};
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "DLG_EMPLOYEE",
                        param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } break;
        case "supp_nm": {
                var args = { type: "PAGE", page: "w_find_supplier", title: "협력사 선택", width: 500, height: 450, open: true };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "w_find_supplier",
                        param: { ID: gw_com_api.v_Stream.msg_selectedSupplier }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } break;
        default: return;
    }
}
//----------
function viewOption(param) {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//----------
function processInsert( param ) {
	var sTargetId = "grdData_Main";
	if (param.object == "lyrMenu_Sub") sTargetId = "grdData_Sub" ;
	
    var args = { targetid: sTargetId, edit: true, updatable: true };

	if (param.object == "lyrMenu_Sub"){
		args.data = [
			{ name: "eq_cd", value: gw_com_api.getValue("grdData_Main", "selected", "eq_cd", true) }
		] ;
	}
    gw_com_module.gridInsert(args);
}
//----------
function processSave( param ) {
	
    var args = { url: "COM",
        target: [
            { type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_Sub" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {
    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "eq_cd") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 
            }
        });
    });
}
//----------
function processDelete(param) {
	var sTargetId = "grdData_Main";
	if (param.object == "lyrMenu_Sub") sTargetId = "grdData_Sub" ;
	
    var args = { targetid: sTargetId, row: "selected" }
    gw_com_module.gridDelete(args);
	
}
//----------
function processRetrieve(param) {

	// Validate Inupt Options
    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

	// Retrieve 
    var args = { key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "eq_nm", argument: "arg_eq_nm" },
				{ name: "eq_no", argument: "arg_eq_no" }
			],
            remark: [
		        { element: [{ name: "eq_no"}] },
		        { element: [{ name: "eq_nm"}] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
	    ]
	    ,
        clear: [
			{ type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = { key: param.key,
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "eq_cd", argument: "arg_eq_cd" }
			]
        },
        target: [
            { type: "GRID", id: "grdData_Sub", focus: true, select: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") processSave(param.data.arg);
                            else { var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processDelete({});
                                else if (status == "update") processRestore({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
			    }   // End of switch (param.data.ID)
			} break;    // End of case gw_com_api.v_Stream.msg_resultMessage
        case gw_com_api.v_Stream.msg_selectedTeam: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "eq_dept", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "eq_dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
        	if ( v_global.event.element == "eq_user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "eq_user", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "eq_user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "eq_dept", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "eq_dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
            closeDialogue({ page: param.from.page, focus: true });
        } break;
//        case gw_com_api.v_Stream.msg_retrieve:
//            {
//                processRetrieve({ key: param.data.key });
//            }
//            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = { targetid: "grdData_Main", row: v_global.event.row }
                gw_com_module.gridDelete(args);
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