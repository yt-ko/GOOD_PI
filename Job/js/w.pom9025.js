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
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        start();

        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            // 입력 Mode별 처리
            v_global.logic.nt_seq = gw_com_api.getPageParameter("nt_seq");
            if (v_global.logic.nt_seq != "") {
                processRetrieve({ key: v_global.logic.nt_seq });
            }
            else {
                // 신규 추가
                var args = {
                    targetid: "frmData_공지등록", edit: true, updatable: true,
                    data: [
                        { name: "fr_date", value: gw_com_api.getDate() },
                        { name: "nt_usr", value: gw_com_module.v_Session.USR_NM },
                        { name: "nt_target", value: "전체" }
                    ]
                };
                gw_com_module.formInsert(args);
                var args = {
                    targetid: "frmData_Memo", updatable: true,
                    data: [
                        { name: "memo_tp", value: "HTML" }
                    ]
                };
                gw_com_module.formInsert(args);
            }
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_첨부파일", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_공지등록", query: "w_pom9025_M_1", type: "TABLE", title: "공지 등록",
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
                                editable: { type: "select", data: { memory: "dddwNoticeTp" },
                                    validate: { rule: "required", message: "구분" } }
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
                                name: "nt_title", style: { colspan: 3 }, format: { width: 660 },
                                editable: { type: "text", width: 960, validate: { rule: "required", message: "제목" }, maxlength: 80 }
                            },
                            { header: true, value: "상태", format: { type: "label" } },
                            { name: "pstat", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "공지대상", format: { type: "label" } },
                            {
                                name: "nt_target_nm", style: { colspan: 3 },
                                format: { width: 960 }, mask: "search",
                                editable: { type: "text", width: 658, validate: { rule: "required", message: "공지대상" } }
                            },
                            { name: "nt_target", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr", editable: { type: "hidden" } }
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
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부파일", query: "w_sys2030_S_1", title: "첨부 파일",
            caption: true, height: 45, pager: false, number: true, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                {
                    header: "다운로드", name: "_download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 450, align: "left",
                    editable: { type: "text" }
                },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Memo", query: "w_sys2030_S_2", type: "TABLE", title: "공지내용",
            caption: true, show: true, fixed: true, selectable: true, editable: { bind: "select", validate: true },
            content: {
                row: [ {
                    element: [
                        { name: "memo_html", format: { type: "html", height: 500 } },
                        { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_tp", hidden: true, editable: { type: "hidden" } },
                        { name: "nt_seq", hidden: true, editable: { type: "hidden" } }
                   ] }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_공지등록", offset: 8 },
                { type: "GRID", id: "grdData_첨부파일", offset: 8 },
                { type: "FORM", id: "frmData_Memo", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_공지등록", event: "itemdblclick", handler: itemdblclick_frmData_공지등록 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_Memo", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_첨부파일", element: "추가", event: "click", handler: click_lyrMenu_첨부파일_추가 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_첨부파일", element: "삭제", event: "click", handler: click_lyrMenu_첨부파일_삭제 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_첨부파일", grid: true, element: "_download", event: "click", handler: click_grdData_첨부파일_download };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function itemdblclick_frmData_공지등록(param) {

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
                    type: "PAGE", page: "w_pom9025_SUPP", title: "공지대상 선택",
                    width: 800, height: 500, open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_pom9025_SUPP",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }

            }

        }
        //----------
        function click_lyrMenu_팝업(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            v_global.event.data = {
                nt_seq: gw_com_api.getValue("frmData_공지등록", "selected", "nt_seq")
            };
            var args = {
                type: "PAGE", page: "DLG_NOTICE", title: "파일 업로드", width: 900, height: 750, open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_NOTICE",
                    param: {
                        ID: gw_com_api.v_Stream.msg_myNotice,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

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
        function click_lyrMenu_첨부파일_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE", page: "w_upload_notice", title: "파일 업로드", width: 650, height: 180,
                locate: ["center", 180], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_notice",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_NOTICE,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: "",
                            seq: gw_com_api.getValue("frmData_공지등록", "selected", "nt_seq")
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_첨부파일_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_첨부파일", row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_grdData_첨부파일_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부파일",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processItemdblclick(param) {

    if (!checkManipulate({})) return;
    param.element = "memo_html";
    processMemo({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            page: "DLG_EDIT_HTML",
            option: "width=600,height=500,left=300,resizable=1",
            data: {
                title: "상세 내용", imgPath: "~/Files/DxHtmlEditor/SysNotice",
                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
            }
        };
        gw_com_api.openWindow(args);
    }

}

//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_공지등록");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_공지등록" },
            { type: "GRID", id: "grdData_첨부파일" },
            { type: "FORM", id: "frmData_Memo" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_nt_seq", value: param.key },
            ]
        },
        target: [
            { type: "FORM", id: "frmData_공지등록" },
            { type: "GRID", id: "grdData_첨부파일" },
            { type: "FORM", id: "frmData_Memo" }
        ],
        handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    // Memo 추가 -> Master 추가 처리 시 동시 처리로 변경
    //var args = {
    //    targetid: "frmData_Memo",
    //    data: [
    //        { name: "nt_seq", value: gw_com_api.getValue("frmData_공지등록", 1, "nt_seq"), change: false },
    //        { name: "memo_tp", value: "HTML", change: false },
    //        { name: "memo_text", value: gw_com_api.getValue("frmData_공지등록", 1, "memo_text"), change: false }
    //    ]
    //};
    //gw_com_module.formInsert(args);
    //gw_com_api.setCRUD("frmData_Memo", 1, "modify");

}
//----------
function processSave() {

    var args = {
        target: [
            { type: "FORM", id: "frmData_공지등록" },
            { type: "GRID", id: "grdData_첨부파일" },
            { type: "FORM", id: "frmData_Memo" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    //var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param.data != undefined) args.data = param.data;
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_공지등록" },
            { type: "GRID", id: "grdData_첨부파일" },
            { type: "FORM", id: "frmData_Memo" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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

    if (checkCRUD({}) == "create") {
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
        processRetrieve({ key: gw_com_api.getValue("frmData_공지등록", 1, "nt_seq") });
    }

    //processClose({ data: { nt_seq: gw_com_api.getValue("frmData_공지등록", 1, "nt_seq") } });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    // HTML 을 data column 에 복사. (html & text 두 개 컬럼에 저장해야함)
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "memo_text", param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "w_upload_notice":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_NOTICE;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: "",
                                seq: gw_com_api.getValue("frmData_공지등록", 1, "nt_seq")
                            };
                        }
                        break;
                    case "DLG_NOTICE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_myNotice;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "w_pom9025_SUPP":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                    default:
                        {
                            if (param.from.type == "CHILD") {
                                v_global.process.init = true;

                                if (param.data == undefined) processClose({});
                                if (param.data.nt_seq == undefined) {
                                    var args = {
                                        targetid: "frmData_공지등록", edit: true, updatable: true,
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
                                        targetid: "frmData_Memo", updatable: true,
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
                }
                gw_com_module.streamInterface(args);
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
                            else if (v_global.process.handler != null)
                                v_global.process.handler({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_NOTICE:
            {
                var args = {
                    source: {
                        type: "FORM", id: "frmData_공지등록",
                        element: [
                            { name: "nt_seq", argument: "arg_nt_seq" }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_첨부파일", select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                switch (param.from.page) {
                    case "w_upload_notice":
                        {
                            var args = {
                                source: {
                                    type: "FORM", id: "frmData_공지등록",
                                    element: [
                                        { name: "nt_seq", argument: "arg_nt_seq" }
                                    ]
                                },
                                target: [
                                    { type: "GRID", id: "grdData_첨부파일", select: true }
                                ],
                                key: param.key
                            };
                            gw_com_module.objRetrieve(args);
                        }
                        break;
                    case "w_pom9025_SUPP":
                        {
                            if (param.data != undefined) {
                                if (param.data.all) {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, "%", (v_global.event.type == "GRID"));
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, "전체", (v_global.event.type == "GRID"));
                                } else {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, param.data.user_id.join(","), (v_global.event.type == "GRID"));
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, param.data.user_nm.join(", "), (v_global.event.type == "GRID"));
                                }
                            }
                        }
                        break;
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//