
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
                {
                    type: "PAGE", name: "발생구분", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM11" }]
                },
				{
				    type: "PAGE", name: "제품군", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "IEHM06" }]
				},
				{
				    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM25" }]
				},
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
				{ type: "PAGE", name: "LINE", query: "dddw_custline" },
				{ type: "PAGE", name: "PROCESS", query: "dddw_custproc" },
				{
				    type: "INLINE", name: "분류",
				    data: [
						{ title: "현상", value: "ISSUE-STATUS" },
						{ title: "부위", value: "ISSUE-PART" },
						{ title: "원인", value: "ISSUE-REASON" },
						{ title: "고객사", value: "ISSUE-CUST" },
                        { title: "LINE", value: "ISSUE-LINE" },
                        { title: "제품유형", value: "ISSUE-PROD" }
				    ]
				},
				{ type: "PAGE", name: "진행상태", query: "DDDW_ISSUE_STAT" },
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
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "ymd_fr", label: { title: "발생일자 :" },
                                    style: { colfloat: "floating" }, mask: "date-ymd",
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "ymd_to", label: { title: "~" },
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
                                    name: "issue_type", label: { title: "발생구분 :" }, value: "문제발생",
                                    editable: {
                                        type: "select",
                                        data: { memory: "발생구분", unshift: [{ title: "전체", value: "" }] }
                                    }
                                },
                                {
                                    name: "chart", label: { title: "분류 :" },
                                    editable: { type: "select", data: { memory: "분류" } }
                                },
                                {
                                    name: "issue_stat", label: { title: "진행상태 :" },
                                    editable: {
                                        type: "select",
                                        data: { memory: "진행상태", unshift: [{ title: "전체", value: "%" }] }
                                    }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "prod_group", label: { title: "제품군 :" }, value: "SMCA",
                                    editable: {
                                        type: "select",
                                        data: { memory: "제품군", unshift: [{ title: "전체", value: "" }] }
                                    }
                                },
                                {
                                    name: "prod_type1", label: { title: "제품유형 :" },
                                    editable: {
                                        type: "select",
                                        data: { memory: "제품유형", unshift: [{ title: "전체", value: "" }] }
                                    }
                                },
                                {
                                    name: "prod_type2",
                                    editable: {
                                        type: "select",
                                        data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                    }
                                },
                                {
                                    name: "prod_type3",
                                    editable: {
                                        type: "select",
                                        data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                    }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "cust_cd", label: { title: "고객사 :" },
                                    editable: {
                                        type: "select",
                                        data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
                                        change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
                                    }
                                },
                                {
                                    name: "cust_dept", label: { title: "LINE :" },
                                    editable: {
                                        type: "select",
                                        data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }
                                    }
                                },
                                {
                                    name: "cust_proc", label: { title: "Process :" },
                                    editable: { type: "select", data: { memory: "PROCESS", unshift: [{ title: "전체", value: "%" }] } }
                                },
                                { name: "proj_no", hidden: true }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "cust_prod_nm", label: { title: "설비명 :" },
                                    editable: { type: "text", size: 15, maxlength: 50 }
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
        var args = { targetid: "grdData_현황", query: "EHM_5050_M_1", title: "분류별 현황",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{ header: "분류", name: "category", width: 165, align: "center" },
				{ header: "건수", name: "value", width: 50, align: "center" },
				{ header: "DOWN시간", name: "down_time", width: 60, align: "center" },
				{ header: "DOWN율", name: "down_rate", width: 60, align: "center" },
				{ name: "rgroup", hidden: true },
				{ name: "rcode", hidden: true },
				{ name: "issue_part", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "prod_group", hidden: true },
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true },
				{ name: "cust_cd", hidden: true },
				{ name: "cust_dept", hidden: true },
				{ name: "cust_proc", hidden: true },
				{ name: "cust_prod_nm", hidden: true },
				{ name: "proj_no", hidden: true },
				{ name: "issue_stat", hidden: true },
				{ name: "issue_type", hidden: true },
				{ name: "chart", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_상세현황", query: "EHM_5050_M_2", title: "분류별 상세 현황",
            caption: true, width: 370, height: 299, pager: false, show: true,
            element: [
				{ header: "구분", name: "category", width: 165, align: "center" },
				{ header: "건수", name: "value", width: 50, align: "center" },
				{ header: "DOWN시간", name: "down_time", width: 60, align: "center" },
				{ header: "DOWN율", name: "down_rate", width: 60, align: "center" },
				{ name: "rgroup", hidden: true },
				{ name: "rcode", hidden: true },
				{ name: "issue_part", hidden: true },
				{ name: "issue_type", hidden: true },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "prod_group", hidden: true },
				{ name: "prod_type1", hidden: true },
				{ name: "prod_type2", hidden: true },
				{ name: "prod_type3", hidden: true },
				{ name: "cust_cd", hidden: true },
				{ name: "cust_dept", hidden: true },
				{ name: "cust_prod_nm", hidden: true },
				{ name: "proj_no", hidden: true },
				{ name: "issue_stat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrChart_통계", query: "EHM_5050_S_1", title: "분류별 통계", show: true,
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrChart_상세통계", query: "EHM_5050_S_2", title: "분류별 상세 통계",
            show: true, format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_2 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    offset: 15,
				    min: true
				},
				{
				    type: "GRID",
				    id: "grdData_상세현황",
				    offset: 15,
				    min: true
				},
                {
                    type: "LAYER",
                    id: "lyrChart_통계",
                    offset: 8
                },
                {
                    type: "LAYER",
                    id: "lyrChart_상세통계",
                    offset: 8
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
            targetid: "grdData_상세현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_상세현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_상세현황",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_상세현황
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

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "EHM_2030",
                    title: "발생 내역",
                    param: [
                        { name: "issue_part", value: gw_com_api.getValue("grdData_현황", "selected", "issue_part", true) },
                        { name: "issue_type", value: gw_com_api.getValue("grdData_현황", "selected", "issue_type", true) },
                        { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                        { name: "wrnt_io", value: "" },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) },
                        { name: "issue_stat", value: gw_com_api.getValue("grdData_현황", "selected", "issue_stat", true) },
                        { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdData_현황", "selected", "chart", true);
            switch (chart) {
                case "ISSUE-STATUS":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_proc", value: gw_com_api.getValue("grdData_현황", "selected", "cust_proc", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "status_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "status_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-PART":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_proc", value: gw_com_api.getValue("grdData_현황", "selected", "cust_proc", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "part_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "part_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-REASON":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_proc", value: gw_com_api.getValue("grdData_현황", "selected", "cust_proc", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "reason_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "reason_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-CUST":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-LINE":
                    {
                        args.data.param.push(
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "prod_type2", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type2", true) },
                            { name: "prod_type3", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type3", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rgroup", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-PROD":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "prod_type2", value: "" },
                            { name: "prod_type3", value: "" }
                        );
                    }
                    break;
            }
            gw_com_module.streamInterface(args);

        }
        //----------
        function rowdblclick_grdData_상세현황(ui) {

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
                        { name: "wrnt_io", value: "" },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) },
                        { name: "issue_stat", value: gw_com_api.getValue("grdData_현황", "selected", "issue_stat", true) },
                        { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                    ]
                }
            };
            var chart = gw_com_api.getValue("grdData_현황", "selected", "chart", true);
            switch (chart) {
                case "ISSUE-STATUS":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "status_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "status_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
                            { name: "status_tp2", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) },
                            { name: "status_nm2", value: gw_com_api.getValue("grdData_상세현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-PART":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "part_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "part_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
                            { name: "part_tp2", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) },
                            { name: "part_nm2", value: gw_com_api.getValue("grdData_상세현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-REASON":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_현황", "selected", "cust_prod_nm", true) },
                            { name: "reason_tp1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "reason_nm1", value: gw_com_api.getValue("grdData_현황", "selected", "category", true) },
                            { name: "reason_tp2", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) },
                            { name: "reason_nm2", value: gw_com_api.getValue("grdData_상세현황", "selected", "category", true) }
                        );
                    }
                    break;
                case "ISSUE-CUST":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-LINE":
                    {
                        args.data.param.push(
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "prod_type1", true) },
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "rgroup", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "cust_proc", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) }
                        );
                    }
                    break;
                case "ISSUE-PROD":
                    {
                        args.data.param.push(
                            { name: "cust_cd", value: gw_com_api.getValue("grdData_현황", "selected", "cust_cd", true) },
                            { name: "cust_dept", value: gw_com_api.getValue("grdData_현황", "selected", "cust_dept", true) },
                            { name: "prod_group", value: gw_com_api.getValue("grdData_현황", "selected", "prod_group", true) },
                            { name: "prod_type1", value: gw_com_api.getValue("grdData_현황", "selected", "rcode", true) },
                            { name: "cust_prod_nm", value: gw_com_api.getValue("grdData_상세현황", "selected", "rcode", true) }
                        );
                    }
                    break;
            }
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
	        { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "issue_type", argument: "arg_issue_type" },
				{ name: "issue_stat", argument: "arg_issue_stat" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_proc", argument: "arg_cust_proc" },
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
		        { element: [{ name: "prod_type1" }] },
		        { element: [{ name: "cust_cd" }] },
		        { element: [{ name: "cust_dept" }] },
		        { element: [{ name: "cust_proc" }] },
		        { element: [{ name: "cust_prod_nm" }] },
		        { element: [{ name: "issue_stat" }] },
		        { element: [{ name: "proj_no" }] },
		        { element: [{ name: "chart" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황" },
			{ type: "CHART", id: "lyrChart_통계" }
        ],
        clear: [
			{ type: "GRID", id: "grdData_상세현황" },
			{ type: "CHART", id: "lyrChart_상세통계" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
                { name: "chart", argument: "arg_chart" },
				{ name: "issue_part", argument: "arg_issue_part" },
				{ name: "issue_type", argument: "arg_issue_type" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "issue_stat", argument: "arg_issue_stat" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "prod_type1", argument: "arg_prod_type1" },
				{ name: "prod_type2", argument: "arg_prod_type2" },
				{ name: "prod_type3", argument: "arg_prod_type3" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_proc", argument: "arg_cust_proc" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
				{ name: "proj_no", argument: "arg_proj_no" },
				{ name: "rcode", argument: "arg_tp" }
            ],
            argument: [
                { name: "arg_dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_상세현황" },
			{ type: "CHART", id: "lyrChart_상세통계" }
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