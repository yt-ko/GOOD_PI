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
        //var args = {
        //    request: [
        //        {
        //            type: "PAGE", name: "장비군", query: "dddw_deptarea",
        //            param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
        //        }
        //    ],
        //    starter: start
        //};
        //gw_com_module.selectSet(args);
        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
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
                { name: "조회", value: "조회", act: true },
                { name: "확인", value: "확인", icon: "실행" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "part_cd", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "part_cd", label: { title: "부품코드 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "part_nm", label: { title: "부품명 :" },
                                editable: { type: "text", size: 12, maxlength: 20 }
                            },
                            {
                                name: "part_spec", label: { title: "규격 :" },
                                editable: { type: "text", size: 12, maxlength: 20 }
                            },
                            {
                                name: "prod_key", label: { title: "Prod Key :" },
                                editable: { type: "text", size: 12, maxlength: 20 }, hidden: true
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
            targetid: "grdList_PART", query: "w_qcm2010_2_1", title: "파트 목록", scroll: true,
            caption: true, height: 310, show: true, selectable: true, number: true, key: true, dynamic: true, //multi: true, checkrow: true,
            element: [
                { header: "품번", name: "part_cd", width: 100, align: "center" },
                { header: "품명", name: "part_nm", width: 250, align: "left" },
                { header: "규격", name: "part_spec", width: 250, align: "left" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_PART", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_PART", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_PART", grid: true, event: "rowkeyenter", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================

        function processButton(param) {

            switch (param.element) {
                case "조회":
                case "실행":
                    {
                        processRetrieve({ item: true });
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "확인":
                    {
                        informResult({});
                    }
                    break;
            }

        }
        //----------
        function processRowdblclick(param) {

            informResult({});
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

    if (gw_com_api.getValue("frmOption", 1, "part_cd") == ""
            && gw_com_api.getValue("frmOption", 1, "part_nm") == ""
            && gw_com_api.getValue("frmOption", 1, "part_spec") == "") {
        gw_com_api.messageBox([
                { text: "조회 조건 중 한 가지는 반드시 입력하셔야 합니다." }
        ]);
        gw_com_api.setError(true, "frmOption", 1, "part_cd", false, true);
        gw_com_api.setError(true, "frmOption", 1, "part_nm", false, true);
        gw_com_api.setError(true, "frmOption", 1, "part_spec", false, true);
        return false;
    }
    gw_com_api.setError(false, "frmOption", 1, "part_cd", false, true);
    gw_com_api.setError(false, "frmOption", 1, "part_nm", false, true);
    gw_com_api.setError(false, "frmOption", 1, "part_spec", false, true);

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "prod_key", argument: "arg_prod_key" },
                { name: "part_cd", argument: "arg_part_cd" },
                { name: "part_nm", argument: "arg_part_nm" },
                { name: "part_spec", argument: "arg_part_spec" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_PART", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

}
//----------
function informResult(param) {

    var row = gw_com_api.getSelectedRow("grdList_PART");
    if (row > 0) {
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: {
                part_tp: v_global.data.part_tp,
                part_cd: gw_com_api.getValue("grdList_PART", row, "part_cd", true),
                part_nm: gw_com_api.getValue("grdList_PART", row, "part_nm", true),
                spec: gw_com_api.getValue("grdList_PART", row, "part_spec", true)
            }
        };
        gw_com_module.streamInterface(args);
    } else {
        gw_com_api.messageBox([{ text: "선택된 품목이 없습니다." }]);
    }

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
                v_global.data = param.data;
                gw_com_api.setValue("frmOption", 1, "prod_key", param.data.prod_key);

                var retrieve = false;
                if (param.data.part_cd != undefined) {
                    gw_com_api.setValue("frmOption", 1, "part_cd", param.data.part_cd);
                    retrieve = true;
                }
                if (param.data.part_nm != undefined) {
                    gw_com_api.setValue("frmOption", 1, "part_nm", param.data.part_nm);
                    retrieve = true;
                }
                if (param.data.part_spec != undefined) {
                    gw_com_api.setValue("frmOption", 1, "part_spec", param.data.part_spec);
                    retrieve = true;
                }
                if (retrieve)
                    processRetrieve({ item: true });
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
                closeDialogue({ page: param.from.page });
            }
            break;

    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//