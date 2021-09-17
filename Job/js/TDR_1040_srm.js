
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = { type: "PAGE", page: "w_edit_memo", title: "사유", width: 500, height: 300, locate: ["center", 200] };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.logic.key1 = gw_com_api.getPageParameter("tdr_id");
        v_global.logic.key2 = gw_com_api.getPageParameter("supp_id");
        v_global.logic.user_id = gw_com_api.getPageParameter("user_id");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "전송자", query: "TDR_1040_SUPPLIST",
                    param: [
                        { argument: "arg_tdr_id", value: v_global.logic.key1 },
                        { argument: "arg_supp_id", value: v_global.logic.key2 },
                        { argument: "arg_user_id", value: v_global.logic.user_id }
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

        //== Header Remark
        var args = {
            targetid: "lyrRemark", row: [{ name: "TEXT" }]
        }; gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "저장" },
                { name: "전송", value: "전송", icon: "기타", updatable: true },
                { name: "반려", value: "반려", icon: "아니오", updatable: true },
                { name: "양식", value: "요청서 출력", icon: "출력" },
                //{ name: "도움말", value: "도움말", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //----------
        $("#lyrMenu_양식2").attr("title", "승인된 요청서 및 제3자 제공승낙서에 대한 출력");
        //=====================================================================================
        //var args = {
        //    targetid: "lyrMenu_SUB", type: "FREE",
        //    element: [
        //        { name: "전체동의", value: "전체 동의", icon: "기타", updatable: true }
        //    ]
        //};
        ////----------
        //gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "TDR_1040_1", type: "TABLE", title: "기술자료 요청서",
            caption: false, show: true, selectable: true,
            editable: { bind: "editable", focus: "supp_id", validate: true },
            content: {
                width: { label: 90, field: 140 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "요청번호", format: { type: "label" } },
                            { name: "tdr_no", editable: { type: "hidden" } },
                            { name: "tdr_id", editable: { type: "hidden" }, hidden: true },
                            { name: "dept_area", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "목적분류", format: { type: "label" } },
                            { name: "purpose_nm" },
                            { header: true, value: "편집권한", format: { type: "label" } },
                            {
                                name: "edit_yn", width: 60,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "rqst_user_nm" },
                            { header: true, value: "작성일", format: { type: "label" } },
                            { name: "rqst_date", mask: "date-ymd" },
                            { name: "rqst_user", hidden: true },
                            { name: "rqst_yn", hidden: true },
                            { name: "rmk", hidden: true },
                            { name: "rqst_dt", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            { name: "rqst_title", style: { colspan: 3 }, format: { width: 400 } },
                            { header: true, value: "제3자 제공", format: { type: "label" } },
                            {
                                name: "third_yn", width: 60,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { header: true, value: "전송자", format: { type: "label" } },
                            {
                                name: "supp_id",
                                format: { type: "select", data: { memory: "전송자" } },
                                editable: { type: "select", data: { memory: "전송자" }, validate: { rule: "required" } }
                            },
                            { header: true, value: "전송일", format: { type: "label" } },
                            { name: "send_date", mask: "date-ymd" },
                            { name: "user_id", hidden: true },
                            { name: "editable", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제공상태", format: { type: "label" } },
                            { name: "pstat_nm" },
                            { header: true, value: "비고(사유)", format: { type: "label" } },
                            { name: "rmk", style: { colspan: 7 }, format: { width: 800 } },
                            { name: "supp_yn", hidden: true }
                        ]
                    }
                ]
            }
        }; gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "TDR_1040_2", title: "요청 자료",
            caption: true, height: 100, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true },
            element: [
                { header: "분류", name: "item_group_nm", width: 100 },
                { header: "자료명", name: "item_nm", width: 250 },
                { header: "인도방법", name: "dlv_tp_nm", width: 80 },
                { header: "인도기한", name: "dlv_ymd", width: 100, align: "center", mask: "date-ymd" },
                { header: "폐기(반환)방법", name: "close_tp_nm", width: 80 },
                { header: "폐기(반환)일", name: "close_ymd", width: 100, align: "center", mask: "date-ymd" },
                {
                    header: "유/무상", name: "free_yn", width: 80, align: "center",
                    format: { type: "radio", child: [{ title: "유상", value: "0" }, { title: "무상", value: "1" }] }
                },
                //{
                //    header: "무상", name: "free_yn", width: 100, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                //    //,editable: { type: "radio", child: [{ title: "유상", value: "0" }, { title: "무상", value: "1" }] }
                //},
                {
                    header: "첨부파일", name: "file_add", width: 60, align: "center",
                    format: { type: "link", value: "파일추가" }
                },
                {
                    header: "제공동의", name: "supp_ok", width: 60, align: "center", hidden: true,
                    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                },
                { name: "rmk", hidden: true, editable: { type: "hidden" } },
                { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                { name: "tdr_id", hidden: true, editable: { type: "hidden" } },
                { name: "supp_id", hidden: true, editable: { type: "hidden" } },
                { name: "item_id", hidden: true, editable: { type: "hidden" } },
                { name: "editable", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "파일추가", value: "파일 추가", icon: "추가", updatable: true },
                { name: "파일삭제", value: "파일 삭제", icon: "삭제", updatable: true },
                { name: "전체", value: "전체 목록 보기", icon: "조회" }
            ]
        }; gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "TDR_1040_FILE", title: "첨부 파일",
            caption: true, height: 100, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true },
            element: [
                //{
                //    header: "", name: "chk_del", value: "0", width: 30, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" },
                //    editable: { type: "checkbox", value: "1", offval: "0" }
                //},
                { header: "분류", name: "item_group_nm", width: 80 },
                { header: "자료명", name: "item_nm", width: 250 },
                { header: "파일명", name: "file_nm", width: 250 },
                //{ header: "등록자", name: "user_nm", width: 100, hidden: true },
                {
                    header: "파일설명", name: "file_desc", width: 250,
                    editable: { type: "text", maxlength: 100 }
                },
                //{
                //    header: "재요청", name: "root_ver_no", width: 50, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                //    , editable: { type: "hidden" }
                //},
                //{
                //    header: "재등록", name: "root_rev_no", width: 50, align: "center",
                //    format: { type: "link", value: "재등록" }
                //},
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { header: "등록일시", name: "upd_dt", width: 160, align: "center" },
                { header: "data_tp", hidden: true, editable: { type: "hidden" } },
                { header: "data_key", hidden: true, editable: { type: "hidden" } },
                { header: "data_subkey", hidden: true, editable: { type: "hidden" } },
                { header: "data_seq", hidden: true, editable: { type: "hidden" } },
                { header: "data_subkey", hidden: true, editable: { type: "hidden" } },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "editable", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO1", query: "TDR_1020_5", type: "TABLE", title: "기술자료제공요청 목적",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" },
                row: [
                    {
                        element: [
                            {
                                name: "rmk",
                                format: { type: "textarea", rows: 6 },
                                editable: { type: "textarea", rows: 6, maxlength: 2000 }
                            },
                            { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                            { name: "rmk_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "rmk_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        }; gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_THIRD", query: "TDR_1040_3", title: "제3자 제공동의",
            caption: true, height: 70, pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true },
            element: [
                { name: "third_nm", header: "회사명", width: 100, editable: { type: "hidden" } },
                { name: "dept_nm", header: "소속", width: 70, editable: { type: "hidden" } },
                { name: "emp_nm", header: "성명", width: 50, editable: { type: "hidden" } },
                { name: "rmk_view", hidden: true },
                { name: "third_rmk", header: "사유", width: 240, editable: { type: "hidden" } },
                //{ name: "rmk_view", header: "사유", width: 80, align: "center", format: { type: "link", value: "보기" } },
                { name: "down_form", header: "동의서 양식", width: 80, align: "center", format: { type: "link" } },
                { name: "down_file", header: "동의서 출력", width: 80, align: "center", format: { type: "link" } }, //, value: "출력"
                { name: "upload", header: "동의서", width: 80, align: "center", format: { type: "link", value: "업로드" } },
                { name: "third_id", hidden: true, editable: { type: "hidden" } },
                { name: "supp_id", hidden: true, editable: { type: "hidden" } },
                { name: "supp_rmk", hidden: true, editable: { type: "hidden" } },
                { name: "file_id", hidden: true },
                { name: "third_ok", hidden: true, editable: { type: "hidden" } },
                //{ name: "third_rmk", hidden: true },
                { name: "editable", hidden: true }
            ]
        }; gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_INFORM", query: "TDR_1040_9", type: "TABLE", title: "",
            caption: false, show: true, fixed: true, selectable: true,
            content: {
                width: { field: "100%" },
                row: [
                    {
                        element: [
                            { name: "html", format: { type: "html", height: 400, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "GRID", id: "grdData_THIRD", offset: 8 },
                { type: "FORM", id: "frmData_INFORM", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();
        //=====================================================================================
        var args = { type: "PAGE", page: "DLG_UploadFile", title: "파일 업로드", datatype: "EDM-TR", width: 660, height: 220 };
        gw_com_module.dialoguePrepare(args);
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "전송", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "반려", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "양식", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "도움말", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "lyrMenu_SUB", element: "전체동의", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, element: "file_add", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "파일추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "파일삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "전체", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FILE", grid: true, element: "delete", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_THIRD", grid: true, element: "rmk_view", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_THIRD", grid: true, element: "down_form", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_THIRD", grid: true, element: "down_file", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_THIRD", grid: true, element: "upload", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "삭제":
                    {
                        if (!checkManipulate({})) return;
                        var obj = "grdData_" + param.object.split("_")[1];
                        var args = { targetid: obj, row: "selected", select: true };
                        gw_com_module.gridDelete(args);
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "전송":
                    {
                        if (!checkManipulate({})) return;
                        var chkOK = true;

                        if (gw_com_api.getRowCount("grdData_THIRD") > 0) {
                            var ids = gw_com_api.getRowIDs("grdData_THIRD");
                            $.each(ids, function () {
                                if (gw_com_api.getValue("grdData_THIRD", this, "file_id", true) == "") {
                                    gw_com_api.messageBox([{ text: "제3자 동의서를 업로드해 주십시오." }]);
                                    chkOK = false;
                                    return false;
                                }
                            })
                        }

                        if (chkOK) {
                            var args = { handler: processAct, param: { act: "Send", option: "" } };
                            gw_com_api.messageBox([
                                { text: "본인은 기술자료제공요청서에 따라 기술자료를 제공함에 있어" },
                                { text: "회사로부터 적법한 권한을 부여 받았음을 확인합니다." }
                            ], 450, gw_com_api.v_Message.msg_confirmSend, "YESNO", args);
                        }
                    }
                    break;
                case "반려":
                    {
                        checkSendable({});
                    }
                    break;
                case "양식":
                    {
                        processExport({ type: "rpt2" });    //요청서
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "file_add":
                case "파일추가":
                    {
                        if (!checkManipulate({})) return;
                        checkUploadable({});
                    }
                    break;
                case "파일삭제":
                case "delete":
                    {
                        if (!checkManipulate({})) return;
                        var row = gw_com_api.getSelectedRow("grdData_FILE");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "삭제할 데이터가 선택되지 않았습니다." }]);
                            return;
                        }
                        var msg = [{ text: "파일을 삭제하시겠습니까?" }];
			            // 자동 저장 기능으로 전환 필요 by JJJ 2020.01.02
                        //var crud = gw_com_api.getCRUD("grdData_FILE", row, true);
                        //if (crud == "retrieve" || crud == "update") {
                        //    msg.push({ text: "삭제 후 [저장] 버튼을 클릭해야 파일이 완전히 삭제됩니다." });
                        //}
                        var p = {
                            handler: function (param) {
                                var args = { targetid: "grdData_FILE", row: row };  //, check: "editable"
                                gw_com_module.gridDelete(args);
                                processSave({});
                            },
                            param: {
                                row: row
                            }
                        };
                        gw_com_api.messageBox(msg, 480, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);
                    }
                    break;
                case "download":
                    {
                        gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown" });
                    }
                    break;
                //case "delete":
                //    {
                //        gw_com_api.messageBox([{ text: "삭제 후 [저장] 버튼을 클릭해야 파일이 완전히 삭제됩니다." }], 480);
                //        var args = { targetid: param.object, row: param.row, select: true, check: "editable" };
                //        gw_com_module.gridDelete(args);
                //    }
                //    break;
                case "전체":
                    {
                        processLink({ file: true, all: true });
                    }
                    break;
                case "rmk_view":
                    {
                        var args = {
                            page: "w_edit_memo",
                            param: {
                                ID: gw_com_api.v_Stream.msg_edit_Memo,
                                data: {
                                    edit: false, rows: 14,
                                    title: "제3자 제공 사유",
                                    text: gw_com_api.getValue(param.object, param.row, "third_rmk", (param.type == "GRID"))
                                }
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "down_form":
                    {
                        processExport({ type: "rpt1" });    //동의서 양식
                    }
                    break;
                case "down_file":
                    {
                        //동의서 등록 파일
                        if (gw_com_api.getValue(param.object, param.row, "file_id", (param.type == "GRID")) != "")
                            gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown" });
                    }
                    break;
                case "upload":
                    {
                        if (!checkManipulate({})) return;
                        var args = {
                            key: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no"),
                            subkey: "THIRD",
                            seq: gw_com_api.getValue(param.object, param.row, "third_id", (param.type == "GRID")),
                            subseq: gw_com_api.getValue(param.object, param.row, "supp_id", (param.type == "GRID")),
                            third_ok: gw_com_api.getValue(param.object, param.row, "third_ok", (param.type == "GRID"))
                        };
                        checkUploadable2(args);
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            if (param.object == "frmData_MAIN" && param.element == "supp_id") {
                processLink({});
            } else if (param.object == "grdData_SUB" && param.element == "supp_ok") {
                if (param.value.current == "1")
                    gw_com_api.setValue(param.object, param.row, "rmk", "", (param.type == "GRID"));
            }

        }
        //----------
        function processRowselected(param) {

            processLink(param);

        }
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
function checkSendable(param) {

    if (!checkManipulate({})) return;
    var supp_id = gw_com_api.getValue("frmData_MAIN", 1, "supp_id");
    if (supp_id == null || supp_id == "") {
        gw_com_api.messageBox([{ text: "전송자를 선택 후 처리할 수 있습니다." }]);
        return;
    }
    var args = {
        handler: processAct,
        param: {
            act: "Reject", option: "NeedRmk"
        }
    };
    gw_com_api.messageBox([
        { text: "자료 요청을 반려처리하시겠습니까?" },
        { text: "※ 반려처리 후에는 내용을 변경할 수 없습니다." }
    ], 550, gw_com_api.v_Message.msg_confirmSend, "YESNO", args);

}
//----------
function checkUploadable(param) {

    var supp_id = gw_com_api.getValue("frmData_MAIN", 1, "supp_id");
    if (supp_id == null || supp_id == "" || supp_id == "0") {
        gw_com_api.messageBox([{ text: "전송자를 선택 후 파일을 등록할 수 있습니다." }]);
        return;
    }
    var row = gw_com_api.getSelectedRow("grdData_SUB");
    if (row == null) {
        gw_com_api.messageBox([{ text: "요청 자료(대상)을 선택 후 파일을 등록할 수 있습니다." }]);
        return;
    }

    var args = {
        key: gw_com_api.getValue("grdData_SUB", row, "tdr_no", true),
        subkey: "ITEM",
        seq: gw_com_api.getValue("grdData_SUB", row, "item_id", true),
        subseq: supp_id
    };
    processUploadFile(args);

    //if (gw_com_api.getValue("grdData_SUB", row, "supp_ok", true) == "0") {
    //    var args = {
    //        handler: function (param) {
    //            var args = {
    //                key: gw_com_api.getValue("grdData_SUB", "selected", "tdr_no", true),
    //                subkey: "ITEM",
    //                seq: gw_com_api.getValue("grdData_SUB", "selected", "item_id", true),
    //                subseq: gw_com_api.getValue("frmData_MAIN", 1, "supp_id")
    //            };
    //            processUploadFile(args);
    //        }
    //    };
    //    gw_com_api.messageBox(
    //        [{ text: gw_com_api.getValue("grdData_SUB", "selected", "item_nm", true) + "의 제공에 동의 하십니까?" }],
    //        500, gw_com_api.v_Message.msg_confirmBatch, "YESNO", args
    //    );
    //} else {
    //    var args = {
    //        key: gw_com_api.getValue("grdData_SUB", row, "tdr_no", true),
    //        subkey: "ITEM",
    //        seq: gw_com_api.getValue("grdData_SUB", row, "item_id", true),
    //        subseq: supp_id
    //    };
    //    processUploadFile(args);
    //}

}
//----------
function checkUploadable2(param) {

    if (param.third_ok != "1") {

        var p = {
            handler: function (param) {
                gw_com_api.setValue("grdData_THIRD", "selected", "third_ok", "1", true);
                processUploadFile(param);
            },
            param: param
        };
        gw_com_api.messageBox(
            [{ text: "[" + gw_com_api.getValue("grdData_THIRD", "selected", "third_nm", true) + "]에 자료 제공을 동의 하십니까?" }],
            500, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p
        );

    } else
        processUploadFile(param);

}
//----------
function processUploadFile(param) {

    var args = {
        page: "DLG_UploadFile",
        param: {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: {
                data_tp: "EDM_TDR",
                data_key: param.key,
                data_subkey: param.subkey,
                data_seq: param.seq,
                data_subseq: param.subseq
            }
        }
    };
    //----------
    if (param.subkey == "ITEM") {
        args.param.data.ref = [{
            query: $("#grdData_SUB_data").attr("query"),
            row: [
                {
                    crud: "U",
                    column: [
                        { name: "supp_id", value: param.subseq },
                        { name: "item_id", value: param.seq },
                        { name: "supp_ok", value: "1" },
                        { name: "rmk", value: "" }
                    ]
                }
            ]
        }];
    } else if (param.subkey == "THIRD") {
        args.param.data.ref = [{
            query: $("#grdData_THIRD_data").attr("query"),
            row: [
                {
                    crud: "U",
                    column: [
                        { name: "third_id", value: param.seq },
                        { name: "supp_id", value: param.subseq },
                        { name: "third_ok", value: "1" },
                        { name: "file_id", value: null }
                    ]
                }
            ]
        }];
    }
    //----------
    gw_com_module.dialogueOpen(args);

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

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
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkUpdatable2(param) {

    var updatable = false;
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "GRID", id: "grdData_THIRD" }
        ],
        param: param
    };
    for (var i = 0; i < args.target.length; i++) {
        if (gw_com_api.getUpdatable(args.target[i].id, (args.target[i].type == "GRID"))) {
            updatable = true;
            break;
        }
    }
    return updatable;

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: v_global.logic.key1 },
                { name: "arg_supp_id", value: v_global.logic.key2 },
                { name: "arg_user_id", value: v_global.logic.user_id }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ],
        clear: [
            { type: "GRID", id: "grdData_SUB" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "GRID", id: "grdData_THIRD" },
            { type: "FORM", id: "frmData_INFORM" }
        ],
        handler_complete: completeRetrieve

    };
    gw_com_module.objRetrieve(args);

}
//----------
function completeRetrieve(param) {

    if (gw_com_api.getValue("frmData_MAIN", 1, "editable") == "1") {
        var args = { targetid: "frmData_MAIN", edit: true };
        gw_com_module.formEdit(args);
    }
    v_global.logic.supp_yn = gw_com_api.getValue("frmData_MAIN", 1, "supp_yn");
    v_global.logic.third_yn = gw_com_api.getValue("frmData_MAIN", 1, "third_yn");

    assignLabel({});
    toggleButton({});
    processLink({});

}
//----------
function processLink(param) {

    if (param.third) {

        var key = [{
            QUERY: $("#grdData_THIRD" + "_data").attr("query"),
            KEY: [
                { NAME: "third_id", VALUE: gw_com_api.getValue("grdData_THIRD", "selected", "third_id", true) },
                { NAME: "supp_id", VALUE: gw_com_api.getValue("grdData_THIRD", "selected", "supp_id", true) }
            ]
        }];
        var args = {
            key: key,
            source: {
                type: "FORM", id: "frmData_MAIN",
                element: [
                    { name: "tdr_id", argument: "arg_tdr_id" },
                    { name: "supp_id", argument: "arg_supp_id" },
                    { name: "user_id", argument: "arg_user_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_THIRD" }
            ]
        };
        //----------
        gw_com_module.objRetrieve(args);

    } else if (param.object == "grdData_SUB" || param.file) {

        var args = {
            source: {
                type: "GRID", id: "grdData_SUB", row: "selected",
                element: [{ name: "tdr_no", argument: "arg_tdr_no" }],
                argument: [{ name: "arg_user_id", value: v_global.logic.user_id }]
            },
            target: [
                { type: "GRID", id: "grdData_FILE" }
            ]
        };

        if (param.all)
            args.source.argument.push({ name: "arg_item_id", value: "0" });
        else
            args.source.element.push({ name: "item_id", argument: "arg_item_id" });

        gw_com_module.objRetrieve(args);

    } else {

        if (gw_com_api.getValue("frmData_MAIN", 1, "supp_id") == "" || gw_com_api.getValue("frmData_MAIN", 1, "supp_id") == null) {

            var args = {
                target: [
                    { type: "GRID", id: "grdData_SUB" },
                    { type: "GRID", id: "grdData_FILE" },
                    { type: "GRID", id: "grdData_THIRD" }
                ]
            };
            gw_com_module.objClear(args);

        } else {

            var args = {
                source: {
                    type: "FORM", id: "frmData_MAIN",
                    element: [
                        { name: "tdr_id", argument: "arg_tdr_id" },
                        { name: "supp_id", argument: "arg_supp_id" },
                        { name: "user_id", argument: "arg_user_id" }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdData_SUB", select: true },
                    { type: "FORM", id: "frmData_MEMO1" },
                    { type: "GRID", id: "grdData_THIRD" },
                    { type: "FORM", id: "frmData_INFORM" }
                ],
                clear: [
                    { type: "GRID", id: "grdData_FILE" }
                ]
            };
            //----------
            gw_com_module.objRetrieve(args);

        }
    }

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "GRID", id: "grdData_THIRD" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    if (param.handler != undefined) {
        args.nomessage = true;
        args.handler.param = {
            handler: param.handler,
            param: param.param
        }
    }
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    if (param != undefined) {
        if (param.handler != undefined) {
            param.handler(param.param);
        } else {
            processRetrieve({});
            refreshPage({ page: "TDR_1030" });
        }
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_INFORM" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function processAct(param) {

    var supp_id = gw_com_api.getValue("frmData_MAIN", 1, "supp_id");
    if (supp_id == null || supp_id == "") {
        gw_com_api.messageBox([{ text: "전송자를 선택 후 처리할 수 있습니다." }]);
        return;
    }
    if (checkUpdatable2({})) {
        var args = {
            handler: processBatch,
            param: {
                act: param.act, option: param.option
            }
        };
        processSave(args);
    } else {
        var act = param.act;
        processBatch({ act: act, option: param.option });
    }

}
//----------
function processMemo(param) {

    var sdata = {
        edit: true,
        rows: 4,
        title: "반려 사유", maxlength: 200,
        text: ""
    };
    var args = {
        page: "w_edit_memo",
        param: {
            ID: gw_com_api.v_Stream.msg_edit_Memo,
            data: sdata, act: param.act
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processBatch(param) {

    if (param.option == "NoneRmk") return;

    if (param.option == "NeedRmk") {
        processMemo(param); return; // 사유 입력 후 processBatch 실행됨
    }

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_TDR_Request",
        input: [
            { name: "JobCd", value: param.act, type: "varchar" },
            { name: "UserId", value1: v_global.logic.user_id, type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("grdData_SUB", 1, "supp_id", true), type: "int" },
            { name: "RootNo", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no"), type: "varchar" },
            { name: "Option", value: param.option, type: "varchar" }
        ],
        output: [
            { name: "Rmsg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: {}
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] != "") {

        var msg = new Array();
        $.each(response.VALUE[0].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);

    }
    processRetrieve({});
    refreshPage({ page: "TDR_1030" });

}
//----------
function processExport(param) {

    if (!checkManipulate({})) return;
    if (param.type == "rpt1" && gw_com_api.getSelectedRow("grdData_THIRD") == null) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }
    var args = {
        page: "TDR_1010",
        option: [
            { name: "TYPE", value: param.type },
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: "TDR_1010" },
            { name: "USR_ID", value: gw_com_api.getValue("frmData_MAIN", 1, "user_id") },
            { name: "TDR_ID", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_id") },
            { name: "TDR_NO", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
            { name: "SUPP_ID", value: gw_com_api.getValue("frmData_MAIN", 1, "supp_id") },
            { name: "THIRD_ID", value: (param.type == "rpt1" ? gw_com_api.getValue("grdData_THIRD", "selected", "third_id", true) : "0") }
        ],
        target: { type: "FILE", id: "lyrDown", name: "파일" }
    };
    gw_com_module.objExport(args);

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
function toggleButton(param) {

    gw_com_api.hide("lyrMenu", "저장");

    if (v_global.logic.supp_yn == "A" || v_global.logic.supp_yn == "S") {
        gw_com_api.show("lyrMenu", "전송");
        gw_com_api.show("lyrMenu", "반려");
        gw_com_api.show("lyrMenu_FILE", "파일추가");
        gw_com_api.show("lyrMenu_FILE", "파일삭제");
        if (v_global.logic.third_yn == "1") {
            gw_com_api.show("lyrMenu", "추가");
        } else {
            gw_com_api.hide("lyrMenu", "추가");
        }
    }
    else if (v_global.logic.supp_yn == "T" || v_global.logic.supp_yn == "D") {
        gw_com_api.show("lyrMenu", "전송");
        gw_com_api.show("lyrMenu_FILE", "파일추가");
        gw_com_api.show("lyrMenu_FILE", "파일삭제");
        if (v_global.logic.third_yn == "1") {
            gw_com_api.show("lyrMenu", "추가");
        } else {
            gw_com_api.hide("lyrMenu", "추가");
        }
    }
    else {
        gw_com_api.hide("lyrMenu", "전송");
        gw_com_api.hide("lyrMenu", "반려");
        gw_com_api.hide("lyrMenu_FILE", "파일추가");
        gw_com_api.hide("lyrMenu_FILE", "파일삭제");
        gw_com_api.hide("lyrMenu", "추가");
    }

}
//----------
function assignLabel(param) {

    v_global.logic.remark = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn");
    if (v_global.logic.remark == "T") {
        v_global.logic.remark = gw_com_api.getValue("frmData_MAIN", 1, "rmk");
        if (v_global.logic.remark == "") v_global.logic.remark = " [ 재요청 ] ";
        else v_global.logic.remark = " [ 재요청 사유 ] " + v_global.logic.remark;

        var args = {
            targetid: "lyrRemark",
            row: [ { name: "TEXT", value: v_global.logic.remark } ]
        }; gw_com_module.labelAssign(args);
    }

}
//----------
function refreshPage(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_refreshPage,
        to: {
            type: "MAIN"
        },
        data: {
            page: param.page
        }
    };
    gw_com_module.streamInterface(args);

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
                                processSave(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.handler != undefined) {
                                    if (param.data.arg.param != undefined)
                                        param.data.arg.handler(param.data.arg.param);
                                    else
                                        param.data.arg.handler();
                                }
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.handler != undefined) {
                                    if (param.data.arg.param != undefined)
                                        param.data.arg.handler(param.data.arg.param);
                                    else
                                        param.data.arg.handler();
                                }
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmSend:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.handler != undefined) {
                                    if (param.data.arg.param != undefined) {
                                        param.data.arg.param.result = param.data.result;
                                        param.data.arg.handler(param.data.arg.param);
                                    }
                                }
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
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_UploadFile":
                        {
                            if (param.data != undefined) {
                                switch (param.data[0].data_subkey) {
                                    case "ITEM":
                                        {
                                            gw_com_api.setValue("grdData_SUB", "selected", "supp_ok", "1", true, false, false);
                                            gw_com_api.setValue("grdData_SUB", "selected", "rmk", "", true, false, false);
                                            gw_com_api.setCRUD("grdData_SUB", "selected", "retrieve", true);
                                            processLink({ file: true });
                                        }
                                        break;
                                    case "THIRD":
                                        {
                                            processLink({ third: true });
                                        }
                                        break;
                                }
                            }
                        }
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                if (param.data.update) {
                    var rmk = param.data.text.substring(0, 200);
                    closeDialogue({ page: param.from.page });
                    if (rmk == "") return;
                    processBatch({ act: "Reject", option: rmk });
                    //gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.text.substring(0, 200), (v_global.event.type == "GRID"));
                    //gw_com_api.setValue(v_global.event.object, v_global.event.row, "rmk_edit", (param.data.text == "" ? "등록" : "편집"), (v_global.event.type == "GRID"));
                }

            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//