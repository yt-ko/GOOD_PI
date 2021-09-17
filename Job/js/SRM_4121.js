//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 화면명 : 납품대상 발주내역 조회
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

        // initialize page.
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        // 협력사 여부
        v_global.logic.Supp = (gw_com_module.v_Session.USER_TP == undefined || gw_com_module.v_Session.USER_TP == "SUPP" ? true : false);

        // set data for DDDW List
        var args = {
            request: [
                {
                    type: "INLINE", name: "라벨유형",
                    data: [
                        { title: "개별", value: "1" },
                        { title: "통합", value: "2" }
                    ]
                },
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea_supp",
                    param: [
                        { argument: "arg_type", value: "SRM" }
                    ]
                },
                { type: "PAGE", name: "창고그룹", query: "SRM_4121_8" },
                { type: "PAGE", name: "창고", query: "SRM_4121_9" }
                //{
                //    type: "PAGE", name: "창고", query: "dddw_zcoded",
                //    param: [{ argument: "arg_hcode", value: "ISCM10" }]
                //}
            ],
            starter: start
        };
        gw_com_module.selectSet(args);

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();
            //----------
            gw_com_module.startPage();
            //----------
            gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { day: -30 }));
            gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
            //----------
            $("#frmOption_dept_area").change();
            //----------
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
                { name: "조회", value: "조회", act: true },
                { name: "확인", value: "확인", icon: "저장" },
                { name: "닫기", value: "취소", icon: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건",
            trans: true, show: true, border: true,
            editable: { focus: "pur_no", validate: true },
            remark: "lyrRemark",
            content: {
                row: [
                    {
                        element: [
                            {
                                style: { colfloat: "floating" }, name: "ymd_fr", label: { title: "발주일자 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "dept_area", label: { title: "장비군 :" },
                                editable: {
                                    type: "select", data: { memory: "장비군" },
                                    change: [
                                        { name: "wh_grp", memory: "창고그룹", key: ["dept_area"] },
                                        { name: "wh_cd", memory: "창고", key: ["dept_area", "wh_grp"], unshift: [{ title: "전체", value: "" }] }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "wh_grp", label: { title: "창고그룹 :" },
                                editable: {
                                    type: "select", data: { memory: "창고그룹", key: ["dept_area"] },
                                    change: [{ name: "wh_cd", memory: "창고", key: ["dept_area", "wh_grp"], unshift: [{ title: "전체", value: "" }] }]
                                }
                            },
                            {
                                name: "wh_cd", label: { title: "납품장소 :" },
                                editable: { type: "select", data: { memory: "창고", key: ["dept_area", "wh_grp"], unshift: [{ title: "전체", value: "" }] } }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "pur_no", label: { title: "발주번호 : " },
                                editable: { type: "text", size: 15 }
                            },
                            {
                                name: "bl_no", label: { title: "B/L번호 : " },
                                editable: { type: "text", size: 15 }, hidden: (v_global.logic.Supp)
                            },
                            { name: "supp_cd", hidden: true, value: (v_global.logic.Supp ? gw_com_module.v_Session.USR_ID : "") }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "proj_no", label: { title: "Project No. : " },
                                editable: { type: "text", size: 30 }
                            }
                        ]
                    },
                    {
                        element: [
                            {
                                name: "item_cd", label: { title: "품번 : " },
                                editable: { type: "text", size: 13 }
                            },
                            {
                                name: "item_nm", label: { title: "품명 : " },
                                editable: { type: "text", size: 15 }
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
            targetid: "frmOption2", type: "FREE", align: "left",
            trans: true, show: true, border: false,
            editable: { validate: true },
            content: {
                row: [
                    {
                        align: "right",
                        element: [
                            { name: "조회", value: "품목 조회", format: { type: "button" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption_DLV", type: "FREE",
            trans: true, show: false, border: true,
            editable: { focus: "label_tp", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dlv_date", label: { title: "납품일자 :" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, validate: { rule: "required" } }, value: gw_com_api.getDate()
                            },
                            {
                                name: "dlv_user", label: { title: "납품담당 :" },
                                editable: { type: "text", maxlength: 10, size: 10 }
                            },
                            {
                                name: "label_tp", label: { title: "라벨유형 :" },
                                editable: { type: "select", data: { memory: "라벨유형" } }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "저장", value: "저장", act: true, format: { type: "button" } },
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
            targetid: "grdList_PUR", query: "SRM_4121_1", title: "발주 목록",
            width: 180, height: 180, show: true, selectable: true, multi: true, checkrow: true,
            element: [
                { header: "발주번호", name: "pur_no", width: 80 },
                { header: "공급업체", name: "supp_nm", width: 120, hidden: (v_global.logic.Supp) },
                { name: "supp_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PJT", query: "SRM_4121_2", title: "Tracking",
            width: 180, height: 222, show: true, selectable: true, multi: true, checkrow: true,
            element: [
                { header: "Tracking", name: "proj_no", width: 100 },
                { name: "pur_no", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            targetid: "grdList_PUR_D", query: "SRM_4121_3", title: "납품 대상 품목",
            width: 880, height: 420, show: true, multi: true, checkrow: true,
            color: { element: ["item_cd", "item_nm", "qcr_file_chk"] },
            element: [
                { header: "품번", name: "item_cd", width: 90 },
                { header: "품명", name: "item_nm", width: 150 },
                { header: "규격", name: "item_spec", width: 150 },
                { header: "Tracking", name: "track_no", width: 80 },
                { header: "Pallet No.", name: "pallet_no", width: 80, hidden: true },
                { header: "납기요청일", name: "req_date", width: 70, align: "center", mask: "date-ymd" },
                { header: "PO수량", name: "pur_qty", width: 50, align: "right" },
                { header: "단위", name: "pur_unit", width: 40, align: "center" },
                { header: "납품수량", name: "dlv_qty", width: 50, align: "right", hidden: true },
                { header: "성적서미등록", name: "qcr_file_chk", width: 60, align: "right", mask: "numeric-int" },
                { header: "납품가능수량", name: "dlva_qty", width: 60, align: "right" },
                { header: "납품장소", name: "wh_nm", width: 100 },
                {
                    header: "검사", name: "qc_yn", width: 50, align: "center",
                    format: { type: "checkbox", value: "1", offval: "0" }
                },
                { header: "성적서", name: "qcr_type", width: 50, align: "center" },
                { name: "pur_no", hidden: true },
                { name: "pur_seq", hidden: true },
                { name: "color", hidden: true },
                { name: "qcr_chk", hidden: true },
                { name: "wh_cd", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_PUR", offset: 8 },
                { type: "GRID", id: "grdList_PJT", offset: 8 },
                { type: "GRID", id: "grdList_PUR_D", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //----------
        gw_com_module.informSize();
        //=====================================================================================
        $("#lyrNotice").html("※ 빨간색 품목은 <font color='red'><b>성적서 미등록</b></font> 품목입니다. 성적서 확인 후 납품등록 할 수 있습니다.");
        //=====================================================================================

    },

    //==== manage process. (program section)
    procedure: function () {

        //=====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "확인", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption_DLV", element: "저장", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption_DLV", element: "취소", event: "click", handler: processClick };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "frmOption2", element: "조회", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //=====================================================================================
        var args = { targetid: "grdList_PUR", grid: true, event: "rowselected", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        $("#cb_grdList_PUR_data").change(function () {
            var args = {
                object: "grdList_PUR", row: 0, type: "GRID"
            };
            processRetrieve(args);
        });
        //=====================================================================================
        //var args = { targetid: "grdList_PJT", grid: true, event: "rowselected", handler: processRetrieve };
        //gw_com_module.eventBind(args);
        ////----------
        //$("#cb_grdList_PJT_data").change(function () {
        //    var args = {
        //        object: "grdList_PJT", row: 0, type: "GRID"
        //    };
        //    processRetrieve(args);
        //});
        //=====================================================================================
        function processClick(param) {

            switch (param.element) {
                case "조회":
                    {
                        viewOption(param);
                    }
                    break;
                case "확인":
                    {
                        gw_com_api.hide("frmOption");
                        gw_com_api.show("frmOption_DLV");
                    }
                    break;
                case "닫기":
                    {
                        processClose(param);
                    }
                    break;
                case "실행":
                    {
                        processRetrieve(param);
                    }
                    break;
                case "취소":
                    {
                        closeOption(param);
                    }
                    break;
                case "저장":
                    {
                        closeOption(param);
                        processSave(param);
                    }
                    break;
            }

        }

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function viewOption(param) {

    gw_com_api.hide("frmOption_DLV");
    var args = {
        target: [
            { id: "frmOption", focus: true }
        ]
    };
    gw_com_module.objToggle(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");
    gw_com_api.hide("frmOption_DLV");

}
//----------
function processRetrieve(param) {

    if (param.object == "grdList_PUR") {

        var ids = gw_com_api.getSelectedRow(param.object, true);
        if (ids.length == 0) {

            var args = {
                target: [
                    { type: "GRID", id: "grdList_PJT" },
                    { type: "GRID", id: "grdList_PUR_D" }
                ]
            };
            gw_com_module.objClear(args);

        } else {

            gw_com_api.block(param.object);
            var pur_no = "";
            $.each(ids, function () {
                pur_no += gw_com_api.getValue(param.object, this, "pur_no", true) + ":";
            })
            var args = {
                source: {
                    type: "FORM", id: "frmOption", hide: true,
                    element: [
                        { name: "item_cd", argument: "arg_item_cd" },
                        { name: "item_nm", argument: "arg_item_nm" },
                        { name: "proj_no", argument: "arg_proj_no" },
                        { name: "dept_area", argument: "arg_dept_area" },
                        { name: "wh_grp", argument: "arg_wh_grp" },
                        { name: "wh_cd", argument: "arg_wh_cd" },
                        { name: "bl_no", argument: "arg_bl_no" }
                    ],
                    argument: [
                        { name: "arg_pur_no", value: pur_no }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdList_PJT" }
                ],
                clear: [
                    { type: "GRID", id: "grdList_PUR_D" }
                ],
                key: param.key,
                handler: {
                    complete: processRetrieveEnd,
                    param: param
                }
            };
            gw_com_module.objRetrieve(args);

        }
    } else if (param.object == "frmOption2") {

        var args = { object: "grdList_PJT", type: "GRID" };
        processRetrieve(args);

    } else if (param.object == "grdList_PJT") {

        var ids = gw_com_api.getSelectedRow(param.object, true);
        if (ids.length == 0) {

            var args = { target: [{ type: "GRID", id: "grdList_PUR_D" }] };
            gw_com_module.objClear(args);

        } else {

            gw_com_api.block(param.object);
            var pur_no = gw_com_api.getParameter($.data($("#" + param.object)[0], "argument"), "arg_pur_no");
            var proj_no = "";
            $.each(ids, function () {
                proj_no += gw_com_api.getValue(param.object, this, "proj_no", true) + ":";
            })
            var args = {
                source: {
                    type: "FORM", id: "frmOption", hide: true,
                    element: [
                        { name: "item_cd", argument: "arg_item_cd" },
                        { name: "item_nm", argument: "arg_item_nm" },
                        { name: "dept_area", argument: "arg_dept_area" },
                        { name: "wh_grp", argument: "arg_wh_grp" },
                        { name: "wh_cd", argument: "arg_wh_cd" },
                        { name: "bl_no", argument: "arg_bl_no" }
                    ],
                    argument: [
                        { name: "arg_pur_no", value: pur_no },
                        { name: "arg_proj_no", value: proj_no }
                    ]
                },
                target: [
                    { type: "GRID", id: "grdList_PUR_D", focus: true }
                ],
                key: param.key,
                handler: {
                    complete: processRetrieveEnd,
                    param: param
                }
            };
            gw_com_module.objRetrieve(args);

        }

    } else {

        var args = { target: [{ type: "FORM", id: "frmOption" }] };
        if (gw_com_module.objValidate(args) == false) return false;

        var args = {
            source: {
                type: "FORM", id: "frmOption", hide: true,
                element: [
                    { name: "pur_no", argument: "arg_pur_no" },
                    { name: "item_cd", argument: "arg_item_cd" },
                    { name: "item_nm", argument: "arg_item_nm" },
                    { name: "proj_no", argument: "arg_proj_no" },
                    { name: "ymd_fr", argument: "arg_ymd_fr" },
                    { name: "ymd_to", argument: "arg_ymd_to" },
                    { name: "dept_area", argument: "arg_dept_area" },
                    { name: "wh_grp", argument: "arg_wh_grp" },
                    { name: "wh_cd", argument: "arg_wh_cd" },
                    { name: "bl_no", argument: "arg_bl_no" },
                    { name: "supp_cd", argument: "arg_supp_cd" }
                ],
                remark: [
                    { infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                    { element: [{ name: "dept_area" }] },
                    { element: [{ name: "wh_grp" }] },
                    { element: [{ name: "wh_cd" }] },
                    { element: [{ name: "pur_no" }] },
                    { element: [{ name: "bl_no" }] },
                    { element: [{ name: "proj_no" }] },
                    { element: [{ name: "item_cd" }] },
                    { element: [{ name: "item_nm" }] }
                ]
            },
            target: [
                { type: "GRID", id: "grdList_PUR", focus: true }
            ],
            clear: [
                { type: "GRID", id: "grdList_PJT" },
                { type: "GRID", id: "grdList_PUR_D" }
            ],
            key: param.key
        };
        gw_com_module.objRetrieve(args);

    }

};
//----------
function processRetrieveEnd(param) {

    gw_com_api.unblock(param.object);

}
//----------
function processClear(param) {

    var args = {
        target: [
            { type: "GRID", id: "grdList_PUR" },
            { type: "GRID", id: "grdList_PJT" },
            { type: "GRID", id: "grdList_PUR_D" }
        ]
    };
    gw_com_module.objClear(args);

}
//----------
function processClose(param) {

    var args = { ID: gw_com_api.v_Stream.msg_closeDialogue };
    gw_com_module.streamInterface(args);
    processClear({});

}
//----------
function informResult(param) {

    var ids = gw_com_api.getSelectedRow("grdList_PUR_D", true);
    if (ids.length < 1) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return false;
    }

    var rows = [];
    var stop = false;
    $.each(ids, function () {
        var row = gw_com_api.getRowData("grdList_PUR_D", this);
        var qcr_chk = row["qcr_chk"];
        if (qcr_chk == "1") {
            gw_com_api.showMessage("제출된 성적서 수량이 부족하여 납품등록 할 수 없습니다.");
            stop = true;
            return false;
        }

        if (rows.length > 0) {
            if (rows[rows.length - 1].wh_cd != row["wh_cd"]) {
                gw_com_api.showMessage("선택된 품목의 창고가 동일하지 않습니다.");
                stop = true;
                return false;
            }
        }
        row.dlv_seq = 0;
        row.dlv_qty = row.dlva_qty;
        rows.push(row);

    });

    if (rows.length > 0 && !stop) {
        var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue,
            data: {
                dlv_no: v_global.logic.data.dlv_no,
                supp_cd: gw_com_api.getValue("grdList_PUR", "selected", "supp_cd", true),
                wh_cd: rows[0].wh_cd,
                wh_nm: rows[0].wh_nm,
                rows: rows
            }
        };
        gw_com_module.streamInterface(args);

        processClear({});
    }

}
//----------
function processSave(param) {

    var ids = gw_com_api.getSelectedRow("grdList_PUR_D", true);
    if (ids.length == 0) {
        gw_com_api.messageBox([{ text: "NODATA" }]);
        return;
    }

    var args = { target: [{ type: "FORM", id: "frmOption_DLV" }] };
    if (gw_com_module.objValidate(args) == false) return false;

    var label_tp = gw_com_api.getValue("frmOption_DLV", 1, "label_tp");
    var data = "";
    $.each(ids, function () {

        var dlva_qty = gw_com_api.getValue("grdList_PUR_D", this, "dlva_qty", true);
        //if (Number(dlva_qty) <= 0) return true;

        data += (gw_com_api.getValue("grdList_PUR_D", this, "pur_no", true) + ":" +
            gw_com_api.getValue("grdList_PUR_D", this, "pur_seq", true) + ":" +
            dlva_qty + ":" +
            label_tp + "^");

    })

    var args = {
        url: "COM",
        procedure: "sp_SRM_createDLV",
        nomessage: true,
        block: true,
        input: [
            { name: "data", value: data, type: "varchar" },
            { name: "dlv_date", value: gw_com_api.getValue("frmOption_DLV", 1, "dlv_date"), type: "varchar" },
            { name: "dlv_user", value: gw_com_api.getValue("frmOption_DLV", 1, "dlv_user"), type: "varchar" },
            { name: "usr_id", value: gw_com_module.v_Session.USR_ID, type: "varchar" }
        ],
        output: [
            { name: "dlv_no", type: "varchar", value: v_global.logic.data.dlv_no },
            { name: "rtn_no", type: "int" },
            { name: "rtn_msg", type: "varchar" }
        ],
        handler: {
            success: successSave,
            param: param
        }
    };
    gw_com_module.callProcedure(args);

}
//----------
function successSave(response, param) {

    if (response.VALUE[1] >= 0) {

        var args = { dlv_no: response.VALUE[0] };
        var p = {
            handler: function (param) {
                var args = {
                    ID: gw_com_api.v_Stream.msg_closeDialogue,
                    data: param
                };
                gw_com_module.streamInterface(args);
                processClear({});
            },
            param: args
        };
        gw_com_api.messageBox([{ text: "SUCCESS" }], undefined, undefined, undefined, p);


    } else {

        var msg = new Array();
        $.each(response.VALUE[2].split("\n"), function (i, v) {
            msg.push({ text: v });
        });
        gw_com_api.messageBox(msg, 500);

    }

}
//----------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openDialogue:
            {
                v_global.logic.data = param.data;
                gw_com_api.show("frmOption");
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
                            if (param.data.result == "YES") processEdit(param.data.arg);
                            else {
                                var status = checkCRUD({});
                                if (status == "initialize" || status == "create") processDelete({});
                                else if (status == "update") processRestore({});
                                if (v_global.process.handler != null) v_global.process.handler(param.data.arg);
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
                    case gw_com_api.v_Message.msg_informBatched:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                    default:
                        {
                            if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                if (param.data.arg.param == undefined)
                                    param.data.arg.handler();
                                else
                                    param.data.arg.handler(param.data.arg.param);
                            }
                        }
                }
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//