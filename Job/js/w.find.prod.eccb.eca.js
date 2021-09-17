//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
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
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                //{ type: "PAGE", name: "제품유형", query: "dddw_prodtype_eccb" },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
                {
                    type: "PAGE", name: "LINE", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "IEHM02" }]
                },
                { type: "PAGE", name: "PROCESS", query: "dddw_custproc" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
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
                { name: "조회", value: "제품조회", icon: "조회" },
                { name: "확인", value: "확인", icon: "저장", act: true },
                { name: "취소", value: "취소", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_분류", query: "w_find_prod_eccb_M_1", title: "분류",
            height: "100%", pager: false, show: true,
            editable: { master: true, bind: "select", focus: "prod_type", validate: true },
            element: [
                {
                    header: "장비군", name: "dept_area", width: 80, align: "center",
                    format: { type: "select", data: { memory: "DEPT_AREA_FIND" } },
                    editable: {
                        type: "select",
                        data: { memory: "DEPT_AREA_FIND" /*, unshift: [{ title: "-", value: "%"}]*/ },
                        change: [{ name: "prod_type", memory: "제품유형", key: ["dept_area"] }]
                    }
                },
                {
                    header: "고객사", name: "cust_cd", width: 150, align: "center",
                    format: { type: "select", data: { memory: "고객사" } },
                    editable: {
                        type: "select",
                        data: { memory: "고객사", unshift: [{ title: "-", value: "%" }] }
                    }
                },
                {
                    header: "Line", name: "cust_dept", width: 150, align: "center",
                    format: { type: "select", data: { memory: "LINE" } },
                    editable: { type: "select", data: { memory: "LINE", unshift: [{ title: "-", value: "%" }] } }
                },
                {
                    header: "제품유형", name: "prod_type", width: 150, align: "center",
                    format: { type: "select", data: { memory: "제품유형", key: ["dept_area"] } },
                    editable: { type: "select", data: { memory: "제품유형", key: ["dept_area"] } }
                },
                {
                    header: "Process", name: "cust_proc", width: 150, align: "center",
                    format: { type: "select", data: { memory: "PROCESS" } },
                    editable: { type: "select", data: { memory: "PROCESS", unshift: [{ title: "-", value: "%" }] } }
                },
                {
                    header: "제품코드", name: "prod_cd", width: 150, align: "center",
                    editable: { type: "text" }
                },
                { name: "prod_nm", hidden: true },
                { name: "prod_key", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_제품", query: "w_find_prod_eccb_M_1", title: "제품",
            height: 250, show: true, dynamic: true, key: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 70, align: "center" },
                { header: "Line", name: "cust_dept_nm", width: 90, align: "center" },
                { header: "제품유형", name: "prod_type_nm", width: 90, align: "center" },
                { header: "Process", name: "cust_proc_nm", width: 90, align: "center" },
                { header: "고객설비명", name: "cust_prod_nm", width: 150, align: "center" },
                { header: "제품코드", name: "prod_cd", width: 80, align: "center" },
                { header: "제품명", name: "prod_nm", width: 200, align: "left" },
                { name: "cust_cd", hidden: true },
                { name: "prod_key", hidden: true },
                { name: "prod_type", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_분류", offset: 8 },
                { type: "GRID", id: "grdData_제품", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
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
        var args = {
            targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "확인",
            event: "click",
            handler: click_lyrMenu_확인
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "취소",
            event: "click",
            handler: click_lyrMenu_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_제품",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_제품
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_제품",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_제품
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_확인(ui) {

            informResult({});

        }
        //----------
        function click_lyrMenu_취소(ui) {

            processClose({});

        }
        //----------
        function itemchanged_grdData_분류(ui) {

            switch (ui.element) {
                case "prod_type":
                    {
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "cust_cd", "%");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "cust_dept", "%");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "cust_proc", "%");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_cd", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_nm", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_key", "");
                    }
                    break;
                case "cust_cd":
                    {
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "cust_dept", "%");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "cust_proc", "%");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_cd", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_nm", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_key", "");
                    }
                    break;
                case "cust_dept":
                    {
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "cust_proc", "%");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_cd", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_nm", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_key", "");
                    }
                    break;
                case "cust_proc":
                    {
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_cd", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_nm", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_key", "");
                    }
                    break;
                case "prod_cd":
                    {
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_key", "");
                        gw_com_api.setCellValue(ui.type, ui.object, ui.row, "prod_nm", "");
                    }
                    break;
            }

        }
        //----------
        function rowdblclick_grdData_제품(ui) {

            informResult({ detail: true });

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
processRetrieve = function (param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_분류"
            }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "GRID", id: "grdData_분류", row: "selected",
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_proc", argument: "arg_cust_proc" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_제품", select: true, focus: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_분류"
            },
            {
                type: "GRID",
                id: "grdData_제품"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informResult(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedProduct_ECCB
    };
    if (param.detail) {
        args.data = {
            cust_cd: gw_com_api.getValue("grdData_제품", "selected", "cust_cd", true),
            cust_nm: gw_com_api.getValue("grdData_제품", "selected", "cust_nm", true),
            cust_dept: gw_com_api.getValue("grdData_제품", "selected", "cust_dept", true),
            cust_proc: gw_com_api.getValue("grdData_제품", "selected", "cust_proc", true),
            prod_type: gw_com_api.getValue("grdData_제품", "selected", "prod_type", true),
            prod_type_nm: gw_com_api.getValue("grdData_제품", "selected", "prod_type_nm", true),
            prod_cd: gw_com_api.getValue("grdData_제품", "selected", "prod_cd", true),
            prod_nm: gw_com_api.getValue("grdData_제품", "selected", "prod_nm", true),
            prod_key: gw_com_api.getValue("grdData_제품", "selected", "prod_key", true)
        };
    }
    else {
        args.data = {
            cust_cd: gw_com_api.getValue("grdData_분류", "selected", "cust_cd", true),
            cust_nm: gw_com_api.getText("grdData_분류", "selected", "cust_cd", true),
            cust_dept: gw_com_api.getValue("grdData_분류", "selected", "cust_dept", true),
            cust_proc: gw_com_api.getValue("grdData_분류", "selected", "cust_proc", true),
            prod_type: gw_com_api.getValue("grdData_분류", "selected", "prod_type", true),
            prod_type_nm: gw_com_api.getText("grdData_분류", "selected", "prod_type", true),
            prod_cd: gw_com_api.getValue("grdData_분류", "selected", "prod_cd", true),
            prod_nm: gw_com_api.getValue("grdData_분류", "selected", "prod_nm", true),
            prod_key: gw_com_api.getValue("grdData_분류", "selected", "prod_key", true)
        };
    }
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function createSearch(param) {

    if (v_global.data != undefined) {
        var args = {
            targetid: "grdData_분류", edit: true,
            data: [
                { name: "dept_area", value: v_global.data.dept_area },
                { name: "prod_type", value: v_global.data.prod_type },
                { name: "cust_cd", value: v_global.data.cust_cd },
                { name: "cust_dept", value: v_global.data.cust_dept },
                { name: "cust_proc", value: v_global.data.cust_proc },
                { name: "prod_cd", value: v_global.data.prod_cd },
                { name: "prod_nm", value: v_global.data.prod_nm },
                { name: "prod_key", value: v_global.data.prod_key }
            ]
        };
        gw_com_module.gridInsert(args);
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
        case gw_com_api.v_Stream.msg_selectProduct_ECCB:
            {
                if (param.data != undefined) {
                    if (v_global.data == undefined || v_global.data.root_no == undefined || v_global.data.root_no != param.data.root_no) {
                        v_global.data = param.data;

                        var dddw = {
                            request: [
                                {
                                    type: "PAGE", name: "제품유형", query: "dddw_prodtype_eca",
                                    param: [{ argument: "arg_root_no", value: param.data.root_no }]
                                }
                            ],
                            starter: createSearch
                        };
                        gw_com_module.selectSet(dddw);
                    } else {
                        v_global.data = param.data;
                        createSearch({});
                    }
                }
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//