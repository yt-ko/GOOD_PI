//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
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
        gw_com_api.changeTheme("style_theme");

        v_global.logic.key = gw_com_api.getPageParameter("key");
 
        start();

        //----------
        function start() {

            gw_job_process.UI();
            gw_job_process.procedure();

            var args = { targetid: "lyrNotice", row: [{ name: "msg_top" }] };
            gw_com_module.labelCreate(args);
            var args = { targetid: "lyrNotice", row: [{ name: "msg_top", value: "▶ " + "(주)원익아이피에스에 기술자료 제공에 동의합니다." }] };
            gw_com_module.labelAssign(args);    //"◈"

            gw_com_module.startPage();
            
            //var args = {
            //    ID: gw_com_api.v_Stream.msg_openedDialogue
            //};
            //gw_com_module.streamInterface(args);

        }

    },

    // manage UI. (design section)
    UI: function () {

        //=====================================================================================
        var args = {
            targetid: "lyrMenu", type: "FREE",
            element: [
				{ name: "btnOk", value: "확인", icon: "저장", act: true },
				//{ name: "btnLink", value: "요청서", icon: "기타", act: true },
				{ name: "btnClose", value: "닫기", icon: "닫기" }
			]
        };
        gw_com_module.buttonMenu(args);
        if (v_global.logic.agree_yn != "Y")
            gw_com_api.hide("lyrMenu", "btnOk");

        //=====================================================================================
        var args = {
            targetid: "frmData_Main", query: "TDR_NcrAgree_Main", type: "TABLE", title: "NCR 기술자료 내역",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" },
                height: 120,
                row: [
                    {
                        element: [
                            { name: "memo_text", format: { type: "html", height: 120 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_Sub", query: "TDR_NcrAgree_Main", type: "TABLE", title: "요청 내역 상세",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" },
                height: 200,
                row: [
                    {
                        element: [
                            { name: "memo_text", format: { type: "html", height: 200 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MemoA", query: "TDR_NcrAgree_Main", type: "TABLE", title: "권리귀속 및 사용범위",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" },
                height: 80,
                row: [
                    {
                        element: [
                            { name: "memo_text", format: { type: "html", height: 80 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);
        //=====================================================================================
        var args = {
            targetid: "frmData_MemoB", query: "TDR_NcrAgree_Main", type: "TABLE", title: "비밀유지",
            caption: true, width: "100%", show: true, selectable: true,
            content: {
                width: { field: "100%" },
                height: 80,
                row: [
                    {
                        element: [
                            { name: "memo_text", format: { type: "html", height: 80 } }
                        ]
                    }
                ]
            }
        };
        gw_com_module.formCreate(args);

        //=====================================================================================
        var args = { targetid: "lyrDown", width: 0, height: 0, show: false };
        gw_com_module.pageCreate(args);
        //=====================================================================================
        var args = {
            target: [
				{ type: "GRID", id: "frmData_Main", offset: 8 },
				{ type: "GRID", id: "frmData_Sub", offset: 8 }
			]
        };
        gw_com_module.objResize(args);
        gw_com_module.informSize();

    },

    // manage process. (program section)
    procedure: function () {

        //----------
        var args = { targetid: "lyrMenu", element: "btnOk", event: "click", handler: processOk };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnLink", event: "click", handler: processLink };
        gw_com_module.eventBind(args);
        var args = { targetid: "lyrMenu", element: "btnClose", event: "click", handler: processClose };
        gw_com_module.eventBind(args);

    }

};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
function processRetrieve(param) {
    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_field", value: "View1" },
                { name: "arg_key_no", value: param.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Main", select: true }
        ],
        //clear: [
        //    { type: "FORM", id: "frmData_공지내용" }
        //],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

    var args = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_field", value: "View2" },
                { name: "arg_key_no", value: v_global.logic.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_Sub" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args);

    var args1 = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_field", value: "Agree1" },
                { name: "arg_key_no", value: v_global.logic.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MemoA" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args1);

    var args2 = {
        source: {
            type: "INLINE",
            argument: [
                { name: "arg_field", value: "Agree2" },
                { name: "arg_key_no", value: v_global.logic.key },
                { name: "arg_user_id", value: gw_com_module.v_Session.USR_ID }
            ]
        },
        target: [
            { type: "FORM", id: "frmData_MemoB" }
        ],
        key: param.key
    };
    gw_com_module.objRetrieve(args2);

}
//----------
function processLink(param) {



}
//----------
function processOk(param) {

    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue,
        data: { IsAgree: true }
    };
    gw_com_module.streamInterface(args);

}
//----------
function processClose(param) {

    if (gw_com_module.v_Current.launch == "CHILD") {

        var args = { ID: gw_com_api.v_Stream.msg_closePage };
        gw_com_module.streamInterface(args);

    } else if (gw_com_module.v_Current.launch == "POPUP") {

    var args = {
            ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

    } else {

        top.window.close();

    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//----------
streamProcess = function (param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_openDialogue:
            if (param.data != undefined) {
                if (param.data.chk_agree == true) {
                    v_global.logic.chk_agree = true;
                    gw_com_api.show("lyrMenu", "btnOk");
                    gw_com_api.show("lyrNotice", "msg_top");
                }
                else {
                    v_global.logic.chk_agree = false;
                    gw_com_api.hide("lyrMenu", "btnOk");
                    gw_com_api.hide("lyrNotice", "msg_top");
                }
                if (param.data.rqst_no != undefined) {
                    v_global.logic.key = param.data.rqst_no;
                    processRetrieve({ key: v_global.logic.key });
                }
            }
            break;
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//