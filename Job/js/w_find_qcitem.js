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
            targetid: "grdData_SUPP", query: "W_FIND_QCITEM_M_1", title: "검사",
            height: "300", show: true, key: true, width:"220",
            element: [
				{ header: "협력사", name: "supp_nm", width: 200, align: "left" },
                { name: "supp_cd", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_ITEM", query: "W_FIND_QCITEM_M_2", title: "검사",
            height: "300", show: true, key: true, width: "320",
            element: [
                { header: "품번", name: "item_no", width: 70, align: "center" },
				{ header: "품명", name: "item_nm", width: 270, align: "left" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_QC", query: "W_FIND_QCITEM_M_3", title: "검사",
            height: "300", show: true, key: true, width: "220",
            element: [
				{ header: "검사항목", name: "qcitem_nm", width: 210, align: "left" },
                { name: "qcitem_cd", hidden: true}
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_ITEM", offset: 8 },
                { type: "GRID", id: "grdData_SUPP", offset: 8 },
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
        var args = { targetid: "grdData_SUPP", grid: true, event: "rowdblclick", handler: rowdblclick_grdData };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUPP", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_ITEM", grid: true, event: "rowdblclick", handler: rowdblclick_grdData };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_ITEM", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_QC", grid: true, event: "rowdblclick", handler: rowdblclick_grdData };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_QC", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUPP", grid: true, event: "rowselected", handler: rowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_ITEM", grid: true, event: "rowselected", handler: rowselected };
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        if (gw_com_api.getPageParameter("ymd_fr")) {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
        }
        if (gw_com_api.getPageParameter("ymd_to")) {
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
        }
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

    /*
    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false)
        return false;
        */
    //if (gw_com_api.getValue("frmOption", 1, "part_cd") == ""
    //    && gw_com_api.getValue("frmOption", 1, "part_nm") == ""
    //    && gw_com_api.getValue("frmOption", 1, "part_spec") == "") {
    //    gw_com_api.messageBox([
    //        { text: "조회 조건 중 한 가지는 반드시 입력하셔야 합니다." }
    //    ]);
    //    gw_com_api.setError(true, "frmOption", 1, "part_cd", false, true);
    //    gw_com_api.setError(true, "frmOption", 1, "part_nm", false, true);
    //    gw_com_api.setError(true, "frmOption", 1, "part_spec", false, true);
    //    return false;
    ////}
    //gw_com_api.setError(false, "frmOption", 1, "part_cd", false, true);
    //gw_com_api.setError(false, "frmOption", 1, "part_nm", false, true);
    //gw_com_api.setError(false, "frmOption", 1, "part_spec", false, true);
        
    var args = {
        source: {
            type: "FORM", id: "frmOption",
            //hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" }
			]/*,
            remark: [
		        {
		            element: [{ name: "part_cd"}]
		        },
		        {
		            element: [{ name: "part_nm"}]
		        },
		        {
		            element: [{ name: "part_spec"}]
		        }
		    ]*/
        },
        target: [
			{ type: "GRID", id: "grdData_SUPP", select: true, focus: true }
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
        case gw_com_api.v_Stream.msg_selectProduct_QCM:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    gw_com_api.setValue("frmOption", 1, "ymd_fr", param.data.ymd_fr);
                    gw_com_api.setValue("frmOption", 1, "ymd_to", param.data.ymd_to);
                    if (param.data.qcitem_cd
                        != gw_com_api.getValue("frmOption", 1, "qcitem_cd")) {
                        gw_com_api.setValue("frmOption", 1, "qcitem_cd", param.data.qcitem_cd);
                        retrieve = true;
                    }
                    if (param.data.qcitem_nm
                        != gw_com_api.getValue("frmOption", 1, "qcitem_nm")) {
                        gw_com_api.setValue("frmOption", 1, "qcitem_nm", param.data.qcitem_nm);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});

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