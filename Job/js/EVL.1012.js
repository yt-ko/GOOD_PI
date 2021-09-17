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
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_part",
                    param: [{ argument: "arg_type", value: "EVL" }]
                },
                {
                    type: "PAGE", name: "평가그룹", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "EVL02" }]
                }
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
            editable: { bind: "open", focus: "emp_nm", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "emp_nm", label: { title: "사원명 :" },
                                editable: { type: "text", size: 8 }
                            },
                            {
                                name: "dept_nm", label: { title: "부서명 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "supp_nm", label: { title: "업체명 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "evl_group", label: { title: "평가그룹 :" },
                                editable: { type: "select", data: { memory: "평가그룹" } }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "장비군" } }
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
            targetid: "grdList_EMP", query: "EVL_1012_1", title: "평가자",
            height: 320, show: true, caption: true, selectable: true, number: true,
            element: [
                { header: "사원명", name: "user_nm", width: 100 },
                { header: "부서명", name: "dept_nm", width: 150 },
                { name: "user_id", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUPP", query: "EVL_1012_2", title: "평가대상자",
            height: 320, show: true, caption: true, selectable: true, checkrow: true, multi: true,
            editable: { master: true, bind: "select", focus: "evl_group", validate: true },
            element: [
                { header: "업체명", name: "user_nm", width: 150 },
                { header: "담당자", name: "emp_nm", width: 100 },
                { header: "Email", name: "email", width: 150 },
                {
                    header: "평가그룹", name: "evl_group", width: 100,
                    editable: { type: "select", data: { memory: "평가그룹", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "장비군", name: "dept_area", width: 100,
                    editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "-", value: "" }] } }
                },
                { name: "user_id", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_EMP", offset: 8 },
                { type: "GRID", id: "grdList_SUPP", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "frmOption", element: "조회", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processEnter };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_SUPP", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processButton(param) {

            switch (param.element) {
                case "실행":
                    {
                        processBatch(param);
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
        function processEnter(param) {

            if (param.element == "supp_nm") {

                processRetrieve({ supp: true });

            } else {

                processRetrieve({ emp: true });

            }

        }
        //----------
        function processRowselected(param) {

            if (param.status) {
                var user_id = gw_com_api.getValue(param.object, param.row, "user_id", (param.type == "GRID"));
                var ids = gw_com_api.getSelectedRow(param.object, true);
                $.each(ids, function () {
                    if (this != param.row && user_id == gw_com_api.getValue(param.object, this, "user_id", (param.type == "GRID"))) {
                        gw_com_api.selectRow(param.object, this, false);
                    }
                });
                gw_com_module.gridEdit({ targetid: param.object, row: param.row, edit: true });
                if (gw_com_api.getValue(param.object, param.row, "evl_group", (param.type == "GRID")) == "") {
                    gw_com_api.setValue(param.object, param.row, "evl_group", gw_com_api.getValue("frmOption", 1, "evl_group"), (param.type == "GRID"));
                }
                if (gw_com_api.getValue(param.object, param.row, "dept_area", (param.type == "GRID")) == "") {
                    gw_com_api.setValue(param.object, param.row, "dept_area", gw_com_api.getValue("frmOption", 1, "dept_area"), (param.type == "GRID"));
                }
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

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "emp_nm", argument: "arg_user_nm" },
                { name: "dept_nm", argument: "arg_dept_nm" },
                { name: "supp_nm", argument: "arg_supp_nm" }
            ],
            argument: [
                { name: "arg_evl_no", value: v_global.logic.evl_no },
                { name: "arg_evl_seq", value: v_global.logic.evl_seq }
            ]
        }
    };
    if (param.supp) {

        args.target = [
            { type: "GRID", id: "grdList_SUPP" }
        ];

    } else {

        args.target = [
            { type: "GRID", id: "grdList_EMP", select: true }
        ];

    }
    gw_com_module.objRetrieve(args);

}
//----------
function processBatch(param) {

    var row = gw_com_api.getSelectedRow("grdList_EMP");
    if (row == null) {
        gw_com_api.messageBox([{ text: "선택된 사원이 없습니다." }]);
        return;
    }
    var ids = gw_com_api.getSelectedRow("grdList_SUPP", true);
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "선택된 공급사가 없습니다." }]);
        return;
    }

    var valuer_id = gw_com_api.getValue("grdList_EMP", row, "user_id", true);
    var user_id = ""
    var batch = true;
    $.each(ids, function () {
        var evl_group = gw_com_api.getValue("grdList_SUPP", this, "evl_group", true);
        var dept_area = gw_com_api.getValue("grdList_SUPP", this, "dept_area", true);
        if (evl_group == "") {
            batch = false;
            gw_com_api.messageBox([{ text: "평가그룹을 선택하세요." }]);
            gw_com_module.gridEdit({ targetid: "grdList_SUPP", row: this, edit: true });
            gw_com_api.setError(true, "grdList_SUPP", this, "evl_group", true);
            return false;
        } else if (dept_area == "") {
            batch = false;
            gw_com_api.messageBox([{ text: "장비군를 선택하세요." }]);
            gw_com_module.gridEdit({ targetid: "grdList_SUPP", row: this, edit: true });
            gw_com_api.setError(true, "grdList_SUPP", this, "dept_area", true);
            return false;
        }
        user_id += (user_id == "" ? "" : "|") +
            gw_com_api.getValue("grdList_SUPP", this, "user_id", true) + "^" +
            gw_com_api.getValue("grdList_SUPP", this, "emp_nm", true) + "^" +
            gw_com_api.getValue("grdList_SUPP", this, "email", true) + "^" +
            evl_group + "^" + dept_area;
    });

    if (batch) {
        var args = {
            url: "COM",
            nomessage: true,
            procedure: "sp_QMS_createEVL_Valuer",
            input: [
                { name: "evl_no", value: v_global.logic.evl_no, type: "varchar" },
                { name: "evl_seq", value: v_global.logic.evl_seq, type: "int" },
                { name: "valuer_id", value: valuer_id, type: "varchar" },
                { name: "user_id", value: user_id, type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            output: [
                { name: "rtn_no", type: "varchar" },
                { name: "rtn_msg", type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: param
            }
        };
        gw_com_module.callProcedure(args);
    }

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] > 0) {
        var missing = undefined;
        //var p = {
        //    handler: processClose,
        //    param: {
        //        data: {
        //            evl_no: response.VALUE[0],
        //            evl_year: param.evl_year
        //        }
        //    }
        //};
        var p = {
            handler: processClear,
            param: { supp: true }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 600);
    }

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    processClear(param);

}
//----------
function processClear(param) {

    var args = new Object();
    if (param.supp) {
        args = {
            target: [
                { type: "GRID", id: "grdList_SUPP" }
            ]
        };
    } else {
        args = {
            target: [
                { type: "GRID", id: "grdList_EMP" },
                { type: "GRID", id: "grdList_SUPP" }
            ]
        };
    }
    gw_com_module.objClear(args);

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
                v_global.logic = param.data;
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