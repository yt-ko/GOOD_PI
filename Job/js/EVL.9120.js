//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.06)
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
        v_global.logic.ext1 = gw_com_api.getPageParameter("ext1");  //평가 속성
        v_global.logic.sys = (gw_com_module.v_Session.USER_TP == "SYS");
        //----------
        // prepare dialogue.
        var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택", width: 700, height: 450 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "EVL_2021", title: "평가결과 엑셀 업로드", width: 700, height: 200 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = {
            request: [
                { type: "PAGE", name: "평가연도", query: "dddw_evl_year" },
                {
                    type: "PAGE", name: "평가그룹", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "EVL02" }]
                },
                {
                    type: "PAGE", name: "평가목록", query: "dddw_evl",
                    param: [
                        { argument: "arg_user_id", value: "%" },
                        { argument: "arg_ext1", value: v_global.logic.ext1 }
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

            //----------
            v_global.logic.evl_seq = 1;     // 1차평가
            //----------
            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "evl_year", gw_com_api.getYear());
            if (!v_global.logic.sys) {
                gw_com_api.setValue("frmOption", 1, "valuer_nm", gw_com_module.v_Session.USR_NM, false, false, false);
                gw_com_api.setValue("frmOption", 1, "valuer_id", gw_com_module.v_Session.USR_ID, false, true, false);
                processRetrieve({});
            }

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
                { name: "조회", value: "조회", act: true },
                { name: "제출", value: "제출", icon: "예" },
                { name: "취소", value: "제출취소", icon: "아니오" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_EVL_RESULT", type: "FREE",
            element: [
                { name: "받기", value: "엑셀내려받기", icon: "엑셀", updatable: true },
                { name: "올리기", value: "엑셀가져오기", icon: "엑셀", updatable: true }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "evl_year", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "evl_year", label: { title: "평가연도 :" },
                                editable: {
                                    type: "select", data: { memory: "평가연도" },
                                    change: [{ name: "evl_no", memory: "평가목록", key: ["evl_year"] }]
                                }
                            },
                            {
                                name: "evl_no", label: { title: "평가명 :" },
                                editable: { type: "select", data: { memory: "평가목록", key: ["evl_year"] } }
                            },
                            {
                                name: "evl_group", label: { title: "평가그룹 :" },
                                editable: { type: "select", data: { memory: "평가그룹", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "user_nm", label: { title: "평가대상자 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "valuer_nm", label: { title: "평가자 :" },
                                editable: { type: "text", size: 10, validate: { rule: "required" } },
                                hidden: !v_global.logic.sys
                            },
                            { name: "valuer_id", hidden: true }
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
            targetid: "frmOption2", type: "FREE", title: "",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "view_option1", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "view_option1", label: { title: "분류 감추기 :" },
                                editable: { type: "checkbox", value: "1", offval: "0" }
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
            targetid: "grdData_EVL_USER", query: "EVL_2020_1", title: "평가대상자",
            height: 150, show: true, caption: true, selectable: true, number: true, key: true, pager: false,
            element: [
                { header: "평가그룹", name: "evl_group_nm", width: 100 },
                { header: "평가대상", name: "supp_nm", width: 150 },
                { header: "담당자", name: "user_nm", width: 100 },
                { header: "Email", name: "email", width: 150 },
                { header: "진행상태", name: "pstat_nm", width: 100 },
                { header: "자기평가", name: "seq0_point", width: 70, mask: "numeric-float1", align: "right" },
                //{ header: "1차평가자", name: "seq1_valuer_nm", width: 100 },
                //{ header: "1차점수", name: "seq1_point", width: 70, mask: "numeric-float1", align: "right" },
                //{ header: "1차등급", name: "seq1_grade", width: 70, align: "center" },
                { header: "1차점수", name: "seq1_add_point", width: 70, mask: "numeric-float1", align: "right" },
                { header: "1차등급", name: "seq1_add_grade", width: 70, align: "center" },
                { header: "평가시작일", name: "fr_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "평가마감일", name: "to_date", width: 100, align: "center", mask: "date-ymd" },
                { name: "evl_no", hidden: true },
                { name: "user_id", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_EVL_RESULT", query: "EVL_2020_2", title: "요소별평가",
            height: 350, show: true, caption: false, selectable: true, number: true, key: true, pager: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            element: [
                { header: "대분류", name: "item_cat1", width: 90 },
                { header: "중분류", name: "item_cat2", width: 90 },
                { header: "소분류", name: "item_cat3", width: 90 },
                { header: "평가문항", name: "item_nm", width: 450 },
                { header: "배점", name: "evl_item_point", width: 60, mask: "numeric-float1", align: "right" },
                { header: "자기평가", name: "seq0_point", width: 60, mask: "numeric-float1", align: "right" },
                { header: "자기평가내용", name: "seq0_rmk", width: 450 },
                {
                    header: "평가점수", name: "item_point", width: 60, mask: "numeric-float1", align: "right",
                    editable: { type: "text" }
                },
                {
                    header: "평가내용", name: "rmk", width: 450,
                    editable: { type: "textarea", rows: 5, maxlength: 100 }
                },
                { header: "설명", name: "item_desc", width: 450 },
                { name: "evl_no", hidden: true, editable: { type: "hidden" } },
                { name: "evl_seq", hidden: true, editable: { type: "hidden" } },
                { name: "user_id", hidden: true, editable: { type: "hidden" } },
                { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                { name: "edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_EVL_USER", offset: 8 },
                { type: "GRID", id: "grdData_EVL_RESULT", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "제출", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_RESULT", element: "받기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_RESULT", element: "올리기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_USER", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_USER", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_RESULT", grid: true, event: "itemkeyenter", handler: processItemkeyenter };
        gw_com_module.eventBind(args);
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        if (param.object == "lyrMenu") {
                            var args = { target: [{ id: "frmOption", focus: true }] };
                            gw_com_module.objToggle(args);
                        } else {
                            processRetrieve({});
                        }
                    }
                    break;
                case "제출":
                case "취소":
                    {
                        if (gw_com_api.getRowCount("grdData_EVL_RESULT") == 0) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        if (checkUpdatable({})) {
                            processSave({ nomessage: true });
                        }
                        var p = {
                            handler: processBatch,
                            param: {
                                evl_no: gw_com_api.getValue("grdData_EVL_RESULT", "selected", "evl_no", true),
                                evl_seq: gw_com_api.getValue("grdData_EVL_RESULT", "selected", "evl_seq", true),
                                user_id: gw_com_api.getValue("grdData_EVL_RESULT", "selected", "user_id", true),
                                pstat: (param.element == "제출" ? "완료" : "취소")
                            }
                        };
                        if (param.element == "제출")
                            gw_com_api.messageBox([{ text: "제출 완료 후 데이터를 수정할 수 없습니다." }, { text: "계속하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                        else
                            gw_com_api.messageBox([{ text: "제출취소 처리 하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "받기":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_EVL_USER");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        var args = {
                            option: [
                                { name: "PRINT", value: "xls" },
                                { name: "PAGE", value: gw_com_module.v_Current.window },
                                { name: "USER", value: gw_com_module.v_Session.USR_ID },
                                { name: "EVL_NO", value: gw_com_api.getValue("grdData_EVL_USER", row, "evl_no", true) },
                                { name: "EVL_SEQ", value: v_global.logic.evl_seq },
                                { name: "USER_ID", value: gw_com_api.getValue("grdData_EVL_USER", row, "user_id", true) }
                            ],
                            target: { type: "FILE", id: "lyrDown", name: "양식" }
                        };
                        gw_com_module.objExport(args);
                    }
                    break;
                case "올리기":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_EVL_USER");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        var args = {
                            evl_no: gw_com_api.getValue("grdData_EVL_USER", row, "evl_no", true),
                            evl_seq: v_global.logic.evl_seq,
                            user_id: gw_com_api.getValue("grdData_EVL_USER", row, "user_id", true)
                        };
                        if (checkUploadable(args)) {
                            v_global.event.data = args;
                            var args = {
                                page: "EVL_2021",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        } else {
                            gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
                        }
                    }
                    break;
                case "실행":
                    {
                        v_global.process.handler = processRetrieve;
                        if (!checkUpdatable({})) return;
                        processRetrieve({});
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            switch (param.element) {
                case "valuer_nm":
                    {
                        var user_info = getUserInfo({ user_nm: param.value.current });
                        if (user_info == undefined || user_info == null) {
                            gw_com_api.setValue(param.object, param.row, "valuer_id", "", (param.type == "GRID"), true, false);
                            v_global.event.object = param.object;
                            v_global.event.row = param.row;
                            v_global.event.element = param.element;
                            v_global.event.type = param.type;
                            v_global.event.user_nm = param.element;
                            v_global.event.user_id = "valuer_id";
                            var args = {
                                page: "DLG_EMPLOYEE",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEmployee,
                                    data: {
                                        emp_nm: param.value.current
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        } else {
                            gw_com_api.setValue(param.object, param.row, "valuer_nm", user_info.user_nm, (param.type == "GRID"), false, false);
                            gw_com_api.setValue(param.object, param.row, "valuer_id", user_info.user_id, (param.type == "GRID"), true, false);
                            processRetrieve({});
                        }
                    }
                    break;
                case "view_option1":
                    {
                        if (param.value.current == "1") {
                            gw_com_api.hide("grdData_EVL_RESULT", "item_cat1", true);
                            gw_com_api.hide("grdData_EVL_RESULT", "item_cat2", true);
                            gw_com_api.hide("grdData_EVL_RESULT", "item_cat3", true);
                        } else {
                            gw_com_api.show("grdData_EVL_RESULT", "item_cat1", true);
                            gw_com_api.show("grdData_EVL_RESULT", "item_cat2", true);
                            gw_com_api.show("grdData_EVL_RESULT", "item_cat3", true);
                        }
                    }
                    break;
                case "item_point":
                    {
                        var item_point = Number(gw_com_api.unMask(param.value.current, "numeric-float1"));
                        var evl_item_point = Number(gw_com_api.getValue(param.object, param.row, "evl_item_point", (param.type == "GRID")));
                        if (item_point > evl_item_point) {
                            //gw_com_api.messageBox([{ text: "배점을 초과하였습니다." }]);
                            gw_com_api.showMessage("배점을 초과하였습니다.");
                        } else {
                            processSave({ nomessage: true });
                        }
                    }
                    break;
                case "rmk":
                    {
                        processSave({ nomessage: true });
                    }
                    break;
            }

        }
        //----------
        function processRowselecting(param) {

            if (param.object == "grdData_EVL_USER") {
                v_global.process.current.row = param.row;
                v_global.process.handler = function () {
                    gw_com_api.selectRow("grdData_EVL_USER", v_global.process.current.row, true, false);
                };
                return checkUpdatable({});
            } else {
                v_global.process.prev.row = gw_com_api.getSelectedRow(param.object);
                return true;
            }

        }
        //----------
        function processRowselected(param) {

            if (param.object == "grdData_EVL_USER")
                processRetrieve(param);
            else {
                if (v_global.process.prev.row != null && v_global.process.prev.row != undefined) {
                    var args = {
                        targetid: param.object,
                        row: v_global.process.prev.row,
                        edit: false
                    };
                    gw_com_module.gridEdit(args);
                }
                if (gw_com_api.getValue(param.object, param.row, "edit_yn", (param.type == "GRID")) == "1") {
                    var args = {
                        targetid: param.object,
                        row: param.row,
                        edit: true
                    };
                    gw_com_module.gridEdit(args);
                }
            }

        }
        //----------
        function processItemkeyenter(param) {

            if (param.object == "grdData_EVL_RESULT") {
                switch (param.element) {
                    case "item_point":
                        {
                            var item_point = Number(gw_com_api.getValue(param.object, param.row, "item_point", (param.type == "GRID")));
                            var evl_item_point = Number(gw_com_api.getValue(param.object, param.row, "evl_item_point", (param.type == "GRID")));
                            if (item_point <= evl_item_point)
                                gw_com_api.setFocus(param.object, param.row, "rmk", true);
                        }
                        break;
                    case "rmk":
                        {
                            gw_com_api.selectRow(param.object, Number(param.row) + 1, true);
                        }
                        break;
                }
                return false;
            }
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
//----------
function processRetrieve(param) {

    if (param.object == "grdData_EVL_USER") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "evl_no", argument: "arg_evl_no" },
                    { name: "user_id", argument: "arg_user_id" }
                ],
                argument: [
                    { name: "arg_evl_seq", value: v_global.logic.evl_seq }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL_RESULT", select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        var args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "evl_no", argument: "arg_evl_no" },
                    { name: "valuer_id", argument: "arg_valuer_id" },
                    { name: "user_nm", argument: "arg_user_nm" },
                    { name: "evl_group", argument: "arg_evl_group" }
                ],
                argument: [
                    { name: "arg_evl_seq", value: v_global.logic.evl_seq },
                    { name: "arg_ext1", value: v_global.logic.ext1 }
                ],
                remark: [
                    { element: [{ name: "evl_year" }] },
                    { element: [{ name: "evl_no" }] },
                    { element: [{ name: "evl_group" }] },
                    { element: [{ name: "valuer_nm" }] },
                    { element: [{ name: "user_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL_USER", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_EVL_RESULT", select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        nomessage: (param.nomessage === true),
        target: [
            { type: "GRID", id: "grdData_EVL_RESULT" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    //
    gw_com_api.setCRUD("grdData_EVL_RESULT", "selected", "retrieve", true);

    if (param.handler != undefined) {
        if (param.param == undefined)
            param.handler();
        else
            param.handler(param.param);
    }

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_QMS_updateEVL_pstat",
        tran: true,
        input: [
            { name: "evl_no", value: param.evl_no, type: "varchar" },
            { name: "evl_seq", value: param.evl_seq, type: "int" },
            { name: "user_id", value: param.user_id, type: "varchar" },
            { name: "pstat", value: param.pstat, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "varchar" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] > 0) {
        var missing = undefined;
        var p = {
            handler: processRetrieve,
            param: {
                key: [{
                    QUERY: $("#grdData_EVL_USER_data").attr("query"),
                    KEY: [
                        { NAME: "evl_no", VALUE: param.evl_no },
                        { NAME: "user_id", VALUE: param.user_id }
                    ]
                }]
            }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 600);
    }

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
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_EVL_RESULT" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function getUserInfo(param) {

    var rtn = null;
    var args = {
        request: "DATA",
        name: "w_find_emp_M_1",
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=w_find_emp_M_1" +
            "&QRY_COLS=emp_nm,user_id" +
            "&CRUD=R" +
            "&arg_dept_nm=" + encodeURIComponent("%") +
            "&arg_emp_nm=" + encodeURIComponent(param.user_nm),
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        if (data.length == 1) {
            rtn = {
                user_nm: data[0].DATA[0],
                user_id: data[0].DATA[1]
            }
        }

    }
    return rtn;

}
//----------
function checkUploadable(param) {

    var rtn = false;
    var args = {
        request: "DATA",
        name: "EVL_2020_UP_CHK",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EVL_2020_UP_CHK" +
            "&QRY_COLS=chk" +
            "&CRUD=R" +
            "&arg_evl_no=" + param.evl_no +
            "&arg_evl_seq=" + param.evl_seq +
            "&arg_user_id=" + param.user_id,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        rtn = (data.DATA[0] == "1");

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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                if (v_global.process.handler == null)
                                    processSave({});
                                else
                                    processSave({ handler: v_global.process.handler, param: {} });
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
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
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "EVL_2021":
                        {
                            args.ID = param.ID;
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
                    case "EVL_2021":
                        {
                            if (param.data != undefined) {
                                var key = [{
                                    QUERY: $("#grdData_EVL_USER_data").attr("query"),
                                    KEY: [
                                        { NAME: "evl_no", VALUE: gw_com_api.getValue("grdData_EVL_USER", "selected", "evl_no", true) },
                                        { NAME: "user_id", VALUE: gw_com_api.getValue("grdData_EVL_USER", "selected", "user_id", true) }
                                    ]
                                }];
                                processRetrieve({ key: key });
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                closeDialogue({ page: param.from.page, focus: true });
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_id, param.data.user_id, (v_global.event.type == "GRID"), undefined, false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_nm, param.data.user_nm, (v_global.event.type == "GRID"), undefined, false);
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//