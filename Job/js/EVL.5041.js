//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.06)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
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
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                { type: "PAGE", name: "평가연도", query: "dddw_evl_year" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

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
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
            //----------
            //gw_com_api.setValue("frmOption", 1, "evl_year", gw_com_api.getYear());
            //----------
            processRetrieve({});
            //----------

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
                { name: "실행", value: "확인", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "evl_year", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "evl_year", label: { title: "평가연도 :" },
                                editable: {
                                    type: "select", data: { memory: "평가연도", unshift: [{ title: "전체", value: "" }] }
                                }, value: gw_com_api.getYear()
                            },
                            { name: "조회", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EVL", query: "EVL_5041_1", title: "평가 목록",
            height: 220, show: true, caption: true, selectable: true, checkrow: true, multi: true,
            element: [
                { header: "평가명", name: "evl_nm", width: 150 },
                { name: "evl_no", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EVL_USER", query: "EVL_5041_2", title: "평가대상 목록",
            height: 220, show: true, caption: true, selectable: true, checkrow: true, multi: true,
            element: [
                { header: "평가대상자명", name: "user_nm", width: 200 },
                { name: "user_id", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_EVL", offset: 8 },
                { type: "GRID", id: "grdList_EVL_USER", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_EVL", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_EVL_USER", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        processRetrieve({});
                    }
                    break;
                case "실행":
                    {
                        informResult({});
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "조회":
                    {
                        processRetrieve({});
                    }
                    break;
            }

        }
        //----------
        function processRowselected(param) {

            var cnt = (param.object == "grdList_EVL" ? v_global.logic.evl_cnt : v_global.logic.evl_user_cnt);
            if (param.status) {
                var ids = gw_com_api.getSelectedRow(param.object, true);
                if (ids.length > cnt)
                    gw_com_api.selectRow(param.object, param.row, false);
            }

            if (param.object == "grdList_EVL")
                processRetrieve(param);

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

    var args;
    if (param.object == "grdList_EVL") {
        var evl_no = getSelectedEVL({}).evl_no.join(",");
        if (v_global.logic.evl_no == undefined || v_global.logic.evl_no != evl_no) {
            v_global.logic.evl_no = evl_no;
            args = {
                source: {
                    type: "INLINE",
                    argument: [
                        { name: "arg_evl_no", value: v_global.logic.evl_no }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdList_EVL_USER" }
                ]
            };
        } else {
            return;
        }
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "evl_year", argument: "arg_evl_year" }
                ],
                argument: [
                    { name: "arg_ext1", value: v_global.logic.ext1 }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_EVL" }
            ],
            clear: [
                { type: "GRID", id: "grdList_EVL_USER" }
            ]
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function informResult(param) {

    var evl_list = getSelectedEVL({});
    var user_list = getSelectedEVL_USER({});
    if (evl_list.evl_no.length == 0 || user_list.user_id.length == 0)
        return;
    var args = {
        data: {
            evl_no: evl_list.evl_no,
            evl_nm: evl_list.evl_nm,
            user_id: user_list.user_id,
            user_nm: user_list.user_nm
        }
    };
    processClose(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    //gw_com_api.selectRow("grdList_EVL", "reset");
    //gw_com_api.selectRow("grdList_EVL_USER", "reset");

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_EVL" },
            { type: "GRID", id: "grdList_EVL_USER" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function getSelectedEVL(param) {

    var rtn = {
        evl_no: new Array(),
        evl_nm: new Array()
    };
    var ids = gw_com_api.getSelectedRow("grdList_EVL", true);
    $.each(ids, function () {
        rtn.evl_no.push(gw_com_api.getValue("grdList_EVL", this, "evl_no", true));
        rtn.evl_nm.push(gw_com_api.getValue("grdList_EVL", this, "evl_nm", true));
    })
    return rtn;

}
//----------
function getSelectedEVL_USER(param) {

    var rtn = {
        user_id: new Array(),
        user_nm: new Array()
    };
    var ids = gw_com_api.getSelectedRow("grdList_EVL_USER", true);
    $.each(ids, function () {
        rtn.user_id.push(gw_com_api.getValue("grdList_EVL_USER", this, "user_id", true));
        rtn.user_nm.push(gw_com_api.getValue("grdList_EVL_USER", this, "user_nm", true));
    })
    return rtn;

}
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
                v_global.logic = param.data;
                if (v_global.logic.evl_cnt == undefined)
                    v_global.logic.evl_cnt = 1;         // 평가 최대 선택 가능 수
                if (v_global.logic.evl_user_cnt == undefined)
                    v_global.logic.evl_user_cnt = 1;    // 평가대상 최대 선택 가능 수
            }
            break;
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined)
                                param.data.arg.handler(param.data.arg.param);
                        }
                        break
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//