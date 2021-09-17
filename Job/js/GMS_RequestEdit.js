//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : Help Service 요청
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 주요 수정 부문 : 

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), uiButton(), uiData(), uiEvent()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {
        
        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // step : Request, Accept, Check, Work, Manage, View
        v_global.logic.step = gw_com_api.getPageParameter("step");
        if (v_global.logic.step == "") v_global.logic.step = "R";
        if (v_global.logic.step == "R") v_global.logic.step_nm = "요청";
        else if (v_global.logic.step == "A") v_global.logic.step_nm = "접수";
        else if (v_global.logic.step == "C") v_global.logic.step_nm = "검토";
        else if (v_global.logic.step == "W") v_global.logic.step_nm = "작업";
        else if (v_global.logic.step == "M") v_global.logic.step_nm = "승인";
        else if (v_global.logic.step == "V") v_global.logic.step_nm = "보기";


        // key : rqst_no, Copy
        v_global.logic.key = gw_com_api.getPageParameter("key");
        if (v_global.logic.step == "R" && v_global.logic.key == "") v_global.logic.key = "New";
        // Is System Manager
        if (v_global.logic.step == "R" || v_global.logic.step == "M" || v_global.logic.step == "V")
            v_global.logic.isUser = true;
        else
            v_global.logic.isUser = false;

        // prepare dialogue.
        var args = { type: "PAGE", page: "w_edit_memo", title: "사유", width: 500, height: 300 };
        gw_com_module.dialoguePrepare(args);

        // set list data.
        var args = {
            request: [
                { type: "PAGE", name: "dddwGmsRqst", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "GmsRqst" }] },
                { type: "PAGE", name: "dddwGmsAcpt", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "GmsAcpt" }] },
                { type: "PAGE", name: "dddwGmsWork", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "GmsWork" }] },
                { type: "PAGE", name: "dddwGmsLevel", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "SYS071" }] },
                { type: "PAGE", name: "dddwBizDept", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "ISCM81" }] },
                { type: "PAGE", name: "dddwSysMod", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "SysMod" }] },
                { type: "PAGE", name: "dddwSysFun", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "SysMod" }] },
                { type: "INLINE", name: "dddwGmsWorker", data: [{ title: "조정재", value: "GoodJJJ" }, { title: "고유탁", value: "GoodKYT" }] }
            ],
            starter: start
        }; gw_com_module.selectSet(args);

        // go next.
        function start() {

            gw_job_process.uiButton();
            gw_job_process.uiData();
            gw_job_process.uiEvent();

            gw_com_module.startPage();

            processSetEditable(v_global.logic.step);

            if (v_global.logic.key == "New") processInsert({});
            else if (v_global.logic.key == "Copy") processCopy({});
            else processRetrieve({});
        }

    },  // end ready

    // create UI - Button
    uiButton: function () {
        //=== 조회 조건 표시
        var args = {
            targetid: "lyrRemark", row: [{ name: "TEXT" }]
        };
        gw_com_module.labelCreate(args);

        //=== Main Buttons
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "btnSave", value: "저장", icon: "Save" }
            ]
        };
        // Edit Mode 별 버튼 설정
        if (v_global.logic.step == "R") {
            args.element.push({ name: "btnStart", value: "요청", icon: "Run", updatable: true });
            args.element.push({ name: "btnEnd", value: "확인", icon: "예", updatable: true });
            args.element.push({ name: "btnCancel", value: "취소", icon: "아니오", updatable: true });
            args.element.push({ name: "btnHold", value: "보류", icon: "Delete", updatable: true });
        }
        else if (v_global.logic.step == "A") {
            args.element.push({ name: "btnStart", value: "접수", icon: "Run", updatable: true });
            args.element.push({ name: "btnEnd", value: "접수 완료", icon: "예", updatable: true });
            args.element.push({ name: "btnCancel", value: "요청 취소", icon: "아니오", updatable: true });
            args.element.push({ name: "btnHold", value: "접수 보류", icon: "Delete", updatable: true });
        }
        else if (v_global.logic.step == "W") {
            args.element.push({ name: "btnStart", value: "조치 중", icon: "Run", updatable: true });
            args.element.push({ name: "btnEnd", value: "조치 완료", icon: "예", updatable: true });
            args.element.push({ name: "btnCancel", value: "요청 취소", icon: "아니오", updatable: true });
            args.element.push({ name: "btnHold", value: "조치 보류", icon: "Delete", updatable: true });
        }
        else if (v_global.logic.step == "M") {
            args.element.push({ name: "btnStart", value: "검토 중", icon: "Run", updatable: true });
            args.element.push({ name: "btnEnd", value: "승인", icon: "예", updatable: true });
            args.element.push({ name: "btnCancel", value: "반려", icon: "아니오", updatable: true });
            args.element.push({ name: "btnHold", value: "승인 보류", icon: "Delete", updatable: true });
        }

        //{ name: "btnHelp", value: "도움말", icon: "Dialogue" },
        //args.element.push({ name: "btnClose", value: "닫기", icon: "Close" });
        gw_com_module.buttonMenu(args);

        //---------- Create Buttons : lyrMenu_WORK : btnWorkAdd, btnWorkDel
        var args = {
            targetid: "lyrMenu_WORK", type: "FREE",
            element: [
                { name: "btnWorkAdd", value: "추가", icon: "AddNew" },
                { name: "btnWorkDel", value: "삭제", icon: "Delete" }
            ]
        };
        // only Accept & Work step
        if (v_global.logic.step == "A" || v_global.logic.step == "W")
            gw_com_module.buttonMenu(args);
        //---------- Create Buttons : lyrMenu_FileA : AddNew, Delete
        var args = {
            targetid: "lyrMenu_FileA", type: "FREE",
            element: [
                { name: "AddNew", value: "추가", icon: "AddNew" },
                { name: "Delete", value: "삭제", icon: "Delete" }
            ]
        };
        gw_com_module.buttonMenu(args);
    },  // end uiButton

    // create UI - Data Box
    uiData: function () {

        //---------- Data Box : frmData_MainA : 요청서
        var args = {
            targetid: "frmData_MainA", query: "SYS_GMS_RQST", type: "TABLE", title: "요청서",
            caption: false, show: true, selectable: true,
            editable: { bind: "editable", focus: "rqst_title", validate: true },
            content: {
                width: { label: 72, field: 110 }, height: 25,
                row: [
                    {
                        element: [
                            { name: "label_rqst_no", header: true, value: "요청번호", format: { type: "label" } },
                            { name: "rqst_no", width: 110, editable: { type: "hidden" } },
                            { name: "label_rqst_cd", header: true, value: "요청구분", format: { type: "label" } },
                            {
                                name: "rqst_cd", width: 110, format: { type: "select", data: { memory: "dddwGmsRqst" } },
                                editable: { type: "select", data: { memory: "dddwGmsRqst" }, validate: { rule: "required" } }
                            },
                            { name: "label_level_cd", header: true, value: "중요도", format: { type: "label" } },
                            {
                                name: "level_cd", width: 110, format: { type: "select", data: { memory: "dddwGmsLevel" } },
                                editable: { type: "select", data: { memory: "dddwGmsLevel" }, validate: { rule: "required" } }
                            },
                            { name: "label_rqst_user", header: true, value: "요청자", format: { type: "label" } },
                            { name: "rqst_user_nm", width: 110, editable: { type: "hidden" } },
                            { name: "label_str_dt", header: true, value: "요청일시", format: { type: "label" } },
                            { name: "str_dt", width: 160, format: { width: 160 } },
                            { name: "rqst_user", editable: { type: "hidden" }, hidden: true },
                            { name: "editable", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "label_rqst_title", value: "제목", format: { type: "label" } },
                            {
                                name: "rqst_title", style: { colspan: 5 }, format: { width: 560 },
                                editable: { type: "text", width: 560, maxlength: 99, validate: { rule: "required" } }
                            },
                            { name: "label_biz_dept", header: true, value: "사업부", format: { type: "label" } },
                            {
                                name: "biz_dept", format: { type: "select", data: { memory: "dddwBizDept" } },
                                editable: { type: "select", data: { memory: "dddwBizDept" }, validate: { rule: "required" } }
                            },
                            { header: true, name: "label_appr_date", value: "완료요구일", format: { type: "label" } },
                            { name: "due_ymd", mask: "date-ymd", editable: { type: "text", validate: { rule: "required" } } },
                            { name: "rqst_yn_nm", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_yn", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "label_rqst_rmk", value: "요청 메모", format: { type: "label" } },
                            {
                                name: "rqst_rmk", style: { colspan: 5 }, format: { type: "text", width: 560 },
                                editable: { type: "text", width: 560, maxlength: 99 }
                            },
                            { name: "label_acpt_user_nm", header: true, value: "담당자", format: { type: "label" } },
                            { name: "acpt_user_nm", editable: { type: "hidden" } },
                            { name: "label_end_dt", header: true, value: "완료일시", format: { type: "label" } },
                            { name: "end_dt", format: { width: 160 } }
                        ]
                    }
                ]
            }
        };
        // User 구분에 따른 입력필드 설정
        if (v_global.logic.key != "New") {
            //args.content.row[0].element.push({ name: "", editable: { type: "hidden" } });
            var addRow = {
                element: [
                    { header: true, name: "label_acpt_rmk", value: "담당 메모", format: { type: "label" } },    //, style: { rowspan: 2 }
                    {
                        name: "acpt_rmk", style: { colspan: 5 }, format: { type: "text", width: 560 },
                        editable: { type: "text", width: 560, maxlength: 99, readonly: v_global.logic.isUser }
                    },
                    { name: "label_acpt_cd", header: true, value: "접수구분", format: { type: "label" } },
                    {
                        name: "acpt_cd", width: 160, format: { type: "select", data: { memory: "dddwGmsAcpt" } }    //, editable: { type: "hidden" }
                        , editable: { type: (v_global.logic.isUser) ? "hidden" : "select", width: 160, data: { memory: "dddwGmsAcpt" } }
                    },
                    { name: "label_plan_ymd", value: "완료예정일", header: true, format: { type: "label" } },
                    { name: "plan_ymd", mask: "date-ymd", format: { type: "text" }, editable: { type: (v_global.logic.isUser) ? "hidden" : "text" } }
                ]
            };
            args.content.row.push(addRow);
            if (v_global.logic.isUser == false) {
                var addRow = {
                    element: [
                        { name: "label_mod_cd", header: true, value: "모듈분류", format: { type: "label" } },
                        {
                            name: "mod_cd", format: { type: "select", data: { memory: "dddwSysMod" } }
                            , editable: { type: (v_global.logic.isUser) ? "hidden" : "select", data: { memory: "dddwSysMod" } }
                        },
                        { name: "label_fun_cd", header: true, value: " ", format: { type: "label" } },  //기능분류
                        {
                            name: "fun_cd", format: { type: "select", data: { memory: "dddwSysFun" } }
                            , editable: { type: (v_global.logic.isUser) ? "hidden" : "select", data: { memory: "dddwSysFun" } }
                        },
                        { name: "label_cost_cd", header: true, value: "서비스구분", format: { type: "label" } },
                        { name: "cost_cd", editable: { type: "hidden", readonly: v_global.logic.isUser } },
                        { name: "label_acpt_user", header: true, value: "담당자", format: { type: "label" } },
                        {
                            name: "acpt_user", format: { type: "select", data: { memory: "dddwGmsWorker" } }
                            , editable: { type: "select", data: { memory: "dddwGmsWorker" } }
                        },
                        { name: "label_upd_dt", header: true, value: "수정일시", format: { type: "label" } },
                        { name: "upd_dt", format: { width: 160 } }
                    ]
                };
                args.content.row.push(addRow);
            }
        }
        gw_com_module.formCreate(args);
        //---------- Data Box : grdData_FileA : Attach File
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일",
            caption: true, height: 60, pager: false, number: true, show: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "_download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 450, align: "left", editable: { type: "text" } },
                { header: "등록자", name: "ins_usr_nm", width: 80, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true, editable: { type: "hidden" } },
                //{ name: "data_subkey", hidden: true },
                //{ name: "data_subseq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "ver_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //---------- Data Box : frmData_MemoA : 요청 내용
        var args = {
            targetid: "frmData_MemoA", query: "SYS_GMS_MemoA", type: "TABLE", title: "요청 내용",
            caption: true, show: true, fixed: true, selectable: true, editable: { bind: "select", validate: true },
            content: {
                row: [{
                    element: [
                        { name: "memo_html", format: { type: "html", height: 500 } },
                        { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_no", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_cd", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_tp", hidden: true, editable: { type: "hidden" } }
                    ]
                }]
            }
        };
        gw_com_module.formCreate(args);
        // Add Caption
        args.type = "FORM";
        args.text = "오류현상 및 개선내용을 구체적으로 기술합니다";
        addCaption(args);
        //---------- Data Box : frmData_MemoB : 조치 결과
        var args = {
            targetid: "frmData_MemoB", query: "SYS_GMS_MemoB", type: "TABLE", title: "조치 결과",
            caption: true, show: true, fixed: true, selectable: true, editable: { bind: "select", validate: true },
            content: {
                row: [{
                    element: [
                        { name: "memo_html", format: { type: "html", height: 500 } },
                        { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_no", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_cd", hidden: true, editable: { type: "hidden" } },
                        { name: "memo_tp", hidden: true, editable: { type: "hidden" } }
                    ]
                }]
            }
        };
        gw_com_module.formCreate(args);
        // Add Caption
        args.type = "FORM";
        args.text = "담당자 작성란";
        addCaption(args);
        //---------- Data Box : grdData_WORK : 작업 내역
        var args = {
            targetid: "grdData_WORK", query: "SYS_GMS_WORK", title: "작업 내역",
            caption: true, height: 100, pager: false, show: true, number: true, selectable: "true",
            editable: { multi: true, bind: "select", focus: "work_ymd", validate: true },
            element: [
                { header: "작업일", name: "work_ymd", mask: "date-ymd", editable: { type: "text" } },
                {
                    header: "작업자", name: "work_user", width: 80,
                    format: { type: "select", data: { memory: "dddwGmsWorker" } },
                    editable: { type: "select", data: { memory: "dddwGmsWorker" }, validate: { rule: "required" } }
                },
                {
                    header: "작업구분", name: "work_cd", width: 80,
                    format: { type: "select", data: { memory: "dddwGmsWork" } },
                    editable: { type: "select", data: { memory: "dddwGmsWork" }, validate: { rule: "required" } }
                },
                {
                    header: "시간(분)", name: "work_min", width: 70, align: "center", mask: "numeric-int",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "시작시각", name: "str_time", width: 70, align: "center", mask: "time",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "종료시각", name: "end_time", width: 70, align: "center", mask: "time",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "완료", name: "work_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "E", offval: "S", title: "" },
                    editable: { type: "checkbox", value: "E", offval: "S", title: "" }
                },
                {
                    header: "작업내용", name: "work_rmk", width: 500, align: "center",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                { name: "rqst_no", hidden: true, editable: { type: "hidden" } },
                { name: "work_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //---------- Data Box : grdData_ACT : 작업 내역
        var args = {
            targetid: "grdData_ACT", query: "SYS_GMS_ACT", title: "진행 이력",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            element: [
                { header: "구분", name: "act_cd", width: 80 },
                { header: "상태", name: "act_yn", width: 80 },
                { header: "성명", name: "act_user_nm", width: 80 },
                { header: "소속", name: "act_dept_nm", width: 120 },
                { header: "일시", name: "act_dt", width: 120 },
                { header: "비고", name: "act_cd", width: 500 },
                { name: "rqst_no", hidden: true, editable: { type: "hidden" } },
                { name: "act_id", hidden: true, editable: { type: "hidden" } },
                { name: "act_user", hidden: true, editable: { type: "hidden" } },
                { name: "act_dept", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        // Add Caption
        args.type = "GRID";
        args.text = "요청부터 조치 및 최종확인까지의 진행 이력";
        addCaption(args);

        // Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //=====================================================================================
        // Field Header Tip 
        //=====================================================================================
        var args = {
            targetid: "frmData_MainA", type: "FORM",
            element: [
                { name: "label_rqst_no", text: "요청 번호" } // ex: "< 인도방법 >\n 가나"
            ]
        };
        gw_com_api.setHelp(args);

        //=====================================================================================
        // Resize Objects
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MainA", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 },
                { type: "FORM", id: "frmData_MemoA", offset: 8 },
                { type: "FORM", id: "frmData_MemoB", offset: 8 },
                { type: "GRID", id: "grdData_WORK", offset: 8 },
                { type: "GRID", id: "grdData_ACT", offset: 8 }
            ]
        }; gw_com_module.objResize(args);

        // 상황별 화면 구성
        if (v_global.logic.key == "New")
            gw_com_api.hide("frmData_MemoB");   //조치결과

        if (v_global.logic.isUser) {
            gw_com_api.hide("lyrMenu_WORK");    //작업추가/삭제
            gw_com_api.hide("grdData_ACT");     //조치이력
            gw_com_api.hide("grdData_WORK");    //작업이력
        }
        gw_com_module.informSize();


    },  // end uiData

    // create UI - Event Binding
    uiEvent: function () {

        // Button : Main
        var args = { targetid: "lyrMenu", element: "btnSave", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnStart", event: "click", handler: processAct };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnEnd", event: "click", handler: processAct };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnCancel", event: "click", handler: processAct };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnHold", event: "click", handler: processAct };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnHelp", event: "click", handler: processOpenDoc };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnClose", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        // Button : 작업내역
        var args = { targetid: "lyrMenu_WORK", element: "btnWorkAdd", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_WORK", element: "btnWorkDel", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);

        // Event : Memo Field
        var args = { targetid: "frmData_MemoA", event: "itemdblclick", handler: processMemoEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoB", event: "itemdblclick", handler: processMemoEdit };
        gw_com_module.eventBind(args);

        // Event : File Button,  Box
        var args = { targetid: "lyrMenu_FileA", element: "AddNew", event: "click", handler: processFileUpload };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_FileA", element: "Delete", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_FileA", grid: true, element: "_download", event: "click", handler: processFileDownload };
        gw_com_module.eventBind(args);

        // Form & Grid Events : click, itemchanged
        var args = { targetid: "grdData_WORK", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);

    }   // end uiEvent

}; // end gw_job_process class

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Function : Others
//------
function processSetEditable(mode) {

    //if (mode == "R") {
    //    gw_com_api.disable("frmData_MainA", "acpt_cd", 1, false);
    //    gw_com_api.disable("frmData_MainA", "acpt_user", 1, false);
    //    gw_com_api.disable("frmData_MainA", "plan_ymd", 1, false);
    //}
    //if (v_global.logic.isUser) {
    //    gw_com_api.disable("frmData_MainA", "acpt_cd", 1, false); //DDDW의 경우 editable hidden 시 코드가 표시됨
    //}
    return;
}
//------
function processItemchanged(param) {

    var tmpVar1 = ""; var tmpVar2 = "";

    switch (param.element) {
        case "due_ymd": {
            if (param.value.current > "") {
                var DueYmd = gw_com_api.getValue(param.object, param.row, "due_ymd", (param.type == "GRID"));
                var PlanYmd = gw_com_api.getValue(param.object, param.row, "plan_ymd", (param.type == "GRID"));
                var CurYmd = gw_com_api.getDate();
                // 납기일 >= 현재일
                if (DlvYmd < CurYmd) {
                    gw_com_api.messageBox([{ text: "완료요구일이 현재일 이전입니다." }]);
                    gw_com_api.setError(true, param.object, param.row, param.element, (param.type == "GRID"));
                    gw_com_api.setFocus(param.object, param.row, param.element, (param.type == "GRID"));
                    //gw_com_api.setValue(param.object, param.row, param.element, param.value.prev, (param.type == "GRID"));
                }
                gw_com_api.setError(false, param.object, param.row, param.element, (param.type == "GRID"));
            }
        } break;
        case "plan_ymd": {
            if (param.value.current > "") {
                var PlanYmd = gw_com_api.getValue(param.object, param.row, "plan_ymd", (param.type == "GRID"));
                var CurYmd = gw_com_api.getDate();
                // 납기일 >= 현재일
                if (PlanYmd < CurYmd) {
                    gw_com_api.messageBox([{ text: "완료예정일이 현재일 이전입니다." }]);
                    gw_com_api.setError(true, param.object, param.row, param.element, (param.type == "GRID"));
                    gw_com_api.setFocus(param.object, param.row, param.element, (param.type == "GRID"));
                    //gw_com_api.setValue(param.object, param.row, param.element, param.value.prev, (param.type == "GRID"));
                }
            }
            gw_com_api.setError(false, param.object, param.row, param.element, (param.type == "GRID"));
        } break;
        case "email":
            {
                if (param.value.current > "") {
                    if (!gw_com_api.isEmail(param.value.current)) {
                        gw_com_api.messageBox([{ text: "이메일 형식이 부적합합니다." }]);
                        gw_com_api.setError(true, param.object, param.row, param.element, (param.type == "GRID"));
                        gw_com_api.setFocus(param.object, param.row, param.element, (param.type == "GRID"));
                        return;
                    }
                }
                gw_com_api.setError(false, param.object, param.row, param.element, (param.type == "GRID"));
            }
            break;
    }

}

// Custom Function : Retrieve
//------
function processOpenDoc(param) {

    var win = window.open("/Help/GMS_Request.htm", "GMS_HELP", "height=400, width=1050");
    //var win = window.open('../Files/Manual/GW_Masual_기술자료제공(IPS).pdf');

}
//------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_rqst_no", value: v_global.logic.key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MainA" }
        ],
        clear: [
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_WORK" }
        ],
        handler_complete: completeRetrieve
    };
    gw_com_module.objRetrieve(args);

}
//------
function completeRetrieve(param) {

    v_global.logic.rqst_yn = gw_com_api.getValue("frmData_MainA", 1, "rqst_yn");
    processSetEditable(v_global.logic.step);
    assignLabel({});
    toggleButton({});
    linkRetrieve({});

}
//------
function linkRetrieve(param) {

    v_global.logic.key = gw_com_api.getValue("frmData_MainA", 1, "rqst_no");
    if (v_global.logic.key == "") return;

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_rqst_no", value: v_global.logic.key }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_WORK" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" }
        ]
    };
    gw_com_module.objRetrieve(args);

    processFileList({ data_key: v_global.logic.key });
}

// Custom Function : Check
//------
function checkManipulate(param) {

    if (gw_com_api.getCRUD("frmData_MainA") == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;
}
//------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_WORK" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//------
function checkUpdatable2(param) {

    var updatable = false;
    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_WORK" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" }
        ],
        param: param
    };
    for (var i = 0; i < args.target.length; i++) {
        if (gw_com_api.getUpdatable(args.target[i].id, args.target[i].type == "GRID")) {
            updatable = true;
            break;
        }
    }
    return updatable;

}
//------
function checkRemovable(param) {

    var status = gw_com_api.getCRUD("frmData_MainA");
    if (status == "initialize" || status == "create") {
        var args = {
            target: [
                { type: "FORM", id: "frmData_MainA" },
                { type: "GRID", id: "grdData_WORK" },
                { type: "GRID", id: "grdData_ACT" },
                { type: "GRID", id: "grdData_FileA" },
                { type: "FORM", id: "frmData_MemoA" },
                { type: "FORM", id: "frmData_MemoB" }
            ]
        };
        gw_com_module.objClear(args);
    }
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}

// Custom Function : Edit
//------
function processCopy(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_rqst_no", value: v_global.logic.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MainA", query: $("#frmData_MainA").attr("query") + "_I", crud: "insert" }
        ],
        clear: [
            { type: "GRID", id: "grdData_WORK" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" }
        ],
        handler_complete: completeCopy
    };
    gw_com_module.objRetrieve(args);

}
//------
function completeCopy(param) {

    v_global.logic.rqst_yn = gw_com_api.getValue("frmData_MainA", 1, "rqst_yn");
    v_global.logic.appr_yn = gw_com_api.getValue("frmData_MainA", 1, "appr_yn");
    v_global.logic.supp_yn = gw_com_api.getValue("frmData_MainA", 1, "supp_yn");

    toggleButton({});
    linkCopy({});

    var param = {
        targetid: "frmData_MainA",
        edit: true
    };
    gw_com_module.formEdit(param);

}
//------
function linkCopy(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_rqst_no", value: v_global.logic.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_WORK", query: $("#grdData_WORK_data").attr("query") + "_I", crud: "insert" },
            { type: "GRID", id: "grdData_ACT", query: $("#grdData_ACT_data").attr("query") + "_I", crud: "insert" },
            { type: "FORM", id: "frmData_MemoA", query: $("#frmData_MemoA").attr("query") + "_I", crud: "insert" },
            { type: "FORM", id: "frmData_MemoB", query: $("#frmData_MemoB").attr("query") + "_I", crud: "insert" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//------
function processInsert(param) {

    if (param.object != undefined && param.object == "lyrMenu_WORK") {
        if (!checkManipulate({})) return;
        var data = [
            { name: "rqst_no", value: gw_com_api.getValue("frmData_MainA", 1, "rqst_no") },
            { name: "work_user", value: gw_com_module.v_Session.USR_ID },
            { name: "work_dept", value: gw_com_module.v_Session.DEPT_NM },
            { name: "str_time", value: "0900" },
            { name: "end_time", value: "1800" }
        ]
        var args = {
            targetid: "grdData_WORK", edit: true, updatable: true,
            data: data
        };
        gw_com_module.gridInsert(args);

    } else {

        var args = {
            targetid: "frmData_MainA", edit: true, updatable: true,
            data: [
                { name: "rqst_no", value: "New" },
                { name: "site_cd", value: "IPS" },
                { name: "biz_dept", value: gw_com_module.v_Session.DEPT_AREA },
                { name: "rqst_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rqst_user_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "due_ymt", value: gw_com_api.getDate() },
                { name: "rqst_yn", value: "RN" },
                { name: "rqst_yn_nm", value: "미요청" }
            ],
            clear: [
                { type: "GRID", id: "grdData_WORK" },
                { type: "GRID", id: "grdData_ACT" },
                { type: "GRID", id: "grdData_FileA" },
                { type: "FORM", id: "frmData_MemoA" },
                { type: "FORM", id: "frmData_MemoB" }
            ]
        };
        gw_com_module.formInsert(args);
        //----------
        var args = {
            targetid: "frmData_MemoA", edit: true, updatable: true,
            data: [{ name: "memo_cd", value: "SYS_GMS_RQST" }, { name: "memo_tp", value: "html" }]
        };
        gw_com_module.formInsert(args);
        //----------
        var args = {
            targetid: "frmData_MemoB", edit: true, updatable: true,
            data: [{ name: "memo_cd", value: "SYS_GMS_WORK" }, { name: "memo_tp", value: "html" }]
        };
        gw_com_module.formInsert(args);
        //----------
        gw_com_api.setFocus("frmData_MainA", 1, "rqst_cd");

    }
}
//------
function processDelete(param) {

    if (!checkManipulate({})) return;
    if (param.object != undefined) {
        var obj = "grdData_" + param.object.split("_")[1];
        var args = { targetid: obj, row: "selected", row: "selected" };
        gw_com_module.gridDelete(args);
    }

}
//------
function processTextEdit(param) {

    v_global.event.object = "grdData_WORK";
    v_global.event.row = "selected";
    v_global.event.element = "third_rmk";
    v_global.event.type = "GRID";
    v_global.event.data = {
        edit: (gw_com_api.getValue(v_global.event.object, v_global.event.row, "editable", (v_global.event.type == "GRID")) == "1"),
        rows: 14,
        title: "제3자 제공 사유", maxlength: 10,
        text: gw_com_api.getValue("grdData_WORK", "selected", "third_rmk", true)
    };
    var args = {
        page: "w_edit_memo",
        param: {
            ID: gw_com_api.v_Stream.msg_edit_Memo,
            data: v_global.event.data
        }
    };
    gw_com_module.dialogueOpen(args);

}
//------
function validateInputData(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_WORK" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" }
        ]
    };
    // if (gw_com_module.objValidate(args) == false) return false;

    //
    $.blockUI();
    var valid = true;
    $.each(args.target, function (i) {
        switch (this.type) {
            case "FORM":
                {
                    var targetobj = "#" + this.id;
                    valid = $(targetobj).valid();
                    if (!valid) {
                        gw_com_module.formEdit({ targetid: this.id, edit: true });
                    }
                }
                break;
            case "GRID":
                {
                    var param = { targetid: this.id, edit: true };
                    var ids = gw_com_api.getRowIDs(this.id);
                    $.each(ids, function () {
                        param.row = this;
                        gw_com_module.gridEdit(param);
                    })
                    var targetobj = "#" + this.id + "_form";
                    valid = $(targetobj).valid();
                }
                break;
        }
        return valid;
    });
    $.unblockUI();
    if (!valid)
        return false;
    //


    if (gw_com_api.getRowCount("grdData_WORK") < 1) {
        gw_com_api.messageBox([{ text: "요청자료가 등록되지 않았습니다." }]);
        return false;
    }

    // Validate Grid Row Data
    var ids = gw_com_api.getRowIDs("grdData_WORK");
    $.each(ids, function () {
        gw_com_api.setError(false, "grdData_WORK", this, "close_ymd", true);
        gw_com_api.setFocus("grdData_WORK", this, "rmk_edit", true);
        gw_com_api.selectRow("grdData_WORK", this, true);
        gw_com_api.messageBox([{ text: "제3자 제공 사유가 등록되지 않았습니다." }]);
        return false;
    })

    return true;

}
//------
function processSave(param) {

    if (!checkManipulate({})) return;
    //if (!validateInputData({})) return;
    
    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_WORK" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };

    if (param.handler != undefined) {
        args.nomessage = true;
        args.handler.param = {
            handler: param.handler,
            param: param.param
        }
    }
    gw_com_module.objSave(args);

}
//------
function successSave(response, param) {

    if (gw_com_api.getCRUD("frmData_MainA") == "create") {
        var run = true;
        $.each(response, function () {
            $.each(this.KEY, function () {
                if (this.NAME == "rqst_no") {
                    v_global.logic.key = this.VALUE;
                    run = false;
                }
                return run;
            });
            return run;
        });
        if (run == false) processRetrieve({});
    }
    else {
        if (param.handler != undefined) {
            //processRetrieve({});
            param.handler(param.param);
        } else {
            //refreshPage({ page: "GMS_RequestList" });
            processRetrieve({});
        }
    }

}
//------
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA", key: { element: [{ name: "rqst_no" }] } }
        ],
        handler: { success: successRemove }
    };
    gw_com_module.objRemove(args);

}
//------
function successRemove(response, param) {

    //processDelete({});
    refreshPage({ page: "GMS_RequestList" });
    processClose({});

}
//------
function processAct(param) {

    var act = param.element.substr(3);
    var args = { handler: processBatch, param: { act: act } };
    if (checkUpdatable2({})) {
        args.handler = processSave;
        args.param = { handler: processBatch, param: { act: act } };
    }
    var act_nm = "";
    if (act == "Start") act_nm = v_global.logic.step_nm;
    else if (act == "Hold") act_nm = "보류";
    else if (act == "End") act_nm = v_global.logic.step_nm + " 완료";
    else if (act == "Cancel") act_nm = "취소";

    var msg = new Array();
    msg.push( { text: act_nm + " 처리하시겠습니까?" } );
    gw_com_api.messageBox(msg, 400,
        gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
}
// Custom Function : Batch
//------
function processBatch(param) {

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_SYS_GmsRequest",
        input: [
            { name: "JobCd", value: param.act, type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "RootNo", value: gw_com_api.getValue("frmData_MainA", 1, "rqst_no"), type: "varchar" },
            { name: "Option", value: v_global.logic.step, type: "varchar" }
        ],
        output: [
            { name: "Rmsg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: { "act": param.act }
        }
    };
    
    gw_com_module.callProcedure(args);

}
//------
function successBatch(response, param) {

    var isError = false;
    if (response.VALUE[0] != "") {
        var msg = new Array();
        $.each(response.VALUE[0].split("\n"), function (i, v) {
            if (v.indexOf("ERR") == 0) isError = true;
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);
    }
    if (isError) return;

    // Refresh List Page : used only when this is tabPage
    refreshPage({ key: "" });

    processRetrieve({});

}

// Custom Function : Page
//------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_ACT" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" },
            { type: "FORM", id: "frmData_MemoB" }
        ]
    };
    gw_com_module.objClear(args);

}
//------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//------
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
//------
function refreshPage(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_refreshPage,
        //to: { type: "MAIN" },
        //data: { page: param.page }
        findKey: param.key
        };
    gw_com_module.streamInterface(args);

}
//------
function assignLabel(param) {

    v_global.logic.remark = gw_com_api.getValue("frmData_MainA", 1, "rqst_yn_nm");
    var args = { targetid: "lyrRemark",
        row: [
            { name: "TEXT", value: " [상태 : " + v_global.logic.remark + "]" }
        ]
    }; gw_com_module.labelAssign(args);

}
//------
function toggleButton(param) {

    v_global.logic.rqst_yn = gw_com_api.getValue("frmData_MainA", 1, "rqst_yn");
    if (v_global.logic.rqst_yn == "") {
        gw_com_api.hide("lyrMenu", "btnStart");
        gw_com_api.hide("lyrMenu", "btnEnd");
        gw_com_api.hide("lyrMenu", "btnCancel");
        gw_com_api.hide("lyrMenu", "btnHold");
    }
    else if (v_global.logic.rqst_yn == "WE") { //작업완료 = 확인 대기
        gw_com_api.hide("lyrMenu", "btnStart");
        gw_com_api.show("lyrMenu", "btnEnd");
        gw_com_api.hide("lyrMenu", "btnCancel");
        gw_com_api.hide("lyrMenu", "btnHold");
    }
    else if (v_global.logic.rqst_yn.substr(1) == "N") {
        gw_com_api.show("lyrMenu", "btnStart");
        gw_com_api.hide("lyrMenu", "btnEnd");
        gw_com_api.show("lyrMenu", "btnCancel");
        gw_com_api.show("lyrMenu", "btnHold");
    }
    else if (v_global.logic.rqst_yn.substr(1) == "S") {
        gw_com_api.hide("lyrMenu", "btnStart");
        gw_com_api.show("lyrMenu", "btnEnd");
        gw_com_api.show("lyrMenu", "btnCancel");
        gw_com_api.show("lyrMenu", "btnHold");
    }
    else if (v_global.logic.rqst_yn.substr(1) == "E") {
        gw_com_api.hide("lyrMenu", "btnStart");
        gw_com_api.hide("lyrMenu", "btnEnd");
        gw_com_api.hide("lyrMenu", "btnCancel");
        gw_com_api.hide("lyrMenu", "btnHold");
    }
    else if (v_global.logic.rqst_yn.substr(1) == "H") {
        gw_com_api.show("lyrMenu", "btnStart");
        gw_com_api.show("lyrMenu", "btnEnd");
        gw_com_api.show("lyrMenu", "btnCancel");
        gw_com_api.hide("lyrMenu", "btnHold");
    }
    else if (v_global.logic.rqst_yn.substr(1) == "C") {
        if (v_global.logic.step == "R")
            gw_com_api.show("lyrMenu", "btnStart");
        else
            gw_com_api.hide("lyrMenu", "btnStart");
        gw_com_api.hide("lyrMenu", "btnEnd");
        gw_com_api.hide("lyrMenu", "btnCancel");
        gw_com_api.hide("lyrMenu", "btnHold");
    }

}
//------
function processSuppAdd(param) {

    var user_id = "";
    if (param.element == "업체수정") {
        if (gw_com_api.getRowCount("grdData_ACT") < 1) {
            gw_com_api.messageBox([{ text: "수정 대상 협력사를 선택하여야 합니다." }]);
            return;
        }
        else
            user_id = gw_com_api.getValue("grdData_ACT", "selected", "user_id", true);
    }
    // Open 협력사 등록
    var args = {
        page: "DLG_SUPPLIER_ADD",
        param: {
            ID: gw_com_api.v_Stream.msg_openedDialogue
            , data: { user_id: gw_com_api.getValue("grdData_ACT", "selected", "user_id", true) }
        }
    }; gw_com_module.dialogueOpen(args);

}
//------
function addCaption(param) {

    var ele;
    var cap = $("<span style='color: #595959; margin-left: 32px;'>" + param.text.toString().replace(/"/g, '\\"') + "</span>");
    if (param.type == "GRID") {
        ele = $("#" + param.targetid).find("span.ui-jqgrid-title");
    } else {
        ele = $("#" + param.targetid + "_caption");
    }
    $(ele).parent().append("&nbsp;");   //<br/>
    $(ele).parent().append(cap);

}
//------
function processMemoEdit(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args = {
        page: "DLG_HtmlEditor",
        option: "width=900,height=600,left=300,resizable=1",
        data: {
            title: "Contents Editor",
            html: gw_com_api.getValue(param.object, param.row, param.element)
        }
    };
    gw_com_api.openWindow(args);
}

// Custom Function : File
// ref : grdData_FileA, row click event, processRetrieveComplete, msg_openedDialogue, msg_closeDialogue
//------
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "SYS_GMS_RQST" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type

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
//------
function processFileUpload(param) {
    //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
    //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

    // Check Updatable
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // set data for "File Upload"
    var dataType = "SYS_GMS_RQST";    // Set File Data Type
    var dataKey = gw_com_api.getValue("frmData_MainA", "selected", "rqst_no");   // Main Key value for Search
    var dataSeq = gw_com_api.getValue("frmData_MainA", "selected", "-1");   // Main Seq value for Search

    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq }; // additional data = { data_subkey: "", data_subseq:-1 }

    // set Argument for Dialogue
    var pageArgs = dataType + ":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 660, height: 350, scroll: true,  // multi( h:350, scroll) / single(h:300)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);

}
//------
function processFileDownload(param) {
    // called by row click event - param : object, row
    var args = { targetid: "lyrDown", source: { id: param.object, row: param.row } };
    gw_com_module.downloadFile(args);
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_EMPLOYEE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEmployee;
                        } break;
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        } break;
                }
                gw_com_module.streamInterface(args);
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
                                processDelete({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined) param.data.arg.handler();
                                    else param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove({});
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
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                if (param.from != undefined && param.from.page != undefined)
                    closeDialogue({ page: param.from.page });

                // File Upload
                if (param.from.page == "SYS_FileUpload") {
                    processFileList({ data_key: gw_com_api.getValue("frmData_MainA", 1, "rqst_no") });
                    return;
                }

                // HTML Editor
                if (param.from.page == "DLG_HtmlEditor") {
                    if (param.data.update) {
                        // HTML 을 data column 에 복사. (html & text 두 개 컬럼에 저장해야함)
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, "memo_text", param.data.html);
                        gw_com_api.setUpdatable(v_global.event.object);
                    }
                    return;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedData:
            {
                if (param.data != undefined) {
                    if (param.from.page == "xxx") {
                        var args = { detail1: true, data: param.data
                        }; processInsert(args);
                    }
                }
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.text.substring(0, 200), (v_global.event.type == "GRID"));
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }   // end switch (param.ID)

}   // end streamProcess(param)
