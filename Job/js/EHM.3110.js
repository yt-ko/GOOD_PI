//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.03)
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

        //----------
        v_global.process.param = gw_com_module.initPage({ message: true });
        //----------
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                },
                {
                    type: "INLINE", name: "날짜구분",
                    data: [
                        { title: "등록일", value: "INS_DATE" },
                        { title: "최근작업일", value: "END_DATE" }
                    ]
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
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate());
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
            targetid: "lyrMenu", type: "FREE", show: true,
            element: [
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "횡전개신규추가" },
                { name: "수정", value: "수정", icon: "기타" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "실적등록" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE", show: true,
            element: [
                { name: "조회", value: "새로고침" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "date_tp", style: { colfloat: "float" },
                                editable: { type: "select", data: { memory: "날짜구분" } }
                            },
                            {
                                name: "ymd_fr", mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: { type: "select", data: { memory: "DEPT_AREA"/*, unshift: [{ title: "전체", value: "%" }]*/ } }
                            },
                            {
                                name: "stat0", label: { title: "미완료 :" }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            },
                            {
                                name: "stat1", label: { title: "완료 :" }, value: "1",
                                editable: { type: "checkbox", value: "1", offval: "0", title: "" }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "eca_no", label: { title: "ECA No. :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "eco_no", label: { title: "ECO No. :" },
                                editable: { type: "text", size: 14 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No. :" },
                                editable: { type: "text", size: 14 }
                            },
                            {
                                name: "eco_title", label: { title: "제목 :" },
                                editable: { type: "text", size: 17 }
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
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption2", type: "FREE",
            trans: true, border: true, show: false, //margin: 260,
            content: {
                row: [
                    {
                        element: [
                            { name: "등록1", value: "일괄등록", format: { type: "button", icon: "기타" } },
                            { name: "등록2", value: "개별등록", format: { type: "button", icon: "기타" } }
                        ], align: "center"
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MODIFY", query: "EHM_3110_1", title: "횡전개 현황",
            height: 150, show: true, caption: true, selectable: true, number: true,
            element: [
                { header: "ECA작성일", name: "eca_dt", width: 80, align: "center", mask: "date-ymd" },
                { header: "ECA No.", name: "eca_no", width: 90, align: "center" },
                {
                    header: "ECO No.", name: "eco_no", width: 90, align: "center",
                    format: { type: "link" }
                },
                { header: "제목", name: "eco_title", width: 350 },
                {
                    header: "설비대수", name: "cnt1", width: 70, align: "right",
                    fix: { mask: "numeric-int", margin: 1 }
                },
                { header: "적용모듈(건)", name: "cnt2", width: 70, align: "center" },
                { header: "진행율(%)", name: "modify_rate", width: 60, align: "center", mask: "numeric-int" },
                { header: "작업예정일", name: "plan_date", width: 150, align: "center", hidden: true },
                { header: "등록일", name: "ins_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "시작일", name: "start_date", width: 80, align: "center", mask: "date-ymd", hidden: true },
                { header: "최근작업일", name: "end_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "완료목표일", name: "plan_end_date", width: 80, align: "center", mask: "date-ymd" },
                { name: "modify_no", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MODIFY_D", query: "EHM_3110_2", title: "대상 설비",
            height: 225, show: true, caption: true, selectable: true, number: true,
            element: [
                { header: "고객사", name: "cust_nm", width: 80 },
                { header: "LINE", name: "cust_dept_nm", width: 80 },
                { header: "제품유형", name: "prod_type_nm", width: 80 },
                { header: "설비명", name: "prod_nm", width: 200 },
                { header: "고객설비명", name: "cust_prod_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "BOM Ver.", name: "bom_ver", width: 80, hidden: true },
                { header: "적용모듈(건)", name: "moidfy_cnt", width: 80, align: "center" },
                { header: "작업예정일", name: "plan_date", width: 150, align: "center", hidden: true },
                { header: "실제작업일", name: "real_date", width: 150, align: "center", hidden: true },
                { header: "최근작업일", name: "end_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "완료목표일", name: "plan_end_date", width: 80, align: "center", mask: "date-ymd" },
                { header: "문제발생(건)", name: "issue_cnt", width: 80, align: "center" },
                { header: "비고", name: "rmk", width: 250 },
                { header: "M01", name: "m01_nm", width: 60 },
                { header: "M02", name: "m02_nm", width: 60 },
                { header: "M03", name: "m03_nm", width: 60 },
                { header: "M04", name: "m04_nm", width: 60 },
                { header: "M05", name: "m05_nm", width: 60 },
                { header: "M06", name: "m06_nm", width: 60 },
                { header: "M07", name: "m07_nm", width: 60 },
                { header: "M08", name: "m08_nm", width: 60 },
                { header: "M09", name: "m09_nm", width: 60 },
                { header: "M10", name: "m10_nm", width: 60 },
                { header: "M11", name: "m11_nm", width: 60 },
                { header: "M12", name: "m12_nm", width: 60 },
                { header: "M13", name: "m13_nm", width: 60 },
                { header: "M14", name: "m14_nm", width: 60 },
                { header: "M15", name: "m15_nm", width: 60 },
                { name: "modify_no", hidden: true },
                { name: "modify_seq", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_FILE", query: "EHM_3110_4", title: "첨부 파일",
            height: "100%", caption: true, pager: false, show: true, number: true, selectable: true,
            element: [
                { header: "구분", name: "file_tp_nm", width: 100, align: "center" },
                { header: "파일명", name: "file_nm", width: 400 },
                {
                    header: "다운로드", name: "download", width: 100, align: "center",
                    format: { type: "link", value: "다운로드" }
                },
                { header: "파일설명", name: "file_desc", width: 450 },
                { name: "file_ext", hidden: true },
                { name: "file_path", hidden: true },
                { name: "data_tp", hidden: true },
                { name: "data_key", hidden: true },
                { name: "data_seq", hidden: true },
                { name: "file_id", hidden: true }
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
                { type: "GRID", id: "grdList_MODIFY", offset: 8 },
                { type: "GRID", id: "grdList_MODIFY_D", offset: 8 },
                { type: "GRID", id: "grdList_FILE", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================

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
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "수정", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "등록1", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption2", element: "등록2", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MODIFY", grid: true, event: "rowselected", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_MODIFY", grid: true, event: "click", element: "eco_no", handler: processLink };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdList_FILE", grid: true, element: "download", event: "click", handler: processDownload };
        gw_com_module.eventBind(args);
        //----------
        function processItemchanged(param) {

            //switch (param.element) {
            //    case "date_tp":
            //        {
            //            if (param.value.current == "END_DATE") {
            //                gw_com_api.setValue(param.object, param.row, "stat0", "0", (param.type == "GRID"));
            //                gw_com_api.setValue(param.object, param.row, "stat1", "1", (param.type == "GRID"));
            //            }
            //        }
            //        break;
            //}

        }

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processButton(param) {

    switch (param.element) {
        case "조회":
            {
                gw_com_api.hide("frmOption2");
                if (param.object == "lyrMenu") {
                    var args = { target: [{ id: "frmOption", focus: true }] };
                    gw_com_module.objToggle(args);
                } else {
                    processRetrieve({});
                }
            }
            break;
        case "추가":
            {
                closeOption({});
                v_global.event.data = {
                    dept_area: gw_com_api.getValue("frmOption", 1, "dept_area")
                }
                var args = {
                    type: "PAGE", page: "EHM_3111", title: "ECO 선택",
                    width: 1150, height: 600, locate: ["center", "center"], open: true,
                };
                if (gw_com_module.dialoguePrepare(args) == false) {
                    var args = {
                        page: "EHM_3111",
                        param: {
                            ID: gw_com_api.v_Stream.msg_openedDialogue,
                            data: v_global.event.data
                        }
                    };
                    gw_com_module.dialogueOpen(args);
                }
            }
            break;
        case "수정":
            {
                closeOption({});
                var row = gw_com_api.getSelectedRow("grdList_MODIFY");
                if (row > 0) {
                    var args = {
                        eco_no: gw_com_api.getValue("grdList_MODIFY", row, "eco_no", true),
                        modify_no: gw_com_api.getValue("grdList_MODIFY", row, "modify_no", true)
                    };
                    processCreateModify(args);
                } else
                    gw_com_api.messageBox([{ text: "NODATA" }]);
            }
            break;
        case "삭제":
            {
                closeOption({});
                var row = gw_com_api.getSelectedRow("grdList_MODIFY");
                if (row > 0) {
                    var modify_no = gw_com_api.getValue("grdList_MODIFY", row, "modify_no", true);
                    checkRemovable({ modify_no: modify_no });
                } else
                    gw_com_api.messageBox([{ text: "NODATA" }]);
            }
            break;
        case "저장":
            {
                closeOption({});
                gw_com_api.show("frmOption2");
            }
            break;
        case "닫기":
            {
                closeOption({});
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
        case "등록1":
        case "등록2":
            {
                closeOption({});
                var row = gw_com_api.getSelectedRow("grdList_MODIFY");
                if (row > 0) {
                    var modify_no = gw_com_api.getValue("grdList_MODIFY", row, "modify_no", true);
                    var auth = getAuth({ modify_no: modify_no, user_id: gw_com_module.v_Session.USR_ID });
                    var title = "횡전개 실적 " + (auth == "R" ? "조회" : "등록");
                    var page = (param.element == "등록1" ? "EHM_3121" : "EHM_3120");
                    var args = {
                        ID: gw_com_api.v_Stream.msg_linkPage,
                        to: { type: "MAIN" },
                        data: {
                            page: page,
                            title: title,
                            param: [
                                { name: "AUTH", value: auth },
                                { name: "modify_no", value: modify_no },
                                { name: "eco_no", value: gw_com_api.getValue("grdList_MODIFY", row, "eco_no", true) }
                            ]
                        }
                    };
                    gw_com_module.streamInterface(args);
                } else
                    gw_com_api.messageBox([{ text: "NODATA" }]);
            }
            break;
    }

}
//----------
function processRetrieve(param) {

    var pstat = gw_com_api.getValue("frmOption", 1, "stat0") + gw_com_api.getValue("frmOption", 1, "stat1");
    if (pstat == "11")
        pstat = "%";
    else if (pstat == "10")
        pstat = "10";       // 미완료 = 진행
    else if (pstat == "01")
        pstat = "90";       // 완료
    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" },
                { name: "date_tp", argument: "arg_date_tp" },
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "eca_no", argument: "arg_eca_no" },
                { name: "eco_no", argument: "arg_eco_no" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "eco_title", argument: "arg_eco_title" }
            ],
            argument: [
                { name: "arg_pstat", value: pstat },
                { name: "arg_dept_cd", value: (gw_com_module.v_Session.USER_TP == "SYS" ? "%" : gw_com_module.v_Session.DEPT_CD) }
            ],
            remark: [
                { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }], label: gw_com_api.getText("frmOption", 1, "date_tp") + " :" },
                { element: [{ name: "dept_area" }] },
                { element: [{ name: "eca_no" }] },
                { element: [{ name: "eco_no" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "eco_title" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_MODIFY", select: true }
        ],
        clear: [
             { type: "GRID", id: "grdList_MODIFY_D" },
             { type: "GRID", id: "grdList_FILE" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processLink(param) {

    if (param.element == "eco_no") {
        var args = {
            to: "INFO_ECCB",
            eco_no: gw_com_api.getValue(param.object, param.row, param.element, true),
            tab: "ECO"
        };
        gw_com_site.linkPage(args);
    } else {
        var args = {
            source: {
                type: param.type, id: param.object, row: param.row,
                element: [
                    { name: "modify_no", argument: "arg_modify_no" }
                ],
                argument: [
                    { name: "arg_dept_cd", value: (gw_com_module.v_Session.USER_TP == "SYS" ? "%" : gw_com_module.v_Session.DEPT_CD) }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_MODIFY_D", select: true },
                { type: "GRID", id: "grdList_FILE", select: true }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);
    }

}
//----------
function checkRemovable(param) {

    var args = {
        request: "DATA",
        name: "EHM_3110_1_CHK_DEL",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3110_1_CHK_DEL" +
            "&QRY_COLS=deletable" +
            "&CRUD=R" +
            "&arg_modify_no=" + param.modify_no +
            "&arg_modify_seq=0",
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {

        if (data.DATA[0] == "1")
            gw_com_api.messageBox([
                { text: "REMOVE" }
            ], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO");
        else
            gw_com_api.messageBox([{ text: "실적이 등록되어 있어 삭제할 수 없습니다." }]);

    }

}
//----------
function processRemove(param) {

    var args = {
        url: "COM",
        target: [
            {
                type: "GRID", id: "grdList_MODIFY",
                key: [{ row: "selected", element: [{ name: "modify_no" }] }]
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

    processRetrieve({});
    //var args = {
    //    targetid: "grdList_MODIFY", row: "selected", select: true,
    //    clear: [
    //        { type: "GRID", id: "grdList_MODIFY_D" },
    //        { type: "GRID", id: "grdList_FILE" }
    //    ]
    //}
    //gw_com_module.gridDelete(args);

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
    gw_com_api.hide("frmOption2");

}
//----------
function closeDialogue(param) {

    var args = {
        page: param.page
    };
    gw_com_module.dialogueClose(args);

}
//----------
function processCreateModify(param) {

    v_global.event.data = {
        eco_no: param.eco_no,
        modify_no: (param.modify_no == undefined ? "" : param.modify_no)
    }
    var args = {
        type: "PAGE", page: "EHM_3112", title: "횡전개 설비",
        width: 1150, height: 600, locate: ["center", "center"], open: true,
    };
    if (gw_com_module.dialoguePrepare(args) == false) {
        var args = {
            page: "EHM_3112",
            param: {
                ID: gw_com_api.v_Stream.msg_openedDialogue,
                data: v_global.event.data
            }
        };
        gw_com_module.dialogueOpen(args);
    }

}
//----------
function processDownload(param) {

    var args = {
        source: { id: param.object, row: param.row },
        targetid: "lyrDown"
    };
    gw_com_module.downloadFile(args);

}
//----------
function getAuth(param) {

    var rtn = "U";
    var args = {
        request: "DATA",
        name: "EHM_3120_AUTH",
        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
            "?QRY_ID=EHM_3120_AUTH" +
            "&QRY_COLS=auth" +
            "&CRUD=R" +
            "&arg_modify_no=" + param.modify_no +
            "&arg_user_id=" + param.user_id,
        async: false,
        handler_success: successRequest
    };
    gw_com_module.callRequest(args);

    function successRequest(type, name, data) {
        rtn = data.DATA[0];
    }
    return rtn;

}
//----------
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
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES")
                                processRemove({});
                        }
                        break;
                    case gw_com_api.v_Message.msg_informRemoved:
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
                    to: { type: "POPUP", page: param.from.page },
                    ID: param.ID
                };
                switch (param.from.page) {
                    case "EHM_3111":
                    case "EHM_3112":
                        {
                            args.ID = param.ID;
                            args.data = v_global.event.data;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
                switch (param.from.page) {
                    case "EHM_3111":
                        {
                            if (param.data != undefined) {
                                processCreateModify({ eco_no: param.data.eco_no });
                            }
                        }
                        break;
                    case "EHM_3112":
                        {
                            if (param.data != undefined) {
                                var key = [{
                                    KEY: [
                                        { NAME: "modify_no", VALUE: param.data.modify_no }
                                    ],
                                    QUERY: "EHM_3110_1"
                                }];
                                processRetrieve({ key: key });
                            }
                        }
                        break;
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//