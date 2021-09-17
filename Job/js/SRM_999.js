//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 메일 양식관리
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, html: null, logic: {}
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
        start();
        //var args = {
        //    request: [
        //        {   name:"srm_999",
        //            param: [{ argument: "arg_temp_id", value: "srm_999" }]
        //        }

        //    ],
        //    starter: start
        //};
        //gw_com_module.selectSet(args);

        //----------
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            if (gw_com_api.getValue("frmData_MemoA", 1, "temp_id") != "") {
                var args = {
                    targetid: "frmData_MemoA", updatable: true,
                    data: [
                        { name: "memo_tp", value: "HTML" },
                        { name: "memo_html", value: gw_com_api.getValue("frmData_MemoA", 1, "temp_body") },
                        { name: "temp_id", value: gw_com_api.getValue("frmData_MemoA", 1, "temp_id") }
                    ]
                };
                gw_com_module.formInsert(args);
            }
            processRetrieve({});
        }
    },

    // manage UI. (design section)
    UI: function () {

        //==== Main Menu : 
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "조회", value: "조회", act: true },
				//{ name: "추가", value: "추가" },
				//{ name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "통보", value: "통보", icon: "기타"},
				{ name: "닫기", value: "닫기" }
            ]
        };

        gw_com_module.buttonMenu(args);

    
        // ==== Main Grid 
        var args = {
            targetid: "grdData_List", query: "srm_999_1", title: "구매취소요청", width: '1200',
            caption: true, show: true, selectable: true, number: true, editable: { master: true, bind: "select", focus: "pur_no", validate: true },
            element: [
                { header: "발주번호", name: "pur_no", widht: 60},
                { header: "LOI번호", name: "item_cd", widht: 60},
                { header: "Tracking", name: "item_spec", widht: 60},
                { header: "발주일", name: "req_date", mask: "date-ymd", widht: 60},
                { header: "발주자", name: "por_date", mask: "date-ymd", widht: 60 },
                { header: "품목코드", name: "root_no", widht: 60 },
                { header: "품명", name: "pur_amt", widht: 60},
                { header: "규격", name: "exch_amt", widht: 60},
                { header: "발주수량", name: "vat_yn", widht: 60},
                { header: "입고수량", name: "root_seq", widht: 60},
                { header: "취소요청수량", name: "qa_yn", widht: 60}

            ]
        };
        gw_com_module.gridCreate(args);

       
        // Data Box : Memo

        /*SYS_2090_1*/
        var args = {
            targetid: "frmData_MemoA", query: "srm_999_2", type: "TABLE", title: "IPS 공문",width:'1100'
,            caption: true, show: true, fixed: true, editable: { bind: "select", focus: "temp_id", validate: true },
            content: {
                row: [{
                    element: [
                        { name: "memo_html", format: { type: "html", height: 200 } },
                        { name: "memo_tp", hidden: true, editable: { type: "hidden" } },
                        { name: "temp_id", hidden: true, editable: { type: "hidden" } },
                        { name: "temp_body", hidden: true, editable: { type: "hidden" } }
                    ]
                }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //==== Resize Objects
        var args = {
            target: [
                { type: "grid", id: "grdData_List", offset: 8 },
				{ type: "FORM", id: "frmData_MemoA", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    //==== manage process. (program section)
    procedure: function () {

        //==== Button Click : Main 조회, 추가, 수정, 출력(납품서), 라벨(라벨출력), 닫기 ====
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "통보", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);

        //==== Grid Events :
        var args = { targetid: "grdData_List", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);


        //==== Memo Events :
        var args = { targetid: "frmData_MemoA", element: "memo_html", event: "click", handler: processMemoEdit };
        gw_com_module.eventBind(args);

    }
};

//----------
function processMemoEdit(param) {


    // Open Memo Editor -> SetValue : msg_closeDialogue
    // 중복 Open 문제 해결 필요 by JJJ
    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = "memo_html";
    var args = {
        page: "DLG_HtmlEditor",
        option: "width=800,height=600,left=300,resizable=1",
        data: {
            title: "E-Mail Form Editor",
            html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
        }
    };
    gw_com_api.openWindow(args);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            v_global.process.handler = processRetrieve;
            processRetrieve({});
            break;
        case "추가":
            v_global.process.handler = processInsert;
            processInsert({});
            break;
        case "삭제":
            v_global.process.handler = processRemove;
            checkRemovable({});
            break;
        case "저장":
            var radioVal = $('input[name="radioA"]:checked').val();
            var radioVal2 = $('input[name="radioB"]:checked').val();
            var radioVal3 = $('input[name="radioC"]:checked').val();
            var radiotext1 = $('input[name="radioC1"]').val();
            var radiotest2 = $('input[name="radioC4"]').val();
            alert("\n첫번째 radio 값은\n" + radioVal
                + "\n두번째 radio 값은\n" + radioVal2
                + "\n세번째 radio 값은\n" + radioVal3 
                + "\n첫번째 text 값은\n" + radiotext1 +
                "\n두번째 text 값은\n" + radiotest2 + "\n입니다.");  
            break;
        case "닫기":
            checkClosable({});
            break;
        case "통보":
            processSendEmail(param);
            break;

    }

}

//---------- Mail 전송 시작
function processSendEmail(param) {

    gw_com_api.messageBox([
        { text: "발주 취소 동의 요청서에 대한 이메일을 발송합니다." + "<br>" },
        { text: "계속 하시겠습니까?" }
    ], 420, gw_com_api.v_Message.msg_confirmBatch, "YESNO");
}
//---------- Batch : NCR 발행 통보 처리 Procedure 실행 (PROC_MAIL_QDM_NCR)

function processBatch(param) {

    var param = {
        key_no: gw_com_api.getValue("frmData_MemoA", 1, "temp_id")
    }

    var args = {
        url: "COM",
        subject: MailInfo.getSubject(param),
        body: MailInfo.getBody(param),
        to: MailInfo.getTo(param),
        edit: true
    };
    gw_com_module.sendMail(args);

}

//----------
var MailInfo = {
    getSubject: function (param) {
        var rtn = "테스트 메일 입니다";
          
    
        //var args = {
        //    request: "PAGE",
        //    url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
        //        "?QRY_ID=QDM_6210_MAIL" +
        //        "&QRY_COLS=val" +
        //        "&CRUD=R" +
        //        "&arg_type=" + param.type + "&arg_field=subject&arg_key_no=" + param.key_no + "&arg_key_seq=" + param.key_seq,
        //    handler_success: successRequest
        //};
        ////=================== async : false ========================
        //$.ajaxSetup({ async: false });
        ////----------
        //gw_com_module.callRequest(args);
        //function successRequest(data) {
        //    rtn = data[0].DATA[0];
        //}
        ////----------
        //$.ajaxSetup({ async: true });
        ////=================== async : true ========================
        return rtn
    },
    getBody: function (param) {
        var html_body = v_global.html;
        var rtn = HTMLElement;
        rtn = html_body;

        //var args = {
        //    request: "PAGE",
        //    url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
        //        "?QRY_ID=QDM_6210_MAIL" +
        //        "&QRY_COLS=val" +
        //        "&CRUD=R" +
        //        "&arg_type=" + param.type + "&arg_field=body&arg_key_no=" + param.key_no + "&arg_key_seq=" + param.key_seq,
        //    handler_success: successRequest
        //};
        ////=================== async : false ========================
        //$.ajaxSetup({ async: false });
        ////----------
        //gw_com_module.callRequest(args);
        //function successRequest(data) {
        //    rtn = data[0].DATA[0];
        //}
        ////----------
        //$.ajaxSetup({ async: true });
        ////=================== async : true ========================
        return rtn
    },
    getTo: function (param) {
        var rtn = new Array();
        rtn.push({
            name: '고유탁',
            value:'goodkyt@goodware.co.kr'
        })
        //var args = {
        //    request: "PAGE",
        //    url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
        //        "?QRY_ID=QDM_6210_MAIL2" +
        //        "&QRY_COLS=name,value" +
        //        "&CRUD=R" +
        //        "&arg_type=" + param.type + "&arg_key_no=" + param.key_no + "&arg_key_seq=" + param.key_seq,
        //    handler_success: successRequest
        //};
        ////=================== async : false ========================
        //$.ajaxSetup({ async: false });
        ////----------
        //gw_com_module.callRequest(args);
        //function successRequest(data) {
        //    $.each(data, function () {
        //        rtn.push({
        //            name: this.DATA[0],
        //            value: this.DATA[1]
        //        });
        //    });
        //}
        ////----------
        //$.ajaxSetup({ async: true });
        //=================== async : true ========================
        return rtn
    }
}
//----------
function textShow() {
    var radioVal = $('input[name="radioC"]:checked').val();
    var el = $("input:text[name=radioC1]");
    var el2 = $("input:text[name=radioC4]");
    // 라디오 버튼을 체크시 텍스트 박스 활성화 및 비활성화
    if (radioVal == '1') {
        $("input:text[name=radioC1]").attr("disabled", false);
        $("input:text[name=radioC4]").attr("disabled", true);
        // 다른 라디오 버튼시 텍스트값 지우기 위한 포문
        for (var i = 0; i < el2.length; i++) {
            el2[i].value = '';
        }
    } else if (radioVal == '4') {
        $("input:text[name=radioC4]").attr("disabled", false);
        $("input:text[name=radioC1]").attr("disabled", true);
        // 다른 라디오 버튼시 텍스트값 지우기 위한 포문
        for (var i = 0; i < el.length; i++) {
            el[i].value = '';
        }
    } else {
        $("input:text[name=radioC4]").attr("disabled", true);
        $("input:text[name=radioC1]").attr("disabled", true);
        for (var i = 0; i < el.length; i++) {
            el[i].value = '';
        }
        for (var i = 0; i < el2.length; i++) {
            el2[i].value = '';
        }
    }
    
 }
//----------
function radiodisabledA() {

    var radioVal = $('input[name="checkqq"]:checked').val();

    var radiolength = $("input[name='radioC']").length;

        for (var i = 1; i <= radiolength; i++) {
            $("#radioC" + i).removeAttr("disabled");

        }   
}
//----------
function radiodisabledB() {
    var radioVal = $('input[name="checkqq"]:checked').val();
    var radiolength = $("input[name='radioC']").length;
    var el = $("input:text[name=radioC1]");
    var el2 = $("input:text[name=radioC4]");

    if (radioVal == 'b') {
        $("input[name='radioC']").attr("checked", false);
        $("input:text[name=radioC1]").attr("disabled", true);
        $("input:text[name=radioC4]").attr("disabled", true);
        for (var i = 1; i <= radiolength; i++) {
            $("#radioC" + i).attr("disabled", "disabled");
        }
        for (var i = 0; i < el.length; i++) {
            el[i].value ='';
        }
        for (var i = 0; i < el2.length; i++) {
            el2[i].value ='';
        }
    } else {
        for (var i = 1; i <= radiolength; i++) {
            $("#radioC" + i).removeAttr("disabled");

        }   
    }

    }



//----------
function checkCRUD(param) {

    return gw_com_api.getCRUD("frmData_Main");

}
//----------
function checkManipulate(param) {

    if (checkCRUD({}) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {
    // Check : Is there data to save previously?
    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" }
        ],
        param: param
    };
    // if Updatable then return false
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processClear({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function checkClosable(param) {

    v_global.process.handler = processClose;
    processClose({});

}
//----------
function processInsert(param) {

    gw_com_api.selectRow("grdData_List", "reset");
    var args = {
        targetid: "frmData_Main", edit: true, updatable: true,
        //data: [
        //    { name: "rgst_ymd", value: gw_com_api.Mask(gw_com_api.getDate(), "date-ymd") }
        //],
        clear: [
            { type: "FORM", id: "frmData_MemoA" }
        ]
    };
    gw_com_module.formInsert(args);

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
		    {
		        type: "FORM", id: "frmData_Main",
		        key: { element: [{ name: "temp_id" }] }
		    }
        ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);
}
//----------
function successRemove(response, param) {

    if (gw_com_api.getRowCount("grdData_List") == 1) {
        processClear({});
    }
    processRetrieve({});

}
//----------
function processSave(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

}
//----------
function processRetrieve(param) {
    
    var args;
    if (param.object == "grdData_List" || param.sub) {
        v_global.process.prev.master = param.row
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_temp_id", value: "%" }
                ]
            },
            target: [
                { type: "FORM", id: "frmData_MemoA"}
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };
    } else {
        args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_temp_id", value: "%" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_List", select: true }
            ],
            handler: { complete: processRetrieveEnd, param: param }
        };
    }

    
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

    if (gw_com_api.getValue("frmData_MemoA", 1, "temp_id") != "") {
        var args = {
            targetid: "frmData_MemoA", updatable: true,
            data: [
                { name: "memo_tp", value: "HTML" },
                { name: "memo_html", value: gw_com_api.getValue("frmData_MemoA", 1, "temp_body") },
                { name: "temp_id", value: gw_com_api.getValue("frmData_MemoA", 1, "temp_id") }
            ]
        };
        v_global.html = gw_com_api.getValue("frmData_MemoA", 1, "temp_body");
        gw_com_module.formInsert(args);
    }
}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" },
            { type: "FORM", id: "frmData_MemoA" }
        ]
    };
    gw_com_module.objClear(args);

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


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };

                if (param.from.page == "") {
                    // process per page
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                // HTML Editor
                if (param.from.page == "DLG_HtmlEditor") {
                    if (param.data.update) {
                        gw_com_api.setValue(v_global.event.object, v_global.event.row, v_global.event.element, param.data.html);
                        gw_com_api.setValue("frmData_Main", 1, "temp_body", param.data.html);
                        gw_com_api.setUpdatable(v_global.event.object);
                    }
                    return;
                }

                // Close Dialogue Widow
                if (param.from) closeDialogue({ page: param.from.page });
            }
            break;
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
                            if (param.data.result == "YES") processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processClear({});
                                if (v_global.process.handler != null) v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove({});
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
                    case gw_com_api.v_Message.msg_confirmBatch: {
                        if (param.data.result == "YES") processBatch(param.data.arg);
                    } break;
                }
            }
            break;

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//