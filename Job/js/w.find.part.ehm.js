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
        var args = {
            request: [
				{
				    type: "PAGE", name: "장비군", query: "dddw_deptarea",
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
            targetid: "lyrMenu",
            type: "FREE",
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
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "part_cd", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: {
                                    type: "select", validate: { rule: "required" },
                                    data: { memory: "장비군" }
                                }
                            },
				            {
				                name: "part_cd", label: { title: "부품코드 :" },
				                editable: { type: "text", size: 10, maxlength: 20 }
				            },
				            {
				                name: "part_nm", label: { title: "부품명 :" },
				                editable: { type: "text", size: 12, maxlength: 20 }
				            },
				            {
				                name: "part_spec", label: { title: "규격 :" },
				                editable: { type: "text", size: 12, maxlength: 20 }
				            },
                            { name: "prod_key", hidden: true },
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
            targetid: "grdData_부품", query: "w_find_part_ehm_M_1", title: "부품",
            height: 190, dynamic: true, show: true, key: true,
            element: [
				{ header: "부품코드", name: "part_cd", width: 100, align: "center" },
				{ header: "부품명", name: "part_nm", width: 250, align: "left" },
				{ header: "규격", name: "part_spec", width: 250, align: "left" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_BOM", query: "w_find_part_ehm_M_2", title: "BOM",
            height: 190, dynamic: true, show: true, key: true,
            element: [
				{ header: "부품코드", name: "part_cd", width: 100, align: "center" },
				{ header: "부품명", name: "part_nm", width: 250, align: "left" },
				{ header: "규격", name: "part_spec", width: 250, align: "left" },
				{ header: "수량", name: "part_qty", width: 50, align: "center" },
				{ header: "단위", name: "part_unit", width: 50, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_재고", query: "w_find_part_ehm_S_1", title: "재고 현황",
            caption: true, height: 68, pager: false, dynamic: true, show: true, key: true,
            element: [
				{ header: "공장", name: "plant_nm", width: 60, align: "center" },
				{ header: "창고", name: "loc_nm", width: 140, align: "left" },
				{ header: "Project", name: "proj_no", width: 80, align: "center" },
				{ header: "프로젝트명", name: "proj_nm", width: 200, align: "left" },
				{ header: "재고량", name: "stock_qty", width: 60, align: "center", mask: "numeric-int" },
				{ header: "기준일자", name: "stock_dt", width: 80, align: "center", mask: "date-ymd" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
				{ type: "GRID", id: "grdData_부품", title: "부품 목록" },
                { type: "GRID", id: "grdData_BOM", title: "BOM 목록" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_부품", offset: 8 },
                { type: "GRID", id: "grdData_BOM", offset: 8 },
                { type: "GRID", id: "grdData_재고", offset: 8 },
                { type: "TAB", id: "lyrTab", offset: 8 }
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
        var args = { targetid: "lyrTab", event: "tabselect", handler: click_lyrTab_tabselect };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_부품", grid: true, event: "rowselected", handler: rowselected_grdData_부품 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_부품", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_부품 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_부품", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_부품 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BOM", grid: true, event: "rowselected", handler: rowselected_grdData_부품 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BOM", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_부품 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_BOM", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_부품 };
        gw_com_module.eventBind(args);
        //----------

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
        function click_lyrTab_tabselect(ui) {

            v_global.process.current.tab = ui.row;

        }
        //----------
        function rowdblclick_grdData_부품(ui) {

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = null;
            informResult({});

        }
        //----------
        function rowselected_grdData_부품(ui) {

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = null;
            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        v_global.process.current.tab = 1;
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

    var args = {};
    if (v_global.process.current.tab == 2) {
        gw_com_api.setError(false, "frmOption", 1, "part_cd", false, true);
        gw_com_api.setError(false, "frmOption", 1, "part_nm", false, true);
        gw_com_api.setError(false, "frmOption", 1, "part_spec", false, true);

        args = {
            source: {
                type: "FORM",
                id: "frmOption",
                //hide: true,
                element: [
				    {
				        name: "dept_area",
				        argument: "arg_dept_area"
				    },
				    {
				        name: "part_cd",
				        argument: "arg_part_cd"
				    },
				    {
				        name: "part_nm",
				        argument: "arg_part_nm"
				    },
				    {
				        name: "prod_key",
				        argument: "arg_prod_key"
				    }
			    ]/*,
                remark: [
		            {
		                element: [{ name: "part_cd"}]
		            },
		            {
		                element: [{ name: "part_nm"}]
		            },
		            {
		                element: [{ name: "prod_key"}]
		            }
		        ]*/
            },
            target: [
			    {
                    type: "GRID",
                    id: "grdData_BOM",
                    select: true
                }
		    ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_재고"
                }
            ],
            key: param.key
        };
    }
    else {
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
        if (gw_com_api.getValue("frmOption", 1, "part_cd") == ""
                && gw_com_api.getValue("frmOption", 1, "part_nm") == ""
                && gw_com_api.getValue("frmOption", 1, "part_spec") == "") {
            gw_com_api.messageBox([
                    { text: "조회 조건 중 한 가지는 반드시 입력하셔야 합니다." }
                ]);
            gw_com_api.setError(true, "frmOption", 1, "part_cd", false, true);
            gw_com_api.setError(true, "frmOption", 1, "part_nm", false, true);
            gw_com_api.setError(true, "frmOption", 1, "part_spec", false, true);
            return false;
        }
        gw_com_api.setError(false, "frmOption", 1, "part_cd", false, true);
        gw_com_api.setError(false, "frmOption", 1, "part_nm", false, true);
        gw_com_api.setError(false, "frmOption", 1, "part_spec", false, true);

        args = {
            source: {
                type: "FORM",
                id: "frmOption",
                //hide: true,
                element: [
				    {
				        name: "dept_area",
				        argument: "arg_dept_area"
				    },
				    {
				        name: "part_cd",
				        argument: "arg_part_cd"
				    },
				    {
				        name: "part_nm",
				        argument: "arg_part_nm"
				    },
				    {
				        name: "part_spec",
				        argument: "arg_part_spec"
				    }
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
			    {
			        type: "GRID",
			        id: "grdData_부품",
			        select: true
			    }
		    ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_재고"
                }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

};
//----------
function processLink(param) {

    var args = {
        source: {
            type: v_global.event.type,
            id: v_global.event.object,
            row: "selected",
            block: true,
            element: [
				{
				    name: "part_cd",
				    argument: "arg_part_cd"
				}
			]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_재고"
			}
		],
        key: param.key
    };
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
        ID: gw_com_api.v_Stream.msg_selectedPart_EHM,
        data: {
            part_cd: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        "part_cd",
                        (v_global.event.type == "GRID") ? true : false),
            part_nm: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        "part_nm",
                        (v_global.event.type == "GRID") ? true : false),
            part_spec: gw_com_api.getValue(
                        v_global.event.object,
                        v_global.event.row,
                        "part_spec",
                        (v_global.event.type == "GRID") ? true : false)
        }
    };
    gw_com_module.streamInterface(args);

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
        case gw_com_api.v_Stream.msg_selectPart_EHM:
            {
                //gw_com_module.gridClear({ targetid: "grdData_BOM" });
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.part_cd != undefined
                        && param.data.part_cd != gw_com_api.getValue("frmOption", 1, "part_cd")) {
                        gw_com_api.setValue("frmOption", 1, "part_cd", param.data.part_cd);
                        retrieve = true;
                    }
                    if (param.data.part_nm != undefined
                        && param.data.part_nm != gw_com_api.getValue("frmOption", 1, "part_nm")) {
                        gw_com_api.setValue("frmOption", 1, "part_nm", param.data.part_nm);
                        retrieve = true;
                    }
                    if (param.data.part_spec != undefined
                        && param.data.part_spec != gw_com_api.getValue("frmOption", 1, "part_spec")) {
                        gw_com_api.setValue("frmOption", 1, "part_spec", param.data.part_spec);
                        retrieve = true;
                    }
                    if (param.data.prod_key != undefined
                        && param.data.prod_key != gw_com_api.getValue("frmOption", 1, "prod_key")) {
                        gw_com_api.setValue("frmOption", 1, "prod_key", param.data.prod_key);
                        gw_com_api.titleTab("lyrTab", 2,
                            "BOM 목록" + ((param.data.prod_nm != "") ? " - " + param.data.prod_nm : ""));
                        retrieve = true;
                    }
                    if (param.data.tab != undefined)
                        gw_com_api.selectTab("lyrTab", param.data.tab);
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "part_cd");
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