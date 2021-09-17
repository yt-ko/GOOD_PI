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
    ready: function (argMenu) {

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // initialize page.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gw_com_module.v_Current.window = "LoginProcess";
        //gw_com_module.v_Current.launch = "MAIN";

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
            var password = gw_com_site.encPass(gw_com_api.getValue("frmAuth", 1, "login_pw"));
            var args = {
                request: "PAGE",
                url: "../Service/svc_Auth.aspx" +
                "?QUERY=PLM_AUTH" +
                "&arg_login_id=" + gw_com_api.getValue("frmAuth", 1, "login_id") +
                "&arg_login_pw=" + password,
                block: true,
                handler_success: successAuth
            };
            gw_com_module.callRequest(args);

            return false;

        };

        function successAuth(data) {

            cookieSave(
                $("#chkSave").attr("checked") ? gw_com_api.getValue("frmAuth", 1, "login_id") : ""
            );
            //----------
            $("#frmAuth_login_pw").blur();
            $("#frmAuth_login_id").blur();
            //----------
            var args = {
                ID: gw_com_api.v_Stream.msg_closeDialogue
            };
            gw_com_module.streamInterface(args);
            //----------
            var args = {
                target: [
                    { type: "FORM", id: "frmAuth" }
                ]
            };
            gw_com_module.objClear(args);
            //----------

        };

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
        //gw_com_api.setFocus("frmAuth", 1, "login_pw");
        $("frmAuth_login_pw").focus();
    } else {
        gw_com_api.setFocus("frmAuth", 1, "login_id");
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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// stream handler. (network section)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//----------
streamProcess = function (param) {

    cookieLoad();

};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//