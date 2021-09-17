//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 출하검사내역 통보
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

        start();
        //----------

        function start() {

            v_global.logic.pur_no = gw_com_api.getPageParameter("PUR_NO");
            v_global.logic.cols = Query.getHeader({ pur_no: v_global.logic.pur_no });

            gw_job_process.UI();
            gw_job_process.procedure();

            processRetrieve({});

        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "출력", value: "출력" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrLabel1",
            row: [{ name: "summary" }]
        };
        //----------
        gw_com_module.labelCreate(args);
        //----------
        $("#lyrLabel1_summary").css("font-weight", "bold");
        $("#lyrLabel1_summary").css("border-bottom", "");
        //----------
        var args = {
            targetid: "lyrLabel1",
            row: [{ name: "summary", value: "선정업체 : " + v_global.logic.cols.final_supp_nm + ", 선정금액 : " + gw_com_api.Mask(v_global.logic.cols.final_amt, "numeric-int") + " 원" }]
        };
        gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            targetid: "lyrLabel2",
            row: [{ name: "unit" }]
        };
        //----------
        gw_com_module.labelCreate(args);
        //----------
        $("#lyrLabel2_unit").css("font-weight", "bold");
        $("#lyrLabel2_unit").css("border-bottom", "");
        //----------
        var args = {
            targetid: "lyrLabel2",
            row: [{ name: "unit", value: "[단위 : 원]" }]
        };
        gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            targetid: "lyrLabel_MAIN",
            row: [{ name: "lbl_main" }]
        };
        //----------
        gw_com_module.labelCreate(args);
        //----------
        $("#lyrLabel_MAIN_lbl_main").css("font-weight", "bold");
        $("#lyrLabel_MAIN_lbl_main").css("border-bottom", "");
        //----------
        var args = {
            targetid: "lyrLabel_MAIN",
            row: [{ name: "lbl_main", value: "견적 접수결과 SUMMARY" }]
        };
        gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            targetid: "lyrLabel_SUB",
            row: [{ name: "lbl_sub" }]
        };
        //----------
        gw_com_module.labelCreate(args);
        //----------
        $("#lyrLabel_SUB_lbl_sub").css("font-weight", "bold");
        $("#lyrLabel_SUB_lbl_sub").css("border-bottom", "");
        //----------
        var args = {
            targetid: "lyrLabel_SUB",
            row: [{ name: "lbl_sub", value: "견적 접수결과 세부내역" }]
        };
        gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            targetid: "lyrLabel_FILE1",
            row: [
 				{ name: "lbl_file" }
            ]
        };
        //----------
        gw_com_module.labelCreate(args);
        //----------
        $("#lyrLabel_FILE1_lbl_file").css("font-weight", "bold");
        $("#lyrLabel_FILE1_lbl_file").css("border-bottom", "");
        //----------
        var args = {
            targetid: "lyrLabel_FILE1",
            row: [{ name: "lbl_file", value: "견적서" }]
        };
        gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            targetid: "lyrLabel_FILE2",
            row: [{ name: "lbl_file" }]
        };
        //----------
        gw_com_module.labelCreate(args);
        //----------
        $("#lyrLabel_FILE2_lbl_file").css("font-weight", "bold");
        $("#lyrLabel_FILE2_lbl_file").css("border-bottom", "");
        //----------
        var args = {
            targetid: "lyrLabel_FILE2",
            row: [{ name: "lbl_file", value: "도면 및 사양서" }]
        };
        gw_com_module.labelAssign(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "SRM_1060_1", type: "TABLE", title: "견적 접수결과 SUMMARY",
            caption: false, height: "100%", pager: false, show: true, selectable: false,
            element: [
				{ header: "품목", name: "item_nm", width: 200 },
                { header: "<b>" + v_global.logic.cols.final_supp_nm + "</b><br/>ⓐ", name: "final_amt", width: 100, align: "right", mask: "numeric-int", style: { bgcolor: "#F2F2F2" }, hidden: v_global.logic.cols.final_supp_nm == undefined || v_global.logic.cols.final_supp_nm == "" ? true : false },
                { header: v_global.logic.cols.supp_nm1 + "<br/>①", name: "amt1", width: 100, align: "right", mask: "numeric-int", hidden: v_global.logic.cols.supp_nm1 == undefined || v_global.logic.cols.supp_nm1 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm2 + "<br/>②", name: "amt2", width: 100, align: "right", mask: "numeric-int", hidden: v_global.logic.cols.supp_nm2 == undefined || v_global.logic.cols.supp_nm2 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm3 + "<br/>③", name: "amt3", width: 100, align: "right", mask: "numeric-int", hidden: v_global.logic.cols.supp_nm3 == undefined || v_global.logic.cols.supp_nm3 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm4 + "<br/>④", name: "amt4", width: 100, align: "right", mask: "numeric-int", hidden: v_global.logic.cols.supp_nm4 == undefined || v_global.logic.cols.supp_nm4 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm5 + "<br/>⑤", name: "amt5", width: 100, align: "right", mask: "numeric-int", hidden: v_global.logic.cols.supp_nm5 == undefined || v_global.logic.cols.supp_nm5 == "" ? true : false },
                { header: "ⓐ / ① (%)", name: "r1", width: 60, align: "right", hidden: v_global.logic.cols.supp_nm1 == undefined || v_global.logic.cols.supp_nm1 == "" ? true : false },
                { header: "ⓐ / ② (%)", name: "r2", width: 60, align: "right", hidden: v_global.logic.cols.supp_nm2 == undefined || v_global.logic.cols.supp_nm2 == "" ? true : false }
                //{ header: "1st/4th (%)", name: "r3", width: 60, align: "right", hidden: v_global.logic.cols.supp_nm3 == undefined || v_global.logic.cols.supp_nm3 == "" ? true : false },
                //{ header: "1st/5th (%)", name: "r4", width: 60, align: "right", hidden: v_global.logic.cols.supp_nm4 == undefined || v_global.logic.cols.supp_nm4 == "" ? true : false },
                //{ header: "1st/6th (%)", name: "r5", width: 60, align: "right", hidden: v_global.logic.cols.supp_nm5 == undefined || v_global.logic.cols.supp_nm5 == "" ? true : false }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "SRM_1060_2", title: "견적 접수결과 세부내역",
            caption: false, height: "100%", pager: false, show: true, selectable: false, number: true, footer: true,
            element: [
				{ header: "품번", name: "item_cd", width: 80 },
				{ header: "품명", name: "item_nm", width: 180 },
				{ header: "규격", name: "item_spec", width: 180 },
				{ header: "단위", name: "uom", width: 50, align: "center" },
				{ header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int" },
				{ header: "납기요청일", name: "dlvr_date", width: 70, align: "center", mask: "date-ymd", hidden: true },
                { header: "Tracking No.", name: "proj_no", width: 90, align: "center", hidden: true },
                { header: "구매요청번호", name: "pr_no", width: 90, align: "center", hidden: true },
                { header: "<b>" + v_global.logic.cols.final_supp_nm + "<br/>단가</b>", name: "final_price", width: 100, align: "right", mask: "numeric-int", summary: { type: "sum", title: "계" }, style: { bgcolor: "#F2F2F2" }, hidden: v_global.logic.cols.final_supp_nm == undefined || v_global.logic.cols.final_supp_nm == "" ? true : false },
                { header: v_global.logic.cols.supp_nm1 + "<br/>단가", name: "price1", width: 100, align: "right", mask: "numeric-int", summary: { type: "sum", title: "계" }, hidden: v_global.logic.cols.supp_nm1 == undefined || v_global.logic.cols.supp_nm1 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm2 + "<br/>단가", name: "price2", width: 100, align: "right", mask: "numeric-int", summary: { type: "sum", title: "계" }, hidden: v_global.logic.cols.supp_nm2 == undefined || v_global.logic.cols.supp_nm2 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm3 + "<br/>단가", name: "price3", width: 100, align: "right", mask: "numeric-int", summary: { type: "sum", title: "계" }, hidden: v_global.logic.cols.supp_nm3 == undefined || v_global.logic.cols.supp_nm3 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm4 + "<br/>단가", name: "price4", width: 100, align: "right", mask: "numeric-int", summary: { type: "sum", title: "계" }, hidden: v_global.logic.cols.supp_nm4 == undefined || v_global.logic.cols.supp_nm4 == "" ? true : false },
                { header: v_global.logic.cols.supp_nm5 + "<br/>단가", name: "price5", width: 100, align: "right", mask: "numeric-int", summary: { type: "sum", title: "계" }, hidden: v_global.logic.cols.supp_nm5 == undefined || v_global.logic.cols.supp_nm5 == "" ? true : false }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE1", query: "SRM_1060_4", title: "견적서",
            caption: false, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "업체명", name: "data_tp_nm", width: 200 },
				{ header: "파일명", name: "file_nm", width: 450 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 250, hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE2", query: "SRM_1060_3", title: "도면 및 사양서",
            caption: false, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "등록", name: "data_tp_nm", width: 150, hidden: true },
				{ header: "파일명", name: "file_nm", width: 300 },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드" } },
				{ header: "설명", name: "file_desc", width: 250, hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true }
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
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
				{ type: "GRID", id: "grdList_SUB", offset: 8 },
                { type: "GRID", id: "grdList_FILE1", offset: 8 },
                { type: "GRID", id: "grdList_FILE2", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "출력", event: "click", handler: processExport };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_FILE1", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_FILE2", grid: true, element: "download", event: "click", handler: processFile };
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
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_pur_no", value: v_global.logic.pur_no }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN" },
            { type: "GRID", id: "grdList_SUB" },
            { type: "GRID", id: "grdList_FILE1" },
            { type: "GRID", id: "grdList_FILE2" }
        ],
        key: param.key,
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

    //var data = $("#grdList_SUB_data").jqGrid("getGridParam", "data");
    //var final_price = 0;
    //var price1 = 0;
    //var price2 = 0;
    //var price3 = 0;
    //var price4 = 0;
    //var price5 = 0;
    //$.each(data, function () {
    //    final_price += Number(this.final_price);
    //    price1 += Number(this.price1);
    //    price2 += Number(this.price2);
    //    price3 += Number(this.price3);
    //    price4 += Number(this.price4);
    //    price5 += Number(this.price5);
    //});
    //$("#grdList_SUB_data").jqGrid("footerData", "set", { final_price: final_price });
    //$("#grdList_SUB_data").jqGrid("footerData", "set", { price1: price1 });
    //$("#grdList_SUB_data").jqGrid("footerData", "set", { price2: price2 });
    //$("#grdList_SUB_data").jqGrid("footerData", "set", { price3: price3 });
    //$("#grdList_SUB_data").jqGrid("footerData", "set", { price4: price4 });
    //$("#grdList_SUB_data").jqGrid("footerData", "set", { price5: price5 });

    $("#grdList_SUB_data").jqGrid("footerData", "set", { final_price: gw_com_api.getValue("grdList_MAIN", 1, "final_amt", true) });
    $("#grdList_SUB_data").jqGrid("footerData", "set", { price1: gw_com_api.getValue("grdList_MAIN", 1, "amt1", true) });
    $("#grdList_SUB_data").jqGrid("footerData", "set", { price2: gw_com_api.getValue("grdList_MAIN", 1, "amt2", true) });
    $("#grdList_SUB_data").jqGrid("footerData", "set", { price3: gw_com_api.getValue("grdList_MAIN", 1, "amt3", true) });
    $("#grdList_SUB_data").jqGrid("footerData", "set", { price4: gw_com_api.getValue("grdList_MAIN", 1, "amt4", true) });
    $("#grdList_SUB_data").jqGrid("footerData", "set", { price5: gw_com_api.getValue("grdList_MAIN", 1, "amt5", true) });

    var $footRow = $("#grdList_SUB_data").closest(".ui-jqgrid-bdiv")
                         .next(".ui-jqgrid-sdiv")
                         .find(".footrow");
    $footRow.children("td").css("background-color", "#E1E6F6");

    //$footRow.find('>td[aria-describedby="final_amt"]')
    //    .css("border-left-color", "transparent");

    //gw_com_api.setValue("grdList_MAIN", 1, "final_amt", final_amt, false, true);
    //gw_com_api.setValue("grdList_MAIN", 1, "amt1", amt1, false, true);
    //gw_com_api.setValue("grdList_MAIN", 1, "amt2", amt2, false, true);
    //gw_com_api.setValue("grdList_MAIN", 1, "amt3", amt3, false, true);
    //gw_com_api.setValue("grdList_MAIN", 1, "amt4", amt4, false, true);
    //gw_com_api.setValue("grdList_MAIN", 1, "amt5", amt5, false, true);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_SUB" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    if (parent == undefined || parent == null || parent.streamProcess == undefined || window == parent)
        window.close();
    else {
        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);
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
function processExport(param) {

    if (gw_com_api.getRowCount("grdList_SUB") < 1) return;
    var page = window.location.pathname.split("/").reverse()[0];
    page = page.split(".")[0];

    var args = {
        page: page,
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: page },
            { name: "PUR_NO", value: v_global.logic.pur_no }
        ],
        target: { type: "FILE", id: "lyrDown", name: "입찰/견적결과" }
    };
    gw_com_module.objExport(args);

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
var Query = {
    getHeader: function (param) {
        var rtn = {};
        var args = {
            request: "PAGE",
            url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                    "?QRY_ID=SRM_1060_0" +
                    "&QRY_COLS=final_supp_nm,supp_nm1,supp_nm2,supp_nm3,supp_nm4,supp_nm5,final_amt" +
                    "&CRUD=R" +
                    "&arg_pur_no=" + param.pur_no,
            handler_success: successRequest
        };
        //=================== async : false ========================
        $.ajaxSetup({ async: false });
        //----------
        gw_com_module.callRequest(args);
        function successRequest(data) {
            rtn = {
                final_supp_nm: data[0].DATA[0],
                supp_nm1: data[0].DATA[1],
                supp_nm2: data[0].DATA[2],
                supp_nm3: data[0].DATA[3],
                supp_nm4: data[0].DATA[4],
                supp_nm5: data[0].DATA[5],
                final_amt: data[0].DATA[6]
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