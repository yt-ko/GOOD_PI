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
    data: null, logic: {}
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "계측기상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "QMI41" }]
                },
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                //{
                //    type: "INLINE", name: "교정주기",
                //    data: [{ title: "1년", value: "12" }, { title: "2년", value: "24" }, { title: "3년", value: "36" }, { title: "4년", value: "48" }, { title: "5년", value: "60" }]
                //},
                {
                    type: "PAGE", name: "교정주기", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI51" }]
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
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();
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
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "저장" },
                { name: "닫기", value: "취소" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "QMI_4001_1", type: "TABLE", title: "발생 정보",
            show: true, selectable: true,
            editable: { bind: "select", focus: "chg_date", validate: true },
            content: {
                width: { label: 40, field: 80 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "교정일자", format: { type: "label" } },
                            { name: "chg_date", width: 30, editable: { type: "text", width: 90, validate: { rule: "required" } }, mask: "date-ymd" },
                            { header: true, value: "교정비용", format: { type: "label" } },
                            { name: "chg_amt", width: 30, mask: "numeric-int", editable: { type: "text", width: 90, maxlendgh: 25, validate: { rule: "required" } } },
                            { header: true, value: "업체", format: { type: "label" } },
                            { name: "vendor_nm", editable: { type: "text", width: 200, maxlendgh: 25, validate: { rule: "required" } } },
                            //{ header: true, value: "유효기간", format: { type: "label" } },
                            //{ name: "valid_date", editable: { type: "hidden" }, mask: "date-ymd" }
                            { header: true, value: "내용", format: { type: "label" } },
                            { name: "chg_rmk", editable: { type: "text", width: 200, maxlength: 60 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CHANGE", query: "QMI_4001_2", title: "계측기 일람",
            caption: true, height: 240, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "chg_rmk" },
            element: [
				{ header: "관리번호", name: "qmi_no", width: 80, align: "center" },
                { header: "기기명", name: "qmi_nm", width: 140 },
                //{ header: "형식", name: "spec", wdith: 140 },
                //{ header: "용도", name: "usage", width: 100 },
                { header: "Model No.", name: "model_no", width: 100 },
                { header: "Serial No.", name: "ser_no", width: 100 },
                //{ header: "교정주기", name: "calibrate_term", width: 60, align: "center" },
                {
                    header: "교정주기", name: "calibrate_term", width: 60, align: "center", format: { type: "select", data: { memory: "교정주기" } }
                },
                { header: "최종교정일", name: "last_calibrate_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "차기교정일", name: "next_calibrate_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "내용", name: "chg_rmk", editable: { type: "text", width: 154 } },
				{ name: "qmi_key", hidden: true },
                { name: "qmi_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
				{ type: "GRID", id: "grdData_CHANGE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------

        //==== Form Events : MAIN
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    if (param.object == undefined) return false;
    if (param.object == "lyrMenu") {
        if (param.element == "저장") {
            processSave({});
        } else if (param.element == "닫기") {
            processClose({});
        }
    }
}
//----------
function processItemchanged(param) {

    var ids = gw_com_api.getRowIDs("grdData_CHANGE");
    switch (param.element) {
        case "chg_date":
            $.each(ids, function () {
                var calibrate_term = gw_com_api.getValue("grdData_CHANGE", this, "calibrate_term", true);
                var valid_date = getNextCaliDate(calibrate_term, param.value.current);
                gw_com_api.setValue("grdData_CHANGE", this, "next_calibrate_date", valid_date, true, true);
            });
            break;
        case "chg_rmk":
            $.each(ids, function () {
                gw_com_api.setValue("grdData_CHANGE", this, "chg_rmk", param.value.current, true, true);
            });
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_qmi_key", value: v_global.logic.qmi_key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN", edit: true },
            { type: "GRID", id: "grdData_CHANGE", select: true }
        ],
        handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var row = [];
    var ids = gw_com_api.getRowIDs("grdData_CHANGE");
    $.each(ids, function () {
        row.push({
            crud: "C",
            column: [
                { name: "qmi_key", value: gw_com_api.getValue("grdData_CHANGE", this, "qmi_key", true) },
                { name: "qmi_seq", value: gw_com_api.getValue("grdData_CHANGE", this, "qmi_seq", true) },
                { name: "chg_tp", value: "교정" },
                { name: "chg_date", value: gw_com_api.getValue("frmData_MAIN", 1, "chg_date") },
                { name: "chg_amt", value: gw_com_api.getValue("frmData_MAIN", 1, "chg_amt") },
                { name: "valid_date", value: gw_com_api.getValue("grdData_CHANGE", this, "next_calibrate_date", true) },
                { name: "chg_rmk", value: gw_com_api.getValue("grdData_CHANGE", this, "chg_rmk", true) },
                { name: "vendor_nm", value: gw_com_api.getValue("frmData_MAIN", 1, "vendor_nm") },
                { name: "chk_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "chk_date", value: gw_com_api.getDate() }
            ]
        });
    });

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: "QMI_1002_4",
                row: row
            }
        ],
        handler: {
            success: successSave
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(param) {

    processClose({ data: { saved: true } });

}
//----------
function processClear(param) {

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

}
//----------
function getNextCaliDate(arg1, arg2) {

    var rtn = "";
    if (arg2 != "") {
        rtn = gw_com_api.addDate("m", arg1, gw_com_api.unMask(arg2, "date-ymd"), "");
    }

    return rtn;

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
                v_global.logic.qmi_key = param.data.qmi_key;
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "":
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//