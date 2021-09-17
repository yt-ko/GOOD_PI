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
    logic: { plan_yn:null }
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

        // set data.
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
                { type: "PAGE", name: "팀", query: "dddw_dept_none" },
                { type: "PAGE", name: "고객사", query: "dddw_cust", param: [{ argument: "arg_hcode", value: "ISCM29" }] },
                { type: "PAGE", name: "영업구분", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "ISCM21" }] },
                { type: "PAGE", name: "PROCESS", query: "dddw_custproc" },
                { type: "PAGE", name: "부문", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "ISCM12" }] },
                { type: "PAGE", name: "내역", query: "dddw_work_step" }
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
                { name: "조회", value: "조회" },
                { name: "관리", value: "모델관리", icon: "기타" },
                { name: "저장", value: "저장" },
                { name: "복사", value: "복사", icon: "추가" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true,
            editable: { validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                        {
                            element: [
                                {
                                    name: "dept_area", label: { title: "장비군 : " },
                                    editable: { type: "select", validate: { rule: "required" }, data: { memory: "장비군_IN" } }
                                },
                                {
                                    name: "group1_cd", label: { title: "제품유형 :" },
                                    editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                                }
                            
                            ]
                        },
                        {
                            element: [
                                {
                                    name: "group2_cd", label: { title: "공정 :" },
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
            targetid: "grdData_MAIN", query: "w_iscm1030_M_1", title: "제품 모델",
            caption: true, width: 500, height: 440, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "dept_nm", validate: true },
            element: [
                { header: "제품유형", name: "group1_nm", width: 90, align: "left" },
                { header: "제품유형", name: "group1_cd", width: 90, align: "left", hidden: true },
                { header: "공정", name: "group2_nm", width: 90, align: "left" },
                { header: "공정", name: "group2_cd", width: 90, align: "left", hidden: true },
                { header: "고객사", name: "group3_nm", width: 90, align: "left" },
                { header: "고객사", name: "group3_cd", width: 90, align: "left", hidden: true},
                { header: "영업구분", name: "group4_nm", width: 80, align: "left" },
                { header: "영업구분", name: "group4_cd", width: 80, align: "left", hidden: true},
                { header: "국내/외", name: "group5_nm", width: 60, align: "left" },
                { header: "국내/외", name: "group5_cd", width: 60, align: "left", hidden: true },
                { header: "작업수", name: "step_cnt", width: 40, align: "right" },
                { name: "model_id", editable: { type: "hidden" }, hidden: true },
                { name: "plan_yn", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_SUB", query: "w_iscm1030_M_2", title: "모델별 작업 일정계획",
            caption: true, width: 600, height: 440, show: true, selectable: true, number: true,
            editable: { multi: true, bind: "select", focus: "emp_nm", validate: true },
            element: [
                {
                    header: "작업단계", name: "work_step", width: 100,
                    format: { type: "select", data: { memory: "내역" } },
                    editable: { type: "select", data: { memory: "내역" }, validate: { rule: "required", message: "내역" } }
                },
                {
                    header: "담당부문", name: "work_part", width: 100,
                    format: { type: "select", data: { memory: "부문" } },
                    editable: { type: "select", data: { memory: "부문" }, validate: { rule: "required", message: "부문" } }
                },
                {
                    header: "담당부서", name: "work_dept", width: 100,
                    format: { type: "select", data: { memory: "팀" } },
                    editable: { type: "select", data: { memory: "팀" } }
                },
                {
                    header: "담당사원", name: "work_emp_nm", width: 60, align: "center", mask: "search",
                    editable: { type: "text" }
                },
                {
                    header: "순서", name: "sort_seq", width: 30, align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "시작D-day", name: "plans_day", width: 60, mask: "numeric-int", align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "종료D-day", name: "plane_day", width: 60, mask: "numeric-int", align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "가중치(%)", name: "day_rate", width: 60, mask: "numeric-int", align: "center",
                    editable: { type: "text" }
                },
                {
                    header: "사용", name: "use_yn", width: 30, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" },
                    editable: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "비고", name: "rmk", width: 300, align: "left", editable: { type: "text" } },
                { name: "model_id", editable: { type: "hidden" }, hidden: true },
                { name: "work_seq", editable: { type: "hidden" }, hidden: true },
                { name: "work_emp", editable: { type: "hidden" }, hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_MAIN", offset: 8 },
                { type: "GRID", id: "grdData_SUB", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);

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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "관리", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "복사", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_1", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_1", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "lyrMenu_2", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_MAIN", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselecting", handler: rowselecting_grdData_MAIN };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_MAIN", grid: true, event: "rowselected", handler: rowselected_grdData_MAIN };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdData_SUB", grid: true, event: "itemdblclick", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_SUB", grid: true, event: "itemkeyenter", handler: processItemdblclick };
        gw_com_module.eventBind(args);
        //=====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function rowselecting_grdData_MAIN(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_MAIN(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        processRetrieve({});

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function click_lyrMenu_추가(param) {
    if (!checkManipulate({})) return;

    var args = {
        targetid: "grdData_SUB",
        edit: true,
        data: [
            { name: "model_id", value: gw_com_api.getValue("grdData_MAIN", "selected", "model_id", true) },
            { name: "use_yn", value: "1" },
            { name: "day_rate", value: "100" },
            { name: "sort_seq", rule: "INCREMENT", value: 1 }
        ]
    };
    gw_com_module.gridInsert(args);
}
function processButton(param) {

    switch (param.element) {
        case "조회":
            {
                var args = {
                    target: [
                        { id: "frmOption" }
                    ]
                };
                gw_com_module.objToggle(args);
            }
            break;
        case "관리":
            {
                var args = {
                    ID: gw_com_api.v_Stream.msg_linkPage,
                    to: { type: "MAIN" },
                    data: {
                        page: "w_iscm1090",
                        title: "모델 관리"
                    }
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case "추가":
        case "복사":
            {
                if (param.element == "추가")
                    v_global.logic.plan_yn = "0"
                else
                    v_global.logic.plan_yn = "1"

                var args = {
                    type: "PAGE", page: "w_iscm1031_1", title: "모델 선택",
                    width: 600, height: 450,
                    locate: ["center", "center"],
                    open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_iscm1031_1",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: {
                                plan_yn: v_global.logic.plan_yn,
                                usr_id: gw_com_module.v_Session.USR_ID,
                                src_id: gw_com_api.getValue("grdData_MAIN", "selected", "model_id", true),
                                biz_dept: gw_com_api.getValue("frmOption", "selected", "dept_area")
                            }
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "실행":
            {
                gw_com_api.hide("frmOption");
                processRetrieve({});
            }
            break;
        case "취소":
            {
                gw_com_api.hide("frmOption");
            }
            break;
        case "삭제":
            {
                if (!checkManipulate({})) return;
                if (param.object == "lyrMenu_1") {
                    v_global.process.handler = processRemove;
                    checkRemovable({});
                } else {
                    if (!checkManipulate({})) return;
                    var args = { targetid: "grdData_SUB", row: "selected", select: true };
                    gw_com_module.gridDelete(args);
                }
            }
            break;
        case "저장":
            {
                processSave({});
            }
            break;
        case "닫기":
            {
                v_global.process.handler = processClose;
                if (!checkUpdatable({})) return;
                processClose({});
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    //switch (param.element) {
    //    case "dept_area":
    //        {
    //            processRetrieve({});
    //        }
    //        break;
        //case "dept_cd":
        //    {
        //        ids = gw_com_api.getRowIDs("grdData_SUB");
        //        $.each(ids, function () {
        //            if (param.value.prev
        //                == gw_com_api.getValue("grdData_SUB", this, "dept_cd", true))
        //                gw_com_api.setValue("grdData_SUB", this, "dept_cd", param.value.current, true, true);
        //        });
        //    }
        //    break;
    //}
    //return true;

}
//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("grdData_MAIN", "selected", true);

}
//----------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ],
        param: param
    };

    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processRemove({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    args = {
        source: {
            type: "FORM", id: "frmOption",hide:true,            
            element: [
                { name: "group1_cd", argument: "arg_group1_cd" },
                { name: "group2_cd", argument: "arg_group2_cd" },
                { name: "group3_cd", argument: "arg_group3_cd" },
                { name: "dept_area", argument: "arg_dept_area" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MAIN", select: true }
        ],
        remark: [
            { element: [{ name: "dept_area" }] },
            { element: [{ name: "group1_cd" }] },
            { element: [{ name: "group2_cd" }] },
            { element: [{ name: "group3_cd" }] }    
            
        ],
        clear: [
            { type: "GRID", id: "grdData_SUB" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {
        source: {
            type: "GRID", id: "grdData_MAIN", row: "selected", block: true,
            element: [
                { name: "model_id", argument: "arg_model_id" }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_MAIN", v_global.process.current.master, true, false);

}
//----------
//function processInsert(param) {

//    if (param.master) {
//        var row = gw_com_api.getFindRow("grdData_MAIN", "dept_cd", param.data.dept_cd);
//        if (row > 0) return;
//        var args = {
//            targetid: "grdData_MAIN", edit: true, updatable: true,
//            data: [
//                { name: "dept_cd", value: param.data.dept_cd },
//                { name: "dept_nm", value: param.data.dept_nm },
//                { name: "use_yn", value: "1" }
//            ],
//            clear: [
//                { type: "GRID", id: "grdData_SUB" }
//            ]
//        };
//        gw_com_module.gridInsert(args);

//    } else if (param.sub) {
//        // 중복 제거
//        var data = new Array();
//        var pid = gw_com_api.getValue("grdData_MAIN", "selected", "idx", true);
//        $.each(param.data, function () {
//            if (gw_com_api.getFindRow("grdData_SUB", "emp_no", this.emp_no) < 1) {
//                this.pid = pid;
//                this.use_yn = "1";
//                data[data.length] = this;
//            }
//        });

//        if (data.length > 0) {
//            var args = {
//                targetid: "grdData_SUB", edit: true, updatable: true,
//                data: data
//            };
//            gw_com_module.gridInserts(args);
//        }
//    }

//}

//----------
function processSave(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MAIN" },
            { type: "GRID", id: "grdData_SUB" }            
        ]
    };

    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave, param:param
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [
            {
                query: $("#grdData_MAIN_data").attr("query"),
                row: [{
                    crud: "U",
                    column: [
                        { name: "model_id", value: gw_com_api.getValue("grdData_MAIN", "selected", "model_id", true) },
                        { name: "plan_yn", value: "0" }
                    ]
                }]
            }
        ],
        handler: { success: processRetrieve }
    };
    gw_com_module.objSave(args);

}
//----------
function processRestore(param) {

    var args = {
        targetid: "grdData_MAIN",
        row: v_global.process.prev.master
    };
    gw_com_module.gridRestore(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_SUB" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

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
    var key = [
        {
            KEY: [{ NAME: "model_id", VALUE: gw_com_api.getValue("grdData_MAIN", "selected", "model_id", true) }],
            QUERY: $("#grdData_MAIN_data").attr("query")
        }
    ];
    processRetrieve({ key: key });
}
//----------
function successRemove(response, param) {

    //processDelete({});

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.event.data;

    var args;
    switch (param.element) {
        case "work_emp_nm":
            {
                v_global.event.type = param.type;
                v_global.event.object = param.object;
                v_global.event.row = param.row;
                v_global.event.element = param.element;
                v_global.event.data = {
                    dept_cd: gw_com_api.getValue(param.object, param.row, "work_dept", true)
                }
                var args = {
                    type: "PAGE", page: "w_find_emp_scm", title: "사원 검색",
                    width: 500, height: 460, open: true
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "w_find_emp_scm",
                        param: {
                            ID: gw_com_api.v_Stream.msg_selectEmployee_SCM
                            //data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
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
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID())
                    break;
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processDelete({});
                                else if (status == "update")
                                    processRestore({});
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
        case gw_com_api.v_Stream.msg_selectedEmployee_SCM:
            {
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "work_emp",
                                    param.data.emp_no,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "work_emp_nm",
                                    param.data.emp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object,
                                    v_global.event.row,
                                    "work_dept",
                                    param.data.dept_cd,
                                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    },
                    data: {
                        plan_yn: v_global.logic.plan_yn,
                        usr_id: gw_com_module.v_Session.USR_ID,
                        src_id: gw_com_api.getValue("grdData_MAIN", "selected", "model_id", true),
                        biz_dept: gw_com_api.getValue("frmOption", "selected", "dept_area")
                    },
                    ID:param.ID
                };
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;

        case gw_com_api.v_Stream.msg_selectedModel:
            {
                closeDialogue({ page: param.from.page, focus: true });
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                if (param.data) {
                    var key = [
                        {
                            KEY: [
                                { NAME: "model_id", VALUE: param.data.key }
                            ],
                            QUERY: $("#grdData_MAIN_data").attr("query")
                        }
                    ];
                    processRetrieve({ key: key });
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//