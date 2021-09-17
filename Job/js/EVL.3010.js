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
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { type: "PAGE", page: "w_upload_supp", title: "파일 업로드", width: 700, height: 230 };
        gw_com_module.dialoguePrepare(args);
        //----------

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "평가목록", query: "dddw_evl",
                    param: [
                        { argument: "arg_user_id", value: gw_com_module.v_Session.USR_ID },
                        { argument: "arg_ext1", value: "%" }
                    ]
                },
                {
                    type: "PAGE", name: "개선상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "EVL10" }]
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

            //----------
            v_global.logic.evl_seq = 1;     // 담당자평가
            //----------
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
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "새로고침" },
                { name: "개선제출", value: "제출", icon: "예" },
                { name: "개선취소", value: "제출취소", icon: "아니오" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_EVL_RESULT_IMPRV_FILE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "evl_no", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "evl_no", label: { title: "평가명 :" },
                                editable: { type: "select", data: { memory: "평가목록"/*, push: [{ title: "-", value: "" }]*/ } }
                            },
                            {
                                name: "view_option1", label: { title: "분류 감추기 :" },
                                editable: { type: "checkbox", value: "1", offval: "0" }
                            },
                            { name: "조회", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_EVL_RESULT_IMPRV", query: "EVL_3010_1", title: "평가결과",
            height: 400, show: true, caption: false, selectable: true, number: true, pager: false,
            editable: { master: true, bind: "edit_yn", validate: true },
            color: { row: true },
            element: [
                { header: "대분류", name: "item_cat1", width: 90 },
                { header: "중분류", name: "item_cat2", width: 90 },
                { header: "소분류", name: "item_cat3", width: 90 },
                { header: "평가문항", name: "item_nm", width: 450 },
                { header: "설명", name: "item_desc", width: 450, hidden: true },
                { header: "평가내용", name: "rmk", width: 350 },
                {
                    header: "상태", name: "plan_cd", width: 100,
                    format: { type: "select", data: { memory: "개선상태" } },
                    editable: { type: "select", data: { memory: "개선상태", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "개선대책", name: "plan_rmk", width: 350,
                    editable: { type: "text", maxlength: 200 }
                },
                {
                    header: "개선예정일", name: "plan_date", width: 100,
                    editable: { type: "text" }, mask: "date-ymd", align: "center"
                },
                { header: "유효성 결과", name: "result_nm", width: 100 },
                { header: "내용", name: "result_rmk", width: 350 },
                { name: "evl_no", hidden: true, editable: { type: "hidden" } },
                { name: "evl_seq", hidden: true, editable: { type: "hidden" } },
                { name: "user_id", hidden: true, editable: { type: "hidden" } },
                { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                { name: "edit_yn", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //$("#grdData_EVL_RESULT_IMPRV_data").parents('div.ui-jqgrid-bdiv').css("min-height", "400px");
        //=====================================================================================
        var args = {
            targetid: "grdData_EVL_RESULT_IMPRV_FILE", query: "EVL_3010_2", title: "첨부파일",
            height: "100%", show: true, caption: false, selectable: true, number: true, pager: false,
            element: [
                { header: "파일명", name: "file_nm", width: 270 },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { header: "등록자", name: "upd_usr_nm", width: 70 },
                { header: "설명", name: "file_desc", width: 330 },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true },
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
                { type: "GRID", id: "grdData_EVL_RESULT_IMPRV", offset: 8 },
                { type: "GRID", id: "grdData_EVL_RESULT_IMPRV_FILE", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "개선제출", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "개선취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_RESULT_IMPRV_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_RESULT_IMPRV_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT_IMPRV", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT_IMPRV", grid: true, event: "itemkeyenter", handler: processItemkeyenter };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT_IMPRV_FILE", grid: true, element: "download", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        processRetrieve({});
                    }
                    break;
                case "개선제출":
                case "개선취소":
                    {
                        if (gw_com_api.getRowCount("grdData_EVL_RESULT_IMPRV") == 0) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return false;
                        }
                        if (checkUpdatable({})) {
                            processSave({ nomessage: true });
                        }
                        var p = {
                            handler: processBatch,
                            param: {
                                evl_no: gw_com_api.getValue("grdData_EVL_RESULT_IMPRV", 1, "evl_no", true),
                                evl_seq: gw_com_api.getValue("grdData_EVL_RESULT_IMPRV", 1, "evl_seq", true),
                                user_id: gw_com_api.getValue("grdData_EVL_RESULT_IMPRV", 1, "user_id", true),
                                pstat: param.element
                            }
                        };
                        if (param.element == "개선제출")
                            gw_com_api.messageBox([{ text: "제출 완료 후 데이터를 수정할 수 없습니다." }, { text: "계속하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                        else
                            gw_com_api.messageBox([{ text: "제출취소 처리 하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "추가":
                    {
                        if (gw_com_api.getRowCount("grdData_EVL_RESULT_IMPRV") == 0) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        v_global.event.data = {
                            type: "EVL_RESULT_IMPRV",
                            key: gw_com_api.getValue("frmOption", 1, "evl_no"),
                            sub_key: gw_com_module.v_Session.USR_ID,
                            seq: v_global.logic.evl_seq
                        };
                        var args = {
                            page: "w_upload_supp",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "삭제":
                    {
                        if (gw_com_api.getSelectedRow("grdData_EVL_RESULT_IMPRV_FILE") == null) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        var p = {
                            handler: processRemoveFile
                        };
                        gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);
                    }
                    break;
                case "download":
                    {
                        var args = {
                            source: { id: param.object, row: param.row },
                            targetid: "lyrDown"
                        };
                        gw_com_module.downloadFile(args);
                    }
                    break;
            }
            return true;

        }
        //----------
        function processItemchanged(param) {

            if (param.object == "frmOption") {

                switch (param.element) {
                    case "evl_no":
                        {
                            processRetrieve({});
                        }
                        break;
                    case "view_option1":
                        {
                            if (param.value.current == "1") {
                                gw_com_api.hide("grdData_EVL_RESULT_IMPRV", "item_cat1", true);
                                gw_com_api.hide("grdData_EVL_RESULT_IMPRV", "item_cat2", true);
                                gw_com_api.hide("grdData_EVL_RESULT_IMPRV", "item_cat3", true);
                            } else {
                                gw_com_api.show("grdData_EVL_RESULT_IMPRV", "item_cat1", true);
                                gw_com_api.show("grdData_EVL_RESULT_IMPRV", "item_cat2", true);
                                gw_com_api.show("grdData_EVL_RESULT_IMPRV", "item_cat3", true);
                            }
                        }
                        break;
                }

            } else if (param.object == "grdData_EVL_RESULT_IMPRV") {

                var row = [
                    {
                        crud: "U",
                        column: [
                            { name: "evl_no", value: gw_com_api.getValue(param.object, param.row, "evl_no", (param.type == "GRID")) },
                            { name: "evl_seq", value: gw_com_api.getValue(param.object, param.row, "evl_seq", (param.type == "GRID")) },
                            { name: "user_id", value: gw_com_api.getValue(param.object, param.row, "user_id", (param.type == "GRID")) },
                            { name: "item_seq", value: gw_com_api.getValue(param.object, param.row, "item_seq", (param.type == "GRID")) },
                            { name: param.element, value: gw_com_api.unMask(param.value.current, gw_com_module.v_Object[param.object].option[param.element].mask) },
                            { name: "plan_usr", value: gw_com_module.v_Session.USR_ID },
                            { name: "plan_dt", value: "SYSDT" }
                        ]
                    }
                ];
                var data = {
                    query: $("#" + param.object + "_data").attr("query"),
                    row: row
                };
                var args = {
                    url: "COM",
                    nomessage: true,
                    param: [data]
                };
                gw_com_module.objSave(args);

            }
            return true;

        }
        //----------
        function processItemkeyenter(param) {

            if (param.object == "grdData_EVL_RESULT_IMPRV") {
                switch (param.element) {
                    case "plan_cd":
                    case "plan_rmk":
                        {
                            var idx = gw_com_api.getColNumber(param.object, param.element);
                            var col = gw_com_api.getColName(param.object, idx + 1);
                            gw_com_api.setFocus(param.object, param.row, col, (param.type == "GRID"));
                        }
                    default:
                        {
                            gw_com_api.selectRow("grdData_EVL_RESULT_IMPRV", Number(param.row) + 1, true);
                        }
                        break;
                }
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

    var args;
    if (param.file) {

        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "evl_no", argument: "arg_evl_no" }
                ],
                argument: [
                    { name: "arg_evl_seq", value: v_global.logic.evl_seq },
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL_RESULT_IMPRV_FILE", select: true }
            ],
            key: param.key
        };

    } else {

        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "evl_no", argument: "arg_evl_no" }
                ],
                argument: [
                    { name: "arg_evl_seq", value: v_global.logic.evl_seq },
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL_RESULT_IMPRV", select: true, focus: true },
                { type: "GRID", id: "grdData_EVL_RESULT_IMPRV_FILE", select: true }
            ],
            key: param.key
        };

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    //var args = {
    //    url: "COM",
    //    nomessage: (param.nomessage === true),
    //    target: [
    //        { type: "GRID", id: "grdData_EVL_RESULT_IMPRV" }
    //    ]
    //};
    //if (gw_com_module.objValidate(args) == false) return false;

    //args.handler = {
    //    success: successSave,
    //    param: param
    //};
    //gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    //
    gw_com_api.setCRUD("grdData_EVL_RESULT_IMPRV", "selected", "retrieve", true);

    if (param.handler != undefined) {
        if (param.param == undefined)
            param.handler();
        else
            param.handler(param.param);
    }

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_QMS_updateEVLRI_pstat",
        tran: true,
        input: [
            { name: "evl_no", value: param.evl_no, type: "varchar" },
            { name: "evl_seq", value: param.evl_seq, type: "int" },
            { name: "user_id", value: param.user_id, type: "varchar" },
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

    if (response.VALUE[0] > 0) {
        var missing = undefined;
        var p = {
            handler: processRetrieve,
            param: {}
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 600);
    }

}
//----------
function processRemoveFile(param) {

    var args = {
        url: "COM",
        nomessage: true,
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: "DLG_FILE_ZFILE",
                row: [{
                    crud: "U",
                    column: [
                        { name: "file_id", value: gw_com_api.getValue("grdData_EVL_RESULT_IMPRV_FILE", "selected", "file_id", true) },
                        { name: "use_yn", value: "0" }
                    ]
                }]
            }
        ],
        handler: {
            success: successRemoveFile
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successRemoveFile(param) {

    var p = {
        handler: processRetrieve,
        param: { file: true }
    };
    gw_com_api.messageBox([{ text: "SUCCESS" }], 420, undefined, undefined, p);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
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

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_EVL_RESULT_IMPRV" }
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
                    case "w_upload_supp":
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
                switch (param.from.page) {
                    case "w_upload_supp":
                        {
                            if (param.data != undefined) {

                                processRetrieve({ file: true });

                            }
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//