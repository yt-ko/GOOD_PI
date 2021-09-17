//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.07)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [
                        { argument: "arg_hcode", value: "ISCM29" }
                    ]
                },
				{ type: "PAGE", name: "LINE", query: "DDDW_CM_CODED",
				    param: [
                        { argument: "arg_hcode", value: "IEHM02" }
                    ]
				},
                {
                    type: "PAGE", name: "발생구분", query: "DDDW_ISSUE_TP",
                    param: [
                        { argument: "arg_rcode", value: "AS" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{ name: "조회", value: "조회" },
				{ name: "확인", value: "확인", icon: "저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "EHM_2212_1", title: "자재 반입 목록",
            height: 200, show: true, selectable: true, key: true, number: true, multi: true, checkrow: true,
            element: [
                { header: "LINE", name: "cust_dept_nm", width: 70 },
                { header: "Process", name: "cust_proc_nm", width: 70 },
                { header: "설비명", name: "cust_prod_nm", width: 120 },
                { header: "Project No.", name: "proj_no", width: 80, hidden: true },
                { header: "품번", name: "item_no", width: 100 },
                { header: "품명", name: "item_nm", width: 160 },
                { header: "Ser. No.", name: "ser_no", width: 100 },
                { header: "A/S 번호", name: "issue_no", width: 70, align: "center" },
                { header: "NCR 번호", name: "ncr_no", width: 70, align: "center" },
                { name: "cust_cd", hidden: true },
                { name: "cust_dept", hidden: true },
                { name: "cust_proc", hidden: true },
                { name: "prod_key", hidden: true },
                { name: "issue_seq", hidden: true },
                { name: "part_seq", hidden: true },
                { name: "dept_area", hidden: true },
                { name: "dept_area_nm", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_1", query: "EHM_2211_1", title: "반입목적",
            height: 116, show: true, selectable: true, caption: false, pager: false, key: true, number: true,
            element: [
                { header: "반입목적", name: "dname", width: 230 },
                {
                    header: "NCR", name: "fcode2", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { name: "hcode", hidden: true },
                { name: "dcode", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_2", query: "EHM_2211_2", title: "파트처리",
            height: 116, show: true, selectable: true, caption: false, pager: false, key: true, number: true,
            element: [
                { header: "파트처리", name: "dname" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_1", offset: 8 },
                { type: "GRID", id: "grdList_2", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        gw_com_module.informSize();

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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_1", grid: true, event: "rowselected", handler: function (param) {
                var args = {
                    source: {
                        type: param.type, id: param.object, row: param.row,
                        element: [
                            { name: "hcode", argument: "arg_hcode" },
                            { name: "dcode", argument: "arg_dcode" }
                        ]
                    },
                    target: [
                        { type: "GRID", id: "grdList_2", focus: true, select: true }
                    ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
        };
        gw_com_module.eventBind(args);
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
function processInit() {

    //=====================================================================================
    var args = {
        targetid: "frmOption", type: "FREE",
        trans: true, show: true, border: true, remark: "lyrRemark",
        editable: { bind: "open", focus: "cust_cd", validate: true },
        content: {
            row: [
                {
                    element: [
                        {
                            name: "ymd_fr", label: { title: "발생일자 :" },
                            mask: "date-ymd", style: { colfloat: "floating" },
                            editable: { type: "text", size: 7, maxlength: 10 },
                            value: gw_com_api.getDate("", { day: -30 })
                        },
                        {
                            name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                            editable: { type: "text", size: 7, maxlength: 10 },
                            value: gw_com_api.getDate()
                        },
                        {
                            name: "dept_area", label: { title: "장비군 :" },
                            editable: { type: "select", size: 7, data: { memory: "DEPT_AREA_FIND" } }
                        },
                        {
                            name: "issue_tp", label: { title: "발생구분 :" },
                            editable: {
                                type: "select", data: { memory: "발생구분", unshift: [{ title: "전체", value: "" }] }
                            }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "cust_cd", label: { title: "고객사 :" },
                            editable: {
                                type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "" }] },
                                change: [{ name: "cust_dept", memory: "LINE", unshift: [{ title: "전체", value: "" }], key: ["cust_cd"] }]
                            }
                        },
                        {
                            name: "cust_dept", label: { title: "LINE :" },
                            editable: {
                                type: "select",
                                data: { memory: "LINE", unshift: [{ title: "전체", value: "" }], key: ["cust_cd"] }
                            }
                        },
                        {
                            name: "cust_prod_nm", label: { title: "설비명 :" },
                            editable: { type: "text", size: 12 }
                        }
                    ]
                },
                {
                    element: [
                        {
                            name: "proj_no", label: { title: "Project No. :" },
                            editable: { type: "text", size: 12 }
                        },
                        {
                            name: "ser_no", label: { title: "Ser. No. :" },
                            editable: { type: "text", size: 12 }
                        },
                        {
                            name: "issue_no", label: { title: "A/S 번호 :" },
                            editable: { type: "text", size: 12 }
                        }
                    ]
                },
                {
                    align: "right",
                    element: [
                        { name: "실행", value: "실행", format: { type: "button" }, act: true },
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
    var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
    gw_com_module.eventBind(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "GRID", id: "grdList_1", select: true }
        ]
    };
    gw_com_module.objRetrieve(args);
    //=====================================================================================

}
//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "cust_cd", argument: "arg_cust_cd" },
                { name: "cust_dept", argument: "arg_cust_dept" },
                { name: "cust_prod_nm", argument: "arg_cust_prod_nm" },
                { name: "issue_tp", argument: "arg_issue_tp" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "ser_no", argument: "arg_ser_no" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "issue_no", argument: "arg_issue_no" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "issue_tp" }] },
                { element: [{ name: "cust_cd" }] },
                { element: [{ name: "cust_dept" }] },
                { element: [{ name: "cust_prod_nm" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "ser_no" }] },
                { element: [{ name: "issue_no" }] }
            ]
        },
        target: [
			{ type: "GRID", id: "grdList_MAIN" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdList_MAIN", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return false;
    }

    var rqst_tp = (gw_com_api.getSelectedRow("grdList_1") == null ? "" : gw_com_api.getValue("grdList_1", "selected", "dcode", true));
    var rqst_tp_nm = (gw_com_api.getSelectedRow("grdList_1") == null ? "" : gw_com_api.getValue("grdList_1", "selected", "dname", true));
    var rpr_tp = (gw_com_api.getSelectedRow("grdList_2") == null ? "" : gw_com_api.getValue("grdList_2", "selected", "dname", true));
    var ncr_chk = (gw_com_api.getSelectedRow("grdList_1") == null ? "" : gw_com_api.getValue("grdList_1", "selected", "fcode2", true));
    var rtn = true;
    var rows = [];
    $.each(ids, function () {
        var data = gw_com_api.getRowData("grdList_MAIN", this);
        if (ncr_chk == "1" && data.ncr_no == "") {
            gw_com_api.messageBox([{ text: "선택된 코드는 NCR 발행된 품목에만 적용할 수 있습니다." }]);
            rtn = false;
            return false;
        }
        // NCR 항목이 아니어도 데이터는 넘겨줌
        //else if (ncr_chk == "0" && data.ncr_no != "") {
        //    data.ncr_no = "";
        //}
        data.rqst_date = gw_com_api.getDate();
        data.rqst_user = gw_com_module.v_Session.USR_ID;
        data.rqst_user_nm = gw_com_module.v_Session.USR_NM;
        data.rqst_dept = gw_com_module.v_Session.DEPT_CD;
        data.rqst_dept_nm = gw_com_module.v_Session.DEPT_NM;
        data.item_qty = 1;
        data.rqst_tp = rqst_tp;
        data.rqst_tp_nm = rqst_tp_nm;
        data.rpr_tp = rpr_tp;
        rows.push(data);
    });

    if (!rtn)
        return;
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: { rows: rows }
    };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    processClear();
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (!v_global.process.init) {
                    v_global.process.init = true;
                    processInit();
                }
                gw_com_api.show("frmOption");
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
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
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
