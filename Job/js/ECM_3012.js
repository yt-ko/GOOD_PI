
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {}, init: false },
    data: null,
    logic: {}
};

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");
        v_global.logic.datatype = gw_com_module.v_Option.datatype;

        start();
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "업로드", value: "업로드", icon: "저장", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Form : Main ====
        var args = { targetid: "frmData_FILE", type: "TABLE", title: "파일 정보",
            show: true, selectable: true, key: true,
            editable: { bind: "select", focus: "file_desc", validate: true },
            content: { height: 25, width: { label: 40, field: 120 },
                row: [
                    {
                        element: [
                            { header: true, value: "설명", format: { type: "label" } },
                            { name: "file_desc", editable: { type: "text", width: 440, maxlength: 150 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        
        //==== Resize ====
        var args = {
            target: [
				{ type: "FORM", id: "frmData_FILE", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: processUpload };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------


        // startup process.
        gw_com_module.startPage();
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processUpload(param) {

    var cnt = 0
    if (ctlUpload1.GetText() != "") cnt++;
    if (ctlUpload2.GetText() != "") cnt++;
    if (ctlUpload3.GetText() != "") cnt++;

    if (cnt == 0) {
        gw_com_api.messageBox([{ text: "업로드할 파일을 선택해 주세요." }]);
        return;
    }

    $.blockUI();
    if (v_global.data.file1_chk == "1") ctlUpload1.UploadFile();
    if (v_global.data.file2_chk == "1") ctlUpload2.UploadFile();
    if (v_global.data.file3_chk == "1") ctlUpload3.UploadFile();

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

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function successUpload(response) {

    var num = response.option.substring(response.option.length - 1, response.option.length);
    var qryZfile = {
        query: "DLG_FILE_ZFILE", // ZFILE
	    row: [{
            crud: "U",
            column: [
                { name: "file_id", value: response.id },
                { name: "file_path", value: response.path },
                { name: "file_ext", value: response.ext },
                { name: "file_desc", value: gw_com_api.getValue("frmData_FILE", 1, "file_desc") },
                { name: "data_tp", value: "ECM_RESULT" },
                { name: "data_key", value: v_global.data.result_id },
                { name: "data_seq", value: num }
            ]
        }]
    };
    var qryECMResult = {
        query: "ECM_3010_1",
        row: [{
            crud: "U",
            column: [
                { name: "result_id", value: v_global.data.result_id },
                { name: "file" + num + "_id", value: response.id }
            ]
        }]
    };
    var argParam = [qryZfile, qryECMResult];
	var args = {
	    user: gw_com_module.v_Session.USR_ID,
        param: argParam,
        handler: { success: successSave }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: v_global.data
    };
    gw_com_module.streamInterface(args);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.data = param.data;
                v_global.process.init = true;
                gw_com_api.show("lyrFile");
                var args = { targetid: "frmData_FILE", edit: true,
		            data: [
		                { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
		                { name: "user_id", value: gw_com_module.v_Session.USR_NM },
		            ]
                };
                gw_com_module.formInsert(args);

                if (v_global.data.file1_chk == "1")
                    $(".files1").show();
                else
                    $(".files1").hide();

                if (v_global.data.file2_chk == "1")
                    $(".files2").show();
                else
                    $(".files2").hide();

                if (v_global.data.file3_chk == "1")
                    $(".files3").show();
                else
                    $(".files3").hide();

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
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                }
            } break;
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
