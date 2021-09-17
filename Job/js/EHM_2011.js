//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.04)
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // start page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         start();

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "확인" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE1", query: "EHM_2011_1", title: "발생현상(대)",
            caption: true, height: 250, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "발생현상(대)", name: "fcode1", width: 200 }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE2", query: "EHM_2011_2", title: "발생현상(중)",
            caption: true, height: 250, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "발생현상(중)", name: "dname", width: 200 },
                { name: "dcode", hidden: true },
                { name: "fcode1", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE3", query: "EHM_2011_3", title: "발생현상(소)",
            caption: true, height: 250, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "발생현상(소)", name: "status_tp2_nm", width: 200 },
                { name: "status_tp1_nm", hidden: true },
                { name: "status_grp_nm", hidden: true },
                { name: "status_tp2", hidden: true },
                { name: "status_tp1", hidden: true },
                { name: "status_grp", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_CODE1", offset: 8 },
                { type: "GRID", id: "grdList_CODE2", offset: 8 },
                { type: "GRID", id: "grdList_CODE3", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_CODE1", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_CODE2", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {

                case "저장":
                    {
                        informResult({});
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

    if (param.object == "grdList_CODE1") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "fcode1", argument: "arg_fcode1" }
                ],
                argument: [
                    { name: "arg_prod_type", value: v_global.logic.prod_type }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_CODE2" }
            ],
            clear: [
                { type: "GRID", id: "grdList_CODE3" }
            ]
        };
        gw_com_module.objRetrieve(args);

    } else if (param.object == "grdList_CODE2") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "dcode", argument: "arg_rcode" },
                    { name: "dname", argument: "arg_rname" },
                    { name: "fcode1", argument: "arg_fcode1" }
                ],
                argument: [
                    { name: "arg_prod_type", value: v_global.logic.prod_type }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_CODE3" }
            ]
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_prod_type", value: v_global.logic.prod_type }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_CODE1" }
            ],
            clear: [
                { type: "GRID", id: "grdList_CODE2" },
                { type: "GRID", id: "grdList_CODE3" }
            ]
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function informResult(param) {

    if (gw_com_api.getSelectedRow("grdList_CODE2") == null) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }
    var data = {
        status_grp: gw_com_api.getValue("grdList_CODE1", "selected", "fcode1", true),
        status_grp_nm: gw_com_api.getValue("grdList_CODE1", "selected", "fcode1", true),
        status_tp1: gw_com_api.getValue("grdList_CODE2", "selected", "dcode", true),
        status_tp1_nm: gw_com_api.getValue("grdList_CODE2", "selected", "dname", true),
        status_tp2: (gw_com_api.getSelectedRow("grdList_CODE3") == null ? "" : gw_com_api.getValue("grdList_CODE3", "selected", "status_tp2", true)),
        status_tp2_nm: (gw_com_api.getSelectedRow("grdList_CODE3") == null ? "" : gw_com_api.getValue("grdList_CODE3", "selected", "status_tp2_nm", true))
    }
    processClose({ data: data });
    //processClose({ data: gw_com_api.getRowData("grdList_CODE3", "selected") });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_CODE1" },
            { type: "GRID", id: "grdList_CODE2" },
            { type: "GRID", id: "grdList_CODE3" }
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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (param.from.type == "CHILD") {
                    v_global.logic = param.data;
                    processRetrieve({});
                }

                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "":
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
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//