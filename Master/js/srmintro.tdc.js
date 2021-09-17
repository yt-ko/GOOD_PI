//------------------------------------------
// Process about Intro Manager.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// variables.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_intro_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ready all for document.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //#region
    ready: function(argMenu) {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /*
        //----------
        if ($.browser.msie 
            && $.browser.version.slice(0,1) >= 8) {}
        else {
            if (!gw_com_api.showMessage(
                "이 사이트는 IE 8.0 이상부터 최적화되어 있습니다.\n하위 버전에서 실행할 경우 일부 UI가 제대로 보이지 않거나 오동작이 발생할 수도 있습니다.\n계속 하시겠습니까?",
                "yesno"
                ))
                return;
        }
        */
        //----------
        $.blockUI();
        //----------
        gw_com_module.v_Current.window = "IntroProcess";
        gw_com_module.v_Current.launch = "MAIN";
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // set UI.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        var args = { targetid: "frmAuth", show: true };
        gw_com_module.formTrans(args);

        var args = { targetid: "frmAuth", trans: true };
        gw_com_module.formValidator(args);

        var args = { targetid: "btnAuth", event: "click", handler: click_btnAuth };
        gw_com_module.eventBind(args);

        //var args = { targetid: "frmAuth_login_id", event: "keydown", handler: keypress_frmAuth_login };
        //gw_com_module.eventBind(args);

        var args = { targetid: "frmAuth_login_pw", event: "keydown", handler: keypress_frmAuth_login };
        gw_com_module.eventBind(args);
        
        //----------
        cookieLoad();
        //----------
        $.unblockUI();
        //----------
        gw_com_api.show("lyrMaster");
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        function keypress_frmAuth_login(param) {

            if (event.keyCode == 13)
                return click_btnAuth();

            return true;

        }

        function click_btnAuth() {
            var args = {
                targetid: "frmAuth"
            };
            if (gw_com_module.formValidate(args) == false) {
                return false;
            }

            //----------
            var query = (location.hostname.split(".")[0].toLowerCase() == "pstims" ? "SRM_AUTH" : "PLM_AUTH");
            var password = gw_com_site.encPass(gw_com_api.getValue("frmAuth", 1, "login_pw"));
            var args = {
                request: "PAGE",
                url: "../Service/svc_Auth.aspx" +
                        "?QUERY=" + query +
                        "&arg_login_id=" + gw_com_api.getValue("frmAuth", 1, "login_id") +
                        "&arg_login_pw=" + password,
                block: true,
                handler_success: successAuth,
                handler_invalid: invalidAuth
            };
            gw_com_module.callRequest(args);

            return false;
        };

        function successAuth(data) {

            cookieSave(
                $("#chkSave").attr("checked") ? gw_com_api.getValue("frmAuth", 1, "login_id") : ""
            );

            var redirect = gw_com_api.getPageParameter("REDIRECT");
            if (redirect != "")
                location.replace(redirect);
            else {
                var param = location.href.indexOf("?") >= 0 ? location.href.slice(location.href.indexOf("?") + 1, location.href.length) : "";
                location.replace(
                    "../Master/srmTDCProcess.aspx" + (param == "" ? "" : "?" + param)
                );
            }

        };

        function invalidAuth(param) {

            //window.open("/Help/LoginError.html");

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
function cookieLoad() {
    var id = cookieGet("userid");
    if (id != "" && id != undefined) {
        $("#chkSave").attr("checked", "checked");
        $("#chkSave").change();
        gw_com_api.setValue("frmAuth", 1, "login_id", id);
    }
}
//----------
function cookieSave(id) {
    cookieSet("userid", id, (id != "") ? 30 : -1);
}
//----------
function cookieGet(key) {
    var cook = document.cookie + ";";
    var idx = cook.indexOf(key, 0);
    var val = "";
    if (idx != -1) {
        cook = cook.substring(idx, cook.length);
        begin = cook.indexOf("=", 0) + 1;
        end = cook.indexOf(";", begin);
        val = unescape(cook.substring(begin, end));
    }
    return val;
}
//----------
function cookieSet(name, value, expiredays) {
    var today = new Date();
    today.setDate(today.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + today.toGMTString() + ";";
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//