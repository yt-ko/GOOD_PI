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
    data: null, logic: {}
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

        //----------
        var args = {
            request: [
                {
				    type: "PAGE", name: "상태", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "QMI41" }]
				},
				{
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();

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
                { name: "리셋", value: "초기화", icon: "실행" },
                { name: "바코드", value: "바코드", icon: "Dialogue" },
                { name: "검증", value: "검증", icon: "실행" },
				{ name: "확인", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "바코드 입력",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "barcode", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "barcode", label: { title: "바코드 :" },
                                    editable: { type: "text", size: 12, maxlength: 11 }
                                }
                            ]
                        },
                        {
                            element: [
                                { name: "검증", value: "검증", format: { type: "button", icon: "실행" } },
                                { name: "취소", value: "닫기", format: { type: "button", icon: "닫기" } }
                            ], align: "right"
                        }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PIC", query: "SRM_9811_2", title: "바코드 목록",
            caption: true, height: 160, show: true, selectable: true, number: true,
            editable: { bind: "select", validate: true },
            element: [
				{
				    header: "바코드", name: "barcode", width: 60, align: "center",
				    editable: { type: "hidden", width: 100 }
				},
                {
                    header: "품목수량", name: "pic_qty", width: 40, align: "right",
                    editable: { type: "hidden", width: 70 }, mask: "numeric-int"
                },
                {
                    header: "읽기횟수", name: "read_cnt", width: 40, align: "right",
                    editable: { type: "hidden", width: 70 }, mask: "numeric-int"
                },
                { header: "오류내용", name: "err_msg", width: 180, diplay: true },
                { name: "pic_no", editable: { type: "hidden" }, hidden: true },
                { name: "plant_cd", editable: { type: "hidden" }, hidden: true },
                { name: "sl_cd", editable: { type: "hidden" }, hidden: true },
                { name: "item_cd", editable: { type: "hidden" }, hidden: true },
                { name: "track_no", editable: { type: "hidden" }, hidden: true },
                { name: "err_cd", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_ITEMIO", query: "SRM_4940_S", title: "",
            caption: false, height: 100, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "수불일", name: "io_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "구분", name: "io_cd", width: 70, align: "center" },
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 130, align: "left" },
				{ header: "규격", name: "item_spec", width: 130, align: "left" },
				{ header: "Tracking", name: "track_no", width: 80, align: "center" },
				{
				    header: "수량", name: "io_qty", width: 50, align: "right",
				    fix: { mask: "numeric-int", margin: 1 }
				},
				{ header: "단위", name: "io_unit", width: 40, align: "center" },
                //{ header: "바코드", name: "barcode", width: 70, align: "center" },
				{ header: "ERP", name: "erp_flg", width: 40, align: "center" },
                {
                    header: "장비군", name: "plant_cd", width: 50, align: "center",
                    format: { type: "select", data: { memory: "장비군" } }
                },
                { header: "관리번호", name: "io_no", width: 80, align: "center" },
                { header: "순번", name: "io_seq", width: 40, align: "center" },
                { name: "io_flg", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_PIC", offset: 8 },
                { type: "GRID", id: "grdData_ITEMIO", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

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
        //----------
        var args = { targetid: "frmOption", element: "검증", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmOption", event: "itemkeyenter", handler: processRead };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmOption", element: "barcode", event: "keypress", handler: keypress };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "리셋", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "바코드", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "검증", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------

        //----------
        var args = { targetid: "grdData_PIC", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------

        $("#frmOption_barcode").bind("keydown", keypress);
    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "검증":
        case "확인":
            if (gw_com_api.getUpdatable("grdData_PIC", true)) {
                processSave({ nomessage: true, element: param.element });
            } else {
                processBatch(param);
            }
            break;
        case "리셋":
            var msg = "바코드 자료를 삭제하시겠습니까?";
            gw_com_api.messageBox(
                [{ text: msg }], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);
            break;
    }

}
//----------
function processBatch(param) {

    closeOption({});
    var args;
    switch (param.element) {
        case "리셋":
            args = {
                url: "COM",
                procedure: "sp_checkPIC",
                input: [
                    { name: "pic_no", value: v_global.logic.pic_no, type: "varchar" },
                    { name: "chk_tp", value: 2, type: "int" },
                    { name: "plant_cd", value: v_global.logic.plant_cd, type: "varchar" },
                    { name: "sl_cd", value: v_global.logic.sl_cd, type: "varchar" }
                ],
                handler: { success: processRetrieve }
            };
            break;
        case "검증":
            args = {
                url: "COM",
                procedure: "sp_checkPIC",
                //nomessage: true,
                input: [
                    { name: "pic_no", value: v_global.logic.pic_no, type: "varchar" }
                ],
                handler: { success: successBatch, param: param }
            };
            break;
        case "확인":
            args = {
                url: "COM",
                procedure: "sp_checkPIC",
                //nomessage: true,
                input: [
                    { name: "pic_no", value: v_global.logic.pic_no, type: "varchar" },
                    { name: "chk_tp", value: 1, type: "int" }
                ],
                handler: { success: processClose, param: { data: { check: true } } }
            };
            break;
    }
    gw_com_module.callProcedure(args);
}
//----------
function successBatch(param) {

    //gw_com_api.messageBox([{ text: "검증이 완료되었습니다." }]);
    processRetrieve({});

}
//----------
function keypress(param) {
    if (event.keyCode == 17 || event.keyCode == 13) {
        processRead({});
    } else {
        if (event.keyCode == 48 || event.keyCode == 49 || event.keyCode == 50 || event.keyCode == 51 || event.keyCode == 52 ||
            event.keyCode == 53 || event.keyCode == 54 || event.keyCode == 55 || event.keyCode == 56 || event.keyCode == 57 ||
            event.keyCode == 96 || event.keyCode == 97 || event.keyCode == 98 || event.keyCode == 99 || event.keyCode == 100 ||
            event.keyCode == 101 || event.keyCode == 102 || event.keyCode == 103 || event.keyCode == 104 || event.keyCode == 105) {
        } else {
            alert("잘못된 입력입니다.");
        }
    }
    return true;
}
//----------
function processRead(param) {

    var barcode = gw_com_api.getValue("frmOption", 1, "barcode");
    if (barcode == "") return true;
    var row = gw_com_api.getFindRow("grdData_PIC", "barcode", barcode);
    if (row > 0) {
        var read_cnt = Number(gw_com_api.getValue("grdData_PIC", row, "read_cnt", true));
        gw_com_api.setValue("grdData_PIC", row, "read_cnt", read_cnt + 1, true, true);
        if (gw_com_api.getCRUD("grdData_PIC", row, true) == "none" || gw_com_api.getCRUD("grdData_PIC", row, true) == "retrieve")
            gw_com_api.setCRUD("grdData_PIC", row, "modify", true);
        processRowselect({ object: "grdData_PIC", row: row });
    } else {
        var data = [
            { name: "pic_no", value: v_global.logic.pic_no },
            { name: "plant_cd", value: v_global.logic.plant_cd },
            { name: "sl_cd", value: v_global.logic.sl_cd },
            { name: "barcode", value: barcode },
            { name: "read_cnt", value: 1 }
        ];
        var args = {
            targetid: "grdData_PIC", edit: true, updatable: true,
            data: data
        };
        gw_com_module.gridInsert(args);
        processRowselect({ object: "grdData_PIC", row: gw_com_api.getRowCount("grdData_PIC") });
    }
    gw_com_api.setValue("frmOption", 1, "barcode", "");
    gw_com_api.setFocus("frmOption", 1, "barcode");

}
//----------
function processItemchanged(param) {

    switch (param.object) {
        case "frmOption":
            if (param.element == "barcode") {
                if (param.value.current != "") {
                    var row = gw_com_api.getFindRow("grdData_PIC", "barcode", param.value.current);
                    if (row > 0) {
                        var read_cnt = Number(gw_com_api.getValue("grdData_PIC", row, "read_cnt", true));
                        gw_com_api.setValue("grdData_PIC", row, "read_cnt", read_cnt + 1, true);
                    } else {
                        var data = [
                            { name: "pic_no", value: v_global.logic.pic_no },
                            { name: "plant_cd", value: v_global.logic.plant_cd },
                            { name: "sl_cd", value: v_global.logic.sl_cd },
                            { name: "barcode", value: param.value.current },
                            { name: "read_cnt", value: 1 }
                        ];
                        var args = {
                            targetid: "grdData_PIC", updatable: true,
                            data: data
                        };
                        gw_com_module.gridInsert(args);
                    }
                    //var args = { target: [{ type: "FORM", id: "frmOption" }] };
                    //gw_com_module.objClear(args);
                    gw_com_api.setValue("frmOption", 1, "barcode", "");
                }
            }
            break;
    }
}
//----------
function processRowselect(param) {

    gw_com_api.selectRow(param.object, param.row, true, false);

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdData_PIC") {
        if ($("#frmOption").is(":visible")) return;
        args = {
            source: {
                type: "GRID", id: "grdData_PIC", row: "selected",
                element: [
                    { name: "barcode", argument: "arg_barcode" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_ITEMIO" }
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };

    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_pic_no", value: v_global.logic.pic_no },
                    { name: "arg_plant_cd", value: v_global.logic.plant_cd },
                    { name: "arg_sl_cd", value: v_global.logic.sl_cd },
                    { name: "arg_item_cd", value: "%" },
                    { name: "arg_track_no", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_PIC" }
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {

    // 저장
    var args = {
        url: "COM",
        target: [
			{ type: "GRID", id: "grdData_PIC" }
        ],
        nomessage: (param.nomessage == undefined ? false : param.nomessage),
        handler: { success: successSave, param: param }
    };

    if (gw_com_module.objValidate(args) == false) return false;

    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processBatch(param);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

}
//----------
function viewOption(param) {

    gw_com_api.setValue("frmOption", 1, "barcode", "");
    gw_com_api.show("frmOption");
    gw_com_api.setFocus("frmOption", 1, "barcode");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_PIC" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.logic.pic_no = param.data.pic_no;
                v_global.logic.plant_cd = param.data.plant_cd;
                v_global.logic.sl_cd = param.data.sl_cd;
                processRetrieve({});
                viewOption({});
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
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(v_global.process.handler.param);
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
                            param.data.arg.handler(param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch(param.data.arg);
                        }
                        break;

                }
            }
            break;
    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//