
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "user_id", gw_com_module.v_Session.USR_ID);
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "tdr_no", gw_com_api.getPageParameter("tdr_no"));
            //----------
            processRetrieve({});

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
                { name: "조회", value: "조회", act: true },
                { name: "제공", value: "상세보기", icon: "추가" },
                { name: "닫기", value: "닫기" }
            ]
        }; gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "요청일 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rqst_title", label: { title: "제목 :" },
                                editable: { type: "text", size: 25 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rqst_user", label: { title: "요청자 :" },
                                editable: { type: "text", size: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "tdr_no", label: { title: "요청번호 :" },
                                editable: { type: "text", size: 16 }
                            },
                            { name: "user_id", hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        }; gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "TDR_1030_1", title: "현황",
            height: 450, show: true, selectable: true, key: true, dynamic: true, number: true,
            element: [
                { header: "요청번호", name: "tdr_no", width: 100, align: "center" },
                { header: "제목", name: "rqst_title", width: 300 },
                { header: "요청부서", name: "rqst_dept_nm", width: 100 },
                { header: "요청자", name: "rqst_user_nm", width: 60 },
                { header: "요청자료", name: "item_cnt", width: 200 },
                { header: "협력업체", name: "supp_nm", width: 150, hidden: true },
                { header: "수신자", name: "emp_nm", width: 60 },
                { header: "처리상태", name: "supp_yn_nm", width: 60 },
                { header: "요청상태", name: "rqst_yn_nm", width: 60 },
                { header: "요청일자", name: "appr_dt", width: 140, align: "center", mask: "date-ymd" },
                { header: "전송일자", name: "send_dt", width: 140, align: "center", mask: "date-ymd" },
                { name: "rqst_dt", hidden: true },
                { name: "tdr_id", hidden: true },
                { name: "supp_id", hidden: true },
                { name: "user_id", hidden: true },
                { name: "supp_yn", hidden: true }
            ]
        }; gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
            ]
        }; gw_com_module.objResize(args);
        //====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
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

        //====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "제공", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //====================================================================================
        function processClick(param) {

            switch (param.element) {

                case "조회":
                case "취소":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "제공":
                    {
                        if (gw_com_api.getSelectedRow("grdList_MAIN") == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        // 접수처리
                        var args = {
                            url: "COM", nomessage: true,
                            procedure: "sp_TDR_Request",
                            input: [
                                { name: "JobCd", value: "Accept", type: "varchar" },
                                { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                                { name: "RootId", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_id", true), type: "int" },
                                { name: "RootNo", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true), type: "varchar" },
                                { name: "Option", value: "", type: "varchar" }
                            ],
                            output: [
                                { name: "Rmsg", type: "varchar" }
                            ],
                            handler: {
                                success: function (response, param) {
                                    var args = {
                                        ID: gw_com_api.v_Stream.msg_linkPage,
                                        to: { type: "MAIN" },
                                        data: {
                                            page: "TDR_1040", title: "기술자료 제공등록",
                                            param: [
                                                { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) },
                                                { name: "tdr_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true) },
                                                { name: "supp_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_id", true) },
                                                { name: "user_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "user_id", true) }
                                            ]
                                        }
                                    };
                                    gw_com_module.streamInterface(args);
                                }
                            }
                        };
                        gw_com_module.callProcedure(args);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "실행":
                    {
                        processRetrieve({});
                    }
                    break;

            }

        }
        //====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRowdblclick(param) {
    
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "TDR_1040", title: "기술자료 제공등록",
            param: [
                { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) },
                { name: "tdr_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true) },
                { name: "user_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "user_id", true) }
                ]
        }
    }; gw_com_module.streamInterface(args);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "act_emp_nm" || param.element == "ecr_dept_nm" || param.element == "ecr_emp_nm") {
            if (param.value.current == "") {
                gw_com_api.setValue(param.object, param.row, param.element.substr(0, param.element.length - 3), "");
            }
        }
    }

}
//----------
function processItemdblclick(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "act_emp_nm":  //담당자
            case "ecr_emp_nm":  //작성자
            case "ecr_dept_nm": //작성부서
            case "gw_aemp":     //승인자
                processPopup(param);
                break;
            default:
                processRetrieve();
                break;
        }
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "user_id", argument: "arg_user_id" },
                { name: "tdr_no", argument: "arg_tdr_no" },
                { name: "rqst_title", argument: "arg_rqst_title" },
                { name: "rqst_user", argument: "arg_rqst_user" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "rqst_title" }] },
                { element: [{ name: "rqst_user" }] },
                { element: [{ name: "tdr_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true, focus: true }
        ]
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
function processBatch(param) {

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_TDR_Request",
        input: [
            { name: "JobCd", value: param.act, type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true), type: "int" },
            { name: "RootNo", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true), type: "varchar" },
            { name: "Option", value: "", type: "varchar" }
        ],
        output: [
            { name: "Rmsg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: {}
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "TDR_1020", title: "기술자료 요청등록",
            param: [
                { name: "dup_yn", value: "true" },
                { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) }
            ]
        }
    };

    gw_com_module.streamInterface(args);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_refreshPage:
            {
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmSave:
                    {
                        if (param.data.result == "YES")
                            processSave(param.data.arg);
                        else {
                            processDelete({});
                            if (v_global.process.handler != null)
                                v_global.process.handler(param.data.arg);
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
                case gw_com_api.v_Message.msg_informBatched:
                    {
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    }
                    break;
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//