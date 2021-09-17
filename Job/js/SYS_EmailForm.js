//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 메일 양식관리
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

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 
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
        gw_com_module.buttonMenu(args);

        //==== Main Grid : 메일 양식 목록
        var args = {
            targetid: "grdData_List", query: "SYS_2090_1", title: "양식 목록",
            height: "600", width: "350", caption: true, show: true, selectable: true, number: true,
            element: [
                { header: "ID", name: "temp_id", width: 100 },
                { header: "Name", name: "temp_nm", width: 200 }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Grid : 메일 양식
        var args = {
            targetid: "frmData_Main", query: "SYS_2090_1", type: "TABLE", title: "메일 양식",
            show: true, selectable: true, caption: true,
            editable: { bind: "select", focus: "temp_id", validate: true },
            content: {
                width: { label: 30, field: 70 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "<b>ID</b>", format: { type: "label" } },
                            { name: "temp_id", editable: { type: "text", bind: "create", validate: { rule: "required" }, width: 310, maxlength: 25 } },
                            { header: true, value: "<b>Name</b>", format: { type: "label" } },
                            { name: "temp_nm", editable: { type: "text", validate: { rule: "required" }, width: 310, maxlength: 50 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            { name: "rmk", editable: { type: "text", width: 766 }, style: { colspan: 3 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            { name: "temp_subject", editable: { type: "text", width: 766 }, style: { colspan: 3 } },
                            { name: "temp_body", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        // Data Box : Memo
        var args = {
            targetid: "frmData_MemoA", query: "SYS_2090_1", type: "TABLE", title: "Contens (DoubleClick empty area for Editting)",
            caption: true, show: true, fixed: true, selectable: true, editable: { bind: "select", validate: true },
            content: {
                row: [{
                    element: [
                        { name: "memo_html", format: { type: "html", height: 540 } },
                        { name: "memo_tp", hidden: true, editable: { type: "hidden" } },
                        { name: "temp_id", hidden: true, editable: { type: "hidden" } }
                    ]
                }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_List", offset: 8 },
				{ type: "FORM", id: "frmData_Main", offset: 8 },
				{ type: "FORM", id: "frmData_MemoA", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);

        //==== Grid Events :
        var args = { targetid: "grdData_List", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //==== Memo Events :
        var args = { targetid: "frmData_MemoA", element: "memo_html", event: "click", handler: processMemoEdit };
        gw_com_module.eventBind(args);

    }
};
//----------
function processMemoEdit(param) {

    if (!checkManipulate({})) return;

    // Open Memo Editor -> SetValue : msg_closeDialogue
    // 중복 Open 문제 해결 필요 by JJJ
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = "memo_html";
    var args = {
        page: "DLG_HtmlEditor",
        option: "width=800,height=600,left=300,resizable=1",
        data: {
            title: "E-Mail Form Editor",
            html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
        }
    };
    gw_com_api.openWindow(args);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            v_global.process.handler = processRetrieve;
            if (!checkUpdatable({})) return;
            processRetrieve({});
            break;
        case "추가":
            v_global.process.handler = processInsert;
            if (!checkUpdatable({})) return;
            processInsert({});
            break;
        case "삭제":
            v_global.process.handler = processRemove;
            if (!checkManipulate({})) return;
            checkRemovable({});
            break;
        case "저장":
            processSave({});
            break;
        case "닫기":
            checkClosable({});
            break;
    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkManipulate(param) {

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
    // Check : Is there data to save previously?
    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" }
        ],
        param: param
    };
    // if Updatable then return false
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    processClose({});

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_List", "reset");
    var args = {
        targetid: "frmData_Main", edit: true, updatable: true,
        //data: [
        //    { name: "rgst_ymd", value: gw_com_api.Mask(gw_com_api.getDate(), "date-ymd") }
        //],
        clear: [
            { type: "FORM", id: "frmData_MemoA" }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
		    {
		        type: "FORM", id: "frmData_Main",
		        key: { element: [{ name: "temp_id" }] }
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

    if (gw_com_api.getRowCount("grdData_List") == 1) {
        processClear({});
    }
    processRetrieve({});

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processRetrieve(param) {

    var args = {};
    if (param.object == "grdData_List" || param.sub) {
        args = {
            source: {
                type: "GRID", id: "grdData_List", row: "selected",
                element: [
                    { name: "temp_id", argument: "arg_temp_id" }
                ],
            },
            target: [
                { type: "FORM", id: "frmData_Main", edit: true }
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };

    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_temp_id", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_List", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_Main" }, { type: "FORM", id: "frmData_MemoA" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (gw_com_api.getValue("frmData_Main", 1, "temp_id") != "") {
        var args = {
            targetid: "frmData_MemoA", updatable: true,
            data: [
                { name: "memo_tp", value: "HTML" },
                { name: "memo_html", value: gw_com_api.getValue("frmData_Main", 1, "temp_body") },
                { name: "temp_id", value: gw_com_api.getValue("frmData_Main", 1, "temp_id") }
            ]
        };
        gw_com_module.formInsert(args);
    }
}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "FORM", id: "frmData_MemoA" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                if (param.from.page == "") {
                    // process per page
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                // HTML Editor
                if (param.from.page == "DLG_HtmlEditor") {
                    if (param.data.update) {
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                        gw_com_api.setValue("frmData_Main", 1, "temp_body", param.data.html);
                        gw_com_api.setUpdatable(v_global.event.object);
                    }
                    return;
                }

                // Close Dialogue Widow
                if (param.from) closeDialogue({ page: param.from.page });
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processClear({});
                                if (v_global.process.handler != null) v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove({});
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

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//