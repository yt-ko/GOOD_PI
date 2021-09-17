//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 발주내역 조회
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        //[1] initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 숨김 여부 설정
        v_global.logic.HideSupp = (gw_com_module.v_Session.DEPT_AREA == "SOLAR") ? false : true;

        start();

        //create UI objects & define events & start logic
        function start() {
            //[3.1] UI & Events
            gw_job_process.UI();
            gw_job_process.procedure();
            //[3.2] Notice Opened Event to Master Page
            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 조회, 확인, 취소
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                //				{ name: "조회", value: "조회", act: true },
                { name: "저장", value: "확인", icon: "저장" },
                { name: "닫기", value: "취소", icon: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Find Grid : Option
        var args = {
            targetid: "grdData_Find", title: "납품서 번호 입력",
            height: "100%", pager: false, show: true, caption: true,
            editable: { master: true, bind: "select", focus: "incode", validate: true },
            element: [
                {
                    header: "바코드 입력", name: "incode", width: 150, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "Check", name: "linkCheck", width: 50, align: "center",
                    format: { type: "link", value: "확인" }
                },
                {
                    header: "Cancel", name: "linkCancel", width: 50, align: "center",
                    format: { type: "link", value: "취소" }
                },
                {
                    header: "확인코드", name: "barcode", width: 60, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "관리번호", name: "dlv_no", width: 90, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "협력사명", name: "supp_nm", width: 150,
                    editable: { type: "hidden" }
                },
                {
                    header: "납품일자", name: "dlv_date", width: 60, align: "center",
                    editable: { type: "hidden" }, mask: "date-ymd"
                },
                {
                    header: "품목수", name: "item_cnt", width: 40, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "오류", name: "err_msg", width: 300,
                    editable: { type: "hidden" }
                }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== List Grid : 가입고 대상 납품서
        var args = {
            targetid: "grdData_List", query: "SRM_4321_S_1", title: "가입고 대상 납품서",
            height: 280, pager: true, caption: true, show: true, multi: true, checkrow: true,
            element: [
                { header: "협력사", name: "supp_nm", width: 170 },
                { header: "바코드", name: "barcode", width: 90, align: "center" },
                { header: "납품일자", name: "dlv_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "납품담당", name: "dlv_user", width: 80, align: "center" },
                { header: "품목수", name: "item_cnt", width: 70, align: "center" },
                { header: "수량합계", name: "dlv_qty", width: 70, align: "center" },
                { header: "납품서번호", name: "dlv_no", width: 100, align: "center" },
                { name: "supp_cd", hidden: true },
                { name: "dlv_user", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
                { type: "GRID", id: "grdData_Find", offset: 15 },
                { type: "GRID", id: "grdData_List", offset: 15 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        //        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        //        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "grdData_Find", grid: true, event: "itemkeyup", handler: eventItemKeyUp };
        gw_com_module.eventBind(args);
        //----------

        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function eventItemKeyUp(ui) {
    if (ui.object == "grdData_Find") {
        if (event.keyCode == 17 || event.keyCode == 13) {
            var args = { bcode: gw_com_api.getValue("grdData_Find", 1, "incode", true) };
            processBarcode(args);
        }
    }
}
//----------
function processBarcode(param) {
    var nRow = gw_com_api.getFindRow("grdData_List", "barcode", param.bcode);
    if (nRow > 0) {
        gw_com_api.setValue("grdData_Find", "selected", "barcode", param.bcode, true, true);
        gw_com_api.setValue("grdData_Find", "selected", "dlv_no", gw_com_api.getValue("grdData_List", nRow, "dlv_no", true), true, true);
        gw_com_api.setValue("grdData_Find", "selected", "supp_nm", gw_com_api.getValue("grdData_List", nRow, "supp_nm", true), true, true);
        gw_com_api.setValue("grdData_Find", "selected", "dlv_date", gw_com_api.getValue("grdData_List", nRow, "dlv_date", true), true, true);
        gw_com_api.setValue("grdData_Find", "selected", "item_cnt", gw_com_api.getValue("grdData_List", nRow, "item_cnt", true), true, true);
        gw_com_api.setValue("grdData_Find", "selected", "err_msg", "", true, true);
        gw_com_api.selectRow("grdData_List", nRow, true, true);
    } else {
        gw_com_api.setValue("grdData_Find", "selected", "barcode", "", true, true);
        gw_com_api.setValue("grdData_Find", "selected", "dlv_no", "", true, true);
        gw_com_api.setValue("grdData_Find", "selected", "supp_nm", "", true, true);
        gw_com_api.setValue("grdData_Find", "selected", "dlv_date", "", true, true);
        gw_com_api.setValue("grdData_Find", "selected", "item_cnt", "", true, true);
        gw_com_api.setValue("grdData_Find", "selected", "err_msg", "해당 자료를 찾을 수 없습니다.", true, true);
    }
    gw_com_api.setValue("grdData_Find", "selected", "incode", "", true);

    informResult({});
}
//----------
function processRetrieve(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_List", select: false, focus: false }
        ],
        key: param.key, handler_complete: informSet
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Find" },
            { type: "GRID", id: "grdData_List" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informSet() {

    if (r_barcode != undefined && r_barcode != "") {
        $.each(r_barcode, function () {
            var nRow = gw_com_api.getFindRow("grdData_List", "barcode", this.barcode);
            if (nRow > 0) {
                gw_com_api.selectRow("grdData_List", nRow, true, true);
            }
        });
    }
    gw_com_api.setFocus("grdData_List", "selected", "incode", true);

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdData_List", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        return false;
    }

    var rows = [];
    var sSuppCD, sSuppNM, sDlvUser;
    $.each(ids, function () {
        rows.push({
            barcode: gw_com_api.getCellValue("GRID", "grdData_List", this, "barcode")
        });
        sSuppCD = gw_com_api.getValue("grdData_List", this, "supp_cd", true);
        sSuppNM = gw_com_api.getValue("grdData_List", this, "supp_nm", true);
        sDlvUser = gw_com_api.getValue("grdData_List", this, "dlv_user", true);
    });

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_SCM
        , SUBID: "납품서"
        , data: { rows: rows, supp_cd: sSuppCD, supp_nm: sSuppNM, dlv_user: sDlvUser }
    };

    r_barcode = rows;
    gw_com_module.streamInterface(args);
    processClear({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            var args = { targetid: "grdData_Find", edit: true };
            if (param.data != undefined) {
                args.data = [
                    { name: "linkCheck", value: "확인" },
                    { name: "linkCancel", value: "취소" },
                    { name: "dlv_date", value: gw_com_api.getDate("", { day: -10 }) }
                ];

                r_barcode = param.data.barcode;
            }
            gw_com_module.gridInsert(args);
            processRetrieve({});
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//