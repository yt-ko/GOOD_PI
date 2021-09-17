//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.06)
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");
        //----------
        v_global.logic.ext1 = gw_com_api.getPageParameter("ext1");  //평가 속성
        //----------
        // prepare dialogue.
        var args = { type: "PAGE", page: "EVL_1021", title: "평가요소 엑셀 업로드", width: 650, height: 180 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "EVL_9022", title: "평가요소 수정", width: 700, height: 530 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = {
            request: [
                { type: "PAGE", name: "평가연도", query: "dddw_evl_year" },
                {
                    type: "PAGE", name: "평가그룹", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "EVL02" }]
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
            //----------
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE", show: true,
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
                { name: "완료", value: "평가완료", icon: "기타", updatable: true },
                //{ name: "취소2", value: "완료취소", icon: "아니오", updatable: true },
                { name: "진행", value: "평가진행", icon: "예", updatable: true },
                { name: "취소", value: "진행취소", icon: "아니오", updatable: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_EVL_ITEM", type: "FREE", show: true,
            element: [
                { name: "받기", value: "엑셀내려받기", icon: "엑셀", updatable: true },
                { name: "올리기", value: "엑셀가져오기", icon: "엑셀", updatable: true },
                { name: "수정", value: "수정", icon: "기타", updatable: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE", title: "",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "evl_group", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "evl_group", label: { title: "평가그룹 :" },
                                editable: { type: "select", data: { memory: "평가그룹", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_EVL", query: "EVL_1020_1", title: "평가목록",
            height: 150, show: true, caption: true, selectable: true, number: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            element: [
                {
                    header: "평가명", name: "evl_nm", width: 450,
                    editable: { type: "text", maxlength: 20, validate: { rule: "required", message: "평가명" } }
                },
                {
                    header: "평가연도", name: "evl_year", width: 100, align: "center",
                    editable: { type: "select", data: { memory: "평가연도" }, validate: { rule: "required", message: "평가연도" } }
                },
                { header: "진행상태", name: "pstat_nm", width: 100, align: "center" },
                {
                    header: "시행일", name: "fr_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required", message: "시행일" } }
                },
                {
                    header: "마감일", name: "to_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required", message: "마감일" } }
                },
                { header: "확정일", name: "close_date", width: 100, align: "center", mask: "date-ymd" },
                {
                    header: "평가번호", name: "evl_no", width: 100, align: "center",
                    editable: { type: "hidden" }
                },
                { name: "pstat", hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_EVL_ITEM", query: "EVL_1020_2", title: "평가요소",
            caption: true, height: 300, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            element: [
                { header: "평가그룹", name: "evl_group_nm", width: 80 },
                { header: "대분류", name: "item_cat1", width: 110 },
                { header: "중분류", name: "item_cat2", width: 110 },
                { header: "소분류", name: "item_cat3", width: 110 },
                { header: "평가문항", name: "item_nm", width: 400 },
                { header: "설명", name: "item_desc", width: 400 },
                {
                    header: "배점", name: "item_point", width: 80, mask: "numeric-float1", align: "right",
                    editable: { type: "text", validate: { rule: "required", message: "배점" } }
                },
                {
                    header: "가중치", name: "add_point", width: 80, mask: "numeric-float1", align: "right",
                    editable: { type: "text", validate: { rule: "required", message: "가중치" } }
                },
                {
                    header: "정렬", name: "sort_seq", width: 80, mask: "numeric-int", align: "right",
                    editable: { type: "text" }
                },
                { name: "evl_no", hidden: true, editable: { type: "hidden" } },
                { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                { name: "evl_group", hidden: true, editable: { type: "hidden" } },
                { name: "point_type", hidden: true, editable: { type: "hidden" } },
                { name: "add_type", hidden: true, editable: { type: "hidden" } },
                { name: "edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_EVL", offset: 8 },
                { type: "GRID", id: "grdData_EVL_ITEM", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================

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

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "완료", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "진행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_ITEM", element: "받기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_ITEM", element: "올리기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_ITEM", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_ITEM", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_ITEM", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_ITEM", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        processRetrieve({});
                    }
                    break;
                case "완료":
                case "취소2":
                case "진행":
                case "취소":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_EVL");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        if (!checkUpdatable({ check: true })) return;
                        var pstat = "";
                        var msg = "";
                        if (param.element == "완료") {
                            pstat = "90";
                            msg = "평가완료";
                        } else if (param.element == "") {
                            pstat = "00";
                            msg = "완료취소";
                        } else if (param.element == "진행") {
                            pstat = "10";
                            msg = "평가진행";
                        } else if (param.element == "취소") {
                            pstat = "00";
                            msg = "진행취소";
                        }
                        var p = {
                            handler: processBatch,
                            param: {
                                evl_no: gw_com_api.getValue("grdData_EVL", row, "evl_no", true),
                                pstat: pstat
                            }
                        };
                        gw_com_api.messageBox([{ text: msg + " 처리 하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                    }
                    break;
                case "수정":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_EVL_ITEM");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        if (gw_com_api.getValue("grdData_EVL_ITEM", "selected", "edit_yn", true) != "1") {
                            gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
                            return;
                        }
                        v_global.event.data = {
                            evl_no: gw_com_api.getValue("grdData_EVL_ITEM", row, "evl_no", true),
                            item_seq: gw_com_api.getValue("grdData_EVL_ITEM", row, "item_seq", true)
                        }
                        var args = {
                            page: "EVL_9022",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "추가":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_EVL");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        if (gw_com_api.getValue("grdData_EVL", row, "edit_yn", true) != "1") {
                            gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
                            return;
                        }
                        v_global.event.data = {
                            evl_no: gw_com_api.getValue("grdData_EVL", row, "evl_no", true)
                        }
                        var args = {
                            page: "EVL_9022",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                        //var args = {
                        //    targetid: "grdData_EVL_ITEM", edit: true, updatable: true,
                        //    data: [
                        //        { name: "evl_no", rule: "COPY", row: "prev" },
                        //        { name: "evl_seq", rule: "INCREMENT", value: 1 },
                        //        { name: "sort_seq", rule: "INCREMENT", value: 1 },
                        //        { name: "evl_ggroup", value: "%" }
                        //    ]
                        //};
                        //gw_com_module.gridInsert(args);
                    }
                    break;
                case "삭제":
                    {
                        if (gw_com_api.getSelectedRow("grdData_EVL_ITEM") == null) {
                            gw_com_api.messageBox([{ text: "삭제할 데이터가 선택되지 않았습니다." }]);
                            return;
                        }
                        if (gw_com_api.getValue("grdData_EVL_ITEM", "selected", "edit_yn", true) != "1") {
                            gw_com_api.messageBox([{ text: "선택하신 데이터는 삭제할 권한이 없습니다." }]);
                            return;
                        }
                        var p = {
                            handler: processRemove
                        };
                        gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);
                        //var args = { targetid: "grdData_EVL_ITEM", row: "selected", check: "edit_yn" };
                        //gw_com_module.gridDelete(args);
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
                case "받기":
                    {
                        if (gw_com_api.getSelectedRow("grdData_EVL") == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        var args = {
                            option: [
                                { name: "PRINT", value: "xls" },
                                { name: "PAGE", value: gw_com_module.v_Current.window },
                                { name: "USER", value: gw_com_module.v_Session.USR_ID },
                                { name: "KEY", value: gw_com_api.getValue("grdData_EVL", "selected", "evl_no", true) }
                            ],
                            target: { type: "FILE", id: "lyrDown", name: "양식" }
                        };
                        gw_com_module.objExport(args);
                    }
                    break;
                case "올리기":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_EVL");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        if (gw_com_api.getValue("grdData_EVL", row, "edit_yn", true) != "1") {
                            gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
                            return;
                        }
                        v_global.event.data = {
                            evl_no: gw_com_api.getValue("grdData_EVL", row, "evl_no", true)
                        }
                        var args = {
                            page: "EVL_1021",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
            }

        }
        //----------
        function processRowselecting(param) {

            v_global.process.current.row = param.row;
            v_global.process.handler = function () {
                gw_com_api.selectRow(param.object, v_global.process.current.row, true, false);
            };
            var args = {
                target: [
                    { type: "GRID", id: "grdData_EVL_ITEM" }
                ]
            };
            return gw_com_module.objUpdatable(args);

        }
        //----------
        function processRowselected(param) {

            processRetrieve(param);

        }
        //----------
        function processItemchanged(param) {

            processRetrieve({ object: "grdData_EVL", row: "selected", type: "GRID" });

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

    var args;
    if (param.object == "grdData_EVL") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "evl_no", argument: "arg_evl_no" }
                ],
                argument: [
                    { name: "arg_evl_group", value: gw_com_api.getValue("frmOption2", 1, "evl_group") }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL_ITEM", select: true }
            ],
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_ext1", value: v_global.logic.ext1 }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_EVL_ITEM" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        //url: "COM",
        target: [
            { type: "GRID", id: "grdData_EVL" },
            { type: "GRID", id: "grdData_EVL_ITEM" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    if (gw_com_module.objValidate(args) == false) return false;
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_EVL_ITEM", key: [{ row: "selected", element: [{ name: "evl_no" }, { name: "item_seq" }] }] }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    var args = { targetid: "grdData_EVL_ITEM", row: "selected", remove: true };
    gw_com_module.gridDelete(args);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_QMS_updateEVL_pstat",
        tran: true,
        input: [
            { name: "evl_no", value: param.evl_no, type: "varchar" },
            { name: "pstat", value: param.pstat, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "varchar" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    var missing = undefined;
    var p = {
        handler: processRetrieve,
        param: {
            key: [{ KEY: [{ NAME: "evl_no", VALUE: param.evl_no }], QUERY: $("#grdData_EVL_data").attr("query") }]
        }
    };
    if (response.VALUE[0] > 0) {
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 600, missing, missing, p);
    }

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

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_EVL" },
            { type: "GRID", id: "grdData_EVL_ITEM" }
        ]
    };
    return gw_com_module.objUpdatable(args);

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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "EVL_1021":
                    case "EVL_9022":
                        {
                            args.ID = param.ID;
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
                    case "EVL_1021":
                    case "EVL_9022":
                        {
                            if (param.data != undefined) 
                            {
                                if (param.data[0] != undefined)
                                    param.data[0].QUERY = $("#grdData_EVL_ITEM_data").attr("query");
                                var args = { object: "grdData_EVL", row: "selected", type: "GRID", key: param.data };
                                processRetrieve(args);
                            }
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//