//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 반입 등록
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 저장, 삭제, 닫기
        var args = { targetid: "lyrMenu_Main", type: "FREE",
            element: [
				{ name: "자재", value: "자재반입", icon: "추가" },
				{ name: "일괄", value: "일괄반입", icon: "추가" },
				{ name: "기초", value: "기초재고", icon: "추가" },
                { name: "파일", value: "엑셀양식받기", icon: "기타" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Sub Menu : 추가, 삭제
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE", hidden: true,
            element: [
				//{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);


        //==== Main Form : 반입 정보
        var args = {
            targetid: "frmData_Main", query: "SRM_4520_M_1", type: "TABLE", title: "반입 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: {
                width: { label: 76, field: 140 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "관리번호", format: { type: "label" } },
                          { name: "io_no", editable: { type: "hidden" } },
                          { name: "io_tp", hidden: true },
                          { header: true, value: "반입일자", format: { type: "label" } },
                          {
                              name: "io_date", mask: "date-ymd",
                              editable: { type: "text", validate: { rule: "required" } }
                          },
                          { header: true, value: "진행상태", format: { type: "label" } },
                          { name: "pstat", editable: { type: "hidden" } },
                          { header: true, value: "구분", format: { type: "label" } },
                          { name: "io_cd", editable: { type: "hidden" } },
                          { name: "loc_cd", hidden: true },
                          { header: true, value: "등록자", format: { type: "label" } },
                          { name: "upd_usr_nm", editable: { type: "hidden" } },
                          { name: "upd_usr", hidden: true, editable: { type: "hidden" } }//,
                          //{ header: true, value: "등록일시", format: { type: "label" } },
                          //{ name: "upd_dt", editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Sub Form : 반입 목록
        var args = {
            targetid: "grdData_Sub", query: "SRM_4520_S_1", title: "반입 목록",
            caption: true, height: "400", pager: false, show: true, selectable: true, number: true, dynamic: true,
            editable: { multi: true, bind: "select", focus: "dlv_qty", validate: true },
            element: [
				{ header: "품번", name: "item_cd", width: 70, align: "center", editable: { type: "hidden" } },
				{ header: "품명", name: "item_nm", width: 120, align: "left", editable: { type: "hidden" } },
				{ header: "규격", name: "item_spec", width: 120, align: "left", editable: { type: "hidden" } },
				{ header: "Tracking", name: "track_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "단위", name: "io_unit", width: 40, align: "center", editable: { type: "hidden" } },
				{ header: "입고수량", name: "io_qty", width: 50, align: "right", editable: { type: "hidden" } },
                { header: "바코드", name: "barcode", width: 70, align: "center", editable: { type: "hidden" } },
                { name: "io_no", hidden: true, editable: { type: "hidden" } },
                { name: "io_seq", hidden: true, editable: { type: "hidden" } },
                { name: "plant_cd", hidden: true, editable: { type: "hidden" } },
                { name: "io_cd", hidden: true, editable: { type: "hidden" } },
                { name: "loc_cd", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects
        var args = {
            target: [
                    { type: "FORM", id: "frmData_Main", offset: 8 }
                    , { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main (바코드입력, 저장, 삭제, 닫기) ====
        //----------
        var args = { targetid: "lyrMenu_Main", element: "자재", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "일괄", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "기초", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "파일", event: "click", handler: fileDownload };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_닫기(ui) { processClose({}); }

        //==== Button Click : Sub ====
        //var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processInsert };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);


        //==== Grid Events : Main
        // startup process.
        gw_com_module.startPage();

        v_global.logic.key = "";
        if (v_global.process.param != "") {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("io_no");
            v_global.logic.element = gw_com_api.getPageParameter("element");
            
            if (v_global.logic.key == "new" || v_global.logic.key == "undefined")
                processInsert({ object: "lyrMenu_Main", element: v_global.logic.element }); // 신규 등록
	        else 
	        	processRetrieve({ key: v_global.logic.key }); //수정 및 조회
        }
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- ItemChanged Event 처리
function processItemChanged(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;

    if (ui.element == "Remark") {   // 복수행 입력란의 개행문자 치환
        vl = vl.replace(/\r\n/g, "CRLF");
        gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true);
    }
}
//----------
function checkCRUD(param) {

    if (param.sub) {
        var obj = "grdData_Sub";
        if (checkEditable({}))
            return gw_com_api.getCRUD(obj, "selected", true);
        else
            return ((gw_com_api.getSelectedRow(obj) == null) ? false : true);
    }
    else return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: (param.sub) ? "선택된 내역이 없습니다." : "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_io_no", value: param.key }
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_Main", select: true }
            , { type: "GRID", id: "grdData_Sub", focus: true, select: true }
        ],
        key: param.key, handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
}
//----------
function processLink(param) {
    var args = {};

    if (param.object == "frmData_Main") {
        args = { 
            key: param.key,
            source: { type: "FORM", id: "frmData_Main",
                element: [
				    { name: "io_no", argument: "arg_io_no" }
			    ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub", focus: true, select: true }
		    ]
        };
    } else return;

    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {
    var iWidth = 0;
    var iHeight = 0;
    var bModify = gw_com_api.getUpdatable("frmData_Main", false) || gw_com_api.getUpdatable("grdData_Sub", true);
    //if (bModify) {
    //    gw_com_api.messageBox([{ text: "변경된 자료가 있습니다." }, { text: "자료를 저장하시기 바랍니다." }], 300);
    //    return;
    //} else {
        processClear({});
    //}

    switch (ui.element) {
        case "자재":
            v_global.logic.io_cd = "자재반입";
            v_global.logic.loc_cd = "자재";
            v_global.logic.page = "SRM_4521";
            v_global.logic.title = "바코드입력";
            iWidth = 500;
            iHeight = 330;
            break;
        case "일괄":
            v_global.logic.io_cd = "자재반입";
            v_global.logic.loc_cd = "자재";
            v_global.logic.page = "DLG_ExcelImport";
            v_global.logic.title = "자재일괄반입";
            iWidth = 900;
            iHeight = 500;
            break;
        case "기초":
            v_global.logic.io_cd = "기초재고";
            v_global.logic.loc_cd = "자재";
            v_global.logic.page = "DLG_ExcelImport";
            v_global.logic.title = "기초재고등록";
            iWidth = 900;
            iHeight = 500;
            break;
    }

    var args = { targetid: "frmData_Main", edit: true, updatable: true,
        data: [
            { name: "io_date", value: gw_com_api.getDate("") },
            { name: "rqst_dept", value: gw_com_module.v_Session.DEPT_CD },
            { name: "rqst_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
            { name: "rqst_user", value: gw_com_module.v_Session.USR_ID },
            { name: "rqst_user_nm", value: gw_com_module.v_Session.USR_NM },
            { name: "acpt_user", value: gw_com_module.v_Session.USR_ID },
            { name: "acpt_user_nm", value: gw_com_module.v_Session.USR_NM },
            { name: "pstat", value: "작성중" },
            { name: "io_tp", value: "가입고" },
            { name: "io_cd", value: v_global.logic.io_cd },
            { name: "loc_cd", value: v_global.logic.loc_cd }
        ],
        clear: [
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.formInsert(args);
        
    var args = {
        type: "PAGE", page: v_global.logic.page, title: v_global.logic.title,
        width: iWidth, height: iHeight, locate: ["center", "top"], open: true
    };

    if (gw_com_module.dialoguePrepare(args) == false) { // POPUP 이 이미 열려 있을 때 : 초기값 전달
        // POPUP 창에 전달할 Data 변수값 설정
        args.param = {
            ID: gw_com_api.v_Stream.msg_selectPart_SCM,
            data: {
                JOB_ID: "SRM_4520",
                IO_CD: v_global.logic.io_cd
            }
        }
        gw_com_module.dialogueOpen(args);
   }
}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected", focus: true, select: true }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_Main") {
        if (!checkManipulate({})) return;

        var status = checkCRUD({});
        if (status == "initialize" || status == "create") processClear({});
        else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        }
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objClear(args);

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "io_no") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 

        	    // ERP I/F
                sendERP({ io_no: v_global.logic.key });
        	}
        });
    });
}
//---------- Remove
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main", key: { element: [ { name: "io_no" } ] } }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//---------- After Removing
function successRemove(response, param) {

    processClear(param);

}
//----------
function processClose(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
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
//----------
function sendERP(param) {
    var args = {
        url: "COM",
        procedure: "PROC_SRM_ITEMIO_ERPIF",
        nomessage: true,
        input: [
            { name: "IoNo", value: param.io_no, type: "varchar" }
        ],
        message: ""//,
        //handler: { success: completeApply }
    };
    gw_com_module.callProcedure(args);

}
//----------
function fileDownload(param) {
    var params =
    "?TYPE=" + encodeURIComponent("REPORT") +
    "&NAME=" + encodeURIComponent("SRM_4520/template_ExcelImport.xls");
    $("#" + "lyrDown_page").attr("src", "../Service/svc_Download.aspx" + params);
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
        	// PageId가 다를 때 Skip 
        	if (param.data.page != gw_com_api.getPageID()) { 
        		param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            // 확인 메시지별 처리    
            switch (param.data.ID) { 
            	case gw_com_api.v_Message.msg_confirmSave: { 
                	if (param.data.result == "YES") processSave(param.data.arg);
                    else { 
                    	processClear({});
                        if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    }
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: { 
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_confirmBatch: { 
                    if (param.data.result == "YES") processBatch(param.data.arg);
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
        } break;
        case gw_com_api.v_Stream.msg_selectedSupplier: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;

        // 출고 목록 선택 추가
        case gw_com_api.v_Stream.msg_selectedPart_SCM: {
            if (param.from.page == "DLG_ExcelImport") {
                // ERP I/F
                sendERP({ io_no: param.IO_NO });
                processRetrieve({ key: param.IO_NO });
                gw_com_api.messageBox([{ text: "저장 되었습니다." }], 300);
            } else {
                var args = { targetid: "grdData_Sub", edit: true, updatable: true, focus: true };
                $.each(param.data.rows, function () {
                    var nChkRow = gw_com_api.getFindRow("grdData_Sub", "barcode", this.barcode);

                    if (nChkRow > 0) {
                        //gw_com_api.messageBox([{ text: "이미 등록된 품목입니다." }], 400);
                    } else {
                        var io_no = gw_com_api.getValue("frmData_Main", "selected", "io_no");
                        var io_cd = gw_com_api.getValue("frmData_Main", "selected", "io_cd");
                        var loc_cd = gw_com_api.getValue("frmData_Main", "selected", "loc_cd");
                        args.data = [
                            { name: "io_no", value: io_no },
                            { name: "barcode", value: this.barcode },
                            { name: "plant_cd", value: this.plant_cd },
                            { name: "item_cd", value: this.item_cd },
                            { name: "item_nm", value: this.item_nm },
                            { name: "item_spec", value: this.item_spec },
                            { name: "io_unit", value: this.io_unit },
                            { name: "io_qty", value: this.io_qty },
                            { name: "track_no", value: this.track_no },
                            { name: "io_cd", value: io_cd },
                            { name: "loc_cd", value: loc_cd }
                        ];
                        nRow = gw_com_module.gridInsert(args);
                    }
                });
            }
        } break;
           
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: { 
        	var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) { 
                case "SRM_4521": {
                    args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                } break;
                case "DLG_ExcelImport": {
                    args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                    args.data = {
                        JOB_ID: "SRM_4520",
                        IO_CD: v_global.logic.io_cd
                    }
                } break;
            }
            gw_com_module.streamInterface(args); 
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
        	closeDialogue({ page: param.from.page }); 
        } break;
    }

}