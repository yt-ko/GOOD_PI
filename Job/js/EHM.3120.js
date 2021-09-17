//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.03)
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
        var args = {
            request: [
                {
                    type: "PAGE", name: "IEHM52", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM52" }]
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
            v_global.logic.modify_no = gw_com_api.getPageParameter("modify_no");
            v_global.logic.eco_no = gw_com_api.getPageParameter("eco_no");
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
                { name: "일괄", value: "일괄등록", icon: "기타", updatable: true },
                //{ name: "문제", value: "문제발생", icon: "기타", updatable: true },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE", show: true,
            element: [
                { name: "조회", value: "새로고침" },
                { name: "ECO", value: "ECO정보", icon: "기타" }
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
            targetid: "grdData_MODIFY_D", query: "EHM_3120_1", title: "대상 설비",
            height: 170, show: true, caption: false, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "고객사", name: "cust_nm", width: 80 },
                { header: "LINE", name: "cust_dept_nm", width: 80 },
                { header: "제품유형", name: "prod_type_nm", width: 80 },
                { header: "설비명", name: "prod_nm", width: 250 },
                { header: "Project No.", name: "proj_no", width: 100 },
                {
                    header: "BOM Ver.", name: "bom_ver", width: 120,
                    editable: { type: "text", maxlength: 20 }, hidden: true
                },
                {
                    header: "시작예정일", name: "plan_start_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text" }, hidden: true
                },
                { header: "시작일", name: "start_date", width: 100, align: "center", mask: "date-ymd", hidden: true },
                { header: "최근작업일", name: "end_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "완료목표일", name: "plan_end_date", width: 100, align: "center", mask: "date-ymd" },
                {
                    header: "비고", name: "rmk", width: 370,
                    editable: { type: "text", maxlength: 200 }
                },
                { name: "modify_no", editable: { type: "hidden" }, hidden: true },
                { name: "modify_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MODIFY_DS", query: "EHM_3120_2", title: "대상 모듈",
            height: 170, show: true, caption: false, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn", validate: true },
            element: [
                { header: "Module", name: "module_nm", width: 140 },
                {
                    header: "작업상태", name: "pstat", width: 140,
                    format: { type: "select", data: { memory: "IEHM52", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "IEHM52", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "시작일", name: "start_date", width: 120, align: "center", mask: "date-ymd",
                    editable: { type: "text" }, hidden: true
                },
                {
                    header: "최근작업일", name: "end_date", width: 120, align: "center", mask: "date-ymd",
                    editable: { type: "text" }
                },
                {
                    header: "완료목표일", name: "plan_end_date", width: 120, align: "center", mask: "date-ymd",
                    editable: { type: "text" }
                },
                {
                    header: "비고", name: "rmk", width: 570,
                    editable: { type: "text", maxlength: 200 }
                },
                { name: "modify_no", editable: { type: "hidden" }, hidden: true },
                { name: "modify_seq", editable: { type: "hidden" }, hidden: true },
                { name: "module_seq", editable: { type: "hidden" }, hidden: true },
                { name: "module_cd", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "EHM_3110_4", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "_edit_yn", validate: true },
            element: [
                { header: "구분", name: "file_tp_nm", width: 100, align: "center" },
                { header: "파일명", name: "file_nm", width: 400 },
                {
                    header: "다운로드", name: "download", width: 100, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 450,
                    editable: { type: "text" }
                },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "_edit_yn", hidden: true },
                { name: "file_id", editable: { type: "hidden" }, hidden: true }
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
                { type: "GRID", id: "grdData_MODIFY_D", offset: 8 },
                { type: "GRID", id: "grdData_MODIFY_DS", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "일괄", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "ECO", event: "click", handler: processButton };
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
        var args = { targetid: "grdData_MODIFY_D", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MODIFY_DS", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processDownload };
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
                processRetrieve({});
            }
            break;
        case "추가":
            {
                if (!checkUpdatable({})) return false;
                v_global.event.data = {
                    type: "ASM",
                    key: v_global.logic.modify_no,
                    seq: 0,
                    user: gw_com_module.v_Session.USR_ID,
                    crud: "C",
                    biz_area: "공통",
                    doc_area: "99"
                };
                var args = {
                    type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "ASM",
                    width: 650, height: 500, open: true, locate: ["center", "bottom"]
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_FileUpload",
                        param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.event.data }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "삭제":
            {
                var args = {
                    targetid: "grdData_FILE", row: "selected", select: true, check: "_edit_yn"
                };
                gw_com_module.gridDelete(args);
            }
            break;
        case "저장":
            {
                processSave({});
            }
            break;
        case "일괄":
            {
                if (!checkUpdatable({})) return false;
                var auth = getAuth({ modify_no: v_global.logic.modify_no, user_id: gw_com_module.v_Session.USR_ID });
                var title = "횡전개 실적 " + (auth == "R" ? "조회" : "등록");
                var page = "EHM_3121";
                var args = {
                    ID: gw_com_api.v_Stream.msg_linkPage,
                    to: { type: "MAIN" },
                    data: {
                        page: page,
                        title: title,
                        param: [
                            { name: "AUTH", value: auth },
                            { name: "modify_no", value: v_global.logic.modify_no },
                            { name: "eco_no", value: v_global.logic.eco_no }
                        ]
                    }
                };
                gw_com_module.streamInterface(args);
                processClose({});
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
        case "ECO":
            {
                var args = {
                    to: "INFO_ECCB",
                    eco_no: v_global.logic.eco_no,
                    tab: "ECO"
                };
                gw_com_site.linkPage(args);
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    switch (param.element) {
        case "pstat":
            {
                if (param.value.current == "90") {
                    if (gw_com_api.getValue(param.object, param.row, "end_date", true) == "") {
                        gw_com_api.setValue(param.object, param.row, "end_date", gw_com_api.getDate(), true);
                    }
                } else {
                    gw_com_api.setValue(param.object, param.row, "end_date", "", true);
                }
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.file) {

        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_modify_no", value: v_global.logic.modify_no }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_FILE", select: true }
            ]
        };

    } else {

        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_modify_no", value: v_global.logic.modify_no }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MODIFY_D", select: true },
                { type: "GRID", id: "grdData_FILE", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_MODIFY_DS" }
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

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: param.type, id: param.object, row: param.row,
            element: [
                { name: "modify_no", argument: "arg_modify_no" },
                { name: "modify_seq", argument: "arg_modify_seq" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MODIFY_DS", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
             { type: "GRID", id: "grdData_MODIFY_D" },
             { type: "GRID", id: "grdData_MODIFY_DS" },
             { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () {
            if (this.NAME == "modify_no") {
                v_global.logic.modify_no = this.VALUE;
            } else if (this.NAME == "modify_seq") {
                v_global.logic.modify_seq = this.VALUE;
            }
        });
    });
    var key = [
        {
            KEY: [
                { NAME: "modify_no", VALUE: v_global.logic.modify_no },
                { NAME: "modify_seq", VALUE: v_global.logic.modify_seq }
            ],
            QUERY: $("#grdData_MODIFY_D_data").attr("query")
        }
    ];
    processRetrieve({ key: key });

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MODIFY_D" },
            { type: "GRID", id: "grdData_MODIFY_DS" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var args = {
        request: "DATA",
        name: "EHM_3120_1_CHK_DEL",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3120_1_CHK_DEL" +
            "&QRY_COLS=deletable" +
            "&CRUD=R" +
            "&arg_modify_no=" + param.modify_no,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        if (data.DATA[0] == "1")
            gw_com_api.messageBox([
                { text: "REMOVE" }
            ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        else
            gw_com_api.messageBox([{ text: "실적이 등록되어 있어 삭제할 수 없습니다." }]);

    }

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdList_MODIFY",
                key: [{ row: "selected", element: [{ name: "modify_no" }] }]
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

    processRetrieve({});
    //var args = {
    //    targetid: "grdList_MODIFY", row: "selected", select: true,
    //    clear: [
    //        { type: "GRID", id: "grdData_MODIFY_D" },
    //        { type: "GRID", id: "grdData_FILE" }
    //    ]
    //}
    //gw_com_module.gridDelete(args);

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
function processCreateModify(param) {

    v_global.event.data = {
        eco_no: param.eco_no,
        modify_no: (param.modify_no == undefined ? "" : param.modify_no)
    }
    var args = {
        type: "PAGE", page: "EHM_3112", title: "횡전개 설비",
        width: 1150, height: 600, locate: ["center", "center"], open: true,
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "EHM_3112",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDownload(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function getAuth(param) {

    var rtn = "U";
    var args = {
        request: "DATA",
        name: "EHM_3120_AUTH",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3120_AUTH" +
            "&QRY_COLS=auth" +
            "&CRUD=R" +
            "&arg_modify_no=" + param.modify_no +
            "&arg_user_id=" + param.user_id,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {
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
                    case "EHM_3121":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "DLG_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
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
                    case "EHM_3121":
                        {
                            if (param.data != undefined)
                                processRetrieve({});
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER:
            {
                closeDialogue({ page: param.from.page });
                processRetrieve({ file: true });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//