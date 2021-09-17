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
                },
                { type: "PAGE", name: "담당부서", query: "dddw_eq_dept" }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
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
				{ name: "실적", value: "실적등록", icon: "기타" },
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
                        },
                        { name: "eq_module", label: { title: "Module :" },
                            editable: { type: "text", size: 12, maxlength: 50 }
                        }
				        ]
                    },
                    { element: [
                        { name: "eq_dept", label: { title: "담당부서 :" },
                             editable: { type: "select", data: { memory: "담당부서" } }
                        },
			            { name: "실행", value: "실행", act: true, format: { type: "button" } },
			            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ], align: "right"
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Main ====
        var args = { targetid: "grdData_Main", query: "EOM_5110_M_1", title: "설비별 운영현황",
            caption: true, width: 380, height: 480, pager: true, show: true, //number: true,
            element: [
				{ header: "호기", name: "eq_no", width: 70, align: "center" },
				{ header: "설비명", name: "eq_nm", width: 80, align: "center" },
				{ header: "Module", name: "eq_module", width: 50, align: "center" },
				{ header: "현상태", name: "eq_stat", width: 50, align: "center" },
				{ name: "eq_cd", hidden: true },
				{ name: "ymd_fr", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_Sub1", query: "EOM_5110_S1", title: "일일 예약현황",
            caption: true, height: 190, width: 770, pager: true, show: true, //number: true,
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

        //==== Chart : Main ====
        var args = { targetid: "lyrChart_1", query: "EOM_5110_C1", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8, min: true },
                { type: "GRID", id: "grdData_Sub1", offset: 8, min: true }
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
        var args = { targetid: "lyrMenu", element: "실적", event: "click", handler: processEdit };
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
				{ name: "eq_nm", argument: "arg_eq_nm" },
				{ name: "eq_module", argument: "arg_eq_module" },
				{ name: "eq_dept", argument: "arg_eq_dept" }
            ],
            remark: [
		        { element: [{ name: "ymd_fr" }] },
		        { element: [{ name: "eq_no" }] },
		        { element: [{ name: "eq_nm" }] },
		        { element: [{ name: "eq_module" }] }, { element: [{ name: "eq_dept" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main" }
            , { type: "GRID", id: "grdData_Sub1" }
			,{ type: "CHART", id: "lyrChart_1" }
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
	else return;
	
	// 1-1. Check selection of row for editing
    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }
	var sEqNo, sEqModule;
	sEqNo = gw_com_api.getValue("grdData_Main", "selected", "eq_no", true) ;
	sEqModule = gw_com_api.getValue("grdData_Main", "selected", "eq_module", true) ;
	
	// Check selection of row for editing
    if (EditMode == "U" && gw_com_api.getSelectedRow("grdData_Sub1") == null) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
        return false;
    }
	
	// 1-2. Check status of row data for editing
    if ( EditMode == "U" ) {
	    var ProcStat = gw_com_api.getValue("grdData_Sub1", "selected", "pstat", true);
	    if (ProcStat == "완료" || ProcStat == "취소" ){
	        gw_com_api.messageBox([
	            { text: status + " 자료이므로 수정할 수 없습니다." }
	        ], 420);
	        return false;
    	}
    }
    
	// 예약번호 설정
	var sPlanNo, sPage, sTitle;
	if (EditMode == "I") {
		sPage = "EOM_2120";
		sTitle = "예약 등록";
		sPlanNo = "";
	}
	else if (EditMode == "I") {
		sPage = "EOM_2120";
		sTitle = "예약 수정";
		sPlanNo = gw_com_api.getValue("grdData_Sub1", "selected", "plan_no", true);
	}
	else {
		sPage = "EOM_2130";
		sTitle = "실적 등록";
		sPlanNo = gw_com_api.getValue("grdData_Sub1", "selected", "plan_no", true);
	}

	// 2. Convert to editing mode
	// Open link page to tabpage of parent page : SRM_4120 납품서 수정
    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: sPage, title: sTitle,
            param: [
                { name: "plan_no", value: sPlanNo }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
        case gw_com_api.v_Stream.msg_showMessage:
            { gw_com_module.streamInterface(param); } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            { if (param.data.page != gw_com_api.getPageID()) break; } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "INFO_VOC":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECR;
                            args.data = {
                                voc_no: gw_com_api.getValue("grdData_Sub1", "selected", "voc_no", true)
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            { closeDialogue({ page: param.from.page }); } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//