
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = { request: [
				{ type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH}] },
				{ type: "INLINE", name: "기준",
				    data: [
						{ title: "적용영역", value: "ECR-STATUS-REGION" },
						{ title: "적용모듈", value: "ECR-STATUS-MODULE" },
						{ title: "MP분류", value: "ECR-STATUS-MP" }
					]
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
            v_global.logic.eccb_tp = gw_com_api.getPageParameter("ECCB_TP");
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
            editable: { focus: "ymd_fr", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    { element: [
			            {
			                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "제안일자 :" }, mask: "date-ymd",
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
			            {
			                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                editable: { type: "text", size: 7, maxlength: 10 }
			            },
                        {
                            name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select", size: 7, maxlength: 20 , data: { memory: "DEPT_AREA_FIND" } }
                        },
			            { name: "chart", value: "ECR-STATUS-REGION", hidden: true }
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
            targetid: "grdData_분류1", query: "ECCB_5020_M_1", title: "적용 영역별",
            caption: true, width: 325, height: 299, pager: true, show: true,
            group: [ { element: "grouptext", show: false, summary: false } ],
            element: [
				{ header: "분류", name: "category", width: 175, align: "center" },
				{ header: "건수", name: "value", width: 60, align: "center", mask: "currency-int" },
				{ header: "비율(%)", name: "rate", width: 60, align: "center", mask: "currency-int" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart", hidden: true },
				{ name: "dept_area", hidden: true },
				{ name: "grouptext", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_분류2", query: "ECCB_5020_S_1", title: "적용 모듈별",
            caption: true, width: 325, height: 299, pager: true, show: true,
            group: [ { element: "grouptext", show: false, summary: false } ],
            element: [
				{ header: "상세분류", name: "category", width: 175, align: "center" },
				{ header: "건수", name: "value", width: 60, align: "center", mask: "currency-int" },
				{ header: "비율(%)", name: "rate", width: 60, align: "center", mask: "currency-int" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart", hidden: true },
				{ name: "grouptext", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { 
            targetid: "grdData_분류3", query: "ECCB_5020_S_2", title: "MP 분류별",
            caption: true, width: 325, height: 299, pager: true, show: true,
            group: [ { element: "grouptext", show: false, summary: false } ],
            element: [
				{ header: "상세분류", name: "category", width: 175, align: "center" },
				{ header: "건수", name: "value", width: 60, align: "center", mask: "currency-int" },
				{ header: "비율(%)", name: "rate", width: 60, align: "center", mask: "currency-int" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart", hidden: true },
				{ name: "grouptext", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_분류4", query: "ECCB_5020_S_3", title: "적용 모델별",
            caption: true, width: 325, height: 299, pager: true, show: true,
            group: [ { element: "grouptext", show: false, summary: false } ],
            element: [
				{ header: "상세분류", name: "category", width: 175, align: "center" },
				{ header: "건수", name: "value", width: 60, align: "center", mask: "currency-int" },
				{ header: "비율(%)", name: "rate", width: 60, align: "center", mask: "currency-int" },
				{ name: "rcode", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "chart", hidden: true },
				{ name: "grouptext", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_분류1", query: "ECCB_5020_M_1", show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_1 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_분류2", query: "ECCB_5020_S_1", show: true,
            format: { view: "1", rotate: "1", reverse: "0" },
            control: { by: "DX", id: ctlChart_2 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_분류3", query: "ECCB_5020_S_2", show: true,
            format: { view: "1", rotate: "1", reverse: "0" },
            control: { by: "DX", id: ctlChart_3 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrChart_분류4", query: "ECCB_5020_S_3",
            show: true,
            format: { view: "1", rotate: "0", reverse: "0" },
            control: { by: "DX", id: ctlChart_4 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = { target: [
				{ type: "GRID", id: "grdData_분류1", offset: 15, min: true },
				{ type: "GRID", id: "grdData_분류2", offset: 15, min: true },
				{ type: "GRID", id: "grdData_분류3", offset: 15, min: true },
				{ type: "GRID", id: "grdData_분류4", offset: 15, min: true }
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
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류1",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_분류1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류2",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_분류2
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류3",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_분류3
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류1",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_분류1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류1",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_분류1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류2",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_분류2
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류2",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_분류2
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류3",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_분류3
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류3",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_분류3
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류4",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_분류4
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_분류4",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_분류4
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [ { id: "frmOption", focus: true } ]
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
                ID: gw_com_api.v_Stream.msg_linkPage, to: { type: "MAIN" },
                data: {
                    page: "ECCB_2030", title: "ECR 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_to", true) },
                        { name: "dept_area", value: gw_com_api.getValue("grdData_분류1", "selected", "dept_area", true) },
                        { name: "act_region", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_분류2(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "ECCB_2030",
                    title: "ECR 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_to", true) },
                        { name: "dept_area", value: gw_com_api.getValue("grdData_분류1", "selected", "dept_area", true) },
                        { name: "act_region", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
                        { name: "act_module", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_분류3(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "ECCB_2030",
                    title: "ECR 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_to", true) },
                        { name: "dept_area", value: gw_com_api.getValue("grdData_분류1", "selected", "dept_area", true) },
                        { name: "act_region", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
                        { name: "act_module", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) },
                        { name: "mp_class", value: gw_com_api.getValue("grdData_분류3", "selected", "rcode", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_분류4(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "ECCB_2030",
                    title: "ECR 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_to", true) },
                        { name: "dept_area", value: gw_com_api.getValue("grdData_분류1", "selected", "dept_area", true) },
                        { name: "act_region", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
                        { name: "act_module", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) },
                        { name: "mp_class", value: gw_com_api.getValue("grdData_분류3", "selected", "rcode", true) },
                        { name: "prod_type", value: gw_com_api.getValue("grdData_분류4", "selected", "rcode", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        /*
        //----------
        function rowdblclick_grdData_분류2(ui) {

        var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
        type: "MAIN"
        },
        data: {
        page: "w_ehm2030",
        title: "A/S  현황",
        param: [
        { name: "prod_type", value: gw_com_api.getValue("grdData_분류1", "selected", "prod_type", true) },
        { name: "ymd_fr", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_fr", true) },
        { name: "ymd_to", value: gw_com_api.getValue("grdData_분류1", "selected", "ymd_to", true) }
        ]
        }
        };
        var chart = gw_com_api.getValue("grdData_분류1", "selected", "chart", true);
        switch (chart) {
        case "AS-STATUS":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_dept", true) },
        { name: "status_tp1", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
        { name: "status_nm1", value: gw_com_api.getValue("grdData_분류1", "selected", "category", true) },
        { name: "status_tp2", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) },
        { name: "status_nm2", value: gw_com_api.getValue("grdData_분류2", "selected", "category", true) }
        );
        }
        break;
        case "AS-PART":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_dept", true) },
        { name: "part_tp1", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
        { name: "part_nm1", value: gw_com_api.getValue("grdData_분류1", "selected", "category", true) },
        { name: "part_tp2", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) },
        { name: "part_nm2", value: gw_com_api.getValue("grdData_분류2", "selected", "category", true) }
        );
        }
        break;
        case "AS-REASON":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류1", "selected", "cust_dept", true) },
        { name: "reason_tp1", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
        { name: "reason_nm1", value: gw_com_api.getValue("grdData_분류1", "selected", "category", true) },
        { name: "reason_tp2", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) },
        { name: "reason_nm2", value: gw_com_api.getValue("grdData_분류2", "selected", "category", true) }
        );
        }
        break;
        case "AS-CUST":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) }
        );
        }
        break;
        }
        gw_com_module.streamInterface(args);

        }
        */

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA );
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

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "dept_area", argument: "arg_dept_area" },
				{ name: "chart", argument: "arg_chart" }
            ],
            argument: [
                { name: "arg_eccb_tp", value: v_global.logic.eccb_tp }
            ],
            remark: [
	            { infix: "~", element: [ { name: "ymd_fr" }, { name: "ymd_to" } ] },
	            { element: [{ name: "dept_area"}] }

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
				    { name: "rcode", argument: "arg_tp3" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
				    { name: "ymd_to", argument: "arg_ymd_to" }
			    ],
                argument: [
                    { name: "arg_tp1", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
                    { name: "arg_dept_area", value: gw_com_api.getValue("grdData_분류1", "selected", "dept_area", true) },
                    { name: "arg_tp2", value: gw_com_api.getValue("grdData_분류2", "selected", "rcode", true) },
                    { name: "arg_eccb_tp", value: v_global.logic.eccb_tp }
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
				    { name: "rcode", argument: "arg_tp2" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
				    { name: "ymd_to", argument: "arg_ymd_to" }
			    ],
                argument: [
                    { name: "arg_tp1", value: gw_com_api.getValue("grdData_분류1", "selected", "rcode", true) },
                    { name: "arg_dept_area", value: gw_com_api.getValue("grdData_분류1", "selected", "dept_area", true) },
                    { name: "arg_eccb_tp", value: v_global.logic.eccb_tp }
			    ]
            },
            target: [
                { type: "GRID", id: "grdData_분류3" },
			    { type: "CHART", id: "lyrChart_분류3" }
		    ],
            clear: [
                { type: "GRID", id: "grdData_분류4" },
			    { type: "CHART", id: "lyrChart_분류4" }
		    ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else {
        var args = {
            source: {
                type: "GRID", id: "grdData_분류1", row: "selected", block: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "chart", argument: "arg_chart" },
				    { name: "rcode", argument: "arg_tp1" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
				    { name: "ymd_to", argument: "arg_ymd_to" }
			    ],
                argument: [
                    { name:"arg_eccb_tp", value: v_global.logic.eccb_tp }
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