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

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            //----------
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "새로고침", act: true },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_CODE1", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_CODE2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_CODE3", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_CODE4", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CODE1", query: "EHM_1020_1", title: "부품군",
            caption: false, height: 450, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "dcode", validate: true },
            element: [
                {
                    header: "부품군", name: "dname", width: 120,
                    editable: { type: "text", validate: { rule: "required" }, maxlength: 200 }
                },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "순번", name: "sort_seq", width: 40, align: "center",
                    editable: { type: "text" }, mask: "numeric-int"
                },
                { name: "hcode", hidden: true, editable: { type: "hidden" } },
                { name: "dcode", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CODE2", query: "EHM_1020_1", title: "모델",
            caption: false, height: 450, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "dcode", validate: true },
            element: [
                {
                    header: "모델", name: "dname", width: 190,
                    editable: { type: "text", validate: { rule: "required" }, maxlength: 200 } },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "순번", name: "sort_seq", width: 40, align: "center",
                    editable: { type: "text" }, mask: "numeric-int"
                },
                { name: "hcode", hidden: true, editable: { type: "hidden" } },
                { name: "dcode", hidden: true, editable: { type: "hidden" } },
                { name: "rcode", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CODE3", query: "EHM_1020_1", title: "추정요인/점검항목",
            caption: false, height: 450, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "dcode", validate: true },
            element: [
                {
                    header: "추정요인/점검항목", name: "dname", width: 260,
                    editable: { type: "text", validate: { rule: "required" }, maxlength: 250 }
                },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "순번", name: "sort_seq", width: 40, align: "center",
                    editable: { type: "text" }, mask: "numeric-int"
                },
                { name: "hcode", hidden: true, editable: { type: "hidden" } },
                { name: "dcode", hidden: true, editable: { type: "hidden" } },
                { name: "rcode", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CODE4", query: "EHM_1020_1", title: "기준",
            caption: false, height: 450, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "dcode", validate: true },
            element: [
                {
                    header: "기준", name: "dname", width: 120,
                    editable: { type: "text", validate: { rule: "required" }, maxlength: 200 }
                },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "순번", name: "sort_seq", width: 40, align: "center",
                    editable: { type: "text" }, mask: "numeric-int"
                },
                { name: "hcode", hidden: true, editable: { type: "hidden" } },
                { name: "dcode", hidden: true, editable: { type: "hidden" } },
                { name: "rcode", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_CODE1", offset: 8 },
                { type: "GRID", id: "grdData_CODE2", offset: 8 },
				{ type: "GRID", id: "grdData_CODE3", offset: 8 },
				{ type: "GRID", id: "grdData_CODE4", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_CODE1", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_CODE1", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_CODE2", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_CODE2", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_CODE3", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_CODE3", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_CODE4", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_CODE4", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_CODE1", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_CODE1", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_CODE2", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_CODE2", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_CODE3", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_CODE3", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function click_lyrMenu_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function processInsert(param) {

            switch (param.object) {
                case "lyrMenu_CODE1":
                    {
                        var args = {
                            targetid: "grdData_CODE1", updatable: true, edit: true,
                            data: [
                                { name: "hcode", value: "IEHM79" },
                                { name: "use_yn", value: "1" },
                                { name: "sort_seq", rule: "INCREMENT", value: 1 }
                            ],
                            clear: [
                                { type: "GRID", id: "grdData_CODE2" },
                                { type: "GRID", id: "grdData_CODE3" },
                                { type: "GRID", id: "grdData_CODE4" }
                            ]
                        };
                        gw_com_module.gridInsert(args);
                    }
                    break;
                case "lyrMenu_CODE2":
                    {
                        if (gw_com_api.getSelectedRow("grdData_CODE1") == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        } else if (gw_com_api.getValue("grdData_CODE1", "selected", "dcode", true) == "") {
                            gw_com_api.messageBox([
                                { text: "데이터가 먼저 저장되어야 합니다." },
                                { text: "저장하신 후에 실행해 주세요." }
                            ]);
                            return;
                        }
                        var args = {
                            targetid: "grdData_CODE2", updatable: true, edit: true,
                            data: [
                                { name: "hcode", value: "IEHM80" },
                                { name: "use_yn", value: "1" },
                                { name: "sort_seq", rule: "INCREMENT", value: 1 },
                                { name: "rcode", value: gw_com_api.getValue("grdData_CODE1", "selected", "dcode", true) }
                            ],
                            clear: [
                                { type: "GRID", id: "grdData_CODE3" },
                                { type: "GRID", id: "grdData_CODE4" }
                            ]
                        };
                        gw_com_module.gridInsert(args);
                    }
                    break;
                case "lyrMenu_CODE3":
                    {
                        if (gw_com_api.getSelectedRow("grdData_CODE2") == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        } else if (gw_com_api.getValue("grdData_CODE2", "selected", "dcode", true) == "") {
                            gw_com_api.messageBox([
                                { text: "데이터가 먼저 저장되어야 합니다." },
                                { text: "저장하신 후에 실행해 주세요." }
                            ]);
                            return;
                        }
                        var args = {
                            targetid: "grdData_CODE3", updatable: true, edit: true,
                            data: [
                                { name: "hcode", value: "IEHM81" },
                                { name: "use_yn", value: "1" },
                                { name: "sort_seq", rule: "INCREMENT", value: 1 },
                                { name: "rcode", value: gw_com_api.getValue("grdData_CODE2", "selected", "dcode", true) }
                            ],
                            clear: [
                                { type: "GRID", id: "grdData_CODE4" }
                            ]
                        };
                        gw_com_module.gridInsert(args);
                    }
                    break;
                case "lyrMenu_CODE4":
                    {
                        if (gw_com_api.getSelectedRow("grdData_CODE3") == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        } else if (gw_com_api.getValue("grdData_CODE3", "selected", "dcode", true) == "") {
                            gw_com_api.messageBox([
                                { text: "데이터가 먼저 저장되어야 합니다." },
                                { text: "저장하신 후에 실행해 주세요." }
                            ]);
                            return;
                        }
                        var args = {
                            targetid: "grdData_CODE4", updatable: true, edit: true,
                            data: [
                                { name: "hcode", value: "IEHM82" },
                                { name: "use_yn", value: "1" },
                                { name: "sort_seq", rule: "INCREMENT", value: 1 },
                                { name: "rcode", value: gw_com_api.getValue("grdData_CODE3", "selected", "dcode", true) }
                            ]
                        };
                        gw_com_module.gridInsert(args);
                    }
                    break;
            }

        }
        //----------
        function processDelete(param) {

            var args = { targetid: "grdData_" + param.object.split("_")[1], row: "selected" };
            gw_com_module.gridDelete(args);

        }
        //----------
        function processRowselecting(param) {

            v_global.process.handler = processSelect;
            switch (param.object) {
                case "grdData_CODE1":
                    {
                        v_global.process.current.master = param.row;
                    }
                    break;
                case "grdData_CODE2":
                    {
                        v_global.process.current.sub = param.row;
                    }
                    break;
                case "grdData_CODE3":
                    {
                        v_global.process.current.detail = param.row;
                    }
                    break;
            }
            return checkUpdatable({});

        }
        //----------
        function processRowselected(param) {

            switch (param.object) {
                case "grdData_CODE1":
                    {
                        v_global.process.prev.master = param.row;
                    }
                    break;
                case "grdData_CODE2":
                    {
                        v_global.process.prev.sub = param.row;
                    }
                    break;
                case "grdData_CODE3":
                    {
                        v_global.process.prev.detail = param.row;
                    }
                    break;
            }
            processRetrieve(param);
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
function checkCRUD(param) {

    if (param.detail)
        return gw_com_api.getCRUD("grdData_CODE3", "selected", true);
    else if (param.sub)
        return gw_com_api.getCRUD("grdData_CODE2", "selected", true);
    else
        return gw_com_api.getCRUD("grdData_CODE1", "selected", true);

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            {
                type: "GRID", id: "grdData_CODE2",
                refer: (param.sub || param.detail) ? true : false
            },
            {
                type: "GRID", id: "grdData_CODE3",
                refer: (param.detail) ? true : false
            },
            { type: "GRID", id: "grdData_CODE4" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    if (param.object == "grdData_CODE1" || param.object == "grdData_CODE2" || param.object == "grdData_CODE3") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "dcode", argument: "arg_rcode" }
                ]
            },
            key: param.key
        };
        switch (param.object) {
            case "grdData_CODE1":
                {
                    args.source.argument = [{ name: "arg_hcode", value: "IEHM80" }];
                    args.target = [{ type: "GRID", id: "grdData_CODE2" }];
                    args.clear = [
                        { type: "GRID", id: "grdData_CODE3" },
                        { type: "GRID", id: "grdData_CODE4" }
                    ];
                }
                break;
            case "grdData_CODE2":
                {
                    args.source.argument = [{ name: "arg_hcode", value: "IEHM81" }];
                    args.target = [{ type: "GRID", id: "grdData_CODE3" }];
                    args.clear = [
                        { type: "GRID", id: "grdData_CODE4" }
                    ];
                }
                break;
            case "grdData_CODE3":
                {
                    args.source.argument = [{ name: "arg_hcode", value: "IEHM82" }];
                    args.target = [{ type: "GRID", id: "grdData_CODE4" }];
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
                    { name: "arg_rcode", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_CODE1", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_CODE2" },
                { type: "GRID", id: "grdData_CODE3" },
                { type: "GRID", id: "grdData_CODE4" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processSelect(param) {

    if (param.detail)
        gw_com_api.selectRow("grdData_CODE3", v_global.process.current.detail, true, false);
    else if (param.sub)
        gw_com_api.selectRow("grdData_CODE2", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_CODE1", v_global.process.current.master, true, false);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_CODE1" },
            { type: "GRID", id: "grdData_CODE2" },
            { type: "GRID", id: "grdData_CODE3" },
            { type: "GRID", id: "grdData_CODE4" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // dcode생성
    setDcode(param);

    args.url = "COM";
    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
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
function setDcode(param) {

    var dcode = getMax({ hcode: "IEHM79" });
    var ids = gw_com_api.getRowIDs("grdData_CODE1");
    var cnt = 0;
    $.each(ids, function () {
        if (gw_com_api.getCRUD("grdData_CODE1", this, true) == "create") {
            gw_com_api.setValue("grdData_CODE1", this, "dcode", ++cnt + Number(dcode), true);
        }
    })

    dcode = getMax({ hcode: "IEHM80" });
    ids = gw_com_api.getRowIDs("grdData_CODE2");
    cnt = 0;
    $.each(ids, function () {
        if (gw_com_api.getCRUD("grdData_CODE2", this, true) == "create") {
            gw_com_api.setValue("grdData_CODE2", this, "dcode", ++cnt + Number(dcode), true);
        }
    })

    dcode = getMax({ hcode: "IEHM81" });
    ids = gw_com_api.getRowIDs("grdData_CODE3");
    cnt = 0;
    $.each(ids, function () {
        if (gw_com_api.getCRUD("grdData_CODE3", this, true) == "create") {
            gw_com_api.setValue("grdData_CODE3", this, "dcode", ++cnt + Number(dcode), true);
        }
    })

    dcode = getMax({ hcode: "IEHM82" });
    ids = gw_com_api.getRowIDs("grdData_CODE4");
    cnt = 0;
    $.each(ids, function () {
        if (gw_com_api.getCRUD("grdData_CODE4", this, true) == "create") {
            gw_com_api.setValue("grdData_CODE4", this, "dcode", ++cnt + Number(dcode), true);
        }
    })

}
//----------
function getMax(param) {

    var rtn = "";
    var args = {
        request: "PAGE",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_1020_9" +
            "&QRY_COLS=dcode" +
            "&CRUD=R" +
            "&arg_hcode=" + param.hcode,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);
    function successRequest(data) {

        rtn = data.DATA[0];

    }
    return rtn;
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
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            //else {
                            //    var status = checkCRUD(param.data.arg);
                            //    if (status == "initialize" || status == "create")
                            //        processDelete(param.data.arg);
                            //    else if (status == "update")
                            //        processRestore(param.data.arg);
                            //    if (v_global.process.handler != null)
                            //        v_global.process.handler(param.data.arg);
                            //}
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove(param.data.arg);
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
                    case gw_com_api.v_Message.msg_informBatched:
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