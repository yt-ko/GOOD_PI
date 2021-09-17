
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
        v_global.process.param = gw_com_module.initPage({ message: true });
        gw_com_api.changeTheme("style_theme");

        //----------
        var args = {
            request: [
                //{
                //    type: "PAGE", name: "진행상태", query: "dddw_zcode",
                //    param: [{ argument: "arg_hcode", value: "ECCB42" }]
                //},
                {
                    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODE",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
                },
                {
                    type: "PAGE", name: "dddwApprYn", query: "dddw_zcode",
                    param: [{ argument: "arg_hcode", value: "AprApprYn" }]
                },
                {
                    type: "PAGE", name: "DEPT_AREA_FIND", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                {
                    type: "INLINE", name: "일자",
                    data: [
						{ title: "작성일자", value: "WRT" },
						{ title: "완료일자", value: "FIN" }
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
            //var obj = document.getElementsByTagName("label");
            //for (var i = 0; i < obj.length; i++) {
            //    var label = obj[i];
            //    if (label.innerHTML == "완료일자 :" || label.innerHTML == "작성일자 :") {
            //        label.style.display = "none";
            //    }
            //}
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
                { name: "조회", value: "조회", act: true },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "ymd_fr", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "date_tp",
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "일자" } }
                            },
                            {
                                name: "ymd_fr", label: { title: "작성일자 :" }, mask: "date-ymd", style: { colfloat: "floating" },
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "ymd_to", label: { title: "~" }, mask: "date-ymd",
                                editable: { type: "text", size: 7, maxlength: 10 }
                            },
                            {
                                name: "biz_dept", label: { title: "장비군 :" },
                                editable: { type: "select", size: 7, maxlength: 20, data: { memory: "DEPT_AREA_FIND" } }
                            }
                        ]
                    },
                    {
                        element: [
                            //{
                            //    name: "prod_type", label: { title: "제품유형 :" },
                            //    editable: { type: "select", data: { memory: "제품유형", unshift: [{ title: "전체", value: "%" }] } }
                            //},
                            {
                                name: "proj_no", label: { title: "PJT No. :" },
                                editable: { type: "text", size: 27, maxlength: 50 }
                            },
                            {
                                name: "root_no", label: { title: "ECR No. :" },
                                editable: { type: "text", size: 12 }
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
            targetid: "grdData_현황", query: "EDM_EcoItem_AprList", title: "ECO 변경전 품목 해제 현황",
            height: 442, show: true, selectable: true, key: true, dynamic: true,
            element: [
                { header: "PJT No.", name: "proj_no", width: 90, align: "center" },
                { header: "품번", name: "item_no", width: 80, align: "left" },
                { header: "품명", name: "item_nm", width: 120, align: "left" },
                { header: "수량", name: "bom_qty", width: 60, align: "right", mask: "int" },
                { header: "ECR No.", name: "root_no", width: 80, align: "center" },
                { header: "ECCB No.", name: "root_dept", width: 80, align: "center" },
                { header: "진행단계", name: "pstat", width: 60, align: "center" },
                { header: "진행상태", name: "astat", width: 60, align: "center" },
                { header: "Hold 구분", name: "hold_cd", width: 60, align: "center" },
                { header: "해제요청자", name: "rqst_user_nm", width: 80, align: "center" },
                { header: "해제전결자", name: "appr_user_nm", width: 80, align: "center" },
                { header: "해제요청상태", name: "appr_yn_nm", width: 80, align: "center" },
                { header: "해제승인일", name: "appr_ymd", width: 80, align: "center", mask: "date-ymd" },
                { name: "rqst_user", hidden: true },
                { name: "appr_user", hidden: true },
                { name: "appr_yn", hidden: true }
            ]
        };
        //----------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_현황", offset: 8 }
            ]
        };
        //----------
        gw_com_module.objResize(args);
        //====================================================================================
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

        //====================================================================================
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //====================================================================================
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processRetrieve };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //====================================================================================
        //var args = { targetid: "grdData_현황", grid: true, event: "rowdblclick", handler: click_lyrMenu_상세 };
        //gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", grid: false, event: "itemchanged", handler: processItemChanged };
        gw_com_module.eventBind(args);
        //====================================================================================

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

            var args = { target: [{ id: "frmOption", focus: true }] };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_상세(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb4010",
                    title: "ECO 정보",
                    param: [
                        { name: "AUTH", value: "R" },
                        { name: "eco_no", value: gw_com_api.getValue("grdData_현황", "selected", "eco_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_추가(ui) {

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb4010",
                    title: "ECO 등록"
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_수정(ui) {

            var eco_emp = gw_com_api.getValue("grdData_현황", "selected", "eco_emp", true);
            var approval = gw_com_api.getValue("grdData_현황", "selected", "approval", true);
            var status = gw_com_api.getValue("grdData_현황", "selected", "gw_astat_nm", true);
            if (gw_com_module.v_Session.USER_TP != "SYS") {
                /*if (eco_emp != gw_com_module.v_Session.EMP_NO) {
                    gw_com_api.messageBox([
                        { text: "수정 권한이 없습니다." }
                    ], 300);
                    return false;
                } else */if (approval != "1") {
                    gw_com_api.messageBox([
                        { text: "결재 " + status + " 자료이므로 수정할 수 없습니다." }
                    ], 420);
                    return false;
                }
            }

            var args = {
                ID: gw_com_api.v_Stream.msg_linkPage,
                to: { type: "MAIN" },
                data: {
                    page: "w_eccb4010",
                    title: "ECO 등록",
                    param: [
                        { name: "eco_no", value: gw_com_api.getValue("grdData_현황", "selected", "eco_no", true) }
                    ]
                }
            };
            gw_com_module.streamInterface(args);

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            processClose({});

        }
        //----------
        function processItemChanged(ui) {
            var label = $('.form_1 tbody tr td table td:eq(1)');
            //alert(label);
            var text = "";
            if (gw_com_api.getValue("frmOption", "1", "date_tp", false) == "FIN") {
                text = "완료일자 :";
            }
            else {
                text = "작성일자 :";
            }
            label.hide();
        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_api.setValue("frmOption", 1, "ymd_fr", gw_com_api.getDate("", { month: -3 }));
        gw_com_api.setValue("frmOption", 1, "ymd_to", gw_com_api.getDate(""));
        gw_com_api.setValue("frmOption", 1, "biz_dept", gw_com_module.v_Session.DEPT_AREA);
        //----------
        gw_com_module.startPage();

        var if_key = gw_com_api.getPageParameter("proj_no");
        var key = gw_com_api.getPageParameter("root_no");
        if (if_key > "") {
            gw_com_api.setValue("frmOption", 1, "proj_no", if_key);
            processRetrieve({});
        }
        else if (key > "") {
            gw_com_api.setValue("frmOption", 1, "root_no", key);
            processRetrieve({});
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
function processRetrieve(param) {
    var args = { target: [{ type: "FORM", id: "frmOption" }] };
    if (gw_com_module.objValidate(args) == false) return false;
    var args = {
        key: param.key,
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "ymd_fr", argument: "arg_ymd_fr" },
                { name: "ymd_to", argument: "arg_ymd_to" },
                { name: "biz_dept", argument: "arg_biz_dept" },
                { name: "proj_no", argument: "arg_proj_no" },
                { name: "root_no", argument: "arg_root_no" }
            ],
            remark: [
                { label: "작성일자", infix: "~", element: [{ name: "ymd_fr" }, { name: "ymd_to" }] },
                { element: [{ name: "biz_dept" }] },
                { element: [{ name: "proj_no" }] },
                { element: [{ name: "root_no" }] }
            ]
        },
        target: [
            {
                type: "GRID", id: "grdData_현황", select: true, focus: true
            }
        ]
    };
    //if (gw_com_api.getValue("frmOption", 1, "date_tp", false) == "FIN") {
    //    args.target.query = ""
    //}
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
                if (param.data.page != gw_com_api.getPageID())
                    break;
            }
            break;
            /*
            case gw_com_api.v_Stream.msg_openedDialogue:
            {
            var args = {
            to: {
            type: "POPUP",
            page: param.from.page
            }
            };
            switch (param.from.page) {
            case "w_find_as":
            {
            args.ID = gw_com_api.v_Stream.msg_infoAS;
            args.data = {
            issue_no: gw_com_api.getValue("grdData_현황", "selected", "issue_no", true)
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
            */
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//