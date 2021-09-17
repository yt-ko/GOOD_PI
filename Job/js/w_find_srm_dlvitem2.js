//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 발주내역 조회
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

        // set data for DDDW List
        var args = { request: [
                {
                    type: "INLINE", name: "라벨유형",
                    data: [{ title: "개별", value: "1" }, { title: "통합", value: "2" }, { title: "-", value: "0" }]
                }
        ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();

        	gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
        	gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 0 }));
        	gw_com_module.startPage();
            //----------
        	var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        	gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark2",
            editable: { bind: "open", focus: "cust_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
				                {
				                    name: "ymd_fr", label: { title: "발주일자 :" },
				                    mask: "date-ymd", style: { colfloat: "floating" },
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
				                    name: "pur_no", label: { title: "발주번호 :" },
				                    editable: { type: "text", size: 8 }
				                },
				                {
				                    name: "bl_no", label: { title: "B/L번호 :" },
				                    editable: { type: "text", size: 8 }
				                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "item_nm", label: { title: "품명 :" },
                                    editable: { type: "text", size: 15 }
                                },
                                { name: "except", hidden: true }
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
            targetid: "grdData_Cust", query: "w_find_srm_dlvitem_m", title: "납품 업체",
            width: 200, height: 290, show: true, selectable: true,
            element: [
                { header: "공급업체", name: "supp_nm", width: 180, align: "left" },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        createDW({});
        $("#lyrRemark2").html("※ 빨간색 품목은 <font color='red'><b>성적서 미등록</b></font> 품목입니다. 성적서 확인 후 납품등록 할 수 있습니다.");
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Cust", offset: 8 },
                { type: "GRID", id: "grdData_List", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();
        //=====================================================================================

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: toggleOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_Cust", grid: true, event: "rowselected", handler: processRetrieveSub };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function createDW(param) {

    var args = {
        targetid: "grdData_List", query: "w_find_srm_dlvitem_l", title: "납품 대상 품목",
        width: 700, height: 290, show: true, key: true, multi: true, checkrow: true,
        color: { row: true },
        element: [
            { header: "B/L 번호", name: "cc_no", width: 60, align: "center", hidden: !param.bl },
            { header: "발주번호", name: "pur_no", width: 60, align: "center" },
            { header: "순번", name: "pur_seq", width: 60, align: "center", hidden: true },
            { header: "품번", name: "item_cd", width: 80, align: "center" },
            { header: "품명", name: "item_nm", width: 120, align: "left" },
            { header: "규격", name: "item_spec", width: 120, align: "left" },
            { header: "Tracking", name: "track_no", width: 80, align: "center" },
            { header: "Pallet No.", name: "pallet_no", width: 80, align: "center" },
            { header: "발주일", name: "pur_date", width: 70, align: "center", mask: "date-ymd" },
            { header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd" },
            { header: "PO수량", name: "pur_qty", width: 50, align: "right", mask: "numeric-int" },
            { header: "단위", name: "pur_unit", width: 40, align: "center" },
            { header: "통관수량", name: "cc_qty", width: 60, align: "right", mask: "numeric-int", hidden: !param.bl },
            { header: "납품수량", name: "dlv_qty", width: 60, align: "right" },
            {
                header: "라벨", name: "label_tp", width: 40, align: "center",
                format: { type: "select", data: { memory: "라벨유형" } }, hidden: true
            },
            {
                header: "선입고", name: "direct_yn", width: 40, align: "center",
                format: { type: "checkbox", value: 1, offval: 0 }, hidden: true
            },
            {
                header: "성적서미등록", name: "qcr_file_chk", width: 70, align: "right",
                mask: "numeric-int"
            },
            { header: "납품가능수량", name: "dlva_qty", width: 60, align: "right" },
            { name: "color", hidden: true },
            { name: "qcr_chk", hidden: true }
        ]
    };
    //----------
    gw_com_module.gridCreate(args);

    if (param.resize) {
        var args = {
            target: [
                { type: "GRID", id: "grdData_List", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
    }

}
//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    var remark = [
        { element: [{ name: "pur_no" }] },
        { element: [{ name: "bl_no" }] },
        { element: [{ name: "item_nm" }] }
    ];
    if (gw_com_api.getValue("frmOption", 1, "pur_no") == "" && gw_com_api.getValue("frmOption", 1, "bl_no") == "")
        remark.unshift({ infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] });

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "pur_no", argument: "arg_pur_no" },
                { name: "bl_no", argument: "arg_bl_no" },
                { name: "item_nm", argument: "arg_item_nm" },

                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" }
            ]//,
            //remark: remark
        },
        target: [
            { type: "GRID", id: "grdData_Cust", select: true }
        ],
        clear: [
           { type: "GRID", id: "grdData_List" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveSub(param) {

    var query = (gw_com_api.getValue("frmOption", 1, "bl_no") == "" ? "w_find_srm_dlvitem_l" : "w_find_srm_dlvitem_cc");
    v_global.logic.bl = (gw_com_api.getValue("frmOption", 1, "bl_no") == "" ? false : true);

    createDW({ bl: v_global.logic.bl, resize: true });

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "pur_no", argument: "arg_pur_no" },
				{ name: "bl_no", argument: "arg_bl_no" },
				{ name: "item_nm", argument: "arg_item_nm" },
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" }
            ],
            argument: [
                { name: "arg_supp_cd", value: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true) }
            ]
        },
        target: [
			{
			    type: "GRID", id: "grdData_List", focus: true,
			    query: query
			}
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_List" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdData_List", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([ { text: "선택된 대상이 없습니다." } ]);
        return false;
    }
    
    var rows = [];
    var alert = true;
    $.each(ids, function () {

        var row = gw_com_api.getRowData("grdData_List", this);
        var qcr_chk = row["qcr_chk"];
        if (qcr_chk == "1") {
            gw_com_api.showMessage("성적서 미등록 품목은 납품등록 할 수 없습니다.");
            return false;
        }

        rows.push(
            {
                pur_no: row["pur_no"],
                pur_seq: row["pur_seq"],
                item_cd: row["item_cd"],
                item_nm: row["item_nm"],
                item_spec: row["item_spec"],
                track_no: row["track_no"],
                pallet_no: row["pallet_no"],
                req_date: row["req_date"],
                pur_qty: row["pur_qty"],
                pur_unit: row["pur_unit"],
                dlv_qty: row["dlva_qty"]
            }
        );

        //var qcrFile = gw_com_api.getCellValue("GRID", "grdData_List", this, "qcr_file_chk");
        //if (qcrFile > 0) {
        //    if (alert)
        //        gw_com_api.showMessage("성적서 미등록 품목은 납품등록 할 수 없습니다.");
        //    alert = false;
        //    return true;
        //}
        //var dlvQty = (v_global.logic.bl ? gw_com_api.getCellValue("GRID", "grdData_List", this, "cc_qty") : gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_qty") - gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_qty"));
        //if (dlvQty > 0) {
        //    rows.push({
        //        pur_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_no"),
        //        pur_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_seq"),
        //        item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd"),
        //        item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm"),
        //        item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec"),
        //        track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no"),
        //        pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no"),
        //        req_date: gw_com_api.getCellValue("GRID", "grdData_List", this, "req_date"),
        //        pur_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_qty"),
        //        pur_unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "pur_unit"),
        //        dlv_qty: dlvQty
        //    });
        //}
    });

    if (rows.length > 0) {
        var args = {
            ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
            data: {
                supp_cd: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true),
                supp_nm: gw_com_api.getValue("grdData_Cust", "selected", "supp_nm", true),
                rows: rows
            }
        };
        gw_com_module.streamInterface(args);

        processClear({});
    } else {
        //gw_com_api.messageBox([{ text: "납품등록 가능한 데이터가 없습니다." }]);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            if (param.data != undefined) {
                gw_com_api.setValue("frmOption", 1, "pur_no", param.data.pur_no == undefined ? "" : param.data.pur_no);
                gw_com_api.setValue("frmOption", 1, "supp_cd", param.data.supp_cd == undefined ? "" : param.data.supp_cd);
                gw_com_api.setValue("frmOption", 1, "except", param.data.except == undefined ? "" : param.data.except.replace(/,/gi, "','"));
            }
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//