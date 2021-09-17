//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 가입고 현황
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        // Start Process : Create UI & Event
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Main Menu : 조회, 추가, 수정, 삭제
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "추가", value: "추가", act: true },
                { name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        //==== Main Grid : 바코드 정보
        var args = {
            targetid: "grdData_Main", query: "SRM_4350_M_1", title: "품목 정보", caption: true,
            width: 970, height: 442, show: true, selectable: true, number: true, dynamic: true,
            element: [
				{ header: "바코드", name: "barcode", width: 90, align: "center" },
				{ header: "품번", name: "item_cd", width: 90, align: "center" },
				{ header: "품명", name: "item_nm", width: 180, align: "left" },
				{ header: "규격", name: "item_spec", width: 130, align: "left" },
				{ header: "Tracking", name: "track_no", width: 90, align: "center" },
				{ header: "현재고", name: "issue_qty", width: 50, align: "center" },
				{ header: "단위", name: "unit", width: 50, align: "center" },
                { header: "협력사", name: "supp_nm", width: 110, align: "left" },
                { name: "supp_cd", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Sub Grid : 외부 바코드
        var args = { targetid: "grdData_Sub", query: "SRM_4350_S_1", title: "외부 바코드 정보", caption: true,
            height: 442, show: true, selectable: true, number: true, dynamic: true, //multi: true, checkrow: true,
            editable: { multi: true, bind: "select", focus: "exbarcode", validate: true },
            element: [
				{ header: "외부바코드", name: "exbarcode", width: 120, align: "left", editable: { type: "hidden" } },
                { header: "내부바코드", name: "barcode", width: 90, align: "center", editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 삭제 ====
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //----------

        //==== startup process.
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- Retrieve
function processRetrieve(param) {
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_barcode", value: gw_com_api.getValue("grdData_Main", "selected", "barcode", true) },
                { name: "arg_exbarcode", value: "%" }
            ]
        }, target: [
            { type: "GRID", id: "grdData_Sub", select: true }
        ]
    };

    gw_com_module.objRetrieve(args);
}
//---------- Insert
function processInsert( param ) {

    // 품목 선택 창 열기
    var args = {
        type: "PAGE", page: "SRM_4351", title: "바코드 입력"
	    		, width: 400, height: 160, locate: ["right", "bottom"], open: true
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: gw_com_api.v_Stream.msg_selectPart_SCM,
            data: { barcode: gw_com_api.getValue("grdData_Main", "selected", "barcode", true) }
        }
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function processLink(param) {
    var bModify = gw_com_api.getUpdatable("grdData_Sub", true);
    if (bModify) {
        gw_com_api.messageBox([{ text: "변경된 자료가 있습니다." }, {text: "자료를 저장하시기 바랍니다."}], 300);
        // mult select row 설정 시 delete 오류발생하여 주석처리...ㅜㅜ
        //gw_com_api.selectRow("grdData_Sub", "reset");
        //for (var i = 1; i <= gw_com_api.getRowCount("grdData_Sub") ; i++) {
        //    if (gw_com_api.getValue("grdData_Main", "selected", "barcode", true) == gw_com_api.getValue("grdData_Sub", i, "barcode", true)) {
        //        gw_com_api.selectRow("grdData_Sub", i, true, true);
        //    }
        //}
    } else {
        processRetrieve({});
    }
}
//----------
function processDelete(ui) {
    var args = { targetid: "grdData_Sub", row: "selected", select: true }
    gw_com_module.gridDelete(args);
}
//---------- Start Saving : processSave => successSave
function processSave(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_Sub" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {
    // grdData_Sub Status Reset
    //for (var i = 1; i <= gw_com_api.getRowCount("grdData_Sub") ; i++) {
    //    gw_com_api.setCRUD("grdData_Sub", i, "R", true);
    //}

    processRetrieve({});
}
//---------- Closing Process
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
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
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmSave: {
                    if (param.data.result == "YES") processEdit(param.data.arg);
                    else if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informSaved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: { 
                    if (param.data.result == "YES") processRemove(param.data.arg); 
                } break;
                case gw_com_api.v_Message.msg_informRemoved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
		    }   // End of switch (param.data.ID)
		} break;    // End of case gw_com_api.v_Stream.msg_resultMessage
        case gw_com_api.v_Stream.msg_retrieve: {
                processRetrieve({ key: param.data.key });
        } break;
        case gw_com_api.v_Stream.msg_remove: {
                var args = { targetid: "grdData_Sub", row: v_global.event.row }
                gw_com_module.gridDelete(args);
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {   
            	var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "SRM_4351": {
                        args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                    } break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
        	closeDialogue({ page: param.from.page }); 
        } break;
        case gw_com_api.v_Stream.msg_selectedPart_SCM: {
            var args = "";
            if (param.SUBID == "내부") {
                $.each(param.data.rows, function () {
                    var nChkRow = gw_com_api.getFindRow("grdData_Main", "barcode", this.barcode);
                    if (nChkRow < 1) {
                        args = { targetid: "grdData_Main", focus: true, select: true };
                        args.data = [
                            { name: "barcode", value: this.barcode }
                            , { name: "item_cd", value: this.item_cd }
                            , { name: "item_nm", value: this.item_nm }
                            , { name: "item_spec", value: this.item_spec }
                            , { name: "track_no", value: this.track_no }
                            , { name: "inv_qty", value: this.inv_qty }
                            , { name: "unit", value: this.unit }
                            , { name: "supp_cd", value: this.supp_cd }
                            , { name: "supp_nm", value: this.supp_nm }
                        ];
                        gw_com_module.gridInsert(args);
                    }
                });
            } else if (param.SUBID == "외부") {
                var barcode = gw_com_api.getValue("grdData_Main", "selected", "barcode", true);
                if (barcode == "") {
                    gw_com_api.messageBox([{ text: "내부 바코드가 선택되지 않았습니다." }], 300);
                    return;
                }

                // 중복 체크
                var bFind = false;
                for (var i = 1 ; i <= gw_com_api.getRowCount("grdData_Sub") ; i++) {
                    if (gw_com_api.getValue("grdData_Sub", i, "barcode", true) == barcode
                        && gw_com_api.getValue("grdData_Sub", i, "exbarcode", true) == param.exbarcode) {
                        bFind = true;
                        break;
                    }
                }
                
                if (!bFind) {
                    args = { targetid: "grdData_Sub", /*focus: true, select: true,*/ edit: true, updatable: true };
                    args.data = [
                        { name: "barcode", value: barcode }
                        , { name: "exbarcode", value: param.exbarcode }
                    ];
                    gw_com_module.gridInsert(args);
                }
            }
            
            //closeDialogue({ page: param.from.page, focus: true });
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//