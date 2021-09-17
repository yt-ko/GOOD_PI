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
        var args = {
            request: [
                {
                    type: "PAGE", name: "사원", query: "dddw_emp_usr"
                }
			],
            starter: start
        };
        gw_com_module.selectSet(args);

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
            targetid: "lyrMenu",
            type: "FREE",
            element: [
				{
				    name: "조회",
				    value: "검색",
				    icon: "검색",
				    act: true
				},
                {
                    name: "다운로드",
                    value: "다운로드",
                    icon: "실행"
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
				    name: "다운로드",
				    value: "다운로드",
				    icon: "실행"
				}
			]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption",
            type: "FREE",
            title: "조회 조건",
            trans: true,
            border: true,
            //show: true,
            editable: {
                focus: "search_tag",
                validate: true
            },
            remark: "lyrRemark"/*,
            remark: {
                id: "lyrRemark",
                margin: 380
            }*/,
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "ins_usr",
                                label: {
                                    title: "등록자 :"
                                },
                                value: "%",
                                editable: {
                                    /*
                                    type: "text",
                                    size: 6,
                                    maxlength: 10
                                    */
                                    type: "select",
				                    data: {
				                        memory: "사원",
				                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
				                    }
                                }
                            },
                            {
                                name: "upd_usr",
                                value: "%",
                                label: {
                                    title: "수정자 :"
                                },
                                editable: {
                                    /*
                                    type: "text",
                                    size: 6,
                                    maxlength: 10
                                    */
                                    type: "select",
                                    data: {
                                        memory: "사원",
                                        unshift: [
				                            { title: "전체", value: "%" }
				                        ]
                                    }
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "ymd_fr",
                                label: {
                                    title: "등록일자 :"
                                },
                                mask: "date-ymd",
                                editable: {
                                    type: "text",
                                    size: 7,
                                    maxlength: 10
                                }
                            },
				            {
				                name: "ymd_to",
				                label: {
				                    title: "~"
				                },
				                mask: "date-ymd",
				                editable: {
				                    type: "text",
				                    size: 7,
				                    maxlength: 10
				                }
				            }
                        ]
                    },
                    {
                        element: [
				            {
				                name: "search_tag",
				                label: {
				                    title: "키워드 :"
				                },
				                editable: {
				                    type: "text",
				                    size: 20,
				                    maxlength: 20
				                }
				            },
                            {
                                name: "file_desc",
                                label: {
                                    title: "설명 :"
                                },
                                editable: {
                                    type: "text",
                                    size: 28,
                                    maxlength: 20
                                }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            {
                                name: "실행",
                                value: "실행",
                                act: true,
                                format: {
                                    type: "button"
                                }
                            },
				            {
				                name: "취소",
				                value: "취소",
				                format: {
				                    type: "button",
				                    icon: "닫기"
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
        var args = {
            targetid: "grdData_루트",
            query: "w_ehm3050_M_1",
            title: "기술문서 폴더",
            caption: true,
            width: 362,
            height: 440,
            pager: false,
            show: true,
            selectable: true,
            treegrid: {
                element: "folder_nm"
            },
            element: [
				{
				    header: "폴더명",
				    name: "folder_nm",
				    width: 250,
				    align: "left",
				    format: {
				        type: "label"
				    }
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
        var args = {
            targetid: "grdData_문서",
            query: "w_ehm3050_S_1",
            title: "문서 파일",
            caption: true,
            height: 246,
            //pager: false,
            number: true,
            show: true,
            selectable: true,
            element: [
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
				    align: "left"
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
				},
				{
				    name: "file_seq",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_이력",
            query: "w_ehm3050_S_2",
            title: "문서 파일 이력",
            caption: true,
            height: 86,
            pager: false,
            number: true,
            show: true,
            selectable: true,
            element: [
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
				    align: "left"
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
				},
				{
				    name: "file_seq",
				    hidden: true
				}
			]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "lyrDown",
            width: 0,
            height: 0,
            show: false
        };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
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
            targetid: "lyrMenu",
            element: "조회",
            event: "click",
            handler: click_lyrMenu_조회
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu",
            element: "다운로드",
            event: "click",
            handler: click_lyrMenu_다운로드
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
        //----------
        var args = {
            targetid: "lyrMenu_2",
            element: "다운로드",
            event: "click",
            handler: click_lyrMenu_2_다운로드
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "실행",
            event: "click",
            handler: click_frmOption_실행
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmOption",
            element: "취소",
            event: "click",
            handler: click_frmOption_취소
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
        function click_lyrMenu_조회() {

            var args = {
                target: [
					{
					    id: "frmOption",
					    focus: true
					}
				]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_다운로드(ui) {

            closeOption({});

            var args = {
                source: {
                    id: "grdData_문서",
                    row: "selected"
                },
                targetid: "lyrDown"
            };

            gw_com_module.downloadFile(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_lyrMenu_2_다운로드(ui) {

            closeOption({});

            var args = {
                source: {
                    id: "grdData_이력",
                    row: "selected"
                },
                targetid: "lyrDown"
            };

            gw_com_module.downloadFile(args);

        }
        //----------
        function click_frmOption_실행(ui) {

            processRetrieve({ review: true });

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }
        //----------
        function rowselected_grdData_루트(ui) {

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
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -6 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
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
function checkClosable(param) {

    closeOption({});

    processClose({});

}
//----------
function processRetrieve(param) {

    var args = {};
    if (param.review) {
        gw_com_api.selectRow("grdData_루트", "reset");

        args = {
            source: {
                type: "FORM",
                id: "frmOption",
                hide: true,
                element: [
                    {
                        name: "ins_usr",
                        argument: "arg_ins_usr"
                    },
                    {
                        name: "upd_usr",
                        argument: "arg_upd_usr"
                    },
                    {
                        name: "ymd_fr",
                        argument: "arg_ymd_fr"
                    },
                    {
                        name: "ymd_to",
                        argument: "arg_ymd_to"
                    },
				    {
				        name: "search_tag",
				        argument: "arg_search_tag"
				    },
				    {
				        name: "file_desc",
				        argument: "arg_file_desc"
				    }
			    ],
				remark: [
                    {
                        element: [{ name: "ins_usr"}]
                    },
                    {
                        element: [{ name: "upd_usr"}]
                    },
                    {
                        infix: "~",
                        element: [
	                    { name: "ymd_fr" },
		                { name: "ymd_to" }
		            ]
                    },
		            {
		                element: [{ name: "search_tag"}]
		            },
		            {
		                element: [{ name: "file_desc"}]
		            }
		        ]
            },
            target: [
			    {
			        query: "w_ehm3052_S_2",
			        type: "GRID",
			        id: "grdData_문서",
			        select: true
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
    else {
        args = {
            target: [
			    {
			        type: "GRID",
			        id: "grdData_루트",
			        option: "TREE"
			    }
		    ],
            clear: [
                {
                    type: "GRID",
                    id: "grdData_루트"
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
    }
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
			    ],
				noremark: "lyrRemark"
            },
            target: [
                {
                    type: "GRID",
                    id: "grdData_문서",
                    select: true
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
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//