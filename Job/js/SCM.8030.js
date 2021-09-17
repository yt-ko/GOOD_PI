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

        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();

            v_global.logic.proj_no = gw_com_api.getPageParameter("proj_no");
            gw_com_api.setValue("frmOption", 1, "proj_no", v_global.logic.proj_no);

            processRetrieve({});

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmOption", type: "FREE",
            trans: true, show: false, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "prod_type", validate: true },
            content: { row: [
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Proj No :" },
                                editable: { type: "text", size: 15, maxlength: 50 }
                            }

                        ]
                    }
			    ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "SCM_8030_M_1", type: "TABLE", title: "종합 정보",
            caption: true, show: true,
            content: { width: { label: 80, field: 130 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "Project No.", format: { type: "label" } },
                            { name: "proj_no" },
                            { header: true, value: "진행률", format: { type: "label" } },
                            { name: "prc_rate" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "시작일자", format: { type: "label" } },
                            { name: "str_ymd", mask: "date-ymd"},
                            { header: true, value: "종료일자", format: { type: "label" } },
                            { name: "end_ymd", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "pstat" },
                            { header: true, value: "고객사", format: { type: "label" } },
                            { name: "cust_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Line", format: { type: "label" } },
                            { name: "cust_dept" },
                            { header: true, value: "고객설비명", format: { type: "label" } },
                            { name: "cust_prod_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "요청납기", format: { type: "label" } },
                            { name: "due_ymd", mask: "date-ymd"  },
                            { header: true, value: "출하일자", format: { type: "label" } },
                            { name: "dlv_ymd", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제품유형", format: { type: "label" } },
                            { name: "prod_type" },
                            { header: true, value: "고객공정", format: { type: "label" } },
                            { name: "cust_proc" }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        $("#frmData_Main_proj_no_view").css({ "color": "black", "font-weight": "bold" });
        $("#frmData_Main_prc_rate_view").css({ "color": "black", "font-weight": "bold" });
        //=====================================================================================
        var args = {
            targetid: "grdData_Ing", query: "SCM_8030_M_2", title: "공정 진행률",
            width: 400, height: 350, show: true, selectable: true, caption: true, number:true,
            element: [
                { header: "공정명", name: "prc_nm", width: 140 },
				{
				    header: "완료", name: "pstat", width: 60, align: "center"
				},
				{
				    header: "완료일자", name: "end_date", width: 90, align: "center", mask: "date-ymd"
				},
				{
				    header: "표준진행율", name: "std_prc_rate", width: 60, align: "right", mask: "numeric-float"
				}
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Issue", query: "SCM_8030_S_1", title: "이슈 사항",
            width: 433, height: 165, show: true, selectable: true, caption: true,
            element: [
                { header: "구분", name: "dname", width: 170, format: { type: "link" } },
                { header: "발생", name: "occ", width: 80, align:"right" },
                { header: "조치완료", name: "fin", width: 80, align: "right" },
                { header: "미완료", name: "not_fin", width: 80, align: "right" }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Ing", offset: 8 },
                { type: "FORM", id: "grdData_Issue", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Issue", grid: true, element: "dname", event: "click", handler: click_lyrMenu_Link };
        gw_com_module.eventBind(args);
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        
        function click_lyrMenu_닫기(ui) {

            top.window.close();

        }


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function click_lyrMenu_Link(param) {
    var proj_no = proj_no = gw_com_api.getValue("frmOption", 1, "proj_no");

    window.open("/Job/SCM_FRAME.aspx?sub_cat_no=S53&proj_no=" + proj_no + "&mact_id=" + "&issue_tp=setup");
}
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    //if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve 
    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "proj_no", argument: "arg_proj_no" }
            ],
            remark: [
		        { element: [{ name: "proj_no" }] }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main", focus: true },
            { type: "GRID", id: "grdData_Issue" },
            { type: "GRID", id: "grdData_Ing" }
        ]
    };
    gw_com_module.objRetrieve(args);

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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "SYS_2031":
                    case "SYS_2032":
                    case "SYS_2033": {
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = { qry_id: v_global.logic.key }
                    } break;
                }
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
