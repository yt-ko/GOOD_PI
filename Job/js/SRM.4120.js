//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var chkRows;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // TEST : 수정상태 확인용
        //gw_com_module.v_Option.authority.control = "U";

        //// prepare dialogue.
        //var args = { type: "PAGE", page: "SRM_4121", title: "납품대상 품목 선택", width: 1100, height: 610 };
        //gw_com_module.dialoguePrepare(args);

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "라벨유형",
                    data: [{ title: "개별", value: "1" }, { title: "통합", value: "2" }]
                },
                {
                    type: "INLINE", name: "dddwDlvGrade",
                    data: [{ title: "A", value: "A" }, { title: "B", value: "B" }]
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
            gw_com_module.startPage();

            v_global.logic.key = "";
            if (v_global.process.param != "") {
                v_global.logic.key = gw_com_api.getPageParameter("dlv_no");
                v_global.logic.opt_ymd_fr = gw_com_api.getPageParameter("opt_ymd_fr");
                v_global.logic.opt_ymd_to = gw_com_api.getPageParameter("opt_ymd_to");
                v_global.logic.opt_dlv_no = gw_com_api.getPageParameter("opt_dlv_no");
                v_global.logic.opt_supp_cd = gw_com_api.getPageParameter("opt_supp_cd");
                v_global.logic.opt_supp_nm = gw_com_api.getPageParameter("opt_supp_nm");
                v_global.logic.opt_pur_no = gw_com_api.getPageParameter("opt_pur_no");
            }

            if (v_global.logic.key == "")
                processInsert({});
            else
                processRetrieve({ key: v_global.logic.key });
        }

    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                //{ name: "추가", value: "추가" },
                { name: "REMOVE", value: "삭제", icon: "삭제" },
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
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", query: "", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "label_tp", validate: true },
            content: {
                width: { label: 50, field: 60 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "라벨", format: { type: "label" } },
                            {
                                name: "label_tp", align: "center",
                                format: { type: "select", data: { memory: "라벨유형" } },
                                editable: { type: "select", validate: { rule: "required" }, data: { memory: "라벨유형" } }
                            },
                            { header: true, value: "선입고", format: { type: "label" } },
                            {
                                name: "direct_yn", align: "center",
                                format: { type: "checkbox", title: "", value: 1, offval: 0 },
                                editable: { type: "checkbox", title: "", value: 1, offval: 0 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //----------
        var args = {
            targetid: "frmOption2", edit: true,
            data: [
                { name: "direct_yn", value: 0 }
            ]
        };
        //----------
        gw_com_module.formInsert(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "SRM_4120_M_1", type: "TABLE", title: "납품 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "str_time", validate: true },
            content: {
                width: { label: 90, field: 170 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "납품번호", format: { type: "label" } },
                            { name: "dlv_no", editable: { type: "hidden" } },
                            { header: true, value: "공급사", format: { type: "label" } },
                            { name: "supp_nm", editable: { type: "hidden" } },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "검사담당", format: { type: "label" } },
                            { name: "chk_user_nm" },
                            { header: true, value: "검사일시", format: { type: "label" } },
                            { name: "chk_dt" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "납품일자", format: { type: "label" } },
                            {
                                name: "dlv_date", mask: "date-ymd",
                                editable: { type: "text", validate: { rule: "required" } }
                            },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "dlv_user", editable: { type: "text", maxlength: 10 } },
                            { header: true, value: "납품장소", format: { type: "label" } },
                            { name: "wh_nm", editable: { type: "hidden" }, display: true },
                            { header: true, value: " ", format: { type: "label" } },
                            { name: "dlv_grade", hidden: true },
                            { name: "wh_cd", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4120_S_1", title: "납품 목록",
            caption: true, height: "500", pager: true, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "dlv_qty", validate: true },
            element: [
                { header: "발주번호", name: "pur_no", width: 80, editable: { type: "hidden" } },
                { header: "품번", name: "item_cd", width: 100, editable: { type: "hidden" } },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 150 },
                { header: "Tracking", name: "track_no", width: 90, editable: { type: "hidden" } },
                { header: "Pallet No.", name: "pallet_no", width: 80, editable: { type: "hidden" } },
                { header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd", editable: { type: "hidden" } },
                { header: "PO수량", name: "pur_qty", width: 50, align: "right" },
                { header: "단위", name: "pur_unit", width: 40, align: "center" },
                {
                    header: "납품수량", name: "dlv_qty", width: 50, align: "right",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "등급", name: "dlv_grade", width: 40, align: "center",
                    format: { type: "select", data: { memory: "dddwDlvGrade" } },
                    editable: { type: "select", validate: { rule: "required" }, data: { memory: "dddwDlvGrade" } }
                },
                {
                    header: "라벨", name: "label_tp", width: 40, align: "center",
                    format: { type: "select", data: { memory: "라벨유형" } },
                    editable: { type: "select", validate: { rule: "required" }, data: { memory: "라벨유형" } }
                },
                {
                    header: "선입고", name: "direct_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: 1, offval: 0 },
                    editable: { type: "checkbox", value: 1, offval: 0 }
                },
                { name: "dlv_no", hidden: true, editable: { type: "hidden" } },
                { name: "dlv_seq", hidden: true, editable: { type: "hidden" } },
                { name: "pur_seq", hidden: true, editable: { type: "hidden" } }
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

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_Main", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "REMOVE", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", grid: false, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_Sub", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Sub", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "추가":
                    {
                        processInsert(param);
                    }
                    break;
                case "REMOVE":
                    {
                        processDelete(param);
                    }
                    break;
                case "삭제":
                    {
                        processDelete(param);
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
            }

        }
        //----------
        function processItemChanged(param) {

            if (param.object == "frmOption2") {
                //일괄 적용
                for (var i = 1; i <= gw_com_api.getRowCount("grdData_Sub"); i++) {
                    gw_com_api.selectRow("grdData_Sub", i, true);
                    gw_com_api.setValue("grdData_Sub", i, param.element, param.value.current, true, true, true);
                }
            }

        }
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_File1" }
        ],
        param: param
    };

    if (param.target != undefined) {
        args.target = [param.target];
    }

    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_dlv_no", value: param.key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main", select: true }
            , { type: "GRID", id: "grdData_Sub" }
        ],
        key: param.key, handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_Sub") {

        if (!checkManipulate({})) return;
        if (gw_com_api.getValue("frmData_Main", 1, "dlv_no") == "") {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }

    }

    if (!checkUpdatable({ check: true, target: { type: "GRID", id: "grdData_Sub" } })) {
        return;
    }

    v_global.event.data = {
        dlv_no: gw_com_api.getValue("frmData_Main", 1, "dlv_no")
    };

    var args = {
        type: "PAGE", page: "SRM_4121", title: "납품대상 품목 선택",
        width: 1140, height: 620, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: "SRM_4121",
            param: {
                ID: gw_com_api.v_Stream.msg_openDialogue,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {

        var args = { targetid: "grdData_Sub", row: "selected", select: true }
        gw_com_module.gridDelete(args);

    } else if (ui.object == "lyrMenu_Main") {

        if (!checkManipulate({})) return;

        var status = checkCRUD({});
        if (status == "initialize" || status == "create") processClear({});
        else {
            if (gw_com_api.getValue("frmData_Main", 1, "dlv_no") == "") return;
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        }

    } else
        return;

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

    //v_global.logic.key = "";
    //$.each(response, function () {
    //    $.each(this.KEY, function () {
    //        if (this.NAME == "dlv_no") {
    //            v_global.logic.key = this.VALUE;
    //            return false;
    //        }
    //    });
    //    if (v_global.logic.key != "")
    //        return false;
    //});
    processRetrieve({ key: v_global.logic.key });

}
//----------
function processRemove(param) {

    var args = {
        dlv_no: gw_com_api.getValue("frmData_Main", 1, "dlv_no", false, true),
        message: true
    };
    if (checkRemovable(args)) {

        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", key: { element: [{ name: "dlv_no" }] } }
            ],
            handler: { success: successRemove, param: param }
        };
        gw_com_module.objRemove(args);

    }

}
//----------
function successRemove(response, param) {

    processClear(param);

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "SRM_4110", title: "납품서 현황",
            param: [
                { name: "opt_ymd_fr", value: v_global.logic.opt_ymd_fr },
                { name: "opt_ymd_to", value: v_global.logic.opt_ymd_to },
                { name: "opt_dlv_no", value: v_global.logic.opt_dlv_no },
                { name: "opt_supp_cd", value: v_global.logic.opt_supp_cd },
                { name: "opt_supp_nm", value: v_global.logic.opt_supp_nm },
                { name: "opt_pur_no", value: v_global.logic.opt_pur_no }
            ]
        }
    };
    gw_com_module.streamInterface(args);

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
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element, (v_global.event.type == "GRID"));
    }

}
//----------
function checkRemovable(param) {

    var rtn = false;
    var args = {
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=SRM_4120_M_1_D" +
            "&QRY_COLS=deletable" +
            "&CRUD=R" +
            "&arg_dlv_no=" + param.dlv_no,
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        rtn = (data[0].DATA[0] == "1");
        if (!rtn && param.message) {
            gw_com_api.messageBox([{ text: "입고된 내역은 삭제할 수 없습니다." }]);
        }

    }
    //----------
    return rtn


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
                            if (param.data.result == "YES") processSave(param.data.arg);
                            else {
                                processClear({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove(param.data.arg);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.apply)
                                    processRun({});
                            } else {
                                processPop({ object: "lyrMenu_main" });
                            }
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "SRM_4121":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openDialogue;
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
                switch (param.from.page) {

                    case "SRM_4121":
                        {
                            if (param.data == undefined) return;
                            v_global.logic.key = param.data.dlv_no;
                            processRetrieve({ key: v_global.logic.key });
                            //if (checkCRUD(param) == "none") {

                            //    var args = {
                            //        targetid: "frmData_Main", edit: true, updatable: true,
                            //        data: [
                            //            { name: "dlv_date", value: gw_com_api.getDate("") },
                            //            { name: "supp_cd", value: param.data.supp_cd },
                            //            { name: "supp_nm", value: param.data.supp_nm },
                            //            { name: "pstat", value: "작성중" },
                            //            { name: "astat", value: "작성중" },
                            //            { name: "astat_user", value: gw_com_module.v_Session.USR_ID },
                            //            { name: "wh_cd", value: param.data.wh_cd },
                            //            { name: "wh_nm", value: param.data.wh_nm }
                            //        ],
                            //        clear: [
                            //            { type: "GRID", id: "grdData_Sub" }
                            //        ]
                            //    };
                            //    gw_com_module.formInsert(args);

                            //} else if (gw_com_api.getValue("frmData_Main", 1, "supp_cd") != param.data.supp_cd) {

                            //    gw_com_api.messageBox([{ text: "공급사를 잘못 선택했습니다." }]);
                            //    return;

                            //} else if (gw_com_api.getValue("frmData_Main", 1, "wh_cd") != param.data.wh_cd) {

                            //    gw_com_api.messageBox([{ text: "납품장소를 잘못 선택했습니다." }]);
                            //    return;

                            //}

                            //var args = { targetid: "grdData_Sub", edit: true, updatable: true, data: param.data.rows };
                            //gw_com_api.block();
                            //gw_com_module.gridInserts(args)
                            //gw_com_api.unblock();

                        }
                        break;

                }
            }
            break;
    }

}