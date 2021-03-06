
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define Global variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, entry: null, act: null, handler: null, current: {}, prev: {} },
    logic: {}
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        var args = {
            request: [
                {
                    type: "PAGE", name: "업무구분", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "EDM010" }]
                },
                {
                    type: "PAGE", name: "문서분류", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "EDM020" }]
                },
                {
                    type: "PAGE", name: "제품유형", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //start();  //gw_com_module.selectSet(args) 을 사용하지 않을 시에 활성화
        function start() {
            gw_job_process.UI();
            gw_job_process.procedure();
            closeOption({});
        }

    },  // End of gw_job_process.ready

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage UI. (design section)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu_Main", type: "FREE",
            element: [
                //{ name: "즐겨찾기추가", value: "즐겨찾기추가", icon: "추가" },
                //{ name: "즐겨찾기삭제", value: "즐겨찾기삭제", icon: "삭제" },
                { name: "조회", value: "조회", act: true },
                { name: "추가", value: "추가" },
                { name: "수정", value: "덮어쓰기", icon: "추가" },
                { name: "Revision", value: "Revision", icon: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true, remark: "lyrRemark", margin: 50,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "file_nm", label: { title: "파일명 :" },
                                editable: { type: "text", size: 20, maxlength: 40 }
                            },
                            {
                                name: "option1", label: { title: "수정권한 파일만:" },
                                format: { type: "checkbox", title: "수정권한", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "수정권한", value: "1", offval: "0" }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "file_desc", label: { title: "Keyword :" },
                                editable: { type: "text", size: 20, maxlength: 40 }
                            },
                            {
                                name: "option2", label: { title: "즐겨찾기 분류내:" }, hidden: true,
                                format: { type: "checkbox", title: "즐겨찾기", value: "1", offval: "0" },
                                editable: { type: "checkbox", title: "즐겨찾기", value: "1", offval: "0" }
                            }
                        ]
                    },
                    {
                        align: "right", element: [
                            { name: "option3", hidden: true, editable: { type: "hidden" } },
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
        //var args = {
        //    targetid: "grdData_MyFolder", query: "EDM_2010_M_0", title: "My Category",
        //    caption: true, width: 300, height: 300, show: true, selectable: true, dynamic: true, number: true,
        //    editable: { multi: true, bind: "select", focus: "folder_nm", validate: true },
        //    pager: false, hiddengrid: true,
        //    element: [
        //        { name: "user_id", hidden: true, editable: { type: "hidden" } },
        //        { name: "folder_id", hidden: true, editable: { type: "hidden" } },
        //        { header: "Category", name: "folder_nm", width: 220, align: "left" }
        //    ]
        //};
        ////----------
        //gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Folder", query: "EDM_2010_1", title: "Knowledge Category",
            caption: false, width: 300, height: 150, show: true, selectable: true, number: true, pager: false,
            element: [
                { name: "parent_nm", header: "분류", width: 80 },
                { name: "folder_nm", header: "Category 1", width: 170 },
                { name: "folder_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Main", query: "EDM_2010_2", title: "Knowledge Category",
            caption: true, width: 300, height: 336, show: true, selectable: true, pager: false,
            treegrid: { element: "folder_nm" }, color: { row: true },
            element: [
                { header: "Category 2", name: "folder_nm", width: 200, align: "left", format: { type: "label" } },
                { header: "File", name: "file_cnt", width: 40, align: "center", format: { type: "label" } },
                { name: "sort_seq", hidden: true },
                { name: "folder_id", hidden: true },
                { name: "parent_id", hidden: true },
                { name: "level_no", hidden: true },
                { name: "color", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Sub", query: "EDM_2010_S_1", title: "문서 파일",
            caption: true, height: 350, show: true, selectable: true, color: { row: true }, number: true,
            editable: { multi: true, bind: "select", focus: "file_desc", validate: true },
            element: [
                { header: "Category", name: "folder_nm", width: 120, align: "left" },
                { header: "파일명", name: "file_nm", width: 220, align: "left" },
                { header: "Rev", name: "file_rev", width: 30, align: "center" },
                {
                    header: "다운로드", name: "download", width: 50, align: "center",
                    format: { type: "link", value: "DOWN" }
                },
                { header: "장비군", name: "file_group1", width: 80, align: "center", hidden: true },
                {
                    header: "업무구분", name: "file_group2", width: 80, align: "center",
                    format: { type: "select", data: { memory: "업무구분" } },
                    editable: { type: "select", data: { memory: "업무구분", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "문서분류", name: "file_group3", width: 80, align: "center",
                    format: { type: "select", data: { memory: "문서분류" } },
                    editable: { type: "select", data: { memory: "문서분류", unshift: [{ title: "-", value: "" }] } }
                },
                { header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
                {
                    header: "제품유형", name: "file_group5", width: 80, align: "center",
                    format: { type: "select", data: { memory: "제품유형" } },
                    editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "-", value: "" }] } }
                },
                {
                    header: "키워드", name: "search_tag", width: 200, align: "left", hidden: true,
                    editable: { type: "text" }
                },
                {
                    header: "설명", name: "file_desc", width: 300, align: "left",
                    editable: { type: "text" }
                },
                { header: "등록자", name: "ins_usr", width: 70, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
                { header: "수정자", name: "upd_usr", width: 70, align: "center" },
                { header: "수정일시", name: "upd_dt", width: 160, align: "center" },
                { name: "file_seq", hidden: true, editable: { type: "hidden" } },
                { name: "file_path", hidden: true },
                { name: "file_ext", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "use_yn", hidden: true },
                { name: "file_id", hidden: true },
                { name: "folder_id", hidden: true, editable: { type: "hidden" } }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_Detail", query: "EDM_2010_S_2", title: "변경 이력",
            caption: true, height: 86, show: true, selectable: true, number: true,
            pager: false, //hiddengrid: true,
            element: [
                { header: "파일명", name: "file_nm", width: 220, align: "left" },
                { header: "Rev", name: "file_rev", width: 30, align: "center" },
                { header: "장비군", name: "file_group1", width: 80, align: "center", hidden: true },
                {
                    header: "업무구분", name: "file_group2", width: 80, align: "center",
                    format: { type: "select", data: { memory: "업무구분" } }
                },
                {
                    header: "문서분류", name: "file_group3", width: 80, align: "center",
                    format: { type: "select", data: { memory: "문서분류" } }
                },
                { header: "고객사", name: "file_group4", width: 80, align: "center", hidden: true },
                {
                    header: "제품유형", name: "file_group5", width: 80, align: "center",
                    format: { type: "select", data: { memory: "제품유형" } }
                },
                { header: "키워드", name: "search_tag", width: 200, align: "left" },
                { header: "설명", name: "file_desc", width: 300, align: "left" },
                { header: "등록자", name: "ins_usr", width: 70, align: "center" },
                { header: "등록일시", name: "ins_dt", width: 160, align: "center" },
                { header: "수정자", name: "upd_usr", width: 70, align: "center" },
                { header: "수정일시", name: "upd_dt", width: 160, align: "center" },
                { name: "file_seq", hidden: true },
                { name: "file_path", hidden: true },
                { name: "file_ext", hidden: true },
                { name: "network_cd", hidden: true },
                { name: "use_yn", hidden: true },
                { name: "file_id", hidden: true },
                { name: "folder_id", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        //----------
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
                //{ type: "GRID", id: "grdData_MyFolder", offset: 8 },
                { type: "GRID", id: "grdData_Folder", offset: 8 },
                { type: "GRID", id: "grdData_Main", offset: 8 },
                { type: "GRID", id: "grdData_Sub", offset: 8 },
                { type: "GRID", id: "grdData_Detail", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        gw_com_module.informSize();

    },  // End of gw_job_process.UI

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // manage process. (Define Events & Method)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu_Main", element: "즐겨찾기추가", event: "click", handler: click_lyrMenu_Main_즐겨찾기추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "즐겨찾기삭제", event: "click", handler: click_lyrMenu_Main_즐겨찾기삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "조회", event: "click", handler: click_lyrMenu_Main_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "추가", event: "click", handler: click_File_Upload };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "수정", event: "click", handler: click_File_Upload };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "Revision", event: "click", handler: click_File_Upload };
        gw_com_module.eventBind(args);
        function click_File_Upload(ui) { processUpload(ui); }
        //----------
        var args = { targetid: "lyrMenu_Main", element: "삭제", event: "click", handler: click_lyrMenu_Main_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_Main", element: "저장", event: "click", handler: click_lyrMenu_Main_저장 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_저장() { processSave({}); }
        //----------
        var args = { targetid: "lyrMenu_Main", element: "닫기", event: "click", handler: click_lyrMenu_Main_닫기 };
        gw_com_module.eventBind(args);
        function click_lyrMenu_Main_닫기(ui) { checkClosable({}); }
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        function click_frmOption_실행(ui) { processRetrieve({}); }
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        function click_frmOption_취소(ui) { closeOption({}); }
        //=====================================================================================
        function click_lyrMenu_Main_즐겨찾기추가(ui) {
            v_global.process.handler = processInsert;
            processInsert({ MyFolder: true });
            processSaveMyFolder({ MyFolder: true });

        }
        //----------
        function click_lyrMenu_Main_즐겨찾기삭제(ui) {
            if (!checkSelectedRow({ MyFolder: true })) return;
            v_global.process.handler = processRemove;
            checkRemovable({ MyFolder: true });
        }
        //----------
        function click_lyrMenu_Main_조회() {
            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);
        }
        //----------
        function click_lyrMenu_Main_삭제() {
            v_global.process.handler = processRemove;
            if (!checkManipulate({ main: true })) return;
            checkRemovable({});
        }
        //=====================================================================================
        //var args = { targetid: "grdData_MyFolder", grid: true, event: "rowselecting", handler: rowselecting_grdData_MyFolder };
        //gw_com_module.eventBind(args);
        ////----------
        //var args = { targetid: "grdData_MyFolder", grid: true, event: "rowselected", handler: rowselected_grdData_MyFolder };
        //gw_com_module.eventBind(args);
        ////----------
        //function rowselecting_grdData_MyFolder(ui) {
        //    v_global.process.handler = processSelect;
        //    v_global.process.current.master = ui.row;
        //    return checkUpdatable({});
        //}
        ////----------
        //function rowselected_grdData_MyFolder(ui) {
        //    v_global.process.prev.master = ui.row;
        //    gw_com_api.setValue("frmOption", 1, "option3", "MyFolder");
        //    processLink({ MyFolder: true });
        //};
        //=====================================================================================
        var args = { targetid: "grdData_Folder", grid: true, event: "rowselecting", handler: rowselecting_grdData_Folder };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_Folder", grid: true, event: "rowselected", handler: rowselected_grdData_Folder };
        gw_com_module.eventBind(args);
        //----------
        function rowselecting_grdData_Folder(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
            return checkUpdatable({});
        }
        //----------
        function rowselected_grdData_Folder(ui) {
            v_global.process.prev.master = ui.row;
            gw_com_api.setValue("frmOption", 1, "option3", "Folder");
            processLink({ Folder: true });
        };
        //=====================================================================================
        var args = { targetid: "grdData_Main", grid: true, event: "rowselecting", handler: rowselecting_grdData_Main };
        gw_com_module.eventBind(args);
        var args = { targetid: "grdData_Main", grid: true, event: "rowselected", handler: rowselected_grdData_Main };
        gw_com_module.eventBind(args);
        //----------------------------------------
        function rowselecting_grdData_Main(ui) {
            v_global.process.handler = processSelect;
            v_global.process.current.master = ui.row;
            return checkUpdatable({});
        }
        //----------
        function rowselected_grdData_Main(ui) {
            v_global.process.prev.master = ui.row;
            gw_com_api.setValue("frmOption", 1, "option3", "Tree");
            processLink({ main: true });
        };
        //=====================================================================================
        var args = { targetid: "grdData_Sub", grid: true, element: "download", event: "click", handler: click_File_DownLoad };
        gw_com_module.eventBind(args);
        function click_File_DownLoad(ui) {
            gw_com_module.downloadFile({ source: { id: ui.object, row: ui.row }, targetid: "lyrDown" });
        }
        //----------
        //        var args = { targetid: "grdData_Sub", grid: true, event: "rowselecting", handler: rowselecting_grdData_Sub };
        //        gw_com_module.eventBind(args);
        //        function rowselecting_grdData_Sub(ui) {
        //            v_global.process.handler = processSelect;
        //            v_global.process.current.sub = ui.row;
        //            return true;    //RowSelecting을 위하여 필수
        //            //return checkUpdatable({ sub: true });
        //        }
        //----------
        var args = { targetid: "grdData_Sub", grid: true, event: "rowselected", handler: rowselected_grdData_Sub };
        gw_com_module.eventBind(args);
        function rowselected_grdData_Sub(ui) {
            v_global.process.prev.sub = ui.row;
            processLink({ sub: true, row: ui.row });
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (v_global.process.param != "") {
            gw_com_api.setValue("frmOption", 1, "option3", gw_com_api.getPageParameter("option3"));
            gw_com_api.setValue("frmOption", 1, "file_nm", gw_com_api.getPageParameter("file_nm"));
        }
        else {
            gw_com_api.setValue("frmOption", 1, "option3", "Tree");
            //gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -1 }));
            //gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        }

        gw_com_module.startPage();
        //v_global.process.handler = processRetrieve;
        //processRetrieve({});
        //processRetrieveMyFolder({});
        //processRetrieveTree({});
        processRetrieveFolder({});

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
    if (param.chkobj != undefined)
        return gw_com_api.getCRUD(param.chkobj, "selected", true);
    else if (param.MyFolder)
        return gw_com_api.getCRUD("grdData_MyFolder", "selected", true);
    else
        return gw_com_api.getCRUD("grdData_Sub", "selected", true);
}
//----------
function checkSelectedRow(param) {

    if (param.chkobj != undefined) {
        if (gw_com_api.getSelectedRow(param.chkobj) == null) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return false;
        }
    }
    else {
        if ((param.main && gw_com_api.getSelectedRow("grdData_Main") == null) ||
            (param.sub && gw_com_api.getSelectedRow("grdData_Sub") == null) ||
            (param.detail && gw_com_api.getSelectedRow("grdData_Detail") == null) ||
            (param.MyFolder && gw_com_api.getSelectedRow("grdData_MyFolder") == null)) {
            gw_com_api.messageBox([{ text: "NOMASTER" }]);
            return false;
        }
    }
    return true;
}
//----------
function checkManipulate(param) {

    closeOption({});

    if (checkCRUD(param) == "none") {
        gw_com_api.messageBox([{ text: "NOMASTER" }]);
        return false;
    }
    return true;

}
//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [{ type: "GRID", id: "grdData_Sub" }],
        param: param
    };
    return gw_com_module.objUpdatable(args);

}
//----------
function checkRemovable(param) {

    closeOption({});
    if (param.MyFolder)
        gw_com_api.messageBox([{ text: "선택한 Category를 즐겨찾기에서 제거하시겠습니까?" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
    else {
        var status = checkCRUD(param);
        if (status == "initialize" || status == "create")
            processClear(param);
        else
            gw_com_api.messageBox([{ text: "REMOVE" }], 420, gw_com_api.v_Message.msg_confirmRemove, "YESNO", param);
    }

}
//----------
function checkClosable(param) {

    closeOption({});
    v_global.process.handler = processClose;
    if (!checkUpdatable({})) return;
    processClose({});

}
//----------
function processRetrieveMyFolder(param) {

    var args = {
        key: param.key,
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_MyFolder" }
        ]
    };

    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveFolder(param) {

    var args = {
        key: param.key,
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Folder" }
        ],
        clear: [
            { type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_Detail" }
        ]
    };

    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveTree(param) {

    var args = {
        key: param.key,
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Main", option: "TREE", select: false }
        ],
        clear: [
            { type: "GRID", id: "grdData_Main" },
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_Detail" }
        ]
    };
    gw_com_module.objRetrieve(args);
}
//----------
function processRetrieve(param) {

    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) {
        processClear({ master: true });
        return false;
    }

    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "option1", argument: "arg_option1" },
                { name: "option2", argument: "arg_option2" },
                { name: "option3", argument: "arg_option3" },
                { name: "file_nm", argument: "arg_file_nm" },
                { name: "file_desc", argument: "arg_file_desc" }
            ],
            argument: [
                { name: "arg_folder_id", value: "%" },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ],
            remark: [
                { element: [{ name: "file_nm" }] },
                { element: [{ name: "file_desc" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_Sub", select: true }
        ],
        clear: [
            { type: "GRID", id: "grdData_Detail" }
        ]
    };

    gw_com_module.objRetrieve(args);

}
//----------
function processLink(param) {

    var args = {};
    var sOption3 = gw_com_api.getValue("frmOption", 1, "option3");
    if (param.sub) {
        var row = (param.row == undefined ? gw_com_api.getSelectedRow("grdData_Sub") : param.row);
        if (row == null || row == undefined || row == "undefined") return;
        var jjID = gw_com_api.getValue("grdData_Sub", "selected", "folder_id", true);
        var jjSeq = gw_com_api.getValue("grdData_Sub", "selected", "file_seq", true);

        args = {
            key: param.key,
            source: {
                type: "GRID", id: "grdData_Sub", row: row, block: true,
                element: [
                    { name: "folder_id", argument: "arg_folder_id" },
                    { name: "file_seq", argument: "arg_file_seq" }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Detail" }
            ]
        };
    } else if (param.Folder || sOption3 == "Folder") {
        args = {
            key: param.key,
            source: {
                type: "GRID", id: "grdData_Folder", row: "selected", block: true,
                element: [
                    { name: "folder_id", argument: "arg_parent_id" }
                ],
                argument: [
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Main", option: "TREE", select: false }
            ],
            clear: [
                { type: "GRID", id: "grdData_Main" },
                { type: "GRID", id: "grdData_Sub" },
                { type: "GRID", id: "grdData_Detail" }
            ]
        };
    //} else if (param.MyFolder || sOption3 == "MyFolder") {
    //    args = {
    //        key: param.key,
    //        source: {
    //            type: "GRID", id: "grdData_MyFolder", row: "selected", block: true,
    //            element: [
    //                { name: "folder_id", argument: "arg_folder_id" }
    //            ],
    //            argument: [
    //                { name: "arg_file_nm", value: "%" },
    //                { name: "arg_file_desc", value: "%" },
    //                { name: "arg_option1", value: "%" },
    //                { name: "arg_option2", value: "%" },
    //                { name: "arg_option3", value: sOption3 },
    //                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
    //            ]
    //        },
    //        target: [
    //            { type: "GRID", id: "grdData_Sub", select: true }
    //        ],
    //        clear: [
    //            { type: "GRID", id: "grdData_Detail" }
    //        ]
    //    };
    } else {
        args = {
            key: param.key,
            source: {
                type: "GRID", id: "grdData_Main", row: "selected", block: true,
                element: [
                    { name: "folder_id", argument: "arg_folder_id" }
                ],
                argument: [
                    { name: "arg_file_nm", value: "%" },
                    { name: "arg_file_desc", value: "%" },
                    { name: "arg_option1", value: "%" },
                    { name: "arg_option2", value: "%" },
                    { name: "arg_option3", value: sOption3 },
                    { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
                ]
            },
            target: [
                { type: "GRID", id: "grdData_Sub", select: true }
            ],
            clear: [
                { type: "GRID", id: "grdData_Detail" }
            ]
        };
    }
    gw_com_module.objRetrieve(args);

}
//----------
function processSelect(param) {

    if (param.sub)
        gw_com_api.selectRow("grdData_Sub", v_global.process.current.sub, true, false);
    else
        gw_com_api.selectRow("grdData_Main", v_global.process.current.master, true, false);

}
//----------
function processInsert(param) {
    var args = {};
    if (param.MyFolder) {
        args = {
            targetid: "grdData_MyFolder", edit: true, updatable: true,
            data: [
                { name: "user_id", value: gw_com_module.v_Session.USR_ID },
                { name: "folder_id", value: gw_com_api.getValue("grdData_Main", "selected", "folder_id", true) }
            ]
        };

    }
    else if (param.sub) {
        args = {
            targetid: "grdData_Sub", edit: true, updatable: true,
            data: [
                { name: "search_yn", value: "1" },
                { name: "read_yn", value: "1" },
                { name: "edit_yn", value: "0" },
                { name: "folder_id", value: gw_com_api.getValue("grdData_Main", "selected", "folder_id", true) }
            ]
        };
    }
    else if (param.detail) {
        args = {
            targetid: "grdData_Detail", edit: true, updatable: true,
            data: [
                { name: "insert_yn", value: "1" },
                { name: "update_yn", value: "1" },
                { name: "delete_yn", value: "1" },
                { name: "folder_id", value: gw_com_api.getValue("grdData_Main", "selected", "folder_id", true) }
            ]
        };
    }
    else {

    }
    gw_com_module.gridInsert(args);

}
//----------
function processDelete(param) {

    var args = {};
    if (param.MyFolder)
        args = { targetid: "grdData_MyFolder", row: "selected", remove: true };
    else
        args = {
            targetid: "grdData_Sub", row: "selected", remove: true,
            clear: [
                { type: "GRID", id: "grdData_Detail" }
            ]
        };
    gw_com_module.gridDelete(args);

}
//----------
function processClear(param) {

    var args = {
        target: [{ type: "GRID", id: "grdData_Sub" }]
    };
    if (param.master) {
        args.target.unshift({ type: "GRID", id: "grdData_Main" });
    }
    gw_com_module.objClear(args);

}
//----------
function processSave(param) {

    closeOption({});
    var args = {
        target: [
            { type: "GRID", id: "grdData_Sub" },
            { type: "GRID", id: "grdData_Detail" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    //args.url = "COM";
    args.handler = { success: successSave, param: param };
    gw_com_module.objSave(args);

}
//----------
function processRemove(param) {

    var args = {};
    if (param.MyFolder) {
        args = {
            url: "COM",
            target: [
                {
                    type: "GRID", id: "grdData_MyFolder",
                    key: [
                        { row: "selected", element: [{ name: "user_id" }, { name: "folder_id" }] }
                    ]
                }
            ],
            handler: {
                success: successRemove,
                param: param
            }
        };
    } else {
        args = {
            url: "COM",
            target: [
                {
                    type: "GRID", id: "grdData_Sub",
                    key: [
                        { row: "selected", element: [{ name: "folder_id" }, { name: "file_seq" }] }
                    ]
                }
            ],
            handler: {
                success: successRemove,
                param: param
            }
        };
    }
    gw_com_module.objRemove(args);

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
function processSaveMyFolder(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdData_MyFolder" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";   // aspx.cs 의 Update 프로세스 사용시에는 제거해야함 
    args.handler = { success: successSave };
    gw_com_module.objSave(args);

}
//----------
function successSave(response, param) {

    if (response.QUERY == "EDM_2010_M_0") {
        //v_global.process.handler = processRetrieveMyFolder;
        //processRetrieveMyFolder({ MyFolder: true });
        v_global.process.handler = processRetrieveFolder;
        processRetrieveFolder({ Folder: true });
        return;
    }

    var status = checkCRUD({});
    if (status == "initialize" || status == "create")
        processRetrieve({ key: response });
    else
        processLink({ key: response });

}
//----------
function successRemove(response, param) {

    processDelete(param);

}
//----------
function processUpload(ui) {

    // Check
    var sOption3 = gw_com_api.getValue("frmOption", 1, "option3");
    var sFolderGrid = (sOption3 == "Tree") ? "grdData_Main" : "grdData_MyFolder";
    var RevNo = 0;
    if (ui.element != "추가") {
        sFolderGrid = "grdData_Sub";
        RevNo = gw_com_api.getValue(sFolderGrid, "selected", "file_rev", true);
    }

    if (!checkSelectedRow({ chkobj: sFolderGrid })) return;
    if (!checkUpdatable({ check: true })) return false;

    // Parameter 설정
    v_global.logic.FileUp = {
        type: "EDM",
        key: gw_com_api.getValue(sFolderGrid, "selected", "folder_id", true),
        seq: (ui.element == "추가") ? 0 : gw_com_api.getValue("grdData_Sub", "selected", "file_seq", true),
        user: gw_com_module.v_Session.USR_ID,
        crud: (ui.element == "추가") ? "C" : "U",
        rev: (ui.element == "Revision") ? ++RevNo : RevNo,
        revise: (ui.element == "Revision") ? true : false
    };

    // Prepare File Upload Window
    var args = {
        type: "PAGE", page: "DLG_FileUpload", title: "파일 업로드", datatype: "EDM",
        width: 650, height: 260, open: true, locate: ["center", "top"]
    }; //

    if (gw_com_module.dialoguePrepare(args) == false) {
        // 아래 로직은 두 번째 Open 부터 작동함. 첫 번째는 streamProcess 에 의함
        var args = {
            page: "DLG_FileUpload",
            param: { ID: gw_com_api.v_Stream.msg_upload_ASFOLDER, data: v_global.logic.FileUp }
        };
        gw_com_module.dialogueOpen(args);
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
                    param.to = { type: "POPUP", page: param.data.page };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_confirmSave:
                        {
                            if (param.data.result == "YES")
                                processSave({});
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create")
                                    processClear({});
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") processRemove(param.data.arg);
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
                }
            }
            break;
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                // Popup Window Open 후에 인수 전달
                var args = { to: { type: "POPUP", page: param.from.page } };
                switch (param.from.page) {
                    case "DLG_EMPLOYEE":
                        {
                            args.ID = gw_com_api.v_Stream.msg_selecteEmployee;
                        }
                        break;
                    case "DLG_FileUpload":
                        {
                            args.ID = gw_com_api.v_Stream.msg_upload_ASFOLDER;
                            args.data = v_global.logic.FileUp;
                        }
                        break;
                }
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_uploaded_ASFOLDER:
            {
                // Upload 후 파일List 재조회
                processLink({});
                closeDialogue({ page: param.from.page });
            }
            break;
        case gw_com_api.v_Stream.msg_selectedEmployee:
            {
                // 사원 선택 후 처리
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "dept_nm", param.data.dept_nm,
                    (v_global.event.type == "GRID") ? true : false, true);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "pos_nm", param.data.pos_nm,
                    (v_global.event.type == "GRID") ? true : false, true);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_nm", param.data.emp_nm,
                    (v_global.event.type == "GRID") ? true : false);
                gw_com_api.setValue(v_global.event.object, v_global.event.row, "emp_no", param.data.emp_no,
                    (v_global.event.type == "GRID") ? true : false);
                closeDialogue({ page: param.from.page, focus: true });
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