//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약상세(발주사용)
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

        // prepare dialogue. ---공인인증
        var args = {
            type: "PAGE", page: "SignDataVIDVerify_IPS", content: "html", path: "../ccc-sample-wstd/", title: "공인인증",
            width: 600, height: 500, locate: ["center", "center"]
        };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
				{
				    type: "PAGE", name: "SYS010", query: "DDDW_CM_CODE",    // 통화
				    param: [{ argument: "arg_hcode", value: "SYS010" }]
				},
				{
				    type: "PAGE", name: "SYS011", query: "DDDW_CM_CODE",    // 국가
				    param: [{ argument: "arg_hcode", value: "SYS011" }]
				},
				{
				    type: "PAGE", name: "ECM010", query: "DDDW_CM_CODE",    // 문서구분
				    param: [{ argument: "arg_hcode", value: "ECM010" }]
				},
				{
				    type: "PAGE", name: "ECM040", query: "DDDW_CM_CODE",    // 계약자구분
				    param: [{ argument: "arg_hcode", value: "ECM040" }]
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
                v_global.logic.doc_id = gw_com_api.getPageParameter("doc_id");
                v_global.logic.doc_no = gw_com_api.getPageParameter("doc_no");
                v_global.logic.supp_id = gw_com_api.getPageParameter("supp_id");
                v_global.logic.supp_cd = gw_com_api.getPageParameter("supp_cd");
                processRetrieve({});
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
                //{ name: "항목", value: "추가항목입력", icon: "기타", updatable: true },
				//{ name: "저장", value: "저장" },
				//{ name: "승인", value: "승인", icon: "기타", updatable: true },
				//{ name: "반려", value: "반려", icon: "기타", updatable: true },
                { name: "출력", value: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_DOC", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "ECM_1020_1", type: "TABLE", title: "",
            caption: false, show: true,
            editable: { bind: "select", focus: "crs_date", validate: true },
            content: {
                width: { label: 110, field: 270 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "문서번호", format: { type: "label" } },
                            { name: "doc_no", editable: { type: "hidden" } },
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
                            { name: "cr_emp", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "ins_usr_nm" }
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
                                editable: { type: "text", width: 100 }
                            },
                            {
                                value: "~", style: { colfloat: "floating" },
                                format: { type: "label", width: 60 }
                            },
                            {
                                name: "cre_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 60 },
                                editable: { type: "text", width: 100 }
                            },
                            { header: true, value: "작성일", format: { type: "label" } },
                            { name: "ins_dt", format: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "국가", format: { type: "label" } },
                            {
                                name: "nation",
                                format: { type: "select", data: { memory: "SYS011" } },
                                editable: { type: "select", data: { memory: "SYS011" } }
                            },
                            { header: true, value: "", format: { type: "label" } },
                            { name: "" },
                            //{ header: true, value: "자동연장/횟수", format: { type: "label" } },
                            //{
                            //    name: "ext_yn", style: { colfloat: "float" },
                            //    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                            //    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            //},
                            //{
                            //    value: "/", style: { colfloat: "floating" },
                            //    format: { type: "label", width: 60 }
                            //},
                            //{
                            //    name: "ext_cnt", style: { colfloat: "floated" }, mask: "numeric-int",
                            //    format: { type: "text", width: 30 },
                            //    editable: { type: "text", width: 30, maxlength: 3 }
                            //},
                            { header: true, value: "계약상태", format: { type: "label" } },
                            { name: "pstat_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "cr_title", style: { colspan: 3 },
                                format: { type: "text", width: 654 },
                                editable: { type: "text", width: 648 }
                            },
                            { header: true, value: "처리상태", format: { type: "label" } },
                            { name: "astat_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                name: "cr_rmk", style: { colspan: 5 },
                                format: { type: "textarea", rows: 2, width: 1040 },
                                editable: { type: "textarea", rows: 2, width: 1034 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "화폐단위", format: { type: "label" } },
                            {
                                name: "currency",
                                editable: { type: "select", data: { memory: "SYS010" }, validate: { rule: "required", message: "화폐" } }
                            },
                            { header: true, value: "계약금액(VAT별도)", format: { type: "label" } },
                            {
                                name: "amount", mask: "numeric-int",
                                format: { type: "text" },
                                editable: { type: "text", maxlength: 15 }
                            },
                            { header: true, value: "지급방법", format: { type: "label" } },
                            {
                                name: "payment",
                                editable: { type: "text", validate: { rule: "required", message: "지급방법" } }
                            },
                            { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                            { name: "pstat", editable: { type: "hidden" }, hidden: true },
                            { name: "astat", editable: { type: "hidden" }, hidden: true },
                            { name: "cert_yn", editable: { type: "hidden" }, hidden: true },
                            { name: "edit_yn", hidden: true }
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
            targetid: "grdData_SUB", query: "ECM_2020_2", title: "계약자",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "", validate: true },
            element: [
				{
				    header: "구분", name: "supp_tp", width: 100, align: "center",
				    format: { type: "select", data: { memory: "ECM040" } }
				},
				{ header: "상태", name: "pstat_nm", width: 80, align: "center" },
				{ header: "거래처", name: "supp_nm", width: 200 },
				{
				    header: "대표자", name: "supp_prsdnt", width: 120,
				    editable: { type: "text", maxlength: 50 }
				},
				{
				    header: "담당자", name: "supp_man", width: 120,
				    editable: { type: "text", maxlength: 50 }
				},
				{
				    header: "연락처", name: "supp_telno", width: 150,
				    editable: { type: "text", maxlength: 20 }
				},
				{
				    header: "E-Mail", name: "supp_email", width: 200,
				    editable: { type: "text", maxlength: 100 }
				},
				{
				    header: "지분율", name: "cr_rate", width: 100, align: "right",
				    editable: { type: "text", maxlength: 6 }, mask: "numeric-float"
				},
				{
				    header: "주소", name: "supp_addr", width: 400,
				    editable: { type: "text", maxlength: 310 }
				},
                { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                { name: "supp_cd", editable: { type: "hidden" }, hidden: true },
                { name: "cert_data", editable: { type: "hidden" }, hidden: true },
                { name: "supp_id", editable: { type: "hidden" }, hidden: true },
                { name: "rgst_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_DOC", query: "ECM_2020_3", title: "계약문서",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn", focus: "doc_tp", validate: true },
            element: [
				{
				    header: "문서구분", name: "doc_tp", width: 100, align: "center",
				    format: { type: "select", data: { memory: "ECM010" } }
				},
				{
				    header: "파일명", name: "doc_nm", width: 540,
				    editable: { type: "text", validate: { rule: "required", message: "파일명" } }
				},
				{
				    header: "필수", name: "require_yn", width: 70, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "편집", name: "edit_yn", width: 70, align: "center", hidden: true,
				    format: { type: "checkbox", value: "1", offval: "0" },
				    editable: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "Rev.No.", name: "rev_no", width: 70,
				    editable: { type: "text", maxlength: 6 }
				},
                {
                    header: "파일", name: "file_download", width: 50, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "파일", name: "file_upload", width: 50, align: "center",
                    format: { type: "link" }
                },
                { name: "std_id", editable: { type: "hidden" }, hidden: true },
                { name: "docf_id", editable: { type: "hidden" }, hidden: true },
                { name: "doc_lang", editable: { type: "hidden" }, hidden: true },
                { name: "file_id", hidden: true },
                { name: "file_nm", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "FORM", id: "frmData_MAIN", offset: 8 },
				{ type: "GRID", id: "grdData_SUB", offset: 8 },
				{ type: "GRID", id: "grdData_ALARM", offset: 8 },
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

        //=====================================================================================
        //var args = { targetid: "lyrMenu", element: "항목", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "승인", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "반려", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_DOC", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_DOC", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_DOC", grid: true, element: "file_download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_DOC", grid: true, element: "file_upload", event: "click", handler: processFile };
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
        case "추가":
            {
                processInsert(param);
            }
            break;
        case "삭제":
            {
                processDelete(param);
            }
            break;
        case "저장":
            {
                processSave(param);
            }
            break;
        case "닫기":
            {
                processClose(param);
            }
            break;
        case "승인":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.showMessage("승인처리 하시겠습니까?", "yesno")) {
                    var cert_yn = gw_com_api.getValue("frmData_MAIN", 1, "cert_yn");
                    if (cert_yn == "1") {
                        var ssn = gw_com_api.getValue("grdData_SUB", 1, "rgst_no", true);
                        if (!checkSignFile({ rgst_no: ssn })) {
                            var p = {
                                handler: rgstSignFile,
                                param: { rgst_no: ssn }
                            };
                            gw_com_api.messageBox([{ text: "인감 이미지 업로드 후 승인처리 할 수 있습니다." }], 450, undefined, undefined, p);
                            return;
                        }
                        var plain_txt = getPlainText({ doc_id: v_global.logic.doc_id });
                        if (plain_txt == "") plain_txt = v_global.logic.doc_no;
                        unisign.SignDataNVerifyVID(plain_txt, null, ssn,
                            function (rv, signedText, certAttrs) {
                                if (null === signedText || '' === signedText || false === rv) {
                                    unisign.GetLastError(
                                        function (errCode, errMsg) {
                                            if (errCode != "999")
                                                alert('Error code : ' + errCode + '\n\nError Msg : ' + errMsg);
                                        }
                                    );
                                } else {
                                    var args = {
                                        type: "SUPP_CERT_A",
                                        ext_data: signedText
                                    };
                                    processBatch(args);
                                }
                            }
                        );
                    } else {
                        var args = {
                            type: "SUPP_CERT_A",
                            ext_data: ""
                        };
                        processBatch(args);
                    }
                }
            }
            break;
        case "반려":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (!gw_com_api.showMessage("반려처리 하시겠습니까?", "yesno")) return;
                var args = {
                    type: "SUPP_CERT_B",
                    ext_data: ""
                };
                processBatch(args);
            }
            break;
        case "항목":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                processExtField(param);
            }
            break;
        case "출력":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                var args = {
                    option: [
                        { name: "PRINT", value: "pdf" },
                        { name: "PAGE", value: gw_com_module.v_Current.window },
                        { name: "USER", value: gw_com_module.v_Session.USR_ID },
                        { name: "DOC_ID", value: v_global.logic.doc_id },
                        { name: "DOC_NO", value: v_global.logic.doc_no }
                    ],
                    target: { type: "FILE", id: "lyrDown", name: v_global.logic.doc_no }
                };
                gw_com_module.objExport(args);
            }
            break;
        default:
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;

                var msg = [];
                switch (param.element) {
                    case "WAT_F":
                        {
                            msg[0] = { text: "계약서 파일을 등록할 수 있습니다." };
                        }
                        break;
                    case "WAT_A":
                        {
                            msg[0] = { text: "업체전송 상태로 변경됩니다." };
                        }
                        break;
                    case "CHK_A":
                        {
                            msg[0] = { text: "검토의뢰 상태로 변경됩니다." };
                        }
                        break;
                    case "CNL_A":
                        {
                            msg[0] = { text: "계약취소 상태로 변경됩니다." };
                        }
                        break;
                }

                if (msg.length > 0) {
                    msg[1] = { text: "계속하시겠습니까?" };
                    gw_com_api.messageBox(msg, 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);
                } else {
                    processBatch2(param);
                }
            }
    }

}
//----------
function processItemchanged(param) {


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
        ////===================================================================================================================
        //// 수신상태로 변경
        //var proc = {
        //    url: "COM",
        //    procedure: "sp_updateECMDocStat",
        //    nomessage: true,
        //    input: [
        //        { name: "type", value: "RCV_SUPP", type: "varchar" },
        //        { name: "doc_id", value: v_global.logic.doc_id, type: "varchar" },
        //        { name: "sub_id", value: v_global.logic.supp_id, type: "varchar" },
        //        { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        //    ],
        //    output: [
        //        { name: "err_msg", type: "varchar" }
        //    ]
        //};
        //gw_com_module.callProcedure(proc);
        ////===================================================================================================================
        args = {
            key: param.key,
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_doc_id", value: v_global.logic.doc_id },
                    { name: "arg_supp_cd", value: v_global.logic.supp_cd }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN" },
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

    // 버튼
    setButton({ astat: gw_com_api.getValue("frmData_MAIN", 1, "astat") });

}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_DOC") {

        if (!checkUpdatable({ check: true })) return;
        // 파일 등록
        v_global.event.data = {
            doc_id: v_global.logic.doc_id
        };
        var args = {
            type: "PAGE", page: "w_upload_ecm_file", title: "계약문서 등록",
            width: 650, height: 200, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_upload_ecm_file",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }

    }

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_DOC") {
        var obj = "grdData_" + param.object.split("_")[1];
        if (gw_com_api.getValue(obj, "selected", "_edit_yn", true) == "0") return;
        args = {
            targetid: obj, row: "selected", select: true
        };
    }
    gw_com_module.gridDelete(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
		    {
		        type: "FORM", id: "frmData_MAIN",
		        key: [{ row: 1, element: [{ name: "doc_id" }] }]
		    }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);


}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
			{ type: "FORM", id: "frmData_MAIN" },
			{ type: "GRID", id: "grdData_SUB" },
			{ type: "GRID", id: "grdData_DOC" }
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

    // 시스템 정의 필드값 자동 생성
    var args = {
        url: "COM",
        procedure: "sp_createECMDocFieldValue",
        nomessage: true,
        input: [
            { name: "doc_id", value: v_global.logic.doc_id, type: "int" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ]
    };
    gw_com_module.callProcedure(args);
    processPrint({});
    processRetrieve({ key: response });

}
//----------
function processBatch(param) {

    var proc = {
        url: "COM",
        procedure: "sp_updateECMDocStat",
        nomessage: true,
        input: [
            { name: "type", value: param.type, type: "varchar" },
            { name: "doc_id", value: v_global.logic.doc_id, type: "varchar" },
            { name: "sub_id", value: gw_com_api.getValue("grdData_SUB", 1, "supp_id", true), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "ext_data", value: param.ext_data == undefined ? "" : param.ext_data, type: "varchar" }
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
function processBatch2(param) {

    var proc = {
        url: "COM",
        nomessage: true,
        procedure: "sp_updateECMDocStat",
        input: [
            { name: "type", value: "U", type: "varchar" },
            { name: "doc_id", value: v_global.logic.doc_id, type: "varchar" },
            { name: "sub_id", value: "%", type: "varchar" },
            { name: "pstat", value: param.element, type: "varchar" },
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

    if (response.VALUE[0] == "") {
        gw_com_api.showMessage("정상 처리되었습니다.");
        if (param.element == "WAT_F") {
            processRetrieve({});
        } else {
            gotoList({});
            processClose({});
        }
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[0] }]);
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
			{ type: "FORM", id: "frmData_MAIN" },
			{ type: "GRID", id: "grdData_SUB" },
			{ type: "GRID", id: "grdData_DOC" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processFile(param) {

    if (param.element == "file_upload") {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return;
        //if (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") {
        //    gw_com_api.showMessage("수정할 수 없습니다.");
        //    return;
        //}
        // 파일 등록
        v_global.event.data = {
            doc_id: v_global.logic.doc_id,
            docf_id: gw_com_api.getValue(param.object, param.row, "docf_id", true)
        };
        var args = {
            type: "PAGE", page: "w_upload_ecm_file", title: "계약문서 등록",
            width: 650, height: 200, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_upload_ecm_file",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }

    } else {
        var args = {
            source: { id: param.object, row: param.row },
            targetid: "lyrDown"
        };
        gw_com_module.downloadFile(args);
    }

}
//----------
function gotoList(param) {

    var title = "전자 계약";
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "ECM_2010",
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
function processExtField(param) {

    v_global.event.data = {
        doc_id: v_global.logic.doc_id,
        doc_no: v_global.logic.doc_no
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
//----------
function processPrint(param) {

    //var args = {
    //    page: "ECM_1020",
    //    option: [
    //        { name: "PRINT", value: "pdf" },
    //        { name: "PAGE", value: "ECM_1020" },
    //        { name: "USER", value: gw_com_module.v_Session.USR_ID },
    //        { name: "DOC_ID", value: v_global.logic.doc_id },
    //        { name: "DOC_NO", value: v_global.logic.doc_no }
    //    ],
    //    target: { type: "FILE", id: "ZZZ", name: v_global.logic.doc_no }
    //};
    //gw_com_module.objExport(args);

    var params = {
        DATA: {
            USER: gw_com_module.v_Session.USR_ID,
            OPTION: {
                NAME: ["PRINT", "PAGE", "USER", "DOC_ID", "DOC_NO"],
                VALUE: ["pdf", "ECM_1020", gw_com_module.v_Session.USR_ID, v_global.logic.doc_id, v_global.logic.doc_no]
            }
        }
    };
    var param = {
        request: "SERVICE",
        url: "ECM_1020.aspx/Print",
        params: JSON.stringify(params)
    };
    gw_com_module.callRequest(param);

}
//----------
function setButton(param) {

    // 보기전용
    if (v_global.logic.view) {
        param.astat = "";
    }
    //-----------------------
    var args = {
        targetid: "lyrMenu", type: "FREE",
        element: [
            { name: "출력", value: "출력" },
            { name: "닫기", value: "닫기" }
        ]
    };
    ////-----------------------
    //var args = {
    //    targetid: "lyrMenu", type: "FREE",
    //    element: [
    //        //{ name: "항목", value: "추가항목입력", icon: "기타", updatable: true },
    //        //{ name: "저장", value: "저장" },
    //        //{ name: "승인", value: "승인", icon: "기타", updatable: true },
    //        //{ name: "반려", value: "반려", icon: "기타", updatable: true },
    //        { name: "닫기", value: "닫기" }
    //    ]
    //};
    ////-----------------------
    //gw_com_module.buttonMenu(args);
    ////=====================================================================================

    var ele = [];
    switch (param.astat) {
        case "WAT_B":       // 계약수신
            {
                ele[ele.length] = { name: "항목", value: "추가항목입력", icon: "기타" };
                ele[ele.length] = { name: "저장", value: "저장" };
                if (gw_com_api.getValue("frmData_MAIN", 1, "edit_yn") == "1")
                    ele[ele.length] = { name: "WAT_F", value: "계약수정", icon: "기타" };
                ele[ele.length] = { name: "승인", value: "승인", icon: "기타" };
                ele[ele.length] = { name: "반려", value: "반려", icon: "기타" };
            }
            break;
        case "WAT_F":       // 업체수정
            {
                ele[ele.length] = { name: "WAT_E", value: "수정완료", icon: "기타" };
            }
            break;
        case "WAT_E":       // 계약수정
            {
                ele[ele.length] = { name: "WAT_F", value: "수정취소", icon: "기타" };
            }
            break;
    }

    if (ele.length > 0)
        args.element = ele.concat(args.element);
    //-----------------------
    gw_com_module.buttonMenu(args);
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================
    if (param.astat == "REG" || param.astat == "WAT_E") {
        gw_com_api.show("lyrMenu_SUB");
        gw_com_api.show("lyrMenu_DOC");
    } else {
        gw_com_api.hide("lyrMenu_SUB");
        gw_com_api.hide("lyrMenu_DOC");
    }

}
//----------
function getPlainText(param) {
    
    var rtn = "";
    $.ajax({
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=ECM_2020_9" +
                "&QRY_COLS=doc_content" +
                "&CRUD=R" +
                "&arg_doc_id=" + param.doc_id,
        type: 'post',
        cache: false,
        async: false,
        data: "{}",
        success: function (data, status) {
            var response = JSON.parse(data);
            if (response.iCode == 0) {
                rtn = response.tData[0].DATA[0];
            }
        }
    });

    return rtn;

}
//----------
function checkSignFile(param) {

    var rtn = false;
    $.ajax({
        url: "/Files/ECM_FILES/SIGN_FILES/" + param.rgst_no + ".png",
        type: 'HEAD',
        async: false,
        error: function () {
            rtn = false;
        },
        success: function () {
            rtn = true;
        }
    });
    return rtn;

}
//----------
function rgstSignFile(param) {

    v_global.event.data = {
        rgst_no: param.rgst_no
    }
    var args = {
        type: "PAGE", page: "ECM_2099", title: "전자계약용 도장 이미지",
        width: 300, height: 370, open: true,
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
                    case gw_com_api.v_Message.msg_alert:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
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
                                processBatch2(param.data.arg);
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
                    case "ECM_1022":
                    case "w_upload_ecm_file":
                    case "ECM_2099":
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
                    case "ECM_1022":
                        {
                            if (param && param.data)
                                processRetrieve({});
                        }
                        break;
                    case "w_upload_ecm_file":
                        {
                            if (param.data != undefined) {
                                processRetrieve({ object: "FILE", key: param.data });
                            }
                        }
                        break;
                }

                closeDialogue({ page: param.from.page });
            }
            break;
    }

}