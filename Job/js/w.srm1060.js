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
        
        // 협력사 여부
        v_global.logic.supp_yn = (gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        start();

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            if (v_global.logic.supp_yn) {
                gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_module.v_Session.USR_NM);
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.USR_ID);
            }
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "proj_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                hidden: v_global.logic.supp_yn,
                                editable: { type: "text", size: 14 }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } },
                            {
                                name: "proj_nm", label: { title: "Project Name : " }, mask: "search",
                                editable: { type: "text", size: 12 }, hidden: true
                            },
                            {
                                name: "proj_no", label: { title: "Project No : " }, mask: "search",
                                editable: { type: "text", size: 10 }
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
            targetid: "grdList_MAIN", query: "w_srm1060_1", title: "납기가능정보",
            caption: false, height: 442, pager: true, show: true, selectable: true, number: true, dynamic: true,
            editable: { bind: "select", focus: "dlv_qty", validate: true },
            element: [
                { header: "협력사", name: "supp_nm", hidden: v_global.logic.supp_yn },
				{ header: "Project No.", name: "tracking_no", width: 80, align: "center" },
				{ header: "품번", name: "item_cd", width: 70, align: "center" },
				{ header: "품명", name: "item_nm", width: 150 },
				{ header: "납기요청일", name: "dlvy_req_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "수량", name: "req_qty", width: 50, align: "right", mask: "numeric-int" },
				{ header: "비고", name: "remark", width: 150 },
				{
				    header: "납기가능일1", name: "dlvy_date_1", width: 100,
				    editable: { type: "text", validate: { rule: "dateISO" } }, mask: "date-ymd", align: "center"
				},
				{ name: "dlvy_dt_1", editable: { type: "hidden" }, hidden: true },
                {
                    header: "가능수량1", name: "dlvy_qty_1", width: 70, align: "right", mask: "numeric-int",
                    editable: { type: "text" }
                },
				{
				    header: "납기가능일2", name: "dlvy_date_2", width: 100,
				    editable: { type: "text", validate: { rule: "dateISO" } }, mask: "date-ymd", align: "center"
				},
				{ name: "dlvy_dt_2", editable: { type: "hidden" }, hidden: true },
                {
                    header: "가능수량2", name: "dlvy_qty_2", width: 70, align: "right", mask: "numeric-int",
                    editable: { type: "text" }
                },
				{
				    header: "납기가능일3", name: "dlvy_date_3", width: 100,
				    editable: { type: "text", validate: { rule: "dateISO" } }, mask: "date-ymd", align: "center"
				},
				{ name: "dlvy_dt_3", editable: { type: "hidden" }, hidden: true },
                {
                    header: "가능수량3", name: "dlvy_qty_3", width: 70, align: "right", mask: "numeric-int",
                    editable: { type: "text" }
                },
                { name: "dlvy_req_no", editable: { type: "hidden" }, hidden: true },
                { name: "seq_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    //gw_com_api.show("frmOption");
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "저장":
            processSave(param);
            break;
        case "실행":
            processRetrieve(param);
            break;
        case "닫기":
            processClose({});
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "supp_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "supp_cd", "");
                break;
            case "proj_nm":
                if (param.value.current == "")
                    gw_com_api.setValue(param.object, param.row, "proj_no", "");
                break;
        }
    } else if (param.object == "grdList_MAIN") {
        switch (param.element) {
            case "dlvy_date_1":
            case "dlvy_date_2":
            case "dlvy_date_3":
                gw_com_api.setValue(param.object, param.row, param.element.replace(/_date/g, "_dt"), gw_com_api.Mask(param.value.current, "date-ymd"), true);
                if (param.value.current == "") {
                    gw_com_api.setValue(param.object, param.row, param.element.replace(/_date/g, "_qty"), 0, true, false, false);
                }
                break;
            case "dlvy_qty_1":
            case "dlvy_qty_2":
            case "dlvy_qty_3":
                if (param.value.current == 0 || param.value.current == "") {
                    gw_com_api.setValue(param.object, param.row, param.element.replace(/_qty/g, "_date"), "", true, false, false);
                }
                break;
        }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args;
    switch (param.element) {
        case "supp_nm":
        case "supp_cd":
            v_global.event.cd = "supp_cd";
            v_global.event.nm = "supp_nm";
            v_global.logic.search = {
                supp_cd: (param.element == "supp_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                supp_nm: (param.element == "supp_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                width: 650, height: 460, open: true, locate: ["center", "top"],
                id: gw_com_api.v_Stream.msg_selectSupplier
            };
            break;
        case "proj_nm":
        case "proj_no":
            v_global.event.cd = "proj_no";
            v_global.event.nm = "proj_nm";
            v_global.logic.search = {
                proj_no: (param.element == "proj_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                proj_nm: (param.element == "proj_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
            };
            args = {
                type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                width: 650, height: 460, open: true, locate: ["center", "top"],
                id: gw_com_api.v_Stream.msg_selectProject_SCM
            };
            break;
        default: return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: args.id,
                data: v_global.logic.search
            }
        };
        gw_com_module.dialogueOpen(args);
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
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "supp_cd", argument: "arg_supp_cd" }
            ],
            remark: [
                { element: [{ name: "supp_nm" }] },
                { element: [{ name: "proj_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {

    var args = {
        //url: "COM",   // LinkedServer Update 시 Transaction 오류 발생으로 인해 Costumize
        target: [
            { type: "GRID", id: "grdList_MAIN" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //
    var ids = gw_com_api.getRowIDs("grdList_MAIN");
    var err = false;
    var msg = "";
    $.each(ids, function (i) {
        var crud = gw_com_api.getCRUD("grdList_MAIN", this, true);
        if (crud == "create" || crud == "update") {
            var req_qty = Number(gw_com_api.getValue("grdList_MAIN", this, "req_qty", true));
            var dlvy_date_1 = gw_com_api.getValue("grdList_MAIN", this, "dlvy_date_1", true);
            var dlvy_date_2 = gw_com_api.getValue("grdList_MAIN", this, "dlvy_date_2", true);
            var dlvy_date_3 = gw_com_api.getValue("grdList_MAIN", this, "dlvy_date_3", true);
            var dlvy_qty_1 = Number(gw_com_api.getValue("grdList_MAIN", this, "dlvy_qty_1", true));
            var dlvy_qty_2 = Number(gw_com_api.getValue("grdList_MAIN", this, "dlvy_qty_2", true));
            var dlvy_qty_3 = Number(gw_com_api.getValue("grdList_MAIN", this, "dlvy_qty_3", true));
            var dlvy_qty = dlvy_qty_1 + dlvy_qty_2 + dlvy_qty_3;
            if (req_qty < dlvy_qty) {
                gw_com_api.setError(true, "grdList_MAIN", this, "dlvy_qty_1", true);
                gw_com_api.setError(true, "grdList_MAIN", this, "dlvy_qty_2", true);
                gw_com_api.setError(true, "grdList_MAIN", this, "dlvy_qty_3", true);
                gw_com_api.selectRow("grdList_MAIN", this, true);
                err = true;
                msg = "가능수량이 요청수량을 초과하였습니다.";
                return false;
            } else if (dlvy_date_1 == "" && dlvy_qty_1 > 0) {
                gw_com_api.selectRow("grdList_MAIN", this, true);
                err = true;
                msg = "[납기가능일1]을 입력하세요.";
                return false;
            } else if (dlvy_date_2 == "" && dlvy_qty_2 > 0) {
                gw_com_api.selectRow("grdList_MAIN", this, true);
                err = true;
                msg = "[납기가능일2]을 입력하세요.";
                return false;
            } else if (dlvy_date_3 == "" && dlvy_qty_3 > 0) {
                gw_com_api.selectRow("grdList_MAIN", this, true);
                err = true;
                msg = "[납기가능일3]을 입력하세요.";
                return false;
            } else if (dlvy_date_1 != "" && dlvy_qty_1 == 0) {
                gw_com_api.selectRow("grdList_MAIN", this, true);
                err = true;
                msg = "[가능수량1]을 입력하세요.";
                return false;
            } else if (dlvy_date_2 != "" && dlvy_qty_2 == 0) {
                gw_com_api.selectRow("grdList_MAIN", this, true);
                err = true;
                msg = "[가능수량2]을 입력하세요.";
                return false;
            } else if (dlvy_date_3 != "" && dlvy_qty_3 == 0) {
                gw_com_api.selectRow("grdList_MAIN", this, true);
                err = true;
                msg = "[가능수량3]을 입력하세요.";
                return false;
            } else {
                gw_com_api.setError(false, "grdList_MAIN", this, "dlvy_date_1", true);
                gw_com_api.setError(false, "grdList_MAIN", this, "dlvy_date_2", true);
                gw_com_api.setError(false, "grdList_MAIN", this, "dlvy_date_3", true);
                gw_com_api.setError(false, "grdList_MAIN", this, "dlvy_qty_1", true);
                gw_com_api.setError(false, "grdList_MAIN", this, "dlvy_qty_2", true);
                gw_com_api.setError(false, "grdList_MAIN", this, "dlvy_qty_3", true);
            }
        }
    });
    if (err) {
        gw_com_api.messageBox([
            { text: msg }
        ]);
        return false;
    }

    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({});
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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param); 
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "w_find_proj_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "DLG_PR":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openDialogue;
                            args.data = v_global.logic.search;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_PR":
                        if (param.data != undefined) {
                            gw_com_module.objClear({ target: [{ type: "FORM", id: "frmOption" }] });
                            gw_com_api.setValue(v_global.event.object,
                                                v_global.event.row,
                                                "pr_no",
                                                param.data.pr_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            //gw_com_api.setValue(v_global.event.object,
                            //                    v_global.event.row,
                            //                    "ymd_fr",
                            //                    param.data.req_date,
                            //                    (v_global.event.type == "GRID") ? true : false);
                            //gw_com_api.setValue(v_global.event.object,
                            //                    v_global.event.row,
                            //                    "ymd_to",
                            //                    param.data.req_date,
                            //                    (v_global.event.type == "GRID") ? true : false);
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
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
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.cd,
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.nm,
			                        param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//