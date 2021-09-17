//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 가동 실적 등록
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
                { type: "PAGE", name: "WaferMaker", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "EOM113"}] 
                },
                { type: "INLINE", name: "상태구분",
                    data: [ { title: "Run", value: "Run" }
                    	  , { title: "Idle(Wafer계측)", value: "Idle(Wafer계측)" }
                    ]
                },
                { type: "INLINE", name: "사용구분",
                    data: [ { title: "Run", value: "Run" }
                    	  , { title: "Modify", value: "Modify" }
                    	  , { title: "Idle(Wafer계측)", value: "Idle(Wafer계측)" }
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
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

//        var args = { targetid: "lyrMenu_Sub", type: "FREE",
//            element: [
//				{ name: "추가", value: "추가" },
//				{ name: "삭제", value: "삭제" }
//            ]
//        };
//        gw_com_module.buttonMenu(args);
        

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
                            editable: { type: "text" }
                        },
			            { name: "실행", value: "실행", act: true, format: { type: "button" } },
			            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ], align: "right"
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Form : Main ====
        var args = { targetid: "frmData_Main", query: "EOM_2130_M_1", type: "TABLE", title: "예약 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: { width: { label: 80, field: 140 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "호기", format: { type: "label"} },
                        { name: "eq_no" },
                        { header: true, value: "설비명", format: { type: "label"} },
                        { name: "eq_nm" },
                        { header: true, value: "Project", format: { type: "label"} },
                        { name: "proj_no" },
                        { header: true, value: "예약자", format: { type: "label"} },
                        { name: "plan_user" }
	                    ]
                    },
                    { element: [
                        { header: true, value: "예약시작일", format: { type: "label"} },
                        { name: "fr_date", mask: "date-ymd", align: "center",
                        	editable: { type: "text", validate: { rule: "required" }} 
						},
                        { header: true, value: "예약종료일", format: { type: "label"} },
                        { name: "to_date", mask: "date-ymd", align: "center",
                        	editable: { type: "text", validate: { rule: "required" }} 
						},
                        { header: true, value: "사용목적", format: { type: "label"} },
                        { name: "plan_rmk", style: { colspan: 3 },
                            format: { type: "text", width: 350 },
                            editable: { type: "text", width: 350 }
                        },
                        { name: "plan_no", hidden: true },
                        { name: "eq_cd", hidden: true }
	                    ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Main ====
        var args = { targetid: "grdData_Main", query: "EOM_2130_M_2", title: "상세 가동 계획",
            caption: false, pager: true, show: true, height: "100%", //width: 580, //number: true,
            //editable: { bind: "select", focus: "fr_dt", validate: true },
            element: [
                { header: "가동일자", name: "fr_date", width: 80, mask: "date-ymd", align: "center",
                    editable: { type: "text", validate: { rule: "required" }} 
				},
				{ header: "시작", name: "fr_time", width: 60, align: "center", editable: { type: "text"}  },
				{ header: "종료", name: "to_time", width: 60, align: "center"
					, editable: { type: "text"}  
				},
				{ header: "사용구분", name: "use_type", width: 80, align: "center"
					, format: { type: "select", data: { memory: "사용구분" } } 
					, editable: { type: "select", validate: { rule: "required"} 
						, data: { memory: "사용구분" }} 
				},
				{ header: "Module1", name: "eq_module1", width: 60, align: "center", editable: { type: "text"}  },
				{ header: "Module2", name: "eq_module2", width: 60, align: "center", editable: { type: "text"}  },
				{ header: "Module3", name: "eq_module3", width: 60, align: "center", editable: { type: "text"}  },
				{ header: "Module4", name: "eq_module4", width: 60, align: "center", editable: { type: "text"}  },
				{ header: "예약번호", name: "plan_no", hidden: true, editable: { type: "hidden"}  },
				{ header: "예약번호", name: "plan_seq", hidden: true, editable: { type: "hidden"}  }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_Sub", query: "EOM_2130_S_1", title: "가동 내역",
            caption: true, height: "100%", pager: false, show: false, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "dept_nm", validate: true },
            element: [
				{ header: "Module", name: "eq_module", width: 60, align: "center", editable: { type: "hidden"} },
                { header: "시작일", name: "fr_date", width: 150, align: "center", mask: "date-ymd"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "시작일" } } 
                },
				{ header: "시각", name: "fr_time", width: 60, align: "center", mask: "time-hm"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "시작시각" } } 
                },
                { header: "종료일", name: "to_date", width: 150, align: "center", mask: "date-ymd"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "종료일" } } 
                },
				{ header: "시각", name: "to_time", width: 60, align: "center", mask: "time-hm"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "종료시각" } } 
                },
                { header: "상태구분", name: "eq_stat", width: 120, align: "center"
					, format: { type: "select", data: { memory: "상태구분" } } 
                	, editable: { type: "select", bind: "create", data: { memory: "상태구분" } } 
                },
                { header: "Wafer 사용량", name: "wafer_cnt", width: 100, align: "center"
                	, editable: { type: "hidden"} },
                { header: "확인", name: "chk_yn", width: 80, align: "center"
                    , format: { type: "checkbox", value: 1, offval: 0 }
                    , editable: { type: "checkbox", value: 1, offval: 0 }
                },
                { hidden: true, header: "확인자", name: "chk_user", width: 80, align: "center"
                	, editable: { type: "hidden"} },
                { header: "비고", name: "chk_rmk", width: 280, align: "center"
                	, editable: { type: "hidden"} },
                { hidden: true, header: "확인일시", name: "chk_dt", width: 120, align: "center"
                	, editable: { type: "hidden"} },
				{ name: "eq_cd", hidden: true, editable: { type: "hidden"} },
				{ name: "root_no", hidden: true, editable: { type: "hidden"} },
				{ name: "root_seq", hidden: true, editable: { type: "hidden"} },
				{ name: "job_no", hidden: true, editable: { type: "hidden"} },
				{ name: "log_dt", hidden: true, editable: { type: "hidden"} },
				{ header: "시작일시", name: "fr_dt", hidden: true, width: 120, editable: { type: "hidden"} },
				{ header: "종료일시", name: "to_dt", hidden: true, width: 120, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_D1", query: "EOM_2130_D_1", title: "Wafer 사용 내역",
            caption: true, height: "300", pager: true, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "maker_cd", validate: true },
            element: [
				{ header: "Module", name: "eq_module", width: 60, align: "center", editable: { type: "hidden"} },
                { header: "Method No.", name: "method_no", width: 60, align: "center"
                	, editable: { type: "hidden"} },
                { header: "Process Start", name: "fr_dt", width: 150, align: "center" },
                { header: "Process End", name: "to_dt", width: 150, align: "center" },
                { header: "소요시간", name: "time_span", width: 80, align: "center" },
                { header: "수량", name: "wafer_cnt", width: 60, align: "center" },
                { header: "Maker", name: "maker_cd", width: 100, align: "center"
					, format: { type: "select", data: { memory: "WaferMaker" } } 
					, editable: { type: "select", validate: { rule: "required"} 
						, data: { memory: "WaferMaker", unshift: [ { title: "-", value: "" } ] }} 
                },
                { header: "재사용", name: "reuse_yn", width: 60, align: "center"
                    , format: { type: "checkbox", value: 1, offval: 0 }
                    , editable: { type: "checkbox", value: 1, offval: 0 }
                },
                { header: "Receipe Name", name: "rcp_nm", width: 150, align: "center" },
				{ name: "eq_cd", hidden: true, editable: { type: "hidden"} },
				{ name: "job_no", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8, min: true },
                { type: "GRID", id: "grdData_Main", offset: 8, min: true },
                { type: "GRID", id: "grdData_Sub", offset: 8, min: true },
                { type: "GRID", id: "grdData_D1", offset: 8, min: true }
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
//        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processInsert };
//        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
//        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
//        gw_com_module.eventBind(args);
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
//        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: processLink };
//        gw_com_module.eventBind(args);
//        var args = { targetid: "grdData_Sub", grid: true, event: "itemchanged", handler: eventItemChanged };
//        gw_com_module.eventBind(args);


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
            
	        if (v_global.logic.key == "") 
	        	processInsert({ object: "Main" }); // 신규 등록
	        else 
	        	processRetrieve({}); //수정 및 조회
        }

        gw_com_module.startPage();
        gw_com_api.hide("frmOption");

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
function eventItemChanged(ui) {
	
	if (ui.object == "grdData_Sub"){
		//---- Check Input Values
		// Date Format (YYYYMMDD)
		if (ui.element == "fr_date" || ui.element == "to_date"){
			var sVal = gw_com_api.getValue(ui.object, ui.row, ui.element, true); 
			if (sVal.length != 0 && sVal.length != 8){
	        	gw_com_api.messageBox( [{text: "날짜 형식이 잘못 되었습니다"}], 420 );
				return false;
			}
		}
		// Time Format (HHMI)
		if (ui.element == "fr_time" || ui.element == "to_time"){
			var sVal = gw_com_api.getValue(ui.object, ui.row, ui.element, true); 
			if (sVal.length != 0 && sVal.length != 4){
	        	gw_com_api.messageBox( [{text: "시각 형식이 잘못 되었습니다"}], 420 );
				return false;
			}
		}
		
		//---- change other values
		// set 시작일시 from Date & Time
		var sType = gw_com_api.getValue(ui.object, ui.row, "eq_stat", true); 
		if (sType != "Run"){
			if (ui.element == "fr_date" || ui.element == "fr_time"){
				var sDate = gw_com_api.getValue(ui.object, ui.row, "fr_date", true); 
				var sTime = gw_com_api.getValue(ui.object, ui.row, "fr_time", true);
				var sDt = sDate.substr(0,4) + "-" + sDate.substr(4,2) + "-" + sDate.substr(6,2) + " "
						+ sTime.substr(0,2) + ":" + sTime.substr(2,2) + ":" + "00" ;
				gw_com_api.setValue(ui.object, ui.row, "fr_dt", sDt, true);
				gw_com_api.setValue(ui.object, ui.row, "job_no", sDate + sTime + "00", true);
			}
			// set 종료일시 from Date & Time
			else if (ui.element == "to_date" || ui.element == "to_time"){
				var sDate = gw_com_api.getValue(ui.object, ui.row, "to_date", true); 
				var sTime = gw_com_api.getValue(ui.object, ui.row, "to_time", true);
				var sDt = sDate.substr(0,4) + "-" + sDate.substr(4,2) + "-" + sDate.substr(6,2) + " "
						+ sTime.substr(0,2) + ":" + sTime.substr(2,2) + ":" + "59" ;
				gw_com_api.setValue(ui.object, ui.row, "to_dt", sDt, true);
			}
		}
	}  
}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    //if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "plan_no", argument: "arg_plan_no" }
            ],
            remark: [
		        { element: [{ name: "plan_no" }] }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_Sub" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

	var args = { };
	if (param.object == "grdData_Main"){
	    args = {
	        source: { type: "GRID", id: "grdData_Main", row: "selected",
	            element: [
	                { name: "plan_no", argument: "arg_plan_no" },
	                { name: "plan_seq", argument: "arg_plan_seq" }
	            ]
	        },
	        target: [
	            { type: "GRID", id: "grdData_D1", focus: true, select: true }
	        ],
//	        clear: [
//	            { type: "GRID", id: "grdData_D1" }
//	        ],
	        key: param.key
	    };
	}
	else if (param.object == "grdData_Sub"){
	    args = {
	        source: { type: "GRID", id: "grdData_Sub", row: "selected",
	            element: [
	                { name: "eq_cd", argument: "arg_eq_cd" },
	                { name: "eq_module", argument: "arg_eq_module" },
	                { name: "job_no", argument: "arg_job_no" },
	                { name: "fr_dt", argument: "arg_fr_dt" }
	            ]
	        },
	        target: [
	            { type: "GRID", id: "grdData_D1" }
	        ],
	        key: param.key
	    };
	}  
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
    	
    	//if (!checkManipulate({ sub: true })) return false;

        var args = { targetid: "grdData_Sub", edit: true, updatable: true,
            data: [
                { name: "root_no", value: gw_com_api.getValue("grdData_Main", "selected", "plan_no", true) }
              , { name: "root_seq", value: gw_com_api.getValue("grdData_Main", "selected", "plan_seq", true) }
              , { name: "eq_cd", value: gw_com_api.getValue("frmData_Main", 1, "eq_cd", false) }
              , { name: "eq_module", value: gw_com_api.getValue("grdData_Main", "selected", "eq_module1", true) }
              , { name: "eq_stat", value: "Idle(Wafer계측)" }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {	// 요구서 추가
        var args = { targetid: "frmData_Main", edit: true, updatable: true,
            data: [
////                { name: "fr_dt", value: gw_com_api.getDate("") },
////                { name: "to_dt", value: gw_com_api.getDate("") },
////                { name: "eq_no", value: v_global.logic.eq_no },
////                { name: "eq_nm", value: v_global.logic.eq_nm },
                { name: "plan_user", value: gw_com_module.v_Session.USR_ID }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" }
            ]
        };
        gw_com_module.formInsert(args);
        
        // 상세 추가
        processInsert({ object: "lyrMenu_Sub" });
    }
}
//----------
function checkCRUD(param) {
	if (param.objid == undefined) 
		return "none";
	else if (param.grid)
		return gw_com_api.getCRUD(param.objid, param.row, param.grid);
    else
    	return gw_com_api.getCRUD(pram.objid);
}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if(ui.object == "lyrMenu_Main") {
		if (!checkManipulate({})) return;
	            
	    var status = checkCRUD({objid: "grdData_Main", grid: true});
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

    var args = { url: "COM",
        target: [
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_D1" }
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