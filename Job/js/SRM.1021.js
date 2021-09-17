//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입찰견적의뢰접수
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

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "" || gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);
        start();

        //----------
        function start() {
            ////==================================== TEST ========================================
            //gw_com_module.v_Session.USR_ID = "BY0558";
            ////==================================================================================

            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "supp_cd", v_global.logic.Supp ? gw_com_module.v_Session.USR_ID : "");
            gw_com_api.setValue("frmOption", 1, "supp_nm", v_global.logic.Supp ? gw_com_module.v_Session.USR_NM : "");
            //----------
            gw_com_module.startPage();

            if (v_global.logic.Supp) processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "수정", value: "접수/제출", icon: "추가" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "의뢰일자 :" }, mask: "date-ymd",
                                style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                hidden: v_global.logic.Supp,
                                editable: { type: "text", size: 15, validate: { rule: "required" } }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "item_cd", label: { title: "품번 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "pr_no", label: { title: "구매요청번호 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pr_man", label: { title: "청구자 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "per_no", label: { title: "의뢰번호 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE", title: "접수자",
            trans: true, border: true, show: false,
            editable: { focus: "rcvd_man", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "rcvd_man", label: { title: "접수자명 :" },
                                editable: { type: "text", size: 10, maxlength: 20, validate: { rule: "required" } }
                            },
                            { name: "per_no", hidden: true },
                            { name: "supp_seq", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { name: "접수확인", value: "확인", act: true, format: { type: "button", icon: "실행" } },
                            { name: "접수취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PER_SUPP", query: (v_global.logic.Supp ? "SRM_1021_1_SUPP" : "SRM_1021_1"), title: "의뢰 현황",
            caption: true, height: 100, show: true, selectable: true, number: true, key: true,
            element: [
                { header: "의뢰번호", name: "per_no", width: 60, align: "center" },
                { header: "의뢰일자", name: "per_date", width: 60, align: "center", mask: "date-ymd" },
                { header: "구매담당", name: "per_man", width: 100, align: "center" },
                { header: "구분", name: "per_type_nm2", width: 40, align: "center" },
                { header: "구분", name: "per_type_nm", width: 50, align: "center", hidden: true },
                { header: "입찰방법", name: "bid_type_nm", width: 50, align: "center", hidden: true },
                { header: "접수마감일", name: "close_date", width: 60, align: "center", mask: "date-ymd", hidden: true },
                { header: "접수기간", name: "per_term", width: 160, align: "center" },
                { header: "의뢰상태", name: "pstat_nm", width: 40, align: "center", hidden: v_global.logic.Supp },
                //{ header: "협력사", name: "supp_nm", width: 80 },
                { header: "수신인", name: "supp_man", width: 50, align: "center" },
                { header: "진행상태", name: "supp_pstat_nm", width: 50, align: "center" },
                { header: "상태변경일", name: "supp_pdate", width: 110, align: "center", hidden: true },
                { header: "전송방법", name: "send_tp", width: 50, align: "center", hidden: true },
                //{ header: "회신기한일", name: "limit_date", width: 60, align: "center", mask: "date-ymd" },
                { header: "총금액", name: "est_amt", width: 60, align: "right", mask: "currency-int" }, //견적단가 * 수량
                {
                    header: "도면배포", name: "dwg_dist_no", width: 60, align: "center", format: { type: "link" }
                },
                { name: "supp_seq", hidden: true },
                { name: "supp_cd", hidden: true },
                { name: "supp_pstat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PER_ITEM", query: "SRM_1021_2", title: "의뢰 품목",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true, key: true,
            element: [
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 160 },
                { header: "품목사양", name: "item_spec", width: 160 },
                { header: "도면", name: "item_url", width: 80, align: "center", format: { type: "link" }, hidden: true },
                { header: "수량", name: "qty", width: 40, align: "right", mask: "numeric-int" },
                { header: "단위", name: "uom", width: 40, align: "center" },
                { header: "통화", name: "curr_cd", width: 40, align: "center" },
                { header: "고객요청일", name: "dlvr_date", width: 60, align: "center", mask: "date-ymd" },
                { header: "청구자", name: "pr_man", width: 60, align: "center", hidden: true },
                { header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                { header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { header: "견적단가", name: "rpt_price", width: 60, align: "right", mask: "currency-int" },
                { header: "견적금액", name: "rpt_amt", width: 60, align: "right", mask: "currency-int" },
                //{ header: "도면", name: "dwg_dist_no", width: 60, align: "center", format: { type: "link" } },
                { name: "per_no", hidden: true },
                { name: "supp_seq", hidden: true },
                { name: "item_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_PER_ITEM_data").parents('div.ui-jqgrid-bdiv').css("min-height", "200px");
        $("#grdList_PER_ITEM_data").parents('div.ui-jqgrid-bdiv').css("max-height", "400px");
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE", query: "SRM_1021_3", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true, key: true,
            element: [
                { header: "구분", name: "data_tp_nm", width: 150 },
                { header: "파일명", name: "file_nm", width: 250 },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "설명", name: "file_desc", width: 300, editable: { type: "text" } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdList_FILE_data").parents('div.ui-jqgrid-bdiv').css("min-height", "50px");
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_PER_SUPP", offset: 8 },
                { type: "GRID", id: "grdList_PER_ITEM", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "마감", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processPopup };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "접수확인", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "접수취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_PER_SUPP", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdList_PER_SUPP", grid: true, element: "dwg_dist_no", event: "click", handler: processDwgDist };
        gw_com_module.eventBind(args);
        //var args = { targetid: "grdList_PER_ITEM", grid: true, element: "dwg_dist_no", event: "click", handler: processDwgDist };
        //gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processDwgDist(param) {

    v_global.logic.search = {
        dist_no: gw_com_api.getValue(param.object, param.row, param.element, true), mode: (v_global.logic.Supp ? "supp" : "view")
    };
    var args = {
        type: "PAGE", page: "SRM_BID_DwgDist_View", title: "도면배포 정보",
        width: 1100, height: 550, open: true,
        locate: ["center", "top"],
        id: gw_com_api.v_Stream.msg_openedDialogue,
        param: { ID: gw_com_api.v_Stream.msg_openedDialogue, data: v_global.logic.search }
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "수정":
            {
                if (gw_com_api.getSelectedRow("grdList_PER_SUPP", false) == null) {
                    gw_com_api.messageBox([{ text: "선택된 내역이 없습니다." }]);
                    return;
                }
                var per_no = gw_com_api.getValue("grdList_PER_SUPP", "selected", "per_no", true);
                var supp_seq = gw_com_api.getValue("grdList_PER_SUPP", "selected", "supp_seq", true);
                processEdit({ per_no: per_no, supp_seq: supp_seq });
            }
            break;
        case "접수확인":
            {
                var args = { target: [{ type: param.type, id: param.object }] };
                if (gw_com_module.objValidate(args) == false) {
                    gw_com_api.show(param.object);
                    return false;
                }
                var column = [
                    { name: "per_no", value: gw_com_api.getValue(param.object, param.row, "per_no") },
                    { name: "supp_seq", value: gw_com_api.getValue(param.object, param.row, "supp_seq") },
                    { name: "pstat", value: "RCV" },
                    { name: "rcvd_man", value: gw_com_api.getValue(param.object, param.row, "rcvd_man") }
                ];
                processSave2({ column: column, message: true });
            }
            break;
        case "접수취소":
            {
                //closeOption({});
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
function viewOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption2");

}
//----------
function processItemchanged(param) {
    switch (param.object) {
        case "frmOption":
            if (param.element == "ymd_use") {
                if (param.value.current == "1") {
                    gw_com_api.setAttribute("frmOption", 1, "ymd_fr", "disabled", false);
                    gw_com_api.setAttribute("frmOption", 1, "ymd_to", "disabled", false);
                } else {
                    gw_com_api.setAttribute("frmOption", 1, "ymd_fr", "disabled", true);
                    gw_com_api.setAttribute("frmOption", 1, "ymd_to", "disabled", true);
                }
            }
            break;
    }
}
//----------
function processEdit(param) {

    var chk_per = Query.getPSTAT2({ per_no: param.per_no, supp_seq: param.supp_seq });
    if (chk_per.chk_yn1 == "0" || chk_per.chk_yn2 == "0") {
        var args = param;
        args.temp_id = (chk_per.chk_yn1 == "0" ? "SRM_PER07" : "SRM_PER08");
        processChk(args);
        return;
    }

    //var auth = (($.inArray(chk_per.pstat, ["PUB", "RCV"]) >= 0 && chk_per.dt_yn == "1") || chk_per.pstat == "RCV-R") && $.inArray(chk_per.per_pstat, ["PUB", "PRS"]) >= 0 ? "U" : "R";
    var auth = (($.inArray(chk_per.pstat, ["PUB", "RCV", "PRS"]) >= 0 && chk_per.dt_yn == "1") || chk_per.pstat == "RCV-R") && $.inArray(chk_per.per_pstat, ["PUB", "PRS"]) >= 0 ? "U" : "R";

    if (chk_per.pstat == "PUB" && chk_per.dt_yn == "1") {
        gw_com_api.setValue("frmOption2", 1, "per_no", param.per_no);
        gw_com_api.setValue("frmOption2", 1, "supp_seq", param.supp_seq);
        gw_com_api.show("frmOption2");
    } else {
        var args = {
            ID: gw_com_api.v_Stream.msg_linkPage,
            to: { type: "MAIN" },
            data: {
                page: "SRM_1022",
                title: "입찰/견적 접수/제출",
                param: [
                    { name: "AUTH", value: auth },
                    { name: "per_no", value: param.per_no },
                    { name: "supp_seq", value: param.supp_seq }
                ]
            }
        };
        gw_com_module.streamInterface(args);
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_PER_SUPP") {
        args = {
            source: {
                type: "GRID", id: "grdList_PER_SUPP", row: "selected",
                element: [
                    { name: "per_no", argument: "arg_per_no" },
                    { name: "supp_seq", argument: "arg_supp_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_PER_ITEM", select: true },
                { type: "GRID", id: "grdList_FILE", select: true }
            ]
        };

    } else {
        // Validate Inupt Options
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        // Retrieve
        args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "per_no", argument: "arg_per_no" },
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "pr_no", argument: "arg_pr_no" },
                    { name: "pr_man", argument: "arg_pr_man" },
                    { name: "supp_cd", argument: "arg_usr_id" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "proj_no" }] },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "pr_no" }] },
                    { element: [{ name: "pr_man" }] },
                    { element: [{ name: "per_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_PER_SUPP", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_PER_ITEM" },
                { type: "GRID", id: "grdList_FILE" }
            ]
        };

    }
    gw_com_module.objRetrieve(args);

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
function processPopup(param) {
    if (param.element == "supp_nm") {
        v_global.event.type = param.type;
        v_global.event.object = param.object;
        v_global.event.row = param.row;
        v_global.event.element = param.element;
        v_global.event.popup_data = {
            supp_nm: gw_com_api.getValue("frmOption", 1, "supp_nm")
        }

        var args = {
            type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
            width: 600, height: 450, open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "DLG_SUPPLIER",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectSupplier,
                    data: v_global.event.popup_data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }
}
//----------
function processSave2(param) {

    var qry = {
        query: "SRM_1012_3",
        row: [{
            crud: "U",
            column: param.column
        }]
    };

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [qry],
        nomessage: (param.message != undefined ? true : param.message),
        handler: {
            success: successSave2,
            param: param
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave2(response, param) {

    var per_no = response[0].KEY[0].VALUE;
    var supp_seq = response[0].KEY[1].VALUE;
    processEdit({ per_no: per_no, supp_seq: supp_seq });

}
//----------
function processChk(param) {

    v_global.event.data = param;
    //v_global.event.data.temp_id = "SRM_PER07";

    var args = {
        type: "PAGE", page: "SRM_1023", title: "공지사항",
        width: 1100, height: 560, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "SRM_1023",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
var Query = {
    getPSTAT: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SRM_1022_1" +
                "&QRY_COLS=pstat" +
                "&CRUD=R" +
                "&arg_per_no=" + param.per_no + "&arg_supp_seq=" + param.supp_seq,
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            rtn = data.DATA[0];
        }
        //----------
        return rtn
    },
    getPSTAT2: function (param) {
        var rtn = {};
        var args = {
            request: "PAGE",
            async: false,
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=SRM_1021_9" +
                "&QRY_COLS=pstat,pstat_nm,sysdate,dt_yn,per_pstat,per_pstat_nm,chk_yn1,chk_yn2" +
                "&CRUD=R" +
                "&arg_per_no=" + param.per_no + "&arg_supp_seq=" + param.supp_seq,
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            rtn = {
                pstat: data.DATA[0],
                pstat_nm: data.DATA[1],
                sysdate: data.DATA[2],
                dt_yn: data.DATA[3],
                per_pstat: data.DATA[4],
                per_pstat_nm: data.DATA[5],
                chk_yn1: data.DATA[6],
                chk_yn2: data.DATA[7]
            };
        }
        //----------
        return rtn
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") processSave(param.data.arg);
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processDelete({});
                                else if (status == "update") processRestore({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectSupplier:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_SUPPLIER": {
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        args.data = v_global.event.popup_data;
                    } break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "SRM_BID_DwgDist_View":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.logic.search;
                        break;
                    case "SRM_1023":
                        {
                            args.ID = param.ID;
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
                switch (param.from.page) {
                    case "SRM_1023":
                        {
                            if (param.data != undefined) {
                                processEdit(param.data);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm, (v_global.event.type == "GRID"));
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//