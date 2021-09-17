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

        //----------
        var args = {
            request: [
                {
                    type: "PAGE",
                    name: "화폐",
                    query: "dddw_mat_monetary_unit"
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
            targetid: "lyrMenu_1_1",
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
            targetid: "lyrMenu_1_2",
            type: "FREE",
            show: false,
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
				    name: "수정",
				    value: "수정",
				    icon: "기타"
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
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "선택복사",
				    icon: "추가"
				},
                {
                    name: "전송",
                    value: "내역전송",
                    icon: "실행"
                }
			]
        };
        args.targetid = "lyrMenu_2_1";
        //----------
        gw_com_module.buttonMenu(args);
        args.targetid = "lyrMenu_2_2";
        //----------
        gw_com_module.buttonMenu(args);
        args.targetid = "lyrMenu_2_3";
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_1",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: false,
            border: true,
            editable: {
                bind: "open",
                focus: "mat_cd",
                validate: true
            },
            remark: "lyrRemark_1",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "mat_cd",
                                label: {
                                    title: "품목코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 10,
                                    maxlength: 20
                                }
                            },
				            {
				                name: "mat_nm",
				                label: {
				                    title: "품명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "mat_spec",
				                label: {
				                    title: "규격 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "mat_monetary_unit",
				                label: {
				                    title: "화폐 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "화폐",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
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
            targetid: "frmOption_2",
            type: "FREE",
            trans: true,
            show: false,
            border: true,
            editable: {
                bind: "open",
                focus: "mat_cd",
                validate: true
            },
            remark: "lyrRemark_2",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "mat_cd",
                                label: {
                                    title: "품목코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 10,
                                    maxlength: 20
                                }
                            },
				            {
				                name: "mat_nm",
				                label: {
				                    title: "품명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "mat_monetary_unit",
				                label: {
				                    title: "화폐 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "화폐",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
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
            targetid: "frmOption_3",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: false,
            border: true,
            editable: {
                bind: "open",
                focus: "mat_cd",
                validate: true
            },
            remark: "lyrRemark_3",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "mat_cd",
                                label: {
                                    title: "품목코드 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 10,
                                    maxlength: 20
                                }
                            },
				            {
				                name: "mat_nm",
				                label: {
				                    title: "품명 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "mat_spec",
				                label: {
				                    title: "규격 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                }
				            },
				            {
				                name: "mat_monetary_unit",
				                label: {
				                    title: "화폐 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "화폐",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
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
            query: "w_find_est_mst",
            title: "자재",
            height: 137,
            pager: false,
            dynamic: true,
            show: true,
            multi: true,
            key: true,
            element: [
                {
                    header: "코드",
                    name: "mat_cd",
                    width: 80,
                    align: "center"
                },
                {
                    header: "품명",
                    name: "mat_nm",
                    width: 220,
                    align: "left"
                },
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 220,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "화폐",
				    name: "mat_monetary_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_part",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "title_div_nm",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_자재선택",
            title: "선택 내역 [자재]",
            height: 142,
            pager: false,
            multi: true,
            caption: true,
            show: true,
            key: true,
            element: [
                {
                    header: "코드",
                    name: "mat_cd",
                    width: 80,
                    align: "center"
                },
                {
                    header: "품명",
                    name: "mat_nm",
                    width: 220,
                    align: "left"
                },
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 220,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "화폐",
				    name: "mat_monetary_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_part",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "title_div_nm",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_인건비",
            query: "w_find_est_lab",
            title: "인건비",
            height: 137,
            dynamic: true,
            pager: false,
            show: true,
            multi: true,
            key: true,
            element: [
                {
                    header: "코드",
                    name: "mat_cd",
                    width: 80,
                    align: "center"
                },
                {
                    header: "품명",
                    name: "mat_nm",
                    width: 220,
                    align: "left"
                },
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 220,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "화폐",
				    name: "mat_monetary_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_part",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "title_div_nm",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_인건비선택",
            title: "선택 내역 [인건비]",
            height: 142,
            pager: false,
            caption: true,
            show: true,
            multi: true,
            key: true,
            element: [
                {
                    header: "코드",
                    name: "mat_cd",
                    width: 80,
                    align: "center"
                },
				{
				    header: "품명",
				    name: "mat_nm",
				    width: 220,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 220,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "left"
				},
				{
				    header: "화폐",
				    name: "mat_monetary_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_part",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
                {
                    name: "mat_cd",
                    hidden: true
                },
				{
				    name: "title_div_nm",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_임시",
            query: "w_find_est_tmp",
            title: "임시 자재",
            height: 137,
            pager: false,
            dynamic: true,
            show: true,
            multi: true,
            key: true,
            element: [
                {
                    header: "코드",
                    name: "mat_cd",
                    width: 80,
                    align: "center"
                },
                {
                    header: "품명",
                    name: "mat_nm",
                    width: 220,
                    align: "left"
                },
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 220,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "화폐",
				    name: "mat_monetary_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_part",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "title_div_nm",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_임시선택",
            title: "선택 내역 [임시자재]",
            height: 142,
            pager: false,
            multi: true,
            caption: true,
            show: true,
            key: true,
            element: [
                {
                    header: "코드",
                    name: "mat_cd",
                    width: 80,
                    align: "center"
                },
                {
                    header: "품명",
                    name: "mat_nm",
                    width: 220,
                    align: "left"
                },
				{
				    header: "규격",
				    name: "mat_spec",
				    width: 220,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "mat_unit",
				    width: 50,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "화폐",
				    name: "mat_monetary_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "단가",
				    name: "mat_ucost",
				    width: 100,
				    align: "right",
				    mask: "currency-float"
				},
				{
				    name: "mat_categorize",
				    hidden: true
				},
				{
				    name: "mat_part",
				    hidden: true
				},
				{
				    name: "mat_maker",
				    hidden: true
				},
				{
				    name: "title_div_nm",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            collapsible: false,
            target: [
                {
                    type: "LAYER",
                    id: "lyrData_1",
                    title: "자재"
                },
				{
				    type: "LAYER",
				    id: "lyrData_2",
				    title: "인건비"
				},
                {
                    type: "LAYER",
                    id: "lyrData_3",
                    title: "임시자재"
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
				    id: "grdData_자재",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_자재선택",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_인건비",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_인건비선택",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_임시",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_임시선택",
				    offset: 8
				}
			]
        };
        //----------
        //gw_com_module.objResize(args);

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
            targetid: "lyrMenu_1_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1_2",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1_2",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_1_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1_2",
            element: "수정",
            event: "click",
            handler: click_lyrMenu_1_2_수정
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1_2",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2_1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2_1",
            element: "전송",
            event: "click",
            handler: click_lyrMenu_2_전송
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2_2",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2_2",
            element: "전송",
            event: "click",
            handler: click_lyrMenu_2_전송
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2_3",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2_3",
            element: "전송",
            event: "click",
            handler: click_lyrMenu_2_전송
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrTab",
            event: "tabselect",
            handler: click_lyrTab_tabselect
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_자재선택",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_선택
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_인건비선택",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_선택
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_임시선택",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_선택
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
					    id: "frmOption_" + v_global.process.current.tab,
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkSendable({ check: true })) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_1_2_추가(ui) {

            closeOption({});

            v_global.event.type = "GRID";
            v_global.event.object = "grdData_임시";
            v_global.event.row = null;
            v_global.event.element = null;
            var args = {
                type: "PAGE",
                page: "w_hcem1041",
                title: "임시 자재 관리",
                width: 680,
                height: 220,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_hcem1041",
                    param: {
                        ID: gw_com_api.v_Stream.msg_editTemporaryPart
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_1_2_수정(ui) {

            closeOption({});

            if (gw_com_api.getSelectedRow("grdData_임시", true).length <= 0) {
                gw_com_api.messageBox([
                    { text: "선택된 내역이 없습니다." }
                ], 300);
                return false;
            }
            else if (gw_com_api.getSelectedRow("grdData_임시", true).length > 1) {
                gw_com_api.messageBox([
                    { text: "수정할 내역을 한 건만 선택해 주세요." }
                ], 400);
                return false;
            }

            v_global.event.type = "GRID";
            v_global.event.object = "grdData_임시";
            v_global.event.row = "selected";
            v_global.event.element = null;
            var args = {
                type: "PAGE",
                page: "w_hcem1041",
                title: "임시 자재 관리",
                width: 680,
                height: 220,
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_hcem1041",
                    param: {
                        ID: gw_com_api.v_Stream.msg_editTemporaryPart,
                        data: {
                            mat_cd: gw_com_api.getValue(
                                        "grdData_임시", "selected", "mat_cd", true)
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_2_추가() {

            v_global.process.handler = processCopy;

            if (!checkSendable({ copy: true })) return;

            processCopy({});

        }
        //----------
        function click_lyrMenu_2_전송() {

            v_global.process.handler = informResult;

            if (!checkSendable({})) return;

            informResult({});

        }
        //---------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            //if (!checkSendable({ check: true })) return;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function click_lyrTab_tabselect(ui) {

            closeOption({});

            //if (!checkSendable({ check: true })) return false;

            gw_com_api.hide("lyrMenu_1_" + ((v_global.process.current.tab == 3) ? 2 : 1));
            gw_com_api.hide("lyrRemark_" + v_global.process.current.tab);
            v_global.process.current.tab = ui.row;
            gw_com_api.show("lyrMenu_1_" + ((v_global.process.current.tab == 3) ? 2 : 1));
            gw_com_api.show("lyrRemark_" + v_global.process.current.tab);

            return true;

        }
        //----------
        function rowdblclick_grdData_선택(ui) {

            var args = {
                targetid: ui.object,
                row: ui.row,
                remove: true
            };
            gw_com_module.gridDelete(args);

        }

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
function checkSendable(param) {

    var source = "";
    switch (v_global.process.current.tab) {
        case 1:
            source = "grdData_자재";
            break;
        case 2:
            source = "grdData_인건비";
            break;
        case 3:
            source = "grdData_임시";
            break;
    };
    var target = "";
    switch (v_global.process.current.tab) {
        case 1:
            target = "grdData_자재선택";
            break;
        case 2:
            target = "grdData_인건비선택";
            break;
        case 3:
            target = "grdData_임시선택";
            break;
    };
    if (param.check) {
        if (gw_com_api.getRowCount(target) > 0) {
            gw_com_api.messageBox([
                { text: "전송되지 않은 데이터가 있습니다. 전송하시겠습니까?" }
            ], 420, gw_com_api.v_Message.msg_confirmSend, "YESNOCANCEL");
            return false;
        }
    }
    else if (param.copy) {
        if (gw_com_api.getSelectedRow(source, true).length <= 0) {
            gw_com_api.messageBox([
                    { text: "선택된 내역이 없습니다." }
                ], 300);
            return false;
        }
    }
    else {
        if (gw_com_api.getRowCount(target) <= 0) {
            gw_com_api.messageBox([
                { text: "전송할 대상이 없습니다." },
                { text: "먼저 전송할 대상을 선택한 후 추가해 주세요." }
            ], 400);
            return false;
        }
    }
    return true;

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_" + v_global.process.current.tab
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (v_global.process.current.tab == 1) {
        if (gw_com_api.getValue("frmOption_1", 1, "mat_cd") == ""
            && gw_com_api.getValue("frmOption_1", 1, "mat_nm") == ""
            && gw_com_api.getValue("frmOption_1", 1, "mat_spec") == "") {
            gw_com_api.messageBox([
                { text: "품목코드, 품명, 규격 중 한 가지는 반드시 입력하셔야 합니다." }
            ], 480);
            gw_com_api.setError(true, "frmOption_1", 1, "mat_cd", false, true);
            gw_com_api.setError(true, "frmOption_1", 1, "mat_nm", false, true);
            gw_com_api.setError(true, "frmOption_1", 1, "mat_spec", false, true);
            return false;
        }
        gw_com_api.setError(false, "frmOption_1", 1, "mat_cd", false, true);
        gw_com_api.setError(false, "frmOption_1", 1, "mat_nm", false, true);
        gw_com_api.setError(false, "frmOption_1", 1, "mat_spec", false, true);
    }

    var target = "";
    var clear = "";
    var element = [];
    var remark = [];
    switch (v_global.process.current.tab) {
        case 1:
            target = "grdData_자재";
            element = [
				{
				    name: "mat_cd",
				    argument: "arg_mat_cd"
				},
                {
                    name: "mat_nm",
                    argument: "arg_mat_nm"
                },
                {
                    name: "mat_spec",
                    argument: "arg_mat_spec"
                },
                {
                    name: "mat_monetary_unit",
                    argument: "arg_monetary_unit"
                }
			];
            remark = [
		        {
		            element: [{ name: "mat_cd"}]
		        },
		        {
		            element: [{ name: "mat_nm"}]
		        },
		        {
		            element: [{ name: "mat_spec"}]
		        },
		        {
		            element: [{ name: "mat_monetary_unit"}]
		        }
		    ];
            break;
        case 2:
            target = "grdData_인건비";
            element = [
				{
				    name: "mat_cd",
				    argument: "arg_mat_cd"
				},
                {
                    name: "mat_nm",
                    argument: "arg_mat_nm"
                },
                {
                    name: "mat_monetary_unit",
                    argument: "arg_monetary_unit"
                }
			];
            remark = [
		        {
		            element: [{ name: "mat_cd"}]
		        },
		        {
		            element: [{ name: "mat_nm"}]
		        },
		        {
		            element: [{ name: "mat_monetary_unit"}]
		        }
		    ];
            break;
        case 3:
            target = "grdData_임시";
            element = [
				{
				    name: "mat_cd",
				    argument: "arg_mat_cd"
				},
                {
                    name: "mat_nm",
                    argument: "arg_mat_nm"
                },
                {
                    name: "mat_spec",
                    argument: "arg_mat_spec"
                },
                {
                    name: "mat_monetary_unit",
                    argument: "arg_monetary_unit"
                }
			];
            remark = [
		        {
		            element: [{ name: "mat_cd"}]
		        },
		        {
		            element: [{ name: "mat_nm"}]
		        },
		        {
		            element: [{ name: "mat_spec"}]
		        },
		        {
		            element: [{ name: "mat_monetary_unit"}]
		        }
		    ];
            break;
    };
    var args = {
        source: {
            type: "FORM",
            id: "frmOption_" + v_global.process.current.tab,
            hide: true,
            element: element,
            remark: remark
        },
        target: [
            { type: "GRID", id: target, select: param.select }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processCopy(param) {

    var source = "";
    switch (v_global.process.current.tab) {
        case 1:
            source = "grdData_자재";
            break;
        case 2:
            source = "grdData_인건비";
            break;
        case 3:
            source = "grdData_임시";
            break;
    };
    var target = "";
    switch (v_global.process.current.tab) {
        case 1:
            target = "grdData_자재선택";
            break;
        case 2:
            target = "grdData_인건비선택";
            break;
        case 3:
            target = "grdData_임시선택";
            break;
    };
    var args = {
        sourceid: source,
        targetid: target,
        multi: true
    };
    gw_com_module.gridCopy(args);
    gw_com_api.selectRow(source, "reset");

}
//----------
function processClear(param) {

    var target = "";
    switch (v_global.process.current.tab) {
        case 1:
            target = "grdData_자재선택";
            break;
        case 2:
            target = "grdData_인건비선택";
            break;
        case 3:
            target = "grdData_임시선택";
            break;
    };
    var args = {
        target: [
            {
                type: "GRID",
                id: target
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    if (param.target != undefined) {
        $.each(param.target, function () {
            gw_com_api.hide(this);
        });
    }
    else {
        gw_com_api.hide("frmOption_1");
        gw_com_api.hide("frmOption_2");
        gw_com_api.hide("frmOption_3");
    }

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
function informResult(param) {

    var source = "";
    switch (v_global.process.current.tab) {
        case 1:
            source = "grdData_자재선택";
            break;
        case 2:
            source = "grdData_인건비선택";
            break;
        case 3:
            source = "grdData_임시선택";
            break;
    };
    var rows = [];
    var ids = gw_com_api.getRowIDs(source);
    $.each(ids, function () {
        rows.push(gw_com_api.getRowData(source, this));
    });
    var args = {
        ID: gw_com_api.v_Stream.msg_selectedtoEstimate,
        data: {
            rows: rows
        }
    };
    gw_com_module.streamInterface(args);
    processClear({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selecttoEstimate:
            {
                var retrieve = false;
                if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                gw_com_api.setFocus("frmOption", 1, "param");
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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSend:
                        {
                            if (param.data.result == "YES")
                                informResult({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_retrieve:
            {
                if (param.data.key != undefined) {
                    $.each(param.data.key, function () {
                        if (this.QUERY == "w_hcem1041_M_1")
                            this.QUERY = "w_find_est_tmp";
                    });
                }
                processRetrieve({ key: param.data.key, select: true });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = {
                    targetid: "grdData_임시",
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
                    case "w_hcem1041":
                        {
                            args.ID = gw_com_api.v_Stream.msg_editTemporaryPart;
                            if (v_global.event.row != null)
                                args.data = {
                                    mat_cd: gw_com_api.getValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "mat_cd",
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

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//