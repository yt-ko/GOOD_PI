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

        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

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
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "w_eccb1051_M_1", type: "TABLE", title: "담당자 지정",
            caption: false, show: true, selectable: true,
            editable: { focus: "act_emp1_nm", validate: true },
            content: {
                width: { label: 100, field: 250 }, height: 50,
                row: [
                    {
                        element: [
                            { header: true, value: "담당자1", format: { type: "label" } },
                            {
                                name: "act_emp1_nm", mask: "search", style: { colfloat: "float" }, display: true,
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "담당자1" } }
                            },
                            {
                                name: "act_dept1_nm", style: { colfloat: "floating" }, display: true,
                                editable: { type: "hidden" }
                            },
                            { name: "act_emp1", editable: { type: "hidden" }, hidden: true },
                            { name: "act_dept1", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "담당자2", format: { type: "label" } },
                            {
                                name: "act_emp2_nm", mask: "search", style: { colfloat: "float" }, display: true,
                                format: { type: "text", width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "act_dept2_nm", style: { colfloat: "floating" }, display: true,
                                editable: { type: "hidden" }
                            },
                            { name: "act_emp2", editable: { type: "hidden" }, hidden: true },
                            { name: "act_dept2", editable: { type: "hidden" }, hidden: true },
                            { name: "ecr_no", editable: { type: "hidden" }, hidden: true }
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmData_MAIN", event: "itemkeyenter", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "keydown", element: "act_emp1_nm", handler: processKeydown };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MAIN", event: "keydown", element: "act_emp2_nm", handler: processKeydown };
        gw_com_module.eventBind(args);
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
function processButton(param) {

    if (param.object == "lyrMenu") {
        switch (param.element) {
            case "저장":
                {
                    processSave({});
                }
                break;
            case "닫기":
                processClose();
                break;
        }
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN") {
        switch (param.element) {
            case "act_emp1_nm":
            case "act_emp2_nm":
                {
                    if (param.value.current == "") {
                        gw_com_api.setValue(param.object, param.row, param.element.replace("_nm", ""), "");
                        gw_com_api.setValue(param.object, param.row, param.element.replace("emp", "dept"), "");
                    }
                }
                break;
        }
    }

}
//----------
function processKeydown(param)
{
    if (event.keyCode == 46) {
        var code = param.element.substr(0, param.element.length - 3);
        if (param.element == "act_emp1_nm" || param.element == "act_emp2_nm") {
            var dept = code.replace("emp", "dept");
            gw_com_api.setValue(param.object, param.row, dept, "");
            gw_com_api.setValue(param.object, param.row, dept + "_nm", "");
        }
        gw_com_api.setValue(param.object, param.row, code, "");
        gw_com_api.setValue(param.object, param.row, param.element, "");
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "act_emp1_nm":
        case "act_emp2_nm":
            {
                v_global.event.value = param.element.replace("_nm", "");
                v_global.event.dept_cd = param.element.replace("_nm", "").replace("emp", "dept");
                v_global.event.dept_nm = param.element.replace("emp", "dept");
                var args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "center"], open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_find_emp",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectEmployee
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        default:
            {
                return;
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_crm_no", value: v_global.data.key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN", edit: true, updatable: true }
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
    
}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: "w_eccb1051_M_1",
                row: [
                    {
                        crud: "U",
                        column: [
                            { name: "ecr_no", value: v_global.data.ecr_no },
                            { name: "act_emp1", value: gw_com_api.getValue("frmData_MAIN", 1, "act_emp1") },
                            { name: "act_dept1", value: gw_com_api.getValue("frmData_MAIN", 1, "act_dept1") },
                            { name: "act_emp2", value: gw_com_api.getValue("frmData_MAIN", 1, "act_emp2") },
                            { name: "act_dept2", value: gw_com_api.getValue("frmData_MAIN", 1, "act_dept2") },
                        ]
                    }
                ]
            },
            {
                query: "w_eccb1051_M_2",
                row: [
                    {
                        crud: "U",
                        column: [
                            { name: "crm_no", value: v_global.data.key },
                            { name: "astat", value: "00" },
                            { name: "adate", value: "SYSDT" },
                            { name: "aemp", value: gw_com_module.v_Session.EMP_NO }
                        ]
                    }
                ]
            }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processBatch(param);

}
//----------
function processBatch(param) {

    // 담당자 지정 알림
    var args = {
        url: "COM",
        procedure: "PROC_MAIL_ECCB",
        nomessage: true,
        input: [
            { name: "stat", value: "CRM2", type: "varchar" },
            { name: "key", value: v_global.data.key, type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

    //var args = {
    //    url: "COM",
    //    procedure: "dbo.PROC_PCN_SETUSER",
    //    input: [
    //        { name: "issue_no", value: v_global.data.issue_no, type: "varchar" },
    //        { name: "dept_cd", value: gw_com_api.getValue("frmData_MAIN", 1, "dept_cd"), type: "varchar" },
    //        { name: "user_id", value: gw_com_api.getValue("frmData_MAIN", 1, "user_id"), type: "varchar" },
    //        { name: "supp_cd", value: gw_com_api.getValue("frmData_MAIN", 1, "supp_cd"), type: "varchar" },
    //        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
    //    ],
    //    handler: {
    //        success: successSave,
    //        param: param
    //    }
    //};
    //gw_com_module.callProcedure(args);

    // 임시
    //successBatch({}, param);
}
//----------
function successBatch(response, param) {

    processClose({ data: param });

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "w_eccb1050":
                        {
                            v_global.data = param.data;
                            processRetrieve({});
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
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
                                    processClear({});
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
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "":
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element,
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                      v_global.event.row,
                                      v_global.event.value,
                                      param.data.emp_no,
                                      (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.dept_nm,
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false,
                                    (v_global.event.type == "FORM") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.dept_cd,
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;

    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//