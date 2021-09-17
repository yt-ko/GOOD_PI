//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약내용조회(관리자용)
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            request: [
                {
                    type: "INLINE", name: "체결방식",
                    data: [
                        { title: "전자", value: "1" },
                        { title: "서면", value: "0" }
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
            //----------
            v_global.logic.doc_id = gw_com_api.getPageParameter("doc_id");
            v_global.logic.doc_id = gw_com_module.Decrypt(v_global.logic.doc_id);
            if (!(!isNaN(parseFloat(v_global.logic.doc_id)) && isFinite(v_global.logic.doc_id))) {
                gw_com_api.showMessage("Invalid Parameter!");
                proceessClose({});
            }
            processRetrieve({});
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
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "DLG_ECM_1", type: "TABLE", title: "",
            caption: false, show: true,
            content: {
                width: { label: 100, field: 280 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "문서번호", format: { type: "label" } },
                            {
                                name: "doc_no", style: { colfloat: "float" },
                                format: { type: "text", width: 220 }
                            },
                            {
                                name: "cert_yn_nm", style: { colfloat: "floated" },
                                format: { type: "text" }
                            },
                            { header: true, value: "계약분류", format: { type: "label" } },
                            { name: "grp_nm" },
                            { header: true, value: "계약서명", format: { type: "label" } },
                            { name: "doc_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "cr_emp_nm" },
                            { name: "cr_emp", hidden: true },
                            { header: true, value: "국가", format: { type: "label" } },
                            { name: "nation_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계약일", format: { type: "label" } },
                            { name: "cr_date", mask: "date-ymd" },
                            { header: true, value: "계약기간", format: { type: "label" } },
                            {
                                name: "crs_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 60 }
                            },
                            {
                                value: "~", style: { colfloat: "floating" },
                                format: { type: "label", width: 60 }
                            },
                            {
                                name: "cre_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 60 }
                            },
                            { header: true, value: "자동연장/기간", format: { type: "label" } },
                            {
                                name: "ext_yn", style: { colfloat: "float" },
                                format: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                value: "/", style: { colfloat: "floating" },
                                format: { type: "label", width: 40 }
                            },
                            {
                                name: "ext_cnt", style: { colfloat: "floating" }, mask: "numeric-int",
                                format: { type: "text", width: 14 }
                            },
                            { name: "ext_term_nm", style: { colfloat: "floated" }, format: { width: 50 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "", format: { type: "label" } },
                            { name: "" },
                            { header: true, value: "하자보수", format: { type: "label" } },
                            {
                                name: "rps_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 60 },
                                editable: { type: "text", width: 90 }
                            },
                            {
                                value: "~", style: { colfloat: "floating" },
                                format: { type: "label", width: 60 }
                            },
                            {
                                name: "rpe_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 60 },
                                editable: { type: "text", width: 90 }
                            },
                            { header: true, value: "작성", format: { type: "label" } },
                            { name: "ins_usr_nm", format: { type: "text", width: 70 }, style: { colfloat: "float" } },
                            { name: "ins_dt", format: { type: "text" }, style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            { name: "cr_title", style: { colspan: 3 }, format: { type: "text", width: 658 } },
                            { header: true, value: "계약상태", format: { type: "label" } },
                            { name: "pstat_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계약대상", format: { type: "label" } },
                            { name: "cr_prod", style: { colspan: 3 }, format: { type: "text", width: 658 } },
                            { header: true, value: "처리상태", format: { type: "label" } },
                            { name: "astat_nm" },
                            { name: "remark1", hidden: true },
                            { name: "remark2", hidden: true },
                            { name: "remark3", hidden: true },
                            { name: "remark4", hidden: true },
                            { name: "remark5", hidden: true },
                            { name: "doc_id", hidden: true },
                            { name: "std_yn", hidden: true },
                            { name: "cert_yn", hidden: true },
                            { name: "ld_rate", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmData_MAIN_cert_yn_nm").css("color", "red");
        $("#frmData_MAIN_cert_yn_nm").css("font-weight", "bold");
        $("#frmData_MAIN_cert_yn_nm_view").css("color", "red");
        $("#frmData_MAIN_cert_yn_nm_view").css("font-weight", "bold");
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "DLG_ECM_2", title: "계약자",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            element: [
                { header: "구분", name: "supp_tp_nm", width: 100, align: "center" },
                { header: "상태", name: "pstat_nm", width: 80, align: "center", hidden: true },
                { header: "거래처", name: "supp_nm", width: 200 },
                { header: "대표자", name: "supp_prsdnt", width: 120 },
                { header: "담당자", name: "supp_man", width: 120 },
                { header: "연락처", name: "supp_telno", width: 150 },
                { header: "E-Mail", name: "supp_email", width: 200 },
                { header: "지분율", name: "cr_rate", width: 100, align: "right", mask: "numeric-float", hidden: true },
                { header: "주소", name: "supp_addr", width: 400 },
                { name: "doc_id", hidden: true },
                { name: "supp_cd", hidden: true },
                { name: "supp_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN2", query: "DLG_ECM_1", type: "TABLE", title: "계약 내용",
            caption: true, show: true,
            content: {
                width: { label: 110, field: 270 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "화폐단위", format: { type: "label" } },
                            { name: "currency" },
                            { header: true, value: "계약금액(VAT별도)", format: { type: "label" } },
                            { name: "amount", mask: "numeric-int" },
                            { header: true, value: "지급방법", format: { type: "label" } },
                            { name: "payment" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "관련장비/기술", format: { type: "label" } },
                            {
                                name: "remark1", style: { colspan: 5 },
                                format: { type: "textarea", rows: 3 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계약 목적", format: { type: "label" } },
                            {
                                name: "remark3", style: { colspan: 5 },
                                format: { type: "textarea", rows: 3 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "특이사항", format: { type: "label" } },
                            {
                                name: "remark4", style: { colspan: 5 },
                                format: { type: "textarea", rows: 20 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //----------
        //$("label:contains('계약금액(VAT포함)')").css("font-size", "8pt");
        //=====================================================================================
        var args = {
            targetid: "grdList_DOC", query: "DLG_ECM_3", title: "계약문서",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            element: [
                { header: "문서구분", name: "doc_tp_nm", width: 100, align: "center" },
                { header: "파일명", name: "doc_nm", width: 540 },
                {
                    header: "필수", name: "require_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "Rev.No.", name: "rev_no", width: 70 },
                { header: "파일", name: "file_download", width: 50, align: "center", format: { type: "link" } },
                { name: "std_id", hidden: true },
                { name: "docf_id", hidden: true },
                { name: "file_id", hidden: true },
                { name: "file_nm", hidden: true },
                { name: "file_path", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_SUB", offset: 8 },
                { type: "FORM", id: "frmData_MAIN2", offset: 8 },
                { type: "GRID", id: "grdList_DOC", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_DOC", grid: true, element: "file_download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_DOC", grid: true, element: "file_upload", event: "click", handler: processFile };
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
function processClose(param) {

    if (parent == undefined || parent == null || parent.streamProcess == undefined || window == parent)
        window.close();
    else {
        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);
    }

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
function processButton(param) {

    switch (param.element) {
        case "닫기":
            {
                processClose({});
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "REF" || param.object == "FILE" || param.object == "SUB") {
        var obj = "grdList_" + param.object;
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_doc_id", value: v_global.logic.doc_id }
                ]
            },
            target: [
                { type: "GRID", id: obj, select: true }
            ],
            key: param.key
        };
    }
    else {
        args = {
            key: param.key,
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_doc_id", value: v_global.logic.doc_id }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MAIN2" },
                { type: "GRID", id: "grdList_SUB" },
                { type: "GRID", id: "grdList_DOC" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processLink(param) {

    var doc_id = gw_com_api.getValue(param.object, param.row, "ref_id", true);
    if (doc_id != "") {
        var args = {
            to: "INFO_ECM",
            doc_id: doc_id
        }
        gw_com_site.linkPage(args);
    }

}
//----------
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
        case gw_com_api.v_Stream.msg_linkPage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
                                        param.data.emp_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element.substr(0, v_global.event.element.length - 3),
                                        param.data.emp_no,
                                        (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}