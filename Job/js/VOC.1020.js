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

    //#region : ready
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "DLG_CODE", title: "코드 선택", width: 500, height: 300 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택", width: 700, height: 450 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", width: 650, height: 500 };
        gw_com_module.dialoguePrepare(args);

        // set data. for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "구분", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "VOC01" }]
                },
                {
                    type: "PAGE", name: "접수유형", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "VOC02" }]
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // go next.
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();

            v_global.logic.voc_no = gw_com_api.getPageParameter("voc_no");
            if (v_global.logic.voc_no == "")
                processInsert({});
            else
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
                //{ name: "메일", value: "메일발송", icon: "기타", updatable: true },
                { name: "추가", value: "VOC 추가" },
                { name: "삭제", value: "VOC 삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
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
            targetid: "lyrMenu_PROD", type: "FREE",
            element: [
                { name: "추가", value: "설비 추가" },
                { name: "삭제", value: "설비 삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_CHARGE", type: "FREE",
            element: [
                { name: "추가", value: "담당자 추가" },
                { name: "삭제", value: "담당자 삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "파일 추가" },
                { name: "삭제", value: "파일 삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_VOC", query: "VOC_1020_1", type: "TABLE", title: "VOC 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "voc_tp", validate: true },
            content: {
                width: { label: 120, field: 155 },
                height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "voc_no", editable: { type: "hidden" } },
                            { header: true, value: "구분", format: { type: "label" } },
                            {
                                name: "voc_tp", style: { colfloat: "float" }, format: { width: 0 },
                                editable: { type: "select", data: { memory: "구분" }, validate: { rule: "required", message: "구분" } }
                            },
                            { name: "voc_tp_nm", style: { colfloat: "floating" } },
                            { header: true, value: "고객사", format: { type: "label" } },
                            {
                                name: "cust_nm", mask: "search",
                                editable: { type: "text", validate: { rule: "required", message: "고객사" } }
                            },
                            { name: "cust_cd", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "고객담당", format: { type: "label" } },
                            {
                                name: "cust_emp",
                                editable: { type: "text", maxlength: 20, validate: { rule: "required", message: "고객담당" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "voc_title", style: { colspan: 5 },
                                format: { width: 700 },
                                editable: { type: "text", width: 732, maxlength: 200, validate: { rule: "required", message: "제목" } }
                            },
                            { header: true, value: "장비군", format: { type: "label" } },
                            {
                                name: "dept_area", style: { colfloat: "float" }, format: { width: 0 },
                                editable: { type: "select", data: { memory: "장비군" }, validate: { rule: "required", message: "장비군" } }
                            },
                            { name: "dept_area_nm", style: { colfloat: "floating" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "접수유형", format: { type: "label" } },
                            {
                                name: "rcpt_tp", style: { colfloat: "float" }, format: { width: 0 },
                                editable: { type: "select", data: { memory: "접수유형" }, validate: { rule: "required", message: "접수유형" } }
                            },
                            { name: "rcpt_tp_nm", style: { colfloat: "floating" } },
                            { header: true, value: "접수부서", format: { type: "label" } },
                            { name: "rcpt_dept_nm", editable: { type: "hidden" }, display: true },
                            { name: "rcpt_dept", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "접수자", format: { type: "label" } },
                            { name: "rcpt_user_nm", editable: { type: "hidden" }, display: true },
                            { name: "rcpt_user", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "접수일", format: { type: "label" } },
                            {
                                name: "rcpt_date", mask: "date-ymd",
                                editable: { type: "text", validate: { rule: "required", message: "접수일" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "요청내용", format: { type: "label" } },
                            {
                                name: "rcpt_memo", style: { colspan: 7 },
                                format: { type: "textarea", rows: 10 },
                                editable: { type: "textarea", rows: 10 }
                            }
                        ]
                    }//,
                    //{
                    //    element: [
                    //        { header: true, value: "요청내용", format: { type: "label" } },
                    //        {
                    //            name: "rcpt_html", style: { colspan: 7 },
                    //            format: { type: "html", height: 200, top: 5 }
                    //        },
                    //        { name: "rcpt_memo", editable: { type: "hidden" }, hidden: true }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PROD", query: "VOC_1020_2", title: "대상 설비",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "cust_dept", validate: true },
            element: [
                {
                    header: "Line", name: "cust_dept_nm", width: 350,
                    editable: { type: "text", validate: { rule: "required" } }, mask: "search"
                },
                {
                    header: "제품유형", name: "prod_type_nm", width: 350,
                    editable: { type: "text", validate: { rule: "required" } }, mask: "search"
                },
                {
                    header: "Process", name: "cust_proc_nm", width: 350,
                    editable: { type: "text", validate: { rule: "required" } }, mask: "search"
                },
                { name: "voc_no", hidden: true, editable: { type: "hidden" } },
                { name: "prod_seq", hidden: true, editable: { type: "hidden" } },
                { name: "cust_dept", hidden: true, editable: { type: "hidden" } },
                { name: "cust_proc", hidden: true, editable: { type: "hidden" } },
                { name: "prod_type", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CHARGE", query: "VOC_1020_3", title: "처리 담당",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "_edit_yn", focus: "rqst_rmk", validate: true },
            element: [
                { header: "담당부서", name: "charge_dept_nm", width: 150 },
                {
                    header: "담당자", name: "charge_user_nm", width: 100, mask: "search",
                    editable: { type: "text", validate: { rule: "required" }, bind: "create" }
                },
                {
                    header: "진행요청내용", name: "rqst_rmk", width: 650,
                    editable: { type: "text", validate: { rule: "required" }, maxlength: 200 }
                },
                {
                    header: "접수일", name: "rcpt_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required" }, bind: "create" }
                },
                {
                    header: "고객요청일", name: "cust_date", width: 100, align: "center",
                    editable: { type: "text", validate: { rule: "required" } }, mask: "date-ymd"
                },
                { name: "voc_no", hidden: true, editable: { type: "hidden" } },
                { name: "charge_seq", hidden: true, editable: { type: "hidden" } },
                { name: "charge_dept", hidden: true, editable: { type: "hidden" } },
                { name: "charge_user", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true },
                { name: "_del_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "VOC_1020_4", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "file_desc", validate: true },
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
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
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
                { type: "FORM", id: "frmData_VOC", offset: 8 },
                { type: "GRID", id: "grdData_PROD", offset: 8 },
                { type: "GRID", id: "grdData_CHARGE", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
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

        //=====================================================================================
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "메일", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_PROD", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PROD", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_CHARGE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_CHARGE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_VOC", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_PROD", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_CHARGE", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: click_grdData_FILE_download };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        v_global.process.handler = processRetrieve;
                        if (!checkUpdatable({})) return false;
                        processRetrieve({});
                    }
                    break;
                case "추가":
                    {
                        if (param.object == "lyrMenu") {
                            v_global.process.handler = processInsert;
                            if (!checkUpdatable({})) return;
                            processInsert({});
                        } else if (param.object == "lyrMenu_PROD") {
                            var args = {
                                targetid: "grdData_PROD", edit: true, updatable: true,
                                data: [
                                    { name: "voc_no", value: v_global.logic.voc_no }
                                ]
                            };
                            gw_com_module.gridInsert(args);
                        } else if (param.object == "lyrMenu_CHARGE") {
                            v_global.event.object = "grdData_CHARGE";
                            v_global.event.row = 0;
                            v_global.event.element = "charge_user_nm";
                            v_global.event.type = "GRID";
                            v_global.event.user_nm = "charge_user_nm";
                            v_global.event.user_id = "charge_user";
                            v_global.event.dept_nm = "charge_dept_nm";
                            v_global.event.dept_cd = "charge_dept";
                            var args = {
                                page: "DLG_EMPLOYEE",
                                param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                            };
                            gw_com_module.dialogueOpen(args);
                        } else if (param.object == "lyrMenu_FILE") {
                            if (!checkManipulate({})) return;
                            if (!checkUpdatable({ check: true })) return false;

                            v_global.event.data = {
                                type: "EHM",
                                key: v_global.logic.voc_no,
                                seq: 0,
                                user: gw_com_module.v_Session.USR_ID,
                                crud: "C",
                                biz_area: "공통",
                                doc_area: "99"
                            };
                            var args = {
                                page: "DLG_FileUpload",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_upload_ASFOLDER,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "삭제":
                    {
                        if (param.object == "lyrMenu") {
                            if (!checkManipulate({})) return;
                            v_global.process.handler = processRemove;
                            checkRemovable({});
                        } else if (param.object == "lyrMenu_PROD") {
                            if (!checkManipulate({})) return;
                            var args = { targetid: "grdData_PROD", row: "selected", select: true }
                            gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_CHARGE") {
                            if (!checkManipulate({})) return;
                            var args = { targetid: "grdData_CHARGE", row: "selected", select: true, check: "_del_yn" }
                            gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_FILE") {
                            if (!checkManipulate({})) return;
                            var args = { targetid: "grdData_FILE", row: "selected", select: true }
                            gw_com_module.gridDelete(args);
                        }
                    }
                    break;
                case "저장":
                    {
                        var p = {
                            handler: processSave,
                            param: {}
                        };
                        gw_com_api.messageBox([{ text: "VOC를 저장하시겠습니까?" }], undefined, gw_com_api.v_Message.msg_confirmSave, "YESNO", p);
                        //processSave({});
                    }
                    break;
                case "닫기":
                    {
                        checkClosable({});
                    }
                    break;
            }

        }
        //----------
        function click_grdData_FILE_download(ui) {
            var args = { source: { id: "grdData_FILE", row: ui.row }, targetid: "lyrDown" };
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
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_VOC");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function processItemdblclick(param) {

    if (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R")
        return false;

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "cust_nm":
        case "cust_dept_nm":
        case "cust_proc_nm":
        case "prod_type_nm":
            {
                v_global.event.name = param.element;
                v_global.event.code = (param.element == "cust_nm" ? "cust_cd" : param.element.substr(0, param.element.length - 3));
                v_global.event.data = {
                    hcode: (param.element == "cust_nm" ? "ISCM29" : param.element == "cust_dept_nm" ? "IEHM02" : param.element == "cust_proc_nm" ? "IEHM03" : "ISCM25"),
                    title: (param.element == "cust_nm" ? "고객사" : param.element == "cust_dept_nm" ? "Line" : param.element == "cust_proc_nm" ? "Process" : "제품유형")
                };
                var args = {
                    page: "DLG_CODE",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "rcpt_html":
            {
                v_global.event.html = "rcpt_memo";
                var args = {
                    page: "DLG_EDIT_HTML",
                    option: "width=900,height=600,left=300,resizable=1",
                    data: {
                        title: "요청내용",
                        html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                    }
                };
                gw_com_api.openWindow(args);
            }
            break;
        case "charge_user_nm":
            {
                v_global.event.user_nm = "charge_user_nm";
                v_global.event.user_id = "charge_user";
                v_global.event.dept_nm = "charge_dept_nm";
                v_global.event.dept_cd = "charge_dept";
                var args = {
                    page: "DLG_EMPLOYEE",
                    param: { ID: gw_com_api.v_Stream.msg_selectEmployee }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
    }

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_VOC" },
            { type: "GRID", id: "grdData_PROD" },
            { type: "GRID", id: "grdData_CHARGE" },
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
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_voc_no", value: v_global.logic.voc_no },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        }
    };
    if (param.file) {
        args.target = [
            { type: "GRID", id: "grdData_FILE", select: true }
        ];
    } else {
        args.target = [
            { type: "FORM", id: "frmData_VOC" },
            { type: "GRID", id: "grdData_PROD", select: true },
            { type: "GRID", id: "grdData_CHARGE", select: true },
            { type: "GRID", id: "grdData_FILE", select: true }
        ];
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    processClear({});
    processItemdblclick({ object: "frmDat_VOC", row: 1, element: "cust_nm", type: "FORM" });

}
//----------
function processSave(param) {

    var args = {
        nomessage: true,
        target: [
            { type: "FORM", id: "frmData_VOC" },
            { type: "GRID", id: "grdData_PROD" },
            { type: "GRID", id: "grdData_CHARGE" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // 요청내용 HTML 데이터 저장
    var status = checkCRUD({});
    if (status == "create" || status == "update") {
        args.param = [
            {
                query: "VOC_1020_5",
                row: [
                    {
                        crud: (status == "create" ? "C" : "U"),
                        column: [
                            { name: "voc_no", value: v_global.logic.voc_no },
                            { name: "memo_seq", value: 0 },
                            { name: "memo_cd", value: "RCPT" },
                            { name: "memo", value: gw_com_api.getValue("frmData_VOC", 1, "rcpt_memo") }
                        ]
                    }
                ]
            }
        ];
    }
    args.handler = {
        success: successSave,
        param: { status: status }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    if (param.status == "create") {
        $.each(response, function () {
            $.each(this.KEY, function () {
                if (this.NAME == "voc_no") {
                    v_global.logic.voc_no = this.VALUE;
                    return false;
                }
            });
        });
    }

    var p = {
        handler: function () {
            processRetrieve({});
            // 메일발송
            processBatch(param);
        },
        param: param
    };
    gw_com_api.messageBox([{ text: "VOC가 등록되었습니다." }], undefined, undefined, undefined, p);                            

}
//----------
function processRemove(param) {

    var args = {
        target: [
            {
                type: "FORM", id: "frmData_VOC",
                key: { element: [{ name: "voc_no" }] }
            }
        ],
        handler: { success: successRemove }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_VOC" },
            { type: "GRID", id: "grdData_PROD" },
            { type: "GRID", id: "grdData_CHARGE" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    gw_com_module.objClear(args);

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
        gw_com_api.setFocus(v_global.event.object,
                            v_global.event.row,
                            v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_vocSendMail",
        input: [
            { name: "type", value: "VOC_ALARM01", type: "varchar" },
            { name: "key_no", value: v_global.logic.voc_no, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] == "") {
        //gw_com_api.messageBox([{ text: "SUCCESS" }]);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[0] }]);
    }

}
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            { gw_com_module.streamInterface(param); }
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
                                processSave(param.data.arg);
                            else {
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                else if (v_global.process.handler != null)
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.arg.element == "ECR") {
                                if (param.data.result == "YES")
                                    processECR(param.data.arg);
                            } else {
                                if (param.data.result == "YES")
                                    processInform(param.data.arg);
                            }
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
                                if (param.data.arg.response != undefined)
                                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                                if (param.data.arg.param != undefined)
                                    param.data.arg.handler(param.data.arg.param);
                                else
                                    param.data.arg.handler({});
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedTeam:
            {
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "dept_cd",
                                    param.data.dept_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "dept_nm",
                                    param.data.dept_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                closeDialogue({ page: param.from.page, focus: true });
                if (v_global.event.row == 0) {
                    var args = {
                        targetid: "grdData_CHARGE", edit: true, updatable: true,
                        data: [
                            { name: "voc_no", value: v_global.logic.voc_no },
                            { name: "charge_dept_nm", value: param.data.dept_nm },
                            { name: "charge_dept", value: param.data.dept_cd },
                            { name: "charge_user_nm", value: param.data.user_nm },
                            { name: "charge_user", value: param.data.user_id },
                            { name: "rcpt_date", value: gw_com_api.getDate() },
                            { name: "cust_date", value: gw_com_api.getDate() },
                            { name: "_edit_yn", value: "1" },
                            { name: "_del_yn", value: "1" }
                        ]
                    };
                    v_global.event.row = gw_com_module.gridInsert(args);
                } else {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_id, param.data.user_id, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.user_nm, param.data.user_nm, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_cd, param.data.dept_cd, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.dept_nm, param.data.dept_nm, (v_global.event.type == "GRID"));
                }
                gw_com_api.setFocus(v_global.event.object, v_global.event.row, "rqst_rmk", (v_global.event.type == "GRID"));
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_EHM:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_voc_no", value: gw_com_api.getValue("frmData_VOC", 1, "voc_no") },
                            { name: "arg_seq", value: 1 }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_FILE", select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
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
                    case "DLG_CODE":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "DLG_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_CODE":
                        {
                            if (param.data != undefined) {

                                if (checkCRUD(param) == "none") {
                                    //var rmk = "1. 고객 불만 내용 (최초 발생일자 포함)\n\n" +
                                    //        "2. 고객 요구 사항\n" +
                                    //        "   1) THE VOC (고객이 직접 원한다고 요구하는 사항)\n\n" +
                                    //        "   2) UNDER THE VOC (기본적 부분이라 고객이 말하지 않아도 자동으로 해야하는 사항)\n\n" +
                                    //        "   3) OVER THE VOC (고객이 미처 모르는 요구사항)\n";
                                    var rmk = "처리부서에서 이해할수 있도록 6하원칙에 의하여 작성하시오.";
                                    var args = {
                                        targetid: "frmData_VOC", edit: true, updatable: true,
                                        data: [
                                            { name: "rcpt_date", value: gw_com_api.getDate() },
                                            { name: "rcpt_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                                            { name: "rcpt_dept", value: gw_com_module.v_Session.DEPT_CD },
                                            { name: "rcpt_user_nm", value: gw_com_module.v_Session.USR_NM },
                                            { name: "rcpt_user", value: gw_com_module.v_Session.USR_ID },
                                            { name: "cust_nm", value: param.data.dname },
                                            { name: "cust_cd", value: param.data.dcode },
                                            { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
                                            { name: "rcpt_memo", value: rmk }
                                        ],
                                        clear: [
                                            { type: "GRID", id: "grdData_PROD" },
                                            { type: "GRID", id: "grdData_CHARGE" },
                                            { type: "GRID", id: "grdData_FILE" }
                                        ]
                                    };
                                    gw_com_module.formInsert(args);
                                } else {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, param.data.dcode, (v_global.event.type == "GRID"));
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, param.data.dname, (v_global.event.type == "GRID"));
                                }

                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.html, param.data.html, (v_global.event.type == "GRID"));
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER:
            {
                closeDialogue({ page: param.from.page });
                processRetrieve({ file: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//