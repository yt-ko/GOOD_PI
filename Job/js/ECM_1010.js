//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 표준계약서등록
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM81" }]
                },
                {
                    type: "PAGE", name: "ECM010", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECM010" }]
                },
                {
                    type: "INLINE", name: "언어",
                    data: [
                        { title: "국문", value: "KOR" },
                        { title: "영문", value: "ENG" }
                    ]
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", act: true },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_MAIN", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "파일추가", value: "파일업로드", icon: "추가" }//,
                //{ name: "파일삭제", value: "파일삭제", icon: "삭제" },
                //{ name: "파일보기", value: "파일보기", icon: "조회" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: false, remark: "lyrRemark",
            editable: { focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: {
                                    type: "select", data: { memory: "ISCM81", unshift: [{ title: "전체", value: "%" }] }
                                }
                            }
                        ]
                    },
                    {
                        align: "left",
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
            targetid: "grdData_MAIN", query: "ECM_1010_1", title: "계약분류",
            height: 400, show: true, caption: true, pager: false, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "grp_nm", validate: true },
            element: [
                {
                    header: "계약분류명", name: "grp_nm", width: 800,
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "장비군", name: "dept_area", width: 80, align: "center",
                    format: { type: "select", data: { memory: "ISCM81" } },
                    editable: { type: "select", data: { memory: "ISCM81" } }, hidden: true
                },
                //{
                //    header: "표준", name: "std_yn", width: 80, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0" },
                //    editable: { type: "checkbox", value: "1", offval: "0" }
                //},
                {
                    header: "만료알람일", name: "ext_chk", width: 80, align: "right",
                    editable: { type: "text", maxlength: 3 }, mask: "numeric-int"
                },
                {
                    header: "자동연장", name: "ext_yn", width: 80, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "연장횟수", name: "ext_cnt", width: 80, align: "right",
                    editable: { type: "text", maxlength: 3 }, mask: "numeric-int", hidden: true
                },
                {
                    header: "정렬순번", name: "sort_seq", width: 80, align: "right",
                    editable: { type: "text", maxlength: 5 }, mask: "numeric-int"
                },
                { name: "grp_id", editable: { type: "hidden" }, hidden: true },
                { name: "grp_cd", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //$("#grdData_MAIN_data").parents('div.ui-jqgrid-bdiv').css("min-height", "300px");
        //$("#grdData_MAIN_data").parents('div.ui-jqgrid-bdiv').css("max-height", "450px");
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "ECM_1010_2", title: "계약문서",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "doc_tp", validate: true },
            element: [
                {
                    header: "문서구분", name: "doc_tp", width: 100, align: "center",
                    format: { type: "select", data: { memory: "ECM010" } },
                    editable: { type: "select", data: { memory: "ECM010" }, validate: { rule: "required", message: "문서구분" } }
                },
                {
                    header: "파일명", name: "doc_nm", width: 410,
                    editable: { type: "text", validate: { rule: "required", message: "파일명" } }
                },
                {
                    header: "언어", name: "doc_lang", width: 70, align: "center",
                    format: { type: "select", data: { memory: "언어" } },
                    editable: { type: "select", data: { memory: "언어" } }
                },
                {
                    header: "사용", name: "use_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "필수", name: "require_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "편집", name: "edit_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "Rev.No.", name: "rev_no", width: 70,
                    editable: { type: "text", maxlength: 6 }
                },
                {
                    header: "정렬", name: "sort_seq", width: 50, align: "right",
                    editable: { type: "text", maxlength: 5 }, mask: "numeric-int"
                },
                {
                    header: "파일", name: "file_download", width: 50, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "파일", name: "file_edit", width: 50, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "항목", name: "field_edit", width: 50, align: "center",
                    format: { type: "link" }
                },
                { name: "std_id", editable: { type: "hidden" }, hidden: true },
                { name: "grp_id", editable: { type: "hidden" }, hidden: true },
                { name: "file_id", hidden: true },
                { name: "file_nm", hidden: true },
                { name: "file_path", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_MAIN", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MAIN", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "파일추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "파일삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "파일보기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselecting", handler: rowselecting_grdData_MAIN };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, element: "file_download", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, element: "file_edit", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, element: "field_edit", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================


        function rowselecting_grdData_MAIN(param) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = param.row;

            var args = {
                target: [
                    { type: "GRID", id: "grdData_SUB" }
                ]
            };
            return gw_com_module.objUpdatable(args);

        }
        //----------

    }
    //#endregion

};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "추가":
            {
                if (param.object == "lyrMenu_MAIN") {

                } else {
                    if (!checkManipulate({})) return;
                }
                processInsert(param);
            }
            break;
        case "삭제":
            {
                if (param.object == "lyrMenu_MAIN") {
                    v_global.process.handler = processRemove;
                    if (!checkManipulate({})) return;
                    checkRemovable({});
                } else {
                    if (!checkManipulate({})) return;
                    // 계약서 체크
                    if (!checkDeletable({ check: true })) {
                        return false;
                    }
                    processDelete(param);
                }
            }
            break;
        case "파일추가":
        case "file_edit":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.getSelectedRow("grdData_MAIN") < 1) return;
                v_global.event.data = {
                    type: "ECM_STD_DOC",
                    std_id: param.element == "파일추가" ? "" : gw_com_api.getValue(param.object, param.row, "std_id", true),
                    grp_id: gw_com_api.getValue("grdData_MAIN", "selected", "grp_id", true),
                    //key: gw_com_api.getValue("grdData_SUB", "selected", "std_id", true),
                    seq: null
                };
                if (param.element == "file_edit") {
                    v_global.event.data.doc_tp = gw_com_api.getValue(param.object, param.row, "doc_tp", true);
                    v_global.event.data.doc_lang = gw_com_api.getValue(param.object, param.row, "doc_lang", true);
                    v_global.event.data.require_yn = gw_com_api.getValue(param.object, param.row, "require_yn", true);
                    v_global.event.data.edit_yn = gw_com_api.getValue(param.object, param.row, "edit_yn", true);
                }
                var pageArgs = "ECM_STD_DOC" + ":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
                var args = {
                    type: "PAGE", open: true, locate: ["center", 100],
                    width: 660, height: 350, scroll: true,  // multi( h:350, scroll) / single(h:300)
                    page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
                    data: v_global.event.data  // reOpen 을 위한 Parameter
                };

                // Open dialogue
                gw_com_module.dialogueOpenJJ(args);
                //var args = {
                //    type: "PAGE", page: "w_upload_ecm", title: "양식 업로드", pageArgs: pageArgs,
                //    width: 700, height: 230, locate: ["center", "bottom"], open: true,
                //};
                //if (gw_com_module.dialoguePrepare(args) == false) {
                //    args = {
                //        page: args.page,
                //        param: {
                //            ID: gw_com_api.v_Stream.msg_openedDialogue,
                //            data: v_global.event.data
                //        }
                //    };
                //    gw_com_module.dialogueOpenJJ(args);
                //}
            }
            break;
        case "파일삭제":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                //gw_com_api.setValue("grdData_SUB", "selected", "file_id", true, true, true);
                //gw_com_api.setCRUD("grdData_SUB", "selected", "modify", true);
                //processSave({});
                var obj = "grdData_SUB";
                var std_id = gw_com_api.getValue(obj, "selected", "std_id", true);
                var args = {
                    url: "COM",
                    user: gw_com_module.v_Session.USR_ID,
                    param: [
                        {
                            query: $("#" + obj + "_data").attr("query"),
                            row: [{
                                crud: "U",
                                column: [
                                    { name: "std_id", value: std_id },
                                    { name: "file_id", value: "" }
                                ]
                            }]
                        }
                    ],
                    handler: { success: successSave, param: { sub: true } }
                };
                gw_com_module.objSave(args);
            }
            break;
        case "파일보기":
            {
                if (!checkManipulate({})) return;
                var obj = "grdData_SUB";
                var row = gw_com_api.getSelectedRow(obj);
                if (row < 1) return;
                if (gw_com_api.getValue(obj, "selected", "file_nm", true) == "") {
                    gw_com_api.messageBox([{ text: "양식파일이 없습니다." }]);
                    return;
                }
                processFile({ object: obj, row: row });
            }
            break;
        case "file_download":
            {
                processFile({ object: param.object, row: param.row });
            }
            break;
        case "field_edit":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;

                var std_id = param.std_id ? param.std_id : gw_com_api.getValue(param.object, param.row, "std_id", true);
                var file_id = param.file_id ? param.file_id : gw_com_api.getValue(param.object, param.row, "file_id", true);

                if (std_id == undefined || std_id == "" || file_id == undefined || file_id == "") return;

                v_global.event.data = {
                    std_id: std_id,
                    file_id: file_id
                };

                var args = {
                    type: "PAGE", page: "ECM_1011", title: "계약서 항목",
                    width: 650, height: 400, locate: ["center", "bottom"], open: true, scroll: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args = {
                        page: args.page,
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
//------
function processSelect(param) {

    gw_com_api.selectRow("grdData_MAIN", v_global.process.current.master, true, false);

}
//------
function processRetrieve(param) {

    var args;
    if (param.object == "grdData_MAIN") {
        v_global.process.prev.master = param.row;
        args = {
            source: {
                type: "GRID",
                id: "grdData_MAIN", row: param.row, block: true,
                element: [
                    { name: "grp_id", argument: "arg_grp_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);


}
//------
function processItemchanged(param) {

    switch (param.element) {
        case "doc_tp":
            {
                if (param.value.current == "2") {
                    // 부속서류일 경우 편집=1
                    gw_com_api.setValue(param.object, param.row, "edit_yn", "1", true);
                }
            }
            break;
        case "edit_yn":
            {
                if (param.value.current == "0" && gw_com_api.getValue(param.object, param.row, "doc_tp", true) == "2") {
                    // 부속서류일 경우 편집=1
                    gw_com_api.setValue(param.object, param.row, param.element, "1", true, false, false);
                }
            }
            break;
    }

}
//------
function processInsert(param) {

    var args;
    if (param.object == "lyrMenu_MAIN") {
        args = {
            targetid: "grdData_MAIN",
            edit: true, updatable: true,
            data: [
                { name: "sort_seq", rule: "INCREMENT", value: 10 }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ]
        };
    } else {
        var grp_id = gw_com_api.getValue("grdData_MAIN", "selected", "grp_id", true);
        if (grp_id == "") {
            gw_com_api.messageBox([
                { text: "데이터가 먼저 저장되어야 합니다." },
                { text: "저장하신 후에 실행해 주세요." }
            ]);
            return;
        }

        var doc_tp = "1";
        //if (gw_com_api.getFindRow("grdData_SUB", "doc_tp", "1") > 0) {
        //    doc_tp = "2";
        //}

        args = {
            targetid: "grdData_SUB",
            edit: true,
            data: [
                { name: "doc_tp", value: doc_tp },
                { name: "grp_id", value: grp_id },
                { name: "doc_lang", value: "KOR" },
                { name: "sort_seq", rule: "INCREMENT", value: 10 }
            ]
        }
    }
    gw_com_module.gridInsert(args);

}
//------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_SUB") {
        args = {
            targetid: "grdData_SUB", row: "selected"
        };
    } else {
        args = {
            targetid: "grdData_MAIN", row: "selected", remove: true,
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ]
        };
    }
    gw_com_module.gridDelete(args);

}
//------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_MAIN",
                key: [{ row: "selected", element: [{ name: "grp_id" }] }]
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);


}
//------
function successRemove(response, param) {

    processDelete({});

}
//------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (gw_com_api.getUpdatable("grdData_MAIN", true))
        param.master = true;
    else if (gw_com_api.getUpdatable("grdData_SUB", true))
        param.sub = true;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//------
function successSave(response, param) {

    if (param.sub)
        processRetrieve({ type: "GRID", object: "grdData_MAIN", row: "selected", key: response });
    else
        processRetrieve({ key: response });

}
//------
function processFile(param) {

    var args = {
        source: { id: param.object, row: "selected" },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_MAIN", "selected", true);

}
//------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//------
function checkUpdatable(param) {

    var args = {
        check: param.check ? param.check : false,
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else {
        // 계약서 등록 체크
        var deletable = false;
        var grp_id = gw_com_api.getValue("grdData_MAIN", "selected", "grp_id", true);
        $.ajax({
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=ECM_1010_DOC_GRP_DEL_CHK" +
            "&QRY_COLS=deletable" +
            "&CRUD=R" +
            "&arg_grp_id=" + grp_id,
            type: 'post',
            cache: false,
            async: false,
            data: "{}",
            success: function (data, status) {
                var response = JSON.parse(data);
                if (response.iCode == 0) {
                    deletable = response.tData[0].DATA[0] == "1";
                }
            }
        });

        if (deletable)
            gw_com_api.messageBox([
                { text: "REMOVE" }
            ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        else
            gw_com_api.messageBox([
                { text: "등록된 계약서가 있어 분류를 삭제할 수 없습니다." }
            ], 460);
    }

}
//------
function checkDeletable(param) {

    var std_id = gw_com_api.getValue("grdData_SUB", "selected", "std_id", true);
    if (std_id == "" || std_id == 0) return true;
    var deletable = false;

    $.ajax({
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
        "?QRY_ID=ECM_1010_STD_DOC_DEL_CHK" +
        "&QRY_COLS=deletable" +
        "&CRUD=R" +
        "&arg_std_id=" + std_id,
        type: 'post',
        cache: false,
        async: false,
        data: "{}",
        success: function (data, status) {
            var response = JSON.parse(data);
            if (response.iCode == 0) {
                deletable = response.tData[0].DATA[0] == "1";
                if (!deletable && param.check) {
                    gw_com_api.messageBox([
                        { text: "등록된 계약서가 있어 표준문서를 삭제할 수 없습니다." }
                    ], 500);
                }
            }
        }
    });

    return deletable;
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
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
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
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
                    case "w_upload_ecm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "ECM_1011":
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
                    case "w_upload_ecm":
                        {
                            if (param.data != undefined) {

                                // 계약서항목
                                processButton({ element: "field_edit", std_id: param.data.std_id, file_id: param.data.file_id });

                                //
                                var obj = "grdData_SUB";
                                var query = $("#" + obj + "_data").attr("query");
                                var keys = [
                                     { NAME: "std_id", VALUE: gw_com_api.getValue(obj, "selected", "std_id", true) }
                                ];
                                var key = [{
                                    QUERY: query,
                                    KEY: keys
                                }];
                                processRetrieve({ object: "grdData_MAIN", type: "GRID", row: "selected", key: key });

                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}