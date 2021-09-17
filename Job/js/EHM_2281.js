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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "반입목적", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "IEHM76" }
                    ]
                },
                { type: "PAGE", name: "창고", query: "dddw_repairitem_wh_cd" },
                { type: "PAGE", name: "파트처리", query: "dddw_repairitem_rpr_tp" },
                {
                    type: "PAGE", name: "처리구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM92" }
                    ]
                },
                {
                    type: "INLINE", name: "입출",
                    data: [
                        { title: "입고", value: "I" },
                        { title: "출고", value: "O" }
                    ]
                },
                {
                    type: "PAGE", name: "진행상태", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "IEHM78" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "fg1", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "fg1", label: { title: "반입목적 :" },
                                editable: { type: "select", data: { memory: "반입목적", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "fg3", label: { title: "처리구분 :" },
                                editable: { type: "select", data: { memory: "처리구분", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "fg4", label: { title: "창고(위치) :" },
                                editable: { type: "select", data: { memory: "창고", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "fg5", label: { title: "입고/출고 :" },
                                editable: { type: "select", data: { memory: "입출", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "astat", label: { title: "진행상태 :" },
                                editable: { type: "select", data: { memory: "진행상태", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", format: { type: "button" }, act: true },
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
            targetid: "grdData_MAIN", query: "EHM_2281_1", title: "코드 내역",
            caption: true, height: 442, show: true, selectable: true, key: true, number: true,
            editable: { master: true, bind: "select", focus: "fg1", validate: true },
            element: [
                {
                    header: "반입목적", name: "fg1", width: 150,
                    format: { type: "select", data: { memory: "반입목적", unshift: [{ title: "-", value: "" }] } },
                    editable: {
                        type: "select", validate: { rule: "required", message: "반입목적" },
                        data: { memory: "반입목적", unshift: [{ title: "-", value: "" }] },
                        change: [{ name: "fg2", memory: "파트처리", unshift: [{ title: "-", value: "" }], key: ["fg1"] }]
                    }
                },
                {
                    header: "파트처리", name: "fg2", width: 100,
                    format: { type: "select", data: { memory: "파트처리", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "파트처리", unshift: [{ title: "-", value: "" }], key: ["fg1"] } }
                },
                {
                    header: "처리구분", name: "fg3", width: 180,
                    format: { type: "select", data: { memory: "처리구분", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "처리구분", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "창고(위치)", name: "fg4", width: 150,
                    format: { type: "select", data: { memory: "창고", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "창고", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "입고/출고", name: "fg5", width: 100,
                    format: { type: "select", data: { memory: "입출", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "입출", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "진행상태", name: "astat", width: 150,
                    format: { type: "select", data: { memory: "진행상태", unshift: [{ title: "-", value: "" }] } },
                    editable: { type: "select", data: { memory: "진행상태", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required", message: "진행상태" } }
                },
                { header: "수정자", name: "upd_usr_nm", width: 80 },
                { header: "수정일시", name: "upd_dt", width: 130, align: "center" },
                { name: "seq", editable: { type: "hidden" }, hidden: true },
                { name: "del_yn", hidden: true }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            closeOption({});
            if (param == undefined) return;
            switch (param.element) {
                case "조회":
                    {
                        viewOption({});
                    }
                    break;
                case "추가":
                    {
                        processInsert(param);
                    }
                    break;
                case "삭제":
                    {
                        processDelete(param);
                    }
                    break;
                case "저장":
                    {
                        processSave(param);
                    }
                    break;
                case "닫기":
                    {
                        v_global.process.handler = processClose;
                        if (!checkUpdatable({})) return;
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
                        closeOption({})
                    }
                    break;
            }

        }
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
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "fg1", argument: "arg_fg1" },
                { name: "fg3", argument: "arg_fg3" },
                { name: "fg4", argument: "arg_fg4" },
                { name: "fg5", argument: "arg_fg5" },
                { name: "astat", argument: "arg_astat" }
            ],
            remark: [
                { element: [{ name: "fg1" }] },
                { element: [{ name: "fg3" }] },
                { element: [{ name: "fg4" }] },
                { element: [{ name: "fg5" }] },
                { element: [{ name: "astat" }] }
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
function processInsert(param) {

    var args = {
        targetid: "grdData_MAIN", edit: true,
        data: [
            { name: "seq", value: 0 },
            { name: "del_yn", value: "1" }
        ]
    };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = { targetid: "grdData_MAIN", row: "selected", select: true, check: "del_yn" };
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