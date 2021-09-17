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
    data: {}, logic: {}
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
        start();

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
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", act: true },
                { name: "저장", value: "재발" },
                { name: "초발", value: "초발", icon: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: false, border: true,
            editable: { bind: "open", focus: "issue_no", validate: true },
            remark: "lyrRemark_1",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "issue_no", label: { title: "관리번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            { name: "실행", act: true, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_목록", query: "w_find_reissue_1", title: "재발 확인",
            height: "310", show: true, number: false, key: true, multi: true, checkrow: true,
            color: { row: true },
            element: [
                { header: "관리번호", name: "issue_no", width: 90, align: "center", format: { type: "link" } },
                { header: "재발", name: "rcr_yn_nm", width: 50, align: "center" },
                { header: "발생일자", name: "issue_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "발생구분", name: "issue_tp_nm", width: 60 },
                { header: "제품유형", name: "prod_type_nm", width: 80 },
                { header: "발생현상(중)", name: "status_tp1_nm", width: 80, hidden: true },
                { header: "발생현상(소)", name: "status_tp2_nm", width: 100 },
                { header: "원인부위분류", name: "part_tp1_nm", width: 80, hidden: true },
                { header: "원인부위구분", name: "part_tp2_nm", width: 100 },
                { header: "주거래처", name: "supp_nm", width: 140 },
                { header: "고객사", name: "cust_nm", width: 70 },
                { header: "Line", name: "cust_dept_nm", width: 80 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "고객설비명", name: "cust_prod_nm", width: 120 },
                { header: "제품명", name: "prod_nm", width: 200 },
                { header: "발생현상", name: "rmk", width: 300 },
                { header: "NCR", name: "rqst_no", width: 90, align: "center", format: { type: "link" } },
                { name: "prod_type", hidden: true },
                { name: "status_tp2", hidden: true },
                { name: "part_tp2", hidden: true },
                { name: "supp_cd", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_목록", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "초발", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_목록", grid: true, element: "issue_no", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_목록", grid: true, element: "rqst_no", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processBatch(ui);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
processRetrieve = function (param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "issue_no", argument: "arg_issue_no" }
            ],
            remark: [
                { element: [{ name: "issue_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_목록", focus: true }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        },
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
function processRetrieveEnd(param) {
    //gw_com_api.selectRow("grdData_목록", 1, true);    //첫번재 row 선택 방지

    var args = {
        request: "DATA",
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
        "?QRY_ID=w_find_reissue_2" +
        "&QRY_COLS=pissue_no" +
        "&CRUD=R" +
        "&arg_issue_no=" + gw_com_api.getValue("frmOption", 1, "issue_no") + 
        "&arg_chk_tp=" + v_global.logic.chk_tp,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {
        var rowcount = gw_com_api.getRowCount("grdData_목록");
        $.each(data, function () {
            var issue_no = this.DATA[0];
            for (var i = 1; i <= rowcount; i++) {
                if (issue_no == gw_com_api.getValue("grdData_목록", i, "issue_no", true)) {
                    gw_com_api.selectRow("grdData_목록", i, true);
                }
            }
        });
    }
}
//----------
function processClose(param) {
    if(v_global.logic.ncr && param.data)
        param.data.ncr = v_global.logic.ncr;
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);

}
//----------
function processBatch(param) {

    var issue_no = v_global.logic.issue_no;

    if (param.element == "저장") {

        var ids = gw_com_api.getSelectedRow("grdData_목록", true);
        var pissue_no = "";
        var index = 1;

        if (ids.length == 0) {
            gw_com_api.messageBox([{ text: "선택한 재발 목록이 없습니다." }], 300);
            
            return false;
        } else {

            $.each(ids, function () {

                var pissue_no = gw_com_api.getValue("grdData_목록", this, "issue_no", true);
                var group1 = gw_com_api.getValue("grdData_목록", this, "prod_type", true);
                var group2 = gw_com_api.getValue("grdData_목록", this, "status_tp2", true);
                var group3 = gw_com_api.getValue("grdData_목록", this, "part_tp2", true);
                var group4 = gw_com_api.getValue("grdData_목록", this, "supp_cd", true);

                var args = {
                    url: "COM",
                    procedure: "sp_EHM_CreateReIssue",
                    nomessage: true,
                    input: [
                        { name: "chk_tp", value: v_global.logic.chk_tp, type: "varchar" },
                        { name: "issue_no", value: issue_no, type: "varchar" },
                        { name: "pissue_no", value: pissue_no, type: "varchar" },
                        { name: "group1", value: group1, type: "varchar" },
                        { name: "group2", value: group2, type: "varchar" },
                        { name: "group3", value: group3, type: "varchar" },
                        { name: "group4", value: group4, type: "varchar" },
                        { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                    ],
                    output: [
                        { name: "rtn_no", type: "int" },
                        { name: "rtn_msg", type: "varchar" }
                    ]
                };

                if (ids.length == index) {
                    args.handler = {
                        success: successBatch,
                        param: {
                            issue_no: issue_no,
                            pissue_no: pissue_no
                        }
                    }
                }
                index++;
                gw_com_module.callProcedure(args);

            });
        }
    } else if (param.element == "초발") {

        var args = {
            url: "COM",
            procedure: "sp_EHM_CreateReIssue",
            nomessage: true,
            input: [
                { name: "chk_tp", value: "DELETE", type: "varchar" },
                { name: "issue_no", value: issue_no, type: "varchar" },
                { name: "pissue_no", value: "", type: "varchar" },
                { name: "group1", value: "", type: "varchar" },
                { name: "group2", value: "", type: "varchar" },
                { name: "group3", value: "", type: "varchar" },
                { name: "group4", value: "", type: "varchar" },
                { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            handler:{
                success: successBatch,
                param: {
                    issue_no: issue_no,
                    pissue_no: pissue_no
                }
            },
            output: [
                { name: "rtn_no", type: "int" },
                { name: "rtn_msg", type: "varchar" }
            ]
        };
        gw_com_module.callProcedure(args);
    }

}
//----------
function successBatch(response, param) {

    var args;
    //if (response.VALUE[0] == "0") {
    //    v_global.process.handler = processClose;
    //    args = {
    //        hanlder: processClose,
    //        param: param
    //    }
    //}
    gw_com_api.messageBox([{ text: response.VALUE[1] }], undefined, gw_com_api.v_Message.msg_confirmSave, undefined, args);

    //gw_com_api.showMessage(response.VALUE[1]);
    //if (response.VALUE[0] == "0") {
    //    var args = {
    //        ID: gw_com_api.v_Stream.msg_closeDialogue,
    //        data: param
    //    };
    //    gw_com_module.streamInterface(args);
    //}

}
//----------
function processLink(param) {

    var args;
    switch (param.element) {
        case "issue_no":
            {
                args = {
                    to: "INFO_ISSUE",
                    issue_no: gw_com_api.getValue(param.object, param.row, param.element, true)
                }
            }
            break;
        case "rqst_no":
            {
                args = {
                    to: "INFO_NCR",
                    rqst_no: gw_com_api.getValue(param.object, param.row, param.element, true)
                }
            }
            break;
        default:
            return;
    }
    gw_com_site.linkPage(args);

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
        case gw_com_api.v_Stream.msg_openDialogue:
            {
                v_global.process.init = true; v_global.logic.chk_tp
                v_global.logic.ncr = param.data.ncr;
                v_global.logic.chk_tp = param.data.chk_tp;
                v_global.logic.issue_no = param.data.issue_no;
                gw_com_api.setValue("frmOption", 1, "issue_no", param.data.issue_no);
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            var data = {
                                issue_no: v_global.logic.issue_no 
                            }
                            processClose({data: data });
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_alert:
                        {
                            if (v_global.process.handler != null)
                                v_global.process.handler({ data: param.data.arg.param });
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//