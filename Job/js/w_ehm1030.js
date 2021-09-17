
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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

        // Get Page Parameters
        v_global.logic.edit = gw_com_api.getPageParameter("DATA_TYPE");

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA_IN", query: "dddw_deptarea_in",
                    param: [{ argument: "arg_type", value: "IN" }]
                },
                { type: "PAGE", name: "고객사", query: "dddw_cust" },
                {
                    type: "PAGE", name: "LINE", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "IEHM02" }]
                },
                { type: "PAGE", name: "PROCESS", query: "dddw_custproc" },
                { type: "PAGE", name: "제품유형", query: "dddw_prodtype_eccb" },
                {
                    type: "PAGE", name: "SW", query: "dddw_zcoded",
                    param: [{ argument: "arg_hcode", value: "IEHM09" }]
                },
                {
                    type: "PAGE", name: "변경구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "IEHM14" }]
                },
                {
                    type: "INLINE", name: "챔버구성",
                    data: [
                        { title: "SINGLE", value: "SINGLE" },
                        { title: "TWIN", value: "TWIN" },
                        { title: "PM", value: "PM" },
                        { title: "2PM", value: "2PM" },
                        { title: "5PM", value: "5PM" },
                        { title: "TM", value: "TM" },
                        { title: "TM+2LL", value: "TM+2LL" },
                        { title: "TM+LL", value: "TM+LL" },
                        { title: "ETC", value: "ETC" }
                    ]
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
                { name: "조회", value: "조회", act: true },
                { name: "저장", value: "저장" },
                { name: "삭제", value: "삭제" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, border: false, show: true, align: "left",
            editable: { bind: "open", focus: "prod_sno", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "prod_sno", label: { title: "제품KEY :" },
                                editable: { type: "text", size: 12, maxlength: 20 }
                            },
                            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        createDW({ update: false, edit: false });
        //=====================================================================================
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
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_삭제(ui) {

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave();

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable();

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function itemchanged_frmData_상세(ui) {

            switch (ui.element) {
                case "change_tp":
                    {
                        gw_com_api.setValue(ui.object, ui.row, "change_ymd", gw_com_api.getDate(""));
                    }
                    break;
            }

        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);
        //----------
        v_global.logic.key = null;

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function processItemchanged(param) {

    switch (param.element) {
        case "change_tp":
            {
                gw_com_api.setValue(param.object, param.row, "change_ymd", gw_com_api.getDate(""));
            }
            break;
    }

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_상세");

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            }
        ]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({});
        return false;
    }

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "prod_sno", argument: "arg_prod_sno" }
            ],
            remark: [
                { element: [{ name: "prod_sno"}] }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_상세" }
        ],
        key: param.key
    };
    if (param.mod) {
        args.handler = {
            complete: processRetrieveEnd,
            param: param
        }
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd() {

    //document.getElementById('frmData_상세_prod_sno').disabled = true;

}
//----------
function processInsert(param) {

    var args = {
        targetid: "frmData_상세",
        data: [
            { name: "change_tp", value: "10" },
            { name: "change_ymd", value: gw_com_api.getDate("") }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "FORM",
                id: "frmData_상세",
                key: {
                    element: [
                        { name: "prod_key" }
                    ]
                }
            }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_상세"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    processClear({});

    if (v_global.logic.key != null) {
        var args = {
            ID: gw_com_api.v_Stream.msg_retrieve,
            data: {
                key: v_global.logic.key
            }
        };
        gw_com_module.streamInterface(args);
    }
    v_global.logic.key = null;
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}
//----------
function successSave(response, param) {

    v_global.logic.key = response;

    processRetrieve({});
}
//----------
function successRemove(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_remove
    };
    gw_com_module.streamInterface(args);

    processClose({});

}
//----------
function createDW(param) {

    var args = {
        targetid: "frmData_상세", query: "w_ehm1030_M_1", type: "TABLE", title: "AS장비관리",
        show: true, selectable: true,
        content: {
            width: { label: 100, field: 240 },
            height: 25,
            row: [
                {
                    element: [
                        { header: true, value: "장비군", format: { type: "label" } },
                        {
                            name: "dept_area", //style: { colspan: 3 },
                            editable: {
                                type: "select", //width: 150,
                                data: { memory: "DEPT_AREA_IN" },
                                change: [{ name: "prod_type", memory: "제품유형", key: ["dept_area"] }],
                                validate: { rule: "required", message: "장비군" }
                            }
                        },
                        { header: true, value: "고객사", format: { type: "label" } },
                        {
                            name: "cust_cd",
                            editable: {
                                type: "select",
                                data: { memory: "고객사" },
                                change: [{ name: "cust_dept", memory: "LINE", key: ["cust_cd"] }],
                                validate: { rule: "required", message: "고객사" }
                            }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "Line", format: { type: "label" } },
                        { name: "cust_dept", editable: { type: "select", data: { memory: "LINE", key: ["cust_cd"] } } },
                        { header: true, value: "Process", format: { type: "label" } },
                        { name: "cust_proc", editable: { type: "select", data: { memory: "PROCESS" } } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "고객설비명", format: { type: "label" } },
                        { name: "cust_prod_nm", editable: { type: "text", maxlength: 20, validate: { rule: "required", message: "고객설비명" } } },
                        { header: true, value: "제품유형", format: { type: "label" } },
                        {
                            name: "prod_type",
                            editable: {
                                type: "select", data: { memory: "제품유형", key: ["dept_area"] },
                                validate: { rule: "required", message: "제품유형" }
                            }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "Project No.", format: { type: "label" } },
                        {
                            name: "proj_no",
                            editable: {
                                type: "text", maxlength: 20,
                                validate: { rule: "required", message: "Project No." }
                            }
                        },
                        { header: true, value: "제품코드", format: { type: "label" } },
                        {
                            name: "prod_cd",
                            editable: {
                                type: "text", maxlength: 20,
                                validate: { rule: "required", message: "제품코드" }
                            }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "제품명", format: { type: "label" } },
                        { name: "prod_nm", editable: { type: "text", maxlength: 50 } },
                        { header: true, value: "호기", format: { type: "label" } },
                        { name: "prod_seq", editable: { type: "text", maxlength: 20 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "제품규격", format: { type: "label" } },
                        { name: "prod_spec", editable: { type: "text" } },
                        { header: true, value: "Serial No.", format: { type: "label" } },
                        {
                            name: "prod_sno",
                            editable: {
                                type: (param.update ? "hidden" : "text"), maxlength: 20,
                                validate: { rule: "required", message: "Serial No." }
                            }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "챔버구성", format: { type: "label" } },
                        { name: "prod_subtp", editable: { type: "select", data: { memory: "챔버구성" } } },
                        { header: true, value: "PM수", format: { type: "label" } },
                        { name: "prod_subqty", editable: { type: "text", size: 6, maxlength: 4 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "S/W Ver.", format: { type: "label" } },
                        { name: "sw_version", editable: { type: "select", data: { memory: "SW" } } },
                        { header: true, value: "납품일자", format: { type: "label" } },
                        { name: "dlv_ymd", mask: "date-ymd", editable: { type: "text", size: 12, maxlength: 10 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "보증기간(개월)", format: { type: "label" } },
                        { name: "wrnt_term", editable: { type: "text", size: 6, maxlength: 4 } },
                        { header: true, value: "보증만료일자", format: { type: "label" } },
                        { name: "wrnt_ymd", mask: "date-ymd", editable: { type: "text", size: 12, maxlength: 10 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "IPS 품번", format: { type: "label" } },
                        { name: "prod_gno", editable: { type: "text", maxlength: 20 } },
                        { header: true, value: "Setup완료일", format: { type: "label" } },
                        { name: "setup_ymd", mask: "date-ymd", editable: { type: "text", size: 12, maxlength: 10 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: " ", format: { type: "label" } },
                        { name: "" },
                        { header: true, value: "SAT확정일자", format: { type: "label" } },
                        { name: "sat_ymd", mask: "date-ymd", editable: { type: "text", size: 12, maxlength: 10 } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "변경구분", format: { type: "label" } },
                        {
                            name: "change_tp",
                            editable: {
                                type: "select", data: { memory: "변경구분" },
                                validate: { rule: "required", message: "변경구분" }
                            }
                        },
                        { header: true, value: "변경일자", format: { type: "label" } },
                        {
                            name: "change_ymd", mask: "date-ymd",
                            editable: {
                                type: "text", size: 12, maxlength: 10,
                                validate: { rule: "required", message: "변경일자" }
                            }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "비고", format: { type: "label" } },
                        {
                            name: "prod_rmk", style: { colspan: 3 },
                            format: { type: "textarea", rows: 4, width: 582 },
                            editable: { type: "textarea", rows: 4, width: 580 }
                        },
                        { name: "prod_key", hidden: true }
                    ]
                }
            ]
        }
    };
    //----------
    if (param.edit)
        args.editable = { bind: "select", validate: true };

    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_상세", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = { targetid: "frmData_상세", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //=====================================================================================
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_editASEquipment:
            {
                if (param.data != undefined) {
                    // 수정 및 상세조회
                    gw_com_api.show("lyrMenu", "삭제");
                    gw_com_api.setValue("frmOption", 1, "prod_sno", param.data.prod_sno);

                    // 영업 메뉴에서만 수정 가능 적용 2020.07.01 by JJJ from 김혁
                    if ( (param.data.edit != undefined && param.data.edit == "0")
                        || v_global.logic.edit == "0") {
                        gw_com_api.hide("lyrMenu", "삭제");
                        gw_com_api.hide("lyrMenu", "저장");
                        createDW({ update: false, edit: false });
                    }
                    else {
                        createDW({ update: true, edit: true });
                    }

                    processRetrieve({ mod: true });
                }
                else {
                    // 신규 추가
                    createDW({ update: false, edit: true });
                    gw_com_api.hide("lyrMenu", "삭제");
                    gw_com_api.setValue("frmOption", 1, "prod_sno", "");

                    processInsert({});
                    document.getElementById('frmData_상세_prod_sno').disabled = false;
                    document.getElementById('frmData_상세_prod_sno').value = "";
                }
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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
