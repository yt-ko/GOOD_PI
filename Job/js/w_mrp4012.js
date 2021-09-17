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
            border: true,
            show: true,
            editable: {
                focus: "fr_ymd",
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
                                name: "fr_ymd",
                                label: {
                                    title: "반출일자 :"
                                },
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "반출일자"
                                    }
                                }
                            },
				            {
				                name: "to_ymd",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10,
				                    validate: {
				                        rule: "required",
				                        message: "반출일자"
				                    }
				                }
				            },
				            {
				                name: "proj_no",
				                label: {
				                    title: "Project No :"
				                },
				                editable: {
				                    type: "text",
				                    size: 8,
				                    maxlength: 20
				                }
                            },
				            {
				                name: "part_cd",
				                label: {
				                    title: "품목코드 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 10,
				                    maxlength: 20
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
            targetid: "grdData_반출",
            query: "w_mrp4012_M_1",
            title: "자재 반출 내역",
            caption: true,
            height: 147,
            dynamic: true,
            show: true,
            selectable: true,
            element: [
				{
				    header: "관리번호",
				    name: "mout_no",
				    width: 90,
				    align: "center"
				},
                {
                    header: "반출일자",
                    name: "mout_date",
                    width: 80,
                    align: "center",
                    mask: "date-ymd"
                },
				{
				    header: "반출장비",
				    name: "fr_prod_nm",
				    width: 200,
				    align: "left"
				},
                {
                    header: "Project No.",
                    name: "fr_proj_no",
                    width: 80,
                    align: "center"
                },
                {
                    header: "품목코드",
                    name: "part_cd",
                    width: 100,
                    align: "center"
                },
                {
                    header: "품목명",
                    name: "part_nm",
                    width: 200,
                    align: "left"
                },
                {
                    header: "수량",
                    name: "mout_qty",
                    width: 50,
                    align: "center",
                    mask: "numeric-int"
                },
                {
                    header: "구매여부",
                    name: "pur_yn",
                    width: 60,
                    align: "center"
                },
                {
                    header: "요청자",
                    name: "rqst_emp",
                    width: 70,
                    align: "center"
                },
                {
                    header: "반출담당",
                    name: "mout_emp",
                    width: 70,
                    align: "center"
                },
                {
                    header: "입고예정일",
                    name: "rcvplan_date",
                    width: 80,
                    align: "center",
                    mask: "date-ymd"
                },
                {
                    header: "반입",
                    name: "min_qty",
                    width: 50,
                    align: "center",
                    mask: "numeric-int"
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_반출",
            query: "w_mrp4012_M_2",
            type: "TABLE",
            title: "자재 반출 내역",
            //caption: true,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 80,
                    field: 220
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "반출일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mout_date",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "반출수량",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mout_qty",
                                mask: "numeric-int"
                            },
                            {
                                header: true,
                                value: "관리번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mout_no"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "Project(반출)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "fr_proj_no"
                            },
                            {
                                header: true,
                                value: "고객사(반출)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "fr_cust_nm"
                            },
                            {
                                header: true,
                                value: "장비명(반출)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "fr_prod_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "Project(장착)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "to_proj_no"
                            },
                            {
                                header: true,
                                value: "고객사(장착)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "to_cust_nm"
                            },
                            {
                                header: true,
                                value: "장비명(장착)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "to_prod_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "반출품목코드",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_cd"
                            },
                            {
                                header: true,
                                value: "품목명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_nm"
                            },
                            {
                                header: true,
                                value: "품목규격",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_spec"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "구매여부",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pur_yn",
                                format: {
                                    type: "checkbox",
                                    title: "구매",
                                    value: "1",
                                    offval: "0"
                                }
                            },
                            {
                                header: true,
                                value: "요청자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rqst_emp"
                            },
                            {
                                header: true,
                                value: "반출담당",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mout_emp"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "반출내역",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "mout_rmk",
                                format: {
                                    type: "text",
                                    width: 734
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "입고예정일",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rcvplan_date",
                                mask: "date-ymd"
                            },
                            {
                                header: true,
                                value: "등록자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "upd_usr"
                            },
                            {
                                header: true,
                                value: "등록일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 1
                                },
                                name: "upd_dt"
                            },
                            {
                                name: "fr_prod_key",
                                hidden: true
                            },
                            {
                                name: "to_prod_key",
                                hidden: true
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
            targetid: "grdData_반입",
            query: "w_mrp4012_S_1",
            title: "자재 반입 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
                {
                    header: "순번",
                    name: "min_seq",
                    width: 35,
                    align: "center"
                },
				{
				    header: "반입일자",
				    name: "min_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "수량",
				    name: "min_qty",
				    width: 50,
				    align: "center"
				},
				{
				    header: "반입담당",
				    name: "min_emp",
				    width: 70,
				    align: "center"
				},
				{
				    header: "반입내역",
				    name: "min_rmk",
				    width: 500,
				    align: "left"
				},
				{
				    header: "등록자",
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    name: "mout_no",
				    hidden: true
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
				    id: "grdData_반출",
				    offset: 8
				},
				{
				    type: "FORM",
				    id: "frmData_반출",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_반입",
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
            targetid: "grdData_반출",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_반출
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

            closeOption({});

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
        function rowselected_grdData_반출(ui) {

            closeOption({});

            processLink({});

        };
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getDate(""));
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
                    name: "fr_ymd",
                    argument: "arg_fr_ymd"
                },
				{
				    name: "to_ymd",
				    argument: "arg_to_ymd"
				},
				{
				    name: "proj_no",
				    argument: "arg_proj_no"
				},
				{
				    name: "part_cd",
				    argument: "arg_part_cd"
				}
			],
			remark: [
                {
                    infix: "~",
                    element: [
	                    { name: "fr_ymd" },
		                { name: "to_ymd" }
		            ]
                },
		        {
		            element: [{ name: "proj_no"}]
		        },
		        {
		            element: [{ name: "part_cd"}]
		        }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_반출",
			    select: true
			}
		],
        clear: [
		    {
		        type: "FORM",
		        id: "frmData_반출"
		    },
		    {
		        type: "GRID",
		        id: "grdData_반입"
		    }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID",
            id: "grdData_반출",
            row: "selected",
            block: true,
            element: [
				{
				    name: "mout_no",
				    argument: "arg_mout_no"
				}
			]
        },
        target: [
            {
                type: "FORM",
                id: "frmData_반출"
            },
            {
                type: "GRID",
                id: "grdData_반입"
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
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//