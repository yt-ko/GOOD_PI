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

        // prepare dialogue.
        //----------
        var args = { type: "PAGE", page: "w_qcm2010_1", title: "코드선택", width: 800, height: 500, locate: ["center", 400] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "w_qcm2010_2", title: "부위구분", width: 1100, height: 500, locate: ["center", 400] };
        gw_com_module.dialoguePrepare(args);
        //----------
        var args = { type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택", width: 600, height: 450, locate: ["center", 200] };
        gw_com_module.dialoguePrepare(args);
        //----------

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
                    type: "PAGE", name: "발생구분", query: "dddw_issuetp",
                    param: [{ argument: "arg_rcode", value: "QC" }]
                },
                {
                    type: "PAGE", name: "고객사", query: "dddw_cust"
                },
                {
                    type: "PAGE", name: "LINE", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "IEHM02" }]
                },
                {
                    type: "INLINE", name: "중요도",
                    data: [
                        { title: "상", value: "상" },
                        { title: "중", value: "중" },
                        { title: "하", value: "하" }
                    ]
                },
                {
                    type: "PAGE", name: "상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM13" }]
                },
                { type: "PAGE", name: "모듈", query: "dddw_qcm2010_module1" },
                //{
                //    type: "PAGE", name: "모듈", query: "DDDW_CM_CODE",
                //    param: [{ argument: "arg_hcode", value: "IEHM05" }]
                //},
                //{
                //    type: "PAGE", name: "모듈2", query: "dddw_zcodef",
                //    param: [{ argument: "arg_hcode", value: "IQDM22" }]
                //},
                //{
                //    type: "PAGE", name: "현상분류", query: "dddw_zcodef",
                //    param: [{ argument: "arg_hcode", value: "IQDM21" }]
                //},
                //{
                //    type: "PAGE", name: "현상구분", query: "dddw_zcodef",
                //    param: [{ argument: "arg_hcode", value: "IQDM31" }]
                //},
                //{
                //    type: "PAGE", name: "부위분류", query: "dddw_zcodef",
                //    param: [{ argument: "arg_hcode", value: "IQDM22" }]
                //},
                //{
                //    type: "PAGE", name: "부위구분", query: "dddw_zcodef",
                //    param: [{ argument: "arg_hcode", value: "IQDM32" }]
                //},
                {
                    type: "PAGE", name: "조치분류", query: "dddw_zcodef",
                    param: [{ argument: "arg_hcode", value: "IQDM24" }]
                },
                {
                    type: "PAGE", name: "조치구분", query: "dddw_zcodef",
                    param: [{ argument: "arg_hcode", value: "IQDM34" }]
                },
                {
                    type: "PAGE", name: "조치상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM13" }]
                },
                {
                    type: "PAGE", name: "교체분류", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IPOP12" }]
                },
                {
                    type: "PAGE", name: "교체구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM12" }]
                },
                {
                    type: "PAGE", name: "검사종류", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM15" }]
                },
                {
                    type: "PAGE", name: "귀책구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM16" }]
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
            targetid: "lyrMenu_1_1", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "저장", value: "저장" },
                { name: "삭제", value: "삭제" },
                { name: "출력", value: "출력", icon: "출력" },
                { name: "NCR", value: "NCR 접수", icon: "실행" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1_2", type: "FREE", show: false,
            element: [
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
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
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
            targetid: "lyrMenu_4", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_5", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "받기", value: "전체받기", icon: "기타" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_6", type: "FREE",
            element: [
                { name: "편집", value: "편집", icon: "추가" }
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
                                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "발생일자 :" },
                                mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "issue_tp", label: { title: "발생구분 :" },
                                editable: { type: "select", data: { memory: "발생구분", unshift: [{ title: "전체", value: "%" }] } }
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
                                    type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
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
            targetid: "grdData_발생정보", query: "w_qcm2010_M_1", title: "발생 정보",
            caption: true, height: 130, dynamic: true, show: true, selectable: true, number: true,
            element: [
                { header: "관리번호", name: "issue_no", width: 80, align: "center" },
                { header: "발생일자", name: "issue_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "발생구분", name: "issue_tp", width: 80, align: "center" },
                { header: "고객사", name: "cust_cd", width: 80, align: "center" },
                { header: "Line", name: "cust_dept", width: 80, align: "center" },
                { header: "Process", name: "cust_proc", width: 100, align: "center" },
                { header: "고객설비명", name: "cust_prod_nm", width: 170, align: "left" },
                { header: "Project No.", name: "proj_no", width: 80, align: "center" },
                { header: "제품유형", name: "prod_type", width: 80, align: "center" },
                { header: "제품", name: "prod_nm", width: 250, align: "left" },
                { header: "Module", name: "prod_sub", width: 60, align: "center" },
                { header: "중요도", name: "important_level", width: 60, align: "center" },
                { header: "상태", name: "pstat", width: 50, align: "center" },
                { header: "상태변경일", name: "pdate", width: 80, align: "center", mask: "date-ymd" },
                { header: "발생현상", name: "rmk", width: 300, align: "left" },
                { header: "검사업체", name: "qc_supp_nm", width: 150, align: "left" },
                { header: "확인", name: "astat", width: 60, align: "center", hidden: true },
                { header: "확인자", name: "aemp", width: 70, align: "center", hidden: true },
                { header: "확인일시", name: "adate", width: 160, align: "center", hidden: true },
                { header: "NCR 상태", name: "ncr_stat", width: 70, align: "center" },
                { header: "품질확인", name: "qstat", width: 60, align: "center", hidden: true },
                { header: "품질확인일시", name: "qdate", width: 160, align: "center", hidden: true },
                { header: "등록자", name: "ins_usr", width: 70, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
                { header: "수정자", name: "upd_usr", width: 70, align: "center" },
                { header: "수정일시", name: "upd_dt", width: 160, align: "center" },
                { name: "prod_key", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_발생정보", query: "w_qcm2010_M_2", type: "TABLE", title: "발생 정보",
            show: true, selectable: true,
            editable: { bind: "select", focus: "issue_tp", validate: true },
            content: {
                width: { label: 110, field: 260 },
                height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "issue_no", editable: { type: "hidden" } },
                            { header: true, value: "발생일자", format: { type: "label" } },
                            {
                                name: "issue_dt", mask: "date-ymd",
                                editable: { type: "text", validate: { rule: "required", message: "발생일자" } }
                            },
                            { header: true, value: "발생구분", format: { type: "label" } },
                            {
                                name: "issue_tp",
                                editable: { type: "select", data: { memory: "발생구분" }, validate: { rule: "required", message: "발생구분" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "고객사", format: { type: "label" } },
                            {
                                name: "cust_nm", mask: "search",
                                editable: { type: "text", validate: { rule: "required", message: "고객사" } }
                            },
                            { header: true, value: "Line", format: { type: "label" } },
                            { name: "cust_dept", editable: { type: "hidden" } },
                            { header: true, value: "Process", format: { type: "label" } },
                            { name: "cust_proc", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설비명", format: { type: "label" } },
                            { name: "cust_prod_nm", display: true, editable: { type: "hidden" } },
                            { header: true, value: "제품명", format: { type: "label" } },
                            { name: "prod_nm", display: true, editable: { type: "hidden" } },
                            { header: true, value: "Project No.", format: { type: "label" } },
                            { name: "proj_no", display: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Module", format: { type: "label" } },
                            { name: "prod_sub", editable: { type: "select", data: { memory: "모듈" }, validate: { rule: "required", message: "Module" } } },
                            { header: true, value: "중요도", format: { type: "label" } },
                            { name: "important_level", editable: { type: "select", data: { memory: "중요도" }, validate: { rule: "required", message: "중요도" } } },
                            { header: true, value: "상태", format: { type: "label" } },
                            { name: "pstat", editable: { type: "select", data: { memory: "상태" }, validate: { rule: "required", message: "상태" } } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "발생현상", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "rmk",
                                format: { type: "text", width: 1020 },
                                editable: { type: "text", width: 1020, maxlength: 100, validate: { rule: "required", message: "발생현상" } }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "검사업체", format: { type: "label" } },
                            {
                                name: "qc_supp_nm", mask: "search",
                                editable: { type: "text" }
                            },
                            { name: "qc_supp", editable: { type: "hidden" }, hidden: true },
                            { header: true, value: "검사종류", format: { type: "label" } },
                            {
                                name: "qc_tp",
                                format: { type: "select", data: { memory: "검사종류", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "검사종류", unshift: [{ title: "-", value: "" }] } }
                            },
                            { header: true, value: "부적합수량(건)", format: { type: "label" } },
                            {
                                name: "qc_qty", mask: "numeric-int",
                                editable: { type: "text" }
                            },
                            { name: "qc_supp_crud", editable: { type: "hidden" }, hidden: true },
                            { name: "qc_tp_crud", editable: { type: "hidden" }, hidden: true },
                            { name: "qc_qty_crud", editable: { type: "hidden" }, hidden: true },
                            { name: "duty_tp_crud", editable: { type: "hidden" }, hidden: true }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "귀책구분", format: { type: "label" } },
                            {
                                name: "duty_tp",
                                format: { type: "select", data: { memory: "귀책구분", unshift: [{ title: "-", value: "" }] } },
                                editable: { type: "select", data: { memory: "귀책구분", unshift: [{ title: "-", value: "" }] } }
                            },
                            { header: true, value: "등록자", format: { type: "label" } },
                            { name: "ins_usr", style: { colfloat: "float" }, format: { width: 50 } },
                            { name: "ins_dt", style: { colfloat: "floated" } },
                            { header: true, value: "수정자", format: { type: "label" } },
                            { name: "upd_usr", style: { colfloat: "float" }, format: { width: 50 } },
                            { name: "upd_dt", style: { colfloat: "floated" } },
                            { name: "cust_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "prod_key", hidden: true, editable: { type: "hidden" } },
                            { name: "prod_type", hidden: true },
                            { name: "pdate", hidden: true, editable: { type: "hidden" } }
                        ]
                    }//{
                    //    element: [
                    //        { header: true, value: "품질확인", format: { type: "label" } },
                    //        { name: "qstat" },
                    //        { header: true, value: "품질확인자", format: { type: "label" } },
                    //        { name: "qemp" },
                    //        { header: true, value: "품질확인일시", format: { type: "label" } },
                    //        { name: "qdate" }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_발생내역", query: "w_qcm2010_S_1", title: "발생 내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { master: true, multi: true, bind: "select", focus: "prod_type", validate: true },
            element: [
                { header: "순번", name: "issue_seq", width: 70, align: "center", editable: { type: "hidden" } },
                {
                    header: "Module", name: "prod_sub_nm", width: 100, align: "center", mask: "search",
                    editable: { type: "text", validate: { rule: "required", message: "Module" } }
                },
                {
                    header: "현상분류", name: "status_tp1_nm", width: 200, mask: "search",
                    editable: { type: "text", validate: { rule: "required", message: "현상분류" } }
                },
                {
                    header: "현상구분", name: "status_tp2_nm", width: 150/*, mask: "search",
                    editable: { type: "text", validate: { rule: "required", message: "부위구분" } }*/
                },
                {
                    header: "부위분류", name: "part_tp1_nm", width: 250/*, mask: "search",
                    editable: { type: "text", validate: { rule: "required", message: "부위분류" } }*/
                },
                {
                    header: "부위구분", name: "part_tp2", width: 150, mask: "search",
                    editable: { type: "text", validate: { rule: "required", message: "부위구분" }, readonly: false }
                },
                {
                    header: "부위구분", name: "part_tp2_nm", width: 200,
                    editable: { type: "hidden" }
                },
                { name: "issue_no", hidden: true, editable: { type: "hidden" } },
                { name: "prod_sub", hidden: true, editable: { type: "hidden" } },
                { name: "status_tp1", hidden: true, editable: { type: "hidden" } },
                { name: "status_tp2", hidden: true, editable: { type: "hidden" } },
                { name: "part_tp1", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_발생현상상세", query: "w_qcm2010_S_2", type: "TABLE", title: "발생 내용",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", /*focus: "rmk_text",*/ validate: true },
            content: {
                height: 25, width: { label: 80, field: 720 },
                row: [
                    {
                        element: [
                            { header: true, value: "발생내용", format: { type: "label" } },
                            {
                                name: "rmk_text", format: { type: "textarea", rows: 5, width: 734 },
                                editable: { type: "textarea", rows: 5, width: 734 }
                            },
                            { name: "rmk_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "issue_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_조치내역", query: "w_qcm2010_S_3", title: "조치 내역",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "work_dt", validate: true },
            element: [
                { header: "순번", name: "issue_seq", width: 35, align: "center", editable: { type: "hidden" } },
                { header: "조치일자", name: "work_dt", width: 92, align: "center", mask: "date-ymd", editable: { type: "text" } },
                {
                    header: "조치분류", name: "work_tp1", width: 200, align: "center",
                    format: { type: "select", data: { memory: "조치분류" } },
                    editable: {
                        type: "select",
                        data: { memory: "조치분류", by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }] },
                        change: [{ name: "work_tp2", memory: "조치구분", by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }, { key: "work_tp1" }] }]
                    }
                },
                {
                    header: "조치구분", name: "work_tp2", width: 70, align: "center",
                    format: { type: "select", data: { memory: "조치구분" } },
                    editable: {
                        type: "select",
                        data: { memory: "조치구분", by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }, { key: "work_tp1" }] }
                    }
                },
                { header: "작업시간", name: "work_time", width: 70, align: "center", editable: { type: "text" } },
                { header: "작업자1", name: "work_man1", width: 80, align: "center", editable: { type: "text" } },
                { header: "작업자2", name: "work_man2", width: 80, align: "center", editable: { type: "text" } },
                { header: "작업자3", name: "work_man3", width: 80, align: "center", editable: { type: "text" } },
                { header: "작업자4", name: "work_man4", width: 80, align: "center", editable: { type: "text" } },
                { header: "작업자5", name: "work_man5", width: 80, align: "center", editable: { type: "text" } },
                {
                    header: "상태", name: "pstat", width: 70, align: "center",
                    format: { type: "select", data: { memory: "조치상태" } },
                    editable: { type: "select", data: { memory: "조치상태" } }
                },
                { name: "prod_type", hidden: true },
                { name: "work_seq", hidden: true, editable: { type: "hidden" } },
                { name: "issue_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_조치내역상세", query: "w_qcm2010_S_4", type: "TABLE", title: "조치 내용",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", /*focus: "rmk_text",*/ validate: true },
            content: {
                height: 25, width: { label: 80, field: 720 },
                row: [
                    {
                        element: [
                            { header: true, value: "조치내용", format: { type: "label" } },
                            {
                                name: "rmk_text", format: { type: "textarea", rows: 5, width: 734 },
                                editable: { type: "textarea", rows: 5, width: 734 }
                            },
                            { name: "rmk_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "issue_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_교체PART", query: "w_qcm2010_S_5", title: "교체 PART",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "change_tp", validate: true },
            element: [
                { header: "순번", name: "issue_seq", width: 35, align: "center", editable: { type: "hidden" } },
                {
                    header: "교체분류", name: "change_div", width: 80, align: "center",
                    format: { type: "select", data: { memory: "교체분류" } },
                    editable: { type: "select", data: { memory: "교체분류" } }
                },
                {
                    header: "교체구분", name: "change_tp", width: 80, align: "center",
                    format: { type: "select", data: { memory: "교체구분" } },
                    editable: { type: "select", data: { memory: "교체구분" } }
                },
                {
                    header: "교체일자", name: "change_dt", width: 92, align: "center",
                    mask: "date-ymd", editable: { type: "text" }
                },
                { header: "수급시간", name: "change_time", width: 70, align: "center", editable: { type: "text" } },
                { header: "수량", name: "change_qty", width: 50, align: "center", mask: "numeric-int", editable: { type: "text" } },
                {
                    header: "원인부품", name: "apart_cd", width: 120, align: "center", mask: "search",
                    editable: { type: "text", readonly: false }
                },
                { header: "원인부품명", name: "apart_nm", width: 200, align: "left", editable: { type: "text" } },
                { header: "원인Part Ser.No.", name: "apart_sno", width: 150, align: "center", editable: { type: "text" } },
                {
                    header: "교체부품", name: "bpart_cd", width: 120, align: "center", mask: "search",
                    editable: { type: "text", readonly: false }
                },
                { header: "교체부품명", name: "bpart_nm", width: 200, align: "left", editable: { type: "text" } },
                { header: "교체Part Ser.No.", name: "bpart_sno", width: 150, align: "center", editable: { type: "text" } },
                { header: "유상(CS)", name: "charge_cs", width: 70, align: "center", editable: { type: "text" } },
                { header: "유상(영업)", name: "charge_yn", width: 70, align: "center", editable: { type: "text" } },
                { header: "상태", name: "pstat", width: 70, align: "center", editable: { type: "text" } },
                //{ name: "apart_key", hidden: true, editable: { type: "hidden" } },
                //{ name: "bpart_key", hidden: true, editable: { type: "hidden" } },
                //{ name: "apart_bom", hidden: true, editable: { type: "hidden" } },
                //{ name: "bpart_bom", hidden: true, editable: { type: "hidden" } },
                { name: "part_seq", hidden: true, editable: { type: "hidden" } },
                { name: "issue_no", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_교체내역상세", query: "w_qcm2010_S_6", type: "TABLE", title: "교체 내용",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", /*focus: "rmk_text",*/ validate: true },
            content: {
                width: { label: 80, field: 720 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "교체내용", format: { type: "label" } },
                            {
                                name: "rmk_text",
                                format: { type: "textarea", rows: 3, width: 734 },
                                editable: { type: "textarea", rows: 3, width: 734 }
                            },
                            { name: "rmk_cd", hidden: true, editable: { type: "hidden" } },
                            { name: "issue_no", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_처리결과", query: "w_qcm2010_S_0", type: "TABLE", title: "처리 결과",
            caption: true, show: false, selectable: true,
            content: {
                width: { label: 80, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "처리일자", format: { type: "label" } },
                            { name: "rslt_date", mask: "date-ymd" },
                            { header: true, value: "문제유형", format: { type: "label" } },
                            { name: "issue_cd" },
                            { header: true, value: "중점관리대상", format: { type: "label" } },
                            { name: "mng_yn", format: { type: "checkbox", title: "", value: "1", offval: "0" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리결과", format: { type: "label" } },
                            { name: "rslt_tp" },
                            { header: true, value: "발생구분", format: { type: "label" } },
                            { name: "reason_cd" },
                            { header: true, value: "관리구분", format: { type: "label" } },
                            { name: "mng_cd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "해당업체", format: { type: "label" } },
                            { name: "supp_nm" },
                            { header: true, value: "귀책구분", format: { type: "label" } },
                            { name: "duty_cd" },
                            { header: true, value: "반출일자", format: { type: "label" } },
                            { name: "mout_date", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리자", format: { type: "label" } },
                            { name: "rslt_emp" },
                            { header: true, value: "작성일시", format: { type: "label" } },
                            { name: "upd_dt" },
                            { header: true, value: "처리완료", format: { type: "label" } },
                            { name: "complete_yn", format: { type: "checkbox", title: "완료", value: "1" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개선대책<br>및<br>처리내역", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "rslt_rmk1",
                                format: { type: "textarea", rows: 5, width: 734 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "특이사항", format: { type: "label" } },
                            {
                                style: { colspan: 5 }, name: "rslt_rmk2",
                                format: { type: "textarea", rows: 5, width: 734 }
                            },
                            { name: "issue_no", value: "", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //2021-05-11 KYT
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "_download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 450, align: "left", editable: { type: "text" } },
                { header: "등록자", name: "ins_usr_nm", width: 80, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true, editable: { type: "hidden" } },
                //{ name: "data_subkey", hidden: true },
                //{ name: "data_subseq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } },
                { name: "ver_no", hidden: true, editable: { type: "hidden" } }



                //{ header: "파일명", name: "file_nm", width: 270, align: "left" },
                //{
                //    header: "다운로드", name: "download", width: 60, align: "center",
                //    format: { type: "link", value: "다운로드" }
                //},
                //{ header: "등록자", name: "upd_usr", width: 70, align: "center" },
                //{ header: "부서", name: "upd_dept", width: 80, align: "center" },
                //{ header: "설명", name: "file_desc", width: 330, align: "left", editable: { type: "text" } },
                //{ name: "file_path", hidden: true },
                //{ name: "file_id", hidden: true, editable: { type: "hidden" } },
                //{ name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_상세메모", query: "w_qcm2010_S_8", type: "TABLE", title: "상세 메모",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" }, height: 200,
                row: [
                    {
                        element: [
                            { name: "memo_text", format: { type: "html", height: 200 } },
                            { name: "issue_no", hidden: true, editable: { type: "hidden" } }
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
                { type: "FORM", id: "frmData_발생현상상세", offset: 8 },
                { type: "GRID", id: "grdData_조치내역", offset: 8 },
                { type: "FORM", id: "frmData_조치내역상세", offset: 8 },
                { type: "GRID", id: "grdData_교체PART", offset: 8 },
                { type: "FORM", id: "frmData_교체내역상세", offset: 8 },
                { type: "FORM", id: "frmData_처리결과", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 },
                { type: "FORM", id: "frmData_상세메모", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

        // lyrTab 미사용 by YHG (2021.04.05)    
        //=====================================================================================
        //var args = {
        //    tabid: "lyrTab",
        //    target: [{ type: "LAYER", id: "lyrData_등록", title: "발생 등록" }]
        //};
        ////----------
        //gw_com_module.convertTab(args);
        ////=====================================================================================
        //var args = {
        //    target: [{ type: "TAB", id: "lyrData_등록", offset: 8 }]
        //};
        ////----------
        //gw_com_module.objResize(args);
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
        var args = { targetid: "lyrMenu_1_1", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "출력", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "NCR", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1_1", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_1_2", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_4", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_4", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_5", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_5", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_5", element: "받기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_6", element: "편집", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_발생정보", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발생정보", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_발생정보", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_발생정보", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_발생정보", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_발생내역", grid: true, event: "rowselecting", handler: processRowselecting };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발생내역", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발생내역", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "grdData_발생내역", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_발생내역", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_교체PART", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_교체PART", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_발생현상상세", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_조치내역상세", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_조치내역상세", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_교체내역상세", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmData_교체내역상세", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_FileA", grid: true, element: "download", event: "click", handler: processItemclick };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        function processButton(param) {
            
            switch (param.element) {
                case "조회":
                    {
                        var args = {
                            target: [{ id: "frmOption", focus: true }]
                        };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "추가":
                    {
                        closeOption({});
                        if (param.object == "lyrMenu_1_1") {
                            v_global.process.handler = processInsert;
                            if (!checkUpdatable({})) return;
                            processInsert({});
                        } else if (param.object == "lyrMenu_2") {
                            if (!checkManipulate({})) return;
                            v_global.process.handler = processInsert;
                            if (!checkUpdatable({ sub: true })) return;
                            processInsert({ sub: true });
                        } else if (param.object == "lyrMenu_3") {
                            if (!checkManipulate({ sub: true })) return;
                            var args = {
                                targetid: "grdData_조치내역",
                                edit: true,
                                data: [
                                    { name: "issue_no", value: gw_com_api.getValue("grdData_발생내역", "selected", "issue_no", true) },
                                    { name: "issue_seq", value: gw_com_api.getValue("grdData_발생내역", "selected", "issue_seq", true) },
                                    { name: "work_dt", rule: "COPY", row: "prev" },
                                    { name: "work_tp1", rule: "COPY", row: "prev" },
                                    { name: "work_tp2", rule: "COPY", row: "prev" },
                                    { name: "work_time", rule: "COPY", row: "prev" },
                                    { name: "work_man1", rule: "COPY", row: "prev", value: gw_com_module.v_Session.USR_NM },
                                    { name: "work_man2", rule: "COPY", row: "prev" },
                                    { name: "work_man3", rule: "COPY", row: "prev" },
                                    { name: "work_man4", rule: "COPY", row: "prev" },
                                    { name: "work_man5", rule: "COPY", row: "prev" },
                                    { name: "pstat", rule: "COPY", row: "prev" }
                                ]
                            };
                            gw_com_module.gridInsert(args);
                            if (gw_com_api.getCRUD("frmData_조치내역상세") == "none") {
                                args = {
                                    targetid: "frmData_조치내역상세",
                                    edit: true,
                                    updatable: true,
                                    data: [
                                        { name: "rmk_cd", value: "WORK" }
                                    ]
                                };
                                gw_com_module.formInsert(args);
                            }
                        } else if (param.object == "lyrMenu_4") {
                            if (!checkManipulate({ sub: true })) return;
                            var args = {
                                targetid: "grdData_교체PART",
                                edit: true,
                                data: [
                                    { name: "issue_no", value: gw_com_api.getValue("grdData_발생내역", "selected", "issue_no", true) },
                                    { name: "issue_seq", value: gw_com_api.getValue("grdData_발생내역", "selected", "issue_seq", true) },
                                    { name: "change_tp", rule: "COPY", row: "prev" },
                                    { name: "change_dt", rule: "COPY", row: "prev" },
                                    { name: "change_time", rule: "COPY", row: "prev" },
                                    { name: "change_qty", rule: "COPY", row: "prev" },
                                    { name: "apart_cd", rule: "COPY", row: "prev" },
                                    { name: "apart_nm", rule: "COPY", row: "prev" },
                                    { name: "apart_sno", rule: "COPY", row: "prev" },
                                    { name: "bpart_cd", rule: "COPY", row: "prev" },
                                    { name: "bpart_nm", rule: "COPY", row: "prev" },
                                    { name: "bpart_sno", rule: "COPY", row: "prev" },
                                    { name: "charge_cs", rule: "COPY", row: "prev" },
                                    { name: "charge_yn", rule: "COPY", row: "prev" },
                                    { name: "pstat", rule: "COPY", row: "prev" }
                                ]
                            };
                            gw_com_module.gridInsert(args);
                            if (gw_com_api.getCRUD("frmData_교체내역상세") == "none") {
                                args = {
                                    targetid: "frmData_교체내역상세",
                                    edit: true,
                                    updatable: true,
                                    data: [
                                        { name: "rmk_cd", value: "PART" }
                                    ]
                                };
                                gw_com_module.formInsert(args);
                            }
                            //2021-05-11 KYT
                        } else if (param.object == "lyrMenu_5") {


                            //if (!checkManipulate({})) return;
                            //if (!checkUpdatable({ check: true })) return false;
                            //var args = {
                            //    type: "PAGE",
                            //    page: "w_upload_asissue",
                            //    title: "파일 업로드",
                            //    width: 650,
                            //    height: 200,
                            //    locate: ["center", 910],
                            //    open: true
                            //};
                            //if (gw_com_module.dialoguePrepare(args) == false) {
                            //    var args = {
                            //        page: "w_upload_asissue",
                            //        param: {
                            //            ID: gw_com_api.v_Stream.msg_upload_ASISSUE,
                            //            data: {
                            //                user: gw_com_module.v_Session.USR_ID,
                            //                key: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true),
                            //                seq: 0
                            //            }
                            //        }
                            //    };
                            //    gw_com_module.dialogueOpen(args);
                            //}

                            //-> dialogueOpen -> DLG.ready() -> this.msg_openedDialogue -> DLG.msg_openedDialogue
                            //-> DLG.closed -> this.msg_closeDialogue -> this.processRetrieve

                            // Check Updatable
                            if (!checkManipulate({})) return;
                            if (!checkUpdatable({ check: true })) return false;

                            // set data for "File Upload"
                            var dataType = "";    // Set File Data Type
                            var dataKey = gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true);   // Main Key value for Search
                            var dataSeq = gw_com_api.getValue("grdData_발생정보", "selected", "0");   // Main Seq value for Search

                            // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
                            v_global.event.data = { data_key: dataKey, data_seq: dataSeq, user: gw_com_module.v_Session.USR_ID }; // additional data = { data_subkey: "", data_subseq:-1 }

                            // set Argument for Dialogue
                            var pageArgs =":multi"; // 1.DataType, 2.파일선택 방식(multi/single)
                            var args = {
                                type: "PAGE", open: true, locate: ["center", 100],
                                width: 660, height: 200, scroll: true,  // multi( h:350, scroll) / single(h:300)
                                page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
                                data: v_global.event.data  // reOpen 을 위한 Parameter
                            };

                            // Open dialogue
                            gw_com_module.dialogueOpenJJ(args);
                        }
                    }
                    break;
                case "삭제":
                    {
                        closeOption({});
                        if (param.object == "lyrMenu_1_1") {
                            if (!checkManipulate({})) return;
                            v_global.process.handler = processRemove;
                            checkRemovable({});
                        } else if (param.object == "lyrMenu_2") {
                            if (!checkManipulate({})) return;
                            if (gw_com_api.getRowCount("grdData_발생내역") < 2) {
                                gw_com_api.messageBox([
                                    { text: "발생 내역은 최소 한 건은 입력되어야 합니다." }
                                ]);
                                return false;
                            }
                            v_global.process.handler = processRemove;
                            checkRemovable({ sub: true });
                        } else if (param.object == "lyrMenu_3") {
                            if (!checkManipulate({ sub: true })) return;
                            var args = {
                                targetid: "grdData_조치내역",
                                row: "selected"
                            }
                            gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_4") {
                            if (!checkManipulate({ sub: true })) return;
                            var args = {
                                targetid: "grdData_교체PART",
                                row: "selected"
                            }
                            gw_com_module.gridDelete(args);
                        } else if (param.object == "lyrMenu_5") {
                            if (!checkManipulate({})) return;
                            //2021-05-12 KYT
                            var args = {
                                targetid: "grdData_FileA",
                                row: "selected"
                            }
                            gw_com_module.gridDelete(args);
                        }
                    }
                    break;
                case "저장":
                    {
                        closeOption({});
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        closeOption({});
                        checkClosable({});
                    }
                    break;
                case "출력":
                    {
                        closeOption({});
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;
                        if (!checkExportable({})) return;
                        processExport();
                    }
                    break;
                case "NCR":
                    {
                        closeOption({});
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;
                        var sNcrStat = gw_com_api.getValue("grdData_발생정보", "selected", "ncr_stat", true);
                        if (sNcrStat != "발생") {
                            gw_com_api.messageBox([{ text: "이미 NCR 접수가 진행 중인 건입니다." }], 300);
                            return;
                        }

                        var args = {
                            url: "COM", procedure: "PROC_NCR_CreateFromIssue", nomessage: true,
                            input: [
                                { name: "IssueNo", value: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true) },
                                { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                                { name: "UserDept", value: gw_com_module.v_Session.DEPT_CD, type: "varchar" }
                            ]
                        };
                        gw_com_module.callProcedure(args);
                        gw_com_api.showMessage("NCR 접수 완료!", "success")
                    }
                    break;
                case "편집":
                    {
                        closeOption({});
                        if (!checkManipulate({})) return;
                        if (!checkUpdatable({ check: true })) return false;
                        var args = {
                            type: "PAGE",
                            page: "w_edit_asissue",
                            title: "상세 메모",
                            width: 700,
                            height: 600,
                            locate: ["center", "bottom"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_edit_asissue",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_edit_ASISSUE,
                                    data: {
                                        issue_no: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true)
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "실행":
                    {
                        v_global.process.handler = processRetrieve;
                        if (!checkUpdatable({})) return false;
                        processRetrieve({});
                    }
                    break;
                case "취소":
                    {
                        closeOption({});
                    }
                    break;
                case "받기":
                    {

                        var args = {
                            source: { id: "grdData_FileA", row: ui.row },
                            targetid: "lyrDown"
                        };
                        //gw_com_module.downloadFile(args);
                        //if (!checkManipulate({})) return;
                        //if (gw_com_api.getRowCount("grdData_FileA") == 0) {
                        //    gw_com_api.messageBox([{ text: "파일이 없습니다." }]);
                        //    return;
                        //}
                        //var args = {
                        //    url: gw_com_module.v_Current.window + ".aspx/download",
                        //    query: $("#grdData_FileA_data").attr("query"),
                        //    source: {
                        //        type: "INLINE", json: true,
                        //        argument: [
                        //            { name: "data_key", value: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true) }
                        //        ]
                        //    },
                        //    option: [
                        //        { name: "PAGE", value: gw_com_module.v_Current.window },
                        //        { name: "USER", value: gw_com_module.v_Session.USR_ID }
                        //    ],
                        //    target: { type: "FILE", id: "lyrDown", name: "다운로드" }
                        //};
                        //gw_com_module.objExport(args);
                    }
                    break;
            }

        }
        //----------
        function processRowselecting(param) {

            if (param.object == "grdData_발생정보") {
                v_global.process.handler = processSelect;
                v_global.process.current.master = param.row;
                return checkUpdatable({});
            } else if (param.object == "grdData_발생내역") {
                v_global.process.handler = processSelect;
                v_global.process.current.sub = param.row;
                return checkUpdatable({ sub: true });
            }

        }
        //----------
        function processRowselected(param) {

            if (param.object == "grdData_발생정보") {
                v_global.process.prev.master = param.row;
                processLink({ master: true });
            } else if (param.object == "grdData_발생내역") {
                v_global.process.prev.sub = param.row;
                processLink({ sub: true });
            }

        }

        //----------
        function processItemclick(param) {

            if (param.object == "frmData_조치내역상세") {
                if (gw_com_api.getCRUD("frmData_조치내역상세") == "none") {
                    gw_com_api.messageBox([
                        { text: "조치 내용은 조치 내역을 먼저 추가한 후에" },
                        { text: "입력할 수 있습니다." }
                    ]);
                }
                return true;
            } else if (param.object == "frmData_교체내역상세") {
                if (gw_com_api.getCRUD("frmData_교체내역상세") == "none") {
                    gw_com_api.messageBox([
                        { text: "교체 내용은 교체 PART를 먼저 추가한 후에" },
                        { text: "입력할 수 있습니다." }
                    ]);
                }
                return true;
            } else if (param.object == "grdData_FileA") {
                var args = { source: { id: param.object, row: param.row }, targetid: "lyrDown" };
                gw_com_module.downloadFile(args);
            }

        }
        //----------
        function processItemdblclick(param) {

            v_global.event.type = param.type;
            v_global.event.object = param.object;
            v_global.event.row = param.row;
            v_global.event.element = param.element;
            if (param.object == "frmData_발생정보") {

                switch (param.element) {
                    case "cust_nm":
                        {
                            var args = {
                                type: "PAGE", page: "w_find_prod_qcm", title: "장비 검색",
                                width: 800, height: 480, locate: ["center", "top"], open: true
                            };
                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "w_find_prod_qcm",
                                    param: {
                                        ID: gw_com_api.v_Stream.msg_selectProduct_QCM
                                    }
                                };
                                gw_com_module.dialogueOpen(args);
                            }
                        }
                        break;
                    case "qc_supp_nm":
                        {
                            processPopup(param);
                        }
                        break;
                }

            } else if (param.object == "grdData_발생내역") {

                switch (param.element) {
                    case "prod_sub_nm":
                    case "part_tp1_nm":
                    case "status_tp1_nm":
                    case "status_tp2_nm":
                    case "part_tp2":
                        {
                            processPopup(param);
                        }
                        break;
                }

            } else if (param.object == "frmData_발생현상상세" || param.object == "frmData_조치내역상세" || param.object == "frmData_교체내역상세") {

                switch (param.element) {
                    case "rmk_text":
                        {
                            v_global.logic.memo = (param.object == "frmData_발생현상상세" ? "발생 내용" : (param.object == "frmData_조치내역상세" ? "조치 내용" : "교체 내용"));
                            processMemo(param);
                        }
                        break;
                }

            } else if (param.object == "grdData_교체PART") {

                switch (param.element) {
                    case "apart_cd":
                    case "bpart_cd":
                        {
                            var args = {
                                type: "PAGE", page: "w_find_part_qcm", title: "부품 검색",
                                width: 800, height: 460, open: true
                            };
                            if (gw_com_module.dialoguePrepare(args) == false) {
                                var args = {
                                    page: "w_find_part_qcm",
                                    param: {
                                        ID: gw_com_api.v_Stream.msg_selectPart_QCM
                                    }
                                };
                                gw_com_module.dialogueOpen(args);
                            }
                        }
                        break;
                }

            }

        }
        //----------
        function processItemchanged(param) {

            if (param.object == "frmData_발생정보") {

                switch (param.element) {
                    case "issue_tp":
                    //case "prod_sub":
                        {
                            //var ids = gw_com_api.getRowIDs("grdData_발생내역");
                            //$.each(ids, function () {
                            //    gw_com_api.setValue("grdData_발생내역", this, param.element, param.value.current, true);
                            //});
                            if (param.value.current != "수입") {
                                gw_com_api.setValue(param.object, param.row, "qc_supp", "");
                                gw_com_api.setValue(param.object, param.row, "qc_supp_nm", "");
                                gw_com_api.setValue(param.object, param.row, "qc_tp", "");
                                gw_com_api.setValue(param.object, param.row, "qc_qty", "0");
                                gw_com_api.setValue(param.object, param.row, "duty_tp", "");
                            }
                        }
                        break;
                }
                return true;

            } else if (param.object == "grdData_발생내역") {

                switch (param.element) {
                    case "part_tp2":
                        {
                            if (param.value.current == "") {
                                gw_com_api.setValue(param.object, param.row, param.element + "_nm", "", (param.type == "GRID"), true, false);
                            } else {
                                var args = param;
                                args.prod_key = gw_com_api.getValue("frmData_발생정보", 1, "prod_key");
                                args.part_cd = param.value.current;
                                setItemInfo(args);
                            }
                        }
                        break;
                }

            }

        }
        //----------

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
//2021-05-11 KYT
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ASISSUE" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: param.data_key == undefined ? "%" : param.data_key },
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//----------
function checkCRUD(param) {

    return (param.sub)
            ? gw_com_api.getCRUD("grdData_발생내역", "selected", true)
            : gw_com_api.getCRUD("frmData_발생정보");

}
//----------
function checkManipulate(param) {

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

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_발생정보" },
            { type: "GRID", id: "grdData_발생내역" },
            { type: "FORM", id: "frmData_발생현상상세" },
            { type: "GRID", id: "grdData_조치내역" },
            { type: "FORM", id: "frmData_조치내역상세" },
            { type: "GRID", id: "grdData_교체PART" },
            { type: "FORM", id: "frmData_교체내역상세" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_상세메모" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create") {
        (param.sub) ? processDelete(param) : processClear({});
    }
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------
function checkExportable(param) {

    return true;

}
//----------

// lyrTab 미사용 by YHG (2021.04.05) 
//function checkClosable(param) {

//    gw_com_api.selectTab("lyrTab", 1)

//    v_global.process.handler = processClose;

//    if (!checkUpdatable({})) return;

//    processClose({});

//}
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
            if (this.QUERY == "w_qcm2010_M_2")
                this.QUERY = "w_qcm2010_M_1";
        });
    }
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "issue_tp" }] },
                { element: [{ name: "prod_type" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_prod_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_발생정보", select: true }
        ],
        clear: [
            { type: "FORM", id: "frmData_발생정보" },
            { type: "GRID", id: "grdData_발생내역" },
            { type: "FORM", id: "frmData_발생현상상세" },
            { type: "GRID", id: "grdData_조치내역" },
            { type: "FORM", id: "frmData_조치내역상세" },
            { type: "GRID", id: "grdData_교체PART" },
            { type: "FORM", id: "frmData_교체내역상세" },
            { type: "FORM", id: "frmData_처리결과" },
            { type: "GRID", id: "grdData_FileA" },
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
                { type: "GRID", id: "grdData_교체PART" }
            ],
            key: param.key
        };
    }
    else if (param.master) {
        args = {
            source: {
                type: "GRID", id: "grdData_발생정보", row: "selected", block: true,
                element: [
                    { name: "issue_no", argument: "arg_issue_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_발생정보" }
            ],
            key: param.key,
            handler: {
                complete: processLink,
                param: {}
            }
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
                { type: "FORM", id: "frmData_발생정보" },
                { type: "GRID", id: "grdData_발생내역", select: true },
                { type: "FORM", id: "frmData_발생현상상세" },
                { type: "FORM", id: "frmData_조치내역상세", clear: true, edit: true },
                { type: "FORM", id: "frmData_교체내역상세", clear: true, edit: true },
                { type: "FORM", id: "frmData_처리결과" },
                /*{ type: "GRID", id: "grdData_FileA" },*/
                { type: "FORM", id: "frmData_상세메모" }
            ],
            clear: [
                { type: "FORM", id: "frmData_발생현상상세" },
                { type: "GRID", id: "grdData_조치내역" },
                { type: "FORM", id: "frmData_조치내역상세" },
                { type: "GRID", id: "grdData_교체PART" },
                { type: "FORM", id: "frmData_교체내역상세" },
                { type: "FORM", id: "frmData_처리결과" },
                { type: "GRID", id: "grdData_FileA" },
                { type: "FORM", id: "frmData_상세메모" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);
    processFileList({
        data_key: gw_com_api.getValue("frmData_발생정보", "selected", "issue_no")
    });

}
//----------
function processSelect(param) {

    (param.sub)
        ? gw_com_api.selectRow("grdData_발생내역", v_global.process.current.sub, true, false)
        : gw_com_api.selectRow("grdData_발생정보", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    if (param.sub) {
        var args = {
            targetid: "grdData_발생내역", edit: true, updatable: true,
            data: [
                { name: "issue_no", value: gw_com_api.getValue("frmData_발생정보", 1, "issue_no") },
                { name: "issue_seq", rule: "INCREMENT", value: 1 },
                { name: "issue_tp", value: gw_com_api.getValue("frmData_발생정보", 1, "issue_tp") },
                //{ name: "prod_type", rule: "COPY", row: "prev" },
                { name: "prod_sub", rule: "COPY", row: "prev", value: gw_com_api.getValue("frmData_발생정보", 1, "prod_sub") },
                { name: "prod_sub_nm", rule: "COPY", row: "prev", value: gw_com_api.getText("frmData_발생정보", 1, "prod_sub") },
                { name: "status_tp1", rule: "COPY", row: "prev" },
                { name: "status_tp1_nm", rule: "COPY", row: "prev" },
                { name: "status_tp2", rule: "COPY", row: "prev" },
                { name: "status_tp2_nm", rule: "COPY", row: "prev" },
                { name: "part_tp1", rule: "COPY", row: "prev" },
                { name: "part_tp1_nm", rule: "COPY", row: "prev" },
                { name: "part_tp2", rule: "COPY", row: "prev" },
                { name: "part_tp2_nm", rule: "COPY", row: "prev" }
            ],
            clear: [
                { type: "GRID", id: "grdData_조치내역" },
                { type: "GRID", id: "grdData_교체PART" }
            ]
        };
        gw_com_module.gridInsert(args);
    }
    else {
        gw_com_api.selectRow("grdData_발생정보", "reset");
        var args = {
            targetid: "frmData_발생정보", edit: true, updatable: true,
            data: [
                { name: "issue_dt", value: gw_com_api.getDate() }
            ],
            clear: [
                { type: "GRID", id: "grdData_발생내역" },
                { type: "GRID", id: "grdData_조치내역" },
                { type: "GRID", id: "grdData_교체PART" },
                { type: "GRID", id: "grdData_FileA" }
            ]
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "grdData_발생내역",
            edit: true,
            updatable: true,
            data: [
                { name: "issue_seq", rule: "INCREMENT", value: 1 }//,
                //{ name: "status_tp1", value: "00" },
                //{ name: "status_tp2", value: "00" },
                //{ name: "part_tp1", value: "00" },
                //{ name: "part_tp2", value: "00" }
            ]
        };
        gw_com_module.gridInsert(args);
        var args = {
            targetid: "frmData_발생현상상세",
            edit: true,
            updatable: true,
            data: [
                { name: "rmk_cd", value: "STATUS" }
            ]
        };
        gw_com_module.formInsert(args);
        /*
        var args = {
            targetid: "frmData_조치내역상세",
            edit: true,
            updatable: true,
            data: [
                { name: "rmk_cd", value: "WORK" }
            ]
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_교체내역상세",
            edit: true,
            updatable: true,
            data: [
                { name: "rmk_cd", value: "PART" }
            ]
        };
        gw_com_module.formInsert(args);
        */
        var args = {
            targetid: "frmData_상세메모",
            edit: true,
            updatable: true
        };
        gw_com_module.formInsert(args);

        v_global.event.type = "FORM";
        v_global.event.object = "frmData_발생정보";
        v_global.event.row = 1;
        v_global.event.element = "issue_tp";
        var args = {
            type: "PAGE",
            page: "w_find_prod_qcm",
            title: "장비 검색",
            width: 800,
            height: 460,
            locate: ["center", "top"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_prod_qcm",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectProduct_QCM
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
            targetid: "grdData_발생내역", row: "selected", remove: true,
            clear: [
                { type: "GRID", id: "grdData_조치내역" },
                { type: "GRID", id: "grdData_교체PART" }
            ]
        };
        gw_com_module.gridDelete(args);
    }
    else {
        var args = {
            targetid: "grdData_발생정보", row: "selected",
            clear: [
                { type: "FORM", id: "frmData_발생정보" },
                { type: "GRID", id: "grdData_발생내역" },
                { type: "FORM", id: "frmData_발생현상상세" },
                { type: "GRID", id: "grdData_조치내역" },
                { type: "FORM", id: "frmData_조치내역상세" },
                { type: "GRID", id: "grdData_교체PART" },
                { type: "FORM", id: "frmData_교체내역상세" },
                { type: "FORM", id: "frmData_처리결과" },
                { type: "GRID", id: "grdData_FileA" },
                { type: "FORM", id: "frmData_상세메모" }
            ]
        };
        gw_com_module.gridDelete(args);
    }

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args = {
        type: "PAGE", page: "w_edit_memo", title: "상세 내용",
        width: 790, height: 585, open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_edit_memo",
            param: {
                ID: gw_com_api.v_Stream.msg_edit_Memo,
                data: {
                    edit: true,
                    title: v_global.logic.memo,
                    text: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_발생정보" },
            { type: "GRID", id: "grdData_발생내역" },
            { type: "FORM", id: "frmData_발생현상상세" },
            { type: "GRID", id: "grdData_조치내역" },
            { type: "FORM", id: "frmData_조치내역상세" },
            { type: "GRID", id: "grdData_교체PART" },
            { type: "FORM", id: "frmData_교체내역상세" },
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_상세메모" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var issue_no = gw_com_api.getValue("frmData_발생정보", 1, "issue_no");
    var crud = gw_com_api.getCRUD("frmData_발생정보");
    if (crud == "create" || crud == "update") {
        // 확장필드 저장
        var fields = ["qc_supp", "qc_tp", "qc_qty", "duty_tp"];
        $.each(fields, function () {
            var curd = (gw_com_api.getValue("frmData_발생정보", 1, this + "_crud") == "U" ? "U" : "C");
            var txt = gw_com_api.getValue("frmData_발생정보", 1, this);

            if (args.param == undefined)
                args.param = [{
                    query: "w_qcm2010_ext",
                    row: []
                }];
            args.param[0].row.push({
                crud: curd,
                column: [
                    { name: "issue_no", value: issue_no },
                    { name: "field_cd", value: this.toUpperCase() },
                    { name: "txt", value: txt }
                ]
            })
        });
    }

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {};
    if (param.sub) {
        args = {
            target: [
                {
                    type: "GRID", id: "grdData_발생내역",
                    key: [{ row: "selected", element: [{ name: "issue_no" }, { name: "issue_seq" }] }]
                }
            ]
        };
    }
    else {
        args = {
            target: [
                {
                    type: "GRID", id: "grdData_발생정보",
                    key: [{ row: "selected", element: [{ name: "issue_no" }] }]
                }
            ]
        };
    }
    args.handler = {
        success: successRemove,
        param: param
    };
    gw_com_module.objRemove(args);

}
//----------
function processExport() {

    var args = {
        page: "EHM_2010",
        source: {
            type: "GRID", id: "grdData_발생정보", row: "selected", json: true,
            element: [
                { name: "issue_no", argument: "arg_key_no" }
            ]
        },
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: "EHM_2010" },    //gw_com_module.v_Current.window
            { name: "FORM", value: "QMS_IssueReport" },
            { name: "OPTIONS", value: "QDM" }
        ],
        target: { type: "FILE", id: "lyrDown", name: "문제발생 보고서" },
        handler: { success: successExport }
    };
    gw_com_module.objExport(args);

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
            { type: "FORM", id: "frmData_발생현상상세" },
            { type: "GRID", id: "grdData_조치내역" },
            { type: "FORM", id: "frmData_조치내역상세" },
            { type: "GRID", id: "grdData_교체PART" },
            { type: "FORM", id: "frmData_교체내역상세" },
            { type: "FORM", id: "frmData_처리결과" },
            { type: "GRID", id: "grdData_FileA" },
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

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({ key: response });
    else {
        status = checkCRUD({ sub: true });
        if (status == "create" || status == "update"
            || gw_com_api.getUpdatable("frmData_발생현상상세")
            || gw_com_api.getUpdatable("frmData_조치내역상세")
            || gw_com_api.getUpdatable("frmData_교체내역상세")
            || gw_com_api.getUpdatable("grdData_FileA", true)
            || gw_com_api.getUpdatable("frmData_상세메모"))
            processLink({ key: response });
        else
            processLink({ sub: true, key: response });
    }

}
//----------
function successRemove(response, param) {

    processDelete(param);

}
//----------
function successExport(response, param) {

}
//----------
function setItemInfo(param) {

    var args = {
        request: "PAGE",
        name: "w_qcm2010_2_1",
        async: false,
        param: param,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=w_qcm2010_2_1" +
                "&QRY_COLS=part_cd,part_nm,part_spec" +
                "&CRUD=R" +
                "&arg_prod_key=" + param.prod_key + "&arg_part_cd=" + param.part_cd + "&arg_part_nm=&arg_part_spec=",
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        if (data.length == 1) {
            gw_com_api.setValue(param.object, param.row, "part_tp2_nm", data[0].DATA[1], (param.type == "GRID"), true, false);
        } else {
            gw_com_api.setValue(param.object, param.row, "part_tp2_nm", "", (param.type == "GRID"), true, false);
            processPopup(param);
        }
    }

}
//----------
function processPopup(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    switch (param.element) {
        case "prod_sub_nm":
        case "part_tp1_nm":
        case "status_tp1_nm":
        case "status_tp2_nm":
            {
                v_global.event.code1 = (param.element == "status_tp1_nm" || param.element == "status_tp2_nm" ? "status_tp1" : "prod_sub");
                v_global.event.name1 = v_global.event.code1 + "_nm";
                v_global.event.code2 = (param.element == "status_tp1_nm" || param.element == "status_tp2_nm" ? "status_tp2" : "part_tp1");
                v_global.event.name2 = v_global.event.code2 + "_nm";
                v_global.event.data = {
                    prod_type: gw_com_api.getValue("frmData_발생정보", 1, "prod_type"),
                    code1: (v_global.event.code1 == "status_tp1" ? "IQDM21" : "IQDM22"),
                    code2: (v_global.event.code1 == "status_tp1" ? "IQDM31" : "IQDM32"),
                    caption1: (v_global.event.code1 == "status_tp1" ? "◈ 현상분류" : "◈ Module"),
                    caption2: (v_global.event.code1 == "status_tp1" ? "◈ 현상구분" : "◈ 부위분류")
                }
                var args = {
                    page: "w_qcm2010_1",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "part_tp2":
            {
                v_global.event.data = {
                    prod_key: gw_com_api.getValue("frmData_발생정보", 1, "prod_key"),
                    part_cd: gw_com_api.getValue(param.object, param.row, param.element, (param.type == "GRID"))
                };
                var args = {
                    page: "w_qcm2010_2",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: v_global.event.data
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
        case "qc_supp_nm":
            {
                v_global.event.supp_cd = "qc_supp";
                v_global.event.supp_nm = "qc_supp_nm";
                var args = {
                    page: "DLG_SUPPLIER",
                    param: {
                        ID: gw_com_api.v_Stream.msg_selectSupplier
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
            break;
    }


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
                                if (param.data.arg.sub) {
                                    var status = checkCRUD({});
                                    if (status == "initialize" || status == "create")
                                        processClear({});
                                    else if (status == "update"
                                        || gw_com_api.getUpdatable("frmData_발생현상상세")
                                        || gw_com_api.getUpdatable("frmData_조치내역상세")
                                        || gw_com_api.getUpdatable("frmData_교체내역상세")
                                        || gw_com_api.getUpdatable("grdData_FileA", true)
                                        || gw_com_api.getUpdatable("frmData_상세메모"))
                                        processLink({ master: true });
                                    else {
                                        var status = checkCRUD(param.data.arg);
                                        if (status == "initialize" || status == "create")
                                            processDelete(param.data.arg);
                                        else if (status == "update")
                                            processRestore(param.data.arg);
                                        if (v_global.process.handler != null)
                                            v_global.process.handler(param.data.arg);
                                    }
                                }
                                else
                                    if (v_global.process.handler != null)
                                        v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove(param.data.arg);
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
        case gw_com_api.v_Stream.msg_selectedProduct_QCM:
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
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "cust_proc",
                                    param.data.cust_proc,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "cust_prod_nm",
                                    param.data.cust_prod_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "proj_no",
                                    param.data.proj_no,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "prod_key",
                                    param.data.prod_key,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "prod_type",
                                    param.data.prod_type,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "prod_nm",
                                    param.data.prod_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
                var ids = gw_com_api.getRowIDs("grdData_발생내역");
                $.each(ids, function () {
                    gw_com_api.setValue("grdData_발생내역",
                                        this,
                                        "prod_type",
                                        param.data.prod_type,
                                        true);
                    //gw_com_api.filterSelect("grdData_발생내역", this, "prod_sub",
                    //                        { memory: "모듈2", by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }] },
                    //                        true);
                    //gw_com_api.filterSelect("grdData_발생내역", this, "status_tp1",
                    //                        { memory: "현상분류", by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }] },
                    //                        true);
                    //gw_com_api.filterSelect("grdData_발생내역", this, "part_tp1",
                    //                        { memory: "부위분류", by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }] },
                    //                        true);
                });
                var ids = gw_com_api.getRowIDs("grdData_조치내역");
                $.each(ids, function () {
                    gw_com_api.filterSelect("grdData_조치내역", this, "work_tp1",
                                            { memory: "조치분류", by: [{ source: { id: "frmData_발생정보", row: 1, key: "prod_type" } }] },
                                            true);
                });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_QCM:
            {
                if (v_global.event.element == "apart_cd") {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "apart_cd",
                                        param.data.part_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "apart_nm",
                                        param.data.part_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    if (gw_com_api.getValue(v_global.event.object,
                                            v_global.event.row,
                                            "bpart_cd",
                                            (v_global.event.type == "GRID") ? true : false) == "") {
                        gw_com_api.setValue(v_global.event.object,
                                            v_global.event.row,
                                            "bpart_cd",
                                            param.data.part_cd,
                                            (v_global.event.type == "GRID") ? true : false);
                        gw_com_api.setValue(v_global.event.object,
                                            v_global.event.row,
                                            "bpart_nm",
                                            param.data.part_nm,
                                            (v_global.event.type == "GRID") ? true : false);
                    }
                }
                else if (v_global.event.element == "bpart_cd") {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "bpart_cd",
                                        param.data.part_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "bpart_nm",
                                        param.data.part_nm,
                                        (v_global.event.type == "GRID") ? true : false,
                                        true);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                if (param.data.update)
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
                                        param.data.text);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_ASISSUE:
            {
                gw_com_api.setValue("frmData_상세메모",
                                    1,
                                    "memo_text",
                                    param.data.html);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASISSUE:
            {
                var args = {
                    source: {
                        type: "GRID", id: "grdData_발생정보", row: "selected",
                        element: [
                            { name: "issue_no", argument: "arg_issue_no" }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_FileA", select: true }
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
                    case "w_find_prod_qcm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProduct_QCM;
                        }
                        break;
                    case "w_find_part_qcm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_QCM;
                        }
                        break;
                    case "w_edit_memo":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_Memo;
                            args.data = {
                                edit: true,
                                title: v_global.logic.memo,
                                text: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                            };
                        }
                        break;
                    //2021-05-11 KYT
                    case "SYS_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true),
                                seq: 0
                            };
                        }
                        break;
                    case "w_edit_asissue":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_ASISSUE;
                            args.data = {
                                issue_no: gw_com_api.getValue("grdData_발생정보", "selected", "issue_no", true)
                            };
                        }
                        break;
                    case "w_qcm2010_1":
                        {
                            args.ID = param.ID;
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
                switch (param.from.page) {
                    // 2021-05-11 KYT msg_uploaded_ASISSUE 대체를 위한 추가
                    case "SYS_FileUpload": {
                        {
                            processFileList({
                                data_key: gw_com_api.getValue("frmData_발생정보", "selected", "issue_no")
                            });
                        }
                        break;
                    }
                    case "w_qcm2010_1":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code1, param.data.code1, (v_global.event.type == "GRID"));
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name1, param.data.name1, (v_global.event.type == "GRID"));
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.code2, param.data.code2, (v_global.event.type == "GRID"));
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.name2, param.data.name2, (v_global.event.type == "GRID"));
                            }
                        }
                        break;
                    case "w_qcm2010_2":
                        {
                            if (param.data != undefined) {
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_tp2", param.data.part_cd, (v_global.event.type == "GRID"), false, false);
                                gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_tp2_nm", param.data.part_nm, (v_global.event.type == "GRID"), true, false);
                            } else {
                                if (gw_com_api.getValue(v_global.event.object, v_global.event.row, "part_tp2_nm", (v_global.event.type == "GRID")) == "") {
                                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "part_tp2", "", (v_global.event.type == "GRID"), false, false);
                                }
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.supp_cd,
                                    param.data.supp_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.supp_nm,
                                    param.data.supp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//