//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : 설계 Guide 문서 관리
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

    //--------------------------------------------------------------------------
    // entry point. (pre-process section)
    //--------------------------------------------------------------------------
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List & call start()
        var args = {
            request: [
                {
                    type: "PAGE", name: "dddwUserEmp", query: "dddw_emp_usr"   //사원
                },
                {
                    type: "PAGE", name: "dddwDept", query: "dddw_dept"   //부서
                },
                { 
                    type: "PAGE", name: "dddwBizDept", query: "dddw_deptarea_in",   //장비군
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                {
                    type: "PAGE", name: "dddwDocClass", query: "dddw_zcode",    //문서구분
                    param: [{ argument: "arg_hcode", value: "EdmDocClass" }]
                },
                {
                    type: "PAGE", name: "dddwImportance", query: "dddw_zcode",  //중요도
                    param: [{ argument: "arg_hcode", value: "IQDM15" }]
                },
                {
                    type: "PAGE", name: "dddwCustomer", query: "dddw_zcode",  //고객사
                    param: [{ argument: "arg_hcode", value: "ISCM29" }]
                },
                {
                    type: "INLINE", name: "dddwProdType",     //설비유형
                    data: [
                        { title: "사내설비", value: "사내설비" },
                        { title: "양산설비", value: "양산설비" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwProdTypeAll",     //설비유형
                    data: [
                        { title: "ALL", value: "%" },
                        { title: "사내설비", value: "사내설비" },
                        { title: "양산설비", value: "양산설비" }
                    ]
                },
                {
                    type: "PAGE", name: "dddwGroup1", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB05" }]
                },
                { type: "PAGE", name: "dddwGroup2", query: "dddw_ecr_module" },
                {
                    type: "PAGE", name: "dddwGroup3", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB07" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process
        function start() {

            // Create UI Controls
            gw_job_process.uiButton();
            gw_job_process.UI();

            // Set Default Values
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));

            gw_job_process.procedure();
            gw_com_module.startPage();  // resizeFrame & Set focus

            //// Get Initial Data
            //var args = {
            //    request: "DATA", name: "PCN_1010_1_OPTION", async: false, handler_success: successRequest,
            //    url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            //        "?QRY_ID=PCN_1010_1_OPTION" +
            //        "&QRY_COLS=supp_cds,supp_nm" +
            //        "&CRUD=R"
            //};
            //gw_com_module.callRequest(args);
            //function successRequest(type, name, data) {
            //    if (data.DATA.length >= 0) {
            //        v_global.logic.supp_cd = data.DATA[0];
            //        v_global.logic.supp_nm = data.DATA[1];
            //    } else {
            //        v_global.logic.supp_cd = "";
            //        v_global.logic.supp_nm = "";
            //    }
            //}
        }
    },

    //--------------------------------------------------------------------------
    // manage UI. (design section)
    //--------------------------------------------------------------------------
    uiButton: function() {
        // Create Buttons
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "lyrMenu_List", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "수정", value: "상세", icon: "실행" },
                { name: "Print", value: "출력" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "lyrMenu_Edit", type: "FREE",
            element: [
                { name: "실행", value: "새로고침", icon: "Act" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "lyrMenu_File", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        gw_com_module.buttonMenu(args);
    },

    // Create Data Blocks
    //---------------------------------------------------------------------------------
    UI: function () {

        //-- FORM : Find Option
        var args = {
            targetid: "frmOption", query: "PCN_1010_1_OPTION", title: "조회 조건", type: "FREE",
            trans: true, border: true, show: true, margin_top: 70,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    { element: [
                        {
                            name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 10 }
                        },
                        {
                            name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                            editable: { type: "text", size: 7, maxlength: 10 }
                        },
                        {
                            name: "biz_dept", label: { title: "장비군 :" },
                            editable: { type: "select", data: { memory: "dddwBizDept" } }   //, unshift: (gw_com_module.v_Session.DEPT_AUTH == "ALL" ? [{ title: "전체", value: "" }] : [])
                        },
                        {
                            name: "prod_tp", label: { title: "설비유형 :" },
                            editable: { type: "select", data: { memory: "dddwProdTypeAll" } }   //, unshift: (gw_com_module.v_Session.DEPT_AUTH == "ALL" ? [{ title: "전체", value: "" }] : [])
                        }
                    ] },
                    { element: [
                        {
                            name: "doc_title", label: { title: "제안명 :" }, //mask: "search",
                            editable: { type: "text", size: 20 }
                        },
                        {
                              name: "cust_cd", label: { title: "고객사 :" },
                              editable: { type: "select", data: { memory: "dddwCustomer" } }   //, unshift: (gw_com_module.v_Session.DEPT_AUTH == "ALL" ? [{ title: "전체", value: "" }] : [])
                        }
                    ]
                    },
                    {
                        element: [
                            {
                                name: "key_word", label: { title: "키워드 :" }, //mask: "search",
                                editable: { type: "text", size: 20 }
                            },
                            {
                                name: "doc_no", label: { title: "문서번호 :" }, //mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "user_nm", label: { title: "작성자 :" },
                                editable: { type: "text", size: 8 }   //, unshift: (gw_com_module.v_Session.DEPT_AUTH == "ALL" ? [{ title: "전체", value: "" }] : [])
                            }
                        ]
                    }
                ]
            }
        };
        // Adding form's row
        args.content.row.push({
            element: [
                { name: "실행", value: "실행", act: true, format: { type: "button" } },
                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
            ], align: "right"
        });
        gw_com_module.formCreate(args);
        //-- GRID : Main List
        var args = {
            targetid: "grdList_MAIN", query: "EDM_DocGuide_List", title: "설계 Guide Document List",
            caption: false, height: 420, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "문서번호", name: "doc_no", width: 80, align: "center" },
                { header: "장비군", name: "biz_dept", width: 60 },
                { header: "제안명", name: "doc_title", width: 100 },
                { header: "중요도", name: "doc_level", width: 50, align: "center", format: { type: "select", data: { memory: "dddwImportance" } } },
                { header: "문서구분", name: "doc_class", width: 50, align: "center", format: { type: "select", data: { memory: "dddwDocClass" } } },
                { header: "고객사", name: "cust_cd", width: 80, align: "center", format: { type: "select", data: { memory: "dddwCustomer" } } },
                { header: "설비유형", name: "prod_tp", width: 150, format: { type: "select", data: { memory: "dddwProdType" } } },
                { header: "분류1", name: "group1_cd", width: 80, format: { width: 155, type: "select", data: { memory: "dddwGroup1" } } },
                { header: "분류2", name: "group2_cd", width: 80, format: { width: 155, type: "select", data: { memory: "dddwGroup2" } } },
                { header: "분류3", name: "group3_cd", width: 80, format: { width: 155, type: "select", data: { memory: "dddwGroup3" } } },
                { header: "작성자", name: "rgst_user_nm", width: 50, align: "center" },
                { header: "작성부서", name: "rgst_dept_nm", width: 120 },
                { header: "작성일", name: "rgst_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "KeyWord", name: "key_word", width: 150 },
                { header: "제안개요", name: "doc_desc", width: 250 },
                { name: "rgst_user", hidden: true },
                { name: "rgst_dept", hidden: true },
                { name: "appr_yn", hidden: true },
                { name: "appr_user", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //-- FORM : Edit Main
        createDW({});

        //-- FORM : Edit Sub Title
        var args = {
            targetid: "frmData_TitleA", query: "EDM_DocGuide_R", title: "변경 전", type: "TABLE", align: "center",
            caption: true, show: true, selectable: false,
            content: {
                width: { field: "100%" }, height: 0,
                row: [{
                    element: [
                        { name: "rmk_text", header: false},
                        { name: "doc_no", hidden: true },
                        { name: "rmk_cd", hidden: true }
                    ]
                }] // end row
            } // end content
        }; // end args
        gw_com_module.formCreate(args);

        args.targetid = "frmData_TitleB"; args.title = "변경 후";
        gw_com_module.formCreate(args);

        //-- FORM : Edit Sub - HTML Editor
        var args = {
            targetid: "frmData_MemoA1", query: "EDM_DocGuide_R", title: "Issue 대표 Image", type: "TABLE",
            caption: true, show: true, fixed: true, selectable: true, editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 208,
                row: [{
                    element: [
                        { name: "rmk_html", format: { type: "html", height: 200 } },
                        { name: "rmk_text", hidden: true, editable: { hidden: true } },
                        { name: "doc_no", hidden: true, editable: { hidden: true } },
                        { name: "rmk_cd", hidden: true, editable: { hidden: true } }
                    ]
                }] // end row
            } // end content
        };
        gw_com_module.formCreate(args);

        // Event 발생 시 param.object 값이 마지막 것으로만 넘어오는 오류가 있어서 clone 을 사용함 by JJJ
        // 추후 Event 생성 로직 점검 및 clone 함수를 gw_api_com으로 이전 필요
        var args2 = getClone(args);
        args2.targetid = "frmData_MemoB1"; args2.title = "IPS 기준 대표 Image";
        gw_com_module.formCreate(args2);

        var args2 = getClone(args);
        args2.targetid = "frmData_MemoA2"; args2.title = "Issue 상세 Image";
        gw_com_module.formCreate(args2);

        var args2 = getClone(args);
        args2.targetid = "frmData_MemoB2"; args2.title = "IPS 기준 상세 Image";
        gw_com_module.formCreate(args2);

        //-- FORM : Edit Sub - Text Area
        var args = {
            targetid: "frmData_TextA1", query: "EDM_DocGuide_R", title: "Issue 요약", type: "TABLE",
            caption: true, show: true, selectable: true, editable: { bind: "select", validate: true },
            content: {
                width: { field: "100%" }, height: 200,
                row: [{
                    element: [
                        {
                            name: "rmk_text", header: false,
                            format: { type: "textarea", rows: 14, width: 300 },
                            editable: { type: "textarea", rows: 14, width: 300 }
                        },
                        { name: "doc_no", hidden: true },
                        { name: "rmk_cd", hidden: true }
                    ]
                }] // end row
            } // end content
        }; // end args
        gw_com_module.formCreate(args);

        args.targetid = "frmData_TextA2"; args.title = "Issue 상세내용";
        gw_com_module.formCreate(args);
        args.targetid = "frmData_TextB1"; args.title = "IPS 기준 요약";
        gw_com_module.formCreate(args);
        args.targetid = "frmData_TextB2"; args.title = "IPS 기준 상세내용";
        gw_com_module.formCreate(args);

        //-- GRID : Attached File
        var args = {
            targetid: "grdData_FILE", query: "DLG_FILE_ZFILE_V", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 250, align: "left" },
                { header: "등록부서", name: "upd_dept", width: 100, align: "center" },
                { header: "등록자", name: "upd_usr", width: 60, align: "center" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 380, align: "left",
                    editable: { type: "text" }
                },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ] // end element
        }; // end args
        gw_com_module.gridCreate(args);

        //-- Layer for File download
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        //-- Resize Objects
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                //{ type: "FORM", id: "frmData_MAIN", offset: 8 },
                { type: "FORM", id: "frmData_TitleA", offset: 8 },
                { type: "FORM", id: "frmData_TitleB", offset: 8 },
                { type: "FORM", id: "frmData_MemoA1", offset: 8 },
                { type: "FORM", id: "frmData_TextA1", offset: 8 },
                { type: "FORM", id: "frmData_MemoB1", offset: 8 },
                { type: "FORM", id: "frmData_TextB1", offset: 8 },
                { type: "FORM", id: "frmData_MemoA2", offset: 8 },
                { type: "FORM", id: "frmData_TextA2", offset: 8 },
                { type: "FORM", id: "frmData_MemoB2", offset: 8 },
                { type: "FORM", id: "frmData_TextB2", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

        //-- Layer for Tab
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "Library List" },
                { type: "LAYER", id: "lyrTab_2", title: "Guide Editor" }
            ]
        };
        gw_com_module.convertTab(args);
        var args = {
            target: [
                { type: "TAB", id: "lyrTab", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

        //-- resizeFrame
        gw_com_module.informSize();

    },

    //--------------------------------------------------------------------------
    // manage process. (program section)
    //--------------------------------------------------------------------------
    procedure: function () {

        // Find Option Buttons
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        // List Main Buttons
        var args = { targetid: "lyrMenu_List", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_List", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_List", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_List", element: "Print", event: "click", handler: processExport };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_List", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        // Edit Main Buttons
        var args = { targetid: "lyrMenu_Edit", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Edit", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Edit", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Edit", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        // Edit File Buttons
        var args = { targetid: "lyrMenu_File", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_File", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);

        // Events : itemdblclick, itemkeyenter, itemchanged, rowselected, tabselect, click
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdList_MAIN", event: "rowdblclick", handler: processEdit, grid: true };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoA1", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoA2", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoB1", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmData_MemoB2", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrTab", event: "tabselect", handler: processTabChange };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_FILE", event: "click", handler: processFile, grid: true, element: "download" };
        gw_com_module.eventBind(args);

    }
};

//----------
function createDW(param) {

    var edit_yn = param.astat == "" || param.astat == "작성" ? true : false;
    //=====================================================================================
    var args = {
        targetid: "frmData_MAIN", query: "EDM_DocGuide_M", type: "TABLE", title: "설계 Guide 문서정보",
        caption: false, show: true, selectable: true,
        editable: { bind: "select", focus: "doc_class", validate: true },
        content: {
            width: { label: 100, field: 200 }, height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "문서번호", format: { type: "label" } },
                        { name: "doc_no", format: { type: "text" }, editable: { type: "hidden" } },
                        { header: true, value: "문서구분", format: { type: "label" } },
                        {
                            name: "doc_class",
                            format: { type: "select", data: { memory: "dddwDocClass" } },
                            editable: {
                                type: "select", width: 155, validate: { rule: "required" },
                                data: { memory: "dddwDocClass", unshift: [{ title: "", value: "" }] }
                            }
                        },
                        { header: true, value: "중요도", format: { type: "label" } },
                        {
                            name: "doc_level",
                            format: { type: "select", data: { memory: "dddwImportance" } },
                            editable: {
                                type: "select", width: 155, validate: { rule: "required" },
                                data: { memory: "dddwImportance", unshift: [{ title: "", value: "" }] }
                            }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "제안명", format: { type: "label" } },
                        { name: "doc_title", editable: { type: "text" }, style: { colspan: 3 } },
                        { header: true, value: "키워드", format: { type: "label" } },
                        { name: "key_word", editable: { type: "text" } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "제안개요", format: { type: "label" } },
                        {
                            name: "doc_desc", style: { colspan: 5 },
                            editable: { type: "text", width: 800 }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "장비군", format: { type: "label" } },
                        {
                            name: "biz_dept",
                            format: { type: "select", data: { memory: "dddwImportance" } },
                            editable: {
                                type: "select", data: { memory: "dddwBizDept" }, validate: { rule: "required" },
                                change: [
                                    { name: "group2_cd", memory: "dddwGroup2", unshift: [{ title: "", value: "" }], key: ["biz_dept", "group1_cd"] }
                                ]
                            }
                        },
                        { header: true, value: "고객사", format: { type: "label" } },
                        {
                            name: "cust_cd",
                            format: { type: "select", data: { memory: "dddwCustomer" } },
                            editable: { type: "select", data: { memory: "dddwCustomer" }, validate: { rule: "required" } }
                        },
                        { header: true, value: "설비유형", format: { type: "label" } },
                        {
                            name: "prod_tp",
                            format: { type: "select", data: { memory: "dddwProdType" } },
                            editable: { type: "select", data: { memory: "dddwProdType" }, validate: { rule: "required" } }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "작성자", format: { type: "label" } },
                        { name: "rgst_user_nm", editable: { type: "hidden" } },
                        { name: "rgst_user", hidden: true },
                        { header: true, value: "작성부서", format: { type: "label" } },
                        { name: "rgst_dept_nm", editable: { type: "hidden" } },
                        { name: "rgst_dept", hidden: true },
                        { header: true, value: "작성일", format: { type: "label" } },
                        { name: "rgst_ymd", editable: { type: "hidden" }, mask: "date-ymd" }
                    ]
                },
                {
                    element: [
                        { header: true, value: "분류", format: { type: "label" } },
                        {
                            name: "group1_cd", style: { colspan: 5, colfloat: "float" },
                            format: { width: 155, type: "select", data: { memory: "dddwGroup1" } },
                            editable: {
                                type: "select", width: 155, validate: { rule: "required" },
                                data: { memory: "dddwGroup1", unshift: [{ title: "", value: "" }] },
                                change: [{ name: "group2_cd", memory: "dddwGroup2", unshift: [{ title: "", value: "" }], key: ["biz_dept", "group1_cd"] }]
                            }
                        },
                        {
                            name: "group2_cd", style: { colfloat: "floating" },
                            format: { width: 155, type: "select", data: { memory: "dddwGroup2" } },
                            editable: {
                                type: "select", width: 155,
                                data: { memory: "dddwGroup2", unshift: [{ title: "", value: "" }], key: ["biz_dept", "group1_cd"] },
                                validate: { rule: "required" }
                            }
                        },
                        {
                            name: "group3_cd", style: { colfloat: "floating" }, //Display: true, //Update 되지 않는 컬럼  
                            format: { width: 155, type: "select", data: { memory: "dddwGroup3" } },
                            editable: { type: "select", data: { memory: "dddwGroup3" }, validate: { rule: "required" } }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "승인상태", format: { type: "label" } },
                        { name: "appr_yn", editable: { type: "hidden" } },
                        { header: true, value: "승인자", format: { type: "label" } },
                        { name: "appr_user", editable: { type: "hidden", width: 128 } },
                        { header: true, value: "승인일시", format: { type: "label" } },
                        { name: "appr_dt", editable: { type: "hidden", width: 200 } }]
                }
            ]
        }
    };
    //----------
    //if (edit_yn) {
    //    args.content.row[0].element[1] = {
    //        name: "dept_area",
    //        editable: { type: "select", data: { memory: "dddwBizDept" }, width: 170, validate: { rule: "required", message: "장비군" } }
    //    };                                                                                                                                                                      //장비군
    //    args.content.row[0].element[2] = { name: "dept_area_nm", hidden: true };                                                                                                //장비군명
    //    args.content.row[1].element[3].editable = { type: "text", width: 128, maxlength: 10, validate: { rule: "required", message: "작성자" } };                               //작성자
    //    args.content.row[1].element[5].editable = { type: "text", width: 128, maxlength: 10, validate: { rule: "required", message: "직급" } };                                 //직급
    //    args.content.row[1].element[7].editable = { type: "text", width: 166, maxlength: 100, validate: { rule: "required", message: "E-Mail" } };                              //E-Mail
    //    args.content.row[2].element[1].editable = { type: "text", width: 166 };                                                                                                 //품번
    //    args.content.row[2].element[1].mask = "search";                                                                                                                         //품번
    //    args.content.row[2].element[3].editable = { type: "text", width: 416 };                                                                                                 //품명
    //    args.content.row[2].element[5].editable = { type: "text", width: 166 };                                                                                                 //연락처
    //    args.content.row[3].element[1].editable = { type: "select", data: { memory: "dddwDocClass" }, width: 170, validate: { rule: "required", message: "문서구분" } };        //문서구분
    //    args.content.row[3].element[3].editable = { type: "text", width: 416, maxlength: 100 };                                                                                 //상세구분
    //    args.content.row[3].element[5].editable = { type: "select", data: { memory: "dddwImportance" }, width: 170, validate: { rule: "required", message: "중요도" } };            //Importance
    //    args.content.row[4].element[1].editable = { type: "text", width: 716, maxlength: 100, validate: { rule: "required", message: "제목" } };                                //제목
    //    args.content.row[5].element[1].editable = { type: "textarea", rows: 4, width: 1000 };                                                                                   //변경사유
    //}
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN", offset: 8 }
        ]
    };
    gw_com_module.objResize(args);

    //=====================================================================================
    var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmData_MAIN", event: "itemdblclick", handler: processItemdblclick };
    gw_com_module.eventBind(args);
    //=====================================================================================

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.show("frmOption");

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            v_global.process.handler = processRetrieve;
            //if (!checkUpdatable({})) return;
            processRetrieve(param);
            break;
        case "추가": processInsert(param); break;
        case "수정": processEdit(param); break;
        case "삭제": processDelete(param); break;
        case "저장": processSave({}); break;
        case "요청":
        case "취소": processStat(param); break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processTabChange(param) {

    closeOption({});

}
//----------
function processEdit(param) {

    v_global.process.handler = processRetrieve;
    if (!checkUpdatable({})) return;
    processRetrieve(param);

}
//----------
function processStat(param) {

    if (!checkManipulate({})) return;
    if (!checkUpdatable({ check: true })) return false;
    if ($.inArray(gw_com_api.getValue("frmData_MAIN", 1, "astat"), ["", "작성", "요청"]) == -1) {
        var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
        gw_com_api.messageBox([{
            text: "[" + pstat + "] 상태이므로 " +
                (param.element == "요청" ? "승인요청" : "요청취소") + "할 수 없습니다."
        }]);
        return;
    }
    if (param.element == "요청") {
        gw_com_api.setValue("frmData_MAIN", 1, "astat", "요청");
        gw_com_api.setValue("frmData_MAIN", 1, "pstat", "요청");
        param.mail = {
            type: "PCN-RQST",
            key_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no")
        };
    } else {
        gw_com_api.setValue("frmData_MAIN", 1, "astat", "작성");
        gw_com_api.setValue("frmData_MAIN", 1, "pstat", "작성");
        param.mail = {
            type: "PCN-RQST-CANCEL",
            key_no: gw_com_api.getValue("frmData_MAIN", 1, "issue_no")
        };
    }
    gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
    processSave(param);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN") {
        if (param.element == "item_nm" && param.value.current == "") {
            gw_com_api.setValue(param.object, param.row, "item_cd", "");
            //if (gw_com_api.getCRUD("frmData_MAIN") == "retrieve") gw_com_api.setCRUD("frmData_MAIN", 1, "modify");
        }
    }
}
//----------
function processItemdblclick(param) {

    if (!checkEditable({})) return;
    if (!checkManipulate({})) return;
    if (!checkStat({})) return;
    if ($.inArray(param.element, ["rmk_html"]) >= 0) {
        processMemo({ type: param.type, object: param.object, row: param.row, element: param.element, html: true });
    } else if (param.element == "item_cd") {
        var args = {
            type: "PAGE", page: "PCN_1011", title: "품목",
            width: 600, height: 350, locate: ["center", 100], open: true,
            id: gw_com_api.v_Stream.msg_openedDialogue,
            data: {
                supp_cd: v_global.logic.supp_cd
            }
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = { page: args.page, param: { ID: args.id, data: args.data } };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args;
    if (param.object == "frmOption") {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "biz_dept", argument: "arg_biz_dept" },
                    { name: "doc_no", argument: "arg_doc_no" },
                    { name: "prod_tp", argument: "arg_prod_tp" },
                    { name: "cust_cd", argument: "arg_cust_cd" },
                    { name: "user_nm", argument: "arg_user_nm" },
                    { name: "key_word", argument: "arg_key_word" }
                ],
                //remark: [
                //    { element: [{ name: "work_ym" }] },
                //    //{ element: [{ name: "emp_no" }] },
                //    { element: [{ name: "emp_nm" }] }
                //]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_MAIN" },
                { type: "FORM", id: "frmData_MemoA1" },
                { type: "FORM", id: "frmData_MemoA2" },
                { type: "FORM", id: "frmData_MemoB1" },
                { type: "FORM", id: "frmData_MemoB2" },
                { type: "FORM", id: "frmData_TextA1" },
                { type: "FORM", id: "frmData_TextA2" },
                { type: "FORM", id: "frmData_TextB1" },
                { type: "FORM", id: "frmData_TextB2" },
                { type: "GRID", id: "grdData_FILE" }
            ],
            key: param.key
        };
    } else if (param.object == "grdData_FILE") {
        args = {
            source: {
                type: "FORM", id: "frmData_MAIN", row: "selected",
                element: [
                    { name: "doc_no", argument: "arg_doc_no" },
                    { name: "doc_no", argument: "arg_data_key" }
                ],
                argument: [
                    { name: "arg_data_seq", value: 0 }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_FILE", edit: true }
            ]
        };
    } else {
       //createDW({ astat: gw_com_api.getValue("grdList_MAIN", "selected", "astat", true) });
        args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "doc_no", argument: "arg_doc_no" },
                    { name: "doc_no", argument: "arg_data_key" }
                ],
                argument: [
                    { name: "arg_data_seq", value: -1 }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MAIN", edit: true },
                { type: "GRID", id: "grdData_FILE", edit: true }
            ],
            handler: { complete: processRetrieveEnd, param: param },
            key: param.key
        };
        gw_com_api.selectTab("lyrTab", 2);
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    var args = {
        source: {
            type: "FORM", id: "frmData_MAIN", row: "selected",
            element: [{ name: "doc_no", argument: "arg_doc_no" }],
            argument: [{ name: "arg_rmk_cd", value: "MemoA1" }]
        },
        target: [
            { type: "FORM", id: "frmData_MemoA1", edit: true }
        ],
        handler: { complete: processRetrieveEnd, param: param }
    };

    // Looping handler with chainging of arg_rmk_cd
    if (param.key == undefined) {
        param.key = "MemoA1";
    }
    else if (param.key == "MemoA1") {
        param.key = "TextA1"; args.source.argument[0].value = param.key; args.target[0].id = "frmData_" + param.key;
    }
    else if (param.key == "TextA1") {
        param.key = "MemoA2"; args.source.argument[0].value = param.key; args.target[0].id = "frmData_" + param.key;
    }
    else if (param.key == "MemoA2") {
        param.key = "TextA2"; args.source.argument[0].value = param.key; args.target[0].id = "frmData_" + param.key;
    }
    else if (param.key == "TextA2") {
        param.key = "MemoB1"; args.source.argument[0].value = param.key; args.target[0].id = "frmData_" + param.key;
    }
    else if (param.key == "MemoB1") {
        param.key = "TextB1"; args.source.argument[0].value = param.key; args.target[0].id = "frmData_" + param.key;
    }
    else if (param.key == "TextB1") {
        param.key = "MemoB2"; args.source.argument[0].value = param.key; args.target[0].id = "frmData_" + param.key;
    }
    else if (param.key == "MemoB2") {
        param.key = "TextB2"; args.source.argument[0].value = param.key; args.target[0].id = "frmData_" + param.key;
    }
    else return;

    gw_com_module.objRetrieve(args);

}

function processRetrieveEnd2(param) {
}

//----------
function processInsert(param) {

    if (param.object == "lyrMenu_List") {
        if (!checkUpdatable({ check: true })) return false;
        createDW({ astat: "작성" });
        var args = {
            targetid: "frmData_MAIN", edit: true, updatable: true,
            data: [
                { name: "rgst_ymd", value: gw_com_api.getDate() },
                //{ name: "rgst_ymd", value: gw_com_api.Mask(gw_com_api.getDate(), "date-ymd") },
                { name: "rgst_user", value: gw_com_module.v_Session.USR_ID },
                { name: "rgst_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "biz_dept", value: gw_com_module.v_Session.DEPT_AREA }
            ],
            clear: [
                { type: "FORM", id: "frmData_MemoA1" },
                { type: "FORM", id: "frmData_MemoA2" },
                { type: "FORM", id: "frmData_MemoB1" },
                { type: "FORM", id: "frmData_MemoB2" },
                { type: "FORM", id: "frmData_TextA1" },
                { type: "FORM", id: "frmData_TextA2" },
                { type: "FORM", id: "frmData_TextB1" },
                { type: "FORM", id: "frmData_TextB2" },
                { type: "GRID", id: "grdData_FILE" }
            ]
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_MemoA1", edit: true, updatable: true,
            data: [ { name: "rmk_cd", value: "MemoA1" } ]
        }; gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_MemoA2", edit: true, updatable: true,
            data: [{ name: "rmk_cd", value: "MemoA2" }]
        }; gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_MemoB1", edit: true, updatable: true,
            data: [{ name: "rmk_cd", value: "MemoB1" }]
        }; gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_MemoB2", edit: true, updatable: true,
            data: [{ name: "rmk_cd", value: "MemoB2" }]
        }; gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_TextA1", edit: true, updatable: true,
            data: [{ name: "rmk_cd", value: "TextA1" }]
        }; gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_TextA2", edit: true, updatable: true,
            data: [{ name: "rmk_cd", value: "TextA2" }]
        }; gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_TextB1", edit: true, updatable: true,
            data: [{ name: "rmk_cd", value: "TextB1" }]
        }; gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_TextB2", edit: true, updatable: true,
            data: [{ name: "rmk_cd", value: "TextB2" }]
        }; gw_com_module.formInsert(args);

        gw_com_api.selectTab("lyrTab", 2);
    } else {
        if (!checkManipulate({})) return;
        if (!checkUpdatable({ check: true })) return false;
        //if (!checkStat()) {
        //    var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
        //    gw_com_api.messageBox([{ text: "[" + pstat + "] 상태이므로 수정할 수 없습니다." }]);
        //    return;
        //}
        var args = {
            type: "PAGE", page: "DLG_FileUpload_QMI", title: "첨부 파일 업로드",
            width: 650, height: 200,
            //locate: ["center", 600],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "DLG_FileUpload_QMI",
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        type: "EdmDocGuide",
                        key: gw_com_api.getValue("frmData_MAIN", 1, "doc_no"),
                        subkey: "", seq: 0
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    var args;
    if (param.object == "lyrMenu_File") {
        //if (!checkStat()) {
        //    var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
        //    gw_com_api.messageBox([{ text: "[" + pstat + "] 상태이므로 수정할 수 없습니다." }]);
        //    return;
        //}
        args = { targetid: "grdData_FILE", row: "selected", select: true }
        gw_com_module.gridDelete(args);
    } else {
        if (!checkManipulate({})) return;
        var status = checkCRUD({});
        if (status == "initialize" || status == "create") {
            var args = {
                target: [
                    { type: "FORM", id: "frmData_MAIN" },
                    { type: "FORM", id: "frmData_MemoA1" },
                    { type: "FORM", id: "frmData_MemoA2" },
                    { type: "FORM", id: "frmData_MemoB1" },
                    { type: "FORM", id: "frmData_MemoB2" },
                    { type: "FORM", id: "frmData_TextA1" },
                    { type: "FORM", id: "frmData_TextA2" },
                    { type: "FORM", id: "frmData_TextB1" },
                    { type: "FORM", id: "frmData_TextB2" },
                    { type: "GRID", id: "grdData_FILE" }
                ]
            };
            gw_com_module.objClear(args);
        } else {
            //if (!checkStat()) {
            //    var pstat = gw_com_api.getValue("frmData_MAIN", 1, "pstat");
            //    gw_com_api.messageBox([{ text: "[" + pstat + "] 상태이므로 삭제할 수 없습니다." }]);
            //    return;
            //}
            v_global.process.handler = processRemove;
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        }
    }

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM", id: "frmData_MAIN",
                key: { element: [{ name: "doc_no" }] }
            }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(param) {

    processRetrieve({ object: "frmOption" });
    gw_com_api.selectTab("lyrTab", 1);

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MemoA1" },
            { type: "FORM", id: "frmData_MemoA2" },
            { type: "FORM", id: "frmData_MemoB1" },
            { type: "FORM", id: "frmData_MemoB2" },
            { type: "FORM", id: "frmData_TextA1" },
            { type: "FORM", id: "frmData_TextA2" },
            { type: "FORM", id: "frmData_TextB1" },
            { type: "FORM", id: "frmData_TextB2" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //if (gw_com_api.getValue("frmData_MAIN", 1, "chg_tp") == "기타" && gw_com_api.getValue("frmData_MAIN", 1, "chg_dtl_tp") == "") {
    //    gw_com_api.setError(true, "frmData_MAIN", 1, "chg_dtl_tp");
    //    gw_com_api.messageBox([{ text: "NOVALIDATE" }]);
    //    return;
    //}
    //gw_com_api.setError(false, "frmData_MAIN", 1, "chg_dtl_tp");

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    //if (param.mail != undefined) processBatch(param);
    //var key = response;
    //key[0].QUERY = "PCN_1010_1";
    //$.ajaxSetup({ async: false });
    //processRetrieve({ object: "frmOption", key: key });
    //$.ajaxSetup({ async: true });
    processRetrieve({});
}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "dbo.PROC_MAIL_ECCB_PCN",
        nomessage: true,
        input: [
            { name: "type", value: param.mail.type, type: "varchar" },
            { name: "key_no", value: param.mail.key_no, type: "varchar" },
            { name: "key_seq", value: "0", type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }

        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

}
//----------
function processClose(param) {

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
//----------
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            page: "DLG_EDIT_HTML",
            option: "width=300,height=400,left=300,resizable=1",
            data: {
                title: "상세 내용", imgPath: "~/Files/DxHtmlEditor/DocGuide",
                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
            }
        };
        gw_com_api.openWindow(args);
    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_MAIN");

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
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "FORM", id: "frmData_MAIN" },
            { type: "FORM", id: "frmData_MemoA1" },
            { type: "FORM", id: "frmData_MemoA2" },
            { type: "FORM", id: "frmData_MemoB1" },
            { type: "FORM", id: "frmData_MemoB2" },
            { type: "FORM", id: "frmData_TextA1" },
            { type: "FORM", id: "frmData_TextA2" },
            { type: "FORM", id: "frmData_TextB1" },
            { type: "FORM", id: "frmData_TextB2" },
            { type: "GRID", id: "grdData_FILE" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processSearch(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    switch (param.element) {
        case "supp_nm":
            {
                var args = {
                    type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                    width: 600, height: 450, open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_SUPPLIER",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectSupplier
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }


}
//---------- Print 처리
function processExport(param) {

    if (gw_com_api.getRowCount("grdData_Main") < 1) return;

    var args = {
        target: { type: "FILE", id: "lyrDown", name: "DocGuide" },
        option: [
            { name: "dir", value: "EDM_DocGuide" },
            { name: "rpt", value: "DocGuideList" },
            { name: "ext", value: "xls" },
            { name: "opt", value: "" },
            { name: "qry", value: "EDM_DocGuide_Excel" },
            { name: "ymd_fr", value: gw_com_api.getValue("frmOption", 1, "ymd_fr") },
            { name: "ymd_to", value: gw_com_api.getValue("frmOption", 1, "ymd_to") },
            { name: "biz_dept", value: gw_com_api.getValue("frmOption", 1, "biz_dept") }
        ],
        handler: { success: successExport }
    };
    gw_com_module.objExport(args);
    
}

//----------
function successExport(response, param) {

}
//----------
function checkStat(param) {

    //if ($.inArray(gw_com_api.getValue("frmData_MAIN", 1, "astat"), ["", "작성", "수정"]) == -1) {
    //    return false;
    //}
    return true;

}
// gw_com_api 에 적용할 함수
//object의 보다 정확한 타입을 얻을 때 사용. 
function getType(obj) {
    var objectName = Object.prototype.toString.call(obj);
    var match = /\[object (\w+)\]/.exec(objectName); return match[1].toLowerCase();
}

//object의 내용을 복사해서 넘겨준다. 
function getClone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    if (getType(obj) == 'date') { var copy = new Date(); copy.setTime(obj.getTime()); return copy; }
    if (getType(obj) == 'array') { var copy = []; for (var i = 0, len = obj.length; i < len; i++) { copy[i] = this.getClone(obj[i]); } return copy; }
    if (getType(obj) == 'object') { var copy = {}; for (var attr in obj) { if (obj.hasOwnProperty(attr)) copy[attr] = this.getClone(obj[attr]); } return copy; }
    return obj;
}

//----------
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);

                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});

                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
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
                    case "DLG_FileUpload_QMI":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                type: "EdmDocGuide",
                                key: gw_com_api.getValue("frmData_MAIN", 1, "doc_no"),
                                subkey: "", seq: 0
                            };
                        }
                        break;
                    case "DLG_SUPPLIER":
                        args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                        break;
                    case "PCN_1011":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            supp_cd: v_global.logic.supp_cd
                        };
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    // HTML 을 data column 에 복사. (html & text 두 개 컬럼에 저장해야함)
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                    gw_com_api.setValue(v_global.event.object, v_global.event.row, "rmk_text", param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                if (param.from)
                    closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_FileUpload_QMI":
                        if (param.data != undefined) {
                            processRetrieve({ object: "grdData_FILE" });
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "FORM", id: "frmData_MAIN",
                        element: [
                            { name: "issue_no", argument: "arg_data_key" }
                        ],
                        argument: [
                            { name: "arg_data_seq", value: -1 }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_FILE", select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "supp_cd",
                                    param.data.supp_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "supp_nm",
                                    param.data.supp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//