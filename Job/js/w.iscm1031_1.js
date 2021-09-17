//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: {}, logic: {}
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                //    param: [{ argument: "arg_type", value: "ALL" }]
                //},
                {
                    type: "PAGE", name: "장비군_IN", query: "dddw_deptarea_in",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                { type: "PAGE", name: "제품유형", query: "dddw_prodtype" },
                {
                    type: "PAGE", name: "고객사", query: "dddw_cust",
                    param: [{ argument: "arg_hcode", value: "ISCM29" }]
                },
                { type: "PAGE", name: "PROCESS", query: "dddw_custproc" }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {
            
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);

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
                { name: "선택", value: "선택", icon: "실행" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { validate: true },
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "dept_area", label: { title: "장비군 : " },
                                    editable: { type: "select", validate: { rule: "required" }, data: { memory: "장비군_IN" } }
                                },
				                {
				                    name: "group1_cd", label: { title: "모델 :" },
				                    editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
				                }

                            ]
                        },
                        {
                            element: [
                                {
                                    name: "group2_cd", label: { title: "Process :" },
                                    editable: { type: "select", data: { memory: "PROCESS", unshift: [{ title: "전체", value: "%" }] } }
                                },
                                {
                                    name: "group3_cd", label: { title: "고객사 :" },
                                    editable: { type: "select", data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] } }
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
            targetid: "grdData_현황", query: "w_iscm1031_M_1", title: "모델",
            height: 300, show: true, multi: true, checkrow: true, key: true,
            element: [
                { header: "장비군", name: "dept_area_nm", width: 40, align: "left" },
                { header: "장비군", name: "dept_area", width: 40, align: "left", hidden: true },
                { header: "제품유형", name: "group1_nm", width: 80, align: "left" },
                { header: "제품유형", name: "group1_cd", width: 80, align: "left", hidden: true },
                { header: "공정", name: "group2_nm", width: 80, align: "left" },
                { header: "공정", name: "group2_cd", width: 80, align: "left", hidden: true },
                { header: "고객사", name: "group3_nm", width: 80, align: "left" },
                { header: "고객사", name: "group3_cd", width: 80, align: "left", hidden: true },
                { header: "영업구분", name: "group4_nm", width: 80, align: "left" },
                { header: "영업구분", name: "group4_cd", width: 80, align: "left", hidden: true },
                { header: "국내/외", name: "group5_nm", width: 70, align: "left" },
                { header: "국내/외", name: "group5_cd", width: 70, align: "left", hidden: true },
                { name: "model_id", editable: { type: "hidden" }, hidden: true },
                { name: "plan_yn", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_현황", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "선택", event: "click", handler: click_lyrMenu_선택 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
                    { id: "frmOption", focus: true }
                ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_선택(ui) {
            if (v_global.data.plan_yn == "0")
                informResult({});
            else
                processCopy({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
processRetrieve = function (param) {

    var args = {
        target: [{ type: "FORM", id: "frmOption" }]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
				{ name: "group1_cd", argument: "arg_prod_grp1" },
                { name: "group2_cd", argument: "arg_prod_grp2" },
                { name: "group3_cd", argument: "arg_prod_grp3" },
                { name: "dept_area", argument: "arg_dept_area" }
            ],
            argument:[
                { name: "arg_plan_yn", value: v_global.data.plan_yn }
            ],
            remark: [
                { element: [{ name: "dept_area" }] },
		        { element: [{ name: "group1_cd" }] },
                { element: [{ name: "group2_cd" }] },
                { element: [{ name: "group3_cd" }] }
		        
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);
    processInfoText();

};
//----------
function processInfoText() {
    $('#info_text').text("작업일정을 붙여넣기 할 대상을 선택하세요.");
    $('#info_text').css("font-weight", "bold");
    $('#info_text').css("color", "blue");

    if (v_global.data.plan_yn == "1")
        $('#info_text').show();
    else
        $('#info_text').hide();

}
//----------
function processCopy(param) {
    var ids = gw_com_api.getSelectedRow("grdData_현황", true);

    if (ids.length < 1) {
        gw_com_api.messageBox([
            { text: "선택된 대상이 없습니다." }
        ]);
        return false;
    }

    v_global.logic.model_id = "";
    if (ids.length == 1 && v_global.data.src_id == gw_com_api.getValue("grdData_현황", "selected", "model_id", true)) {
        gw_com_api.messageBox([
                    { text: "원본과 다른 대상을 선택하세요." }
        ]);
        return false;
    }

    $.each(ids, function () {
        if (v_global.data.src_id != gw_com_api.getValue("grdData_현황", this, "model_id", true))
            v_global.logic.model_id += (v_global.logic.model_id == "" ? "" : ",") + gw_com_api.getValue("grdData_현황", this, "model_id", true);
    });
    var args = {
        url: "COM",
        procedure: "sp_copy_SCM_MODEL_PLAN",
        nomessage: true,
        input: [
            { name: "source_id", value: v_global.data.src_id, type: "varchar" },
            { name: "target_id", value: v_global.logic.model_id, type: "varchar" },
            { name: "ins_usr", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ]
    };
    gw_com_module.callProcedure(args);
    processRetrieve({});
    processClose({ copy: true });
}
//----------
function processClose(param) {
    
    
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    if (param.copy) {
        var str = v_global.logic.model_id.split(',');
        args.data = {
            key: str[0]
        };
    }
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function closeDialogue(param) {
    
    var args = {
        page: param.page

    };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function successSave(response, param) {
    processRetrieve({});
    var args = {
        ID: gw_com_api.v_Stream.msg_selectedModel
    };
    gw_com_module.streamInterface(args);
}
//----------
function informResult(param) {

    var model_id = "";
    var ids = gw_com_api.getSelectedRow("grdData_현황", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([
            { text: "선택된 대상이 없습니다." }
        ]);
        return false;
    }
    var rows = [];
    $.each(ids, function () {
        rows.push({
            crud: "U",
            column: [
                { name: "model_id", value: gw_com_api.getValue("grdData_현황", this, "model_id", true) },
                { name: "plan_yn", value: "1" }
            ]
        });
    });
    var args = {
        url: "COM",
        nomessage:true,
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: $("#grdData_현황_data").attr("query"),
                row: rows
            }
        ]
    };
    args.handler = { success: successSave };
    gw_com_module.objSave(args);



}
//----------
//function setOption(param) {

//    // 장비군 설정
//    if (v_global.data.cur_dept_area != "undefined") {
//        var optDeptArea;
//        if (v_global.data.cur_dept_area == null) optDeptArea = v_global.data.my_dept_area;
//        else optDeptArea = v_global.data.cur_dept_area;

//        if (optDeptArea == "CM") optDeptArea = "FPD";

//        gw_com_api.setValue("frmOption", 1, "dept_area", optDeptArea);
//    }

//    if (v_global.data.eccb_no != "undefined") {
//        gw_com_api.setValue("frmOption", 1, "dept_area", v_global.data.eccb_no);
//    }
    
//    return false;
//}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                //var retrieve = true;
                if (param.data != undefined) {
                    v_global.data = param.data;
                    //retrieve = setOption({});
                    gw_com_api.setValue("frmOption", 1, "dept_area", param.data.biz_dept);
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                processRetrieve({});
            }
            break;
        //case gw_com_api.v_Stream.msg_showMessage:
        //    {
        //        gw_com_module.streamInterface(param);
        //    }
        //    break;
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
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//