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
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "w_pom9010_S_1", type: "TABLE", title: "협력사 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "user_nm", validate: true },
            content: {
                width: { label: 120, field: 250 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "협력사명", format: { type: "label" } },
                            { name: "user_nm", editable: { type: "text", maxlength: 50, validate: { rule: "required", message: "협력사명" } } },
                            { name: "user_id", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "사업자등록번호", format: { type: "label" } },
                            { name: "rgst_no", mask: "biz-no", editable: { type: "text", validate: { rule: "required", message: "사업자등록번호" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대표자명", format: { type: "label" } },
                            { name: "prsdnt_nm", editable: { type: "text", validate: { rule: "required", message: "대표자명" } } },
                            { header: true, value: "대표전화", format: { type: "label" } },
                            { name: "tel_no", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대표팩스", format: { type: "label" } },
                            { name: "fax_no", editable: { type: "text" } },
                            { header: true, value: "우편번호", format: { type: "label" } },
                            { name: "zip_no", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "회사주소", format: { type: "label" } },
                            { name: "addr1", editable: { type: "text", maxlength: 150 } },
                            { header: true, value: "회사주소 상세", format: { type: "label" } },
                            { name: "addr2", editable: { type: "text", maxlength: 150 } },
                            { name: "temp_yn", editable: { type: "hidden" }, hidden: true, display: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUB", query: "w_pom9010_S_1", type: "TABLE", title: "협력사 담당자 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "rgst_no", validate: true },
            content: {
                width: { label: 100, field: 140 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "담당자명", format: { type: "label" } },
                            { name: "emp_nm", editable: { type: "text", validate: { rule: "required", message: "담당자명" } } },
                            { header: true, value: "부서", format: { type: "label" } },
                            { name: "dept_nm", editable: { type: "text" } },
                            { header: true, value: "직책", format: { type: "label" } },
                            { name: "pos_nm", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "휴대폰", format: { type: "label" } },
                            { name: "hp_no", editable: { type: "text" } },
                            { header: true, value: "사무실전화", format: { type: "label" } },
                            { name: "tel_no", editable: { type: "text" } },
                            { header: true, value: "팩스", format: { type: "label" } },
                            { name: "fax_no", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            {
                                name: "email", style: { colspan: 3 },
                                format: { width: 386 },
                                editable: { type: "text", width: 384, validate: { rule: "required", message: "E-Mail" } }
                            },
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "area_cd", editable: { type: "select", data: { memory: "장비군" }, validate: { rule: "required", message: "장비군" } } },
                            { name: "user_id", editable: { type: "hidden" }, hidden: true },
                            { name: "user_seq", editable: { type: "hidden" }, hidden: true }
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
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
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
function processButton(param) {

    switch (param.element) {
        case "저장":
            {
                closeOption({});
                processSave({});
            }
            break;
        case "닫기":
            {
                //checkClosable({});
                processClose({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.element == "rgst_no") {
        var rgst_no = gw_com_api.unMask(param.value.current, "biz-no");
        var chk = Query.chkRgstNo({ rgst_no: rgst_no });
        if (chk.err == "1" && rgst_no != "") {
            gw_com_api.showMessage(chk.msg);
            gw_com_api.setValue(param.object, param.row, "user_id", "", false, true, false);
            gw_com_api.setValue(param.object, param.row, "rgst_no", "", false, false, false);
            gw_com_api.setFocus(param.object, param.row, param.element);
            return false;
        } else {
            gw_com_api.setValue(param.object, param.row, "user_id", chk.supp_cd == "" ? rgst_no : chk.supp_cd);
            gw_com_api.setValue(param.object, param.row, "temp_yn", chk.supp_cd == "" ? "1" : "0"); // 임시 거래처(ERP 미등록) 여부
        }
    }

}
//----------
function checkCRUD(param) {

    closeOption({});

    return gw_com_api.getCRUD("frmData_MAIN", 1);

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
            { type: "FORM", id: "frmData_MAIN" }
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
        targetid: "frmData_MAIN", edit: true, updatable: true
    };
    gw_com_module.formInsert(args);

    args = {
        targetid: "frmData_SUB", edit: true, updatable: true,
        data: [
            { name: "user_seq", value: 1 }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_SUB" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var rawdata = {
        user_id: gw_com_api.getValue("frmData_MAIN", 1, "user_id"),
        user_nm: gw_com_api.getValue("frmData_MAIN", 1, "user_nm"),
        rgst_no: gw_com_api.unMask(gw_com_api.getValue("frmData_MAIN", 1, "rgst_no"), "biz-no"),
        prsdnt_nm: gw_com_api.getValue("frmData_MAIN", 1, "prsdnt_nm"),
        tel_no: gw_com_api.getValue("frmData_MAIN", 1, "tel_no"),
        fax_no: gw_com_api.getValue("frmData_MAIN", 1, "fax_no"),
        zip_no: gw_com_api.getValue("frmData_MAIN", 1, "zip_no"),
        addr1: gw_com_api.getValue("frmData_MAIN", 1, "addr1"),
        addr2: gw_com_api.getValue("frmData_MAIN", 1, "addr2"),
        emp_nm: gw_com_api.getValue("frmData_SUB", 1, "emp_nm"),
        emp_dept_nm: gw_com_api.getValue("frmData_SUB", 1, "dept_nm"),
        emp_pos_nm: gw_com_api.getValue("frmData_SUB", 1, "pos_nm"),
        emp_hp_no: gw_com_api.getValue("frmData_SUB", 1, "hp_no"),
        emp_tel_no: gw_com_api.getValue("frmData_SUB", 1, "tel_no"),
        emp_fax_no: gw_com_api.getValue("frmData_SUB", 1, "fax_no"),
        emp_email: gw_com_api.getValue("frmData_SUB", 1, "email"),
        emp_area_cd: gw_com_api.getValue("frmData_SUB", 1, "area_cd"),
        temp_yn: gw_com_api.getValue("frmData_MAIN", 1, "temp_yn")
    }

    var data = [
        {
            query: "w_pom9010_M_1",
            row: [{
                crud: "C",
                column: [
                    { name: "user_id", value: rawdata.user_id },
                    { name: "user_nm", value: rawdata.user_nm },
                    { name: "user_tp", value: "SUPP" },
                    { name: "login_id", value: rawdata.rgst_no },
                    { name: "emp_no", value: rawdata.rgst_no },
                    { name: "role_id", value: "S001" },
                    { name: "use_yn", value: "1" },
                    { name: "user_pw", value: gw_com_site.encPass(rawdata.rgst_no) }
                ]
            }]
        },
        {
            query: "w_pom9010_S_1",
            row: [{
                crud: "C",
                column: [
                    { name: "user_id", value: rawdata.user_id },
                    { name: "rgst_no", value: rawdata.rgst_no },
                    { name: "prsdnt_nm", value: rawdata.prsdnt_nm },
                    { name: "tel_no", value: rawdata.tel_no },
                    { name: "fax_no", value: rawdata.fax_no },
                    { name: "zip_no", value: rawdata.zip_no },
                    { name: "addr1", value: rawdata.addr1 },
                    { name: "addr2", value: rawdata.addr2 }
                ]
            }]
        },
        {
            query: "w_pom9010_D_1",
            row: [{
                crud: "C",
                column: [
                    { name: "user_id", value: rawdata.user_id },
                    { name: "user_seq", value: 1 },
                    { name: "emp_nm", value: rawdata.emp_nm },
                    { name: "area_cd", value: rawdata.emp_area_cd },
                    { name: "dept_nm", value: rawdata.emp_dept_nm },
                    { name: "pos_nm", value: rawdata.emp_pos_nm },
                    { name: "email", value: rawdata.emp_email },
                    { name: "hp_no", value: rawdata.emp_hp_no },
                    { name: "tel_no", value: rawdata.emp_tel_no },
                    { name: "fax_no", value: rawdata.emp_fax_no },
                    { name: "mail01_yn", value: "1" },
                    { name: "use_yn", value: "1" }
                ]
            }]
        }
    ]

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        nomessage: true,
        param: data,
        handler: {
            success: successSave,
            param: rawdata
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    gw_com_api.showMessage("", "success");
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param
    };
    gw_com_module.streamInterface(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
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
var Query = {
    chkRgstNo: function (param) {
        var rtn = {};
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=w_pom9010_chk_rgst" +
                    "&QRY_COLS=err,err_msg,supp_cd" +
                    "&CRUD=R" +
                    "&arg_rgst_no=" + param.rgst_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = {
                err: data[0].DATA[0],
                msg: data[0].DATA[1],
                supp_cd: data[0].DATA[2]
            };
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
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
                //if (param.data.page != gw_com_api.getPageID()) {
                //    param.to = { type: "POPUP", page: param.data.page };
                //    gw_com_module.streamInterface(param);
                //    break;
                //}
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                processInsert({});
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