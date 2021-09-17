//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품 현황
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

        // prepare dialogue.
        var args = { type: "PAGE", page: "SRM_4111", title: "바코드 조회", width: 850, height: 450 };
        gw_com_module.dialoguePrepare(args);

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        // start
        start();

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: v_global.logic.Supp ? -10 : -5 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: v_global.logic.Supp ? 30 : 10 }));
            if (v_global.logic.Supp)
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.USR_ID);
            //----------
            gw_com_module.startPage();
            //----------
            if (v_global.process.param != "") {	// Page Parameter 변수 저장
                if (gw_com_api.getPageParameter("opt_ymd_fr") != "")
                    gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("opt_ymd_fr"));
                if (gw_com_api.getPageParameter("opt_ymd_to") != "")
                    gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("opt_ymd_to"));
                gw_com_api.setValue("frmOption", 1, "dlv_no", gw_com_api.getPageParameter("opt_dlv_no"));
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_api.getPageParameter("opt_supp_cd"));
                gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_api.getPageParameter("opt_supp_nm"));
                gw_com_api.setValue("frmOption", 1, "pur_no", gw_com_api.getPageParameter("opt_pur_no"));

                processRetrieve({});
            }

        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "납품서 등록", icon: "추가" },
                { name: "수정", value: "납품서 수정", icon: "추가" },
                //{ name: "바코드", value: "바코드 조회", icon: "실행" },
                { name: "출력", value: "납품서 출력", icon: "출력" },
                { name: "라벨", value: "라벨출력", icon: "출력" },
                { name: "라벨2", value: "라벨[A4(3X9)]", icon: "출력" },
                { name: "라벨3", value: "라벨[A4(2X4)]", icon: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        if (!v_global.logic.Supp)
            args.element.splice(3, 0, { name: "바코드", value: "바코드 조회", icon: "실행" });
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
                                style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "supp_nm", label: { title: "협력사 :" },
                                hidden: v_global.logic.Supp,
                                editable: { type: "text", size: 14 }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dlv_no", label: { title: "납품서번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "pur_no", label: { title: "발주번호 :" },
                                editable: { type: "text", size: 12 }
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
            targetid: "frmOption_Print", type: "FREE",
            trans: true, border: true, show: false,
            content: {
                row: [
                    {
                        element: [
                            { name: "PDF", value: "PDF", format: { type: "button", icon: "출력" } },
                            { name: "XLS", value: "엑셀", format: { type: "button", icon: "출력" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } },
                            { name: "rpt", hidden: true }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: (v_global.logic.Supp ? "SRM_4110_M_1_SUPP" : "SRM_4110_M_1"), title: "납품 현황",
            height: 160, show: true, selectable: true, number: true,
            element: [
                { header: "납품서번호", name: "dlv_no", width: 90, align: "center" },
                { header: "납품일자", name: "dlv_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "협력사", name: "supp_nm", width: 150, hidden: v_global.logic.Supp },
                { header: "품목수", name: "item_cnt", width: 50, align: "right", mask: "numeric-int" },
                { header: "담당자", name: "dlv_user", width: 60 },
                { header: "납품장소", name: "wh_nm", width: 120 },
                { header: "검사담당", name: "chk_user", width: 60, align: "center" },
                { header: "검사일시", name: "chk_dt", width: 150, align: "center" },
                { header: "인수자", name: "acp_user", width: 60, align: "center" },
                { header: "인계일시", name: "acp_dt", width: 150, align: "center" },
                { name: "supp_cd", hidden: true },
                { name: "pstat", hidden: true },
                { name: "astat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "SRM_4110_S_1", title: "납품 목록",
            caption: true, height: 400, pager: true, show: true, selectable: true, key: true, number: true, multi: true, checkrow: true,
            color: { row: true },
            element: [
                { header: "발주번호", name: "pur_no", width: 90 },
                { header: "품번", name: "item_cd", width: 120 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 150 },
                { header: "Tracking", name: "track_no", width: 100 },
                { header: "Pallet No.", name: "pallet_no", width: 80 },
                { header: "납기요청일", name: "req_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "발주", name: "pur_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "단위", name: "pur_unit", width: 40, align: "center" },
                { header: "납품", name: "dlv_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "라벨", name: "label_tp", width: 40, align: "center" },
                { header: "선입고", name: "direct_yn", width: 40, align: "center" },
                { header: "바코드", name: "barcode", width: 90 },
                { name: "dlv_no", hidden: true },
                { name: "dlv_seq", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //----------
        gw_com_module.informSize();
        //=====================================================================================

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "바코드", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "라벨", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "라벨2", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "라벨3", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_Print", element: "PDF", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_Print", element: "XLS", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_Print", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {

                case "조회":
                    {
                        viewOption(param.element);
                    }
                    break;
                case "추가":
                case "수정":
                    {
                        closeOption({});
                        processEdit(param);
                    }
                    break;
                case "바코드":
                    {
                        closeOption({});
                        processPop(param);
                    }
                    break;
                case "출력":
                case "라벨":
                case "라벨2":
                case "라벨3":
                    {
                        var m = (param.element == "출력" ? 300 : param.element == "라벨" ? 200 : param.element == "라벨2" ? 80 : 0);
                        gw_com_api.setValue("frmOption_Print", 1, "rpt", getExportTmp(param));
                        $("#frmOption_Print_data").css("padding-right", m);
                        viewOption(param.element);
                    }
                    break;
                case "PDF":
                case "XLS":
                    {
                        closeOption({});
                        var args = {
                            rpt: gw_com_api.getValue(param.object, param.row, "rpt"),
                            print: param.element
                        }
                        if (param.element == "XLS") {
                            if (args.rpt == "label2")
                                args.rpt = "label2_xls";
                            else if (args.rpt == "label3")
                                args.rpt = "label3_xls";
                        }
                        checkExportable(args);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "실행":
                    {
                        closeOption({});
                        processRetrieve({});
                    }
                    break;
                default:
                    {
                        closeOption({});
                    }

            }

        }
        //----------
        function processRowselected(param) {

            closeOption({});
            processRetrieve(param);

        }
        //=====================================================================================
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption(id) {

    if (id == "조회") {
        id = "frmOption";
        gw_com_api.hide("frmOption_Print");
    } else {
        id = "frmOption_Print";
        gw_com_api.hide("frmOption");
    }
    var args = { target: [{ id: id, focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption_Print");

}
//----------
function processPop(param) {

    switch (param.element) {
        case "바코드":
            {
                if (gw_com_api.getSelectedRow("grdData_Main") == null) {
                    gw_com_api.messageBox([{ text: "NOMASTER" }]);
                    return;
                }
                v_global.event.data = {
                    dlv_no: gw_com_api.getValue("grdData_Main", "selected", "dlv_no", true)
                };
                var args = {
                    page: "SRM_4111",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);

            }
            break;
    }

}
//----------
function checkExportable(param) {

    if (gw_com_api.getSelectedRow("grdData_Main") == null) {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return;
    }

    if (gw_com_api.getValue("grdData_Main", "selected", "astat", true) == "") {

        var p = {
            handler: processExport,
            param: param
        };
        gw_com_api.messageBox([
            { text: "납품서/라벨 출력 후 내용을 수정할 수 없습니다." },
            { text: "계속 하시겠습니까?" }
        ], undefined, undefined, "YESNO", p);

    } else {

        processExport(param);

    }

}
//----------
function processExport(param) {

    var row = gw_com_api.getSelectedRow("grdData_Main");
    if (row == null) {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return;
    }

    var key = gw_com_api.getValue("grdData_Main", row, "dlv_no", true);
    var row = new Array();

    if (param.rpt != "rpt1") {

        var ids = gw_com_api.getSelectedRow("grdData_Sub", true);
        if (ids.length < 1) {
            gw_com_api.messageBox([{ text: "NODATA" }]);
            return;
        }

        $.each(ids, function () {
            row.push(gw_com_api.getValue("grdData_Sub", this, "dlv_seq", true));
        });

    }

    var sort_col = $("#grdData_Sub_data").jqGrid("getGridParam", "sortname");
    var sort_ord = $("#grdData_Sub_data").jqGrid("getGridParam", "sortorder");
    var args = {
        source: {
            type: "INLINE", json: true,
            argument: [
                { name: "arg_dlv_no", value: key },
                { name: "arg_dlv_seq", value: row.join(",").replace(/,/gi, "','") }
            ]
        },
        option: [
            { name: "PRINT", value: param.print },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "KEY", value: key },
            { name: "RPT", value: param.rpt },
            { name: "ROWS", value: row.join(",") },
            { name: "SORT_COLUMNS", value: sort_col },
            { name: "SORT_ORDER", value: sort_ord }
        ],
        handler: {
            success: sucessExport,
            param: { dlv_no: key }
        },
        target: { type: "FILE", id: "lyrDown", name: param.element }
    };
    gw_com_module.objExport(args);

}
//----------
function sucessExport(response, param) {

    var args = {
        key: [{
            KEY: [{ NAME: "dlv_no", VALUE: param.dlv_no }],
            QUERY: $("#grdData_Main_data").attr("query")
        }]
    };
    processRetrieve(args);

}
//----------
function getExportTmp(param) {
    
    var rtn = "rpt1";
    switch (param.element) {
        case "라벨":
            {
                rtn = "label1";
            }
            break;
        case "라벨2":
            {
                rtn = "label2";
            }
            break;
        case "라벨3":
            {
                rtn = "label3";
            }
            break;
    }
    return rtn;

}
//----------
function processEdit(param) {

    var dlv_no = "";
    if (param.element == "수정") {
        var row = gw_com_api.getSelectedRow("grdData_Main");
        if (row == null) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return;
        }
        dlv_no = gw_com_api.getValue("grdData_Main", row, "dlv_no", true);
        var auth = (checkEditable({ dlv_no: dlv_no }) ? "U" : "R");
    }

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "SRM_4120", title: "납품서 등록/수정",
            param: [
                { name: "AUTH", value: auth },
                { name: "dlv_no", value: dlv_no },
                { name: "opt_ymd_fr", value: gw_com_api.getValue("frmOption", "selected", "ymd_fr", false) },
                { name: "opt_ymd_to", value: gw_com_api.getValue("frmOption", "selected", "ymd_to", false) },
                { name: "opt_dlv_no", value: gw_com_api.getValue("frmOption", "selected", "dlv_no", false) },
                { name: "opt_supp_cd", value: gw_com_api.getValue("frmOption", "selected", "supp_cd", false) },
                { name: "opt_supp_nm", value: gw_com_api.getValue("frmOption", "selected", "supp_nm", false) },
                { name: "opt_pur_no", value: gw_com_api.getValue("frmOption", "selected", "pur_no", false) }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processRetrieve(param) {

    if (param.object == "grdData_Main") {

        var args = {
            key: param.key,
            source: {
                type: "GRID", id: "grdData_Main", row: "selected", block: true,
                element: [
                    { name: "dlv_no", argument: "arg_dlv_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub" }
            ],
            handler_complete: function () {

                $("#cb_grdData_Sub_data").attr("checked", true);
                $("#cb_grdData_Sub_data").trigger('click');
                $("#cb_grdData_Sub_data").attr("checked", true);

            }
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        var args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "dlv_no", argument: "arg_dlv_no" },
                    { name: "supp_cd", argument: "arg_supp_cd" },
                    { name: "supp_nm", argument: "arg_supp_nm" },
                    { name: "pur_no", argument: "arg_pur_no" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "dlv_no" }] },
                    { element: [{ name: "supp_nm" }] },
                    { element: [{ name: "pur_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Main", focus: true, select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" }
            ]
        };
        gw_com_module.objRetrieve(args);

    }

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
//----------
function checkEditable(param) {

    var rtn = false;
    var args = {
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=SRM_4110_M_1_E" +
            "&QRY_COLS=editable" +
            "&CRUD=R" +
            "&arg_dlv_no=" + param.dlv_no,
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        rtn = (data[0].DATA[0] == "1");

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
            } break;
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
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove(param.data.arg);
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
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.result == "OK" || param.data.result == "YES") {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "SRM_4111":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
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
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//