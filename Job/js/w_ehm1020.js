//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_job_process = {

    ready: function () {

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // Get Page Parameters
        v_global.logic.edit = gw_com_api.getPageParameter("edit");
        v_global.logic.edit = "1";
        //----------
        var args = {
            request: [
                { type: "PAGE", name: "제품유형", query: "dddw_prodtype" },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
                { type: "PAGE", name: "LINE", query: "dddw_custline"},
                { type: "INLINE", name: "Warranty",
                    data: [
                        { title: "IN", value: "IN" },
                        { title: "OUT", value: "OUT" }
                    ]
                },
                { type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH}] },
                { type: "PAGE", name: "SW", query: "dddw_zcoded",
                    param: [ { argument: "arg_hcode", value: "IEHM09" } ]
                },
                { type: "PAGE", name: "변경구분", query: "dddw_zcode",
                    param: [ { argument: "arg_hcode", value: "IEHM14" } ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        function start() {

            gw_job_process.UI();

        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {
        //=====================================================================================
        var args = {
            targetid: "lyrMenu",
            type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        if (v_global.logic.edit == "1") {
            //args.element.push({ name: "추가", value: "추가" });
            args.element.push({ name: "수정", value: "수정", icon: "추가" });
        }
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { focus: "cust_cd", validate: true },
            content: {
                row: [
                    {
                        element: [
                          {
                              name: "dept_area", label: { title: "장비군 :" },
                              editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                          },
                          {
                              name: "wrnt_io", label: { title: "Warranty :" },
                              editable: {
                                  type: "select", size: 7, maxlength: 20,
                                  data: { memory: "Warranty", unshift: [{ title: "전체", value: "" }] }
                              }
                          },
                          {
                              name: "proj_no", label: { title: "Project No :" },
                              editable: { type: "text", size: 14, maxlength: 50 }
                          }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "cust_cd", label: { title: "고객사 :" },
                                  editable: {
                                      type: "select",
                                      data: { memory: "고객사", unshift: [{ title: "전체", value: "%" }] },
                                      change: [{ name: "cust_dept", memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] }]
                                  }
                              },
                              {
                                  name: "cust_dept", label: { title: "LINE :" },
                                  editable: { type: "select", data: { memory: "LINE", unshift: [{ title: "전체", value: "%" }], key: ["cust_cd"] } }
                              },
                              {
                                  name: "cust_prod_nm", label: { title: "설비명 :" },
                                  editable: { type: "text", size: 12, maxlength: 50 }
                              }
                        ]
                    },
                    {
                        element: [
                              {
                                  name: "prod_type", label: { title: "제품유형 :" },
                                  editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "sw_version", label: { title: "S/W Ver. :" },
                                  editable: { type: "select", data: { memory: "SW", unshift: [{ title: "전체", value: "%" }] } }
                              },
                              {
                                  name: "change_tp", label: { title: "변경구분 :" },
                                  editable: { type: "select", data: { memory: "변경구분", unshift: [{ title: "전체", value: "%" }] } }
                              }
                        ]
                    },
                    {
                        align: "right", element: [
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
            targetid: "grdData_현황", query: "w_ehm1020_M_1", title: "장비 목록",
            height: 306, show: true, selectable: true, dynamic: true, number: true,
            color: { row: true },
            element: [
                { header: "고객사", name: "cust_cd", width: 80 },
                { header: "Line", name: "cust_dept", width: 80 },
                { header: "Process", name: "cust_proc", width: 100 },
                { header: "고객설비명", name: "cust_prod_nm", width: 120 },
                { header: "제품유형", name: "prod_type", width: 80 },
                { header: "Project No.", name: "proj_no", width: 80 },
                { header: "개발/양산", name: "ord_class_nm", width: 60, align: "center" },
                { header: "제품코드", name: "prod_cd", width: 80 },
                { header: "제품명", name: "prod_nm", width: 200 },
                { header: "호기", name: "prod_seq", width: 50, align: "center" },
                { header: "Serial No.", name: "prod_sno", width: 110, align: "center" },
                { header: "제품규격", name: "prod_spec", width: 100 },
                { header: "챔버구성", name: "prod_subtp", width: 60 },
                { header: "PM수", name: "prod_subqty", width: 60, align: "center" },
                { header: "S/W Ver.", name: "sw_version", width: 60, align: "center" },
                { header: "납품일자", name: "dlv_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "보증기간", name: "wrnt_term", width: 60, align: "center" },
                { header: "보증만료일", name: "wrnt_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "Setup완료일", name: "setup_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "SAT확정일", name: "sat_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "IPS 품번", name: "prod_gno", width: 80, align: "center" },
                { header: "변경구분", name: "change_tp", width: 80, align: "center" },
                { header: "변경일자", name: "change_ymd", width: 80, align: "center", mask: "date-ymd" },
                { name: "prod_key", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_이력", query: "w_ehm1020_S_1", title: "변경 이력",
            caption: true, height: 80, pager: false, show: true, selectable: true, key: true, dynamic: true, number: true,
            element: [
                { header: "고객사", name: "cust_cd", width: 80 },
                { header: "Line", name: "cust_dept", width: 80 },
                { header: "Process", name: "cust_proc", width: 100 },
                { header: "고객설비명", name: "cust_prod_nm", width: 120 },
                { header: "제품유형", name: "prod_type", width: 80 },
                { header: "제품KEY", name: "prod_key", width: 80 },
                { header: "Project No.", name: "proj_no", width: 80 },
                { header: "제품코드", name: "prod_cd", width: 80 },
                { header: "제품명", name: "prod_nm", width: 200 },
                { header: "호기", name: "prod_seq", width: 50, align: "center" },
                { header: "Serial No.", name: "prod_sno", width: 110, align: "center" },
                { header: "제품규격", name: "prod_spec", width: 100 },
                { header: "챔버구성", name: "prod_subtp", width: 60 },
                { header: "PM수", name: "prod_subqty", width: 60, align: "center" },
                { header: "S/W Ver.", name: "sw_version", width: 60, align: "center" },
                { header: "납품일자", name: "dlv_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "보증기간", name: "wrnt_term", width: 60, align: "center" },
                { header: "보증만료일", name: "wrnt_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "Setup완료일", name: "setup_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "SAT확정일", name: "sat_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "IPS 품번", name: "prod_gno", width: 80, align: "center" },
                { header: "변경구분", name: "change_tp", width: 100, align: "center" },
                { header: "변경일자", name: "change_ymd", width: 80, align: "center", mask: "date-ymd" }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_현황", offset: 8 },
                { type: "GRID", id: "grdData_이력", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: click_lyrMenu_수정 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowselected", handler: rowselected_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_현황", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_현황 };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            var args = {
                target: [
                    {
                        id: "frmOption",
                        focus: true
                    }
                ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_추가(ui) {

            closeOption({});

            v_global.event.type = "GRID";
            v_global.event.object = "grdData_현황";
            v_global.event.row = null;
            v_global.event.element = null;

            var args = {
                type: "PAGE", page: "w_ehm1030", title: "A/S 장비 관리",
                width: 750, height: 450, open: true, control: true, datatype: v_global.logic.edit
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_ehm1030",
                    param: {
                        ID: gw_com_api.v_Stream.msg_editASEquipment
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_수정(param) {

            closeOption({});

            var args = {
                object: "grdData_현황",
                type: "GRID",
                row: gw_com_api.getSelectedRow("grdData_현황"),
                element: "prod_sno"
            };
            rowdblclick_grdData_현황(args);

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
        function rowselected_grdData_현황(ui) {

            processLink({});

        };
        //----------
        function rowdblclick_grdData_현황(ui) {

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = null;
            var args = { type: "PAGE", page: "w_ehm1030", title: "A/S 장비 관리",
                width: 750, height: 450, open: true, control: true, datatype: v_global.logic.edit
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = { page: "w_ehm1030",
                    param: { ID: gw_com_api.v_Stream.msg_editASEquipment,
                        data: {
                            prod_sno: gw_com_api.getValue(ui.object, ui.row, "prod_key", (ui.type == "GRID" ? true : false))
                            , edit : v_global.logic.edit
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_api.setValue("frmOption", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA);
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
            type: "FORM",
            id: "frmOption",
            hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "wrnt_io", argument: "arg_wrnt_io" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "cust_cd", argument: "arg_cust_cd" },
                {
                    name: "cust_dept",
                    argument: "arg_cust_dept"
                },
                {
                    name: "cust_prod_nm",
                    argument: "arg_cust_prod_nm"
                },
                {
                    name: "prod_type",
                    argument: "arg_prod_type"
                },
                {
                    name: "sw_version",
                    argument: "arg_sw_version"
                },
                {
                    name: "change_tp",
                    argument: "arg_change_tp"
                }
            ],
            remark: [
                { element: [{ name: "dept_area"}] },
                { element: [{ name: "wrnt_io"}] },
                { element: [{ name: "cust_cd"}] },
                {
                    element: [{ name: "cust_dept"}]
                },
                {
                    element: [{ name: "cust_prod_nm"}]
                },
                {
                    element: [{ name: "prod_type"}]
                },
                {
                    element: [{ name: "sw_version"}]
                },
                {
                    element: [{ name: "change_tp"}]
                }
            ]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_현황",
                focus: true,
                select: true
            }
        ],
        clear: [
            {
                type: "GRID",
                id: "grdData_이력"
            }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID",
            id: "grdData_현황",
            row: "selected",
            block: true,
            element: [
                {
                    name: "prod_key",
                    argument: "arg_prod_key"
                }
            ]
        },
        target: [
            {
                type: "GRID",
                id: "grdData_이력"
            }
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
        case gw_com_api.v_Stream.msg_retrieve:
            {
                if (param.data.key != undefined) {
                    $.each(param.data.key, function () {
                        if (this.QUERY == "w_ehm1030_M_1")
                            this.QUERY = "w_ehm1020_M_1";
                    });
                }
                processRetrieve({ key: param.data.key });
            }
            break;
        case gw_com_api.v_Stream.msg_remove:
            {
                var args = {
                    targetid: "grdData_현황",
                    row: v_global.event.row
                }
                gw_com_module.gridDelete(args);
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
                    case "w_ehm1030":
                        {
                            args.ID = gw_com_api.v_Stream.msg_editASEquipment;
                            if (v_global.event.row != null)
                                args.data = {
                                    prod_sno: gw_com_api.getValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "prod_sno",
                                                (v_global.event.type == "GRID" ? true : false))
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