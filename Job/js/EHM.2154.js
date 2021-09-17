//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                {
                    type: "INLINE", name: "구분",
                    data: [
                        { title: "분석", value: "분석" },
                        { title: "수리", value: "수리" }
                    ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
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

            if (gw_com_api.getPageParameter("ymd_fr") == "") {
                var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
                gw_com_module.streamInterface(args);
            } else {
                v_global.logic.query = gw_com_api.getPageParameter("query") == "" ? "EHM_2151_4" : gw_com_api.getPageParameter("query");
                gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getPageParameter("ymd_fr"));
                gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getPageParameter("ymd_to"));
                gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_api.getPageParameter("dept_area"));
                gw_com_api.setValue("frmOption", 1, "rpt_tp", gw_com_api.getPageParameter("rpt_tp"));
                gw_com_api.setValue("frmOption", 1, "dept_cd", gw_com_api.getPageParameter("dept_cd"));
                gw_com_api.setValue("frmOption", 1, "part_cd", gw_com_api.getPageParameter("part_cd"));
                gw_com_api.setValue("frmOption", 1, "rqst_no", gw_com_api.getPageParameter("rqst_no"));
                processRetrieve({});
            }

        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "새로고침", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: false, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "요청일 :" },
                                mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA" } }
                            },
                            {
                                name: "rpt_tp", label: { title: "구분 :" },
                                editable: {
                                    type: "select", data: { memory: "구분" }
                                }
                            },
                            { name: "dept_cd", hidden: true },
                            { name: "part_cd", hidden: true },
                            { name: "rqst_no", hidden: true }
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
        var args = {
            targetid: "grdList_1", query: "", title: "",
            caption: false, height: 340, pager: true, show: true, selectable: true, number: true,
            element: [
                { header: "장비군", name: "dept_area_nm", width: 70 },
                { header: "LINE", name: "cust_dept_nm", width: 70 },
                { header: "Process", name: "cust_proc_nm", width: 70 },
                { header: "설비명", name: "cust_prod_nm", width: 120 },
                //{ header: "Project No.", name: "proj_no", width: 80, align: "center", hidden: true },
                { header: "품목코드", name: "part_cd", width: 80, align: "center" },
                { header: "품목명", name: "part_nm", width: 160 },
                { header: "Ser. No.", name: "ser_no", width: 120 },
                { header: "수량", name: "rqst_qty", width: 50, align: "right", mask: "numeric-int" },
                { header: "A/S 번호", name: "issue_no", width: 70, align: "center", hidden: true },
                { header: "NCR 번호", name: "ncr_no", width: 75, align: "center", hidden: true },
                { header: "수리구매요청서번호", name: "rqst_no", width: 120, hidden: true },
                { header: "반입목적", name: "rqst_tp_nm", width: 90, align: "center" },
                { header: "요청일", name: "rqst_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "요청자", name: "rqst_usr_nm", width: 60, align: "center", },
                { header: "요청비고", name: "rqst_rmk", width: 300 },
                { header: "보세", name: "bonded_yn", width: 50, align: "center", format: { type: "checkbox", value: "1", offval: "0" } },
                { header: "완료", name: "disp_yn", width: 50, align: "center", format: { type: "checkbox", value: "1", offval: "0" } },
                { header: "반입일", name: "stock_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반입<br/>수령자", name: "stock_usr_nm", width: 60, align: "center" },
                { header: "반입신고번호", name: "ext1_no", width: 120 },
                { header: "반입비고", name: "stock_rmk", width: 300 },
                { header: "분석담당부서", name: "qc_dept_nm", width: 100 },
                { header: "분석담당자", name: "qc_usr_nm", width: 60, align: "center" },
                { header: "분석시작일", name: "qc_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "분석완료일", name: "qce_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "처리구분", name: "qc_tp_nm", width: 60, align: "center", hidden: true },
                { header: "귀책구분", name: "duty_tp_nm", width: 60, align: "center", hidden: true },
                { header: "분석결과", name: "qc_rmk", width: 300 },
                { header: "수리담당부서", name: "rep_dept_nm", width: 100 },
                { header: "수리시작일", name: "rep_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "수리완료일", name: "repe_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반출요청일", name: "carry_rqst_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반출업체", name: "carry_rqst_usr_nm", width: 150 },
                { header: "반출일", name: "carry_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "반출<br/>수령자", name: "carry_usr_nm", width: 60, align: "center" },
                { header: "반출신고번호", name: "ext2_no", width: 120 },
                { header: "반출비고", name: "carry_rmk", width: 300 },
                { header: "재입고일", name: "restock_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "재입고<br/>수령자", name: "restock_usr_nm", width: 60, align: "center" },
                { header: "재입고상태", name: "disp_tp_nm", width: 60, align: "center" },
                { header: "재입고신고번호", name: "ext3_no", width: 120 },
                { header: "재입고비고", name: "restock_rmk", width: 300 },
                { header: "처분일", name: "disp_dt", width: 70, align: "center", mask: "date-ymd", hidden: true },
                { header: "처분자", name: "disp_usr_nm", width: 60, align: "center", hidden: true },
                { header: "처분비고", name: "disp_rmk", width: 300, hidden: true },
                { header: "출고일", name: "recarry_dt", width: 70, align: "center", mask: "date-ymd" },
                { header: "출고자", name: "recarry_usr_nm", width: 60, align: "center" },
                { header: "출고유형", name: "recarry_tp_nm", width: 60, align: "center" },
                { header: "출고신고번호", name: "ext4_no", width: 120 },
                { header: "출고비고", name: "recarry_rmk", width: 300 },
                //{ header: "최종상태", name: "stock_status_nm", width: 60, align: "center" },
                { header: "최종상태", name: "pstat_nm", width: 80, align: "center" },
                { name: "stock_no", hidden: true },
                { name: "cust_prod", hidden: true },
                { name: "stock_status", hidden: true },
                { name: "issue_seq", hidden: true },
                { name: "part_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_1", offset: 15 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================

        // startup process.
        //----------
        gw_com_module.startPage();
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processItemchanged(param) {

}
//----------
function processItemdblClick(param) {

    switch (param.element) {
        case "proj_no":
            processFind(param);
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "rpt_tp", argument: "arg_rpt_tp" },
                { name: "dept_cd", argument: "arg_dept_cd" },
                { name: "part_cd", argument: "arg_part_cd" },
                { name: "rqst_no", argument: "arg_rqst_no" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_1", query: v_global.logic.query }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_1" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    if (gw_com_module.v_Session.USR_ID == "")
        window.close();
    else {
        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);
        var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
        gw_com_module.streamInterface(args);
        processClear({});
    }

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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.logic.query = param.from.page == "EHM_2153" ? "EHM_2153_4" : "EHM_2151_4";
                gw_com_api.setValue("frmOption", 1, "ymd_fr", param.data.ymd_fr);
                gw_com_api.setValue("frmOption", 1, "ymd_to", param.data.ymd_to);
                gw_com_api.setValue("frmOption", 1, "rpt_tp", param.data.rpt_tp);
                gw_com_api.setValue("frmOption", 1, "dept_cd", param.data.dept_cd);
                gw_com_api.setValue("frmOption", 1, "part_cd", param.data.part_cd);
                gw_com_api.setValue("frmOption", 1, "rqst_no", param.data.rqst_no);
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
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