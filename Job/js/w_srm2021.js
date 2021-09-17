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
                    type: "INLINE", name: "구분",
                    data: [
						{ title: "가능", value: "가능" },
						{ title: "취소", value: "취소" }
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "일괄생성",
				    value: "일괄생성",
				    icon: "기타"
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
				    value: "추가"
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
            targetid: "frmOption_1",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            show: true,
            border: true,
            editable: {
                focus: "pur_no",
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
                                    title: "요청번호 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 12,
                                    maxlength: 20
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "ymd_fr",
                                label: {
                                    title: "요청일자 :"
                                },
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10
                                }
                            },
				            {
				                name: "ymd_to",
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
                                name: "item_nm",
                                label: {
                                    title: "품목명 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 12,
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
            targetid: "frmOption_2",
            type: "FREE",
            title: "일괄 생성",
            trans: true,
            show: false,
            border: true,
            margin: 20,
            editable: {
                bind: "open",
                validate: true
            },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pur_no",
                                label: {
                                    title: "요청번호 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10,
                                    validate: {
                                        rule: "required",
                                        message: "요청번호"
                                    }
                                }
                            },
		     	            {
		     	                name: "ymd_yn",
		     	                label: {
		     	                    title: "납품가능일 지정 :"
		     	                },
		     	                editable: {
		     	                    type: "checkbox",
		     	                    value: "1",
		     	                    offval: "0"
		     	                }
		     	            },
                            {
                                name: "ymd",
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10,
                                    disable: true,
                                    validate: {
                                        rule: "required",
                                        message: "납품가능일"
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
            query: "w_srm2021_1",
            title: "현황",
            height: 261,
            show: true,
            dynamic: true,
            selectable: true,
            element: [
				{
				    header: "품번",
				    name: "item_cd",
				    width: 70,
				    align: "center"
				},
				{
				    header: "품명",
				    name: "item_nm",
				    width: 200,
				    align: "left"
				},
				{
				    header: "규격",
				    name: "spec",
				    width: 200,
				    align: "left"
				},
				{
				    header: "단위",
				    name: "ea",
				    width: 40,
				    align: "center"
				},
				{
				    header: "준수수량",
				    name: "obqty",
				    width: 60,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "미준수수량",
				    name: "dobqty",
				    width: 70,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "요청수량",
				    name: "pur_qty",
				    width: 60,
				    align: "center",
				    mask: "numeric-int"
				}/*,
				{
				    header: "단가",
				    name: "price",
				    width: 60,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "금액",
				    name: "amount",
				    width: 100,
				    align: "right",
				    mask: "numeric-float"
				},
				{
				    header: "화폐",
				    name: "currency",
				    width: 40,
				    align: "center"
				}*/,
				{
				    header: "납기요청일",
				    name: "dlv_rq_ymd",
				    width: 80,
				    align: "center",
				    mask: "date-ymd"
				},
				{
				    name: "pur_no",
				    hidden: true
				},
				{
				    name: "pur_seq",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_상세",
            query: "w_srm2021_2",
            title: "납기 상세 등록",
            caption: true,
            height: 92,
            pager: false,
            number: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "plan_date",
                multi: true,
                validate: true
            },
            element: [
				{
				    header: "상태",
				    name: "state",
				    width: 80,
				    align: "center"
				},
				{
				    header: "납품가능일",
				    name: "plan_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "text",
				        bind: "create",
				        validate: {
				            rule: "required",
				            message: "납품가능일"
				        }
				    }
				},
				{
				    header: "수량",
				    name: "plan_qty",
				    width: 80,
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
				    header: "구분",
				    name: "astat",
				    width: 80,
				    align: "center",
				    format: {
				        type: "select",
				        data: {
				            memory: "구분"
				        }
				    },
				    editable: {
				        type: "select",
				        data: {
				            memory: "구분"
				        }
				    }
				},
				{
				    header: "등록일시",
				    name: "reg_date",
				    width: 160,
				    align: "center"
				},
				{
				    header: "비고",
				    name: "rmk",
				    width: 400,
				    align: "left",
				    editable: { type: "text" }
				},
				{
				    name: "pur_no",
				    hidden: true,
				    editable: { type: "hidden" }
				},
				{
				    name: "pur_seq",
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
				    id: "grdData_현황",
				    offset: 8
				},
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
            element: "일괄생성",
            event: "click",
            handler: click_lyrMenu_1_일괄생성
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
            targetid: "frmOption_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_1_실행
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
            handler: click_frmOption_2_실행
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
            targetid: "frmOption_2",
            event: "itemchanged",
            handler: itemchanged_frmOption_2
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
            targetid: "grdData_상세",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_상세
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

            closeOption({ target: ["frmOption_2"] });
            var args = {
                target: [
					{
					    id: "frmOption_1",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_일괄생성(ui) {

            closeOption({ target: ["frmOption_1"] });
            var args = {
                target: [
					{
					    id: "frmOption_2",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});
            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_상세",
                edit: true,
                data: [
                    { name: "pur_no", value: gw_com_api.getValue("grdData_현황", "selected", "pur_no", true) },
                    { name: "pur_seq", value: gw_com_api.getValue("grdData_현황", "selected", "pur_seq", true) }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_상세",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_1_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_2_실행(ui) {

            v_global.process.handler = processBatch;

            if (!checkUpdatable({})) return false;

            checkBatchable({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function itemchanged_frmOption_2(ui) {

            switch (ui.element) {
                case "ymd_yn":
                    {
                        if (ui.value.current == "0") {
                            gw_com_api.disable("frmOption_2", "ymd");
                            gw_com_api.setValue(
                                "frmOption_2",
                                1,
                                "ymd",
                                (gw_com_api.getSelectedRow("grdData_현황") != null)
                                    ? gw_com_api.getValue("grdData_현황", "selected", "dlv_rq_ymd", true) : ""
                            );
                        }
                        else {
                            gw_com_api.enable("frmOption_2", "ymd");
                            gw_com_api.setFocus("frmOption_2", 1, "ymd");
                        }
                    }
                    break;
            }
            return true;

        }
        //----------
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            v_global.process.prev.master = ui.row;

            gw_com_api.setValue("frmOption_2", 1, "pur_no", gw_com_api.getValue("grdData_현황", ui.row, "pur_no", true));
            gw_com_api.setValue("frmOption_2", 1, "ymd", gw_com_api.getValue("grdData_현황", ui.row, "dlv_rq_ymd", true));
            processLink({});

        };
        //----------
        function itemchanged_grdData_상세(ui) {

            switch (ui.element) {
                case "plan_date":
                    {
                        if (gw_com_api.unMask(ui.value.current, "date-ymd")
                            > gw_com_api.unMask(gw_com_api.getValue("grdData_현황", "selected", "dlv_rq_ymd", true), "date-ymd"))
                            gw_com_api.setValue("grdData_상세", ui.row, "state", "지연", true);
                        else
                            gw_com_api.setValue("grdData_상세", ui.row, "state", "정상", true);
                    }
                    break;
            }

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption_1", 1, "pur_no", gw_com_api.getPageParameter("pur_no"));
            gw_com_api.setValue("frmOption_2", 1, "pur_no", gw_com_api.getPageParameter("pur_no"));
            //gw_com_api.setValue("frmOption_2", 1, "ymd", gw_com_api.getPageParameter("dlv_rq_ymd"));
            gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getPageParameter("pur_date"));
            gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getPageParameter("pur_date"));
            processRetrieve({});
        }

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

    if (gw_com_api.getSelectedRow("grdData_현황") == null) {
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
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkBatchable(param) {

    /*
    closeOption({});

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_2"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (gw_com_api.getValue("frmOption_2", 1, "ymd").length < 8) {
        gw_com_api.show("frmOption_2");
        gw_com_api.messageBox([
            { text: "유효한 날짜가 아닙니다." }
        ], 300);
        gw_com_api.setError(true, "frmOption_2", 1, "ymd", false, true);
        return false;
    }
    gw_com_api.setError(false, "frmOption_2", 1, "ymd", false, true);

    gw_com_api.messageBox([
            { text: "◈ 요청번호 : " + gw_com_api.getValue("frmOption_2", 1, "pur_no") + "<br>", align: "left", margin: 30 },
            { text: "◈ 납품가능일 : " + gw_com_api.Mask(gw_com_api.getValue("frmOption_2", 1, "ymd"), "date-ymd") + "<br><br>", align: "left", margin: 30 },
            { text: "일괄 생성 하시겠습니까?" }
    ], 320, gw_com_api.v_Message.msg_confirmBatch, "YESNO");
    */

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption_1"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var key = {
        KEY: [],
        QUERY: "w_srm2021_1"
    };
    if (param.key != undefined) {
        $.each(param.key, function () {
            for (var key_i = 0; key_i < this.KEY.length; key_i++) {
                if (this.KEY[key_i].NAME == "pur_no"
                    || this.KEY[key_i].NAME == "pur_seq") {
                    key.KEY.push({ NAME: this.KEY[key_i].NAME, VALUE: this.KEY[key_i].VALUE });
                }
            }
        });
        param.key.unshift(key);
    }    
    var args = {
        source: {
            type: "FORM",
            id: "frmOption_1",
            hide: true,
            element: [
                {
                    name: "pur_no",
                    argument: "arg_pur_no"
                },
				{
				    name: "ymd_fr",
				    argument: "arg_ymd_fr"
				},
				{
				    name: "ymd_to",
				    argument: "arg_ymd_to"
				},
				{
				    name: "item_nm",
				    argument: "arg_item_nm"
				}
			],
            argument: [
                {
                    name: "arg_supp_cd",
                    value: gw_com_module.v_Session.EMP_NO
                }
			],
            remark: [
                {
                    element: [{ name: "pur_no"}]
                },
	            {
	                infix: "~",
	                element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
	            },
                {
                    element: [{ name: "item_nm"}]
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
			    id: "grdData_상세"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

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
    /*
    var ids = gw_com_api.getRowIDs("grdData_상세");
    var sum = 0;
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_상세", this, "astat", true) != "취소")
            sum = sum + parseInt(gw_com_api.getValue("grdData_상세", this, "plan_qty", true));
    });
    if (sum > gw_com_api.getValue("grdData_현황", "selected", "pur_qty", true)) {
        gw_com_api.messageBox([
            { text: "◈ 납기 상세 등록<br><br>", align: "left", margin: 30 },
            { text: "[수량] 합계는 [PO수량]보다 작거나 같아야 합니다." }
        ]);
        return false;
    }
    */

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "sp_scmAutoAdd",
        nomessage: true,
        input: [
            { name: "asUserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "asType", value: "PLAN", type: "varchar" },
            { name: "asPurNo", value: gw_com_api.getValue("frmOption_2", this, "pur_no"), type: "varchar" },
            { name: "asChkDate", value: gw_com_api.getValue("frmOption_2", 1, "ymd_yn"), type: "varchar" },
            { name: "asDate", value: gw_com_api.getValue("frmOption_2", 1, "ymd"), type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" },
            { name: "retPurNo", type: "varchar" }
        ],
        handler: {
            success: successBatch
        }
    };
    gw_com_module.callProcedure(args);

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
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_현황"
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

    if (param.target != undefined) {
        $.each(param.target, function () {
            gw_com_api.hide(this);
        });
    }
    else {
        gw_com_api.hide("frmOption_1");
        gw_com_api.hide("frmOption_2");
    }

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function successBatch(response) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 350);

    if (response.VALUE[0] != -1) {
        var key = {
            KEY: [{
                NAME: "pur_no",
                VALUE: response.VALUE[2]
            }],
            QUERY: "w_srm2021_1"
        };
        processRetrieve({ key: [key] });
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
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