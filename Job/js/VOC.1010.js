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
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "PAGE", name: "구분", query: "DDDW_ZCODED",
                    param: [{ argument: "arg_hcode", value: "VOC01" }]
                },
                {
                    type: "PAGE", name: "접수유형", query: "DDDW_ZCODED",
                    param: [{ argument: "arg_hcode", value: "VOC02" }]
                },
                {
                    type: "PAGE", name: "처리상태", query: "DDDW_ZCODED_ALL",
                    param: [{ argument: "arg_hcode", value: "VOC03" }]
                },
                {
                    type: "PAGE", name: "처리방안", query: "DDDW_ZCODED",
                    param: [{ argument: "arg_hcode", value: "VOC04" }]
                },
                {
                    type: "PAGE", name: "확인결과", query: "DDDW_ZCODED",
                    param: [{ argument: "arg_hcode", value: "VOC06" }]
                },
                {
                    type: "PAGE", name: "IEHM02", query: "DDDW_ZCODED",
                    param: [{ argument: "arg_hcode", value: "IEHM02" }]
                },
                {
                    type: "PAGE", name: "IEHM03", query: "DDDW_ZCODED",
                    param: [{ argument: "arg_hcode", value: "IEHM03" }]
                },
                {
                    type: "PAGE", name: "ISCM25", query: "DDDW_ZCODED",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
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
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "rcpt_user_nm", gw_com_module.v_Session.USR_NM);
            gw_com_api.setValue("frmOption", 1, "rcpt_user", gw_com_module.v_Session.USR_ID)
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
            targetid: "lyrMenu", type: "FREE", show: true,
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "VOC 등록" },
                { name: "수정", value: "상세내용", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE", show: true,
            element: [
                { name: "조회", value: "새로고침" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
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
                                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "접수일 :" },
                                mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "cust_nm", label: { title: "고객사 :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "charge_dept_nm", label: { title: "담당부서 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "charge_user_nm", label: { title: "담당자 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "rcpt_user_nm", label: { title: "접수자 :" },
                                editable: { type: "text", size: 10 }, hidden: true
                            },
                            { name: "rcpt_user", hidden: true }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "voc_tp", label: { title: "구분 :" },
                                editable: { type: "select", data: { memory: "구분", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "rcpt_tp", label: { title: "접수유형 :" },
                                editable: { type: "select", data: { memory: "접수유형", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "result_cd", label: { title: "처리방안 :" },
                                editable: { type: "select", data: { memory: "처리방안", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "result_stat", label: { title: "처리상태 :" },
                                editable: { type: "select", data: { memory: "처리상태", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "chk_cd", label: { title: "확인결과 :" },
                                editable: { type: "select", data: { memory: "확인결과", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cust_dept", label: { title: "Line :" },
                                editable: { type: "select", data: { memory: "IEHM02", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "prod_type", label: { title: "제품유형 :" },
                                editable: { type: "select", data: { memory: "ISCM25", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "cust_proc", label: { title: "Process :" },
                                editable: { type: "select", data: { memory: "IEHM03", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "voc_title", label: { title: "제목 :" },
                                editable: { type: "text", size: 20 }
                            },
                            {
                                name: "voc_no", label: { title: "관리번호 :" },
                                editable: { type: "text", size: 12 }
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
            targetid: "grdList_VOC", query: "VOC_1010_1", title: "등록 정보",
            height: 150, show: true, caption: true, selectable: true, number: true,
            element: [
                { header: "관리번호", name: "voc_no", width: 100, align: "center" },
                { header: "구분", name: "voc_tp_nm", width: 80 },
                { header: "고객사", name: "cust_nm", width: 120 },
                { header: "고객담당", name: "cust_emp", width: 100 },
                { header: "제목", name: "voc_title", width: 320 },
                { header: "접수유형", name: "rcpt_tp_nm", width: 100 },
                { header: "접수부서", name: "rcpt_dept_nm", width: 100 },
                { header: "접수자", name: "rcpt_user_nm", width: 80 },
                { header: "접수일", name: "rcpt_date", width: 80, align: "center", mask: "date-ymd" }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PROD", query: "VOC_1010_2", title: "대상 설비",
            caption: true, height: 100, pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "Line", name: "cust_dept_nm", width: 350 },
                { header: "제품유형", name: "prod_type_nm", width: 350 },
                { header: "Process", name: "cust_proc_nm", width: 350 },
                { name: "voc_no", hidden: true },
                { name: "prod_seq", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_CHARGE", query: "VOC_1010_3", title: "처리 담당",
            caption: true, height: 100, pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "담당부서", name: "charge_dept_nm", width: 100 },
                { header: "담당자", name: "charge_user_nm", width: 80 },
                { header: "진행요청내용", name: "rqst_rmk", width: 280 },
                { header: "접수일", name: "rcpt_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "고객요청일", name: "cust_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "처리방안", name: "result_nm", width: 70 },
                { header: "처리예정일", name: "plan_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "처리상태", name: "result_stat_nm", width: 70 },
                { header: "처리완료일", name: "result_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "처리결과", name: "chk_nm", width: 70 },
                { header: "확인일자", name: "chk_date", width: 80, align: "center", mask: "date-ymd" },
                { name: "voc_no", hidden: true },
                { name: "charge_seq", hidden: true },
                { name: "charge_dept", hidden: true },
                { name: "charge_user", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE", query: "VOC_1010_4", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 350, align: "left" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 600, align: "left",
                    editable: { type: "text" }
                },
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
                { type: "GRID", id: "grdList_VOC", offset: 8 },
                { type: "GRID", id: "grdList_PROD", offset: 8 },
                { type: "GRID", id: "grdList_CHARGE", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_VOC", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_VOC", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_FILE", grid: true, element: "download", event: "click", handler: processDownload };
        gw_com_module.eventBind(args);
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        if (param.object == "lyrMenu") {
                            var args = { target: [{ id: "frmOption", focus: true }] };
                            gw_com_module.objToggle(args);
                        } else {
                            processRetrieve({});
                        }
                    }
                    break;
                case "추가":
                    {
                        closeOption({});
                        processEdit({});
                    }
                    break;
                case "수정":
                    {
                        closeOption({});
                        var row = gw_com_api.getSelectedRow("grdList_VOC");
                        if (row > 0) {
                            processEdit({ voc_no: gw_com_api.getValue("grdList_VOC", row, "voc_no", true) });
                        } else {
                            gw_com_api.messageBox([{ text: "NODATA" }]);
                        }
                    }
                    break;
                case "닫기":
                    {
                        closeOption({});
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
            }

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

    var args;
    if (param.object == "grdList_VOC") {
        args = {
            source: {
                type: "FORM", id: "frmOption",
                element: [
                    { name: "charge_dept_nm", argument: "arg_charge_dept_nm" },
                    { name: "charge_user_nm", argument: "arg_charge_user_nm" },
                    { name: "result_cd", argument: "arg_result_cd" },
                    { name: "result_stat", argument: "arg_result_stat" },
                    { name: "chk_cd", argument: "arg_chk_cd" },
                    { name: "prod_type", argument: "arg_prod_type" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "cust_proc", argument: "arg_cust_proc" }
                ],
                argument: [
                    { name: "arg_voc_no", value: gw_com_api.getValue(param.object, param.row, "voc_no", (param.type == "GRID")) }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_PROD", select: true },
                { type: "GRID", id: "grdList_CHARGE", select: true },
                { type: "GRID", id: "grdList_FILE", select: true }
            ],
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "cust_nm", argument: "arg_cust_nm" },
                    { name: "rcpt_user_nm", argument: "arg_rcpt_user_nm" },
                    { name: "rcpt_user", argument: "arg_rcpt_user_id" },
                    { name: "charge_dept_nm", argument: "arg_charge_dept_nm" },
                    { name: "charge_user_nm", argument: "arg_charge_user_nm" },
                    { name: "voc_tp", argument: "arg_voc_tp" },
                    { name: "rcpt_tp", argument: "arg_rcpt_tp" },
                    { name: "result_cd", argument: "arg_result_cd" },
                    { name: "result_stat", argument: "arg_result_stat" },
                    { name: "chk_cd", argument: "arg_chk_cd" },
                    { name: "prod_type", argument: "arg_prod_type" },
                    { name: "cust_dept", argument: "arg_cust_dept" },
                    { name: "cust_proc", argument: "arg_cust_proc" },
                    { name: "voc_title", argument: "arg_voc_title" },
                    { name: "voc_no", argument: "arg_voc_no" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "cust_nm" }] },
                    { element: [{ name: "rcpt_user_nm" }] },
                    { element: [{ name: "charge_dept_nm" }] },
                    { element: [{ name: "charge_user_nm" }] },
                    { element: [{ name: "voc_tp" }] },
                    { element: [{ name: "rcpt_tp" }] },
                    { element: [{ name: "result_cd" }] },
                    { element: [{ name: "result_stat" }] },
                    { element: [{ name: "chk_cd" }] },
                    { element: [{ name: "cust_dept" }] },
                    { element: [{ name: "prod_type" }] },
                    { element: [{ name: "cust_proc" }] },
                    { element: [{ name: "voc_title" }] },
                    { element: [{ name: "voc_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_VOC", select: true }
            ],
            clear: [
                 { type: "GRID", id: "grdList_PROD" },
                 { type: "GRID", id: "grdList_CHARGE" },
                 { type: "GRID", id: "grdList_FILE" }
            ],
            key: param.key
        };
    }
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

}
//----------
function processDownload(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processEdit(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "VOC_1020",
            title: "VOC 등록"
        }
    };
    if (param.voc_no != undefined) {
        var auth = getAuth({ voc_no: voc_no, user_id: gw_com_module.v_Session.USR_ID });
        args.data.param = [
            { name: "AUTH", value: auth },
            { name: "voc_no", value: param.voc_no }
        ];
    } else if (param.object == "grdList_VOC") {
        var voc_no = gw_com_api.getValue(param.object, param.row, "voc_no", (param.type == "GRID"));
        var auth = getAuth({ voc_no: voc_no, user_id: gw_com_module.v_Session.USR_ID });
        args.data.param = [
            { name: "AUTH", value: auth },
            { name: "voc_no", value: voc_no }
        ];
    }
    gw_com_module.streamInterface(args);

}
//----------
function getAuth(param) {

    var rtn = "U";
    var args = {
        request: "DATA",
        name: "VOC_1020_AUTH",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=VOC_1020_AUTH" +
            "&QRY_COLS=auth" +
            "&CRUD=R" +
            "&arg_voc_no=" + param.voc_no +
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