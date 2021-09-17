//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : 설계 Guide 문서 관리
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Declare Page Variables
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: { refreshPage: -1, refreshYn: false }
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

        // Start Process
        start();

        function start() {
            gw_job_process.UI();    // Create UI Controls
            gw_job_process.procedure(); // Declare Events
            gw_com_module.startPage();  // resizeFrame & Set focus
        }

    },

    // manage UI. (design section)
    UI: function () {

        // Create Buttons
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create TabPages
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.logic.refreshPage = 1; // 데이터 저장 시 자동 Refresh가 필요한 List Page Seq. (0~)
        var args = {
            tabid: "lyrFrame",
            target: [
				{ type: "PAGE", id: "w_pom9010", title: "협력사 등록", launch: true },
                { type: "PAGE", id: "SYS_Notice_List", title: "Notice List", handler: clickTabPage },   //tabselect Event handler
                { type: "PAGE", id: "SYS_Notice_Edit", title: "Notice Edit" }
            ]
            //, data: { param: [{ name: "nt_tp", value: "협력사" }] } // launch 로 열리는 Page에 전달이 안되는 문제점으로 미사용 by JJJ
        };
        gw_com_module.v_Current.menu_args = "&nt_tp=" + v_global.logic.nt_tp;   // add Menu Arguments
        gw_com_module.launchTab(args);

        // Resize Data Box
        var args = {
            target: [
                { type: "TAB", id: "lyrFrame", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

    },

    // manage process. (program section)
    procedure: function () {

        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        var args = { targetid: "lyrFrame", event: "tabselect", handler: clickTabPage };
        gw_com_module.eventBind(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. only Main Page with tabPages
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- TabbPage Click Event
function clickTabPage(ui) {
    // Refresh List Page : msg_closePage
    if (v_global.logic.refreshYn && v_global.logic.refreshPage == ui.index) {
        v_global.logic.refreshYn = false;
        frames[ui.index].streamProcess(
            { ID: gw_com_api.v_Stream.msg_refreshPage, findKey: v_global.logic.findKey }
        );
    }
}
//----------
resizeFrame = function (args) {

    if (args.height < 545) args.height = 545;
    $("#page_" + args.id).attr("height", args.height + 5);
    gw_com_module.informSize();

};

function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_linkPage: // Load tabPage
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () {
                        arg = arg + "&" + this.name + "=" + this.value;
                    });
                }
                gw_com_module.loadTab({ tabid: "lyrFrame", targetid: param.data.page, param: arg });
            } break;
        case gw_com_api.v_Stream.msg_refreshPage: // List page 를 Refresh 하기위한 처리
            {
                v_global.logic.refreshYn = true;
                v_global.logic.findKey = param.findKey;
            } break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            } break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                }
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue(param.from.page);
            } break;
    } // End switch
}; // End streamProcess

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//