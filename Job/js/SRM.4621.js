//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 이동가능 품목 조회
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

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //----------
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 확인, 취소
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				        { name: "닫기", value: "닫기", icon: "닫기" }
			        ]
                };
        gw_com_module.buttonMenu(args);

        //==== Custom Buttons
        var args = {
            targetid: "lyrCustomButton", type: "FREE",
            element: [
				        { name: "이동", value: "이동", icon: "예" },
                        { name: "취소", value: "취소", icon: "아니오" }
            ]
        };
        gw_com_module.buttonMenu(args);
        gw_com_api.hide("lyrCustomButton");

        //==== Find Grid : Option
        var args = {
            targetid: "grdData_Barcode", query: "", title: "바코드",
            height: "100%", pager: false, show: true,
            editable: { master: true, bind: "select", focus: "barcode", validate: true },
            element: [
                        {
                            header: "이동 Tracking", name: "to_track_no", align: "center",
                            editable: { type: "text", size: 60, maxlength: 30 }
                        },
				        {
				            header: "바코드", name: "barcode", align: "center",
				            editable: { type: "text", size: 60, maxlength: 11 }
				        }
			        ]
                };
        gw_com_module.gridCreate(args);

        //==== List Grid : 출고대상 품목정보
        var args = {
            targetid: "grdData_List", query: "SRM_4621_S_1", title: "이동가능 품목정보",
            height: 23, show: false, multi: false, checkrow: false, pager: false,
            editable: { multi: false, bind: "select", focus: "move_qty", validate: true },
            element: [
				        { header: "품번", name: "item_cd", width: 60, align: "center" },
				        { header: "품명", name: "item_nm", width: 110 },
				        { header: "규격", name: "item_spec", width: 110 },
				        { header: "단위", name: "unit", width: 40, align: "center" },
				        { header: "재고수량", name: "inv_qty", width: 60, align: "right" },
				        { header: "이동수량", name: "move_qty", width: 60, align: "right", editable: { type: "text", width: 60 } },
				        { name: "barcode", hidden: true },
				        { name: "plant_cd", hidden: true },
				        { name: "issue_qty", hidden: true },
				        { name: "label_tp", hidden: true },
                        { name: "track_no", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Item Form : 품목 정보
        var args = {
            targetid: "frmData_ITEM", query: "SRM_4621_S_1", type: "TABLE", title: "품목 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "select" },
            content: {
                width: { label: 40, field: 60 }, height: 40,
                row: [
                    {
                        element: [
                            { header: true, value: "<b>납품일자</b>", format: { type: "label" } },
                            { name: "dlv_date", editable: { type: "hidden", width: 200 }, mask: "date-ymd" },
                            { header: true, value: "<b>재고수량</b>", format: { type: "label" } },
                            { name: "inv_qty", editable: { type: "hidden", width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<b>품목코드</b>", format: { type: "label" } },
                            { name: "item_cd", editable: { type: "hidden", width: 400 }, style: { colspan: 3 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<b>품목명</b>", format: { type: "label" } },
                            { name: "item_nm", editable: { type: "hidden", width: 400 }, style: { colspan: 3 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<b>규격</b>", format: { type: "label" } },
                            { name: "item_spec", editable: { type: "hidden", width: 400 }, style: { colspan: 3 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        $("#frmData_ITEM_dlv_date").css({ "color": "red", "font-weight": "bold" });
        $("#frmData_ITEM_inv_qty").css({ "color": "red", "font-weight": "bold" });
        $("#frmData_ITEM_item_cd").css({ "color": "red", "font-weight": "bold" });
        $("#frmData_ITEM_item_nm").css({ "color": "red", "font-weight": "bold" });
        $("#frmData_ITEM_item_spec").css({ "color": "red", "font-weight": "bold" });

        //==== Resize Objects
        var args = {
            target: [
                { type: "GRID", id: "grdData_Barcode", offset: 8 },
                { type: "GRID", id: "grdData_List", offset: 8 },
                { type: "FORM", id: "frmData_ITEM", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //==== Custom Button Click ====
        var args = { targetid: "lyrCustomButton", element: "이동", event: "click", handler: processSend };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrCustomButton", element: "취소", event: "click", handler: processClear };
        gw_com_module.eventBind(args);

        //----------
        //var args = { targetid: "grdData_Barcode", grid: true, event: "itemchanged", handler: itemchanged_grdData_Barcode };
        //gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Barcode", grid: true, event: "itemkeyup", handler: eventItemKeyUp };
        gw_com_module.eventBind(args);
        //----------


        //----------
        function itemchanged_grdData_Barcode(ui) {
        }

        //----------
        function eventItemKeyUp(ui) {
            if (ui.object == "grdData_Barcode") {
                //바코드 search
                if (event.keyCode == 17 || event.keyCode == 13) {
                    if (ui.element == "to_track_no") {
                        gw_com_api.setFocus(ui.object, ui.row, "barcode", true);
                    } else if (ui.element == "barcode") {
                        if ($.trim(gw_com_api.getValue(ui.object, ui.row, "to_track_no", true)) == "") {
                            //gw_com_api.messageBox([{ text: "이동 Tracking을 입력하세요." }], 400);
                            alert("이동 Tracking을 입력하세요.");
                            gw_com_api.setFocus(ui.object, ui.row, "to_track_no", true);
                        } else {
                            processRetrieve({});
                        }
                    }
                }
            }
        }

        // startup process.
        //----------
        gw_com_module.startPage();
        //----------
        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processRetrieve(param) {
    var args = { target: [{ type: "GRID", id: "grdData_Barcode" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    if ($.trim(gw_com_api.getValue("grdData_Barcode", "selected", "barcode", true)) == "") {
        processClear({});
        return;
    }

    var args = {
        source: {
            type: "GRID", id: "grdData_Barcode", row: "selected",
            element: [
				{ name: "barcode", argument: "arg_barcode" }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_List", select: true, focus: true },
            { type: "FORM", id: "frmData_ITEM", edit: true }
        ],
        handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);
};
//----------
function processRetrieveEnd(param) {

    var iRowCount = gw_com_api.getRowCount("grdData_List");
    if (iRowCount == 1) {
        if (gw_com_api.getValue("grdData_List", iRowCount, "inv_qty", true) <= 0) {
            //gw_com_api.messageBox([{ text: "재고 수량이 부족합니다." }], 300);
            alert("재고 수량이 부족합니다.");
//        } else if (gw_com_api.getValue("grdData_List", iRowCount, "label_tp", true) == "2" && gw_com_api.getValue("grdData_List", iRowCount, "inv_qty", true) > 1) {
////==========================================통합바코드 분할===========================================
//            gw_com_api.hide("grdData_Tracking");
//            gw_com_api.hide("grdData_Barcode");
//            gw_com_api.show("grdData_List");
//            gw_com_api.show("lyrCustomButton");
//            var args = {
//                target: [
//                    { type: "GRID", id: "grdData_Tracking", offset: 8 },
//                    { type: "GRID", id: "grdData_Barcode", offset: 8 },
//                    { type: "GRID", id: "grdData_List", offset: 8 }
//                ]
//            };
//            gw_com_module.objResize(args);
//            return;

//            //gw_com_api.messageBox(
//            //    [
//            //        { text: "통합 바코드 품목입니다." },
//            //        { text: "수량 " + msg + "(을)를 입고하시겠습니까?" }
//            //    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { env: true } );
////====================================================================================================
        } else {
            processSend({});
        }
    } else if (iRowCount < 1) {
        //gw_com_api.messageBox([{ text: "잘못된 바코드입니다." }], 300);
        alert("잘못된 바코드입니다.");
    }

    processClear({});
}
//----------
function processSend(param) {
    var rows = [];

    //if (param.element == "이동") {
    //    //통합
    //    var invQty = Number(gw_com_api.getValue("grdData_List", 1, "inv_qty", true));
    //    var movQty = Number(gw_com_api.getValue("grdData_List", 1, "move_qty", true));

    //    if (movQty == 0 || movQty == "") {
    //        gw_com_api.messageBox([{ text: "이동수량을 입력하세요." }], 300);
    //        return;
    //    } else if (movQty > invQty) {
    //        gw_com_api.messageBox([{ text: "이동수량이 재고수량을 초과하였습니다." }], 400);
    //        return;
    //    }

    //    for (var i = 1 ; i <= movQty; i++) {
    //        rows.push({
    //            barcode: ""
    //            , plant_cd: gw_com_api.getValue("grdData_List", 1, "plant_cd", true)
    //            , item_cd: gw_com_api.getValue("grdData_List", 1, "item_cd", true)
    //            , item_nm: gw_com_api.getValue("grdData_List", 1, "item_nm", true)
    //            , item_spec: gw_com_api.getValue("grdData_List", 1, "item_spec", true)
    //            , track_no: gw_com_api.getValue("grdData_Tracking", 1, "to_track_no", true)
    //            , io_qty: 1
    //            , io_unit: gw_com_api.getValue("grdData_List", 1, "unit", true)
    //            , mbarcode: gw_com_api.getValue("grdData_List", 1, "barcode", true)
    //            , mtrack_no: gw_com_api.getValue("grdData_List", 1, "track_no", true)
    //        });
    //    }
    //} else {
        //개별
        rows.push({
            barcode: gw_com_api.getValue("grdData_List", 1, "barcode", true)
            , plant_cd: gw_com_api.getValue("grdData_List", 1, "plant_cd", true)
            , item_cd: gw_com_api.getValue("grdData_List", 1, "item_cd", true)
            , item_nm: gw_com_api.getValue("grdData_List", 1, "item_nm", true)
            , item_spec: gw_com_api.getValue("grdData_List", 1, "item_spec", true)
            , track_no: gw_com_api.getValue("grdData_Barcode", 1, "to_track_no", true)
            // --- 13.07.31 수정 ---
            //, io_qty: 1
            , inv_qty: gw_com_api.getValue("grdData_List", 1, "inv_qty", true)
            , io_qty: gw_com_api.getValue("grdData_List", 1, "inv_qty", true)
            // ---------------------
            , io_unit: gw_com_api.getValue("grdData_List", 1, "unit", true)
            , mbarcode: ""
            , mtrack_no: gw_com_api.getValue("grdData_List", 1, "track_no", true)
        });
    //}

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
        data: { rows: rows }
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processClear(param) {

    var to_track_no = gw_com_api.getValue("grdData_Barcode", 1, "to_track_no", true);
    var args = {
        target: [
            { type: "GRID", id: "grdData_Barcode" },
            { type: "GRID", id: "grdData_List" }
        ]
    };
    gw_com_module.objClear(args);

    var args = { targetid: "grdData_Barcode", edit: true };
    gw_com_module.gridInsert(args);

    gw_com_api.show("grdData_Barcode");
    gw_com_api.hide("grdData_List");
    gw_com_api.hide("lyrCustomButton");
    var args = {
        target: [
            { type: "GRID", id: "grdData_Barcode", offset: 8 },
            { type: "GRID", id: "grdData_List", offset: 8 },
            { type: "FORM", id: "frmData_ITEM", offset: 8 }
        ]
    };
    gw_com_module.objResize(args);

    gw_com_api.setValue("grdData_Barcode", "selected", "to_track_no", to_track_no, true);
    gw_com_api.setFocus("grdData_Barcode", "selected", "barcode", true);
}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});
    gw_com_module.objClear({ target: [{ type: "FORM", id: "frmData_ITEM" }] });
}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {
    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            processClear({});
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = {
                    type: "POPUP",
                    page: param.data.page
                };
                gw_com_module.streamInterface(param);
                break;
            }
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmBatch:
                    {
                        if (param.data.result == "YES") {
                            processSend({});
                        }
                    }
                    break;
            }

            //if (param.data.page != gw_com_api.getPageID()) break;
            gw_com_api.setFocus("grdData_Barcode", "selected", "barcode", true);
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//