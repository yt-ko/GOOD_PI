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
        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

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
                { name: "저장", value: "확인" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "proj_no", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "cust_dept", label: { title: "Line :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "ymd_fr", label: { title: "납기예정일 :" }, style: { colfloat: "floating" },
                                editable: { type: "text", size: 7 }, mask: "date-ymd"
                            },
                            {
                                name: "ymd_to", label: { title: "~" },
                                editable: { type: "text", size: 7 }, mask: "date-ymd"
                            },
                            { name: "cust_cd", hidden: true },
                            { name: "prod_type", hidden: true },
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
            targetid: "grdData_목록", query: "w_find_proj_mrp_M_1", title: "Project 목록",
            height: "300", show: true, dynamic: true, key: true,
            element: [
                { header: "Project No.", name: "proj_no", width: 80 },
                { header: "프로젝트명", name: "proj_nm", width: 200 },
                { header: "생산의뢰일자", name: "rqst_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "납기예정일", name: "due_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "고객사", name: "cust_nm", width: 80 },
                { header: "Line", name: "cust_dept_nm", width: 80 },
                { header: "제품유형", name: "prod_type_nm", width: 80 },
                { header: "생산의뢰번호", name: "rqst_no", width: 80, align: "center" },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "cust_proc_nm", hidden: true },
                { name: "prod_type", hidden: true },
                { name: "proj_key", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_목록2", query: "w_find_proj_mrp_M_1", title: "Project 목록",
            height: "300", show: true, dynamic: true, key: true, multi: true, checkrow: true,
            element: [
                { header: "Project No.", name: "proj_no", width: 80 },
                { header: "프로젝트명", name: "proj_nm", width: 200 },
                { header: "생산의뢰일자", name: "rqst_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "납기예정일", name: "due_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "고객사", name: "cust_nm", width: 80 },
                { header: "Line", name: "cust_dept_nm", width: 80 },
                { header: "제품유형", name: "prod_type_nm", width: 80 },
                { header: "생산의뢰번호", name: "rqst_no", width: 80, align: "center" },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "cust_proc_nm", hidden: true },
                { name: "prod_type", hidden: true },
                { name: "proj_key", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_목록", offset: 8 },
                { type: "GRID", id: "grdData_목록2", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_목록", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_목록", grid: true, event: "rowkeyenter", handler: processRowdblclick };
        gw_com_module.eventBind(args);

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
                case "실행":
                    {
                        closeOption({});
                    }
                    break;
            }

        }
        //----------
        function processRowdblclick(param) {

            informResult({});

        }
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.logic.multi = false;
        gw_com_api.hide("grdData_목록2");
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { month: 1 }));
        //----------
        gw_com_module.startPage();
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

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", //hide: true,
            element: [
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "cust_dept", argument: "arg_cust_dept" }
            ],
            remark: [
                { element: [{ name: "proj_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: (v_global.logic.multi ? "grdData_목록2" : "grdData_목록"), focus: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informResult(param) {
    
    var args;
    if (v_global.logic.multi) {
        var ids = gw_com_api.getSelectedRow("grdData_목록2", true);
        if (ids.length == 0) return;
        args = {
            ID: gw_com_api.v_Stream.msg_selectedProject_MRP,
            data: []
        };
        $.each(ids, function () {
            args.data.push({
                proj_no: gw_com_api.getValue("grdData_목록2", this, "proj_no", true),
                proj_nm: gw_com_api.getValue("grdData_목록2", this, "proj_nm", true),
                cust_cd: gw_com_api.getValue("grdData_목록2", this, "cust_cd", true),
                cust_nm: gw_com_api.getValue("grdData_목록2", this, "cust_nm", true),
                cust_dept: gw_com_api.getValue("grdData_목록2", this, "cust_dept", true),
                cust_dept_nm: gw_com_api.getValue("grdData_목록2", this, "cust_dept_nm", true),
                cust_proc: gw_com_api.getValue("grdData_목록2", this, "cust_proc", true),
                cust_proc_nm: gw_com_api.getValue("grdData_목록2", this, "cust_proc_nm", true),
                prod_type: gw_com_api.getValue("grdData_목록2", this, "prod_type", true),
                prod_type_nm: gw_com_api.getValue("grdData_목록2", this, "prod_type_nm", true),
                proj_key: gw_com_api.getValue("grdData_목록2", this, "proj_key", true)
            });
        });
    } else {
        args = {
            ID: gw_com_api.v_Stream.msg_selectedProject_MRP,
            data: {
                proj_no: gw_com_api.getValue("grdData_목록", "selected", "proj_no", true),
                proj_nm: gw_com_api.getValue("grdData_목록", "selected", "proj_nm", true),
                cust_cd: gw_com_api.getValue("grdData_목록", "selected", "cust_cd", true),
                cust_nm: gw_com_api.getValue("grdData_목록", "selected", "cust_nm", true),
                cust_dept: gw_com_api.getValue("grdData_목록", "selected", "cust_dept", true),
                cust_dept_nm: gw_com_api.getValue("grdData_목록", "selected", "cust_dept_nm", true),
                cust_proc: gw_com_api.getValue("grdData_목록", "selected", "cust_proc", true),
                cust_proc_nm: gw_com_api.getValue("grdData_목록", "selected", "cust_proc_nm", true),
                prod_type: gw_com_api.getValue("grdData_목록", "selected", "prod_type", true),
                prod_type_nm: gw_com_api.getValue("grdData_목록", "selected", "prod_type_nm", true),
                proj_key: gw_com_api.getValue("grdData_목록", "selected", "proj_key", true)
            }
        };
    }
    gw_com_module.streamInterface(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectProject_MRP:
            {
                v_global.logic.multi = (param.data.multi ? true : false);
                var retrieve = false;
                if (param.data != undefined) {
                    if (v_global.logic.multi) {
                        gw_com_api.show("grdData_목록2");
                        gw_com_api.hide("grdData_목록");
                    } else {
                        gw_com_api.show("grdData_목록");
                        gw_com_api.hide("grdData_목록2");
                    }
                    
                    if (param.data.proj_no
                        != gw_com_api.getValue("frmOption", 1, "proj_no")) {
                        gw_com_api.setValue("frmOption", 1, "proj_no", param.data.proj_no);
                        retrieve = true;
                    }
                    gw_com_api.setValue("frmOption", 1, "cust_cd", (param.data.cust_cd == undefined ? "" : param.data.cust_cd));
                    gw_com_api.setValue("frmOption", 1, "prod_type", (param.data.prod_type == undefined ? "" : param.data.prod_type));
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "proj_no");
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