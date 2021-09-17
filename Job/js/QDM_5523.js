//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 품질지수 : 설비 불량 지수
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

    ready: function () {

        // initialize page.
        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        v_global.logic.chart_subtype = "1";
        var args = { request: [
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "IEHM06" } ]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
				{ type: "PAGE", name: "제품분류", query: "dddw_zcode_f3",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
				{ type: "INLINE", name: "통계유형",
				    data: [
						{ title: "제품분류별", value: v_global.logic.chart_subtype }
						, { title: "제품유형별", value: "2" }
					]
				}
			],
            starter: start
        };
        gw_com_module.selectSet(args);


        //----------
        function start() {

            gw_job_process.UI();
			gw_job_process.procedure();

	        //== Set initial values
			// 직전월까지의 1년 기간 구하기
            var EndDate = gw_com_api.getDate( "" );
            EndDate = EndDate.substr( 0, 6 ) + "01";
            EndDate = gw_com_api.addDate( "d", -1, EndDate, "" );
			var StartDate = gw_com_api.addDate( "m", -12, EndDate, "" );
			StartDate = gw_com_api.addDate( "d", 1, StartDate, "" );
			if (StartDate.substr(4,2) == EndDate.substr(4,2))
				StartDate = gw_com_api.addDate( "d", 1, StartDate, "" );

			gw_com_api.setValue("frmOption", 1, "ymd_fr", StartDate);
			gw_com_api.setValue("frmOption", 1, "ymd_to", EndDate);
			gw_com_module.startPage();

			if (v_global.process.param != "") {	// Page Parameter 변수 저장
				v_global.logic.call_page = gw_com_api.getPageParameter("call_page");

				if (v_global.logic.call_page == "QDM_5520") {
					gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr") );
					gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to") );
					gw_com_api.setValue("frmOption", 1, "prod_group", gw_com_api.getPageParameter("prod_group") );
					gw_com_api.setValue("frmOption", 1, "prod_type1", gw_com_api.getPageParameter("prod_type1") );
					gw_com_api.setValue("frmOption", 1, "prod_type2", gw_com_api.getPageParameter("prod_type2") );
					gw_com_api.setValue("frmOption", 1, "prod_type3", gw_com_api.getPageParameter("prod_type3") );

	        		processRetrieve({ });
				}
			}

        }

    },   // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
				            { name: "ymd_fr", label: { title: "대상기간:" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "chart", label: { title: "통계유형 :" },
				                editable: { type: "select", data: { memory: "통계유형" } }
				            },
                            { name: "prod_group", label: { title: "제품군 :" },
                                editable: { type: "select",
                                    data: { memory: "제품군", unshift: [ { title: "전체", value: "" } ] }
                                }
                            }
				        ]
                    },
                    { element: [
				            { name: "prod_class1", label: { title: "제품분류 :" },
				                editable: { type: "select",
				                    data: { memory: "제품분류", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_class2",
				                editable: { type: "select",
				                    data: { memory: "제품분류", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_class3",
				                editable: { type: "select",
				                    data: { memory: "제품분류", unshift: [ { title: "전체", value: "" } ] }
				                }
				            }
				        ]
                    },
                    { element: [
				            { name: "prod_type1", label: { title: "제품유형 :" },
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_type2",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_type3",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            }
				        ]
                    },
				    { align: "right", element: [
				            { name: "실행", value: "실행", act: true, format: { type: "button" } },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
				        ]
				    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Main Grid : 설비 불량 지수 ====
        var args = {
            targetid: "grdData_Main", query: "QDM_5523_M_1", title: "설비 불량 지수",
            caption: true, width: 300, height: 180, pager: false, show: true,
            element: [
				{ name: "category", header: "설비유형", width: 130, align: "center" },
				{ name: "value", header: "건수", width: 50, align: "center" },
				//{ name: "rate", header: "처리건수", width: 50, align: "center" },
				{ name: "chart", hidden: true },
				{ name: "rcode1", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "prod_group", hidden: true },
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Main Chart : 설비 불량 지수 ====
        var args = {
            targetid: "lyrChart_Main", query: "QDM_5523_C_1", title: "설비 불량 지수", show: true,
            format: { view: "1", rotate: "0", reverse: "1", series: true },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //==== Sub Grid : 상세현황 ====
        var args = {
            targetid: "grdData_Sub", query: "QDM_5523_S_1", title: "상세 내역", 
            caption: true, show: true, width: 1120, height: 240, pager: true,
            element: [
				{ header: "관리번호",  name: "issue_no",  width: 90,  align: "center" },
				{ header: "발생일자",  name: "issue_dt",  width: 80,  align: "center", mask: "date-ymd" },
				{ header: "고객사",  name: "cust_nm",  width: 70,  align: "center" },
				{ header: "Line",  name: "cust_dept",  width: 80,  align: "center" },
				{ header: "고객설비명",  name: "cust_prod_nm",  width: 120,  align: "center" },
				{ header: "제품군", name: "prod_group", width: 60, align: "center" },
				{ header: "제품유형",  name: "prod_type",  width: 100,  align: "center" },
				{ header: "발생구분",  name: "issue_tp",  width: 100,  align: "center" },
				//{ header: "발생Module",  name: "prod_sub",  width: 80,  align: "center" },
				{ header: "Warranty",  name: "wrnt_io",  width: 60,  align: "center" }
				//{ header: "순번",  name: "seq",  width: 40,  align: "center" },
				//{ header: "교체구분",  name: "change_tp",  width: 80,  align: "center" },
				//{ header: "교체일자",  name: "change_dt",  width: 80,  align: "center", mask: "date-ymd" },
				//{ header: "부품상태",  name: "part_stat",  width: 60,  align: "center" },
				//{ header: "원인부품군",  name: "apart_tp",  width: 110,  align: "center" },
				//{ header: "원인부품",  name: "apart_cd",  width: 120,  align: "center" },
				//{ header: "원인부품명",  name: "apart_nm",  width: 200,  align: "left" },
				//{ header: "협력사",  name: "apart_maker",  width: 150,  align: "left" },
				//{ header: "모델",  name: "apart_model",  width: 150,  align: "center" },
				//{ header: "규격(REV)",  name: "apart_rev",  width: 150,  align: "center" },
				//{ header: "비고(REV)",  name: "apart_rmk",  width: 300,  align: "left" },
				//{ header: "원인부품 Ser.No.",  name: "apart_sno",  width: 150,  align: "center" },
				//{ header: "교체부품군",  name: "bpart_tp",  width: 110,  align: "center" },
				//{ header: "교체부품",  name: "bpart_cd",  width: 120,  align: "center" },
				//{ header: "교체부품명",  name: "bpart_nm",  width: 200,  align: "left" },
				//{ header: "교체부품 Ser.No.",  name: "bpart_sno",  width: 150,  align: "center" },
				//{ header: "협력사", name: "bpart_maker", width: 150, align: "left" },
				//{ header: "모델",  name: "bpart_model",  width: 150,  align: "center" },
				//{ header: "규격(REV)",  name: "bpart_rev",  width: 150,  align: "center" },
				//{ header: "비고(REV)",  name: "bpart_rmk",  width: 300,  align: "left" },
				//{ header: "교체내용",  name: "rmk",  width: 700,  align: "left" }
				//{ header: "구매요청", name: "charge_cs", width: 60, align: "center" }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 5 },
				//{ type: "LAYER", id: "lyrChart_Main", offset: 5 },
				{ type: "GRID", id: "grdData_Sub", offset: 5 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },   // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process : Define Events & Method
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //==== Grid Events
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "rowdblclick", handler: processLinkPage };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "rowkeyenter", handler: processLinkPage };
        gw_com_module.eventBind(args);

    }   // End of gw_job_process.procedure

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
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

     var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "chart", argument: "arg_chart" },
                { name: "prod_group", argument: "arg_prod_group" },
                { name: "prod_class1", argument: "arg_prod_class1" },
                { name: "prod_class2", argument: "arg_prod_class2" },
                { name: "prod_class3", argument: "arg_prod_class3" },
                { name: "prod_type1", argument: "arg_prod_type1" },
                { name: "prod_type2", argument: "arg_prod_type2" },
                { name: "prod_type3", argument: "arg_prod_type3" }
            ],
            remark: [
		        { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
		        { element: [{ name: "chart" }] },{ element: [{ name: "prod_group" }] },
		        { infix: " / ", element: [{ name: "prod_class1" }, { name: "prod_class2" }, { name: "prod_class3" }] },
		        { infix: " / ", element: [{ name: "prod_type1" }, { name: "prod_type2" }, { name: "prod_type3" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", select: true },
			{ type: "CHART", id: "lyrChart_Main" }
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

    var args = {
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "chart", argument: "arg_chart" },
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
                { name: "prod_group", argument: "arg_prod_group" },
                { name: "prod_type1", argument: "arg_prod_type1" },
                { name: "prod_type2", argument: "arg_prod_type2" },
                { name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "rcode1", argument: "arg_rcode1" }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Sub" }
		],
        key: param.key
    };
	gw_com_module.objRetrieve(args);
}
//----------
function processLinkPage(ui) {
    v_global.event.type = ui.type;
    v_global.event.object = ui.object;
    v_global.event.row = ui.row;
    v_global.event.element = ui.element;

    if (ui.object = "grdData_Sub") {
        var LinkPage = "DLG_ISSUE";
        var LinkID = gw_com_api.v_Stream.msg_infoAS;

        // Popup Type
        var args = {
            type: "PAGE", page: LinkPage, title: "문제 상세 정보",
            width: 1120, height: 540, scroll: true, open: true, control: true, locate: ["center", "top"]
        };

        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = { page: LinkPage,
                param: { ID: LinkID,
                    data: {
                        issue_no: gw_com_api.getValue(ui.object, ui.row, "issue_no", true)
                    }
                }
            }
            gw_com_module.dialogueOpen(args);
        }

    }
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
            { gw_com_module.streamInterface(param); } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            { if (param.data.page != gw_com_api.getPageID()) break; } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {   var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_ISSUE":
                        { args.ID = gw_com_api.v_Stream.msg_infoAS;
                            args.data = {
                                issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", true)
                            };
                        } break;
                } gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            { closeDialogue({ page: param.from.page }); } break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//