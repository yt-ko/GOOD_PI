//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 구입처관리
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //----------
        function start() {
            //조회용 Key
            v_global.data = {
                key: {
                    main: {},
                    sub: {}
                }
            };

            gw_job_process.UI();
            gw_job_process.procedure();

            //var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            //gw_com_module.streamInterface(args);

            gw_com_module.startPage();
            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        // Main Menu : 조회, 추가, 닫기
        //var args = { targetid: "lyrMenu_1", type: "FREE",
        //    element: [
        //        { name: "추가", value: "추가" },
        //        { name: "삭제", value: "삭제" }
		//	]
        //};
        //gw_com_module.buttonMenu(args);

        // Sub Menu : 추가, 삭제
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
				{ name: "조회", value: "새로고침", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        // Main Grid : 분류1
        var args = { targetid: "grdData_MAIN", query: "QMI_9020_1", title: "용도별분류",
            caption: true, height: 420, show: true, selectable: true, number: true, key: true,
            editable: { multi: true, bind: "select", focus: "dname", validate: true },
            element: [
				{
				    header: "코드", name: "ccode", width: 60, align: "center",
				    editable: { bind: "create", type: "text", validate: { rule: "required", message: "코드" } }
				},
				{
				    header: "명칭", name: "cname", width: 150, align: "left",
				    editable: { type: "text", validate: { rule: "required", message: "명칭" } }
				},
				{
				    header: "사용", name: "use_yn", width: 50, align: "center",
				    format: { type: "checkbox", title: "", value: "1", offval: "0" },
				    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
				},
				{
				    header: "순번", name: "sort_seq", width: 50, align: "center",
				    editable: { type: "text" }, mask: "numeric-int"
				},
                { name: "hdcode", editable: { type: "hidden" }, hidden: true },
                { name: "level_no", editable: { type: "hidden" }, hidden: true },
                { name: "bcode", editable: { type: "hidden" }, hidden: true },
                { name: "use_cnt", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);

        // resize objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_MAIN", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processItemchanged(param) {

    //if (param.object == "grdData_MAIN" && param.element == "ccode") {
    //    var ids = gw_com_api.getRowIDs("grdData_SUB");
    //    $.each(ids, function () {
    //        gw_com_api.setValue("grdData_SUB", this, "bcode", param.value.current, true);
    //    });
    //}

}
//----------
function processInsert(param) {

    var args = {
        targetid: (param.object == "lyrMenu_1" ? "grdData_MAIN" : "grdData_SUB"),
        edit: true,
        data: [
            { name: "hdcode", value: "QMI-100-10" },
            { name: "level_no", value: (param.object == "lyrMenu_1" ? 1 : 2) },
            { name: "bcode", value: (param.object == "lyrMenu_1" ? "00" : gw_com_api.getValue("grdData_MAIN", "selected", "ccode", true)) },
            { name: "use_yn", value: "1" }
        ]
    };

    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var id = (param.object == "lyrMenu_1" ? "grdData_MAIN" : "grdData_SUB");
    if (gw_com_api.getValue(id, "selected", "use_cnt", true) > 0) {
        gw_com_api.messageBox([{ text: "사용된 코드는 삭제할 수 없습니다." }]);
        return;
    }

    var args = { targetid: id, row: "selected", select: true };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    v_global.data.key = {
        main: [{
            QUERY: "QMI_9020_1",
            KEY: [
                { NAME: "hdcode", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "hdcode", true) },
                { NAME: "level_no", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "level_no", true) },
                { NAME: "bcode", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "bcode", true) },
                { NAME: "ccode", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "ccode", true) }
            ]
        }]
    };

    //$.ajaxSetup({ async: false });
    processRetrieve({});
    //$.ajaxSetup({ async: true });
    //processClose({ data: true });

}
//----------
function processRetrieve(param) {
    var args;
    if (param.object == "grdData_MAIN") {
        args = {
            source: {
                type: "GRID", id: "grdData_MAIN", row: "selected",
                element: [
                    { name: "hdcode", argument: "arg_hdcode" },
                    { name: "ccode", argument: "arg_bcode" }
                ]
            },
            target: [
                //{ type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: v_global.data.key.sub,
            handler: {
                complete: processRetrieveEnd,
                param: { sub: true }
            }
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_hdcode", value: "QMI-100-10" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                //{ type: "GRID", id: "grdData_SUB" }
            ],
            key: v_global.data.key.main,
            handler: {
                complete: processRetrieveEnd,
                param: { main: true }
            }
        };
    }

    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if(param.main)
        v_global.data.key.main={};
    else
        v_global.data.key.sub = {};

}
//----------
function processClose(param) {

    if (!checkUpdatable({})) return;

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
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
			    }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//