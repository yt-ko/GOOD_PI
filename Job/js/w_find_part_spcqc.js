
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define gw_job_process class : ready(), UI(), procedure()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() { gw_job_process.UI(); }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function() {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Option : Form Main ====
        var args = { targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, align: "left", //remark: "lyrRemark", margin: 220,
            editable: { focus: "part_cd", validate: true, bind: "open" },
            content: { row: [
                    { element: [
				            { name: "part_cd", label: { title: "부품코드 :" },
				                editable: { type: "text", size: 8, maxlength: 20 }
				            },
				            { name: "part_nm", label: { title: "부품명 :" },
				                editable: { type: "text", size: 12, maxlength: 20 }
				            },
				            { name: "supp_cd", label: { title: "업체 :" }, //hidden: true,
				                editable: { type: "text", size: 12, maxlength: 20 }
                            },
				            { name: "실행", act: true, show: false, format: { type: "button" } }
				    ] }
			] }
        };
        gw_com_module.formCreate(args);

        //==== Grid : Main ====
        var args = { targetid: "grdData_부품", query: "w_find_part_spc_qc", title: "부품",
            caption: false, height: 400, show: true, selectable: true, dynamic: true, key: true,
            element: [
				{ header: "Model", name: "part_grp_nm", width: 100, align: "center" },
				{ header: "부품코드", name: "part_cd", width: 80, align: "center" },
				{ header: "부품명", name: "part_nm", width: 180, align: "center" },
				{ header: "항목코드", name: "qcitem_cd", width: 60, align: "center" },
				{ header: "검사항목명", name: "qcitem_nm", width: 180, align: "center" },
				{ header: "규격", name: "part_spec", width: 200, align: "center" },
				{ header: "업체코드", name: "supp_cd", width: 80, align: "center" },
				{ header: "업체명", name: "supp_nm", width: 150, align: "center" },
				{ name: "part_grp", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Resize Objects ====
        var args = {
            target: [
                { type: "GRID", id: "grdData_부품", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

        gw_com_module.informSize();

        gw_job_process.procedure();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Define Events & Method
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);

        function click_lyrMenu_조회(ui) { processRetrieve({}); }

        function click_lyrMenu_닫기(ui) { processClose({}); }

        function click_frmOption_실행(ui) { processRetrieve({}); }

        //==== Grid Events : Main
        var args = { targetid: "grdData_부품", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_부품 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_부품", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_부품 };
        gw_com_module.eventBind(args);

        function rowdblclick_grdData_부품(ui) { informResult({}); }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_module.startPage();
        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        gw_com_module.streamInterface(args);

    }   // End of gw_job_process.procedure

};  // End of gw_job_process

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------------------------------------
processRetrieve = function (param) {

    if (gw_com_api.getValue("frmOption", 1, "part_cd") == ""
        && gw_com_api.getValue("frmOption", 1, "part_nm") == ""
        && gw_com_api.getValue("frmOption", 1, "supp_cd") == "") {
        gw_com_api.messageBox([
            { text: "조회 조건 중 한 가지는 반드시 입력하셔야 합니다." }
        ]);
        gw_com_api.setError(true, "frmOption", 1, "part_cd", false, true);
        gw_com_api.setError(true, "frmOption", 1, "part_nm", false, true);
        gw_com_api.setError(true, "frmOption", 1, "supp_cd", false, true);
        return false;
    }
    gw_com_api.setError(false, "frmOption", 1, "part_cd", false, true);
    gw_com_api.setError(false, "frmOption", 1, "part_nm", false, true);
    gw_com_api.setError(false, "frmOption", 1, "supp_cd", false, true);

    var args = { key: param.key
        ,source: { type: "FORM", id: "frmOption",
            element: [
				{ name: "part_cd", argument: "arg_part_cd" }
				,{ name: "part_nm", argument: "arg_part_nm" }
				,{ name: "supp_cd", argument: "arg_supp_cd" }
			]
        }
        ,target: [
			{ type: "GRID", id: "grdData_부품", select: true, focus: true }
		]
    };
    gw_com_module.objRetrieve(args);

};
//----------------------------------------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);

};
//----------
function informResult(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedPart_QCM,
        data: {
            part_cd: gw_com_api.getValue("grdData_부품", "selected", "part_cd", true),
            part_nm: gw_com_api.getValue("grdData_부품", "selected", "part_nm", true),
            supp_cd: gw_com_api.getValue("grdData_부품", "selected", "supp_cd", true),
            part_grp: gw_com_api.getValue("grdData_부품", "selected", "part_grp", true),
            part_grp_nm: gw_com_api.getValue("grdData_부품", "selected", "part_grp_nm", true),
            qcitem_cd: gw_com_api.getValue("grdData_부품", "selected", "qcitem_cd", true),
            qcitem_nm: gw_com_api.getValue("grdData_부품", "selected", "qcitem_nm", true),
            part_spec: gw_com_api.getValue("grdData_부품", "selected", "part_spec", true)
        }
    };
    gw_com_module.streamInterface(args);

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function(param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectPart_QCM:
            {
                var retrieve = false;
                if (param.data != undefined) {
                    if (param.data.supp_cd != gw_com_api.getValue("frmOption", 1, "supp_cd")) {
                        gw_com_api.setValue("frmOption", 1, "supp_cd", param.data.supp_cd);
                        retrieve = true;
                    }
                    if (param.data.part_cd != gw_com_api.getValue("frmOption", 1, "part_cd")) {
                        gw_com_api.setValue("frmOption", 1, "part_cd", param.data.part_cd);
                        retrieve = true;
                    }
                    if (param.data.part_nm != gw_com_api.getValue("frmOption", 1, "part_nm")) {
                        gw_com_api.setValue("frmOption", 1, "part_nm", param.data.part_nm);
                        retrieve = true;
                    }
                }
                else if (!v_global.process.init) v_global.process.init = true;

                if (retrieve) processRetrieve({});

                gw_com_api.setFocus("frmOption", 1, "part_cd");                
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