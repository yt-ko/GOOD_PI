
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
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
				{ type: "PAGE", name: "문서분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}] },
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
        function start() { gw_job_process.UI(); }

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
                        { name: "folder_id", label: { title: "문서분류 :" },
                            editable: { type: "select", size: 7, maxlength: 20
                            	, data: { memory: "문서분류", unshift: [ { title: "전체", value: "" } ] } }
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
        var args = { targetid: "grdData_Main", query: "EDM_2010_M_1", title: "문서 분류 폴더",
            caption: true, width: 300, height: 500, show: true, selectable: true, pager: false,
            treegrid: { element: "folder_nm" }, //dynamic: true,
            element: [
				//{ header: "분류코드", name: "folder_id", width: 50, align: "center"},
				{ header: "분류폴더명", name: "folder_nm", width: 240, align: "left", format: { type: "label"} },
				{ header: "순번", name: "sort_seq", width: 30, align: "center" },
				{ name: "folder_id", hidden: true },
				{ name: "parent_id", hidden: true },
				{ name: "level_no", hidden: true }
//				{ header: "사용", name: "use_yn", width: 60, align: "center",
//				    format: { type: "checkbox", title: "", value: "1", offval: "0" }
//				},
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Form : Main ====
        var args = { targetid: "frmData_Main", query: "EDM_2010_M_2", type: "TABLE", title: "분류 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "folder_nm", validate: true },
            content: { width: { label: 60, field: 120 }, height: 25,
                row: [
                    { element: [
                            { header: true, value: "분류코드", format: { type: "label"} },
                            { name: "folder_id", editable: { type: "text", validate: { rule: "required" }} },
                            { header: true, value: "분류명칭", format: { type: "label"} },
                            { name: "folder_nm", editable: { type: "text", validate: { rule: "required" }} },
                            { header: true, value: "관리자", format: { type: "label"} },
                            { name: "mgr_emp", mask: "search"
                            	, editable: { type: "text", readonly: false, validate: { rule: "required", message: "폴더 관리자 선택" } } 
                            },
                            { header: true, value: "상위분류", format: { type: "label"} },
                            { name: "upfolder_id", mask: "search"
                            	, editable: { type: "text", readonly: false, validate: { rule: "required", message: "상위 폴더 선택" } } 
                            }
                        ]
                    },
                    { element: [
                            { header: true, value: "분류설명", format: { type: "label"} },
                            { name: "folder_desc", style: { colspan: 7 }
                            	, format: { type: "text", width: 500 }
                                , editable: { type: "text", width: 500, validate: { rule: "required" } }
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
                            { name: "upd_dt" }
                            , { name: "HiddenColumn", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
        ] } };
        gw_com_module.formCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_Sub", query: "EDM_2010_S_1", title: "접근 권한",
            caption: true, height: 150, show: true, selectable: true, dynamic: true, number: true,
            color: { row: true }, pager: false, 
            element: [
				{ header: "부서", name: "dept_nm", width: 150, align: "left", mask: "search"
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
				{ name: "folder_id", hidden: true },
				{ name: "auth_seq", hidden: true },
				{ name: "dept_id", hidden: true },
				{ name: "user_id", hidden: true },
				{ name: "color", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Detail ====
        var args = { targetid: "grdData_Detail", query: "EDM_2010_S_2", title: "알림메일 수신자",
            caption: true, height: 150, show: true, selectable: true, dynamic: true, number: true,
            color: { row: true }, pager: false,
            element: [
				{ header: "부서", name: "dept_nm", width: 150, align: "left"},
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
				{ name: "folder_id", hidden: true },
				{ name: "mail_seq", hidden: true },
				{ name: "dept_id", hidden: true },
				{ name: "user_id", hidden: true },
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

        // go next.
        gw_job_process.procedure();

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
            if (!checkManipulate({})) return;
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
            if (!checkUpdatable({})) return;
            processInsert({ sub: true });
        }
        //----------
        function click_lyrMenu_Sub_삭제() {
            v_global.process.handler = processRemove;
            if (!checkManipulate({})) return;
            checkRemovable({ sub: true });
        }
        //----------
        function click_lyrMenu_Detail_추가() {
            v_global.process.handler = processInsert;
            if (!checkUpdatable({})) return;
            processInsert({ detail: true });
        }
        //----------
        function click_lyrMenu_Detail_삭제() {
            v_global.process.handler = processRemove;
            if (!checkManipulate({})) return;
            checkRemovable({ detail: true });
        }
        //----------

        //==== Event Handler. : Grid Main ====
        var args = { targetid: "grdData_Main", grid: true, event: "rowselecting", handler: rowselecting_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function rowselecting_grdData_Main(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
            return checkUpdatable({});
        }
        //----------
        function rowselected_grdData_Main(ui) {
            v_global.process.prev.master = ui.row;
            processLink({});
        };
        function rowselected_grdData_Main(ui) { processLink({}); };

        //----------
        //----------
        function itemdblclick_grdData_Sub(ui) {

            switch (ui.element) {
                case "emp_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "DLG_EMPLOYEE",
                            title: "사원 검색",
                            width: 600,
                            height: 420,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "DLG_EMPLOYEE",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEmployee
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

        gw_com_module.startPage();
        v_global.process.handler = processRetrieve;
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
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
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({ sub: true });
    if (status == "initialize" || status == "create")
        processClear({});
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

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

//    if (param.key != undefined) {
//        $.each(param.key, function () {
//            if (this.QUERY == "SYS_2050_S_1")
//                this.QUERY = "SYS_2050_M_30xx";
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
	            { type: "GRID", id: "grdData_Sub" },
	            { type: "GRID", id: "grdData_Detail" }
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
	}
	else {
		gw_com_api.selectRow("grdData_Main", "reset");
		args = { targetid: "frmData_Main", edit: true, updatable: true,
	        data: [
	            { name: "use_yn", value: "1" }
	          , { name: "parent_id", value: gw_com_api.getValue("grdData_Main", "selected", "folder_id", true) }
	        ],
	        clear: [
			    { type: "GRID", id: "grdData_Sub" },
			    { type: "GRID", id: "grdData_Detail" }
		    ]
    	};
	}
	
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_Main",
        row: "selected",
        remove: true,
        clear: [
            {
                type: "FORM",
                id: "frmData_Main"
            },
            {
                type: "GRID",
                id: "grdData_Sub"
            }
        ]
    };
    gw_com_module.gridDelete(args);

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

    var args = {
        url: "COM",
        target: [
		    {
		        type: "GRID",
		        id: "grdData_Main",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "folder_id" }
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
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_Main"
            },
            {
                type: "GRID",
                id: "grdData_Sub"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_Main"
        });
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
                                    processClear({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
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
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm",
			                        param.data.dept_nm, (v_global.event.type == "GRID") ? true : false, true);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "pos_nm",
			                        param.data.pos_nm, (v_global.event.type == "GRID") ? true : false, true);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_nm",
			                        param.data.emp_nm, (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_no",
			                        param.data.emp_no, (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue: {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_EMPLOYEE":
                        { args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
                        } break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            { closeDialogue({ page: param.from.page });
            } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//