//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.04)
//------------------------------------------

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "설비군", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM06" }]
                },
                {
                    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM29" }]
                },
                {
                    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
                    param: [{ argument: "arg_hcode", value: "IEHM02" }]
                },
                {
                    type: "PAGE", name: "상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM13" }]
                },
                {
                    type: "PAGE", name: "진행상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "IEHM10" }]
                },
                {
                    type: "INLINE", name: "보기",
                    data: [{ title: "축약", value: "S" }, { title: "확장", value: "L" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);


        // go next.

        function start() {

            gw_job_process.UI();

        }

    },
    //#endregion 

    // manage UI. (design section) 

    //#region
    UI: function () {

        // define UI.

        var args = {
            targetid: "lyrMenu_1_1", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_수정현황", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
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
                            },
                            {
                                name: "prod_type", label: { title: "제품유형 :" },
                                editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
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
                                name: "cust_prod_nm", label: { title: "설비명 :" },
                                editable: { type: "text", size: 12, maxlength: 20 }
                            },
                            { name: "proj_no", hidden: true }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            },
                            {
                                name: "prod_group",
                                label: { title: "설비군 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "설비군", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "issue_stat",
                                label: { title: "상태 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "진행상태", unshift: [{ title: "전체", value: "%" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "issue_no", label: { title: "관리번호 :" },
                                editable: { type: "text", size: 18 }
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
            targetid: "frmView", type: "FREE", trans: true, show: false, border: false, align: "left",
            editable: { bind: "open", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "view", label: { title: "보기 :" }, value: "L",
                                editable: { type: "select", data: { memory: "보기" } }
                            },
                            {
                                name: "실행", act: true, show: false, format: { type: "button" }
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
            targetid: "frmView1", type: "FREE", trans: true, show: false, border: false, align: "left",
            editable: { bind: "open", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "view1", label: { title: "보기 :" }, value: "L",
                                editable: { type: "select", data: { memory: "보기" } }
                            },
                            {
                                name: "실행", act: true, show: false, format: { type: "button" }
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
            targetid: "grdData_발생정보", query: "EHM_2010_M_1", title: "발생 정보",
            caption: true, height: 130, dynamic: true, show: true, selectable: true,
            element: [
                { header: "관리번호", name: "issue_no", width: 80, align: "center" },
                { header: "재발", name: "rcr_yn_nm", width: 50, align: "center" },
                { header: "발생일자", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "발생구분", name: "issue_tp_nm", width: 90, align: "center" },
                { header: "고객사", name: "cust_nm", width: 70, align: "center" },
                { header: "Line", name: "cust_dept_nm", width: 80, align: "center" },
                { header: "Process", name: "cust_proc_nm", width: 100, align: "center" },
                { header: "고객설비명", name: "cust_prod_nm", width: 120, align: "center" },
                { header: "제품유형", name: "prod_type", width: 100, align: "center" },
                { header: "제품명", name: "prod_nm", width: 250, align: "left" },
                { header: "발생Module", name: "prod_sub", width: 100, align: "center" },
                { header: "Warranty", name: "wrnt_io", width: 60, align: "center" },
                { header: "진행상태", name: "istat", width: 80, align: "center" },
                { header: "발생현상", name: "rmk", width: 300, align: "left" },
                { header: "NCR 상태", name: "ncr_stat", width: 70, align: "center" },
                { header: "품질확인자", name: "qemp", width: 70, align: "center" },
                { header: "품질확인일시", name: "qdate", width: 160, align: "center" },
                { header: "등록자", name: "ins_usr", width: 70, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
                { header: "수정자", name: "upd_usr", width: 70, align: "center" },
                { header: "수정일시", name: "upd_dt", width: 160, align: "center" },
                { name: "prod_key", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_발생정보", query: "EHM_2010_M_2", type: "TABLE", title: "발생 정보",
            show: true, selectable: true,
            content: {
                width: { label: 100, field: 230 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "issue_no", style: { colfloat: "float" } },
                            { name: "rcr_yn_nm", style: { colfloat: "floated" } },
                            { header: true, value: "발생일시", format: { type: "label" } },
                            { style: { colfloat: "float" }, name: "issue_dt", mask: "date-ymd", format: { width: 62 } },
                            { style: { colfloat: "floated" }, name: "issue_time", mask: "time-hh", format: { width: 30 } },
                            { header: true, value: "발생구분", format: { type: "label" } },
                            { name: "issue_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "고객사", format: { type: "label" } },
                            { name: "cust_nm" },
                            { header: true, value: "Line", format: { type: "label" } },
                            { name: "cust_dept_nm" },
                            { header: true, value: "Process", format: { type: "label" } },
                            { name: "cust_proc_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설비명", format: { type: "label" } },
                            { name: "cust_prod_nm" },
                            { header: true, value: "제품명", format: { type: "label" } },
                            { name: "prod_nm" },
                            { header: true, value: "발생Module", format: { type: "label" } },
                            { name: "prod_sub_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Warranty", format: { type: "label" } },
                            { name: "wrnt_io" },
                            { header: true, value: "긴급도", format: { type: "label" } },
                            { name: "important_level_nm" },
                            { header: true, value: "상태", format: { type: "label" } },
                            { name: "pstat_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발생현상", format: { type: "label" } },
                            { style: { colspan: 5 }, name: "rmk", format: { width: 1016 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "등록자/등록일시", format: { type: "label" } },
                            { name: "ins_usr", style: { colfloat: "float" }, format: { type: "text", width: 50 } },
                            { name: "ins_dt", style: { colfloat: "floated" } },
                            { header: true, value: "수정자/수정일시", format: { type: "label" } },
                            { name: "upd_usr", style: { colfloat: "float" }, format: { type: "text", width: 50 } },
                            { name: "upd_dt", style: { colfloat: "floated" } },
                            { header: true, value: "부품 Fail", format: { type: "label" } },
                            { name: "part_fail_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "CS표준유무", format: { type: "label" } },
                            { name: "standard_yn_nm" },
                            { header: true, value: "CS표준준수여부", format: { type: "label" } },
                            { name: "follow_yn_nm" },
                            { header: true, value: "표준번호", format: { type: "label" } },
                            { name: "standard_no" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제조Test유무", format: { type: "label" } },
                            { name: "ptest_yn_nm" },
                            { header: true, value: "1차원인선택", format: { type: "label" } },
                            { name: "factor_tp_nm" },
                            { header: true, value: "1차원인근거", format: { type: "label" } },
                            { name: "basis_rmk" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_발생내역", query: "EHM_2010_S_1_1", title: "발생 내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            element: [
                { header: "순번", name: "issue_seq", width: 35, align: "center" },
                { header: "발생구분", name: "issue_tp_nm", width: 100, align: "center" },
                { header: "발생Module", name: "prod_sub_nm", width: 80, align: "center" },
                { header: "발생현상(대)", name: "status_grp_nm", width: 80 },
                { header: "발생현상(중)", name: "status_tp1_nm", width: 130 },
                { header: "발생현상(소)", name: "status_tp2_nm", width: 130 },
                { header: "원인부위분류", name: "part_tp1_nm", width: 90 },
                { header: "원인부위구분", name: "part_tp2_nm", width: 130 },
                { header: "원인분류", name: "reason_tp1_nm", width: 90 },
                { header: "원인구분", name: "reason_tp2_nm", width: 130 },
                { header: "귀책분류", name: "duty_tp1_nm", width: 90 },
                { header: "귀책구분", name: "duty_tp2_nm", width: 130 },
                { name: "issue_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_발생내용", query: "EHM_2010_S_2", type: "TABLE", title: "발생 내용",
            width: "100%", show: true, selectable: true,
            content: {
                height: 25, width: { label: 80, field: 720 },
                row: [
                    {
                        element: [
                            { header: true, value: "발생내용", format: { type: "label" } },
                            {
                                name: "rmk_text",
                                format: { type: "textarea", rows: 7, width: 1014 }
                            },
                            { name: "rmk_cd", hidden: true },
                            { name: "issue_no", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_조치내역", query: "EHM_2010_S_3_1", title: "조치 내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            element: [
                { header: "순번", name: "issue_seq", width: 35, align: "center" },
                { header: "조치일자", name: "work_dt", width: 92, align: "center", mask: "date-ymd" },
                { header: "조치분류", name: "work_tp1_nm", width: 125, align: "center" },
                { header: "조치구분", name: "work_tp2_nm", width: 120, align: "center" },
                { header: "작업시간", name: "work_time", width: 60, align: "center", mask: "numeric-float" },
                { header: "작업자1", name: "work_man1", width: 80, align: "center" },
                { header: "작업자2", name: "work_man2", width: 80, align: "center" },
                { header: "작업자3", name: "work_man3", width: 80, align: "center" },
                { header: "작업자4", name: "work_man4", width: 80, align: "center" },
                { header: "작업자5", name: "work_man5", width: 80, align: "center" },
                { header: "상태", name: "pstat_nm", width: 70, align: "center" },
                { header: "완료일자", name: "end_dt", width: 92, align: "center", mask: "date-ymd" },
                { header: "완료시각", name: "end_time", width: 60, align: "center", mask: "time-hh" },
                { name: "work_seq", hidden: true },
                { name: "issue_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_조치내용", query: "EHM_2010_S_4", type: "TABLE", title: "조치 내용",
            width: "100%", show: true, selectable: true,
            content: {
                height: 25, width: { label: 80, field: 720 },
                row: [
                    {
                        element: [
                            { header: true, value: "조치내용", format: { type: "label" } },
                            {
                                name: "rmk_text",
                                format: { type: "textarea", rows: 4, width: 1014 }
                            },
                            { name: "rmk_cd", hidden: true },
                            { name: "issue_no", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmData_조치내용_rmk_text_view").attr("disabled", true);
        //=====================================================================================
        var args = {
            targetid: "grdData_점검결과", query: "EHM_2010_S_9", title: "추정요인 및 점검결과",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            element: [
                { header: "순번", name: "issue_seq", width: 50, align: "center" },
                { header: "점검일자", name: "chk_dt", width: 100, align: "center", mask: "date-ymd" },
                { header: "부품군", name: "part_tp_nm", width: 150 },
                { header: "모델", name: "maker_nm", width: 150 },
                { header: "추정요인/점검항목", name: "chk_rmk1_nm", width: 200 },
                { header: "기준", name: "chk_rmk2_nm", width: 150 },
                { header: "점검결과", name: "chk_rmk3", width: 200 },
                { header: "판정", name: "chk_rmk4", width: 150 },
                { header: "비고", name: "chk_rmk5", width: 200 },
                { name: "chk_seq", hidden: true },
                { name: "issue_no", hidden: true },
                { name: "part_tp", hidden: true },
                { name: "maker_cd", hidden: true },
                { name: "chk_rmk1", hidden: true },
                { name: "chk_rmk2", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_수정현황", query: "EHM_2010_S_10", title: "내용수정현황",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "chk_txt", validate: true },
            element: [
                {
                    header: "요청일시", name: "rqst_dt", width: 150, align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "요청자", name: "rqst_usr_nm", width: 80, align: "center",
                },
                {
                    header: "요청내용", name: "rqst_txt", width: 300,
                    editable: { type: "text", maxlength: 200, validate: { rule: "required" } }
                },
                { header: "보완일시", name: "chk_dt", width: 150, align: "center" },
                { header: "보완자", name: "chk_usr_nm", width: 80, align: "center" },
                { header: "보완내용", name: "chk_txt", width: 300 },
                { name: "issue_no", hidden: true, editable: { type: "hidden" } },
                { name: "chk_seq", hidden: true, editable: { type: "hidden" } },
                { name: "rqst_usr", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_교체PART", query: "EHM_2010_S_5_1", title: "교체 PART",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            element: [
                { header: "순번", name: "issue_seq", width: 35, align: "center" },
                { header: "교체일자", name: "change_dt", width: 92, align: "center", mask: "date-ymd" },
                { header: "수급시간", name: "change_time", width: 70, align: "center", mask: "numeric-float" },
                { header: "수량", name: "change_qty", width: 50, align: "center", mask: "numeric-int", editable: { validate: { rule: "required" }, type: "text" } },
                { header: "참원인부품", name: "reason_yn", width: 60, align: "center", format: { type: "checkbox", title: "", value: 1, offval: 0 } },
                { header: "반출", name: "reinput_yn", width: 40, align: "center", format: { type: "checkbox", title: "", value: 1, offval: 0 } },
                { header: "반출예정일(OUT)", name: "reinput_dt", width: 92, align: "center", mask: "date-ymd" },
                { header: "부품상태", name: "part_stat_nm", width: 80, align: "center" },
                { header: "기장착부품군(OUT)", name: "apart_tp_nm", width: 120, align: "center" },
                { header: "기장착부품코드(OUT)", name: "apart_cd", width: 120, align: "center" },
                { header: "기장착부품명(OUT)", name: "apart_nm", width: 200 },
                { header: "제조사", name: "apart_supp", width: 150, align: "left" },
                { header: "모델", name: "apart_model", width: 150, align: "center" },
                { header: "규격(REV)", name: "apart_rev", width: 150, align: "center" },
                { header: "비고(REV)", name: "apart_rmk", width: 300, align: "left" },
                { header: "발생현상", name: "status_tp1_nm", width: 150, align: "center" },
                { header: "세부현상", name: "status_tp2_nm", width: 150, align: "center" },
                { header: "현상비고", name: "status_rmk", width: 300 },
                { header: "OUT Ser. No(기장착부품)", name: "apart_sno", width: 150 },
                { header: "교체부품군(IN)", name: "bpart_tp_nm", width: 120, align: "center" },
                { header: "교체부품코드(IN)", name: "bpart_cd", width: 120, align: "center" },
                { header: "교체부품명(IN)", name: "bpart_nm", width: 200 },
                { header: "구매요청", name: "charge_cs_nm", width: 70, align: "center" },
                { header: "제조사", name: "bpart_supp", width: 150, align: "left" },
                { header: "모델", name: "bpart_model", width: 150, align: "center" },
                { header: "규격(REV)", name: "bpart_rev", width: 150, align: "center" },
                { header: "비고(REV)", name: "bpart_rmk", width: 300, align: "left" },
                { header: "IN Ser. No(교체부품)", name: "bpart_sno", width: 150 },
                { name: "charge_yn", hidden: true },
                { header: "상태", name: "pstat", width: 70, align: "center" },
                { header: "성적표 파일", name: "file_nm", width: 200, align: "left" },
                { name: "file_id", hidden: true },
                { name: "file_path", hidden: true },
                { name: "status_etc", hidden: true },
                { name: "status_tp1", hidden: true },
                { name: "status_tp2", hidden: true },
                { name: "change_tp", hidden: true },
                { name: "change_div", hidden: true },
                { name: "prod_type", hidden: true },
                { name: "part_seq", hidden: true },
                { name: "issue_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        $("#grdData_교체PART_data").parents('div.ui-jqgrid-bdiv').css("max-height", "350px");
        //=====================================================================================
        var args = {
            targetid: "frmData_교체내용", query: "EHM_2010_S_6", type: "TABLE", title: "교체 내용",
            width: "100%", show: true, selectable: true,
            content: {
                width: { label: 80, field: 720 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "교체내용", format: { type: "label" } },
                            {
                                name: "rmk_text",
                                format: { type: "textarea", rows: 4, width: 1014 }
                            },
                            { name: "rmk_cd", hidden: true },
                            { name: "issue_no", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_처리결과", query: "EHM_2010_S_0_2", type: "TABLE", title: "처리 결과",
            caption: true, show: false, selectable: true,
            content: {
                width: { label: 80, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "처리일자", format: { type: "label" } }, { name: "rslt_date", mask: "date-ymd" },
                            { header: true, value: "유형분류", format: { type: "label" } }, { name: "issue_cd" },
                            { header: true, value: "유형구분", format: { type: "label" } }, { name: "issue_tp" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리결과", format: { type: "label" } }, { name: "rslt_tp" },
                            { header: true, value: "발생구분", format: { type: "label" } }, { name: "reason_cd" },
                            { header: true, value: "관리구분", format: { type: "label" } }, { name: "mng_cd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "해당업체", format: { type: "label" } }, { name: "supp_nm" },
                            { header: true, value: "귀책구분", format: { type: "label" } }, { name: "duty_cd" },
                            { header: true, value: "반출일자", format: { type: "label" } }, { name: "mout_date", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리자", format: { type: "label" } }, { name: "rslt_emp" },
                            { header: true, value: "작성일시", format: { type: "label" } }, { name: "upd_dt" },
                            { header: true, value: "처리완료", format: { type: "label" } }, { name: "complete_yn", format: { type: "checkbox", title: "완료", value: "1" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개선대책<br>및<br>처리내역", format: { type: "label" } },
                            { style: { colspan: 5 }, name: "rslt_rmk1", format: { type: "textarea", rows: 5, width: 1014 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "특이사항", format: { type: "label" } },
                            { style: { colspan: 5 }, name: "rslt_rmk2", format: { type: "textarea", rows: 5, width: 1014 } },
                            { name: "issue_no", value: "", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부파일", query: "EHM_2010_S_7", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 270, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "등록자", name: "upd_usr", width: 70, align: "center" },
                { header: "부서", name: "upd_dept", width: 80, align: "center" },
                { header: "설명", name: "file_desc", width: 330, align: "left" },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_상세메모", query: "EHM_2010_S_8", type: "TABLE", title: "상세 메모",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" }, height: 200,
                row: [
                    {
                        element: [
                            { name: "memo_text", format: { type: "html", height: 200 } },
                            { name: "issue_no", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_발생정보", offset: 8 },
                { type: "FORM", id: "frmData_발생정보", offset: 8 },
                { type: "GRID", id: "grdData_발생내역", offset: 8 },
                { type: "FORM", id: "frmData_발생내용", offset: 8 },
                { type: "GRID", id: "grdData_조치내역", offset: 8 },
                { type: "FORM", id: "frmData_조치내용", offset: 8 },
                { type: "GRID", id: "grdData_점검결과", offset: 8 },
                { type: "GRID", id: "grdData_수정현황", offset: 8 },
                { type: "GRID", id: "grdData_교체PART", offset: 8 },
                { type: "FORM", id: "frmData_교체내용", offset: 8 },
                { type: "FORM", id: "frmData_처리결과", offset: 8 },
                { type: "GRID", id: "grdData_첨부파일", offset: 8 },
                { type: "FORM", id: "frmData_상세메모", offset: 8 }
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


    // manage process. (program section) 
    //#region
    procedure: function () {


        // define event.
        //=====================================================================================
        var args = { targetid: "lyrMenu_1_1", element: "조회", event: "click", handler: click_lyrMenu_1_1_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "닫기", event: "click", handler: click_lyrMenu_1_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_수정현황", element: "추가", event: "click", handler: click_lyrMenu_수정현황_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_수정현황", element: "삭제", event: "click", handler: click_lyrMenu_수정현황_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_수정현황", element: "저장", event: "click", handler: click_lyrMenu_수정현황_저장 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmView", event: "itemchanged", handler: itemchanged_frmView };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmView1", event: "itemchanged", handler: itemchanged_frmView1 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrTab", event: "tabselect", handler: click_lyrTab_tabselect };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_발생정보", grid: true, event: "rowselecting", handler: rowselecting_grdData_발생정보 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발생정보", grid: true, event: "rowselected", handler: rowselected_grdData_발생정보 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_발생내역", grid: true, event: "rowselecting", handler: rowselecting_grdData_발생내역 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발생내역", grid: true, event: "rowselected", handler: rowselected_grdData_발생내역 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_교체PART", grid: true, event: "rowselected", handler: rowselected_grdData_교체PART };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_첨부파일", grid: true, element: "download", event: "click", handler: click_grdData_첨부파일_download };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_1_조회(ui) {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_1_닫기(ui) {
            checkClosable({});
        }
        //----------
        function click_lyrMenu_수정현황_추가(ui) {

            if (gw_com_api.getSelectedRow("grdData_발생내역") == null) {
                gw_com_api.messageBox([{ text: "NOMASTER" }]);
                return;
            }
            var args = {
                targetid: "grdData_수정현황", edit: true, updatable: true,
                data: [
                    { name: "issue_no", value: gw_com_api.getValue("grdData_발생내역", "selected", "issue_no", true) },
                    { name: "chk_seq", rule: "INCREMENT", value: 1 },
                    { name: "rqst_dt", value: "SYSDT" },
                    { name: "rqst_usr", value: gw_com_module.v_Session.USR_ID },
                    { name: "rqst_usr_nm", value: gw_com_module.v_Session.USR_NM }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_수정현황_삭제(ui) {

            var args = { targetid: "grdData_수정현황", row: "selected", select: true }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_수정현황_저장(ui) {

            processSave({});

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
        function itemchanged_frmView(ui) {

            switch (ui.element) {
                case "view":
                    {
                        if (ui.value.current == "S")
                            gw_com_api.hideCols("grdData_교체PART", [
                                "apart_supp", "apart_model", "apart_rev", "apart_rmk",
                                "bpart_supp", "bpart_model", "bpart_rev", "bpart_rmk"
                            ]);
                        else
                            gw_com_api.showCols("grdData_교체PART", [
                                "apart_supp", "apart_model", "apart_rev", "apart_rmk",
                                "bpart_supp", "bpart_model", "bpart_rev", "bpart_rmk"
                            ]);
                        gw_com_module.objResize({
                            target: [{
                                type: "GRID", id: "grdData_교체PART", offset: 8
                            }]
                        });
                    }
                    break;
            }

        }
        //----------
        function itemchanged_frmView1(ui) {

            switch (ui.element) {
                case "view1":
                    {
                        if (ui.value.current == "S")
                            gw_com_api.hideCols("grdData_발생정보", [
                                "issue_no", "cust_nm", "prod_type",
                                "qemp", "qdate"
                            ]);
                        else
                            gw_com_api.showCols("grdData_발생정보", [
                                "issue_no", "cust_nm", "prod_type",
                                "qemp", "qdate"
                            ]);
                        gw_com_module.objResize({
                            target: [{
                                type: "GRID", id: "grdData_발생정보", offset: 8
                            }]
                        });
                    }
                    break;
            }

        }
        //----------
        function click_lyrTab_tabselect(ui) {

            closeOption({});
            gw_com_api.hide("lyrMenu_1_" + v_global.process.current.tab);
            v_global.process.current.tab = ui.row;
            gw_com_api.show("lyrMenu_1_" + v_global.process.current.tab);

        }
        //----------
        function rowselecting_grdData_발생정보(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_발생정보(ui) {
            v_global.process.prev.master = ui.row;
            processLink({ master: true });
        };
        //----------
        function rowselecting_grdData_발생내역(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_발생내역(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------
        function rowselected_grdData_교체PART(ui) {

            var toggle = (gw_com_api.getValue(ui.object, ui.row, "apart_tp", true) == "기타") ? false : true;
            gw_com_api.setAttribute(ui.object, ui.row, "apart_cd", "readonly", toggle, true);
            gw_com_api.setAttribute(ui.object, ui.row, "apart_nm", "readonly", toggle, true);

            toggle = (gw_com_api.getValue(ui.object, ui.row, "bpart_tp", true) == "기타") ? false : true;
            gw_com_api.setAttribute(ui.object, ui.row, "bpart_cd", "readonly", toggle, true);
            gw_com_api.setAttribute(ui.object, ui.row, "bpart_nm", "readonly", toggle, true);

            toggle = (gw_com_api.getValue(ui.object, ui.row, "status_etc", true) == "1") ? false : true;
            gw_com_api.setAttribute(ui.object, ui.row, "status_tp1_nm", "readonly", toggle, true);
            gw_com_api.setAttribute(ui.object, ui.row, "status_tp2_nm", "readonly", toggle, true);

        };
        //----------
        function click_grdData_첨부파일_download(ui) {

            var args = {
                source: { id: "grdData_첨부파일", row: ui.row },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }
        //----------
        // startup process.
        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -10 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_module.startPage();
        v_global.process.current.tab = 1;

        if (v_global.process.param != "") {
            var setup_no = gw_com_api.getPageParameter("setup_no");
            if (setup_no != "") {
                closeOption({});
                processInsert({ data: { setup_no: setup_no } });
            }

            var issue_no = gw_com_api.getPageParameter("issue_no");
            if (issue_no != "") {
                gw_com_api.setValue("frmOption", 1, "issue_no", issue_no);
                processRetrieve({});
            }
        }

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

    if (param.sub)
        return gw_com_api.getCRUD("grdData_발생내역", "selected", true);
    else if (param.part)
        return gw_com_api.getCRUD("grdData_교체PART", "selected", true);
    else
        return gw_com_api.getCRUD("frmData_발생정보");

}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
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
            { type: "GRID", id: "grdData_수정현황" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkClosable(param) {

    closeOption({});
    gw_com_api.selectTab("lyrTab", 1)

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function successBatch(response, param) {

    var args;
    if (response.VALUE[0] == "0") {
        v_global.process.handler = processClose;
        args = {
            hanlder: processClose,
            param: param
        }
    }
    gw_com_api.messageBox([{ text: response.VALUE[1] }], undefined, undefined, undefined, args);

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    if (param.key != undefined) {
        $.each(param.key, function () {
            if (this.QUERY == "EHM_2010_M_2")
                this.QUERY = "EHM_2010_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "issue_stat", argument: "arg_issue_stat" },
                { name: "prod_group", argument: "arg_prod_group" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "issue_no", argument: "arg_issue_no" }
            ],
            argument: [
                { name: "arg_issue_part", value: "AS" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "prod_group" }] },
                { element: [{ name: "prod_type" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_prod_nm" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "issue_stat" }] },
                { element: [{ name: "issue_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_발생정보", select: true }
        ],
        clear: [
            { type: "FORM", id: "frmData_발생정보" },
            { type: "GRID", id: "grdData_발생내역" },
            { type: "FORM", id: "frmData_발생내용" },
            { type: "GRID", id: "grdData_조치내역" },
            { type: "FORM", id: "frmData_조치내용" },
            { type: "GRID", id: "grdData_점검결과" },
            { type: "GRID", id: "grdData_수정현황" },
            { type: "GRID", id: "grdData_교체PART" },
            { type: "FORM", id: "frmData_교체내용" },
            { type: "FORM", id: "frmData_처리결과" },
            { type: "GRID", id: "grdData_첨부파일" },
            { type: "FORM", id: "frmData_상세메모" }
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
                type: "GRID", id: "grdData_발생내역", row: "selected", block: true,
                element: [
                    { name: "issue_no", argument: "arg_issue_no" },
                    { name: "issue_seq", argument: "arg_issue_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_조치내역" },
                { type: "GRID", id: "grdData_점검결과" },
                { type: "GRID", id: "grdData_교체PART" }
            ],
            key: param.key
        };
    }
    else if (param.master) {
        args = {
            source: {
                type: "GRID", id: "grdData_발생정보", row: "selected", block: true,
                element: [{ name: "issue_no", argument: "arg_issue_no" }]
            },
            target: [
                { type: "FORM", id: "frmData_발생정보" }
            ],
            key: param.key,
            handler: { complete: processLink, param: {} }
        };
    }
    else {
        args = {
            source: {
                type: "GRID", id: "grdData_발생정보", row: "selected", block: true,
                element: [
                    { name: "issue_no", argument: "arg_issue_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_발생정보"/*, edit: true */ },
                { type: "GRID", id: "grdData_발생내역", select: true },
                { type: "FORM", id: "frmData_발생내용"/*, edit: true */ },
                { type: "FORM", id: "frmData_조치내용", clear: true/*, edit: true */ },
                { type: "FORM", id: "frmData_교체내용", clear: true/*, edit: true */ },
                { type: "FORM", id: "frmData_처리결과" },
                { type: "GRID", id: "grdData_첨부파일" },
                { type: "FORM", id: "frmData_상세메모" },
                { type: "GRID", id: "grdData_수정현황" }
            ],
            //clear: [
            //    { type: "FORM", id: "frmData_발생내용" },
            //    { type: "GRID", id: "grdData_조치내역" },
            //    { type: "FORM", id: "frmData_조치내용" },
            //    { type: "GRID", id: "grdData_점검결과" },
            //    { type: "GRID", id: "grdData_교체PART" },
            //    { type: "FORM", id: "frmData_교체내용" },
            //    { type: "FORM", id: "frmData_처리결과" },
            //    { type: "GRID", id: "grdData_첨부파일" },
            //    { type: "FORM", id: "frmData_상세메모" }
            //],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    (param.sub)
        ? gw_com_api.selectRow("grdData_발생내역", v_global.process.current.sub, true, false)
        : gw_com_api.selectRow("grdData_발생정보", v_global.process.current.master, true, false);

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_수정현황" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_발생내역",
        row: v_global.process.prev.sub
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_발생정보" },
            { type: "GRID", id: "grdData_발생내역" },
            { type: "FORM", id: "frmData_발생내용" },
            { type: "GRID", id: "grdData_조치내역" },
            { type: "FORM", id: "frmData_조치내용" },
            { type: "GRID", id: "grdData_점검결과" },
            { type: "GRID", id: "grdData_수정현황" },
            { type: "GRID", id: "grdData_교체PART" },
            { type: "FORM", id: "frmData_교체내용" },
            { type: "FORM", id: "frmData_처리결과" },
            { type: "GRID", id: "grdData_첨부파일" },
            { type: "FORM", id: "frmData_상세메모" }
        ]
    };
    if (param.master)
        args.target.unshift({ type: "GRID", id: "grdData_발생정보" });
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

    var args = {
        source: {
            type: "GRID", id: "grdData_발생내역", row: "selected", block: true,
            element: [
                { name: "issue_no", argument: "arg_issue_no" },
                { name: "issue_seq", argument: "arg_issue_seq" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_수정현황" }
        ],
        key: response
    };
    gw_com_module.objRetrieve(args);

}
//----------
// stream handler. (network section)
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
                                processSave(param.data.arg);
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
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param != undefined)
                                    param.data.arg.handler(param.data.arg.param);
                                else
                                    param.data.arg.handler();
                            }
                        }
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
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