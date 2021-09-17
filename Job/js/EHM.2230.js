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
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "처리상태", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "IEHM91" }
                    ]
                },
                {
                    type: "PAGE", name: "처리구분", query: "DDDW_CM_CODED",
                    param: [
                        { argument: "arg_hcode", value: "IEHM92" }
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

            if (gw_com_api.getPageParameter("rqst_no") != "") {
                gw_com_api.setValue("frmOption", 1, "rqst_no", gw_com_api.getPageParameter("rqst_no"));
                processRetrieve({});
            } else if (gw_com_module.v_Session.USER_TP != "SYS") {
                gw_com_api.setValue("frmOption", 1, "act_user", gw_com_module.v_Session.USR_NM);
                gw_com_api.setValue("frmOption", 1, "act_dept", gw_com_module.v_Session.DEPT_NM);
                processRetrieve({});
            }

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
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
                { name: "추가", value: "담당자 등록/변경" },
                { name: "저장", value: "저장" }
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
                                name: "rqst_dept", label: { title: "요청부서 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "rqst_user", label: { title: "요청자 :" },
                                editable: { type: "text", size: 7 }
                            },
                            {
                                name: "act_dept", label: { title: "분석 담당부서 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "act_user", label: { title: "분석 담당자 :" },
                                editable: { type: "text", size: 7 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "cust_cd", label: { title: "고객사 :" }, hidden: true },
                            { name: "cust_dept", label: { title: "LINE :" }, hidden: true },
                            { name: "cust_prod_nm", label: { title: "설비명 :" }, hidden: true },
                            { name: "rpr_no", label: { title: "수리구매요청서번호 :" }, hidden: true },
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
            targetid: "grdData_MAIN", query: "EHM_2230_1", title: "부품 반입 요청",
            height: 300, show: true, selectable: true, number: true, caption: true,
            editable: { master: true, bind: "select", focus: "item_qty", validate: true },
            element: [
                { header: "요청번호", name: "rqst_no", width: 90, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 70 },
                { header: "품번", name: "item_no", width: 100 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "Ser. No.", name: "ser_no", width: 120 },
                { header: "수량", name: "item_qty", width: 50, align: "right", mask: "numeric-int" },
                {
                    header: "A/S 번호", name: "link_issue_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "NCR 번호", name: "link_ncr_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                { header: "반입목적", name: "rqst_tp_nm", width: 130 },
                { header: "파트처리", name: "rpr_tp", width: 80 },
                { header: "요청일", name: "rqst_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "요청비고", name: "rmk", width: 300 },
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
                { name: "ncr_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUB", query: "EHM_2230_2", type: "TABLE", title: "분석 담당",
            show: true, caption: true, selectable: true,
            editable: { bind: "select", focus: "plan_date", validate: true },
            content: {
                width: { label: 100, field: 250 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "act_user_nm", editable: { type: "hidden" } },
                            { name: "act_user", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "담당부서", format: { type: "label" } },
                            { name: "act_dept_nm", editable: { type: "hidden" } },
                            { name: "act_dept", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계획일자", format: { type: "label" } },
                            {
                                name: "plan_date", mask: "date-ymd",
                                editable: { type: "text" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "완료일자", format: { type: "label" } },
                            {
                                name: "act_date", mask: "date-ymd",
                                editable: { type: "hidden" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "부품처리상태", format: { type: "label" } },
                            {
                                name: "act_stat",
                                format: { type: "select", data: { memory: "처리상태", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "처리상태", unshift: [{ title: "-", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "부품처리구분", format: { type: "label" } },
                            {
                                name: "act_tp",
                                format: { type: "select", data: { memory: "처리구분", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "처리구분", unshift: [{ title: "-", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "rmk",
                                format: { type: "text", width: 350 },
                                editable: { type: "text", maxlength: 200, width: 316 }
                            },
                            { name: "rqst_id", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_no", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB2", query: "EHM_2230_3", title: "부품 입/출고 내역",
            height: 126, width: 700, show: true, selectable: true, number: true, caption: true,
            element: [
                { header: "일자", name: "io_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "구분", name: "io_tp_nm", width: 100 },
                { header: "창고(위치)", name: "wh_nm", width: 120 },
                { header: "부품상태", name: "item_stat_nm", width: 100 },
                { header: "담당자", name: "io_user_nm", width: 100 },
                { header: "담당부서", name: "io_dept_nm", width: 120 },
                { header: "비고", name: "rmk", width: 200 },
                { name: "io_id", hidden: true },
                { name: "io_tp", hidden: true },
                { name: "rqst_no", hidden: true },
                { name: "item_stat", hidden: true },
                { name: "io_user", hidden: true },
                { name: "io_dept", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_SUB2", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, element: "link_issue_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, element: "link_ncr_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //----------
        var args = { targetid: "frmData_SUB", event: "itemchanged", handler: proecssItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            closeOption({});
            switch (param.element) {
                case "추가":
                    {
                        processInsert(param);
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
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
        function processRowselecting(param) {

            v_global.process.current.row = param.row;
            v_global.process.handler = function () {
                gw_com_api.selectRow("grdData_MAIN", v_global.process.current.row, true, false);
            };
            var args = {
                target: [
                    { type: "FORM", id: "frmData_SUB" }
                ]
            };
            return gw_com_module.objUpdatable(args);

        }
        //----------
        function processRowselected(param) {

            processRetrieve(param);

        }
        //----------
        function proecssItemchanged(param) {

            switch (param.element) {
                case "act_stat":
                    {
                        gw_com_api.setValue(param.object, param.row, "act_date", (param.value.current == "9" ? gw_com_api.getDate() : ""), (param.type == "GRID"));
                        if (param.value.current != "9" && gw_com_api.getValue(param.object, param.row, "act_tp", (param.type == "GRID")) != "") {
                            gw_com_api.setValue(param.object, param.row, "act_tp", "", (param.type == "GRID"));
                        }
                    }
                    break;
                case "act_tp":
                    {
                        if (gw_com_api.getValue(param.object, param.row, "act_stat", (param.type == "GRID")) != "9" && param.value.current != "") {
                            gw_com_api.messageBox([{ text: "부품처리상태가 [완료]일 경우에만 입력할 수 있습니다." }]);
                            gw_com_api.setValue(param.object, param.row, param.element, "", (param.type == "GRID"));
                        }
                    }
                    break;
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

    if (param.object == "grdData_MAIN") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "rqst_no", argument: "arg_rqst_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_SUB", select: true },
                { type: "GRID", id: "grdData_SUB2", select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    } else {

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
                    { name: "rpr_no", argument: "arg_rpr_no" },
                    { name: "act_user", argument: "arg_act_user" },
                    { name: "act_dept", argument: "arg_act_dept" }
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
                    { element: [{ name: "rqst_dept" }] },
                    { element: [{ name: "act_user" }] },
                    { element: [{ name: "act_dept" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_SUB2" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processInsert(param) {

    if (gw_com_api.getSelectedRow("grdData_MAIN") == null) {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return;
    }

    var args = {
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_2230_9" +
            "&QRY_COLS=ins_yn" +
            "&CRUD=R" +
            "&arg_dcode=" + gw_com_api.getValue("grdData_MAIN", "selected", "rqst_tp", true),
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        if (data.DATA[0] == "1") {
            var args = { object: "frmData_SUB", row: 1, type: "FORM", element: "act_user_nm" };
            processPopup(args);
        } else {
            gw_com_api.messageBox([{ text: "분석 담당자를 등록할 수 없습니다." }]);
            return;
        }
    }

}
//----------
function processSave(param) {

    var args = { target: [{ type: "FORM", id: "frmData_SUB" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // 분석완료 시 결과 필수입력
    if (gw_com_api.getValue("frmData_SUB", 1, "act_stat") == "9") {
        if (gw_com_api.getValue("frmData_SUB", 1, "act_tp") == "") {
            gw_com_api.setError(true, "frmData_SUB", 1, "act_tp");
            gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
            return;
        }
    }
    gw_com_api.setError(false, "frmData_SUB", 1, "act_tp");

    var args = {
        target: [
            { type: "FORM", id: "frmData_SUB" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ object: "grdData_MAIN", row: "selected", type: "GRID", key: response });

}
//----------
function processPopup(param) {

    switch (param.element) {
        case "act_user_nm":
            {
                v_global.event = param;
                v_global.event.user_id = "act_user";
                v_global.event.user_nm = "act_user_nm"
                v_global.event.dept_cd = "act_dept";
                v_global.event.dept_nm = "act_dept_nm"
                v_global.event.data = { user_tp: "EMP" };
                var args = {
                    type: "PAGE", page: "DLG_USER", title: "사용자 조회",
                    width: 600, height: 430, scroll: true, open: true, control: true
                };

                if (gw_com_module.dialoguePrepare(args) == false) {
                    args.param = {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

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
                            if (param.data.result == "YES")
                                processSave({});
                            else {
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_USER":
                        {
                            args.ID = param.ID;
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
                    case "DLG_USER":
                        {
                            if (param.data != undefined) {

                                if (gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.user_id, (v_global.event.type == "GRID")) == param.data.user_id) {
                                    gw_com_api.messageBox([{ text: "현재 담당자와 동일합니다." }]);
                                    return;
                                }

                                var p = {
                                    handler: function (param) {

                                        var args = {
                                            //url: "COM",       // 알람메일 발송 스크립트(서버스크립트) 사용하기 위해 주석처리함.
                                            user: gw_com_module.v_Session.USR_ID,
                                            param: [{
                                                query: $("#" + v_global.event.object).attr("query"),
                                                row: [{
                                                    crud: "C",
                                                    column: [
                                                        { name: "rqst_id", value: 0 },
                                                        { name: "rqst_no", value: gw_com_api.getValue("grdData_MAIN", "selected", "rqst_no", true) },
                                                        { name: v_global.event.user_id, value: param.data.user_id },
                                                        { name: v_global.event.user_nm, value: param.data.user_nm },
                                                        { name: v_global.event.dept_cd, value: param.data.dept_cd },
                                                        { name: v_global.event.dept_nm, value: param.data.dept_nm }
                                                    ]
                                                }]
                                            }],
                                            handler: {
                                                success: successSave,
                                                param: param
                                            }
                                        };
                                        gw_com_module.objSave(args);

                                    },
                                    param: param
                                };
                                gw_com_api.messageBox([{ text: "담당자를 [" + param.data.user_nm + "]님으로 등록/변경 하시겠습니까?" }], 480, undefined, "YESNO", p);

                            }
                        }
                        break;
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
