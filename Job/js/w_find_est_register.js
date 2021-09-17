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
                    type: "INLINE", name: "외주구분",
                    data: [
				        { title: "전체", value: "%" },
						{ title: "없음", value: "0" },
						{ title: "외주", value: "1" }
					]
                },
				{
				    type: "INLINE", name: "제출승인",
				    data: [
				        { title: "없음", value: "0" },
						{ title: "구두승인", value: "1" },
						{ title: "결재승인", value: "2" }
					]
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
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
            targetid: "frmData_정보",
            query: "w_find_est_register_M_1",
            type: "TABLE",
            title: "견적 정보",
            caption: true,
            show: true,
            selectable: true,
            content: {
                width: {
                    label: 90,
                    field: 180
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true, value: "견적명", format: { type: "label" }
                            },
                            {
                                name: "est_nm"
                            },
                            {
                                header: true, value: "고객사", format: { type: "label" }
                            },
                            {
                                name: "cust_nm"
                            },
                            {
                                header: true, value: "차수", format: { type: "label" }
                            },
                            {
                                name: "revision_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "고객분류", format: { type: "label" }
                            },
                            {
                                style: { colspan: 3 },
                                name: "stats_class_nm"
                            },
                            {
                                header: true, value: "외주유무", format: { type: "label" }
                            },
                            {
                                name: "out_yn",
                                value: "외주",
                                format: {
                                    type: "checkbox",
                                    title: "외주",
                                    value: "1"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "제출담당자", format: { type: "label" }
                            },
                            {
                                name: "submit_empnm"
                            },
                            {
                                header: true, value: "제출승인", format: { type: "label" }
                            },
						    {
						        name: "submit_sign_div",
						        editable: {
						            type: "select",
						            data: {
						                memory: "제출승인"
						            }
						        }
						    },
                            {
                                header: true, value: "제출일자", format: { type: "label" }
                            },
                            {
                                name: "submit_dt",
                                mask: "date-ymd"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "견적유형", format: { type: "label" }
                            },
                            {
                                name: "est_type_nm"
                            },
                            {
                                header: true, value: "진행상태", format: { type: "label" }
                            },
                            {
                                name: "est_stat_nm"
                            },
                            {
                                header: true, value: "수주결과", format: { type: "label" }
                            },
                            {
                                name: "order_result_nm"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "견적금액", format: { type: "label" }
                            },
                            {
                                name: "est_amt",
                                mask: "currency-float"
                            },
                            {
                                header: true, value: "NEGO금액", format: { type: "label" }
                            },
                            {
                                name: "nego_amt",
                                mask: "currency-float"
                            },
                            {
                                header: true, value: "최종NEGO금액", format: { type: "label" }
                            },
                            {
                                name: "final_amt",
                                mask: "currency-float"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "수주금액", format: { type: "label" }
                            },
                            {
                                name: "order_amt",
                                mask: "currency-float"
                            },
                            {
                                header: true, value: "수주율(%)", format: { type: "label" }
                            },
                            {
                                name: "order_rate",
                                mask: "numeric-float"
                            },
                            {
                                header: true, value: "생산의뢰번호", format: { type: "label" }
                            },
                            {
                                name: "proj_no"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "비고", format: { type: "label" }
                            },
                            {
                                style: { colspan: 5 },
                                name: "rmk",
                                format: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 784
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                style: { colspan: 6 }, value: "기준정보", format: { type: "caption" }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "용도구분", format: { type: "label" }
                            },
						    {
						        style: {
						            colspan: 3
						        },
						        name: "use_div_nm"
						    },
						    {
                                header: true, value: "환율기준일", format: { type: "label" }
                            },
                            {
                                name: "exchange_dt",
                                mask: "date-ymd"
                            }                            
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "관리비(%)", format: { type: "label" }
                            },
                            {
                                name: "manage_rate",
                                mask: "numeric-float"
                            },
                            {
                                header: true, value: "물류비(%)", format: { type: "label" }
                            },
                            {
                                name: "distribution_rate",
                                mask: "numeric-float"
                            },
                            {
                                header: true, value: "환율(￥)", format: { type: "label" }
                            },
                            {
                                name: "exchange_2",
                                mask: "numeric-float"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true, value: "이윤(%)", format: { type: "label" }
                            },
                            {
                                name: "profit_rate",
                                mask: "numeric-float"
                            },
                            {
                                header: true, value: "통관비(%)", format: { type: "label" }
                            },
                            {
                                name: "duty_rate",
                                mask: "numeric-float"
                            },
                            {
                                header: true, value: "환율(￥)", format: { type: "label" }
                            },
                            {
                                name: "exchange_2",
                                mask: "numeric-float"
                            },
            				{
            				    name: "revision",
            				    hidden: true
            				},
            				{
            				    name: "est_key",
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
            targetid: "lyrRemark",
            row: [
 				{
 				    name: "견적"
 				}
			]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "FORM",
				    id: "frmData_정보",
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
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
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
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_est_key", value: param.key },
                { name: "arg_revision", value: param.seq }
            ]
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_정보"
			}
		]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_infoEstimate:
            {
                processRetrieve({
                    key: param.data.est_key,
                    seq: param.data.revision
                });
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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//