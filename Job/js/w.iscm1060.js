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
                },
                {
                    type: "PAGE", name: "고객사", query: "dddw_cust"
                },
                {
                    type: "PAGE", name: "진행상태", query: "dddw_forcast_pstat"
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
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "추가",
				    value: "추가"
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
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: true,
            border: true,
            margin: 90,
            editable: {
                bind: "open",
                focus: "year",
                validate: true
            },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
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
				                    },
				                    remark: {
				                        title: "고객사 :"
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
				                    },
				                    remark: {
				                        title: "제품유형 :"
				                    }
				                }
				            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "fr_ym",
                                label: {
                                    title: "예측기간 :"
                                },
                                mask: "date-ym",
                                editable: {
                                    type: "text",
                                    size: 5,
                                    maxlength: 7
                                }
                            },
				            {
				                name: "to_ym",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ym",
				                editable: {
				                    type: "text",
				                    size: 5,
				                    maxlength: 7
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
            targetid: "grdData_집계",
            query: "w_iscm1060_M_1",
            title: "고객사 및 제품 유형별 집계",
            caption: true,
            width: 357,
            height: 417,
            show: true,
            selectable: true,
            element: [
				{
				    header: "고객사",
				    name: "cust_nm",
				    width: 60,
				    align: "center"
				},
				{
				    header: "제품유형",
				    name: "prod_type_nm",
				    width: 100,
				    align: "center"
				},
				{
				    header: "년간예측수량",
				    name: "year_sum",
				    width: 80,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "진행중수량",
				    name: "proc_sum",
				    width: 80,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    name: "cust_cd",
				    hidden: true
				},
				{
				    name: "prod_type",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_상세",
            query: "w_iscm1060_S_1",
            title: "월별 수요 예측",
            caption: true,
            height: 440,
            pager: false,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "_edit_yn",
                focus: "dlv_qty",
                validate: true
            },
            element: [
				{
				    header: "예측년월",
				    name: "dlv_ym",
				    width: 70,
				    align: "center",
				    mask: "date-ym",
				    editable: {
				        type: "hidden",
				        validate: {
				            rule: "required",
				            message: "예측년월"
				        }
				    }
				},
				{
				    header: "예측수량",
				    name: "dlv_qty",
				    width: 80,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "예측수량"
				        }
				    }
				},
				{
				    header: "진행상태",
				    name: "pstat",
				    width: 90,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "진행상태"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "진행상태"
				        }
				    }
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
				    name: "_edit_yn",
				    hidden: true
				},
				{
				    name: "dlv_ymd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "cust_cd",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "prod_type",
				    hidden: true,
				    editable: { type: "hidden" }
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
				    id: "grdData_상세",
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
        //----------

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
            element: "추가",
            event: "click",
            handler: click_lyrMenu_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_저장
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
            targetid: "grdData_집계",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_집계
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_집계",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_집계
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
        //----------
        function click_lyrMenu_추가(ui) {

            if (!checkManipulate()) return false;

            gw_com_api.block("grdData_상세");
            var fr_yy = parseInt(v_global.logic.fr_ym.substr(0, 4), 10);
            var fr_mm = parseInt(v_global.logic.fr_ym.substr(4, 2), 10);
            var to_yy = parseInt(v_global.logic.to_ym.substr(0, 4), 10);
            var to_mm = parseInt(v_global.logic.to_ym.substr(4, 2), 10);
            if (gw_com_api.getRowCount("grdData_상세") <= 0) {
                for (var yy = fr_yy; yy <= to_yy; yy++) {
                    for (var mm = ((yy == fr_yy) ? fr_mm : 1); mm <= ((yy == to_yy) ? to_mm : 12); mm++) {
                        var args = {
                            targetid: "grdData_상세",
                            record: true,
                            edit: true,
                            updatable: true,
                            data: [
                                { name: "dlv_ym", value: yy + gw_com_api.prefixNumber(mm, 2) },
                                { name: "dlv_qty", value: "0" },
                                { name: "dlv_ymd", value: yy + gw_com_api.prefixNumber(mm, 2) + '01' },
                            ],
                            noblock: true
                        };
                        gw_com_module.gridInsert(args);
                    }
                }
                return true;
            }
            data_ym = gw_com_api.getValue("grdData_상세", 1, "dlv_ym", true);
            var data_yy = parseInt(data_ym.substr(0, 4), 10);
            var data_mm = parseInt(data_ym.substr(4, 2), 10);
            if (fr_yy < data_yy || (fr_yy == data_yy && fr_mm < data_mm)) {
                for (var yy = data_yy; yy >= fr_yy; yy--) {
                    for (var mm = ((yy == data_yy) ? data_mm - 1 : 12); mm >= ((yy == fr_yy) ? fr_mm : 1); mm--) {
                        var args = {
                            targetid: "grdData_상세",
                            record: true,
                            edit: true,
                            updatable: true,
                            where: {
                                type: "first"
                            },
                            data: [
                                { name: "dlv_ym", value: yy + gw_com_api.prefixNumber(mm, 2) },
                                { name: "dlv_qty", value: "0" },
                                { name: "dlv_ymd", value: yy + gw_com_api.prefixNumber(mm, 2) + '01' },
                            ],
                            noblock: true
                        };
                        gw_com_module.gridInsert(args);
                    }
                }
            }
            var data_ym = v_global.logic.fr_ym;
            data_ym = gw_com_api.getValue("grdData_상세", gw_com_api.getLastRow("grdData_상세"), "dlv_ym", true);
            var data_yy = parseInt(data_ym.substr(0, 4), 10);
            var data_mm = parseInt(data_ym.substr(4, 2), 10);
            if (to_yy > data_yy || (to_yy == data_yy && to_mm > data_mm)) {
                for (var yy = data_yy; yy <= to_yy; yy++) {
                    for (var mm = ((yy == data_yy) ? data_mm + 1 : 1); mm <= ((yy == to_yy) ? to_mm : 12); mm++) {
                        var args = {
                            targetid: "grdData_상세",
                            record: true,
                            edit: true,
                            updatable: true,
                            data: [
                                { name: "dlv_ym", value: yy + gw_com_api.prefixNumber(mm, 2) },
                                { name: "dlv_qty", value: "0" },
                                { name: "dlv_ymd", value: yy + gw_com_api.prefixNumber(mm, 2) + '01' },
                            ],
                            noblock: true
                        };
                        gw_com_module.gridInsert(args);
                    }
                }
            }
            gw_com_api.unblock("grdData_상세");

        }
        //----------
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_집계(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_집계(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "fr_ym", gw_com_api.getYM("", { month: 4 }));
        gw_com_api.setValue("frmOption", 1, "to_ym", gw_com_api.getYM("", { month: 16 }));
        v_global.logic.fr_ym = gw_com_api.getValue("frmOption", 1, "fr_ym");
        v_global.logic.to_ym = gw_com_api.getValue("frmOption", 1, "to_ym");
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
function checkManipulate(param) {

    closeOption({});

    if (gw_com_api.getSelectedRow("grdData_집계") == null) {
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
                id: "grdData_상세"
            }
		],
        param: param
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
	    processClear({ master: true });
	    return false;
	}

    v_global.logic.fr_ym = gw_com_api.getValue("frmOption", 1, "fr_ym");
    v_global.logic.to_ym = gw_com_api.getValue("frmOption", 1, "to_ym");

    var key = {
        KEY: [],
        QUERY: "w_iscm1060_M_1"
    };
    if (param.key != undefined) {
        $.each(param.key, function () {
            for (var key_i = 0; key_i < this.KEY.length; key_i++) {
                if (this.KEY[key_i].NAME == "cust_cd"
                    || this.KEY[key_i].NAME == "prod_type") {
                    key.KEY.push({ NAME: this.KEY[key_i].NAME, VALUE: this.KEY[key_i].VALUE });
                }
            }
        });
        param.key.unshift(key);
    }    
    var args = {
        source: {
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
				{
				    name: "cust_cd",
				    argument: "arg_cust_cd"
				},
				{
				    name: "prod_type",
				    argument: "arg_prod_type"
				},
				{
				    name: "fr_ym",
				    argument: "arg_fr_ym"
				},
				{
				    name: "to_ym",
				    argument: "arg_to_ym"
				}
			],
            remark: [
	            {
	                infix: "~",
	                element: [
	                    { name: "fr_ym" },
		                { name: "to_ym" }
		            ]
	            }
		    ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_집계",
			    select: true
			}
		],
        clear: [
			{
			    type: "GRID",
			    id: "grdData_상세"
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
            id: "grdData_집계",
            row: "selected",
            block: true,
            element: [
		        {
		            name: "prod_type",
		            argument: "arg_prod_type"
		        },
                {
                    name: "cust_cd",
                    argument: "arg_cust_cd"
                }
	        ],
            argument: [
                { name: "arg_fr_ym", value: gw_com_api.getValue("frmOption", 1, "fr_ym") },
                { name: "arg_to_ym", value: gw_com_api.getValue("frmOption", 1, "to_ym") }
            ]
        },
        target: [
			{
			    type: "GRID",
			    id: "grdData_상세",
			    select: true
			}
		],
		key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_집계", v_global.process.current.master, true, false);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_상세"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
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
                id: "grdData_상세"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({
            type: "GRID",
            id: "grdData_집계"
        });
    }
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//