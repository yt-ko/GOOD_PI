//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 현상분류 관리
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

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();

	        gw_com_module.startPage();
	        processRetrieve({ object: "master" });
        }

    },  // End of gw_job_process.ready

    // manage UI. (design section)
    UI: function () {

        //==== Main Button : 조회, 저장, 닫기
        var args = { targetid: "lyrMenu", type: "FREE", element: [ 
            	{ name: "조회", value: "새로고침", act: true }
            	, { name: "저장", value: "저장", icon: "저장" }
            	, { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //==== Sub1 Button : 추가, 삭제
        var args = { targetid: "lyrMenu_1", type: "FREE", element: [ 
        		{ name: "추가", value: "추가" }
        	  , { name: "삭제", value: "삭제" } 
            ]
        };
        gw_com_module.buttonMenu(args);
        //==== Sub2 Button : 추가, 삭제
        var args = { targetid: "lyrMenu_2", type: "FREE", element: [ 
        		{ name: "추가", value: "추가" }
        	  , { name: "삭제", value: "삭제" } 
            ]
        };
        gw_com_module.buttonMenu(args);
        //==== Sub3 Button : 추가, 삭제
        var args = { targetid: "lyrMenu_3", type: "FREE", element: [ 
        		{ name: "추가", value: "추가" }
        	  , { name: "삭제", value: "삭제" } 
            ]
        };
        gw_com_module.buttonMenu(args);
        //==== Sub4 Button : 추가, 삭제
        var args = { targetid: "lyrMenu_4", type: "FREE", element: [ 
        		{ name: "추가", value: "추가" }
        	  , { name: "삭제", value: "삭제" } 
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Grid 1 : 대분류 ====
        var args = { targetid: "grdData_1", query: "EOM_1110_S_1", title: "대분류"
            , caption: true, width: 500, height: 220, show: true, selectable: true
            , editable: { master: true, bind: "select", focus: "cname", validate: true }
            , element: [ 
		        { header: "순번", name: "sort_seq", width: 40, align: "center"
		        	, editable: { type: "text", validate: { rule: "required" }  }
		        },
            	{ header: "상위코드", name: "bcode", width: 80, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "코드", name: "ccode", width: 100, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "명칭", name: "cname", width: 180, align: "left"
            		, editable: { type: "text", validate: { rule: "required" } } 
            	},
		        { header: "사용", name: "use_yn", width: 40, align: "center"
		        	, format: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        	, editable: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        },
		        { name: "hdcode", hidden: true, editable: { type: "hidden" } },
		        { name: "level_no", hidden: true, editable: { type: "hidden" } },
		        { name: "dvalue", hidden: true, editable: { type: "hidden" } },
		        { name: "cvalue", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid 2 : 중분류 ====
        var args = { targetid: "grdData_2", query: "EOM_1110_S_1", title: "중분류"
            , caption: true, width: 500, height: 250, show: true, selectable: true
            , editable: { master: true, bind: "select", focus: "cname", validate: true }
            , element: [ 
		        { header: "순번", name: "sort_seq", width: 40, align: "center"
		        	, editable: { type: "text", validate: { rule: "required" }  }
		        },
            	{ header: "상위코드", name: "bcode", width: 80, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "코드", name: "ccode", width: 100, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "명칭", name: "cname", width: 180, align: "left"
            		, editable: { type: "text", validate: { rule: "required" } } 
            	},
		        { header: "사용", name: "use_yn", width: 40, align: "center"
		        	, format: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        	, editable: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        },
		        { name: "hdcode", hidden: true, editable: { type: "hidden" } },
		        { name: "level_no", hidden: true, editable: { type: "hidden" } },
		        { name: "dvalue", hidden: true, editable: { type: "hidden" } },
		        { name: "cvalue", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid 3 : 소분류 ====
        var args = { targetid: "grdData_3", query: "EOM_1110_S_1", title: "소분류"
            , caption: true, width: 500, height: 220, show: true, selectable: true
            , editable: { master: true, bind: "select", focus: "cname", validate: true }
            , element: [ 
		        { header: "순번", name: "sort_seq", width: 40, align: "center"
		        	, editable: { type: "text", validate: { rule: "required" }  }
		        },
            	{ header: "상위코드", name: "bcode", width: 80, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "코드", name: "ccode", width: 100, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "명칭", name: "cname", width: 180, align: "left"
            		, editable: { type: "text", validate: { rule: "required" } } 
            	},
		        { header: "사용", name: "use_yn", width: 40, align: "center"
		        	, format: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        	, editable: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        },
		        { name: "hdcode", hidden: true, editable: { type: "hidden" } },
		        { name: "level_no", hidden: true, editable: { type: "hidden" } },
		        { name: "dvalue", hidden: true, editable: { type: "hidden" } },
		        { name: "cvalue", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid 4 : 세분류 ====
        var args = { targetid: "grdData_4", query: "EOM_1110_S_1", title: "상세분류"
            , caption: true, width: 500, height: 250, show: true, selectable: true
            , editable: { bind: "select", focus: "cname", validate: true }
            , element: [ 
		        { header: "순번", name: "sort_seq", width: 40, align: "center"
		        	, editable: { type: "text", validate: { rule: "required" }  }
		        },
            	{ header: "상위코드", name: "bcode", width: 80, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "코드", name: "ccode", width: 100, align: "center"
            		, editable: { bind: "create", type: "text", validate: { rule: "required" } } 
            	},
            	{ header: "명칭", name: "cname", width: 180, align: "left"
            		, editable: { type: "text", validate: { rule: "required" } } 
            	},
		        { header: "사용", name: "use_yn", width: 40, align: "center"
		        	, format: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        	, editable: { type: "checkbox", title: "", value: "1", offval: "0"  }
		        },
		        { name: "hdcode", hidden: true, editable: { type: "hidden" } },
		        { name: "level_no", hidden: true, editable: { type: "hidden" } },
		        { name: "dvalue", hidden: true, editable: { type: "hidden" } },
		        { name: "cvalue", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);


        //==== Resize Objects
        var args = {
            target: [
                { type: "GRID", id: "grdData_1", offset: 8 }
                , { type: "GRID", id: "grdData_2", offset: 8 }
                , { type: "GRID", id: "grdData_3", offset: 8 }
                , { type: "GRID", id: "grdData_4", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },   // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process : Define Events & Method
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //==== Button Click : Sub ====
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: checkRemovable };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: checkRemovable };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: checkRemovable };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_4", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_4", element: "삭제", event: "click", handler: checkRemovable };
        gw_com_module.eventBind(args);

        //==== Grid Events
        var args = { targetid: "grdData_1", grid: true, event: "rowselected", handler: processRowSelected };
        gw_com_module.eventBind(args);
        //var args = { targetid: "grdData_1", grid: true, event: "rowselecting", handler: processRowSelecting };
        //gw_com_module.eventBind(args);
        var args = { targetid: "grdData_2", grid: true, event: "rowselected", handler: processRowSelected };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_3", grid: true, event: "rowselected", handler: processRowSelected };
        gw_com_module.eventBind(args);

    }   // End of gw_job_process.procedure

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkCRUD(param) {
	var sObjectId = param.object;
	
    if (param.detail)
        return gw_com_api.getCRUD("grdData_3", "selected", true);
    else if (param.sub)
        return gw_com_api.getCRUD("grdData_2", "selected", true);
    else
        return ((gw_com_api.getSelectedRow("grdData_1") == null) ? "none" : "");

}
//----------
function checkUpdatable(param) {

	var CheckReference = false;
	
    var args = {
    	
        target: [
            { type: "GRID", id: "grdData_1", refer: (param.sub || param.detail) ? true : false }
            , { type: "GRID", id: "grdData_2", refer: (param.sub || param.detail) ? true : false }
            , { type: "GRID", id: "grdData_3", refer: (param.detail) ? true : false }
            , { type: "GRID", id: "grdData_4" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

	// Set current Object
	var sCurObjId = "";
	if (param.object == "lyrMenu_1") sCurObjId = "grdData_1";
	else if (param.object == "lyrMenu_2") sCurObjId = "grdData_2";
	else if (param.object == "lyrMenu_3") sCurObjId = "grdData_3";
	else if (param.object == "lyrMenu_4") sCurObjId = "grdData_4";
	else sCurObjId = param.object;

    var status = checkCRUD( { object: sCurObjId } );
    if (status == "none") processDelete(param);
	else if (status == "initialize" || status == "create") gw_com_api.messageBox([ { text: "NOMASTER" } ]);
	else gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", { object: sCurObjId });

}
//----------
function viewOption() {
    //var args = { target: [ { id: "frmOption", focus: true } ] };
    //gw_com_module.objToggle(args);
    processRetrieve( { object: "master" } );
}
function processRowSelecting(param) {
}
//----------
function processRowSelected(param) {
	processRetrieve(param);
}
//----------
function processRetrieve(param) {

	// Set Arguments for each Objects
	var sObjId = param.object;
	var sTargetObj = "";

	if ( sObjId == "grdData_1" ) sTargetObj = "grdData_2";
	else if ( sObjId == "grdData_2" ) sTargetObj = "grdData_3";
	else if (sObjId == "grdData_3") sTargetObj = "grdData_4";
	else { sObjId = "master"; sTargetObj = "grdData_1"; }

	var sHDcode = "EOM110-30";
	var nLevelNo = sTargetObj.substr( 8, 1 );
	var sBcode = "30";
	if (sObjId.length > 8 && sObjId.substr(0, 8) == "grdData_") {
		sBcode = gw_com_api.getValue( sObjId, "selected", "ccode", true );
		if ( sBcode == null ) return;
	}

    var args = { key: param.key,
        source: { type: "INLINE", 
            argument: [ { name: "arg_hdcode", value: sHDcode }, { name: "arg_level", value: nLevelNo }, { name: "arg_bcode", value: sBcode } ]
        },
		target: [{ type: "GRID", id: sTargetObj, select: true }]
    };

    if (sTargetObj == "grdData_1"){
	    args.clear = [{ type: "GRID", id: "grdData_2" }, { type: "GRID", id: "grdData_3" }, { type: "GRID", id: "grdData_4" }];
    }
    else if (sTargetObj == "grdData_2"){
	    args.clear = [{ type: "GRID", id: "grdData_3" }, { type: "GRID", id: "grdData_4" }];
    }
    else if (sTargetObj == "grdData_3"){
	    args.clear = [{ type: "GRID", id: "grdData_4" }];
    }
    // Call Retrieve
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

	// Set current Object
	var sCurObjId = "";
	if (param.object == "lyrMenu_1") sCurObjId = "grdData_1";
	else if (param.object == "lyrMenu_2") sCurObjId = "grdData_2";
	else if (param.object == "lyrMenu_3") sCurObjId = "grdData_3";
	else if (param.object == "lyrMenu_4") sCurObjId = "grdData_4";
	else sCurObjId = param.object;
		
	// Check existing of Master data
	var sMstObjId = "";
	if (sCurObjId == "grdData_2") sMstObjId = "grdData_1";
	else if (sCurObjId == "grdData_3") sMstObjId = "grdData_2";
	else if (sCurObjId == "grdData_4") sMstObjId = "grdData_3";
		
    if (sMstObjId != "" && gw_com_api.getSelectedRow(sMstObjId) == null){
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return;
    }
    
	var sHDcode = "EOM110-30";
	var nLevelNo = 1;
	var sBcode = "30";
	if ( sMstObjId != "" ){
		sHDcode = gw_com_api.getValue( sMstObjId, "selected", "hdcode", true );
		nLevelNo = gw_com_api.getValue( sMstObjId, "selected", "level_no", true ) + 1;
		sBcode = gw_com_api.getValue( sMstObjId, "selected", "ccode", true );
	}
	var sCcode = "new"; var nSeq = 0;

    var args = { targetid: sCurObjId, updatable: true, edit: true };
    args.data = [{ name: "hdcode", value: sHDcode }, { name: "level_no", value: nLevelNo }, { name: "bcode", value: sBcode }
		, { name: "ccode", value: sCcode }, { name: "sort_seq", value: nSeq }];

	// Call Insert
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

	var sCurObjId = param.object;
    var args = { row: "selected", remove: true, targetid: sCurObjId};
    
	if (sCurObjId == "grdData_1"){
        args.clear = [ { type: "GRID", id: "grdData_2" }, { type: "GRID", id: "grdData_3" }, { type: "GRID", id: "grdData_4" } ];
	}
	else if (sCurObjId == "grdData_2"){
        args.clear = [ { type: "GRID", id: "grdData_3" }, { type: "GRID", id: "grdData_4" } ];
	}
	else if (sCurObjId == "grdData_3"){
        args.clear = [ { type: "GRID", id: "grdData_4" } ];
	}
	else if (sCurObjId != "grdData_4") return;
	
	// Call Delete		
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_1" },
            { type: "GRID", id: "grdData_2" },
			{ type: "GRID", id: "grdData_3" },
			{ type: "GRID", id: "grdData_4" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var obj = param.object;
    var args = {
        url: "COM",
        procedure: "PROC_DELETE_HDCODE",
        nomessage: true,
        input: [
            { name: "hdcode", value: gw_com_api.getValue(obj, "selected", "hdcode", true), type: "varchar" },
            { name: "level_no", value: gw_com_api.getValue(obj, "selected", "level_no", true), type: "int" },
            { name: "bcode", value: gw_com_api.getValue(obj, "selected", "bcode", true), type: "varchar" },
            { name: "ccode", value: gw_com_api.getValue(obj, "selected", "ccode", true), type: "varchar" },
            { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn", type: "int" },
            { name: "msg", type: "varchar" }
        ],
        handler: {
            success: completeRemove, param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//---------- 저장하지 않을 경우 Data 복원
function processRestore(param) {

    var args = {};
    if (param.detail) {
        args = {
            targetid: "grdData_3", row: v_global.process.prev.detail
        };
        gw_com_module.gridRestore(args);
    }
    else if (param.sub) {
        args = {
            targetid: "grdData_2", row: v_global.process.prev.sub
        };
        gw_com_module.gridRestore(args);
    }

}
//----------
function processClose(param) {

    if (!checkUpdatable({})) return;

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

    var msg = response.VALUE[1];
    if (msg == undefined || msg == "") msg = "SUCCESS";

    gw_com_api.messageBox([
        { text: msg }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response, param: param });

}
//----------
function successSave(response, param) {
    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processRetrieve({ key: response });
    else
        processRowSelected({ key: response });
/*
    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRowSelected({ key: response });
    else {
        status = checkCRUD({ sub: true });
        if (status == "create" || status == "update")
            processRowSelected({ sub: true, key: response });
        else
            processRowSelected({ detail: true, key: response });
    }
*/
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
            { if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) { case gw_com_api.v_Message.msg_confirmSave:
                        { if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else { var status = checkCRUD(param.data.arg);
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
                        { if (param.data.result == "YES")
                                processRemove(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break; }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//