//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약서 등록
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
                    type: "INLINE", name: "업체구분",
                    data: [
                        { title: "협력사", value: "2" },
                        { title: "고객사", value: "1" }
                    ]
                },
                {
                    type: "INLINE", name: "언어",
                    data: [
                        { title: "국문", value: "KOR" },
                        { title: "영문", value: "ENG" }
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

            // For Temp By JJJ
        	v_global.data = { cert_yn: "1", cert_auth: "U" };
        	gw_com_api.setValue("frmOption1", "cert_yn", "1");
        	changeStep({ step: 1 });
        	v_global.logic.retrieve = true;
        	processRetrieve1({});

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
                            },
                            {
                                name: "doc_lang", label: { title: "언어 :" },
                                editable: { type: "select", data: { memory: "언어" } }
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
            targetid: "grdList_STDDOC", query: "ECM_1021_1", title: "계약분류",
            caption: false, height: 300, pager: false, show: true, selectable: true, number: true, key: true,
            element: [
				{ header: "분류명", name: "grp_nm", width: 150 },
				{ header: "파일명", name: "doc_nm", width: 350 },
                {
                    header: "표준", name: "std_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }, hidden: true
                },
                { name: "std_id", hidden: true }
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
                { name: "조회", value: "조회" },
                { name: "추가", value: "신규 거래처" },
                { name: "추가2", value: "신규 거래처(전자계약용)", icon: "추가" },
                { name: "저장", value: "확인" },
                { name: "취소", value: "취소", icon: "아니오" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "supp_tp", label: { title: "" },
                                editable: { type: "select", data: { memory: "업체구분" } }
                            },
                            {
                                name: "supp_nm", label: { title: "" },
                                editable: { type: "text", size: 17, validate: { rule: "required", message: "업체명" } }
                            },
                            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUPP", query: "ECM_1023_1", title: "거래처",
            caption: false, height: 390, show: true, selectable: true, number: true, key: true, //dynamic: true, multi: true, checkrow: true,
            element: [
				{ header: "거래처코드", name: "supp_cd", width: 90, align: "center", hidden: true },
				{ header: "거래처명", name: "supp_nm", width: 180 },
				{ header: "사업자등록번호", name: "rgst_no", width: 100, align: "center", mask: "biz-no" },
                { header: "대표자", name: "prsdnt_nm", width: 90, align: "center" },
                { header: "담당자", name: "person_nm", width: 90, align: "center" },
                { header: "E-Mail", name: "person_email", width: 150 },
                { header: "휴대폰", name: "person_mobile", width: 100, align: "center" },
                { header: "전화번호", name: "person_tel", width: 100, align: "center" },
                { header: "FAX", name: "person_fax", width: 100, align: "center", hidden: true },
                { header: "주소", name: "addr", width: 200, hidden: true },
                { name: "supp_tp", hidden: true },
                { name: "user_seq", hidden: true },
                { name: "temp_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_STDDOC", offset: 8 },
                { type: "GRID", id: "grdList_STDDOC_D", offset: 8 },
                { type: "GRID", id: "grdList_SUPP", offset: 8 }
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
        var args = { targetid: "grdList_STDDOC", grid: true, event: "rowselected", handler: processRetrieve1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_STDDOC", grid: true, event: "rowdblclick", handler: processInformResult1 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_STDDOC", grid: true, event: "rowkeyenter", handler: processInformResult1 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu2", element: "조회", event: "click", handler: processRetrieve2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "추가2", event: "click", handler: processButton };
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
        //----------
        var args = { targetid: "frmOption2", element: "실행", event: "click", handler: processRetrieve2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_SUPP", grid: true, event: "rowdblclick", handler: processInformResult2 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_SUPP", grid: true, event: "rowkeyenter", handler: processInformResult2 };
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
        case "추가":
            {
                // 1.
                //var title = "협력사 등록";
                //var args = {
                //    ID: gw_com_api.v_Stream.msg_linkPage,
                //    to: { type: "MAIN" },
                //    data: {
                //        page: "w_pom9010",
                //        title: title
                //    }
                //};
                //gw_com_module.streamInterface(args);
                // 2.
                var args = {
                    type: "PAGE", page: "ECM_1024", title: "계약처 등록",
                    width: 900, height: 180, locate: ["center", "center"], open: true, scroll: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    args = {
                        page: args.page,
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "추가2":
            {
                var args = {
                    type: "PAGE", page: "SYS_2019", title: "협력사 등록",
                    width: 800, height: 340, open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "SYS_2019",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
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
    }

}
//----------
function processAlert(param) {

    var cert_yn = gw_com_api.getValue("frmOption1", 1, "cert_yn");
    var msg = cert_yn == "1" ? "전자인증 계약서입니다." : "전자인증 미사용 계약서입니다.";
    gw_com_api.showMessage(msg);

}
//----------
function processItemchanged(param) {

    switch (param.element) {
        case "supp_tp":
            {
                if (gw_com_api.getValue(param.object, param.row, "supp_nm") == "") {
                    var args = {
                        target: [
                            { type: "GRID", id: "grdList_SUPP" }
                        ]
                    };
                    gw_com_module.objClear(args);
                } else {
                    processRetrieve2({});
                }
            }
            break;
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
                    { name: "std_id", argument: "arg_std_id" }
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
                    { name: "doc_nm", argument: "arg_doc_nm" },
                    { name: "doc_lang", argument: "arg_doc_lang" }
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
function processRetrieve2(param) {

    var args = {
        target: [{ type: "FORM", id: "frmOption2" }]
    };
    if (gw_com_module.objValidate(args) == false)
        return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption2",
            element: [
                { name: "supp_tp", argument: "arg_supp_tp" },
                { name: "supp_nm", argument: "arg_supp_nm" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_SUPP", focus: true, select: true }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    // 전체선택
    if (param.object == "grdList_STDDOC")
    {
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
    changeStep({ step: 2 });

}
//----------
function processInformResult2(param) {

    var row = gw_com_api.getSelectedRow("grdList_SUPP");
    if (row < 1) return;
    var rowdata = $("#grdList_SUPP_data").getRowData(row);
    processBatch({
        supp_tp: rowdata.supp_tp,
        supp_cd: rowdata.supp_cd,
        supp_nm: rowdata.supp_nm,
        supp_prsdnt: rowdata.prsdnt_nm,
        supp_man: rowdata.person_nm,
        supp_telno: rowdata.person_mobile,
        supp_email: rowdata.person_email,
        supp_addr: rowdata.addr,
        rgst_no: gw_com_api.unMask(rowdata.rgst_no, "biz-no")
    });

}
//----------
function processBatch(param) {

    // for Debugging
    if (console != undefined && console != null)
        console.log("processBatch = %s", JSON.stringify(param));

    var std_id = gw_com_api.getValue("grdList_STDDOC", "selected", "std_id", true);
    var sub_id = "";
    var ids = gw_com_api.getSelectedRow("grdList_STDDOC_D", true);
    $.each(ids, function () {
        sub_id += (sub_id == "" ? "" : ",") + gw_com_api.getValue("grdList_STDDOC_D", this, "std_id", true);
    });
    var args = {
        url: "COM",
        procedure: "sp_createECMDoc",
        nomessage: true,
        input: [
            { name: "std_id", value: std_id, type: "int" },
            { name: "sub_id", value: sub_id, type: "varchar" },
            { name: "dept_area", value: gw_com_api.getValue("frmOption1", 1, "dept_area"), type: "varchar" },
            //{ name: "cr_title", value: gw_com_api.getValue("grdList_STDDOC", "selected", "doc_nm", true) },
            { name: "cert_yn", value: gw_com_api.getValue("frmOption1", 1, "cert_yn"), type: "varchar" },
            { name: "supp_tp", value: param.supp_tp, type: "varchar" },
            { name: "supp_cd", value: param.supp_cd, type: "varchar" },
            { name: "supp_nm", value: param.supp_nm, type: "varchar" },
            { name: "supp_prsdnt", value: param.supp_prsdnt, type: "varchar" },
            { name: "supp_man", value: param.supp_man, type: "varchar" },
            { name: "supp_telno", value: param.supp_telno, type: "varchar" },
            { name: "supp_email", value: param.supp_email, type: "varchar" },
            { name: "supp_addr", value: param.supp_addr, type: "varchar" },
            { name: "rgst_no", value: param.rgst_no, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "doc_id", type: "int" },
            { name: "doc_no", type: "varchar" },
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
    // for Debugging
    if (console != undefined && console != null)
        console.log("successBatch = %s", JSON.stringify(response));

    if (response.VALUE[0] == "" || response.VALUE[0] == "0") {
        gw_com_api.messageBox([{ text: response.VALUE[1] }]);
    } else {
        v_global.logic.doc_id = response.VALUE[0];
        v_global.logic.doc_no = response.VALUE[1];

        // 계약서 파일 생성
        var params = {
            DATA: {
                USER: gw_com_module.v_Session.USR_ID,
                OPTION: {
                    NAME: ["PAGE", "DOC_ID", "DOC_NO"],
                    VALUE: [gw_com_module.v_Current.window, v_global.logic.doc_id, v_global.logic.doc_no]
                }
            }
        };
        var args = {
            request: "SERVICE", block: true,
            url: gw_com_module.v_Current.window + ".aspx/CreateDoc",
            params: JSON.stringify(params),
            handler_success: successCreate,
            handler_error: errCreate
        };
        gw_com_module.callRequest(args);
    }

    
}
//----------
function successCreate(param) {

    // for Debugging
    if (console != undefined && console != null)
        console.log("successCreate = %s", JSON.stringify(param));

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

    // for Debugging
    if (console != undefined && console != null)
        console.log("errCreate = %s", JSON.stringify(param));

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
            { type: "GRID", id: "grdList_STDDOC" }
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

    if (param.step == 1) {
        gw_com_api.show("frmOption1");
        gw_com_api.show("lyrMenuStep1");
        gw_com_api.show("lyrContentStep1");
        gw_com_api.hide("lyrMenuStep2");
        gw_com_api.hide("lyrContentStep2");
        if (v_global.data.cert_auth == "R") {
            //gw_com_api.hide("frmOption1");
            $("#frmOption1_cert_yn").attr("disabled", "disabled");
        } else {
            //gw_com_api.show("frmOption1");
            $("#frmOption1_cert_yn").removeAttr("disabled");
        }
    } else {
        gw_com_api.hide("frmOption");
        gw_com_api.hide("frmOption1");
        gw_com_api.hide("lyrMenuStep1");
        gw_com_api.hide("lyrContentStep1");
        gw_com_api.show("lyrMenuStep2");
        gw_com_api.show("lyrContentStep2");
        gw_com_api.setFocus("frmOption2", 1, "supp_nm");
    }

}
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
                    case "SYS_2019":
                        {
                        }
                        break;
                    default:
                        {
                            if (param.data == undefined)
                                param.data = { cert_yn: "1", cert_auth: "U" };
                            v_global.data = param.data;
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
                    case "SYS_2019":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue("frmOption2", 1, "supp_nm", param.data.user_nm);
                                processRetrieve2({});
                                //var row = [{
                                //    per_no: v_global.logic.per_no,
                                //    supp_cd: param.data.user_id,
                                //    supp_nm: param.data.user_nm,
                                //    supp_man: param.data.emp_nm,
                                //    supp_telno: param.data.emp_hp_no,
                                //    supp_fax_no: param.data.emp_fax_no,
                                //    supp_email1: param.data.emp_email,
                                //    send_tp: "SRM",
                                //    temp_yn: param.data.temp_yn == "1" ? "1" : "0"
                                //}];
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) break;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//