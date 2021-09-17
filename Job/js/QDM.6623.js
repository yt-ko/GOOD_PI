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
                    type: "PAGE", name: "발생구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QDM010" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM29" }]
                },
                {
                    type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
                    param: [{ argument: "arg_hcode", value: "IEHM02" }]
                },
                {
                    type: "INLINE", name: "날짜구분",
                    data: [
                        { title: "발생일자", value: "발생일자" },
                        { title: "발행일자", value: "발행일자" }
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
            targetid: "grdList_NCR", query: "QDM_6623_1", title: "NCR",
            caption: true, height: 270, pager: true, show: true, selectable: true, multi: true, checkrow: true,
            element: [
                { header: "발생일자", name: "issue_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "발생구분", name: "issue_tp_nm", width: 50, align: "center" },
                { header: "장비군", name: "dept_area_nm", width: 50 },
                { header: "발생부서", name: "dept_nm", width: 80 },
                { header: "관리번호", name: "issue_no", width: 80, align: "center" },
                { header: "발행번호", name: "rqst_no", width: 80, align: "center" },
                { header: "진행상태", name: "pstat", width: 60 },
                { header: "등록일시", name: "rqst_ins_dt", width: 100, align: "center", hidden: true },
                { header: "발행여부", name: "astat", width: 60 },
                { header: "발행자", name: "astat_user_nm", width: 60 },
                { header: "발행일시", name: "astat_dt", width: 100, align: "center", hidden: true },
                { header: "담당부서", name: "resp_dept_nm", width: 80 },
                { header: "담당자", name: "user_nm", width: 50 },
                { header: "협력사", name: "supp_nm", width: 80 },
                {
                    header: "협력사귀책", name: "duty_supp", width: 70, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0", title: "" }
                }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_NCR", offset: 8 }
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
        //var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        //gw_com_module.eventBind(args);
        ////=====================================================================================
        //var args = { targetid: "grdList_NCR", grid: true, event: "rowdblclick", handler: informResult };
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

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "date_tp", argument: "arg_date_tp" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "issue_no", argument: "arg_issue_no" },
                { name: "rqst_no", argument: "arg_rqst_no" },
                { name: "dept_nm", argument: "arg_dept_nm" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_tp") + " :" },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "issue_tp" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "issue_no" }] },
                { element: [{ name: "rqst_no" }] },
                { element: [{ name: "dept_nm" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_NCR" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdList_NCR", true);
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var data = new Array();
    $.each(ids, function () {
        var row = gw_com_api.getRowData("grdList_NCR", this);
        delete row._CRUD;
        delete row._NO;
        row.ref_tp = "NCR";
        row.ref_no = row.rqst_no;
        row.acdt_no = v_global.logic.acdt_no;
        data.push(row);
    })
    processClose({ data: data });

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_NCR" }
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
        targetid: "frmOption", type: "FREE", title: "조회 조건",
        trans: true, border: true, show: true, remark: "lyrRemark",
        editable: { focus: "ymd_fr", validate: true },
        content: {
            row: [
                {
                    element: [
                        {
                            name: "date_tp", label: { title: "" }, style: { colfloat: "float" },
                            editable: { type: "select", data: { memory: "날짜구분" } }
                        },
                        {
                            name: "ymd_fr", mask: "date-ymd", style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 10 }
                        },
                        {
                            name: "ymd_to", label: { title: "~" }, mask: "date-ymd", style: { colfloat: "floated" },
                            editable: { type: "text", size: 7, maxlength: 10 }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA" } }
                        },
                        {
                            name: "issue_tp", label: { title: "발생구분 :" }, value: "AS", hidden: true,
                            editable: {
                                type: "select",
                                data: { memory: "발생구분", unshift: [{ title: "전체", value: "" }] }
                            }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "cust_cd", label: { title: "고객사 :" },
                            editable: {
                                type: "select",
                                data: { memory: "고객사", unshift: [{ title: "전체", value: "" }] },
                                change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }]
                            }
                        },
                        {
                            name: "cust_dept", label: { title: "LINE :" },
                            editable: {
                                type: "select",
                                data: { memory: "LINE", unshift: [{ title: "전체", value: "" }], key: ["cust_cd"] }
                            }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "issue_no", label: { title: "관리번호 :" },
                            editable: { type: "text", size: 14 }
                        },
                        {
                            name: "rqst_no", label: { title: "발행번호 :" },
                            editable: { type: "text", size: 14 }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "dept_nm", label: { title: "담당부서 :" },
                            editable: { type: "text", size: 12 }
                        }
                    ]
                },
                {
                    element: [
                        { name: "실행", value: "실행", act: true, format: { type: "button" } },
                        { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                    ], align: "right"
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