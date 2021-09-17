//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : System Notice List
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Declare Page Variables
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

        // Set Page Options
        v_global.logic.PageId = gw_com_api.getPageID();
        if (parent.location != undefined && gw_com_api.getParameter(parent.location.search, "LAUNCH") == "CHILD")
            v_global.logic.PageType = "TAB";
        else
            v_global.logic.PageType = "WIN";

        // Get Page Parameters
        v_global.logic.id = gw_com_api.getPageParameter("id");
        v_global.logic.key = gw_com_api.getPageParameter("key");
        if (v_global.logic.key == "") v_global.logic.key = 0;
        if (gw_com_module.v_Session.USER_TP == "EMP" || gw_com_module.v_Session.USER_TP == "SYS")
            v_global.logic.supp = "0";  //0:관리, 1:업체
        else
            v_global.logic.supp = "1";

        v_global.logic.agree = gw_com_api.getPageParameter("agree");
        if (v_global.logic.agree == "") v_global.logic.agree = "1";

        if (parent.v_global != undefined && parent.v_global.logic != undefined && parent.v_global.logic.view != undefined)
            v_global.logic.view = parent.v_global.logic.view;  //gw_com_api.getPageParameter("view");
        else
            v_global.logic.view = "";

        // prepare dialogue.
        var args = { type: "PAGE", page: "DLG_UploadFile", title: "Upload Fils", datatype: "SRM_PoPlan", width: 660, height: 220 };
        gw_com_module.dialoguePrepare(args);

        // set data for DDDW List & call start()
        var args = {
            request: [
                {
                    type: "INLINE", name: "dddwCompType",
                    data: [
			            { title: "법인", value: "법인" },
			            { title: "개인", value: "개인" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwPropType",
                    data: [
			            { title: "반도체", value: "반도체" },
			            { title: "디스플레이", value: "디스플레이" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwCareerYear",
                    data: [
			            { title: "10년 이상", value: "10년 이상" },
			            { title: "5년 이상", value: "5년 이상" },
			            { title: "5년 미만", value: "5년 미만" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwOwnType",
                    data: [
			            { title: "자가", value: "자가" },
			            { title: "임차", value: "임차" },
			            { title: "해당 없음", value: "해당 없음" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwItemType",
                    data: [
			            { title: "상용품", value: "상용품" },
			            { title: "가공품", value: "가공품" },
			            { title: "기타", value: "기타" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwItemSrc",
                    data: [
			            { title: "국산", value: "국산" },
			            { title: "미국", value: "미국" },
			            { title: "일본", value: "일본" },
			            { title: "중국", value: "중국" },
			            { title: "유럽", value: "유럽" },
			            { title: "기타", value: "기타" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwTradeType",
                    data: [
			            { title: "제조사", value: "제조사" },
			            { title: "대리점", value: "대리점" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwQcYn1Type",
                    data: [
			            { title: "보유", value: "보유" },
			            { title: "미보유", value: "미보유" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwInfoAgree",
                    data: [
			            { title: "동의", value: "1" },
			            { title: "미동의", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwAcptYn",
                    data: [
			            { title: "적격", value: "1" },
			            { title: "부적격", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwQcYn2Type",
                    data: [
			            { title: "품질 전담", value: "품질 전담" },
			            { title: "타업무 겸직", value: "타업무 겸직" },
			            { title: "품질 부재", value: "품질 부재" }
                    ]
                },
                {
				    type: "PAGE", name: "dddwNoticeTp", query: "dddw_zcode",
				    param: [{ argument: "arg_hcode", value: "SYS211" }]
				}
            ], starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process
        function start() {

            gw_job_process.UI();    // Create UI Controls
            gw_job_process.procedure(); // Declare Events
            gw_com_module.startPage();  // resizeFrame & Set focus

            // 입력 Mode별 처리
            if (v_global.logic.key != "0") {
                processRetrieve({});
            }
            else {
                // 신규 추가
                var args = { targetid: "frmData_SubA", edit: true, updatable: true, data: [{ name: "prop_id", value: v_global.logic.key }] };
                gw_com_module.formInsert(args);
                var args = { targetid: "frmData_SubB", edit: true, updatable: true, data: [{ name: "prop_id", value: v_global.logic.key }] };
                gw_com_module.formInsert(args);
                var args = { targetid: "frmData_SubC", edit: true, updatable: true, data: [{ name: "prop_id", value: v_global.logic.key }] };
                gw_com_module.formInsert(args);
                //var args = { targetid: "frmData_SubD", edit: true, updatable: true, data: [{ name: "prop_id", value: v_global.logic.key }] };
                //gw_com_module.formInsert(args);
                var args = { targetid: "frmData_SubE", edit: true, updatable: true, data: [{ name: "prop_id", value: v_global.logic.key }] };
                gw_com_module.formInsert(args);
                var args = { targetid: "frmData_SubF", edit: true, updatable: true, data: [{ name: "prop_id", value: v_global.logic.key }] };
                gw_com_module.formInsert(args);
                var args = {
                    targetid: "frmData_MainA", edit: true, updatable: true,
                    data: [
                        { name: "prop_id", value: v_global.logic.key }, { name: "emp_email", value: v_global.logic.id }
                        , { name: "info_agree", value: v_global.logic.agree }, { name: "comp_tp", value: "법인" }
                    ]
                };
                gw_com_module.formInsert(args);

                // set notice
                var args = { targetid: "lyrRemark_Top", row: [{ name: "notice", value: "▶ 신규 작성" }] };
                gw_com_module.labelAssign(args);
            }

        }

    },

    // manage UI. (design section)
    UI: function () {

        // Create Label : Top 
        var args = {
            targetid: "lyrRemark_Top", row: [{ name: "notice" }]
        };
        gw_com_module.labelCreate(args);

        // Create Buttons : Top 
        var args = {
            targetid: "lyrMenu_Top", type: "FREE",
            element: [
                { name: "Save", value: "저장" }
            ]
        };
        if (v_global.logic.supp == "1") {
            args.element.push({ name: "Send", value: "제출", icon: "실행" });
        }
        else {
            args.element[0].show = false;
            if (v_global.logic.view != "1") {
                args.element.push({ name: "Receive", value: "접수", icon: "기타" });
                args.element.push({ name: "Accept", value: "심사", icon: "실행" });
                args.element.push({ name: "Reject", value: "관리자 심사", icon: "실행" });
            }
        }

        // Tabpage인 경우에는 닫기버튼 숨김
        if (v_global.logic.PageType != "TAB")
            args.element.push({ name: "Close", value: "닫기" });

        if (v_global.logic.view != "1")
            gw_com_module.buttonMenu(args);

        // Create Buttons : File
        var args = {
            targetid: "lyrMenu_FileA", type: "FREE",
            element: [
                { name: "AddNew", value: "추가" },
                { name: "Delete", value: "삭제" }
            ]
        };
        if (v_global.logic.view != "1")
            gw_com_module.buttonMenu(args);

        // Data Box : Main
        var args = {
            targetid: "frmData_MainA", query: "SRM_OpenSrc_Comp", type: "TABLE", title: "업체 정보",
            show: true, selectable: true, caption: true,
            content: {
                width: { label: 120, field: 220 }, height: 27,
                row: [
                    {
                        element: [
                            { header: true, value: "기업명", format: { type: "label" } },
                            { name: "comp_nm", editable: { type: "text", validate: { rule: "required", maxlength: 50, message: "기업명" } } },
                            { header: true, value: "사업자등록번호", format: { type: "label" } },
                            { name: "comp_no", mask: "biz-no", editable: { type: "text", maxlength: 15, validate: { rule: "required" } } },
                            { header: true, value: "기업형태", format: { type: "label" } },
                            { name: "comp_tp", editable: { type: "select", data: { memory: "dddwCompType" }, validate: { rule: "required", message: "기업형태" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대표자명", format: { type: "label" } },
                            { name: "comp_man", editable: { type: "text", validate: { rule: "required", maxlength: 10, message: "기업명" } } },
                            { header: true, value: "E-Mail", format: { type: "label" } },
                            { name: "emp_email", editable: { type: "text", maxlength: 30, validate: { rule: "required" } } },
                            { header: true, value: "설립일", format: { type: "label" } },
                            { name: "comp_fax", mask: "date-ymd", editable: { type: "text" } },
                            { name: "info_agree", hidden: true, editable: { type: "select", data: { memory: "dddwInfoAgree" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "담당자명", format: { type: "label" } },
                            { name: "emp_nm", editable: { type: "text", maxlength: 10, validate: { rule: "required" } } },
                            { header: true, value: "직위", format: { type: "label" } },
                            { name: "emp_pos", editable: { type: "text", maxlength: 15, validate: { rule: "required" } } },
                            { header: true, value: "직책", format: { type: "label" } },
                            { name: "emp_duty", editable: { type: "text", maxlength: 15, validate: { rule: "required" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "담당자 TEL", format: { type: "label" } },
                            { name: "emp_tel", editable: { type: "text", maxlength: 20, validate: { rule: "required" } } }, //, mask: "only-no"
                            { header: true, value: "건물면적", format: { type: "label" } },
                            { name: "building_area", mask: "numeric-int", unit: "평", format: { type: "text" }, editable: { type: "text", mask: "numeric-int" } },
                            { header: true, value: "자가/임차", format: { type: "label" } },
                            { name: "building_own", editable: { type: "select", data: { memory: "dddwOwnType" } } }
                        ]
                    },
                    //{
                    //    element: [
                    //        { header: true, value: "Fax No", format: { type: "label" } },
                    //        { name: "comp_fax", editable: { type: "text", validate: { maxlength: 20 } } },
                    //        { header: true, value: "대지면적(평)", format: { type: "label" } },
                    //        { name: "ground_area", mask: "numeric-int", format: { type: "text" }, editable: { type: "text", mask: "numeric-int" } },
                    //        { header: true, value: "자가/임차", format: { type: "label" } },
                    //        { name: "ground_own", editable: { type: "select", data: { memory: "dddwOwnType" } } }
                    //    ]
                    //},
                    {
                        element: [
                            { header: true, value: "본사 전화번호", format: { type: "label" } },
                            { name: "comp_tel", editable: { type: "text", maxlength: 20, validate: { rule: "required" } } },
                            { header: true, value: "본사 주소", format: { type: "label" } },
                            {
                                name: "comp_addr", style: { colspan: 3 }, //format: { width: 660 },
                                editable: { type: "text", maxlength: 80, width: 600, validate: { rule: "required" } }
                            },
                            { name: "login_pw", hidden: true, editable: { type: "hidden" } },
                            { name: "prop_id", hidden: true, editable: { type: "hidden" } },
                            { name: "pstat", hidden: true }
                        ]
                    }
                    //,
                    //{
                    //    element: [
                    //        { header: true, value: "공장 전화번호", format: { type: "label" } },
                    //        { name: "plant_tel", editable: { type: "text", maxlength: 20 } },
                    //        { header: true, value: "공장 주소", format: { type: "label" } },
                    //        {
                    //            name: "plant_addr", style: { colspan: 3 }, //format: { width: 660 },
                    //            editable: { type: "text", maxlength: 80, width: 600 }
                    //        }
                    //    ]
                    //}
                ]
            }
        };
        if (v_global.logic.supp == 1) {
            args.editable = { bind: "select", focus: "comp_nm", validate: true };
        }
        gw_com_module.formCreate(args);

        // Data Box : SubA 
        var args = {
            targetid: "frmData_SubA", query: "SRM_OpenSrc_Prop", type: "TABLE", title: "제안 내용",
            show: true, selectable: true, caption: true,
            content: {
                width: { label: 120, field: 220 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "제안 유형", format: { type: "label" } },
                            { name: "prop_tp", editable: { type: "select", data: { memory: "dddwPropType" }, validate: { rule: "required" } } },
                            { header: true, value: "제안 품목", format: { type: "label" } },
                            { name: "prop_item", editable: { type: "select", data: { memory: "dddwItemType" }, validate: { rule: "required" } } },
                            { header: true, value: "제안 부품", format: { type: "label" } },
                            { name: "prop_part", editable: { type: "text", maxlength: 20, validate: { rule: "required" } } },
                            { name: "prop_id", hidden: true, editable: { type: "hidden" } },
                            { name: "pstat", hidden: true },
                            { name: "pdate", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "거래 유형", format: { type: "label" } },
                            { name: "trade_tp", editable: { type: "select", data: { memory: "dddwTradeType" }, validate: { rule: "required" } } },
                            { header: true, value: "원산지", format: { type: "label" } },
                            { name: "item_src", editable: { type: "select", data: { memory: "dddwItemSrc" }, validate: { rule: "required" } } },
                            { header: true, value: "해당분야 업력", format: { type: "label" } },
                            { name: "career_year", editable: { type: "select", data: { memory: "dddwCareerYear" }, validate: { rule: "required" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제안 제목", format: { type: "label" } },
                            {
                                name: "prop_title", style: { colspan: 5 }, //format: { width: 660 },
                                editable: { type: "text", width: 900, maxlength: 120, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제안 내용", format: { type: "label" } },
                            {
                                name: "prop_rmk", style: { colspan: 5 }, format: { type: "textarea", rows: 15 },
                                editable: { type: "textarea", rows: 15, maxlength: 1000, validate: { rule: "required" } }
                            }
                        ]
                    }
                ]
            }
        };
        if (v_global.logic.supp == "1") {
            args.editable = { bind: "select", focus: "prop_tp", validate: true };
        }
        gw_com_module.formCreate(args);

        // Data Box : SubD 
        var args = {
            targetid: "frmData_SubD", query: "SRM_OpenSrc_Prop", type: "TABLE", title: "제안 심사 결과",
            show: true, selectable: true, caption: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { label: 100, field: 120 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "구매점수", format: { type: "label" } },
                            { name: "point1", mask: "numeric-int", editable: { type: "text" } },
                            { header: true, value: "설계점수", format: { type: "label" } },
                            { name: "point2", mask: "numeric-int", editable: { type: "text" } },
                            { header: true, value: "총점", format: { type: "label" } },
                            { name: "acpt_point", mask: "numeric-int", editable: { type: "text", readonly: true } },
                            { header: true, value: "심사결과", format: { type: "label" } },
                            { name: "acpt_yn_nm", editable: { type: "text", readonly: true } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "구매심사자", format: { type: "label" } },
                            { name: "point1_man", editable: { type: "text" } },
                            { header: true, value: "설계심사자", format: { type: "label" } },
                            { name: "point2_man", editable: { type: "text" } },
                            { header: true, value: "심사의견", format: { type: "label" } },
                            { name: "point_rmk", editable: { type: "text", width: 400, maxlength: 100 }, style: { colspan: 3 } },
                            //{ header: true, value: "품질점수", format: { type: "label" } },
                            { name: "point3", mask: "numeric-int", editable: { type: "text" }, hidden: true },
                            { name: "prop_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        if (v_global.logic.supp == "1" || v_global.logic.view == "1")
            args.show = false;
        gw_com_module.formCreate(args);

        // Data Box : SubB 
        var args = {
            targetid: "frmData_SubB", query: "SRM_OpenSrc_Info", type: "TABLE", title: "기업 현황",
            show: true, selectable: true, caption: true,
            content: {
                width: { label: 120, field: 220 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "임직원수", format: { type: "label" } },
                            { name: "emp_cnt", mask: "numeric-int", unit: "명", format: { type: "text", width: 180, tailer: " 명" }, editable: { type: "text", mask: "numeric-int", width: 180, validate: { rule: "required" } } },
                            { header: true, value: "연구개발인력", format: { type: "label" } },
                            { name: "emp1_cnt", mask: "numeric-int", unit: "명", format: { type: "text", width: 180 }, editable: { type: "text", mask: "numeric-int", width: 180, validate: { rule: "required" } } },
                            { header: true, value: "품질조직", format: { type: "label" } },
                            { name: "qc_yn1", editable: { type: "select", data: { memory: "dddwQcYn1Type" }, validate: { rule: "required" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "신용 등급", format: { type: "label" } },
                            { name: "credit_rating", format: { type: "text" }, editable: { type: "text" } },
                            { header: true, value: "자기자본 비율", format: { type: "label" } },
                            { name: "worth_rate", mask: "numeric-int", unit: "%", format: { type: "text", width: 180 }, editable: { type: "text", width: 180, mask: "numeric-int" } },
                            { header: true, value: "품질관리인력", format: { type: "label" } },
                            { name: "emp2_cnt", mask: "numeric-int", unit: "명", format: { type: "text", width: 180 }, editable: { type: "text", mask: "numeric-int", width: 180, validate: { rule: "required" } } }
                            //{ header: true, value: "영업이익(백만원)", format: { type: "label" } },
                            //{ name: "profit_amt", mask: "numeric-int", format: { type: "text" }, editable: { type: "text", mask: "numeric-int" } },
                            //{ header: true, value: "", format: { type: "label" } },
                            //{ name: "profit_amt", hidden: true, editable: { type: "text", mask: "numeric-int" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "직전 년도 매출액", format: { type: "label" } },
                            { name: "sale1_amt", mask: "numeric-int", unit: "백만원", format: { type: "text", width: 180 }, editable: { type: "text", width: 180, mask: "numeric-int" } },
                            { header: true, value: "2년전 매출액", format: { type: "label" } },
                            { name: "sale2_amt", mask: "numeric-int", unit: "백만원", format: { type: "text", width: 180 }, editable: { type: "text", width: 180, mask: "numeric-int" } },
                            { header: true, value: "3년전 매출액", format: { type: "label" } },
                            { name: "sale3_amt", mask: "numeric-int", unit: "백만원", format: { type: "text", width: 180 }, editable: { type: "text", width: 180, mask: "numeric-int" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "주요거래처(1)", format: { type: "label" } },
                            { name: "main_cust1", editable: { type: "text", maxlength: 20 } },
                            { header: true, value: "주요거래처(2)", format: { type: "label" } },
                            { name: "main_cust2", editable: { type: "text", maxlength: 20 } },
                            { header: true, value: "주요거래처(3)", format: { type: "label" } },
                            { name: "main_cust3", editable: { type: "text", maxlength: 20 } },
                            { name: "prop_id", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_yn2", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_man1", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_year1", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_man2", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_year2", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_sw", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_text1", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_text2", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_text3", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_text4", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_doc1_yn", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_doc2_yn", hidden: true, editable: { type: "hidden" } },
                            { name: "qc_doc3_yn", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        if (v_global.logic.supp == 1) {
            args.editable = { bind: "select", validate: true };
        }
        gw_com_module.formCreate(args);

        // Data Box : SubF 
        var args = {
            targetid: "frmData_SubF", query: "SRM_OpenSrc_Info", type: "TABLE", title: "성능 평가 자료 보유 현황",
            show: true, selectable: true, caption: true,
            content: {
                width: { label: 260, field: 700 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: " Competitive analysis(경쟁사 제품 비교)", format: { type: "label" } },
                            { name: "qc_doc1_yn", editable: { type: "select", width: 120, data: { memory: "dddwQcYn1Type" }, validate: { rule: "required" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: " Non functional testing report(비기능 평가 자료)", format: { type: "label" } },
                            { name: "qc_doc2_yn", editable: { type: "select", width: 120, data: { memory: "dddwQcYn1Type" }, validate: { rule: "required" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: " Functional testing report(기능 평가 자료)", format: { type: "label" } },
                            { name: "qc_doc3_yn", editable: { type: "select", width: 120, data: { memory: "dddwQcYn1Type" }, validate: { rule: "required" } } },
                            { name: "prop_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        if (gw_com_module.v_Session.CUR_LANG == "en")
            args.title = "Current status of performance evaluation data" 
                + "<span style='color: #595959; margin-left: 16px;'>(evaluation data may be requested separately when reviewing formal transactions in the future.)</span>";
        else
            args.title += "<span style='color: #595959; margin-left: 16px;'>(향후 정식 거래 검토 시 평가 자료는 별도 요청할 수 있습니다.)</span>";
        if (v_global.logic.supp == 1) {
            args.editable = { bind: "select", validate: true };
        }
        gw_com_module.formCreate(args);

        // Data Box : SubC 
        var args = {
            targetid: "frmData_SubC", query: "SRM_OpenSrc_Info", type: "TABLE", title: "인증보유 현황",
            show: true, selectable: true, caption: true,
            content: {
                width: { label: 120, field: 900 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "품질인증 현황", format: { type: "label" } },
                            { name: "qc_text1", editable: { type: "text", width: 900, maxlength: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "환경인증 현황", format: { type: "label" } },
                            { name: "qc_text2", editable: { type: "text", width: 900, maxlength: 200 } }    //, style: { colspan: 5 }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "시스템보유 현황", format: { type: "label" } },
                            { name: "qc_sw", editable: { type: "text", width: 900, maxlength: 200 } },
                            { name: "prop_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                    //{
                    //    element: [
                    //        { header: true, value: "품질전담(명)", format: { type: "label" } },
                    //        { name: "qc_man1", mask: "numeric-int", editable: { type: "text", validate: { rule: "required" } } },
                    //        { header: true, value: "품질전담 평균경력(년)", format: { type: "label" } },
                    //        { name: "qc_year1", mask: "numeric-int", editable: { type: "text", validate: { rule: "required" } } }
                    //        { header: true, value: "타업무 겸직(명)", format: { type: "label" } },
                    //        { name: "qc_man2", mask: "numeric-int", editable: { type: "text", validate: { rule: "required" } } },
                    //        { header: true, value: "타업무 겸직 평균경력(년)", format: { type: "label" } },
                    //        { name: "qc_year2", mask: "numeric-int", editable: { type: "text", validate: { rule: "required" } } }
                    //    ]
                    //},
                ]
            }
        };
        if (v_global.logic.supp == 1) {
            args.editable = { bind: "select", validate: true };
            args.content.row[0].element[1].editable.placeholder = "ex) ISO 9001, ISO14001 etc..";
            args.content.row[1].element[1].editable.placeholder = "ex) OHSAS 18001, K-OHSAS18001 etc..";
            args.content.row[2].element[1].editable.placeholder = "ex) ERP, MES, PDM, G/W etc..";
        }
        gw_com_module.formCreate(args);

        // Data Box : SubB 
        var args = {
            targetid: "frmData_SubE", query: "SRM_OpenSrc_Info", type: "TABLE", title: "특허/실용실안 보유 현황",
            show: true, selectable: true, caption: true,
            content: {
                width: { label: 120, field: 900 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "특허 보유현황", format: { type: "label" } },
                            { name: "qc_text3", style: { colspan: 5 }, editable: { type: "text", width: 900, maxlength: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "실용실안 현황", format: { type: "label" } },
                            { name: "qc_text4", style: { colspan: 5 }, editable: { type: "text", width: 900, maxlength: 200 } },
                            { name: "prop_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        if (v_global.logic.supp == 1) {
            args.editable = { bind: "select", validate: true };
            args.content.row[0].element[1].editable.placeholder = "발명의 명칭";
            args.content.row[1].element[1].editable.placeholder = "고안의 명칭";
        }
        gw_com_module.formCreate(args);

        // Data Box : Attach File
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일",
            caption: true, height: 45, pager: false, number: true, show: true, selectable: true,
            editable: { multi: true, bind: "select", validate: true },
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
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "ver_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        if (v_global.logic.view == "1")
            args.show = false;
        else if (gw_com_module.v_Session.CUR_LANG == "en")
            args.title = "Attached files"
                + "<span style='color: #595959; margin-left: 16px;'>(Only ppt, pdf, and excel files can be attached. Company introduction must be attached)</span>";
        else
            args.title += "<span style='color: #595959; margin-left: 16px;'>(ppt, pdf, excel 파일만 첨부 가능합니다. 기업소개서 첨부 필수)</span>";
        gw_com_module.gridCreate(args);

        // Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        // Resize Data Box
        var args = {
            target: [
                { type: "FORM", id: "frmData_MainA", offset: 8 },
                { type: "FORM", id: "frmData_SubA", offset: 8 },
                { type: "FORM", id: "frmData_SubD", offset: 8 },
                { type: "FORM", id: "frmData_SubB", offset: 8 },
                { type: "FORM", id: "frmData_SubF", offset: 8 },
                { type: "FORM", id: "frmData_SubC", offset: 8 },
                { type: "FORM", id: "frmData_SubE", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        // Event : Top Menu Buttons
        var args = { targetid: "lyrMenu_Top", element: "Save", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Send", event: "click", handler: processBatch };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Receive", event: "click", handler: processBatch };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Accept", event: "click", handler: processBatch };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Reject", event: "click", handler: processBatch };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Close", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        // Event : File Button,  Box
        var args = { targetid: "lyrMenu_FileA", element: "AddNew", event: "click", handler: processFileUpload };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_FileA", element: "Delete", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_FileA", grid: true, element: "_download", event: "click", handler: processFileDownload };
        gw_com_module.eventBind(args);
        // Event : Data Field
        var args = { targetid: "frmData_MainA", event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);

    }

};
function processItemChanged(param) {

    if (param.object == "frmData_MainA") {
        //전화번호 형식 확인
        if (param.element.indexOf("_tel") > 0 || param.element.indexOf("_fax") > 0) {
            if (!gw_com_api.isTelNo(param.value.current)) {
                gw_com_api.messageBox([{ text: "전화번호는 숫자와 하이픈(-)만 입력 가능합니다." }], 500);
                gw_com_api.setFocus(param.object, 1, param.element);
            }
        }
        //사업자번호 확인 : 기존 협력업체 등록 불가
        else if (param.element == "comp_no") {
            var inputVal = param.value.current;
            if (inputVal.length < 10) return;
            inputVal = gw_com_api.getValue("frmData_MainA", 1, "comp_no");
            if (inputVal.length < 10) return;

            var jobCd = "CheckCompNo";
            var args = {
                url: "COM", nomessage: true, procedure: "sp_SRM_OpenSrc",
                input: [
                    { name: "JobCd", value: jobCd, type: "varchar" },
                    { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                    { name: "RootId", value: 0, type: "int" },
                    { name: "RootNo", value: inputVal, type: "varchar" },
                    { name: "Option", value: "", type: "varchar" }
                ],
                output: [{ name: "Rmsg", type: "varchar" }],
                handler: { success: processBatchSuccess, param: { "act": jobCd } }
            };
            gw_com_module.callProcedure(args);
        }
    }
    return;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// common function. (for File Retrieve, Upload, Download)
// ref : grdData_FileA, row click event, processRetrieveComplete, msg_openedDialogue, msg_closeDialogue
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "SrmOpenSrc" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? "%" : param.data_key) },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? 0 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? 0 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processFileUpload(param) {
    //-> prepare DLG -> start DLG -> this.msg_openedDialogue -> Open DLG -> DLG.msg_openedDialogue 
    //DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

    // E-Mail format check
    v_global.logic.id = gw_com_api.getValue("frmData_MainA", 1, "emp_email");
    v_global.logic.key = gw_com_api.getValue("frmData_MainA", 1, "prop_id");
    if (gw_com_api.isEmail(v_global.logic.id) != true) {
        gw_com_api.messageBox([{ text: "E-Mail 입력값이 메일주소 형식이 아닙니다." }]);
        return;
    }

    var dataType = "SrmOpenSrc";    // Set File Data Type

    // prepare dialogue.
    var args = {
        type: "PAGE", page: "SYS_File_Upload", title: "Upload Fils", datatype: dataType  //, open: true
        , width: 660, height: 220, locate: ["center", 200]
    };
    if (gw_com_module.dialoguePrepare(args)) return;

    // Check Updatable
    //if (!checkManipulate({})) return;
    //if (!checkUpdatable({ check: true })) return false;

    // Open dialogue
    args.param = {
        ID: gw_com_api.v_Stream.msg_openedDialogue,
        data: { data_tp: dataType, data_key: v_global.logic.id, data_seq: v_global.logic.key } //,data_subkey: "", data_subseq:0
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processFileDownload(param) {
    // called by row click event - param : object, row
    var args = { targetid: "lyrDown", source: { id: param.object, row: param.row } };
    gw_com_module.downloadFile(args);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// common function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkManipulate(param) {
    closeOption({});
    if (gw_com_api.getCRUD("frmData_MainA") == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;
}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {
    gw_com_api.messageBox([{ text: "REMOVE" }]
        , 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
}
//----------
function processClose(param) {
    // Child Tab Page의 경우 닫기 버튼 비활성화 처리 필요 by JJJ
    if (!param.checked) {
        v_global.process.handler = processClose;
        if (!checkUpdatable({})) return;
    }

    if (parent.v_Current != undefined) // master page 여부 -> 개선 필요 by JJJ
        gw_com_module.streamInterface({ ID: gw_com_api.v_Stream.msg_closePage });   // Close Tab Page

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function closeOption(param) {
    gw_com_api.hide("frmOption");
}
//----------
function processDelete(param) {
    if (!checkManipulate({})) return;

    if (param.object == "lyrMenu_FileA") {
        var args = { targetid: "grdData_FileA", row: "selected" }
        gw_com_module.gridDelete(args);
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processBatch(param) {

    var jobCd = param.element;

    if (jobCd == "Send" && gw_com_api.getValue("frmData_MainA", 1, "info_agree") != "1") {
        gw_com_api.messageBox([{ text: "개인정보 동의 없이 제출할 수 없습니다."}], 500);
        return;
    }
    if (jobCd == "Send" && gw_com_api.getValue("frmData_MainA", 1, "prop_id") == "0") {
        gw_com_api.messageBox([{ text: "먼저 데이터를 저장 후 제출해 주십시오" }], 500);
        return;
    }
    if (jobCd == "Send" && gw_com_api.getRowCount("grdData_FileA") < 1) {
        gw_com_api.messageBox([{ text: "회사소개서는 반드시 첨부하여야 합니다." }], 500);
        return;
    }

    if (!gw_com_api.isTelNo(gw_com_api.getValue("frmData_MainA", 1, "comp_tel"))) {
        gw_com_api.messageBox([{ text: "숫자와 하이픈(-)만 입력 가능합니다." }], 500);
        return;
    }

    var option = "";
    if (jobCd == "Accept") {
        var p1 = gw_com_api.getValue("frmData_SubD", 1, "point1");
        var p2 = gw_com_api.getValue("frmData_SubD", 1, "point2");
        var p3 = 0; //gw_com_api.getValue("frmData_SubD", 1, "point3");
        var total = p1 + p2 + p3;
        if (total == 0) {
            gw_com_api.messageBox([{ text: "심사 점수를 입력하여야 합니다." }], 500);
            return;
        }
        option = p1 + ":" + p2 + ":" + p3 + ":" + total;
    }
    if (jobCd == "Accept" || jobCd == "Reject") {
        option += ":" + gw_com_api.getValue("frmData_SubD", 1, "point1_man");
        option += ":" + gw_com_api.getValue("frmData_SubD", 1, "point2_man");
        option += ":" + gw_com_api.getValue("frmData_SubD", 1, "point_rmk");
    }
    var args = {
        url: "COM", nomessage: true,
        procedure: "sp_SRM_OpenSrc",
        input: [
            { name: "JobCd", value: jobCd, type: "varchar" },
            { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
            { name: "RootId", value: gw_com_api.getValue("frmData_SubA", 1, "prop_id"), type: "int" },
            { name: "RootNo", value: "", type: "varchar" },
            { name: "Option", value: option, type: "varchar" }
        ],
        output: [
            { name: "Rmsg", type: "varchar" }
        ],
        handler: {
            success: processBatchSuccess,
            param: { "act": jobCd }
        }
    };
    gw_com_module.callProcedure(args);

}
function processBatchSuccess(response, param) {

    if (response.VALUE[0] != "" && response.VALUE[0] != "OK") {

        // 사업자번호 입력 취소
        if (param.act == "CheckCompNo") {
            gw_com_api.setValue("frmData_MainA", 1, "comp_no", "");
            gw_com_api.setFocus("frmData_MainA", 1, "comp_no");
        }

        var msg = new Array();
        $.each(response.VALUE[0].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);

        //// set notice
        //var args = { targetid: "lyrRemark_Top", row: [{ name: "notice", value: "▶ " + response.VALUE[0] }] };
        //gw_com_module.labelAssign(args);
    }

    // Refresh Data
    if (param.act != "CheckCompNo")
        processRetrieve({ sub: true, batch: true });


    //if (v_global.logic.supp == "1") {
    //    var param = [
    //        { name: "id", value: v_global.logic.id }, { name: "key", value: v_global.logic.key }
    //    ];
    //    var args = {
    //        ID: gw_com_api.v_Stream.msg_linkPage,
    //        to: { type: "MAIN" },
    //        data: { page: "SRM_OpenSrc_Process", title: "서비스 안내", param: param }
    //    };
    //    gw_com_module.streamInterface(args);
    //}
    //else {
    //    processRetrieve({ sub: true, batch: true });
    //}

}
//----------
function processItemdblclick(param) {

    if (!checkManipulate({})) return;
    if ($.inArray(param.element, ["memo_html"]) >= 0) {
        processMemoEdit({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });
    }
}
//----------
function processRetrieve(param) {

    if (param.sub == undefined) { // Main Data Box
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_prop_id", value: v_global.logic.key }
                ]
            },
            target: [{ type: "FORM", id: "frmData_MainA" }]
            //, handler_complete: processRetrieveComplete
            , handler: { complete: processRetrieveComplete, param: { key: param.key, sub: true } } // for sub data box
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.batch == undefined) { // Sub Data Box
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_temp_id", value: "SRM_OpenSrc_Agree" },
                    { name: "arg_prop_id", value: v_global.logic.key }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_SubA" },
                { type: "FORM", id: "frmData_SubB" },
                { type: "FORM", id: "frmData_SubC" },
                { type: "FORM", id: "frmData_SubD" },
                { type: "FORM", id: "frmData_SubF" },
                { type: "FORM", id: "frmData_SubE" }
            ]
        };
        gw_com_module.objRetrieve(args);
    }
    else { // Batch Data Box
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_prop_id", value: v_global.logic.key }
                ]
            },
            target: [{ type: "FORM", id: "frmData_SubD" }, { type: "FORM", id: "frmData_SubA" }]
        };
        gw_com_module.objRetrieve(args);
    }
}
function processRetrieveComplete(param) {
    if (param.agree) processMemoEdit(param);
    else if (param.sub) {
        // Sub Data Box
        processRetrieve(param);
        // File List
        v_global.logic.id = gw_com_api.getValue("frmData_MainA", 1, "emp_email");
        v_global.logic.key = gw_com_api.getValue("frmData_MainA", 1, "prop_id");
        processFileList({ data_key: v_global.logic.id, data_seq: v_global.logic.key });
        // set title
        var pstat = gw_com_api.getValue("frmData_MainA", 1, "pstat");
        var args = { targetid: "lyrRemark_Top", row: [{ name: "notice", value: "▶ " + pstat }] };
        gw_com_module.labelAssign(args);
    }
}
//----------
function processSave(param) {

    v_global.logic.id = gw_com_api.getValue("frmData_MainA", 1, "emp_email");
    v_global.logic.key = gw_com_api.getValue("frmData_MainA", 1, "prop_id");

    // E-Mail format check
    if (gw_com_api.isEmail(v_global.logic.id) != true) {
        gw_com_api.messageBox([{ text: "E-Mail 입력값이 메일주소 형식이 아닙니다." }]);
        gw_com_api.setFocus("frmData_MainA", 1, "emp_email");
        return;
    }

    // 사업자번호
    if (gw_com_api.getValue("frmData_MainA", 1, "comp_no").length != 10) {
        gw_com_api.messageBox([{ text: "사업자 등록번호 입력값이 잘못되었습니다." }], 500);
        gw_com_api.setFocus("frmData_MainA", 1, "comp_no");
        return;
    }

    gw_com_api.setValue("frmData_MainA", 1, "login_pw", gw_com_api.getValue("frmData_MainA", 1, "comp_no"));

    for (var i = 0; i < gw_com_api.getRowCount("grdData_FileA") ; i++) {
        gw_com_api.setValue("grdData_FileA", 1, "data_key", v_global.logic.id);
        gw_com_api.setValue("grdData_FileA", 1, "data_seq", v_global.logic.key);
        if (v_global.logic.key == "0")
            gw_com_api.setValue("grdData_FileA", 1, "ver_no", 1);
    }

    // 제안내역 분리 Data 처리
    gw_com_api.setValue("frmData_SubB", 1, "qc_yn2", gw_com_api.getValue("frmData_SubC", 1, "qc_yn2"));
//    gw_com_api.setValue("frmData_SubB", 1, "qc_man1", gw_com_api.getValue("frmData_SubC", 1, "qc_man1"));
//    gw_com_api.setValue("frmData_SubB", 1, "qc_year1", gw_com_api.getValue("frmData_SubC", 1, "qc_year1"));
//    gw_com_api.setValue("frmData_SubB", 1, "qc_man2", gw_com_api.getValue("frmData_SubC", 1, "qc_man2"));
//    gw_com_api.setValue("frmData_SubB", 1, "qc_year2", gw_com_api.getValue("frmData_SubC", 1, "qc_year2"));
    gw_com_api.setValue("frmData_SubB", 1, "qc_sw", gw_com_api.getValue("frmData_SubC", 1, "qc_sw"));
    gw_com_api.setValue("frmData_SubB", 1, "qc_text1", gw_com_api.getValue("frmData_SubC", 1, "qc_text1"));
    gw_com_api.setValue("frmData_SubB", 1, "qc_text2", gw_com_api.getValue("frmData_SubC", 1, "qc_text2"));
    gw_com_api.setValue("frmData_SubB", 1, "qc_text3", gw_com_api.getValue("frmData_SubE", 1, "qc_text3"));
    gw_com_api.setValue("frmData_SubB", 1, "qc_text4", gw_com_api.getValue("frmData_SubE", 1, "qc_text4"));

    gw_com_api.setValue("frmData_SubB", 1, "qc_doc1_yn", gw_com_api.getValue("frmData_SubF", 1, "qc_doc1_yn"));
    gw_com_api.setValue("frmData_SubB", 1, "qc_doc2_yn", gw_com_api.getValue("frmData_SubF", 1, "qc_doc2_yn"));
    gw_com_api.setValue("frmData_SubB", 1, "qc_doc3_yn", gw_com_api.getValue("frmData_SubF", 1, "qc_doc3_yn"));

    var args = {
        //url: "COM",
        target: [
            { type: "FORM", id: "frmData_MainA" },
            { type: "FORM", id: "frmData_SubA" },
            { type: "FORM", id: "frmData_SubB" },
            { type: "GRID", id: "grdData_FileA" }
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
function successSave(response, param) {

    if (gw_com_api.getCRUD("frmData_MainA") == "create") {
        var run = true;
        $.each(response, function () {
            $.each(this.KEY, function () {
                if (this.NAME == "prop_id") {
                    v_global.logic.key = this.VALUE;
                    run = false;
                }
                return run;
            });
            return run;
        });
        if (run == false) {
            processRetrieve({});
        }
    }

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            gw_com_module.streamInterface(param);
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (param.from.page == "SYS_File_Upload") { processFileUpload(param); return; }

                var args = { to: { type: "POPUP", page: param.from.page } };
                if (param.from.type == "CHILD") {
                    v_global.process.init = true;
                    if (param.data == undefined) processClose({});
                }
                gw_com_module.streamInterface(args);
            } break;
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
                            if (param.data.result == "YES") processSave({});
                            else if (v_global.process.handler != null) v_global.process.handler({ checked: true });
                        } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                // Close Dialogue Window
                if (param.from != undefined && param.from.page != undefined) closeDialogue({ page: param.from.page });

                // File Upload
                if (param.from.page == "SYS_File_Upload") {
                    processFileList({ data_key: v_global.logic.id, data_seq: v_global.logic.key });
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
            } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//