//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data for DDDW List
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));

        }

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    UI: function () {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE", show: true,
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "사건사고 등록" },
                { name: "수정", value: "사건사고 수정", icon: "기타" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "발생일자 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }, style: { colfloat: "floating" }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "acdt_no", label: { title: "발생번호 :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_ACDT", query: "QDM_6610_1", title: "발생목록",
            height: 350, show: true, caption: false, selectable: true, number: true,
            element: [
                { header: "장비군", name: "dept_area_nm", width: 60 },
                { header: "발생번호", name: "acdt_no", width: 90, align: "center" },
                { header: "발생현상", name: "rmk", width: 400 },
                { header: "발생일자", name: "acdt_date", width: 80, align: "center", mask: "date-ymd" },
                //{ header: "처리상태", name: "astat_nm", width: 70 },
                { header: "담당부서", name: "acdt_dept_nm", width: 100 },
                { header: "대상건수", name: "ncr_cnt", width: 60, align: "right", mask: "numeric-int" },
                { header: "대책수립", name: "astat1", width: 70 },
                { header: "횡전개", name: "astat4", width: 70 },
                { header: "Claim", name: "astat5", width: 70 }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_ACDT_D", query: "QDM_6610_2", type: "TABLE", title: "진행이력",
            show: true, selectable: true, caption: true,
            content: {
                width: { label: 140, field: 140 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "구분", format: { type: "label" } },
                            { header: true, value: "원인분석", format: { type: "label" } },
                            { header: true, value: "대책수립", format: { type: "label" } },
                            { header: true, value: "평가", format: { type: "label" } },
                            { header: true, value: "횡전개", format: { type: "label" } },
                            { header: true, value: "Claim", format: { type: "label" } },
                            { header: true, value: "환입", format: { type: "label" } },
                            { header: true, value: "품질비용", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "진행여부", format: { type: "label" } },
                            { value: "-", format: { type: "label" } },
                            { value: "-", format: { type: "label" } },
                            {
                                name: "step3_yn",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "step4_yn",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "step5_yn",
                                format: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            { value: "-", format: { type: "label" } },
                            { value: "-", format: { type: "label" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리계획일자", format: { type: "label" } },
                            { name: "plan1_date", mask: "date-ymd" },
                            { name: "plan2_date", mask: "date-ymd" },
                            { name: "plan3_date", mask: "date-ymd" },
                            { name: "plan4_date", mask: "date-ymd" },
                            { name: "plan5_date", mask: "date-ymd" },
                            { name: "plan6_date", mask: "date-ymd" },
                            { name: "plan_amt", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "처리완료일자", format: { type: "label" } },
                            { name: "act1_date", mask: "date-ymd" },
                            { name: "act2_date", mask: "date-ymd" },
                            { name: "act3_date", mask: "date-ymd" },
                            { name: "act4_date", mask: "date-ymd" },
                            { name: "act5_date", mask: "date-ymd" },
                            { name: "act6_date", mask: "date-ymd" },
                            { name: "act_amt", mask: "numeric-int" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "상태", format: { type: "label" } },
                            { name: "stat1" },
                            { name: "stat2" },
                            { name: "stat3" },
                            { name: "stat4" },
                            { name: "stat5" },
                            { name: "stat6" },
                            { value: "", format: { type: "label" } },
                            { name: "color1", hidden: true },
                            { name: "color2", hidden: true },
                            { name: "color3", hidden: true },
                            { name: "color4", hidden: true },
                            { name: "color5", hidden: true },
                            { name: "color6", hidden: true }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_ACDT", offset: 8 },
                { type: "FORM", id: "frmData_ACDT_D", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================

    },
    //#endregion

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_ACDT", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            if (param.element != "조회")
                closeOption();

            switch (param.element) {
                case "조회":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "추가":
                    {
                        var args = {
                            ID: gw_com_api.v_Stream.msg_linkPage,
                            to: { type: "MAIN" },
                            data: {
                                page: "QDM_6620", title: "사건사고 등록"
                            }
                        };
                        gw_com_module.streamInterface(args);
                    }
                    break;
                case "수정":
                    {
                        if (gw_com_api.getSelectedRow("grdList_ACDT") == null) {
                            gw_com_api.messageBox([{ text: "NOMASTER" }]);
                            return;
                        }
                        var args = {
                            ID: gw_com_api.v_Stream.msg_linkPage,
                            to: { type: "MAIN" },
                            data: {
                                page: "QDM_6620", title: "사건사고 등록",
                                param: [
                                    { name: "acdt_no", value: gw_com_api.getValue("grdList_ACDT", "selected", "acdt_no", true) }
                                ]
                            }
                        };
                        gw_com_module.streamInterface(args);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "실행":
                    {
                        processRetrieve({});
                    }
                    break;
            }

        }
        //----------
        function processRowselected(param) {

            processRetrieve(param);

        }
        //=====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    if (param.object == "grdList_ACDT") {

        var args = {
            source: {
                type: param.type, id: param.object, row: param.row, block: true,
                element: [
                    { name: "acdt_no", argument: "arg_acdt_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_ACDT_D" }
            ],
            handler: {
                complete: processSetStat,
                param: param
            }
        };
        gw_com_module.objRetrieve(args);

    } else {

        processSetStat({ clear: true });
        var args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "acdt_no", argument: "arg_acdt_no" },
                    { name: "dept_area", argument: "arg_dept_area" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "acdt_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_ACDT", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_ACDT_D" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    }

}
//----------
function processSetStat(param) {

    var obj = "frmData_ACDT_D";
    var color1 = gw_com_api.getValue(obj, 1, "color1");
    var color2 = gw_com_api.getValue(obj, 1, "color2");
    var color3 = gw_com_api.getValue(obj, 1, "color3");
    var color4 = gw_com_api.getValue(obj, 1, "color4");
    var color5 = gw_com_api.getValue(obj, 1, "color5");
    var color6 = gw_com_api.getValue(obj, 1, "color6");
    color1 = (color1 == undefined || param.clear ? "transparent" : color1);
    color2 = (color2 == undefined || param.clear ? "transparent" : color2);
    color3 = (color3 == undefined || param.clear ? "transparent" : color3);
    color4 = (color4 == undefined || param.clear ? "transparent" : color4);
    color5 = (color5 == undefined || param.clear ? "transparent" : color5);
    color6 = (color6 == undefined || param.clear ? "transparent" : color6);

    $("#" + obj + "_stat1_view").css("background-color", color1);
    $("#" + obj + "_stat2_view").css("background-color", color2);
    $("#" + obj + "_stat3_view").css("background-color", color3);
    $("#" + obj + "_stat4_view").css("background-color", color4);
    $("#" + obj + "_stat5_view").css("background-color", color5);
    $("#" + obj + "_stat6_view").css("background-color", color6);

    var ele1 = $("#" + obj + "_stat1_view").closest("td");
    var ele2 = $("#" + obj + "_stat2_view").closest("td");
    var ele3 = $("#" + obj + "_stat3_view").closest("td");
    var ele4 = $("#" + obj + "_stat4_view").closest("td");
    var ele5 = $("#" + obj + "_stat5_view").closest("td");
    var ele6 = $("#" + obj + "_stat6_view").closest("td");

    ele1.css("background", color1);
    ele2.css("background", color2);
    ele3.css("background", color3);
    ele4.css("background", color4);
    ele5.css("background", color5);
    ele6.css("background", color6);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
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
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                    case gw_com_api.v_Message.msg_confirmRemove:
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
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
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
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//