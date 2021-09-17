
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "진행상태", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECCB03" }]
                },
                {
                    type: "PAGE", name: "ECCB13", query: "dddw_zcode",
                    param: [ { argument: "arg_hcode", value: "ECCB13" } ]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                { type: "PAGE", name: "부서", query: "DDDW_DEPT" },
                {
                    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
                },
                {
                    type: "PAGE", name: "분류1", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECCB05" }]
                },
                {
                    type: "PAGE", name: "분류2", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECCB06" }]
                },
                {
                    type: "PAGE", name: "분류3", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ECCB07" }]
                }
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
                { name: "새로고침", value: "새로고침", icon: "조회" },
				{ name: "조회", value: "조회", act: true },
                { name: "ECR", value: "ECR 수정", icon: "추가" },
                { name: "ECCB", value: "E(S)CCB 심의수정", icon: "추가" },
                { name: "CIP", value: "CIP 수정", icon: "추가" },
                { name: "ECO", value: "ECO 수정", icon: "추가" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                style: { colfloat: "floating" },
                                name: "ymd_fr", label: { title: "작성일자 :" },
                                mask: "date-ymd", editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ecr_no", label: { title: "ECR No. :" },
                                editable: { type: "text", size: 12 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "ecr_title", label: { title: "개선제안명 :" },
                                editable: { type: "text", size: 27, maxlength: 50 }
                            },
                            {
                                name: "crm_tp", label: { title: "Level :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "ECCB13", unshift: [{ title: "전체", value: "%" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            },
                            {
                                name: "ecr_dept", label: { title: "작성부서 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "부서", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "ecr_emp", label: { title: "작성자 :" },
                                editable: { type: "text", size: 7, maxlength: 20 }
                            },
                            {
                                name: "act_emp", label: { title: "담당자 :" },
                                editable: { type: "text", size: 7, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                style: { colfloat: "floating" }, name: "act_region",
                                label: { title: "분류 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "분류1", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "act_module",
                                editable: {
                                    type: "select",
                                    data: { memory: "분류2", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            {
                                name: "mp_class",
                                editable: {
                                    type: "select",
                                    data: { memory: "분류3", unshift: [{ title: "전체", value: "%" }] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "prod_type", label: { title: "제품유형 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] }
                                }
                            },
                            { name: "pstat", hidden: true }
                            //{
                            //    style: { colfloat: "floating" }, name: "pstat", label: { title: "진행상태 :" },
                            //    editable: {
                            //        type: "select",
                            //        data: { memory: "진행상태", unshift: [{ title: "전체", value: "%" }] }
                            //    }
                            //}
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
            targetid: "grdData_현황", query: "ECCB_5210_M_1", title: "ECCB 진행 현황",
            height: 442, show: true, selectable: true, key: true, dynamic: true,
            element: [
                { header: "ECR No.", name: "ecr_no", width: 90, align: "center", style: { bgcolor: "#E7FAE7" } },
                { header: "제안명", name: "ecr_title", width: 350, align: "left" },
                { header: "Level", name: "crm_tp_nm", width: 40, align: "center" },
                { header: "ECR구분", name: "ecr_tp_nm", width: 60, align: "center" },
                //{ header: "제안개요", name: "ecr_desc", width: 300, align: "left" },
                { header: "작성일자", name: "ecr_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "작성부서", name: "ecr_dept", width: 80, align: "center" },
                { header: "작성자", name: "ecr_emp", width: 70, align: "center" },
                { header: "관련근거", name: "issue_no", width: 90, align: "center" },
                { header: "회사명", name: "comp_nm", width: 120 },
                { header: "제품유형", name: "prod_type", width: 100, align: "center" },
                { header: "적용영역", name: "act_region", width: 150, align: "center" },
                { header: "적용모듈", name: "act_module", width: 150, align: "center" },
                { header: "MP분류", name: "mp_class", width: 150, align: "center" },
                { header: "CRM부서", name: "rqst_dept", width: 80, align: "center" },
                //{ header: "적용JOB", name: "act_job", width: 300, align: "left" },
                //{ header: "도면조치", name: "dwg_proc", width: 150, align: "center" },
                { header: "진행상태", name: "ecr_pstat", width: 90, align: "center" },
                { header: "완료요구일", name: "act_rqst_date", width: 90, align: "center", mask: "date-ymd" },
                { header: "심의 No.", name: "eccb_no", width: 90, align: "center", style: { bgcolor: "#FAFABA" } },
                { header: "심의일자", name: "eccb_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "심의결과", name: "eccb_result", width: 60, align: "center" },
                { header: "실행부서", name: "act_dept", width: 80, align: "center" },
                { header: "담당자", name: "act_emp", width: 70, align: "center" },
                { header: "CIP No.", name: "cip_no", width: 90, align: "center", style: { bgcolor: "#EFEFFA" } },
                { header: "수행기간", name: "cip_period", width: 150, align: "center" },
                { header: "ECO No.", name: "eco_no", width: 90, align: "center", style: { bgcolor: "#FAE7E7" } },
                { header: "수행기간", name: "eco_period", width: 150, align: "center" },
                //{ header: "1차점수", name: "evl1_point", width: 60, align: "right" },
                { header: "1차등급", name: "evl1_grade", width: 60, align: "right" },
                //{ header: "2차점수", name: "evl2_point", width: 60, align: "right" },
                { header: "2차등급", name: "evl2_grade", width: 60, align: "right" },
                { header: "기여율", name: "evl_ratio", width: 150, align: "center" },
                { name: "eccb_seq", hidden: true }
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
        //====================================================================================
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "새로고침", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "ECR", event: "click", handler: click_lyrMenu_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "ECCB", event: "click", handler: click_lyrMenu_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "CIP", event: "click", handler: click_lyrMenu_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "ECO", event: "click", handler: click_lyrMenu_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);

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
        function click_lyrMenu_수정(ui) {

            processLink(ui);

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowdblclick_grdData_현황(ui) {

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = ui.element;
            var args = {
                type: "PAGE",
                width: 1100,
                height: 500,
                scroll: true,
                control: true,
                open: true
            };
            switch (ui.element) {
                case "ecr_no":
                case "cip_no":
                case "eco_no":
                    {
                        var ecr_no = gw_com_api.getValue(ui.object, ui.row, "ecr_no", true);
                        var cip_no = gw_com_api.getValue(ui.object, ui.row, "cip_no", true);
                        var eco_no = gw_com_api.getValue(ui.object, ui.row, "eco_no", true);
                        var tab = ui.element == "cip_no" ? "CIP" : ui.element == "eco_no" ? "ECO" : "ECR";
                        var url = "w_link_eccb_item.aspx?ecr_no=" + ecr_no + "&cip_no=" + cip_no + "&eco_no=" + eco_no + "&tab=" + tab;
                        var win = window.open(url, "link_eccb_item", "").focus();
                    }
                    break;
                case "eccb_no":
                    {
                        args.page = "INFO_ECCB";
                        args.title = "심의 내역";
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "INFO_ECCB",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_infoECCB,
                                    data: {
                                        eccb_no: gw_com_api.getValue("grdData_현황", "selected", "eccb_no", true),
                                        item_seq: gw_com_api.getValue("grdData_현황", "selected", "eccb_seq", true)
                                    }
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                //case "ecr_no":
                //    {
                //        args.page = "INFO_ECR";
                //        args.title = "ECR 내역";
                //        if (gw_com_module.dialoguePrepare(args) == false) {
                //            var args = {
                //                page: "INFO_ECR",
                //                param: {
                //                    ID: gw_com_api.v_Stream.msg_infoECR,
                //                    data: {
                //                        ecr_no: gw_com_api.getValue("grdData_현황", "selected", "ecr_no", true)
                //                    }
                //                }
                //            };
                //            gw_com_module.dialogueOpen(args);
                //        }
                //    }
                //    break;
                //case "cip_no":
                //    {
                //        args.page = "INFO_CIP";
                //        args.title = "CIP 내역";
                //        if (gw_com_module.dialoguePrepare(args) == false) {
                //            var args = {
                //                page: "INFO_CIP",
                //                param: {
                //                    ID: gw_com_api.v_Stream.msg_infoCIP,
                //                    data: {
                //                        cip_no: gw_com_api.getValue("grdData_현황", "selected", "cip_no", true)
                //                    }
                //                }
                //            };
                //            gw_com_module.dialogueOpen(args);
                //        }
                //        return;
                //    }
                //    break;
                //case "eco_no":
                //    {
                //        args.page = "INFO_ECO";
                //        args.title = "ECO 내역";
                //        if (gw_com_module.dialoguePrepare(args) == false) {
                //            var args = {
                //                page: "INFO_ECO",
                //                param: {
                //                    ID: gw_com_api.v_Stream.msg_infoECO,
                //                    data: {
                //                        eco_no: gw_com_api.getValue("grdData_현황", "selected", "eco_no", true)
                //                    }
                //                }
                //            };
                //            gw_com_module.dialogueOpen(args);
                //        }
                //    }
                //    break;
                default:
                    {
                        return false;
                    }
                    break;
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA );
        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processRetrieve(param) {

    var args = {
        target: [
	        {
	            type: "FORM",
	            id: "frmOption"
	        }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "crm_tp", argument: "arg_crm_tp" },
                { name: "ecr_no", argument: "arg_ecr_no" },
                { name: "ecr_title", argument: "arg_ecr_title" },
                { name: "ecr_dept", argument: "arg_ecr_dept" },
                { name: "ecr_emp", argument: "arg_ecr_emp" },
                { name: "act_emp", argument: "arg_act_emp" },
                { name: "prod_type", argument: "arg_prod_type" },
                { name: "act_region", argument: "arg_act_region" },
                { name: "act_module", argument: "arg_act_module" },
                { name: "mp_class", argument: "arg_mp_class" },
                { name: "pstat", argument: "arg_pstat" },
                { name: "dept_area", argument: "arg_dept_area" }
            ],
            argument: [
                { name:"arg_eccb_tp", value:"%" }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "ecr_no" }] },
                //{ element: [{ name: "ecr_title" }] },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "ecr_dept" }] },
                { element: [{ name: "ecr_emp" }] },
                { element: [{ name: "act_emp" }] },
                { element: [{ name: "prod_type" }] },
                { element: [{ name: "act_region" }] },
                { element: [{ name: "act_module" }] },
                { element: [{ name: "mp_class" }] }//,
                //{ element: [{ name: "pstat" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_현황", select: true, focus: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processLink(param) {
    switch (param.element) {
        case "ECR":
            {
                var ecr_no = gw_com_api.getValue("grdData_현황", "selected", "ecr_no", true)
                if (ecr_no == "" || ecr_no == null || ecr_no == undefined) {
                    gw_com_api.messageBox([{ text: "선택된 ECR 정보가 없습니다." }]);
                    return;
                }
                var args = {
                    ID: gw_com_api.v_Stream.msg_linkPage,
                    to: { type: "MAIN" },
                    data: { page: "w_eccb1010", title: "ECR 수정",
                        param: [
                            { name: "ecr_no", value: ecr_no },
                            { name: "issue_no", value: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true) }
                        ]
                    }
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case "ECCB":
            {
                var eccb_no = gw_com_api.getValue("grdData_현황", "selected", "eccb_no", true)
                if (eccb_no == "" || eccb_no == null || eccb_no == undefined) {
                    gw_com_api.messageBox([{ text: "선택된 ECCB 심의정보가 없습니다." }]);
                    return;
                }
                var args = { ID: gw_com_api.v_Stream.msg_linkPage,
                    to: { type: "MAIN" },
                    data: { page: "w_eccb2020", title: "E(S)CCB 심의수정",
                        param: [
                            { name: "eccb_no", value: eccb_no },
                            { name: "eccb_tp", value: "%" }
                        ]
                    }
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case "CIP":
            {
                var cip_no = gw_com_api.getValue("grdData_현황", "selected", "cip_no", true)
                if (cip_no == "" || cip_no == null || cip_no == undefined) {
                    gw_com_api.messageBox([{ text: "선택된 CIP 정보가 없습니다." }]);
                    return;
                }
                
                var args = { ID: gw_com_api.v_Stream.msg_linkPage,
                    to: { type: "MAIN" },
                    data: { page: "w_eccb3020", title: "CIP 수정",
                        param: [
                            { name: "cip_no", value: cip_no }
                        ]
                    }
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case "ECO":
            {
                var eco_no = gw_com_api.getValue("grdData_현황", "selected", "eco_no", true)
                if (eco_no == "" || eco_no == null || eco_no == undefined) {
                    gw_com_api.messageBox([{ text: "선택된 ECO 정보가 없습니다." }]);
                    return;
                }
                var args = { ID: gw_com_api.v_Stream.msg_linkPage, to: { type: "MAIN" },
                    data: { page: "w_eccb4010", title: "ECO 수정",
                        param: [
                            { name: "eco_no", value: eco_no }
                        ]
                    }
                };
                gw_com_module.streamInterface(args);
            }
            break;
    }
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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
                switch (param.from.page) {
                    case "INFO_ECR":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECR;
                            args.data = {
                                ecr_no: gw_com_api.getValue("grdData_현황", "selected", "ecr_no", true)
                            };
                        }
                        break;
                    case "INFO_ECCB":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECCB;
                            args.data = {
                                eccb_no: gw_com_api.getValue("grdData_현황", "selected", "eccb_no", true),
                                item_seq: gw_com_api.getValue("grdData_현황", "selected", "eccb_seq", true)
                            };
                        }
                        break;
                    case "INFO_CIP":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoCIP;
                            args.data = {
                                cip_no: gw_com_api.getValue("grdData_현황", "selected", "cip_no", true)
                            };
                        }
                        break;
                    case "INFO_ECO":
                        {
                            args.ID = gw_com_api.v_Stream.msg_infoECO;
                            args.data = {
                                eco_no: gw_com_api.getValue("grdData_현황", "selected", "eco_no", true)
                            };
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//