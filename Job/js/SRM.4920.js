//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 재고현황_장비군별
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
				{
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process : Create UI & Event
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //==== Main Menu : 조회, 추가, 수정, 삭제
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true }
            ]
        };
        gw_com_module.buttonMenu(args);

        //==== Search Option : 
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "plant_cd", validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "plant_cd", label: { title: "장비군 : " },
                                    editable: {
                                        type: "select", data: {
                                            memory: "장비군",
                                            unshift: [
                                                { title: "전체", value: "%" }
                                            ]
                                        }
                                    }
                                },
                                {
                                    name: "track_no", label: { title: "Tracking :" },
                                    editable: { type: "text", size: 12, maxlength: 20 }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "item_cd", label: { title: "품번 :" },
                                    editable: { type: "text", size: 10, maxlength: 20 }
                                },
                                {
                                    name: "item_nm", label: { title: "품명 :" },
                                    editable: { type: "text", size: 20, maxlength: 30 }
                                }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "qty_yn", label: { title: "재고유무 :" },
                                    editable: { type: "checkbox", value: "1", offval: "0" }
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
        gw_com_module.formCreate(args);


        //==== Main Grid : 재고현황
        var args = {
            targetid: "grdData_Main", query: "SRM_4920_M", title: "",
            height: 240, pager: true, show: true, selectable: true, number: true, dynamic: true, //multi: true, checkrow: true,
            element: [
				{ header: "품번", name: "item_cd", width: 60, align: "center" },
				{ header: "품명", name: "item_nm", width: 150, align: "left" },
				{ header: "규격", name: "item_spec", width: 150, align: "left" },
				{
				    header: "현재고", name: "inv_qty", width: 50, align: "right",
				    fix: { mask: "numeric-int", margin: 1 }, style: { bgcolor: "#EFEFFA" }
				},
				{ header: "단위", name: "unit", width: 40, align: "center" },
				{
				    header: "입고", name: "in_qty", width: 50, align: "right",
				    fix: { mask: "numeric-int", margin: 1 }
				},
				{
				    header: "입고(ERP)", name: "erp_in_qty", width: 50, align: "right",
				    fix: { mask: "numeric-int", margin: 1 }, style: { bgcolor: "#E7FAE7" }
				},
				{
				    header: "출고", name: "out_qty", width: 50, align: "right",
				    fix: { mask: "numeric-int", margin: 1 }
				},
				{
				    header: "출고(ERP)", name: "erp_out_qty", width: 50, align: "right",
				    fix: { mask: "numeric-int", margin: 1 }, style: { bgcolor: "#FAFACA" }
				},
                {
                    header: "장비군", name: "plant_cd", width: 50, align: "center",
                    format: { type: "select", data: { memory: "장비군" } }
                }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Sub Grid : 수불현황
        var args = {
            targetid: "grdData_Sub", query: "SRM_4920_S", title: "",
            pager: true, show: true, selectable: true, number: true,
            element: [
                { header: "수불일", name: "io_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "구분", name: "io_cd", width: 70, align: "center" },
				//{ header: "품번", name: "item_cd", width: 80, align: "center" },
				//{ header: "품명", name: "item_nm", width: 130, align: "left" },
				//{ header: "규격", name: "item_spec", width: 130, align: "left" },
				{ header: "Tracking", name: "track_no", width: 80, align: "center" },
				{
				    header: "수량", name: "io_qty", width: 50, align: "right",
				    fix: { mask: "numeric-int", margin: 1 }
				},
				{ header: "단위", name: "io_unit", width: 40, align: "center" },
                { header: "바코드", name: "barcode", width: 70, align: "center" },
				{ header: "ERP", name: "erp_flg", width: 40, align: "center" },
                { header: "관리번호", name: "io_no", width: 80, align: "center" },
                { header: "순번", name: "io_seq", width: 40, align: "center" },
                { name: "io_flg", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        function viewOption(ui) {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        }

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: hideOption };
        gw_com_module.eventBind(args);
        function hideOption(ui) { gw_com_api.hide("frmOption"); }
        //----------

        //==== Grid Events : Main
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------

        //==== Grid Events : Sub
        var args = { targetid: "grdData_Sub", grid: true, event: "rowdblclick", handler: processLink };
        gw_com_module.eventBind(args);

        //==== startup process.
        //gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: v_global.logic.HideSupp ? -30 : -5 }));
        //gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate("", { day: 1 }));
        gw_com_api.setValue("frmOption", 1, "qty_yn", "1");
        gw_com_module.startPage();

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//---------- Sub Functions : Checking
function checkSelected(objid) {
    if (gw_com_api.getSelectedRow(objid) == null) {
        gw_com_api.messageBox([{ text: "선택된 대상이 없습니다." }], 300);
        return false;
    }
    return true;
}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve
    if (param.object == "frmOption") {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "plant_cd", argument: "arg_plant_cd" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "item_nm", argument: "arg_item_nm" },
                    { name: "track_no", argument: "arg_track_no" },
                    { name: "qty_yn", argument: "arg_qty_yn" }
                ],
                remark: [
                    { element: [{ name: "plant_cd" }] },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "item_nm" }] },
                    { element: [{ name: "track_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Main", focus: true, select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_Sub" }
            ]
        };
    } else if (param.object == "grdData_Main") {
        args = {
            source: {
                type: "GRID", id: param.object, row: "selected", block: true,
                element: [
                    { name: "plant_cd", argument: "arg_plant_cd" },
                    { name: "item_cd", argument: "arg_item_cd" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub", focus: true, select: true }
            ]
        };
    }

    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {



}
//---------- Closing Process
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage: {
            gw_com_module.streamInterface(param);
        } break;
        case gw_com_api.v_Stream.msg_retrieve: {
            processRetrieve({ key: param.data.key });
        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//