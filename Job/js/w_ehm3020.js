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
    logic: {}, data: null
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "고객사", query: "dddw_cust"
                },
				{
				    type: "PAGE", name: "LINE", query: "dddw_zcoded",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
				{
				    type: "PAGE", name: "발생Module", query: "dddw_zcode",
				    param: [
                        { argument: "arg_hcode", value: "IEHM05" }
                    ]
				},
                {
                    type: "INLINE", name: "진행상태",
                    data: [
                        { title: "발생", value: "발생" },
						{ title: "진행", value: "진행" },
						{ title: "완료", value: "완료" },
                        { title: "보류", value: "보류" }
					]
                },
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
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
				{ name: "조회", value: "조회", act: true },
				{ name: "추가", value: "추가" },
				{ name: "저장", value: "저장" },
				{ name: "삭제", value: "삭제" },
				{ name: "문제", value: "문제발생등록", icon: "실행" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
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
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true,
            editable: { focus: "cust_cd", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "시작일자 :" },
				                mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 }
				            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            },
                        ]
                    },
                    {
                        element: [
				            {
				                name: "cust_cd", label: { title: "고객사 :" },
				                editable: {
				                    type: "select", size: 1,
				                    data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
				                    change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
				                }
				            },
				            {
				                name: "cust_dept", label: { title: "LINE :" },
				                editable: {
				                    type: "select", size: 1,
				                    data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }
				                }
				            },
				            {
				                name: "cust_prod_nm", label: { title: "고객설비명 :" },
				                editable: { type: "text", size: 10, maxlength: 20 }
				            }
				        ]
                    },
                    {
                        element: [
				            {
				                name: "proj_no", label: { title: "Project No. :" },
				                editable: { type: "text", size: 14, maxlength: 50 }
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
            targetid: "grdData_현황", query: "w_ehm3020_M_1", title: "Setup 현황",
            height: 110, dynamic: true, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "cust_nm", validate: true },
            element: [
				{
				    header: "관리번호", name: "setup_no", width: 80, align: "center",
				    editable: { type: "hidden" }
				},
				{
				    header: "시작일자", name: "str_ymd", width: 90, align: "center", mask: "date-ymd",
				    editable: { type: "text" }
				},
				{ header: "종료일자", name: "end_ymd", width: 90, align: "center", mask: "date-ymd" },
				{
				    header: "고객사", name: "cust_nm", width: 80, align: "center", mask: "search", display: true,
				    editable: { type: "text", bind: "create" }
				},
				{
				    header: "Line", name: "cust_dept", width: 80, align: "center",
				    editable: { type: "hidden" }
				},
				{
				    header: "고객설비명", name: "cust_prod_nm", width: 150, display: true,
				    editable: { type: "hidden" }
				},
                { header: "Project No.", name: "proj_no", width: 100, align: "center" },
                { header: "진행율", name: "prc_rate", width: 60, align: "right", mask: "numeric-float" },
				{
				    header: "발생Module", name: "prod_sub", width: 80, align: "center",
				    format: { type: "select", data: { memory: "발생Module" } },
				    editable: { type: "select", data: { memory: "발생Module" } }
				},
				{
				    header: "진행상태", name: "pstat", width: 60, align: "center",
				    format: { type: "select", data: { memory: "진행상태" } },
				    editable: { type: "select", data: { memory: "진행상태" } }
				},
				{ header: "등록자", name: "ins_usr_nm", width: 70, align: "center", hidden: true },
				{ header: "등록일시", name: "ins_dt", width: 160, align: "center", hidden: true },
				{ header: "수정자", name: "upd_usr_nm", width: 70, align: "center", hidden: true },
				{ header: "수정일시", name: "upd_dt", width: 160, align: "center", hidden: true },
				{ name: "cust_cd", hidden: true, editable: { type: "hidden" } },
				{ name: "cust_proc", hidden: true, editable: { type: "hidden" } },
				{ name: "prod_key", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_보고서", query: "w_ehm3020_S_1", title: "Setup 보고서",
            caption: true, height: 200, pager: true, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select" },
            element: [
				{
				    header: "관리번호", name: "setup_no", width: 80, align: "center",
				    editable: { type: "hidden" }, hidden: true
				},
				{
				    header: "시작일자", name: "setup_ymd", width: 80, align: "center", mask: "date-ymd",
				    editable: { type: "hidden" }
				},
				{ header: "시작시간", name: "str_time", width: 80, align: "center" },
				{
				    header: "종료일자", name: "end_ymd", width: 80, align: "center", mask: "date-ymd",
				    editable: { type: "hidden" }
				},
				{ header: "종료시간", name: "end_time", width: 80, align: "center" },
				{
				    header: "진행상태", name: "pstat", width: 60, align: "center",
				    format: { type: "select", data: { memory: "진행상태" } }
				},
                { name: "setup_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_공정", query: "w_ehm3020_S_4", title: "Setup 공정 진행율",
            caption: true, height: 200, pager: true, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "pstat" },
            element: [
				{ header: "공정명", name: "prc_nm", width: 140 },
				{
				    header: "완료", name: "pstat", width: 60, align: "center",
				    format: { type: "checkbox", value: "완료", offval: "진행" },
				    editable: { type: "checkbox", value: "완료", offval: "진행" }
				},
				{
				    header: "완료일자", name: "end_date", width: 90, align: "center", mask: "date-ymd",
				    editable: { type: "text", width: 100 }
				},
				{
				    header: "표준진행율", name: "std_prc_rate", width: 60, align: "right", mask: "numeric-float",
				    editable: { type: "hidden" }
				},
                { name: "setup_no", hidden: true, editable: { type: "hidden" } },
                { name: "prc_seq", hidden: true, editable: { type: "hidden" } },
                { name: "prc_cd", hidden: true, editable: { type: "hidden" } },
                { name: "sort_seq", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_보고서", query: "w_ehm3020_S_2", type: "TABLE", title: "Setup 보고서",
            show: true, selectable: true,
            editable: { bind: "select", focus: "pstat", validate: true },
            content: {
                width: { label: 80, field: 220 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "setup_no", editable: { type: "hidden" } },
                            { name: "setup_seq", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "pstat", editable: { type: "select", data: { memory: "진행상태" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "시작일시", format: { type: "label" } },
                            {
                                name: "setup_ymd", mask: "date-ymd", style: { colfloat: "float" },
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "str_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { width: 50 },
                                editable: { type: "text", width: 50 }
                            },
                            { header: true, value: "종료일시", format: { type: "label" } },
                            {
                                name: "end_ymd", mask: "date-ymd", style: { colfloat: "float" },
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                name: "end_time", mask: "time-hm", style: { colfloat: "floated" },
                                format: { width: 50 },
                                editable: { type: "text", width: 50 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "근무자", format: { type: "label" } },
                            {
                                style: { colspan: 3, colfloat: "float" }, name: "emp_nm01",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm02",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm03",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm04",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm05",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "divide" }, name: "emp_nm06",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm07",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm08",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm09",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm10",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floating" }, name: "emp_nm11",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            },
                            {
                                style: { colfloat: "floated" }, name: "emp_nm12",
                                format: { width: 100 },
                                editable: { type: "text", width: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "문제점", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "rmk_problem",
                                format: { type: "textarea", rows: 10, width: 994 },
                                editable: { type: "textarea", rows: 10, width: 992 }
                            }
                        ]
                    },

                    {
                        element: [
                            { header: true, value: "금일<br>진행상황", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "rmk_today",
                                format: { type: "textarea", rows: 12, width: 994 },
                                editable: { type: "textarea", rows: 12, width: 992 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "익일<br>예정사항", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "rmk_tomorrow",
                                format: { type: "textarea", rows: 8, width: 994 },
                                editable: { type: "textarea", rows: 8, width: 992 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //del by kyt 2021-06-03
    //    var args = {
    //        targetid: "grdData_FileA", query: "w_ehm3020_S_3", title: "첨부 파일",
    //        caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
    //        editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
    //        element: [
				//{ header: "파일명", name: "file_nm", width: 300, align: "left" },
				//{
				//    header: "다운로드", name: "download", width: 60, align: "center",
				//    format: { type: "link", value: "다운로드" }
				//},
				//{
				//    header: "파일설명", name: "file_desc", width: 300, align: "left",
				//    editable: { type: "text" }
				//},
    //            { name: "file_ext", hidden: true },
    //            { name: "file_path", hidden: true },
    //            { name: "network_cd", hidden: true },
    //            { name: "data_tp", hidden: true },
    //            { name: "data_key", hidden: true },
    //            { name: "data_seq", hidden: true },
    //            { name: "file_id", hidden: true, editable: { type: "hidden" } }
    //        ]
    //    };
    //    
        // Data Box : Attach File add by kyt 2021-06-03
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일",
            caption: true, height: "100%", pager: false, number: true, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "_download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
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
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "GRID", id: "grdData_보고서", offset: 8 },
                { type: "GRID", id: "grdData_공정", offset: 8 },
				{ type: "FORM", id: "frmData_보고서", offset: 8 },
				{ type: "GRID", id: "grdData_FileA", offset: 8 }
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
        var args = { targetid: "lyrMenu_1", element: "문제", event: "click", handler: processIssue };
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
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: processFileUpload };
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
        var args = { targetid: "grdData_현황", grid: true, event: "rowselecting", handler: rowselecting_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "itemdblclick", handler: itemdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "itemkeyenter", handler: itemdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_보고서", grid: true, event: "rowselecting", handler: rowselecting_grdData_보고서 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_보고서", grid: true, event: "rowselected", handler: rowselected_grdData_보고서 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_공정", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_보고서", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FileA", grid: true, element: "_download", event: "click", handler: click_grdData_FileA_download };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회() {

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

            v_global.process.handler = processRemove;

            if (!checkManipulate({})) return;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});
            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({ sub: true });
        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var status = checkCRUD({ sub: true });
            if (status == "initialize" || status == "create")
                processClear({});
            else
                processDelete({ sub: true });

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_upload_assetup",
                title: "파일 업로드",
                width: 650,
                height: 200,
                locate: ["center", 600],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_assetup",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_ASSETUP,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("grdData_현황", "selected", "setup_no", true),
                            seq: gw_com_api.getValue("grdData_현황", "selected", "str_ymd", true)
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
                targetid: "grdData_FileA",
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
        function rowselecting_grdData_현황(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_현황(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function itemdblclick_grdData_현황(ui) {

            switch (ui.element) {
                case "cust_nm":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_prod_ehm",
                            title: "장비 검색",
                            width: 800,
                            height: 460,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_prod_ehm",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProduct_EHM
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }
        }
        //----------
        function rowselecting_grdData_보고서(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_보고서(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------        
        function click_grdData_FileA_download(ui) {

            var args = {
                source: {
                    id: "grdData_FileA",
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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
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
function checkCRUD(param) {

    return ((param.sub)
            ? gw_com_api.getCRUD("frmData_보고서")
            : gw_com_api.getCRUD("grdData_현황", "selected", true));

}
//----------
function processItemchanged(param) {

    if (param.object == "grdData_현황" || param.object == "frmData_보고서") {

        if (param.element == "pstat") {
            var end_ymd = gw_com_api.getValue(param.object, param.row, "end_ymd", param.type == "GRID" ? true : false);
            if (param.value.current == "완료" && end_ymd == "")
                end_ymd = gw_com_api.getDate();
            else if (param.value.currnet != "완료")
                end_ymd = "";
            gw_com_api.setValue(param.object, param.row, "end_ymd", end_ymd, param.type == "GRID" ? true : false, false, false);
            if (end_ymd == "")
                gw_com_api.setValue(param.object, param.row, "end_time", "", param.type == "GRID" ? true : false, false, false);
        } else if (param.element == "end_ymd") {
            var pstat = "";
            var end_ymd = gw_com_api.unMask(param.value.current, "date-ymd");
            if (end_ymd != "" && gw_com_api.getValue(param.object, param.row, "str_ymd", param.type == "GRID" ? true : false) > end_ymd) {
                gw_com_api.showMessage("종료일자가 시작일자 보다 작을 수 없습니다.");
                gw_com_api.setValue(param.object, param.row, param.element, "", param.type == "GRID" ? true : false, false, false);
                return false;
            }
            if (end_ymd == "")
                pstat = "진행";
            else
                pstat = "완료";
            gw_com_api.setValue(param.object, param.row, "pstat", pstat, param.type == "GRID" ? true : false, false, false);
        }

    } else if (param.object == "grdData_공정") {

        if (param.element == "pstat") {
            var end_date = gw_com_api.getValue(param.object, param.row, "end_date", true);
            if (param.value.current == "완료" && end_date == "")
                end_date = gw_com_api.getDate();
            else if (param.value.current != "완료")
                end_date = "";
            gw_com_api.setValue(param.object, param.row, "end_date", end_date, true, false, false);
        } else if (param.element == "end_date") {
            var pstat = "";
            if (gw_com_api.unMask(param.value.current, "date-ymd") == "")
                pstat = "진행";
            else
                pstat = "완료";
            gw_com_api.setValue(param.object, param.row, "pstat", pstat, true, false, false);
        }
        var end_ymd = gw_com_api.getValue(param.object, param.row, "end_date", true);
        var rate = calcRate();
        gw_com_api.setValue("grdData_현황", "selected", "prc_rate", rate, true);
        //if (rate >= 100) {
        //    //gw_com_api.setValue("grdData_현황", "selected", "end_ymd", end_ymd, true);
        //    gw_com_api.setValue("grdData_현황", "selected", "pstat", "완료", true);
        //} else {
        //    gw_com_api.setValue("grdData_현황", "selected", "end_ymd", "", true);
        //    gw_com_api.setValue("grdData_현황", "selected", "pstat", "진행", true);
        //}

    }

}
//----------
function calcRate(param) {

    var ids = gw_com_api.getRowIDs("grdData_공정");
    var rate = 0;
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_공정", this, "pstat", true) == "완료")
            rate += Number(gw_com_api.getValue("grdData_공정", this, "std_prc_rate", true));
    });
    return rate;

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
        target: [
            {
                type: "GRID",
                id: "grdData_현황",
                refer: (param.sub) ? true : false
            },
            {
                type: "GRID",
                id: "grdData_보고서",
                refer: (param.sub) ? true : false
            },
            {
                type: "FORM",
                id: "frmData_보고서"
            },
			{
			    type: "GRID",
			    id: "grdData_FileA"
			}
		],
        param: param
    };
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

    var args = {
        target: [
	        { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
				{ name: "cust_dept", argument: "arg_cust_dept" },
				{ name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "proj_no", argument: "arg_proj_no" }
			],
            remark: [
			    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "dept_area" }] },
		        { element: [{ name: "cust_cd" }] },
		        { element: [{ name: "cust_dept"}] },
		        { element: [{ name: "cust_prod_nm"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true }
		],
        clear: [
            { type: "GRID", id: "grdData_보고서" },
		    { type: "FORM", id: "frmData_보고서" },
			{ type: "GRID", id: "grdData_FileA" }
		],
        key: v_global.logic.key1
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
            source: {
                type: "GRID", id: "grdData_보고서", row: "selected", block: true,
                element: [
                    { name: "setup_no", argument: "arg_setup_no" },
                    { name: "setup_ymd", argument: "arg_setup_ymd" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_보고서" }
            ],
            key: v_global.logic.key2
        };
    }
    else {
        if (param.key != undefined) {
            $.each(param.key, function () {
                if (this.QUERY == "w_ehm3020_S_2")
                    this.QUERY = "w_ehm3020_S_1";
            });
        }
        args = {
            source: {
                type: "GRID", id: "grdData_현황", row: "selected", block: true,
                element: [
				    { name: "setup_no", argument: "arg_setup_no" }
			    ]
            },
            target: [
                { type: "GRID", id: "grdData_보고서", select: true },
                { type: "GRID", id: "grdData_공정", select: true }
                /*,{ type: "GRID", id: "grdData_FileA" }*/
		    ],
            clear: [
		        { type: "FORM", id: "frmData_보고서" }
		    ],
            key: v_global.logic.key3
        };
    }
    gw_com_module.objRetrieve(args);
    processFileList({});
}

//------ 파일 리스트 조회
// Changed by JJJ 21.06.03 : processFileRetrieve -> processFileList 로 rename
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ASSETUP" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type
    var dataKey = v_global.logic.key3;

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? dataKey : param.data_key) },
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
//------ 파일 추가/수정/Rev
function processFileUpload(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    //var args = {
    //    type: "PAGE",
    //    page: "w_upload_assetup",
    //    title: "파일 업로드",
    //    width: 650,
    //    height: 200,
    //    locate: ["center", 600],
    //    open: true
    //};
    //if (gw_com_module.dialoguePrepare(args) == false) {
    //    var args = {
    //        page: "w_upload_assetup",
    //        param: {
    //            ID: gw_com_api.v_Stream.msg_upload_ASSETUP,
    //            data: {
    //                user: gw_com_module.v_Session.USR_ID,
    //                key: gw_com_api.getValue("grdData_현황", "selected", "setup_no", true),
    //                seq: gw_com_api.getValue("grdData_현황", "selected", "str_ymd", true)
    //            }
    //        }
    //    };
    //    gw_com_module.dialogueOpen(args);
    //}


    var dataType = "ASSETUP";    // Set File Data Type
    // add by kyt 2021-06-03
    var dataKey = gw_com_api.getValue("grdData_현황", "selected", "setup_no", true);
    var dataSeq = gw_com_api.getValue("grdData_현황", "selected", "str_ymd", true);

    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq }; // additional data = { data_subkey: "", data_subseq:-1 }

    // set Argument for Dialogue
    var pageArgs = dataType + ":multi" + ":Simple"; // 1.DataType, 2.파일선택 방식(multi/single), 3.UI Type(Simple/GroupA/ECM)
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 660, height: 500, scroll: true,  // multi( h:350, scroll) / single(h:300) / GroupA(h:500)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);


}

//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_보고서", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    if (param.sub) {
        gw_com_api.selectRow("grdData_보고서", "reset");
        var args = {
            targetid: "frmData_보고서",
            edit: true,
            data: [
                { name: "setup_no", value: gw_com_api.getValue("grdData_현황", "selected", "setup_no", true) },
                { name: "setup_ymd", value: gw_com_api.getDate() },
                { name: "pstat", value: "발생" }
            ]
        };
        gw_com_module.formInsert(args);
    } else {
        var args = {
            targetid: "grdData_현황", edit: true, updatable: true,
            data: [
                { name: "str_ymd", value: gw_com_api.getDate() }
            ],
            clear: [
		        { type: "GRID", id: "grdData_보고서" },
		        { type: "FORM", id: "frmData_보고서" },
		        { type: "GRID", id: "grdData_공정" },
		        { type: "GRID", id: "grdData_FileA" }
            ]
        };
        var row = gw_com_module.gridInsert(args);

        v_global.event.type = "GRID";
        v_global.event.object = "grdData_현황";
        v_global.event.row = row;
        v_global.event.element = "prod_sub";
        var args = {
            type: "PAGE", page: "w_find_prod_ehm", title: "장비 검색",
            width: 800, height: 460, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_prod_ehm",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectProduct_EHM
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    if (param.sub) {
        var args = {
            targetid: "grdData_보고서", row: "selected",
            clear: [
                { type: "FORM", id: "frmData_보고서" }
            ]
        };
        gw_com_module.gridDelete(args);
    }
    else {
        var args = {
            targetid: "grdData_현황", row: "selected", remove: true,
            clear: [
                { type: "GRID", id: "grdData_보고서" },
                { type: "FORM", id: "frmData_보고서" },
                { type: "GRID", id: "grdData_공정" },
                { type: "GRID", id: "grdData_FileA" }
            ]
        };
        gw_com_module.gridDelete(args);
    }
}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_현황" },
            { type: "GRID", id: "grdData_보고서" },
            { type: "FORM", id: "frmData_보고서" },
            { type: "GRID", id: "grdData_공정" },
            { type: "GRID", id: "grdData_FileA" }
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
                type: "GRID", id: "grdData_현황",
                key: [{ row: "selected", element: [{ name: "setup_no" }] }]
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_현황",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_보고서"
            }
        ]
    };
    if (param.master) {
        args.target.unshift({ type: "GRID", id: "grdData_보고서" });
        args.target.unshift({ type: "GRID", id: "grdData_공정" });
        args.target.unshift({ type: "GRID", id: "grdData_FileA" });
        args.target.unshift({ type: "GRID", id: "grdData_현황" });
    }
    else if (param.sub) {
        args.target.unshift({ type: "GRID", id: "grdData_보고서" });
        args.target.unshift({ type: "GRID", id: "grdData_FileA" });
    }
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

    v_global.logic.key1 = [{
        QUERY: $("#grdData_현황_data").attr("query"),
        KEY: [{ NAME: "setup_no", VALUE: gw_com_api.getValue("grdData_현황", "selected", "setup_no", true) }]
    }];
    v_global.logic.key2 = [{
        QUERY: $("#grdData_보고서_data").attr("query"),
        KEY: [
            { NAME: "setup_no", VALUE: gw_com_api.getValue("grdData_보고서", "selected", "setup_no", true) },
            { NAME: "setup_seq", VALUE: gw_com_api.getValue("grdData_보고서", "selected", "setup_seq", true) }
        ]
    }];
    v_global.logic.key3 = [{
        QUERY: $("#grdData_공정_data").attr("query"),
        KEY: [
            { NAME: "setup_no", VALUE: gw_com_api.getValue("grdData_공정", "selected", "setup_no", true) },
            { NAME: "prc_seq", VALUE: gw_com_api.getValue("grdData_공정", "selected", "prc_seq", true) }
        ]
    }];

    processRetrieve({});

    //var status = checkCRUD({});
    //if (status == "create" || status == "update")
    //    processRetrieve({ key: response });
    //else
    //    processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function processIssue(param) {

    if (!checkUpdatable({ check: true })) return false;

    var setup_no = gw_com_api.getValue("grdData_현황", "selected", "setup_no", true);
    if (setup_no == undefined || setup_no == "") return;
    var page = "EHM_2010";
    var title = "A/S 발생 등록";
    var param = [{ name: "setup_no", value: setup_no }];
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: page,
            title: title,
            param: param
        }
    };
    gw_com_module.streamInterface(args);

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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProduct_EHM:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_nm",
			                        param.data.cust_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_cd",
			                        param.data.cust_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_dept",
			                        param.data.cust_dept,
			                        (v_global.event.type == "GRID") ? true : false,
                                    true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_proc",
			                        param.data.cust_dept,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "cust_prod_nm",
			                        param.data.cust_prod_nm,
			                        (v_global.event.type == "GRID") ? true : false,
                                    true);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "prod_key",
			                        param.data.prod_key,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });


                // 공정
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_prod_type", value: param.data.prod_key }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_공정", query: "w_ehm3020_I_4", crud: "insert" }
                    ]
                };
                gw_com_module.objRetrieve(args);

            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASSETUP:
            {
                var args = {
                    source: {
                        type: "GRID",
                        id: "grdData_현황",
                        row: "selected",
                        element: [
				            {
				                name: "setup_no",
				                argument: "arg_setup_no"
				            }
			            ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_FileA",
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
                    case "w_find_prod_ehm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_EHM;
                        }
                        break;
                    //changed by kyt 2021-06-04
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
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
                //Add by KYT 21.06.04
                if (param.from.page == "SYS_FileUpload") {
                    processFileList({});
                    return;
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//