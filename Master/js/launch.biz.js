//------------------------------------------
// Process about Intro Manager.
//                Created by Professor.X, GoodWare (2011.03.03)
//------------------------------------------

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// process.
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gw_launch_process = {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ready all for document.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ready: function (argMenu) {

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
        gw_com_module.v_Current.window = "GoodPLM";
        gw_com_module.v_Current.launch = "MAIN";

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // process.
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        //----------
        //var password = hex_md5(gw_com_api.getPageParameter("passwd"));
        var app = gw_com_api.getPageParameter("app");
        if (app == "") site = "pi";
        var qry = (app == "srm") ? "SRM_AUTH" : "PLM_AUTH";
        var password = gw_com_api.getPageParameter("passwd");
        var args = {
            request: "PAGE",
            url: "../Service/svc_Auth.aspx" +
                    "?QUERY=" + qry +
                    "&arg_login_id=" + gw_com_api.getPageParameter("user_id") +
                    "&arg_login_pw=" + password,
            block: true,
            handler_success: successAuth,
            handler_invalid: invalidAuth
        };
        gw_com_module.callRequest(args);

        function successAuth(data) {
            if (app == "srm")
                location.replace("../Master/SRMProcess.aspx");
            else
                location.replace("../Master/BizProcess.aspx");
        };

        function invalidAuth(data) {

            window.opener = 'nothing';
            window.open('', '_parent', '');
            self.close();
        };

    }

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//