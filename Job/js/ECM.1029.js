//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약등록
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

        // prepare dialogue.
        var args = {
            type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 134, locate: ["center", "center"]
        };
        gw_com_module.dialoguePrepare(args);

        //----------
        start();
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            if (v_global.process.param != "") {
                v_global.logic.doc_id = gw_com_api.getPageParameter("doc_id");
                v_global.logic.doc_no = gw_com_api.getPageParameter("doc_no");
                processRetrieve({});
            }
            else {
                gw_com_api.showMessage("오류!");
                processClose({});
            }
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
                //{ name: "저장", value: "저장" },
                { name: "상신", value: "상신", icon: "기타", updatable: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "ECM_1020_1", type: "TABLE", title: "",
            caption: false, show: true,
            editable: { bind: "select", focus: "dept_area", validate: true },
            content: {
                width: { label: 100, field: 280 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "문서번호", format: { type: "label" } },
                            { name: "doc_no", editable: { type: "hidden" } },
                            { header: true, value: "계약분류", format: { type: "label" } },
                            { name: "grp_nm", format: { type: "text" } },
                            { header: true, value: "계약서명", format: { type: "label" } },
                            { name: "doc_nm", format: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "cr_emp_nm" },
                            { name: "cr_emp", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "국가", format: { type: "label" } },
                            { name: "nation_nm" },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "ins_usr_nm" }
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
                                name: "ext_cnt", style: { colfloat: "floated" }, mask: "numeric-int",
                                format: { type: "text", width: 14 }
                            },
                            { name: "ext_term_nm", style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "", format: { type: "label" } },
                            { name: "" },
                            { header: true, value: "하자보수", format: { type: "label" } },
                            {
                                name: "rps_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 60 }
                            },
                            {
                                value: "~", style: { colfloat: "floating" },
                                format: { type: "label", width: 60 }
                            },
                            {
                                name: "rpe_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 60 }
                            },
                            { header: true, value: "작성", format: { type: "label" } },
                            { name: "ins_usr_nm", format: { type: "text", width: 70 }, style: { colfloat: "float" } },
                            { name: "ins_dt", format: { type: "text" }, style: { colfloat: "floated" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "cr_title", style: { colspan: 3 },
                                format: { type: "text", width: 658 }
                            },
                            { header: true, value: "계약상태", format: { type: "label" } },
                            { name: "pstat_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계약대상", format: { type: "label" } },
                            {
                                name: "cr_prod", style: { colspan: 3 },
                                format: { type: "text", width: 658 }
                            },
                            { header: true, value: "처리상태", format: { type: "label" } },
                            { name: "astat_nm" },
                            { name: "currency", editable: { type: "hidden" }, hidden: true },
                            { name: "amount", editable: { type: "hidden" }, hidden: true },
                            { name: "payment", editable: { type: "hidden" }, hidden: true },
                            { name: "chkl_date", editable: { type: "hidden" }, hidden: true },
                            { name: "remark1", editable: { type: "hidden" }, hidden: true },
                            { name: "remark2", editable: { type: "hidden" }, hidden: true },
                            { name: "remark3", editable: { type: "hidden" }, hidden: true },
                            { name: "remark4", editable: { type: "hidden" }, hidden: true },
                            { name: "remark5", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "astat", editable: { type: "hidden" }, hidden: true },
                            { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                            { name: "std_yn", editable: { type: "hidden" }, hidden: true },
                            { name: "cert_yn", editable: { type: "hidden" }, hidden: true }
                        ]
                    }//,
                    //{
                    //    element: [
                    //        { header: true, value: "비고", format: { type: "label" } },
                    //        {
                    //            name: "cr_rmk", style: { colspan: 5 },
                    //            format: { type: "textarea", rows: 2, width: 1052 }
                    //        }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "ECM_1020_2", title: "계약자",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            element: [
                { header: "구분", name: "supp_tp_nm", width: 100, align: "center" },
                { header: "상태", name: "pstat_nm", width: 80, align: "center" },
                { header: "거래처", name: "supp_nm", width: 200 },
                { header: "대표자", name: "supp_prsdnt", width: 120 },
                { header: "담당자", name: "supp_man", width: 120 },
                { header: "연락처", name: "supp_telno", width: 150 },
                { header: "E-Mail", name: "supp_email", width: 200 },
                { header: "지분율", name: "cr_rate", width: 100, align: "right", mask: "numeric-float", hidden: true },
                { header: "주소", name: "supp_addr", width: 400 },
                { name: "doc_id", hidden: true },
                { name: "supp_cd", hidden: true },
                { name: "cert_data", hidden: true },
                { name: "supp_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN2", query: "ECM_1020_1", type: "TABLE", title: "체결내용",
            caption: true, show: true,
            editable: { bind: "select", focus: "remark1", validate: true },
            content: {
                width: { label: 100, field: 280 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "화폐단위", format: { type: "label" } },
                            { name: "currency_nm", editable: { type: "hidden" }, readonly: true },
                            { header: true, value: "계약금액", format: { type: "label" } },
                            {
                                name: "amount", mask: "numeric-int",
                                editable: { type: "hidden" }, readonly: true
                            },
                            { header: true, value: "지급방법", format: { type: "label" } },
                            { name: "payment", editable: { type: "hidden" }, readonly: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "관련장비/기술", format: { type: "label" } },
                            {
                                name: "remark1", style: { colspan: 5 },
                                format: { type: "textarea", rows: 3, width: 1052 },
                                editable: { type: "textarea", rows: 3, width: 1044, maxlength: 200 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계약서 핵심사항", format: { type: "label" } },
                            {
                                name: "remark5", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8, width: 1052 },
                                editable: { type: "textarea", rows: 8, width: 1044, maxlength: 200 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "특이사항", format: { type: "label" } },
                            {
                                name: "remark4", style: { colspan: 5 },
                                format: { type: "textarea", rows: 3, width: 1052 },
                                editable: { type: "textarea", rows: 3, width: 1044 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_DOC", query: "ECM_1020_3", title: "계약문서",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            element: [
                { header: "문서구분", name: "doc_tp_nm", width: 100, align: "center" },
                { header: "파일명", name: "doc_nm", width: 540 },
                {
                    header: "필수", name: "require_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "편집", name: "edit_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "Rev.No.", name: "rev_no", width: 70 },
                {
                    header: "파일", name: "file_download", width: 50, align: "center",
                    format: { type: "link" }
                },
                { name: "std_id", hidden: true },
                { name: "id", hidden: true },
                { name: "file_id", hidden: true },
                { name: "file_nm", hidden: true },
                { name: "file_path", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 },
                { type: "FORM", id: "frmData_MAIN2", offset: 8 },
                { type: "GRID", id: "grdData_DOC", offset: 8 }
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

        ////=====================================================================================
        //var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상신", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_DOC", grid: true, element: "file_download", event: "click", handler: processFile };
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
function processButton(param) {

    switch (param.element) {
        case "상신":
            {
                if (!checkManipulate({})) return;
                processApprove(param);
                //var args = {
                //    page: "IFProcess",
                //    param: {
                //        ID: gw_com_api.v_Stream.msg_authSystem,
                //        data: {
                //            system: "GROUPWARE",
                //            name: gw_com_module.v_Session.GW_ID,
                //            encrypt: { password: true },
                //            param: param
                //        }
                //    }
                //};
                //gw_com_module.dialogueOpen(args);
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN2") {
        var val = "";
        switch (param.element) {
            case "amount":
                val = gw_com_api.unMask(param.value.current, "numeric-int");
                break;
            case "chkl_date":
                val = gw_com_api.unMask(param.value.current, "date-ymd");
                break;
            default:
                val = param.value.current;
        }

        gw_com_api.setValue("frmData_MAIN", 1, param.element, val, false, true, true);
        gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "FILE" || param.object == "SUB") {
        var obj = param.object == "FILE" ? "grdData_DOC" : "grdData_SUB";
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
                { type: "FORM", id: "frmData_MAIN2", edit: true },
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_DOC" }
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
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processApprove(param) {

    if (gw_com_site.v_gw_auth) {

        var args = {
            page: "IFProcess",
            param: {
                ID: gw_com_api.v_Stream.msg_authSystem,
                data: {
                    system: "GROUPWARE",
                    name: gw_com_module.v_Session.GW_ID,
                    encrypt: { password: true },
                    param: param
                }
            }
        };
        gw_com_module.dialogueOpen(args);

    } else {

        var args = {
            doc_id: v_global.logic.doc_id,
            frm_id: "ECM01",
            remark1: gw_com_api.getValue("frmData_MAIN2", 1, "remark1"),
            remark4: gw_com_api.getValue("frmData_MAIN2", 1, "remark4"),
            remark5: gw_com_api.getValue("frmData_MAIN2", 1, "remark5")
        };
        gw_com_site.gw_appr_ecm(args);
        gotoList({});

    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN", 1);

}
//----------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check == undefined ? false : param.check,
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ]
    };
    return gw_com_module.objUpdatable(args);

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
function gotoList(param) {

    var title = "계약 진행";
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "ECM_1030",
            title: title,
            param: [
                { name: "doc_id", value: v_global.logic.doc_id },
                { name: "doc_no", value: v_global.logic.doc_no },
                { name: "cr_date", value: gw_com_api.getValue("frmData_MAIN", 1, "cr_date") }
            ]
        }
    };
    gw_com_module.streamInterface(args);

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
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                closeDialogue({ page: param.from.page });

                var args = {
                    doc_id: v_global.logic.doc_id,
                    frm_id: "ECM01",
                    remark1: gw_com_api.getValue("frmData_MAIN2", 1, "remark1"),
                    remark4: gw_com_api.getValue("frmData_MAIN2", 1, "remark4"),
                    remark5: gw_com_api.getValue("frmData_MAIN2", 1, "remark5"),
                    gw_user: param.data.name,
                    gw_pass: param.data.password
                };
                gw_com_site.gw_appr_ecm(args);
                gotoList({});

            }
            break;
    }

}