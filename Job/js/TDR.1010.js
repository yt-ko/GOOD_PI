
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
                },
                {
                    type: "PAGE", name: "승인상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "TdrApprYn" }]
                },
                {
                    type: "PAGE", name: "처리상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "TdrSuppYn" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            v_global.logic.tdr_no = gw_com_api.getPageParameter("tdr_no");
            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            if (v_global.logic.mng_yn == "0")
                gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            else
                gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA);
            //----------
            gw_com_module.startPage();
            //----------
            if (v_global.logic.mng_yn == "0") {
                //gw_com_api.hide("lyrMenu", "수정");
                gw_com_api.hide("lyrMenu", "승인");
                //gw_com_api.hide("lyrMenu", "제공");
            }
            else if (v_global.logic.tdr_no != "") {
                gw_com_api.setValue("frmOption", 1, "tdr_no", v_global.logic.tdr_no);
            }
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
                { name: "상세", value: "상세보기", icon: "기타" },
                { name: "추가", value: "신규작성" },
                { name: "복사", value: "재사용", icon: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //args.element.push({ name: "수정", value: "등록관리", icon: "사용자" });
        args.element.push({ name: "승인", value: "승인관리", icon: "사용자" });

        args.element.push({ name: "닫기", value: "닫기" });
        //----------
        gw_com_module.buttonMenu(args);
        //----------
        $("#lyrMenu_복사").attr("title", "과거 기술자료 요청 이력(리스트)과 유사한 또는 동일한 신규 기술자료 요청서를 작성하는 경우\n" +
            "과거 작성리스트에 [재사용] 버튼을 클릭하면 신규 요청서 상에 지정된 과거 작성 내용을 불러오는 기능");
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
                                name: "supp_nm", label: { title: "협력업체명 :" },
                                editable: { type: "text", size: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "tdr_no", label: { title: "요청번호 :" },
                                editable: { type: "text", size: 13 }
                            },
                            {
                                name: "emp_nm", label: { title: "수신자 :" },
                                editable: { type: "text", size: 8 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "rqst_yn", label: { title: "요청상태 :" },
                                editable: { type: "select", size: 7, data: { memory: "요청상태", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "supp_yn", label: { title: "처리상태 :" },
                                editable: { type: "select", size: 7, data: { memory: "처리상태", unshift: [{ title: "전체", value: "%" }] } }
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
            targetid: "grdList_MAIN", query: "TDR_1010_MAIN", title: "현황",
            height: 450, show: true, selectable: true, key: true, dynamic: true, number: true,
            element: [
                { header: "요청번호", name: "tdr_no", width: 100, align: "center" },
                { header: "제목", name: "rqst_title", width: 300 },
                { header: "요청부서", name: "rqst_dept_nm", width: 100 },
                { header: "요청자", name: "rqst_user_nm", width: 60 },
                { header: "요청상태", name: "rqst_yn_nm", width: 60 },
                { header: "제공상태", name: "supp_yn_nm", width: 60 },
                { header: "요청자료", name: "item_cnt", width: 200 },
                { header: "협력업체", name: "supp_nm", width: 150 },
                { header: "수신자", name: "emp_nm", width: 60 },
                { header: "작성일", name: "rqst_dt", width: 140, align: "center", mask: "date-ymd" },
                { header: "승인일", name: "appr_dt", width: 140, align: "center", mask: "date-ymd" },
                { header: "전송일", name: "send_dt", width: 140, align: "center", mask: "date-ymd" },
                { header: "비고(사유)", name: "rmk", width: 600 },
                { name: "tdr_id", hidden: true },
                { name: "rqst_yn", hidden: true },
                { name: "rqst_user", hidden: true },
                { name: "appr_yn", hidden: true },
                { name: "appr_user", hidden: true },
                { name: "supp_id", hidden: true },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
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
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 }
            ]
        };
        //----------
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
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "승인", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "제공", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
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
                case "취소": gw_com_api.hide("frmOption"); break;
                case "상세": processEdit({ auto: true }); break;
                case "추가": processEdit({ add: true }); break;
                    //case "수정": processEdit({ auto: true }); break;
                case "복사": processEdit({ dup: true }); break;
                case "승인": processEdit({ appr: true }); break;
                case "현황": processEdit({ supp: true }); break;
                case "제공": processEdit({ send: true }); break;
                case "삭제": checkRemovable({}); break;
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
                    { name: "emp_nm", argument: "arg_emp_nm" },
                    { name: "tdr_no", argument: "arg_tdr_no" },
                    { name: "supp_nm", argument: "arg_supp_nm" },
                    { name: "rqst_yn", argument: "arg_rqst_yn" },
                    { name: "supp_yn", argument: "arg_supp_yn" }
                ],
                argument: [
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID },
                    { name: "arg_mng_yn", value: v_global.logic.mng_yn }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "rqst_title" }] },
                    { element: [{ name: "emp_nm" }] },
                    { element: [{ name: "tdr_no" }] },
                    { element: [{ name: "supp_nm" }] },
                    { element: [{ name: "rqst_yn" }] },
                    { element: [{ name: "supp_yn" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true, focus: true }
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
    //----------
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "TDR_1020", title: "기술자료 요청등록"
        }
    };
    //----------
    var rqst_user = gw_com_api.getValue("grdList_MAIN", "selected", "rqst_user", true);
    var rqst_yn = gw_com_api.getValue("grdList_MAIN", "selected", "rqst_yn", true);
    var appr_user = gw_com_api.getValue("grdList_MAIN", "selected", "appr_user", true);
    var supp_cd = gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true);

    if (param.auto) {

        if (rqst_user == gw_com_module.v_Session.USR_ID
            && (rqst_yn == "" || rqst_yn == "-" || rqst_yn == "R" || rqst_yn == "C" || rqst_yn == "0")) // 본인 작성중, 반려, 회수, 승인대기
        {
            processEdit({ edit: true });
            return;
        }
        else if ((rqst_yn == "0" || rqst_yn == "R") && appr_user == gw_com_module.v_Session.USR_ID) // 본인 승인자
        {
            processEdit({ appr: true });
            return;
        } else if (v_global.logic.mng_yn == "1") // 관리자용
        {
            if (rqst_yn == "0" || rqst_yn == "R") // 승인대기, 반려
                processEdit({ appr: true });
            else if (rqst_yn == "" || rqst_yn == "-" || rqst_yn == "C" || supp_cd == "") // 작성중, 회수, 요청승인 이전
                processEdit({ edit: true });
            else
                processEdit({ view: true });

            return;
        }
        else {
            if (supp_cd == "")
                gw_com_api.messageBox([{ text: "다른 사용자가 요청한 승인 이전의 정보는 볼 수 없습니다." }]);
            else
                processEdit({ view: true });
            return;
        }
    } else if (param.edit) {

        args.data.title = "기술자료 요청등록";
        args.data.param = [
            { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) },
            { name: "tdr_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true) }
        ];

    }
    else if (param.appr) {

        args.data.page = "TDR_1022";
        args.data.title = "기술자료 요청승인";
        args.data.param = [
            { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) },
            { name: "tdr_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true) },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID }
        ];

    } else if (param.view) {
        args.data.page = "TDR_1025";
        args.data.title = "기술자료 요청상세";
        args.data.param = [
            { name: "AUTH", value: "R" },
            { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) },
            { name: "tdr_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true) },
            { name: "supp_cd", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true) }
        ];

    } else if (param.dup) {

        args.data.title = "기술자료 요청등록";
        args.data.param = [
            { name: "dup_yn", value: "true" },
            { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) },
            { name: "tdr_no", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_no", true) }
        ];

    } else if (param.supp) {

        args.data.page = "TDR_1030";
        args.data.title = "기술자료 제공현황";
        args.data.param = [
            { name: "test_yn", value: "true" },
            { name: "user_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true) }
        ];

    } else if (param.send) {

        args.data.page = "TDR_1040";
        args.data.title = "기술자료 제공등록";
        args.data.param = [
            { name: "test_yn", value: "true" },
            { name: "tdr_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "tdr_id", true) },
            { name: "supp_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_id", true) },
            { name: "user_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_cd", true) }
        ];

    }
    //----------
    if (args.data.page == "TDR_1020" && checkSubUpdatable({ page: "TDR_1020" }) && param.chk == undefined) {
        var p = {
            handler: function (param) {
                if (param.result == "YES") {
                    var args = { menu_id: "TDR_1020", frame: true };
                    gw_com_api.launchMenu(args);
                }
                else {
                    var args = param;
                    args.chk = "NO";
                    processEdit(args);
                }
            },
            param: param
        };
        gw_com_api.messageBox([
            { text: "저장되지 않은 요청등록 정보가 있습니다." },
            { text: "기존 작업 정보를 유지하시겠습니까?" },
            { text: "&nbsp;" },
            { text: "[예]: 기존 작업 정보 보존, [아니오]: 기존 작업 정보 무시" }
        ], 450, gw_com_api.v_Message.msg_confirmSave, "YESNO", p);
        return;
    }
    //----------
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
function checkSubUpdatable(param) {

    var frm = gw_com_api.getFrameByName(tap.frames, "page_" + param.page);
    if (frm == undefined) return false;
    if (frm.checkUpdatable2 == undefined) return false;
    return rm.checkUpdatable2({});

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