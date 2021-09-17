//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.03)
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");
        //----------
        v_global.logic.modify_no = gw_com_api.getPageParameter("modify_no");
        v_global.logic.eco_no = gw_com_api.getPageParameter("eco_no");
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "IEHM52", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM52" }]
                },
                {
                    type: "PAGE", name: "제품유형", query: "DDDW_EHM_3120_1",
                    param: [{ argument: "arg_modify_no", value: v_global.logic.modify_no }]
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_EHM_3120_2",
                    param: [{ argument: "arg_modify_no", value: v_global.logic.modify_no }]
                },
                {
                    type: "PAGE", name: "LINE", query: "DDDW_EHM_3120_3",
                    param: [{ argument: "arg_modify_no", value: v_global.logic.modify_no }]
                },
                {
                    type: "PAGE", name: "Module", query: "DDDW_EHM_3120_4",
                    param: [{ argument: "arg_modify_no", value: v_global.logic.modify_no }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            //gw_com_api.setValue("frmAct", 1, "end_date", gw_com_api.getDate(""));
            //----------
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
            //----------
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
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "ECO", value: "ECO정보", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "선택", value: "적용", icon: "실행", updatable: true }
            ]
        };
        //----------
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
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "prod_type", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "prod_type", label: { title: "제품유형 :" },
                                editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "cust_cdc", label: { title: "고객사 :" },
                                editable: { type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "cust_dept", label: { title: "LINE :" },
                                editable: { type: "select", data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "module_cd", label: { title: "Module :" },
                                editable: { type: "select", data: { memory: "Module", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 20 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmAct", type: "FREE", title: "",
            trans: true, show: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R" ? false : true), border: false, align: "left",
            editable: { bind: "open", focus: "dept_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pstat", label: { title: "작업상태 :" },
                                editable: { type: "select", data: { memory: "IEHM52" } }
                            },
                            {
                                name: "end_date", label: { title: "최근작업일 :" },
                                editable: { type: "text", size: 9 }, mask: "date-ymd"
                            },
                            {
                                name: "plan_end_date", label: { title: "완료목표일 :" },
                                editable: { type: "text", size: 9 }, mask: "date-ymd"
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
            targetid: "grdData_MODIFY_DS", query: "EHM_3121_1", title: "",
            height: 400, caption: false, pager: false, show: true, selectable: true, number: true, checkrow: true, multi: true,
            element: [
                { header: "제품유형", name: "prod_type_nm", width: 80 },
                { header: "고객사", name: "cust_nm", width: 80 },
                { header: "LINE", name: "cust_dept_nm", width: 100 },
                { header: "설비명", name: "prod_nm", width: 250 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "Module", name: "module_nm", width: 80 },
                { header: "시작일", name: "start_date", width: 80, align: "center", mask: "date-ymd", hidden: true },
                { header: "최근작업일", name: "end_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "완료목표일", name: "plan_end_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "작업상태", name: "pstat_nm", width: 80, align: "center" },
                { name: "modify_no", hidden: true },
                { name: "modify_seq", hidden: true },
                { name: "module_seq", hidden: true },
                { name: "module_cd", hidden: true }
            ]
        };
        //----------
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
                { type: "GRID", id: "grdData_MODIFY_DS", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "ECO", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "전체", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "선택", event: "click", handler: processButton };
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
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processDownload };
        gw_com_module.eventBind(args);
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
function processButton(param) {

    switch (param.element) {
        case "조회":
            {
                var args = { target: [{ id: "frmOption", focus: true }] };
                gw_com_module.objToggle(args);
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
        case "선택":
            {
                processBatch({});
            }
            break;
        case "실행":
            {
                processRetrieve({});
            }
            break;
        case "취소":
            {
                gw_com_api.hide("frmOption");
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
                { type: "GRID", id: "grdData_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };

    } else {

        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "prod_type", argument: "arg_prod_type" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "module_cd", argument: "arg_module" },
                    { name: "proj_no", argument: "arg_proj_no" }
                ],
                argument: [
                    { name: "arg_modify_no", value: v_global.logic.modify_no }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MODIFY_DS" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
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

    processRetrieve({ file: true });

}
//----------
function processBatch(param) {

    var ids = gw_com_api.getSelectedRow("grdData_MODIFY_DS", true);
    if (ids.length > 0) {
        var data = "";
        var pstat = gw_com_api.getValue("frmAct", 1, "pstat");
        var plan_start_date = "";
        var plan_end_date = gw_com_api.getValue("frmAct", 1, "plan_end_date");
        var start_date = "";
        var end_date = gw_com_api.getValue("frmAct", 1, "end_date");

        if (pstat == "90" && end_date == "") {
            gw_com_api.setError(true, "frmAct", 1, "end_date", false, false);
            gw_com_api.messageBox([{ text: "최근작업일자를 입력하세요." }]);
            return false;
        }
        gw_com_api.setError(false, "frmAct", 1, "end_date", false, false);

        $.each(ids, function () {
            data += (data == "" ? "" : "|") +
                gw_com_api.getValue("grdData_MODIFY_DS", this, "modify_no", true) + "^" +
                gw_com_api.getValue("grdData_MODIFY_DS", this, "modify_seq", true) + "^" +
                gw_com_api.getValue("grdData_MODIFY_DS", this, "module_seq", true) + "^" +
                plan_start_date + "^" + plan_end_date + "^" + start_date + "^" + end_date + "^" + pstat;
        });
        var args = {
            url: "COM",
            nomessage: true,
            procedure: "sp_updateEHMModify",
            input: [
                { name: "act_tp", value: "DS_BATCH", type: "varchar" },
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
    } else {
        gw_com_api.messageBox([{ text: "NODATA" }]);
    }

}
//----------
function successBatch(response, param) {

    var missing = undefined;
    var p = {
        handler: processRetrieve,
        param: { data: {} }
    };
    var msg = (response.VALUE[0] == "" ? "SUCCESS" : response.VALUE[0]);
    gw_com_api.messageBox([{ text: msg }], missing, missing, missing, p);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

    //var args = {
    //    ID: gw_com_api.v_Stream.msg_closeDialogue,
    //    data: param.data
    //};
    //gw_com_module.streamInterface(args);
    //processClear(param);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MODIFY_DS" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);

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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
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