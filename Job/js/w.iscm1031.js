//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 일정기준 복사
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

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
				{ type: "PAGE", name: "제품유형", query: "dddw_prodtype" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() { 

            gw_job_process.UI();
        	gw_job_process.procedure();

        	var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        	gw_com_module.streamInterface(args);

        	gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "저장", value: "확인" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_1", type: "FREE",
            show: true, border: true, align: "left",
            editable: { bind: "open", focus: "prod_type_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "prod_type_fr", label: { title: "원본 : " },
                                editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required", message: "원본" } }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmOption_1_data").css("padding-left", "2px");
        //=====================================================================================
        var args = {
            targetid: "frmOption_2", type: "FREE",
            show: true, border: true, align: "left",
            editable: { bind: "open", focus: "prod_type_to", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "prod_type_to", label: { title: "대상 : " },
                                editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required", message: "대상" } }
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        $("#frmOption_2_data").css("padding-left", "2px");
        //=====================================================================================
        var args = {
            targetid: "grdList_1", query: "w_iscm1030_M_1", title: "",
            caption: false, height: 310, pager: false, show: true, selectable: true,
            element: [
                { header: "팀", name: "job_team_nm", width: 100 },
                { header: "부문", name: "job_dept_nm", width: 100 },
                { header: "내역", name: "job_fld_nm", width: 100 },
                { header: "사번", name: "job_emp_no", width: 50, align: "center", hidden: true },
                { header: "담당자", name: "emp_nm", width: 50, align: "center" },
                { header: "시작일", name: "job_s_days", width: 50, mask: "numeric-int", align: "center" },
                { header: "종료일", name: "job_e_days", width: 50, mask: "numeric-int", align: "center" },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1" }
                },
                { header: "순서", name: "data_sort", width: 50, align: "center", hidden: true },
                { name: "job_id", hidden: true },
                { name: "prod_group", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_2", query: "w_iscm1030_M_1", title: "",
            caption: false, height: 310, pager: false, show: true, selectable: true,
            element: [
                { header: "팀", name: "job_team_nm", width: 100 },
                { header: "부문", name: "job_dept_nm", width: 100 },
                { header: "내역", name: "job_fld_nm", width: 100 },
                { header: "사번", name: "job_emp_no", width: 50, align: "center", hidden: true },
                { header: "담당자", name: "emp_nm", width: 50, align: "center" },
                { header: "시작일", name: "job_s_days", width: 50, mask: "numeric-int", align: "center" },
                { header: "종료일", name: "job_e_days", width: 50, mask: "numeric-int", align: "center" },
                {
                    header: "사용", name: "use_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1" }
                },
                { header: "순서", name: "data_sort", width: 50, align: "center", hidden: true },
                { name: "job_id", hidden: true },
                { name: "prod_group", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_1", offset: 8 },
                { type: "GRID", id: "grdList_2", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_1", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_2", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

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
function processButton(param) {

    switch (param.element) {
        case "저장":
            {
                processBatch(param);
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    processRetrieve({ object: param.object, element: param.element, target: param.object == "frmOption_1" ? "grdList_1" : "grdList_2" });

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: param.object,
            element: [
                { name: param.element, argument: "arg_Prod_group" }
            ]
        },
        target: [
            { type: "GRID", id: param.target, select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processBatch(param) {

    var args = {
        target: [
	        { type: "FORM", id: "frmOption_1" },
            { type: "FORM", id: "frmOption_2" }
        ]
    };
    if (gw_com_module.objValidate(args) == false)
        return false;

    var prod_type_fr = gw_com_api.getValue("frmOption_1", 1, "prod_type_fr");
    var prod_type_to = gw_com_api.getValue("frmOption_2", 1, "prod_type_to");

    if (prod_type_fr == prod_type_to) {
        gw_com_api.showMessage("원본과 대상이 동일합니다.");
        return false;
    }

    if (gw_com_api.getRowCount("grdList_1") < 1) {
        gw_com_api.showMessage("복사할 원본 데이터가 없습니다.");
        return false;
    }

    var args = {
        url: "COM",
        procedure: "PROC_SM_COPY_BAS_REQ_JOB",
        nomessage: true,
        input: [
            { name: "prod_type_fr", value: prod_type_fr, type: "varchar" },
            { name: "prod_type_to", value: prod_type_to, type: "varchar" },
            { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: {
                prod_type: prod_type_to
            }
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    gw_com_api.showMessage("", "success");
    processClose({ data: param });
    processClear({});

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmOption_1" },
            { type: "FORM", id: "frmOption_2" },
            { type: "GRID", id: "grdList_1" },
            { type: "GRID", id: "grdList_2" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                gw_com_module.streamInterface(args);
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