//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : System Notice Edit
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Declare Page Variables
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

        // Set Page Options
        v_global.logic.PageEditable = true;
        v_global.logic.PageType = "Sub";
        v_global.logic.PageId = "SYS_Notice_Edit";

        // Get Page Parameters
        v_global.logic.nt_tp = gw_com_api.getPageParameter("nt_tp");
        v_global.logic.nt_seq = gw_com_api.getPageParameter("nt_seq");

        prepareUI();

        // set data for DDDW List & call start()
        function prepareUI() {

            //// prepare dialogue.
            //var args = {
            //    type: "PAGE", page: "DLG_UploadFile", title: "Upload Fils", datatype: "NOTICE"  //, open: true
            //    , width: 660, height: 220, locate: ["center", 200]
            //};
            //gw_com_module.dialoguePrepare(args);

            // set DDDW
            var args = {
                request: [
                    {
                        type: "PAGE", name: "dddwNoticeTp", query: "dddw_zcode",
                        param: [{ argument: "arg_hcode", value: "SYS211" }]
                    }
                ], starter: start
            };
            gw_com_module.selectSet(args);
        }

        // Start Process
        function start() {

            gw_job_process.UI();    // Create UI Controls
            gw_job_process.procedure(); // Declare Events
            gw_com_module.startPage();  // resizeFrame & Set focus

            // 입력 Mode별 처리
            if (v_global.logic.nt_seq != "") {
                processRetrieve({ key: v_global.logic.nt_seq });
            }
            else {
                // 신규 추가
                var args = {
                    targetid: "frmData_MainA", edit: true, updatable: true,
                    data: [
                        { name: "fr_date", value: gw_com_api.getDate() },
                        { name: "nt_usr", value: gw_com_module.v_Session.USR_NM },
                        { name: "nt_tp", value: v_global.logic.nt_tp },
                        { name: "nt_target", value: "%" },  //%
                        { name: "nt_target_nm", value: "전체" }   //전체
                    ]
                };
                gw_com_module.formInsert(args);
                var args = {
                    targetid: "frmData_MemoA", updatable: true,
                    data: [
                        { name: "memo_tp", value: "HTML" }
                    ]
                };
                gw_com_module.formInsert(args);
            }
        }

    },

    // manage UI. (design section)
    UI: function () {

        createButtons();
        createDataAreas();

        function createButtons() {

            // Create Buttons : Top 
            var args = {
                targetid: "lyrMenu_Top", type: "FREE",
                element: [
                    { name: "Save", value: "저장" },
                    { name: "Close", value: "닫기" }
                ]
            };
            gw_com_module.buttonMenu(args);

            // Create Buttons : File
            var args = {
                targetid: "lyrMenu_FileA", type: "FREE",
                element: [
                    { name: "AddNew", value: "추가" },
                    { name: "Delete", value: "삭제" }
                ]
            };
            gw_com_module.buttonMenu(args);

        }

        function createDataAreas() {

        // Data Box : Main
        var args = {
            targetid: "frmData_MainA", query: "SYS_Notice_Edit", type: "TABLE", title: "공지 등록",
            show: true, selectable: true,
            editable: { bind: "select", focus: "to_date", validate: true },
            content: {
                width: { label: 100, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "공지구분", format: { type: "label" } },
                            {
                                name: "nt_tp",
                                editable: { type: "select", data: { memory: "dddwNoticeTp" }, validate: { rule: "required", message: "구분" } }
                            },
                            { header: true, value: "공지일자", format: { type: "label" } },
                            {
                                name: "fr_date", mask: "date-ymd",
                                editable: { type: "text", validate: { rule: "required", message: "공지일자" }, width: 100 }
                            },
                            { header: true, value: "만료일자", format: { type: "label" } },
                            { name: "to_date", mask: "date-ymd", editable: { type: "text", width: 100 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "nt_title", style: { colspan: 3 }, format: { width: 620 },
                                editable: { type: "text", width: 620, validate: { rule: "required", message: "제목" }, maxlength: 80 }
                            },
                            { header: true, value: "상태", format: { type: "label" } },
                            { name: "pstat", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "공지대상", format: { type: "label" } },
                            {
                                name: "nt_target_nm", style: { colspan: 3 }, mask: "search",
                                format: { width: 620 },
                                editable: { type: "text", width: 620, validate: { rule: "required", message: "공지대상" } }
                            },
                            { name: "nt_target", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr_nm", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "비고", format: { type: "label" } },
                            {
                                name: "nt_rmk", style: { colspan: 3 },
                                format: { type: "textarea", rows: 2 },
                                editable: { type: "textarea", rows: 2, maxlength: 200 }
                            },
                            { name: "nt_usr", hidden: true, editable: { type: "hidden" } },
                            { name: "nt_seq", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        // Data Box : Attach File
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일",
            caption: true, height: "100%", pager: false, number: true, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "_download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 450, align: "left", editable: { type: "text" } },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                //{ name: "data_subkey", hidden: true },
                //{ name: "data_subseq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);


        // Data Box : Memo
        var args = {
            targetid: "frmData_MemoA", query: "SYS_Notice_Memo", type: "TABLE", title: "공지내용",
            caption: true, show: true, fixed: true, selectable: true, editable: { bind: "select", validate: true },
            content: {
                row: [{
                    element: [
                        { name: "memo_html", format: { type: "html", height: 500 } },
                        { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_tp", hidden: true, editable: { type: "hidden" } },
                        { name: "nt_seq", hidden: true, editable: { type: "hidden" } }
                    ]
                }
                ]
            }
        };
        gw_com_module.formCreate(args);

        // Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        }

        // Resize Data Box
        var args = {
            target: [
                { type: "FORM", id: "frmData_MainA", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 },
                { type: "FORM", id: "frmData_MemoA", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

    },

    // Declare Events
    procedure: function () {

        // Event : Top Menu Buttons
        var args = { targetid: "lyrMenu_Top", element: "Save", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Close", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        // Event : Data Box
        var args = { targetid: "frmData_MainA", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoA", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        // Event : File Button,  Box
        var args = { targetid: "lyrMenu_FileA", element: "AddNew", event: "click", handler: processFileUpload };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_FileA", element: "Delete", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_FileA", grid: true, element: "_download", event: "click", handler: processFileDownload };
        gw_com_module.eventBind(args);

    }

};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// common function. (for File Retrieve, Upload, Download)
// ref : grdData_FileA, row click event, processRetrieveComplete, msg_openedDialogue, msg_closeDialogue
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processFileList(param) {
    // called by processRetrieveComplete
    
    var dataType = (param.data_tp == undefined) ? "NOTICE" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? "%" : param.data_key) },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? -1 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? -1 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processFileUpload(param) {
    //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
    //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

    // Check Updatable
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // set data for "File Upload"
    var dataType = "NOTICE";    // Set File Data Type
    var dataKey = gw_com_api.getValue("frmData_MainA", "selected", "nt_seq");   // Main Key value for Search
    var dataSeq = gw_com_api.getValue("frmData_MainA", "selected", "nt_seq");   // Main Seq value for Search

    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq }; // additional data = { data_subkey: "", data_subseq:-1 }

    // set Argument for Dialogue
    var pageArgs = dataType + ":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 660, height: 350, scroll: true,  // multi( h:350, scroll) / single(h:300)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);

}
//----------
function processFileDownload(param) {
    // called by row click event - param : object, row
    var args = { targetid: "lyrDown", source: { id: param.object, row: param.row } };
    gw_com_module.downloadFile(args);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// common function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processDelete(param) {
    if (!checkManipulate({})) return;

    if (param.object == "lyrMenu_FileA") {
        var args = { targetid: "grdData_FileA", row: "selected" }
        gw_com_module.gridDelete(args);
    }
}
//----------
function checkManipulate(param) {
    closeOption({});
    if (gw_com_api.getCRUD("frmData_MainA") == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;
}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {
    gw_com_api.messageBox([{ text: "REMOVE" }]
        , 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
}
//----------
function processClose(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;

    processClear({});


}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function closeOption(param) {
    gw_com_api.hide("frmOption");
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processItemdblclick(param) {

    if (param.element == "nt_target_nm") {

        v_global.event.element = param.element;
        v_global.event.object = param.object;
        v_global.event.row = param.row;
        v_global.event.type = param.type;
        v_global.event.code = "nt_target";
        v_global.event.name = param.element;
        v_global.event.data = {
            user_id: gw_com_api.getValue(param.object, param.row, "nt_target")
        };
        var args = {
            type: "PAGE", page: "SYS_Notice_Target", title: "공지대상 선택",
            width: 800, height: 500, open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "SYS_Notice_Target",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
        return true;
    }

    if (!checkManipulate({})) return;
    if (param.object == "frmData_MemoA") {
        param.element = "memo_html";   // for Edge by JJJ at 2021.04.06
        processMemoEdit({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });
    }
}
//----------
function processMemoEdit(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            page: "DLG_HtmlEditor",
            option: "width=900,height=600,left=300,resizable=1",
            data: {
                title: "Notice Contents Editor",
                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
            }
        };
        gw_com_api.openWindow(args);
    }
}
//----------
function processRetrieve(param) {

    if (param.sub == undefined) { // Main Data Box
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_nt_seq", value: param.key }
                ]
            },
            target: [{ type: "FORM", id: "frmData_MainA" }]
            //, handler_complete: processRetrieveComplete
            , handler: { complete: processRetrieveComplete, param: { key: param.key, sub: true } } // for sub data box
        };
        gw_com_module.objRetrieve(args);
    }
    else { // Sub Data Box
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_nt_seq", value: param.key }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MemoA" }
            ]
        };
        gw_com_module.objRetrieve(args);
    }

}
//----------
function processRetrieveComplete(param) {
    // Sub Data Box
    processRetrieve(param);
    // File List
    processFileList({ data_key: param.key });
}
//----------
function processSave() {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

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
function successSave(response, param) {

    if (gw_com_api.getCRUD("frmData_MainA") == "create") {
        var run = true;
        $.each(response, function () {
            $.each(this.KEY, function () {
                if (this.NAME == "nt_seq") {
                    processRetrieve({ key: this.VALUE });
                    run = false;
                }
                return run;
            });
            return run;
        });
    } else {
        processRetrieve({ key: gw_com_api.getValue("frmData_MainA", 1, "nt_seq") });
    }

    // Refresh List Page : used only when this is tabPage
    var args = {
        ID: gw_com_api.v_Stream.msg_refreshPage
        , findKey: gw_com_api.getValue("frmData_MainA", "selected", "nt_seq")
        //, to: { type: "POPUP", page: "SYS_Notice_List" }  //to가 없으면 CHILD page의 경우 parent의 if 를 호출함
    };
    gw_com_module.streamInterface(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    if (param.ID == gw_com_api.v_Stream.msg_showMessage) {
        gw_com_module.streamInterface(param);
    }
    else if (param.ID == gw_com_api.v_Stream.msg_resultMessage) {
        if (param.data.page != gw_com_api.getPageID()) {
            param.to = { type: "POPUP", page: param.data.page };
            gw_com_module.streamInterface(param);
        }
        else if (param.data.ID == gw_com_api.v_Message.msg_confirmSave) {
            if (param.data.result == "YES") processSave({});
            else if (v_global.process.handler != null) v_global.process.handler({});
        }
        else if (param.data.ID == gw_com_api.v_Message.msg_confirmSave) {
            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
        }
    }
    else if (param.ID == gw_com_api.v_Stream.msg_openedDialogue) {
        var args = { to: { type: "POPUP", page: param.from.page } };
        if (param.from.page == "SYS_Notice_Target" || param.from.page == "SYS_FileUpload") {
            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
            args.data = v_global.event.data;
        }
        else {
            if (param.from.type == "CHILD") {
                v_global.process.init = true;

                if (param.data == undefined) processClose({});
                if (param.data.nt_seq == undefined) {
                    var args = {
                        targetid: "frmData_MainA", edit: true, updatable: true,
                        data: [
                            { name: "nt_tp", value: param.data.nt_tp },
                            { name: "fr_date", value: gw_com_api.getDate() },
                            { name: "nt_usr", value: gw_com_module.v_Session.USR_NM },
                            { name: "nt_target_nm", value: "전체" },
                            { name: "nt_target", value: "%" }
                        ]
                    };
                    gw_com_module.formInsert(args);
                    var args = {
                        targetid: "frmData_MemoA", updatable: true,
                        data: [
                            { name: "memo_tp", value: "HTML" }
                        ]
                    };
                    gw_com_module.formInsert(args);
                }
                else {
                    processRetrieve({ key: param.data.nt_seq });
                }
            }
        }
        gw_com_module.streamInterface(args);
    }
    else if (param.ID == gw_com_api.v_Stream.msg_closeDialogue) {
        if (param.from != undefined && param.from.page != undefined)
            closeDialogue({ page: param.from.page });

        // File Upload
        if (param.from.page == "SYS_FileUpload") {
            processFileList({ data_key: gw_com_api.getValue("frmData_MainA", 1, "nt_seq") });
            return;
        }
        // HTML Editor
        if (param.from.page == "DLG_HtmlEditor") {
            if (param.data.update) {
                // HTML 을 data column 에 복사. (html & text 두 개 컬럼에 저장해야함)
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "memo_text", param.data.html);
                gw_com_api.setUpdatable(v_global.event.object);
            }
            return;
        }
        // Select SUPP
        if (param.from.page == "SYS_Notice_Target") {
            if (param.data != undefined) {
                if (param.data.all) {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, "%", (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, "전체", (v_global.event.type == "GRID"));
                } else {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, param.data.user_id.join(","), (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, param.data.user_nm.join(", "), (v_global.event.type == "GRID"));
                }
            }
            return;
        }
    }

}   // streamProcess
