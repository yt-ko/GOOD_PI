//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 시정조치 요구서 내역
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue. ---그룹웨어 로그인
        //        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
        //            width: 430, height: 90, locate: ["center", 200]
        //        };
        //        gw_com_module.dialoguePrepare(args);

        // set data for DDDW List
        var args = { request: [
                { type: "PAGE", name: "발생구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM010"}]
                },
                { type: "PAGE", name: "발행구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM021"}]
                },
                { type: "PAGE", name: "진행구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM025"}]
                },
                { type: "PAGE", name: "발행근거", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM030"}]
                },
                { type: "INLINE", name: "합불판정",
                    data: [{ title: "합격", value: "1" }, { title: "불합격", value: "0"}]
                },
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }

    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                { name: "상세", value: "발생정보", icon: "실행" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "QDM_6220_M_1", type: "TABLE", title: "NCR",
            caption: true, show: true, selectable: true,
            content: { width: { label: 100, field: 190 }, height: 25,
                row: [
                    { element: [
                        { header: true, value: "발행번호", format: { type: "label"} },
                        { name: "rqst_no", editable: { type: "hidden"} },
                        { header: true, value: "발행자", format: { type: "label"} },
                        { name: "rqst_user_nm", mask: "search", display: true, editable: { type: "text"} },
                        { header: true, value: "발행일자", format: { type: "label"} },
                        { name: "rqst_dt", mask: "date-ymd",
                            editable: { type: "text", validate: { rule: "required"} }
                        }
	                    ]
                    },
                    { element: [
                        { header: true, value: "발생구분", format: { type: "label"} },
                        { name: "issue_tp", editable: { type: "hidden"} },
                        { header: true, value: "발생부서", format: { type: "label"} },
                        { name: "issue_dept", editable: { type: "hidden"} },
                        { header: true, value: "발생일자", format: { type: "label"} },
                        { name: "issue_dt", mask: "date-ymd", editable: { type: "hidden"} }
	                    ]
                    },
                    { element: [
                        { header: true, value: "관리번호", format: { type: "label"} },
                        { name: "issue_no", editable: { type: "hidden"} },
                        { header: true, value: "발행구분", format: { type: "label"} },
                        { name: "astat", editable: { type: "hidden" } },
                        { header: true, value: "상태변경일", format: { type: "label"} },
                        { name: "astat_dt", editable: { type: "hidden"} }
	                    ]

                    },
                    { element: [
                        { header: true, value: "제 품 명", format: { type: "label"} },
                        { name: "prod_nm", editable: { type: "hidden"} },
                        { header: true, value: "발행근거", format: { type: "label"} },
                        { name: "rqst_tp",
                            editable: { type: "select", data: { memory: "발행근거" }, validate: { rule: "required"} }
                        },
                        { header: true, value: "처리요구일", format: { type: "label"} },
                        { name: "actrqst_dt", mask: "date-ymd",
                            editable: { type: "text", validate: { rule: "required"} }
                        }
	                    ]
                    },
                    { element: [
                        { header: true, value: "시정조치 요구내용", format: { type: "label"} },
                        { name: "rqst_rmk", style: { colspan: 5 },
                            format: { type: "textarea", rows: 8, width: 900 },
                            editable: { type: "textarea", rows: 8, width: 990 }
                        },
                        { name: "file_cnt", hidden: true },
                        { name: "rqst_user", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "QDM_6220_S_1", title: "담당 부서",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
				{ header: "담당부서", name: "dept_nm", width: 120, align: "left", mask: "search", display: true,
				    editable: { type: "text", validate: { rule: "required"} }
				},
				{ header: "담당자", name: "user_nm", width: 60, align: "left", mask: "search", display: true,
				    editable: { type: "text" }
				},
				{ header: "협력사", name: "supp_nm", width: 120, align: "left", mask: "search", display: true,
				    editable: { type: "text" }
				},
                { header: "처리상태", name: "astat", width: 70, align: "center", editable: { type: "hidden"} },
                { header: "처리방안", name: "plan_cd", width: 80, align: "center" },
                { header: "계획자", name: "plan_user", width: 60, align: "center" },
                { header: "계획일자", name: "plan_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "처리자", name: "act_user", width: 60, align: "center" },
                { header: "처리일자", name: "act_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "확인결과", name: "check_cd", width: 60, align: "center" },
                { header: "확인자", name: "check_user", width: 60, align: "center" },
                { name: "dept_cd", hidden: true, editable: { type: "hidden"} },
                { name: "user_id", hidden: true, editable: { type: "hidden"} },
                { name: "supp_cd", hidden: true, editable: { type: "hidden"} },
				{ name: "rqst_no", hidden: true, editable: { type: "hidden"} },
				{ name: "act_seq", hidden: true, editable: { type: "hidden"} }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //var args = { targetid: "frmData_D1", query: "QDM_6220_D_1", type: "TABLE", title: "처리계획 및 결과",
        //    caption: true, show: true, selectable: true,
        //    content: { width: { label: 100, field: 190 }, height: 25,
        //        row: [
        //            { element: [
        //                { header: true, value: "처리상태", format: { type: "label"} },
        //                { name: "astat", editable: { type: "hidden" } },
        //                { header: true, value: "계획자", format: { type: "label"} },
        //                { name: "plan_user_nm" },
        //                { header: true, value: "계획일자", format: { type: "label"} },
        //                { name: "plan_dt", mask: "date-ymd",
        //                    editable: { type: "text", validate: { rule: "required"} }
        //                }
	    //                ]
        //            },
        //            { element: [
        //                { header: true, value: "처리방안", format: { type: "label"} },
        //                { name: "plan_cd", editable: { type: "hidden" } },
        //                { header: true, value: "처리자", format: { type: "label"} },
        //                { name: "act_user_nm" },
        //                { header: true, value: "처리일자", format: { type: "label"} },
        //                { name: "act_dt", mask: "date-ymd", editable: { type: "hidden" } }
	    //                ]
        //            },
        //            { element: [
        //                { header: true, value: "참원인", format: { type: "label"} },
        //                { name: "plan_rmk", style: { colspan: 5 },
        //                    format: { type: "textarea", rows: 8, width: 990 },
        //                    editable: { type: "textarea", rows: 8, width: 990 }
        //                }
        //                ]
        //            },
        //            { element: [
        //                { header: true, value: "재발방지대책수립", format: { type: "label"} },
        //                { name: "act_rmk", style: { colspan: 5 },
        //                    format: { type: "textarea", rows: 8, width: 990 },
        //                    editable: { type: "textarea", rows: 8, width: 990 }
        //                },
		//                { name: "user_id", hidden: true, editable: { type: "hidden"} },
		//                { name: "supp_cd", hidden: true, editable: { type: "hidden"} },
        //                { name: "file_cnt", hidden: true },
        //                { name: "plan_user", hidden: true },
        //                { name: "act_user", hidden: true }
        //                ]
        //            }
        //        ]
        //    }
        //};
        //gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_D1", query: "QDM_6220_D_1", type: "TABLE", title: "처리계획 및 결과",
            caption: true, show: true, selectable: true,
            content: {
                width: { label: 100, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "처리상태", format: { type: "label" } },
                            { name: "astat" },
                            { header: true, value: "계획자", format: { type: "label" } },
                            { name: "plan_user_nm" },
                            { header: true, value: "계획일자", format: { type: "label" } },
                            { name: "plan_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리방안", format: { type: "label" } },
                            { name: "plan_cd" },
                            { header: true, value: "처리자", format: { type: "label" } },
                            { name: "act_user_nm" },
                            { header: true, value: "처리일자", format: { type: "label" } },
                            { name: "act_dt", mask: "date-ymd" },
                            { name: "rqst_no", hidden: true },
	                        { name: "act_seq", hidden: true },
	                        { name: "file_cnt", hidden: true },
	                        { name: "plan_user", hidden: true },
			                { name: "user_id", hidden: true },
			                { name: "supp_cd", hidden: true },
	                        { name: "act_user", hidden: true },
                            { name: "gw_stat", hidden: true },      //대책확인결과
                            { name: "gw_stat_emp", hidden: true },  //확인자
                            { name: "gw_stat_dt", hidden: true },   //확인일자
                            { name: "qa_rmk", hidden: true },       //QA
                            { name: "plan_rmk", hidden: true },     //참원인
                            { name: "act_rmk", hidden: true },      //재발방지대책수립
                            { name: "memo01", hidden: true },
                            { name: "memo02", hidden: true },
                            { name: "memo03", hidden: true },
                            { name: "memo04", hidden: true },
                            { name: "memo05", hidden: true },
                            { name: "memo11", hidden: true },
                            { name: "memo12", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_D1_2", query: "QDM_6220_D_1", type: "TABLE", title: "처리계획 및 결과",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 100, field: 100 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "원인분석", format: { type: "label" }, style: { colspan: 10 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "현상원인", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } },
                            { header: true, value: "앞의 원인은", format: { type: "label" }, style: { colspan: 2 } }
                        ]
                    },
	                {
	                    element: [
	                        {
	                            name: "memo01", style: { colspan: 2 },
	                            format: { type: "textarea", rows: 8, width: 210 }
	                        },
	                        {
	                            name: "memo02", style: { colspan: 2 },
	                            format: { type: "textarea", rows: 8, width: 210 }
	                        },
	                        {
	                            name: "memo03", style: { colspan: 2 },
	                            format: { type: "textarea", rows: 8, width: 210 }
	                        },
	                        {
	                            name: "memo04", style: { colspan: 2 },
	                            format: { type: "textarea", rows: 8, width: 210 }
	                        },
	                        {
	                            name: "memo05", style: { colspan: 2 },
	                            format: { type: "textarea", rows: 8, width: 210 }
	                        }
	                    ]
	                },
                    {
                        element: [
                            { header: true, value: "재발방지 대책", format: { type: "label" }, style: { colspan: 10 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "관리적 대책", format: { type: "label" }, style: { colspan: 5 } },
                            { header: true, value: "기술적 대책", format: { type: "label" }, style: { colspan: 5 } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "memo11", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8, width: 550 }
                            },
                            {
                                name: "memo12", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8, width: 550 }
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
            targetid: "frmData_D1_3", query: "QDM_6220_D_1", type: "TABLE", title: "처리계획 및 결과",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 100, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "대책확인결과", format: { type: "label" } },
                            { name: "gw_stat" },
                            { header: true, value: "확인자", format: { type: "label" } },
                            { name: "gw_stat_emp" },
                            { header: true, value: "확인일자", format: { type: "label" } },
                            { name: "gw_stat_dt" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "QA", format: { type: "label" } },
                            {
                                name: "qa_rmk", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8, width: 990 }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "frmData_D2", query: "QDM_6220_D_2", type: "TABLE", title: "실시결과 확인",
            caption: true, width: "100%", show: true, selectable: true,
            content: { height: 25, width: { label: 100, field: 120 },
                row: [
                    {
                        element: [
                            { header: true, value: "계획일자", format: { type: "label" } },
                            { name: "plan_date", mask: "date-ymd" },
                            { header: true, value: "확인결과", format: { type: "label" } },
                            { name: "gw_stat" },
                            { header: true, value: "확인자", format: { type: "label"} },
                            { name: "gw_stat_emp" },
                            { header: true, value: "확인일자", format: { type: "label"} },
                            { name: "gw_stat_dt" }
	                    ]
                    },
                    {
                        element: [
                            { header: true, value: "적용결과", format: { type: "label"} },
                            {
                                name: "check_rmk", style: { colspan: 7 },
                                format: { type: "textarea", rows: 8, width: 990 }
                            },
                            { name: "rqst_no", hidden: true },
                            { name: "act_seq", hidden: true },
                            { name: "rev_no", hidden: true },
                            { name: "pstat", hidden: true },
                            { name: "astat_user", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_File1", query: "DLG_FILE_ZFILE_V", title: "첨부 문서(분석관련 보고서 및 변경점 / 개선사항 자료 첨부)",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "파일명", name: "file_nm", width: 250, align: "left" },
				{ header: "등록부서", name: "upd_dept", width: 100, align: "center" },
				{ header: "등록자", name: "upd_usr", width: 60, align: "center" },
				{ header: "장비군", name: "file_group1", width: 80, align: "center", hidden: true },
				{ header: "업무구분", name: "file_group2", width: 80, align: "center" },
				{ header: "문서분류", name: "file_group3", width: 80, align: "center" },
				{ header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
				{ header: "Category", name: "file_group5", width: 80, align: "center", hidden: true },
				{ header: "다운로드", name: "download", width: 60, align: "center",
				    format: { type: "link", value: "다운로드" }
				},
				{ header: "파일설명", name: "file_desc", width: 380, align: "left",
				    editable: { type: "text" }
				},
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden"} }
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
                    { type: "FORM", id: "frmData_Main", offset: 8 },
                    { type: "GRID", id: "grdData_Sub", offset: 8 },
                    { type: "FORM", id: "frmData_D1", offset: 8 },
                    { type: "FORM", id: "frmData_D1_2", offset: 8 },
                    { type: "FORM", id: "frmData_D1_3", offset: 8 },
                    { type: "FORM", id: "frmData_D2", offset: 8 },
                    { type: "GRID", id: "grdData_File1", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main (상세, 저장, 통보, 삭제, 닫기) ====
        //----------
        var args = { targetid: "lyrMenu_Main", element: "상세", event: "click", handler: click_lyrMenu_Main_상세 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_상세(ui) { popupDetail(ui); } //ui.object=lyrMenu_Main, ui.row=1, ui.element=상세, ui.type=FORM
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_닫기(ui) { processClose({}); }

        var args = { targetid: "grdData_File1", grid: true, element: "download", event: "click", handler: click_File_DownLoad };
        gw_com_module.eventBind(args);
        function click_File_DownLoad(ui) { 
        	gw_com_module.downloadFile({ source: { id: ui.object, row: ui.row }, targetid: "lyrDown" });
        }

        //==== Grid Events : Main
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: rowselected_grdData_Sub };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Sub(ui) { if (ui.status) processLink(ui); }

        // startup process.
        gw_com_module.startPage();

        v_global.logic.key = "";
        if (v_global.process.param != "") {	// Page Parameter 변수 저장
            v_global.logic.key = gw_com_api.getPageParameter("rqst_no");
            
	        if (v_global.logic.key != "") 
	        	processRetrieve({ key: v_global.logic.key }); //수정 및 조회
        }

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- ItemChanged Event 처리
function processItemChanged(ui) {

    if (!checkEditable({})) return;

    var vl = ui.value.current;

    if (ui.element == "Remark") {   // 복수행 입력란의 개행문자 치환
        vl = vl.replace(/\r\n/g, "CRLF");
        gw_com_api.setValue("grdData_Sub", "selected", ui.element, vl, true);
    }

    //string.substring(start, length)   
    //string.replace("A","B")

}
//---------- Popup Detail Windows
function popupDetail(ui) {
    v_global.event.object = "frmData_Main";
    v_global.event.row = 1;

	var LinkPage = "";
	var LinkID = gw_com_api.v_Stream.msg_infoECR;

	var IssueNo = gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false);
	if (IssueNo == "") return;

	var LinkType = gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_tp", false);
	if ( LinkType == "VOC"){
		LinkPage = "INFO_VOC";
		LinkID = gw_com_api.v_Stream.msg_infoECR;
	}
	else if ( LinkType == "SPC"){
		LinkPage = "INFO_SPC";
		LinkID = gw_com_api.v_Stream.msg_infoECR;
	}
	else {
		LinkPage = "DLG_ISSUE";
		LinkID = gw_com_api.v_Stream.msg_infoAS;
	}

    var args = {
        type: "PAGE", page: LinkPage, title: "문제발생 상세 정보",
        width: 1100, height: 600, scroll: true, open: true, control: true, locate: ["center", "top"]
    };
    
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = { page: LinkPage,
            param: { ID: LinkID, data: { issue_no: IssueNo, voc_no: IssueNo } }
        }
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function checkCRUD(param) {

    if (param.sub) {
        var obj = "grdData_Sub";
        if (checkEditable({}))
            return gw_com_api.getCRUD(obj, "selected", true);
        else
            return ((gw_com_api.getSelectedRow(obj) == null) ? false : true);
    }
    else return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: (param.sub) ? "선택된 내역이 없습니다." : "NOMASTER" }
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
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
			{ type: "GRID", id: "grdData_File1" }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processRetrieve(param) {

    var args = {
        source: { type: "INLINE",
            argument: [
                { name: "arg_rqst_no", value: param.key },
                { name: "arg_data_key", value: param.key },	// 첨부파일용
                { name: "arg_data_seq", value: -1 }	// 첨부파일용
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_Main" },
			{ type: "GRID", id: "grdData_Sub", select: true },	//checkEditable({}) ? false : 
			{ type: "GRID", id: "grdData_File1" }
		],
        clear: [
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D1_2" },
            { type: "FORM", id: "frmData_D1_3" },
            { type: "FORM", id: "frmData_D2" },
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {
    var args = {};

    if (param.object == "grdData_Sub") {
        args = { 
            key: param.key,
            source: { type: "GRID", id: "grdData_Sub", row: "selected", block: true,
                element: [
				    { name: "rqst_no", argument: "arg_rqst_no" },
				    { name: "act_seq", argument: "arg_act_seq" }
			    ]
            },
            target: [
                { type: "FORM", id: "frmData_D1" },
                { type: "FORM", id: "frmData_D1_2" },
                { type: "FORM", id: "frmData_D1_3" },
                { type: "FORM", id: "frmData_D2" }
		    ]
        };
    }
    else if (param.object == "grdData_File1") {
        args = { 
            key: param.key,
            source: { type: "FORM", id: "frmData_Main",
                element: [ { name: "rqst_no", argument: "arg_data_key" } ],
	            argument: [ { name: "arg_data_seq", value: -1 } ]
            },
            target: [ { type: "GRID", id: "grdData_File1", select: true } ]
        };
    }
    else return;

    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(ui) {

    if (ui.object == "lyrMenu_Sub") {	// 대상부서 추가
    	//if (!checkManipulate({ sub: true })) return false;

        var args = { targetid: "grdData_Sub", edit: true, updatable: true,
            data: [
                { name: "rqst_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no", false) }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {	// 요구서 추가
        var args = { targetid: "frmData_Main", edit: true, updatable: true,
            data: [
                { name: "rqst_dt", value: gw_com_api.getDate("") },
                { name: "pstat", value: "진행(품질)" },
                { name: "astat", value: "작성중" },
                { name: "astat_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rqst_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rqst_user_nm", value: gw_com_module.v_Session.USR_NM },
                { name: "issue_no", value: v_global.logic.issue_no },
                { name: "issue_tp", value: v_global.logic.issue_tp },
                { name: "issue_dept", value: v_global.logic.issue_dept },
                { name: "issue_dt", value: v_global.logic.issue_dt },
                { name: "prod_nm", value: v_global.logic.prod_nm }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" },
                { type: "FORM", id: "frmData_D1" },
                { type: "FORM", id: "frmData_D1_2" },
                { type: "FORM", id: "frmData_D1_3" },
                { type: "FORM", id: "frmData_D2" },
                { type: "GRID", id: "grdData_File1" }
            ]
        };
        gw_com_module.formInsert(args);
        
        // 대상부서 추가
        processInsert({ object: "lyrMenu_Sub" });

        // 처리결과, 확인 Form 초기화
//        args = { targetid: "frmData_D1", edit: false };
//        gw_com_module.formInsert(args);
//        gw_com_api.setCRUD("frmData_D1", 1, "modify");	// Change Row's Status to Modify

//        args = { targetid: "frmData_D2", edit: false };
//        gw_com_module.formInsert(args);
//        gw_com_api.setCRUD("frmData_D2", 1, "modify");	// Change Row's Status to Modify
        
    }

}
//----------
function processDelete(ui) {

    if (ui.object == "lyrMenu_Sub") {
        var args = { targetid: "grdData_Sub", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if (ui.object == "lyrMenu_File1") {
        var args = { targetid: "grdData_File1", row: "selected" }
        gw_com_module.gridDelete(args);
    }
    else if(ui.object == "lyrMenu_Main") {
		if (!checkManipulate({})) return;
	            
	    var status = checkCRUD({});
	    if (status == "initialize" || status == "create") processClear({});
	    else {
		    v_global.process.handler = processRemove;
	        gw_com_api.messageBox([ { text: "REMOVE" } ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
		}
    }
    else return;

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "FORM", id: "frmData_D1" },
            { type: "FORM", id: "frmData_D1_2" },
            { type: "FORM", id: "frmData_D1_3" },
            { type: "FORM", id: "frmData_D2" },
            { type: "GRID", id: "grdData_File1" }
        ]
    };
    gw_com_module.objClear(args);

}
//---------- Save
function processSave(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_Main" },
            { type: "GRID", id: "grdData_Sub" },
			{ type: "GRID", id: "grdData_File1" }
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//---------- After Saving
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () { 
        	if (this.NAME == "rqst_no") { 
        		v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key }); 
            }
        });
    });

}
//---------- Remove
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main", key: { element: [ { name: "rqst_no" } ] } }
        ],
        handler: { success: successRemove, param: param }
    };
    gw_com_module.objRemove(args);

}
//---------- After Removing
function successRemove(response, param) {

    processClear(param);

}
//---------- NCR 발행 통보 : Mail 전송 시작
function processSend(param) {
	
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    gw_com_api.messageBox([
        { text: "시정조치 요구서에 대한 이메일을 발송합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", { type: "NCR-RQST" });

}
//---------- Batch : NCR 발행 통보 처리 Procedure 실행 (PROC_MAIL_QDM_NCR)
function processBatch(param) {
    var args = {
        url: (param.type == "NCR-RQST") ? "COM" : gw_com_module.v_Current.window + ".aspx/" + "Mail",
        procedure: "PROC_MAIL_QDM_NCR", nomessage: true,
        argument: [
            { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no") }
        ],
        input: [
            { name: "type", value: param.type, type: "varchar" },
            { name: "key_no", value: gw_com_api.getValue("frmData_Main", 1, "rqst_no"), type: "varchar" },
            { name: "key_seq", value: "0", type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
        handler: { success: successBatch }
    };
    gw_com_module.callProcedure(args);
}
//---------- Batch : Afert Processing
function successBatch(response) {
    gw_com_api.messageBox([ { text: response.VALUE[1] } ], 350);
}
//----------
function processApprove(param) {

    var status = gw_com_api.getValue("frmData_Main", 1, "gw_astat_nm", false, true);
    if (status != '없슴' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }

    var args = { page: "IFProcess",
        param: { ID: gw_com_api.v_Stream.msg_authSystem,
            data: { system: "GROUPWARE",
                name: gw_com_module.v_Session.GW_ID,
                encrypt: { password: true },
                param: param }
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function successApproval(response, param) {

    processRetrieve({ key: v_global.logic.key });

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
        { name: "sysid", value: "ECCB" },
        { name: "sys_key", value: data.r_key },
        { name: "seq", value: data.r_seq }
    ];
    gw_com_site.gw_appr(params);

}
//----------
function processClose(param) {

    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
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
//---------- 파일 추가/수정/Rev
function processUpload(param) {

    // Check
    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;

    // Parameter 설정
    v_global.logic.FileUp = {
    	type: "NCR-RQST",
        key: gw_com_api.getValue("frmData_Main", 1, "rqst_no"),
        seq: 0,
        user: gw_com_module.v_Session.USR_ID,
        crud: "C",  rev: 0, revise: false
    };

    // Prepare File Upload Window
    var args = { type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "NCR-RQST", 
    	width: 650, height: 260, open: true, locate: ["center", "top"] }; //

    if (gw_com_module.dialoguePrepare(args) == false) {
    	// 아래 로직은 두 번째 Open 부터 작동함. 첫 번째는 streamProcess 에 의함
        var args = { page: "DLG_FileUpload",
            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
        };
        gw_com_module.dialogueOpen(args);
    }
    
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: { 
            gw_com_module.streamInterface(param); 
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
        	// PageId가 다를 때 Skip 
        	if (param.data.page != gw_com_api.getPageID()) { 
        		param.to = { type: "POPUP", page: param.data.page };
                gw_com_module.streamInterface(param);
                break;
            }
            // 확인 메시지별 처리    
            switch (param.data.ID) { 
            	case gw_com_api.v_Message.msg_confirmSave: { 
                	if (param.data.result == "YES") processSave(param.data.arg);
                    else { 
                    	processClear({});
                        if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
                    }
                } break;
                case gw_com_api.v_Message.msg_confirmRemove: { 
                    if (param.data.result == "YES") processRemove(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_confirmBatch: { 
                    if (param.data.result == "YES") processBatch(param.data.arg);
                } break;
                case gw_com_api.v_Message.msg_informSaved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informRemoved: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
                case gw_com_api.v_Message.msg_informBatched: { 
                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                } break;
            }
        } break;
        case gw_com_api.v_Stream.msg_selectedSupplier: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_cd", param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "supp_nm", param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedTeam: {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
        	if ( v_global.event.element == "rqst_user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_user", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "rqst_user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
        	else if ( v_global.event.element == "user_nm" ) {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
        	}
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER: {
            closeDialogue({ page: param.from.page });
        	processLink( { object: "grdData_File1" } ) ;
        } break;
        case gw_com_api.v_Stream.msg_authedSystem: { 
            	closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("frmData_Main", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_Main", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = { url: "COM",
                    procedure: "PROC_APPROVAL_ECCB",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar"}/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "eccb_no", value: gw_com_api.getValue("frmData_Main", 1, "eccb_no"), type: "varchar" },
                        { name: "gw_key", value: gw_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: { success: successApproval
                    }
                };
                gw_com_module.callProcedure(args); 
                }
            break;
           
        // When Opened Dialogue Winddows
        case gw_com_api.v_Stream.msg_openedDialogue: { 
        	var args = { to: { type: "POPUP", page: param.from.page } };

            switch (param.from.page) { 
                case "w_find_supplier": { 
                    args.ID = gw_com_api.v_Stream.msg_selectSupplier; 
                } break;
                case "DLG_TEAM": { 
                    args.ID = gw_com_api.v_Stream.msg_selectTeam; 
                } break;
                case "DLG_EMPLOYEE": { 
                    args.ID = gw_com_api.v_Stream.msg_selectEmployee; 
                } break;
                case "DLG_FileUpload": { 
                	args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                	args.data = v_global.logic.FileUp;
             	} break;
                case "INFO_VOC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = { 
                    	voc_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    };
                } break;
                case "INFO_SPC": {
                    args.ID = gw_com_api.v_Stream.msg_infoECR;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    };
                } break;
                case "DLG_ISSUE": {
                    args.ID = gw_com_api.v_Stream.msg_infoAS;
                    args.data = { 
                    	issue_no: gw_com_api.getValue(v_global.event.object, v_global.event.row, "issue_no", false)
                    };
                } break;
            }
            gw_com_module.streamInterface(args); 
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
        	closeDialogue({ page: param.from.page }); 
        } break;
    }

}