//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 실적등록수정
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

        //var args = {
        //    request: [
		//		{
		//		    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
		//		    param: [{ argument: "arg_hcode", value: "ISCM81" }]
		//		},
        //        {
        //            type: "INLINE", name: "업체구분",
        //            data: [
        //                { title: "협력사", value: "2" },
        //                { title: "고객사", value: "1" }
        //            ]
        //        }
        //    ],
        //    starter: start
        //};
        //gw_com_module.selectSet(args);
        start();
        //----------

        function start() { 

            gw_job_process.UI();
        	gw_job_process.procedure();

        	gw_com_api.setValue("frmOption1", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
        	gw_com_api.setValue("frmOption1", 1, "ymd_to", gw_com_api.getDate());
        	gw_com_api.setValue("frmOption2", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
        	gw_com_api.setValue("frmOption2", 1, "ymd_to", gw_com_api.getDate());

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
                { name: "저장", value: "확인" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_FILE", query: "ECM_3010_9", type: "TABLE", title: "",
            caption: false, show: true,
            editable: { bind: "select", validate: true },
            content: {
                width: { label: 150, field: 80 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "공종", format: { type: "label" } },
                            {
                                name: "ext1_val",
                                editable: { type: "text", width: 118 }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "계약이행보증보험증권", format: { type: "label" } },
                            {
                                name: "file1_chk",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "선급금이행보증보험증권", format: { type: "label" } },
                            {
                                name: "file2_chk",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "하자이행보증보험증권", format: { type: "label" } },
                            {
                                name: "file3_chk",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "file4_chk", hidden: true,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "file5_chk", hidden: true,
                                format: { type: "checkbox", value: "1", offval: "0", title: "" },
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { name: "result_id", editable: { type: "hidden" }, hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $(".frmData_FILE_edit").css("text-align", "center");    // 체크박스 모두 가운데 정렬
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_FILE", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processButton(param) {

    if (param.object == undefined) return false;
    switch (param.element) {
        case "저장":
            {
                processSave(param);
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
function processItemchanged(param) {

    switch (param.element) {
        case "supp_tp":
            {
                if (gw_com_api.getValue(param.object, param.row, "supp_nm") == "") {
                    var args = {
                        target: [
                            { type: "GRID", id: "grdList_PER" }
                        ]
                    };
                    gw_com_module.objClear(args);
                } else {
                    processRetrieve2({});
                }
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_result_id", value: v_global.data.result_id }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_FILE", edit: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
			{ type: "FORM", id: "frmData_FILE" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var stat = Query.getStat({ result_id: v_global.data.result_id });
    if (stat == "REG") {
        processClose({ data: v_global.data });
        processClear({});
    } else {
        processBatch(param);
    }
    
}
//----------
function processBatch(param) {

    var proc = {
        url: "COM",
        procedure: "sp_sendECMResultMail",
        nomessage: true,
        input: [
            { name: "type", value: "ECM_RESULT_A", type: "varchar" },
            { name: "result_id", value: v_global.data.result_id, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(proc);

}
//----------
function successBatch(response, param) {

    processClose({ data: v_global.data });
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_FILE" }
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
var Query = {
    getStat: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=ECM_3010_9" +
                    "&QRY_COLS=pstat" +
                    "&CRUD=R" +
                    "&arg_result_id=" + param.result_id,
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
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                v_global.data = param.data;
                processRetrieve({});
                v_global.logic.init = true;
                gw_com_module.streamInterface(args);
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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//