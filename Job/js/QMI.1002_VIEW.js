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

        var args = {
            request: [
                {
                    type: "PAGE", name: "상태구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI11" }]
                },
                //{
                //    type: "PAGE", name: "구매처", query: "dddw_zcode",
                //    param: [{ argument: "arg_hcode", value: "QMI12" }]
                //},
                {
                    type: "PAGE", name: "용도별분류", query: "DDDW_QMI_TP1"
                },
                {
                    type: "PAGE", name: "변동구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI31" }]
                },
                {
                    type: "PAGE", name: "부속상태구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI21" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                { type: "PAGE", name: "보관부서", query: "dddw_dept" },
                //{
                //    type: "INLINE", name: "교정주기",
                //    data: [{ title: "1년", value: "12" }, { title: "2년", value: "24" }, { title: "3년", value: "36" }, { title: "4년", value: "48" }, { title: "5년", value: "60" }]
                //},
                {
                    type: "PAGE", name: "교정주기", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "QMI51" }]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        // start();
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

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
        var args = {
            targetid: "lyrMenu_1", type: "FREE",
            element: [
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MASTER", query: "QMI_1002_1", type: "TABLE", title: "계측기 정보",
            caption: true, show: true, selectable: true,
            content: { width: { label: 80, field: 170 }, height: 25,
                row: [
                    {
                        element: [
                            { header: true, value: "관리번호", format: { type: "label" } },
                            { name: "qmi_no", align: "center", editable: { type: "hidden" } },
                            { header: true, value: "기기명", format: { type: "label" } },
                            { name: "qmi_nm", editable: { type: "text", validate: { rule: "required" } } },
                            //{ header: true, value: "형식", format: { type: "label" } },
                            //{ name: "spec", editable: { type: "text" } },
                            { header: true, value: "상태구분", format: { type: "label" } },
                            {
                                name: "pstat", format: { type: "select", data: { memory: "상태구분" } },
                                editable: { type: "select", data: { memory: "상태구분", unshift: [{ title: "-", value: "" }] }, validate: { rule: "required" } }
                            },
                            { name: "qmi_key", hidden: true },
                            { header: true, value: "Model No.", format: { type: "label" } },
                            { name: "model_no", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Serial No.", format: { type: "label" } },
                            { name: "ser_no", editable: { type: "text" } },
                            //{ header: true, value: "용도", format: { type: "label" } },
                            //{ name: "usage", editable: { type: "text" } },
                            { header: true, value: "제조사", format: { type: "label" } },
                            { name: "maker_nm", editable: { type: "text" } },
                            { header: true, value: "구매/생산일자", format: { type: "label" } },
                            {
                                name: "pur_date", mask: "date-ymd",
                                editable: { type: "text", validate: { rule: "required" } }
                            },
                            { header: true, value: "구매가격", format: { type: "label" } },
                            { name: "-" }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "교정여부", format: { type: "label" } },
                            {
                                name: "calibrate_yn",
                                format: { type: "checkbox", title: "", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "", value: "1", offval: "0" }
                            },
                            { header: true, value: "교정주기", format: { type: "label" } },
                            { 
                                name: "calibrate_term",
                                format: { type: "select", data: { memory: "교정주기" } },
                                editable: {
                                    type: "select", data: { memory: "교정주기" }, validate: { rule: "required" }, bind: "create"
                                }
                            },
                            { header: true, value: "차기교정일", format: { type: "label" } },
                            { name: "next_calibrate_date", editable: { type: "hidden", width: 200 }, mask: "date-ymd", display: true },
                            { header: true, value: "비교정사유", format: { type: "label" } },
                            { name: "calibrate_reason", editable: { type: "text" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label" } },
                            { name: "dept_area_nm", editable: { type: "text" }, mask: "search", display: true },
                            { header: true, value: "담당자", format: { type: "label" } },
                            { name: "mng_emp_nm", editable: { type: "text" }, mask: "search", display: true },
                            { name: "mng_emp", editable: { type: "text" }, hidden: true },
                            { header: true, value: "관리부서", format: { type: "label" } },
                            { name: "mng_dept_nm", editable: { type: "text" }, mask: "search", display: true },
                            { name: "mng_dept", editable: { type: "text" }, hidden: true },
                            { header: true, value: "용도별분류", format: { type: "label" } },
                            {
                                name: "class1_cd",
                                format: { type: "select", data: { memory: "용도별분류" } },
                                editable: {
                                    type: "select", data: { memory: "용도별분류" }, validate: { rule: "required" }, bind: "create"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "보관위치", format: { type: "label" } },
                            { name: "keep_spot", editable: { type: "text", width: 467 }, style: { colspan: 3 } },
                            { header: true, value: "비고", format: { type: "label" } },
                            { name: "mng_rmk", editable: { type: "text", width: 467 }, style: { colspan: 3 } }
                        ]
                    }//,
                    //{
                    //    element: [
                    //        { header: true, value: "비고", format: { type: "label" } },
                    //        { name: "mng_rmk", editable: { type: "text", width: 467 }, style: { colspan: 3 } },
                    //        { header: true, value: "", format: { type: "label" } },
                    //        { name: "" },
                    //        { header: true, value: "", format: { type: "label" } },
                    //        { name: "" }
                    //    ]
                    //}
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_PART", query: "QMI_1002_3", title: "부속품",
            caption: true, height: 475, pager: false, show: true, selectable: true, number: true,
            element: [
				{
				    header: "부속품명", name: "part_nm", width: 170,
				    editable: { type: "text", width: 236, validate: { rule: "required" } }
				},
				{
				    header: "수량", name: "part_qty", width: 40, mask: "numeric-int",
				    editable: { type: "text", width: 60, validate: { rule: "required" } }
				}
                ,
				{
				    header: "계측기상태", name: "pstat", width: 60, align: "center",
				    editable: {
				        type: "select", width: 80, validate: { rule: "required" },
				        data: { memory: "부속상태구분", unshift: [{ title: "-", value: "" }] }
				    }
				},
                { name: "qmi_key", hidden: true, editable: { type: "hidden"}},
                { name: "qmi_seq", hidden: true, editable: { type: "hidden"} }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MEMO", query: "QMI_1002_2", type: "TABLE", title: "사진",
            show: true, selectable: true, fixed: true, caption: true,
            editable: { bind: "select", validate: true },
            content: { height: 500, width: { field: "100%" },
                row: [
                    {
                        element: [
                            { name: "memo_html", format: { type: "html", height: 500 } },
                            { name: "memo_text", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_text2", hidden: true, editable: { type: "hidden" } },
                            { name: "img_src", hidden: true, editable: { type: "hidden" } },
                            { name: "memo_tp", hidden: true, editable: { type: "hidden" } },
                            { name: "qmi_key", hidden: true, editable: { type: "hidden"} },
                            { name: "qmi_seq", hidden: true, editable: { type: "hidden"} }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_CHANGE", query: "QMI_1002_4", title: "이력사항(교정검사, 수리내역, 기타사항)",
            caption: true, height: "100%", pager: false, show: true, selectable: true, number: true,
            element: [
				{
				    header: "변동구분", name: "chg_tp", width: 40, align: "center",
				    //format: { type: "select", data: { memory: "변동구분" }, width: 70 },
				    editable: { type: "select", data: { memory: "변동구분" }, width: 70, validate: { rule: "required" } }
				},
				{
				    header: "변동일자", name: "chg_date", width: 60, align: "center", mask: "date-ymd",
				    editable: { type: "text", validate: { rule: "required" }, width: 100 }
				},
				{ header: "업체", name: "vendor_nm", width: 80, editable: { type: "text", width: 160 } },
                {
                    header: "유효기간", name: "valid_date", width: 60, align: "center", mask: "date-ymd",
                    editable: { type: "text", width: 100 }
                },
				{ header: "내용", name: "chg_rmk", width: 150, editable: { type: "text", width: 290 } },
                {
                    header: "교정담당자", name: "chk_emp_nm", width: 60, align: "center", mask: "search",
                    editable: { type: "text", width: 100 }, display: true
                },
                {
                    header: "확인일자", name: "chk_date", width: 60, align: "center",
                    mask: "date-ymd", editable: { type: "text", width: 100 }
                },
                { name: "qmi_key", hidden: true, editable: { type: "hidden" } },
                { name: "qmi_seq", hidden: true, editable: { type: "hidden" } },
                { name: "chk_emp", hidden: true, editable: { type: "hidden" } }

			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_FILE", query: "QMI_1002_5", title: "첨부 파일",
            caption: true, height: "100%", pager: false, show: true, number: true, selectable: true,
            element: [
				{ header: "파일명", name: "file_nm", width: 270, align: "left" },
				{ header: "다운로드", name: "download", width: 60, align: "center", format: { type: "link", value: "다운로드"} },
                { header: "등록자", name: "upd_usr", width: 70, align: "center" },
                { header: "부서", name: "upd_dept", width: 80, align: "center" },
				{ header: "설명", name: "file_desc", width: 330, align: "left", editable: { type: "text"} },
                { name: "file_path", hidden: true },
                { name: "file_id", hidden: true, editable: { type: "hidden"} },
				{ name: "_edit_yn", hidden: true }
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
				{ type: "FORM", id: "frmData_MASTER", offset: 8 },
				{ type: "FORM", id: "frmData_MEMO", offset: 8 },
                { type: "GRID", id: "grdData_PART", offset: 8 },
                { type: "GRID", id: "grdData_CHANGE", offset: 8 },
                { type: "GRID", id: "grdData_FILE", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);

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
        var args = { targetid: "lyrMenu_1", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_FILE", grid: true, element: "download", event: "click", handler: processFile };
        gw_com_module.eventBind(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processFile(param) {

    if (param.object == "grdData_FILE") {
        var args = {
            source: { id: "grdData_FILE", row: gw_com_api.getSelectedRow("grdData_FILE") },
            targetid: "lyrDown"
        };
        gw_com_module.downloadFile(args);
    } else {
        if (!checkManipulate({})) return false;
        if (!checkUpdatable({ master: true, check: true })) return false;
        var args = {
            type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드",
            width: 650, height: 140, /* locate: ["center", 500], */ open: true,
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            args = {
                page: args.page,
                param: {
                    ID: gw_com_api.v_Stream.msg_openedDialogue,
                    data: {
                        type: "QMI",
                        key: (gw_com_api.getValue("frmData_MASTER", 1, "qmi_key") == "" ? null : gw_com_api.getValue("frmData_MASTER", 1, "qmi_key")),
                        seq: null
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function checkCRUD(param) {

    if (param.part)
        return gw_com_api.getCRUD("grdData_PART", "selected", true);
    else if (param.change)
        return gw_com_api.getCRUD("grdData_CHANGE", "selected", true);
    else
        return gw_com_api.getCRUD("frmData_MASTER");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;
}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        param: param,
        target: []
    };

    if (param.master || param.all)
        args.target.push({ type: "FORM", id: "frmData_MASTER" });
    
    if (param.part || param.all)
        args.target.push({ type: "GRID", id: "grdData_PART" });
    
    if (param.change || param.all)
        args.target.push({ type: "GRID", id: "grdData_CHANGE" });

    if (param.memo || param.all)
        args.target.push({ type: "FORM", id: "frmData_MEMO" });

    if (param.file || param.all)
        args.target.push({ type: "GRID", id: "grdData_FILE" });

    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    if (v_global.logic.qmi_key == "") return false;
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_qmi_key", value: v_global.logic.qmi_key }
            ]
        },
        target: [
			{ type: "FORM", id: "frmData_MASTER" },
			{ type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_PART" },
			{ type: "GRID", id: "grdData_CHANGE" },
            { type: "GRID", id: "grdData_FILE" }
		]
    };

    if (param.target != undefined) {
        args.target = [];
        $.each(param.target, function () {
            var target;
            switch (this.toString()) {
                case "frmData_MASTER":
                    target = { type: "FORM", id: this, edit: true };
                    break;
                case "frmData_MEMO":
                    target = { type: "FORM", id: this, edit: true };
                    break;
                case "grdData_PART":
                    target = { type: "GRID", id: this, select: true };
                    break;
                case "grdData_CHANGE":
                    target = { type: "GRID", id: this, select: true };
                    break;
                case "grdData_FILE":
                    target = { type: "GRID", id: this, select: true };
                    break;
            }
            if (target != undefined)
                args.target.push(target);
        });
    }
    
    gw_com_module.objRetrieve(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_MASTER" },
            { type: "FORM", id: "frmData_MEMO" },
            { type: "GRID", id: "grdData_PART" },
            { type: "GRID", id: "grdData_CHANGE" },
            { type: "GRID", id: "grdData_FILE" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    processClear({});
    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    if (param != undefined && param.data != undefined)
        args.data = param.data;
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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };

                v_global.logic.qmi_key = param.data.qmi_key;
                processRetrieve({});
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                switch (param.from.page) {
                }
                closeDialogue({ page: param.from.page });
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
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//