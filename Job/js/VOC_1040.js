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
    logic: {}
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

    //#region : ready
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "SYS_FileUpload", title: "파일 업로드", width: 650, height: 500 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "VOC_1041", title: "처리이력", width: 600, height: 400 };
        gw_com_module.dialoguePrepare(args);

        // set data. for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "PAGE", name: "처리결과", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "VOC06" }]
                },
                {
                    type: "PAGE", name: "반려사유", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "VOC05" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // go next.
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //---------
            gw_com_api.setValue("frmOption", 1, "voc_no", gw_com_api.getPageParameter("voc_no"));
            /*processRetrieve({});*/
            //----------
            gw_com_module.startPage();
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "조회", value: "새로고침" },
                { name: "이력", value: "처리이력", icon: "기타" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "파일 추가" },
                { name: "삭제", value: "파일 삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "접수일 :" },
                                mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "장비군"/*, unshift: [{ title: "전체", value: "%" }]*/ } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cust_nm", label: { title: "고객사 :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "voc_no", label: { title: "관리번호 :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rcpt_user", label: { title: "접수자 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "charge_user", label: { title: "담당자 :" },
                                editable: { type: "text", size: 10 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", format: { type: "button" }, act: true },
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
            targetid: "grdData_CHARGE", query: "VOC_1040_1", title: "처리 담당",
            caption: true, height: 150, pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "관리번호", name: "voc_no", width: 90, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "접수부서", name: "rcpt_dept_nm", width: 100 },
                { header: "접수자", name: "rcpt_user_nm", width: 80 },
                { header: "접수일", name: "rcpt_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "담당부서", name: "charge_dept_nm", width: 100 },
                { header: "담당자", name: "charge_user_nm", width: 80 },
                { header: "제목", name: "voc_title", width: 320 },
                { header: "고객요청일", name: "cust_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "처리방안", name: "result_nm", width: 80 },
                {
                    header: "처리예정일", name: "plan_date", width: 80, align: "center", mask: "date-ymd",
                    editable: { type: "hidden" }
                },
                { header: "처리상태", name: "result_stat_nm", width: 70 },
                {
                    header: "처리완료일", name: "result_date", width: 80, align: "center", mask: "date-ymd",
                    editable: { type: "hidden" }
                },
                { header: "처리결과", name: "chk_nm", width: 70 },
                { name: "charge_seq", hidden: true, editable: { type: "hidden" } },
                { name: "charge_dept", hidden: true },
                { name: "charge_user", hidden: true },
                { name: "result_cd", hidden: true, editable: { type: "hidden" } },
                { name: "result_stat", hidden: true, editable: { type: "hidden" } },
                { name: "result_rmk", hidden: true, editable: { type: "hidden" } },
                { name: "result_memo", hidden: true, editable: { type: "hidden" } },
                { name: "result_memo_crud", hidden: true },
                { name: "rqst_rmk", hidden: true },
                { name: "reject_cd", hidden: true, editable: { type: "hidden" } },
                { name: "chk_cd", hidden: true, editable: { type: "hidden" } },
                { name: "chk_dept_nm", hidden: true },
                { name: "chk_dept", hidden: true, editable: { type: "hidden" } },
                { name: "chk_user_nm", hidden: true },
                { name: "chk_user", hidden: true, editable: { type: "hidden" } },
                { name: "chk_date", hidden: true, editable: { type: "hidden" } },
                { name: "rcpt_memo", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        createDW({});
        //=====================================================================================
        var args = {
            targetid: "grdData_PROD", query: "VOC_1010_2", title: "대상 설비",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "Line", name: "cust_dept_nm", width: 350 },
                { header: "제품유형", name: "prod_type_nm", width: 350 },
                { header: "Process", name: "cust_proc_nm", width: 350 },
                { name: "voc_no", hidden: true },
                { name: "prod_seq", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "prod_type", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //del by kyt 2021-06-03
        //var args = {
        //    targetid: "grdData_FileA", query: "VOC_1020_4", title: "첨부 파일",
        //    caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
        //    editable: { master: true, bind: "select", focus: "file_desc", validate: true },
        //    element: [
        //        { header: "파일명", name: "file_nm", width: 350, align: "left" },
        //        {
        //            header: "다운로드", name: "download", width: 60, align: "center",
        //            format: { type: "link", value: "다운로드" }
        //        },
        //        {
        //            header: "파일설명", name: "file_desc", width: 600, align: "left",
        //            editable: { type: "text" }
        //        },
        //        { name: "file_ext", hidden: true },
        //        { name: "file_path", hidden: true },
        //        { name: "network_cd", hidden: true },
        //        { name: "data_tp", hidden: true },
        //        { name: "data_key", hidden: true },
        //        { name: "data_seq", hidden: true },
        //        { name: "file_id", hidden: true, editable: { type: "hidden" } }
        //    ]
        //};
        // Data Box : Attach File add by kyt 2021-06-03
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
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_CHARGE", offset: 8 },
                { type: "FORM", id: "frmData_CHARGE", offset: 8 },
                { type: "GRID", id: "grdData_PROD", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
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

        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "이력", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processFileUpload }; // changed by kyt 2021-06-03
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_CHARGE", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FileA", grid: true, element: "_download", event: "click", handler: click_grdData_FileA_download };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        if (param.object == "lyrMenu") {
                            var args = { target: [{ id: "frmOption", focus: true }] };
                            gw_com_module.objToggle(args);
                        } else {
                            v_global.process.handler = processRetrieve;
                            if (!checkUpdatable({})) return false;
                            processRetrieve({});
                        }
                    }
                    break;
                case "이력":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_CHARGE");
                        if (row > 0) {
                            v_global.event.data = {
                                voc_no: gw_com_api.getValue("grdData_CHARGE", row, "voc_no", true),
                                charge_seq: gw_com_api.getValue("grdData_CHARGE", row, "charge_seq", true)
                            }
                            var args = {
                                page: "VOC_1041",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        } else {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                        }
                    }
                    break;
                case "추가":
                    {
                        if (param.object == "lyrMenu_FILE") {
                            if (!checkManipulate({})) return;
                            if (!checkUpdatable({ check: true })) return false;

                            v_global.event.data = {
                                type: "EHM",
                                key: gw_com_api.getValue("grdData_CHARGE", "selected", "voc_no", true),
                                seq: 0,
                                user: gw_com_module.v_Session.USR_ID,
                                crud: "C",
                                biz_area: "공통",
                                doc_area: "99"
                            };
                            var args = {
                                page: "DLG_FileUpload",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_upload_ASFOLDER,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "삭제":
                    {
                        if (param.object == "lyrMenu_FILE") {
                            if (!checkManipulate({})) return;
                            var args = { targetid: "grdData_FileA", row: "selected", select: true }
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
                        checkClosable({});
                    }
                    break;
                case "실행":
                    {
                        v_global.process.handler = processRetrieve;
                        if (!checkUpdatable({})) return false;
                        processRetrieve({});
                    }
                    break;
                case "취소":
                    {
                        closeOption({});
                    }
                    break;
            }

        }
        //----------
        function click_grdData_FileA_download(ui) {
            var args = { source: { id: "grdData_FileA", row: ui.row }, targetid: "lyrDown" };
            gw_com_module.downloadFile(args);
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
function createDW(param) {

    v_global.logic.editable = (param.edit === true);
    var args = {
        targetid: "frmData_CHARGE", query: "VOC_1040_1", type: "TABLE", title: "결과 확인",
        caption: true, show: true, selectable: true,
        content: {
            width: { label: 120, field: 150 },
            height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "처리결과", format: { type: "label" } },
                        {
                            name: "chk_cd",
                            editable: { type: "select", data: { memory: "처리결과" } }
                        },
                        { header: true, value: "반려사유", format: { type: "label" } },
                        {
                            name: "reject_cd",
                            editable: { type: "select", data: { memory: "반려사유", unshift: [{ title: "-", value: "" }] } }
                        },
                        { header: true, value: "확인자", format: { type: "label" } },
                        { name: "chk_user_nm", editable: { type: "hidden" }, display: true },
                        { name: "chk_user", editable: { type: "hidden" }, hidden: true },
                        { name: "chk_dept", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "확인일자", format: { type: "label" } },
                        {
                            name: "chk_date", mask: "date-ymd",
                            editable: { type: "hidden" }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "처리방안", format: { type: "label" } },
                        { name: "result_nm", editable: { type: "hidden" } },
                        { header: true, value: "처리예정일", format: { type: "label" } },
                        { name: "plan_date", editable: { type: "hidden" }, mask: "date-ymd" },
                        { header: true, value: "처리상태", format: { type: "label" } },
                        { name: "result_stat_nm", editable: { type: "hidden" } },
                        { header: true, value: "처리완료일", format: { type: "label" } },
                        { name: "result_date", editable: { type: "hidden" }, mask: "date-ymd" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "요청내용", format: { type: "label" }, style: { rowspan: 2 } },
                        {
                            name: "rcpt_memo", style: { colspan: 7 },
                            format: { type: "textarea", rows: 7 }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "rqst_rmk", style: { colspan: 7 },
                            format: { width: 750 },
                            editable: { type: "hidden", width: 750 }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "처리내용", format: { type: "label" } },
                        {
                            name: "result_memo", style: { colspan: 7 },
                            format: { type: "textarea", rows: 10 },
                            editable: { type: "textarea", rows: 10 }
                        }
                    ]
                }
            ]
        }
    };
    //----------
    if (v_global.logic.editable) args.editable = { bind: "select", focus: "chk_cd", validate: true };
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = { target: [{ type: "FORM", id: "frmData_CHARGE", offset: 8 }] };
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = { targetid: "frmData_CHARGE", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_CHARGE") {
        switch (param.element) {
            case "chk_cd":
                {
                    gw_com_api.setValue("grdData_CHARGE", "selected", param.element, param.value.current, true, true);
                    gw_com_api.setValue("grdData_CHARGE", "selected", "chk_nm", gw_com_api.getText(param.object, param.row, param.element), true);
                    if (param.value.current == "010") {
                        if (gw_com_api.getValue(param.object, param.row, "reject_cd") != "") {
                            gw_com_api.setValue(param.object, param.row, "reject_cd", "");
                        }
                    }
                    if (gw_com_api.getValue(param.object, param.row, "chk_date") == "") {
                        gw_com_api.setValue(param.object, param.row, "chk_date", gw_com_api.getDate());
                        gw_com_api.setValue(param.object, param.row, "chk_user", gw_com_module.v_Session.USR_ID);
                        gw_com_api.setValue(param.object, param.row, "chk_user_nm", gw_com_module.v_Session.USR_NM);
                        gw_com_api.setValue(param.object, param.row, "chk_dept", gw_com_module.v_Session.DEPT_CD);
                    }
                    gw_com_api.setUpdatable("grdData_CHARGE", gw_com_api.getSelectedRow("grdData_CHARGE"), true);
                }
                break;
            case "reject_cd":
                {
                    if (gw_com_api.getValue(param.object, param.row, "chk_cd") == "020") {
                        gw_com_api.setValue("grdData_CHARGE", "selected", param.element, param.value.current, true, true);
                    } else {
                        if (param.value.current != "") {
                            gw_com_api.setValue("grdData_CHARGE", "selected", param.element, "", true, true);
                            gw_com_api.setUpdatable("grdData_CHARGE", gw_com_api.getSelectedRow("grdData_CHARGE"), true);
                            gw_com_api.setValue(param.object, param.row, param.element, "", false, false, false);
                            return false;
                        }
                    }
                    gw_com_api.setValue("grdData_CHARGE", "selected", param.element, param.value.current, true, true);
                    gw_com_api.setUpdatable("grdData_CHARGE", gw_com_api.getSelectedRow("grdData_CHARGE"), true);
                }
                break;
            case "chk_date":
                {
                    var data = gw_com_api.unMask(param.value.current, "date-ymd");
                    if (data == gw_com_api.getValue("grdData_CHARGE", "selected", param.element, true)) return false;
                    gw_com_api.setValue("grdData_CHARGE", "selected", param.element, data, true, true);
                    gw_com_api.setUpdatable("grdData_CHARGE", gw_com_api.getSelectedRow("grdData_CHARGE"), true);
                }
                break;
            case "result_memo":
            case "chk_user":
            case "chk_user_nm":
            case "chk_dept":
                {
                    gw_com_api.setValue("grdData_CHARGE", "selected", param.element, param.value.current.replace(/\r\n/g, "_CRLF_"), true, true);
                    gw_com_api.setUpdatable("grdData_CHARGE", gw_com_api.getSelectedRow("grdData_CHARGE"), true);
                }
                break;
        }
    }

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_CHARGE");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function processItemdblclick(param) {

    if (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R")
        return false;

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "result_memo_view":
            {
                var args = {
                    page: "DLG_EDIT_HTML",
                    option: "width=900,height=600,left=300,resizable=1",
                    data: {
                        title: "처리내용",
                        html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                    }
                };
                gw_com_api.openWindow(args);
            }
            break;
    }

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_CHARGE" },
            { type: "GRID", id: "grdData_FileA" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    processClose({});

}
//----------
function processRetrieve(param) {

    var args;
    if (param.file) {
        args = {
            source: {
                type: "GRID", id: "grdData_PROD", row: "selected",
                element: [
                    { name: "voc_no", argument: "arg_voc_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_FileA", select: true }
            ]
        };
    } else if (param.object == "grdData_CHARGE") {
        var editable = (gw_com_api.getValue(param.object, param.row, "_edit_yn", true) == "1");
        if (v_global.logic.editable != editable)
            createDW({ edit: editable });
        //----------
        var a = {
            targetid: "frmData_CHARGE", edit: true,
            data: [
                { name: "result_nm", value: gw_com_api.getValue(param.object, param.row, "result_nm", true), hide: !editable, change: false },
                { name: "result_stat_nm", value: gw_com_api.getValue(param.object, param.row, "result_stat_nm", true), hide: !editable, change: false },
                { name: "result_date", value: gw_com_api.getValue(param.object, param.row, "result_date", true), hide: !editable, change: false },
                { name: "result_memo", value: gw_com_api.getValue(param.object, param.row, "result_memo", true).replace(/_CRLF_/g, "\r\n"), hide: true, change: false },
                { name: "cust_date", value: gw_com_api.getValue(param.object, param.row, "cust_date", true), hide: !editable, change: false },
                { name: "plan_date", value: gw_com_api.getValue(param.object, param.row, "plan_date", true), hide: !editable, change: false },
                { name: "rqst_rmk", value: gw_com_api.getValue(param.object, param.row, "rqst_rmk", true), hide: !editable, change: false },
                { name: "chk_cd", value: gw_com_api.getValue(param.object, param.row, "chk_cd", true), hide: !editable, change: false },
                //{ name: "chk_dept_nm", value: gw_com_api.getValue(param.object, param.row, "chk_dept_nm", true), change: false },
                { name: "chk_dept", value: gw_com_api.getValue(param.object, param.row, "chk_dept", true), hide: !editable, change: false },
                { name: "chk_user_nm", value: gw_com_api.getValue(param.object, param.row, "chk_user_nm", true), hide: !editable, change: false },
                { name: "chk_user", value: gw_com_api.getValue(param.object, param.row, "chk_user", true), hide: !editable, change: false },
                { name: "chk_date", value: gw_com_api.getValue(param.object, param.row, "chk_date", true), hide: !editable, change: false },
                { name: "reject_cd", value: gw_com_api.getValue(param.object, param.row, "reject_cd", true), hide: !editable, change: false },
                { name: "rcpt_memo", value: gw_com_api.getValue(param.object, param.row, "rcpt_memo", true).replace(/_CRLF_/g, "\r\n"), hide: true, change: false }
            ]
        };
        gw_com_module.formInsert(a);
        //----------
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "voc_no", argument: "arg_voc_no" }
                ],
                argument: [
                    { name: "arg_prod_type", value: "%" },
                    { name: "arg_cust_dept", value: "%" },
                    { name: "arg_cust_proc", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_PROD", select: true }
             //del by kyt 2021-06-03
            /*{ type: "GRID", id: "grdData_FileA", select: true }*/
            ]
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "cust_nm", argument: "arg_cust_nm" },
                    { name: "voc_no", argument: "arg_voc_no" },
                    { name: "rcpt_user", argument: "arg_rcpt_user" },
                    { name: "charge_user", argument: "arg_charge_user" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "cust_nm" }] },
                    { element: [{ name: "voc_no" }] },
                    { element: [{ name: "rcpt_user" }] },
                    { element: [{ name: "charge_user" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_CHARGE", select: true },
            ],
            clear: [
                { type: "FORM", id: "frmData_CHARGE" },
                { type: "GRID", id: "grdData_PROD" },
                { type: "GRID", id: "grdData_FileA" }
            ],
            key: param.key
        };

    }
    gw_com_module.objRetrieve(args);

    if (gw_com_api.getValue("grdData_CHARGE", "selected", "voc_no", true) != "") {
    processFileList({});

    }
    
  
}


//------ 파일 리스트 조회
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "EHM" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type
    var dataKey = gw_com_api.getValue("grdData_CHARGE", "selected", "voc_no", true);

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? dataKey : param.data_key) },
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
//------ 파일 추가/수정/Rev
function processFileUpload(param) {


    //if (!checkManipulate({})) return;
    //if (!checkUpdatable({ check: true })) return false;

    //v_global.event.data = {
    //    type: "EHM",
    //    key: gw_com_api.getValue("grdData_CHARGE", "selected", "voc_no", true),
    //    seq: 0,
    //user: gw_com_module.v_Session.USR_ID,
    //crud: "C",
    //biz_area: "공통",
    //doc_area: "99"
    //};
    //var args = {
    //    page: "DLG_FileUpload",
    //    param: {
    //        ID: gw_com_api.v_Stream.msg_upload_ASFOLDER,
    //        data: v_global.event.data
    //    }
    //};
    //gw_com_module.dialogueOpen(args);

    // Check Updatable
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // set data for "File Upload"
    var dataType = "EHM";    // Set File Data Type

    // add by kyt 2021-06-03
    var dataKey = gw_com_api.getValue("grdData_CHARGE", "selected", "voc_no", true);
    var dataSeq = 0;
    var biz_area = '공통';
    var doc_area = '99';
    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = {
        data_tp: dataType, data_key: dataKey, data_seq: dataSeq, user: gw_com_module.v_Session.USR_ID, file_group2: biz_area, file_group3: doc_area }; // additional 
    // set Argument for Dialogue
    var pageArgs = dataType + ":multi" + ":GroupA"; // 1.DataType, 2.파일선택 방식(multi/single), 3.UI Type(Simple/GroupA/ECM)
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 660, height: 500, scroll: true,  // multi( h:350, scroll) / single(h:300) / GroupA(h:500)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);


}

//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_CHARGE" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var ids = gw_com_api.getRowIDs("grdData_CHARGE");
    var changed = new Array();
    $.each(ids, function () {
        var crud = gw_com_api.getDataStatus("grdData_CHARGE", this, true);
        if (crud == "U") {
            var voc_no = gw_com_api.getValue("grdData_CHARGE", this, "voc_no", true);
            var charge_seq = gw_com_api.getValue("grdData_CHARGE", this, "charge_seq", true);

            // 메일 발송용
            changed.push({ voc_no: voc_no, charge_seq: charge_seq })

            // 처리내용 HTML 데이터 저장
            if (args.param == undefined)
                args.param = [{
                    query: "VOC_1020_5",
                    row: []
                }];
            args.param[0].row.push({
                crud: gw_com_api.getValue("grdData_CHARGE", this, "result_memo_crud", true),
                column: [
                    { name: "voc_no", value: voc_no },
                    { name: "memo_seq", value: charge_seq },
                    { name: "memo_cd", value: "RESULT" },
                    { name: "memo", value: gw_com_api.getValue("grdData_CHARGE", this, "result_memo", true) }
                ]
            })
        }
    });
    args.handler = {
        success: successSave,
        param: changed
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    // 처리입력 메일 발송
    var key = "";
    $.each(param, function (i, v) {
        key += ((key == "" ? "" : "|") + v.voc_no + "^" + v.charge_seq);
    });
    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_vocSendMail",
        input: [
            { name: "type", value: "VOC_ALARM05", type: "varchar" },
            { name: "key_no", value: key, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_msg", type: "varchar" }
        ]
    };
    gw_com_module.callProcedure(args);
    //----------
    processRetrieve({ key: response });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_CHARGE" },
            { type: "FORM", id: "frmData_CHARGE" },
            { type: "GRID", id: "grdData_PROD" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            { gw_com_module.streamInterface(param); }
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
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                else if (v_global.process.handler != null)
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.arg.element == "ECR") {
                                if (param.data.result == "YES")
                                    processECR(param.data.arg);
                            } else {
                                if (param.data.result == "YES")
                                    processInform(param.data.arg);
                            }
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
        case gw_com_api.v_Stream.msg_selectedTeam:
            {
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "dept_cd",
                                    param.data.dept_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "dept_nm",
                                    param.data.dept_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_EHM:
            {
                processRetrieve({ file: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "DLG_CODE":
                    case "VOC_1041":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                    //changed by kyt 2021-06-03
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
                switch (param.from.page) {
                    case "DLG_CODE":
                        {
                            if (param.data != undefined) {

                                if (checkCRUD(param) == "none") {
                                    var args = {
                                        targetid: "frmData_CHARGE", edit: true, updatable: true,
                                        data: [
                                            { name: "rcpt_date", value: gw_com_api.getDate() },
                                            { name: "rcpt_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                                            { name: "rcpt_dept", value: gw_com_module.v_Session.DEPT_CD },
                                            { name: "rcpt_user_nm", value: gw_com_module.v_Session.USR_NM },
                                            { name: "rcpt_user", value: gw_com_module.v_Session.USR_ID },
                                            { name: "cust_nm", value: param.data.dname },
                                            { name: "cust_cd", value: param.data.dcode },
                                            { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
                                            { name: "stat_filter", value: "A" }     // 처리상태 공통코드 필터용
                                        ],
                                        clear: [
                                            { type: "GRID", id: "grdData_PROD" },
                                            { type: "GRID", id: "grdData_CHARGE" },
                                            { type: "GRID", id: "grdData_FileA" }
                                        ]
                                    };
                                    gw_com_module.formInsert(args);
                                } else {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, param.data.dcode, (v_global.event.type == "GRID"));
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, param.data.dname, (v_global.event.type == "GRID"));
                                }

                            }
                        }
                        break;
                    //add by kyt 2021-06-03
                    case "SYS_FileUpload": {
                        processFileList({});
                    } break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "result_memo", param.data.html, (v_global.event.type == "GRID"));
                }
                if (param.from)
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

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//