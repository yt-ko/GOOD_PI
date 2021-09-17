//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null,
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

/*        // set data. for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "분류", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "IEHM42" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);
 */       //----------
        start();
        function start() { gw_job_process.UI(); }

    },

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
        
        //==== Oprion : Form ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, align: "left",	//, remark: "lyrRemark"
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                {
                    element: [
			            { name: "qc_seq", label: { title: "관리번호 :" },
			                editable: { type: "text", size: 10, maxlength: 20 }
			            },
			            { name: "실행", value: "실행", act: true, format: { type: "button" } }
			        ]
                }
			] }
        };
        gw_com_module.formCreate(args);
        
        //==== Form : Main ====
        var args = {
            targetid: "frmData_Main", query: "SPC_2000_S_1", type: "TABLE", title: "검사 내역",
            caption: true, show: true, width: "100%", selectable: true,
            content: {
                width: { label: 116, field: 230 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "부품번호", format: { type: "label" } },
                        { name: "part_no" },
                        { header: true, value: "Model", format: { type: "label" } },
                        { name: "model_no", editable: { type: "text" } },
                        { header: true, value: "등록일시", format: { type: "label" } },
                        { name: "ins_dt", align: "center" }
                    ] },
                    { element: [
                        { header: true, value: "검사항목", format: { type: "label" } },
                        { name: "qcitem_nm" },
                        { header: true, value: "Project No", format: { type: "label" } },
                        { name: "proj_no", editable: { type: "text" } },
                        { header: true, value: "Exponent", format: { type: "label" } },
                        { name: "value_exp", mask: "numeric-int" }
                    ] },
                    { element: [
                        { header: true, value: "협력사", format: { type: "label" } },
                        { name: "supp_nm" },
                        { header: true, value: "측 정 자", format: { type: "label" } },
                        { name: "qc_charge" },
                        { header: true, value: "검사일자", format: { type: "label" } },
                        { name: "qc_date", mask: "date-ymd", align: "center"  },
                        { name: "qc_seq", hidden: true, editable: { type: "hidden" } }
                    ] },
                    { element: [
                        { header: true, value: "Repair", format: { type: "label" } },
                        { name: "repair_yn", align: "center",
                            format: { type: "checkbox", title: "", value: "1", offval: "0" }
                        },
                        { header: true, value: "규격하한", format: { type: "label" } },
                        { name: "lsl_value", editable: { type: "hidden" } },
                        { header: true, value: "규격상한", format: { type: "label" } },
                        { name: "usl_value", editable: { type: "hidden" } }
                    ] }
                ]
            }
        };
        gw_com_module.formCreate(args);
        
        //==== Grid : Sub ====
        var args = {
            targetid: "grdData_Sub", query: "SPC_2000_S_2", title: "검사 결과",
            caption: true, width: "100%", height: 280, show: true, selectable: true, number: true,
            element: [
                { header: "Serial No.", name: "ser_no", width: 100, align: "center"
                	, editable: { type: "text" }
                },
                { header: "Value.", name: "qc_value", width: 80, align: "center"
                	, editable: { type: "text", validate: { rule: "required", message: "측정치" } }
                },
                { header: "공정", name: "proc_tp", width: 80, align: "center"
                	, editable: { type: "select", data: { memory: "생산공정" } }
                },
                { header: "입고", name: "dlv_yn", width: 40, align: "center"
                    , format: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { header: "확인", name: "qc_chk", width: 40, align: "center"
                    , format: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { header: "측정자 비고", name: "qc_rmk", width: 120, align: "left", editable: { type: "text" } },
                { header: "품질 비고", name: "rmk1", width: 120, align: "left", editable: { type: "text" } },
                { header: "부품 비고", name: "rmk2", width: 120, align: "left", editable: { type: "text" } },
				{ name: "qc_seq", hidden: true, editable: { type: "hidden" } },
				{ name: "sub_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

        gw_com_module.informSize();

        gw_job_process.procedure();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {

    var args = {
        source: { type: "FORM", id: "frmOption",
            element: [ { name: "qc_seq", argument: "arg_qc_seq" } ]
        },
        target: [
		    { type: "FORM", id: "frmData_Main" },
		    { type: "GRID", id: "grdData_Sub" }
		],
        key: param.key
    };

    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
	        source: {
	            type: "GRID", id: "grdData_Sub", row: "selected", block: true,
	            element: [
					{ name: "qc_seq", argument: "arg_qc_seq" },
					{ name: "charge_seq", argument: "arg_charge_seq" }
					]
	        	},
	        target: [
	            { type: "FORM", id: "frmData_담당" }
				],
	        key: param.key
    	};
    }

    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
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
        case gw_com_api.v_Stream.msg_infoECR:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    var tmpSeq = param.data.issue_no;
                    tmpSeq = tmpSeq.substring(0, tmpSeq.lastIndexOf("-"));
                    if (tmpSeq != gw_com_api.getValue("frmOption", 1, "qc_seq")) {
                        gw_com_api.setValue("frmOption", 1, "qc_seq", tmpSeq);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve) processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "qc_seq");
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            { gw_com_module.streamInterface(param); } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
            }
            break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//