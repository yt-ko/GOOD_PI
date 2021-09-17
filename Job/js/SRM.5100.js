//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 
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
                    type: "PAGE", name: "검사유형", query: "dddw_zcode",
                    param: [
                        { argument: "arg_hcode", value: "QDM037" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
            if (v_global.process.param != "" && gw_com_api.getPageParameter("pr_no") != "") {
                gw_com_api.setValue("frmOption", 1, "pr_no", gw_com_api.getPageParameter("pr_no"));
                processRetrieve({});
            }
        }
    },

    // manage UI. (design section)
    UI: function () {

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
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "구매요청일 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "qc_tp", label: { title: "검사구분 :" },
                                editable: { type: "select", data: { memory: "검사유형", unshift: [{ title: "전체", value: "%" }] } }
                            }
                        ]
                    },
                    {
                        element: [ 
                            {
                                name: "proj_no", label: { title: "Project No. : " },
                                editable: { type: "text", size: 12, maxlength: 100 }
                            },
                            {
                                name: "supp_nm", label: { title: "거래처 :" },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "item_nm", label: { title: "품목명 :" },// mask: "search",
                                editable: { type: "text", size: 15, maxlength: 50 }
                            },
                            {
                                name: "item_cd", label: { title: "품목 : " },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pr_emp", label: { title: "구매요청자 : " },
                                editable: { type: "text", size: 9, maxlength: 50 }
                            },
                            {
                                name: "pr_dept", label: { title: "구매요청부서 : " },
                                editable: { type: "text", size: 12, maxlength: 50 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "px_no", label: { title: "구매의뢰번호 : " },
                                editable: { type: "text", size: 12, maxlength: 100 }
                            },
                            {
                                name: "pr_no", label: { title: "구매요청번호 : " },
                                editable: { type: "text", size: 12, maxlength: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pur_no", label: { title: "발주번호 : " },
                                editable: { type: "text", size: 12, maxlength: 100 }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "실행", value: "실행", act: true, format: { type: "button" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } },
                            { name: "엑셀", value: "엑셀로 바로 저장", format: { type: "button", icon: "엑셀" } }
                        ], align: "right"

                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var width = 600;
        if (parent == undefined || parent == null || parent.streamProcess == undefined || window == parent)
            width = "100%";
        //----------
        var args = {
            targetid: "grdList_MAIN", query: "SRM_5100_1", title: "구매 진행 현황",
            caption: false, height: width, pager: true, show: true, selectable: true, number: true, //dynamic: true,
            color: {
                row: true,
                //element: ["pur_no", "pur_seq", "dlved_qty"]
            },
            element: [
                { header: "구매의뢰번호", name: "px_no", width: 100 },
                { header: "구매요청번호", name: "pr_no", width: 100 },
                { header: "발주번호", name: "pur_no", width: 80 },
                //{ header: "발주순번", name: "pur_seq", width: 50, align: "center", hidden: true },
                //{ header: "프로젝트명", name: "proj_nm", width: 130 },
                { header: "Project No.", name: "proj_no", width: 130 },
                { header: "요청자", name: "pr_emp_nm", width: 50 },
                { header: "요청부서", name: "pr_dept_nm", width: 100 },
                { header: "발주담당", name: "pur_emp_nm", width: 50 },
                { header: "거래처", name: "supp_nm", width: 150 },
                { header: "품목", name: "item_cd", width: 130 },
                { header: "품목명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 200 },
                { header: "요청수량", name: "pr_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "발주수량", name: "pur_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "업체확인", name: "plan_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "납품예정", name: "dlv_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "검사구분", name: "qc_yn_nm", width: 50, align: "center" },
                { header: "검사(합격)", name: "qcok_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "검사(불합격)", name: "qcrj_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "미검사", name: "qcno_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "가입고", name: "in_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "구매요청일", name: "pr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "납기요청일", name: "pr_dlv_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "발주일", name: "pur_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "납기요구일", name: "pur_dlv_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "납기예정일", name: "plan_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "입고예정일", name: "dlv_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "검사일", name: "qc_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "가입고일", name: "in_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "입고창고", name: "wh_nm", width: 100 },
                { header: "납기준수", name: "purok_qty", width: 60, align: "right", mask: "numeric-int" },
                { header: "지연입고", name: "purrj_qty", width: 60, align: "right", mask: "numeric-int" },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_MAIN", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "엑셀", event: "click", handler: processButton };
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

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    //gw_com_api.show("frmOption");
    var args = { target: [{ id: "frmOption", focus: true }] };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function processButton(param) {

    closeOption({});
    switch (param.element) {
        case "실행":
            {
                processRetrieve(param);
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
        case "엑셀":
            {
                param.excel = true;
                processRetrieve(param);
            }
            break;
    }

}
//----------
function processItemchanged(param) {

    if (param.object == "frmOption") {
        switch (param.element) {
            case "proj_nm":
                {
                    if (param.value.current == "")
                        gw_com_api.setValue(param.object, param.row, "proj_no", "");
                    else {

                        var args = {
                            proj_no: "",
                            proj_nm: param.value.current,
                            cd: "proj_no",
                            nm: "proj_nm",
                            object: param.object,
                            row: param.row,
                            element: param.element,
                            type: param.type
                        }
                        setProjInfo(args);

                    }

                }
                break;
        }
    }

}
//----------
function processItemdblclick(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    var args;
    switch (param.element) {
        //case "pr_no":
        //    {
        //        v_global.event.cd = "pr_no";
        //        v_global.event.nm = "";
        //        args = {
        //            type: "PAGE", page: "DLG_PR", title: "구매요청 검색",
        //            width: 950, height: 460, open: true,
        //            id: gw_com_api.v_Stream.msg_openDialogue
        //        };
        //    }
        //    break;
        case "proj_nm":
        case "proj_no":
            {
                v_global.event.cd = "proj_no";
                v_global.event.nm = "proj_nm";
                v_global.logic.search = {
                    proj_no: (param.element == "proj_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                    proj_nm: (param.element == "proj_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
                };
                args = {
                    type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                    width: 650, height: 460, open: true,
                    id: gw_com_api.v_Stream.msg_selectProject_SCM
                };
            }
            break;
        case "supp_cd":
        case "supp_nm":
            {
                v_global.event.cd = "supp_cd";
                v_global.event.nm = "supp_nm";
                v_global.logic.search = {
                    supp_cd: (param.element == "supp_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                    supp_nm: (param.element == "supp_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
                };
                args = {
                    type: "PAGE", page: "DLG_SUPPLIER", title: "협력사 선택",
                    width: 600, height: 450, open: true,
                    id: gw_com_api.v_Stream.msg_selectSupplier
                };
            }
            break;
        //case "item_cd":
        //case "item_nm":
        //    v_global.event.cd = "item_cd";
        //    v_global.event.nm = "item_nm";
        //    v_global.logic.search = {
        //        part_cd: (param.element == "item_cd" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
        //        part_nm: (param.element == "item_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
        //        part_spec: ""
        //    };
        //    args = {
        //        type: "PAGE", page: "w_find_part_erp", title: "부품 검색",
        //        width: 900, height: 450, open: true,
        //        id: gw_com_api.v_Stream.msg_selectPart_SCM
        //    };
        //    break;
        default: return;
    }

    if (gw_com_module.dialoguePrepare(args) == false) {
        args = {
            page: args.page,
            param: {
                ID: args.id,
                data: v_global.logic.search
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;
    //if (gw_com_api.getValue("frmOption", 1, "pr_no") == "" &&
    //    gw_com_api.getValue("frmOption", 1, "pr_emp") == "" &&
    //    gw_com_api.getValue("frmOption", 1, "proj_no") == "") {
    //    gw_com_api.messageBox([
    //        { text: "조회 조건 중 한 가지는 반드시 입력하셔야 합니다." }
    //    ]);
    //    gw_com_api.setError(true, "frmOption", 1, "pr_no", false, true);
    //    gw_com_api.setError(true, "frmOption", 1, "pr_emp", false, true);
    //    gw_com_api.setError(true, "frmOption", 1, "proj_no", false, true);
    //    viewOption({});
    //    return false;
    //}
    //gw_com_api.setError(false, "frmOption", 1, "pr_no", false, true);
    //gw_com_api.setError(false, "frmOption", 1, "pr_emp", false, true);
    //gw_com_api.setError(false, "frmOption", 1, "proj_no", false, true);

    var remark = [
        { element: [{ name: "qc_tp" }] },
        { element: [{ name: "proj_no" }] },
        { element: [{ name: "supp_nm" }] },
        { element: [{ name: "item_nm" }] },
        { element: [{ name: "item_cd" }] },
        { element: [{ name: "pr_emp" }] },
        { element: [{ name: "pr_dept" }] },
        { element: [{ name: "px_no" }] },
        { element: [{ name: "pr_no" }] },
        { element: [{ name: "pur_no" }] }
    ];
    //if (gw_com_api.getValue("frmOption", 1, "proj_no") == "" &&
    //    gw_com_api.getValue("frmOption", 1, "px_no") == "" &&
    //    gw_com_api.getValue("frmOption", 1, "pr_no") == "" &&
    //    gw_com_api.getValue("frmOption", 1, "pur_no") == "")
        remark.unshift({ infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] });

    args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "pr_emp", argument: "arg_pr_emp" },
                { name: "pr_dept", argument: "arg_pr_dept" },
                { name: "supp_nm", argument: "arg_supp_nm" },
                { name: "item_nm", argument: "arg_item_nm" },
                { name: "item_cd", argument: "arg_item_cd" },
                { name: "qc_tp", argument: "arg_qc_tp" },
                { name: "px_no", argument: "arg_px_no" },
                { name: "pr_no", argument: "arg_pr_no" },
                { name: "pur_no", argument: "arg_pur_no" }
            ],
            remark: remark
        },
        target: [
            { type: "GRID", id: "grdList_MAIN", select: true }
        ],
        key: param.key
    };
    if (param.excel) {
        var param = {
            type: args.source.type,
            targetid: args.source.id,
            row: args.source.row,
            element: args.source.element,
            argument: args.source.argument
        };
        var data = gw_com_module.elementtoARG(param);
        $.data($("#grdList_MAIN_form")[0], "master", data.obj);
        $.data($("#grdList_MAIN")[0], "argument", data.query);
        if (args.source.remark) {
            var param = {
                type: args.source.type,
                id: args.source.id,
                row: args.source.row,
                remark: args.source.remark
            };
            remark = gw_com_module.elementtoRemark(param);
            if (remark != "")
                $.data($("#grdList_MAIN")[0], "remark", remark);
        }
        $.ajaxSetup({ async: false });
        gw_com_api.block();
        gw_com_module.gridDownload({ targetid: "grdList_MAIN" });
        gw_com_api.unblock();
        $.ajaxSetup({ async: true });
    } else {
        gw_com_module.objRetrieve(args);
    }

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processClose(param) {

    if (parent == undefined || parent == null || parent.streamProcess == undefined || window == parent)
        window.close();
    else {
        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);
    }

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
function processFile(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function setProjInfo(param) {

    var rtn = "";
    var args = {
        name: "w_find_proj_scm_M_1",
        request: "PAGE",
        async: false,
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=w_find_proj_scm_M_1" +
            "&QRY_COLS=proj_no,proj_nm" +
            "&CRUD=R" +
            "&arg_proj_no=" + encodeURIComponent(param.proj_no) + "&arg_proj_nm=" + encodeURIComponent(param.proj_nm),
        handler_success: successRequest
    };
    //----------
    gw_com_module.callRequest(args);
    //----------
    function successRequest(data) {

        if (data.length == 1) {

            gw_com_api.setValue(param.object, param.row, param.nm, data[0].DATA[1], (param.type == "GRID"), false, false);
            gw_com_api.setValue(param.object, param.row, param.cd, data[0].DATA[0], (param.type == "GRID"), true, false);

        } else {

            v_global.event = param;
            v_global.logic.search = {
                proj_no: param.proj_no,
                proj_nm: param.proj_nm
            };
            gw_com_api.setValue(param.object, param.row, param.nm, "", (param.type == "GRID"));
            var args = {
                type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                width: 650, height: 460, open: true,
                id: gw_com_api.v_Stream.msg_selectProject_SCM
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: args.page,
                    param: {
                        ID: args.id,
                        data: v_global.logic.search
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }

    }
    //----------
    return rtn;

}
//----------
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
                switch (param.from.page) {
                    case "w_find_proj_scm":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectProject_SCM;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "DLG_SUPPLIER":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectSupplier;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "w_find_part_erp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectPart_SCM;
                            args.data = v_global.logic.search;
                        }
                        break;
                    case "DLG_PR":
                        {
                            args.ID = gw_com_api.v_Stream.msg_openDialogue;
                            args.data = v_global.logic.search;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            } break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                    case "DLG_PR":
                        if (param.data != undefined) {
                            gw_com_module.objClear({ target: [{ type: "FORM", id: "frmOption" }] });
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "pr_no", param.data.pr_no, (v_global.event.type == "GRID"));
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "ymd_fr", param.data.req_date, (v_global.event.type == "GRID"));
                            gw_com_api.setValue(v_global.event.object, v_global.event.row, "ymd_to", param.data.req_date, (v_global.event.type == "GRID"));
                        }
                        break;
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.nm, param.data.proj_nm, (v_global.event.type == "GRID"), false, false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.cd, param.data.proj_no, (v_global.event.type == "GRID"));
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedSupplier:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.cd, param.data.supp_cd, (v_global.event.type == "GRID"));
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.nm, param.data.supp_nm, (v_global.event.type == "GRID"));
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedPart_SCM:
            {
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.cd, param.data.part_cd, (v_global.event.type == "GRID"), false, false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.nm, param.data.part_nm, (v_global.event.type == "GRID"));
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//