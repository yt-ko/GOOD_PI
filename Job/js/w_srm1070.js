//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2019.04)
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                    {
                        type: "INLINE", name: "상태",
                        data: [
                            { title: "정상", value: "N" },
                            { title: "취소", value: "Y" }
                        ]
                    }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // start.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //----------
            if (gw_com_api.getPageParameter("pur_no") != "")
                gw_com_api.setValue("frmOption", 1, "root_no", gw_com_api.getPageParameter("pur_no"));
            else if (gw_com_api.getPageParameter("booking_no") != "")
                gw_com_api.setValue("frmOption", 1, "root_no", gw_com_api.getPageParameter("booking_no"));

            gw_com_api.setValue("frmOption", 1, "item_no", gw_com_api.getPageParameter("item_no"));
            gw_com_api.setValue("frmOption", 1, "proj_no", gw_com_api.getPageParameter("proj_no"));

            if (v_global.process.param != "")
                processRetrieve({});

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

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
                { name: "엑셀", value: "시리얼번호 엑셀로 저장" },
				{ name: "닫기", value: "닫기" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE",
            trans: true, show: true, border: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "pur_no", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ymd_fr", label: { title: "요청일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd", style: { colfloat: "floated" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "notdlv_yn", title: "미납품목 전체 보기", label: { title: "미납품목 전체 보기 :" },
                                editable: { type: "checkbox", value: "0", offval: "1" }
                            }
                        ]
                    },
                    {
                        element: [
                            { name: "root_no", label: { title: "발주/부킹번호 :" }, editable: { type: "text", size: 13 } }
                        ]
                    },
                    {
                        element: [
                            { name: "item_no", label: { title: "품번 :" }, editable: { type: "text", size: 13 } },
                            { name: "proj_no", label: { title: "Project No. :" }, editable: { type: "text", size: 13 } }
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
            targetid: "frmOption_EXCEL", type: "FREE",
            trans: true, border: true, show: false, margin: 70,
            content: {
                row: [
                    {
                        element: [
                            { name: "품목", value: "선택 품목", act: true, format: { type: "button", icon: "엑셀" } },
                            { name: "전체", value: "전체", format: { type: "button", icon: "엑셀" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_1", query: "w_srm1070_1", title: "Serial Number 입력 품목",
            height: 442, show: true, caption: true, selectable: true, number: true,
            element: [
                { header: "품번", name: "item_cd", width: 100 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 150 },
                { header: "Project", name: "proj_no", width: 100 },
                { header: "발주/부킹번호", name: "root_no", width: 100, align: "center" },
                { header: "Ser.수량", name: "ser_qty", width: 100, align: "right", mask: "numeric-int" },
                { header: "납품수량", name: "dlv_qty", width: 100, align: "right", mask: "numeric-int" },
                { name: "root_no", hidden: true },
                { name: "pr_no", hidden: true },
                { name: "po_seq", hidden: true }
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_2", query: "w_srm1070_2", title: "Serial Number 목록",
            height: 442, show: true, caption: true, selectable: true, number: true,
            element: [
                { header: "Ser. No.", name: "ser_no", width: 150 },
                { name: "ser_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_EXCEL", query: "w_srm1070_excel", title: "Serial Number 목록",
            number: true, show: false,
            element: [
                { header: "품번", name: "item_cd", width: 100 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 150 },
                { header: "Project", name: "proj_no", width: 100 },
                { header: "발주/부킹번호", name: "root_no", width: 100, align: "center" },
                //{ header: "구매요청번호", name: "pr_no", width: 100, align: "center" },
                { header: "Ser. No.", name: "ser_no", width: 150 }
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
                { type: "GRID", id: "grdList_1", offset: 8 },
                { type: "GRID", id: "grdList_2", offset: 8 }
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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "엑셀", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_EXCEL", element: "품목", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_EXCEL", element: "전체", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_1", grid: true, event: "rowselected", handler: processRowselected };
        gw_com_module.eventBind(args);
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "조회":
                    {
                        gw_com_api.hide("frmOption_EXCEL");
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "엑셀":
                    {
                        gw_com_api.hide("frmOption");
                        var args = { target: [{ id: "frmOption_EXCEL", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "실행":
                    {
                        processRetrieve({});
                    }
                    break;
                case "취소":
                    {
                        closeOption({});
                    }
                    break;
                case "품목":
                    {
                        closeOption({});
                        if (gw_com_api.getRowCount("grdList_2") > 0)
                            gw_com_module.gridDownload({ targetid: "grdList_2" });
                        else
                            gw_com_api.messageBox([{ text: "데이터가 없습니다." }]);
                    }
                    break;
                case "전체":
                    {
                        closeOption({});
                        $.data($("#grdList_EXCEL_form")[0], "master", $.data($("#grdList_1_form")[0], "master"));
                        $.data($("#grdList_EXCEL")[0], "argument", $.data($("#grdList_1")[0], "argument"));
                        gw_com_module.gridDownload({ targetid: "grdList_EXCEL" });
                    }
                    break;
            }

        }
        //----------
        function processRowselected(param) {

            var args = {
                source: {
                    type: param.type, id: param.object, row: param.row,
                    element: [
                        { name: "root_no", argument: "arg_root_no" },
                        { name: "po_seq", argument: "arg_po_seq" },
                        { name: "pr_no", argument: "arg_pr_no" }
                    ],
                    argument: [
                        { name: "arg_notdlv_yn", value: gw_com_api.getValue("frmOption", 1, "notdlv_yn") },
                        { name: "arg_supp_cd", value: gw_com_module.v_Session.EMP_NO }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdList_2", select: true }
                ]
            };
            gw_com_module.objRetrieve(args);

        }
        //=====================================================================================

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false)  return false;

    var args = {
        source: { type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "notdlv_yn", argument: "arg_notdlv_yn" },
                { name: "root_no", argument: "arg_root_no" },
                { name: "item_no", argument: "arg_item_no" },
                { name: "proj_no", argument: "arg_proj_no" }
            ],
            argument: [
                { name: "arg_supp_cd", value: gw_com_module.v_Session.EMP_NO }
            ],
			remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "notdlv_yn" }] },
                { element: [{ name: "root_no" }] },
		        { element: [{ name: "item_no" }] },
		        { element: [{ name: "proj_no" }] }
		    ]
        },
        target: [
			{ type: "GRID", id: "grdList_1", select: true }
        ],
        clear: [
            { type: "GRID", id: "grdList_2" }
        ]
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption_EXCEL");

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
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = {
                    to: {
                        type: "POPUP",
                        page: param.from.page
                    }
                };
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                //파라미터
                if (param.retrieve != undefined) {
                    if (param.retrieve) processRetrieve();
                }
            }
            break;
        case gw_com_api.v_Stream.msg_retrieve:
            {

            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
