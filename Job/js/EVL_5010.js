//------------------------------------------
// Process about Job Process.
//                Created by K, GoodWare (2018.06)
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
        v_global.process.param = gw_com_module.initPage({ authority: true, message: true });
        //----------
        gw_com_api.changeTheme("style_theme");
        //----------
        v_global.logic.ext1 = gw_com_api.getPageParameter("ext1");  //평가 속성
        //----------
        var args = {
            request: [
                { type: "PAGE", name: "평가연도", query: "dddw_evl_year" },
                {
                    type: "PAGE", name: "평가목록", query: "dddw_evl_all",
                    param: [
                        { argument: "arg_ext1", value: v_global.logic.ext1 }
                    ]
                }//,
                //{ type: "PAGE", name: "평가차수", query: "dddw_evl_seq_all" }
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
            gw_com_api.setValue("frmOption", 1, "evl_year", gw_com_api.getYear());

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
                { name: "닫기", value: "닫기" }
            ]
        };
        //-----------------------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", remark: "lyrRemark",
            trans: true, border: true, show: true,
            editable: { focus: "evl_year", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "evl_year", label: { title: "평가연도 :" },
                                editable: {
                                    type: "select", data: { memory: "평가연도" },
                                    change: [
                                        { name: "evl_no", memory: "평가목록", key: ["evl_year"] }/*,
                                        { name: "evl_seq", memory: "평가차수", key: ["evl_no"] }*/
                                    ]
                                }
                            },
                            {
                                name: "evl_no", label: { title: "평가명 :" },
                                editable: {
                                    type: "select", data: { memory: "평가목록", key: ["evl_year"] }/*,
                                    change: [
                                        { name: "evl_seq", memory: "평가차수", key: ["evl_no"] }
                                    ]*/
                                }
                            }//,
                            //{
                            //    name: "evl_seq", label: { title: "평가차수 :" }, hidden: true,
                            //    editable: { type: "select", data: { memory: "평가차수", key: ["evl_no"] } }
                            //}
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
            targetid: "grdList_REPORT", query: "EVL_5010_1", title: "",
            height: 450, show: true, caption: false, selectable: true, number: true,
            element: [
                { header: "평가명", name: "evl_nm", width: 150 },
                { header: "평가그룹", name: "evl_group_nm", width: 80 },
                { header: "장비군", name: "dept_area_nm", width: 80 },
                { header: "평가자", name: "valuer_nm", width: 70 },
                { header: "평가대상", name: "user_nm", width: 170 },
                { header: "평가점수<br />(가중치)", name: "total_add_point", width: 80, align: "right", mask: "numeric-float1" },
                { header: "평가등급<br />(가중치)", name: "total_add_grade", width: 60, align: "center" },
                { header: "개선항목<br />(건)", name: "imprv_cnt", width: 60, align: "right", mask: "numeric-int" },
                { header: "개선완료<br />항목(건)", name: "plan_cnt", width: 60, align: "right", mask: "numeric-int" },
                { header: "개선율<br />(%)", name: "plan_rate", width: 60, align: "right", mask: "numeric-float1" },
                { header: "적합<br />(건)", name: "result_cnt", width: 60, align: "right", mask: "numeric-int" },
                { header: "적합율<br />(%)", name: "result_rate", width: 60, align: "right", mask: "numeric-float1" },
                { name: "evl_no", hidden: true },
                { name: "evl_seq", hidden: true }
            ]
        };
        //-----------------------
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdList_REPORT", offset: 8 }
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
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: processButton };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: closeOption };
        gw_com_module.eventBind(args);
        //----------
        function processButton(param) {

            switch (param.element) {
                case "조회":
                    {
                        var args = { target: [{ id: "frmOption", focus: true }] };
                        gw_com_module.objToggle(args);
                    }
                    break;
                case "닫기":
                    {
                        processClose({});
                    }
                    break;
                case "실행":
                    {
                        processRetrieve({});
                    }
                    break;
            }

        }
        //----------

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

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "evl_no", argument: "arg_evl_no" }//,
                //{ name: "evl_seq", argument: "arg_evl_seq" }
            ],
            argument: [
                { name: "arg_evl_seq", value: "1" }
            ],
            remark: [
                { element: [{ name: "evl_year" }] },
                { element: [{ name: "evl_no" }] }
            ]
        },
        target: [
            { type: "GRID", id: "grdList_REPORT", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function closeOption(param) {

    gw_com_api.hide("frmOption");

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
                                if (v_global.process.handler != null)
                                    v_global.process.handler({});
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_confirmBatch:
                    case gw_com_api.v_Message.msg_confirmRemove:
                        {
                            if (param.data.result == "YES") {
                                if (param.data.arg != undefined && param.data.arg.handler != undefined) {
                                    if (param.data.arg.param == undefined)
                                        param.data.arg.handler();
                                    else
                                        param.data.arg.handler(param.data.arg.param);
                                }
                            }
                        }
                        break;
                    case gw_com_api.v_Message.msg_informSaved:
                    case gw_com_api.v_Message.msg_informBatched:
                    case gw_com_api.v_Message.msg_informRemoved:
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
                gw_com_module.streamInterface(args);
            }
            break;
        case gw_com_api.v_Stream.msg_closeDialogue:
            {
                closeDialogue({ page: param.from.page });
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//