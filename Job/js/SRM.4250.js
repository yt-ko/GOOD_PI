//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 검사품목관리
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { type: "PAGE", page: "SRM_4251", title: "수입검사 기준 적용", width: 1150, height: 530 };
        gw_com_module.dialoguePrepare(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
                },
                {
                    type: "INLINE", name: "검사유형",
                    data: [
                        { title: "필수", value: "1" },
                        { title: "선택", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "가공품", value: "가공품" },
                        { title: "모듈품", value: "모듈품" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Start Process : Create UI & Event
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "적용", value: "적용", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "plant_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "plant_cd", label: { title: "장비군 : " },
                                    editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "전체", value: "%" }] } }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "item_cd", label: { title: "품번 :" },
                                    editable: { type: "text", size: 10 }
                                },
                                {
                                    name: "item_nm", label: { title: "품명 :" },
                                    editable: { type: "text", size: 20 }
                                }
                            ]
                        },
                    {
                        element: [
                            {
                                name: "check_yn", label: { title: "검사유형 :" },
                                editable: { type: "select", data: { memory: "검사유형", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "item_tp", label: { title: "구분 :" },
                                editable: { type: "select", data: { memory: "구분", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                        {
                            element: [
                              { name: "실행", value: "실행", act: true, format: { type: "button" } },
                              { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ], align: "right"
                        }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "SRM_4250", title: "",
            height: 500, show: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            editable: { multi: true, bind: "select", focus: "item_cd", validate: true },
            element: [
                {
                    header: "장비군", name: "dept_area", width: 100,
                    format: { type: "select", data: { memory: "장비군" } },
                    editable: {
                        bind: "create", type: "select", data: { memory: "장비군" },
                        validate: { rule: "required" }
                    }
                },
                {
                    header: "품번", name: "item_cd", width: 120, align: "left", mask: "search",
                    editable: { bind: "create", type: "text", validate: { rule: "requied" } }
                },
                { header: "품명", name: "item_nm", width: 200 },
                { header: "규격", name: "item_spec", width: 270 },
                { header: "단위", name: "item_unit", width: 60, align: "center" },
                {
                    header: "구분", name: "item_tp", width: 100,
                    format: { type: "select", data: { memory: "구분" } },
                    editable: { type: "select", data: { memory: "구분", unshift: [{ title: "-", value: "-" }] } }
                },
                {
                    header: "검사유형", name: "check_yn", width: 80, align: "center",
                    //format: {
                    //    type: "radio", child: [{ title: "필수", value: "1" }, { title: "선택", value: "0" }]
                    //},
                    //editable: {
                    //    type: "radio", child: [{ title: "필수", value: "1" }, { title: "선택", value: "0" }]
                    //}
                    format: { type: "select", data: { memory: "검사유형" } },
                    editable: { type: "select", data: { memory: "검사유형" }, validate: { rule: "required" } }
                }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "적용", event: "click", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: hideOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, event: "itemdblclick", handler: itemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "itemkeyenter", handler: itemdblClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function viewOption(ui) {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        }
        //----------
        function hideOption(ui) {
            gw_com_api.hide("frmOption");
        }
        //=====================================================================================
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkSelected(objid) {
    if (gw_com_api.getSelectedRow(objid) == null) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
        return false;
    }
    return true;
}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve
    if (param.object == "frmOption" || param.object == undefined) {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "plant_cd", argument: "arg_plant_cd" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "item_nm", argument: "arg_item_nm" },
                    { name: "check_yn", argument: "arg_check_yn" },
                    { name: "item_tp", argument: "arg_item_tp" }
                ],
                remark: [
                    { element: [{ name: "plant_cd" }] },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "item_nm" }] },
                    { element: [{ name: "check_yn" }] },
                    { element: [{ name: "item_tp" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Main", focus: true, select: true }
            ]
        };
    }

    gw_com_module.objRetrieve(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {
    $.each(response, function () {
        processRetrieve({ object: "frmOption" });
    });
}
//----------
function processInsert(param) {
    
    gw_com_api.hide("frmOption");
    var args = { targetid: "grdData_Main", edit: true, data: [{ name: "check_yn", value: "1" }] };
    var row = gw_com_module.gridInsert(args);
    itemdblClick({ type: "GRID", object: "grdData_Main", row: row, element: "item_cd" });

}
//----------
function processDelete(param) {

    gw_com_api.hide("frmOption");
    var args = { targetid: "grdData_Main", row: "selected" }
    gw_com_module.gridDelete(args);

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
function itemdblClick(param) {

    switch (param.element) {
        case "item_cd":
            {
                v_global.event.type = param.type;
                v_global.event.object = param.object;
                v_global.event.row = param.row;
                v_global.event.element = param.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_PART",
                    title: "품목 선택",
                    width: 900,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_PART",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectPart
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }
}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_Main" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processPopup(param) {

    if (!checkUpdatable({ check: true })) return false;
    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return;
    }
    v_global.event.data = {
        dept_area: gw_com_api.getValue("grdData_Main", "selected", "dept_area", true),
        item_cd: gw_com_api.getValue("grdData_Main", "selected", "item_cd", true),
        check_yn: gw_com_api.getValue("grdData_Main", "selected", "check_yn", true)
    };

    var args = {
        page: "SRM_4251",
        param: {
            ID: gw_com_api.v_Stream.msg_openedDialogue,
            data: v_global.event.data
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                // PageId가 다를 때 Skip 
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                // 확인 메시지별 처리    
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") processSave(param.data.arg);
                            else {
                                processClear({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.apply)
                                    processRun({});
                            } else {
                                processPop({ object: "lyrMenu_main" });
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_retrieve:
            {
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_PART":
                        { args.ID = gw_com_api.v_Stream.msg_selectPart; }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_area", param.data.prod_group, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "item_cd", param.data.part_cd, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "item_nm", param.data.part_nm, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "item_spec", param.data.part_spec, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "item_unit", param.data.part_unit, (v_global.event.type == "GRID"));
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//