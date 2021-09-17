
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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

        var args = {
            request: [
                { type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "IEHM11" } ] 
                },
				{ type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "IEHM06" } ]
				},
				{ type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [ { argument: "arg_hcode", value: "ISCM25" } ]
				},
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline"},
				{ type: "INLINE", name: "기준",
				    data: [ { title: "이력", value: "1" }, { title: "현재", value: "2" } ]
				},
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				}
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { gw_job_process.UI(); }

    },

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

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    {
                        element: [
				            { name: "ymd_fr", label: { title: "발생일자 :" },
				                style: { colfloat: "floating" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            { name: "ymd_to", label: { title: "~" },
				                mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "issue_type", label: { title: "발생구분 :" },
                                editable: { type: "select", 
                                	data: { memory: "발생구분", unshift: [ { title: "전체", value: "" } ] } 
                                }
                            },
				            { name: "chart", label: { title: "기준 :" },
				                editable: { type: "select", data: { memory: "기준" } }
				            }
				        ]
                    },
                    {
                        element: [
                            { name: "prod_group", label: { title: "제품군 :" },
                                editable: { type: "select",
                                    data: { memory: "제품군", unshift: [ { title: "전체", value: "%" } ] }
                                }
                            },
				            { name: "prod_type1", label: { title: "제품유형 :" },
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] }
				                }
				            },
				            { name: "prod_type2",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] }
				                }
				            },
				            { name: "prod_type3",
				                editable: { type: "select",
				                    data: { memory: "제품유형", unshift: [ { title: "전체", value: "%" } ] }
				                }
				            }
				        ]
                    },
                    {
                        element: [
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
				            { name: "cust_prod_nm", hidden: true },
				            { name: "proj_no", hidden: true }
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
        var args = { targetid: "grdData_현황", query: "EHM_5070_M_1", title: "문제 진행 현황",
            caption: false,
            width: 265,
            height: 462,
            pager: false,
            show: true,
            element: [
				{
				    header: "상태",
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
				    name: "rcode",
				    hidden: true
				},
				{ name: "issue_part", hidden: true },
				{ name: "issue_type", hidden: true },
				{
				    name: "ymd_fr",
				    hidden: true
				},
				{
				    name: "ymd_to",
				    hidden: true
				},
				{ name: "prod_group", hidden: true },
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true },
				{
				    name: "cust_cd",
				    hidden: true
				},
				{
				    name: "cust_dept",
				    hidden: true
				},
				{
				    name: "cust_prod_nm",
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
        var args = { targetid: "lyrChart_통계", query: "EHM_5070_M_1",
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
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 15, min: true },
                { type: "LAYER", id: "lyrChart_통계", offset: 8 }
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
        //----------
        function rowdblclick_grdData_현황(ui) {

            if (gw_com_api.getValue("grdData_현황", "selected", "chart", true) == "2") {
                gw_com_api.messageBox([
                    { text: "상세 조회는 이력 기준으로 조회하신 후" },
                    { text: "이용할 수 있습니다." }
                ]);
                return;
            }

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "EHM_2030",
                    title: "발생 내역",
                    param: [
                        { name: "issue_part", value: gw_com_api.getValue("grdData_현황", "selected", "issue_part", true) },
                        { name: "issue_type", value: gw_com_api.getValue("grdData_현황", "selected", "issue_type", true) },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) },
                        { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                        { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                        { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                        { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                        { name: "issue_stat", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                        { name: "pstat", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
                        { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }

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
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "issue_type", argument: "arg_issue_type" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "proj_no", argument: "arg_proj_no" },
				{ name: "chart", argument: "arg_chart" },
                { name: "dept_area", argument: "arg_dept_area" }
			],
			argument: [
                { name: "arg_issue_part", value: "AS" }
			],
            remark: [
	            { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "prod_group" }] },
		        { element: [{ name: "prod_type1"}] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "cust_dept"}] },
		        { element: [{ name: "cust_prod_nm"}] },
		        { element: [{ name: "proj_no"}] },
		        { element: [{ name: "chart"}] }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true
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