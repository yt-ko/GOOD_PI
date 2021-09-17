//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입찰/견적기록
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            v_global.logic.per_no = gw_com_api.getPageParameter("per_no");
            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "새로고침", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_PER", query: "SRM_1012_1", type: "TABLE", title: "입찰/견적 의뢰서",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 80, field: 150 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "의뢰번호", format: { type: "label" } },
                            { name: "per_no", align: "center" },
                            { header: true, value: "<font style='font-weight:bold'>접수시작</font>", format: { type: "label" } },
                            {
                                name: "open_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 64 }
                            },
                            {
                                name: "open_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { type: "text", width: 30 }
                            },
                            { header: true, value: "<font style='font-weight:bold'>접수마감</font>", format: { type: "label" } },
                            {
                                name: "close_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 64 }
                            },
                            {
                                name: "close_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { type: "text", width: 30 }
                            },
                            { name: "per_term", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목(입찰명)", format: { type: "label" } },
                            { name: "per_title", style: { colspan: 3 }, format: { type: "text", width: 628 } },
                            { header: true, value: "<font style='font-weight:bold'>의뢰일자</font>", format: { type: "label" } },
                            { name: "per_date", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "<font style='font-weight:bold'>의뢰구분</font>", format: { type: "label" } },
                            { name: "per_type_nm2", style: { colspan: 3 } },
                            { name: "per_type_nm", hidden: true },
                            { name: "per_type", hidden: true },
                            { name: "bid_type_nm", hidden: true },
                            { name: "bid_type", hidden: true },
                            { header: true, value: "<font style='font-weight:bold'>구매담당</font>", format: { type: "label" } },
                            { name: "per_man" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "의뢰상태", format: { type: "label" } },
                            { name: "pstat_nm" },
                            { name: "pstat", hidden: true },
                            { header: true, value: "사업기간", format: { type: "label" } },
                            {
                                name: "fr_date", mask: "date-ymd", style: { colfloat: "float" },
                                format: { type: "text", width: 62 }
                            },
                            { value: "~", format: { type: "label" }, style: { colfloat: "floating" } },
                            {
                                name: "to_date", mask: "date-ymd", style: { colfloat: "floated" },
                                format: { type: "text", width: 62 }
                            },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            { name: "per_email" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상태변경일", format: { type: "label" } },
                            { name: "pdate", format: { type: "text", width: 240 }, display: true },
                            { header: true, value: "낙찰자선정방식", format: { type: "label" } },
                            { name: "bid_choice" },
                            { header: true, value: "TEL", format: { type: "label" } },
                            { name: "per_telno" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "인도조건", format: { type: "label" } },
                            { name: "dlv_rmk" },
                            { header: true, value: "결제방법", format: { type: "label" } },
                            { name: "settle_rmk_nm" },
                            { name: "settle_rmk", hidden: true },
                            { header: true, value: "사업예산", format: { type: "label" } },
                            { name: "bid_budget", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "비고", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "per_rmk",
                                format: { type: "textarea", rows: 2, width: 1012, maxlength: 150 }
                            },
                            { name: "per_doc", hidden: true },
                            { name: "per_comp", hidden: true },
                            { name: "per_faxno", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PER_SUPP", query: "SRM_1012_3", title: "의뢰 협력사",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
				{ header: "협력사", name: "supp_nm", width: 100 },
				{ header: "수신인", name: "supp_man", width: 70 },
                { header: "E-Mail 1", name: "supp_email1", width: 150 },
                { header: "TEL", name: "supp_telno", width: 90 },
                { header: "FAX", name: "supp_faxno", width: 60, hidden: true },
                { header: "전송방법", name: "send_tp", width: 60, align: "center" },
                { header: "진행상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "상태변경일", name: "pdate", width: 150, align: "center", hidden: true },
                { header: "E-Mail 2", name: "supp_email2", width: 150 },
                { header: "전송비고", name: "send_rmk", width: 180 },
                { header: "제출차수", name: "rpt_seq", width: 50, align: "center" },
                { name: "per_no", hidden: true },
                { name: "supp_seq", hidden: true },
                { name: "supp_cd", hidden: true },
                { name: "pstat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PER_ITEM", query: "SRM_1090_1", title: "의뢰 품목 및 제출이력",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
				{ header: "품번", name: "item_cd", width: 120, align: "center" },
				{ header: "품명", name: "item_nm", width: 200 },
				{ header: "품목사양", name: "item_spec", width: 200 },
				{ header: "수량", name: "qty", width: 60, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "uom", width: 50, align: "center" },
				{ header: "통화", name: "curr_cd", width: 50, align: "center", hidden: true },
                { header: "납기일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd", hidden: true },
                { header: "1차단가", name: "rpt_price1", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt1", width: 120, align: "center", hidden: false },
                { header: "2차단가", name: "rpt_price2", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt2", width: 120, align: "center", hidden: false },
                { header: "3차단가", name: "rpt_price3", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt3", width: 120, align: "center", hidden: false },
                { header: "4차단가", name: "rpt_price4", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt4", width: 120, align: "center", hidden: false },
                { header: "5차단가", name: "rpt_price5", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt5", width: 120, align: "center", hidden: false },
                { header: "6차단가", name: "rpt_price6", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt6", width: 120, align: "center", hidden: false },
                { header: "7차단가", name: "rpt_price7", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt7", width: 120, align: "center", hidden: false },
                { header: "8차단가", name: "rpt_price8", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt8", width: 120, align: "center", hidden: false },
                { header: "9차단가", name: "rpt_price9", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt9", width: 120, align: "center", hidden: false },
                { header: "10차단가", name: "rpt_price10", width: 70, align: "right", mask: "numeric-int", hidden: false },
                { header: "제출일시", name: "rpt_dt10", width: 120, align: "center", hidden: false },
                { name: "item_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdData_PER_ITEM_data").parents('div.ui-jqgrid-bdiv').css("max-height", "300px");
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE", query: "SRM_1090_2", title: "첨부파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "차수", name: "rpt_seq", width: 30, align: "center", mask: "numeric-int" },
				{ header: "파일명", name: "file_nm", width: 250 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 300 },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true },
                { name: "data_tp", hidden: true }
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
				{ type: "FORM", id: "frmData_PER", offset: 8 },
                { type: "GRID", id: "grdList_PER_SUPP", offset: 8 },
				{ type: "GRID", id: "grdList_PER_ITEM", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_PER_SUPP", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            {
                processRetrieve({});
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
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_PER_SUPP") {
        //=====================================================================================
        var rpt_seq = Number(gw_com_api.getValue(param.object, param.row, "rpt_seq", true));
        for (var i = 1; i <= 10; i++) {
            if (i <= rpt_seq) {
                gw_com_api.showCols("grdList_PER_ITEM", "rpt_price" + i);
                gw_com_api.showCols("grdList_PER_ITEM", "rpt_dt" + i);
            } else {
                gw_com_api.hideCols("grdList_PER_ITEM", "rpt_price" + i);
                gw_com_api.hideCols("grdList_PER_ITEM", "rpt_dt" + i);
            }
        }
        var args = {
            target: [
				{ type: "GRID", id: "grdList_PER_ITEM", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        args = {
            source: {
                type: "GRID", id: param.object, row: param.row,
                element: [
                    { name: "per_no", argument: "arg_per_no" },
                    { name: "supp_seq", argument: "arg_supp_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_PER_ITEM" },
                { type: "GRID", id: "grdList_FILE" }
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_per_no", value: v_global.logic.per_no }
                ],
            },
            target: [
                { type: "FORM", id: "frmData_PER" },
                { type: "GRID", id: "grdList_PER_SUPP", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_PER_ITEM" },
                { type: "GRID", id: "grdList_FILE" }
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

    if (v_global.logic.per_no == undefined || v_global.logic.per_no == "") return;
    var args = {
        type: gw_com_api.getValue(param.object, param.row, "data_tp", true) == "PER" ? "FILEDOWN1" : "FILEDOWN2",
        per_no: v_global.logic.per_no
    };
    if (checkDownload(args)) {
        var args = {
            source: { id: param.object, row: param.row },
            targetid: "lyrDown"
        };
        gw_com_module.downloadFile(args);
    } else {
        gw_com_api.messageBox([{ text: "접수기간 중에는 파일을 다운로드할 수 없습니다." }]);
    }

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
function checkDownload(param) {

    var rtn = false;
    $.ajax({
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
        "?QRY_ID=SRM_1032_8" +
        "&QRY_COLS=file_auth" +
        "&CRUD=R" +
        "&arg_type=" + param.type +
        "&arg_per_no=" + param.per_no +
        "&arg_seq=0",
        type: 'post',
        cache: false,
        async: false,
        data: "{}",
        success: function (data, status) {
            var response = JSON.parse(data);
            if (response.iCode == 0)
                rtn = response.tData[0].DATA[0] == "1" ? true : false;
        }
    });
    return rtn;

}
//----------
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
                            if (param.data.result == "YES")
                                processSave(param.data.arg);
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
        case gw_com_api.v_Stream.msg_processedDialogue:
            {
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//