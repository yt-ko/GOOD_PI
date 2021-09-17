
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        start();

        //----------
        function start() {

            gw_job_process.UI();

        }

    },
    //#endregion

        // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 저장, 추가
        //var args = { targetid: "lyrMenu_1", type: "FREE",
        //    element: [
		//		{ name: "추가", value: "추가", hidden: true }
		//	]
        //};
        //gw_com_module.buttonMenu(args);

        //==== Sub Menu : 추가, 삭제
        var args = { targetid: "lyrMenu_2", type: "FREE", hidden: true,
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Main Form : 
        var args = { targetid: "frmData_정보", query: "w_eccb5020_M_1", type: "TABLE", title: "심의 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: { width: { label: 100, field: 190 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "심의번호", format: { type: "label"} },
                        { name: "eccb_no", editable: { type: "hidden"} },
                        { header: true, value: "심의일자", format: { type: "label"} },
                        { name: "meet_dt", editable: { type: "hidden"}, mask: "date-ymd" },
                        { header: true, value: "주관부서", format: { type: "label"} },
                        { name: "mng_dept", editable: { type: "hidden"} }
	                    ]
                    },
                    { element: [
                        { header: true, value: "제목", format: { type: "label"} },
                        { name: "meet_title", style: { colspan: 5 }, format: { width: 800 }, editable: { type: "hidden"} }
	                    ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_안건", query: "w_eccb5020_S_1", title: "평가 안건", caption: true,
            height: "100%", pager: false, show: true, selectable: true,
            editable: { master: true, multi: true, bind: "select", validate: true },
            element: [
				{ header: "ECR No.", name: "ecr_no", width: 100, align: "center", editable: { type: "hidden" } },
				{ header: "개선제안명", name: "ecr_title", width: 350, align: "left" },
                { header: "ECO No.", name: "eco_no", width: 100, align: "center", editable: { type: "hidden" } },
				{ header: "제안자", name: "ecr_emp", width: 70, align: "center" },
				{ header: "제안일자", name: "ecr_dt", width: 80, align: "center", mask: "date-ymd" },
				{ header: "평가점수", name: "evl_point", hidden: true, editable: { type: "hidden" } },
				{ header: "평가등급", name: "evl_grade", hidden: true, editable: { type: "hidden" } },
				{ name: "evl_no", hidden: true, editable: { type: "hidden" } },
				{ name: "root_no", hidden: true, editable: { type: "hidden" } },
				{ name: "root_seq", hidden: true, editable: { type: "hidden" } },
				{ name: "cip_no", hidden: true, editable: { type: "hidden" } },
				{ header: "평가일자", name: "evl_date", hidden: true, editable: { type: "hidden" } },
				{ name: "pstat", hidden: true, editable: { type: "hidden" } },
				{ name: "pdate", hidden: true, editable: { type: "hidden" } },
				{ name: "evl_rmk", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_평가", query: "w_eccb5020_S_2", title: "제안 평가", caption: true,
            width: 700,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
            editable: {
                master: true,
                multi: true,
                bind: "select",
                focus: "evl_point",
                validate: true
            },
            element: [
				{
				    header: "항목",
				    name: "item_nm",
				    width: 194,
				    align: "left"
				},
				{
				    header: "유형",
				    name: "item_tp",
				    width: 80,
				    align: "center",
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    header: "배점",
				    name: "item_point",
				    width: 60,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "점수",
				    name: "evl_point",
				    width: 60,
				    align: "center",
				    mask: "numeric-int",
				    editable: {
				        type: "text"
				    }
				},
				{ header: "비고", name: "evl_rmk", width: 200, align: "left", editable: { type: "text" } },
                { name: "item_no", hidden: true, editable: { type: "hidden" } },
                { name: "item_seq", hidden: true, editable: { type: "hidden" } },
                { name: "app_point", hidden: true, editable: { type: "hidden" } },
                { name: "evl_no", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_기준", query: "w_eccb5020_D_1", title: "배점 기준", caption: true,
            width: 207,
            height: "100%",
            pager: false,
            show: true,
            selectable: true,
            element: [
				{
				    header: "기준",
				    name: "level_desc",
				    width: 150,
				    align: "left"
				},
				{
				    header: "하한치",
				    name: "min_point",
				    width: 80,
				    align: "center",
				    mask: "numeric-int"
				},
				{
				    header: "상한치",
				    name: "max_point",
				    width: 80,
				    align: "center",
				    mask: "numeric-int"
				},
                { name: "levle_nm", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_설명", query: "w_eccb5020_D_2", title: "항목 설명", caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
            element: [
				{ header: "평가항목", name: "item_nm", width: 150, align: "left" },
				{ header: "구분", name: "item_tp", width: 80, align: "center" },
				{ header: "항목설명", name: "item_rmk", width: 600, align: "left" }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                {
                    type: "FORM",
                    id: "frmData_정보",
                    offset: 8
                },
				{
				    type: "GRID",
				    id: "grdData_안건",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_기준",
				    offset: 8
				},
                {
                    type: "GRID",
                    id: "grdData_설명",
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
            targetid: "lyrMenu_2",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_2_저장
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
            targetid: "grdData_안건",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_안건
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_안건",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_안건
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_평가",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_평가
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_2_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_2_상세(ui) {

            if (!checkManipulate({})) return;
            if (!checkManipulate({ sub: true })) return;

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            processInsert({ sub: true });

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = { targetid: "grdData_안건", row: "selected" }
            gw_com_module.gridDelete(args);

        }
        //----------
        function rowselecting_grdData_안건(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_안건(ui) {

            processLink({ sub: true });

        };
        //----------
        function rowselected_grdData_평가(ui) {

            v_global.process.prev.master = ui.row;

            processLink({ detail: true });

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            v_global.logic.key = gw_com_api.getPageParameter("eccb_no");
            processRetrieve({ key: v_global.logic.key });
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
function checkCRUD(param) {

    if (param.sub) {
        if (checkEditable({}))
            return gw_com_api.getCRUD("grdData_안건", "selected", true);
        else
            return ((gw_com_api.getSelectedRow("grdData_안건") == null) ? false : true);
    }
    else return gw_com_api.getCRUD("frmData_정보");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: (param.sub) ? "선택된 내역이 없습니다." : "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_안건"
            },
            {
                type: "GRID",
                id: "grdData_평가"
            }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_eccb_no", value: param.key }
            ]
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_정보"
			},
            {
                type: "GRID",
                id: "grdData_안건",
                select: true
            }
		],
        clear: [
            {
                type: "GRID",
                id: "grdData_평가"
            },
			{
			    type: "GRID",
			    id: "grdData_기준"
			},
			{
			    type: "GRID",
			    id: "grdData_설명"
			}
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        key: param.key
    };
    if (param.detail)
        args = {
            source: {
                type: "GRID",
                id: "grdData_평가",
                row: "selected",
                block: true,
                element: [
		            { name: "item_no", argument: "arg_item_no" }
	            ]
            },
            target: [
	            {
	                type: "GRID",
	                id: "grdData_기준"
	            }
            ]
        };
    else if (param.sub)
        args = {
            source: {
                type: "GRID",
                id: "grdData_안건",
                row: "selected",
                block: true,
                element: [
		            {
		                name: "evl_no",
		                argument: "arg_evl_no"
		            }
	            ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_평가",
                    select: true
                },
			    {
			        type: "GRID",
			        id: "grdData_설명"
			    }
		    ]
        };
    else
        return;
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_안건", v_global.process.current.sub, true, false);

}
//----------
function processInsert(param) {

	if ( param.sub ) {
		var args = { type: "PAGE", page: "w_find_evl_item", title: "평가대상 선택", width: 850, height: 450, open: true };
		if ( gw_com_module.dialoguePrepare( args ) == false ) {
			var args = {
				page: "w_find_evl_item",
				param: {
					ID: gw_com_api.v_Stream.msg_selectEVLItem
				}
			};
			gw_com_module.dialogueOpen( args );
		}
	}
	else if ( param.detail ) {	//안건 추가 후 하위 data 조회
		var args = {
			source: { type: "INLINE",
				argument: [
                    { name: "arg_evl_no", value: param.key }
				]
			},
			target: [
                { type: "GRID", id: "grdData_평가", select: true },
			    { type: "GRID", id: "grdData_설명" }
			]
		};
		gw_com_module.objRetrieve( args );
	}
	else retrun;

}
//----------
function processSave(param) {

    var args = { url: "COM",
        target: [
            {
                type: "GRID",
                id: "grdData_안건"
            },
            {
                type: "GRID",
                id: "grdData_평가"
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
                id: "grdData_안건"
            },
            {
                type: "GRID",
                id: "grdData_평가"
            },
            {
                type: "GRID",
                id: "grdData_기준"
            },
            {
                type: "GRID",
                id: "grdData_설명"
            }
        ]
    };
    if (param.master)
        args.target.push({
            type: "FORM",
            id: "frmData_정보"
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

    processRetrieve({ key: v_global.logic.key });

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
        case gw_com_api.v_Stream.msg_selectedEVLItem:
            {
                var args = { targetid: "grdData_안건", edit: true, updatable: true,
                    data: [
                        { name: "evl_no", value: param.data.eco_no },
                        { name: "root_no", value: gw_com_api.getValue("frmData_정보", 1, "eccb_no") },
                        { name: "ecr_no", value: param.data.ecr_no },
                        { name: "cip_no", value: param.data.cip_no },
                        { name: "eco_no", value: param.data.eco_no },
                        { name: "ecr_title", value: param.data.ecr_title },
                        { name: "ecr_dt", value: param.data.ecr_dt },
                        { name: "ecr_emp", value: param.data.ecr_emp }
                    ]
                };
                var row = gw_com_module.gridInsert(args);
                processInsert({ detail: true, key: param.data.eco_no });
                gw_com_api.selectRow("grdData_안건", row, true, false);
                closeDialogue({ page: param.from.page });
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
                    case "w_find_evl_item":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEVLItem;
                        }
                        break;
                }
                gw_com_module.streamInterface(args)
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