//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 예약 및 가동 내역
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
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_fr", label: { title: "기준일자 :" },
				          editable: { type: "text", size: 7, maxlength: 10 }
				        },
                        { name: "eq_cd", label: { title: "호기 :" },
                            editable: { type: "text", size: 12, maxlength: 50 }
                        },
                        { name: "eq_module", label: { title: "Module :" },
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
        var args = { targetid: "grdData_Main", query: "EOM_2160_M_1", title: "예약 내역",
            caption: true, pager: true, show: true, height: "120", selectable: true, number: true,
            //editable: { bind: "select", focus: "fr_dt", validate: true },
            element: [
				{ header: "호기", name: "eq_no", width: 70, align: "center" },
				{ header: "설비명", name: "eq_nm", width: 80, align: "center" },
				{ header: "Module", name: "eq_module", width: 60, align: "center" },
				{ header: "담당자", name: "plan_user_nm", width: 80, align: "center" },
				{ header: "시작시각", name: "fr_time", width: 80, align: "center", mask: "time-hm" },
				{ header: "종료시각", name: "to_time", width: 80, align: "center", mask: "time-hm" },
				{ header: "Project", name: "proj_no", width: 80, align: "center" },
				{ header: "사용목적", name: "plan_rmk", width: 300, align: "left" },
				{ header: "수정자", name: "upd_usr", width: 70, align: "center" },
				{ header: "수정일시", name: "upd_dt", width: 120, align: "center" },
				{ name: "plan_user", hidden: true },
				{ name: "eq_cd", hidden: true },
				{ name: "plan_no", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_Sub", query: "EOM_2160_S_1", title: "가동 내역",
            caption: true, height: "300", pager: true, show: true, selectable: true, number: true,
            //editable: { multi: true, bind: "select", focus: "dept_nm", validate: true },
            element: [
				{ header: "호기", name: "eq_cd", width: 70, align: "center", editable: { type: "hidden"} },
				{ header: "Module", name: "eq_module", width: 60, align: "center", editable: { type: "hidden"} },
                { header: "시작일", name: "fr_date", width: 120, align: "center", mask: "date-ymd"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "시작일" } } 
                },
				{ header: "시각", name: "fr_time", width: 80, align: "center", mask: "time-hm"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "시작시각" } } 
                },
                { header: "종료일", name: "to_date", width: 120, align: "center", mask: "date-ymd"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "종료일" } } 
                },
				{ header: "시각", name: "to_time", width: 80, align: "center", mask: "time-hm"
                	, editable: { type: "text", bind: "create"
                		, validate: { rule: "required", message: "종료시각" } } 
                },
                { header: "상태구분", hidden: true, name: "eq_stat", width: 120, align: "center"
					, format: { type: "select", data: { memory: "상태구분" } } 
                	, editable: { type: "select", bind: "create", data: { memory: "상태구분" } } 
                },
                { header: "Wafer 사용량", hidden: true, name: "wafer_cnt", width: 100, align: "center"
                	, editable: { type: "hidden"} },
                { header: "확인", hidden: true, name: "chk_yn", width: 80, align: "center"
                    , format: { type: "checkbox", value: 1, offval: 0 }
                    , editable: { type: "checkbox", value: 1, offval: 0 }
                },
                { hidden: true, hidden: true, header: "확인자", name: "chk_user", width: 80, align: "center"
                	, editable: { type: "hidden"} },
                { header: "비고", name: "chk_rmk", width: 280, align: "center"
                	, editable: { type: "hidden"} },
                { hidden: true, header: "확인일시", name: "chk_dt", width: 120, align: "center"
                	, editable: { type: "hidden"} },
				{ name: "root_no", hidden: true, editable: { type: "hidden"} },
				{ name: "root_seq", hidden: true, editable: { type: "hidden"} },
				{ name: "job_no", hidden: true, editable: { type: "hidden"} },
				{ name: "log_dt", hidden: true, editable: { type: "hidden"} },
				{ header: "시작일시", name: "fr_dt", hidden: true, width: 120, editable: { type: "hidden"} },
				{ header: "종료일시", name: "to_dt", hidden: true, width: 120, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate(""));

        v_global.logic.key = "";
        if (v_global.process.param) {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("eq_cd");
            v_global.logic.eq_cd = gw_com_api.getPageParameter("eq_cd");
            v_global.logic.eq_module = gw_com_api.getPageParameter("eq_module");
            v_global.logic.fr_date = gw_com_api.getPageParameter("fr_date");
            gw_com_api.setValue("frmOption", 1, "eq_cd", v_global.logic.eq_cd );
            gw_com_api.setValue("frmOption", 1, "eq_module", v_global.logic.eq_module );
            
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
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    //if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "eq_cd", argument: "arg_eq_cd" },
                { name: "eq_module", argument: "arg_eq_module" }
            ],
            remark: [
		        { element: [{ name: "ymd_fr" }] },
		        { element: [{ name: "eq_cd" }] },
		        { element: [{ name: "eq_module" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true },
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
function checkCRUD(param) {
	if (param.objid == undefined) 
		return "none";
	else if (param.grid)
		return gw_com_api.getCRUD(param.objid, param.row, param.grid);
    else
    	return gw_com_api.getCRUD(pram.objid);
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