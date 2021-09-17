
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: true,
            border: true,
            editable: {
                focus: "ymd_fr",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "ymd_fr",
				                label: {
				                    title: "제안일자 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            },
				            {
				                name: "ymd_to",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            }
				        ]
                    },
				    {
				        align: "right",
				        element: [
				            {
				                name: "실행",
				                value: "실행",
				                act: true,
				                format: {
				                    type: "button"
				                }
				            },
				            {
				                name: "취소",
				                value: "취소",
				                format: {
				                    type: "button",
				                    icon: "닫기"
				                }
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
            targetid: "grdData_현황",
            query: "w_eccb6010_M_1",
            title: "상태별 현황",
            caption: true,
            width: 325,
            height: 180,
            pager: false,
            show: true,
            element: [
				{
				    header: "상태구분",
				    name: "category",
				    width: 175,
				    align: "center"
				},
				{
				    header: "건수",
				    name: "value",
				    width: 60,
				    align: "center"
				},
				{
				    header: "비율(%)",
				    name: "rate",
				    width: 60,
				    align: "center"
				},
				{
				    name: "rcode",
				    hidden: true
				},
				{
				    name: "ymd_fr",
				    hidden: true
				},
				{
				    name: "ymd_to",
				    hidden: true
				},
				{
				    name: "chart",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_집계",
            query: "w_eccb6010_M_2",
            title: "우선 순위별 진행 현황",
            caption: true,
            height: 205,
            pager: false,
            show: true,
            element: [
				{
				    header: "우선순위",
				    name: "priority_nm",
				    width: 420,
				    align: "left"
				},
				{
				    header: "건수",
				    name: "total_cnt",
				    width: 40,
				    align: "center"
				},
				{
				    header: "진행완료",
				    name: "complete_cnt",
				    width: 60,
				    align: "center"
				},
				{
				    header: "진행(CIP)",
				    name: "cip_cnt",
				    width: 60,
				    align: "center"
				},
				{
				    header: "진행(ECO)",
				    name: "eco_cnt",
				    width: 60,
				    align: "center"
				},
				{
				    header: "미진행",
				    name: "wait_cnt",
				    width: 60,
				    align: "center"
				}/*,
				{
				    header: "심의보류",
				    name: "hold_cnt",
				    width: 60,
				    align: "center"
				}*/,
				{
				    header: "완료율(%)",
				    name: "complete_rate",
				    width: 70,
				    align: "center"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_통계",
            query: "w_eccb6010_S_1",
            show: true,
            control: {
                by: "DX",
                id: ctlChart_1
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_집계",
				    offset: 15
				}
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
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);
        /*
        //----------
        var args = {
        targetid: "grdData_현황",
        grid: true,
        event: "rowdblclick",
        handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
        targetid: "grdData_현황",
        grid: true,
        event: "rowkeyenter",
        handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
        targetid: "grdData_집계",
        grid: true,
        event: "rowdblclick",
        handler: rowdblclick_grdData_집계
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
        targetid: "grdData_집계",
        grid: true,
        event: "rowkeyenter",
        handler: rowdblclick_grdData_집계
        };
        gw_com_module.eventBind(args);
        */

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
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
        function rowselected_grdData_현황(ui) {

            processLink({});

        };
        /*
        //----------
        function rowdblclick_grdData_현황(ui) {

        var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
        type: "MAIN"
        },
        data: {
        page: "w_ehm2030",
        title: "A/S  현황",
        param: [
        { name: "prod_type", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type", true) },
        { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) }
        ]
        }
        };
        var chart = gw_com_api.getValue("grdData_현황", "selected", "chart", true);
        switch (chart) {
        case "AS-STATUS":
        {
        args.data.param.push(
        { name: "status_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
        { name: "status_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
        );
        }
        break;
        case "AS-PART":
        {
        args.data.param.push(
        { name: "part_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
        { name: "part_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
        );
        }
        break;
        case "AS-REASON":
        {
        args.data.param.push(
        { name: "reason_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
        { name: "reason_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
        );
        }
        break;
        }
        gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_집계(ui) {

        var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
        type: "MAIN"
        },
        data: {
        page: "w_ehm2030",
        title: "A/S  현황",
        param: [
        { name: "prod_type", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type", true) },
        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) }
        ]
        }
        };
        var chart = gw_com_api.getValue("grdData_현황", "selected", "chart", true);
        switch (chart) {
        case "AS-STATUS":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
        { name: "status_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
        { name: "status_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
        { name: "status_tp2", value: gw_com_api.getValue("grdData_집계", "selected", "rcode", true) },
        { name: "status_nm2", value: gw_com_api.getValue("grdData_집계", "selected", "category", true) }
        );
        }
        break;
        case "AS-PART":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
        { name: "part_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
        { name: "part_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
        { name: "part_tp2", value: gw_com_api.getValue("grdData_집계", "selected", "rcode", true) },
        { name: "part_nm2", value: gw_com_api.getValue("grdData_집계", "selected", "category", true) }
        );
        }
        break;
        case "AS-REASON":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
        { name: "reason_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
        { name: "reason_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
        { name: "reason_tp2", value: gw_com_api.getValue("grdData_집계", "selected", "rcode", true) },
        { name: "reason_nm2", value: gw_com_api.getValue("grdData_집계", "selected", "category", true) }
        );
        }
        break;
        case "AS-CUST":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_집계", "selected", "rcode", true) }
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
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
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				}
			],
            remark: [
	            {
	                infix: "~",
	                element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
	            }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황"
			},
            {
                type: "GRID",
                id: "grdData_집계"
            },
			{
			    type: "CHART",
			    id: "lyrChart_통계"
			}
		],
        key: param.key
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