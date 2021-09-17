﻿//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.02)
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
        var args = {
            request: [
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
            gw_job_process.procedure();
            //----------
            gw_com_module.informSize();
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            if (v_global.process.param != "") {
                gw_com_api.setValue("frmOption", 1, "eca_no", gw_com_api.getPageParameter("eca_no"));
                processRetrieve({});
            }

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
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "승인일자 :" },
                                mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "eca_no", label: { title: "ECA No. :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 16 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
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
            targetid: "grdData_PJT", query: "w_eccb9030_1", title: "ECA 적용 Project",
            caption: true, height: "440", show: true, selectable: true, number: true,
            element: [
                { header: "승인일자", name: "eca_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "프로젝트명", name: "proj_nm", width: 180 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                {
                    header: "ECA No.", name: "eca_no", width: 90, align: "center",
                    format: { type: "link" }
                },
                { header: "ECA 제목", name: "eca_title", width: 350 },
                {
                    header: "ECO No.", name: "eco_no", width: 90, align: "center",
                    format: { type: "link" }
                },
                { name: "root_no", hidden: true },
                { name: "root_seq", hidden: true },
                { name: "model_seq", hidden: true },
                { name: "proj_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_PJT", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================


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

        //====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "grdData_PJT", grid: true, element: "eca_no", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_PJT", grid: true, element: "eco_no", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "조회":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "실행":
                    {
                        processRetrieve({});
                    }
                    break;
                case "취소":
                    {
                        gw_com_api.hide("frmOption");
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
        function processItemclick(param) {

            switch (param.element) {
                case "eca_no":
                    {
                        var args = {
                            ID: gw_com_api.v_Stream.msg_linkPage,
                            to: {
                                type: "MAIN"
                            },
                            data: {
                                page: "w_eccb4050",
                                title: "ECA 정보",
                                param: [
                                    { name: "eca_no", value: gw_com_api.getValue("grdData_PJT", "selected", "eca_no", true) },
                                    { name: "eco_no", value: gw_com_api.getValue("grdData_PJT", "selected", "eco_no", true) },
                                    { name: "AUTH", value: "R" }
                                ]
                            }
                        };

                        gw_com_module.streamInterface(args);
                    }
                    break;
                case "eco_no":
                    {
                        var eco_no = gw_com_api.getValue(param.object, param.row, "eco_no", (param.type == "GRID"));
                        var tab = "ECO";
                        var args = {
                            to: "INFO_ECCB",
                            eco_no: eco_no,
                            tab: tab
                        };
                        gw_com_site.linkPage(args);
                    }
                    break;
            }

        }
        //====================================================================================


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
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "eca_no", argument: "arg_eca_no" },
                { name: "proj_no", argument: "arg_proj_no" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "eca_no" }] },
                { element: [{ name: "proj_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_PJT" }
        ],
        handler: {
            param: param
        }
    };

    gw_com_module.objRetrieve(args);
}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                } else
                                    processBatch(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//