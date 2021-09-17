//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        index: null,
        element: null,
        focus: null
    },
    process: {
        param: null,
        entry: null
    }
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
    ready: function() {


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
				    type: "PAGE", name: "MBOMList_고객사", query: "dddw_cust"
				},
				{
                    type: "PAGE", name: "MBOMList_제품군", query: "dddw_prodgroup",
                    param: [
                        { argument: "arg_hcode", value: "IEHM13" }
                    ]
                },
                {
                    type: "INLINE", name: "MBOMList_분류",
                    data: [
                      { title: "기구", value: "기구" },
                      { title: "전장", value: "전장" }
                    ]
                },
                {
                    type: "INLINE", name: "MBOMList_조달구분",
                    data: [
                      { title: "구매", value: "P" },
                      { title: "가공", value: "X" }
                    ]
                },
                {
                    type: "PAGE", name: "MBOMList_공정분류", query: "dddw_zcode",
				        param: [
                                { argument: "arg_hcode", value: "ISCM26" }
                               ]
				},
				{
				    type: "PAGE", name: "MBOMList_생산공정", query: "dddw_mprocess"
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
    UI: function() {

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
				    value: "조회"
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
            targetid: "frmOption_1",
            type: "FREE",
            trans: true,
            show: false,
            border: true,
            editable: {
                bind: "open",
                focus: "cust_cd",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr",
				                value: gw_com_api.getDate("", {month:-6}),
				                label: {
				                    title: "납기시작일 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    data: {
				                        memory: "MBOM등록_납기시작일"
				                    }
				                }
				            },
				            {
				                name: "ymd_to",
				                value: gw_com_api.getDate(""),
				                label: {
				                    title: "납기종료일"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    data: {
				                        memory: "MBOM등록_납기종료일"
				                    }
				                }
				            },
				            {
				                name: "prod_group",
				                label: {
				                    title: "제품군 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "MBOMList_제품군",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "cust_cd",
				                label: {
				                    title: "고객사코드 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "MBOMList_고객사",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
				                }
				            },
				            {
				                name: "실행",
				                value: "실행",
				                format: {
				                    type: "button"
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
            show: true,
            border: false,
            align: "left",
            editable: {
                bind: "open",
                //focus: "part_area",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "part_area",
				                label: {
				                    title: "분류 :"
				                },
				                editable: {
				                    type: "select",
				                    data: {
				                        memory: "MBOMList_분류",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
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
            targetid: "grdData_설계등록현황",
            query: "w_pdm410_M_1",
            title: "설계등록현황",
            height: "160",
            show: true,
            selectable: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 110,
				    align: "left"
				},
				{
				    header: "제품유형",
				    name: "prod_type",
				    width: 70,
				    align: "center"
				},
				{
				    header: "제품명",
				    name: "prod_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "구분",
				    name: "ord_class",
				    width: 70,
				    align: "center"
				},
				{
				    header: "Project No.",
				    name: "proj_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "영업",
				    name: "sale_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "설계",
				    name: "draw_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "구매",
				    name: "pur_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "생산",
				    name: "prod_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "기구",
				    name: "frame_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "전장",
				    name: "electric_stat",
				    width: 50,
				    align: "center"
				},
				{
				    header: "기구등록일",
				    name: "frame_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "전장등록일",
				    name: "electric_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
                {
                    name: "ord_no",
                    value: "",
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
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "PDM 불러오기 ",
				    value: "PDM 불러오기 ",
				    icon: "기타"
				},
				{
				    name: "Excel 불러오기 ",
				    value: "Excel 불러오기 ",
				    icon: "기타"
				},
				{
				    name: "구매의뢰",
				    value: "구매의뢰",
				    icon: "기타"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MBOMList",
            query: "w_pdm410_S_1",
            title: "MBOMList",
            height: "175",
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "part_area",
                validate: true
            },
            element: [
				{
				    header: "분류",
				    name: "part_area",
				    width: 50,
				    align: "center"
				},
				{
				    header: "조달구분",
				    name: "buy_type",
				    width: 50,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "MBOMList_조달구분"
				        }
				    }
				},
                {
		            header: "사용",
		            name: "use_yn",
		            width: 40,
		            align: "center",
		            format: {
		                type: "checkbox",
		                title: "",
		                value: "1",
		                offval: "0"
		            }
		        },
				{
				    header: "공정분류",
				    name: "mprc_class",
				    width: 70,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "MBOMList_공정분류"
				        }
				    }
				},
				{
				    header: "생산공정",
				    name: "mprc_cd",
				    width: 270,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "MBOMList_생산공정"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "MBOMList_생산공정"
				        }
				    }
				},
				{
				    header: "품목코드",
				    name: "part_cd",
				    width: 80,
				    align: "center"
				},
				{
				    header: "품목명",
				    name: "part_nm",
				    width: 250,
				    align: "left"
				},
				{
				    header: "품목규격",
				    name: "part_spec",
				    width: 250,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "part_unit",
				    width: 50,
				    align: "center"
				},
				{
				    header: "수량",
				    name: "part_qty",
				    width: 50,
				    align: "center"
				},
                {
                    header: "확정",
                    name: "core_yn",
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
				    header: "상태",
				    name: "pstat",
				    width: 40,
				    align: "center"
				},
				{
				    header: "상태비고",
				    name: "pmsg",
				    width: 200,
				    align: "center"
				},
                {
                    name: "ord_no",
                    value: "",
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
				    id: "grdData_설계등록현황",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_MBOMList",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);

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
    procedure: function() {

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
            targetid: "frmOption_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_1_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "part_area",
            event: "change",
            handler: change_frmOption_2_part_area
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_설계등록현황",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_설계등록현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_설계등록현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_설계등록현황
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
					    id: "frmOption_1"
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            if (!checkUpdatable())
                return false;

            var args = {
                targetid: "grdData_설계등록현황",
                edit: true,
                select: true,
                data: [
                    { name: "cust_nm", rule: "COPY", value: "" }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            var args = {
                targetid: "grdData_설계등록현황",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave();

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            if (!checkUpdatable())
                return false;

            var args = {
                ID: gw_com_api.v_Stream.msg_closePage
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_frmOption_1_실행(ui) {

            processRetrieve();

        }
        //----------
        function change_frmOption_2_part_area(ui) {

            processLink();

        }
        //----------
        function rowselecting_grdData_설계등록현황(ui) {

            //return checkUpdatable();
            return true;

        }
        //----------
        function rowselected_grdData_설계등록현황(ui) {

            processLink();

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
function processRetrieve() {

    var args = {
        source: {
            type: "FORM",
            id: "frmOption_1",
            hide: true,
            element: [
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
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
		            element: [{ name: "cust_cd" }]
		        },
		        {
		            element: [{ name: "prod_group" }]
		        },
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
			    id: "grdData_설계등록현황",
			    select: 1,
			    focus: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_MBOMList"
		    }
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink() {

    if (gw_com_api.getSelectedRow("grdData_설계등록현황") == null)
        return;
        
    var args = {
        source: {
            type: "INLINE",
            argument: [
                    { name: "arg_ord_no", value: gw_com_api.getValue("grdData_설계등록현황", "selected", "ord_no", true) },
                    { name: "arg_part_area", value: gw_com_api.getValue("frmOption_2", 1, "part_area") }
                ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_MBOMList"
			}
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function checkUpdatable() {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_MBOMList"
			}
		]
    };
    var updatable = gw_com_module.objUpdatable(args);
    if (updatable == "SAVE") {
        processSave();
        return false;
    }
    else
        return (updatable == "SKIP") ? true : false;

}
//----------
function processSave() {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_MBOMList"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) {
        return false;
    }

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_MBOMList"
			}
		],
        handler_success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response) {

    processRetrieve();

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//