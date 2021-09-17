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

        // Get Page Parameters
        v_global.logic.key = gw_com_api.getPageParameter("key");
        v_global.logic.PageId = "SRM_OpenSrc_RptA";

        // set data for DDDW List & call start()
        var args = {
            request: [
                {
                    type: "INLINE", name: "dddwPropType",
                    data: [
			            { title: "ALL", value: "%" },
			            { title: "반도체", value: "반도체" },
			            { title: "디스플레이", value: "디스플레이" }
                    ]
                },
				{
				    type: "PAGE", name: "dddwNoticeType", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "SYS211" } ]
				}
			], starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process
        function start() {

            // Set Page Options
            v_global.logic.PageEditable = true;
            v_global.logic.PageType = "Sub";

            // Create UI Controls
            gw_job_process.UI();

            // Set Default Option Values
            gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getDate("", { month: -12 }));
            gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getDate("", { day: 1 }));

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
            //    } else {
            //        v_global.logic.supp_cd = "";
            //    }
            //}

        }

    },

    // manage UI. (design section)
    UI: function () {

        // Create Buttons
        var args = {
            targetid: "lyrMenu_Top", type: "FREE",
            element: [
                { name: "Retrieve", value: "조회", act: true } //, icon: "Other"
            ]
        };
        if (v_global.logic.PageEditable) {
            args.element.push({ name: "Edit", value: "상세보기" });
        }
        if (v_global.logic.PageType == "Main") {
            args.element.push({ name: "Close", value: "닫기", icon: "닫기" });
        }
        gw_com_module.buttonMenu(args);

        // Option Box
        var args = {
            targetid: "frmOption", type: "FREE", trans: true, border: true, show: true,
            editable: { bind: "open", focus: "date_tp", validate: true }, remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "fr_ymd", label: { title: "제안일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "to_ymd", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
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
			    ]   //end row
            }   //end content
        };
        gw_com_module.formCreate(args);

        // Data List
        var args = {
            targetid: "grdData_ListA", query: "SRM_OpenSrc_RptA", title: "월별 집계",
            height: 500, show: true, selectable: true, number: true,
            element: [
                { header: "년월", name: "mon_nm", width: 100, align: "center" },
                { header: "반도체", name: "group1_cnt", width: 100, align: "center", format: { type: "link" } },    //, mask: "biz-no"
                { header: "디스플레이", name: "group2_cnt", width: 100, align: "center", format: { type: "link" } },
                { header: "제안 합계", name: "prop_cnt", width: 100, align: "center", format: { type: "link" } },
                { header: "심사 적격", name: "ok_cnt", width: 100, align: "center", format: { type: "link" } },
				{ header: "심사 부적격", name: "nok_cnt", width: 100, align: "center", format: { type: "link" } },
                { name: "mon_ym", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //// File List
        //var args = {
        //    targetid: "grdData_FileA", query: "w_sys2030_S_1", title: "첨부 파일",
        //    caption: true, height: 45, pager: false, number: true, show: true, selectable: true,
        //    element: [
        //        { header: "파일명", name: "file_nm", width: 300, align: "left" },
        //        {
        //            header: "다운로드", name: "_download", width: 60, align: "center",
        //            format: { type: "link", value: "다운로드" }
        //        },
        //        { header: "파일설명", name: "file_desc", width: 300, align: "left" },
        //        { header: "등록일자", name: "ins_dt", width: 80, align: "center", mask: "date-ymd" },
        //        { header: "등록자", name: "ins_usr", width: 70, align: "center" },
        //        { name: "file_path", hidden: true },
        //        { name: "file_id", hidden: true }
        //    ]
        //};
        //gw_com_module.gridCreate(args);

        // Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        // Resize Data Box
        var args = {
            target: [
                { type: "GRID", id: "grdData_ListA", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        // Event : Top Menu Buttons
        var args = { targetid: "lyrMenu_Top", element: "Retrieve", event: "click", handler: procedureRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Edit", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Close", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        //var args = { targetid: "grdData_ListA", grid: true, event: "rowdblclick", handler: processEdit };
        //gw_com_module.eventBind(args);
        var args = { targetid: "grdData_ListA", grid: true, element: "group1_cnt", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_ListA", grid: true, element: "group2_cnt", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_ListA", grid: true, element: "prop_cnt", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_ListA", grid: true, element: "ok_cnt", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_ListA", grid: true, element: "nok_cnt", event: "click", handler: processLink };
        gw_com_module.eventBind(args);

        // event handler.
        //----------
        function procedureRetrieve(ui) {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        };

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// common function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkManipulate(param) {
    closeOption({});
    if (gw_com_api.getSelectedRow("grdData_ListA") == null) {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;
}
//----------
function checkRemovable(param) {
    gw_com_api.messageBox([{ text: "REMOVE" }]
        , 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------
function closeOption(param) {
    gw_com_api.hide("frmOption");
}
//----------
function processDownload(param) {
    var args = { targetid: "lyrDown", source: { id: param.object, row: param.row } };
    gw_com_module.downloadFile(args);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
	if (gw_com_module.objValidate(args) == false) return false;

	var args = {
	    source: {
	        type: "FORM", id: "frmOption", hide: true,
	        element: [
                { name: "fr_ymd", argument: "arg_fr_ymd" },
                { name: "to_ymd", argument: "arg_to_ymd" }
	        ],
	        //argument: [
            //    { name: "arg_nt_tp", value: v_global.logic.nt_tp }
	        //],
	        remark: [
                { infix: "~", element: [{ name: "fr_ymd" }, { name: "to_ymd" }] }
	        ]
	    },
	    target: [
            { type: "GRID", id: "grdData_ListA" }   //, select: true -> handler 에서 대체
	    ],
	    //clear: [
        //    { type: "FORM", id: "frmData_MemoA" }
	    //],
	    findKey: param.findKey  //, handler: { complete: processRetrieveEnd, param: param }
	};

    gw_com_module.objRetrieve(args);
    
}
//----------
function processRetrieveEnd(param) {
    // Run [rowselected] Event : findKey로 행찾기
    var listID = "grdData_ListA";
    var curRow = 1;
    if (param.findKey != undefined && param.findKey != "") {
        for (var i = 1; i < gw_com_api.getRowCount(listID) + 1; i++) {
            if ( gw_com_api.getValue(listID, i, "prop_id", true) == param.findKey ){
                curRow = i; break;
            }
        }
    }
    if (gw_com_api.getRowCount(listID) > 0 )
        gw_com_api.selectRow(listID, curRow, true, true);
}
//----------
function processLink(ui) {
    // ui : object, row, status, type
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "SRM_OpenSrc_List", title: "제안 현황", param: {} }
    }
    var sYmdFr = gw_com_api.getValue("grdData_ListA", ui.row, "mon_ym", true);
    var sYmdTo = sYmdFr + "31";
    if (sYmdFr == "Total") {
        sYmdFr = gw_com_api.getValue("frmOption", "selected", "fr_ymd");
        sYmdTo = gw_com_api.getValue("frmOption", "selected", "to_ymd");
    }
    else {
        sYmdFr = sYmdFr + "01";
    }

    var sPropTp = "";
    if (ui.element == "group2_cnt") sPropTp = "디스플레이";
    else if (ui.element == "group1_cnt") sPropTp = "반도체";

    var sAcptYn = "";
    if (ui.element == "ok_cnt") sAcptYn = "1";
    else if (ui.element == "nok_cnt") sAcptYn = "0";

    args.data.param = [{ name: "fr_ymd", value: sYmdFr }, { name: "to_ymd", value: sYmdTo }
                    , { name: "prop_tp", value: sPropTp }, { name: "acpt_yn", value: sAcptYn }, { name: "send_yn", value: "1" }];
    gw_com_module.streamInterface(args);
}
//----------
function processEdit(ui) {
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "SRM_OpenSrc_List", title: "제안 현황", param: {} }
    }
    var sYmdFr = gw_com_api.getValue("grdData_ListA", "selected", "mon_ym", true);
    var sYmdTo = sYmdFr + "31";
    if (sYmdFr == "Total") {
        sYmdFr = gw_com_api.getValue("frmOption", "selected", "fr_ymd");
        sYmdTo = gw_com_api.getValue("frmOption", "selected", "to_ymd");
    }
    else {
        sYmdFr = sYmdFr + "01";
    }
    args.data.param = [{ name: "fr_ymd", value: sYmdFr }, { name: "to_ymd", value: sYmdTo }];
    gw_com_module.streamInterface(args);

}
//----------
function processDelete(param) {
    //var args = {
    //    targetid: "grdData_ListA", row: "selected",
    //    clear: [
    //        { type: "GRID", id: "grdData_FileA" },
	//		{ type: "FORM", id: "frmData_MemoA" }
    //    ]
    //};
    //gw_com_module.gridDelete(args);
}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_ListA",
                key: [{ row: "selected", element: [{ name: "prop_id" }] }]
            }
        ],
        handler: { success: successRemove }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processDelete({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_refreshPage:
            {
                processRetrieve({ findKey: param.findKey});
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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        if (param.data.result == "YES") processRemove({});
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                var args = { page: param.from.page };
                gw_com_module.dialogueClose(args);
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//