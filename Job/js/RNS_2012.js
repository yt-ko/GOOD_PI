//------------------------------------------
// RNS Rule 상세보기
//------------------------------------------
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var gw_job_process = {

    ready: function () {

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data.
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_part",
                    param: [{ argument: "arg_type", value: "RNS" }]
                },
                {
                    type: "PAGE", name: "분류", query: "DDDW_CM_CODED",
                    param: [{ argument: "arg_hcode", value: "RNS01" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            v_global.logic.rev_tp = "REV";    // rev_tp 기본값:개정
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
        }
    },

    //#region
    UI: function () {

        // define UI.
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "RNS_2011_1", type: "TABLE", title: "문서정보",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 120, field: 180 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" },
                            { header: true, value: "담당부서", format: { type: "label" } },
                            { name: "dept_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "user_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "문서번호", format: { type: "label" } },
                            { name: "rns_no" },
                            { header: true, value: "개정일자", format: { type: "label" } },
                            { name: "rev_date", mask: "date-ymd" },
                            { header: true, value: "개정번호", format: { type: "label" } },
                            { name: "rev_no" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "분류", format: { type: "label" } },
                            { name: "rns_tp_nm" },
                            { header: true, value: "문서명", format: { type: "label" } },
                            {
                                name: "rns_nm", style: { colspan: 3 },
                                format: { width: 820 }
                            },
                            { name: "rns_id", hidden: true },
                            { name: "rns_fg", hidden: true },
                            { name: "astat", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO", query: "RNS_2011_2", type: "TABLE", title: "주요내용",
            caption: true, show: true, fixed: true, selectable: true,
            content: {
                width: { label: 100, field: 100 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "변경 전", format: { type: "label" } },
                            { header: true, value: "변경 후", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            { name: "memo_html_1", format: { type: "html", height: 260, top: 5 } },
                            { name: "memo_text_1", hidden: true },
                            { name: "memo_html_2", format: { type: "html", height: 260, top: 5 } },
                            { name: "memo_text_2", hidden: true },
                            { name: "rns_id", hidden: true },
                            { name: "rev_no", hidden: true },
                            { name: "memp_tp_1", hidden: true },
                            { name: "memo_tp_2", hidden: true },
                            { name: "crud_1", hidden: true },
                            { name: "crud_2", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "RNS_2011_3", title: "첨부파일",
            caption: true, height: 50, pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 500 },
                { header: "등록자", name: "upd_usr_nm", width: 70, align: "center" },
                { header: "부서", name: "upd_dept_nm", width: 80, align: "center" },
                { header: "등록일시", name: "upd_dt", width: 120, align: "center" },
                {
                    header: "설명", name: "file_desc", width: 330,
                    editable: { type: "text" }, hidden: true
                },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MEMO", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //----------
        function processClick(param) {

            switch (param.element) {
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "download":
                    {
                        var args = { source: { id: param.object, row: param.row }, targetid: "lyrDown" };
                        gw_com_module.downloadFile(args);
                    }
                    break;
            }

        }
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
function processRetrieve(param) {

    if (v_global.logic.rev_no == undefined) {

        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_rns_id", value: v_global.logic.rns_id },
                    { name: "arg_rev_tp", value: v_global.logic.rev_tp }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN" }
            ],
            clear: [
                { type: "FORM", id: "frmData_MEMO" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_rns_id", value: v_global.logic.rns_id },
                    { name: "arg_rev_no", value: v_global.logic.rev_no }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN", query: "RNS_2011_1_REV" }
            ],
            clear: [
                { type: "FORM", id: "frmData_MEMO" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processRetrieveEnd(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_rns_id", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_id") },
                { name: "arg_rev_no", value: gw_com_api.getValue("frmData_MAIN", 1, "rev_no", false, true) }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    gw_com_module.objRetrieve(args);

    // 열람이력
    var args = {
        url: "COM",
        nomessage: true,
        tran: true,
        procedure: "sp_QMS_createRNS_READ",
        input: [
            { name: "rns_id", value: gw_com_api.getValue("frmData_MAIN", 1, "rns_id"), type: "int" },
            { name: "rev_no", value: gw_com_api.getValue("frmData_MAIN", 1, "rev_no", false, true), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ]
    };
    gw_com_module.callProcedure(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    default:
                        {
                            if (param.data.rns_id == undefined || param.data.rns_id == "") {
                                processClose({});
                            } else {
                                v_global.logic = param.data;
                                if (v_global.logic.rev_tp == undefined) v_global.logic.rev_tp = "REV";    // rev_tp 기본값:개정
                                processRetrieve({});
                            }
                            return;
                        }
                        break;
                }
                gw_com_module.streamInterface(args); 
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
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//