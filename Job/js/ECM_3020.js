//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 실적등록(협력사)
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == "SUPP" || gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "" ? true : false);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea_supp",
                    param: [
                        { argument: "arg_type", value: "ALL" },
                        { argument: "arg_part", value: "ECM" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            if (v_global.logic.Supp) {
                gw_com_api.setValue("frmOption", 1, "supp_cd", gw_com_module.v_Session.EMP_NO);
                gw_com_api.setValue("frmOption", 1, "supp_nm", gw_com_module.v_Session.USR_NM);
            }
            processRetrieve({});

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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "파일", value: "파일등록", icon: "저장" },
                { name: "확정", value: "확정", icon: "예" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_FILE", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "발주일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, data: { memory: "DEPT_AREA", unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "doc_no", label: { title: "계약번호 :" },
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "supp_nm", label: { title: "협력사 :" }, mask: "search",
                                hidden: v_global.logic.Supp,
                                editable: { type: "text", size: 14, validate: { rule: "required", message: "협력사" } }
                            },
                            { name: "supp_cd", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "cr_title", label: { title: "공사명 :" },
                                editable: { type: "text", size: 30 },
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
            targetid: "grdList_MAIN", query: (v_global.logic.Supp ? "ECM_3020_1_SUPP" : "ECM_3020_1"), title: "실적현황",
            height: 440, show: true, caption: false, pager: true, selectable: true, number: true, dynamic: true,//checkrow: true, multi: true,
            color: {
                element: ["dept_area_nm", "pur_date", "pur_no", "cr_title", "pstat_nm"]
            },
            element: [
                { header: "장비군", name: "dept_area_nm", width: 60 },
                { header: "발주일자", name: "pur_date", width: 70, mask: "date-ymd", align: "center" },
                { header: "발주번호", name: "pur_no", width: 70, align: "center" },
				{ header: "공사명", name: "cr_title", width: 300 },
                { header: "공종", name: "ext1_val", width: 70, align: "center" },
                { header: "선정업체", name: "per_supp0_nm", width: 100, align: "center", hidden: v_global.logic.Supp },
                { header: "계약서", name: "doc_no", format: { type: "link" }, width: 80, align: "center" },
                { header: "계약이행<br/>보증보험증권", name: "file1_link", format: { type: "link", exceptionvalues: ["-"] }, width: 80, align: "center" },
                { header: "선급금이행<br/>보증보험증권", name: "file2_link", format: { type: "link", exceptionvalues: ["-"] }, width: 80, align: "center" },
                { header: "하자이행<br/>보증보험증권", name: "file3_link", format: { type: "link", exceptionvalues: ["-"] }, width: 80, align: "center" },
                { header: "상태", name: "pstat_nm", width: 40, align: "center" },
                { name: "result_id", hidden: true },
                { name: "gw_doc_id", hidden: true },
                { name: "doc_id", hidden: true },
                { name: "supp_id", hidden: true },
                { name: "per_supp0", hidden: true },
                { name: "file1_chk", hidden: true },
                { name: "file2_chk", hidden: true },
                { name: "file3_chk", hidden: true },
                { name: "file1_id", hidden: true },
                { name: "file2_id", hidden: true },
                { name: "file3_id", hidden: true },
                { name: "file1_nm", hidden: true },
                { name: "file2_nm", hidden: true },
                { name: "file3_nm", hidden: true },
                { name: "file1_path", hidden: true },
                { name: "file2_path", hidden: true },
                { name: "file3_path", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
    //    var args = {
    //        targetid: "grdData_FileA", query: "ECM_3010_8", title: "기타 문서",
    //        caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
    //        //editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
    //        element: [
				//{ header: "파일명", name: "file_nm", width: 250 },
				////{ header: "등록부서", name: "upd_dept", width: 100, align: "center" },
				//{ header: "등록자", name: "upd_usr_nm", width: 60, align: "center" },
				//{
				//    header: "다운로드", name: "download", width: 60, align: "center",
				//    format: { type: "link", value: "다운로드" }
				//},
				//{
				//    header: "파일설명", name: "file_desc", width: 380, align: "left",
				//    editable: { type: "text" }
				//},
    //            { name: "file_ext", hidden: true },
    //            { name: "file_path", hidden: true },
    //            { name: "network_cd", hidden: true },
    //            { name: "data_tp", hidden: true },
    //            { name: "data_key", hidden: true },
    //            { name: "data_seq", hidden: true },
    //            { name: "file_id", hidden: true, editable: { type: "hidden" } }
    //        ]
    //    };
        //---------- add by kyt 2021-06-08
        var args = {
            targetid: "grdData_FileA", query: "SYS_File_Edit", title: "첨부 문서",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "파일명", name: "file_nm", width: 250, align: "left" },
                { header: "등록자", name: "ins_usr_nm", width: 60, align: "center" },
                {
                    header: "다운로드", name: "download", width: 60, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                {
                    header: "파일설명", name: "file_desc", width: 380, align: "left",
                    editable: { type: "text" }
                },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_FileA", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        //----------
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "파일", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_FILE", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_FILE", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processSearch };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, element: "gw_doc_no2", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, element: "doc_no", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, element: "file1_link", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, element: "file2_link", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, element: "file3_link", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FileA", grid: true, element: "download", event: "click", handler: processDownLoad };
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
function viewOption(param) {

    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption(param);
    switch (param.element) {
        case "확정":
            {
                if (gw_com_api.getSelectedRow("grdList_MAIN") > 0) {
                    var id = gw_com_api.getValue("grdList_MAIN", "selected", "result_id", true);
                    var chk = Query.getChk({ result_id: id });
                    if (chk != "1") {
                        gw_com_api.messageBox([{ text: "누락된 파일이 있습니다." }]);
                        return;
                    }
                    if (gw_com_api.showMessage("확정된 내역은 더이상 수정할 수 없습니다.\n계속 하시겠습니까?", "yesno")) {
                        processBatch({ id: id });
                    }
                }
            }
            break;
        case "파일":
            {
                if (gw_com_api.getSelectedRow("grdList_MAIN") > 0) {
                    var result_id = gw_com_api.getValue("grdList_MAIN", "selected", "result_id", true);
                    var stat = Query.getStat({ result_id: result_id });
                    if (stat != "PUB") {
                        gw_com_api.messageBox([{ text: "파일등록 가능한 상태가 아닙니다." }]);
                        return;
                    }
                    var file1_chk = gw_com_api.getValue("grdList_MAIN", "selected", "file1_chk", true);
                    var file2_chk = gw_com_api.getValue("grdList_MAIN", "selected", "file2_chk", true);
                    var file3_chk = gw_com_api.getValue("grdList_MAIN", "selected", "file3_chk", true);
                    if (file1_chk == "1" || file2_chk == "1" || file3_chk == "1") {
                        v_global.event.data = {
                            result_id: result_id,
                            file1_chk: file1_chk,
                            file2_chk: file2_chk,
                            file3_chk: file3_chk
                        };
                        var args = {
                            type: "PAGE", page: "ECM_3012", title: "파일 등록",
                            width: 650, height: 300, locate: ["center", "center"], open: true, scroll: true,
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "ECM_3012",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                                    data: v_global.event.data
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    } else {
                        gw_com_api.messageBox([{ text: "등록 대상이 없습니다." }]);
                    }
                }
            }
            break;
        case "추가":
            {
                processFileUpload({});
            }
            break;
        case "삭제":
            {
                var args = { object: "grdData_FileA", element: "file_id" };
                if (gw_com_api.showMessage("삭제되는 데이터는 복구할 수 없습니다.\n계속 하시겠습니까?", "yesno")) {
                    processRemove(args);
                }
            }
            break;
    }

}
//----------
function processView(param) {

    if (gw_com_api.getSelectedRow("grdList_MAIN") < 1) return;
    var doc_id = gw_com_api.getValue("grdList_MAIN", "selected", "doc_id", true);
    var doc_no = gw_com_api.getValue("grdList_MAIN", "selected", "doc_no", true);

    var title = "계약 상세";
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: {
            page: v_global.logic.Supp ? "ECM_2020" : "ECM_1020",
            title: title,
            param: [
                { name: "AUTH", value: "R" },
                { name: "VIEW", value: "Y" },
                { name: "doc_id", value: doc_id },
                //{ name: "doc_no", value: doc_no },
                { name: "supp_id", value: gw_com_api.getValue("grdList_MAIN", "selected", "supp_id", true) },
                { name: "supp_cd", value: gw_com_api.getValue("grdList_MAIN", "selected", "per_supp0", true) }
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
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_MAIN") {
        args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "result_id", argument: "arg_result_id" }
                ]
            },
            target: [
                /*{ type: "GRID", id: "grdData_FileA", select: true }*/
            ],
            key: param.key
        };
           processFileList({});
    } else {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "doc_no", argument: "arg_doc_no" },
                    { name: "supp_cd", argument: "arg_supp_cd" },
                    { name: "cr_title", argument: "arg_cr_title" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "doc_no" }] },
                    { element: [{ name: "supp_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_FileA" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "supp_nm") {
            if (param.value.current == "")
                gw_com_api.setValue(param.object, param.row, "supp_cd", "");
        }
    }

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: param.object,
                key: [{ row: "selected", element: [{ name: param.element }] }]
            }
        ],
        handler: {
            success: successRemove,
            param: param
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(param) {

    if (param.object == "grdData_FileA")
        processRetrieve({ object: "grdList_MAIN" });
    else
        processRetrieve({});

}
//----------
function processBatch(param) {

    var query = $("#grdList_MAIN_data").attr("query");
    var keys = [{ NAME: "result_id", VALUE: param.id.split(",")[0] }];
    var key = [{
        QUERY: query,
        KEY: keys
    }];

    var proc = {
        url: "COM",
        procedure: "sp_sendECMResultMail",
        input: [
            { name: "type", value: "ECM_RESULT_B", type: "varchar" },
            { name: "result_id", value: param.id, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: key
        }
    };
    gw_com_module.callProcedure(proc);

}
//----------
function successBatch(response, param) {

    processRetrieve({ key: param });

}
//----------
function processSearch(param) {

    switch (param.element) {
        case "supp_nm":
            {
                v_global.event.type = param.type;
                v_global.event.object = param.object;
                v_global.event.row = param.row;
                v_global.event.element = param.element;
                var args = {
                    type: "PAGE",
                    page: "DLG_SUPPLIER",
                    title: "협력사 선택",
                    width: 600,
                    height: 450,
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "DLG_SUPPLIER",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectSupplier
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//----------
function processLink(param) {

    switch (param.element) {
        case "gw_doc_no2":
            {
                var doc_id = gw_com_api.getValue(param.object, param.row, "gw_doc_id", true);
                if (!(doc_id == undefined || doc_id == "undefined" || doc_id == ""))
                    gw_com_site.linkPage({ to: "INFO_GW", doc_id: doc_id });
            }
            break;
        case "doc_no":
            {
                processView(param);
            }
            break;
    }

}
//----------
function processDownLoad(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function processFile(param) {

    var num = param.element.substring(4, 5);
    if (param.row == undefined || param.row == null) {
        gw_com_api.messageBox([
            { text: "다운로드할 파일이 선택되지 않았습니다." }
        ]);
        return;
    }
    var params =
        "?TYPE=" + encodeURIComponent("FILE") +
        "&USER=" + encodeURIComponent(gw_com_module.v_Session.USR_ID) +
        "&ID=" +
            encodeURIComponent(
                gw_com_api.getValue(param.object, param.row, "file" + num + "_id", true)) +
        "&PATH=" +
            encodeURIComponent(
                gw_com_api.getValue(param.object, param.row, "file" + num + "_path", true)) +
        "&NAME=" +
            encodeURIComponent(
                gw_com_api.getValue(param.object, param.row, "file" + num + "_nm", true));
    $("#lyrDown_page").attr("src", "../Service/svc_Download.aspx" + params);

}
//------ changed by kyt 2021-06-08
function processFileUpload(param) {

    var row = gw_com_api.getSelectedRow("grdList_MAIN");
    if (row == undefined || row < 1) return;

    //// Parameter 설정
    //v_global.logic.FileUp = {
    //    type: "ECM_RESULT_ADD",
    //    key: gw_com_api.getValue("grdList_MAIN", row, "result_id", true),
    //    seq: 0,
    //    user: gw_com_module.v_Session.USR_ID,
    //    crud: "C",
    //    biz_area: "공통",
    //    doc_area: "99"
    //};

    //// Prepare File Upload Window
    //var args = {
    //    type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "ECM_RESULT_ADD",
    //    width: 650, height: 400, open: true, locate: ["center", "bottom"]
    //}; //

    //if (gw_com_module.dialoguePrepare(args) == false) {
    //    var args = {
    //        page: "DLG_FileUpload",
    //        param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
    //    };
    //    gw_com_module.dialogueOpen(args);
    //}

    // set data for "File Upload"
    var dataType = "ECM_RESULT_ADD";    // Set File Data Type

    // add by kyt 2021-06-03
    var dataKey = gw_com_api.getValue("grdList_MAIN", row, "result_id", true);
    var dataSeq = 0;
    var biz_area = "공통"
    var doc_area = "99"
    // Set Argument Data for Popup Page Interface : 첫번째 Open 시의 메시지 전달을 위함
    v_global.event.data = { data_tp: dataType, data_key: dataKey, data_seq: dataSeq, file_group2: biz_area, file_group3: doc_area }; // additional 
    // set Argument for Dialogue
    var pageArgs = dataType + ":multi" + ":GroupA"; // 1.DataType, 2.파일선택 방식(multi/single), 3.UI Type(Simple/GroupA/ECM)
    var args = {
        type: "PAGE", open: true, locate: ["center", 100],
        width: 660, height: 500, scroll: true,  // multi( h:350, scroll) / single(h:300) / GroupA(h:500)
        page: "SYS_FileUpload", title: "Upload Fils", pageArgs: pageArgs,
        data: v_global.event.data  // reOpen 을 위한 Parameter
    };

    // Open dialogue
    gw_com_module.dialogueOpenJJ(args);
}
//2021-06-08 KYT
function processFileList(param) {
    // called by processRetrieveComplete

    var dataType = (param.data_tp == undefined) ? "ECM_RESULT_ADD" : param.data_tp; // Set File Data Type
    var objID = (param.obj_id == undefined) ? "grdData_FileA" : param.obj_id; // Set File Data Type
    var dataKey = gw_com_api.getValue("grdList_MAIN", "selected", "result_id", true);


    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_data_tp", value: dataType },
                { name: "arg_data_key", value: param.data_key == undefined ? dataKey : param.data_key },
                { name: "arg_data_seq", value: (param.data_seq == undefined ? 0 : param.data_seq) },
                { name: "arg_sub_key", value: (param.data_subkey == undefined ? "%" : param.data_subkey) },
                { name: "arg_sub_seq", value: (param.data_subseq == undefined ? -1 : param.data_subseq) },
                { name: "arg_use_yn", value: (param.use_yn == undefined ? "%" : param.use_yn) }
            ]
        },
        target: [{ type: "GRID", id: objID, select: true }],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processDownload(param) {

    gw_com_module.downloadFile({ source: { id: param.object, row: param.row }, targetid: "lyrDown" });

}
//----------
var Query = {
    getStat: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=ECM_3010_9" +
                    "&QRY_COLS=pstat" +
                    "&CRUD=R" +
                    "&arg_result_id=" + param.result_id,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    },
    getChk: function (param) {
        var rtn = "";
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=ECM_3010_9" +
                    "&QRY_COLS=chk_yn" +
                    "&CRUD=R" +
                    "&arg_result_id=" + param.result_id,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = data[0].DATA[0];
        }
        //----------
        $.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
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
                switch (param.from.page) {
                    case "ECM_3011":
                        {
                        }
                        break;
                    case "ECM_3012":
                        {
                            args.data = v_global.event.data;
                        }
                        break;
                    //changed by kyt 2021-06-07
                    case "SYS_FileUpload": {
                        args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                        args.data = v_global.event.data;
                    } break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {

                switch (param.from.page) {
                    case "ECM_3011":
                    case "ECM_3012":
                        {
                            if (param.data != undefined) {
                                var query = $("#grdList_MAIN_data").attr("query");
                                var keys = [{ NAME: "result_id", VALUE: param.data.result_id }];
                                var key = [{
                                    QUERY: query,
                                    KEY: keys
                                }];
                                processRetrieve({ key: key });
                            }
                        }
                        break;
                    // Add by kyt 21.06.07
                    case "SYS_FileUpload": {
                        processFileList({});
                    } break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_cd",
			                        param.data.supp_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
			                        v_global.event.row,
			                        "supp_nm",
			                        param.data.supp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER:
            {
                closeDialogue({ page: param.from.page });
                processRetrieve({ object: "grdList_MAIN" });
            }
            break;
    }

}