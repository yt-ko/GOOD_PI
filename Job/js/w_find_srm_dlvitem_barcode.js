//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 발주내역 조회
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var ii_barcode_cnt = 0;
var ii_result_cnt = 0;
var ii_action_cnt = 0;

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
        var args = {
            targetid: "lyrMenu", type: "FREE",
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
				            editable: { type: "text", size: 60, maxlength: 12 }
				        }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== List Grid : 검수 대상 납품목록
        var args = {
            targetid: "grdData_List", query: "SRM_4220_CHK", title: "검수 대상 품목",
            height: 250, show: false, multi: true, checkrow: true,
            element: [
				        { header: "바코드", name: "barcode", width: 20, align: "center" },
				        { header: "품번", name: "item_cd", width: 80, align: "center" },
				        { header: "품명", name: "item_nm", width: 120, align: "left" },
				        { header: "규격", name: "item_spec", width: 120, align: "left" },
				        { header: "Tracking", name: "track_no", width: 80, align: "center" },
				        { header: "Pallet No.", name: "pallet_no", width: 80, align: "center" },
				        { header: "납품수량", name: "dlv_qty", width: 50, align: "right" },
				        { header: "단위", name: "pur_unit", width: 40, align: "center" },
                        { name: "label_tp", hidden: true, editable: { type: "hidden" } },
                        { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                        { name: "supp_nm", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_user", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_user_nm", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_no", hidden: true, editable: { type: "hidden" } },
                        { name: "dlv_seq", hidden: true, editable: { type: "hidden" } },
                        { name: "pur_no", hidden: true, editable: { type: "hidden" } },
                        { name: "pur_seq", hidden: true, editable: { type: "hidden" } }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "grdData_Find", grid: true, event: "itemchanged", handler: itemchanged_grdData_Find };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Find", grid: true, event: "itemkeyup", handler: itemchanged_barcode };
        gw_com_module.eventBind(args);
        //----------
        //        var args = { targetid: "grdData_Find", grid: true, event: "rowkeyenter", handler: itemchanged_grdData_Find };
        //        gw_com_module.eventBind(args);


        //----------
        function itemchanged_grdData_Find(ui) {
        }

        //----------
        function itemchanged_barcode(ui) {
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

    var args = {
        source: {
            type: "GRID", id: "grdData_Find", row: "selected",
            element: [
				{ name: "barcode", argument: "arg_barcode" }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_List", select: true }//, focus: true }
        ],
        key: param.key, handler_complete: informResult
    };
    gw_com_module.objRetrieve(args);
};
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
}
//----------
function processClose(param) {
    //    clearInterval(ii_timer);
    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informResult(param) {
    ii_action_cnt++;

    var iRowCount = gw_com_api.getRowCount("grdData_List");
    if (iRowCount > 0) {
        ii_barcode_cnt++;
        ii_result_cnt += iRowCount;

        var rows = [];
        for (var i = 1; i <= iRowCount; i++) {
            if (v_global.logic.supp_cd != "" &&
                v_global.logic.supp_cd != gw_com_api.getValue("grdData_List", i, "supp_cd", true)) {
                gw_com_api.messageBox([{ text: "협력사 정보가 일치하지 않습니다." }]);
                processClear({});
                return;
            } else {
                v_global.logic.supp_cd = gw_com_api.getValue("grdData_List", i, "supp_cd", true);
                rows.push({
                    barcode: gw_com_api.getValue("grdData_List", i, "barcode", true)
                    , dlv_no: gw_com_api.getValue("grdData_List", i, "dlv_no", true)
                    , dlv_seq: gw_com_api.getValue("grdData_List", i, "dlv_seq", true)
                    , pur_no: gw_com_api.getValue("grdData_List", i, "pur_no", true)
                    , pur_seq: gw_com_api.getValue("grdData_List", i, "pur_seq", true)
                    , track_no: gw_com_api.getValue("grdData_List", i, "track_no", true)
                    , pallet_no: gw_com_api.getValue("grdData_List", i, "pallet_no", true)
                    , item_cd: gw_com_api.getValue("grdData_List", i, "item_cd", true)
                    , item_nm: gw_com_api.getValue("grdData_List", i, "item_nm", true)
                    , item_spec: gw_com_api.getValue("grdData_List", i, "item_spec", true)
                    , dlv_qty: gw_com_api.getValue("grdData_List", i, "dlv_qty", true)
                    , unit: gw_com_api.getValue("grdData_List", i, "pur_unit", true)
                    , label_tp: gw_com_api.getValue("grdData_List", i, "label_tp", true)
                    , rqst_dept: gw_com_api.getValue("grdData_List", i, "supp_cd", true)
                    , rqst_dept_nm: gw_com_api.getValue("grdData_List", i, "supp_nm", true)
                    , rqst_user: gw_com_api.getValue("grdData_List", i, "dlv_user", true)
                });
            }
        }

        var args = {
            ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
            data: { rows: rows }
        };
        gw_com_module.streamInterface(args);
        //gw_com_api.setFocus("grdData_Find", "selected", "barcode", true);
    }

    processClear({});
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {
    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            v_global.logic.supp_cd = param.data.supp_cd;
            processClear({});
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            //if (param.data.page != gw_com_api.getPageID()) break;
            gw_com_api.setFocus("grdData_Find", "selected", "barcode", true);
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//