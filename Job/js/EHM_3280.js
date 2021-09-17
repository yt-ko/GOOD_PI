//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.03)
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

        //----------
        var args = {
            request: [
                {
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "당사", value: "EMP" },
                        { title: "SETUP 공급사", value: "SUPP" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
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
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //----------

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
            targetid: "lyrMenu", type: "FREE", show: true,
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "보고서 작성" },
                { name: "수정", value: "보고서 수정", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE", show: true,
            element: [
                { name: "조회", value: "새로고침", act: true }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA"/*, unshift: [{ title: "전체", value: "%" }]*/ } }
                            },
                            {
                                name: "cust_nm", label: { title: "고객사 :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "user_tp", label: { title: "부서구분 :" },
                                editable: { type: "select", data: { memory: "구분", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "dept_nm", label: { title: "작업부서 :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "작업일 :" },
                                mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            }
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
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_1", query: "EHM_3280_1", title: "SETUP 보고서",
            caption: false, height: 450, show: true, selectable: true, number: true,
            element: [
                { header: "작업일", name: "setup_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "작성부서", name: "setup_dept_nm", width: 120 },
                { header: "작성자", name: "setup_user_nm", width: 60 },
                {
                    header: "마감", name: "close_yn", width: 50, align: "center",
                    format: { type: "checkbox", title: "", value: "1", offval: "0" }
                },
                { header: "고객사", name: "cust_nm", width: 90 },
                { header: "LINE", name: "cust_dept_nm", width: 100 },
                { header: "고객설비명", name: "cust_prod_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 90 },
                { header: "작업시간", name: "setup_time", width: 90, align: "center" },
                {
                    header: "작업자(명)", name: "setup_user_cnt", width: 70, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "작업공정(건)", name: "setup_proc_cnt", width: 70, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "ISSUE(건)", name: "setup_issue_cnt", width: 70, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "첨부파일(건)", name: "setup_file_cnt", width: 70, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { name: "setup_no", hidden: true },
                { name: "setup_seq", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_1", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================

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
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: click_lyrMenu_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_1", grid: true, event: "rowdblclick", handler: rowdblclick_grdList_1 };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            if (ui.object == "lyrMenu" && ui.element == "조회") {
                var args = { target: [{ id: "frmOption", focus: true }] };
                gw_com_module.objToggle(args);
            } else {
                processRetrieve({});
            }

        }
        //----------
        function click_lyrMenu_추가(ui) {

            var row = gw_com_api.getSelectedRow("grdList_1");
            if (row > 0) {
                var setup_no = gw_com_api.getValue("grdList_1", row, "setup_no", true);
                var args = {
                    request: "DATA",
                    name: "EHM_3220_1_CHK_ADD",
                    url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                        "?QRY_ID=EHM_3220_1_CHK_ADD" +
                        "&QRY_COLS=addable" +
                        "&CRUD=R" +
                        "&arg_setup_no=" + setup_no,
                    async: false,
                    handler_success: successRequest,
                    setup_no: setup_no
                };
                gw_com_module.callRequest(args);

                function successRequest(type, name, data) {

                    if (data.DATA[0] == "1")
                        processEdit({ setup_no: this.setup_no });
                    else
                        gw_com_api.messageBox([{ text: "보고서는 \"예정, 진행\" 상태에서만 등록할 수 있습니다." }]);

                }
           } else
                gw_com_api.messageBox([{ text: "NODATA" }]);

        }
        //----------
        function click_lyrMenu_수정(ui) {

            var row = gw_com_api.getSelectedRow("grdList_1");
            if (row > 0) {
                processEdit({ setup_no: gw_com_api.getValue("grdList_1", row, "setup_no", true), setup_seq: gw_com_api.getValue("grdList_1", row, "setup_seq", true) });
            } else
                gw_com_api.messageBox([{ text: "NODATA" }]);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowdblclick_grdList_1(ui) {

            processEdit({ setup_no: gw_com_api.getValue(ui.object, ui.row, "setup_no", true), setup_seq: gw_com_api.getValue(ui.object, ui.row, "setup_seq", true), auth: "R" });

        }
        //----------
    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "cust_nm", argument: "arg_cust_nm" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "user_tp", argument: "arg_user_tp" },
                { name: "dept_nm", argument: "arg_dept_nm" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" }
            ],
            argument: [
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ],
            remark: [
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "cust_nm" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "user_tp" }] },
                { element: [{ name: "dept_nm" }] },
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_1", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processEdit(param) {

    var setup_no = param.setup_no;
    var setup_seq = param == undefined || param.setup_seq == undefined ? "" : param.setup_seq;
    var auth = "";
    if (param.auth != undefined)
        auth = param.auth;
    else
        setup_seq == "" ? "U" : getAuth({ setup_no: setup_no, setup_seq: setup_seq, user_id: gw_com_module.v_Session.USR_ID });
    var title = "SETUP 보고서 " + (setup_seq == "" ? "작성" : auth == "R" ? "조회" : "수정");
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "EHM_3220",
            title: title,
            param: [
                { name: "AUTH", value: auth },
                { name: "setup_no", value: setup_no },
                { name: "setup_seq", value: setup_seq }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function getAuth(param) {

    var rtn = "U";
    var args = {
        request: "DATA",
        name: "EHM_3220_AUTH",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3220_AUTH" +
            "&QRY_COLS=auth" +
            "&CRUD=R" +
            "&arg_setup_no=" + param.setup_no +
            "&arg_setup_seq=" + param.setup_seq +
            "&arg_user_id=" + param.user_id,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {
        rtn = data.DATA[0];
    }
    return rtn;

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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//