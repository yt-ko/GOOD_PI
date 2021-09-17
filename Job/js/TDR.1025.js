
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

        // prepare dialogue.
        var args = { type: "PAGE", page: "w_edit_memo", title: "사유", width: 500, height: 200 };
        gw_com_module.dialoguePrepare(args);

        //----------
        v_global.logic.key = gw_com_api.getPageParameter("tdr_id");
        v_global.logic.supp = gw_com_api.getPageParameter("supp_cd");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        start();

        //----------
        function start() {

            //----------
            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
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
        var args = { targetid: "lyrRemark", row: [ { name: "TEXT" } ]
        }; gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "재요청", value: "재요청", icon: "기타" },
                { name: "RPT2", value: "요청서", icon: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        }; gw_com_module.buttonMenu(args);
        //----------
        toggleButton({});
        //----------
        //var args = {
        //    targetid: "lyrMenu_FILE", type: "FREE",
        //    element: [
        //        { name: "재요청", value: "재요청", icon: "기타" }
        //    ]
        //};
        //gw_com_module.buttonMenu(args);
        //=====================================================================================

        var args = {
            targetid: "frmData_MAIN", query: "TDR_1040_1", type: "TABLE", title: "기술자료 요청서",
            caption: false, show: true, selectable: true,
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
                            { header: true, value: "수신자", format: { type: "label" } },
                            { name: "emp_nm" },
                            { header: true, value: "전송일", format: { type: "label" } },
                            { name: "send_date", mask: "date-ymd" },
                            { name: "supp_id", hidden: true },
                            { name: "user_id", hidden: true },
                            { name: "rqst_yn_nm", hidden: true },
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
            targetid: "grdData_SUB", query: "TDR_1020_2", title: "요청 자료",
            caption: true, height: 100, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true },
            element: [
                { header: "분류", name: "item_group_nm", width: 100 },
                { header: "자료명", name: "item_nm", width: 330 },
                { header: "인도방법", name: "dlv_tp_nm", width: 100 },
                { header: "인도기한", name: "dlv_ymd", width: 120, align: "center", mask: "date-ymd" },
                { header: "폐기(반환)방법", name: "close_tp_nm", width: 100 },
                { header: "폐기(반환)일", name: "close_ymd", width: 120, align: "center", mask: "date-ymd" },
                {
                    header: "유/무상", name: "free_yn", width: 100, align: "center",
                    format: { type: "radio", child: [{ title: "유상", value: "0" }, { title: "무상", value: "1" }] }
                },
                //{
                //    header: "무상", name: "free_yn", width: 100, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                //    //,editable: { type: "radio", child: [{ title: "유상", value: "0" }, { title: "무상", value: "1" }] }
                //},
                //{
                //    header: "편집권한", name: "edit_yn", width: 100, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                //},
                { name: "third_yn", hidden: true },
                { name: "edit_yn", hidden: true },
                { name: "tdr_no", hidden: true },
                { name: "item_id", hidden: true },
                { name: "editable", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_DETAIL1", query: "TDR_1025_SUPP", title: "협력사 정보",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            element: [
                { header: "협력사명", name: "supp_nm", width: 300 },
                { header: "대표자명", name: "prsdnt_nm", width: 120 },
                { header: "수신자명", name: "emp_nm", width: 120 },
                { header: "부서", name: "dept_nm", width: 150 },
                { header: "직함", name: "pos_nm", width: 100 },
                { header: "E-Mail", name: "email", width: 300 },
                { name: "third_ok", hidden: true },
                { name: "tdr_no", hidden: true },
                { name: "user_id", hidden: true },
                { name: "user_seq", hidden: true },
                { name: "supp_id", hidden: true },
                { name: "editable", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_DETAIL2", query: "TDR_1020_4", title: "열람권자",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            element: [
                { header: "구분", name: "user_tp_nm", width: 60, align: "center" },
                { header: "성명", name: "user_nm", width: 100 },
                { header: "소속", name: "dept_nm", width: 200 },
                { name: "auth_tp", hidden: true },
                { name: "user_tp", hidden: true },
                { name: "user_id", hidden: true },
                { name: "dept_cd", hidden: true },
                { name: "tdr_no", hidden: true },
                { name: "auth_id", hidden: true },
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
                            { name: "rmk", format: { type: "textarea", rows: 6 } },
                            { name: "tdr_no", hidden: true },
                            { name: "rmk_cd", hidden: true },
                            { name: "rmk_id", hidden: true },
                            { name: "editable", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO2", query: "TDR_1020_6", type: "TABLE", title: "제3자 자료제공 동의 요청",
            caption: true, width: "100%", show: false, selectable: true,
            content: {
                width: { field: "100%" },
                row: [
                    {
                        element: [
                            { name: "rmk", format: { type: "textarea", rows: 3 } },
                            { name: "tdr_no", hidden: true },
                            { name: "rmk_cd", hidden: true },
                            { name: "rmk_id", hidden: true },
                            { name: "editable", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_THIRD", query: "TDR_1025_SUPP_T", title: "제3자 제공동의",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            element: [
                { name: "third_nm", header: "회사명", width: 100, editable: { type: "hidden" } },
                { name: "dept_nm", header: "소속", width: 100, editable: { type: "hidden" } },
                { name: "emp_nm", header: "성명", width: 60, editable: { type: "hidden" } },
                { name: "third_rmk", header: "사유", width: 240, editable: { type: "hidden" } },
                { name: "file_third", header: "동의서", width: 60, align: "center", format: { type: "link" } },
                { name: "third_id", hidden: true },
                { name: "tdr_id", hidden: true },
                { name: "tdr_no", hidden: true },
                { name: "file_id", hidden: true }
            ]
        }; gw_com_module.gridCreate(args);
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
            targetid: "grdList_FILE", query: "TDR_1025_FILE", title: "첨부 파일",
            //caption: false, height: 100, pager: true, show: true, number: true, selectable: true,
            caption: true, height: 100, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true },
            element: [
                { header: "분류", name: "item_group_nm", width: 80 },
                { header: "자료명", name: "item_nm", width: 200 },
                { header: "파일명", name: "file_nm", width: 200 },
                { header: "파일설명", name: "file_desc", width: 200 },
                {
                    header: "다운로드", name: "download", width: 54, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                //{
                //    header: "재요청", name: "root_ver_no", width: 50, align: "center",
                //    format: { type: "checkbox", value: 1, offval: 0, title: "" },
                //    editable: { type: "checkbox", value: 1, offval: 0, title: "" }
                //},
                //{
                //    header: "재등록", name: "root_rev_no", width: 50, align: "center",
                //    format: { type: "link" }
                //},
                { header: "등록일시", name: "upd_dt", width: 160, align: "center" },
                //{ header: "등록자", name: "user_nm", width: 100 },
                { header: "data_tp", hidden: true },
                { header: "data_key", hidden: true },
                { header: "data_subkey", hidden: true },
                { header: "data_seq", hidden: true },
                { header: "data_subkey", hidden: true },
                { name: "file_id", hidden: true },
                { header: "file_path", hidden: true },
                { header: "view_nm", hidden: true }
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
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_DETAIL1", offset: 8 },
                { type: "GRID", id: "grdData_DETAIL2", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "FORM", id: "frmData_MEMO2", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 },
                { type: "GRID", id: "grdData_THIRD", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "재요청", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "RPT2", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu_FILE", element: "재요청", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "전체", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdList_FILE", grid: true, element: "download", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_THIRD", grid: true, element: "file_third", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "재요청":
                    {
                        var args = { handler: processMemo, param: { act: "reTry", edit: true, next: true } };
                        gw_com_api.messageBox(
                            [{ text: param.element + " 처리하시겠습니까?" }], 420,
                            gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
                    }
                    break;
                case "마감":
                    {
                        var args = {
                            handler: processBatch, param: { act: "End", option: "" }
                        };
                        gw_com_api.messageBox(
                            [{ text: param.element + " 처리하시겠습니까?" }], 420,
                            gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
                    }
                    break;
                case "RPT2":
                    {
                        processExport({ type: "rpt2" });    //요청서
                    }
                    break;
                case "전체":
                    {
                        processRowselected({ file: true, all: true });
                    }
                    break;
                case "file_third":
                    {
                        processFileThird(param);
                    }
                    break;
                case "download":
                    {
                        gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown", view: true });
                    }
                    break;
            }

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
function processRowselected(param) {

    if (param.object == "grdData_SUB" || param.file) {

        var nRow = (param.first) ? 1 : "selected";
        var args = {
            source: {
                type: "GRID", id: "grdData_SUB", row: nRow,
                element: [{ name: "tdr_no", argument: "arg_tdr_no" }],
                argument: [{ name: "arg_user_id", value: v_global.logic.supp }]
            },
            target: [
                { type: "GRID", id: "grdList_FILE" }
            ]
        };

        if (param.all)
            args.source.argument.push({ name: "arg_item_id", value: "0" });
        else
            args.source.element.push({ name: "item_id", argument: "arg_item_id" });

        gw_com_module.objRetrieve(args);

    }

}
//----------
function processFileThird(param) {

    gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown", view: false });

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: v_global.logic.key },
                { name: "arg_user_id", value: v_global.logic.supp }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ],
        clear: [
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdList_FILE" },
            { type: "GRID", id: "grdData_THIRD" }
        ],
        handler_complete: completeRetrieve
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processExport(param) {

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
function completeRetrieve(param) {

    v_global.logic.rqst_yn = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn");
    v_global.logic.appr_yn = gw_com_api.getValue("frmData_MAIN", 1, "appr_yn");
    v_global.logic.supp_yn = gw_com_api.getValue("frmData_MAIN", 1, "supp_yn");

    assignLabel({});
    toggleButton({});
    linkRetrieve({});
    //processRowselected({ file: true, a: true });
}
//----------
function toggleButton(param) {

    gw_com_api.hide("lyrMenu", "재요청");
    gw_com_api.hide("lyrMenu", "마감");

    var sRqstYn = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn");
    var sRqstUser = gw_com_api.getValue("frmData_MAIN", 1, "rqst_user");
    // 요청자만 재요청 및 마감 가능
    if (sRqstUser == gw_com_module.v_Session.USR_ID) {
        if (sRqstYn == "1" || sRqstYn == "T") {
            gw_com_api.show("lyrMenu", "재요청");
            gw_com_api.show("lyrMenu", "마감");
        }
    }

}
//----------
function linkRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_id") },
                { name: "arg_tdr_no", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
                { name: "arg_item_id", value: "0" },
                { name: "arg_supp_cd", value: v_global.logic.supp }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_SUB", select: true },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processMemo(param) {

    if (param.act == "reTry") {
        v_global.process.handler = processBatch,
        v_global.process.param = { act: param.act + v_global.logic.supp, option: "" };
        v_global.event.data = {
            edit: param.edit, rows: 3, maxlength: 200, title: "재요청 사유",
            text: "",
        };
    }
    else {
        v_global.event.object = "grdData_THIRD";
        v_global.event.row = "selected";
        v_global.event.element = "third_rmk";
        v_global.event.type = "GRID";
        v_global.event.data = {
            edit: param.edit, rows: 3, maxlength: 200, title: "제3자 제공 사유",
            text: gw_com_api.getValue("grdData_THIRD", "selected", "third_rmk", true)
        };
    }
    var args = {
        page: "w_edit_memo",
        param: { ID: gw_com_api.v_Stream.msg_edit_Memo, data: v_global.event.data }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
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
function assignLabel(param) {

    v_global.logic.remark = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn_nm");
    var args = { targetid: "lyrRemark",
        row: [
            { name: "TEXT", value: " [요청상태 : " + v_global.logic.remark + "]" }
        ]
    }; gw_com_module.labelAssign(args);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_TDR_Request",
        input: [
            { name: "JobCd", value: param.act, type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_id"), type: "int" },
            { name: "RootNo", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no"), type: "varchar" },
            { name: "Option", value: param.option, type: "varchar" }
        ],
        output: [
            { name: "Rmsg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: { "act": param.act }
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

    refreshPage({ page: "TDR_1010" });

    //processRetrieve({});
    processClose({});

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
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined) param.data.arg.handler();
                                    else param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                var rmk = param.data.text.substring(0, 200);
                closeDialogue({ page: param.from.page });

                if (v_global.process.handler != null) {
                    if (rmk == "") break;
                    v_global.process.param.option = rmk;
                    v_global.process.handler(v_global.process.param);
                    v_global.process.handler = null; v_global.process.param = null;
                }

            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//