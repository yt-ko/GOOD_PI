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
        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // Get Page Parameters
        v_global.logic.id = gw_com_api.getPageParameter("id");
        v_global.logic.key = gw_com_api.getPageParameter("key");
        if (v_global.logic.key == "") v_global.logic.key = 0;

        start();

        // Start Process
        function start() {
            gw_job_process.UI();    // Create UI Controls
            gw_job_process.procedure(); // Declare Events
            gw_com_module.startPage();  // resizeFrame & Set focus
            setObject({ title: "신규 거래 제안 프로세스 안내" });
        }

    },

    //--------------------------------------------------------------------------
    // manage UI. (design section)
    //--------------------------------------------------------------------------
    UI: function () {

        //---------------------------------------------------------------------------------
        var args = { targetid: "lyrNotice", row: [ { name: "제목" } ] };
        gw_com_module.labelCreate(args);

        // Create Buttons
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "확인", value: "신규 제안", icon: "AddNew" },
                { name: "수정", value: "이력 보기", icon: "Search" },
                { name: "취소", value: "취소", icon: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        // Create Data Blocks
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "frmHTML", query: "SYS_2090_1", type: "TABLE", title: "",
            caption: true, show: false, selectable: true,    //, fixed: true
            content: {
                width: { field: "100%" }, height: 700,
                row: [
                    {
                        element: [
                            { name: "temp_nm", format: { type: "textarea", height: 700 } },
                            { name: "temp_body", hidden: true, format: { type: "text", height: 800 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //---------------------------------------------------------------------------------
        var args = {
            target: [
                { type: "FORM", id: "frmHTML", offset: 8 }
            ]
        };

        gw_com_module.objResize(args);

    },

    //--------------------------------------------------------------------------
    // manage process. (program section)
    //--------------------------------------------------------------------------
    procedure: function () {

        // Main Buttons
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "취소", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function setObject(param) {


    // set title
    var args = { targetid: "lyrNotice", row: [ { name: "제목", value: "▶ " + gw_com_langs.getLangs(param.title) } ] };
    gw_com_module.labelAssign(args);
    // set html text
    var htmlID = "SRM_OpenSrc_Process";
    if (gw_com_module.v_Session.CUR_LANG == "en") htmlID += "en";
    var args = {
        source: {
            type: "INLINE",
            argument: [
                    { name: "arg_temp_id", value: htmlID }
            ]
        },
        target: [
            { type: "FORM", id: "frmHTML" }
        ]
        , handler: { complete: processSetEnd, param: { key: "1" } }
    };
    gw_com_module.objRetrieve(args);
    //gw_com_api.setValue("frmHTML", 1, "temp_body", param.html);
}
//
function processSetEnd(param) {

    var content = gw_com_api.getValue("frmHTML", "selected", "temp_body");
    $(lyrHtmlView).html(content);

    gw_com_module.startPage();

}
//----------
function processSave(param) {

    var param = [
        { name: "id", value: v_global.logic.id }, { name: "key", value: v_global.logic.key }, { name: "mode", value: "1" }, { name: "agree", value: "1" }
    ];
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "SRM_OpenSrc_Agree", title: gw_com_langs.getLangs("개인정보 처리방침"), param: param }
    };
    gw_com_module.streamInterface(args);

    processClose(param);

}
//----------
function processEdit(param) {

    parent.location.replace("../Master/OpenSrcIntro.aspx");
}
//----------
function processClose(param) {

    //window.close();   // Popup Window
    gw_com_module.streamInterface({ ID: gw_com_api.v_Stream.msg_closePage });   // Close Tab Page

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            break;

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//