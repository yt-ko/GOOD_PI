//------------------------------------------
// Process about Job Process.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var v_global = {
    event: { type: null, object: null, index: null, element: null, focus: null },
    process: { param: null, act: null, entry: null },
    system: { type: null, act: null, encrypt: {}, param: null }
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
    ready: function() {


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        v_global.process.param = gw_com_module.initPage();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set data.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        start();
        
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
    UI: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //=====================================================================================
        var args = {
            targetid: "frmAuth", type: "FREE",
            trans: true, border: true, align: "center",
            editable: { bind: "open", focus: "password", validate: true },
            content: {
                row: [
                    {
                        element: [
                            {
                                name: "name", label: { title: "ID : " },
                                editable: { type: "text", size: 12, readonly: true, validate: { rule: "required", message: "ID" } }
                            },
                            {
                                name: "password", encrypt: true, label: { title: "Password : " },
                                editable: { type: "text", size: 12, validate: { rule: "required", message: "Password" } }
                            }
                        ]
                    },
                    {
                        align: "right",
                        element: [
                            { name: "확인", value: "확인", act: true, format: { type: "button", icon: "실행" } },
                            { name: "취소", value: "취소", format: { type: "button", icon: "닫기" } }
                        ]
                    }
                ]
            }
        };
        //----------
        gw_com_module.formCreate(args);

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
    procedure: function() {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // define event.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        var args = {
            targetid: "frmAuth",
            element: "확인",
            event: "click",
            handler: click_frmAuth_확인
        };
        gw_com_module.eventBind(args);
        //----------
        var args = {
            targetid: "frmAuth",
            element: "취소",
            event: "click",
            handler: click_frmAuth_취소
        };
        gw_com_module.eventBind(args);

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // event handler.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        function click_frmAuth_확인(ui) {
        
            var args = {
                target: [
                    { type: "FORM", id: "frmAuth" }
                ]
            };
            if (gw_com_module.objValidate(args) == false) {
                return false;
            }
        
            var name = gw_com_api.getValue("frmAuth", 1, "name");
            var password = gw_com_api.getValue("frmAuth", 1, "password");
            name = (v_global.system.encrypt.name) ? gw_com_site.encPass(name) : name;
            password = (v_global.system.encrypt.password) ? gw_com_site.encPass(password) : password;
            switch (v_global.system.type) {
                case "GROUPWARE":
                    {
                        if (v_global.system.act == "AUTH") {
                            var args = {
                                request: "PAGE",
                                url: "../Service/svc_Auth_GW.aspx" +
                                        "?QUERY=gw_auth" +
                                        "&arg_login_id=" + name +
                                        "&arg_login_pw=" + password,
                                block: true,
                                handler_success: informResult
                            };
                            gw_com_module.callRequest(args);
                        }
                        else {
                            var param = "";
                            if (v_global.system.param != undefined) {
                                $.each(v_global.system.param, function(i) {
                                    param = param +
                                        ((i == 0) ? "?" : "&") + this.name + "=" + this.value;
                                });
                            }
                            var url = "http://gw.ips.co.kr/common/main/sso_erp.aspx";
                            param = param +
                                ((param == "") ? "?" : "&") +
                                "user_id=" + name +
                                "&passwd=" + password;
                            window.open(url + param, "", "");
                            closeMe();
                        }
                    }
                    break;
            }
        }
        //----------
        function click_frmAuth_취소(ui) {
        
            closeMe();
            
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // startup process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        gw_com_module.startPage();
        //----------
        var args = {
            target: [
                { id: "frmAuth", focus: true }
            ]
        };
        gw_com_module.objToggle(args);

    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// custom function. (program section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
function informResult() {

    var name = gw_com_api.getValue("frmAuth", 1, "name");
    var password = gw_com_api.getValue("frmAuth", 1, "password");
    name = (v_global.system.encrypt.name) ? gw_com_site.encPass(name) : name;
    password = (v_global.system.encrypt.password) ? gw_com_site.encPass(password) : password;
    var args = {
        ID: gw_com_api.v_Stream.msg_authedSystem,
        data: {
            name: name,
            password: password,
            param: v_global.system.param
        }
    };
    gw_com_module.streamInterface(args);

}
//----------
function closeMe() {

    gw_com_api.setValue("frmAuth", 1, "password", "");
    var args = {
        ID: gw_com_api.v_Stream.msg_closeDialogue
    };
    gw_com_module.streamInterface(args);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function(param) {

    switch (param.ID) {
        case gw_com_api.v_Stream.msg_authSystem:
            {
                v_global.system.type = param.data.system;
                v_global.system.act = "AUTH";
                if (param.data.name != undefined)
                    gw_com_api.setValue("frmAuth", 1, "name", param.data.name);
                gw_com_api.setValue("frmAuth", 1, "password", "");
                if (param.data.encrypt != undefined)
                    v_global.system.encrypt = param.data.encrypt;
                if (param.data.param != undefined)
                    v_global.system.param = param.data.param;
            }
            break;
        case gw_com_api.v_Stream.msg_interfaceSystem:
            {
                v_global.system.type = param.data.system;
                v_global.system.act = "IF";
                if (param.data.name != undefined)
                    gw_com_api.setValue("frmAuth", 1, "name", param.data.name);
                if (param.data.encrypt != undefined)
                    v_global.system.encrypt = param.data.encrypt;
                if (param.data.param != undefined)
                    v_global.system.param = param.data.param;
            }
            break;
    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//