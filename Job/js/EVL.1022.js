//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.06)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
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
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "평가그룹", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "EVL02" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
            //----------

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
                { name: "저장", value: "확인", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_EVL_ITEM", query: "EVL_1022_1", type: "TABLE", title: "평가요소",
            caption: true, show: true, selectable: true,
            editable: { bind: "open", focus: "evl_group", validate: true },
            content: {
                width: { label: 120, field: 530 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "평가그룹", format: { type: "label" } },
                            {
                                name: "evl_group", style: { colspan: 5 },
                                editable: {
                                    type: "select", data: { memory: "평가그룹", unshift: [{ title: "공통", value: "%" }] }, validate: { rule: "required" }, message: "평가그룹"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대분류", format: { type: "label" } },
                            {
                                name: "item_cat1", style: { colspan: 5 },
                                editable: { type: "text", width: 526, maxlength: 50, validate: { rule: "required" }, message: "대분류" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "중분류", format: { type: "label" } },
                            {
                                name: "item_cat2", style: { colspan: 5 },
                                editable: { type: "text", width: 526, maxlength: 50, validate: { rule: "required" }, message: "중분류" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "소분류", format: { type: "label" } },
                            {
                                name: "item_cat3", style: { colspan: 5 },
                                editable: { type: "text", width: 526, maxlength: 50, validate: { rule: "required" }, message: "대분류" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "평가문항", format: { type: "label" } },
                            {
                                name: "item_nm", style: { colspan: 5 },
                                editable: { type: "textarea", rows: 9, maxlength: 500, validate: { rule: "required", message: "평가문항" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설명", format: { type: "label" } },
                            {
                                name: "item_desc", style: { colspan: 5 },
                                editable: { type: "textarea", rows: 9, maxlength: 500, validate: { rule: "required", message: "설명" } }
                            },
                            { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                            { name: "item_seq", editable: { type: "hidden" }, hidden: true },
                            { name: "item_point", editable: { type: "hidden" }, hidden: true },
                            { name: "add_point", editable: { type: "hidden" }, hidden: true },
                            { name: "sort_seq", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_EVL_ITEM_POINT", query: "EVL_1022_1", type: "TABLE", title: "평가요소",
            caption: false, show: true, selectable: true,
            editable: { bind: "open", focus: "evl_nm", validate: true },
            content: {
                width: { label: 116, field: 84 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "배점", format: { type: "label" } },
                            {
                                name: "item_point", mask: "numeric-float1",
                                editable: { type: "text", validate: { rule: "required" }, message: "배점" }
                            },
                            { header: true, value: "가중치", format: { type: "label" } },
                            {
                                name: "add_point", mask: "numeric-float1",
                                editable: { type: "text", validate: { rule: "required" }, message: "가중치" }
                            },
                            { header: true, value: "정렬", format: { type: "label" } },
                            {
                                name: "sort_seq", mask: "numeric-int",
                                editable: { type: "text", validate: { rule: "required" }, message: "정렬" }
                            }
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
                { type: "FORM", id: "frmData_EVL_ITEM", offset: 8 },
                { type: "FORM", id: "frmData_EVL_ITEM_POINT", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //----------
        var args = { targetid: "frmData_EVL_ITEM_POINT", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //----------
        function processButton(param) {

            switch (param.element) {
                case "저장":
                    {
                        var args = {
                            target: [
                                { type: "FORM", id: "frmData_EVL_ITEM" },
                                { type: "FORM", id: "frmData_EVL_ITEM_POINT" }
                            ]
                        };
                        if (gw_com_module.objValidate(args) == false) return false;
                        processSave(param);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            gw_com_api.setValue("frmData_EVL_ITEM", param.row, param.element, param.value.current);

        }
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
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_evl_no", value: v_global.data.evl_no },
                { name: "arg_item_seq", value: v_global.data.item_seq }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_EVL_ITEM", edit: true },
            { type: "FORM", id: "frmData_EVL_ITEM_POINT", edit: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        //url: "COM",
        target: [
            { type: "FORM", id: "frmData_EVL_ITEM" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processClose({ data: response });

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    processClear(param);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_EVL_ITEM" },
            { type: "FORM", id: "frmData_EVL_ITEM_POINT" }
        ]
    };
    gw_com_module.objClear(args);

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
                if (param.data != undefined) {
                    v_global.data = param.data;
                    if (v_global.data.item_seq == undefined) {
                        var args = {
                            targetid: "frmData_EVL_ITEM", edit: true, updatable: true,
                            data: [
                                { name: "evl_no", value: v_global.data.evl_no },
                                { name: "evl_group", value: "%" }
                            ]
                        };
                        gw_com_module.formInsert(args);
                        var args = {
                            targetid: "frmData_EVL_ITEM_POINT", edit: true,
                            data: [
                                { name: "sort_seq", value: "0" }
                            ]
                        };
                        gw_com_module.formInsert(args);
                    } else {
                        processRetrieve({});
                    }
                }
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
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined)
                                param.data.arg.handler(param.data.arg.param);
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//