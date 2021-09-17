//------------------------------------------
// Upload muti Files
//------------------------------------------
// variables.
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
    data: null, logic: {}
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var gw_job_process = {

    // entry point. (pre-process section)
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // Get Page Parameter
        /*var argList = gw_com_api.getPageParameter("nt_seq").split(":");*/
        var argList = gw_com_api.getPageParameter("ARGS").split(":");
        if (argList.length > 0) v_global.logic.data_tp = argList[0];
        else v_global.logic.data_tp = "ZF";
        if (argList.length > 1) v_global.logic.selector = argList[1];
        else v_global.logic.selector = "Multi";
        if (argList.length > 2) v_global.logic.ui_type = argList[2];
        else v_global.logic.ui_type = "Simple";

        // set data for DDDW List
        var args = {
            request: [
                { type: "PAGE", name: "장비군", query: "DDDW_CM_CODE", param: [{ argument: "arg_hcode", value: "ISCM81" }] },
                { type: "PAGE", name: "업무구분", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "EDM010" }] },
                { type: "PAGE", name: "문서분류", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "EDM020" }] },
                { type: "PAGE", name: "고객사", query: "DDDW_CM_CODE", param: [{ argument: "arg_hcode", value: "ISCM29" }] },
                { type: "PAGE", name: "제품유형", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "ISCM25" }] },
                { type: "PAGE", name: "변경구분", query: "dddw_zcode", param: [{ argument: "arg_hcode", value: "SYS310" }] }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_module.startPage();

            // Set Default Values
            gw_com_api.setValue("frmData_Main", 1, "file_group1", gw_com_module.v_Session.DEPT_AREA);

            // call Parent streamProcess
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
                { name: "업로드", value: "업로드", icon: "저장", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Main", type: "TABLE", title: "파일 설명",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", focus: "file_desc", validate: true },
            content: { height: 25, width: { label: 80, field: 524 } }
        };
        // Setting by UI Type
        if (v_global.logic.ui_type == "GroupA") {
            args.content.width = { label: 70, field: 120 };
            args.content.row = [
                {
                    element: [
                        { header: true, value: "장비군", format: { type: "label" } },
                        {
                            name: "file_group1",    //"dept_area",
                            editable: { type: "select", validate: { rule: "required" }, data: { memory: "장비군" } }
                        },
                        { header: true, value: "업무구분", format: { type: "label" } },
                        {
                            name: "file_group2", //"biz_area",
                            editable: { type: "select", validate: { rule: "required" }, data: { memory: "업무구분" } }
                        },
                        { header: true, value: "문서분류", format: { type: "label" } },
                        {
                            name: "file_group3",   //"doc_area",
                            editable: { type: "select", validate: { rule: "required" }, data: { memory: "문서분류" } }
                        }
                    ]
                },
                {
                    element: [
                        { header: true, value: "관련업체", format: { type: "label" } },
                        {
                            name: "file_group4",   //"cust_cd",
                            editable: { type: "select", data: { memory: "고객사", unshift: [{ title: "-", value: "" }] } }
                        },
                        { header: true, value: "제품유형", format: { type: "label" } },
                        {
                            name: "file_group5",   //"prod_type",
                            editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "-", value: "" }] } }
                        },
                        { header: true, value: "Rev No.", format: { type: "label" } },
                        { name: "rev_no", editable: { type: "text", maxlength: 10 } },
                        { name: "ver_no", hidden: true, editable: { type: "hidden" } },
                        { name: "rev_type", hidden: true, editable: { type: "hidden" } }
                    ]
                },
                {
                    element: [
                        { header: true, value: "설명", format: { type: "label" } },
                        { name: "file_desc", style: { colspan: 5 }, editable: { type: "text", maxlength: 100, width: 522 } }
                    ]
                }
            ];
        }
        else {
            args.content.row = [
                {
                    element: [
                        { header: true, value: "설명", format: { type: "label" } },
                        { name: "file_desc", editable: { type: "text", maxlength: 100, width: 522 } },
                        { name: "file_group1", hidden: true, editable: { type: "hidden" } },
                        { name: "file_group2", hidden: true, editable: { type: "hidden" } },
                        { name: "file_group3", hidden: true, editable: { type: "hidden" } },
                        { name: "file_group4", hidden: true, editable: { type: "hidden" } },
                        { name: "file_group5", hidden: true, editable: { type: "hidden" } },
                        { name: "rev_no", hidden: true, editable: { type: "hidden" } },
                        { name: "ver_no", hidden: true, editable: { type: "hidden" } },
                        { name: "rev_type", hidden: true, editable: { type: "hidden" } }
                    ]
                }
            ];
        }

        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "FORM", id: "frmData_Main", offset: 8 }
            ]
        };
        gw_com_module.objResize(args);

    },

    // manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: processUpload };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "FORM", id: "frmData_Main" }
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
    processClear({});

}
//----------
function processUpload(param) {
    var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
    gw_com_module.uploadFile(args);
}
//----------
function successUpload(response, param) {

    var file_desc = gw_com_api.getValue("frmData_Main", 1, "file_desc");
    var row = new Array();
    var data = new Array();
    $.each(response.data, function () {

        row.push({
            crud: "U",
            column: [
                { name: "file_id", value: this.file_id },
                { name: "file_nm", value: this.file_nm },
                { name: "file_ext", value: this.file_ext },
                { name: "file_path", value: this.file_path },
                { name: "file_desc", value: file_desc },
                { name: "data_tp", value: (v_global.logic.data_tp == undefined ? "" : v_global.logic.data_tp) },
                { name: "data_key", value: (v_global.logic.data_key == undefined ? "" : v_global.logic.data_key) },
                { name: "data_subkey", value: (v_global.logic.data_subkey == undefined ? "" : v_global.logic.data_subkey) },
                { name: "data_seq", value: (v_global.logic.data_seq == undefined ? 0 : v_global.logic.data_seq) },
                { name: "data_subseq", value: (v_global.logic.data_subseq == undefined ? 0 : v_global.logic.data_subseq) },
                { name: "file_group1", value: gw_com_api.getValue("frmData_Main", 1, "file_group1") },
                { name: "file_group2", value: gw_com_api.getValue("frmData_Main", 1, "file_group2") },
                { name: "file_group3", value: gw_com_api.getValue("frmData_Main", 1, "file_group3") },
                { name: "file_group4", value: gw_com_api.getValue("frmData_Main", 1, "file_group4") },
                { name: "file_group5", value: gw_com_api.getValue("frmData_Main", 1, "file_group5") },
                { name: "ver_no", value: gw_com_api.getValue("frmData_Main", 1, "ver_no") },
                { name: "rev_no", value: gw_com_api.getValue("frmData_Main", 1, "rev_no") },
                { name: "rev_type", value: gw_com_api.getValue("frmData_Main", 1, "rev_type") },
                { name: "use_yn", value: "1" },
                { name: "ins_usr", value: gw_com_module.v_Session.USR_ID },
                { name: "ins_dt", value: "SYSDT" }
            ]
        });
        data.push({
            file_id: this.file_id,
            file_nm: this.file_nm,
            file_ext: this.file_ext,
            file_path: this.file_path,
            file_desc: file_desc,
            data_tp: (v_global.logic.data_tp == undefined ? "" : v_global.logic.data_tp),
            data_key: (v_global.logic.data_key == undefined ? "" : v_global.logic.data_key),
            data_subkey: (v_global.logic.data_subkey == undefined ? "" : v_global.logic.data_subkey),
            data_seq: (v_global.logic.data_seq == undefined ? "" : v_global.logic.data_seq),
            data_subseq: (v_global.logic.data_subseq == undefined ? "" : v_global.logic.data_subseq),
            file_group1: gw_com_api.getValue("frmData_Main", 1, "file_group1"),
            file_group2: gw_com_api.getValue("frmData_Main", 1, "file_group2"),
            file_group3: gw_com_api.getValue("frmData_Main", 1, "file_group3"),
            file_group4: gw_com_api.getValue("frmData_Main", 1, "file_group4"),
            file_group5: gw_com_api.getValue("frmData_Main", 1, "file_group5")
        });

    })



    var args = {
        url: "COM", nomessage: true, user: gw_com_module.v_Session.USR_ID,
        param: [{ query: "SYS_File_Edit", row: row }],
        handler: { success: successSave, param: data }
    };

     // 연계정보
    if (v_global.logic.ref != undefined) {
        $.each(v_global.logic.ref, function () {
            $.each(this.row, function () {
                $.each(this.column, function () {
                    if (this.name == "file_id" && this.value == null)
                        this.value = data[0].file_id;
                })
            })
            args.param.push(this);
        })
    }
    // // 필수문서
    //if (v_global.logic.req_doc) {
    //    args = {
    //        query: "w_eccb1051_S_5",
    //        row: [
    //            {
    //                crud: "U",
    //                column: [
    //                    { name: "fid", value: v_global.logic.req_doc.fid },
    //                    { name: "file_id", value: v_global.logic.data_key }
    //                ]
    //            }
    //        ]
    //    }
    //}
    gw_com_module.objSave(args);
  

   

}
//----------
function successSave(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param
    };
    gw_com_module.streamInterface(args);
    processClear({});

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {
    // 1001 : msg_openedDialogue
    if (param.ID == gw_com_api.v_Stream.msg_openedDialogue) {

        v_global.logic = param.data;
        v_global.process.init = true;

        // Insert ZFILE Data Row 
        var args1 = { targetid: "frmData_Main", edit: true };
        if (param.data != undefined) {
            args1.data = [
                { name: "file_group1", value: (param.data.file_group1 == undefined ? gw_com_module.v_Session.DEPT_AREA : param.data.file_group1) },
                { name: "file_group2", value: (param.data.file_group2 == undefined ? "" : param.data.file_group2) },
                { name: "file_group3", value: (param.data.file_group3 == undefined ? "" : param.data.file_group3) },
                { name: "file_group4", value: (param.data.file_group4 == undefined ? "" : param.data.file_group4) },
                { name: "file_group5", value: (param.data.file_group5 == undefined ? "" : param.data.file_group5) },
                { name: "ver_no", value: "1" },
                { name: "rev_no", value: "0" },
                { name: "rev_type", value: "N" }
            ];
        }
        else {
            args1.data = [
                { name: "file_group1", value: gw_com_module.v_Session.DEPT_AREA }
            ];

        }
        gw_com_module.formInsert(args1);
    }

}   // streamProcess
