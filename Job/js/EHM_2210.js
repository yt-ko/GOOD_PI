//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.07)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { type: "PAGE", page: "EHM_2211", title: "반입목적 선택", width: 600, height: 350 };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "EHM_2212", title: "반입요청 부품 선택", width: 1100, height: 500 };
        gw_com_module.dialoguePrepare(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
                {
                    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
                },
                {
                    type: "PAGE", name: "반입목적", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "IEHM76" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
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
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //----------
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "추가", value: "추가" },
                { name: "추가2", value: "A/S 추가", icon: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "cust_cd", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "요청일 :" },
                                mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA" } }
                            },
                            {
                                name: "rqst_tp", label: { title: "반입목적 :" },
                                editable: {
                                    type: "select", data: { memory: "반입목적", unshift: [{ title: "전체", value: "" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "item_no", label: { title: "품번 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "item_nm", label: { title: "품명 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "ser_no", label: { title: "Ser. No. :" },
                                editable: { type: "text", size: 12 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cust_cd", label: { title: "고객사 :" },
                                editable: {
                                    type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "cust_dept", memory: "LINE", unshift: [{ title: "전체", value: "" }], key: ["cust_cd"] }]
                                }
                            },
                            {
                                name: "cust_dept", label: { title: "LINE :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "LINE", unshift: [{ title: "전체", value: "" }], key: ["cust_cd"] }
                                }
                            },
                            {
                                name: "cust_prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 12, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rqst_no", label: { title: "요청번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "issue_no", label: { title: "A/S 번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "ncr_no", label: { title: "NCR 번호 :" },
                                editable: { type: "text", size: 12 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rpr_no", label: { title: "수리구매요청서번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "rqst_dept", label: { title: "요청부서 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "rqst_user", label: { title: "요청자 :" },
                                editable: { type: "text", size: 7 }
                            }
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
            targetid: "grdData_Main", query: "EHM_2210_1", title: "부품 반입 요청",
            height: 500, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "item_qty", validate: true },
            element: [
                {
                    header: "요청번호", name: "rqst_no", width: 90, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "장비군", name: "dept_area_nm", width: 70 },
                { header: "LINE", name: "cust_dept_nm", width: 70 },
                { header: "Process", name: "cust_proc_nm", width: 70 },
                {
                    header: "설비명", name: "cust_prod_nm", width: 120,
                    editable: { bind: "create", type: "text" }, mask: "search"
                },
                {
                    header: "품번", name: "item_no", width: 100,
                    editable: { bind: "create", type: "text" }, mask: "search"
                },
                {
                    header: "품명", name: "item_nm", width: 150,
                    editable: { bind: "create", type: "text", maxlength: 100, validate: { rule: "required" } }
                },
                {
                    header: "Ser. No.", name: "ser_no", width: 120,
                    editable: { type: "text", maxlength: 50 }
                },
                {
                    header: "수량", name: "item_qty", width: 50, align: "right",
                    editable: { bind: "create", type: "text", validate: { rule: "required" } }, mask: "numeric-int"
                },
                {
                    header: "A/S 번호", name: "link_issue_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "NCR 번호", name: "link_ncr_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "반입목적", name: "rqst_tp_nm", width: 130,
                    editable: { bind: "create", type: "text", validate: { rule: "required" } }, mask: "search"
                },
                {
                    header: "파트처리", name: "rpr_tp", width: 80,
                    editable: { type: "hidden" }
                },
                {
                    header: "수리구매요청서번호", name: "rpr_no", width: 120,
                    editable: { type: "text", maxlength: 20 }
                },
                {
                    header: "요청일", name: "rqst_date", width: 100, align: "center",
                    editable: { bind: "create", type: "text", validate: { rule: "required" } }, mask: "date-ymd"
                },
                {
                    header: "요청비고", name: "rmk", width: 300,
                    editable: { type: "text", maxlength: 200 }
                },
                { header: "요청자", name: "rqst_user_nm", width: 60 },
                { header: "요청부서", name: "rqst_dept_nm", width: 100 },
                { name: "rqst_tp", editable: { type: "hidden" }, hidden: true },
                { name: "rqst_user", editable: { type: "hidden" }, hidden: true },
                { name: "rqst_dept", editable: { type: "hidden" }, hidden: true },
                { name: "dept_area", editable: { type: "hidden" }, hidden: true },
                { name: "cust_cd", editable: { type: "hidden" }, hidden: true },
                { name: "cust_dept", editable: { type: "hidden" }, hidden: true },
                { name: "cust_proc", editable: { type: "hidden" }, hidden: true },
                { name: "prod_key", editable: { type: "hidden" }, hidden: true },
                { name: "issue_no", editable: { type: "hidden" }, hidden: true },
                { name: "issue_seq", editable: { type: "hidden" }, hidden: true },
                { name: "part_seq", editable: { type: "hidden" }, hidden: true },
                { name: "ncr_no", editable: { type: "hidden" }, hidden: true },
                { name: "astat", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //----------
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가2", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, element: "link_issue_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, element: "link_ncr_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "link_issue_no":
                    {
                        var args = {
                            to: "INFO_ISSUE",
                            issue_no: gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID"))
                        }
                        gw_com_site.linkPage(args);
                    }
                    break;
                case "link_ncr_no":
                    {
                        var args = {
                            to: "INFO_NCR",
                            rqst_no: gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID"))
                        }
                        gw_com_site.linkPage(args);
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            if (param.object == "grdData_Main") {
                switch (param.element) {
                    case "item_nm":
                        {
                            gw_com_api.setValue(param.object, param.row, "item_no", "", (param.type == "GRID"));
                        }
                        break;
                }
            }

        }
        //=====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function toggleOption() {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    closeOption();

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "rqst_tp", argument: "arg_rqst_tp" },
                { name: "item_no", argument: "arg_item_no" },
                { name: "item_nm", argument: "arg_item_nm" },
                { name: "ser_no", argument: "arg_ser_no" },
                { name: "rqst_user", argument: "arg_rqst_user" },
                { name: "rqst_dept", argument: "arg_rqst_dept" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "issue_no", argument: "arg_issue_no" },
                { name: "ncr_no", argument: "arg_ncr_no" },
                { name: "rqst_no", argument: "arg_rqst_no" },
                { name: "rpr_no", argument: "arg_rpr_no" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "rqst_tp" }] },
                { element: [{ name: "item_no" }] },
                { element: [{ name: "item_nm" }] },
                { element: [{ name: "ser_no" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_prod_nm" }] },
                { element: [{ name: "rqst_no" }] },
                { element: [{ name: "issue_no" }] },
                { element: [{ name: "ncr_no" }] },
                { element: [{ name: "rpr_no" }] },
                { element: [{ name: "rqst_user" }] },
                { element: [{ name: "rqst_dept" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    closeOption();
    if (param.element == "추가") {

        var args = {
            targetid: "grdData_Main", edit: true, updatable: true,
            data: [
                { name: "rqst_date", value: gw_com_api.getDate() },
                { name: "rqst_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rqst_user_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "rqst_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "rqst_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                { name: "item_qty", value: 1 }
            ]
        };
        var row = gw_com_module.gridInsert(args);
        processPopup({ type: "GRID", object: "grdData_Main", row: row, element: "cust_nm" });

    } else if (param.element == "추가2") {

        var args = {
            page: "EHM_2212",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            }
        };
        gw_com_module.dialogueOpen(args);

    }

}
//----------
function processDelete(param) {

    closeOption();
    if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) == "C") {

        var args = { targetid: "grdData_Main", row: "selected", focus: true, select: true }
        gw_com_module.gridDelete(args);

    } else {

        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=EHM_2210_9" +
                "&QRY_COLS=del_yn" +
                "&CRUD=R" +
                "&arg_rqst_no=" + gw_com_api.getValue("grdData_Main", "selected", "rqst_no", true),
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {

            if (data.DATA[0] == "1") {
                //var args = { targetid: "grdData_Main", row: "selected", focus: true, select: true }
                //gw_com_module.gridDelete(args);

                var p = {
                    handler: function (param) {
                        var args = {
                            url: "COM",
                            user: gw_com_module.v_Session.USR_ID,
                            param: [{
                                query: $("#grdData_Main_data").attr("query"),
                                row: [{
                                    crud: "U",
                                    column: [
                                        { name: "rqst_no", value: gw_com_api.getValue("grdData_Main", "selected", "rqst_no", true) },
                                        { name: "astat", value: "DEL" },
                                        { name: "astat_user", value: gw_com_module.v_Session.USR_ID },
                                        { name: "astat_dt", value: "SYSDT" }
                                    ]
                                }]
                            }],
                            nomessage: true,
                            handler: { success: processRetrieve }
                        };
                        gw_com_module.objSave(args);
                    },
                    param: {}
                };
                gw_com_api.messageBox([{ text: "REMOVE" }], 420, undefined, "YESNO", p);

            } else {
                gw_com_api.messageBox([{ text: "WMS에서 생성된 데이터는 삭제할 권한이 없습니다." }]);
                return;
            }
        }

    }
    
}
//----------
function processSave(param) {

    closeOption();

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var err = false;
    // 반입목적이 수리/세정일 경우 수리구매요청서 번호 필수 입력
    var ids = gw_com_api.getRowIDs("grdData_Main");
    $.each(ids, function () {
        var crud = gw_com_api.getDataStatus("grdData_Main", this, true);
        if (crud == "C" || crud == "U") {
            if (gw_com_api.getValue("grdData_Main", this, "rqst_tp", true) == "201" && gw_com_api.getValue("grdData_Main", this, "rpr_no", true) == "") {
                gw_com_api.selectRow("grdData_Main", this, true);
                gw_com_api.setError(true, "grdData_Main", this, "rpr_no", true);
                err = true;
                return false;
            }
            gw_com_api.setError(false, "grdData_Main", this, "rpr_no", true);
        }
    })
    if (err) {
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        return;
    }

    //args.url = "COM";
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

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

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
            v_global.event.row,
            v_global.event.element,
            (v_global.event.type == "GRID"));
    }

}
//----------
function processPopup(param) {

    if (param.element == undefined) return;
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "cust_nm":
        case "cust_prod_nm":
            {
                if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) != "C") return;
                var args = {
                    type: "PAGE", page: "w_find_prod_ehm", title: "장비 검색",
                    width: 1100, height: 460, scroll: true, open: true, control: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args.param = {
                        ID: gw_com_api.v_Stream.msg_selectProduct_EHM
                    }
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "item_no":
            {

                if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) != "C") return;
                if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) != "C") return;
                var args = {
                    type: "PAGE", page: "w_find_part_erp", title: "부품 검색",
                    width: 900, height: 460, scroll: true, open: true, control: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args.param = {
                        ID: gw_com_api.v_Stream.msg_selectPart_SCM
                    }
                    gw_com_module.dialogueOpen(args);
                }

            }
            break;
        case "rqst_tp_nm":
            {

                if (gw_com_api.getDataStatus(v_global.event.object, v_global.event.row, true) != "C") return;
                var args = {
                    page: "EHM_2211",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue
                    }
                };
                gw_com_module.dialogueOpen(args);

            }
            break;
    }

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
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
                            //if (param.data.result == "YES")
                            //processSave({});
                            //else {
                            //var status = checkCRUD({});
                            //if (status == "initialize" || status == "create")
                            //    processClear({});
                            //if (v_global.process.handler != null)
                            //    v_global.process.handler({});
                            //}
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
                    default:
                        {
                            if (param.data.result == "YES" || param.data.result == "OK") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                switch (param.from.page) {
                    case "DLG_ISSUE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoAS;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                    case "DLG_USER":
                        {
                            args.ID = param.ID;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                    case "w_find_prod_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_EHM;
                            args.data = v_global.logic.popup_data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "EHM_2211":
                        {
                            if (param.data != undefined) {
                                var ncr_chk = param.data.ncr_chk;
                                if (ncr_chk == "1" && gw_com_api.getValue(v_global.event.object, v_global.event.row, "ncr_no", true) == "") {
                                    gw_com_api.messageBox([{ text: "선택된 코드는 NCR 발행된 품목에만 적용할 수 있습니다." }]);
                                } else {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_tp_nm", param.data.rqst_tp_nm, true);
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_tp", param.data.rqst_tp, true);
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "rpr_tp", param.data.rpr_tp, true, true);
                                }
                            }
                        }
                        break;
                    case "EHM_2212":
                        {
                            if (param.data != undefined && param.data.rows != undefined) {

                                $.each(param.data.rows, function () {
                                    this.link_issue_no = this.issue_no;
                                    this.link_ncr_no = this.ncr_no;
                                })

                                var args = {
                                    targetid: "grdData_Main", edit: true, updatable: true,
                                    data: param.data.rows
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_EHM:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_nm", param.data.cust_nm, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_cd", param.data.cust_cd, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_dept_nm", param.data.cust_dept, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_dept", param.data.cust_dept, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_proc_nm", param.data.cust_proc, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_proc", param.data.cust_proc, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "cust_prod_nm", param.data.cust_prod_nm, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "prod_key", param.data.prod_key, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_area_nm", param.data.dept_area_nm, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_area", param.data.dept_area, (v_global.event.type == "GRID"));
                closeDialogue({ page: param.from.page, focus: true });
                if (gw_com_api.getValue(v_global.event.object, v_global.event.row, "item_no", (v_global.event.type == "GRID")) == "") {
                    processPopup({ type: v_global.event.type, object: v_global.event.object, row: v_global.event.row, element: "item_no" });
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_SCM:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "item_no", param.data.part_cd, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "item_nm", param.data.part_nm, (v_global.event.type == "GRID"), false, false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
