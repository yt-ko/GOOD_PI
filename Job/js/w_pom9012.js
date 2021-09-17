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
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
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

        //----------
        var args = {
            request: [
				{
				    type: "PAGE", name: "제품유형", query: "dddw_prodtype"
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
				},
				{
				    name: "저장",
				    value: "저장"
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "추가",
				    icon: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption",
            type: "FREE",
            show: true,
            trans: true,
            border: true,
            editable: {
                bind: "open",
                focus: "prod_type",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "prod_type",
				                label: {
				                    title: "제품유형 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "제품유형"
				                    }
				                }
				            },
		                    {
		                        name: "part_cd",
		                        label: {
		                            title: "자재코드 : "
		                        },
		                        editable: {
		                            type: "text",
		                            size: 10,
		                            maxlength: 20
		                        }
		                    },
                            {
                                name: "supp_cd",
                                label: {
                                    title: "거래처코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 20
                                }
                            },
                            {
                                name: "supp_nm",
                                label: {
                                    title: "협력사 :"
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 18,
                                    maxlength: 30
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
            targetid: "grdData_자재",
            query: "w_pom9012_M_1",
            title: "안전재고 관리",
            //caption: true,
            height: 258,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "prod_type",
                validate: true
            },
            element: [
                {
                    header: "제품유형",
                    name: "prod_type",
                    width: 90,
                    align: "center",
                    format: {
                        type: "select",
                        data: {
                            memory: "제품유형"
                        }
                    },
                    editable: {
                        bind: "create",
                        type: "select",
                        data: {
                            memory: "제품유형"
                        }
                    }
                },
                {
                    header: "자재코드",
                    name: "item_cd",
                    width: 115,
                    align: "center",
                    mask: "search",
                    editable: {
                        bind: "create",
                        type: "text",
                        validate: {
                            rule: "required",
                            message: "자재코드"
                        }
                    }
                },
				{
				    header: "거래처코드",
				    name: "cust_cd",
				    width: 100,
				    align: "center",
				    mask: "search",
				    editable: {
				        bind: "create",
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "거래처코드"
				        }
				    }
				},
				{
				    header: "협력사명",
				    name: "supp_nm",
				    width: 150,
				    align: "left"
				},
				{
				    header: "자재명",
				    name: "part_nm",
				    width: 225,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "part_spec",
				    width: 225,
				    align: "left"
				},
				{
				    lead: "장비별소요량",
				    header: "장비별<br /><div style='margin-top:4px;'>소요량</div>",
				    name: "take_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text"
				    }
				},
				{
				    lead: "필요수량(장납기)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(장납기)</div>",
				    name: "need_qty_term",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" },
				    editable: {
				        type: "text"
				    }
				},
				{
				    lead: "필요수량(CS)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(CS)</div>",
				    name: "need_qty_cs",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" },
				    editable: {
				        type: "text"
				    }
				},
				{
				    lead: "필요수량(유상판매)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(유상판매)</div>",
				    name: "need_qty_cost",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" },
				    editable: {
				        type: "text"
				    }
				},
				{
				    lead: "필요수량(소계)",
				    header: "필요수량<br /><div style='margin-top:4px;'>(소계)</div>",
				    name: "need_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#EFEFFA" }
				},
				{
				    header: "보유수량",
				    name: "hold_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#E7FAE7" }
				},
				{
				    header: "요청수량",
				    name: "req_qty",
				    width: 65,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#FAE7E7" },
				    editable: {
				        type: "text"
				    }
				},
				{
				    lead: "당사확보계획(수량)",
				    header: "당사확보계획<br /><div style='margin-top:4px;'>(수량)</div>",
				    name: "plan_qty",
				    width: 75,
				    align: "center",
				    mask: "numeric-int",
				    style: { bgcolor: "#FAFABA" },
				    editable: {
				        type: "text"
				    }
				},
				{
				    lead: "당사확보계획(입고일정)",
				    header: "당사확보계획<br /><div style='margin-top:4px;'>(입고일정)</div>",
				    name: "plan_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    style: { bgcolor: "#FAFABA" },
				    editable: {
				        type: "text"
				    }
				},
				{
				    lead: "당사확보계획(최종변경일시)",
				    header: "당사확보계획<br /><div style='margin-top:4px;'>(최종변경일시)</div>",
				    name: "plan_upd_dt",
				    width: 160,
				    align: "center",
				    style: { bgcolor: "#FAFABA" }
				},
				{
				    header: "담당자",
				    name: "emp_nm",
				    width: 80,
				    align: "center",
				    mask: "search",
				    display: true,
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "등록일시",
				    name: "upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "emp_no",
				    hidden: true,
				    editable: { type: "hidden" }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_비고",
            query: "w_pom9012_S_1",
            title: "특이 사항",
            caption: true,
            height: 67,
            pager: false,
            show: true,
            selectable: true,
            key: false,
            editable: {
                multi: true,
                bind: "select",
                focus: "rmk",
                validate: true
            },
            element: [
                {
                    header: "제품유형",
                    name: "prod_type",
                    width: 90,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
                {
                    header: "등록일자",
                    name: "reg_date",
                    width: 80,
                    align: "center",
                    mask: "date-ymd",
                    editable: {
                        type: "hidden"
                    }
                },
				{
				    header: "비고",
				    name: "rmk",
				    width: 660,
				    align: "left",
                    multiline: true,
				    editable: {
				        type: "textarea",
                        rows: 5,
				        validate: {
				            rule: "required",
				            message: "비고"
				        }
				    }
				},
		        {
		            header: "등록자",
		            name: "upd_usr",
		            width: 70,
		            align: "center"
		        },
		        {
		            name: "seq",
		            hidden: true,
		            editable: {
		                type: "hidden"
		            }
		        }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "GRID",
				    id: "grdData_자재",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_비고",
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

        //----------
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
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_1_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_1_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_1_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_2_삭제
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
            targetid: "frmOption",
            event: "itemdblclick",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            event: "itemkeyenter",
            handler: itemdblclick_frmOption
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_자재",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_자재
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_자재",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_자재
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_자재",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_자재
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회() {

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
        function click_lyrMenu_1_추가(ui) {

            closeOption({});

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            closeOption({});

            processDelete({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate()) return;
            if (!checkUpdatable({ sub: true })) return;

            var args = {
                targetid: "grdData_비고",
                edit: true,
                updatable: true,
                where: {
                    type: "first"
                },
                data: [
                    { name: "prod_type", value: gw_com_api.getValue("frmOption", 1, "prod_type") },
                    { name: "reg_date", value: gw_com_api.getDate() },
                    { name: "seq", value: "1" }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_비고",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "supp_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_supplier",
                            title: "협력사 검색",
                            width: 600,
                            height: 450,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_supplier",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectSupplier,
                                    data: {
                                        system: "PLM",
                                        supp_nm: gw_com_api.getValue(ui.object, ui.row, ui.element)
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function itemchanged_grdData_자재(ui) {

            switch (ui.element) {
                case "need_qty_term":
                case "need_qty_cs":
                case "need_qty_cost":
                    {
                        var sum = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "need_qty_term"))
                                    + parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "need_qty_cs"))
                                    + parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "need_qty_cost"));
                        gw_com_api.setValue(ui.object, ui.row, "need_qty", sum, (ui.type == "GRID") ? true : false, true);
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "hold_qty"))
                                    + parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "req_qty"));
                        /*
                        if (qty > sum) {
                            gw_com_api.setValue(ui.object, ui.row, "req_qty", sum, (ui.type == "GRID") ? true : false, true, false);
                            gw_com_api.setValue(ui.object, ui.row, "plan_qty", "0", (ui.type == "GRID") ? true : false, true, false);
                        }
                        else
                            gw_com_api.setValue(ui.object, ui.row, "plan_qty", sum - qty, (ui.type == "GRID") ? true : false, true, false);
                        */                        
                        gw_com_api.setValue(ui.object,
                                            ui.row,
                                            "plan_qty",
                                            (sum - qty < 0) ? 0 : sum - qty,
                                            (ui.type == "GRID") ? true : false,
                                            true,
                                            false);
                    }
                    break;
                case "req_qty":
                    {
                        var sum = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "need_qty"));
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "hold_qty"))
                                    + parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "req_qty"));
                        /*
                        if (qty > sum) {
                            gw_com_api.messageBox([
                                { text: "보유 수량과 요청 수량의 합은" },
                                { text: "필요 수량보다 작거나 같아야만 합니다." }
                            ]);
                            gw_com_api.setCellValue(ui.type, ui.object, ui.row, ui.element, ui.value.current - (qty - sum));
                            gw_com_api.setValue(ui.object, ui.row, "plan_qty", "0", (ui.type == "GRID") ? true : false, true, false);
                        }
                        else
                            gw_com_api.setValue(ui.object, ui.row, "plan_qty", sum - qty, (ui.type == "GRID") ? true : false, true, false);
                        */
                        gw_com_api.setValue(ui.object,
                                            ui.row,
                                            "plan_qty",
                                            (sum - qty < 0) ? 0 : sum - qty,
                                            (ui.type == "GRID") ? true : false,
                                            true, 
                                            false);                            
                    }
                    break;
                /*
                case "plan_qty":
                    {
                        var sum = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "need_qty"));
                        var qty = parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "hold_qty"))
                                    + parseInt(gw_com_api.getCellValue(ui.type, ui.object, ui.row, "req_qty"))
                                    + parseInt(ui.value.current);
                        if (qty > sum) {
                            gw_com_api.messageBox([
                                { text: "보유 수량, 요청 수량, 계획 수량의 합은" },
                                { text: "필요 수량보다 작거나 같아야만 합니다." }
                            ]);
                            gw_com_api.setCellValue(ui.type, ui.object, ui.row, ui.element, ui.value.current - (qty - sum));
                        }
                    }
                    break;
                */
            }
            return true;

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
function itemdblclick_grdData_자재(ui) {

    switch (ui.element) {
        case "cust_cd":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "w_find_supplier",
                    title: "협력사 검색",
                    width: 600,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_find_supplier",
                        param: {
                            system: "PLM",
                            ID: gw_com_api.v_Stream.msg_selectSupplier
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "item_cd":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "w_find_part_stock",
                    title: "자재 검색",
                    width: 900,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_find_part_stock",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectPart_Stock
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "emp_nm":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "w_find_emp_scm",
                    title: "사원 검색",
                    width: 600,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_find_emp_scm",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectEmployee_SCM
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (gw_com_api.getSelectedRow("grdData_자재") == null) {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_자재"
			},
            {
                type: "GRID",
                id: "grdData_비고"
            }
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
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
    if (gw_com_module.objValidate(args) == false) {
        processClear({});
        return false;
    }

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                {
                    name: "supp_cd",
                    argument: "arg_supp_cd"
                },
                {
                    name: "supp_nm",
                    argument: "arg_supp_nm"
                },
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "part_cd",
				    argument: "arg_part_cd"
				}
			],
            remark: [
                {
                    element: [{ name: "supp_cd"}]
                },
			    {
			        element: [{ name: "supp_nm"}]
			    },
		        {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "part_cd"}]
		        }
		    ]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_자재",
                select: true
            },
            {
                type: "GRID",
                id: "grdData_비고"
            }
        ],
        clear: [
            {
                type: "GRID",
                id: "grdData_비고"
            }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "grdData_자재",
        edit: true,
        data: [
            { name: "cust_cd", rule: "COPY", row: "prev" },
            { name: "supp_nm", rule: "COPY", row: "prev" },
            { name: "prod_type", value: gw_com_api.getValue("frmOption", 1, "prod_type") },
            { name: "take_qty", value: "0" },
            { name: "need_qty_term", value: "0" },
            { name: "need_qty_cs", value: "0" },
            { name: "need_qty_cost", value: "0" },
            { name: "need_qty", value: "0" },
            { name: "req_qty", value: "0" },
            { name: "plan_qty", value: "0" }
        ]
    };
    var row = gw_com_module.gridInsert(args);
    itemdblclick_grdData_자재({
        type: "GRID",
        object: "grdData_자재",
        row: row,
        element: "item_cd"
    });

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_자재",
        row: "selected"
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_자재"
			},
            {
                type: "GRID",
                id: "grdData_비고"
            }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_자재"
            },
            {
                type: "GRID",
                id: "grdData_비고"
            }
        ]
    };
    gw_com_module.objClear(args);

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
function successSave(response, param) {

    processRetrieve({ key: response });

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
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.supp_cd,
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
        case gw_com_api.v_Stream.msg_selectedPart_Stock:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_cd",
			                        param.data.part_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "part_nm",
			                        param.data.part_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "part_spec",
			                        param.data.part_spec,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "hold_qty",
			                        param.data.hold_qty,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "emp_no",
			                        param.data.emp_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "emp_nm",
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
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
                    case "w_find_supplier":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = {
                                system: "PLM",
                                supp_nm: gw_com_api.getValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            v_global.event.element,
			                                (v_global.event.type == "GRID") ? true : false)
                            };
                        }
                        break;
                    case "w_find_part_stock":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_Stock;
                        }
                        break;
                    case "w_find_emp_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee_SCM;
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