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
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "납기등록", value: "납기등록", icon: "추가" },
                //{ name: "납품등록", value: "납품등록", icon: "추가" },
                { name: "발주서출력", value: "발주서출력", icon: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, //margin: 170,
            editable: { focus: "pur_no", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pur_no", label: { title: "PO번호 : " },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                style: { colfloat: "floating" },
                                name: "ymd_fr", label: { title: "PO일자 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "cancel_yn", value: "1", title: "취소포함", label: { title: "취소포함 :" },
                                editable: { type: "checkbox", value: 1, offval: 0 }
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
            targetid: "grdData_현황", query: "w_srm1030_1", title: "발주서 현황",
            height: 200, number: true, show: true, selectable: true, key: true/*, color: { row: true }*/,
            element: [
                { name: "color", hidden: true },
                { name: "cancel_yn", hidden: true },
                {
                    header: "구분", name: "type", width: 50, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "확인", name: "confirm", width: 50, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "Project No", name: "projkey", width: 100, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "PO번호", name: "pur_no", width: 110, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "PO일자", name: "pur_date", width: 80, align: "center",
                    fix: { mask: "date-ymd", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "품목수", name: "item_qty", width: 50, align: "center",
                    fix: { mask: "numeric-int", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "납기미등록", name: "no_regist", width: 70, align: "center",
                    fix: { mask: "numeric-int", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "미납품", name: "no_dlv", width: 50, align: "center",
                    fix: { mask: "numeric-int", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "취소품목", name: "cancel_qty", width: 60, align: "center",
                    fix: { mask: "numeric-int", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "PO일변경", name: "po_change", width: 60, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "PO수량변동", name: "qty_change", width: 70, align: "center",
                    fix: { mask: "numeric-int", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "PO단가변동", name: "price_change", width: 70, align: "center",
                    fix: { mask: "numeric-int", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "납기일변동", name: "date_change", width: 70, align: "center",
                    fix: { mask: "numeric-int", color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "납기요청일", name: "req_date", width: 150, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "전송일시", name: "sent_dt", width: 160, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "확인일시", name: "checked_dt", width: 160, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                {
                    header: "출력일시", name: "printed_dt", width: 160, align: "center",
                    fix: { color: { by: "cancel_yn", to: "#909090" } }
                },
                { name: "pur_type", hidden: true },
                { name: "pur_date", hidden: true },
                { name: "root_type", hidden: true }
            ]//,
            //subgrid: {
            //    query: "w_srm1030_4", height: "100%",
            //    argument: [
            //        { name: "pur_no", argument: "arg_pur_no" }
            //    ],
            //    element: [
            //        { header: "품번", name: "item_cd", width: 80, align: "center" },
            //        { header: "품명", name: "item_nm", width: 200, align: "left" },
            //        { header: "규격", name: "item_spec", width: 200, align: "left" },
            //        { header: "Project", name: "proj_no", width: 70, align: "center" },
            //        { header: "Pallet No.", name: "pallet", width: 80, align: "center" },
            //        { header: "납기요청일", name: "req_date", width: 80, align: "center", mask: "date-ymd" },
            //        { header: "PO수량", name: "pur_qty", width: 60, align: "center", mask: "numeric-int" },
            //        { header: "단위", name: "pur_unit", width: 40, align: "center" },
            //        { header: "준수수량", name: "plan_qty", width: 60, align: "center", mask: "numeric-int" },
            //        { header: "미준수수량", name: "delay_qty", width: 70, align: "center", mask: "numeric-int" },
            //        { header: "납품가능일", name: "plan_date", width: 160, align: "center", mask: "date-ymd" },
            //        { header: "Booking No.", name: "booking_no", width: 100, align: "center" }
            //    ]
            //}
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_품목", query: "w_srm1030_4", title: "발주품목",
            height: 200, number: true, show: true, selectable: true, key: true/*, color: { row: true }*/,
            element: [
                { header: "품번", name: "item_cd", width: 100, align: "center" },
                { header: "품명", name: "item_nm", width: 150, align: "left" },
                { header: "규격", name: "item_spec", width: 150, align: "left" },
                { header: "Project", name: "proj_no", width: 100, align: "center" },
                { header: "Pallet No.", name: "pallet", width: 80, align: "center" },
                { header: "납기요청일", name: "req_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "PO수량", name: "pur_qty", width: 60, align: "center", mask: "numeric-int" },
                { header: "단위", name: "pur_unit", width: 40, align: "center" },
                { header: "준수수량", name: "plan_qty", width: 60, align: "center", mask: "numeric-int" },
                { header: "미준수수량", name: "delay_qty", width: 70, align: "center", mask: "numeric-int" },
                { header: "납품가능일", name: "plan_date", width: 160, align: "center", mask: "date-ymd" },
                { header: "Booking No.", name: "booking_no", width: 100, align: "center", format: { type: "link" } },
                { name: "pur_no", hidden: true },
                { name: "pur_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "GRID", id: "grdData_품목", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "납기등록", event: "click", handler: click_lyrMenu_납기등록 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "납품등록", event: "click", handler: click_lyrMenu_납품등록 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "발주서출력", event: "click", handler: click_lyrMenu_발주서출력 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_품목", grid: true, element: "booking_no", event: "click", handler: click_grdData_품목_booking_no };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_납기등록(ui) {

            if (!checkManipulate({})) return;
            if (gw_com_api.getValue("grdData_현황", "selected", "root_type", true) == "S") {
                gw_com_api.messageBox([
                    { text: "비입고 발주는 납기 등록을 할 수 없습니다." }
                ]);
                return;
            }
            else if (gw_com_api.getValue("grdData_현황", "selected", "cancel_yn", true) == "1") {
                gw_com_api.messageBox([
                    { text: "취소된 발주서 입니다." }
                ], 350);
                return;
            }

            openPage({ page: "w_srm1031", title: "납기 등록" });

        }
        //----------
        function click_lyrMenu_납품등록(ui) {

            if (!checkManipulate({})) return;
            if (gw_com_api.getValue("grdData_현황", "selected", "root_type", true) == "S") {
                gw_com_api.messageBox([
                    { text: "비입고 발주는 납품 등록을 할 수 없습니다." }
                ]);
                return;
            }
            else if (gw_com_api.getValue("grdData_현황", "selected", "cancel_yn", true) == "1") {
                gw_com_api.messageBox([
                    { text: "취소된 발주서 입니다." }
                ], 350);
                return;
            }

            openPage({ page: "w_srm1040", title: "납품 등록" });

        }
        //----------
        function click_lyrMenu_발주서출력(ui) {

            if (!checkManipulate({})) return;
            if (!checkPrintable({})) return;

            processExport();

        }
        //----------
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
        function rowselected_grdData_현황(ui) {

            processLink({});

        };
        //----------
        function click_grdData_품목_booking_no(ui) {

            v_global.event.data = {
                pur_no: gw_com_api.getValue(ui.object, ui.row, "pur_no", true),
                pur_seq: gw_com_api.getValue(ui.object, ui.row, "pur_seq", true)
            };
            var args = {
                type: "PAGE", page: "w_srm1030_1", title: "Booking정보",
                width: 400, height: 250, locate: ["center", "center"], open: true,
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                args = {
                    page: args.page,
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();
        //----------

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
function checkPrintable(param) {

    closeOption({});

    if (gw_com_api.getValue("grdData_현황", "selected", "cancel_yn", true) == "1") {
        gw_com_api.messageBox([
                    { text: "취소된 발주서 입니다." }
                ], 350);
        return;
    }
    else if (gw_com_api.getValue("grdData_현황", "selected", "root_type", true) != "S"
        && gw_com_api.getValue("grdData_현황", "selected", "confirm", true) == "미확인") {
        gw_com_api.messageBox([
            { text: "미확인 데이터는 발주서를 출력할 수 없습니다." }
        ]);
        return false;
    }
    return true;

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "pur_no", argument: "arg_pur_no" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "cancel_yn", argument: "arg_cancel_yn" }
            ],
            argument: [
                { name: "arg_supp_cd", value: gw_com_module.v_Session.USR_ID }
            ],
            remark: [
                { element: [{ name: "pur_no" }] },
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "cancel_yn" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_현황", select: true, focus: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_품목" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_현황", row: "selected", block: true,
            element: [
                { name: "pur_no", argument: "arg_pur_no" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_품목" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processExport() {

    var type = gw_com_api.getValue("grdData_현황", "selected", "pur_type", true);
    var args = {
        query: (type == "외자") ? "w_srm1030_3" : "w_srm1030_2",
        source: {
            type: "GRID", id: "grdData_현황", row: "selected", json: true,
            element: [
                { name: "pur_no", argument: "argPur_no" }
            ]
        },
        option: [
            { name: "PRINT", value: "PDF" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "KEY", value: gw_com_api.getValue("grdData_현황", "selected", "pur_no", true) },
            { name: "SAVE", value: 1 }
        ],
        target: {
            type: "FILE", id: "lyrDown", name: "발주서",
            index: gw_com_api.getValue("grdData_현황", "selected", "pur_no", true)
        },
        handler: {
            success: successExport
        }
    };
    gw_com_module.objExport(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function openPage(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
            type: "MAIN"
        },
        data: {
            page: param.page,
            title: param.title,
            param: [
                { name: "pur_no", value: gw_com_api.getValue("grdData_현황", "selected", "pur_no", true) },
                { name: "pur_date", value: gw_com_api.getValue("grdData_현황", "selected", "pur_date", true) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function successExport(response, param) {

    var args = {
        key: {
            KEY: [
                { NAME: "pur_no", VALUE: gw_com_api.getValue("grdData_현황", "selected", "pur_no", true) }
            ],
            QUERY: "w_srm1030_1"
        }
    };
    processRetrieve(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "w_srm1030_1":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
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