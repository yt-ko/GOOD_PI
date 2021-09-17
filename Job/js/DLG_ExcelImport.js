
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {}, init: false },
    data: null,
    logic: {}
};

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");
        v_global.logic.datatype = gw_com_module.v_Option.datatype;

        start();

        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "업로드", value: "업로드", icon: "실행" },
				{ name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== List Grid : Excel ====
        var args = {
            targetid: "grdData_List", query: "DLG_ExcelImport_List", title: "엑셀 데이터",
            caption: true, height: "300", pager: false, show: true, selectable: true, number: true,
            element: [
				        { name: "file_id", hidden: true },
				        { name: "seq", hidden: true },
				        { name: "chk_cd", hidden: true },
				        { header: "체크결과", name: "chk_msg", width: 150 },
				        { header: "A", name: "COL01", width: 80 },
				        { header: "B", name: "COL02", width: 80 },
				        { header: "C", name: "COL03", width: 80 },
				        { header: "D", name: "COL04", width: 80 },
				        { header: "E", name: "COL05", width: 80 },
				        { header: "F", name: "COL06", width: 80 },
				        { header: "G", name: "COL07", width: 80 },
				        { header: "H", name: "COL08", width: 80 },
				        { header: "I", name: "COL09", width: 80 },
				        { header: "J", name: "COL10", width: 80 },
				        { header: "K", name: "COL11", width: 80 },
				        { header: "L", name: "COL12", width: 80 },
				        { header: "M", name: "COL13", width: 80 },
				        { header: "N", name: "COL14", width: 80 },
				        { header: "O", name: "COL15", width: 80 },
				        { header: "P", name: "COL16", width: 80 },
				        { header: "Q", name: "COL17", width: 80 },
				        { header: "R", name: "COL18", width: 80 },
				        { header: "S", name: "COL19", width: 80 },
				        { header: "T", name: "COL20", width: 80 }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
                    { type: "GRID", id: "grdData_List", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: click_lyrMenu_업로드 };
        gw_com_module.eventBind(args);
        //-----------------------------        
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //-----------------------------        
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //-----------------------------        

        //==== Button Events : Main ====
        function click_lyrMenu_업로드(ui) {
            var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
            gw_com_module.uploadFile(args);
        }

        // startup process.
        gw_com_module.startPage();
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_file_id", value: param.key },
                { name: "arg_job_id", value: param.job_id }
            ]
        },
        target: [
			{ type: "GRID", id: "grdData_List", focus: true, select: true }
        ],
        key: param.key, handler_complete: processRetrieveEnd
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdData_List" }
		]
    };
    gw_com_module.objClear(args);

    //
    ctlUpload.Cancel();
    ctlUpload.ClearText();

}
//----------
function processSave(param) {
    switch (v_global.logic.OPTION.JOB_ID) {
        // 자재반입(일괄,기초)
        case "SRM_4520": {
            var iRow = gw_com_api.getFindRow("grdData_List", "chk_cd", "F");
            if (gw_com_api.getRowCount("grdData_List") < 1) {
                return;
            } else if (iRow > 0) {
                gw_com_api.messageBox([{ text: "오류 항목이 있습니다." }], 300);
            } else {
                // IO 생성
                var args = {
                    url: "COM",
                    procedure: "PROC_SRM_ITEMIO_FROM_EXCEL",
                    nomessage: true,
                    input: [
                        { name: "FileId", value: v_global.logic.key, type: "varchar" },
                        { name: "IoCd", value: v_global.logic.OPTION.IO_CD, type: "varchar" },
                        { name: "ProcessTp", value: "RUN", type: "varchar" },
                        { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                    ],
                    output: [
                        { name: "ResultTp", type: "varchar" },
                        { name: "ResultVal", type: "varchar" }
                    ],
                    message: "",
                    handler: { success: successSave }
                };
                gw_com_module.callProcedure(args)
            }
        } break;
    }
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
function successUpload(response) {
    switch (v_global.logic.OPTION.JOB_ID) {
        // 자재반입(일괄,기초)
        case "SRM_4520": {
            v_global.logic.key = response.id;
            var args = {
                url: "COM",
                procedure: "PROC_SRM_ITEMIO_FROM_EXCEL",
                nomessage: true,
                input: [
                    { name: "FileId", value: v_global.logic.key, type: "varchar" },
                    { name: "IoCd", value: v_global.logic.OPTION.IO_CD, type: "varchar" },
                    { name: "ProcessTp", value: "MAP", type: "varchar" },
                    { name: "UserId", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
                ],
                output: [
                    { name: "ResultTp", type: "varchar" },
                    { name: "ResultVal", type: "varchar" }
                ],
                message: "",
                handler: { success: successSave }
            };
            gw_com_module.callProcedure(args);
        } break;
    }
}
//----------
function successSave(param) {

    switch (v_global.logic.OPTION.JOB_ID) {
        // 자재반입(일괄,기초)
        case "SRM_4520": {
            if (param.NAME[0] == "ResultTp" && param.VALUE[0] == "MAP") {
                processRetrieve({ key: v_global.logic.key, job_id: v_global.logic.OPTION.JOB_ID });
            } else if (param.NAME[0] == "ResultTp" && param.VALUE[0] == "RUN") {
                var args = {
                    ID: gw_com_api.v_Stream.msg_selectedPart_SCM
                    , IO_NO: param.VALUE[1]
                };
                gw_com_module.streamInterface(args);
                processClose({});
            }
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {
    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            v_global.logic.OPTION = param.data;
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;

            switch (param.data.ID) {
                case gw_com_api.v_Message.msg_informSaved: 
                    {
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                    } break;
            }

        } break;
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
