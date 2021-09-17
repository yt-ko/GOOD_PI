//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 이동 등록
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
				{ name: "이동", value: "자재이동", icon: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Sub Menu : 추가, 삭제
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);


        //==== Main Form : 이동 정보
        var args = {
            targetid: "frmData_Main", query: "SRM_4620_M_1", type: "TABLE", title: "이동 정보",
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
                          { header: true, value: "이동일자", format: { type: "label" } },
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

        //==== Sub Form : 이동 목록
        var args = {
            targetid: "grdData_Sub", query: "SRM_4620_S_1", title: "이동 목록",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "track_no", validate: true },
            element: [
				{ header: "품번", name: "item_cd", width: 70, align: "center", editable: { type: "hidden" } },
				{ header: "품명", name: "item_nm", width: 120, align: "left", editable: { type: "hidden" } },
				{ header: "규격", name: "item_spec", width: 120, align: "left", editable: { type: "hidden" } },
				{ header: "Tracking", name: "mtrack_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "이동 Tracking", name: "track_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "단위", name: "io_unit", width: 40, align: "center", editable: { type: "hidden" } },
				{
				    header: "재고수량", name: "inv_qty", width: 50, align: "right",
				    mask: "numeric-int", fix: { mask: "numeric-int" }
				},
				{
				    header: "이동수량", name: "io_qty", width: 50, align: "right",
				    editable: { type: "text" }, mask: "numeric-int", fix: { mask: "numeric-int" }
				},
                { header: "바코드", name: "barcode", width: 70, align: "center", editable: { type: "hidden" } },
                { name: "mbarcode", hidden: true, editable: { type: "hidden" } },
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
        var args = { targetid: "lyrMenu_Main", element: "이동", event: "click", handler: processInsert };
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
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
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
//---------- Popup Detail Windows
function popupDetail(ui) {

    if (typeof (ui.page) == "undefined") {
        ui.page = "SRM_4621";
    }

    var args = {
        type: "PAGE", page: ui.page, title: "바코드입력"
            , width: 510, height: 330, locate: ["center", "top"], open: true
    };

    if (gw_com_module.dialoguePrepare(args) == false) { // POPUP 이 이미 열려 있을 때 : 초기값 전달
        // POPUP 창에 전달할 Data 변수값 설정

        var args = { //검색조건 초기값 전달 인자 설정
            page: ui.page,
            param: {
                ID: gw_com_api.v_Stream.msg_selectPart_SCM
            }
        };
        gw_com_module.dialogueOpen(args);
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
    gw_com_api.hideCols("grdData_Sub", ["inv_qty"]);
    gw_com_module.objResize({ target: [{ type: "GRID", id: "grdData_Sub", offset: 8 }] });

    if (param.key == undefined)
        param.key = v_global.logic.key;

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
    if (ui.object == "lyrMenu_Sub") {
        popupDetail(ui);
    }
    else {
        var bModify = gw_com_api.getUpdatable("frmData_Main", false) || gw_com_api.getUpdatable("grdData_Sub", true);
        //if (bModify) {
        //    gw_com_api.messageBox([{ text: "변경된 자료가 있습니다." }, { text: "자료를 저장하시기 바랍니다." }], 300);
        //    return;
        //} else {
            processClear({});
        //}

            switch (ui.element) {
            case "이동":
                v_global.logic.io_cd = "자재이동";
                v_global.logic.loc_cd = "자재";
                v_global.logic.page = "SRM_4621";
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
                { name: "io_tp", value: "이동" },
                { name: "io_cd", value: v_global.logic.io_cd },
                { name: "loc_cd", value: v_global.logic.loc_cd }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" }
            ]
        };
        gw_com_module.formInsert(args);
        
        // 이동목록 추가
        processInsert({ object: "lyrMenu_Sub", page: v_global.logic.page });
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
                //processRetrieve({ key: v_global.logic.key }); 

        	    // ERP I/F
                var args = {
                    url: "COM",
                    procedure: "PROC_SRM_ITEMIO_ERPIF",
                    nomessage: true,
                    input: [
                        { name: "IoNo", value: v_global.logic.key, type: "varchar" }
                    ],
                    message: "",
                    handler: { success: processRetrieve }
                };
                gw_com_module.callProcedure(args);

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
            var args = { targetid: "grdData_Sub", edit: true, updatable: true, focus: true };
            gw_com_api.showCols("grdData_Sub", ["inv_qty"]);
            gw_com_module.objResize({ target: [{ type: "GRID", id: "grdData_Sub", offset: 8 }] });

            $.each(param.data.rows, function () {
                var nChkRow = this.barcode == "" ? 0 : gw_com_api.getFindRow("grdData_Sub", "barcode", this.barcode);

                if (nChkRow > 0) {
                    //gw_com_api.messageBox([{ text: "이미 등록된 품목입니다." }], 400);
                } else {
                    var io_no = gw_com_api.getValue("frmData_Main", "selected", "io_no");
                    var io_cd = gw_com_api.getValue("frmData_Main", "selected", "io_cd");
                    var loc_cd = gw_com_api.getValue("frmData_Main", "selected", "loc_cd");
                    args.data = [
                        { name: "io_no", value: io_no },
                        { name: "io_cd", value: io_cd },
                        { name: "plant_cd", value: this.plant_cd },
                        { name: "item_cd", value: this.item_cd },
                        { name: "item_nm", value: this.item_nm },
                        { name: "item_spec", value: this.item_spec },
                        { name: "inv_qty", value: this.inv_qty },
                        { name: "io_qty", value: this.io_qty },
                        { name: "io_unit", value: this.io_unit },
                        { name: "track_no", value: this.track_no },
                        { name: "barcode", value: this.barcode },
                        { name: "loc_cd", value: loc_cd },
                        { name: "mbarcode", value: this.mbarcode },
                        { name: "mtrack_no", value: this.mtrack_no }
                    ];
                    nRow = gw_com_module.gridInsert(args);
                }
            });
        } break;
           
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: { 
        	var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) { 
                case "SRM_4621": {
                    args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                } break;
            }
            gw_com_module.streamInterface(args); 
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
        	closeDialogue({ page: param.from.page }); 
        } break;
    }

}