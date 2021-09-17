//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : System Notice Main
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 주요 수정 부문 : Get Page Parameters, Create TabPages
// Declare Page Variables
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

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");
        // Get Page Parameters
        v_global.logic.step = gw_com_api.getPageParameter("step");

        start();

        // Start Process
        function start() {
            gw_job_process.UI();    // Create UI Controls
            gw_job_process.procedure(); // Declare Events
            gw_com_module.startPage();  // informSize resizeFrame & Set focus

            //if (v_global.logic.step == "R")
            //    $("#lyrFrame").tabs('select', "GMS_RequestEdit");
            //else
            //    $("#lyrFrame").tabs('select', "GMS_RequestList");
        }
    },

    // manage UI. (design section)
    UI: function () {

        // Create Buttons
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [ { name: "닫기", value: "닫기" } ]
        };
        gw_com_module.buttonMenu(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create TabPages
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        v_global.logic.refreshPage = 0; // 데이터 저장 시 자동 Refresh가 필요한 List Page Seq. (0~)
        var args = {
            tabid: "lyrFrame",
            target: [
                { type: "PAGE", id: "GMS_RequestList", title: "목록", launch: true, handler: clickTabPage },   //tabselect Event handler
                { type: "PAGE", id: "GMS_RequestEdit", title: "내역" }
            ]
            //, data: { param: [{ name: "nt_tp", value: "협력사" }] }
        };
        //// Set First TabPage
        //if (v_global.logic.step == "R")
        //{ args.target[1].launch = true; }
        //else
        //{ args.target[0].launch = true; }

        // Add TabPage
        //args.target.push({ type: "PAGE", id: "GMS_RequestRptA", title: "월별 집계" });
        // add Menu Arguments
        gw_com_module.v_Current.menu_args = "&step=" + v_global.logic.step;   

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
//---------- tabPage Size 조절 : called by gw_com_module.informSize
resizeFrame = function (args) {

    if (args.height < 545) args.height = 545;
    $("#page_" + args.id).attr("height", args.height + 5);
    gw_com_module.informSize();

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. Common
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
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
                //$("#lyrFrame").tabs('select', "GMS_RequestList");
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
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//