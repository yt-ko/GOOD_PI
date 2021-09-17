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
            targetid: "frmData_MAIN", query: "", type: "TABLE", title: "담당자 지정",
            caption: true, show: true, selectable: true,
            editable: { bind: "create", focus: "dept_cd", validate: true },
            content: {
                width: { label: 35, field: 65 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "담당부서", format: { type: "label" } },
                            { name: "dept_nm", editable: { type: "text", width: 238 }, mask: "search" },
                            { name: "dept_cd", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "user_nm", editable: { type: "text", width: 238 }, mask: "search" },
                            { name: "user_id", editable: { type: "hidden" }, hidden: true }//,
                            //{ header: true, value: "협력사", format: { type: "label" } },
                            //{ name: "supp_nm", editable: { type: "text", width: 150 }, mask: "search" },
                            //{ name: "supp_cd", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "PCN_1021_1", title: "담당자 이력",
            caption: true, height: 300, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "담당부서", name: "dept_nm", width: 100, align: "center" },
                { header: "담당자", name: "user_nm", width: 60, align: "center" },
                //{ header: "협력사", name: "supp_nm", width: 150 },
                { header: "등록자", name: "ins_usr_nm", width: 60, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 150, align: "center" },
                { name: "issue_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_SUB", offset: 8 }
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
                {
                    processClose();
                }
                break;
        }
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN") {
        switch (param.element) {
            case "dept_nm":
            case "user_nm":
            case "supp_nm":
                {
                    if (param.value.current == "") {
                        var elem = (param.element == "dept_nm" ? "dept_cd" : (param.element == "user_nm" ? "user_id" : "supp_cd"));
                        gw_com_api.setValue(param.object, param.row, elem, "", false, true);
                    }
                }
                break;
        }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "dept_nm":
            var args = {
                type: "PAGE", page: "DLG_TEAM", title: "부서 선택",
                width: 500, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_TEAM",
                    param: { ID: gw_com_api.v_Stream.msg_selectTeam }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "user_nm":
            var args = {
                type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택",
                width: 700, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_EMPLOYEE",
                    param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "supp_nm":
            var args = {
                type: "PAGE", page: "w_find_supplier", title: "협력사 선택",
                width: 500, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_supplier",
                    param: { ID: gw_com_api.v_Stream.msg_selectedSupplier }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        default: return;
    }

}
//----------
function processRetrieve(param) {

    var args = {
        targetid: "frmData_MAIN", edit: true, updatable: true
    };
    gw_com_module.formInsert(args);

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_issue_no", value: v_global.data.issue_no }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_SUB" }
        ],
        handler: { complete: processRetrieveEnd, param: param }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
    
}
//----------
function processSave(param) {

    var dept_cd = gw_com_api.getValue("frmData_MAIN", 1, "dept_cd");
    var user_id = gw_com_api.getValue("frmData_MAIN", 1, "user_id");
    var supp_cd = "";   //gw_com_api.getValue("frmData_MAIN", 1, "supp_cd")

    if (dept_cd == "" && user_id == "") {
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        gw_com_api.setError(true, "frmData_MAIN", 1, "dept_nm", false);
        gw_com_api.setError(true, "frmData_MAIN", 1, "user_nm", false);
        return false;
    }
    gw_com_api.setError(false, "frmData_MAIN", 1, "dept_nm", false);
    gw_com_api.setError(false, "frmData_MAIN", 1, "user_nm", false);

    var args = {
        url: "COM",
        procedure: "dbo.PROC_PCN_SETUSER",
        input: [
            { name: "issue_no", value: v_global.data.issue_no, type: "varchar" },
            { name: "dept_cd", value: dept_cd, type: "varchar" },
            { name: "user_id", value: user_id, type: "varchar" },
            { name: "supp_cd", value: supp_cd, type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successSave(response, param) {

    processClose({ data: { issue_no: v_global.data.issue_no } });

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
                    case "PCN_1020":
                    case "PCN_1030":
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
        case gw_com_api.v_Stream.msg_selectedSupplier: {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
                                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
                                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedTeam: {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
                                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
                                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                    (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;

    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//