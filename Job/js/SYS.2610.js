//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

        // prepare dialogue.
        var args = { type: "PAGE", page: "EDM_9011", title: "설계파일배포", width: 1150, height: 530 };
        gw_com_module.dialoguePrepare(args);

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "휴일구분",
                    data: [
                        { title: "평일", value: "0" },
                        { title: "토요일", value: "1" },
                        { title: "일요일", value: "2" },
                        { title: "공휴일", value: "3" }
                    ]
                },
                {
                    type: "INLINE", name: "요일구분",
                    data: [
                        { title: "일요일", value: "1" },
                        { title: "월요일", value: "2" },
                        { title: "화요일", value: "3" },
                        { title: "수요일", value: "4" },
                        { title: "목요일", value: "5" },
                        { title: "금요일", value: "6" },
                        { title: "토요일", value: "7" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            //----------
            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: false, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            { name: "이전", value: "◁", format: { type: "button", noicon: true } },
                            {
                                name: "ym", mask: "date-ym", value: gw_com_api.getYM(), align: "center",
                                editable: { type: "text", size: 7, maxlength: 10/*, readonly: true*/ }
                            },
                            { name: "다음", value: "▷", format: { type: "button", noicon: true } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MAIN", query: "SYS_2610_1", title: "",
            caption: false, height: 490, pager: false, show: true, selectable: true, number: true, pager: true,
            editable: { master: true, bind: "select", validate: true },
            color: { element: ["_NO", "holiday", "holiday_type", "job_yn"] },
            element: [
                {
                    header: "날짜", name: "holiday", width: 150, mask: "date-ymd", align: "center",
                    editable: { type: "hidden" }
                },
                {
                    header: "내용", name: "rmk", width: 650,
                    editable: { type: "text", maxlength: 50 }
                },
                {
                    header: "휴일구분", name: "holiday_type", width: 150, align: "center",
                    format: { type: "select", data: { memory: "휴일구분" } },
                    editable: { type: "select", data: { memory: "휴일구분" } }
                },
                {
                    header: "근무여부", name: "job_yn", width: 150, align: "center",
                    format: { type: "checkbox", value: "Y", offval: "N" },
                    editable: { type: "checkbox", value: "Y", offval: "N" }
                },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "이전", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "다음", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "이전":
                case "다음":
                    {
                        var ym = gw_com_api.getValue("frmOption", 1, "ym") + "01";
                        if (param.element == "이전")
                            ym = gw_com_api.addDate("m", -1, ym, "").substr(0, 6);
                        else
                            ym = gw_com_api.addDate("m", 1, ym, "").substr(0, 6);
                        gw_com_api.setValue("frmOption", 1, "ym", ym);
                    }
                    break;
                case "저장":
                    {
                        processSave({});
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
            }

        }
        //----------
        function processItemchanged(param) {

            processRetrieve({});

        }
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function viewOption() {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "ym", argument: "arg_ym" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object, v_global.event.row, v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_MAIN" }
        ],
        handler: {
            success: successSave
        }
    };
    if (gw_com_module.objValidate(args) == false) return false;

    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve(response);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {                                
                                if (param.data.arg.response != undefined)
                                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                                else if (param.data.arg.param != undefined)
                                    param.data.arg.handler(param.data.arg.param);
                                else
                                    param.data.arg.handler();
                            }
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else if (param.data.arg.response != undefined)
                                    param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//