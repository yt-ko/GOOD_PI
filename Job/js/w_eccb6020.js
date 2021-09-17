
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
        var args = {
            request: [
				{
				    type: "INLINE", name: "기준",
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
				            }/*,
				            {
				                name: "chart",
				                label: {
				                    title: "구분 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "기준"
				                    }
				                }
				            }*/,
				            {
				                name: "chart",
                                value: "ECR-STATUS-REGION",
                                hidden: true
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
            targetid: "grdData_대분류",
            query: "w_eccb6020_M_1",
            title: "대분류별 현황",
            caption: true,
            width: 325,
            height: 299,
            pager: false,
            show: true,
            element: [
				{
				    header: "분류",
				    name: "category",
				    width: 175,
				    align: "left"
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
				    align: "center",
				    mask: "numeric-int"
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
            targetid: "grdData_중분류",
            query: "w_eccb6020_S_2",
            title: "중분류별 현황",
            caption: true,
            width: 325,
            height: 299,
            pager: false,
            show: true,
            element: [
				{
				    header: "상세분류",
				    name: "category",
				    width: 175,
				    align: "left"
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
				    align: "center",
				    mask: "numeric-int"
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
            targetid: "grdData_소분류",
            query: "w_eccb6020_D_1",
            title: "소분류별 현황",
            caption: true,
            width: 325,
            height: 299,
            pager: false,
            show: true,
            element: [
				{
				    header: "상세분류",
				    name: "category",
				    width: 175,
				    align: "left"
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
				    align: "center",
				    mask: "numeric-int"
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
            targetid: "lyrChart_대분류",
            query: "w_eccb6020_M_1",
            show: true,
            format: {
                view: "1", rotate: "0", reverse: "0"
            },
            control: {
                by: "DX",
                id: ctlChart_1
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_중분류",
            query: "w_eccb6020_S_2",
            show: true,
            format: {
                view: "1", rotate: "1", reverse: "0"
            },
            control: {
                by: "DX",
                id: ctlChart_2
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_소분류",
            query: "w_eccb6020_D_1",
            show: true,
            format: {
                view: "1", rotate: "1", reverse: "0"
            },
            control: {
                by: "DX",
                id: ctlChart_3
            }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_대분류",
				    offset: 15,
				    min: true
				},
				{
				    type: "GRID",
				    id: "grdData_중분류",
				    offset: 15,
				    min: true
				},
				{
				    type: "GRID",
				    id: "grdData_소분류",
				    offset: 15,
				    min: true
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
            targetid: "grdData_대분류",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_대분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_중분류",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_중분류
        };
        gw_com_module.eventBind(args);
        /*
        //----------
        var args = {
        targetid: "grdData_대분류",
        grid: true,
        event: "rowdblclick",
        handler: rowdblclick_grdData_대분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
        targetid: "grdData_대분류",
        grid: true,
        event: "rowkeyenter",
        handler: rowdblclick_grdData_대분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
        targetid: "grdData_중분류",
        grid: true,
        event: "rowdblclick",
        handler: rowdblclick_grdData_중분류
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
        targetid: "grdData_중분류",
        grid: true,
        event: "rowkeyenter",
        handler: rowdblclick_grdData_중분류
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
        function rowselected_grdData_대분류(ui) {

            processLink({});

        };
        //----------
        function rowselected_grdData_중분류(ui) {

            processLink({ sub: true });

        };
        /*
        //----------
        function rowdblclick_grdData_대분류(ui) {

        var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
        type: "MAIN"
        },
        data: {
        page: "w_ehm2030",
        title: "A/S  현황",
        param: [
        { name: "prod_type", value: gw_com_api.getValue("grdData_대분류", "selected", "prod_type", true) },
        { name: "cust_cd", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_dept", true) },
        { name: "ymd_fr", value: gw_com_api.getValue("grdData_대분류", "selected", "ymd_fr", true) },
        { name: "ymd_to", value: gw_com_api.getValue("grdData_대분류", "selected", "ymd_to", true) }
        ]
        }
        };
        var chart = gw_com_api.getValue("grdData_대분류", "selected", "chart", true);
        switch (chart) {
        case "AS-STATUS":
        {
        args.data.param.push(
        { name: "status_tp1", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true) },
        { name: "status_nm1", value: gw_com_api.getValue("grdData_대분류", "selected", "category", true) }
        );
        }
        break;
        case "AS-PART":
        {
        args.data.param.push(
        { name: "part_tp1", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true) },
        { name: "part_nm1", value: gw_com_api.getValue("grdData_대분류", "selected", "category", true) }
        );
        }
        break;
        case "AS-REASON":
        {
        args.data.param.push(
        { name: "reason_tp1", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true) },
        { name: "reason_nm1", value: gw_com_api.getValue("grdData_대분류", "selected", "category", true) }
        );
        }
        break;
        }
        gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_중분류(ui) {

        var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
        type: "MAIN"
        },
        data: {
        page: "w_ehm2030",
        title: "A/S  현황",
        param: [
        { name: "prod_type", value: gw_com_api.getValue("grdData_대분류", "selected", "prod_type", true) },
        { name: "ymd_fr", value: gw_com_api.getValue("grdData_대분류", "selected", "ymd_fr", true) },
        { name: "ymd_to", value: gw_com_api.getValue("grdData_대분류", "selected", "ymd_to", true) }
        ]
        }
        };
        var chart = gw_com_api.getValue("grdData_대분류", "selected", "chart", true);
        switch (chart) {
        case "AS-STATUS":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_dept", true) },
        { name: "status_tp1", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true) },
        { name: "status_nm1", value: gw_com_api.getValue("grdData_대분류", "selected", "category", true) },
        { name: "status_tp2", value: gw_com_api.getValue("grdData_중분류", "selected", "rcode", true) },
        { name: "status_nm2", value: gw_com_api.getValue("grdData_중분류", "selected", "category", true) }
        );
        }
        break;
        case "AS-PART":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_dept", true) },
        { name: "part_tp1", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true) },
        { name: "part_nm1", value: gw_com_api.getValue("grdData_대분류", "selected", "category", true) },
        { name: "part_tp2", value: gw_com_api.getValue("grdData_중분류", "selected", "rcode", true) },
        { name: "part_nm2", value: gw_com_api.getValue("grdData_중분류", "selected", "category", true) }
        );
        }
        break;
        case "AS-REASON":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_cd", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_대분류", "selected", "cust_dept", true) },
        { name: "reason_tp1", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true) },
        { name: "reason_nm1", value: gw_com_api.getValue("grdData_대분류", "selected", "category", true) },
        { name: "reason_tp2", value: gw_com_api.getValue("grdData_중분류", "selected", "rcode", true) },
        { name: "reason_nm2", value: gw_com_api.getValue("grdData_중분류", "selected", "category", true) }
        );
        }
        break;
        case "AS-CUST":
        {
        args.data.param.push(
        { name: "cust_cd", value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true) },
        { name: "cust_dept", value: gw_com_api.getValue("grdData_중분류", "selected", "rcode", true) }
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
				    name: "chart",
				    argument: "arg_chart"
				},
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
	            },
		        {
		            element: [{ name: "chart"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_대분류"
			},
			{
			    type: "CHART",
			    id: "lyrChart_대분류"
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_중분류"
			},
			{
			    type: "CHART",
			    id: "lyrChart_중분류"
			},
            {
                type: "GRID",
                id: "grdData_소분류"
            },
			{
			    type: "CHART",
			    id: "lyrChart_소분류"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    if (param.sub) {
        var args = {
            source: {
                type: "GRID",
                id: "grdData_중분류",
                row: "selected",
                block: true,
                element: [
                    {
                        name: "chart",
                        argument: "arg_chart"
                    },
				    {
				        name: "rcode",
				        argument: "arg_tp2"
				    },
                    {
                        name: "ymd_fr",
                        argument: "arg_ymd_fr"
                    },
				    {
				        name: "ymd_to",
				        argument: "arg_ymd_to"
				    }
			    ],
				argument: [
                    {
                        name: "arg_tp1",
                        value: gw_com_api.getValue("grdData_대분류", "selected", "rcode", true)
                    }
			    ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_소분류"
                },
			    {
			        type: "CHART",
			        id: "lyrChart_소분류"
			    }
		    ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }
    else {
        var args = {
            source: {
                type: "GRID",
                id: "grdData_대분류",
                row: "selected",
                block: true,
                element: [
                    {
                        name: "chart",
                        argument: "arg_chart"
                    },
				    {
				        name: "rcode",
				        argument: "arg_tp1"
				    },
                    {
                        name: "ymd_fr",
                        argument: "arg_ymd_fr"
                    },
				    {
				        name: "ymd_to",
				        argument: "arg_ymd_to"
				    }
			    ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_중분류"
                },
			    {
			        type: "CHART",
			        id: "lyrChart_중분류"
			    }
		    ],
			clear: [
                {
                    type: "GRID",
                    id: "grdData_소분류"
                },
			    {
			        type: "CHART",
			        id: "lyrChart_소분류"
			    }
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