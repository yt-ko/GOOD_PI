//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.05)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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
        start();
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_api.getPageParameter("dept_area"));
            gw_com_api.setValue("frmOption", 1, "yyyy", gw_com_api.getPageParameter("yyyy"));
            gw_com_api.setValue("frmOption", 1, "rev", gw_com_api.getPageParameter("rev"));
            gw_com_api.setValue("frmOption", 1, "item_no", gw_com_api.getPageParameter("item_no"));
            gw_com_api.setValue("frmOption", 1, "item_nm", gw_com_api.getPageParameter("item_nm"));
            processRetrieve({});
            //----------
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
                { name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { focus: "item_no", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "item_no", label: { title: "품번" },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            },
                            {
                                name: "item_nm", label: { title: "품명" },
                                editable: { type: "text", size: 15, maxlength: 200 }
                            },
                            { name: "dept_area", label: { title: "사업부" }, hidden: true },
                            { name: "yyyy", label: { title: "기준연도" }, hidden: true },
                            { name: "rev", label: { title: "차수" }, hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" }, show: false }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", type: "REPORT", title: "FORECASTING",
            show: true,
            content: {
                cols: 104, width: 10, height: 30,
                row: [
                    {
                        element: [
                            { cols: 8, type: "label", value: "품번", header: true, rows: 2 },
                            { cols: 24, type: "label", value: "품명", header: true, rows: 2 },
                            { cols: 24, type: "label", value: "규격", header: true, rows: 2 },
                            { cols: 16, type: "label", value: "필요연월", header: true },
                            { cols: 16, type: "label", value: "필요연월", header: true },
                            { cols: 16, type: "label", value: "필요연월", header: true }
                        ]
                    },
                    {
                        element: [
                            { cols: 8, type: "label", value: "필요수량", header: true },
                            { cols: 8, type: "label", value: "가능수량", header: true },
                            { cols: 8, type: "label", value: "필요수량", header: true },
                            { cols: 8, type: "label", value: "가능수량", header: true },
                            { cols: 8, type: "label", value: "필요수량", header: true },
                            { cols: 8, type: "label", value: "가능수량", header: true }
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
        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                case "실행":
                    {
                        processRetrieve({});
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
        target: [
            { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "yyyy", argument: "arg_yyyy" },
                { name: "rev", argument: "arg_rev" },
                { name: "item_no", argument: "arg_item_no" },
                { name: "item_nm", argument: "arg_item_nm" }
            ],
            argument: [
                { name: "arg_supp_cd", value: gw_com_module.v_Session.USR_ID }
            ],
            remark: [
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "yyyy" }] },
                { element: [{ name: "rev" }] },
                { element: [{ name: "item_no" }] },
                { element: [{ name: "item_nm" }] }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ]
    };
    //----------
    $.blockUI();
    //----------
    var param = {
        type: args.source.type,
        targetid: args.source.id,
        row: args.source.row,
        element: args.source.element,
        argument: args.source.argument
    };
    var data = gw_com_module.elementtoARG(param);
    args.param = data.query;
    var param = {
        type: args.source.type,
        id: args.source.id,
        row: args.source.row,
        remark: args.source.remark
    };
    var remark = gw_com_module.elementtoRemark(param);
    args.remark = remark;
    if (args.source.hide)
        $("#" + args.source.id).hide();

    var args = {
        request: "PAGE",
        name: "SRM_2510_SUPP_P_1",
        async: false,
        param: args,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=SRM_2510_SUPP_P_1" +
                "&QRY_COLS=nm,val" +
                "&CRUD=R" +
                "&arg_data_tp=H" + args.param,
        handler_success: function (data) {

            v_global.logic.header = data;
            v_global.logic.header2 = new Array();
            $.each(data, function () {
                if (this.DATA[0] == "req_date") {
                    v_global.logic.header2.push("req_qty_" + this.DATA[1]);
                    v_global.logic.header2.push("plan_qty_" + this.DATA[1]);
                } else {
                    v_global.logic.header2.push(this.DATA[0]);
                }
            });
            getData(this.param);

        }
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    $.unblockUI();
    //----------

}
//----------
function processClose(param) {

    if (parent == undefined || parent == null || parent.streamProcess == undefined || window == parent)
        window.close();
    else {
        v_global.process.handler = processClose;
        var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
        gw_com_module.streamInterface(args);
    }

}
//----------
function getData(args) {

    var args = {
        request: "PAGE",
        name: "SRM_2510_SUPP_1",
        async: false,
        param: args,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=SRM_2510_SUPP_P_1" +
                "&QRY_COLS=seq," + v_global.logic.header2.join(",") +
                "&CRUD=R" +
                "&arg_data_tp=D" + args.param,
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        var args = {
            targetid: "frmData_MAIN", type: "REPORT", title: "FORECASTING",
            show: true,
            content: {
                cols: 500, width: 10, height: 30,
                row: [
                    { element: [] },
                    { element: [] }
                ]
            }
        };
        //----------
        var font = { size: 10 };
        $.each(v_global.logic.header, function () {
            var nm = this.DATA[0];
            var val = this.DATA[1];
            if (nm == "req_date") {
                args.content.row[0].element.push({ cols: 16, type: "label", value: gw_com_api.Mask(val, "date-ym"), header: true, font: font });
                args.content.row[1].element.push({ cols: 8, type: "label", value: "필요수량", header: true, font: font });
                args.content.row[1].element.push({ cols: 8, type: "label", value: "가능수량", header: true, font: font });
            } else {
                var cols = 8;
                if (nm == "item_no")
                    cols = 9;
                else if (nm == "item_nm" || nm == "spec")
                    cols = 24;
                args.content.row[0].element.push({ cols: cols, type: "label", value: val, header: true, font: font, rows: 2 });
            }
        });
        //----------
        $.each(data, function (i, v) {
            var ele = new Array();
            var edit = false;
            $.each(v_global.logic.header2, function (j) {
                var e = {
                    cols: 8,
                    name: v.DATA[0] + "_" + this,
                    value: v.DATA[j + 1],
                    type: "label",
                    font: font
                };
                if (this.substring(0, 7) == "item_no") {
                    e.cols = 9;
                } else if (this.substring(0, 7) == "item_nm" || this.substring(0, 4) == "spec") {
                    e.cols = 24;
                } else if (this.substring(0, 7) == "req_qty" || this.substring(0, 8) == "plan_qty") {
                    e.type = "text";
                    e.align = "right";
                    e.value = gw_com_api.Mask(e.value, "numeric-int");
                }
                ele.push(e);
            });
            args.content.row.push({ element: ele });
        });
        //----------
        gw_com_module.formCreate(args);
        //----------
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        $("#" + $("#" + this.param.source.id).attr("remark") + "_data").text(this.param.remark);
        //=====================================================================================
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
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//