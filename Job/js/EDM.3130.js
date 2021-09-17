//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : EDM 등록현황
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

    //==== entry point. (pre-process section)
    ready: function () {

        // initialize page.
        gw_com_DX.register();	// for chart
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");
        
        v_global.logic.updown = "EDM-DOWN";
        v_global.logic.biz = { cd: "BIZ", title: "◈ 업무 영역별 ◈" };
        v_global.logic.doc = { cd: "DOC", title: "◈ 문서 분류별 ◈" };
        v_global.logic.usr = { cd: "USR", title: "◈ 개인별 ◈" };
        v_global.logic.chart1 = v_global.logic.biz;
        v_global.logic.chart2 = v_global.logic.doc;
        v_global.logic.chart3 = v_global.logic.usr;

        // set data for DDDW List
        var args = { request: [
				{ type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH}] 
				},
				{ type: "INLINE", name: "통계기준",
				    data: [
						{ title: "업무별", value: "BIZ" },
						{ title: "분류별", value: "DOC" },
						{ title: "개인별", value: "USR" }
					]
				}
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
        	
        	// UI 및 Event 정의
            gw_job_process.UI();
	        gw_job_process.procedure();
	        
	        // Search Option 초기값
	        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
	        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
	        gw_com_api.setValue("frmOption", 1, "dept_area", "SMC" );	//gw_com_module.v_Session.DEPT_AREA
	        gw_com_api.setValue("frmOption", 1, "chart_cd", "BIZ" );
        }

    },

    //==== manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 닫기
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        
        //==== Search Option : NCR 통계
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "chart_cd", validate: true },
            content: { row: [
                    { element: [
			            { name: "ymd_fr", label: { title: "조회기간 :" }, mask: "date-ymd",
			                style: { colfloat: "floating" },
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
			            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
                        { name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select", size: 10, maxlength: 20 , data: { memory: "DEPT_AREA_FIND" } }
                        },
                        { name: "chart_cd", label: { title: "통계기준 :" },
                            editable: { type: "select", size: 10, maxlength: 20 , data: { memory: "통계기준" } }
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

        //==== Main Grid : 
        var args = { targetid: "grdData_Main", query: "EDM_3130_M_1", title: "분류1",
            caption: true, width: 325, height: 249, pager: true, show: true,
            element: [
				{ header: "분류명", name: "category", width: 175, align: "center" },
				{ header: "건수", name: "value", width: 60, align: "center", mask: "currency-int" },
				{ header: "비율(%)", name: "rate", width: 60, align: "center", mask: "currency-int" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart_cd", hidden: true },
				{ name: "dept_area", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //==== Main Chart : 
        var args = { targetid: "lyrChart_Main", query: "EDM_3130_M_1", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //==== Sub Grid : 
        var args = { targetid: "grdData_Sub1", query: "EDM_3130_M_1", title: "분류2",
            caption: true, width: 325, height: 249, pager: true, show: true,
            element: [
				{ header: "분류명", name: "category", width: 175, align: "center" },
				{ header: "건수", name: "value", width: 60, align: "center", mask: "currency-int" },
				{ header: "비율(%)", name: "rate", width: 60, align: "center", mask: "currency-int" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart_cd", hidden: true },
				{ name: "dept_area", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //==== Sub Chart : 
        var args = { targetid: "lyrChart_Sub1", query: "EDM_3130_M_1", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_2 }
        };
        gw_com_module.chartCreate(args);

        //==== Sub Grid : 
        var args = { targetid: "grdData_Sub2", query: "EDM_3130_M_1", title: "분류3",
            caption: true, width: 325, height: 249, pager: true, show: true,
            element: [
				{ header: "분류명", name: "category", width: 175, align: "center" },
				{ header: "건수", name: "value", width: 60, align: "center", mask: "currency-int" },
				{ header: "비율(%)", name: "rate", width: 60, align: "center", mask: "currency-int" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart_cd", hidden: true },
				{ name: "dept_area", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        //==== Sub Chart : 
        var args = { targetid: "lyrChart_Sub2", query: "EDM_3130_M_1", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_3 }
        };
        gw_com_module.chartCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 15, min: true },
				{ type: "GRID", id: "grdData_Sub1", offset: 15, min: true },
				{ type: "GRID", id: "grdData_Sub2", offset: 15, min: true }
			]
        };
        gw_com_module.objResize(args);

        gw_com_module.informSize();


    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main (조회, 닫기) ====
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_닫기(ui) { processClose(ui); }

        //==== Button Click : Search Option ====
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        function click_frmOption_실행(ui) { processRetrieve(ui); }
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { gw_com_api.hide("frmOption"); }

        //==== Grid Events : rowselected
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub1", grid: true, event: "rowselected", handler: rowselected_grdData };
        gw_com_module.eventBind(args);
        function rowselected_grdData(ui) { processLink(ui); }
        
        //==== Grid Events : rowdblclick
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub1", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub1", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub2", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub2", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_Main };
        gw_com_module.eventBind(args);
        function rowdblclick_grdData_Main(ui) { processDetail(ui); }


        //==== startup process.
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
function processDetail(param) {
	return;

    var SelRow = gw_com_api.getSelectedRow("grdData_Main")
    
//    if ( ProcStat == "완료" || ProcStat == "취소" ) {
//        gw_com_api.messageBox([ { text: status + " 자료이므로 수정할 수 없습니다." } ], 420);
//        return false;
//    }

    var args = { ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "EDM_3190", title: "Knowledge File List",
            param: [
                { name: "ymd_fr", value: gw_com_api.getValue("grdData_Main", "selected", "ymd_fr", true) },
                { name: "ymd_to", value: gw_com_api.getValue("grdData_Main", "selected", "ymd_to", true) },
                { name: "dept_area", value: gw_com_api.getValue("grdData_Main", "selected", "dept_area", true) },
                { name: "rcode", value: gw_com_api.getValue("grdData_Main", "selected", "rcode", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}

//----------
function processRetrieve(param) {

	// Validate Inupt Options
    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

	// 통계기준에 따른 Chart Code 및 Title 설정
	var ChartCode = gw_com_api.getValue("frmOption", 1, "chart_cd", false);
	if (ChartCode == "BIZ"){
        v_global.logic.chart1 = v_global.logic.biz;
        v_global.logic.chart2 = v_global.logic.usr;
        v_global.logic.chart3 = v_global.logic.doc;
	}
	else if (ChartCode == "DOC"){
        v_global.logic.chart1 = v_global.logic.doc;
        v_global.logic.chart2 = v_global.logic.biz;
        v_global.logic.chart3 = v_global.logic.usr;
	}
	else if (ChartCode == "USR"){
        v_global.logic.chart1 = v_global.logic.usr;
        v_global.logic.chart2 = v_global.logic.biz;
        v_global.logic.chart3 = v_global.logic.doc;
	}
	else return;

	// Retrieve 
    var args = { key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "chart_cd", argument: "arg_chart_cd" },
				{ name: "dept_area", argument: "arg_dept_area" }
			],
            argument: [
                { name: "arg_rcode", value: "" }
		    ],
            remark: [
	            { infix: "~",  element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "chart_cd"}] },
                { element: [{ name: "dept_area"}] }
		    ]
        },
        target: [
            { type: "GRID", id: "grdData_Main" },	//, focus: true, select: true
			{ type: "CHART", id: "lyrChart_Main" }
	    ],
        clear: [
			{ type: "GRID", id: "grdData_Sub1" },
			{ type: "CHART", id: "lyrChart_Sub1" },
            { type: "GRID", id: "grdData_Sub2" },
			{ type: "CHART", id: "lyrChart_Sub2" }
        ]
    };
    gw_com_module.objRetrieve(args);

	gw_com_api.setCaption("grdData_Main" , v_global.logic.chart1.title, true);
	gw_com_api.setCaption("grdData_Sub1" , v_global.logic.chart2.title, true);
	gw_com_api.setCaption("grdData_Sub2" , v_global.logic.chart3.title, true);
	
}
//----------
function processLink(param) {
	var args = {};
	
	if (param.object == "grdData_Main") {

	    args = {
	        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
	            element: [
				    { name: "rcode", argument: "arg_rcode" },
	                { name: "ymd_fr", argument: "arg_ymd_fr" },
				    { name: "ymd_to", argument: "arg_ymd_to" },
					{ name: "dept_area", argument: "arg_dept_area" }
			    ],
	            argument: [
	                { name: "arg_chart_cd", value: v_global.logic.chart2.cd }
			    ]
	        },
	        target: [
	            { type: "GRID", id: "grdData_Sub1" },
			    { type: "CHART", id: "lyrChart_Sub1" }
		    ],
	        clear: [
	            { type: "GRID", id: "grdData_Sub2" },
			    { type: "CHART", id: "lyrChart_Sub2" }
		    ],
	        key: param.key
	    };
	}
	else if (param.object == "grdData_Sub1") {

	    args = {
	        source: { type: "GRID", id: "grdData_Sub1", row: "selected", block: true,
	            element: [
				    { name: "rcode", argument: "arg_rcode" },
	                { name: "ymd_fr", argument: "arg_ymd_fr" },
				    { name: "ymd_to", argument: "arg_ymd_to" },
					{ name: "dept_area", argument: "arg_dept_area" }
			    ],
	            argument: [
	                { name: "arg_chart_cd", value: v_global.logic.chart3.cd }
			    ]
	        },
	        target: [
	            { type: "GRID", id: "grdData_Sub2" },
			    { type: "CHART", id: "lyrChart_Sub2" }
		    ],
	        key: param.key
	    };
	}
	else return;
		
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
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
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//