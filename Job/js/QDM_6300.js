
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Menu : Main ====
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [{ name: "닫기", value: "닫기" }]
        };
        gw_com_module.buttonMenu(args);

        //==== Launch Tab Arguments ====
        var url = window.location.href.toString();
        var arg = "";

        if (url.indexOf("&PARAM=") > 0) {
            var param = url.split("&PARAM=");
            param = param[1].split("&");
            for (var i = 1; i < param.length; i++) {
                arg = arg + "&" + param[i];
            }
        }
        gw_com_module.v_Current.menu_args = arg;

        //==== Tab Page ====
        var args = {
            tabid: "lyrFrame",
            target: [
                { type: "PAGE", id: "QDM_6310", title: "결과 내역", launch: true },
                { type: "PAGE", id: "QDM_6320", title: "시정조치 결과서" }
                //, { type: "PAGE", id: "EHM_2312", title: "고분보" }      // del by JJ at 2021.04.13
            ]
        };
        gw_com_module.launchTab(args);

        //==== Launch Tab Arguments Clear ====
        gw_com_module.v_Current.menu_args = "";

        //==== Resize Objects ====
        var args = {
            target: [{ type: "TAB", id: "lyrFrame", offset: 8 }]
        };
        gw_com_module.objResize(args);

        // go next.
        gw_job_process.procedure();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);

        function click_lyrMenu_닫기(ui) { processClose({}); }

        gw_com_module.startPage();

    }   // End of gw_job_process.procedure
};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------------------------------------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------------------------------------
resizeFrame = function (args) {
    if (args.height < 545) args.height = 545;
    $("#page_" + args.id).attr("height", args.height + 5);
    gw_com_module.informSize();
};
//----------------------------------------
streamProcess = function (param) {
    switch (param.ID) {
        case gw_com_api.v_Stream.msg_linkPage:
            {
                var arg = "";
                if (param.data.param != undefined) {
                    $.each(param.data.param, function () {
                        arg = arg + "&" + this.name + "=" + this.value;
                    });
                }
                gw_com_module.loadTab({ tabid: "lyrFrame", targetid: param.data.page, param: arg });
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue(param.from.page);
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//