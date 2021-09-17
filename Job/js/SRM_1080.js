//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입찰/견적현황
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() { 
            gw_job_process.UI();
        	gw_job_process.procedure();
            
        	gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -14 }));
        	gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "상세", value: "내용보기", icon: "기타" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "supp_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "의뢰일자 :" }, mask: "date-ymd",
                                style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
                            {
                                name: "supp_nm", label: { title: "협력사 :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "item_cd", label: { title: "품번 :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "pr_no", label: { title: "구매요청번호 :" },
                                editable: { type: "text", size: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "per_man", label: { title: "구매담당 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
                            },
                            {
                                name: "per_no", label: { title: "의뢰번호 :" },
                                editable: { type: "text", size: 10, maxlength: 20 }
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
        var args = {
            targetid: "grdList_MAIN", query: "SRM_1080_1", title: "입찰/견적 목록",
            caption: false, height: "300", pager: true, show: true, selectable: true, number: true,
            element: [
				{ header: "의뢰번호", name: "per_no", width: 70, align: "center" },
				{ header: "의뢰일자", name: "per_date", width: 60, align: "center", mask: "date-ymd" },
				{ header: "구매담당", name: "per_man", width: 100, align: "center" },
                { header: "구분", name: "per_type_nm", width: 50, align: "center", hidden: true },
                { header: "구분", name: "per_type_nm2", width: 50, align: "center" },
                { header: "입찰방법", name: "bid_type_nm", width: 50, align: "center", hidden: true },
				{ header: "제목", name: "per_title", width: 300 },
				{ header: "접수마감일", name: "close_date", width: 60, align: "center", mask: "date-ymd", hidden: true },
				{ header: "접수기간", name: "per_term", width: 180, align: "center" },
				{ header: "의뢰상태", name: "pstat_nm", width: 40, align: "center" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_ITEM", query: "SRM_1080_2", title: "의뢰 품목",
            caption: false, height: "150", show: true, selectable: true, number: true,
            element: [
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 150 },
                { header: "품목사양", name: "item_spec", width: 150 },
                { header: "도면", name: "item_url", width: 60, align: "center", format: { type: "link" }, hidden: true },
                { header: "수량", name: "qty", width: 40, align: "right", mask: "numeric-int" },
                { header: "단위", name: "uom", width: 40, align: "center" },
                { header: "통화", name: "curr_cd", width: 40, align: "center" },
                { header: "납기일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "청구자", name: "pr_man", width: 60, align: "center", hidden: true },
                { header: "Project No.", name: "proj_no", width: 80, hidden: true },
                { header: "청구번호", name: "pr_no", width: 100, align: "center", hidden: true },
                { header: "예상단가", name: "est_price", width: 80, align: "right", mask: "currency-int", hidden: true },
                { name: "per_no", hidden: true },
                { name: "item_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUPP", query: "SRM_1080_3", title: "의뢰 협력사",
            caption: false, height: "150", show: true, selectable: true, number: true,
            element: [
				{ header: "협력사", name: "supp_nm", width: 100 },
				{ header: "수신인", name: "supp_man", width: 70 },
                { header: "E-Mail 1", name: "supp_email1", width: 150 },
                { header: "TEL", name: "supp_telno", width: 90 },
                { header: "FAX", name: "supp_faxno", width: 60 },
                { header: "전송방법", name: "send_tp", width: 60, align: "center" },
                { header: "진행상태", name: "pstat_nm", width: 50, align: "center" },
                { header: "상태변경일", name: "pdate", width: 150, align: "center", hidden: true },
                { header: "E-Mail 2", name: "supp_email2", width: 150, hidden: true },
                { header: "전송비고", name: "send_rmk", width: 180 },
                { name: "per_no", editable: { type: "hidden" }, hidden: true },
                { name: "supp_seq", editable: { type: "hidden" }, hidden: true },
                { name: "rpt_seq", editable: { type: "hidden" }, hidden: true },
                { name: "supp_cd", editable: { type: "hidden" }, hidden: true },
                { name: "pstat", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_ITEM", offset: 8 },
                { type: "GRID", id: "grdList_SUPP", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab",
            target: [
                { type: "LAYER", id: "lyrTab_1", title: "의뢰 품목" },
                { type: "LAYER", id: "lyrTab_2", title: "의뢰 협력사" }
            ]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [{ type: "TAB", id: "lyrTab", offset: 8 }]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "상세", event: "click", handler: processDetailView };
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
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: processDetailView };
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
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_MAIN") {

        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "per_no", argument: "arg_per_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_ITEM" },
                { type: "GRID", id: "grdList_SUPP" }
            ]
        };


    } else {

        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (!gw_com_module.objValidate(args)) return;

        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "per_no", argument: "arg_per_no" },
                    { name: "supp_nm", argument: "arg_supp_nm" },
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "pr_no", argument: "arg_pr_no" },
                    { name: "per_man", argument: "arg_per_man" }
                ],
                remark: [
                    { element: [{ name: "supp_nm" }] },
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "proj_no" }] },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "pr_no" }] },
                    { element: [{ name: "per_man" }] },
                    { element: [{ name: "per_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_ITEM" },
                { type: "GRID", id: "grdList_SUPP" }
            ],
            key: param.key
        };

    }
    gw_com_module.objRetrieve(args);

};
//----------
function processDetailView(param) {

    var row = gw_com_api.getSelectedRow("grdList_MAIN");
    if (row == undefined || row < 1) return;
    var per_no = gw_com_api.getValue("grdList_MAIN", row, "per_no", true);
    var pstat = Query.getPSTAT({ per_no: per_no });

    var page = $.inArray(pstat, ["", "REG", "PUB", "PRS"]) >= 0 ? "SRM_1012" : "SRM_1032";
    var title = "입찰/견적내용";
    var auth = "R";
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: {
            type: "MAIN"
        },
        data: {
            page: page,
            title: title,
            param: [
                { name: "AUTH", value: auth },
                { name: "per_no", value: per_no }
            ]
        }
    };
    gw_com_module.streamInterface(args);

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
var Query = {
    getPSTAT: function (param) {
        var rtn = {};
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=SRM_1012_1" +
                    "&QRY_COLS=pstat" +
                    "&CRUD=R" +
                    "&arg_per_no=" + param.per_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = {
                pstat: data[0].DATA[0]
            };
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue: {
            var args = {
                to: { type: "POPUP", page: param.from.page },
                ID: param.ID
            };
            gw_com_module.streamInterface(args);

        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM: {
            gw_com_api.setValue(v_global.event.object,
			                    v_global.event.row,
			                    v_global.event.cd,
			                    param.data.proj_no,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object,
			                    v_global.event.row,
			                    v_global.event.nm,
			                    param.data.proj_nm,
			                    (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
            if (param.data != undefined) {
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.nm,
                                    param.data.emp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.cd,
                                    param.data.emp_no,
                                    (v_global.event.type == "GRID") ? true : false);
                if (v_global.event.cd == "qc_emp") {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        "qc_dept_nm",
                                        param.data.dept_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        "qc_dept",
                                        param.data.dept_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                }
            }
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedDepartment: {
            gw_com_api.setValue(
                                v_global.event.object,
                                v_global.event.row,
                                v_global.event.nm,
                                param.data.dept_nm,
                                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(
                                v_global.event.object,
			                    v_global.event.row,
			                    v_global.event.cd,
			                    param.data.dept_cd,
			                    (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });

        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//