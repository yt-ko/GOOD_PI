//------------------------------------------
// API about Common DX Processing.
//                Created by Professor.X, GoodWare (2011.04)
//------------------------------------------

var gw_com_DX = {

    // variable.
    
    // virtual register.
    //#region
    register: function(args) {

        if(document.body.childNodes[0].nodeName == "DIV")
            $(document.body.childNodes[0]).remove();

    },
    //#endregion

    // htmlchanged process.
    //#region
    event_htmlchanged: function(args) {

        var crud = "#" + gw_com_module.v_Control[args.name].parent + "_CRUD";
        if ($(crud).val() == "R") {
            $(crud).val("U");
        }

    },
    //#endregion

    event_fileuploadstart: function(args) {
        var data = args.callbackData.split('@');
    },
    
    // uploade. (file)
    //#region
    event_fileuploadcomplete: function(args) {

        $.unblockUI();
        if (args.errorText != "") {
            alert(args.errorText);
            if (args.handler_error != undefined)
                args.handler_error();
            return;
        }
        if (args.handler_success != undefined) {
            var param = {};
            if (args.callbackData != null) {
                // 임시
                if (args.callbackData.substring(0, 1) == "{") {
                    param = JSON.parse(args.callbackData);
                } else {
                    var data = args.callbackData.split('@');
                    param = {
                        id: data[0],
                        file: data[1],
                        ext: data[2],
                        path: data[3],
                        option: data[4]
                    };
                }
            }
            args.handler_success(param);
        }
            
    }
    //#endregion

};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//