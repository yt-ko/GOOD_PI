
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
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

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // entry point. (pre-process section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function () {

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        gw_com_api.changeTheme("style_theme");

        // prepare dialogue.
        var args = { type: "PAGE", page: "IFProcess", path: "../Master/", title: "그룹웨어 로그인",
            width: 430, height: 90, locate: ["center", 200]
        };
        gw_com_module.dialoguePrepare(args);

        //----------
        var args = {
            request: [
                { type: "PAGE", name: "진행상태", query: "dddw_zcode",
                    param: [ { argument: "arg_hcode", value: "ECCB42" } ]
                },
                { type: "PAGE", name: "부서", query: "dddw_dept" },
                { type: "PAGE", name: "사원", query: "dddw_emp" }
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
            targetid: "lyrMenu_1",
            type: "FREE",
            element: [
                {
                    name: "미리보기",
                    value: "미리보기",
                    icon: "출력"
                },
				{
				    name: "상신",
				    value: "결재상신",
				    icon: "기타"
				}/*,
                {
                    name: "회수",
                    value: "상신취소",
                    icon: "기타"
                }*/,
				{
				    name: "추가",
				    value: "추가"/*,
				    act: true*/
				},
				{
				    name: "저장",
				    value: "저장"
				},
				{
				    name: "삭제",
				    value: "삭제"
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
            targetid: "frmData_내역",
            query: "w_eccb4020_M_1",
            type: "TABLE",
            title: "개선 내역",
            caption: true,
            show: true,
            selectable: true,
            editable: {
                bind: "select",
                focus: "act_dept1_nm",
                validate: true
            },
            content: {
                width: {
                    label: 100,
                    field: 190
                },
                height: 25,
                row: [
                    {
                        element: [
                            {
                                header: true,
                                value: "ECR No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ecr_no"
                            },
                            {
                                header: true,
                                value: "ECO No.",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "eco_no",
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                header: true,
                                value: "진행상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "pstat_text"
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "개선제안명",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "ecr_title",
                                format: {
                                    width: 800
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "제안부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "ecr_dept_nm"
                            },
                            {
                                header: true,
                                value: "실행부서",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3,
                                    colfloat: "float"
                                },
                                name: "act_dept1_nm",
                                mask: "search",
                                display: true,
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "act_dept2_nm",
                                mask: "search",
                                display: true,
                                format: {
                                    width: 100
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                name: "act_dept1",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "act_dept2",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "대표실행자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "act_emp_nm",
                                mask: "search",
                                display: true,
                                editable: {
                                    type: "text"
                                }
                            },
                            {
                                header: true,
                                value: "공동실행자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 3,
                                    colfloat: "float"
                                },
                                name: "sub_emp1_nm",
                                mask: "search",
                                display: true,
                                format: {
                                    width: 70
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                style: {
                                    colfloat: "floating"
                                },
                                name: "sub_emp2_nm",
                                mask: "search",
                                display: true,
                                format: {
                                    width: 70
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                style: {
                                    colfloat: "floated"
                                },
                                name: "sub_emp3_nm",
                                mask: "search",
                                display: true,
                                format: {
                                    width: 70
                                },
                                editable: {
                                    type: "text",
                                    width: 155
                                }
                            },
                            {
                                name: "act_emp",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "sub_emp1",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "sub_emp2",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "sub_emp3",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "개선실시내용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "act_desc",
                                format: {
                                    type: "textarea",
                                    rows: 8,
                                    width: 800
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 8,
                                    width: 800
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "횡전개적용",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "act_amt_note",
                                format: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 800
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 5,
                                    width: 800
                                }
                            }
                        ]
                    }/*,
                    {
                        element: [
                            {
                                header: true,
                                value: "개선사례",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                style: {
                                    colspan: 5
                                },
                                name: "act_case",
                                format: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 800
                                },
                                editable: {
                                    type: "textarea",
                                    rows: 4,
                                    width: 800
                                }
                            }
                        ]
                    }*/,
                    {
                        element: [
                            {
                                header: true,
                                value: "보고자",
                                format: {
                                    type: "label"
                                }
                            },
                            { name: "rpt_emp",
                                format: { type: "select", data: { memory: "사원" } },
                                editable: { type: "select", data: { memory: "사원" } }
                            },
                            {
                                header: true,
                                value: "보고부서",
                                format: {
                                    type: "label"
                                }
                            },
                            { name: "rpt_dept",
                                format: { type: "select", data: { memory: "부서" } },
                                editable: { type: "select", data: { memory: "부서" } }
                            },
                            {
                                header: true,
                                value: "보고일자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "rpt_dt",
                                mask: "date-ymd",
                                editable: {
                                    type: "text"
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                header: true,
                                value: "승인상태",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "gw_astat_nm"
                            },
                            {
                                header: true,
                                value: "승인자",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "gw_aemp"
                            },
                            {
                                header: true,
                                value: "승인일시",
                                format: {
                                    type: "label"
                                }
                            },
                            {
                                name: "gw_adate"
                            },
                            {
                                name: "gw_astat",
                                hidden: true
                            },
                            {
                                name: "gw_key",
                                hidden: true
                            },
                            {
                                name: "gw_seq",
                                hidden: true
                            }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        //=====================================================================================
        var args = {
            targetid: "frmData_메모A",
            query: "w_eccb4020_S_1_1",
            type: "TABLE",
            title: "개선 사례 (개선 전)",
            caption: true,
            show: true,
            fixed: true,
            selectable: true,
            editable: {
                bind: "select",
                validate: true
            },
            content: {
                width: {
                    field: "100%"
                },
                height: 370,
                row: [
                    {
                        element: [
                            {
                                name: "memo_html",
                                format: {
                                    type: "html",
                                    height: 370,
                                    top: 5
                                }
                            },
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "memo_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "frmData_메모B",
            query: "w_eccb4020_S_1_2",
            type: "TABLE",
            title: "개선 사례 (개선 후)",
            caption: true,
            show: true,
            fixed: true,
            selectable: true,
            editable: {
                bind: "select",
                validate: true
            },
            content: {
                width: {
                    field: "100%"
                },
                height: 370,
                row: [
                    {
                        element: [
                            {
                                name: "memo_html",
                                format: {
                                    type: "html",
                                    height: 370,
                                    top: 5
                                }
                            },
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "memo_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "frmData_메모C",
            query: "w_eccb4020_S_1_3",
            type: "TABLE",
            title: "유형 효과 (정량적 개선)",
            caption: true,
            show: true,
            fixed: true,
            selectable: true,
            editable: {
                bind: "select",
                validate: true
            },
            content: {
                width: {
                    field: "100%"
                },
                height: 370,
                row: [
                    {
                        element: [
                            {
                                name: "memo_html",
                                format: {
                                    type: "html",
                                    height: 370,
                                    top: 5
                                }
                            },
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "memo_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "frmData_메모D",
            query: "w_eccb4020_S_1_4",
            type: "TABLE",
            title: "무형 효과 (정성적 개선)",
            caption: true,
            show: true,
            fixed: true,
            selectable: true,
            editable: {
                bind: "select",
                validate: true
            },
            content: {
                width: {
                    field: "100%"
                },
                height: 370,
                row: [
                    {
                        element: [
                            {
                                name: "memo_html",
                                format: {
                                    type: "html",
                                    height: 370,
                                    top: 5
                                }
                            },
                            {
                                name: "memo_text",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "memo_cd",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_seq",
                                hidden: true,
                                editable: {
                                    type: "hidden"
                                }
                            },
                            {
                                name: "root_no",
                                hidden: true,
                                editable: {
                                    type: "hidden"
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
            targetid: "grdData_첨부",
            query: "w_eccb4020_S_2",
            title: "첨부 문서",
            caption: true,
            height: "100%",
            pager: false,
            show: true,
            number: true,
            selectable: true,
            editable: {
                multi: true,
                bind: "select",
                focus: "file_desc",
                validate: true
            },
            element: [
				{
				    header: "파일명",
				    name: "file_nm",
				    width: 300,
				    align: "left"
				},
				{
				    header: "다운로드",
				    name: "download",
				    width: 60,
				    align: "center",
				    format: {
				        type: "link",
				        value: "다운로드"
				    }
				},
				{
				    header: "파일설명",
				    name: "file_desc",
				    width: 300,
				    align: "left",
				    editable: {
				        type: "text"
				    }
				},
                {
                    name: "file_ext",
                    hidden: true
                },
                {
                    name: "file_path",
                    hidden: true
                },
                {
                    name: "network_cd",
                    hidden: true
                },
                {
                    name: "data_tp",
                    hidden: true
                },
                {
                    name: "data_key",
                    hidden: true
                },
                {
                    name: "data_seq",
                    hidden: true
                },
                {
                    name: "file_id",
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
				    type: "FORM",
				    id: "frmData_내역",
				    offset: 8
				}/*,
                {
                    type: "FORM",
                    id: "frmData_효과",
                    offset: 8
                }*/,
				{
				    type: "GRID",
				    id: "grdData_첨부",
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
            element: "미리보기",
            event: "click",
            handler: click_lyrMenu_1_미리보기
        };
        gw_com_module.eventBind(args);


        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "상신",
            event: "click",
            handler: click_lyrMenu_1_상신
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "추가",
            event: "click",
            handler: click_lyrMenu_1_추가
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "lyrMenu_1",
            element: "삭제",
            event: "click",
            handler: click_lyrMenu_1_삭제
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
        var args = {
            targetid: "frmData_내역",
            event: "itemdblclick",
            handler: itemdblclick_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_내역",
            event: "itemkeyenter",
            handler: itemdblclick_frmData_내역
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모A",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모A
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모B",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모B
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모C",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모C
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmData_메모D",
            event: "itemdblclick",
            handler: itemdblclick_frmData_메모D
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "grdData_첨부",
            grid: true,
            element: "download",
            event: "click",
            handler: click_grdData_첨부_download
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_1_미리보기() {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            processPrint({});
            //processApprove({});

        }

        //----------
        function click_lyrMenu_1_상신() {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            processApprove({});

        }
        //----------
        function click_lyrMenu_1_추가(ui) {

            v_global.process.handler = processInsert;

            if (!checkUpdatable({})) return;

            processInsert({});

        }
        //----------
        function click_lyrMenu_1_삭제(ui) {

            if (!checkManipulate({})) return;

            v_global.process.handler = processRemove;

            checkRemovable({});

        }
        //----------
        function click_lyrMenu_1_저장(ui) {

            processSave({});

        }
        //----------
        function click_lyrMenu_1_닫기(ui) {

            v_global.process.handler = processClose;

            if (!checkUpdatable({})) return;

            processClose({});

        }
        //----------
        function click_lyrMenu_2_추가(ui) {

            if (!checkManipulate({})) return;
            if (!checkUpdatable({ check: true })) return false;

            var args = {
                type: "PAGE",
                page: "w_upload_eccb",
                title: "파일 업로드",
                width: 650,
                height: 200,
                //locate: ["center", 600],
                open: true
            };
            if (gw_com_module.dialoguePrepare(args) == false) {
                var args = {
                    page: "w_upload_eccb",
                    param: {
                        ID: gw_com_api.v_Stream.msg_upload_ECCB,
                        data: {
                            user: gw_com_module.v_Session.USR_ID,
                            key: gw_com_api.getValue("frmData_내역", 1, "eco_no"),
                            seq: 2
                        }
                    }
                };
                gw_com_module.dialogueOpen(args);
            }

        }
        //----------
        function click_lyrMenu_2_삭제(ui) {

            if (!checkManipulate({})) return;

            var args = {
                targetid: "grdData_첨부",
                row: "selected"
            }
            gw_com_module.gridDelete(args);

        }
        //----------
        function itemdblclick_frmData_내역(ui) {

            switch (ui.element) {
                case "act_dept1_nm":
                case "act_dept2_nm":
                    {
                        var em = ui.element.substr(0, ui.element.length - 3);
                        gw_com_api.setValue(ui.object, ui.row, em, "", true);

                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_dept",
                            title: "부서 검색",
                            width: 400,
                            height: 450,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_dept",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectDepartment
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
                case "act_emp_nm":
                case "sub_emp1_nm":
                case "sub_emp2_nm":
                case "sub_emp3_nm":
                    {
                        var em = ui.element.substr(0, ui.element.length - 3);
                        gw_com_api.setValue(ui.object, ui.row, em, "", true);

                        v_global.event.type = ui.type;
                        v_global.event.object = ui.object;
                        v_global.event.row = ui.row;
                        v_global.event.element = ui.element;
                        var args = {
                            type: "PAGE",
                            page: "w_find_emp",
                            title: "사원 검색",
                            width: 600,
                            height: 450,
                            locate: ["center", "top"],
                            open: true
                        };
                        if (gw_com_module.dialoguePrepare(args) == false) {
                            var args = {
                                page: "w_find_emp",
                                param: {
                                    ID: gw_com_api.v_Stream.msg_selectEmployee
                                }
                            };
                            gw_com_module.dialogueOpen(args);
                        }
                    }
                    break;
            }

        }
        //----------
        function itemdblclick_frmData_메모A(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "개선 전";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------
        function itemdblclick_frmData_메모B(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "개선 후";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });
        }
        //----------
        function itemdblclick_frmData_메모C(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "유형 효과 (정량적 개선)";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });

        }
        //----------
        function itemdblclick_frmData_메모D(ui) {

            if (!checkEditable({})) return;
            if (!checkManipulate({})) return;

            ui.element = "memo_html";
            v_global.logic.memo = "무형 효과 (정성적 개선)";
            processMemo({ type: ui.type, object: ui.object, row: ui.row, element: ui.element, html: true });
        }
        //----------        
        function click_grdData_첨부_download(ui) {

            var args = {
                source: {
                    id: "grdData_첨부",
                    row: ui.row
                },
                targetid: "lyrDown"
            };
            gw_com_module.downloadFile(args);

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        if (v_global.process.param != "") {
            v_global.logic.key = gw_com_api.getPageParameter("eco_no");
            processRetrieve({ key: v_global.logic.key });
        }
        else
            processInsert({});

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

    return gw_com_api.getCRUD("frmData_내역");

}
//----------
function checkManipulate(param) {

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([
            { text: "NOMASTER" }
        ]);
        return false;
    }
    return true;

}
//----------
function checkEditable(param) {

    return (gw_com_module.v_Option.authority.usable && gw_com_module.v_Option.authority.control == "R") ? false : true;

}
//----------
function checkUpdatable(param) {

    var args = {
        check: param.check,
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            }/*,
			{
			    type: "FORM",
			    id: "frmData_효과"
			}*/,
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "FORM",
                id: "frmData_메모C"
            },
            {
                type: "FORM",
                id: "frmData_메모D"
            },
			{
			    type: "GRID",
			    id: "grdData_첨부"
			}
		],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processDelete({});
    else
        gw_com_api.messageBox([
            { text: "REMOVE" }
        ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");

}
//----------
function processRetrieve(param) {

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_eco_no", value: param.key },
                { name: "arg_seq", value: 2 }
            ]
        },
        target: [
			{
			    type: "FORM",
			    id: "frmData_내역"
			}/*,
            {
                type: "FORM",
                id: "frmData_효과"
            }*/,
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "FORM",
                id: "frmData_메모C"
            },
            {
                type: "FORM",
                id: "frmData_메모D"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            }
		],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processInsert(param) {

    if (param.sub) {
        var args = {
            source: {
                type: "INLINE",
                argument: [
                    { name: "arg_root_no", value: param.key },
                    { name: "arg_root_seq", value: param.seq }
                ]
            },
            target: [
                {
                    type: "FORM",
                    id: "frmData_메모A",
                    query: "w_eccb4020_I_1_1",
                    crud: "insert"
                },
                {
                    type: "FORM",
                    id: "frmData_메모B",
                    query: "w_eccb4020_I_1_2",
                    crud: "insert"
                }
		    ]
        };
        gw_com_module.objRetrieve(args);
    }
    else if (param.master) {
        var args = {
            targetid: "frmData_내역",
            edit: true,
            updatable: true,
            data: [
                { name: "eco_no", value: param.data.eco_no },
                { name: "ecr_no", value: param.data.ecr_no, hide: true },
                { name: "cip_no", value: param.data.cip_no, hide: true },
                { name: "eco_title", value: param.data.eco_title, hide: true },
                { name: "ecr_title", value: param.data.ecr_title, hide: true },
                { name: "ecr_dept_nm", value: param.data.ecr_dept_nm, hide: true },
                { name: "rpt_emp", value: gw_com_module.v_Session.EMP_NO },
                { name: "rpt_dept", value: gw_com_module.v_Session.DEPT_CD },
                { name: "rpt_dt", value: gw_com_api.getDate("") }
            ],
            clear: [
            /*{
            type: "FORM",
            id: "frmData_효과"
            },*/
                {
                type: "FORM",
                id: "frmData_메모A"
            },
                {
                    type: "FORM",
                    id: "frmData_메모B"
                },
                {
                    type: "FORM",
                    id: "frmData_메모C"
                },
                {
                    type: "FORM",
                    id: "frmData_메모D"
                },
                {
                    type: "GRID",
                    id: "grdData_첨부"
                }
            ]
        };
        gw_com_module.formInsert(args);
        /*
        var args = {
        targetid: "frmData_효과",
        edit: true,
        revise: true,
        data: [
        { name: "eco_no", value: param.data.eco_no }
        ]
        };
        gw_com_module.formInsert(args);
        */
        var args = {
            targetid: "frmData_메모C",
            edit: true,
            updatable: true,
            data: [
                { name: "root_no", value: param.data.eco_no },
                { name: "root_seq", value: "2" },
                { name: "memo_cd", value: "C"}/*,
                { name: "memo_html", value: "<table style='width: 455px; height: 365px; table-layout:fixed; font-family:굴림체; font-size:9pt;' border='1' cellspacing='0' cellpadding='3'><tr valign='top'><td style='word-break: break-all;'></td></tr></table>" }*/
            ]
        };
        gw_com_module.formInsert(args);
        var args = {
            targetid: "frmData_메모D",
            edit: true,
            updatable: true,
            data: [
                { name: "root_no", value: param.data.eco_no },
                { name: "root_seq", value: "2" },
                { name: "memo_cd", value: "D"}/*,
                { name: "memo_html", value: "<table style='width: 455px; height: 365px; table-layout:fixed; font-family:굴림체; font-size:9pt;' border='1' cellspacing='0' cellpadding='3'><tr valign='top'><td style='word-break: break-all;'></td></tr></table>" }*/
            ]
        };
        gw_com_module.formInsert(args);
        processInsert({ sub: true, key: param.data.ecr_no, seq: 1 });
    }
    else {
        var args = { type: "PAGE", page: "w_find_eco", title: "ECO 선택",
            width: 850, height: 450, locate: ["center", "top"], open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_find_eco",
                param: {
                    ID: gw_com_api.v_Stream.msg_selectECO,
                    data: {
                        type: "complete"
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processDelete(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            }/*,
            {
                type: "FORM",
                id: "frmData_효과"
            }*/,
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "FORM",
                id: "frmData_메모C"
            },
            {
                type: "FORM",
                id: "frmData_메모D"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processMemo(param) {

    v_global.event.type = param.type;
    v_global.event.object = param.object;
    v_global.event.row = param.row;
    v_global.event.element = param.element;
    if (param.html) {
        var args = {
            type: "PAGE",
            page: "w_edit_html_eccb",
            title: "상세 내용",
            width: 800,
            height: 570,
            locate: ["center", "bottom"],
            open: true
        };
        if (gw_com_module.dialoguePrepare(args) == false) {
            var args = {
                page: "w_edit_html_eccb",
                param: {
                    ID: gw_com_api.v_Stream.msg_edit_HTML,
                    data: {
                        edit: true,
                        title: v_global.logic.memo,
                        html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                    }
                }
            };
            gw_com_module.dialogueOpen(args);
        }
    }

}
//----------
function processSave(param) {

    var args = {
        target: [
			{
			    type: "FORM",
			    id: "frmData_내역"
			}/*,
            {
                type: "FORM",
                id: "frmData_효과"
            }*/,
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "FORM",
                id: "frmData_메모C"
            },
            {
                type: "FORM",
                id: "frmData_메모D"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
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

    var args = {
        target: [
		    {
		        type: "FORM",
		        id: "frmData_내역",
		        key: {
		            element: [
		                { name: "eco_no" }
		            ]
		        }
		    }
	    ],
        handler: {
            success: successRemove
        }
    };
    gw_com_module.objRemove(args);

}
function processPrint(param) {

    window.open("/job/w_link_imp_print.aspx?data_key=" + v_global.logic.key, "", "");

}

//----------
function processApprove(param) {

    var status = gw_com_api.getValue("frmData_내역", 1, "gw_astat_nm", false, true);
    if (status != '없음' && status != '미처리' && status != '반송' && status != '회수') {
        gw_com_api.messageBox([
            { text: "결재 " + status + " 자료이므로 처리할 수 없습니다." }
        ], 420);
        return false;
    }

    var args = {
        page: "IFProcess",
        param: {
            ID: gw_com_api.v_Stream.msg_authSystem,
            data: {
                system: "GROUPWARE",
                name: gw_com_module.v_Session.GW_ID,
                encrypt: { password: true },
                param: param
            }
        }
    };
    gw_com_module.dialogueOpen(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "FORM",
                id: "frmData_내역"
            }/*,
            {
                type: "FORM",
                id: "frmData_효과"
            }*/,
            {
                type: "FORM",
                id: "frmData_메모A"
            },
            {
                type: "FORM",
                id: "frmData_메모B"
            },
            {
                type: "FORM",
                id: "frmData_메모C"
            },
            {
                type: "FORM",
                id: "frmData_메모D"
            },
            {
                type: "GRID",
                id: "grdData_첨부"
            }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closePage
    };
    gw_com_module.streamInterface(args);

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
//----------
function successSave(response, param) {

    $.each(response, function () {
        var query = this.QUERY;
        $.each(this.KEY, function () {
            if (this.NAME == "eco_no"
                || (this.NAME == "root_no"
                    && (query == "w_eccb4020_S_1_1" || query == "w_eccb4020_S_1_2" || query == "w_eccb4020_S_1_3" || query == "w_eccb4020_S_1_4"))) {
                v_global.logic.key = this.VALUE;
                processRetrieve({ key: v_global.logic.key });
            }
        });
    });

}
//----------
function successRemove(response, param) {

    processDelete({});

}
//----------
function successApproval(response, param) {

    processRetrieve({ key: v_global.logic.key });

    gw_com_api.showMessage("그룹웨어 페이지로 이동합니다.");
    var data = {};
    $.each(response.NAME, function (approval_i) {
        data[response.NAME[approval_i]] = response.VALUE[approval_i];
    });
    if (data.r_value < 0) {
        gw_com_api.showMessage(data.message);
        return;
    }
    var params = [
        { name: "sysid", value: "ECCB" },
        { name: "sys_key", value: data.r_key },
        { name: "seq", value: data.r_seq }
    ];
    gw_com_site.gw_appr(params);

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
                                processSave(param.data.arg);
                            else {
                                processDelete({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler(param.data.arg);
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
        case gw_com_api.v_Stream.msg_selectedECO:
            {
                processInsert({ master: true, data: param.data });
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedDepartment:
            {
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element,
			                        param.data.dept_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.substr(0, v_global.event.element.length - 3),
			                        param.data.dept_cd,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                alert(param.data.emp_nm);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element,
			                        param.data.emp_nm,
			                        (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(
                                    v_global.event.object,
			                        v_global.event.row,
			                        v_global.event.element.substr(0, v_global.event.element.length - 3),
			                        param.data.emp_no,
			                        (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
            }
            break;
        case gw_com_api.v_Stream.msg_edited_HTML:
            {
                if (param.data.update) {
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        v_global.event.element,
			                            param.data.html);
                    gw_com_api.setValue(v_global.event.object,
                                        v_global.event.row,
                                        "memo_text",
			                            param.data.html);
                    gw_com_api.setUpdatable(v_global.event.object);
                }
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ECCB:
            {
                var args = {
                    source: {
                        type: "INLINE",
                        argument: [
                            { name: "arg_eco_no", value: gw_com_api.getValue("frmData_내역", 1, "eco_no") },
                            { name: "arg_seq", value: 2 }
                        ]
                    },
                    target: [
			            {
			                type: "GRID",
			                id: "grdData_첨부",
			                select: true
			            }
		            ],
                    key: param.key
                };
                gw_com_module.objRetrieve(args);
            }
            break;
        case gw_com_api.v_Stream.msg_authedSystem:
            {
                closeDialogue({ page: param.from.page });

                v_global.logic.name = param.data.name;
                v_global.logic.password = param.data.password;
                var gw_key = gw_com_api.getValue("frmData_내역", 1, "gw_key");
                var gw_seq = gw_com_api.getValue("frmData_내역", 1, "gw_seq");
                gw_seq = (gw_seq == "") ? 0 : parseInt(gw_seq);
                var args = {
                    url: "COM",
                    procedure: "PROC_APPROVAL_ECO_END",
                    input: [
                        { name: "user", value: gw_com_module.v_Session.USR_ID, type: "varchar" },
                        { name: "emp_no", value: gw_com_module.v_Session.EMP_NO, type: "varchar"}/*,
                        { name: "user", value: "goodware", type: "varchar" },
                        { name: "emp_no", value: "10505", type: "varchar" }*/,
                        { name: "eco_no", value: gw_com_api.getValue("frmData_내역", 1, "eco_no"), type: "varchar" },
                        { name: "gw_key", value: gw_key, type: "varchar" },
                        { name: "gw_seq", value: gw_seq, type: "int" }
                    ],
                    output: [
                        { name: "r_key", type: "varchar" },
                        { name: "r_seq", type: "int" },
                        { name: "r_value", type: "int" },
                        { name: "message", type: "varchar" }
                    ],
                    handler: {
                        success: successApproval
                    }
                };
                gw_com_module.callProcedure(args);
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
                switch (param.from.page) {
                    case "w_find_eco":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selectECO;
                            args.data = {
                                type: "complete"
                            }
                        }
                        break;
                    case "w_edit_html_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_edit_HTML;
                            args.data = {
                                edit: true,
                                title: v_global.logic.memo,
                                html: gw_com_api.getValue(v_global.event.object, v_global.event.row, v_global.event.element)
                            };
                        }
                        break;
                    case "w_find_dept":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteDepartment;
                        }
                        break;
                    case "w_find_emp":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
                        }
                        break;
                    case "w_upload_eccb":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ECCB;
                            args.data = {
                                user: gw_com_module.v_Session.USR_ID,
                                key: gw_com_api.getValue("frmData_내역", 1, "eco_no"),
                                seq: 2
                            };
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