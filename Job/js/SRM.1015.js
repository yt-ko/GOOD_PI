//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 입찰/견적 의뢰품목 선택
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

var r_barcode;

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
                {
                    type: "INLINE", name: "요청구분",
                    data: [
                        { title: "전체", value: "%" },
                        { title: "입고", value: "1" },
                        { title: "비입고", value: "2" }
                    ]
                },
                {
                    type: "INLINE", name: "단가여부",
                    data: [
                        { title: "없음", value: "0" },
                        { title: "있음", value: "1" },
                        { title: "전체", value: "%" }
                    ]
                },
				{
				    type: "PAGE", name: "장비군", query: "dddw_prodgroup"
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() { 

            gw_job_process.UI();
        	gw_job_process.procedure();
            
        	gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -7 }));
        	gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        	gw_com_api.setValue("frmOption", 1, "dept_area", "DP");

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "저장", value: "등록" },
				{ name: "닫기", value: "취소", icon: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, //remark: "lyrRemark2",
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                style: { colfloat: "floating" },
                                name: "ymd_fr", label: { title: "구매요청일 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }
                            },
				            {
				                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
				                editable: { type: "text", size: 7, maxlength: 10, validate: { rule: "dateISO" } }
				            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "장비군" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No : " }, mask: "search",
                                editable: { type: "text", size: 12 }
                            },
                            {
                                name: "price_yn", label: { title: "단가여부 : " },
                                editable: { type: "select", data: { memory: "단가여부" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pr_no", label: { title: "구매요청번호 :" },
                                editable: { type: "text", size: 20/*, validate: { rule: "required", message: "구매요청번호" }*/ },
                                tip: { text: "여러 구매요청번호는 콤마(,)로 구분하여 입력하세요.", color: "#505050" }
                            },
				            {
				                name: "pr_emp_nm", label: { title: "요청자 :" },
				                editable: { type: "text", size: 8 }
				            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "px_no", label: { title: "PX No. :" },
                                editable: { type: "text", size: 10 }
                            },
                            {
                                name: "pr_type", label: { title: "요청구분 :" },
                                editable: { type: "select", data: { memory: "요청구분" } },
                            }
                        ]
                    },
                    {
                        element: [
			                { name: "실행", value: "실행", act: true, format: { type: "button" } },
			                { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ], align: "right"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MAIN", query: "SRM_1015_1", title: "구매요청목록",
            caption: true, height: 400, pager: false, show: true, selectable: true, number: false, multi: true, checkrow: true,
            element: [
				{ header: "PX No.", name: "px_no", width: 90 },
				{ header: "품번", name: "item_cd", width: 80 },
				{ header: "품명", name: "item_nm", width: 130 },
				{ header: "규격", name: "item_spec", width: 130 },
				{ header: "수량", name: "qty", width: 50, align: "right", mask: "numeric-int" },
				{ header: "단위", name: "uom", width: 50, align: "center" },
				{ header: "납기요청일", name: "dlvr_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "Tracking No.", name: "proj_no", width: 80, align: "center" },
                { header: "Project Name", name: "proj_nm", width: 130, hidden: true },
				{ header: "구매요청일", name: "pr_date", width: 80, align: "center", mask: "date-ymd" },
				{ header: "요청자", name: "pr_emp_nm", width: 40, align: "center" },
				{ header: "요청구분", name: "pr_type_nm", width: 60, align: "center" },
				{ header: "구매요청번호", name: "pr_no", width: 90 },
                { header: "주거래처", name: "std_supp_nm", width: 100 },
                { header: "입찰/견적상태", name: "per_stat_nm", width: 80, align: "center" },
                { header: "도면배포", name: "item_dist_no", width: 70 },
                { name: "std_supp_cd", hidden: true },
                { name: "pr_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 15 }
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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: viewOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processSave };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", event: "itemdblclick", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemkeyenter", handler: processItemdblClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================

        // startup process.
        //----------
        gw_com_module.startPage();
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
function processItemchanged(param) {

}
//----------
function processItemdblClick(param) {

    switch (param.element) {
        case "proj_no":
            processFind(param);
            break;
    }

}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (!gw_com_module.objValidate(args)) return;

    args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "price_yn", argument: "arg_price_yn" },
                { name: "pr_no", argument: "arg_pr_no" },
                { name: "pr_emp_nm", argument: "arg_pr_emp_nm" },
                { name: "px_no", argument: "arg_px_no" },
                { name: "pr_type", argument: "arg_pr_type" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MAIN" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

};
//----------
function processSave(param) {

    var ids = gw_com_api.getSelectedRow("grdList_MAIN", true);
    if (ids.length < 1 || ids == undefined) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var pr_no = "";
    $.each(ids, function () {
        pr_no += (pr_no == "" ? "" : "^") + gw_com_api.getValue("grdList_MAIN", this, "pr_no", true) + "," + gw_com_api.getValue("grdList_MAIN", this, "pr_seq", true) + ",";
    })
    
    var args = {
        url: "COM",
        procedure: "sp_createPER",
        nomessage: true,
        input: [
            { name: "pr_no", value: pr_no, type: "varchar" },
            { name: "user_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "per_no", value: v_global.logic.per_no, type: "varchar" },
            { name: "err_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    var per_no = response.VALUE[0];
    if (per_no == "") {
        gw_com_api.messageBox([{ text: response.VALUE[1] }]);
    } else {
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: { per_no: per_no }
        };
        gw_com_module.streamInterface(args);
        processClear({});
    }

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_MAIN" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

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
function processFind(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.logic.search = null;

    var args;
    switch (param.element) {
        case "proj_nm":
        case "proj_no":
            v_global.event.cd = "proj_no";
            v_global.event.nm = "proj_nm";
            if (param.object == "frmOption") {
                v_global.logic.search = {
                    proj_no: (param.element == "proj_no" ? gw_com_api.getValue(param.object, param.row, param.element) : ""),
                    proj_nm: (param.element == "proj_nm" ? gw_com_api.getValue(param.object, param.row, param.element) : "")
                };
            }
            args = {
                type: "PAGE", page: "w_find_proj_scm", title: "Project 검색",
                width: 650, height: 460, open: true,
                id: gw_com_api.v_Stream.msg_selectProject_SCM
            };
            break;
        default:
            return;
            break;
    }
    if (gw_com_module.dialoguePrepare(args) == false) {
        args = { page: args.page, param: { ID: args.id, data: v_global.logic.search } };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue: {
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
                default:
                    //if (param.data != undefined) {
                    //    $.each(param.data, function (name, value) {
                    //        gw_com_api.setValue("frmOption", 1, name, value);
                    //    });
                    //    processRetrieve({});
                    //    gw_com_api.show("frmOption");
                    //}
                    v_global.logic.per_no = (param.data == undefined ? "" : param.data.per_no);
                    gw_com_api.show("frmOption");
                    return;
                    break;
            }
            gw_com_module.streamInterface(args);

        } break;
        case gw_com_api.v_Stream.msg_closeDialogue: {
            closeDialogue({ page: param.from.page });
        } break;
        case gw_com_api.v_Stream.msg_resultMessage: {
            if (param.data.page != gw_com_api.getPageID()) break;
        } break;
        case gw_com_api.v_Stream.msg_selectedProject_SCM: {
            gw_com_api.setValue(v_global.event.object,
			                    v_global.event.row,
			                    v_global.event.cd,
			                    param.data.proj_no,
			                    (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(v_global.event.object,
			                    v_global.event.row,
			                    v_global.event.nm,
			                    param.data.proj_nm,
			                    (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedEmployee: {
            if (param.data != undefined) {
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.nm,
                                    param.data.emp_nm,
                                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
                                    v_global.event.row,
                                    v_global.event.cd,
                                    param.data.emp_no,
                                    (v_global.event.type == "GRID") ? true : false);
                if (v_global.event.cd == "qc_emp") {
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        "qc_dept_nm",
                                        param.data.dept_nm,
                                        (v_global.event.type == "GRID") ? true : false);
                    gw_com_api.setValue(
                                        v_global.event.object,
                                        v_global.event.row,
                                        "qc_dept",
                                        param.data.dept_cd,
                                        (v_global.event.type == "GRID") ? true : false);
                }
            }
            closeDialogue({ page: param.from.page, focus: true });
        } break;
        case gw_com_api.v_Stream.msg_selectedDepartment: {
            gw_com_api.setValue(
                                v_global.event.object,
                                v_global.event.row,
                                v_global.event.nm,
                                param.data.dept_nm,
                                (v_global.event.type == "GRID") ? true : false);
            gw_com_api.setValue(
                                v_global.event.object,
			                    v_global.event.row,
			                    v_global.event.cd,
			                    param.data.dept_cd,
			                    (v_global.event.type == "GRID") ? true : false);
            closeDialogue({ page: param.from.page, focus: true });

        } break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//