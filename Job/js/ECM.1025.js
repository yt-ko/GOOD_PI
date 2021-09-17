//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약양식선택
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

        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
				{
				    type: "PAGE", name: "ISCM81", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ISCM81" }]
				}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() { 

            gw_job_process.UI();
        	gw_job_process.procedure();

        	var args = { ID: gw_com_api.v_Stream.msg_openedDialogue };
        	gw_com_module.streamInterface(args);

        	gw_com_module.startPage();
        }
    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "조회", value: "조회" },
                { name: "저장", value: "확인" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, border: true, show: true, remark: "lyrRemark",
            editable: { focus: "doc_nm", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "doc_nm", label: { title: "파일명 :" },
                                editable: { type: "text", size: 20 }
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
            targetid: "grdList_MAIN", query: "ECM_1021_1", title: "계약분류",
            caption: false, height: 300, pager: false, show: true, selectable: true, number: true, key: true,
            element: [
				{ header: "분류명", name: "grp_nm", width: 100 },
				{ header: "파일명", name: "doc_nm", width: 300 },
                {
                    header: "표준", name: "std_yn", width: 40, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { name: "std_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_SUB", query: "ECM_1021_2", title: "부속서류",
            caption: true, height: 24, pager: false, show: true, selectable: true, multi: true, checkrow: true,
            element: [
				{ header: "파일명", name: "doc_nm" },
                { name: "std_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "grdList_MAIN", offset: 8 },
                { type: "GRID", id: "grdList_SUB", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowdblclick", handler: informResult };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MAIN", grid: true, event: "rowkeyenter", handler: informResult };
        gw_com_module.eventBind(args);
        //=====================================================================================

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
function processRetrieve(param) {

    var args;
    if (param.object == "grdList_MAIN")
    {
        args = {
            source: {
                type: "GRID", id: "grdList_MAIN", row: "selected",
                element: [
                    { name: "std_id", argument: "arg_std_id" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_SUB" }
            ],
            key: param.key,
            handler: {
                complete: processRetrieveEnd,
                param: param
            }
        };
    }
    else
    {
        args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "doc_nm", argument: "arg_doc_nm" }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MAIN", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_SUB" }
            ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

};
//----------
function processRetrieveEnd(param) {

    // 전체선택
    if (param.object == "grdList_MAIN")
    {
        $("#cb_grdList_SUB_data").attr("checked", true);
        $("#cb_grdList_SUB_data").trigger('click');
        $("#cb_grdList_SUB_data").attr("checked", true);
    }

}
//----------
function informResult(param) {

    var std_id = gw_com_api.getValue("grdList_MAIN", "selected", "std_id", true);
    var sub_id = "";
    var ids = gw_com_api.getSelectedRow("grdList_SUB", true);
    $.each(ids, function () {
        sub_id += (sub_id == "" ? "" : ",") + gw_com_api.getValue("grdList_SUB", this, "std_id", true);
    });

    var args = {
        url: "COM",
        procedure: "sp_createECMDoc",
        nomessage: true,
        input: [
            { name: "std_id", value: std_id, type: "int" },
            { name: "sub_id", value: sub_id, type: "varchar" },
            { name: "cert_yn", value: "0", type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "doc_id", type: "int" },
            { name: "doc_no", type: "varchar" },
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

    if (response.VALUE[0] == "" || response.VALUE[0] == "0") {
        gw_com_api.messageBox([{ text: response.VALUE[1] }]);
    } else {
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: {
                doc_id: response.VALUE[0],
                doc_no: response.VALUE[1]
            }
        };
        gw_com_module.streamInterface(args);
        //processClear({});
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
    if (param != undefined && param.data != undefined)
        args.data = param.data;
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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                if (!v_global.logic.retrieve) processRetrieve({});
                v_global.logic.retrieve = true;
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage:
            {
                if (param.data.page != gw_com_api.getPageID()) break;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//