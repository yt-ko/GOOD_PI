
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                { type: "PAGE", name: "장비군", query: "dddw_prodgroup" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
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
                                }
                            ]
                        },
                        {
                            element: [
                              {
                                  name: "supp_nm", label: { title: "협력사 :" }, //hidden: true, 
                                  editable: { type: "text", size: 14 }
                              }
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "part_no", label: { title: "품목코드 :" },
                                    editable: { type: "text", size: 14 }
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

        //=====================================================================================
        var args = {
            targetid: "grdData_대분류", query: "SPC_3090_1", title: "협력사",
            caption: true, width: 250, height: 250, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "supp_cd", validate: true },
            element: [
				{ header: "협력사명", name: "supp_nm", width: 180 },
				{ header: "품목수", name: "part_cnt", width: 50, align: "right", mask: "numeric-int" },
				{ header: "협력사코드", name: "supp_cd", width: 40, align: "center", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_중분류", query: "SPC_3090_2", title: "검사대상품목",
            caption: true, width: 800, height: 250, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "item_no", validate: true },
            element: [
				{ header: "품목코드", name: "item_no", width: 100 },
				{ header: "품목명", name: "item_nm", width: 200 },
				{ header: "규격", name: "item_spec", width: 200 },
				{ header: "양식", name: "form_ym", width: 120 },
                { header: "협력사코드", name: "supp_cd", width: 200, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_소분류", query: "SPC_3090_3", title: "검사표준",
            caption: true, width: 900, height: 178, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "supp_nm", validate: true },
            element: [
				{ header: "검사구분", name: "qcitem_class", width: 110 },
				{ header: "검사항목명", name: "qcitem_nm", width: 200 },
				{ header: "적용일자", name: "app_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "측정단위", name: "value_unit", width: 50 },
				{ header: "공칭값", name: "normal_value", width: 70, align: "right", mask: "numeric-float" },
				{ header: "상한한계값", name: "usl_value", width: 70, align: "right", mask: "numeric-float" },
				{ header: "하한한계값", name: "lsl_value", width: 70, align: "right", mask: "numeric-float" },
				{ header: "공차", name: "gap_value", width: 70, align: "right", mask: "numeric-float" },
                { header: "규격종류", name: "qc_type", width: 80 },
                { header: "검사항목", name: "qcitem_cd", width: 150, hidden: true },
                { header: "협력사명", name: "supp_nm", width: 150, hidden: true },
                { header: "품목코드", name: "item_no", width: 100, hidden: true },
                { header: "품목명", name: "item_nm", width: 200, hidden: true },
                { header: "규격", name: "item_spec", width: 100, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_대분류", offset: 8 },
                { type: "GRID", id: "grdData_중분류", offset: 8 },
				{ type: "GRID", id: "grdData_소분류", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_job_process.procedure();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);

        //==== Button Click : Search Option ====
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: hideOption };
        gw_com_module.eventBind(args);
        function hideOption(ui) { gw_com_api.hide("frmOption"); }

        //=====================================================================================
        var args = { targetid: "grdData_대분류", grid: true, event: "rowselected", handler: rowselected_grdData_대분류 };
        gw_com_module.eventBind(args);
        //----------
        function rowselected_grdData_대분류(ui) {
            v_global.process.prev.master = ui.row;
            processLink({});
        };
        //=====================================================================================
        var args = { targetid: "grdData_중분류", grid: true, event: "rowselected", handler: rowselected_grdData_중분류 };
        gw_com_module.eventBind(args);
        //----------
        function rowselected_grdData_중분류(ui) {
            v_global.process.prev.sub = ui.row;
            processLink({ sub: true });
        };
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_module.startPage();
        processRetrieve({});

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            {
                //v_global.process.handler = processRetrieve;
                //processRetrieve({});
                var args = { target: [{ id: "frmOption", focus: true }] };
                gw_com_module.objToggle(args);
            }
            break;
        case "닫기":
            {
                v_global.process.handler = processClose;
                processClose({});
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    // Validate Inupt Options
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    // Retrieve
    if (param.object == "frmOption" || param.object == undefined) {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "plant_cd", argument: "argBizDept" },
                    { name: "supp_nm", argument: "argSuppNM" },
                    { name: "part_no", argument: "argPartNo" }
                ],
                remark: [
                    { element: [{ name: "plant_cd" }] },
                    { element: [{ name: "supp_nm" }] },
                    { element: [{ name: "part_no" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_대분류", focus: true, select: true }
            ],
            clear: [
            	{ type: "GRID", id: "grdData_중분류" },
            	{ type: "GRID", id: "grdData_소분류" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
            key: param.key,
            source: {
                type: "GRID", id: "grdData_중분류", row: "selected", block: true,
                element: [
                    { name: "item_no", argument: "argPartNo" },
                    { name: "supp_cd", argument: "argSuppCd" }
                ]
            },
            target: [
	            { type: "GRID", id: "grdData_소분류", select: false }
            ]
        };
    }
    else {
        args = {
            key: param.key,
            source:
                {
                    type: "GRID", id: "grdData_대분류", row: "selected", block: true,
                    element: [
                        { name: "supp_cd", argument: "argSuppCd" }
                    ],
                    argument: [
                        { name: "argItemNo", value: gw_com_api.getValue("frmOption", 1, "part_no") }
                    ]
                },
            target: [
	            { type: "GRID", id: "grdData_중분류", select: true }
            ],
            clear: [
				{ type: "GRID", id: "grdData_소분류" }
            ]
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//