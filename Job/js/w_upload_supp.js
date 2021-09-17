
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

        //----------
        start();
        //----------

        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_module.startPage();
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "업로드", value: "업로드", icon: "저장", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Form : Main ====
        var args = {
            targetid: "frmData_FILE", type: "TABLE", title: "파일 설명",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", focus: "file_desc", validate: true },
            content: {
                height: 25, width: { label: 100, field: 550 },
                row: [
                    {
                        element: [
                            { header: true, value: "설명", format: { type: "label" } },
                            { name: "file_desc", editable: { type: "text" } }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: processUpload };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processUpload(param) {

    var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
    gw_com_module.uploadFile(args);

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

    var data = [
        {
            query: "DLG_FILE_ZFILE", // ZFILE
            row: [{
                crud: "U",
                column: [
                    { name: "file_id", value: response.id },
                    { name: "file_path", value: response.path },
                    { name: "file_ext", value: response.ext },
                    { name: "file_desc", value: gw_com_api.getValue("frmData_FILE", 1, "file_desc") },
                    { name: "data_tp", value: v_global.data.type },
                    { name: "data_key", value: (v_global.data.key == undefined ? "" : v_global.data.key) },
                    { name: "data_subkey", value: (v_global.data.sub_key == undefined ? "" : v_global.data.sub_key) },
                    { name: "data_seq", value: (v_global.data.seq == undefined ? "" : v_global.data.seq) },
                    { name: "data_subseq", value: (v_global.data.sub_seq == undefined ? "" : v_global.data.sub_seq) },
                    { name: "use_yn", value: "1" }
                ]
            }]
        }
    ];
    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: data,
        handler: {
            success: successSave
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: response
    };
    gw_com_module.streamInterface(args);
    gw_com_api.setValue("frmData_설명", 1, "file_desc", "");

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
                var args = {
                    targetid: "frmData_FILE", edit: true
                };
                gw_com_module.formInsert(args);
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
