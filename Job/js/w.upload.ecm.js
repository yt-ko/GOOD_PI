
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {}, init: false },
    data: null,
    logic: {}
};

var gw_job_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");
        v_global.logic.datatype = gw_com_module.v_Option.datatype;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
				{
				    type: "PAGE", name: "ECM010", query: "DDDW_CM_CODE",
				    param: [{ argument: "arg_hcode", value: "ECM010" }]
				},
                {
                    type: "INLINE", name: "언어",
                    data: [
                        { title: "국문", value: "KOR" },
                        { title: "영문", value: "ENG" }
                    ]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();

            gw_com_module.startPage();
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
        }

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    UI: function () {

        //==== Menu : Main ====
        var args = { targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "업로드", value: "업로드", icon: "저장", act: true },
				{ name: "닫기", value: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);

        //==== Form : Main ====
        var args = { targetid: "frmData_FILE", type: "TABLE", title: "파일 정보",
            show: true, selectable: true, key: true,
            editable: { bind: "select", focus: "file_desc", validate: true },
            content: { height: 25, width: { label: 70, field: 80 },
                row: [
                    {
                        element: [
                            { header: true, value: "문서구분", format: { type: "label" } },
                            {
                                name: "doc_tp",
                                format: { type: "select", data: { memory: "ECM010" } },
                                editable: { type: "select", data: { memory: "ECM010" }, validate: { rule: "required", message: "문서구분" } }
                            },
                            { header: true, value: "언어", format: { type: "label" } },
				            {
				                name: "doc_lang",
				                format: { type: "select", data: { memory: "언어" } },
				                editable: { type: "select", data: { memory: "언어" }, validate: { rule: "required", message: "언어" } }
				            },
                            { header: true, value: "필수", format: { type: "label" } },
				            {
				                name: "require_yn",
				                format: { type: "checkbox", value: "1", offval: "0", title: "" },
				                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
				            },
                            { header: true, value: "편집", format: { type: "label" } },
				            {
				                name: "edit_yn",
				                format: { type: "checkbox", value: "1", offval: "0", title: "" },
				                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
				            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설명", format: { type: "label" } },
                            { name: "file_desc", editable: { type: "text", width: 570, maxlength: 150 }, style: { colspan: 7 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        
        //==== Resize ====
        var args = {
            target: [
				{ type: "FORM", id: "frmData_FILE", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: processUpload };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmData_FILE", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //=====================================================================================

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function processItemchanged(param) {

    switch (param.element) {
        case "doc_tp":
            {
                if (param.value.current == "2") {
                    // 부속서류
                    gw_com_api.setValue(param.object, param.row, "edit_yn", "1");
                }
            }
            break;
        case "edit_yn":
            {
                if (param.value.current == "0" && gw_com_api.getValue(param.object, param.row, "doc_tp") == "2") {
                    gw_com_api.setValue(param.object, param.row, param.element, "1", false, false, false);
                }
            }
            break;
    }

}
//----------
function processUpload(param) {

    var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
    gw_com_module.uploadFile(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_FILE" }
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
function successUpload(response) {

    var data = [
        {
            query: "DLG_FILE_ZFILE", // ZFILE
            row: [{
                crud: "U",
                column: [
                    { name: "file_id", value: response.id },
                    { name: "file_path", value: response.path },
                    { name: "file_ext", value: response.ext },
                    { name: "file_desc", value: gw_com_api.getValue("frmData_FILE", 1, "file_desc") },
                    { name: "data_tp", value: v_global.data.type },
                    //{ name: "data_key", value: (v_global.data.key == undefined ? "" : v_global.data.key) },
                    //{ name: "data_subseq", value: (v_global.data.data_subseq == undefined ? "" : v_global.data.data_subseq) },
                    { name: "data_seq", value: (v_global.data.seq == undefined ? "" : v_global.data.seq) }
                ]
            }]
        },
        {
            query: "ECM_1010_2",    // 계약서양식
            row: [{
                crud: v_global.data.std_id == "" ? "C" : "U",
                column: [
                    { name: "std_id", value: v_global.data.std_id },
                    { name: "doc_tp", value: gw_com_api.getValue("frmData_FILE", 1, "doc_tp") },
                    { name: "doc_nm", value: response.file.split(".")[0] },
                    { name: "doc_lang", value: gw_com_api.getValue("frmData_FILE", 1, "doc_lang") },
                    { name: "require_yn", value: gw_com_api.getValue("frmData_FILE", 1, "require_yn") },
                    { name: "edit_yn", value: gw_com_api.getValue("frmData_FILE", 1, "edit_yn") },
                    { name: "file_id", value: response.id }
                ]
            }]
        }
    ];

    if (data[1].row[0].crud == "C") {
        data[1].row[0].column.push({ name: "grp_id", value: v_global.data.grp_id });
    }

	var args = {
	    user: gw_com_module.v_Session.USR_ID,
	        param: data,
	        handler: {
	            success: successSave,
	            param: {
	                std_id: v_global.data.std_id,
	                grp_id: v_global.data.grp_id,
	                file_id: response.id,
	                file_path: response.path,
                    file_nm: response.file,
                    file_ext: response.ext
	            }
	        }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param
    };
    gw_com_module.streamInterface(args);

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.data = param.data;
                v_global.process.init = true;
                var args = {
                    targetid: "frmData_FILE", edit: true,
                    data: [
		                { name: "doc_tp", value: v_global.data.doc_tp ? v_global.data.doc_tp : "1" },
		                { name: "doc_lang", value: v_global.data.doc_lang ? v_global.data.doc_lang : "KOR" },
		                { name: "require_yn", value: v_global.data.require_yn ? v_global.data.require_yn : "0" },
		                { name: "edit_yn", value: v_global.data.edit_yn ? v_global.data.edit_yn : "0" }
                    ],
                    clear: [
                        { type: "FORM", id: "frmData_FILE" }
                    ]
                };
                gw_com_module.formInsert(args);
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
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        } break;
                }
            } break;
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
