//------------------------------------------
// Process about Job Process.
//                Created by K (2019.10)
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
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_zcode",
                    param: [ { argument: "arg_hcode", value: "ISCM81" } ]
                }
            ],
            starter: start
        }; gw_com_module.selectSet(args);

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
            processInsert({});

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrRemark",
            row: [
                { name: "TEXT" }
            ]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrRemark",
            row: [
                {
                    name: "TEXT",
                    value: "※ 로그인ID 및 비밀번호는 입력한 사업자등록번호로 설정됩니다."
                }
            ]
        };
        gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
                { name: "추가", value: "담당자 등록" },
                { name: "삭제", value: "담당자 삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "w_pom9010_S_1", type: "TABLE", title: "협력사 정보",
            caption: true, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "user_nm", validate: true },
            content: {
                width: { label: 130, field: 820 }, height: 30,
                row: [
                    {
                        element: [
                            { header: true, type: "label", value: "협력사명", format: { type: "label" } },
                            { name: "user_nm", editable: { type: "text", maxlength: 50 }, validate: { rule: "required" } },
                            { name: "user_id", hidden: true, editable: { type: "hidden" } },
                            { name: "emp_no", hidden: true, editable: { type: "hidden" } },
                            { name: "user_pw", hidden: true, editable: { type: "hidden" } },
                            { name: "tel_no", hidden: true, editable: { type: "hidden" } },
                            { name: "fax_no", hidden: true, editable: { type: "hidden" } },
                            { name: "login_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "사업자등록번호", format: { type: "label" } },
                            {
                                name: "rgst_no", mask: "biz-no",
                                editable: { type: "text", validate: { rule: "required" }, width: 120 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대표자명", format: { type: "label" } },
                            { name: "prsdnt_nm", editable: { type: "text", maxlength: 50 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "우편번호", format: { type: "label" } },
                            { name: "zip_no", editable: { type: "text", maxlength: 10, width: 120 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "회사주소", format: { type: "label" } },
                            { name: "addr1", editable: { type: "text", maxlength: 100 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "회사주소 상세", format: { type: "label" } },
                            { name: "addr2", editable: { type: "text", maxlength: 100 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "w_pom9010_D_1", title: "담당자 정보",
            caption: true, height: 80, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "emp_nm", validate: true },
            element: [
                {
                    header: "담당자", name: "emp_nm", width: 80, align: "center",
                    editable: { type: "text", maxlength: 30 }
                },
                {
                    header: "장비군", name: "area_cd", width: 80, align: "center", hidden: true,
                    editable: { type: "hidden" }
                },
                {
                    header: "발주서수신", name: "mail01_yn", width: 60, align: "center", hidden: true,
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "NCR수신", name: "mail02_yn", width: 60, align: "center", hidden: true,
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "부서", name: "dept_nm", width: 130,
                    editable: { type: "text", maxlength: 15 }
                },
                {
                    header: "직함", name: "pos_nm", width: 80, align: "center",
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
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {
            switch (param.element) {
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        checkClosable({});
                    }
                    break;
                case "추가":
                    {
                        if (!checkManipulate()) return;
                        var args = {
                            targetid: "grdData_SUB",
                            edit: true,
                            data: [
                                { name: "user_id", value: gw_com_api.getValue("frmData_MAIN", 1, "user_id") },
                                { name: "area_cd", value: "CM" }
                            ]
                        };
                        gw_com_module.gridInsert(args);
                        gw_com_api.setValue("grdData_SUB", "selected", "user_id", gw_com_api.getValue("frmData_MAIN", 1, "user_id"));
                    }
                    break;
                case "삭제":
                    {
                        if (!checkManipulate()) return;
                        var args = { targetid: "grdData_SUB", row: "selected", select: true }
                        gw_com_module.gridDelete(args);
                    }
                    break;
            }

        }
        //=====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_user_id", value: param.user_id },
                { name: "arg_area_cd", value: "" }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function checkCRUD(param) {

    closeOption({});

    return gw_com_api.getCRUD("frmData_MAIN", "selected");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processInsert(param) {

    var args = {
        targetid: "frmData_MAIN",
        clear: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    gw_com_module.formInsert(args);
    //----------
    var ele = $("#" + args.targetid + "_data").find("input[type=text]");
    $.each(ele, function () {
        $(this).css("border-top-style", "none");
        $(this).css("border-left-style", "none");
        $(this).css("border-right-style", "none");
    })

}
//----------
function processItemchanged(param) {
    // 사업자번호 중복 체크
    if (param.element == "rgst_no") {
        var val = gw_com_api.unMask(param.value.current, "biz-no");
        if (checkRgstNo({ rgst_no: val })) {
            // 신규일 경우 비밀번호 초기화..
            if (gw_com_api.getCRUD(param.object, param.row, (param.type == "GRID")) == "create") {
                gw_com_api.setValue(param.object, param.row, "user_pw", gw_com_site.encPass(val), (param.type == "GRID"), true, true);
            }
        } else {
            gw_com_api.messageBox([{ text: "이미 등록된 사업자번호입니다." }]);
            gw_com_api.setValue(param.object, param.row, param.element, "", (param.type == "GRID"), false, false);
        }
    }
}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
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

    var status = checkCRUD({});
    if (status == "create" || status == "update") {

        var user_id = "";
        $.each(response, function () {
            $.each(this.KEY, function () {
                if (this.NAME == "user_id") {
                    user_id = this.VALUE;
                    return false;
                }
            });
        });
        processClose({ data: { user_id: user_id } });

    } else
        processClose({});

}
//----------
function processClear(param) {

    processInsert({});

    //var args = {
    //    target: [
    //        { type: "FORM", id: "frmData_MAIN" },
    //        { type: "GRID", id: "grdData_SUB" }
    //    ]
    //};
    //gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

}
//----------
function checkRgstNo(param) {

    var rtn = true;
    if (param.rgst_no != "") {

        var args = {
            request: "PAGE",
            name: "DLG_SUPPLIER_ADD_CHK1",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=DLG_SUPPLIER_ADD_CHK1" +
                "&QRY_COLS=rgst_yn" +
                "&CRUD=R" +
                "&arg_rgst_no=" + param.rgst_no,
            async: false,
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {

            if (data.DATA != undefined && data.DATA.length > 0) {

                rtn = (data.DATA[0] == "0");

            }

        }

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                gw_com_module.streamInterface(args);

                // 기존 협력사 정보 수정의 경우
                if (param.data != undefined && param.data.user_id != undefined && param.data.user_id != "")
                    processRetrieve({ user_id: param.data.user_id })
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