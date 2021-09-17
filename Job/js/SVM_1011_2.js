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
                { type: "PAGE", name: "제품유형", query: "dddw_prodtype_eccb" },
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
            targetid: "grdData_분류", query: "SVM_1011_2_1", title: "분류",
            height: "100%", pager: false, show: true,
            editable: { master: true, bind: "select", focus: "prod_type", validate: true },
            element: [
                {
                    header: "장비군", name: "dept_area", width: 100, align: "center",
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
                    editable: { type: "select", data: { memory: "고객사", unshift: [{ title: "-", value: "%" }] } }
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
                    header: "Project No.", name: "proj_no", width: 150, align: "center",
                    editable: { type: "text" }
                },
                { name: "prod_nm", hidden: true },
                { name: "prod_key", hidden: true },
                { name: "cust_proc_nm", hidden: true },
                { name: "cust_dept_nm", hidden: true },
                { name: "prod_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_제품", query: "SVM_1011_2_1", title: "제품",
            height: 270, show: true, dynamic: true, key: true, multi: true, checkrow: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 70 },
                { header: "Line", name: "cust_dept_nm", width: 90 },
                { header: "제품유형", name: "prod_type_nm", width: 90 },
                { header: "Process", name: "cust_proc_nm", width: 90 },
                { header: "고객설비명", name: "cust_prod_nm", width: 150 },
                { header: "Project No.", name: "proj_no", width: 80 },
                { header: "제품명", name: "prod_nm", width: 200, align: "left" },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "prod_key", hidden: true },
                { name: "prod_type", hidden: true },
                { name: "prod_subqty", hidden: true },
                { name: "dlv_ymd", hidden: true }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function processClick(param) {

            switch (param.element) {
                case "조회":
                    {
                        processRetrieve({});
                    }
                    break;
                case "확인":
                    {
                        informResult({});
                    }
                    break;
                case "취소":
                    {
                        processClose({});
                    }
                    break;
            }

        }
        //----------

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
                { name: "cust_proc", argument: "arg_cust_proc" },
                { name: "proj_no", argument: "arg_proj_no" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_제품", focus: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_분류" },
            { type: "GRID", id: "grdData_제품" }
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

    var ids = gw_com_api.getSelectedRow("grdData_제품", true);
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }
    var data = new Array();
    $.each(ids, function () {
        data.push({
            prod_key: gw_com_api.getValue("grdData_제품", this, "prod_key", true),
            prod_type: gw_com_api.getValue("grdData_제품", this, "prod_type", true),
            prod_type_nm: gw_com_api.getValue("grdData_제품", this, "prod_type_nm", true),
            prod_nm: gw_com_api.getValue("grdData_제품", this, "prod_nm", true),
            prod_subqty: gw_com_api.getValue("grdData_제품", this, "prod_subqty", true),
            cust_cd: gw_com_api.getValue("grdData_제품", this, "cust_cd", true),
            cust_nm: gw_com_api.getValue("grdData_제품", this, "cust_nm", true),
            cust_dept: gw_com_api.getValue("grdData_제품", this, "cust_dept", true),
            cust_dept_nm: gw_com_api.getValue("grdData_제품", this, "cust_dept_nm", true),
            cust_proc: gw_com_api.getValue("grdData_제품", this, "cust_proc", true),
            cust_proc_nm: gw_com_api.getValue("grdData_제품", this, "cust_proc_nm", true),
            cust_prod_nm: gw_com_api.getValue("grdData_제품", this, "cust_prod_nm", true),
            proj_no: gw_com_api.getValue("grdData_제품", this, "proj_no", true),
            dlv_ymd: gw_com_api.getValue("grdData_제품", this, "dlv_ymd", true)
        });
    })
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: data
    };
    gw_com_module.streamInterface(args);
    gw_com_api.selectRow("grdData_제품", "reset");

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
                var args = { targetid: "grdData_분류", edit: true };
                if (param.data != undefined) {
                    var OptDeptArea = "";
                    if (param.data.cur_dept_area != undefined) {
                        if (param.data.cur_dept_area == null) OptDeptArea = param.data.my_dept_area;
                        else OptDeptArea = param.data.cur_dept_area;
                    }

                    args.data = [
                        { name: "dept_area", value: OptDeptArea },
                        { name: "prod_type", value: param.data.prod_type },
                        { name: "cust_cd", value: param.data.cust_cd },
                        { name: "cust_dept", value: param.data.cust_dept },
                        { name: "cust_proc", value: param.data.cust_proc },
                        //{ name: "prod_cd", value: param.data.prod_cd },
                        { name: "prod_nm", value: param.data.prod_nm },
                        { name: "prod_key", value: param.data.prod_key },
                        { name: "proj_no", value: param.data.proj_no }
                    ];
                }
                gw_com_module.gridInsert(args);
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