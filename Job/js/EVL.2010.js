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

        // prepare dialogue.
        //----------
        var args = { type: "PAGE", page: "EVL_2021", title: "평가결과 엑셀 업로드", width: 700, height: 200 };
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
            v_global.logic.evl_seq = 0;     // 자기평가
            v_global.logic.page = 1;        // 현재 페이지
            v_global.logic.rowsperpage = 5;  // 페이지당문항수
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
                { name: "받기", value: "엑셀내려받기", icon: "엑셀", updatable: true },
                { name: "올리기", value: "엑셀가져오기", icon: "엑셀", updatable: true },
                { name: "제출", value: "제출", icon: "예", updatable: true },
                { name: "취소", value: "제출취소", icon: "아니오", updatable: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_EVL_RESULT", type: "IMG",
            element: [
                { name: "이전", value: "이전", icon: "Prev" },
                { name: "다음", value: "다음", icon: "Next" }
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
            targetid: "grdData_EVL_RESULT", query: "EVL_2010_1", title: "평가결과",
            height: 500, show: true, caption: false, selectable: true, number: true, key: true, pager: false,
            editable: { master: true, bind: "edit_yn", validate: true },
            element: [
                { header: "대분류", name: "item_cat1", width: 90 },
                { header: "중분류", name: "item_cat2", width: 90 },
                { header: "소분류", name: "item_cat3", width: 90 },
                { header: "평가문항", name: "item_nm", width: 450 },
                { header: "배점", name: "evl_item_point", width: 60, mask: "numeric-float1", align: "right" },
                {
                    header: "평가점수", name: "item_point", width: 60, mask: "numeric-float1", align: "right",
                    editable: { type: "text" }
                },
                { header: "설명", name: "item_desc", width: 450 },
                {
                    header: "평가내용", name: "rmk", width: 450,
                    editable: { type: "textarea", rows: 5, maxlength: 100 }
                },
                { name: "evl_no", hidden: true, editable: { type: "hidden" } },
                { name: "evl_seq", hidden: true, editable: { type: "hidden" } },
                { name: "user_id", hidden: true, editable: { type: "hidden" } },
                { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                { name: "edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //$("#grdData_EVL_RESULT_data").parents('div.ui-jqgrid-bdiv').css("min-height", "400px");
        //=====================================================================================
        var args = {
            targetid: "frmData_EVL_RESULT_SUM", query: "EVL_2010_2", type: "TABLE", title: "진행현황",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 110, field: 120 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "평가기간", format: { type: "label" } },
                            { name: "evl_term", width: 200, format: { width: 200 } },
                            { header: true, value: "문항수", format: { type: "label" } },
                            { name: "item_cnt", mask: "numeric-int" },
                            //{ header: true, value: "작성", format: { type: "label" } },
                            //{ name: "complete_cnt", mask: "numeric-int" },
                            { header: true, value: "미작성", format: { type: "label" } },
                            { name: "incomplete_cnt", mask: "numeric-int" },
                            { header: true, value: "페이지", format: { type: "label" } },
                            { name: "pagenum" },
                            { name: "total_page", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmData_EVL_RESULT_SUM_evl_term").css("font-weight", "bold");
        $("#frmData_EVL_RESULT_SUM_evl_term_view").css("font-weight", "bold");
        $("#frmData_EVL_RESULT_SUM_incomplete_cnt").css("color", "red");
        $("#frmData_EVL_RESULT_SUM_incomplete_cnt_view").css("color", "red");
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_EVL_RESULT", offset: 8 },
                { type: "FORM", id: "frmData_EVL_RESULT_SUM", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "받기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "올리기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "제출", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_RESULT", element: "이전", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_RESULT", element: "다음", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT", grid: true, event: "rowkeyenter", handler: processRowkeyenter };
        gw_com_module.eventBind(args);
        //----------

        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        v_global.logic.page = 1;
                        processRetrieve({});
                    }
                    break;
                case "제출":
                case "취소":
                    {
                        if (gw_com_api.getRowCount("grdData_EVL_RESULT") == 0) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return false;
                        }
                        if (checkUpdatable({})) {
                            processSave({ nomessage: true });
                        }
                        var p = {
                            handler: processBatch,
                            param: {
                                evl_no: gw_com_api.getValue("grdData_EVL_RESULT", "selected", "evl_no", true),
                                evl_seq: gw_com_api.getValue("grdData_EVL_RESULT", "selected", "evl_seq", true),
                                user_id: gw_com_api.getValue("grdData_EVL_RESULT", "selected", "user_id", true),
                                pstat: (param.element == "제출" ? "완료" : "취소")
                            }
                        };
                        if (param.element == "제출")
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
                case "받기":
                    {
                        var evl_no = gw_com_api.getValue("frmOption", 1, "evl_no");
                        if (evl_no == "") {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        var args = {
                            option: [
                                { name: "PRINT", value: "xls" },
                                { name: "PAGE", value: gw_com_module.v_Current.window },
                                { name: "USER", value: gw_com_module.v_Session.USR_ID },
                                { name: "EVL_NO", value: evl_no },
                                { name: "EVL_SEQ", value: v_global.logic.evl_seq },
                                { name: "USER_ID", value: gw_com_module.v_Session.USR_ID }
                            ],
                            target: { type: "FILE", id: "lyrDown", name: "양식" }
                        };
                        gw_com_module.objExport(args);
                    }
                    break;
                case "올리기":
                    {
                        var evl_no = gw_com_api.getValue("frmOption", 1, "evl_no");
                        if (evl_no == "") {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        var args = {
                            evl_no: evl_no,
                            evl_seq: v_global.logic.evl_seq,
                            user_id: gw_com_module.v_Session.USR_ID
                        };
                        if (checkUploadable(args)) {
                            v_global.event.data = args;
                            var args = {
                                page: "EVL_2021",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        } else {
                            gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
                        }
                    }
                    break;
                case "이전":
                    {
                        processPrev({});
                    }
                    break;
                case "다음":
                    {
                        processNext({ page: true });
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
                                gw_com_api.hide("grdData_EVL_RESULT", "item_cat1", true);
                                gw_com_api.hide("grdData_EVL_RESULT", "item_cat2", true);
                                gw_com_api.hide("grdData_EVL_RESULT", "item_cat3", true);
                            } else {
                                gw_com_api.show("grdData_EVL_RESULT", "item_cat1", true);
                                gw_com_api.show("grdData_EVL_RESULT", "item_cat2", true);
                                gw_com_api.show("grdData_EVL_RESULT", "item_cat3", true);
                            }
                        }
                        break;
                }

            } else if (param.object == "grdData_EVL_RESULT") {

                switch (param.element) {
                    case "item_point":
                        {
                            var item_point = Number(gw_com_api.unMask(param.value.current, "numeric-float1"));
                            var evl_item_point = Number(gw_com_api.getValue(param.object, param.row, "evl_item_point", (param.type == "GRID")));
                            if (item_point > evl_item_point) {
                                //gw_com_api.messageBox([{ text: "배점을 초과하였습니다." }]);
                                gw_com_api.showMessage("배점을 초과하였습니다.");
                            } else {
                                processSave({ nomessage: true });
                            }
                        }
                        break;
                    case "rmk":
                        {
                            processSave({ nomessage: true });
                        }
                        break;
                }

            }
            return true;

        }
        //----------
        function processRowkeyenter(param) {

            if (param.object == "grdData_EVL_RESULT") {
                var item_point = Number(gw_com_api.getValue(param.object, param.row, "item_point", (param.type == "GRID")));
                var evl_item_point = Number(gw_com_api.getValue(param.object, param.row, "evl_item_point", (param.type == "GRID")));
                if (item_point <= evl_item_point)
                    processNext(param);
                return false;
            }
        }

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processPrev(param) {

    if (v_global.logic.page == 1) {
        gw_com_api.messageBox([{ text: "처음 페이지 입니다." }]);
    } else {
        v_global.logic.page -= 1;
        processRetrieve({});
    }


}
//----------
function processNext(param) {

    var row = (param.row == undefined ? gw_com_api.getSelectedRow("grdData_EVL_RESULT") : param.row);
    if (row == null) return;
    if (row == v_global.logic.rowsperpage || param.page) {
        if (gw_com_api.getValue("frmData_EVL_RESULT_SUM", 1, "total_page") == v_global.logic.page) {
            gw_com_api.messageBox([{ text: "마지막 페이지 입니다." }]);
        } else {
            v_global.logic.page += 1;
            processRetrieve({});
        }
    } else {
        gw_com_api.selectRow("grdData_EVL_RESULT", Number(row) + 1, true);
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "evl_no", argument: "arg_evl_no" }
            ],
            argument: [
                { name: "arg_evl_seq", value: v_global.logic.evl_seq },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID },
                { name: "arg_page", value: v_global.logic.page },
                { name: "arg_rowsperpage", value: v_global.logic.rowsperpage }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_EVL_RESULT", select: true, focus: true },
            { type: "FORM", id: "frmData_EVL_RESULT_SUM" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        nomessage: (param.nomessage === true),
        target: [
            { type: "GRID", id: "grdData_EVL_RESULT" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    //
    gw_com_api.setCRUD("grdData_EVL_RESULT", "selected", "retrieve", true);

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
        procedure: "sp_QMS_updateEVL_pstat",
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
            { type: "GRID", id: "grdData_EVL_RESULT" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkUploadable(param) {

    var rtn = false;
    var args = {
        request: "DATA",
        name: "EVL_2020_UP_CHK",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EVL_2020_UP_CHK" +
            "&QRY_COLS=chk" +
            "&CRUD=R" +
            "&arg_evl_no=" + param.evl_no +
            "&arg_evl_seq=" + param.evl_seq +
            "&arg_user_id=" + param.user_id,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        rtn = (data.DATA[0] == "1");

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
                    case "EVL_2021":
                        {
                            args.ID = param.ID;
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
                    case "EVL_2021":
                        {
                            if (param.data != undefined) {
                                processRetrieve({});
                            }
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//