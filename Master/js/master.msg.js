//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: {
        param: null, entry: null, act: null, handler: null, current: { menu: null, icon: null }, prev: {}
    },
    msg: { ID: null, from: null, page: null, arg: null }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    ready: function () {
        //----------
        v_global.process.param = gw_com_module.initPage();
        start();
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
        }
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1",
            type: "FREE",
            align: "center",
            show: false,
            element: [
				{
				    name: "확인",
				    value: "확인",
				    icon: "닫기"
				}
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2",
            type: "FREE",
            align: "center",
            show: false,
            element: [
				{
				    name: "예",
				    value: "예"
				},
				{
				    name: "아니오",
				    value: "아니오"
				}
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3",
            type: "FREE",
            align: "center",
            show: false,
            element: [
				{
				    name: "예",
				    value: "예"
				},
				{
				    name: "아니오",
				    value: "아니오"
				},
				{
				    name: "취소",
				    value: "취소",
				    icon: "닫기"
				}
			]
        };
        gw_com_module.buttonMenu(args);


    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "확인",
            event: "click",
            handler: click_lyrMenu_확인
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "예",
            event: "click",
            handler: click_lyrMenu_예
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "아니오",
            event: "click",
            handler: click_lyrMenu_아니오
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "예",
            event: "click",
            handler: click_lyrMenu_예
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "아니오",
            event: "click",
            handler: click_lyrMenu_아니오
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "취소",
            event: "click",
            handler: click_lyrMenu_취소
        };
        gw_com_module.eventBind(args);

        //----------
        function click_lyrMenu_확인(ui) {
            informResult("OK");
        }
        //----------
        function click_lyrMenu_예(ui) {
            informResult("YES");
        }
        //----------
        function click_lyrMenu_아니오(ui) {
            informResult("NO");
        }
        //----------
        function click_lyrMenu_취소(ui) {
            closeMe();
        }

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function informResult(result) {

    $("#lyrMsg").html("");
    var args = {
        ID: gw_com_api.v_Stream.msg_resultMessage,
        data: {
            ID: v_global.msg.ID,
            to: v_global.msg.from,
            page: v_global.msg.page,
            arg: v_global.msg.arg,
            result: result
        }
    };
    gw_com_module.streamInterface(args);
    
}
//----------
function closeMe() {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);
    $("#lyrMsg").html("");

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    v_global.msg.ID = param.ID;
    v_global.msg.from = param.data.from;
    v_global.msg.page = param.data.page;
    v_global.msg.arg = param.data.arg;
    if (v_global.process.current.menu != null)
        gw_com_api.hide(v_global.process.current.menu);
    if (v_global.process.current.icon != null)
        gw_com_api.hide(v_global.process.current.icon);
    switch (param.data.type) {
        case "ALERT":
            v_global.process.current.menu = "lyrMenu_1";
            v_global.process.current.icon = "imgIcon_1";
            break;
        case "YESNO":
            v_global.process.current.menu = "lyrMenu_2";
            v_global.process.current.icon = "imgIcon_2";
            break;
        case "YESNOCANCEL":
            v_global.process.current.menu = "lyrMenu_3";
            v_global.process.current.icon = "imgIcon_2";
            break;
        default:
            v_global.process.current.menu = "lyrMenu_2";
            v_global.process.current.icon = "imgIcon_2";
            break;
    }
    gw_com_api.show(v_global.process.current.menu);
    gw_com_api.show(v_global.process.current.icon);
    $("#lyrMsg").html(param.data.message);
    gw_com_module.informSize();

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//