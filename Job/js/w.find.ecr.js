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
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        var args = {
            request: [
                {
                    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ECCB03" }]
                },
				{
				    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM25" }]
				},
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				},
                { type: "PAGE", name: "부서", query: "dddw_dept" }
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
                { name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_1", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                              {
                                  name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 10 }
                              },
                              {
                                  name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                  editable: { type: "text", size: 7, maxlength: 10 }
                              },
                              {
                                  name: "ecr_no", label: { title: "ECR No. :" },
                                  editable: { type: "text", size: 15, maxlength: 20 }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "ecr_title", label: { title: "제안명 :" },
                                  editable: { type: "text", size: 20, maxlength: 50 }
                              },
                              {
                                  name: "prod_type", label: { title: "제품유형 :" },
                                  editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "pstat", label: { title: "진행상태 :" }, style: { colfloat: "floating" },
                                  editable: { type: "select", data: { memory: "진행상태", unshift: [{ title: "전체", value: "%" }] } }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "dept_area", label: { title: "장비군 :" }, style: { colfloat: "floating" },
                                  format: { type: "select", data: { memory: "DEPT_AREA_FIND" } },
                                  editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                              },
                              {
                                  name: "ecr_dept", label: { title: "작성부서 :" },
                                  editable: { type: "select", data: { memory: "부서", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "ecr_emp", label: { title: "작성자 :" }, style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              {
                                  name: "act_emp", label: { title: "담당자 :" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              { name: "cip_yn", hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                              { name: "실행", value: "실행", act: true, format: { type: "button" } },
                              { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_2", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                              {
                                  name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 10 }
                              },
                              {
                                  name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                  editable: { type: "text", size: 7, maxlength: 10 }
                              },
                              {
                                  name: "ecr_no", label: { title: "ECR No. :" },
                                  editable: { type: "text", size: 15, maxlength: 20 }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "ecr_title", label: { title: "제안명 :" },
                                  editable: { type: "text", size: 27, maxlength: 50 }
                              },
                              {
                                  name: "prod_type", label: { title: "제품유형 :" },
                                  editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              { name: "pstat", hidden: true }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "dept_area", label: { title: "장비군 :" }, style: { colfloat: "floating" },
                                  format: { type: "select", data: { memory: "DEPT_AREA_FIND" } },
                                  editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                              },
                              {
                                  name: "ecr_dept", label: { title: "작성부서 :" },
                                  editable: { type: "select", data: { memory: "부서", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "ecr_emp", label: { title: "작성자 :" }, style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              {
                                  name: "act_emp", label: { title: "담당자 :" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              { name: "cip_yn", hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                              { name: "실행", value: "실행", act: true, format: { type: "button" } },
                              { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_현황", query: "w_find_ecr_M_2", title: "ECR 현황",
            height: 300, show: true, key: true,
            element: [
                { header: "ECR No.", name: "ecr_no", width: 90, align: "center" },
                { header: "제품유형", name: "prod_type", width: 80, align: "left" },
                { header: "담당자", name: "act_emp_nm", width: 60, align: "center" },
                { header: "개선제안명", name: "ecr_title", width: 300, align: "left" },
                { header: "ECR구분", name: "ecr_tp_nm", width: 60, align: "center" },
                { header: "Level", name: "crm_tp_nm", width: 60, align: "center" },
                { header: "조치요구시점", name: "act_time_text", width: 100, align: "center" },
                { header: "CRM부서", name: "rqst_dept_nm", width: 80, align: "center" },
                { header: "적용영역", name: "act_region", width: 150, align: "center" },
                { header: "적용모듈", name: "act_module", width: 150, align: "center" },
                { header: "MP분류", name: "mp_class", width: 150, align: "center" },
                { header: "작성일자", name: "ecr_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "작성부서", name: "ecr_dept_nm", width: 70, align: "center" },
                { header: "작성자", name: "ecr_emp_nm", width: 70, align: "center" },
                { header: "승인상태", name: "gw_astat_nm", width: 80, align: "center", hidden: true },
                { header: "승인자", name: "gw_aemp", width: 70, align: "center", hidden: true },
                { header: "승인일시", name: "gw_adate", width: 160, align: "center", hidden: true },
                { name: "ecr_desc", hidden: true },
                { name: "rqst_dept", hidden: true },
                { name: "act_time", hidden: true },
                { name: "act_time_sel", hidden: true },
                { name: "act_time_etc", hidden: true },
                { name: "act_region1", hidden: true },
                { name: "act_region2", hidden: true },
                { name: "act_region3", hidden: true },
                { name: "act_module1", hidden: true },
                { name: "act_module2", hidden: true },
                { name: "act_module3", hidden: true },
                { name: "act_module1_sel", hidden: true },
                { name: "act_module2_sel", hidden: true },
                { name: "act_module3_sel", hidden: true },
                { name: "act_module1_etc", hidden: true },
                { name: "act_module2_etc", hidden: true },
                { name: "act_module3_etc", hidden: true },
                { name: "mp_class1", hidden: true },
                { name: "mp_class2", hidden: true },
                { name: "mp_class3", hidden: true },
                { name: "mp_class1_sel", hidden: true },
                { name: "mp_class2_sel", hidden: true },
                { name: "mp_class3_sel", hidden: true },
                { name: "mp_class1_etc", hidden: true },
                { name: "mp_class2_etc", hidden: true },
                { name: "mp_class3_etc", hidden: true },
                { name: "act_effect_text", hidden: true },
                { name: "dept_area", hidden: true },
                { name: "dept_area_nm", hidden: true },
                { name: "crm_no", hidden: true },
                { name: "eccb_no", hidden: true },
                { name: "item_seq", hidden: true }
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
        //=====================================================================================
        //----------
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
        var args = {
            targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_1",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_2",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowdblclick",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_현황",
            grid: true,
            event: "rowkeyenter",
            handler: rowdblclick_grdData_현황
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
                    {
                        id: getOption({}),
                        focus: true
                    }
                ]
            };
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
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowdblclick_grdData_현황(ui) {

            informResult({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption_2", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption_2", 1, "ymd_to", gw_com_api.getDate(""));

        //----------
        gw_com_module.startPage();
        //----------
        var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        gw_com_module.streamInterface(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function getOption(param) {

    switch (v_global.data.type) {
        case "confirm":
        case "cip":
            return "frmOption_2";
        default:
            return "frmOption_1";
    }

}
//----------
function setOption(param) {

    // 장비군 설정
    if (v_global.data.cur_dept_area != "undefined") {
        var optDeptArea;
        if (v_global.data.cur_dept_area == null) optDeptArea = v_global.data.my_dept_area;
        else optDeptArea = v_global.data.cur_dept_area;

        if (optDeptArea == "CM") optDeptArea = "DP";

        gw_com_api.setValue("frmOption_1", 1, "dept_area", optDeptArea);
        gw_com_api.setValue("frmOption_2", 1, "dept_area", optDeptArea);
    }

//    crtOption({ DeptArea: optDeptArea });
//    gw_com_api.setValue("frmOption_1", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
//    gw_com_api.setValue("frmOption_1", 1, "ymd_to", gw_com_api.getDate(""));
//    gw_com_api.setValue("frmOption_2", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
//    gw_com_api.setValue("frmOption_2", 1, "ymd_to", gw_com_api.getDate(""));
                
    switch (v_global.data.type) {
        case "confirm":
            {
                gw_com_api.hide("frmOption_1");
                gw_com_api.show("frmOption_2");
                gw_com_api.setValue("frmOption_2", 1, "pstat", "접수");
                return true;
            }
            break;
        case "cip":
            {
                gw_com_api.hide("frmOption_1");
                gw_com_api.hide("frmOption_2");
                gw_com_api.setValue("frmOption_2", 1, "pstat", "CIP");
                gw_com_api.setValue("frmOption_2", 1, "cip_yn", "#");
                return true;
            }
            break;
        default:
            {
                gw_com_api.hide("frmOption_2");
                gw_com_api.show("frmOption_1");
            }
            break;
    }


    return false;

}
//----------
function processRetrieve(param) {

    var args = {
        target: [ { type: "FORM", id: getOption({}) } ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    
    var args = {
        source: { type: "FORM", id: getOption({}), hide: true,
            element: [
				{ name: "ymd_fr", argument: "arg_ymd_fr" },
				{ name: "ymd_to", argument: "arg_ymd_to" },
				{ name: "ecr_title", argument: "arg_ecr_title" },
				{ name: "dept_area", argument: "arg_dept_area" },
				{ name: "ecr_dept", argument: "arg_ecr_dept" },
				{ name: "ecr_no", argument: "arg_ecr_no" },
				{ name: "ecr_emp", argument: "arg_ecr_emp" },
				{ name: "act_emp", argument: "arg_act_emp" },
				{ name: "prod_type", argument: "arg_prod_type" },
				{ name: "cip_yn", argument: "arg_cip_yn" },
				{ name: "pstat", argument: "arg_pstat" }
            ],
            argument:[
                { name: "arg_eccb_tp", value: v_global.data.eccb_tp }
            ],
            remark: [
	            { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" } ] },
	            { element: [{ name: "dept_area"}] },
		        { element: [{ name: "ecr_title"}] },
		        { element: [{ name: "ecr_no"}] },
		        { element: [{ name: "ecr_dept"}] },
		        { element: [{ name: "ecr_emp"}] },
		        { element: [{ name: "act_emp" }] },
		        { element: [{ name: "prod_type"}] },
                { element: [{ name: "pstat" } ] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdData_현황", select: true, focus: true }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption_1");
    gw_com_api.hide("frmOption_2");

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
function informResult(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_selectedECR
    };
    switch (v_global.data.type) {
        case "copy":
            {
                args.data = {
                    ecr_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_no"),
                    ecr_title: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_title"),
                    ecr_desc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_desc"),
                    rqst_dept: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "rqst_dept"),
                    act_time: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_time"),
                    act_time_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_time_sel"),
                    act_time_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_time_etc"),
                    act_region1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region1"),
                    act_region2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region2"),
                    act_region3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region3"),
                    act_module1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1"),
                    act_module2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2"),
                    act_module3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3"),
                    act_module1_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1_sel"),
                    act_module2_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2_sel"),
                    act_module3_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3_sel"),
                    act_module2_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2_etc"),
                    act_module1_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1_etc"),
                    act_module3_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3_etc"),
                    mp_class1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1"),
                    mp_class2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2"),
                    mp_class3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3"),
                    mp_class1_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1_sel"),
                    mp_class2_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2_sel"),
                    mp_class3_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3_sel"),
                    mp_class2_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2_etc"),
                    mp_class1_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1_etc"),
                    mp_class3_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3_etc"),
                    act_effect: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_effect_text")
                };
            }
            break;
        case "confirm":
            {
                args.data = {
                    crm_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "crm_no"),
                    ecr_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_no")
                };
            }
            break;
        case "cip":
            {
                args.data = {
                    ecr_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_no"),
                    ecr_title: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_title"),
                    ecr_desc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_desc"),
                    dept_area: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "dept_area"),
                    dept_area_nm: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "dept_area_nm"),
                    act_region1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region1"),
                    act_region2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region2"),
                    act_region3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_region3"),
                    act_module1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1"),
                    act_module2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2"),
                    act_module3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3"),
                    act_module1_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1_sel"),
                    act_module2_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2_sel"),
                    act_module3_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3_sel"),
                    act_module2_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module2_etc"),
                    act_module1_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module1_etc"),
                    act_module3_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_module3_etc"),
                    mp_class1: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1"),
                    mp_class2: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2"),
                    mp_class3: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3"),
                    mp_class1_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1_sel"),
                    mp_class2_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2_sel"),
                    mp_class3_sel: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3_sel"),
                    mp_class2_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class2_etc"),
                    mp_class1_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class1_etc"),
                    mp_class3_etc: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "mp_class3_etc"),
                    act_time_text: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "act_time_text"),
                    ecr_tp_nm: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "ecr_tp_nm"),
                    crm_tp_nm: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "crm_tp_nm"),
                    root_no: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "eccb_no"),
                    root_seq: gw_com_api.getCellValue("GRID", "grdData_현황", "selected", "item_seq")
                };
            }
            break;
        default:
            return;
    }
    gw_com_module.streamInterface(args);

}
//----------
function crtOption(param) {

    var args = {
        targetid: "frmOption_1", type: "FREE", title: "조회 조건",
        trans: true, border: true, show: true, remark: "lyrRemark",
        editable: { bind: "open", focus: "ymd_fr", validate: true },
        content: {
            row: [
                    {
                        element: [
                              {
                                  name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                  editable: { type: "text", size: 10, maxlength: 10 }
                              },
                              {
                                  name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                  editable: { type: "text", size: 10, maxlength: 10 }
                              },
                              {
                                  name: "ecr_no", label: { title: "ECR No. :" },
                                  editable: { type: "text", size: 20, maxlength: 20 }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "ecr_title", label: { title: "제안명 :" },
                                  editable: { type: "text", size: 20, maxlength: 50 }
                              },
                              {
                                  name: "prod_type", label: { title: "제품유형 :" },
                                  editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "pstat", label: { title: "진행상태 :" }, style: { colfloat: "floating" },
                                  editable: { type: "select", data: { memory: "진행상태", unshift: [{ title: "전체", value: "%" }] } }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "dept_area", label: { title: "장비군 :" }, style: { colfloat: "floating" },
                                  format: { type: "select", data: { memory: "DEPT_AREA_FIND" } }, value: param.DeptArea,
                                  editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                              },
                              {
                                  name: "ecr_dept", label: { title: "작성부서 :" },
                                  editable: { type: "select", data: { memory: "부서", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "ecr_emp", label: { title: "작성자 :" }, style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              {
                                  name: "act_emp", label: { title: "담당자 :" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              { name: "cip_yn", hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
                        ]
                    }
            ]
        }
    };
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        targetid: "frmOption_2", type: "FREE", title: "조회 조건",
        trans: true, border: true, show: true, remark: "lyrRemark",
        editable: { bind: "open", focus: "ymd_fr", validate: true },
        content: {
            row: [
                    {
                        element: [
                              {
                                  name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                  editable: { type: "text", size: 10, maxlength: 10 }
                              },
                              {
                                  name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                  editable: { type: "text", size: 10, maxlength: 10 }
                              },
                              {
                                  name: "ecr_no", label: { title: "ECR No. :" },
                                  editable: { type: "text", size: 20, maxlength: 20 }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "ecr_title", label: { title: "제안명 :" },
                                  editable: { type: "text", size: 27, maxlength: 50 }
                              },
                              {
                                  name: "prod_type", label: { title: "제품유형 :" },
                                  editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              { name: "pstat", hidden: true }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "dept_area", label: { title: "장비군 :" }, style: { colfloat: "floating" },
                                  format: { type: "select", data: { memory: "DEPT_AREA_FIND" } }, value: param.DeptArea,
                                  editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                              },
                              {
                                  name: "ecr_dept", label: { title: "작성부서 :" },
                                  editable: { type: "select", data: { memory: "부서", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "ecr_emp", label: { title: "작성자 :" }, style: { colfloat: "floating" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              {
                                  name: "act_emp", label: { title: "담당자 :" },
                                  editable: { type: "text", size: 7, maxlength: 20 }
                              },
                              { name: "cip_yn", hidden: true }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", act: true, format: { type: "button", icon: "닫기" } }
                        ]
                    }
            ]
        }
    };
    //----------
    gw_com_module.formCreate(args);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_selectECR:
            {
                var retrieve = true;
                if (param.data != undefined) {
                    v_global.data = param.data;
                    retrieve = setOption({});
                }
                else if (!v_global.process.init) {
                    v_global.process.init = true;
                    //retrieve = true;
                }
                if (retrieve)
                    processRetrieve({});
                else
                    gw_com_api.setFocus(getOption({}), 1, "ymd_fr");


                //gw_com_api.setValue("frmOption_1", 1, "dept_area", "SOLAR");
            }
            break;
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
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//