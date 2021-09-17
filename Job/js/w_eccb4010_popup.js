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
        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.streamInterface(args);            
            gw_com_module.startPage();
            
            processRetrieve({});
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
                //{ name: "조회", value: "조회" },
                ////{ name: "추가", value: "신규 거래처" },
                //{ name: "추가2", value: "신규 거래처", icon: "추가" },
                //{ name: "저장", value: "확인" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: false, align: "left", hide: true, show:false,
            editable: { bind: "open", focus: "eco_no", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "eco_no", label: { title: "" }, hide: true,
                                editable: { type: "text", size: 17, validate: { rule: "required", message: "ECO no." } }
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
            targetid: "grdList_STOCK", query: "w_eccb4010_popup_1", title: "재고현황",
            caption: true, height: 115, show: true, selectable: true, number: true, key: true, //dynamic: true, multi: true, checkrow: true,
            element: [
				{ header: "품목코드", name: "item_cd", width: 40, align: "center" },
				{ header: "품명", name: "item_nm", width: 120 },
				{ header: "규격", name: "spec", width: 150, align: "left", mask: "biz-no" },
                { header: "창고", name: "sl_nm", width: 80, align: "left" },
                { header: "수량", name: "g_qty", width: 30, align: "right", mask:"numeric-int"}
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PO", query: "w_eccb4010_popup_2", title: "구매요청내역", scroll:true,
            caption: true, height: 220, show: true, selectable: true, number: true, key: true, //dynamic: true, multi: true, checkrow: true,
            element: [
                { header: "Project No.", name: "tracking_no", width: 80, align: "center" },
                { header: "의뢰번호", name: "ext3_cd", width: 90, align: "center" },
                { header: "구매요청번호", name: "pr_no", width: 100, align: "center" },
                //{ header: "품목코드", name: "item_cd", width: 80, align: "center" },
                //{ header: "품명", name: "item_nm", width: 150, align: "left" },
                //{ header: "규격", name: "spec", width: 180, align: "left" },
                { header: "요청수량", name: "req_qty", width: 70, align: "right", mask: "numeric-int" },
                { header: "요청원수량", name: "ext1_qty", width: 70, align: "right", mask: "numeric-int" },
				{ header: "발주수량", name: "po_qty", width: 70, align: "right", mask: "numeric-int" },
				{ header: "발주업체", name: "bp_nmm", width: 160, align: "left", mask: "biz-no" },
                {
                    header: "구매요청마감", name: "rq_cls", width: 80, align: "center",
                    format: { type: "checkbox", value: "Y", offval: "N" }
                },
                {
                    header: "발주마감", name: "po_cls", width: 80, align: "center", mask: "numeric-int",
                    format: { type: "checkbox", value: "Y", offval: "N" }
                }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_STOCK", offset: 8 },
                { type: "GRID", id: "grdList_PO", offset: 8 }
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
        //var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "추가2", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "grdList_STOCK", grid: true, event: "rowselected", handler: rowselected_grdList_STOCK };
        gw_com_module.eventBind(args);
        //var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        //gw_com_module.eventBind(args);
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
function rowselected_grdList_STOCK(ui) {
    processLink({});
}
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM",id: "frmOption",
            element: [
                { name: "eco_no", argument: "arg_eco_no" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_STOCK", focus: true, select: true }
        ]
        //handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
    var args = {
        source: {
            type: "GRID", id: "grdList_STOCK", row: "selected", block: true,
            element: [
                { name: "item_cd", argument: "arg_item_cd" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_PO", focus: true, select: true }
        ]
    };
    gw_com_module.objRetrieve(args);
}
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

}
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
        case gw_com_api.v_Stream.msg_openDialogue:
            {
                if (param.data.key != null)
                    gw_com_api.setValue("frmOption", 1, "eco_no", param.data.key);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (param.data.key != null)
                    gw_com_api.setValue("frmOption", 1, "eco_no", param.data.key);
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                processRetrieve({});
                //gw_com_module.streamInterface(args);
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