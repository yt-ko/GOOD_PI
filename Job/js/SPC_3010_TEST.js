
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ready: function () {

        // initialize page.
        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = { request: [
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
				{ type: "PAGE", name: "품목분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}] },
				{ type: "PAGE", name: "협력사", query: "DDDW_SPC_SUPP" },
                { type: "INLINE", name: "VIEW",
                    data: [
						{ title: "I-MRI Chart", value: "IM" },
						{ title: "X-R Chart", value: "XR" }
					]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
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
                { name: "DATA", value: "측정DATA", icon: "조회" },
				{ name: "ChartSizeA", value: "ChartSizeA", icon: "출력" },
				{ name: "ChartSizeB", value: "ChartSizeB", icon: "출력" },
				{ name: "ChartSizeC", value: "ChartSizeC", icon: "출력" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark", margin: 5,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
				        {
				            style: { colfloat: "floating" }, mask: "date-ymd",
				            name: "ymd_fr", label: { title: "대상기간 :" },
				            editable: { type: "text", size: 7, maxlength: 10 }
				        },
				        {
				            style: { colfloat: "floating" }, mask: "date-ymd",
				            name: "ymd_to", label: { title: "~" },
				            editable: { type: "text", size: 7, maxlength: 10 }
				        }
                        ]
                    },
                    {
                        element: [
                          {
                              name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                              editable: { type: "text", size: 14 }
                          },
                          {
                              name: "qcitem_nm", label: { title: "검사항목 :" }, mask: "search",
                              editable: { type: "text", size: 20 }
                          }
                        ]
                    },
                    {
                        element: [
                          {
                              name: "item_no", label: { title: "품번 :" }, mask: "search",
                              editable: { type: "text", size: 8 }
                          },
                          {
                              name: "item_nm", label: { title: "품명 :" }, mask: "search",
                              editable: { type: "text", size: 29 }
                          },
                          { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                          { name: "qcitem_cd", hidden: true, editable: { type: "hidden" } },
                          { name: "item_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            {
                                name: "chart_view", label: { title: "차트구분 :" },
                                editable: { type: "select", data: { memory: "VIEW" } }
                            },
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Main ====
        var args = { targetid: "grdData_현황", query: "SPC_3010_TEST_M_1", title: "품질검사 품목",
            caption: true, width: 356, height: 196, show: true, selectable: true, pager: false, dynamic: true,
            element: [
				//{ header: "Part Name", name: "part_nm", width: 110, align: "left" },
				//{ header: "Part No.", name: "part_no", width: 80, align: "center" },
				//{ header: "Exponent", name: "value_exp", width: 50, align: "center" },
				{ header: "검사항목", name: "qcitem_nm", width: 130, align: "left" },
                { header: "검사시작일", name: "qcs_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "검사종료일", name: "qce_ymd", width: 80, align: "center", mask: "date-ymd" },
				{ header: "수량", name: "part_qty", width: 50, align: "right" },
                { header: "그룹 No.", name: "spc_id", width: 60, align: "center" },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "supp_cd", hidden: true },
				{ name: "part_grp", hidden: true },
				{ name: "qcitem_cd", hidden: true },
                { name: "part_no", hidden: true },
				{ name: "chart_view", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrChart_통계", query: "SPC_3010_TEST_S_3", show: true,
            format: { view: "3", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        //----------
        gw_com_module.chartCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_상세현황", query: "SPC_3010_TEST_S_1", title: "Summary",
            caption: true, width: 330, height: 490, show: true, selectable: true, number: true, pager: false,
            element: [
				{ header: "Item", name: "part_no", width: 120, align: "left"},
				{ header: "Value", name: "part_nm", width: 140, align: "center" }
			]
        };
        //----------
        gw_com_module.gridCreate(args);

        //=====================================================================================
        var args = { targetid: "lyrChart_통계2", query: "SPC_3010_TEST_S_4", show: true,
            format: { view: "3", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_2 }
        };
        //----------
        gw_com_module.chartCreate(args);
        
        //=====================================================================================
        var args = { targetid: "lyrChart_통계3", query: "SPC_3010_TEST_S_5", show: true,
            format: { view: "4", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_3 }
        };
        //----------
        gw_com_module.chartCreate(args);
        
        //==== Grid : Detail ====
        //var args = { targetid: "grdData_Detail", query: "SPC_3010_TEST_S_2", title: "군별 측정 Data",
        //    caption: true, width: 850, height: 470, show: true, selectable: true, pager: true, number: true,
        //    color: { row: true },
        //    element: [
		//		//{ header: "Group No.", name: "seq", width: 50, align: "center" },
		//		{ header: "검사일자", name: "qc_date", width: 80, mask: "date-ymd", align: "center" },
        //    	{ header: "Project No.", name: "proj_no", width: 70, align: "center" },
        //    	{ header: "Value 1", name: "value_1", width: 60, align: "right" },
        //    	{ header: "Value 2", name: "value_2", width: 60, align: "right" },
        //    	{ header: "Value 3", name: "value_3", width: 60, align: "right" },
        //    	{ header: "Value 4", name: "value_4", width: 60, align: "right" },
        //    	{ header: "Value 5", name: "value_5", width: 60, align: "right" },
        //    	{ header: "평균(X)", name: "value_avg", width: 60, align: "center" },
        //    	{ header: "범위(R)", name: "value_area", width: 60, align: "center" },
        //    	{ header: "Serial No.", name: "ser_no", width: 200, align: "left" },
        //    	{ header: "Remark", name: "qc_rmk", width: 400, align: "left" },
		//		{ header: "검사일자1", name: "qc_date1", width: 80, mask: "date-ymd", align: "center" },
        //    	{ header: "Project No.1", name: "proj_no1", width: 70, align: "center" },
        //    	{ header: "Serial No.1", name: "ser_no1", width: 200, align: "left" },
		//		{ header: "검사일자2", name: "qc_date2", width: 80, mask: "date-ymd", align: "center" },
        //    	{ header: "Project No.2", name: "proj_no2", width: 70, align: "center" },
        //    	{ header: "Serial No.2", name: "ser_no2", width: 200, align: "left" },
		//		{ header: "검사일자3", name: "qc_date3", width: 80, mask: "date-ymd", align: "center" },
        //    	{ header: "Project No.3", name: "proj_no3", width: 70, align: "center" },
        //    	{ header: "Serial No.3", name: "ser_no3", width: 200, align: "left" },
		//		{ header: "검사일자4", name: "qc_date4", width: 80, mask: "date-ymd", align: "center" },
        //    	{ header: "Project No.4", name: "proj_no4", width: 70, align: "center" },
        //    	{ header: "Serial No.4", name: "ser_no4", width: 200, align: "left" },
		//		{ header: "검사일자5", name: "qc_date5", width: 80, mask: "date-ymd", align: "center" },
        //    	{ header: "Project No.5", name: "proj_no5", width: 70, align: "center" },
        //    	{ header: "Serial No.5", name: "ser_no5", width: 200, align: "left" },
        //    	{ name: "color", hidden: true }
		//	]
        //};
        //gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8, min: true },
				{ type: "GRID", id: "grdData_상세현황", offset: 8, min: true },
				//{ type: "GRID", id: "grdData_Detail", offset: 8, min: true },
				{ type: "LAYER", id: "lyrChart_통계", offset: 8},
				{ type: "LAYER", id: "lyrChart_통계2", offset: 8}
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

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "DATA", event: "click", handler: click_lyrMenu_DATA };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "ChartSizeA", event: "click", handler: click_lyrMenu_ChartSizeA };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "ChartSizeB", event: "click", handler: click_lyrMenu_ChartSizeB };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "ChartSizeC", event: "click", handler: click_lyrMenu_ChartSizeC };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", grid: false, event: "itemdblclick", handler: click_frmOption_search };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", grid: false, event: "itemkeyenter", handler: click_frmOption_search };
        gw_com_module.eventBind(args);
        //==== Event Handler.
        function click_lyrMenu_조회() {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        function click_lyrMenu_DATA(ui) {
            if (!gw_com_api.getSelectedRow("grdData_현황", false)) {
                gw_com_api.messageBox([{ text: "NOMASTER" }], 420);
                return false;
            }

            v_global.logic.data = {
                ymd_fr: gw_com_api.getValue("frmOption", 1, "ymd_fr"),
                ymd_to: gw_com_api.getValue("frmOption", 1, "ymd_to"),
                supp_cd: gw_com_api.getValue("grdData_현황", "selected", "supp_cd", true),
                part_no: gw_com_api.getValue("grdData_현황", "selected", "part_no", true),
                spc_id: gw_com_api.getValue("grdData_현황", "selected", "spc_id", true),
                qcitem_cd: gw_com_api.getValue("grdData_현황", "selected", "qcitem_cd", true),
                chart_view: gw_com_api.getValue("grdData_현황", "selected", "chart_view", true)
            }
            var args = {
                type: "PAGE", locate: ["center", "top"], page: "w_qcdata",
                title: "측정 데이터", width: 1000, height: 480, open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_qcdata",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.logic.data

                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }
        function click_frmOption_search(param) {
            switch (param.element) {
                case "supp_nm":
                case "item_nm":
                case "item_no":
                case "qcitem_nm":
                    {
                        v_global.event.type = param.type;
                        v_global.event.object = param.object;
                        v_global.event.row = param.row;
                        v_global.event.element = param.element;
                        var args = {
                            type: "PAGE",
                            locate: ["center", "top"],
                            page: "w_find_qcitem",
                            title: "검사항목",
                            width: 800,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_qcitem",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProduct_QCM,
                                    data: {
                                        ymd_fr: gw_com_api.getValue("frmOption", 1, "ymd_fr"),
                                        ymd_to: gw_com_api.getValue("frmOption", 1, "ymd_to")
                                    }

                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
            //if (ui.element == "supp_nm") {
            //    v_global.event.object = "frmOption";
            //    v_global.event.row = "selected";
            //    var args = { type: "PAGE", page: "w_find_supplier_spc", title: "협력사 선택", width: 500, height: 450, open: true };
            //    if (gw_com_module.dialoguePrepare(args) == false) {
            //        var args = {
            //            page: "w_find_supplier_spc",
            //            param: { ID: gw_com_api.v_Stream.msg_selectedSupplier }
            //        };
            //        gw_com_module.dialogueOpen(args);
            //    }
            //}
            
        }
        //----------
        function click_lyrMenu_ChartSizeA(ui) { processChartReview({ chart_area: "A" }); }
        function click_lyrMenu_ChartSizeB(ui) { processChartReview({ chart_area: "B" }); }
        function click_lyrMenu_ChartSizeC(ui) { processChartReview({ chart_area: "C" }); }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_취소(ui) { closeOption({}); }

        //----------
//        var args = { targetid: "grdData_현황", grid: true, event: "rowselecting", handler: rowselecting_grdData_현황 };
//        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_상세현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_상세현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_상세현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_상세현황 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function rowselecting_grdData_현황(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
        };
        function processSelect(param) {
            gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false)
        }
        //----------
        function rowselected_grdData_현황(ui) {
            processLink({});
        };
        //----------
        function rowdblclick_grdData_현황(ui) {
/*
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: {
                    type: "MAIN"
                },
                data: {
                    page: "ECCB_2030",
                    title: "ECR 내역",
                    param: [
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_fr", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_현황", "selected", "ymd_to", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);
*/
        }
        //----------
        function rowdblclick_grdData_상세현황(ui) {

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = ui.element;
            var args = {
                type: "PAGE",
                width: 1100,
                height: 500,
                scroll: true,
                control: true,
                open: true
            };
            switch (ui.element) {
                case "ecr_no":
                    {
                        if (gw_com_api.getValue("grdData_상세현황", "selected", "ecr_no", true) > '0') {
                            args.page = "INFO_ECR";
                            args.title = "ECR 내역";
                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "INFO_ECR",
                                    param: {
                                        ID: gw_com_api.v_Stream.msg_infoECR,
                                        data: {
                                            ecr_no: gw_com_api.getValue("grdData_상세현황", "selected", "ecr_no", true)
                                        }
                                    }
                                };
                                gw_com_module.dialogueOpen(args);
                            }
                        }
                    }
                    break;
                case "mng_no":
                    {
                        if (gw_com_api.getValue("grdData_상세현황", "selected", "mng_no", true) > '0') {
                            if (gw_com_api.getValue("grdData_상세현황", "selected", "mng_group", true) == "ECO") {
                                args.page = "INFO_ECO";
                                args.title = "ECO 내역";
                                if (gw_com_module.dialoguePrepare(args) == false) {
                                    var args = {
                                        page: "INFO_ECO",
                                        param: {
                                            ID: gw_com_api.v_Stream.msg_infoECO,
                                            data: {
                                                eco_no: gw_com_api.getValue("grdData_상세현황", "selected", "mng_no", true)
                                            }
                                        }
                                    };
                                    gw_com_module.dialogueOpen(args);
                                }
                            }
                            if (gw_com_api.getValue("grdData_상세현황", "selected", "mng_group", true) == "CIP") {
                                args.page = "INFO_CIP";
                                args.title = "CIP 내역";
                                if (gw_com_module.dialoguePrepare(args) == false) {
                                    var args = {
                                        page: "INFO_CIP",
                                        param: {
                                            ID: gw_com_api.v_Stream.msg_infoCIP,
                                            data: {
                                                cip_no: gw_com_api.getValue("grdData_상세현황", "selected", "mng_no", true)
                                            }
                                        }
                                    };
                                    gw_com_module.dialogueOpen(args);
                                }
                            }
                        }
                    }
                    break;
                case "eccb_no":
                    {
                        args.page = "INFO_ECCB";
                        args.title = "심의 내역";
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "INFO_ECCB",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_infoECCB,
                                    data: {
                                        eccb_no: gw_com_api.getValue("grdData_상세현황", "selected", "eccb_no", true),
                                        item_seq: gw_com_api.getValue("grdData_상세현황", "selected", "eccb_seq", true)
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "cip_no":
                    {
                        args.page = "INFO_CIP";
                        args.title = "CIP 내역";
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "INFO_CIP",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_infoCIP,
                                    data: {
                                        cip_no: gw_com_api.getValue("grdData_상세현황", "selected", "cip_no", true)
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "eco_no":
                    {
                        args.page = "INFO_ECO";
                        args.title = "ECO 내역";
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "INFO_ECO",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_infoECO,
                                    data: {
                                        eco_no: gw_com_api.getValue("grdData_상세현황", "selected", "eco_no", true)
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -6 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "view", "XR" );
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "" && gw_com_api.getPageParameter("item_no") != "") {
            gw_com_api.setValue("frmOption", 1, "item_no", gw_com_api.getPageParameter("item_no"));
            gw_com_api.setValue("frmOption", 1, "item_nm", gw_com_api.getPageParameter("item_nm"));
            gw_com_api.setValue("frmOption", 1, "qcitem_cd", gw_com_api.getPageParameter("qc_item"));
            gw_com_api.setValue("frmOption", 1, "qcitem_nm", gw_com_api.getPageParameter("qc_item_nm"));
            gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_api.getPageParameter("supp_cd"));
            gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_api.getPageParameter("supp_nm"));
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
            processRetrieve({});
        }

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

	// 챠트 구분에 따라 표시 컬럼 변경 : 군별측정 Data
    //if (gw_com_api.getValue("frmOption", 1, "chart_view") == "IM")
    //    gw_com_api.hideCols("grdData_Detail", [
    //        "value_2", "value_3", "value_4", "value_5"
    //        , "qc_date2", "qc_date3", "qc_date4", "qc_date5"
    //        , "proj_no2", "proj_no3", "proj_no4", "proj_no5"
    //        , "ser_no2", "ser_no3", "ser_no4", "ser_no5"
    //    ]);
    //else
    //    gw_com_api.showCols("grdData_Detail", [
    //        "value_2", "value_3", "value_4", "value_5"
    //        , "qc_date2", "qc_date3", "qc_date4", "qc_date5"
    //        , "proj_no2", "proj_no3", "proj_no4", "proj_no5"
    //        , "ser_no2", "ser_no3", "ser_no4", "ser_no5"
    //    ]);
    //gw_com_module.objResize({
    //    target: [{ type: "GRID", id: "grdData_Detail", offset: 8 }]
    //});

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
                { name: "item_no", argument: "arg_item_no" },
                { name: "qcitem_cd", argument: "arg_qc_item" },
				//{ name: "part_grp", argument: "arg_part_grp" },
				{ name: "qcitem_cd", argument: "arg_qcitem_cd" },
				{ name: "chart_view", argument: "arg_chart_view" }
			],
            argument: [
                { name: "arg_part_grp", value: "900" }
            ],
            remark: [
	            { element: [ { name: "ymd_fr" }, { name: "ymd_to" } ], infix: "~" },
	            { element: [{ name: "supp_nm" }] },
                { element: [{ name: "item_no" }] },
                { element: [{ name: "item_nm" }] },
	            //{ element: [ { name: "part_grp"}] },
	            { element: [ { name: "qcitem_nm"}] },
	            { element: [ { name: "chart_view"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황" }
		],
        clear: [
			{ type: "GRID", id: "grdData_상세현황" },
			//{ type: "GRID", id: "grdData_Detail" },
			{ type: "CHART", id: "lyrChart_통계" },
			{ type: "CHART", id: "lyrChart_통계2" },
			{ type: "CHART", id: "lyrChart_통계3" }

		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: { type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
                { name: "spc_id", argument: "arg_spc_id" },
                { name: "qcitem_cd", argument: "arg_qcitem_cd" },
				{ name: "part_no", argument: "arg_part_no" },
				{ name: "part_grp", argument: "arg_part_grp" },
				{ name: "chart_view", argument: "arg_chart_view" }
			]
        },
        target: [
            { type: "GRID", id: "grdData_상세현황" },
            //{ type: "GRID", id: "grdData_Detail" },
            { type: "CHART", id: "lyrChart_통계" },
            { type: "CHART", id: "lyrChart_통계2" },
            { type: "CHART", id: "lyrChart_통계3" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processChartReview(param) {

    var args = {
        source: { type: "GRID", id: "grdData_현황", row: "selected",
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
                { name: "spc_id", argument: "arg_spc_id" },
                { name: "qcitem_cd", argument: "arg_qcitem_cd" },
				{ name: "part_no", argument: "arg_part_no" },
				{ name: "part_grp", argument: "arg_part_grp" },
				{ name: "chart_view", argument: "arg_chart_view" }
			]
            , argument: [ { name: "arg_chart_area", value: param.chart_area } ]
        },
        target: [
            { type: "CHART", id: "lyrChart_통계" },
            { type: "CHART", id: "lyrChart_통계2" }
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
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }
}
//----------
function processClientObjectSelected(s, e) {

    var QcDate, QcValue, QcRemark = "";
    var i = 0;

    if (e.hitObject.name == "측정치" && e.additionalHitObject != null) {
    	// e.hitObject.name == "측정치"
    	// e.additionalHitObject.values
    	var ChartType = gw_com_api.getValue("frmOption", 1, "chart_view");
    	QcValue = e.additionalHitObject.values;

    	if ( ChartType == "XR" ) {
    		var HitSeq = e.additionalHitObject.argument;	// Category
    		HitSeq = HitSeq.substr( 0, HitSeq.indexOf("(") );
    		i = HitSeq;
    		QcDate = gw_com_api.getValue("grdData_Detail", i, "qc_date", true);
    		QcDate = QcDate.substr(0,4) + "-" + QcDate.substr(4,2) + "-" + QcDate.substr(6,2);
    		QcRemark = gw_com_api.getValue("grdData_Detail", i, "qc_rmk", true);
    		//QcValue = gw_com_api.getValue("grdData_Detail", i, "value_avg", true);

//    		var HitDate = e.additionalHitObject.argument;	// Category
//    		HitDate = HitDate.substr(0,2) + HitDate.substr(3,2);
//    		var nRows = gw_com_api.getRowCount("grdData_Detail");
//    		for (i = 1; i < nRows + 1; i++){
//    			QcDate = gw_com_api.getValue("grdData_Detail", i, "qc_date", true);
//    			if ( QcDate.substr(4,4) == HitDate){
//    				QcDate = QcDate.substr(0,4) + "-" + QcDate.substr(4,2) + "-" + QcDate.substr(6,2);
//	    			QcRemark = gw_com_api.getValue("grdData_Detail", i, "qc_rmk", true);
//	    			QcValue = gw_com_api.getValue("grdData_Detail", i, "value_avg", true);
//    				break;
//    			}
//    		}
    	}
    	else{
    		var HitSeq = e.additionalHitObject.argument;	// Category
    		HitSeq = HitSeq.substr( 0, HitSeq.indexOf("(") );
    		i = HitSeq;
    		
    		QcDate = gw_com_api.getValue("grdData_Detail", i, "qc_date", true);
    		QcDate = QcDate.substr(0,4) + "-" + QcDate.substr(4,2) + "-" + QcDate.substr(6,2);
    		QcRemark = gw_com_api.getValue("grdData_Detail", i, "qc_rmk", true);
    		//QcValue = gw_com_api.getValue("grdData_Detail", i, "value_avg", true);
    	}
    		
        
        gw_com_api.messageBox(
        	[ { align: "left", text: "[Seq] : " + i } 
        	 ,{ align: "left", text: "[Date] : " + QcDate } 
        	 ,{ align: "left", text: "[Value] : " + QcValue } 
        	 ,{ align: "left", text: "[Remark] : " + QcRemark } 
        	]
            , 400, gw_com_api.v_Message.msg_alert, "ALERT", { itemchange: true });
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
        case gw_com_api.v_Stream.msg_selectedProduct_QCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "ymd_fr",
			                        param.data.ymd_fr,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "ymd_to",
			                        param.data.ymd_to,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "qcitem_cd",
			                        param.data.qcitem_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "qcitem_nm",
			                        param.data.qcitem_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_no",
			                        param.data.item_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_nm",
			                        param.data.item_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_cd",
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_nm",
			                        param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "INFO_ECR":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECR;
                            args.data = {
                                ecr_no: gw_com_api.getValue("grdData_상세현황", "selected", "ecr_no", true)
                            };
                        }
                        break;
                    case "INFO_ECCB":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECCB;
                            args.data = {
                                eccb_no: gw_com_api.getValue("grdData_상세현황", "selected", "eccb_no", true),
                                item_seq: gw_com_api.getValue("grdData_상세현황", "selected", "eccb_seq", true)
                            };
                        }
                        break;
                    case "INFO_CIP":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoCIP;
                            args.data = {
                                cip_no: gw_com_api.getValue("grdData_상세현황", "selected", "mng_no", true)
                            };
                        }
                        break;
                    case "INFO_ECO":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECO;
                            args.data = {
                                eco_no: gw_com_api.getValue("grdData_상세현황", "selected", "mng_no", true)
                            };
                        }
                        break;
                    case "w_find_supplier":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        }
                        break;
                    case "w_find_qcitem":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_QCM;
                            args.data = {
                                ymd_fr: gw_com_api.getValue("frmOption", 1, "ymd_fr"),
                                ymd_to: gw_com_api.getValue("frmOption", 1, "ymd_to")
                            }
                        }
                        break;
                    case "w_qcdata":
                        {
                            args.ID = gw_com_api.v_Stream.msg_retrieve;
                            args.data = {
                                ymd_fr: gw_com_api.getValue("frmOption", 1, "ymd_fr"),
                                ymd_to: gw_com_api.getValue("frmOption", 1, "ymd_to"),
                                supp_cd: gw_com_api.getValue("grdData_현황", "selected", "supp_cd", true),
                                part_no: gw_com_api.getValue("grdData_현황", "selected", "part_no", true),
                                spc_id: gw_com_api.getValue("grdData_현황", "selected", "spc_id", true),
                                qcitem_cd: gw_com_api.getValue("grdData_현황", "selected", "qcitem_cd", true),
                                chart_view: gw_com_api.getValue("grdData_현황", "selected", "chart_view", true)
                            }
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier: 
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
