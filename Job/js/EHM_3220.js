//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
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

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);
        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "IEHM58", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM58" }]
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
            v_global.logic.setup_no = gw_com_api.getPageParameter("setup_no");
            v_global.logic.setup_seq = gw_com_api.getPageParameter("setup_seq");
            if (v_global.logic.setup_seq == "")
                processInsert({});
            else
                processRetrieve({});
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE", show: true,
            element: [
                { name: "공정", value: "작업공정", icon: "기타", updatable: true },
                { name: "작업자", value: "작업자", icon: "기타", updatable: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "통보", value: "통보", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE", show: true,
            element: [
                { name: "조회", value: "새로고침" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SETUP_ISSUE", type: "FREE", show: true,
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE", show: true,
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_INFO", query: "EHM_3220_0", type: "TABLE", title: "SETUP 장비",
            show: true, selectable: true,
            content: {
                width: { label: 100, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "고객사", format: { type: "label", font: { bold: true } } },
                            { name: "cust_nm" },
                            { header: true, value: "LINE", format: { type: "label", font: { bold: true } } },
                            { name: "cust_dept_nm", },
                            { header: true, value: "고객설비명", format: { type: "label", font: { bold: true } } },
                            { name: "cust_prod_nm" },
                            { header: true, value: "Project No.", format: { type: "label", font: { bold: true } } },
                            { name: "proj_no" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SETUP_D", query: "EHM_3220_1", type: "TABLE", title: "SETUP 보고서",
            show: true, selectable: true, caption: true,
            editable: { bind: "select", focus: "setup_date", validate: true },
            content: {
                width: { label: 100, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "작업일", format: { type: "label" } },
                            {
                                name: "setup_date", mask: "date-ymd",
                                format: { type: "text" },
                                editable: { type: "text", validate: { rule: "required", message: "작업일" } }
                            },
                            { header: true, value: "작업시간", format: { type: "label" } },
                            {
                                name: "start_time", mask: "time-hm", style: { colfloat: "float" },
                                format: { width: 30 },
                                editable: { type: "text", width: 50, validate: { rule: "required", message: "시작시각" } }
                            },
                            { value: "~", format: { type: "label" }, style: { colfloat: "floating" } },
                            {
                                name: "end_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { width: 30 },
                                editable: { type: "text", width: 50, validate: { rule: "required", message: "종료시각" } }
                            },
                            { header: true, value: "작성자", format: { type: "label" } },
                            {
                                name: "setup_user_nm", display: true,
                                editable: v_global.logic.Supp ? { type: "text", validate: { rule: "required", message: "작성자" } } : { type: "hidden" }
                            },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "ins_dt", editable: { type: "hidden" }, display: true },
                            { name: "setup_user", editable: { type: "hidden" }, hidden: true },
                            { name: "setup_user_tp", editable: { type: "hidden" }, hidden: true },
                            { name: "setup_dept", editable: { type: "hidden" }, hidden: true },
                            { name: "close_yn", editable: { type: "hidden" }, hidden: true },
                            { name: "setup_no", editable: { type: "hidden" }, hidden: true },
                            { name: "setup_seq", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "작업공정", format: { type: "label" } },
                            {
                                name: "setup_procs_nm", style: { colspan: 3 },
                                format: { type: "textarea", rows: 4 }
                            },
                            { name: "setup_procs", editable: { type: "hidden" }, hidden: true, display: true },
                            { header: true, value: "문제점<br/>특이사항", format: { type: "label" } },
                            {
                                name: "rmk1", style: { colspan: 3 },
                                format: { type: "textarea", rows: 4 },
                                editable: { type: "textarea", rows: 4, maxlength: 2000 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "작업자", format: { type: "label" } },
                            {
                                name: "setup_users_nm", style: { colspan: 3 },
                                format: { type: "textarea", rows: 4 }
                            },
                            { name: "setup_users", editable: { type: "hidden" }, hidden: true, display: true },
                            { header: true, value: "금일<br/>진행상황", format: { type: "label" } },
                            {
                                name: "rmk2", style: { colspan: 3 },
                                format: { type: "textarea", rows: 4 },
                                editable: { type: "textarea", rows: 4, maxlength: 2000 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "rmk", style: { colspan: 3 },
                                format: { type: "textarea", rows: 4 },
                                editable: { type: "textarea", rows: 4, maxlength: 500 }
                            },
                            { header: true, value: "명일<br/>예정사항", format: { type: "label" } },
                            {
                                name: "rmk3", style: { colspan: 3 },
                                format: { type: "textarea", rows: 4 },
                                editable: { type: "textarea", rows: 4, maxlength: 2000 }
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
            targetid: "grdData_SETUP_ISSUE", query: "EHM_3220_2", title: "SETUP ISSUE",
            height: 103, caption: true, pager: true, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "발생일", name: "issue_date", width: 100, mask: "date-ymd", align: "center",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                { header: "부서", name: "issue_dept_nm", width: 160 },
                { header: "작업자", name: "issue_user_nm", width: 100 },
                { header: "인증등급", name: "cert_level_nm", width: 70, align: "center" },
                {
                    header: "구분", name: "issue_tp", width: 130, align: "center",
                    format: { type: "select", data: { memory: "IEHM58" } },
                    editable: { type: "select", data: { memory: "IEHM58" }, validate: { rule: "required" } }
                },
                { name: "setup_no", editable: { type: "hidden" }, hidden: true },
                { name: "setup_seq", editable: { type: "hidden" }, hidden: true },
                { name: "issue_seq", editable: { type: "hidden" }, hidden: true },
                { name: "user_seq", editable: { type: "hidden" }, hidden: true },
                { name: "rmk", editable: { type: "textarea", rows: 1 }, hidden: true },
                { name: "rmkm", editable: { type: "textarea", rows: 1 }, hidden: true, display: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SETUP_ISSUE_RMK", query: "EHM_3220_2", type: "TABLE", title: "ISSUE 내용",
            show: true, caption: true, selectable: true,
            editable: { bind: "select", focus: "rmk", validate: true },
            content: {
                width: { label: 100, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            {
                                name: "rmk", style: { colspan: 3 },
                                format: { type: "textarea", rows: 10 },
                                editable: { type: "textarea", rows: 10, maxlength: 2000 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        // 2021-05-18 by KYT
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                //{ header: "부서", name: "setup_dept_nm", width: 150 },
                //{ header: "작성자", name: "setup_user_nm", width: 80 },
                //{ header: "보고일", name: "setup_date", width: 100, align: "center", mask: "date-ymd" },
                //{ header: "파일명", name: "file_nm", width: 250 },
                //{
                //    header: "다운로드", name: "download", width: 80, align: "center",
                //    format: { type: "link", value: "다운로드" }
                //},
                //{
                //    header: "파일설명", name: "file_desc", width: 436,
                //    editable: { type: "text" }
                //},
                //{ name: "file_ext", hidden: true },
                //{ name: "file_path", hidden: true },
                //{ name: "network_cd", hidden: true },
                //{ name: "data_tp", hidden: true },
                //{ name: "data_key", hidden: true },
                //{ name: "data_seq", hidden: true },
                //{ name: "file_id", hidden: true, editable: { type: "hidden" } }
                { header: "부서", name: "file_group1", width: 150 },
                { header: "작성자", name: "ins_usr_nm", width: 80 },
                { header: "보고일", name: "ins_dt", width: 100, align: "center", mask: "date-ymd" },
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
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
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_INFO", offset: 8 },
                { type: "FORM", id: "frmData_SETUP_D", offset: 8 },
                { type: "GRID", id: "grdData_SETUP_ISSUE", offset: 8 },
                { type: "FORM", id: "frmData_SETUP_ISSUE_RMK", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "통보", event: "click", handler: processSendEmail };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "공정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "작업자", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SETUP_ISSUE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SETUP_ISSUE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SETUP_ISSUE", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_SETUP_D", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_SETUP_ISSUE_RMK", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SETUP_ISSUE", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FileA", grid: true, element: "download", event: "click", handler: processFileDownload };
        gw_com_module.eventBind(args);
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
function processButton(param) {

    switch (param.element) {
        case "조회":
            {
                v_global.process.handler = processRetrieve;
                if (!checkUpdatable({})) return false;
                processRetrieve({});
            }
            break;
        case "추가":
            {
                if (param.object == "lyrMenu") {
                    if (!checkUpdatable({ check: true })) return false;
                    processInsert({});
                } else if (param.object == "lyrMenu_SETUP_ISSUE") {
                    if (checkCRUD({}) == "create") {
                        gw_com_api.messageBox([
                            { text: "데이터가 먼저 저장되어야 합니다." },
                            { text: "저장하신 후에 실행해 주세요." }
                        ]);
                        return false;
                    }
                    v_global.event.data = {
                        setup_no: v_global.logic.setup_no,
                        setup_seq: v_global.logic.setup_seq
                    };
                    var args = {
                        type: "PAGE", page: "EHM_3223", title: "SETUP 작업자 선택",
                        width: 500, height: 400, locate: ["center", "center"], open: true,
                    };
                    if (gw_com_module.dialoguePrepare(args) == false) {
                        var args = {
                            page: "EHM_3223",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                } else if (param.object == "lyrMenu_FILE") {
                    //2021-05-18 by KYT
                    //if (!checkManipulate({})) return;
                    //if (!checkUpdatable({ check: true })) return false;

                    //v_global.event.data = {
                    //    user: gw_com_module.v_Session.USR_ID,
                    //    key: gw_com_api.getValue("frmData_SETUP_D", 1, "setup_no"),
                    //    seq: gw_com_api.getValue("frmData_SETUP_D", 1, "setup_seq")
                    //};
                    //var args = {
                    //    type: "PAGE", page: "w_upload_assetup", title: "파일 업로드",
                    //    width: 650, height: 200, locate: ["center", "bottom"],
                    //    open: true
                    //};
                    //if (gw_com_module.dialoguePrepare(args) == false) {
                    //    var args = {
                    //        page: "w_upload_assetup",
                    //        param: {
                    //            ID: gw_com_api.v_Stream.msg_upload_ASSETUP,
                    //            data: v_global.event.data
                    //        }
                    //    };
                    //    gw_com_module.dialogueOpen(args);
                    //}

                    //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
                    //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

                    processFileUpload({});


                }
            }
            break;
        case "삭제":
            {
                if (param.object == "lyrMenu") {
                    var status = checkCRUD({});
                    if (status == "initialize" || status == "create")
                        processClear({});
                    else
                        gw_com_api.messageBox([
                            { text: "REMOVE" }
                        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
                } else if (param.object == "lyrMenu_SETUP_ISSUE") {
                    var deletable = true;
                    var crud = gw_com_api.getCRUD("grdData_SETUP_ISSUE", "selected", true);
                    if (crud == "retrieve" || crud == "update") {
                        var args = {
                            request: "DATA",
                            name: "EHM_3220_2_CHK_DEL",
                            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                                "?QRY_ID=EHM_3220_2_CHK_DEL" +
                                "&QRY_COLS=deletable" +
                                "&CRUD=R" +
                                "&arg_setup_no=" + gw_com_api.getValue("grdData_SETUP_ISSUE", "selected", "setup_no", true) +
                                "&arg_setup_seq=" + gw_com_api.getValue("grdData_SETUP_ISSUE", "selected", "setup_seq", true) +
                                "&arg_issue_seq=" + gw_com_api.getValue("grdData_SETUP_ISSUE", "selected", "issue_seq", true) +
                                "&arg_user_id=" + gw_com_module.v_Session.USR_ID,
                            async: false,
                            handler_success: successRequest
                        };
                        gw_com_module.callRequest(args);

                        function successRequest(type, name, data) {

                            if (data.DATA[0] == "0")
                                deletable = false;

                        }
                    }
                    if (deletable) {
                        var args = { targetid: "grdData_SETUP_ISSUE", row: "selected", select: true }
                        gw_com_module.gridDelete(args);
                    } else {
                        gw_com_api.messageBox([{ text: "삭제 권한이 없습니다." }]);
                    }
                } else if (param.object == "lyrMenu_FILE") {
                    var args = { targetid: "grdData_FileA", row: "selected" }
                    gw_com_module.gridDelete(args);
                }
            }
            break;
        case "저장":
            {
                processSave({});
            }
            break;
        case "닫기":
            {
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
            }
            break;
        case "공정":
            {
                if (!checkManipulate({})) return;
                //if (checkCRUD({}) == "create") {
                //    gw_com_api.messageBox([
                //        { text: "데이터가 먼저 저장되어야 합니다." },
                //        { text: "저장하신 후에 실행해 주세요." }
                //    ]);
                //    return false;
                //}
                v_global.event.data = {
                    setup_no: v_global.logic.setup_no,
                    setup_seq: v_global.logic.setup_seq,
                    proc_seq: gw_com_api.getValue("frmData_SETUP_D", 1, "setup_procs")
                };
                var args = {
                    type: "PAGE", page: "EHM_3221", title: "SETUP 공정 선택",
                    width: 600, height: 400, locate: ["center", 100], open: true,
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "EHM_3221",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "작업자":
            {
                if (!checkManipulate({})) return;
                //if (checkCRUD({}) == "create") {
                //    gw_com_api.messageBox([
                //        { text: "데이터가 먼저 저장되어야 합니다." },
                //        { text: "저장하신 후에 실행해 주세요." }
                //    ]);
                //    return false;
                //}
                v_global.event.data = {
                    setup_no: v_global.logic.setup_no,
                    setup_seq: v_global.logic.setup_seq,
                    user_seq: gw_com_api.getValue("frmData_SETUP_D", 1, "setup_users")
                };
                var args = {
                    type: "PAGE", page: "EHM_3222", title: "SETUP 작업자 선택",
                    width: 500, height: 400, locate: ["center", 150], open: true,
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "EHM_3222",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//----------
function processRowselected(param) {

    if (param.object == "grdData_SETUP_ISSUE") {
        var rmk = gw_com_api.getValue(param.object, param.row, "rmkm", true);
        rmk = rmk.replace(/\[crlf\]/g, "\r\n");
        var args = {
            targetid: "frmData_SETUP_ISSUE_RMK", edit: true,
            data: [
                { name: "rmk", value: rmk, change: false }
            ]
        };
        gw_com_module.formInsert(args);

        if (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") {
            gw_com_api.setValue("frmData_SETUP_ISSUE_RMK", 1, "rmk", rmk, false, true);
        }
    }

}
//----------
function processItemchanged(param) {

    switch (param.element) {
        case "setup_user_nm":
            {
                if (v_global.logic.Supp) {
                    gw_com_api.setValue(param.object, param.row, "setup_user", param.value.current);
                }
            }
            break;
        case "rmk":
            {
                if (param.object == "frmData_SETUP_ISSUE_RMK") {
                    gw_com_api.setValue("grdData_SETUP_ISSUE", "selected", "rmk", param.value.current, true);
                    gw_com_api.setValue("grdData_SETUP_ISSUE", "selected", "rmkm", param.value.current, true);
                }
            }
            break;
    }

}
//2021-05-18 by KYT
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ASSETUP" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type
    var dataKey = v_global.logic.setup_no;
    var dataSeq = v_global.logic.setup_seq;
    

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? dataKey : param.data_key) },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? dataSeq : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? 0 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.data_key
    };
    gw_com_module.objRetrieve(args);

}



//----------
function processRetrieve(param) {

    var args;
    if (param.insert) {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_setup_no", value: v_global.logic.setup_no }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_INFO" }
            ],
            clear: [
                { type: "FORM", id: "frmData_SETUP_D" },
                { type: "GRID", id: "grdData_SETUP_ISSUE" },
                { type: "GRID", id: "grdData_FileA" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_setup_no", value: v_global.logic.setup_no },
                    { name: "arg_setup_seq", value: v_global.logic.setup_seq },
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_INFO" },
                { type: "FORM", id: "frmData_SETUP_D", edit: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true },
                { type: "GRID", id: "grdData_SETUP_ISSUE", select: true }
                /*{ type: "GRID", id: "grdData_FileA", select: true }*/
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);
    
}
//----------
function processRetrieveEnd(param) {

    if (param.insert) {
        var setup_user = gw_com_module.v_Session.USR_ID;
        var setup_user_nm = gw_com_module.v_Session.USR_NM;
        var setup_dept = gw_com_module.v_Session.DEPT_CD;
        var setup_dept_nm = gw_com_module.v_Session.DEPT_NM;
        if (v_global.logic.Supp) {
            setup_user = "";
            setup_user_nm = "";
            setup_dept = gw_com_module.v_Session.EMP_NO;
            setup_dept_nm = gw_com_module.v_Session.USR_NM;
        }
        var args = {
            targetid: "frmData_SETUP_D", edit: true,
            data: [
                { name: "setup_no", value: v_global.logic.setup_no },
                { name: "setup_date", value: gw_com_api.getDate() },
                { name: "setup_user_tp", value: gw_com_module.v_Session.USER_TP },
                { name: "setup_user", value: setup_user },
                { name: "setup_user_nm", value: setup_user_nm },
                { name: "setup_dept", value: setup_dept },
                { name: "setup_dept_nm", value: setup_dept_nm },
                { name: "close_yn", value: "0" }
            ]
        };
        gw_com_module.formInsert(args);
        // 작업공정 추가
        processButton({ object: "lyrMenu", element: "공정", row: 1 });
    }

    processFileList({});
}
//----------
function processInsert(param) {

    var args = {
        request: "DATA",
        name: "EHM_3220_1_CHK_ADD",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3220_1_CHK_ADD" +
            "&QRY_COLS=addable" +
            "&CRUD=R" +
            "&arg_setup_no=" + v_global.logic.setup_no,
        async: false,
        handler_success: successRequest,
        setup_no: v_global.logic.setup_no
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        if (data.DATA[0] == "1")
            processRetrieve({ insert: true });
        else
            gw_com_api.messageBox([{ text: "보고서는 \"예정, 진행\" 상태에서만 등록할 수 있습니다." }]);

    }

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_SETUP_D");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
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
        target: [
            { type: "FORM", id: "frmData_SETUP_D" },
            { type: "GRID", id: "grdData_SETUP_ISSUE" },
            { type: "GRID", id: "grdData_FileA" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_SETUP_D" },
            { type: "GRID", id: "grdData_SETUP_ISSUE" },
            { type: "FORM", id: "frmData_SETUP_ISSUE_RMK" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processSave(param) {

    var args = {
        nomessage: true,
        target: [
            { type: "FORM", id: "frmData_SETUP_D" },
            { type: "GRID", id: "grdData_SETUP_ISSUE" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var err = false;

    // 시간 체크
    var start_time = gw_com_api.getValue("frmData_SETUP_D", 1, "start_time");
    var end_time = gw_com_api.getValue("frmData_SETUP_D", 1, "end_time");
    if (start_time.length < 4) {
        err = true;
        gw_com_api.setError(true, "frmData_SETUP_D", 1, "start_time", false);
    }
    if (end_time.length < 4) {
        err = true;
        gw_com_api.setError(true, "frmData_SETUP_D", 1, "end_time", false);
    }

    if (err) {
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        return false;
    } else if (start_time >= end_time) {
        gw_com_api.setError(true, "frmData_SETUP_D", 1, "start_time", false);
        gw_com_api.setError(true, "frmData_SETUP_D", 1, "end_time", false);
        gw_com_api.messageBox([{ text: "종료시간이 시작시간보다 작거나 같을 수 없습니다." }]);
        return false;
    } else if (start_time >= "2400") {
        gw_com_api.setError(true, "frmData_SETUP_D", 1, "start_time", false);
        gw_com_api.messageBox([{ text: "시간은 00:00 부터 23:59 사이로 넣을 수 있습니다." }]);
        return false;
    } else if (end_time >= "2400") {
        gw_com_api.setError(true, "frmData_SETUP_D", 1, "end_time", false);
        gw_com_api.messageBox([{ text: "시간은 00:00 부터 23:59 사이로 넣을 수 있습니다." }]);
        return false;
    }
    gw_com_api.setError(false, "frmData_SETUP_D", 1, "start_time", false);
    gw_com_api.setError(false, "frmData_SETUP_D", 1, "end_time", false);

    // 공정, 작업자 체크
    var missing = undefined;
    var p = {
        handler: processButton,
        param: {
            object: "lyrMenu"
        }
    };
    if (gw_com_api.getValue("frmData_SETUP_D", 1, "setup_procs") == "") {
        p.param.element = "공정";
        gw_com_api.messageBox([{ text: "작업공정을 입력하시기 바랍니다." }], missing, missing, missing, p);
        return false;
    } else if (gw_com_api.getValue("frmData_SETUP_D", 1, "setup_users") == "") {
        p.param.element = "작업자";
        gw_com_api.messageBox([{ text: "작업자를 입력하시기 바랍니다." }], missing, missing, missing, p);
        return false;
    }

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        if (this.QUERY == $("#frmData_SETUP_D").attr("query")) {
            $.each(this.KEY, function () {
                if (this.NAME == "setup_seq") {
                    v_global.logic.setup_seq = this.VALUE;
                    return false;
                }
            });

            // 공정, 작업자
            var act_tp = "DS_ALL";
            var data = gw_com_api.getValue("frmData_SETUP_D", 1, "setup_procs") + "|" + gw_com_api.getValue("frmData_SETUP_D", 1, "setup_users");
            var args = {
                url: "COM",
                procedure: "sp_updateEHMSetup",
                nomessage: true,
                input: [
                    { name: "setup_no", value: v_global.logic.setup_no, type: "varchar" },
                    { name: "setup_seq", value: v_global.logic.setup_seq, type: "int" },
                    { name: "act_tp", value: act_tp, type: "varchar" },
                    { name: "data", value: data, type: "varchar" },
                    { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                ],
                output: [
                    { name: "rtn_msg", type: "varchar" }
                ],
                handler: {
                    success: successBatch,
                    param: param
                }
            };
            gw_com_module.callProcedure(args);

        }
    });
    processRetrieve({ key: response });

}
//----------
function processRemove(param) {

    var args = {
        target: [
            {
                type: "FORM", id: "frmData_SETUP_D",
                key: { element: [{ name: "setup_no" }, { name: "setup_seq" }] }
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processClear({});

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
function successBatch(response, param) {

    if (response.VALUE[0] == "") {
        //var args = {
        //    source: {
        //        type: "INLINE",
        //        argument: [
        //            { name: "arg_setup_no", value: v_global.logic.setup_no },
        //            { name: "arg_setup_seq", value: v_global.logic.setup_seq },
        //            { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
        //        ]
        //    },
        //    target: [
        //        { type: "FORM", id: "frmData_SETUP_D", edit: true }
        //    ],
        //    handler: {
        //        complete: processRetrieveEnd,
        //        param: param
        //    },
        //    key: param.key
        //};
        //gw_com_module.objRetrieve(args);
        //gw_com_api.messageBox([{ text: "SUCCESS" }]);
        gw_com_api.messageBox([{ text: "저장되었습니다." }]);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[0] }]);
    }

}
//----------
function processFileDownload(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}

//---------- 파일 추가/수정/Rev
function processFileUpload(param) {

    // Check Updatable
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // set data for "File Upload"
    var dataType = "ASSETUP";    // Set File Data Type
    var dataKey = gw_com_api.getValue("frmData_SETUP_D", 1, "setup_no");   // Main Key value for Search
    var dataSeq = gw_com_api.getValue("frmData_SETUP_D", 1, "setup_seq");   // Main Seq value for Search
    var deptNm = gw_com_module.v_Session.DEPT_NM;

    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq, file_group1: deptNm}; // additional data = { data_subkey: "", data_subseq:-1 }

    // set Argument for Dialogue
    var pageArgs = dataType + ":multi" +":Simple"; // 1.DataType, 2.파일선택 방식(multi/single), 3.UI Type(Simple/GroupA/ECM); 
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 650, height: 200, scroll: true,  // multi( h:350, scroll) / single(h:300)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);

}
//---------- Mail 전송 시작
function processSendEmail(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    gw_com_api.messageBox([
        { text: "SETUP 보고서에 대한 이메일을 발송합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { type: "EHM_SETUP_RPT" });
}
//---------- Batch : NCR 발행 통보 처리 Procedure 실행 (PROC_MAIL_QDM_NCR)
function processBatch(param) {

    var param = {
        type: param.type,
        key_no: gw_com_api.getValue("frmData_SETUP_D", 1, "setup_no"),
        key_seq: gw_com_api.getValue("frmData_SETUP_D", 1, "setup_seq")
    }

    var args = {
        url: "COM",
        subject: MailInfo.getSubject(param),
        body: MailInfo.getBody(param),
        to: MailInfo.getTo(param),
        edit: true
    };
    gw_com_module.sendMail(args);

    //var args = {
    //    url: (param.type == "EHM_SETUP_RPT") ? "COM" : gw_com_module.v_Current.window + ".aspx/" + "Mail",
    //    procedure: "PROC_MAIL_QDM_NCR", nomessage: true,
    //    argument: [
    //        { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no") }
    //    ],
    //    input: [
    //        { name: "type", value: param.type, type: "varchar" },
    //        { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no"), type: "varchar" },
    //        { name: "key_seq", value: "0", type: "varchar" },
    //        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
    //    ],
    //    output: [
    //        { name: "r_value", type: "int" },
    //        { name: "message", type: "varchar" }
    //    ],
    //    handler: {
    //        success: successBatch,
    //        param: {
    //            type: param.type,
    //            rqst_no: gw_com_api.getValue("frmData_Main", 1, "rqst_no")
    //        }
    //    }
    //};
    //gw_com_module.callProcedure(args);
}
//---------- Batch : Afert Processing
function successBatch(response, param) {

    //gw_com_api.messageBox([ { text: response.VALUE[1] } ], 350);
    var args = {
        url: "COM",
        subject: MailInfo.getSubject(param),
        body: MailInfo.getBody(param),
        to: MailInfo.getTo(param),
        edit: true
    };
    gw_com_module.sendMail(args);

}
//----------
var MailInfo = {
    getSubject: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=QDM_6210_MAIL" +
                "&QRY_COLS=val" +
                "&CRUD=R" +
                "&arg_type=" + param.type + "&arg_field=subject&arg_key_no=" + param.key_no + "&arg_key_seq=" + param.key_seq,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    },
    getBody: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=QDM_6210_MAIL" +
                "&QRY_COLS=val" +
                "&CRUD=R" +
                "&arg_type=" + param.type + "&arg_field=body&arg_key_no=" + param.key_no + "&arg_key_seq=" + param.key_seq,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    },
    getTo: function (param) {
        var rtn = new Array();
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=QDM_6210_MAIL2" +
                "&QRY_COLS=name,value" +
                "&CRUD=R" +
                "&arg_type=" + param.type + "&arg_key_no=" + param.key_no + "&arg_key_seq=" + param.key_seq,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            $.each(data, function () {
                rtn.push({
                    name: this.DATA[0],
                    value: this.DATA[1]
                });
            });
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else if (param.data.result == "NO")
                                if (v_global.process.handler != undefined)
                                    v_global.process.handler(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch: {
                        if (param.data.result == "YES") processBatch(param.data.arg);
                    } break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined)
                                param.data.arg.handler(param.data.arg.param);
                        }
                        break
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
                    case "EHM_3221":    // 공정
                    case "EHM_3222":    // 작업자
                    case "EHM_3223":    // ISSUE 작업자
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "SYS_FileUpload":
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
                    case "EHM_3221":    // 공정
                    case "EHM_3222":    // 작업자
                        if (param.data != undefined) {
                            if (param.from.page == "EHM_3221") {
                                gw_com_api.setValue("frmData_SETUP_D", 1, "setup_procs", param.data.proc_seq);
                                gw_com_api.setValue("frmData_SETUP_D", 1, "setup_procs_nm", param.data.proc_nm, false, true);
                                if (checkCRUD({}) == "create" && gw_com_api.getValue("frmData_SETUP_D", 1, "setup_users") == "")
                                    processButton({ object: "lyrMenu", element: "작업자", row: 1 });
                            } else {
                                gw_com_api.setValue("frmData_SETUP_D", 1, "setup_users", param.data.user_seq);
                                gw_com_api.setValue("frmData_SETUP_D", 1, "setup_users_nm", param.data.user_nm, false, true);
                            }

                            //var act_tp = param.from.page == "EHM_3221" ? "DS_PROC" : "DS_USER";
                            //var data = param.from.page == "EHM_3221" ? param.data.proc_seq : param.data.user_seq;
                            //var args = {
                            //    url: "COM",
                            //    procedure: "sp_updateEHMSetup",
                            //    nomessage: true,
                            //    input: [
                            //        { name: "setup_no", value: param.data.setup_no, type: "varchar" },
                            //        { name: "setup_seq", value: param.data.setup_seq, type: "int" },
                            //        { name: "act_tp", value: act_tp, type: "varchar" },
                            //        { name: "data", value: data, type: "varchar" },
                            //        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                            //    ],
                            //    output: [
                            //        { name: "rtn_msg", type: "varchar" }
                            //    ],
                            //    handler: {
                            //        success: successBatch,
                            //        param: param
                            //    }
                            //};
                            //gw_com_module.callProcedure(args);
                        }
                        break;
                    case "EHM_3223":
                        {
                            var data = param.data.issue_user;
                            $.each(data, function (i, v) {
                                this.setup_no = v_global.logic.setup_no;
                                this.setup_seq = v_global.logic.setup_seq;
                                this.issue_date = gw_com_api.getDate();
                            });
                            var args = { targetid: "grdData_SETUP_ISSUE", edit: true, updatable: true, data: data };
                            gw_com_module.gridInserts(args);
                            processRowselected({ object: "grdData_SETUP_ISSUE", row: gw_com_api.getRowCount("grdData_SETUP_ISSUE") });
                        }
                        break;
                    case "SYS_FileUpload":
                        {
                            processFileList({ data_key: v_global.logic.setup_no, data_seq: v_global.logic.setup_seq});
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASSETUP:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_setup_no", value: v_global.logic.setup_no },
                            { name: "arg_setup_seq", value: v_global.logic.setup_seq }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_FileA", select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//