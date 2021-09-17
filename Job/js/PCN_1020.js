//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
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

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "진행상태",
                    data: [
                        { title: "요청", value: "요청" },
                        { title: "접수", value: "접수" }
                    ]
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                //{ name: "저장", value: "저장" },
                //{ name: "담당", value: "담당지정", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "장비군", unshift: (gw_com_module.v_Session.DEPT_AUTH == "ALL" ? [{ title: "전체", value: "" }] : []) } }
                            },
                            {
                                name: "supp_nm", label: { title: "협력사명 :" }, mask: "search",
                                editable: { type: "text", size: 18, maxlength: 50 }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "PCN_1020_1", title: "변경점 승인 요청 현황",
            caption: false, height: 460, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, multi: true, bind: "_edit_yn", focus: "pstat", validate: true },
            element: [
                {
                    header: "관리번호", name: "issue_no", width: 80, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "장비군", name: "dept_area_nm", width: 60 },
                { header: "협력사명", name: "comp_nm", width: 100 },
                { header: "작성일", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
                {
                    header: "진행상태", name: "pstat", width: 60, align: "center",
                    editable: { type: "hidden" }
                    //editable: { type: "select", data: { memory: "진행상태" } }
                },
                {
                    header: "상세", name: "astat", width: 60, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "요청자", name: "rqst_user_nm", width: 60, align: "center" },
                { header: "E-Mail", name: "rqst_user_email", width: 100 },
                { header: "제목", name: "issue_title", width: 250 },
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 170 },
                { header: "담당부서", name: "prc_dept_nm", width: 100 },
                { header: "담당자", name: "prc_user_nm", width: 60, align: "center" },
                //{ header: "협력사", name: "prc_supp_nm", width: 150 },
                { header: "완료예정일", name: "plan_dt", width: 80, align: "center", mask: "date-ymd" },
                //{ name: "astat", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "담당", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processSetButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowdblclick", handler: popupDetail };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "조회":
            {
                viewOption({});
            }
            break;
        case "실행":
            {
                v_global.process.handler = processRetrieve;
                if (!checkUpdatable({})) return;
                processRetrieve(param);
            }
            break;
        case "저장":
            {
                processSave({});
            }
            break;
        case "접수":
        case "반려":
        case "요청":
            {
                var pstat = param.element;
                if (gw_com_api.getSelectedRow("grdData_MAIN") < 1) return;
                if (gw_com_api.getValue("grdData_MAIN", "selected", "_edit_yn", true) == "0") return;
                //if (gw_com_api.getValue("grdData_MAIN", "selected", "pstat", true) != "요청") return;
                if (gw_com_api.getValue("grdData_MAIN", "selected", "pstat", true) == pstat) return;
                var astat = pstat == "접수" ? "구매접수" : pstat == "반려" ? "요청반려" : "요청";
                var issue_no = gw_com_api.getValue("grdData_MAIN", "selected", "issue_no", true);
                var args = {
                    url: "COM",
                    user: gw_com_module.v_Session.USR_ID,
                    param: [{
                        query: gw_com_api.getAttribute("grdData_MAIN_data", "query"),
                        row: [{
                            crud: "U",
                            column: [
                                { name: "issue_no", value: issue_no },
                                { name: "pstat", value: pstat },
                                { name: "astat", value: astat }
                            ]
                        }]
                    }],
                    handler: {
                        success: successSave,
                        param: {
                            issue_no: issue_no,
                            pstat: pstat,
                            astat: astat
                        }
                    }
                };
                gw_com_module.objSave(args);
            }
            break;
        case "담당":
            {
                if (!checkUpdatable({ check: true })) return false;
                processBatch({});
            }
            break;
        case "닫기":
            {
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "supp_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "supp_cd", "");
        }
    } else if (param.object == "grdData_MAIN") {
        if (param.value.current == "접수")
            gw_com_api.setValue(param.object, param.row, "astat", "구매접수", true);
        else
            gw_com_api.setValue(param.object, param.row, "astat", "요청", true);
    }

}
//----------
function processSave(param) {

    if (gw_com_api.getSelectedRow("grdData_MAIN") == null) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
        return false;
    }

    var ProcStat = gw_com_api.getValue("grdData_MAIN", "selected", "pstat", true);

    if (ProcStat == "요청" || ProcStat == "접수") {
        //// 상태 변경
        //gw_com_api.setValue("grdData_MAIN", "selected", "pstat", "접수", true);
        //gw_com_api.setValue("grdData_MAIN", "selected", "astat", "구매접수", true);

        // DB 저장
        var args = { target: [{ type: "GRID", id: "grdData_MAIN" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        args.url = "COM";
        args.handler = { success: successSave };
        gw_com_module.objSave(args);
    }
    else {
        gw_com_api.messageBox([{ text: "접수가능 상태가 아닙니다." }], 300);
        return false;
    }

    return true;
}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

    if (param != undefined) {
        if (param.pstat == "반려") {
            // 반려메일
            var args = {
                url: "COM",
                subject: MailInfo.getSubject({ type: "PCN_1020_R", issue_no: param.issue_no }),
                body: MailInfo.getBody({ type: "PCN_1020_R", issue_no: param.issue_no }),
                to: MailInfo.getTo({ type: "PCN_1020_R", issue_no: param.issue_no }),
                cc: MailInfo.getCc({ type: "PCN_1020_R", issue_no: param.issue_no }),
                edit: true
            };
            gw_com_module.sendMail(args);
        }
        else if (param.pstat == "접수") {
            processBatch(param);
        }
    }
}
//----------
function processReject() {

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "supp_cd", argument: "arg_comp_cd" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "supp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processBatch(param) {

    var issue_no = param && param.issue_no ? param.issue_no : gw_com_api.getValue("grdData_MAIN", "selected", "issue_no", true);
    var astat = param && param.astat ? param.astat : gw_com_api.getValue("grdData_MAIN", "selected", "astat", true);
    if (issue_no == undefined || issue_no == "undefined" || issue_no == "") return;

    if ($.inArray(astat, ["구매접수", "검토반려", "담당자변경"]) == -1) {
        gw_com_api.messageBox([{ text: "[" + astat + "]상태이므로 담당자를 지정할 수 없습니다." }], 500);
        return;
    }

    var args = {
        type: "PAGE", page: "PCN_1021", title: "담당 지정",
        width: 800, height: 500, locate: ["center", 100], open: true,
        id: gw_com_api.v_Stream.msg_openedDialogue,
        data: {
            issue_no: issue_no
        }
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: args.data } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSearch(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "supp_nm":
            {
                var args = {
                    type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                    width: 600, height: 450, open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_SUPPLIER",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectSupplier
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }


}
//----------
function popupDetail(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
            type: "MAIN"
        },
        data: {
            page: "PCN_1010_VIEW",
            title: "PCN 정보",
            param: [
                { name: "AUTH", value: "R" },
                { name: "issue_no", value: gw_com_api.getValue("grdData_MAIN", "selected", "issue_no", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processSetButton(param) {

    var args = {
        targetid: "lyrMenu", type: "FREE",
        element: [
            { name: "닫기", value: "닫기" }
        ]
    };
    //=====================================================================================

    var ele = [{ name: "조회", value: "조회", act: true }];
    switch (gw_com_api.getValue("grdData_MAIN", "selected", "astat", true)) {
        case "요청":
            {
                ele[ele.length] = { name: "접수", value: "접수", icon: "예" };
                //ele[ele.length] = { name: "반려", value: "접수반려", icon: "아니오" };
            }
            break;
        case "구매접수":
        case "담당자변경":
            {
                ele[ele.length] = { name: "요청", value: "접수취소", icon: "아니오" };
                ele[ele.length] = { name: "담당", value: "담당자지정", icon: "기타" };
            }
            break;
    }
    //-----------------------
    if (ele.length > 0)
        args.element = ele.concat(args.element);
    //-----------------------
    gw_com_module.buttonMenu(args);
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================



}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                                processSave(param.data.arg);
                            else
                                v_global.process.handler(param.data.arg);
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }   // End of switch (param.data.ID)
            } break;    // End of case gw_com_api.v_Stream.msg_resultMessage
        case gw_com_api.v_Stream.msg_retrieve:
            {
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "DLG_SUPPLIER":
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        break;
                    case "PCN_1021":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            issue_no: gw_com_api.getValue("grdData_MAIN", "selected", "issue_no", true)
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "PCN_1021":
                        if (param.data != undefined) {
                            var key = [{
                                QUERY: "PCN_1020_1",
                                KEY: [
                                    { NAME: "issue_no", VALUE: param.data.issue_no }
                                ]
                            }]
                            processRetrieve({ key: key });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
                    v_global.event.row,
                    "supp_cd",
                    param.data.supp_cd,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                    v_global.event.row,
                    "supp_nm",
                    param.data.supp_nm,
                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//