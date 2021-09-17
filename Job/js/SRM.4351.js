//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 발주내역 조회
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var barcode = "";

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
            element: [{ name: "닫기", value: "닫기", icon: "닫기" }]
        };
        gw_com_module.buttonMenu(args);

        //==== Find Grid : Option
        var args = {
            targetid: "grdData_Find", title: "검색 조건",
            height: "100%", pager: false, show: true,
            editable: { master: true, bind: "select", focus: "barcode", validate: true },
            element: [
				        {
				            header: "바코드", name: "barcode", align: "center",
				            editable: { type: "text", size: 80 }
				        }
			        ]
                };
        gw_com_module.gridCreate(args);

        //==== List Grid : 바코드 품목정보
        var args = {
            targetid: "grdData_List1", query: "SRM_4350_M_1", title: "품목 정보",
            height: 250, show: false,
            element: [
				{ name: "barcode", hidden: true },
				{ name: "item_cd", hidden: true },
				{ name: "item_nm", hidden: true },
				{ name: "item_spec", hidden: true },
				{ name: "track_no", hidden: true },
				{ name: "inv_qty", hidden: true },
				{ name: "unit", hidden: true },
                { name: "supp_nm", hidden: true },
                { name: "supp_cd", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== List Grid : 외부 바코드 정보
        var args = {
            targetid: "grdData_List2", query: "SRM_4350_S_1", title: "외부 바코드 정보",
            height: 250, show: false,
            element: [
				{ name: "barcode", hidden: true },
                { name: "exbarcode", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Find", offset: 8 }
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
        var args = { targetid: "grdData_Find", grid: true, event: "itemkeyup", handler: eventItemKeyUp };
        gw_com_module.eventBind(args);
        //----------


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
    if (gw_com_module.objValidate(args) == false) return;

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
			{ type: "GRID", id: "grdData_List1", select: true }
        ],
        handler_complete: processRetrieveEnd//({ type: "MAIN" })
    };
    gw_com_module.objRetrieve(args);
};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Find"}
        ]
    };
    gw_com_module.objClear(args);

    var args = { targetid: "grdData_Find", edit: true };
    gw_com_module.gridInsert(args);
}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processRetrieveEnd(param) {
    var rows = [];
    var iRowCount = 0;

    if (typeof(param) == "undefined") {
        iRowCount = gw_com_api.getRowCount("grdData_List1");
        if (iRowCount > 0) {
            for (var i = 1; i <= iRowCount; i++) {
                rows.push({
                    barcode: gw_com_api.getValue("grdData_List1", i, "barcode", true)
                    , item_cd: gw_com_api.getValue("grdData_List1", i, "item_cd", true)
                    , item_nm: gw_com_api.getValue("grdData_List1", i, "item_nm", true)
                    , item_spec: gw_com_api.getValue("grdData_List1", i, "item_spec", true)
                    , track_no: gw_com_api.getValue("grdData_List1", i, "track_no", true)
                    , inv_qty: gw_com_api.getValue("grdData_List1", i, "inv_qty", true)
                    , unit: gw_com_api.getValue("grdData_List1", i, "unit", true)
                    , supp_cd: gw_com_api.getValue("grdData_List1", i, "supp_cd", true)
                    , supp_nm: gw_com_api.getValue("grdData_List1", i, "supp_nm", true)
                });

                barcode = gw_com_api.getValue("grdData_List1", i, "barcode", true);
            }

            var args = {
                ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
                SUBID: "내부",
                data: { rows: rows }
            };
            gw_com_module.streamInterface(args);

        } else {
            if (barcode == "") {
                gw_com_api.messageBox([{ text: "내부 바코드가 선택되지 않았습니다." }], 300);
                processClear({});
                return;
            }

            var args = {
                source: {
                    type: "INLINE",
                    argument: [
                        { name: "arg_barcode", value: barcode },
                        { name: "arg_exbarcode", value: gw_com_api.getValue("grdData_Find", "selected", "barcode", true) }
                    ]
                }, target: [
                    { type: "GRID", id: "grdData_List2", select: true }
                ],
                handler_complete: processRetrieveEnd2//({ type: "SUB" })
            };

            gw_com_module.objRetrieve(args);
            return;
        }

    //} else if (param.type == "SUB") {
    //    alert('aa');
    //    iRowCount = gw_com_api.getRowCount("grdData_List2");

    //    if (iRowCount > 0) {
    //        gw_com_api.messageBox([{ text: "이미 등록된 바코드입니다." }], 300);
    //    } else {
    //        var args = {
    //            ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
    //            SUBID: "외부",
    //            barcode: barcode,
    //            exbarcode: gw_com_api.getValue("grdData_Find", "selected", "barcode", true)
    //        };
    //        gw_com_module.streamInterface(args);
    //    }
    }

    processClear({});
}

function processRetrieveEnd2(param) {
    var iRowCount = gw_com_api.getRowCount("grdData_List2");

    if (iRowCount > 0) {
        gw_com_api.messageBox([{ text: "이미 등록된 바코드입니다." }], 300);
    } else {
        var args = {
            ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
            SUBID: "외부",
            barcode: barcode,
            exbarcode: gw_com_api.getValue("grdData_Find", "selected", "barcode", true)
        };
        gw_com_module.streamInterface(args);
    }

    processClear({});
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {
    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage: {
            //// PageId가 다를 때 Skip 
            //if (param.data.page != gw_com_api.getPageID()) {
            //    param.to = { type: "POPUP", page: param.data.page };
            //    gw_com_module.streamInterface(param);
            //    break;
            //}
            gw_com_api.setFocus("grdData_Find", "selected", "barcode", true);
        } break;
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            barcode = (param.data == undefined ? "" : param.data.barcode);
            processClear({});
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//