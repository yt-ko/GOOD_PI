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
        gw_com_api.changeTheme("style_theme");

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            request: [
                {
                    type: "PAGE", name: "장비군", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: "ALL" }]
                },
                {
                    type: "PAGE", name: "장비군_IN", query: "dddw_deptarea",
                    param: [{ argument: "arg_type", value: gw_com_module.v_Session.DEPT_AUTH }]
                },
                {
                    type: "PAGE", name: "고객사", query: "DDDW_CM_CODED_A",
                    param: [{ argument: "arg_hcode", value: "ISCM29" }]
                },
                {
                    type: "PAGE", name: "고객사_IN", query: "dddw_zcode_notall",
                    param: [{ argument: "arg_hcode", value: "ISCM29" }]
                },
                {
                    type: "PAGE", name: "제품유형", query: "DDDW_CM_CODED_A",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
                },
                {
                    type: "PAGE", name: "제품유형_IN", query: "dddw_zcode_notall",
                    param: [{ argument: "arg_hcode", value: "ISCM25" }]
                },
                {
                    type: "PAGE", name: "공정", query: "DDDW_CM_CODED_A",
                    param: [{ argument: "arg_hcode", value: "IEHM03" }]
                },
                {
                    type: "PAGE", name: "공정_IN", query: "dddw_zcode_notall",
                    param: [{ argument: "arg_hcode", value: "IEHM03" }]
                },
                {
                    type: "PAGE", name: "영업구분", query: "DDDW_CM_CODED_A",
                    param: [{ argument: "arg_hcode", value: "ISCM21" }]
                },
                {
                    type: "PAGE", name: "영업구분_IN", query: "dddw_zcode_notall",
                    param: [{ argument: "arg_hcode", value: "ISCM21" }]
                },
                {
                    type: "INLINE", name: "dddwPjtExport",
                    data: [
			            { title: "국내", value: "0" },
			            { title: "해외", value: "1" }
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
                { name: "추가", value: "추가" },
                { name: "삭제", value: "삭제" },
                { name: "저장", value: "저장" },
                { name: "닫기", value: "닫기" }
            ]
        };
        //----------
        gw_com_module.buttonMenu(args);
        //=====================================================================================
        var args = {
            targetid: "frmOption", type: "FREE", title: "조회 조건", trans: true,
            border: true, show: true, remark: "lyrRemark",
            editable: { bind: "open", focus: "dept_area", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "dept_area", label: { title: "장비군 : " },
                                editable: { type: "select", validate: { rule: "required" }, data: { memory: "장비군_IN" } }
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
            targetid: "grdData_코드", query: "w_iscm1090_M_1", title: "고객사 모델 정보",
            height: 442, show: true, selectable: true, number: true,
            editable: { master: true, bind: "select", focus: "group3_cd", validate: true },
            element: [
                {
                    header: "장비군", name: "dept_area", width: 100, align: "center",
                    format: { type: "select", data: { memory: "장비군" } },
                    editable: { bind: "create", type: "select", data: { memory: "장비군_IN" } }
                },
                {
                    header: "고객사", name: "group3_cd", width: 150, align: "center",
                    format: { type: "select", data: { memory: "고객사" } },
                    editable: { bind: "create", type: "select", data: { memory: "고객사_IN" } }
                },
                {
                    header: "제품유형", name: "group1_cd", width: 150, align: "center",
                    format: { type: "select", data: { memory: "제품유형" } },
                    editable: { bind: "create", type: "select", data: { memory: "제품유형_IN" } }
                },
                {
                    header: "공정", name: "group2_cd", width: 150, align: "center",
                    format: { type: "select", data: { memory: "공정" } },
                    editable: { bind: "create", type: "select", data: { memory: "공정_IN" } }
                },
                {
                    header: "영업구분", name: "group4_cd", width: 150, align: "center"
                    , format: { type: "select", data: { memory: "영업구분" } }
                    , editable: { bind: "create", type: "select", data: { memory: "영업구분_IN" } }
                },
                {
                    header: "국내/외", name: "group5_cd", width: 150, align: "center"
                    , format: { type: "select", data: { memory: "dddwPjtExport" } }
                    , editable: { bind: "create", type: "select", data: { memory: "dddwPjtExport" } }
                },
                { name: "model_id", hidden: true, editable: { type: "hidden" } },
                { name: "use_yn", hidden: true, editable: { type: "hidden" } }
            ]
        };
        gw_com_module.gridCreate(args);
        //=====================================================================================
        var args = {
            target: [
                { type: "GRID", id: "grdData_코드", offset: 8 }
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

        //----------
        var args = { targetid: "lyrMenu", element: "조회", event: "click", handler: click_lyrMenu_조회 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "추가", event: "click", handler: click_lyrMenu_추가 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "삭제", event: "click", handler: click_lyrMenu_삭제 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "저장", event: "click", handler: click_lyrMenu_저장 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "lyrMenu", element: "닫기", event: "click", handler: click_lyrMenu_닫기 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "실행", event: "click", handler: click_frmOption_실행 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "frmOption", element: "취소", event: "click", handler: click_frmOption_취소 };
        gw_com_module.eventBind(args);
        //----------
        var args = { targetid: "grdData_코드", grid: true, event: "itemchanged", handler: processItemchanged };
        gw_com_module.eventBind(args);
        //----------

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_lyrMenu_조회() {

            var args = {
                target: [
                    { id: "frmOption", focus: true }
                ]
            };
            gw_com_module.objToggle(args);

        }
        //----------
        function click_lyrMenu_추가(ui) {

            var args = {
                targetid: "grdData_코드", edit: true, updatable: true,
                data: [
                    { name: "dept_area", value: gw_com_api.getValue("frmOption", 1, "dept_area") },
                    { name: "use_yn", value: "1" }
                ]
            };
            var row = gw_com_module.gridInsert(args);

            processItemchanged({ object: args.targetid, row: row, element: "cust_cd", type: "GRID" });
        }
        //----------
        function click_lyrMenu_삭제(ui) {

            var args = { targetid: "grdData_코드", row: "selected", select: true }
            gw_com_module.gridDelete(args);

        }
        //----------
        function click_lyrMenu_저장(ui) {

            closeOption({});

            processSave({});

        }
        //----------
        function click_lyrMenu_닫기(ui) {

            checkClosable({});

        }
        //----------
        function click_frmOption_실행(ui) {

            v_global.process.handler = processRetrieve;

            if (!checkUpdatable({})) return false;

            processRetrieve({});

        }
        //----------
        function click_frmOption_취소(ui) {

            closeOption({});

        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function checkUpdatable(param) {

    closeOption({});

    var args = {
        target: [
            { type: "GRID", id: "grdData_코드" }
        ]
    };
    return gw_com_module.objUpdatable(args);

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
            { type: "FORM", id: "frmOption" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) {
        processClear({});
        return false;
    }

    var args = {
        source: {
            type: "FORM", id: "frmOption", hide: true,
            element: [
                { name: "dept_area", argument: "arg_dept_area" }
            ],
            remark: [
                { element: [{ name: "dept_area"}] }
            ]
        },
        target: [
            { type: "GRID", id: "grdData_코드", select: true }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

}
//----------
function processItemchanged(param) {

    switch(param.element) {
        case "cust_cd":
            {
                // gw_com_api.filterSelect(
                //     param.object, param.row, "cust_line",
                //     { memory: "LINE", by: [{ source: { id: param.object, row: param.row, key: param.element, grid: true } }] }, true);
            }
            break;
    }

}
//----------
function chk_model_id(param) {
    var rtn = "";
    var args = {
        request: "PAGE",
        url: "../Service/svc_Data_Retrieve_JSONs.aspx" +
                "?QRY_ID=w_iscm1090_CHK" +
                "&QRY_COLS=cnt" +
                "&CRUD=R" +
                "&arg_dept_area=" + param.dept_area + 
		"&arg_group1_cd=" + param.group1_cd + "&arg_group2_cd=" + param.group2_cd + 
		"&arg_group3_cd=" + param.group3_cd + "&arg_group4_cd=" + param.group4_cd
		 + "&arg_group5_cd=" + param.group5_cd,
        handler_success: successRequest
    };
    //=================== async : false ========================
    $.ajaxSetup({ async: false });
    //----------
    gw_com_module.callRequest(args);
    function successRequest(data) {
        rtn = data[0].DATA[0];
    }
    //----------
    $.ajaxSetup({ async: true });
    //=================== async : true ========================
    return rtn
}
//----------
function processSave(param) {

    var foo = {
        dept_area : gw_com_api.getValue("grdData_코드", "selected", "dept_area", true),
        group1_cd: gw_com_api.getValue("grdData_코드", "selected", "group1_cd", true),
        group2_cd: gw_com_api.getValue("grdData_코드", "selected", "group2_cd", true),
        group3_cd: gw_com_api.getValue("grdData_코드", "selected", "group3_cd", true),
        group4_cd: gw_com_api.getValue("grdData_코드", "selected", "group4_cd", true),
        group5_cd: gw_com_api.getValue("grdData_코드", "selected", "group5_cd", true)
    }

    if (chk_model_id(foo) > 0) {
        gw_com_api.messageBox([{ text: "이미 등록된 모델입니다." }], 300);
        return false;
    }

    var args = {
        target: [
            { type: "GRID", id: "grdData_코드" }
        ]
    };
    if (gw_com_module.objValidate(args) == false) return false;

    args.url = "COM";
    args.handler = {
        success: successSave
    };
    gw_com_module.objSave(args);

}
//----------
function processClear(param) {

    var args = {
        target: [
            {
                type: "GRID",
                id: "grdData_코드"
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
function closeOption(param) {

    gw_com_api.hide("frmOption");

}
//----------
function successSave(response, param) {

    processRetrieve({ key: response });

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
                    case gw_com_api.v_Message.msg_informSaved:
                        {
                            param.data.arg.handler(param.data.arg.response, param.data.arg.param);
                        }
                        break;
                }
            }
            break;
    }

}   
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//