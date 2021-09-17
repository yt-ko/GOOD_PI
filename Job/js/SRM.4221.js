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

        // 협력사 숨김 여부 설정
        v_global.logic.HideSupp = (gw_com_module.v_Session.DEPT_AREA=="SOLAR") ? false : true ;
		
        // set data for DDDW List
        var args = { request: [
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [
                        { argument: "arg_type", value: "ALL" }
                    ]
                },
                {
                    type: "INLINE", name: "라벨유형",
                    data: [{ title: "개별", value: "1" }, { title: "통합", value: "2" }, { title: "-", value: "0" }]
                },
                { type: "INLINE", name: "합불판정",
                    data: [ { title: "합격", value: "1" }, { title: "불합격", value: "0" } ]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() { 
        	gw_job_process.UI(); 
        	gw_job_process.procedure();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Option : 장비군
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", validate: true },
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "dept_area", label: { title: "장비군 :" },
				                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND", unshift: [{ title: "전체", value: "%" }] } }
				            }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================


        //==== Main Menu : 조회, 확인, 취소
        var args = { targetid: "lyrMenu_1", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Find Grid : Option
        var args = {
            targetid: "grdData_Find", query: "", title: "검색 조건",
            height: "100%", pager: false, show: true,
            editable: { master: true, bind: "select", focus: "barcode", validate: true },
            element: [
				{
				    header: "바코드(납품서)", name: "barcode", width: 80, align: "center",
				    editable: { type: "text", width: 160 }
				},
				{
				    header: "납품번호", name: "dlv_no", width: 80, align: "center",
				    editable: { type: "text", width: 160 }
				},
				{
				    header: "협력사", name: "supp_nm", width: 100, align: "center",
				    editable: { type: "text", width: 200 }
				},
				{
				    header: "납품일자(From)", name: "ymd_fr", width: 50, align: "center"
					, editable: { type: "text", width: 90 }, mask: "date-ymd"
				},
				{
				    header: "납품일자(To)", name: "ymd_to", width: 50, align: "center"
					, editable: { type: "text", width: 90 }, mask: "date-ymd"
				}
			]
        };
        gw_com_module.gridCreate(args);

        //==== List Grid : 납품 업체목록
        var args = {
            targetid: "grdData_Cust", query: "SRM_4221_M", title: "납품 업체",
            width: 200, height: 240, show: true, selectable: true,
            element: [
                { header: "공급업체", name: "supp_nm", width: 180, align: "left" },
				{ name: "supp_cd", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);

        //==== List Grid : 수입검사대상 납품목록
        var args = {
            targetid: "grdData_List", query: "SRM_4221_S", title: "검사 대상 품목",
            width:700, height: 240, show: true, dynamic: true, key: true, multi: true, checkrow: true,
            element: [
				{ header: "납품서번호", name: "dlv_no", width: 100, align: "center" },
				{ header: "순번", name: "dlv_seq", width: 40, align: "center" },
				{ header: "품번", name: "item_cd", width: 80, align: "center" },
				{ header: "품명", name: "item_nm", width: 140, align: "left" },
				{ header: "규격", name: "item_spec", width: 140, align: "left" },
				{ header: "Tracking", name: "track_no", width: 80, align: "center" },
				{ header: "Pallet No.", name: "pallet_no", width: 80, align: "center" },
				{ header: "수량", name: "issue_qty", width: 40, align: "right" },
				{ header: "단위", name: "unit", width: 40, align: "center" },
				{
				    header: "라벨", name: "label_tp", width: 40, align: "center",
				    format: { type: "select", data: { memory: "라벨유형" } }
				},
                { header: "바코드", name: "barcode", width: 60, align: "center" },
                { name: "dlv_user", hidden: true }
        ]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Find", offset: 8 },
				{ type: "GRID", id: "grdData_Cust", offset: 8 },
                { type: "GRID", id: "grdData_List", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu_1", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_1", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

        //----------
        var args = { targetid: "grdData_Cust", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------


        // startup process.
        //----------
        gw_com_module.startPage();
        //----------
        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "GRID", id: "grdData_Find" } ] };
    if (gw_com_module.objValidate(args) == false) return false;

    if (param.object == "lyrMenu_1") {
        args = {
            source: {
                type: "GRID", id: "grdData_Find", row: "selected",
                element: [
                    { name: "barcode", argument: "arg_barcode" },
                    { name: "dlv_no", argument: "arg_dlv_no" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "supp_nm", argument: "arg_supp_nm" }
                ],
                argument: [
                    { name: "arg_dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Cust", select: true }
            ],
            clear: [
               { type: "GRID", id: "grdData_List" }
            ]
        };
    } else {
        args = {
            source: {
                type: "GRID", id: "grdData_Find", row: "selected",
                element: [
                    { name: "barcode", argument: "arg_barcode" },
                    { name: "dlv_no", argument: "arg_dlv_no" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" }
                ],
                argument: [
                    { name: "arg_supp_cd", value: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true) },
                    { name: "arg_dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_List", focus: true }
            ]
        };
    }

    gw_com_module.objRetrieve(args);

};
//----------

function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Find" },
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
    $.each(ids, function () {
        rows.push({
            barcode: gw_com_api.getCellValue("GRID", "grdData_List", this, "barcode")
            , dlv_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_no")
            , dlv_seq: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_seq")
            , track_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "track_no")
            , pallet_no: gw_com_api.getCellValue("GRID", "grdData_List", this, "pallet_no")
            , item_cd: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_cd")
            , item_nm: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_nm")
            , item_spec: gw_com_api.getCellValue("GRID", "grdData_List", this, "item_spec")
            , dlv_qty: gw_com_api.getCellValue("GRID", "grdData_List", this, "issue_qty")
            , unit: gw_com_api.getCellValue("GRID", "grdData_List", this, "unit")
            , label_tp: gw_com_api.getCellValue("GRID", "grdData_List", this, "label_tp")
            , rqst_dept: gw_com_api.getValue("grdData_Cust", "selected", "supp_cd", true)
            , rqst_dept_nm: gw_com_api.getValue("grdData_Cust", "selected", "supp_nm", true)
            , rqst_user: gw_com_api.getCellValue("GRID", "grdData_List", this, "dlv_user")
        });
    });

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_SCM,
        data: { rows: rows }
    };
    gw_com_module.streamInterface(args);

    processClear({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_SCM: {
            var args = {
                targetid: "grdData_Find", edit: true,
                data: [
                    { name: "ymd_fr", value: gw_com_api.getDate("", { day: -30 } ) },
                    { name: "ymd_to", value: gw_com_api.getDate("", { day: 0 } ) }
                ]
            };
            gw_com_module.gridInsert(args);
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//