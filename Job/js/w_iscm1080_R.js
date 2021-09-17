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
                {
                    type: "PAGE", name: "제품유형", query: "dddw_prodtype"
                },
                {
                    type: "PAGE", name: "LINE", query: "dddw_zcoded",
                    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
                },
                {
                    type: "PAGE", name: "PROCESS", query: "dddw_custproc"
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
                },
                {
                    type: "PAGE", name: "부문", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM12" }
                    ]
                },
                {
                    type: "PAGE", name: "RQST", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM28" }
                    ]
                },
                {
                    type: "PAGE", name: "내역", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM13" }
                    ]
                },
                {
                    type: "INLINE", name: "챔버구성",
                    data: [
						{ title: "SINGLE", value: "SINGLE" },
						{ title: "TWIN", value: "TWIN" },
						{ title: "ETC", value: "ETC" }
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

            
            v_global.logic.proj_no = gw_com_api.getPageParameter("proj_no");
            gw_com_api.setValue("frmOption", 1, "proj_no", v_global.logic.proj_no);
            //gw_com_api.setValue("frmOption", 1, "proj_no", "SCM-IT-TEST-11");

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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "조회", value: "새로고침" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: false,
            editable: { focus: "proj_no", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No : " }, mask: "search",
                                editable: { type: "text", size: 8, maxlength: 20 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_사양", query: "w_iscm1080_R1", title: "사양서", caption: true,
            height: 250, show: true, selectable: true,
            color: { row: true },
            element: [
				{ header: "Module", name: "module_nm", width: 130, align: "left" },
				{ header: "Option", name: "option_nm", width: 150, align: "left" },
				{
				    header: " ", name: "item1_yn", width: 20, align: "center",
				    format: { type: "checkbox", value: "1", offval: "0" }
				},
				{
				    header: "항목1", name: "item1_nm", width: 190, align: "left",
				    format: { type: "text"}
				},
                {
                    header: " ", name: "item2_yn", width: 20, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
				{
				    header: "항목2", name: "item2_nm", width: 190, align: "left",
				    format: { type: "text" }
				},
                {
                    header: " ", name: "item3_yn", width: 20, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
				{
				    header: "항목3", name: "item3_nm", width: 190, align: "left",
				    format: { type: "text" }
				},
                {
                    header: " ", name: "item4_yn", width: 20, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
				{
				    header: "항목4", name: "item4_nm", width: 190, align: "left",
				    format: { type: "text" }
				},
                {
                    header: " ", name: "item5_yn", width: 20, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
				{
				    header: "항목5", name: "item5_nm", width: 190, align: "left",
				    format: { type: "text" }
				},
                { name: "bgcolor", hidden: true }
                //{ name: "gw_status", hidden: true },
                //{ name: "gw_cfm_cnt", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_상세", query: "w_iscm1080_R_S_1", type: "TABLE", title: "생산 의뢰서",
            caption: true, show: true,
            content: { width: { label: 80, field: 200 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, type: "label", value: "영업구분", format: { type: "label" } },
                            { name: "ord_nm" },
                            { header: true, value: "Project No.", format: { type: "label" } },
                            { name: "proj_no", editable: { type: "text", validate: { rule: "required" } } },
                            { header: true, value: "생산의뢰 No.", format: { type: "label" } },
                            { name: "rqst_no", editable: { type: "text" } },
                            { header: true, value: "사양확정일", format: { type: "label" } },
                            { name: "rqst_ymd", mask: "date-ymd", editable: { type: "text", mask: "date-ymd" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "pstat_nm" },
                            { header: true, type: "label", value: "장비군", format: { type: "label" } },
                            { name: "prod_group", editable: { type: "hidden" } },
                            { header: true, value: "PO일자", format: { type: "label" } },
                            { name: "ord_ymd", mask: "date-ymd", editable: { type: "text", mask: "date-ymd" } },
                            { header: true, value: "요청납기일", format: { type: "label" } },
                            {
                                name: "due_ymd", mask: "date-ymd",
                                editable: {
                                    type: "text", mask: "date-ymd",
                                    validate: { rule: "required", message: "요청납기일" }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            
                            { header: true, type: "label", value: "제품유형", format: { type: "label" } },
                            {
                                name: "prod_type",
                                editable: {
                                    type: "select", data: { memory: "제품유형" },
                                    validate: { rule: "required", message: "제품유형" }
                                }
                            },
                            { header: true, value: "제품코드", format: { type: "label" } },
                            { name: "prod_cd", editable: { type: "text", validate: { rule: "required", message: "제품코드" } } },
                            { header: true, value: "제품명/호기", format: { type: "label" } },
                            { name: "prod_nm", format: { width: 180 }, style: { colfloat: "float" } },
                            { name: "prod_seq", format: { width: 45 }, style: { colfloat: "floating" } },
                            { header: true, value: "출하일자", format: { type: "label" } },
                            { name: "dlv_ymd", mask: "date-ymd", editable: { type: "text", mask: "date-ymd", validate: { rule: "dateISO" } } }
                            
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "챔버구성/PM수", format: { type: "label" } },
                            { name: "prod_desc0", format: { width: 130 }, editable: { type: "select", width: 100, data: { memory: "챔버구성" } }, style: { colfloat: "float" } },
                            { name: "prod_desc1", format: { width: 52 }, editable: { type: "text", width: 82 }, style: { colfloat: "floating" } },
                            { header: true, type: "label", value: "작성자", format: { type: "label" } },
                            { name: "emp_nm" },
                            { header: true, type: "label", value: "작성부서", format: { type: "label" } },
                            { name: "dept_nm", },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "ins_dt", mask: "date-ymd" }
                            
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "반도체 유형", format: { type: "label" } },
                            { name: "prod_desc3" },
                            { header: true, value: "결재번호", format: { type: "label" } },
                            { name: "sys_key" },
                            { header: true, value: "승인구분", format: { type: "label" } },
                            { name: "gw_status_nm" },
                            { header: true, value: "설치완료일자", format: { type: "label" } },
                            { name: "setup_ymd", mask: "date-ymd", editable: { type: "text", mask: "date-ymd", validate: { rule: "dateISO" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Serial No.", format: { type: "label" } },
                            { name: "prod_sno", editable: { type: "text", validate: { rule: "required", message: "Serial No." } } },
                            { header: true, value: "의뢰구분", format: { type: "label" } },
                            { name: "rqst_type" },
                            { header: true, type: "label", value: "Revision No.", format: { type: "label" } },
                            { name: "rev_no", editable: { type: "text" } },
                            { header: true, value: "변경일시", format: { type: "label" } },
                            { name: "rev_dt", mask: "date-ymd", editable: { type: "text", mask: "date-ymd", validate: { rule: "dateISO" } } },
                            { name: "ord_no", hidden: true, editable: { type: "hidden" } },
                            { name: "ver_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "변경사유", format: { type: "label" } },
                            { name: "rev_nm", format: { type: "text" }, style: { colspan: 3 } },
                            { header: true, type: "label", value: "변경내용", format: { type: "label" } },
                            { name: "rev_rmk", editable: { type: "text" }, style: { colspan: 3 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "고객사", format: { type: "label" } },
                            { name: "cust_nm" },
                            { header: true, type: "label", value: "Line", format: { type: "label" } },
                            {
                                name: "cust_line",
                                editable: {
                                    type: "select",
                                    data: { memory: "LINE", key: ["cust_cd"] },
                                    validate: { rule: "required", message: "Line" }
                                }
                            },
                            { header: true, type: "label", value: "Process", format: { type: "label" } },
                            {
                                name: "cust_proc",
                                editable: {
                                    type: "select", data: { memory: "PROCESS" },
                                    validate: { rule: "required", message: "Process" }
                                }
                            },
                            { header: true, value: "고객사담당자", format: { type: "label" } },
                            { name: "cust_man_nm" }
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
            targetid: "grdData_계획", query: "w_iscm1080_R_D_1", title: "일정 계획",
            height: "100%", pager: false, show: true, selectable: true, caption: true,
            element: [
				{ header: "부서", name: "dept_nm", width: 150, align: "center", },
				{
				    header: "부문", name: "job_area", width: 150, align: "center",
				    format: { type: "select", data: { memory: "부문" } },
				    editable: { bind: "create", type: "select", data: { memory: "부문", unshift: [{ title: "", value: "" }] } }
				},
				{
				    header: "내역", name: "job_fld", width: 150, align: "center",
				    format: { type: "select", data: { memory: "내역" } }
				},
				{ header: "담당자", name: "emp_nm", width: 150, align: "center", },
				{ header: "시작일", name: "fr_ymd", width: 150, align: "center", mask: "date-ymd" },
				{ header: "종료일", name: "to_ymd", width: 150, align: "center", mask: "date-ymd" },
                { name: "ord_no", hidden: true, editable: { type: "hidden" } }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "grdData_테스트", query: "w_iscm1080_R_D_2", title: "신뢰성 테스트",
        //    height: "100%", pager: false, show: true, selectable: true,
        //    element: [
		//		{
		//		    header: "테스트 항목", name: "test_id", width: 500, align: "center",
		//		    format: { type: "select", data: { memory: "항목" } }
		//		},
		//        {
		//            header: "여부", name: "test_yn", width: 200, align: "center",
		//            format: { type: "checkbox", title: "", value: "1", offval: "0" }
		//        },
		//		{ header: "표시순번", name: "data_sort", width: 200, align: "center", },
        //        { name: "ord_no", hidden: true, editable: { type: "hidden" } }
		//	]
        //};
        ////----------
        //gw_com_module.gridCreate(args);
        //=====================================================================================
        //var args = {
        //    tabid: "lyrTab",
        //    collapsible: true,
        //    target: [
		//		{ type: "GRID", id: "grdData_계획", title: "일정 계획" },
		//		{ type: "GRID", id: "grdData_테스트", title: "신뢰성 테스트" }
		//	]
        //};
        ////----------
        //gw_com_module.convertTab(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_사양", offset: 8 },
				{ type: "FORM", id: "frmData_상세", offset: 8 },
				{ type: "GRID", id: "grdData_File1", offset: 8 },
				{ type: "GRID", id: "grdData_계획", offset: 8 },
				//{ type: "GRID", id: "grdData_테스트", offset: 8 },
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
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrTab", event: "tabselect", handler: click_lyrTab_tabselect };
        gw_com_module.eventBind(args);
        //----------
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function click_lyrMenu_1_닫기(ui) {
            top.window.close();

        }
        //----------       
        function click_lyrTab_tabselect(ui) {

            v_global.process.current.tab = ui.row;

        }
        //----------
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
//function processLink(param) {
//    var args = {
//        source: {
//            type: "FORM", id: "frmData_상세", hide: true,
//            element: [
//				{ name: "ord_no", argument: "arg_ord_no" }
//            ]
//        },
//        target: [
//            { type: "GRID", id: "grdData_계획" },
//            { type: "GRID", id: "grdData_테스트" }
//        ],
//        key: param.key
//    };
//    gw_com_module.objRetrieve(args);
//}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    //if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve 
    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "proj_no", argument: "arg_proj_no" }
            ],
            remark: [
		        { element: [{ name: "proj_no" }] }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_상세", focus: true },
            { type: "GRID", id: "grdData_사양" },
            { type: "GRID", id: "grdData_계획" }
            //{ type: "GRID", id: "grdData_테스트" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//function processRetrieve(param) {

//    var args = {
//        target: [
//	        {
//	            type: "FORM",
//	            id: "frmOption"
//	        }
//        ]
//    };
//    if (gw_com_module.objValidate(args) == false) {
//        processClear({ master: true });
//        return false;
//    }

//    if (param.selected) {
//        param.key = [{
//            KEY: [
//                { NAME: "ord_no", VALUE: gw_com_api.getValue("grdData_현황", "selected", "ord_no", true) }
//            ],
//            QUERY: "w_iscm1070_M_1"
//        }];
//    }
//    else if (param.key != undefined) {
//        $.each(param.key, function () {
//            if (this.QUERY == "w_iscm1070_S_1")
//                this.QUERY = "w_iscm1070_M_1";
//        });
//    }
//    var args = {
//        source: {
//            type: "FORM", id: "frmOption", hide: true,
//            element: [
//				{ name: "ymd_fr", argument: "arg_ymd_fr" },
//				{ name: "ymd_to", argument: "arg_ymd_to" },
//				{ name: "cust_cd", argument: "arg_cust_cd" },
//                { name: "ord_class", argument: "arg_ord_class" },
//				{ name: "prod_group", argument: "arg_prod_group" },
//				{ name: "proj_no", argument: "arg_proj_no" }
//            ],
//            remark: [
//		        { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
//		        { element: [{ name: "cust_cd"}] },
//		        { element: [{ name: "ord_class"}] },
//		        { element: [{ name: "prod_group"}] },
//		        { element: [{ name: "proj_no"}] }
//		    ]
//        },
//        target: [
//			{ type: "GRID", id: "grdData_현황", select: true }
//		],
//        clear: [
//            { type: "FORM", id: "frmData_상세" },
//			{ type: "GRID", id: "grdData_File1" },
//			{ type: "GRID", id: "grdData_계획" },
//			{ type: "GRID", id: "grdData_테스트" }
//		],
//        key: param.key
//    };
//    gw_com_module.objRetrieve(args);

//}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
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