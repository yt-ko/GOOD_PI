//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 가동 현황
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
        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = { request: [
                { type: "PAGE", name: "발생구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM010"}] 
                },
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [ { argument: "arg_hcode", value: "IEHM02" } ]
				},
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
        	processRetrieve({}); // 자동 조회
        }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Main Menu : 조회, 추가, 수정, 실적, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "예약추가" },
				{ name: "수정", value: "예약수정", icon: "저장" },
				{ name: "삭제", value: "예약삭제", icon: "삭제" },
				{ name: "실적", value: "실적등록", icon: "기타" },
				{ name: "현상", value: "다운등록", icon: "기타" },
				{ name: "TEST", value: "Test등록", icon: "기타" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Oprion : Form ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "eq_no", validate: true },
            content: { row: [
                    { element: [
			            { name: "ymd_fr", label: { title: "기준일자 :" }, mask: "date-ymd",
			                style: { colfloat: "floating" },
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
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

        //==== Grid : Main ====
        var args = { targetid: "grdData_Main", query: "EOM_2110_M_1", title: "설비별 운영현황",
            caption: true, width: 380, height: 480, pager: true, show: true, //number: true,
            color: { row: true },
            element: [
				{ header: "호기", name: "eq_no", width: 70, align: "center" },
				{ header: "설비명", name: "eq_nm", width: 80, align: "center" },
				{ header: "Module", name: "eq_module", width: 50, align: "center" },
				{ header: "현상태", name: "eq_stat", width: 50, align: "center" },
				{ name: "eq_cd", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "color", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_Sub2", query: "EOM_2110_S2", title: "설비 예약현황",
            caption: true, height: 190, width: 770, pager: true, show: true, //number: true,
            editable: { multi: false, bind: "select", focus: "", validate: true },
            element: [
				{ header: "시작일자", name: "fr_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "종료일자", name: "to_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "담당자", name: "plan_user_nm", width: 60, align: "center" },
				{ header: "Project", name: "proj_no", width: 60, align: "center" },
				{ header: "사용목적", name: "plan_rmk", width: 300, align: "center" },
				{ header: "수정자", name: "upd_usr_nm", width: 70, align: "center" },
				{ hidden: true, header: "수정일시", name: "upd_dt", width: 160, align: "center" },
				{ name: "plan_user", hidden: true },
				{ name: "ins_usr", hidden: true },
				{ name: "upd_usr", hidden: true },
				{ name: "eq_cd", hidden: true },
				{ name: "plan_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        var args = { targetid: "grdData_Sub1", query: "EOM_2110_S1", title: "일일 예약현황",
            caption: true, height: 210, width: 770, pager: true, show: true, //number: true,
            element: [
				{ header: "호기", name: "eq_no", width: 70, align: "center" },
				{ header: "설비명", name: "eq_nm", width: 80, align: "center" },
				{ header: "Module", name: "eq_module", width: 50, align: "center" },
				{ header: "담당자", name: "plan_user_nm", width: 60, align: "center" },
				{ header: "시작시각", name: "fr_time", width: 80, align: "center", mask: "time-hm" },
				{ header: "종료시각", name: "to_time", width: 80, align: "center", mask: "time-hm" },
				{ header: "Project", name: "proj_no", width: 60, align: "center" },
				{ header: "사용목적", name: "plan_rmk", width: 300, align: "center" },
				{ hidden: true, header: "수정자", name: "upd_usr", width: 70, align: "center" },
				{ hidden: true, header: "수정일시", name: "upd_dt", width: 160, align: "center" },
				{ name: "plan_user", hidden: true },
				{ name: "eq_cd", hidden: true },
				{ name: "plan_no", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8, min: true },
                { type: "GRID", id: "grdData_Sub1", offset: 8, min: true },
                { type: "GRID", id: "grdData_Sub2", offset: 8, min: true }
            ]
        };
        gw_com_module.objResize(args);

        gw_com_module.informSize();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //==== Button Click : Main 조회, 추가, 수정, 실적, 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "실적", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "현상", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "TEST", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { gw_com_api.hide("frmOption"); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: 0 }));
        gw_com_module.startPage();

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}

//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "eq_no", argument: "arg_eq_no" },
				{ name: "eq_nm", argument: "arg_eq_nm" }
            ],
            remark: [
		        { element: [{ name: "ymd_fr" }] },
		        { element: [{ name: "eq_no" }] },
		        { element: [{ name: "eq_nm" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", focus: true, select: true }
            , { type: "GRID", id: "grdData_Sub1" }
        ],
        clear: [
            { type: "GRID", id: "grdData_Sub2" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "eq_cd", argument: "arg_eq_cd" },
                { name: "eq_module", argument: "arg_eq_module" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub2" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//---------- Main Button : 추가 & 수정 (ui.type/obkect/row/element)
function processEdit( param ) {
	
	// 0. Set editing mode (Insert or Update)
	var EditMode = "" ;
    if (param.object == "lyrMenu" && param.element == "추가") EditMode = "I";
    else if (param.object == "lyrMenu" && param.element == "수정") EditMode = "U";
    else if (param.object == "lyrMenu" && param.element == "실적") EditMode = "R";
    else if (param.object == "lyrMenu" && param.element == "현상") EditMode = "S";
    else if (param.object == "lyrMenu" && param.element == "TEST") EditMode = "T";
	else return;
	
	// 1-1. Check selection of row for inserting
	var sEqCd, sEqNo, sEqNm, sEqModule = "";
	if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([ { text: "대상 설비를 선택하세요." } ], 300);
        return false;
	}
	sEqCd = gw_com_api.getValue("grdData_Main", "selected", "eq_cd", true) ;
	sEqNo = gw_com_api.getValue("grdData_Main", "selected", "eq_no", true) ;
	sEqNm = gw_com_api.getValue("grdData_Main", "selected", "eq_nm", true) ;
	sEqModule = gw_com_api.getValue("grdData_Main", "selected", "eq_module", true) ;
	
	// Check selection of row for updating
    if (EditMode == "U") {
    	if (gw_com_api.getSelectedRow("grdData_Sub2") == null) {
	        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
	        return false;
    	}
//	    var ProcStat = gw_com_api.getValue("grdData_Sub2", "selected", "pstat", true);
//	    if (ProcStat == "완료" || ProcStat == "취소" ){
//	        gw_com_api.messageBox([
//	            { text: status + " 자료이므로 수정할 수 없습니다." }
//	        ], 420);
//	        return false;
//    	}
    }
	
	// 예약번호 설정
	var sPlanNo, sPage, sTitle, sFrDate = "";
	if (EditMode == "I") {
		sPage = "EOM_2120";
		sTitle = "예약 등록";
		sPlanNo = "";
	}
	else if (EditMode == "U") {
		sPage = "EOM_2120";
		sTitle = "예약 수정";
		sPlanNo = gw_com_api.getValue("grdData_Sub2", "selected", "plan_no", true);
		sFrDate = gw_com_api.getValue("grdData_Sub2", "selected", "fr_date", true);
	}
	else if (EditMode == "S") {
		sPage = "EOM_2140";
		sTitle = "다운 등록";
		sPlanNo = gw_com_api.getValue("grdData_Sub2", "selected", "plan_no", true);
	}
	else if (EditMode == "T") {
		sPage = "EOM_2150";
		sTitle = "TEST 등록";
		sPlanNo = gw_com_api.getValue("grdData_Sub2", "selected", "plan_no", true);
	}
	else {
		sPage = "EOM_2130";
		sTitle = "실적 등록";
		sPlanNo = gw_com_api.getValue("grdData_Sub2", "selected", "plan_no", true);
	}

	// 2. Convert to editing mode
	// Open link page to tabpage of parent page : 
    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: sPage, title: sTitle,
            param: [
                { name: "plan_no", value: sPlanNo }
              , { name: "eq_cd", value: sEqCd }
              , { name: "eq_module", value: sEqModule }
              , { name: "eq_no", value: sEqNo }
              , { name: "eq_nm", value: sEqNm }
              , { name: "fr_date", value: sFrDate }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//---------- 삭제 처리 : processDelete => processRemove => successRemove
function processDelete(ui) {
	gw_com_api.hide("frmOption");	// 조회 조건 입력 창 숨기기
	
    // 1. 삭제 후 Update까지 완료 : 주로 master data에 적용
    if(ui.object == "lyrMenu") {
    	
    	// 1-1. 삭제 대상 설정
        var args = { id: "grdData_Sub2", type: "GRID"
        	, grid: true, row: "selected", element: [ { name: "plan_no" } ] 
        	};
        	
    	// 1-2. 처리 가능여부 확인
    	if (gw_com_module.v_Session.USR_ID != gw_com_api.getValue("grdData_Sub2", "selected", "plan_user", true)
    	 && gw_com_module.v_Session.USR_ID != gw_com_api.getValue("grdData_Sub2", "selected", "ins_usr", true)
    	 && gw_com_module.v_Session.USR_ID != gw_com_api.getValue("grdData_Sub2", "selected", "upd_usr", true))
    	{
	    	gw_com_api.messageBox([{ text: "삭제 권한이 없습니다" }], 420);
    		return; 
    	}
	    
	    // 1-3. Record CRUD 상태에 따른 처리
	    var crud = gw_com_api.getCRUD(args.id, args.row, args.grid);
	    if (crud == "none")
	    	gw_com_api.messageBox([ { text: "NOMASTER" } ]);
	    else if (crud == "initialize" || crud == "create") 	//신규인 경우 화면 초기화
	    	gw_com_module.objClear({ target: [args] });
	    else {	
	    	// 삭제 여부 확인 후 삭제 처리 
		    v_global.process.handler = processRemove;
	        gw_com_api.messageBox([ { text: "REMOVE" } ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", args);
		}
    }
    
    // 2. 화면에서만 삭제 : 주로 Sub Grid에 적용
    else if (ui.object == "lyrMenu_Sample") {
        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else return;

}
//----------
function processRemove(param) {
	// 주의 : 자체 삭제 처리 시에는 url 제거
    var args = { 
    	url: "COM",	
        target: [ { type: param.type, id: param.id, key: [ { row: param.row, element: param.element } ] } ]
    };
    args.handler = { success: successRemove, param: param };
    gw_com_module.objRemove(args);
}
//----------
function successRemove(response, param) {
    var args = { targetid: param.id, row: param.row }
    gw_com_module.gridDelete(args);
}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }
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
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmRemove: {
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informRemoved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };
            switch (param.from.page) {
                case "INFO_VOC": {
                        args.ID = gw_com_api.v_Stream.msg_infoECR;
                        args.data = {
                            voc_no: gw_com_api.getValue("grdData_Sub1", "selected", "voc_no", true)
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//