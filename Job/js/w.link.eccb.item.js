//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
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

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        start();

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
                { name: "조회", value: "새로고침", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: false, border: false, align: "left",
            editable: { validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ecr_no", label: { title: "ECR No. :" },
                                editable: { type: "text", size: 12, readonly: true }
                            },
                            {
                                name: "cip_no", label: { title: "CIP No. :" },
                                editable: { type: "text", size: 12, readonly: true }
                            },
                            {
                                name: "eco_no", label: { title: "ECO No. :" },
                                editable: { type: "text", size: 12, readonly: true }
                            },
                            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_ECR_NO", type: "FREE", title: "ECR No.",
            trans: true, show: true, border: false, align: "left",
            editable: { validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ecr_no", label: { title: "ECR No. :" },
                                editable: { type: "text", size: 12, readonly: true }
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
            targetid: "frmOption_CIP_NO", type: "FREE", title: "CIP No.",
            trans: true, show: false, border: false, align: "left",
            editable: { validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "cip_no", label: { title: "CIP No. :" },
                                editable: { type: "text", size: 12, readonly: true }
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
            targetid: "frmOption_ECO_NO", type: "FREE", title: "ECO No.",
            trans: true, show: false, border: false, align: "left",
            editable: { validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "eco_no", label: { title: "ECO No. :" },
                                editable: { type: "text", size: 12, readonly: true }
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
            targetid: "frmData_내역_1", query: "w_link_eccb_item_M_1", type: "TABLE", title: "제안 내역",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 95, field: 191 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "ECR No.", format: { type: "label" } },
                            { name: "ecr_no" },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "issue_no" },
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개선제안명", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "ecr_title", format: { width: 800 } },
                            { header: true, value: "구분", format: { type: "label" } },
                            { name: "ecr_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제안개요", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "ecr_desc", format: { width: 800 } },
                            { header: true, value: "Level", format: { type: "label" } },
                            { name: "crm_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용요구시점", format: { type: "label" } },
                            { name: "act_time_text", width: 200 },
                            { header: true, value: "E/D/SCCB", format: { type: "label" } },
                            { name: "eccb_tp_nm", width: 200 },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            { style: { colfloat: "float" }, name: "ecr_emp_nm", format: { type: "text", width: 60 } },
                            { style: { colfloat: "floated" }, name: "ecr_dept_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "CRM부서", format: { type: "label" } },
                            { name: "rqst_dept_nm", width: 200 },
                            { header: true, value: "설비유형", format: { type: "label" } },
                            { name: "prod_tp_text", width: 200 },
                            { header: true, value: "작성일자", format: { type: "label" } },
                            { name: "ecr_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { style: { rowspan: 3 }, header: true, value: "분류", format: { type: "label" } },
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region1_text" },
                            { style: { colfloat: "floating" }, name: "act_module1_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class1_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region2_text" },
                            { style: { colfloat: "floating" }, name: "act_module2_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class2_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region3_text" },
                            { style: { colfloat: "floating" }, name: "act_module3_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class3_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "승인상태", format: { type: "label" } },
                            { name: "gw_astat_nm" },
                            { header: true, value: "승인자", format: { type: "label" } },
                            { name: "gw_aemp" },
                            { header: true, value: "승인일시", format: { type: "label" } },
                            { name: "gw_adate" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내역_2", query: "w_link_eccb_item_M_2", type: "TABLE", title: "CIP 내역",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 90, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "CIP No.", format: { type: "label" } },
                            { name: "cip_no" },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "ecr_no" },
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "cip_title", format: { width: 800 } },
                            { header: true, value: "구분", format: { type: "label" } },
                            { name: "ecr_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개요", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "cip_desc", format: { width: 800 } },
                            { header: true, value: "Level", format: { type: "label" } },
                            { name: "crm_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용요구시점", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "act_time_text", format: { width: 800 } },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            { style: { colfloat: "float" }, name: "rpt_emp_nm", format: { type: "text", width: 60 } },
                            { style: { colfloat: "floated" }, name: "rpt_dept_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "CRM부서", format: { type: "label" } },
                            { name: "rqst_dept_nm", width: 200, style: { colspan: 3 } },
                            { header: true, value: "작성일자", format: { type: "label" } },
                            { name: "rpt_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { style: { rowspan: 3 }, header: true, value: "분류", format: { type: "label" } },
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region1_text" },
                            { style: { colfloat: "floating" }, name: "act_module1_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class1_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region2_text" },
                            { style: { colfloat: "floating" }, name: "act_module2_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class2_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region3_text" },
                            { style: { colfloat: "floating" }, name: "act_module3_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class3_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "승인상태", format: { type: "label" } },
                            { name: "gw_astat_nm" },
                            { header: true, value: "승인자", format: { type: "label" } },
                            { name: "gw_aemp" },
                            { header: true, value: "승인일시", format: { type: "label" } },
                            { name: "gw_adate" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_내역_3", query: "w_link_eccb_item_M_3", type: "TABLE", title: "ECO 내역",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 90, field: 190 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "ECO No.", format: { type: "label" } },
                            { name: "eco_no" },
                            { header: true, value: "관련근거", format: { type: "label" } },
                            { name: "ecr_no" },
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제목", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "eco_title", format: { width: 800 } },
                            { header: true, value: "구분", format: { type: "label" } },
                            { name: "ecr_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "개요", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "eco_desc", format: { width: 800 } },
                            { header: true, value: "Level", format: { type: "label" } },
                            { name: "crm_tp_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "적용요구시점", format: { type: "label" } },
                            { style: { colspan: 3 }, name: "act_time_text", format: { width: 800 } },
                            { header: true, value: "작성자/부서", format: { type: "label" } },
                            { style: { colfloat: "float" }, name: "eco_emp_nm", format: { type: "text", width: 60 } },
                            { style: { colfloat: "floated" }, name: "eco_dept_nm" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "CRM부서", format: { type: "label" } },
                            { name: "rqst_dept_nm", width: 200, style: { colspan: 3 } },
                            { header: true, value: "작성일자", format: { type: "label" } },
                            { name: "eco_dt", mask: "date-ymd" }
                        ]
                    },
                    {
                        element: [
                            { style: { rowspan: 3 }, header: true, value: "분류", format: { type: "label" } },
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region1_text" },
                            { style: { colfloat: "floating" }, name: "act_module1_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class1_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region2_text" },
                            { style: { colfloat: "floating" }, name: "act_module2_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class2_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { style: { colspan: 5, colfloat: "float" }, name: "act_region3_text" },
                            { style: { colfloat: "floating" }, name: "act_module3_text", format: { width: 300 } },
                            { style: { colfloat: "floated" }, name: "mp_class3_text", format: { width: 200 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "승인상태", format: { type: "label" } },
                            { name: "gw_astat_nm" },
                            { header: true, value: "승인자", format: { type: "label" } },
                            { name: "gw_aemp" },
                            { header: true, value: "승인일시", format: { type: "label" } },
                            { name: "gw_adate" }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_모델_1", query: "w_link_eccb_item_S_1", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 70 },
                { header: "Line", name: "cust_dept_nm", width: 90 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "제품명", name: "prod_nm", width: 300 },
                { name: "prod_type", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "cust_dept", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_모델_2", query: "w_link_eccb_item_S_2", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 70 },
                { header: "Line", name: "cust_dept_nm", width: 90 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "제품명", name: "prod_nm", width: 300 },
                { name: "prod_type", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "cust_dept", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_모델_3", query: "w_link_eccb_item_S_3", title: "적용 모델",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 70 },
                { header: "Line", name: "cust_dept_nm", width: 90 },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "제품명", name: "prod_nm", width: 300 },
                { name: "prod_type", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "cust_dept", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "frmData_메모A_1", query: "w_eccb1010_S_2_1", type: "TABLE", title: "개선 전 (현상 및 문제점)",
        //    caption: true, show: true, wrap: true, selectable: true,
        //    content: {
        //        width: { field: "100%" }, height: 370,
        //        row: [
        //            {
        //                element: [
        //                    { name: "memo_html", format: { type: "html", height: 370, top: 5 } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        ////=====================================================================================
        //var args = {
        //    targetid: "frmData_메모B_1", query: "w_eccb1010_S_2_2", type: "TABLE", title: "개선 후 (안)",
        //    caption: true, show: true, selectable: true,
        //    content: {
        //        width: { field: "100%" }, height: 370,
        //        row: [
        //            {
        //                element: [
        //                    { name: "memo_html", format: { type: "html", height: 370, top: 5 } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_메모F_1", query: "w_link_eccb_item_S_1_2", type: "TABLE", title: "개선 사항",
            caption: true, show: true, fixed: true, selectable: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 500,
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 500, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //var args = {
        //    targetid: "frmData_메모A_2", query: "w_info_eccb_item_S_2_1", type: "TABLE", title: "TEST 내용",
        //    caption: true, show: true, wrap: true, selectable: true,
        //    content: {
        //        width: { field: "100%" }, height: 370,
        //        row: [
        //            {
        //                element: [
        //                    { name: "memo_html", format: { type: "html", height: 370, top: 5 } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        ////=====================================================================================
        //var args = {
        //    targetid: "frmData_메모B_2", query: "w_info_eccb_item_S_2_2", type: "TABLE", title: "TEST 결과",
        //    caption: true, show: true, selectable: true,
        //    content: {
        //        width: { field: "100%" }, height: 370,
        //        row: [
        //            {
        //                element: [
        //                    { name: "memo_html", format: { type: "html", height: 370, top: 5 } }
        //                ]
        //            }
        //        ]
        //    }
        //};
        ////----------
        //gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_메모F_2", query: "w_link_eccb_item_S_2_2", type: "TABLE", title: "개선 사항",
            caption: true, show: true, selectable: true,
            content: {
                width: { field: "100%" }, height: 500,
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 500, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_메모F_3", query: "w_link_eccb_item_S_3_2", type: "TABLE", title: "개선 사항",
            caption: true, show: true, selectable: true,
            content: {
                width: { field: "100%" }, height: 500,
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 500, top: 5 } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부_1", query: "w_link_eccb_item_F_1", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 300, align: "left" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부_2", query: "w_link_eccb_item_F_2", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 300, align: "left" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_첨부_3", query: "w_link_eccb_item_F_3", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "파일명", name: "file_nm", width: 300, align: "left" },
                { header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
                { header: "파일설명", name: "file_desc", width: 300, align: "left" },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_APART", query: "w_link_eccb_item_S_7", title: "변경 전 PART",
            caption: true, width: 550, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
                {
                    header: "단종", name: "discon_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                },
                { header: "품번", name: "part_cd", width: 80 },
                { header: "품명", name: "part_nm", width: 150 },
                { header: "규격", name: "spec", width: 150 },
                { header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 100 }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //----------
        $("#grdData_APART_data").parents('div.ui-jqgrid-bdiv').css("max-height", "110px");
        //=====================================================================================
        var args = {
            targetid: "grdData_BPART", query: "w_link_eccb_item_S_8", title: "변경 후 PART",
            caption: true, width: 550, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "품번", name: "part_cd", width: 80 },
                { header: "품명", name: "part_nm", width: 150 },
                { header: "규격", name: "spec", width: 150 },
                { header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "Process", name: "cust_proc_nm", width: 100 },
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "Line", name: "cust_dept_nm", width: 100 }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //----------
        $("#grdData_BPART_data").parents('div.ui-jqgrid-bdiv').css("max-height", "110px");
        //=====================================================================================
        var args = {
            targetid: "grdData_문서", query: "w_eccb4010_S_6", title: "필수 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { master: true, bind: "select", validate: true },
            element: [
                { header: "Item", name: "file_grp_nm", width: 200 },
                { header: "세부내용", name: "file_tp_nm", width: 300 },
                { header: "담당부서", name: "file_tp_dept", width: 80, align: "center" },
                { header: "파일", name: "file_download", width: 40, align: "center", format: { type: "link" } },
                { name: "ecr_no", editable: { type: "hidden" }, hidden: true },
                { name: "eco_no", editable: { type: "hidden" }, hidden: true },
                { name: "file_tp", editable: { type: "hidden" }, hidden: true },
                { name: "file_id", editable: { type: "hidden" }, hidden: true },
                { name: "fid", editable: { type: "hidden" }, hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_nm", hidden: true }
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
                { type: "FORM", id: "frmData_내역_1", offset: 8 },
                { type: "FORM", id: "frmData_내역_2", offset: 8 },
                { type: "FORM", id: "frmData_내역_3", offset: 8 },
                { type: "GRID", id: "grdData_모델_1", offset: 8 },
                { type: "GRID", id: "grdData_모델_2", offset: 8 },
                { type: "GRID", id: "grdData_모델_3", offset: 8 },
                { type: "GRID", id: "grdData_첨부_1", offset: 8 },
                { type: "GRID", id: "grdData_첨부_2", offset: 8 },
                { type: "GRID", id: "grdData_첨부_3", offset: 8 },
                { type: "GRID", id: "grdData_APART", offset: 8 },
                { type: "GRID", id: "grdData_BPART", offset: 8 },
                { type: "GRID", id: "grdData_문서", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrData_ECR", title: "ECR 내역" },
                { type: "LAYER", id: "lyrData_CIP", title: "CIP 내역" },
                { type: "LAYER", id: "lyrData_ECO", title: "ECO 내역" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 },
                { type: "FORM", id: "frmData_내역_1", offset: 8 },
                { type: "FORM", id: "frmData_내역_2", offset: 8 },
                { type: "FORM", id: "frmData_내역_3", offset: 8 },
                { type: "GRID", id: "grdData_모델_1", offset: 8 },
                { type: "GRID", id: "grdData_모델_2", offset: 8 },
                { type: "GRID", id: "grdData_모델_3", offset: 8 },
                { type: "GRID", id: "grdData_첨부_1", offset: 8 },
                { type: "GRID", id: "grdData_첨부_2", offset: 8 },
                { type: "GRID", id: "grdData_첨부_3", offset: 8 },
                { type: "GRID", id: "grdData_APART", offset: 8 },
                { type: "GRID", id: "grdData_BPART", offset: 8 },
                { type: "GRID", id: "grdData_문서", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_ECR_NO", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_CIP_NO", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_ECO_NO", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_첨부_1", grid: true, element: "download", event: "click", handler: click_grdData_첨부_download };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_첨부_2", grid: true, element: "download", event: "click", handler: click_grdData_첨부_download };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_첨부_3", grid: true, element: "download", event: "click", handler: click_grdData_첨부_download };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_문서", grid: true, element: "file_download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            if (parent.streamProcess == undefined || window == parent)
                window.close();
            else
                processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------        
        function click_grdData_첨부_download(ui) {

            var args = {
                source: {
                    id: ui.object,
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
        gw_com_module.startPage();
        //----------
        var ecr_no = gw_com_api.getPageParameter("ecr_no");
        if (ecr_no == "") ecr_no = gw_com_api.getPageParameter("data_key");
        var cip_no = gw_com_api.getPageParameter("cip_no");
        var eco_no = gw_com_api.getPageParameter("eco_no");

        //gw_com_api.setValue("frmOption", 1, "ecr_no", ecr_no);
        //gw_com_api.setValue("frmOption", 1, "cip_no", cip_no);
        //gw_com_api.setValue("frmOption", 1, "eco_no", eco_no);

        gw_com_api.setValue("frmOption_ECR_NO", 1, "ecr_no", ecr_no);
        gw_com_api.setValue("frmOption_CIP_NO", 1, "cip_no", cip_no);
        gw_com_api.setValue("frmOption_ECO_NO", 1, "eco_no", eco_no);

        var tab = gw_com_api.getPageParameter("tab");
        var idx = tab == "CIP" ? 2 : tab == "ECO" ? 3 : 1;
        gw_com_api.selectTab("lyrTab", idx);
        processTabChange({ row: idx });

        processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processTabChange(param) {

    switch (param.row) {
        case 1:
            {
                gw_com_api.show("frmOption_ECR_NO");
                gw_com_api.hide("frmOption_CIP_NO");
                gw_com_api.hide("frmOption_ECO_NO");
            }
            break;
        case 2:
            {
                gw_com_api.hide("frmOption_ECR_NO");
                gw_com_api.show("frmOption_CIP_NO");
                gw_com_api.hide("frmOption_ECO_NO");
            }
            break;
        case 3:
            {
                gw_com_api.hide("frmOption_ECR_NO");
                gw_com_api.hide("frmOption_CIP_NO");
                gw_com_api.show("frmOption_ECO_NO");
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption_ECR_NO" || param.object == "frmOption_CIP_NO" || param.object == "frmOption_ECO_NO") {
        gw_com_api.setValue("frmOption", 1, param.element, param.value.current);
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "ecr_no", argument: "arg_ecr_no" },
                { name: "cip_no", argument: "arg_cip_no" },
                { name: "eco_no", argument: "arg_eco_no" }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_내역_1" },
            { type: "FORM", id: "frmData_내역_2" },
            { type: "FORM", id: "frmData_내역_3" },
            { type: "GRID", id: "grdData_모델_1" },
            { type: "GRID", id: "grdData_모델_2" },
            { type: "GRID", id: "grdData_모델_3" },
            { type: "FORM", id: "frmData_메모F_1" },
            { type: "FORM", id: "frmData_메모F_2" },
            { type: "FORM", id: "frmData_메모F_3" },
            { type: "GRID", id: "grdData_첨부_1" },
            { type: "GRID", id: "grdData_첨부_2" },
            { type: "GRID", id: "grdData_첨부_3" },
            { type: "GRID", id: "grdData_APART" },
            { type: "GRID", id: "grdData_BPART" },
            { type: "GRID", id: "grdData_문서" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

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
function processFile(param) {

    var args = { source: { id: param.object, row: param.row }, targetid: "lyrDown" };
    gw_com_module.downloadFile(args);

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
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//