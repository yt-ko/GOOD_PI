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
				    type: "PAGE", name: "ECM040", query: "DDDW_CM_CODE",    // 계약자구분
				    param: [{ argument: "arg_hcode", value: "ECM040" }]
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
                { name: "확인", value: "확인", icon: "예" },
                { name: "취소", value: "취소", icon: "아니오" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUPP", query: "ECM_1020_2", type: "TABLE", title: "계약처",
            caption: false, show: true,
            editable: { bind: "select", focus: "supp_nm", validate: true },
            content: {
                width: { label: 100, field: 180 }, height: 30,
                row: [
                    {
                        element: [
                            { header: true, value: "거래처명", format: { type: "label" } },
                            {
                                name: "supp_nm",
                                editable: { type: "text", validate: { rule: "required", message: "거래처명" } }
                            },
                            { header: true, value: "사업자등록번호", format: { type: "label" } },
                            {
                                name: "rgst_no", mask: "biz-no",
                                editable: { type: "text" } //, validate: { rule: "required", message: "사업자등록번호" } }
                            },
                            { header: true, value: "대표자", format: { type: "label" } },
                            {
                                name: "supp_prsdnt",
                                editable: { type: "text" } //, validate: { rule: "required", message: "대표자" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "담당자", format: { type: "label" } },
                            {
                                name: "supp_man",
                                editable: { type: "text" }
                            },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            {
                                name: "supp_email",
                                editable: { type: "text" }
                            },
                            { header: true, value: "연락처", format: { type: "label" } },
                            {
                                name: "supp_telno",
                                editable: { type: "text" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "주소", format: { type: "label" } },
                            {
                                name: "supp_addr", style: { colspan: 3 },
                                format: { widt: 456 },
                                editable: { type: "text", width: 456 }
                            },
                            { header: true, value: "구분", format: { type: "label" } },
                            {
                                name: "supp_tp",
                                format: { type: "select", data: { memory: "ECM040" } },
                                editable: { type: "select", data: { memory: "ECM040" }, validate: { rule: "required", message: "계약자 구분" } }
                            },
                            { name: "supp_id", editable: { type: "hidden" }, hidden: true },
                            { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "supp_cd", editable: { type: "hidden" }, hidden: true }
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
				{ type: "FORM", id: "frmData_SUPP", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
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
function processButton(param) {

    if (param.object == undefined) return false;
    switch (param.element) {
        case "확인":
            {
                processSave(param)
            }
            break;
        case "취소":
            {
                processClose({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {


}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        nomessage: true,
        target: [
            { type: "FORM", id: "frmData_SUPP" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (v_global.data.doc_id && v_global.data.doc_id > 0) {
        args.handler = {
            success: successSave
        };
        gw_com_module.objSave(args);
    } else {
        var data = {
            supp_tp: gw_com_api.getValue("frmData_SUPP", 1, "supp_tp"),
            supp_cd: gw_com_api.getValue("frmData_SUPP", 1, "supp_cd"),
            supp_nm: gw_com_api.getValue("frmData_SUPP", 1, "supp_nm"),
            supp_prsdnt: gw_com_api.getValue("frmData_SUPP", 1, "supp_prsdnt"),
            supp_man: gw_com_api.getValue("frmData_SUPP", 1, "supp_man"),
            supp_telno: gw_com_api.getValue("frmData_SUPP", 1, "supp_telno"),
            supp_email: gw_com_api.getValue("frmData_SUPP", 1, "supp_email"),
            supp_addr: gw_com_api.getValue("frmData_SUPP", 1, "supp_addr"),
            rgst_no: gw_com_api.getValue("frmData_SUPP", 1, "rgst_no")
        };
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: data
        };
        gw_com_module.streamInterface(args);
    }

}
//----------
function successSave(response, param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_SUPP" }
        ]
    };
    gw_com_module.objClear(args);

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: v_global.data
    };
    gw_com_module.streamInterface(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_SUPP" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

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
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                //if (param.data.page != gw_com_api.getPageID()) {
                //    param.to = { type: "POPUP", page: param.data.page };
                //    gw_com_module.streamInterface(param);
                //    break;
                //}
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.data = param.data;
                args = {
                    targetid: "frmData_SUPP", edit: true, updatable: true,
                    data: [
                        { name: "doc_id", value: v_global.data.doc_id },
                        { name: "supp_tp", value: "2" },
                        { name: "pstat", value: "REG" },
                        { name: "supp_cd", value: "ECM_SUPP" }
                    ]
                };
                gw_com_module.formInsert(args);
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