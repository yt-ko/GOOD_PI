//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
                {
                    type: "PAGE", name: "발생구분", query: "DDDW_ISSUE_TP",
                    param: [
                        { argument: "arg_rcode", value: "AS" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {
            gw_job_process.UI();
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{ name: "조회", value: "조회" },
				{ name: "확인", value: "확인", icon: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "cust_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
				                {
				                    name: "ymd_fr", label: { title: "발생일자 :" },
				                    mask: "date-ymd", style: { colfloat: "floating" },
				                    editable: { type: "text", size: 7, maxlength: 10 }
				                },
				                {
				                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                    editable: { type: "text", size: 7, maxlength: 10 }
				                },
                                {
                                    name: "issue_tp", label: { title: "발생구분 :" },
                                    editable: {
                                        type: "select", data: { memory: "발생구분", unshift: [{ title: "전체", value: "%" }] }
                                    }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "cust_cd", label: { title: "고객사 :" },
                                    editable: {
                                        type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
                                        change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
                                    }
                                },
				                {
				                    name: "cust_dept", label: { title: "LINE :" },
				                    editable: {
				                        type: "select",
				                        data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }
				                    }
				                },
				                {
				                    name: "cust_prod_nm", label: { title: "설비명 :" },
				                    editable: { type: "text", size: 12, maxlength: 20 }
				                }
                            ]
                        },
                        {
                            element: [
				                {
				                    name: "proj_no", label: { title: "Project No. :" },
				                    editable: { type: "text", size: 12, maxlength: 50 }
				                },
				                {
				                    name: "ser_no", label: { title: "Ser. No. :" },
				                    editable: { type: "text", size: 12, maxlength: 50 }
				                }
                            ]
                        },
                        {
                            align: "right",
                            element: [
                                { name: "실행", value: "실행", format: { type: "button" }, act: true },
                                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ]
                        }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_Main", query: "EHM_2113", title: "자재 반입 목록",
            height: 280, show: true, selectable: true, key: true, number: true, multi: true, checkrow: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 80, align: "left", hidden: true },
                { header: "LINE", name: "cust_dept", width: 70, align: "left" },
                { header: "Process", name: "cust_proc", width: 70, align: "left" },
                { header: "설비명", name: "cust_prod_nm", width: 120 },
                { header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                //{ header: "발생구분", name: "issue_tp", width: 70, format: { type: "select", data: { memory: "발생구분" } } },
                { header: "품목코드", name: "apart_cd", width: 80, align: "center" },
                { header: "품목명", name: "apart_nm", width: 160 },
                { header: "Ser. No.", name: "apart_sno", width: 120 },
                { header: "A/S 번호", name: "issue_no", width: 70, align: "center" },
                { header: "NCR 번호", name: "ncr_no", width: 70, align: "center" },
                { name: "cust_cd", hidden: true },
                { name: "prod_key", hidden: true },
                { name: "apart_tp", hidden: true },
                { name: "issue_seq", hidden: true },
                { name: "part_seq", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [{ type: "GRID", id: "grdData_Main", offset: 8 }]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

        gw_job_process.procedure();

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processOK };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    //if (gw_com_api.getValue("frmOption", 1, "cust_cd") == "%") {
    //    gw_com_api.messageBox([
    //        { text: "고객사는 반드시 입력하셔야 합니다." }
    //    ], 480);
    //    gw_com_api.setError(true, "frmOption", 1, "cust_cd", false, true);
    //    //gw_com_api.show("frmOption");
    //    return false;
    //}

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "ser_no", argument: "arg_ser_no" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "issue_tp" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_prod_nm" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "ser_no" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processOK(param) {

    var ids = gw_com_api.getSelectedRow("grdData_Main", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        return false;
    }

    var rows = [];
    $.each(ids, function () {
        rows.push({
            cust_cd: gw_com_api.getCellValue("GRID", "grdData_Main", this, "cust_cd"),
            cust_nm: gw_com_api.getCellValue("GRID", "grdData_Main", this, "cust_nm"),
            cust_dept: gw_com_api.getCellValue("GRID", "grdData_Main", this, "cust_dept"),
            cust_dept_nm: gw_com_api.getCellValue("GRID", "grdData_Main", this, "cust_dept"),
            cust_proc: gw_com_api.getCellValue("GRID", "grdData_Main", this, "cust_proc"),
            cust_proc_nm: gw_com_api.getCellValue("GRID", "grdData_Main", this, "cust_proc"),
            prod_key: gw_com_api.getCellValue("GRID", "grdData_Main", this, "prod_key"),
            cust_prod_nm: gw_com_api.getCellValue("GRID", "grdData_Main", this, "cust_prod_nm"),
            proj_no: gw_com_api.getCellValue("GRID", "grdData_Main", this, "proj_no"),
            apart_tp: gw_com_api.getCellValue("GRID", "grdData_Main", this, "apart_tp"),
            part_cd: gw_com_api.getCellValue("GRID", "grdData_Main", this, "apart_cd"),
            part_nm: gw_com_api.getCellValue("GRID", "grdData_Main", this, "apart_nm"),
            ser_no: gw_com_api.getCellValue("GRID", "grdData_Main", this, "apart_sno"),
            issue_no: gw_com_api.getCellValue("GRID", "grdData_Main", this, "issue_no"),
            issue_seq: gw_com_api.getCellValue("GRID", "grdData_Main", this, "issue_seq"),
            part_seq: gw_com_api.getCellValue("GRID", "grdData_Main", this, "part_seq"),
            stock_status: "020", //요청
            //stock_status_nm: "020", //요청
            rqst_dt: gw_com_api.getDate(),
            rqst_usr: gw_com_module.v_Session.USR_NM,
            ncr_no: gw_com_api.getCellValue("GRID", "grdData_Main", this, "ncr_no")
        });
    });

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: { rows: rows }
    };
    gw_com_module.streamInterface(args);

    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    processClear();
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
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                //processRetrieve();
                gw_com_api.show("frmOption");
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
