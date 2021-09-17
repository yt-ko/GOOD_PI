//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "CLAIM", query: "DDDW_CM_CODE",
                //    param: [{ argument: "arg_hcode", value: "IEHM83" }]
                //},
                //{
                //    type: "PAGE", name: "처리상태", query: "DDDW_CM_CODE",
                //    param: [{ argument: "arg_hcode", value: "IEHM84" }]
                //},
                {
                    type: "PAGE", name: "대표원인유형", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM90" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea_in",
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
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            if (v_global.process.param == "") {
                processInsert({});
            } else {
                v_global.logic.key = gw_com_api.getPageParameter("acdt_no");
                processRetrieve({});
            }

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
            targetid: "lyrRemark",
            row: [
                { name: "TEXT" }
            ]
        };
        //----------
        gw_com_module.labelCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE", show: true,
            element: [
                { name: "추가", value: "사건사고 등록" },
                { name: "삭제", value: "사건사고 삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_ACDT_D", type: "FREE", show: true,
            element: [
                { name: "추가", value: "담당자 등록" },
                { name: "삭제", value: "담당자 삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE", show: true,
            element: [
                { name: "추가", value: "첨부파일 등록" },
                { name: "삭제", value: "첨부파일 삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_MEET", type: "FREE", show: true,
            element: [
                { name: "추가", value: "협의내용 등록" },
                { name: "삭제", value: "협의내용 삭제" },
                { name: "저장", value: "저장" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_REF_MODIFY", type: "FREE", show: true,
            element: [
                { name: "추가", value: "횡전개 등록" },
                { name: "삭제", value: "횡전개 삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_REF_NCR", type: "FREE", show: true,
            element: [
                { name: "추가", value: "NCR 등록" },
                { name: "삭제", value: "NCR 삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_ACDT", query: "QDM_6620_1", type: "TABLE", title: "발생정보",
            show: true, selectable: true,
            editable: { bind: "select", focus: "acdt_date", validate: true },
            content: {
                width: { label: 90, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "발생번호", format: { type: "label" } },
                            {
                                name: "acdt_no",
                                editable: { type: "hidden" }
                            },
                            { header: true, value: "발생일자", format: { type: "label" } },
                            {
                                name: "acdt_date", mask: "date-ymd",
                                editable: { validate: { rule: "required" }, type: "text" }
                            },
                            { header: true, value: "장비군", format: { type: "label" } },
                            {
                                name: "dept_area",
                                format: { type: "select", data: { memory: "DEPT_AREA" } },
                                editable: { type: "select", data: { memory: "DEPT_AREA" }, validate: { rule: "required" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "현상분류", format: { type: "label" } },
                            {
                                name: "status_tp1_nm", mask: "search",
                                editable: { type: "text", validate: { rule: "required" } }
                            },
                            { name: "status_tp1", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "현상구분", format: { type: "label" } },
                            { name: "status_tp2_nm", editable: { type: "hidden" } },
                            { name: "status_tp2", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "담당부서", format: { type: "label" } },
                            { name: "acdt_dept_nm", editable: { type: "hidden" } },
                            { name: "acdt_dept", hidden: true, editable: { type: "hidden" } },
                            { name: "ncr_cnt", editable: { type: "hidden" }, mask: "numeric-int", hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "대표원인유형", format: { type: "label" } },
                            {
                                name: "reason_grp0",
                                format: { type: "select", data: { memory: "대표원인유형" } },
                                editable: { type: "select", data: { memory: "대표원인유형" }, validate: { rule: "required" } }
                            },
                            { header: true, value: "원인유형", format: { type: "label" } },
                            {
                                name: "reason_grp1_nm", mask: "search", style: { colspan: 3, colfloat: "float" },
                                format: { width: 120 },
                                editable: { type: "text", validate: { rule: "required" }, width: 120 }
                            },
                            {
                                name: "reason_grp2_nm", style: { colfloat: "floating" },
                                format: { width: 120 },
                                editable: { type: "hidden", width: 120 }
                            },
                            {
                                name: "reason_grp3_nm", style: { colfloat: "floating" },
                                format: { width: 120 },
                                editable: { type: "hidden", width: 120 }
                            },
                            {
                                name: "reason_grp4_nm", style: { colfloat: "floating" },
                                format: { width: 120 },
                                editable: { type: "hidden", width: 120 }
                            },
                            {
                                name: "reason_grp5_nm", style: { colfloat: "floating" },
                                format: { width: 120 },
                                editable: { type: "hidden", width: 120 }
                            },
                            { name: "reason_grp1", hidden: true, editable: { type: "hidden" } },
                            { name: "reason_grp2", hidden: true, editable: { type: "hidden" } },
                            { name: "reason_grp3", hidden: true, editable: { type: "hidden" } },
                            { name: "reason_grp4", hidden: true, editable: { type: "hidden" } },
                            { name: "reason_grp5", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "원인부위분류", format: { type: "label" } },
                            {
                                name: "part_tp1_nm", mask: "search",
                                editable: { type: "text", validate: { rule: "required" } }
                            },
                            { name: "part_tp1", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "원인부위구분", format: { type: "label" } },
                            { name: "part_tp2_nm", editable: { type: "hidden" } },
                            { name: "part_tp2", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "대책수립", format: { type: "label" } },
                            { name: "astat1" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "원인분류", format: { type: "label" } },
                            {
                                name: "reason_tp1_nm", mask: "search",
                                editable: { type: "text", validate: { rule: "required" } }
                            },
                            { name: "reason_tp1", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "원인구분", format: { type: "label" } },
                            { name: "reason_tp2_nm", editable: { type: "hidden" } },
                            { name: "reason_tp2", hidden: true, editable: { type: "hidden" } },
                            { header: true, value: "횡전개", format: { type: "label" } },
                            { name: "astat4" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발생현상", format: { type: "label" } },
                            {
                                style: { colspan: 3 }, name: "rmk",
                                format: { type: "text", width: 1016 },
                                editable: { type: "text", maxlength: 200, width: 624 }
                            },
                            { header: true, value: "Claim", format: { type: "label" } },
                            { name: "astat5" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발생내용", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "acdt_memo",
                                format: { type: "textarea", rows: 5 },
                                editable: { type: "textarea", rows: 5, maxlength: 500 }
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
            targetid: "grdData_ACDT_D", query: "QDM_6620_2", title: "진행이력",
            height: "100%", show: true, caption: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "dept_nm", validate: true },
            element: [
                {
                    header: "담당부서", name: "dept_nm", width: 400,
                    editable: { type: "hidden" }
                },
                {
                    header: "담당자", name: "user_nm", width: 250, mask: "search",
                    editable: { type: "text" }
                },
                //{
                //    header: "처리상태", name: "astat", width: 250,
                //    format: { type: "select", data: { memory: "처리상태" } },
                //    editable: { type: "select", data: { memory: "처리상태" }, validate: { rule: "required" } }
                //},
                { header: "대책수립", name: "astat1", width: 150 },
                { header: "횡전개", name: "astat4", width: 150 },
                { header: "Claim", name: "astat5", width: 150 },
                { name: "acdt_no", hidden: true, editable: { type: "hidden" } },
                { name: "acdt_seq", hidden: true, editable: { type: "hidden" } },
                { name: "dept_cd", hidden: true, editable: { type: "hidden" } },
                { name: "user_id", hidden: true, editable: { type: "hidden" } },
                { name: "plan1_date", hidden: true, editable: { type: "hidden" } },
                { name: "plan2_date", hidden: true, editable: { type: "hidden" } },
                { name: "plan3_date", hidden: true, editable: { type: "hidden" } },
                { name: "plan4_date", hidden: true, editable: { type: "hidden" } },
                { name: "plan5_date", hidden: true, editable: { type: "hidden" } },
                { name: "plan6_date", hidden: true, editable: { type: "hidden" } },
                { name: "act1_date", hidden: true, editable: { type: "hidden" } },
                { name: "act2_date", hidden: true, editable: { type: "hidden" } },
                { name: "act3_date", hidden: true, editable: { type: "hidden" } },
                { name: "act4_date", hidden: true, editable: { type: "hidden" } },
                { name: "act5_date", hidden: true, editable: { type: "hidden" } },
                { name: "act6_date", hidden: true, editable: { type: "hidden" } },
                { name: "plan_amt", hidden: true, editable: { type: "hidden" } },
                { name: "act_amt", hidden: true, editable: { type: "hidden" } },
                { name: "step1_yn", hidden: true, editable: { type: "hidden" } },
                { name: "step2_yn", hidden: true, editable: { type: "hidden" } },
                { name: "step3_yn", hidden: true, editable: { type: "hidden" } },
                { name: "step4_yn", hidden: true, editable: { type: "hidden" } },
                { name: "step5_yn", hidden: true, editable: { type: "hidden" } },
                { name: "step6_yn", hidden: true, editable: { type: "hidden" } },
                { name: "color1", hidden: true, editable: { type: "hidden" } },
                { name: "color2", hidden: true, editable: { type: "hidden" } },
                { name: "color3", hidden: true, editable: { type: "hidden" } },
                { name: "color4", hidden: true, editable: { type: "hidden" } },
                { name: "color5", hidden: true, editable: { type: "hidden" } },
                { name: "color6", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_ACDT_D", query: "QDM_6620_2", type: "TABLE", title: "진행이력",
            show: true, selectable: true,
            editable: { bind: "select", focus: "acdt_date", validate: true },
            content: {
                width: { label: 140, field: 140 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "구분", format: { type: "label" } },
                            { header: true, value: "원인분석", format: { type: "label" } },
                            { header: true, value: "대책수립", format: { type: "label" } },
                            { header: true, value: "평가", format: { type: "label" } },
                            { header: true, value: "횡전개", format: { type: "label" } },
                            { header: true, value: "Claim", format: { type: "label" } },
                            { header: true, value: "환입", format: { type: "label" } },
                            { header: true, value: "품질비용", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "진행여부", format: { type: "label" } },
                            { value: "-", format: { type: "label" } },
                            { value: "-", format: { type: "label" } },
                            {
                                name: "step3_yn",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "step4_yn",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "step5_yn",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { value: "-", format: { type: "label" } },
                            { value: "-", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리계획일자", format: { type: "label" } },
                            { name: "plan1_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "plan2_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "plan3_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "plan4_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "plan5_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "plan6_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "plan_amt", editable: { type: "text" }, mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리완료일자", format: { type: "label" } },
                            { name: "act1_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "act2_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "act3_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "act4_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "act5_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "act6_date", editable: { type: "text" }, mask: "date-ymd" },
                            { name: "act_amt", editable: { type: "text" }, mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상태", format: { type: "label" } },
                            { name: "stat1" },
                            { name: "stat2" },
                            { name: "stat3" },
                            { name: "stat4" },
                            { name: "stat5" },
                            { name: "stat6" },
                            { name: "" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO", query: "QDM_6620_3", type: "TABLE", title: "처리계획 및 결과",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "memo01", validate: true },
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
                                format: { type: "textarea", rows: 8 },
                                editable: { type: "textarea", rows: 8 }
                            },
                            {
                                name: "memo02", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8 },
                                editable: { type: "textarea", rows: 8 }
                            },
                            {
                                name: "memo03", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8 },
                                editable: { type: "textarea", rows: 8 }
                            },
                            {
                                name: "memo04", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8 },
                                editable: { type: "textarea", rows: 8 }
                            },
                            {
                                name: "memo05", style: { colspan: 2 },
                                format: { type: "textarea", rows: 8 },
                                editable: { type: "textarea", rows: 8 }
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
                                format: { type: "textarea", rows: 8 },
                                editable: { type: "textarea", rows: 8 }
                            },
                            {
                                name: "memo12", style: { colspan: 5 },
                                format: { type: "textarea", rows: 8 },
                                editable: { type: "textarea", rows: 8 }
                            },
                            { name: "acdt_no", hidden: true, editable: { type: "hidden" } },
                            { name: "acdt_seq", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //2021-05-13 KYT
        var args = {
            targetid: "grdData_FILE", query: "SYS_File_Edit", title: "첨부파일",
            caption: true, height: "100%", pager: true, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 250 },
                {
                    header: "설명", name: "file_desc", width: 450,
                    editable: { type: "text" }
                },
                { header: "등록자", name: "upd_usr_nm", width: 70 },
                { header: "부서", name: "upd_dept_nm", width: 100 },
                { header: "등록일시", name: "upd_dt", width: 150, align: "center" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "data_tp", hidden: true, editable: { type: "hidden" } },
                { name: "data_key", hidden: true, editable: { type: "hidden" } },
                { name: "use_yn", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MEET", query: "QDM_6620_6", title: "협의내용",
            height: "100%", show: true, caption: true, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                {
                    header: "차수", name: "meet_time", width: 100,
                    editable: { type: "hidden", maxlength: 10 }
                },
                {
                    header: "회의일자", name: "meet_date", width: 100, mask: "date-ymd",
                    editable: { type: "hidden" }
                },
                {
                    header: "제목", name: "meet_title", width: 650,
                    editable: { type: "hidden", maxlength: 50 }
                },
                { header: "참석자수", name: "meet_member_cnt", width: 100, align: "right", mask: "numeric-int" },
                { header: "작성일시", name: "ins_dt", width: 150, align: "center" },
                { name: "meet_idx", hidden: true, editable: { type: "hidden" } },
                { name: "acdt_no", hidden: true, editable: { type: "hidden" } },
                { name: "meet_note", hidden: true, editable: { type: "hidden" } },
                { name: "act_item", hidden: true, editable: { type: "hidden" } },
                { name: "meet_member", hidden: true, editable: { type: "hidden" } },
                { name: "meet_member_nm", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEET", query: "QDM_6620_6", type: "TABLE", title: "협의내용",
            show: true, selectable: true,
            editable: { bind: "select", focus: "meet_time", validate: true },
            content: {
                width: { label: 140, field: 420 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "차수", format: { type: "label" } },
                            {
                                name: "meet_time",
                                editable: { type: "text", maxlength: 10, width: 150 }
                            },
                            { header: true, value: "회의일자", format: { type: "label" } },
                            {
                                name: "meet_date", mask: "date-ymd",
                                editable: { type: "text", width: 150 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            {
                                name: "meet_title", style: { colspan: 3 },
                                format: { width: 1002 },
                                editable: { type: "text", maxlength: 50, width: 1002 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "협의내용", format: { type: "label" } },
                            {
                                name: "meet_note", style: { colspan: 3 },
                                format: { type: "textarea", rows: 5 },
                                editable: { type: "textarea", rows: 5, maxlength: 500 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Action Item", format: { type: "label" } },
                            {
                                name: "act_item", style: { colspan: 3 },
                                format: { type: "textarea", rows: 2 },
                                editable: { type: "textarea", rows: 2, maxlength: 50 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "참석자", format: { type: "label" } },
                            {
                                name: "meet_member_nm", style: { colspan: 3 }, mask: "search",
                                format: { width: 1002 },
                                editable: { type: "text", width: 1002 }
                            },
                            { name: "meet_member", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_REF_MODIFY", query: "QDM_6620_4", title: "횡전개",
            height: "100%", show: true, caption: true, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "ECA작성일", name: "eca_dt", width: 100, align: "center", mask: "date-ymd" },
                { header: "ECA No.", name: "eca_no", width: 100, align: "center" },
                {
                    header: "ECO No.", name: "eco_no", width: 100, align: "center",
                    format: { type: "link" }
                },
                { header: "제목", name: "eco_title", width: 250 },
                {
                    header: "설비대수", name: "cnt1", width: 80, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { header: "적용모듈(건)", name: "cnt2", width: 80, align: "center" },
                { header: "진행율(%)", name: "modify_rate", width: 80, align: "center", mask: "numeric-int" },
                { header: "최근작업일", name: "end_date", width: 80, align: "center", mask: "date-ymd" },
                {
                    header: "품의서 No.", name: "ext1", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "품의서 예산", name: "ext2", width: 100,
                    editable: { type: "text" }
                },
                {
                    header: "집행비용", name: "ext3", width: 100,
                    editable: { type: "text" }
                },
                { name: "ref_idx", hidden: true, editable: { type: "hidden" } },
                { name: "ref_tp", hidden: true, editable: { type: "hidden" } },
                { name: "ref_no", hidden: true, editable: { type: "hidden" } },
                { name: "ref_seq", hidden: true, editable: { type: "hidden" } },
                { name: "acdt_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_REF_NCR", query: "QDM_6620_5", title: "NCR",
            height: "100%", show: true, caption: true, selectable: true, number: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "발생일자", name: "issue_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "발생구분", name: "issue_tp_nm", width: 50, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 50 },
                { header: "발생부서", name: "dept_nm", width: 80 },
                {
                    header: "관리번호", name: "issue_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "발행번호", name: "rqst_no", width: 80, align: "center",
                    format: { type: "link" }
                },
                { header: "진행상태", name: "pstat", width: 60 },
                { header: "등록일시", name: "rqst_ins_dt", width: 100, align: "center", hidden: true },
                { header: "발행여부", name: "astat", width: 60 },
                { header: "발행자", name: "astat_user_nm", width: 60 },
                { header: "발행일시", name: "astat_dt", width: 100, align: "center", hidden: true },
                { header: "담당부서", name: "resp_dept_nm", width: 80 },
                { header: "담당자", name: "user_nm", width: 50 },
                { header: "협력사", name: "supp_nm", width: 80 },
                {
                    header: "협력사귀책", name: "duty_supp", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                },
                { name: "ref_idx", hidden: true, editable: { type: "hidden" } },
                { name: "ref_tp", hidden: true, editable: { type: "hidden" } },
                { name: "ref_no", hidden: true, editable: { type: "hidden" } },
                { name: "ref_seq", hidden: true, editable: { type: "hidden" } },
                { name: "acdt_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_ACDT", offset: 8 },
                { type: "GRID", id: "grdData_ACDT_D", offset: 8 },
                { type: "FORM", id: "frmData_ACDT_D", offset: 8 },
                { type: "FORM", id: "frmData_MEMO", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 },
                { type: "GRID", id: "grdData_MEET", offset: 8 },
                { type: "FORM", id: "frmData_MEET", offset: 8 },
                { type: "GRID", id: "grdData_REF_MODIFY", offset: 8 },
                { type: "GRID", id: "grdData_REF_NCR", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = { type: "PAGE", page: "QDM_6621", title: "코드선택", width: 1050, height: 400, locate: ["center", 120] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "EHM_2012", title: "코드선택", width: 600, height: 400, locate: ["center", 100] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "DLG_EMPLOYEE", title: "사원선택", width: 700, height: 450, locate: ["center", 300] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "QDM_6622", title: "횡전개선택", width: 1050, height: 450, locate: ["center", "bottom"] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "QDM_6623", title: "NCR선택", width: 1050, height: 450, locate: ["center", "bottom"] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "QDM_6624", title: "참석자", width: 800, height: 450, locate: ["center", 800] };
        gw_com_module.dialoguePrepare(args);
        //----------
        //2021-05-13 KYT
        //var args = { type: "PAGE", page: "DLG_UploadFile", title: "파일 업로드", datatype: "ACDT", width: 650, height: 200, locate: ["center", 700] };
        //gw_com_module.dialoguePrepare(args);
        //=====================================================================================

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_ACDT_D", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_ACDT_D", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_MEET", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MEET", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MEET", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_REF_MODIFY", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_REF_MODIFY", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_REF_NCR", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_REF_NCR", element: "삭제", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_ACDT", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_ACDT_D", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_ACDT_D", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_ACDT_D", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_ACDT_D", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_ACDT_D", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FILE", grid: true, event: "click", element: "download", handler: processLink };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MEET", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MEET", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MEET", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_MEET", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_REF_MODIFY", grid: true, event: "click", element: "eco_no", handler: processLink };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_REF_NCR", grid: true, event: "click", element: "issue_no", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_REF_NCR", grid: true, event: "click", element: "rqst_no", handler: processLink };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "추가":
                    {
                        processInsert(param);
                    }
                    break;
                case "삭제":
                    {
                        if (param.object == "lyrMenu") {

                            var stat = checkCRUD({});
                            if (stat == "initialize" || stat == "create") {

                                processClear({});

                            } else if (stat == "retrieve" || stat == "update") {

                                var p = {
                                    handler: processRemove,
                                    param: param
                                }
                                gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", p);

                            }

                        } else {

                            processDelete(param);

                        }
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
            }

        }
        //----------
        function processRowselecting(param) {

            if (param.object == "grdData_ACDT_D") {
                var crud = gw_com_api.getDataStatus("frmData_MEMO");
                var rtn = (crud == "C" || crud == "U" ? false : true);
                if (!rtn) gw_com_api.messageBox([{ text: "저장되지 않은 데이터가 있습니다." }]);
                return rtn;
            }
            return true;

        }
        //----------
        function processRowselected(param) {

            linkRetrieve(param);

        }
        //----------
        function processItemchanged(param) {

            if (param.object == "frmData_ACDT_D") {
                var val = gw_com_api.unMask(param.value.current, gw_com_module.v_Object[param.object].option[param.element].mask);

                switch (param.element) {
                    case "plan3_date":
                    case "act3_date":
                        {
                            if (gw_com_api.getValue(param.object, param.row, "step3_yn", (param.type == "GRID")) != "1" && param.value.current != "") {
                                var p = {
                                    handler: function (param) {
                                        gw_com_api.setValue(param.object, param.row, param.element, "", (param.type == "GRID"));
                                    },
                                    param: param
                                }
                                gw_com_api.messageBox([{ text: "진행여부가 체크되지 않아 입력할 수 없습니다." }], 420, undefined, undefined, p);
                                return false;
                            }
                        }
                        break;
                    case "plan4_date":
                    case "act4_date":
                        {
                            if (gw_com_api.getValue(param.object, param.row, "step4_yn", (param.type == "GRID")) != "1" && param.value.current != "") {
                                var p = {
                                    handler: function (param) {
                                        gw_com_api.setValue(param.object, param.row, param.element, "", (param.type == "GRID"));
                                    },
                                    param: param
                                }
                                gw_com_api.messageBox([{ text: "진행여부가 체크되지 않아 입력할 수 없습니다." }], 420, undefined, undefined, p);
                                return false;
                            }
                        }
                        break;
                    case "plan5_date":
                    case "act5_date":
                        {
                            if (gw_com_api.getValue(param.object, param.row, "step5_yn", (param.type == "GRID")) != "1" && param.value.current != "") {
                                var p = {
                                    handler: function (param) {
                                        gw_com_api.setValue(param.object, param.row, param.element, "", (param.type == "GRID"));
                                    },
                                    param: param
                                }
                                gw_com_api.messageBox([{ text: "진행여부가 체크되지 않아 입력할 수 없습니다." }], 420, undefined, undefined, p);
                                return false;
                            }
                        }
                        break;
                    case "step3_yn":
                    case "step4_yn":
                    case "step5_yn":
                        {
                            if (param.value.current == "0") {
                                var ele1 = "plan" + param.element.substring(4, 5) + "_date";
                                var ele2 = "act" + param.element.substring(4, 5) + "_date";
                                gw_com_api.setValue(param.object, param.row, ele1, "", (param.type == "GRID"));
                                gw_com_api.setValue(param.object, param.row, ele2, "", (param.type == "GRID"));
                            }
                        }
                        break;
                }

                gw_com_api.setValue("grdData_ACDT_D", "selected", param.element, val, true, true);
                if (gw_com_api.getCRUD("grdData_ACDT_D", "selected", true) == "retrieve")
                    gw_com_api.setUpdatable("grdData_ACDT_D", gw_com_api.getSelectedRow("grdData_ACDT_D"), true);
                return true;

            } else if (param.object == "frmData_MEET") {

                var val = gw_com_api.unMask(param.value.current, gw_com_module.v_Object[param.object].option[param.element].mask);
                gw_com_api.setValue("grdData_MEET", "selected", param.element, val, true, true);
                if (gw_com_api.getCRUD("grdData_MEET", "selected", true) == "retrieve")
                    gw_com_api.setUpdatable("grdData_MEET", gw_com_api.getSelectedRow("grdData_MEET"), true);
                return true;

            }

            switch (param.element) {

                case "":
                    {

                    }
                    break;

            }

        }
        //----------
        function processItemdblclick(param) {

            switch (param.element) {
                case "status_tp1_nm":
                    {
                        v_global.event.data = {
                            prod_type: "%",
                            hcode: "IEHM21",
                            code1: gw_com_api.getValue(param.object, param.row, "status_tp1"),
                            code2: gw_com_api.getValue(param.object, param.row, "status_tp2")
                        };
                        var args = {
                            page: "EHM_2012",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "part_tp1_nm":
                    {
                        v_global.event.data = {
                            prod_type: "%",
                            hcode: "IEHM22",
                            code1: gw_com_api.getValue(param.object, param.row, "part_tp1"),
                            code2: gw_com_api.getValue(param.object, param.row, "part_tp2")
                        };
                        var args = {
                            page: "EHM_2012",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "reason_tp1_nm":
                    {
                        v_global.event.data = {
                            prod_type: "%",
                            hcode: "IEHM23",
                            code1: gw_com_api.getValue(param.object, param.row, "reason_tp1"),
                            code2: gw_com_api.getValue(param.object, param.row, "reason_tp2")
                        };
                        var args = {
                            page: "EHM_2012",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "reason_grp1_nm":
                    {
                        v_global.event.data = {
                            code1: gw_com_api.getValue(param.object, param.row, "reason_grp1", (param.type == "GRID")),
                            code2: gw_com_api.getValue(param.object, param.row, "reason_grp2", (param.type == "GRID")),
                            code3: gw_com_api.getValue(param.object, param.row, "reason_grp3", (param.type == "GRID")),
                            code4: gw_com_api.getValue(param.object, param.row, "reason_grp4", (param.type == "GRID")),
                            code5: gw_com_api.getValue(param.object, param.row, "reason_grp5", (param.type == "GRID"))
                        };
                        var args = {
                            page: "QDM_6621",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "user_nm":
                    {
                        v_global.event = param;
                        var args = {
                            page: "DLG_EMPLOYEE",
                            param: {
                                ID: gw_com_api.v_Stream.msg_selectEmployee
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
                case "meet_member_nm":
                    {
                        v_global.event = param;
                        v_global.event.code = "meet_member";
                        v_global.event.name = "meet_member_nm";
                        v_global.event.data = {
                            code: gw_com_api.getValue(param.object, param.row, "meet_member", (param.type == "GRID")),
                            name: gw_com_api.getValue(param.object, param.row, "meet_member_nm", (param.type == "GRID"))
                        };
                        var args = {
                            page: "QDM_6624",
                            param: {
                                ID: gw_com_api.v_Stream.msg_openedDialogue,
                                data: v_global.event.data
                            }
                        };
                        gw_com_module.dialogueOpen(args);
                    }
                    break;
            }

        }
        //=====================================================================================

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

    return gw_com_api.getCRUD("frmData_ACDT");

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
function processInsert(param) {

    if (param.object == "lyrMenu_ACDT_D") {

        if (!checkManipulate({})) return;
        if (gw_com_api.getUpdatable("grdData_ACDT_D", true)) {
            gw_com_api.messageBox([{ text: "저장 후 계속하세요." }], 300);
            return;
        }
        v_global.event.object = "grdData_ACDT_D";
        v_global.event.row = 0;
        v_global.event.type = "GRID";
        var args = {
            page: "DLG_EMPLOYEE",
            param: {
                ID: gw_com_api.v_Stream.msg_selectEmployee
            }
        };
        gw_com_module.dialogueOpen(args);

    } else if (param.object == "lyrMenu_FILE") {

        //var args = {
        //    page: "DLG_UploadFile",
        //    param: {
        //        ID: gw_com_api.v_Stream.msg_openedDialogue,
        //        data: {
        //            data_tp: "ACDT",
        //            data_key: gw_com_api.getValue("frmData_ACDT", 1, "acdt_no")
        //        }
        //    }
        //};
        //gw_com_module.dialogueOpen(args);

        //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
        //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

        // Check Updatable
        if (!checkManipulate({})) return;

        // set data for "File Upload"
        var dataType = "ACDT";    // Set File Data Type
        var dataKey = gw_com_api.getValue("frmData_ACDT", 1, "acdt_no");   // Main Key value for Search
        /*var dataSeq = gw_com_api.getValue("frmData_ACDT", "selected", "-1");   // Main Seq value for Search*/

        // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
        v_global.event.data = { data_tp: dataType, data_key: dataKey}; // additional data = { data_subkey: "", data_subseq:-1 }

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


    } else if (param.object == "lyrMenu_MEET") {

        if (!checkManipulate({})) return;
        var args = {
            targetid: "grdData_MEET", edit: true, updatable: true,
            data: [
                { name: "acdt_no", value: gw_com_api.getValue("frmData_ACDT", 1, "acdt_no") },
                { name: "meet_date", value: gw_com_api.getDate() }
            ]
        };
        var row = gw_com_module.gridInsert(args);
        gw_com_api.selectRow(args.targetid, row, true);

    } else if (param.object == "lyrMenu_MEMO") {

        if (!checkManipulate({})) return;
        var args = {
            targetid: "frmData_MEMO", edit: true, updatable: true,
            data: [
                { name: "acdt_no", value: gw_com_api.getValue("grdData_ACDT_D", "selected", "acdt_no", true) },
                { name: "acdt_seq", value: gw_com_api.getValue("grdData_ACDT_D", "selected", "acdt_seq", true) }
            ]
        };
        gw_com_module.formInsert(args);

    } else if (param.object == "lyrMenu_REF_MODIFY") {

        if (!checkManipulate({})) return;
        var args = {
            page: "QDM_6622",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    acdt_no: gw_com_api.getValue("frmData_ACDT", 1, "acdt_no")
                }
            }
        };
        gw_com_module.dialogueOpen(args);

    } else if (param.object == "lyrMenu_REF_NCR") {

        if (!checkManipulate({})) return;
        var args = {
            page: "QDM_6623",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    acdt_no: gw_com_api.getValue("frmData_ACDT", 1, "acdt_no")
                }
            }
        };
        gw_com_module.dialogueOpen(args);

    } else {

        var args = {
            targetid: "frmData_ACDT", edit: true, updatable: true,
            data: [
                { name: "acdt_date", value: gw_com_api.getDate() },
                { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA }
            ],
            clear: [
                { type: "GRID", id: "grdData_ACDT_D" },
                { type: "FORM", id: "frmData_ACDT_D" },
                { type: "FORM", id: "frmData_MEMO" },
                { type: "GRID", id: "grdData_FILE" },
                { type: "GRID", id: "grdData_MEET" },
                { type: "FORM", id: "frmData_MEET" },
                { type: "GRID", id: "grdData_REF_MODIFY" },
                { type: "GRID", id: "grdData_REF_NCR" }
            ]
        };
        gw_com_module.formInsert(args);

    }

}
//----------
function processDelete(param) {

    var obj = param.object.replace("lyrMenu", "grdData");
    var args = { targetid: obj, row: "selected", select: true };

    switch (obj) {
        case "grdData_ACDT_D":
            {
                args.clear = [
                    { type: "FORM", id: "frmData_ACDT_D" },
                    { type: "FORM", id: "frmData_MEMO" }
                ];
            }
            break;
        case "grdData_MEET":
            {
                args.clear = [
                    { type: "FORM", id: "frmData_MEET" }
                ];
            }
            break;
    }
    gw_com_module.gridDelete(args);

}
//----------
function processRemove(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_ACDT", key: { element: [{ name: "acdt_no" }] } }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processClear({});

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_acdt_no", value: v_global.logic.key }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_ACDT" },
        ],
        clear: [
            { type: "GRID", id: "grdData_ACDT_D" },
            { type: "FORM", id: "frmData_ACDT_D" },
            { type: "GRID", id: "grdData_MEET" },
            { type: "FORM", id: "frmData_MEET" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "GRID", id: "grdData_REF_MODIFY" },
            { type: "GRID", id: "grdData_REF_NCR" },
            { type: "FORM", id: "frmData_MEMO" }
        ],
        handler_complete: completeRetrieve
    };
    gw_com_module.objRetrieve(args);

}
//----------
function completeRetrieve(param) {

    assignLabel({});
    linkRetrieve({});

}
//----------
function linkRetrieve(param) {

    if (param.object == "grdData_MEET") {

        var crud = gw_com_api.getDataStatus(param.object, param.row, true);
        if (crud == "C" || crud == "U") {

            var args = {
                targetid: "frmData_MEET",
                data: [
                    { name: "meet_time", value: gw_com_api.getValue(param.object, param.row, "meet_time", true), change: false },
                    { name: "meet_title", value: gw_com_api.getValue(param.object, param.row, "meet_title", true), change: false },
                    { name: "meet_date", value: gw_com_api.getValue(param.object, param.row, "meet_date", true), change: false },
                    { name: "meet_note", value: gw_com_api.getValue(param.object, param.row, "meet_note", true), change: false },
                    { name: "act_item", value: gw_com_api.getValue(param.object, param.row, "act_item", true), change: false },
                    { name: "meet_member", value: gw_com_api.getValue(param.object, param.row, "meet_member", true), change: false },
                    { name: "meet_member_nm", value: gw_com_api.getValue(param.object, param.row, "meet_member_nm", true), change: false }
                ]
            };
            gw_com_module.formInsert(args);
            gw_com_api.setCRUD("frmData_MEET", 1, "retrieve");

        } else {

            var args = {
                source: {
                    type: param.type, id: param.object, row: param.row,
                    element: [
                        { name: "acdt_no", argument: "arg_acdt_no" },
                        { name: "meet_idx", argument: "arg_meet_idx" }
                    ]
                },
                target: [
                    { type: "FORM", id: "frmData_MEET" }
                ]
            };
            gw_com_module.objRetrieve(args);

        }

    } else if (param.object == "grdData_ACDT_D") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "acdt_no", argument: "arg_acdt_no" },
                    { name: "acdt_seq", argument: "arg_acdt_seq" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_ACDT_D" },
                { type: "FORM", id: "frmData_MEMO" }
            ],
            handler: {
                complete: processSetStat,
                param: param
            }
        };
        gw_com_module.objRetrieve(args);

    } else {

        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_acdt_no", value: v_global.logic.key },
                    { name: "arg_acdt_seq", value: 0 },
                    { name: "arg_meet_idx", value: 0 }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_ACDT_D", select: true },
                { type: "GRID", id: "grdData_MEET", select: true },
                { type: "GRID", id: "grdData_FILE" },
                { type: "GRID", id: "grdData_REF_MODIFY" },
                { type: "GRID", id: "grdData_REF_NCR" }
            ],
            clear: [
                { type: "FORM", id: "frmData_ACDT_D" },
                { type: "FORM", id: "frmData_MEET" },
                { type: "FORM", id: "frmData_MEMO" }
            ]
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processSetStat(param) {

    var obj = "frmData_ACDT_D";
    var color1 = gw_com_api.getValue(param.object, param.row, "color1", (param.type == "GRID"));
    var color2 = gw_com_api.getValue(param.object, param.row, "color2", (param.type == "GRID"));
    var color3 = gw_com_api.getValue(param.object, param.row, "color3", (param.type == "GRID"));
    var color4 = gw_com_api.getValue(param.object, param.row, "color4", (param.type == "GRID"));
    var color5 = gw_com_api.getValue(param.object, param.row, "color5", (param.type == "GRID"));
    var color6 = gw_com_api.getValue(param.object, param.row, "color6", (param.type == "GRID"));
    color1 = (color1 == undefined ? "transparent" : color1);
    color2 = (color2 == undefined ? "transparent" : color2);
    color3 = (color3 == undefined ? "transparent" : color3);
    color4 = (color4 == undefined ? "transparent" : color4);
    color5 = (color5 == undefined ? "transparent" : color5);
    color6 = (color6 == undefined ? "transparent" : color6);

    $("#" + obj + "_stat1_view").css("background-color", color1);
    $("#" + obj + "_stat2_view").css("background-color", color2);
    $("#" + obj + "_stat3_view").css("background-color", color3);
    $("#" + obj + "_stat4_view").css("background-color", color4);
    $("#" + obj + "_stat5_view").css("background-color", color5);
    $("#" + obj + "_stat6_view").css("background-color", color6);

    var ele1 = $("#" + obj + "_stat1_view").closest("td");
    var ele2 = $("#" + obj + "_stat2_view").closest("td");
    var ele3 = $("#" + obj + "_stat3_view").closest("td");
    var ele4 = $("#" + obj + "_stat4_view").closest("td");
    var ele5 = $("#" + obj + "_stat5_view").closest("td");
    var ele6 = $("#" + obj + "_stat6_view").closest("td");

    ele1.css("background", color1);
    ele2.css("background", color2);
    ele3.css("background", color3);
    ele4.css("background", color4);
    ele5.css("background", color5);
    ele6.css("background", color6);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_ACDT" },
            { type: "GRID", id: "grdData_ACDT_D" },
            { type: "FORM", id: "frmData_ACDT_D" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "GRID", id: "grdData_MEET" },
            { type: "FORM", id: "frmData_MEET" },
            { type: "GRID", id: "grdData_REF_MODIFY" },
            { type: "GRID", id: "grdData_REF_NCR" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        target: [
            { type: "FORM", id: "frmData_ACDT" },
            { type: "GRID", id: "grdData_ACDT_D" },
            { type: "GRID", id: "grdData_MEET" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "GRID", id: "grdData_REF_MODIFY" },
            { type: "GRID", id: "grdData_REF_NCR" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };

    // 발생현상
    if (gw_com_api.getUpdatable("frmData_ACDT")) {
        if (args.param == undefined)
            args.param = new Array();

        var crud = gw_com_api.getDataStatus("frmData_ACDT");
        args.param.push({
            query: "QDM_6620_3",
            row: [{
                crud: crud,
                column: [
                    { name: "acdt_no", value: gw_com_api.getValue("frmData_ACDT", 1, "acdt_no") },
                    { name: "acdt_seq", value: "0" },
                    { name: "memo_tp", value: "STATUS" },
                    { name: "memo_text", value: gw_com_api.getValue("frmData_ACDT", 1, "acdt_memo") }
                ]
            }]
        });
    }

    // 메모
    if (gw_com_api.getUpdatable("frmData_MEMO")) {
        if (args.param == undefined)
            args.param = new Array();

        var crud = gw_com_api.getDataStatus("frmData_MEMO");
        args.param.push({
            query: "QDM_6620_3",
            row: [
                {
                    crud: crud,
                    column: [
                        { name: "acdt_no", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_no") },
                        { name: "acdt_seq", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_seq") },
                        { name: "memo_tp", value: "A1" },
                        { name: "memo_text", value: gw_com_api.getValue("frmData_MEMO", 1, "memo01") }
                    ]
                },
                {
                    crud: crud,
                    column: [
                        { name: "acdt_no", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_no") },
                        { name: "acdt_seq", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_seq") },
                        { name: "memo_tp", value: "A2" },
                        { name: "memo_text", value: gw_com_api.getValue("frmData_MEMO", 1, "memo02") }
                    ]
                },
                {
                    crud: crud,
                    column: [
                        { name: "acdt_no", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_no") },
                        { name: "acdt_seq", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_seq") },
                        { name: "memo_tp", value: "A3" },
                        { name: "memo_text", value: gw_com_api.getValue("frmData_MEMO", 1, "memo03") }
                    ]
                },
                {
                    crud: crud,
                    column: [
                        { name: "acdt_no", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_no") },
                        { name: "acdt_seq", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_seq") },
                        { name: "memo_tp", value: "A4" },
                        { name: "memo_text", value: gw_com_api.getValue("frmData_MEMO", 1, "memo04") }
                    ]
                },
                {
                    crud: crud,
                    column: [
                        { name: "acdt_no", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_no") },
                        { name: "acdt_seq", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_seq") },
                        { name: "memo_tp", value: "A5" },
                        { name: "memo_text", value: gw_com_api.getValue("frmData_MEMO", 1, "memo05") }
                    ]
                },
                {
                    crud: crud,
                    column: [
                        { name: "acdt_no", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_no") },
                        { name: "acdt_seq", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_seq") },
                        { name: "memo_tp", value: "B1" },
                        { name: "memo_text", value: gw_com_api.getValue("frmData_MEMO", 1, "memo11") }
                    ]
                },
                {
                    crud: crud,
                    column: [
                        { name: "acdt_no", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_no") },
                        { name: "acdt_seq", value: gw_com_api.getValue("frmData_MEMO", 1, "acdt_seq") },
                        { name: "memo_tp", value: "B2" },
                        { name: "memo_text", value: gw_com_api.getValue("frmData_MEMO", 1, "memo12") }
                    ]
                }
            ]
        });
    }
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        $.each(this.KEY, function () {
            if (this.NAME == "acdt_no") {
                v_global.logic.key = this.VALUE;
                return false;
            }
        });
        if (v_global.logic.key != undefined && v_global.logic.key != "") return false;
    });
    processRetrieve({});

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_ACDT" },
            { type: "GRID", id: "grdData_ACDT_D" },
            { type: "FORM", id: "frmData_ACDT_D" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_FILE" },
            { type: "GRID", id: "grdData_MEET" },
            { type: "FORM", id: "frmData_MEET" },
            { type: "GRID", id: "grdData_REF_MODIFY" },
            { type: "GRID", id: "grdData_REF_NCR" }
        ]
    };
    gw_com_module.objClear(args);
    processSetStat(param);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);

}
//----------
function processLink(param) {

    if (param.object == "grdData_FILE") {

        gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown" });

    } else if (param.object == "grdData_REF_MODIFY") {

        var args = {
            to: "INFO_ECCB",
            eco_no: gw_com_api.getValue(param.object, param.row, param.element, true),
            tab: "ECO"
        };
        gw_com_site.linkPage(args);

    } else if (param.object == "grdData_REF_NCR") {

        if (param.element == "issue_no") {

            var args = {
                to: "INFO_ISSUE",
                issue_no: gw_com_api.getValue(param.object, param.row, param.element, true)
            };
            gw_com_site.linkPage(args);

        } else if (param.element == "rqst_no") {

            var args = {
                to: "INFO_NCR",
                rqst_no: gw_com_api.getValue(param.object, param.row, param.element, true)
            };
            gw_com_site.linkPage(args);

        }

    }

}
//----------
function assignLabel(param) {

    var args = {
        targetid: "lyrRemark",
        row: [
            {
                name: "TEXT",
                value: " [대상건수 : " + gw_com_api.getValue("frmData_ACDT", 1, "ncr_cnt") + "]"
            }
        ]
    };
    gw_com_module.labelAssign(args);

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
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "QDM_6621":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp1_nm", param.data.dname1, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp2_nm", param.data.dname2, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp3_nm", param.data.dname3, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp4_nm", param.data.dname4, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp5_nm", param.data.dname5, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp1", param.data.dcode1, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp2", param.data.dcode2, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp3", param.data.dcode3, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp4", param.data.dcode4, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, "reason_grp5", param.data.dcode5, false, true);
                            }
                        }
                        break;
                    case "QDM_6622":
                    case "QDM_6623":
                        {
                            if (param.data != undefined) {

                                var obj = (param.from.page == "QDM_6622" ? "grdData_REF_MODIFY" : "grdData_REF_NCR");
                                var data = new Array();
                                $.each(param.data, function () {
                                    if (gw_com_api.getFindRow(obj, "ref_no", this.ref_no) > 0) return true;
                                    data.push(this);
                                })
                                if (data.length > 0) {
                                    var args = { targetid: obj, edit: true, updatable: true, data: param.data };
                                    gw_com_module.gridInserts(args);
                                    // 최초 등록일 경우 발생정보 코드 자동 세팅
                                    if (checkCRUD({}) == "create" && gw_com_api.getValue("frmData_ACDT", 1, "status_tp1") == "" &&
                                        gw_com_api.getValue("frmData_ACDT", 1, "part_tp1") == "" && gw_com_api.getValue("frmData_ACDT", 1, "reason_tp1") == "") {
                                        var args = {
                                            request: "PAGE",
                                            name: "GW_INF",
                                            url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                                                "?QRY_ID=QDM_6623_2" +
                                                "&QRY_COLS=status_tp1,status_tp2,part_tp1,part_tp2,reason_tp1,reason_tp2,status_tp1_nm,status_tp2_nm,part_tp1_nm,part_tp2_nm,reason_tp1_nm,reason_tp2_nm" +
                                                "&CRUD=R" +
                                                "&arg_issue_no=" + data[0].issue_no,
                                            async: false,
                                            handler_success: successRequest
                                        };
                                        gw_com_module.callRequest(args);
                                        function successRequest(data) {

                                            gw_com_api.setValue("frmData_ACDT", 1, "status_tp1", data.DATA[0], false, true);
                                            gw_com_api.setValue("frmData_ACDT", 1, "status_tp2", data.DATA[1], false, true);
                                            gw_com_api.setValue("frmData_ACDT", 1, "part_tp1", data.DATA[2], false, true);
                                            gw_com_api.setValue("frmData_ACDT", 1, "part_tp2", data.DATA[3], false, true);
                                            gw_com_api.setValue("frmData_ACDT", 1, "reason_tp1", data.DATA[4], false, true);
                                            gw_com_api.setValue("frmData_ACDT", 1, "reason_tp2", data.DATA[5], false, true);
                                            gw_com_api.setValue("frmData_ACDT", 1, "status_tp1_nm", data.DATA[6]);
                                            gw_com_api.setValue("frmData_ACDT", 1, "status_tp2_nm", data.DATA[7]);
                                            gw_com_api.setValue("frmData_ACDT", 1, "part_tp1_nm", data.DATA[8]);
                                            gw_com_api.setValue("frmData_ACDT", 1, "part_tp2_nm", data.DATA[9]);
                                            gw_com_api.setValue("frmData_ACDT", 1, "reason_tp1_nm", data.DATA[10]);
                                            gw_com_api.setValue("frmData_ACDT", 1, "reason_tp2_nm", data.DATA[11]);

                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case "QDM_6624":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code, param.data.code.join(","), (v_global.event.type == "GRID"));
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name, param.data.name.join(","), (v_global.event.type == "GRID"));
                            }
                        }
                        break;
                    case "EHM_2012":
                        {
                            if (param.data != undefined) {
                                var code1 = "", code2 = "", name1 = "", name2 = "";
                                switch (param.data.hcode) {
                                    case "IEHM21":
                                        {
                                            code1 = "status_tp1", code2 = "status_tp2", name1 = "status_tp1_nm", name2 = "status_tp2_nm";
                                        }
                                        break;
                                    case "IEHM22":
                                        {
                                            code1 = "part_tp1", code2 = "part_tp2", name1 = "part_tp1_nm", name2 = "part_tp2_nm";
                                        }
                                        break;
                                    case "IEHM23":
                                        {
                                            code1 = "reason_tp1", code2 = "reason_tp2", name1 = "reason_tp1_nm", name2 = "reason_tp2_nm";
                                        }
                                        break;
                                }
                                gw_com_api.setValue("frmData_ACDT", 1, name1, param.data.dname1, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, name2, param.data.dname2, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, code1, param.data.dcode1, false, true);
                                gw_com_api.setValue("frmData_ACDT", 1, code2, param.data.dcode2, false, true);
                            }
                        }
                        break;
                    case "SYS_FileUpload":
                        {
                            if (param.data != undefined) {
                                $.each(param.data, function () {
                                    this.use_yn = "1";
                                    this.download = "download";
                                    this.upd_usr_nm = gw_com_module.v_Session.USR_NM;
                                    this.upd_dept_nm = gw_com_module.v_Session.DEPT_NM;
                                })
                                var args = {
                                    targetid: "grdData_FILE", focus: true, edit: true, updatable: true,
                                    data: param.data
                                };
                                var row = gw_com_module.gridInserts(args);

                                var ids = gw_com_api.getRowIDs("grdData_FILE");
                                $.each(ids, function () {
                                    if (gw_com_api.getCRUD("grdData_FILE", this, true) == "create") {
                                        gw_com_api.setCRUD("grdData_FILE", this, "modify", true);
                                    }
                                })
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (v_global.event.row == 0) {

                    var args = {
                        targetid: v_global.event.object, edit: true, updatable: true,
                        data: [
                            { name: "acdt_no", value: gw_com_api.getValue("frmData_ACDT", 1, "acdt_no") },
                            { name: "acdt_seq", rule: "INCREMENT", value: 1 },
                            { name: "user_id", value: param.data.user_id },
                            { name: "user_nm", value: param.data.user_nm },
                            { name: "dept_cd", value: param.data.dept_cd },
                            { name: "dept_nm", value: param.data.dept_nm }
                        ]
                    };
                    v_global.event.row = gw_com_module.gridInsert(args);
                    var params = {
                        targetid: "frmData_ACDT_D", updatable: false, editable: false
                    };
                    gw_com_module.formInsert(params);
                    gw_com_api.setCRUD("frmData_ACDT_D", 1, "retrieve");
                    processSetStat({});
                    processInsert({ object: "lyrMenu_MEMO" });

                } else {

                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_id", param.data.user_id, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "user_nm", param.data.user_nm, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_cd", param.data.dept_cd, (v_global.event.type == "GRID"));
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm, (v_global.event.type == "GRID"), true);

                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//