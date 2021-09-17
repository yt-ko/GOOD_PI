//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약추가항목등록
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
				{
				    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM81" }]
				},
				{ type: "PAGE", name: "SYS_FIELD", query: "ECM_1011_9" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() { 

            gw_job_process.UI();
        	gw_job_process.procedure();

        	var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        	gw_com_module.streamInterface(args);

        	gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_A", type: "FREE", show: false,
            element: [
                { name: "저장", value: "저장" },
                { name: "전송", value: "업체전송", icon: "기타" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "ECM_1020_5", title: "",
            caption: false, height: 276, pager: false, show: true, selectable: true, number: true,
            editable: { master: true, bind: "_edit_yn", focus: "sys_field", validate: true },
            element: [
				{ header: "항목명", name: "ext_nm", width: 100 },
				{
				    header: "값", name: "ext_val", width: 220,
				    editable: { type: "text", width: 336 }
				},
                { name: "ext_id", editable: { type: "hidden" }, hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_MAIN", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_A", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_A", element: "전송", event: "click", handler: processBatch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_A", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processRetrieve(param) {

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_createECMDocFieldValue",
        input: [
            { name: "doc_id", value: v_global.data.doc_id, type: "int" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ]
    };
    $.ajaxSetup({ async: false });
    gw_com_module.callProcedure(args);
    $.ajaxSetup({ async: true });

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_doc_id", value: v_global.data.doc_id }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
			{ type: "GRID", id: "grdData_MAIN" }
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;
    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });
    // 계약서 생성
    processPrint({});

}
//----------
function processBatch(param) {

    if (!checkUpdatable({ check: true })) return;
    if (param.element == "전송") {
        var proc = {
            url: "COM",
            procedure: "sp_updateECMDocStat",
            nomessage: true,
            input: [
                { name: "type", value: "SEND_SUPP", type: "varchar" },
                { name: "doc_id", value: v_global.data.doc_id, type: "varchar" },
                { name: "sub_id", value: "%", type: "varchar" },
                { name: "pstat", value: "WAT_A", type: "varchar" }, //계약대기
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

    if (response.VALUE[0] == "") {
        gw_com_api.showMessage("정상 처리되었습니다.");
        var args = {
            data: { send: true }
        }
        processClose(args);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[0] }]);
    }

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check == undefined ? false : param.check,
        target: [
			{ type: "GRID", id: "grdData_MAIN" }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
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
function processPrint(param) {

    var args = {
        page: "ECM_1020",
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: "ECM_1020" },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "DOC_ID", value: v_global.data.doc_id },
            { name: "DOC_NO", value: v_global.data.doc_no }
        ],
        target: { type: "FILE", id: "ZZZ", name: v_global.data.doc_no }
    };
    gw_com_module.objExport(args);

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.data = param.data;
                if (v_global.data.std_yn == "1" && gw_com_module.v_Session.USER_TP != "SUPP") {
                    gw_com_api.hide("lyrMenu");
                    gw_com_api.show("lyrMenu_A");
                } else {
                    gw_com_api.show("lyrMenu");
                    gw_com_api.hide("lyrMenu_A");
                }
                processRetrieve({});
                v_global.process.init = true;
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
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
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//