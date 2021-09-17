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
        v_global.logic.nt_tp = gw_com_api.getPageParameter("nt_tp");
        v_global.logic.PageId = "SYS_Notice_List";

        // set data for DDDW List & call start()
        var args = {
            request: [
                {
                    type: "INLINE", name: "dddwDateType",
                    data: [
			            { title: "공지일자", value: "FR" },
			            { title: "만료일자", value: "TO" }
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
            gw_com_api.setValue("frmOption", 1, "fr_date", gw_com_api.getDate("", { day: -14 }));
            gw_com_api.setValue("frmOption", 1, "to_date", gw_com_api.getDate("", { day: 14 }));
            gw_com_api.setValue("frmOption", 1, "nt_tp", v_global.logic.nt_tp);

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
            args.element.push({ name: "AddNew", value: "추가" });
            args.element.push({ name: "Edit", value: "수정" });
            args.element.push({ name: "Delete", value: "삭제" });
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
                                name: "date_tp", value: "FR", label: { title: "기간구분 :" },
                                editable: { type: "select", data: { memory: "dddwDateType" } }
                            },
                            {
                                style: { colfloat: "floating" }, name: "fr_date", mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "to_date", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "nt_tp", label: { title: "공지구분 :" },
                                editable: { type: "select", data: { memory: "dddwNoticeType" } }
                            },
                            {
                                name: "nt_usr", label: { title: "공지자 :" },
                                editable: { type: "text", size: 7 }
                            },
                            {
                                name: "nt_title", label: { title: "제목 :" },
                                editable: { type: "text", size: 20 }
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
            targetid: "grdData_ListA", query: "SYS_Notice_List", title: "공지 일람",
            height: 110, show: true, selectable: true, number: true,
            element: [
                { header: "공지일자", name: "fr_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "공지구분", name: "nt_tp", width: 60, align: "center", format: { type: "select", data: { memory: "dddwNoticeType" } } },
                { header: "제목", name: "nt_title", width: 300 },
                { header: "공지자", name: "nt_usr", width: 70, align: "center" },
                { header: "만료일자", name: "to_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "진행상태", name: "pstat", width: 60, align: "center" },
                { header: "공지대상", name: "nt_target_nm", width: 250 },
                { name: "nt_target", hidden: true },
                { name: "nt_seq", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        // Data Box : Attach File
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 파일",
            caption: true, height: "100%", pager: false, number: true, show: true, selectable: true,
            //editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
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
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);

        // Momo Box
        var args = {
            targetid: "frmData_MemoA", query: "SYS_Notice_Memo", type: "TABLE", title: "공지 내용",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" }, height: 400,
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 400 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        // Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        // Resize Data Box
        var args = {
            target: [
                { type: "GRID", id: "grdData_ListA", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 },
                { type: "FORM", id: "frmData_MemoA", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

    },

    // manage process. (program section)
    procedure: function () {

        // Event : Top Menu Buttons
        var args = { targetid: "lyrMenu_Top", element: "Retrieve", event: "click", handler: procedureRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "AddNew", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Edit", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Delete", event: "click", handler: click_lyrMenu_Top_삭제 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Close", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_ListA", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        // Event : File Button,  Box
        var args = { targetid: "grdData_FileA", grid: true, element: "_download", event: "click", handler: processFileDownload };
        gw_com_module.eventBind(args);


        // event handler.
        //----------
        function procedureRetrieve(ui) {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        };
        //----------
        function click_lyrMenu_Top_삭제(ui) {

            v_global.process.handler = processRemove;

            if (!checkManipulate({})) return;

            checkRemovable({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselected_grdData_ListA(ui) {

            processLink({});

        };

    }

};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// common function. (for File Retrieve, Upload, Download)
// ref : grdData_FileA, row click event, processRetrieveComplete, msg_openedDialogue, msg_closeDialogue
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "NOTICE" : param.data_tp; // Set File Data Type

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: (param.data_key == undefined ? "%" : param.data_key) },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? -1 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? -1 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: param.objID, select: true }],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

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
                { name: "nt_tp", argument: "arg_nt_tp" },
                { name: "date_tp", argument: "arg_date_tp" },
                { name: "fr_date", argument: "arg_fr_date" },
                { name: "to_date", argument: "arg_to_date" },
                { name: "nt_usr", argument: "arg_nt_usr" },
                { name: "nt_title", argument: "arg_nt_title" }
	        ],
	        //argument: [
            //    { name: "arg_nt_tp", value: v_global.logic.nt_tp }
	        //],
	        remark: [
                { element: [{ name: "date_tp" }] },
                { infix: "~", element: [{ name: "fr_date" }, { name: "to_date" }] },
                { element: [{ name: "nt_usr" }] },
                { element: [{ name: "nt_title" }] }
	        ]
	    },
	    target: [
            { type: "GRID", id: "grdData_ListA" }   //, select: true -> handler 에서 대체
	    ],
	    clear: [
            { type: "GRID", id: "grdData_FileA" },
            { type: "FORM", id: "frmData_MemoA" }
	    ],
	    findKey: param.findKey, handler: { complete: processRetrieveComplete, param: param }
	};

    gw_com_module.objRetrieve(args);
    
}
//----------
function processRetrieveComplete(param) {
    // Run [rowselected] Event : findKey로 행찾기
    var listID = "grdData_ListA";
    var curRow = 1;
    if (param.findKey != undefined && param.findKey != "") {
        for (var i = 1; i < gw_com_api.getRowCount(listID) + 1; i++) {
            if ( gw_com_api.getValue(listID, i, "nt_seq", true) == param.findKey ){
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
        source: {
            type: ui.type, id: ui.object, row: ui.row, block: true,
            element: [
                { name: "nt_seq", argument: "arg_nt_seq" }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MemoA" }
        ],
        key: ui.key
    };
    gw_com_module.objRetrieve(args);

    // File List
    processFileList({ objID: "grdData_FileA", data_key: gw_com_api.getValue("grdData_ListA", "selected", "nt_seq", true) });

}
//----------
function processEdit(ui) {
    //data: { param: [{ name: "nt_tp", value: "협력사" }] }
    if (ui.object == "lyrMenu_Top") {
        var args = {
            ID: gw_com_api.v_Stream.msg_linkPage,
            to: { type: "MAIN" },
            data: { page: "SYS_Notice_Edit", title: "공지사항 등록", param: {} }
        }
        if (ui.element == "Edit")
            args.data.param = [{ name: "nt_seq", value: gw_com_api.getValue("grdData_ListA", "selected", "nt_seq", true) }];
        gw_com_module.streamInterface(args);
    }
}
//----------
function processDelete(param) {
    var args = {
        targetid: "grdData_ListA", row: "selected",
        clear: [
            { type: "GRID", id: "grdData_FileA" },
			{ type: "FORM", id: "frmData_MemoA" }
        ]
    };
    gw_com_module.gridDelete(args);
}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_ListA",
                key: [{ row: "selected", element: [{ name: "nt_seq" }] }]
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