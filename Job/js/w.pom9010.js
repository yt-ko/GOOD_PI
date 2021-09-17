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

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM81" }
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
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "로그인", value: "로그인", icon: "기타", updatable: true },
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "리셋", value: "비밀번호 초기화", icon: "기타", updatable: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        if (gw_com_module.v_Session.USER_TP == "SYS")
            args = {
                targetid: "lyrMenu_1", type: "FREE",
                element: [
                    { name: "로그인", value: "로그인", icon: "기타" },
                    { name: "조회", value: "조회", act: true },
                    { name: "추가", value: "추가" },
                    { name: "삭제", value: "삭제" },
                    { name: "저장", value: "저장" },
                    { name: "리셋", value: "비밀번호 초기화", icon: "기타" },
                    { name: "리셋2", value: "전체 비밀번호 초기화", icon: "기타" },
                    { name: "닫기", value: "닫기" }
                ]
            };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, border: true, show: true,// margin: 80,
            editable: { focus: "user_nm", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "area_cd", label: { title: "장비군 :" }, hidden: true,
                                editable: {
                                    type: "select",
                                    data: { memory: "장비군", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "user_id", label: { title: "거래처코드 :" },
                                editable: { type: "text", size: 7, maxlength: 20 }
                            },
                            {
                                name: "user_nm", label: { title: "협력사명 :" },
                                editable: { type: "text", size: 12, maxlength: 20 }
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
            targetid: "grdData_협력사", query: "w_pom9010_M_1", title: "협력사 목록",
            height: 200, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "거래처코드", name: "user_id", width: 180, align: "center", //mask: "search",
                    editable: { bind: "create", type: "text", validate: { rule: "required", message: "거래처코드" } }
                },
                {
                    header: "사용자명", name: "user_nm", width: 410, align: "left",
                    editable: { type: "text", validate: { rule: "required", message: "사용자명" } }
                },
                {
                    header: "로그인ID", name: "login_id", width: 200, align: "center",
                    editable: { type: "text", validate: { rule: "required", message: "로그인ID" } }
                },
                {
                    header: "로그인PW", name: "user_pw", width: 240, align: "center",
                    editable: { type: "hidden", validate: { rule: "required", message: "로그인PW" } },
                    hidden: true
                },
                {
                    header: "사용", name: "use_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "제조", name: "scm_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "도면", name: "dwg_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { name: "role_id", hidden: true, editable: { type: "hidden" } },
                { name: "user_tp", hidden: true, editable: { type: "hidden" } },
                { name: "emp_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_협력사", query: "w_pom9010_S_1", type: "TABLE", title: "협력사 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "rgst_no", validate: true },
            content: {
                width: { label: 90, field: 350 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, type: "label", value: "거래처코드", format: { type: "label" } },
                            { name: "user_id", editable: { type: "hidden" } },
                            { header: true, value: "사업자등록번호", format: { type: "label" } },
                            { name: "rgst_no", mask: "biz-no", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대표전화", format: { type: "label" } },
                            { name: "tel_no", editable: { type: "text" } },
                            { header: true, value: "대표팩스", format: { type: "label" } },
                            { name: "fax_no", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "우편번호", format: { type: "label" } },
                            { name: "zip_no", editable: { type: "text" } },
                            { header: true, value: "대표자명", format: { type: "label" } },
                            { name: "prsdnt_nm", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "회사주소", format: { type: "label" } },
                            { name: "addr1", editable: { type: "text" } },
                            { header: true, value: "회사주소 상세", format: { type: "label" } },
                            { name: "addr2", editable: { type: "text" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_담당자", query: "w_pom9010_D_1", title: "담당자 정보",
            caption: true, height: 69, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "emp_nm", validate: true },
            element: [
                {
                    header: "담당자", name: "emp_nm", width: 80, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "장비군", name: "area_cd", width: 80, align: "center",
                    format: { type: "select", data: { memory: "장비군" } },
                    editable: { type: "select", data: { memory: "장비군" } }
                },
                {
                    header: "발주서수신", name: "mail01_yn", width: 60, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "NCR수신", name: "mail02_yn", width: 60, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "부서", name: "dept_nm", width: 130,
                    editable: { type: "text", maxlength: 15 }
                },
                {
                    header: "호칭", name: "pos_nm", width: 80, align: "center",
                    editable: { type: "text", maxlength: 15 }
                },
                {
                    header: "E-Mail", name: "email", width: 190,
                    editable: { type: "text", maxlength: 50 }
                },
                {
                    header: "휴대폰번호", name: "hp_no", width: 120, align: "center",
                    editable: { type: "text", maxlength: 20 }
                },
                {
                    header: "전화번호", name: "tel_no", width: 120, align: "center",
                    editable: { type: "text", maxlength: 20 }
                },
                {
                    header: "팩스번호", name: "fax_no", width: 120, align: "center",
                    editable: { type: "text", maxlength: 20 }
                },
                { name: "user_id", hidden: true, editable: { type: "hidden" } },
                { name: "user_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_협력사", offset: 8 },
                { type: "FORM", id: "frmData_협력사", offset: 8 },
                { type: "GRID", id: "grdData_담당자", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

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
        var args = { targetid: "lyrMenu_1", element: "로그인", event: "click", handler: click_lyrMenu_1_로그인 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: click_lyrMenu_1_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "리셋", event: "click", handler: processResetPW };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "리셋2", event: "click", handler: processResetPW };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: click_lyrMenu_1_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: click_lyrMenu_1_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: click_lyrMenu_1_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: click_lyrMenu_2_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: click_lyrMenu_2_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_협력사", grid: true, event: "rowselecting", handler: rowselecting_grdData_협력사 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_협력사", grid: true, event: "rowselected", handler: rowselected_grdData_협력사 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_협력사", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "grdData_협력사", grid: true, event: "itemdblclick", handler: itemdblclick_grdData_협력사 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_협력사", grid: true, event: "itemkeyenter", handler: itemdblclick_grdData_협력사 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_로그인(ui) {

            var row = gw_com_api.getSelectedRow("grdData_협력사");
            if (row > 0) {
                if (gw_com_api.getValue("grdData_협력사", row, "use_yn", true) != "1") {
                    gw_com_api.messageBox([{ text: "미사용 사용자는 로그인 할 수 없습니다." }], 420);
                    return;
                }

                //var args = {
                //    request: "PAGE",
                //    url: "../Service/svc_Auth.aspx" +
                //        "?QUERY=PLM_AUTH_ID" +
                //        "&arg_login_id=" + gw_com_api.getValue("grdData_협력사", row, "login_id", true),
                //    block: true,
                //    handler_success: successRequest
                //};
                //gw_com_module.callRequest(args);
                //function successRequest(data) {
                //    parent.parent.location.reload();
                //}

                var url = getSRMURL({});
                url = url + "/Master/GoodPLM.aspx?user_id=" + gw_com_api.getValue("grdData_협력사", row, "login_id", true) + "&passwd=" + gw_com_api.getValue("grdData_협력사", row, "user_pw", true);
                var win = window.open(url, "srm", "");
                if (win != null) win.focus();
            }
        }
        //----------
        function click_lyrMenu_1_조회(ui) {

            var args = {
                target: [
                    {
                        id: "frmOption",
                        focus: true
                    }
                ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_담당자",
                edit: true,
                data: [
                    { name: "user_id", value: gw_com_api.getValue("grdData_협력사", "selected", "user_id", true) },
                    { name: "area_cd", value: "CM" }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_담당자",
                row: "selected",
                select: true
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_협력사(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_협력사(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemdblclick_grdData_협력사(ui) {

            switch (ui.element) {
                case "user_id":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_supplier_user",
                            title: "협력사 사용자 검색",
                            width: 600,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_supplier_user",
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();

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

    closeOption({});

    return gw_com_api.getCRUD("grdData_협력사", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            { type: "GRID", id: "grdData_협력사" },
            { type: "FORM", id: "frmData_협력사" },
            { type: "GRID", id: "grdData_담당자" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmOption"
            }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    v_global.logic.area_cd = gw_com_api.getValue("frmOption", 1, "area_cd");

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "area_cd", argument: "arg_area_cd" },
                { name: "user_id", argument: "arg_user_id" },
                { name: "user_nm", argument: "arg_user_nm" }
            ],
            remark: [
                { element: [{ name: "area_cd" }] },
                { element: [{ name: "user_id" }] },
                { element: [{ name: "user_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_협력사", select: true }
        ],
        clear: [
            { type: "FORM", id: "frmData_협력사" },
            { type: "GRID", id: "grdData_담당자" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_협력사", row: "selected", block: true,
            element: [
                { name: "user_id", argument: "arg_user_id" }
            ],
            argument: [
                { name: "arg_area_cd", value: v_global.logic.area_cd }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_협력사" },
            { type: "GRID", id: "grdData_담당자" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_협력사", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    v_global.event.type = "GRID";
    v_global.event.object = "grdData_협력사";
    v_global.event.element = "user_id";
    var args = {
        type: "PAGE", page: "w_find_supplier_user", title: "협력사 사용자 검색",
        width: 600, height: 460, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_find_supplier_user",
            param: {
                ID: gw_com_api.v_Stream.msg_selectSupplier
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processItemchanged(param) {

    // 신규 row일 경우 비밀번호 초기화..
    if (param.object == "grdData_협력사") {
        if (param.element == "login_id") {
            if (gw_com_api.getCRUD(param.object, param.row, true) == "create") {
                gw_com_api.setValue(param.object, param.row, "user_pw", gw_com_site.encPass(param.value.current), true, true, true);
            }
        }
    }

}
//----------
function processResetPW(param) {

    if (param.element == "리셋") {

        if (gw_com_api.getSelectedRow("grdData_협력사") < 1) return;
        var login_id = gw_com_api.getValue("grdData_협력사", "selected", "login_id", true);
        var pw = gw_com_site.encPass(login_id);
        if (gw_com_api.getUpdatable("grdData_협력사", true)) {
            gw_com_api.setValue("grdData_협력사", "selected", "user_pw", pw, true, true, true);
            gw_com_api.messageBox([{ text: "비밀번호가 로그인ID로 초기화 되었습니다." }, { text: "저장버튼을 눌러야 반영됩니다." }]);
        } else {
            var args = {
                url: "COM",
                nomessage: true,
                param: [
                    {
                        query: $("#grdData_협력사_data").attr("query"),
                        row: [
                            {
                                crud: "U",
                                column: [
                                    { name: "user_id", value: gw_com_api.getValue("grdData_협력사", "selected", "user_id", true) },
                                    { name: "user_pw", value: pw }
                                ]
                            }
                        ]
                    }
                ],
                handler: {
                    success: successResetPW
                }
            };
            gw_com_module.objSave(args);;
        }

    } else if (param.element == "리셋2") {

        var ids = gw_com_api.getRowIDs("grdData_협력사");
        if (ids.length > 0) {

            var p = {
                handler: processResetPW,
                param: { element: "리셋2_확인" }
            };
            gw_com_api.messageBox([{ text: "조회된 모든 사용자의 비밀번호를 로그인ID로 초기화 하시겠습니까?" }], 500, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);

        }

    } else if (param.element == "리셋2_확인") {

        var ids = gw_com_api.getRowIDs("grdData_협력사");
        var row = new Array();
        $.each(ids, function () {

            var pw = gw_com_site.encPass(gw_com_api.getValue("grdData_협력사", this, "login_id", true));
            row.push({
                crud: "U",
                column: [
                    { name: "user_id", value: gw_com_api.getValue("grdData_협력사", this, "user_id", true) },
                    { name: "user_pw", value: pw }
                ]
            });

        })

        if (row.length > 0) {

            var args = {
                url: "COM",
                nomessage: true,
                param: [
                    {
                        query: $("#grdData_협력사_data").attr("query"),
                        row: row
                    }
                ],
                handler: {
                    success: successResetPW
                }
            };
            gw_com_module.objSave(args);;

        }

    }

}
//----------
function successResetPW(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

    gw_com_api.messageBox([{ text: "비밀번호가 로그인ID로 초기화 되었습니다." }]);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_협력사",row: "selected",
        clear: [
            { type: "FORM", id: "frmData_협력사" },
            { type: "GRID", id: "grdData_담당자" }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_협력사" },
            { type: "FORM", id: "frmData_협력사" },
            { type: "GRID", id: "grdData_담당자" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
            {
                type: "GRID", id: "grdData_협력사",
                key: [{ row: "selected", element: [{ name: "user_id" }] }]
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_협력사",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_협력사" },
            { type: "GRID", id: "grdData_담당자" }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_협력사"
        });
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
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    //if (param.focus) {
    //    gw_com_api.setFocus(v_global.event.object,
    //                        v_global.event.row,
    //                        v_global.event.element,
    //                        (v_global.event.type == "GRID") ? true : false);
    //}

}
//----------
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    //processDelete({});
    processRetrieve({});

}
//----------
function getSRMURL(param) {

    var rtn = "";
    var args = {
        request: "DATA",
        name: "w_sys1050_S_1",
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=w_sys1050_S_1" +
            "&QRY_COLS=dcode,dname" +
            "&CRUD=R" +
            "&arg_hcode=SYS999" +
            "&arg_dname=" + encodeURIComponent("%"),
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        $.each(data, function () {
            if (this.DATA[0] == "SRM_URL") {
                rtn = this.DATA[1];
                return false;
            }
        });

    }
    return rtn;

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function(param) {

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
                    case gw_com_api.v_Message.msg_confirmBatch:
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
                    case gw_com_api.v_Message.msg_informRemoved:
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier_User:
            {
                if (param.data.exists_yn == "1") {
                    gw_com_api.showMessage("이미 등록된 협력사입니다.");
                } else {
                    var args = {
                        targetid: "grdData_협력사", edit: true, updatable: true,
                        data: [
                            { name: "user_id", value: param.data.user_id },
                            { name: "user_nm", value: param.data.supp_nm },
                            { name: "emp_no", value: param.data.supp_cd },
                            { name: "user_tp", value: param.data.user_tp },
                            { name: "role_id", value: param.data.role_id },
                            { name: "login_id", value: param.data.rgst_no },
                            { name: "user_pw", value: gw_com_site.encPass(param.data.rgst_no) },
                            { name: "use_yn", value: "1" }
                        ],
                        clear: [
                            { type: "FORM", id: "frmData_협력사" },
                            { type: "GRID", id: "grdData_담당자" }
                        ]
                    };
                    var row = gw_com_module.gridInsert(args);
                    var args = {
                        targetid: "frmData_협력사",
                        updatable: true,
                        data: [
                            { name: "user_id", value: param.data.user_id },
                            { name: "rgst_no", value: param.data.rgst_no },
                            { name: "hp_no", value: param.data.hp_no },
                            { name: "tel_no", value: param.data.tel_no },
                            { name: "fax_no", value: param.data.fax_no },
                            { name: "zip_no", value: param.data.zip_no },
                            { name: "addr1", value: param.data.addr1 },
                            { name: "addr2", value: param.data.addr2 },
                            { name: "prsdnt_nm", value: param.data.prsdnt_nm }
                        ]
                    };
                    gw_com_module.formInsert(args);
                    closeDialogue({ page: param.from.page, focus: true });
                }
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
                    case "w_find_supplier_user":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//