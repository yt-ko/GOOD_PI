
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


        // Get Page Parameters
        v_global.logic.step = gw_com_api.getPageParameter("step");
        // 데이터 관리 기능 여부
        v_global.logic.mng_yn = "0";

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "findBizDept", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                { type: "PAGE", name: "dddwGmsRqst", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "GmsRqst" }] },
                { type: "PAGE", name: "dddwGmsAcpt", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "GmsAcpt" }] },
                { type: "PAGE", name: "dddwGmsWork", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "GmsWork" }] },
                { type: "PAGE", name: "dddwGmsLevel", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "SYS071" }] },
                { type: "PAGE", name: "dddwBizDept", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "ISCM81" }] },
                { type: "PAGE", name: "dddwSysMod", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "SysMod" }] },
                { type: "PAGE", name: "dddwSysFun", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "SysMod" }] },
                { type: "INLINE", name: "dddwGmsWork", data: [{ title: "조정재", value: "GoodJJJ" }, { title: "곽연희", value: "GoodYHG" }] },
                {
                    type: "INLINE", name: "dddwRqstYn"
                    , data: [{ title: "전체", value: "%" }, { title: "미요청", value: "N" }, { title: "진행", value: "S" }
                        , { title: "완료", value: "E" }, { title: "보류", value: "H" }, { title: "취소", value: "C" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            // act : Request, Accept, Check, Work, Manage, View
            v_global.logic.step = gw_com_api.getPageParameter("step");
            if (v_global.logic.step == "") v_global.logic.step = "R";
            // key : rqst_no, Copy
            v_global.logic.key = gw_com_api.getPageParameter("key");

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            if (v_global.logic.step == "R")
                gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            else
                gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "biz_dept", gw_com_module.v_Session.DEPT_AREA);
            //----------
            gw_com_module.startPage();
            processRetrieve({});
        }

    },
    //#endregion

    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "신규작성" },
                { name: "상세", value: "상세보기", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
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
                                name: "ymd_fr", label: { title: "작성일 :" }, mask: "date-ymd", style: { colfloat: "floating" },
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
                                name: "rqst_title", label: { title: "제목 :" },
                                editable: { type: "text", size: 25 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rqst_no", label: { title: "요청번호 :" },
                                editable: { type: "text", size: 13 }
                            },
                            {
                                name: "user_nm", label: { title: "요청자 :" },
                                editable: { type: "text", size: 8 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rqst_yn", label: { title: "진행상태 :" },
                                editable: { type: "select", size: 7, data: { memory: "dddwGmsRqstYnd", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "biz_dept", label: { title: "사업부 :" },
                                editable: { type: "select", size: 7, data: { memory: "findBizDept", unshift: [{ title: "전체", value: "%" }] } }
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
            targetid: "grdList_MAIN", query: "SYS_GMS_ListA", title: "현황",
            height: 450, show: true, selectable: true, key: true, dynamic: true, number: true,
            element: [
                { header: "요청번호", name: "rqst_no", width: 100, align: "center" },
                { header: "제목", name: "rqst_title", width: 300 },
                { header: "요청자", name: "rqst_user_nm", width: 60 },
                { header: "요청구분", name: "rqst_cd", width: 90, format: { type: "select", data: { memory: "dddwGmsRqst" } } },
                { header: "중요도", name: "level_cd", width: 60, format: { type: "select", data: { memory: "dddwGmsRqst" } } },
                { header: "진행상태", name: "rqst_yn_nm", width: 60 },
                { header: "접수구분", name: "acpt_cd", width: 100, format: { type: "select", data: { memory: "dddwGmsRqst" } } },
                { header: "사업부", name: "biz_dept", width: 90, format: { type: "select", data: { memory: "dddwBizDept" } } },
                { header: "담당자", name: "acpt_user_nm", width: 60 },
                { header: "요청일시", name: "str_dt", width: 120, align: "center", mask: "date-ymd" },
                { header: "완료요구일", name: "due_ymd", width: 90, align: "center", mask: "date-ymd" },
                { header: "완료예정일", name: "plan_ymd", width: 90, align: "center", mask: "date-ymd" },
                { header: "완료일", name: "end_dt", width: 120, align: "center", mask: "date-ymd" },
                { header: "작성자", name: "ins_usr_nm", width: 60 },
                { header: "작성일시", name: "ins_dt", width: 120 },
                { header: "요청 메모", name: "rqst_rmk", width: 400 },
                { header: "담당 메모", name: "acpt_rmk", width: 400 },
                { name: "rqst_yn", hidden: true },
                { name: "rqst_user", hidden: true },
                { name: "acpt_user", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        //====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
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

        //====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
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
        //var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processRowdblclick };
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
                case "취소": gw_com_api.hide("frmOption"); break;
                case "상세": processEdit({ key: "row" }); break;
                case "추가": processEdit({ key: "New" }); break;
                case "닫기": processClose({}); break;
                case "실행": processRetrieve({}); break;
                    break;
            }

        }
        //----------
        function processRowdblclick(param) {

            processEdit({ key: "row" });

        }
        //====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {


    if (param.object == "grdList_MAIN") {

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
                    { name: "rqst_title", argument: "arg_rqst_title" },
                    { name: "user_nm", argument: "arg_user_nm" },
                    { name: "rqst_no", argument: "arg_rqst_no" },
                    { name: "biz_dept", argument: "arg_biz_dept" },
                    { name: "rqst_yn", argument: "arg_rqst_yn" }
                ],
                argument: [
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID },
                    { name: "arg_step", value: v_global.logic.step }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "rqst_title" }] },
                    { element: [{ name: "user_nm" }] },
                    { element: [{ name: "rqst_no" }] },
                    { element: [{ name: "biz_dept" }] },
                    { element: [{ name: "rqst_yn" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true, focus: true }
            ]
            //,
            //clear: [
            //    { type: "GRID", id: "grdList_FILE" }
            //]
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
            page: "GMS_RequestEdit", title: "요청등록",
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

    var key = (param.key == "row") ? gw_com_api.getValue("grdList_MAIN", "selected", "rqst_no", true) : param.key;
    if (key == "") return;

    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "GMS_RequestEdit", title: "Help Service 요청"
        }
    };
    //----------);
    args.data.param = [
        { name: "step", value: v_global.logic.step },
        { name: "key", value: key }
    ];
    gw_com_module.streamInterface(args);

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
        procedure: "sp_GMS_Request",
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