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
            v_global.logic.doc_id = gw_com_api.getPageParameter("doc_id");
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
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "SVM_1011_1", type: "TABLE", title: "S/W 정보",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 100, field: 120 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" },
                            { header: true, value: "S/W Ver.", format: { type: "label" } },
                            { name: "ver_no" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_RPT", type: "REPORT", title: "",
            caption: false, show: true,
            content: {
                cols: 500, width: 10, height: 30,
                row: [
                    {
                        element: [
                            { cols: 4, type: "label", value: "No.", header: true, rows: 11, font: { size: 10 } },
                            { cols: 15, type: "label", value: "분류", header: true, rows: 11, font: { size: 10 } },
                            { cols: 10, type: "label", value: "ECR No.", header: true, rows: 11, font: { size: 10 }},
                            { cols: 10, type: "label", value: "CIP No.", header: true, rows: 11, font: { size: 10 }},
                            { cols: 10, type: "label", value: "ECO No.", header: true, rows: 11, font: { size: 10 }},
                            { cols: 20, type: "label", value: "제품유형", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "고객사", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "Line", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "제품명", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "납품일자", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "Process", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "Project No.", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "PM수", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "Safety PLC", header: true, font: { size: 10 }}
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "EDA", header: true, font: { size: 10 } }
                        ]
                    },
                    {
                        element: [
                            { cols: 20, type: "label", value: "PLC Ver.", header: true, font: { size: 10 }}
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
                { type: "FORM", id: "frmData_RPT", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function processButton(param) {

            switch (param.element) {
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

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_doc_id", value: v_global.logic.doc_id }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ],
        clear: [
            { type: "FORM", id: "frmData_RPT" }
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

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_doc_id", value: v_global.logic.doc_id }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_RPT" }
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
                    v_global.logic.row[i].element.push({ cols: 20, type: "label", value: this.DATA[j], header: true, font: { size: 10 } });
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
                    ele.push({ cols: cols, value: this.DATA[j], font: { size: 10 }, align: (j == 2 || j == 3 || j == 4 ? "center" : "left") });
            }
            var ds = getDSData(param + "&arg_item_id=" + this.DATA[this.DATA.length - 2]);
            $.each(ds, function () {
                ele.push({ cols: 20, value: this, font: { size: 10 }, align: "center" });
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
                { type: "FORM", id: "frmData_RPT", offset: 8 }
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
        name: "SVM_1050_3",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=SVM_1050_3" +
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