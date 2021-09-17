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
			            { name: "voc_no", label: { title: "VOC No. :" },
			                editable: { type: "text", size: 10, maxlength: 20 }
			            },
			            { name: "실행", value: "실행", act: true, format: { type: "button" } }
			        ]
                }
			] }
        };
        gw_com_module.formCreate(args);
        
        //==== Form : Main ====
        var args = { targetid: "frmData_내역", query: "EHM_3070_M_2", type: "TABLE", title: "접수 내역",
            caption: true, show: true, selectable: true,
            content: { width: { label: 100, field: 241 }, height: 25,
                row: [ {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "voc_no" },
                            { header: true, value: "발생일자", format: { type: "label" } },
                            { name: "issue_dt", mask: "date-ymd"  },
                            { header: true, value: "분류", format: { type: "label" } },
                            { name: "issue_tp" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "고객사", format: { type: "label" } },
                            { name: "cust_nm" },
                            { header: true, value: "LINE", format: { type: "label" } },
                            { name: "cust_dept_nm" },
                            { header: true, value: "LINE담당자", format: { type: "label" } },
                            { name: "cust_emp" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "요청내용", format: { type: "label" } },
                            { name: "issue_rmk", style: { colspan: 5 },
                                format: { type: "textarea", rows: 5, width: 800 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리상태", format: { type: "label" } },
                            { name: "pstat" },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "upd_usr" },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "upd_dt" }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        
        //==== Grid : Sub ====
        var args = { targetid: "grdData_담당", query: "EHM_3070_S_1", title: "담당 정보",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "담당부서", name: "dept_nm", width: 150, align: "center", mask: "search", display: true,
				  editable: { type: "text", validate: { rule: "required" } }
				},
                { header: "담당자", name: "emp_nm", width: 120, align: "center", mask: "search", display: true,
                  editable: { type: "text" }
                },
                { header: "처리결과", name: "result_cd", width: 100, align: "center" },
                { header: "결과사유", name: "result_rmk", width: 500, align: "center" },
                { header: "처리일시", name: "upd_dt", width: 160, align: "center" },
                { name: "emp_no", hidden: true, editable: { type: "hidden" } },
                { name: "dept_cd", hidden: true, editable: { type: "hidden" } },
                { name: "charge_seq", hidden: true, editable: { type: "hidden" } },
                { name: "voc_no", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);
        
        //==== Form : Sub ====
        var args = { targetid: "frmData_담당", query: "EHM_3070_S_3", type: "TABLE", title: "담당자 처리 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "issue_tp", validate: true },
            content: {
                width: { label: 100, field: 241 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "담당부서", format: { type: "label" } },
                            { name: "dept_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "emp_nm" },
                            { header: true, value: "처리일자", format: { type: "label" } },
                            { name: "result_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리결과", format: { type: "label" } },
                            { name: "result_cd" },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "upd_usr_nm" },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "upd_dt" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "결과사유", format: { type: "label" } },
                            { name: "result_rmk", style: { colspan: 5 }, format: { type: "textarea", rows: 5, width: 800 } },
                			{ name: "voc_no", hidden: true },
                			{ name: "charge_seq", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : 첨부파일 ====
        var args = { targetid: "grdData_첨부", query: "EHM_3070_S_2", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 300, align: "left" },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "파일설명", name: "file_desc", width: 670, align: "left" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);
        
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "frmData_내역", offset: 8 },
                { type: "GRID", id: "grdData_담당", offset: 8 },
                { type: "GRID", id: "frmData_담당", offset: 8 },
                { type: "GRID", id: "grdData_첨부", offset: 8 }
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
//        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
//        gw_com_module.eventBind(args);

        //==== Grid Events : 담당
        var args = { targetid: "grdData_담당", grid: true, event: "rowselected", handler: rowselected_grdData_담당 };
        gw_com_module.eventBind(args);

        //==== Grid Events : 첨부파일
        var args = { targetid: "grdData_첨부", grid: true, element: "download",
            event: "click", handler: click_grdData_첨부_download
        };
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
        //----------
        function rowselecting_grdData_담당(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;
            return true;
        }
        //----------
        function rowselected_grdData_담당(ui) {
            v_global.process.prev.sub = ui.row;
            processLink({ sub: true });
        };
        //----------        
        function click_grdData_첨부_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

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
            element: [ { name: "voc_no", argument: "arg_voc_no" } ]
        },
        target: [
		    { type: "FORM", id: "frmData_내역" },
		    { type: "GRID", id: "grdData_담당", select: true },
			{ type: "GRID", id: "grdData_첨부" }
		],
/*        clear: [
			{ type: "GRID", id: "grdData_중분류" },
			{ type: "GRID", id: "grdData_소분류" }
		], */
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
	            type: "GRID", id: "grdData_담당", row: "selected", block: true,
	            element: [
					{ name: "voc_no", argument: "arg_voc_no" },
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
                    if (param.data.voc_no
                        != gw_com_api.getValue("frmOption", 1, "voc_no")) {
                        gw_com_api.setValue("frmOption", 1, "voc_no", param.data.voc_no);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve) processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "voc_no");
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