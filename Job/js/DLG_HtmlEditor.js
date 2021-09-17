//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : 설계 Guide 문서 관리
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Declare Page Variables
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: { key: null },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    ready: function () {

        gw_com_DX.register();
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });

        start();

        // Start Process
        function start() {
            gw_job_process.UI();
        }

    },

    //--------------------------------------------------------------------------
    // manage UI. (design section)
    //--------------------------------------------------------------------------
    UI: function () {

        // Create Buttons
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "확인", value: "확인", icon: "저장" },
                { name: "취소", value: "닫기", icon: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        // Create Data Blocks
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "frmHTML", query: "w_ehm2010_S_8", type: "TABLE", title: "상세 메모",
            width: "100%", scroll: false, show: true, selectable: true,
            editable: { bind: "select", focus: "memo_text", validate: true },
            content: {
                row: [ {
                    control: true,
                    element: [
                        {
                            name: "memo_text", hidden: true, editable: { type: "hidden" },
                            control: { by: "DX", type: "htmleditor", id: ctlHTML }
                        }
                    ] }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "lyrNotice", row: [ { name: "제목" } ]
        };
        gw_com_module.labelCreate(args);
        //---------------------------------------------------------------------------------
        var args = {
            target: [
                { type: "FORM", id: "frmHTML", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

        // go next.
        gw_job_process.procedure();

    },

    //--------------------------------------------------------------------------
    // manage process. (program section)
    //--------------------------------------------------------------------------
    procedure: function () {

        // Main Buttons
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        $(window).bind("resize", function () {
            processResize();
        });

        // startup process.
        processResize();
        gw_com_module.startPage();

        // Call streamProcess of parent page
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processInit(s, e) {

    var param = window.opener.v_global.event.send_data;
    if (param) {
        setObject(param);
    }

    // 
    var enabled = true;
    if (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") {
        enabled = false;
    } else if (param && param.auth != undefined) {
        if (param.auth == "R") enabled = false;
    }
    ctlHTML.SetActiveTabByName(enabled ? "d" : "p");    // d: Design, h: HTML, p: Preview
    ctlHTML.SetEnabled(enabled);

}
//----------
function setObject(param) {
    // set title
    var args = { targetid: "lyrNotice", row: [ { name: "제목", value: "▶ " + param.title } ] };
    gw_com_module.labelAssign(args);
    // set html text
    gw_com_api.setValue("frmHTML", 1, "memo_text", param.html);
}
//----------
function processSave(param) {

    var html = gw_com_api.getValue("frmHTML", 1, "memo_text");
    html = convertHtml(html);

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        from: { page: gw_com_module.v_Current.window },
        data: { html: html, update: (html != v_global.data.html) ? true : false }
    };
    window.opener.streamProcess(args);
    
    processClose(param);

}
//----------
function processClose(param) {

    window.close();

}
//----------
function convertHtml(html) {

    // create image file from base64 image
    var data = { html: html };
    var rtn = false;
    var funcName = "convertHtml";

    $.ajax({
        url: gw_com_module.v_Current.window + ".aspx/" + funcName,
        type: 'post', contentType: "application/json; charset=utf-8",
        cache: false, async: false, dataType: "json",
        data: JSON.stringify(data),
        success: function (data) { rtn = data.d; },
        error: function (xmlRequest) {
            alert(xmlRequest.status + '\r\n' + xmlRequest.statusText + '\r\n' + xmlRequest.responseText);
            if (args.handler_error != undefined) args.handler_error();
        }
    });
    return rtn;
}
//----------
function processResize() {
    var h = $(window).height();
    ctlHTML.SetHeight(h - 66);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") processSave({});
                            else if (v_global.process.handler != null) v_global.process.handler({});
                        }
                        break;
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