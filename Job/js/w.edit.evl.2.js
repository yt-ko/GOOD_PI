//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
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
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
				{
				    type: "PAGE", name: "기여율", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ECCB43" }]
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{ name: "보상", value: "산업안전보상기준", icon: "기타" },
				{ name: "심사", value: "제안제도심사기준", icon: "기타" },
				{ name: "조회", value: "새로고침", act: true },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_기여율", query: "w_edit_evl_2", type: "TABLE", title: "기여율",
            show: true, selectable: true,
            editable: { bind: "select", focus: "evl_ratio", validate: true },
            content: {
                width: { label: 20, field: 80 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "기여율", format: { type: "label" } },
                            {
                                name: "evl_ratio", style: { colfloat: "float" },
                                editable: {
                                    type: "select", data: { memory: "기여율", unshift: [{ title: "-", value: "" }] },
                                    validate: { rule: "required", message: "기여율" }, width: 190
                                }
                            },
                            { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                            { name: "item_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_평가", query: "w_edit_evl_1", title: "제안평가",
            caption: true, height: "140", show: true, number: true, selectable: true, pager: false,
            editable: { multi: true, bind: "_edit_yn", focus: "evl1_point", validate: true },
            element: [
				{ header: "평가항목", name: "evl_item", width: 120, align: "center" },
				{ header: "최고점수", name: "max_point", width: 60, align: "right", mask: "numeric-int" },
				{ header: "최하등급", name: "min_grade", width: 60, align: "right", mask: "numeric-int" },
				{ header: "1차점수", name: "evl1_point", width: 60, align: "right", mask: "numeric-int" },
				{ header: "1차등급", name: "evl1_grade_nm", width: 60, align: "center" },
				{
				    header: "2차점수", name: "evl2_point", width: 60, align: "right", mask: "numeric-int",
				    editable: { type: "text", width: 80, maxlength: 3 }
				},
				{ header: "2차등급", name: "evl2_grade_nm", width: 60, align: "center" },
                { header: "비고", name: "evl_rmk", width: 200, editable: { type: "text", width: 258, maxlength: 130 } },
                { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_no", editable: { type: "hidden" }, hidden: true },
                //{ name: "evl_ratio", editable: { type: "hidden" }, hidden: true },
                { name: "min_point", hidden: true },
                { name: "max_grade", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_기여율", offset: 8 },
				{ type: "GRID", id: "grdData_평가", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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
        var args = { targetid: "lyrMenu", element: "보상", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "심사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_평가", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

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

    switch (param.element) {
        case "보상":
            window.open("/Files/ECCB/EVL_RULE_01.pdf", "", "");
            break;
        case "심사":
            window.open("/Files/ECCB/EVL_RULE_02.pdf", "", "");
            break;
        case "조회":
            processRetrieve({});
            break;
        case "삭제":
            processDelete({});
            break;
        case "저장":
            processSave({});
            break;
        case "닫기":
            processClose({});
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "grdData_평가") {
        if (param.element == "evl2_point") {
            var min = Number(gw_com_api.getValue(param.object, param.row, "min_point", true));
            var max = Number(gw_com_api.getValue(param.object, param.row, "max_point", true));
            var val = Number(param.value.current);
            if (val < min || val > max) {
                gw_com_api.messageBox([
                    { text: min + " ~ " + max + " 사이의 값을 입력하세요." }
                ], 300);
            }
        }
    }

}
//----------
processRetrieve = function (param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
				{ name: "arg_evl_no", value: v_global.logic.evl_no }
			]
        },
        target: [
            { type: "FORM", id: "frmData_기여율", edit: true, updatable: true },
			{ type: "GRID", id: "grdData_평가", select: true, focus: true }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processDelete(param) {

    var args = {
        url: "COM",
        procedure: "PROC_ECCB_EVL_REL",
        input: [
            { name: "eccb_no", value: v_global.logic.eccb_no },
            { name: "evl_no", value: v_global.logic.evl_no, type: "varchar" },
            { name: "crud", value: "D", type: "varchar" }
        ],
        handler: {
            success: successBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        //nomessage: true,
        target: [
            { type: "FORM", id: "frmData_기여율" },
            { type: "GRID", id: "grdData_평가" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (!checkVal({ message: true })) return;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    //processRetrieve({});
    //var args = {
    //    url: "COM",
    //    procedure: "PROC_ECCB_EVL_REL",
    //    input: [
    //        { name: "eccb_no", value: v_global.logic.eccb_no },
    //        { name: "evl_no", value: v_global.logic.evl_no, type: "varchar" },
    //        { name: "crud", value: "C", type: "varchar" }
    //    ],
    //    handler: {
    //        success: successBatch
    //    }
    //};
    //gw_com_module.callProcedure(args);
    processClose({});

}
//----------
function successBatch(response, param) {

    processClose({});

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
function checkVal(param) {

    var rtn = true;
    var ids = gw_com_api.getRowIDs("grdData_평가");
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_평가", this, "_edit_yn", true) != "1") return;
        if (gw_com_api.getCRUD("grdData_평가", this, true) == "update") {
            var min = Number(gw_com_api.getValue("grdData_평가", this, "min_point", true));
            var max = Number(gw_com_api.getValue("grdData_평가", this, "max_point", true));
            var val = Number(gw_com_api.getValue("grdData_평가", this, "evl2_point", true));
            if (val < min || val > max || val == "") {
                rtn = false;
                if (param.message) {
                    gw_com_api.messageBox([{ text: "잘못된 값이 입력되었습니다." }], 300);
                }
                //gw_com_api.selectRow("grdData_평가", this, true);
                gw_com_api.setFocus("grdData_평가", this, "evl2_point", true);
                return false;
            }
        }
    });
    return rtn;
}

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
                v_global.logic.eccb_no = param.data.eccb_no;
                v_global.logic.evl_no = param.data.evl_no;
                processRetrieve({});
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
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
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

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//