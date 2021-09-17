//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: { key: null }, logic: {}
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
        gw_com_DX.register();
        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "CRM부서", query: "dddw_crm_dept"
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
            targetid: "lyrMenu_1", type: "FREE", show: false,
            element: [
                { name: "확인", value: "확인", icon: "저장" },
                { name: "취소", value: "취소", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE", show: false,
            element: [
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        //var args = {
        //    targetid: "frmMemo", type: "TABLE", title: "상세 내용",
        //    caption: false, scroll: false, show: false, selectable: true,
        //    editable: { bind: "select", focus: "memo_text", validate: true },
        //    content: {
        //        row: [
        //            {
        //                element: [
        //                    {
        //                        name: "memo_text",
        //                        format: { type: "textarea", rows: 14, width: 648 },
        //                        editable: { type: "textarea", rows: 14, width: 646 }
        //                    }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        createDW({ resize: false });
        //=====================================================================================
        var args = {
            targetid: "lyrNotice",
            row: [
                { name: "제목" }
            ]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmView", type: "TABLE", title: "상세 내용",
            caption: false, scroll: false, show: false, selectable: true,
            content: {
                row: [
                    {
                        element: [
                            { name: "memo_text", format: { type: "textarea", rows: 14, width: 648 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            target: [
                    { type: "FORM", id: "frmMemo", offset: 8 },
                    { type: "FORM", id: "frmView", offset: 8 }
                ]
            };
        //----------
        gw_com_module.objResize(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
        var args = { targetid: "lyrMenu_1", element: "확인", event: "click", handler: click_lyrMenu_1_확인 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "취소", event: "click", handler: click_lyrMenu_1_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: click_lyrMenu_2_닫기 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_확인(ui) {

            processSave();

        }
        //----------
        function click_lyrMenu_1_취소(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return false;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_닫기(ui) {

            processClose({});

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
function createDW(param) {

    var args = {
        targetid: "frmMemo", type: "TABLE", title: "상세 내용",
        caption: false, scroll: false, show: false, selectable: true,
        editable: { bind: "select", focus: "memo_text", validate: true },
        content: {
            row: [
                {
                    element: [
                        {
                            name: "memo_text",
                            format: { type: "textarea", rows: 14, width: 648 },
                            editable: { type: "textarea", rows: 14, width: 646, validate: { rule: "required", message: "" } }
                        }
                    ]
                }
            ]
        }
    };
    //----------
    if (param != undefined && param.element == "CRM_DEPT") {
        args = {
            targetid: "frmMemo", type: "TABLE", title: "상세 내용",
            caption: false, scroll: false, show: false, selectable: true,
            editable: { bind: "select", focus: "crm_dept", validate: true },
            content: {
                width: { label: 100, field: 450 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "CRM 부서", format: { type: "label" } },
                            {
                                name: "crm_dept", style: { colfloat: "float" },
                                format: { type: "select", data: { memory: "CRM부서" } },
                                editable: {
                                    type: "select", data: { memory: "CRM부서" },
                                    validate: { rule: "required", message: "CRM 부서" }, width: 200
                                }
                            },
                            {
                                name: "dept_area", style: { colfloat: "floating" },
                                editable: { type: "hidden" }, hidden: true
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "변경 사유", format: { type: "label" } },
                            {
                                name: "memo_text",
                                format: { type: "textarea", rows: 12, width: 526 },
                                editable: { type: "textarea", rows: 12, width: 524 }
                            }
                        ]
                    }
                ]
            }
        };
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmMemo", offset: 8 }
        ]
    };
    //----------
    if (param.resize != false)
        gw_com_module.objResize(args);

}
//----------
function getObject(param) {

    return ((v_global.data.edit) ? "frmMemo" : "frmView");

}
//----------
function setObject(param) {

    v_global.data = param;
    if (param.edit) {
        param.resize = true;
        createDW(param);
        gw_com_api.hide("lyrMenu_2");
        gw_com_api.hide("frmView");
        gw_com_api.show("lyrMenu_1");
        gw_com_api.show(getObject({}));
        var args = {
            targetid: getObject({})
        };
        gw_com_module.formInsert(args);
        gw_com_api.setValue(getObject({}), 1, "memo_text", param.text);
        if (v_global.data.element == "CRM_DEPT") {
            gw_com_api.setValue(getObject({}), 1, "dept_area", param.dept_area);
            gw_com_api.filterSelect(getObject({}), 1, "crm_dept", { memory: "CRM부서", key: ["dept_area"] });
        }
    }
    else {
        gw_com_api.hide("lyrMenu_1");
        gw_com_api.hide("frmMemo");
        gw_com_api.show("lyrMenu_2");
        gw_com_api.show(getObject({}));
        gw_com_api.setValue(getObject({}), 1, "memo_text", param.text, false, true);
    }
    var args = {
        targetid: "lyrNotice",
        row: [
		    { name: "제목", value: "▶ " + param.title }
	    ]
    };
    gw_com_module.labelAssign(args);

}
//----------
function checkUpdatable(param) {

    return true;
    /*
    var args = {
    target: [
    {
    type: "FORM",
    id: "frmMemo"
    }
    ]
    };
    return gw_com_module.objUpdatable(args);
    */

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: getObject({}) }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var text = gw_com_api.getValue(getObject({}), 1, "memo_text");
    v_global.data.update = (text != v_global.data.text) ? true : false
    v_global.data.text = text;

    if (v_global.data.element != undefined && v_global.data.element == "CRM_DEPT") {
        v_global.data.crm_dept = gw_com_api.getValue(getObject({}), 1, "crm_dept");
    }

    var args = {
        ID: gw_com_api.v_Stream.msg_edited_Memo,
        data: v_global.data
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: getObject({})
			}
		]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);
    processClear({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_edit_Memo:
            {
                if (param.data != undefined) {
                    setObject(param.data);
                }
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                //processRetrieve({});
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

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//