//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : ECCB평가관리
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

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // set data for DDDW List
        var args = {
            request: [
				{
				    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
				    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            v_global.logic.eccb_tp = gw_com_api.getPageParameter("ECCB_TP");
            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -12 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));

            gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "ECR", value: "ECR상세정보", icon: "기타" },
                { name: "ECO", value: "ECO상세정보", icon: "기타" },
                { name: "저장", value: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "mng_no", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA_FIND" } }
                            },
                            {
                                name: "ymd_fr", label: { title: "제안일자 :" }, style: { colfloat: "floating" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "ecr_title", label: { title: "제안명 :" },
                                editable: { type: "text", size: 17, maxlength: 50 }
                            },
                            {
                                name: "ecr_emp", label: { title: "제안자 :" },
                                editable: { type: "text", size: 7, maxlength: 20 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "mng_no", label: { title: "ECR / ECO No. : " },
                                editable: { type: "text", size: 15, maxlength: 30 }
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
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "ECCB_4500_1", title: "평가대상",
            height: 270, caption: true, pager: false, show: true, selectable: true, number: true, //dynamic: true,
            element: [
				{ header: "ECR No.", name: "ecr_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "개선제안명", name: "ecr_title", width: 350 },
				{ header: "제안자", name: "ecr_emp_nm", width: 60, align: "center" },
				{ header: "제안일자", name: "ecr_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "ECO No.", name: "eco_no", width: 80, align: "center", editable: { type: "hidden" } },
				{ header: "ECO작성자", name: "eco_emp_nm", width: 60, align: "center" },
				{ header: "1차점수", name: "evl1_point", width: 60, align: "right" },
				{ header: "1차등급", name: "evl1_grade", width: 60, align: "right" },
				{ header: "2차점수", name: "evl2_point", width: 60, align: "right" },
				{ header: "2차등급", name: "evl2_grade", width: 60, align: "right" },
                { header: "기여율", name: "evl_ratio", width: 150, align: "center" }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "ECCB_4500_2", title: "평가결과",
            height: 140, caption: true, pager: false, show: true, number: true, selectable: true,
            editable: { multi: true, bind: "_edit_yn", focus: "evl1_point", validate: true },
            element: [
				{ header: "평가항목", name: "evl_item", width: 150, align: "center" },
				{ header: "최고점수", name: "max_point", width: 60, align: "right", mask: "numeric-int" },
				{ header: "최하등급", name: "min_grade", width: 60, align: "right", mask: "numeric-int" },
				{
				    header: "1차점수", name: "evl1_point", width: 60, align: "right", mask: "numeric-int",
				    editable: { type: "text", width: 92, maxlength: 3 }
				},
				{ header: "1차등급", name: "evl1_grade_nm", width: 60, align: "center" },
				{
				    header: "2차점수", name: "evl2_point", width: 60, align: "right", mask: "numeric-int",
				    editable: { type: "text", width: 92, maxlength: 3 }
				},
				{ header: "2차등급", name: "evl2_grade_nm", width: 60, align: "center" },
                { header: "비고", name: "evl_rmk", width: 200, editable: { type: "text", width: 300, maxlength: 130 } },
                { name: "evl_no", editable: { type: "hidden" }, hidden: true },
                { name: "item_no", editable: { type: "hidden" }, hidden: true },
                { name: "min_point", hidden: true },
                { name: "max_grade", hidden: true },
                { name: "_edit_yn", hidden: true }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();
        //=====================================================================================

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "ECR", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "ECO", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: toggleOption };
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
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Main", grid: true, event: "rowdblclick", handler: processRowdblclick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function toggleOption() {
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);
}
//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            v_global.process.handler = toggleOption;
            if (!checkUpdatable({})) return;
            toggleOption({});
            break;
        case "ECR":
        case "ECO":
            processPopup2(param);
            break;
        case "저장":
            processSave({});
            break;
        case "닫기":
            v_global.process.handler = processClose;
            if (!checkUpdatable({})) return;
            processClose({});
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        if (param.element == "ecr_dept_nm" || param.element == "ecr_emp_nm") {
            if (param.value.current == "") {
                gw_com_api.setValue(param.object, param.row, param.element.substr(0, param.element.length - 3), "");
            }
        }
    } else if (param.object == "grdData_Sub") {
        if (param.element == "evl1_point" || param.element == "evl2_point") {
            var min = Number(gw_com_api.getValue(param.object, param.row, "min_point", true));
            var max = Number(gw_com_api.getValue(param.object, param.row, "max_point", true));
            var val = Number(param.value.current);
            if (val < min || val > max) {
                gw_com_api.messageBox([
                    { text: min + " ~ " + max + " 사이의 값을 입력하세요." }
                ], 300);
            }
        }
    }

}
//----------
function processItemdblclick(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "ecr_emp_nm":  //제안자
            case "ecr_dept_nm": //제안부서
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
        case "ecr_emp_nm":
            args = {
                type: "PAGE", page: "w_find_emp", title: "사원 검색",
                width: 600, height: 450, locate: ["center", "top"], open: true,
                id: gw_com_api.v_Stream.msg_selectEmployee,
                data: {
                    dept_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, "ecr_dept_nm", (v_global.event.type == "GRID" ? true : false)),
                    emp_nm: gw_com_api.getValue(v_global.event.object, v_global.event.row, param.element, (v_global.event.type == "GRID" ? true : false))
                }
            };
            break;
        case "ecr_dept_nm":
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
function processPopup2(param) {

    if (gw_com_api.getSelectedRow("grdData_Main") < 1) return;
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" }
    };

    if (param.element == "ECR") {
        args.data = {
            page: "w_eccb1014", title: "ECR 정보",
            param: [
                { name: "AUTH", value: "R" },
                { name: "ecr_no", value: gw_com_api.getValue("grdData_Main", "selected", "ecr_no", true) }
            ]
        };
    } else {
        args.data = {
            page: "w_eccb4010", title: "ECO 정보",
            param: [
                { name: "AUTH", value: "R" },
                { name: "eco_no", value: gw_com_api.getValue("grdData_Main", "selected", "eco_no", true) }
            ]
        };
    }
    gw_com_module.streamInterface(args);

}
//----------
function processRowdblclick(param) {

    var args;
    switch (param.element) {
        case "ecr_no":
            args = { element: "ECR" };
            break;
        case "eco_no":
            args = { element: "ECO" };
            break;
        default:
            return;
    }
    processPopup2(args);

}
//----------
function processRetrieve(param) {

    var args;
    if (param.object == "grdData_Main") {
        args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "eco_no", argument: "arg_eco_no" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub", select: true }
            ],
            handler_complete: processRetrieveEnd,
            key: param.key
        };
    } else {
        args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "mng_no", argument: "arg_mng_no" },
                    { name: "ecr_emp", argument: "arg_ecr_emp" },
                    { name: "ecr_title", argument: "arg_ecr_title" }
                ],
                argument:[
                    { name: "arg_eccb_tp", value: v_global.logic.eccb_tp }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Main", select: true }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {
}
//----------
function processSave(param) {

    var args = {
        url: "COM",
        target: [
            { type: "GRID", id: "grdData_Sub" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;
    if (!checkVal({ message: true })) return;

    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    //processRetrieve({ object: "grdData_Main", row: "selected", type: "GRID", key: response });
    var key = [
        {
            KEY: [
                { NAME: "eco_no", VALUE: gw_com_api.getValue("grdData_Main", "selected", "eco_no", true) }
            ],
            QUERY: "ECCB_4500_1"
        }
    ];
    processRetrieve({ key: key });

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            { type: "GRID", id: "grdData_Sub" }
        ],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
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
//----------
function checkVal(param) {

    var rtn = true;
    var ids = gw_com_api.getRowIDs("grdData_Sub");
    $.each(ids, function () {
        if (gw_com_api.getValue("grdData_Sub", this, "_edit_yn", true) != "1") return;
        if (gw_com_api.getValue("grdData_Sub", this, "evl1_point", true) == "" ||
            gw_com_api.getValue("grdData_Sub", this, "evl1_point", true) == "0" ||
            gw_com_api.getValue("grdData_Sub", this, "evl2_point", true) == "" ||
            gw_com_api.getValue("grdData_Sub", this, "evl2_point", true) == "0") return;
        var min = Number(gw_com_api.getValue("grdData_Sub", this, "min_point", true));
        var max = Number(gw_com_api.getValue("grdData_Sub", this, "max_point", true));
        var val1 = Number(gw_com_api.getValue("grdData_Sub", this, "evl1_point", true));
        var val2 = Number(gw_com_api.getValue("grdData_Sub", this, "evl2_point", true));
        if (val1 < min || val1 > max) {
            rtn = false;
            if (param.message) {
                gw_com_api.messageBox([{ text: "잘못된 값이 입력되었습니다." }], 300);
            }
            gw_com_api.selectRow("grdData_Sub", this, true);
            gw_com_api.setFocus("grdData_Sub", this, "evl1_point", true);
            return false;
        } else if (val2 < min || val2 > max) {
            rtn = false;
            if (param.message) {
                gw_com_api.messageBox([{ text: "잘못된 값이 입력되었습니다." }], 300);
            }
            gw_com_api.selectRow("grdData_Sub", this, true);
            gw_com_api.setFocus("grdData_Sub", this, "evl2_point", true);
            return false;
        }
    });
    return rtn;
}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES") {
                                processSave(param.data.arg);
                            } else {
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        } break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        { if (param.data.result == "YES") processRemove(param.data.arg); } break;
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedDepartment:
            {
                if (param.data != undefined) {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
                                        param.data.dept_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element.substr(0, v_global.event.element.length - 3),
                                        param.data.dept_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                }
                closeDialogue({ page: param.from.page, focus: true });

            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
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
                    if (v_global.event.element == "ecr_emp_nm") {
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "ecr_dept_nm",
                                            param.data.dept_nm,
                                            (v_global.event.type == "GRID") ? true : false);
                        gw_com_api.setValue(
                                            v_global.event.object,
                                            v_global.event.row,
                                            "ecr_dept",
                                            param.data.dept_cd,
                                            (v_global.event.type == "GRID") ? true : false);
                    }
                }
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//