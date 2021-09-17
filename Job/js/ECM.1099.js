//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약현황(작성자)
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
				{
				    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM81" }]
				},
                {
                    type: "PAGE", name: "ECM020", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECM020" }]
                },
                {
                    type: "PAGE", name: "ECM030", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECM030" }]
                },
                { type: "PAGE", name: "DOC_GRP", query: "DDDW_ECM_DOC_GRP" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            if (v_global.process.param != "") {
                gw_com_api.setValue("frmOption", 1, "doc_no", gw_com_api.getPageParameter("doc_no"));
            }
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            processRetrieve({});

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
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "상세", value: "상세보기", icon: "조회" },
                { name: "항목", value: "추가항목입력", icon: "기타" },
                { name: "출력", value: "계약서재생성", icon: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "gpr_id", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "gpr_id", label: { title: "계약분류 :" },
                                editable: { type: "select", data: { memory: "DOC_GRP", unshift: [{ title: "전체", value: "0" }] } }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "ISCM81", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "pstat", label: { title: "상태 :" },
                                editable: { type: "select", data: { memory: "ECM020", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "계약일 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "doc_no", label: { title: "문서번호 :" },
                                editable: { type: "text", size: 12 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cr_emp", label: { title: "담당자 :" },
                                editable: { type: "text", size: 7 }
                            },
                            {
                                name: "supp_nm", label: { title: "거래처 :" },
                                editable: { type: "text", size: 13 }
                            },
                            {
                                name: "supp_tp", label: { title: "부계약처 포함 :" },
                                editable: { type: "checkbox", value: "1", offval: "0" }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "remark1", label: { title: "단어검색 :" },
                                editable: { type: "texts", size: 35, keyword: true },
                                tip: { text: " (키워드 간에 + 입력은 AND 조건 / , 입력은 OR 조건 검색)", color: "#505050" }
                            },
                            { name: "remark2", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark3", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark4", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark5", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "cr_title", editable: { type: "texts", size: 1, keyword: true } }
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
        $("#frmOption_remark2").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark3").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark4").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark5").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_cr_title").parents(".jqTransformInputWrapper").hide();
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE",
            trans: false, border: true, show: (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R" ? false : true), align: "left",
            editable: { focus: "pstat", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "pstat", label: { title: "진행상태 :" },
                                editable: { type: "select", data: { memory: "ECM030" } }
                            },
			                { name: "실행", value: "적용", act: true, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "ECM_1030_1", title: "계약현황",
            height: 440, show: true, caption: false, pager: true, selectable: true, number: true, checkrow: true, multi: true,
            element: [
				{ header: "계약분류", name: "grp_nm", width: 100 },
                { header: "제목", name: "cr_title", width: 180 },
                { header: "계약처", name: "supp_nm", width: 120 },
                { header: "계약상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "진행상태", name: "astat_nm", width: 50, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 60, align: "center" },
                { header: "담당자", name: "cr_emp_nm", width: 60, align: "center" },
                { header: "계약기간", name: "cr_term", width: 140 },
                { header: "계약일", name: "cr_date", width: 70, mask: "date-ymd", align: "center" },
                { header: "문서번호", name: "doc_no", width: 80, align: "center" },
                { header: "검토납기일", name: "chkl_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "버전", name: "ver_no", width: 40, align: "center" },
                //{ header: "첨부", name: "", width: 50 },
                { header: "비고", name: "cr_rmk", width: 200 },
                { name: "doc_id", hidden: true }
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
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
			]
        };
        //----------
        gw_com_module.objResize(args);
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "항목", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processButton };
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
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
    //#endregion

};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption(param);
    switch (param.element) {

        case "상세":
            {
                processEdit(param);
            }
            break;
        case "항목":
            {
                if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
                v_global.event.data = {
                    doc_id: gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true),
                    doc_no: gw_com_api.getValue("grdList_MAIN", "selected", "doc_no", true)
                };
                var args = {
                    type: "PAGE", page: "ECM_1022", title: "계약서 항목",
                    width: 600, height: 500, locate: ["center", "center"], open: true, scroll: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args = {
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
        case "출력":
            {
                processCreateDoc(param);
            }
            break;
        case "실행":
            {
                var pstat = gw_com_api.getValue("frmOption2", 1, "pstat");
                if (pstat == "") return;
                var ids = gw_com_api.getSelectedRow("grdList_MAIN", true);
                var doc_id = "";
                $.each(ids, function () {
                    doc_id += (doc_id == "" ? "" : ",") + gw_com_api.getValue("grdList_MAIN", this, "doc_id", true);
                });
                if (doc_id == "") return;
                var proc = {
                    url: "COM",
                    procedure: "sp_updateECMDocStat",
                    input: [
                        { name: "type", value: "U", type: "varchar" },
                        { name: "doc_id", value: doc_id, type: "varchar" },
                        { name: "sub_id", value: "%", type: "varchar" },
                        { name: "pstat", value: pstat, type: "varchar" },
                        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                    ],
                    output: [
                        { name: "err_msg", type: "varchar" }
                    ],
                    handler: {
                        success: processRetrieve,
                        param: param
                    }
                };
                gw_com_module.callProcedure(proc);
            }
            break;
    }

}
//----------
function processEdit(param) {

    var title = "계약 상세";
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "ECM_1020",
            title: title
        }
    };

    if (param.object == "grdList_MAIN" || param.element == "상세") {
        if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
        args.data.param = [
            { name: "doc_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true) },
            { name: "doc_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "doc_no", true) }
        ];
    }
    gw_com_module.streamInterface(args);

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
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
                            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "gpr_id", argument: "arg_grp_id" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "pstat", argument: "arg_pstat" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "cr_emp", argument: "arg_cr_emp" },
                { name: "supp_nm", argument: "arg_supp_nm" },
                { name: "supp_tp", argument: "arg_supp_tp" },
                { name: "doc_no", argument: "arg_doc_no" },
                { name: "remark1", argument: "arg_remark1" },
                { name: "remark2", argument: "arg_remark2" },
                { name: "remark3", argument: "arg_remark3" },
                { name: "remark4", argument: "arg_remark4" },
                { name: "remark5", argument: "arg_remark5" },
                { name: "cr_title", argument: "arg_cr_title" }
            ]//,
            //remark: [
            //    { element: [{ name: "gpr_id" }] },
            //    { element: [{ name: "dept_area" }] },
            //    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
            //    { element: [{ name: "doc_no" }] },
            //    { element: [{ name: "cr_emp" }] },
            //    { element: [{ name: "supp_nm" }] }
            //]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {

        if (param.element == "remark1") {
            gw_com_api.setValue(param.object, param.row, "remark2", param.value.current);
            gw_com_api.setValue(param.object, param.row, "remark3", param.value.current);
            gw_com_api.setValue(param.object, param.row, "remark4", param.value.current);
            gw_com_api.setValue(param.object, param.row, "remark5", param.value.current);
            gw_com_api.setValue(param.object, param.row, "cr_title", param.value.current);
        }

    }

}
//----------
function processCreateDoc(param) {

    if (gw_com_api.getSelectedRow("gtdList_MAIN") < 1) return;
    var doc_id = gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true);
    var doc_no = gw_com_api.getValue("grdList_MAIN", "selected", "doc_no", true);
    var args = {
        page: "ECM_1020",
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: "ECM_1020" },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "DOC_ID", value: doc_id },
            { name: "DOC_NO", value: doc_no }
        ],
        target: { type: "FILE", id: "lyrDown", name: doc_no }
    };
    gw_com_module.objExport(args);

    return true;

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
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
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
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
                    case gw_com_api.v_Message.msg_informBatched:
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
                switch (param.from.page) {
                    case "ECM_1021":
                        break;
                    case "ECM_1022":
                    case "ECM_1023":
                    case "w_upload_ecm_file":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
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