
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = { request: [
				{ type: "PAGE", name: "검사항목", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC010"}] },
				{ type: "PAGE", name: "품목분류", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC020"}] },
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
        function start() {
            gw_job_process.UI();
        }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                //{ name: "조회", value: "관리도" }
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark", margin: 5,
            editable: { focus: "ymd_fr", validate: true },
            content: { row: [
                    { element: [
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_fr", label: { title: "대상기간 :" },
				          editable: { type: "text", size: 7, maxlength: 10 }
				        },
				        { style: { colfloat: "floating" }, mask: "date-ymd",
				          name: "ymd_to", label: { title: "~" },
				          editable: { type: "text", size: 7, maxlength: 10 }
				        }
				      ] 
				    },
                    { element: [
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
                    { align: "right", element: [
			            { name: "실행", value: "실행", act: true, format: { type: "button"} },
			            { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기"} }
				      ]
                    }
			    ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Main ====
        var args = { targetid: "grdData_Main", query: "SPC_5020_M1", title: "품질검사 품목",
            caption: false, height: 256, show: true, selectable: true, dynamic: true,
            color: { rule: [ 
                { color: "#A000A0", element: ["grade1_cnt"] } ,
                { color: "#0000FF", element: ["grade2_cnt"] } ,
                { color: "#000000", element: ["grade3_cnt"] } ,
                { color: "#0FF000", element: ["grade4_cnt"] } ,
                { color: "#FF0000", element: ["grade5_cnt"] } 
            ] }, 
            element: [
				{ header: "협력사", name: "supp_nm", width: 160, align: "left"},
				{ header: "품목코드", name: "item_no", width: 52, align: "center" },
				{ header: "품목명", name: "item_nm", width: 240, align: "left" },
                { header: "검사수량", name: "qc_qty", width: 44, align: "center", mask: "numeric-int" },
                { header: "항목수", name: "part_qty", width: 40, align: "center", mask: "numeric-int" },
				{ header: "Best", name: "grade1_cnt", width: 28, align: "center" },
				{ header: "Acceptable", name: "grade2_cnt", width: 56, align: "center" },
				{ header: "Enough", name: "grade3_cnt", width: 36, align: "center" },
				{ header: "Poor", name: "grade4_cnt", width: 28, align: "center" },
				{ header: "Bad", name: "grade5_cnt", width: 27, align: "center" },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "supp_cd", hidden: true },
				//{ name: "part_grp", hidden: true },
				{ name: "qcitem_cd", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Sub ====
        var args = {
            targetid: "grdData_Sub", query: "SPC_5020_S1", title: "항목별 상세",
            caption: true, height: 200, show: true, selectable: true, dynamic: true,
            color: { row: true }, pager: false,
            element: [
				//{ header: "품목", name: "qcitem_nm", width: 150, align: "left" },
				{ header: "검사항목", name: "qcitem_nm", width: 150, align: "left" },
				{ header: "공정능력판정", name: "cp_grade", width: 60, align: "center" },
				{ header: "불량확률(%)", name: "bad_rate", width: 50, align: "center" },
				{ header: "표본수량", name: "qc_qty", width: 40, align: "center" },
				{ header: "검사기간", name: "qc_term", width: 80, align: "center" },
                { header: "Cpk", name: "cpk_val", width: 40, align: "center", mask:"numeric-float" },
				{ header: "평균", name: "avg_val", width: 50, align: "center", mask: "numeric-float" },
				{ header: "표준편차", name: "dev_val", width: 50, align: "center", mask: "numeric-float" },
                { header: "규격상한", name: "usl_val", width: 50, align: "center", mask: "numeric-float" },
                { header: "규격하한", name: "lsl_val", width: 50, align: "center", mask: "numeric-float" },
				{ name: "ymd_fr", hidden: true },
				{ name: "ymd_to", hidden: true },
				{ name: "supp_cd", hidden: true },
				//{ name: "part_grp", hidden: true },
				{ name: "qcitem_cd", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Detail ====
        var args = { targetid: "grdData_Detail1", query: "SPC_5020_D1", title: "판정기준",
            caption: true, show: true, selectable: true, dynamic: true, //height: 250,
            color: { row: true }, pager: false, hiddengrid: true,
            element: [
				{ header: "판정", name: "grade_nm", width: 60, align: "center"},
				{ header: "기준", name: "standard_rmk", width: 120, align: "center" },
				{ name: "color", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Detail2 입고현황  ====
        var args = { targetid: "grdData_Detail2", query: "SPC_5020_D2", title: "입고 현황",
            caption: true, show: true, selectable: true, dynamic: true, height: 200,
            pager: true,
            element: [
				{ header: "Project", name: "proj_no", width: 80, align: "center"},
				{ header: "입고일자", name: "qc_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "Part No.", name: "part_no", width: 60, align: "left"},
				{ header: "수량", name: "part_qty", width: 34, align: "center", mask: "numeric-int" }
				
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Detail1", offset: 8 },
                { type: "GRID", id: "grdData_Detail2", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

        // go next.
        gw_job_process.procedure();

    },  // End of gw_job_process.UI


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main & Option ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        
        //==== Event Handler. : Main & Option ====
        function click_lyrMenu_조회() {
            var args = { target: [ { id: "frmOption", focus: true } ] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_취소(ui) { closeOption({}); }

        //==== Event Handler. : Grid Main ====
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function rowselected_grdData_Main(ui) { processLink({}); };
        //----------
        function processSearch(param) {

            switch (param.element) {
                case "supp_nm":
                    //{
                    //    v_global.event.type = param.type;
                    //    v_global.event.object = param.object;
                    //    v_global.event.row = param.row;
                    //    v_global.event.element = param.element;
                    //    var args = {
                    //        type: "PAGE",
                    //        page: "DLG_SUPPLIER",
                    //        title: "협력사 선택",
                    //        width: 600,
                    //        height: 450,
                    //        open: true
                    //    };
                    //    if (gw_com_module.dialoguePrepare(args) == false) {
                    //        var args = {
                    //            page: "DLG_SUPPLIER",
                    //            param: {
                    //                ID: gw_com_api.v_Stream.msg_selectSupplier
                    //            }
                    //        };
                    //        gw_com_module.dialogueOpen(args);
                    //    }
                    //}
                    //break;
                case "item_nm":
                case "item_no":
                    //{
                    //    v_global.event.type = param.type;
                    //    v_global.event.object = param.object;
                    //    v_global.event.row = param.row;
                    //    v_global.event.element = param.element;
                    //    var args = {
                    //        type: "PAGE",
                    //        page: "w_find_part_qcm",
                    //        title: "품목 선택",
                    //        width: 800,
                    //        height: 450,
                    //        open: true
                    //    };
                    //    if (gw_com_module.dialoguePrepare(args) == false) {
                    //        var args = {
                    //            page: "w_find_part_qcm",
                    //            param: {
                    //                ID: gw_com_api.v_Stream.msg_selectPart_QCM
                    //            }
                    //        };
                    //        gw_com_module.dialogueOpen(args);
                    //    }
                    //}
                    //break;
                case "qcitem_nm":
                        {
                            v_global.event.type = param.type;
                            v_global.event.object = param.object;
                            v_global.event.row = param.row;
                            v_global.event.element = param.element;
                            var args = {
                                type: "PAGE",
                                page: "w_find_qcitem",
                                title: "검사항목",
                                width: 880,
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

        }
        //==== Event Handler. : Grid Sub ====
        var args = { targetid: "grdData_Sub", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Sub };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Sub", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_Sub };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function rowdblclick_grdData_Sub(ui) {
			gw_com_api.messageBox([ { text: "개발 테스트 중 입니다." } ]);
			return false;
        	 
            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = null;
            var args = { type: "PAGE", page: "w_ehm1030", title: "품질검사 성적표",
                width: 680, height: 380, open: true, control: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "w_ehm1030",
                    param: { ID: gw_com_api.v_Stream.msg_editASEquipment,
                        data: { prod_sno: gw_com_api.getValue( ui.object, ui.row, "supp_cd", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }	// End of rowdblclick_grdData_Sub 

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        if (gw_com_api.getPageParameter("ymd_fr")) {
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
        }
        if (gw_com_api.getPageParameter("ymd_to")) {
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
        }
        if (gw_com_api.getPageParameter("supp_cd")) {
            gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_api.getPageParameter("supp_cd"));
        }
        if (gw_com_api.getPageParameter("item_no")) {
            gw_com_api.setValue("frmOption", 1, "item_no", gw_com_api.getPageParameter("item_no"));
        }
        if (gw_com_api.getPageParameter("qcitem_cd")) {
            gw_com_api.setValue("frmOption", 1, "qcitem_cd", gw_com_api.getPageParameter("qcitem_cd"));
        }
        //----------
        gw_com_module.startPage();
        processRetrieveDetail({});
        processRetrieve({});

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processRetrieveDetail(param) {

    var args = { key: param.key,
        target: [
			{ type: "GRID", id: "grdData_Detail1" }
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = { key: param.key,
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
                { name: "qcitem_cd", argument: "arg_qc_item" },
				{ name: "item_no", argument: "arg_item_no" }
			],
            remark: [
	            { element: [ { name: "ymd_fr" }, { name: "ymd_to" } ], infix: "~" },
	            { element: [ { name: "item_nm"}] },
	            { element: [{ name: "qcitem_nm" }] }
	            //{ element: [ { name: "supp_cd"}] },
	            //{ element: [ { name: "chart_view"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_Main" }
		],
        clear: [
			{ type: "GRID", id: "grdData_Sub" }

		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = { key: param.key,
        source: { type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "supp_cd", argument: "arg_supp_cd" },
				{ name: "item_no", argument: "arg_item_no" },
				{ name: "qcitem_cd", argument: "arg_qcitem_cd" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub", select: true },
            { type: "GRID", id: "grdData_Detail2", select: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------
function closeOption(param) { gw_com_api.hide("frmOption"); }
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
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
        case gw_com_api.v_Stream.msg_selectedPart_QCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_no",
			                        param.data.part_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_nm",
			                        param.data.part_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
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
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_retrieve:
            {
                if (param.data.key != undefined) {
                    $.each(param.data.key, function () {
                        if (this.QUERY == "SPC_5010_M_1")
                            this.QUERY = "SPC_5010_M_1";
                    });
                }
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = {
                    targetid: "grdData_Main",
                    row: v_global.event.row
                }
                gw_com_module.gridDelete(args);
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
                    case "w_ehm1030":
                        {
                            args.ID = gw_com_api.v_Stream.msg_editASEquipment;
                            if (v_global.event.row != null)
                                args.data = {
                                    prod_sno: gw_com_api.getValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "prod_sno",
                                                (v_global.event.type == "GRID" ? true : false))
                                };
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//