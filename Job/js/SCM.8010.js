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
    logic: {},
    toggle: true
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
                {
                    type: "PAGE", name: "LINE", query: "dddw_zcoded",
                    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
                },
                { type: "PAGE", name: "PROCESS", query: "dddw_custproc" },
                { type: "PAGE", name: "장비군", query: "dddw_prodgroup" },
                {
                    type: "PAGE", name: "부문", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "ISCM12" }
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
            gw_com_api.setValue("frmOption", 1, "max_row", 10);
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
            targetid: "lyrMenu_미진행", type: "FREE",
            element: [
                { name: "조회", value: "전체보기" }
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
                            },
                            {
                                name: "max_row", label: { title: "max_row : " },
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
        var args = { targetid: "frmData_정보", query: "w_iscm1080_R_S_1", type: "TABLE", title: "프로젝트 정보",
            caption: true, show: true,
            content: {  width: { label: 80 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "Project No.", format: { type: "label" } },
                            { name: "proj_no", editable: { type: "text", validate: { rule: "required" } }, width: 120 },
                            { header: true, value: "제품명", format: { type: "label" } },
                            { name: "prod_nm", width: 250, format: { width: 310 } },
                            //{ name: "prod_seq", format: { width: 66 }, editable: { type: "text", width: 66 }, style: { colfloat: "floating" } },    호기
                            { header: true, value: "PO 일자", format: { type: "label" } },
                            { name: "ord_ymd", format: { width: 90 }, mask: "date-ymd", style: { colfloat: "float" }, width:80 },
                            { header: true, value: "생산확정일", format: { type: "label" } },
                            { name: "rqst_ymd", mask: "date-ymd", width: 80 }
                        ]
                    },
                    {
                        element: [
                            { header: true, type: "label", value: "제품유형", format: { type: "label" } },
                            { name: "prod_type" },
                            { header: true, type: "label", value: "고객사", format: { type: "label" } },
                            { name: "cust_info", format: { width: 310 } },
                            { header: true, value: "요청납기일", format: { type: "label" } },
                            { name: "due_ymd", format: { width: 90 }, mask: "date-ymd", style: { colfloat: "float" } },
                            { header: true, value: "진행상태", format: { type: "label" } },
                            { name: "pstat_nm" }
                            
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_자재", query: "SCM_8010_1", title: "자재 진행률",
            caption: true, height: "100%", pager: false, show: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
				{ header: "구분", name: "item_nm", width: 100, align: "center" },
                { header: "BOM", name: "c1_qty", width: 60, align: "center" , mask:"numeric-int" },
                { header: "발주", name: "c2_qty", width: 60, align: "center", mask: "numeric-int" },
				{ header: "재고사용", name: "c3_qty", width: 60, align: "center", mask: "numeric-int" },
				{ header: "미발주", name: "c4_qty", width: 60, align: "center", mask: "numeric-int" },
				{ header: "발주율(%)", name: "c5_qty", width: 60, align: "center" },
				{ header: "입고", name: "c6_qty", width: 60, align: "center", mask: "numeric-int" },
				{ header: "출고", name: "c7_qty", width: 60, align: "center", mask: "numeric-int" },
				{ header: "미출고", name: "c8_qty", width: 60, align: "center", mask: "numeric-int" },
				{ header: "출고율(%)", name: "c9_qty", width: 60, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_미진행", query: "SCM_8010_2", title: "품목별 내역(상위 10건)",
            height: "100%", pager: false, show: true, selectable: true, caption:true,
            element: [
				{ header: "품목코드", name: "item_no", width: 60, align: "center" },
                { header: "품명", name: "item_nm", width: 170, align: "left" },
                { header: "규격", name: "item_spec", width: 170, align: "left" },
				{ header: "필요수량", name: "bom_qty", width: 40, align: "right", mask: "numeric-int" },
				{ header: "발주", name: "c1_qty", width: 40, align: "right", mask: "numeric-int" },
				{ header: "재사용", name: "c2_qty", width: 40, align: "right", mask: "numeric-int" },
				{ header: "입고", name: "c3_qty", width: 40, align: "right", mask: "numeric-int" },
				{ header: "출고", name: "c4_qty", width: 40, align: "right", mask: "numeric-int" }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_자재", offset: 8 },
				{ type: "FORM", id: "frmData_정보", offset: 8 },
				{ type: "GRID", id: "grdData_미진행", offset: 8 }
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
        var args = { targetid: "lyrMenu_미진행", element: "조회", event: "click", handler: processRetrieveAll };
        gw_com_module.eventBind(args);
        //----------
        //----------
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //----------
        function click_lyrMenu_1_닫기(ui) {
            top.window.close();

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
function processRetrieveAll(param) {
    if (v_global.toggle == true) {
        gw_com_api.setValue("frmOption", 1, "max_row", 0);
        v_global.toggle = false;
    }
    else {
        gw_com_api.setValue("frmOption", 1, "max_row", 10);
        v_global.toggle = true;
    }
    processRetrieve({ sub: true });
}
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    //if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve
    if (param.sub == true) {
        var args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "max_row", argument: "arg_max_row" },
                ],
                remark: [
                    { element: [{ name: "proj_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_미진행" }
            ]
        };
    }
    else {
        var args = {
            key: param.key,
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "max_row", argument: "arg_max_row" },
                ],
                remark: [
                    { element: [{ name: "proj_no" }] }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_정보", focus: true },
                { type: "GRID", id: "grdData_자재" },
                { type: "GRID", id: "grdData_미진행" }
            ]
        };
    }
    
    gw_com_module.objRetrieve(args);

}
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