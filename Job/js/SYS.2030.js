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

        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

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
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "obj", value: "Object", icon: "Dialogue" },
                { name: "arg", value: "Argument", icon: "Act" },
                { name: "col", value: "Column", icon: "Msc" }//,
                //{ name: "기타", value: "테이블목록", icon: "기타" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "prod_type", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "obj_nm", label: { title: "Object Name :" },
                                    editable: { type: "text", size: 15, maxlength: 50 }
                                },
                                {
                                    name: "obj_id", label: { title: "Object ID :" },
                                    editable: { type: "text", size: 15, maxlength: 50 }
                                }

                            ]
                        },
                        {
                            element: [
                                {
                                    name: "qry_nm", label: { title: "Query Name :" },
                                    editable: { type: "text", size: 15, maxlength: 50 }
                                },
                                {
                                    name: "qry_id", label: { title: "Query ID :" },
                                    editable: { type: "text", size: 15, maxlength: 50 }
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
        var args = {
            targetid: "grdData_Main", query: "SYS_2030_M_1", title: "Object List",
            width: 300, height: 278, show: true, selectable: true, dynamic: true,
            element: [
                { header: "Name", name: "obj_nm", width: 110, align: "left" },
                { header: "ID", name: "obj_id", width: 70, align: "left" },
                { header: "Type", name: "mod_id", width: 40, align: "left" }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SYS_2030_S_1", title: "Query List",
            width: 300, height: 300, show: true, selectable: true, dynamic: true,
            element: [
                { header: "Name", name: "qry_nm", width: 70, align: "left" },
                { header: "ID", name: "qry_id", width: 70, align: "left" },
                { name: "obj_id", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Detail", query: "SYS_2030_D_1", type: "TABLE", title: "Query Manager",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "qry_id", validate: true },
            content: {
                width: { label: 100, field: 176 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "Query ID", format: { type: "label" } },
                          { name: "qry_id", editable: { type: "text", bind: "create" } },
                          { header: true, value: "Query Name", format: { type: "label" } },
                          { name: "qry_nm", editable: { type: "text" } },
                          { header: true, value: "Object ID", format: { type: "label" } },
                          { name: "obj_id", editable: { type: "text" } },
                          { name: "qry_sel", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Detail2", query: "SYS_2030_D_1", type: "TABLE", title: "Query Manager",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "qry_sel", validate: true },
            content: {
                width: { field: "100%" }, height: 572,
                row: [
                    {
                        element: [
                          {
                              name: "qry_sel",
                              format: { type: "textarea", rows: 46, width: 843 },
                              editable: { type: "textarea", rows: 46, width: 843 }
                          },
                          { name: "qry_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "FORM", id: "frmData_Detail", offset: 8 },
                { type: "FORM", id: "frmData_Detail2", offset: 8 }
            ]
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
        var args = { targetid: "lyrMenu_2", element: "obj", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "arg", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "col", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "기타", event: "click", handler: click_lyrMenu_기타 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

            var args = {
                target: [{ id: "frmOption", focus: true }]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_추가(ui) {

            closeOption({});

            if (!checkUpdatable({ handler: processInsert })) return false;

            processInsert({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            v_global.process.handler = processRemove;

            if (!checkManipulate({})) return;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_기타(ui) {

            var args = {
                option: [
                    { name: "PAGE", value: gw_com_module.v_Current.window }
                ],
                target: { type: "FILE", id: "lyrDown", name: "TableLayout" }
                //,
                //handler: {
                //    success: successExport
                //}
            };
            gw_com_module.objExport(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_frmOption_실행(ui) {

            if (!checkUpdatable({ handler: processRetrieve })) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

        //==== DW Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //==== DW Events : Sub
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //==== DW Events : Sub
        var args = { targetid: "frmData_Detail", grid: false, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //----------

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
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_Detail");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    v_global.process.handler = param.handler;

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_Detail" },
            { type: "FORM", id: "frmData_Detail2" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});

    if (!checkUpdatable({ handler: processClose })) return;

    processClose({});

}
//----------
function processItemChanged(param) {

    //if (param.object == "frmData_Detail" && gw_com_api.getRowCount("grdData_Sub") > 0) {
    //    gw_com_api.setValue("grdData_Sub", "selected", param.element, gw_com_api.getValue(param.object, "selected", param.element, false), true);
    //}
}
//----------
function processRetrieve(param) {

    var args;
    switch (param.object) {
        case undefined:
            v_global.logic.key = param.key;
            args = {
                source: {
                    type: "FORM", id: "frmOption", hide: true,
                    element: [
                        { name: "obj_nm", argument: "arg_obj_nm" },
                        { name: "obj_id", argument: "arg_obj_id" },
                        { name: "qry_nm", argument: "arg_qry_nm" },
                        { name: "qry_id", argument: "arg_qry_id" }
                    ],
                    remark: [
                        { element: [{ name: "obj_nm" }] },
                        { element: [{ name: "obj_id" }] },
                        { element: [{ name: "qry_nm" }] },
                        { element: [{ name: "qry_id" }] }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdData_Main", select: true }
                ],
                clear: [
                    { type: "GRID", id: "grdData_Sub" },
                    { type: "FORM", id: "frmData_Detail" },
                    { type: "FORM", id: "frmData_Detail2" }
                ],
                key: param.key
            };
            break;
        case "grdData_Main":
            args = {
                source: {
                    type: "GRID", id: "grdData_Main", row: "selected", block: true,
                    element: [
                        { name: "obj_id", argument: "arg_obj_id" }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdData_Sub", select: true }
                ],
                clear: [
                    { type: "FORM", id: "frmData_Detail" },
                    { type: "FORM", id: "frmData_Detail2" }
                ],
                key: v_global.logic.key
            };
            break;
        case "grdData_Sub":
            args = {
                source: {
                    type: "GRID", id: "grdData_Sub", row: "selected", block: true,
                    element: [
                        { name: "qry_id", argument: "arg_qry_id" }
                    ]
                },
                target: [
                    { type: "FORM", id: "frmData_Detail", select: true },
                    { type: "FORM", id: "frmData_Detail2", select: true }
                ],
                key: param.key
            };
            break;
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    processClear();

    var args = {
        targetid: "frmData_Detail2",
        data: [
            { name: "obj_id", value: gw_com_api.getValue("grdData_Main", "selected", "obj_id", true) }
        ]
    };
    gw_com_module.formInsert(args);

    var args = {
        targetid: "frmData_Detail",
        data: [
            { name: "obj_id", value: gw_com_api.getValue("grdData_Main", "selected", "obj_id", true) }
        ],
        edit: true,
        updatable: true
    };
    gw_com_module.formInsert(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_Detail",
                key: {
                    element: [
                     { name: "qry_id" }
                    ]
                }
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processRetrieve({ object: "grdData_Main" });

}
//----------
function processSave(param) {
    if (gw_com_api.getUpdatable("frmData_Detail2", false)) {
        gw_com_api.setValue("frmData_Detail", "selected", "qry_sel", gw_com_api.getValue("frmData_Detail2", "selected", "qry_sel", false), false);
        if (gw_com_api.getCRUD("frmData_Detail", 1, false) == "retrieve")
            gw_com_api.setCRUD("frmData_Detail", 1, "modify", false);
    }

    var args = { target: [{ type: "FORM", id: "frmData_Detail" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Detail" },
            { type: "FORM", id: "frmData_Detail2" }
        ]
    };
    gw_com_module.objClear(args);

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

    var key = [
        {
            KEY: [{ NAME: "obj_id", VALUE: gw_com_api.getValue("frmData_Detail", 1, "obj_id") }],
            QUERY: "SYS_2030_M_1"
        },
        {
            KEY: [{ NAME: "qry_id", VALUE: gw_com_api.getValue("frmData_Detail", 1, "qry_id") }],
            QUERY: "SYS_2030_S_1"
        }
    ];
    //processRetrieve({ object: "grdData_Main", key: key });
    processRetrieve({ key: key });

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processPopup(param) {

    closeOption();

    v_global.event.object = "frmData_Detail";
    v_global.event.row = 1
    v_global.logic.key = gw_com_api.getValue("frmData_Detail", "selected", "qry_id", false);

    var page, title;
    var width = 0, height = 0;
    switch (param.element) {
        case "obj":
            page = "SYS_2033";
            title = "Object Manager";
            width = 750;
            height = 500;
            break;
        case "arg":
            if (v_global.logic.key == "") return;
            page = "SYS_2031";
            title = "Query Arguments";
            width = 600;
            height = 500;
            break;
        case "col":
            if (v_global.logic.key == "") return;
            page = "SYS_2032";
            title = "Query Columns";
            width = 1000;
            height = 500;
            break;
        default:
            return;
            break;
    }

    var args = {
        type: "PAGE", page: page, title: title,
        width: width, height: height, scroll: true, open: true, control: true, locate: ["center", "center"]
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args.param = {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: { qry_id: v_global.logic.key }
        }
        gw_com_module.dialogueOpen(args);
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
            {
                gw_com_module.streamInterface(param);
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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "SYS_2031":
                    case "SYS_2032":
                    case "SYS_2033": {
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = { qry_id: v_global.logic.key }
                    } break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
