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
				    type: "PAGE", name: "고객사", query: "dddw_cust"
				},
				{
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				},
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
				    name: "전송",
				    value: "전송",
				    icon: "저장"
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
				    value: "추가"
				},
				{
				    name: "저장",
				    value: "저장"
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
            border: true,
            show: true,
            editable: {
                focus: "prod_group",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "prod_group",
                                label: {
                                    title: "장비군 : "
                                },
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "장비군"
                                    }
                                }
                            },
				            {
				                name: "prod_type",
				                label: {
				                    title: "제품유형 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "제품유형",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "cust_cd",
				                label: {
				                    title: "고객사 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "고객사",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "fr_date",
                                label: {
                                    title: "수요예측기간 :"
                                },
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10
                                }
                            },
				            {
				                name: "to_date",
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
            query: "w_pom3010_M_1",
            title: "수요 예측 현황",
            height: 400,
            show: true,
            selectable: true,
            dynamic: true,
            element: [
   				{
   				    header: "고객사",
   				    name: "cust_nm",
   				    width: 70,
   				    align: "center"
   				},
   				{
   				    header: "예측년월",
   				    name: "dlv_ym",
   				    width: 70,
   				    align: "center",
   				    mask: "date-ym"
   				},
   				{
   				    header: "제품유형",
   				    name: "prod_type_nm",
   				    width: 80,
   				    align: "center"
   				},
   				{
   				    header: "수량",
   				    name: "dlv_qty",
   				    width: 60,
   				    align: "center"
   				},
   				{
   				    header: "진행상태",
   				    name: "pstat_nm",
   				    width: 80,
   				    align: "center"
   				},
   				{
   				    header: "변동상태",
   				    name: "astat_nm",
   				    width: 80,
   				    align: "center"
   				},
   				{
   				    header: "구매상태",
   				    name: "purstat_nm",
   				    width: 80,
   				    align: "center"
   				},
   				{
   				    header: "수정자",
   				    name: "upd_usr",
   				    width: 70,
   				    align: "center"
   				},
   				{
   				    header: "수정일시",
   				    name: "upd_dt",
   				    width: 160,
   				    align: "center"
   				},
                {
                    name: "prod_type",
                    hidden: true
                },
                {
                    name: "cust_cd",
                    hidden: true
                },
                {
                    name: "projkey",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_발주",
            query: "w_pom3010_S_1",
            title: "협력사별 발주서",
            height: 150,
            show: true,
            selectable: true,
            dynamic: true,
            editable: {
                master: true,
                multi: true,
                bind: "open",
                focus: "pur_yn",
                validate: true
            },
            element: [
				{
				    header: "전송",
				    name: "pur_yn",
				    width: 40,
				    align: "center",
				    format: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    },
				    editable: {
				        type: "checkbox",
				        title: "",
				        value: "1",
				        offval: "0"
				    }
				},
				{
				    header: "협력사",
				    name: "supp_nm",
				    width: 180,
				    align: "left"
				},
				{
				    header: "진행상태",
				    name: "astat",
				    width: 60,
				    align: "center"
				},
   				{
   				    header: "구매담당",
   				    name: "emp_nm",
   				    width: 70,
   				    align: "center"
   				},
   				{
   				    header: "최종변경일시",
   				    name: "astat_dt",
   				    width: 160,
   				    align: "center",
   				    mask: "date-ymd"
   				},
   				{
   				    header: "정보전송일시",
   				    name: "send_dt",
   				    width: 160,
   				    align: "center",
   				    mask: "date-ymd"
   				},
   				{
   				    header: "공급사확인일시",
   				    name: "cust_dt",
   				    width: 160,
   				    align: "center",
   				    mask: "date-ymd"
   				},
   				{
   				    name: "projkey",
   				    hidden: true
   				},
				{
				    name: "pur_no",
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
            targetid: "grdData_요청",
            query: "w_pom3010_D_1",
            title: "구매 요청 품목",
            height: 147,
            pager: false,
            show: true,
            selectable: true,
            key: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "pstat",
                validate: true
            },
            element: [
   				{
   				    header: "확정",
   				    name: "pstat",
   				    width: 40,
   				    align: "center",
   				    format: {
   				        type: "checkbox",
   				        title: "",
   				        value: "1",
   				        offval: "0"
   				    },
   				    editable: {
   				        type: "checkbox",
   				        title: "",
   				        value: "1",
   				        offval: "0"
   				    }
   				},
   				{
   				    header: "품번",
   				    name: "item_cd",
   				    width: 90,
   				    align: "center",
   				    mask: "search",
   				    editable: {
   				        type: "text",
   				        validate: {
   				            rule: "required",
   				            message: "품번"
   				        }
   				    }
   				},
   				{
   				    header: "품목",
   				    name: "item_nm",
   				    width: 200,
   				    align: "left",
   				    editable: {
   				        type: "hidden"
   				    }
   				},
   				{
   				    header: "규격",
   				    name: "item_spec",
   				    width: 200,
   				    align: "left",
   				    editable: {
   				        type: "hidden"
   				    }
   				},
   				{
   				    header: "수량",
   				    name: "pur_qty",
   				    width: 40,
   				    align: "center",
   				    mask: "numeric-int",
   				    editable: {
   				        type: "text",
   				        validate: {
   				            rule: "required",
   				            message: "수량"
   				        }
   				    }
   				},
   				{
   				    header: "단위",
   				    name: "pur_unit",
   				    width: 40,
   				    align: "center",
   				    editable: {
   				        type: "hidden"
   				    }
   				},
   				{
   				    header: "납품요청일",
   				    name: "req_date",
   				    width: 92,
   				    align: "center",
   				    mask: "date-ymd",
   				    editable: {
   				        type: "text",
   				        validate: {
   				            rule: "required",
   				            message: "납품요청일"
   				        }
   				    }
   				},
   				{
   				    header: "협력사",
   				    name: "supp_nm",
   				    width: 200,
   				    align: "left"
   				},
   				{
   				    header: "최종변경일시",
   				    name: "astat_dt",
   				    width: 160,
   				    align: "center"
   				},
   				{
   				    name: "cust_cd",
   				    hidden: true
   				},
   				{
   				    name: "projkey",
   				    hidden: true,
   				    editable: {
   				        type: "hidden"
   				    }
   				},
   				{
   				    name: "pur_seq",
   				    hidden: true,
   				    editable: {
   				        type: "hidden"
   				    }
   				},
   				{
   				    name: "pur_no",
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
            targetid: "grdData_가능",
            query: "w_pom3010_D_2",
            title: "납품 예정 품목",
            height: 147,
            pager: false,
            show: true,
            selectable: true,
            key: true,
            element: [
                {
                    header: "납품예정일",
                    name: "plan_date",
                    width: 80,
                    align: "center",
                    mask: "date-ymd"
                },
				{
				    header: "품번",
				    name: "item_cd",
				    width: 70,
				    align: "center"
				},
   				{
   				    header: "품목",
   				    name: "item_nm",
   				    width: 200,
   				    align: "center"
   				},
   				{
   				    header: "규격",
   				    name: "item_spec",
   				    width: 200,
   				    align: "center"
   				},
   				{
   				    header: "단위",
   				    name: "pur_unit",
   				    width: 40,
   				    align: "center"
   				},
   				{
   				    header: "수량",
   				    name: "pur_qty",
   				    width: 40,
   				    align: "center"
   				},
            	{
            	    header: "상태",
            	    name: "pstat",
            	    width: 50,
            	    align: "center"
            	},
            	{
            	    header: "진행",
            	    name: "astat",
            	    width: 50,
            	    align: "center"
            	},
   				{
   				    header: "비고",
   				    name: "rmk",
   				    width: 200,
   				    align: "center",
   				    mask: "date-ymd"
   				},
   				{
   				    header: "최종변경일시",
   				    name: "astat_dt",
   				    width: 160,
   				    align: "center"
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
				    id: "grdData_현황",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_발주",
				    offset: 13
				},
				{
				    type: "GRID",
				    id: "grdData_요청",
				    offset: 18
				},
				{
				    type: "GRID",
				    id: "grdData_가능",
				    offset: 18
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_1",
            collapsible: true,
            target: [
				{
				    type: "GRID",
				    id: "grdData_현황",
				    title: "수요예측 현황"
				},
				{
				    type: "LAYER",
				    id: "lyrData_발주",
				    title: "FORCAST"
				}
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_2",
            collapsible: true,
            target: [
				{
				    type: "GRID",
				    id: "grdData_요청",
				    title: "FORCAST 품목"
				},
				{
				    type: "GRID",
				    id: "grdData_가능",
				    title: "납품 예정 품목"
				}
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                {
                    type: "GRID",
                    id: "grdData_현황",
                    offset: 8
                },
                {
                    type: "GRID",
                    id: "grdData_발주",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_요청",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_가능",
				    offset: 8
				},
                {
                    type: "TAB",
                    id: "lyrTab_1",
                    offset: 8
                },
				{
				    type: "TAB",
				    id: "lyrTab_2",
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
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "전송",
            event: "click",
            handler: click_lyrMenu_1_전송
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
            element: "저장",
            event: "click",
            handler: click_lyrMenu_2_저장
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
            event: "rowselecting",
            handler: rowselecting_grdData_현황
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
            targetid: "grdData_발주",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_발주
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_발주",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_발주
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_요청",
            grid: true,
            event: "itemdblclick",
            handler: itemdblclick_grdData_요청
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_요청",
            grid: true,
            event: "itemkeyenter",
            handler: itemdblclick_grdData_요청
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

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
        function click_lyrMenu_1_전송(ui) {

            if (!checkUpdatable({ sub: true })) return false;

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({ sub: true })) return;

            var args = {
                targetid: "grdData_요청",
                edit: true,
                data: [
                    { name: "supp_nm", value: gw_com_api.getValue("grdData_발주", "selected", "supp_nm", true) }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_저장(ui) {

            processSave({ sub: true });

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({ sub: true })) return;
            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            if (!checkUpdatable({ sub: true })) return false;
            if (!checkUpdatable({})) return false;
            return true;

        }
        //----------
        function rowselected_grdData_현황(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function rowdblclick_grdData_현황(ui) {

            gw_com_api.selectTab("lyrTab_1", 2);

        }
        //----------
        function rowselecting_grdData_발주(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_발주(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------
        function itemdblclick_grdData_요청(ui) {

            switch (ui.element) {
                case "item_cd":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_part_scm",
                            title: "부품 검색",
                            width: 750,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_part_scm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectPart_SCM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
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
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_supplier",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectSupplier
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
        gw_com_api.setValue("frmOption", 1, "fr_date", gw_com_api.getDate("", { month: +4 }));
        gw_com_api.setValue("frmOption", 1, "to_date", gw_com_api.getDate("", { month: +16 }));
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
function checkCRUD(param) {

    closeOption({});

    return gw_com_api.getCRUD("grdData_발주", "selected", true);

}
//----------
function checkManipulate(param) {

    closeOption({});

    if ((param.sub != true && gw_com_api.getSelectedRow("grdData_현황") == null)
        || (param.sub && checkCRUD({}) == "none")) {
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

    var args = {};
    if (param.sub) {
        args = {
            target: [
                {
                    type: "GRID",
                    id: "grdData_요청"
                }
            ],
            param: param
        };
    }
    else {
        args = {
            target: [
                {
                    type: "GRID",
                    id: "grdData_발주"
                }
            ],
            message: "전송",
            param: param
        };
    }
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({ sub: true })) return;
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
        processClear({ master: true });
        return false;
    }
    gw_com_api.selectTab("lyrTab_1", 1);

    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
		        {
		            name: "cust_cd",
		            argument: "arg_cust_cd"
		        },
		        {
		            name: "fr_date",
		            argument: "arg_fr_date"
		        },
		        {
		            name: "to_date",
		            argument: "arg_to_date"
		        }
			],
            remark: [
		        {
		            element: [{ name: "prod_group"}]
		        },
		        {
		            element: [{ name: "prod_type"}]
		        },
		        {
		            element: [{ name: "cust_cd"}]
		        },
		        {
		            infix: "~",
		            element: [
	                    { name: "fr_date" },
		                { name: "to_date" }
		            ]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_현황",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_발주"
			},
			{
			    type: "GRID",
			    id: "grdData_요청"
			},
			{
			    type: "GRID",
			    id: "grdData_가능"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
            source: {
                type: "GRID",
                id: "grdData_발주",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "projkey",
		                argument: "arg_projkey"
		            },
		            {
		                name: "pur_no",
		                argument: "arg_pur_no"
		            }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_요청"
	            },
	            {
	                type: "GRID",
	                id: "grdData_가능"
	            }
            ],
            key: param.key
        };
    }
    else {
        args = {
            source: {
                type: "GRID",
                id: "grdData_현황",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "projkey",
		                argument: "arg_projkey"
		            }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_발주",
	                select: true
	            }
            ],
            clear: [
	            {
	                type: "GRID",
	                id: "grdData_요청"
	            },
	            {
	                type: "GRID",
	                id: "grdData_가능"
	            }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_발주", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processSave(param) {

    var args = {};
    if (param.sub) {
        args = {
            target: [
                {
                    type: "GRID",
                    id: "grdData_요청"
                }
            ]
        };
    }
    else {
        args = {
            target: [
                {
                    type: "GRID",
                    id: "grdData_발주"
                }
            ]
        };
    }
    if (gw_com_module.objValidate(args) == false) return false;

    if (param.sub) {
    }
    else {
        args.url = "COM";
        args.message = "전송";
    }
    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_요청"
            },
	        {
	            type: "GRID",
	            id: "grdData_가능"
	        }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_발주"
        });
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
        });
    }
    else if (param.sub)
        args.target.unshift({
            type: "GRID",
            id: "grdData_발주"
        });
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

    if (param.sub)
        processLink({ sub: true, key: response });
    else
        processLink({ key: response });

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
        case gw_com_api.v_Stream.msg_selectedPart_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_cd",
			                        param.data.part_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_nm",
			                        param.data.part_nm,
			                        (v_global.event.type == "GRID") ? true : false,
			                        true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "item_spec",
			                        param.data.part_spec,
			                        (v_global.event.type == "GRID") ? true : false,
			                        true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "pur_unit",
			                        param.data.part_unit,
			                        (v_global.event.type == "GRID") ? true : false,
			                        true);
                closeDialogue({ page: param.from.page, focus: true });
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
			                        "supp_nm",
			                        param.data.supp_nm,
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
                        }
                        break;
                    case "w_find_part_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
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