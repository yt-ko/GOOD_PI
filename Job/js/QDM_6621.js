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
            targetid: "grdList_CODE1", query: "QDM_6621_1", title: "요인1",
            caption: false, height: 280, pager: false, show: true, selectable: true,
            element: [
                { header: "요인1", name: "dname" },
                { name: "dcode", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE2", query: "QDM_6621_1", title: "요인2",
            caption: false, height: 280, pager: false, show: true, selectable: true,
            element: [
                { header: "요인2", name: "dname" },
                { name: "dcode", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE3", query: "QDM_6621_1", title: "요인3",
            caption: false, height: 280, pager: false, show: true, selectable: true,
            element: [
                { header: "요인3", name: "dname" },
                { name: "dcode", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE4", query: "QDM_6621_1", title: "요인4",
            caption: false, height: 280, pager: false, show: true, selectable: true,
            element: [
                { header: "요인4", name: "dname" },
                { name: "dcode", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE5", query: "QDM_6621_1", title: "요인5",
            caption: false, height: 280, pager: false, show: true, selectable: true,
            element: [
                { header: "요인5", name: "dname" },
                { name: "dcode", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_CODE1", offset: 8 },
                { type: "GRID", id: "grdList_CODE2", offset: 8 },
                { type: "GRID", id: "grdList_CODE3", offset: 8 },
                { type: "GRID", id: "grdList_CODE4", offset: 8 },
                { type: "GRID", id: "grdList_CODE5", offset: 8 }
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

    if (param.object == "grdList_CODE1" || param.object == "grdList_CODE2") {

        switch (param.object) {
            case "grdList_CODE1":
                {
                    var args = {
                        source: {
                            type: param.type, id: param.object, row: param.row, block: true,
                            element: [
                                { name: "dcode", argument: "arg_rcode" }
                            ],
                            argument: [
                                { name: "arg_hcode", value: "IEHM86" }
                            ]
                        },
                        target: [
                            { type: "GRID", id: "grdList_CODE2", select: true }
                        ],
                        clear: [
                            { type: "GRID", id: "grdList_CODE3" },
                            { type: "GRID", id: "grdList_CODE4" },
                            { type: "GRID", id: "grdList_CODE5" }
                        ]
                    };
                    if (v_global.logic != undefined && v_global.logic.code2 != undefined) {
                        args.key = [
                            {
                                KEY: [
                                    { NAME: "dcode", VALUE: v_global.logic.code2 }
                                ],
                                QUERY: $("#grdList_CODE2_data").attr("query")
                            }
                        ];
                    }
                    gw_com_module.objRetrieve(args);
                }
                break;
            case "grdList_CODE2":
                {
                    var args = {
                        source: {
                            type: param.type, id: param.object, row: param.row, block: true,
                            element: [
                                { name: "dcode", argument: "arg_rcode" }
                            ],
                            argument: [
                                { name: "arg_hcode", value: "IEHM87" }
                            ]
                        },
                        target: [
                            { type: "GRID", id: "grdList_CODE3", select: true }
                        ],
                        handler: {
                            complete: processRetrieveEnd, param: { object: "grdList_CODE3" }
                        }
                    };
                    if (v_global.logic != undefined && v_global.logic.code3 != undefined) {
                        args.key = [
                            {
                                KEY: [
                                    { NAME: "dcode", VALUE: v_global.logic.code3 }
                                ],
                                QUERY: $("#grdList_CODE3_data").attr("query")
                            }
                        ];
                    }
                    gw_com_module.objRetrieve(args);
                    //----------
                    var args = {
                        source: {
                            type: param.type, id: param.object, row: param.row, block: true,
                            element: [
                                { name: "dcode", argument: "arg_rcode" }
                            ],
                            argument: [
                                { name: "arg_hcode", value: "IEHM88" }
                            ]
                        },
                        target: [
                            { type: "GRID", id: "grdList_CODE4", select: true }
                        ],
                        handler: {
                            complete: processRetrieveEnd, param: { object: "grdList_CODE4" }
                        }
                    };
                    if (v_global.logic != undefined && v_global.logic.code4 != undefined) {
                        args.key = [
                            {
                                KEY: [
                                    { NAME: "dcode", VALUE: v_global.logic.code4 }
                                ],
                                QUERY: $("#grdList_CODE4_data").attr("query")
                            }
                        ];
                    }
                    gw_com_module.objRetrieve(args);
                    //----------
                    var args = {
                        source: {
                            type: param.type, id: param.object, row: param.row, block: true,
                            element: [
                                { name: "dcode", argument: "arg_rcode" }
                            ],
                            argument: [
                                { name: "arg_hcode", value: "IEHM89" }
                            ]
                        },
                        target: [
                            { type: "GRID", id: "grdList_CODE5", select: true }
                        ],
                        handler: {
                            complete: processRetrieveEnd, param: { object: "grdList_CODE5" }
                        }
                    };
                    if (v_global.logic != undefined && v_global.logic.code5 != undefined) {
                        args.key = [
                            {
                                KEY: [
                                    { NAME: "dcode", VALUE: v_global.logic.code5 }
                                ],
                                QUERY: $("#grdList_CODE5_data").attr("query")
                            }
                        ];
                    }
                    gw_com_module.objRetrieve(args);
                }
                break;
        }

    } else {

        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_hcode", value: "IEHM85" },
                    { name: "arg_rcode", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_CODE1", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_CODE2" },
                { type: "GRID", id: "grdList_CODE3" },
                { type: "GRID", id: "grdList_CODE4" },
                { type: "GRID", id: "grdList_CODE5" }
            ]
        };
        if (v_global.logic != undefined && v_global.logic.code1 != undefined) {
            args.key = [
                {
                    KEY: [
                        { NAME: "dcode", VALUE: v_global.logic.code1 }
                    ],
                    QUERY: $("#grdList_CODE1_data").attr("query")
                }
            ];
        }
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processRetrieveEnd(param) {

    //if (param.object == "grdList_CODE3" || param.object == "grdList_CODE4")
    //    processRetrieve(param);

}
//----------
function informResult(param) {

    var data = {
        dcode1: gw_com_api.getValue("grdList_CODE1", "selected", "dcode", true),
        dname1: gw_com_api.getValue("grdList_CODE1", "selected", "dname", true),
        dcode2: gw_com_api.getValue("grdList_CODE2", "selected", "dcode", true),
        dname2: gw_com_api.getValue("grdList_CODE2", "selected", "dname", true),
        dcode3: gw_com_api.getValue("grdList_CODE3", "selected", "dcode", true),
        dname3: gw_com_api.getValue("grdList_CODE3", "selected", "dname", true),
        dcode4: gw_com_api.getValue("grdList_CODE4", "selected", "dcode", true),
        dname4: gw_com_api.getValue("grdList_CODE4", "selected", "dname", true),
        dcode5: gw_com_api.getValue("grdList_CODE5", "selected", "dcode", true),
        dname5: gw_com_api.getValue("grdList_CODE5", "selected", "dname", true)
    };
    processClose({ data: data });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_CODE1" },
            { type: "GRID", id: "grdList_CODE2" },
            { type: "GRID", id: "grdList_CODE3" },
            { type: "GRID", id: "grdList_CODE4" },
            { type: "GRID", id: "grdList_CODE5" }
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