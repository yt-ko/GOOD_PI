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
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
            query: "w_mrp4010_M_1",
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
            query: "w_mrp4010_M_2",
            type: "TABLE",
            title: "자재 반출 내역",
            //caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "mout_date",
                validate: true
            },
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
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "반출일자"
                                    }
                                }
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
                                mask: "numeric-int",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "반출수량"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "관리번호",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mout_no",
                                editable: {
                                    type: "hidden"
                                }
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
                                name: "fr_proj_no",
                                mask: "search",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "Project(반출)"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "고객사(반출)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "fr_cust_nm",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "장비명(반출)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "fr_prod_nm",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
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
                                name: "to_proj_no",
                                mask: "search",
                                editable: {
                                    type: "text"/*,
                                    validate: {
                                        rule: "required",
                                        message: "Project(장착)"
                                    }*/
                                }
                            },
                            {
                                header: true,
                                value: "고객사(장착)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "to_cust_nm",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "장비명(장착)",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "to_prod_nm",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
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
                                name: "part_cd",
                                mask: "search",
                                editable: {
                                    type: "text",
                                    readonly: false,
                                    validate: {
                                        rule: "required",
                                        message: "반출품목코드"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "품목명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_nm",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "품목규격",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "part_spec",
                                display: true,
                                editable: {
                                    type: "hidden"
                                }
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
                                },
                                editable: {
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
                                name: "rqst_emp",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "요청자"
                                    }
                                }
                            },
                            {
                                header: true,
                                value: "반출담당",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "mout_emp",
                                editable: {
                                    type: "text",
                                    validate: {
                                        rule: "required",
                                        message: "반출담당"
                                    }
                                }
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
                                },
                                editable: {
                                    type: "text",
                                    width: 734
                                }/*,
                                format: {
                                    type: "textarea",
                                    rows: 3,
                                    width: 734
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 3,
                                    width: 734
                                }*/
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
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
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
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "to_prod_key",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "grdData_반입",
            query: "w_mrp4010_S_1",
            title: "자재 반입 내역",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "min_qty",
                validate: true
            },
            element: [
                {
                    header: "순번",
                    name: "min_seq",
                    width: 35,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
				{
				    header: "반입일자",
				    name: "min_date",
				    width: 92,
				    align: "center",
				    mask: "date-ymd",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "반입일자"
				        }
				    }
				},
				{
				    header: "수량",
				    name: "min_qty",
				    width: 50,
				    align: "center",
				    editable: {
				        type: "text",
				        validate: {
				            rule: "required",
				            message: "수량"
				        }
				    }
				},
				{
				    header: "반입담당",
				    name: "min_emp",
				    width: 70,
				    align: "center",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "반입내역",
				    name: "min_rmk",
				    width: 500,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "등록자",
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    name: "mout_no",
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
            targetid: "grdData_반출",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_반출
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
        //----------
        var args = {
            targetid: "frmData_반출",
            event: "itemdblclick",
            handler: itemdblclick_frmData_반출
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_반출",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_반출
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
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

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

            var args = {
                targetid: "grdData_반입",
                edit: true,
                data: [
                    { name: "min_seq", rule: "INCREMENT", value: 1 },
                    { name: "min_date", value: gw_com_api.getDate() }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;

            var args = {
                targetid: "grdData_반입",
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
        function rowselecting_grdData_반출(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_반출(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemdblclick_frmData_반출(ui) {

            switch (ui.element) {
                case "fr_proj_no":
                case "to_proj_no":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_prod_mrp",
                            title: "장비 검색",
                            width: 800,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_prod_mrp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProduct_MRP
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "part_cd":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_part_mrp",
                            title: "품목 검색",
                            width: 800,
                            height: 500,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_part_mrp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectPart_MRP
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_반출");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
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
                type: "FORM",
                id: "frmData_반출"
            },
			{
			    type: "GRID",
			    id: "grdData_반입"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

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

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "w_mrp4010_M_2")
                this.QUERY = "w_mrp4010_M_1";
        });
    }
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
function processSelect(param) {

    gw_com_api.selectRow("grdData_반출", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_반출", "reset");
    var args = {
        targetid: "frmData_반출",
        edit: true,
        updatable: true,
        data: [
            { name: "mout_date", value: gw_com_api.getDate() },
            { name: "mout_qty", value: "1" }
        ],
        clear: [
		    {
		        type: "GRID",
		        id: "grdData_반입"
		    }
	    ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_반출",
        row: "selected",
        clear: [
            {
                type: "FORM",
                id: "frmData_반출"
            },
            {
                type: "GRID",
                id: "grdData_반입"
            }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_반출"
            },
			{
			    type: "GRID",
			    id: "grdData_반입"
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
function processRemove(param) {

    var args = {
        target: [
		    {
		        type: "GRID",
		        id: "grdData_반출",
		        key: [
		            {
		                row: "selected",
		                element: [
		                    { name: "mout_no" }
		                ]
		            }
		        ]
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_반출"
            },
            {
                type: "GRID",
                id: "grdData_반입"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_반출"
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

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_MRP:
            {
                if (v_global.event.element == "fr_proj_no") {
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "fr_proj_no",
			                            param.data.proj_no,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "fr_cust_nm",
			                            param.data.cust_nm +
                                        " - " + param.data.cust_prod_nm,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "fr_prod_nm",
			                            param.data.prod_nm,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "fr_prod_key",
			                            param.data.prod_key,
			                            (v_global.event.type == "GRID") ? true : false);
                }
                else {
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "to_proj_no",
			                            param.data.proj_no,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "to_cust_nm",
			                            param.data.cust_nm +
                                        " - " + param.data.cust_prod_nm,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "to_prod_nm",
			                            param.data.prod_nm,
			                            (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
			                            v_global.event.row,
			                            "to_prod_key",
			                            param.data.prod_key,
			                            (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_MRP:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "part_cd",
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
                    case "w_find_prod_mrp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_MRP;
                        }
                        break;
                    case "w_find_part_mrp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_MRP;
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