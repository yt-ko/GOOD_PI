//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 연구소 설비 Test 등록
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
                { type: "PAGE", name: "설비모듈", query: "DDDW_EOM_EQMODULE",
                    param: [{ argument: "arg_hcode", value: "ALL"}] 
                },
                { type: "INLINE", name: "현상분류",
                    data: [ { title: "Test", value: "4011" }] 
                },
                { type: "PAGE", name: "상세분류", query: "dddw_zcoded2",
                    param: [{ argument: "arg_hcode", value: "EOM112"}] 
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

        var args = { targetid: "lyrMenu_File1", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
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
			            { name: "ymd_to", label: { title: "~" },
			                mask: "date-ymd",
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
        var args = { targetid: "grdData_Main", query: "EOM_2150_M_1", title: "설비 Test 이력",
            caption: false, pager: true, show: true, height: 160, //width: 580, //number: true,
            //editable: { bind: "select", focus: "fr_dt", validate: true },
            element: [
				{ header: "호기", name: "eq_no", width: 70, align: "center" },
				{ header: "설비명", name: "eq_nm", width: 80, align: "center" },
                { header: "시작일시", name: "fr_dt", width: 80, align: "center" },
                { header: "조치일시", name: "to_dt", width: 80, align: "center" },
				{ header: "Module1", name: "eq_module1", width: 60, align: "center" },
				{ header: "Module2", name: "eq_module2", width: 60, align: "center" },
				{ header: "Module3", name: "eq_module3", width: 60, align: "center" },
				{ header: "Module4", name: "eq_module4", width: 60, align: "center" },
				{ name: "eq_cd", hidden: true },
				{ name: "fr_date", hidden: true },
				{ name: "fr_time", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Form : Main ====
        var args = { targetid: "frmData_Sub", query: "EOM_2150_S_1", type: "TABLE", title: "Test 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: { width: { label: 80, field: 150 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "설비", format: { type: "label"} },
                        { name: "eq_cd",
                            editable: { type: "select", width: 140, data: { memory: "연구설비" }
                            	, change: [ { name: "eq_module1", memory: "설비모듈", key: [ "eq_cd" ] }
                            		, { name: "eq_module2", memory: "설비모듈", key: [ "eq_cd" ] }
                            		, { name: "eq_module3", memory: "설비모듈", key: [ "eq_cd" ] }
                            		, { name: "eq_module4", memory: "설비모듈", key: [ "eq_cd" ] }
                            		] 
                            	}
                        },
                        { header: true, value: "Project", format: { type: "label"} },
                        { name: "proj_no", editable: { type: "text" } },
                        { header: true, value: "현상분류", format: { type: "label"} },
                        { name: "status_tp1", editable: { type: "text", readonly: true } },
                        { header: true, value: "상세분류", format: { type: "label"} },
                        { name: "status_tp2", editable: { type: "text", readonly: true } }
	                ]
                    },
                    { element: [
                        { header: true, value: "Module", format: { type: "label"} },
                        { name: "eq_module1", format: { width: 90 },
                            style: { colspan: 3, colfloat: "float" },
                            editable: { type: "select", width: 90, data: { memory: "설비모듈", key: ["eq_cd"] } }
                        },
                        { name: "eq_module2", format: { width: 90 },
                            style: { colfloat: "floating" },
                            editable: { type: "select", width: 90, data: { memory: "설비모듈", key: ["eq_cd"] } }
                        },
                        { name: "eq_module3", format: { width: 90 },
                            style: { colfloat: "floating" },
                            editable: { type: "select", width: 90, data: { memory: "설비모듈", key: ["eq_cd"] } }
                        },
                        { name: "eq_module4", format: { width: 90 },
                            style: { colfloat: "floated" },
                            editable: { type: "select", width: 90, data: { memory: "설비모듈", key: ["eq_cd"] } }
                        },
                        { header: true, value: "시작일시", format: { type: "label"} },
                        { name: "fr_date", mask: "date-ymd", align: "center",
                            style: { colfloat: "float" },
                            editable: { type: "text", width: 100, validate: { rule: "required" }} 
						},
                        { name: "fr_time", mask: "time-hm", align: "center", 
                        	style: { colfloat: "floated" },
                        	editable: { type: "text", width: 40, validate: { rule: "required" }} 
						},
                        { header: true, value: "종료일시", format: { type: "label"} },
                        { name: "to_date", mask: "date-ymd", align: "center",
                            style: { colfloat: "float" },
                        	editable: { type: "text", width: 100 } 
						},
                        { name: "to_time", mask: "time-hm", align: "center", 
                        	style: { colfloat: "floated" },
                        	editable: { type: "text", width: 40 } 
						}
	                    ]
                    },
                    { element: [
                        { header: true, value: "Description", format: { type: "label"} },
                        { name: "issue_rmk", style: { colspan: 5 },
                            format: { type: "text", width: 600 },
                            editable: { type: "text", width: 600}
                        },
                        { header: true, value: "등록자", format: { type: "label"} },
                        { name: "issue_user_nm", editable: { type: "hidden" } },
                        { name: "issue_user", hidden: true, editable: { type: "hidden" } },
                        { hidden: true, name: "data_key", editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Attach File Grid : 첨부 파일
        var args = { targetid: "grdData_File1", query: "DLG_FILE_ZFILE_V", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 250, align: "left" },
				{ header: "등록부서", name: "upd_dept", width: 100, align: "center" },
				{ header: "등록자", name: "upd_usr", width: 60, align: "center" },
				{ header: "장비군", name: "file_group1", width: 80, align: "center", hidden: true },
				{ header: "업무구분", name: "file_group2", width: 80, align: "center" },
				{ header: "문서분류", name: "file_group3", width: 80, align: "center" },
				{ header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
				{ header: "Category", name: "file_group5", width: 80, align: "center", hidden: true },
				{ header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{ header: "파일설명", name: "file_desc", width: 380, align: "left",
				    editable: { type: "text" }
				},
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden"} }
			]
        };
        gw_com_module.gridCreate(args);

        //==== File Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8, min: true },
                { type: "FORM", id: "frmData_Sub", offset: 8, min: true },
                { type: "GRID", id: "grdData_File1", offset: 8, min: true }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { gw_com_api.hide("frmOption"); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);

        //==== 첨부파일 : 추가/삭제/Down ====
        var args = { targetid: "lyrMenu_File1", element: "추가", event: "click", handler: processFileUpload };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_File1", element: "삭제", event: "click", handler: processFileDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: processFileDownLoad };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -10 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 0 }));

        v_global.logic.key = "";
        if (v_global.process.param) {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("eq_cd");
            v_global.logic.eq_cd = gw_com_api.getPageParameter("eq_cd");
            v_global.logic.eq_module = gw_com_api.getPageParameter("eq_module");
            v_global.logic.eq_no = gw_com_api.getPageParameter("eq_no");
            v_global.logic.eq_nm = gw_com_api.getPageParameter("eq_nm");
            gw_com_api.setValue("frmOption", 1, "eq_no", v_global.logic.eq_no );
            gw_com_api.setValue("frmOption", 1, "eq_nm", v_global.logic.eq_nm );
            
	       	processInsert({ object: "lyrMenu_Main" }); // 신규 등록
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
function checkCRUD(param) {
	if (param.grid == undefined) 
		return "none";
	else if (param.grid)
		return gw_com_api.getCRUD(param.objid, param.row, param.grid);
    else
    	return gw_com_api.getCRUD(param.objid, 1, false);
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
            { type: "FORM", id: "frmData_Sub" },
			{ type: "GRID", id: "grdData_File1" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    //if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "eq_no", argument: "arg_eq_no" },
                { name: "eq_nm", argument: "arg_eq_nm" }
            ],
            remark: [
	            { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "eq_no" }] },
		        { element: [{ name: "eq_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true }
        ],
        clear: [
            { type: "FORM", id: "frmData_Sub" }
           ,{ type: "GRID", id: "grdData_File1" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

	var args = { };
	if ( param.object == "grdData_Main" ) {
		args = {
			key: param.key,
			source: {
				type: "GRID", id: "grdData_Main", row: "selected",
				element: [
	                { name: "eq_cd", argument: "arg_eq_cd" },
	                { name: "fr_date", argument: "arg_fr_date" },
	                { name: "fr_time", argument: "arg_fr_time" }
				]
			},
			target: [
	            { type: "FORM", id: "frmData_Sub", focus: true }
			],
			handler_complete: processFileRetrieve
		};
	}
	else if ( param.object == "grdData_File1" ) processFileRetrieve( param );
	else return;
		
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
    	//if (!checkManipulate({ sub: true })) return false;

        var args = { targetid: "grdData_Main", edit: true, updatable: true,
            data: [
                { name: "plan_no", value: gw_com_api.getValue("frmData_Sub", 1, "plan_no", false) }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {
        var args = { targetid: "frmData_Sub", edit: true, updatable: true,
            data: [
                { name: "fr_date", value: gw_com_api.getDate("") },
                { name: "to_date", value: gw_com_api.getDate("") },
                { name: "fr_time", value: "0900" },
                { name: "to_time", value: "1800" },
                { name: "status_tp1", value: "Test" },
                { name: "eq_cd", value: v_global.logic.eq_cd },
                { name: "issue_user", value: gw_com_module.v_Session.USR_ID },
                { name: "issue_user_nm", value: gw_com_module.v_Session.USR_NM }
            ]
        };
        gw_com_module.formInsert(args);
        
    }
}
//----------
function processDelete(ui) {

    if(ui.object == "lyrMenu") {
    	// 삭제 여부 확인 후 삭제 처리 
	    v_global.process.handler = processRemove;
		checkRemovable(ui)
    }
    else return;

}
//----------
function checkRemovable(param) {
    closeOption({});
    var status = checkCRUD({main: true});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
}
//----------
function processRemove(param) {

    var args = {};
    args = { url: "COM",
        target: [
		    { type: "GRID", id: "grdData_Main"
                , key: [ { row: "selected"
                	, element: [ { name: "eq_cd" }, { name: "fr_date"}, { name: "fr_time"} ] } ]
            }
	    ],
        handler: { success: successRemove }
    };
    args.handler = { success: successRemove, param: param };
    gw_com_module.objRemove(args);
}
//----------
function successRemove(response, param) {
        var args = { targetid: "grdData_Main", row: "selected"
        }
        gw_com_module.gridDelete(args);
}
//---------- Save
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Sub" }
		  , { type: "GRID", id: "grdData_File1" }
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
        	if (this.NAME == "eq_cd") { 
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
//---------- 파일 추가/수정/Rev
function processFileUpload(param) {

    // Check
    var args = { objid: "frmData_Sub", row: 1, grid: false, itself: false };
    if (!checkManipulate(args)) return;
    var DataKey = gw_com_api.getValue("frmData_Sub", 1, "data_key", false);
    if ( DataKey == "" ) {
		gw_com_api.messageBox([ { text: "Master를 먼저 저장한 뒤에 파일을 추가하세요" } ]);
		return;
	}	

    // Parameter 설정
    v_global.logic.FileUp = { type: "EOM-TEST", key: DataKey, seq: -1,
        user: gw_com_module.v_Session.USR_ID, crud: "C",  rev: 0, revise: false
    };

    // Prepare File Upload Window
    args = { type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: v_global.logic.FileUp.type, 
    	width: 650, height: 260, open: true, locate: ["center", "top"] }; //

    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = { page: "DLG_FileUpload",
            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
        };
        gw_com_module.dialogueOpen(args);
    }
    
}
//---------- 파일 리스트 조회
function processFileRetrieve(param) {
    var DataKey = gw_com_api.getValue("frmData_Sub", "1", "data_key", false) ;
    var DataSeq = -1;
    var args = { 
        source: { type: "INLINE",
	        argument: [ { name: "arg_data_key", value: DataKey }, { name: "arg_data_seq", value: DataSeq } ]
        },
        target: [ { type: "GRID", id: "grdData_File1", select: true } ]
    };
    gw_com_module.objRetrieve(args);
}
//---------- 파일 다운로드
function processFileDownLoad(ui) { 
	gw_com_module.downloadFile({ source: { id: ui.object, row: ui.row }, targetid: "lyrDown" });
}
//---------- 파일 삭제
function processFileDelete(ui) {
	if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else return;
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
            if (param.data.page != gw_com_api.getPageID()) break; 
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmRemove: { 
                	if (param.data.result == "YES") processRemove(param); 
                } break;
            }
        } break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER: {
            closeDialogue({ page: param.from.page });
        	processFileRetrieve({}) ;
        } break;
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };
            switch (param.from.page) {
                case "DLG_FileUpload": { 
                	args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                	args.data = v_global.logic.FileUp;
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