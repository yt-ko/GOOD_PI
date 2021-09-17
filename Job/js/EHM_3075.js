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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "분류", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "IEHM42" }
                    ]
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
				{
				    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
				{
				    type: "PAGE", name: "처리결과", query: "DDDW_CM_CODE",
				    param: [
                        { argument: "arg_hcode", value: "IEHM47" }
                    ]
				},
				{
				    type: "PAGE", name: "상태", query: "DDDW_CM_CODE",
				    param: [
                        { argument: "arg_hcode", value: "IEHM47" }
                    ]
				},
                {
                    type: "INLINE", name: "RESULT",
                    data: [
						{ title: "미처리", value: "미처리" },
						{ title: "반영", value: "반영" },
						{ title: "반려", value: "반려" }
					]
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

            gw_job_process.UI();

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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
                { name: "ECR", value: "ECR 접수", icon: "실행" },
                { name: "조회", value: "조회", act: true },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3",
            type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "ymd_fr", label: { title: "발생일자 :" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }, style: { colfloat: "floating" }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cust_cd", label: { title: "고객사 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
                                    change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
                                }
                            },
				            {
				                name: "cust_dept", label: { title: "LINE :" },
				                editable: { type: "select", data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] } }
				            },
				            {
				                name: "cust_proc", label: { title: "Process :" },
				                editable: { type: "select", data: { memory: "PROCESS", unshift: [{ title: "전체", value: "%" }] } }
				            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "prod_type", label: { title: "제품유형 :" },
                                editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                            },
                            {
                                name: "adept_nm", label: { title: "접수부서 :" },
                                editable: { type: "text", size: 10 }, mask: "search"
                            },
                            {
                                name: "aemp_nm", label: { title: "접수자 :" },
                                editable: { type: "text", size: 7 }, mask: "search"
                            },
                            { name: "adept", hidden: true },
                            { name: "aemp", hidden: true }
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
            targetid: "grdData_정보",
            query: "EHM_3070_M_1",
            title: "접수 정보",
            caption: true,
            height: 130,
            dynamic: true,
            show: true,
            selectable: true,
            element: [
				{ header: "관리번호", name: "voc_no", width: 80, align: "center" },
				{ header: "발생일자", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
				{ header: "분류", name: "issue_tp", width: 90, align: "center" },
				{ header: "고객사", name: "cust_nm", width: 70, align: "center" },
				{ header: "Line", name: "cust_dept", width: 80, align: "center" },
				{ header: "적용일자", name: "apply_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "처리상태", name: "pstat", width: 80, align: "center" },
				{ header: "등록자", name: "ins_usr", width: 70, align: "center" },
				{ header: "등록일시", name: "ins_dt", width: 160, align: "center" },
				{ header: "수정자", name: "upd_usr", width: 70, align: "center" },
				{ header: "수정일시", name: "upd_dt", width: 160, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_내역", query: "EHM_3070_M_2", type: "TABLE", title: "접수 내역",
            caption: true, show: true, selectable: true,
            content: { width: { label: 100, field: 200 }, height: 25,
                row: [ {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "voc_no", editable: { type: "hidden" } },
                            { header: true, value: "발생일자", format: { type: "label" } },
                            { name: "issue_dt", mask: "date-ymd",
                                editable: { type: "text", validate: { rule: "required" } }
                            },
                            { header: true, value: "분류", format: { type: "label" } },
                            { name: "issue_tp",
                                editable: { type: "select", data: { memory: "분류" }, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "고객사", format: { type: "label" } },
                            { name: "cust_cd", format: { type: "select", data: { memory: "고객사" } } },
                            { header: true, value: "LINE", format: { type: "label" } },
                            { name: "cust_dept", format: { type: "select", data: { memory: "LINE" } } },
                            { header: true, value: "LINE담당자", format: { type: "label" } },
                            { name: "cust_emp" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "요청내용", format: { type: "label" } },
                            { name: "issue_rmk", style: { colspan: 5 },
                                format: { type: "textarea", rows: 5, width: 800 },
                                editable: { type: "textarea", rows: 5, width: 800, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용일자", format: { type: "label" } },
                            { name: "apply_date", mask: "date-ymd" },
                            { header: true, value: "처리상태", format: { type: "label" } },
                            { name: "pstat" },
                            { header: true, value: "작성자/작성일시", format: { type: "label" } },
                            { name: "upd_usr", style: { colfloat: "float" }, format: { type: "text", width: 70 } },
                            { name: "upd_dt", style: { colfloat: "floated" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Sub ====
        var args = { targetid: "grdData_담당", query: "EHM_3070_S_1", title: "담당 정보",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "담당부서", name: "dept_nm", width: 150, align: "center", mask: "search", display: true,
				  editable: { type: "text", validate: { rule: "required" } }
				},
                { header: "담당자", name: "emp_nm", width: 120, align: "center", mask: "search", display: true,
                  editable: { type: "text" }
                },
                { header: "처리결과", name: "result_cd", width: 100, align: "center" },
                { header: "결과사유", name: "result_rmk", width: 500, align: "center" },
                { header: "처리일시", name: "upd_dt", width: 160, align: "center" },
                { name: "emp_no", hidden: true, editable: { type: "hidden" } },
                { name: "dept_cd", hidden: true, editable: { type: "hidden" } },
                { name: "charge_seq", hidden: true, editable: { type: "hidden" } },
                { name: "voc_no", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Form : Sub ====
        var args = { targetid: "frmData_담당", query: "EHM_3070_S_3", type: "TABLE", title: "담당자 처리 내역",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "issue_tp", validate: true },
            content: {
                width: { label: 100, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "담당부서", format: { type: "label" } },
                            { name: "dept_nm" },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "emp_nm" },
                            { header: true, value: "처리일자", format: { type: "label" } },
                            { name: "result_dt", mask: "date-ymd", editable: { type: "text", validate: { rule: "required" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리결과", format: { type: "label" } },
                            { name: "result_cd", editable: { type: "select", data: { memory: "처리결과" }, validate: { rule: "required" } } },
                            { header: true, value: "작성자", format: { type: "label" } },
                            { name: "upd_usr" },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "upd_dt" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "결과사유", format: { type: "label" } },
                            { style: { colspan: 5 }, name: "result_rmk",
                                format: { type: "textarea", rows: 5, width: 800 },
                                editable: { type: "textarea", rows: 5, width: 800, validate: { rule: "required" } }
                            },
                			{ name: "voc_no", hidden: true },
                			{ name: "charge_seq", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Grid : 첨부파일 ====
        var args = { targetid: "grdData_첨부", query: "EHM_3070_S_2", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 300, align: "left" },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "파일설명", name: "file_desc", width: 670, align: "left", editable: { type: "text" } },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
			]
        };
        gw_com_module.gridCreate(args);
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_정보", offset: 8 },
				{ type: "FORM", id: "frmData_내역", offset: 8 },
				{ type: "GRID", id: "grdData_담당", offset: 8 },
				{ type: "FORM", id: "frmData_담당", offset: 8 },
				{ type: "GRID", id: "grdData_첨부", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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
        var args = { targetid: "lyrMenu_1", element: "ECR", event: "click", handler: click_lyrMenu_1_ECR };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: click_lyrMenu_1_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: click_lyrMenu_1_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: click_lyrMenu_1_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: click_lyrMenu_1_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: click_lyrMenu_2_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: click_lyrMenu_2_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: click_lyrMenu_3_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: click_lyrMenu_3_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_정보", grid: true, event: "rowselecting", handler: rowselecting_grdData_정보 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_정보", grid: true, event: "rowselected", handler: rowselected_grdData_정보 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_담당", grid: true, event: "rowselecting", handler: rowselecting_grdData_담당 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_담당", grid: true, event: "rowselected", handler: rowselected_grdData_담당 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_담당", grid: true, event: "itemdblclick", handler: itemdblclick_grdData_담당 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_담당", grid: true, event: "itemkeyenter", handler: itemdblclick_grdData_담당 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_첨부", grid: true, element: "download", event: "click", handler: click_grdData_첨부_download };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function click_lyrMenu_1_ECR(ui) {
            if (gw_com_api.getRowCount("grdData_정보") < 1) {
                gw_com_api.messageBox([
                    { text: "NOMASTER" }
                ]);
                return;
            }
            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb1010", title: "ECR 등록",
                    param: [
                        { name: "issue_no", value: gw_com_api.getValue("grdData_정보", "selected", "voc_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_1_조회(ui) {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_담당", edit: true,
                data: [
                    { name: "voc_no", value: gw_com_api.getValue("frmData_내역", 1, "voc_no") }
                ]
            };
            gw_com_module.gridInsert(args);

            if (gw_com_api.getCRUD("frmData_담당") == "none") {
                args = {
                    targetid: "frmData_담당", edit: true, updatable: true,
                    data: [
                        { name: "voc_no", value: gw_com_api.getValue("frmData_내역", 1, "voc_no") },
                        { name: "voc_seq", value: gw_com_api.getValue("frmData_내역", 1, "voc_seq") }
                    ]
                };
                gw_com_module.formInsert(args);
            }

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_담당",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "UPLOAD_EHM",
                title: "파일 업로드",
                width: 650,
                height: 200,
                //locate: ["center", 600],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "UPLOAD_EHM",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_ECCB,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("frmData_내역", 1, "voc_no"),
                            seq: 1
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_첨부",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselecting_grdData_정보(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
            return checkUpdatable({});
        }
        //----------
        function rowselected_grdData_정보(ui) {
            v_global.process.prev.master = ui.row;
            processLink({});
        };
        //----------
        function rowselecting_grdData_담당(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;
            return checkUpdatable({sub: true});
        }
        //----------
        function rowselected_grdData_담당(ui) {
            v_global.process.prev.sub = ui.row;
            processLink({ sub: true });
        };
        //----------        
        function click_grdData_첨부_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -10 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function itemdblclick_grdData_담당(ui) {

    switch (ui.element) {
        case "dept_nm":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_TEAM",
                    title: "부서 선택",
                    width: 500,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_TEAM",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectTeam
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "emp_nm":
            {
                v_global.event.type = ui.type;
                v_global.event.object = ui.object;
                v_global.event.row = ui.row;
                v_global.event.element = ui.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_EMPLOYEE",
                    title: "사원 선택",
                    width: 700,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_EMPLOYEE",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectEmployee
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_담당");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_담당" },
			{ type: "GRID", id: "grdData_첨부" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "EHM_3070_M_2")
                this.QUERY = "EHM_3070_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_proc", argument: "arg_cust_proc" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "adept", argument: "arg_adept" },
                { name: "aemp", argument: "arg_aemp" }
            ],
            argument: [
                { name: "arg_rcpt_dept", value: gw_com_module.v_Current.menu_args }
            ],
            remark: [
			    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "cust_cd" }] },
		        { element: [{ name: "cust_dept" }] },
		        { element: [{ name: "cust_proc" }] },
                { element: [{ name: "prod_type" }] },
                { element: [{ name: "adept" }] },
                { element: [{ name: "aemp" }] }
		    ]
        },
        target: [
			{
			    type: "GRID", id: "grdData_정보", select: true
			}
		],
        clear: [
		    { type: "FORM", id: "frmData_내역" },
		    { type: "GRID", id: "grdData_담당" },
		    { type: "FORM", id: "frmData_담당" },
			{ type: "GRID", id: "grdData_첨부" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
	        source: {
	            type: "GRID", id: "grdData_담당", row: "selected", block: true,
	            element: [
					{ name: "voc_no", argument: "arg_voc_no" },
					{ name: "charge_seq", argument: "arg_charge_seq" }
					]
	        	},
	        target: [
	            { type: "FORM", id: "frmData_담당" }
				],
	        clear: [
				{ type: "FORM", id: "frmData_담당" }
				],
	        key: param.key
    	};
    }
    else {
        args = {
	        source: {
	            type: "GRID", id: "grdData_정보", row: "selected", block: true,
	            element: [
					{ name: "voc_no", argument: "arg_voc_no" }
					]
	        	},
	        target: [
	            { type: "FORM", id: "frmData_내역" },
	            { type: "GRID", id: "grdData_담당" },
				{ type: "GRID", id: "grdData_첨부" }
				],
	        clear: [
				{ type: "FORM", id: "frmData_내역" },
				{ type: "GRID", id: "grdData_담당" },
				{ type: "GRID", id: "grdData_첨부" }
				],
	        key: param.key
    	};
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {
	(param.sub)
        ? gw_com_api.selectRow("grdData_담당", v_global.process.current.sub, true, false)
        : gw_com_api.selectRow("grdData_정보", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {
    gw_com_api.selectRow("grdData_정보", "reset");
    var args = {
        targetid: "frmData_내역",
        edit: true,
        updatable: true,
        data: [
            { name: "issue_dt", value: gw_com_api.getDate() }
        ],
        clear: [
            { type: "GRID", id: "grdData_담당" },
            { type: "GRID", id: "grdData_첨부" }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_정보",
        row: "selected",
        clear: [
                {
                    type: "FORM",
                    id: "frmData_내역"
                },
                {
                    type: "GRID",
                    id: "grdData_첨부"
                }
            ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_담당"
			},
            {
                type: "GRID",
                id: "grdData_첨부"
            }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
		    {
		        type: "FORM",
		        id: "frmData_담당",
		        key: {
		            element: [
		                { name: "voc_no" }
		            ]
		        }
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
            {
                type: "FORM",
                id: "frmData_담당"
            },
            {
                type: "GRID",
                id: "grdData_담당"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            }
        ]
    };
    if (param.master)
        args.target.unshift({
            type: "GRID",
            id: "grdData_정보"
        });
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
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else {
        processLink({ key: response });
    }

}
//----------
function successRemove(response, param) {

    processDelete({});

}

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
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                else if (status == "update")
                                    processLink({});
                                else if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
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
        case gw_com_api.v_Stream.msg_selectedTeam:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "dept_cd",
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "dept_nm",
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "emp_no",
			                        param.data.emp_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "emp_nm",
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "dept_cd",
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "dept_nm",
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_EHM:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_voc_no", value: gw_com_api.getValue("frmData_내역", 1, "voc_no") },
                            { name: "arg_seq", value: 1 }
                        ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_첨부",
			                select: true
			            }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "DLG_TEAM":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectTeam;
                        }
                        break;
                    case "DLG_EMPLOYEE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEmployee;
                        }
                        break;
                    case "UPLOAD_EHM":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_EHM;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_내역", 1, "voc_no"),
                                seq: 1
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//