//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약서 일괄 등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                {
                    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM81" }]
                },
                {
                    type: "PAGE", name: "SYS011", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "SYS010" }]
                },
                {
                    type: "PAGE", name: "SYS011", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "SYS011" }]
                },
                {
                    type: "INLINE", name: "업체구분",
                    data: [
                        { title: "협력사", value: "2" },
                        { title: "고객사", value: "1" }
                    ]
                },
                {
                    type: "INLINE", name: "기간",
                    data: [
                        { title: "년", value: "Y" },
                        { title: "월", value: "M" },
                        { title: "일", value: "D" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() { 

            gw_job_process.UI();
            gw_job_process.procedure();
            //changeStep({ step: 1 });

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();

            //
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu1", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "저장", value: "확인" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "doc_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "doc_nm", label: { title: "파일명 :" },
                                editable: { type: "text", size: 20 }
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
            targetid: "frmOption1", type: "FREE",
            show: false, border: true, align: "left",
            editable: { bind: "open", focus: "cert_yn", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 : " },
                                editable: { type: "select", data: { memory: "ISCM81", unshift: [{ title: "-", value: "" }] } }
                            },
                            {
                                name: "cert_yn", label: { title: "전자인증 : " }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0" }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmOption1_data").css("padding-left", "5px");
        //=====================================================================================
        var args = {
            targetid: "grdList_STDDOC", query: "ECM_1021_2_0", title: "계약분류",
            caption: false, height: 300, pager: false, show: true, number: true, selectable: true, //key: true,
            element: [
                { header: "분류명", name: "grp_nm", width: 150 },
                { header: "파일명", name: "doc_nm", width: 350 },
                {
                    header: "표준", name: "std_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }, hidden: true
                },
                { name: "std_id", hidden: true },
                { name: "grp_id", hidden: true },
                { name: "file_id", hidden: true },
                { name: "doc_lang", hidden: true },
                { name: "ext_yn", hidden: true },
                { name: "ext_cnt", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_STDDOC_D", query: "ECM_1021_2", title: "부속서류",
            caption: true, height: 64, pager: false, show: true, selectable: true, multi: true, checkrow: true,
            element: [
                { header: "파일명", name: "doc_nm" },
                { name: "std_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu2", type: "FREE",
            element: [
                { name: "저장", value: "확인" },
                { name: "취소", value: "취소", icon: "아니오" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_DOC", query: "ECM_1021_2_1", type: "TABLE", title: "계약 정보",
            caption: true, show: true,
            editable: { bind: "select", focus: "dept_area", validate: true },
            content: {
                width: { label: 100, field: 220 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "계약분류", format: { type: "label" } },
                            { name: "grp_nm", editable: { type: "hidden" }, display: true },
                            { header: true, value: "계약서명", format: { type: "label" } },
                            { name: "doc_nm", editable: { type: "hidden" }, display: true },
                            { header: true, value: "담당자", format: { type: "label" } },
                            {
                                name: "cr_emp_nm", display: true, //mask: "search",
                                editable: { type: "hidden" }
                            },
                            { name: "cr_emp", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계약일", format: { type: "label" } },
                            {
                                name: "cr_date", mask: "date-ymd",
                                editable: { type: "text", width: 100 }
                            },
                            { header: true, value: "계약기간", format: { type: "label" } },
                            {
                                name: "crs_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 60 },
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "계약시작일" } }
                            },
                            {
                                value: "~", style: { colfloat: "floating" },
                                format: { type: "label", width: 60 }
                            },
                            {
                                name: "cre_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 60 },
                                editable: { type: "text", width: 100, validate: { rule: "required", message: "계약종료일" } }
                            },
                            { header: true, value: "계약금액", format: { type: "label" } },
                            {
                                name: "amount", mask: "numeric-int",
                                editable: { type: "text", maxlength: 15 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "자동연장/기간", format: { type: "label" } },
                            {
                                name: "ext_yn", style: { colfloat: "float" },
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                value: "/", style: { colfloat: "floating" },
                                format: { type: "label", width: 40 }
                            },
                            {
                                name: "ext_cnt", style: { colfloat: "floating" }, mask: "numeric-int",
                                format: { type: "text", width: 14 },
                                editable: { type: "text", width: 30, maxlength: 3 }
                            },
                            {
                                name: "ext_term", style: { colfloat: "floated" },
                                format: { type: "select", data: { memory: "기간", unshift: [{ title: "-", value: "" }] }, width: 50 },
                                editable: { type: "select", data: { memory: "기간", unshift: [{ title: "-", value: "" }] }, width: 50 }
                            },
                            { header: true, value: "지급방법", format: { type: "label" } },
                            {
                                name: "payment", style: { colspan: 3 },
                                format: { width: 585 },
                                editable: { type: "text", width: 585, validate: { rule: "required" }, maxlength: 250 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "cr_title", style: { colspan: 5 },
                                format: { type: "text", width: 938 },
                                editable: { type: "text", width: 938 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "cr_rmk", style: { colspan: 5 },
                                format: { type: "textarea", rows: 2, width: 940 },
                                editable: { type: "textarea", rows: 2, width: 936 }
                            },
                            { name: "dept_area", editable: { type: "hidden" }, hidden: true },
                            { name: "remark1", editable: { type: "hidden" }, hidden: true },
                            { name: "remark2", editable: { type: "hidden" }, hidden: true },
                            { name: "remark3", editable: { type: "hidden" }, hidden: true },
                            { name: "remark4", editable: { type: "hidden" }, hidden: true },
                            { name: "remark5", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "astat", editable: { type: "hidden" }, hidden: true },
                            { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                            { name: "doc_no", editable: { type: "hidden" }, hidden: true },
                            { name: "std_yn", editable: { type: "hidden" }, hidden: true },
                            { name: "cert_yn", editable: { type: "hidden" }, hidden: true },
                            { name: "std_id", editable: { type: "hidden" }, hidden: true },
                            { name: "grp_id", editable: { type: "hidden" }, hidden: true },
                            { name: "sub_id", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmData_DOC_cert_yn_nm").css("color", "red");
        $("#frmData_DOC_cert_yn_nm").css("font-weight", "bold");
        $("#frmData_DOC_cert_yn_nm_view").css("color", "red");
        $("#frmData_DOC_cert_yn_nm_view").css("font-weight", "bold");
        //=====================================================================================
        var args = {
            targetid: "grdData_DOC_SUPP", query: "ECM_1021_2_2", title: "계약자",
            show: false,
            editable: { multi: true, validate: true },
            element: [
                { name: "supp_tp", editable: { type: "hidden" } },
                { name: "supp_cd", editable: { type: "hidden" } },
                { name: "supp_nm", editable: { type: "hidden" } },
                { name: "supp_prsdnt", editable: { type: "hidden" } },
                { name: "supp_man", editable: { type: "hidden" } },
                { name: "supp_telno", editable: { type: "hidden" } },
                { name: "supp_email", editable: { type: "hidden" } },
                { name: "supp_addr", editable: { type: "hidden" } },
                { name: "rgst_no", editable: { type: "hidden" } },
                { name: "supp_id", editable: { type: "hidden" } },
                { name: "doc_id", editable: { type: "hidden" } },
                { name: "doc_no", editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu3", type: "FREE",
            element: [
                { name: "저장", value: "확인" },
                { name: "취소", value: "취소", icon: "아니오" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_STDDOC", offset: 8 },
                { type: "GRID", id: "grdList_STDDOC_D", offset: 8 },
                { type: "FORM", id: "frmData_DOC", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption1", element: "cert_yn", event: "click", handler: processAlert };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu1", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu1", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu3", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu3", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu3", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_DOC", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdList_STDDOC", grid: true, event: "rowselecting", handler: processRowselecting };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "grdList_STDDOC", grid: true, event: "rowselected", handler: processRetrieve1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_STDDOC", grid: true, event: "rowdblclick", handler: processInformResult1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_STDDOC", grid: true, event: "rowkeyenter", handler: processInformResult1 };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
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
function processButton(param) {

    if (param.object == undefined) return false;
    switch (param.element) {
        case "저장":
            {
                switch (param.object) {
                    case "lyrMenu1":
                        {
                            processInformResult1(param);
                        }
                        break;
                    case "lyrMenu2":
                        {
                            processInformResult2(param);
                        }
                        break;
                    case "lyrMenu3":
                        {
                            var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
                            gw_com_module.uploadFile(args);
                        }
                        break;
                    default:
                        return;
                }
                
            }
            break;
        case "취소":
            {
                var step = param.object == "lyrMenu2" ? 1 : 2;
                changeStep({ step: step });
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
    }

}
//----------
function processAlert(param) {

    var cert_yn = gw_com_api.getValue("frmOption1", 1, "cert_yn");
    var msg = cert_yn == "1" ? "전자인증 계약서입니다." : "전자인증 미사용 계약서입니다.";
    gw_com_api.showMessage(msg);

}
//----------
function processRowselecting(param) {
    return false;
}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_DOC_EXT") {
        var row = Number(param.element.split("_")[0]);
        var value = param.value.current;
        var el = "#" + param.object + "_" + param.element;
        if ($(el).attr("mask") != undefined) {
            var param = {
                targetobj: el
            };
            value = gw_com_module.textunMask(param);
        }
        v_global.logic.ext_data[row]["ext_val"] = value;
        v_global.logic.ext_data[row]["modified"] = true;
    }

}
//----------
function processItemdblclick(param) {

    //v_global.event.type = param.type;
    //v_global.event.object = param.object;
    //v_global.event.row = param.row;
    //v_global.event.element = param.element;

    //var args;
    //switch (param.element) {
    //    case "cr_emp_nm":
    //        {
    //            if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
    //            args = {
    //                type: "PAGE", page: "w_find_emp", title: "사원 검색",
    //                width: 600, height: 450, locate: ["center", "top"], open: true,
    //                id: gw_com_api.v_Stream.msg_selectEmployee
    //            };
    //        }
    //        break;
    //    default:
    //        return;
    //}

    //if (gw_com_module.dialoguePrepare(args) == false) {
    //    args = { page: args.page, param: { ID: args.id, data: args.data } };
    //    gw_com_module.dialogueOpen(args);
    //}

}
//----------
function processEnter(param) {

    if (param.object == "frmData_DOC_EXT") {
        var seq = Number(param.element.split("_")[0]) + 1;
        var element = seq + "_" + param.element.split("_").slice(1).join("_");
        gw_com_api.setFocus(param.object, param.row, element);
    } else {
        var row = Number(param.row) + 1;
        if (row > gw_com_api.getRowCount(param.object)) return;
        gw_com_api.selectRow(param.object, row, true);
    }

}
//----------
function processRetrieve1(param) {

    var args;
    if (param.object == "grdList_STDDOC")
    {
        args = {
            source: {
                type: "GRID", id: "grdList_STDDOC", row: "selected",
                element: [
                    { name: "std_id", argument: "arg_std_id" },
                    { name: "file_id", argument: "arg_file_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_STDDOC_D" }
            ],
            key: param.key,
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    }
    else
    {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "doc_nm", argument: "arg_doc_nm" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_STDDOC", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_STDDOC_D" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

    // 전체선택
    if (param.object == "grdList_STDDOC") {
        $("#cb_grdList_STDDOC_D_data").attr("checked", true);
        $("#cb_grdList_STDDOC_D_data").trigger('click');
        $("#cb_grdList_STDDOC_D_data").attr("checked", true);
    }

}
//----------
function processInformResult1(param) {

    if (gw_com_api.getSelectedRow("grdList_STDDOC") < 1) return;
    if (gw_com_api.getValue("frmOption1", 1, "dept_area") == "") {
        gw_com_api.messageBox([{ text: "장비군를 선택하세요." }]);
        return;
    }
    processCreateDW({});
    changeStep({ step: 2 });

}
//----------
function processInformResult2(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_DOC" },
            { type: "FORM", id: "frmData_DOC_EXT" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    // 연장기간 체크
    if (gw_com_api.getUpdatable("frmData_DOC")) {
        if (gw_com_api.getValue("frmData_DOC", 1, "ext_yn") == "1") {
            var err = false;
            if (gw_com_api.getValue("frmData_DOC", 1, "ext_cnt") == "0" ||
                gw_com_api.getValue("frmData_DOC", 1, "ext_cnt") == "" ||
                gw_com_api.getValue("frmData_DOC", 1, "ext_cnt") == null) {
                gw_com_api.setError(true, "frmData_DOC", 1, "ext_cnt", false);
                err = true;
            }
            if (gw_com_api.getValue("frmData_DOC", 1, "ext_term") == "" ||
                gw_com_api.getValue("frmData_DOC", 1, "ext_term") == null) {
                gw_com_api.setError(true, "frmData_DOC", 1, "ext_term", false);
                err = true;
            }
            if (err) {
                gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
                return false;
            }
        } else {
            gw_com_api.setValue("frmData_DOC", 1, "ext_cnt", "0");
            gw_com_api.setValue("frmData_DOC", 1, "ext_term", "");
        }
    }
    gw_com_api.setError(false, "frmData_DOC", 1, "ext_cnt", false);
    gw_com_api.setError(false, "frmData_DOC", 1, "ext_term", false);

    changeStep({ step: 3 });

}
//----------
function successUpload(response) {
    // ECM_1021_2.aspx의 FileUploadComplete 에서 호출

    if (response == undefined || response.data == undefined || response.data == null || response.data.length == 0) {

        gw_com_api.showMessage("처리할 데이터가 없습니다.");

    } else {

        var args = {
            target: [
                { type: "GRID", id: "grdData_DOC_SUPP" }
            ]
        };
        gw_com_module.objClear(args);

        var args = {
            targetid: "grdData_DOC_SUPP", edit: true, updatable: true, data: response.data
        };
        gw_com_module.gridInserts(args);
        
        processSave({});

    }
    
}
//----------
function processSave(param) {

    var args = {
        //nomessage: true,
        target: [
            { type: "FORM", id: "frmData_DOC" },
            { type: "GRID", id: "grdData_DOC_SUPP" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var sub_id = "";
    var ids = gw_com_api.getSelectedRow("grdList_STDDOC_D", true);
    $.each(ids, function () {
        sub_id += (sub_id == "" ? "" : ",") + gw_com_api.getValue("grdList_STDDOC_D", this, "std_id", true);
    });
    gw_com_api.setValue("frmData_DOC", 1, "sub_id", sub_id);

    // 추가항목
    var query = $("#frmData_DOC_EXT").attr("query");
    var row = new Array();
    $.each(v_global.logic.ext_data, function (i, v) {
        if (v["modified"])
            row.push({
                crud: "C",
                column: [
                    { name: "ext_id", value: v["ext_id"] },
                    { name: "doc_no", value: v["doc_no"] },
                    { name: "ext_nm", value: v["ext_nm"] },
                    { name: "ext_val", value: v["ext_val"] },
                    { name: "mask", value: v["mask"] },
                    { name: "sys_yn", value: v["sys_yn"] }
                ]
            })
    });
    if (row.length > 0) {
        var data = {
            query: $("#frmData_DOC_EXT").attr("query"),
            row: row
        };
        args.param = [data];
    }

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {
    
    v_global.logic.response = {
        grp_id: gw_com_api.getValue("frmData_DOC", 1, "grp_id"),
        ymd_fr: gw_com_api.getValue("frmData_DOC", 1, "crs_date"),
        ymd_to: gw_com_api.getValue("frmData_DOC", 1, "crs_date"),
        cert_yn: gw_com_api.getValue("frmOption1", 1, "cert_yn")
    }

    //gw_com_api.messageBox("업체에 전송하시겠습니까?", 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { doc_id: response[0].KEY[0].VALUE });

    //if (confirm("업체에 전송하시겠습니까?")) {
    //    processBatch({ doc_id: response[0].KEY[0].VALUE });
    //} else {
    //    processClose({ data: v_global.logic.response });
    //}

    processClose({ data: v_global.logic.response });

}
//----------
function processBatch(param) {

    var proc = {
        url: "COM",
        procedure: "sp_updateECMDocStat",
        nomessage: true,
        input: [
            { name: "type", value: "SEND_SUPP2", type: "varchar" },
            { name: "doc_id", value: param.doc_id, type: "varchar" },
            { name: "sub_id", value: "%", type: "varchar" },
            { name: "pstat", value: "WAT_A", type: "varchar" }, //계약대기
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "err_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(proc);

}
//----------
function successBatch(response, param) {

    gw_com_api.showMessage(response.VALUE[0]);
    processClose({ data: v_global.logic.response });

}
//----------
function successCreate(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: {
            doc_id: v_global.logic.doc_id,
            doc_no: v_global.logic.doc_no,
            cert_yn: gw_com_api.getValue("frmOption1", 1, "cert_yn")
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function errCreate(param) {

    var qry = {
        query: "ECM_1020_1",
        row: [{
            crud: "D",
            column: [{ name: "doc_id", value: v_global.logic.doc_id }]
        }]
    };

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [qry],
        nomessage: true
    };
    gw_com_module.objSave(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_DOC" },
            { type: "FORM", id: "frmData_DOC_EXT" },
            { type: "GRID", id: "grdData_DOC_SUPP" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);
    processClear({});

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
function changeStep(param) {

    switch (param.step) {
        case 1:
            {
                gw_com_api.show("frmOption1");
                gw_com_api.show("lyrMenuStep1");
                gw_com_api.show("lyrContentStep1");
                gw_com_api.hide("lyrMenuStep2");
                gw_com_api.hide("lyrContentStep2");
                gw_com_api.hide("lyrMenuStep3");
                gw_com_api.hide("lyrContentStep3");
                if (v_global.data.cert_auth == "R") {
                    //gw_com_api.hide("frmOption1");
                    $("#frmOption1_cert_yn").attr("disabled", "disabled");
                } else {
                    //gw_com_api.show("frmOption1");
                    $("#frmOption1_cert_yn").removeAttr("disabled");
                }
            }
            break;
        case 2:
            {
                gw_com_api.hide("frmOption");
                gw_com_api.hide("frmOption1");
                gw_com_api.hide("lyrMenuStep1");
                gw_com_api.hide("lyrContentStep1");
                gw_com_api.show("lyrMenuStep2");
                gw_com_api.show("lyrContentStep2");
                gw_com_api.hide("lyrMenuStep3");
                gw_com_api.hide("lyrContentStep3");
            }
            break;
        case 3:
            {
                gw_com_api.hide("frmOption");
                gw_com_api.hide("frmOption1");
                gw_com_api.hide("lyrMenuStep1");
                gw_com_api.hide("lyrContentStep1");
                gw_com_api.hide("lyrMenuStep2");
                gw_com_api.hide("lyrContentStep2");
                gw_com_api.show("lyrMenuStep3");
                gw_com_api.show("lyrContentStep3");
            }
            break;
    }

}
//----------
function processCreateDW(param) {

    // 계약서 마스터
    var args = {
        targetid: "frmData_DOC", edit: true, updatable: true,
        data: [
            { name: "dept_area", value: gw_com_api.getValue("frmOption1", 1, "dept_area") },
            { name: "cert_yn", value: gw_com_api.getValue("frmOption1", 1, "cert_yn") },
            { name: "std_id", value: gw_com_api.getValue("grdList_STDDOC", "selected", "std_id", true) },
            { name: "grp_id", value: gw_com_api.getValue("grdList_STDDOC", "selected", "grp_id", true) },
            { name: "grp_nm", value: gw_com_api.getValue("grdList_STDDOC", "selected", "grp_nm", true) },
            { name: "doc_nm", value: gw_com_api.getValue("grdList_STDDOC", "selected", "doc_nm", true) },
            { name: "cr_date", value: gw_com_api.getDate() },
            { name: "cr_emp", value: gw_com_module.v_Session.EMP_NO },
            { name: "cr_emp_nm", value: gw_com_module.v_Session.USR_NM },
            { name: "ins_usr_nm", value: gw_com_module.v_Session.USR_NM },
            { name: "ext_yn", value: gw_com_api.getValue("grdList_STDDOC", "selected", "ext_yn", true) },
            { name: "ext_cnt", value: gw_com_api.getValue("grdList_STDDOC", "selected", "ext_cnt", true) },
            { name: "nation", value: "KR" },
            { name: "currency", value: "KRW" }
        ]
    };
    //----------
    gw_com_module.formInsert(args);
    //=====================================================================================
    // 계약서 입력 항목(MERGE FIELD)
    // 1. DATA
    v_global.logic.ext_data = getData({std_id: gw_com_api.getValue("grdList_STDDOC", "selected", "std_id", true)});

    // 2. FORM
    var row = [
        {
            element: [
                { header: true, value: "항목명", format: { type: "label" } },
                { header: true, value: "값", format: { type: "label" } },
                { header: true, value: "항목명", format: { type: "label" } },
                { header: true, value: "값", format: { type: "label" } }
            ]
        }
    ];
    //=====================================================================================
    var data = new Array();
    var event = new Array();
    if (v_global.logic.ext_data.length > 0) {
        var element = new Array();
        $.each(v_global.logic.ext_data, function (i, v) {
            var name1 = i + "_ext_nm";
            var name2 = i + "_ext_val";
            var value1 = v["ext_nm"];
            var value2 = v["ext_val"];
            var mask = v["mask"];
            var editable = { type: "hidden" };
            if (v["sys_yn"] == "0") {
                event.push({ element: name2, mask: mask });
                switch (mask) {
                    case "checkbox":
                        {
                            editable = { type: "checkbox", value: "1", offval: "0", title: "" };
                            mask = "";
                        }
                        break;
                    case "multiline":
                        {
                            editable = { type: "textarea", rows: 1, maxlength: 2000 };
                            mask = "";
                        }
                        break;
                    default:
                        {
                            editable.type = "text";
                        }
                }
                editable.validate = { rule: "required" };      // 모두 필수입력, 170523 by KWY, 구매팀 요청
            }

            if (mask == "checkbox") {
                editable = { type: "checkbox", value: "1", offval: "0", title: "" };
                mask = "";
            }
            if (editable.type == "hidden" && mask == "date-ymd")
                editable.width = 500;  //datepicker 감추기
            var col1 = { name: name1, editable: { type: "hidden" } };
            var col2 = { name: name2, editable: editable, mask: mask == "" ? undefined : mask };

            element.push(col1, col2);

            if (i % 2 != 0) {
                row.push({ element: element });
                element = new Array();
            }

            data.push({ name: name1, value: value1 });
            data.push({ name: name2, value: value2 });

        });
        if (element.length == 2) {
            element.push({ name: "" }, { name: "" });
            row.push({ element: element });
        }
    }
    //=====================================================================================
    var args = {
        targetid: "frmData_DOC_EXT", query: "ECM_1021_2_3", type: "TABLE", title: "계약서 입력 항목",
        caption: true, show: row.length > 1 ? true : false,
        editable: { bind: "select", focus: "0_ext_val", validate: true },
        content: {
            width: { label: 100, field: 250 }, height: 25,
            row: row
        }
    };
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_DOC_EXT", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = {
        targetid: "frmData_DOC_EXT", edit: true, updatable: true,
        data: data
    };
    //----------
    gw_com_module.formInsert(args);
    //=====================================================================================
    var args = { targetid: "frmData_DOC_EXT", event: "itemkeyenter", handler: processEnter };
    gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmData_DOC_EXT", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //----------
    $.each(event, function () {
        if (this.mask == "multiline") {
            var args = { targetid: "frmData_DOC_EXT", element: this.element, event: "focus", handler: processMemo };
            gw_com_module.eventBind(args);
        }
    });
    //=====================================================================================

}
//----------
function getData(param) {

    var cols = ["ext_id", "ext_nm", "ext_val", "mask", "sys_yn", "doc_no"];
    var rows = new Array();
    var args = {
        request: "DATA",
        name: "ECM_1021_2_3_I",
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=ECM_1021_2_3_I" +
            "&QRY_COLS=" + cols.join(",") +
            "&CRUD=R" +
            "&arg_std_id=" + param.std_id,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        $.each(data, function () {
            var row = new Object();
            for (var i = 0; i < cols.length; i++) {
                row[cols[i]] = this.DATA[i];
            }
            row["modifed"] = row["ext_id"] == null || row["ext_id"] == "" ? true : false;
            rows.push(row);
        });

    }
    return rows;

}
//----------
function getUpdatable(param) {

    var rtn = false;
    try {
        $.each(v_global.logic.data, function (i, v) {
            if (v["modified"]) {
                rtn = true;
                return false;
            }
        });
    } catch (exception) {
        rtn = false;
    } finally {
        return rtn;
    }

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.event.data = {
        edit: true, rows: 25,
        title: gw_com_api.getValue(param.object, param.row, param.element.replace("ext_val", "ext_nm")),
        text: gw_com_api.getValue(param.object, param.row, param.element)
    }
    var args = {
        type: "PAGE", page: "w_edit_memo", title: "멀티라인",
        width: 500, height: 400, open: true, locate: ["center", "center"]
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_edit_memo",
            param: {
                ID: gw_com_api.v_Stream.msg_edit_Memo,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "ECM_1024":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.data;
                        }
                        break;
                    case "w_edit_memo":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_Memo;
                            args.data = v_global.event.data;
                        }
                        break;
                    default:
                        {
                            v_global.data = param.data;
                            v_global.logic.response = undefined;
                            gw_com_api.setValue("frmOption1", "cert_yn", param.data.cert_yn);
                            changeStep({ step: 1 });
                            if (!v_global.logic.retrieve) processRetrieve1({});
                            v_global.logic.retrieve = true;
                            return;
                        }
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "ECM_1024":
                        {
                            if (param.data != undefined) {
                                processBatch(param.data);
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                if (param.data.update)
                    gw_com_api.setValue(v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        param.data.text);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) break;
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch(param.data.arg);
                            else
                                processClose({ data: v_global.logic.response });
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

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//