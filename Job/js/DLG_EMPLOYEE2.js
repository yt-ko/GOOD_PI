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
        var args = {
            request: [
				{
				    type: "INLINE", name: "구분",
				    data: [
                        { title: "사원", value: "EMP" },
                        { title: "협력사", value: "SUPP" }
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
            gw_job_process.procedure();

            var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
            gw_com_module.streamInterface(args);

            gw_com_module.startPage();
            gw_com_api.show("btnArrow");
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
				{ name: "저장", value: "확인", icon: "저장" },
				{ name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: false, align: "left",
            editable: { bind: "open", focus: "dept_nm", validate: true },
            //remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
				            {
				                name: "search", label: { title: "검색 :" },
				                editable: { type: "text", size: 15, maxlength: 50 }
				            },
                            { name: "dept_cd", hidden: true },
				            { name: "실행", act: true, show: false, format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_USER", query: "DLG_EMPLOYEE2_1", title: "사원 목록",
            height: 270, show: true, selectable: true, pager: false,
            //treegrid: { element: "dp_nm" },
            element: [
				{ header: "사원", name: "dp_nm", width: 250, align: "left", format: { type: "label" } },
				{ name: "emp_nm", hidden: true },
				{ name: "emp_no", hidden: true },
				{ name: "dept_cd", hidden: true },
				{ name: "dept_nm", hidden: true },
                { name: "pos_nm", hidden: true },
                { name: "user_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_RESULT", query: "", title: "",
            height: 270, show: true, selectable: true, pager: false,
            element: [
                { header: "사원", name: "dp_nm", width: 200 },
                { name: "emp_nm", hidden: true },
                { name: "emp_no", hidden: true },
                { name: "dept_nm", hidden: true },
                { name: "dept_cd", hidden: true },
                { name: "pos_nm", hidden: true },
                { name: "user_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_USER", offset: 8 },
                { type: "GRID", id: "grdList_RESULT", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnRightAll", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnRight", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnLeftAll", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "btnLeft", event: "click", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_USER", grid: true, event: "rowdblclick", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_RESULT", grid: true, event: "rowdblclick", handler: processCopy };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    if (param.object == "lyrMenu") {
        switch (param.element) {
            case "저장":
                processSave();
                break;
            case "닫기":
                processClose();
                break;
        }
    }

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "FORM", id: "frmOption",
            element: [
                { name: "dept_cd", argument: "arg_dept_cd" },
                { name: "search", argument: "arg_search" }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_USER", select: false }
        ],
        clear: [
            { type: "GRID", id: "grdList_RESULT" }
        ],
        handler: { complete: processRetrieveEnd, param: param }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processSave(param) {

    processResult({});

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "GRID", id: "grdList_USER" },
            { type: "GRID", id: "grdList_RESULT" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
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
function processResult(param) {

    var data = new Array();
    var ids = gw_com_api.getRowIDs("grdList_RESULT");
    $.each(ids, function () {
        data[data.length] = {
            emp_no: gw_com_api.getValue("grdList_RESULT", this, "emp_no", true),
            emp_nm: gw_com_api.getValue("grdList_RESULT", this, "emp_nm", true),
            dept_cd: gw_com_api.getValue("grdList_RESULT", this, "dept_cd", true),
            dept_nm: gw_com_api.getValue("grdList_RESULT", this, "dept_nm", true),
            pos_nm: gw_com_api.getValue("grdList_RESULT", this, "pos_nm", true),
            user_id: gw_com_api.getValue("grdList_RESULT", this, "user_id", true)
        }
    });
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: data
    };
    gw_com_module.streamInterface(args);

}
//----------
function processSetData(param) {

    //gw_com_module.objClear({
    //    target: [{ type: "GRID", id: "grdList_RESULT" }]
    //});

    //var emp_no = v_global.logic.emp.emp_no.split('^');
    //var dp_nm = v_global.logic.emp.dp_nm.split(', ');
    //var data = new Array();
    //$.each(emp_no, function (i) {
    //    if (emp_no[i] == "" || emp_no[i] == undefined) return;
    //    data.push({
    //        emp_no: emp_no[i],
    //        dp_nm: dp_nm[i]
    //    })
    //});

    //if (data != null) {
    //    var args = {
    //        targetid: "grdList_RESULT",
    //        data: data
    //    };
    //    gw_com_module.gridInserts(args);
    //}

}
//----------
function processCopy(param) {

    gw_com_api.block("grdList_USER");
    gw_com_api.block("grdList_RESULT");

    var _all = false;
    var _ann_key = gw_com_api.getValue("frmData_Main", 1, "ann_key");
    var _ids = new Array();
    var _data = new Array();
    var _source = "";
    var _target = "";

    switch (param.object) {
        case "btnRightAll":
            _all = true;
        case "btnRight":
        case "grdList_USER":
            _source = "grdList_USER";
            _target = "grdList_RESULT";
            break;
        case "btnLeftAll":
            _all = true;
        case "btnLeft":
        case "grdList_RESULT":
            _source = "grdList_RESULT";
            _target = "grdList_USER";
            break;
    }

    if (_all)
        _ids = gw_com_api.getRowIDs(_source);
    else
        _ids.push(gw_com_api.getSelectedRow(_source, false));

    if (_ids.length > 0) {
        if (_target == "grdList_RESULT") {
            for (var i = 0 ; i < _ids.length; i++) {
                var emp_nm = gw_com_api.getValue(_source, _ids[i], "emp_nm", true);
                var emp_no = gw_com_api.getValue(_source, _ids[i], "emp_no", true);
                var dp_nm = emp_nm + '(' + gw_com_api.getValue(_source, _ids[i], "dept_nm", true) + ')';//gw_com_api.getValue(_source, _ids[i], "dp_nm", true);
                var user_id = gw_com_api.getValue(_source, _ids[i], "user_id", true);
                var dept_nm = gw_com_api.getValue(_source, _ids[i], "dept_nm", true);
                var dept_cd = gw_com_api.getValue(_source, _ids[i], "dept_cd", true);
                var pos_nm = gw_com_api.getValue(_source, _ids[i], "pos_nm", true);
                if (emp_no == "" || emp_no == "undefined") continue;
                if (gw_com_api.getFindRow(_target, "emp_no", emp_no) > 0) continue;
                _data.push({
                    dp_nm: dp_nm,
                    emp_nm: emp_nm,
                    emp_no: emp_no,
                    dept_nm: dept_nm,
                    dept_cd: dept_cd,
                    pos_nm: pos_nm,
                    user_id: user_id
                });
            }
            gw_com_module.gridInserts({ targetid: _target, data: _data, focus: true });
        }

        if (_source == "grdList_RESULT") {
            if (_all) {
                var args = {
                    target: [
                        { type: "GRID", id: _source }
                    ]
                };
                gw_com_module.objClear(args);
            } else {
                for (var i = _ids.length - 1; i >= 0; i--) {
                    gw_com_module.gridDelete({ targetid: _source, row: _ids[i], select: true });
                }
            }
        }
    }
    gw_com_api.unblock("grdList_USER");
    gw_com_api.unblock("grdList_RESULT");

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.logic.emp = param.data;
                var dept_cd = param.data.dept_cd == undefined ? "" : param.data.dept_cd;
                if (gw_com_api.getValue("frmOption", 1, "dept_cd") != dept_cd) {
                    gw_com_api.setValue("frmOption", 1, "dept_cd", dept_cd)
                    processRetrieve({});
                }
                processSetData({});

                if (!v_global.process.init) {
                    v_global.process.init = true;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) {
                    param.emp = {
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                //switch (param.from.page) {
                //    case "w_find_emp":
                //        if (param.data != undefined) {
                //            gw_com_api.setValue(
                //                                v_global.event.object,
                //                                v_global.event.row,
                //                                v_global.event.element,
                //                                param.data.emp_nm,
                //                                (v_global.event.type == "GRID") ? true : false);
                //            gw_com_api.setValue(
                //                                v_global.event.object,
                //                                v_global.event.row,
                //                                v_global.event.element.substr(0, v_global.event.element.length - 3),
                //                                param.data.emp_no,
                //                                (v_global.event.type == "GRID") ? true : false);
                //        }
                //        //closeDialogue({ page: param.from.page, focus: true });
                //        break;
                //}

                //closeDialogue({ page: param.from.page });
            }
            break;

    };

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//