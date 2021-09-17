//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
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

        //----------
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
                { type: "PAGE", name: "DOC_GRP", query: "DDDW_ECM_DOC_GRP_LANG" },
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -24 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            //----------
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
            //----------
            processRetrieve({});
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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "실행", value: "확인" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
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
                                editable: { type: "select", data: { memory: "ISCM81", unshift: [{ title: "전체", value: "%" }] } }
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
        gw_com_api.setValue("frmOption", 1, "doc_lang", gw_com_api.getValue("frmOption", 1, "doc_lang"));
        $("#frmOption_cr_title").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark1").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark2").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark3").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark4").parents(".jqTransformInputWrapper").hide();
        $("#frmOption_remark5").parents(".jqTransformInputWrapper").hide();
        //=====================================================================================
        var args = {
            targetid: "grdList_DOC", query: "ECM_1032_1", title: "계약현황",
            height: 440, show: true, caption: false, pager: true, selectable: true, checkrow: true, multi: true,
            element: [
                {
                    header: "체결방식", name: "cert_yn", width: 50, align: "center",
                    format: { type: "select", data: { memory: "체결방식" } }
                },
                { header: "계약분류", name: "grp_nm", width: 100 },
                { header: "제목", name: "cr_title", width: 180 },
                { header: "계약대상", name: "cr_prod", width: 100 },
                { header: "계약처", name: "supp_nm", width: 120 },
                { header: "계약상태", name: "pstat_nm", width: 50, align: "center", hidden: true },
                { header: "진행상태", name: "astat_nm", width: 50, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 60, align: "center" },
                { header: "담당자", name: "cr_emp_nm", width: 60, align: "center" },
                { header: "계약기간", name: "cr_term", width: 140, align: "center" },
                { header: "계약일", name: "cr_date", width: 70, mask: "date-ymd", align: "center" },
                { header: "자동연장", name: "ext_term_nm", width: 60, align: "center" },
                { header: "문서번호", name: "doc_no", width: 80, align: "center" },
                { header: "비고", name: "cr_rmk", width: 200 },
                { name: "doc_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_DOC", offset: 8 }
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "실행", event: "click", handler: informResult };
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

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "cr_emp", argument: "arg_cr_emp" },
                { name: "supp_nm", argument: "arg_supp_nm" },
                { name: "supp_tp", argument: "arg_supp_tp" },
                { name: "doc_no", argument: "arg_doc_no" },
                { name: "cr_title", argument: "arg_cr_title" },
                { name: "remark1", argument: "arg_remark1" },
                { name: "remark2", argument: "arg_remark2" },
                { name: "remark3", argument: "arg_remark3" },
                { name: "remark4", argument: "arg_remark4" },
                { name: "remark5", argument: "arg_remark5" }
            ],
            argument: [
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID },
                { name: "arg_doc_id", value: 0 }
            ],
            remark: [
                { infix: "-", element: [{ name: "doc_lang" }, { name: "grp_id" }], label: "계약분류 :" },
                { element: [{ name: "cert_yn" }] },
                { element: [{ name: "dept_area" }] },
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "doc_no" }] },
                { element: [{ name: "cr_emp" }] },
                { element: [{ name: "supp_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_DOC" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdList_DOC", true);
    if (ids.length > 0) {
        var ref_id = "";
        $.each(ids, function (i, v) {
            ref_id += (ref_id == "" ? "" : ",") + gw_com_api.getValue("grdList_DOC", v, "doc_id", true);
        });

        var args = {
            url: "COM",
            nomessage: true,
            procedure: "sp_createECMDocRef",
            input: [
                { name: "doc_id", value: v_global.logic.doc_id, type: "int" },
                { name: "ref_id", value: ref_id, type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            output: [
                { name: "err_msg", type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: {
                    doc_id: v_global.logic.doc_id,
                    ref_id: ref_id
                }
            }
        };
        gw_com_module.callProcedure(args);

    }

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] == "") {
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: param
        };
        gw_com_module.streamInterface(args);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[0] }]);
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.logic = param.data;
            }
            break;
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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//