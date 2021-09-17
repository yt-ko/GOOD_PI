﻿//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약등록
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

        //----------
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });

        //상세보기 step
        v_global.logic.Step = gw_com_api.getPageParameter("STEP");
        //----------
        gw_com_api.changeTheme("style_theme");

        // step prepare dialogue. ---공인인증 2021-09-14 KYT
        switch (v_global.logic.PECM_Step) {
            case "appr":
            case "chk":
                var args = {
                    type: "PAGE", page: "SignDataVIDVerify_IPS", content: "html", path: "../ccc-sample-wstd/", title: "공인인증",
                    width: 600, height: 500, locate: ["center", "center"]
                };
                gw_com_module.dialoguePrepare(args);
                break

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                // 2021-09-16 KYT 계약 관리 통합을 위한 data set
                {
                    type: "INLINE", name: "체결방식",
                    data: [
                        { title: "전자", value: "1" },
                        { title: "서면", value: "0" }
                    ]
                },
                {
                    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",    // 장비군
                    param: [{ argument: "arg_hcode", value: "ISCM81" }]
                },
                {
                    type: "PAGE", name: "SYS010", query: "DDDW_CM_CODE",    // 통화
                    param: [{ argument: "arg_hcode", value: "SYS010" }]
                },
                {
                    type: "PAGE", name: "SYS011", query: "DDDW_CM_CODE",    // 국가
                    param: [{ argument: "arg_hcode", value: "SYS011" }]
                },
                {
                    type: "PAGE", name: "ECM010", query: "DDDW_CM_CODE",    // 문서구분
                    param: [{ argument: "arg_hcode", value: "ECM010" }]
                },
                // 2021-09-16 KYT 계약 관리 통합을 위한 data set
                {
                    type: "PAGE", name: "ECM020", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECM020" }]
                },
                // 2021-09-16 KYT 계약 관리 통합을 위한 data set
                {
                    type: "PAGE", name: "ECM030", query: "DDDW_CM_CODED",
                    param: [{ argument: "arg_hcode", value: "ECM030" }]
                },
                {
                    type: "PAGE", name: "ECM040", query: "DDDW_CM_CODE",    // 계약자구분
                    param: [{ argument: "arg_hcode", value: "ECM040" }]
                },
                // 계약검토 통합을 위한 2021-09-15 kyt
                {
                    type: "PAGE", name: "ECM050", query: "DDDW_CM_CODE",    // 검토상태
                    param: [{ argument: "arg_hcode", value: "ECM050" }]
                },
                { type: "PAGE", name: "DOC_GRP", query: "DDDW_ECM_DOC_GRP" },   // 계약분류
                { type: "PAGE", name: "STD_DOC", query: "DDDW_ECM_STD_DOC" },   // 표준문서
                {
                    type: "INLINE", name: "언어",
                    data: [
                        { title: "국문", value: "KOR" },
                        { title: "영문", value: "ENG" }
                    ]
                },
                {
                    type: "INLINE", name: "기간",
                    data: [
                        { title: "년", value: "Y" },
                        { title: "월", value: "M" },
                        { title: "일", value: "D" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            //if (v_global.process.param != "") {
            v_global.logic.doc_id = gw_com_api.getPageParameter("doc_id");
            v_global.logic.doc_no = gw_com_api.getPageParameter("doc_no");
            v_global.logic.view = gw_com_api.getPageParameter("VIEW") == "Y" ? true : false;
            v_global.logic.appr = gw_com_api.getPageParameter("APPR") == "Y" ? true : false;    // 전자결재 링크로 사용할 경우 권한체크하지 않음.
            if (gw_com_api.getPageParameter("new_yn") == "Y") {
                processRetrieve({ edit: true });
                //processExtField({});
            } else
                processRetrieve({});
            //}
            //else
            //    processInsert({});

            gw_com_module.startPage();

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
        if (v_global.logic.Step == "appr") {
            var args = {
                targetid: "lyrMenu", type: "FREE",
                element: [
                    //{ name: "항목", value: "추가항목입력", icon: "기타", updatable: true },
                    //{ name: "저장", value: "저장" },
                    //{ name: "승인", value: "승인", icon: "기타", updatable: true },
                    //{ name: "반려", value: "반려", icon: "기타", updatable: true },
                    { name: "출력", value: "출력" },
                    { name: "닫기", value: "닫기" }
                ]
            };
        } else {

            var args = {
                targetid: "lyrMenu", type: "FREE", show: true,
                element: [
                    //{ name: "보기", value: "계약서보기", icon: "조회" },
                    //{ name: "보기2", value: "계약서보기2", icon: "조회" },
                    { name: "닫기", value: "닫기" }
                ]
            };
        }
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_DOC", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);

        if (v_global.logic.Step == "appr") {
            var args = {
                targetid: "frmData_MAIN", query: "ECM_1020_1", type: "TABLE", title: "",
                caption: false, show: true,
                editable: { bind: "select", focus: "crs_date", validate: true },
                content: {
                    width: { label: 110, field: 270 }, height: 25,
                    row: [
                        {
                            element: [
                                { header: true, value: "문서번호", format: { type: "label" } },
                                { name: "doc_no", editable: { type: "hidden" } },
                                { header: true, value: "계약분류", format: { type: "label" } },
                                { name: "grp_nm" },
                                { header: true, value: "계약서명", format: { type: "label" } },
                                { name: "doc_nm" }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "장비군", format: { type: "label" } },
                                { name: "dept_area_nm" },
                                { header: true, value: "담당자", format: { type: "label" } },
                                { name: "cr_emp_nm" },
                                { name: "cr_emp", editable: { type: "hidden" }, hidden: true },
                                { header: true, value: "작성자", format: { type: "label" } },
                                { name: "ins_usr_nm" }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "계약일", format: { type: "label" } },
                                {
                                    name: "cr_date", mask: "date-ymd",
                                    editable: { type: "text", width: 100 }
                                },
                                { header: true, value: "계약기간", format: { type: "label" } },
                                {
                                    name: "crs_date", mask: "date-ymd", style: { colfloat: "float" },
                                    format: { type: "text", width: 60 },
                                    editable: { type: "text", width: 100 }
                                },
                                {
                                    value: "~", style: { colfloat: "floating" },
                                    format: { type: "label", width: 60 }
                                },
                                {
                                    name: "cre_date", mask: "date-ymd", style: { colfloat: "floated" },
                                    format: { type: "text", width: 60 },
                                    editable: { type: "text", width: 100 }
                                },
                                { header: true, value: "작성일", format: { type: "label" } },
                                { name: "ins_dt", format: { type: "text" } }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "국가", format: { type: "label" } },
                                {
                                    name: "nation",
                                    format: { type: "select", data: { memory: "SYS011" } },
                                    editable: { type: "select", data: { memory: "SYS011" } }
                                },
                                { header: true, value: "", format: { type: "label" } },
                                { name: "" },
                                //{ header: true, value: "자동연장/횟수", format: { type: "label" } },
                                //{
                                //    name: "ext_yn", style: { colfloat: "float" },
                                //    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                //    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                                //},
                                //{
                                //    value: "/", style: { colfloat: "floating" },
                                //    format: { type: "label", width: 60 }
                                //},
                                //{
                                //    name: "ext_cnt", style: { colfloat: "floated" }, mask: "numeric-int",
                                //    format: { type: "text", width: 30 },
                                //    editable: { type: "text", width: 30, maxlength: 3 }
                                //},
                                { header: true, value: "계약상태", format: { type: "label" } },
                                { name: "pstat_nm" }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "제목", format: { type: "label" } },
                                {
                                    name: "cr_title", style: { colspan: 3 },
                                    format: { type: "text", width: 654 },
                                    editable: { type: "text", width: 648 }
                                },
                                { header: true, value: "처리상태", format: { type: "label" } },
                                { name: "astat_nm" }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "비고", format: { type: "label" } },
                                {
                                    name: "cr_rmk", style: { colspan: 5 },
                                    format: { type: "textarea", rows: 2, width: 1040 },
                                    editable: { type: "textarea", rows: 2, width: 1034 }
                                }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "화폐단위", format: { type: "label" } },
                                {
                                    name: "currency",
                                    editable: { type: "select", data: { memory: "SYS010" }, validate: { rule: "required", message: "화폐" } }
                                },
                                { header: true, value: "계약금액(VAT별도)", format: { type: "label" } },
                                {
                                    name: "amount", mask: "numeric-int",
                                    format: { type: "text" },
                                    editable: { type: "text", maxlength: 15 }
                                },
                                { header: true, value: "지급방법", format: { type: "label" } },
                                {
                                    name: "payment",
                                    editable: { type: "text", validate: { rule: "required", message: "지급방법" } }
                                },
                                { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                                { name: "pstat", editable: { type: "hidden" }, hidden: true },
                                { name: "astat", editable: { type: "hidden" }, hidden: true },
                                { name: "cert_yn", editable: { type: "hidden" }, hidden: true },
                                { name: "edit_yn", hidden: true }
                            ]
                        }
                    ]
                }
            };
        } else {
            var args = {
                targetid: "frmData_MAIN", query: "ECM_1020_1", type: "TABLE", title: "",
                caption: false, show: true,
                editable: { bind: "select", focus: "dept_area", validate: true },
                content: {
                    width: { label: 100, field: 270 }, height: 25,
                    row: [
                        {
                            element: [
                                { header: true, value: "문서번호", format: { type: "label" } },
                                {
                                    name: "doc_no", style: { colfloat: "float" },
                                    format: { type: "text", width: 220 },
                                    editable: { type: "hidden", width: 220 }
                                },
                                {
                                    name: "cert_yn_nm", style: { colfloat: "floated" },
                                    format: { type: "text" }, readonly: true,
                                    editable: { type: "hidden" }
                                },
                                { header: true, value: "계약분류", format: { type: "label" } },
                                { name: "grp_nm", format: { type: "text" } },
                                { header: true, value: "계약서명", format: { type: "label" } },
                                { name: "doc_nm", format: { type: "text" } }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "장비군", format: { type: "label" } },
                                {
                                    name: "dept_area",
                                    format: { type: "select", data: { memory: "ISCM81" } },
                                    editable: { type: "select", data: { memory: "ISCM81" } }
                                },
                                { header: true, value: "담당자", format: { type: "label" } },
                                {
                                    name: "cr_emp_nm", mask: "search",
                                    editable: { type: "text" }
                                },
                                { name: "cr_emp", editable: { type: "hidden" }, hidden: true },
                                { header: true, value: "국가", format: { type: "label" } },
                                {
                                    name: "nation",
                                    format: { type: "select", data: { memory: "SYS011" } },
                                    editable: { type: "select", data: { memory: "SYS011" } }
                                }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "계약일", format: { type: "label" } },
                                {
                                    name: "cr_date", mask: "date-ymd",
                                    editable: { type: "text", width: 90 }
                                },
                                { header: true, value: "계약기간", format: { type: "label" } },
                                {
                                    name: "crs_date", mask: "date-ymd", style: { colfloat: "float" },
                                    format: { type: "text", width: 60 },
                                    editable: { type: "text", width: 90 }
                                },
                                {
                                    value: "~", style: { colfloat: "floating" },
                                    format: { type: "label", width: 60 }
                                },
                                {
                                    name: "cre_date", mask: "date-ymd", style: { colfloat: "floated" },
                                    format: { type: "text", width: 60 },
                                    editable: { type: "text", width: 90 }
                                },
                                { header: true, value: "자동연장/기간", format: { type: "label" } },
                                {
                                    name: "ext_yn", style: { colfloat: "float" },
                                    format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                    editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                                },
                                {
                                    value: "/", style: { colfloat: "floating" },
                                    format: { type: "label", width: 40 }
                                },
                                {
                                    name: "ext_cnt", style: { colfloat: "floating" }, mask: "numeric-int",
                                    format: { type: "text", width: 14 },
                                    editable: { type: "text", width: 30, maxlength: 3 }
                                },
                                {
                                    name: "ext_term", style: { colfloat: "floated" },
                                    format: { type: "select", data: { memory: "기간", unshift: [{ title: "-", value: "" }] }, width: 50 },
                                    editable: { type: "select", data: { memory: "기간", unshift: [{ title: "-", value: "" }] }, width: 50 }
                                }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "", format: { type: "label" } },
                                { name: "" },
                                { header: true, value: "하자보수", format: { type: "label" } },
                                {
                                    name: "rps_date", mask: "date-ymd", style: { colfloat: "float" },
                                    format: { type: "text", width: 60 },
                                    editable: { type: "text", width: 90 }
                                },
                                {
                                    value: "~", style: { colfloat: "floating" },
                                    format: { type: "label", width: 60 }
                                },
                                {
                                    name: "rpe_date", mask: "date-ymd", style: { colfloat: "floated" },
                                    format: { type: "text", width: 60 },
                                    editable: { type: "text", width: 90 }
                                },
                                { header: true, value: "작성", format: { type: "label" } },
                                { name: "ins_usr_nm", format: { type: "text", width: 70 }, style: { colfloat: "float" } },
                                { name: "ins_dt", format: { type: "text" }, style: { colfloat: "floated" } }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "제목", format: { type: "label" } },
                                {
                                    name: "cr_title", style: { colspan: 3 },
                                    format: { type: "text", width: 650 },
                                    editable: { type: "text", width: 648, validate: { rule: "required" }, maxlength: 150 }
                                },
                                { header: true, value: "계약상태", format: { type: "label" } },
                                { name: "pstat_nm" }
                            ]
                        },
                        {
                            element: [
                                { header: true, value: "계약대상", format: { type: "label" } },
                                {
                                    name: "cr_prod", style: { colspan: 3 },
                                    format: { type: "text", width: 650 },
                                    editable: { type: "text", width: 648, maxlength: 50 }
                                },
                                { header: true, value: "처리상태", format: { type: "label" } },
                                { name: "astat_nm" },
                                { name: "currency", editable: { type: "hidden" }, hidden: true },
                                { name: "amount", editable: { type: "hidden" }, hidden: true },
                                { name: "payment", editable: { type: "hidden" }, hidden: true },
                                { name: "chkl_date", editable: { type: "hidden" }, hidden: true },
                                { name: "remark1", editable: { type: "hidden" }, hidden: true },
                                { name: "remark2", editable: { type: "hidden" }, hidden: true },
                                { name: "remark3", editable: { type: "hidden" }, hidden: true },
                                { name: "remark4", editable: { type: "hidden" }, hidden: true },
                                { name: "remark5", editable: { type: "hidden" }, hidden: true },
                                { name: "pstat", editable: { type: "hidden" }, hidden: true },
                                { name: "astat", editable: { type: "hidden" }, hidden: true },
                                { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                                { name: "std_yn", editable: { type: "hidden" }, hidden: true },
                                { name: "cert_yn", editable: { type: "hidden" }, hidden: true }
                            ]
                        }
                    ]
                }
            };
        }

        if (v_global.logic.Step == "mgr") {
            args.content.row[0].element[4] = {
                name: "grp_id",
                format: { type: "select", data: { memory: "DOC_GRP" } },
                editable: {
                    type: "select", data: { memory: "DOC_GRP" }, validate: { rule: "required" },
                    change: [{ name: "std_id", memory: "STD_DOC", key: ["grp_id"] }]
                }
            }
            args.content.row[0].element[6] = {
                name: "std_id",
                format: { type: "select", data: { memory: "STD_DOC" } },
                editable: { type: "select", data: { memory: "STD_DOC", key: ["grp_id"] }, validate: { rule: "required" } }
            }
            args.content.row[4].element[3] = {
                name: "pstat",
                format: { type: "select", data: { memory: "ECM020" } },
                editable: {
                    type: "select", data: { memory: "ECM020" },
                    change: [{ name: "astat", memory: "ECM030", key: ["pstat"] }]
                }
            }
            args.content.row[5].element[3] = {
                name: "astat",
                format: { type: "select", data: { memory: "ECM030" } },
                editable: { type: "select", data: { memory: "ECM030", key: ["pstat"] } }
            }
            args.content.row[6] = {
                element: [
                    { header: true, value: "날인일", format: { type: "label" } },
                    {
                        name: "imp_date", mask: "date-ymd",
                        editable: { type: "text", width: 90 }
                    },
                    { header: true, value: "이관일/담당", format: { type: "label" } },
                    {
                        name: "tr_date", mask: "date-ymd", style: { colfloat: "float" },
                        format: { type: "text", width: 60 },
                        editable: { type: "text", width: 90 }
                    },
                    {
                        value: "/", style: { colfloat: "floating" },
                        format: { type: "label", width: 40 }
                    },
                    {
                        name: "tr_emp", style: { colfloat: "floated" },
                        editable: { type: "text", width: 90, maxlength: 10 }
                    },
                    { header: true, value: "바인더", format: { type: "label" } },
                    {
                        name: "binder",
                        editable: { type: "text", maxlength: 10 }
                    }
                ]
            }
        }

        //,
        //{
        //    element: [
        //        { header: true, value: "비고", format: { type: "label" } },
        //        {
        //            name: "cr_rmk", style: { colspan: 5 },
        //            format: { type: "textarea", rows: 2, width: 1052 },
        //            editable: { type: "textarea", rows: 2, width: 1044 }
        //        }
        //    ]
        //}

        //----------
        gw_com_module.formCreate(args);
        $("#frmData_MAIN_cert_yn_nm").css("color", "red");
        $("#frmData_MAIN_cert_yn_nm").css("font-weight", "bold");
        $("#frmData_MAIN_cert_yn_nm_view").css("color", "red");
        $("#frmData_MAIN_cert_yn_nm_view").css("font-weight", "bold");

        //계약정보 UI 
        var args = {
            targetid: "grdData_SUB", query: "ECM_1020_2", title: "계약자",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "", validate: true },
            element: [
                {
                    header: "구분", name: "supp_tp", width: 100, align: "center",
                    format: { type: "select", data: { memory: "ECM040" } },
                    editable: { type: "select", data: { memory: "ECM040" }, validate: { rule: "required", message: "구분" } }
                },
                { header: "상태", name: "pstat_nm", width: 80, align: "center", hidden: true },
                { header: "거래처", name: "supp_nm", width: 200 },
                {
                    header: "대표자", name: "supp_prsdnt", width: 120,
                    editable: { type: "text", maxlength: 50 }
                },
                {
                    header: "담당자", name: "supp_man", width: 120,
                    editable: { type: "text", maxlength: 50 }
                },
                {
                    header: "연락처", name: "supp_telno", width: 150,
                    editable: { type: "text", maxlength: 20 }
                },
                {
                    header: "E-Mail", name: "supp_email", width: 200,
                    editable: { type: "text", maxlength: 100 }
                },
                {
                    header: "지분율", name: "cr_rate", width: 100, align: "right",
                    editable: { type: "text", maxlength: 6 }, mask: "numeric-float", hidden: true
                },
                {
                    header: "주소", name: "supp_addr", width: 400,
                    editable: { type: "text", maxlength: 310 }
                },
                { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                { name: "supp_cd", editable: { type: "hidden" }, hidden: true },
                { name: "cert_data", editable: { type: "hidden" }, hidden: true },
                { name: "supp_id", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //전자계약 전용 UI 추가
        if (v_global.logic.Step == "appr") {
            args.query = "ECM_2020_2";
            args.element[13] = { name: "rgst_no", hidden: true };
        }
        //----------
        gw_com_module.gridCreate(args);

        //계약내용 UI
        switch (v_global.logic.Step) {
            case "rqst":
            case "find":
                {
                    var args = {
                        targetid: "frmData_MAIN2", query: "ECM_1020_1", type: "TABLE", title: "계약 내용",
                        caption: true, show: true,
                        editable: { bind: "select", focus: "currency", validate: true },
                        content: {
                            width: { label: 100, field: 270 }, height: 25,
                            row: [
                                {
                                    element: [
                                        { header: true, value: "화폐단위", format: { type: "label" } },
                                        {
                                            name: "currency",
                                            editable: { type: "select", data: { memory: "SYS010" }, validate: { rule: "required" } }
                                        },
                                        { header: true, value: "계약금액(VAT별도)", format: { type: "label" } },
                                        {
                                            name: "amount", mask: "numeric-int",
                                            editable: { type: "text", maxlength: 15 }
                                        },
                                        { header: true, value: "", format: { type: "label" } },
                                        { format: { type: "label" } }
                                        //{ header: true, value: "지급방법", format: { type: "label" } },
                                        //{
                                        //    name: "payment",
                                        //    editable: { type: "text", validate: { rule: "required" } }
                                        //},
                                        //{ header: true, value: "검토납기일", format: { type: "label" } },
                                        //{
                                        //    name: "chkl_date", mask: "date-ymd",
                                        //    editable: { type: "text", width: 100, maxlength: 10 }, hidden: true
                                        //}
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "지급방법", format: { type: "label" } },
                                        {
                                            name: "payment", style: { colspan: 5 },
                                            format: { width: 1048 },
                                            editable: { type: "text", width: 1044, validate: { rule: "required" }, maxlength: 250 }
                                        }
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "관련장비/기술", format: { type: "label" } },
                                        {
                                            name: "remark1", style: { colspan: 5 },
                                            format: { type: "textarea", rows: 3, width: 1040 },
                                            editable: { type: "textarea", rows: 3, width: 1034, maxlength: 200 }
                                        }
                                    ]
                                },
                                //{
                                //    element: [
                                //        { header: true, value: "체결 배경", format: { type: "label" } },
                                //        {
                                //            name: "remark2", style: { colspan: 7 },
                                //            format: { type: "textarea", rows: 3, width: 1048 },
                                //            editable: { type: "textarea", rows: 3, width: 1042 }
                                //        }
                                //    ]
                                //},
                                {
                                    element: [
                                        { header: true, value: "계약 목적", format: { type: "label" } },
                                        {
                                            name: "remark3", style: { colspan: 5 },
                                            format: { type: "textarea", rows: 3, width: 1040 },
                                            editable: { type: "textarea", rows: 3, width: 1034, maxlength: 250 }
                                        }
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "특이사항", format: { type: "label" } },
                                        {
                                            name: "remark4", style: { colspan: 5 },
                                            format: { type: "textarea", rows: 20, width: 1040 },
                                            editable: { type: "textarea", rows: 20, width: 1034 }
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    gw_com_module.formCreate(args);
                }
                break;
            case "chk":
                {
                    var args = {
                        targetid: "frmData_MAIN2", query: "ECM_1020_1", type: "TABLE", title: "검토의뢰",
                        caption: true, show: true,
                        editable: { bind: "select", focus: "currency", validate: true },
                        content: {
                            width: { label: 96, field: 180 }, height: 25,
                            row: [
                                {
                                    element: [
                                        { header: true, value: "화폐단위", format: { type: "label" } },
                                        {
                                            name: "currency",
                                            editable: { type: "select", data: { memory: "SYS010" }, validate: { rule: "required" } }
                                        },
                                        { header: true, value: "계약금액", format: { type: "label" } },
                                        {
                                            name: "amount", mask: "numeric-int",
                                            editable: { type: "text", maxlength: 10 }
                                        },
                                        { header: true, value: "지급방법", format: { type: "label" } },
                                        {
                                            name: "payment",
                                            editable: { type: "text", validate: { rule: "required" } }
                                        },
                                        { header: true, value: "검토납기일", format: { type: "label" } },
                                        { name: "chkl_date", mask: "date-ymd" }
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "검토상태", format: { type: "label" } },
                                        {
                                            name: "cstat",
                                            format: { type: "select", data: { memory: "ECM050", unshift: [{ title: "미접수", value: "" }] } },
                                            editable: { type: "select", data: { memory: "ECM050", unshift: [{ title: "미접수", value: "" }] }, validate: { rule: "required" } }
                                        },
                                        { header: true, value: "검토자", format: { type: "label" } },
                                        { name: "chk_emp_nm" },
                                        { name: "chk_emp", editable: { type: "hidden" }, hidden: true },
                                        { header: true, value: "검토완료일", format: { type: "label" } },
                                        { name: "chk_date", mask: "date-ymd", editable: { type: "hidden", width: 300 } },
                                        { header: true, value: "검토의뢰일", format: { type: "label" } },
                                        { name: "chk_req_date", mask: "date-ymd" }
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "", format: { type: "label" } },
                                        { name: "" },
                                        { header: true, value: "", format: { type: "label" } },
                                        { name: "" },
                                        { header: true, value: "", format: { type: "label" } },
                                        { name: "" },
                                        { header: true, value: "지체상금비율", format: { type: "label" } },
                                        {
                                            name: "ld_rate", mask: "numeric-float",
                                            editable: { type: "text", maxlength: 5 }
                                        }
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "검토의견", format: { type: "label" } },
                                        {
                                            name: "chk_rmk", style: { colspan: 7 },
                                            format: { type: "textarea", rows: 2, width: 1048 },
                                            editable: { type: "textarea", rows: 2, width: 1042 }
                                        }
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "관련장비/기술", format: { type: "label" } },
                                        {
                                            name: "remark1", style: { colspan: 7 },
                                            format: { type: "textarea", rows: 3, width: 1048 },
                                            editable: { type: "textarea", rows: 3, width: 1042 }
                                        }
                                    ]
                                },
                                //{
                                //    element: [
                                //        { header: true, value: "체결 배경", format: { type: "label" } },
                                //        {
                                //            name: "remark2", style: { colspan: 7 },
                                //            format: { type: "textarea", rows: 3, width: 1048 },
                                //            editable: { type: "textarea", rows: 3, width: 1042 }
                                //        }
                                //    ]
                                //},
                                {
                                    element: [
                                        { header: true, value: "계약 목적", format: { type: "label" } },
                                        {
                                            name: "remark3", style: { colspan: 7 },
                                            format: { type: "textarea", rows: 3, width: 1048 },
                                            editable: { type: "textarea", rows: 3, width: 1042 }
                                        }
                                    ]
                                },
                                {
                                    element: [
                                        { header: true, value: "특이사항", format: { type: "label" } },
                                        {
                                            name: "remark4", style: { colspan: 7 },
                                            format: { type: "textarea", rows: 20, width: 1048 },
                                            editable: { type: "textarea", rows: 20, width: 1042 }
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    gw_com_module.formCreate(args);

                }
                break
            case "mgr": {
                var args = {
                    targetid: "frmData_MAIN2", query: "ECM_1020_1", type: "TABLE", title: "계약 내용",
                    caption: true, show: true,
                    editable: { bind: "select", focus: "currency", validate: true },
                    content: {
                        width: { label: 100, field: 270 }, height: 25,
                        row: [
                            {
                                element: [
                                    { header: true, value: "화폐단위", format: { type: "label" } },
                                    {
                                        name: "currency",
                                        editable: { type: "select", data: { memory: "SYS010" }, validate: { rule: "required" } }
                                    },
                                    { header: true, value: "계약금액(VAT별도)", format: { type: "label" } },
                                    {
                                        name: "amount", mask: "numeric-int",
                                        editable: { type: "text", maxlength: 15 }
                                    },
                                    { header: true, value: "지체상금비율", format: { type: "label" } },
                                    {
                                        name: "ld_rate", mask: "numeric-float",
                                        editable: { type: "text", maxlength: 5 }
                                    }
                                ]
                            },
                            {
                                element: [
                                    { header: true, value: "지급방법", format: { type: "label" } },
                                    {
                                        name: "payment", style: { colspan: 5 },
                                        format: { width: 1048 },
                                        editable: { type: "text", width: 1044, validate: { rule: "required" }, maxlength: 250 }
                                    }
                                ]
                            },
                            {
                                element: [
                                    { header: true, value: "관련장비/기술", format: { type: "label" } },
                                    {
                                        name: "remark1", style: { colspan: 5 },
                                        format: { type: "textarea", rows: 3 },
                                        editable: { type: "textarea", rows: 3, maxlength: 200 }
                                    }
                                ]
                            },
                            //{
                            //    element: [
                            //        { header: true, value: "체결 배경", format: { type: "label" } },
                            //        {
                            //            name: "remark2", style: { colspan: 7 },
                            //            format: { type: "textarea", rows: 3, width: 1048 },
                            //            editable: { type: "textarea", rows: 3, width: 1042, maxlength: 200 }
                            //        }
                            //    ]
                            //},
                            {
                                element: [
                                    { header: true, value: "계약 목적", format: { type: "label" } },
                                    {
                                        name: "remark3", style: { colspan: 5 },
                                        format: { type: "textarea", rows: 3 },
                                        editable: { type: "textarea", rows: 3, maxlength: 250 }
                                    }
                                ]
                            },
                            {
                                element: [
                                    { header: true, value: "특이사항", format: { type: "label" } },
                                    {
                                        name: "remark4", style: { colspan: 5 },
                                        format: { type: "textarea", rows: 20 },
                                        editable: { type: "textarea", rows: 20 }
                                    }
                                ]
                            }
                        ]
                    }
                };
                //----------
                gw_com_module.formCreate(args);
            }
                break

        }

        //----------
        //$("label:contains('계약금액(VAT포함)')").css("font-size", "8pt");
        //=====================================================================================
        var args = {
            targetid: "grdData_DOC", query: "ECM_1020_3", title: "계약문서",
            height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn", focus: "doc_tp", validate: true },
            element: [
                {
                    header: "문서구분", name: "doc_tp", width: 100, align: "center",
                    format: { type: "select", data: { memory: "ECM010" } }
                },
                {
                    header: "파일명", name: "doc_nm", width: 540,
                    editable: { type: "text", validate: { rule: "required", message: "파일명" } }
                },
                {
                    header: "언어", name: "doc_lang", width: 70, align: "center", hidden: true,
                    format: { type: "select", data: { memory: "언어" } },
                    editable: { type: "select", data: { memory: "언어" } }
                },
                {
                    header: "필수", name: "require_yn", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "편집", name: "edit_yn", width: 70, align: "center", hidden: true,
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                {
                    header: "Rev.No.", name: "rev_no", width: 70,
                    editable: { type: "text", maxlength: 6 }
                },
                {
                    header: "파일", name: "file_download", width: 50, align: "center",
                    format: { type: "link" }
                },
                {
                    header: "파일", name: "file_upload", width: 50, align: "center",
                    format: { type: "link" }
                },
                { name: "std_id", editable: { type: "hidden" }, hidden: true },
                { name: "docf_id", editable: { type: "hidden" }, hidden: true },
                { name: "file_id", hidden: true },
                { name: "file_nm", hidden: true },
                { name: "file_path", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //전자계약 전용 UI 추가
        if (v_global.logic.Step == "appr") {
            args.query = "ECM_2020_3";
            args.element[2] = { name: "doc_lang", editable: { type: "hidden" }, hidden: true };
        }
        //----------
        gw_com_module.gridCreate(args);

        //계약관리에만 있는 그리드 연관계약서
        if (v_global.logic.Step == "mgr") {
            var args = {
                targetid: "grdData_REF", query: "ECM_1020_4", title: "연관 계약서",
                height: "100%", show: true, caption: true, pager: false, selectable: true, number: true,
                editable: { master: true, bind: "select", validate: true },
                element: [
                    {
                        header: "체결방식", name: "cert_yn", width: 50, align: "center",
                        format: { type: "select", data: { memory: "체결방식" } }
                    },
                    { header: "계약분류", name: "grp_nm", width: 100 },
                    { header: "제목", name: "cr_title", width: 180 },
                    { header: "계약대상", name: "cr_prod", width: 100 },
                    { header: "계약처", name: "supp_nm", width: 120 },
                    { header: "장비군", name: "dept_area_nm", width: 60, align: "center" },
                    { header: "담당자", name: "cr_emp_nm", width: 60, align: "center" },
                    { header: "계약기간", name: "cr_term", width: 140, align: "center" },
                    { header: "계약일", name: "cr_date", width: 70, mask: "date-ymd", align: "center" },
                    { header: "자동연장", name: "ext_term_nm", width: 60, align: "center" },
                    { header: "문서번호", name: "doc_no", width: 80, align: "center", format: { type: "link" } },
                    { name: "doc_id", editable: { type: "hidden" }, hidden: true },
                    { name: "ref_id", editable: { type: "hidden" }, hidden: true }
                ]
            };
            //----------
            gw_com_module.gridCreate(args);
        }
        //=====================================================================================

        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 },
                { type: "FORM", id: "frmData_MAIN2", offset: 8 },
                { type: "GRID", id: "grdData_DOC", offset: 8 }
            ]
        };

        if (v_global.logic.Step == "mgr") {
            args.target[4] = { type: "GRID", id: "grdData_REF", offset: 8 }
        } else if (v_global.logic.Step == "appr") {
            args.target[3] = { type: "GRID", id: "grdData_ALARM", offset: 8 }
        }
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();


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
        var args = { targetid: "lyrMenu", element: "보기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "lyrMenu", element: "보기2", event: "click", handler: processButton };
        //gw_com_module.eventBind(args);
        ////----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_SUB", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_DOC", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_DOC", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        if (v_global.logic.Step == "appr") {
        } else {
        //=====================================================================================
        var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_MAIN2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        }
        //=====================================================================================
        var args = { targetid: "grdData_DOC", grid: true, element: "file_download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_DOC", grid: true, element: "file_upload", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        if (v_global.logic.Step == "mgr") {
            var args = { targetid: "grdData_REF", grid: true, element: "doc_no", event: "click", handler: processLink };
            gw_com_module.eventBind(args);
        }

    }
    //#endregion

};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processClose(param) {

    if (gw_com_module.v_Session.USR_ID == "")
        window.close();
    else {
        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);
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
//----------
function processButton(param) {

    switch (param.element) {
        case "추가":
            {
                if (param.object == "lyrMenu") {
                    if (!checkUpdatable({ check: true })) return;
                } else {
                    if (!checkManipulate({})) return;
                    if (!checkUpdatable({ check: true })) return;
                }
                processInsert(param);
            }
            break;
        case "삭제":
            {
                if (param.object == "lyrMenu") {
                    v_global.process.handler = processRemove;
                    if (!checkManipulate({})) return;
                    checkRemovable({});
                } else {
                    if (!checkManipulate({})) return;
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
        case "보기":
            {
                processExport({});
            }
            break;
        case "보기2":
            {
                $.post("/Job/DLG_ECMDOCViewer.aspx", { doc_no: v_global.logic.doc_no }, function (result) {
                    v_global.logic.opener = result;
                    var win = window.open("/Job/DLG_POPUP.html", "_blank", "height=768, width=1024, resizable=yes, scrollbars=yes, toolbar=yes, menubar=no, location=no, directories=no, status=yes");
                    win.focus();
                });
            }
            break;
        case "항목":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;

                var args = {
                    url: "COM",
                    target: [
                        { type: "FORM", id: "frmData_MAIN", check: true },
                        { type: "GRID", id: "grdData_SUB", check: true },
                        { type: "GRID", id: "grdData_DOC", check: true }
                    ]
                };
                if (gw_com_module.objValidate(args) == false) return false;

                processExtField(param);
            }
            break;
        case "REMOVE":
            {
                v_global.process.handler = processRemove;
                if (!checkManipulate({})) return;
                checkRemovable({});
            }
            break;
        case "출력":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;

                var auth = Query.getAuth({ doc_id: v_global.logic.doc_id, user_id: gw_com_module.v_Session.USR_ID });
                if (auth != "1") {
                    gw_com_api.showMessage("열람 권한이 없습니다.");
                    return;
                }

                var args = {
                    page: "ECM_2020",
                    option: [
                        { name: "PRINT", value: "pdf" },
                        { name: "PAGE", value: "ECM_2020" },
                        { name: "USER", value: gw_com_module.v_Session.USR_ID },
                        { name: "DOC_ID", value: v_global.logic.doc_id },
                        { name: "DOC_NO", value: v_global.logic.doc_no }
                    ],
                    target: { type: "FILE", id: "lyrDown", name: v_global.logic.doc_no }
                };
                gw_com_module.objExport(args);
            }
            break;
        case "권한":
            {
                v_global.event.data = {
                    doc_id: v_global.logic.doc_id,
                    doc_no: v_global.logic.doc_no
                };
                var args = {
                    type: "PAGE", page: "ECM_1033", title: "열람요청 결재상신",
                    width: 600, height: 300, locate: ["center", "center"], open: true, scroll: true,
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "ECM_1033",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        //전자계약
        case "승인":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (gw_com_api.showMessage("승인처리 하시겠습니까?", "yesno")) {
                    var cert_yn = gw_com_api.getValue("frmData_MAIN", 1, "cert_yn");
                    if (cert_yn == "1") {
                        var ssn = gw_com_api.getValue("grdData_SUB", 1, "rgst_no", true);
                        if (!checkSignFile({ rgst_no: ssn })) {
                            var p = {
                                handler: rgstSignFile,
                                param: { rgst_no: ssn }
                            };
                            gw_com_api.messageBox([{ text: "인감 이미지 업로드 후 승인처리 할 수 있습니다." }], 450, undefined, undefined, p);
                            return;
                        }
                        var plain_txt = getPlainText({ doc_id: v_global.logic.doc_id });
                        if (plain_txt == "") plain_txt = v_global.logic.doc_no;
                        unisign.SignDataNVerifyVID(plain_txt, null, ssn,
                            function (rv, signedText, certAttrs) {
                                if (null === signedText || '' === signedText || false === rv) {
                                    unisign.GetLastError(
                                        function (errCode, errMsg) {
                                            if (errCode != "999")
                                                alert('Error code : ' + errCode + '\n\nError Msg : ' + errMsg);
                                        }
                                    );
                                } else {
                                    var args = {
                                        type: "SUPP_CERT_A",
                                        ext_data: signedText
                                    };
                                    processBatch(args);
                                }
                            }
                        );
                    } else {
                        var args = {
                            type: "SUPP_CERT_A",
                            ext_data: ""
                        };
                        processBatch(args);
                    }
                }
            }
            break;
        //전자계약
        case "반려":
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;
                if (!gw_com_api.showMessage("반려처리 하시겠습니까?", "yesno")) return;
                var args = {
                    type: "SUPP_CERT_B",
                    ext_data: ""
                };
                processBatch(args);
            }
            break;
        default:
            {
                if (!checkManipulate({})) return;
                if (!checkUpdatable({ check: true })) return;

                var msg = [];
                switch (param.element) {
                    case "REG":
                        {
                            msg[0] = { text: "계약등록 상태로 변경됩니다." };
                        }
                        break;
                    case "WAT_F":
                        {
                            msg[0] = { text: "계약서 파일을 등록할 수 있습니다." };
                        }
                        break;
                    case "WAT_A":
                        {
                            msg[0] = { text: "업체전송 상태로 변경됩니다." };
                        }
                        break;
                    case "CHK_A":
                        {
                            msg[0] = { text: "검토의뢰 상태로 변경됩니다." };
                        }
                        break;
                    case "CHK_B":
                        {
                            msg[0] = { text: "검토완료 상태로 변경됩니다." };
                        }
                        break;
                    case "CHK_C":
                        {
                            msg[0] = { text: "검토반려 상태로 변경됩니다." };
                        }
                        break;
                    case "CNL_A":
                        {
                            msg[0] = { text: "계약취소 상태로 변경됩니다." };
                        }
                        break;
                    case "CFM_B":
                        {
                            msg[0] = { text: "계약만료 알람을 중단합니다." };
                        }
                        break;
                }

                if (msg.length > 0) {
                    msg[1] = { text: "계속하시겠습니까?" };
                    gw_com_api.messageBox(msg, 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO", param);
                } else {
                    processBatch(param);
                }
            }
    }

}
//----------
function processItemchanged(param) {

    if (v_global.logic.Step == "chk") {
        if (param.object == "frmData_MAIN2") {
            var val = "";
            switch (param.element) {
                case "amount":
                    val = gw_com_api.unMask(param.value.current, "numeric-int");
                    break;
                case "chkl_date":
                case "chk_date":
                case "chk_req_date":
                    val = gw_com_api.unMask(param.value.current, "date-ymd");
                    break;
                case "ld_rate":
                    val = gw_com_api.unMask(param.value.current, "numeric-float");
                    break;
                default:
                    val = param.value.current;
            }
            gw_com_api.setValue("frmData_MAIN", 1, param.element, val, false, true, true);
            gw_com_api.setCRUD("frmData_MAIN", 1, "modify");

            if (param.element == "cstat") {
                gw_com_api.setValue(param.object, param.row, "chk_emp", gw_com_module.v_Session.EMP_NO, false, true, false);
                gw_com_api.setValue(param.object, param.row, "chk_emp_nm", gw_com_module.v_Session.USR_NM, false, true, false);
                gw_com_api.setValue(param.object, param.row, "chk_date", param.value.current == "090" ? gw_com_api.getDate() : "", false, true, false);
                gw_com_api.setValue("frmData_MAIN", 1, "chk_emp", gw_com_module.v_Session.EMP_NO, false, true, true);
                gw_com_api.setValue("frmData_MAIN", 1, "chk_date", param.value.current == "090" ? gw_com_api.getDate() : "", false, true, true);
            }
        }

    }
    else {
        if (param.object == "frmData_MAIN2") {
            var val = "";
            switch (param.element) {
                case "amount":
                    val = gw_com_api.unMask(param.value.current, "numeric-int");
                    break;
                case "chkl_date":
                    val = gw_com_api.unMask(param.value.current, "date-ymd");
                    break;
                default:
                    val = param.value.current;
            }

            gw_com_api.setValue("frmData_MAIN", 1, param.element, val, false, true, true);
            gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
        }
    }


}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    switch (param.element) {
        case "cr_emp_nm":
            {
                if (gw_com_module.v_Object[v_global.event.object].option[v_global.event.element].edit == false) return;
                args = {
                    type: "PAGE", page: "w_find_emp", title: "사원 검색",
                    width: 600, height: 450, locate: ["center", "top"], open: true,
                    id: gw_com_api.v_Stream.msg_selectEmployee
                };
            }
            break;
        default:
            return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: args.data } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processRetrieve(param) {

    var args;

    switch (v_global.logic.Step) {
        case "rqst":
        case "chk":
        case "find":
            if (param.object == "FILE" || param.object == "SUB") {
                var obj = param.object == "FILE" ? "grdData_DOC" : "grdData_SUB";
                args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_doc_id", value: v_global.logic.doc_id }
                        ]
                    },
                    target: [
                        { type: "GRID", id: obj, select: true }
                    ],
                    key: param.key
                };
            }
            else {
                args = {
                    key: param.key,
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_doc_id", value: v_global.logic.doc_id }
                        ]
                    },
                    target: [
                        { type: "FORM", id: "frmData_MAIN" },
                        { type: "FORM", id: "frmData_MAIN2" },
                        { type: "GRID", id: "grdData_SUB" },
                        { type: "GRID", id: "grdData_DOC" }
                    ],
                    handler: {
                        complete: processRetrieveEnd,
                        param: param
                    }
                };
            }
            break
        case "mgr":
            if (param.object == "REF" || param.object == "FILE" || param.object == "SUB") {
                var obj = "grdData_" + param.object;
                args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_doc_id", value: v_global.logic.doc_id }
                        ]
                    },
                    target: [
                        { type: "GRID", id: obj, select: true }
                    ],
                    key: param.key
                };
            }
            else {
                args = {
                    key: param.key,
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_doc_id", value: v_global.logic.doc_id }
                        ]
                    },
                    target: [
                        { type: "FORM", id: "frmData_MAIN" },
                        { type: "FORM", id: "frmData_MAIN2" },
                        { type: "GRID", id: "grdData_SUB" },
                        { type: "GRID", id: "grdData_DOC" },
                        { type: "GRID", id: "grdData_REF" }
                    ],
                    handler: {
                        complete: processRetrieveEnd,
                        param: param
                    }
                };
            }
            break
        case "appr":
            if (param.object == "FILE" || param.object == "SUB") {
                var obj = param.object == "FILE" ? "grdData_DOC" : "grdData_SUB";
                args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_doc_id", value: v_global.logic.doc_id }
                        ]
                    },
                    target: [
                        { type: "GRID", id: obj, select: true }
                    ],
                    key: param.key
                };
            }
            else {
                args = {
                    key: param.key,
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_doc_id", value: v_global.logic.doc_id },
                            { name: "arg_supp_cd", value: v_global.logic.supp_cd }
                        ]
                    },
                    target: [
                        { type: "FORM", id: "frmData_MAIN" },
                        { type: "GRID", id: "grdData_SUB" },
                        { type: "GRID", id: "grdData_DOC" }
                    ],
                    handler: {
                        complete: processRetrieveEnd,
                        param: param
                    }
                };
            }
            break

    }

    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    switch (v_global.logic.Step) {
        case "rqst":
        case "find":
        case "mrg":
            // 버튼
            setButton({ astat: gw_com_api.getValue("frmData_MAIN", 1, "astat") });
            break
        case "chk":
            stepbuttonset({ astat: gw_com_api.getValue("frmData_MAIN", 1, "astat") });
        case "appr":
            setapprButton({ astat: gw_com_api.getValue("frmData_MAIN", 1, "astat") });

    }

    // 신규
    if (param.edit) {
        gw_com_module.formEdit({
            targetid: "frmData_MAIN",
            edit: true
        });
        gw_com_module.formEdit({
            targetid: "frmData_MAIN2",
            edit: true
        });

        if (v_global.logic.Step == "mgr") {
            processButton({ object: "lyrMenu_SUB", element: "추가" });
        }
    }

}
//----------
function processInsert(param) {

    if (param.object == "lyrMenu_DOC") {

        if (!checkUpdatable({ check: true })) return;
        // 파일 등록
        v_global.event.data = {
            doc_id: v_global.logic.doc_id
        };
        var args = {
            type: "PAGE", page: "w_upload_ecm_file", title: "계약문서 등록",
            width: 650, height: 200, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_upload_ecm_file",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
        //// set data for "File Upload"
        //var dataType = "ECM_USR_FILE";    // Set File Data Type

        //// add by kyt 2021-06-03
        //var fileid = v_global.logic.doc_id;

        //// Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
        //v_global.event.data = { data_tp: dataType, data_key: fileid }; // additional 
        //// set Argument for Dialogue
        //var pageArgs = dataType + ":multi" + ":Simple"; // 1.DataType, 2.파일선택 방식(multi/single), 3.UI Type(Simple/GroupA/ECM)
        //var args = {
        //    type: "PAGE", open: true, locate: ["center", 100],
        //    width: 660, height: 500, scroll: true,  // multi( h:350, scroll) / single(h:300) / GroupA(h:500)
        //    page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        //    data: v_global.event.data  // reOpen 을 위한 Parameter
        //};

        //// Open dialogue
        //gw_com_module.dialogueOpenJJ(args);

    }
    else if (param.object == "lyrMenu_SUB") {

        v_global.event.data = {
            doc_id: v_global.logic.doc_id,
            doc_no: v_global.logic.doc_no
        }
        var args = {
            type: "PAGE", page: "ECM_1023", title: "협력사",
            width: 1000, height: 480, locate: ["center", "center"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }

    } else if (param.object == "lyrMenu_REF") {

        if (!checkUpdatable({ check: true })) return;
        // 연관 계약서 등록
        v_global.event.data = {
            doc_id: v_global.logic.doc_id
        };
        var args = {
            type: "PAGE", page: "w_find_ecm_item", title: "연관계약서 등록",
            width: 1100, height: 600, locate: ["center", "bottom"], open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_ecm_item",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: v_global.event.data
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }
    else {

        // 계약서 신규 등록
        var args = {
            type: "PAGE", page: "ECM_1021", title: "계약서 등록",
            width: 1000, height: 550, locate: ["center", "center"], open: true, scroll: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "ECM_1021",
                param: {
                    ID: gw_com_api.v_Stream.msg_openDialogue
                }
            };
            gw_com_module.dialogueOpen(args);
        }

    }

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_SUB") {
        args = {
            targetid: "grdData_SUB", row: "selected", select: true
        };
    }
    else if (param.object == "lyrMenu_DOC") {
        var obj = "grdData_" + param.object.split("_")[1];
        //if (gw_com_api.getValue(obj, "selected", "_edit_yn", true) == "0") return;
        args = {
            targetid: obj, row: "selected", select: true, check: "_edit_yn"
        };
    }
    else {
        args = {
            targetid: "frmData_MAIN", row: 1, remove: true,
            clear: [
                { type: "FORM", id: "frmData_MAIN2" },
                { type: "GRID", id: "grdData_SUB" }
            ]
        };
    }
    gw_com_module.gridDelete(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_MAIN",
                key: { element: [{ name: "doc_id" }] }
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    var title = "계약 진행";
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "ECM_1030",
            title: title
        }
    };
    gw_com_module.streamInterface(args);

}
function processFileSave(param) {
    var data = [
        {
            query: "ECM_1020_3",    // 계약문서
            row: [{
                crud: "U",
                column: [
                    { name: "docf_id", value: param.docf_id },
                    { name: "file_id", value: param.file_id }
                ]
            }]
        }
    ];
    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: data,
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.objSave(args);
}
//----------
function processSave(param) {
    if (v_global.logic.Step == "mgr") {
        var args = {
            url: "COM",
            target: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_DOC" },
                { type: "GRID", id: "grdData_REF" }
            ]
        };
    } else {

        var args = {
            url: "COM",
            target: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "GRID", id: "grdData_SUB" },
                { type: "GRID", id: "grdData_DOC" }
            ]
        };
    }

    if (gw_com_module.objValidate(args) == false) return false;

    // 연장기간 체크
    if (gw_com_api.getUpdatable("frmData_MAIN")) {
        if (gw_com_api.getValue("frmData_MAIN", 1, "ext_yn") == "1") {
            var err = false;
            if (gw_com_api.getValue("frmData_MAIN", 1, "ext_cnt") == "0" ||
                gw_com_api.getValue("frmData_MAIN", 1, "ext_cnt") == "" ||
                gw_com_api.getValue("frmData_MAIN", 1, "ext_cnt") == null) {
                gw_com_api.setError(true, "frmData_MAIN", 1, "ext_cnt", false);
                err = true;
            }
            if (gw_com_api.getValue("frmData_MAIN", 1, "ext_term") == "" ||
                gw_com_api.getValue("frmData_MAIN", 1, "ext_term") == null) {
                gw_com_api.setError(true, "frmData_MAIN", 1, "ext_term", false);
                err = true;
            }
            if (err) {
                gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
                return false;
            }
        } else {
            gw_com_api.setValue("frmData_MAIN", 1, "ext_cnt", "0");
            gw_com_api.setValue("frmData_MAIN", 1, "ext_term", "");
        }
    }
    gw_com_api.setError(false, "frmData_MAIN", 1, "ext_cnt", false);
    gw_com_api.setError(false, "frmData_MAIN", 1, "ext_term", false);

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

    // 시스템 정의 필드값 자동 생성
    var args = {
        url: "COM",
        procedure: "sp_createECMDocFieldValue",
        nomessage: true,
        input: [
            { name: "doc_id", value: v_global.logic.doc_id, type: "int" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ]
    };
    gw_com_module.callProcedure(args);
    if (v_global.logic.Step == "appr") {
        processPrint({});
        processRetrieve({ key: response });
    }

}
//----------
function processBatch(param) {

    if (param.element == "APPR_A") {
        var title = "체결품의";
        var args = {
            ID: gw_com_api.v_Stream.msg_linkPage,
            to: { type: "MAIN" },
            data: {
                page: "ECM_1029",
                title: title,
                param: [
                    { name: "doc_id", value: v_global.logic.doc_id },
                    { name: "doc_no", value: v_global.logic.doc_no }
                ]
            }
        };
        gw_com_module.streamInterface(args);
        processClose({});
    } else {
        if (param.element == "WAT_A") {
            if (!processCreateDoc({})) return;
        }
        var proc = {
            url: "COM",
            nomessage: true,
            procedure: "sp_updateECMDocStat",
            input: [
                { name: "type", value: "U", type: "varchar" },
                { name: "doc_id", value: v_global.logic.doc_id, type: "varchar" },
                { name: "sub_id", value: "%", type: "varchar" },
                { name: "pstat", value: param.element, type: "varchar" },
                { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
            ],
            output: [
                { name: "err_msg", type: "varchar" }
            ],
            handler: {
                success: successBatch,
                param: param
            }
        };
        gw_com_module.callProcedure(proc);
    }

}
//----------
function successBatch(response, param) {

    switch (v_global.logic.Step) {
        case "rqst":
        case "chk":
        case "find":
        case "mgr":
            if (response.VALUE[0] == "") {
                gw_com_api.showMessage("정상 처리되었습니다.");
                //processRetrieve({});
                gotoList({});
                processClose({});
            } else {
                gw_com_api.messageBox([{ text: response.VALUE[0] }]);
            }
            break
        case "appr":
            {
                if (response.VALUE[0] == "") {
                    gw_com_api.showMessage("정상 처리되었습니다.");
                    if (param.element == "WAT_F") {
                        processRetrieve({});
                    } else {
                        gotoList({});
                        processClose({});
                    }
                } else {
                    gw_com_api.messageBox([{ text: response.VALUE[0] }]);
                }

            }
            break
    }



}
//----------
function processExtField(param) {

    v_global.event.data = {
        doc_id: v_global.logic.doc_id,
        doc_no: v_global.logic.doc_no
    };
    var args = {
        type: "PAGE", page: "ECM_1022", title: "계약서 항목",
        width: 600, height: 500, locate: ["center", "center"], open: true, scroll: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processExport(param) {

    if (!checkManipulate({})) return;
    if (gw_com_api.getRowCount("grdData_SUB") < 1) {
        gw_com_api.messageBox([{ text: "계약 거래처를 등록하세요." }]);
        return;
    }

    var args = {
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "DOC_ID", value: v_global.logic.doc_id },
            { name: "DOC_NO", value: v_global.logic.doc_no }
        ],
        target: { type: "FILE", id: "lyrDown", name: v_global.logic.doc_no }
    };
    gw_com_module.objExport(args);

}
//----------
function processCreateDoc(param) {

    if (!checkManipulate({})) return false;
    if (gw_com_api.getRowCount("grdData_SUB") < 1) {
        gw_com_api.messageBox([{ text: "계약 거래처를 등록하세요." }]);
        return false;
    }

    var args = {
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: gw_com_module.v_Current.window },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "DOC_ID", value: v_global.logic.doc_id },
            { name: "DOC_NO", value: v_global.logic.doc_no }
        ],
        target: { type: "FILE", id: "ZZZ", name: v_global.logic.doc_no }
    };
    gw_com_module.objExport(args);

    return true;

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN", 1);

}
//----------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check == undefined ? false : param.check,
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "GRID", id: "grdData_SUB" },
            { type: "GRID", id: "grdData_DOC" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    if (v_global.logic.step == "mgr") {

        var status = checkCRUD({});
        if (status == "initialize" || status == "create")
            processDelete({});
        else {
            var args = {
                request: "DATA",
                name: "ECM_1050_1_CHK_DEL",
                url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                    "?QRY_ID=ECM_1050_1_CHK_DEL" +
                    "&QRY_COLS=deletable" +
                    "&CRUD=R" +
                    "&arg_doc_id=" + v_global.logic.doc_id +
                    "&arg_user_id=" + gw_com_module.v_Session.USR_ID +
                    "&arg_menu_id=" + gw_com_api.getPageID(),
                async: false,
                handler_success: successRequest
            };
            gw_com_module.callRequest(args);

            function successRequest(type, name, data) {

                if (data.DATA[0] == "1")
                    gw_com_api.messageBox([
                        { text: "REMOVE" }
                    ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

            }
        }
    } else {

        var status = checkCRUD({});
        if (status == "initialize" || status == "create")
            processDelete({});
        else
            gw_com_api.messageBox([
                { text: "REMOVE" }
            ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

    }
}
//----------
function processFile(param) {

    if (param.element == "file_upload") {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return;
        if (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") {
            gw_com_api.showMessage("수정할 수 없습니다.");
            return;
        }
        //// 파일 등록  del by kyt 2021-06-09
        //v_global.event.data = {
        //    doc_id: v_global.logic.doc_id,
        //    docf_id: gw_com_api.getValue(param.object, param.row, "docf_id", true)
        //};
        //var args = {
        //    type: "PAGE", page: "w_upload_ecm_file", title: "계약문서 등록",
        //    width: 650, height: 200, locate: ["center", "bottom"], open: true,
        //};
        //if (gw_com_module.dialoguePrepare(args) == false) {
        //    var args = {
        //        page: "w_upload_ecm_file",
        //        param: {
        //            ID: gw_com_api.v_Stream.msg_openedDialogue,
        //            data: v_global.event.data
        //        }
        //    };
        //    gw_com_module.dialogueOpen(args);
        //}
        // set data for "File Upload"
        var dataType = "ECM_USR_FILE";    // Set File Data Type

        // add by kyt 2021-06-03
        var dataKey = gw_com_api.getValue(param.object, param.row, "docf_id", true);
        var fileid = v_global.logic.doc_id;

        // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
        v_global.event.data = { data_tp: dataType, data_key: dataKey, file_id: fileid }; // additional 
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

    } else {
        var doc_id = v_global.logic.doc_id;
        var doc_no = v_global.logic.doc_no;
        var auth = (v_global.logic.appr ? "1" : Query.getAuth({ doc_id: doc_id, user_id: gw_com_module.v_Session.USR_ID }));

        if (auth != "1") {
            gw_com_api.showMessage("열람 권한이 없습니다.");
            return;
        } else {
            var args = {
                source: { id: param.object, row: param.row },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }

    }

}
//----------
function gotoList(param) {

    switch (v_global.logic.Step) {
        case "rqst":
            var title = "계약 진행";
        case "chk":
            var title = "계약 검토";
        case "find":
            var title = "계약 검색";
        case "mgr":
            var title = "계약 관리";
        case "appr":
            var title = "전자 계약";
    }
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: "PECM_Edit",
            title: title,
            param: [
                { name: "doc_id", value: v_global.logic.doc_id },
                { name: "doc_no", value: v_global.logic.doc_no },
                { name: "cr_date", value: gw_com_api.getValue("frmData_MAIN", 1, "cr_date") }
            ]
        }
    };
    gw_com_module.streamInterface(args);
}


//------ 2021-09-16 KYT
function setButton(param) {

    // 보기전용
    if (v_global.logic.view) {
        param.astat = "";
    }
    //-----------------------
    var args = {
        targetid: "lyrMenu", type: "FREE",
        element: [
            { name: "닫기", value: "닫기" }
        ]
    };
    //-----------------------
    var ele = [];
    switch (param.astat) {
        case "REG":         // 등록(작성)
            {
                ele[ele.length] = { name: "저장", value: "저장" };
                ele[ele.length] = { name: "항목", value: "업체전송", icon: "기타" };
                //ele[ele.length] = { name: "항목", value: "추가항목입력", icon: "기타" };
                //ele[ele.length] = { name: "WAT_A", value: "업체전송", icon: "기타" };
                ele[ele.length] = { name: "REMOVE", value: "계약삭제", icon: "삭제" };
            }
            break;
        case "WAT_A":       // 계약대기
            {
                ele[ele.length] = { name: "REG", value: "전송취소", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "WAT_B":       // 계약수신
            {
                ele[ele.length] = { name: "REG", value: "전송취소", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "WAT_C":       // 계약승인
            {
                ele[ele.length] = { name: "APPR_A", value: "체결품의", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "WAT_D":       // 계약반려
            {
                ele[ele.length] = { name: "WAT_A", value: "업체전송", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "WAT_E":       // 계약수정
            {
                ele[ele.length] = { name: "CHK_A", value: "검토의뢰", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "APPR_D":      // 결재반려
            {
                ele[ele.length] = { name: "APPR_A", value: "체결품의", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "CHK_A":       // 검토의뢰
            {
                ele[ele.length] = { name: "저장", value: "저장" };
                ele[ele.length] = { name: "항목", value: "추가항목입력", icon: "기타" };
                ele[ele.length] = { name: "CHK_B", value: "검토완료", icon: "기타" };
                ele[ele.length] = { name: "CHK_C", value: "검토반려", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "CHK_B":       // 검토완료
            {
                ele[ele.length] = { name: "CHK_CNL", value: "검토취소", icon: "기타" };
                ele[ele.length] = { name: "WAT_A", value: "업체전송", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "APPR_D":      // 결재반려
            {
                ele[ele.length] = { name: "APPR_A", value: "체결품의", icon: "기타" };
                ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
            }
            break;
        case "CNL_A":       // 계약취소
            {
                ele[ele.length] = { name: "재진행", value: "재진행", icon: "기타" };
                ele[ele.length] = { name: "REMOVE", value: "계약삭제", icon: "기타" };
            }
            break;
        case "CFM_B":       // 만료알람
            {
                ele[ele.length] = { name: "CFM_C", value: "알람종료", icon: "기타" };
            }
            break;
        case "CFM_A":       // 계약완료
        case "CFM_C":       // 계약만료
            {
                ele[ele.length] = { name: "CNL_B", value: "계약해지", icon: "기타" };
            }
            break;
        default:
            {
                if (param.astat == "" && gw_com_api.getValue("frmData_MAIN", 1, "astat").substring(0, 3) == "CFM") {
                    ele[ele.length] = { name: "출력", value: "출력" };
                    ele[ele.length] = { name: "권한", value: "열람요청", icon: "기타" };
                }
            }
            break;
    }

    if (ele.length > 0)
        args.element = ele.concat(args.element);
    //-----------------------
    gw_com_module.buttonMenu(args);
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================
    if (param.astat == "REG" || param.astat == "WAT_E") {
        gw_com_api.show("lyrMenu_SUB");
        gw_com_api.show("lyrMenu_DOC");
    } else {
        gw_com_api.hide("lyrMenu_SUB");
        gw_com_api.hide("lyrMenu_DOC");
    }

}
//----------
//var Query = {
//    getAuth: function (param) {
//        var rtn = "";
//        var args = {
//            request: "PAGE",
//            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
//                "?QRY_ID=ECM_1032_9" +
//                "&QRY_COLS=auth_yn" +
//                "&CRUD=R" +
//                "&arg_doc_id=" + param.doc_id + "&arg_user_id=" + param.user_id,
//            handler_success: successRequest
//        };
//        //=================== async : false ========================
//        $.ajaxSetup({ async: false });
//        //----------
//        gw_com_module.callRequest(args);
//        function successRequest(data) {
//            rtn = data[0].DATA[0];
//        }
//        //----------
//        $.ajaxSetup({ async: true });
//        //=================== async : true ========================
//        return rtn
//    }
//}
//----------
function processApprRetrieve(param) {


    

}
//step별 가독성을 위한 2021-09-16 KYT
function stepbuttonset(param) {

    // 보기전용
    if (v_global.logic.view) {
        param.astat = "";
    }
    //-----------------------
    var args = {
        targetid: "lyrMenu", type: "FREE",
        element: [
            { name: "닫기", value: "닫기" }
        ]
    };
    //-----------------------
    var ele = [];
        switch (param.astat) {
            case "REG":         // 등록(작성)
                {
                    ele[ele.length] = { name: "저장", value: "저장" };
                    ele[ele.length] = { name: "항목", value: "추가항목입력", icon: "기타" };
                    ele[ele.length] = { name: "WAT_A", value: "업체전송", icon: "기타" };
                    ele[ele.length] = { name: "REMOVE", value: "계약삭제", icon: "삭제" };
                }
                break;
            case "WAT_A":       // 계약대기
                {
                    ele[ele.length] = { name: "REG", value: "전송취소", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "WAT_B":       // 계약수신
                {
                    ele[ele.length] = { name: "REG", value: "전송취소", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "WAT_C":       // 계약승인
                {
                    ele[ele.length] = { name: "APPR_A", value: "체결품의", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "WAT_D":       // 계약반려
                {
                    ele[ele.length] = { name: "WAT_A", value: "업체전송", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "WAT_E":       // 계약수정
                {
                    ele[ele.length] = { name: "CHK_A", value: "검토의뢰", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "CHK_A":       // 검토의뢰
                {
                    ele[ele.length] = { name: "저장", value: "저장" };
                    ele[ele.length] = { name: "항목", value: "추가항목입력", icon: "기타" };
                    ele[ele.length] = { name: "CHK_B", value: "검토완료", icon: "기타" };
                    ele[ele.length] = { name: "CHK_C", value: "검토반려", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "CHK_B":       // 검토완료
                {
                    ele[ele.length] = { name: "CHK_CNL", value: "검토취소", icon: "기타" };
                    ele[ele.length] = { name: "WAT_A", value: "업체전송", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "APPR_D":      // 결재반려
                {
                    ele[ele.length] = { name: "APPR_A", value: "체결품의", icon: "기타" };
                    ele[ele.length] = { name: "CNL_A", value: "계약취소", icon: "기타" };
                }
                break;
            case "CNL_A":       // 계약취소
                {
                    ele[ele.length] = { name: "재진행", value: "재진행", icon: "기타" };
                    ele[ele.length] = { name: "REMOVE", value: "계약삭제", icon: "기타" };
                }
                break;
            case "CFM_B":       // 만료알람
                {
                    ele[ele.length] = { name: "CFM_C", value: "알람종료", icon: "기타" };
                }
                break;
            case "CFM_A":       // 계약완료
            case "CFM_C":       // 계약만료
                {
                    ele[ele.length] = { name: "CNL_B", value: "계약해지", icon: "기타" };
                }
                break;
        }
    


    if (ele.length > 0)
        args.element = ele.concat(args.element);
    //-----------------------
    gw_com_module.buttonMenu(args);
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================
    if (param.astat == "REG" || param.astat == "WAT_E") {
        gw_com_api.show("lyrMenu_SUB");
        gw_com_api.show("lyrMenu_DOC");
    } else {
        gw_com_api.hide("lyrMenu_SUB");
        gw_com_api.hide("lyrMenu_DOC");
    }

    var Query = {
        getAuth: function (param) {
            var rtn = "";
            var args = {
                request: "PAGE",
                url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=ECM_1032_9" +
                    "&QRY_COLS=auth_yn" +
                    "&CRUD=R" +
                    "&arg_doc_id=" + param.doc_id + "&arg_user_id=" + param.user_id,
                handler_success: successRequest
            };
            //=================== async : false ========================
            $.ajaxSetup({ async: false });
            //----------
            gw_com_module.callRequest(args);
            function successRequest(data) {
                rtn = data[0].DATA[0];
            }
            //----------
            $.ajaxSetup({ async: true });
            //=================== async : true ========================
            return rtn
        }
    }
}
function setapprButton(param) {

    // 보기전용
    if (v_global.logic.view) {
        param.astat = "";
    }
    //-----------------------
    var args = {
        targetid: "lyrMenu", type: "FREE",
        element: [
            { name: "출력", value: "출력" },
            { name: "닫기", value: "닫기" }
        ]
    };
    ////-----------------------
    //var args = {
    //    targetid: "lyrMenu", type: "FREE",
    //    element: [
    //        //{ name: "항목", value: "추가항목입력", icon: "기타", updatable: true },
    //        //{ name: "저장", value: "저장" },
    //        //{ name: "승인", value: "승인", icon: "기타", updatable: true },
    //        //{ name: "반려", value: "반려", icon: "기타", updatable: true },
    //        { name: "닫기", value: "닫기" }
    //    ]
    //};
    ////-----------------------
    //gw_com_module.buttonMenu(args);
    ////=====================================================================================

    var ele = [];
    switch (param.astat) {
        case "WAT_B":       // 계약수신
            {
                ele[ele.length] = { name: "항목", value: "추가항목입력", icon: "기타" };
                ele[ele.length] = { name: "저장", value: "저장" };
                if (gw_com_api.getValue("frmData_MAIN", 1, "edit_yn") == "1")
                    ele[ele.length] = { name: "WAT_F", value: "계약수정", icon: "기타" };
                ele[ele.length] = { name: "승인", value: "승인", icon: "기타" };
                ele[ele.length] = { name: "반려", value: "반려", icon: "기타" };
            }
            break;
        case "WAT_F":       // 업체수정
            {
                ele[ele.length] = { name: "WAT_E", value: "수정완료", icon: "기타" };
            }
            break;
        case "WAT_E":       // 계약수정
            {
                ele[ele.length] = { name: "WAT_F", value: "수정취소", icon: "기타" };
            }
            break;
    }

    if (ele.length > 0)
        args.element = ele.concat(args.element);
    //-----------------------
    gw_com_module.buttonMenu(args);
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================
    if (param.astat == "REG" || param.astat == "WAT_E") {
        gw_com_api.show("lyrMenu_SUB");
        gw_com_api.show("lyrMenu_DOC");
    } else {
        gw_com_api.hide("lyrMenu_SUB");
        gw_com_api.hide("lyrMenu_DOC");
    }

}
//---------- 2021-09-16 KYT 계약관리 process
function processLink(param) {

    var doc_id = gw_com_api.getValue(param.object, param.row, "ref_id", true);
    if (doc_id != "") {
        var args = {
            to: "INFO_ECM",
            doc_id: doc_id,
            mng: true
        }
        gw_com_site.linkPage(args);
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 전자게약 모듈
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processPrint(param) {

    //var args = {
    //    page: "ECM_1020",
    //    option: [
    //        { name: "PRINT", value: "pdf" },
    //        { name: "PAGE", value: "ECM_1020" },
    //        { name: "USER", value: gw_com_module.v_Session.USR_ID },
    //        { name: "DOC_ID", value: v_global.logic.doc_id },
    //        { name: "DOC_NO", value: v_global.logic.doc_no }
    //    ],
    //    target: { type: "FILE", id: "ZZZ", name: v_global.logic.doc_no }
    //};
    //gw_com_module.objExport(args);

    var params = {
        DATA: {
            USER: gw_com_module.v_Session.USR_ID,
            OPTION: {
                NAME: ["PRINT", "PAGE", "USER", "DOC_ID", "DOC_NO"],
                VALUE: ["pdf", ".aspx/Print", gw_com_module.v_Session.USR_ID, v_global.logic.doc_id, v_global.logic.doc_no]
            }
        }
    };
    var param = {
        request: "SERVICE",
        url: "ECM_1020.aspx/Print",
        params: JSON.stringify(params)
    };
    gw_com_module.callRequest(param);

}
function getPlainText(param) {

    var rtn = "";
    $.ajax({
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=ECM_2020_9" +
            "&QRY_COLS=doc_content" +
            "&CRUD=R" +
            "&arg_doc_id=" + param.doc_id,
        type: 'post',
        cache: false,
        async: false,
        data: "{}",
        success: function (data, status) {
            var response = JSON.parse(data);
            if (response.iCode == 0) {
                rtn = response.tData[0].DATA[0];
            }
        }
    });

    return rtn;

}
function checkSignFile(param) {

    var rtn = false;
    $.ajax({
        url: "/Files/ECM_FILES/SIGN_FILES/" + param.rgst_no + ".png",
        type: 'HEAD',
        async: false,
        error: function () {
            rtn = false;
        },
        success: function () {
            rtn = true;
        }
    });
    return rtn;

}
function rgstSignFile(param) {

    v_global.event.data = {
        rgst_no: param.rgst_no
    }
    var args = {
        type: "PAGE", page: "ECM_2099", title: "전자계약용 도장 이미지",
        width: 300, height: 370, open: true,
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function setfileList(param) {

    if (param.toParm) {
        v_global.logic.to = [];
        var ids = gw_com_api.getRowIDs("grdData_DOC");
        $.each(ids, function () {
            v_global.logic.to.push({
                //dp_nm: gw_com_api.getValue("grdList_RECEIVER", this, "name", true) + "(" + gw_com_api.getValue("grdList_RECEIVER", this, "value", true) + ")",
                docf_id: gw_com_api.getValue("grdData_DOC", this, "docf_id", true),
                file_id: gw_com_api.getValue("grdData_DOC", this, "file_id", true),
                /*      user_id: gw_com_api.getValue("grdData_DOC", this, "user_id", true)*/
            });
        });
    } else {
        gw_com_module.objClear({
            target: [{ type: "GRID", id: "grdData_DOC" }]
        });

        var args = {
            targetid: "grdData_DOC",
            data: v_global.logic.to
        };
        gw_com_module.gridInserts(args);
    }

}
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
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
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
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch(param.data.arg);
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "ECM_1021":
                        break;
                    case "ECM_1022":
                    case "ECM_1023":
                    case "ECM_1033":
                    /* case "w_upload_ecm_file":*/
                    case "w_upload_ecm_file":
                    case "w_find_ecm_item":
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
                switch (param.from.page) {
                    case "ECM_1021":
                        {
                            if (param.data != undefined) {
                                v_global.logic.doc_id = param.data.doc_id;
                                v_global.logic.doc_no = param.data.doc_no;
                                processRetrieve({ edit: true });
                                processInsert({ object: "lyrMenu_SUB" });
                            }
                        }
                        break;
                    case "ECM_1022":
                        {
                            if (param && param.data && param.data.send) {
                                gotoList({});
                                processClose({});
                            } else
                                processRetrieve({});
                        }
                        break;
                    case "ECM_1023":
                        {
                            processRetrieve({ object: "SUB" });
                            processExtField({});
                        }
                        break;
                    case "SYS_FileUpload":
                        {

                            if (param.data != undefined) {

                                var args = {
                                    docf_id: param.data[0].data_key,
                                    file_id: param.data[0].file_id,
                                    file_path: param.data[0].file_path,
                                    file_ext: param.data[0].file_ext
                                };
                                processFileSave(args);
                            }
                        }
                        break;
                    case "w_upload_ecm_file":
                    case "w_find_ecm_item":
                        {
                            if (param.data != undefined) {
                                processRetrieve({ object: "FILE", key: param.data });
                            }
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_processedDialogue:
            {
                switch (param.from.page) {
                    case "ECM_1023":
                        if (param.data != undefined) {
                            // default
                            var row = new Array();
                            $.each(param.data, function () {
                                var supp_cd = this.supp_cd;
                                this.doc_id = v_global.logic.doc_id;
                                if (gw_com_api.getFindRow("grdData_SUB", "supp_cd", supp_cd) < 1) {
                                    var push = true;
                                    $.each(row, function () {
                                        if (this.supp_cd == supp_cd) push = false;
                                    });
                                    if (push) {
                                        this.supp_tp = gw_com_api.getFindRow("grdData_SUB", "supp_tp", "2") < 1 ? "2" : "3";
                                        row.push(this);
                                    }
                                }
                            });

                            if (row.length > 0) {
                                var args = {
                                    targetid: "grdData_SUB", edit: true, updatable: true,
                                    data: row
                                };
                                gw_com_module.gridInserts(args);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_linkPage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                if (param.data != undefined) {
                    gw_com_api.setValue(
                        v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        param.data.emp_nm,
                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                        v_global.event.object,
                        v_global.event.row,
                        v_global.event.element.substr(0, v_global.event.element.length - 3),
                        param.data.emp_no,
                        (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }
}