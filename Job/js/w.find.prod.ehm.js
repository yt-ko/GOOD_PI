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
                {
                    type: "PAGE", name: "장비군", query: "dddw_prodgroup",
                    param: [
                        { argument: "arg_hcode", value: "IEHM13" }
                    ]
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
                {
                    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
                },
                {
                    type: "PAGE", name: "PROCESS", query: "dddw_custproc"
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

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
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true,
            editable: { bind: "open", focus: "cust_cd", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cust_cd", label: { title: "고객사 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "고객사", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "cust_dept", memory: "LINE", unshift: [{ title: "전체", value: "" }], key: ["cust_cd"] }]
                                }
                            },
                            {
                                name: "cust_dept", label: { title: "LINE :" },
                                editable: { type: "select", data: { memory: "LINE", unshift: [{ title: "전체", value: "" }], key: ["cust_cd"] } }
                            },
                            {
                                name: "cust_proc", label: { title: "PROCESS :" },
                                editable: { type: "select", data: { memory: "PROCESS", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cust_prod_nm", label: { title: "고객설비명 :" },
                                editable: { type: "text", size: 11, maxlength: 20 }
                            },
                            {
                                name: "prod_cd", label: { title: "제품코드 :" },
                                editable: { type: "text", size: 8, maxlength: 20 }
                            },
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 8, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, data: { memory: "DEPT_AREA_FIND" } }
                            },
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
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
            targetid: "grdData_제품", query: "w_find_prod_ehm_M_1", title: "제품",
            height: "300", show: true, dynamic: true, key: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 70 },
                { header: "LINE", name: "cust_dept_nm", width: 70 },
                { header: "Process", name: "cust_proc_nm", width: 70 },
                { header: "고객설비명", name: "cust_prod_nm", width: 120 },
                { header: "Project No.", name: "proj_no", width: 80 },
                { header: "장비명", name: "prod_nm", width: 120 },
                { header: "Serial No.", name: "prod_key", width: 100 },
                { header: "제품코드", name: "prod_cd", width: 80 },
                { header: "S/W Ver.", name: "sw_version", width: 60 },
                { header: "납품일자", name: "dlv_ymd", align: "center", width: 80, mask: "date-ymd" },
                { header: "보증기간", name: "wrnt_term", width: 60, align: "center" },
                { header: "보증만료일", name: "wrnt_ymd", align: "center", width: 80, mask: "date-ymd" },
                { name: "prod_type", hidden: true },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "dept_area", hidden: true },
                { name: "dept_area_nm", hidden: true },
                { name: "wrnt_io", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_제품", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_제품", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_제품 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_제품", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_제품 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            //processRetrieve({});
            var args = {
                target: [
                    { id: "frmOption", focus: true }
                ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowdblclick_grdData_제품(ui) {

            informResult({});

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
            { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_proc", argument: "arg_cust_proc" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "prod_cd", argument: "arg_prod_cd" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "dept_area", argument: "arg_dept_area" }
            ],
            remark: [
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_proc" }] },
                { element: [{ name: "cust_prod_nm" }] },
                { element: [{ name: "prod_cd" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "dept_area" }] }
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

    var wrnt_ymd = gw_com_api.unMask(gw_com_api.getValue("grdData_제품", "selected", "wrnt_ymd", true), "date-ymd");
    var args = {
        ID: gw_com_api.v_Stream.msg_selectedProduct_EHM,
        data: {
            cust_cd: gw_com_api.getValue("grdData_제품", "selected", "cust_cd", true),
            cust_nm: gw_com_api.getValue("grdData_제품", "selected", "cust_nm", true),
            cust_dept: gw_com_api.getValue("grdData_제품", "selected", "cust_dept", true),
            cust_dept_nm: gw_com_api.getValue("grdData_제품", "selected", "cust_dept_nm", true),
            cust_proc: gw_com_api.getValue("grdData_제품", "selected", "cust_proc", true),
            cust_proc_nm: gw_com_api.getValue("grdData_제품", "selected", "cust_proc_nm", true),
            cust_prod_nm: gw_com_api.getValue("grdData_제품", "selected", "cust_prod_nm", true),
            prod_key: gw_com_api.getValue("grdData_제품", "selected", "prod_key", true),
            prod_type: gw_com_api.getValue("grdData_제품", "selected", "prod_type", true),
            prod_nm: gw_com_api.getValue("grdData_제품", "selected", "prod_nm", true),
            proj_no: gw_com_api.getValue("grdData_제품", "selected", "proj_no", true),
            wrnt_io: gw_com_api.getValue("grdData_제품", "selected", "wrnt_io", true),
            dept_area: gw_com_api.getValue("grdData_제품", "selected", "dept_area", true),
            dept_area_nm: gw_com_api.getValue("grdData_제품", "selected", "dept_area_nm", true)
        }
    };

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
        case gw_com_api.v_Stream.msg_selectProduct_EHM:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.prod_group
                        != gw_com_api.getValue("frmOption", 1, "prod_group")) {
                        gw_com_api.setValue("frmOption", 1, "prod_group", param.data.prod_group);
                        retrieve = true;
                    }
                    if (param.data.cust_cd
                        != gw_com_api.getValue("frmOption", 1, "cust_cd")) {
                        gw_com_api.setValue("frmOption", 1, "cust_cd", param.data.cust_cd);
                        retrieve = true;
                    }
                    if (param.data.cust_dept
                        != gw_com_api.getValue("frmOption", 1, "cust_dept")) {
                        gw_com_api.setValue("frmOption", 1, "cust_dept", param.data.cust_dept);
                        retrieve = true;
                    }
                    if (param.data.cust_proc
                        != gw_com_api.getValue("frmOption", 1, "cust_proc")) {
                        gw_com_api.setValue("frmOption", 1, "cust_proc", param.data.cust_proc);
                        retrieve = true;
                    }
                    if (param.data.cust_prod_nm
                        != gw_com_api.getValue("frmOption", 1, "cust_prod_nm")) {
                        gw_com_api.setValue("frmOption", 1, "cust_prod_nm", param.data.cust_prod_nm);
                        retrieve = true;
                    }
                    if (param.data.prod_cd
                        != gw_com_api.getValue("frmOption", 1, "prod_cd")) {
                        gw_com_api.setValue("frmOption", 1, "prod_cd", param.data.prod_cd);
                        retrieve = true;
                    }
                    if (param.data.proj_no
                        != gw_com_api.getValue("frmOption", 1, "proj_no")) {
                        gw_com_api.setValue("frmOption", 1, "proj_no", param.data.proj_no);
                        retrieve = true;
                    }
                    if (param.data.dept_area
                        != gw_com_api.getValue("frmOption", 1, "dept_area")) {
                        gw_com_api.setValue("frmOption", 1, "dept_area", param.data.dept_area);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    retrieve = true;
                }
                if (retrieve) {
                    //processRetrieve({}); 
                }
                else {
                    gw_com_api.show("frmOption");
                    //gw_com_api.setFocus("grdData_제품", "selected", "_self", true);
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