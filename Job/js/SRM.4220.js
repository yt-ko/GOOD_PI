//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 수입검사등록
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" }
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
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "추가", value: "검사등록", icon: "dialogue" },
                { name: "바코드", value: "검사등록(바코드)", icon: "dialogue" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Sub", type: "FREE",
            element: [
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "SRM_4220_M_1", type: "TABLE", title: "검사정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { label: 65, field: 130 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "검사번호", format: { type: "label" } },
                            { name: "chk_no", editable: { type: "hidden" } },
                            { header: true, value: "협 력 사", format: { type: "label" } },
                            { name: "rqst_dept_nm", editable: { type: "hidden" } },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "rqst_user", editable: { type: "text" } },
                            { header: true, value: "검 수 자", format: { type: "label" } },
                            { name: "chk_user_nm", editable: { type: "hidden" } },
                            { header: true, value: "검사일자", format: { type: "label" } },
                            { name: "chk_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "rqst_dept", hidden: true },
                            { name: "chk_user", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비    고", format: { type: "label" } },
                            { name: "rmk", editable: { type: "text", width: 1020 }, style: { colspan: 9 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", query: "", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "chk_result", validate: true },
            content: {
                width: { label: 65, field: 80 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "검사결과", format: { type: "label" } },
                            {
                                name: "chk_result", align: "center",
                                format: { type: "select", data: { memory: "검사결과" } },
                                editable: { type: "select", validate: { rule: "required" }, data: { memory: "검사결과" } }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4220_S_1", title: "검사목록",
            caption: true, width: "100%", height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "chk_qty", validate: true },
            element: [
                { header: "구분", name: "item_tp", width: 60 },
                {
                    header: "품번", name: "item_cd", width: 100,
                    editable: { type: "hidden" }
                },
                {
                    header: "품명", name: "item_nm", width: 150,
                    editable: { type: "hidden" }
                },
                {
                    header: "규격", name: "item_spec", width: 150,
                    editable: { type: "hidden" }
                },
                {
                    header: "Tracking", name: "track_no", width: 100,
                    editable: { type: "hidden" }
                },
                {
                    header: "Pallet No.", name: "pallet_no", width: 100,
                    editable: { type: "hidden" }
                },
                {
                    header: "납품수량", name: "dlv_qty", width: 40, align: "right",
                    editable: { type: "hidden" }
                },
                {
                    header: "단위", name: "pur_unit", width: 30, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "검사수량", name: "chk_qty", width: 40, align: "right",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "검사결과", name: "chk_result", width: 40, align: "center",
                    format: { type: "select", data: { memory: "검사결과" } },
                    editable: { type: "select", data: { memory: "검사결과" }, validate: { rule: "required" } }
                },
                {
                    header: "바코드", name: "barcode", width: 80, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "비고", name: "rmk", width: 150,
                    editable: { type: "text" }
                },
                { name: "chk_no", hidden: true, editable: { type: "hidden" } },
                { name: "chk_seq", hidden: true, editable: { type: "hidden" } },
                { name: "root_no", hidden: true, editable: { type: "hidden" } },
                { name: "root_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
        //=====================================================================================
        var args = {
            targetid: "frmOption2", edit: true,
            data: [
                { name: "chk_result", value: "1" }
            ]
        };
        //----------
        gw_com_module.formInsert(args);
        //=====================================================================================
    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_Main", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "바코드", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: click_lyrMenu_Main_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: click_lyrMenu_Main_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", grid: false, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function click_lyrMenu_Main_저장(ui) { processSave({}); }
        //----------
        function click_lyrMenu_Main_삭제(ui) { processDelete(ui); }
        //----------
        function click_lyrMenu_Main_닫기(ui) { processClose({}); }
        //=====================================================================================
        gw_com_module.startPage();

        v_global.logic.key = "";
        if (v_global.process.param != "") {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("chk_no");
            v_global.logic.supp_cd = gw_com_api.getPageParameter("supp_cd");
            v_global.logic.supp_nm = gw_com_api.getPageParameter("supp_nm");

            if (v_global.logic.key == "" || v_global.logic.key == "undefined")
                processInsert({ object: "Main", element: gw_com_api.getPageParameter("barcode") == "Y" ? "바코드" : "추가" }); // 신규 등록
            else
                processRetrieve({ key: v_global.logic.key }); //수정 및 조회
        }
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processItemChanged(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;

    if (ui.element == "Remark") {   // 복수행 입력란의 개행문자 치환
        vl = vl.replace(/\r\n/g, "CRLF");
        gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true);
    }

    if (ui.object == "frmOption2") {
        //일괄 적용
        for (var i = 1; i <= gw_com_api.getRowCount("grdData_Sub"); i++) {
            gw_com_api.selectRow("grdData_Sub", i, true);
            gw_com_api.setValue("grdData_Sub", i, ui.element, ui.value.current, true, true, true);
        }
    }
}
//----------
function popupDetail(ui) {
    v_global.logic.dlv_no = gw_com_api.getValue("frmData_Main", 1, "chk_no", false);
    v_global.logic.supp_cd = gw_com_api.getValue("frmData_Main", 1, "rqst_dept", false);
    v_global.logic.supp_nm = gw_com_api.getValue("frmData_Main", 1, "rqst_dept_nm", false);
    v_global.logic.dlv_date = gw_com_api.getValue("frmData_Main", 1, "chk_date", false);

    var args;
    var page;

    if (ui.element == "추가") {
        page = "SRM_4221";
        args = {
            type: "PAGE", page: page, title: "수입검사 등록"
            , width: 960, height: 440, locate: ["center", "top"], open: true
        };
    } else {
        page = "w_find_srm_dlvitem_barcode";
        args = {
            type: "PAGE", page: page, title: "바코드입력"
            , width: 500, height: 330, locate: ["center", "top"], open: true
        };
    }

    if (gw_com_module.dialoguePrepare(args) == false) { // POPUP 이 이미 열려 있을 때 : 초기값 전달
        // POPUP 창에 전달할 Data 변수값 설정

        var args = { //검색조건 초기값 전달 인자 설정
            page: page,
            param: {
                ID: gw_com_api.v_Stream.msg_selectPart_SCM
                , data: {
                    supp_cd: v_global.logic.supp_cd
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function checkCRUD(param) {

    if (param.sub) {
        var obj = "grdData_Sub";
        if (checkEditable({}))
            return gw_com_api.getCRUD(obj, "selected", true);
        else
            return ((gw_com_api.getSelectedRow(obj) == null) ? false : true);
    }
    else return gw_com_api.getCRUD("frmData_Main");

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
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_chk_no", value: param.key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main", select: true }
            , { type: "GRID", id: "grdData_Sub", focus: true, select: true }
        ],
        key: param.key//, handler_complete: popupDetail
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
    var args = {};

    if (param.object == "frmData_Main") {
        args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmData_Main",
                element: [
                    { name: "chk_no", argument: "arg_chk_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub", focus: true, select: true }
            ]
        };
    } else return;

    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {
        popupDetail(ui);
    }
    else {	// 요구서 추가
        if (gw_com_api.getValue("frmData_Main", "selected", "chk_user", false) == "") {

            var args = {
                targetid: "frmData_Main", edit: true, updatable: true,
                data: [
                    { name: "chk_date", value: gw_com_api.getDate("") }
                    , { name: "rqst_dept", value: v_global.logic.supp_cd }
                    , { name: "rqst_dept_nm", value: v_global.logic.supp_nm }
                    , { name: "chk_user", value: gw_com_module.v_Session.USR_ID }
                    , { name: "chk_user_nm", value: gw_com_module.v_Session.USR_NM }
                ],
                clear: [
                    { type: "GRID", id: "grdData_Sub" }
                ]
            };
            gw_com_module.formInsert(args);
        }

        // 검사목록 추가
        processInsert({ object: "lyrMenu_Sub", element: ui.element });
    }
}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected", focus: true, select: true }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_Main") {
        if (!checkManipulate({})) return;

        var status = checkCRUD({});
        if (status == "initialize" || status == "create") processClear({});
        else {
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        }
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () {
            if (this.NAME == "chk_no") {
                v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key });
            }
        });
    });

}
//----------
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main", key: { element: [{ name: "chk_no" }] } }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processClear(param);

}
//----------
function processClose(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
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
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            // PageId가 다를 때 Skip 
            if (param.data.page != gw_com_api.getPageID()) {
                param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            // 확인 메시지별 처리    
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_alert: {

                } break;
                case gw_com_api.v_Message.msg_confirmSave: {
                    if (param.data.result == "YES") processSave(param.data.arg);
                    else {
                        processClear({});
                        if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    }
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: {
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_confirmBatch: {
                    if (param.data.result == "YES") processBatch(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informSaved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informRemoved: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: {
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
        case gw_com_api.v_Stream.msg_selectedSupplier: {
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
                (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;

        // 검사 목록 선택 추가
        case gw_com_api.v_Stream.msg_selectedPart_SCM: {
            var args = { targetid: "grdData_Sub", edit: true, updatable: true };
            var nRow = gw_com_api.getRowCount("grdData_Sub");
            var nChkRow = 0;
            var nChkQty = 0;
            var sRqstDept, sRqstDeptNM, sRqstUser, sRqstUser;
            $.each(param.data.rows, function () {
                if (gw_com_api.getValue("frmData_Main", "selected", "rqst_dept") != "" &&
                    gw_com_api.getValue("frmData_Main", "selected", "rqst_dept") != this.rqst_dept) {
                    gw_com_api.messageBox([{ text: "협력사 정보가 일치하지 않습니다." }]);
                } else {

                    nChkRow = gw_com_api.getFindRow("grdData_Sub", "barcode", this.barcode);
                    if (this.label_tp == "1") {
                        //개별
                        nChkQty = 1;
                    } else {
                        nChkQty = Number(this.dlv_qty);
                    }

                    if (nChkRow > 0) {
                        nRow = nChkRow;
                        nChkQty += Number(gw_com_api.getValue("grdData_Sub", nRow, "chk_qty", true));
                        gw_com_api.setValue("grdData_Sub", nRow, "chk_qty", nChkQty, true);
                    } else {
                        args.data = [
                            { name: "item_cd", value: this.item_cd },
                            { name: "item_nm", value: this.item_nm },
                            { name: "item_spec", value: this.item_spec },
                            { name: "track_no", value: this.track_no },
                            { name: "pallet_no", value: this.pallet_no },
                            { name: "dlv_qty", value: this.dlv_qty },
                            { name: "pur_unit", value: this.unit },
                            { name: "chk_qty", value: nChkQty },
                            { name: "barcode", value: this.barcode },
                            { name: "root_no", value: this.dlv_no },
                            { name: "root_seq", value: this.dlv_seq }
                        ];
                        nRow = gw_com_module.gridInsert(args);
                        sRqstDept = this.rqst_dept;
                        sRqstDeptNM = this.rqst_dept_nm;
                        sRqstUser = this.rqst_user;
                    }

                    var sChk;
                    if (gw_com_api.getValue("grdData_Sub", nRow, "dlv_qty", true) == gw_com_api.getValue("grdData_Sub", nRow, "chk_qty", true)) {
                        sChk = "1";
                    } else {
                        sChk = "0";
                    }
                    gw_com_api.setValue("grdData_Sub", nRow, "chk_result", sChk, true);
                    gw_com_api.setValue("frmData_Main", "selected", "rqst_dept", sRqstDept, false);
                    gw_com_api.setValue("frmData_Main", "selected", "rqst_dept_nm", sRqstDeptNM, false);
                    gw_com_api.setValue("frmData_Main", "selected", "rqst_user", sRqstUser, false);
                }
            });

            if (param.from.page == "SRM_4221")
                closeDialogue({ page: param.from.page, focus: true });
        } break;

        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) {
                case "SRM_4221":
                case "w_find_srm_dlvitem_barcode": {
                    args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                    args.data = { supp_cd: v_global.logic.supp_cd };
                } break;
            }
            gw_com_module.streamInterface(args);
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
    }

}