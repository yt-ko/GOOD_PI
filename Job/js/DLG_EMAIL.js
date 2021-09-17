
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: { key: null },
    logic: {}
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
    ready: function (param) {
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.data.args = JSON.parse($("#" + param.args.id).val());

        //----------
        gw_com_DX.register();
        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        start();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);

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
            targetid: "lyrMenu2", type: "FREE",
            element: [
                { name: "확인", value: "보내기", icon: "저장" },
                { name: "취소", value: "닫기", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: false, border: false, align: "left",
            editable: { bind: "open", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "save_template", label: { title: "양식 저장 :" },
                                value: "1",
                                editable: { type: "checkbox", title: "메일 보내기 후 본문 내용을 양식으로 저장합니다.", value: "1", offval: "0" }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmInput", query: "DLG_EMAIL_2", type: "TABLE", title: "",
            caption: false, show: true, selectable: true,
            editable: { bind: "select", focus: "receiver", validate: true },
            content: {
                width: { label: 76, field: 800 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "받는사람", format: { type: "label" }, style: { rowspan: 2 } },
                            { name: "receiver", editable: { type: "hidden", width: 964 }, mask: "search" },
                            { name: "receive_user_id", hidden: true }
                        ]
                    },
                    {
                        element: [
                            //{ header: true, value: "받는사람", format: { type: "label" } },
                            { name: "receiver2", editable: { type: "text", width: 964 } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "제    목", format: { type: "label" } },
                            { name: "subject", editable: { type: "text", width: 964 } }
                        ]
                    },
                    {
                        control: true,
                        element: [
                            {
                                name: "body", hidden: true, editable: { type: "hidden" },
                                control: { by: "DX", type: "htmleditor", id: ctlHTML }
                            }
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
                { type: "FORM", id: "frmInput", offset: 8 }
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = { targetid: "lyrMenu2", element: "확인", event: "click", handler: processSend };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu2", element: "취소", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmInput", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processInit(param) {

    if (v_global.data.args.temp_id != undefined) {
        gw_com_api.show("frmOption");
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_temp_id", value: v_global.data.args.temp_id },
                    { name: "arg_receiver", value: getReceiver() }
                ]
            },
            target: [
                { type: "FORM", id: "frmInput", edit: true }
            ]
        };
        gw_com_module.objRetrieve(args);

    } else {
        var args = {
            targetid: "frmInput",
            data: [
                { name: "receiver", value: getReceiver() },
                { name: "subject", value: v_global.data.args.subject },
                { name: "body", value: (v_global.data.args.body == undefined ? "" : v_global.data.args.body) }
            ]
        };
        gw_com_module.formInsert(args);

    }

}
//----------
function processItemdblclick(param) {

    if (param.object == "frmInput") {
        if (param.element == "receiver") {
            var args = {
                type: "PAGE", page: "DLG_EMAIL_RECEIVER", title: "받는사람 선택",
                width: 700, height: 400, locate: ["center", 50], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "DLG_EMAIL_RECEIVER",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue,
                        data: {
                            to: v_global.data.args.to
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }
        }
    }

}
//----------
function processSend(param) {

    var recv = gw_com_api.getValue("frmInput", 1, "receiver2");
    if ((v_global.data.args.to == undefined || v_global.data.args.to == "") && recv == "") {
        alert("[받는사람]을 지정하세요.");
        return;
    }

    $.each(recv.split(","), function () {
        $.each(this.split(";"), function () {
            v_global.data.args.to[v_global.data.args.to.length] = {
                name: "",
                value: $.trim(this)
            };
        });
    });

    v_global.data.args.nomessage = true;
    v_global.data.args.edit = false;
    v_global.data.args.html = true;
    v_global.data.args.subject = gw_com_api.getValue("frmInput", 1, "subject");
    v_global.data.args.body = convertImgeUrl(gw_com_api.getValue("frmInput", 1, "body"));
    v_global.data.args.handler = {
        success: processSended,
        param: param
    }
    gw_com_module.sendMail(v_global.data.args);

}
//----------
function processSended(response, param) {

    //====================== Log 처리 ========================
    var row = [];

    if (v_global.data.args.key != undefined) {
        $.each(v_global.data.args.to, function () {
            var column = v_global.data.args.key;
            column.unshift({ name: "send_dt", value: gw_com_api.getDate() });
            column.unshift({ name: "body", value: convertImgeUrl(gw_com_api.getValue("frmInput", 1, "body")) });
            column.unshift({ name: "receiver", value: (this.name == "" ? this.value : this.name + "<" + this.value + ">") });
            column.unshift({ name: "subject", value: gw_com_api.getValue("frmInput", 1, "subject") });
            column.push({ name: "receive_user_id", value: (this.user_id == undefined ? "" : this.user_id) });

            row.push({
                crud: "C",
                column: column
            });
        });
    }

    if (row.length > 0) {
        var args = {
            url: "COM",
            user: gw_com_module.v_Session.USR_ID,
            param: [
                {
                    query: "DLG_EMAIL_0",
                    row: row
                }
            ],
            nomessage: true
        };
        $.ajaxSetup({ async: false });
        gw_com_module.objSave(args);
        $.ajaxSetup({ async: true });
    }
    //========================================================

    //====================== 양식 저장 =======================
    if (v_global.data.args.temp_id != undefined) {
        if (gw_com_api.getValue("frmOption", 1, "save_template") == "1") {
            var args = {
                url: "COM",
                user: gw_com_module.v_Session.USR_ID,
                param: [
                    {
                        query: "SYS_2090_1",
                        row: [
                            {
                                crud: "U",
                                column: [
                                    { name: "temp_id", value: v_global.data.args.temp_id },
                                    { name: "temp_subject", value: gw_com_api.getValue("frmInput", 1, "subject") },
                                    { name: "temp_body", value: convertImgeUrl(gw_com_api.getValue("frmInput", 1, "body")) }
                                ]
                            }
                        ]
                    }
                ],
                nomessage: true
            };
            $.ajaxSetup({ async: false });
            gw_com_module.objSave(args);
            $.ajaxSetup({ async: true });
        }
    }
    //========================================================
    try {
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            from: {
                type: "POPUP",
                page: "DLG_EMAIL"
            },
            data: v_global.data.args
        };
        opener.streamProcess(args);
    }
    catch (exception) {

    }
    finally {
        alert("메일이 발송되었습니다.");
        window.close();
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmInput" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    processClear({});
    window.close();

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
            v_global.event.row,
            v_global.event.element,
            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function getReceiver() {

    if (v_global.data.args.to == undefined) return;
    var receiver = "";
    $.each(v_global.data.args.to, function () {
        receiver += (receiver == "" ? "" : ", ") + (this.name == "" ? this.value : this.name);
    });
    return receiver;

}
//----------
function convertImgeUrl(param) {

    // var html = $.parseHTML(param); jquery 1.8....
    // Using Empty DOM..
    $("#lyrHTML_temp").empty();
    $("#lyrHTML_temp").append(param);
    var img = $("#lyrHTML_temp img");
    $.each(img, function () {

        // Set Full URL
        var src = this.src;
        this.src = src;

    });

    var html = $("#lyrHTML_temp").html();
    $("#lyrHTML_temp").empty();
    return html;

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {

                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
                switch (param.from.page) {
                    case "DLG_EMAIL_RECEIVER":
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = {
                            to: v_global.data.args.to
                        };
                        break;
                    default:
                        processInit({});
                        return;
                        break;
                }
                gw_com_module.streamInterface(args);

            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                //processRetrieve({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSended:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_EMAIL_RECEIVER":
                        v_global.data.args.to = param.data;
                        gw_com_api.setValue("frmInput", 1, "receiver", getReceiver());
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//