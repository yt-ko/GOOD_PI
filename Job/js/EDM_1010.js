
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {
        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = { request: [
				{ type: "PAGE", name: "장비군문", query: "dddw_deptdiv",
				    param: [{ argument: "arg_hcode", value: "ALL"}] },
				{ type: "PAGE", name: "팀분류", query: "dddw_edmfolder",
				    param: [{ argument: "arg_hcode", value: "2"}] },
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
                { type: "INLINE", name: "VIEW",
                    data: [
						{ title: "X-R Chart", value: "XR" },
						{ title: "I-MRI Chart", value: "IM" }
					]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
	        v_global.process.handler = processRetrieve;
	        processRetrieve({});
        }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu_Main", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Menu : Sub ====
        var args = { targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Menu : Detail ====
        var args = { targetid: "lyrMenu_Detail", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark", margin: 50,
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
                        { name: "folder_id", label: { title: "장비군 :" },
                            editable: { type: "select", size: 7, maxlength: 20
                            	, data: { memory: "장비군문", unshift: [ { title: "전체", value: "" } ] } }
                        },
                        { name: "folder_nm", label: { title: "분류명 :" },
                            editable: { type: "text", size: 20, maxlength: 40 }
                        }
				      ]
                    },
//                    { element: [
//                        { name: "chk_del", label: { title: "추가보기옵션 :" },
//                        	format: { type: "checkbox", title: "", value: "1", offval: "0" },
//                            editable: { type: "checkbox", title: "", value: "1", offval: "0" }
//                        }
//				      ]
//                    },
                    { align: "right", element: [
			            { name: "실행", value: "실행", act: true, format: { type: "button" } },
			            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				      ]
                    }
		] } };	// End of Option
		
        //----------
        gw_com_module.formCreate(args);
        //==== Grid : Main ====
        var args = { targetid: "grdData_Main", query: "EDM_1010_M_1", title: "KM Category",
            caption: true, width: 300, height: 500, show: true, selectable: true, pager: false,
            treegrid: { element: "folder_name" }, //dynamic: true,
            element: [
				//{ header: "분류코드", name: "folder_id", width: 50, align: "center"},
				{ header: "분류폴더명", name: "folder_name", width: 240, align: "left", format: { type: "label"} },
				{ header: "순번", name: "sort_seq", width: 30, align: "center" },
				{ name: "folder_id", hidden: true },
				{ name: "folder_nm", hidden: true },
				{ name: "parent_id", hidden: true },
				{ name: "level_no", hidden: true }
//				{ header: "사용", name: "use_yn", width: 60, align: "center",
//				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
//				},
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Form : Main ====
        var args = { targetid: "frmData_Main", query: "EDM_1010_M_2", type: "TABLE", title: "분류 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "folder_nm", validate: true },
            content: { width: { label: 60, field: 120 }, height: 25,
                row: [
                    { element: [
                            { header: true, value: "분류코드", format: { type: "label"} },
                            { name: "folder_id", editable: { type: "text" } },
                            { header: true, value: "분류명칭", format: { type: "label"} },
                            { name: "folder_nm", editable: { type: "text", validate: { rule: "required", message: "Category Name" }} },
                            { header: true, value: "상위분류", format: { type: "label"} },
                            { name: "parent_nm"/*, mask: "search"*/ , editable: { type: "text" } },
                            { header: true, value: "사용여부", format: { type: "label"} },
                            { name: "use_yn",
                            	format: { type: "checkbox", title: "", value: "1", offval: "0" },
                            	editable: { type: "checkbox", title: "", value: "1", offval: "0" } 
                            }
                        ]
                    },
                    { element: [
                            { header: true, value: "관리자1", format: { type: "label"} },
                            { name: "manager1_nm", mask: "search", display: true, editable: { type: "text" } },
                            { header: true, value: "관리자2", format: { type: "label"} },
                            { name: "manager2_nm", mask: "search", display: true, editable: { type: "text" } },
                            { header: true, value: "관리자3", format: { type: "label"} },
                            { name: "manager3_nm", mask: "search", display: true, editable: { type: "text" } },
                            { header: true, value: "관리자4", format: { type: "label"} },
                            { name: "manager4_nm", mask: "search", display: true, editable: { type: "text" } }
                        ]
                    },
                    { element: [
                            { header: true, value: "분류설명", format: { type: "label"} },
                            { name: "folder_desc", style: { colspan: 7 }
                            	, format: { type: "text", width: 500 }
                                , editable: { type: "text", width: 500 }
                            }
                        ]
                    },
                    { element: [
                            { header: true, value: "등록자", format: { type: "label"} },
                            { name: "ins_usr" },
                            { header: true, value: "등록일시", format: { type: "label"} },
                            { name: "ins_dt" },
                            { header: true, value: "수정자", format: { type: "label"} },
                            { name: "upd_usr" },
                            { header: true, value: "수정일시", format: { type: "label"} },
                            { name: "upd_dt" },
                            { name: "manager1_id", hidden: true, editable: { type: "hidden" } },
                            { name: "manager2_id", hidden: true, editable: { type: "hidden" } },
                            { name: "manager3_id", hidden: true, editable: { type: "hidden" } },
                            { name: "manager4_id", hidden: true, editable: { type: "hidden" } },
                            { name: "parent_id", hidden: true, editable: { type: "hidden" } },
                            { name: "sort_seq", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
        ] } };
        gw_com_module.formCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_Sub", query: "EDM_1010_S_1", title: "접근 권한",
            caption: true, height: 150, show: true, selectable: true, dynamic: true, number: true,
            editable: { multi: true, bind: "select", focus: "emp_nm", validate: true },
            color: { row: true }, pager: false, 
            element: [
				{ name: "folder_id", hidden: true, editable: { type: "hidden" } },
				{ header: "부서", name: "dept_nm", width: 180, align: "left", mask: "search"
				    , editable: { type: "text", validate: { message: "부서 선택" } }
				},
				{ header: "사원", name: "emp_nm", width: 100, align: "center", mask: "search"
				    , editable: { type: "text", validate: { message: "사원 선택" } }
				},
				{ header: "검색", name: "search_yn", width: 40, align: "center"
					, format: { type: "checkbox", title: "", value: 1, offval: 0 }
				    , editable: { type: "checkbox", title: "", value: 1, offval: 0 } 
				},
				{ header: "읽기", name: "read_yn", width: 40, align: "center"
					, format: { type: "checkbox", title: "", value: 1, offval: 0 }
				    , editable: { type: "checkbox", title: "", value: 1, offval: 0 } 
				},
				{ header: "쓰기", name: "edit_yn", width: 40, align: "center"
					, format: { type: "checkbox", title: "", value: 1, offval: 0 }
				    , editable: { type: "checkbox", title: "", value: 1, offval: 0 } 
				},
				{ name: "auth_seq", hidden: true, editable: { type: "hidden" } },
				{ name: "emp_no", hidden: true, editable: { type: "hidden" } },
				{ name: "dept_cd", hidden: true, editable: { type: "hidden" } },
				{ name: "color", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Detail ====
        var args = { targetid: "grdData_Detail", query: "EDM_1010_S_2", title: "알림메일 수신자",
            caption: true, height: 150, show: true, selectable: true, dynamic: true, number: true,
            editable: { multi: true, bind: "select", focus: "emp_nm", validate: true },
            color: { row: true }, pager: false,
            element: [
				{ name: "folder_id", hidden: true, editable: { type: "hidden" } },
				{ header: "부서", name: "dept_nm", width: 180, align: "left", mask: "search"
				    , editable: { type: "text", validate: { message: "부서 선택" } }
				},
				{ header: "사원", name: "emp_nm", width: 100, align: "center", mask: "search"
				    , editable: { type: "text", validate: { rule: "required", message: "사원 선택" } }
				},
				{ header: "등록", name: "insert_yn", width: 40, align: "center"
					, format: { type: "checkbox", title: "", value: 1, offval: 0 }
				    , editable: { type: "checkbox", title: "", value: 1, offval: 0 } 
				},
				{ header: "변경", name: "update_yn", width: 40, align: "center"
					, format: { type: "checkbox", title: "", value: 1, offval: 0 }
				    , editable: { type: "checkbox", title: "", value: 1, offval: 0 } 
				},
				{ header: "삭제", name: "delete_yn", width: 40, align: "center"
					, format: { type: "checkbox", title: "", value: 1, offval: 0 }
				    , editable: { type: "checkbox", title: "", value: 1, offval: 0 } 
				},
				{ name: "mail_seq", hidden: true, editable: { type: "hidden" } },
				{ name: "emp_no", hidden: true, editable: { type: "hidden" } },
				{ name: "dept_cd", hidden: true, editable: { type: "hidden" } },
				{ name: "color", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 }
              , { type: "FORM", id: "frmData_Main", offset: 8 }
              , { type: "GRID", id: "grdData_Sub", offset: 8 }
              , { type: "GRID", id: "grdData_Detail", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main & Option ====
        var args = { targetid: "lyrMenu_Main", element: "조회", event: "click", handler: click_lyrMenu_Main_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "추가", event: "click", handler: click_lyrMenu_Main_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: click_lyrMenu_Main_삭제 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: click_lyrMenu_Main_저장 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        
        //==== Event Handler. : Main & Option ====
        function click_lyrMenu_Main_조회() {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_Main_추가() {
            v_global.process.handler = processInsert;
            if (!checkUpdatable({})) return;
            processInsert({});
        }
        //----------
        function click_lyrMenu_Main_삭제() {
            v_global.process.handler = processRemove;
        	if (!checkSelectedRow({ main: true})) return;
            checkRemovable({});
        }
        //----------
        function click_lyrMenu_Main_저장() {
            closeOption({});
            processSave({});
        }
        //----------
        function click_lyrMenu_Main_닫기(ui) { checkClosable({}); }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_취소(ui) { closeOption({}); }

        //==== Button Click : Sub & Detail ====
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: click_lyrMenu_Sub_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: click_lyrMenu_Sub_삭제 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Detail", element: "추가", event: "click", handler: click_lyrMenu_Detail_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Detail", element: "삭제", event: "click", handler: click_lyrMenu_Detail_삭제 };
        gw_com_module.eventBind(args);

        //==== Event Handler. : Sub & Detail ====
        function click_lyrMenu_Sub_추가() {
            v_global.process.handler = processInsert;
            if (!checkSelectedRow({ main: true })) return;
            processInsert({ sub: true });
        }
        //----------
        function click_lyrMenu_Sub_삭제() {
            v_global.process.handler = processRemove;
        	if (!checkSelectedRow({ sub: true})) return;
            checkRemovable({ sub: true });
        }
        //----------
        function click_lyrMenu_Detail_추가() {
            v_global.process.handler = processInsert;
            if (!checkSelectedRow({ main: true })) return;
            processInsert({ detail: true });
        }
        //----------
        function click_lyrMenu_Detail_삭제() {
            v_global.process.handler = processRemove;
        	if (!checkSelectedRow({ detail: true})) return;
            checkRemovable({ detail: true });
        }
        //----------

        //==== Event Handler. : Grid Main ====
        var args = { targetid: "grdData_Main", grid: true, event: "rowselecting", handler: rowselecting_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        //----------
        function rowselecting_grdData_Main(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
            return checkUpdatable({});
        }
        function rowselected_grdData_Main(ui) {
            v_global.process.prev.master = ui.row;
            processLink({});
        };
        
        //==== Event Handler. : Grid Search Item ====
        var args = { targetid: "frmData_Main", grid: false, event: "itemdblclick", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_Main", grid: false, event: "itemkeyenter", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "itemdblclick", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "itemkeyenter", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Detail", grid: true, event: "itemdblclick", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Detail", grid: true, event: "itemkeyenter", handler: itemdblclick_frmData_Main };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function itemdblclick_frmData_Main(ui) { popupFindItem(ui); }

        // startup process.
        gw_com_module.startPage();

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- Popup Find Window for select items
function popupFindItem(ui) {

    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    switch (ui.element) {
        case "emp_nm":
        case "manager1_nm":
        case "manager2_nm":
        case "manager3_nm":
        case "manager4_nm": 
            {
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
        case "dept_nm":
            {
                var args = { type: "PAGE", page: "DLG_TEAM", title: "부서 선택", width: 500, height: 450, open: true };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = { page: "DLG_TEAM",
                        param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            } break;
        case "supp_nm":
            {
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
function checkCRUD(param) {

	if (param.sub)
    	return gw_com_api.getCRUD("grdData_Sub", "selected", true);
	else if (param.detail)
    	return gw_com_api.getCRUD("grdData_Detail", "selected", true);
    else
    	return gw_com_api.getCRUD("grdData_Main", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;

}
//----------
function checkSelectedRow(param) {

    if ((param.main && gw_com_api.getSelectedRow("grdData_Main") == null) || 
    	(param.sub && gw_com_api.getSelectedRow("grdData_Sub") == null) || 
    	(param.detail && gw_com_api.getSelectedRow("grdData_Detail") == null) )
    {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;
}
//----------
function checkUpdatable(param) {

    closeOption({});
    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_Detail" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

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

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

//    if (param.key != undefined) {
//        $.each(param.key, function () {
//            if (this.QUERY == "EDM_1010_M_2")
//                this.QUERY = "EDM_1010_M_1";
//        });
//    }
    var args = { key: param.key,
    	source: { type: "FORM", id: "frmOption", hide: true, 
            element: [
//				{ name: "ymd_fr", argument: "arg_ymd_fr" },
//				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "folder_id", argument: "arg_folder_id" },
				{ name: "folder_nm", argument: "arg_folder_nm" }
			],
            remark: [
//	            { element: [ { name: "ymd_fr" }, { name: "ymd_to" } ], infix: "~" },
	            { element: [ { name: "folder_id"}] },
	            { element: [ { name: "folder_nm"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", select: true, option: "TREE" }
		],
        clear: [
            { type: "FORM", id: "frmData_Main" },
            { type: "FORM", id: "grdData_Sub" },
			{ type: "GRID", id: "grdData_Detail" }
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

	var args = { key: param.key
            , source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
                element: [ { name: "folder_id", argument: "arg_folder_id" } ]
            }
            , target: [
	            { type: "FORM", id: "frmData_Main" },
	            { type: "GRID", id: "grdData_Sub", select: true },
	            { type: "GRID", id: "grdData_Detail", select: true }
            ]
        };
    gw_com_module.objRetrieve(args);
    
}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_Main", v_global.process.current.master, true, false);




}
//----------
function processInsert(param) {
	var args = {};
	if (param.sub) {
		args = { targetid: "grdData_Sub", edit: true, updatable: true,
	        data: [
	            { name: "search_yn", value: "1" }
	          , { name: "read_yn", value: "1" }
	          , { name: "edit_yn", value: "0" }
	          , { name: "folder_id", value: gw_com_api.getValue("grdData_Main", "selected", "folder_id", true) }
	        ]
    	};
    	gw_com_module.gridInsert(args);

	}
	else if (param.detail) {
		args = { targetid: "grdData_Detail", edit: true, updatable: true,
	        data: [
	            { name: "insert_yn", value: "1" }
	          , { name: "update_yn", value: "1" }
	          , { name: "delete_yn", value: "1" }
	          , { name: "folder_id", value: gw_com_api.getValue("grdData_Main", "selected", "folder_id", true) }
	        ]
    	};
        gw_com_module.gridInsert(args);
	}
	else {
		var ParentId = gw_com_api.getValue("grdData_Main", "selected", "folder_id", true);
		var ParentNm = gw_com_api.getValue("grdData_Main", "selected", "folder_nm", true);
		gw_com_api.selectRow("grdData_Main", "reset");
		args = { targetid: "frmData_Main", edit: true, updatable: true,
	        data: [
	            { name: "use_yn", value: "1" }
	          , { name: "parent_id", value: ParentId }
	          , { name: "parent_nm", value: ParentNm }
	        ],
	        clear: [
			    { type: "GRID", id: "grdData_Sub" },
			    { type: "GRID", id: "grdData_Detail" }
		    ]
    	};
	    gw_com_module.formInsert(args);
	}
	

}
//----------
function processDelete(param) {

	var args = {};
	if (param.sub) {
		args = { targetid: "grdData_Sub", row: "selected", remove: true,
	        clear: [
			    { type: "FORM", id: "frmData_Detail" }
		    ]
    	};
    	gw_com_module.gridDelete(args);

	}
	else if (param.detail) {
		args = { targetid: "grdData_Detail", row: "selected", remove: true
    	};
        gw_com_module.gridDelete(args);
	}
	else {
		args = { targetid: "grdData_Main", row: "selected", remove: true,
	        clear: [
			    { type: "FORM", id: "frmData_Main" },
			    { type: "GRID", id: "grdData_Sub" }
		    ]
    	};
	    gw_com_module.gridDelete(args);
	}

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
			{ type: "GRID", id: "grdData_Sub" },
			{ type: "GRID", id: "grdData_Detail" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);
}
//----------
function processRemove(param) {

    var args = {};
    if (param.sub) {
        args = { url: "COM",
            target: [
		        { type: "GRID", id: "grdData_Sub",
		            key: [ { row: "selected", element: [ { name: "folder_id" }, { name: "auth_seq" } ] } ]
		        }
	        ]
        };
    }
    else if (param.detail) {
        args = { url: "COM",
            target: [
		        { type: "GRID", id: "grdData_Detail",
		            key: [ { row: "selected", element: [ { name: "folder_id" }, { name: "mail_seq" } ] } ]
		        }
	        ]
        };
    }
	else {
    	var FolderId = gw_com_api.getValue("grdData_Main", "selected", "folder_id", true);
        var args = { url: "COM", procedure: "PROC_EDM_FOLDER_DML", nomessage: true,
            input: [
	            { name: "folder_id", value: FolderId, type: "varchar" },
	            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        	],
            output: [ { name: "r_value", type: "int" }, { name: "message", type: "varchar" } ],
            handler: { success: completeRemove, param: param }
        };
        gw_com_module.callProcedure(args);
        return;
    }
    args.handler = { success: successRemove, param: param };
    gw_com_module.objRemove(args);
    
}
//----------
function completeRemove(response, param) {

    gw_com_api.messageBox([ { text: response.VALUE[1] }
    	], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    	{ handler: successRemove, response: response, param: {} });

}
//----------
function successRemove(response, param) { 
    if (param.sub || param.detail)
        processDelete(param);
    else if(response.VALUE[0] != -1)
        processRetrieve({});
}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_Detail" }
        ]
    };
    if (param.master) {
        args.target.unshift({ type: "GRID", id: "grdData_Main" });
    }
    gw_com_module.objClear(args);

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
    if (status == "initialize" || status == "create")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: {
                gw_com_module.streamInterface(param);
            } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
//                    param.to = { type: "POPUP", page: param.data.page };
//                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave: {
                        if (param.data.result == "YES") processSave({});
                        else {
                            var status = checkCRUD({});
                            if (status == "initialize" || status == "create") processClear({});
                            if (v_global.process.handler != null) v_global.process.handler({});
                        }
                    } break;
                    case gw_com_api.v_Message.msg_confirmRemove: { 
                    		if (param.data.result == "YES") processRemove(param.data.arg); 
                    } break;
                    case gw_com_api.v_Message.msg_informSaved: {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
                    case gw_com_api.v_Message.msg_informRemoved: {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
	                case gw_com_api.v_Message.msg_informBatched: { 
	                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
	                } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
        	if ( v_global.event.element.substr(0,7) == "manager" ) {
        		var ColId = v_global.event.element.substr(0,8) + "_id";
                gw_com_api.setValue(v_global.event.object, v_global.event.row, ColId, param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
        	else if ( v_global.event.element == "emp_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_no", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedTeam: {
        	if ( v_global.event.element == "emp_nm" ){
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_nm", "",
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_no", "",
			                        (v_global.event.type == "GRID") ? true : false);
            }
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };
            switch (param.from.page) {
                case "DLG_TEAM": { 
                    args.ID = gw_com_api.v_Stream.msg_selectTeam; 
                } break;
                case "DLG_EMPLOYEE": { 
                    args.ID = gw_com_api.v_Stream.msg_selectEmployee; 
                } break;
            }
            gw_com_module.streamInterface(args);
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//