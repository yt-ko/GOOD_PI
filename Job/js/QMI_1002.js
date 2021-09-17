//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                {
                    type: "PAGE", name: "상태구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI11" }]
                },
                {
                    type: "PAGE", name: "용도별분류", query: "DDDW_QMI_TP1"
                },
                {
                    type: "PAGE", name: "변동구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI31" }]
                },
                {
                    type: "PAGE", name: "부속상태구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI21" }]
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "ALL" }]
                },
                { type: "PAGE", name: "보관부서", query: "dddw_dept" },
                //{
                //    type: "INLINE", name: "교정주기",
                //    data: [{ title: "1년", value: "12" }, { title: "2년", value: "24" }, { title: "3년", value: "36" }, { title: "4년", value: "48" }, { title: "5년", value: "60" }]
                //},
                {
                    type: "PAGE", name: "교정주기", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI51" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // start();
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            //----------
            v_global.logic.qmi_key = gw_com_api.getPageParameter("qmi_key");
            if (v_global.logic.qmi_key != "")
                processRetrieve({});
            else
                processInsert({ object: "frmData_MASTER" });

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

        ////=====================================================================================
        //var args = {
        //    targetid: "lyrMenu_1", type: "FREE",
        //    element: [
        //		{ name: "업체", value: "구입처관리", icon: "기타" },
        //		{ name: "분류", value: "분류관리", icon: "기타" }
        //    ]
        //};
        ////----------
        //gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", icon: "조회" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                //{ name: "출력", value: "이력카드", icon: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_PART", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_CHANGE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_LEND", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);


        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_MEMO", type: "FREE",
            element: [
                { name: "편집", value: "편집", icon: "추가" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);

        //=====================================================================================
        var args = {
            targetid: "frmData_MASTER", query: "QMI_1002_1", type: "TABLE", title: "계측기 정보",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "qmi_nm", validate: true },
            content: {
                width: { label: 90, field: 180 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "qmi_no", align: "center", editable: { type: "hidden" } },
                            { header: true, value: "기기명", format: { type: "label" } },
                            { name: "qmi_nm", editable: { type: "text", validate: { rule: "required" } } },
                            { header: true, value: "상태구분", format: { type: "label" } },
                            {
                                name: "pstat", format: { type: "select", data: { memory: "상태구분" } },
                                editable: { type: "select", data: { memory: "상태구분", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" } }
                            },
                            { header: true, value: "Model No.", format: { type: "label" } },
                            { name: "model_no", editable: { type: "text", validate: { rule: "required" } } },
                            { name: "qmi_key", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Serial No.", format: { type: "label" } },
                            { name: "ser_no", editable: { type: "text" } },
                            { header: true, value: "제조사", format: { type: "label" } },
                            { name: "maker_nm", editable: { type: "text", validate: { rule: "required" } } },
                            { header: true, value: "구매/생산일자", format: { type: "label" } },
                            {
                                name: "pur_date", mask: "date-ymd",
                                editable: { type: "text"/*, validate: { rule: "required" }*/ }
                            },
                            { header: true, value: "구매가격", format: { type: "label" } },
                            { name: "pur_price", editable: { type: "text" }, mask: "numeric-int" },
                            { name: "reg_date", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교정여부", format: { type: "label" } },
                            {
                                name: "calibrate_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "교정주기", format: { type: "label" } },
                            {
                                name: "calibrate_term", format: { type: "select", data: { memory: "교정주기" } },
                                editable: { type: "select", data: { memory: "교정주기", unshift: [{ title: "-", value: "" }] } }
                            },
                            { header: true, value: "차기교정일", format: { type: "label" } },
                            { name: "next_calibrate_date", editable: { type: "hidden", width: 200 }, mask: "date-ymd", display: true },
                            { header: true, value: "비교정사유", format: { type: "label" } },
                            { name: "calibrate_reason", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            {
                                name: "dept_area", format: { type: "select", data: { memory: "장비군" } },
                                editable: { type: "select", data: { memory: "장비군", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" } }
                            },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "mng_emp_nm", editable: { type: "text", validate: { rule: "required" } }, mask: "search", display: true },
                            { name: "mng_emp", editable: { type: "text" }, hidden: true },
                            { header: true, value: "관리부서", format: { type: "label" } },
                            { name: "mng_dept_nm", editable: { type: "text", validate: { rule: "required" } }, mask: "search", display: true },
                            { name: "mng_dept", editable: { type: "text" }, hidden: true },
                            { header: true, value: "용도별분류", format: { type: "label" } },
                            {
                                name: "class1_cd", format: { type: "select", data: { memory: "용도별분류" } },
                                editable: { type: "select", data: { memory: "용도별분류" }, validate: { rule: "required" }, bind: "create" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "보관위치", format: { type: "label" } },
                            { name: "keep_spot", editable: { type: "text", validate: { rule: "required" }, width: 460 }, style: { colspan: 3 } },
                            { header: true, value: "비고", format: { type: "label" } },
                            { name: "mng_rmk", editable: { type: "text", width: 460 }, style: { colspan: 3 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PART", query: "QMI_1002_3", title: "부속품",
            caption: true, height: 475, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, multi: true, bind: "select", focus: "part_nm", validate: true },
            element: [
                {
                    header: "부속품명", name: "part_nm", width: 170,
                    editable: { type: "text", width: 236, validate: { rule: "required" } }
                },
                {
                    header: "수량", name: "part_qty", width: 40, mask: "numeric-int",
                    editable: { type: "text", width: 60, validate: { rule: "required" } }
                }
                ,
                {
                    header: "계측기상태", name: "pstat", width: 60, align: "center",
                    editable: {
                        type: "select", width: 80, validate: { rule: "required" },
                        data: { memory: "부속상태구분", unshift: [{ title: "-", value: "" }] }
                    }
                },
                { name: "qmi_key", hidden: true, editable: { type: "hidden" } },
                { name: "qmi_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================

        var args = {
            targetid: "frmData_MEMO", query: "QMI_1002_2", type: "TABLE", title: "사진",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", validate: true },
            content: {
                height: 500, width: { field: "100%" },
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 500 } },
                            { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_text2", hidden: true, editable: { type: "hidden" } },
                            { name: "img_src", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_tp", hidden: true, editable: { type: "hidden" } },
                            { name: "qmi_key", hidden: true, editable: { type: "hidden" } },
                            { name: "qmi_seq", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CHANGE", query: "QMI_1002_4", title: "이력사항(교정검사, 수리내역, 기타사항)",
            caption: true, height: 160, pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "chg_tp" },
            element: [
                {
                    header: "변동구분", name: "chg_tp", width: 80, align: "center",
                    format: { type: "select", data: { memory: "변동구분" }, width: 70 },
                    editable: { bind: "create", type: "select", data: { memory: "변동구분" }, width: 70, validate: { rule: "required" } }
                },
                {
                    header: "교정일자", name: "chg_date", width: 100, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required" } }
                },
                {
                    header: "교정비용", name: "chg_amt", width: 100, align: "right", mask: "numeric-int",
                    editable: { type: "text" }
                },
                {
                    header: "업체", name: "vendor_nm", width: 200,
                    editable: { type: "text" }
                },
                {
                    header: "내용", name: "chg_rmk", width: 380,
                    editable: { type: "text", maxlength: 100 }
                },
                {
                    header: "교정담당자", name: "chk_emp_nm", width: 100, align: "center", mask: "search",
                    editable: { type: "text" }, display: true
                },
                {
                    header: "차기교정예정일", name: "valid_date", width: 90, align: "center", mask: "date-ymd",
                    editable: { type: "hidden" }
                },
                //{
                //    header: "확인일자", name: "chk_date", width: 60, align: "center",
                //    mask: "date-ymd", editable: { type: "text", width: 100 }
                //}, 
                { name: "qmi_key", hidden: true, editable: { type: "hidden" } },
                { name: "qmi_seq", hidden: true, editable: { type: "hidden" } },
                { name: "chk_emp", hidden: true, editable: { type: "hidden" } },
                { name: "calibrate_yn", hidden: true },
                { name: "calibrate_term", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_LEND", query: "QMI_1002_6", title: "대여이력",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "to_date", validate: true },
            element: [
                {
                    header: "대여일자", name: "lend_dt", width: 150, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required" }, width: 100 }
                },
                {
                    header: "대여부서", name: "use_dept_nm", width: 100, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "대여자", name: "use_emp_nm", width: 100, align: "center", mask: "search",
                    editable: { type: "text", validate: { rule: "required" }, width: 100 }
                },
                {
                    header: "반납예정일자", name: "to_date", width: 80, align: "center", mask: "date-ymd",
                    editable: { type: "text", validate: { rule: "required" }, width: 100 }
                },
                {
                    header: "관리자 비고", name: "lend_rmk", width: 200,
                    editable: { type: "text", width: 200, maxlength: 100 }
                },
                {
                    header: "관리부서", name: "lend_dept_nm", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "불출자", name: "lend_emp_nm", width: 100, mask: "search",
                    editable: { type: "text", width: 100 }
                },
                {
                    header: "반납일자", name: "return_dt", width: 150, align: "center", mask: "date-ymd",
                    editable: { type: "text", width: 100 }
                },
                { name: "qmi_key", hidden: true, editable: { type: "hidden" } },
                { name: "qmi_seq", hidden: true, editable: { type: "hidden" } },
                { name: "use_emp", hidden: true, editable: { type: "hidden" } },
                { name: "use_dept", hidden: true, editable: { type: "hidden" } },
                { name: "lend_dept", hidden: true, editable: { type: "hidden" } },
                { name: "lend_emp", hidden: true, editable: { type: "hidden" } },
                { name: "pstat", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "QMI_1002_5", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 270, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "등록자", name: "upd_usr", width: 70, align: "center" },
                { header: "설명", name: "file_desc", width: 330, align: "left", editable: { type: "text" } },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "_edit_yn", hidden: true }
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
                { type: "FORM", id: "frmData_MASTER", offset: 8 },
                { type: "FORM", id: "frmData_MEMO", offset: 8 },
                { type: "GRID", id: "grdData_PART", offset: 8 },
                { type: "GRID", id: "grdData_CHANGE", offset: 8 },
                { type: "GRID", id: "grdData_LEND", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        var args = { targetid: "lyrMenu_1", element: "업체", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "분류", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "출력", event: "click", handler: processExport };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MEMO", element: "편집", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PART", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_PART", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_CHANGE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_CHANGE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_LEND", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_LEND", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MASTER", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MASTER", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MASTER", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEMO", event: "itemdblclick", handler: processMemo };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_CHANGE", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_CHANGE", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_LEND", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_LEND", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processButton(param) {

    if (param.element == "닫기") {

        v_global.process.handler = processClose;
        if (!checkUpdatable({ all: true, check: true })) return;
        processClose({});

    }

    switch (param.object) {
        case "lyrMenu_1":
            processPopup(param)
            break;
        case "lyrMenu_2":
            switch (param.element) {
                case "조회":
                    v_global.process.handler = processRetrieve;
                    //if (!checkUpdatable({ all: true, check: true })) return;
                    processRetrieve({});
                    break;
                case "추가":
                    processInsert({ object: "frmData_MASTER" });
                    break;
                case "삭제":
                    v_global.process.handler = processRemove;
                    if (!checkManipulate({})) return;
                    checkRemovable({});
                    break;
                case "저장":
                    processSave({});
                    break;
            }
            break;
        case "lyrMenu_PART":
            switch (param.element) {
                case "추가":
                    processInsert({ object: "grdData_PART" });
                    break;
                case "삭제":
                    processDelete({ object: "grdData_PART", row: "selected" });
                    break;
            }
            break;
        case "lyrMenu_MEMO":
            switch (param.element) {
                case "편집":
                    processMemo();
                    break;
            }
            break;
        case "lyrMenu_CHANGE":
            switch (param.element) {
                case "추가":
                    processInsert({ object: "grdData_CHANGE" });
                    break;
                case "삭제":
                    processDelete({ object: "grdData_CHANGE", row: "selected" });
                    break;
            }
            break;
        case "lyrMenu_LEND":
            switch (param.element) {
                case "추가":
                    processInsert({ object: "grdData_LEND" });
                    break;
                case "삭제":
                    processDelete({ object: "grdData_LEND", row: "selected" });
                    break;
            }
            break;
        case "lyrMenu_FILE":
            switch (param.element) {
                case "추가":
                    processFile({});
                    break;
                case "삭제":
                    processDelete({ object: "grdData_FILE", row: "selected" });
                    break;
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    switch (param.object) {
        case "frmData_MASTER":
            {
                if (param.element == "calibrate_yn") {

                    var pstat = gw_com_api.getValue("frmData_MASTER", "selected", "pstat", false);
                    if (param.value.current == 1 && (pstat == "폐기" || pstat == "사용불가")) {
                        gw_com_api.setValue("frmData_MASTER", 1, "calibrate_yn", 0, false, false);
                        gw_com_api.messageBox([{ text: "<" +pstat + "> 상태의 계측기는 교정을 할 수 없습니다." }]);

                        return;
                    }

                    if (param.value.current != "1") {
                        gw_com_api.setValue("frmData_MASTER", 1, "calibrate_term", "", false, true);
                    }

                    var valid_date = "";
                    var row = getMaxCaliRow({});
                    if (row > 0) {
                        var args = { targetid: "grdData_CHANGE", row: row, edit: true };
                        gw_com_module.gridEdit(args);

                        valid_date = getNextCaliDate(param.value.current,
                            gw_com_api.getValue(param.object, param.row, "calibrate_term"),
                            gw_com_api.getValue("grdData_CHANGE", row, "chg_date", true)
                        );
                        gw_com_api.setValue("grdData_CHANGE", row, "valid_date", valid_date, true);
                        gw_com_api.setUpdatable("grdData_CHANGE", row, true);
                    }
                    gw_com_api.setValue(param.object, param.row, "next_calibrate_date", valid_date);

                } else if (param.element == "calibrate_term") {
                    if (gw_com_api.getValue("frmData_MASTER", "selected", "calibrate_term", false) != "") {
                        gw_com_api.setValue("frmData_MASTER", 1, "calibrate_yn", "1", false);
                    }

                    var valid_date = "";
                    var row = getMaxCaliRow({});
                    if (row > 0) {
                        valid_date = getNextCaliDate(gw_com_api.getValue(param.object, param.row, "calibrate_yn"),
                            param.value.current,
                            gw_com_api.getValue("grdData_CHANGE", row, "chg_date", true)
                        );
                        gw_com_api.setValue("grdData_CHANGE", row, "valid_date", valid_date, true);
                        gw_com_api.setUpdatable("grdData_CHANGE", row, true);
                    }
                    gw_com_api.setValue(param.object, param.row, "next_calibrate_date", valid_date);

                } else if (param.element == "pstat") {
                    var pstat = gw_com_api.getValue("frmData_MASTER", 1, "pstat", false);
                    if (pstat == "폐기" || pstat == "사용불가")
                        gw_com_api.setValue("frmData_MASTER", 1, "calibrate_yn", 0);
                }
            }
            break;
        case "grdData_CHANGE":
            {
                //차기 교정일
                if (param.element == "chg_tp") {
                    var valid_date = "";
                    if ($.inArray(param.value.current, ["신규", "교정"]) >= 0) {
                        valid_date = getNextCaliDate(
                            gw_com_api.getValue("frmData_MASTER", 1, "calibrate_yn"),
                            gw_com_api.getValue("frmData_MASTER", 1, "calibrate_term"),
                            gw_com_api.getValue(param.object, param.row, "chg_date", true)
                        );
                    }
                    gw_com_api.setValue(param.object, param.row, "valid_date", valid_date, true, true);
                    gw_com_api.setValue("frmData_MASTER", 1, "next_calibrate_date", valid_date);
                } else if (param.element == "chg_date") {
                    var valid_date = "";
                    if ($.inArray(gw_com_api.getValue(param.object, param.row, "chg_tp", true), ["신규", "교정"]) >= 0) {
                        valid_date = getNextCaliDate(
                            gw_com_api.getValue("frmData_MASTER", 1, "calibrate_yn"),
                            gw_com_api.getValue("frmData_MASTER", 1, "calibrate_term"),
                            param.value.current
                        );
                    }
                    gw_com_api.setValue(param.object, param.row, "valid_date", valid_date, true, true);
                    gw_com_api.setValue("frmData_MASTER", 1, "next_calibrate_date", valid_date);
                }
            }
            break;
        case "grdData_LEND":
            {
                if (param.element == "lend_dt" || param.element == "return_dt") {
                    var lend_dt = gw_com_api.getValue(param.object, param.row, "lend_dt", true);
                    var return_dt = gw_com_api.getValue(param.object, param.row, "return_dt", true);
                    var pstat = "";
                    if (lend_dt <= gw_com_api.getDate()) {
                        pstat = (return_dt == "" ? "대여" : "반납");
                    }
                    gw_com_api.setValue(param.object, param.row, "pstat", pstat, true);
                }
            }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    switch (param.element) {
        case "mng_emp_nm":  //담당자
            {
                v_global.event.emp_no = "mng_emp";
                v_global.event.emp_nm = param.element;
                v_global.event.dept_cd = "mng_dept";
                v_global.event.dept_nm = "mng_dept_nm";
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectEmployee,
                    data: {
                        dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "mng_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                        emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                    }
                };
            }
            break;
        case "chk_emp_nm":  //교정담당자
            {
                v_global.event.emp_no = "chk_emp";
                v_global.event.emp_nm = param.element;
                //v_global.event.dept_cd = "chk_dept";
                //v_global.event.dept_nm = "chk_dept_nm";
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectEmployee,
                    data: {
                        emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                    }
                };
            }
            break;
        case "use_emp_nm":  //대여자
            {
                v_global.event.emp_no = "use_emp";
                v_global.event.emp_nm = param.element;
                v_global.event.dept_cd = "use_dept";
                v_global.event.dept_nm = "use_dept_nm";
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectEmployee,
                    data: {
                        dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "use_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                        emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                    }
                };
            }
            break;
        case "lend_emp_nm":  //불출자
            {
                v_global.event.emp_no = "lend_emp";
                v_global.event.emp_nm = param.element;
                v_global.event.dept_cd = "lend_dept";
                v_global.event.dept_nm = "lend_dept_nm";
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectEmployee,
                    data: {
                        dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "lend_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                        emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                    }
                };
            }
            break;
        case "mng_dept_nm": //관리부서
        case "keep_dept_nm"://보관부서
        case "use_dept_nm": //대여부서
        case "lend_dept_nm": //불출부서
            {
                args = {
                    type: "PAGE", page: "w_find_dept", title: "부서 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectDepartment,
                    data: {
                        dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                    }
                };
            }
            break;
    }

    if (args != null) {
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: args.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processMemo(param) {

    if (!checkManipulate({})) return;

    v_global.event.type = "FORM";
    v_global.event.object = "frmData_MEMO";
    v_global.event.row = 1;
    v_global.event.element = "memo_text";

    var args = {
        type: "PAGE", page: "QMI_1003", title: "사진",
        //type: "PAGE", page: "DLG_EDIT_HTML", title: "사진구조 및 설명",
        width: 600, height: 540, open: true,
        id: gw_com_api.v_Stream.msg_openDialogue
    };

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    //memo_text: gw_com_api.getValue("frmData_MEMO", 1, "memo_text"),
                    //memo_text2: gw_com_api.getValue("frmData_MEMO", 1, "memo_text2"),
                    img_src: gw_com_api.getValue("frmData_MEMO", 1, "img_src")
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processFile(param) {

    if (param.object == "grdData_FILE") {
        var args = {
            source: { id: "grdData_FILE", row: param.row },
            targetid: "lyrDown"
        };
        gw_com_module.downloadFile(args);
    } else {
        if (!checkManipulate({})) return false;
        if (!checkUpdatable({ master: true, check: true })) return false;
        var args = {
            type: "PAGE", page: "DLG_FileUpload_QMI", title: "파일 업로드",
            width: 650, height: 350, /* locate: ["center", 500], */ open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        type: "QMI",
                        key: (gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") == "" ? null : gw_com_api.getValue("frmData_MASTER", 1, "qmi_key")),
                        seq: null
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }
}
//----------
function checkCRUD(param) {

    if (param.part)
        return gw_com_api.getCRUD("grdData_PART", "selected", true);
    else if (param.change)
        return gw_com_api.getCRUD("grdData_CHANGE", "selected", true);
    else if (param.lend)
        return gw_com_api.getCRUD("grdData_LEND", "selected", true);
    else
        return gw_com_api.getCRUD("frmData_MASTER");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;
}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        param: param,
        target: []
    };

    if (param.master || param.all)
        args.target.push({ type: "FORM", id: "frmData_MASTER" });

    if (param.part || param.all)
        args.target.push({ type: "GRID", id: "grdData_PART" });

    if (param.change || param.all)
        args.target.push({ type: "GRID", id: "grdData_CHANGE" });

    if (param.lend || param.all)
        args.target.push({ type: "GRID", id: "grdData_LEND" });

    if (param.memo || param.all)
        args.target.push({ type: "FORM", id: "frmData_MEMO" });

    if (param.file || param.all)
        args.target.push({ type: "GRID", id: "grdData_FILE" });

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
function processRetrieve(param) {

    if (v_global.logic.qmi_key == "") return false;
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_qmi_key", value: v_global.logic.qmi_key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MASTER", edit: true },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_PART", select: true },
            { type: "GRID", id: "grdData_CHANGE", select: true },
            { type: "GRID", id: "grdData_LEND", select: true },
            { type: "GRID", id: "grdData_FILE", select: true }
        ]
    };

    if (param.target != undefined) {
        args.target = [];
        $.each(param.target, function () {
            var target;
            switch (this.toString()) {
                case "frmData_MASTER":
                    target = { type: "FORM", id: this, edit: true };
                    break;
                case "frmData_MEMO":
                    target = { type: "FORM", id: this, edit: true };
                    break;
                case "grdData_PART":
                    target = { type: "GRID", id: this, select: true };
                    break;
                case "grdData_CHANGE":
                    target = { type: "GRID", id: this, select: true };
                    break;
                case "grdData_LEND":
                    target = { type: "GRID", id: this, select: true };
                    break;
                case "grdData_FILE":
                    target = { type: "GRID", id: this, select: true };
                    break;
            }
            if (target != undefined)
                args.target.push(target);
        });
    }

    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    switch (param.object) {
        case "frmData_MASTER":
            if (!checkUpdatable({ all: true })) return false;
            var args = {
                targetid: "frmData_MASTER", edit: true, updatable: true,
                data: [
                    { name: "pstat", value: "보유" },
                    { name: "pur_date", value: gw_com_api.getDate() },
                    { name: "reg_date", value: gw_com_api.getDate() },
                    { name: "calibrate_yn", value: "1" },
                    { name: "mng_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                    { name: "mng_dept", value: gw_com_module.v_Session.DEPT_CD },
                    { name: "mng_emp_nm", value: gw_com_module.v_Session.USR_NM },
                    { name: "mng_emp", value: gw_com_module.v_Session.EMP_NO },
                    { name: "keep_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                    { name: "keep_dept", value: gw_com_module.v_Session.DEPT_CD },
                    //{ name: "dept_area_nm", value: gw_com_module.v_Session.DEPT_AREA },
                    { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA }
                ],
                clear: [
                    { type: "GRID", id: "grdData_PART" },
                    { type: "FORM", id: "frmData_MEMO" },
                    { type: "GRID", id: "grdData_CHANGE" },
                    { type: "GRID", id: "grdData_LEND" },
                    { type: "GRID", id: "grdData_FILE" }
                ]
            };
            gw_com_module.formInsert(args);
            break;
        case "grdData_PART":
            if (!checkManipulate({})) return false;
            var args = {
                targetid: "grdData_PART", edit: true, updatable: true,
                data: [
                     { name: "qmi_key", value: gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") },
                     { name: "qmi_seq", rule: "INCREMENT", value: 1 },
                     { name: "part_qty", value: 1 },
                     { name: "pstat", value: "보유" }
                ]
            };
            gw_com_module.gridInsert(args);
            break;
        case "grdData_CHANGE":
            if (!checkManipulate({})) return false;
            var valid_date = getNextCaliDate(
                gw_com_api.getValue("frmData_MASTER", 1, "calibrate_yn"),
                gw_com_api.getValue("frmData_MASTER", 1, "calibrate_term"),
                gw_com_api.getDate()
            );
            var args = {
                targetid: "grdData_CHANGE",
                edit: true, updatable: true,
                data: [
                     { name: "qmi_key", value: gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") },
                     { name: "qmi_seq", rule: "INCREMENT", value: 1 },
                     { name: "chg_tp", value: "교정" },
                     { name: "chg_date", value: gw_com_api.getDate() },
                     { name: "valid_date", value: valid_date },
                     { name: "chk_emp_nm", value: gw_com_module.v_Session.USR_NM },
                     { name: "chk_emp", value: gw_com_module.v_Session.EMP_NO },
                     { name: "chk_date", value: gw_com_api.getDate() }
                ]
            };
            gw_com_module.gridInsert(args);
            break;
        case "grdData_LEND":
            if (!checkManipulate({})) return false;
            var args = {
                targetid: "grdData_LEND",
                edit: true, updatable: true,
                data: [
                     { name: "qmi_key", value: gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") },
                     { name: "qmi_seq", rule: "INCREMENT", value: 1 },
                     { name: "to_date", value: gw_com_api.getDate() },
                     { name: "use_emp_nm", value: gw_com_module.v_Session.USR_NM },
                     { name: "use_emp", value: gw_com_module.v_Session.EMP_NO },
                     { name: "use_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                     { name: "use_dept", value: gw_com_module.v_Session.DEPT_CD },
                     { name: "lend_dt", value: gw_com_api.getDate() },
                     //{ name: "return_dt", value: gw_com_api.getDate() },
                     { name: "lend_emp_nm", value: gw_com_module.v_Session.USR_NM },
                     { name: "lend_emp", value: gw_com_module.v_Session.EMP_NO },
                     { name: "lend_dept_nm", value: gw_com_module.v_Session.DEPT_NM },
                     { name: "lend_dept", value: gw_com_module.v_Session.DEPT_CD },
                     { name: "pstat", value: "대여" }
                ]
            };
            gw_com_module.gridInsert(args);
            break;

    }

}
//----------
function processDelete(param) {

    var args = { targetid: param.object, row: param.row, select: true };
    switch (param.object) {
        case "aaa":
            args.remove = true;
            args.clear = [
                { type: "GRID", id: "grdData_aaa" }
            ];
            break;
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {
    
    if (gw_com_api.getValue("frmData_MASTER", 1, "calibrate_yn") == 1 && gw_com_api.getValue("frmData_MASTER", 1, "calibrate_term") == 0) {
        gw_com_api.messageBox([{ text: "교정주기를 선택해 주시기 바랍니다." }]);

        return;
    }
    
    var ids = gw_com_api.getRowIDs("grdData_CHANGE");
    var chk_validate = true;
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_CHANGE", this, "chg_date", true).length != 8) {
            chk_validate = false;

            return;
        }
    });

    if (!chk_validate) {
        gw_com_api.messageBox([{ text: "이력사항의 교정일자를 모두 입력해주시기 바랍니다." }]);

        return;
    }


    var args = {
        //url: "COM",
        target: [
            { type: "FORM", id: "frmData_MASTER" },
            { type: "GRID", id: "grdData_PART" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_CHANGE" },
            { type: "GRID", id: "grdData_LEND" },
            { type: "GRID", id: "grdData_FILE" }
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

    $.each(response, function () {
        if (this.QUERY == "QMI_1002_1") {
            v_global.logic.qmi_key = this.KEY[0].VALUE;
        }
    });

    processRetrieve({});

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM",
                id: "frmData_MASTER",
                key: { element: [{ name: "qmi_key" }] }
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MASTER" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_PART" },
            { type: "GRID", id: "grdData_CHANGE" },
            { type: "GRID", id: "grdData_LEND" },
            { type: "GRID", id: "grdData_FILE" }
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
function successRemove(response, param) {

    processClear({});

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
function processExport(param) {

    if (!checkManipulate({})) return false;
    if (!checkUpdatable({ all: true, check: true })) return;

    var qmi_key = gw_com_api.getValue("frmData_MASTER", 1, "qmi_key");
    var args = {
        //source: {
        //    type: "INLINE", json: true,
        //    argument: [
        //        { name: "arg_ann_key", value: ann_key },
        //        { name: "arg_app_key", value: app_key } //app_key.replace(/,/gi, "','") }
        //    ]
        //},
        option: [
            { name: "PRINT", value: "xls" },
            { name: "PAGE", value: "QMI_1001" },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "QMI_KEY", value: qmi_key }
        ],
        target: { type: "FILE", id: "lyrDown", name: "검사설비 이력카드" },
        page: "QMI_1001"
    };
    gw_com_module.objExport(args);

}
//----------
function processPopup(param) {

    var args;
    switch (param.element) {
        case "업체":
            args = {
                type: "PAGE", page: "QMI_9010", title: "구입처 관리",
                width: 650, height: 350, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_openDialogue
            };
            break;
        case "분류":
            break;
    }

    if (args != null) {
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: args.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function getNextCaliDate(arg1, arg2, arg3) {

    var rtn = "";
    if (arg1 == "1" && arg3 != "") {
        rtn = gw_com_api.addDate("m", arg2, gw_com_api.unMask(arg3, "date-ymd"), "");
    }

    return rtn;

}
//----------
function getMaxCaliRow(param) {

    var ids = gw_com_api.getRowIDs("grdData_CHANGE");
    var row = 0;
    var chg_date = "";
    $.each(ids, function () {

        var chg_tp = gw_com_api.getValue("grdData_CHANGE", this, "chg_tp", true);
        if (chg_date < gw_com_api.getValue("grdData_CHANGE", this, "chg_date", true) && (chg_tp == "신규" || chg_tp == "교정")) {
            chg_date = gw_com_api.getValue("grdData_CHANGE", this, "chg_date", true);
            row = this;
        }

    })
    return row;

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
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "w_find_emp":
                        {
                            args.data = {
                                dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "use_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                                emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                            }

                        }
                        break;
                    case "w_find_dept":
                        {
                            args.data = {
                                dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                            }
                        }
                        break;
                    case "DLG_EDIT_HTML":
                        args.data = {
                            title: gw_com_api.getValue("frmData_MASTER", 1, "qmi_nm"),
                            html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element, (v_global.event.type == "GRID" ? true : false))
                        };
                        break;
                    case "QMI_1003":
                        args.data = {
                            memo_text: gw_com_api.getValue("frmData_MEMO", 1, "memo_text"),
                            memo_text2: gw_com_api.getValue("frmData_MEMO", 1, "memo_text2"),
                            img_src: gw_com_api.getValue("frmData_MEMO", 1, "img_src")
                        };
                        break;
                    case "DLG_FileUpload_QMI":
                        args.data = {
                            type: "QMI",
                            key: (gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") == "" ? null : gw_com_api.getValue("frmData_MASTER", 1, "qmi_key")),
                            seq: null
                        };
                        break;

                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.substr(0, v_global.event.element.length - 3),
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.split("_")[0] + "_dept_nm",
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.split("_")[0] + "_dept",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                    case "w_find_dept":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.substr(0, v_global.event.element.length - 3),
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                    case "DLG_EDIT_HTML":
                        if (param.data != undefined) {
                            if (gw_com_api.getValue("frmData_MEMO", 1, "qmi_key") == "") {
                                var args = {
                                    targetid: "frmData_MEMO", edit: true, updatable: true,
                                    data: [
                                        { name: "qmi_key", value: gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") },
                                        { name: "qmi_seq", value: 1 },
                                        { name: "memo_tp", value: "HTML" },
                                        { name: "memo_text", value: param.data },
                                        { name: "memo_html", value: param.data }
                                    ]
                                };
                                gw_com_module.formInsert(args);
                            } else {
                                gw_com_api.setValue("frmData_MEMO", 1, "memo_html", param.data);
                                gw_com_api.setValue("frmData_MEMO", 1, "memo_text", param.data);
                                gw_com_api.setCRUD("frmData_MEMO", 1, "modify");
                            }
                        }
                        break;
                    case "QMI_1003":
                        if (param.data != undefined) {
                            var qmi_key = gw_com_api.getValue("frmData_MASTER", 1, "qmi_key");
                            if ($.inArray(gw_com_api.getValue("frmData_MEMO", 1, "qmi_key"), [qmi_key]) == -1 || qmi_key == "") {
                                var args = {
                                    targetid: "frmData_MEMO", edit: true, updatable: true,
                                    data: [
                                        { name: "qmi_key", value: gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") },
                                        { name: "qmi_seq", value: 1 },
                                        { name: "memo_tp", value: "HTML" },
                                        { name: "memo_html", value: param.data.memo_text },
                                        { name: "memo_text", value: param.data.memo_text },
                                        { name: "memo_text2", value: param.data.memo_text2 },
                                        { name: "img_src", value: param.data.img_src }
                                    ]
                                };
                                gw_com_module.formInsert(args);
                            } else {
                                gw_com_api.setValue("frmData_MEMO", 1, "memo_html", param.data.memo_text);
                                gw_com_api.setValue("frmData_MEMO", 1, "memo_text", param.data.memo_text);
                                gw_com_api.setValue("frmData_MEMO", 1, "memo_text2", param.data.memo_text2);
                                gw_com_api.setValue("frmData_MEMO", 1, "img_src", param.data.img_src);
                                if (gw_com_api.getCRUD("frmData_MEMO") != "create")
                                    gw_com_api.setCRUD("frmData_MEMO", 1, "modify");
                            }
                        }
                        break;
                    case "DLG_FileUpload_QMI":
                        if (param.data != undefined) {
                            processRetrieve({ target: ["grdData_FILE"] });
                        }

                        //closeDialogue({ page: param.from.page });
                        break;
                        //case "QMI_9010":
                        //    if (param.data != undefined) {
                        //        var val = gw_com_api.getValue("frmData_MASTER", 1, "vendor_nm");
                        //        var args = {
                        //            request: [
                        //                {
                        //                    type: "PAGE", name: "구매처", query: "dddw_zcode",
                        //                    param: [{ argument: "arg_hcode", value: "QMI12" }]
                        //                }
                        //            ]
                        //        };
                        //        gw_com_module.selectSet(args);

                        //        var el = ["#frmData_MASTER_vendor_nm_view", "#frmData_MASTER_vendor_nm"];
                        //        var data = gw_com_module.selectGet({ name: "구매처" });
                        //        $.each(el, function () {
                        //            var elnm = this.toString();
                        //            $(elnm + " option[value!='']").remove();
                        //            $.each(data, function () {
                        //                if ($.browser.msie) {
                        //                    var i = $(elnm)[0].add(new Option(this.title, this.value));
                        //                    var test = i;
                        //                }
                        //                else {
                        //                    $(elnm)[0].add(new Option(this.title, this.value), null);
                        //                }
                        //            });
                        //            //$(elnm).selectmenu({ "refresh": true });
                        //        });
                        //        gw_com_api.setValue("frmData_MASTER", 1, "vendor_nm", val, false, true);
                        //    }
                        //    break;
                }
                closeDialogue({ page: param.from.page });
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
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
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
                }
            }
            break;
            //추가 by 고윤수(181218)
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.emp_nm,
                                        param.data.emp_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.emp_no,
                                        param.data.emp_no,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.dept_nm,
                                        param.data.dept_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.dept_cd,
                                        param.data.dept_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedDepartment:
            {
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.dept_nm,
                                    param.data.dept_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.dept_cd,
                                    param.data.dept_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
            //
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//