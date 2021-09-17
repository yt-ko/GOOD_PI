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
        var args = {
            request: [
                {
                    type: "PAGE", name: "연구설비", query: "DDDW_EOM_EQ",
                    param: [{ argument: "arg_hcode", value: "ALL" }]
                },
                {
                    type: "PAGE", name: "설비모듈", query: "DDDW_EOM_EQMODULE",
                    param: [{ argument: "arg_hcode", value: "" }]
                },
                {
                    type: "PAGE", name: "WaferMaker", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "EOM113" }]
                },
                {
                    type: "INLINE", name: "상태구분",
                    data: [
                        { title: "Run", value: "Run" },
                        { title: "Idle(Wafer계측)", value: "Idle(Wafer계측)" }
                    ]
                },
                {
                    type: "INLINE", name: "사용구분",
                    data: [
                        { title: "Run", value: "Run" },
                        { title: "Modify", value: "Modify" },
                        { title: "Idle(Wafer계측)", value: "Idle(Wafer계측)" },
                        { title: "취소", value: "취소" }
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
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Oprion : Form ====
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "eq_no", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    style: { colfloat: "floating" }, mask: "date-ymd",
                                    name: "ymd_fr", label: { title: "기준일자 :" },
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "ymd_to", label: { title: "~" },
                                    mask: "date-ymd",
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "eq_cd", label: { title: "호기 :" },
                                    editable: {
                                        type: "select", data: { memory: "연구설비", unshift: [{ title: "-", value: "%" }] },
                                        change: [{ name: "eq_module", memory: "설비모듈", key: ["eq_cd"] }]
                                    }
                                },
                                {
                                    name: "eq_module", label: { title: "Module :" },
                                    editable: { type: "select", width: 90, data: { memory: "설비모듈", key: ["eq_cd"] } }
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

        //==== Grid : Main ====
        var args = {
            targetid: "grdData_Main", query: "EOM_2164_M_1", title: "Process 외 실적 내역",
            caption: false, pager: true, show: true, height: "450", selectable: true, number: true,
            //editable: { bind: "select", focus: "fr_dt", validate: true },
            element: [
				{ header: "호기", name: "eq_cd", width: 70, align: "center" },
				{ header: "Module", name: "eq_module", width: 60, align: "center" },
				{ header: "대분류", name: "status_tp1_nm", width: 80, align: "center" },
				{ header: "중분류", name: "status_tp2_nm", width: 100, align: "left" },
				{ header: "소분류", name: "status_tp3_nm", width: 100, align: "left" },
				{ header: "상세분류", name: "status_tp4_nm", width: 100, align: "left" },
                { header: "실적일자", name: "fr_date", width: 80, align: "center", mask: "date-ymd" },
                //{ header: "실적시간", name: "fr_time", width: 60, align: "center", mask: "time-hm" },
                //{ header: "종료일", name: "to_date", width: 80, align: "center", mask: "date-ymd" },
                //{ header: "시각(E)", name: "to_time", width: 60, align: "center", mask: "time-hm" },
				{ header: "실적시간", name: "stat_hour", width: 60, align: "right", mask: "numeric-float1" },
                { header: "Wafer 사용매수", name: "wafer", width: 100, align: "right", mask: "numeric-int" },
				{ header: "Description", name: "issue_rmk", width: 300, align: "left" },
				{ header: "조치사항", name: "unit_rmk", width: 300, align: "left" },
				{ name: "status_tp1", hidden: true },
				{ name: "status_tp2", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_Sub", query: "EOM_2162_S_1", title: "Wafer 사용 내역",
            caption: true, height: "300", pager: true, show: false, selectable: true, number: true,
            //editable: { multi: true, bind: "select", focus: "dept_nm", validate: true },
            element: [
				{ header: "호기", name: "eq_cd", width: 60, align: "center" },
				{ header: "Module", name: "eq_module", width: 60, align: "center" },
                { header: "Job No.", name: "nob_no", width: 80, align: "center" },
                { header: "Method No.", name: "method_no", width: 60, align: "center" },
                { header: "Process Start", name: "fr_dt", width: 150, align: "center" },
                { header: "Process End", name: "to_dt", width: 150, align: "center" },
                { header: "소요시간", name: "time_span", width: 80, align: "center" },
                { header: "수량", name: "wafer_cnt", width: 60, align: "center" },
                { header: "Maker", name: "maker_cd", width: 100, align: "center"
					, format: { type: "select", data: { memory: "WaferMaker" } } 
                },
                { header: "재사용", name: "reuse_yn", width: 60, align: "center"
                    , format: { type: "checkbox", value: 1, offval: 0 }
                },
                { header: "Receipe Name", name: "rcp_nm", width: 150, align: "center" }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
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
        //var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        //gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 0 }));

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
                { name: "ymd_to", argument: "arg_ymd_to" },
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
            { type: "GRID", id: "grdData_Main", focus: true }
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
	                { name: "fr_date", argument: "arg_ymd_fr" },
	                { name: "eq_cd", argument: "arg_eq_cd" },
	                { name: "eq_module", argument: "arg_eq_module" }
	            ]
	        },
	        target: [
	            { type: "GRID", id: "grdData_Sub" }
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