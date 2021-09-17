//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 실적등록
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

        //var args = {
        //    request: [
        //        {
        //            type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
        //            param: [{ argument: "arg_hcode", value: "ISCM81" }]
        //        },
        //        {
        //            type: "INLINE", name: "업체구분",
        //            data: [
        //                { title: "협력사", value: "2" },
        //                { title: "고객사", value: "1" }
        //            ]
        //        }
        //    ],
        //    starter: start
        //};
        //gw_com_module.selectSet(args);
        start();
        //----------

        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_api.setValue("frmOption1", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
            gw_com_api.setValue("frmOption1", 1, "ymd_to", gw_com_api.getDate());
            gw_com_api.setValue("frmOption2", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
            gw_com_api.setValue("frmOption2", 1, "ymd_to", gw_com_api.getDate());

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();
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
            targetid: "lyrMenu2", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "저장", value: "확인" },
                { name: "취소", value: "취소", icon: "아니오" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption1", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "입찰/견적의뢰일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "supp_nm", label: { title: "선정업체 :" },
                                editable: { type: "text", size: 15 }
                            },
                            { name: "supp_cd", hidden: true }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "per_title", label: { title: "제목 :" },
                                editable: { type: "text", size: 30, maxlength: 200 },
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
            targetid: "frmOption2", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "계약일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "supp_nm", label: { title: "계약처 :" },
                                editable: { type: "text", size: 15 }, hidden: true
                            },
                            { name: "supp_cd", hidden: true }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cr_title", label: { title: "공사명 :" },
                                editable: { type: "text", size: 30, maxlength: 200 },
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "doc_no", label: { title: "문서번호 :" },
                                editable: { type: "text", size: 15, maxlength: 20 }
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
            targetid: "frmOption3", type: "FREE",
            show: true, border: true, align: "left",
            editable: { bind: "open", focus: "cert_yn", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cert_yn", label: { title: "계약없음 : " },
                                editable: { type: "checkbox", value: "1", offval: "0" }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmOption3_data").css("padding-left", "2px");
        //=====================================================================================
        var args = {
            targetid: "frmOption4", type: "FREE", title: "공종",
            trans: true, border: true, show: false, remark: "lyrRemark",
            editable: { focus: "ext1_val", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ext1_val", label: { title: "공종 :" },
                                editable: { type: "text", size: 12, maxlength: 30 }
                            },
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "확인", act: true, format: { type: "button" } },
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
            targetid: "grdList_PER", query: "ECM_3011_2", title: "입찰/견적현황",
            caption: true, height: 310, pager: false, show: true, selectable: true, number: true, key: true,
            element: [
                { header: "입찰/견적 제목", name: "per_title", width: 350 },
                { header: "선정업체", name: "supp_nm", width: 180 },
                { header: "발주일자", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "발주번호", name: "pur_no", width: 80, align: "center" },
                { header: "의뢰번호", name: "per_no", width: 80, align: "center" },
                { name: "supp_seq", hidden: true },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_ECM", query: "ECM_3011_1", title: "계약현황",
            caption: true, height: 250, pager: false, show: true, selectable: true, number: true, key: true,
            element: [
                { header: "제목", name: "cr_title", width: 350 },
                { header: "계약처", name: "supp_nm", width: 180 },
                { header: "계약기간", name: "cr_term", width: 130 },
                { header: "계약일", name: "cr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "문서번호", name: "doc_no", width: 80, align: "center" },
                { name: "doc_id", hidden: true },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_FILE", query: "", type: "TABLE", title: "",
            caption: false, show: true,
            editable: { bind: "select", focus: "file1_chk", validate: true },
            content: {
                width: { label: 100, field: 100 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "계약이행보증보험증권", format: { type: "label" } },
                            { header: true, value: "선급금이행보증보험증권", format: { type: "label" } },
                            { header: true, value: "하자이행보증보험증권", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "file1_chk",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "file2_chk",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "file3_chk",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "file4_chk", hidden: true,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "file5_chk", hidden: true,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $(".frmData_FILE_edit").css("text-align", "center");    // 체크박스 모두 가운데 정렬
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_ECM", offset: 8 },
                { type: "GRID", id: "grdList_PER", offset: 8 },
                { type: "FORM", id: "frmData_FILE", offset: 8 }
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
        var args = { targetid: "lyrMenu1", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu1", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu2", element: "조회", event: "click", handler: viewOption2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption1", element: "실행", event: "click", handler: processRetrieve1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption1", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", element: "실행", event: "click", handler: processRetrieve2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption3", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption4", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption4", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_PER", grid: true, event: "rowdblclick", handler: processInformResult1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_PER", grid: true, event: "rowkeyenter", handler: processInformResult1 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_ECM", grid: true, event: "rowdblclick", handler: processInformResult2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_ECM", grid: true, event: "rowkeyenter", handler: processInformResult2 };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function viewOption(param) {

    var args = { target: [{ id: "frmOption1", focus: true }] };
    gw_com_module.objToggle(args);
    gw_com_api.hide("frmOption2");
    gw_com_api.hide("frmOption4");

}
//----------
function viewOption2(param) {

    var args = { target: [{ id: "frmOption2", focus: true }] };
    gw_com_module.objToggle(args);
    gw_com_api.hide("frmOption1");
    gw_com_api.hide("frmOption4");

}
//----------
function viewOption4(param) {

    var args = { target: [{ id: "frmOption4", focus: true }] };
    gw_com_module.objToggle(args);
    gw_com_api.hide("frmOption1");
    gw_com_api.hide("frmOption2");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption1");
    gw_com_api.hide("frmOption2");
    gw_com_api.hide("frmOption4");

}
//----------
function processButton(param) {

    if (param.object == undefined) return false;
    switch (param.element) {
        case "저장":
            {
                if (param.object == "lyrMenu1")
                    processInformResult1(param);
                else
                    processInformResult2(param);
            }
            break;
        case "취소":
            {
                changeStep({ step: 1 });
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
        case "실행":
            {
                var cert_yn = gw_com_api.getValue("frmOption3", 1, "cert_yn");
                if (cert_yn == "0" && gw_com_api.getSelectedRow("grdList_ECM") < 1) return;
                var doc_id = cert_yn == "1" ? "0" : gw_com_api.getValue("grdList_ECM", "selected", "doc_id", true);
                var row = gw_com_api.getSelectedRow("grdList_PER");
                if (row < 1) return;
                var rowdata = $("#grdList_PER_data").getRowData(row);
                processBatch({
                    doc_id: doc_id,
                    per_no: rowdata.per_no,
                    supp_seq: rowdata.supp_seq,
                    pur_no: rowdata.pur_no,
                    ext1_val: gw_com_api.getValue("frmOption4", 1, "ext1_val"),
                    file1_chk: gw_com_api.getValue("frmData_FILE", 1, "file1_chk"),
                    file2_chk: gw_com_api.getValue("frmData_FILE", 1, "file2_chk"),
                    file3_chk: gw_com_api.getValue("frmData_FILE", 1, "file3_chk"),
                    file4_chk: gw_com_api.getValue("frmData_FILE", 1, "file4_chk"),
                    file5_chk: gw_com_api.getValue("frmData_FILE", 1, "file5_chk")
                });
                closeOption({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    switch (param.element) {
        case "cert_yn":
            {
                if (param.value.current == "1") {
                    gw_com_api.setValue("frmData_FILE", 1, "file1_chk", "0");
                    gw_com_api.setValue("frmData_FILE", 1, "file2_chk", "0");
                    gw_com_api.setValue("frmData_FILE", 1, "file3_chk", "0");
                    viewOption4({});
                } else {
                    gw_com_api.setValue("frmData_FILE", 1, "file1_chk", "1");
                    gw_com_api.setValue("frmData_FILE", 1, "file2_chk", "1");
                    gw_com_api.setValue("frmData_FILE", 1, "file3_chk", "1");
                }
            }
            break;
    }

}
//----------
function processRetrieve1(param) {

    var args = {
        target: [{ type: "FORM", id: "frmOption1" }]
    };
    if (gw_com_module.objValidate(args) == false)
        return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption1", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "per_title", argument: "arg_title" },
                { name: "supp_nm", argument: "arg_supp_nm" },
                { name: "supp_cd", argument: "arg_supp_cd" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_PER", focus: true, select: true }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieve2(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption2", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "cr_title", argument: "arg_title" },
                { name: "supp_cd", argument: "arg_supp_cd" },
                { name: "supp_nm", argument: "arg_supp_nm" },
                { name: "doc_no", argument: "arg_doc_no" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_ECM", select: true }
        ],
        key: param.key,
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

}
//----------
function processInformResult1(param) {

    var row = gw_com_api.getSelectedRow("grdList_PER");
    if (row < 1) return;
    gw_com_api.setValue("frmOption2", 1, "ymd_fr", gw_com_api.getValue("frmOption1", 1, "ymd_fr"));
    gw_com_api.setValue("frmOption2", 1, "ymd_to", gw_com_api.getValue("frmOption1", 1, "ymd_to"));
    //gw_com_api.setValue("frmOption2", 1, "cr_title", gw_com_api.getValue("grdList_PER", "selected", "per_title", true));
    gw_com_api.setValue("frmOption2", 1, "supp_cd", gw_com_api.getValue("grdList_PER", "selected", "supp_cd", true));
    changeStep({ step: 2 });
    processRetrieve2({});

}
//----------
function processInformResult2(param) {

    var cert_yn = gw_com_api.getValue("frmOption3", 1, "cert_yn");
    if (cert_yn == "0" && gw_com_api.getSelectedRow("grdList_ECM") < 1) return;
    var doc_id = cert_yn == "1" ? "0" : gw_com_api.getValue("grdList_ECM", "selected", "doc_id", true);
    var row = gw_com_api.getSelectedRow("grdList_PER");
    if (row < 1) return;
    var rowdata = $("#grdList_PER_data").getRowData(row);
    if (cert_yn == "0") {
        processBatch({
            doc_id: doc_id,
            per_no: rowdata.per_no,
            supp_seq: rowdata.supp_seq,
            pur_no: rowdata.pur_no,
            ext1_val: "",
            file1_chk: gw_com_api.getValue("frmData_FILE", 1, "file1_chk"),
            file2_chk: gw_com_api.getValue("frmData_FILE", 1, "file2_chk"),
            file3_chk: gw_com_api.getValue("frmData_FILE", 1, "file3_chk"),
            file4_chk: gw_com_api.getValue("frmData_FILE", 1, "file4_chk"),
            file5_chk: gw_com_api.getValue("frmData_FILE", 1, "file5_chk")
        });
    } else {
        viewOption4({});
    }

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "sp_createECMResult",
        nomessage: true,
        input: [
            { name: "doc_id", value: param.doc_id, type: "int" },
            { name: "per_no", value: param.per_no, type: "varchar" },
            { name: "supp_seq", value: param.supp_seq, type: "varchar" },
            { name: "pur_no", value: param.pur_no, type: "varchar" },
            { name: "ext1_val", value: param.ext1_val, type: "varchar" },
            { name: "file1_chk", value: param.file1_chk, type: "varchar" },
            { name: "file2_chk", value: param.file2_chk, type: "varchar" },
            { name: "file3_chk", value: param.file3_chk, type: "varchar" },
            { name: "file4_chk", value: param.file4_chk, type: "varchar" },
            { name: "file5_chk", value: param.file5_chk, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "result_id", type: "varchar" },
            { name: "err_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] == "" || response.VALUE[0] == "0") {
        gw_com_api.messageBox([{ text: response.VALUE[1] }]);
    } else {
        v_global.logic.result_id = response.VALUE[0];

        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: {
                result_id: v_global.logic.result_id
            }
        };
        gw_com_module.streamInterface(args);

        //processClear({});
        var args = {
            targetid: "grdList_PER", row: "selected", select: true
        };
        gw_com_module.gridDelete(args);
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_ECM" },
            { type: "GRID", id: "grdList_PER" }
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

    closeOption({});
    var args = { target: [] };
    if (param.step == 1) {
        gw_com_api.show("lyrContent_1");
        gw_com_api.hide("lyrContent_2");
        args.target[0] = { type: "GRID", id: "grdList_PER", offset: 8 };
    } else {
        gw_com_api.hide("lyrContent_1");
        gw_com_api.show("lyrContent_2");
        args.target[0] = { type: "GRID", id: "grdList_ECM", offset: 8 };
    }
    //----------
    gw_com_module.objResize(args);
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
                v_global.data = param.data;
                changeStep({ step: 1 });
                if (v_global.logic.init)
                    gw_com_api.show("frmOption1");
                else {
                    var args = {
                        targetid: "frmData_FILE",
                        edit: true,
                        updatable: true,
                        data: [
                            { name: "file1_chk", value: "1" },
                            { name: "file2_chk", value: "1" },
                            { name: "file3_chk", value: "1" },
                            { name: "file4_chk", value: "0" },
                            { name: "file5_chk", value: "0" }
                        ]
                    };
                    gw_com_module.formInsert(args);
                    processRetrieve1({});
                }
                v_global.logic.init = true;
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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//