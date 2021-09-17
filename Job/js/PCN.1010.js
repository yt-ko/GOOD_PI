//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
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
        v_global.logic.supp_yn = (gw_com_module.v_Session.USER_TP == "SUPP" || gw_com_module.v_Session.USER_TP == "" || gw_com_module.v_Session.USER_TP == undefined ? true : false);

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "변경구분",
                    data: [
                        { title: "작업자", value: "작업자" },
                        { title: "설비", value: "설비" },
                        { title: "재료", value: "재료" },
                        { title: "작업방법", value: "작업방법" },
                        { title: "기타", value: "기타" }
                    ]
                },
                {
                    type: "INLINE", name: "요청구분",
                    data: [
                        { title: "변경검증", value: "변경검증" },
                        { title: "단순공유", value: "단순공유" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            if (v_global.logic.supp_yn) {

                v_global.logic.supp_cd = gw_com_module.v_Session.EMP_NO;
                v_global.logic.supp_nm = gw_com_module.v_Session.USR_NM;

            } else {

                ////----------
                //var args = {
                //    request: "DATA",
                //    name: "PCN_1010_1_OPTION",
                //    url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                //        "?QRY_ID=PCN_1010_1_OPTION" +
                //        "&QRY_COLS=supp_cds,supp_nm" +
                //        "&CRUD=R",
                //    async: false,
                //    handler_success: successRequest
                //};
                ////----------
                //gw_com_module.callRequest(args);
                ////----------
                //function successRequest(type, name, data) {

                //    if (data.DATA.length >= 0) {
                //        v_global.logic.supp_cd = data.DATA[0];
                //        v_global.logic.supp_nm = data.DATA[1];
                //    } else {
                        v_global.logic.supp_cd = "";
                        v_global.logic.supp_nm = "";
                //    }

                //}
                ////----------

            }
            gw_com_api.setValue("frmOption", 1, "supp_cd", v_global.logic.supp_cd);
            gw_com_api.setValue("frmOption", 1, "supp_nm", v_global.logic.supp_nm);
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "수정", value: "수정", icon: "추가" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "실행", value: "새로고침", icon: "Act" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "요청", value: "검토요청", icon: "기타" },
                { name: "취소", value: "요청취소", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", query: "PCN_1010_1_OPTION", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, margin_top: 70,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        if (v_global.logic.supp_yn) {
            args.content.row[0].element.push(
                {
                    name: "supp_nm", label: { title: "협력사명 :" }, mask: "search",
                    editable: { type: "text", size: 18, maxlength: 50 }, hidden: true
                },
                { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                { name: "dept_area", hidden: true, editable: { type: "hidden" } }
            );
        } else {
            args.content.row.push({
                element: [
                    {
                        name: "dept_area", label: { title: "장비군 :" },
                        editable: { type: "select", data: { memory: "DEPT_AREA_IN", unshift: (gw_com_module.v_Session.DEPT_AUTH == "ALL" ? [{ title: "전체", value: "" }] : []) } }
                    },
                    {
                        name: "supp_nm", label: { title: "협력사명 :" }, mask: "search",
                        editable: { type: "text", size: 14 }
                    },
                    { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                ]
            });
        }
        args.content.row.push({
            element: [
                { name: "실행", value: "실행", act: true, format: { type: "button" } },
                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
            ], align: "right"
        });
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "PCN_1010_1", title: "변경점 승인 요청 현황",
            caption: false, height: 420, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "관리번호", name: "issue_no", width: 80, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 60 },
                { header: "협력사명", name: "comp_nm", width: 100, hidden: v_global.logic.supp_yn },
                { header: "작성일", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "진행상태", name: "pstat", width: 50, align: "center", hidden: v_global.logic.supp_yn },
                { header: "진행상태", name: "pstat2", width: 50, align: "center", hidden: !v_global.logic.supp_yn },
                { header: "요청자", name: "rqst_user_nm", width: 50, align: "center" },
                { header: "E-Mail", name: "rqst_user_email", width: 100 },
                { header: "제목", name: "issue_title", width: 250 },
                { header: "품번", name: "item_cd", width: 80, align: "center" },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "완료예정일", name: "plan_dt", width: 80, align: "center", mask: "date-ymd" },
                { name: "astat", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        createDW({});
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO1", query: "PCN_1010_2", type: "TABLE", title: "내용(변경 전)",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                              { name: "chg_memo1", format: { type: "html", height: 370, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO2", query: "PCN_1010_2", type: "TABLE", title: "내용(변경 후)",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 370,
                row: [
                    {
                        element: [
                              { name: "chg_memo2", format: { type: "html", height: 370, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUB", query: "PCN_1030_2", type: "TABLE", title: "Wonik IPS 검토결과",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 44, field: 56 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "접수일", format: { type: "label" } },
                          { name: "act_dt", mask: "date-ymd", format: { type: "text", width: 200 } },
                          { header: true, value: "접수자", format: { type: "label" } },
                          { name: "act_user_nm", format: { type: "text", width: 200 } },
                          { name: "act_user", hidden: true },
                          { header: true, value: "완료예정일", format: { type: "label" } },
                          { name: "plan_dt", format: { type: "text", width: 200 }, mask: "date-ymd" },
                          { header: true, value: "승인자", format: { type: "label" } },
                          { name: "appr_user_nm", format: { type: "text", width: 200 } }
                        ]
                    },
                    {
                        element: [
                          { header: true, value: "검토일", format: { type: "label" } },
                          { name: "exam_dt", mask: "date-ymd", format: { type: "text", width: 200 } },
                          { header: true, value: "검토자", format: { type: "label" } },
                          { name: "exam_user_nm", format: { type: "text", width: 200 } },
                          { name: "exam_user", hidden: true },
                          { header: true, value: "판정", format: { type: "label" } },
                          { name: "exam_result", format: { type: "text", width: 200 } },
                          { header: true, value: "승인일", format: { type: "label" } },
                          { name: "appr_date", format: { type: "text", width: 200 }, mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                          { header: true, value: "검토결과", format: { type: "label" } },
                          {
                              name: "exam_rmk", style: { colspan: 7 },
                              format: { type: "textarea", rows: 4, width: 996 }
                          },
                          { name: "issue_no", hidden: true },
                          { name: "act_seq", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //2021-05-18 by KYT
        var args = {
            targetid: "grdData_FILE", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                //{ header: "파일명", name: "file_nm", width: 250, align: "left" },
                //{ header: "등록부서", name: "upd_dept", width: 100, align: "center" },
                //{ header: "등록자", name: "upd_usr", width: 60, align: "center" },
                //{
                //    header: "다운로드", name: "download", width: 60, align: "center",
                //    format: { type: "link", value: "다운로드" }
                //},
                //{
                //    header: "파일설명", name: "file_desc", width: 380, align: "left",
                //    editable: { type: "text" }
                //},
                //{ name: "file_ext", hidden: true },
                //{ name: "file_path", hidden: true },
                //{ name: "network_cd", hidden: true },
                //{ name: "data_tp", hidden: true },
                //{ name: "data_key", hidden: true },
                //{ name: "data_seq", hidden: true },
                //{ name: "file_id", hidden: true, editable: { type: "hidden" } }

                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 450, align: "left", editable: { type: "text" } },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                //{ name: "data_subkey", hidden: true },
                //{ name: "data_subseq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }

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
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                //{ type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "FORM", id: "frmData_MEMO2", offset: 8 },
                //{ type: "FORM", id: "frmData_MEMO3", offset: 8 },
                { type: "FORM", id: "frmData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "요청현황" },
                { type: "LAYER", id: "lyrTab_2", title: "요청등록" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 }
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
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "요청", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MEMO1", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO1", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO2", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            v_global.process.handler = processRetrieve;
            if (!checkUpdatable({})) return;
            processRetrieve(param);
            break;
        case "추가":
            processInsert(param);
            break;
        case "수정":
            processEdit(param);
            break;
        case "삭제":
            processDelete(param);
            break;
        case "저장":
            processSave({});
            break;
        case "요청":
        case "취소":
            processStat(param);
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processTabChange(param) {

    closeOption({});

}
//----------
function processEdit(param) {

    v_global.process.handler = processRetrieve;
    if (!checkUpdatable({})) return;
    processRetrieve(param);

}
//----------
function processStat(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    if ($.inArray(gw_com_api.getValue("frmData_MAIN", 1, "astat"), ["", "작성", "요청"]) == -1) {
        var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
        gw_com_api.messageBox([{
            text: "[" + pstat + "] 상태이므로 " +
                (param.element == "요청" ? "승인요청" : "요청취소") + "할 수 없습니다."
        }]);
        return;
    }
    if (param.element == "요청") {
        gw_com_api.setValue("frmData_MAIN", 1, "astat", "요청");
        gw_com_api.setValue("frmData_MAIN", 1, "pstat", "요청");
        param.mail = {
            type: "PCN-RQST",
            key_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no")
        };
    } else {
        gw_com_api.setValue("frmData_MAIN", 1, "astat", "작성");
        gw_com_api.setValue("frmData_MAIN", 1, "pstat", "작성");
        param.mail = {
            type: "PCN-RQST-CANCEL",
            key_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no")
        };
    }
    gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
    processSave(param);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN") {
        if (param.element == "item_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "item_cd", "");
            //if (gw_com_api.getCRUD("frmData_MAIN") == "retrieve") gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
        }
    } else if (param.object == "frmData_MEMO3") {
        gw_com_api.setValue("frmData_MAIN", param.row, param.element, param.value.current);
        if (gw_com_api.getCRUD("frmData_MAIN") == "retrieve") gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
    } else if (param.object == "frmOption") {
        if (param.element == "supp_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "supp_cd", "");
        }
    }

}
//----------
function processItemdblclick(param) {

    if (!checkEditable({})) return;
    if (!checkManipulate({})) return;
    if (!checkStat({})) return;
    if ($.inArray(param.element, ["chg_memo1", "chg_memo2"]) >= 0) {
        if (param.element == "chg_memo1") {
            v_global.logic.memo = "내용(변경 전)";
        } else {
            v_global.logic.memo = "내용(변경 후)";
        }
        processMemo({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });
    } else if (param.element == "item_cd") {
        var args = {
            type: "PAGE", page: "PCN_1011", title: "품목",
            width: 600, height: 350, locate: ["center", 100], open: true,
            id: gw_com_api.v_Stream.msg_openedDialogue,
            data: {
                supp_cd: v_global.logic.supp_cd
            }
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = { page: args.page, param: { ID: args.id, data: args.data } };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//2021-05-18 by KYT
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "PCN" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FILE" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? "%" : param.data_key) },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? -1 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? -1 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "frmOption") {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "supp_cd", argument: "arg_comp_cd" },
                    { name: "dept_area", argument: "arg_dept_area" }
                ],
                //remark: [
                //    { element: [{ name: "work_ym" }] },
                //    //{ element: [{ name: "emp_no" }] },
                //    { element: [{ name: "emp_nm" }] }
                //]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" },
                { type: "FORM", id: "frmData_SUB" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            key: param.key
        };
    } else {
        createDW({ astat: gw_com_api.getValue("grdList_MAIN", "selected", "astat", true) });
        args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "issue_no", argument: "arg_issue_no" },
                    { name: "issue_no", argument: "arg_data_key" }
                ],
                argument: [
                    { name: "arg_data_seq", value: -1 }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN", edit: true },
                { type: "FORM", id: "frmData_MEMO1", edit: true },
                { type: "FORM", id: "frmData_MEMO2", edit: true },
                { type: "FORM", id: "frmData_MEMO3" },
                { type: "FORM", id: "frmData_SUB" }
                /*{ type: "GRID", id: "grdData_FILE" }*/
            ],
            handler: {
                complete: processRetrieveEnd,
                param: param
            },
            key: param.key
        };
        gw_com_api.selectTab("lyrTab", 2);

    }
    gw_com_module.objRetrieve(args);
    processFileList({ data_key: gw_com_api.getValue("frmData_MAIN", 1, "issue_no") });
}
//----------
function processRetrieveEnd(param) {
    
}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_1") {
        if (!checkUpdatable({ check: true })) return false;
        createDW({ astat: "작성" });
        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "issue_dt", value: gw_com_api.Mask(gw_com_api.getDate(), "date-ymd") },
                { name: "comp_cd", value: v_global.logic.supp_cd },
                { name: "comp_nm", value: v_global.logic.supp_nm },
                { name: "astat", value: "작성" },
                { name: "pstat", value: "작성" }
            ],
            clear: [
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" },
                { type: "FORM", id: "frmData_MEMO3" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_MEMO1", edit: true, updatable: true
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_MEMO2", edit: true, updatable: true
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_MEMO3", edit: true, updatable: true
        };
        gw_com_module.formInsert(args);
        gw_com_api.selectTab("lyrTab", 2);
    } else {
        //2021-05-18 by KYT
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return false;
        if (!checkStat()) {
            var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
            gw_com_api.messageBox([{ text: "[" + pstat + "] 상태이므로 수정할 수 없습니다." }]);
            return;
        }
        //var args = {
        //    type: "PAGE", page: "w_upload_pcn", title: "파일 업로드",
        //    width: 650, height: 200,
        //    //locate: ["center", 600],
        //    open: true
        //};
        //if (gw_com_module.dialoguePrepare(args) == false) {
        //    var args = {
        //        page: "w_upload_pcn",
        //        param: {
        //            ID: gw_com_api.v_Stream.msg_upload_ECCB,
        //            data: {
        //                user: gw_com_module.v_Session.USR_ID,
        //                key: gw_com_api.getValue("frmData_MAIN", 1, "issue_no"),
        //                seq: 1
        //            }
        //        }
        //    };
        //    gw_com_module.dialogueOpen(args);
        //}

        // set data for "File Upload"
        var dataType = "PCN";    // Set File Data Type
        var dataKey = gw_com_api.getValue("frmData_MAIN", 1, "issue_no");   // Main Key value for Search
         // Main Seq value for Search

        // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
        v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: 1, user: gw_com_module.v_Session.USR_ID }; // additional data = { data_subkey: "", data_subseq:-1 }

        // set Argument for Dialogue
        var pageArgs = dataType + ":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
        var args = {
            type: "PAGE", open: true, locate: ["center", 100],
            width: 660, height: 200, scroll: true,  // multi( h:350, scroll) / single(h:300)
            page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
            data: v_global.event.data  // reOpen 을 위한 Parameter
        };

        // Open dialogue
        gw_com_module.dialogueOpenJJ(args);
    }

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_3") {
        if (!checkStat()) {
            var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
            gw_com_api.messageBox([{ text: "[" + pstat + "] 상태이므로 수정할 수 없습니다." }]);
            return;
        }
        args = { targetid: "grdData_FILE", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    } else {
        if (!checkManipulate({})) return;
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            var args = {
                target: [
                    { type: "FORM", id: "frmData_MAIN" },
                    { type: "FORM", id: "frmData_MEMO1" },
                    { type: "FORM", id: "frmData_MEMO2" },
                    { type: "FORM", id: "frmData_MEMO3" },
                    { type: "GRID", id: "grdData_FILE" }
                ]
            };
            gw_com_module.objClear(args);
        } else {
            if (!checkStat()) {
                var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
                gw_com_api.messageBox([{ text: "[" + pstat + "] 상태이므로 삭제할 수 없습니다." }]);
                return;
            }
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        }
    }

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_MAIN",
                key: { element: [{ name: "issue_no" }] }
            }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(param) {

    processRetrieve({ object: "frmOption" });
    gw_com_api.selectTab("lyrTab", 1);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (gw_com_api.getValue("frmData_MAIN", 1, "chg_tp") == "기타" && gw_com_api.getValue("frmData_MAIN", 1, "chg_dtl_tp") == "") {
        gw_com_api.setError(true, "frmData_MAIN", 1, "chg_dtl_tp");
        gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
        return;
    }
    gw_com_api.setError(false, "frmData_MAIN", 1, "chg_dtl_tp");

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    if (param.mail != undefined) processBatch(param);
    var key = response;
    key[0].QUERY = "PCN_1010_1";
    $.ajaxSetup({ async: false });
    processRetrieve({ object: "frmOption", key: key });
    $.ajaxSetup({ async: true });
    processRetrieve({});
}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "dbo.PROC_MAIL_ECCB_PCN",
        nomessage: true,
        input: [
            { name: "type", value: param.mail.type, type: "varchar" },
            { name: "key_no", value: param.mail.key_no, type: "varchar" },
            { name: "key_seq", value: "0", type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }

        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            type: "PAGE", page: "w_edit_html_eccb", title: "상세 내용",
            width: 800,
            height: 570,
            locate: ["center", "center"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_edit_html_eccb",
                param: {
                    ID: gw_com_api.v_Stream.msg_edit_HTML,
                    data: {
                        edit: true,
                        title: v_global.logic.memo,
                        html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "FORM", id: "frmData_MEMO3" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSearch(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "supp_nm":
            {
                var args = {
                    type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                    width: 600, height: 450, open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_SUPPLIER",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectSupplier
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }


}
//----------
function checkStat(param) {

    if ($.inArray(gw_com_api.getValue("frmData_MAIN", 1, "astat"), ["", "작성"]) == -1) {
        return false;
    }
    return true;

}
//----------
function createDW(param) {

    var edit_yn = param.astat == "" || param.astat == "작성" ? true : false;
    //=====================================================================================
    var args = {
        targetid: "frmData_MAIN", query: "PCN_1010_2", type: "TABLE", title: "변경점 승인 요청",
        caption: false, show: true,// selectable: true,
        editable: { bind: "select", focus: "dept_area", validate: true },
        content: {
            width: { label: 40, field: 60 }, height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "장비군", format: { type: "label" } },
                        { name: "dept_area_nm", editable: { type: "hidden" } },
                        { name: "dept_area", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "협력사명", format: { type: "label" } },
                        { name: "comp_nm", editable: { type: "hidden", width: 500 }, style: { colspan: 3 }, width: 150 },
                        { name: "comp_cd", editable: { type: "hidden" }, hidden: true },
                        { header: true, value: "작성일시", format: { type: "label" } },
                        { name: "issue_dt", editable: { type: "hidden", width: 200 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "적용예정일", format: { type: "label" } },
                        { name: "plan_date", editable: { type: "hidden", width: 300 }, mask: "date-ymd" },
                        { header: true, value: "작성자", format: { type: "label" } },
                        { name: "rqst_user_nm", editable: { type: "hidden", width: 128 } },
                        { header: true, value: "직급", format: { type: "label" } },
                        { name: "rqst_user_pos", editable: { type: "hidden", width: 128 } },
                        { header: true, value: "E-Mail", format: { type: "label" } },
                        { name: "rqst_user_email", editable: { type: "hidden", width: 166 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "품번", format: { type: "label" } },
                        { name: "item_cd", editable: { type: "hidden", width: 166 } },
                        { header: true, value: "품명", format: { type: "label" } },
                        { name: "item_nm", editable: { type: "hidden", width: 416 }, style: { colspan: 3 } },
                        { header: true, value: "연락처", format: { type: "label" } },
                        { name: "rqst_user_tel", editable: { type: "hidden", width: 166 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "변경구분", format: { type: "label" } },
                        { name: "chg_tp", editable: { type: "hidden", width: 166 } },
                        { header: true, value: "상세구분", format: { type: "label" } },
                        { name: "chg_dtl_tp", editable: { type: "hidden", width: 416 }, style: { colspan: 3 } },
                        { header: true, value: "요청구분", format: { type: "label" } },
                        {
                            name: "issue_tp",
                            format: { type: "select", data: { memory: "요청구분" } },
                            editable: { type: "hidden" }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "제목", format: { type: "label" } },
                        {
                            name: "issue_title", style: { colspan: 5 },
                            editable: { type: "hidden", width: 716 }
                        },
                        { header: true, value: "진행상태", format: { type: "label" } },
                        { name: "pstat", editable: { type: "hidden", width: 166 } },
                        { name: "astat", editable: { type: "hidden" }, hidden: true }
                    ]
                },
                {
                    element: [
                        { header: true, value: "변경사유", format: { type: "label" } },
                        {
                            name: "chg_reason", style: { colspan: 7 },
                            format: { type: "textarea", rows: 4, width: 1010 }
                        },
                        { name: "chg_memo1", editable: { type: "textarea" }, hidden: true },
                        { name: "chg_memo2", editable: { type: "textarea" }, hidden: true },
                        { name: "chg_memo3", editable: { type: "textarea" }, hidden: true },
                        { name: "chg_memo4", editable: { type: "textarea" }, hidden: true },
                        { name: "issue_no", editable: { type: "hidden" }, hidden: true }
                    ]
                }
            ]
        }
    };
    //----------
    if (edit_yn) {
        args.content.row[0].element[1] = {
            name: "dept_area",
            editable: { type: "select", data: { memory: "DEPT_AREA_IN" }, width: 170, validate: { rule: "required", message: "장비군" } }
        };                                                                                                                                                                      //장비군
        args.content.row[0].element[2] = { name: "dept_area_nm", hidden: true };                                                                                                //장비군명
        args.content.row[1].element[3].editable = { type: "text", width: 128, maxlength: 10, validate: { rule: "required", message: "작성자" } };                               //작성자
        args.content.row[1].element[5].editable = { type: "text", width: 128, maxlength: 10, validate: { rule: "required", message: "직급" } };                                 //직급
        args.content.row[1].element[7].editable = { type: "text", width: 166, maxlength: 100, validate: { rule: "required", message: "E-Mail" } };                              //E-Mail
        args.content.row[2].element[1].editable = { type: "text", width: 166 };                                                                                                 //품번
        args.content.row[2].element[1].mask = "search";                                                                                                                         //품번
        args.content.row[2].element[3].editable = { type: "text", width: 416 };                                                                                                 //품명
        args.content.row[2].element[5].editable = { type: "text", width: 166 };                                                                                                 //연락처
        args.content.row[3].element[1].editable = { type: "select", data: { memory: "변경구분" }, width: 170, validate: { rule: "required", message: "변경구분" } };            //변경구분
        args.content.row[3].element[3].editable = { type: "text", width: 416, maxlength: 100 };                                                                                 //상세구분
        args.content.row[3].element[5].editable = { type: "select", data: { memory: "요청구분" }, width: 170, validate: { rule: "required", message: "요청구분" } };            //요청구분
        args.content.row[4].element[1].editable = { type: "text", width: 716, maxlength: 100, validate: { rule: "required", message: "제목" } };                                //제목
        args.content.row[5].element[1].editable = { type: "textarea", rows: 4, width: 1000 };                                                                                   //변경사유
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        targetid: "frmData_MEMO3", query: "PCN_1010_2", type: "TABLE", title: "",
        caption: false, show: true, selectable: true,
        editable: { bind: "select", focus: "chg_memo3", validate: true },
        content: {
            width: { label: 10, field: 90 }, height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "품질검증내용", format: { type: "label" } },
                        {
                            name: "chg_memo3",
                            format: { type: "textarea", rows: 4, width: 1000 }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "4M", format: { type: "label" } },
                        {
                            header: false, name: "chg_memo4", format: { type: "label" },
                            value: "① MAN(작업자) : 주요공정 및 보안 공정의 작업자 변경&nbsp;&nbsp;&nbsp;&nbsp;② MACHINE(설비) : 설비,금형 및 2차업체 변경<br/>③ MATERIAL(재료) : 재질변경 및 국산화품 적용&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;④ METHOD(작업방법) : 제조공법변경,생산공장이전 등<br/>&nbsp;&nbsp;※기 타 : 1년이상 방치된 금형 설비 사용 또는 납품 중단 후 재개 등"
                        }
                    ]
                }
            ]
        }
    };
    //----------
    if (edit_yn) {
        args.content.row[0].element[1].editable = { type: "textarea", rows: 4, width: 1000 };   //품질검증내용
    }
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN", offset: 8 },
            { type: "FORM", id: "frmData_MEMO3", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblclick };
    gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmData_MEMO3", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================

}
//----------
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
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});

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
                switch (param.from.page) {
                    //2021-05-18 by KYT
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                    case "DLG_SUPPLIER":
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        break;
                    case "PCN_1011":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            supp_cd: v_global.logic.supp_cd
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
                                        param.data.html);
                    gw_com_api.setValue("frmData_MAIN",
                                        1,
                                        v_global.event.element,
                                        param.data.html);
                    gw_com_api.setUpdatable("frmData_MAIN");
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "PCN_1011":
                        if (param.data != undefined) {
                            gw_com_api.setValue("frmData_MAIN", 1, "item_cd", param.data.item_cd, false, false, true);
                            gw_com_api.setValue("frmData_MAIN", 1, "item_nm", param.data.item_nm, false, false, true);
                        }
                        break;

                    //2021-05-17 by KYT
                    case "SYS_FileUpload":
                        {
                            processFileList({ data_key: gw_com_api.getValue("frmData_MAIN", 1, "issue_no") });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "FORM", id: "frmData_MAIN",
                        element: [
                            { name: "issue_no", argument: "arg_data_key" }
                        ],
                        argument: [
                            { name: "arg_data_seq", value: -1 }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_FILE", select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "supp_cd",
                                    param.data.supp_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "supp_nm",
                                    param.data.supp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//