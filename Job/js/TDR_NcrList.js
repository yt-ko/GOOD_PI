
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Development Description
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// TDR_1010 과 TDR_1050 은 Source 공유함
// v_global.logic.mng_yn 의 값만 변경하여 사용
// 데이터 관리 기능 여부 : TDR_1010 = 0, TDR_1015=1

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 데이터 관리 기능 여부 : TDR_1010 = 0, TDR_1015=1
        v_global.logic.mng_yn = "0";

        // prepare dialogue. ---NCR 기술자료 요청내역
        var args = {
            type: "PAGE", page: "TDR_NcrAgree", title: "요청내역 및 자료제공 동의", width: 800, height: 700,
            locate: { my: "center top", at: "center top" }   //,of:"#content"
        };
        gw_com_module.dialoguePrepare(args);

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                {
                    type: "PAGE", name: "요청상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "TdrRqstYn" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //----------
            gw_com_module.startPage();
            processRetrieve({});

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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "상세", value: "상세보기", icon: "기타" }
            ]
        };
        args.element.push({ name: "닫기", value: "닫기" });
        gw_com_module.buttonMenu(args);
        //----------
        //$("#lyrMenu_복사").attr("title", "과거 기술자료 요청 이력(리스트)과 유사한 또는 동일한 신규 기술자료 요청서를 작성하는 경우\n" +
        //    "과거 작성리스트에 [재사용] 버튼을 클릭하면 신규 요청서 상에 지정된 과거 작성 내용을 불러오는 기능");
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "NCR발행일 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rqst_no", label: { title: "NCR발행번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "supp_nm", label: { title: "협력업체 :" },
                                editable: { type: "text", size: 12 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rmk", label: { title: "발행하자 :" },
                                editable: { type: "text", size: 30 }
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
            targetid: "grdList_MAIN", query: "TDR_NcrList_M", title: "NCR 요청현황",
            height: 600, show: true, selectable: true, key: true, dynamic: true, number: true,
            element: [
				{ header: "관리번호", name: "issue_no", width: 70, align: "center" },
				{ header: "NCR발행번호", name: "rqst_no", width: 80, align: "center" },
				{ header: "NCR발행일", name: "astat_date", width: 70, align: "center" },
				{ header: "협력업체명", name: "supp_nm", width: 120 },
				{ header: "요청자", name: "astat_user", width: 60, align: "center" },
				{ header: "진행상태", name: "pstat", width: 60, align: "center", editable: { type: "hidden" } },
				{ header: "자료제공동의일", name: "agree_dt", width: 90, align: "center", mask: "date-ymd" },
				{ header: "발생하자", name: "rmk", width: 300 },
                { name: "prod_key", hidden: true },
                { name: "supp_cd", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE", query: "TDR_1010_FILE", title: "첨부 파일",
            caption: true, height: 100, pager: true, show: false, number: true, selectable: true,
            element: [
                { header: "분류", name: "item_group_nm", width: 80, align: "center" },
                { header: "자료명", name: "item_nm", width: 250 },
                { header: "파일명", name: "file_nm", width: 250 },
                { header: "파일설명", name: "file_desc", width: 250 },
                { header: "등록일시", name: "upd_dt", width: 160, align: "center" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { header: "data_tp", hidden: true },
                { header: "data_key", hidden: true },
                { header: "data_subkey", hidden: true },
                { header: "data_seq", hidden: true },
                { header: "data_subkey", hidden: true },
                { name: "file_id", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "grdList_FILE", grid: true, element: "download", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //====================================================================================
        function processClick(param) {

            switch (param.element) {

                case "조회":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "상세": processEdit({ auto: true }); break;
                case "닫기": processClose({}); break;
                case "실행": processRetrieve({}); break;
                case "download":
                    {
                        gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown" });
                    }
                    break;
            }

        }
        //----------
        function processRowdblclick(param) {

            processEdit({ auto: true });

        }
        //====================================================================================

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    if (param.object == "grdList_MAIN") {
        return;
        var args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "tdr_id", argument: "arg_tdr_id" }
                ],
                argument: [
                    { name: "arg_item_id", value: "0" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_FILE", select: true }
            ]
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        var args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "rqst_no", argument: "arg_rqst_no" },
                    { name: "supp_nm", argument: "arg_supp_nm" },
                    { name: "rmk", argument: "arg_rmk" }
                ],
                argument: [
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "rqst_no" }] },
                    { element: [{ name: "supp_nm" }] },
                    { element: [{ name: "rmk" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: false, focus: false }
            ],
            clear: [
                { type: "GRID", id: "grdList_FILE" }
            ]
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
            v_global.event.row,
            v_global.event.element,
            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function processBatch(param) {

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_TDR_Request",
        input: [
            { name: "JobCd", value: param.act, type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true), type: "int" },
            { name: "RootNo", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true), type: "varchar" },
            { name: "Option", value: "", type: "varchar" }
        ],
        output: [
            { name: "Rmsg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: {}
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "TDR_1020", title: "기술자료 제공요청",
            param: [
                { name: "dup_yn", value: "true" },
                { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) }
            ]
        }
    };

    gw_com_module.streamInterface(args);
}
//----------
function processEdit(param) {

    if (param.view || param.edit || param.dup || param.appr) {

        if (gw_com_api.getSelectedRow("grdList_MAIN") == null) {
            gw_com_api.messageBox([{ text: "NODATA" }]);
            return;
        }

    }
    // 요청상세 및 기술자료제공 동의
    var sRqstNo = gw_com_api.getValue("grdList_MAIN", "selected", "rqst_no", true);
    var sSuppCd = gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true);
    var args = {
        page: "TDR_NcrAgree",
        param: {
            ID: gw_com_api.v_Stream.msg_openDialogue,
            data: { rqst_no: sRqstNo, supp_cd: sSuppCd, chk_agree: false }
        }
    };
    gw_com_module.dialogueOpen(args);


}
//----------
function checkRemovable(param) {

    if (gw_com_api.getSelectedRow("grdList_MAIN") == null) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }
    gw_com_api.messageBox([
        { text: "REMOVE" }
    ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRemove(param) {

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_TDR_Request",
        input: [
            { name: "JobCd", value: "Delete", type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true), type: "int" },
            { name: "RootNo", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true), type: "varchar" },
            { name: "Option", value: "", type: "varchar" }
        ],
        output: [
            { name: "Rmsg", type: "varchar" }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successRemove(response, param) {

    if (response.VALUE[0] != "") {

        var msg = new Array();
        $.each(response.VALUE[0].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);

    }
    var key = [{
        QUERY: $("#grdList_MAIN" + "_data").attr("query"),
        KEY: [
            { NAME: "tdr_id", VALUE: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) }
        ]
    }];
    processRetrieve({ key: key });

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_refreshPage:
            {
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
            //==== When Dialogue Winddow is Opened
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = { to: { type: "POPUP", page: param.from.page }, ID: gw_com_api.v_Stream.msg_openDialogue };

            switch (param.from.page) {
                case "DLG_FileUpload":
                    args.data = v_global.logic.FileUp;
                    break;
                default: return;
            }
            gw_com_module.streamInterface(args);
        } break;
        //==== When Dialogue Winddow is Closed
        case gw_com_api.v_Stream.msg_closeDialogue: {
            switch (param.from.page) {
                case "TDR_NcrAgree":
                    break;
                case "w_add_NCR_emp":
                    if (param.data != undefined)
                        processRetrieve({ key: v_global.logic.key });
                    break;
            }
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_confirmSave:
                    {
                        if (param.data.arg.handler != undefined) {
                            if (param.data.arg.param == undefined)
                                param.data.arg.handler();
                            else {
                                var args = param.data.arg.param;
                                args.result = param.data.result;
                                param.data.arg.handler(args);
                            }
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
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//