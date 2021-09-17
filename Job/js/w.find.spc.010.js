
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
				{
				    type: "PAGE", name: "검사구분", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "SPC011" }]
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() {
            gw_job_process.UI();
        }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function() {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, align: "left", //remark: "lyrRemark", margin: 220,
            editable: { focus: "rcode", validate: true, bind: "open" },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "rcode", label: { title: "검사구분 :" },
                                editable: { type: "select", data: { memory: "검사구분", unshift: [{ title: "전체", value: "" }] } }
                            },
                            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "w_find_spc_010_1", title: "검사항목",
            caption: false, height: 340, show: true, selectable: true, key: true,
            element: [
				{ header: "검사구분", name: "rname", width: 100, align: "center" },
				{ header: "검사항목", name: "dname", width: 400 },
				{ name: "dcode", hidden: true },
				{ name: "rcode", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

        gw_job_process.procedure();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function() {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        function click_lyrMenu_조회(ui) { processRetrieve({}); }
        //----------
        function click_lyrMenu_닫기(ui) { processClose({}); }
        //----------
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: rowdblclick_grdList_MAIN };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowkeyenter", handler: rowdblclick_grdList_MAIN };
        gw_com_module.eventBind(args);
        //----------
        function rowdblclick_grdList_MAIN(ui) { informResult({}); }
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_module.startPage();
        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        gw_com_module.streamInterface(args);

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------------------------------------
processRetrieve = function (param) {

    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption",
            element: [
				{ name: "rcode", argument: "arg_rcode" }
			]
        },
        target: [
			{ type: "GRID", id: "grdList_MAIN", select: true, focus: true }
		]
    };
    gw_com_module.objRetrieve(args);

};
//----------------------------------------
function processItemchanged(param) {

    processRetrieve({});

}
//----------------------------------------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);

};
//----------
function informResult(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: {
            dcode: gw_com_api.getValue("grdList_MAIN", "selected", "dcode", true),
            dname: gw_com_api.getValue("grdList_MAIN", "selected", "dname", true),
            rcode: gw_com_api.getValue("grdList_MAIN", "selected", "rcode", true),
            rname: gw_com_api.getValue("grdList_MAIN", "selected", "rname", true)
        }
    };
    gw_com_module.streamInterface(args);

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function(param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (!v_global.process.init) processRetrieve({});
                v_global.process.init = true;
                gw_com_api.setFocus("frmOption", 1, "rcode");                
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) break;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//