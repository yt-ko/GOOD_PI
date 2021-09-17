//------------------------------------------
// RNS Rule 관리
//------------------------------------------

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

var gw_job_process = {

    ready: function () {

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "RNS_2011", title: "Rule 등록/개정", width: 1000, height: 630 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "RNS_2012", title: "Rule 상세보기", width: 1000, height: 630 };
        gw_com_module.dialoguePrepare(args);

        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_part",
                    param: [{ argument: "arg_type", value: "RNS" }]
                },
                {
                    type: "PAGE", name: "상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "RNS00" }]
                },
                { type: "PAGE", name: "분류", query: "DDDW_RNS_TP" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "rns_fg", "RULE");
            //gw_com_api.filterSelect("frmOption", 1, "rns_tp", { memory: "분류", unshift: [{ title: "전체", value: "" }], key: ["rns_fg"] }, false, true);
            //----------
            var rns_id = gw_com_api.getPageParameter("rns_id");
            if (rns_id != "") {
                try {
                    gw_com_api.setValue("frmOption", 1, "rns_id", rns_id);
                    gw_com_api.setValue("frmOption", 1, "dept_area", "");
                    gw_com_api.setValue("frmOption", 1, "rns_tp", "");
                    gw_com_api.setValue("frmOption", 1, "rns_no", "");
                    gw_com_api.setValue("frmOption", 1, "rns_nm", "");
                    gw_com_api.setValue("frmOption", 1, "dept_nm", "");
                    gw_com_api.setValue("frmOption", 1, "user_nm", "");
                    gw_com_api.setValue("frmOption", 1, "astat", "");
                    processRetrieve({});
                } catch (error) {

                } finally {
                    gw_com_api.setValue("frmOption", 1, "rns_id", "0");
                }
            }

        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "부서", value: "배포부서설정", icon: "기타" },
                { name: "추가", value: "신규등록" },
                { name: "수정", value: "변경등록", icon: "실행" },
                { name: "btnExtend", value: "유지등록", icon: "실행" },
                { name: "복원", value: "이전버전복원", icon: "아니오" },
                { name: "상세", value: "상세보기", icon: "기타" },
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
                                editable: {
                                    type: "select", data: { memory: "장비군", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "rns_tp", memory: "분류", unshift: [{ title: "전체", value: "" }], key: ["dept_area", "rns_fg"] }]
                                }
                            },
                            { name: "rns_fg", hidden: true },
                            {
                                name: "rns_tp", label: { title: "분류 :" },
                                editable: { type: "select", data: { memory: "분류", unshift: [{ title: "전체", value: "" }], key: ["dept_area", "rns_fg"] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rns_no", label: { title: "문서번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "rns_nm", label: { title: "문서명 :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_nm", label: { title: "담당부서 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "user_nm", label: { title: "담당자 :" },
                                editable: { type: "text", size: 8 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "astat", label: { title: "진행상태 :" },
                                editable: { type: "select", data: { memory: "상태", unshift: [{ title: "전체", value: "" }] } }
                            },
                            { name: "rns_id", hidden: true, value: 0 }
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
            targetid: "grdData_MAIN", query: "RNS_2010_1", title: "Rule",
            caption: true, height: 350, show: true, selectable: true, number: true,
            element: [
                { header: "장비군", name: "dept_area_nm", width: 80 },
                { header: "분류", name: "rns_tp_nm", width: 120 },
                { header: "문서번호", name: "rns_no", width: 120 },
                { header: "문서명", name: "rns_nm", width: 250 },
                { header: "개정일자", name: "rev_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "개정번호", name: "rev_no", width: 60, align: "center" },
                { header: "진행상태", name: "astat_nm", width: 80 },
                { header: "담당부서", name: "dept_nm", width: 100 },
                { header: "담당자", name: "user_nm", width: 60 },
                { name: "rns_id", hidden: true },
                { name: "rns_fg", hidden: true },
                { name: "dept_area", hidden: true },
                { name: "astat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "RNS_2010_2", title: "개정이력",
            caption: true, height: 100, show: true, selectable: true, number: true,
            element: [
                { header: "장비군", name: "dept_area_nm", width: 80 },
                { header: "분류", name: "rns_tp_nm", width: 120 },
                { header: "문서번호", name: "rns_no", width: 120 },
                { header: "문서명", name: "rns_nm", width: 250 },
                { header: "개정일자", name: "rev_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "개정번호", name: "rev_no", width: 60, align: "center" },
                { header: "진행상태", name: "astat_nm", width: 80, hidden: true },
                { header: "담당부서", name: "dept_nm", width: 100 },
                { header: "담당자", name: "user_nm", width: 60 },
                { name: "rns_id", hidden: true },
                { name: "rns_fg", hidden: true },
                { name: "dept_area", hidden: true },
                { name: "rev_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);


    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "부서", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnExtend", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "복원", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            if (param.object != "frmOption")
                closeOption({});

            switch (param.element) {

                case "조회":
                    {
                        var args = {
                            target: [{ id: "frmOption", focus: true }]
                        };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "부서":
                case "협력사":
                    {

                        var row = gw_com_api.getSelectedRow("grdData_MAIN");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        // 화면 리프레시 하지 않을 경우 대비하여 최종 정보 가져오기
                        var rns = getRNS({
                            rns_id: gw_com_api.getValue("grdData_MAIN", row, "rns_id", true),
                            rev_tp: gw_com_api.getValue("grdData_MAIN", row, "astat", true) == '12' ? 'EXT' : 'REV'
                        });
                        v_global.event.data = {
                            rns_id: rns.rns_id,
                            rev_no: rns.rev_no,
                            mail: (rns.astat == "25")   // 승인완료건은 공지메일발송
                        };

                        var args = { type: "PAGE", open: true };
                        if (param.element == "부서") {
                            args.page = "RNS_2010_DEPT";
                            args.title = "배포부서";
                            args.width = 500;
                            args.height = 500;
                        } else {
                            args.page = "RNS_2010_SUPP";
                            args.title = "협력사열람설정";
                            args.width = 800;
                            args.height = 500;
                        }
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: args.page,
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }

                    }
                    break;
                case "추가":
                    {
                        processLink({});
                    }
                    break;
                case "btnExtend":   //연장등록
                case "수정":  //변경등록
                    {
                        var row = gw_com_api.getSelectedRow("grdData_MAIN");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        var revTp = (param.element == "btnExtend") ? "EXT" : "REV";     // REV 구분 추가 by JJJ at 2021.04.18
                        processLink({ row: row, rev_tp: revTp });
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
                case "취소":
                    {
                        closeOption({});
                    }
                    break;
                case "복원":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_MAIN");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        } else if (gw_com_api.getValue("grdData_MAIN", row, "astat", true) == "22") {
                            gw_com_api.messageBox([{ text: "결재 중인 자료는 복원할 수 없습니다." }]);
                            return;
                        }
                        var p = {
                            handler: processRestore,
                            param: {
                                rns_id: gw_com_api.getValue("grdData_MAIN", row, "rns_id", true),
                                rev_no: "-1"
                            }
                        };
                        gw_com_api.messageBox([
                            { text: "복원 후 기존 데이터는 복구할 수 없습니다." },
                            { text: "계속 하시겠습니까?" }], undefined, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                    }
                    break;
                case "상세":
                    {
                        var row = gw_com_api.getSelectedRow("grdData_MAIN");
                        if (row == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        processLink({ row: row, view: true });
                    }
                    break;
            }

        }
        //----------
        function processRowselected(param) {

            processRetrieve(param);

        }
        //----------
        function processRowdblclick(param) {

            if (param.object == "grdData_MAIN")
                processLink({ row: param.row, view: true });
            else if (param.object == "grdData_SUB")
                processLink({ row: param.row, rev: true });

        }
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function closeOption(param) {
    gw_com_api.hide("frmOption");
}
//----------
function processRetrieve(param) {

    if (param.object == "grdData_MAIN") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "rns_id", argument: "arg_rns_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        var args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "rns_fg", argument: "arg_rns_fg" },
                    { name: "rns_tp", argument: "arg_rns_tp" },
                    { name: "rns_no", argument: "arg_rns_no" },
                    { name: "rns_nm", argument: "arg_rns_nm" },
                    { name: "dept_nm", argument: "arg_dept_nm" },
                    { name: "user_nm", argument: "arg_user_nm" },
                    { name: "astat", argument: "arg_astat" },
                    { name: "rns_id", argument: "arg_rns_id" }
                ],
                remark: [
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "rns_tp" }] },
                    { element: [{ name: "rns_no" }] },
                    { element: [{ name: "rns_nm" }] },
                    { element: [{ name: "dept_nm" }] },
                    { element: [{ name: "user_nm" }] },
                    { element: [{ name: "astat" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
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
function processLink(param) {
    // 신규 추가의 경우 : param = {}   -> RNS_2011
    // 변경 등록 및 수정의 경우 : param = { row: } -> RNS_2011
    // 상세보기 및 이력 보기의 경우 param = { view: true } or { rev: true } -> RNS_2012
    // param.rev_no: "REV" (개정), "EXT" (연장)

    v_global.event.data = {
        dept_area: gw_com_api.getValue("frmOption", 1, "dept_area"),
        rns_fg: gw_com_api.getValue("frmOption", 1, "rns_fg")
    };
    var page = (param.view || param.rev ? "RNS_2012" : "RNS_2011");
    if (param.rev) {
        // History의 영우 rev_no 값 전달
        v_global.event.data.rns_id = gw_com_api.getValue("grdData_SUB", param.row, "rns_id", true);
        v_global.event.data.rev_no = gw_com_api.getValue("grdData_SUB", param.row, "rev_no", true);
        v_global.event.data.dept_area = gw_com_api.getValue("grdData_MAIN", param.row, "dept_area", true);
        v_global.event.data.rns_fg = gw_com_api.getValue("grdData_MAIN", param.row, "rns_fg", true);
    } else {
        if (param.row != undefined) {
            v_global.event.data.rns_id = gw_com_api.getValue("grdData_MAIN", param.row, "rns_id", true);
            v_global.event.data.dept_area = gw_com_api.getValue("grdData_MAIN", param.row, "dept_area", true);
            v_global.event.data.rns_fg = gw_com_api.getValue("grdData_MAIN", param.row, "rns_fg", true);
            v_global.event.data.rev_tp = param.rev_tp;  // REV 구분 추가 by JJJ at 2021.04.18
        }
    }

    // Check Editable 
    if (page == "RNS_2011" && v_global.event.data.rns_id > 0) {
        var args = {
            message: true,
            rns_id: v_global.event.data.rns_id,
            rev_tp: v_global.event.data.rev_tp,
            handler: function () {
                processLink({ row: param.row, view: true });
            }
        }
        if (!checkEditable(args)) return false;
    }

    // Open Window 
    var args = {
        page: page,
        param: { ID: gw_com_api.v_Stream.msg_openedDialogue, data: v_global.event.data }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);

}
//----------
function checkEditable(param) {

    var rtn = false;
    var args = {
        request: "PAGE",
        name: "RNS_2011_CHK_EDIT",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=RNS_2011_CHK_EDIT" +
            "&QRY_COLS=msg" +
            "&CRUD=R" +
            "&arg_rns_id=" + param.rns_id +
            "&arg_rev_tp=" + param.rev_tp,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(data) {

        if (data.DATA != undefined && data.DATA.length > 0) {
            rtn = (data.DATA[0] == "");
            if (param.message && data.DATA[0] != "") {
                gw_com_api.messageBox([{ text: data.DATA[0] }], undefined, undefined, undefined, param);
            }
        }

    }
    return rtn;

}
//----------
function getRNS(param) {

    var rtn = { rns_id: param.rns_id, rev_no: "", astat: "" };
    var args = {
        request: "PAGE",
        name: "RNS_2011_1",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=RNS_2011_1" +
            "&QRY_COLS=rev_no,astat" +
            "&CRUD=R" +
            "&arg_rns_id=" + param.rns_id +
            "&arg_rev_tp=" + param.rev_tp,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(data) {

        if (data.DATA != undefined && data.DATA.length > 0) {
            rtn = {
                rns_id: param.rns_id,
                rev_no: data.DATA[0],
                astat: data.DATA[1]
            };
        }

    }
    return rtn;

}
//----------
function processRestore(param) {

    var args = {
        url: "COM",
        nomessage: true,
        tran: true,
        procedure: "sp_QMS_restoreRNS",
        input: [
            { name: "rns_id", value: param.rns_id, type: "int" },
            { name: "rev_no", value: param.rev_no, type: "int" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successRestore,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successRestore(response, param) {

    if (response.VALUE[0] > 0) {
        var key = [
            {
                KEY: [
                    { NAME: "rns_id", VALUE: param.rns_id }
                ],
                QUERY: $("#grdData_MAIN_data").attr("query")
            }
        ];
        var p = {
            handler: processRetrieve,
            param: { key: key }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], undefined, undefined, undefined, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
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
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
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
                switch (param.from.page) {
                    case "RNS_2011":
                    case "RNS_2012":
                    case "RNS_2010_DEPT":
                    case "RNS_2010_SUPP":
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
                    case "RNS_2011":
                    case "RNS_2012":
                    case "RNS_2010_DEPT":
                    case "RNS_2010_SUPP":
                        {
                            if (param.data != undefined) {
                                var key = [{
                                    QUERY: $("#grdData_MAIN" + "_data").attr("query"),
                                    KEY: [
                                        { NAME: "rns_id", VALUE: param.data.rns_id }
                                    ]
                                }];
                                processRetrieve({ key: key });
                            }
                        }
                        break;
                }
            }
            break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//