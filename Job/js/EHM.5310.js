//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables. : 주요부품 수명주기
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            request: [
                { type: "PAGE", name: "부품군", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM29"}]
                },
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE"
					, param: [ { argument: "arg_hcode", value: "IEHM06" } ] },
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE"
					, param: [ { argument: "arg_hcode", value: "ISCM25" } ] },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline"},
                { type: "INLINE", name: "Warranty",
                    data: [
                        { title: "IN", value: "IN" },
                        { title: "OUT", value: "OUT" }
                    ]
                },
                { type: "INLINE", name: "기준",
                    data: [
                        { title: "부품별", value: "ECR-STATUS-REGION" },
                        { title: "Line별", value: "ECR-STATUS-MODULE" },
                        { title: "호기별", value: "ECR-STATUS-MP" }
                    ]
                },
                { type: "INLINE", name: "VIEW",
                    data: [
						{ title: "수명", value: "1" },
						{ title: "수량", value: "2" }
					]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
                    { name: "조회", value: "조회", act: true },
                    { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmView", type: "FREE",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", validate: true },
            content: {
                row: [
                    { element: [
				            { name: "view", label: { title: "차트 :" },
				                editable: { type: "select", data: { memory: "VIEW" } }
				            },
				            {
				                name: "실행",
				                act: true,
				                show: false,
				                format: {
				                    type: "button"
				                }
				            }
				        ]
                    }
				]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
                            { name: "ymd_fr", label: { title: "발생일자 :" }, mask: "date-ymd",
                                style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            { name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            { name: "part_model", label: { title: "부품군 :" },
                                editable: { type: "select",
                                    data: { memory: "부품군", unshift: [{ title: "전체", value: "%"}] }
                                }
                            },
                            { name: "chart", value: "ECR-DEPT", hidden: true }
                        ]
                    },
                    { element: [
                            { name: "prod_group", label: { title: "제품군 :" },
                                editable: { type: "select",
                                    data: { memory: "제품군", unshift: [ { title: "전체", value: "" } ] }
                                }
                            },
				            { name: "prod_type1", label: { title: "제품유형 :" },
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_type2",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            },
				            { name: "prod_type3",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "" } ] }
				                }
				            }
				        ]
                    },
                     { element: [
				            { name: "cust_cd", label: { title: "고객사 :" },
				                editable: { type: "select",
				                    data: { memory: "고객사", unshift: [ { title: "전체", value: "%" } ] },
				                    change: [ { name: "cust_dept", memory: "LINE", key: [ "cust_cd" ] } ]
				                }
				            },
				            { name: "cust_dept", label: { title: "LINE :" },
				                editable: { type: "select",
				                    data: { memory: "LINE", unshift: [ { title: "전체", value: "%" } ], key: [ "cust_cd" ] }
				                }
				            },
                            { name: "cust_prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            },
                            { name: "wrnt_io", label: { title: "Warranty :" },
                                editable: { type: "select",
                                    data: { memory: "Warranty", unshift: [{ title: "전체", value: "%"}] }
                                }
                            }
                        ]
                    },
                    { align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button"} },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기"} }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);        
        //--------------------------------------------------
        //gw_com_module.gridCreate : grdData_분류1
        var args = {
            targetid: "grdData_분류1", query: "EHM_5310_M_1", title: "부품별",
            caption: true, width: 216, height: 200, pager: false, show: true,
            element: [
                { header: "부품", name: "category", width: 110, align: "center" },
                { header: "수명", name: "time", width: 50, align: "center" },
                { header: "수량", name: "rate", width: 50, align: "center", mask: "numeric-int" },
                { name: "rcode", hidden: true },
                { name: "ymd_fr", hidden: true },
                { name: "ymd_to", hidden: true },
                { name: "chart", hidden: true },
                { name: "part_model", hidden: true },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_prod_nm", hidden: true },
                { name: "wrnt_io", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //--------------------------------------------------
        //gw_com_module.gridCreate : grdData_분류2
        var args = {
            targetid: "grdData_분류2", query: "EHM_5310_S_1", title: "라인별",
            caption: true, width: 216, height: 200, pager: false, show: true,
            element: [
                { header: "Line", name: "category", width: 110, align: "center" },
                { header: "수명", name: "time", width: 50, align: "center" },
                { header: "수량", name: "rate", width: 50, align: "center", mask: "numeric-int" },
                { name: "rcode", hidden: true },
                { name: "ymd_fr", hidden: true },
                { name: "ymd_to", hidden: true },
                { name: "chart", hidden: true },
                { name: "part_model", hidden: true },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_prod_nm", hidden: true },
                { name: "wrnt_io", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //--------------------------------------------------
        //gw_com_module.gridCreate : grdData_분류3
        var args = {
            targetid: "grdData_분류3", query: "EHM_5310_S_2", title: "호기별",
            caption: true, width: 216, height: 298, pager: false, show: true,
            element: [
                { header: "호기", name: "category", width: 110, align: "center" },
                { header: "수명", name: "time", width: 50, align: "center" },
                { header: "수량", name: "rate", width: 50, align: "center", mask: "numeric-int" },
                { name: "rcode", hidden: true },
                { name: "ymd_fr", hidden: true },
                { name: "ymd_to", hidden: true },
                { name: "chart", hidden: true },
                { name: "part_model", hidden: true },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_prod_nm", hidden: true },
                { name: "wrnt_io", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //--------------------------------------------------
        //gw_com_module.gridCreate : grdData_분류4
        var args = {
            targetid: "grdData_분류4", query: "EHM_5310_S_3", title: "현상별",
            caption: true, width: 216, height: 298, pager: false, show: true,
            element: [
                { header: "현상", name: "category", width: 110, align: "center" },
                { header: "수명", name: "time", width: 50, align: "center" },
                { header: "수량", name: "rate", width: 50, align: "center", mask: "numeric-int" },
                { name: "rcode", hidden: true },
                { name: "rmk", hidden: true },
                { name: "ymd_fr", hidden: true },
                { name: "ymd_to", hidden: true },
                { name: "chart", hidden: true },
                { name: "part_model", hidden: true },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_prod_nm", hidden: true },
                { name: "wrnt_io", hidden: true },
                { name: "prod_key", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //--------------------------------------------------
        //gw_com_module.chartCreate : lyrChart_분류1
        var args = {
            targetid: "lyrChart_분류1", query: "EHM_5310_M_1", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);
        //--------------------------------------------------
        //gw_com_module.chartCreate : lyrChart_분류2
        var args = {
            targetid: "lyrChart_분류2", query: "EHM_5310_S_1", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_2 }
        };
        gw_com_module.chartCreate(args);
        //--------------------------------------------------
        //gw_com_module.chartCreate : lyrChart_분류3
        var args = {
            targetid: "lyrChart_분류3", query: "EHM_5310_S_2", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_3 }
        };
        gw_com_module.chartCreate(args);
        //--------------------------------------------------
        //gw_com_module.chartCreate : lyrChart_분류4
        var args = {
            targetid: "lyrChart_분류4", query: "EHM_5310_S_3", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_4 }
        };
        gw_com_module.chartCreate(args);
        //--------------------------------------------------
        //gw_com_module.objResize
        var args = {
            target: [
                { type: "GRID", id: "grdData_분류1", offset: 15, min: true },
                { type: "GRID", id: "grdData_분류2", offset: 15, min: true },
                { type: "GRID", id: "grdData_분류3", offset: 15, min: true},
                { type: "GRID", id: "grdData_분류4", offset: 15, min: true }
            ]
        };
        gw_com_module.objResize(args);
        //--------------------------------------------------
        gw_com_module.informSize();
        //go next
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
        var args = {
            targetid: "frmView",
            event: "itemchanged",
            handler: itemchanged_frmView
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류1", grid: true, event: "rowselected", handler: rowselected_grdData_분류1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류2", grid: true, event: "rowselected", handler: rowselected_grdData_분류2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류3", grid: true, event: "rowselected", handler: rowselected_grdData_분류3 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류1", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_분류1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류1", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_분류1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류2", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_분류2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류2", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_분류2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류3", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_분류3 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류3", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_분류3 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류4", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_분류4 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_분류4", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_분류4 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {
            var args = { target: [{ id: "frmOption", focus: true}] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_닫기(ui) {
            processClose({});
        }
        //----------
        function itemchanged_frmView(ui) {

            switch (ui.element) {
                case "view":
                    {
                        processChart({});
                    }
                    break;
            }

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
        function rowselected_grdData_분류1(ui) {
            processLink({});
        };
        //----------
        function rowselected_grdData_분류2(ui) {
            processLink({ sub: true });
        };
        //----------
        function rowselected_grdData_분류3(ui) {
            processLink({ detail: true });
        };
        //----------

        function rowdblclick_grdData_분류1(ui) {
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: { page: "EHM_5350", title: "발생 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_to", true) },
                        { name: "part_model", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
                        { name: "prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                        { name: "prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                        { name: "prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                        { name: "prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") },
                        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_cd", true) },
                        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_dept", true) },
                        { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_prod_nm", true) },
                        { name: "wrnt_io", value: gw_com_api.getValue("grdData_분류1", "selected", "wrnt_io", true) }
                    ]
                }
            };

            gw_com_module.streamInterface(args);

        }

        //----------
        function rowdblclick_grdData_분류2(ui) {
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: { page: "EHM_5350", title: "발생 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류2", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류2", "selected", "ymd_to", true) },
                        { name: "part_model", value: gw_com_api.getValue("grdData_분류2", "selected", "part_model", true) },
                        { name: "prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                        { name: "prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                        { name: "prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                        { name: "prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") },
                        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류2", "selected", "cust_cd", true) },
                        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) },
                        { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_분류2", "selected", "cust_prod_nm", true) },
                        { name: "wrnt_io", value: gw_com_api.getValue("grdData_분류2", "selected", "wrnt_io", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_분류3(ui) {
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: { page: "EHM_5350", title: "발생 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류3", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류3", "selected", "ymd_to", true) },
                        { name: "part_model", value: gw_com_api.getValue("grdData_분류3", "selected", "part_model", true) },
                        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류3", "selected", "cust_cd", true) },
                        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류3", "selected", "cust_dept", true) },
                        { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_분류3", "selected", "cust_prod_nm", true) },
                        { name: "wrnt_io", value: gw_com_api.getValue("grdData_분류3", "selected", "wrnt_io", true) },
                        { name: "prod_key", value: gw_com_api.getValue("grdData_분류3", "selected", "rcode", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_분류4(ui) {
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: { page: "EHM_5350", title: "발생 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류4", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류4", "selected", "ymd_to", true) },
                        { name: "part_model", value: gw_com_api.getValue("grdData_분류4", "selected", "part_model", true) },
                        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류4", "selected", "cust_cd", true) },
                        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류4", "selected", "cust_dept", true) },
                        { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_분류4", "selected", "cust_prod_nm", true) },
                        { name: "wrnt_io", value: gw_com_api.getValue("grdData_분류4", "selected", "wrnt_io", true) },
                        { name: "prod_key", value: gw_com_api.getValue("grdData_분류4", "selected", "prod_key", true) },
                        { name: "status_tp1", value: gw_com_api.getValue("grdData_분류4", "selected", "rcode", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
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
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption"}] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "chart", argument: "arg_chart" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "part_model", argument: "arg_part_model" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "wrnt_io", argument: "arg_wrnt_io" }
            ],
            argument: [
                { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to"}] },
                { element: [{ name: "part_model"}] },
                { element: [{ name: "prod_group"}] },
                { element: [{ name: "prod_type1"}] },
                { element: [{ name: "prod_type2"}] },
                { element: [{ name: "prod_type3"}] },
                { element: [{ name: "cust_cd"}] },
                { element: [{ name: "cust_dept"}] },
                { element: [{ name: "cust_prod_nm"}] },
                { element: [{ name: "wrnt_io"}] },
                { element: [{ name: "chart"}] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_분류1" },
            { type: "CHART", id: "lyrChart_분류1" }
        ],
        clear: [
            { type: "GRID", id: "grdData_분류2" },
            { type: "CHART", id: "lyrChart_분류2" },
            { type: "GRID", id: "grdData_분류3" },
            { type: "CHART", id: "lyrChart_분류3" },
            { type: "GRID", id: "grdData_분류4" },
            { type: "CHART", id: "lyrChart_분류4" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    if (param.detail) {
        var args = {
            source: { type: "GRID", id: "grdData_분류3", row: "selected", block: true,
                element: [
                    { name: "chart", argument: "arg_chart" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "part_model", argument: "arg_part_model" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                    { name: "wrnt_io", argument: "arg_wrnt_io" },
                    { name: "rcode", argument: "arg_prod_key" }
                ],
                argument: [
                    { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_분류4" },
                { type: "CHART", id: "lyrChart_분류4" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.sub) {
        var args = {
            source: {
                type: "GRID", id: "grdData_분류2", row: "selected", block: true,
                element: [
                    { name: "chart", argument: "arg_chart" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "part_model", argument: "arg_part_model" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "rcode", argument: "arg_cust_dept" },
                    { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                    { name: "wrnt_io", argument: "arg_wrnt_io" }
                ],
                argument: [
                    { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") },
                    { name: "arg_prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                    { name: "arg_prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                    { name: "arg_prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                    { name: "arg_prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_분류3" }, { type: "CHART", id: "lyrChart_분류3" }
            ],
            clear: [
                { type: "GRID", id: "grdData_분류4" }, { type: "CHART", id: "lyrChart_분류4" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else {
        var args = {
            source: { type: "GRID", id: "grdData_분류1", row: "selected", block: true,
                element: [
                    { name: "chart", argument: "arg_chart" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "rcode", argument: "arg_part_model" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                    { name: "wrnt_io", argument: "arg_wrnt_io" }
                ],
                argument: [
                    { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") },
                    { name: "arg_prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                    { name: "arg_prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                    { name: "arg_prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                    { name: "arg_prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_분류2" },
                { type: "CHART", id: "lyrChart_분류2" }
            ],
            clear: [
                { type: "GRID", id: "grdData_분류3" },
                { type: "CHART", id: "lyrChart_분류3" },
                { type: "GRID", id: "grdData_분류4" },
                { type: "CHART", id: "lyrChart_분류4" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }

}
//----------
function processChart(param) {

    if (gw_com_api.getRowCount("grdData_분류1") > 0) {
        var args = {
            source: { type: "GRID", id: "grdData_분류1", row: 1,
                element: [
                    { name: "chart", argument: "arg_chart" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "part_model", argument: "arg_part_model" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                    { name: "wrnt_io", argument: "arg_wrnt_io" }
                ],
                argument: [
                    { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") },
                    { name: "arg_prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                    { name: "arg_prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                    { name: "arg_prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                    { name: "arg_prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_분류1" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    if (gw_com_api.getSelectedRow("grdData_분류1") != null) {
        var args = {
            source: { type: "GRID", id: "grdData_분류1", row: "selected",
                element: [
                    { name: "chart", argument: "arg_chart" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "rcode", argument: "arg_part_model" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                    { name: "wrnt_io", argument: "arg_wrnt_io" }
                ],
                argument: [
                    { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") },
                    { name: "arg_prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                    { name: "arg_prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                    { name: "arg_prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                    { name: "arg_prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_분류2" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    if (gw_com_api.getSelectedRow("grdData_분류2") != null) {
        var args = {
            source: {
                type: "GRID", id: "grdData_분류2", row: "selected",
                element: [
                    { name: "chart", argument: "arg_chart" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "part_model", argument: "arg_part_model" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "rcode", argument: "arg_cust_dept" },
                    { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                    { name: "wrnt_io", argument: "arg_wrnt_io" }
                ],
                argument: [
                    { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") },
                    { name: "arg_prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") },
                    { name: "arg_prod_type1", value: gw_com_api.getValue("frmOption", 1, "prod_type1") },
                    { name: "arg_prod_type2", value: gw_com_api.getValue("frmOption", 1, "prod_type2") },
                    { name: "arg_prod_type3", value: gw_com_api.getValue("frmOption", 1, "prod_type3") }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_분류3" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    if (gw_com_api.getSelectedRow("grdData_분류3") != null) {
        var args = {
            source: { type: "GRID", id: "grdData_분류3", row: "selected",
                element: [
                    { name: "chart", argument: "arg_chart" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "part_model", argument: "arg_part_model" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                    { name: "wrnt_io", argument: "arg_wrnt_io" },
                    { name: "rcode", argument: "arg_prod_key" }
                ],
                argument: [
                    { name: "arg_view", value: gw_com_api.getValue("frmView", 1, "view") }
                ]
            },
            target: [
                { type: "CHART", id: "lyrChart_분류4" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processClientObjectSelected(s, e) {

    var gCode, gName, gRmk = "";
    var i = 0;
    var IsOk = false;
    
    if (e.additionalHitObject != null)
    {
    	// e.hitObject.name == "측정치"
    	// e.additionalHitObject.values
    	//var ChartType = gw_com_api.getValue("frmOption", 1, "chart_view");
    	var HitCode = e.additionalHitObject.argument;	// Category
    	var HitValue = e.additionalHitObject.values;

    		var nRows = gw_com_api.getRowCount("grdData_분류4");
    		for (i = 1; i < nRows + 1; i++){
    			gCode = gw_com_api.getValue("grdData_분류4", i, "category", true);
    			if ( gCode == HitCode){
	    			gRmk = gw_com_api.getValue("grdData_분류4", i, "rmk", true);
	    			gCode = gw_com_api.getValue("grdData_분류4", i, "rcode", true);
	    			IsOk = true;
    				break;
    			}
    		}
        
    	if (IsOk) {
	        gw_com_api.messageBox(
	        	[ { align: "left", text: "[Categody] : " + HitCode } 
	        	 ,{ align: "left", text: "[Value ] : " + HitValue } 
	        	 ,{ align: "left", text: "[Remark] : " + gRmk } 
	        	]
	            , 500, gw_com_api.v_Message.msg_alert, "ALERT", { itemchange: true });
		}	            
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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//