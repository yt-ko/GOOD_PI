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
                { name: "출력", value: "라벨출력" },
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
            targetid: "grdData_Main", query: "EHM_2290_1", title: "양품화 처리현황",
            height: 500, show: true, selectable: true, number: true, multi: true, checkrow: true,
            element: [
                {
                    header: "요청번호", name: "rqst_no", width: 90, align: "center",
                    editable: { type: "hidden" }
                },
                { header: "진행상태", name: "astat_nm", width: 80, style: { bgcolor: "#E7FAE7" } },
                { header: "장비군", name: "dept_area_nm", width: 70 },
                { header: "요청일", name: "rqst_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "요청자", name: "rqst_user_nm", width: 60 },
                { header: "요청부서", name: "rqst_dept_nm", width: 100 },
                { header: "품번", name: "item_no", width: 100 },
                {
                    header: "품명", name: "item_nm", width: 150,
                    editable: { bind: "create", type: "text", maxlength: 100, validate: { rule: "required" } }
                },
                { header: "Ser. No.", name: "ser_no", width: 120 },
                { header: "수량", name: "item_qty", width: 50, align: "right", mask: "numeric-int" },
                {
                    header: "A/S 번호", name: "issue_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "NCR 번호", name: "ncr_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                { header: "반입목적", name: "rqst_tp_nm", width: 110 },
                { header: "파트처리", name: "rpr_tp", width: 80 },
                { header: "수리구매요청서번호", name: "rpr_no", width: 120 },
                { header: "분석담당", name: "act_user_nm", width: 60 },
                { header: "분석부서", name: "act_dept_nm", width: 100 },
                { header: "분석처리상태", name: "act_stat_nm", width: 100 },
                { header: "부품처리구분", name: "act_tp_nm", width: 100 },
                { header: "최근 입고일", name: "in_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "최근 출고일", name: "out_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "부품위치", name: "wh_nm", width: 120 },
                { header: "부품상태", name: "item_stat_nm", width: 60, align: "center"}
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
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processClick };
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
        var args = { targetid: "grdData_Main", grid: true, element: "issue_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, element: "ncr_no", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "출력":
                    {
                        var ids = gw_com_api.getSelectedRow("grdData_Main", true);
                        if (ids.length < 1) {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                            return;
                        }
                        var rqst_no = "";
                        $.each(ids, function () {
                            rqst_no += (gw_com_api.getValue("grdData_Main", this, "rqst_no", true) + ",");
                        })
                        var args = {
                            option: [
                                { name: "PRINT", value: "PDF" },
                                { name: "PAGE", value: gw_com_module.v_Current.window },
                                { name: "USER", value: gw_com_module.v_Session.USR_ID },
                                { name: "KEY", value: rqst_no }
                            ],
                            target: { type: "FILE", id: "lyrDown", name: param.element }
                        };
                        gw_com_module.objExport(args);

                    }
                    break;
                case "issue_no":
                    {
                        var args = {
                            to: "INFO_ISSUE",
                            issue_no: gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID"))
                        }
                        gw_com_site.linkPage(args);
                    }
                    break;
                case "ncr_no":
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
            { type: "GRID", id: "grdData_Main", select: true }
        ],
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
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
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
