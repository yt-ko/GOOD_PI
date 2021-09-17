//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        init: false,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
    data: null,
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
                { name: "확인", value: "선택", icon:"저장" },
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", trans: true, show: true,
            border: false, align: "left", editable: { bind: "open", focus: "part_cd", validate: true }, /*
            remark: "lyrRemark",*/
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "기간 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 20 }
				            },
				            {
				                name: "ymd_to", label: { title: "~ " }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 20 }
				            },
				            {
				                name: "실행", act: true, show: false,
				                format: { type: "button" }
				            },
                          { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                          { name: "qcitem_cd", hidden: true, editable: { type: "hidden" } },
                          { name: "part_grp", hidden: true, editable: { type: "hidden" } },
                          { name: "part_no", hidden: true, editable: { type: "hidden" } },
                          { name: "spc_id", hidden: true, editable: { type: "hidden" } },
                          { name: "chart_view", hidden: true, editable: { type: "hidden" } }
				        ]
                    }
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_QC", query: "SPC_3010_TEST_S_2", title: "군별 측정 Data",
            caption: true, width: 850, height: 300, show: true, selectable: true, pager: true, number: true,
            color: { row: true },
            element: [
        		//{ header: "Group No.", name: "seq", width: 50, align: "center" },
        		{ header: "검사일자", name: "qc_date", width: 80, mask: "date-ymd", align: "center" },
            	{ header: "Project No.", name: "proj_no", width: 70, align: "center" },
            	{ header: "Value 1", name: "value_1", width: 60, align: "right" },
            	{ header: "Value 2", name: "value_2", width: 60, align: "right" },
            	{ header: "Value 3", name: "value_3", width: 60, align: "right" },
            	{ header: "Value 4", name: "value_4", width: 60, align: "right" },
            	{ header: "Value 5", name: "value_5", width: 60, align: "right" },
            	{ header: "평균(X)", name: "value_avg", width: 60, align: "center" },
            	{ header: "범위(R)", name: "value_area", width: 60, align: "center" },
            	{ header: "Serial No.", name: "ser_no", width: 200, align: "left" },
            	{ header: "Remark", name: "qc_rmk", width: 400, align: "left" },
        		{ header: "검사일자1", name: "qc_date1", width: 80, mask: "date-ymd", align: "center" },
            	{ header: "Project No.1", name: "proj_no1", width: 70, align: "center" },
            	{ header: "Serial No.1", name: "ser_no1", width: 200, align: "left" },
        		{ header: "검사일자2", name: "qc_date2", width: 80, mask: "date-ymd", align: "center" },
            	{ header: "Project No.2", name: "proj_no2", width: 70, align: "center" },
            	{ header: "Serial No.2", name: "ser_no2", width: 200, align: "left" },
        		{ header: "검사일자3", name: "qc_date3", width: 80, mask: "date-ymd", align: "center" },
            	{ header: "Project No.3", name: "proj_no3", width: 70, align: "center" },
            	{ header: "Serial No.3", name: "ser_no3", width: 200, align: "left" },
        		{ header: "검사일자4", name: "qc_date4", width: 80, mask: "date-ymd", align: "center" },
            	{ header: "Project No.4", name: "proj_no4", width: 70, align: "center" },
            	{ header: "Serial No.4", name: "ser_no4", width: 200, align: "left" },
        		{ header: "검사일자5", name: "qc_date5", width: 80, mask: "date-ymd", align: "center" },
            	{ header: "Project No.5", name: "proj_no5", width: 70, align: "center" },
            	{ header: "Serial No.5", name: "ser_no5", width: 200, align: "left" },
            	{ name: "color", hidden: true }
        	]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_QC", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: rowdblclick_grdData };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        //gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

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
        function rowdblclick_grdData(ui) {

            informResult({});

        }
        //----------
        function rowselected(ui) {
            processLink(ui);
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
        processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
processRetrieve = function(param) {
    var args = {
        source: {
            type: "FORM", id: "frmOption",
            hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
                { name: "part_no", argument: "arg_part_no" },
                { name: "spc_id", argument: "arg_spc_id" },
				{ name: "part_grp", argument: "arg_part_grp" },
				{ name: "qcitem_cd", argument: "arg_qcitem_cd" },
				{ name: "chart_view", argument: "arg_chart_view" }
			]
        },
        target: [
			{ type: "GRID", id: "grdData_QC", select: true, focus: true }
		],
		key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processLink(param) {
    var args;
    var ymd_fr = gw_com_api.getValue("frmOption", 1, "ymd_fr");
    var ymd_to = gw_com_api.getValue("frmOption", 1, "ymd_to");
    if (param.object == "grdData_SUPP") {
        args = {
            source: {
                type: "GRID", id: "grdData_SUPP", row: "selected", block: true,
                element: [
                    { name: "supp_cd", argument: "arg_supp_cd" }
                ],
                argument: [
                    { name: "arg_ymd_fr", value: ymd_fr },
                    { name: "arg_ymd_to", value: ymd_to }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_ITEM" }
            ],
            clear: [
                { type: "GRID", id: "grdData_QC" }
            ]
        };
    }
    else if (param.object == "grdData_ITEM") {
        args = {
            source: {
                type: "GRID", id: "grdData_ITEM", row: "selected", block: true,
                element: [
                    { name: "item_no", argument: "arg_item_no" }
                ],
                argument: [
                    { name: "arg_ymd_fr", value: ymd_fr },
                    { name: "arg_ymd_to", value: ymd_to },
                    { name: "arg_supp_cd", value: gw_com_api.getValue("grdData_SUPP", "selected", "supp_cd", true) },
                ]
            },
            target: [
                { type: "GRID", id: "grdData_QC" }
            ]
        };
    }
    gw_com_module.objRetrieve(args);
}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function informResult(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedProduct_QCM,
        data: {
            ymd_fr: gw_com_api.getValue("frmOption", 1, "ymd_fr" ),
            ymd_to: gw_com_api.getValue("frmOption", 1, "ymd_to"),
            supp_cd: gw_com_api.getValue("grdData_SUPP", "selected", "supp_cd", true),
            supp_nm: gw_com_api.getValue("grdData_SUPP", "selected", "supp_nm", true),
            item_no: gw_com_api.getValue("grdData_ITEM", "selected", "item_no", true),
            item_nm: gw_com_api.getValue("grdData_ITEM", "selected", "item_nm", true),
            qcitem_cd: gw_com_api.getValue("grdData_QC", "selected", "qcitem_cd", true),
            qcitem_nm: gw_com_api.getValue("grdData_QC", "selected", "qcitem_nm", true)
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
        case gw_com_api.v_Stream.msg_retrieve:
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    gw_com_api.setValue("frmOption", 1, "ymd_fr", param.data.ymd_fr);
                    gw_com_api.setValue("frmOption", 1, "ymd_to", param.data.ymd_to);
                    gw_com_api.setValue("frmOption", 1, "supp_cd", param.data.supp_cd);
                    gw_com_api.setValue("frmOption", 1, "spc_id", param.data.spc_id);
                    gw_com_api.setValue("frmOption", 1, "part_no", param.data.part_no);
                    gw_com_api.setValue("frmOption", 1, "part_grp", param.data.part_grp);
                    gw_com_api.setValue("frmOption", 1, "qcitem_cd", param.data.qcitem_cd);
                    gw_com_api.setValue("frmOption", 1, "chart_view", param.data.chart_view);
                    processRetrieve({});
                }

            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//