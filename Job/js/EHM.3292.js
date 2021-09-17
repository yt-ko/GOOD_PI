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

        //----------
        var args = {
            request: [
                {
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "당사", value: "EMP" },
                        { title: "SETUP 공급사", value: "SUPP" }
                    ]
                },
                {
                    type: "PAGE", name: "등급", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM54" }]
                },
                {
                    type: "INLINE", name: "사용",
                    data: [
                        { title: "사용", value: "1" },
                        { title: "미사용", value: "0" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
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
                { name: "추가", value: "추가" },
                { name: "복사", value: "복사", icon: "기타" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
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
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA"/*, unshift: [{ title: "전체", value: "%" }]*/ } }
                            },
                            {
                                name: "user_tp", label: { title: "구분 :" },
                                editable: { type: "select", data: { memory: "구분", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "use_yn", label: { title: "사용 :" }, value: "1",
                                editable: { type: "select", data: { memory: "사용", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_nm", label: { title: "부서 :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "user_nm", label: { title: "작업자 :" },
                                editable: { type: "text", size: 14 }
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
            targetid: "grdData_1", query: "EHM_3292_1", title: "작업자",
            caption: false, height: 450, show: true, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn", focus: "dcode", validate: true },
            element: [
                { header: "구분", name: "user_tp_nm", width: 100 },
                { header: "부서", name: "dept_nm", width: 230 },
                {
                    header: "작업자", name: "user_nm", width: 120,
                    editable: { type: "text", validate: { rule: "required", message: "작업자" }, maxlength: 50, bind: "create" }
                },
                {
                    header: "인증등급", name: "cert_level", width: 100, align: "center",
                    editable: { type: "select", data: { memory: "등급" } /*, validate: { rule: "required", message: "인증등급" }*/ }
                },
                {
                    header: "인증일", name: "cert_date", width: 120, align: "center",
                    editable: { type: "text" }, mask: "date-ymd"
                },
                {
                    header: "사용", name: "use_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "수정자", name: "upd_usr_nm", width: 80, align: "center" },
                { header: "수정일시", name: "upd_dt", width: 150, align: "center" },
                { name: "user_seq", editable: { type: "hidden" }, hidden: true },
                { name: "user_id", editable: { type: "hidden" }, hidden: true },
                { name: "user_tp", editable: { type: "hidden" }, hidden: true },
                { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                { name: "dept_area", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_1", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: click_lyrMenu_복사 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            if (ui.object == "lyrMenu" && ui.element == "조회") {
                var args = { target: [{ id: "frmOption", focus: true }] };
                gw_com_module.objToggle(args);
            } else {
                processRetrieve({});
            }

        }
        //----------
        function click_lyrMenu_추가(ui) {

            v_global.event.data = {
                user_tp: "EMP"
            };
            var args = {
                type: "PAGE", page: "DLG_USER", title: "작업자 등록",
                width: 600, height: 430, locate: ["center", "center"], open: true,
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_USER",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }


        }
        //----------
        function click_lyrMenu_복사(ui) {

            if (gw_com_api.getSelectedRow("grdData_1") > 0) {
                var user_tp = gw_com_api.getValue("grdData_1", "selected", "user_tp", true);
                if (user_tp != "SUPP") {
                    //gw_com_api.messageBox([{ text: "SETUP 공급사 작업자만 복사할 수 있습니다." }]);
                    //return false;
                    var args = { targetid: "grdData_1", row: "selected", edit: true };
                    gw_com_module.gridEdit(args);
                    gw_com_api.setValue("grdData_1", "selected", "use_yn", "0", true);
                }
                var args = {
                    targetid: "grdData_1", edit: true, updatable: true,
                    data: [
                        { name: "user_id", rule: "COPY", row: "selected" },
                        { name: "user_nm", rule: "COPY", row: "selected" },
                        { name: "user_tp", rule: "COPY", row: "selected" },
                        { name: "user_tp_nm", rule: "COPY", row: "selected" },
                        { name: "dept_cd", rule: "COPY", row: "selected" },
                        { name: "dept_nm", rule: "COPY", row: "selected" },
                        { name: "cert_level", rule: "COPY", row: "selected" },
                        { name: "cert_date", rule: "COPY", row: "selected" },
                        { name: "dept_area", rule: "COPY", row: "selected" },
                        { name: "use_yn", value: "1" },
                        { name: "_edit_yn", value: "1" }
                    ]
                };
                gw_com_module.gridInsert(args);
            }

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            var idx = gw_com_api.getValue("grdData_1", "selected", "user_seq", true);
            if (idx != "") {
                if (chkDeletable(idx)) {
                    processDelete({});
                } else {
                    gw_com_api.messageBox([{ text: "사용된 코드는 삭제할 수 없습니다." }]);
                }
            }

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        processRetrieve({});

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

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "user_tp", argument: "arg_user_tp" },
                { name: "dept_nm", argument: "arg_dept_nm" },
                { name: "user_nm", argument: "arg_user_nm" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "use_yn", argument: "arg_use_yn" },
            ],
            remark: [
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "user_tp" }] },
                { element: [{ name: "use_yn" }] },
                { element: [{ name: "dept_nm" }] },
                { element: [{ name: "user_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_1", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function chkDeletable(user_seq) {

    var rtn = false;
    var args = {
        request: "DATA",
        name: "EHM_3292_1_CHK_DEL",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3292_1_CHK_DEL" +
            "&QRY_COLS=deletable" +
            "&CRUD=R" +
            "&arg_user_seq=" + user_seq,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        if (data.DATA[0] == "1")
            rtn = true;

    }
    return rtn;

}
//----------
function processDelete(param) {

    var args = { targetid: "grdData_1", row: "selected", select: true, check: "_edit_yn" };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_1" }
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
function isNumeric(n) {

    return !isNaN(parseFloat(n)) && isFinite(n);

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
                                processSave({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
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
                    case "DLG_USER":
                        args.ID = param.ID;
                        args.data = v_global.logic.popup_data;
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                switch (param.from.page) {
                    case "DLG_USER":
                        if (param.data != undefined) {

                            var dept_area = gw_com_api.getValue("frmOption", 1, "dept_area");
                            var args;
                            if (param.data.user_tp == "EMP") {
                                args = {
                                    targetid: "grdData_1", edit: true, updatable: true,
                                    data: [
                                        { name: "user_id", value: param.data.user_id },
                                        { name: "user_nm", value: param.data.user_nm },
                                        { name: "user_tp", value: param.data.user_tp },
                                        { name: "user_tp_nm", value: param.data.user_tp },
                                        { name: "dept_cd", value: param.data.dept_cd },
                                        { name: "dept_nm", value: param.data.dept_nm },
                                        { name: "dept_area", value: dept_area },
                                        { name: "use_yn", value: "1" },
                                        { name: "_edit_yn", value: "1" }
                                    ]
                                };
                            } else {
                                args = {
                                    targetid: "grdData_1", edit: true, updatable: true,
                                    data: [
                                        { name: "user_id", value: param.data.user_id },
                                        //{ name: "user_nm", value: param.data.user_nm },
                                        { name: "user_tp", value: param.data.user_tp },
                                        { name: "user_tp_nm", value: param.data.user_tp },
                                        { name: "dept_cd", value: param.data.user_id },
                                        { name: "dept_nm", value: param.data.user_nm },
                                        { name: "dept_area", value: dept_area },
                                        { name: "use_yn", value: "1" },
                                        { name: "_edit_yn", value: "1" }
                                    ]
                                };
                            }

                            gw_com_module.gridInsert(args);

                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//