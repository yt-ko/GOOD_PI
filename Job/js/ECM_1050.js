//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약관리
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
                    type: "INLINE", name: "체결방식",
                    data: [
                        { title: "전자", value: "1" },
                        { title: "서면", value: "0" }
                    ]
                },
                {
                    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM81" }]
                },
                {
                    type: "PAGE", name: "ECM020", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECM020" }]
                },
                {
                    type: "PAGE", name: "ECM030", query: "DDDW_CM_CODED",
                    param: [{ argument: "arg_hcode", value: "ECM030" }]
                },
                { type: "PAGE", name: "DOC_GRP", query: "DDDW_ECM_DOC_GRP_LANG" },
                {
                    type: "INLINE", name: "날짜구분",
                    data: [
                        { title: "계약일", value: "CR_DATE" },
                        { title: "계약만료일", value: "CRE_DATE" }
                    ]
                },
                {
                    type: "INLINE", name: "언어",
                    data: [
                        { title: "전체", value: "-" },
                        { title: "국문", value: "KOR" },
                        { title: "영문", value: "ENG" }
                    ]
                }
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
                gw_com_api.setValue("frmOption", 1, "pstat", gw_com_api.getPageParameter("pstat"));
                gw_com_api.setValue("frmOption", 1, "astat", gw_com_api.getPageParameter("astat"));
                gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
                gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
            }
            if (gw_com_api.getValue("frmOption", 1, "ymd_fr") == "") {
                gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
                gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            }
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
                { name: "수정", value: "수정", icon: "조회" },
                { name: "삭제", value: "계약삭제", icon: "삭제" }//,
                //{ name: "출력", value: "출력" },
                //{ name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        if (gw_com_module.v_Session.USER_TP == "SYS") {
            args.element[args.element.length] = { name: "생성", value: "계약서 재생성", icon: "기타" };
            args.element[args.element.length] = { name: "출력", value: "출력" };
        }
        args.element[args.element.length] = { name: "닫기", value: "닫기" };

        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "grp_id", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "doc_lang", label: { title: "계약분류 :" },
                                editable: {
                                    type: "select", data: { memory: "언어" },
                                    change: [{ name: "grp_id", memory: "DOC_GRP", unshift: [{ title: "전체", value: "0" }], key: ["doc_lang"] }]
                                }
                            },
                            {
                                name: "grp_id", //label: { title: "" },
                                editable: { type: "select", data: { memory: "DOC_GRP", unshift: [{ title: "전체", value: "0" }] } }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "ISCM81", unshift: [{ title: "전체", value: "" }] } }
                            },
                            {
                                name: "pstat", label: { title: "상태 :" }, style: { colfloat: "floating" },
                                editable: {
                                    type: "select",
                                    data: { memory: "ECM020", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "astat", memory: "ECM030", key: ["pstat"] }]
                                }
                            },
                            {
                                name: "astat", //label: { title: "" },
                                editable: {
                                    type: "select",
                                    data: { memory: "ECM030", unshift: [{ title: "전체", value: "" }], key: ["pstat"] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "date_tp", style: { colfloat: "float" },
                                editable: { type: "select", data: { memory: "날짜구분" } }
                            },
                            {
                                name: "ymd_fr", mask: "date-ymd", style: { colfloat: "floating" },
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
                            },
                            {
                                name: "cert_yn", label: { title: "체결방식 :" },
                                editable: {
                                    type: "select", data: { memory: "체결방식", unshift: [{ title: "전체", value: "%" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "find", label: { title: "단어검색 :" },
                                editable: { type: "texts", size: 30, keyword: true },
                                tip: { text: " (키워드 간에 + 입력은 AND 조건 , 입력은 OR 조건 검색)", color: "#505050" }
                            },
                            {
                                name: "chk_cr_title", label: { title: "제목 :" }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0", title: "제목 :", disable: true }
                            },
                            {
                                name: "chk_remark3", label: { title: "계약목적 :" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "계약목적 :" }
                            },
                            {
                                name: "chk_remark4", label: { title: "특이사항 :" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "특이사항 :" }
                            },
                            { name: "cr_title", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark1", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark2", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark3", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark4", editable: { type: "texts", size: 1, keyword: true } },
                            { name: "remark5", editable: { type: "texts", size: 1, keyword: true } }
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
        //gw_com_api.filterSelect("frmOption", 1, "grp_id", { memory: "DOC_GRP", unshift: [{ title: "전체", value: "0" }], key: ["doc_lang"] });
        gw_com_api.setValue("frmOption", 1, "doc_lang", gw_com_api.getValue("frmOption", 1, "doc_lang"));
        $("#frmOption_cr_title").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark1").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark2").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark3").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark4").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark5").parents(".jqTransformInputWrapper").hide();
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "ECM_1050_1", title: "계약현황",
            height: 500, show: true, caption: false, pager: true, selectable: true, number: true,
            element: [
                {
                    header: "체결방식", name: "cert_yn", width: 50, align: "center",
                    format: { type: "select", data: { memory: "체결방식" } }
                },
                { header: "계약분류", name: "grp_nm", width: 100 },
                { header: "제목", name: "cr_title", width: 180 },
                { header: "계약대상", name: "cr_prod", width: 100 },
                { header: "계약처", name: "supp_nm", width: 120 },
                { header: "계약상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "진행상태", name: "astat_nm", width: 50, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 60, align: "center" },
                { header: "담당자", name: "cr_emp_nm", width: 60, align: "center" },
                { header: "계약기간", name: "cr_term", width: 140 },
                { header: "계약일", name: "cr_date", width: 70, mask: "date-ymd", align: "center" },
                { header: "자동연장", name: "ext_term_nm", width: 60, align: "center" },
                { header: "문서번호", name: "doc_no", width: 80, align: "center" },
                { header: "날인일", name: "imp_date", width: 70, mask: "date-ymd", align: "center" },
                { header: "이관일", name: "tr_date", width: 70, mask: "date-ymd", align: "center" },
                { header: "이관자", name: "tr_emp", width: 60, align: "center" },
                { header: "바인더", name: "binder", width: 70 },
                { header: "검토납기일", name: "chkl_date", width: 70, align: "center", mask: "date-ymd", hidden: true },
                { header: "검토의뢰일", name: "chk_req_date", width: 70, align: "center", mask: "date-ymd", hidden: true },
                { header: "검토자", name: "chk_emp_nm", width: 60, align: "center", hidden: true },
                { header: "검토일", name: "chk_date", width: 70, align: "center", mask: "date-ymd", hidden: true },
                { header: "버전", name: "ver_no", width: 40, align: "center", hidden: true },
                //{ header: "첨부", name: "", width: 50 },
                { header: "비고", name: "cr_rmk", width: 200 },
                { name: "doc_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
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
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "생성", event: "click", handler: processButton };
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
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processEdit2 };
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

        case "수정":
            {
                if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
                var args = {
                    doc_id: gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true),
                    doc_no: gw_com_api.getValue("grdList_MAIN", "selected", "doc_no", true)
                }
                processEdit(args);
            }
            break;
        case "삭제":
            {
                if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
                var args = {
                    doc_id: gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true)
                };
                if (checkRemovable(args)) {
                    gw_com_api.messageBox([
                        { text: "REMOVE" }
                    ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", { param: { data: args } });
                } else
                    gw_com_api.messageBox([{ text: "권한이 없어 삭제할 수 없습니다." }]);
            }
            break;
        case "출력":
            {
                if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
                var doc_id = gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true);
                var doc_no = gw_com_api.getValue("grdList_MAIN", "selected", "doc_no", true);
                var args = {
                    page: "ECM_2020",
                    option: [
                        { name: "PRINT", value: "pdf" },
                        { name: "PAGE", value: "ECM_2020" },
                        { name: "USER", value: gw_com_module.v_Session.USR_ID },
                        { name: "DOC_ID", value: doc_id },
                        { name: "DOC_NO", value: doc_no }
                    ],
                    target: { type: "FILE", id: "lyrDown", name: doc_no }
                };
                gw_com_module.objExport(args);
            }
            break;
        case "생성":
            {
                if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
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
                    target: { type: "FILE", id: "ZZZ", name: doc_no }
                };
                gw_com_module.objExport(args);

            }
            break;
    }

}
//----------
function processEdit(param) {

    var page = "ECM_1051";
    var auth = "U";

    var title = "계약 수정";
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: page,
            title: title,
            param: [
                { name: "AUTH", value: auth },
                { name: "doc_id", value: param.doc_id },
                { name: "doc_no", value: param.doc_no }
            ]
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processEdit2(param) {

    var args = {
        doc_id: gw_com_api.getValue(param.object, param.row, "doc_id", true),
        doc_no: gw_com_api.getValue(param.object, param.row, "doc_no", true)

    };
    processEdit(args);

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

    // 단어검색 값 설정
    var find = gw_com_api.getValue("frmOption", 1, "find");
    var chk_cr_title = gw_com_api.getValue("frmOption", 1, "chk_cr_title");
    var chk_remark3 = gw_com_api.getValue("frmOption", 1, "chk_remark3");
    var chk_remark4 = gw_com_api.getValue("frmOption", 1, "chk_remark4");
    if (find == "" || (chk_cr_title == "0" && chk_remark3 == "0" && chk_remark4 == "0")) {
        gw_com_api.setValue("frmOption", 1, "cr_title", "");
        gw_com_api.setValue("frmOption", 1, "remark1", "");
        gw_com_api.setValue("frmOption", 1, "remark2", "");
        gw_com_api.setValue("frmOption", 1, "remark3", "");
        gw_com_api.setValue("frmOption", 1, "remark4", "");
        gw_com_api.setValue("frmOption", 1, "remark5", "");
    } else {
        gw_com_api.setValue("frmOption", 1, "cr_title", chk_cr_title == "1" ? find : ".?!@#^");
        gw_com_api.setValue("frmOption", 1, "remark1", ".?!@#^");   // 검색 미사용
        gw_com_api.setValue("frmOption", 1, "remark2", ".?!@#^");   // 검색 미사용
        gw_com_api.setValue("frmOption", 1, "remark3", chk_remark3 == "1" ? find : ".?!@#^");
        gw_com_api.setValue("frmOption", 1, "remark4", chk_remark4 == "1" ? find : ".?!@#^");
        gw_com_api.setValue("frmOption", 1, "remark5", ".?!@#^");   // 검색 미사용
    }
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "grp_id", argument: "arg_grp_id" },
                { name: "doc_lang", argument: "arg_doc_lang" },
                { name: "cert_yn", argument: "arg_cert_yn" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "pstat", argument: "arg_pstat" },
                { name: "astat", argument: "arg_astat" },
                { name: "date_tp", argument: "arg_date_tp" },
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
            ],
            remark: [
                { infix: "-", element: [{ name: "doc_lang" }, { name: "grp_id" }], label: "계약분류 :" },
                { element: [{ name: "cert_yn" }] },
                { element: [{ name: "dept_area" }] },
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_tp") + " :" },
                { element: [{ name: "doc_no" }] },
                { element: [{ name: "cr_emp" }] },
                { element: [{ name: "supp_nm" }] }
            ]
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

        //if (param.element == "remark1") {
        //    gw_com_api.setValue(param.object, param.row, "remark2", param.value.current);
        //    gw_com_api.setValue(param.object, param.row, "remark3", param.value.current);
        //    gw_com_api.setValue(param.object, param.row, "remark4", param.value.current);
        //    gw_com_api.setValue(param.object, param.row, "remark5", param.value.current);
        //    gw_com_api.setValue(param.object, param.row, "cr_title", param.value.current);
        //}

    }

}
//----------
var Query = {
    getAuth: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=ECM_1020_7" +
                    "&QRY_COLS=auth" +
                    "&CRUD=R" +
                    "&arg_menu_id=" + param.page +
                    "&arg_doc_id=" + param.doc_id +
                    "&arg_user_id=" + param.user_id,
            handler_success: successRequest
        };
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        return rtn
    },
    getChk: function (param) {
        var rtn = 0;
        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=ECM_1020_10" +
                    "&QRY_COLS=rtn" +
                    "&CRUD=R" +
                    "&arg_type=" + param.type +
                    "&arg_doc_id=" + param.doc_id +
                    "&arg_sub_id=&arg_pstat=&arg_user_id=" + param.user_id,
            handler_success: successRequest
        };
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = Number(data[0].DATA[0]);
        }
        return rtn
    }
}
//----------
function checkRemovable(param) {

    var rtn = false;
    var args = {
        request: "DATA",
        name: "ECM_1050_1_CHK_DEL",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=ECM_1050_1_CHK_DEL" +
            "&QRY_COLS=deletable" +
            "&CRUD=R" +
            "&arg_doc_id=" + param.doc_id +
            "&arg_user_id=" + gw_com_module.v_Session.USR_ID +
            "&arg_menu_id=" + gw_com_api.getPageID(),
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        if (data.DATA[0] == "1")
            rtn = true;

    }
    return rtn;

}
//----------
function processRemove(param) {

    var row = [{
        crud: "U",
        column: [
            { name: "doc_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true) },
            { name: "pstat", value: "DEL" },
            { name: "astat", value: "DEL" }
        ]
    }];
    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        message: "계약서가 삭제",
        param: [{
            query: "ECM_1020_1",
            row: row
        }],
        handler: {
            success: processRetrieve
        }
    };
    gw_com_module.objSave(args);

}
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
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined)
                                    param.data.arg.handler(param.data.arg.param);
                                else if (param.data.arg != undefined)
                                    processRemove(param.data.arg.param);
                                else
                                    processRemove({});
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
                switch (param.from.page) {
                    case "ECM_1021":
                        {
                            if (param.data != undefined) {
                                processEdit({ doc_id: param.data.doc_id, doc_no: param.data.doc_no });
                                gw_com_api.setValue("frmOption", 1, "doc_no", param.data.doc_no);
                                processRetrieve({});

                                //if (param.data.cert_yn == "1") {
                                //    v_global.event.data = param.data;
                                //    var args = {
                                //        type: "PAGE", page: "ECM_1022", title: "계약서 항목",
                                //        width: 600, height: 500, locate: ["center", "center"], open: true, scroll: true
                                //    };
                                //    if (gw_com_module.dialoguePrepare(args) == false) {
                                //        args = {
                                //            page: args.page,
                                //            param: {
                                //                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                //                data: v_global.event.data
                                //            }
                                //        };
                                //        gw_com_module.dialogueOpen(args);
                                //    }
                                //}
                            }
                        }
                        break;
                    case "ECM_1022":
                        {
                            if (param && param.data && param.data.send) {
                                gw_com_api.setValue("frmOption", 1, "doc_no", param.data.doc_no);
                                processRetrieve({});
                            }
                            //processEdit({ doc_id: param.data.doc_id, doc_no: param.data.doc_no });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_linkPage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
    }

}