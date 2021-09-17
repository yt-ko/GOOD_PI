//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
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
                    type: "PAGE", name: "공장", query: "dddw_prodgroup"
                },
                {
				    type: "PAGE", name: "창고", query: "dddw_sl"
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
            gw_job_process.procedure();
            gw_com_module.startPage();

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
            targetid: "lyrMenu_MASTER", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, //margin: 220,
            editable: { focus: "dept_area", validate: true }, remark: "lyrRemark2",
            content: {
                row: [
                    {
                        element: [
			                {
			                    name: "ymd_fr", label: { title: "실사일자 :" }, mask: "date-ymd",
			                    style: { colfloat: "float" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    style: { colfloat: "floating" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
                        ]
                    },
                    {
                        element: [
                            {
                                name: "plant_cd", label: { title: "공장 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "공장", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "sl_cd", memory: "창고", key: ["plant_cd"] }]
                                }
                            },
                            {
                                name: "sl_cd", label: { title: "창고 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "창고", unshift: [{ title: "전체", value: "" }], key: ["plant_cd"] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pic_emp", label: { title: "담당자 :" },
                                editable: { type: "text" }, mask: "search"
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
				            { name: "실행", value: "실행", act: true, format: { type: "button" } },
				            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MASTER", query: "SRM_9810_1", title: "실사 이력",
            caption: true, height: 145, show: true, selectable: true, number: true,
            element: [
				{
				    header: "실사일자", name: "pic_date", width: 100, align: "center",
				    editable: { type: "text" }, mask: "date-ymd"
				},
                {
                    header: "제목", name: "pic_title", width: 200,
                    editable: { type: "text", width: 270 }
                },
                {
                    header: "공장", name: "plant_cd", width: 60,
                    editable: {
                        type: "select", width: 80,
                        data: { memory: "공장" },
                        change: [{ name: "sl_cd", memory: "창고", key: ["plant_cd"], unshift: [{ title: "전체", value: " " }] }]
                    }
                },
                {
                    header: "창고", name: "sl_cd", width: 120,
                    format: { type: "select", data: { memory: "창고" } },
                    editable: {
                        type: "select", width: 160,
                        data: { memory: "창고", unshift: [{ title: "전체", value: " " }], key: ["plant_cd"] }
                    }
                },
                {
                    header: "담당자", name: "pic_emp_nm", width: 60, align: "center",
                    editable: { type: "text", width: 80 }, display: true, mask: "search"
                },
                {
                    header: "비고", name: "rmk", width: 250,
                    editable: { type: "text", width: 340, maxlength: 150 }
                },
                { name: "pic_emp", editable: { type: "hidden" }, hidden: true },
				{ name: "pic_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "SRM_9810_2", title: "재고 목록",
            width: 800, caption: true, height: 200, show: true, selectable: true, number: true, dynamic: true,
            element: [
                { header: "공장", name: "plant_cd", width: 40, hidden: true },
                { header: "창고", name: "sl_nm", width: 120, hidden: true },
                { header: "품번", name: "item_cd", width: 80, editable: { type: "hidden" } },
                { header: "품명", name: "item_nm", width: 150, display: true },
                { header: "규격", name: "item_spec", width: 150, display: true },
                { header: "Tracking", name: "track_no", width: 80, editable: { type: "hidden" } },
                { header: "ERP재고", name: "inv_qty", width: 50, mask: "numeric-int", align: "right" },
                { header: "실사수량", name: "pic_qty", width: 50, mask: "numeric-int", align: "right", display: true },
                { header: "조정수량", name: "chg_qty", width: 50, mask: "numeric-int", align: "right", display: true },
                { header: "차이수량", name: "qty", width: 50, mask: "numeric-int", align: "right", display: true },
                { header: "비고", name: "rmk", width: 150, editable: { type: "text" } },
                { name: "pic_no", editable: { type: "hidden" }, hidden: true },
                { name: "sl_cd", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_DETAIL", query: "SRM_9811_2", title: "바코드 목록",
            caption: true, height: 200, show: true, selectable: true, number: true, dynamic: true,
            element: [
                { header: "바코드", name: "barcode", width: 60, align: "center" },
                { header: "품목수량", name: "pic_qty", width: 40, align: "right", mask: "numeric-ymd" },
                { header: "읽기횟수", name: "read_cnt", width: 40, align: "right", mask: "numeric-ymd" },
                { header: "오류내용", name: "err_msg", width: 100 }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MASTER", offset: 8 },
				{ type: "GRID", id: "grdList_SUB", offset: 8 },
                { type: "GRID", id: "grdList_DETAIL", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

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
        var args = { targetid: "lyrMenu_MASTER", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MASTER", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MASTER", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_SUB", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

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

    var args;
    if (param.object == "frmOption" || param.master) {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "plant_cd", argument: "arg_plant_cd" },
                    { name: "sl_cd", argument: "arg_sl_cd" },
                    { name: "pic_emp", argument: "arg_pic_emp" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "plant_cd" }] },
                    { element: [{ name: "sl_cd" }] },
                    { element: [{ name: "pic_emp" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MASTER", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_SUB" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else if (param.object == "grdList_MASTER" || param.sub) {
        args = {
            source: {
                type: "GRID", id: "grdList_MASTER", row: "selected",
                element: [
                    { name: "pic_no", argument: "arg_pic_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_SUB", select: true }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else if (param.object == "grdList_SUB" || param.detail) {
        args = {
            source: {
                type: "GRID", id: "grdList_SUB", row: "selected",
                element: [
                    { name: "pic_no", argument: "arg_pic_no" },
                    { name: "plant_cd", argument: "arg_plant_cd" },
                    { name: "sl_cd", argument: "arg_sl_cd" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "track_no", argument: "arg_track_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_DETAIL", select: true }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function viewOption(param) {

    gw_com_api.show("frmOption");

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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch({});
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "SRM_9811":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                pic_no: gw_com_api.getValue("grdList_SUB", "selected", "pic_no", true)
                            };
                        }
                        break;
                    case "w_find_emp":
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "SRM_9811":
                        if (param.data != undefined) {
                            processRetrieve({ sub: true });
                        }
                        break;
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.substr(0, v_global.event.element.length - 3),
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "use_dept_nm",
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "use_dept",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//