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
            targetid: "grdList_CODE1", query: "EHM_2013_1", title: "부품군",
            caption: false, height: 280, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            color: { row: true },
            element: [
                {
                    header: "부품군", name: "dname", width: 200,
                    editable: { type: "text", maxlength: 200 }
                },
                { name: "dcode", hidden: true },
                { name: "edit_yn", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE2", query: "EHM_2013_1", title: "모델",
            caption: false, height: 280, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            color: { row: true },
            element: [
                {
                    header: "모델", name: "dname", width: 210,
                    editable: { type: "text", maxlength: 200 }
                },
                { name: "dcode", hidden: true },
                { name: "edit_yn", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE3", query: "EHM_2013_1", title: "추정요인/점검항목",
            caption: false, height: 280, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            color: { row: true },
            element: [
                {
                    header: "추정요인/점검항목", name: "dname", width: 280,
                    editable: { type: "text", maxlength: 250 }
                },
                { name: "dcode", hidden: true },
                { name: "edit_yn", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CODE4", query: "EHM_2013_1", title: "기준",
            caption: false, height: 280, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            color: { row: true },
            element: [
                {
                    header: "기준", name: "dname", width: 90,
                    editable: { type: "text", maxlength: 200 }
                },
                { name: "dcode", hidden: true },
                { name: "edit_yn", hidden: true },
                { name: "color", hidden: true }
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
                { type: "GRID", id: "grdList_CODE4", offset: 8 }
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
        //----------
        var args = { targetid: "grdList_CODE3", grid: true, event: "rowselected", handler: processRetrieve };
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

    if (param.object == "grdList_CODE1" || param.object == "grdList_CODE2" || param.object == "grdList_CODE3") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "dcode", argument: "arg_rcode" }
                ]
            }
        };
        switch (param.object) {
            case "grdList_CODE1":
                {
                    args.source.argument = [
                        { name: "arg_hcode", value: "IEHM80" },
                        { name: "arg_dcode", value: v_global.logic.code2 },
                        { name: "arg_dname", value: v_global.logic.name2 }
                    ];
                    args.target = [{ type: "GRID", id: "grdList_CODE2", select: true }];
                    args.clear = [
                        { type: "GRID", id: "grdList_CODE3" },
                        { type: "GRID", id: "grdList_CODE4" }
                    ];
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
                }
                break;
            case "grdList_CODE2":
                {
                    args.source.argument = [
                        { name: "arg_hcode", value: "IEHM81" },
                        { name: "arg_dcode", value: v_global.logic.code3 },
                        { name: "arg_dname", value: v_global.logic.name3 }
                    ];
                    args.target = [{ type: "GRID", id: "grdList_CODE3", select: true}];
                    args.clear = [{ type: "GRID", id: "grdList_CODE4" }];
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
                }
                break;
            case "grdList_CODE3":
                {
                    args.source.argument = [
                        { name: "arg_hcode", value: "IEHM82" },
                        { name: "arg_dcode", value: v_global.logic.code4 },
                        { name: "arg_dname", value: v_global.logic.name4 }
                    ];
                    args.target = [{ type: "GRID", id: "grdList_CODE4", select: true}];
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
                }
                break;
        }
        gw_com_module.objRetrieve(args);

    } else {

        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_hcode", value: "IEHM79" },
                    { name: "arg_rcode", value: "%" },
                    { name: "arg_dcode", value: v_global.logic.code1 },
                    { name: "arg_dname", value: v_global.logic.name1 }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_CODE1", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_CODE2" },
                { type: "GRID", id: "grdList_CODE3" },
                { type: "GRID", id: "grdList_CODE4" }
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
function informResult(param) {

    if (gw_com_api.getSelectedRow("grdList_CODE1") == null) {
        gw_com_api.messageBox([{ text: "부품군이 선택되지 않았습니다." }]);
        return;
    } else if(gw_com_api.getSelectedRow("grdList_CODE2") == null) {
        gw_com_api.messageBox([{ text: "모델이 선택되지 않았습니다." }]);
        return;
    } else if (gw_com_api.getSelectedRow("grdList_CODE3") == null) {
        gw_com_api.messageBox([{ text: "추정요인/점검항목이 선택되지 않았습니다." }]);
        return;
    } else if (gw_com_api.getSelectedRow("grdList_CODE4") == null) {
        gw_com_api.messageBox([{ text: "기준이 선택되지 않았습니다." }]);
        return;
    }

    var data = {
        code1: gw_com_api.getValue("grdList_CODE1", "selected", "dcode", true),
        name1: gw_com_api.getValue("grdList_CODE1", "selected", "dname", true),
        code2: gw_com_api.getValue("grdList_CODE2", "selected", "dcode", true),
        name2: gw_com_api.getValue("grdList_CODE2", "selected", "dname", true),
        code3: gw_com_api.getValue("grdList_CODE3", "selected", "dcode", true),
        name3: gw_com_api.getValue("grdList_CODE3", "selected", "dname", true),
        code4: gw_com_api.getValue("grdList_CODE4", "selected", "dcode", true),
        name4: gw_com_api.getValue("grdList_CODE4", "selected", "dname", true)
    };
    if (data.code1 == "직접입력") data.code1 = data.name1;
    if (data.code2 == "직접입력") data.code2 = data.name2;
    if (data.code3 == "직접입력") data.code3 = data.name3;
    if (data.code4 == "직접입력") data.code4 = data.name4;
    processClose({ data: data });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_CODE1" },
            { type: "GRID", id: "grdList_CODE2" },
            { type: "GRID", id: "grdList_CODE3" },
            { type: "GRID", id: "grdList_CODE4" }
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