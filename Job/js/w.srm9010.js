//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: { key: null }, logic: {}
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
                { name: "도장", value: "도장 이미지", icon: "기타" },
                { name: "비번", value: "비밀번호 변경", icon: "기타" },
                { name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_PASSWD", type: "FREE", remark: "lyrRemark",
            trans: true, border: true, show: false, margin: 180,
            editable: { focus: "current_passwd", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "current_passwd", label: { title: "현재 비밀번호 :" }, encrypt: true,
                                editable: { type: "text", size: 15, maxlength: 20, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "new_passwd", label: { title: "새로운 비밀번호 :" }, encrypt: true,
                                editable: { type: "text", size: 15, maxlength: 20, validate: { rule: "required" } },
                                tip: { text: "비밀번호는 6~20자의 대/소문자,숫자,특수문자를 혼합해서 사용하실 수 있습니다.", color: "#505050" }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "confirm_passwd", label: { title: "비밀번호 확인 :" }, encrypt: true,
                                editable: { type: "text", size: 15, maxlength: 20, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        align: "center",
                        element: [
                            { name: "실행", value: "확인", act: true, format: { type: "button" } },
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
            targetid: "grdData_협력사", query: "w_srm9010_M_1", title: "로그인 정보",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "거래처코드", name: "user_id", width: 90,
                    align: "center", mask: "search", editable: { type: "hidden" }
                },
                { header: "사용자명", name: "user_nm", width: 180, align: "left" },
                { header: "로그인ID", name: "login_id", width: 100, align: "center" },
                { name: "user_pw", hidden: true }
                //{
                //    header: "로그인PW", name: "user_pw", width: 100, align: "center",
                //    editable: { type: "text", validate: { rule: "required", message: "로그인PW" } }
                //}
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_협력사", query: "w_srm9010_S_1", type: "TABLE", title: "상세 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "rgst_no", validate: true },
            content: {
                width: { label: 80, field: 200 }, height: 25,
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
                            { name: "addr1", editable: { type: "text", width: 697 } },
                            { header: true, value: "회사주소 상세", format: { type: "label" } },
                            { name: "addr2", editable: { type: "text", width: 697 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_담당자", query: "w_srm9010_D_1", title: "담당자 정보",
            caption: true, height: 86, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "emp_nm", validate: true },
            element: [
                {
                    header: "담당자", name: "emp_nm", width: 80, align: "center",
                    editable: { type: "text", validate: { rule: "required", message: "담당자" } }
                },
                {
                    header: "장비군", name: "area_cd", width: 80, align: "center",
                    format: { type: "select", data: { memory: "장비군" } },
                    editable: { type: "select", data: { memory: "장비군" } }
                },
                {
                    header: "부서", name: "dept_nm", width: 120, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "직책", name: "pos_nm", width: 100, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "E-Mail", name: "email", width: 170, align: "left",
                    editable: { type: "text" }
                },
                {
                    header: "핸드폰번호", name: "hp_no", width: 100, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "전화번호", name: "tel_no", width: 100, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "팩스번호", name: "fax_no", width: 100, align: "center",
                    editable: { type: "text" }
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
        var args = { targetid: "lyrMenu_1", element: "도장", event: "click", handler: click_lyrMenu_1_도장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "비번", event: "click", handler: click_lyrMenu_1_비번 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: click_lyrMenu_1_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: click_lyrMenu_1_저장 };
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
        var args = { targetid: "grdData_협력사", grid: true, event: "rowselecting", handler: rowselecting_grdData_협력사 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_협력사", grid: true, event: "rowselected", handler: rowselected_grdData_협력사 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_PASSWD", element: "실행", event: "click", handler: processChangePasswd };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_PASSWD", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_도장(ui) {

            v_global.event.data = {
                rgst_no: gw_com_api.getValue("frmData_협력사", 1, "rgst_no")
            }
            var args = {
                type: "PAGE", page: "ECM_2099", title: "전자계약용 도장 이미지",
                width: 300, height: 370, locate: ["center", 20], open: true,
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
        //----------
        function click_lyrMenu_1_비번(ui) {

            gw_com_api.show("frmData_PASSWD");

        }
        //----------
        function click_lyrMenu_1_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_담당자",
                edit: true,
                data: [
                    { name: "user_id", value: gw_com_api.getValue("grdData_협력사", "selected", "user_id", true) }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_담당자",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function closeOption(param) {

    gw_com_api.hide("frmData_PASSWD");
    gw_com_api.setValue("frmData_PASSWD", 1, "current_passwd", "");
    gw_com_api.setValue("frmData_PASSWD", 1, "new_passwd", "");
    gw_com_api.setValue("frmData_PASSWD", 1, "confirm_passwd", "");

}
//----------
function checkCRUD() {

    return gw_com_api.getCRUD("grdData_협력사", "selected", true);

}
//----------
function checkManipulate() {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable() {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_협력사"
            },
            {
                type: "FORM",
                id: "frmData_협력사"
            },
            {
                type: "GRID",
                id: "grdData_담당자"
            }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve() {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_user_id", value: v_global.data.key }
            ]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_협력사",
                select: true
            }
        ],
        clear: [
            {
                type: "FORM",
                id: "frmData_협력사"
            },
            {
                type: "GRID",
                id: "grdData_담당자"
            }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink() {

    var args = {
        source: {
            type: "GRID",
            id: "grdData_협력사",
            row: "selected",
            element: [
                {
                    name: "user_id",
                    argument: "arg_user_id"
                }
            ]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_협력사"
            },
            {
                type: "GRID",
                id: "grdData_담당자"
            }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_협력사", v_global.process.current.master, true, false);

}
//----------
function processSave() {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_협력사"
            },
            {
                type: "FORM",
                id: "frmData_협력사"
            },
            {
                type: "GRID",
                id: "grdData_담당자"
            }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processClose(param) {
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);
}
//----------
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

}
//----------
function processChangePasswd(param) {

    //필수입력 체크
    var args = {
        target: [
            { type: "FORM", id: "frmData_PASSWD" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var current_passwd = SHA256(gw_com_api.getValue("frmData_PASSWD", 1, "current_passwd"));
    var new_passwd = gw_com_api.getValue("frmData_PASSWD", 1, "new_passwd");
    var confirm_passwd = gw_com_api.getValue("frmData_PASSWD", 1, "confirm_passwd");
    
    if (current_passwd != gw_com_api.getValue("grdData_협력사", "selected", "user_pw", true)) {
        gw_com_api.messageBox([{ text: "현재 비밀번호가 일치하지 않습니다." }]);
        return;
    }
    if (new_passwd != confirm_passwd) {
        gw_com_api.messageBox([{ text: "새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다." }]);
        return;
    }
    if (current_passwd == SHA256(new_passwd) || new_passwd.length < 6) {
        gw_com_api.messageBox([{ text: "사용 불가능한 비밀번호입니다." }]);
        return;
    }
    
    gw_com_api.setValue("grdData_협력사", "selected", "user_pw", SHA256(confirm_passwd), true);
    var qry = {
        query: "w_srm9010_M_1",
        row: [{
            crud: "U",
            column: [
                { name: "user_id", value: v_global.data.key },
                { name: "user_pw", value: SHA256(confirm_passwd) }
            ]
        }]
    };
    
    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [qry],
        handler: { success: successChange },
        nomessage: true
    };
    gw_com_module.objSave(args);
}
//----------
function successChange(param) {

    closeOption({});
    gw_com_api.messageBox([{ text: "비밀번호가 변경되었습니다." }]);

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
        case gw_com_api.v_Stream.msg_myInformation:
            {
                v_global.data.key = param.data.key;
                processRetrieve();
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
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
                    case "ECM_2099":
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
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//