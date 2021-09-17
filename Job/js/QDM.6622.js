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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "INLINE", name: "날짜구분",
                    data: [
                        { title: "등록일", value: "INS_DATE" },
                        { title: "완료일", value: "END_DATE" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // start page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "저장", value: "확인" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MODIFY", query: "QDM_6622_1", title: "횡전개",
            caption: true, height: 270, pager: true, show: true, selectable: true, multi: true, checkrow: true,
            element: [
                { header: "ECA작성일", name: "eca_dt", width: 100, align: "center", mask: "date-ymd" },
                { header: "ECA No.", name: "eca_no", width: 100, align: "center" },
                {
                    header: "ECO No.", name: "eco_no", width: 100, align: "center",
                },
                { header: "제목", name: "eco_title", width: 350 },
                {
                    header: "설비대수", name: "cnt1", width: 80, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { header: "적용모듈(건)", name: "cnt2", width: 80, align: "center" },
                { header: "진행율(%)", name: "modify_rate", width: 80, align: "center", mask: "numeric-int" },
                { header: "등록일", name: "ins_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "최근작업일", name: "end_date", width: 80, align: "center", mask: "date-ymd" },
                { name: "modify_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MODIFY", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        //var args = { targetid: "grdList_MODIFY", grid: true, event: "rowdblclick", handler: informResult };
        //gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            if (param.element != "조회")
                gw_com_api.hide("frmOption");

            switch (param.element) {

                case "조회":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "저장":
                    {
                        informResult({});
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

    var pstat = gw_com_api.getValue("frmOption", 1, "stat0") + gw_com_api.getValue("frmOption", 1, "stat1");
    if (pstat == "11")
        pstat = "%";
    else if (pstat == "10")
        pstat = "10";       // 미완료 = 진행
    else if (pstat == "01")
        pstat = "90";       // 완료
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "date_tp", argument: "arg_date_tp" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "eca_no", argument: "arg_eca_no" },
                { name: "eco_no", argument: "arg_eco_no" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "eco_title", argument: "arg_eco_title" }
            ],
            argument: [
                { name: "arg_pstat", value: pstat }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_tp") + " :" },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "eca_no" }] },
                { element: [{ name: "eco_no" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "eco_title" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MODIFY" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdList_MODIFY", true);
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var data = new Array();
    $.each(ids, function () {
        var row = gw_com_api.getRowData("grdList_MODIFY", this);
        delete row._CRUD;
        delete row._NO;
        row.ref_tp = "MODIFY";
        row.ref_no = row.modify_no;
        row.acdt_no = v_global.logic.acdt_no;
        data.push(row);
    })
    processClose({ data: data });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MODIFY" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
    gw_com_module.streamInterface(args);

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
            v_global.event.row,
            v_global.event.element,
            (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function init() {

    var args = {
        targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
        trans: true, border: true, show: true,
        editable: { focus: "dept_area", validate: true },
        content: {
            row: [
                {
                    element: [
                        {
                            name: "date_tp", style: { colfloat: "float" },
                            editable: { type: "select", data: { memory: "날짜구분" } }
                        },
                        {
                            name: "ymd_fr", mask: "date-ymd", style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 10 }
                        },
                        {
                            name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                            editable: { type: "text", size: 7, maxlength: 10 }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select", data: { memory: "DEPT_AREA"/*, unshift: [{ title: "전체", value: "%" }]*/ } }
                        },
                        {
                            name: "stat0", label: { title: "미완료 :" }, value: "1",
                            editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                        },
                        {
                            name: "stat1", label: { title: "완료 :" }, value: "1",
                            editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "eca_no", label: { title: "ECA No. :" },
                            editable: { type: "text", size: 14 }
                        },
                        {
                            name: "eco_no", label: { title: "ECO No. :" },
                            editable: { type: "text", size: 14 }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "proj_no", label: { title: "Project No. :" },
                            editable: { type: "text", size: 14 }
                        },
                        {
                            name: "eco_title", label: { title: "제목 :" },
                            editable: { type: "text", size: 17 }
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
    var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
    gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmOption", element: "취소", event: "click", handler: function () { gw_com_api.hide("frmOption"); } };
    gw_com_module.eventBind(args);
    //=====================================================================================
    gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
    gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
    //----------
    v_global.process.init = true;

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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (param.from.type == "CHILD") {
                    if (!v_global.process.init)
                        init();
                    v_global.logic = param.data;
                    //processRetrieve({});
                }

                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = v_global.event.data;
                        }
                        break;
                }
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