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
                    type: "INLINE", name: "업체구분",
                    data: [
                        { title: "협력사", value: "2" },
                        { title: "고객사", value: "1" }
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
                { name: "조회", value: "조회" },
                //{ name: "추가", value: "신규 거래처" },
                { name: "추가2", value: "신규 거래처", icon: "추가" },
                { name: "저장", value: "확인" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "supp_tp", label: { title: "" },
                                editable: { type: "select", data: { memory: "업체구분" } }
                            },
                            {
                                name: "supp_nm", label: { title: "" },
                                editable: { type: "text", size: 17, validate: { rule: "required", message: "업체명" } }
                            },
                            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUPP", query: "ECM_1023_1", title: "거래처",
            caption: false, height: 320, show: true, selectable: true, number: true, key: true, //dynamic: true, multi: true, checkrow: true,
            element: [
				{ header: "거래처코드", name: "supp_cd", width: 90, align: "center", hidden: true },
				{ header: "거래처명", name: "supp_nm", width: 180 },
				{ header: "사업자등록번호", name: "rgst_no", width: 100, align: "center", mask: "biz-no" },
                { header: "대표자", name: "prsdnt_nm", width: 90, align: "center" },
                { header: "담당자", name: "person_nm", width: 90, align: "center" },
                { header: "E-Mail", name: "person_email", width: 150 },
                { header: "휴대폰", name: "person_mobile", width: 100, align: "center" },
                { header: "전화번호", name: "person_tel", width: 100, align: "center" },
                { header: "FAX", name: "person_fax", width: 100, align: "center", hidden: true },
                { header: "주소", name: "addr", width: 200, hidden: true },
                { name: "supp_tp", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_ECM_SUPP", query: "ECM_1020_2", title: "계약자",
            height: "100%", show: false,
            editable: { bind: "select", focus: "supp_tp", validate: true },
            element: [
                { name: "supp_id", editable: { type: "hidden" } },
                { name: "supp_tp", editable: { type: "hidden" } },
                { name: "supp_cd", editable: { type: "hidden" } },
                { name: "supp_nm", editable: { type: "hidden" } },
				{ name: "supp_prsdnt", editable: { type: "hidden" } },
				{ name: "supp_man", editable: { type: "hidden" } },
				{ name: "supp_telno", editable: { type: "hidden" } },
				{ name: "supp_email", editable: { type: "hidden" } },
				{ name: "supp_addr", editable: { type: "hidden" } },
				{ name: "cr_rate", editable: { type: "hidden" } },
                { name: "doc_id", editable: { type: "hidden" } },
                { name: "pstat", editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_SUPP", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_SUPP", grid: true, event: "rowdblclick", handler: processInformResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_SUPP", grid: true, event: "rowkeyenter", handler: processInformResult };
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
        case "추가":
            {
                var title = "협력사 등록";
                var args = {
                    ID: gw_com_api.v_Stream.msg_linkPage,
                    to: { type: "MAIN" },
                    data: {
                        page: "w_pom9010",
                        title: title
                    }
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case "저장":
            {
                processInformResult(param);
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
        case "추가2":
            {
                var args = {
                    type: "PAGE", page: "ECM_1024", title: "계약처 등록",
                    width: 900, height: 180, locate: ["center", "center"], open: true, scroll: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args = {
                        page: args.page,
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
    }

}
//----------
function processItemchanged(param) {

    switch (param.element) {
        case "supp_tp":
            {
                if (gw_com_api.getValue(param.object, param.row, "supp_nm") == "") {
                    processClear({});
                } else {
                    processRetrieve({});
                }
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = {
        target: [{ type: "FORM", id: "frmOption" }]
    };
    if (gw_com_module.objValidate(args) == false)
        return false;

    var args = {
        source: {
            type: "FORM",id: "frmOption",
            element: [
                { name: "supp_tp", argument: "arg_supp_tp" },
                { name: "supp_nm", argument: "arg_supp_nm" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_SUPP", focus: true, select: true }
        ],
        handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processInformResult(param) {

    var row = param.objct == "grdList_SUPP" ? param.row : gw_com_api.getSelectedRow("grdList_SUPP");
    if (row > 0) {
        var args = {
            targetid: "grdData_ECM_SUPP", edit: true, updatable: true,
            data: [
	            { name: "doc_id", value: v_global.data.doc_id },
                { name: "pstat", value: "REG" },
                { name: "supp_tp", value: gw_com_api.getValue("frmOption", 1, "supp_tp") },
                { name: "supp_cd", value: gw_com_api.getValue("grdList_SUPP", row, "supp_cd", true) },
                { name: "supp_nm", value: gw_com_api.getValue("grdList_SUPP", row, "supp_nm", true) },
                { name: "supp_man", value: gw_com_api.getValue("grdList_SUPP", row, "person_nm", true) },
                { name: "supp_email", value: gw_com_api.getValue("grdList_SUPP", row, "person_email", true) },
                { name: "supp_telno", value: gw_com_api.getValue("grdList_SUPP", row, "person_mobile", true) },
                { name: "supp_faxno", value: gw_com_api.getValue("grdList_SUPP", row, "person_fax", true) },
                { name: "supp_addr", value: gw_com_api.getValue("grdList_SUPP", row, "addr", true) },
                { name: "supp_prsdnt", value: gw_com_api.getValue("grdList_SUPP", row, "prsdnt_nm", true) },
                { name: "rgst_no", value: gw_com_api.getValue("grdList_SUPP", row, "rgst_no", true) }
            ]
        };
        gw_com_module.gridInsert(args);
        processSave({});
    }

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        nomessage: true,
        target: [
			{ type: "GRID", id: "grdData_ECM_SUPP" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_ECM_SUPP" }
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
			{ type: "GRID", id: "grdList_SUPP" }
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
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
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
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "ECM_1024":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.data;
                        }
                        break;
                    default:
                        {
                            v_global.data = param.data;
                            return;
                        }
                }
                gw_com_module.streamInterface(args);
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
                    case "ECM_1024":
                        {
                            if (param.data != undefined) {
                                var args = {
                                    ID: gw_com_api.v_Stream.msg_closeDialogue,
                                    data: v_global.data
                                };
                                gw_com_module.streamInterface(args);
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//