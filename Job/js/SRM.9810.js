//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
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
                {
                    type: "PAGE", name: "공장", query: "dddw_prodgroup"
                },
                {
				    type: "PAGE", name: "창고", query: "dddw_sl"
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
            gw_job_process.procedure();
            gw_com_module.startPage();

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
            targetid: "lyrMenu_MASTER", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "추가", value: "실사등록", icon: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_SUB",
            type: "FREE",
            element: [
				{ name: "조회", value: "목록조회" },
				{ name: "생성", value: "재고생성", icon: "검색" },
                { name: "실사", value: "실사입력", icon: "실행" },
                { name: "조정", value: "수량조정", icon: "추가" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, //margin: 220,
            editable: { focus: "dept_area", validate: true }, remark: "lyrRemark2",
            content: {
                row: [
                    {
                        element: [
			                {
			                    name: "ymd_fr", label: { title: "실사일자 :" }, mask: "date-ymd",
			                    style: { colfloat: "float" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
			                {
			                    name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
			                    style: { colfloat: "floating" },
			                    editable: { type: "text", size: 7, maxlength: 10 }
			                },
                        ]
                    },
                    {
                        element: [
                            {
                                name: "plant_cd", label: { title: "공장 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "공장", unshift: [{ title: "전체", value: "" }] },
                                    change: [{ name: "sl_cd", memory: "창고", key: ["plant_cd"] }]
                                }
                            },
                            {
                                name: "sl_cd", label: { title: "창고 :" },
                                editable: {
                                    type: "select",
                                    data: { memory: "창고", unshift: [{ title: "전체", value: "" }], key: ["plant_cd"] }
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pic_emp_nm", label: { title: "담당자 :" },
                                editable: { type: "text", size: 7 }, mask: "search"
                            },
                            { name: "pic_emp", hidden: true }
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
            targetid: "grdData_MASTER", query: "SRM_9810_1", title: "실사 이력",
            caption: true, height: 145, show: true, selectable: true, number: true,
            editable: { bind: "select", focus: "pic_date", validate: true },
            element: [
				{
				    header: "실사일자", name: "pic_date", width: 100, align: "center",
				    editable: { type: "text", width: 110 }, mask: "date-ymd"
				},
                {
                    header: "제목", name: "pic_title", width: 200,
                    editable: { type: "text", width: 270, validate: { rule: "required" } }
                },
                {
                    header: "공장", name: "plant_cd", width: 60,
                    format: { type: "select", data: { memory: "공장" } },
                    editable: {
                        type: "select", bind: "create", width: 80, validate: { rule: "required" },
                        data: { memory: "공장", unshift: [{ title: "-", value: "" }] },
                        change: [{ name: "sl_cd", memory: "창고", key: ["plant_cd"], unshift: [{ title: "-", value: "" }] }]
                        //change: [{ name: "sl_cd", memory: "창고", key: ["plant_cd"], unshift: [{ title: "전체", value: " " }] }]
                    }
                },
                {
                    header: "창고", name: "sl_cd", width: 120,
                    format: { type: "select", data: { memory: "창고" } },
                    editable: {
                        type: "select", bind: "create", width: 160, validate: { rule: "required" },
                        data: { memory: "창고", unshift: [{ title: "-", value: "" }] }//, key: ["plant_cd"] }
                        //data: { memory: "창고", unshift: [{ title: "전체", value: " " }], key: ["plant_cd"] }
                    }
                },
                {
                    header: "담당자", name: "pic_emp_nm", width: 60, align: "center",
                    editable: { type: "text", bind: "create", width: 80 }, display: true, mask: "search"
                },
                {
                    header: "비고", name: "rmk", width: 250,
                    editable: { type: "text", width: 340, maxlength: 150 }
                },
                { name: "pic_emp", editable: { type: "hidden" }, hidden: true },
				{ name: "pic_no", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_SUM", query: "SRM_9810_3", type: "TABLE", title: "합계",
            caption: false, show: true, selectable: true,
            content: {
                width: { label: 80, field: 80 }, height: 25,
                row: [
                    {
                        element: [
                          { header: true, value: "품목수", format: { type: "label" } },
                          { name: "item_cnt", mask: "numeric-int" },
                          { header: true, value: "ERP재고", format: { type: "label" } },
                          { name: "inv_qty", mask: "numeric-int" },
                          { header: true, value: "실사수량", format: { type: "label" } },
                          { name: "pic_qty", mask: "numeric-int" },
                          { header: true, value: "차이수량", format: { type: "label" } },
                          { name: "qty", mask: "numeric-int" },
                          { name: "cnt", hidden: true },
                          { name: "pic_no", hidden: true }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "SRM_9810_2", title: "재고 목록",
            caption: true, height: 175, show: true, selectable: true, number: true, dynamic: true,
            element: [
                { header: "공장", name: "plant_cd", width: 40, hidden: true },
                { header: "창고", name: "sl_nm", width: 120, hidden: true },
                { header: "품번", name: "item_cd", width: 80, editable: { type: "hidden" } },
                { header: "품명", name: "item_nm", width: 150, display: true },
                { header: "규격", name: "item_spec", width: 150, display: true },
                { header: "Tracking", name: "track_no", width: 80, editable: { type: "hidden" } },
                { header: "ERP재고", name: "inv_qty", width: 50, mask: "numeric-int", align: "right" },
                { header: "실사수량", name: "pic_qty", width: 50, mask: "numeric-int", align: "right", display: true },
                { header: "조정수량", name: "chg_qty", width: 50, mask: "numeric-int", align: "right", display: true },
                { header: "차이수량", name: "qty", width: 50, mask: "numeric-int", align: "right", display: true },
                //{ header: "바코드수", name: "barcode_cnt", width: 50, mask: "numeric-int", align: "right", display: true },
                { header: "비고", name: "rmk", width: 150, editable: { type: "text" } },
                { name: "pic_no", editable: { type: "hidden" }, hidden: true },
                { name: "sl_cd", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MASTER", offset: 8 },
                { type: "GRID", id: "frmData_SUM", offset: 8 },
				{ type: "GRID", id: "grdData_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
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

        //----------
        var args = { targetid: "lyrMenu_MASTER", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MASTER", element: "추가", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MASTER", element: "삭제", event: "click", handler: processDelete };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MASTER", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_MASTER", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "생성", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "실사", event: "click", handler: processInsert };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_SUB", element: "조정", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MASTER", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MASTER", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------

        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processInsert(param) {

    closeOption({});
    switch (param.object) {
        case "lyrMenu_MASTER":
            var args = {
                targetid: "grdData_MASTER", edit: true, updatable: true,
                data: [
                    { name: "pic_date", value: gw_com_api.getDate() },
                    { name: "pic_emp_nm", value: gw_com_module.v_Session.USR_NM },
                    { name: "pic_emp", value: gw_com_module.v_Session.EMP_NO }
                ],
                clear: [
                    { type: "GRID", id: "grdData_SUB" }
                ]
            };
            gw_com_module.gridInsert(args);
            break;
        case "lyrMenu_SUB":
            if (!checkUpdatable({ check: true })) return false;
            if (param.element == "생성") {
                if (gw_com_api.getSelectedRow("grdData_MASTER", false) < 1) return false;
                //if (gw_com_api.getRowCount("grdData_SUB") > 0) {
                if (gw_com_api.getValue("frmData_SUM", 1, "cnt") > 0) {
                    gw_com_api.messageBox(
                        [{ text: "기존 자료 삭제 후 재생성 하시겠습니까?" }], 420,
                        gw_com_api.v_Message.msg_confirmBatch, "YESNO");
                } else {
                    processBatch({});
                }
            } else if (param.element == "실사") {
                //if (gw_com_api.getRowCount("grdData_SUB") == 0) {
                if (!(gw_com_api.getValue("frmData_SUM", 1, "cnt") > 0)) {
                        gw_com_api.messageBox(
                        [{ text: "재고 생성 후 진행하시기 바랍니다." }], 420);
                    return false;
                }
                var args = {
                    type: "PAGE", page: "SRM_9811", title: "실사수량 입력",
                    width: 800, height: 460, locate: ["center", "top"], open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "SRM_9811",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: {
                                pic_no: gw_com_api.getValue("grdData_MASTER", "selected", "pic_no", true),
                                plant_cd: gw_com_api.getValue("grdData_MASTER", "selected", "plant_cd", true),
                                sl_cd: gw_com_api.getValue("grdData_MASTER", "selected", "sl_cd", true)
                            }
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
    }

}
//----------
function processEdit(param) {

    if (gw_com_api.getSelectedRow("grdData_SUB", false) < 1) return;
    closeOption({});
    var args = {
        type: "PAGE", page: "SRM_9812", title: "조정수량 입력",
        width: 300, height: 320, locate: ["right", 300], open: true
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "SRM_9812",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: {
                    pic_no: gw_com_api.getValue("grdData_SUB", "selected", "pic_no", true),
                    plant_cd: gw_com_api.getValue("grdData_SUB", "selected", "plant_cd", true),
                    sl_cd: gw_com_api.getValue("grdData_SUB", "selected", "sl_cd", true),
                    item_cd: gw_com_api.getValue("grdData_SUB", "selected", "item_cd", true),
                    track_no: gw_com_api.getValue("grdData_SUB", "selected", "track_no", true)
                }
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processBatch(param) {

    var args = {
        url: "COM",
        procedure: "sp_createPIC",
        //nomessage: true,
        input: [
            { name: "pic_no", value: gw_com_api.getValue("grdData_MASTER", "selected", "pic_no", true), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: { success: successBatch, param: param }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    processRetrieve({ sub: true });

}
//----------
function processItemdblclick(param) {

    closeOption({});
    switch (param.element) {
        case "pic_emp_nm":  //사용자
            v_global.event.type = param.type;
            v_global.event.object = param.object;
            v_global.event.row = param.row;
            v_global.event.element = param.element;
            var args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_find_emp",
                    param: {
                        ID: gw_com_api.v_Stream.msg_openedDialogue
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

            break;
    }

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "frmOption" || param.master) {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "plant_cd", argument: "arg_plant_cd" },
                    { name: "sl_cd", argument: "arg_sl_cd" },
                    { name: "pic_emp", argument: "arg_pic_emp" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "plant_cd" }] },
                    { element: [{ name: "sl_cd" }] },
                    { element: [{ name: "pic_emp" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_MASTER", select: true }
            ],
            clear: [
                { type: "FORM", id: "frmData_SUM" },
                { type: "GRID", id: "grdData_SUB" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else if (param.object == "grdData_MASTER" || param.sub) {
        args = {
            source: {
                type: "GRID", id: "grdData_MASTER", row: "selected",
                element: [
                    { name: "pic_no", argument: "arg_pic_no" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_SUM" }
            ],
            clear: [
                { type: "GRID", id: "grdData_SUB" }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else {
        args = {
            source: {
                type: "GRID", id: "grdData_MASTER", row: "selected",
                element: [
                    { name: "pic_no", argument: "arg_pic_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_SUB", select: true }
            ],
            key: param.key,
            handler: { complete: processRetrieveEnd, param: param }
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "pic_dept_nm" || param.element == "pic_emp_nm") {
            if (param.value.current == "") {
                gw_com_api.setValue(param.object, param.row, param.element.substr(0, param.element.length - 3), "");
            }
        }
    }

}
//----------
function processItemdblclick(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "pic_emp_nm":
            case "pic_dept_nm":
                processPopup(param);
                break;
            default:
                processRetrieve();
                break;
        }
    }

}
//----------
function processPopup(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;

    var args;
    switch (param.element) {
        case "pic_emp_nm":
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectEmployee,
                data: {
                    //dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "adept_nm", (v_global.event.type == "GRID" ? true : false)),
                    emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
        case "pic_dept_nm":
            args = {
                type: "PAGE", page: "w_find_dept", title: "부서 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectDepartment,
                data: {
                    dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: args.data } };
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function processDelete(param) {

    var args = {
        targetid: "grdData_MASTER", row: "selected", select: true,
        clear: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    // 저장
    var args = {
        target: [
			{ type: "GRID", id: "grdData_MASTER" }
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave, param: param };

    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    $.each(response, function () {
        if (this.QUERY == "SRM_9810_1") {
            //var key = [{
            //    KEY: [{ NAME: this.KEY[0].NAME, VALUE: this.KEY[0].VALUE }],
            //    QUERY: "SRM_9810_1"
            //}];
            var key = this;
            processRetrieve({ master: true, key: key });
        }
    });

    $.each(response, function () {
        if (this.QUERY == "SRM_9810_2") {
            //var key = [{
            //    KEY: [{ NAME: this.KEY[0].NAME, VALUE: this.KEY[0].VALUE }],
            //    QUERY: "SRM_9810_1"
            //}];
            var key = this;
            processRetrieve({ sub: true, key: key });
        }
    });

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function viewOption(param) {

    gw_com_api.show("frmOption");

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
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_MASTER" },
			{ type: "GRID", id: "grdData_SUB" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

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
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                        {
                            if (param.data.result == "YES")
                                processBatch({});
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "SRM_9811":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                pic_no: gw_com_api.getValue("grdData_MASTER", "selected", "pic_no", true),
                                plant_cd: gw_com_api.getValue("grdData_MASTER", "selected", "plant_cd", true),
                                sl_cd: gw_com_api.getValue("grdData_MASTER", "selected", "sl_cd", true)
                            };
                        }
                        break;
                    case "SRM_9812":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openedDialogue;
                            args.data = {
                                pic_no: gw_com_api.getValue("grdData_SUB", "selected", "pic_no", true),
                                plant_cd: gw_com_api.getValue("grdData_SUB", "selected", "plant_cd", true),
                                sl_cd: gw_com_api.getValue("grdData_SUB", "selected", "sl_cd", true),
                                item_cd: gw_com_api.getValue("grdData_SUB", "selected", "item_cd", true),
                                track_no: gw_com_api.getValue("grdData_SUB", "selected", "track_no", true)
                            };
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectEmployee;
                            args.data = {
                                //dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "pic_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                                emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                            }

                        }
                        break;
                    case "w_find_dept":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectDepartment;
                            args.data = {
                                dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                            }
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "SRM_9811":
                        if (param.data != undefined) {
                            processRetrieve({ sub: true });
                        }
                        break;
                    case "SRM_9812":
                        if (param.data != undefined) {
                            gw_com_api.setValue("grdData_SUB", "selected", "chg_qty", param.data.chg_qty, true);
                            gw_com_api.setValue("grdData_SUB", "selected", "qty", param.data.qty, true);
                        }
                        break;
                    case "w_find_emp":
                        if (param.data != undefined) {
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element,
                                                param.data.emp_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                v_global.event.element.substr(0, v_global.event.element.length - 3),
                                                param.data.emp_no,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "pic_dept_nm",
                                                param.data.dept_nm,
                                                (v_global.event.type == "GRID") ? true : false);
                            gw_com_api.setValue(
                                                v_global.event.object,
                                                v_global.event.row,
                                                "pic_dept",
                                                param.data.dept_cd,
                                                (v_global.event.type == "GRID") ? true : false);
                        }
                        //closeDialogue({ page: param.from.page, focus: true });
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            if (param.data != undefined) {
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.element,
                                    param.data.emp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.element.substr(0, v_global.event.element.length - 3),
                                    param.data.emp_no,
                                    (v_global.event.type == "GRID") ? true : false);
                //gw_com_api.setValue(
                //                    v_global.event.object,
                //                    v_global.event.row,
                //                    "pic_dept_nm",
                //                    param.data.dept_nm,
                //                    (v_global.event.type == "GRID") ? true : false);
                //gw_com_api.setValue(
                //                    v_global.event.object,
                //                    v_global.event.row,
                //                    "pic_dept",
                //                    param.data.dept_cd,
                //                    (v_global.event.type == "GRID") ? true : false);
            }
            closeDialogue({ page: param.from.page, focus: true });
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//