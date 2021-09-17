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
        //----------
        var args = {
            request: [
                { type: "PAGE", name: "평가연도", query: "dddw_evl_year" },
                {
                    type: "PAGE", name: "평가그룹", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "EVL02" }]
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_part",
                    param: [{ argument: "arg_type", value: "EVL" }]
                },
                {
                    type: "INLINE", name: "구분1",
                    data: [
                        { title: "-", value: "" },
                        { title: "국내", value: "국내" },
                        { title: "해외", value: "해외" }
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
            gw_com_api.setValue("frmOption", 1, "evl_year", gw_com_api.getYear());
            //----------
            gw_com_module.startPage();

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
                { name: "조회", value: "조회", act: true },
                //{ name: "복사", value: "복사", icon: "추가", updatable: true },
                { name: "추가", value: "평가등록" },
                { name: "삭제", value: "평가삭제" },
                { name: "저장", value: "저장" },
                { name: "요소", value: "평가요소관리", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE", show: true,
            element: [
                { name: "조회", value: "새로고침" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_EVL_VALUER", type: "FREE", show: true,
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_EVL_USER", type: "FREE", show: true,
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
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
                                editable: { type: "select", data: { memory: "평가연도" } }
                            },
                            {
                                name: "evl_nm", label: { title: "평가명 :" },
                                editable: { type: "text", size: 16 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "evl_no", label: { title: "평가번호 :" },
                                editable: { type: "text", size: 16 }
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
            targetid: "grdData_EVL", query: "EVL_1010_1", title: "평가목록",
            height: 150, show: true, caption: true, selectable: true, number: true,
            editable: { master: true, bind: "edit_yn", validate: true },
            element: [
                {
                    header: "평가명", name: "evl_nm", width: 550,
                    editable: { type: "text", maxlength: 20, validate: { rule: "required", message: "평가명" } }
                },
                {
                    header: "평가연도", name: "evl_year", width: 100, align: "center",
                    editable: { type: "select", data: { memory: "평가연도" }, validate: { rule: "required", message: "평가연도" }}
                },
                { header: "진행상태", name: "pstat_nm", width: 100, align: "center" },
                {
                    header: "시행일", name: "fr_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required", message: "시행일" } }
                },
                {
                    header: "마감일", name: "to_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required", message: "마감일" } }
                },
                { header: "확정일", name: "close_date", width: 100, align: "center", mask: "date-ymd", hidden: true },
                {
                    header: "평가번호", name: "evl_no", width: 100, align: "center",
                    editable: { type: "hidden" }
                },
                { name: "pstat", hidden: true },
                { name: "ext1", hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_EVL_VALUER", query: "EVL_1010_2", title: "평가담당",
            caption: true, height: 200, pager: true, show: true, number: true, selectable: true,
            element: [
                { header: "담당자", name: "valuer_nm", width: 80 },
                { header: "부서", name: "dept_nm", width: 150 },
                { name: "evl_no", hidden: true },
                { name: "evl_seq", hidden: true },
                { name: "valuer_id", hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_EVL_USER", query: "EVL_1010_3", title: "평가대상",
            caption: true, height: 200, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "edit_yn", focus: "user_nm", validate: true },
            element: [
                { header: "업체명", name: "supp_nm", width: 180 },
                {
                    header: "담당자", name: "user_nm", width: 80,
                    editable: { type: "text", maxlength: 20, validate: { rule: "required", message: "담당자" } }
                },
                {
                    header: "Email", name: "email", width: 200,
                    editable: { type: "text", maxlength: 180, validate: { rule: "required", message: "Email" } }
                },
                {
                    header: "평가그룹", name: "evl_group", width: 100,
                    format: { type: "select", data: { memory: "평가그룹" } },
                    editable: { type: "select", data: { memory: "평가그룹" }, validate: { rule: "required", message: "평가그룹" }}
                },
                {
                    header: "장비군", name: "dept_area", width: 80,
                    format: { type: "select", data: { memory: "장비군" } },
                    editable: { type: "select", data: { memory: "장비군" }, validate: { rule: "required", message: "장비군" } }
                },
                {
                    header: "국내/해외", name: "ext1", width: 70,
                    format: { type: "select", data: { memory: "구분1" } },
                    editable: { type: "select", data: { memory: "구분1" }, validate: { rule: "required", message: "국내/해외" } }
                },
                { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                { name: "user_id", editable: { type: "hidden" }, hidden: true },
                { name: "valuer_id", editable: { type: "hidden" }, hidden: true },
                { name: "edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_EVL", offset: 8 },
                { type: "GRID", id: "grdData_EVL_VALUER", offset: 8 },
                { type: "GRID", id: "grdData_EVL_USER", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "요소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_VALUER", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_VALUER", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_USER", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_EVL_USER", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_VALUER", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_EVL_VALUER", grid: true, event: "rowselected", handler: processRowselected };
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
                case "복사":
                    {
                        closeOption({});
                    }
                    break;
                case "추가":
                    {
                        closeOption({});
                        if (param.object == "lyrMenu") {
                            v_global.event.data = {
                                ext1: v_global.logic.ext1
                            };
                            var args = {
                                type: "PAGE", page: "EVL_1011", title: "평가등록",
                                width: 600, height: 400, open: true
                            };
                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "EVL_1011",
                                    param: {
                                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                                        data: v_global.event.data
                                    }
                                };
                                gw_com_module.dialogueOpen(args);
                            }
                        } else if (param.object == "lyrMenu_EVL_VALUER") {
                            var row = gw_com_api.getSelectedRow("grdData_EVL");
                            if (row == null) {
                                gw_com_api.messageBox([{ text: "NODATA" }]);
                                return;
                            }
                            if (gw_com_api.getValue("grdData_EVL", row, "edit_yn", true) != "1") {
                                gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
                                return;
                            }
                            var args = { evl_no: gw_com_api.getValue("grdData_EVL", row, "evl_no", true) };
                            processSelectValuer(args);
                        } else if (param.object == "lyrMenu_EVL_USER") {
                            var row = gw_com_api.getSelectedRow("grdData_EVL_VALUER");
                            if (row == null) {
                                gw_com_api.messageBox([{ text: "NODATA" }]);
                                return;
                            }
                            if (gw_com_api.getValue("grdData_EVL", "selected", "edit_yn", true) != "1") {
                                gw_com_api.messageBox([{ text: "수정 권한이 없습니다." }]);
                                return;
                            }
                            v_global.event.data = {
                                evl_no: gw_com_api.getValue("grdData_EVL_VALUER", row, "evl_no", true),
                                evl_seq: gw_com_api.getValue("grdData_EVL_VALUER", row, "evl_seq", true),
                                valuer_id: gw_com_api.getValue("grdData_EVL_VALUER", row, "valuer_id", true)
                            };
                            var args = {
                                type: "PAGE", page: "EVL_1013", title: "평가대상자 등록",
                                width: 800, height: 500, open: true
                            };
                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "EVL_1013",
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
                        closeOption({});
                        if (param.object == "lyrMenu_EVL_USER") {
                            var args = { targetid: "grdData_EVL_USER", row: "selected", check: "edit_yn" };
                            gw_com_module.gridDelete(args);
                        } else {
                            var obj = (param.object == "lyrMenu" ? "grdData_EVL" : "grdData_EVL_VALUER");
                            if (gw_com_api.getValue(obj, "selected", "edit_yn", true) != "1") {
                                gw_com_api.messageBox([{ text: "선택하신 데이터는 삭제할 권한이 없습니다." }]);
                                return;
                            }
                            var p = {
                                handler: processRemove
                            };
                            if (param.object == "lyrMenu")
                                p.param = { master: true };
                            else
                                p.param = { sub: true };
                            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);
                        }
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "요소":
                    {
                        var args = { menu_id: "EVL_9020", frame: true };
                        gw_com_api.launchMenu(args);
                        processClose({});
                    }
                    break;
                case "닫기":
                    {
                        closeOption({});
                        processClose({});
                    }
                    break;
                case "실행":
                    {
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
        function processRowselecting(param) {

            v_global.process.current.row = param.row;
            if (param.object == "grdData_EVL") {
                v_global.process.handler = function () {
                    gw_com_api.selectRow("grdData_EVL", v_global.process.current.row, true, false);
                };
            } else {
                v_global.process.handler = function () {
                    gw_com_api.selectRow("grdData_EVL_VALUER", v_global.process.current.row, true, false);
                };
            }
            var args = {
                target: [
                    { type: "GRID", id: "grdData_EVL_USER" }
                ]
            };
            return gw_com_module.objUpdatable(args);

        }
        //----------
        function processRowselected(param) {

            processRetrieve(param);

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

    var args;
    if (param.object == "grdData_EVL_VALUER") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "evl_no", argument: "arg_evl_no" },
                    { name: "valuer_id", argument: "arg_valuer_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL_USER", select: true }
            ],
            key: param.key
        };
    } else if (param.object == "grdData_EVL") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "evl_no", argument: "arg_evl_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL_VALUER", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_EVL_USER" }
            ],
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "evl_year", argument: "arg_evl_year" },
                    { name: "evl_nm", argument: "arg_evl_nm" },
                    { name: "evl_no", argument: "arg_evl_no" }
                ],
                argument: [
                    { name: "arg_ext1", value: v_global.logic.ext1 }
                ],
                remark: [
                    { element: [{ name: "evl_year" }] },
                    { element: [{ name: "evl_nm" }] },
                    { element: [{ name: "evl_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_EVL", select: true }
            ],
            clear: [
                 { type: "GRID", id: "grdData_EVL_VALUER" },
                 { type: "GRID", id: "grdData_EVL_USER" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRemove(param) {

    var args = { url: "COM" };
    if (param.sub) {
        args.target = [
            {
                type: "GRID", id: "grdData_EVL_VALUER",
                key: [{ row: "selected", element: [{ name: "evl_no" }, { name: "evl_seq" }, { name: "valuer_id" }] }]
            }
        ];
    } else {
        args.target = [
            {
                type: "GRID", id: "grdData_EVL",
                key: [{ row: "selected", element: [{ name: "evl_no" }] }]
            }
        ];
    }
    args.handler = {
        success: successRemove,
        param: param
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    var args;
    if (param.sub) {
        args = {
            targetid: "grdData_EVL_VALUER", row: "selected", remove: true,
            clear: [
                { type: "GRID", id: "grdData_EVL_USER"}
            ]
        };
    } else {
        args = {
            targetid: "grdData_EVL", row: "selected", remove: true,
            clear: [
                { type: "GRID", id: "grdData_EVL_VALUER" },
                { type: "GRID", id: "grdData_EVL_USER" }
            ]
        };
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_EVL" },
            { type: "GRID", id: "grdData_EVL_VALUER" },
            { type: "GRID", id: "grdData_EVL_USER" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    if (gw_com_module.objValidate(args) == false) return false;
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

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
function processSelectValuer(param) {

    v_global.event.data = param;
    v_global.event.data.evl_seq = 1;
    var args = {
        type: "PAGE", page: "EVL_1012", title: "평가자 및 평가대상자 등록",
        width: 1100, height: 500, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "EVL_1012",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_EVL" },
            { type: "GRID", id: "grdData_EVL_USER" }
        ]
    };
    return gw_com_module.objUpdatable(args);

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
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                } else
                                    processRemove(param.data.arg);
                            }
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
                    case "EVL_1011":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "EVL_1012":
                    case "EVL_1013":
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
                    case "EVL_1011":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue("frmOption", 1, "evl_no", param.data.evl_no);
                                gw_com_api.setValue("frmOption", 1, "evl_year", param.data.evl_year);
                                processRetrieve({});
                                processSelectValuer(param.data);                                
                            }
                        }
                        break;
                    case "EVL_1012":
                        {
                            //if (param.data != undefined) {
                                var args = { type: "GRID", object: "grdData_EVL", row: "selected" };
                                processRetrieve(args);
                            //}
                        }
                        break;
                    case "EVL_1013":
                        {
                            //if (param.data != undefined) {
                            var args = { type: "GRID", object: "grdData_EVL_VALUER", row: "selected" };
                            processRetrieve(args);
                            //}
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//