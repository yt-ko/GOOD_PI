//------------------------------------------
// Process about Job Process.
//                Created by K, Goodware (2018.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}, data: null
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
                    type: "PAGE", name: "IEHM56", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM56" }]
                },
                {
                    type: "PAGE", name: "IEHM57", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM57" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                }//,
                //{
                //    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                //    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                //}
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
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "조회", value: "새로고침" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SETUP_D", type: "FREE",
            element: [
                { name: "추가", value: "보고서 작성" },
                { name: "수정", value: "보고서 수정", icon: "기타" },
                { name: "마감", value: "마감", icon: "예" },
                { name: "해제", value: "마감해제", icon: "아니오" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true,
            editable: { focus: "cust_cd", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cust_nm", label: { title: "고객사 :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "cust_prod_nm", label: { title: "고객설비명 :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "stat_10", label: { title: "예정 :" }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "stat_20", label: { title: "진행 :" }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "stat_80", label: { title: "보류 :" }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "stat_90", label: { title: "완료 :" }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "완료일 :" },
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
            targetid: "grdData_SETUP", query: "EHM_3210_1", title: "SETUP 설비 현황",
            height: 110, casption: true, pager: true, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "고객사", name: "cust_nm", width: 80 },
                { header: "LINE", name: "cust_dept_nm", width: 80 },
                { header: "고객설비명", name: "cust_prod_nm", width: 150 },
                { header: "Project No.", name: "proj_no", width: 100 },
                {
                    header: "진행율(%)", name: "proc_rate", width: 60, align: "right",
                    fix: { mask: "numeric-float", margin: 1 }
                },
                { header: "진행상태", name: "pstat_nm", width: 60, align: "center" },
                { header: "시작일", name: "start_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "종료일", name: "end_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "진행상태", name: "pstat_nm", width: 60, align: "center" },
                {
                    header: "보고서(건)", name: "setup_cnt", width: 60, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "ISSUE(건)", name: "issue_cnt", width: 60, align: "right",
                    format: { type: "link", exceptionvalues: ["-", "0"] }, fix: { mask: "numeric-int", margin: 1 }
                },
                { name: "setup_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SETUP_D", query: "EHM_3210_2", title: "SETUP 보고서",
            height: 230, caption: true, pager: true, show: true, selectable: true, number: true,
            //editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "작성부서", name: "setup_dept_nm", width: 150 },
                { header: "작성자", name: "setup_user_nm", width: 60 },
                { header: "작업일", name: "setup_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "작업시간", name: "setup_time", width: 80, align: "center" },
                {
                    header: "작성자(명)", name: "setup_user_cnt", width: 60, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "ISSUE(건)", name: "setup_issue_cnt", width: 60, align: "right",
                    format: { type: "link", exceptionvalues: ["-", "0"] }, fix: { mask: "numeric-int", margin: 1 }
                },
                {
                    header: "마감", name: "close_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { name: "setup_no", editable: { type: "hidden" }, hidden: true },
                { name: "setup_seq", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "EHM_3210_4", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "부서", name: "setup_dept_nm", width: 150 },
                { header: "작성자", name: "setup_user_nm", width: 80 },
                { header: "보고일", name: "setup_date", width: 100, align: "center", mask: "date-ymd" },
                { header: "파일명", name: "file_nm", width: 250 },
                {
                    header: "다운로드", name: "download", width: 80, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { header: "파일설명", name: "file_desc", width: 436 },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
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
                { type: "GRID", id: "grdData_SETUP", offset: 8 },
                { type: "GRID", id: "grdData_SETUP_D", offset: 8 },
                //{ type: "GRID", id: "grdData_SETUP_PROC", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        changeStat({ object: "lyrMenu_SETUP_PROC", element: "수정" });
        //=====================================================================================
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SETUP_D", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SETUP_D", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SETUP_D", element: "마감", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SETUP_D", element: "해제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SETUP", grid: true, event: "rowselecting", handler: rowselecting_grdData_SETUP };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SETUP", grid: true, event: "rowselected", handler: rowselected_grdData_SETUP };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SETUP", grid: true, element: "issue_cnt", event: "click", handler: click_grdData_SETUP_issue_cnt };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SETUP_D", grid: true, event: "rowselected", handler: rowselected_grdData_SETUP_D };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SETUP_D", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_SETUP_D };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SETUP_D", grid: true, element: "setup_issue_cnt", event: "click", handler: click_grdData_SETUP_D_setup_issue_cnt };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: click_grdData_FILE_download };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_SETUP(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_SETUP(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function click_grdData_SETUP_issue_cnt(ui) {

            v_global.event.data = {
                setup_no: gw_com_api.getValue(ui.object, ui.row, "setup_no", true),
                setup_seq: "0"
            };
            var args = {
                type: "PAGE", page: "EHM_3211", title: "SETUP ISSUE 조회",
                width: 1100, height: 400, locate: ["center", "center"], open: true,
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "EHM_3211",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function rowselected_grdData_SETUP_D(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------
        function rowdblclick_grdData_SETUP_D(ui) {

            processEdit({ setup_no: gw_com_api.getValue(ui.object, ui.row, "setup_no", true), setup_seq: gw_com_api.getValue(ui.object, ui.row, "setup_seq", true), auth: "R" });

        }
        //----------
        function click_grdData_SETUP_D_setup_issue_cnt(ui) {

            v_global.event.data = {
                setup_no: gw_com_api.getValue(ui.object, ui.row, "setup_no", true),
                setup_seq: gw_com_api.getValue(ui.object, ui.row, "setup_seq", true)
            };
            var args = {
                type: "PAGE", page: "EHM_3211", title: "SETUP ISSUE 조회",
                width: 1100, height: 400, locate: ["center", "center"], open: true,
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "EHM_3211",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_grdData_FILE_download(ui) {

            var args = {
                source: { id: ui.object, row: ui.row },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }

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

    switch (param.element) {
        case "조회":
            {
                var args = { target: [{ id: "frmOption", focus: true }] };
                gw_com_module.objToggle(args);
            }
            break;
        case "추가":
            {
                closeOption({});
                if (param.object == "lyrMenu_2") {
                    if (!checkUpdatable({})) return;
                    v_global.event.type = "GRID";
                    v_global.event.object = "grdData_SETUP";
                    v_global.event.row = row;
                    v_global.event.data = {
                        dept_area: gw_com_api.getValue("frmOption", 1, "dept_area")
                    };
                    var args = {
                        type: "PAGE", page: "w_find_prod_ehm", title: "장비 검색",
                        width: 800, height: 460, locate: ["center", "top"], open: true
                    };
                    if (gw_com_module.dialoguePrepare(args) == false) {
                        var args = {
                            page: "w_find_prod_ehm",
                            param: {
                                ID: gw_com_api.v_Stream.msg_selectProduct_EHM,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                } else if (param.object == "lyrMenu_SETUP_D") {
                    var row = gw_com_api.getSelectedRow("grdData_SETUP");
                    if (row > 0) {
                        var setup_no = gw_com_api.getValue("grdData_SETUP", row, "setup_no", true);
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

                    }
                    else
                        gw_com_api.messageBox([{ text: "NOMASTER" }]);
                }
            }
            break;
        case "수정":
            {
                closeOption({});
                if (param.object == "lyrMenu_SETUP_D") {
                    var row = gw_com_api.getSelectedRow("grdData_SETUP_D");
                    if (row > 0) {
                        var args = {
                            setup_no: gw_com_api.getValue("grdData_SETUP_D", row, "setup_no", true),
                            setup_seq: gw_com_api.getValue("grdData_SETUP_D", row, "setup_seq", true)
                        }
                        processEdit(args);
                    } else
                        gw_com_api.messageBox([{ text: "NOMASTER" }]);
                } else if (param.object == "lyrMenu_SETUP_PROC") {
                    if (!checkManipulate({})) return;
                    changeStat({ object: param.object, element: "저장" });
                    processLink({ proc: true });
                }
            }
            break;
        case "취소":
            {
                changeStat({ object: "lyrMenu_SETUP_PROC", element: "수정" });
                processLink({ proc: true });
            };
        case "삭제":
            {
                closeOption({});
                if (param.object == "lyrMenu_2") {
                    v_global.process.handler = processRemove;
                    if (!checkManipulate({})) return;
                    checkRemovable({});
                }
            }
            break;
        case "저장":
            {
                closeOption({});
                processSave({});
            }
            break;
        case "닫기":
            {
                closeOption({});
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
            }
            break;
        case "마감":
        case "해제":
            {
                closeOption({});
                var row = gw_com_api.getSelectedRow("grdData_SETUP_D");
                if (row > 0) {
                    var data = param.element == "마감" ? "1" : "0";
                    var args = {
                        url: "COM",
                        procedure: "sp_updateEHMSetup",
                        nomessage: true,
                        input: [
                            { name: "setup_no", value: gw_com_api.getValue("grdData_SETUP_D", row, "setup_no", true), type: "varchar" },
                            { name: "setup_seq", value: gw_com_api.getValue("grdData_SETUP_D", row, "setup_seq", true), type: "int" },
                            { name: "act_tp", value: "CLOSE", type: "varchar" },
                            { name: "data", value: data, type: "varchar" },
                            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                        ],
                        output: [
                            { name: "rtn_msg", type: "varchar" }
                        ],
                        handler: {
                            success: successBatch,
                            param: {
                                act_tp: "CLOSE"
                            }
                        }
                    };
                    gw_com_module.callProcedure(args);
                } else
                    gw_com_api.messageBox([{ text: "NOMASTER" }]);
            }
            break;
    }

}
//----------
function processEdit(param) {

    var setup_no = param.setup_no;
    var setup_seq = param == undefined || param.setup_seq == undefined ? "" : param.setup_seq;
    var auth = "";
    if (param.auth != undefined)
        auth = param.auth;
    else
        auth = (setup_seq == "" ? "U" : getAuth({ setup_no: setup_no, setup_seq: setup_seq, user_id: gw_com_module.v_Session.USR_ID }));
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
function changeStat(param) {

    if (param.object == "lyrMenu_SETUP_PROC") {
        //=====================================================================================
        var args = {
            targetid: param.object, type: "FREE", show: (gw_com_module.v_Session.USER_TP == "EMP" || gw_com_module.v_Session.USER_TP == "SYS" ? true : false)
        };

        if (param.element == "수정") {
            args.element = [
                { name: param.element, value: param.element, icon: "기타" }
            ];
        } else {
            args.element = [
                { name: "취소", value: "취소", icon: "아니오" },
                { name: param.element, value: param.element, icon: "저장" }
            ];
        }
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        $.each(args.element, function (i, v) {
            var args = { targetid: param.object, element: v.name, event: "click", handler: processButton }
            gw_com_module.eventBind(args);
        });
        //=====================================================================================
        var args = {
            targetid: "grdData_SETUP_PROC", query: "EHM_3210_3", title: "공정별 진행 상황",
            caption: true, height: 230, pager: true, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "공정명", name: "proc_nm", width: 170 },
                { header: "진행상태", name: "pstat_nm", width: 60, align: "center", hidden: (param.element == "수정" ? false : true) },
                {
                    header: "진행상태", name: "pstat", width: 60, align: "center", hidden: (param.element == "수정" ? true : false),
                    format: { type: "select", data: { memory: "IEHM56" } },
                    editable: { type: "select", data: { memory: "IEHM56", validate: { rule: "required", message: "진행상태" } } }
                },
                {
                    header: "완료일", name: "end_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: (param.element == "수정" ? "hidden" : "text") }
                },
                { header: "난이도", name: "proc_level_nm", width: 60, align: "center", hidden: (param.element == "수정" ? false : true) },
                {
                    header: "난이도", name: "proc_level", width: 60, align: "center", hidden: (param.element == "수정" ? true : false),
                    format: { type: "select", data: { memory: "IEHM57" } },
                    editable: { type: "select", data: { memory: "IEHM57", unshift: [{ title: "-", value: "" }], validate: { rule: "required", message: "난이도" } } }
                },
                { name: "setup_no", hidden: true, editable: { type: "hidden" } },
                { name: "proc_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_SETUP_PROC", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = { targetid: "grdData_SETUP_PROC", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
    }
}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_SETUP", "selected", true);

}
//----------
function processItemchanged(param) {

    switch (param.object) {
        case "frmOption":
            {
                if (param.element == "stat_90") {
                    $("#frmOption_ymd_fr").attr("disabled", param.value.current == "1" ? false : true);
                    $("#frmOption_ymd_to").attr("disabled", param.value.current == "1" ? false : true);
                }
            }
            break;
        case "grdData_SETUP_PROC":
            {
                if (param.element == "pstat") {
                    if (param.value.current == "90") {
                        if (gw_com_api.getValue(param.object, param.row, "end_date", true) == "")
                            gw_com_api.setValue(param.object, param.row, "end_date", gw_com_api.getDate(), true);
                    } else {
                        gw_com_api.setValue(param.object, param.row, "end_date", "", true);
                    }
                }
            }
            break;
    }

}
//----------
function checkManipulate(param) {

    closeOption({});
    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            { type: "GRID", id: "grdData_SETUP", refer: (param.sub) ? true : false },
            { type: "GRID", id: "grdData_SETUP_D", refer: (param.sub) ? true : false },
            { type: "GRID", id: "grdData_SETUP_PROC", refer: (param.sub) ? true : false },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else {
        var args = {
            request: "DATA",
            name: "EHM_3210_1_CHK_DEL",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=EHM_3210_1_CHK_DEL" +
                "&QRY_COLS=deletable" +
                "&CRUD=R" +
                "&arg_setup_no=" + gw_com_api.getValue("grdData_SETUP", "selected", "setup_no", true),
            async: false,
            handler_success: successRequest
        };
        gw_com_module.callRequest(args);

        function successRequest(type, name, data) {

            if (data.DATA[0] == "1")
                gw_com_api.messageBox([
                    { text: "REMOVE" }
                ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
            else
                gw_com_api.messageBox([{ text: "보고서가 등록되어 있어 삭제할 수 없습니다." }]);

        }
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var pstat = (gw_com_api.getValue("frmOption", 1, "stat_10") == "1" ? "10" : "");
    pstat += "," + (gw_com_api.getValue("frmOption", 1, "stat_20") == "1" ? "20" : "");
    pstat += "," + (gw_com_api.getValue("frmOption", 1, "stat_80") == "1" ? "80" : "");
    pstat += "," + (gw_com_api.getValue("frmOption", 1, "stat_90") == "1" ? "90" : "");
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "cust_nm", argument: "arg_cust_nm" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" }
            ],
            argument: [
                { name: "arg_pstat", value: pstat },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ],
            remark: [
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "cust_nm" }] },
                { element: [{ name: "cust_prod_nm" }] },
                { element: [{ name: "proj_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_SETUP", select: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_SETUP_D" },
            { type: "GRID", id: "grdData_SETUP_PROC" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: {
                id: "grdData_SETUP"
            }
        },
        key: v_global.logic.key1
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.proc) {
        args = {
            source: {
                type: "GRID", id: "grdData_SETUP", row: "selected",
                element: [
                    { name: "setup_no", argument: "arg_setup_no" }
                ],
                argument: [
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SETUP_PROC", select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: {
                    id: "grdData_SETUP_PROC"
                }
            }
        };
    } else if (param.sub) {
        return;
        //args = {
        //    source: {
        //        type: "GRID", id: "grdData_SETUP_D", row: "selected",
        //        element: [
        //            { name: "setup_no", argument: "arg_setup_no" },
        //            { name: "setup_seq", argument: "arg_setup_seq" }
        //        ],
        //        argument: [
        //            { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
        //        ]
        //    },
        //    target: [
        //        { type: "GRID", id: "grdData_FILE", select: true }
        //    ],
        //    handler: {
        //        complete: processRetrieveEnd,
        //        param: {
        //            id: "grdData_FILE"
        //        }
        //    }
        //};
    } else {
        args = {
            source: {
                type: "GRID", id: "grdData_SETUP", row: "selected", block: true,
                element: [
                    { name: "setup_no", argument: "arg_setup_no" }
                ],
                argument: [
                    { name: "arg_setup_seq", value: 0 },
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SETUP_D", select: true },
                { type: "GRID", id: "grdData_SETUP_PROC", select: true },
                { type: "GRID", id: "grdData_FILE", select: true }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: {
                    id: "grdData_SETUP_D"
                }
            }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (param.id == "grdData_SETUP")
        v_global.logic.key1 = undefined;
    else if (param.id == "grdData_SETUP_D")
        v_global.logic.key2 = undefined;
    else if (param.id == "grdData_SETUP_PROC")
        v_global.logic.key3 = undefined;

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_SETUP_D", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_SETUP", v_global.process.current.master, true, false);

}
//----------
function processDelete(param) {

    if (param.sub) {
        var args = {
            targetid: "grdData_SETUP_D", row: "selected",
            clear: [
                { type: "FORM", id: "frmData_보고서" }
            ]
        };
        gw_com_module.gridDelete(args);
    }
    else {
        var args = {
            targetid: "grdData_SETUP", row: "selected", remove: true,
            clear: [
                { type: "GRID", id: "grdData_SETUP_D" },
                { type: "FORM", id: "frmData_보고서" },
                { type: "GRID", id: "grdData_SETUP_PROC" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
        gw_com_module.gridDelete(args);
    }
}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_SETUP" },
            { type: "GRID", id: "grdData_SETUP_D" },
            { type: "GRID", id: "grdData_SETUP_PROC" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (gw_com_api.getUpdatable("grdData_SETUP_PROC", true)) {
        var err = false;
        var ids = gw_com_api.getRowIDs("grdData_SETUP_PROC");
        $.each(ids, function () {
            var pstat = gw_com_api.getValue("grdData_SETUP_PROC", this, "pstat", true);
            var end_date = gw_com_api.getValue("grdData_SETUP_PROC", this, "end_date", true);
            if (pstat == "90" && end_date == "") {
                err = true;
                gw_com_api.selectRow("grdData_SETUP_PROC", this, true);
                gw_com_api.messageBox([{ text: "완료일을 입력하세요." }]);
                return false;
            } else if (pstat != 90 && end_date != "") {
                gw_com_api.setValue("grdData_SETUP_PROC", this, "end_date", "", true);
            }
        });
        if (err) return false;
    }

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    v_global.logic.key1 = [{
        QUERY: $("#grdData_SETUP_data").attr("query"),
        KEY: [{ NAME: "setup_no", VALUE: gw_com_api.getValue("grdData_SETUP", "selected", "setup_no", true) }]
    }];
    v_global.logic.key2 = [{
        QUERY: $("#grdData_SETUP_D_data").attr("query"),
        KEY: [
            { NAME: "setup_no", VALUE: gw_com_api.getValue("grdData_SETUP_D", "selected", "setup_no", true) },
            { NAME: "setup_seq", VALUE: gw_com_api.getValue("grdData_SETUP_D", "selected", "setup_seq", true) }
        ]
    }];
    v_global.logic.key3 = [{
        QUERY: $("#grdData_SETUP_PROC_data").attr("query"),
        KEY: [
            { NAME: "setup_no", VALUE: gw_com_api.getValue("grdData_SETUP_PROC", "selected", "setup_no", true) },
            { NAME: "prc_seq", VALUE: gw_com_api.getValue("grdData_SETUP_PROC", "selected", "proc_seq", true) }
        ]
    }];

    changeStat({ object: "lyrMenu_SETUP_PROC", element: "수정" });
    processLink({ proc: true });

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_SETUP",
                key: [{ row: "selected", element: [{ name: "setup_no" }] }]
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_SETUP",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_보고서"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({ type: "GRID", id: "grdData_SETUP_D" });
        args.target.unshift({ type: "GRID", id: "grdData_SETUP_PROC" });
        args.target.unshift({ type: "GRID", id: "grdData_FILE" });
        args.target.unshift({ type: "GRID", id: "grdData_SETUP" });
    }
    else if (param.sub) {
        args.target.unshift({ type: "GRID", id: "grdData_SETUP_D" });
        args.target.unshift({ type: "GRID", id: "grdData_FILE" });
    }
    gw_com_module.objClear(args);

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
function successBatch(response, param) {

    var msg = "";
    if (param.act_tp == "CREATE") {
        msg = response.VALUE[1];
        v_global.logic.key1 = [{
            QUERY: $("#grdData_SETUP_data").attr("query"),
            KEY: [{ NAME: "setup_no", VALUE: response.VALUE[0] }]
        }];
    } else if (param.act_tp == "CLOSE") {
        msg = response.VALUE[0];
    }

    if (msg == "") {
        gw_com_api.messageBox([{ text: "정상 처리되었습니다." }]);
        if (param.act_tp == "CREATE")
            processRetrieve({});
        else if (param.act_tp == "CLOSE")
            processLink({});
    } else {
        gw_com_api.messageBox([{ text: msg }]);
    }

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
                                processSave(param.data.arg);
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_EHM:
            {
                var args = {
                    url: "COM",
                    procedure: "sp_createEHMSetup",
                    nomessage: true,
                    input: [
                        { name: "prod_key", value: param.data.prod_key, type: "varchar" },
                        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                    ],
                    output: [
                        { name: "setup_no", type: "varchar" },
                        { name: "rtn_msg", type: "varchar" }
                    ],
                    handler: {
                        success: successBatch,
                        param: {
                            act_tp: "CREATE"
                        }
                    }
                };
                gw_com_module.callProcedure(args);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "w_find_prod_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_EHM;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "w_upload_assetup":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASSETUP;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_SETUP", "selected", "setup_no", true),
                                seq: gw_com_api.getValue("grdData_SETUP", "selected", "str_ymd", true)
                            };
                        }
                        break;
                    case "EHM_3211":
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
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//