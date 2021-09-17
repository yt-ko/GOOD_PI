
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

    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "TDR_1021", title: "제공업체 선택", width: 1000, height: 460 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "w_find_dept_tree", title: "부서 선택", width: 500, height: 500 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원 선택", width: 700, height: 450 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "w_edit_memo", title: "사유", width: 500, height: 300 };
        gw_com_module.dialoguePrepare(args);
        var args = { type: "PAGE", page: "DLG_SUPPLIER_ADD", title: "협력사 등록", width: 980, height: 480, locate: ["center", "center"] };
        gw_com_module.dialoguePrepare(args);

        // set data.
        var args = {
            request: [
                { type: "PAGE", name: "목적분류", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "TdrPurpose" }] },
                { type: "PAGE", name: "분류", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "TdrItemTp" }] },
                { type: "PAGE", name: "인도방법", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "TdrItemDlv" }] },
                { type: "PAGE", name: "폐기방법", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "TdrItemCls" }] },
                { type: "INLINE", name: "열람구분", data: [{ title: "EMP", value: "사원" }, { title: "DEPT", value: "부서" }] }
            ],
            starter: start
        }; gw_com_module.selectSet(args);

        // go next.
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            v_global.logic.key = gw_com_api.getPageParameter("tdr_id");
            if (gw_com_api.getPageParameter("dup_yn") == "true") {
                if (v_global.logic.key == "") {
                    gw_com_api.messageBox([{ text: "파라메터가 유효하지 않습니다." }]);
                    processClose({});
                }
                processCopy({});
                v_global.logic.key = "";
            } else if (v_global.logic.key == "") processInsert({});
            else processRetrieve({});
        }   // end start()

    },
    // end ready()

    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=== 조회 조건 표시
        var args = {
            targetid: "lyrRemark", row: [{ name: "TEXT" }]
        };
        gw_com_module.labelCreate(args);

        //=== Main Buttons
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "예시", value: "기술자료 예시", icon: "Dialogue" },
                { name: "요청", value: "승인요청", icon: "기타", updatable: true },
                { name: "저장", value: "임시저장" },
                { name: "취소", value: "회수", icon: "아니오", updatable: true },
                { name: "삭제", value: "삭제" },
                { name: "HELP", value: "매뉴얼", icon: "조회" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //----------
        toggleButton({});
        //=== Sub Buttons
        var args = {
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
                { name: "추가", value: "자료 추가", updatable: true },
                { name: "삭제", value: "자료 삭제", updatable: true }
            ]
        };
        gw_com_module.buttonMenu(args);
        var args = {
            targetid: "lyrMenu_DETAIL1", type: "FREE",
            element: [
                { name: "추가", value: "협력사 추가", icon: "추가", updatable: true },
                { name: "삭제", value: "협력사 삭제", icon: "삭제", updatable: true },
                { name: "업체등록", value: "신규 협력사 등록", icon: "실행", updatable: true },
                { name: "업체수정", value: "협력사 정보 수정", icon: "실행", updatable: true }
            ]
        };
        gw_com_module.buttonMenu(args);
        var args = {
            targetid: "lyrMenu_DETAIL2", type: "FREE",
            element: [
                { name: "사원추가", value: "사원 추가", icon: "추가", updatable: true },
                { name: "부서추가", value: "부서 추가", icon: "추가", updatable: true },
                { name: "삭제", value: "열람자 삭제", updatable: true }
            ]
        };
        gw_com_module.buttonMenu(args);
        var args = {
            targetid: "lyrMenu_THIRD", type: "FREE",
            element: [
                { name: "3자추가", value: "제3자 추가", icon: "추가", updatable: true },
                { name: "3자삭제", value: "제3자 삭제", icon: "삭제", updatable: true }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", query: "TDR_1020_1", type: "TABLE", title: "요청 정보",
            caption: false, show: true, selectable: true,
            editable: { bind: "editable", focus: "rqst_title", validate: true },
            content: {
                width: { label: 90, field: 140 }, height: 25,
                row: [
                    {
                        element: [
                            { name: "label_tdr_no", header: true, value: "요청번호", format: { type: "label" } },
                            { name: "tdr_no", editable: { type: "hidden" } },
                            { name: "tdr_id", editable: { type: "hidden" }, hidden: true },
                            { name: "dept_area", editable: { type: "hidden" }, hidden: true },
                            { name: "label_purpose_cd", header: true, value: "목적분류", format: { type: "label" } },
                            {
                                name: "purpose_cd",
                                format: { type: "select", data: { memory: "목적분류" } },
                                editable: { type: "select", data: { memory: "목적분류" }, validate: { rule: "required" } }
                            },
                            { name: "label_edit_yn", header: true, value: "편집권한", format: { type: "label" } },
                            {
                                name: "edit_yn", width: 60,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { name: "label_rqst_user", header: true, value: "작성자", format: { type: "label" } },
                            { name: "rqst_user_nm", editable: { type: "hidden" } },
                            { name: "label_rqst_date", header: true, value: "작성일", format: { type: "label" } },
                            { name: "rqst_date", mask: "date-ymd", editable: { type: "hidden" } },
                            { name: "rqst_user", editable: { type: "hidden" }, hidden: true },
                            { name: "rqst_dt", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, name: "label_rqst_title", value: "제목", format: { type: "label" } },
                            {
                                name: "rqst_title", style: { colspan: 3 },
                                format: { width: 382 },
                                editable: { type: "text", width: 382, maxlength: 80, validate: { rule: "required" } }
                            },
                            { header: true, name: "label_third_yn", value: "제3자 제공", format: { type: "label" } },
                            {
                                name: "third_yn", width: 60,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { header: true, name: "label_appr_user", value: "승인자", format: { type: "label" } },
                            { name: "appr_user_nm" },
                            { header: true, name: "label_appr_date", value: "승인(반려)일", format: { type: "label" } },
                            { name: "appr_date", mask: "date-ymd" },
                            { name: "rqst_yn", hidden: true },
                            { name: "rqst_yn_nm", hidden: true },
                            { name: "appr_yn", hidden: true },
                            { name: "supp_yn", hidden: true },
                            { name: "editable", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "TDR_1020_2", title: "요청 자료",
            caption: true, height: 100, pager: true, show: true, number: true, selectable: "true",
            editable: { multi: true, bind: "editable", validate: true },
            element: [
                {
                    header: "분류", name: "item_group", width: 100,
                    format: { type: "select", data: { memory: "분류" } },
                    editable: { type: "select", data: { memory: "분류" }, validate: { rule: "required" } }
                },
                {
                    header: "자료명", name: "item_nm", width: 330,
                    editable: { type: "text", mexlangth: 100, validate: { rule: "required" } }
                },
                {
                    header: "인도방법", name: "dlv_tp", width: 100,
                    format: { type: "select", data: { memory: "인도방법" } },
                    editable: { type: "select", data: { memory: "인도방법" }, validate: { rule: "required" } }
                },
                {
                    header: "인도기한", name: "dlv_ymd", width: 120, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "폐기(반환)방법", name: "close_tp", width: 100,
                    format: { type: "select", data: { memory: "폐기방법" } },
                    editable: { type: "select", data: { memory: "폐기방법" }, validate: { rule: "required" } }
                },
                {
                    header: "폐기(반환)일", name: "close_ymd", width: 120, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "유/무상", name: "free_yn", width: 100, align: "center",
                    format: { type: "radio", child: [{ title: "유상", value: "0" }, { title: "무상", value: "1" }] }
                    //,editable: { type: "radio", child: [{ title: "유상", value: "0" }, { title: "무상", value: "1" }] }
                },
                //{
                //    header: "무상", name: "free_yn", width: 100, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                //    //,editable: { type: "radio", child: [{ title: "유상", value: "0" }, { title: "무상", value: "1" }] }
                //},
                //{
                //    header: "제3자제공", name: "third_yn", width: 100, align: "center", hidden: true,
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                //    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                //},
                { name: "third_yn", hidden: true, editable: { type: "hidden" } },
                { name: "edit_yn", hidden: true, editable: { type: "hidden" } },
                { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                { name: "item_id", hidden: true, editable: { type: "hidden" } },
                { name: "editable", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //----------
        args.type = "GRID";
        args.text = "요청하고자 하는 기술자료에 대한 구체적 내용을 기술해 주시기 바랍니다.";
        addCaption(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_DETAIL1", query: "TDR_1020_3", title: "협력사 정보",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true, multi: false },
            element: [
                { header: "협력사명", name: "supp_nm", width: 300, display: true },
                {
                    header: "대표자명", name: "prsdnt_nm", width: 120,
                    editable: { type: "text", maxlength: 10, validate: { rule: "required" } }
                },
                {
                    header: "수신자명", name: "emp_nm", width: 120,
                    editable: { type: "text", maxlength: 10, validate: { rule: "required" } }
                },
                {
                    header: "부서", name: "dept_nm", width: 150,
                    editable: { type: "text", maxlength: 10 }
                },
                {
                    header: "직함", name: "pos_nm", width: 100,
                    editable: { type: "text", maxlength: 20 }
                },
                {
                    header: "E-Mail", name: "email", width: 300,
                    editable: { type: "text", maxlength: 50, validate: { rule: "required" } }
                },
                //{
                //    header: "제3자제공", name: "third_ok", width: 70, align: "center",
                //    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                //    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                //},
                { name: "third_ok", hidden: true, editable: { type: "hidden" } },
                { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                { name: "user_id", hidden: true, editable: { type: "hidden" } },
                { name: "user_seq", hidden: true, editable: { type: "hidden" } },
                { name: "supp_id", hidden: true, editable: { type: "hidden" } },
                { name: "editable", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_DETAIL2", query: "TDR_1020_4", title: "열람권자",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true },
            element: [
                { header: "직책", name: "pos_nm", width: 60, align: "center" },
                { header: "성명", name: "user_nm", width: 100 },
                { header: "소속", name: "dept_nm", width: 200 },
                { name: "user_tp_nm", hidden: true, editable: { type: "hidden" } },
                { name: "auth_tp", hidden: true, editable: { type: "hidden" } },
                { name: "user_tp", hidden: true, editable: { type: "hidden" } },
                { name: "user_id", hidden: true, editable: { type: "hidden" } },
                { name: "dept_cd", hidden: true, editable: { type: "hidden" } },
                { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                { name: "auth_id", hidden: true, editable: { type: "hidden" } },
                { name: "editable", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //----------
        args.type = "GRID";
        args.text = "&nbsp;";
        addCaption(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO1", query: "TDR_1020_5", type: "TABLE", title: "기술자료제공요청 목적",
            caption: true, width: "100%", show: true, selectable: true,
            editable: { bind: "editable", focus: "rmk", validate: true },
            content: {
                width: { field: "100%" },
                row: [
                    {
                        element: [
                            {
                                name: "rmk",
                                format: { type: "textarea", rows: 6 },
                                editable: {
                                    type: "textarea", rows: 6, maxlength: 2000,
                                    placeholder: "예) SDC向 5.5G PECVD 장비에 부속될 Susceptor 구매 및 사양 확정 목적"
                                }
                            },
                            { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                            { name: "rmk_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "rmk_id", hidden: true, editable: { type: "hidden" } },
                            { name: "editable", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //----------
        args.type = "FORM";
        args.text = "협력사로부터 제공받고자 하는 기술자료에 대한 명확한 목적을 기재해 주시기 바랍니다.";
        addCaption(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO2", query: "TDR_1020_6", type: "TABLE", title: "제3자 자료제공 동의 요청",
            caption: true, width: "100%", show: false, selectable: true,
            editable: { bind: "editable", focus: "rmk", validate: true },
            content: {
                width: { field: "100%" },
                row: [
                    {
                        element: [
                            {
                                name: "rmk",
                                format: { type: "textarea", rows: 3 },
                                editable: { type: "textarea", rows: 3, maxlength: 2000 }
                            },
                            { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                            { name: "rmk_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "rmk_id", hidden: true, editable: { type: "hidden" } },
                            { name: "editable", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_THIRD", query: "TDR_1020_7", title: "제3자 제공동의",
            caption: true, height: 80, pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "editable", validate: true },
            element: [
                { name: "third_nm", header: "회사명", width: 100, editable: { type: "text", maxlength: 80, validate: { rule: "required" } } },
                { name: "dept_nm", header: "소속", width: 100, editable: { type: "text", maxlength: 20, validate: { rule: "required" } } },
                { name: "emp_nm", header: "성명", width: 60, editable: { type: "text", maxlength: 20, validate: { rule: "required" } } },
                { name: "third_rmk", header: "사유", width: 280, editable: { type: "text", maxlength: 80, validate: { rule: "required" } } },
                { name: "third_id", hidden: true, editable: { type: "hidden" } },
                { name: "tdr_no", hidden: true, editable: { type: "hidden" } },
                { name: "rmk_edit", hidden: true },
                //{ name: "rmk_edit", header: "사유", width: 100, align: "center", format: { type: "link" } },
                { name: "editable", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //----------
        args.type = "GRID";
        args.text = "협력사로부터 제공받은 기술자료의 전부 또는 일부를 제3자에게 제공하는 경우 작성해 주시기 바랍니다.";
        addCaption(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //=====================================================================================
        // Field Header Tip 
        //=====================================================================================
        var args = {
            targetid: "frmData_MAIN", type: "FORM",
            element: [
                { name: "label_tdr_no", text: "" },
                { name: "label_purpose_cd", text: "" },
                { name: "label_edit_yn", text: "협력사의 기술자료는 Viewer 형태로 변환하여 저장되기 때문에 파일 편집이 필요한 경우에는 본 요청을 체크하여 주시기 바랍니다." },
                { name: "label_rqst_user", text: "" },
                { name: "label_rqst_date", text: "" },
                { name: "label_rqst_title", text: "" },
                { name: "label_third_yn", text: "" },
                { name: "label_appr_user", text: "" },
                { name: "label_appr_date", text: "" }
            ]
        };
        gw_com_api.setHelp(args);
        //----------
        var args = {
            targetid: "grdData_SUB", type: "GRID",
            element: [
                { name: "_NO", text: "" },
                { name: "item_group", text: "" },
                { name: "item_nm", text: "" },
                { name: "dlv_tp", text: "< 인도방법 >\n 협력사로부터 기술자료를 전달 받을\n 방법을 지정해 주시기 바랍니다." },
                { name: "dlv_ymd", text: "< 인도기한 >\n 협력사로부터 기술자료를 전송 받고자\n 희망하는 기한을 지정해 주시기 바랍니다." },
                { name: "close_tp", text: "" },
                { name: "close_ymd", text: "" },
                { name: "free_yn", text: "" },
                { name: "edit_yn", text: "" }
            ]
        };
        gw_com_api.setHelp(args);

        //=====================================================================================
        // Resize Objects
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 },
                { type: "GRID", id: "grdData_DETAIL1", offset: 8 },
                { type: "GRID", id: "grdData_DETAIL2", offset: 8 },
                { type: "FORM", id: "frmData_MEMO1", offset: 8 },
                { type: "FORM", id: "frmData_MEMO2", offset: 8 },
                { type: "GRID", id: "grdData_THIRD", offset: 8 }
            ]
        }; gw_com_module.objResize(args);
        gw_com_module.informSize();

    },
    // end UI()

    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //=====================================================================================
        // Button Events : click
        //=====================================================================================
        // Button : Main
        var args = { targetid: "lyrMenu", element: "예시", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "요청", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "HELP", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);

        // Button : 요청자료
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_SUB", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);

        // Button : 협력사
        var args = { targetid: "lyrMenu_DETAIL1", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_DETAIL1", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_DETAIL1", element: "업체등록", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_DETAIL1", element: "업체수정", event: "click", handler: processClick };
        gw_com_module.eventBind(args);

        // Button : 열람자
        var args = { targetid: "lyrMenu_DETAIL2", element: "사원추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_DETAIL2", element: "부서추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_DETAIL2", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);

        // Button : 제3자 제공
        var args = { targetid: "lyrMenu_THIRD", element: "3자추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_THIRD", element: "3자삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);

        //=====================================================================================
        // Form & Grid Events : click, itemchanged
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_DETAIL1", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //var args = { targetid: "grdData_THIRD", grid: true, element: "rmk_edit", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);

        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "예시":
                    {
                        var win = window.open("/Help/TDR_1020.htm", "TDR_HELP", "height=400, width=1050");
                    }
                    break;
                case "삭제":
                case "3자삭제":
                    {
                        if (!checkManipulate({})) return;
                        if (param.object == "lyrMenu") {
                            checkRemovable({});
                        } else {
                            var obj = "grdData_" + param.object.split("_")[1];
                            var args = { targetid: obj, row: "selected", row: "selected" };
                            gw_com_module.gridDelete(args);
                        }
                    }
                    break;
                case "저장":
                    {
                        if (!checkManipulate({})) return;
                        processSave({});
                    }
                    break;
                case "요청":
                case "취소":
                    {
                        if (!checkManipulate({})) return;

                        // 제3자 삭제 확인
                        var msg = new Array();
                        if (param.element == "요청") {
                            if (gw_com_api.getValue("frmData_MAIN", 1, "third_yn") != "1" && gw_com_api.getRowCount("grdData_THIRD") > 0) {
                                msg.push({ text: "< 입력 오류 경고 >" });
                                msg.push({ text: "제3자 제공 여부를 Check하지않았습니다." });
                                msg.push({ text: "제3자 제공동의 정보가 자동 삭제됩니다." });
                                msg.push({ text: "-" });
                            }
                        }

                        var act = (param.element == "요청" ? "Request" : "Cancel");
                        var args = { handler: processBatch, param: { act: act } };
                        if (checkUpdatable2({})) {
                            args.handler = processSave;
                            args.param = { handler: processBatch, param: { act: act } };
                        }


                        msg.push({ text: param.element + " 처리하시겠습니까?" });
                        gw_com_api.messageBox(msg, 400,
                            gw_com_api.v_Message.msg_confirmBatch, "YESNO", args);
                    }
                    break;
                case "닫기":
                    { processClose({});
                    } break;
                case "HELP":
                    {
                        var win = window.open('../Files/Manual/GW_Masual_기술자료제공(IPS).pdf');
                    } break;
                case "추가":
                    {
                        if (!checkManipulate({})) return;
                        if (param.object == "lyrMenu_DETAIL1") {

                            var args = {
                                page: "TDR_1021",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue
                                }
                            };
                            gw_com_module.dialogueOpen(args);

                        } else {

                            var obj = "grdData_" + param.object.split("_")[1];
                            var data = [
                                { name: "tdr_no", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
                                { name: "dlv_tp", rule: "COPY", row: "prev" },
                                { name: "dlv_ymd", rule: "COPY", row: "prev" },
                                { name: "close_tp", rule: "COPY", row: "prev" },
                                { name: "close_ymd", rule: "COPY", row: "prev" },
                                { name: "free_yn", value: "1" },
                                { name: "third_yn", value: "0" },
                                { name: "third_ok", value: "0" },
                                { name: "editable", value: "1" }
                            ];
                            var args = {
                                targetid: obj, edit: true, updatable: true,
                                data: data
                            };
                            gw_com_module.gridInsert(args);
                        }
                    }
                    break;
                case "사원추가":
                    {
                        if (!checkManipulate({})) return;
                        var args = {
                            page: "DLG_EMPLOYEE",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "부서추가":
                    {
                        if (!checkManipulate({})) return;
                        var args = {
                            page: "w_find_dept_tree",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "업체등록":
                    { processSuppAdd(param); } break;
                case "업체수정":
                    { processSuppAdd(param); } break;
                case "download":
                    {
                        gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown" });
                    }
                    break;
                case "3자추가":
                    {
                        if (!checkManipulate({})) return;
                        if (gw_com_api.getValue("frmData_MAIN", 1, "third_yn") != "1") {
                            var p = {
                                handler: function (param) {
                                    gw_com_api.setValue("frmData_MAIN", 1, "third_yn", "1");
                                    processInsert({ third: true });
                                },
                                param: param
                            };
                            gw_com_api.messageBox([
                                { text: "제3자 제공 여부를 자동 Check 합니다." }
                            ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                        } else
                            processInsert({ third: true });
                    }
                    break;
                case "rmk_edit":
                    {
                        processMemo({});
                    }
                    break;
            }

        }

        //=====================================================================================
        function processItemchanged(param) {

            var tmpVar1 = ""; var tmpVar2 = "";

            switch (param.element) {
                case "dlv_ymd":
                case "close_ymd": {
                    if (param.value.current > "") {
                        var DlvYmd = gw_com_api.getValue(param.object, param.row, "dlv_ymd", (param.type == "GRID"));
                        var CloseYmd = gw_com_api.getValue(param.object, param.row, "close_ymd", (param.type == "GRID"));
                        // 인도일 < 폐기일
                        if (DlvYmd > "" && CloseYmd > "" && DlvYmd > CloseYmd) {
                            gw_com_api.messageBox([{ text: "인도기한은 페기(반환)일 이전이어야 합니다." }]);
                            //gw_com_api.setValue(param.object, param.row, param.element, param.value.prev, (param.type == "GRID"));
                        }
                        // 인도일 + 2년 > 폐기일
                        var MaxYmd = gw_com_api.toTimeString(new Date(DlvYmd.substr(0, 4), DlvYmd.substr(4, 2) - 1, DlvYmd.substr(6, 2)), { month: 24 }).substr(0, 8);
                        if (DlvYmd > "" && CloseYmd > "" && CloseYmd >= MaxYmd ) {
                            gw_com_api.messageBox([{ text: "요청 기간이 2년을 초과하였습니다." }]);
                            gw_com_api.setError(true, "grdData_SUB", this, "dlv_ymd", true);
                        }

                    }
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

    }
    // end procedure()

};
// end gw_job_process class

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Custom Function : Retrieve
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: v_global.logic.key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN" }
        ],
        clear: [
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
        ],
        handler_complete: completeRetrieve
    };
    gw_com_module.objRetrieve(args);

}
//----------
function completeRetrieve(param) {

    v_global.logic.rqst_yn = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn");
    v_global.logic.appr_yn = gw_com_api.getValue("frmData_MAIN", 1, "appr_yn");
    v_global.logic.supp_yn = gw_com_api.getValue("frmData_MAIN", 1, "supp_yn");

    assignLabel({});
    toggleButton({});
    linkRetrieve({});

}
//----------
function linkRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_id") },
                { name: "arg_tdr_no", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
                { name: "arg_item_id", value: "0" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
        ]
    };
    gw_com_module.objRetrieve(args);

}

// Custom Function : Check
//----------
function checkManipulate(param) {

    if (gw_com_api.getCRUD("frmData_MAIN") == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
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
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkUpdatable2(param) {

    var updatable = false;
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
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
//----------
function checkRemovable(param) {

    var status = gw_com_api.getCRUD("frmData_MAIN");
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}

// Custom Function : Edit
//----------
function processCopy(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: v_global.logic.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MAIN", query: $("#frmData_MAIN").attr("query") + "_I", crud: "insert" }
        ],
        clear: [
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
        ],
        handler_complete: completeCopy
    };
    gw_com_module.objRetrieve(args);

}
//----------
function completeCopy(param) {

    v_global.logic.rqst_yn = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn");
    v_global.logic.appr_yn = gw_com_api.getValue("frmData_MAIN", 1, "appr_yn");
    v_global.logic.supp_yn = gw_com_api.getValue("frmData_MAIN", 1, "supp_yn");

    toggleButton({});
    linkCopy({});

    var param = {
        targetid: "frmData_MAIN",
        edit: true
    };
    gw_com_module.formEdit(param);

}
//----------
function linkCopy(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_tdr_id", value: v_global.logic.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_SUB", query: $("#grdData_SUB_data").attr("query") + "_I", crud: "insert" },
            { type: "GRID", id: "grdData_DETAIL1", query: $("#grdData_DETAIL1_data").attr("query") + "_I", crud: "insert" },
            { type: "GRID", id: "grdData_DETAIL2", query: $("#grdData_DETAIL2_data").attr("query") + "_I", crud: "insert" },
            { type: "FORM", id: "frmData_MEMO1", query: $("#frmData_MEMO1").attr("query") + "_I", crud: "insert" },
            { type: "FORM", id: "frmData_MEMO2", query: $("#frmData_MEMO2").attr("query") + "_I", crud: "insert" },
            { type: "GRID", id: "grdData_THIRD", query: $("#grdData_THIRD_data").attr("query") + "_I", crud: "insert" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    if (param.third) {

        var args = {
            targetid: "grdData_THIRD", edit: true, updatable: true,
            data: [
                { name: "third_id", value: "0" },
                { name: "tdr_no", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
                { name: "rmk_edit", value: "등록" },
                { name: "editable", value: "1" }
            ]
        };
        gw_com_module.gridInsert(args);
        //processMemo({});

    } else if (param.detail1) {

        var row = gw_com_api.getFindRow("grdData_DETAIL1", "user_id", param.data.user_id);
        row = 0;    //중복 추가 허용 at 2019.12.30 by JJ
        if (row > 0 && gw_com_api.getValue("", row, "", true) == param.data.emp_email) {
            gw_com_api.selectRow("grdData_DETAIL1", row, true);
            gw_com_api.setValue("grdData_DETAIL1", row, "user_seq", param.data.user_seq, true);
            gw_com_api.setValue("grdData_DETAIL1", row, "prsdnt_nm", param.data.prsdnt_nm, true);
            gw_com_api.setValue("grdData_DETAIL1", row, "emp_nm", param.data.emp_nm, true);
            gw_com_api.setValue("grdData_DETAIL1", row, "dept_nm", param.data.dept_nm, true);
            gw_com_api.setValue("grdData_DETAIL1", row, "pos_nm", param.data.pos_nm, true);
            gw_com_api.setValue("grdData_DETAIL1", row, "email", param.data.emp_email, true);
            gw_com_api.messageBox([{ text: "제공업체 정보를 변경하였습니다." }]);
        } else {
            var data = [
                { name: "tdr_no", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
                { name: "user_id", value: param.data.user_id },
                { name: "user_seq", value: param.data.user_seq },
                { name: "supp_nm", value: param.data.supp_nm },
                { name: "prsdnt_nm", value: param.data.prsdnt_nm },
                { name: "emp_nm", value: param.data.emp_nm },
                { name: "dept_nm", value: param.data.dept_nm },
                { name: "pos_nm", value: param.data.pos_nm },
                { name: "email", value: param.data.emp_email },
                { name: "third_ok", rule: "COPY", row: "prev" }
            ]
            var args = {
                targetid: "grdData_DETAIL1", edit: true, updatable: true,
                data: data
            };
            gw_com_module.gridInsert(args);
            gw_com_api.messageBox([{ text: "제공업체 정보를 추가하였습니다." }]);
        }

    } else {

        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "tdr_id", value: 0 },
                { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
                { name: "rqst_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rqst_user_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "rqst_dt", value: "SYSDT" },
                { name: "rqst_date", value: gw_com_api.getDate() },
                { name: "rqst_yn", value: "-" },
                { name: "appr_yn", value: "-" },
                { name: "third_yn", value: "0" }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_DETAIL1" },
                { type: "GRID", id: "grdData_DETAIL2" },
                { type: "FORM", id: "frmData_MEMO1" },
                { type: "FORM", id: "frmData_MEMO2" }
            ]
        };
        gw_com_module.formInsert(args);
        //----------
        var args = {
            targetid: "frmData_MEMO1", edit: true, updatable: true,
            data: [
                { name: "rmk_cd", value: "P" }
            ]
        };
        gw_com_module.formInsert(args);
        //----------
        var args = {
            targetid: "frmData_MEMO2", edit: true, updatable: true,
            data: [
                { name: "rmk_cd", value: "T" }
            ]
        };
        gw_com_module.formInsert(args);
        //----------
        gw_com_api.setFocus("frmData_MAIN", 1, "purpose_cd");

    }
}
//----------
function processDelete(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processMemo(param) {

    v_global.event.object = "grdData_THIRD";
    v_global.event.row = "selected";
    v_global.event.element = "third_rmk";
    v_global.event.type = "GRID";
    v_global.event.data = {
        edit: (gw_com_api.getValue(v_global.event.object, v_global.event.row, "editable", (v_global.event.type == "GRID")) == "1"),
        rows: 14,
        title: "제3자 제공 사유", maxlength: 10,
        text: gw_com_api.getValue("grdData_THIRD", "selected", "third_rmk", true)
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
//----------
function validate(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
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


    if (gw_com_api.getRowCount("grdData_SUB") < 1) {
        gw_com_api.messageBox([{ text: "요청자료가 등록되지 않았습니다." }]);
        return false;
    }

    // 인도기한 < 폐기일 확인
    var update = true;
    var ids = gw_com_api.getRowIDs("grdData_SUB");
    $.each(ids, function () {
        var DlvYmd = gw_com_api.getValue("grdData_SUB", this, "dlv_ymd", true);
        var CloseYmd = gw_com_api.getValue("grdData_SUB", this, "close_ymd", true);
        if (DlvYmd > "" && CloseYmd > "" && DlvYmd > CloseYmd) {
            update = false;
            gw_com_api.messageBox([{ text: "인도기한은 페기(반환)일 이전이어야 합니다." }]);
            gw_com_api.setError(true, "grdData_SUB", this, "dlv_ymd", true);
            gw_com_api.setError(true, "grdData_SUB", this, "close_ymd", true);
            return false;
        }

        var CloseYmd2 = gw_com_api.toTimeString(new Date(DlvYmd.substr(0, 4), DlvYmd.substr(4, 2) - 1, DlvYmd.substr(6, 2)), { month: 24 }).substr(0, 8);
        if (CloseYmd2 <= CloseYmd) {
            update = false;
            gw_com_api.messageBox([{ text: "요청 기간이 2년을 초과하였습니다." }]);
            gw_com_api.setError(true, "grdData_SUB", this, "dlv_ymd", true);
            gw_com_api.setError(true, "grdData_SUB", this, "close_ymd", true);
            return false;
        }
        gw_com_api.setError(false, "grdData_SUB", this, "dlv_ymd", true);
        gw_com_api.setError(false, "grdData_SUB", this, "close_ymd", true);

    })
    if (!update) {
        return false;
    }


    // 요청목적 필수 입력
    var sRmk = gw_com_api.getValue("frmData_MEMO1", 1, "rmk");
    if ($.trim(sRmk) == "") {
        gw_com_api.messageBox([{ text: "요청목적을 기재하지 않았습니다." }]);
        return false;
    }

    // 제3자 필수 입력
    if (gw_com_api.getValue("frmData_MAIN", 1, "third_yn") == "1" && gw_com_api.getRowCount("grdData_THIRD") < 1) {
        gw_com_api.messageBox([{ text: "제3자 제공동의 대상이 등록되지 않았습니다." }]);
        return false;
    }

    var update = true;
    var ids = gw_com_api.getRowIDs("grdData_THIRD");
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_THIRD", this, "third_rmk", true) == "") {
            gw_com_api.setFocus("grdData_THIRD", this, "rmk_edit", true);
            gw_com_api.selectRow("grdData_THIRD", this, true);
            update = false;
            return false;
        }
    })
    if (!update) {
        gw_com_api.messageBox([{ text: "제3자 제공 사유가 등록되지 않았습니다." }]);
        return false;
    }

    // 제공업체 필수 입력
    if (gw_com_api.getRowCount("grdData_DETAIL1") < 1) {
        gw_com_api.messageBox([{ text: "협력사 정보가 등록되지 않았습니다." }]);
        return false;
    }

    update = true;
    ids = gw_com_api.getRowIDs("grdData_DETAIL1");
    $.each(ids, function () {
        if (!gw_com_api.isEmail(gw_com_api.getValue("grdData_DETAIL1", this, "email", true))) {
            gw_com_api.setError(true, "grdData_DETAIL1", this, "email", false);
            gw_com_api.setFocus("grdData_DETAIL1", this, "email", true);
            gw_com_api.selectRow("grdData_DETAIL1", this, true);
            update = false;
            return false;
        }
    })
    if (!update) {
        gw_com_api.messageBox([{ text: "이메일 형식이 부적합합니다." }]);
        return false;
    }

    return true;

}
//----------
function processSave(param) {

    if (!validate({})) return;
    
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
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
//----------
function successSave(response, param) {

    if (v_global.logic.key == "") {
        var tdr_no = "";
        $.each(response, function () {
            $.each(this.KEY, function () {
                if (this.NAME == "tdr_no") {
                    tdr_no = this.VALUE;
                    return false;
                }
            });
        });
        var args = {
            request: "PAGE",
            name: "TDR_1020_1_ID",
            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                "?QRY_ID=TDR_1020_1_ID" +
                "&QRY_COLS=tdr_id,tdr_no" +
                "&CRUD=R" +
                "&arg_tdr_no=" + tdr_no,
            async: false,
            handler_success: successRequest
        };
        //----------
        gw_com_module.callRequest(args);
        //----------
        function successRequest(data) {
            if (data.DATA != undefined && data.DATA.length > 0) {
                v_global.logic.key = data.DATA[0];
                // 저장 후 Batch 실행 용 임시 처리
                gw_com_api.setValue("frmData_MAIN", 1, "tdr_id", v_global.logic.key);
                gw_com_api.setValue("frmData_MAIN", 1, "tdr_no", data.DATA[1]);
                //processRetrieve({});
            }
        }
    }

    if (param.handler != undefined) {
        //processRetrieve({});
        param.handler(param.param);
    } else {
        refreshPage({ page: "TDR_1010" });
        processRetrieve({});
    }

}
//----------
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN", key: { element: [{ name: "tdr_id" }] } }
        ],
        handler: { success: successRemove }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    //processDelete({});
    refreshPage({ page: "TDR_1010" });
    processClose({});

}

// Custom Function : Batch
//----------
function processBatch(param) {

    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_TDR_Request",
        input: [
            { name: "JobCd", value: param.act, type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_id"), type: "int" },
            { name: "RootNo", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no"), type: "varchar" },
            { name: "Option", value: "", type: "varchar" }
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
//----------
function successBatch(response, param) {

    if (response.VALUE[0] != "") {

        var msg = new Array();
        $.each(response.VALUE[0].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        refreshPage({ page: "TDR_1010" });
        gw_com_api.messageBox(msg, 500);
    }

    //processRetrieve({});

    processClose({});

}

// Custom Function : Page
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_DETAIL1" },
            { type: "GRID", id: "grdData_DETAIL2" },
            { type: "FORM", id: "frmData_MEMO1" },
            { type: "FORM", id: "frmData_MEMO2" },
            { type: "GRID", id: "grdData_THIRD" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

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
function refreshPage(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_refreshPage,
        to: { type: "MAIN" },
        data: { page: param.page }
    };
    gw_com_module.streamInterface(args);

}
//----------
function assignLabel(param) {

    //if (v_global.logic.appr_yn == "1")
    //    v_global.logic.remark = "요청 승인";
    //else if (v_global.logic.appr_yn == "R")
    //    v_global.logic.remark = "요청 반려";
    //else if (v_global.logic.rqst_yn == "0")
    //    v_global.logic.remark = "요청 대기";
    //else
    //    v_global.logic.remark = "작성 중";
    v_global.logic.remark = gw_com_api.getValue("frmData_MAIN", 1, "rqst_yn_nm");
    var args = { targetid: "lyrRemark",
        row: [
            { name: "TEXT", value: " [상태 : " + v_global.logic.remark + "]" }
        ]
    }; gw_com_module.labelAssign(args);

}
//----------
function toggleButton(param) {

    if (v_global.logic.appr_yn == "1") {
        gw_com_api.hide("lyrMenu", "요청");
        gw_com_api.hide("lyrMenu", "취소");
        gw_com_api.hide("lyrMenu", "삭제");
        gw_com_api.hide("lyrMenu", "저장");
        gw_com_api.hide("lyrMenu_SUB", "추가");
        gw_com_api.hide("lyrMenu_SUB", "삭제");
        gw_com_api.hide("lyrMenu_DETAIL1", "추가");
        gw_com_api.hide("lyrMenu_DETAIL1", "삭제");
        gw_com_api.hide("lyrMenu_DETAIL1", "업체등록");
        gw_com_api.hide("lyrMenu_DETAIL2", "사원추가");
        gw_com_api.hide("lyrMenu_DETAIL2", "부서추가");
        gw_com_api.hide("lyrMenu_DETAIL2", "삭제");
        gw_com_api.hide("lyrMenu_THIRD", "3자추가");
        gw_com_api.hide("lyrMenu_THIRD", "3자삭제");
    }
    else if (v_global.logic.rqst_yn == "0") {
        gw_com_api.hide("lyrMenu", "요청");
        gw_com_api.show("lyrMenu", "취소");
        gw_com_api.hide("lyrMenu", "삭제");
        gw_com_api.hide("lyrMenu", "저장");
        gw_com_api.hide("lyrMenu_SUB", "추가");
        gw_com_api.hide("lyrMenu_SUB", "삭제");
        gw_com_api.hide("lyrMenu_DETAIL1", "추가");
        gw_com_api.hide("lyrMenu_DETAIL1", "삭제");
        gw_com_api.hide("lyrMenu_DETAIL1", "업체등록");
        gw_com_api.hide("lyrMenu_DETAIL2", "사원추가");
        gw_com_api.hide("lyrMenu_DETAIL2", "부서추가");
        gw_com_api.hide("lyrMenu_DETAIL2", "삭제");
        gw_com_api.hide("lyrMenu_THIRD", "3자추가");
        gw_com_api.hide("lyrMenu_THIRD", "3자삭제");
    }
    else {
        gw_com_api.show("lyrMenu", "요청");
        gw_com_api.hide("lyrMenu", "취소");
        gw_com_api.show("lyrMenu", "삭제");
        gw_com_api.show("lyrMenu", "저장");
        gw_com_api.show("lyrMenu_SUB", "추가");
        gw_com_api.show("lyrMenu_SUB", "삭제");
        gw_com_api.show("lyrMenu_DETAIL1", "추가");
        gw_com_api.show("lyrMenu_DETAIL1", "삭제");
        gw_com_api.show("lyrMenu_DETAIL1", "업체등록");
        gw_com_api.show("lyrMenu_DETAIL2", "사원추가");
        gw_com_api.show("lyrMenu_DETAIL2", "부서추가");
        gw_com_api.show("lyrMenu_DETAIL2", "삭제");
        gw_com_api.show("lyrMenu_THIRD", "3자추가");
        gw_com_api.show("lyrMenu_THIRD", "3자삭제");
    }

}
//----------
function processSuppAdd(param) {

    var user_id = "";
    if (param.element == "업체수정") {
        if (gw_com_api.getRowCount("grdData_DETAIL1") < 1) {
            gw_com_api.messageBox([{ text: "수정 대상 협력사를 선택하여야 합니다." }]);
            return;
        }
        else
            user_id = gw_com_api.getValue("grdData_DETAIL1", "selected", "user_id", true);
    }
    // Open 협력사 등록
    var args = {
        page: "DLG_SUPPLIER_ADD",
        param: {
            ID: gw_com_api.v_Stream.msg_openedDialogue
            , data: { user_id: gw_com_api.getValue("grdData_DETAIL1", "selected", "user_id", true) }
        }
    }; gw_com_module.dialogueOpen(args);

}
//----------
function addCaption(param) {

    var ele;
    var cap = $("<span style='color: #595959; margin-left: 32px;'>" + param.text.toString().replace(/"/g, '\\"') + "</span>");
    if (param.type == "GRID") {
        ele = $("#" + param.targetid).find("span.ui-jqgrid-title");
    } else {
        ele = $("#" + param.targetid + "_caption");
    }
    $(ele).parent().append("<br/>");
    $(ele).parent().append(cap);
    // 참고 : $(ele)[0].firstChild.data = "◈ 제목";
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
                                processSave(param.data.arg);
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
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
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                switch (param.from.page) {
                    case "w_find_dept_tree":
                        {
                            if (param.data != undefined) {
                                var tdr_no = gw_com_api.getValue("frmData_MAIN", 1, "tdr_no");
                                var cnt = 0;
                                $.each(param.data, function () {
                                    if (gw_com_api.getFindRow("grdData_DETAIL2", "user_id", this.dept_cd) <= 0) {
                                        var data = [
                                            { name: "tdr_no", value: tdr_no },
                                            { name: "user_tp", value: "DEPT" },
                                            { name: "pos_nm", value: "부서" },
                                            { name: "user_tp_nm", value: "부서" },
                                            { name: "user_id", value: this.dept_cd },
                                            { name: "user_nm", value: this.dept_nm },
                                            { name: "dept_cd", value: this.pdept_cd },
                                            { name: "dept_nm", value: this.pdept_nm },
                                            { name: "auth_tp", rule: "COPY", row: "prev" }
                                        ]
                                        var args = { targetid: "grdData_DETAIL2", edit: true, updatable: true, data: data
                                        }; gw_com_module.gridInsert(args);
                                        cnt++;
                                    }
                                });
                                gw_com_api.messageBox([{ text: cnt + "개의 부서를 추가하였습니다." }]);
                            }
                        }
                        break;
                    case "DLG_SUPPLIER_ADD":
                        {
                            if (param.data == undefined) break;
                            var p = {
                                handler: function (param) {
                                    var args = {
                                        request: "PAGE", name: "TDR_1021_1", async: false, handler_success: successRequest,
                                        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                                            "?QRY_ID=TDR_1021_1" +
                                            "&QRY_COLS=user_id,supp_cd,supp_nm,rgst_no,addr,prsdnt_nm,emp_nm,dept_nm,pos_nm,emp_email,emp_mobile,emp_tel,emp_fax" +
                                            "&CRUD=R" +
                                            "&arg_supp_nm=&arg_rgst_no=&arg_user_id=" + param.user_id
                                    };
                                    gw_com_module.callRequest(args);

                                    function successRequest(data) {
                                        if (data.DATA != undefined && data.DATA.length > 0) {
                                            var args = {
                                                detail1: true,
                                                data: {
                                                    user_id: data.DATA[0],
                                                    supp_cd: data.DATA[1],
                                                    supp_nm: data.DATA[2],
                                                    rgst_no: data.DATA[3],
                                                    addr: data.DATA[4],
                                                    prsdnt_nm: data.DATA[5],
                                                    emp_nm: data.DATA[6],
                                                    dept_nm: data.DATA[7],
                                                    pos_nm: data.DATA[8],
                                                    emp_email: data.DATA[9],
                                                    emp_mobile: data.DATA[10],
                                                    emp_tel: data.DATA[11],
                                                    emp_fax: data.DATA[12]
                                                }
                                            }; processInsert(args);
                                        }
                                    }
                                },
                                param: param.data
                            };
                            gw_com_api.messageBox([{ text: "새로 등록된 업체를 추가 하시겠습니까?" }], 450, gw_com_api.v_Message.msg_confirmBatch, "YESNO", p);
                        } break;
                    case "TDR_1021":
                        {
                            if (param.data != undefined) {

                                if (param.data == "CREATE")
                                    processSuppAdd({});

                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {

                    var row = gw_com_api.getFindRow("grdData_DETAIL2", "user_id", param.data.user_id);
                    if (row > 0) {

                        gw_com_api.messageBox([{ text: "이미 등록된 사원입니다." }]);

                    } else {

                        var data = [
                            { name: "tdr_no", value: gw_com_api.getValue("frmData_MAIN", 1, "tdr_no") },
                            { name: "user_tp", value: "EMP" },
                            { name: "user_tp_nm", value: "사원" },
                            { name: "user_id", value: param.data.user_id },
                            { name: "user_nm", value: param.data.user_nm },
                            { name: "dept_cd", value: param.data.dept_cd },
                            { name: "dept_nm", value: param.data.dept_nm },
                            { name: "pos_nm", value: param.data.pos_nm },
                            { name: "auth_tp", rule: "COPY", row: "prev" }
                        ]
                        var args = {
                            targetid: "grdData_DETAIL2", edit: true, updatable: true,
                            data: data
                        };
                        gw_com_module.gridInsert(args);
                        gw_com_api.messageBox([{ text: "사원 정보를 추가하였습니다." }]);

                    }


                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedData:
            {
                if (param.data != undefined) {
                    if (param.from.page == "TDR_1021") {
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
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "rmk_edit", (param.data.text == "" ? "등록" : "편집"), (v_global.event.type == "GRID"));
                }
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}
// end streamProcess(param)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//