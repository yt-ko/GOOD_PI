//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: {
        type: null,
        object: null,
        row: null,
        element: null
    },
    process: {
        param: null,
        entry: null,
        act: null,
        handler: null,
        current: {},
        prev: {}
    },
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

        start();

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

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };

        //==== Menu : Sub ====
/*        
        var args = { targetid: "lyrMenu_2", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);
        var args = { targetid: "lyrMenu_3", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);
        var args = { targetid: "lyrMenu_4", type: "FREE",
            element: [
				{ name: "추가", value: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        gw_com_module.buttonMenu(args);
*/
        //==== Option : Form Main ====

        //==== Grid : Main1 ====
         var args = { targetid: "grdData_Main1", query: "EDM_2020_M_1", title: "최근 등록 문서",
            caption: true, width: 550, height: 230, show: true, selectable: true, pager: false, number: true,
            element: [
				{ header: "파일명", name: "file_nm", width: 200, align: "left" },
				{ header: "Category", name: "folder_nm", width: 120, align: "center" },
				{ header: "등록자", name: "upd_usr", width: 60, align: "center" },
				{ header: "등록부서", name: "dept_nm", width: 80, align: "center" },
				{ header: "등록일시", name: "upd_dt", width: 120, align: "center" },
				{ name: "file_path", hidden: true },
				{ name: "file_seq", hidden: true },
				{ name: "file_id", hidden: true },
				{ name: "folder_id", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Main2 ====
        var args = { targetid: "grdData_Main2", query: "EDM_2020_M_2", title: "인기 다운로드 문서",
            caption: true, width: 550, height: 230, show: true, selectable: true, pager: false, number: true,
            element: [
				{ header: "파일명", name: "file_nm", width: 200, align: "left" },
				{ header: "횟수", name: "down_cnt", width: 40, align: "center" },
				{ header: "Category", hidden: true, name: "folder_nm", width: 120, align: "left" },
				{ header: "등록자", name: "user_nm", width: 60, align: "center" },
				{ header: "등록부서", name: "dept_nm", width: 80, align: "center" },
				{ header: "등록일시", name: "upd_dt", width: 120, align: "center" },
				{ name: "file_id", hidden: true },
				{ name: "folder_id", hidden: true }
			]
        };
        gw_com_module.gridCreate(args);

        //==== Grid : Chart1 ====
        var args = { targetid: "lyrChart_Main1", query: "EDM_2020_C_1", title: "지식 등록 순위", show: true,caption: true, 
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_1 }
        };
        gw_com_module.chartCreate(args);

        //==== Grid : Chart2 ====
        var args = { targetid: "lyrChart_Main2", query: "EDM_2020_C_2", title: "다운로드 순위", show: true,caption: true, 
            format: { view: "1", rotate: "0", reverse: "1" },
            control: { by: "DX", id: ctlChart_2 }
        };
        gw_com_module.chartCreate(args);

        //==== Grid : Main4 ====
//        var args = { targetid: "grdData_Main4", query: "EDM_2020_M_4", title: "나의 등록 문서",
//            caption: true, width: 550, height: 230, show: true, selectable: true, pager: false, number: true,
//            element: [
//                { header: "순번", hidden: true, name: "file_seq", width: 35, align: "center" },
//				{ header: "파일명", name: "file_nm", width: 300, align: "left" },
//				{ header: "Rev", name: "file_rev", width: 30, align: "center" },
//				{ header: "키워드", hidden: true, name: "search_tag", width: 200, align: "left" },
//				{ header: "설명", hidden: true, name: "file_desc", width: 300, align: "left" },
//				{ header: "등록자", hidden: true, name: "ins_usr", width: 70, align: "center" },
//				{ header: "등록일시", hidden: true, name: "ins_dt", width: 160, align: "center" },
//				{ header: "수정자", hidden: true, name: "upd_usr", width: 70, align: "center" },
//				{ header: "변경일시", name: "upd_dt", width: 90, align: "center" },
//				{ name: "file_path", hidden: true },
//				{ name: "file_ext", hidden: true },
//				{ name: "network_cd", hidden: true },
//				{ name: "use_yn", hidden: true },
//				{ name: "file_id", hidden: true },
//				{ name: "folder_id", hidden: true }
//			]
//        };
//        gw_com_module.gridCreate(args);

        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_Main1", offset: 8 },
                { type: "GRID", id: "grdData_Main2", offset: 8 },
                { type: "LAYER", id: "lyrChart_Main1", offset: 8 },
                { type: "LAYER", id: "lyrChart_Main2", offset: 8 }
			]
        };
        //----------
        gw_com_module.objResize(args);

        gw_job_process.procedure();

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {


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

        // Declare Grid Events
        var args = { targetid: "grdData_Main1", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Main1 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main1", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_Main1 };
        gw_com_module.eventBind(args);

        var args = { targetid: "grdData_Main2", grid: true, event: "rowdblclick", handler: rowdblclick_grdData_Main2 };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main2", grid: true, event: "rowkeyenter", handler: rowdblclick_grdData_Main2 };
        gw_com_module.eventBind(args);

        // Event Handler Functions : Grid
        function rowdblclick_grdData_Main1(ui) {
            var args = { ID: gw_com_api.v_Stream.msg_linkPage, to: { type: "MAIN" },
                data: { page: "EDM_2010", title: "최근 등록 문서",
                    param: [ { name: "option1", value: "Main1"},
                        { name: "file_nm", value: gw_com_api.getValue(ui.object, ui.row, "file_nm", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);
        }
        function rowdblclick_grdData_Main2(ui) {
            var args = { ID: gw_com_api.v_Stream.msg_linkPage, to: { type: "MAIN" },
                data: { page: "EDM_2010", title: "최근 변경 문서",
                    param: [ { name: "option1", value: "Main2"},
                        { name: "file_nm", value: gw_com_api.getValue(ui.object, ui.row, "file_nm", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);
        }

        //----------
        var args = {
            targetid: "grdData_Main1",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_Main1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_Main1",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_Main1
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_Main2",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_Main2
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_Main2",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_Main2
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_Main2",
            grid: true,
            event: "itemchanged",
            handler: itemchanged_grdData_Main2
        };
        gw_com_module.eventBind(args);
 
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ sub: true })) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processInsert;

            if (!checkUpdatable({ detail: true })) return;

            processInsert({ sub: true });

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({ sub: true });

        }
        //----------
        function click_lyrMenu_4_추가(ui) {

            if (!checkManipulate({ detail: true })) return;

            processInsert({ detail: true });

        }
        //----------
        function click_lyrMenu_4_삭제(ui) {

            if (!checkManipulate({ detail: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({ detail: true });

        }
        //----------
        function rowselecting_grdData_Main1(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_Main1(ui) {

            v_global.process.prev.master = ui.row;

            //toggleObject({ show: (gw_com_api.getValue(ui.object, ui.row, "rcode3", true) != "") ? true : false });
            processLink({});

        };
        //----------
        function rowselecting_grdData_Main2(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.sub = ui.row;

            return checkUpdatable({ sub: true });

        }
        //----------
        function rowselected_grdData_Main2(ui) {

            v_global.process.prev.sub = ui.row;

            processLink({ sub: true });

        };
        //----------
        function itemchanged_grdData_Main2(ui) {

            switch (ui.element) {
                case "dcode":
                    {
                        var ids = gw_com_api.getRowIDs("grdData_Main3");
                        $.each(ids, function () {
                            if (ui.value.prev == gw_com_api.getValue("grdData_Main3", this, "rcode", true))
                                gw_com_api.setValue("grdData_Main3", this, "rcode", ui.value.current, true);
                        });
                        var ids = gw_com_api.getRowIDs("grdData_Main4");
                        $.each(ids, function () {
                            if (ui.value.prev == gw_com_api.getValue("grdData_Main4", this, "rcode", true))
                                gw_com_api.setValue("grdData_Main4", this, "rcode", ui.value.current, true);
                        });
                    }
                    break;
            }
            return true;

        }
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
function toggleObject(param) {

}
//----------
function checkCRUD(param) {

if (param.sub)
        return gw_com_api.getCRUD("grdData_Main2", "selected", true);
    else
        return ((gw_com_api.getSelectedRow("grdData_Main1") == null) ? "none" : "");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_Main2", refer: (param.sub || param.detail) ? true : false }
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create")
        processDelete(param);
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_part", value: "CS" }
			]
        },
        target: [
			{ type: "GRID", id: "grdData_Main1", select: true },
			{ type: "GRID", id: "grdData_Main2", select: true },
			{ type: "CHART", id: "lyrChart_Main1" },
			{ type: "CHART", id: "lyrChart_Main2" }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_Main2", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_Main1", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {

    var args = {};
    if (param.sub)
        args = { targetid: "grdData_Main3", updatable: true, edit: true,
            data: [
                { name: "hcode", value: gw_com_api.getValue("grdData_Main1", "selected", "rcode2", true) },
                { name: "rcode", value: gw_com_api.getValue("grdData_Main2", "selected", "dcode", true) }
            ]
        };
    else
        args = { targetid: "grdData_Main2", updatable: true, edit: true,
            data: [
                { name: "hcode", value: gw_com_api.getValue("grdData_Main1", "selected", "hcode", true) }
            ]
        };
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {
        row: "selected",
        remove: true
    };
    if (param.sub) {
        args.targetid = "grdData_Main3";
        args.clear = [
            {
                type: "GRID",
                id: "grdData_Main4"
            }
        ];
    }
    else {
        args.targetid = "grdData_Main2";
        args.clear = [
            {
                type: "GRID",
                id: "grdData_Main3"
            },
            {
                type: "GRID",
                id: "grdData_Main4"
            }
        ];
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_Main2"
            },
			{
			    type: "GRID",
			    id: "grdData_Main3"
			},
			{
			    type: "GRID",
			    id: "grdData_Main4"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave,
        param: param
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {


}
//----------
function processRestore(param) {


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
function completeRemove(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response, param: param });

}
//----------
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processLink({ key: response });
    else {
        status = checkCRUD({ sub: true });
        if (status == "create" || status == "update")
            processLink({ sub: true, key: response });
        else
            processLink({ detail: true, key: response });
    }

}
//----------
function successRemove(response, param) {

    if (response.VALUE[0] != -1)
        processDelete(param);

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
                                processSave(param.data.arg);
                            else {
                                var status = checkCRUD(param.data.arg);
                                if (status == "initialize" || status == "create")
                                    processDelete(param.data.arg);
                                else if (status == "update")
                                    processRestore(param.data.arg);
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove(param.data.arg);
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
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//