//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, row: null, element: null },
    process: { param: null, init: false, entry: null, act: null, handler: null, current: {}, prev: {} },
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        var args = {
            request: [
                {
                    type: "PAGE", name: "DEPT_AREA", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "SMC+DP" }]
                }
            ],
            starter: start
        };
        gw_com_module.selectSet(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // go next.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //----------
            gw_com_module.startPage();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_openedDialogue
            };
            gw_com_module.streamInterface(args);
            //----------
            processRetrieve({});
            //----------

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
            targetid: "lyrMenu", type: "FREE",
            element: [
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_2", type: "FREE",
            element: [
                { name: "조회", value: "새로고침" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "lyrMenu_3", type: "FREE",
            element: [
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PROD", query: "EHM_3112_1", title: "대상 설비",
            height: 200, caption: true, show: true, pager: false, selectable: true, checkrow: true, multi: true,
            element: [
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "LINE", name: "cust_dept_nm", width: 100 },
                { header: "설비명", name: "prod_nm", width: 200 },
                { header: "고객설비명", name: "cust_prod_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "호기", name: "prod_seq", width: 50, align: "center" },
                { header: "Warranty", name: "wrnt_ymd", width: 80, align: "center", mask: "date-ymd" },
                { name: "prod_key", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_MODULE", query: "EHM_3112_2", title: "적용 모듈",
            height: 200, caption: true, pager: false, show: true, selectable: true, checkrow: true, multi: true,
            element: [
                { header: "모듈", name: "module_nm", width: 100 },
                { name: "module_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdData_MODIFY_DS", query: "EHM_3112_3", title: "적용 모듈",
            height: 200, caption: false, pager: false, show: true, selectable: true, number: true,
            element: [
                { header: "제품유형", name: "prod_type_nm", width: 100 },
                { header: "고객사", name: "cust_nm", width: 100 },
                { header: "LINE", name: "cust_dept_nm", width: 100 },
                { header: "설비명", name: "prod_nm", width: 200 },
                { header: "고객설비명", name: "cust_prod_nm", width: 100 },
                { header: "Project No.", name: "proj_no", width: 100 },
                { header: "Wrranty", name: "wrnt_ymd", width: 80, align: "center", mask: "date-ymd" },
                { header: "M01", name: "m01_nm", width: 80, align: "center" },
                { header: "M02", name: "m02_nm", width: 80, align: "center" },
                { header: "M03", name: "m03_nm", width: 80, align: "center" },
                { header: "M04", name: "m04_nm", width: 80, align: "center" },
                { header: "M05", name: "m05_nm", width: 80, align: "center" },
                { header: "M06", name: "m06_nm", width: 80, align: "center" },
                { header: "M07", name: "m07_nm", width: 80, align: "center" },
                { header: "M08", name: "m08_nm", width: 80, align: "center" },
                { header: "M09", name: "m09_nm", width: 80, align: "center" },
                { header: "M10", name: "m10_nm", width: 80, align: "center" },
                { header: "M11", name: "m11_nm", width: 80, align: "center" },
                { header: "M12", name: "m12_nm", width: 80, align: "center" },
                { header: "M13", name: "m13_nm", width: 80, align: "center" },
                { header: "M14", name: "m14_nm", width: 80, align: "center" },
                { header: "M15", name: "m15_nm", width: 80, align: "center" },
                { name: "prod_key", hidden: true },
                { name: "m01_cd", hidden: true },
                { name: "m02_cd", hidden: true },
                { name: "m03_cd", hidden: true },
                { name: "m04_cd", hidden: true },
                { name: "m05_cd", hidden: true },
                { name: "m06_cd", hidden: true },
                { name: "m07_cd", hidden: true },
                { name: "m08_cd", hidden: true },
                { name: "m09_cd", hidden: true },
                { name: "m10_cd", hidden: true },
                { name: "m11_cd", hidden: true },
                { name: "m12_cd", hidden: true },
                { name: "m13_cd", hidden: true },
                { name: "m14_cd", hidden: true },
                { name: "m15_cd", hidden: true },
                { name: "modify_no", hidden: true },
                { name: "modify_seq", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_PROD", offset: 8 },
                { type: "GRID", id: "grdList_MODULE", offset: 8 },
                { type: "GRID", id: "grdData_MODIFY_DS", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //=====================================================================================
        //----------
        gw_com_module.informSize();

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

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClose };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_2", element: "조회", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "추가", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "삭제", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu_3", element: "저장", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //=====================================================================================

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
                processRetrieve({});
            }
            break;
        case "추가":
            {
                var ids1 = gw_com_api.getSelectedRow("grdList_PROD", true);
                if (ids1.length == 0) {
                    gw_com_api.messageBox([{ text: "횡전개 대상 설비가 선택되지 않았습니다." }]);
                    return false;
                }
                var ids2 = gw_com_api.getSelectedRow("grdList_MODULE", true);
                if (ids2.length == 0) {
                    gw_com_api.messageBox([{ text: "적용 모듈이 선택되지 않았습니다." }]);
                    return false;
                }
                var module = new Object();
                $.each(ids2, function (i, v) {
                    var seq = i + 1;
                    var col = "m" + (seq >= 10 ? "" : "0") + seq;
                    module[col + "_cd"] = gw_com_api.getValue("grdList_MODULE", v, "module_cd", true);
                    module[col + "_nm"] = gw_com_api.getValue("grdList_MODULE", v, "module_nm", true);
                });

                var data = new Array();
                var cnt = 0;
                $.each(ids1, function () {
                    var prod = gw_com_api.getRowData("grdList_PROD", this);
                    prod.modify_no = v_global.logic.modify_no;
                    prod.modify_seq = -1;
                    if (gw_com_api.getFindRow("grdData_MODIFY_DS", "prod_key", prod.prod_key) > 0) {
                        cnt += 1;
                        return true;
                    }
                    var tmp = new Object();
                    $.extend(tmp, prod, module);
                    data.push(tmp);
                });
                if (data.length > 0) {
                    var args = {
                        targetid: "grdData_MODIFY_DS",
                        data: data
                    };
                    gw_com_module.gridInserts(args);
                }
                gw_com_api.selectRow("grdList_PROD", "reset");
                gw_com_api.selectRow("grdList_MODULE", "reset");
                if (cnt > 0)
                    gw_com_api.messageBox([{ text: "이미 등록된 설비 " + cnt + "건이 제외되었습니다." }]);
            }
            break;
        case "삭제":
            {
                var row = gw_com_api.getSelectedRow("grdData_MODIFY_DS");
                if (row > 0) {
                    var args = {
                        request: "DATA",
                        name: "EHM_3112_3_CHK_DEL",
                        url: "../Service/svc_Data_Retrieve_JSON.aspx" +
                            "?QRY_ID=EHM_3112_3_CHK_DEL" +
                            "&QRY_COLS=deletable" +
                            "&CRUD=R" +
                            "&arg_modify_no=" + gw_com_api.getValue("grdData_MODIFY_DS", row, "modify_no", true) +
                            "&arg_modify_seq=" + gw_com_api.getValue("grdData_MODIFY_DS", row, "modify_seq", true),
                        async: false,
                        handler_success: successRequest
                    };
                    gw_com_module.callRequest(args);

                    function successRequest(type, name, data) {
                        if (data.DATA[0] == "1") {
                            var args = {
                                targetid: "grdData_MODIFY_DS", row: "selected", select: true
                            };
                            gw_com_module.gridDelete(args);
                        } else
                            gw_com_api.messageBox([{ text: "실적이 등록되어 있어 삭제할 수 없습니다." }]);
                    }
                } else {
                    gw_com_api.messageBox([{ text: "삭제할 데이터가 선택되지 않았습니다." }]);
                }
            }
            break;
        case "저장":
            {
                if (gw_com_api.getRowCount("grdData_MODIFY_DS") > 0) {
                    processBatch({});
                } else {
                    gw_com_api.messageBox([{ text: "처리할 데이터가 없습니다." }]);
                }
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
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_eco_no", value: v_global.logic.eco_no },
                { name: "arg_modify_no", value: v_global.logic.modify_no },
                { name: "arg_dept_cd", value: (gw_com_module.v_Session.USER_TP == "SYS" ? "%" : gw_com_module.v_Session.DEPT_CD) }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_PROD" },
            { type: "GRID", id: "grdList_MODULE" },
            { type: "GRID", id: "grdData_MODIFY_DS" }
        ],
        handler: {
            complete: processRetrieveEnd,
            param: param
        }
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processRetrieveEnd(param) {

}
//----------
function processBatch(param) {

    var data = "";
    var ids = gw_com_api.getRowIDs("grdData_MODIFY_DS");
    $.each(ids, function () {
        var row = gw_com_api.getRowData("grdData_MODIFY_DS", this);
        data += (data == "" ? "" : "|") + row.prod_key + "^" +
            row.m01_cd + "^" + row.m02_cd + "^" + row.m03_cd + "^" + row.m04_cd + "^" + row.m05_cd + "^" +
            row.m06_cd + "^" + row.m07_cd + "^" + row.m08_cd + "^" + row.m09_cd + "^" + row.m10_cd + "^" +
            row.m11_cd + "^" + row.m12_cd + "^" + row.m13_cd + "^" + row.m14_cd + "^" + row.m15_cd + "^"
    });
    var args = {
        url: "COM",
        nomessage: true,
        procedure: "sp_createEHMModify",
        input: [
            //{ name: "modify_no", value: v_global.logic.modify_no, type: "varchar" },
            { name: "eco_no", value: v_global.logic.eco_no, type: "varchar" },
            { name: "data", value: data, type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "modify_no", type: "varchar", value: v_global.logic.modify_no },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successBatch,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successBatch(response, param) {

    if (response.VALUE[1] == "") {
        var missing = undefined;
        var p = {
            handler: processClose,
            param: { data: { modify_no: response.VALUE[0] } }
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], missing, missing, missing, p);
    } else {
        var msg = new Array();
        $.each(response.VALUE[1].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 600);
    }

}
//----------
function processClose(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: param.data
    };
    gw_com_module.streamInterface(args);
    processClear(param);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_PROD" },
            { type: "GRID", id: "grdList_MODULE" },
            { type: "GRID", id: "grdData_MODIFY_DS" }
        ]
    };
    gw_com_module.objClear(args);

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
        case gw_com_api.v_Stream.msg_openedDialogue:
            {
                v_global.logic = param.data;
                if (param.data.modify_no == undefined)
                    v_global.logic.modify_no = "";
                processRetrieve({});
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
                    param.to = {
                        type: "POPUP",
                        page: param.data.page
                    };
                    gw_com_module.streamInterface(param);
                    break;
                }
                switch (param.data.ID) {
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined)
                                param.data.arg.handler(param.data.arg.param);
                        }
                        break
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//