//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 시정조치 요구서 발행
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
                { type: "PAGE", name: "발생구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM010"}] 
                },
                { type: "PAGE", name: "처리유형", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM015"}] 
                },
                { type: "PAGE", name: "접수구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM020"}]
                },
                { type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM025"}]
                },
                { type: "PAGE", name: "발행근거", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM030"}]
                },
                { type: "PAGE", name: "처리방안", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM035"}]
                },
                { type: "PAGE", name: "처리상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM025"}]
                },
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                },
                { type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "ISCM29" } ]
                },
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [ { argument: "arg_hcode", value: "IEHM02" } ]
				},
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
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

        // Main Menu : 조회, 접수, 반려, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "접수", value: "저장", icon: "저장" },
//				{ name: "반려", value: "반려", icon: "삭제" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        // Search Option : 
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "astat", validate: true },
            content: { row: [
                    { element: [
			            { name: "ymd_fr", label: { title: "발생일자 :" }, mask: "date-ymd",
			                style: { colfloat: "floating" },
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
			            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
                        { name: "issue_tp", label: { title: "발생구분 :" },
                            editable: { type: "select", size: 7, maxlength: 20 , 
                            	data: { memory: "발생구분", unshift: [{ title: "전체", value: ""}] } }
                        },
                        { name: "astat", label: { title: "접수구분 :" }, value: "발생",
                            editable: { type: "select", size: 7, maxlength: 20 ,
                                data: { memory: "접수구분", unshift: [{ title: "전체", value: ""}] } 
                                }
                        }
                    	]
                    },
                    { element: [
			            { name: "cust_cd", label: { title: "고객사 :" },
			                editable: { type: "select", size: 1,
			                    data: { memory: "고객사", unshift: [ { title: "전체", value: "" } ] },
			                    change: [ { name: "cust_dept", memory: "LINE", key: [ "cust_cd" ] } ]
			                }
			            },
			            { name: "cust_dept",
			                label: { title: "LINE :" },
			                editable: { type: "select", size: 1,
			                    data: { memory: "LINE", unshift: [ { title: "전체", value: "" } ], key: [ "cust_cd" ] }
			                }
			            },
                        { name: "cust_prod_nm", label: { title: "설비명 :" },
                            editable: { type: "text", size: 20, maxlength: 50 }
                        }
				        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
			            { name: "실행", value: "실행", act: true, format: { type: "button" } },
			            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ], align: "right"
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        // Main Grid : 발생 내역
        var args = { targetid: "grdData_현황", query: "QDM_6110_M_1", title: "발생 내역",
            height: 400, show: true, selectable: true, dynamic: true, // number: true, multi: true, checkrow: true,
            editable: { multi: true, bind: "select", focus: "astat", validate: true },
            element: [
				{ header: "발생일자", name: "issue_dt", width: 70, align: "center", mask: "date-ymd" },
				{ header: "발생구분", name: "issue_tp", width: 50, align: "center" },
				{ header: "장비군", name: "dept_area_nm", width: 50, align: "center" },
				{ header: "발생부서", name: "dept_nm", width: 80, align: "center" },
				{ header: "관리번호", name: "issue_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "고객사", name: "cust_nm", width: 60, align: "center" },
				{ header: "Line", name: "cust_dept", width: 80, align: "center" },
				{ header: "Process", name: "cust_proc", width: 60, align: "center" },
				{ header: "설비명", name: "prod_nm", width: 150, align: "center" },
				{ header: "고객설비명", name: "cust_prod_nm", width: 150 },
				{ header: "Project No.", name: "proj_no", width: 70, align: "center" },
                { header: "제품유형", name: "prod_type", width: 100, align: "center" },
				{ header: "Module", name: "prod_sub_nm", width: 100, align: "center" },
				{ header: "Warranty", name: "wrnt_io", width: 60, align: "center" },
				{ header: "발생현상", name: "rmk", width: 300 },
				{ header: "교체부품명", name: "bpart_nm", width: 150 },
				{ hidden: true, header: "진행상태", name: "pstat", width: 60, align: "center", editable: { type: "hidden" } },
				{ header: "처리유형", name: "act_tp", width: 60, align: "center",
				    editable: { type: "select", data: { memory: "처리유형", unshift: [{ title: "전체", value: ""}] } }
                },
				{ header: "접수여부", name: "astat", width: 60, align: "center",
				    editable: { type: "select", data: { memory: "접수구분" } }
                },
				{ header: "접수비고", name: "astat_rmk", width: 200, align: "left", editable: { type: "text" } },
				{ header: "접수자", hidden: true, name: "astat_user_nm", width: 80, align: "center" },
				{ header: "접수일시", hidden: true, name: "astat_dt", width: 120, align: "center" },
                { name: "prod_key", hidden: true },
                { name: "dept_cd", hidden: true },
                { name: "cust_cd", hidden: true },
                { name: "astat_user", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);
        
        // Sub Grid : 진행 이력
        var args = { targetid: "grdData_이력", query: "QDM_6110_S_1", title: "진행 이력",
            caption: true, height: 100, pager: false, show: true, selectable: true, key: true, dynamic: true,
            element: [
				{ header: "상태구분", name: "pstat", width: 120, align: "center" },
				{ header: "진행구분", name: "astat", width: 120, align: "center" },
				{ header: "최종진행자", name: "astat_user", width: 120, align: "center" },
				{ header: "최종진행일", name: "astat_dt", width: 120, align: "center" },
                { name: "prod_key", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        // resize objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "GRID", id: "grdData_이력", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "접수", event: "click", handler: click_lyrMenu_접수 };
        gw_com_module.eventBind(args);
//        var args = { targetid: "lyrMenu", element: "반려", event: "click", handler: click_lyrMenu_반려 };
//        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        function click_lyrMenu_접수(ui) { processAccept({}); }
        //----------
        function click_lyrMenu_반려(ui) { processReject({}); }
        
        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_취소(ui) { closeOption({}); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        function rowselected_grdData_현황(ui) { processLink({}); }
        //----------
        function rowdblclick_grdData_현황(ui) { popupDetail(ui); }

        // startup process.
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//----------
function processAccept() {
//    var rows = gw_com_api.getSelectedRow("grdData_현황", true);
//    if (rows.length <= 0) {
//        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
//        return false;
//    }
    
    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }

    var ProcStat = gw_com_api.getValue("grdData_현황", "selected", "pstat", true);
    
    if ( ProcStat == "발생" || ProcStat == "반려" || ProcStat == "접수" ) {
    	// 상태 변경
    	gw_com_api.setValue("grdData_현황", "selected", "pstat", 
    		gw_com_api.getValue("grdData_현황", "selected", "astat", true), true);
//    	gw_com_api.setValue("grdData_현황", "selected", "astat_user", gw_com_module.v_Session.USR_ID, true);
//    	gw_com_api.setUpdatable("grdData_현황", "selected", true);
    	// DB 저장
    	var args = { target: [ { type: "GRID", id: "grdData_현황" } ] };
	    if (gw_com_module.objValidate(args) == false) return false;
	
	    args.url = "COM";
	    args.handler = { success: successSave };
	    gw_com_module.objSave(args);
    }
    else {
        gw_com_api.messageBox([ { text: "접수가능 상태가 아닙니다." } ], 300);
        return false;
    }
    
	return true;
}
//----------
function successSave(response, param) {
	processRetrieve({});
//    $.each(response, function () {
//        $.each(this.KEY, function () { 
//        	if (this.NAME == "issue_no") { 
//        		v_global.logic.key = this.VALUE;
//                processRetrieve({ key: v_global.logic.key }); 
//            }
//        });
//    });
}
//----------
function processReject() {

}
//----------
function popupDetail(ui) {
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

	var LinkPage = "";
	var LinkID = gw_com_api.v_Stream.msg_infoECR;

	var LinkType = gw_com_api.getValue(ui.object, ui.row, "issue_tp", true);
	if ( LinkType == "VOC"){
		LinkPage = "INFO_VOC";
		LinkID = gw_com_api.v_Stream.msg_infoECR;
	}
	else if ( LinkType == "SPC"){
		LinkPage = "INFO_SPC";
		LinkID = gw_com_api.v_Stream.msg_infoECR;
	}
	else {
		LinkPage = "DLG_ISSUE";
		LinkID = gw_com_api.v_Stream.msg_infoAS;
	}

    var args = {
        type: "PAGE", page: LinkPage, title: "문제발생 상세 정보",
        width: 1100, height: 600, scroll: true, open: true, control: true, locate: ["center", "top"]
    };
    
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = { page: LinkPage,
            param: { ID: LinkID,
                data: {
                    issue_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true),
                    voc_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true)
                }
            }
        }
        gw_com_module.dialogueOpen(args);
    }
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
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "astat", argument: "arg_astat" },
                { name: "dept_area", argument: "arg_dept_area" }
			],
            remark: [
	            { infix: "~",  element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "issue_tp" }] },
		        { element: [{ name: "astat"}] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept"}] },
                { element: [{ name: "cust_prod_nm"}] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_현황" /*, focus: true, select: true*/ }
	    ],
        clear: [
			{ type: "GRID", id: "grdData_이력" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = { key: param.key,
        source: { type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
				{ name: "issue_no", argument: "arg_issue_no" }
			]
        },
        target: [
            { type: "GRID", id: "grdData_이력" }
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
        case gw_com_api.v_Stream.msg_retrieve:
            {
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = { targetid: "grdData_현황", row: v_global.event.row }
                gw_com_module.gridDelete(args);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {   var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "INFO_VOC": {
                        args.ID = gw_com_api.v_Stream.msg_infoECR;
                    } break;
                    case "INFO_SPC": {
                        args.ID = gw_com_api.v_Stream.msg_infoECR;
                    } break;
                    case "DLG_ISSUE": {
                        args.ID = gw_com_api.v_Stream.msg_infoAS;
                    } break;
                }
                args.data = {
                    issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true),
                    voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true)
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//