
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
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = { type: "PAGE", page: "w_edit_memo", title: "사유", width: 500, height: 300 };
        gw_com_module.dialoguePrepare(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "분류", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "TdrItemTp" }
                    ]
                },
                {
                    type: "PAGE", name: "인도방법", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "TdrItemDlv" }
                    ]
                },
                {
                    type: "PAGE", name: "폐기방법", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "TdrItemCls" }
                    ]
                },
                //{
                //    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                //    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                //},
                {
                    type: "INLINE", name: "열람구분",
                    data: [
                        { title: "EMP", value: "사원" },
                        { title: "DEPT", value: "부서" }
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
            v_global.logic.key = gw_com_api.getPageParameter("tdr_id");

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
            targetid: "lyrRemark",
            row: [
                {
                    name: "TEXT"
                }
            ]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "승인", value: "승인", icon: "기타" },
                { name: "반려", value: "반려", icon: "아니오" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "TDR_1020_1", type: "TABLE", title: "요청 정보",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 90, field: 140 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "요청번호", format: { type: "label" } },
                            { name: "tdr_no" },
                            { name: "tdr_id", hidden: true },
                            { name: "dept_area", hidden: true },
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
                            { name: "rqst_dt", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "rqst_title", style: { colspan: 3 },
                                format: { width: 382 }
                            },
                            { header: true, value: "제3자 제공", format: { type: "label" } },
                            {
                                name: "third_yn", width: 60,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { header: true, value: "승인자", format: { type: "label" } },
                            { name: "appr_user_nm" },
                            { header: true, value: "승인(반려)일", format: { type: "label" } },
                            { name: "appr_date", mask: "date-ymd" },
                            { name: "rqst_yn", hidden: true },
                            { name: "rqst_yn_nm", hidden: true },
                            { name: "appr_user", hidden: true },
                            { name: "appr_yn", hidden: true },
                            { name: "supp_yn", hidden: true },
                            { name: "return_rmk", hidden: true },
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
            targetid: "grdData_SUB", query: "TDR_1020_2", title: "요청 자료",
            caption: true, height: 100, pager: true, show: true, number: true, selectable: "true",
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
                {
                    header: "제3자제공", name: "third_yn", width: 100, align: "center", hidden: true,
                    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                },
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
            targetid: "grdData_DETAIL1", query: "TDR_1020_3", title: "협력사 정보",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            element: [
                { header: "협력사명", name: "supp_nm", width: 300 },
                { header: "대표자명", name: "prsdnt_nm", width: 120 },
                { header: "수신자명", name: "emp_nm", width: 120 },
                { header: "부서", name: "dept_nm", width: 150 },
                { header: "직함", name: "pos_nm", width: 100 },
                { header: "E-Mail", name: "email", width: 300 },
                //{
                //    header: "제3자제공", name: "third_ok", width: 70, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                //    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                //},
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
            targetid: "grdData_THIRD", query: "TDR_1020_7", title: "제3자 제공동의",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            element: [
                { name: "third_nm", header: "회사명", width: 100, editable: { type: "hidden" } },
                { name: "dept_nm", header: "소속", width: 100, editable: { type: "hidden" } },
                { name: "emp_nm", header: "성명", width: 60, editable: { type: "hidden" } },
                { name: "third_rmk", header: "사유", width: 280, editable: { type: "hidden" } },
                { name: "third_id", hidden: true },
                { name: "tdr_no", hidden: true },
                { name: "editable", hidden: true }
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
        var args = { targetid: "lyrMenu", element: "승인", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "반려", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "승인":
                    {
                        if (!checkManipulate({})) return;
                        var act = (param.element == "승인" ? "Approval" : "Return");
                        processBatch({ act: act, option: "" });
                    }
                    break;
                case "반려":
                    {
                        if (!checkManipulate({})) return;
                        // 사유 입력
                        processMemo({});
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
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
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: v_global.logic.key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ],
        handler_complete: completeRetrieve
    };
    gw_com_module.objRetrieve(args);

}
//----------
function completeRetrieve(param) {

    v_global.logic.rqst_yn = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn");
    v_global.logic.appr_yn = gw_com_api.getValue("frmData_MAIN", 1, "appr_yn");
    v_global.logic.supp_yn = gw_com_api.getValue("frmData_MAIN", 1, "supp_yn");

    assignLabel({});
    toggleButton({});
    linkRetrieve({});

}
//----------
function linkRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_id") },
                { name: "arg_tdr_no", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
                { name: "arg_item_id", value: "0" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_SUB" },
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

    //v_global.event.object = "frmData_MAIN";
    //v_global.event.row = "1";
    //v_global.event.element = "return_rmk";
    //v_global.event.type = "FORM";
    var sdata = {
        edit: true, rows: 3, maxlength: 200, title: "반려 사유",
        text: ""
    };
    var args = {
        page: "w_edit_memo",
        param: { ID: gw_com_api.v_Stream.msg_edit_Memo, data: sdata, act: param.act }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processBatch(param) {

    if (param.option == "NoneRmk") return;

    if (param.option == "NeesMemo") {
        processMemo(param); return; // 사유 입력 후 processBatch 실행됨
    }

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_TDR_Request",
        input: [
            { name: "JobCd", value: param.act, type: "varchar" },
            { name: "UserId", value1: gw_com_api.getValue("frmData_MAIN", 1, "appr_user"), type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_id"), type: "int" },
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

    //processRetrieve({});

    refreshPage({ page: "TDR_1010" });
    processClose({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
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
function assignLabel(param) {

    if (v_global.logic.appr_yn == "1")
        v_global.logic.remark = "요청 승인";
    else if (v_global.logic.appr_yn == "R")
        v_global.logic.remark = "요청 반려";
    else if (v_global.logic.rqst_yn == "0")
        v_global.logic.remark = "요청 대기";
    else
        v_global.logic.remark = "작성 중";

    var args = {
        targetid: "lyrRemark",
        row: [
            {
                name: "TEXT",
                value: " [상태 : " + v_global.logic.remark + "]"
            }
        ]
    };
    gw_com_module.labelAssign(args);

}
//----------
function toggleButton(param) {

    if (v_global.logic.appr_yn == "1") {
        gw_com_api.hide("lyrMenu", "승인");
        gw_com_api.hide("lyrMenu", "반려");
    }
    else if (v_global.logic.appr_yn == "R") {
        gw_com_api.hide("lyrMenu", "승인");
        gw_com_api.hide("lyrMenu", "반려");
    }
    else if (v_global.logic.rqst_yn == "0") {
        gw_com_api.show("lyrMenu", "승인");
        gw_com_api.show("lyrMenu", "반려");
    }
    else {
        gw_com_api.hide("lyrMenu", "승인");
        gw_com_api.hide("lyrMenu", "반려");
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
                                processSave(param.data.arg);
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
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
                if (param.data.update) {
                    var rmk = param.data.text.substring(0, 200);
                    closeDialogue({ page: param.from.page });
                    if (rmk == "") return;
                    processBatch({ act: "Return", option: rmk });
                    //gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.text.substring(0, 200), (v_global.event.type == "GRID"));
                    //gw_com_api.setValue(v_global.event.object, v_global.event.row, "rmk_edit", (param.data.text == "" ? "등록" : "편집"), (v_global.event.type == "GRID"));
                }

            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//