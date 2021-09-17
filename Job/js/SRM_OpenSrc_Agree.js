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
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            setObject({ title: "개인정보 수집 및 이용에 대한 동의" });

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
                { name: "확인", value: "동의", icon: "저장" },
                { name: "취소", value: "취소", icon: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        // Create Data Blocks
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "frmHTML", query: "SYS_2090_1", type: "TABLE", title: gw_com_langs.getLangs("개인정보 수집 및 이용에 대한 동의"),
            caption: false, show: false, selectable: true,    //, fixed: true
            content: {
                width: { field: "100%" }, height: 700,
                row: [
                    {
                        element: [
                            //{ name: "temp_nm", hidden: true, format: { type: "textarea", height: 700 } },
                            //{ name: "temp_body", format: { type: "text", height: 800 } }
                            { name: "temp_body", hidden: true, format: { type: "html", height: 480 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //---------------------------------------------------------------------------------
        var args = {
            targetid: "lyrNotice",
            row: [
                { name: "제목" }
            ]
        };
        gw_com_module.labelCreate(args);
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
    var htmlID = "SRM_OpenSrc_Agree";
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
//----------
function processSetEnd(param) {

    var content = gw_com_api.getValue("frmHTML", "selected", "temp_body");
    $(lyrHtmlView).html(content);

    gw_com_module.startPage();

}
//----------
function processSave(param) {

    //var param = "id=" + v_global.logic.id + "&key=" + v_global.logic.key + "&mode=1";
    //location.replace("/Job/SRM_OpenSrc_Edit.aspx" + param);
    var sMsg = "";
    if (gw_com_module.v_Session.CUR_LANG == "en")
        sMsg = "Is the new proposed item correct for the raw materials, labor costs, and consumables applicable to the equipment?\n"
            + "Yes : Proceed to register new transaction proposal\n"
            + "No  : Cancel progress. Please double check your suggested item."
    else
        sMsg = "신규 제안 품목이 반도체/디스플레이 장비 산업에 적용이 가능한 원자재/인건비/소모품이 맞습니까?\n"
            + "(태양광/자동차/2차전지/건설 산업군의 제안 품목은 당사 거래 품목과 관련이 없는 경우가 많으니 재 확인 바랍니다.)\n"
            + "Yes : 신규 거래 제안서 등록 진행\n"
            + "No  : 진행 취소. 귀사의 제안 품목을 재 확인 바랍니다."
    var isYes = gw_com_api.showMessage(sMsg, "yesno");
    if (isYes == false) return;

    var param = [
        { name: "id", value: v_global.logic.id }, { name: "key", value: v_global.logic.key }
    ];
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "SRM_OpenSrc_Edit", title: gw_com_langs.getLangs("신규 거래 제안"), param: param }
    };
    gw_com_module.streamInterface(args);
    
    processClose(param);

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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//