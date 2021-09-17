//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.10)
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        start();
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
                { name: "조회", value: "조회" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "dept_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_nm", label: { title: "부서 :" },
                                editable: { type: "text", size: 12 }
                            },
                            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_DEPT", query: "w_find_dept_tree_1", title: "부서",
            caption: false, height: 370, pager: false, show: true, selectable: true, multi: true, //checkrow: true,
            editable: { multi: true, bind: "open" },
            treegrid: { element: "display_nm" },
            element: [
                {
                    header: "", name: "chk", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "부서명", name: "display_nm", width: 370 },
                { name: "dept_cd", hidden: true },
                { name: "dept_nm", hidden: true },
                { name: "pdept_cd", hidden: true },
                { name: "pdept_nm", hidden: true },
                { name: "level_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //----------
        //$("#grdList_DEPT_data").showCol("cb");
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_DEPT", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
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
        //=====================================================================================
        var args = { targetid: "grdList_DEPT", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //----------
        function processClick(param) {

            switch (param.element) {
                case "조회":
                case "실행":
                    {
                        processRetrieve({});
                    }
                    break;
                case "저장":
                    {
                        informResult({});
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            // 하위 노드 처리
            gw_com_api.block("grdList_DEPT");
            var obj = $("#" + param.object + "_data");
            var row = obj.jqGrid("getLocalRow", param.row);
            var child = obj.jqGrid("getNodeChildren", row);
            $.each(child, function () {
                gw_com_api.setValue(param.object, this._id_, param.element, param.value.current, (param.type == "GRID"));
            })
            gw_com_api.unblock("grdList_DEPT");
        }
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

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "dept_nm", argument: "arg_dept_nm" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_DEPT", option: "TREE", block: true }
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

    // 확장
    var rData = $("#grdList_DEPT_data").jqGrid('getGridParam', 'data');
    if (rData[0]) {
        setTimeout(function () {
            for (i = 0; 1 < 1; i++) {   //rData.length
                $("#grdList_DEPT_data").jqGrid('expandRow', rData[i]);
                $("#west-grid").jqGrid('expandNode', rData[i]);
            }
        }, 0);
    }

}
//----------
function informResult(param) {

    var ids = gw_com_api.getRowIDs("grdList_DEPT");
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var data = new Array();
    $.each(ids, function () {
        if (gw_com_api.getValue("grdList_DEPT", this, "chk", true) == "1")
            data.push({
                dept_cd: gw_com_api.getValue("grdList_DEPT", this, "dept_cd", true),
                dept_nm: gw_com_api.getValue("grdList_DEPT", this, "dept_nm", true),
                pdept_cd: gw_com_api.getValue("grdList_DEPT", this, "pdept_cd", true),
                pdept_nm: gw_com_api.getValue("grdList_DEPT", this, "pdept_nm", true)
            });
    });
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: data
    };
    gw_com_module.streamInterface(args);

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
            { type: "GRID", id: "grdList_DEPT" }
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
function getAuths(param) {

    var rtn = "";
    var args = { request: "PAGE", name: "RNS_2010_3",
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=RNS_2010_3" +
            "&QRY_COLS=auth_id" +
            "&CRUD=R" +
            "&arg_rns_id=" + v_global.logic.rns_id +
            "&arg_rev_no=" + v_global.logic.rev_no +
            "&arg_auth_tp=DEPT",
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(data) {

        if (data.DATA != undefined && data.DATA.length > 0) {
            rtn = data.DATA.join(",");
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
                            v_global.logic = param.data;
                            if (!v_global.process.init) {
                                processRetrieve({});
                                v_global.process.init = true;
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                    case gw_com_api.v_Message.msg_confirmRemove:
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