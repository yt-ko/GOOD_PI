
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

        // set data for DDDW List
        var args = { request: [
                {
                    type: "PAGE", name: "장비군", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "ISCM81" } ]
                },
                {
                    type: "PAGE", name: "업무구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "EDM010"}] 
                },
                {
                    type: "PAGE", name: "문서분류", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "EDM020"}]
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODE",
                    param: [ { argument: "arg_hcode", value: "ISCM29" } ]
                },
                {
                    type: "PAGE", name: "제품유형", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM25"}]
                },
                {
                    type: "PAGE", name: "변경구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "SYS310" }]
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            gw_com_api.setValue("frmData_설명", 1, "dept_area", gw_com_module.v_Session.DEPT_AREA) ;
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
        var args = {
            targetid: "frmData_설명", type: "TABLE", title: "파일 정보",
            width: "100%", show: true, selectable: true,
            editable: { bind: "select", focus: "file_desc", validate: true },
            content: { height: 25, width: { label: 70, field: 120 },
                row: [
                    {
                        element: [
                            { header: true, value: "장비군", format: { type: "label"} },
                            { name: "dept_area",
                                editable: { type: "select", validate: { rule: "required"}, 
								    data: { memory: "장비군" }                            	
                                }
                            },
                            { header: true, value: "업무구분", format: { type: "label"} },
                            { name: "biz_area",
                                editable: { type: "select", validate: { rule: "required"},
                            	    data: { memory: "업무구분" }
                                }
                            },
                            { header: true, value: "문서분류", format: { type: "label"} },
                            { name: "doc_area",
                                editable: { type: "select", validate: { rule: "required"},
                            	    data: { memory: "문서분류" } 
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "관련업체", format: { type: "label"} },
                            { name: "cust_cd",
                                editable: { type: "select", 
                            	    data: { memory: "고객사", unshift: [ { title: "-", value: "" } ] } 
                                }
                            },
                            { header: true, value: "제품유형", format: { type: "label"} },
                            { name: "prod_type",
                                editable: { type: "select", 
                            	    data: { memory: "제품유형", unshift: [ { title: "-", value: "" } ] } 
                                }
                            },
                            { header: true, value: "등록자", format: { type: "label"} },
                            { name: "user_id", editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "설명", format: { type: "label" } },
                            { name: "file_desc", style: { colspan: 5 }, 
                            	editable: { type: "text", maxlength: 100, width: 522 } 
                            },
                            { name: "folder_id", hidden: true, editable: { type: "hidden" } }
                        ]
                    },
                    {
                        element: [
                            { header: true, value: "Version", format: { type: "label" } },
                            { name: "ver_no", editable: { type: "hidden" } },
                            { header: true, value: "Rev. No.", format: { type: "label" } },
                            { name: "rev_no", editable: { type: "text", maxlength: 10, validate: { rule: "required" } } },
                            { header: true, value: "", format: { type: "label" } },
                            { header: false, value: "" },
                            { name: "rev_type", hidden: true, editable: { type: "hidden" } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        
        //==== Resize ====
        var args = {
            target: [
				{ type: "FORM", id: "frmData_설명", offset: 8 }
			]
        };
        gw_com_module.objResize(args);

    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (program section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    procedure: function () {

        //==== Button Click : Main ====
        var args = { targetid: "lyrMenu", element: "업로드", event: "click", handler: click_lyrMenu_업로드 };
        gw_com_module.eventBind(args);
        
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);

        //==== Button Events : Main ====
        function click_lyrMenu_업로드(ui) {
            var args = {
                target: [
                    { type: "FORM", id: "frmData_설명" }
                ]
            };
            if (gw_com_module.objValidate(args) == false) return false;

            var args = { targetid: "lyrServer", control: { by: "DX", id: ctlUpload } };
            gw_com_module.uploadFile(args);
        }

        function click_lyrMenu_닫기(ui) {
            processClose({});
        }

        // startup process.
        gw_com_module.startPage();
        var args = {
            ID: gw_com_api.v_Stream.msg_openedDialogue
        };
        gw_com_module.streamInterface(args);

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function processClear(param) {

    var args = {
        target: [
			{ type: "FORM", id: "frmData_설명" }
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
	var RevType = v_global.data.crud;
	if (v_global.data.revise) RevType = "R";

	var qryFolder = { query: "EDM_2010_S_1",	//EDM_FOLDER_D
        row: [ { crud: v_global.data.crud,
        column: [
            { name: "file_id", value: response.id },
            { name: "file_nm", value: response.file },
            { name: "file_ext", value: response.ext },
            { name: "file_path", value: response.path },
            { name: "search_tag", value: "" },
            { name: "file_desc", value: gw_com_api.getValue("frmData_설명", 1, "file_desc") },
            { name: "network_cd", value: "HTTP" },
            { name: "use_yn", value: "1" },
            { name: "file_rev", value: v_global.data.rev },
            { name: "file_seq", value: v_global.data.seq },
            { name: "folder_id", value: v_global.data.key },
            { name: "rev_tp", value: RevType }
        ] } ]
    };
	var qryZfile = { query: "DLG_FILE_ZFILE", // ZFILE
        row: [ { crud: "U",
        column: [
            { name: "file_id", value: response.id },
            { name: "file_ext", value: response.ext },
            { name: "file_path", value: response.path },
            { name: "file_group1", value: gw_com_api.getValue("frmData_설명", 1, "dept_area") },
            { name: "file_group2", value: gw_com_api.getValue("frmData_설명", 1, "biz_area") },
            { name: "file_group3", value: gw_com_api.getValue("frmData_설명", 1, "doc_area") },
            { name: "file_group4", value: gw_com_api.getValue("frmData_설명", 1, "cust_cd") },
            { name: "file_group5", value: gw_com_api.getValue("frmData_설명", 1, "folder_id") },
            { name: "file_desc", value: gw_com_api.getValue("frmData_설명", 1, "file_desc") },
            { name: "data_tp", value: v_global.data.type },
            { name: "data_key", value: v_global.data.key },
            { name: "data_seq", value: v_global.data.seq },
            { name: "use_yn", value: "1" },
            { name: "ver_no", value: gw_com_api.getValue("frmData_설명", 1, "ver_no") },
            { name: "rev_no", value: gw_com_api.getValue("frmData_설명", 1, "rev_no") },
            { name: "rev_type", value: gw_com_api.getValue("frmData_설명", 1, "rev_type") }
        ] } ]
	};

	var argParam;
	if (v_global.data.type == "EDM") argParam = [ qryFolder, qryZfile ];
	else argParam = [ qryZfile ];
	
    var args = { user: v_global.data.user,
        param: argParam,
        handler: { success: successSave }
    };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_uploaded_ASFOLDER,
        key: response
    };
    gw_com_module.streamInterface(args);
    gw_com_api.setValue("frmData_설명", 1, "file_desc", "");

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_upload_ASFOLDER:
            {
            	// v_global.data : user, key, seq, crud, rev, revise
                v_global.data = param.data;
                v_global.process.init = true;
                var args = { targetid: "frmData_설명", edit: true
		            ,data: [
		                { name: "dept_area", value: gw_com_module.v_Session.DEPT_AREA },
		                { name: "biz_area", value: (param.data.biz_area == undefined ? "" : param.data.biz_area) },
		                { name: "doc_area", value: (param.data.doc_area == undefined ? "" : param.data.doc_area) },
		                { name: "cust_cd", value: (param.data.cust_cd == undefined ? "" : param.data.cust_cd) },
		                { name: "prod_type", value: (param.data.prod_type == undefined ? "" : param.data.prod_type) },
		                { name: "folder_id", value: "" },
		                { name: "user_id", value: gw_com_module.v_Session.USR_NM },
                        { name: "ver_no", value: "1" },
                        { name: "rev_no", value: "0" },
                        { name: "rev_type", value: "N" }
		            ]
                };
                gw_com_module.formInsert(args);
            }
            break;
        case gw_com_api.v_Stream.msg_resultMessage: 
            {
                if (param.data.page != gw_com_api.getPageID()) break;

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
