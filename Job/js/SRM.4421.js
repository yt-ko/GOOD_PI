//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 발주내역 조회
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

        //==== Find Grid : Option
        var args = {
            targetid: "grdData_Find", query: "SRM_4220_CHK", title: "검색 조건",
            height: "100%", pager: false, show: true,
            editable: { master: true, bind: "select", focus: "barcode", validate: true },
            element: [
				        {
				            header: "바코드", name: "barcode", align: "center",
				            editable: { type: "text", size: 60, maxlength: 11 }
				        }
			        ]
                };
        gw_com_module.gridCreate(args);

        //==== List Grid : 출고대상 품목정보
        var args = {
            targetid: "grdData_List", query: "SRM_4421_S_1", title: "출고대상 품목정보",
            height: 250, show: false, multi: true, checkrow: true,
            element: [
				        { name: "barcode", hidden: true },
				        { name: "plant_cd", hidden: true },
				        { name: "item_cd", hidden: true },
				        { name: "item_nm", hidden: true },
				        { name: "item_spec", hidden: true },
				        { name: "track_no", hidden: true },
				        { name: "issue_qty", hidden: true },
				        { name: "inv_qty", hidden: true },
				        { name: "unit", hidden: true },
                        { name: "dlv_date", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Item Form : 품목 정보
        var args = {
            targetid: "frmData_ITEM", query: "SRM_4421_S_1", type: "TABLE", title: "품목 정보",
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
				{ type: "GRID", id: "grdData_Find", offset: 8 },
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

        //----------
        //var args = { targetid: "grdData_Find", grid: true, event: "itemchanged", handler: itemchanged_grdData_Find };
        //gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Find", grid: true, event: "itemkeyup", handler: eventItemKeyUp };
        gw_com_module.eventBind(args);
        //----------


        //----------
        function itemchanged_grdData_Find(ui) {
        }

        //----------
        function eventItemKeyUp(ui) {
            //바코드 search
            if (event.keyCode == 17 || event.keyCode == 13) processRetrieve({});
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
    var args = { target: [{ type: "GRID", id: "grdData_Find" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    if ($.trim(gw_com_api.getValue("grdData_Find", "selected", "barcode", true)) == "") {
        processClear({});
        return;
    }

    var args = {
        source: {
            type: "GRID", id: "grdData_Find", row: "selected",
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
        var rows = [];
        rows.push({
            barcode: gw_com_api.getValue("grdData_List", iRowCount, "barcode", true)
            , plant_cd: gw_com_api.getValue("grdData_List", iRowCount, "plant_cd", true)
            , item_cd: gw_com_api.getValue("grdData_List", iRowCount, "item_cd", true)
            , item_nm: gw_com_api.getValue("grdData_List", iRowCount, "item_nm", true)
            , item_spec: gw_com_api.getValue("grdData_List", iRowCount, "item_spec", true)
            , track_no: gw_com_api.getValue("grdData_List", iRowCount, "track_no", true)
            , issue_qty: gw_com_api.getValue("grdData_List", iRowCount, "issue_qty", true)
            , inv_qty: gw_com_api.getValue("grdData_List", iRowCount, "inv_qty", true)
            , unit: gw_com_api.getValue("grdData_List", iRowCount, "unit", true)
            , dlv_date: gw_com_api.getValue("grdData_List", iRowCount, "dlv_date", true)
        });

        //// 품목정보 표시
        //var args = {
        //    targetid: "frmData_ITEM", edit: true, updatable: true,
        //    data: [
        //        { name: "item_cd", value: rows[0].item_cd },
        //        { name: "item_nm", value: rows[0].item_nm },
        //        { name: "item_spec", value: rows[0].item_spec },
        //        { name: "dlv_date", value: rows[0].dlv_date },
        //        { name: "inv_qty", value: rows[0].inv_qty }
        //    ]
        //};
        //gw_com_module.formInsert(args);

        if (gw_com_api.getValue("grdData_List", iRowCount, "inv_qty", true) <= 0) {
            //gw_com_api.messageBox([{ text: "재고 수량이 부족합니다." }], 300);
            alert("재고 수량이 부족합니다.");
        } else {
            var args = {
                ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
                data: { rows: rows }
            };
            gw_com_module.streamInterface(args);
        }
    } else if (iRowCount < 1) {
        gw_com_module.objClear({ target: [{ type: "FORM", id: "frmData_ITEM" }] });
        //gw_com_api.messageBox([{ text: "잘못된 바코드입니다." }, { text: "관리자에게 문의 바랍니다." }], 400);
        alert("잘못된 바코드입니다.\n관리자에게 문의 바랍니다.");
    }

    processClear({});
}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Find" }
        ]
    };
    gw_com_module.objClear(args);

    var args = { targetid: "grdData_Find", edit: true };
    gw_com_module.gridInsert(args);

    gw_com_api.setFocus("grdData_Find", "selected", "barcode", true);
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
            //if (param.data.page != gw_com_api.getPageID()) break;
            gw_com_api.setFocus("grdData_Find", "selected", "barcode", true);
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//