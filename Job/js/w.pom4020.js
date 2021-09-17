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
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				},
                {
                    type: "INLINE", name: "입고",
                    data: [
                        { title: "전체", value: "%" },
						{ title: "미입고", value: "0" },
						{ title: "입고완료", value: "1" }
					]
                }
            /*,
            {
            type: "PAGE", name: "협력사", query: "dddw_supp_pur"
            }
            */
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
                                name: "pur_no",
                                label: {
                                    title: "PO번호 : "
                                },
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 20
                                }
                            },
                            {
                                name: "proj_no",
                                label: {
                                    title: "Project No : "
                                },
                                mask: "search",
                                editable: {
                                    type: "text",
                                    size: 8,
                                    maxlength: 20
                                }
                            },
                            {
                                name: "item_cd",
                                label: {
                                    title: "품목코드 : "
                                },
                                editable: {
                                    type: "text",
                                    size: 10,
                                    maxlength: 20
                                }
                            },
                            {
                                name: "item_nm",
                                label: {
                                    title: "품명 : "
                                },
                                editable: {
                                    type: "text",
                                    size: 15,
                                    maxlength: 20
                                }
                            }
                        ]
                    },
                    {
                        element: [
				            {
				                style: {
				                    colfloat: "floating"
				                },
				                name: "fr_ymd",
				                label: {
				                    title: "PO일자 :"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
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
				                    maxlength: 10
				                }
				            },
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
				                name: "supp_nm",
				                label: {
				                    title: "협력사 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 12,
				                    maxlength: 20
				                    /*
				                    data: {
				                    memory: "협력사",
				                    unshift: [
				                    { title: "전체", value: "%" }
				                    ]
				                    }
				                    */
				                }
				            },
                            {
                                name: "rcvd",
                                label: {
                                    title: "입고 : "
                                },
                                value: "0",
                                editable: {
                                    type: "select",
                                    data: {
                                        memory: "입고"
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
            targetid: "grdData_현황",
            query: "w_pom4020_M_1",
            title: "발주 진행 현황",
            caption: true,
            height: 256,
            show: true,
            selectable: true,
            dynamic: true,
            color: {
                //row: true,
                element: ["req_qty", "planed_qty", "dlved_qty"]
            },
            element: [
                {
                    header: "Project No.",
                    name: "proj_no",
                    width: 80,
                    align: "center"
                },
				{
				    header: "협력사",
				    name: "supp_nm",
				    width: 150,
				    align: "left"
				},
				{
				    header: "PO일자",
				    name: "pur_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "PO번호",
				    name: "pur_no",
				    width: 80,
				    align: "center"
				},
				{
				    header: "품목코드",
				    name: "item_cd",
				    width: 95,
				    align: "center"
				},
				{
				    header: "품명",
				    name: "item_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "PO수량",
				    name: "pur_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "납품예정",
				    name: "planed_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "납품요청  ",
				    name: "req_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "검수확인",
				    name: "rcvd_yn",
				    width: 70,
				    align: "center"
				},
				{
				    header: "입고수량",
				    name: "dlved_qty",
				    width: 70,
				    align: "center"
				},
				{
				    header: "납품요청일",
				    name: "req_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "납품예정일",
				    name: "plan_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    header: "입고일자",
				    name: "dlv_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
                {
                    name: "pur_seq",
                    hidden: true
                },
                {
                    name: "color",
                    hidden: true
                }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_이력",
            query: "w_pom4020_S_1",
            title: "납품 예정 이력",
            caption: true,
            height: 86,
            pager: false,
            number: true,
            show: true,
            selectable: true,
            dynamic: true,
            element: [
                {
                    header: "납품요청일",
                    name: "req_date",
                    width: 80,
                    align: "center",
                    mask: "date-ymd"
                },
				{
				    header: "납품예정일",
				    name: "plan_date",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
                {
                    header: "단위",
                    name: "pur_unit",
                    width: 70,
                    align: "center"
                },
				{
				    header: "수량",
				    name: "plan_qty",
				    width: 70,
				    align: "center"
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrNotice",
            row: [
 				{
 				    name: "주석",
 				    color: "#800000"
 				}
			]
        };
        //----------
        gw_com_module.labelCreate(args);
        var args = {
            targetid: "lyrNotice",
            row: [
		        {
		            name: "주석",
		            value:
                        "▶ [납품예정]/[납품요청]/[입고수량] : '등록 수량 (입고 수량)' 으로 표시 / 검은 색 - '미입고' , 푸른 색 - '납품 예정일 지연' , 붉은 색 - '입고일 지연' 을 의미"
		        }
	        ]
        };
        gw_com_module.labelAssign(args);
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
				    id: "grdData_이력",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================
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
            targetid: "grdData_현황",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_현황
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

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
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "proj_no":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_proj_scm",
                            title: "Project 검색",
                            width: 650,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_proj_scm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProject_SCM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function rowselected_grdData_현황(ui) {

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getPageParameter("pur_date"));
            gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getPageParameter("pur_date"));
            gw_com_api.setValue("frmOption", 1, "pur_no", gw_com_api.getPageParameter("pur_no"));
            gw_com_api.setValue("frmOption", 1, "prod_group", gw_com_api.getPageParameter("prod_group"));
            //gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_api.getPageParameter("supp_nm"));
        }
        else {
            gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getDate("", { day: -15 }));
            gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getDate(""));
        }
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "")
            processRetrieve({});

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
                    name: "pur_no",
                    argument: "arg_pur_no"
                },
				{
				    name: "proj_no",
				    argument: "arg_proj_no"
				},
                {
                    name: "fr_ymd",
                    argument: "arg_fr_ymd"
                },
				{
				    name: "to_ymd",
				    argument: "arg_to_ymd"
				},
				{
				    name: "item_cd",
				    argument: "arg_item_cd"
				},
				{
				    name: "item_nm",
				    argument: "arg_item_nm"
				},
				{
				    name: "prod_group",
				    argument: "arg_prod_group"
				},
				{
				    name: "supp_nm",
				    argument: "arg_supp_nm"
				},
				{
				    name: "rcvd",
				    argument: "arg_rcvd"
				}
			],
            remark: [
                {
                    element: [{ name: "pur_no"}]
                },
		        {
		            element: [{ name: "proj_no"}]
		        },
			    {
			        infix: "~",
			        element: [
	                    { name: "fr_ymd" },
		                { name: "to_ymd" }
		            ]
			    },
		        {
		            element: [{ name: "item_cd"}]
		        },
		        {
		            element: [{ name: "item_nm"}]
		        },
		        {
		            element: [{ name: "prod_group"}]
		        },
		        {
		            element: [{ name: "supp_nm"}]
		        },
		        {
		            element: [{ name: "rcvd"}]
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
			    id: "grdData_이력"
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
            id: "grdData_현황",
            row: "selected",
            block: true,
            element: [
				{
				    name: "pur_no",
				    argument: "arg_pur_no"
				},
                {
                    name: "pur_seq",
                    argument: "arg_pur_seq"
                }
			]
        },
        target: [
	        {
	            type: "GRID",
	            id: "grdData_이력"
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
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_no",
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_nm",
			                        param.data.proj_nm,
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
                    case "w_find_proj_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
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