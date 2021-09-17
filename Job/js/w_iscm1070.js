//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // prepare dialogue.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            type: "PAGE",
            page: "IFProcess",
            path: "../Master/",
            title: "그룹웨어 로그인",
            width: 430,
            height: 90,
            locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                { type: "PAGE", name: "제품유형", query: "dddw_prodtype" },
                { type: "PAGE", name: "영업구분", query: "dddw_ordclass" },
                {
                    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM24" }]
                },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
                {
                    type: "PAGE", name: "LINE", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "IEHM02" }]
                },
                { type: "PAGE", name: "PROCESS", query: "dddw_custproc" },
                { type: "PAGE", name: "장비군", query: "dddw_prodgroup" },
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" },
                {
                    type: "PAGE", name: "부문", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM12" }]
                },
                {
                    type: "PAGE", name: "내역", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM13" }]
                },
                { type: "PAGE", name: "항목", query: "dddw_ordtest" },
                {
                    type: "PAGE", name: "변경사유", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "ISCM41" }]
                },
                {
                    type: "INLINE", name: "챔버구성",
                    data: [{ title: "SINGLE", value: "SINGLE" },
                           { title: "TWIN", value: "TWIN" },
                           { title: "ETC", value: "ETC" }]
                },
                {
                    type: "INLINE", name: "반도체",
                    data: [
						{ title: "메모리", value: "메모리" },
						{ title: "비메모리", value: "비메모리" }
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
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                //{ name: "프로젝트의뢰상신", value: "프로젝트의뢰상신", icon: "기타" },
                //{ name: "제조의뢰상신", value: "제조의뢰상신", icon: "기타" },
				//{ name: "제조변경상신", value: "제조변경상신", icon: "기타" },
				{ name: "조회", value: "조회", act: true },
                { name: "복사", value: "복사", icon: "기타" },
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        //var args = {
        //    targetid: "lyrMenu_File1", type: "FREE",
        //    element: [
		//		{ name: "조회", value: "사양서보기" },
		//		{ name: "추가", value: "추가" },
		//		{ name: "변경", value: "변경", icon: "기타" },
		//		{ name: "삭제", value: "삭제" }
        //    ]
        //};
        ////----------
        //gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "일괄생성", value: "일괄생성", icon: "실행" },
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
                                name: "ymd_fr", label: { title: "납기예정일 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }, style: { colfloat: "floating" }
                            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10 }
				            },
                            {
                                name: "proj_no", label: { title: "Project No : " }, //mask: "search",
                                editable: { type: "text", size: 10 }
                            }
                        ]
                    },
                    {
                        element: [
				            {
				                name: "cust_cd", label: { title: "고객사 :" },
				                editable: { type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] }, remark: { title: "고객사 :" } }
				            },
				            {
				                name: "ord_class",
				                label: { title: "영업구분 :" },
				                editable: { type: "select", data: { memory: "영업구분", unshift: [{ title: "전체", value: "%" }] }, remark: { title: "영업구분 :" } }
				            },
				            {
				                name: "prod_group", label: { title: "장비군 :" },
				                editable: { type: "select", data: { memory: "장비군" }, remark: { title: "장비군 :" } }
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
            targetid: "grdData_현황", query: "w_iscm1070_M_1", title: "생산 의뢰 현황",
            height: 150,
            //caption: true,
            show: true,
            selectable: true,
            element: [
				{ header: "고객사", name: "cust_nm", width: 150, align: "left" },
				{
				    header: "제품유형", name: "prod_type", width: 80, align: "center",
				    format: { type: "select", data: { memory: "제품유형" } }
				},
				{ header: "제품명", name: "prod_nm", width: 240, align: "left" },
				{ header: "호기", name: "prod_seq", width: 50, align: "center" },
				{
				    header: "영업구분", name: "ord_class", width: 80, align: "center",
				    format: { type: "select", data: { memory: "영업구분" } }
				},
				{ header: "Project No.", name: "proj_no", width: 80, align: "center" },
				{ header: "납기예정일", name: "due_ymd", width: 80, align: "center", mask: "date-ymd" },
				{ header: "출하일자", name: "dlv_ymd", width: 80, align: "center", mask: "date-ymd" },
				{ header: "상태", name: "sale_stat", width: 60, align: "center" }/*,
				{ header: "설계", name: "draw_stat", width: 60, align: "center" },
				{ header: "생산", name: "prod_stat", width: 60, align: "center" }*/,
                { header: "결재상태", name: "gw_status_nm", width: 60, align: "center" },
                { header: "결재번호", name: "gw_sys_key", width: 60, align: "center" },
                { header: "결재순번", name: "gw_seq", width: 60, align: "center" },
                { name: "ord_no", hidden: true, editable: { type: "hidden" } },
                { name: "gw_status", hidden: true },
                { name: "gw_cfm_cnt", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_상세", query: "w_iscm1070_S_1", type: "TABLE", title: "생산 의뢰서",
            caption: true, show: true, selectable: true,
            editable: { bind: "select", focus: "ord_class", validate: true },
            content: {
                width: { label: 80, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, type: "label", value: "영업구분", format: { type: "label" } },
                            {
                                name: "ord_class",
                                editable: { type: "select", data: { memory: "영업구분" }, validate: { rule: "required", message: "영업구분" } }
                            },
                            { header: true, value: "Project No.", format: { type: "label" } },
                            { name: "proj_no", editable: { type: "text", validate: { rule: "required" } } },
                            { header: true, value: "생산확정일", format: { type: "label" } },
                            { name: "rqst_ymd", mask: "date-ymd", editable: { type: "text", mask: "date-ymd" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "pstat", editable: { type: "select", data: { memory: "진행상태" } } },
                            { header: true, value: "생산의뢰 No.", format: { type: "label" } },
                            { name: "rqst_no", editable: { type: "text" } },
                            { header: true, value: "PO일자", format: { type: "label" } },
                            { name: "ord_ymd", mask: "date-ymd", editable: { type: "text", mask: "date-ymd" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "장비군", format: { type: "label" } },
                            { name: "prod_group", editable: { type: "hidden" } },
                            { header: true, type: "label", value: "제품유형", format: { type: "label" } },
                            {
                                name: "prod_type",
                                editable: { type: "select", data: { memory: "제품유형" }, validate: { rule: "required", message: "제품유형" } }
                            },
                            { header: true, value: "요청납기일", format: { type: "label" } },
                            {
                                name: "due_ymd", mask: "date-ymd",
                                editable: { type: "text", mask: "date-ymd", validate: { rule: "required", message: "요청납기일" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제품코드", format: { type: "label" } },
                            { name: "prod_cd", editable: { type: "text", validate: { rule: "required", message: "제품코드" } } },
                            { header: true, value: "제품명/호기", format: { type: "label" } },
                            { name: "prod_nm", editable: { type: "text", validate: { rule: "required", message: "제품명" } }, style: { colfloat: "float" } },
                            {
                                name: "prod_seq", format: { width: 66 },
                                editable: { type: "text", width: 66, validate: { rule: "required", message: "제품명" } }, style: { colfloat: "floating" }
                            },
                            { header: true, value: "출하일자", format: { type: "label" } },
                            { name: "dlv_ymd", mask: "date-ymd", editable: { type: "text", mask: "date-ymd", validate: { rule: "dateISO" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "챔버구성/PM수", format: { type: "label" } },
                            { name: "prod_desc0", format: { width: 100 }, editable: { type: "select", width: 100, data: { memory: "챔버구성" } }, style: { colfloat: "float" } },
                            { name: "prod_desc1", format: { width: 82 }, editable: { type: "text", width: 82 }, style: { colfloat: "floating" } },
                            { header: true, value: "Serial No.", format: { type: "label" } },
                            { name: "prod_sno", editable: { type: "text", validate: { rule: "required", message: "Serial No." } } },
                            { header: true, type: "label", value: "고객사", format: { type: "label" } },
                            {
                                name: "cust_cd",
                                editable: {
                                    type: "select", data: { memory: "고객사" },
                                    change: [{ name: "cust_line", memory: "LINE", key: ["cust_cd"] }],
                                    validate: { rule: "required", message: "고객사" }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "Line", format: { type: "label" } },
                            {
                                name: "cust_line",
                                editable: { type: "select", data: { memory: "LINE", key: ["cust_cd"] }, validate: { rule: "required", message: "Line" } }
                            },
                            { header: true, type: "label", value: "Process", format: { type: "label" } },
                            {
                                name: "cust_proc",
                                editable: { type: "select", data: { memory: "PROCESS" }, validate: { rule: "required", message: "Process" } } 
                            },
                            { header: true, value: "고객사담당자", format: { type: "label" } },
                            { name: "cust_man_nm", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "작성자", format: { type: "label" } },
                            {
                                name: "reg_emp",
                                editable: { type: "select", data: { memory: "사원" }, validate: { rule: "required", message: "작성자" } } 
                            },
                            { header: true, type: "label", value: "작성부서", format: { type: "label" } },
                            {
                                name: "reg_dept",
                                editable: { type: "select", data: { memory: "부서" }, validate: { rule: "required", message: "작성부서" }  }
                            },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "ins_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "변경사유", format: { type: "label" } },
                            {
                                name: "rev_cd",
                                format: { type: "select", data: { memory: "변경사유" } },
                                editable: { type: "select", data: { memory: "변경사유" } }
                            },
                            { header: true, type: "label", value: "Revision No.", format: { type: "label" } },
                            { name: "rev_no", editable: { type: "text" } },
                            { header: true, type: "label", value: "변경내용", format: { type: "label" } },
                            { name: "rev_rmk", editable: { type: "text" } },
                            //{ header: true, value: "변경일시", format: { type: "label" } },
                            { name: "rev_dt", hidden: true },
                            { name: "ord_no", hidden: true, editable: { type: "hidden" } },
                            { name: "ver_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "반도체 유형", format: { type: "label" } },
                            {
                                name: "prod_desc3",
                                format: { width: 100 },
                                editable: { type: "select", data: { memory: "반도체" } }
                            },
                            { header: true, type: "", value: "", format: { type: "label" } },
                            { name: "", editable: { type: "text" } },
                            { header: true, type: "label", value: "", format: { type: "label" } },
                            { name: "", editable: { type: "text" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_File1", query: "DLG_FILE_ZFILE_V", title: "사양서",
            caption: true, height: "100%", pager: false, show: false, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "파일명", name: "file_nm", width: 150, align: "left" },
                { header: "Revision", name: "rev_no", width: 50, align: "center" },
                { header: "Version", name: "ver_no", width: 50, align: "center" },
				{ header: "등록부서", name: "upd_dept", width: 100, align: "center", hidden: true },
				{ header: "등록자", name: "upd_usr", width: 50, align: "center" },
				{ header: "등록일시", name: "upd_dt", width: 120, align: "center" },
				{ header: "장비군", name: "file_group1", width: 80, align: "center", hidden: true },
				{ header: "업무구분", name: "file_group2", width: 80, align: "center", hidden: true },
				{ header: "문서분류", name: "file_group3", width: 80, align: "center", hidden: true },
				{ header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
				{ header: "Category", name: "file_group5", width: 80, align: "center", hidden: true },
				{
				    header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{
				    header: "설명(변경사유 등)", name: "file_desc", width: 330, align: "left",
				    editable: { type: "text", maxlength: 100, width: 440 }
				},
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "rev_type", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_계획", query: "w_iscm1070_D_1", title: "일정 계획",
            height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "job_dept", validate: true },
            element: [
				{
				    header: "부서", name: "job_dept", width: 150, align: "center",
				    format: { type: "select", data: { memory: "부서" } },
				    editable: { bind: "create", type: "select", data: { memory: "부서", unshift: [{ title: "", value: "" }] } }
				},
				{
				    header: "부문", name: "job_area", width: 150, align: "center",
				    format: { type: "select", data: { memory: "부문" } },
				    editable: { bind: "create", type: "select", data: { memory: "부문", unshift: [{ title: "", value: "" }] } }
				},
				{
				    header: "내역", name: "job_fld", width: 150, align: "center",
				    format: { type: "select", data: { memory: "내역" } },
				    editable: { bind: "create", type: "select", data: { memory: "내역", unshift: [{ title: "", value: "" }] } }
				},
				{
				    header: "담당자", name: "job_emp", width: 150, align: "center",
				    format: { type: "select", data: { memory: "사원" } },
				    editable: { bind: "create", type: "select", data: { memory: "사원", unshift: [{ title: "", value: "" }] } }
				},
				{ header: "시작일", name: "fr_ymd", width: 150, align: "center", mask: "date-ymd", editable: { type: "text" } },
				{ header: "종료일", name: "to_ymd", width: 150, align: "center", mask: "date-ymd", editable: { type: "text" } },
                { name: "ord_no", hidden: true, editable: { type: "hidden" } },
                { name: "job_seq", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_테스트", query: "w_iscm1070_D_2", title: "신뢰성 테스트",
            height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "test_id", validate: true },
            element: [
				{
				    header: "테스트 항목", name: "test_id", width: 500, align: "center",
				    format: { type: "select", data: { memory: "항목" } },
				    editable: { bind: "create", type: "select", data: { memory: "항목" }/*, disable: true */ }
				},
		        {
		            header: "여부", name: "test_yn", width: 200, align: "center",
		            format: { type: "checkbox", title: "", value: "1", offval: "0" },
		            editable: { type: "checkbox", title: "", value: "1", offval: "0" }
		        },
				{ header: "표시순번", name: "data_sort", width: 200, align: "center", editable: { type: "text" } },
                { name: "ord_no", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            collapsible: true,
            target: [
				{ type: "GRID", id: "grdData_계획", title: "일정 계획" },
				{ type: "GRID", id: "grdData_테스트", title: "신뢰성 테스트" }
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 },
				{ type: "FORM", id: "frmData_상세", offset: 8 },
				{ type: "GRID", id: "grdData_File1", offset: 8 },
				{ type: "GRID", id: "grdData_계획", offset: 8 },
				{ type: "GRID", id: "grdData_테스트", offset: 8 },
				{ type: "TAB", id: "lyrTab", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);

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
        //var args = { targetid: "lyrMenu_1", element: "프로젝트의뢰상신", event: "click", handler: processCallApp };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_1", element: "제조의뢰상신", event: "click", handler: click_lyrMenu_1_제조의뢰상신 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_1", element: "제조변경상신", event: "click", handler: click_lyrMenu_1_제조변경상신 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: click_lyrMenu_1_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "복사", event: "click", handler: click_lyrMenu_1_복사 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: click_lyrMenu_1_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: click_lyrMenu_1_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: click_lyrMenu_1_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu_File1", element: "조회", event: "click", handler: click_lyrMenu_File1_조회 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_File1", element: "추가", event: "click", handler: click_lyrMenu_File1_추가 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_File1", element: "변경", event: "click", handler: click_lyrMenu_File1_변경 };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "lyrMenu_File1", element: "삭제", event: "click", handler: click_lyrMenu_File1_삭제 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "일괄생성", event: "click", handler: click_lyrMenu_2_일괄생성 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: click_lyrMenu_2_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: click_lyrMenu_2_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: itemdblclick_frmOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: itemdblclick_frmOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrTab", event: "tabselect", handler: click_lyrTab_tabselect };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselecting", handler: rowselecting_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_상세", event: "itemchanged", handler: itemchanged_frmData_상세 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: processFileDownload };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_제조의뢰상신(ui) {

            if (!checkManipulate({})) return false;

            processApprove({});

        }
        //----------
        function click_lyrMenu_1_제조변경상신(ui) {

            if (!checkManipulate({})) return false;

            processApprove({ modify: true });

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
        function click_lyrMenu_1_복사(ui) {
            v_global.process.handler = processInsert;
            if (!checkManipulate({})) return;
            if (!checkUpdatable({})) return;

            setDefaultValue({});
            
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
        function click_lyrMenu_File1_조회(ui) {

            //v_global.process.handler = processUpload;
            //if (!checkManipulate({})) return;
            //if (!checkUpdatable({})) return;
            processPopup(ui);
        }
        //----------
        function click_lyrMenu_File1_추가(ui) {

            //v_global.process.handler = processUpload;
            //if (!checkManipulate({})) return;
            //if (!checkUpdatable({})) return;
            processUpload(ui);
        }
        //----------
        function click_lyrMenu_File1_변경(ui) {

            //v_global.process.handler = processUpload;
            //if (!checkManipulate({})) return;
            //if (!checkUpdatable({})) return;
            processUpload(ui);
        }
        //----------
        function click_lyrMenu_File1_삭제(ui) {

            if (!checkManipulate({})) return;
            processDelete(ui);
        }
        //----------
        function click_lyrMenu_2_일괄생성(ui) {

            if (!checkManipulate()) return false;
            if (!checkUpdatable({ check: true })) return false;
            /*
            if (gw_com_api.getRowCount("grdData_계획") > 0) {
            gw_com_api.messageBox([
            { text: "일정 계획 데이터가 이미 존재합니다." }
            ]);
            return false;
            }
            if (gw_com_api.getRowCount("grdData_테스트") > 0) {
            gw_com_api.messageBox([
            { text: "신뢰성 테스트 데이터가 이미 존재합니다." }
            ]);
            return false;
            }
            */

            processBatch({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate()) return;
            if (v_global.process.current.tab == 2) {
                gw_com_api.messageBox([
                    { text: "신뢰성 테스트 항목은 추가할 수 없습니다" }
                ]);
                return false;
            }

            var args = {
                targetid: "grdData_계획",
                edit: true,
                data: [
                    { name: "ord_no", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true) }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate()) return;
            if (v_global.process.current.tab == 2) {
                gw_com_api.messageBox([
                    { text: "신뢰성 테스트 항목은 삭제할 수 없습니다" }
                ]);
                return false;
            }

            var args = {
                targetid: "grdData_계획",
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
        function itemdblclick_frmOption(ui) {

            switch (ui.element) {
                case "proj_no":
                    {
                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_proj_mrp",
                            title: "Project 검색",
                            width: 1000,
                            height: 460,
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_proj_mrp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectProject_MRP
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function click_lyrTab_tabselect(ui) {

            v_global.process.current.tab = ui.row;

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
        function itemchanged_frmData_상세(ui) {

            switch (ui.element) {
                case "ord_ymd":
                    {
                        if (gw_com_api.getValue(ui.object, ui.row, ui.element) != "")
                            gw_com_api.setValue(ui.object, ui.row, "ord_class", "4");
                    }
                    break;
                case "dlv_ymd":
                    {
                        if (gw_com_api.getValue(ui.object, ui.row, ui.element) != "")
                            gw_com_api.setValue(ui.object, ui.row, "pstat", "2");
                    }
                    break;
            }

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -6 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        //----------
        gw_com_module.startPage();
        //----------
        v_global.process.current.tab = 1;

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

    return gw_com_api.getCRUD("frmData_상세");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD({}) == "none") {
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

    var args;
    if (param.file) {
        args = {
            check: param.check,
            target: [
                { type: "GRID", id: "grdData_File1" }
            ]
        };
    } else {
        args = {
            check: param.check,
            target: [
                { type: "FORM", id: "frmData_상세" },
                { type: "GRID", id: "grdData_File1" },
                { type: "GRID", id: "grdData_계획" },
                { type: "GRID", id: "grdData_테스트" }
            ]
        };
    }
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
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
function setDefaultValue(param) {
    var param = {
        sub: "copy"
    };
    var ord_class = gw_com_api.getValue("frmData_상세", 1, "ord_class");
    var pstat = gw_com_api.getValue("frmData_상세", 1, "pstat");
    var prod_type = gw_com_api.getValue("frmData_상세", 1, "prod_type");
    var prod_desc0 = gw_com_api.getValue("frmData_상세", 1, "prod_desc0");
    var prod_desc1 = gw_com_api.getValue("frmData_상세", 1, "prod_desc1");
    var cust_cd = gw_com_api.getValue("frmData_상세", 1, "cust_cd");
    var cust_line = gw_com_api.getValue("frmData_상세", 1, "cust_line");
    var cust_proc = gw_com_api.getValue("frmData_상세", 1, "cust_proc");
    var cust_man_nm = gw_com_api.getValue("frmData_상세", 1, "cust_man_nm");
    var reg_emp = gw_com_api.getValue("frmData_상세", 1, "reg_emp");
    var reg_dept = gw_com_api.getValue("frmData_상세", 1, "reg_dept");
    var rev_no = gw_com_api.getValue("frmData_상세", 1, "rev_no");

    processInsert(param);

    gw_com_api.setValue("frmData_상세", 1, "ord_class", ord_class);
    gw_com_api.setValue("frmData_상세", 1, "pstat", pstat);
    gw_com_api.setValue("frmData_상세", 1, "prod_type", prod_type);
    gw_com_api.setValue("frmData_상세", 1, "prod_desc0", prod_desc0);
    gw_com_api.setValue("frmData_상세", 1, "prod_desc1", prod_desc1);
    gw_com_api.setValue("frmData_상세", 1, "cust_cd", cust_cd);
    gw_com_api.setValue("frmData_상세", 1, "cust_line", cust_line);
    gw_com_api.setValue("frmData_상세", 1, "cust_proc", cust_proc);
    gw_com_api.setValue("frmData_상세", 1, "cust_man_nm", cust_man_nm);
    gw_com_api.setValue("frmData_상세", 1, "reg_emp", reg_emp);
    gw_com_api.setValue("frmData_상세", 1, "reg_dept", reg_dept);
    gw_com_api.setValue("frmData_상세", 1, "rev_no", rev_no);
}
//----------
function processRetrieve(param) {

    var args = {
        target: [ { type: "FORM", id: "frmOption" } ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    if (param.selected) {
        param.key = [{
            KEY: [
                { NAME: "ord_no", VALUE: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true) }
            ],
            QUERY: "w_iscm1070_M_1"
        }];
    }
    else if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "w_iscm1070_S_1")
                this.QUERY = "w_iscm1070_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
                { name: "ord_class", argument: "arg_ord_class" },
				{ name: "prod_group", argument: "arg_prod_group" },
				{ name: "proj_no", argument: "arg_proj_no" }
            ],
            remark: [
		        { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
		        { element: [{ name: "cust_cd"}] },
		        { element: [{ name: "ord_class"}] },
		        { element: [{ name: "prod_group"}] },
		        { element: [{ name: "proj_no"}] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true }
		],
        clear: [
            { type: "FORM", id: "frmData_상세" },
			{ type: "GRID", id: "grdData_File1" },
			{ type: "GRID", id: "grdData_계획" },
			{ type: "GRID", id: "grdData_테스트" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args;

    if (param.object == "grdData_File1") {
        var file_key = gw_com_api.getValue("grdData_현황", "selected", "ord_no", true);
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_data_key", value: file_key },	// 첨부파일용
                    { name: "arg_data_seq", value: -1 }	        // 첨부파일용
                ]
            },
            target: [
                { type: "GRID", id: "grdData_File1" }
            ],
            key: param.key
        };
    } else {
        args = {
            source: {
                type: "GRID", id: "grdData_현황", row: "selected", block: true,
                element: [
                    { name: "ord_no", argument: "arg_ord_no" },
                    { name: "ord_no", argument: "arg_data_key" }	// 첨부파일용
                ],
                argument: [
                    { name: "arg_data_seq", value: -1 }	            // 첨부파일용
                ]
            },
            target: [
                { type: "GRID", id: "grdData_계획" },
                { type: "GRID", id: "grdData_테스트" }
            ],
            key: param.key
        };
        if (param.sub != true) {
            args.target.unshift({ type: "GRID", id: "grdData_File1" });
            args.target.unshift({ type: "FORM", id: "frmData_상세" });
        }
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_현황", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {
        targetid: "frmData_상세",
        edit: true,
        updatable: true,
        data: [ { name: "prod_group", value: gw_com_api.getValue("frmOption", 1, "prod_group") } ], 
        clear: [
		    { type: "GRID", id: "grdData_계획" },
            { type: "GRID", id: "grdData_테스트" }
	    ]
    };
    gw_com_module.formInsert(args);
    if (param.sub != "copy") {
        gw_com_api.selectRow("grdData_현황", "reset");
    }
    /*
    var args = {
    source: {
    type: "FORM",
    id: "frmData_상세",
    block: true,
    element: [
    {
    name: "prod_group",
    argument: "arg_prod_group"
    }
    ]
    },
    target: [
    {
    type: "GRID",
    id: "grdData_계획",
    query: "w_iscm1070_D_1_C",
    crud: "insert"
    },
    {
    type: "GRID",
    id: "grdData_테스트",
    query: "w_iscm1070_D_2_C",
    crud: "insert"
    }
    ]
    };
    gw_com_module.objRetrieve(args);
    */

}
//----------
function processDelete(param) {

    if (param.object == "lyrMenu_File1") {
        //args = { targetid: "grdData_File1", row: "selected", select: true };
        processFileDelete(param);
    } else {
        var args = {
            targetid: "grdData_현황", row: "selected",
            clear: [
                { type: "FORM", id: "frmData_상세" },
                { type: "GRID", id: "grdData_File1" },
                { type: "GRID", id: "grdData_계획" },
                { type: "GRID", id: "grdData_테스트" }
            ]
        };
        gw_com_module.gridDelete(args);
    }

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_상세" },
            { type: "GRID", id: "grdData_File1" },
            { type: "GRID", id: "grdData_계획" },
            { type: "GRID", id: "grdData_테스트" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    if (gw_com_api.getCRUD("frmData_상세") == "update") {
        if (gw_com_api.getValue("frmData_상세", 1, "rev_cd") == "" || gw_com_api.getValue("frmData_상세", 1, "rev_cd") == null) {
            gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
            gw_com_api.setError(true, "frmData_상세", 1, "rev_cd", false);
            return false;
        } else if (gw_com_api.getValue("frmData_상세", 1, "rev_no") == "" || gw_com_api.getValue("frmData_상세", 1, "rev_no") == null) {
            gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
            gw_com_api.setError(true, "frmData_상세", 1, "rev_no", false);
            return false;
        }
    }
    gw_com_api.setError(false, "frmData_상세", 1, "rev_cd", false);
    gw_com_api.setError(false, "frmData_상세", 1, "rev_no", false);

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
		        type: "GRID",
		        id: "grdData_현황",
		        key: [
		            { row: "selected", element: [ { name: "ord_no" } ] } 
		        ]
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processBatch(param) {

    /*
    var args = {
    source: {
    type: "FORM",
    id: "frmData_상세",
    //block: true,
    element: [
    {
    name: "ord_no",
    argument: "arg_ord_no"
    },
    {
    name: "prod_type",
    argument: "arg_prod_group"
    }
    ]
    },
    target: [
    {
    type: "GRID",
    id: "grdData_계획",
    query: "w_iscm1070_D_1_C",
    crud: "insert"
    },
    {
    type: "GRID",
    id: "grdData_테스트",
    query: "w_iscm1070_D_2_C",
    crud: "insert"
    }
    ]
    };
    gw_com_module.objRetrieve(args);
    */
    var args = {
        url: "COM",
        procedure: "sp_scmOrderDtlAdd",
        input: [
            { name: "arg_ord_no", value: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true), type: "varchar" },
            { name: "arg_usr", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function processApprove(param) {

    var cfm_cnt = Number(gw_com_api.getValue("grdData_현황", "selected", "gw_cfm_cnt", true));
    var status = gw_com_api.getValue("grdData_현황", "selected", "gw_status_nm", true);
    if (param.modify) {
        if (cfm_cnt == 0) {
            gw_com_api.messageBox([
                { text: "신규 결재 상신 대상이므로 처리할 수 없습니다." }
            ], 420);
            return false;
        }
    } else {
        if (cfm_cnt != 0) {
            gw_com_api.messageBox([
                { text: "변경상신 대상이므로 처리할 수 없습니다." }
            ], 420);
            return false;
        }
    }

    if (status == '진행중') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }

    var args = {
        page: "IFProcess",
        param: {
            ID: gw_com_api.v_Stream.msg_authSystem,
            data: {
                system: "GROUPWARE",
                name: gw_com_module.v_Session.GW_ID,
                encrypt: { password: true },
                param: param
            }
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_상세" },
            { type: "GRID", id: "grdData_계획" },
            { type: "GRID", id: "grdData_테스트" }
        ]
    };
    if (param.master)
        args.target.unshift({ type: "GRID", id: "grdData_현황" });

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
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function successBatch(response) {

    processLink({ sub: true });

}
//----------
function successApproval(response, param) {

    processRetrieve({ selected: true });

    gw_com_api.showMessage("그룹웨어 페이지로 이동합니다.");
    var data = {};
    $.each(response.NAME, function (approval_i) {
        data[response.NAME[approval_i]] = response.VALUE[approval_i];
    });
    if (data.r_value < 0) {
        gw_com_api.showMessage(data.message);
        return;
    }
    var params = [
        { name: "sysid", value: "PLM" },
        { name: "sys_key", value: data.r_key },
        { name: "seq", value: data.r_seq }
    ];
    gw_com_site.gw_appr(params);

}
//---------- 파일 추가/수정/Rev
function processUpload(param) {

    // Check
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // Parameter 설정
    v_global.logic.FileUp = {
        type: "ORD_SPEC",
        key: gw_com_api.getValue("frmData_상세", 1, "ord_no"),
        seq: 0,
        user: gw_com_module.v_Session.USR_ID,
        crud: "C", rev: 0, revise: false,
        biz_area: "영업",
        doc_area: "60", //사양서
        cust_cd: gw_com_api.getValue("frmData_상세", 1, "cust_cd"),
        prod_type: gw_com_api.getValue("frmData_상세", 1, "prod_type")
    };

    // Prepare File Upload Window
    var page = (param.element == "추가" ? "DLG_FileUpload" : "DLG_FileUpload_Modify");
    var height = (param.element == "추가" ? 280 : 260);
    var args = {
        type: "PAGE", page: page, title: "파일 업로드", datatype: "ORDER",
        width: 650, height: height, open: true, locate: ["center", 400]
    }; //

    if (param.element == "변경") {
        var row = gw_com_api.getSelectedRow("grdData_File1");
        if (row < 1) {
            gw_com_api.messageBox([{ text: "변경할 데이터가 선택되지 않았습니다." }]);
            return;
        }
        v_global.logic.FileUp.file_id = gw_com_api.getValue("grdData_File1", "selected", "file_id", true);
        v_global.logic.FileUp.ver_no = gw_com_api.getValue("grdData_File1", "selected", "ver_no", true);
        v_global.logic.FileUp.rev_no = gw_com_api.getValue("grdData_File1", "selected", "rev_no", true);
    }


    if (gw_com_module.dialoguePrepare(args) == false) {
        // 아래 로직은 두 번째 Open 부터 작동함. 첫 번째는 streamProcess 에 의함
        var args = {
            page: page,
            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processFileDelete(param) {

    if (!checkUpdatable({ check: true, file: true })) return false;
    if (gw_com_api.getSelectedRow("grdData_File1") < 1) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var qryZfile = {
        url: "COM",
        query: "DLG_FILE_ZFILE", // ZFILE
        row: [{
            crud: "U",
            column: [
                { name: "file_id", value: gw_com_api.getValue("grdData_File1", "selected", "file_id", true) },
                { name: "use_yn", value: "0" },
                //{ name: "rev_type", value: "D" }
            ]
        }]
    };

    var args = {
        user: gw_com_module.v_Session.USR_ID,
        param: [qryZfile],
        handler: { success: successDelete }
    };
    gw_com_module.objSave(args);

}
//----------
function successDelete(response, param) {
    processLink({ object: "grdData_File1" });
}
//----------
function processPopup(param) {

    var row = gw_com_api.getSelectedRow("grdData_File1");
    if (row < 1) {
        gw_com_api.messageBox([{ text: "조회할 데이터가 선택되지 않았습니다." }]);
        return;
    }
    
    v_global.logic.popup = {
        file_id: gw_com_api.getValue("grdData_File1", row, "file_id", true)
    };

    var args = {
        type: "PAGE", page: "w_iscm1071", title: "사양서",
        width: 900, height: 450, open: true, locate: ["center", "center"]
    }; //
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_iscm1071",
            param: { ID: gw_com_api.v_Stream.msg_openedDialogue, data: v_global.logic.popup }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processFileDownload(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}

function processCallApp(param) {

    var args = "menu_id=&user_id=" + gw_com_module.v_Session.USR_ID;
    var url = "/App_Setup/MACT_A/IpsMesMactA.application?" + args;
    window.open(url, "", "scrollbars=yes,toolbar=yes,resizable=yes,width=100,height=100,left=0,top=0");

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
                                processSave({});
                            else {
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_MRP:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_no",
			                        param.data.proj_no,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "proj_nm",
			                        param.data.proj_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_sys_key = gw_com_api.getValue("grdData_현황", "selected", "gw_sys_key", true);
                var gw_seq = gw_com_api.getValue("grdData_현황", "selected", "gw_seq", true);
                gw_seq = (gw_seq < 1) ? 0 : gw_seq;
                var ord_no = gw_com_api.getCellValue("FORM", "frmData_상세", "1", "ord_no");
                var args = {
                    url: "COM",
                    procedure: (param.data.param.modify)
                                    ? "PROC_SM_ORDER_MODIFY_APPROVAL" : "PROC_SM_ORDER_APPROVAL",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "ord_no", value: ord_no, type: "varchar" },
                        { name: "gw_sys_key", value: gw_sys_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: {
                        success: successApproval,
                        param: param.data.param
                    }
                };
                gw_com_module.callProcedure(args);
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
                    case "w_find_proj_mrp": {
                        args.ID = gw_com_api.v_Stream.msg_selectProject_MRP;
                    } break;
                    case "DLG_FileUpload":
                    case "DLG_FileUpload_Modify": {
                        args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                        args.data = v_global.logic.FileUp;
                    } break;
                    case "w_iscm1071":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.logic.popup;
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
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER:
            {
                closeDialogue({ page: param.from.page });
                processLink({ object: "grdData_File1" });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//