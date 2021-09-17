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
                        type: "INLINE", name: "FieldType",
                        data: [
                            { title: "bigint", value: "bigint" },
                            { title: "char", value: "char" },
                            { title: "datetime", value: "datetime" },
                            { title: "decimal", value: "decimal" },
                            { title: "float", value: "float" },
                            { title: "int", value: "int" },
                            { title: "nchar", value: "nchar" },
                            { title: "numeric", value: "numeric" },
                            { title: "nvarchar", value: "nvarchar" },
                            { title: "real", value: "real" },
                            { title: "text", value: "text" },
                            { title: "smallint", value: "smallint" },
                            { title: "timestamp", value: "timestamp" },
                            { title: "varchar", value: "varchar" }
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
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "btnTbl",
            type: "FREE",
            element: [
				{ name: "생성", value: "생성", icon: "Act" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Option", query: "", type: "TABLE", title: "Table",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "tbl_nm" },
            content: {
                width: { label: 60, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "Table", format: { type: "label" } },
                          { name: "tbl_nm", editable: { type: "text" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        var args = { targetid: "frmData_Option", edit: true };
        gw_com_module.formInsert(args);
        //=====================================================================================
        var args = { targetid: "grdData_Main", query: "SYS_2032", title: "Columns",
            height: 350, show: true, selectable: true, dynamic: true, key: true, number: true,
            editable: { multi: true, bind: "select", focus: "col_id", validate: true },
            element: [
                {
                    header: "ID", name: "col_id", width: 120, align: "left",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "Name", name: "col_nm", width: 120, align: "left",
                    editable: { type: "text" }
                },
                {
                    header: "Type", name: "data_tp", width: 60, align: "left",
                    format: { type: "select", data: { memory: "FieldType" } },
                    editable: { type: "select", data: { memory: "FieldType" } }
                },
                {
                    header: "Precision", name: "data_xprec", width: 50, align: "right",
                    editable: { type: "text" }
                },
                {
                    header: "Sclae", name: "data_lxscale", width: 50, align: "right",
                    editable: { type: "text" }
                },
                {
                    header: "View", name: "view_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "Update", name: "upd_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "Key", name: "key_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "Identity", name: "id_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "Table Name", name: "tbl_id", width: 100, align: "left",
                    editable: { type: "text" }
                },
                { name: "qry_id", hidden: true, editable: { type: "hidden" } },
                { name: "col_seq", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_ds", query: "SYS_2032_2", show: false,
            element: [
                { name: "tbl_id", hidden: true },
                { name: "col_id", hidden: true },
                { name: "col_nm", hidden: true },
                { name: "key_yn", hidden: true },
                { name: "id_yn", hidden: true },
                { name: "edit_tp", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_xprec", hidden: true },
                { name: "data_lxscale", hidden: true }
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
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: checkClosable };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnTbl", element: "생성", event: "click", handler: processUserProc };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [ { type: "GRID", id: "grdData_Main" } ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_qry_id", value: param.key }
			]
        },
        target: [
			{ type: "GRID", id: "grdData_Main", select: true }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    var args = { targetid: "grdData_Main", edit: true, updatable: true };
    args.data = [
        { name: "qry_id", value: v_global.logic.key },
        { name: "data_tp", value: gw_com_api.getValue("grdData_Main", "selected", "data_tp", true) },
        { name: "view_yn", value: gw_com_api.getValue("grdData_Main", "selected", "view_yn", true) },
        { name: "upd_yn", value: gw_com_api.getValue("grdData_Main", "selected", "upd_yn", true) },
        { name: "tbl_id", value: gw_com_api.getValue("grdData_Main", "selected", "tbl_id", true) }
    ];
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = { targetid: "grdData_Main", row: "selected", select: true }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_Main" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

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
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
function successSave(response, param) {

    processRetrieve({ key: v_global.logic.key });

}
//----------
function processUserProc(param) {
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tbl_id", value: gw_com_api.getValue("frmData_Option", 1, "tbl_nm", false) }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_ds" }
        ],
        handler_complete: successUserProc
    };
    gw_com_module.objRetrieve(args);
}
//----------
function successUserProc(param) {

    var ids = gw_com_api.getRowIDs("grdData_ds");
    var data = [];
    $.each(ids, function () {
        data.push({
            qry_id: v_global.logic.key,
            tbl_id: gw_com_api.getCellValue("GRID", "grdData_ds", this, "tbl_id"),
            col_id: gw_com_api.getCellValue("GRID", "grdData_ds", this, "col_id"),
            col_nm: gw_com_api.getCellValue("GRID", "grdData_ds", this, "col_nm"),
            data_tp: gw_com_api.getCellValue("GRID", "grdData_ds", this, "data_tp"),
            data_xprec: gw_com_api.getCellValue("GRID", "grdData_ds", this, "data_xprec"),
            data_lxscale: gw_com_api.getCellValue("GRID", "grdData_ds", this, "data_lxscale"),
            key_yn: gw_com_api.getCellValue("GRID", "grdData_ds", this, "key_yn"),
            id_yn: gw_com_api.getCellValue("GRID", "grdData_ds", this, "id_yn"),
            view_yn: "1",
            upd_yn: gw_com_api.getCellValue("GRID", "grdData_ds", this, "id_yn") == "1" ? "0" : "1"
        });
    });

    var args = { targetid: "grdData_Main", edit: true, updatable: true };
    args.data = data;
    gw_com_module.gridInserts(args);
}

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
                v_global.logic.key = param.data.qry_id;
                processRetrieve({ key: param.data.qry_id } );
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
