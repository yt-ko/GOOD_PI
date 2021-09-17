//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.07)
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
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { type: "PAGE", page: "EHM_2222", title: "창고(위치) 선택", width: 400, height: 225, control: false };
        gw_com_module.dialoguePrepare(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "구분", query: "DDDW_CM_CODE",
                //    param: [
                //        { argument: "arg_hcode", value: "IEHM93" }
                //    ]
                //},
                //{
                //    type: "PAGE", name: "창고", query: "DDDW_CM_CODED",
                //    param: [
                //        { argument: "arg_hcode", value: "IEHM94" }
                //    ]
                //},
                {
                    type: "PAGE", name: "부품상태", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM95" }
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
            targetid: "frmData_MAIN", query: "EHM_2221_1", type: "TABLE", title: "부품 입/출고 내역",
            show: true, caption: true, selectable: true,
            editable: { bind: "select", focus: "io_date", validate: true },
            content: {
                width: { label: 100, field: 200 }, height: 30,
                row: [
                    {
                        element: [
                            { header: true, value: "일자", format: { type: "label" } },
                            {
                                name: "io_date", mask: "date-ymd",
                                editable: { type: "text", validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "구분", format: { type: "label" } },
                            { name: "io_tp_nm", editable: { type: "hidden" } },
                            { name: "io_tp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "창고(위치)", format: { type: "label" } },
                            {
                                name: "wh_nm", mask: "search",
                                editable: { type: "text", validate: { rule: "required" } }
                            },
                            { name: "wh_cd", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "부품상태", format: { type: "label" } },
                            {
                                name: "item_stat",
                                format: { type: "select", data: { memory: "부품상태", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "부품상태", unshift: [{ title: "-", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "rmk",
                                format: { type: "text", width: 360 },
                                editable: { type: "text", maxlength: 200, width: 360 }
                            },
                            { name: "io_id", editable: { type: "hidden" }, hidden: true },
                            { name: "io_user", editable: { type: "hidden" }, hidden: true },
                            { name: "io_dept", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_no", editable: { type: "hidden" }, hidden: true }
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
                { type: "FORM", id: "frmData_MAIN", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {

                case "조회":
                    {
                        processRetrieve({});
                    }
                    break;
                case "저장":
                    {
                        processSave({});
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
        function processItemdblclick(param) {

            v_global.event.type = param.type;
            v_global.event.object = param.object;
            v_global.event.row = param.row;
            v_global.event.name = param.element;

            switch (param.element) {
                case "wh_nm":
                    {
                        v_global.event.code = "wh_cd";
                        v_global.event.data = {
                            rqst_no: v_global.logic.rqst_no,
                            io_tp: gw_com_api.getValue("frmData_MAIN", 1, "io_tp")
                        };
                        var args = {
                            page: "EHM_2222",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);

                        //var args = {
                        //    type: "PAGE", page: "EHM_2222", title: "창고(위치) 선택",
                        //    width: 300, height: 200, scroll: true, open: true, control: true
                        //};

                        //if (gw_com_module.dialoguePrepare(args) == false) {
                        //    args.param = {
                        //        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        //        data: v_global.eventdata
                        //    };
                        //    gw_com_module.dialogueOpen(args);
                        //}
                    }
                    break;
            }

        }
        //=====================================================================================

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
                { name: "arg_io_id", value: v_global.logic.io_id }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN", focus: true, select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processInsert(param) {

    var io_tp = getNextIO({ rqst_no: v_global.logic.rqst_no });
    var args = {
        targetid: "frmData_MAIN", edit: true, updatable: true,
        data: [
            { name: "rqst_no", value: v_global.logic.rqst_no },
            { name: "io_tp", value: io_tp },
            { name: "io_tp_nm", value: (io_tp == "I" ? "입고" : "출고") },
            { name: "io_date", value: gw_com_api.getDate() },
            { name: "io_user", value: gw_com_module.v_Session.USR_ID },
            { name: "io_dept", value: gw_com_module.v_Session.DEPT_CD }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processSave(param) {

    var args = { target: [{ type: "FORM", id: "frmData_MAIN" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // 입고일 경우 상태 필수입력
    if (gw_com_api.getValue("frmData_MAIN", 1, "io_tp") == "I") {
        var item_stat = gw_com_api.getValue("frmData_MAIN", 1, "item_stat");
        if (item_stat == "" || item_stat == null) {
            gw_com_api.setError(true, "frmData_MAIN", 1, "item_stat");
            gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
            return;
        }
    }
    gw_com_api.setError(false, "frmData_MAIN", 1, "item_stat");

    var args = {
        url: "COM",
        target: [
            { type: "FORM", id: "frmData_MAIN" }
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

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: {
            io_id: v_global.logic.io_id
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function getNextIO(param) {

    var rtn = "I";
    var args = {
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_2221_9" +
            "&QRY_COLS=io_tp" +
            "&CRUD=R" +
            "&arg_rqst_no=" + v_global.logic.rqst_no,
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        if (data.DATA.length == 0)
            rtn = "I";
        else
            rtn = data.DATA[0];

    }
    return rtn;

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
            (v_global.event.type == "GRID"));
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
                if (param.from.type == "CHILD") {
                    v_global.logic = param.data;
                    if (param.data.io_id == undefined)
                        processInsert({});
                    else
                        processRetrieve({});
                }

                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "EHM_2222":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                switch (param.from.page) {
                    case "EHM_2222":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, param.data.code, (v_global.event.type == "GRID"));
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, param.data.name, (v_global.event.type == "GRID"));
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//