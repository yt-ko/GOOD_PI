//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 계약추가항목등록
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
                },
                { type: "PAGE", name: "SYS_FIELD", query: "ECM_1011_9" }
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
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_MAIN", offset: 8 }
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
        //=====================================================================================

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//----------
function processButton(param) {

    switch (param.element) {
        case "저장":
            {
                processSave(param);
            }
            break;
        case "상세":
            {
                var data = v_global.data;
                data.edit = true;
                processClose({ data: data });
            }
            break;
        case "전송":
            {
                processSend(param);
            }
            break;
        case "취소":
            {
                processRemove(param);
            }
            break;
        case "닫기":
            {
                processClose({});
            }
            break;
    }
}
//----------
function processRetrieve(param) {

    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_createECMDocFieldValue",
        input: [
            { name: "doc_id", value: v_global.data.doc_id, type: "int" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        handler: {
            success: successRetrieve,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successRetrieve(response, param) {

    v_global.logic.data = getData({});
    if (v_global.logic.data == null)
        processSend({});
    else
        processCreateDW(param);

}
//----------
function processCreateDW(param) {

    var row = [
        {
            element: [
                { header: true, value: "항목명", format: { type: "label" } },
                { header: true, value: "값", format: { type: "label" } }
            ]
        }
    ];
    //=====================================================================================
    var data = new Array();
    var event = new Array();
    if (v_global.logic.data.length > 0) {
        $.each(v_global.logic.data, function (i, v) {
            var name1 = i + "_ext_nm";
            var name2 = i + "_ext_val";
            var value1 = v["ext_nm"];
            var value2 = v["ext_val"];
            var mask = v["mask"];
            var editable = { type: "hidden" };
            if (v["_edit_yn"] == "1") {
                event.push({ element: name2, mask: mask });
                switch (mask) {
                    case "checkbox":
                        {
                            editable = { type: "checkbox", value: "1", offval: "0", title: "" };
                            mask = "";
                        }
                        break;
                    case "multiline":
                        {
                            editable = { type: "textarea", rows: 1, maxlength: 2000 };
                            mask = "";
                        }
                        break;
                    default:
                        {
                            editable.type = "text";
                        }
                }
            }

            if (mask == "checkbox") {
                editable = { type: "checkbox", value: "1", offval: "0", title: "" };
                mask = "";
            }
            if (editable.type == "hidden" && mask == "date-ymd")
                editable.width = 500;  //datepicker 감추기
            var col1 = { name: name1, editable: { type: "hidden" } };
            var col2 = { name: name2, editable: editable, mask: mask == "" ? undefined : mask };
            row.push({ element: [col1, col2] });

            data.push({ name: name1, value: value1 });
            data.push({ name: name2, value: value2 });

        });
    }
    //=====================================================================================
    var args = {
        targetid: "frmData_MAIN", query: "ECM_1020_5", type: "TABLE", title: "검토의뢰",
        caption: false, show: true,
        editable: { bind: "select", focus: "0_ext_val", validate: true },
        content: {
            width: { label: 100, field: 270 }, height: 25,
            row: row
        }
    };
    //----------
    gw_com_module.formCreate(args);
    //=====================================================================================
    var args = {
        target: [
            { type: "FORM", id: "frmData_MAIN", offset: 8 }
        ]
    };
    //----------
    gw_com_module.objResize(args);
    //=====================================================================================
    var args = {
        targetid: "frmData_MAIN", edit: true, updatable: true,
        data: data
    };
    //----------
    gw_com_module.formInsert(args);
    //=====================================================================================
    var args = { targetid: "frmData_MAIN", event: "itemkeyenter", handler: processEnter };
    gw_com_module.eventBind(args);
    //----------
    var args = { targetid: "frmData_MAIN", event: "itemchanged", handler: processItemchanged };
    gw_com_module.eventBind(args);
    //----------
    $.each(event, function () {
        if (this.mask == "multiline") {
            var args = { targetid: "frmData_MAIN", element: this.element, event: "focus", handler: processMemo };
            gw_com_module.eventBind(args);
        }
    });
    //=====================================================================================

}
//----------
function processItemchanged(param) {

    if (param.object == "frmData_MAIN") {
        var row = Number(param.element.split("_")[0]);
        var value = param.value.current;
        var el = "#" + param.object + "_" + param.element;
        if ($(el).attr("mask") != undefined) {
            var param = {
                targetobj: el
            };
            value = gw_com_module.textunMask(param);
        }
        v_global.logic.data[row]["ext_val"] = value;
        v_global.logic.data[row]["modified"] = true;
    }

}
//----------
function processSave(param) {

    var row = new Array();
    $.each(v_global.logic.data, function (i, v) {
        if(v["modified"])
            row.push({
                crud: "U",
                column: [
                    { name: "ext_id", value: v["ext_id"] },
                    { name: "ext_val", value: v["ext_val"] }
                ]
            })
    });

    if (row.length == 0) {
        gw_com_api.messageBox([{ text: "저장할 내역이 없습니다." }], 300);
    } else {
        var data = {
            query: "ECM_1020_5",
            row: row
        };
        var args = {
            url: "COM",
            user: gw_com_module.v_Session.USR_ID,
            nomessage: param.send ? true : false,
            param: [data],
            handler: {
                success: successSave,
                param: param
            }
        };
        gw_com_module.objSave(args);
    }

}
//----------
function successSave(response, param) {

    processRetrieve({});

    if (param.send) {
        processBatch(param);
    } else {
        // 계약서 생성
        processPrint({});
    }

}
//----------
function processRemove(param) {

    var qry = {
        query: "ECM_1020_1",
        row: [{
            crud: "D",
            column: [{ name: "doc_id", value: v_global.data.doc_id }]
        }]
    };

    var args = {
        url: "COM",
        user: gw_com_module.v_Session.USR_ID,
        param: [qry],
        nomessage: true,
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objSave(args);

}
//----------
function successRemove(response, param) {

    processClose({ data: { doc_id: "", send: true } });

}
//----------
function processSend(param) {

    if (getUpdatable({})) {
        processSave({ send: true });
    } else {
        processBatch({});
    }

}
//----------
function processBatch(param) {

    var proc = {
        url: "COM",
        procedure: "sp_updateECMDocStat",
        nomessage: true,
        input: [
            { name: "type", value: "SEND_SUPP", type: "varchar" },
            { name: "doc_id", value: v_global.data.doc_id, type: "varchar" },
            { name: "sub_id", value: "%", type: "varchar" },
            { name: "pstat", value: "WAT_A", type: "varchar" }, //계약대기
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "err_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(proc);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[0] == "") {
        // 계약서 생성
        processPrint({});

        gw_com_api.showMessage("정상 처리되었습니다.");
        var args = {
            data: {
                doc_id: v_global.data.doc_id,
                doc_no: v_global.data.doc_no,
                send: true
            }
        }
        processClose(args);
    } else {
        gw_com_api.messageBox([{ text: response.VALUE[0] }]);
    }

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

}
//----------
function processEnter(param) {

    if (param.object == "frmData_MAIN") {
        var seq = Number(param.element.split("_")[0]) + 1;
        var element = seq + "_" + param.element.split("_").slice(1).join("_");
        gw_com_api.setFocus(param.object, param.row, element);
    } else {
        var row = Number(param.row) + 1;
        if (row > gw_com_api.getRowCount(param.object)) return;
        gw_com_api.selectRow(param.object, row, true);
    }

}
//----------
function processPrint(param) {

    var args = {
        page: "ECM_1020",
        option: [
            { name: "PRINT", value: "pdf" },
            { name: "PAGE", value: "ECM_1020" },
            { name: "USER", value: gw_com_module.v_Session.USR_ID },
            { name: "DOC_ID", value: v_global.data.doc_id },
            { name: "DOC_NO", value: v_global.data.doc_no }
        ],
        target: { type: "FILE", id: "ZZZ", name: v_global.data.doc_no }
    };
    gw_com_module.objExport(args);

}
//----------
function setButton(param) {

    var ele = [];
    var args = {
        targetid: "lyrMenu", type: "FREE"
    };
    //-----------------------
    if (gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "" || gw_com_module.v_Session.USER_TP == "SUPP") {
        ele[ele.length] = { name: "저장", value: "저장" };
        ele[ele.length] = { name: "닫기", value: "닫기" };
    } else if (v_global.data.new_yn && v_global.data.new_yn == "Y") {
        ele[ele.length] = { name: "저장", value: "저장" };
        ele[ele.length] = { name: "전송", value: "업체전송", icon: "기타" };
        ele[ele.length] = { name: "상세", value: "상세보기", icon: "조회" };
        ele[ele.length] = { name: "취소", value: "등록취소", icon: "아니오" };
    } else {
        ele[ele.length] = { name: "저장", value: "저장" };
        ele[ele.length] = { name: "전송", value: "업체전송", icon: "기타" };
        ele[ele.length] = { name: "닫기", value: "닫기" };
    }
    //-----------------------
    args.element = ele;
    //-----------------------
    gw_com_module.buttonMenu(args);
    //=====================================================================================
    $.each(args.element, function () {
        var event = { targetid: args.targetid, element: this.name, event: "click", handler: processButton };
        gw_com_module.eventBind(event);
    });
    //=====================================================================================

}
//----------
function getData(param) {

    var cols = ["ext_id", "ext_nm", "ext_val", "mask", "_edit_yn"];
    var rows = new Array();
    var args = {
        request: "DATA",
        name: "ECM_1020_5",
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
            "?QRY_ID=ECM_1020_5" +
            "&QRY_COLS=" + cols.join(",") +
            "&CRUD=R" +
            "&arg_doc_id=" + v_global.data.doc_id,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        $.each(data, function () {
            var row = new Object();
            for (var i = 0; i < cols.length; i++) {
                row[cols[i]] = this.DATA[i];
            }
            row["modifed"] = false;
            rows.push(row);
        });

    }
    return rows;

}
//----------
function getUpdatable(param) {

    var rtn = false;
    try {
        $.each(v_global.logic.data, function (i, v) {
            if (v["modified"]) {
                rtn = true;
                return false;
            }
        });
    } catch (exception) {
        rtn = false;
    } finally {
        return rtn;
    }

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    v_global.event.data = {
        edit: true, rows: 21,
        title: gw_com_api.getValue(param.object, param.row, param.element.replace("ext_val", "ext_nm")),
        text: gw_com_api.getValue(param.object, param.row, param.element)
    }
    var args = {
        type: "PAGE", page: "w_edit_memo", title: "멀티라인",
        width: 500, height: 400, open: true, locate: ["center", "center"]
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_edit_memo",
            param: {
                ID: gw_com_api.v_Stream.msg_edit_Memo,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
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

                var args = {
                    to: { type: "POPUP", page: param.from.page }
                };
                switch (param.from.page) {
                    case "w_edit_memo":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_Memo;
                            args.data = v_global.event.data;
                        }
                        break;
                    default:
                        {
                            v_global.data = param.data;
                            setButton({});
                            processRetrieve({});
                            v_global.process.init = true;
                            return;
                        }
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_Memo:
            {
                if (param.data.update)
                    gw_com_api.setValue(v_global.event.object,
                        v_global.event.row,
                        v_global.event.element,
                        param.data.text);
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
                    case gw_com_api.v_Message.msg_informSaved:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                    case gw_com_api.v_Message.msg_informBatched:
                        { param.data.arg.handler(param.data.arg.response, param.data.arg.param); } break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//