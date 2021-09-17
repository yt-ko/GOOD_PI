//------------------------------------------
// RNS Rule 등록/수정
//------------------------------------------
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var gw_job_process = {

    ready: function () {

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        //var args = { type: "PAGE", page: "RNS_2010_DEPT", title: "배포부서", width: 500, height: 400 };
        //gw_com_module.dialoguePrepare(args);

        // set data.
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_part",
                    param: [{ argument: "arg_type", value: "RNS" }]
                },
                { type: "PAGE", name: "분류", query: "DDDW_RNS_TP" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            v_global.logic.rev_tp = "REV";    // rev_tp 기본값:개정
            // 호출 Page로부터 받은 parameter 에 따른 처리
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
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
                { name: "상신", value: "결재상신", icon: "기타" },
                { name: "부서", value: "배포부서설정", icon: "기타" },
                { name: "협력사", value: "협력사열람설정", icon: "기타" },
                //{ name: "복원", value: "이전버전복원", icon: "아니오" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        createDW({ edit: true });
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO", query: "RNS_2011_2", type: "TABLE", title: "주요내용",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { label: 100, field: 100 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "변경 전", format: { type: "label" } },
                            { header: true, value: "변경 후", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            { name: "memo_html_1", format: { type: "html", height: 230, top: 5 } },
                            { name: "memo_text_1", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_html_2", format: { type: "html", height: 230, top: 5 } },
                            { name: "memo_text_2", hidden: true, editable: { type: "hidden" } },
                            { name: "rns_id", hidden: true, editable: { type: "hidden" } },
                            { name: "rev_no", hidden: true, editable: { type: "hidden" } },
                            { name: "memp_tp_1", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_tp_2", hidden: true, editable: { type: "hidden" } },
                            { name: "crud_1", hidden: true, editable: { type: "hidden" } },
                            { name: "crud_2", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //----------
        $("#" + args.targetid + "_memo_html_1_view").css({ "cursor": "hand" });
        $("#" + args.targetid + "_memo_html_1").css({ "cursor": "hand" });
        $("#" + args.targetid + "_memo_html_2_view").css({ "cursor": "hand" });
        $("#" + args.targetid + "_memo_html_2").css({ "cursor": "hand" });
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "RNS_2011_3", title: "첨부파일",
            caption: true, height: 50, pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "_edit_yn", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 500 },
                { header: "등록자", name: "upd_usr_nm", width: 70, align: "center" },
                { header: "부서", name: "upd_dept_nm", width: 80, align: "center" },
                { header: "등록일시", name: "upd_dt", width: 120, align: "center" },
                {
                    header: "설명", name: "file_desc", width: 330,
                    editable: { type: "text" }, hidden: true
                },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MEMO", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        // define event.
        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "상신", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "부서", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "협력사", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "복원", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MEMO", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //var args = { targetid: "frmData_MEMO", event: "itemdblclick", element: "memo_html_2", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "상신":
                    {
                        processApprove({});
                    }
                    break;
                case "부서":
                    {
                        if (gw_com_api.getCRUD("frmData_MAIN") == "create") {
                            gw_com_api.messageBox([
                                { text: "데이터가 먼저 저장되어야 합니다." },
                                { text: "저장하신 후에 실행해 주세요." }]);
                            return;
                        }
                        if (!checkUpdatable({ check: true })) return;
                        v_global.event.data = {
                            rns_id: gw_com_api.getValue("frmData_MAIN", 1, "rns_id"),
                            rev_no: gw_com_api.getValue("frmData_MAIN", 1, "rev_no")
                        };
                        var args = {
                            type: "PAGE", page: "RNS_2010_DEPT", title: "배포부서",
                            width: 500, height: 500, open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "RNS_2010_DEPT",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "협력사":
                    {
                        if (gw_com_api.getCRUD("frmData_MAIN") == "create") {
                            gw_com_api.messageBox([
                                { text: "데이터가 먼저 저장되어야 합니다." },
                                { text: "저장하신 후에 실행해 주세요." }]);
                            return;
                        }
                        if (!checkUpdatable({ check: true })) return;
                        v_global.event.data = {
                            rns_id: gw_com_api.getValue("frmData_MAIN", 1, "rns_id"),
                            rev_no: gw_com_api.getValue("frmData_MAIN", 1, "rev_no")
                        };
                        var args = {
                            type: "PAGE", page: "RNS_2010_SUPP", title: "협력사열람설정",
                            width: 800, height: 500, open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "RNS_2010_SUPP",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "추가":
                    {
                        if (param.object == "lyrMenu_FILE") {
                            v_global.event.data = {
                                data_tp: "RNS",
                                key: gw_com_api.getValue("frmData_MAIN", 1, "rns_id"),
                                sub_key: gw_com_api.getValue("frmData_MAIN", 1, "rev_no"),
                                seq: 0,
                                user: gw_com_module.v_Session.USR_ID
                            };
                            var args = {
                                type: "PAGE", page: "RNS_2013", title: "파일 업로드",
                                width: 650, height: 200, locate: ["center", "bottom"], open: true
                            };
                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "RNS_2013",
                                    param: {
                                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                                        data: v_global.event.data
                                    }
                                };
                                gw_com_module.dialogueOpen(args);
                            }
                        }
                    }
                    break;
                case "삭제":
                    {
                        if (param.object == "lyrMenu_FILE") {
                            var args = { targetid: "grdData_FILE", row: "selected", check: "_edit_yn" }
                            gw_com_module.gridDelete(args);
                        } else {
                            processRemove({});
                        }
                    }
                    break;
                case "복원":
                    {
                        if (gw_com_api.getCRUD("frmData_MAIN") == "create") {
                            gw_com_api.messageBox([
                                { text: "데이터가 먼저 저장되어야 합니다." },
                                { text: "저장하신 후에 실행해 주세요." }]);
                            return;
                        }
                        if (!checkUpdatable({ check: true })) return;
                        //var rev_no = gw_com_api.getValue("frmData_MAIN", 1, "rev_no");
                        //if (rev_no == "1") {
                        //    gw_com_api.messageBox([{ text: "복원 대상 데이터가 없습니다." }]);
                        //    return;
                        //}
                        var p = {
                            handler: processRestore,
                            param: {
                                rns_id: gw_com_api.getValue("frmData_MAIN", 1, "rns_id"),
                                rev_no: (v_global.logic.rev_tp == "EXT") ? "-2" : "-1"     // -2:연장 복원, -1:개정 복원
                            }
                        };
                        gw_com_api.messageBox([
                            { text: "복원 후 기존 데이터는 복구할 수 없습니다." },
                            { text: "계속 하시겠습니까?" }], undefined, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "download":
                    {
                        var args = { source: { id: param.object, row: param.row }, targetid: "lyrDown" };
                        gw_com_module.downloadFile(args);
                    }
                    break;
            }

        }
        //----------
        function processItemdblclick(param) {

            switch (param.element) {
                case "memo_html_1":
                case "memo_html_2":
                    {
                        processMemo(param);
                    }
                    break;
            }

        }
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function createDW(param) {

    var args = {
        targetid: "frmData_MAIN", query: "RNS_2011_1", type: "TABLE", title: "문서정보",
        caption: true, show: true, selectable: true,
        editable: { bind: "select", focus: "dept_area", validate: true },
        content: {
            width: { label: 120, field: 180 }, height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "장비군", format: { type: "label" } },
                        {
                            name: "dept_area",
                            format: { type: "select", data: { memory: "장비군", unshift: [{ title: "-", value: "" }] } },
                            editable: {
                                type: "select", data: { memory: "장비군", unshift: [{ title: "-", value: "" }] },
                                change: [{ name: "rns_tp", memory: "분류", unshift: [{ title: "-", value: "" }], key: ["dept_area", "rns_fg"] }],
                                validate: { rule: "required", message: "장비군" }
                            }
                        },
                        { header: true, value: "담당부서", format: { type: "label" } },
                        { name: "dept_nm", editable: { type: "hidden" } },
                        { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "담당자", format: { type: "label" } },
                        { name: "user_nm", editable: { type: "hidden" } },
                        { name: "user_id", editable: { type: "hidden" }, hidden: true },
                        { name: "rns_fg", editable: { type: "hidden" }, hidden: true }
                    ]
                },
                {
                    element: [
                        { header: true, value: "문서번호", format: { type: "label" } },
                        {
                            name: "rns_no",
                            editable: { type: (param.edit || param.create ? "text" : "hidden"), maxlength: 40, validate: { rule: "required", message: "문서번호" } }
                        },
                        { header: true, value: "개정일자", format: { type: "label" } },
                        {
                            name: "rev_date", mask: "date-ymd",
                            editable: { type: "hidden" }
                            //editable: { type: (param.edit || param.create ? "text" : "hidden") }
                        },
                        { header: true, value: "개정번호", format: { type: "label" } },
                        {
                            name: "rev_no", mask: "numeric-int",
                            editable: { type: (param.create ? "text" : "hidden"), validate: { rule: "required", message: "개정번호" } }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "분류", format: { type: "label" } },
                        {
                            name: "rns_tp",
                            format: { type: "select", data: { memory: "분류", unshift: [{ title: "-", value: "" }] } },
                            editable: { type: "select", data: { memory: "분류", unshift: [{ title: "-", value: "" }], key: ["dept_area", "rns_fg"] }, validate: { rule: "required", message: "분류" } }
                        },
                        { header: true, value: "문서명", format: { type: "label" } },
                        {
                            name: "rns_nm", style: { colspan: 3 },
                            format: { width: 800 },
                            editable: { type: "text", width: 500, maxlength: 100, validate: { rule: "required", message: "문서명" } }
                        },
                        { name: "rns_id", editable: { type: "hidden" }, hidden: true },
                        { name: "astat", editable: { type: "hidden" }, hidden: true },
                        { name: "gw_key", editable: { type: "hidden" }, hidden: true },
                        { name: "gw_seq", editable: { type: "hidden" }, hidden: true },
                        { name: "rev_yn", hidden: true },
                        { name: "next_rev_no", hidden: true }
                    ]
                }
            ]
        }
    };
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = {
        targetid: "frmData_MAIN", event: "itemchanged", handler: function (param) {
            switch (param.element) {
                case "rev_no":
                    {
                        var args = {
                            rns_id: gw_com_api.getValue(param.object, param.row, "rns_id"),
                            rev_no: param.value.current,
                            message: true
                        }
                        if (!checkRevNo(args)) {
                            gw_com_api.setValue(param.object, param.row, "rev_no", "", false, false, false);
                            return false;
                        }
                    }
                    break;
            }
        }
    };
    gw_com_module.eventBind(args);
    //=====================================================================================

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_rns_id", value: v_global.logic.rns_id },
                { name: "arg_rev_tp", value: v_global.logic.rev_tp }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" }    // qry: RNS_2011_1 
        ],
        clear: [
            { type: "FORM", id: "frmData_MEMO" },   // qry: RNS_2011_2
            { type: "GRID", id: "grdData_FILE" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (gw_com_api.getValue("frmData_MAIN", 1, "rev_yn") == "1") {
        // 개정
        $("#frmData_MAIN_rev_no_view").css("color", "red");
        $("#frmData_MAIN_rev_no_view").css("font-weight", "bold");
        gw_com_api.setValue("frmData_MAIN", 1, "rev_no", gw_com_api.getValue("frmData_MAIN", 1, "next_rev_no"), false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "rev_date", "", false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "dept_nm", gw_com_module.v_Session.DEPT_NM, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "dept_cd", gw_com_module.v_Session.DEPT_CD, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "user_nm", gw_com_module.v_Session.USR_NM, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "user_id", gw_com_module.v_Session.USR_ID, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "astat", "10", false, true); // 개정 중
        gw_com_api.setValue("frmData_MAIN", 1, "gw_key", "", false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "gw_seq", "0", false, true);
        processInsert({ memo: true });
        //var args = {
        //    targetid: "frmData_MEMO", edit: true, updatable: true,
        //    data: [
        //        { name: "rns_id", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_id") },
        //        { name: "rev_no", value: gw_com_api.getValue("frmData_MAIN", 1, "rev_no") },
        //        { name: "memo_tp_1", value: "A" },
        //        { name: "memo_tp_2", value: "B" }
        //    ]
        //};
        //gw_com_module.formInsert(args);
    } else if (gw_com_api.getValue("frmData_MAIN", 1, "rev_yn") == "E") {
        // 연장
        $("#frmData_MAIN_rev_no_view").css("color", "black");
        $("#frmData_MAIN_rev_no_view").css("font-weight", "normal");
        gw_com_api.setValue("frmData_MAIN", 1, "rev_date", "", false, true);    //개정일자
        gw_com_api.setValue("frmData_MAIN", 1, "dept_nm", gw_com_module.v_Session.DEPT_NM, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "dept_cd", gw_com_module.v_Session.DEPT_CD, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "user_nm", gw_com_module.v_Session.USR_NM, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "user_id", gw_com_module.v_Session.USR_ID, false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "astat", "12", false, true); // 연장 중
        gw_com_api.setValue("frmData_MAIN", 1, "gw_key", "", false, true);
        gw_com_api.setValue("frmData_MAIN", 1, "gw_seq", "0", false, true);
        // 연계 정보 조회
        var args = {
            source: {
                type: "FORM", id: "frmData_MAIN", row: 1, block: true,
                element: [
                    { name: "rns_id", argument: "arg_rns_id" },
                    { name: "rev_no", argument: "arg_rev_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MEMO" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
        gw_com_module.objRetrieve(args);
    }
    else {
        // 수정
        $("#frmData_MAIN_rev_no_view").css("color", "black");
        $("#frmData_MAIN_rev_no_view").css("font-weight", "normal");
        var args = {
            source: {
                type: "FORM", id: "frmData_MAIN", row: 1, block: true,
                element: [
                    { name: "rns_id", argument: "arg_rns_id" },
                    { name: "rev_no", argument: "arg_rev_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MEMO" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
        gw_com_module.objRetrieve(args);
    }

}
//----------
function processInsert(param) {

    if (param.memo) {

        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_rns_id", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_id") },
                    { name: "arg_rev_no", value: gw_com_api.getValue("frmData_MAIN", 1, "rev_no") }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MEMO", query: "RNS_2011_2_I", crud: "insert" }
            ]
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "rns_id", value: 0 },
                { name: "rns_fg", value: v_global.logic.rns_fg },
                { name: "dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                { name: "dept_cd", value: gw_com_module.v_Session.DEPT_CD },
                { name: "user_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "user_id", value: gw_com_module.v_Session.USR_ID },
                { name: "rev_no", value: "0" },
                { name: "astat", value: "00" },
                { name: "dept_area", value: v_global.logic.dept_area }
            ],
            clear: [
                { type: "FORM", id: "frmData_MEMO" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
        gw_com_module.formInsert(args);
        //gw_com_api.filterSelect("frmData_MAIN", 1, "rns_tp", { memory: "분류", unshift: [{ title: "-", value: "" }], value: [v_global.logic.dept_area, v_global.logic.rns_fg] });
        //----------
        processInsert({ memo: true });

    }

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    //if (!checkUpdatable({})) {
    //    gw_com_api.messageBox([{ text: "저장할 내역이 없습니다." }]);
    //    return;
    //}

    if (Number(gw_com_api.getValue("frmData_MAIN", 1, "rev_no")) < 0) {
        gw_com_api.setError(true, "frmData_MAIN", 1, "rev_no");
        gw_com_api.messageBox([{ text: "개정 번호가 잘못 되었습니다." }]);
        return;
    }
    gw_com_api.setError(false, "frmData_MAIN", 1, "rev_no");

    var args = {
        rns_id: gw_com_api.getValue("frmData_MAIN", 1, "rns_id"),
        param: [
            { name: "rns_no", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_no"), type: "varchar" },
            { name: "rns_nm", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_nm"), type: "varchar" },
            { name: "rns_fg", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_fg"), type: "varchar" },
            { name: "rns_tp", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_tp"), type: "varchar" },
            { name: "dept_cd", value: gw_com_api.getValue("frmData_MAIN", 1, "dept_cd"), type: "varchar" },
            { name: "user_id", value: gw_com_api.getValue("frmData_MAIN", 1, "user_id"), type: "varchar" },
            { name: "dept_area", value: gw_com_api.getValue("frmData_MAIN", 1, "dept_area"), type: "varchar" },
            { name: "rev_no", value: gw_com_api.getValue("frmData_MAIN", 1, "rev_no"), type: "varchar" },
            { name: "rev_date", value: gw_com_api.getValue("frmData_MAIN", 1, "rev_date"), type: "varchar" },
            { name: "astat", value: gw_com_api.getValue("frmData_MAIN", 1, "astat"), type: "varchar" },
            { name: "memo1", value: gw_com_api.getValue("frmData_MEMO", 1, "memo_text_1"), type: "varchar" },
            { name: "memo2", value: gw_com_api.getValue("frmData_MEMO", 1, "memo_text_2"), type: "varchar" },
            { name: "files", value: getFileIds({}), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    processBatch(args);

}
//----------
function successSave(response, param) {

    v_global.logic.rns_id = response.VALUE[0];
    var p = {
        handler: processRetrieve,
        param: { key: response }
    };
    gw_com_api.messageBox([{ text: "저장되었습니다." }], undefined, undefined, undefined, p);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        nomessage: true,
        tran: true,
        procedure: "sp_QMS_createRNS",
        input: param.param,
        output: [
            { name: "rns_id", type: "int", value: param.rns_id },
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ]
    };
    if (param.handler == undefined)
        args.handler = {
            success: successBatch,
            param: param
        };
    else
        args.handler = param.handler

    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[1] > 0) {
        var missing = undefined;
        var p = {
            handler: processClose,
            param: {
                data: {
                    rns_id: response.VALUE[0]
                }
            }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[2].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);
    }

}
//----------
function processRemove(param) {

    if (gw_com_api.getCRUD("frmData_MAIN") == "create") {

        processInsert({});

    } else {

        if (param == undefined || param.rns_id == undefined) {

            var p = {
                handler: processRemove,
                param: {
                    rns_id: gw_com_api.getValue("frmData_MAIN", 1, "rns_id")
                }
            };
            gw_com_api.messageBox([{ text: "REMOVE" }], undefined, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);

        } else {

            var qry = {
                query: $("#frmData_MAIN").attr("query"),
                row: [{
                    crud: "U",
                    column: [
                        { name: "rns_id", value: param.rns_id },
                        { name: "astat", value: "DEL" },
                        { name: "astat_usr", value: gw_com_module.v_Session.USR_ID },
                        { name: "astat_dt", value: "SYSDT" }
                    ]
                }]
            };
            var args = {
                url: "COM",
                user: gw_com_module.v_Session.USR_ID,
                param: [qry],
                nomessage: true,
                handler: {
                    success: successRemove
                }
            };
            gw_com_module.objSave(args);

        }

    }

}
//----------
function successRemove(response, param) {

    var p = {
        handler: processClose,
        param: { data: response }
    };
    gw_com_api.messageBox([{ text: "SUCCESS" }], undefined, undefined, undefined, p);

}
//----------
function processApprove(param) {

    if (gw_com_api.getCRUD("frmData_MAIN") == "create") {
        gw_com_api.messageBox([
            { text: "데이터가 먼저 저장되어야 합니다." },
            { text: "저장하신 후에 실행해 주세요." }]);
        return;
    }
    if (!checkUpdatable({ check: true })) return;
    if (gw_com_api.getRowCount("grdData_FILE") == 0) {
        gw_com_api.messageBox([{ text: "파일 첨부 후 상신하시기 바랍니다." }]);
        return;
    }
    // 배포부서 설정 확인
    var args = {
        rns_id: v_global.logic.rns_id,
        rev_no: gw_com_api.getValue("frmData_MAIN", 1, "rev_no"),
        message: true
    }
    if (!checkApproval(args)) return;

    gw_com_site.gw_appr_rns(args);

}
//----------
function processRestore(param) {

    var args = {
        url: "COM",
        nomessage: true,
        tran: true,
        procedure: "sp_QMS_restoreRNS",
        input: [
            { name: "rns_id", value: param.rns_id, type: "int" },
            { name: "rev_no", value: param.rev_no, type: "int" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successRestore,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successRestore(response, param) {

    if (response.VALUE[0] > 0) {
        var missing = undefined;
        var p = {
            handler: processClose,
            param: {
                data: {
                    rns_id: param.rns_id
                }
            }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);
    }

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.event.html = param.element;
    v_global.event.text = param.element.replace("memo_html_", "memo_text_");
    var args = {
        page: "DLG_EDIT_HTML",
        option: "width=900,height=600,left=300,resizable=1",
        data: {
            title: (param.element == "memo_html_1" ? "변경 전" : "변경 후"),
            html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element, (v_global.event.type == "GRID"))
        }
    };
    gw_com_api.openWindow(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

}
//----------
function getFileIds(param) {

    var f = new Array();
    var ids = gw_com_api.getRowIDs("grdData_FILE");
    $.each(ids, function () {
        f[f.length] = gw_com_api.getValue("grdData_FILE", this, "file_id", true);
    })
    return f.join(",");

}
//----------
function checkApproval(param) {

    var rtn = false;
    var args = {
        request: "PAGE",
        name: "GW_INF",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=RNS_2011_CHK_APPR" +
            "&QRY_COLS=msg" +
            "&CRUD=R" +
            "&arg_rns_id=" + param.rns_id +
            "&arg_rev_no=" + param.rev_no,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(data) {

        if (data.DATA != undefined && data.DATA.length > 0) {
            rtn = (data.DATA[0] == "");
            if (param.message && data.DATA[0] != "")
                gw_com_api.messageBox([{ text: data.DATA[0] }]);
        }

    }
    return rtn;

}
//----------
function checkRevNo(param) {

    var rtn = false;
    var args = {
        request: "PAGE",
        name: "RNS_2011_CHK_REV_NO",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=RNS_2011_CHK_REV_NO" +
            "&QRY_COLS=msg" +
            "&CRUD=R" +
            "&arg_rns_id=" + param.rns_id +
            "&arg_rev_no=" + param.rev_no,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(data) {

        if (data.DATA != undefined && data.DATA.length > 0) {
            rtn = (data.DATA[0] == "");
            if (param.message && data.DATA[0] != "")
                gw_com_api.messageBox([{ text: data.DATA[0] }]);
        }

    }
    return rtn;

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "RNS_2013":
                    case "RNS_2010_DEPT":
                    case "RNS_2010_SUPP":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                    default:
                        {
                            v_global.logic = param.data;    // rns_id, rns_fg, rev_no, dept_area, edit_tp="REV","EXT"
                            if (v_global.logic.rev_tp == undefined) v_global.logic.rev_tp = "REV";    // rev_tp 기본값:개정
                            // SOP의 경우만 협력사 메뉴버튼 활성화
                            if (param.data.rns_fg == "SOP") {
                                gw_com_api.show("lyrMenu_협력사");
                            } else {
                                gw_com_api.hide("lyrMenu_협력사");
                            }
                            // 신규 or 수정 구분
                            if (param.data.rns_id == undefined || param.data.rns_id == "") {
                                createDW({ create: true });
                                processInsert({});
                            } else {
                                createDW({ edit: true });
                                processRetrieve({});
                            }
                            return;
                        }
                        break;
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
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                switch (param.from.page) {
                    case "RNS_2010_DEPT":
                    case "RNS_2010_SUPP":
                        {
                            if (param.data != undefined) {
                                //// Updatable 상태
                                //var args = { targetid: "frmData_MAIN", edit: true };
                                //gw_com_module.formEdit(args);
                                //gw_com_api.setUpdatable("frmData_MAIN");
                            }
                        }
                        break;
                    case "RNS_2013":
                        {
                            var file_id = getFileIds({});
                            $.each(param.key[0].KEY, function () {
                                if (this.NAME == "file_id")
                                    file_id += (file_id == "" ? "" : ",") + param.key[0].KEY[0].VALUE;
                            })
                            var args = {
                                source: {
                                    type: "INLINE",
                                    argument: [
                                        { name: "arg_file_id", value: file_id }
                                    ]
                                },
                                target: [
                                    { type: "GRID", id: "grdData_FILE", query: "RNS_2011_3_I", crud: "update" }
                                ]
                            };
                            gw_com_module.objRetrieve(args);
                            // Updatable 상태
                            var args = { targetid: "frmData_MAIN", edit: true };
                            gw_com_module.formEdit(args);
                            gw_com_api.setUpdatable("frmData_MAIN");
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.html, param.data.html, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.text, param.data.html, (v_global.event.type == "GRID"));
                    // Updatable 상태
                    var args = { targetid: "frmData_MAIN", edit: true };
                    gw_com_module.formEdit(args);
                    gw_com_api.setUpdatable("frmData_MAIN");
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//