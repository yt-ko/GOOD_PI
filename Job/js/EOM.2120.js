//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 가동 예약
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
                { type: "PAGE", name: "연구설비", query: "DDDW_EOM_EQ",
                    param: [{ argument: "arg_hcode", value: "ALL"}] 
                },
                { type: "PAGE", name: "설비", query: "DDDW_EOM_EQ",
                    param: [{ argument: "arg_hcode", value: ""}] 
                },
                { type: "PAGE", name: "설비모듈", query: "DDDW_EOM_EQMODULE",
                    param: [{ argument: "arg_hcode", value: ""}] 
                },
                { type: "PAGE", name: "모듈", query: "DDDW_EOM_MODULE",
                    param: [{ argument: "arg_hcode", value: ""}] 
                },
                { type: "INLINE", name: "사용구분",
                    data: [ { title: "Run", value: "Run" }, { title: "Down", value: "Down" }
                    	  , { title: "Modify", value: "Modify" }, { title: "Idle(Wafer계측)", value: "Idle(Wafer계측)" }
                    	  , { title: "취소", value: "취소" } 
                    ]
                }
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

        //==== Main Menu : 조회, 추가, 저장, 삭제, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },
				{ name: "저장", value: "저장" },
				{ name: "삭제", value: "삭제" },
				{ name: "실적", value: "실적등록", icon: "기타" },
				{ name: "현상", value: "실적외등록", icon: "기타" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        var args = {
            targetid: "lyrMenu_D2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "일괄", value: "일괄추가", icon: "기타" }
            ]
        };
        gw_com_module.buttonMenu(args);
        

        //==== Oprion : Form ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "eq_no", validate: true },
            content: { row: [
                    { element: [
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_fr", label: { title: "기준일자 :" },
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
                        { name: "plan_no", label: { title: "예약번호 :" },
                            editable: { type: "text", readonly: true }
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
        var args = { targetid: "grdData_Main", query: "EOM_2120_M_1", title: "설비 예약 현황",
            caption: true, width: 490, height: 480, pager: true, show: true, //number: true,
            element: [
				{ header: "호기", name: "eq_no", width: 70, align: "center" },
				{ header: "설비명", name: "eq_nm", width: 80, align: "center" },
				{ header: "Module", name: "eq_module", width: 60, align: "center" },
				{ header: "예약일", name: "fr_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "시작", name: "fr_time", width: 50, align: "center", mask: "time-hm" },
				{ header: "종료", name: "to_time", width: 50, align: "center", mask: "time-hm" },
				{ header: "담당자", name: "plan_user_nm", width: 60, align: "center" },
				{ name: "plan_user", hidden: true },
				{ name: "plan_no", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "eq_cd", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Form : Detail1 ====
        var args = { targetid: "frmData_D1", query: "EOM_2120_D_1", type: "TABLE", title: "예약 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "fr_date", validate: true },
            content: { width: { label: 70, field: 134 }, height: 25,
                row: [
                    { element: [
                            { header: true, value: "설비", format: { type: "label"} },
                            { name: "eq_cd", align: "center",
                            	editable: { type: "select", validate: { rule: "required" }, data: { memory: "설비" }} 
							},
                            { header: true, value: "담당자", format: { type: "label"} },
                            { name: "plan_user_nm", editable: { type: "hidden"} },
                            { header: true, value: " ", format: { type: "label"} },
                            { name: "proj_no", editable: { type: "text"} }
                        ]
                    },
                    { element: [
                            { header: true, value: "시작일자", format: { type: "label"} },
                            { name: "fr_date", mask: "date-ymd", align: "center",
                            	editable: { type: "text", validate: { rule: "required" }} 
							},
                            { header: true, value: "종료일자", format: { type: "label"} },
                            { name: "to_date", mask: "date-ymd", align: "center",
                            	editable: { type: "text", validate: { rule: "required" } } 
							},
                            { name: "plan_no", hidden: true, editable: { type: "hidden"} },
                            { name: "plan_rmk", hidden: true, editable: { type: "hidden"} },
                            { name: "plan_user", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Detail2 ====
        var args = {
            targetid: "grdData_D2", query: "EOM_2120_D_2", title: "상세 가동 계획",
            caption: true, pager: true, show: true, height: 380, width: 510, //number: true,
            editable: { bind: "select", focus: "fr_date", validate: true },
            element: [
                { header: "가동일자", name: "fr_date", width: 100, mask: "date-ymd", align: "center",
                    editable: { type: "text", validate: { rule: "required" } }
				},
				{ header: "시작", name: "fr_time", width: 60, align: "center", mask: "time-hm"
					, editable: { type: "text", validate: { rule: "required" } }
				},
				{ header: "종료", name: "to_time", width: 60, align: "center", mask: "time-hm"
					, editable: { type: "text", validate: { rule: "required" } }
				},
				{ header: "사용구분", name: "use_type", width: 100, align: "center"
					, format: { type: "select", data: { memory: "사용구분" } } 
					, editable: { type: "select", validate: { rule: "required" }
						, data: { memory: "사용구분" } } 
				},
//				{ header: "설비코드", name: "eq_cd", hidden: true
//					, editable: { type: "select", data: { memory: "연구설비" } 
//                    	, change: [ { name: "eq_module1", memory: "설비모듈", key: [ "eq_cd" ] }
//                    		, { name: "eq_module2", memory: "설비모듈", key: [ "eq_cd" ] }
//                    		, { name: "eq_module3", memory: "설비모듈", key: [ "eq_cd" ] }
//                    		//, { name: "eq_module4", memory: "설비모듈", key: [ "eq_cd" ] }
//                    		] 
//					}  
//				},
				{ header: "Module1", name: "eq_module1", width: 60, align: "center"
					, editable: { type: "select", validate: { rule: "required" }
						, data: { memory: "설비모듈"
							, by: [{ source: { id: "frmData_D1", row: 1, key: "eq_cd"} }] } }
				},
				{ header: "Module2", name: "eq_module2", width: 60, align: "center"
					, editable: { type: "select"
						, data: { memory: "설비모듈"
							, by: [{ source: { id: "frmData_D1", row: 1, key: "eq_cd"} }] } }
				},
				{ header: "Module3", name: "eq_module3", width: 60, align: "center"
					, editable: { type: "select"
						, data: { memory: "설비모듈"
							, by: [{ source: { id: "frmData_D1", row: 1, key: "eq_cd"} }] } }
				},
				{ header: "Module4", name: "eq_module4", width: 60, align: "center"
					, editable: { type: "select"
						, data: { memory: "설비모듈"
							, by: [{ source: { id: "frmData_D1", row: 1, key: "eq_cd"} }] } }
				},
				{ header: "예약번호", name: "plan_no", hidden: true, editable: { type: "hidden"}  },
				{ header: "예약번호", name: "plan_seq", hidden: true, editable: { type: "hidden"}  }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8, min: true },
                { type: "FORM", id: "frmData_D1", offset: 8, min: true },
                { type: "GRID", id: "grdData_D2", offset: 8, min: true }
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

        //==== Button Click : Main 조회, 추가, 저장, 삭제, 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_D2", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_D2", element: "일괄", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_D2", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "실적", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "현상", event: "click", handler: processEdit };
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate(""));

        v_global.logic.key = "";
        if (v_global.process.param) {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("plan_no");
            v_global.logic.eq_cd = gw_com_api.getPageParameter("eq_cd");
            v_global.logic.eq_module = gw_com_api.getPageParameter("eq_module");
            v_global.logic.eq_no = gw_com_api.getPageParameter("eq_no");
            v_global.logic.eq_nm = gw_com_api.getPageParameter("eq_nm");
            v_global.logic.fr_date = gw_com_api.getPageParameter("fr_date");
            gw_com_api.setValue("frmOption", 1, "plan_no", v_global.logic.key );
            gw_com_api.setValue("frmOption", 1, "eq_no", v_global.logic.eq_no );
            gw_com_api.setValue("frmOption", 1, "eq_nm", v_global.logic.eq_nm );
            gw_com_api.setValue("frmOption", 1, "fr_date", v_global.logic.fr_date );
            
			processRetrieve({});
	        if (v_global.logic.key == "") 
	        	processInsert({ object: "Main" }); // 신규 등록
	        else 
	        	processLink({}); //수정 및 조회
        }
		else {
			gw_com_api.setValue("frmOption", 1, "fr_date", gw_com_api.getDate("", { day: 0 }));
			processRetrieve({});
		}
        gw_com_module.startPage();
        gw_com_api.hide("frmOption");

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
	if (EditMode != "I" && gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([ { text: "대상 설비를 선택하세요." } ], 300);
        return false;
	}
	sEqCd = gw_com_api.getValue("grdData_Main", "selected", "eq_cd", true) ;
	sEqNo = gw_com_api.getValue("grdData_Main", "selected", "eq_no", true) ;
	sEqNm = gw_com_api.getValue("grdData_Main", "selected", "eq_nm", true) ;
	sEqModule = gw_com_api.getValue("grdData_Main", "selected", "eq_module", true) ;
	
	// Check selection of row for updating
    if (EditMode == "U") {
    	if (gw_com_api.getSelectedRow("grdData_Main") == null) {
	        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ], 300);
	        return false;
    	}
//	    var ProcStat = gw_com_api.getValue("grdData_Main", "selected", "pstat", true);
//	    if (ProcStat == "완료" || ProcStat == "취소" ){
//	        gw_com_api.messageBox([
//	            { text: status + " 자료이므로 수정할 수 없습니다." }
//	        ], 420);
//	        return false;
//    	}
    }
	
	// 예약번호 설정
	var sPlanNo, sPage, sTitle, sFrDate = "";
	if (EditMode == "S") {
		sPage = "EOM_2140";
		sTitle = "실적외 등록";
		sPlanNo = gw_com_api.getValue("grdData_Main", "selected", "plan_no", true);
	}
	else if (EditMode == "T") {
		sPage = "EOM_2150";
		sTitle = "TEST 등록";
		sPlanNo = gw_com_api.getValue("grdData_Main", "selected", "plan_no", true);
	}
	else {
		sPage = "EOM_2130";
		sTitle = "실적 등록";
		sPlanNo = gw_com_api.getValue("grdData_Main", "selected", "plan_no", true);
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
//----------
function viewOption() {
    var args = { target: [ { id: "frmOption", focus: true } ] };
    gw_com_module.objToggle(args);
}
//----------
function checkCRUD(param) {
	if (param.grid == undefined) 
		return "none";
	else if (param.grid)
		return gw_com_api.getCRUD(param.objid, param.row, param.grid);
    else
    	return gw_com_api.getCRUD(pram.objid);
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
	            { element: [ { name: "ymd_fr" } ] },
		        { element: [{ name: "eq_no" }] },
		        { element: [{ name: "eq_nm" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
	var args = { };
	
    args = {
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: false,
            element: [
                { name: "plan_no", argument: "arg_plan_no" }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_D1" },
            { type: "GRID", id: "grdData_D2" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {
    var args = {};

    if (ui.object == "lyrMenu_D2") {
    	//if (!checkManipulate({ sub: true })) return false;
    	// 일괄 추가 처리
    	if (ui.element == "일괄") {
            // Check input data : from-to date
	    	var sFrDate = gw_com_api.getValue("frmData_D1", 1, "fr_date", false);
	    	var sToDate = gw_com_api.getValue("frmData_D1", 1, "to_date", false);
	    	if (sFrDate.length != 8 || sToDate.length != 8 || sFrDate > sToDate ){
		        gw_com_api.messageBox([ { text: "시작일자와 종료일자를 정확히 입력해 주세요." } ], 500);
		        return false;
		    }
            // Delete Empty Rows
	    	var nRows = gw_com_api.getRowCount( "grdData_D2" );
	    	for ( var i = nRows; i > 0 ; i-- ) {
	    	    var sTemp = gw_com_api.getValue( "grdData_D2", i, "fr_date", true );
                if (sTemp.length != 8){
                    args = { targetid: "grdData_D2", row: i }
                    gw_com_module.gridDelete(args);
                }
	    	}

            // Insert Rows
	    	var sCurDate = sFrDate;
	    	for ( var i = 0; i < 100; i++ ) {
                // Check already existance of current date
	    	    var nFindRow = gw_com_api.getFindRow( "grdData_D2", "fr_date", sCurDate ) ;
	    	    if ( nFindRow < 1 ) {
                    args = { targetid: "grdData_D2", edit: true, updatable: true,
                        data: [
                            { name: "plan_no", value: gw_com_api.getValue("frmData_D1", 1, "plan_no", false) },
                            { name: "fr_date", value: sCurDate },
                            { name: "to_date", value: sCurDate },
                            { name: "fr_time", value: "0900" },
                            { name: "to_time", value: "1800" },
                            { name: "eq_module1", value: v_global.logic.eq_module },
                        ]
                    };
                    gw_com_module.gridInsert(args);
                }
                if ( sCurDate == sToDate ) break;
                else sCurDate = gw_com_api.addDate( "d", 1, sCurDate, "" );
	    	} // End for
		}
        else {		
            args = { targetid: "grdData_D2", edit: true, updatable: true,
                data: [
                    { name: "plan_no", value: gw_com_api.getValue("frmData_D1", 1, "plan_no", false) },
                    { name: "fr_time", value: "0900" },
                    { name: "to_time", value: "1800" },
                    { name: "eq_module1", value: v_global.logic.eq_module },
                ]
            };
            gw_com_module.gridInsert(args);
        }
    }
    else {	// 요구서 추가
        args = { targetid: "frmData_D1", edit: true, updatable: true,
            data: [
                { name: "fr_date", value: gw_com_api.getDate("") },
                { name: "to_date", value: gw_com_api.getDate("") },
                { name: "eq_cd", value: v_global.logic.eq_cd },
                { name: "plan_user", value: gw_com_module.v_Session.USR_ID }
            ],
            clear: [
                { type: "GRID", id: "grdData_D2" }
            ]
        };
        gw_com_module.formInsert(args);
        
        // 상세 추가
        //processInsert({ object: "lyrMenu_D2" });
    }
}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_D2") {
        var args = { targetid: "grdData_D2", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if(ui.object == "lyrMenu_Main") {
		if (!checkManipulate({})) return;
	            
	    var status = checkCRUD({});
	    if (status == "initialize" || status == "create") processClear({});
	    else {
		    v_global.process.handler = processRemove;
	        gw_com_api.messageBox([ { text: "REMOVE" } ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
		}
    }
    else return;

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_D1" },
            { type: "GRID", id: "grdData_D2" }
			//, { type: "GRID", id: "grdData_File1" }
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
        	if (this.NAME == "plan_no") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 
            }
        });
    });

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
                                voc_no: gw_com_api.getValue("grdData_D1", "selected", "voc_no", true)
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