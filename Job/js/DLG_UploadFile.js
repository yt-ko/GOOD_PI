//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.12)
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        v_global.logic.datatype = gw_com_module.v_Option.datatype;
        //----------
        gw_com_api.changeTheme("style_theme");
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // start().
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        start();
        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
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
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "업로드", value: "업로드", icon: "저장", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_설명", type: "TABLE", title: "파일 설명",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", focus: "file_desc", validate: true },
            content: {
                height: 25, width: { label: 80, field: 524 },
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
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_설명", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

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
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "업로드":
                    {
                        var args = {
                            targetid: "lyrServer",
                            control: { by: "DX", id: ctlUpload }
                        };
                        gw_com_module.uploadFile(args);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
            }

        }

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_설명" }
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
function successUpload(response, param) {

    var file_desc = gw_com_api.getValue("frmData_설명", 1, "file_desc");
    var row = new Array();
    var data = new Array();
    $.each(response.data, function () {

        row.push({
            crud: "U",
            column: [
                { name: "file_id", value: this.file_id },
                { name: "file_nm", value: this.file_nm },
                { name: "file_ext", value: this.file_ext },
                { name: "file_path", value: this.file_path },
                { name: "file_desc", value: file_desc },
                { name: "data_tp", value: (v_global.logic.data_tp == undefined ? "" : v_global.logic.data_tp) },
                { name: "data_key", value: (v_global.logic.data_key == undefined ? "" : v_global.logic.data_key) },
                { name: "data_subkey", value: (v_global.logic.data_subkey == undefined ? "" : v_global.logic.data_subkey) },
                { name: "data_seq", value: (v_global.logic.data_seq == undefined ? "" : v_global.logic.data_seq) },
                { name: "data_subseq", value: (v_global.logic.data_subseq == undefined ? "" : v_global.logic.data_subseq) },
                { name: "use_yn", value: "0" }, // Parent에서 "1" 처리
                { name: "ins_usr", value: gw_com_module.v_Session.USR_ID },
                { name: "ins_dt", value: "SYSDT" }
            ]
        });
        data.push({
            file_id: this.file_id,
            file_nm: this.file_nm,
            file_ext: this.file_ext,
            file_path: this.file_path,
            file_desc: file_desc,
            data_tp: (v_global.logic.data_tp == undefined ? "" : v_global.logic.data_tp),
            data_key: (v_global.logic.data_key == undefined ? "" : v_global.logic.data_key),
            data_subkey: (v_global.logic.data_subkey == undefined ? "" : v_global.logic.data_subkey),
            data_seq: (v_global.logic.data_seq == undefined ? "" : v_global.logic.data_seq),
            data_subseq: (v_global.logic.data_subseq == undefined ? "" : v_global.logic.data_subseq)
        });

    })

    var args = {
        url: "COM",
        nomessage: true,
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: "DLG_FILE_ZFILE",
                row: row
            }
        ],
        handler: {
            success: successSave,
            param: data
        }
    };

    // 연계정보
    if (v_global.logic.ref != undefined) {
        $.each(v_global.logic.ref, function () {
            $.each(this.row, function () {
                $.each(this.column, function () {
                    if (this.name == "file_id" && this.value == null)
                        this.value = data[0].file_id;
                })
            })
            args.param.push(this);
        })
    }
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param
    };
    gw_com_module.streamInterface(args);
    processClear({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.logic = param.data;
                v_global.process.init = true;
                var args = {
                    targetid: "frmData_설명",
                    edit: true
                };
                gw_com_module.formInsert(args);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informSaved:
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