//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {


    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        if (gw_com_module.v_Session.USER_TP == "SYS") {
            var args = {
                targetid: "lyrMenu", type: "FREE",
                element: [
                    { name: "조회", value: "새로고침", act: true },
                    { name: "추가", value: "추가" },
                    { name: "삭제", value: "삭제" },
                    { name: "저장", value: "저장" },
                    { name: "닫기", value: "닫기" }
                ]
            };
            //----------
            gw_com_module.buttonMenu(args);
        } else {
            var args = {
                targetid: "lyrMenu", type: "FREE",
                element: [
                    { name: "조회", value: "새로고침", act: true },
                    //{ name: "추가", value: "추가" },
                    //{ name: "삭제", value: "삭제" },
                    { name: "저장", value: "저장" },
                    { name: "닫기", value: "닫기" }
                ]
            };
            //----------
            gw_com_module.buttonMenu(args);
        }
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "EHM_2280_1", title: "코드 내역",
            caption: true, height: 442, show: true, selectable: true, key: true, number: true,
            editable: { multi: true, bind: "select", focus: "dcode", validate: true },
            element: [
                {
                    header: "코드", name: "dcode", width: 60,
                    editable: { bind: "create", type: "text", validate: { rule: "required", message: "코드" }, maxlength: 40 }
                },
                {
                    header: "명칭", name: "dname", width: 300,
                    editable: { type: "text", validate: { rule: "required", message: "명칭" } }
                },
                {
                    header: "사용", name: "use_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" },
                    editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                {
                    header: "순번", name: "sort_seq", width: 50, align: "center",
                    editable: { type: "text" }, mask: "numeric-int"
                },
                {
                    header: "파트처리", name: "rcode", width: 150,
                    editable: { type: "text", maxlength: 20 }
                },
                {
                    header: "담당부서", name: "dept_nm", width: 130, hidden: true,
                    editable: { type: "text" }, mask: "search"
                },
                {
                    header: "담당부서", name: "fcode1", width: 100, hidden: true,
                    editable: { type: "hidden" }
                },
                {
                    header: "NCR체크", name: "fcode2", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "분석", name: "fcode3", width: 50, align: "center", hidden: true,
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "수리", name: "fcode4", width: 50, align: "center", hidden: true,
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "비고", name: "rmk", width: 400,
                    editable: { type: "text", maxlength: 125 }
                },
                { name: "hcode", editable: { type: "hidden" }, hidden: true },
                { name: "_deletable", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemkeyup", handler: processKeyup };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    //gw_com_api.show("frmOption");
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    if (param == undefined) return;
    switch (param.element) {
        case "조회":
            processRetrieve({});
            break;
        case "추가":
            processInsert(param);
            break;
        case "삭제":
            processDelete(param);
            break;
        case "저장":
            processSave(param);
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processItemchanged(param) {


}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args;
    switch (param.element) {
        case "dept_nm":
            v_global.event.cd = "fcode1";
            v_global.event.nm = "dept_nm";
            v_global.event.id = gw_com_api.v_Stream.msg_selectDepartment;
            v_global.event.data = {
                dept_nm: gw_com_api.getValue(param.object, param.row, param.element, param.element == "GRID" ? true : false)
            };
            args = {
                type: "PAGE", page: "w_find_dept", title: "부서 검색",
                width: 650, height: 450, open: true,
                id: v_global.event.id
            };
            break;
        default: return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: args.id,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_hcode", value: "IEHM76" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_MAIN", edit: true,
        data: [
            { name: "hcode", value: "IEHM76" },
            { name: "use_yn", value: "1" },
            { name: "sort_seq", rule: "INCREMENT", value: 1 }
        ]
    };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    if (gw_com_api.getValue("grdData_MAIN", "selected", "_deletable", true) > 0) {
        gw_com_api.messageBox([{ text: "사용된 코드는 삭제할 수 없습니다." }]);
        return false;
    }

    var args = { targetid: "grdData_MAIN", row: "selected", select: true };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
			{ type: "GRID", id: "grdData_MAIN" }
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
function processKeyup(param) {
    
    if (event.keyCode == 46 && param.element == "dept_nm") {
        gw_com_api.setValue(param.object, param.row, param.element, "", true);
        gw_com_api.setValue(param.object, param.row, "fcode1", "", true, true);
    }

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_MAIN" }
        ]
    };
    return gw_com_module.objUpdatable(args);

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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                var handler = (param.data.arg && param.data.arg.handler ? param.data.arg.handler : v_global.process.handler);
                                var param = (param.data.arg && param.data.arg.param ? param.data.arg.param : v_global.process.param);
                                handler(param);
                            }
                        } break;
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
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "w_find_dept":
                        args.ID = v_global.event.id;
                        args.data = v_global.event.data;
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedDepartment:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//