//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Description : System Notice List
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Declare Page Variables
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

        // Get Page Parameters
        if (parent.v_global != undefined && parent.v_global.logic != undefined && parent.v_global.logic.view != undefined)
            v_global.logic.view = parent.v_global.logic.view;  //gw_com_api.getPageParameter("view");
        else
            v_global.logic.view = "";

        //gw_com_module
        v_global.logic.fr_ymd = gw_com_api.getPageParameter("fr_ymd");
        v_global.logic.to_ymd = gw_com_api.getPageParameter("to_ymd");
        v_global.logic.prop_tp = gw_com_api.getPageParameter("prop_tp");
        v_global.logic.acpt_yn = gw_com_api.getPageParameter("acpt_yn");
        v_global.logic.send_yn = gw_com_api.getPageParameter("send_yn");
        v_global.logic.reload = gw_com_api.getPageParameter("reload");
        if (gw_com_module.v_Session.USER_TP == "OFFER")
            v_global.logic.id = parent.v_Session.USR_ID;
        else
            v_global.logic.id = "%";
        v_global.logic.PageId = "SRM_OpenSrc_List";

        // set data for DDDW List & call start()
        var args = {
            request: [
                {
                    type: "INLINE", name: "dddwPropType",
                    data: [
			            { title: "ALL", value: "%" },
			            { title: "반도체", value: "반도체" },
			            { title: "디스플레이", value: "디스플레이" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwAcptYn",
                    data: [
			            { title: "ALL", value: "%" },
			            { title: "적격", value: "1" },
			            { title: "부적격", value: "0" }
                    ]
                },
                {
                    type: "INLINE", name: "dddwSendYn",
                    data: [
			            { title: "ALL", value: "%" },
			            { title: "미제출 제외", value: "1" }
                    ]
                },
				{
				    type: "PAGE", name: "dddwNoticeType", query: "dddw_zcode",
				    param: [ { argument: "arg_hcode", value: "SYS211" } ]
				}
			], starter: start
        };
        gw_com_module.selectSet(args);

        // Start Process
        function start() {

            // Set Page Options
            v_global.logic.PageEditable = true;
            v_global.logic.PageType = "Sub";

            // Create UI Controls
            gw_job_process.UI();

            // Set Default Option Values
            if (v_global.logic.reload != "1") {
                if (v_global.logic.fr_ymd != "") {
                    gw_com_api.setValue("frmOption", 1, "fr_ymd", v_global.logic.fr_ymd);
                    gw_com_api.setValue("frmOption", 1, "to_ymd", v_global.logic.to_ymd);
                }
                else {
                    gw_com_api.setValue("frmOption", 1, "fr_ymd", gw_com_api.getDate("", { day: -30 }));
                    gw_com_api.setValue("frmOption", 1, "to_ymd", gw_com_api.getDate("", { day: 1 }));
                }

                if (v_global.logic.prop_tp != "")
                    gw_com_api.setValue("frmOption", 1, "prop_tp", v_global.logic.prop_tp);
                else
                    gw_com_api.setValue("frmOption", 1, "prop_tp", "%");

                if (v_global.logic.acpt_yn != "")
                    gw_com_api.setValue("frmOption", 1, "acpt_yn", v_global.logic.acpt_yn);
                else
                    gw_com_api.setValue("frmOption", 1, "acpt_yn", "%");

                if (v_global.logic.send_yn != "")
                    gw_com_api.setValue("frmOption", 1, "send_yn", v_global.logic.send_yn);
                else
                    gw_com_api.setValue("frmOption", 1, "send_yn", "%");
            }

            gw_job_process.procedure();
            gw_com_module.startPage();  // resizeFrame & Set focus

            processRetrieve({});

            //// Get Initial Data
            //var args = {
            //    request: "DATA", name: "PCN_1010_1_OPTION", async: false, handler_success: successRequest,
            //    url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            //        "?QRY_ID=PCN_1010_1_OPTION" +
            //        "&QRY_COLS=supp_cds,supp_nm" +
            //        "&CRUD=R"
            //};
            //gw_com_module.callRequest(args);
            //function successRequest(type, name, data) {
            //    if (data.DATA.length >= 0) {
            //        v_global.logic.supp_cd = data.DATA[0];
            //    } else {
            //        v_global.logic.supp_cd = "";
            //    }
            //}

        }

    },

    // manage UI. (design section)
    UI: function () {

        // Create Buttons
        var args = {
            targetid: "lyrMenu_Top", type: "FREE",
            element: [
                { name: "Retrieve", value: "조회", act: true } //, icon: "Other"
            ]
        };
        if (v_global.logic.PageEditable) {
            args.element.push({ name: "Edit", value: "상세보기" });
        }
        if (v_global.logic.PageType == "Main") {
            args.element.push({ name: "Close", value: "닫기", icon: "닫기" });
        }
        gw_com_module.buttonMenu(args);

        // Option Box
        var args = {
            targetid: "frmOption", type: "FREE", trans: true, border: true, show: true,
            editable: { bind: "open", focus: "date_tp", validate: true }, remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "fr_ymd", label: { title: "제안일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "to_ymd", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "acpt_yn", label: { title: "심사결과 :" },
                                editable: { type: "select", data: { memory: "dddwAcptYn" } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "prop_tp", label: { title: "제안유형 :" },
                                editable: { type: "select", data: { memory: "dddwPropType" } }
                            },
                            {
                                name: "comp_nm", label: { title: "기업명 :" },
                                editable: { type: "text", size: 16 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "send_yn", label: { title: "제출상태 :" },
                                editable: { type: "select", data: { memory: "dddwSendYn" } }
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
			    ]   //end row
            }   //end content
        };
        gw_com_module.formCreate(args);

        // Data List
        var isOffer = false;    //일부 항목 숨김 처리를 위함
        if (gw_com_module.v_Session.USER_TP == "OFFER") {
            isOffer = true;
        }
        var args = {
            targetid: "grdData_ListA", query: "SRM_OpenSrc_List", title: "신규 거래 제안 현황",
            height: 500, show: true, selectable: true, number: true,
            element: [
                { header: "등록일자", name: "send_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "진행상태", name: "pstat", width: 60, align: "center" },
                { header: "사업자등록번호", name: "comp_no", width: 120, align: "center" },    //, mask: "biz-no"
                { header: "기업명", name: "comp_nm", width: 200 },
                { header: "대표자명", name: "comp_man", width: 80, align: "center" },
                { header: "업력", name: "career_year", width: 60, align: "center" },
				{ header: "제안유형", name: "prop_tp", width: 80, align: "center" },
                { header: "제안품목", name: "prop_item", width: 60, align: "center" },
                { header: "제목", name: "prop_title", width: 300 },
                { header: "담당자", name: "emp_nm", width: 70, align: "center" },
                { header: "직위", name: "emp_pos", width: 60, align: "center" },
                { header: "직책", name: "emp_duty", width: 60, align: "center" },
                { name: "rcvd_yn", hidden: true },
                { name: "prop_id", hidden: true }
			]
        };
        if (isOffer == false) {
            args.element.push({ header: "기업형태", name: "comp_tp", width: 60, align: "center" });
            args.element.push({ header: "E-Mail", name: "emp_email", width: 120, align: "center" });
            args.element.push({ header: "설립일", name: "comp_fax", width: 80, align: "center" });
            args.element.push({ header: "담당자 TEL", name: "emp_tel", width: 80, align: "center" });
            args.element.push({ header: "건물면적", name: "building_area", width: 60, align: "center" });
            args.element.push({ header: "자가/임차", name: "building_own", width: 60, align: "center" });
            args.element.push({ header: "본사 전화번호", name: "comp_tel", width: 60, align: "center" });
            args.element.push({ header: "본사 주소", name: "comp_addr", width: 160, align: "center" });
            args.element.push({ header: "제안 부품", name: "prop_part", width: 60, align: "center" });
            args.element.push({ header: "거래 유형", name: "trade_tp", width: 60, align: "center" });
            args.element.push({ header: "원산지", name: "item_src", width: 60, align: "center" });
            //args.element.push({ header: "제안 내용", name: "prop_rmk", width: 460, align: "center" });
            args.element.push({ header: "임직원수", name: "emp_cnt", width: 60, align: "center", mask: "numeric-int" });
            args.element.push({ header: "연구개발인력", name: "emp1_cnt", width: 80, align: "center" });
            args.element.push({ header: "품질조직", name: "qc_yn1", width: 80, align: "center" });
            args.element.push({ header: "신용 등급", name: "credit_rating", width: 80, align: "center" });
            args.element.push({ header: "자기자본 비율", name: "worth_rate", width: 80, align: "center" });
            args.element.push({ header: "품질관리인력", name: "emp2_cnt", width: 80, align: "center" });
            args.element.push({ header: "직전 년도 매출액", name: "sale1_amt", width: 80, align: "center", mask: "numeric-int" });
            args.element.push({ header: "2년전 매출액", name: "sale2_amt", width: 60, align: "center", mask: "numeric-int" });
            args.element.push({ header: "3년전 매출액", name: "sale3_amt", width: 60, align: "center", mask: "numeric-int" });
            args.element.push({ header: "주요거래처(1)", name: "main_cust1", width: 80, align: "center" });
            args.element.push({ header: "주요거래처(2)", name: "main_cust2", width: 80, align: "center" });
            args.element.push({ header: "주요거래처(3)", name: "main_cust3", width: 80, align: "center" });
            args.element.push({ header: "경쟁사 제품 비교", name: "qc_doc1_yn", width: 60, align: "center" });
            args.element.push({ header: "비기능 평가 자료", name: "qc_doc2_yn", width: 60, align: "center" });
            args.element.push({ header: "기능 평가 자료", name: "qc_doc3_yn", width: 60, align: "center" });
            args.element.push({ header: "품질인증 현황", name: "qc_text1", width: 160, align: "center" });
            args.element.push({ header: "환경인증 현황", name: "qc_text2", width: 160, align: "center" });
            args.element.push({ header: "시스템보유 현황", name: "qc_sw", width: 160, align: "center" });
            args.element.push({ header: "특허 보유현황", name: "qc_text3", width: 160, align: "center" });
            args.element.push({ header: "실용실안 현황", name: "qc_text4", width: 160, align: "center" });

            if (v_global.logic.view != "1") {
                args.element.push({ header: "구매점수", name: "point1", width: 60, align: "center", mask: "numeric-int" });
                args.element.push({ header: "설계점수", name: "point2", width: 60, align: "center", mask: "numeric-int" });
                //args.element.push({ header: "품질점수", name: "point3", width: 60, align: "center", mask: "numeric-int" });
                args.element.push({ header: "심사총점", name: "acpt_point", width: 60, align: "center", mask: "numeric-int" });
                args.element.push({ header: "심사결과", name: "acpt_yn_nm", width: 70, align: "center" });
                args.element.push({ header: "심사의견", name: "point_rmk", width: 200, align: "left" });
                args.element.push({ header: "구매심사자", name: "point1_man", width: 70, align: "center" });
                args.element.push({ header: "설계심사자", name: "point2_man", width: 70, align: "center" });
            }
        }
        gw_com_module.gridCreate(args);

        //// File List
        //var args = {
        //    targetid: "grdData_FileA", query: "w_sys2030_S_1", title: "첨부 파일",
        //    caption: true, height: 45, pager: false, number: true, show: true, selectable: true,
        //    element: [
        //        { header: "파일명", name: "file_nm", width: 300, align: "left" },
        //        {
        //            header: "다운로드", name: "_download", width: 60, align: "center",
        //            format: { type: "link", value: "다운로드" }
        //        },
        //        { header: "파일설명", name: "file_desc", width: 300, align: "left" },
        //        { header: "등록일자", name: "ins_dt", width: 80, align: "center", mask: "date-ymd" },
        //        { header: "등록자", name: "ins_usr", width: 70, align: "center" },
        //        { name: "file_path", hidden: true },
        //        { name: "file_id", hidden: true }
        //    ]
        //};
        //gw_com_module.gridCreate(args);

        // Download Layer
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);

        // Resize Data Box
        var args = {
            target: [
                { type: "GRID", id: "grdData_ListA", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        // Event : Top Menu Buttons
        var args = { targetid: "lyrMenu_Top", element: "Retrieve", event: "click", handler: procedureRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Edit", event: "click", handler: processEdit };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu_Top", element: "Close", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_ListA", grid: true, event: "rowdblclick", handler: processEdit };
        gw_com_module.eventBind(args);

        // event handler.
        //----------
        function procedureRetrieve(ui) {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        };

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// common function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function checkManipulate(param) {
    closeOption({});
    if (gw_com_api.getSelectedRow("grdData_ListA") == null) {
        gw_com_api.messageBox([ { text: "NOMASTER" } ]);
        return false;
    }
    return true;
}
//----------
function checkRemovable(param) {
    gw_com_api.messageBox([{ text: "REMOVE" }]
        , 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
}
//----------
function processClose(param) {
    var args = { ID: gw_com_api.v_Stream.msg_closePage };
    gw_com_module.streamInterface(args);
}
//----------
function closeOption(param) {
    gw_com_api.hide("frmOption");
}
//----------
function processDownload(param) {
    var args = { targetid: "lyrDown", source: { id: param.object, row: param.row } };
    gw_com_module.downloadFile(args);
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {

    var args = { target: [ { type: "FORM", id: "frmOption" } ] };
	if (gw_com_module.objValidate(args) == false) return false;

	var args = {
	    source: {
	        type: "FORM", id: "frmOption", hide: true,
	        element: [
                { name: "prop_tp", argument: "arg_prop_tp" },
                { name: "fr_ymd", argument: "arg_fr_ymd" },
                { name: "to_ymd", argument: "arg_to_ymd" },
                { name: "acpt_yn", argument: "arg_acpt_yn" },
                { name: "send_yn", argument: "arg_send_yn" },
                { name: "comp_nm", argument: "arg_comp_nm" }
	        ],
	        argument: [
                { name: "arg_id", value: v_global.logic.id }
	        ],
	        remark: [
                { element: [{ name: "prop_tp" }] },
                { element: [{ name: "acpt_yn" }] },
                { element: [{ name: "send_yn" }] },
                { infix: "~", element: [{ name: "fr_ymd" }, { name: "to_ymd" }] },
                { element: [{ name: "comp_nm" }] }
	        ]
	    },
	    target: [
            { type: "GRID", id: "grdData_ListA" }   //, select: true -> handler 에서 대체
	    ],
	    //clear: [
        //    { type: "FORM", id: "frmData_MemoA" }
	    //],
	    findKey: param.findKey, handler: { complete: processRetrieveEnd, param: param }
	};

    gw_com_module.objRetrieve(args);
    
}
//----------
function processRetrieveEnd(param) {
    // Run [rowselected] Event : findKey로 행찾기
    var listID = "grdData_ListA";
    var curRow = 1;
    if (param.findKey != undefined && param.findKey != "") {
        for (var i = 1; i < gw_com_api.getRowCount(listID) + 1; i++) {
            if ( gw_com_api.getValue(listID, i, "prop_id", true) == param.findKey ){
                curRow = i; break;
            }
        }
    }
    if (gw_com_api.getRowCount(listID) > 0 )
        gw_com_api.selectRow(listID, curRow, true, true);
}
//----------
function processLink(ui) {
    // ui : object, row, status, type
    //var args = {
    //    source: {
    //        type: ui.type, id: ui.object, row: ui.row, block: true,
    //        element: [
    //            { name: "prop_id", argument: "arg_prop_id" }
    //        ]
    //    },
    //    target: [
    //        { type: "FORM", id: "frmData_MemoA" }
    //    ],
    //    key: ui.key
    //};
    //gw_com_module.objRetrieve(args);
}
//----------
function processEdit(ui) {
    var args = {
        ID: gw_com_api.v_Stream.msg_linkPage,
        to: { type: "MAIN" },
        data: { page: "SRM_OpenSrc_Edit", title: "제안서", param: {} }
    }
    var sKey = "";
    
    args.data.param = [{ name: "key", value: gw_com_api.getValue("grdData_ListA", "selected", "prop_id", true) } ];
    if (ui.object == "grdData_ListA")
        args.data.param.push({ name: "mode", value: "0" });
    else
        args.data.param.push({ name: "mode", value: "0" });
    gw_com_module.streamInterface(args);

}
//----------
function processDelete(param) {
    //var args = {
    //    targetid: "grdData_ListA", row: "selected",
    //    clear: [
    //        { type: "GRID", id: "grdData_FileA" },
	//		{ type: "FORM", id: "frmData_MemoA" }
    //    ]
    //};
    //gw_com_module.gridDelete(args);
}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdData_ListA",
                key: [{ row: "selected", element: [{ name: "prop_id" }] }]
            }
        ],
        handler: { success: successRemove }
    };
    gw_com_module.objRemove(args);

}
//----------
function successRemove(response, param) {

    processDelete({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_showMessage:
            {
                gw_com_module.streamInterface(param);
            }
            break;
        case gw_com_api.v_Stream.msg_refreshPage:
            {
                processRetrieve({ findKey: param.findKey});
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
                        if (param.data.result == "YES") processRemove({});
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
                        param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                var args = { page: param.from.page };
                gw_com_module.dialogueClose(args);
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//