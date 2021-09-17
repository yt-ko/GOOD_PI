//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
    logic: {}
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


        //----------
        var args = {
            request: [

                {
                    type: "INLINE", name: "이상구분",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "중심선 치우침", value: "중심선 치우침" },
                        { title: "RUN 이상", value: "RUN 이상" },
                        { title: "관리한계 이탈", value: "관리한계 이탈" }
                    ]
                },
                {
                    type: "PAGE", name: "검사항목", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "SPC010" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
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
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "관리도", value: "관리도", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA_FIND", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                style: { colfloat: "floating" }, mask: "date-ymd",
                                name: "ymd_fr", label: { title: "대상기간 :" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                style: { colfloat: "floating" }, mask: "date-ymd",
                                name: "ymd_to", label: { title: "~" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ncr_nm", label: { title: "이상구분 :" },
                                editable: { type: "select", data: { memory: "이상구분" } }
                            }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                  editable: { type: "text", size: 14 }
                              },
                              {
                                  name: "qcitem_nm", label: { title: "검사항목 :" }, mask: "search",
                                  editable: { type: "text", size: 20 }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "item_no", label: { title: "품번 :" }, mask: "search",
                                  editable: { type: "text", size: 8 }
                              },
                              {
                                  name: "item_nm", label: { title: "품명 :" }, mask: "search",
                                  editable: { type: "text", size: 29 }
                              },
                              { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                              { name: "qcitem_cd", hidden: true, editable: { type: "hidden" } },
                              { name: "item_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", format: { type: "button" }, act: true },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "SPC_3020_M_1", title: "발생 현황",
            caption: true, height: 165, show: true, selectable: true,
            //editable: { master: true, bind: "select", focus: "mod_id", validate: true },
            element: [
                { header: "협력사", name: "supp_nm", width: 150, align: "center", },
                { header: "품번", name: "item_no", width: 70, align: "center" },
                { header: "품명", name: "item_nm", width: 220, align: "center" },
                {
                    header: "검사항목", name: "qc_item", width: 150, align: "center",
                    format: {
                        type: "select", validate: { rule: "required" },
                        data: { memory: "검사항목" }
                    }
                },
                { header: "검사시작일", name: "qcfr_ymd", width: 90, align: "center", mask: "date-ymd" },
                { header: "검사종료일", name: "qcto_ymd", width: 90, align: "center", mask: "date-ymd" },
                { header: "이상구분", name: "ncr_nm", width: 110, align: "center", },
                { header: "표본수/측정값", name: "sample_qty", width: 83, align: "right", mask: "numeric-float3" },
                { header: "기준값", name: "base_qty", width: 70, align: "right", mask: "numeric-float3" },
                { header: "부적합수량", name: "ncr_qty", width: 70, align: "right", mask: "numeric-float2", },
                { header: "부적합률", name: "ncr_rate", width: 70, align: "right", mask: "numeric-float2" },
                { header: "상하구분", name: "upper_yn", width: 50, align: "center" },
                { header: "NCR 발생일", name: "ncr_date", width: 80, align: "center", mask: "date-ymd" },
                {
                    header: "알람여부", name: "alarm_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { name: "spc_id", hidden: true },
                { name: "supp_cd", hidden: true },
                { name: "qc_item_nm", hidden: true },
                { name: "qc_no", hidden: true }

            ]
        };
        //----------
        gw_com_module.gridCreate(args);

        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SPC_3020_S_1", title: "측정 Data",
            caption: true, height: 165, show: true, selectable: true,
            element: [
                { header: "순번", name: "spc_seq", width: 40, align: "center", },
                { header: "측정일", name: "qc_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "Ser No.", name: "ser_no", width: 100, align: "center" },
                { header: "측정치", name: "qc_val", width: 70, align: "right", mask: "numeric-float", },
                { header: "단위", name: "qc_uom", width: 70, align: "center" },
                { header: "공정값", name: "nor_val", width: 70, align: "right", mask: "numeric-float" },
                { header: "관리하한", name: "lsl_val", width: 70, align: "right", mask: "numeric-float" },
                { header: "관리상한", name: "usl_val", width: 70, align: "right", mask: "numeric-float" },
                { name: "qcd_id", hidden: true }
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: click_lyrMenu_1_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "관리도", event: "click", handler: click_lyrMenu_1_관리도 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회(ui) {

            var args = {
                target: [{ id: "frmOption", focus: true }]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_관리도(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "SPC_3010_TEST",
                    title: "SPC 관리도",
                    param: [
                        { name: "AUTH", value: "R" },
                        { name: "ymd_fr", value: gw_com_api.getValue("grdData_Main", "selected", "qcfr_ymd", true) },
                        { name: "ymd_to", value: gw_com_api.getValue("grdData_Main", "selected", "qcto_ymd", true) },
                        { name: "qc_item", value: gw_com_api.getValue("grdData_Main", "selected", "qc_item", true) },
                        { name: "qc_item_nm", value: gw_com_api.getValue("grdData_Main", "selected", "qc_item_nm", true) },
                        { name: "supp_cd", value: gw_com_api.getValue("grdData_Main", "selected", "supp_cd", true) },
                        { name: "supp_nm", value: gw_com_api.getValue("grdData_Main", "selected", "supp_nm", true) },
                        { name: "item_no", value: gw_com_api.getValue("grdData_Main", "selected", "item_no", true) },
                        { name: "item_nm", value: gw_com_api.getValue("grdData_Main", "selected", "item_nm", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

        gw_com_module.startPage();
        //----------
        //processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processSearch(param) {

    switch (param.element) {
        case "supp_nm":
        case "item_nm":
        case "item_no":
        case "qcitem_nm":
            {
                v_global.event.type = param.type;
                v_global.event.object = param.object;
                v_global.event.row = param.row;
                v_global.event.element = param.element;
                var args = {
                    type: "PAGE",
                    locate: ["center", "top"],
                    page: "w_find_qcitem",
                    title: "검사항목",
                    width: 800,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_find_qcitem",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectProduct_QCM,
                            data: {
                                ymd_fr: gw_com_api.getValue("frmOption", 1, "ymd_fr"),
                                ymd_to: gw_com_api.getValue("frmOption", 1, "ymd_to")
                            }

                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }
    //case "supp_nm":
    //    {
    //        v_global.event.type = param.type;
    //        v_global.event.object = param.object;
    //        v_global.event.row = param.row;
    //        v_global.event.element = param.element;
    //        var args = {
    //            type: "PAGE",
    //            page: "DLG_SUPPLIER",
    //            title: "협력사 선택",
    //            width: 600,
    //            height: 450,
    //            open: true
    //        };
    //        if (gw_com_module.dialoguePrepare(args) == false) {
    //            var args = {
    //                page: "DLG_SUPPLIER",
    //                param: {
    //                    ID: gw_com_api.v_Stream.msg_selectSupplier
    //                }
    //            };
    //            gw_com_module.dialogueOpen(args);
    //        }
    //    }
    //    break;

}
//----------
function processItemchanged(param) {
    if (gw_com_api.getValue("frmOption", 1, "supp_nm") == "")
        gw_com_api.setValue("frmOption", 1, "supp_cd", "")
}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_Main", "selected", true);

}
//----------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "supp_cd", argument: "arg_supp_cd" },
                { name: "item_no", argument: "arg_item_no" },
                { name: "qcitem_cd", argument: "arg_qcitem_cd" },
                { name: "ncr_nm", argument: "arg_ncr_nm" },
            ],
            remark: [
                { element: [{ name: "dept_area" }] },
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "supp_nm" }] },
                { element: [{ name: "item_nm" }] },
                { element: [{ name: "qcitem_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", select: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_Sub" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLinkEnd() {
    var qc_no = gw_com_api.getValue("grdData_Main", "selected", "qc_no", true);

    if (qc_no != "0") {
        var ids = gw_com_api.getRowIDs("grdData_Sub");

        $.each(ids, function () {
            if (qc_no == gw_com_api.getValue("grdData_Sub", this, "qcd_id", true)) {
                gw_com_api.selectRow("grdData_Sub", this, true);
            }
        });
    }
}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_Main", row: "selected", block: true,
            element: [
                { name: "spc_id", argument: "arg_spc_id" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub" }
        ],
        handler: {
            complete: processLinkEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
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
//----------
function successRemove(response, param) {

    processDelete({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectedProduct_QCM:
            {
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "ymd_fr",
                                    param.data.ymd_fr,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "ymd_to",
                                    param.data.ymd_to,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "item_no",
                                    param.data.item_no,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "item_nm",
                                    param.data.item_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "qcitem_cd",
                                    param.data.qcitem_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "qcitem_nm",
                                    param.data.qcitem_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "supp_cd",
                                    param.data.supp_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "supp_nm",
                                    param.data.supp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
            //case gw_com_api.v_Stream.msg_selectedSupplier:
            //    {
            //        gw_com_api.setValue(v_global.event.object,
            //	                        v_global.event.row,
            //	                        "supp_cd",
            //	                        param.data.supp_cd,
            //	                        (v_global.event.type == "GRID") ? true : false);
            //        gw_com_api.setValue(v_global.event.object,
            //	                        v_global.event.row,
            //	                        "supp_nm",
            //	                        param.data.supp_nm,
            //	                        (v_global.event.type == "GRID") ? true : false);
            //        closeDialogue({ page: param.from.page, focus: true });
            //    }
            //    break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
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
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//