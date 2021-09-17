//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 가입고대상 납품내역 조회
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

        //[2] set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "합불판정",
                    data: [{ title: "합격", value: "1" }, { title: "불합격", value: "0" }]
                },
                { type: "PAGE", name: "창고", query: "DDDW_WH" }
                //{
                //    type: "PAGE", name: "창고", query: "dddw_zcode",
                //    param: [{ argument: "arg_hcode", value: "ISCM10" }]
                //}
            ], starter: start
        };
        gw_com_module.selectSet(args);

        //[3] create UI objects & define events & start logic
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
                //{ name: "조회", value: "조회", act: true },
                { name: "선택", value: "전체선택", icon: "예" },
                { name: "취소", value: "선택취소", icon: "아니오" },
                { name: "저장", value: "확인", icon: "저장" },
                { name: "닫기", value: "취소", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "wh_cd", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "wh_cd", label: { title: "창고 :" },
                                editable: { type: "select", data: { memory: "창고", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" } }
                            },
                            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Find", title: "품목 번호 입력",
            height: "100%", pager: false, show: true, caption: true, selectable: true,
            editable: { master: true, bind: "select", focus: "incode", validate: true },
            element: [
                {
                    header: "바코드 입력", name: "incode", width: 150, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "확인코드", name: "barcode", width: 150, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "품목수", name: "item_cnt", width: 150, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "확인 품목수", name: "chk_item_cnt", width: 150, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "총수량", name: "item_sum", width: 150, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "확인수량", name: "chk_item_sum", width: 150, align: "center",
                    editable: { type: "hidden" }
                }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_List", query: "SRM_4322_S_1", title: "가입고 대상 품목",
            height: 260, show: true, caption: true, selectable: true, multi: true, checkrow: true,
            editable: { multi: true, bind: "select", focus: "chk_qty", validate: true },
            element: [
                {
                    header: "사급", name: "consigned_yn", width: 30, align: "center",
                    format: { type: "checkbox", value: 1, offval: 0 }
                },
                { header: "바코드", name: "barcode", width: 70, align: "center" },
                { header: "품번", name: "item_cd", width: 70, align: "center" },
                { header: "품명", name: "item_nm", width: 130, align: "left" },
                { header: "규격", name: "item_spec", width: 130, align: "left" },
                { header: "Tracking", name: "track_no", width: 70, align: "center" },
                { header: "Pallet No.", name: "pallet_no", width: 70, align: "center" },
                { header: "검수유형", name: "chk_yn_nm", width: 50, align: "center" },
                { header: "검수결과", name: "chk_result_nm", width: 50, align: "center" },
                { header: "납품수량", name: "dlv_qty", width: 50, align: "right" },
                { header: "단위", name: "pur_unit", width: 40, align: "center" },
                {
                    header: "확인수량", name: "chk_qty", width: 50, align: "right",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "창고", name: "wh_cd", width: 100,
                    format: { type: "select", data: { memory: "창고" } },
                    editable: { type: "select", data: { memory: "창고" } }
                },
                { name: "plant_cd", hidden: true, editable: { type: "hidden" } },
                { name: "label_tp", hidden: true, editable: { type: "hidden" } },
                { name: "direct_yn", hidden: true, editable: { type: "hidden" } },
                { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                { name: "supp_nm", hidden: true, editable: { type: "hidden" } },
                { name: "dlv_user", hidden: true, editable: { type: "hidden" } },
                { name: "dlv_user_nm", hidden: true, editable: { type: "hidden" } },
                { name: "dlv_no", hidden: true, editable: { type: "hidden" } },
                { name: "dlv_seq", hidden: true, editable: { type: "hidden" } },
                { name: "pur_no", hidden: true, editable: { type: "hidden" } },
                { name: "pur_seq", hidden: true, editable: { type: "hidden" } },
                { name: "pur_qty", hidden: true, editable: { type: "hidden" } },
                { name: "req_date", hidden: true, editable: { type: "hidden" } },
                { name: "chk_yn", hidden: true, editable: { type: "hidden" } },
                { name: "chk_result", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Find", offset: 15 },
                { type: "GRID", id: "grdData_List", offset: 15 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        //        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        //        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "선택", event: "click", handler: processSelect };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processSelect };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Find", grid: true, event: "itemkeyup", handler: eventItemKeyUp };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_List", grid: true, event: "rowselecting", handler: rowfocuschanging };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_List", grid: true, event: "rowselected", handler: rowfocuschanged };
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
        var nFind = jQuery.inArray(String(nRow), gw_com_api.getSelectedRow("grdData_List", true));
        if (nFind >= 0) {
            //gw_com_api.messageBox([{ text: "이미 체크한 품목입니다." }], 300);
            gw_com_api.showMessage("이미 체크한 품목입니다.");
            gw_com_api.setValue("grdData_Find", "selected", "barcode", "", true, true);
        } else {
            gw_com_api.setValue("grdData_Find", "selected", "barcode", param.bcode, true, true);
            gw_com_api.selectRow("grdData_List", nRow, true);
        }
    } else {
        //gw_com_api.messageBox([{ text: "잘못된 품목입니다." }], 300);
        gw_com_api.showMessage("잘못된 품목입니다.");
        gw_com_api.setValue("grdData_Find", "selected", "barcode", "", true, true);
    }

    gw_com_api.setValue("grdData_Find", "selected", "incode", "", true);
}
//----------
function processRetrieve(param) {

    var s_barcode = "";
    $.each(r_barcode, function () {
        s_barcode += (s_barcode == "" ? this.barcode : "," + this.barcode);
    });
    s_barcode = s_barcode.replace(/,/gi, "','");

    //test: 1106020001
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_barcode", value: s_barcode }//"1106020001" }
            ]
        }, target: [
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
    var nItemCnt = gw_com_api.getRowCount("grdData_List");
    var nItemSum = 0;
    var nChkItemCnt = 0;
    var nChkItemSum = 0;

    for (var i = 1; i <= nItemCnt; i++) {
        nItemSum += Number(gw_com_api.getValue("grdData_List", i, "dlv_qty", true));
    }

    var ids = gw_com_api.getSelectedRow("grdData_List", true);
    $.each(ids, function () {
        nChkItemCnt++;
        nChkItemSum += Number(gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_qty"));
    });

    gw_com_api.setValue("grdData_Find", "selected", "item_cnt", nItemCnt, true, true);
    gw_com_api.setValue("grdData_Find", "selected", "item_sum", nItemSum, true, true);
    gw_com_api.setValue("grdData_Find", "selected", "chk_item_cnt", nChkItemCnt, true, true);
    gw_com_api.setValue("grdData_Find", "selected", "chk_item_sum", nChkItemSum, true, true);

}
//----------
function informResult(param) {

    var wh_cd = gw_com_api.getValue("frmOption", 1, "wh_cd");
    var wh_dept = getWhDept({ wh_cd: wh_cd });
    //if (wh_cd == "") {
    //    gw_com_api.messageBox([{ text: "창고를 선택하세요." }], 250, gw_com_api.v_Message.msg_alert, "ALERT", { type: "chk_wh_cd" });
    //    return;
    //}

    var ids = gw_com_api.getSelectedRow("grdData_List", true);
    if (ids.length < 1) {
        //gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }]);
        gw_com_api.showMessage("선택된 대상이 없습니다.");
        return false;
    }

    var rows = [];
    var err = false;
    var bChk = 0;
    $.each(ids, function () {
        // 검사유형 체크----------------------------------------------------------------------------------
        if (gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_yn") == "1") {
            if (gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_result") == "") {
                //gw_com_api.messageBox([{ text: "수입검사가 진행되지 않은 품목이 있습니다." }], 400);
                gw_com_api.showMessage("수입검사가 진행되지 않은 품목이 있습니다.");
                err = true;
                return false;
            }
        }

        if (gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_result") == "0") {
            //gw_com_api.messageBox([{ text: "수입검사 [불합격] 품목은 입고처리 할 수 없습니다." }], 400);
            err = true;
            gw_com_api.showMessage("수입검사 [불합격] 품목은 입고처리 할 수 없습니다.");
            return false;
        }
        // -----------------------------------------------------------------------------------------------
        // 창고 공장 체크
        if (wh_cd != "") {
            if (wh_dept != gw_com_api.getCellValue("GRID", "grdData_List", this, "plant_cd")) {
                err = true;
                gw_com_api.showMessage("선택한 창고 공장과 발주서의 공장이 일치하지 않습니다.");
                return false;
            }
        }

        //var wh_cd = gw_com_api.getValue("frmOption", 1, "wh_cd");
        if (gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_qty") > 0) {
            rows.push({
                item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd"),
                item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm"),
                item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec"),
                track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no"),
                pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no"),
                plant_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "plant_cd"),
                req_date: gw_com_api.getCellValue("GRID", "grdData_List", this, "req_date"),
                pur_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_qty"),
                io_unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_unit"),
                io_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "chk_qty"),
                label_tp: gw_com_api.getCellValue("GRID", "grdData_List", this, "label_tp"),
                direct_yn: gw_com_api.getCellValue("GRID", "grdData_List", this, "direct_yn"),
                barcode: gw_com_api.getCellValue("GRID", "grdData_List", this, "barcode"),
                root_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_no"),
                root_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_seq"),
                wh_cd: (wh_cd == "" ? gw_com_api.getCellValue("GRID", "grdData_List", this, "wh_cd") : wh_cd),
                consigned_yn: gw_com_api.getCellValue("GRID", "grdData_List", this, "consigned_yn"),
                io_cd: "구매입고",
                loc_cd: "자재"
            });
        }
    });

    if (err)
        return false;

    var args = { ID: gw_com_api.v_Stream.msg_selectedPart_SCM, SUBID: "품목", data: { rows: rows } };
    r_barcode = rows;
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function rowfocuschanging(param) {
    var gridYn = (param.type == "GRID" ? true : false);
    if (param.object == "grdData_List") {
        // 검사유형 체크----------------------------------------------------------------------------------
        if (gw_com_api.getValue(param.object, param.row, "chk_yn", gridYn) == "1") {
            if (gw_com_api.getValue(param.object, param.row, "chk_result", gridYn) == "") {
                //gw_com_api.messageBox([{ text: "<b>수입검사 필수</b> 품목입니다." }, { text: "수입검사를 먼저 진행해 주세요." }], 300);
                gw_com_api.showMessage("수입검사 필수 품목입니다.\n수입검사를 먼저 진행해 주세요.");
                return false;
            }
        }

        if (gw_com_api.getValue("grdData_List", param.row, "chk_result", gridYn) == "0") {
            //gw_com_api.messageBox([{ text: "수입검사 [불합격] 품목입니다." }], 300);
            gw_com_api.showMessage("수입검사 [불합격] 품목입니다.");
            return false;
        }
        // -----------------------------------------------------------------------------------------------
    }
    return true;
}
//----------
function rowfocuschanged(param) {
    var gridYn = (param.type == "GRID" ? true : false);
    if (param.object == "grdData_List") {
        processSelect(param);
    }
}
//----------
function processSelect(param) {

    if (param.element == "선택") {
        gw_com_api.selectRow("grdData_List", "reset");
        for (var i = 1; i <= gw_com_api.getRowCount("grdData_List"); i++) {
            gw_com_api.selectRow("grdData_List", i, true);
            var dlv_qty = gw_com_api.getValue("grdData_List", i, "dlv_qty", true);
            gw_com_api.setValue("grdData_List", i, "chk_qty", dlv_qty, true);
        }
    } else if (param.element == "취소") {
        gw_com_api.selectRow("grdData_List", "reset");
        for (var i = 1; i <= gw_com_api.getRowCount("grdData_List"); i++) {
            gw_com_api.setValue("grdData_List", i, "chk_qty", 0, true);
        }
    } else {
        var dlv_qty = (param.status ? gw_com_api.getValue(param.object, param.row, "dlv_qty", true) : 0);
        gw_com_api.setValue("grdData_List", param.row, "chk_qty", dlv_qty, true);
    }

    //확인
    informSet();

}
//----------
function getWhDept(param) {

    var rtn = "";
    var args = {
        request: "PAGE",
        name: "SRM_4322_WH_DEPT",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=SRM_4322_WH_DEPT" +
            "&QRY_COLS=rcode" +
            "&CRUD=R" +
            "&arg_wh_cd=" + param.wh_cd,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(data) {

        rtn = data.DATA[0];

    }
    return rtn;

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            gw_com_api.setValue("frmOption", 1, "wh_cd", "");
            var args = { targetid: "grdData_Find", edit: true };
            if (param.data != undefined) {
                r_barcode = param.data.barcode;
                gw_com_module.gridInsert(args);
                processRetrieve({});
            }
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_alert:
                    if (param.data.arg != undefined) {
                        switch (param.data.arg.type) {
                            case "chk_wh_cd":
                                var $wrapper = $("#frmOption_wh_cd").parent();
                                $("a.jqTransformSelectOpen", $wrapper).click();
                                break;
                        }
                    }
                    break;
                default:
                    //if (param.data.page != gw_com_api.getPageID()) break;
                    gw_com_api.setFocus("grdData_Find", "selected", "incode", true);
                    break;
            }

        } break;
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//