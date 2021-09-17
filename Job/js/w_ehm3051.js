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
        gw_com_api.changeTheme("style_theme", "", true);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "조회",
				    act: true
				},
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "닫기",
				    value: "닫기"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2",
            type: "FREE",
            element: [
				{
				    name: "추가",
				    value: "추가"
				},
				{
				    name: "삭제",
				    value: "삭제"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3",
            type: "FREE",
            element: [
				{ name: "다운로드", value: "다운로드", icon: "실행" },
				{ name: "추가", value: "추가" },
				{ name: "수정", value: "수정", icon: "추가" },
				{ name: "삭제", value: "삭제" }
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_4",
            type: "FREE",
            element: [
				{
				    name: "다운로드",
				    value: "다운로드",
				    icon: "실행"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = { targetid: "frmOption_3", type: "FREE",
            trans: true,
            border: true,
            show: false,
            margin: 10,
            content: {
                row: [
                    {
                        align: "center",
                        element: [
				            {
				                name: "덮어쓰기",
				                value: "덮어쓰기",
				                format: {
				                    type: "button",
				                    icon: "기타"
				                }
				            },
                            {
                                name: "Revision",
                                value: "Revision 추가",
                                format: {
                                    type: "button",
                                    icon: "기타"
                                }
                            }
				        ]
                    }
			    ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_루트", query: "w_ehm3051_M_1", title: "기술 문서 폴더",
            //caption: true,
            width: 362,
            height: 552,
            pager: false,
            show: true,
            selectable: true,
            treegrid: { element: "folder_nm" },
            element: [
				{
				    header: "폴더명",
				    name: "folder_nm",
				    width: 250,
				    align: "left",
				    format: { type: "label" }
				}/*,
				{
				    header: "순번",
				    name: "sort_seq",
				    width: 30,
				    align: "center"
				}*/,
				{
				    header: "폴더수",
				    name: "folder_cnt",
				    width: 40,
				    align: "center"
				},
				{
				    header: "파일수",
				    name: "file_cnt",
				    width: 40,
				    align: "center"
				},
				{
				    name: "folder_id",
				    hidden: true
				},
				{
				    name: "parent_id",
				    hidden: true
				},
				{
				    name: "level_no",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_폴더", query: "w_ehm3051_M_2", title: "하위 폴더",
            caption: true,
            height: 109,
            pager: false,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "folder_nm",
                validate: true
            },
            element: [
                {
                    header: "순번",
                    name: "sort_seq",
                    width: 35,
                    align: "center",
                    editable: {
                        type: "text"
                    }
                },
				{
				    header: "폴더명",
				    name: "folder_nm",
				    width: 220,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "설명",
				    name: "folder_desc",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "use_yn",
				    hidden: true
				},
				{
				    name: "folder_id",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "parent_id",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				},
				{
				    name: "level_no",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "grdData_문서", query: "w_ehm3051_S_1", title: "문서 파일",
            caption: true, height: 132, pager: false, show: true, selectable: true,
            editable: { master: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                {
                    header: "순번",
                    name: "file_seq",
                    width: 35,
                    align: "center",
                    editable: {
                        type: "hidden"
                    }
                },
				{
				    header: "파일명",
				    name: "file_nm",
				    width: 220,
				    align: "left"
				},
				{
				    header: "Rev",
				    name: "file_rev",
				    width: 30,
				    align: "center"
				},
				{
				    header: "키워드",
				    name: "search_tag",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "설명",
				    name: "file_desc",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "file_path",
				    hidden: true
				},
				{
				    name: "file_ext",
				    hidden: true
				},
				{
				    name: "network_cd",
				    hidden: true
				},
				{
				    name: "use_yn",
				    hidden: true
				},
				{
				    name: "file_id",
				    hidden: true
				},
				{
				    name: "folder_id",
				    hidden: true,
				    editable: {
				        type: "hidden"
				    }
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_이력",
            query: "w_ehm3051_S_2",
            title: "파일 이력",
            caption: true,
            height: 86,
            pager: false,
            show: true,
            selectable: true,
            element: [
                {
                    header: "순번",
                    name: "file_seq",
                    width: 35,
                    align: "center"
                },
				{
				    header: "파일명",
				    name: "file_nm",
				    width: 220,
				    align: "left"
				},
				{
				    header: "Rev",
				    name: "file_rev",
				    width: 30,
				    align: "center"
				},
				{
				    header: "키워드",
				    name: "search_tag",
				    width: 200,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
				{
				    header: "설명",
				    name: "file_desc",
				    width: 300,
				    align: "left"
				},
				{
				    header: "등록자",
				    name: "ins_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "등록일시",
				    name: "ins_dt",
				    width: 160,
				    align: "center"
				},
				{
				    header: "수정자",
				    name: "upd_usr",
				    width: 70,
				    align: "center"
				},
				{
				    header: "수정일시",
				    name: "upd_dt",
				    width: 160,
				    align: "center"
				},
				{
				    name: "file_path",
				    hidden: true
				},
				{
				    name: "file_ext",
				    hidden: true
				},
				{
				    name: "network_cd",
				    hidden: true
				},
				{
				    name: "use_yn",
				    hidden: true
				},
				{
				    name: "file_id",
				    hidden: true
				},
				{
				    name: "folder_id",
				    hidden: true
				}
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
				{
				    type: "GRID",
				    id: "grdData_폴더",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_문서",
				    offset: 8
				},
				{
				    type: "GRID",
				    id: "grdData_이력",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_1",
            collapsible: true,
            target: [
				{
				    type: "GRID",
				    id: "grdData_루트",
				    title: "기술문서 폴더"
				}
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            tabid: "lyrTab_2",
            collapsible: true,
            target: [
				{
				    type: "LAYER",
				    id: "lyrData_내용",
				    title: "폴더 내용"
				}
			]
        };
        //----------
        gw_com_module.convertTab(args);
        //=====================================================================================
        var args = {
            target: [
				{
				    type: "TAB",
				    id: "lyrTab_2",
				    offset: 8
				}
			]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        gw_job_process.procedure();

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
        var args = {
            targetid: "lyrMenu_1",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_1_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "저장",
            event: "click",
            handler: click_lyrMenu_1_저장
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "닫기",
            event: "click",
            handler: click_lyrMenu_1_닫기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_2_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_2_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "다운로드", event: "click", handler: click_lyrMenu_3_다운로드 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: click_lyrMenu_3_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "수정",
            event: "click",
            handler: click_lyrMenu_3_수정
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_3",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_3_삭제
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_4",
            element: "다운로드",
            event: "click",
            handler: click_lyrMenu_4_다운로드
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3",
            element: "덮어쓰기",
            event: "click",
            handler: click_frmOption_3_덮어쓰기
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption_3",
            element: "Revision",
            event: "click",
            handler: click_frmOption_3_Revision
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_루트",
            grid: true,
            event: "rowselecting",
            handler: rowselecting_grdData_루트
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_루트",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_루트
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_문서",
            grid: true,
            event: "rowselected",
            handler: rowselected_grdData_문서
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_조회() {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_폴더",
                edit: true,
                data: [
                    { name: "sort_seq", rule: "INCREMENT", value: 1 },
                    { name: "parent_id", value: gw_com_api.getValue("grdData_루트", "selected", "folder_id", true) },
                    { name: "level_no", value: parseInt(gw_com_api.getValue("grdData_루트", "selected", "level_no", true)) + 2 },
                    { name: "use_yn", value: "1" }
                ]
            };
            gw_com_module.gridInsert(args);

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_3_다운로드(ui) {
            closeOption({});
            var args = {
                source: { id: "grdData_문서", row: "selected" },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);
        }
        //----------
        function click_lyrMenu_3_추가(ui) {

            if (!checkManipulate({})) return;

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = ui.element;

            processUpload({});

        }
        //----------
        function click_lyrMenu_3_수정(ui) {

            var args = {
                target: [ { id: "frmOption_3" } ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_3_삭제(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.process.handler = processRemove;

            checkRemovable({ sub: true });

        }
        //----------
        function click_lyrMenu_4_다운로드(ui) {

            closeOption({});

            var args = {
                source: {
                    id: "grdData_이력",
                    row: gw_com_api.getSelectedRow("grdData_이력")
                },
                targetid: "lyrDown"
            };

            gw_com_module.downloadFile(args);

        }
        //----------
        function click_frmOption_3_덮어쓰기(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = ui.element;

            processUpload({});

        }
        //----------
        function click_frmOption_3_Revision(ui) {

            if (!checkManipulate({ sub: true })) return;

            v_global.event.type = ui.type;
            v_global.event.object = ui.object;
            v_global.event.row = ui.row;
            v_global.event.element = ui.element;

            processUpload({});

        }        
        //----------
        function rowselecting_grdData_루트(ui) {

            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;

            return checkUpdatable({});

        }
        //----------
        function rowselected_grdData_루트(ui) {

            v_global.process.prev.master = ui.row;

            processLink({});

        };
        //----------
        function rowselected_grdData_문서(ui) {

            processLink({ sub: true });

        };

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
function checkCRUD(param) {

    return ((param.sub)
            ? gw_com_api.getCRUD("grdData_문서", "selected", true)
            : gw_com_api.getCRUD("grdData_폴더", "selected", true));

}
//----------
function checkManipulate(param) {

    closeOption({});

    if ((param.sub && gw_com_api.getSelectedRow("grdData_문서") == null)
        || (param.detail && gw_com_api.getSelectedRow("grdData_이력") == null)) {
        gw_com_api.messageBox([
            { text: "작업할 문서 파일이 선택되지 않았습니다." }
        ]);
        return false;
    }
    else if (gw_com_api.getSelectedRow("grdData_루트") == null) {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_폴더"
            },
			{
			    type: "GRID",
			    id: "grdData_문서"
			}
		]
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});

    var status = checkCRUD(param);
    if (status == "initialize" || status == "create")
        processDelete(param);
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);

}
//----------
function checkClosable(param) {

    closeOption({});

    v_global.process.handler = processClose;

    if (!checkUpdatable({})) return;

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {
        target: [
			{
			    type: "GRID",
			    id: "grdData_루트",
			    option: "TREE",
			    select: true
			}
		],
        clear: [
            {
                type: "GRID",
                id: "grdData_루트"
            },
            {
                type: "GRID",
                id: "grdData_폴더"
            },
            {
                type: "GRID",
                id: "grdData_문서"
            },
            {
                type: "GRID",
                id: "grdData_이력"
            }
	    ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    if (param.sub) {
        args = {
            source: {
                type: "GRID",
                id: "grdData_문서",
                row: "selected",
                block: true,
                element: [
				    {
				        name: "folder_id",
				        argument: "arg_folder_id"
				    },
                    {
                        name: "file_seq",
                        argument: "arg_file_seq"
                    }
			    ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_이력"
                }
		    ],
            key: param.key
        };
    }
    else {
        args = {
            source: {
                type: "GRID",
                id: "grdData_루트",
                row: "selected",
                block: true,
                element: [
				    {
				        name: "folder_id",
				        argument: "arg_folder_id"
				    }
			    ]
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_폴더"
                },
                {
                    type: "GRID",
                    id: "grdData_문서"
                }
		    ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_이력"
                }
		    ],
            key: param.key
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    gw_com_api.selectRow("grdData_루트", v_global.process.current.master, true, false);

}
//----------
function processUpload(param) {

    closeOption({});

    var args = { type: "PAGE", page: "w_upload_asfolder", title: "파일 업로드", width: 650, height: 160, open: true };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "w_upload_asfolder",
            param: {
                ID: gw_com_api.v_Stream.msg_upload_ASFOLDER,
                data: {
                    user: gw_com_module.v_Session.USR_ID,
                    key: gw_com_api.getValue("grdData_루트", "selected", "folder_id", true)
                }
            }
        };
        switch (v_global.event.element) {
            case "추가":
                {
                    args.param.data.crud = "C";
                    args.param.data.seq = "";
                    args.param.data.revision = 1;
                }
                break;
            case "덮어쓰기":
                {
                    args.param.data.crud = "U";
                    args.param.data.seq = gw_com_api.getValue("grdData_문서", "selected", "file_seq", true);
                    args.param.data.revision = gw_com_api.getValue("grdData_문서", "selected", "file_rev", true);
                }
                break;
            case "Revision":
                {
                    args.param.data.crud = "U";
                    args.param.data.revise = true;
                    args.param.data.seq = gw_com_api.getValue("grdData_문서", "selected", "file_seq", true);
                    args.param.data.revision = parseInt(gw_com_api.getValue("grdData_문서", "selected", "file_rev", true)) + 1;
                }
                break;
        }
        gw_com_module.dialogueOpen(args);
    }
}
//----------
function processDelete(param) {

    var args = {};
    if (param.sub) {
        args = {
            targetid: "grdData_문서",
            row: "selected",
            remove: true,
            clear: [
                {
                    type: "GRID",
                    id: "grdData_이력"
                }
            ]
        };
    }
    else {
        args = {
            targetid: "grdData_폴더",
            row: "selected",
            remove: true
        };
    }
    gw_com_module.gridDelete(args);

}
//----------
function processSave(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_폴더"
            },
			{
			    type: "GRID",
			    id: "grdData_문서"
			}
		]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {};
    if (param.sub) {
        var args = {
            target: [
		        { type: "GRID", id: "grdData_문서",
		            key: [ { row: "selected", element: [ { name: "folder_id" }, { name: "file_seq" } ] } ]
		        }
	        ],
            handler: { success: successRemove, param: param }
        };
        gw_com_module.objRemove(args);
    }
    else {
        var args = {
            url: "COM",
            procedure: "PROC_AS_FOLDER_DELETE",
            nomessage: true,
            input: [
            { name: "folder_id", value: gw_com_api.getValue("grdData_폴더", "selected", "folder_id", true), type: "varchar" },
            { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
            output: [
            { name: "r_value", type: "int" },
            { name: "message", type: "varchar" }
        ],
            handler: {
                success: completeRemove,
                param: param
            }
        };
        gw_com_module.callProcedure(args);
    }

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

    gw_com_api.hide("frmOption_3");

}
//----------
function closeDialogue(param) {

    var args = { page: param.page };
    gw_com_module.dialogueClose(args);
    if (param.focus) {
        gw_com_api.setFocus(v_global.event.object,
	                        v_global.event.row,
	                        v_global.event.element,
	                        (v_global.event.type == "GRID") ? true : false);
    }

}
//----------
function successSave(response, param) {

    var status = checkCRUD({});
    if (status == "create" || status == "update")
        processRetrieve({});
    else
        processLink({ key: response });

}
//----------
function completeRemove(response, param) {

    gw_com_api.messageBox([
        { text: response.VALUE[1] }
    ], 420, gw_com_api.v_Message.msg_informBatched, "ALERT",
    { handler: successRemove, response: response, param: {} });

}
//----------
function successRemove(response, param) {

    if (param.sub)
        processDelete(param);
    else if(response.VALUE[0] != -1)
        processRetrieve({});

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
                    case gw_com_api.v_Message.msg_confirmRemove: { 
                        	if (param.data.result == "YES")
                                processRemove(param.data.arg);
                        } break;
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
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER:
            {
                var args = { key: param.key,
                    source: { type: "GRID", id: "grdData_루트", row: "selected", block: true,
                        element: [
				            { name: "folder_id", argument: "arg_folder_id" }
			            ]
                    },
                    target: [
                        { type: "GRID", id: "grdData_문서", select: true }
		            ]
                };
                gw_com_module.objRetrieve(args);
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "w_upload_asfolder":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("grdData_루트", "selected", "folder_id", true)
                            };
                            switch (v_global.event.element) {
                                case "추가":
                                    {
                                        args.data.crud = "C";
                                        args.data.seq = "";
                                        args.data.revision = 1;
                                    }
                                    break;
                                case "덮어쓰기":
                                    {
                                        args.data.crud = "U";
                                        args.data.seq = gw_com_api.getValue("grdData_문서", "selected", "file_seq", true);
                                        args.data.revision = gw_com_api.getValue("grdData_문서", "selected", "file_rev", true);
                                    }
                                    break;
                                case "Revision":
                                    {
                                        args.data.crud = "U";
                                        args.data.revise = true;
                                        args.data.seq = gw_com_api.getValue("grdData_문서", "selected", "file_seq", true);
                                        args.data.revision = parseInt(gw_com_api.getValue("grdData_문서", "selected", "file_rev", true)) + 1;
                                    }
                                    break;
                            }
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//