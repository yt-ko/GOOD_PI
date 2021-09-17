//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 가입고 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        //// prepare dialogue.
        //var args = {
        //    type: "PAGE", page: "SRM_4321", title: "납품서 선택",
        //    width: 980, height: 520, locate: ["center", "top"]
        //};
        //gw_com_module.dialoguePrepare(args);

        //var args = {
        //    type: "PAGE", page: "SRM_4322", title: "품목 선택",
        //    width: 980, height: 520, locate: ["center", "top"]
        //};
        //gw_com_module.dialoguePrepare(args);

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "라벨유형",
                    data: [{ title: "개별", value: "1" }, { title: "통합", value: "2" }, { title: "-", value: "0" }]
                },
                { type: "PAGE", name: "창고", query: "DDDW_WH" }//,
                //{
                //    type: "PAGE", name: "창고", query: "dddw_zcode",
                //    param: [{ argument: "arg_hcode", value: "ISCM10" }]
                //},
                //{ type: "PAGE", name: "부서", query: "dddw_dept" },
                //{ type: "PAGE", name: "사원", query: "dddw_emp" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // create UI objects & define events & start logic
        function start() {
        	// UI & Events
            gw_job_process.UI();
            gw_job_process.procedure();
            
            // Page parameter
	        v_global.logic.io_no = "";
	        if (v_global.process.param != "") {
	            v_global.logic.io_no = gw_com_api.getPageParameter("io_no");
	        }
	        if (v_global.logic.io_no == "new") 
	        	processInsert({ object: "lyrMenu_Main" }); // 신규 등록
	        else 
	            processRetrieve({ key: v_global.logic.io_no }); //수정 및 조회
                //processRetrieve({ object: "lyrMenu_Main" }); //수정 및 조회
        }

    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                // { name: "자재", value: "생산출고", icon: "추가" },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE", hidden: true,
            element: [
				//{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "SRM_4320_M_1", type: "TABLE", title: "가입고 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: {
                width: { label: 76, field: 168 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "관리번호", format: { type: "label" } },
                          { name: "io_no", editable: { type: "hidden" } },
                          { name: "io_tp", hidden: true },
                          { header: true, value: "협력사", format: { type: "label" } },
                          { name: "rqst_dept_nm", editable: { type: "hidden" } },
                          { name: "rqst_dept", hidden: true, editable: { type: "hidden" } },
                          { header: true, value: "인계자", format: { type: "label" } },
                          { name: "rqst_user", editable: { type: "hidden" } },
                          { header: true, value: "입고담당", format: { type: "label" } },
                          { name: "acpt_user_nm", editable: { type: "hidden" } },
                          { name: "acpt_user", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                          { header: true, value: "입고일자", format: { type: "label" } },
                          {
                              name: "io_date", mask: "date-ymd",
                              editable: { type: "text", validate: { rule: "required" } }
                          },
                          { header: true, value: "진행상태", format: { type: "label" } },
                          { name: "pstat", editable: { type: "text" } },
                          { header: true, value: "등록자", format: { type: "label" } },
                          { name: "upd_usr_nm", editable: { type: "hidden" } },
                          { name: "upd_usr", hidden: true, editable: { type: "hidden" } },
                          { header: true, value: "등록일시", format: { type: "label" } },
                          { name: "upd_dt", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                          { header: true, value: "비    고", format: { type: "label" } },
                          { name: "rmk", editable: { type: "text", maxlength: 120, width: 1042 }, style: { colspan: 7 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4320_S_1", title: "가입고 목록",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "dlv_qty", validate: true },
            element: [
				{
				    header: "사급", name: "consigned_yn", width: 30, align: "center",
				    format: { type: "checkbox", value: 1, offval: 0 }
				},
				{ header: "품번", name: "item_cd", width: 70, align: "center", editable: { type: "hidden" } },
				{ header: "품명", name: "item_nm", width: 120, align: "left", editable: { type: "hidden" } },
				{ header: "규격", name: "item_spec", width: 120, align: "left", editable: { type: "hidden" } },
				{ header: "Tracking", name: "track_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "Pallet No.", name: "pallet_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd", editable: { type: "hidden" } },
				{ header: "PO수량", name: "pur_qty", width: 50, align: "center", editable: { type: "hidden" } },
				{ header: "단위", name: "io_unit", width: 40, align: "center", editable: { type: "hidden" } },
				{ header: "입고수량", name: "io_qty", width: 50, align: "center", editable: { type: "hidden" } },
				{
				    header: "선입고", name: "direct_yn", width: 30, align: "center",
				    format: { type: "checkbox", value: 1, offval: 0 },
				    editable: { type: "checkbox", value: 1, offval: 0 }, display: true
				},
                {
                    header: "창고", name: "wh_cd", width: 150, align: "center",
                    format: { type: "select", data: { memory: "창고" } },
                    editable: { type: "select", data: { memory: "창고" } }
                },
                {
                    header: "비고", name: "rmk", width: 250,
                    editable: { type: "text", maxlength: 120 }
                },
				{ header: "라벨", name: "label_tp", width: 50, align: "center", format: { type: "select", data: { memory: "라벨유형" } } },
                { header: "바코드", name: "barcode", width: 70, align: "center", editable: { type: "hidden" } },
                { name: "io_no", hidden: true, editable: { type: "hidden" } },
                { name: "io_seq", hidden: true, editable: { type: "hidden" } },
                { name: "io_cd", hidden: true, editable: { type: "hidden" } },
                { name: "loc_cd", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } },
                { name: "plant_cd", hidden: true, editable: { type: "hidden" } },
                { name: "direct_yn_org", hidden: true, display: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main (추가, 저장) ====
        var args = { targetid: "lyrMenu_Main", element: "자재", event: "click", handler: processBatch };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);

        //==== Button Click : Sub ====
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);

        //==== Grid Events : Sub
        //var args = { targetid: "grdData_Sub", grid: true, event: "itemchanged", handler: processItemChanged };
        //gw_com_module.eventBind(args);
        //----------

        // startup process.
        gw_com_module.startPage();

/*
        v_global.logic.key = "";
        if (v_global.process.param != "") {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("io_no");

            if (v_global.logic.key == "")
                processInsert({ object: "lyrMenu_Main" }); // 신규 등록
            else
                processRetrieve({ key: v_global.logic.key }); //수정 및 조회
        }
*/

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- ItemChanged Event 처리
function processItemChanged(param) {

    if (param.object == "grdData_Sub") {
        if (param.element == "direct_yn") {
            // 납품서 선입고(직납) 변경
            var row = [
                {
                    crud: "U",
                    column: [
                        { name: "dlv_no", value: gw_com_api.getValue(param.object, param.row, "root_no", true) },
                        { name: "dlv_seq", value: gw_com_api.getValue(param.object, param.row, "root_seq", true) },
                        { name: "direct_yn", value: param.value.current }
                    ]
                }
            ];

            var args = {
                url: "COM",
                nomessage: true,
                user: gw_com_module.v_Session.USR_ID,
                param: [{ query: "SRM_4120_S_1", row: row }]
            };
            gw_com_module.objSave(args);

        }
    }

}
//---------- Popup Find Window for select items
function popupFindItem(ui) {

    var args;
	if (ui.object == "lyrMenu_Main") {
    	// 납품서 선택 창 열기
	    args = {
	        type: "PAGE", page: "SRM_4321", title: "납품서 선택",
	        width: 1100, height: 520, locate: ["center", "top"], open: true
	    };
	} else if (ui.object == "lyrMenu_Sub") {
	    // 품목 선택 창 열기
	    args = {
	        type: "PAGE", page: "SRM_4322", title: "품목 선택",
	        width: 1150, height: 520, locate: ["center", "top"], open: true
	    };
	} else {
	    return;
	}

	if (gw_com_module.dialoguePrepare(args) == false) {
	    args.param = {
	        ID: gw_com_api.v_Stream.msg_selectPart_SCM,
	        data: {
	            io_no: v_global.logic.io_no
                , barcode: r_barcode
	        }
	    }
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
        key: param.key
    };
    gw_com_module.objRetrieve(args);

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

    if (ui.object == "lyrMenu_Main") {
        // Insert to Main Form
        var args = {
            targetid: "frmData_Main", edit: true, updatable: true,
            data: [
                { name: "io_date", value: gw_com_api.getDate("") },
                { name: "acpt_user", value: gw_com_module.v_Session.USR_ID },
                { name: "acpt_user_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "pstat", value: "작성중" }
            ],
            clear: [{ type: "GRID", id: "grdData_Sub" }]
        };
        gw_com_module.formInsert(args);
    } else if (ui.object == "lyrMenu_Sub") {
/*
        var ids = gw_com_api.getSelectedRow("grdData_Sub", true);
        if (ids.length < 1) {
            gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
            return;
        }

        var rows = [];
        $.each(ids, function () {
            rows.push({
                barcode: gw_com_api.getCellValue("GRID", "grdData_Sub", this, "barcode")
            });
        });
        r_barcode = rows;
*/
    }
    else return;

    // 납품서 or 품목 선택
    popupFindItem(ui);

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
            //, { type: "GRID", id: "grdData_File1" }
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
			//, { type: "GRID", id: "grdData_File1" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //************************************************************************************************************
    // 납품서 선입고(직납) 변경
    var row = new Array();
    var ids = gw_com_api.getRowIDs("grdData_Sub");
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_Sub", this, "direct_yn", true) != gw_com_api.getValue("grdData_Sub", this, "direct_yn_org", true))
        {
            row[row.length] = {
                crud: "U",
                column: [
                    { name: "dlv_no", value: gw_com_api.getValue("grdData_Sub", this, "root_no", true) },
                    { name: "dlv_seq", value: gw_com_api.getValue("grdData_Sub", this, "root_seq", true) },
                    { name: "direct_yn", value: gw_com_api.getValue("grdData_Sub", this, "direct_yn", true) }
                ]
            }
        }
    });
    if (row.length > 0)
        args.param = [{ query: "SRM_4120_S_1", row: row }];
    //************************************************************************************************************

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "io_no") { 
        		v_global.logic.io_no = this.VALUE;

                //// ERP I/F
        		//var args = {
        		//    url: "COM",
        		//    procedure: "PROC_SRM_ITEMIO_ERPIF",
        		//    nomessage: true,
        		//    input: [
                //        { name: "IoNo", value: v_global.logic.io_no, type: "varchar" }
        		//    ],
        		//    message: ""//,
        		//    //handler: { success: completeApply }
        		//};
        		//gw_com_module.callProcedure(args);

                // 가출고 자동 생성
        		var args = {
        		    url: "COM",
        		    procedure: "PROC_SRM_ITEMIO_AUTO_CREATE",
        		    nomessage: true,
        		    input: [
                        { name: "RootNo", value: v_global.logic.io_no, type: "varchar" },
                        { name: "RootTp", value: "IO", type: "varchar" },
                        { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "UserDept", value: gw_com_module.v_Session.DEPT_CD, type: "varchar" }
        		    ],
        		    message: ""//,
        		    //handler: { success: completeApply }
        		};
        		gw_com_module.callProcedure(args);
            }
        });
    });
    processRetrieve({ key: v_global.logic.io_no });

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
//---------- 파일 추가/수정/Rev
function processUpload(param) {

    // Check
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // Parameter 설정
    v_global.logic.FileUp = {
    	type: "SRM-DLV",
        key: gw_com_api.getValue("frmData_Main", 1, "dlv_no"),
        seq: 0,
        user: gw_com_module.v_Session.USR_ID,
        crud: "C",  rev: 0, revise: false
    };

    // Prepare File Upload Window
    var args = { type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "NCR-RQST", 
    	width: 650, height: 260, open: true, locate: ["center", "top"] }; //

    if (gw_com_module.dialoguePrepare(args) == false) {
    	// 아래 로직은 두 번째 Open 부터 작동함. 첫 번째는 streamProcess 에 의함
        var args = { page: "DLG_FileUpload",
            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
        };
        gw_com_module.dialogueOpen(args);
    }
    
}
//----------
function processBatch(param) {

    if (param.element == "자재") {
        if (!checkManipulate({})) return false;
        if (!checkUpdatable({ check: true })) return false;

        var args = {
            url: "COM",
            procedure: "PROC_SRM_ITEMIO_AUTO_CREATE",
            //nomessage: true,
            input: [
                { name: "RootNo", value: gw_com_api.getValue("frmData_Main", "selected", "io_no", false), type: "varchar" },
                { name: "RootTp", value: "OUT", type: "varchar" },
                { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                { name: "UserDept", value: gw_com_module.v_Session.DEPT_CD, type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: param
            }
        };
        gw_com_module.callProcedure(args);

    }

}
//----------
function successBatch(response, param) {


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
        // 납품 목록 선택 추가
        case gw_com_api.v_Stream.msg_selectedPart_SCM: {
            if (param.SUBID == "납품서" && param.data.rows != undefined) {
                r_barcode = param.data.rows;

                //헤더정보
                gw_com_api.setValue("frmData_Main", "selected", "io_tp", "가입고", false);
                gw_com_api.setValue("frmData_Main", "selected", "rqst_dept_nm", param.data.supp_nm, false);
                gw_com_api.setValue("frmData_Main", "selected", "rqst_user", param.data.dlv_user, false);
                gw_com_api.setValue("frmData_Main", "selected", "rqst_dept", param.data.supp_cd, false, true);

                //품목추가 dialogue open
                processInsert({ object: "lyrMenu_Sub" })
            } else if (param.SUBID == "품목" && param.data.rows != undefined) {
                var args = { targetid: "grdData_Sub", edit: true, updatable: true };
                args.data = param.data.rows;
                $.each(args.data, function () {
                    this.direct_yn_org = this.direct_yn;
                });
                gw_com_module.gridInserts(args);
            }
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        // 협력사 선택
        case gw_com_api.v_Stream.msg_selectedSupplier: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        // 사원번호 선택
        case gw_com_api.v_Stream.msg_selectedEmployee: {
        	if ( v_global.event.element == "user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER: {
            closeDialogue({ page: param.from.page });
        	processLink( { object: "grdData_File1" } ) ;
        } break;
           
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: { 
        	var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) { 
                case "SRM_4321":
                case "SRM_4322": {
                    args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                    args.data = {
                        io_no: v_global.logic.io_no
                        , barcode: r_barcode
                    };
                } break;
            }
            gw_com_module.streamInterface(args); 
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
        	closeDialogue({ page: param.from.page }); 
        } break;
    }

}