//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 검사 현황
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

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "라벨유형",
                    data: [
                        { title: "개별", value: "1" },
                        { title: "통합", value: "2" },
                        { title: "-", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "검사결과",
                    data: [
                        { title: "합격", value: "1" },
                        { title: "불합격", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "검사여부",
                    data: [
                        { title: "전체", value: "0" },
                        { title: "검사완료", value: "1" },
                        { title: "미검사", value: "2" }
                    ]
                },
                {
                    type: "INLINE", name: "일자",
                    data: [
                        { title: "납품일자", value: "납품일자" },
                        { title: "검사일자", value: "검사일자" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);


        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "검사등록", icon: "Dialogue" },
                { name: "바코드", value: "검사등록(바코드)", icon: "Dialogue" },
                { name: "수정", value: "수정", icon: "추가" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "ymd_fr", label: { title: "납품일자 :" }, mask: "date-ymd",
                                    style: { colfloat: "float" },
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                    style: { colfloat: "floating" },
                                    editable: { type: "text", size: 7, maxlength: 10 }
                                },
                                {
                                    name: "date_tp", label: { title: "" },
                                    style: { colfloat: "floated" },
                                    editable: {
                                        type: "select",
                                        data: { memory: "일자" }
                                    }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "supp_nm", label: { title: "협력사 :" },
                                    editable: { type: "text", size: 14 }
                                },
                                {
                                    name: "chk_yn", label: { title: "검사여부 :" }, value: "0",
                                    editable: {
                                        type: "select",
                                        data: { memory: "검사여부" }
                                    }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "track_no", label: { title: "Tracking :" },
                                    editable: { type: "text", size: 14, maxlength: 20 }
                                }
                            ]
                        },
                        {
                            element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                            ], align: "right"
                        }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "SRM_4210_M_1", title: "검사 현황",
            caption: false, height: 150, show: true, selectable: true, number: true, // dynamic: true, multi: true, checkrow: true,
            element: [
                { header: "협력사", name: "supp_nm", width: 450 },
                {
                    header: "수량합계", name: "item_qty", width: 100, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "검사", name: "chk_1_qty", width: 100, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "미검사", name: "chk_0_qty", width: 100, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "합격", name: "chk_result_1_qty", width: 100, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "불합격", name: "chk_result_0_qty", width: 100, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4210_S_1", title: "검사 목록",
            caption: true, height: 300, pager: true, show: true, selectable: true, number: true,
            element: [
                { header: "납품서번호", name: "dlv_no", width: 100, align: "center" },
                { header: "순번", name: "dlv_seq", width: 30, align: "center", hidden: true },
                { header: "구분", name: "item_tp", width: 60 },
                { header: "품번", name: "item_cd", width: 100 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 150 },
                { header: "Tracking", name: "track_no", width: 100 },
                { header: "Pallet No.", name: "pallet_no", width: 100 },
                {
                    header: "수량", name: "issue_qty", width: 60, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { header: "단위", name: "unit", width: 30, align: "center" },
                {
                    header: "검사수량", name: "chk_qty", width: 60, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "결과", name: "chk_result", width: 40, align: "center",
                    format: { type: "select", data: { memory: "검사결과" } }
                },
                { header: "유형", name: "check_yn_nm", width: 40, align: "center" },
                {
                    header: "여부", name: "chk_yn", width: 60, align: "center",
                    format: { type: "select", data: { memory: "검사여부" } }
                },
                { header: "바코드", name: "barcode", width: 80, align: "center" },
                {
                    header: "라벨", name: "label_tp", width: 30, align: "center",
                    format: { type: "select", data: { memory: "라벨유형" } }
                },
                { header: "검사자", name: "chk_user_nm", width: 50, align: "center" },
                { header: "검사일자", name: "chk_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "비고", name: "rmk", width: 100, align: "left" },
                { name: "chk_no", hidden: true },
                { name: "chk_seq", hidden: true },
                { name: "chk_result", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "바코드", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function click_lyrMenu_조회(ui) { viewOption(); }
        //----------
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        function click_frmOption_취소(ui) { gw_com_api.hide("frmOption"); }
        //----------
        function rowselected_grdData_Main(ui) { processLink(ui); }
        //=====================================================================================
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -5 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
        //----------
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {

        switch (param.element) {
            case "date_tp":
                gw_com_api.setAttribute(param.object, 1, "ymd_fr", "label", param.value.current + " :");
                var obj = document.getElementsByTagName("label");
                for (var i = 0; i < obj.length; i++) {
                    var label = obj[i];
                    if (label.innerHTML == "납품일자 :" || label.innerHTML == "검사일자 :") {
                        label.innerHTML = param.value.current + " :"
                    }
                }
                break;
        }

    }
}
//----------
function processExport(param) {
}
//----------
function viewOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}

//---------- Main Button : 추가 & 수정 (ui.type/object/row/element)
function processEdit(param) {

    // 0. Set editing mode (Insert or Update)
    var isNewMode;
    var isBarcode;
    if (param.object == "lyrMenu" && param.element == "추가") {
        isNewMode = true;
        isBarcode = "N";
    }
    else if (param.object == "lyrMenu" && param.element == "바코드") {
        isNewMode = true;
        isBarcode = "Y";
    }
    else if (param.object == "lyrMenu" && param.element == "수정") isNewMode = false;
    else if (param.object == "grdData_Main") isNewMode = false;
    else return;

    var sSuppCd, sSuppNm;
    var sChkNo;

    if (isNewMode) {
        sSuppCd = "";
        sSuppNm = "";
    } else {
        // 1-1. Check selection of row for editing
        if (gw_com_api.getSelectedRow("grdData_Main") == null) {
            gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
            return false;
        }

        // 협력사 설정
        sSuppCd = gw_com_api.getValue("grdData_Main", "selected", "supp_cd", true);
        sSuppNm = gw_com_api.getValue("grdData_Main", "selected", "supp_nm", true);

        // 검사번호 설정
        sChkNo = gw_com_api.getValue("grdData_Sub", "selected", "chk_no", true);

        if (sChkNo == "")
            return;
    }

    // 2. Convert to editing mode
    // Open link page to tabpage of parent page : SRM_4220 수정
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "SRM_4220", title: "검사 등록 및 수정",
            param: [
                { name: "chk_no", value: sChkNo },
                { name: "supp_cd", value: sSuppCd },
                { name: "supp_nm", value: sSuppNm },
                { name: "barcode", value: isBarcode }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processDetail(param) {
}
//----------
function successSave(response, param) {
    processRetrieve({});
}
//----------
function processDelete() {
}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // 엑셀 다운로드 예외처리
    $("#grdData_Main_data").attr("query", (gw_com_api.getValue("frmOption", 1, "date_tp") == "납품일자" ? "SRM_4210_M_1" : "SRM_4210_M_2"));

    // Retrieve
    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "date_tp", argument: "arg_date_tp" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "supp_nm", argument: "arg_supp_nm" },
                { name: "chk_yn", argument: "arg_chk_yn" },
                { name: "track_no", argument: "arg_track_no" }
            ],
            remark: [
                { title: "test", infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "supp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", focus: true, select: true/*, query: (gw_com_api.getValue("frmOption", 1, "date_tp") == "납품일자" ? "SRM_4210_M_1" : "SRM_4210_M_2")*/ }
        ],
        clear: [
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    // 엑셀 다운로드 예외처리
    $("#grdData_Sub_data").attr("query", (gw_com_api.getValue("frmOption", 1, "date_tp") == "납품일자" ? "SRM_4210_S_1" : "SRM_4210_S_2"));

    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", block: true,
            element: [
                { name: "date_tp", argument: "arg_date_tp" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "chk_yn", argument: "arg_chk_yn" },
                { name: "track_no", argument: "arg_track_no" }
            ],
            argument: [
                { name: "arg_supp_cd", value: gw_com_api.getValue("grdData_Main", "selected", "supp_cd", true) }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub", focus: true, select: true/*, query: (gw_com_api.getValue("frmOption", 1, "date_tp") == "납품일자" ? "SRM_4210_S_1" : "SRM_4210_S_2")*/ }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") processEdit(param.data.arg);
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processDelete({});
                                else if (status == "update") processRestore({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }   // End of switch (param.data.ID)
            }
            break;    // End of case gw_com_api.v_Stream.msg_resultMessage
        case gw_com_api.v_Stream.msg_retrieve:
            {
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = { targetid: "grdData_Main", row: v_global.event.row }
                gw_com_module.gridDelete(args);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "INFO_VOC":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECR;
                        }
                        break;
                    case "INFO_SPC":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECR;
                        }
                        break;
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                        }
                        break;
                }
                args.data = {
                    dlv_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dlv_no", true),
                    voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "dlv_no", true)
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