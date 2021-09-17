//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.12)
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
                { name: "조회", value: "조회" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "ver_no", label: { title: "S/W Ver. :" },
                                editable: { type: "text", size: 14 }
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
            targetid: "grdList_MAIN", query: "SVM_1050_1", title: "S/W 정보",
            caption: true, height: 150, show: true, selectable: true, number: true,
            element: [
                { header: "장비군", name: "dept_area_nm", width: 150 },
                { header: "Ver.", name: "ver_no", width: 150 },
                { header: "비고", name: "rmk", width: 500 },
                { header: "등록자", name: "upd_usr_nm", width: 100 },
                { header: "등록일시", name: "upd_dt", width: 150, align: "center" },
                { name: "doc_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", type: "REPORT", title: "",
            caption: false, show: true,
            content: {
                cols: 200, width: 10, height: 30,
                row: [
                    {
                        element: [
                            { cols: 4, type: "label", value: "No.", header: true, rows: 11, font: { size: 10 } },
                            { cols: 20, type: "label", value: "분류", header: true, rows: 11, font: { size: 10 } },
                            { cols: 15, type: "label", value: "ECR No.", header: true, rows: 11, font: { size: 10 }},
                            { cols: 15, type: "label", value: "CIP No.", header: true, rows: 11, font: { size: 10 }},
                            { cols: 15, type: "label", value: "ECO No.", header: true, rows: 11, font: { size: 10 }},
                            { cols: 30, type: "label", value: "제품유형", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "고객사", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "Line", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "제품명", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "납품일자", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "Process", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "Project No.", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "PM수", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "Safety PLC", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "EDA", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 30, type: "label", value: "PLC Ver.", header: true, font: { size: 10 }}
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        v_global.logic.form = args;
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
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
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        var args = {
                            target: [{ id: "frmOption", focus: true }]
                        };
                        gw_com_module.objToggle(args);
                    }
                    break;
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
        function processRowselected(param) {

            processRetrieve(param);

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

    if (param.object == "grdList_MAIN") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "doc_id", argument: "arg_doc_id" }
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
        if (args.source.hide)
            $("#" + args.source.id).hide();

        var args = {
            request: "PAGE",
            name: "SVM_1050_2",
            async: false,
            param: args,
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=SVM_1050_2" +
                "&QRY_COLS=prod_type_nm,cust_nm,cust_dept_nm,prod_nm,dlv_ymd,cust_proc_nm,proj_no,prod_subqty,ext1_cd,ext2_cd,ext3_cd" +
                "&CRUD=R" +
                "&arg_data_tp=H" + args.param,
            handler_success: function (data) {

                v_global.logic.row = v_global.logic.form.content.row;
                $.each(data, function () {
                    var i = 0;
                    for (var j = 0; j < this.DATA.length - 1; j++) {
                        v_global.logic.row[i].element.push({ cols: 20, type: "label", value: this.DATA[j], header: true, font: { size: 10 }});
                        i++;
                    }
                })
                getData(this.param);

            }
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        $.unblockUI();
        //----------

    } else {

        var args = {
            target: [
                { type: "FORM", id: "frmOption" }
            ]
        };
        if (gw_com_module.objValidate(args) == false) return false;

        var args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "ver_no", argument: "arg_ver_no" }
                ],
                remark: [
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "ver_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN" }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" }
            ]
        };
        gw_com_module.objRetrieve(args);

    }



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
        name: "SVM_1050_2",
        async: false,
        param: args,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=SVM_1050_2" +
                "&QRY_COLS=seq,item_tp,ecr_no,cip_no,eco_no,rmk,item_id" +
                "&CRUD=R" +
                "&arg_data_tp=D" + args.param,
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        var param = this.param.param;
        $.each(data, function () {
            var ele = new Array();
            for (var j = 0; j < this.DATA.length - 2; j++) {
                var cols = v_global.logic.row[0].element[j].cols;
                if (j == 0)
                    ele.push({ cols: cols, value: this.DATA[j], font: { size: 10 }, header: true, type: "label" });
                else
                    ele.push({ cols: cols, value: this.DATA[j], font: { size: 10 } });

            }
            var ds = getDSData(param + "&item_id=" + this.DATA[this.DATA.length - 2]);
            $.each(ds, function () {
                ele.push({ cols: 20, value: this, font: { size: 10 } });
            })
            v_global.logic.row.push({ element: ele });
        })
        //----------
        var args = v_global.logic.form;
        args.row = v_global.logic.row;
        gw_com_module.formCreate(args);
        //----------
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

    }
}
//----------
function getDSData(param) {

    var rtn = new Array();
    var args = {
        request: "PAGE",
        name: "SVM_1050_2",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=SVM_1050_2" +
            "&QRY_COLS=result_date" +
            "&CRUD=R" +
            "&arg_data_tp=DS" + param,
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        $.each(data, function () {
            rtn.push(this.DATA[0]);
        })

    }
    //----------
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